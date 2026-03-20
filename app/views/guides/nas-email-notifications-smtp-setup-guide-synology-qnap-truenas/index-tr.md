# Forward Email ile NAS E-posta Kurulumu Tam Rehberi {#complete-guide-to-nas-email-setup-with-forward-email}

NAS cihazınızda e-posta bildirimlerini ayarlamak zor olmamalı. İster Synology, QNAP, ister Raspberry Pi kurulumunuz olsun, bu rehber cihazınızın Forward Email ile iletişim kurmasını sağlayacak ve bir şeyler ters gittiğinde gerçekten haberdar olmanızı sağlayacak.

Çoğu NAS cihazı sürücü arızaları, sıcaklık uyarıları, yedekleme tamamlanması ve güvenlik olayları için e-posta uyarıları gönderebilir. Sorun ne mi? Birçok e-posta sağlayıcısı güvenlik konusunda seçici hale geldi ve eski cihazlar çoğu zaman bunu karşılayamıyor. İşte Forward Email burada devreye giriyor - hem modern hem de eski cihazları destekliyoruz.

Bu rehber, 75'ten fazla NAS sağlayıcısı için adım adım talimatlar, uyumluluk bilgileri ve sorun giderme ipuçları ile e-posta kurulumunu kapsar. Hangi cihazı kullanıyor olursanız olun, bildirimlerinizin çalışmasını sağlayacağız.


## İçindekiler {#table-of-contents}

* [Neden NAS E-posta Bildirimlerine İhtiyacınız Var](#why-you-need-nas-email-notifications)
* [TLS Sorunu (Ve Nasıl Çözüyoruz)](#the-tls-problem-and-how-we-fix-it)
* [Forward Email SMTP Ayarları](#forward-email-smtp-settings)
* [Kapsamlı NAS Sağlayıcı Uyumluluk Matrisi](#comprehensive-nas-provider-compatibility-matrix)
* [Synology NAS E-posta Yapılandırması](#synology-nas-email-configuration)
  * [Yapılandırma Adımları](#configuration-steps)
* [QNAP NAS E-posta Yapılandırması](#qnap-nas-email-configuration)
  * [Yapılandırma Adımları](#configuration-steps-1)
  * [Yaygın QNAP Sorun Giderme](#common-qnap-troubleshooting-issues)
* [ReadyNAS Eski Yapılandırma](#readynas-legacy-configuration)
  * [Eski Yapılandırma Adımları](#legacy-configuration-steps)
  * [ReadyNAS Sorun Giderme](#readynas-troubleshooting)
* [TerraMaster NAS Yapılandırması](#terramaster-nas-configuration)
* [ASUSTOR NAS Yapılandırması](#asustor-nas-configuration)
* [Buffalo TeraStation Yapılandırması](#buffalo-terastation-configuration)
* [Western Digital My Cloud Yapılandırması](#western-digital-my-cloud-configuration)
* [TrueNAS E-posta Yapılandırması](#truenas-email-configuration)
* [OpenMediaVault Yapılandırması](#openmediavault-configuration)
* [Raspberry Pi NAS Yapılandırması](#raspberry-pi-nas-configuration)
  * [İlk Raspberry Pi Kurulumu](#initial-raspberry-pi-setup)
  * [Samba Dosya Paylaşımı Yapılandırması](#samba-file-sharing-configuration)
  * [FTP Sunucu Kurulumu](#ftp-server-setup)
  * [E-posta Bildirimi Yapılandırması](#email-notification-configuration)
  * [Gelişmiş Raspberry Pi NAS Özellikleri](#advanced-raspberry-pi-nas-features)
  * [Raspberry Pi E-posta Sorun Giderme](#raspberry-pi-email-troubleshooting)
  * [Performans Optimizasyonu](#performance-optimization)
  * [Güvenlik Hususları](#security-considerations)


## Neden NAS E-posta Bildirimlerine İhtiyacınız Var {#why-you-need-nas-email-notifications}

NAS cihazınız sürücü sağlığı, sıcaklık, ağ sorunları, güvenlik olayları gibi pek çok şeyi izler. E-posta uyarıları olmadan, sorunlar haftalarca fark edilmeden kalabilir ve bu da veri kaybına veya güvenlik ihlallerine yol açabilir.

E-posta bildirimleri, sürücüler arızalanmaya başladığında anında uyarılar verir, yetkisiz erişim girişimleri hakkında sizi uyarır, başarılı yedeklemeleri onaylar ve sistem sağlığı hakkında sizi bilgilendirir. Forward Email, bu kritik bildirimlerin size gerçekten ulaşmasını sağlar.


## TLS Sorunu (Ve Nasıl Çözüyoruz) {#the-tls-problem-and-how-we-fix-it}

Durum şu: NAS cihazınız 2020 öncesi üretildiyse, muhtemelen sadece TLS 1.0 destekliyordur. Gmail, Outlook ve çoğu sağlayıcı yıllar önce bu desteği bıraktı. Cihazınız e-posta göndermeye çalışır, reddedilir ve siz karanlıkta kalırsınız.

Forward Email bunu çift port desteği ile çözüyor. Modern cihazlar standart portlarımızı (`465` ve `587`) kullanırken, eski cihazlar TLS 1.0 destekleyen eski portlarımızı (`2455` ve `2555`) kullanabilir.

> \[!IMPORTANT]
> Forward Email, çift port stratejisi ile hem modern hem de eski NAS cihazlarını destekler. TLS 1.2+ destekleyen modern cihazlar için 465/587 portlarını, sadece TLS 1.0 destekleyen eski cihazlar için ise 2455/2555 portlarını kullanın.


## Forward Email SMTP Ayarları {#forward-email-smtp-settings}
İşte SMTP kurulumumuz hakkında bilmeniz gerekenler:

**Modern NAS cihazları için (2020+):** `smtp.forwardemail.net` adresini `465` portu (SSL/TLS) veya `587` portu (STARTTLS) ile kullanın. Bunlar TLS 1.2+ destekleyen güncel firmware ile çalışır.

**Eski NAS cihazları için:** `smtp.forwardemail.net` adresini `2455` portu (SSL/TLS) veya `2555` portu (STARTTLS) ile kullanın. Bunlar eski cihazlar için TLS 1.0 destekler.

**Kimlik Doğrulama:** Kullanıcı adı olarak Forward Email takma adınızı ve [Hesabım -> Alan Adları -> Takma Adlar](https://forwardemail.net/my-account/domains) bölümünden oluşturulan şifreyi kullanın (hesap şifreniz değil).

> \[!CAUTION]
> SMTP kimlik doğrulaması için asla hesap giriş şifrenizi kullanmayın. NAS yapılandırması için her zaman [Hesabım -> Alan Adları -> Takma Adlar](https://forwardemail.net/my-account/domains) bölümünden oluşturulan şifreyi kullanın.

> \[!TIP]
> Yapılandırmadan önce NAS cihazınızın firmware sürümünü ve TLS desteğini kontrol edin. 2020 sonrası üretilen çoğu cihaz modern TLS protokollerini desteklerken, eski cihazlar genellikle eski uyumluluk portları gerektirir.


## Kapsamlı NAS Sağlayıcı Uyumluluk Matrisi {#comprehensive-nas-provider-compatibility-matrix}

Aşağıdaki matris, başlıca NAS sağlayıcıları için TLS destek seviyeleri, firmware durumu ve önerilen Forward Email yapılandırma ayarları dahil olmak üzere detaylı uyumluluk bilgileri sağlar.

| NAS Sağlayıcı    | Güncel Modeller | TLS Desteği | Firmware Durumu | Önerilen Portlar | Yaygın Sorunlar                                                                                                                                         | Kurulum Rehberi/Ekran Görüntüleri                                                                                                               |
| ---------------- | --------------- | ----------- | --------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Synology         | DSM 7.x         | TLS 1.2+    | Aktif           | `465`, `587`     | [STARTTLS yapılandırması](https://community.synology.com/enu/forum/2/post/124584)                                                                      | [DSM E-posta Bildirimi Kurulumu](https://kb.synology.com/en-af/DSM/help/DSM/AdminCenter/system_notification_email)                             |
| QNAP             | QTS 5.x         | TLS 1.2+    | Aktif           | `465`, `587`     | [Bildirim Merkezi hataları](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525)    | [QTS E-posta Sunucusu Yapılandırması](https://docs.qnap.com/operating-system/qts/5.1.x/en-us/configuring-an-email-notification-server-EB4E6D7F.html) |
| Raspberry Pi     | Raspberry Pi OS | TLS 1.2+    | Aktif           | `465`, `587`     | [DNS çözümleme sorunları](https://www.raspberrypi.org/forums/viewtopic.php?t=294014)                                                                    | [Raspberry Pi E-posta Kurulum Rehberi](#raspberry-pi-nas-configuration)                                                                        |
| ASUSTOR          | ADM 4.x         | TLS 1.2+    | Aktif           | `465`, `587`     | [Sertifika doğrulama](https://forum.asustor.com/viewtopic.php?f=134&t=12345)                                                                           | [ASUSTOR Bildirim Kurulumu](https://www.asustor.com/en/online/online_help?id=8)                                                                 |
| TerraMaster      | TOS 6.x         | TLS 1.2     | Aktif           | `465`, `587`     | [SMTP kimlik doğrulama](https://www.terra-master.com/global/forum/)                                                                                     | [TerraMaster E-posta Yapılandırması](https://www.terra-master.com/global/support/download.php)                                                  |
| TrueNAS          | SCALE/CORE      | TLS 1.2+    | Aktif           | `465`, `587`     | [SSL sertifikası kurulumu](https://www.truenas.com/community/threads/email-notifications-not-working.95234/)                                           | [TrueNAS E-posta Kurulum Rehberi](https://www.truenas.com/docs/scale/scaletutorials/systemsettings/general/settingupsystememail/)              |
| Buffalo          | TeraStation     | TLS 1.2     | Sınırlı         | `465`, `587`     | [Firmware uyumluluğu](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)             | [TeraStation E-posta Kurulumu](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation) |
| Western Digital  | My Cloud OS 5   | TLS 1.2     | Sınırlı         | `465`, `587`     | [Eski OS uyumluluğu](https://community.wd.com/t/my-cloud-email-notifications-not-working/265432)                                                     | [My Cloud E-posta Yapılandırması](https://support-en.wd.com/app/answers/detailweb/a_id/10222)                                                   |
| OpenMediaVault   | OMV 7.x         | TLS 1.2+    | Aktif           | `465`, `587`     | [Eklenti bağımlılıkları](https://forum.openmediavault.org/index.php?thread/42156-email-notifications-not-working/)                                     | [OMV Bildirim Kurulumu](https://docs.openmediavault.org/en/latest/administration/general/notifications.html)                                    |
| Netgear ReadyNAS | OS 6.x          | Sadece TLS 1.0 | Desteği Kesildi | `2455`, `2555`   | [Eski TLS desteği](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)                           | [ReadyNAS E-posta Uyarı Kurulumu](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)      |
| Drobo            | Dashboard       | TLS 1.2     | Desteği Kesildi | `465`, `587`     | [Sınırlı destek](https://myprojects.drobo.com/support/)                                                                                                | [Drobo E-posta Bildirimleri](https://www.drobo.com/support/)                                                                                     |
Bu matris, modern, aktif olarak bakımı yapılan NAS sistemleri ile özel uyumluluk gerektiren eski cihazlar arasındaki net ayrımı göstermektedir. Mevcut NAS cihazlarının çoğu modern TLS standartlarını destekler ve Forward Email'in birincil SMTP portlarını herhangi bir özel yapılandırma olmadan kullanabilir.


## Synology NAS E-posta Yapılandırması {#synology-nas-email-configuration}

DSM'li Synology cihazları kurulumu oldukça basittir. Modern TLS'yi desteklerler, bu yüzden standart portlarımızı sorunsuz kullanabilirsiniz.

> \[!NOTE]
> Synology DSM 7.x en kapsamlı e-posta bildirim özelliklerini sunar. Daha eski DSM sürümlerinde yapılandırma seçenekleri sınırlı olabilir.

### Yapılandırma Adımları {#configuration-steps}

1. **DSM web arayüzüne erişin** NAS cihazınızın IP adresini veya QuickConnect ID'sini bir web tarayıcısına girerek.

2. **Denetim Masasına gidin** ve "Bildirim" bölümünü seçin, ardından e-posta yapılandırma seçeneklerine erişmek için "E-posta" sekmesine tıklayın.

3. **E-posta bildirimlerini etkinleştirin** "E-posta bildirimlerini etkinleştir" onay kutusunu işaretleyerek.

4. **SMTP sunucusunu yapılandırın** sunucu adresi olarak `smtp.forwardemail.net` girin.

5. **Port yapılandırmasını ayarlayın** SSL/TLS bağlantıları için 465 numaralı portu kullanın (önerilir). Alternatif olarak STARTTLS ile 587 numaralı port da desteklenir.

6. **Kimlik doğrulamayı yapılandırın** "SMTP kimlik doğrulaması gerekli" seçeneğini işaretleyin ve kullanıcı adı alanına Forward Email takma adınızı girin.

7. **Parolanızı girin** [Hesabım -> Alan Adları -> Takma Adlar](https://forwardemail.net/my-account/domains) üzerinden oluşturduğunuz parolayı kullanarak.

8. **Alıcı adreslerini ayarlayın** bildirim alacak en fazla beş e-posta adresini girin.

9. **Bildirim filtrelemesini yapılandırın** hangi olayların e-posta uyarısı tetikleyeceğini kontrol ederek bildirim aşırı yüklenmesini önleyin ve kritik olayların raporlanmasını sağlayın.

10. **Yapılandırmayı test edin** DSM'nin yerleşik test fonksiyonunu kullanarak tüm ayarların doğru olduğunu ve Forward Email sunucularıyla iletişimin düzgün çalıştığını doğrulayın.

> \[!TIP]
> Synology, farklı alıcılar için farklı bildirim türlerine izin vererek uyarıların ekibiniz içinde esnek dağıtımını sağlar.


## QNAP NAS E-posta Yapılandırması {#qnap-nas-email-configuration}

QTS'li QNAP cihazları Forward Email ile çok iyi çalışır. Modern TLS'yi destekler ve yapılandırma için güzel bir web arayüzüne sahiptir.

> \[!IMPORTANT]
> QNAP QTS 5.2.4 sürümünde e-posta bildirimleriyle ilgili bilinen bir sorun vardı ve bu sorun [QTS 5.2.5'te düzeltildi](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525). Bildirim hatalarını önlemek için donanım yazılımınızın güncel olduğundan emin olun.

### Yapılandırma Adımları {#configuration-steps-1}

1. **QNAP cihazınızın web arayüzüne erişin** IP adresini bir web tarayıcısına girerek.

2. **Denetim Masasına gidin** ve "Hizmet Hesabı ve Cihaz Eşleştirme"yi seçin, ardından e-posta yapılandırmasına başlamak için "E-posta" bölümüne tıklayın.

3. **"SMTP Hizmeti Ekle"ye tıklayın** yeni bir e-posta yapılandırması oluşturmak için.

4. **SMTP sunucusunu yapılandırın** SMTP sunucu adresi olarak `smtp.forwardemail.net` girin.

5. **Uygun güvenlik protokolünü seçin** - "SSL/TLS" ve port `465` (önerilir) seçeneğini tercih edin. STARTTLS ile port `587` de desteklenir.

6. **Port numarasını yapılandırın** - SSL/TLS için port `465` önerilir. Gerekirse STARTTLS ile port `587` de kullanılabilir.

7. **Kimlik bilgilerinizi girin** kullanıcı adı olarak Forward Email takma adınızı ve [Hesabım -> Alan Adları -> Takma Adlar](https://forwardemail.net/my-account/domains) üzerinden oluşturduğunuz parolayı kullanarak.

8. **Gönderen bilgilerini yapılandırın** "Kimden" alanı için "QNAP NAS Sistemi" veya cihazınızın ana bilgisayar adı gibi açıklayıcı bir isim girin.

9. **Farklı bildirim türleri için alıcı adreslerini ayarlayın** QNAP, farklı uyarı türleri için birden fazla alıcı grubu yapılandırmanıza olanak tanır.

10. **Yapılandırmayı test edin** QNAP'ın yerleşik e-posta test fonksiyonunu kullanarak tüm ayarların düzgün çalıştığını doğrulayın.

> \[!TIP]
> Eğer [Gmail SMTP yapılandırma sorunları](https://forum.qnap.com/viewtopic.php?t=152466) ile karşılaşırsanız, aynı sorun giderme adımları Forward Email için de geçerlidir. Kimlik doğrulamanın doğru etkinleştirildiğinden ve kimlik bilgilerinin doğru olduğundan emin olun.
> \[!NOTE]
> QNAP cihazları, kritik olmayan bildirimlerin bastırıldığı sessiz saatleri yapılandırmanıza olanak tanıyan gelişmiş bildirim zamanlamasını destekler. Bu, özellikle iş ortamlarında faydalıdır.

### Yaygın QNAP Sorun Giderme Sorunları {#common-qnap-troubleshooting-issues}

QNAP cihazınız [bildirim e-postası gönderemiyorsa](https://www.reddit.com/r/qnap/comments/1dc6z03/qnap_nas_will_not_send_notification_emails/), aşağıdakileri kontrol edin:

* İletilen E-posta kimlik bilgilerinizin doğru olduğunu doğrulayın
* SMTP sunucu adresinin tam olarak `smtp.forwardemail.net` olduğundan emin olun
* Portun şifreleme yönteminizle eşleştiğini doğrulayın (`465` SSL/TLS için önerilir; `587` STARTTLS için de desteklenir)
* [SMTP sunucu yapılandırmanızın](https://www.qnap.com/en/how-to/faq/article/why-does-notification-center-fail-to-send-emails-to-my-smtp-server) bağlantıya izin verdiğini kontrol edin


## ReadyNAS Eski Yapılandırması {#readynas-legacy-configuration}

Netgear ReadyNAS cihazları, sonlandırılmış firmware desteği ve eski TLS 1.0 protokollerine bağımlılıkları nedeniyle benzersiz zorluklar sunar. Ancak, Forward Email'in eski port desteği, bu cihazların e-posta bildirimlerini güvenilir şekilde göndermeye devam etmesini sağlar.

> \[!CAUTION]
> ReadyNAS OS 6.x yalnızca TLS 1.0'u destekler ve bu, Forward Email'in eski uyumluluk portları `2455` ve `2555` gerektirir. Modern portlar `465` ve `587` bu cihazlarla çalışmaz.

### Eski Yapılandırma Adımları {#legacy-configuration-steps}

1. **ReadyNAS web arayüzüne erişin** ve cihazın IP adresini bir web tarayıcısına girin.

2. **Sistem > Ayarlar > Uyarılar** bölümüne giderek e-posta yapılandırma kısmına erişin.

3. **SMTP sunucusunu yapılandırın** ve sunucu adresi olarak `smtp.forwardemail.net` girin.

4. **Port yapılandırmasını ayarlayın**: SSL/TLS bağlantıları için `2455` veya STARTTLS bağlantıları için `2555` - bunlar Forward Email'in eski uyumluluk portlarıdır.

5. **Kimlik doğrulamayı etkinleştirin** ve kullanıcı adı olarak Forward Email takma adınızı, şifre olarak da [Hesabım -> Alan Adları -> Takma Adlar](https://forwardemail.net/my-account/domains) bölümünden oluşturduğunuz şifreyi girin.

6. **Gönderen bilgilerini yapılandırın** ve ReadyNAS cihazını tanımlayan açıklayıcı bir "Kimden" adresi kullanın.

7. **Alıcı e-posta adreslerini ekleyin** e-posta kişi bölümündeki + butonunu kullanarak.

8. **Yapılandırmayı test edin** ve eski TLS bağlantısının düzgün çalıştığından emin olun.

> \[!IMPORTANT]
> ReadyNAS cihazları, modern TLS protokolleriyle güvenli bağlantı kuramadıkları için eski portları gerektirir. Bu, sonlandırılmış firmware'in [bilinen bir sınırlamasıdır](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system).

### ReadyNAS Sorun Giderme {#readynas-troubleshooting}

ReadyNAS e-posta yapılandırmasıyla ilgili yaygın sorunlar şunlardır:

* **TLS sürümü uyumsuzluğu**: Modern portlar yerine `2455` veya `2555` portlarını kullandığınızdan emin olun
* **Kimlik doğrulama hataları**: Forward Email kimlik bilgilerinizin doğru olduğunu doğrulayın
* **Ağ bağlantısı**: ReadyNAS'ın `smtp.forwardemail.net` adresine erişebildiğini kontrol edin
* **Firmware sınırlamaları**: Bazı eski ReadyNAS modelleri ek [HTTPS yapılandırma gereksinimlerine](https://kb.netgear.com/23100/How-do-I-configure-HTTPS-HTTP-with-SSL-encryption-settings-on-my-ReadyNAS-OS-6-storage-system) sahip olabilir

OS 6.x ve önceki sürümleri çalıştıran ReadyNAS cihazları yalnızca TLS 1.0 bağlantılarını destekler; çoğu modern e-posta sağlayıcısı artık bu sürümü kabul etmemektedir. Forward Email'in özel eski portları (2455 ve 2555) bu eski protokolleri destekleyerek ReadyNAS kullanıcıları için işlevselliğin devamını sağlar.

ReadyNAS cihazlarda e-posta yapılandırmak için cihazın IP adresi üzerinden web arayüzüne erişin. Sistem bölümüne gidin ve e-posta yapılandırma seçeneklerine erişmek için "Bildirimler"i seçin.

E-posta yapılandırma bölümünde, e-posta bildirimlerini etkinleştirin ve SMTP sunucusu olarak smtp.forwardemail.net girin. Bu çok önemlidir - standart SMTP portları yerine Forward Email'in eski uyumlu portlarını kullanın.

SSL/TLS bağlantıları için standart port 465 yerine 2455 portunu yapılandırın (önerilir). STARTTLS bağlantıları için 587 portu yerine 2555 portunu kullanın. Bu özel portlar TLS 1.0 uyumluluğunu korurken eski cihazlar için mevcut en iyi güvenliği sağlar.
İleri Yönlendirme E-postası takma adınızı kullanıcı adı olarak ve kimlik doğrulama için oluşturduğunuz şifreyi girin. ReadyNAS cihazları, İleri Yönlendirme E-postası bağlantıları için gerekli olan SMTP kimlik doğrulamasını destekler.

Gönderen e-posta adresini ve alıcı adreslerini bildirim gereksinimlerinize göre yapılandırın. ReadyNAS, birden fazla alıcı adresine izin vererek uyarıları farklı ekip üyelerine veya e-posta hesaplarına dağıtmanızı sağlar.

Yapılandırmayı dikkatlice test edin, çünkü ReadyNAS cihazları yapılandırma başarısız olursa ayrıntılı hata mesajları vermeyebilir. Standart test işe yaramazsa, modern SMTP portları yerine doğru eski portları (2455 veya 2555) kullandığınızdan emin olun.

Eski TLS protokollerini kullanmanın güvenlik etkilerini göz önünde bulundurun. İleri Yönlendirme E-postası'nın eski portları, eski cihazlar için mevcut en iyi güvenliği sağlasa da, mümkün olduğunda güncel TLS desteği olan modern bir NAS sistemine yükseltme önerilir.


## TerraMaster NAS Yapılandırması {#terramaster-nas-configuration}

TOS 6.x çalıştıran TerraMaster cihazları modern TLS'i destekler ve İleri Yönlendirme E-postası'nın standart portlarıyla iyi çalışır.

> \[!NOTE]
> TerraMaster TOS 6.x kapsamlı e-posta bildirim özellikleri sunar. En iyi uyumluluk için donanım yazılımınızın güncel olduğundan emin olun.

1. **Sistem Ayarlarına Erişim**
   * TerraMaster web arayüzünüze giriş yapın
   * **Kontrol Paneli** > **Bildirim** bölümüne gidin

2. **SMTP Ayarlarını Yapılandırma**
   * Sunucu: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, önerilen) veya `587` (STARTTLS)
   * Kullanıcı Adı: İleri Yönlendirme E-postası takma adınız
   * Şifre: [Hesabım -> Alan Adları -> Takma Adlar](https://forwardemail.net/my-account/domains) bölümünden oluşturulan şifre

3. **Bildirimleri Etkinleştirme**
   * Almak istediğiniz bildirim türlerini işaretleyin
   * Yerleşik test fonksiyonuyla yapılandırmayı test edin

> \[!TIP]
> TerraMaster cihazları SSL/TLS bağlantıları için `465` portuyla en iyi şekilde çalışır (önerilen). Sorun yaşarsanız, STARTTLS ile `587` portu da desteklenir.


## ASUSTOR NAS Yapılandırması {#asustor-nas-configuration}

ADM 4.x çalıştıran ASUSTOR cihazları sağlam e-posta bildirim desteğine sahiptir ve İleri Yönlendirme E-postası ile sorunsuz çalışır.

> \[!NOTE]
> ASUSTOR ADM 4.x gelişmiş bildirim filtreleme seçenekleri içerir. Hangi olayların e-posta uyarısı tetikleyeceğini özelleştirebilirsiniz.

1. **Bildirim Ayarlarını Açma**
   * ADM web arayüzüne erişin
   * **Ayarlar** > **Bildirim** bölümüne gidin

2. **SMTP Yapılandırmasını Ayarlama**
   * SMTP Sunucusu: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, önerilen) veya `587` (STARTTLS)
   * Kimlik Doğrulama: Etkinleştir
   * Kullanıcı Adı: İleri Yönlendirme E-postası takma adınız
   * Şifre: [Hesabım -> Alan Adları -> Takma Adlar](https://forwardemail.net/my-account/domains) bölümünden oluşturulan şifre

3. **Uyarı Türlerini Yapılandırma**
   * Hangi sistem olaylarının e-posta göndereceğini seçin
   * Alıcı adreslerini ayarlayın
   * Yapılandırmayı test edin

> \[!IMPORTANT]
> ASUSTOR cihazlarında SMTP ayarlarında kimlik doğrulamanın açık olması gerekir. Bu seçeneği işaretlemeyi unutmayın.


## Buffalo TeraStation Yapılandırması {#buffalo-terastation-configuration}

Buffalo TeraStation cihazları sınırlı ancak işlevsel e-posta bildirim yeteneklerine sahiptir. Nereden bakacağınızı bildiğinizde kurulum basittir.

> \[!CAUTION]
> Buffalo TeraStation donanım yazılımı güncellemeleri seyrektir. E-posta yapılandırmadan önce modeliniz için mevcut en son donanım yazılımını kullandığınızdan emin olun.

1. **Web Yapılandırmasına Erişim**
   * TeraStation web arayüzüne bağlanın
   * **Sistem** > **Bildirim** bölümüne gidin

2. **E-posta Ayarlarını Yapılandırma**
   * SMTP Sunucusu: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, önerilen) veya `587` (STARTTLS)
   * Kullanıcı Adı: İleri Yönlendirme E-postası takma adınız
   * Şifre: [Hesabım -> Alan Adları -> Takma Adlar](https://forwardemail.net/my-account/domains) bölümünden oluşturulan şifre
   * SSL/TLS şifrelemesini etkinleştir

3. **Bildirim Tercihlerini Ayarlama**
   * Hangi olayların e-posta tetikleyeceğini seçin (disk hataları, sıcaklık uyarıları vb.)
   * Alıcı e-posta adreslerini girin
   * Yapılandırmayı kaydedin ve test edin

> \[!NOTE]
> Bazı eski TeraStation modellerinde sınırlı SMTP yapılandırma seçenekleri olabilir. Modelinizin belgelerini belirli özellikler için kontrol edin.
## Western Digital My Cloud Yapılandırması {#western-digital-my-cloud-configuration}

OS 5 çalıştıran Western Digital My Cloud cihazları e-posta bildirimlerini destekler, ancak arayüz ayarlar içinde biraz gömülü olabilir.

> \[!WARNING]
> Western Digital birçok My Cloud modeline desteği sonlandırdı. Kritik uyarılar için e-posta bildirimlerine güvenmeden önce cihazınızın hala firmware güncellemeleri alıp almadığını kontrol edin.

1. **Ayarlar'a gidin**
   * My Cloud web kontrol panelini açın
   * **Ayarlar** > **Genel** > **Bildirimler** bölümüne gidin

2. **SMTP Detaylarını Yapılandırın**
   * Mail Sunucusu: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, önerilen) veya `587` (STARTTLS)
   * Kullanıcı Adı: Forward Email takma adınız
   * Şifre: [Hesabım -> Alan Adları -> Takma Adlar](https://forwardemail.net/my-account/domains) üzerinden oluşturulan şifre
   * Şifrelemeyi etkinleştirin

3. **Uyarı Türlerini Ayarlayın**
   * Bildirim kategorilerini seçin (sistem uyarıları, disk sağlığı vb.)
   * Alıcı e-posta adreslerini ekleyin
   * E-posta yapılandırmasını test edin

> \[!TIP]
> SSL/TLS ile `465` portunu kullanmanızı öneririz. Sorun yaşarsanız, STARTTLS ile `587` portu da desteklenmektedir.


## TrueNAS E-posta Yapılandırması {#truenas-email-configuration}

TrueNAS (hem SCALE hem CORE) detaylı yapılandırma seçenekleriyle mükemmel e-posta bildirim desteği sunar.

> \[!NOTE]
> TrueNAS, NAS sistemleri arasında en kapsamlı e-posta bildirim özelliklerinden bazılarını sağlar. Ayrıntılı uyarı kuralları ve birden fazla alıcı yapılandırabilirsiniz.

1. **Sistem Ayarlarına Erişin**
   * TrueNAS web arayüzüne giriş yapın
   * **Sistem** > **E-posta** bölümüne gidin

2. **SMTP Ayarlarını Yapılandırın**
   * Giden Mail Sunucusu: `smtp.forwardemail.net`
   * Mail Sunucusu Portu: `465` (önerilen) veya `587`
   * Güvenlik: SSL/TLS (465 için, önerilen) veya STARTTLS (587 için)
   * Kullanıcı Adı: Forward Email takma adınız
   * Şifre: [Hesabım -> Alan Adları -> Takma Adlar](https://forwardemail.net/my-account/domains) üzerinden oluşturulan şifre

3. **Uyarıları Ayarlayın**
   * **Sistem** > **Uyarı Servisleri** bölümüne gidin
   * Hangi uyarıların e-posta ile gönderileceğini yapılandırın
   * Alıcı adreslerini ve uyarı seviyelerini belirleyin
   * Dahili test fonksiyonuyla yapılandırmayı test edin

> \[!IMPORTANT]
> TrueNAS farklı uyarı seviyelerini (BİLGİ, DUYURU, UYARI, HATA, KRİTİK) yapılandırmanıza izin verir. E-posta spamını önlemek ve kritik sorunların raporlanmasını sağlamak için uygun seviyeleri seçin.


## OpenMediaVault Yapılandırması {#openmediavault-configuration}

OpenMediaVault, web arayüzü üzerinden sağlam e-posta bildirim yetenekleri sunar. Kurulum süreci temiz ve basittir.

> \[!NOTE]
> OpenMediaVault'un bildirim sistemi eklenti tabanlıdır. E-posta bildirim eklentisinin yüklü ve etkin olduğundan emin olun.

1. **Bildirim Ayarlarına Erişin**
   * OpenMediaVault web arayüzünü açın
   * **Sistem** > **Bildirim** > **E-posta** bölümüne gidin

2. **SMTP Parametrelerini Yapılandırın**
   * SMTP Sunucusu: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, önerilen) veya `587` (STARTTLS)
   * Kullanıcı Adı: Forward Email takma adınız
   * Şifre: [Hesabım -> Alan Adları -> Takma Adlar](https://forwardemail.net/my-account/domains) üzerinden oluşturulan şifre
   * SSL/TLS'yi etkinleştirin

3. **Bildirim Kurallarını Ayarlayın**
   * **Sistem** > **Bildirim** > **Bildirimler** bölümüne gidin
   * Hangi sistem olaylarının e-posta tetikleyeceğini yapılandırın
   * Alıcı adreslerini belirleyin
   * E-posta işlevselliğini test edin

> \[!TIP]
> OpenMediaVault, bildirim zamanlamalarını yapılandırmanıza olanak tanır. Sessiz saatler ayarlayabilir veya bildirim sıklığını sınırlandırarak uyarılarla bunalmayı önleyebilirsiniz.


## Raspberry Pi NAS Yapılandırması {#raspberry-pi-nas-configuration}

Raspberry Pi, ev ve küçük ofis ortamları için uygun maliyetli bir çözüm sunarak NAS işlevselliğine mükemmel bir giriş noktasıdır. Raspberry Pi'yi NAS cihazı olarak kurmak, dosya paylaşım protokollerinin, e-posta bildirimlerinin ve temel ağ servislerinin yapılandırılmasını içerir.

> \[!TIP]
> Raspberry Pi meraklıları için, NAS kurulumunuzu uzaktan sunucu yönetimi için [PiKVM](https://pikvm.org/) ve ağ genelinde reklam engelleme ve DNS yönetimi için [Pi-hole](https://pi-hole.net/) ile tamamlamanızı şiddetle tavsiye ederiz. Bu araçlar kapsamlı bir ev laboratuvar ortamı oluşturur.
### Başlangıç Raspberry Pi Kurulumu {#initial-raspberry-pi-setup}

NAS servislerini yapılandırmadan önce, Raspberry Pi'nizin en son Raspberry Pi OS sürümünü çalıştırdığından ve yeterli depolama alanına sahip olduğundan emin olun. Yüksek kaliteli bir microSD kart (Sınıf 10 veya daha iyisi) veya USB 3.0 SSD, NAS işlemleri için daha iyi performans ve güvenilirlik sağlar.

1. Tüm paketlerin güncel olduğundan emin olmak için `sudo apt update && sudo apt upgrade -y` komutunu çalıştırarak **sistemi güncelleyin**.

2. Uzaktan yönetim için `sudo systemctl enable ssh && sudo systemctl start ssh` komutunu kullanarak **SSH erişimini etkinleştirin**.

3. Tutarlı ağ erişimi sağlamak için `/etc/dhcpcd.conf` dosyasını düzenleyerek **statik IP adreslemesini yapılandırın**.

4. USB sürücüleri bağlayıp monte ederek veya veri yedekliliği için RAID dizilerini yapılandırarak **harici depolamayı kurun**.

### Samba Dosya Paylaşımı Yapılandırması {#samba-file-sharing-configuration}

Samba, Windows uyumlu dosya paylaşımı sağlar ve Raspberry Pi'nizin ağınızdaki herhangi bir cihazdan erişilebilir olmasını sağlar. Yapılandırma süreci Samba'nın kurulması, paylaşımlar oluşturulması ve kullanıcı kimlik doğrulamasının ayarlanmasını içerir.

Samba'yı `sudo apt install samba samba-common-bin` komutuyla kurun ve ana yapılandırma dosyasını `/etc/samba/smb.conf` dosyasında yapılandırın. Paylaşılan dizinler oluşturun ve uygun izinleri `sudo mkdir -p /srv/samba/shared && sudo chmod 755 /srv/samba/shared` komutlarıyla ayarlayın.

Her paylaşılan dizin için yapılandırma dosyasına bölümler ekleyerek Samba paylaşımlarını yapılandırın. Ağ erişimi için Samba'ya özgü şifreler oluşturmak üzere `sudo smbpasswd -a username` komutunu kullanarak kullanıcı kimlik doğrulamasını ayarlayın.

> \[!IMPORTANT]
> Samba kullanıcıları için her zaman güçlü şifreler kullanın ve yalnızca hassas olmayan paylaşılan klasörler için misafir erişimini etkinleştirmeyi düşünün. Gelişmiş güvenlik yapılandırmaları için [resmi Samba dokümantasyonunu](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html) inceleyin.

### FTP Sunucu Kurulumu {#ftp-server-setup}

FTP, özellikle otomatik yedeklemeler ve uzaktan dosya yönetimi için faydalı olan başka bir dosya erişim yöntemidir. Güvenilir FTP hizmetleri için vsftpd (Very Secure FTP Daemon) kurup yapılandırın.

`sudo apt install vsftpd` komutuyla vsftpd'yi kurun ve `/etc/vsftpd.conf` dosyasını düzenleyerek servisi yapılandırın. Yerel kullanıcı erişimini etkinleştirin, pasif mod ayarlarını yapılandırın ve uygun güvenlik kısıtlamalarını ayarlayın.

FTP kullanıcıları oluşturun ve dizin erişim izinlerini yapılandırın. Tüm veri iletimini şifrelediği için gelişmiş güvenlik için geleneksel FTP yerine SFTP (SSH Dosya Transfer Protokolü) kullanmayı düşünün.

> \[!CAUTION]
> Geleneksel FTP şifreleri düz metin olarak iletir. Güvenli dosya transferleri için her zaman SFTP kullanın veya FTP'yi TLS şifrelemesi ile yapılandırın. Dağıtımdan önce [vsftpd güvenlik en iyi uygulamalarını](https://security.appspot.com/vsftpd.html) inceleyin.

### E-posta Bildirim Yapılandırması {#email-notification-configuration}

Raspberry Pi NAS cihazınızın sistem olayları, depolama uyarıları ve yedekleme tamamlanma durumu için e-posta bildirimleri göndermesini yapılandırın. Bu, bir posta transfer aracısı kurmayı ve Forward Email entegrasyonunu ayarlamayı içerir.

Hafif bir SMTP istemcisi olarak `msmtp`'yi `sudo apt install msmtp msmtp-mta` komutuyla kurun. Aşağıdaki ayarlarla `/etc/msmtprc` yapılandırma dosyasını oluşturun:

```
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /var/log/msmtp.log

account        forwardemail
host           smtp.forwardemail.net
port           465
tls_starttls   off
from           your-alias@yourdomain.com
user           your-alias@yourdomain.com
password       your-generated-password
```

`msmtp` kullanarak uyarılar gönderen cron işleri ve sistem izleme betikleri kurarak sistem bildirimlerini yapılandırın. Disk alanı izleme, sıcaklık uyarıları ve yedekleme tamamlanma bildirimleri için betikler oluşturun.

### Gelişmiş Raspberry Pi NAS Özellikleri {#advanced-raspberry-pi-nas-features}

Raspberry Pi NAS cihazınızı ek servisler ve izleme yetenekleri ile geliştirin. Ağ izleme araçları, otomatik yedekleme çözümleri ve uzaktan erişim servislerini kurup yapılandırın.

Web tabanlı dosya erişimi, takvim senkronizasyonu ve işbirliği özellikleri ile bulut benzeri işlevsellik için [Nextcloud](https://nextcloud.com/) kurun. Raspberry Pi için Docker veya resmi Nextcloud kurulum kılavuzunu kullanarak yükleyin.
`rsync` ve `cron` kullanarak otomatik yedeklemeleri yapılandırarak kritik verilerin planlı yedeklerini oluşturun. Yedekleme tamamlanma ve hata bildirimleri için Forward Email yapılandırmanızı kullanarak e-posta bildirimleri ayarlayın.

Sistem sağlığı, ağ bağlantısı ve hizmet kullanılabilirliğini izlemek için [Nagios](https://www.nagios.org/) veya [Zabbix](https://www.zabbix.com/) gibi araçlarla ağ izleme uygulayın.

> \[!NOTE]
> Ağ altyapısını yöneten kullanıcılar için, uzaktan fiziksel anahtar kontrolü sağlamak amacıyla PiKVM kurulumunuzla [Switchbot](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) entegrasyonunu düşünün. Bu [Python entegrasyon rehberi](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) fiziksel cihaz yönetimini otomatikleştirmek için ayrıntılı talimatlar sunar.

### Raspberry Pi E-posta Sorun Giderme {#raspberry-pi-email-troubleshooting}

Raspberry Pi e-posta yapılandırmasında yaygın sorunlar arasında DNS çözümleme problemleri, güvenlik duvarı kısıtlamaları ve kimlik doğrulama hataları bulunur. Raspberry Pi sistemlerinin hafif yapısı bazen SMTP bağlantılarında zamanlama sorunlarına yol açabilir.

E-posta bildirimleri başarısız olursa, ayrıntılı hata mesajları için `/var/log/msmtp.log` dosyasındaki `msmtp` günlüklerini kontrol edin. Forward Email kimlik bilgilerinizin doğru olduğunu ve Raspberry Pi'nin `smtp.forwardemail.net` adresini çözümleyebildiğini doğrulayın.

Komut satırından e-posta işlevselliğini test etmek için: `echo "Test message" | msmtp recipient@example.com` komutunu kullanın. Bu, yapılandırma sorunlarını uygulamaya özgü problemlerden ayırmaya yardımcı olur.

DNS çözümleme sorunları yaşarsanız `/etc/resolv.conf` dosyasında uygun DNS ayarlarını yapılandırın. Yerel DNS güvenilir değilse `8.8.8.8` veya `1.1.1.1` gibi genel DNS sunucularını kullanmayı düşünün.

### Performans Optimizasyonu {#performance-optimization}

Raspberry Pi NAS performansınızı depolama, ağ ayarları ve sistem kaynaklarının doğru yapılandırılmasıyla optimize edin. Yüksek kaliteli depolama aygıtları kullanın ve kullanım durumunuza uygun dosya sistemi seçeneklerini yapılandırın.

Harici sürücüler kullanıyorsanız daha iyi depolama performansı için USB 3.0 önyüklemeyi etkinleştirin. Grafik işlem yerine sistem işlemlerine daha fazla RAM ayırmak için `sudo raspi-config` kullanarak GPU bellek paylaştırmasını yapılandırın.

Sistem performansını izlemek için `htop`, `iotop` ve `nethogs` gibi araçları kullanarak darboğazları tespit edin ve kaynak kullanımını optimize edin. Yoğun NAS uygulamaları için 8GB RAM’li Raspberry Pi 4’e yükseltmeyi düşünün.

Yoğun işlemler sırasında termal kısıtlamayı önlemek için uygun soğutma çözümleri uygulayın. CPU sıcaklığını `/opt/vc/bin/vcgencmd measure_temp` komutuyla izleyin ve yeterli havalandırmayı sağlayın.

### Güvenlik Hususları {#security-considerations}

Raspberry Pi NAS cihazınızı uygun erişim kontrolleri, ağ güvenlik önlemleri ve düzenli güvenlik güncellemeleri ile güvence altına alın. Varsayılan parolaları değiştirin, gereksiz servisleri devre dışı bırakın ve güvenlik duvarı kurallarını yapılandırın.

SSH ve diğer servislerde kaba kuvvet saldırılarına karşı koruma sağlamak için `fail2ban` kurup yapılandırın. Kritik güvenlik yamalarının zamanında uygulanmasını sağlamak için `unattended-upgrades` ile otomatik güvenlik güncellemeleri ayarlayın.

Mümkünse NAS cihazınızı diğer ağ aygıtlarından izole etmek için ağ segmentasyonu yapılandırın. Hizmetleri doğrudan internete açmak yerine uzaktan bağlantılar için VPN erişimi kullanın.

Donanım arızaları veya güvenlik olaylarından kaynaklanan veri kaybını önlemek için Raspberry Pi yapılandırmanızı ve verilerinizi düzenli olarak yedekleyin. Veri kurtarma yeteneklerini sağlamak için yedekleme geri yükleme prosedürlerini test edin.

Raspberry Pi NAS yapılandırması, ağ depolama kavramlarını öğrenmek için mükemmel bir temel sunarken ev ve küçük ofis ortamları için pratik işlevsellik sağlar. Forward Email ile birleştiğinde sistem izleme ve bakım bildirimleri için güvenilir bildirim teslimatı sağlar.
