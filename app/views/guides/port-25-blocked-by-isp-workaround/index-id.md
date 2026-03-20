# Port 25 diblokir oleh ISP solusi sementara {#port-25-blocked-by-isp-workaround}


## Daftar Isi {#table-of-contents}

* [Cara mengatasi ISP yang memblokir SMTP masuk pada port 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Cara mengatasi ISP yang memblokir SMTP keluar pada port 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Bagaimana cara memeriksa apakah ISP saya memblokir port](#how-can-i-check-if-my-isp-blocks-ports)


## Cara mengatasi ISP yang memblokir SMTP masuk pada port 25 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Jika Anda tidak memiliki port 25 terbuka pada alamat IP server email Anda, maka panduan ini untuk Anda.

Misalnya, Anda menjalankan server email kustom di rumah, dan Penyedia Layanan Internet ("ISP") Anda telah memblokir port 25 keluar.

Karena Anda tidak dapat memiliki lalu lintas keluar pada port 25, maka kemungkinan besar Anda juga tidak akan memiliki lalu lintas masuk pada port 25 karena pemblokiran ini.

Dengan asumsi Anda menggunakan layanan kami untuk meneruskan email, [Anda dapat mengatasi masalah ini melalui jawaban FAQ kami di sini](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).


## Cara mengatasi ISP yang memblokir SMTP keluar pada port 25 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Jika ISP Anda memblokir port 25 keluar, maka Anda harus mencari solusi alternatif atau menghubungi mereka.


## Bagaimana cara memeriksa apakah ISP saya memblokir port {#how-can-i-check-if-my-isp-blocks-ports}

Anda dapat menjalankan `telnet smtp.forwardemail.net 25` dari command line atau terminal untuk melihat apakah koneksi port 25 keluar Anda diblokir.
