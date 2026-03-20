# Pertanyaan yang Sering Diajukan {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Pertanyaan yang sering diajukan tentang Forward Email" class="rounded-lg" />


## Daftar Isi {#table-of-contents}

* [Mulai Cepat](#quick-start)
* [Pengenalan](#introduction)
  * [Apa itu Forward Email](#what-is-forward-email)
  * [Siapa yang menggunakan Forward Email](#who-uses-forward-email)
  * [Apa sejarah Forward Email](#what-is-forward-emails-history)
  * [Seberapa cepat layanan ini](#how-fast-is-this-service)
* [Klien Email](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [Perangkat Mobile](#mobile-devices)
  * [Konfigurasi Sendmail SMTP Relay](#sendmail-smtp-relay-configuration)
  * [Konfigurasi Exim4 SMTP Relay](#exim4-smtp-relay-configuration)
  * [Konfigurasi msmtp SMTP Client](#msmtp-smtp-client-configuration)
  * [Klien Email Baris Perintah](#command-line-email-clients)
  * [Konfigurasi Email Windows](#windows-email-configuration)
  * [Konfigurasi Postfix SMTP Relay](#postfix-smtp-relay-configuration)
  * [Cara Mengirim Email Sebagai menggunakan Gmail](#how-to-send-mail-as-using-gmail)
  * [Apa panduan gratis legacy untuk Send Mail As menggunakan Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Konfigurasi Routing Gmail Lanjutan](#advanced-gmail-routing-configuration)
  * [Konfigurasi Routing Outlook Lanjutan](#advanced-outlook-routing-configuration)
* [Pemecahan Masalah](#troubleshooting)
  * [Mengapa saya tidak menerima email tes saya](#why-am-i-not-receiving-my-test-emails)
  * [Bagaimana cara mengonfigurasi klien email saya agar bekerja dengan Forward Email](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Mengapa email saya masuk ke Spam dan Junk dan bagaimana saya dapat memeriksa reputasi domain saya](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Apa yang harus saya lakukan jika menerima email spam](#what-should-i-do-if-i-receive-spam-emails)
  * [Mengapa email tes yang saya kirim ke diri saya sendiri di Gmail menunjukkan sebagai "mencurigakan"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Bisakah saya menghapus via forwardemail dot net di Gmail](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Manajemen Data](#data-management)
  * [Di mana server Anda berada](#where-are-your-servers-located)
  * [Bagaimana cara mengekspor dan mencadangkan kotak surat saya](#how-do-i-export-and-backup-my-mailbox)
  * [Bagaimana cara mengimpor dan memigrasi kotak surat saya yang sudah ada](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Bagaimana cara menggunakan penyimpanan kompatibel S3 saya sendiri untuk cadangan](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [Bagaimana cara mengonversi cadangan SQLite ke file EML](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [Apakah Anda mendukung self-hosting](#do-you-support-self-hosting)
* [Konfigurasi Email](#email-configuration)
  * [Bagaimana cara memulai dan mengatur penerusan email](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Bisakah saya menggunakan beberapa pertukaran MX dan server untuk penerusan lanjutan](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Bagaimana cara mengatur penjawab liburan (auto-responder keluar kantor)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Bagaimana cara mengatur SPF untuk Forward Email](#how-do-i-set-up-spf-for-forward-email)
  * [Bagaimana cara mengatur DKIM untuk Forward Email](#how-do-i-set-up-dkim-for-forward-email)
  * [Bagaimana cara mengatur DMARC untuk Forward Email](#how-do-i-set-up-dmarc-for-forward-email)
  * [Bagaimana cara melihat Laporan DMARC](#how-do-i-view-dmarc-reports)
  * [Bagaimana cara menghubungkan dan mengonfigurasi kontak saya](#how-do-i-connect-and-configure-my-contacts)
  * [Bagaimana cara menghubungkan dan mengonfigurasi kalender saya](#how-do-i-connect-and-configure-my-calendars)
  * [Bagaimana cara menambahkan lebih banyak kalender dan mengelola kalender yang ada](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Bagaimana cara menghubungkan dan mengonfigurasi tugas dan pengingat](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [Mengapa saya tidak bisa membuat tugas di macOS Reminders](#why-cant-i-create-tasks-in-macos-reminders)
  * [Bagaimana cara mengatur Tasks.org di Android](#how-do-i-set-up-tasksorg-on-android)
  * [Bagaimana cara mengatur SRS untuk Forward Email](#how-do-i-set-up-srs-for-forward-email)
  * [Bagaimana cara mengatur MTA-STS untuk Forward Email](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Bagaimana cara menambahkan foto profil ke alamat email saya](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Fitur Lanjutan](#advanced-features)
  * [Apakah Anda mendukung newsletter atau daftar mailing untuk email terkait pemasaran](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Apakah Anda mendukung pengiriman email dengan API](#do-you-support-sending-email-with-api)
  * [Apakah Anda mendukung penerimaan email dengan IMAP](#do-you-support-receiving-email-with-imap)
  * [Apakah Anda mendukung POP3](#do-you-support-pop3)
  * [Apakah Anda mendukung kalender (CalDAV)](#do-you-support-calendars-caldav)
  * [Apakah Anda mendukung tugas dan pengingat (CalDAV VTODO)](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [Apakah Anda mendukung kontak (CardDAV)](#do-you-support-contacts-carddav)
  * [Apakah Anda mendukung pengiriman email dengan SMTP](#do-you-support-sending-email-with-smtp)
  * [Apakah Anda mendukung OpenPGP/MIME, enkripsi end-to-end ("E2EE"), dan Web Key Directory ("WKD")](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Apakah Anda mendukung enkripsi S/MIME](#do-you-support-smime-encryption)
  * [Apakah Anda mendukung penyaringan email Sieve](#do-you-support-sieve-email-filtering)
  * [Apakah Anda mendukung MTA-STS](#do-you-support-mta-sts)
  * [Apakah Anda mendukung passkeys dan WebAuthn](#do-you-support-passkeys-and-webauthn)
  * [Apakah Anda mendukung praktik terbaik email](#do-you-support-email-best-practices)
  * [Apakah Anda mendukung webhook bounce](#do-you-support-bounce-webhooks)
  * [Apakah Anda mendukung webhook](#do-you-support-webhooks)
  * [Apakah Anda mendukung ekspresi reguler atau regex](#do-you-support-regular-expressions-or-regex)
  * [Apa batas SMTP keluar Anda](#what-are-your-outbound-smtp-limits)
  * [Apakah saya perlu persetujuan untuk mengaktifkan SMTP](#do-i-need-approval-to-enable-smtp)
  * [Apa pengaturan konfigurasi server SMTP Anda](#what-are-your-smtp-server-configuration-settings)
  * [Apa pengaturan konfigurasi server IMAP Anda](#what-are-your-imap-server-configuration-settings)
  * [Apa pengaturan konfigurasi server POP3 Anda](#what-are-your-pop3-server-configuration-settings)
  * [Bagaimana cara mengatur autodiscovery email untuk domain saya](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [Keamanan](#security-1)
  * [Teknik Penguatan Server Lanjutan](#advanced-server-hardening-techniques)
  * [Apakah Anda memiliki sertifikasi SOC 2 atau ISO 27001](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Apakah Anda menggunakan enkripsi TLS untuk penerusan email](#do-you-use-tls-encryption-for-email-forwarding)
  * [Apakah Anda mempertahankan header otentikasi email](#do-you-preserve-email-authentication-headers)
  * [Apakah Anda mempertahankan header email asli dan mencegah spoofing](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Bagaimana Anda melindungi dari spam dan penyalahgunaan](#how-do-you-protect-against-spam-and-abuse)
  * [Apakah Anda menyimpan konten email di disk](#do-you-store-email-content-on-disk)
  * [Bisakah konten email terekspos selama kerusakan sistem](#can-email-content-be-exposed-during-system-crashes)
  * [Siapa yang memiliki akses ke infrastruktur email Anda](#who-has-access-to-your-email-infrastructure)
  * [Penyedia infrastruktur apa yang Anda gunakan](#what-infrastructure-providers-do-you-use)
  * [Apakah Anda menawarkan Perjanjian Pemrosesan Data (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [Bagaimana Anda menangani pemberitahuan pelanggaran data](#how-do-you-handle-data-breach-notifications)
  * [Apakah Anda menawarkan lingkungan pengujian](#do-you-offer-a-test-environment)
  * [Apakah Anda menyediakan alat pemantauan dan peringatan](#do-you-provide-monitoring-and-alerting-tools)
  * [Bagaimana Anda memastikan ketersediaan tinggi](#how-do-you-ensure-high-availability)
  * [Apakah Anda mematuhi Bagian 889 dari Undang-Undang Otorisasi Pertahanan Nasional (NDAA)](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Detail Sistem dan Teknis](#system-and-technical-details)
  * [Apakah Anda menyimpan email dan isinya](#do-you-store-emails-and-their-contents)
  * [Bagaimana sistem penerusan email Anda bekerja](#how-does-your-email-forwarding-system-work)
  * [Bagaimana Anda memproses email untuk diteruskan](#how-do-you-process-an-email-for-forwarding)
  * [Bagaimana Anda menangani masalah pengiriman email](#how-do-you-handle-email-delivery-issues)
  * [Bagaimana Anda menangani alamat IP Anda yang diblokir](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Apa itu alamat postmaster](#what-are-postmaster-addresses)
  * [Apa itu alamat no-reply](#what-are-no-reply-addresses)
  * [Apa alamat IP server Anda](#what-are-your-servers-ip-addresses)
  * [Apakah Anda memiliki daftar izinkan (allowlist)](#do-you-have-an-allowlist)
  * [Ekstensi nama domain apa yang diizinkan secara default](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Apa kriteria daftar izinkan Anda](#what-is-your-allowlist-criteria)
  * [Ekstensi nama domain apa yang dapat digunakan secara gratis](#what-domain-name-extensions-can-be-used-for-free)
  * [Apakah Anda memiliki daftar abu-abu (greylist)](#do-you-have-a-greylist)
  * [Apakah Anda memiliki daftar tolak (denylist)](#do-you-have-a-denylist)
  * [Apakah Anda memiliki pembatasan laju (rate limiting)](#do-you-have-rate-limiting)
  * [Bagaimana Anda melindungi dari backscatter](#how-do-you-protect-against-backscatter)
  * [Mencegah bounce dari pengirim MAIL FROM yang dikenal spammer](#prevent-bounces-from-known-mail-from-spammers)
  * [Mencegah bounce yang tidak perlu untuk melindungi dari backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Bagaimana Anda menentukan sidik jari email](#how-do-you-determine-an-email-fingerprint)
  * [Bisakah saya meneruskan email ke port selain 25 (misalnya jika ISP saya memblokir port 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Apakah mendukung simbol plus + untuk alias Gmail](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Apakah mendukung sub-domain](#does-it-support-sub-domains)
  * [Apakah ini meneruskan header email saya](#does-this-forward-my-emails-headers)
  * [Apakah ini sudah diuji dengan baik](#is-this-well-tested)
  * [Apakah Anda meneruskan pesan dan kode respons SMTP](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Bagaimana Anda mencegah spammer dan memastikan reputasi penerusan email yang baik](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Bagaimana Anda melakukan pencarian DNS pada nama domain](#how-do-you-perform-dns-lookups-on-domain-names)
* [Akun dan Penagihan](#account-and-billing)
  * [Apakah Anda menawarkan jaminan uang kembali pada paket berbayar](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Jika saya mengganti paket, apakah Anda melakukan prorata dan mengembalikan selisihnya](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Bisakah saya hanya menggunakan layanan penerusan email ini sebagai server MX "fallback" atau "fallover"]( #can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Bisakah saya menonaktifkan alias tertentu](#can-i-disable-specific-aliases)
  * [Bisakah saya meneruskan email ke beberapa penerima](#can-i-forward-emails-to-multiple-recipients)
  * [Bisakah saya memiliki beberapa penerima global catch-all](#can-i-have-multiple-global-catch-all-recipients)
  * [Apakah ada batas maksimum jumlah alamat email yang dapat saya teruskan per alias](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Bisakah saya meneruskan email secara rekursif](#can-i-recursively-forward-emails)
  * [Bisakah orang membatalkan pendaftaran atau mendaftar penerusan email saya tanpa izin saya](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Bagaimana ini bisa gratis](#how-is-it-free)
  * [Berapa batas ukuran email maksimum](#what-is-the-max-email-size-limit)
  * [Apakah Anda menyimpan log email](#do-you-store-logs-of-emails)
  * [Apakah Anda menyimpan log kesalahan](#do-you-store-error-logs)
  * [Apakah Anda membaca email saya](#do-you-read-my-emails)
  * [Bisakah saya "mengirim email sebagai" di Gmail dengan ini](#can-i-send-mail-as-in-gmail-with-this)
  * [Bisakah saya "mengirim email sebagai" di Outlook dengan ini](#can-i-send-mail-as-in-outlook-with-this)
  * [Bisakah saya "mengirim email sebagai" di Apple Mail dan iCloud Mail dengan ini](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Bisakah saya meneruskan email tanpa batas dengan ini](#can-i-forward-unlimited-emails-with-this)
  * [Apakah Anda menawarkan domain tanpa batas dengan satu harga](#do-you-offer-unlimited-domains-for-one-price)
  * [Metode pembayaran apa yang Anda terima](#which-payment-methods-do-you-accept)
* [Sumber Daya Tambahan](#additional-resources)
## Memulai Cepat {#quick-start}

Untuk memulai dengan Forward Email:

1. **Buat akun** di [forwardemail.net/register](https://forwardemail.net/register)

2. **Tambahkan dan verifikasi domain Anda** di bawah [Akun Saya → Domain](/my-account/domains)

3. **Tambahkan dan konfigurasikan alias/kotak surat email** di bawah [Akun Saya → Domain](/my-account/domains) → Alias

4. **Uji pengaturan Anda** dengan mengirim email ke salah satu alias baru Anda

> \[!TIP]
> Perubahan DNS dapat memakan waktu hingga 24-48 jam untuk menyebar secara global, meskipun seringkali berlaku jauh lebih cepat.

> \[!IMPORTANT]
> Untuk meningkatkan keterkiriman, kami menyarankan untuk mengatur [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), dan [DMARC](#how-do-i-set-up-dmarc-for-forward-email) record.


## Pengenalan {#introduction}

### Apa itu Forward Email {#what-is-forward-email}

> \[!NOTE]
> Forward Email sangat cocok untuk individu, bisnis kecil, dan pengembang yang menginginkan alamat email profesional tanpa biaya dan pemeliharaan solusi hosting email penuh.

Forward Email adalah **penyedia layanan email dengan fitur lengkap** dan **penyedia hosting email untuk nama domain khusus**.

Ini adalah satu-satunya layanan gratis dan sumber terbuka, dan memungkinkan Anda menggunakan alamat email domain khusus tanpa kerumitan mengatur dan memelihara server email sendiri.

Layanan kami meneruskan email yang dikirim ke domain khusus Anda ke akun email yang sudah ada – dan Anda bahkan dapat menggunakan kami sebagai penyedia hosting email khusus Anda.

Fitur utama Forward Email:

* **Email Domain Khusus**: Gunakan alamat email profesional dengan nama domain Anda sendiri
* **Tingkat Gratis**: Penerusan email dasar tanpa biaya
* **Privasi Ditingkatkan**: Kami tidak membaca email Anda atau menjual data Anda
* **Sumber Terbuka**: Seluruh kode kami tersedia di GitHub
* **Dukungan SMTP, IMAP, dan POP3**: Kemampuan penuh mengirim dan menerima email
* **Enkripsi End-to-End**: Dukungan untuk OpenPGP/MIME
* **Alias Catch-All Kustom**: Buat alias email tanpa batas

Anda dapat membandingkan kami dengan lebih dari 56 penyedia layanan email lainnya di [halaman Perbandingan Email kami](/blog/best-email-service).

> \[!TIP]
> Pelajari lebih lanjut tentang Forward Email dengan membaca [Whitepaper Teknis](/technical-whitepaper.pdf) gratis kami

### Siapa yang menggunakan Forward Email {#who-uses-forward-email}

Kami menyediakan layanan hosting email dan penerusan email untuk lebih dari 500.000 domain dan pengguna terkenal berikut:

| Pelanggan                               | Studi Kasus                                                                                              |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Akademi Angkatan Laut AS                | [:page_facing_up: Studi Kasus](/blog/docs/federal-government-email-service-section-889-compliant)       |
| Canonical                              | [:page_facing_up: Studi Kasus](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                 |
| Netflix Games                          |                                                                                                          |
| The Linux Foundation                   | [:page_facing_up: Studi Kasus](/blog/docs/linux-foundation-email-enterprise-case-study)                 |
| The PHP Foundation                     |                                                                                                          |
| Fox News Radio                        |                                                                                                          |
| Disney Ad Sales                      |                                                                                                          |
| jQuery                                 | [:page_facing_up: Studi Kasus](/blog/docs/linux-foundation-email-enterprise-case-study)                 |
| LineageOS                            |                                                                                                          |
| Ubuntu                               | [:page_facing_up: Studi Kasus](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                 |
| Kubuntu                              | [:page_facing_up: Studi Kasus](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                 |
| Lubuntu                              | [:page_facing_up: Studi Kasus](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                 |
| Universitas Cambridge                 | [:page_facing_up: Studi Kasus](/blog/docs/alumni-email-forwarding-university-case-study)                |
| Universitas Maryland                  | [:page_facing_up: Studi Kasus](/blog/docs/alumni-email-forwarding-university-case-study)                |
| Universitas Washington                | [:page_facing_up: Studi Kasus](/blog/docs/alumni-email-forwarding-university-case-study)                |
| Universitas Tufts                    | [:page_facing_up: Studi Kasus](/blog/docs/alumni-email-forwarding-university-case-study)                |
| Swarthmore College                   | [:page_facing_up: Studi Kasus](/blog/docs/alumni-email-forwarding-university-case-study)                |
| Pemerintah Australia Selatan         |                                                                                                          |
| Pemerintah Republik Dominika         |                                                                                                          |
| Fly<span>.</span>io                  |                                                                                                          |
| RCD Hotels                          |                                                                                                          |
| Isaac Z. Schlueter (npm)             | [:page_facing_up: Studi Kasus](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |                                                                                                          |
### Apa sejarah Forward Email {#what-is-forward-emails-history}

Anda dapat mempelajari lebih lanjut tentang Forward Email di [halaman Tentang kami](/about).

### Seberapa cepat layanan ini {#how-fast-is-this-service}

> \[!NOTE]
> Sistem kami dirancang untuk kecepatan dan keandalan, dengan beberapa server redundan untuk memastikan email Anda dikirimkan dengan cepat.

Forward Email mengirimkan pesan dengan penundaan minimal, biasanya dalam hitungan detik setelah diterima.

Metrik kinerja:

* **Waktu Pengiriman Rata-rata**: Kurang dari 5-10 detik dari penerimaan hingga penerusan ([lihat halaman pemantauan Waktu ke Kotak Masuk "TTI"](/tti))
* **Waktu Aktif**: Ketersediaan layanan 99,9%+
* **Infrastruktur Global**: Server ditempatkan secara strategis untuk routing optimal
* **Skalabilitas Otomatis**: Sistem kami meningkat selama periode puncak email

Kami beroperasi secara real-time, tidak seperti penyedia lain yang mengandalkan antrean tertunda.

Kami tidak menulis ke disk atau menyimpan log – dengan [pengecualian kesalahan](#do-you-store-error-logs) dan [SMTP keluar](#do-you-support-sending-email-with-smtp) (lihat [Kebijakan Privasi kami](/privacy)).

Semua dilakukan di memori dan [kode sumber kami ada di GitHub](https://github.com/forwardemail).


## Klien Email {#email-clients}

### Thunderbird {#thunderbird}

1. Buat alias baru dan buat kata sandi di dashboard Forward Email Anda
2. Buka Thunderbird dan pergi ke **Edit → Pengaturan Akun → Tindakan Akun → Tambah Akun Email**
3. Masukkan nama Anda, alamat Forward Email, dan kata sandi
4. Klik **Konfigurasi manual** dan masukkan:
   * Masuk: IMAP, `imap.forwardemail.net`, port 993, SSL/TLS
   * Keluar: SMTP, `smtp.forwardemail.net`, port 465, SSL/TLS (direkomendasikan; port 587 dengan STARTTLS juga didukung)
5. Klik **Selesai**

### Microsoft Outlook {#microsoft-outlook}

1. Buat alias baru dan buat kata sandi di dashboard Forward Email Anda
2. Pergi ke **File → Tambah Akun**
3. Masukkan alamat Forward Email Anda dan klik **Hubungkan**
4. Pilih **Opsi lanjutan** dan pilih **Izinkan saya mengatur akun secara manual**
5. Pilih **IMAP** dan masukkan:
   * Masuk: `imap.forwardemail.net`, port 993, SSL
   * Keluar: `smtp.forwardemail.net`, port 465, SSL/TLS (direkomendasikan; port 587 dengan STARTTLS juga didukung)
   * Nama pengguna: Alamat email lengkap Anda
   * Kata sandi: Kata sandi yang Anda buat
6. Klik **Hubungkan**

### Apple Mail {#apple-mail}

1. Buat alias baru dan buat kata sandi di dashboard Forward Email Anda
2. Pergi ke **Mail → Preferensi → Akun → +**
3. Pilih **Akun Mail Lainnya**
4. Masukkan nama Anda, alamat Forward Email, dan kata sandi
5. Untuk pengaturan server, masukkan:
   * Masuk: `imap.forwardemail.net`
   * Keluar: `smtp.forwardemail.net`
   * Nama pengguna: Alamat email lengkap Anda
   * Kata sandi: Kata sandi yang Anda buat
6. Klik **Masuk**

### eM Client {#em-client}

1. Buat alias baru dan buat kata sandi di dashboard Forward Email Anda
2. Buka eM Client dan pergi ke **Menu → Akun → + Tambah Akun**
3. Klik pada **Mail** lalu pilih **Lainnya**
4. Masukkan alamat Forward Email Anda dan klik **Berikutnya**
5. Masukkan pengaturan server berikut:
   * **Server masuk**: `imap.forwardemail.net`
   * **Server keluar**: `smtp.forwardemail.net`
6. Masukkan alamat email lengkap Anda sebagai **Nama pengguna** dan kata sandi yang Anda buat sebagai **Kata sandi** untuk server masuk dan keluar.
7. eM Client akan menguji koneksi. Setelah berhasil, klik **Berikutnya**.
8. Masukkan nama Anda dan pilih nama akun.
9. Klik **Selesai**.

### Perangkat Mobile {#mobile-devices}

Untuk iOS:

1. Pergi ke **Pengaturan → Mail → Akun → Tambah Akun → Lainnya**
2. Ketuk **Tambah Akun Mail** dan masukkan detail Anda
3. Untuk pengaturan server, gunakan pengaturan IMAP dan SMTP yang sama seperti di atas

Untuk Android:

1. Pergi ke **Pengaturan → Akun → Tambah Akun → Pribadi (IMAP)**
2. Masukkan alamat Forward Email dan kata sandi Anda
3. Untuk pengaturan server, gunakan pengaturan IMAP dan SMTP yang sama seperti di atas

### Konfigurasi Relay SMTP Sendmail {#sendmail-smtp-relay-configuration}

Anda dapat mengonfigurasi Sendmail untuk merelay email melalui server SMTP Forward Email. Ini adalah pengaturan umum untuk sistem lama atau aplikasi yang mengandalkan Sendmail.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Perkiraan Waktu Pengaturan:</strong>
  <span>Kurang dari 20 menit</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Penting:
  </strong>
  <span>
    Ini memerlukan paket berbayar dengan akses SMTP diaktifkan.
  </span>
</div>

#### Konfigurasi {#configuration}

1. Edit file `sendmail.mc` Anda, biasanya terletak di `/etc/mail/sendmail.mc`:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. Tambahkan baris berikut untuk mendefinisikan smart host dan autentikasi:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. Buat file autentikasi `/etc/mail/authinfo`:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. Tambahkan kredensial Forward Email Anda ke file `authinfo`:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. Buat database autentikasi dan amankan file-file tersebut:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. Bangun ulang konfigurasi Sendmail dan restart layanan:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### Pengujian {#testing}

Kirim email uji untuk memverifikasi konfigurasi:

```bash
echo "Test email from Sendmail" | mail -s "Sendmail Test" recipient@example.com
```

### Konfigurasi Exim4 SMTP Relay {#exim4-smtp-relay-configuration}

Exim4 adalah MTA populer pada sistem berbasis Debian. Anda dapat mengonfigurasinya untuk menggunakan Forward Email sebagai smarthost.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Perkiraan Waktu Pengaturan:</strong>
  <span>Kurang dari 15 menit</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Penting:
  </strong>
  <span>
    Ini memerlukan paket berbayar dengan akses SMTP diaktifkan.
  </span>
</div>

#### Konfigurasi {#configuration-1}

1. Jalankan alat konfigurasi Exim4:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. Pilih opsi berikut:
   * **Jenis konfigurasi mail umum:** mail dikirim oleh smarthost; diterima via SMTP atau fetchmail
   * **Nama mail sistem:** your.hostname
   * **Alamat IP untuk mendengarkan koneksi SMTP masuk:** 127.0.0.1 ; ::1
   * **Tujuan lain yang menerima mail:** (kosongkan)
   * **Domain untuk relay mail:** (kosongkan)
   * **Alamat IP atau nama host smarthost keluar:** smtp.forwardemail.net::465
   * **Sembunyikan nama mail lokal di mail keluar?** Tidak
   * **Minimalisasi jumlah query DNS (Dial-on-Demand)?** Tidak
   * **Metode pengiriman untuk mail lokal:** format Mbox di /var/mail/
   * **Pisahkan konfigurasi menjadi file kecil?** Tidak

3. Edit file `passwd.client` untuk menambahkan kredensial Anda:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. Tambahkan baris berikut:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. Perbarui konfigurasi dan restart Exim4:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### Pengujian {#testing-1}

Kirim email uji:

```bash
echo "Test from Exim4" | mail -s "Exim4 Test" recipient@example.com
```

### Konfigurasi Klien SMTP msmtp {#msmtp-smtp-client-configuration}

msmtp adalah klien SMTP ringan yang berguna untuk mengirim email dari skrip atau aplikasi baris perintah.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Perkiraan Waktu Pengaturan:</strong>
  <span>Kurang dari 10 menit</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Penting:
  </strong>
  <span>
    Ini memerlukan paket berbayar dengan akses SMTP diaktifkan.
  </span>
</div>

#### Konfigurasi {#configuration-2}

1. Buat atau edit file konfigurasi msmtp di `~/.msmtprc`:

   ```bash
   nano ~/.msmtprc
   ```

2. Tambahkan konfigurasi berikut:

   ```
   defaults
   auth           on
   tls            on
   tls_trust_file /etc/ssl/certs/ca-certificates.crt
   logfile        ~/.msmtp.log

   account        forwardemail
   host           smtp.forwardemail.net
   port           465
   tls_starttls   off
   from           your-alias@yourdomain.com
   user           your-alias@yourdomain.com
   password       your-generated-password

   account default : forwardemail
   ```

3. Atur izin yang benar untuk file konfigurasi:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### Pengujian {#testing-2}

Kirim email uji coba:

```bash
echo "This is a test email from msmtp" | msmtp -a default recipient@example.com
```

### Klien Email Baris Perintah {#command-line-email-clients}

Klien email baris perintah populer seperti [Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org), dan [Alpine](https://alpine.x10.mx/alpine/release/) dapat dikonfigurasi untuk menggunakan server SMTP Forward Email untuk mengirim email. Konfigurasinya akan mirip dengan pengaturan `msmtp`, di mana Anda menyediakan detail server SMTP dan kredensial Anda di file konfigurasi masing-masing (`.muttrc`, `.neomuttrc`, atau `.pinerc`).

### Konfigurasi Email Windows {#windows-email-configuration}

Untuk pengguna Windows, Anda dapat mengkonfigurasi klien email populer seperti **Microsoft Outlook** dan **eM Client** menggunakan pengaturan IMAP dan SMTP yang disediakan di akun Forward Email Anda. Untuk penggunaan baris perintah atau skrip, Anda dapat menggunakan cmdlet PowerShell `Send-MailMessage` (meskipun dianggap usang) atau alat relay SMTP ringan seperti [E-MailRelay](https://github.com/graeme-walker/emailrelay).

### Konfigurasi Relay SMTP Postfix {#postfix-smtp-relay-configuration}

Anda dapat mengkonfigurasi Postfix untuk merelay email melalui server SMTP Forward Email. Ini berguna untuk aplikasi server yang perlu mengirim email.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Perkiraan Waktu Pengaturan:</strong>
  <span>Kurang dari 15 menit</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Penting:
  </strong>
  <span>
    Ini memerlukan paket berbayar dengan akses SMTP diaktifkan.
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

2. Saat instalasi, pilih "Internet Site" ketika diminta tipe konfigurasi.

#### Konfigurasi {#configuration-3}

1. Edit file konfigurasi utama Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Tambahkan atau ubah pengaturan ini:

```
# Konfigurasi relay SMTP
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Buat file password SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Tambahkan kredensial Forward Email Anda:

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
```

5. Amankan dan hash file password:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Restart Postfix:

```bash
sudo systemctl restart postfix
```

#### Pengujian {#testing-3}

Uji konfigurasi Anda dengan mengirim email uji coba:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

### Cara Mengirim Email Sebagai menggunakan Gmail {#how-to-send-mail-as-using-gmail}
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Perkiraan Waktu Pengaturan:</strong>
  <span>Kurang dari 10 menit</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Memulai:
  </strong>
  <span>
    Jika Anda telah mengikuti instruksi di atas pada <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Bagaimana cara memulai dan mengatur penerusan email</a>, maka Anda dapat melanjutkan membaca di bawah ini.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Penting:
  </strong>
  <span>
    Harap pastikan Anda telah membaca <a href="/terms" class="alert-link" target="_blank">Ketentuan</a>, <a href="/privacy" class="alert-link" target="_blank">Kebijakan Privasi</a>, dan <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Batas SMTP Keluar</a> kami &ndash; penggunaan Anda dianggap sebagai pengakuan dan persetujuan.
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

1. Pergi ke <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Pengaturan <i class="fa fa-angle-right"></i> Konfigurasi SMTP Keluar dan ikuti instruksi pengaturan

2. Buat alias baru untuk domain Anda di bawah <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias (misalnya <code><hello@example.com></code>)

3. Klik pada <strong class="text-success"><i class="fa fa-key"></i> Buat Kata Sandi</strong> di sebelah alias yang baru dibuat. Salin ke clipboard Anda dan simpan kata sandi yang dihasilkan dengan aman yang ditampilkan di layar.

4. Pergi ke [Gmail](https://gmail.com) dan di bawah [Pengaturan <i class="fa fa-angle-right"></i> Akun dan Impor <i class="fa fa-angle-right"></i> Kirim email sebagai](https://mail.google.com/mail/u/0/#settings/accounts), klik "Tambahkan alamat email lain"

5. Saat diminta untuk "Nama", masukkan nama yang ingin Anda tampilkan sebagai "Dari" pada email Anda (misalnya "Linus Torvalds").

6. Saat diminta untuk "Alamat email", masukkan alamat email lengkap dari alias yang Anda buat di bawah <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias (misalnya <code><hello@example.com></code>)

7. Hapus centang "Perlakukan sebagai alias"

8. Klik "Langkah Berikutnya" untuk melanjutkan

9. Saat diminta untuk "Server SMTP", masukkan <code>smtp.forwardemail.net</code> dan ubah port menjadi <code>465</code>

10. Saat diminta untuk "Nama pengguna", masukkan alamat email lengkap dari alias yang Anda buat di bawah <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias (misalnya <code><hello@example.com></code>)

11. Saat diminta untuk "Kata sandi", tempelkan kata sandi dari <strong class="text-success"><i class="fa fa-key"></i> Buat Kata Sandi</strong> pada langkah 3 di atas

12. Pilih tombol radio untuk "Koneksi aman menggunakan SSL"

13. Klik "Tambahkan Akun" untuk melanjutkan

14. Buka tab baru ke [Gmail](https://gmail.com) dan tunggu email verifikasi Anda tiba (Anda akan menerima kode verifikasi yang mengonfirmasi bahwa Anda adalah pemilik alamat email yang Anda coba "Kirim Email Sebagai")

15. Setelah tiba, salin dan tempel kode verifikasi pada prompt yang Anda terima pada langkah sebelumnya
16. Setelah Anda melakukan itu, kembali ke email dan klik tautan untuk "mengonfirmasi permintaan". Anda kemungkinan besar perlu melakukan langkah ini dan langkah sebelumnya agar email dikonfigurasi dengan benar.

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

</div>

### Apa itu panduan legacy gratis untuk Kirim Email Sebagai menggunakan Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Penting:</strong> Panduan legacy gratis ini sudah tidak digunakan sejak Mei 2023 karena <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">kami sekarang mendukung SMTP keluar</a>. Jika Anda menggunakan panduan di bawah ini, maka <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">ini akan menyebabkan email keluar Anda</a> menampilkan "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" di Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Perkiraan Waktu Pengaturan:</strong>
  <span>Kurang dari 10 menit</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Memulai:
  </strong>
  <span>
    Jika Anda telah mengikuti instruksi di atas pada <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Bagaimana cara memulai dan mengatur penerusan email</a>, maka Anda dapat melanjutkan membaca di bawah ini.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="How to Send Mail As using Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Anda perlu mengaktifkan [Two-Factor Authentication Gmail][gmail-2fa] agar ini berfungsi. Kunjungi <https://www.google.com/landing/2step/> jika Anda belum mengaktifkannya.

2. Setelah Two-Factor Authentication diaktifkan (atau jika Anda sudah mengaktifkannya), kunjungi <https://myaccount.google.com/apppasswords>.

3. Saat diminta "Pilih aplikasi dan perangkat yang ingin Anda buatkan kata sandi aplikasi untuk":
   * Pilih "Mail" di bawah menu drop-down untuk "Pilih aplikasi"
   * Pilih "Other" di bawah menu drop-down untuk "Pilih perangkat"
   * Saat diminta untuk input teks, masukkan alamat email domain kustom Anda yang Anda teruskan (misalnya <code><hello@example.com></code> - ini akan membantu Anda melacak jika Anda menggunakan layanan ini untuk beberapa akun)

4. Salin kata sandi yang otomatis dibuat ke clipboard Anda
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Penting:
     </strong>
     <span>
       Jika Anda menggunakan G Suite, kunjungi panel admin Anda <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Apps <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Settings for Gmail <i class="fa fa-angle-right"></i> Settings</a> dan pastikan untuk mencentang "Izinkan pengguna mengirim email melalui server SMTP eksternal...". Akan ada sedikit penundaan agar perubahan ini aktif, jadi harap tunggu beberapa menit.
     </span>
   </div>

5. Buka [Gmail](https://gmail.com) dan di bawah [Pengaturan <i class="fa fa-angle-right"></i> Akun dan Impor <i class="fa fa-angle-right"></i> Kirim email sebagai](https://mail.google.com/mail/u/0/#settings/accounts), klik "Tambahkan alamat email lain"

6. Saat diminta "Nama", masukkan nama yang ingin Anda tampilkan sebagai "Dari" pada email Anda (misalnya "Linus Torvalds")

7. Saat diminta "Alamat email", masukkan alamat email dengan domain kustom yang Anda gunakan di atas (misalnya <code><hello@example.com></code>)
8. Hapus centang "Treat as an alias"

9. Klik "Next Step" untuk melanjutkan

10. Saat diminta untuk "SMTP Server", masukkan <code>smtp.gmail.com</code> dan biarkan port tetap <code>587</code>

11. Saat diminta untuk "Username", masukkan bagian dari alamat Gmail Anda tanpa bagian <span>gmail.com</span> (misalnya hanya "user" jika email saya adalah <span><user@gmail.com></span>)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        Penting:
      </strong>
      <span>
        Jika bagian "Username" terisi otomatis, maka <u><strong>Anda perlu mengubah ini</strong></u> menjadi bagian username dari alamat Gmail Anda.
      </span>
    </div>

12. Saat diminta untuk "Password", tempel dari clipboard kata sandi yang Anda buat pada langkah 2 di atas

13. Biarkan tombol radio dicentang untuk "Secured connection using TLS"

14. Klik "Add Account" untuk melanjutkan

15. Buka tab baru ke [Gmail](https://gmail.com) dan tunggu email verifikasi Anda tiba (Anda akan menerima kode verifikasi yang mengonfirmasi bahwa Anda adalah pemilik alamat email yang Anda coba "Send Mail As")

16. Setelah tiba, salin dan tempel kode verifikasi pada prompt yang Anda terima di langkah sebelumnya

17. Setelah Anda melakukan itu, kembali ke email dan klik tautan untuk "confirm the request". Anda kemungkinan besar perlu melakukan langkah ini dan langkah sebelumnya agar email dikonfigurasi dengan benar.

</div>

### Konfigurasi Routing Gmail Lanjutan {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Perkiraan Waktu Pengaturan:</strong>
  <span>15-30 menit</span>
</div>

Jika Anda ingin mengatur routing lanjutan di Gmail sehingga alias yang tidak cocok dengan mailbox akan diteruskan ke mail exchange Forward Email, ikuti langkah-langkah berikut:

1. Masuk ke konsol Admin Google Anda di [admin.google.com](https://admin.google.com)
2. Pergi ke **Apps → Google Workspace → Gmail → Routing**
3. Klik **Add Route** dan konfigurasikan pengaturan berikut:

**Pengaturan Penerima Tunggal:**

* Pilih "Change envelope recipient" dan masukkan alamat Gmail utama Anda
* Centang "Add X-Gm-Original-To header with original recipient"

**Pola Penerima Amplop:**

* Tambahkan pola yang cocok dengan semua mailbox yang tidak ada (misalnya, `.*@yourdomain.com`)

**Pengaturan Server Email:**

* Pilih "Route to host" dan masukkan `mx1.forwardemail.net` sebagai server utama
* Tambahkan `mx2.forwardemail.net` sebagai server cadangan
* Atur port ke 25
* Pilih "Require TLS" untuk keamanan

4. Klik **Save** untuk membuat route

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Penting:
  </strong>
  <span>
    Konfigurasi ini hanya akan berfungsi untuk akun Google Workspace dengan domain kustom, bukan untuk akun Gmail biasa.
  </span>
</div>

### Konfigurasi Routing Outlook Lanjutan {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Perkiraan Waktu Pengaturan:</strong>
  <span>15-30 menit</span>
</div>

Untuk pengguna Microsoft 365 (sebelumnya Office 365) yang ingin mengatur routing lanjutan sehingga alias yang tidak cocok dengan mailbox akan diteruskan ke mail exchange Forward Email:

1. Masuk ke pusat admin Microsoft 365 di [admin.microsoft.com](https://admin.microsoft.com)
2. Pergi ke **Exchange → Mail flow → Rules**
3. Klik **Add a rule** dan pilih **Create a new rule**
4. Beri nama aturan Anda (misalnya, "Forward non-existent mailboxes to Forward Email")
5. Di bawah **Apply this rule if**, pilih:
   * "The recipient address matches..."
   * Masukkan pola yang cocok dengan semua alamat di domain Anda (misalnya, `*@yourdomain.com`)
6. Di bawah **Do the following**, pilih:
   * "Redirect the message to..."
   * Pilih "The following mail server"
   * Masukkan `mx1.forwardemail.net` dan port 25
   * Tambahkan `mx2.forwardemail.net` sebagai server cadangan
7. Di bawah **Except if**, pilih:
   * "The recipient is..."
   * Tambahkan semua mailbox Anda yang sudah ada dan tidak boleh diteruskan
8. Atur prioritas aturan agar dijalankan setelah aturan alur surat lainnya
9. Klik **Save** untuk mengaktifkan aturan
## Pemecahan Masalah {#troubleshooting}

### Mengapa saya tidak menerima email tes saya {#why-am-i-not-receiving-my-test-emails}

Jika Anda mengirim email tes ke diri sendiri, maka mungkin tidak muncul di kotak masuk Anda karena memiliki header "Message-ID" yang sama.

Ini adalah masalah yang sudah dikenal luas, dan juga memengaruhi layanan seperti Gmail.  <a href="https://support.google.com/a/answer/1703601">Berikut adalah jawaban resmi Gmail mengenai masalah ini</a>.

Jika Anda terus mengalami masalah, maka kemungkinan besar ini adalah masalah dengan propagasi DNS.  Anda perlu menunggu sedikit lebih lama dan mencoba lagi (atau coba atur nilai TTL yang lebih rendah pada <strong class="notranslate">TXT</strong> record Anda).

**Masih mengalami masalah?**  Silakan <a href="/help">hubungi kami</a> agar kami dapat membantu menyelidiki masalah dan menemukan solusi cepat.

### Bagaimana cara mengonfigurasi klien email saya agar bekerja dengan Forward Email {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  Layanan kami bekerja dengan klien email populer seperti:
  <ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
    <li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Desktop</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Terminal</a></li>
  </ul>
</div>

<div class="alert alert-primary">
  Nama pengguna Anda adalah alamat email alias Anda dan kata sandi berasal dari <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ("Kata Sandi Normal").
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
  <span>Jika Anda menggunakan Thunderbird, pastikan "Connection security" diatur ke "SSL/TLS" dan metode Autentikasi diatur ke "Normal password".</span>
</div>

| Tipe |         Hostname        |         Protokol        |                                            Port                                            |
| :---: | :---------------------: | :---------------------: | :----------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` |  SSL/TLS **Preferred**  |                                      `993` dan `2993`                                      |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Recommended** | `465` dan `2465` untuk SSL/TLS (direkomendasikan) atau `587`, `2587`, `2525`, dan `25` untuk STARTTLS |

### Mengapa email saya masuk ke Spam dan Junk dan bagaimana saya dapat memeriksa reputasi domain saya {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
Bagian ini memandu Anda jika email keluar Anda menggunakan server SMTP kami (misalnya `smtp.forwardemail.net`) (atau diteruskan melalui `mx1.forwardemail.net` atau `mx2.forwardemail.net`) dan email tersebut dikirim ke folder Spam atau Junk penerima.

Kami secara rutin memantau [alamat IP kami](#what-are-your-servers-ip-addresses) terhadap [semua daftar tolak DNS yang terpercaya](#how-do-you-handle-your-ip-addresses-becoming-blocked), **oleh karena itu kemungkinan besar ini adalah masalah reputasi domain spesifik**.

Email dapat masuk ke folder spam karena beberapa alasan:

1. **Otentikasi Hilang**: Atur [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), dan [DMARC](#how-do-i-set-up-dmarc-for-forward-email) records.

2. **Reputasi Domain**: Domain baru sering memiliki reputasi netral sampai mereka membangun riwayat pengiriman.

3. **Pemicu Konten**: Kata atau frasa tertentu dapat memicu filter spam.

4. **Pola Pengiriman**: Peningkatan volume email secara tiba-tiba dapat terlihat mencurigakan.

Anda dapat mencoba menggunakan satu atau lebih alat ini untuk memeriksa reputasi dan kategorisasi domain Anda:

#### Alat Pemeriksa Reputasi dan Daftar Blokir {#reputation-and-blocklist-check-tools}

| Nama Alat                                  | URL                                                          | Jenis                  |
| ------------------------------------------- | ------------------------------------------------------------ | ---------------------- |
| Cloudflare Domain Categorization Feedback   | <https://radar.cloudflare.com/domains/feedback>              | Kategorisasi           |
| Spamhaus IP and Domain Reputation Checker   | <https://check.spamhaus.org/>                                | DNSBL                  |
| Cisco Talos IP and Domain Reputation Center | <https://talosintelligence.com/reputation_center>            | Reputasi               |
| Barracuda IP and Domain Reputation Lookup   | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| MX Toolbox Blacklist Check                  | <https://mxtoolbox.com/blacklists.aspx>                      | Daftar Hitam           |
| Google Postmaster Tools                     | <https://www.gmail.com/postmaster/>                          | Reputasi               |
| Yahoo Sender Hub                            | <https://senders.yahooinc.com/>                              | Reputasi               |
| MultiRBL.valli.org Blacklist Check          | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                                | <https://senderscore.org/act/blocklist-remover/>             | Reputasi               |
| Invaluement                                 | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                       | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                     | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| UCEPROTECT's Levels 1, 2, and 3             | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| UCEPROTECT's backscatterer.org              | <https://www.backscatterer.org/>                             | Perlindungan Backscatter |
| UCEPROTECT's whitelisted.org                | <https://www.whitelisted.org/> (requires a fee)              | DNSWL                  |

#### Formulir Permintaan Penghapusan IP oleh Penyedia {#ip-removal-request-forms-by-provider}

Jika alamat IP Anda diblokir oleh penyedia email tertentu, gunakan formulir penghapusan yang sesuai atau kontak di bawah ini:

| Penyedia                               | Formulir Penghapusan / Kontak                                                                                     | Catatan                                      |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Google/Gmail                           | <https://support.google.com/mail/contact/bulk_send_new>                                                    | Formulir kontak pengirim massal              |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                | Portal delisting IP Office 365                |
| Yahoo/AOL/Verizon                      | <https://senders.yahooinc.com/>                                                                            | Yahoo Sender Hub                             |
| Apple/iCloud                           | <https://ipcheck.proofpoint.com/>                                                                          | Apple menggunakan Proofpoint untuk reputasi IP |
| Proofpoint                             | <https://ipcheck.proofpoint.com/>                                                                          | Pemeriksaan dan penghapusan IP Proofpoint     |
| Barracuda Networks                     | <https://www.barracudacentral.org/lookups/lookup-reputation>                                               | Pemeriksaan dan penghapusan reputasi Barracuda |
| Cloudmark                              | <https://csi.cloudmark.com/en/reset/>                                                                      | Permintaan reset Cloudmark CSI                |
| GoDaddy/SecureServer                   | <https://unblock.secureserver.net>                                                                         | Formulir permintaan unblock IP GoDaddy       |
| Comcast/Xfinity                        | <https://spa.xfinity.com/report>                                                                           | Permintaan penghapusan IP Comcast             |
| Charter/Spectrum                       | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                | Hubungi dukungan Spectrum untuk penghapusan  |
| AT&T                                   | `abuse_rbl@abuse-att.net`                                                                                  | Email untuk permintaan penghapusan            |
| Cox Communications                     | `unblock.request@cox.net`                                                                                  | Email untuk permintaan penghapusan            |
| CenturyLink/Lumen                      | `abuse@centurylink.com`                                                                                    | Menggunakan Cloudfilter                        |
| Windstream                             | `abuse@windstream.net`                                                                                     | Email untuk permintaan penghapusan            |
| t-online.de (Jerman)                  | `tobr@rx.t-online.de`                                                                                      | Email untuk permintaan penghapusan            |
| Orange France                          | <https://postmaster.orange.fr/>                                                                            | Gunakan formulir kontak atau email `abuse@orange.fr` |
| GMX                                    | <https://postmaster.gmx.net/en/contact>                                                                    | Formulir kontak postmaster GMX                 |
| Mail.ru                                | <https://postmaster.mail.ru/>                                                                              | Portal postmaster Mail.ru                      |
| Yandex                                 | <https://postmaster.yandex.ru/>                                                                            | Portal postmaster Yandex                       |
| QQ Mail (Tencent)                      | <https://open.mail.qq.com/>                                                                                | Aplikasi whitelist QQ Mail (Bahasa Cina)      |
| Netease (163.com)                      | <https://mail.163.com/postmaster/>                                                                         | Portal postmaster Netease                      |
| Alibaba/Aliyun/HiChina                 | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                       | Kontak melalui konsol Alibaba Cloud            |
| Amazon SES                             | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                               | Konsol AWS SES > Penghapusan Daftar Hitam     |
| SendGrid                               | <https://support.sendgrid.com/>                                                                            | Kontak dukungan SendGrid                       |
| Mimecast                               | <https://community.mimecast.com/>                                                                          | Menggunakan RBL pihak ketiga - kontak RBL spesifik |
| Fastmail                               | <https://www.fastmail.com/support/>                                                                        | Kontak dukungan Fastmail                       |
| Zoho                                   | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address> | Kontak dukungan Zoho                           |
| ProtonMail                             | <https://proton.me/support/contact>                                                                        | Kontak dukungan Proton                         |
| Tutanota                               | <https://tutanota.com/support>                                                                             | Kontak dukungan Tutanota                       |
| Hushmail                               | <https://www.hushmail.com/support/>                                                                        | Kontak dukungan Hushmail                       |
| Mailbox.org                            | <https://mailbox.org/en/support>                                                                           | Kontak dukungan Mailbox.org                     |
| Posteo                                 | <https://posteo.de/en/site/contact>                                                                        | Kontak dukungan Posteo                         |
| DuckDuckGo Email                       | <https://duckduckgo.com/email/support>                                                                     | Kontak dukungan DuckDuckGo                     |
| Sonic.net                              | <https://www.sonic.com/support>                                                                            | Kontak dukungan Sonic                          |
| Telus                                  | <https://www.telus.com/en/support>                                                                         | Kontak dukungan Telus                          |
| Vodafone Germany                       | <https://www.vodafone.de/hilfe/>                                                                           | Kontak dukungan Vodafone                       |
| Xtra (Spark NZ)                        | <https://www.spark.co.nz/help/>                                                                            | Kontak dukungan Spark NZ                       |
| UOL/BOL (Brasil)                      | <https://ajuda.uol.com.br/>                                                                                | Kontak dukungan UOL (Portugis)                 |
| Libero (Italia)                       | <https://aiuto.libero.it/>                                                                                 | Kontak dukungan Libero (Italia)                |
| Telenet (Belgia)                      | <https://www2.telenet.be/en/support/>                                                                      | Kontak dukungan Telenet                        |
| Facebook/WhatsApp                      | <https://www.facebook.com/business/help>                                                                   | Kontak dukungan bisnis Facebook                |
| LinkedIn                               | <https://www.linkedin.com/help/linkedin>                                                                   | Kontak dukungan LinkedIn                       |
| Groups.io                              | <https://groups.io/helpcenter>                                                                             | Kontak dukungan Groups.io                      |
| Earthlink/Vade Secure                  | <https://sendertool.vadesecure.com/en/>                                                                    | Alat pengirim Vade Secure                      |
| Cloudflare Email Security              | <https://www.cloudflare.com/products/zero-trust/email-security/>                                           | Kontak dukungan Cloudflare                     |
| Hornetsecurity/Expurgate               | <https://www.hornetsecurity.com/>                                                                          | Kontak dukungan Hornetsecurity                 |
| SpamExperts/Antispamcloud              | <https://www.spamexperts.com/>                                                                             | Kontak melalui penyedia hosting                |
| Mail2World                             | <https://www.mail2world.com/support/>                                                                      | Kontak dukungan Mail2World                     |
> \[!TIP]
> Mulailah dengan volume email berkualitas tinggi yang rendah untuk membangun reputasi positif sebelum mengirim dalam volume yang lebih besar.

> \[!IMPORTANT]
> Jika domain Anda masuk dalam daftar hitam, setiap daftar hitam memiliki proses penghapusan sendiri. Periksa situs web mereka untuk petunjuk.

> \[!TIP]
> Jika Anda membutuhkan bantuan tambahan atau menemukan bahwa kami terdaftar sebagai spam positif palsu oleh penyedia layanan email tertentu, silakan <a href="/help">hubungi kami</a>.

### Apa yang harus saya lakukan jika menerima email spam {#what-should-i-do-if-i-receive-spam-emails}

Anda harus berhenti berlangganan dari daftar email (jika memungkinkan) dan memblokir pengirim.

Harap jangan melaporkan pesan tersebut sebagai spam, melainkan teruskan ke sistem pencegahan penyalahgunaan yang dikurasi secara manual dan berfokus pada privasi kami.

**Alamat email untuk meneruskan spam adalah:** <abuse@forwardemail.net>

### Mengapa email uji yang saya kirim ke diri sendiri di Gmail muncul sebagai "mencurigakan" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Jika Anda melihat pesan kesalahan ini di Gmail saat mengirim uji coba ke diri sendiri, atau ketika seseorang yang Anda kirimi email dengan alias Anda melihat email dari Anda untuk pertama kalinya, maka **harap jangan khawatir** – karena ini adalah fitur keamanan bawaan Gmail.

Anda cukup klik "Terlihat aman". Misalnya, jika Anda mengirim pesan uji menggunakan fitur kirim email sebagai (kepada orang lain), maka mereka tidak akan melihat pesan ini.

Namun jika mereka melihat pesan ini, itu karena mereka biasanya terbiasa melihat email Anda berasal dari <john@gmail.com> bukan dari <john@customdomain.com> (hanya contoh). Gmail akan memberi peringatan kepada pengguna untuk memastikan semuanya aman, jadi tidak ada solusi lain.

### Bisakah saya menghapus via forwardemail dot net di Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Topik ini terkait dengan [masalah yang dikenal luas di Gmail di mana info tambahan muncul di samping nama pengirim](https://support.google.com/mail/answer/1311182).

Per Mei 2023 kami mendukung pengiriman email dengan SMTP sebagai tambahan untuk semua pengguna berbayar – yang berarti Anda dapat menghapus <span class="notranslate">via forwardemail dot net</span> di Gmail.

Perlu dicatat bahwa topik FAQ ini khusus untuk mereka yang menggunakan fitur [Cara Mengirim Email Sebagai menggunakan Gmail](#how-to-send-mail-as-using-gmail).

Silakan lihat bagian [Apakah Anda mendukung pengiriman email dengan SMTP](#do-you-support-sending-email-with-smtp) untuk petunjuk konfigurasi.


## Manajemen Data {#data-management}

### Di mana lokasi server Anda {#where-are-your-servers-located}

> \[!TIP]
> Kami mungkin segera mengumumkan lokasi pusat data UE kami yang dihosting di bawah [forwardemail.eu](https://forwardemail.eu). Berlangganan diskusi di <https://github.com/orgs/forwardemail/discussions/336> untuk pembaruan.

Server kami terutama berlokasi di Denver, Colorado – lihat <https://forwardemail.net/ips> untuk daftar lengkap alamat IP kami.

Anda dapat mempelajari tentang subprosesor kami di halaman [GDPR](/gdpr), [DPA](/dpa), dan [Privasi](/privacy).

### Bagaimana cara mengekspor dan mencadangkan kotak surat saya {#how-do-i-export-and-backup-my-mailbox}

Kapan saja Anda dapat mengekspor kotak surat Anda dalam format [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox), atau [SQLite](https://en.wikipedia.org/wiki/SQLite) terenkripsi.

Pergi ke <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Unduh Cadangan dan pilih jenis format ekspor yang Anda inginkan.

Anda akan menerima email berisi tautan untuk mengunduh ekspor setelah selesai.

Perlu diketahui bahwa tautan unduhan ekspor ini kedaluwarsa setelah 4 jam demi keamanan.

Jika Anda perlu memeriksa format EML atau Mbox yang diekspor, alat sumber terbuka berikut mungkin berguna:

| Nama            | Format | Platform      | URL GitHub                                          |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox Viewer     |  Mbox  | Windows       | <https://github.com/eneam/mboxviewer>               |
| mbox-web-viewer |  Mbox  | Semua platform| <https://github.com/PHMRanger/mbox-web-viewer>      |
| EmlReader       |   EML  | Windows       | <https://github.com/ayamadori/EmlReader>            |
| Email viewer    |   EML  | VSCode        | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-reader      |   EML  | Semua platform| <https://github.com/s0ph1e/eml-reader>              |
Selain itu jika Anda perlu mengonversi file Mbox ke file EML, maka Anda dapat menggunakan <https://github.com/noelmartinon/mboxzilla>.

### Bagaimana cara mengimpor dan memigrasi kotak surat saya yang sudah ada {#how-do-i-import-and-migrate-my-existing-mailbox}

Anda dapat dengan mudah mengimpor email Anda ke Forward Email (misalnya menggunakan [Thunderbird](https://www.thunderbird.net)) dengan petunjuk di bawah ini:

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Penting:
  </strong>
  <span>
    Anda harus mengikuti semua langkah berikut untuk mengimpor email Anda yang sudah ada.
  </span>
</div>

1. Ekspor email Anda dari penyedia email yang sudah Anda gunakan:

   | Penyedia Email | Format Ekspor                                  | Instruksi Ekspor                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail          | MBOX                                           | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook        | PST                                            | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Tip:</strong> <span>Jika Anda menggunakan Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">format ekspor PST</a>), maka Anda dapat mengikuti instruksi di bagian "Lainnya" di bawah ini. Namun kami telah menyediakan tautan di bawah ini untuk mengonversi PST ke format MBOX/EML berdasarkan sistem operasi Anda:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba untuk Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst untuk Windows cygwin</a> – (misalnya <code>readpst -u -o $OUT_DIR $IN_DIR</code> menggantikan <code>$OUT_DIR</code> dan <code>$IN_DIR</code> dengan jalur direktori keluaran dan direktori masukan secara berurutan).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst untuk Ubuntu/Linux</a> – (misalnya <code>sudo apt-get install readpst</code> lalu <code>readpst -u -o $OUT_DIR $IN_DIR</code>, menggantikan <code>$OUT_DIR</code> dan <code>$IN_DIR</code> dengan jalur direktori keluaran dan direktori masukan secara berurutan).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst untuk macOS (melalui brew)</a> – (misalnya <code>brew install libpst</code> lalu <code>readpst -u -o $OUT_DIR $IN_DIR</code>, menggantikan <code>$OUT_DIR</code> dan <code>$IN_DIR</code> dengan jalur direktori keluaran dan direktori masukan secara berurutan).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter untuk Windows (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail     | MBOX                                           | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail       | EML                                            | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail    | MBOX/EML                                       | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota       | EML                                            | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi          | EML                                            | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho           | EML                                            | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | Lainnya        | [Gunakan Thunderbird](https://www.thunderbird.net) | Atur akun email Anda yang sudah ada di Thunderbird lalu gunakan plugin [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) untuk mengekspor dan mengimpor email Anda.  **Anda juga mungkin dapat langsung menyalin/menempel atau menyeret/melepas email antar akun.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. Unduh, instal, dan buka [Thunderbird](https://www.thunderbird.net).

3. Buat akun baru menggunakan alamat email alias lengkap Anda (misalnya <code><you@yourdomain.com></code>) dan kata sandi yang telah Anda buat.  <strong>Jika Anda belum memiliki kata sandi yang dibuat, maka <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">lihat petunjuk pengaturan kami</a></strong>.

4. Unduh dan instal plugin Thunderbird [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/).

5. Buat folder lokal baru di Thunderbird, lalu klik kanan pada folder tersebut → pilih opsi `ImportExportTools NG` → pilih `Import mbox file` (untuk format ekspor MBOX) – atau – `Import messages` / `Import all messages from a directory` (untuk format ekspor EML).

6. Seret/jatuhkan dari folder lokal ke folder IMAP baru (atau yang sudah ada) di Thunderbird tempat Anda ingin mengunggah pesan ke penyimpanan IMAP dengan layanan kami.  Ini akan memastikan pesan tersebut dicadangkan secara online dengan penyimpanan terenkripsi SQLite kami.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>
       Jika Anda bingung bagaimana cara mengimpor ke Thunderbird, Anda dapat merujuk ke petunjuk resmi di <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> dan <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Penting:
  </strong>
  <span>
    Setelah Anda menyelesaikan proses ekspor dan impor, Anda mungkin juga ingin mengaktifkan penerusan pada akun email Anda yang sudah ada dan mengatur auto-responder untuk memberi tahu pengirim bahwa Anda memiliki alamat email baru (misalnya jika sebelumnya Anda menggunakan Gmail dan sekarang menggunakan email dengan nama domain kustom Anda).
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

### Bagaimana cara menggunakan penyimpanan kompatibel S3 saya sendiri untuk cadangan {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

Pengguna paket berbayar dapat mengonfigurasi penyedia penyimpanan kompatibel [S3](https://en.wikipedia.org/wiki/Amazon_S3) mereka sendiri berdasarkan domain untuk cadangan IMAP/SQLite.  Ini berarti cadangan kotak surat terenkripsi Anda dapat disimpan di infrastruktur Anda sendiri sebagai pengganti (atau tambahan) penyimpanan default kami.

Penyedia yang didukung termasuk [Amazon S3](https://aws.amazon.com/s3/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [MinIO](https://github.com/minio/minio), [Backblaze B2](https://www.backblaze.com/cloud-storage), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces), dan layanan kompatibel S3 lainnya.

#### Pengaturan {#setup}

1. Buat bucket **pribadi** dengan penyedia kompatibel S3 Anda.  Bucket tidak boleh dapat diakses secara publik.
2. Buat kredensial akses (access key ID dan secret access key) dengan izin baca/tulis ke bucket tersebut.
3. Buka <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Pengaturan Lanjutan <i class="fa fa-angle-right"></i> Penyimpanan Kompatibel S3 Kustom.
4. Centang **"Aktifkan penyimpanan kompatibel S3 kustom"** dan isi URL endpoint, access key ID, secret access key, region, dan nama bucket Anda.
5. Klik **"Uji Koneksi"** untuk memverifikasi kredensial, akses bucket, dan izin tulis Anda.
6. Klik **"Simpan"** untuk menerapkan pengaturan.

#### Cara Kerja Cadangan {#how-backups-work}

Cadangan dipicu secara otomatis untuk setiap alias IMAP yang terhubung.  Server IMAP memeriksa semua koneksi aktif setiap jam dan mengirimkan cadangan untuk setiap alias yang terhubung.  Kunci berbasis Redis mencegah cadangan ganda berjalan dalam waktu 30 menit satu sama lain, dan cadangan sebenarnya dilewati jika cadangan yang berhasil sudah selesai dalam 24 jam terakhir (kecuali cadangan diminta secara eksplisit oleh pengguna untuk diunduh).
Backup juga dapat dipicu secara manual dengan mengklik **"Download Backup"** untuk alias apa pun di dashboard. Backup manual selalu dijalankan terlepas dari jendela 24 jam.

Proses backup bekerja sebagai berikut:

1. Database SQLite disalin menggunakan `VACUUM INTO`, yang membuat snapshot konsisten tanpa mengganggu koneksi aktif dan mempertahankan enkripsi database.
2. File backup diverifikasi dengan membukanya untuk memastikan enkripsi masih valid.
3. Hash SHA-256 dihitung dan dibandingkan dengan backup yang ada di penyimpanan. Jika hash cocok, unggahan dilewati (tidak ada perubahan sejak backup terakhir).
4. Backup diunggah ke S3 menggunakan multipart upload melalui pustaka [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage).
5. URL unduhan yang ditandatangani (berlaku selama 4 jam) dibuat dan dikirim melalui email ke pengguna.

#### Backup Formats {#backup-formats}

Tiga format backup didukung:

| Format   | Extension | Deskripsi                                                                   |
| -------- | --------- | --------------------------------------------------------------------------- |
| `sqlite` | `.sqlite` | Snapshot database SQLite terenkripsi mentah (default untuk backup IMAP otomatis) |
| `mbox`   | `.zip`    | ZIP yang dilindungi kata sandi berisi mailbox dalam format mbox             |
| `eml`    | `.zip`    | ZIP yang dilindungi kata sandi berisi file `.eml` individual per pesan      |

> **Tip:** Jika Anda memiliki file backup `.sqlite` dan ingin mengonversinya ke file `.eml` secara lokal, gunakan alat CLI mandiri kami **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**. Alat ini bekerja di Windows, Linux, dan macOS dan tidak memerlukan koneksi jaringan.

#### File Naming and Key Structure {#file-naming-and-key-structure}

Saat menggunakan **penyimpanan S3 kustom**, file backup disimpan dengan awalan timestamp [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) sehingga setiap backup disimpan sebagai objek terpisah. Ini memberi Anda riwayat backup lengkap di bucket Anda sendiri.

Format kunci adalah:

```
{ISO 8601 timestamp}-{alias_id}.{extension}
```

Contohnya:

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

`alias_id` adalah MongoDB ObjectId dari alias. Anda dapat menemukannya di halaman pengaturan alias atau melalui API.

Saat menggunakan **penyimpanan default (sistem)**, kunci bersifat datar (misalnya `65a31c53c36b75ed685f3fda.sqlite`) dan setiap backup menimpa yang sebelumnya.

> **Catatan:** Karena penyimpanan S3 kustom menyimpan semua versi backup, penggunaan penyimpanan akan bertambah seiring waktu. Kami menyarankan mengonfigurasi [aturan siklus hidup](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) pada bucket Anda untuk secara otomatis menghapus backup lama (misalnya menghapus objek yang lebih tua dari 30 atau 90 hari).

#### Data Ownership and Deletion Policy {#data-ownership-and-deletion-policy}

Bucket S3 kustom Anda sepenuhnya berada di bawah kendali Anda. Kami **tidak pernah menghapus atau memodifikasi** file di bucket S3 kustom Anda — tidak saat alias dihapus, tidak saat domain dihapus, dan tidak selama operasi pembersihan apa pun. Kami hanya menulis file backup baru ke bucket Anda.

Ini berarti:

* **Penghapusan alias** — Saat Anda menghapus alias, kami hanya menghapus backup dari penyimpanan sistem default kami. Backup yang sebelumnya ditulis ke bucket S3 kustom Anda tetap tidak tersentuh.
* **Penghapusan domain** — Menghapus domain tidak memengaruhi file di bucket kustom Anda.
* **Manajemen retensi** — Anda bertanggung jawab mengelola penyimpanan di bucket Anda sendiri, termasuk mengonfigurasi aturan siklus hidup untuk menghapus backup lama.

Jika Anda menonaktifkan penyimpanan S3 kustom atau beralih kembali ke penyimpanan default kami, file yang ada di bucket Anda tetap dipertahankan. Backup berikutnya akan ditulis ke penyimpanan default kami.

#### Security {#security}

* ID kunci akses dan kunci akses rahasia Anda **dienkripsi saat disimpan** menggunakan [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) sebelum disimpan di database kami. Mereka hanya didekripsi saat runtime ketika melakukan operasi backup.
* Kami secara otomatis memvalidasi bahwa bucket Anda **tidak dapat diakses secara publik**. Jika bucket publik terdeteksi, konfigurasi akan ditolak saat penyimpanan. Jika akses publik terdeteksi saat backup, kami beralih ke penyimpanan default kami dan memberi tahu semua administrator domain melalui email.
* Kredensial divalidasi saat penyimpanan melalui panggilan [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html) untuk memastikan bucket ada dan kredensial benar. Jika validasi gagal, penyimpanan S3 kustom otomatis dinonaktifkan.
* Setiap file backup menyertakan hash SHA-256 dalam metadata S3-nya, yang digunakan untuk mendeteksi database yang tidak berubah dan melewati unggahan yang berlebihan.
#### Notifikasi Kesalahan {#error-notifications}

Jika cadangan gagal saat menggunakan penyimpanan S3 kustom Anda (misalnya karena kredensial kedaluwarsa atau masalah konektivitas), semua administrator domain akan diberi tahu melalui email. Notifikasi ini dibatasi frekuensinya menjadi sekali setiap 6 jam untuk mencegah peringatan duplikat. Jika bucket Anda terdeteksi dapat diakses secara publik saat waktu cadangan, administrator akan diberi tahu sekali sehari.

#### API {#api}

Anda juga dapat mengonfigurasi penyimpanan S3 kustom melalui API:

```sh
curl -X PUT https://api.forwardemail.net/v1/domains/example.com \
  -u API_TOKEN: \
  -d has_custom_s3=true \
  -d s3_endpoint=https://s3.us-east-1.amazonaws.com \
  -d s3_access_key_id=YOUR_ACCESS_KEY_ID \
  -d s3_secret_access_key=YOUR_SECRET_ACCESS_KEY \
  -d s3_region=us-east-1 \
  -d s3_bucket=my-email-backups
```

Untuk menguji koneksi melalui API:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### Bagaimana cara mengonversi cadangan SQLite ke file EML {#how-do-i-convert-sqlite-backups-to-eml-files}

Jika Anda mengunduh atau menyimpan cadangan SQLite (baik dari penyimpanan default kami atau [bucket S3 kustom Anda sendiri](#how-do-i-use-my-own-s3-compatible-storage-for-backups)), Anda dapat mengonversinya menjadi file `.eml` standar menggunakan alat CLI mandiri kami **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)**. File EML dapat dibuka dengan klien email apa pun ([Thunderbird](https://www.thunderbird.net/), [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook), [Apple Mail](https://support.apple.com/mail), dll.) atau diimpor ke server email lain.

#### Instalasi {#installation-1}

Anda dapat mengunduh binary yang sudah jadi (tidak memerlukan [Node.js](https://github.com/nodejs/node)) atau menjalankannya langsung dengan [Node.js](https://github.com/nodejs/node):

**Binary yang sudah jadi** — Unduh rilis terbaru untuk platform Anda dari [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases):

| Platform | Arsitektur   | File                                  |
| -------- | ------------| ------------------------------------ |
| Linux    | x64          | `convert-sqlite-to-eml-linux-x64`    |
| Linux    | arm64        | `convert-sqlite-to-eml-linux-arm64`  |
| macOS    | Apple Silicon| `convert-sqlite-to-eml-darwin-arm64` |
| Windows  | x64          | `convert-sqlite-to-eml-win-x64.exe`  |

> **Pengguna macOS:** Setelah mengunduh, Anda mungkin perlu menghapus atribut karantina sebelum menjalankan binary:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (Ganti `./convert-sqlite-to-eml-darwin-arm64` dengan jalur sebenarnya ke file yang diunduh.)

> **Pengguna Linux:** Setelah mengunduh, Anda mungkin perlu membuat binary dapat dieksekusi:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (Ganti `./convert-sqlite-to-eml-linux-x64` dengan jalur sebenarnya ke file yang diunduh.)

**Dari sumber** (memerlukan [Node.js](https://github.com/nodejs/node) >= 18):

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### Penggunaan {#usage}

Alat ini mendukung mode interaktif dan non-interaktif.

**Mode interaktif** — jalankan tanpa argumen dan Anda akan diminta untuk semua input:

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - Konversi Cadangan SQLite ke EML
  =============================================

  Jalur ke file cadangan SQLite: /path/to/backup.sqlite
  Kata sandi IMAP/alias: ********
  Jalur ZIP keluaran [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**Mode non-interaktif** — berikan argumen melalui flag baris perintah untuk skrip dan otomatisasi:

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "your-imap-password" \
  --output /path/to/output.zip
```

| Flag                | Deskripsi                                                                     |
| ------------------- | ----------------------------------------------------------------------------- |
| `--path <path>`     | Jalur ke file cadangan SQLite terenkripsi                                     |
| `--password <pass>` | Kata sandi IMAP/alias untuk dekripsi                                         |
| `--output <path>`   | Jalur keluaran untuk file ZIP (default: dibuat otomatis dengan cap waktu ISO 8601) |
| `--help`            | Tampilkan pesan bantuan                                                      |
#### Format Output {#output-format}

Alat ini menghasilkan arsip ZIP yang dilindungi kata sandi (terenkripsi AES-256) yang berisi:

```
README.txt
INBOX/
  <message-id-1>.eml
  <message-id-2>.eml
Sent/
  <message-id-3>.eml
Drafts/
  <message-id-4>.eml
```

File EML diatur berdasarkan folder kotak surat. Kata sandi ZIP sama dengan kata sandi IMAP/alias Anda. Setiap file `.eml` adalah pesan email standar [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) dengan header lengkap, teks isi, dan lampiran yang direkonstruksi dari database SQLite.

#### Cara Kerjanya {#how-it-works}

1. Membuka database SQLite terenkripsi menggunakan kata sandi IMAP/alias Anda (mendukung cipher [ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) dan [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)).
2. Membaca tabel Mailboxes untuk menemukan struktur folder.
3. Untuk setiap pesan, mendekode mimeTree (disimpan sebagai JSON terkompresi [Brotli](https://github.com/google/brotli)) dari tabel Messages.
4. Merekonstruksi EML lengkap dengan menelusuri pohon MIME dan mengambil isi lampiran dari tabel Attachments.
5. Mengemas semuanya ke dalam arsip ZIP yang dilindungi kata sandi menggunakan [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted).

### Apakah Anda mendukung self-hosting {#do-you-support-self-hosting}

Ya, sejak Maret 2025, kami mendukung opsi self-hosted. Baca blog [di sini](https://forwardemail.net/blog/docs/self-hosted-solution). Lihat [panduan self-hosted](https://forwardemail.net/self-hosted) untuk memulai. Dan bagi yang tertarik versi langkah demi langkah yang lebih terperinci, lihat panduan kami berbasis [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) atau [Debian](https://forwardemail.net/guides/selfhosted-on-debian).


## Konfigurasi Email {#email-configuration}

### Bagaimana cara memulai dan mengatur penerusan email {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Perkiraan Waktu Pengaturan:</strong>
  <span>Kurang dari 10 menit</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Memulai:
  </strong>
  <span>
    Bacalah dengan cermat dan ikuti langkah satu sampai delapan yang tercantum di bawah ini. Pastikan untuk mengganti alamat email <code>user@gmail.com</code> dengan alamat email yang ingin Anda teruskan emailnya (jika belum tepat). Demikian juga pastikan untuk mengganti <code>example.com</code> dengan nama domain kustom Anda (jika belum tepat).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">Jika Anda sudah mendaftarkan nama domain Anda di suatu tempat, maka Anda harus melewati langkah ini sepenuhnya dan langsung ke langkah dua! Jika belum, Anda dapat <a href="/domain-registration" rel="noopener noreferrer">klik di sini untuk mendaftarkan nama domain Anda</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  Apakah Anda ingat di mana Anda mendaftarkan domain Anda? Setelah Anda ingat, ikuti instruksi di bawah ini:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Penting:
  </strong>
  <span>
    Anda harus membuka tab baru dan masuk ke registrar domain Anda. Anda dapat dengan mudah mengklik "Registrar" Anda di bawah ini untuk melakukannya secara otomatis. Di tab baru ini, Anda harus menavigasi ke halaman pengelolaan DNS di registrar Anda – dan kami telah menyediakan langkah-langkah navigasi langkah demi langkah di bawah kolom "Steps to Configure". Setelah Anda menavigasi ke halaman ini di tab baru, Anda dapat kembali ke tab ini dan melanjutkan ke langkah tiga di bawah.
    <strong class="font-weight-bold">Jangan tutup tab yang dibuka tersebut; Anda akan membutuhkannya untuk langkah selanjutnya!</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Registrar</th>
      <th>Langkah untuk Mengonfigurasi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>Masuk <i class="fa fa-angle-right"></i> Domain Center <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> Edit DNS Settings</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>Masuk <i class="fa fa-angle-right"></i> Hosted Zones <i class="fa fa-angle-right"></i> (Pilih domain Anda)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>Masuk <i class="fa fa-angle-right"></i> My Servers <i class="fa fa-angle-right"></i> Domain Management <i class="fa fa-angle-right"></i> DNS Manager</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>UNTUK ROCK: Masuk <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Klik ikon ▼ di samping manage) <i class="fa fa-angle-right"></i> DNS
      <br />
      UNTUK LEGACY: Masuk <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Zone editor <i class="fa fa-angle-right"></i> (Pilih domain Anda)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>Masuk <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>Masuk <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Pilih domain Anda)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>Masuk <i class="fa fa-angle-right"></i> (Pilih domain Anda)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Manage</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>Masuk <i class="fa fa-angle-right"></i> Networking <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> More <i class="fa fa-angle-right"></i> Manage Domain</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>Masuk <i class="fa fa-angle-right"></i> Dalam tampilan kartu, klik manage pada domain Anda <i class="fa fa-angle-right"></i> Dalam tampilan daftar, klik ikon gear <i class="fa fa-angle-right"></i> DNS & Nameservers <i class="fa fa-angle-right"></i> DNS Records</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Tonton</a>
      </td>
      <td>Masuk <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> (klik ikon gear) <i class="fa fa-angle-right"></i> Klik pada DNS &amp; Nameservers di menu sebelah kiri</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>Masuk <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Manage Domains <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>Masuk <i class="fa fa-angle-right"></i> Overview <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> Simple Editor <i class="fa fa-angle-right"></i> Records</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>Masuk <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> Management <i class="fa fa-angle-right"></i> Edit the zone</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Tonton</a>
      </td>
      <td>Masuk <i class="fa fa-angle-right"></i> Manage My Domains <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> Manage DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Tonton</a>
      </td>
      <td>Masuk <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> Configure DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Tonton</a>
      </td>
      <td>Masuk <i class="fa fa-angle-right"></i> Domain List <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> Advanced DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>Masuk <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> Setup Netlify DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>Masuk <i class="fa fa-angle-right"></i> Account Manager <i class="fa fa-angle-right"></i> My Domain Names <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> Change Where Domain Points <i class="fa fa-angle-right"></i> Advanced DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Tonton</a>
      </td>
      <td>Masuk <i class="fa fa-angle-right"></i> Managed Domains <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> DNS Settings</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>Masuk <i class="fa fa-angle-right"></i> Home menu <i class="fa fa-angle-right"></i> Settings <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i>
Pengaturan lanjutan <i class="fa fa-angle-right"></i> Custom Records</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
      <td>Menggunakan CLI "now" <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>Masuk <i class="fa fa-angle-right"></i> Halaman Domains <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>Masuk <i class="fa fa-angle-right"></i> Halaman Domains <i class="fa fa-angle-right"></i> (Klik ikon <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Pilih Manage DNS Records</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>Masuk <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> My Domains</td>
    </tr>
    <tr>
      <td>Lainnya</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Penting:</strong> Tidak melihat nama registrar Anda tercantum di sini? Cukup cari di Internet dengan kata kunci "cara mengubah catatan DNS di $REGISTRAR" (ganti $REGISTRAR dengan nama registrar Anda – misalnya "cara mengubah catatan DNS di GoDaddy" jika Anda menggunakan GoDaddy).</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Menggunakan halaman pengelolaan DNS registrar Anda (tab lain yang sudah Anda buka), atur catatan "MX" berikut:
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Penting:
  </strong>
  <span>
    Perhatikan bahwa seharusnya TIDAK ada catatan MX lain yang diatur. Kedua catatan yang ditampilkan di bawah HARUS ada. Pastikan tidak ada kesalahan ketik; dan Anda memiliki kedua mx1 dan mx2 yang dieja dengan benar. Jika sudah ada catatan MX yang ada, harap hapus sepenuhnya.
    Nilai "TTL" tidak harus 3600, bisa lebih rendah atau lebih tinggi jika perlu.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Menggunakan halaman manajemen DNS registrar Anda (tab lain yang telah Anda buka), atur catatan <strong class="notranslate">TXT</strong> berikut:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Penting:
  </strong>
  <span>
    Jika Anda menggunakan paket berbayar, maka Anda harus melewati langkah ini sepenuhnya dan langsung ke langkah lima! Jika Anda tidak menggunakan paket berbayar, maka alamat yang diteruskan akan dapat dicari secara publik – buka <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> dan tingkatkan domain Anda ke paket berbayar jika diinginkan. Jika Anda ingin mempelajari lebih lanjut tentang paket berbayar lihat halaman <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Harga</a> kami. Jika tidak, Anda dapat melanjutkan memilih satu atau lebih kombinasi dari Opsi A sampai Opsi F yang tercantum di bawah.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opsi A:
  </strong>
  <span>
    Jika Anda meneruskan semua email dari domain Anda, (misalnya "all@example.com", "hello@example.com", dll) ke alamat tertentu "user@gmail.com":
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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
    Pastikan untuk mengganti nilai di atas pada kolom "Nilai" dengan alamat email Anda sendiri. Nilai "TTL" tidak harus 3600, bisa lebih rendah atau lebih tinggi jika perlu. Nilai waktu hidup ("TTL") yang lebih rendah akan memastikan perubahan di masa depan pada catatan DNS Anda tersebar ke seluruh Internet lebih cepat – anggap ini sebagai berapa lama akan disimpan dalam cache memori (dalam detik). Anda dapat mempelajari lebih lanjut tentang <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL di Wikipedia</a>.
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
      <th>Tipe</th>
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
    Jika Anda meneruskan beberapa email, maka Anda harus memisahkannya dengan koma:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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
    Anda dapat mengatur jumlah email penerusan tanpa batas – pastikan saja tidak melebihi 255 karakter dalam satu baris dan setiap baris dimulai dengan "forward-email=". Contoh diberikan di bawah ini:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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
        <code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", atau kosong</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=errors:user@gmail.com,boop:user@gmail.com</code>
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
    Anda juga dapat menentukan nama domain dalam catatan <strong class="notranslate">TXT</strong> Anda untuk memiliki penerusan alias global (misalnya "user@example.com" akan diteruskan ke "user@example.net"):
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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
      <th>Tipe</th>
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
    Anda bahkan dapat menggunakan ekspresi reguler ("regex") untuk mencocokkan alias dan untuk menangani substitusi agar meneruskan email. Lihat contoh dan bagian lengkap tentang regex berjudul <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Apakah Anda mendukung ekspresi reguler atau regex</a> di bawah.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Perlu regex lanjutan dengan substitusi?</strong> Lihat contoh dan bagian lengkap tentang regex berjudul <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Apakah Anda mendukung ekspresi reguler atau regex</a> di bawah.
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Contoh Sederhana:</strong> Jika saya ingin semua email yang dikirim ke `linus@example.com` atau `torvalds@example.com` diteruskan ke `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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
    Aturan penerusan catch-all juga dapat disebut sebagai "fall-through".
    Ini berarti bahwa email masuk yang cocok dengan setidaknya satu aturan penerusan spesifik akan digunakan sebagai pengganti catch-all.
    Aturan spesifik termasuk alamat email dan ekspresi reguler.
    <br /><br />
    Contohnya:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    Email yang dikirim ke <code>hello@example.com</code> **tidak** akan diteruskan ke <code>second@gmail.com</code> (catch-all) dengan konfigurasi ini, dan hanya akan dikirim ke <code>first@gmail.com</code>.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Menggunakan halaman manajemen DNS registrar Anda (tab lain yang sudah Anda buka), tambahkan juga <strong class="notranslate">TXT</strong> record berikut:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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
    Jika Anda menggunakan Gmail (misalnya Send Mail As) atau G Suite, maka Anda perlu menambahkan <code>include:_spf.google.com</code> ke nilai di atas, contohnya:
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
    Jika Anda sudah memiliki baris serupa dengan "v=spf1", maka Anda perlu menambahkan <code>include:spf.forwardemail.net</code> tepat sebelum setiap catatan "include:host.com" yang ada dan sebelum "-all" dalam baris yang sama, contohnya:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Perlu dicatat bahwa ada perbedaan antara "-all" dan "~all". "-" menunjukkan bahwa pemeriksaan SPF harus GAGAL jika tidak cocok, dan "~" menunjukkan bahwa pemeriksaan SPF harus SOFTFAIL. Kami menyarankan menggunakan pendekatan "-all" untuk mencegah pemalsuan domain.
    <br /><br />
    Anda juga mungkin perlu menyertakan catatan SPF untuk host mana pun yang Anda gunakan untuk mengirim email (misalnya Outlook).
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">Verifikasi catatan DNS Anda menggunakan alat "Verify Records" kami yang tersedia di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Pengaturan.

</li><li class="mb-2 mb-md-3 mb-lg-5">Kirim email uji coba untuk memastikan itu berfungsi. Perlu dicatat bahwa mungkin perlu beberapa waktu agar catatan DNS Anda menyebar.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
  </span>
    Jika Anda tidak menerima email uji coba, atau menerima email uji coba yang mengatakan "Berhati-hatilah dengan pesan ini", maka lihat jawaban untuk <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Mengapa saya tidak menerima email uji coba saya</a> dan <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Mengapa email uji coba saya yang dikirim ke diri saya sendiri di Gmail menunjukkan sebagai "mencurigakan"</a> masing-masing.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Jika Anda ingin "Kirim Email Sebagai" dari Gmail, maka Anda perlu <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">menonton video ini</a></strong>, atau ikuti langkah-langkah di bawah <a href="#how-to-send-mail-as-using-gmail">Cara Mengirim Email Sebagai Menggunakan Gmail</a>.

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
    Tip:
  </strong>
  <span>
    Add-on opsional tercantum di bawah ini. Perlu dicatat bahwa add-on ini sepenuhnya opsional dan mungkin tidak diperlukan. Kami ingin setidaknya memberikan Anda informasi tambahan jika diperlukan.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Add-on Opsional:
  </strong>
  <span>
    Jika Anda menggunakan fitur <a class="alert-link" href="#how-to-send-mail-as-using-gmail">Cara Mengirim Email Sebagai menggunakan Gmail</a>, maka Anda mungkin ingin menambahkan diri Anda ke daftar izinkan. Lihat <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">instruksi ini dari Gmail</a> tentang topik ini.
  </span>
</div>

### Bisakah saya menggunakan beberapa pertukaran MX dan server untuk penerusan lanjutan {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Ya, tetapi **Anda hanya boleh memiliki satu pertukaran MX yang tercantum dalam catatan DNS Anda**.

Jangan mencoba menggunakan "Prioritas" sebagai cara untuk mengonfigurasi beberapa pertukaran MX.

Sebaliknya, Anda perlu mengonfigurasi pertukaran MX yang ada untuk meneruskan email untuk semua alias yang tidak cocok ke pertukaran layanan kami (`mx1.forwardemail.net` dan/atau `mx2.forwardemail.net`).

Jika Anda menggunakan Google Workspace dan ingin meneruskan semua alias yang tidak cocok ke layanan kami, maka lihat <https://support.google.com/a/answer/6297084>.

Jika Anda menggunakan Microsoft 365 (Outlook) dan ingin meneruskan semua alias yang tidak cocok ke layanan kami, maka lihat <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> dan <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Bagaimana cara mengatur penjawab liburan (auto-responder keluar kantor) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Pergi ke <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias dan buat atau edit alias yang ingin Anda konfigurasikan penjawab liburan otomatis.
Anda memiliki kemampuan untuk mengonfigurasi tanggal mulai, tanggal berakhir, subjek, dan pesan, serta mengaktifkan atau menonaktifkannya kapan saja:

* Subjek dan pesan dalam bentuk teks biasa saat ini didukung (kami menggunakan paket `striptags` secara internal untuk menghapus HTML apa pun).
* Subjek dibatasi hingga 100 karakter.
* Pesan dibatasi hingga 1000 karakter.
* Pengaturan memerlukan konfigurasi Outbound SMTP (misalnya Anda perlu mengatur catatan DNS DKIM, DMARC, dan Return-Path).
  * Pergi ke <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Pengaturan <i class="fa fa-angle-right"></i> Konfigurasi Outbound SMTP dan ikuti petunjuk pengaturan.
* Respon liburan tidak dapat diaktifkan pada nama domain vanity global (misalnya [alamat sekali pakai](/disposable-addresses) tidak didukung).
* Respon liburan tidak dapat diaktifkan untuk alias dengan wildcard/catch-all (`*`) maupun ekspresi reguler.

Berbeda dengan sistem mail seperti `postfix` (misalnya yang menggunakan ekstensi filter liburan `sieve`) – Forward Email secara otomatis menambahkan tanda tangan DKIM Anda, melindungi dari masalah koneksi saat mengirim respon liburan (misalnya karena masalah koneksi SSL/TLS yang umum dan server lama yang masih dipertahankan), dan bahkan mendukung Open WKD dan enkripsi PGP untuk respon liburan.

<!--
* Untuk mencegah penyalahgunaan, 1 kredit SMTP keluar akan dipotong untuk setiap pesan respon liburan yang dikirim.
  * Semua akun berbayar secara default termasuk 300 kredit per hari. Jika Anda membutuhkan jumlah yang lebih besar, silakan hubungi kami.
-->

1. Kami hanya mengirim sekali per pengirim [yang diizinkan](#do-you-have-an-allowlist) setiap 4 hari (yang mirip dengan perilaku Gmail).

   * Cache Redis kami menggunakan sidik jari dari `alias_id` dan `sender`, di mana `alias_id` adalah ID MongoDB alias dan `sender` adalah alamat From (jika diizinkan) atau domain root dalam alamat From (jika tidak diizinkan). Untuk kesederhanaan, masa berlaku sidik jari ini di cache diatur selama 4 hari.

   * Pendekatan kami menggunakan domain root yang diurai dalam alamat From untuk pengirim yang tidak diizinkan mencegah penyalahgunaan dari pengirim yang relatif tidak dikenal (misalnya aktor jahat) yang membanjiri pesan respon liburan.

2. Kami hanya mengirim ketika MAIL FROM dan/atau From tidak kosong dan tidak mengandung (tidak peka huruf besar/kecil) [nama pengguna postmaster](#what-are-postmaster-addresses) (bagian sebelum @ dalam email).

3. Kami tidak mengirim jika pesan asli memiliki salah satu header berikut (tidak peka huruf besar/kecil):

   * Header `auto-submitted` dengan nilai tidak sama dengan `no`.
   * Header `x-auto-response-suppress` dengan nilai `dr`, `autoreply`, `auto-reply`, `auto_reply`, atau `all`
   * Header `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond`, atau `x-auto-respond` (terlepas dari nilainya).
   * Header `precedence` dengan nilai `bulk`, `autoreply`, `auto-reply`, `auto_reply`, atau `list`.

4. Kami tidak mengirim jika alamat email MAIL FROM atau From berakhiran `+donotreply`, `-donotreply`, `+noreply`, atau `-noreply`.

5. Kami tidak mengirim jika bagian nama pengguna alamat email From adalah `mdaemon` dan memiliki header `X-MDDSN-Message` yang tidak peka huruf besar/kecil.

6. Kami tidak mengirim jika ada header `content-type` yang tidak peka huruf besar/kecil dengan nilai `multipart/report`.

### Bagaimana cara mengatur SPF untuk Forward Email {#how-do-i-set-up-spf-for-forward-email}

Menggunakan halaman manajemen DNS registrar Anda, atur catatan <strong class="notranslate">TXT</strong> berikut:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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
    Jika Anda menggunakan Gmail (misalnya Kirim Email Sebagai) atau G Suite, maka Anda perlu menambahkan <code>include:_spf.google.com</code> ke nilai di atas, misalnya:
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
    Jika Anda menggunakan Microsoft Outlook atau Live.com, Anda perlu menambahkan <code>include:spf.protection.outlook.com</code> ke dalam catatan SPF <strong class="notranslate">TXT</strong> Anda, misalnya:
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
    Jika Anda sudah memiliki baris serupa dengan "v=spf1", maka Anda perlu menambahkan <code>include:spf.forwardemail.net</code> tepat sebelum catatan "include:host.com" yang sudah ada dan sebelum "-all" dalam baris yang sama, misalnya:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Perlu dicatat bahwa ada perbedaan antara "-all" dan "~all". Tanda "-" menunjukkan bahwa pemeriksaan SPF harus GAGAL jika tidak cocok, dan "~" menunjukkan bahwa pemeriksaan SPF harus SOFTFAIL. Kami menyarankan menggunakan pendekatan "-all" untuk mencegah pemalsuan domain.
    <br /><br />
    Anda juga mungkin perlu menyertakan catatan SPF untuk host mana pun yang Anda gunakan untuk mengirim email (misalnya Outlook).
  </span>
</div>

### Bagaimana cara mengatur DKIM untuk Forward Email {#how-do-i-set-up-dkim-for-forward-email}

Pergi ke <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Pengaturan <i class="fa fa-angle-right"></i> Konfigurasi SMTP Keluar dan ikuti petunjuk pengaturan.

### Bagaimana cara mengatur DMARC untuk Forward Email {#how-do-i-set-up-dmarc-for-forward-email}

Pergi ke <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Pengaturan <i class="fa fa-angle-right"></i> Konfigurasi SMTP Keluar dan ikuti petunjuk pengaturan.

### Bagaimana cara melihat Laporan DMARC {#how-do-i-view-dmarc-reports}

Forward Email menyediakan dashboard Laporan DMARC yang komprehensif yang memungkinkan Anda memantau kinerja autentikasi email Anda di semua domain dari satu antarmuka.

**Apa itu Laporan DMARC?**

Laporan DMARC (Domain-based Message Authentication, Reporting, and Conformance) adalah file XML yang dikirim oleh server email penerima yang memberi tahu Anda bagaimana email Anda diautentikasi. Laporan ini membantu Anda memahami:

* Berapa banyak email yang dikirim dari domain Anda
* Apakah email tersebut lolos autentikasi SPF dan DKIM
* Tindakan apa yang diambil oleh server penerima (terima, karantina, atau tolak)
* Alamat IP mana yang mengirim email atas nama domain Anda

**Cara Mengakses Laporan DMARC**

Pergi ke <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Laporan DMARC</a> untuk melihat dashboard Anda. Anda juga dapat mengakses laporan spesifik domain dari <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domains</a> dengan mengklik tombol "DMARC" di samping domain mana pun.

**Fitur Dashboard**

Dashboard Laporan DMARC menyediakan:

* **Metrik Ringkasan**: Total laporan yang diterima, total pesan yang dianalisis, tingkat keselarasan SPF, tingkat keselarasan DKIM, dan tingkat keberhasilan keseluruhan
* **Grafik Pesan Seiring Waktu**: Tren visual volume email dan tingkat autentikasi selama 30 hari terakhir
* **Ringkasan Keselarasan**: Grafik donat yang menunjukkan distribusi keselarasan SPF vs DKIM
* **Disposisi Pesan**: Grafik batang bertumpuk yang menunjukkan bagaimana server penerima menangani email Anda (diterima, dikarantina, atau ditolak)
* **Tabel Laporan Terbaru**: Daftar rinci laporan DMARC individu dengan fitur penyaringan dan paginasi
* **Penyaringan Domain**: Filter laporan berdasarkan domain tertentu saat mengelola beberapa domain
**Mengapa Ini Penting**

Bagi organisasi yang mengelola banyak domain (seperti perusahaan, organisasi nirlaba, atau agen), laporan DMARC sangat penting untuk:

* **Mengidentifikasi pengirim yang tidak sah**: Mendeteksi jika ada yang memalsukan domain Anda
* **Meningkatkan keterkiriman**: Memastikan email sah Anda lolos autentikasi
* **Memantau infrastruktur email**: Melacak layanan dan IP mana yang mengirim atas nama Anda
* **Kepatuhan**: Mempertahankan visibilitas autentikasi email untuk audit keamanan

Berbeda dengan layanan lain yang memerlukan alat pemantauan DMARC terpisah, Forward Email menyertakan pemrosesan dan visualisasi laporan DMARC sebagai bagian dari akun Anda tanpa biaya tambahan.

**Persyaratan**

* Laporan DMARC hanya tersedia untuk paket berbayar
* Domain Anda harus sudah dikonfigurasi DMARC (lihat [Bagaimana cara mengatur DMARC untuk Forward Email](#how-do-i-set-up-dmarc-for-forward-email))
* Laporan dikumpulkan secara otomatis saat server penerima mengirimkannya ke alamat pelaporan DMARC yang Anda konfigurasi

**Laporan Email Mingguan**

Pengguna paket berbayar secara otomatis menerima ringkasan laporan DMARC mingguan melalui email. Email ini mencakup:

* Statistik ringkasan untuk semua domain Anda
* Tingkat keselarasan SPF dan DKIM
* Rincian disposisi pesan (diterima, dikarantina, ditolak)
* Organisasi pelapor teratas (Google, Microsoft, Yahoo, dll.)
* Alamat IP dengan masalah keselarasan yang mungkin perlu diperhatikan
* Tautan langsung ke dasbor Laporan DMARC Anda

Laporan mingguan dikirim secara otomatis dan tidak dapat dinonaktifkan secara terpisah dari notifikasi email lainnya.

### Bagaimana cara menghubungkan dan mengonfigurasi kontak saya {#how-do-i-connect-and-configure-my-contacts}

**Untuk mengonfigurasi kontak Anda, gunakan URL CardDAV:** `https://carddav.forwardemail.net` (atau cukup `carddav.forwardemail.net` jika klien Anda mengizinkannya)

### Bagaimana cara menghubungkan dan mengonfigurasi kalender saya {#how-do-i-connect-and-configure-my-calendars}

**Untuk mengonfigurasi kalender Anda, gunakan URL CalDAV:** `https://caldav.forwardemail.net` (atau cukup `caldav.forwardemail.net` jika klien Anda mengizinkannya)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Example Setup" />

### Bagaimana cara menambahkan lebih banyak kalender dan mengelola kalender yang ada {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Jika Anda ingin menambahkan kalender tambahan, cukup tambahkan URL kalender baru: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**pastikan mengganti `calendar-name` dengan nama kalender yang Anda inginkan**)

Anda dapat mengubah nama dan warna kalender setelah dibuat – cukup gunakan aplikasi kalender pilihan Anda (misalnya Apple Mail atau [Thunderbird](https://thunderbird.net)).

### Bagaimana cara menghubungkan dan mengonfigurasi tugas dan pengingat {#how-do-i-connect-and-configure-tasks-and-reminders}

**Untuk mengonfigurasi tugas dan pengingat, gunakan URL CalDAV yang sama dengan kalender:** `https://caldav.forwardemail.net` (atau cukup `caldav.forwardemail.net` jika klien Anda mengizinkannya)

Tugas dan pengingat akan otomatis dipisahkan dari acara kalender ke dalam koleksi kalender "Reminders" atau "Tasks" tersendiri.

**Instruksi pengaturan berdasarkan platform:**

**macOS/iOS:**

1. Tambahkan akun CalDAV baru di System Preferences > Internet Accounts (atau Settings > Accounts di iOS)
2. Gunakan `caldav.forwardemail.net` sebagai server
3. Masukkan alias Forward Email dan kata sandi yang dihasilkan
4. Setelah pengaturan, Anda akan melihat koleksi "Calendar" dan "Reminders"
5. Gunakan aplikasi Reminders untuk membuat dan mengelola tugas

**Android dengan Tasks.org:**

1. Instal Tasks.org dari Google Play Store atau F-Droid
2. Buka Settings > Synchronization > Add Account > CalDAV
3. Masukkan server: `https://caldav.forwardemail.net`
4. Masukkan alias Forward Email dan kata sandi yang dihasilkan
5. Tasks.org akan otomatis menemukan kalender tugas Anda

**Thunderbird:**

1. Instal add-on Lightning jika belum terpasang
2. Buat kalender baru dengan tipe "CalDAV"
3. Gunakan URL: `https://caldav.forwardemail.net`
4. Masukkan kredensial Forward Email Anda
5. Acara dan tugas akan tersedia di antarmuka kalender

### Mengapa saya tidak bisa membuat tugas di macOS Reminders {#why-cant-i-create-tasks-in-macos-reminders}
Jika Anda mengalami kesulitan membuat tugas di macOS Reminders, coba langkah pemecahan masalah berikut:

1. **Periksa pengaturan akun**: Pastikan akun CalDAV Anda dikonfigurasi dengan benar menggunakan `caldav.forwardemail.net`

2. **Verifikasi kalender terpisah**: Anda harus melihat kedua "Calendar" dan "Reminders" di akun Anda. Jika Anda hanya melihat "Calendar", dukungan tugas mungkin belum sepenuhnya diaktifkan.

3. **Segarkan akun**: Coba hapus dan tambahkan kembali akun CalDAV Anda di System Preferences > Internet Accounts

4. **Periksa konektivitas server**: Uji apakah Anda dapat mengakses `https://caldav.forwardemail.net` di browser Anda

5. **Verifikasi kredensial**: Pastikan Anda menggunakan alias email yang benar dan kata sandi yang dihasilkan (bukan kata sandi akun Anda)

6. **Paksa sinkronisasi**: Di aplikasi Reminders, coba buat tugas lalu segarkan sinkronisasi secara manual

**Masalah umum:**

* **"Reminders calendar not found"**: Server mungkin membutuhkan waktu sebentar untuk membuat koleksi Reminders saat akses pertama
* **Tugas tidak tersinkronisasi**: Periksa bahwa kedua perangkat menggunakan kredensial akun CalDAV yang sama
* **Konten campuran**: Pastikan tugas dibuat di kalender "Reminders", bukan "Calendar" umum

### Bagaimana cara mengatur Tasks.org di Android {#how-do-i-set-up-tasksorg-on-android}

Tasks.org adalah pengelola tugas open-source populer yang bekerja sangat baik dengan dukungan tugas CalDAV Forward Email.

**Instalasi dan Pengaturan:**

1. **Pasang Tasks.org**:
   * Dari Google Play Store: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * Dari F-Droid: [Tasks.org on F-Droid](https://f-droid.org/packages/org.tasks/)

2. **Konfigurasikan sinkronisasi CalDAV**:
   * Buka Tasks.org
   * Pergi ke ☰ Menu > Settings > Synchronization
   * Ketuk "Add Account"
   * Pilih "CalDAV"

3. **Masukkan pengaturan Forward Email**:
   * **Server URL**: `https://caldav.forwardemail.net`
   * **Username**: Alias Forward Email Anda (misal, `you@yourdomain.com`)
   * **Password**: Kata sandi khusus alias yang Anda buat
   * Ketuk "Add Account"

4. **Penemuan akun**:
   * Tasks.org akan secara otomatis menemukan kalender tugas Anda
   * Anda harus melihat koleksi "Reminders" muncul
   * Ketuk "Subscribe" untuk mengaktifkan sinkronisasi kalender tugas

5. **Uji sinkronisasi**:
   * Buat tugas uji di Tasks.org
   * Periksa apakah muncul di klien CalDAV lain (seperti macOS Reminders)
   * Verifikasi perubahan tersinkronisasi dua arah

**Fitur yang tersedia:**

* ✅ Pembuatan dan pengeditan tugas
* ✅ Tanggal jatuh tempo dan pengingat
* ✅ Penyelesaian dan status tugas
* ✅ Tingkat prioritas
* ✅ Subtugas dan hierarki tugas
* ✅ Tag dan kategori
* ✅ Sinkronisasi dua arah dengan klien CalDAV lain

**Pemecahan masalah:**

* Jika tidak ada kalender tugas yang muncul, coba segarkan secara manual di pengaturan Tasks.org
* Pastikan Anda sudah membuat setidaknya satu tugas di server (Anda bisa membuatnya dulu di macOS Reminders)
* Periksa konektivitas jaringan ke `caldav.forwardemail.net`

### Bagaimana cara mengatur SRS untuk Forward Email {#how-do-i-set-up-srs-for-forward-email}

Kami secara otomatis mengonfigurasi [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – Anda tidak perlu melakukannya sendiri.

### Bagaimana cara mengatur MTA-STS untuk Forward Email {#how-do-i-set-up-mta-sts-for-forward-email}

Silakan lihat [bagian kami tentang MTA-STS](#do-you-support-mta-sts) untuk informasi lebih lanjut.

### Bagaimana cara menambahkan foto profil ke alamat email saya {#how-do-i-add-a-profile-picture-to-my-email-address}

Jika Anda menggunakan Gmail, ikuti langkah-langkah berikut:

1. Buka <https://google.com> dan keluar dari semua akun email
2. Klik "Sign In" dan pada menu drop-down klik "other account"
3. Pilih "Use another account"
4. Pilih "Create account"
5. Pilih "Use my current email address instead"
6. Masukkan alamat email domain kustom Anda
7. Ambil email verifikasi yang dikirim ke alamat email Anda
8. Masukkan kode verifikasi dari email tersebut
9. Lengkapi informasi profil untuk akun Google baru Anda
10. Setujui semua kebijakan Privasi dan Ketentuan Penggunaan
11. Buka <https://google.com> dan di pojok kanan atas, klik ikon profil Anda, lalu klik tombol "change"
12. Unggah foto atau avatar baru untuk akun Anda
13. Perubahan akan memakan waktu sekitar 1-2 jam untuk menyebar, tapi terkadang bisa sangat cepat.
14. Kirim email uji dan foto profil akan muncul.
## Fitur Lanjutan {#advanced-features}

### Apakah Anda mendukung newsletter atau daftar mailing untuk email terkait pemasaran {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Ya, Anda dapat membaca lebih lanjut di <https://forwardemail.net/guides/newsletter-with-listmonk>.

Harap dicatat bahwa untuk menjaga reputasi IP dan memastikan keterkiriman, Forward Email memiliki proses tinjauan manual berdasarkan domain untuk **persetujuan newsletter**. Kirim email ke <support@forwardemail.net> atau buka [permintaan bantuan](https://forwardemail.net/help) untuk persetujuan. Biasanya ini memakan waktu kurang dari 24 jam, dengan sebagian besar permintaan diproses dalam 1-2 jam. Dalam waktu dekat kami berencana membuat proses ini instan dengan kontrol spam tambahan dan pemberitahuan. Proses ini memastikan email Anda sampai ke kotak masuk dan pesan Anda tidak ditandai sebagai spam.

### Apakah Anda mendukung pengiriman email dengan API {#do-you-support-sending-email-with-api}

Ya, sejak Mei 2023 kami mendukung pengiriman email dengan API sebagai tambahan untuk semua pengguna berbayar.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Penting:
  </strong>
  <span>
    Harap pastikan Anda telah membaca <a href="/terms" class="alert-link" target="_blank">Ketentuan</a>, <a href="/privacy" class="alert-link" target="_blank">Kebijakan Privasi</a>, dan <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Batas SMTP Keluar</a> &ndash; penggunaan Anda dianggap sebagai pengakuan dan persetujuan.
  </span>
</div>

Silakan lihat bagian kami tentang [Email](/email-api#outbound-emails) dalam dokumentasi API kami untuk opsi, contoh, dan wawasan lebih lanjut.

Untuk mengirim email keluar dengan API kami, Anda harus menggunakan token API Anda yang tersedia di bawah [Keamanan Saya](/my-account/security).

### Apakah Anda mendukung penerimaan email dengan IMAP {#do-you-support-receiving-email-with-imap}

Ya, sejak 16 Oktober 2023 kami mendukung penerimaan email melalui IMAP sebagai tambahan untuk semua pengguna berbayar.  **Harap baca artikel mendalam kami** tentang [cara fitur penyimpanan kotak surat SQLite terenkripsi kami bekerja](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Penting:
  </strong>
  <span>
    Harap pastikan Anda telah membaca <a href="/terms" class="alert-link" target="_blank">Ketentuan</a> dan <a href="/privacy" class="alert-link" target="_blank">Kebijakan Privasi</a> &ndash; penggunaan Anda dianggap sebagai pengakuan dan persetujuan.
  </span>
</div>

1. Buat alias baru untuk domain Anda di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias (misalnya <code><hello@example.com></code>)

2. Klik pada <strong class="text-success"><i class="fa fa-key"></i> Buat Kata Sandi</strong> di sebelah alias yang baru dibuat. Salin ke clipboard Anda dan simpan kata sandi yang dihasilkan dengan aman yang ditampilkan di layar.

3. Menggunakan aplikasi email pilihan Anda, tambahkan atau konfigurasikan akun dengan alias yang baru dibuat (misalnya <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Kami merekomendasikan menggunakan <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, atau <a href="/blog/open-source" class="alert-link" target="_blank">alternatif sumber terbuka dan berfokus pada privasi</a>.</span>
   </div>

4. Saat diminta nama server IMAP, masukkan `imap.forwardemail.net`

5. Saat diminta port server IMAP, masukkan `993` (SSL/TLS) – lihat [port IMAP alternatif](/faq#what-are-your-imap-server-configuration-settings) jika perlu
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Jika Anda menggunakan Thunderbird, pastikan "Keamanan koneksi" diatur ke "SSL/TLS" dan metode Otentikasi diatur ke "Kata sandi normal".</span>
   </div>
6. Ketika diminta kata sandi server IMAP, tempelkan kata sandi dari <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> pada langkah 2 di atas

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

</div>

### Apakah Anda mendukung POP3 {#do-you-support-pop3}

Ya, sejak 4 Desember 2023 kami mendukung [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) sebagai tambahan untuk semua pengguna berbayar.  **Silakan baca artikel mendalam kami** tentang [cara fitur penyimpanan kotak surat SQLite terenkripsi kami bekerja](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Penting:
  </strong>
  <span>
    Pastikan Anda telah membaca <a href="/terms" class="alert-link" target="_blank">Syarat dan Ketentuan</a> dan <a href="/privacy" class="alert-link" target="_blank">Kebijakan Privasi</a> kami &ndash; penggunaan Anda dianggap sebagai pengakuan dan persetujuan.
  </span>
</div>

1. Buat alias baru untuk domain Anda di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias (misalnya <code><hello@example.com></code>)

2. Klik pada <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> di sebelah alias yang baru dibuat.  Salin ke clipboard Anda dan simpan kata sandi yang dihasilkan dengan aman yang ditampilkan di layar.

3. Menggunakan aplikasi email pilihan Anda, tambahkan atau konfigurasikan akun dengan alias yang baru dibuat (misalnya <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Kami merekomendasikan menggunakan <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, atau <a href="/blog/open-source" class="alert-link" target="_blank">alternatif sumber terbuka dan berfokus pada privasi</a>.</span>
   </div>

4. Ketika diminta nama server POP3, masukkan `pop3.forwardemail.net`

5. Ketika diminta port server POP3, masukkan `995` (SSL/TLS) – lihat [port POP3 alternatif](/faq#what-are-your-pop3-server-configuration-settings) jika perlu
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Jika Anda menggunakan Thunderbird, pastikan "Keamanan koneksi" diatur ke "SSL/TLS" dan metode autentikasi diatur ke "Password Normal".</span>
   </div>

6. Ketika diminta kata sandi server POP3, tempelkan kata sandi dari <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> pada langkah 2 di atas

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

</div>

### Apakah Anda mendukung kalender (CalDAV) {#do-you-support-calendars-caldav}

Ya, sejak 5 Februari 2024 kami telah menambahkan fitur ini.  Server kami adalah `caldav.forwardemail.net` dan juga dipantau di <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">halaman status</a> kami.
It supports both IPv4 and IPv6 and is available over port `443` (HTTPS).

| Login    | Contoh                     | Deskripsi                                                                                                                                                                                |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`         | Alamat email dari alias yang ada untuk domain di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a>.          |
| Password | `************************` | Kata sandi yang dihasilkan khusus untuk alias.                                                                                                                                           |

Untuk menggunakan dukungan kalender, **pengguna** harus merupakan alamat email dari alias yang ada untuk domain di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> – dan **kata sandi** harus merupakan kata sandi yang dihasilkan khusus untuk alias.

### Apakah Anda mendukung tugas dan pengingat (CalDAV VTODO) {#do-you-support-tasks-and-reminders-caldav-vtodo}

Ya, sejak 14 Oktober 2025 kami telah menambahkan dukungan CalDAV VTODO untuk tugas dan pengingat. Ini menggunakan server yang sama dengan dukungan kalender kami: `caldav.forwardemail.net`.

Server CalDAV kami mendukung komponen acara kalender (VEVENT) dan tugas (VTODO) menggunakan **kalender terpadu**. Ini berarti setiap kalender dapat berisi acara dan tugas, memberikan fleksibilitas maksimum dan kompatibilitas di semua klien CalDAV.

**Cara kerja kalender dan daftar:**

* **Setiap kalender mendukung acara dan tugas** - Anda dapat menambahkan acara, tugas, atau keduanya ke kalender mana pun
* **Daftar Apple Reminders** - Setiap daftar yang Anda buat di Apple Reminders menjadi kalender terpisah di server
* **Banyak kalender** - Anda dapat membuat sebanyak mungkin kalender yang Anda butuhkan, masing-masing dengan nama, warna, dan organisasi sendiri
* **Sinkronisasi lintas klien** - Tugas dan acara tersinkronisasi dengan mulus di semua klien yang kompatibel

**Klien tugas yang didukung:**

* **macOS Reminders** - Dukungan asli penuh untuk pembuatan, pengeditan, penyelesaian, dan sinkronisasi tugas
* **iOS Reminders** - Dukungan asli penuh di semua perangkat iOS
* **Tasks.org (Android)** - Manajer tugas open-source populer dengan sinkronisasi CalDAV
* **Thunderbird** - Dukungan tugas dan kalender di klien email desktop
* **Manajer tugas kompatibel CalDAV lainnya** - Dukungan komponen VTODO standar

**Fitur tugas yang didukung:**

* Pembuatan, pengeditan, dan penghapusan tugas
* Tanggal jatuh tempo dan tanggal mulai
* Status penyelesaian tugas (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* Tingkat prioritas tugas
* Tugas berulang
* Deskripsi dan catatan tugas
* Sinkronisasi multi-perangkat
* Subtugas dengan properti RELATED-TO
* Pengingat tugas dengan VALARM

Kredensial login sama seperti untuk dukungan kalender:

| Login    | Contoh                     | Deskripsi                                                                                                                                                                                |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`         | Alamat email dari alias yang ada untuk domain di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a>.          |
| Password | `************************` | Kata sandi yang dihasilkan khusus untuk alias.                                                                                                                                           |

**Catatan penting:**

* **Setiap daftar Reminders adalah kalender terpisah** - Saat Anda membuat daftar baru di Apple Reminders, itu membuat kalender baru di server CalDAV
* **Pengguna Thunderbird** - Anda perlu berlangganan secara manual ke setiap kalender/daftar yang ingin Anda sinkronkan, atau gunakan URL home kalender: `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **Pengguna Apple** - Penemuan kalender terjadi secara otomatis, sehingga semua kalender dan daftar Anda akan muncul di Calendar.app dan Reminders.app
* **Kalender terpadu** - Semua kalender mendukung acara dan tugas, memberi Anda fleksibilitas dalam mengatur data Anda
### Apakah Anda mendukung kontak (CardDAV) {#do-you-support-contacts-carddav}

Ya, sejak 12 Juni 2025 kami telah menambahkan fitur ini. Server kami adalah `carddav.forwardemail.net` dan juga dipantau di <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">halaman status</a> kami.

Ini mendukung baik IPv4 maupun IPv6 dan tersedia melalui port `443` (HTTPS).

| Login    | Contoh                    | Deskripsi                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`         | Alamat email dari alias yang ada untuk domain di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a>. |
| Password | `************************` | Kata sandi yang dihasilkan khusus untuk alias.                                                                                                                                                        |

Untuk menggunakan dukungan kontak, **user** harus berupa alamat email dari alias yang ada untuk domain di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> – dan **password** harus berupa kata sandi yang dihasilkan khusus untuk alias.

### Apakah Anda mendukung pengiriman email dengan SMTP {#do-you-support-sending-email-with-smtp}

Ya, sejak Mei 2023 kami mendukung pengiriman email dengan SMTP sebagai tambahan untuk semua pengguna berbayar.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Penting:
  </strong>
  <span>
    Harap pastikan Anda telah membaca <a href="/terms" class="alert-link" target="_blank">Ketentuan</a>, <a href="/privacy" class="alert-link" target="_blank">Kebijakan Privasi</a>, dan <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Batas SMTP Keluar</a> kami &ndash; penggunaan Anda dianggap sebagai pengakuan dan persetujuan.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Penting:
  </strong>
  <span>
    Jika Anda menggunakan Gmail, silakan lihat <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Panduan Kirim Email Sebagai dengan Gmail</a>. Jika Anda seorang pengembang, silakan lihat <a class="alert-link" href="/email-api#outbound-emails" target="_blank">dokumen API email</a> kami.
  </span>
</div>

1. Pergi ke <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Pengaturan <i class="fa fa-angle-right"></i> Konfigurasi SMTP Keluar dan ikuti petunjuk pengaturan

2. Buat alias baru untuk domain Anda di bawah <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias (misalnya <code><hello@example.com></code>)

3. Klik pada <strong class="text-success"><i class="fa fa-key"></i> Buat Kata Sandi</strong> di sebelah alias yang baru dibuat. Salin ke clipboard Anda dan simpan dengan aman kata sandi yang dihasilkan yang ditampilkan di layar.

4. Menggunakan aplikasi email pilihan Anda, tambahkan atau konfigurasikan akun dengan alias yang baru dibuat (misalnya <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Kami merekomendasikan menggunakan <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, atau <a href="/blog/open-source" class="alert-link" target="_blank">alternatif sumber terbuka dan berfokus pada privasi</a>.</span>
   </div>
5. Ketika diminta untuk nama server SMTP, masukkan `smtp.forwardemail.net`

6. Ketika diminta untuk port server SMTP, masukkan `465` (SSL/TLS) – lihat [alternate SMTP ports](/faq#what-are-your-smtp-server-configuration-settings) jika perlu
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Jika Anda menggunakan Thunderbird, pastikan "Connection security" diatur ke "SSL/TLS" dan metode Autentikasi diatur ke "Normal password".</span>
   </div>

7. Ketika diminta untuk kata sandi server SMTP, tempelkan kata sandi dari <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> pada langkah 3 di atas

8. **Simpan pengaturan Anda dan kirim email uji coba pertama Anda** – jika Anda mengalami masalah, silakan <a href="/help">hubungi kami</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Penting:
  </strong>
  <span>
    Harap dicatat bahwa untuk menjaga reputasi IP dan memastikan keterkiriman, kami memiliki proses tinjauan manual berdasarkan domain untuk persetujuan SMTP keluar. Proses ini biasanya memakan waktu kurang dari 24 jam, dengan sebagian besar permintaan diproses dalam 1-2 jam. Dalam waktu dekat kami bertujuan untuk membuat proses ini instan dengan kontrol spam tambahan dan pemberitahuan. Proses ini memastikan email Anda sampai ke kotak masuk dan pesan Anda tidak ditandai sebagai spam.
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

</div>

### Apakah Anda mendukung OpenPGP/MIME, enkripsi ujung-ke-ujung ("E2EE"), dan Web Key Directory ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Ya, kami mendukung [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [enkripsi ujung-ke-ujung ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption), dan penemuan kunci publik menggunakan [Web Key Directory ("WKD")](https://wiki.gnupg.org/WKD). Anda dapat mengonfigurasi OpenPGP menggunakan [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) atau [meng-host kunci Anda sendiri](https://wiki.gnupg.org/WKDHosting) (lihat [gist ini untuk pengaturan server WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* Pencarian WKD di-cache selama 1 jam untuk memastikan pengiriman email tepat waktu → oleh karena itu jika Anda menambahkan, mengubah, atau menghapus kunci WKD Anda, harap kirim email kepada kami di `support@forwardemail.net` dengan alamat email Anda agar kami dapat membersihkan cache secara manual.
* Kami mendukung enkripsi PGP untuk pesan yang diteruskan melalui pencarian WKD atau menggunakan kunci PGP yang diunggah di antarmuka kami.
* Kunci yang diunggah akan diutamakan selama kotak centang PGP diaktifkan/dicentang.
* Pesan yang dikirim ke webhook saat ini tidak dienkripsi dengan PGP.
* Jika Anda memiliki beberapa alias yang cocok untuk alamat penerusan tertentu (misalnya kombinasi regex/wildcard/tepat) dan jika lebih dari satu dari alias tersebut memiliki kunci PGP yang diunggah dan PGP dicentang → maka kami akan mengirimkan email peringatan kesalahan dan tidak akan mengenkripsi pesan dengan kunci PGP yang Anda unggah. Ini sangat jarang dan biasanya hanya berlaku untuk pengguna tingkat lanjut dengan aturan alias yang kompleks.
* **Enkripsi PGP tidak akan diterapkan pada penerusan email melalui server MX kami jika pengirim memiliki kebijakan DMARC reject. Jika Anda memerlukan enkripsi PGP pada *semua* email maka kami sarankan menggunakan layanan IMAP kami dan mengonfigurasi kunci PGP Anda untuk alias Anda untuk email masuk.**

**Anda dapat memvalidasi pengaturan Web Key Directory Anda di <https://wkd.chimbosonic.com/> (open-source) atau <https://www.webkeydirectory.com/> (proprietary).**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Enkripsi Otomatis:
  </strong>
  <span>Jika Anda menggunakan <a href="#do-you-support-sending-email-with-smtp" class="alert-link">layanan SMTP keluar kami</a> dan mengirim pesan yang tidak terenkripsi, maka kami akan secara otomatis mencoba mengenkripsi pesan berdasarkan penerima menggunakan <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
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

1. Unduh dan pasang plugin yang direkomendasikan untuk klien email Anda di bawah ini:

   | Klien Email    | Platform | Plugin yang Direkomendasikan                                                                                                                                                          | Catatan                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | -------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird    | Desktop  | [Konfigurasikan OpenPGP di Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird memiliki dukungan bawaan untuk OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                     |
   | Gmail          | Browser  | [Mailvelope](https://mailvelope.com/) atau [FlowCrypt](https://flowcrypt.com/download) (lisensi proprietary)                                                                          | Gmail tidak mendukung OpenPGP, namun Anda dapat mengunduh plugin open-source [Mailvelope](https://mailvelope.com/) atau [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                   |
   | Apple Mail     | macOS    | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                          | Apple Mail tidak mendukung OpenPGP, namun Anda dapat mengunduh plugin open-source [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation).                                                                                                                                                                                                                                                        |
   | Apple Mail     | iOS      | [PGPro](https://github.com/opensourceios/PGPro/) atau [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (lisensi proprietary)                       | Apple Mail tidak mendukung OpenPGP, namun Anda dapat mengunduh plugin open-source [PGPro](https://github.com/opensourceios/PGPro/) atau [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                   |
   | Outlook        | Windows  | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                          | Klien email desktop Outlook tidak mendukung OpenPGP, namun Anda dapat mengunduh plugin open-source [gpg4win](https://www.gpg4win.de/index.html).                                                                                                                                                                                                                                                                                      |
   | Outlook        | Browser  | [Mailvelope](https://mailvelope.com/) atau [FlowCrypt](https://flowcrypt.com/download) (lisensi proprietary)                                                                          | Klien email berbasis web Outlook tidak mendukung OpenPGP, namun Anda dapat mengunduh plugin open-source [Mailvelope](https://mailvelope.com/) atau [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                        |
   | Android        | Mobile   | [OpenKeychain](https://www.openkeychain.org/) atau [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                     | [Klien email Android](/blog/open-source/android-email-clients) seperti [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) dan [FairEmail](https://github.com/M66B/FairEmail) keduanya mendukung plugin open-source [OpenKeychain](https://www.openkeychain.org/). Anda juga dapat menggunakan plugin open-source (lisensi proprietary) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
   | Google Chrome  | Browser  | [Mailvelope](https://mailvelope.com/) atau [FlowCrypt](https://flowcrypt.com/download) (lisensi proprietary)                                                                          | Anda dapat mengunduh ekstensi browser open-source [Mailvelope](https://mailvelope.com/) atau [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                               |
   | Mozilla Firefox| Browser  | [Mailvelope](https://mailvelope.com/) atau [FlowCrypt](https://flowcrypt.com/download) (lisensi proprietary)                                                                          | Anda dapat mengunduh ekstensi browser open-source [Mailvelope](https://mailvelope.com/) atau [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                               |
   | Microsoft Edge | Browser  | [Mailvelope](https://mailvelope.com/)                                                                                                                                                 | Anda dapat mengunduh ekstensi browser open-source [Mailvelope](https://mailvelope.com/).                                                                                                                                                                                                                                                                                                                                                |
   | Brave          | Browser  | [Mailvelope](https://mailvelope.com/) atau [FlowCrypt](https://flowcrypt.com/download) (lisensi proprietary)                                                                          | Anda dapat mengunduh ekstensi browser open-source [Mailvelope](https://mailvelope.com/) atau [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                               |
   | Balsa          | Desktop  | [Konfigurasikan OpenPGP di Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                      | Balsa memiliki dukungan bawaan untuk OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                           |
   | KMail          | Desktop  | [Konfigurasikan OpenPGP di KMail](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                           | KMail memiliki dukungan bawaan untuk OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                           |
   | GNOME Evolution| Desktop  | [Konfigurasikan OpenPGP di Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                         | GNOME Evolution memiliki dukungan bawaan untuk OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                 |
   | Terminal       | Desktop  | [Konfigurasikan gpg di Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                   | Anda dapat menggunakan [alat baris perintah gpg open-source](https://www.gnupg.org/download/) untuk menghasilkan kunci baru dari baris perintah.                                                                                                                                                                                                                                                                                        |
2. Buka plugin, buat kunci publik Anda, dan konfigurasikan klien email Anda untuk menggunakannya.

3. Unggah kunci publik Anda di <https://keys.openpgp.org/upload>.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Anda dapat mengunjungi <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> untuk mengelola kunci Anda di masa depan.</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tambahan Opsional:
     </strong>
     <span>
       Jika Anda menggunakan layanan <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">penyimpanan terenkripsi (IMAP/POP3)</a> kami dan ingin <i>semua</i> email yang disimpan di database SQLite Anda (yang sudah terenkripsi) dienkripsi dengan kunci publik Anda, maka pergi ke <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias (misalnya <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Edit <i class="fa fa-angle-right"></i> OpenPGP dan unggah kunci publik Anda.
     </span>
   </div>

4. Tambahkan rekaman `CNAME` baru ke nama domain Anda (misalnya `example.com`):

   <table class="table table-striped table-hover my-3">
     <thead class="thead-dark">
       <tr>
         <th>Nama/Host/Alias</th>
         <th class="text-center">TTL</th>
         <th>Tipe</th>
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
       Tip:
     </strong>
     <span>Jika alias Anda menggunakan <a class="alert-link" href="/disposable-addresses" target="_blank">domain vanity/disposable</a> kami (misalnya <code>hideaddress.net</code>), maka Anda dapat melewati langkah ini.</span>
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

### Apakah Anda mendukung enkripsi S/MIME {#do-you-support-smime-encryption}

Ya, kami mendukung enkripsi [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME) seperti yang didefinisikan dalam [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551). S/MIME menyediakan enkripsi ujung-ke-ujung menggunakan sertifikat X.509, yang banyak didukung oleh klien email perusahaan.

Kami mendukung sertifikat RSA dan ECC (Elliptic Curve Cryptography):

* **Sertifikat RSA**: minimal 2048-bit, direkomendasikan 4096-bit
* **Sertifikat ECC**: kurva NIST P-256, P-384, dan P-521

Untuk mengonfigurasi enkripsi S/MIME untuk alias Anda:

1. Dapatkan sertifikat S/MIME dari Otoritas Sertifikat (CA) terpercaya atau buat sertifikat self-signed untuk pengujian.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Sertifikat S/MIME gratis tersedia dari penyedia seperti <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> atau <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a>.</span>
   </div>

2. Ekspor sertifikat Anda dalam format PEM (hanya sertifikat publik, bukan kunci privat).

3. Pergi ke <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias (misalnya <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> Edit <i class="fa fa-angle-right"></i> S/MIME dan unggah sertifikat publik Anda.
4. Setelah dikonfigurasi, semua email masuk ke alias Anda akan dienkripsi menggunakan sertifikat S/MIME Anda sebelum disimpan atau diteruskan.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Catatan:
     </strong>
     <span>
       Enkripsi S/MIME diterapkan pada pesan masuk yang belum dienkripsi. Jika pesan sudah dienkripsi dengan OpenPGP atau S/MIME, pesan tersebut tidak akan dienkripsi ulang.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Penting:
     </strong>
     <span>
       Enkripsi S/MIME tidak akan diterapkan pada penerusan email melalui server MX kami jika pengirim memiliki kebijakan DMARC reject. Jika Anda memerlukan enkripsi S/MIME pada <em>semua</em> email maka kami sarankan menggunakan layanan IMAP kami dan mengonfigurasi sertifikat S/MIME Anda untuk alias Anda pada email masuk.
     </span>
   </div>

Klien email berikut memiliki dukungan S/MIME bawaan:

| Klien Email       | Platform | Catatan                                                                                                            |
| ----------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| Apple Mail        | macOS    | Dukungan S/MIME bawaan. Pergi ke Mail > Preferences > Accounts > akun Anda > Trust untuk mengonfigurasi sertifikat. |
| Apple Mail        | iOS      | Dukungan S/MIME bawaan. Pergi ke Settings > Mail > Accounts > akun Anda > Advanced > S/MIME untuk mengonfigurasi.  |
| Microsoft Outlook | Windows  | Dukungan S/MIME bawaan. Pergi ke File > Options > Trust Center > Trust Center Settings > Email Security untuk mengonfigurasi. |
| Microsoft Outlook | macOS    | Dukungan S/MIME bawaan. Pergi ke Tools > Accounts > Advanced > Security untuk mengonfigurasi.                      |
| Thunderbird       | Desktop  | Dukungan S/MIME bawaan. Pergi ke Account Settings > End-To-End Encryption > S/MIME untuk mengonfigurasi.           |
| GNOME Evolution   | Desktop  | Dukungan S/MIME bawaan. Pergi ke Edit > Preferences > Mail Accounts > akun Anda > Security untuk mengonfigurasi.   |
| KMail             | Desktop  | Dukungan S/MIME bawaan. Pergi ke Settings > Configure KMail > Identities > identitas Anda > Cryptography untuk mengonfigurasi. |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Selamat!
    </strong>
    <span>
      Anda telah berhasil mengonfigurasi enkripsi S/MIME untuk alias Anda.
    </span>
  </div>
</div>

### Apakah Anda mendukung penyaringan email Sieve {#do-you-support-sieve-email-filtering}

Ya! Kami mendukung penyaringan email [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) seperti yang didefinisikan dalam [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228). Sieve adalah bahasa skrip yang kuat dan standar untuk penyaringan email sisi server yang memungkinkan Anda secara otomatis mengatur, menyaring, dan merespons pesan masuk.

#### Ekstensi Sieve yang Didukung {#supported-sieve-extensions}

Kami mendukung serangkaian lengkap ekstensi Sieve:

| Ekstensi                    | RFC                                                                                     | Deskripsi                                       |
| --------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `fileinto`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                               | Memasukkan pesan ke folder tertentu              |
| `reject` / `ereject`        | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                               | Menolak pesan dengan kesalahan                   |
| `vacation`                  | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                               | Balasan otomatis liburan/di luar kantor           |
| `vacation-seconds`          | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                               | Interval balasan liburan yang lebih rinci         |
| `imap4flags`                | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                               | Mengatur flag IMAP (\Seen, \Flagged, dll.)        |
| `envelope`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                               | Menguji pengirim/penerima amplop                  |
| `body`                      | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                               | Menguji isi badan pesan                            |
| `variables`                 | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                               | Menyimpan dan menggunakan variabel dalam skrip   |
| `relational`                | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                               | Perbandingan relasional (lebih besar, lebih kecil) |
| `comparator-i;ascii-numeric`| [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                               | Perbandingan numerik                              |
| `copy`                      | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                               | Menyalin pesan saat mengalihkan                   |
| `editheader`                | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                               | Menambah atau menghapus header pesan              |
| `date`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                               | Menguji nilai tanggal/waktu                        |
| `index`                     | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                               | Mengakses kemunculan header tertentu              |
| `regex`                     | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex)  | Pencocokan ekspresi reguler                        |
| `enotify`                   | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                               | Mengirim notifikasi (misalnya, mailto:)           |
| `environment`               | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                               | Mengakses informasi lingkungan                     |
| `mailbox`                   | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                               | Menguji keberadaan mailbox, membuat mailbox       |
| `special-use`               | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                               | Memasukkan ke mailbox penggunaan khusus (\Junk, \Trash) |
| `duplicate`                 | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                               | Mendeteksi pesan duplikat                          |
| `ihave`                     | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                               | Menguji ketersediaan ekstensi                      |
| `subaddress`                | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                               | Mengakses bagian alamat user+detail                |
#### Ekstensi yang Tidak Didukung {#extensions-not-supported}

Ekstensi berikut saat ini tidak didukung:

| Ekstensi                                                       | Alasan                                                              |
| --------------------------------------------------------------- | ------------------------------------------------------------------- |
| `include`                                                       | Risiko keamanan (injeksi skrip) dan memerlukan penyimpanan skrip global |
| `mboxmetadata` / `servermetadata`                               | Memerlukan dukungan ekstensi IMAP METADATA                          |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | Manipulasi pohon MIME yang kompleks belum diimplementasikan         |

#### Contoh Skrip Sieve {#example-sieve-scripts}

**Memasukkan newsletter ke dalam folder:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**Balasan otomatis saat sedang cuti:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "Saya sedang tidak di kantor dan akan membalas saat saya kembali.";
```

**Menandai pesan dari pengirim penting:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**Menolak spam dengan subjek tertentu:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Pesan ditolak karena konten spam.";
}
```

#### Mengelola Skrip Sieve {#managing-sieve-scripts}

Anda dapat mengelola skrip Sieve Anda dengan beberapa cara:

1. **Antarmuka Web**: Pergi ke <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Skrip Sieve untuk membuat dan mengelola skrip.

2. **Protokol ManageSieve**: Sambungkan menggunakan klien yang kompatibel dengan ManageSieve (seperti add-on Sieve Thunderbird atau [sieve-connect](https://github.com/philpennock/sieve-connect)) ke `imap.forwardemail.net`. Gunakan port `2190` dengan STARTTLS (direkomendasikan untuk sebagian besar klien) atau port `4190` dengan TLS implisit.

3. **API**: Gunakan [REST API](/api#sieve-scripts) kami untuk mengelola skrip secara programatik.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Catatan:
  </strong>
  <span>
    Penyaringan Sieve diterapkan pada pesan masuk sebelum disimpan di kotak surat Anda. Skrip dijalankan berdasarkan urutan prioritas, dan aksi pertama yang cocok menentukan bagaimana pesan ditangani.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Keamanan:
  </strong>
  <span>
    Untuk keamanan, aksi pengalihan dibatasi hingga 10 per skrip dan 100 per hari. Balasan cuti dibatasi kecepatannya untuk mencegah penyalahgunaan.
  </span>
</div>

### Apakah Anda mendukung MTA-STS {#do-you-support-mta-sts}

Ya, sejak 2 Maret 2023 kami mendukung [MTA-STS](https://www.hardenize.com/blog/mta-sts). Anda dapat menggunakan [template ini](https://github.com/jpawlowski/mta-sts.template) jika ingin mengaktifkannya di domain Anda.

Konfigurasi kami dapat ditemukan secara publik di GitHub di <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Apakah Anda mendukung passkeys dan WebAuthn {#do-you-support-passkeys-and-webauthn}

Ya! Sejak 13 Desember 2023 kami telah menambahkan dukungan untuk passkeys [karena permintaan tinggi](https://github.com/orgs/forwardemail/discussions/182).

Passkeys memungkinkan Anda masuk dengan aman tanpa memerlukan kata sandi dan autentikasi dua faktor.

Anda dapat memvalidasi identitas Anda dengan sentuhan, pengenalan wajah, kata sandi berbasis perangkat, atau PIN.

Kami mengizinkan Anda mengelola hingga 30 passkeys sekaligus, sehingga Anda dapat masuk dengan semua perangkat Anda dengan mudah.

Pelajari lebih lanjut tentang passkeys di tautan berikut:

* [Masuk ke aplikasi dan situs web Anda dengan passkeys](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Gunakan passkeys untuk masuk ke aplikasi dan situs web di iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Artikel Wikipedia tentang Passkeys](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### Apakah Anda mendukung praktik terbaik email {#do-you-support-email-best-practices}

Ya. Kami memiliki dukungan bawaan untuk SPF, DKIM, DMARC, ARC, dan SRS di semua paket. Kami juga telah bekerja secara ekstensif dengan penulis asli spesifikasi ini dan ahli email lainnya untuk memastikan kesempurnaan dan tingkat pengiriman yang tinggi.

### Apakah Anda mendukung bounce webhooks {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Mencari dokumentasi tentang email webhooks? Lihat <a href="/faq#do-you-support-webhooks" class="alert-link">Apakah Anda mendukung webhooks?</a> untuk wawasan lebih lanjut.
  <span>
  </span>
</div>

Ya, sejak 14 Agustus 2024 kami telah menambahkan fitur ini. Anda sekarang dapat pergi ke Akun Saya → Domain → Pengaturan → Bounce Webhook URL dan mengonfigurasi URL `http://` atau `https://` yang akan kami kirimkan permintaan `POST` setiap kali email SMTP keluar mengalami bounce.

Ini berguna untuk Anda dalam mengelola dan memantau SMTP keluar Anda – dan dapat digunakan untuk memelihara pelanggan, opt-out, dan mendeteksi kapan pun terjadi bounce.

Payload bounce webhook dikirim sebagai JSON dengan properti berikut:

* `email_id` (String) - ID email yang sesuai dengan email di Akun Saya → Email (SMTP keluar)
* `list_id` (String) - nilai header `List-ID` (tidak peka huruf besar/kecil), jika ada, dari email keluar asli
* `list_unsubscribe` (String) - nilai header `List-Unsubscribe` (tidak peka huruf besar/kecil), jika ada, dari email keluar asli
* `feedback_id` (String) - nilai header `Feedback-ID` (tidak peka huruf besar/kecil), jika ada, dari email keluar asli
* `recipient` (String) - alamat email penerima yang mengalami bounce atau error
* `message` (String) - pesan error rinci untuk bounce
* `response` (String) - pesan respons SMTP
* `response_code` (Number) - kode respons SMTP yang telah diurai
* `truth_source` (String) - jika kode respons berasal dari sumber terpercaya, nilai ini akan diisi dengan nama domain root (misal `google.com` atau `yahoo.com`)
* `bounce` (Object) - objek yang berisi properti berikut yang merinci status bounce dan penolakan
  * `action` (String) - aksi bounce (misal `"reject"`)
  * `message` (String) - alasan bounce (misal `"Message Sender Blocked By Receiving Server"`)
  * `category` (String) - kategori bounce (misal `"block"`)
  * `code` (Number) - kode status bounce (misal `554`)
  * `status` (String) - kode bounce dari pesan respons (misal `5.7.1`)
  * `line` (Number) - nomor baris yang diurai, jika ada, [dari daftar parse bounce Zone-MTA](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (misal `526`)
* `headers` (Object) - pasangan kunci nilai header untuk email keluar
* `bounced_at` (String) - Tanggal berformat [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) saat terjadi error bounce

Sebagai contoh:

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

Berikut beberapa catatan tambahan mengenai bounce webhooks:

* Jika payload webhook berisi nilai `list_id`, `list_unsubscribe`, atau `feedback_id`, maka Anda harus mengambil tindakan yang sesuai untuk menghapus `recipient` dari daftar jika perlu.
  * Jika nilai `bounce.category` adalah salah satu dari `"block"`, `"recipient"`, `"spam"`, atau `"virus"`, maka Anda sebaiknya menghapus pengguna dari daftar.
* Jika Anda perlu memverifikasi payload webhook (untuk memastikan bahwa payload benar-benar berasal dari server kami), maka Anda dapat [menyelesaikan alamat IP klien jarak jauh menggunakan pencarian balik](https://nodejs.org/api/dns.html#dnspromisesreverseip) – seharusnya `smtp.forwardemail.net`.
  * Anda juga dapat memeriksa IP terhadap [alamat IP yang kami publikasikan](#what-are-your-servers-ip-addresses).
  * Pergi ke Akun Saya → Domain → Pengaturan → Kunci Verifikasi Payload Tanda Tangan Webhook untuk mendapatkan kunci webhook Anda.
    * Anda dapat memutar kunci ini kapan saja demi alasan keamanan.
    * Hitung dan bandingkan nilai `X-Webhook-Signature` dari permintaan webhook kami dengan nilai body yang dihitung menggunakan kunci ini. Contoh cara melakukannya tersedia di [postingan Stack Overflow ini](https://stackoverflow.com/a/68885281).
  * Lihat diskusi di <https://github.com/forwardemail/free-email-forwarding/issues/235> untuk wawasan lebih lanjut.
* Kami akan menunggu hingga `5` detik agar endpoint webhook Anda merespons dengan kode status `200`, dan kami akan mencoba ulang hingga `1` kali.
* Jika kami mendeteksi bahwa URL bounce webhook Anda mengalami kesalahan saat kami mencoba mengirim permintaan, maka kami akan mengirimkan email pemberitahuan sekali seminggu.
### Apakah Anda mendukung webhooks {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Mencari dokumentasi tentang bounce webhooks? Lihat <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Apakah Anda mendukung bounce webhooks?</a> untuk informasi lebih lanjut.
  <span>
  </span>
</div>

Ya, sejak 15 Mei 2020 kami telah menambahkan fitur ini. Anda dapat dengan mudah menambahkan webhook seperti yang Anda lakukan dengan penerima mana pun! Pastikan bahwa Anda telah menambahkan protokol "http" atau "https" di depan URL webhook.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Perlindungan Privasi yang Ditingkatkan:
  </strong>
  <span>
    Jika Anda menggunakan paket berbayar (yang memiliki fitur perlindungan privasi yang ditingkatkan), maka silakan pergi ke <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> dan klik "Alias" di sebelah domain Anda untuk mengonfigurasi webhook Anda. Jika Anda ingin mempelajari lebih lanjut tentang paket berbayar, lihat halaman <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Harga</a> kami. Jika tidak, Anda dapat melanjutkan mengikuti instruksi di bawah ini.
  </span>
</div>

Jika Anda menggunakan paket gratis, cukup tambahkan record DNS <strong class="notranslate">TXT</strong> baru seperti yang ditunjukkan di bawah ini:

Misalnya, jika saya ingin semua email yang dikirim ke `alias@example.com` diteruskan ke endpoint uji [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect) baru:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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

Atau mungkin Anda ingin semua email yang dikirim ke `example.com` diteruskan ke endpoint ini:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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

**Berikut adalah catatan tambahan mengenai webhooks:**

* Jika Anda perlu memverifikasi payload webhook (untuk memastikan bahwa payload benar-benar berasal dari server kami), maka Anda dapat [menyelesaikan alamat IP klien jarak jauh dengan hostname klien menggunakan reverse lookup](https://nodejs.org/api/dns.html#dnspromisesreverseip) – harus berupa `mx1.forwardemail.net` atau `mx2.forwardemail.net`.
  * Anda juga dapat memeriksa IP terhadap [alamat IP yang kami publikasikan](#what-are-your-servers-ip-addresses).
  * Jika Anda menggunakan paket berbayar, maka pergi ke Akun Saya → Domain → Pengaturan → Kunci Verifikasi Payload Tanda Tangan Webhook untuk mendapatkan kunci webhook Anda.
    * Anda dapat mengganti kunci ini kapan saja demi alasan keamanan.
    * Hitung dan bandingkan nilai `X-Webhook-Signature` dari permintaan webhook kami dengan nilai body yang dihitung menggunakan kunci ini. Contoh cara melakukannya tersedia di [postingan Stack Overflow ini](https://stackoverflow.com/a/68885281).
  * Lihat diskusi di <https://github.com/forwardemail/free-email-forwarding/issues/235> untuk informasi lebih lanjut.
* Jika webhook tidak merespons dengan kode status `200`, maka kami akan menyimpan responsnya di [log kesalahan yang dibuat](#do-you-store-error-logs) – yang berguna untuk debugging.
* Permintaan HTTP webhook akan mencoba ulang hingga 3 kali setiap percobaan koneksi SMTP, dengan batas waktu maksimum 60 detik per permintaan POST endpoint. **Perlu dicatat bahwa ini tidak berarti hanya mencoba ulang 3 kali saja**, sebenarnya akan mencoba ulang terus menerus dengan mengirimkan kode SMTP 421 (yang menunjukkan kepada pengirim untuk mencoba lagi nanti) setelah percobaan POST HTTP ke-3 gagal. Ini berarti email akan mencoba ulang terus menerus selama berhari-hari sampai kode status 200 tercapai.
* Kami akan mencoba ulang secara otomatis berdasarkan status default dan kode kesalahan yang digunakan dalam [metode retry superagent](https://ladjs.github.io/superagent/#retrying-requests) (kami adalah pemeliharanya).
* Kami mengelompokkan permintaan HTTP webhook ke endpoint yang sama dalam satu permintaan saja (bukan beberapa permintaan) untuk menghemat sumber daya dan mempercepat waktu respons. Misalnya, jika Anda mengirim email ke <webhook1@example.com>, <webhook2@example.com>, dan <webhook3@example.com>, dan semuanya dikonfigurasi untuk mengakses URL endpoint *yang sama persis*, maka hanya satu permintaan yang akan dibuat. Kami mengelompokkan berdasarkan kecocokan endpoint yang tepat dengan kesetaraan ketat.
* Perlu dicatat bahwa kami menggunakan metode "simpleParser" dari pustaka [mailparser](https://nodemailer.com/extras/mailparser/) untuk mengurai pesan menjadi objek yang ramah JSON.
* Nilai email mentah sebagai String diberikan sebagai properti "raw".
* Hasil autentikasi diberikan sebagai properti "dkim", "spf", "arc", "dmarc", dan "bimi".
* Header email yang diurai diberikan sebagai properti "headers" – tetapi juga perhatikan Anda dapat menggunakan "headerLines" untuk iterasi dan penguraian yang lebih mudah.
* Penerima yang dikelompokkan untuk webhook ini dikelompokkan bersama dan diberikan sebagai properti "recipients".
* Informasi sesi SMTP diberikan sebagai properti "session". Ini berisi informasi tentang pengirim pesan, waktu kedatangan pesan, HELO, dan hostname klien. Nilai hostname klien sebagai `session.clientHostname` adalah FQDN (dari reverse PTR lookup) atau `session.remoteAddress` yang dibungkus dalam tanda kurung (misalnya `"[127.0.0.1]"`).
* Jika Anda membutuhkan cara cepat untuk mendapatkan nilai `X-Original-To`, maka Anda dapat menggunakan nilai dari `session.recipient` (lihat contoh di bawah). Header `X-Original-To` adalah header yang kami tambahkan ke pesan untuk debugging dengan penerima asli (sebelum penerusan yang disamarkan) untuk pesan tersebut.
* Jika Anda perlu menghapus properti `attachments` dan/atau `raw` dari payload body, cukup tambahkan `?attachments=false`, `?raw=false`, atau `?attachments=false&raw=false` ke endpoint webhook Anda sebagai parameter querystring (misalnya `https://example.com/webhook?attachments=false&raw=false`).
* Jika ada lampiran, mereka akan ditambahkan ke Array `attachments` dengan nilai Buffer. Anda dapat mengurai kembali ke konten menggunakan pendekatan dengan JavaScript seperti:
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
    Tip:
  </strong>
    Curious what the webhook request looks like from forwarded emails?  We've included an example below for you!
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

Ya, sejak 27 September 2021 kami telah menambahkan fitur ini. Anda dapat dengan mudah menulis ekspresi reguler ("regex") untuk mencocokkan alias dan melakukan substitusi.

Alias yang didukung ekspresi reguler adalah yang dimulai dengan `/` dan diakhiri dengan `/` dan penerimanya adalah alamat email atau webhook. Penerima juga dapat menyertakan dukungan substitusi regex (misalnya `$1`, `$2`).

Kami mendukung dua flag ekspresi reguler termasuk `i` dan `g`. Flag case-insensitive `i` adalah default permanen dan selalu diterapkan. Flag global `g` dapat Anda tambahkan dengan menempelkan `/g` pada akhir `/`.

Perlu dicatat bahwa kami juga mendukung <a href="#can-i-disable-specific-aliases">fitur alias yang dinonaktifkan</a> untuk bagian penerima dengan dukungan regex kami.

Ekspresi reguler tidak didukung pada <a href="/disposable-addresses" target="_blank">domain vanity global</a> (karena ini bisa menjadi kerentanan keamanan).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Perlindungan Privasi yang Ditingkatkan:
  </strong>
  <span>
    Jika Anda menggunakan paket berbayar (yang memiliki fitur perlindungan privasi yang ditingkatkan), silakan pergi ke <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> dan klik "Alias" di sebelah domain Anda untuk mengonfigurasi alias, termasuk yang menggunakan ekspresi reguler. Jika Anda ingin mempelajari lebih lanjut tentang paket berbayar, lihat halaman <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Harga</a> kami.
  </span>
</div>

#### Contoh untuk Perlindungan Privasi yang Ditingkatkan {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama Alias</th>
      <th>Efek</th>
      <th>Uji</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>Email ke `linus@example.com` atau `torvalds@example.com`</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">lihat uji di RegExr</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>Email ke `24highst@example.com` atau `24highstreet@example.com`</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">lihat uji di RegExr</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
    Untuk menguji ini di <a href="https://regexr.com" class="alert-link">RegExr</a>, tulis ekspresi di kotak atas, lalu ketik contoh alias di kotak teks di bawahnya. Jika cocok, akan berubah menjadi biru.
  <span>
  </span>
</div>

#### Contoh untuk paket gratis {#examples-for-the-free-plan}

Jika Anda menggunakan paket gratis, cukup tambahkan rekaman DNS <strong class="notranslate">TXT</strong> baru menggunakan satu atau lebih contoh yang disediakan di bawah ini:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Contoh Sederhana:</strong> Jika saya ingin semua email yang dikirim ke `linus@example.com` atau `torvalds@example.com` diteruskan ke `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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
  <strong>Contoh Substitusi Nama Depan Nama Belakang:</strong> Bayangkan semua alamat email perusahaan Anda menggunakan pola `firstname.lastname@example.com`. Jika saya ingin semua email yang dikirim ke pola `firstname.lastname@example.com` diteruskan ke `firstname.lastname@company.com` dengan dukungan substitusi (<a href="https://regexr.com/66hnu" class="alert-link">lihat uji di RegExr</a>):
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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
  <strong>Contoh Penggantian Penyaringan Simbol Plus:</strong> Jika saya ingin semua email yang dikirim ke `info@example.com` atau `support@example.com` diteruskan ke `user+info@gmail.com` atau `user+support@gmail.com` masing-masing (dengan dukungan substitusi) (<a href="https://regexr.com/66ho7" class="alert-link">lihat tes di RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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
  <strong>Contoh Substitusi Querystring Webhook:</strong> Mungkin Anda ingin semua email yang dikirim ke `example.com` diarahkan ke <a href="#do-you-support-webhooks" class="alert-link">webhook</a> dan memiliki kunci querystring dinamis "to" dengan nilai bagian username dari alamat email (<a href="https://regexr.com/66ho4" class="alert-link">lihat tes di RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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
  <strong>Contoh penolakan diam-diam:</strong> Jika Anda ingin semua email yang cocok dengan pola tertentu dinonaktifkan dan ditolak secara diam-diam (terlihat oleh pengirim seolah pesan berhasil dikirim, tetapi sebenarnya tidak kemana-mana) dengan kode status `250` (lihat <a href="#can-i-disable-specific-aliases" class="alert-link">Bisakah saya menonaktifkan alias tertentu</a>), maka cukup gunakan pendekatan yang sama dengan tanda seru tunggal "!". Ini menunjukkan kepada pengirim bahwa pesan berhasil dikirim, tetapi sebenarnya tidak kemana-mana (misalnya blackhole atau `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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
  <strong>Contoh penolakan lunak:</strong> Jika Anda ingin semua email yang cocok dengan pola tertentu dinonaktifkan dan ditolak lunak dengan kode status `421` (lihat <a href="#can-i-disable-specific-aliases" class="alert-link">Bisakah saya menonaktifkan alias tertentu</a>), maka cukup gunakan pendekatan yang sama dengan tanda seru ganda "!!". Ini menunjukkan kepada pengirim untuk mencoba mengirim email lagi, dan email ke alias ini akan dicoba ulang selama kurang lebih 5 hari dan kemudian ditolak secara permanen.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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
  <strong>Contoh penolakan keras:</strong> Jika Anda ingin semua email yang cocok dengan pola tertentu dinonaktifkan dan ditolak keras dengan kode status `550` (lihat <a href="#can-i-disable-specific-aliases" class="alert-link">Bisakah saya menonaktifkan alias tertentu</a>), maka cukup gunakan pendekatan yang sama dengan tanda seru tiga kali "!!!". Ini menunjukkan kepada pengirim adanya kesalahan permanen dan email tidak akan dicoba ulang, mereka akan ditolak untuk alias ini.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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
    Penasaran bagaimana menulis ekspresi reguler atau perlu menguji penggantian Anda? Anda dapat mengunjungi situs web pengujian ekspresi reguler gratis <a href="https://regexr.com" class="alert-link">RegExr</a> di <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
  <span>
  </span>
</div>

### Apa batasan SMTP keluar Anda {#what-are-your-outbound-smtp-limits}

Kami membatasi pengguna dan domain hingga 300 pesan SMTP keluar per 1 hari. Ini rata-rata lebih dari 9000 email dalam sebulan kalender. Jika Anda perlu melebihi jumlah ini atau memiliki email yang secara konsisten besar, silakan [hubungi kami](https://forwardemail.net/help).

### Apakah saya perlu persetujuan untuk mengaktifkan SMTP {#do-i-need-approval-to-enable-smtp}

Ya, harap dicatat bahwa untuk menjaga reputasi IP dan memastikan keterkiriman, Forward Email memiliki proses tinjauan manual berdasarkan domain untuk persetujuan SMTP keluar. Kirim email ke <support@forwardemail.net> atau buka [permintaan bantuan](https://forwardemail.net/help) untuk persetujuan. Biasanya ini memakan waktu kurang dari 24 jam, dengan sebagian besar permintaan diproses dalam 1-2 jam. Dalam waktu dekat kami berencana membuat proses ini instan dengan kontrol spam tambahan dan pemberitahuan. Proses ini memastikan email Anda sampai ke kotak masuk dan pesan Anda tidak ditandai sebagai spam.

### Apa pengaturan konfigurasi server SMTP Anda {#what-are-your-smtp-server-configuration-settings}

Server kami adalah `smtp.forwardemail.net` dan juga dipantau di <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">halaman status</a> kami.

Server mendukung IPv4 dan IPv6 dan tersedia melalui port `465` dan `2465` untuk SSL/TLS (direkomendasikan) dan `587`, `2587`, `2525`, dan `25` untuk TLS (STARTTLS).

**Mulai Oktober 2025**, kami sekarang mendukung koneksi **TLS 1.0 legacy** pada port `2455` (SSL/TLS) dan `2555` (STARTTLS) untuk perangkat lama seperti printer, pemindai, kamera, dan klien email legacy yang tidak dapat mendukung versi TLS modern. Port ini disediakan sebagai alternatif untuk Gmail, Yahoo, Outlook, dan penyedia lain yang telah menghentikan dukungan untuk protokol TLS lama.

> \[!CAUTION]
> **Dukungan TLS 1.0 Legacy (Port 2455 dan 2555)**: Port ini menggunakan protokol TLS 1.0 yang sudah usang dan memiliki kerentanan keamanan yang diketahui (BEAST, POODLE). Gunakan port ini hanya jika perangkat Anda benar-benar tidak dapat mendukung TLS 1.2 atau lebih tinggi. Kami sangat menyarankan untuk memperbarui firmware perangkat Anda atau beralih ke klien email modern kapan pun memungkinkan. Port ini ditujukan hanya untuk kompatibilitas perangkat keras legacy (printer lama, pemindai, kamera, perangkat IoT).

|                                     Protokol                                     | Nama Host               |            Port             |        IPv4        |        IPv6        | Catatan                                |
| :------------------------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: | -------------------------------------- |
|                              `SSL/TLS` **Direkomendasikan**                       | `smtp.forwardemail.net` |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | TLS 1.2+ Modern (Direkomendasikan)     |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | Didukung (lebih suka port SSL/TLS `465`) |
|                             `SSL/TLS` **Legacy Saja**                            | `smtp.forwardemail.net` |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 hanya untuk perangkat lama |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **Legacy Saja** | `smtp.forwardemail.net` |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 hanya untuk perangkat lama |
| Login    | Contoh                     | Deskripsi                                                                                                                                                                                |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`         | Alamat email dari alias yang ada untuk domain di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a>.           |
| Password | `************************` | Alias                                                                                                                                                                                    |

Untuk mengirim email keluar dengan SMTP, **pengguna SMTP** harus berupa alamat email dari alias yang ada untuk domain di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> – dan **kata sandi SMTP** harus berupa kata sandi yang dihasilkan khusus untuk alias tersebut.

Silakan lihat [Apakah Anda mendukung pengiriman email dengan SMTP](#do-you-support-sending-email-with-smtp) untuk petunjuk langkah demi langkah.

### Apa saja pengaturan konfigurasi server IMAP Anda {#what-are-your-imap-server-configuration-settings}

Server kami adalah `imap.forwardemail.net` dan juga dipantau di <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">halaman status</a> kami.

Server ini mendukung IPv4 dan IPv6 dan tersedia melalui port `993` dan `2993` untuk SSL/TLS.

|         Protokol         | Nama Host               |     Port      |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Disarankan** | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| Login    | Contoh                     | Deskripsi                                                                                                                                                                                |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`         | Alamat email dari alias yang ada untuk domain di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a>.           |
| Password | `************************` | Kata sandi yang dihasilkan khusus untuk alias.                                                                                                                                           |

Untuk terhubung dengan IMAP, **pengguna IMAP** harus berupa alamat email dari alias yang ada untuk domain di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> – dan **kata sandi IMAP** harus berupa kata sandi yang dihasilkan khusus untuk alias tersebut.

Silakan lihat [Apakah Anda mendukung penerimaan email dengan IMAP](#do-you-support-receiving-email-with-imap) untuk petunjuk langkah demi langkah.

### Apa saja pengaturan konfigurasi server POP3 Anda {#what-are-your-pop3-server-configuration-settings}

Server kami adalah `pop3.forwardemail.net` dan juga dipantau di <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">halaman status</a> kami.

Server ini mendukung IPv4 dan IPv6 dan tersedia melalui port `995` dan `2995` untuk SSL/TLS.

|         Protokol         | Nama Host               |     Port      |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Disarankan** | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |
| Login    | Contoh                     | Deskripsi                                                                                                                                                                                |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`         | Alamat email dari alias yang ada untuk domain di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a>.           |
| Password | `************************` | Kata sandi yang dihasilkan khusus untuk alias.                                                                                                                                           |

Untuk terhubung dengan POP3, **pengguna POP3** harus berupa alamat email dari alias yang ada untuk domain di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> – dan **kata sandi IMAP** harus berupa kata sandi yang dihasilkan khusus untuk alias.

Silakan lihat [Apakah Anda mendukung POP3](#do-you-support-pop3) untuk instruksi langkah demi langkah.

### Bagaimana cara mengatur autodiscovery email untuk domain saya {#how-do-i-set-up-email-autodiscovery-for-my-domain}

Autodiscovery email memungkinkan klien email seperti **Thunderbird**, **Apple Mail**, **Microsoft Outlook**, dan perangkat seluler untuk secara otomatis mendeteksi pengaturan server IMAP, SMTP, POP3, CalDAV, dan CardDAV yang benar saat pengguna menambahkan akun email mereka. Ini didefinisikan oleh [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (email) dan [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV) dan menggunakan catatan DNS SRV.

Forward Email menerbitkan catatan autodiscovery di `forwardemail.net`. Anda dapat menambahkan catatan SRV langsung ke domain Anda, atau menggunakan pendekatan CNAME yang lebih sederhana.

#### Opsi A: Catatan CNAME (paling sederhana) {#option-a-cname-records-simplest}

Tambahkan dua catatan CNAME ini ke DNS domain Anda. Ini mendelegasikan autodiscovery ke server Forward Email:

|  Tipe | Nama/Host      | Target/Nilai                   |
| :---: | -------------- | ----------------------------- |
| CNAME | `autoconfig`   | `autoconfig.forwardemail.net` |
| CNAME | `autodiscover` | `autodiscover.forwardemail.net` |

Catatan `autoconfig` digunakan oleh **Thunderbird** dan klien berbasis Mozilla lainnya. Catatan `autodiscover` digunakan oleh **Microsoft Outlook**.

#### Opsi B: Catatan SRV (langsung) {#option-b-srv-records-direct}

Jika Anda lebih suka menambahkan catatan langsung (atau penyedia DNS Anda tidak mendukung CNAME pada subdomain), tambahkan catatan SRV ini ke domain Anda:

| Tipe | Nama/Host           | Prioritas | Bobot | Port | Target/Nilai               | Tujuan                                 |
| :--: | ------------------- | :-------: | :----:| :--: | -------------------------- | ------------------------------------- |
|  SRV | `_imaps._tcp`       |     0     |   1   |  993 | `imap.forwardemail.net`    | IMAP melalui SSL/TLS (direkomendasikan) |
|  SRV | `_imap._tcp`        |     0     |   0   |   0  | `.`                        | IMAP tanpa enkripsi dinonaktifkan     |
|  SRV | `_submissions._tcp` |     0     |   1   |  465 | `smtp.forwardemail.net`    | Pengiriman SMTP (SSL/TLS, direkomendasikan) |
|  SRV | `_submission._tcp`  |     5     |   1   |  587 | `smtp.forwardemail.net`    | Pengiriman SMTP (STARTTLS)             |
|  SRV | `_pop3s._tcp`       |    10     |   1   |  995 | `pop3.forwardemail.net`    | POP3 melalui SSL/TLS                   |
|  SRV | `_pop3._tcp`        |     0     |   0   |   0  | `.`                        | POP3 tanpa enkripsi dinonaktifkan     |
|  SRV | `_caldavs._tcp`     |     0     |   1   |  443 | `caldav.forwardemail.net`  | CalDAV melalui TLS (kalender)          |
|  SRV | `_caldav._tcp`      |     0     |   0   |   0  | `.`                        | CalDAV tanpa enkripsi dinonaktifkan   |
|  SRV | `_carddavs._tcp`    |     0     |   1   |  443 | `carddav.forwardemail.net` | CardDAV melalui TLS (kontak)           |
|  SRV | `_carddav._tcp`     |     0     |   0   |   0  | `.`                        | CardDAV tanpa enkripsi dinonaktifkan  |
> \[!NOTE]
> IMAP memiliki nilai prioritas yang lebih rendah (0) dibandingkan POP3 (10), yang memberi tahu klien email untuk lebih memilih IMAP daripada POP3 ketika keduanya tersedia. Catatan dengan target `.` (titik tunggal) menunjukkan bahwa versi plaintext (tidak terenkripsi) dari protokol tersebut sengaja dinonaktifkan sesuai dengan [RFC 6186 Bagian 3.4](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4). Catatan SRV CalDAV dan CardDAV mengikuti [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) untuk autodiscovery kalender dan kontak.

#### Klien email mana yang mendukung autodiscovery? {#which-email-clients-support-autodiscovery}

| Klien              | Email                                            | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | catatan CNAME atau SRV `autoconfig`               | catatan XML `autoconfig` atau SRV (RFC 6764) |
| Apple Mail (macOS) | catatan SRV (RFC 6186)                            | catatan SRV (RFC 6764)                     |
| Apple Mail (iOS)   | catatan SRV (RFC 6186)                            | catatan SRV (RFC 6764)                     |
| Microsoft Outlook  | catatan CNAME `autodiscover` atau SRV `_autodiscover._tcp` | Tidak didukung                            |
| GNOME (Evolution)  | catatan SRV (RFC 6186)                            | catatan SRV (RFC 6764)                     |
| KDE (KMail)        | catatan SRV (RFC 6186)                            | catatan SRV (RFC 6764)                     |
| eM Client          | `autoconfig` atau `autodiscover`                  | catatan SRV (RFC 6764)                     |

> \[!TIP]
> Untuk kompatibilitas terbaik di semua klien, kami merekomendasikan menggunakan **Opsi A** (catatan CNAME) dikombinasikan dengan catatan SRV dari **Opsi B**. Pendekatan CNAME saja sudah mencakup mayoritas klien email. Catatan SRV CalDAV/CardDAV memastikan bahwa klien kalender dan kontak juga dapat secara otomatis menemukan pengaturan server Anda.


## Keamanan {#security-1}

### Teknik Penguatan Server Lanjutan {#advanced-server-hardening-techniques}

> \[!TIP]
> Pelajari lebih lanjut tentang infrastruktur keamanan kami di [halaman Keamanan kami](/security).

Forward Email menerapkan berbagai teknik penguatan server untuk memastikan keamanan infrastruktur kami dan data Anda:

1. **Keamanan Jaringan**:
   * firewall IP tables dengan aturan ketat
   * Fail2ban untuk perlindungan brute force
   * audit keamanan dan pengujian penetrasi secara rutin
   * akses administratif hanya melalui VPN

2. **Penguatan Sistem**:
   * instalasi paket minimal
   * pembaruan keamanan rutin
   * SELinux dalam mode enforcing
   * akses SSH root dinonaktifkan
   * hanya autentikasi berbasis kunci

3. **Keamanan Aplikasi**:
   * header Content Security Policy (CSP)
   * HTTPS Strict Transport Security (HSTS)
   * header perlindungan XSS
   * opsi frame dan header kebijakan referrer
   * audit dependensi secara rutin

4. **Perlindungan Data**:
   * enkripsi disk penuh dengan LUKS
   * manajemen kunci yang aman
   * cadangan rutin dengan enkripsi
   * praktik minimisasi data

5. **Pemantauan dan Respons**:
   * deteksi intrusi waktu nyata
   * pemindaian keamanan otomatis
   * pencatatan dan analisis terpusat
   * prosedur respons insiden

> \[!IMPORTANT]
> Praktik keamanan kami terus diperbarui untuk mengatasi ancaman dan kerentanan yang muncul.

> \[!TIP]
> Untuk keamanan maksimal, kami merekomendasikan menggunakan layanan kami dengan enkripsi end-to-end melalui OpenPGP.

### Apakah Anda memiliki sertifikasi SOC 2 atau ISO 27001 {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email beroperasi pada infrastruktur yang disediakan oleh subprosesor bersertifikat untuk memastikan kepatuhan terhadap standar industri.

Forward Email tidak secara langsung memegang sertifikasi SOC 2 Tipe II atau ISO 27001. Namun, layanan ini beroperasi pada infrastruktur yang disediakan oleh subprosesor bersertifikat:

* **DigitalOcean**: bersertifikat SOC 2 Tipe II dan SOC 3 Tipe II (diaudit oleh Schellman & Company LLC), bersertifikat ISO 27001 di beberapa pusat data. Detail: <https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: Bersertifikat SOC 2+ (HIPAA), sertifikasi ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Detail: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: Mematuhi SOC 2 (hubungi DataPacket langsung untuk memperoleh sertifikasi), penyedia infrastruktur kelas perusahaan (lokasi Denver). Detail: <https://www.datapacket.com/datacenters/denver>

Forward Email mengikuti praktik terbaik industri untuk audit keamanan dan secara rutin berinteraksi dengan peneliti keamanan independen. Sumber: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Apakah Anda menggunakan enkripsi TLS untuk penerusan email {#do-you-use-tls-encryption-for-email-forwarding}

Ya. Forward Email secara ketat menerapkan TLS 1.2+ untuk semua koneksi (HTTPS, SMTP, IMAP, POP3) dan mengimplementasikan MTA-STS untuk dukungan TLS yang lebih baik. Implementasinya meliputi:

* Penegakan TLS 1.2+ untuk semua koneksi email
* Pertukaran kunci ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) untuk perfect forward secrecy
* Suite cipher modern dengan pembaruan keamanan rutin
* Dukungan HTTP/2 untuk peningkatan performa dan keamanan
* HSTS (HTTP Strict Transport Security) dengan preloading di browser utama
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** untuk penegakan TLS yang ketat

Sumber: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**Implementasi MTA-STS**: Forward Email menerapkan penegakan MTA-STS yang ketat dalam basis kode. Ketika terjadi kesalahan TLS dan MTA-STS diterapkan, sistem mengembalikan kode status SMTP 421 untuk memastikan email dicoba ulang nanti daripada dikirim secara tidak aman. Detail implementasi:

* Deteksi kesalahan TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* Penegakan MTA-STS dalam helper send-email: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Validasi pihak ketiga: <https://www.hardenize.com/report/forwardemail.net/1750312779> menunjukkan peringkat "Good" untuk semua langkah keamanan TLS dan transportasi.

### Apakah Anda mempertahankan header autentikasi email {#do-you-preserve-email-authentication-headers}

Ya. Forward Email secara menyeluruh mengimplementasikan dan mempertahankan header autentikasi email:

* **SPF (Sender Policy Framework)**: Diimplementasikan dan dipertahankan dengan benar
* **DKIM (DomainKeys Identified Mail)**: Dukungan penuh dengan pengelolaan kunci yang tepat
* **DMARC**: Penegakan kebijakan untuk email yang gagal validasi SPF atau DKIM
* **ARC**: Meskipun tidak dijelaskan secara eksplisit, skor kepatuhan sempurna layanan ini menunjukkan penanganan header autentikasi yang komprehensif

Sumber: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validasi: Internet.nl Mail Test menunjukkan skor 100/100 khusus untuk implementasi "SPF, DKIM, dan DMARC". Penilaian Hardenize mengonfirmasi peringkat "Good" untuk SPF dan DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Apakah Anda mempertahankan header email asli dan mencegah spoofing {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email menerapkan perlindungan anti-spoofing yang canggih untuk mencegah penyalahgunaan email.

Forward Email mempertahankan header email asli sambil menerapkan perlindungan anti-spoofing yang komprehensif melalui basis kode MX:

* **Pemeliharaan Header**: Header autentikasi asli dipertahankan selama penerusan
* **Anti-Spoofing**: Penegakan kebijakan DMARC mencegah spoofing header dengan menolak email yang gagal validasi SPF atau DKIM
* **Pencegahan Penyisipan Header**: Validasi input dan sanitasi menggunakan pustaka striptags
* **Perlindungan Lanjutan**: Deteksi phishing canggih dengan deteksi spoofing, pencegahan impersonasi, dan sistem pemberitahuan pengguna

**Detail Implementasi MX**: Logika pemrosesan email inti ditangani oleh basis kode server MX, khususnya:

* Penangan data utama MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Penyaringan email arbitrer (anti-spoofing): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

Helper `isArbitrary` mengimplementasikan aturan anti-spoofing canggih termasuk deteksi impersonasi domain, frasa yang diblokir, dan berbagai pola phishing.
### Bagaimana Anda melindungi dari spam dan penyalahgunaan {#how-do-you-protect-against-spam-and-abuse}

Forward Email menerapkan perlindungan multi-lapisan yang komprehensif:

* **Pembatasan Laju**: Diterapkan pada upaya otentikasi, endpoint API, dan koneksi SMTP
* **Isolasi Sumber Daya**: Antara pengguna untuk mencegah dampak dari pengguna dengan volume tinggi
* **Perlindungan DDoS**: Perlindungan multi-lapisan melalui sistem Shield DataPacket dan Cloudflare
* **Skalabilitas Otomatis**: Penyesuaian sumber daya dinamis berdasarkan permintaan
* **Pencegahan Penyalahgunaan**: Pemeriksaan pencegahan penyalahgunaan spesifik pengguna dan pemblokiran berbasis hash untuk konten berbahaya
* **Otentikasi Email**: Protokol SPF, DKIM, DMARC dengan deteksi phishing tingkat lanjut

Sumber:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (detail perlindungan DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Apakah Anda menyimpan konten email di disk {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email menggunakan arsitektur zero-knowledge yang mencegah konten email ditulis ke disk.

* **Arsitektur Zero-Knowledge**: Kotak surat SQLite yang dienkripsi secara individual berarti Forward Email tidak dapat mengakses konten email
* **Pemrosesan Dalam Memori**: Pemrosesan email terjadi sepenuhnya di dalam memori, menghindari penyimpanan di disk
* **Tidak Ada Pencatatan Konten**: "Kami tidak mencatat atau menyimpan konten email atau metadata ke disk"
* **Enkripsi Terisolasi**: Kunci enkripsi tidak pernah disimpan di disk dalam bentuk teks biasa

**Bukti Kode MX**: Server MX memproses email sepenuhnya dalam memori tanpa menulis konten ke disk. Penangan utama pemrosesan email menunjukkan pendekatan dalam memori ini: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Sumber:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Abstrak)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Detail zero-knowledge)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Enkripsi terisolasi)

### Apakah konten email dapat terekspos selama kerusakan sistem {#can-email-content-be-exposed-during-system-crashes}

Tidak. Forward Email menerapkan perlindungan menyeluruh terhadap paparan data akibat kerusakan:

* **Core Dumps Dinonaktifkan**: Mencegah paparan memori selama kerusakan
* **Memori Swap Dinonaktifkan**: Sepenuhnya dinonaktifkan untuk mencegah ekstraksi data sensitif dari file swap
* **Arsitektur Dalam Memori**: Konten email hanya ada di memori volatil selama pemrosesan
* **Perlindungan Kunci Enkripsi**: Kunci tidak pernah disimpan di disk dalam bentuk teks biasa
* **Keamanan Fisik**: Disk terenkripsi LUKS v2 mencegah akses fisik ke data
* **Penyimpanan USB Dinonaktifkan**: Mencegah ekstraksi data tanpa izin

**Penanganan Kesalahan untuk Masalah Sistem**: Forward Email menggunakan fungsi pembantu `isCodeBug` dan `isTimeoutError` untuk memastikan bahwa jika terjadi masalah konektivitas database, masalah jaringan/blocklist DNS, atau masalah konektivitas hulu, sistem mengembalikan kode status SMTP 421 untuk memastikan email akan dicoba ulang nanti daripada hilang atau terekspos.

Detail implementasi:

* Klasifikasi kesalahan: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Penanganan kesalahan timeout dalam pemrosesan MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Sumber: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Siapa yang memiliki akses ke infrastruktur email Anda {#who-has-access-to-your-email-infrastructure}

Forward Email menerapkan kontrol akses komprehensif untuk akses tim teknik minimal 2-3 orang dengan persyaratan 2FA yang ketat:

* **Kontrol Akses Berbasis Peran**: Untuk akun tim dengan izin berbasis sumber daya
* **Prinsip Hak Istimewa Minimum**: Diterapkan di seluruh sistem
* **Pemisahan Tugas**: Antara peran operasional
* **Manajemen Pengguna**: Pengguna deploy dan devops terpisah dengan izin berbeda
* **Login Root Dinonaktifkan**: Memaksa akses melalui akun yang terautentikasi dengan benar
* **2FA Ketat**: Tidak menggunakan 2FA berbasis SMS karena risiko serangan MiTM - hanya token berbasis aplikasi atau perangkat keras
* **Pencatatan Audit Komprehensif**: Dengan redaksi data sensitif
* **Deteksi Anomali Otomatis**: Untuk pola akses yang tidak biasa
* **Tinjauan Keamanan Berkala**: Terhadap log akses
* **Pencegahan Serangan Evil Maid**: Penyimpanan USB dinonaktifkan dan langkah keamanan fisik lainnya
Sumber:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Kontrol Otorisasi)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Keamanan Jaringan)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Pencegahan serangan evil maid)

### Penyedia infrastruktur apa yang Anda gunakan {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email menggunakan beberapa subprocessors infrastruktur dengan sertifikasi kepatuhan yang komprehensif.

Detail lengkap tersedia di halaman kepatuhan GDPR kami: <https://forwardemail.net/gdpr>

**Subprocessor Infrastruktur Utama:**

| Penyedia         | Sertifikasi Kerangka Privasi Data | Halaman Kepatuhan GDPR                                                                   |
| ---------------- | --------------------------------- | ---------------------------------------------------------------------------------------- |
| **Cloudflare**   | ✅ Ya                             | <https://www.cloudflare.com/trust-hub/gdpr/>                                             |
| **DataPacket**   | ❌ Tidak                          | <https://www.datapacket.com/privacy-policy>                                              |
| **DigitalOcean** | ❌ Tidak                          | <https://www.digitalocean.com/legal/gdpr>                                                |
| **GitHub**       | ✅ Ya                             | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**        | ❌ Tidak                          | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                          |

**Sertifikasi Detail:**

**DigitalOcean**

* SOC 2 Tipe II & SOC 3 Tipe II (diaudit oleh Schellman & Company LLC)
* Bersertifikat ISO 27001 di beberapa pusat data
* Mematuhi PCI-DSS
* Bersertifikat CSA STAR Level 1
* Bersertifikat APEC CBPR PRP
* Detail: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* Bersertifikat SOC 2+ (HIPAA)
* Mematuhi PCI Merchant
* Bersertifikat CSA STAR Level 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Detail: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* Mematuhi SOC 2 (hubungi DataPacket langsung untuk memperoleh sertifikasi)
* Infrastruktur kelas enterprise (lokasi Denver)
* Perlindungan DDoS melalui tumpukan keamanan Shield
* Dukungan teknis 24/7
* Jaringan global di 58 pusat data
* Detail: <https://www.datapacket.com/datacenters/denver>

**GitHub**

* Bersertifikat Kerangka Privasi Data (EU-AS, Swiss-AS, dan Perluasan UK)
* Hosting kode sumber, CI/CD, dan manajemen proyek
* Perjanjian Perlindungan Data GitHub tersedia
* Detail: <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**Pemroses Pembayaran:**

* **Stripe**: Bersertifikat Kerangka Privasi Data - <https://stripe.com/legal/privacy-center>
* **PayPal**: Tidak bersertifikat DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### Apakah Anda menawarkan Perjanjian Pemrosesan Data (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Ya, Forward Email menawarkan Perjanjian Pemrosesan Data (DPA) yang komprehensif yang dapat ditandatangani dengan perjanjian enterprise kami. Salinan DPA kami tersedia di: <https://forwardemail.net/dpa>

**Detail DPA:**

* Mencakup kepatuhan GDPR dan kerangka kerja EU-AS/Swiss-AS Privacy Shield
* Otomatis diterima saat menyetujui Ketentuan Layanan kami
* Tidak diperlukan tanda tangan terpisah untuk DPA standar
* Pengaturan DPA khusus tersedia melalui Lisensi Enterprise

**Kerangka Kepatuhan GDPR:**
DPA kami merinci kepatuhan terhadap GDPR serta persyaratan transfer data internasional. Informasi lengkap tersedia di: <https://forwardemail.net/gdpr>

Untuk pelanggan enterprise yang memerlukan ketentuan DPA khusus atau pengaturan kontraktual tertentu, hal ini dapat diatur melalui program **Lisensi Enterprise ($250/bulan)** kami.

### Bagaimana Anda menangani pemberitahuan pelanggaran data {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Arsitektur zero-knowledge Forward Email secara signifikan membatasi dampak pelanggaran.
* **Eksposur Data Terbatas**: Tidak dapat mengakses konten email terenkripsi karena arsitektur zero-knowledge
* **Pengumpulan Data Minimal**: Hanya informasi dasar pelanggan dan log IP terbatas untuk keamanan
* **Kerangka Subprosesor**: DigitalOcean, GitHub, dan Vultr mempertahankan prosedur respons insiden yang sesuai GDPR

**Informasi Perwakilan GDPR:**
Forward Email telah menunjuk perwakilan GDPR sesuai dengan Pasal 27:

**Perwakilan UE:**
Osano International Compliance Services Limited
ATTN: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**Perwakilan Inggris:**
Osano UK Compliance LTD
ATTN: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

Untuk pelanggan perusahaan yang memerlukan SLA pemberitahuan pelanggaran khusus, hal ini harus dibahas sebagai bagian dari perjanjian **Enterprise License**.

Sumber:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Apakah Anda menawarkan lingkungan pengujian {#do-you-offer-a-test-environment}

Dokumentasi teknis Forward Email tidak secara eksplisit menjelaskan mode sandbox khusus. Namun, pendekatan pengujian potensial meliputi:

* **Opsi Self-Hosting**: Kemampuan self-hosting yang komprehensif untuk membuat lingkungan pengujian
* **Antarmuka API**: Potensi pengujian konfigurasi secara programatik
* **Open Source**: Kode 100% open-source memungkinkan pelanggan memeriksa logika penerusan
* **Beberapa Domain**: Dukungan untuk beberapa domain dapat memungkinkan pembuatan domain pengujian

Untuk pelanggan perusahaan yang memerlukan kemampuan sandbox formal, hal ini harus dibahas sebagai bagian dari pengaturan **Enterprise License**.

Sumber: <https://github.com/forwardemail/forwardemail.net> (Detail lingkungan pengembangan)

### Apakah Anda menyediakan alat pemantauan dan peringatan {#do-you-provide-monitoring-and-alerting-tools}

Forward Email menyediakan pemantauan waktu nyata dengan beberapa keterbatasan:

**Tersedia:**

* **Pemantauan Pengiriman Waktu Nyata**: Metrik kinerja yang terlihat publik untuk penyedia email utama
* **Peringatan Otomatis**: Tim teknik diberi tahu ketika waktu pengiriman melebihi 10 detik
* **Pemantauan Transparan**: Sistem pemantauan 100% open-source
* **Pemantauan Infrastruktur**: Deteksi anomali otomatis dan pencatatan audit komprehensif

**Keterbatasan:**

* Webhook yang dapat diakses pelanggan atau notifikasi status pengiriman berbasis API tidak secara eksplisit didokumentasikan

Untuk pelanggan perusahaan yang memerlukan webhook status pengiriman terperinci atau integrasi pemantauan khusus, kemampuan ini mungkin tersedia melalui pengaturan **Enterprise License**.

Sumber:

* <https://forwardemail.net> (Tampilan pemantauan waktu nyata)
* <https://github.com/forwardemail/forwardemail.net> (Implementasi pemantauan)

### Bagaimana Anda memastikan ketersediaan tinggi {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email menerapkan redundansi komprehensif di berbagai penyedia infrastruktur.

* **Infrastruktur Terdistribusi**: Beberapa penyedia (DigitalOcean, Vultr, DataPacket) di berbagai wilayah geografis
* **Load Balancing Geografis**: Load balancing berbasis Cloudflare dengan lokasi geografis dan failover otomatis
* **Skalabilitas Otomatis**: Penyesuaian sumber daya dinamis berdasarkan permintaan
* **Perlindungan DDoS Multi-Lapisan**: Melalui sistem Shield DataPacket dan Cloudflare
* **Redundansi Server**: Beberapa server per wilayah dengan failover otomatis
* **Replikasi Database**: Sinkronisasi data waktu nyata di berbagai lokasi
* **Pemantauan dan Peringatan**: Pemantauan 24/7 dengan respons insiden otomatis

**Komitmen Uptime**: Ketersediaan layanan 99,9%+ dengan pemantauan transparan tersedia di <https://forwardemail.net>

Sumber:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Apakah Anda mematuhi Bagian 889 dari National Defense Authorization Act (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email sepenuhnya mematuhi Bagian 889 melalui pemilihan mitra infrastruktur yang cermat.

Ya, Forward Email **mematuhi Bagian 889**. Bagian 889 dari National Defense Authorization Act (NDAA) melarang lembaga pemerintah menggunakan atau mengontrak dengan entitas yang menggunakan peralatan telekomunikasi dan pengawasan video dari perusahaan tertentu (Huawei, ZTE, Hikvision, Dahua, dan Hytera).
**Bagaimana Forward Email Mencapai Kepatuhan Bagian 889:**

Forward Email mengandalkan secara eksklusif pada dua penyedia infrastruktur utama, yang keduanya tidak menggunakan peralatan yang dilarang oleh Bagian 889:

1. **Cloudflare**: Mitra utama kami untuk layanan jaringan dan keamanan email
2. **DataPacket**: Penyedia utama kami untuk infrastruktur server (menggunakan peralatan Arista Networks dan Cisco secara eksklusif)
3. **Penyedia Cadangan**: Penyedia cadangan kami Digital Ocean dan Vultr juga telah dikonfirmasi secara tertulis sebagai patuh terhadap Bagian 889.

**Komitmen Cloudflare**: Cloudflare secara eksplisit menyatakan dalam Kode Etik Pihak Ketiga mereka bahwa mereka tidak menggunakan peralatan telekomunikasi, produk pengawasan video, atau layanan dari entitas yang dilarang oleh Bagian 889.

**Kasus Penggunaan Pemerintah**: Kepatuhan kami terhadap Bagian 889 divalidasi ketika **US Naval Academy** memilih Forward Email untuk kebutuhan penerusan email aman mereka, yang memerlukan dokumentasi standar kepatuhan federal kami.

Untuk detail lengkap tentang kerangka kerja kepatuhan pemerintah kami, termasuk regulasi federal yang lebih luas, baca studi kasus komprehensif kami: [Layanan Email Pemerintah Federal Patuh Bagian 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## Detail Sistem dan Teknis {#system-and-technical-details}

### Apakah Anda menyimpan email dan isinya {#do-you-store-emails-and-their-contents}

Tidak, kami tidak menulis ke disk atau menyimpan log – dengan [pengecualian kesalahan](#do-you-store-error-logs) dan [SMTP keluar](#do-you-support-sending-email-with-smtp) (lihat [Kebijakan Privasi](/privacy) kami).

Semua dilakukan di memori dan [kode sumber kami ada di GitHub](https://github.com/forwardemail).

### Bagaimana sistem penerusan email Anda bekerja {#how-does-your-email-forwarding-system-work}

Email bergantung pada [protokol SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Protokol ini terdiri dari perintah yang dikirim ke server (biasanya berjalan di port 25). Ada koneksi awal, kemudian pengirim menunjukkan dari siapa email berasal ("MAIL FROM"), diikuti dengan tujuan email ("RCPT TO"), dan akhirnya header serta isi email itu sendiri ("DATA"). Alur sistem penerusan email kami dijelaskan relatif terhadap setiap perintah protokol SMTP di bawah ini:

* Koneksi Awal (tanpa nama perintah, misalnya `telnet example.com 25`) - Ini adalah koneksi awal. Kami memeriksa pengirim yang tidak ada dalam [daftar izinkan](#do-you-have-an-allowlist) kami terhadap [daftar tolak](#do-you-have-a-denylist) kami. Akhirnya, jika pengirim tidak ada dalam daftar izinkan, maka kami memeriksa apakah mereka telah [greylist](#do-you-have-a-greylist).

* `HELO` - Ini menunjukkan salam untuk mengidentifikasi FQDN pengirim, alamat IP, atau nama penangan email. Nilai ini dapat dipalsukan, jadi kami tidak mengandalkan data ini dan sebaliknya menggunakan pencarian nama host balik dari alamat IP koneksi.

* `MAIL FROM` - Ini menunjukkan alamat surat amplop pengirim email. Jika nilai dimasukkan, harus berupa alamat email RFC 5322 yang valid. Nilai kosong diperbolehkan. Kami [memeriksa backscatter](#how-do-you-protect-against-backscatter) di sini, dan juga memeriksa MAIL FROM terhadap [daftar tolak](#do-you-have-a-denylist) kami. Kami akhirnya memeriksa pengirim yang tidak ada di daftar izinkan untuk pembatasan laju (lihat bagian tentang [Pembatasan Laju](#do-you-have-rate-limiting) dan [daftar izinkan](#do-you-have-an-allowlist) untuk informasi lebih lanjut).

* `RCPT TO` - Ini menunjukkan penerima email. Ini harus berupa alamat email RFC 5322 yang valid. Kami hanya mengizinkan hingga 50 penerima amplop per pesan (ini berbeda dengan header "To" dari email). Kami juga memeriksa alamat [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") yang valid di sini untuk melindungi dari pemalsuan dengan nama domain SRS kami.

* `DATA` - Ini adalah bagian inti dari layanan kami yang memproses email. Lihat bagian [Bagaimana Anda memproses email untuk penerusan](#how-do-you-process-an-email-for-forwarding) di bawah untuk wawasan lebih lanjut.
### Bagaimana Anda memproses email untuk diteruskan {#how-do-you-process-an-email-for-forwarding}

Bagian ini menjelaskan proses kami terkait dengan perintah protokol SMTP `DATA` dalam bagian [Bagaimana sistem penerusan email Anda bekerja](#how-does-your-email-forwarding-system-work) di atas – ini adalah bagaimana kami memproses header email, isi, keamanan, menentukan ke mana email harus dikirim, dan bagaimana kami menangani koneksi.

1. Jika pesan melebihi ukuran maksimum 50mb, maka pesan tersebut ditolak dengan kode kesalahan 552.

2. Jika pesan tidak mengandung header "From", atau jika salah satu nilai dalam header "From" bukan alamat email RFC 5322 yang valid, maka pesan tersebut ditolak dengan kode kesalahan 550.

3. Jika pesan memiliki lebih dari 25 header "Received", maka dipastikan pesan tersebut terjebak dalam loop pengalihan, dan pesan tersebut ditolak dengan kode kesalahan 550.

4. Menggunakan sidik jari email (lihat bagian tentang [Fingerprinting](#how-do-you-determine-an-email-fingerprint)), kami akan memeriksa apakah pesan telah dicoba untuk dikirim ulang selama lebih dari 5 hari (yang sesuai dengan [perilaku default postfix](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), dan jika iya, maka pesan tersebut akan ditolak dengan kode kesalahan 550.

5. Kami menyimpan dalam memori hasil pemindaian email menggunakan [Spam Scanner](https://spamscanner.net).

6. Jika ada hasil arbitrer dari Spam Scanner, maka pesan tersebut ditolak dengan kode kesalahan 554. Hasil arbitrer hanya mencakup tes GTUBE pada saat penulisan ini. Lihat <https://spamassassin.apache.org/gtube/> untuk informasi lebih lanjut.

7. Kami akan menambahkan header berikut ke pesan untuk tujuan debugging dan pencegahan penyalahgunaan:

   * `Received` - kami menambahkan header Received standar ini dengan IP dan host asal, jenis transmisi, informasi koneksi TLS, tanggal/waktu, dan penerima.
   * `X-Original-To` - penerima asli untuk pesan:
     * Ini berguna untuk menentukan ke mana email awalnya dikirim (selain header "Received").
     * Ini ditambahkan berdasarkan penerima pada saat IMAP dan/atau penerusan yang disamarkan (untuk melindungi privasi).
   * `X-Forward-Email-Website` - berisi tautan ke situs web kami di <https://forwardemail.net>
   * `X-Forward-Email-Version` - versi [SemVer](https://semver.org/) saat ini dari `package.json` kode kami.
   * `X-Forward-Email-Session-ID` - nilai ID sesi yang digunakan untuk tujuan debug (hanya berlaku di lingkungan non-produksi).
   * `X-Forward-Email-Sender` - daftar yang dipisahkan koma yang berisi alamat MAIL FROM amplop asli (jika tidak kosong), FQDN PTR terbalik klien (jika ada), dan alamat IP pengirim.
   * `X-Forward-Email-ID` - ini hanya berlaku untuk SMTP keluar dan berkorelasi dengan ID email yang disimpan di Akun Saya → Email
   * `X-Report-Abuse` - dengan nilai `abuse@forwardemail.net`.
   * `X-Report-Abuse-To` - dengan nilai `abuse@forwardemail.net`.
   * `X-Complaints-To` - dengan nilai `abuse@forwardemail.net`.

8. Kami kemudian memeriksa pesan untuk [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain), dan [DMARC](https://en.wikipedia.org/wiki/DMARC).

   * Jika pesan gagal DMARC dan domain memiliki kebijakan penolakan (misalnya `p=reject` [ada dalam kebijakan DMARC](https://wikipedia.org/wiki/DMARC)), maka pesan tersebut ditolak dengan kode kesalahan 550. Biasanya kebijakan DMARC untuk sebuah domain dapat ditemukan di catatan <strong class="notranslate">TXT</strong> sub-domain `_dmarc`, (misalnya `dig _dmarc.example.com txt`).
   * Jika pesan gagal SPF dan domain memiliki kebijakan hard fail (misalnya `-all` ada dalam kebijakan SPF dibandingkan dengan `~all` atau tidak ada kebijakan sama sekali), maka pesan tersebut ditolak dengan kode kesalahan 550. Biasanya kebijakan SPF untuk sebuah domain dapat ditemukan di catatan <strong class="notranslate">TXT</strong> untuk domain root (misalnya `dig example.com txt`). Lihat bagian ini untuk informasi lebih lanjut tentang [mengirim email sebagai dengan Gmail](#can-i-send-mail-as-in-gmail-with-this) terkait SPF.
9. Sekarang kami memproses penerima pesan yang dikumpulkan dari perintah `RCPT TO` dalam bagian [Bagaimana sistem penerusan email Anda bekerja](#how-does-your-email-forwarding-system-work) di atas. Untuk setiap penerima, kami melakukan operasi berikut:

   * Kami mencari catatan <strong class="notranslate">TXT</strong> dari nama domain (bagian setelah simbol `@`, misalnya `example.com` jika alamat email adalah `test@example.com`). Misalnya, jika domainnya adalah `example.com` kami melakukan pencarian DNS seperti `dig example.com txt`.
   * Kami mengurai semua catatan <strong class="notranslate">TXT</strong> yang dimulai dengan `forward-email=` (paket gratis) atau `forward-email-site-verification=` (paket berbayar). Perlu dicatat bahwa kami mengurai keduanya, untuk memproses email saat pengguna sedang meng-upgrade atau menurunkan paket.
   * Dari catatan <strong class="notranslate">TXT</strong> yang diurai ini, kami mengiterasi untuk mengekstrak konfigurasi penerusan (seperti yang dijelaskan dalam bagian [Bagaimana cara memulai dan mengatur penerusan email](#how-do-i-get-started-and-set-up-email-forwarding) di atas). Perlu dicatat bahwa kami hanya mendukung satu nilai `forward-email-site-verification=`, dan jika lebih dari satu disediakan, maka akan terjadi kesalahan 550 dan pengirim akan menerima bounce untuk penerima ini.
   * Secara rekursif kami mengiterasi konfigurasi penerusan yang diekstrak untuk menentukan penerusan global, penerusan berbasis regex, dan semua konfigurasi penerusan lain yang didukung – yang sekarang dikenal sebagai "Alamat Penerusan" kami.
   * Untuk setiap Alamat Penerusan, kami mendukung satu pencarian rekursif (yang akan memulai rangkaian operasi ini kembali pada alamat yang diberikan). Jika ditemukan kecocokan rekursif, maka hasil induk akan dihapus dari Alamat Penerusan, dan anak-anaknya ditambahkan.
   * Alamat Penerusan diurai untuk keunikan (karena kami tidak ingin mengirim duplikat ke satu alamat atau memunculkan koneksi klien SMTP tambahan yang tidak perlu).
   * Untuk setiap Alamat Penerusan, kami mencari nama domainnya terhadap endpoint API kami `/v1/max-forwarded-addresses` (untuk menentukan berapa banyak alamat yang diizinkan domain untuk meneruskan email per alias, misalnya 10 secara default – lihat bagian tentang [batas maksimum penerusan per alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Jika batas ini terlampaui, maka akan terjadi kesalahan 550 dan pengirim akan menerima bounce untuk penerima ini.
   * Kami mencari pengaturan penerima asli terhadap endpoint API kami `/v1/settings`, yang mendukung pencarian untuk pengguna berbayar (dengan fallback untuk pengguna gratis). Ini mengembalikan objek konfigurasi untuk pengaturan lanjutan `port` (Angka, misalnya `25`), `has_adult_content_protection` (Boolean), `has_phishing_protection` (Boolean), `has_executable_protection` (Boolean), dan `has_virus_protection` (Boolean).
   * Berdasarkan pengaturan ini, kami kemudian memeriksa hasil Pemindai Spam dan jika terjadi kesalahan, maka pesan ditolak dengan kode kesalahan 554 (misalnya jika `has_virus_protection` diaktifkan, maka kami akan memeriksa hasil Pemindai Spam untuk virus). Perlu dicatat bahwa semua pengguna paket gratis akan otomatis ikut pemeriksaan terhadap konten dewasa, phishing, executable, dan virus. Secara default, semua pengguna paket berbayar juga ikut serta, tetapi konfigurasi ini dapat diubah di halaman Pengaturan untuk domain di dasbor Forward Email).

10. Untuk setiap Alamat Penerusan penerima yang telah diproses, kami kemudian melakukan operasi berikut:

    * Alamat diperiksa terhadap [daftar tolak](#do-you-have-a-denylist) kami, dan jika terdaftar, maka akan terjadi kesalahan 421 (menandakan kepada pengirim untuk mencoba lagi nanti).
    * Jika alamat adalah webhook, maka kami menetapkan Boolean untuk operasi selanjutnya (lihat di bawah – kami mengelompokkan webhook serupa untuk membuat satu permintaan POST dibandingkan beberapa untuk pengiriman).
    * Jika alamat adalah alamat email, maka kami mengurai host untuk operasi selanjutnya (lihat di bawah – kami mengelompokkan host serupa untuk membuat satu koneksi dibandingkan beberapa koneksi individual untuk pengiriman).
11. Jika tidak ada penerima dan tidak ada bounce, maka kami merespons dengan error 550 "Invalid recipients".

12. Jika ada penerima, maka kami akan mengiterasi mereka (dikelompokkan berdasarkan host yang sama) dan mengirimkan email. Lihat bagian [Bagaimana Anda menangani masalah pengiriman email](#how-do-you-handle-email-delivery-issues) di bawah untuk wawasan lebih lanjut.

    * Jika terjadi kesalahan saat mengirim email, maka kami akan menyimpannya di memori untuk diproses kemudian.
    * Kami akan mengambil kode error terendah (jika ada) dari pengiriman email – dan menggunakan itu sebagai kode respons untuk perintah `DATA`. Ini berarti bahwa email yang tidak terkirim biasanya akan dicoba ulang oleh pengirim asli, namun email yang sudah terkirim tidak akan dikirim ulang saat pesan dikirim lagi (karena kami menggunakan [Fingerprinting](#how-do-you-determine-an-email-fingerprint)).
    * Jika tidak ada kesalahan, maka kami akan mengirimkan kode status respons SMTP 250 sukses.
    * Bounce ditentukan sebagai setiap percobaan pengiriman yang menghasilkan kode status >= 500 (gagal permanen).

13. Jika tidak terjadi bounce (gagal permanen), maka kami akan mengembalikan kode status respons SMTP dari kode error terendah dari kegagalan non-permanen (atau kode status sukses 250 jika tidak ada).

14. Jika terjadi bounce maka kami akan mengirim email bounce di latar belakang setelah mengembalikan kode error terendah kepada pengirim. Namun, jika kode error terendah >= 500, maka kami tidak mengirim email bounce apapun. Ini karena jika kami melakukannya, pengirim akan menerima email bounce ganda (misalnya satu dari MTA keluar mereka, seperti Gmail – dan juga satu dari kami). Lihat bagian [Bagaimana Anda melindungi dari backscatter](#how-do-you-protect-against-backscatter) di bawah untuk wawasan lebih lanjut.

### Bagaimana Anda menangani masalah pengiriman email {#how-do-you-handle-email-delivery-issues}

Perlu dicatat bahwa kami akan melakukan penulisan ulang "Friendly-From" pada email hanya jika kebijakan DMARC pengirim tidak lolos DAN tidak ada tanda tangan DKIM yang selaras dengan header "From". Ini berarti kami akan mengubah header "From" pada pesan, mengatur "X-Original-From", dan juga mengatur "Reply-To" jika belum diatur. Kami juga akan menutup kembali segel ARC pada pesan setelah mengubah header ini.

Kami juga menggunakan parsing cerdas dari pesan error di setiap level tumpukan kami – dalam kode kami, permintaan DNS, internal Node.js, permintaan HTTP (misalnya 408, 413, dan 429 dipetakan ke kode respons SMTP 421 jika penerima adalah webhook), dan respons server mail (misalnya respons dengan "defer" atau "slowdown" akan dicoba ulang sebagai error 421).

Logika kami sangat tahan kesalahan dan juga akan mencoba ulang untuk error SSL/TLS, masalah koneksi, dan lainnya. Tujuan dari tahan kesalahan ini adalah untuk memaksimalkan keterkiriman ke semua penerima untuk konfigurasi penerusan.

Jika penerima adalah webhook, maka kami akan mengizinkan timeout 60 detik untuk permintaan selesai dengan hingga 3 kali coba ulang (jadi total 4 permintaan sebelum gagal). Perlu dicatat bahwa kami mem-parsing dengan benar kode error 408, 413, dan 429 dan memetakannya ke kode respons SMTP 421.

Jika penerima adalah alamat email, maka kami akan mencoba mengirim email dengan TLS oportunistik (kami mencoba menggunakan STARTTLS jika tersedia di server mail penerima). Jika terjadi error SSL/TLS saat mencoba mengirim email, maka kami akan mencoba mengirim email tanpa TLS (tanpa menggunakan STARTTLS).

Jika terjadi error DNS atau koneksi, maka kami akan mengembalikan ke perintah `DATA` kode respons SMTP 421, jika tidak jika ada error level >= 500, maka bounce akan dikirim.

Jika kami mendeteksi bahwa server email yang kami coba kirim memiliki satu atau lebih alamat IP mail exchange kami diblokir (misalnya oleh teknologi apapun yang mereka gunakan untuk menunda spammer), maka kami akan mengirim kode respons SMTP 421 agar pengirim mencoba ulang pesan mereka nanti (dan kami diberi tahu tentang masalah ini sehingga kami dapat mencoba menyelesaikannya sebelum percobaan berikutnya).

### Bagaimana Anda menangani alamat IP Anda yang diblokir {#how-do-you-handle-your-ip-addresses-becoming-blocked}
Kami secara rutin memantau semua daftar tolak DNS utama dan jika ada alamat IP pertukaran surat ("MX") kami yang terdaftar dalam daftar tolak utama, kami akan mengeluarkannya dari rekaman DNS A yang relevan secara bergiliran jika memungkinkan sampai masalah tersebut diselesaikan.

Pada saat penulisan ini, kami juga terdaftar di beberapa daftar izinkan DNS, dan kami sangat serius dalam memantau daftar tolak. Jika Anda melihat masalah sebelum kami sempat menyelesaikannya, harap beri tahu kami secara tertulis di <support@forwardemail.net>.

Alamat IP kami tersedia secara publik, [lihat bagian ini di bawah untuk wawasan lebih lanjut](#what-are-your-servers-ip-addresses).

### Apa itu alamat postmaster {#what-are-postmaster-addresses}

Untuk mencegah pantulan yang salah arah dan pengiriman pesan penjawab liburan ke kotak surat yang tidak dipantau atau tidak ada, kami memelihara daftar nama pengguna seperti mailer-daemon:

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
* [dan alamat no-reply apa pun](#what-are-no-reply-addresses)

Lihat [RFC 5320 Bagian 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) untuk wawasan lebih lanjut tentang bagaimana daftar seperti ini digunakan untuk membuat sistem email yang efisien.

### Apa itu alamat no-reply {#what-are-no-reply-addresses}

Nama pengguna email yang sama dengan salah satu dari berikut ini (tidak peka huruf besar/kecil) dianggap sebagai alamat no-reply:

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

### Apakah Anda memiliki daftar izinkan {#do-you-have-an-allowlist}

Ya, kami memiliki [daftar ekstensi nama domain](#what-domain-name-extensions-are-allowlisted-by-default) yang secara default diizinkan dan daftar izinkan dinamis, cache, dan bergulir berdasarkan [kriteria ketat](#what-is-your-allowlist-criteria).

Semua domain, email, dan alamat IP yang digunakan oleh pelanggan yang membayar secara otomatis diperiksa terhadap daftar tolak kami setiap jam – yang memberi peringatan kepada admin yang dapat melakukan intervensi manual jika diperlukan.

Selain itu, jika salah satu domain Anda atau alamat emailnya masuk daftar tolak (misalnya karena mengirim spam, virus, atau karena serangan peniruan) – maka admin domain (Anda) dan admin tim kami akan diberitahu melalui email segera. Kami sangat menyarankan agar Anda [mengonfigurasi DMARC](#how-do-i-set-up-dmarc-for-forward-email) untuk mencegah hal ini.

### Ekstensi nama domain apa yang secara default diizinkan {#what-domain-name-extensions-are-allowlisted-by-default}

Ekstensi nama domain berikut dianggap secara default diizinkan (terlepas apakah mereka ada di Daftar Popularitas Umbrella atau tidak):

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
  <li class="list-inline-item"><code class="notranslate">mil.in</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ed.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">lg.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.za</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.za</code></li>
  <li class="list-inline-item"><code class="notranslate">school.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.kr</code></li>
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
Selain itu, [domain tingkat atas merek dan korporat](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) ini secara default diizinkan (misalnya `apple` untuk `applecard.apple` untuk laporan bank Apple Card):

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
  <li class="list-inline-item"><code class="notranslate">basketball</code></li>
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
  <!--<li class="list-inline-item"><code class="notranslate">bond</code></li>-->
  <li class="list-inline-item"><code class="notranslate">booking</code></li>
  <li class="list-inline-item"><code class="notranslate">bosch</code></li>
  <li class="list-inline-item"><code class="notranslate">bostik</code></li>
  <li class="list-inline-item"><code class="notranslate">bradesco</code></li>
  <li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
  <li class="list-inline-item"><code class="notranslate">brother</code></li>
  <li class="list-inline-item"><code class="notranslate">bugatti</code></li>
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
  <li class="list-inline-item"><code class="notranslate">chrysler</code></li>
  <li class="list-inline-item"><code class="notranslate">cipriani</code></li>
  <li class="list-inline-item"><code class="notranslate">cisco</code></li>
  <li class="list-inline-item"><code class="notranslate">citadel</code></li>
  <li class="list-inline-item"><code class="notranslate">citi</code></li>
  <li class="list-inline-item"><code class="notranslate">citic</code></li>
  <li class="list-inline-item"><code class="notranslate">clubmed</code></li>
  <li class="list-inline-item"><code class="notranslate">comcast</code></li>
  <li class="list-inline-item"><code class="notranslate">commbank</code></li>
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
  <li class="list-inline-item"><code class="notranslate">eurovision</code></li>
  <li class="list-inline-item"><code class="notranslate">everbank</code></li>
  <li class="list-inline-item"><code class="notranslate">extraspace</code></li>
  <li class="list-inline-item"><code class="notranslate">fage</code></li>
  <li class="list-inline-item"><code class="notranslate">fairwinds</code></li>
  <li class="list-inline-item"><code class="notranslate">farmers</code></li>
  <li class="list-inline-item"><code class="notranslate">fedex</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrari</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrero</code></li>
  <li class="list-inline-item"><code class="notranslate">fiat</code></li>
  <li class="list-inline-item"><code class="notranslate">fidelity</code></li>
  <li class="list-inline-item"><code class="notranslate">firestone</code></li>
  <li class="list-inline-item"><code class="notranslate">firmdale</code></li>
  <li class="list-inline-item"><code class="notranslate">flickr</code></li>
  <li class="list-inline-item"><code class="notranslate">flir</code></li>
  <li class="list-inline-item"><code class="notranslate">flsmidth</code></li>
  <li class="list-inline-item"><code class="notranslate">ford</code></li>
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
  <li class="list-inline-item"><code class="notranslate">giving</code></li>
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
  <li class="list-inline-item"><code class="notranslate">guardian</code></li>
  <li class="list-inline-item"><code class="notranslate">gucci</code></li>
  <li class="list-inline-item"><code class="notranslate">hbo</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfc</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfcbank</code></li>
  <li class="list-inline-item"><code class="notranslate">hermes</code></li>
  <li class="list-inline-item"><code class="notranslate">hisamitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">hitachi</code></li>
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
  <li class="list-inline-item"><code class="notranslate">lancaster</code></li>
  <li class="list-inline-item"><code class="notranslate">lancia</code></li>
  <li class="list-inline-item"><code class="notranslate">lancome</code></li>
  <li class="list-inline-item"><code class="notranslate">landrover</code></li>
  <li class="list-inline-item"><code class="notranslate">lanxess</code></li>
  <li class="list-inline-item"><code class="notranslate">lasalle</code></li>
  <li class="list-inline-item"><code class="notranslate">latrobe</code></li>
  <li class="list-inline-item"><code class="notranslate">lds</code></li>
  <li class="list-inline-item"><code class="notranslate">leclerc</code></li>
  <li class="list-inline-item"><code class="notranslate">lego</code></li>
  <li class="list-inline-item"><code class="notranslate">liaison</code></li>
  <li class="list-inline-item"><code class="notranslate">lexus</code></li>
  <li class="list-inline-item"><code class="notranslate">lidl</code></li>
  <li class="list-inline-item"><code class="notranslate">lifestyle</code></li>
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
  <li class="list-inline-item"><code class="notranslate">macys</code></li>
  <li class="list-inline-item"><code class="notranslate">maif</code></li>
  <li class="list-inline-item"><code class="notranslate">man</code></li>
  <li class="list-inline-item"><code class="notranslate">mango</code></li>
  <li class="list-inline-item"><code class="notranslate">marriott</code></li>
  <li class="list-inline-item"><code class="notranslate">maserati</code></li>
  <li class="list-inline-item"><code class="notranslate">mattel</code></li>
  <li class="list-inline-item"><code class="notranslate">mckinsey</code></li>
  <li class="list-inline-item"><code class="notranslate">metlife</code></li>
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
  <li class="list-inline-item"><code class="notranslate">nationwide</code></li>
  <li class="list-inline-item"><code class="notranslate">natura</code></li>
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
  <li class="list-inline-item"><code class="notranslate">playstation</code></li>
  <li class="list-inline-item"><code class="notranslate">pohl</code></li>
  <li class="list-inline-item"><code class="notranslate">politie</code></li>
  <li class="list-inline-item"><code class="notranslate">praxi</code></li>
  <li class="list-inline-item"><code class="notranslate">prod</code></li>
  <li class="list-inline-item"><code class="notranslate">progressive</code></li>
  <li class="list-inline-item"><code class="notranslate">pru</code></li>
  <li class="list-inline-item"><code class="notranslate">prudential</code></li>
  <li class="list-inline-item"><code class="notranslate">pwc</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">quest</code></li>-->
  <li class="list-inline-item"><code class="notranslate">qvc</code></li>
  <li class="list-inline-item"><code class="notranslate">redstone</code></li>
  <li class="list-inline-item"><code class="notranslate">reliance</code></li>
  <li class="list-inline-item"><code class="notranslate">rexroth</code></li>
  <li class="list-inline-item"><code class="notranslate">ricoh</code></li>
  <li class="list-inline-item"><code class="notranslate">rmit</code></li>
  <li class="list-inline-item"><code class="notranslate">rocher</code></li>
  <li class="list-inline-item"><code class="notranslate">rogers</code></li>
  <li class="list-inline-item"><code class="notranslate">rwe</code></li>
  <li class="list-inline-item"><code class="notranslate">safety</code></li>
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
  <li class="list-inline-item"><code class="notranslate">seek</code></li>
  <li class="list-inline-item"><code class="notranslate">shangrila</code></li>
  <li class="list-inline-item"><code class="notranslate">sharp</code></li>
  <li class="list-inline-item"><code class="notranslate">shaw</code></li>
  <li class="list-inline-item"><code class="notranslate">shell</code></li>
  <li class="list-inline-item"><code class="notranslate">shriram</code></li>
  <li class="list-inline-item"><code class="notranslate">sina</code></li>
  <li class="list-inline-item"><code class="notranslate">sky</code></li>
  <li class="list-inline-item"><code class="notranslate">skype</code></li>
  <li class="list-inline-item"><code class="notranslate">smart</code></li>
  <li class="list-inline-item"><code class="notranslate">sncf</code></li>
  <li class="list-inline-item"><code class="notranslate">softbank</code></li>
  <li class="list-inline-item"><code class="notranslate">sohu</code></li>
  <li class="list-inline-item"><code class="notranslate">sony</code></li>
  <li class="list-inline-item"><code class="notranslate">spiegel</code></li>
  <li class="list-inline-item"><code class="notranslate">stada</code></li>
  <li class="list-inline-item"><code class="notranslate">staples</code></li>
  <li class="list-inline-item"><code class="notranslate">star</code></li>
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
  <li class="list-inline-item"><code class="notranslate">verisign</code></li>
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
Per 18 Maret 2025 kami juga telah menambahkan wilayah luar negeri Prancis ini ke dalam daftar ini ([sesuai permintaan GitHub ini](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

Per 8 Juli 2025 kami telah menambahkan negara-negara khusus Eropa ini:

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

Pada Oktober 2025 kami juga telah menambahkan <code class="notranslate">cz</code> (Republik Ceko) karena permintaan.

Kami secara khusus tidak memasukkan `ru` dan `ua` karena aktivitas spam yang tinggi.

### Apa kriteria daftar izinkan Anda {#what-is-your-allowlist-criteria}

Kami memiliki daftar statis dari [ekstensi nama domain yang diizinkan secara default](#what-domain-name-extensions-are-allowlisted-by-default) – dan kami juga memelihara daftar izinkan dinamis, cache, dan bergulir berdasarkan kriteria ketat berikut:

* Domain root pengirim harus dari [ekstensi nama domain yang sesuai dengan daftar yang kami tawarkan pada paket gratis kami](#what-domain-name-extensions-can-be-used-for-free) (dengan tambahan `biz` dan `info`). Kami juga menyertakan kecocokan parsial `edu`, `gov`, dan `mil`, seperti `xyz.gov.au` dan `xyz.edu.au`.
* Domain root pengirim harus termasuk dalam 100.000 hasil domain root unik teratas yang diparsing dari [Umbrella Popularity List](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* Domain root pengirim harus termasuk dalam 50.000 hasil teratas dari domain root unik yang muncul setidaknya di 4 dari 7 hari terakhir UPL (~50%+).
* Domain root pengirim tidak boleh [dikategorikan](https://radar.cloudflare.com/categorization-feedback/) sebagai konten dewasa atau malware oleh Cloudflare.
* Domain root pengirim harus memiliki catatan A atau MX yang disetel.
* Domain root pengirim harus memiliki catatan A, catatan MX, catatan DMARC dengan `p=reject` atau `p=quarantine`, atau catatan SPF dengan kualifikasi `-all` atau `~all`.

Jika kriteria ini terpenuhi, maka domain root pengirim akan di-cache selama 7 hari. Perlu dicatat bahwa pekerjaan otomatis kami berjalan setiap hari – oleh karena itu ini adalah cache daftar izinkan bergulir yang diperbarui setiap hari.

Pekerjaan otomatis kami akan mengunduh 7 hari terakhir UPL secara in-memory, mengekstraknya, lalu memparsing secara in-memory sesuai dengan kriteria ketat di atas.

Domain populer pada saat penulisan ini seperti Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify, dan lainnya – tentu saja termasuk.
Jika Anda adalah pengirim yang tidak ada dalam daftar izinkan kami, maka pertama kali domain root FQDN atau alamat IP Anda mengirim email, Anda akan dikenai [batasan laju](#do-you-have-rate-limiting) dan [daftar abu-abu](#do-you-have-a-greylist). Perlu dicatat bahwa ini adalah praktik standar yang diadopsi sebagai standar email. Sebagian besar klien server email akan mencoba mengirim ulang jika mereka menerima kesalahan batasan laju atau daftar abu-abu (misalnya kode status kesalahan 421 atau tingkat 4xx).

**Perlu dicatat bahwa pengirim tertentu seperti `a@gmail.com`, `b@xyz.edu`, dan `c@gov.au` masih dapat [diblokir](#do-you-have-a-denylist)** (misalnya jika kami secara otomatis mendeteksi spam, phishing, atau malware dari pengirim tersebut).

### Ekstensi nama domain apa saja yang dapat digunakan secara gratis {#what-domain-name-extensions-can-be-used-for-free}

Mulai 31 Maret 2023 kami memberlakukan aturan spam baru secara menyeluruh untuk melindungi pengguna dan layanan kami.

Aturan baru ini hanya mengizinkan ekstensi nama domain berikut untuk digunakan pada paket gratis kami:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ac</code></li>
  <li class="list-inline-item"><code class="notranslate">ad</code></li>
  <li class="list-inline-item"><code class="notranslate">ag</code></li>
  <li class="list-inline-item"><code class="notranslate">ai</code></li>
  <li class="list-inline-item"><code class="notranslate">al</code></li>
  <li class="list-inline-item"><code class="notranslate">am</code></li>
  <li class="list-inline-item"><code class="notranslate">app</code></li>
  <li class="list-inline-item"><code class="notranslate">as</code></li>
  <li class="list-inline-item"><code class="notranslate">at</code></li>
  <li class="list-inline-item"><code class="notranslate">au</code></li>
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">ba</code></li>
  <li class="list-inline-item"><code class="notranslate">be</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">br</code></li>
  <li class="list-inline-item"><code class="notranslate">by</code></li>
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">ca</code></li>
  <li class="list-inline-item"><code class="notranslate">cat</code></li>
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
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gl</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">id</code></li>
  <li class="list-inline-item"><code class="notranslate">ie</code></li>
  <li class="list-inline-item"><code class="notranslate">il</code></li>
  <li class="list-inline-item"><code class="notranslate">im</code></li>
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
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">lv</code></li>
  <li class="list-inline-item"><code class="notranslate">ly</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">md</code></li>
  <li class="list-inline-item"><code class="notranslate">me</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mn</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">ms</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">mu</code></li>
  <li class="list-inline-item"><code class="notranslate">mx</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">net</code></li>
  <li class="list-inline-item"><code class="notranslate">ni</code></li>
  <li class="list-inline-item"><code class="notranslate">nl</code></li>
  <li class="list-inline-item"><code class="notranslate">no</code></li>
  <li class="list-inline-item"><code class="notranslate">nu</code></li>
  <li class="list-inline-item"><code class="notranslate">nz</code></li>
  <li class="list-inline-item"><code class="notranslate">org</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pl</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">pr</code></li>
  <li class="list-inline-item"><code class="notranslate">pt</code></li>
  <li class="list-inline-item"><code class="notranslate">pw</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">rs</code></li>
  <li class="list-inline-item"><code class="notranslate">sc</code></li>
  <li class="list-inline-item"><code class="notranslate">se</code></li>
  <li class="list-inline-item"><code class="notranslate">sh</code></li>
  <li class="list-inline-item"><code class="notranslate">si</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">sm</code></li>
  <li class="list-inline-item"><code class="notranslate">sr</code></li>
  <li class="list-inline-item"><code class="notranslate">st</code></li>
  <li class="list-inline-item"><code class="notranslate">tc</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">tm</code></li>
  <li class="list-inline-item"><code class="notranslate">to</code></li>
  <li class="list-inline-item"><code class="notranslate">tv</code></li>
  <li class="list-inline-item"><code class="notranslate">uk</code></li>
  <li class="list-inline-item"><code class="notranslate">us</code></li>
  <li class="list-inline-item"><code class="notranslate">uz</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
  <li class="list-inline-item"><code class="notranslate">vc</code></li>
  <li class="list-inline-item"><code class="notranslate">vg</code></li>
  <li class="list-inline-item"><code class="notranslate">vu</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">ws</code></li>
  <li class="list-inline-item"><code class="notranslate">xyz</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
  <li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>
### Apakah Anda memiliki greylist {#do-you-have-a-greylist}

Ya, kami menggunakan kebijakan [greylisting email](https://en.wikipedia.org/wiki/Greylisting_\(email\)) yang sangat longgar. Greylisting hanya berlaku untuk pengirim yang tidak ada dalam allowlist kami dan bertahan dalam cache kami selama 30 hari.

Untuk pengirim baru, kami menyimpan kunci di database Redis kami selama 30 hari dengan nilai yang diatur ke waktu kedatangan awal dari permintaan pertama mereka. Kami kemudian menolak email mereka dengan kode status retry 450 dan hanya mengizinkannya lewat setelah 5 menit berlalu.

Jika mereka berhasil menunggu selama 5 menit dari waktu kedatangan awal ini, maka email mereka akan diterima dan mereka tidak akan menerima kode status 450 ini.

Kunci terdiri dari domain root FQDN atau alamat IP pengirim. Ini berarti bahwa sub-domain mana pun yang melewati greylist juga akan lolos untuk domain root, dan sebaliknya (ini yang kami maksud dengan kebijakan "sangat longgar").

Misalnya, jika email datang dari `test.example.com` sebelum kami melihat email dari `example.com`, maka email dari `test.example.com` dan/atau `example.com` harus menunggu 5 menit dari waktu kedatangan awal koneksi. Kami tidak membuat `test.example.com` dan `example.com` masing-masing menunggu periode 5 menit mereka sendiri (kebijakan greylisting kami berlaku pada tingkat domain root).

Perlu dicatat bahwa greylisting tidak berlaku untuk pengirim yang ada di [allowlist](#do-you-have-an-allowlist) kami (misalnya Meta, Amazon, Netflix, Google, Microsoft pada saat penulisan ini).

### Apakah Anda memiliki denylist {#do-you-have-a-denylist}

Ya, kami mengoperasikan denylist kami sendiri dan memperbaruinya secara otomatis secara real-time dan manual berdasarkan aktivitas spam dan berbahaya yang terdeteksi.

Kami juga menarik semua alamat IP dari denylist UCEPROTECT Level 1 di <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> setiap jam dan memasukkannya ke denylist kami dengan masa berlaku 7 hari.

Pengirim yang ditemukan dalam denylist akan menerima kode error 421 (menandakan kepada pengirim untuk mencoba lagi nanti) jika mereka [tidak ada dalam allowlist](#do-you-have-an-allowlist).

Dengan menggunakan kode status 421 alih-alih 554, potensi false positive dapat diatasi secara real-time dan kemudian pesan dapat berhasil dikirim pada percobaan berikutnya.

**Ini dirancang berbeda dari layanan email lain**, di mana jika Anda masuk ke blocklist, terjadi kegagalan keras dan permanen. Seringkali sulit meminta pengirim untuk mencoba ulang pesan (terutama dari organisasi besar), dan oleh karena itu pendekatan ini memberikan sekitar 5 hari dari percobaan email awal agar pengirim, penerima, atau kami dapat mengambil tindakan untuk mengatasi masalah (dengan meminta penghapusan denylist).

Semua permintaan penghapusan denylist dipantau secara real-time oleh admin (misalnya agar false positive yang berulang dapat secara permanen dimasukkan ke allowlist oleh admin).

Permintaan penghapusan denylist dapat diajukan di <https://forwardemail.net/denylist>. Pengguna berbayar permintaan penghapusan denylistnya diproses secara instan, sementara pengguna non-bayar harus menunggu admin memproses permintaan mereka.

Pengirim yang terdeteksi mengirim spam atau konten virus akan ditambahkan ke denylist dengan pendekatan berikut:

1. [Sidik jari pesan awal](#how-do-you-determine-an-email-fingerprint) di-greylist saat terdeteksi spam atau blocklist dari pengirim "terpercaya" (misalnya `gmail.com`, `microsoft.com`, `apple.com`).
   * Jika pengirim ada dalam allowlist, pesan di-greylist selama 1 jam.
   * Jika pengirim tidak ada dalam allowlist, pesan di-greylist selama 6 jam.
2. Kami mengurai kunci denylist dari informasi pengirim dan pesan, dan untuk setiap kunci ini kami membuat (jika belum ada) penghitung, menambahnya sebanyak 1, dan menyimpannya selama 24 jam.
   * Untuk pengirim yang ada dalam allowlist:
     * Tambahkan kunci untuk alamat email "MAIL FROM" envelope jika memiliki SPF yang lolos atau tanpa SPF, dan bukan [username postmaster](#what-are-postmaster-addresses) atau [username no-reply](#what-are-no-reply-addresses).
     * Jika header "From" ada dalam allowlist, maka tambahkan kunci untuk alamat email header "From" jika memiliki SPF yang lolos atau DKIM yang lolos dan selaras.
     * Jika header "From" tidak ada dalam allowlist, maka tambahkan kunci untuk alamat email header "From" dan nama domain root yang diurai.
   * Untuk pengirim yang tidak ada dalam allowlist:
     * Tambahkan kunci untuk alamat email "MAIL FROM" envelope jika memiliki SPF yang lolos.
     * Jika header "From" ada dalam allowlist, maka tambahkan kunci untuk alamat email header "From" jika memiliki SPF yang lolos atau DKIM yang lolos dan selaras.
     * Jika header "From" tidak ada dalam allowlist, maka tambahkan kunci untuk alamat email header "From" dan nama domain root yang diurai.
     * Tambahkan kunci untuk alamat IP remote pengirim.
     * Tambahkan kunci untuk hostname yang di-resolve klien dengan pencarian balik dari alamat IP pengirim (jika ada).
     * Tambahkan kunci untuk domain root dari hostname yang di-resolve klien (jika ada, dan jika berbeda dari hostname yang di-resolve klien).
3. Jika penghitung mencapai 5 untuk pengirim dan kunci yang tidak ada dalam allowlist, maka kami memasukkan kunci tersebut ke denylist selama 30 hari dan email dikirim ke tim abuse kami. Angka ini dapat berubah dan pembaruan akan tercermin di sini saat kami memantau abuse.
4. Jika penghitung mencapai 10 untuk pengirim dan kunci yang ada dalam allowlist, maka kami memasukkan kunci tersebut ke denylist selama 7 hari dan email dikirim ke tim abuse kami. Angka ini dapat berubah dan pembaruan akan tercermin di sini saat kami memantau abuse.
> **CATATAN:** Dalam waktu dekat kami akan memperkenalkan pemantauan reputasi. Pemantauan reputasi akan menghitung kapan harus memasukkan pengirim ke daftar hitam berdasarkan ambang persentase (berbeda dengan penghitung sederhana seperti yang disebutkan di atas).

### Apakah Anda memiliki pembatasan laju {#do-you-have-rate-limiting}

Pembatasan laju pengirim dilakukan berdasarkan domain root yang diurai dari pencarian PTR terbalik pada alamat IP pengirim – atau jika itu tidak menghasilkan hasil, maka hanya menggunakan alamat IP pengirim. Perlu dicatat bahwa kami menyebut ini sebagai `Sender` di bawah ini.

Server MX kami memiliki batas harian untuk email masuk yang diterima untuk [penyimpanan IMAP terenkripsi](/blog/docs/best-quantum-safe-encrypted-email-service):

* Alih-alih membatasi laju email masuk yang diterima berdasarkan alias individu (misalnya `you@yourdomain.com`) – kami membatasi laju berdasarkan nama domain alias itu sendiri (misalnya `yourdomain.com`). Ini mencegah `Senders` membanjiri kotak masuk semua alias di seluruh domain Anda sekaligus.
* Kami memiliki batas umum yang berlaku untuk semua `Senders` di seluruh layanan kami tanpa memandang penerima:
  * `Senders` yang kami anggap "tepercaya" sebagai sumber kebenaran (misalnya `gmail.com`, `microsoft.com`, `apple.com`) dibatasi mengirim 100 GB per hari.
  * `Senders` yang [terdaftar dalam daftar izinkan](#do-you-have-an-allowlist) dibatasi mengirim 10 GB per hari.
  * Semua `Senders` lainnya dibatasi mengirim 1 GB dan/atau 1000 pesan per hari.
* Kami memiliki batas spesifik per `Sender` dan `yourdomain.com` sebesar 1 GB dan/atau 1000 pesan setiap hari.

Server MX juga membatasi pesan yang diteruskan ke satu atau lebih penerima melalui pembatasan laju – tetapi ini hanya berlaku untuk `Senders` yang tidak ada dalam [daftar izinkan](#do-you-have-an-allowlist):

* Kami hanya mengizinkan hingga 100 koneksi per jam, per domain root FQDN `Sender` yang dipecahkan (atau) alamat IP jarak jauh `Sender` (jika tidak ada PTR terbalik), dan per penerima amplop. Kami menyimpan kunci untuk pembatasan laju sebagai hash kriptografi dalam database Redis kami.

* Jika Anda mengirim email melalui sistem kami, pastikan Anda telah mengatur PTR terbalik untuk semua alamat IP Anda (jika tidak, setiap domain root FQDN unik atau alamat IP yang Anda gunakan untuk mengirim akan dibatasi laju).

* Perlu dicatat bahwa jika Anda mengirim melalui sistem populer seperti Amazon SES, maka Anda tidak akan dibatasi laju karena (pada saat penulisan ini) Amazon SES tercantum dalam daftar izinkan kami.

* Jika Anda mengirim dari domain seperti `test.abc.123.example.com`, maka batas laju akan dikenakan pada `example.com`. Banyak spammer menggunakan ratusan sub-domain untuk menghindari filter spam umum yang hanya membatasi laju hostname unik dibandingkan domain root FQDN unik.

* `Senders` yang melebihi batas laju akan ditolak dengan kesalahan 421.

Server IMAP dan SMTP kami membatasi alias Anda agar tidak memiliki lebih dari `60` koneksi bersamaan sekaligus.

Server MX kami membatasi pengirim [yang tidak ada dalam daftar izinkan](#do-you-have-an-allowlist) agar tidak membuat lebih dari 10 koneksi bersamaan (dengan masa kedaluwarsa cache 3 menit untuk penghitung, yang mencerminkan waktu habis socket kami selama 3 menit).

### Bagaimana Anda melindungi dari backscatter {#how-do-you-protect-against-backscatter}

Pantulan yang salah arah atau spam pantulan (dikenal sebagai "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") dapat menyebabkan reputasi negatif pada alamat IP pengirim.

Kami mengambil dua langkah untuk melindungi dari backscatter, yang dijelaskan dalam bagian berikut [Mencegah pantulan dari spammer MAIL FROM yang dikenal](#prevent-bounces-from-known-mail-from-spammers) dan [Mencegah pantulan yang tidak perlu untuk melindungi dari backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter) di bawah ini.

### Mencegah pantulan dari spammer MAIL FROM yang dikenal {#prevent-bounces-from-known-mail-from-spammers}

Kami mengambil daftar dari [Backscatter.org](https://www.backscatterer.org/) (didukung oleh [UCEPROTECT](https://www.uceprotect.net/)) di <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> setiap jam dan memasukkannya ke dalam database Redis kami (kami juga membandingkan perbedaan sebelumnya; jika ada IP yang dihapus yang perlu dihormati).
Jika MAIL FROM kosong ATAU sama dengan (tidak peka huruf besar/kecil) salah satu dari [alamat postmaster](#what-are-postmaster-addresses) (bagian sebelum @ dalam email), maka kami memeriksa apakah IP pengirim cocok dengan salah satu dari daftar ini.

Jika IP pengirim terdaftar (dan tidak ada dalam [daftar izinkan](#do-you-have-an-allowlist) kami), maka kami mengirimkan kesalahan 554 dengan pesan `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Kami akan diberi tahu jika pengirim ada di daftar Backscatterer dan juga dalam daftar izinkan kami sehingga kami dapat menyelesaikan masalah jika diperlukan.

Teknik yang dijelaskan dalam bagian ini mematuhi rekomendasi "SAFE MODE" di <https://www.backscatterer.org/?target=usage> – di mana kami hanya memeriksa IP pengirim jika kondisi tertentu sudah terpenuhi.

### Mencegah bounce yang tidak perlu untuk melindungi dari backscatter {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Bounce adalah email yang menunjukkan pengiriman email yang diteruskan gagal sepenuhnya ke penerima dan email tidak akan dicoba ulang.

Alasan umum untuk masuk ke daftar Backscatterer adalah bounce yang salah arah atau spam bounce, jadi kami harus melindungi dari ini dengan beberapa cara:

1. Kami hanya mengirim saat terjadi kesalahan status >= 500 (ketika email yang dicoba untuk diteruskan gagal, misalnya Gmail merespons dengan kesalahan level 500).

2. Kami hanya mengirim sekali dan hanya sekali (kami menggunakan kunci sidik jari bounce yang dihitung dan menyimpannya di cache untuk mencegah pengiriman duplikat). Sidik jari bounce adalah kunci yang merupakan sidik jari pesan digabungkan dengan hash dari alamat bounce dan kode kesalahannya). Lihat bagian tentang [Fingerprinting](#how-do-you-determine-an-email-fingerprint) untuk wawasan lebih lanjut tentang bagaimana sidik jari pesan dihitung. Sidik jari bounce yang berhasil dikirim akan kedaluwarsa setelah 7 hari di cache Redis kami.

3. Kami hanya mengirim saat MAIL FROM dan/atau From tidak kosong dan tidak mengandung (tidak peka huruf besar/kecil) [username postmaster](#what-are-postmaster-addresses) (bagian sebelum @ dalam email).

4. Kami tidak mengirim jika pesan asli memiliki salah satu header berikut (tidak peka huruf besar/kecil):

   * Header `auto-submitted` dengan nilai tidak sama dengan `no`.
   * Header `x-auto-response-suppress` dengan nilai `dr`, `autoreply`, `auto-reply`, `auto_reply`, atau `all`
   * Header `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond`, atau `x-auto-respond` (terlepas dari nilainya).
   * Header `precedence` dengan nilai `bulk`, `autoreply`, `auto-reply`, `auto_reply`, atau `list`.

5. Kami tidak mengirim jika alamat email MAIL FROM atau From berakhiran `+donotreply`, `-donotreply`, `+noreply`, atau `-noreply`.

6. Kami tidak mengirim jika bagian username alamat email From adalah `mdaemon` dan memiliki header `X-MDDSN-Message` (tidak peka huruf besar/kecil).

7. Kami tidak mengirim jika ada header `content-type` dengan nilai `multipart/report` (tidak peka huruf besar/kecil).

### Bagaimana Anda menentukan sidik jari email {#how-do-you-determine-an-email-fingerprint}

Sidik jari email digunakan untuk menentukan keunikan sebuah email dan mencegah pengiriman pesan duplikat serta pengiriman [bounce duplikat](#prevent-unnecessary-bounces-to-protect-against-backscatter).

Sidik jari dihitung dari daftar berikut:

* Hostname FQDN yang dipecahkan klien atau alamat IP
* Nilai header `Message-ID` (jika ada)
* Nilai header `Date` (jika ada)
* Nilai header `From` (jika ada)
* Nilai header `To` (jika ada)
* Nilai header `Cc` (jika ada)
* Nilai header `Subject` (jika ada)
* Nilai `Body` (jika ada)

### Bisakah saya meneruskan email ke port selain 25 (misalnya jika ISP saya memblokir port 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Ya, sejak 5 Mei 2020 kami telah menambahkan fitur ini. Saat ini fitur ini spesifik domain, bukan spesifik alias. Jika Anda memerlukan fitur ini spesifik alias, silakan hubungi kami untuk memberi tahu kebutuhan Anda.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Perlindungan Privasi Ditingkatkan:
  </strong>
  <span>
    Jika Anda menggunakan paket berbayar (yang memiliki fitur perlindungan privasi ditingkatkan), silakan pergi ke <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a>, klik "Setup" di sebelah domain Anda, lalu klik "Settings". Jika Anda ingin mempelajari lebih lanjut tentang paket berbayar, lihat halaman <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Harga</a> kami. Jika tidak, Anda dapat melanjutkan mengikuti instruksi di bawah ini.
  </span>
</div>
Jika Anda menggunakan paket gratis, maka cukup tambahkan rekaman DNS <strong class="notranslate">TXT</strong> baru seperti yang ditunjukkan di bawah ini, tetapi ubah port dari 25 ke port pilihan Anda.

Misalnya, jika saya ingin semua email yang masuk ke `example.com` diteruskan ke port SMTP penerima alias 1337 bukan 25:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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
    Tip:
  </strong>
    Skenario paling umum untuk pengaturan penerusan port khusus adalah ketika Anda ingin meneruskan semua email yang masuk ke example.com ke port yang berbeda di example.com, selain standar SMTP port 25. Untuk mengaturnya, cukup tambahkan rekaman <strong class="notranslate">TXT</strong> catch-all berikut.
  <span>
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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

### Apakah mendukung sub-domain {#does-it-support-sub-domains}

Ya, tentu saja. Alih-alih menggunakan "@", ".", atau kosong sebagai nama/host/alias, Anda cukup menggunakan nama sub-domain sebagai nilainya.

Jika Anda ingin `foo.example.com` meneruskan email, maka masukkan `foo` sebagai nilai nama/host/alias di pengaturan DNS Anda (untuk rekaman MX dan <strong class="notranslate">TXT</strong>).

### Apakah ini meneruskan header email saya {#does-this-forward-my-emails-headers}

Ya, tentu saja.

### Apakah ini sudah diuji dengan baik {#is-this-well-tested}

Ya, sudah ada pengujian yang ditulis dengan [ava](https://github.com/avajs/ava) dan juga memiliki cakupan kode.

### Apakah Anda meneruskan pesan dan kode respons SMTP {#do-you-pass-along-smtp-response-messages-and-codes}

Ya, tentu saja. Misalnya jika Anda mengirim email ke `hello@example.com` dan terdaftar untuk diteruskan ke `user@gmail.com`, maka pesan dan kode respons SMTP dari server SMTP "gmail.com" akan dikembalikan, bukan dari server proxy di "mx1.forwardemail.net" atau "mx2.forwardemail.net".

### Bagaimana Anda mencegah spammer dan memastikan reputasi penerusan email yang baik {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Lihat bagian kami tentang [Bagaimana sistem penerusan email Anda bekerja](#how-does-your-email-forwarding-system-work), [Bagaimana Anda menangani masalah pengiriman email](#how-do-you-handle-email-delivery-issues), dan [Bagaimana Anda menangani alamat IP Anda yang diblokir](#how-do-you-handle-your-ip-addresses-becoming-blocked) di atas.

### Bagaimana Anda melakukan pencarian DNS pada nama domain {#how-do-you-perform-dns-lookups-on-domain-names}

Kami membuat proyek perangkat lunak sumber terbuka :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) dan menggunakannya untuk pencarian DNS. Server DNS default yang digunakan adalah `1.1.1.1` dan `1.0.0.1`, dan kueri DNS dilakukan melalui [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") pada lapisan aplikasi.

:tangerine: [Tangerine](https://github.com/tangerine) menggunakan [layanan DNS konsumen berfokus privasi dari CloudFlare secara default][cloudflare-dns].


## Akun dan Penagihan {#account-and-billing}

### Apakah Anda menawarkan jaminan uang kembali pada paket berbayar {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Ya! Pengembalian dana otomatis terjadi saat Anda meningkatkan, menurunkan, atau membatalkan akun Anda dalam waktu 30 hari sejak paket Anda pertama kali dimulai. Ini hanya berlaku untuk pelanggan baru.
### Jika saya mengganti paket, apakah Anda melakukan pro-rata dan mengembalikan selisihnya {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Kami tidak melakukan pro-rata maupun mengembalikan selisih saat Anda mengganti paket. Sebagai gantinya, kami mengonversi durasi yang tersisa dari tanggal kedaluwarsa paket Anda saat ini menjadi durasi relatif terdekat untuk paket baru Anda (dibulatkan ke bawah per bulan).

Perlu dicatat bahwa jika Anda meningkatkan atau menurunkan paket berbayar dalam jangka waktu 30 hari sejak pertama kali memulai paket berbayar, maka kami akan secara otomatis mengembalikan seluruh jumlah dari paket Anda yang ada.

### Bisakah saya menggunakan layanan penerusan email ini hanya sebagai server MX "fallback" atau "fallover" {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Tidak, ini tidak disarankan, karena Anda hanya dapat menggunakan satu server pertukaran mail pada satu waktu. Fallback biasanya tidak pernah dicoba ulang karena kesalahan prioritas konfigurasi dan server mail yang tidak menghormati pengecekan prioritas pertukaran MX.

### Bisakah saya menonaktifkan alias tertentu {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Penting:
  </strong>
  <span>
    Jika Anda menggunakan paket berbayar, maka Anda harus pergi ke <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Edit Alias <i class="fa fa-angle-right"></i> Hapus centang pada kotak "Aktif" <i class="fa fa-angle-right"></i> Lanjutkan.
  </span>
</div>

Ya, cukup edit catatan DNS <strong class="notranslate">TXT</strong> Anda dan beri awalan alias dengan satu, dua, atau tiga tanda seru (lihat di bawah).

Perlu dicatat bahwa Anda *harus* mempertahankan pemetaan ":" karena ini diperlukan jika Anda memutuskan untuk mematikannya nanti (dan juga digunakan untuk impor jika Anda meningkatkan ke salah satu paket berbayar kami).

**Untuk penolakan diam-diam (terlihat oleh pengirim seolah pesan berhasil dikirim, tetapi sebenarnya tidak sampai ke mana pun) (kode status `250`):** Jika Anda memberi awalan alias dengan "!" (satu tanda seru) maka akan mengembalikan kode status sukses `250` kepada pengirim yang mencoba mengirim ke alamat ini, tetapi email tersebut tidak akan sampai ke mana pun (misalnya lubang hitam atau `/dev/null`).

**Untuk penolakan lunak (kode status `421`):** Jika Anda memberi awalan alias dengan "!!" (dua tanda seru) maka akan mengembalikan kode status kesalahan lunak `421` kepada pengirim yang mencoba mengirim ke alamat ini, dan email sering dicoba ulang hingga 5 hari sebelum ditolak dan dikembalikan.

**Untuk penolakan keras (kode status `550`):** Jika Anda memberi awalan alias dengan "!!!" (tiga tanda seru) maka akan mengembalikan kode status kesalahan permanen `550` kepada pengirim yang mencoba mengirim ke alamat ini dan email akan ditolak dan dikembalikan.

Misalnya, jika saya ingin semua email yang dikirim ke `alias@example.com` berhenti diteruskan ke `user@gmail.com` dan ditolak serta dikembalikan (misalnya menggunakan tiga tanda seru):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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
    Anda juga dapat menulis ulang alamat penerima yang diteruskan menjadi "nobody@forwardemail.net", yang akan mengarahkannya ke nobody seperti contoh di bawah.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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
    Tip:
  </strong>
  <span>
    Jika Anda menginginkan keamanan yang lebih tinggi, maka Anda juga dapat menghapus bagian ":user@gmail.com" (atau ":nobody@forwardemail.net"), sehingga hanya menyisakan "!!!alias" seperti pada contoh di bawah ini.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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

### Bisakah saya meneruskan email ke beberapa penerima {#can-i-forward-emails-to-multiple-recipients}

Ya, tentu saja. Cukup tentukan beberapa penerima dalam <strong class="notranslate">TXT</strong> record Anda.

Misalnya, jika saya ingin email yang dikirim ke `hello@example.com` diteruskan ke `user+a@gmail.com` dan `user+b@gmail.com`, maka <strong class="notranslate">TXT</strong> record saya akan terlihat seperti ini:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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

Atau, Anda bisa menentukan mereka dalam dua baris terpisah, seperti ini:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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

### Bisakah saya memiliki beberapa penerima global catch-all {#can-i-have-multiple-global-catch-all-recipients}

Ya, Anda bisa. Cukup tentukan beberapa penerima global catch-all dalam <strong class="notranslate">TXT</strong> record Anda.

Misalnya, jika saya ingin setiap email yang dikirim ke `*@example.com` (tanda bintang berarti wildcard alias catch-all) diteruskan ke `user+a@gmail.com` dan `user+b@gmail.com`, maka <strong class="notranslate">TXT</strong> record saya akan terlihat seperti ini:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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

Atau, Anda bisa menentukan mereka dalam dua baris terpisah, seperti ini:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nama/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipe</th>
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

Ya, batas default adalah 10. Ini TIDAK berarti Anda hanya dapat memiliki 10 alias pada nama domain Anda. Anda dapat memiliki sebanyak mungkin alias yang Anda inginkan (jumlah tak terbatas). Ini berarti Anda hanya dapat meneruskan satu alias ke 10 alamat email unik. Anda bisa memiliki `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (dari 1-10) – dan email apa pun ke `hello@example.com` akan diteruskan ke `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (dari 1-10).

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    Membutuhkan lebih dari 10 penerima per alias? Kirimkan email kepada kami dan kami dengan senang hati akan meningkatkan batas akun Anda.
  </span>
</div>

### Bisakah saya meneruskan email secara rekursif {#can-i-recursively-forward-emails}

Ya, Anda bisa, namun Anda tetap harus mematuhi batas maksimum. Jika Anda memiliki `hello:linus@example.com` dan `linus:user@gmail.com`, maka email ke `hello@example.com` akan diteruskan ke `linus@example.com` dan `user@gmail.com`. Perlu dicatat bahwa akan muncul kesalahan jika Anda mencoba meneruskan email secara rekursif melebihi batas maksimum.

### Apakah orang bisa membatalkan pendaftaran atau mendaftarkan penerusan email saya tanpa izin saya {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Kami menggunakan verifikasi MX dan <strong class="notranslate">TXT</strong> record, oleh karena itu jika Anda menambahkan MX dan <strong class="notranslate">TXT</strong> record layanan ini, maka Anda terdaftar. Jika Anda menghapusnya, maka Anda tidak terdaftar. Anda memiliki kepemilikan domain dan pengelolaan DNS Anda, jadi jika seseorang memiliki akses ke itu maka itu adalah masalah.

### Bagaimana ini bisa gratis {#how-is-it-free}

Forward Email menawarkan tingkat gratis melalui kombinasi pengembangan open-source, infrastruktur yang efisien, dan paket berbayar opsional yang mendukung layanan ini.

Tingkat gratis kami didukung oleh:

1. **Pengembangan Open Source**: Basis kode kami bersifat open source, memungkinkan kontribusi komunitas dan operasi yang transparan.

2. **Infrastruktur Efisien**: Kami telah mengoptimalkan sistem kami untuk menangani penerusan email dengan sumber daya minimal.

3. **Paket Premium Berbayar**: Pengguna yang membutuhkan fitur tambahan seperti pengiriman SMTP, penerimaan IMAP, atau opsi privasi yang ditingkatkan berlangganan paket berbayar kami.

4. **Batas Penggunaan yang Wajar**: Tingkat gratis memiliki kebijakan penggunaan yang adil untuk mencegah penyalahgunaan.

> \[!NOTE]
> Kami berkomitmen untuk menjaga penerusan email dasar tetap gratis sambil menawarkan fitur premium untuk pengguna dengan kebutuhan lebih lanjut.

> \[!TIP]
> Jika Anda merasa layanan kami berharga, pertimbangkan untuk meningkatkan ke paket berbayar guna mendukung pengembangan dan pemeliharaan yang berkelanjutan.

### Berapa batas ukuran email maksimum {#what-is-the-max-email-size-limit}

Kami menggunakan batas ukuran default 50MB, yang mencakup konten, header, dan lampiran. Perlu dicatat bahwa layanan seperti Gmail dan Outlook hanya mengizinkan batas ukuran 25MB, dan jika Anda melebihi batas saat mengirim ke alamat di penyedia tersebut Anda akan menerima pesan kesalahan.

Kesalahan dengan kode respons yang sesuai akan dikembalikan jika batas ukuran file terlampaui.

### Apakah Anda menyimpan log email {#do-you-store-logs-of-emails}

Tidak, kami tidak menulis ke disk atau menyimpan log – dengan [kecualian kesalahan](#do-you-store-error-logs) dan [SMTP keluar](#do-you-support-sending-email-with-smtp) (lihat [Kebijakan Privasi](/privacy)).

Semua dilakukan di memori dan [kode sumber kami ada di GitHub](https://github.com/forwardemail).

### Apakah Anda menyimpan log kesalahan {#do-you-store-error-logs}

**Ya. Anda dapat mengakses log kesalahan di bawah [Akun Saya → Log](/my-account/logs) atau [Akun Saya → Domain](/my-account/domains).**

Sejak Februari 2023, kami menyimpan log kesalahan untuk kode respons SMTP `4xx` dan `5xx` selama 7 hari – yang berisi kesalahan SMTP, amplop, dan header email (kami **tidak** menyimpan isi email maupun lampiran).
Log kesalahan memungkinkan Anda memeriksa email penting yang hilang dan mengurangi false positive spam untuk [domain Anda](/my-account/domains). Mereka juga merupakan sumber yang bagus untuk debugging masalah dengan [webhook email](#do-you-support-webhooks) (karena log kesalahan berisi respons endpoint webhook).

Log kesalahan untuk [pembatasan laju](#do-you-have-rate-limiting) dan [greylisting](#do-you-have-a-greylist) tidak dapat diakses karena koneksi berakhir lebih awal (misalnya sebelum perintah `RCPT TO` dan `MAIL FROM` dapat dikirimkan).

Lihat [Kebijakan Privasi](/privacy) kami untuk informasi lebih lanjut.

### Apakah Anda membaca email saya {#do-you-read-my-emails}

Tidak, sama sekali tidak. Lihat [Kebijakan Privasi](/privacy) kami.

Banyak layanan penerusan email lain menyimpan dan berpotensi membaca email Anda. Tidak ada alasan mengapa email yang diteruskan perlu disimpan ke penyimpanan disk – oleh karena itu kami merancang solusi open-source pertama yang melakukannya sepenuhnya di memori.

Kami percaya Anda berhak atas privasi dan kami sangat menghormatinya. Kode yang diterapkan ke server adalah [perangkat lunak open-source di GitHub](https://github.com/forwardemail) untuk transparansi dan membangun kepercayaan.

### Bisakah saya "mengirim email sebagai" di Gmail dengan ini {#can-i-send-mail-as-in-gmail-with-this}

Ya! Sejak 2 Oktober 2018 kami telah menambahkan fitur ini. Lihat [Cara Mengirim Email Sebagai menggunakan Gmail](#how-to-send-mail-as-using-gmail) di atas!

Anda juga harus mengatur catatan SPF untuk Gmail di konfigurasi DNS Anda pada catatan <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Penting:
  </strong>
  <span>
    Jika Anda menggunakan Gmail (misalnya Kirim Email Sebagai) atau G Suite, maka Anda perlu menambahkan <code>include:_spf.google.com</code> ke catatan SPF <strong class="notranslate">TXT</strong> Anda, misalnya:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### Bisakah saya "mengirim email sebagai" di Outlook dengan ini {#can-i-send-mail-as-in-outlook-with-this}

Ya! Sejak 2 Oktober 2018 kami telah menambahkan fitur ini. Cukup lihat dua tautan dari Microsoft di bawah ini:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Anda juga harus mengatur catatan SPF untuk Outlook di konfigurasi DNS Anda pada catatan <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Penting:
  </strong>
  <span>
    Jika Anda menggunakan Microsoft Outlook atau Live.com, Anda perlu menambahkan <code>include:spf.protection.outlook.com</code> ke catatan SPF <strong class="notranslate">TXT</strong> Anda, misalnya:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### Bisakah saya "mengirim email sebagai" di Apple Mail dan iCloud Mail dengan ini {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Jika Anda adalah pelanggan iCloud+, Anda dapat menggunakan domain kustom. [Layanan kami juga kompatibel dengan Apple Mail](#apple-mail).

Silakan lihat <https://support.apple.com/en-us/102540> untuk informasi lebih lanjut.

### Bisakah saya meneruskan email tanpa batas dengan ini {#can-i-forward-unlimited-emails-with-this}

Ya, namun pengirim yang "relatif tidak dikenal" dibatasi hingga 100 koneksi per jam per hostname atau IP. Lihat bagian tentang [Pembatasan Laju](#do-you-have-rate-limiting) dan [Greylisting](#do-you-have-a-greylist) di atas.

Dengan "relatif tidak dikenal", kami maksudkan pengirim yang tidak muncul dalam [daftar putih](#do-you-have-an-allowlist).

Jika batas ini terlampaui, kami mengirim kode respons 421 yang memberitahu server email pengirim untuk mencoba lagi nanti.

### Apakah Anda menawarkan domain tanpa batas dengan satu harga {#do-you-offer-unlimited-domains-for-one-price}

Ya. Terlepas dari paket mana yang Anda gunakan, Anda hanya akan membayar satu tarif bulanan – yang mencakup semua domain Anda.
### Metode pembayaran apa yang Anda terima {#which-payment-methods-do-you-accept}

Forward Email menerima metode pembayaran satu kali atau bulanan/triwulanan/tahunan berikut:

1. **Kartu Kredit/Debit/Transfer Bank**: Visa, Mastercard, American Express, Discover, JCB, Diners Club, dll.
2. **PayPal**: Hubungkan akun PayPal Anda untuk pembayaran yang mudah
3. **Cryptocurrency**: Kami menerima pembayaran melalui pembayaran stablecoin Stripe di jaringan Ethereum, Polygon, dan Solana

> \[!NOTE]
> Kami menyimpan informasi pembayaran terbatas di server kami, yang hanya mencakup pengenal pembayaran dan referensi ke [Stripe](https://stripe.com/global) dan [PayPal](https://www.paypal.com) transaksi, pelanggan, langganan, dan ID pembayaran.

> \[!TIP]
> Untuk privasi maksimal, pertimbangkan menggunakan pembayaran cryptocurrency.

Semua pembayaran diproses dengan aman melalui Stripe atau PayPal. Detail pembayaran Anda tidak pernah disimpan di server kami.


## Sumber Daya Tambahan {#additional-resources}

> \[!TIP]
> Artikel kami di bawah ini secara rutin diperbarui dengan panduan baru, tips, dan informasi teknis. Kunjungi kembali sering untuk konten terbaru.

* [Studi Kasus & Dokumentasi Pengembang](/blog/docs)
* [Sumber Daya](/resources)
* [Panduan](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
