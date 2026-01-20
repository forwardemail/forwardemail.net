# Kebijakan Privasi {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" class="rounded-lg" />

## Daftar Isi {#table-of-contents}

* [Penafian](#disclaimer)
* [Informasi Tidak Dikumpulkan](#information-not-collected)
* [Informasi yang Dikumpulkan](#information-collected)
* [Informasi yang Dibagikan](#information-shared)
* [Penghapusan Informasi](#information-removal)
* [Pengungkapan Tambahan](#additional-disclosures)

## Penafian {#disclaimer}

Harap tunduk pada [Ketentuan](/terms) kami karena berlaku di seluruh situs.

## Informasi Tidak Dikumpulkan {#information-not-collected}

**Kecuali [kesalahan](/faq#do-you-store-error-logs), [email SMTP keluar](/faq#do-you-support-sending-email-with-smtp), dan/atau ketika spam atau aktivitas berbahaya terdeteksi (misalnya untuk pembatasan kecepatan):**

* Kami tidak menyimpan email yang diteruskan ke penyimpanan disk maupun basis data.
* Kami tidak menyimpan metadata apa pun tentang email ke penyimpanan disk maupun basis data.
* Kami tidak menyimpan log atau alamat IP apa pun ke penyimpanan disk maupun basis data.

## Informasi yang Dikumpulkan {#information-collected}

Demi transparansi, Anda dapat <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">melihat kode sumber kami kapan saja untuk melihat bagaimana informasi di bawah ini dikumpulkan dan digunakan:

**Hanya untuk fungsionalitas dan peningkatan layanan kami, kami mengumpulkan dan menyimpan informasi berikut dengan aman:**

* Kami menyimpan email dan informasi kalender di [basis data SQLite terenkripsi](/blog/docs/best-quantum-safe-encrypted-email-service) Anda hanya untuk akses IMAP/POP3/CalDAV/CardDAV dan fungsi kotak surat Anda.
* Harap diperhatikan bahwa jika Anda hanya menggunakan layanan penerusan email kami, maka tidak ada email yang disimpan ke disk atau penyimpanan basis data seperti yang dijelaskan di [Informasi Tidak Dikumpulkan](#information-not-collected).
* Layanan penerusan email kami hanya beroperasi di dalam memori (tidak ada penulisan ke penyimpanan disk atau basis data).
* Penyimpanan IMAP/POP3/CalDAV/CardDAV dienkripsi saat tidak aktif, dienkripsi saat transit, dan disimpan di disk terenkripsi LUKS.
* Cadangan untuk penyimpanan IMAP/POP3/CalDAV/CardDAV Anda dienkripsi saat tidak aktif, dienkripsi saat transit, dan disimpan di [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).
* Kami menyimpan cookie dalam sesi untuk lalu lintas situs web Anda.
* Kami menyimpan alamat email yang Anda berikan kepada kami. * Kami menyimpan nama domain, alias, dan konfigurasi yang Anda berikan kepada kami.
* Kami menyimpan kode respons SMTP `4xx` dan `5xx` [log kesalahan](/faq#do-you-store-error-logs) selama 7 hari.
* Kami menyimpan [email SMTP keluar](/faq#do-you-support-sending-email-with-smtp) selama ~30 hari.
* Durasi ini bervariasi berdasarkan header "Tanggal"; karena kami mengizinkan email untuk dikirim di masa mendatang jika header "Tanggal" di masa mendatang masih ada.
* **Perlu diketahui bahwa setelah email berhasil terkirim atau mengalami kesalahan permanen, kami akan menyunting dan menghapus isi pesan.**
* Jika Anda ingin mengonfigurasi isi pesan email SMTP keluar Anda agar disimpan lebih lama dari default 0 hari (setelah berhasil terkirim atau terjadi kesalahan permanen), buka Pengaturan Lanjutan untuk domain Anda dan masukkan nilai antara `0` dan `30`. * Beberapa pengguna senang menggunakan fitur pratinjau [Akun Saya > Email](/my-account/emails) untuk melihat bagaimana email mereka ditampilkan, oleh karena itu kami mendukung periode penyimpanan yang dapat dikonfigurasi.
* Perlu diketahui bahwa kami juga mendukung __PROTECTED_LINK_30__0.
* Informasi tambahan apa pun yang Anda berikan kepada kami secara sukarela, seperti komentar atau pertanyaan yang dikirimkan kepada kami melalui email atau di halaman <a href="/help">bantuan</a> kami.

## Informasi Dibagikan {#information-shared}

Kami tidak membagikan informasi Anda kepada pihak ketiga mana pun. Kami juga tidak menggunakan layanan perangkat lunak analitik maupun telemetri pihak ketiga.

Kami mungkin perlu dan akan mematuhi permintaan hukum yang diperintahkan pengadilan (tetapi perlu diingat [kami tidak mengumpulkan informasi yang disebutkan di atas pada bagian "Informasi Tidak Dikumpulkan"](#information-not-collected), jadi kami tidak akan dapat menyediakannya sejak awal).

## Penghapusan Informasi {#information-removal}

Jika sewaktu-waktu Anda ingin menghapus informasi yang telah Anda berikan kepada kami, buka <a href="/my-account/security">Akun Saya > Keamanan</a> dan klik "Hapus Akun".

Karena pencegahan dan mitigasi penyalahgunaan, akun Anda mungkin memerlukan peninjauan penghapusan manual oleh admin kami jika Anda menghapusnya dalam waktu 5 hari sejak pembayaran pertama Anda.

Proses ini biasanya memakan waktu kurang dari 24 jam dan diterapkan karena pengguna melakukan spam pada layanan kami, lalu dengan cepat menghapus akun mereka – yang mencegah kami memblokir sidik jari metode pembayaran mereka di Stripe.

## Pengungkapan Tambahan {#additional-disclosures}

Situs ini dilindungi oleh Cloudflare dan [Kebijakan Privasi](https://www.cloudflare.com/privacypolicy/) dan [Ketentuan Layanan](https://www.cloudflare.com/website-terms/) berlaku.