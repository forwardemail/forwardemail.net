# 25 numaralı bağlantı noktası ISP geçici çözümü tarafından engellendi {#port-25-blocked-by-isp-workaround}

## İçindekiler {#table-of-contents}

* [ISP'nin 25 numaralı portta gelen SMTP'yi engellemesi sorununa nasıl çözüm bulunur?](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [ISP'nin 25 numaralı bağlantı noktasında giden SMTP'yi engellemesi sorununa nasıl çözüm bulunur?](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [İnternet servis sağlayıcımın portları engelleyip engellemediğini nasıl kontrol edebilirim?](#how-can-i-check-if-my-isp-blocks-ports)

## 25 numaralı bağlantı noktasında gelen SMTP'yi engelleyen ISP'nin geçici çözümü {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Eğer e-posta sunucunuzun IP adresinde 25 numaralı port açık değilse, bu rehber tam size göre.

Örneğin, evinizde özel bir e-posta sunucusu çalıştırıyorsunuz ve İnternet Servis Sağlayıcınız ("İSS") 25 numaralı giden bağlantı noktasını engellemiş.

25 numaralı portta giden trafiğiniz olamayacağına göre, bu engelleme nedeniyle büyük ihtimalle 25 numaralı portta gelen trafiğiniz de olmayacaktır.

E-postaları iletmek için hizmetimizi kullandığınızı varsayarsak, [Bu sorunu, buradaki SSS yanıtımız aracılığıyla çözebilirsiniz](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).

## 25 numaralı bağlantı noktasında giden SMTP'yi engelleyen ISP'nin geçici çözümü {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Eğer İSS'niz 25 numaralı giden portu engelliyorsa, alternatif bir çözüm bulmanız veya onlarla iletişime geçmeniz gerekecektir.

## İnternet servis sağlayıcımın {#how-can-i-check-if-my-isp-blocks-ports}} portlarını engelleyip engellemediğini nasıl kontrol edebilirim?

Giden 25 numaralı bağlantınızın engellenip engellenmediğini görmek için komut satırından veya terminalden `telnet smtp.forwardemail.net 25` komutunu çalıştırabilirsiniz.