# E-postayı İletme Hakkında {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# E-postayı İletme Hakkında {#about-forward-email-1}

## İçindekiler {#table-of-contents}

* [Genel Bakış](#overview)
* [Kurucu ve Misyon](#founder-and-mission)
* [Zaman çizelgesi](#timeline)
  * [2017 - Kuruluş ve Lansman](#2017---founding-and-launch)
  * [2018 - Altyapı ve Entegrasyon](#2018---infrastructure-and-integration)
  * [2019 - Performans Devrimi](#2019---performance-revolution)
  * [2020 - Gizlilik ve Güvenlik Odaklı](#2020---privacy-and-security-focus)
  * [2021 - Platform Modernizasyonu](#2021---platform-modernization)
  * [2023 - Altyapı ve Özellik Genişletmesi](#2023---infrastructure-and-feature-expansion)
  * [2024 - Hizmet Optimizasyonu ve Gelişmiş Özellikler](#2024---service-optimization-and-advanced-features)
  * [2025 - Sürekli Yenilik](#2025---continued-innovation)
* [Temel İlkeler](#core-principles)
* [Mevcut Durum](#current-status)

## Genel Bakış {#overview}

> \[!TIP]
> Mimarimiz, güvenlik uygulamalarımız ve yol haritamız hakkında teknik ayrıntılar için [Teknik Beyaz Bülten](https://forwardemail.net/technical-whitepaper.pdf)'e bakın.

E-posta Yönlendirme, kullanıcının [gizlilik hakkı](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy") adresine odaklanan bir [ücretsiz ve açık kaynaklı](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [e-posta yönlendirme](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") hizmetidir. 2017 yılında basit bir e-posta yönlendirme çözümü olarak başlayan bu hizmet, sınırsız özel alan adı, sınırsız e-posta adresi ve takma ad, sınırsız tek kullanımlık e-posta adresi, spam ve kimlik avı koruması, şifreli posta kutusu depolama alanı ve çok sayıda gelişmiş özellik sunan kapsamlı bir e-posta platformuna dönüşmüştür.

Hizmet, tasarımcı ve geliştiricilerden oluşan orijinal kurucu ekibi tarafından yönetilmekte ve sahiplenilmektedir. [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") ve [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP") kullanılarak %100 açık kaynaklı yazılımla oluşturulmuştur.

## Kurucusu ve Misyonu {#founder-and-mission}

Forward Email, **Nicholas Baugh** tarafından 2017 yılında kuruldu. [E-posta İletme Teknik Bilgi Belgesi](https://forwardemail.net/technical-whitepaper.pdf)'a göre, Baugh başlangıçta yan projeleri için alan adlarında e-postayı etkinleştirmek üzere uygun maliyetli ve basit bir çözüm arıyordu. Mevcut seçenekleri araştırdıktan sonra kendi çözümünü kodlamaya başladı ve 2 Ekim 2017'de `forwardemail.net` alan adını satın aldı.

Forward Email'in misyonu, e-posta hizmetleri sunmanın ötesine uzanıyor; sektörün e-posta gizliliği ve güvenliğine yaklaşımını dönüştürmeyi hedefliyor. Şirketin temel değerleri arasında şeffaflık, kullanıcı kontrolü ve yalnızca politika vaatleri yerine teknik uygulama yoluyla gizlilik koruması yer alıyor.

## Zaman Çizelgesi {#timeline}

### 2017 - Kuruluş ve Lansman {#2017---founding-and-launch}

**2 Ekim 2017**: Nicholas Baugh, yan projeleri için uygun maliyetli e-posta çözümleri araştırdıktan sonra `forwardemail.net` alan adını satın aldı.

**5 Kasım 2017**: Baugh, herhangi bir özel alan adına ait e-postaları iletmek için [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") kullanarak 634 satırlık bir JavaScript dosyası oluşturdu. Bu ilk uygulama, [GitHub](https://github.com/forwardemail)'de açık kaynaklı olarak yayınlandı ve hizmet GitHub Pages kullanılarak başlatıldı.

**Kasım 2017**: Forward Email, ilk sürümünden sonra resmen kullanıma sunuldu. İlk sürüm, herhangi bir hesap kaydı veya kayıt işlemi gerektirmeyen, tamamen DNS tabanlıydı; yalnızca Markdown dilinde yazılmış ve talimatlar içeren bir README dosyasıydı. Kullanıcılar, MX kayıtlarını `mx1.forwardemail.net` ve `mx2.forwardemail.net`'i işaret edecek şekilde yapılandırıp `forward-email=user@gmail.com` ile bir TXT kaydı ekleyerek e-posta yönlendirmeyi ayarlayabiliyordu.

Bu çözümün basitliği ve etkililiği, Ruby on Rails'in yaratıcısı [David Heinemeier Hansson](https://dhh.dk) da dahil olmak üzere önde gelen geliştiricilerin dikkatini çekti. __PROTECTED_LINK_98__, günümüzde de `dhh.dk` etki alanında E-postayı İlet özelliğini kullanmaya devam ediyor.

### 2018 - Altyapı ve Entegrasyon {#2018---infrastructure-and-integration}

**Nisan 2018**: [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare"), [gizlilik odaklı tüketici DNS hizmeti](https://blog.cloudflare.com/announcing-1111/)'i piyasaya sürdüğünde, Forward Email, [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System") aramalarını işlemek için [Açık DNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS")'den [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare")'e geçti ve bu, şirketin gizlilik odaklı altyapı seçimlerine olan bağlılığını gösterdi.

**Ekim 2018**: E-postayı İlet özelliği, kullanıcıların [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") ve [Görünüm](https://en.wikipedia.org/wiki/Outlook "Outlook") ile "Postaları Şu Şekilde Gönder" özelliğini kullanmalarına olanak tanıyarak popüler e-posta sağlayıcılarıyla entegrasyon yeteneklerini genişletti.

### 2019 - Performans Devrimi {#2019---performance-revolution}

**Mayıs 2019**: Forward Email, ilk sürümlere göre büyük bir yeniden yazmayı temsil eden v2 sürümünü yayınladı. Bu güncelleme, [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")'in [akarsular](https://en.wikipedia.org/wiki/Streams "Streams")'sinin kullanımıyla [performans](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") iyileştirmelerine odaklanarak platformun ölçeklenebilirliğinin temelini oluşturdu.

### 2020 - Gizlilik ve Güvenlik Odaklı {#2020---privacy-and-security-focus}

**Şubat 2020**: Forward Email, kullanıcıların e-posta yönlendirme yapılandırma takma adlarıyla genel DNS kayıt girişlerini devre dışı bırakmalarına olanak tanıyan Gelişmiş Gizlilik Koruması planını yayınladı. Bu plan sayesinde, bir kullanıcının e-posta takma adı bilgileri internette herkese açık olarak aranamaz hale geliyor. Şirket ayrıca, belirli takma adları etkinleştirip devre dışı bırakırken, geçerli e-posta adresleri olarak görünmelerine ve başarılı [SMTP durum kodları](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") döndürmelerine olanak tanıyan bir özellik yayınladı. Bu özellik, e-postaların hemen silinmesini sağlıyor ([/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device") çıktısına benzer şekilde).

**Nisan 2020**: Forward Email'in gizlilik politikasına uymayan mevcut spam tespit çözümlerinde sayısız engelle karşılaşan şirket, Spam Scanner'ın ilk alfa sürümünü yayınladı. Tamamen ücretsiz ve açık kaynaklı bu [anti-spam filtreleme](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") çözümü, [Naive Bayes spam filtresi](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") yaklaşımını [kimlik avı önleme](https://en.wikipedia.org/wiki/Phishing "Phishing") ve [IDN homograf saldırısı](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack") korumasıyla birleştiriyor. Forward Email ayrıca, gelişmiş hesap güvenliği için [tek seferlik şifreler](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) kullanan [iki faktörlü kimlik doğrulama](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) çözümünü de yayınladı.

**Mayıs 2020**: Forward E-posta, kullanıcıların [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider") port engellemelerini aşmaları için geçici bir çözüm olarak özel [port yönlendirme](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") kullanımına izin verdi. Şirket ayrıca, webhook desteğiyle birlikte eksiksiz dokümantasyon ve gerçek zamanlı istek ve yanıt örnekleriyle [Ücretsiz E-posta Yönlendirme RESTful API](email-api)'yi de yayınladı.

**Ağustos 2020**: Forward Email, [Kimliği Doğrulanmış Alınan Zincir](arc) ("ARC") e-posta kimlik doğrulama sistemi desteğini ekledi ve e-posta güvenliğini ve teslim edilebilirliğini daha da güçlendirdi.

**23 Kasım 2020**: Forward Email, beta programından kamuoyuna duyuruldu ve platformun gelişiminde önemli bir dönüm noktası yaşandı.

### 2021 - Platform Modernizasyonu {#2021---platform-modernization}

**Şubat 2021**: Forward Email, tüm [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programlama dili)") bağımlılıklarını kaldırarak kod tabanını yeniden düzenledi ve yığınlarının %100 [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") ve [Node.js](https://en.wikipedia.org/wiki/Node.js) olmasını sağladı. Bu mimari karar, şirketin tutarlı ve açık kaynaklı bir teknoloji yığınını koruma taahhüdüyle uyumluydu.

**27 Eylül 2021**: [eklenen destek](email-forwarding-regex-pattern-filter) e-postasını, [düzenli ifadeler](https://en.wikipedia.org/wiki/Regular_expression "Regular expression") ile eşleşecek şekilde e-posta yönlendirme takma adları için yönlendirin ve kullanıcılara daha gelişmiş e-posta yönlendirme yetenekleri sağlayın.

### 2023 - Altyapı ve Özellik Genişletmesi {#2023---infrastructure-and-feature-expansion}

**Ocak 2023**: Forward Email, kullanıcı deneyimini ve performansını iyileştirerek yeniden tasarlanmış ve sayfa hızı optimize edilmiş bir web sitesi başlattı.

**Şubat 2023**: Şirket, [hata günlükleri](/faq#do-you-store-error-logs) desteğini ekledi ve kullanıcı tercihlerine ve erişilebilirlik ihtiyaçlarına yanıt veren bir [karanlık mod](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) web sitesi renk şeması uyguladı.

**Mart 2023**: Forward Email, [mandalina](https://github.com/forwardemail/tangerine#readme)'ı yayınladı ve tüm altyapısına entegre ederek uygulama katmanında [HTTPS üzerinden DNS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") kullanımını mümkün kıldı. Şirket ayrıca [MTA-STS](/faq#do-you-support-mta-sts) desteği ekledi ve [hCaptcha](/)'ten [Cloudflare Turnike](https://developers.cloudflare.com/turnstile)'e geçti.

**Nisan 2023**: Forward Email tamamen yeni bir altyapıyı uygulamaya koydu ve otomatikleştirdi. Tüm hizmet, önceki sıralı DNS yaklaşımının yerini alan [Cloudflare](https://cloudflare.com) kullanılarak sağlık kontrolleri ve yedeklilik sağlayan küresel yük dengelemeli ve yakınlık tabanlı DNS üzerinde çalışmaya başladı. Şirket, SOC 2 Tip 1 uyumlu sağlayıcılar olan [Vultr](https://www.vultr.com/?ref=429848) ve [Dijital Okyanus](https://m.do.co/c/a7cecd27e071) de dahil olmak üzere birden fazla sağlayıcıda **çıplak sunuculara** geçti. MongoDB ve Redis veritabanları, yüksek erişilebilirlik, uçtan uca SSL şifrelemesi, beklemede şifreleme ve anında kurtarma (PITR) için birincil ve yedek düğümlere sahip kümelenmiş yapılandırmalara taşındı.

**Mayıs 2023**: Forward Email, [SMTP ile e-posta gönderme](/faq#do-you-support-sending-email-with-smtp) ve [API ile e-posta gönderme](/faq#do-you-support-sending-email-with-api) istekleri için **giden SMTP** özelliğini kullanıma sundu. Bu özellik, yüksek teslimat oranı, modern ve sağlam bir kuyruk ve yeniden deneme sistemi ve [gerçek zamanlı hata günlüklerini destekler](/faq#do-you-store-error-logs) sağlamak için yerleşik güvenlik önlemleri içeriyor.

**Kasım 2023**: Forward Email, [IMAP desteği](/faq#do-you-support-receiving-email-with-imap) için [**şifrelenmiş posta kutusu depolaması**](/blog/docs/best-quantum-safe-encrypted-email-service) özelliğini kullanıma sundu. Bu, e-posta gizliliği ve güvenliğinde önemli bir gelişmeyi temsil ediyor.

**Aralık 2023**: [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [geçiş anahtarları ve WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [gelen kutusu zamanı](/faq#i) izleme ve [IMAP Depolama için OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) için [eklenen destek](/faq#do-you-support-pop3) şirketi.

### 2024 - Hizmet Optimizasyonu ve Gelişmiş Özellikler {#2024---service-optimization-and-advanced-features}

**Şubat 2024**: E-postayı İlet [takvim (CalDAV) desteği eklendi](/faq#do-you-support-calendars-caldav), platformun yeteneklerini e-postanın ötesine taşıyarak takvim senkronizasyonunu da içerecek şekilde genişletiyor.

**Mart - Temmuz 2024**: Forward Email, hizmetlerini alternatifleri kadar hızlı, hatta daha hızlı hale getirme hedefiyle IMAP, POP3 ve CalDAV hizmetlerinde önemli iyileştirmeler ve optimizasyonlar yayınladı.

**Temmuz 2024**: [iOS Push desteği eklendi](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) şirketi, iOS'ta IMAP `IDLE` komut desteğinin bulunmaması nedeniyle Apple Mail'i ele alarak Apple iOS cihazları için gerçek zamanlı bildirimleri etkinleştirdi. Forward Email ayrıca kendi hizmetleri ve Yahoo/AOL için gelen kutusuna zaman ("TTI") izleme özelliği ekledi ve kullanıcıların ücretsiz planda bile tüm DNS TXT kayıtlarını şifrelemelerine olanak tanımaya başladı. [Gizlilik Kılavuzları tartışmaları](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) ve [GitHub sorunları](https://github.com/forwardemail/forwardemail.net/issues/254)'te talep edildiği gibi, şirket, devre dışı bırakıldığında takma adların `250`'ü sessizce reddetme, `421`'i yumuşak bir şekilde reddetme veya `550`'yı sert bir şekilde reddetme özelliğini ekledi.

**Ağustos 2024**: Forward Email, posta kutularını [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) ve [Mbox](https://en.wikipedia.org/wiki/Mbox) formatlarında (mevcut [SQLite](https://en.wikipedia.org/wiki/SQLite) dışa aktarma formatına ek olarak) dışa aktarma desteği ekledi. [Webhook imza desteği eklendi](https://forwardemail.net/faq#do-you-support-bounce-webhooks) ve şirket, kullanıcıların giden SMTP hizmeti aracılığıyla haber bültenleri, duyurular ve e-posta pazarlaması göndermelerine olanak sağlamaya başladı. IMAP/POP3/CalDAV için alan adı genelinde ve takma ada özgü depolama kotaları da uygulandı.

### 2025 - Sürekli Yenilik {#2025---continued-innovation}

**Eylül 2024 - Ocak 2025**: Zaten uygulanmış şifreli posta kutusu depolama yeteneklerini temel alarak [e-posta yönlendirme için çok talep edilen bir tatil yanıtlayıcı özelliği ve OpenPGP/WKD şifrelemesi eklendi](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254) e-postasını iletin.

**21 Ocak 2025**: Kurucunun en yakın arkadaşı ve sadık köpek dostu "Jack", neredeyse 11 yaşında huzur içinde hayata veda etti. Jack [her zaman hatırlanacak](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b), Forward Email'in yaratılmasını destekleyen sarsılmaz dostluğu için. [E-posta İletme Teknik Bilgi Belgesi](https://forwardemail.net/technical-whitepaper.pdf), Jack'e ithaf edilmiş olup, hizmetin geliştirilmesindeki rolünü takdir etmektedir.

**Şubat 2025**: Forward Email, hizmet güvenilirliğini ve hızını daha da artırmak için özel, performansa odaklı, çıplak metal donanım uygulayarak yeni birincil veri merkezi sağlayıcısı olarak [Veri Paketi](https://www.datapacket.com)'a geçti.

**Haziran 2025**: Forward Email, [CardDAV protokolü](/faq#do-you-support-contacts-carddav) desteğini başlattı ve platformun yeteneklerini mevcut e-posta ve takvim hizmetlerinin yanı sıra kişi senkronizasyonunu da içerecek şekilde genişletti.

## Temel İlkeler {#core-principles}

Forward Email, kurulduğu günden bu yana gizlilik ve güvenlik ilkelerine kararlılıkla bağlı kalmıştır:

**Yüzde 100 Açık Kaynak Felsefesi**: Sadece ön uçlarını açık kaynaklı hale getirip arka uçlarını kapalı tutan rakiplerinin aksine, Forward Email tüm kod tabanını (hem ön ucu hem de arka ucu) [GitHub](https://github.com/forwardemail) üzerinde kamunun incelemesine açtı.

**Gizlilik Öncelikli Tasarım**: Forward Email, ilk günden itibaren e-postaları diske yazmaktan kaçınan benzersiz bir bellek içi işleme yaklaşımı uyguladı ve bu sayede mesajları veritabanlarında veya dosya sistemlerinde depolayan geleneksel e-posta hizmetlerinden ayrıldı.

**Sürekli Yenilik**: Hizmet, basit bir e-posta yönlendirme çözümünden, şifrelenmiş posta kutuları, kuantum dirençli şifreleme ve SMTP, IMAP, POP3 ve CalDAV gibi standart protokoller için destek gibi özelliklere sahip kapsamlı bir e-posta platformuna dönüştü.

**Şeffaflık**: Tüm kodları açık kaynaklı hale getirmek ve incelemeye açık hale getirmek, kullanıcıların yalnızca pazarlama ifadelerine güvenmek yerine gizlilik iddialarını doğrulayabilmelerini sağlamak.

**Kullanıcı Kontrolü**: Kullanıcılara, istenirse tüm platformu kendi kendine barındırma yeteneği de dahil olmak üzere seçenekler sunma.

## Mevcut Durum {#current-status}

2025 yılı itibarıyla Forward Email, aralarında aşağıdakiler gibi önemli kuruluşların ve sektör liderlerinin de bulunduğu dünya çapında 500.000'den fazla alan adına hizmet vermektedir:

* **Teknoloji Şirketleri**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Medya Kuruluşları**: Fox News Radio, Disney Reklam Satışları
* **Eğitim Kurumları**: Cambridge Üniversitesi, Maryland Üniversitesi, Washington Üniversitesi, Tufts Üniversitesi, Swarthmore College
* **Devlet Kurumları**: Güney Avustralya Hükümeti, Dominik Cumhuriyeti Hükümeti
* **Diğer Kuruluşlar**: RCD Hotels, Fly<span>.</span>io
* **Önemli Geliştiriciler**: Isaac Z. Schlueter (npm yaratıcısı), David Heinemeier Hansson (Ruby on Rails yaratıcısı)

Platform, düzenli özellik sürümleri ve altyapı iyileştirmeleriyle gelişmeye devam ediyor ve bugün mevcut olan %100 açık kaynaklı, şifreli, gizliliğe odaklı, şeffaf ve kuantum dirençli tek e-posta hizmeti olma konumunu koruyor.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />