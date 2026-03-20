# Gizlilik Politikası {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email gizlilik politikası" class="rounded-lg" />


## İçindekiler {#table-of-contents}

* [Feragatname](#disclaimer)
* [Toplanmayan Bilgiler](#information-not-collected)
* [Toplanan Bilgiler](#information-collected)
  * [Hesap Bilgileri](#account-information)
  * [E-posta Depolama](#email-storage)
  * [Hata Kayıtları](#error-logs)
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
* [Paylaşılan Bilgiler](#information-shared)
* [Bilgi Silme](#information-removal)
* [Ek Açıklamalar](#additional-disclosures)


## Feragatname {#disclaimer}

Lütfen site genelinde geçerli olan [Şartlarımıza](/terms) bakınız.


## Toplanmayan Bilgiler {#information-not-collected}

**[Hata kayıtları](#error-logs), [giden SMTP e-postaları](#outbound-smtp-emails) ve/veya spam ya da kötü amaçlı etkinlik tespit edildiğinde (örneğin oran sınırlaması için) hariç olmak üzere:**

* Yönlendirilen e-postaları disk depolama veya veritabanlarında saklamıyoruz.
* Yönlendirilen e-postalarla ilgili herhangi bir meta veriyi disk depolama veya veritabanlarında saklamıyoruz.
* Herhangi bir kayıt veya IP adresini disk depolama veya veritabanlarında saklamıyoruz.
* Üçüncü taraf analitik veya telemetri hizmetleri kullanmıyoruz.


## Toplanan Bilgiler {#information-collected}

Şeffaflık için, aşağıdaki bilgilerin nasıl toplandığını ve kullanıldığını görmek üzere istediğiniz zaman <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">kaynak kodumuzu görüntüleyebilirsiniz</a>.

**Sadece işlevsellik ve hizmetimizi geliştirmek amacıyla, aşağıdaki bilgileri güvenli şekilde toplar ve saklarız:**

### Hesap Bilgileri {#account-information}

* Bize sağladığınız e-posta adresinizi saklarız.
* Bize sağladığınız alan adlarınızı, takma adlarınızı ve yapılandırmalarınızı saklarız.
* E-posta yoluyla veya <a href="/help">yardım</a> sayfamızda bize gönüllü olarak sağladığınız yorumlar veya sorular gibi ek bilgileri saklarız.

**Kayıt ataması** (hesabınızda kalıcı olarak saklanır):

Bir hesap oluşturduğunuzda, kullanıcıların hizmetimizi nasıl bulduğunu anlamak için aşağıdaki bilgileri saklarız:

* Yönlendiren web sitesi alan adı (tam URL değil)
* Sitemizde ziyaret ettiğiniz ilk sayfa
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

* Başarısız kimlik doğrulama denemeleri IP adresi bazında Redis'te takip edilir.
* Bu veriler otomatik olarak sona erer (genellikle 24 saat içinde).
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

* Web sitesi trafiğiniz için bir oturumda çerez saklıyoruz.
* Çerezler HTTP-only, imzalıdır ve SameSite koruması kullanır.
* Oturum çerezleri 30 gün etkinlik olmaması halinde sona erer.
* Botlar veya tarayıcılar için oturum oluşturmayız.
* Çerezleri şu amaçlarla kullanıyoruz:
  * Kimlik doğrulama ve giriş durumu
  * İki faktörlü kimlik doğrulama "beni hatırla" işlevi
  * Flash mesajlar ve bildirimler
## Analitik {#analytics}

Hizmetlerimizin nasıl kullanıldığını anlamak için kendi gizlilik odaklı analitik sistemimizi kullanıyoruz. Bu sistem gizliliği temel ilke olarak tasarlanmıştır:

**Toplamadığımız Şeyler:**

* IP adreslerini saklamıyoruz
* Analitik için çerez veya kalıcı tanımlayıcı kullanmıyoruz
* Üçüncü taraf analitik servisleri kullanmıyoruz
* Kullanıcıları günler veya oturumlar boyunca takip etmiyoruz

**Topladığımız Şeyler (anonimleştirilmiş):**

* Toplu sayfa görüntülemeleri ve hizmet kullanımı (SMTP, IMAP, POP3, API, vb.)
* Tarayıcı ve işletim sistemi türü (kullanıcı aracısından ayrıştırılır, ham veri atılır)
* Cihaz türü (masaüstü, mobil, tablet)
* Yönlendiren alan adı (tam URL değil)
* E-posta protokolleri için e-posta istemcisi türü (ör. Thunderbird, Outlook)

**Veri Saklama:**

* Analitik veriler otomatik olarak 30 gün sonra silinir
* Oturum tanımlayıcıları günlük olarak döner ve kullanıcıları günler boyunca takip etmek için kullanılamaz


## Paylaşılan Bilgiler {#information-shared}

Bilgilerinizi üçüncü taraflarla paylaşmıyoruz.

Mahkeme kararıyla gelen yasal taleplere uymamız gerekebilir (ancak [“Toplanmayan Bilgiler” altında belirtilen bilgileri toplamadığımızı] (#information-not-collected) unutmayın, bu yüzden baştan sağlayamayız).


## Bilgi Silme {#information-removal}

Herhangi bir zamanda bize sağladığınız bilgileri silmek isterseniz, <a href="/my-account/security">Hesabım > Güvenlik</a> sayfasına gidip "Hesabı Sil" seçeneğine tıklayın.

Kötüye kullanımı önlemek ve azaltmak amacıyla, hesabınızı ilk ödemenizden sonraki 5 gün içinde silerseniz, hesabınızın manuel silme incelemesi için yöneticilerimiz tarafından gözden geçirilmesi gerekebilir.

Bu süreç genellikle 24 saatten az sürer ve kullanıcıların hizmetimizi spam yapıp ardından hesaplarını hızlıca silmeleri nedeniyle uygulanmıştır – bu durum Stripe’da ödeme yöntemi parmak izlerini engellememizi engelliyordu.


## Ek Açıklamalar {#additional-disclosures}

Bu site Cloudflare tarafından korunmaktadır ve onun [Gizlilik Politikası](https://www.cloudflare.com/privacypolicy/) ile [Hizmet Şartları](https://www.cloudflare.com/website-terms/) geçerlidir.
