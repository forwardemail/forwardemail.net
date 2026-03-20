# ISS tarafından engellenen 25 Numaralı Port için Çözüm {#port-25-blocked-by-isp-workaround}


## İçindekiler {#table-of-contents}

* [ISS'nin gelen SMTP trafiğini 25 numaralı portta engellemesini nasıl aşabilirim](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [ISS'nin giden SMTP trafiğini 25 numaralı portta engellemesini nasıl aşabilirim](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [ISS'nin portları engelleyip engellemediğini nasıl kontrol edebilirim](#how-can-i-check-if-my-isp-blocks-ports)


## ISS'nin gelen SMTP trafiğini 25 numaralı portta engellemesini nasıl aşabilirim {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Eğer posta sunucunuzun IP adresinde 25 numaralı port açık değilse, bu rehber sizin için.

Örneğin, evde özel bir posta sunucusu çalıştırıyorsunuz ve İnternet Servis Sağlayıcınız ("ISS") giden 25 numaralı portu engellemiş.

Giden 25 numaralı port trafiğiniz olmadığı için, muhtemelen bu engel nedeniyle gelen 25 numaralı port trafiğiniz de olmayacaktır.

Hizmetimizi e-posta iletmek için kullanıyorsanız, [bu sorunu SSS cevabımız aracılığıyla aşabilirsiniz](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).


## ISS'nin giden SMTP trafiğini 25 numaralı portta engellemesini nasıl aşabilirim {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Eğer ISS'niz giden 25 numaralı portu engelliyorsa, alternatif bir çözüm bulmanız veya onlarla iletişime geçmeniz gerekecektir.


## ISS'nin portları engelleyip engellemediğini nasıl kontrol edebilirim {#how-can-i-check-if-my-isp-blocks-ports}

Giden 25 numaralı port bağlantınızın engellenip engellenmediğini görmek için komut satırından veya terminalden `telnet smtp.forwardemail.net 25` komutunu çalıştırabilirsiniz.
