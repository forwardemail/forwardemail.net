# Port 25 diblokir oleh solusi ISP {#port-25-blocked-by-isp-workaround}

## Daftar Isi {#table-of-contents}

* [Cara mengatasi pemblokiran SMTP masuk oleh ISP di port 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Cara mengatasi pemblokiran SMTP keluar oleh ISP pada port 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Bagaimana cara memeriksa apakah ISP saya memblokir port?](#how-can-i-check-if-my-isp-blocks-ports)

## Cara mengatasi pemblokiran SMTP masuk oleh ISP di port 25 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Jika Anda tidak memiliki port 25 terbuka pada alamat IP server email Anda, maka panduan ini cocok untuk Anda.

Misalnya, Anda menjalankan server email khusus di rumah, dan Penyedia Layanan Internet ("ISP") Anda telah memblokir port keluar 25.

Karena Anda tidak dapat memiliki lalu lintas keluar pada port 25, maka kemungkinan besar Anda juga tidak akan memiliki lalu lintas masuk pada port 25 karena pemblokiran ini.

Dengan asumsi Anda menggunakan layanan kami untuk meneruskan email, [Anda dapat mengatasi masalah ini melalui jawaban FAQ kami di sini](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).

## Cara mengatasi pemblokiran SMTP keluar oleh ISP di port 25 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Jika ISP Anda memblokir port keluar 25, maka Anda harus mencari solusi alternatif atau menghubungi mereka.

## Bagaimana cara memeriksa apakah ISP saya memblokir port {#how-can-i-check-if-my-isp-blocks-ports}

Anda dapat menjalankan `telnet smtp.forwardemail.net 25` dari baris perintah atau terminal untuk melihat apakah koneksi keluar port 25 Anda diblokir.