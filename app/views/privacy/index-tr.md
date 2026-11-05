# Gizlilik Politikası {#privacy-policy}

<!-- <img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email gizlilik politikası" class="rounded-lg" /> -->


## İçindekiler {#table-of-contents}

* [Feragatname](#disclaimer)
* [Toplanmayan Bilgiler](#information-not-collected)
* [Toplanan Bilgiler](#information-collected)
  * [Hesap Bilgileri](#account-information)
  * [E-posta Depolama](#email-storage)
  * [Hata Kayıtları](#error-logs)
  * [Sunucu Kayıtları](#server-logs)
  * [Giden SMTP E-postaları](#outbound-smtp-emails)
* [Geçici Veri İşleme](#temporary-data-processing)
  * [Oran Sınırlaması](#rate-limiting)
  * [Bağlantı Takibi](#connection-tracking)
  * [Kimlik Doğrulama Denemeleri](#authentication-attempts)
* [Denetim Kayıtları](#audit-logs)
  * [Hesap Değişiklikleri](#account-changes)
  * [Alan Adı Ayarları Değişiklikleri](#domain-settings-changes)
* [Çerezler ve Oturumlar](#cookies-and-sessions)
* [Analitik](#analytics)
* [Uygulamalar ve Webmail](#apps-and-webmail)
  * [Cihazınızdaki Veriler](#data-on-your-device)
  * [Uygulamaların Bize Gönderdiği Veriler](#data-the-apps-send-us)
  * [Push Bildirimleri](#push-notifications)
  * [E-postalardaki Görseller ve Bağlantılar](#images-and-links-in-emails)
  * [Diğer Ağ Bağlantıları](#other-connections)
* [Paylaşılan Bilgiler](#information-shared)
* [Bilgi Silme](#information-removal)
* [Ek Açıklamalar](#additional-disclosures)


## Feragatname {#disclaimer}

Lütfen site genelinde geçerli olan [Şartlarımıza](/terms) bakınız.


## Toplanmayan Bilgiler {#information-not-collected}

**Bu politikada açıkça belirtilen bilgiler ([hata günlükleri](#error-logs), [sunucu günlükleri](#server-logs), [giden SMTP e-postaları](#outbound-smtp-emails), [hesap bilgileri](#account-information), [geçici veri işleme](#temporary-data-processing), [denetim günlükleri](#audit-logs), [çerezler ve oturumlar](#cookies-and-sessions), [analitik](#analytics) ve [uygulamalar ve webmail](#apps-and-webmail) dahil olmak üzere) haricinde:**

* Yönlendirilen hiçbir e-postayı disk depolama alanında veya veritabanlarında saklamıyoruz.
* Yönlendirilen e-postalar hakkındaki hiçbir meta veriyi disk depolama alanında veya veritabanlarında saklamıyoruz.
* Bu politikada açıkça belirtilenler haricinde, günlükleri veya IP adreslerini disk depolama alanında veya veritabanlarında saklamıyoruz.
* Herhangi bir üçüncü taraf analiz veya telemetri hizmeti kullanmıyoruz.


## Toplanan Bilgiler {#information-collected}

Şeffaflık için, aşağıdaki bilgilerin nasıl toplandığını ve kullanıldığını görmek üzere istediğiniz zaman <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">kaynak kodumuzu görüntüleyebilirsiniz</a>.

**Sadece işlevsellik ve hizmetimizi geliştirmek amacıyla, aşağıdaki bilgileri güvenli şekilde toplar ve saklarız:**

### Hesap Bilgileri {#account-information}

* Bize sağladığınız e-posta adresinizi saklıyoruz.
* Bize sağladığınız alan adlarınızı, takma adlarınızı ve yapılandırmalarınızı saklıyoruz.
* Hesabınızı korumak ve erişimi yönetmek için gereken, aktif web sitesi oturum tanımlayıcıları, başarısız giriş denemesi sayaçları ve son giriş denemesinin zaman damgası dahil olmak üzere sınırlı hesap güvenliği meta verilerini saklıyoruz.
* E-posta yoluyla veya <a href="/help">yardım</a> sayfamız üzerinden bize ilettiğiniz yorumlar veya sorular gibi, kendi isteğinizle sağladığınız diğer ek bilgiler.


**Kayıt ataması** (hesabınızda kalıcı olarak saklanır):

Bir hesap oluşturduğunuzda, kullanıcıların hizmetimizi nasıl bulduğunu anlamak için aşağıdaki bilgileri saklarız:

* Yönlendiren web sitesi alan adı (tam URL değil)
* Sitemizde ziyaret ettiğiniz ilk sayfa (yolundaki alan adları, kimlikler ve belirteçler gibi değerler yer tutucularla değiştirilmiş olarak)
* URL'de mevcutsa UTM kampanya parametreleri

### E-posta Depolama {#email-storage}

* E-postalarınızı ve takvim bilgilerinizi, IMAP/POP3/CalDAV/CardDAV erişiminiz ve posta kutusu işlevselliğiniz için yalnızca sizin için [şifrelenmiş SQLite veritabanınızda](/blog/docs/best-quantum-safe-encrypted-email-service) saklarız.
  * Yalnızca e-posta yönlendirme hizmetlerimizi kullanıyorsanız, [Toplanmayan Bilgiler](#information-not-collected) bölümünde açıklandığı gibi disk veya veritabanına hiçbir e-posta kaydedilmez.
  * E-posta yönlendirme hizmetlerimiz yalnızca bellekte çalışır (disk depolama veya veritabanına yazma yapılmaz).
  * IMAP/POP3/CalDAV/CardDAV depolama, dinlenme halinde şifrelenmiş, aktarım sırasında şifrelenmiş ve LUKS şifreli bir diskte saklanır.
  * IMAP/POP3/CalDAV/CardDAV depolamanız için yedekler, dinlenme halinde şifrelenmiş, aktarım sırasında şifrelenmiş ve [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) üzerinde saklanır.

### Hata Kayıtları {#error-logs}

* `4xx` ve `5xx` SMTP yanıt kodlarına ait [hata kayıtlarını](/faq#do-you-store-error-logs) 7 gün boyunca saklarız.
* Hata kayıtları SMTP hatasını, zarfı ve e-posta başlıklarını içerir (e-posta gövdesi veya ekleri **saklanmaz**).
* Hata kayıtları, hata ayıklama amacıyla gönderen sunucuların IP adreslerini ve ana bilgisayar adlarını içerebilir.
* [Oran sınırlaması](/faq#do-you-have-rate-limiting) ve [gri listeleme](/faq#do-you-have-a-greylist) için hata kayıtlarına erişim yoktur çünkü bağlantı erken sona erer (örneğin `RCPT TO` ve `MAIL FROM` komutları iletilmeden önce).
* Başarısız olan veya çok uzun süren web sitesi ve API isteklerine ait hata kayıtlarını ve IMAP, POP3, CalDAV ve CardDAV sunucularımızdaki hataların kayıtlarını da 7 gün boyunca saklarız.
* Bu kayıtlar IP adresini, istek URL'sini (arama terimleri gibi sorgu dizeleri dahil), kullanıcı aracısı gibi istek başlıklarını ve ilgili hesabı veya takma adı içerebilir.
* Bu kayıtlar saklanmadan önce içlerindeki şifreler, API tokenları, çerezler ve istek gövdeleri gizlenir.

### Sunucu Kayıtları {#server-logs}

* Sunucularımız her web sitesi ve API isteği için bir kayıt satırı yazar. Bu satır IP adresini, istek yöntemi ile URL'sini (sorgu dizeleri dahil), istek başlıklarını, yanıt durumunu ve giriş yapmış hesabı içerebilir.
* Bu kayıtları sorunları bulup düzeltmek ve kötüye kullanımı durdurmak için kullanırız ve en fazla 30 gün saklarız.

### Giden SMTP E-postaları {#outbound-smtp-emails}

* [Giden SMTP e-postalarını](/faq#do-you-support-sending-email-with-smtp) yaklaşık 30 gün saklıyoruz.
  * Bu süre "Date" başlığına bağlı olarak değişir; çünkü gelecekteki bir "Date" başlığı varsa e-postaların geleceğe gönderilmesine izin veriyoruz.
  * **Bir e-posta başarıyla teslim edildikten veya kalıcı hata aldıktan sonra, mesaj gövdesini gizler ve sileriz.**
  * Giden SMTP e-posta mesaj gövdesinin varsayılan 0 gün (başarıyla teslim veya kalıcı hata sonrası) yerine daha uzun süre saklanmasını istiyorsanız, alan adınız için Gelişmiş Ayarlar'a gidip `0` ile `30` arasında bir değer girin.
  * Bazı kullanıcılar, e-postalarının nasıl görüntülendiğini görmek için [Hesabım > E-postalar](/my-account/emails) önizleme özelliğini kullanmayı seviyor, bu nedenle yapılandırılabilir bir saklama süresini destekliyoruz.
  * Ayrıca [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) desteğimiz olduğunu unutmayın.


## Geçici Veri İşleme {#temporary-data-processing}

Aşağıdaki veriler geçici olarak bellekte veya Redis'te işlenir ve **kalıcı olarak saklanmaz**:

### Oran Sınırlaması {#rate-limiting}

* IP adresleri oran sınırlaması amacıyla geçici olarak Redis'te kullanılır.
* Oran sınırlama verileri otomatik olarak sona erer (genellikle 24 saat içinde).
* Bu, kötüye kullanımı önler ve hizmetlerimizin adil kullanımını sağlar.

### Bağlantı Takibi {#connection-tracking}

* Eşzamanlı bağlantı sayıları IP adresi bazında Redis'te takip edilir.
* Bu veriler bağlantılar kapandığında veya kısa bir zaman aşımından sonra otomatik olarak sona erer.
* Bağlantı kötüye kullanımını önlemek ve hizmet erişilebilirliğini sağlamak için kullanılır.

### Kimlik Doğrulama Denemeleri {#authentication-attempts}

* Başarısız kimlik doğrulama denemeleri Redis'te IP adresi başına izlenir.
* Ayrıca, başarısız giriş denemesi sayaçları ve son giriş denemesinin zaman damgası dahil olmak üzere sınırlı hesap düzeyinde kimlik doğrulama meta verilerini de saklıyoruz.
* Redis tabanlı kimlik doğrulama denemesi verilerinin süresi otomatik olarak dolar (genellikle 24 saat içinde).
* Kullanıcı hesaplarına yönelik kaba kuvvet saldırılarını önlemek için kullanılır.


## Denetim Kayıtları {#audit-logs}

Hesabınızı ve alan adlarınızı izlemenize ve güvence altına almanıza yardımcı olmak için belirli değişiklikler için denetim kayıtları tutarız. Bu kayıtlar, hesap sahiplerine ve alan adı yöneticilerine bildirim e-postaları göndermek için kullanılır.

### Hesap Değişiklikleri {#account-changes}

* Önemli hesap ayarlarında yapılan değişiklikleri takip ederiz (örneğin, iki faktörlü kimlik doğrulama, görüntüleme adı, saat dilimi).
* Değişiklik tespit edildiğinde, kayıtlı e-posta adresinize bildirim e-postası göndeririz.
* Hassas alanlar (örneğin, şifre, API tokenları, kurtarma anahtarları) takip edilir ancak bildirimlerde değerleri gizlenir.
* Denetim kayıtları, bildirim e-postası gönderildikten sonra temizlenir.

### Alan Adı Ayarları Değişiklikleri {#domain-settings-changes}

Birden fazla yöneticisi olan alan adları için, ekiplerin yapılandırma değişikliklerini takip etmesine yardımcı olmak amacıyla ayrıntılı denetim kaydı sağlıyoruz:

**Takip ettiklerimiz:**

* Alan adı ayarlarında yapılan değişiklikler (örneğin, bounce webhookları, spam filtreleme, DKIM yapılandırması)
* Değişikliği yapan kişi (kullanıcının e-posta adresi)
* Değişikliğin yapıldığı zaman (zaman damgası)
* Değişikliğin yapıldığı IP adresi
* Tarayıcı/istemci kullanıcı aracısı dizisi

**Nasıl çalışır:**

* Tüm alan adı yöneticileri, ayarlar değiştiğinde tek bir konsolide e-posta bildirimi alır.
* Bildirim, her değişikliği yapan kullanıcı, IP adresi ve zaman damgası ile gösteren bir tablo içerir.
* Hassas alanlar (örneğin, webhook anahtarları, API tokenları, DKIM özel anahtarları) takip edilir ancak değerleri gizlenir.
* Kullanıcı aracısı bilgisi, katlanabilir "Teknik Detaylar" bölümünde yer alır.
* Denetim kayıtları, bildirim e-postası gönderildikten sonra temizlenir.

**Neden topluyoruz:**

* Alan adı yöneticilerinin güvenlik denetimini sürdürmesine yardımcı olmak
* Ekiplerin yapılandırma değişikliklerini kimin yaptığını denetlemesini sağlamak
* Beklenmeyen değişiklikler olması durumunda sorun gidermeye yardımcı olmak
* Paylaşılan alan adı yönetimi için hesap verebilirlik sağlamak


## Çerezler ve Oturumlar {#cookies-and-sessions}

* Web sitesi trafiğiniz için yalnızca HTTP'ye özel, imzalı çerezler ve sunucu tarafı oturum verilerini saklıyoruz.
* Çerezler SameSite korumasını kullanır.
* "Diğer cihazlardan çıkış yap" gibi özellikleri ve güvenlikle ilgili oturum geçersiz kılmayı desteklemek için hesabınızda aktif web sitesi oturum tanımlayıcılarını saklıyoruz.
* Oturum çerezlerinin süresi 30 günlük işlem yapılmamasının ardından dolar.
* Botlar veya tarayıcılar için oturum oluşturmuyoruz.
* Çerezleri ve oturumları şunlar için kullanıyoruz:
  * Kimlik doğrulama ve giriş durumu
  * İki faktörlü kimlik doğrulama "beni hatırla" işlevi
  * Anlık mesajlar ve bildirimler
  * [Analitik](#analytics): ziyaretinizin ilk sayfası, yönlendiren alan adı, kampanya (UTM) parametreleri ve sayfa sayısı


## Analitik {#analytics}

Hizmetlerimizin nasıl kullanıldığını anlamak için kendi gizlilik odaklı analitik sistemimizi kullanıyoruz. Bu sistem gizliliği temel ilke olarak tasarlanmıştır:

**Toplamadığımız Şeyler:**

* IP adreslerini saklamıyoruz
* Analitik için ayrı bir çerez yerleştirmiyoruz
* Üçüncü taraf analitik servisleri kullanmıyoruz
* Giriş yapmamış ziyaretçileri günler veya oturumlar boyunca takip etmiyoruz

**Topladığımız Şeyler:**

* Toplu sayfa görüntülemeleri ve hizmet kullanımı (SMTP, IMAP, POP3, API, vb.)
* Tarayıcı ve işletim sistemi türü ile sürümü (kullanıcı aracısından ayrıştırılır, ham veri atılır)
* Cihaz türü (masaüstü, mobil, tablet)
* Yönlendiren alan adı (tam URL değil) ve kampanya (UTM) parametreleri
* E-posta protokolleri için e-posta istemcisi türü (ör. Thunderbird, Outlook)
* İstenen sayfa veya API yolu (içindeki alan adları, kimlikler ve belirteçler gibi değerler yer tutucularla değiştirilmiş olarak) ve isteğin başarılı olup olmadığı
* Web sitesi ziyaretlerinde, ziyaretin ilk sayfası ve sayfa sayısı; bunlar oturumunuzda tutulur (bkz. [Çerezler ve Oturumlar](#cookies-and-sessions))
* Giriş yaptığınızda, her hizmetin nasıl kullanıldığını görmek ve sorunları gidermek için hesabınızın, takma adınızın veya alan adınızın kimliği

**Veri Saklama:**

* Analitik olayları otomatik olarak 30 gün sonra silinir
* Saatlik toplamlar 90 gün boyunca saklanır; bunlar hiçbir hesapla ilişkilendirilmez
* Oturum tanımlayıcıları günlük olarak döner ve ziyaretçileri günler boyunca takip etmek için kullanılamaz


## Uygulamalar ve Webmail {#apps-and-webmail}

Bu bölüm, iOS, Android, macOS, Windows ve Linux için e-posta uygulamalarımızı ve <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a> adresindeki webmail'imizi kapsar; bunlar aynı kodu paylaşır. Uygulamalar reklam veya izleme kodu ya da üçüncü taraf analitik içermez.

### Cihazınızdaki Veriler {#data-on-your-device}

* Uygulamalar, hızlı yüklenmeleri ve çevrimdışı çalışmaları için e-postalarınızı, kişilerinizi, takvimlerinizi, ayarlarınızı ve giriş bilgilerinizi cihazınızda saklar.
* App Lock'u açarsanız uygulama, saklanan e-posta içeriğini, kişileri ve giriş bilgilerini PIN'iniz veya geçiş anahtarınızla korunan bir anahtarla şifreler. Tarihler, klasörler, etiketler ve bayraklar, uygulamanın e-postalarınızı sıralayıp sayabilmesi için şifrelenmeden kalır.
* Bir hesaptan çıkış yapmak, o hesabın verilerini cihazınızdan kaldırır.

### Uygulamaların Bize Gönderdiği Veriler {#data-the-apps-send-us}

* Giriş yapmanızı sağlamak için her istekle birlikte takma adınızın e-posta adresi ve şifresi.
* Gönderdiğiniz, oluşturduğunuz veya değiştirdiğiniz e-postalar, kişiler, takvimler, etiketler ve filtreler. E-postaları, kişileri ve takvimleri [E-posta Depolama](#email-storage) bölümünde, gönderdiğiniz e-postaları da [Giden SMTP E-postaları](#outbound-smtp-emails) bölümünde açıklandığı gibi saklarız.
* Posta kutunuzda aramayı sunucularımızda yapabilmemiz için arama terimleriniz. Arama terimleri istek URL'sinin bir parçası olduğundan [hata kayıtlarında](#error-logs) ve [sunucu kayıtlarında](#server-logs) görünebilir.
* Uygulamadan göndermeyi seçtiğiniz geri bildirimler; bunlar, eklemeyi seçtiğiniz tanılama ayrıntılarıyla birlikte takma adınızdan destek ekibimize e-postayla gönderilir.
* Spam olarak bildirdiğiniz e-postalar; uygulama bunları kötüye kullanımla mücadele ekibimize (veya Settings bölümünde belirlediğiniz başka bir adrese) iletir.

### Push Bildirimleri {#push-notifications}

* Bildirimlere izin verdiğinizde uygulama sistemimize bir push belirteci kaydeder. Bu belirteci platform, ait olduğu takma ad ve hesap, son teslimat zamanı ve uygulamanın kullanıcı aracısından alınan bir cihaz adıyla birlikte saklarız. Bu cihaz adı işletim sistemi sürümünüzü ve Android'de cihaz modelinizi içerir.
* Bir push belirtecini son kullanımından sonra en fazla bir yıl saklarız. Uygulamadan çıkış yaptığınızda, teslimat üst üste üç kez başarısız olduğunda, takma ad şifresi değiştiğinde, takma adı ya da hesabınızı sildiğinizde veya takma ad başka bir sahibe geçtiğinde belirteci daha erken sileriz.
* iOS ve macOS'ta bildirimler Apple Push Notification service üzerinden iletilir. Google Play'deki Android uygulamamızda ise Firebase Cloud Messaging üzerinden iletilir. Yeni e-posta bildirimleri gönderenin adını ve adresini, konuyu, kısa bir önizlemeyi ve klasör adını içerir. Bu, Gereksiz veya Gönderilmiş klasörüne yerleştirilen e-postalar gibi uyarı olmadan gelen e-postalar için de geçerlidir. E-postalar, takvimler veya kişiler değiştiğinde, uygulamanın güncel kalması için tanımlayıcılar içeren ancak e-posta içeriği içermeyen sessiz bildirimler de göndeririz.
* Android'de [UnifiedPush](https://unifiedpush.org/) ile ve web tarayıcısındaki bildirimlerde, her bildirim yalnızca cihazınızın okuyabileceği şekilde şifrelenir.
* Google Play'deki Android uygulamamız Firebase Cloud Messaging içerir; bu hizmet Google'a bir Firebase kurulum kimliği, uygulama sürümü ve cihaz ile SDK ayrıntıları gönderir. GitHub'daki Google'sız Android uygulamamız Firebase içermez.

### E-postalardaki Görseller ve Bağlantılar {#images-and-links-in-emails}

* E-postalardaki görseller gönderenin sunucularından yüklenir; bu sunucular IP adresinizi ve görsellerin ne zaman yüklendiğini görebilir.
* Uygulamalar izleme piksellerini varsayılan olarak engeller. Ayrıca Settings > Privacy & Security altında tüm harici görselleri engelleyebilir, ardından bunları her seferinde tek bir e-posta için yükleyebilirsiniz.
* E-postalardaki bağlantılar web tarayıcınızda açılır.

### Diğer Ağ Bağlantıları {#other-connections}

* Webmail'imiz yüklendiğinde, ona geri döndüğünüzde ve açık olduğu sürece her 10 dakikada bir GitHub'dan kendi en son sürümünü ister. About & Help bölümü GitHub'dan en son masaüstü sürümünü ister, masaüstü uygulamaları da güncellemeler için GitHub'ı kontrol eder. GitHub bu isteklerle birlikte IP adresinizi alır.


## Paylaşılan Bilgiler {#information-shared}

Hizmetimizin bazı kısımlarını yürüten Cloudflare (web sitesi koruması ve şifrelenmiş yedekler), Stripe ve PayPal (ödemeler) gibi hizmet sağlayıcılar ile cihazlarınıza push bildirimlerini ileten hizmetler (bkz. [Push Bildirimleri](#push-notifications)) dışında bilgilerinizi üçüncü taraflarla paylaşmıyoruz.

Mahkeme kararıyla gelen yasal taleplere uymamız gerekebilir (ancak [“Toplanmayan Bilgiler” altında belirtilen bilgileri toplamadığımızı](#information-not-collected) unutmayın, bu yüzden baştan sağlayamayız).


## Bilgi Silme {#information-removal}

Herhangi bir zamanda bize sağladığınız bilgileri silmek isterseniz, <a href="/my-account/security">Hesabım > Güvenlik</a> sayfasına gidip "Hesabı Sil" seçeneğine tıklayın.

Kötüye kullanımı önlemek ve azaltmak amacıyla, hesabınızı ilk ödemenizden sonraki 5 gün içinde silerseniz, hesabınızın manuel silme incelemesi için yöneticilerimiz tarafından gözden geçirilmesi gerekebilir.

Bu süreç genellikle 24 saatten az sürer ve kullanıcıların hizmetimizi spam yapıp ardından hesaplarını hızlıca silmeleri nedeniyle uygulanmıştır – bu durum Stripe’da ödeme yöntemi parmak izlerini engellememizi engelliyordu.

Hesabınızı sildiğinizde, yönettiğiniz alan adları, takma adlarınız ve bunlar için kaydedilmiş push belirteçleri de silinir. Hesap kaydının kendisi, e-posta adresi, fatura bilgileri, şifresi ve geçiş anahtarları kaldırılmış, iki faktörlü kimlik doğrulaması ve API belirteci iptal edilmiş şekilde kalır ve hesaba ait ödeme kayıtlarını iadeler ve muhasebe için saklarız. Hesabınıza atıfta bulunan kayıtlar ve analitik veriler, yukarıda belirtilen sürelere göre silinir.

Uygulamaların verilerini bir cihazdan kaldırmak için uygulamadan çıkış yapın veya uygulamayı kaldırın.


## Ek Açıklamalar {#additional-disclosures}

Bu site Cloudflare tarafından korunmaktadır ve onun [Gizlilik Politikası](https://www.cloudflare.com/privacypolicy/) ile [Hizmet Şartları](https://www.cloudflare.com/website-terms/) geçerlidir.
