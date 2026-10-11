# Panduan Webmail Forward Email {#forward-email-webmail-guide}

<p class="lead mt-3">
  <strong>TL;DR:</strong> <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">Webmail</a> adalah tempat Anda membaca dan mengirim email. <a href="/my-account/domains">Dasbor web</a> adalah tempat Anda menyiapkan domain, alias, dan kata sandi. Anda masuk ke webmail dengan alamat alias dan kata sandi yang dibuat di dasbor. Webmail gratis dan <a href="/faq#do-you-offer-a-webmail-client">open source</a>, dan aplikasi yang sama berjalan di browser, desktop, ponsel, dan terminal.
</p>


## Daftar Isi {#table-of-contents}

* [Tempat mendapatkan webmail](#where-to-get-webmail)
* [Webmail dan dasbor web](#webmail-and-the-web-dashboard)
* [Masuk](#signing-in)
  * [Buat kata sandi alias](#generate-an-alias-password)
  * [Masuk ke webmail](#sign-in-to-webmail)
* [Menggunakan lebih dari satu akun](#using-more-than-one-account)
  * [Kirim sebagai akun lain yang sudah masuk](#send-as-another-signed-in-account)
* [Kirim dari alamat apa pun di domain Anda](#send-from-any-address-on-your-domain)
  * [Langkah 1: Buat kata sandi catch-all di dasbor](#step-1-generate-a-catch-all-password-in-the-dashboard)
  * [Langkah 2: Simpan di webmail](#step-2-save-it-in-webmail)
  * [Langkah 3: Pilih alamat saat menulis email](#step-3-pick-the-address-when-you-compose)
  * [Yang perlu diketahui tentang pengiriman catch-all](#what-to-know-about-catch-all-sending)
* [Sekilas pengaturan webmail](#webmail-settings-at-a-glance)
* [Privasi dan App Lock](#privacy-and-app-lock)
* [Pemecahan masalah](#troubleshooting)


## Tempat mendapatkan webmail {#where-to-get-webmail}

| Platform                        | Tempat                                                                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Browser                         | <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a> (tanpa instalasi)  |
| Desktop (macOS, Windows, Linux) | <a href="/download">Halaman unduhan</a> kami                                                                                   |
| Ponsel (Android, iOS)           | <a href="/download">Halaman unduhan</a> kami                                                                                   |
| Terminal                        | Perintah `forwardemail`. Lihat [Apakah Anda punya aplikasi terminal](/faq#do-you-have-a-terminal-app)                          |

Semuanya dibangun dari proyek open source yang sama, jadi semua isi panduan ini berlaku untuk masing-masing. Pengaturan dan kata sandi yang disimpan tersimpan di setiap perangkat, jadi siapkan di setiap perangkat yang Anda gunakan.


## Webmail dan dasbor web {#webmail-and-the-web-dashboard}

Forward Email memiliki dua tempat terpisah untuk masuk, dan keduanya menggunakan kredensial yang berbeda:

|                                 | Dasbor web (forwardemail.net)                                                                                 | Webmail (mail.forwardemail.net dan aplikasinya)                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Masuk dengan**                | Email dan kata sandi akun Forward Email Anda (ditambah 2FA atau passkey)                                      | Alamat alias (seperti `you@example.com`) dan kata sandi yang dibuat untuknya           |
| **Digunakan untuk**             | Menambahkan domain, DNS, alias, penagihan, anggota tim, membuat kata sandi, Pengaturan Lanjutan               | Membaca dan mengirim email, folder, label, pencarian, kalender, kontak, filter         |
| **Kata sandi yang dibuat di sini** | Kata sandi alias dan kata sandi catch-all                                                                  | Tidak ada. Webmail menggunakan kata sandi yang Anda buat di dasbor                     |

Penyiapan yang umum terlihat seperti ini:

1. Di dasbor, tambahkan domain Anda dan siapkan DNS.
2. Buat alias dengan penyimpanan IMAP diaktifkan (misalnya `you@example.com`).
3. Buat kata sandi untuk alias tersebut.
4. Masuk ke webmail dengan alias dan kata sandi tersebut.

Untuk mengirim email, domain Anda juga perlu mengaktifkan SMTP keluar di <a href="/my-account/domains">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Pengaturan Lanjutan <i class="fa fa-angle-right"></i> Konfigurasi SMTP Keluar, sama seperti untuk klien email lainnya.


## Masuk {#signing-in}

### Buat kata sandi alias {#generate-an-alias-password}

1. Buka <a href="/my-account/domains">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias.
2. Di samping alias, klik **Hasilkan Kata Sandi**.
3. Salin kata sandinya. Kata sandi hanya ditampilkan sekali.

Ini adalah kata sandi yang sama yang akan Anda gunakan untuk IMAP, POP3, SMTP, CalDAV, dan CardDAV. Kata sandi ini tidak bisa digunakan untuk masuk ke dasbor web.

### Masuk ke webmail {#sign-in-to-webmail}

Buka webmail dan masukkan alamat alias lengkap serta kata sandi yang dibuat. Jika Anda hanya ingin melihat-lihat dulu, coba demo dari layar masuk.


## Menggunakan lebih dari satu akun {#using-more-than-one-account}

Anda dapat masuk ke beberapa alias sekaligus, bahkan di domain yang berbeda. Beralih di antara akun dari menu akun, dan kelola akun di **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Your accounts**. Akun disimpan di perangkat tempat Anda menambahkannya dan tidak disinkronkan.

### Kirim sebagai akun lain yang sudah masuk {#send-as-another-signed-in-account}

Saat Anda menulis email, menu **From** mencantumkan setiap akun yang sudah masuk di perangkat ini. Pilih salah satu untuk mengirim sebagai alamat tersebut. Pesan dikirim dengan kata sandi akun itu sendiri, dan salinannya masuk ke folder Terkirim akun tersebut.


## Kirim dari alamat apa pun di domain Anda {#send-from-any-address-on-your-domain}

Jika Anda memiliki domain, Anda dapat mengirim dari alamat apa pun di domain tersebut, seperti `billing@example.com` atau `no-reply@example.com`, tanpa membuat alias dan masuk untuk masing-masing alamat. Anda melakukannya dengan **kata sandi catch-all** untuk domain tersebut.

Anda **tidak** masuk ke webmail sebagai akun wildcard atau catch-all, dan tidak ada fitur yang perlu diaktifkan. Anda menyimpan kata sandi catch-all sekali di pengaturan webmail, lalu menu From memungkinkan Anda mengetik alamat apa pun di domain tersebut.

### Langkah 1: Buat kata sandi catch-all di dasbor {#step-1-generate-a-catch-all-password-in-the-dashboard}

1. Buka <a href="/my-account/domains">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> dan pilih domain Anda.
2. Buka **Pengaturan Lanjutan** dan temukan **Kata Sandi Catch-all**.
3. Klik **Hasilkan Kata Sandi**. Biarkan kolom kosong untuk mendapatkan kata sandi acak yang kuat, dan tambahkan deskripsi jika Anda mau (misalnya "Webmail di laptop saya").
4. Salin kata sandinya. Kata sandi hanya ditampilkan sekali.

Anda harus menjadi admin domain untuk melihat bagian ini. Gunakan **Kelola Kata Sandi** di tempat yang sama untuk melihat atau menghapus kata sandi catch-all nanti. Menghapus salah satunya membuatnya berhenti berfungsi di semua tempat kata sandi itu disimpan.

### Langkah 2: Simpan di webmail {#step-2-save-it-in-webmail}

1. Di webmail, buka **Settings <i class="fa fa-angle-right"></i> General**.
2. Temukan kartu bernama **Send from any address**, tepat di bawah **Your accounts**.
3. Klik **Add catch-all password**.
4. Masukkan domain (misalnya `example.com`) dan tempel kata sandi catch-all.
5. Klik **Save**. Anda akan melihat "You can now send from any address @example.com".

Anda dapat menyimpan kata sandi untuk domain sebanyak yang Anda mau. Untuk menghapus salah satunya, klik ikon tempat sampah di sampingnya.

### Langkah 3: Pilih alamat saat menulis email {#step-3-pick-the-address-when-you-compose}

1. Mulai pesan baru.
2. Buka menu **From**. Di bawah akun yang sudah masuk, ada entri untuk setiap domain yang disimpan: **Other address @example.com…**
3. Pilih entri tersebut. Baris From berubah menjadi kotak teks dengan `@example.com` di belakangnya.
4. Ketik bagian sebelum @ (misalnya `billing`) lalu kirim.

Draf menyimpan alamat yang Anda ketik, jadi draf yang disimpan akan dibuka kembali dengan alamat From yang sama.

### Yang perlu diketahui tentang pengiriman catch-all {#what-to-know-about-catch-all-sending}

* **Hanya bisa mengirim.** Kata sandi catch-all hanya berfungsi untuk mengirim. Kata sandi ini tidak bisa membuka kotak surat, jadi Anda tidak bisa membaca email untuk `billing@example.com` dengannya. Untuk membaca balasan, buat alias (atau alias catch-all yang meneruskan ke Anda) untuk alamat tersebut.
* **Salinan terkirim masuk ke akun yang Anda gunakan.** Pesan yang dikirim sebagai `billing@example.com` disimpan di folder Terkirim milik akun tempat Anda menulisnya.
* **Berfungsi dari setiap akun di perangkat.** Kata sandi yang disimpan tidak terikat pada satu akun yang sudah masuk. Akun mana pun di perangkat itu dapat menggunakannya.
* **Tetap di perangkat ini.** Kata sandi hanya disimpan di perangkat tempat Anda menyimpannya. Kata sandi tidak disinkronkan, dan pemasangan perangkat dengan QR tidak menyalinnya. Tambahkan lagi di setiap perangkat.
* **App Lock melindunginya.** Jika App Lock aktif, kata sandi dienkripsi bersama data lokal Anda lainnya, dan entri **Other address** disembunyikan selama aplikasi terkunci.
* **Pengiriman terjadwal tidak tersedia** untuk alamat yang dikirim dengan kata sandi catch-all, karena kata sandi tersebut tidak bisa membaca kembali atau membatalkan pesan terjadwal. Kirim langsung, atau kirim sebagai akun yang sudah masuk.
* **Kata sandi yang salah tidak akan membuat Anda keluar.** Jika kata sandi catch-all salah atau sudah dihapus di dasbor, pengiriman gagal dengan pesan galat, dan Anda tetap masuk.


## Sekilas pengaturan webmail {#webmail-settings-at-a-glance}

| Bagian                 | Cakupannya                                                                                         |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| **General**            | Akun Anda, kirim dari alamat apa pun (kata sandi catch-all), notifikasi, penyimpanan               |
| **Appearance**         | Tema, tata letak, kerapatan, bawaan penulis pesan, tanda tangan, font, tautan eksternal            |
| **Privacy & Security** | App Lock, enkripsi PGP, opsi privasi, pelaporan spam                                               |
| **Folders & Labels**   | Folder khusus, folder Anda, label                                                                  |
| **Filters**            | Filter email untuk alias yang sudah masuk                                                          |
| **Calendar**           | Awal minggu dan tugas                                                                              |
| **Search**             | Pengindeksan pencarian, kesehatan indeks, pencarian tersimpan, operator pencarian                  |
| **Advanced**           | Penyimpanan kotak surat, cache lokal, dan mengatur ulang aplikasi                                  |
| **Keyboard Shortcuts** | Semua pintasan                                                                                     |
| **About & Help**       | Versi, unduhan aplikasi desktop, masukan, dan tautan                                               |

Hal-hal yang menjadi milik domain atau alias itu sendiri, seperti DNS, penerima penerusan, batas penyimpanan, penjawab liburan, kata sandi catch-all, dan pemindaian spam, diatur di <a href="/my-account/domains">dasbor web</a>.


## Privasi dan App Lock {#privacy-and-app-lock}

Webmail menyimpan salinan lokal email Anda agar cepat dan bisa bekerja secara offline. **App Lock** (di **Settings <i class="fa fa-angle-right"></i> Privacy & Security**) mengenkripsi data lokal tersebut, pengaturan Anda, dan kata sandi yang Anda simpan di perangkat, serta dibuka dengan passkey atau PIN. Email dan pembaruan langsung berjalan langsung antara aplikasi dan Forward Email, tanpa layanan iklan atau pelacakan di antaranya.


## Pemecahan masalah {#troubleshooting}

**"Can't send as <name@example.com>: sign in to that account on this device again, or save its domain's catch-all password in Settings."**

Webmail tidak memiliki kata sandi untuk alamat tersebut di perangkat ini. Masuklah ke alias tersebut, atau simpan kata sandi catch-all domain di **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Send from any address**. Jika aplikasi terkunci, buka kuncinya terlebih dahulu.

**Entri "Other address" tidak ada di menu From.**

Pastikan Anda sudah menyimpan kata sandi catch-all di perangkat ini, dan App Lock sudah dibuka.

**Pengiriman dari alamat catch-all gagal dengan galat autentikasi.**

Kata sandi catch-all mungkin sudah dihapus atau salah ketik. Buat yang baru di dasbor, lalu hapus yang lama di webmail dan tambahkan yang baru.

**Kata sandi dasbor saya tidak berfungsi di webmail.**

Webmail memerlukan kata sandi alias, bukan kata sandi dasbor Anda. Lihat [Buat kata sandi alias](#generate-an-alias-password).

Masih buntu? Lihat <a href="/faq">FAQ</a> kami atau <a href="/help">hubungi kami</a>.
