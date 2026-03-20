# Yazıcı, Kamera, Faks ve Tarayıcı E-posta Kurulumu Tam Rehberi {#complete-guide-to-printer-camera-fax--scanner-email-setup}

Ofis ekipmanınızın e-posta göndermesi gerekir - yazıcılar toner seviyeleri hakkında uyarır, IP kameralar hareket algılama hakkında bildirim yapar, faks makineleri iletim durumunu raporlar ve tarayıcılar belge işleme onayı verir. Sorun ne mi? Çoğu e-posta sağlayıcısı eski cihazlar için desteği bıraktı, bu da ekipmanınızın bildirim gönderememesine yol açtı.

[Microsoft Office 365, Ocak 2022'de TLS 1.0 ve TLS 1.1 desteğini sonlandırdı](https://learn.microsoft.com/en-us/troubleshoot/exchange/email-delivery/fix-issues-with-printers-scanners-and-lob-applications-that-send-email-using-off), binlerce cihaz için e-postayı bozdu. 2020 öncesi birçok yazıcı, kamera ve faks makinesi yalnızca bu eski protokolleri destekler ve güncellenemez.

Forward Email, hem modern hem de eski cihazları destekleyerek bu sorunu çözüyor. Güncel ekipmanlar için özel portlarımız ve yükseltilemeyen eski cihazlar için özel eski portlarımız var.

> \[!IMPORTANT]
> Forward Email, çift port stratejimizle hem modern hem de eski cihazları destekler. TLS 1.2+ desteği olan modern cihazlar için `465` (SSL/TLS, önerilen) veya `587` (STARTTLS) portlarını, yalnızca TLS 1.0 destekleyen eski cihazlar için ise `2455`/`2555` portlarını kullanın.


## İçindekiler {#table-of-contents}

* [TLS Sorunu Açıklaması](#the-tls-problem-explained)
* [Forward Email SMTP Yapılandırma Genel Bakış](#forward-email-smtp-configuration-overview)
* [Kapsamlı Cihaz Uyumluluk Matrisi](#comprehensive-device-compatibility-matrix)
* [HP Yazıcı E-posta Yapılandırması](#hp-printer-email-configuration)
  * [Modern HP Yazıcılar (2020 ve Sonrası)](#modern-hp-printers-2020-and-later)
  * [Eski HP Yazıcılar (2020 Öncesi Modeller)](#legacy-hp-printers-pre-2020-models)
* [Canon Yazıcı E-posta Yapılandırması](#canon-printer-email-configuration)
  * [Güncel Canon Yazıcılar](#current-canon-printers)
  * [Eski Canon Yazıcılar](#legacy-canon-printers)
* [Brother Yazıcı E-posta Yapılandırması](#brother-printer-email-configuration)
  * [Brother MFC Serisi Yapılandırması](#brother-mfc-series-configuration)
  * [Brother E-posta Sorun Giderme](#troubleshooting-brother-email-issues)
* [Foscam IP Kamera E-posta Yapılandırması](#foscam-ip-camera-email-configuration)
  * [Foscam E-posta Kısıtlamalarının Anlaşılması](#understanding-foscam-email-limitations)
  * [Foscam E-posta Yapılandırma Adımları](#foscam-email-configuration-steps)
  * [Gelişmiş Foscam Yapılandırması](#advanced-foscam-configuration)
* [Hikvision Güvenlik Kamerası E-posta Yapılandırması](#hikvision-security-camera-email-configuration)
  * [Modern Hikvision Kamera Yapılandırması](#modern-hikvision-camera-configuration)
  * [Eski Hikvision Kamera Yapılandırması](#legacy-hikvision-camera-configuration)
* [Dahua Güvenlik Kamerası E-posta Yapılandırması](#dahua-security-camera-email-configuration)
  * [Dahua Kamera E-posta Kurulumu](#dahua-camera-email-setup)
  * [Dahua NVR E-posta Yapılandırması](#dahua-nvr-email-configuration)
* [Xerox Çok Fonksiyonlu Cihaz E-posta Yapılandırması](#xerox-multifunction-device-email-configuration)
  * [Xerox MFD E-posta Kurulumu](#xerox-mfd-email-setup)
* [Ricoh Çok Fonksiyonlu Cihaz E-posta Yapılandırması](#ricoh-multifunction-device-email-configuration)
  * [Modern Ricoh MFD Yapılandırması](#modern-ricoh-mfd-configuration)
  * [Eski Ricoh Cihaz Yapılandırması](#legacy-ricoh-device-configuration)
* [Yaygın Yapılandırma Sorunları Giderme](#troubleshooting-common-configuration-issues)
  * [Kimlik Doğrulama ve Kimlik Bilgisi Sorunları](#authentication-and-credential-issues)
  * [TLS ve Şifreleme Problemleri](#tls-and-encryption-problems)
  * [Ağ Bağlantısı Sorunları](#network-connectivity-issues)
  * [Cihaza Özel Yapılandırma Zorlukları](#device-specific-configuration-challenges)
* [Güvenlik Hususları ve En İyi Uygulamalar](#security-considerations-and-best-practices)
  * [Kimlik Bilgisi Yönetimi](#credential-management)
  * [Ağ Güvenliği](#network-security)
  * [Bilgi Açığa Çıkması](#information-disclosure)
  * [İzleme ve Bakım](#monitoring-and-maintenance)
* [Sonuç](#conclusion)
## TLS Sorunu Açıklaması {#the-tls-problem-explained}

Şöyle oldu: e-posta güvenliği sıkılaştı, ancak cihazlarınız bu bilgiyi almadı. Modern ekipman TLS 1.2+ desteklerken, eski cihazlar TLS 1.0 ile sınırlı kaldı. Çoğu e-posta sağlayıcısı TLS 1.0 desteğini bıraktı, bu yüzden cihazlarınız bağlanamıyor.

Bu gerçek operasyonları etkiliyor - güvenlik kameraları olaylar sırasında uyarı gönderemiyor, yazıcılar bakım sorunları hakkında uyarı veremiyor ve faks onayları kayboluyor. Forward Email'in [SMTP sunucu yapılandırması](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings) her şeyin çalışmaya devam etmesi için birden fazla port sağlar.

> \[!TIP]
> Yapılandırmadan önce cihazınızın donanım yazılımı sürümünü ve TLS desteğini kontrol edin. 2020 sonrası üretilen çoğu cihaz modern TLS protokollerini desteklerken, eski cihazlar genellikle eski uyumluluk portlarına ihtiyaç duyar.


## Forward Email SMTP Yapılandırma Genel Bakış {#forward-email-smtp-configuration-overview}

Forward Email, cihaz e-posta yapılandırmasının benzersiz zorluklarını ele almak üzere özel olarak tasarlanmış kapsamlı bir SMTP hizmeti sunar. Altyapımız, hem en yeni ekipmanlarla hem de aktif olarak kullanılan eski cihazlarla uyumluluğu sağlamak için birden fazla bağlantı türü ve güvenlik seviyesi destekler.

TLS 1.2+ destekleyen modern cihazlar için, SSL/TLS bağlantıları için port 465 veya STARTTLS bağlantıları için port 587 ile smtp.forwardemail.net ana SMTP sunucumuzu kullanın (önerilir). Bu portlar kurumsal düzeyde güvenlik sağlar ve tüm güncel cihaz donanım yazılımı sürümleriyle uyumludur.

Sadece TLS 1.0 destekleyen eski cihazlar, özel uyumluluk portlarımızı kullanabilir. Port 2455 TLS 1.0 destekli SSL/TLS bağlantısı sağlarken, port 2555 eski protokol uyumluluğuyla STARTTLS sunar. Bu portlar en yüksek mümkün güvenliği korurken eski ekipmanın işlevselliğinin devamını sağlar.

Tüm bağlantılar için Forward Email takma adınızı kullanıcı adı olarak ve [Hesabım -> Alan Adları -> Takma Adlar](https://forwardemail.net/my-account/domains) bölümünden oluşturulan şifreyi kullanarak kimlik doğrulaması gereklidir. Bu yöntem, farklı cihaz kimlik doğrulama sistemleri arasında geniş uyumluluk sağlarken güçlü güvenlik sunar.

> \[!CAUTION]
> SMTP kimlik doğrulaması için hesap giriş şifrenizi asla kullanmayın. Cihaz yapılandırması için her zaman [Hesabım -> Alan Adları -> Takma Adlar](https://forwardemail.net/my-account/domains) bölümünden oluşturulan şifreyi kullanın.


## Kapsamlı Cihaz Uyumluluk Matrisi {#comprehensive-device-compatibility-matrix}

Hangi cihazların eski destek gerektirdiğini ve hangilerinin modern yapılandırma kullandığını anlamak, kurulum sürecini kolaylaştırır ve tüm cihaz ekosisteminizde güvenilir e-posta teslimatını garanti eder.

| Cihaz Kategorisi           | Modern TLS Desteği  | Eski TLS Gerekli   | Önerilen Portlar | Yaygın Sorunlar                                                                                                                                     | Kurulum Kılavuzu/Ekran Görüntüleri                                                                                                              |
| -------------------------- | ------------------- | ------------------ | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| HP Yazıcılar (2020+)       | ✅ TLS 1.2+          | ❌                  | `465`, `587`     | [Sertifika doğrulama](https://h30434.www3.hp.com/t5/Scanning-Faxing-Copying/Scan-to-E-Mail-newer-MFP-Pro-printers-SMTP-Certificate/td-p/9194707) | [HP LaserJet Pro MFP Kurulum Kılavuzu](https://support.hp.com/us-en/document/ish_6185297-6063300-16)                                              |
| HP Yazıcılar (2020 Öncesi) | ❌                   | ✅ Sadece TLS 1.0   | `2455`, `2555`   | [Donanım yazılımı sınırlamaları](https://www.reddit.com/r/sysadmin/comments/1gnpac4/printers_dont_have_tls_settings/)                              | [E-postaya Tarama Özelliği Kılavuzu](https://support.hp.com/us-en/document/ish_6518575-6518545-16)                                                |
| Canon Yazıcılar (Güncel)   | ✅ TLS 1.2+          | ❌                  | `465`, `587`     | [Kimlik doğrulama kurulumu](https://community.usa.canon.com/t5/Office-Printers/MF733CDW-Cannot-Scan-to-Email-with-SMTP-Auth-Error-806/td-p/265358) | [Canon SMTP Kimlik Doğrulama Kılavuzu](https://oip.manual.canon/USRMA-0320-zz-CS-enUV/contents/1T0003111775.html)                               |
| Canon Yazıcılar (Eski)     | ❌                   | ✅ Sadece TLS 1.0   | `2455`, `2555`   | [Sertifika sorunları](https://community.usa.canon.com/t5/Office-Printers/MF735cx-quot-Register-quot-Certificate-produces-error/td-p/245443)        | [Gelişmiş E-posta Ayarları Kılavuzu](https://oip.manual.canon/USRMA-0163-zz-CS-enGB/contents/08025025.html)                                      |
| Brother Yazıcılar (Güncel) | ✅ TLS 1.2+          | ❌                  | `465`, `587`     | [Port yapılandırması](https://www.reddit.com/r/techsupport/comments/1548u4o/brother_printer_not_taking_scan_to_email_config/)                      | [Brother SMTP Kurulum Kılavuzu](https://support.brother.com/g/b/faqend.aspx?c=us&lang=en&prod=mfcl2690dw_us&faqid=faq00100234_512)              |
| Epson Yazıcılar (Güncel)   | ✅ TLS 1.2+          | ❌                  | `465`, `587`     | Web arayüzü erişimi                                                                                                                                | [Epson E-posta Bildirimi Kurulumu](https://download4.epson.biz/sec_pubs/l6580_series/useg/en/GUID-5FED5794-3E76-4DE9-8B9D-EBD8F60F231C.htm)      |
| Foscam IP Kameralar        | ❌                   | ✅ Sadece TLS 1.0   | `2455`, `2555`   | [Sertifika doğrulama](https://ipcamtalk.com/threads/foscam-ip-cameras-stopped-sending-email-in-motion-detection.80152/)                            | [Foscam E-posta Kurulum SSS](https://www.foscam.com/faqs/view.html?id=63)                                                                        |
| Hikvision (2020+)          | ✅ TLS 1.2+          | ❌                  | `465`, `587`     | SSL gereksinimleri                                                                                                                                  | [Hikvision E-posta Kurulum Kılavuzu](https://www.hikvision.com/content/dam/hikvision/ca/how-to-document/How-to-setup-email-on-Hikvision-nvr-dvr.pdf) |
| Hikvision (Eski)           | ❌                   | ✅ Sadece TLS 1.0   | `2455`, `2555`   | Donanım yazılımı güncellemeleri                                                                                                                    | [Eski Hikvision Yapılandırması](https://www.hikvision.com/content/dam/hikvision/ca/how-to-document/How-to-setup-email-on-Hikvision-nvr-dvr.pdf)  |
| Dahua Kameralar (Güncel)   | ✅ TLS 1.2+          | ❌                  | `465`, `587`     | Kimlik doğrulama                                                                                                                                   | [Dahua E-posta Kurulum Wiki](https://dahuawiki.com/Email/Email_Notifications_Setup_GMail)                                                        |
| Xerox MFD'ler (Güncel)     | ✅ TLS 1.2+          | ❌                  | `465`, `587`     | [TLS yapılandırması](https://www.support.xerox.com/en-us/article/KB0032169)                                                                        | [Xerox TLS Yapılandırma Kılavuzu](https://www.support.xerox.com/en-us/article/KB0032169)                                                         |
| Ricoh MFD'ler (Güncel)     | ✅ TLS 1.2+          | ❌                  | `465`, `587`     | SSL kurulumu                                                                                                                                       | [Ricoh E-posta Yapılandırması](https://www.ricoh.com/info/2025/0526_1)                                                                          |
| Ricoh MFD'ler (Eski)       | ❌                   | ✅ Sadece TLS 1.0   | `2455`, `2555`   | [Temel kimlik doğrulama sorunları](https://www.ricoh.com/info/2025/0526_1)                                                                        | [Eski Ricoh Kurulumu](https://www.ricoh.com/info/2025/0526_1)                                                                                   |
Bu matris, belirli cihazlarınız için uygun yapılandırma yaklaşımını hızlıca belirlemenize yardımcı olur. Şüphe durumunda, modern portlarla başlayın ve bağlantı sorunları yaşanırsa eski portlara geri dönün.

> \[!NOTE]
> Cihaz yaşı her zaman TLS desteğinin güvenilir bir göstergesi değildir. Bazı üreticiler, eski modellere firmware güncellemeleriyle TLS 1.2 desteğini geri taşırken, diğerleri eski ürünler için desteği sonlandırmıştır.


## HP Yazıcı E-posta Yapılandırması {#hp-printer-email-configuration}

HP yazıcılar, tam TLS 1.3 desteğine sahip güncel LaserJet Pro serisinden yalnızca TLS 1.0 destekleyen eski modellere kadar uzanan modellerle, ağ bağlantılı yazıcı cihazlarının en büyük kurulu tabanlarından birini temsil eder. Yapılandırma süreci modern ve eski cihazlar arasında önemli ölçüde farklılık gösterir ve optimal uyumluluk için farklı yaklaşımlar gerektirir.

### Modern HP Yazıcılar (2020 ve Sonrası) {#modern-hp-printers-2020-and-later}

Modern HP yazıcılar arasında LaserJet Pro MFP M404 serisi, Color LaserJet Pro MFP M479 serisi ve mevcut TLS standartlarını destekleyen daha yeni modeller bulunur. Bu cihazlar, HP'nin Gömülü Web Sunucusu (EWS) arayüzü aracılığıyla kapsamlı e-posta bildirim yetenekleri sunar.

1. **Yazıcının web arayüzüne erişin**: Yazıcının IP adresini bir web tarayıcısına girin. IP adresini, yazıcının kontrol panelinden bir ağ yapılandırma sayfası yazdırarak bulabilirsiniz.

2. **Ağ sekmesine gidin** ve yazıcı modelinize bağlı olarak "E-posta Sunucusu" veya "SMTP Ayarları"nı seçin. Bazı HP yazıcılar bu ayarları "Sistem" > "E-posta Uyarıları" altında düzenler.

3. **SMTP sunucu ayarlarını yapılandırın**: Sunucu adresi olarak `smtp.forwardemail.net` girin. Şifreleme yöntemi olarak "SSL/TLS" seçin ve en güvenilir bağlantı için port numarası olarak `465` girin.

4. **Kimlik doğrulamayı ayarlayın**: SMTP kimlik doğrulamayı etkinleştirin ve kullanıcı adı olarak Forward Email takma adınızı girin. Hesap giriş şifreniz değil, [Hesabım -> Alan Adları -> Takma Adlar](https://forwardemail.net/my-account/domains) bölümünden oluşturulan şifreyi kullanın.

5. **Gönderen bilgilerini yapılandırın**: "Kimden" adresi olarak Forward Email takma adınızı ve bildirim kaynağını tanımlamaya yardımcı olacak "HP Yazıcı - Ofis" gibi açıklayıcı bir isim girin.

6. **Alıcı adreslerini ayarlayın**: Yazıcı bildirimlerini alacak en fazla beş e-posta adresi ekleyin. HP yazıcılar, farklı bildirim türlerinin farklı alıcılara gönderilmesine izin verir.

7. **Yapılandırmayı test edin**: HP'nin yerleşik e-posta test işlevini kullanarak yapılandırmayı test edin. Yazıcı, tüm ayarların doğru olduğunu ve Forward Email sunucularıyla iletişimin düzgün çalıştığını doğrulamak için test mesajı gönderecektir.

> \[!TIP]
> HP yazıcılar genellikle DNS sorgularını önbelleğe alır. Bağlantı sorunları yaşarsanız, yapılandırmadan sonra önbelleğe alınmış DNS girdilerini temizlemek için yazıcıyı yeniden başlatın.

### Eski HP Yazıcılar (2020 Öncesi Modeller) {#legacy-hp-printers-pre-2020-models}

LaserJet Pro MFP M277 ve benzeri modeller dahil eski HP yazıcılar genellikle yalnızca TLS 1.0 destekler ve modern e-posta sağlayıcılarıyla çalışmak için özel yapılandırma gerektirir. Bu cihazlar, standart SMTP portlarına bağlanmaya çalışırken sık sık "TLS sertifika doğrulaması başarısız oldu" hataları gösterir.

1. **Yazıcının Gömülü Web Sunucusuna erişin**: Yazıcının IP adresini bir web tarayıcısına girin. Eski HP yazıcılar tam işlevsellik için Internet Explorer veya uyumluluk modu gerektirebilir.

2. **Ağ veya Sistem ayarlarına gidin** ve "E-posta" veya "SMTP" yapılandırma bölümünü bulun. Tam konum model ve firmware sürümüne göre değişir.

3. **Forward Email'in eski SMTP ayarlarını yapılandırın**: Sunucu adresi olarak smtp.forwardemail.net girin. Bu çok önemlidir - standart portlar yerine SSL/TLS bağlantıları için 2455 portunu veya STARTTLS bağlantıları için 2555 portunu kullanın.

4. **Kimlik doğrulamayı ayarlayın**: SMTP kimlik doğrulamayı etkinleştirin ve kullanıcı adı olarak Forward Email takma adınızı girin. Kimlik doğrulama için oluşturduğunuz Forward Email şifresini kullanın.

5. **Şifreleme ayarlarını dikkatlice yapılandırın**: 2455 portunu kullanıyorsanız "SSL/TLS"yi, 2555 portunu kullanıyorsanız "STARTTLS"yi seçin. Bazı eski HP yazıcılar bu seçenekleri farklı adlandırabilir.
6. **Gönderen ve alıcı bilgilerini ayarlayın**; Forward Email takma adınızı gönderen adresi olarak kullanarak ve bildirimler için uygun alıcı adreslerini yapılandırarak.

7. **Yazıcının test fonksiyonunu kullanarak yapılandırmayı test edin.** Test sertifika hatalarıyla başarısız olursa, standart SMTP portları yerine doğru eski portları (2455 veya 2555) kullandığınızdan emin olun.

> \[!CAUTION]
> Eski HP yazıcılar, TLS uyumluluk sorunlarını gideren firmware güncellemelerini almayabilir. Yapılandırma başarısız olmaya devam ederse, ara çözüm olarak yerel bir SMTP relay sunucusu kullanmayı düşünün.


## Canon Yazıcı E-posta Yapılandırması {#canon-printer-email-configuration}

Canon yazıcılar, imageRUNNER, PIXMA ve MAXIFY ürün serileri genelinde güçlü e-posta bildirim özellikleri sunar. Modern Canon cihazları kapsamlı TLS yapılandırmalarını desteklerken, eski modeller mevcut e-posta sağlayıcılarıyla çalışmak için belirli uyumluluk ayarları gerektirebilir.

### Güncel Canon Yazıcılar {#current-canon-printers}

Modern Canon yazıcılar, Remote UI web arayüzü üzerinden temel durum uyarılarından ayrıntılı cihaz yönetimi bildirimlerine kadar geniş e-posta bildirim özellikleri sağlar.

1. **Remote UI'ya erişin**; yazıcının IP adresini bir web tarayıcısına girin. Canon yazıcılar genellikle tüm ağ yapılandırma görevleri için web tabanlı bir arayüz kullanır.

2. **Ayarlar/Kayıt bölümüne gidin** ve menüden "Cihaz Yönetimi"ni seçin. Yazıcı modelinize bağlı olarak "E-Posta Bildirim Ayarları" veya benzeri seçenekleri arayın.

3. **SMTP sunucusunu yapılandırın**; "Hedef Ekle"ye tıklayın ve sunucu adresi olarak smtp.forwardemail.net girin. Şifreleme yöntemi olarak "SSL" veya "TLS"yi seçin.

4. **Port numarasını ayarlayın**; SSL/TLS bağlantıları için 465 (önerilen) veya STARTTLS bağlantıları için 587 olarak belirleyin. Canon yazıcılar arayüzlerinde bu şifreleme yöntemlerini açıkça ayırır.

5. **Kimlik doğrulamayı yapılandırın**; SMTP kimlik doğrulamayı etkinleştirin ve kullanıcı adı olarak Forward Email takma adınızı girin. Şifreyi [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) üzerinden oluşturduğunuz şifreyi kullanın.

6. **Gönderen bilgilerini ayarlayın**; Forward Email takma adınızı gönderen adresi olarak girin ve bildirimlerin kolay tanımlanması için açıklayıcı bir görüntüleme adı yapılandırın.

7. **Bildirim türlerini yapılandırın**; hangi olayların e-posta uyarısı tetikleyeceğini seçin. Canon yazıcılar, hata durumları, bakım uyarıları ve güvenlik olayları dahil olmak üzere bildirim türleri üzerinde ayrıntılı kontrol sağlar.

8. **E-posta yapılandırmasını test edin**; Canon’un yerleşik test fonksiyonunu kullanarak. Yazıcı, doğru yapılandırma ve bağlantıyı doğrulamak için test bildirimi gönderecektir.

> \[!NOTE]
> Canon yazıcılar, yapılandırma sorunlarını gidermeye yardımcı olabilecek ayrıntılı hata mesajları sağlar. Daha hızlı sorun çözümü için belirli hata kodlarına dikkat edin.

### Eski Canon Yazıcılar {#legacy-canon-printers}

Eski Canon yazıcılar sınırlı TLS desteğine sahip olabilir ve modern e-posta sağlayıcılarıyla çalışmak için dikkatli yapılandırma gerektirir. Bu cihazlar genellikle e-posta bildirim işlevselliğini sürdürmek için eski uyumlu SMTP ayarlarına ihtiyaç duyar.

1. **Yazıcının web arayüzüne erişin**; cihazın IP adresini kullanarak. Eski Canon yazıcılar tam işlevsellik için belirli tarayıcı uyumluluk ayarları gerektirebilir.

2. **E-posta yapılandırma bölümüne gidin**; cihaz yönetimi veya ağ ayarları menüsü üzerinden. Tam yol model ve firmware sürümüne göre değişir.

3. **Forward Email’in eski SMTP ayarlarını yapılandırın**; sunucu adresi olarak smtp.forwardemail.net girin ve SSL bağlantıları için 2455 portunu veya STARTTLS bağlantıları için 2555 portunu kullanın.

4. **Kimlik doğrulamayı dikkatlice yapılandırın**; SMTP kimlik doğrulamayı etkinleştirin ve Forward Email takma adınızı ve oluşturduğunuz şifreyi kullanın. Eski Canon yazıcıların özel kimlik doğrulama gereksinimleri olabilir.

5. **Şifreleme ayarlarını yapılandırın**; seçilen port için uygun TLS seçeneğini belirleyin. Şifreleme yönteminin port yapılandırmasıyla eşleştiğinden emin olun (2455 için SSL, 2555 için STARTTLS).
6. **Yapılandırmayı test edin** ve sertifika doğrulama hatalarını izleyin. Sorunlar devam ederse, standart SMTP portları yerine Forward Email'in eski uyumlu portlarını kullandığınızdan emin olun.

> \[!WARNING]
> Bazı eski Canon yazıcılar sunucu sertifikası doğrulamasını desteklemeyebilir. Bu durum güvenliği azaltırken, eski cihazlarda e-posta işlevselliğinin devamı için gerekli olabilir.


## Brother Yazıcı E-posta Yapılandırması {#brother-printer-email-configuration}

Brother yazıcılar, özellikle MFC ve DCP serileri, kapsamlı tarama-e-posta ve bildirim özellikleri sunar. Ancak, birçok kullanıcı özellikle Office 365 ve eski kimlik doğrulama yöntemlerini kullanımdan kaldıran diğer modern e-posta sağlayıcıları ile e-posta işlevselliği kurarken yapılandırma zorlukları bildirmektedir.

### Brother MFC Serisi Yapılandırması {#brother-mfc-series-configuration}

Brother çok işlevli yazıcılar geniş e-posta yetenekleri sunar, ancak mevcut çeşitli kimlik doğrulama ve şifreleme seçenekleri nedeniyle yapılandırma karmaşık olabilir.

1. **Yazıcının web arayüzüne erişin** yazıcının IP adresini bir web tarayıcısına girerek. Brother yazıcılar kapsamlı web tabanlı bir yapılandırma sistemi sağlar.

2. **Ağ ayarlarına gidin** ve yazıcı modelinize bağlı olarak "Email/IFAX" veya "Scan to Email" seçeneğini seçin. Bazı Brother yazıcılar bu ayarları "Yönetici Ayarları" altında düzenler.

3. **SMTP sunucu ayarlarını yapılandırın** sunucu adresi olarak smtp.forwardemail.net girerek. Brother yazıcılar hem SSL/TLS hem de STARTTLS şifreleme yöntemlerini destekler.

4. **Uygun port ve şifrelemeyi ayarlayın** port 465'i SSL/TLS şifrelemesi ile (önerilen) veya port 587'yi STARTTLS şifrelemesi ile seçerek. Brother yazıcılar bu seçenekleri arayüzlerinde açıkça belirtir.

5. **SMTP kimlik doğrulamayı yapılandırın** kimlik doğrulamayı etkinleştirerek ve kullanıcı adı olarak Forward Email takma adınızı girerek. Şifre olarak [Hesabım -> Alan Adları -> Takma Adlar](https://forwardemail.net/my-account/domains) sayfasından oluşturulan şifreyi kullanın.

6. **Gönderen bilgilerini ayarlayın** Forward Email takma adınızı gönderen adresi olarak yapılandırın ve e-posta bildirimlerinde yazıcıyı tanımlamak için açıklayıcı bir isim ekleyin.

7. **Tarama-e-posta ayarlarını yapılandırın** adres defteri girdileri ve varsayılan tarama ayarlarını kurarak. Brother yazıcılar tarama parametreleri ve alıcı yönetimi konusunda geniş özelleştirme imkanı sunar.

8. **Hem e-posta bildirimlerini hem de tarama-e-posta işlevselliğini test edin** tam yapılandırmayı sağlamak için. Brother yazıcılar farklı e-posta özellikleri için ayrı test fonksiyonları sağlar.

> \[!TIP]
> Brother yazıcılar e-posta yapılandırma sorunlarını çözmek için genellikle firmware güncellemeleri gerektirir. Bağlantı sorunlarını gidermeden önce mevcut güncellemeleri kontrol edin.

### Brother E-posta Sorun Giderme {#troubleshooting-brother-email-issues}

Brother yazıcılar sıkça belirli yapılandırma sorunlarıyla karşılaşır ve bunlar hedefe yönelik sorun giderme yöntemleriyle çözülebilir.

Brother yazıcınız e-posta yapılandırmasını test ederken "Kimlik Doğrulama Başarısız" hatası veriyorsa, kullanıcı adı olarak Forward Email takma adınızı (hesap e-postanızı değil) ve [Hesabım -> Alan Adları -> Takma Adlar](https://forwardemail.net/my-account/domains) sayfasından oluşturulan şifreyi kullandığınızdan emin olun. Brother yazıcılar kimlik doğrulama kimlik bilgisi biçimlendirmesine karşı özellikle hassastır.

Tarama-e-posta yapılandırma ayarlarını kabul etmeyen yazıcılar için, ayarları yazıcının kontrol paneli yerine web arayüzü üzerinden yapılandırmayı deneyin. Web arayüzü genellikle daha ayrıntılı hata mesajları ve yapılandırma seçenekleri sunar.

SSL/TLS bağlantı hatalarıyla karşılaşırsanız, doğru port ve şifreleme kombinasyonunu kullandığınızdan emin olun. Brother yazıcılar port numaraları ile şifreleme yöntemleri arasında tam eşleşme gerektirir - port 465 SSL/TLS (önerilen) kullanmalı, port 587 ise STARTTLS kullanmalıdır.

> \[!CAUTION]
> Bazı Brother yazıcı modellerinde belirli SMTP sunucu yapılandırmaları ile ilgili bilinen sorunlar vardır. Standart yapılandırma başarısız olursa, model özel çözümler için Brother destek dokümantasyonuna başvurun.
## Foscam IP Kamera E-posta Yapılandırması {#foscam-ip-camera-email-configuration}

Foscam IP kameralar, yaygın olarak eski TLS protokollerini kullanmaları ve sınırlı firmware güncelleme imkanı nedeniyle e-posta yapılandırması açısından en zorlu cihaz kategorilerinden biridir. R2 serisi gibi popüler modeller de dahil olmak üzere çoğu Foscam kamera yalnızca TLS 1.0'ı destekler ve modern şifreleme standartlarını destekleyecek şekilde güncellenemez.

### Foscam E-posta Sınırlamalarını Anlamak {#understanding-foscam-email-limitations}

Foscam kameralar, belirli yapılandırma yaklaşımları gerektiren benzersiz zorluklar sunar. En sık karşılaşılan hata mesajı "TLS certificate verification failed: unable to get local issuer certificate" olup, bu mesaj kameranın çoğu e-posta sağlayıcısı tarafından kullanılan modern SSL sertifikalarını doğrulayamadığını gösterir.

Bu sorun birkaç faktörden kaynaklanır: güncellenemeyen eski sertifika depoları, TLS 1.0 ile sınırlı TLS protokol desteği ve güvenlik protokolü yükseltmelerini engelleyen firmware kısıtlamaları. Ayrıca, birçok Foscam modeli kullanım ömrünün sonuna ulaşmış olup, bu uyumluluk sorunlarını giderebilecek firmware güncellemeleri artık almamaktadır.

Forward Email'in eski SMTP portları, TLS 1.0 uyumluluğunu korurken bu eski cihazlar için mümkün olan en yüksek güvenliği sağlayarak bu sınırlamaları özel olarak ele alır.

### Foscam E-posta Yapılandırma Adımları {#foscam-email-configuration-steps}

Foscam kameralarında e-posta bildirimlerini yapılandırmak, cihazların TLS sınırlamalarını aşmak için port seçimi ve şifreleme ayarlarına dikkat etmeyi gerektirir.

1. **Kameranın web arayüzüne erişin**: Kameranın IP adresini bir web tarayıcısına girin. Foscam kameralar genellikle web erişimi için 88 numaralı portu kullanır (örneğin, <http://192.168.1.100:88>).

2. **Ayarlar menüsüne gidin** ve kamera modelinize bağlı olarak "Mail Service" veya "Email Settings" seçeneğini seçin. Bazı Foscam kameralar bu ayarları "Alarm" > "Mail Service" altında organize eder.

3. **SMTP sunucusunu yapılandırın**: Sunucu adresi olarak smtp.forwardemail.net girin. Bu kritik bir adımdır - standart e-posta sağlayıcılarının SMTP sunucularını kullanmayın çünkü artık TLS 1.0'ı desteklememektedirler.

4. **Port ve şifrelemeyi ayarlayın**: SSL şifreleme için 2455 portunu veya STARTTLS şifreleme için 2555 portunu seçin. Bunlar, Foscam kameralar gibi cihazlar için özel olarak tasarlanmış Forward Email'in eski uyumlu portlarıdır.

5. **Kimlik doğrulamayı yapılandırın**: SMTP kimlik doğrulamayı etkinleştirin ve kullanıcı adı olarak Forward Email takma adınızı girin. Şifreyi [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) üzerinden oluşturulan şifreyi kullanın.

6. **Gönderen ve alıcı bilgilerini ayarlayın**: Gönderen adresi olarak Forward Email takma adınızı yapılandırın ve hareket algılama ile sistem uyarıları için alıcı adresleri ekleyin.

7. **Bildirim tetikleyicilerini yapılandırın**: Hareket algılama hassasiyeti, kayıt programları ve e-posta bildirimlerini tetiklemesi gereken diğer olayları ayarlayın.

8. **E-posta yapılandırmasını test edin**: Foscam'ın yerleşik test fonksiyonunu kullanarak testi gerçekleştirin. Test başarılı olursa, doğru yapılandırmayı onaylayan bir test e-postası almanız gerekir.

> \[!IMPORTANT]
> Foscam kameralar TLS 1.0 sınırlamaları nedeniyle Forward Email'in eski portlarını (2455 veya 2555) gerektirir. Standart SMTP portları bu cihazlarla çalışmaz.

### Gelişmiş Foscam Yapılandırması {#advanced-foscam-configuration}

Daha gelişmiş bildirim ayarları gerektiren kullanıcılar için, Foscam kameralar güvenlik izleme yeteneklerini artırabilecek ek yapılandırma seçenekleri sunar.

Bildirimleri tetikleyecek kamera görüş alanının belirli bölgelerini tanımlayarak yanlış alarmları azaltmak için hareket algılama bölgelerini yapılandırın. Bu, hareket eden ağaçlar veya geçen araçlar gibi çevresel faktörlerden kaynaklanan gereksiz e-postaların önüne geçer.

İzleme ihtiyaçlarınıza uygun kayıt programları ayarlayarak, e-posta bildirimlerinin uygun zaman dilimlerinde gönderilmesini sağlayın. Foscam kameralar, kritik olmayan olaylar için gece boyunca bildirimleri engelleyebilir.
Farklı türde uyarılar için birden fazla alıcı adresi yapılandırarak, hareket algılama uyarılarını güvenlik personeline yönlendirirken sistem bakım uyarılarını BT personeline gönderebilirsiniz.

> \[!TIP]
> Foscam kameralar, hareket algılama çok hassassa önemli miktarda e-posta oluşturabilir. Çevrenizin özelliklerine göre ayarlamalar yaparak muhafazakar ayarlarla başlayın.


## Hikvision Güvenlik Kamerası E-posta Yapılandırması {#hikvision-security-camera-email-configuration}

Hikvision kameralar, temel IP kameralardan gelişmiş yapay zeka destekli gözetim sistemlerine kadar modelleriyle küresel güvenlik kamerası pazarının önemli bir bölümünü temsil eder. E-posta yapılandırma süreci, modern TLS desteği olan yeni modeller ile uyumluluk çözümleri gerektiren eski cihazlar arasında önemli ölçüde farklılık gösterir.

### Modern Hikvision Kamera Yapılandırması {#modern-hikvision-camera-configuration}

Güncel firmware sürümleriyle çalışan mevcut Hikvision kameralar TLS 1.2+ desteği sunar ve web tabanlı arayüzleri üzerinden kapsamlı e-posta bildirim özellikleri sağlar.

1. **Kameranın web arayüzüne erişin**; kamera IP adresini bir web tarayıcısına girin. Hikvision kameralar genellikle web erişimi için standart HTTP/HTTPS portlarını kullanır.

2. **Yapılandırma bölümüne gidin** ve menü yapısından "Ağ" > "Gelişmiş Ayarlar" > "E-posta" seçeneklerini seçin. Kesin yol, kamera modelinize ve firmware sürümünüze bağlı olarak değişebilir.

3. **SMTP sunucusunu yapılandırın**; sunucu adresi olarak smtp.forwardemail.net girin. Hikvision kameralar, doğru e-posta işlevselliği için özel SSL yapılandırması gerektirir.

4. **Şifrelemeyi SSL olarak ayarlayın** ve port 465'i yapılandırın. Hikvision kameralar STARTTLS desteklemez, bu nedenle Forward Email uyumluluğu için port 465 üzerinde SSL şifrelemesi önerilen yapılandırmadır.

5. **SMTP kimlik doğrulamayı etkinleştirin** ve kullanıcı adı olarak Forward Email takma adınızı girin. Kimlik doğrulama için [Hesabım -> Alan Adları -> Takma Adlar](https://forwardemail.net/my-account/domains) bölümünden oluşturulan şifreyi kullanın.

6. **Gönderen bilgilerini yapılandırın**; Forward Email takma adınızı gönderen adresi olarak ayarlayın ve e-posta bildirimlerinde kamerayı tanımlamak için açıklayıcı bir isim ekleyin.

7. **Alıcı adreslerini ayarlayın**; güvenlik uyarılarını, hareket algılama bildirimlerini ve sistem durumu güncellemelerini alacak e-posta adreslerini ekleyin.

8. **Olay tetikleyicilerini yapılandırın**; hareket algılama, çizgi geçiş algılama, izinsiz giriş algılama ve e-posta bildirimleri oluşturması gereken diğer olayları ayarlayın.

9. **E-posta yapılandırmasını test edin**; Forward Email sunucularıyla doğru bağlantı ve kimlik doğrulamayı doğrulamak için Hikvision’un yerleşik test işlevini kullanın.

> \[!NOTE]
> Hikvision kameraların SSL ve TLS şifrelemesini düzgün desteklemesi için en güncel firmware sürümlerine sahip olması gerekir. E-posta ayarlarını yapılandırmadan önce firmware güncellemelerini kontrol edin.

### Eski Hikvision Kamera Yapılandırması {#legacy-hikvision-camera-configuration}

Eski Hikvision kameralar sınırlı TLS desteğine sahip olabilir ve e-posta işlevselliğinin devamı için Forward Email’in eski uyumlu SMTP portlarını kullanması gerekebilir.

1. **Kameranın web arayüzüne erişin** ve e-posta yapılandırma bölümüne gidin. Eski Hikvision kameraların menü yapısı mevcut modellerden farklı olabilir.

2. **Forward Email’in eski SMTP ayarlarını yapılandırın**; sunucu adresi olarak smtp.forwardemail.net girin ve SSL bağlantıları için port 2455’i kullanın.

3. **Kimlik doğrulamayı ayarlayın**; Forward Email takma adınızı ve oluşturulan şifreyi kullanın. Eski Hikvision kameralar belirli kimlik doğrulama gereksinimleri veya sınırlamalarına sahip olabilir.

4. **Şifreleme ayarlarını yapılandırın**; eski port yapılandırmasına uygun olarak SSL şifrelemesini seçin. Şifreleme yöntemi port 2455 gereksinimleriyle uyumlu olmalıdır.

5. **Yapılandırmayı test edin** ve bağlantı hatalarını izleyin. Eski Hikvision kameralar sınırlı hata raporlama sağlayabilir, bu da sorun gidermeyi zorlaştırabilir.

> \[!WARNING]
> Eski Hikvision kameraların bilinen güvenlik açıkları olabilir. Bu cihazların ağınızda uygun şekilde izole edildiğinden emin olun ve mümkün olduğunda güncel modellere yükseltmeyi düşünün.
## Dahua Güvenlik Kamerası E-posta Yapılandırması {#dahua-security-camera-email-configuration}

Dahua kameralar, temel IP kameralardan gelişmiş yapay zeka destekli gözetim sistemlerine kadar geniş ürün yelpazesinde güçlü e-posta bildirim yetenekleri sunar. Yapılandırma süreci, modern cihazlar için genellikle basittir ve mevcut TLS standartları için kapsamlı destek sağlar.

### Dahua Kamera E-posta Kurulumu {#dahua-camera-email-setup}

Dahua kameralar, web arayüzü üzerinden kullanıcı dostu e-posta yapılandırması sunar ve modern SMTP standartlarıyla iyi uyumludur.

1. **Kameranın web arayüzüne erişin** kameranın IP adresini bir web tarayıcısına girerek. Dahua kameralar genellikle sezgisel web tabanlı yapılandırma sistemleri sağlar.

2. **Setup (Kurulum)** menüsüne gidin ve yapılandırma menüsünden "Network" > "Email" seçeneğini seçin. Dahua kameralar, e-posta ayarlarını kolay erişim için özel bir bölümde düzenler.

3. **SMTP sunucusunu yapılandırın** sunucu adresi olarak smtp.forwardemail.net girin. Dahua kameralar hem SSL hem de STARTTLS şifreleme yöntemlerini destekler.

4. **Port ve şifrelemeyi ayarlayın** önerilen SSL/TLS şifrelemesi ile 465 portunu veya STARTTLS şifrelemesi ile 587 portunu seçin.

5. **SMTP kimlik doğrulamayı etkinleştirin** ve kullanıcı adı olarak Forward Email takma adınızı girin. Şifreyi [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) sayfasından oluşturabilirsiniz.

6. **Gönderen bilgilerini yapılandırın** gönderen adresi olarak Forward Email takma adınızı ayarlayın ve kamera kaynağını tanımlamak için açıklayıcı bir isim ekleyin.

7. **Alıcı adreslerini ayarlayın** farklı bildirim türleri için e-posta adresleri ekleyin. Dahua kameralar çeşitli uyarı türleri için birden fazla alıcıyı destekler.

8. **Olay tetikleyicilerini yapılandırın** hareket algılama, müdahale uyarıları ve e-posta bildirimleri oluşturması gereken diğer güvenlik olaylarını ayarlayın.

9. **E-posta işlevselliğini test edin** Dahua'nın yerleşik test özelliğini kullanarak doğru yapılandırma ve bağlantıyı doğrulayın.

> \[!TIP]
> Dahua kameralar genellikle wiki dokümantasyonları aracılığıyla ayrıntılı yapılandırma rehberleri sunar. Modele özel talimatlar için [Dahua'nın e-posta kurulum rehberine](https://dahuawiki.com/Email/Email_Notifications_Setup_GMail) bakın.

### Dahua NVR E-posta Yapılandırması {#dahua-nvr-email-configuration}

Dahua Ağ Video Kaydedicileri (NVR), birden fazla kamera için merkezi e-posta bildirim yönetimi sağlar ve büyük gözetim sistemlerinin verimli yönetimini sunar.

1. **NVR'nin web arayüzüne erişin** NVR'nin IP adresini bir web tarayıcısına girerek. Dahua NVR'ler sistem genelinde yapılandırma için kapsamlı yönetim arayüzleri sağlar.

2. **E-posta yapılandırmasına gidin** ana menüden "Setup" > "Network" > "Email" seçeneğini seçin. NVR'ler genellikle e-posta ayarlarını sistem düzeyinde organize eder.

3. **SMTP sunucu ayarlarını yapılandırın** sunucu adresi olarak smtp.forwardemail.net girin ve önerilen SSL/TLS şifrelemesi ile 465 portunu veya STARTTLS ile 587 portunu seçin.

4. **Kimlik doğrulamayı ayarlayın** Forward Email takma adınızı ve oluşturulan şifrenizi kullanarak. NVR'ler standart SMTP kimlik doğrulama yöntemlerini destekler.

5. **Bildirim zamanlamalarını yapılandırın** e-posta bildirimlerinin aktif olacağı zaman dilimlerini ayarlayın. Bu, mesai dışı saatlerde bildirim hacmini yönetmeye yardımcı olur.

6. **Olay tabanlı bildirimleri ayarlayın** hangi kamera olaylarının e-posta uyarısı tetikleyeceğini yapılandırın. NVR'ler, birden fazla kamera arasında bildirim tetikleyicileri üzerinde ayrıntılı kontrol sağlar.

7. **Sistem genelindeki e-posta yapılandırmasını test edin** bağlı tüm kameralar ve izleme sistemleri arasında doğru işlevselliği sağlamak için.

## Xerox Çok Fonksiyonlu Cihaz E-posta Yapılandırması {#xerox-multifunction-device-email-configuration}

Xerox çok fonksiyonlu cihazlar, kapsamlı TLS desteği ve gelişmiş yapılandırma seçenekleri ile kurumsal düzeyde e-posta bildirim yetenekleri sunar. Modern Xerox cihazları, çeşitli ağ ortamlarıyla uyumluluğu korurken mevcut güvenlik standartlarını destekler.

### Xerox MFD E-posta Kurulumu {#xerox-mfd-email-setup}

Xerox çok fonksiyonlu cihazlar, temel bildirimlerin yanı sıra gelişmiş iş akışı entegrasyonunu destekleyen web tabanlı yönetim arayüzü üzerinden sofistike e-posta yapılandırması sunar.
1. **Cihazın web arayüzüne erişin** cihazın IP adresini bir web tarayıcısına girerek. Xerox cihazları genellikle kapsamlı web tabanlı yönetim araçları sunar.

2. **Özellikler menüsüne gidin** ve yapılandırma menüsünden "Bağlantı" > "Protokoller" > "SMTP" seçeneklerini seçin. Xerox cihazları e-posta ayarlarını protokol yapılandırma bölümünde düzenler.

3. **SMTP sunucusunu yapılandırın** sunucu adresi olarak smtp.forwardemail.net girerek. Xerox cihazları yapılandırılabilir TLS sürümleri ve şifreleme yöntemlerini destekler.

4. **TLS yapılandırmasını ayarlayın** minimum desteklenen sürüm olarak TLS 1.2 veya daha yüksek bir sürümü seçerek. Xerox cihazları yöneticilerin gelişmiş güvenlik için belirli TLS gereksinimlerini yapılandırmasına olanak tanır.

5. **Port ve şifrelemeyi yapılandırın** SSL/TLS bağlantıları için 465 portunu (önerilen) veya STARTTLS bağlantıları için 587 portunu ayarlayarak.

6. **SMTP kimlik doğrulamasını ayarlayın** kimlik doğrulamayı etkinleştirerek ve kullanıcı adı olarak Forward Email takma adınızı girerek. Şifreyi [Hesabım -> Alan Adları -> Takma Adlar](https://forwardemail.net/my-account/domains) sayfasından oluşturulan şifreyi kullanın.

7. **Gönderen bilgilerini yapılandırın** gönderen adresi olarak Forward Email takma adınızı ayarlayarak ve bildirim yönetimi için uygun yanıt adreslerini yapılandırarak.

8. **Bildirim türlerini ayarlayın** bakım bildirimleri, hata durumları ve güvenlik olayları dahil olmak üzere hangi cihaz olaylarının e-posta uyarısı tetikleyeceğini yapılandırarak.

9. **E-posta yapılandırmasını test edin** doğru bağlantı ve kimlik doğrulamayı doğrulamak için Xerox’un kapsamlı test sistemini kullanarak.

> \[!NOTE]
> Xerox cihazları güvenlik ayarlarının ince ayarını yapmaya olanak tanıyan ayrıntılı TLS yapılandırma seçenekleri sunar. Gelişmiş güvenlik gereksinimleri için [Xerox’un TLS yapılandırma kılavuzuna](https://www.support.xerox.com/en-us/article/KB0032169) başvurun.


## Ricoh Çok Fonksiyonlu Cihaz E-posta Yapılandırması {#ricoh-multifunction-device-email-configuration}

Ricoh çok fonksiyonlu cihazları, temel ofis yazıcılarından gelişmiş üretim sistemlerine kadar geniş ürün yelpazesinde güçlü e-posta özellikleri sunar. Ancak, [Ricoh Microsoft’un temel kimlik doğrulama desteğini sonlandırmasıyla ilgili önemli değişiklikler duyurdu](https://www.ricoh.com/info/2025/0526_1) ve bu durum e-posta işlevselliğini etkiler.

### Modern Ricoh MFD Yapılandırması {#modern-ricoh-mfd-configuration}

Güncel Ricoh cihazları modern TLS standartlarını destekler ve web tabanlı arayüzleri aracılığıyla kapsamlı e-posta bildirim özellikleri sunar.

1. **Cihazın web arayüzüne erişin** cihazın IP adresini bir web tarayıcısına girerek. Ricoh cihazları sezgisel web tabanlı yapılandırma sistemleri sağlar.

2. **E-posta yapılandırmasına gidin** menü yapısından "Sistem Ayarları" > "Yönetici Araçları" > "Ağ" > "E-posta" seçeneklerini seçerek.

3. **SMTP sunucusunu yapılandırın** sunucu adresi olarak smtp.forwardemail.net girerek. Ricoh cihazları hem SSL hem de STARTTLS şifreleme yöntemlerini destekler.

4. **SMTP sunucu sayfasında SSL’i etkinleştirin** TLS şifrelemesini aktifleştirmek için. Ricoh arayüzü karmaşık olabilir, ancak güvenli e-posta işlevselliği için SSL etkinleştirilmelidir.

5. **Port numarasını ayarlayın** SSL/TLS bağlantıları için 465 (önerilen) veya STARTTLS bağlantıları için 587 olarak. Şifreleme yöntemi seçilen port ile uyumlu olmalıdır.

6. **SMTP kimlik doğrulamasını yapılandırın** kimlik doğrulamayı etkinleştirerek ve kullanıcı adı olarak Forward Email takma adınızı girerek. Şifreyi [Hesabım -> Alan Adları -> Takma Adlar](https://forwardemail.net/my-account/domains) sayfasından oluşturulan şifreyi kullanın.

7. **Gönderen bilgilerini ayarlayın** gönderen adresi olarak Forward Email takma adınızı yapılandırarak ve uygun tanımlama bilgilerini ekleyerek.

8. **Bildirim türlerini yapılandırın** tarama ile e-posta gönderme, cihaz uyarıları ve bakım bildirimlerini operasyonel gereksinimlerinize göre ayarlayarak.

9. **E-posta işlevselliğini test edin** doğru yapılandırma ve bağlantıyı doğrulamak için Ricoh’un yerleşik test sistemini kullanarak.

> \[!IMPORTANT]
> Microsoft’un temel kimlik doğrulama değişikliklerinden etkilenen Ricoh cihazları güncellenmiş kimlik doğrulama yöntemleri gerektirir. Cihazınızın yazılımının modern kimlik doğrulamayı desteklediğinden emin olun veya Forward Email’in uyumluluk özelliklerini kullanın.
### Legacy Ricoh Cihaz Yapılandırması {#legacy-ricoh-device-configuration}

Eski Ricoh cihazları, sınırlı TLS desteği ve kimlik doğrulama yöntemi kısıtlamaları nedeniyle Forward Email'in eski uyumlu SMTP portlarını gerektirebilir.

1. **Cihazın web arayüzüne erişin** ve e-posta yapılandırma bölümüne gidin. Eski Ricoh cihazlarının menü yapıları mevcut modellerden farklı olabilir.

2. **Forward Email'in eski SMTP ayarlarını yapılandırın**; sunucu adresi olarak smtp.forwardemail.net girin ve SSL bağlantıları için 2455 portunu kullanın.

3. **SSL şifrelemeyi etkinleştirin** ve eski port yapılandırmasıyla eşleşmesini sağlayın. Şifreleme ayarlarının 2455 portu gereksinimleriyle uyumlu olduğundan emin olun.

4. **Kimlik doğrulamayı ayarlayın**; Forward Email takma adınızı ve oluşturulan şifrenizi kullanın. Eski Ricoh cihazlarının belirli kimlik doğrulama kısıtlamaları olabilir.

5. **Yapılandırmayı test edin** ve kimlik doğrulama veya bağlantı hatalarını izleyin. Eski cihazlar sorun giderme için sınırlı hata raporlama sağlayabilir.


## Yaygın Yapılandırma Sorunlarının Giderilmesi {#troubleshooting-common-configuration-issues}

Cihaz e-posta yapılandırması, ağ ayarları, kimlik doğrulama sorunları veya protokol uyumluluğu zorlukları nedeniyle çeşitli sorunlarla karşılaşabilir. Yaygın problemleri ve çözümlerini anlamak, cihaz ekosisteminizde güvenilir bildirim teslimatını sağlamaya yardımcı olur.

### Kimlik Doğrulama ve Kimlik Bilgisi Sorunları {#authentication-and-credential-issues}

Kimlik doğrulama hataları, tüm cihaz türlerinde en yaygın e-posta yapılandırma sorunudur. Bu sorunlar genellikle yanlış kimlik bilgisi kullanımı, kimlik doğrulama yöntemi uyumsuzlukları veya hesap yapılandırma problemlerinden kaynaklanır.

Kullanıcı adı olarak Forward Email takma adınızı kullandığınızdan emin olun; hesap e-posta adresiniz veya giriş kimlik bilgileriniz değil. Birçok cihaz kullanıcı adı biçimine duyarlıdır ve yapılandırdığınız takma adla tam eşleşme gerektirir.

Hesap giriş şifreniz yerine [Hesabım -> Alan Adları -> Takma Adlar](https://forwardemail.net/my-account/domains) bölümünden oluşturulan şifreyi kullandığınızdan emin olun. SMTP kimlik doğrulaması güvenlik nedeniyle özel oluşturulan şifreyi gerektirir ve yanlış kimlik bilgileri kimlik doğrulama hatalarına yol açar.

Forward Email hesabınızda uygun SMTP erişiminin etkin olduğundan ve iki faktörlü kimlik doğrulama gereksinimlerinin doğru yapılandırıldığından emin olun. Bazı hesap yapılandırmaları, doğru etkinleştirilene kadar SMTP erişimini kısıtlayabilir.

> \[!TIP]
> Kimlik doğrulama hataları devam ederse, [Hesabım -> Alan Adları -> Takma Adlar](https://forwardemail.net/my-account/domains) bölümünden SMTP şifrenizi yeniden oluşturun ve cihaz yapılandırmanızı yeni kimlik bilgileriyle güncelleyin.

### TLS ve Şifreleme Sorunları {#tls-and-encryption-problems}

TLS ile ilgili sorunlar, cihazlar desteklenmeyen şifreleme protokollerini kullanmaya çalıştığında veya port yapılandırması ile şifreleme ayarları arasında uyumsuzluk olduğunda sıkça ortaya çıkar.

Modern cihazlarda TLS hataları yaşanıyorsa, doğru port ve şifreleme kombinasyonunu kullandığınızdan emin olun: port 465 ile SSL/TLS (önerilen) veya port 587 ile STARTTLS. Başarılı bağlantılar için bu ayarlar tam olarak eşleşmelidir.

Sertifika doğrulama hatası gösteren eski cihazlar, standart SMTP portları yerine Forward Email'in uyumluluk portları (2455 veya 2555) kullanılmalıdır. Bu portlar TLS 1.0 uyumluluğunu korurken eski cihazlar için uygun güvenlik sağlar.

Eski cihazlarda sertifika doğrulama hataları devam ederse, cihazın sertifika doğrulamasını devre dışı bırakmaya izin verip vermediğini kontrol edin. Bu güvenliği azaltır ancak güncellenemeyen cihazlarda işlevselliğin devamı için gerekebilir.

> \[!CAUTION]
> Sertifika doğrulamasını devre dışı bırakmak güvenliği azaltır ve yalnızca güncellenemeyen veya değiştirilemeyen eski cihazlar için son çare olarak kullanılmalıdır.

### Ağ Bağlantısı Sorunları {#network-connectivity-issues}

Ağla ilgili sorunlar, yapılandırma ayarları doğru olsa bile cihazların Forward Email'in SMTP sunucularına ulaşmasını engelleyebilir.

Ağınızın yapılandırılan SMTP portlarında dış bağlantılara izin verdiğini doğrulayın. Kurumsal güvenlik duvarları veya kısıtlayıcı ağ politikaları bazı portları engelleyebilir; bu durumda güvenlik duvarı kuralı ayarlarının değiştirilmesi veya alternatif port yapılandırmaları gerekebilir.
DNS çözümlemesini, cihazlarınızın smtp.forwardemail.net adresini doğru IP adreslerine çözümleyebildiğinden emin olarak kontrol edin. DNS sorunları, ağ bağlantısı işlevsel olsa bile bağlantı hatalarına neden olabilir.

Cihazın ağ tanılama araçları varsa, ağ bağlantısını test edin. Birçok modern cihaz, bağlantı sorunlarını belirlemeye yardımcı olan yerleşik ağ test yetenekleri sunar.

Cihazlar yavaş veya yüksek gecikmeli ağ bağlantılarında bulunuyorsa, ağ gecikmesi ve zaman aşımı ayarlarını göz önünde bulundurun. Bazı cihazlar, güvenilir e-posta teslimi için zaman aşımı ayarlarının değiştirilmesini gerektirebilir.

### Cihaza Özgü Yapılandırma Zorlukları {#device-specific-configuration-challenges}

Farklı cihaz üreticileri, e-posta işlevselliğini çeşitli şekillerde uygular; bu da hedefe yönelik çözümler gerektiren üreticiye özgü yapılandırma zorluklarına yol açar.

HP yazıcılar DNS sorgularını önbelleğe alabilir ve yapılandırma değişikliklerinden sonra yeniden başlatılmaları gerekebilir. Yapılandırmadan sonra bağlantı sorunları devam ederse, önbelleğe alınmış ağ bilgilerini temizlemek için yazıcıyı yeniden başlatın.

Brother yazıcılar kimlik doğrulama kimlik bilgisi biçimlendirmesine karşı özellikle hassastır ve güvenilir kurulum için cihaz kontrol paneli yerine web arayüzü üzerinden yapılandırma gerekebilir.

Foscam kameralar TLS sınırlamaları nedeniyle belirli port yapılandırmaları gerektirir ve sorun giderme için ayrıntılı hata mesajları sağlamayabilir. Bu cihazlar için Forward Email’in eski portları (2455 veya 2555) kullandığınızdan emin olun.

Hikvision kameralar SSL şifrelemesi gerektirir ve STARTTLS desteklemez; yapılandırma seçenekleri SSL/TLS şifrelemesi ile 465 portu ile sınırlıdır.

> \[!NOTE]
> Cihaza özgü sorunları giderirken, e-posta işlevselliğini etkileyebilecek bilinen sınırlamalar veya yapılandırma gereksinimleri için üreticinin belgelerine başvurun.


## Güvenlik Hususları ve En İyi Uygulamalar {#security-considerations-and-best-practices}

Ağ cihazlarında e-posta bildirimlerini yapılandırmak, sistemlerinizi korurken güvenilir bildirim teslimatını sürdürmeye yardımcı olan çeşitli güvenlik hususlarını içerir. Güvenlik en iyi uygulamalarını takip etmek, yetkisiz erişimi önler ve bildirimlerde uygun bilgi açıklamasını sağlar.

### Kimlik Bilgisi Yönetimi {#credential-management}

Forward Email hesabınız için güçlü, benzersiz parolalar kullanın ve mümkünse iki faktörlü kimlik doğrulamayı etkinleştirin. Oluşturulan SMTP parolası hassas bir kimlik bilgisi olarak kabul edilmeli ve cihaz yapılandırmalarında güvenli şekilde saklanmalıdır.

Özellikle personel değişiklikleri veya güvenlik olaylarından sonra SMTP parolalarını düzenli olarak gözden geçirin ve değiştirin. Forward Email, diğer hesap işlevlerini etkilemeden parola yenilemeye izin verir.

Mümkünse, birden fazla cihazda paylaşılan kimlik bilgisi kullanmaktan kaçının. Forward Email aynı kimlik bilgileriyle birden fazla cihaz bağlantısını desteklese de, bireysel cihaz kimlik bilgileri daha iyi güvenlik izolasyonu ve denetim yetenekleri sağlar.

Cihaz kimlik bilgilerini güvenli şekilde belgeleyin ve kuruluşunuzun kimlik bilgisi yönetim sistemine dahil edin. Doğru dokümantasyon, e-posta yapılandırmalarının gerektiğinde sürdürülmesini ve güncellenmesini sağlar.

### Ağ Güvenliği {#network-security}

E-posta bildirimleri ve meşru erişim için gerekli bağlantıyı sürdürürken, cihazları diğer ağ kaynaklarından izole etmek için uygun ağ segmentasyonu uygulayın.

Gerekli SMTP trafiğine izin verirken gereksiz ağ erişimini engellemek için güvenlik duvarı kuralları yapılandırın. Cihazların bildirim işlevselliği için genellikle yalnızca Forward Email’in SMTP sunucularına giden erişime ihtiyacı vardır.

Cihazlardan gelen ağ trafiğini izleyerek olağandışı desenleri veya yetkisiz iletişim girişimlerini tespit edin. Beklenmeyen ağ etkinliği, araştırılması gereken güvenlik sorunlarına işaret edebilir.

Ek güvenlik izolasyonu sağlamak için e-posta bildirimleri dahil cihaz yönetim trafiği için VLAN veya özel ağ segmentleri kullanmayı düşünün.

### Bilgi Açıklaması {#information-disclosure}

E-posta bildirimlerinin içeriğini gözden geçirerek, saldırganlar için faydalı olabilecek hassas bilgiler içermediğinden emin olun. Bazı cihazlar bildirim e-postalarında ayrıntılı sistem bilgileri, ağ yapılandırmaları veya dosya yolları içerebilir.
Bildirim filtrelemesini yapılandırarak e-posta uyarılarında dahil edilen bilgi türlerini sınırlayın. Birçok cihaz, faydalı bilgileri güvenlik gereksinimleriyle dengelemek için bildirim içeriğinin özelleştirilmesine izin verir.

Cihaz bildirimleri için uygun e-posta saklama ve işleme politikalarını uygulayın. Güvenlikle ilgili bildirimlerin uyumluluk veya adli amaçlar için saklanması gerekebilir.

Alıcı e-posta adreslerinin hassasiyetini göz önünde bulundurun ve bildirimlerin yalnızca bilgiye erişmesi gereken yetkili personele gönderildiğinden emin olun.

### İzleme ve Bakım {#monitoring-and-maintenance}

E-posta bildirim yapılandırmalarını düzenli olarak test ederek işlevselliğin devamını sağlayın. Periyodik testler, kritik uyarı teslimatını etkilemeden önce yapılandırma sapmalarını, ağ değişikliklerini veya hizmet sorunlarını tespit etmeye yardımcı olur.

Şüpheli etkinlik veya yetkisiz erişim girişimi belirtileri için e-posta bildirim desenlerini izleyin. Olağandışı bildirim hacimleri veya beklenmeyen sistem olayları güvenlik sorunlarına işaret edebilir.

Mevcut güvenlik standartlarını ve protokol desteğini sürdürmek için mümkün olduğunda cihaz yazılımını güncel tutun. Bazı cihazlar kullanım ömrünün sonuna ulaşmış olsa da, mevcut güvenlik güncellemelerinin uygulanması bilinen güvenlik açıklarına karşı koruma sağlar.

Mümkünse kritik uyarılar için yedek bildirim yöntemleri uygulayın. E-posta bildirimleri güvenilir olsa da, alternatif uyarı mekanizmalarının bulunması en önemli sistem olayları için yedeklilik sağlar.


## Sonuç {#conclusion}

Çeşitli cihaz ekosistemlerinde güvenilir e-posta bildirimleri yapılandırmak, TLS uyumluluğu, kimlik doğrulama yöntemleri ve üreticiye özgü gereksinimlerin karmaşık yapısını anlamayı gerektirir. Forward Email'in kapsamlı SMTP hizmeti, güncel cihazlar için modern güvenlik standartları ve güncellenemeyen eski ekipmanlar için eski uyumluluk sağlayarak bu zorlukları ele alır.

Bu kılavuzda açıklanan yapılandırma süreçleri, yöneticilerin belirli ekipman karışımlarına bakılmaksızın güvenilir e-posta bildirimleri kurmasını sağlamak için ana cihaz kategorileri için ayrıntılı, adım adım talimatlar sunar. Forward Email'in çift port stratejisi, milyonlarca kurulu cihazı etkileyen TLS uyumluluk krizine özel olarak çözüm getirerek güvenliği korurken işlevselliğin devamını sağlar.

E-posta bildirim yapılandırmalarının düzenli testi ve bakımı, devam eden güvenilirliği sağlar ve kritik uyarı teslimatını etkilemeden önce potansiyel sorunları tespit etmeye yardımcı olur. Bu kılavuzdaki güvenlik en iyi uygulamalarını ve sorun giderme rehberliğini takip etmek, yöneticilerin cihaz durumu ve güvenlik olayları hakkında bilgilendirildiği güvenli, güvenilir bildirim sistemlerinin sürdürülmesine yardımcı olur.

Karışık yazıcı ve kamera markalarına sahip küçük bir ofisi yönetiyor olun ya da yüzlerce cihazın bulunduğu kurumsal bir ortamı denetliyor olun, Forward Email güvenilir e-posta bildirimleri için gereken altyapı ve uyumluluğu sağlar. Hizmetimizin cihaz uyumluluğuna odaklanması, kapsamlı dokümantasyon ve destek ile birleşerek kritik sistem uyarılarının en çok ihtiyaç duyduğunuz anda size ulaşmasını garanti eder.

Cihaz e-posta yapılandırmasıyla ilgili ek destek veya Forward Email'in belirli ekipmanlarla uyumluluğu hakkında sorularınız için [SMTP sunucu yapılandırma SSS](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings) sayfamızı ziyaret edin veya destek ekibimizle iletişime geçin. Yaş veya üretici kısıtlamalarına bakılmaksızın, tüm ağ bağlantılı cihazlarınızda güvenilir e-posta bildirimlerini sürdürmenize yardımcı olmaya kararlıyız.
