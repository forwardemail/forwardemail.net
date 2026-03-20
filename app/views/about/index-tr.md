# Forward Email Hakkında {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email ekibi ve şirket hikayesi" class="rounded-lg" />

# Forward Email Hakkında {#about-forward-email-1}


## İçindekiler {#table-of-contents}

* [Genel Bakış](#overview)
* [Kurucu ve Misyon](#founder-and-mission)
* [Zaman Çizelgesi](#timeline)
  * [2017 - Kuruluş ve Lansman](#2017---founding-and-launch)
  * [2018 - Altyapı ve Entegrasyon](#2018---infrastructure-and-integration)
  * [2019 - Performans Devrimi](#2019---performance-revolution)
  * [2020 - Gizlilik ve Güvenlik Odaklılık](#2020---privacy-and-security-focus)
  * [2021 - Platform Modernizasyonu](#2021---platform-modernization)
  * [2023 - Altyapı ve Özellik Genişlemesi](#2023---infrastructure-and-feature-expansion)
  * [2024 - Hizmet Optimizasyonu ve Gelişmiş Özellikler](#2024---service-optimization-and-advanced-features)
  * [2025 - Gizlilik İyileştirmeleri ve Protokol Desteği {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - RFC Uyumluluğu ve Gelişmiş Filtreleme {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [Temel İlkeler](#core-principles)
* [Mevcut Durum](#current-status)


## Genel Bakış {#overview}

> \[!TIP]
> Mimari, güvenlik uygulamaları ve yol haritası hakkında teknik detaylar için [Teknik Beyaz Kitap](https://forwardemail.net/technical-whitepaper.pdf) sayfasına bakınız.

Forward Email, kullanıcının [gizlilik hakkı](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy") odaklı, [ücretsiz ve açık kaynaklı](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") bir [e-posta yönlendirme](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") servisidir. 2017'de basit bir e-posta yönlendirme çözümü olarak başlayan hizmet, sınırsız özel alan adı, sınırsız e-posta adresi ve takma ad, sınırsız tek kullanımlık e-posta adresleri, spam ve oltalama koruması, şifreli posta kutusu depolaması ve birçok gelişmiş özellik sunan kapsamlı bir e-posta platformuna dönüşmüştür.

Hizmet, orijinal kurucu tasarımcı ve geliştirici ekibi tarafından sürdürülmekte ve sahiplenilmektedir. %100 açık kaynak yazılım kullanılarak [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") ve [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP") teknolojileri ile inşa edilmiştir.


## Kurucu ve Misyon {#founder-and-mission}

Forward Email, 2017 yılında **Nicholas Baugh** tarafından kurulmuştur. [Forward Email Teknik Beyaz Kitap](https://forwardemail.net/technical-whitepaper.pdf)'a göre, Baugh başlangıçta yan projeleri için alan adlarında e-posta kullanımını etkinleştirmek amacıyla uygun maliyetli ve basit bir çözüm arıyordu. Mevcut seçenekleri araştırdıktan sonra kendi çözümünü kodlamaya başladı ve 2 Ekim 2017'de `forwardemail.net` alan adını satın aldı.

Forward Email'in misyonu sadece e-posta hizmeti sunmanın ötesindedir—sektörün e-posta gizliliği ve güvenliğine yaklaşımını dönüştürmeyi hedefler. Şirketin temel değerleri arasında şeffaflık, kullanıcı kontrolü ve sadece politika vaatleriyle değil, teknik uygulamalarla gizlilik koruması yer almaktadır.


## Zaman Çizelgesi {#timeline}

### 2017 - Kuruluş ve Lansman {#2017---founding-and-launch}

**2 Ekim 2017**: Nicholas Baugh, yan projeleri için uygun maliyetli e-posta çözümleri araştırdıktan sonra `forwardemail.net` alan adını satın aldı.

**5 Kasım 2017**: Baugh, herhangi bir özel alan adı için e-postaları yönlendirmek üzere 634 satırlık bir JavaScript dosyası oluşturdu ve bunu [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") kullanarak yazdı. Bu ilk uygulama açık kaynak olarak [GitHub](https://github.com/forwardemail)'da yayımlandı ve hizmet GitHub Pages üzerinden başlatıldı.
**Kasım 2017**: Forward Email, ilk sürümünün ardından resmi olarak başlatıldı. Erken versiyon tamamen DNS tabanlıydı ve hesap kaydı veya kayıt süreci yoktu—sadece talimatların yer aldığı Markdown ile yazılmış bir README dosyası vardı. Kullanıcılar, MX kayıtlarını `mx1.forwardemail.net` ve `mx2.forwardemail.net` adreslerine yönlendirerek ve `forward-email=user@gmail.com` içeren bir TXT kaydı ekleyerek e-posta yönlendirmeyi ayarlayabiliyordu.

Bu çözümün sadeliği ve etkinliği, Ruby on Rails'in yaratıcısı [David Heinemeier Hansson](https://dhh.dk) gibi önde gelen geliştiricilerin dikkatini çekti; kendisi günümüzde de `dhh.dk` alan adında Forward Email kullanmaya devam etmektedir.

### 2018 - Altyapı ve Entegrasyon {#2018---infrastructure-and-integration}

**Nisan 2018**: [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare"), [gizlilik odaklı tüketici DNS servisini](https://blog.cloudflare.com/announcing-1111/) başlattığında, Forward Email [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") yerine [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") kullanmaya başladı ve böylece şirketin gizlilik odaklı altyapı tercihlerine bağlılığını gösterdi.

**Ekim 2018**: Forward Email, kullanıcıların popüler e-posta sağlayıcıları olan [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") ve [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook") ile "Gönderilen Posta" olarak e-posta göndermesine izin vererek entegrasyon yeteneklerini genişletti.

### 2019 - Performans Devrimi {#2019---performance-revolution}

**Mayıs 2019**: Forward Email, ilk sürümlerden tamamen farklı olan v2 sürümünü yayınladı. Bu güncelleme, [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")'in [streams](https://en.wikipedia.org/wiki/Streams "Streams") özelliğini kullanarak [performans](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") iyileştirmelerine odaklandı ve platformun ölçeklenebilirliği için temel oluşturdu.

### 2020 - Gizlilik ve Güvenlik Odaklılık {#2020---privacy-and-security-focus}

**Şubat 2020**: Forward Email, kullanıcıların e-posta yönlendirme yapılandırma takma adlarıyla genel DNS kayıtlarını ayarlamayı kapatmasına olanak tanıyan Gelişmiş Gizlilik Koruma planını yayınladı. Bu plan sayesinde, bir kullanıcının e-posta takma adı bilgisi İnternet üzerinde genel olarak aranabilir olmaktan gizlenir. Şirket ayrıca, belirli takma adların etkinleştirilip devre dışı bırakılmasını sağlayan bir özellik yayınladı; bu takma adlar geçerli e-posta adresleri olarak görünmeye devam eder ve başarılı [SMTP durum kodları](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") döner, ancak e-postalar hemen atılır (bu, çıktının [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")'a yönlendirilmesine benzer).

**Nisan 2020**: Forward Email, gizlilik politikasına uymayan mevcut spam tespit çözümleriyle karşılaştığı sayısız engelin ardından, Spam Tarayıcı'nın ilk alfa sürümünü yayınladı. Bu tamamen ücretsiz ve açık kaynaklı [anti-spam filtreleme](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") çözümü, [Naive Bayes spam filtresi](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") yaklaşımını [anti-phishing](https://en.wikipedia.org/wiki/Phishing "Phishing") ve [IDN homograf saldırısı](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack") korumasıyla birleştirir. Forward Email ayrıca, gelişmiş hesap güvenliği için [tek kullanımlık şifreler](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) kullanan [iki faktörlü kimlik doğrulama](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) özelliğini yayınladı.

**Mayıs 2020**: Forward Email, kullanıcıların [ISS](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider") tarafından uygulanan port engellemelerini aşabilmeleri için özel [port yönlendirmesine](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") izin verdi. Şirket ayrıca, tam dokümantasyon ve gerçek zamanlı istek ve yanıt örnekleriyle birlikte, webhooks desteği içeren [Ücretsiz E-posta Yönlendirme RESTful API'sini](email-api) yayınladı.
**Ağustos 2020**: Forward Email, e-posta güvenliği ve teslimatını daha da güçlendiren [Authenticated Received Chain](arc) ("ARC") e-posta kimlik doğrulama sistemi için destek ekledi.

**23 Kasım 2020**: Forward Email, beta programından çıkarak halka açıldı ve platformun gelişiminde önemli bir dönüm noktasını işaret etti.

### 2021 - Platform Modernizasyonu {#2021---platform-modernization}

**Şubat 2021**: Forward Email, tüm [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)") bağımlılıklarını kaldırmak için kod tabanını yeniden düzenledi ve böylece yığını %100 [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") ve [Node.js](https://en.wikipedia.org/wiki/Node.js) haline getirdi. Bu mimari karar, şirketin tutarlı, açık kaynaklı bir teknoloji yığını sürdürme taahhüdü ile uyumluydu.

**27 Eylül 2021**: Forward Email, kullanıcıların daha gelişmiş e-posta yönlendirme yeteneklerine sahip olmalarını sağlayan [düzenli ifadeler](https://en.wikipedia.org/wiki/Regular_expression "Regular expression") ile eşleşen e-posta yönlendirme takma adları için [destek ekledi](email-forwarding-regex-pattern-filter).

### 2023 - Altyapı ve Özellik Genişletme {#2023---infrastructure-and-feature-expansion}

**Ocak 2023**: Forward Email, kullanıcı deneyimini ve performansı artıran yeniden tasarlanmış ve sayfa hızı optimize edilmiş bir web sitesi başlattı.

**Şubat 2023**: Şirket, [hata kayıtları](/faq#do-you-store-error-logs) desteği ekledi ve kullanıcı tercihleri ile erişilebilirlik ihtiyaçlarına yanıt olarak [karanlık mod](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) web sitesi renk şeması uyguladı.

**Mart 2023**: Forward Email, [Tangerine](https://github.com/forwardemail/tangerine#readme) sürümünü yayınladı ve altyapısına entegre etti; böylece uygulama katmanında [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") kullanımını mümkün kıldı. Şirket ayrıca [MTA-STS](/faq#do-you-support-mta-sts) desteği ekledi ve [hCaptcha](/) yerine [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile) geçiş yaptı.

**Nisan 2023**: Forward Email tamamen yeni bir altyapı uyguladı ve otomatikleştirdi. Hizmet, önceki round-robin DNS yaklaşımının yerine, sağlık kontrolleri ve yedekleme ile küresel yük dengeleme ve yakınlık tabanlı DNS üzerinde çalışmaya başladı; bu altyapı [Cloudflare](https://cloudflare.com) kullanılarak sağlandı. Şirket, SOC 2 Tip 1 uyumlu sağlayıcılar olan [Vultr](https://www.vultr.com/?ref=429848) ve [Digital Ocean](https://m.do.co/c/a7cecd27e071) dahil olmak üzere birden fazla sağlayıcıda **bare metal sunuculara** geçti. MongoDB ve Redis veritabanları, yüksek erişilebilirlik, uçtan uca SSL şifrelemesi, dinlenme halindeyken şifreleme ve zaman noktasına geri yükleme (PITR) için birincil ve yedek düğümlerle kümelenmiş konfigürasyonlara taşındı.

**Mayıs 2023**: Forward Email, [SMTP ile e-posta gönderme](/faq#do-you-support-sending-email-with-smtp) ve [API ile e-posta gönderme](/faq#do-you-support-sending-email-with-api) istekleri için **giden SMTP** özelliğini başlattı. Bu özellik, yüksek teslimat garantisi sağlamak için yerleşik korumalar, modern ve sağlam bir kuyruk ve yeniden deneme sistemi içerir ve [gerçek zamanlı hata kayıtlarını destekler](/faq#do-you-store-error-logs).

**Kasım 2023**: Forward Email, e-posta gizliliği ve güvenliğinde önemli bir ilerlemeyi temsil eden [**şifreli posta kutusu depolama**](/blog/docs/best-quantum-safe-encrypted-email-service) özelliğini [IMAP desteği](/faq#do-you-support-receiving-email-with-imap) için başlattı.

**Aralık 2023**: Şirket, [POP3](/faq#do-you-support-pop3) desteği, [passkeyler ve WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [gelen kutusuna ulaşma süresi](/faq#i) izleme ve [IMAP Depolama için OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) için destek ekledi.

### 2024 - Hizmet Optimizasyonu ve Gelişmiş Özellikler {#2024---service-optimization-and-advanced-features}

**Şubat 2024**: Forward Email, platformun yeteneklerini e-postanın ötesine genişleterek takvim senkronizasyonunu içeren [takvim (CalDAV) desteği](/faq#do-you-support-calendars-caldav) ekledi.
**Mart - Temmuz 2024**: Forward Email, hizmetlerini alternatiflerden daha hızlı veya en azından aynı hızda yapmak amacıyla IMAP, POP3 ve CalDAV servislerinde büyük optimizasyonlar ve iyileştirmeler yayınladı.

**Temmuz 2024**: Şirket, Apple Mail'in iOS'ta IMAP `IDLE` komutunu desteklememesi sorununu çözmek için [iOS Push desteği ekledi](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016), böylece Apple iOS cihazları için gerçek zamanlı bildirimler mümkün oldu. Forward Email ayrıca kendi hizmeti ve Yahoo/AOL için gelen kutusuna ulaşma süresi ("TTI") izleme ekledi ve kullanıcıların ücretsiz planda bile tüm DNS TXT kayıtlarını şifrelemelerine izin vermeye başladı. [Privacy Guides tartışmalarında](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) ve [GitHub sorunlarında](https://github.com/forwardemail/forwardemail.net/issues/254) talep edildiği üzere, şirket devre dışı bırakıldığında takma adların ya sessizce `250` reddetmesini, yumuşak reddetme `421` yapmasını ya da sert reddetme `550` yapmasını sağlayan özellik ekledi.

**Ağustos 2024**: Forward Email, posta kutularını mevcut [SQLite](https://en.wikipedia.org/wiki/SQLite) dışa aktarma formatına ek olarak [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) ve [Mbox](https://en.wikipedia.org/wiki/Mbox) formatlarında dışa aktarma desteği ekledi. [Webhook imza desteği eklendi](https://forwardemail.net/faq#do-you-support-bounce-webhooks) ve kullanıcıların çıkış SMTP hizmeti üzerinden bülten, duyuru ve e-posta pazarlaması göndermesine izin verilmeye başlandı. IMAP/POP3/CalDAV için alan adı genelinde ve takma adlara özel depolama kotaları da uygulandı.

### 2025 - Gizlilik İyileştirmeleri ve Protokol Desteği {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**Eylül 2024 - Ocak 2025**: Forward Email, zaten uygulanan şifreli posta kutusu depolama yeteneklerinin üzerine inşa ederek, çok talep edilen tatil yanıtlayıcı özelliği ve e-posta yönlendirme için OpenPGP/WKD şifrelemesi ekledi. ([detaylar](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254))

**21 Ocak 2025**: Kurucunun en iyi arkadaşı "Jack", sadık köpek dostu, neredeyse 11 yaşında huzur içinde vefat etti. Jack, Forward Email'in yaratılmasına destek olan sarsılmaz dostluğu nedeniyle [her zaman anılacak](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b). [Forward Email Teknik Beyaz Kitabı](https://forwardemail.net/technical-whitepaper.pdf) Jack'e adanmıştır ve hizmetin geliştirilmesindeki rolü kabul edilmiştir.

**Şubat 2025**: Forward Email, yeni birincil veri merkezi sağlayıcısı olarak [DataPacket](https://www.datapacket.com)'a geçti ve hizmet güvenilirliği ile hızını artırmak için özel, performans odaklı, çıplak metal donanım uyguladı.

**Mart 2025**: Forward Email'in 1.0 sürümü resmi olarak yayınlandı.

**Nisan 2025**: İlk [Forward Email Teknik Beyaz Kitabı](https://forwardemail.net/technical-whitepaper.pdf) yayımlandı ve şirket kripto para ödemelerini kabul etmeye başladı.

**Mayıs 2025**: Hizmet, [Scalar](https://github.com/scalar/scalar) kullanarak yeni API dokümantasyonu başlattı.

**Haziran 2025**: Forward Email, platformun yeteneklerini mevcut e-posta ve takvim hizmetlerine ek olarak kişi senkronizasyonunu da içerecek şekilde genişleten [CardDAV protokolü](/faq#do-you-support-contacts-carddav) desteğini başlattı.

**Ağustos 2025**: Platform, takvim etkinliklerine ek olarak görev yönetimini mümkün kılan [CalDAV VTODO/görev desteği](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\)) ekledi.

**Kasım 2025**: Platformun güvenliği, parola karma için PBKDF2'den [Argon2id](https://en.wikipedia.org/wiki/Argon2)'ye geçişle artırıldı ve altyapı Redis'ten [Valkey](https://github.com/valkey-io/valkey)'e taşındı.

**Aralık 2025**: 2.0 sürümü yayınlandı, e-posta taşıma için zorunlu TLS şifrelemesini sağlayan [REQUIRETLS (RFC 8689)](/rfc#requiretls-support) desteği getirildi ve [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) v6'ya yükseltildi.
### 2026 - RFC Uyumluluğu ve Gelişmiş Filtreleme {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**Ocak 2026**: Forward Email kapsamlı bir [RFC protokol uyumluluk belgesi](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) yayınladı ve [S/MIME şifreleme (RFC 8551)](/faq#do-you-support-smime-encryption) ile kapsamlı [Sieve e-posta filtreleme (RFC 5228)](/faq#do-you-support-sieve-email-filtering) ve [ManageSieve protokolü (RFC 5804)](/faq#do-you-support-sieve-email-filtering) desteği ekledi. REST API ayrıca 39 uç noktaya genişletildi.

**Şubat 2026**: Resmi, açık kaynaklı webmail istemcisi [mail.forwardemail.net](https://mail.forwardemail.net) adresinde kullanıma sunuldu ([GitHub’daki kaynak kodu](https://github.com/forwardemail/mail.forwardemail.net)). Platform ayrıca [CalDAV Planlama Uzantıları (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638), [DANE/TLSA (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities) ve 1 tıklamayla DNS kurulumu için [Domain Connect](https://domainconnect.org) desteği ekledi. IMAP, CalDAV ve CardDAV için gerçek zamanlı push bildirimleri WebSockets kullanılarak başlatıldı.

**Mart 2026**: Alan bazında özel S3 uyumlu depolama desteği eklendi ve yönetim için bir komut satırı aracı sunuldu. Aynı açık kaynaklı webmail kod tabanı kullanılarak macOS, Windows, Linux, iOS ve Android için çapraz platform masaüstü ve mobil uygulamalar üzerinde çalışma başladı; bu uygulamalar [Tauri](https://tauri.app) ile geliştiriliyor.


## Temel İlkeler {#core-principles}

Kuruluşundan bu yana Forward Email, gizlilik ve güvenlik ilkelerine sıkı bir bağlılık göstermiştir:

**%100 Açık Kaynak Felsefesi**: Sadece ön yüzlerini açık kaynak yapan ve arka uçlarını kapalı tutan rakiplerinin aksine, Forward Email tüm kod tabanını—hem ön yüz hem arka uç—[GitHub](https://github.com/forwardemail) üzerinde kamuya açık hale getirmiştir.

**Gizlilik Öncelikli Tasarım**: İlk günden itibaren, Forward Email e-postaları diske yazmayan benzersiz bir bellek içi işleme yaklaşımı uygulayarak, mesajları veritabanlarında veya dosya sistemlerinde depolayan geleneksel e-posta hizmetlerinden ayrışmıştır.

**Sürekli Yenilik**: Hizmet, basit bir e-posta yönlendirme çözümünden, şifreli posta kutuları, kuantum dirençli şifreleme ve SMTP, IMAP, POP3 ve CalDAV gibi standart protokolleri destekleyen kapsamlı bir e-posta platformuna dönüşmüştür.

**Şeffaflık**: Tüm kodun açık kaynak olarak erişilebilir olması, kullanıcıların gizlilik iddialarını pazarlama ifadelerine güvenmek yerine kendilerinin doğrulamasını sağlar.

**Kullanıcı Kontrolü**: Kullanıcılara, isterlerse tüm platformu kendi sunucularında barındırma seçeneği dahil olmak üzere çeşitli kontrol imkanları sunar.


## Mevcut Durum {#current-status}

Mart 2026 itibarıyla Forward Email, dünya çapında 500.000’den fazla alan adına hizmet vermekte olup, aşağıdaki önemli kuruluşlar ve sektör liderleri arasında yer almaktadır:

* **Teknoloji Şirketleri**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Medya Kuruluşları**: Fox News Radio, Disney Ad Sales
* **Eğitim Kurumları**: Cambridge Üniversitesi, Maryland Üniversitesi, Washington Üniversitesi, Tufts Üniversitesi, Swarthmore College
* **Devlet Kurumları**: Güney Avustralya Hükümeti, Dominik Cumhuriyeti Hükümeti
* **Diğer Kuruluşlar**: RCD Hotels, Fly<span>.</span>io
* **Önemli Geliştiriciler**: Isaac Z. Schlueter (npm yaratıcısı), David Heinemeier Hansson (Ruby on Rails yaratıcısı)

Platform, düzenli özellik güncellemeleri ve altyapı iyileştirmeleri ile gelişmeye devam etmekte olup, bugün mevcut olan tek %100 açık kaynak, şifreli, gizlilik odaklı, şeffaf ve kuantum dirençli e-posta hizmeti olarak konumunu korumaktadır.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email gizlilik odaklı e-posta hizmeti" class="rounded-lg" />
