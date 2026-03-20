# Sıkça Sorulan Sorular {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Forward Email sıkça sorulan sorular" class="rounded-lg" />


## İçindekiler {#table-of-contents}

* [Hızlı Başlangıç](#quick-start)
* [Giriş](#introduction)
  * [Forward Email nedir](#what-is-forward-email)
  * [Forward Email'i kimler kullanır](#who-uses-forward-email)
  * [Forward Email'in geçmişi nedir](#what-is-forward-emails-history)
  * [Bu hizmet ne kadar hızlıdır](#how-fast-is-this-service)
* [E-posta İstemcileri](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [Mobil Cihazlar](#mobile-devices)
  * [Sendmail SMTP Relay Yapılandırması](#sendmail-smtp-relay-configuration)
  * [Exim4 SMTP Relay Yapılandırması](#exim4-smtp-relay-configuration)
  * [msmtp SMTP İstemci Yapılandırması](#msmtp-smtp-client-configuration)
  * [Komut Satırı E-posta İstemcileri](#command-line-email-clients)
  * [Windows E-posta Yapılandırması](#windows-email-configuration)
  * [Postfix SMTP Relay Yapılandırması](#postfix-smtp-relay-configuration)
  * [Gmail kullanarak Mail Gönderme nasıl yapılır](#how-to-send-mail-as-using-gmail)
  * [Gmail kullanarak Mail Gönderme için eski ücretsiz rehber nedir](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Gelişmiş Gmail Yönlendirme Yapılandırması](#advanced-gmail-routing-configuration)
  * [Gelişmiş Outlook Yönlendirme Yapılandırması](#advanced-outlook-routing-configuration)
* [Sorun Giderme](#troubleshooting)
  * [Test e-postalarımı neden almıyorum](#why-am-i-not-receiving-my-test-emails)
  * [E-posta istemcimi Forward Email ile çalışacak şekilde nasıl yapılandırırım](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [E-postalarım neden Spam ve Gereksiz klasörüne düşüyor ve alan adı itibarımı nasıl kontrol ederim](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Spam e-postalar alırsam ne yapmalıyım](#what-should-i-do-if-i-receive-spam-emails)
  * [Gmail'de kendime gönderdiğim test e-postaları neden "şüpheli" olarak görünüyor](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Gmail'de via forwardemail dot net ifadesini kaldırabilir miyim](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Veri Yönetimi](#data-management)
  * [Sunucularınız nerede bulunuyor](#where-are-your-servers-located)
  * [Posta kutumu nasıl dışa aktarır ve yedeklerim](#how-do-i-export-and-backup-my-mailbox)
  * [Mevcut posta kutumu nasıl içe aktarır ve taşırım](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Yedekler için kendi S3 uyumlu depolamamı nasıl kullanırım](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [SQLite yedeklerini EML dosyalarına nasıl dönüştürürüm](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [Kendi kendine barındırmayı destekliyor musunuz](#do-you-support-self-hosting)
* [E-posta Yapılandırması](#email-configuration)
  * [Başlamak ve e-posta yönlendirmeyi ayarlamak için ne yapmalıyım](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Gelişmiş yönlendirme için birden fazla MX değişimi ve sunucu kullanabilir miyim](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Tatil yanıtlayıcısı (ofis dışı otomatik yanıtlayıcı) nasıl kurulur](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Forward Email için SPF nasıl ayarlanır](#how-do-i-set-up-spf-for-forward-email)
  * [Forward Email için DKIM nasıl ayarlanır](#how-do-i-set-up-dkim-for-forward-email)
  * [Forward Email için DMARC nasıl ayarlanır](#how-do-i-set-up-dmarc-for-forward-email)
  * [DMARC Raporları nasıl görüntülenir](#how-do-i-view-dmarc-reports)
  * [Kişilerimi nasıl bağlar ve yapılandırırım](#how-do-i-connect-and-configure-my-contacts)
  * [Takvimlerimi nasıl bağlar ve yapılandırırım](#how-do-i-connect-and-configure-my-calendars)
  * [Daha fazla takvim nasıl eklenir ve mevcut takvimler nasıl yönetilir](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Görevler ve hatırlatıcılar nasıl bağlanır ve yapılandırılır](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [macOS Hatırlatıcılarında neden görev oluşturamıyorum](#why-cant-i-create-tasks-in-macos-reminders)
  * [Android'de Tasks.org nasıl kurulur](#how-do-i-set-up-tasksorg-on-android)
  * [Forward Email için SRS nasıl ayarlanır](#how-do-i-set-up-srs-for-forward-email)
  * [Forward Email için MTA-STS nasıl ayarlanır](#how-do-i-set-up-mta-sts-for-forward-email)
  * [E-posta adresime profil resmi nasıl eklerim](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Gelişmiş Özellikler](#advanced-features)
  * [Pazarlama ile ilgili e-posta için bültenler veya posta listelerini destekliyor musunuz](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [API ile e-posta gönderimini destekliyor musunuz](#do-you-support-sending-email-with-api)
  * [IMAP ile e-posta alımını destekliyor musunuz](#do-you-support-receiving-email-with-imap)
  * [POP3 destekliyor musunuz](#do-you-support-pop3)
  * [Takvimleri (CalDAV) destekliyor musunuz](#do-you-support-calendars-caldav)
  * [Görevler ve hatırlatıcıları (CalDAV VTODO) destekliyor musunuz](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [Kişileri (CardDAV) destekliyor musunuz](#do-you-support-contacts-carddav)
  * [SMTP ile e-posta gönderimini destekliyor musunuz](#do-you-support-sending-email-with-smtp)
  * [OpenPGP/MIME, uçtan uca şifreleme ("E2EE") ve Web Anahtar Dizini ("WKD") destekliyor musunuz](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [S/MIME şifrelemesini destekliyor musunuz](#do-you-support-smime-encryption)
  * [Sieve e-posta filtrelemeyi destekliyor musunuz](#do-you-support-sieve-email-filtering)
  * [MTA-STS destekliyor musunuz](#do-you-support-mta-sts)
  * [Parola anahtarları ve WebAuthn destekliyor musunuz](#do-you-support-passkeys-and-webauthn)
  * [E-posta en iyi uygulamalarını destekliyor musunuz](#do-you-support-email-best-practices)
  * [Bounce webhooks destekliyor musunuz](#do-you-support-bounce-webhooks)
  * [Webhooks destekliyor musunuz](#do-you-support-webhooks)
  * [Düzenli ifadeler veya regex destekliyor musunuz](#do-you-support-regular-expressions-or-regex)
  * [Giden SMTP limitleriniz nelerdir](#what-are-your-outbound-smtp-limits)
  * [SMTP'yi etkinleştirmek için onay gerekiyor mu](#do-i-need-approval-to-enable-smtp)
  * [SMTP sunucu yapılandırma ayarlarınız nelerdir](#what-are-your-smtp-server-configuration-settings)
  * [IMAP sunucu yapılandırma ayarlarınız nelerdir](#what-are-your-imap-server-configuration-settings)
  * [POP3 sunucu yapılandırma ayarlarınız nelerdir](#what-are-your-pop3-server-configuration-settings)
  * [Alan adım için e-posta otomatik keşfi nasıl ayarlanır](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [Güvenlik](#security-1)
  * [Gelişmiş Sunucu Sertleştirme Teknikleri](#advanced-server-hardening-techniques)
  * [SOC 2 veya ISO 27001 sertifikalarınız var mı](#do-you-have-soc-2-or-iso-27001-certifications)
  * [E-posta yönlendirme için TLS şifrelemesi kullanıyor musunuz](#do-you-use-tls-encryption-for-email-forwarding)
  * [E-posta kimlik doğrulama başlıklarını koruyor musunuz](#do-you-preserve-email-authentication-headers)
  * [Orijinal e-posta başlıklarını koruyor ve sahteciliği önlüyor musunuz](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Spam ve kötüye kullanımı nasıl önlüyorsunuz](#how-do-you-protect-against-spam-and-abuse)
  * [E-posta içeriğini diskte saklıyor musunuz](#do-you-store-email-content-on-disk)
  * [Sistem çökmeleri sırasında e-posta içeriği açığa çıkabilir mi](#can-email-content-be-exposed-during-system-crashes)
  * [E-posta altyapınıza kimler erişebilir](#who-has-access-to-your-email-infrastructure)
  * [Hangi altyapı sağlayıcılarını kullanıyorsunuz](#what-infrastructure-providers-do-you-use)
  * [Bir Veri İşleme Sözleşmesi (DPA) sunuyor musunuz](#do-you-offer-a-data-processing-agreement-dpa)
  * [Veri ihlali bildirimlerini nasıl yönetiyorsunuz](#how-do-you-handle-data-breach-notifications)
  * [Bir test ortamı sunuyor musunuz](#do-you-offer-a-test-environment)
  * [İzleme ve uyarı araçları sağlıyor musunuz](#do-you-provide-monitoring-and-alerting-tools)
  * [Yüksek kullanılabilirliği nasıl sağlıyorsunuz](#how-do-you-ensure-high-availability)
  * [Ulusal Savunma Yetkilendirme Yasası (NDAA) Bölüm 889 ile uyumlu musunuz](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Sistem ve Teknik Detaylar](#system-and-technical-details)
  * [E-postaları ve içeriklerini saklıyor musunuz](#do-you-store-emails-and-their-contents)
  * [E-posta yönlendirme sisteminiz nasıl çalışır](#how-does-your-email-forwarding-system-work)
  * [Bir e-postayı yönlendirmek için nasıl işliyorsunuz](#how-do-you-process-an-email-for-forwarding)
  * [E-posta teslim sorunlarını nasıl yönetiyorsunuz](#how-do-you-handle-email-delivery-issues)
  * [IP adreslerinizin engellenmesi durumunda nasıl hareket ediyorsunuz](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Postmaster adresleri nedir](#what-are-postmaster-addresses)
  * [No-reply adresleri nedir](#what-are-no-reply-addresses)
  * [Sunucularınızın IP adresleri nelerdir](#what-are-your-servers-ip-addresses)
  * [Bir izin listesine (allowlist) sahip misiniz](#do-you-have-an-allowlist)
  * [Varsayılan olarak hangi alan adı uzantıları izin listesinde](#what-domain-name-extensions-are-allowlisted-by-default)
  * [İzin listenizin kriterleri nelerdir](#what-is-your-allowlist-criteria)
  * [Hangi alan adı uzantıları ücretsiz kullanılabilir](#what-domain-name-extensions-can-be-used-for-free)
  * [Bir gri listeye (greylist) sahip misiniz](#do-you-have-a-greylist)
  * [Bir kara listeye (denylist) sahip misiniz](#do-you-have-a-denylist)
  * [Oran sınırlaması (rate limiting) var mı](#do-you-have-rate-limiting)
  * [Backscatter'a karşı nasıl koruma sağlıyorsunuz](#how-do-you-protect-against-backscatter)
  * [Bilinen MAIL FROM spam göndericilerinden gelen bounce'ları önleyin](#prevent-bounces-from-known-mail-from-spammers)
  * [Backscatter'a karşı koruma için gereksiz bounce'ları önleyin](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Bir e-posta parmak izini nasıl belirliyorsunuz](#how-do-you-determine-an-email-fingerprint)
  * [E-postaları 25 dışındaki portlara yönlendirebilir miyim (örneğin ISP port 25'i engellediyse)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Gmail takma adları için artı + sembolünü destekliyor mu](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Alt alan adlarını destekliyor mu](#does-it-support-sub-domains)
  * [Bu e-postamın başlıklarını yönlendiriyor mu](#does-this-forward-my-emails-headers)
  * [Bu iyi test edildi mi](#is-this-well-tested)
  * [SMTP yanıt mesajlarını ve kodlarını iletiyor musunuz](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Spam göndericileri nasıl engelliyor ve iyi bir e-posta yönlendirme itibarı sağlıyorsunuz](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Alan adlarında DNS sorgularını nasıl yapıyorsunuz](#how-do-you-perform-dns-lookups-on-domain-names)
* [Hesap ve Faturalandırma](#account-and-billing)
  * [Ücretli planlarda para iade garantisi sunuyor musunuz](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Plan değiştirirsem farkı orantılı olarak iade ediyor musunuz](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Bu e-posta yönlendirme hizmetini sadece "yedek" veya "fallover" MX sunucusu olarak kullanabilir miyim](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Belirli takma adları devre dışı bırakabilir miyim](#can-i-disable-specific-aliases)
  * [E-postaları birden fazla alıcıya yönlendirebilir miyim](#can-i-forward-emails-to-multiple-recipients)
  * [Birden fazla global catch-all alıcısı olabilir miyim](#can-i-have-multiple-global-catch-all-recipients)
  * [Her takma ad için yönlendirebileceğim e-posta adresi sayısında maksimum sınır var mı](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [E-postaları yinelemeli olarak yönlendirebilir miyim](#can-i-recursively-forward-emails)
  * [İzinsiz olarak e-posta yönlendirmemi kaydettirebilir veya kaydını sildirebilirler mi](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Bu hizmet nasıl ücretsiz](#how-is-it-free)
  * [Maksimum e-posta boyutu sınırı nedir](#what-is-the-max-email-size-limit)
  * [E-posta günlüklerini saklıyor musunuz](#do-you-store-logs-of-emails)
  * [Hata günlüklerini saklıyor musunuz](#do-you-store-error-logs)
  * [E-postalarımı okuyor musunuz](#do-you-read-my-emails)
  * [Bununla Gmail'de "mail gönderme" yapabilir miyim](#can-i-send-mail-as-in-gmail-with-this)
  * [Bununla Outlook'ta "mail gönderme" yapabilir miyim](#can-i-send-mail-as-in-outlook-with-this)
  * [Bununla Apple Mail ve iCloud Mail'de "mail gönderme" yapabilir miyim](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Bununla sınırsız e-posta yönlendirebilir miyim](#can-i-forward-unlimited-emails-with-this)
  * [Tek fiyatla sınırsız alan adı sunuyor musunuz](#do-you-offer-unlimited-domains-for-one-price)
  * [Hangi ödeme yöntemlerini kabul ediyorsunuz](#which-payment-methods-do-you-accept)
* [Ek Kaynaklar](#additional-resources)
## Hızlı Başlangıç {#quick-start}

Forward Email ile başlamak için:

1. **Bir hesap oluşturun** [forwardemail.net/register](https://forwardemail.net/register) adresinde

2. **Alan adınızı ekleyin ve doğrulayın** [Hesabım → Alan Adları](/my-account/domains) altında

3. **E-posta takma adları/posta kutuları ekleyin ve yapılandırın** [Hesabım → Alan Adları](/my-account/domains) → Takma Adlar altında

4. **Kurulumunuzu test edin** yeni takma adlarınızdan birine e-posta göndererek

> \[!TIP]
> DNS değişikliklerinin dünya çapında yayılması 24-48 saat sürebilir, ancak genellikle çok daha kısa sürede etkili olur.

> \[!IMPORTANT]
> Teslimat başarısını artırmak için [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) ve [DMARC](#how-do-i-set-up-dmarc-for-forward-email) kayıtlarını ayarlamanızı öneririz.


## Giriş {#introduction}

### Forward Email Nedir {#what-is-forward-email}

> \[!NOTE]
> Forward Email, profesyonel e-posta adreslerine sahip olmak isteyen bireyler, küçük işletmeler ve geliştiriciler için tam e-posta barındırma çözümünün maliyeti ve bakımı olmadan mükemmeldir.

Forward Email, **tam özellikli bir e-posta servis sağlayıcısı** ve **özel alan adları için e-posta barındırma sağlayıcısıdır**.

Tek ücretsiz ve açık kaynaklı hizmettir ve kendi e-posta sunucunuzu kurup yönetmenin karmaşıklığı olmadan özel alan adı e-posta adresleri kullanmanıza olanak tanır.

Hizmetimiz, özel alan adınıza gönderilen e-postaları mevcut e-posta hesabınıza iletir – hatta bizi özel e-posta barındırma sağlayıcınız olarak kullanabilirsiniz.

Forward Email'in temel özellikleri:

* **Özel Alan Adı E-postası**: Kendi alan adınızla profesyonel e-posta adresleri kullanın
* **Ücretsiz Katman**: Temel e-posta yönlendirme ücretsiz
* **Gelişmiş Gizlilik**: E-postalarınızı okumuyoruz veya verilerinizi satmıyoruz
* **Açık Kaynak**: Tüm kod tabanımız GitHub'da mevcuttur
* **SMTP, IMAP ve POP3 Desteği**: Tam e-posta gönderme ve alma yetenekleri
* **Uçtan Uca Şifreleme**: OpenPGP/MIME desteği
* **Özel Catch-All Takma Adlar**: Sınırsız e-posta takma adı oluşturun

Bizi 56+ diğer e-posta servis sağlayıcı ile [E-posta Karşılaştırma sayfamızda](/blog/best-email-service) karşılaştırabilirsiniz.

> \[!TIP]
> Forward Email hakkında daha fazla bilgi edinmek için ücretsiz [Teknik Beyaz Kitabımızı](/technical-whitepaper.pdf) okuyun

### Forward Email'i Kimler Kullanıyor {#who-uses-forward-email}

500.000+ alan adına e-posta barındırma ve yönlendirme hizmeti sağlıyoruz ve bu önemli kullanıcılar:

| Müşteri                                 | Vaka Çalışması                                                                                           |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| ABD Deniz Harp Okulu                     | [:page_facing_up: Vaka Çalışması](/blog/docs/federal-government-email-service-section-889-compliant)     |
| Canonical                                | [:page_facing_up: Vaka Çalışması](/blog/docs/canonical-ubuntu-email-enterprise-case-study)               |
| Netflix Games                            |                                                                                                          |
| Linux Vakfı                             | [:page_facing_up: Vaka Çalışması](/blog/docs/linux-foundation-email-enterprise-case-study)               |
| PHP Vakfı                               |                                                                                                          |
| Fox News Radio                          |                                                                                                          |
| Disney Reklam Satışları                 |                                                                                                          |
| jQuery                                  | [:page_facing_up: Vaka Çalışması](/blog/docs/linux-foundation-email-enterprise-case-study)               |
| LineageOS                              |                                                                                                          |
| Ubuntu                                 | [:page_facing_up: Vaka Çalışması](/blog/docs/canonical-ubuntu-email-enterprise-case-study)               |
| Kubuntu                                | [:page_facing_up: Vaka Çalışması](/blog/docs/canonical-ubuntu-email-enterprise-case-study)               |
| Lubuntu                                | [:page_facing_up: Vaka Çalışması](/blog/docs/canonical-ubuntu-email-enterprise-case-study)               |
| Cambridge Üniversitesi                 | [:page_facing_up: Vaka Çalışması](/blog/docs/alumni-email-forwarding-university-case-study)              |
| Maryland Üniversitesi                  | [:page_facing_up: Vaka Çalışması](/blog/docs/alumni-email-forwarding-university-case-study)              |
| Washington Üniversitesi                | [:page_facing_up: Vaka Çalışması](/blog/docs/alumni-email-forwarding-university-case-study)              |
| Tufts Üniversitesi                    | [:page_facing_up: Vaka Çalışması](/blog/docs/alumni-email-forwarding-university-case-study)              |
| Swarthmore Koleji                     | [:page_facing_up: Vaka Çalışması](/blog/docs/alumni-email-forwarding-university-case-study)              |
| Güney Avustralya Hükümeti             |                                                                                                          |
| Dominik Cumhuriyeti Hükümeti           |                                                                                                          |
| Fly<span>.</span>io                    |                                                                                                          |
| RCD Otelleri                          |                                                                                                          |
| Isaac Z. Schlueter (npm)               | [:page_facing_up: Vaka Çalışması](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |                                                                                                          |
### Forward Email'nin geçmişi nedir {#what-is-forward-emails-history}

Forward Email hakkında daha fazla bilgi edinmek için [Hakkımızda sayfamıza](/about) göz atabilirsiniz.

### Bu hizmet ne kadar hızlıdır {#how-fast-is-this-service}

> \[!NOTE]
> Sistemimiz, e-postalarınızın zamanında teslim edilmesini sağlamak için çoklu yedekli sunucularla hız ve güvenilirlik için tasarlanmıştır.

Forward Email, mesajları genellikle alındıktan saniyeler içinde minimum gecikmeyle iletir.

Performans metrikleri:

* **Ortalama Teslim Süresi**: Alımdan iletime 5-10 saniyeden az ([TTI "Inbox'a Ulaşma Süresi" izleme sayfamıza bakın](/tti))
* **Çalışma Süresi**: %99.9+ hizmet kullanılabilirliği
* **Küresel Altyapı**: Optimum yönlendirme için stratejik olarak konumlandırılmış sunucular
* **Otomatik Ölçeklendirme**: Sistemimiz yoğun e-posta dönemlerinde ölçeklenir

Biz, diğer sağlayıcıların kullandığı gecikmeli kuyrukların aksine gerçek zamanlı çalışıyoruz.

Disk yazmıyor veya günlükleri saklamıyoruz – [hatalar hariç](#do-you-store-error-logs) ve [giden SMTP](#do-you-support-sending-email-with-smtp) (bkz. [Gizlilik Politikamız](/privacy)).

Her şey bellekte yapılır ve [kaynak kodumuz GitHub'da mevcuttur](https://github.com/forwardemail).


## E-posta İstemcileri {#email-clients}

### Thunderbird {#thunderbird}

1. Forward Email kontrol panelinizde yeni bir takma ad oluşturun ve şifre oluşturun
2. Thunderbird'u açın ve **Düzenle → Hesap Ayarları → Hesap İşlemleri → Posta Hesabı Ekle** yolunu izleyin
3. Adınızı, Forward Email adresinizi ve şifrenizi girin
4. **Manuel yapılandır** seçeneğine tıklayın ve şunları girin:
   * Gelen: IMAP, `imap.forwardemail.net`, port 993, SSL/TLS
   * Giden: SMTP, `smtp.forwardemail.net`, port 465, SSL/TLS (önerilir; port 587 STARTTLS ile de desteklenir)
5. **Tamamla** butonuna tıklayın

### Microsoft Outlook {#microsoft-outlook}

1. Forward Email kontrol panelinizde yeni bir takma ad oluşturun ve şifre oluşturun
2. **Dosya → Hesap Ekle** yolunu izleyin
3. Forward Email adresinizi girin ve **Bağlan** butonuna tıklayın
4. **Gelişmiş seçenekler**i seçin ve **Hesabımı manuel olarak ayarlamama izin ver** seçeneğini işaretleyin
5. **IMAP** seçin ve şunları girin:
   * Gelen: `imap.forwardemail.net`, port 993, SSL
   * Giden: `smtp.forwardemail.net`, port 465, SSL/TLS (önerilir; port 587 STARTTLS ile de desteklenir)
   * Kullanıcı adı: Tam e-posta adresiniz
   * Şifre: Oluşturduğunuz şifre
6. **Bağlan** butonuna tıklayın

### Apple Mail {#apple-mail}

1. Forward Email kontrol panelinizde yeni bir takma ad oluşturun ve şifre oluşturun
2. **Mail → Tercihler → Hesaplar → +** yolunu izleyin
3. **Diğer Posta Hesabı**nı seçin
4. Adınızı, Forward Email adresinizi ve şifrenizi girin
5. Sunucu ayarları için şunları girin:
   * Gelen: `imap.forwardemail.net`
   * Giden: `smtp.forwardemail.net`
   * Kullanıcı adı: Tam e-posta adresiniz
   * Şifre: Oluşturduğunuz şifre
6. **Oturum Aç** butonuna tıklayın

### eM Client {#em-client}

1. Forward Email kontrol panelinizde yeni bir takma ad oluşturun ve şifre oluşturun
2. eM Client'ı açın ve **Menü → Hesaplar → + Hesap Ekle** yolunu izleyin
3. **Posta**ya tıklayın ve ardından **Diğer**i seçin
4. Forward Email adresinizi girin ve **İleri**ye tıklayın
5. Aşağıdaki sunucu ayarlarını girin:
   * **Gelen sunucu**: `imap.forwardemail.net`
   * **Giden sunucu**: `smtp.forwardemail.net`
6. Hem gelen hem giden sunucular için **Kullanıcı adı** olarak tam e-posta adresinizi, **Şifre** olarak oluşturduğunuz şifreyi girin.
7. eM Client bağlantıyı test edecektir. Başarılı olunca **İleri**ye tıklayın.
8. Adınızı girin ve bir hesap adı seçin.
9. **Bitir** butonuna tıklayın.

### Mobil Cihazlar {#mobile-devices}

iOS için:

1. **Ayarlar → Mail → Hesaplar → Hesap Ekle → Diğer** yolunu izleyin
2. **Posta Hesabı Ekle**ye dokunun ve bilgilerinizi girin
3. Sunucu ayarları için yukarıdaki IMAP ve SMTP ayarlarını kullanın

Android için:

1. **Ayarlar → Hesaplar → Hesap Ekle → Kişisel (IMAP)** yolunu izleyin
2. Forward Email adresinizi ve şifrenizi girin
3. Sunucu ayarları için yukarıdaki IMAP ve SMTP ayarlarını kullanın

### Sendmail SMTP Relay Yapılandırması {#sendmail-smtp-relay-configuration}

Sendmail'i, Forward Email'in SMTP sunucuları üzerinden e-posta iletmek için yapılandırabilirsiniz. Bu, Sendmail'e dayanan eski sistemler veya uygulamalar için yaygın bir kurulumdur.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tahmini Kurulum Süresi:</strong>
  <span>20 dakikadan az</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Bu, SMTP erişimi etkinleştirilmiş ücretli bir plan gerektirir.
  </span>
</div>

#### Yapılandırma {#configuration}

1. Genellikle `/etc/mail/sendmail.mc` konumunda bulunan `sendmail.mc` dosyanızı düzenleyin:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. Akıllı sunucuyu ve kimlik doğrulamayı tanımlamak için aşağıdaki satırları ekleyin:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. `/etc/mail/authinfo` kimlik doğrulama dosyasını oluşturun:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. Forward Email kimlik bilgilerinizi `authinfo` dosyasına ekleyin:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. Kimlik doğrulama veritabanını oluşturun ve dosyaların izinlerini güvenli hale getirin:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. Sendmail yapılandırmasını yeniden oluşturun ve servisi yeniden başlatın:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### Test Etme {#testing}

Yapılandırmayı doğrulamak için test e-postası gönderin:

```bash
echo "Sendmail'den test e-postası" | mail -s "Sendmail Testi" recipient@example.com
```

### Exim4 SMTP Relay Yapılandırması {#exim4-smtp-relay-configuration}

Exim4, Debian tabanlı sistemlerde popüler bir MTA'dır. Forward Email'i akıllı sunucu (smarthost) olarak kullanacak şekilde yapılandırabilirsiniz.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tahmini Kurulum Süresi:</strong>
  <span>15 dakikadan az</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Bu, SMTP erişimi etkinleştirilmiş ücretli bir plan gerektirir.
  </span>
</div>

#### Yapılandırma {#configuration-1}

1. Exim4 yapılandırma aracını çalıştırın:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. Aşağıdaki seçenekleri seçin:
   * **Genel posta yapılandırma türü:** smarthost tarafından gönderilen posta; SMTP veya fetchmail ile alınan
   * **Sistem posta adı:** your.hostname
   * **Gelen SMTP bağlantıları için dinlenecek IP adresleri:** 127.0.0.1 ; ::1
   * **Posta kabul edilen diğer hedefler:** (boş bırakın)
   * **Posta iletimi yapılacak alan adları:** (boş bırakın)
   * **Giden smarthost'un IP adresi veya ana bilgisayar adı:** smtp.forwardemail.net::465
   * **Giden postada yerel posta adını gizle?** Hayır
   * **DNS sorgularını minimumda tut (Talep Üzerine Arama)?** Hayır
   * **Yerel posta teslim yöntemi:** /var/mail/ içinde Mbox formatı
   * **Yapılandırmayı küçük dosyalara böl?** Hayır

3. Kimlik bilgilerinizi eklemek için `passwd.client` dosyasını düzenleyin:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. Aşağıdaki satırı ekleyin:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. Yapılandırmayı güncelleyin ve Exim4'ü yeniden başlatın:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### Test Etme {#testing-1}

Test e-postası gönderin:

```bash
echo "Exim4'ten test" | mail -s "Exim4 Testi" recipient@example.com
```

### msmtp SMTP İstemcisi Yapılandırması {#msmtp-smtp-client-configuration}

msmtp, betiklerden veya komut satırı uygulamalarından e-posta göndermek için kullanışlı hafif bir SMTP istemcisidir.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tahmini Kurulum Süresi:</strong>
  <span>10 dakikadan az</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Bu, SMTP erişimi etkinleştirilmiş ücretli bir plan gerektirir.
  </span>
</div>

#### Yapılandırma {#configuration-2}

1. `~/.msmtprc` dosyasını oluşturun veya düzenleyin:

   ```bash
   nano ~/.msmtprc
   ```

2. Aşağıdaki yapılandırmayı ekleyin:

   ```
   defaults
   auth           on
   tls            on
   tls_trust_file /etc/ssl/certs/ca-certificates.crt
   logfile        ~/.msmtp.log

   account        forwardemail
   host           smtp.forwardemail.net
   port           465
   tls_starttls   off
   from           your-alias@yourdomain.com
   user           your-alias@yourdomain.com
   password       your-generated-password

   account default : forwardemail
   ```

3. Yapılandırma dosyasına doğru izinleri verin:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### Test Etme {#testing-2}

Test amaçlı bir e-posta gönderin:

```bash
echo "This is a test email from msmtp" | msmtp -a default recipient@example.com
```

### Komut Satırı E-posta İstemcileri {#command-line-email-clients}

[Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org) ve [Alpine](https://alpine.x10.mx/alpine/release/) gibi popüler komut satırı e-posta istemcileri, Forward Email'in SMTP sunucularını kullanacak şekilde yapılandırılabilir. Yapılandırma, SMTP sunucu bilgilerini ve kimlik bilgilerinizi ilgili yapılandırma dosyalarına (`.muttrc`, `.neomuttrc` veya `.pinerc`) girmeniz gereken `msmtp` ayarlarına benzer olacaktır.

### Windows E-posta Yapılandırması {#windows-email-configuration}

Windows kullanıcıları için, Forward Email hesabınızda sağlanan IMAP ve SMTP ayarlarını kullanarak **Microsoft Outlook** ve **eM Client** gibi popüler e-posta istemcilerini yapılandırabilirsiniz. Komut satırı veya betik kullanımı için PowerShell'in `Send-MailMessage` cmdlet'ini (eskimiş olarak kabul edilir) veya [E-MailRelay](https://github.com/graeme-walker/emailrelay) gibi hafif bir SMTP röle aracı kullanabilirsiniz.

### Postfix SMTP Röle Yapılandırması {#postfix-smtp-relay-configuration}

Postfix'i, e-postaları Forward Email'in SMTP sunucuları üzerinden iletecek şekilde yapılandırabilirsiniz. Bu, e-posta göndermesi gereken sunucu uygulamaları için faydalıdır.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tahmini Kurulum Süresi:</strong>
  <span>15 dakikadan az</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Bu, SMTP erişimi etkinleştirilmiş ücretli bir plan gerektirir.
  </span>
</div>

#### Kurulum {#installation}

1. Sunucunuza Postfix'i kurun:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Kurulum sırasında yapılandırma türü sorulduğunda "Internet Site" seçeneğini seçin.

#### Yapılandırma {#configuration-3}

1. Postfix ana yapılandırma dosyasını düzenleyin:

```bash
sudo nano /etc/postfix/main.cf
```

2. Bu ayarları ekleyin veya değiştirin:

```
# SMTP röle yapılandırması
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. SASL parola dosyasını oluşturun:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Forward Email kimlik bilgilerinizi ekleyin:

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
```

5. Parola dosyasını güvenli hale getirin ve hash'leyin:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Postfix'i yeniden başlatın:

```bash
sudo systemctl restart postfix
```

#### Test Etme {#testing-3}

Yapılandırmanızı test etmek için test e-postası gönderin:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

### Gmail Kullanarak Mail Gönderme {#how-to-send-mail-as-using-gmail}
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tahmini Kurulum Süresi:</strong>
  <span>10 dakikadan az</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Başlarken:
  </strong>
  <span>
    Eğer yukarıdaki <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Başlarken ve e-posta yönlendirmeyi nasıl kurarım</a> başlığı altındaki talimatları takip ettiyseniz, aşağıyı okumaya devam edebilirsiniz.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Lütfen <a href="/terms" class="alert-link" target="_blank">Şartlarımızı</a>, <a href="/privacy" class="alert-link" target="_blank">Gizlilik Politikamızı</a> ve <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Giden SMTP Limitlerini</a> okuduğunuzdan emin olun – kullanmanız, kabul ve onayınız olarak değerlendirilir.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Eğer bir geliştiriciyseniz, lütfen <a class="alert-link" href="/email-api#outbound-emails" target="_blank">e-posta API dokümanlarımıza</a> bakınız.
  </span>
</div>

1. <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Ayarlar <i class="fa fa-angle-right"></i> Giden SMTP Yapılandırması sayfasına gidin ve kurulum talimatlarını takip edin

2. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar altında alan adınız için yeni bir takma ad oluşturun (örneğin <code><hello@example.com></code>)

3. Yeni oluşturduğunuz takma adın yanında bulunan <strong class="text-success"><i class="fa fa-key"></i> Şifre Oluştur</strong> butonuna tıklayın. Ekranda gösterilen oluşturulan şifreyi panonuza kopyalayın ve güvenli bir şekilde saklayın.

4. [Gmail](https://gmail.com) sitesine gidin ve [Ayarlar <i class="fa fa-angle-right"></i> Hesaplar ve İçe Aktarma <i class="fa fa-angle-right"></i> Farklı adresten posta gönder](https://mail.google.com/mail/u/0/#settings/accounts) bölümünde "Başka bir e-posta adresi ekle" seçeneğine tıklayın

5. "İsim" istendiğinde, e-postanızın "Gönderen" olarak görünmesini istediğiniz ismi girin (örneğin "Linus Torvalds").

6. "E-posta adresi" istendiğinde, <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar altında oluşturduğunuz tam takma ad e-posta adresini girin (örneğin <code><hello@example.com></code>)

7. "Takma ad olarak işle" seçeneğinin işaretini kaldırın

8. Devam etmek için "Sonraki Adım" butonuna tıklayın

9. "SMTP Sunucusu" istendiğinde, <code>smtp.forwardemail.net</code> yazın ve portu <code>465</code> olarak değiştirin

10. "Kullanıcı adı" istendiğinde, <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar altında oluşturduğunuz tam takma ad e-posta adresini girin (örneğin <code><hello@example.com></code>)

11. "Şifre" istendiğinde, yukarıdaki 3. adımda <strong class="text-success"><i class="fa fa-key"></i> Şifre Oluştur</strong> ile oluşturduğunuz şifreyi yapıştırın

12. "SSL kullanarak güvenli bağlantı" seçeneğini işaretleyin

13. Devam etmek için "Hesap Ekle" butonuna tıklayın

14. Yeni bir sekmede [Gmail](https://gmail.com) açın ve doğrulama e-postanızın gelmesini bekleyin (göndermeye çalıştığınız e-posta adresinin sahibi olduğunuzu doğrulayan bir doğrulama kodu alacaksınız)

15. Doğrulama kodu geldiğinde, önceki adımda size sorulan alana kodu kopyalayıp yapıştırın
16. Bunu yaptıktan sonra, e-postaya geri dönün ve "isteği onayla" bağlantısına tıklayın. E-postanın doğru yapılandırılması için muhtemelen bu adımı ve önceki adımı yapmanız gerekecektir.

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Tebrikler!
    </strong>
    <span>
      Tüm adımları başarıyla tamamladınız.
    </span>
  </div>
</div>

</div>

### Gmail kullanarak Gönderilen Posta olarak Eski Ücretsiz Rehber Nedir? {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Önemli:</strong> Bu eski ücretsiz rehber Mayıs 2023 itibarıyla kullanımdan kaldırılmıştır çünkü <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">artık giden SMTP desteği sağlıyoruz</a>. Aşağıdaki rehberi kullanırsanız, <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">giden e-postalarınız Gmail'de "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" olarak görünecektir.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tahmini Kurulum Süresi:</strong>
  <span>10 dakikadan az</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Başlarken:
  </strong>
  <span>
    Eğer yukarıdaki <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Nasıl Başlanır ve E-posta Yönlendirme Kurulur</a> başlığı altındaki talimatları takip ettiyseniz, aşağıdaki okumaya devam edebilirsiniz.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="Gmail kullanarak Gönderilen Posta olarak Gönderme" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Bunun çalışması için [Gmail'in İki Faktörlü Kimlik Doğrulaması][gmail-2fa] etkin olmalıdır. Etkin değilse <https://www.google.com/landing/2step/> adresini ziyaret edin.

2. İki Faktörlü Kimlik Doğrulama etkinleştirildikten sonra (veya zaten etkinse), <https://myaccount.google.com/apppasswords> adresine gidin.

3. "Uygulama ve cihaz seçin" istendiğinde:
   * "Uygulama seç" açılır menüsünden "Mail"i seçin
   * "Cihaz seç" açılır menüsünden "Diğer"i seçin
   * Metin girişi istendiğinde, yönlendirdiğiniz özel alan adınızın e-posta adresini girin (örneğin <code><hello@example.com></code> - bu, bu hizmeti birden fazla hesap için kullanıyorsanız takip etmenize yardımcı olur)

4. Otomatik oluşturulan şifreyi panonuza kopyalayın
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Önemli:
     </strong>
     <span>
       G Suite kullanıyorsanız, yönetici panelinize gidin <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Uygulamalar <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Gmail Ayarları <i class="fa fa-angle-right"></i> Ayarlar</a> ve "Kullanıcıların harici SMTP sunucusu üzerinden posta göndermesine izin ver" seçeneğini işaretlediğinizden emin olun. Bu değişikliğin etkinleşmesi için biraz gecikme olabilir, lütfen birkaç dakika bekleyin.
     </span>
   </div>

5. [Gmail](https://gmail.com) adresine gidin ve [Ayarlar <i class="fa fa-angle-right"></i> Hesaplar ve İçe Aktarma <i class="fa fa-angle-right"></i> Gönderilen posta olarak gönder](https://mail.google.com/mail/u/0/#settings/accounts) altında "Başka bir e-posta adresi ekle"ye tıklayın

6. "İsim" istendiğinde, e-postanızın "Kimden" olarak görünmesini istediğiniz ismi girin (örneğin "Linus Torvalds")

7. "E-posta adresi" istendiğinde, yukarıda kullandığınız özel alan adınızın e-posta adresini girin (örneğin <code><hello@example.com></code>)
8. "Takma ad olarak işle" seçeneğinin işaretini kaldırın

9. Devam etmek için "Sonraki Adım" butonuna tıklayın

10. "SMTP Sunucusu" istendiğinde, <code>smtp.gmail.com</code> yazın ve portu <code>587</code> olarak bırakın

11. "Kullanıcı Adı" istendiğinde, Gmail adresinizin <span>gmail.com</span> kısmı olmadan kalan bölümünü girin (örneğin, e-posta adresim <span><user@gmail.com></span> ise sadece "user")
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        Önemli:
      </strong>
      <span>
        Eğer "Kullanıcı Adı" kısmı otomatik doldurulursa, <u><strong>bunu Gmail adresinizin kullanıcı adı kısmı ile değiştirmeniz gerekir</strong></u>.
      </span>
    </div>

12. "Parola" istendiğinde, yukarıdaki 2. adımda oluşturduğunuz parolayı panonuzdan yapıştırın

13. "TLS kullanarak güvenli bağlantı" radyo düğmesinin işaretli kaldığından emin olun

14. Devam etmek için "Hesap Ekle" butonuna tıklayın

15. Yeni bir sekme açarak [Gmail](https://gmail.com) adresine gidin ve doğrulama e-postanızın gelmesini bekleyin (göndermeye çalıştığınız e-posta adresinin sahibi olduğunuzu doğrulayan bir doğrulama kodu alacaksınız)

16. E-posta geldiğinde, önceki adımda istenen doğrulama kodunu kopyalayıp yapıştırın

17. Bunu yaptıktan sonra, e-postaya geri dönüp "isteği onayla" bağlantısına tıklayın. E-postanın doğru yapılandırılması için muhtemelen bu adımı ve önceki adımı yapmanız gerekecektir.

</div>

### Gelişmiş Gmail Yönlendirme Yapılandırması {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tahmini Kurulum Süresi:</strong>
  <span>15-30 dakika</span>
</div>

Gmail'de, posta kutusuyla eşleşmeyen takma adların Forward Email'in posta değişimlerine yönlendirilmesi için gelişmiş yönlendirme ayarlamak istiyorsanız, şu adımları izleyin:

1. Google Yönetici konsolunuza [admin.google.com](https://admin.google.com) adresinden giriş yapın
2. **Uygulamalar → Google Workspace → Gmail → Yönlendirme** bölümüne gidin
3. **Yönlendirme Ekle** butonuna tıklayın ve aşağıdaki ayarları yapılandırın:

**Tek Alıcı Ayarları:**

* "Zarf alıcısını değiştir" seçeneğini seçin ve birincil Gmail adresinizi girin
* "Orijinal alıcı ile X-Gm-Original-To başlığı ekle" seçeneğini işaretleyin

**Zarf Alıcı Desenleri:**

* Var olmayan tüm posta kutularını eşleyecek bir desen ekleyin (örneğin, `.*@yourdomain.com`)

**E-posta Sunucusu Ayarları:**

* "Sunucuya yönlendir" seçeneğini seçin ve birincil sunucu olarak `mx1.forwardemail.net` girin
* Yedek sunucu olarak `mx2.forwardemail.net` ekleyin
* Portu 25 olarak ayarlayın
* Güvenlik için "TLS Gerektir" seçeneğini seçin

4. Yönlendirmeyi oluşturmak için **Kaydet** butonuna tıklayın

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Bu yapılandırma yalnızca özel alan adlarına sahip Google Workspace hesapları için geçerlidir, normal Gmail hesapları için çalışmaz.
  </span>
</div>

### Gelişmiş Outlook Yönlendirme Yapılandırması {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tahmini Kurulum Süresi:</strong>
  <span>15-30 dakika</span>
</div>

Microsoft 365 (eski adıyla Office 365) kullanıcıları için, posta kutusuyla eşleşmeyen takma adların Forward Email'in posta değişimlerine yönlendirilmesi için gelişmiş yönlendirme ayarlamak isteyenler:

1. Microsoft 365 yönetici merkezine [admin.microsoft.com](https://admin.microsoft.com) adresinden giriş yapın
2. **Exchange → Posta akışı → Kurallar** bölümüne gidin
3. **Kural ekle** butonuna tıklayın ve **Yeni kural oluştur** seçeneğini seçin
4. Kuralınıza bir isim verin (örneğin, "Var olmayan posta kutularını Forward Email'e yönlendir")
5. **Bu kuralı uygula eğer** kısmında:
   * "Alıcı adresi eşleşiyor..." seçeneğini seçin
   * Alanınızdaki tüm adresleri eşleyecek bir desen girin (örneğin, `*@yourdomain.com`)
6. **Şunu yap** kısmında:
   * "Mesajı yönlendir..." seçeneğini seçin
   * "Aşağıdaki posta sunucusu"nu seçin
   * `mx1.forwardemail.net` ve port 25 girin
   * Yedek sunucu olarak `mx2.forwardemail.net` ekleyin
7. **Hariç tut** kısmında:
   * "Alıcı..." seçeneğini seçin
   * Yönlendirilmemesi gereken tüm mevcut posta kutularınızı ekleyin
8. Kural önceliğini, diğer posta akışı kurallarından sonra çalışacak şekilde ayarlayın
9. Kuralı etkinleştirmek için **Kaydet** butonuna tıklayın
## Sorun Giderme {#troubleshooting}

### Test e-postalarımı neden almıyorum? {#why-am-i-not-receiving-my-test-emails}

Kendinize test e-postası gönderiyorsanız, gelen kutunuzda görünmeyebilir çünkü aynı "Message-ID" başlığına sahiptir.

Bu yaygın bilinen bir sorundur ve Gmail gibi hizmetleri de etkiler.  <a href="https://support.google.com/a/answer/1703601">Bu konuda resmi Gmail cevabı burada</a>.

Sorun yaşamaya devam ediyorsanız, muhtemelen DNS yayılımı ile ilgili bir sorundur. Biraz daha beklemeniz ve tekrar denemeniz (veya <strong class="notranslate">TXT</strong> kayıtlarınızda daha düşük bir TTL değeri ayarlamayı denemeniz) gerekecektir.

**Hala sorun mu yaşıyorsunuz?**  Lütfen <a href="/help">bizimle iletişime geçin</a>, böylece sorunu araştırıp hızlı bir çözüm bulabiliriz.

### E-posta istemcimi Forward Email ile çalışacak şekilde nasıl yapılandırırım? {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  Hizmetimiz şu popüler e-posta istemcileri ile çalışır:
  <ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
    <li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Masaüstü</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Terminal</a></li>
  </ul>
</div>

<div class="alert alert-primary">
  Kullanıcı adınız takma adınızın e-posta adresidir ve şifreniz <strong class="text-success"><i class="fa fa-key"></i> Şifre Oluştur</strong> ("Normal Şifre") bölümünden alınır.
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    İpucu:
  </strong>
  <span>Thunderbird kullanıyorsanız, "Bağlantı güvenliği"nin "SSL/TLS" olarak ve Kimlik doğrulama yönteminin "Normal şifre" olarak ayarlandığından emin olun.</span>
</div>

| Tür  |         Sunucu Adı        |         Protokol        |                                            Portlar                                           |
| :--: | :-----------------------: | :---------------------: | :------------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net`   |  SSL/TLS **Tercih Edilen**  |                                      `993` ve `2993`                                        |
| SMTP | `smtp.forwardemail.net`   | SSL/TLS **Önerilen**    | SSL/TLS için `465` ve `2465` (önerilen) veya STARTTLS için `587`, `2587`, `2525` ve `25`     |

### E-postalarım neden Spam ve Gereksiz klasörüne düşüyor ve alan adı itibarımı nasıl kontrol edebilirim? {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
Bu bölüm, giden postanızın SMTP sunucularımızı kullanması durumunda (örneğin `smtp.forwardemail.net`) (veya `mx1.forwardemail.net` ya da `mx2.forwardemail.net` üzerinden iletilmesi) ve alıcıların Spam veya Gereksiz posta klasörüne düşmesi halinde size rehberlik eder.

Biz rutin olarak [IP adreslerimizi](#what-are-your-servers-ip-addresses) [tüm saygın DNS kara listelerine](#how-do-you-handle-your-ip-addresses-becoming-blocked) karşı izliyoruz, **bu nedenle muhtemelen alan adı itibarıyla ilgili spesifik bir sorundur**.

E-postalar çeşitli nedenlerle spam klasörüne düşebilir:

1. **Kimlik Doğrulama Eksikliği**: [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) ve [DMARC](#how-do-i-set-up-dmarc-for-forward-email) kayıtlarını ayarlayın.

2. **Alan Adı İtibarı**: Yeni alan adları, gönderim geçmişi oluşturana kadar genellikle nötr bir itibara sahiptir.

3. **İçerik Tetikleyicileri**: Belirli kelimeler veya ifadeler spam filtrelerini tetikleyebilir.

4. **Gönderim Desenleri**: E-posta hacmindeki ani artışlar şüpheli görünebilir.

Alan adınızın itibarını ve kategorilendirmesini kontrol etmek için bir veya daha fazla aracı kullanmayı deneyebilirsiniz:

#### İtibar ve Kara Liste Kontrol Araçları {#reputation-and-blocklist-check-tools}

| Araç Adı                                   | URL                                                          | Tür                     |
| ------------------------------------------- | ------------------------------------------------------------ | ------------------------ |
| Cloudflare Alan Adı Kategorilendirme Geri Bildirimi   | <https://radar.cloudflare.com/domains/feedback>              | Kategorilendirme         |
| Spamhaus IP ve Alan Adı İtibar Kontrolü   | <https://check.spamhaus.org/>                                | DNSBL                    |
| Cisco Talos IP ve Alan Adı İtibar Merkezi | <https://talosintelligence.com/reputation_center>            | İtibar                   |
| Barracuda IP ve Alan Adı İtibar Sorgulama   | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                    |
| MX Toolbox Kara Liste Kontrolü              | <https://mxtoolbox.com/blacklists.aspx>                      | Kara Liste               |
| Google Postmaster Araçları                  | <https://www.gmail.com/postmaster/>                          | İtibar                   |
| Yahoo Gönderici Merkezi                     | <https://senders.yahooinc.com/>                              | İtibar                   |
| MultiRBL.valli.org Kara Liste Kontrolü      | <https://multirbl.valli.org/lookup/>                         | DNSBL                    |
| Sender Score                                | <https://senderscore.org/act/blocklist-remover/>             | İtibar                   |
| Invaluement                                 | <https://www.invaluement.com/lookup/>                        | DNSBL                    |
| SURBL                                       | <https://www.surbl.org/>                                     | DNSBL                    |
| SpamCop                                     | <https://www.spamcop.net/bl.shtml>                           | DNSBL                    |
| UCEPROTECT Seviyeleri 1, 2 ve 3             | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                    |
| UCEPROTECT backscatterer.org                 | <https://www.backscatterer.org/>                             | Backscatter Koruması     |
| UCEPROTECT whitelisted.org                   | <https://www.whitelisted.org/> (ücret gerektirir)            | DNSWL                    |

#### Sağlayıcı Bazında IP Kaldırma Talep Formları {#ip-removal-request-forms-by-provider}

IP adresiniz belirli bir e-posta sağlayıcısı tarafından engellendiyse, uygun kaldırma formunu veya iletişim bilgisini kullanın:

| Sağlayıcı                               | Kaldırma Formu / İletişim                                                                                     | Notlar                                        |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Google/Gmail                           | <https://support.google.com/mail/contact/bulk_send_new>                                                    | Toplu gönderici iletişim formu               |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                | Office 365 IP kara liste kaldırma portalı    |
| Yahoo/AOL/Verizon                      | <https://senders.yahooinc.com/>                                                                            | Yahoo Gönderici Merkezi                       |
| Apple/iCloud                           | <https://ipcheck.proofpoint.com/>                                                                          | Apple, IP itibarı için Proofpoint kullanır   |
| Proofpoint                             | <https://ipcheck.proofpoint.com/>                                                                          | Proofpoint IP kontrol ve kaldırma             |
| Barracuda Networks                     | <https://www.barracudacentral.org/lookups/lookup-reputation>                                               | Barracuda itibar sorgulama ve kaldırma       |
| Cloudmark                              | <https://csi.cloudmark.com/en/reset/>                                                                      | Cloudmark CSI sıfırlama talebi                |
| GoDaddy/SecureServer                   | <https://unblock.secureserver.net>                                                                         | GoDaddy IP engel kaldırma formu               |
| Comcast/Xfinity                        | <https://spa.xfinity.com/report>                                                                           | Comcast IP kaldırma talebi                     |
| Charter/Spectrum                       | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                | Kaldırma için Spectrum destek ile iletişime geçin |
| AT&T                                   | `abuse_rbl@abuse-att.net`                                                                                  | Kaldırma talebi için e-posta                  |
| Cox Communications                     | `unblock.request@cox.net`                                                                                  | Kaldırma talebi için e-posta                  |
| CenturyLink/Lumen                      | `abuse@centurylink.com`                                                                                    | Cloudfilter kullanır                           |
| Windstream                             | `abuse@windstream.net`                                                                                     | Kaldırma talebi için e-posta                  |
| t-online.de (Almanya)                  | `tobr@rx.t-online.de`                                                                                      | Kaldırma talebi için e-posta                  |
| Orange France                          | <https://postmaster.orange.fr/>                                                                            | İletişim formu veya `abuse@orange.fr` e-postası kullanın |
| GMX                                    | <https://postmaster.gmx.net/en/contact>                                                                    | GMX postmaster iletişim formu                  |
| Mail.ru                                | <https://postmaster.mail.ru/>                                                                              | Mail.ru postmaster portalı                     |
| Yandex                                 | <https://postmaster.yandex.ru/>                                                                            | Yandex postmaster portalı                      |
| QQ Mail (Tencent)                      | <https://open.mail.qq.com/>                                                                                | QQ Mail beyaz liste başvurusu (Çince)          |
| Netease (163.com)                      | <https://mail.163.com/postmaster/>                                                                         | Netease postmaster portalı                     |
| Alibaba/Aliyun/HiChina                 | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                       | Alibaba Cloud konsolu üzerinden iletişim       |
| Amazon SES                             | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                               | AWS SES konsolu > Kara Liste Kaldırma          |
| SendGrid                               | <https://support.sendgrid.com/>                                                                            | SendGrid destek ile iletişim                   |
| Mimecast                               | <https://community.mimecast.com/>                                                                          | Üçüncü taraf RBL kullanır - ilgili RBL ile iletişime geçin |
| Fastmail                               | <https://www.fastmail.com/support/>                                                                        | Fastmail destek ile iletişim                   |
| Zoho                                   | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address> | Zoho destek ile iletişim                        |
| ProtonMail                             | <https://proton.me/support/contact>                                                                        | Proton destek ile iletişim                      |
| Tutanota                               | <https://tutanota.com/support>                                                                             | Tutanota destek ile iletişim                    |
| Hushmail                               | <https://www.hushmail.com/support/>                                                                        | Hushmail destek ile iletişim                    |
| Mailbox.org                            | <https://mailbox.org/en/support>                                                                           | Mailbox.org destek ile iletişim                 |
| Posteo                                 | <https://posteo.de/en/site/contact>                                                                        | Posteo destek ile iletişim                      |
| DuckDuckGo Email                       | <https://duckduckgo.com/email/support>                                                                     | DuckDuckGo destek ile iletişim                  |
| Sonic.net                              | <https://www.sonic.com/support>                                                                            | Sonic destek ile iletişim                        |
| Telus                                  | <https://www.telus.com/en/support>                                                                         | Telus destek ile iletişim                        |
| Vodafone Germany                       | <https://www.vodafone.de/hilfe/>                                                                           | Vodafone destek ile iletişim                     |
| Xtra (Spark NZ)                        | <https://www.spark.co.nz/help/>                                                                            | Spark NZ destek ile iletişim                     |
| UOL/BOL (Brezilya)                    | <https://ajuda.uol.com.br/>                                                                                | UOL destek ile iletişim (Portekizce)            |
| Libero (İtalya)                       | <https://aiuto.libero.it/>                                                                                 | Libero destek ile iletişim (İtalyanca)          |
| Telenet (Belçika)                     | <https://www2.telenet.be/en/support/>                                                                      | Telenet destek ile iletişim                      |
| Facebook/WhatsApp                     | <https://www.facebook.com/business/help>                                                                   | Facebook iş destek ile iletişim                  |
| LinkedIn                             | <https://www.linkedin.com/help/linkedin>                                                                   | LinkedIn destek ile iletişim                      |
| Groups.io                            | <https://groups.io/helpcenter>                                                                             | Groups.io destek ile iletişim                     |
| Earthlink/Vade Secure                | <https://sendertool.vadesecure.com/en/>                                                                    | Vade Secure gönderici aracı                      |
| Cloudflare Email Security            | <https://www.cloudflare.com/products/zero-trust/email-security/>                                           | Cloudflare destek ile iletişim                    |
| Hornetsecurity/Expurgate             | <https://www.hornetsecurity.com/>                                                                          | Hornetsecurity destek ile iletişim                |
| SpamExperts/Antispamcloud            | <https://www.spamexperts.com/>                                                                             | Hosting sağlayıcısı üzerinden iletişim           |
| Mail2World                         | <https://www.mail2world.com/support/>                                                                      | Mail2World destek ile iletişim                    |
> \[!TIP]
> Daha büyük hacimlerde göndermeden önce olumlu bir itibar oluşturmak için düşük hacimli yüksek kaliteli e-postalarla başlayın.

> \[!IMPORTANT]
> Alan adınız kara listede ise, her kara listenin kendi kaldırma süreci vardır. Talimatlar için web sitelerini kontrol edin.

> \[!TIP]
> Ek yardıma ihtiyacınız varsa veya belirli bir e-posta hizmet sağlayıcısı tarafından yanlışlıkla spam olarak listelendiğimizi fark ederseniz, lütfen <a href="/help">bizimle iletişime geçin</a>.

### Spam e-postalar alırsam ne yapmalıyım {#what-should-i-do-if-i-receive-spam-emails}

E-posta listesinden (mümkünse) aboneliğinizi iptal etmeli ve göndereni engellemelisiniz.

Lütfen mesajı spam olarak bildirmeyin, bunun yerine manuel olarak seçilmiş ve gizliliğe odaklı kötüye kullanım önleme sistemimize iletin.

**Spam iletileri ileteceğiniz e-posta adresi:** <abuse@forwardemail.net>

### Gmail'de kendime gönderdiğim test e-postaları neden "şüpheli" olarak görünüyor {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Kendinize test gönderdiğinizde veya takma adınızla e-posta gönderdiğiniz bir kişi sizden ilk kez bir e-posta aldığında Gmail'de bu hata mesajını görüyorsanız, **lütfen endişelenmeyin** – çünkü bu Gmail'in yerleşik bir güvenlik özelliğidir.

Basitçe "Güvenli görünüyor" seçeneğine tıklayabilirsiniz. Örneğin, gönder mail olarak özelliğini kullanarak (başkasına) test mesajı gönderirseniz, onlar bu mesajı görmez.

Ancak bu mesajı görürlerse, bunun nedeni genellikle e-postalarınızı <john@gmail.com> yerine <john@customdomain.com> (sadece bir örnek) adresinden almaya alışkın olmalarıdır. Gmail, her ihtimale karşı kullanıcıları güvende olduklarından emin olmak için uyarır, bunun için bir çözüm yolu yoktur.

### Gmail'de via forwardemail dot net ifadesini kaldırabilir miyim {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Bu konu, [Gmail'de gönderen adının yanında ekstra bilgi görünmesiyle ilgili yaygın bir sorunla](https://support.google.com/mail/answer/1311182) ilgilidir.

Mayıs 2023 itibarıyla tüm ücretli kullanıcılar için SMTP ile e-posta gönderimini bir eklenti olarak destekliyoruz – bu da Gmail'de <span class="notranslate">via forwardemail dot net</span> ifadesini kaldırabileceğiniz anlamına gelir.

Bu SSS konusu, [Gmail kullanarak posta gönderme nasıl yapılır](#how-to-send-mail-as-using-gmail) özelliğini kullananlar için özeldir.

Yapılandırma talimatları için lütfen [SMTP ile e-posta göndermeyi destekliyor musunuz](#do-you-support-sending-email-with-smtp) bölümüne bakın.


## Veri Yönetimi {#data-management}

### Sunucularınız nerede bulunuyor {#where-are-your-servers-located}

> \[!TIP]
> Yakında [forwardemail.eu](https://forwardemail.eu) altında barındırılan AB veri merkezi konumumuzu duyurabiliriz. Güncellemeler için <https://github.com/orgs/forwardemail/discussions/336> adresindeki tartışmaya abone olun.

Sunucularımız öncelikle Denver, Colorado'da bulunmaktadır – IP adreslerimizin tam listesi için <https://forwardemail.net/ips> adresine bakabilirsiniz.

Alt işlemcilerimiz hakkında bilgi edinmek için [GDPR](/gdpr), [DPA](/dpa) ve [Gizlilik](/privacy) sayfalarımıza göz atabilirsiniz.

### Posta kutumu nasıl dışa aktarır ve yedeklerim {#how-do-i-export-and-backup-my-mailbox}

Her zaman posta kutularınızı [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) veya şifrelenmiş [SQLite](https://en.wikipedia.org/wiki/SQLite) formatlarında dışa aktarabilirsiniz.

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar <i class="fa fa-angle-right"></i> Yedeklemeyi İndir bölümüne gidin ve tercih ettiğiniz dışa aktarma formatını seçin.

Dışa aktarma tamamlandığında indirmeniz için bir bağlantı e-posta ile gönderilecektir.

Güvenlik nedeniyle bu dışa aktarma indirme bağlantısının 4 saat sonra süresi dolar.

Dışa aktardığınız EML veya Mbox formatlarını incelemeniz gerekirse, bu açık kaynak araçlar faydalı olabilir:

| İsim            | Format | Platform      | GitHub URL                                          |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox Viewer     |  Mbox  | Windows       | <https://github.com/eneam/mboxviewer>               |
| mbox-web-viewer |  Mbox  | Tüm platformlar | <https://github.com/PHMRanger/mbox-web-viewer>      |
| EmlReader       |   EML  | Windows       | <https://github.com/ayamadori/EmlReader>            |
| Email viewer    |   EML  | VSCode        | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-reader      |   EML  | Tüm platformlar | <https://github.com/s0ph1e/eml-reader>              |
Ayrıca, bir Mbox dosyasını EML dosyasına dönüştürmeniz gerekiyorsa, <https://github.com/noelmartinon/mboxzilla> adresini kullanabilirsiniz.

### Mevcut posta kutumu nasıl içe aktarır ve taşırım {#how-do-i-import-and-migrate-my-existing-mailbox}

E-postanızı Forward Email'e (örneğin [Thunderbird](https://www.thunderbird.net) kullanarak) aşağıdaki talimatlarla kolayca içe aktarabilirsiniz:

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Mevcut e-postanızı içe aktarmak için aşağıdaki tüm adımları takip etmelisiniz.
  </span>
</div>

1. E-postanızı mevcut e-posta sağlayıcınızdan dışa aktarın:

   | E-posta Sağlayıcısı | Dışa Aktarma Formatı                           | Dışa Aktarma Talimatları                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | ------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail               | MBOX                                           | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook             | PST                                            | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">İpucu:</strong> <span>Eğer Outlook kullanıyorsanız (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST dışa aktarma formatı</a>), aşağıda "Diğer" başlığı altındaki talimatları takip edebilirsiniz. Ancak, işletim sisteminize göre PST'yi MBOX/EML formatına dönüştürmek için aşağıdaki bağlantıları sağladık:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Windows için Zinkuba</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">Windows cygwin için readpst</a> – (örneğin <code>readpst -u -o $OUT_DIR $IN_DIR</code>, burada <code>$OUT_DIR</code> ve <code>$IN_DIR</code> sırasıyla çıktı ve giriş dizini yollarıyla değiştirilmelidir).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">Ubuntu/Linux için readpst</a> – (örneğin <code>sudo apt-get install readpst</code> ve ardından <code>readpst -u -o $OUT_DIR $IN_DIR</code>, burada <code>$OUT_DIR</code> ve <code>$IN_DIR</code> sırasıyla çıktı ve giriş dizini yollarıyla değiştirilmelidir).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">macOS için readpst (brew ile)</a> – (örneğin <code>brew install libpst</code> ve ardından <code>readpst -u -o $OUT_DIR $IN_DIR</code>, burada <code>$OUT_DIR</code> ve <code>$IN_DIR</code> sırasıyla çıktı ve giriş dizini yollarıyla değiştirilmelidir).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">Windows için PST Converter (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail          | MBOX                                           | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail            | EML                                            | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail         | MBOX/EML                                       | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota            | EML                                            | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi               | EML                                            | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho                | EML                                            | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | Diğer               | [Thunderbird kullanın](https://www.thunderbird.net) | Mevcut e-posta hesabınızı Thunderbird'de kurun ve ardından e-postanızı dışa aktarmak ve içe aktarmak için [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) eklentisini kullanın.  **Ayrıca, e-postaları bir hesaptan diğerine kopyalayıp yapıştırabilir veya sürükleyip bırakabilirsiniz.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. İndirin, kurun ve açın [Thunderbird](https://www.thunderbird.net).

3. Takma adınızın tam e-posta adresini (örneğin <code><you@yourdomain.com></code>) ve oluşturduğunuz şifreyi kullanarak yeni bir hesap oluşturun.  <strong>Henüz oluşturulmuş bir şifreniz yoksa, <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">kurulum talimatlarımıza bakın</a></strong>.

4. [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird eklentisini indirin ve kurun.

5. Thunderbird'de yeni bir yerel klasör oluşturun, ardından sağ tıklayın → `ImportExportTools NG` seçeneğini seçin → `Import mbox file` (MBOX dışa aktarma formatı için) – veya – `Import messages` / `Import all messages from a directory` (EML dışa aktarma formatı için) seçeneklerinden birini seçin.

6. Yerel klasörden, mesajları IMAP depolama alanımıza yüklemek istediğiniz yeni (veya mevcut) bir IMAP klasörüne sürükleyip bırakın.  Bu, mesajların SQLite şifreli depolamamızla çevrimiçi olarak yedeklenmesini sağlar.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       İpucu:
     </strong>
     <span>
       Thunderbird'e nasıl içe aktarılacağı konusunda kafanız karışıksa, resmi talimatlara <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> ve <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a> adreslerinden bakabilirsiniz.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Dışa aktarma ve içe aktarma işlemini tamamladıktan sonra, mevcut e-posta hesabınızda yönlendirmeyi etkinleştirmek ve göndericilere yeni bir e-posta adresiniz olduğunu bildirmek için otomatik yanıtlayıcı kurmak isteyebilirsiniz (örneğin, daha önce Gmail kullanıyorsanız ve şimdi özel alan adınızla bir e-posta kullanıyorsanız).
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Tebrikler!
    </strong>
    <span>
      Tüm adımları başarıyla tamamladınız.
    </span>
  </div>
</div>

### Yedeklemeler için kendi S3 uyumlu depolamamı nasıl kullanırım {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

Ücretli plan kullanıcıları, IMAP/SQLite yedeklemeleri için alan bazında kendi [S3](https://en.wikipedia.org/wiki/Amazon_S3)-uyumlu depolama sağlayıcılarını yapılandırabilirler.  Bu, şifrelenmiş posta kutusu yedeklerinizin varsayılan depolamamız yerine (veya ek olarak) kendi altyapınızda saklanabileceği anlamına gelir.

Desteklenen sağlayıcılar arasında [Amazon S3](https://aws.amazon.com/s3/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [MinIO](https://github.com/minio/minio), [Backblaze B2](https://www.backblaze.com/cloud-storage), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) ve diğer tüm S3 uyumlu servisler bulunmaktadır.

#### Kurulum {#setup}

1. S3 uyumlu sağlayıcınızda **özel** bir bucket oluşturun. Bucket genel erişime açık olmamalıdır.
2. Bucket için okuma/yazma izinlerine sahip erişim kimlik bilgileri (erişim anahtarı kimliği ve gizli erişim anahtarı) oluşturun.
3. <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Gelişmiş Ayarlar <i class="fa fa-angle-right"></i> Özel S3-Uyumlu Depolama sayfasına gidin.
4. **"Özel S3-uyumlu depolamayı etkinleştir"** seçeneğini işaretleyin ve uç nokta URL'si, erişim anahtarı kimliği, gizli erişim anahtarı, bölge ve bucket adını doldurun.
5. Kimlik bilgilerinizi, bucket erişimini ve yazma izinlerini doğrulamak için **"Bağlantıyı Test Et"** butonuna tıklayın.
6. Ayarları uygulamak için **"Kaydet"** butonuna tıklayın.

#### Yedeklemeler Nasıl Çalışır {#how-backups-work}

Yedeklemeler, bağlı her IMAP takma adı için otomatik olarak tetiklenir. IMAP sunucusu, her saat aktif tüm bağlantıları kontrol eder ve bağlı her takma ad için yedekleme başlatır. Redis tabanlı bir kilit, yedeklemelerin birbirinden 30 dakika içinde tekrar çalışmasını engeller ve son 24 saat içinde başarılı bir yedekleme tamamlandıysa (kullanıcı tarafından indirme için açıkça istenmedikçe) yedekleme atlanır.
Yedeklemeler, kontrol panelindeki herhangi bir takma ad için **"Yedeği İndir"** butonuna tıklanarak manuel olarak da tetiklenebilir. Manuel yedeklemeler, 24 saatlik pencereye bakılmaksızın her zaman çalışır.

Yedekleme süreci şu şekilde işler:

1. SQLite veritabanı, aktif bağlantıları kesintiye uğratmadan tutarlı bir anlık görüntü oluşturan ve veritabanı şifrelemesini koruyan `VACUUM INTO` kullanılarak kopyalanır.
2. Yedek dosyası, şifrelemenin hala geçerli olduğunu doğrulamak için açılarak kontrol edilir.
3. Bir SHA-256 karması hesaplanır ve depolamadaki mevcut yedekle karşılaştırılır. Karma eşleşirse, yükleme atlanır (son yedeklemeden beri değişiklik yok).
4. Yedek, [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage) kütüphanesi aracılığıyla çok parçalı yükleme kullanılarak S3'e yüklenir.
5. İmzalı bir indirme URL'si (4 saat geçerli) oluşturulur ve kullanıcıya e-posta ile gönderilir.

#### Yedekleme Formatları {#backup-formats}

Üç yedekleme formatı desteklenir:

| Format   | Uzantı   | Açıklama                                                                    |
| -------- | -------- | --------------------------------------------------------------------------- |
| `sqlite` | `.sqlite`| Ham şifreli SQLite veritabanı anlık görüntüsü (otomatik IMAP yedekleri için varsayılan) |
| `mbox`   | `.zip`   | mbox formatında posta kutusunu içeren parola korumalı ZIP                   |
| `eml`    | `.zip`   | Her mesaj için ayrı `.eml` dosyaları içeren parola korumalı ZIP             |

> **İpucu:** `.sqlite` yedek dosyalarınız varsa ve bunları yerel olarak `.eml` dosyalarına dönüştürmek istiyorsanız, bağımsız CLI aracımız **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**'i kullanabilirsiniz. Windows, Linux ve macOS üzerinde çalışır ve ağ bağlantısı gerektirmez.

#### Dosya Adlandırma ve Anahtar Yapısı {#file-naming-and-key-structure}

**Özel S3 depolama** kullanıldığında, yedek dosyaları her yedeğin ayrı bir nesne olarak saklanmasını sağlamak için [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) zaman damgası öneki ile depolanır. Bu sayede kendi bucket'ınızda tam bir yedek geçmişine sahip olursunuz.

Anahtar formatı:

```
{ISO 8601 timestamp}-{alias_id}.{extension}
```

Örneğin:

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

`alias_id`, takma adın MongoDB ObjectId'sidir. Bunu takma ad ayarları sayfasında veya API üzerinden bulabilirsiniz.

**Varsayılan (sistem) depolama** kullanıldığında, anahtar düz (örneğin `65a31c53c36b75ed685f3fda.sqlite`) olur ve her yedekleme önceki yedeğin üzerine yazar.

> **Not:** Özel S3 depolama tüm yedek sürümlerini sakladığından, depolama kullanımı zamanla artacaktır. Bucket'ınızda eski yedeklerin otomatik olarak süresi dolması için [yaşam döngüsü kuralları](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) yapılandırmanızı öneririz (örneğin 30 veya 90 günden eski nesneleri silmek).

#### Veri Sahipliği ve Silme Politikası {#data-ownership-and-deletion-policy}

Özel S3 bucket'ınız tamamen sizin kontrolünüz altındadır. Takma ad silindiğinde, alan kaldırıldığında veya herhangi bir temizlik işlemi sırasında, özel S3 bucket'ınızdaki dosyaları **asla silmez veya değiştirmeyiz**. Sadece yeni yedek dosyalarını bucket'ınıza yazarız.

Bu şu anlama gelir:

* **Takma ad silme** — Bir takma adı sildiğinizde, yedek sadece varsayılan sistem depolamamızdan kaldırılır. Daha önce özel S3 bucket'ınıza yazılmış yedekler dokunulmadan kalır.
* **Alan kaldırma** — Bir alanı kaldırmak, özel bucket'ınızdaki dosyaları etkilemez.
* **Saklama yönetimi** — Kendi bucket'ınızdaki depolamayı yönetmek, eski yedeklerin süresini dolması için yaşam döngüsü kuralları yapılandırmak sizin sorumluluğunuzdadır.

Özel S3 depolamayı devre dışı bırakırsanız veya varsayılan depolamaya geri dönerseniz, bucket'ınızdaki mevcut dosyalar korunur. Gelecekteki yedekler sadece varsayılan depolamaya yazılır.

#### Güvenlik {#security}

* Erişim anahtarı kimliğiniz ve gizli erişim anahtarınız, veritabanımızda saklanmadan önce [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) kullanılarak **dinlenme halinde şifrelenir**. Yedekleme işlemleri sırasında yalnızca çalışma zamanında şifresi çözülür.
* Bucket'ınızın **herkese açık erişime kapalı** olduğunu otomatik olarak doğrularız. Eğer herkese açık bir bucket tespit edilirse, yapılandırma kaydedilirken reddedilir. Yedekleme sırasında herkese açık erişim algılanırsa, varsayılan depolamaya geri dönülür ve tüm alan yöneticilerine e-posta ile bildirilir.
* Kimlik bilgileri, bucket'ın varlığını ve kimlik bilgilerinin doğruluğunu sağlamak için kaydetme sırasında bir [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html) çağrısı ile doğrulanır. Doğrulama başarısız olursa, özel S3 depolama otomatik olarak devre dışı bırakılır.
* Her yedek dosyası, S3 meta verilerinde bir SHA-256 karması içerir; bu, değişmeyen veritabanlarını tespit etmek ve gereksiz yüklemeleri atlamak için kullanılır.
#### Hata Bildirimleri {#error-notifications}

Özel S3 depolamanızı kullanırken bir yedekleme başarısız olursa (örneğin, süresi dolmuş kimlik bilgileri veya bağlantı sorunu nedeniyle), tüm alan yöneticilerine e-posta ile bildirim gönderilir. Bu bildirimler, yinelenen uyarıları önlemek için her 6 saatte bir sınırlandırılmıştır. Yedekleme sırasında kovanızın herkese açık erişilebilir olduğu tespit edilirse, yöneticilere günde bir kez bildirim gönderilir.

#### API {#api}

Özel S3 depolamanızı API üzerinden de yapılandırabilirsiniz:

```sh
curl -X PUT https://api.forwardemail.net/v1/domains/example.com \
  -u API_TOKEN: \
  -d has_custom_s3=true \
  -d s3_endpoint=https://s3.us-east-1.amazonaws.com \
  -d s3_access_key_id=YOUR_ACCESS_KEY_ID \
  -d s3_secret_access_key=YOUR_SECRET_ACCESS_KEY \
  -d s3_region=us-east-1 \
  -d s3_bucket=my-email-backups
```

API üzerinden bağlantıyı test etmek için:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### SQLite yedeklerini EML dosyalarına nasıl dönüştürürüm {#how-do-i-convert-sqlite-backups-to-eml-files}

SQLite yedeklerini indirir veya depolarsanız (ister varsayılan depolamamızdan ister kendi [özel S3 kovanızdan](#how-do-i-use-my-own-s3-compatible-storage-for-backups)), bunları bağımsız CLI aracımız **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)** ile standart `.eml` dosyalarına dönüştürebilirsiniz. EML dosyaları herhangi bir e-posta istemcisiyle ([Thunderbird](https://www.thunderbird.net/), [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook), [Apple Mail](https://support.apple.com/mail) vb.) açılabilir veya diğer posta sunucularına aktarılabilir.

#### Kurulum {#installation-1}

Önceden derlenmiş bir ikili dosya indirebilir (Node.js gerektirmez) veya doğrudan [Node.js](https://github.com/nodejs/node) ile çalıştırabilirsiniz:

**Önceden derlenmiş ikililer** — Platformunuz için en son sürümü [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases) üzerinden indirin:

| Platform | Mimari        | Dosya                                |
| -------- | ------------- | ------------------------------------ |
| Linux    | x64           | `convert-sqlite-to-eml-linux-x64`    |
| Linux    | arm64         | `convert-sqlite-to-eml-linux-arm64`  |
| macOS    | Apple Silicon | `convert-sqlite-to-eml-darwin-arm64` |
| Windows  | x64           | `convert-sqlite-to-eml-win-x64.exe`  |

> **macOS kullanıcıları:** İndirildikten sonra, ikili dosyayı çalıştırmadan önce karantina özniteliğini kaldırmanız gerekebilir:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (İndirilen dosyanın gerçek yolu ile `./convert-sqlite-to-eml-darwin-arm64` değiştirin.)

> **Linux kullanıcıları:** İndirildikten sonra, ikili dosyayı çalıştırılabilir yapmanız gerekebilir:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (İndirilen dosyanın gerçek yolu ile `./convert-sqlite-to-eml-linux-x64` değiştirin.)

**Kaynak koddan** (gerektirir [Node.js](https://github.com/nodejs/node) >= 18):

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### Kullanım {#usage}

Araç hem etkileşimli hem de etkileşimsiz modları destekler.

**Etkileşimli mod** — argüman olmadan çalıştırın ve tüm girdiler için sizden bilgi istenir:

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - SQLite Yedeğini EML'ye Dönüştür
  =============================================

  SQLite yedek dosyasının yolu: /path/to/backup.sqlite
  IMAP/alias şifresi: ********
  Çıktı ZIP yolu [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**Etkileşimsiz mod** — betikleme ve otomasyon için komut satırı bayraklarıyla argümanları geçin:

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "your-imap-password" \
  --output /path/to/output.zip
```

| Bayrak               | Açıklama                                                                      |
| -------------------- | ----------------------------------------------------------------------------- |
| `--path <path>`      | Şifrelenmiş SQLite yedek dosyasının yolu                                      |
| `--password <pass>`  | Şifre çözme için IMAP/alias şifresi                                           |
| `--output <path>`    | ZIP dosyasının çıktı yolu (varsayılan: ISO 8601 zaman damgası ile otomatik oluşturulur) |
| `--help`             | Yardım mesajını göster                                                        |
#### Çıktı Formatı {#output-format}

Araç, şifre korumalı bir ZIP arşivi (AES-256 şifreli) üretir ve içinde şunlar bulunur:

```
README.txt
INBOX/
  <message-id-1>.eml
  <message-id-2>.eml
Sent/
  <message-id-3>.eml
Drafts/
  <message-id-4>.eml
```

EML dosyaları posta kutusu klasörlerine göre düzenlenmiştir. ZIP şifresi, IMAP/alias şifrenizle aynıdır. Her `.eml` dosyası, SQLite veritabanından yeniden oluşturulmuş tam başlıklar, gövde metni ve eklerle standart bir [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) e-posta mesajıdır.

#### Nasıl Çalışır {#how-it-works}

1. Şifreli SQLite veritabanını IMAP/alias şifrenizle açar ([ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) ve [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) şifrelerini destekler).
2. Klasör yapısını keşfetmek için Mailboxes tablosunu okur.
3. Her mesaj için, Messages tablosunda saklanan [Brotli](https://github.com/google/brotli)-sıkıştırılmış JSON formatındaki mimeTree'yi çözer.
4. MIME ağacını dolaşarak ve eklerin gövdelerini Attachments tablosundan alarak tam EML'yi yeniden oluşturur.
5. Her şeyi [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted) kullanarak şifre korumalı bir ZIP arşivine paketler.

### Kendin Barındırmayı Destekliyor musunuz? {#do-you-support-self-hosting}

Evet, Mart 2025 itibarıyla kendin barındırma seçeneğini destekliyoruz. Blog yazısını [buradan](https://forwardemail.net/blog/docs/self-hosted-solution) okuyabilirsiniz. Başlamak için [kendin barındırma rehberine](https://forwardemail.net/self-hosted) göz atın. Daha ayrıntılı adım adım versiyon için [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) veya [Debian](https://forwardemail.net/guides/selfhosted-on-debian) tabanlı rehberlerimize bakabilirsiniz.


## E-posta Yapılandırması {#email-configuration}

### Nasıl Başlarım ve E-posta Yönlendirmeyi Nasıl Kurarım? {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tahmini Kurulum Süresi:</strong>
  <span>10 dakikadan az</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Başlarken:
  </strong>
  <span>
    Aşağıda listelenen birden sekize kadar olan adımları dikkatlice okuyup takip edin. E-postaların yönlendirileceği adresi (eğer doğru değilse) <code>user@gmail.com</code> adresiyle değiştirin. Benzer şekilde, özel alan adınızı (eğer doğru değilse) <code>example.com</code> ile değiştirin.
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">Alan adınızı zaten bir yerde kaydettiyseniz, bu adımı tamamen atlayıp ikinci adıma geçmelisiniz! Aksi takdirde, <a href="/domain-registration" rel="noopener noreferrer">alan adınızı kaydetmek için buraya tıklayabilirsiniz</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  Alan adınızı nerede kaydettiğinizi hatırlıyor musunuz? Hatırladıktan sonra aşağıdaki talimatları izleyin:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Yeni bir sekme açıp alan adı kayıt firmanıza giriş yapmalısınız. Bunu otomatik yapmak için aşağıdaki "Registrar" bağlantısına kolayca tıklayabilirsiniz. Bu yeni sekmede, kayıt firmanızın DNS yönetim sayfasına gitmelisiniz – ve "Yapılandırma Adımları" sütununda adım adım gezinme talimatlarını sağladık. Bu sayfaya ulaştıktan sonra bu sekmeye geri dönüp üçüncü adıma devam edebilirsiniz.
    <strong class="font-weight-bold">Açtığınız sekmeyi henüz kapatmayın; sonraki adımlar için ihtiyacınız olacak!</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Kayıt Firması</th>
      <th>Yapılandırma Adımları</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> Domain Merkezi <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i> DNS Ayarlarını Düzenle</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> Hosted Zones <i class="fa fa-angle-right"></i> (Alan adınızı seçin)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> Sunucularım <i class="fa fa-angle-right"></i> Alan Adı Yönetimi <i class="fa fa-angle-right"></i> DNS Yöneticisi</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>ROCK İÇİN: Giriş yap <i class="fa fa-angle-right"></i> Alan Adları <i class="fa fa-angle-right"></i> (Yönetim yanındaki ▼ simgesine tıklayın) <i class="fa fa-angle-right"></i> DNS
      <br />
      ESKİ SÜRÜM İÇİN: Giriş yap <i class="fa fa-angle-right"></i> Alan Adları <i class="fa fa-angle-right"></i> Bölge düzenleyici <i class="fa fa-angle-right"></i> (Alan adınızı seçin)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Alan adınızı seçin)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> (Alan adınızı seçin)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Yönet</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> Ağ <i class="fa fa-angle-right"></i> Alan Adları <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i> Daha Fazla <i class="fa fa-angle-right"></i> Alan Adını Yönet</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> Kart görünümünde, alan adınızda yönet'e tıklayın <i class="fa fa-angle-right"></i> Liste görünümünde, dişli simgesine tıklayın <i class="fa fa-angle-right"></i> DNS ve İsim Sunucuları <i class="fa fa-angle-right"></i> DNS Kayıtları</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> İzle</a>
      </td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i> Yönet <i class="fa fa-angle-right"></i> (dişli simgesine tıklayın) <i class="fa fa-angle-right"></i> Sol menüde DNS ve İsim Sunucularına tıklayın</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Alan Adları <i class="fa fa-angle-right"></i> Alan Adlarını Yönet <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> Genel Bakış <i class="fa fa-angle-right"></i> Yönet <i class="fa fa-angle-right"></i> Basit Düzenleyici <i class="fa fa-angle-right"></i> Kayıtlar</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i> Yönetim <i class="fa fa-angle-right"></i> Bölgeyi düzenle</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> İzle</a>
      </td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> Alan Adlarımı Yönet <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i> DNS Yönetimi</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> İzle</a>
      </td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i> DNS Yapılandır</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> İzle</a>
      </td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> Alan Adları Listesi <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i> Yönet <i class="fa fa-angle-right"></i> Gelişmiş DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i> Netlify DNS Kur</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> Hesap Yöneticisi <i class="fa fa-angle-right"></i> Alan Adlarım <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i> Yönet <i class="fa fa-angle-right"></i> Alan Adının Yönlendirildiği Yeri Değiştir <i class="fa fa-angle-right"></i> Gelişmiş DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> İzle</a>
      </td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> Yönetilen Alan Adları <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i> DNS Ayarları</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> Ana menü <i class="fa fa-angle-right"></i> Ayarlar <i class="fa fa-angle-right"></i> Alan Adları <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i>
Gelişmiş ayarlar <i class="fa fa-angle-right"></i> Özel Kayıtlar</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
      <td>"now" CLI kullanarak <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> Alan Adları sayfası <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> Alan Adları sayfası <i class="fa fa-angle-right"></i> (<i class="fa fa-ellipsis-h"></i> simgesine tıklayın) <i class="fa fa-angle-right"></i> DNS Kayıtlarını Yönet'i seçin</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>Giriş yap <i class="fa fa-angle-right"></i> Alan Adları <i class="fa fa-angle-right"></i> Alan Adlarım</td>
    </tr>
    <tr>
      <td>Diğer</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Önemli:</strong> Kayıt firmanızın adı burada listelenmiyor mu? İnternette "$REGISTRAR üzerinde DNS kayıtları nasıl değiştirilir" şeklinde arama yapabilirsiniz (burada $REGISTRAR yerine kayıt firmanızın adını yazın – örneğin GoDaddy kullanıyorsanız "GoDaddy üzerinde DNS kayıtları nasıl değiştirilir").</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Kayıt firmanızın DNS yönetim sayfasını (açtığınız diğer sekme) kullanarak aşağıdaki "MX" kayıtlarını ayarlayın:
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Başka MX kaydı olmaması gerektiğini unutmayın. Aşağıda gösterilen her iki kayıt da OLMALIDIR. Yazım hatası olmadığından ve hem mx1 hem de mx2'nin doğru yazıldığından emin olun. Zaten var olan MX kayıtları varsa, lütfen tamamen silin.
    "TTL" değeri 3600 olmak zorunda değildir, gerekirse daha düşük veya daha yüksek bir değer olabilir.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ad/Sunucu/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Öncelik</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx1.forwardemail.net</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx2.forwardemail.net</code></td>
    </tr>
  </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Kayıt firmanızın DNS yönetim sayfasını kullanarak (açtığınız diğer sekme), aşağıdaki <strong class="notranslate">TXT</strong> kayd(lar)ını ayarlayın:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Eğer ücretli bir plandaysanız, bu adımı tamamen atlayıp beşinci adıma geçmelisiniz! Ücretli bir planınız yoksa, yönlendirdiğiniz adresler herkese açık olarak aranabilir olacak – <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> sayfasına gidip alan adınızı isterseniz ücretli plana yükseltebilirsiniz. Ücretli planlar hakkında daha fazla bilgi almak isterseniz <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Fiyatlandırma</a> sayfamıza bakabilirsiniz. Aksi takdirde aşağıda listelenen Seçenek A'dan Seçenek F'ye kadar bir veya daha fazla kombinasyonu seçmeye devam edebilirsiniz.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Seçenek A:
  </strong>
  <span>
    Eğer alan adınızdaki tüm e-postaları (örneğin "all@example.com", "hello@example.com" vb.) belirli bir adrese "user@gmail.com" yönlendiriyorsanız:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ad/Sunucu/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    İpucu:
  </strong>
  <span>
    Yukarıdaki "Değer" sütunundaki değerleri kendi e-posta adresinizle değiştirdiğinizden emin olun. "TTL" değeri 3600 olmak zorunda değildir, gerekirse daha düşük veya daha yüksek bir değer olabilir. Daha düşük bir TTL ("Time to Live") değeri, DNS kayıtlarınızda yapılan gelecekteki değişikliklerin İnternet genelinde daha hızlı yayılmasını sağlar – bunu, bellekte ne kadar süreyle önbelleğe alınacağı (saniye cinsinden) olarak düşünebilirsiniz. <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL hakkında Wikipedia'da daha fazla bilgi edinebilirsiniz</a>.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Seçenek B:
  </strong>
  <span>
    Sadece tek bir e-posta adresini yönlendirmek istiyorsanız (örneğin <code>hello@example.com</code> adresini <code>user@gmail.com</code> adresine; bu aynı zamanda "hello+test@example.com" adresini otomatik olarak "user+test@gmail.com" adresine yönlendirecektir):
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>İsim/Sunucu/Takma Ad</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Seçenek C:
  </strong>
  <span>
    Birden fazla e-posta yönlendiriyorsanız, bunları virgülle ayırmak isteyeceksiniz:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>İsim/Sunucu/Takma Ad</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Seçenek D:
  </strong>
  <span>
    Sonsuz sayıda yönlendirme e-postası ayarlayabilirsiniz – sadece tek bir satırda 255 karakteri aşmamaya ve her satırı "forward-email=" ile başlatmaya dikkat edin. Aşağıda bir örnek verilmiştir:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>İsim/Sunucu/Takma Ad</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=errors:user@gmail.com,boop:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Seçenek E:
  </strong>
  <span>
    Ayrıca, global takma ad yönlendirmesi için <strong class="notranslate">TXT</strong> kaydınızda bir alan adı belirtebilirsiniz (örneğin "user@example.com" adresi "user@example.net" adresine yönlendirilir):
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>İsim/Sunucu/Takma Ad</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=example.net</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Seçenek F:
  </strong>
  <span>
    E-postaları yönlendirmek için global veya bireysel takma ad olarak webhooks bile kullanabilirsiniz. Aşağıdaki <a href="#do-you-support-webhooks" class="alert-link">Webhookları destekliyor musunuz</a> başlıklı örneğe ve tam bölüme bakınız.
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>İsim/Sunucu/Takma Ad</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Seçenek G:
  </strong>
  <span>
    Takma adları eşleştirmek ve e-postaları yönlendirmek için yerine koyma işlemlerini yönetmek amacıyla düzenli ifadeler ("regex") bile kullanabilirsiniz. Aşağıdaki <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Düzenli ifadeleri veya regex'i destekliyor musunuz</a> başlıklı bölümde örnekleri ve tam açıklamayı inceleyin.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Yerine koyma ile gelişmiş regex mi gerekiyor?</strong> Aşağıdaki <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Düzenli ifadeleri veya regex'i destekliyor musunuz</a> başlıklı bölümde örnekleri ve tam açıklamayı inceleyin.
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Basit Örnek:</strong> `linus@example.com` veya `torvalds@example.com` adreslerine giden tüm e-postaların `user@gmail.com` adresine yönlendirilmesini istiyorsam:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>İsim/Sunucu/Takma Ad</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Catch-all (tümünü yakalama) yönlendirme kuralları "düşme" (fall-through) olarak da tanımlanabilir.
    Bu, en az bir özel yönlendirme kuralıyla eşleşen gelen e-postaların catch-all yerine kullanılacağı anlamına gelir.
    Özel kurallar e-posta adresleri ve düzenli ifadeleri içerir.
    <br /><br />
    Örneğin:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    Bu yapılandırmayla <code>hello@example.com</code> adresine gönderilen e-postalar <code>second@gmail.com</code> (catch-all) adresine **yönlendirilmez**, sadece <code>first@gmail.com</code> adresine teslim edilir.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Kayıt kuruluşunuzun DNS yönetim sayfasını (açtığınız diğer sekme) kullanarak, aşağıdaki <strong class="notranslate">TXT</strong> kaydını ayrıca ayarlayın:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>İsim/Sunucu/Takma Ad</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Gmail (örneğin Gönderilen Posta Olarak) veya G Suite kullanıyorsanız, yukarıdaki değere <code>include:_spf.google.com</code> eklemeniz gerekir, örneğin:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    İpucu:
  </strong>
  <span>
    Eğer zaten "v=spf1" içeren benzer bir satırınız varsa, mevcut "include:host.com" kayıtlarından ve aynı satırdaki "-all" ifadesinden hemen önce <code>include:spf.forwardemail.net</code> eklemeniz gerekir, örneğin:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    "-all" ile "~all" arasında fark vardır. "-" SPF kontrolünün eşleşmezse BAŞARISIZ olması gerektiğini, "~" ise SPF kontrolünün YUMUŞAK BAŞARISIZ olması gerektiğini belirtir. Alan adı sahteciliğini önlemek için "-all" yaklaşımını kullanmanızı öneririz.
    <br /><br />
    Ayrıca, posta gönderdiğiniz herhangi bir sunucu için SPF kaydını da eklemeniz gerekebilir (örneğin Outlook).
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">DNS kayıtlarınızı <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Kurulum sayfasında bulunan "Kayıtları Doğrula" aracımızı kullanarak doğrulayın.

</li><li class="mb-2 mb-md-3 mb-lg-5">Çalıştığını doğrulamak için test e-postası gönderin. DNS kayıtlarınızın yayılması biraz zaman alabilir.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    İpucu:
  </strong>
  <span>
  </span>
    Test e-postaları almıyorsanız veya "Bu mesaja dikkat edin" diyen bir test e-postası alıyorsanız, lütfen sırasıyla <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Neden test e-postalarımı almıyorum</a> ve <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Neden Gmail'de kendime gönderdiğim test e-postaları "şüpheli" olarak görünüyor</a> başlıklarındaki cevaplara bakın.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Gmail'den "Gönderilen Posta" olarak göndermek istiyorsanız, <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">bu videoyu izlemelisiniz</a></strong> veya aşağıdaki <a href="#how-to-send-mail-as-using-gmail">Gmail Kullanarak Gönderilen Posta Nasıl Gönderilir</a> adımlarını takip edin.

</li></ol>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Tebrikler!
    </strong>
    <span>
      Tüm adımları başarıyla tamamladınız.
    </span>
  </div>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    İpucu:
  </strong>
  <span>
    Aşağıda isteğe bağlı eklentiler listelenmiştir. Bu eklentiler tamamen isteğe bağlıdır ve gerekli olmayabilir. Gerekirse size ek bilgi sağlamak istedik.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    İsteğe Bağlı Eklenti:
  </strong>
  <span>
    Eğer <a class="alert-link" href="#how-to-send-mail-as-using-gmail">Gmail Kullanarak Gönderilen Posta Nasıl Gönderilir</a> özelliğini kullanıyorsanız, kendinizi bir izin listesine eklemek isteyebilirsiniz. Bu konuda <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">Gmail'in bu talimatlarına</a> bakın.
  </span>
</div>

### Gelişmiş yönlendirme için birden fazla MX değişimi ve sunucu kullanabilir miyim? {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Evet, ancak **DNS kayıtlarınızda yalnızca bir MX değişimi listelenmelidir**.

Birden fazla MX değişimini yapılandırmak için "Öncelik" kullanmaya çalışmayın.

Bunun yerine, mevcut MX değişiminizi, eşleşmeyen tüm takma adlar için postayı hizmetimizin değişimlerine (`mx1.forwardemail.net` ve/veya `mx2.forwardemail.net`) yönlendirecek şekilde yapılandırmanız gerekir.

Google Workspace kullanıyorsanız ve eşleşmeyen tüm takma adları hizmetimize yönlendirmek istiyorsanız, <https://support.google.com/a/answer/6297084> adresine bakın.

Microsoft 365 (Outlook) kullanıyorsanız ve eşleşmeyen tüm takma adları hizmetimize yönlendirmek istiyorsanız, <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> ve <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations> adreslerine bakın.

### Tatil yanıtlayıcısı (ofis dışı otomatik yanıtlayıcı) nasıl kurulur? {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar sayfasına gidin ve tatil otomatik yanıtlayıcısı yapılandırmak istediğiniz takma adı oluşturun veya düzenleyin.
Başlangıç tarihi, bitiş tarihi, konu ve mesaj yapılandırma yeteneğiniz vardır ve istediğiniz zaman etkinleştirebilir veya devre dışı bırakabilirsiniz:

* Düz metin konu ve mesaj şu anda desteklenmektedir (içeride herhangi bir HTML'yi kaldırmak için `striptags` paketini kullanıyoruz).
* Konu 100 karakterle sınırlıdır.
* Mesaj 1000 karakterle sınırlıdır.
* Kurulum, Giden SMTP yapılandırması gerektirir (örneğin, DKIM, DMARC ve Return-Path DNS kayıtlarını ayarlamanız gerekecektir).
  * <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Ayarlar <i class="fa fa-angle-right"></i> Giden SMTP Yapılandırması sayfasına gidin ve kurulum talimatlarını izleyin.
* Tatil yanıtlayıcı, genel özel alan adı adlarında etkinleştirilemez (örneğin, [tek kullanımlık adresler](/disposable-addresses) desteklenmez).
* Tatil yanıtlayıcı, joker karakterli/kapsayıcı (`*`) veya düzenli ifadeli takma adlar için etkinleştirilemez.

`postfix` gibi posta sistemlerinin aksine (örneğin `sieve` tatil filtresi uzantısını kullananlar) – Forward Email otomatik olarak DKIM imzanızı ekler, tatil yanıtlarını gönderirken bağlantı sorunlarını önler (örneğin yaygın SSL/TLS bağlantı sorunları ve eski sunucular nedeniyle) ve hatta tatil yanıtları için Open WKD ve PGP şifrelemesini destekler.

<!--
* Kötüye kullanımı önlemek için, gönderilen her tatil yanıtı mesajı için 1 giden SMTP kredisi düşülür.
  * Tüm ücretli hesaplar varsayılan olarak günde 300 kredi içerir. Daha fazla krediye ihtiyacınız varsa lütfen bizimle iletişime geçin.
-->

1. Her [izin verilen](#do-you-have-an-allowlist) gönderen için yalnızca 4 günde bir kez gönderim yaparız (bu Gmail'in davranışına benzer).

   * Redis önbelleğimiz, `alias_id` ve `sender` parmak izi kullanır; burada `alias_id` takma adın MongoDB kimliği, `sender` ise izin verilen ise Gönderen adresi, değilse Gönderen adresindeki kök alan adıdır. Basitlik için bu parmak izinin önbellekte süresi 4 gün olarak ayarlanmıştır.

   * İzin verilmeyen gönderenler için Gönderen adresinden ayrıştırılan kök alan adını kullanmamız, nispeten bilinmeyen gönderenlerin (örneğin kötü niyetli aktörlerin) tatil yanıtı mesajlarıyla spam yapmasını önler.

2. MAIL FROM ve/veya From boş değilse ve (büyük/küçük harf duyarsız) bir [postmaster kullanıcı adı](#what-are-postmaster-addresses) içermiyorsa (bir e-postadaki @ işaretinden önceki kısım) gönderim yaparız.

3. Orijinal mesajda aşağıdaki başlıklardan herhangi biri varsa (büyük/küçük harf duyarsız) gönderim yapmayız:

   * Değeri `no` olmayan `auto-submitted` başlığı.
   * Değeri `dr`, `autoreply`, `auto-reply`, `auto_reply` veya `all` olan `x-auto-response-suppress` başlığı.
   * `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` veya `x-auto-respond` başlıkları (değerine bakılmaksızın).
   * Değeri `bulk`, `autoreply`, `auto-reply`, `auto_reply` veya `list` olan `precedence` başlığı.

4. MAIL FROM veya From e-posta adresi `+donotreply`, `-donotreply`, `+noreply` veya `-noreply` ile bitiyorsa gönderim yapmayız.

5. From e-posta adresinin kullanıcı adı kısmı `mdaemon` ise ve büyük/küçük harf duyarsız `X-MDDSN-Message` başlığı varsa gönderim yapmayız.

6. Büyük/küçük harf duyarsız `content-type` başlığı `multipart/report` ise gönderim yapmayız.

### Forward Email için SPF nasıl kurulur {#how-do-i-set-up-spf-for-forward-email}

Kayıt şirketinizin DNS yönetim sayfasını kullanarak aşağıdaki <strong class="notranslate">TXT</strong> kaydını ayarlayın:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ad/Sunucu/Takma Ad</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Gmail (örneğin Mail Gönderirken) veya G Suite kullanıyorsanız, yukarıdaki değere <code>include:_spf.google.com</code> eklemeniz gerekir, örneğin:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Microsoft Outlook veya Live.com kullanıyorsanız, SPF <strong class="notranslate">TXT</strong> kaydınıza <code>include:spf.protection.outlook.com</code> eklemeniz gerekir, örneğin:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    İpucu:
  </strong>
  <span>
    Zaten "v=spf1" içeren benzer bir satırınız varsa, <code>include:spf.forwardemail.net</code> ifadesini mevcut "include:host.com" kayıtlarından hemen önce ve aynı satırdaki "-all" ifadesinden önce eklemeniz gerekir, örneğin:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    "-all" ile "~all" arasında fark olduğunu unutmayın. "-" işareti, SPF kontrolünün eşleşmezse BAŞARISIZ olması gerektiğini, "~" işareti ise SPF kontrolünün YUMUŞAK BAŞARISIZ olması gerektiğini belirtir. Alan adı sahteciliğini önlemek için "-all" yaklaşımını kullanmanızı öneririz.
    <br /><br />
    Ayrıca, posta gönderdiğiniz herhangi bir sunucu için SPF kaydını da eklemeniz gerekebilir (örneğin Outlook).
  </span>
</div>

### Forward Email için DKIM nasıl kurulur {#how-do-i-set-up-dkim-for-forward-email}

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Ayarlar <i class="fa fa-angle-right"></i> Giden SMTP Yapılandırması bölümüne gidin ve kurulum talimatlarını izleyin.

### Forward Email için DMARC nasıl kurulur {#how-do-i-set-up-dmarc-for-forward-email}

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Ayarlar <i class="fa fa-angle-right"></i> Giden SMTP Yapılandırması bölümüne gidin ve kurulum talimatlarını izleyin.

### DMARC Raporları nasıl görüntülenir {#how-do-i-view-dmarc-reports}

Forward Email, tüm alan adlarınız için e-posta kimlik doğrulama performansınızı tek bir arayüzden izlemenizi sağlayan kapsamlı bir DMARC Raporları paneli sunar.

**DMARC Raporları nedir?**

DMARC (Alan Adı Tabanlı Mesaj Kimlik Doğrulama, Raporlama ve Uyum) raporları, e-postalarınızın nasıl doğrulandığını size bildiren alıcı posta sunucuları tarafından gönderilen XML dosyalarıdır. Bu raporlar size şunları anlamanıza yardımcı olur:

* Alan adınızdan kaç e-posta gönderildiği
* Bu e-postaların SPF ve DKIM doğrulamasından geçip geçmediği
* Alıcı sunucuların hangi işlemleri yaptığı (kabul, karantina veya reddetme)
* Alan adınız adına hangi IP adreslerinin e-posta gönderdiği

**DMARC Raporlarına Nasıl Erişilir**

<a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> DMARC Raporları</a> sayfasına giderek panelinizi görüntüleyebilirsiniz. Ayrıca, <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> sayfasından herhangi bir alan adının yanındaki "DMARC" butonuna tıklayarak alan adına özel raporlara erişebilirsiniz.

**Panel Özellikleri**

DMARC Raporları paneli şunları sağlar:

* **Özet Metrikler**: Alınan toplam rapor sayısı, analiz edilen toplam mesaj sayısı, SPF uyum oranı, DKIM uyum oranı ve genel geçme oranı
* **Zamana Göre Mesaj Grafiği**: Son 30 gündeki e-posta hacmi ve kimlik doğrulama oranlarının görsel eğilimi
* **Uyum Özeti**: SPF ve DKIM uyum dağılımını gösteren halka grafik
* **Mesaj Durumu**: Alıcı sunucuların e-postalarınızı nasıl işlediğini gösteren yığılmış çubuk grafik (kabul edilen, karantinaya alınan veya reddedilen)
* **Son Raporlar Tablosu**: Bireysel DMARC raporlarının detaylı listesi, filtreleme ve sayfalama özellikleri ile
* **Alan Adı Filtreleme**: Birden fazla alan adı yönetirken raporları belirli bir alan adına göre filtreleme
**Neden Bu Önemli**

Birden fazla alan adı yöneten kuruluşlar (şirketler, kar amacı gütmeyen kuruluşlar veya ajanslar gibi) için DMARC raporları şunlar açısından hayati öneme sahiptir:

* **Yetkisiz gönderenleri tespit etmek**: Alan adınızın taklit edilip edilmediğini belirleyin
* **Teslimat oranını artırmak**: Meşru e-postalarınızın kimlik doğrulamadan geçmesini sağlayın
* **E-posta altyapısını izlemek**: Hangi hizmetlerin ve IP adreslerinin sizin adınıza e-posta gönderdiğini takip edin
* **Uyumluluk**: Güvenlik denetimleri için e-posta kimlik doğrulamasını görünür kılın

Ayrı DMARC izleme araçları gerektiren diğer hizmetlerin aksine, Forward Email DMARC rapor işleme ve görselleştirmeyi hesabınızın bir parçası olarak ek bir ücret talep etmeden sunar.

**Gereksinimler**

* DMARC Raporları yalnızca ücretli planlarda mevcuttur
* Alan adınızda DMARC yapılandırılmış olmalıdır (bkz. [Forward Email için DMARC nasıl kurulur](#how-do-i-set-up-dmarc-for-forward-email))
* Raporlar, posta sunucuları yapılandırdığınız DMARC raporlama adresine gönderdiğinde otomatik olarak toplanır

**Haftalık E-posta Raporları**

Ücretli plan kullanıcıları haftalık DMARC rapor özetlerini otomatik olarak e-posta ile alır. Bu e-postalar şunları içerir:

* Tüm alan adlarınız için özet istatistikler
* SPF ve DKIM uyum oranları
* Mesaj durumu dağılımı (kabul edilen, karantinaya alınan, reddedilen)
* En çok raporlayan kuruluşlar (Google, Microsoft, Yahoo vb.)
* Dikkat gerektirebilecek uyum sorunları olan IP adresleri
* DMARC Raporları kontrol panelinize doğrudan bağlantılar

Haftalık raporlar otomatik olarak gönderilir ve diğer e-posta bildirimlerinden ayrı olarak devre dışı bırakılamaz.

### Kişilerimi nasıl bağlar ve yapılandırırım {#how-do-i-connect-and-configure-my-contacts}

**Kişilerinizi yapılandırmak için CardDAV URL'sini kullanın:** `https://carddav.forwardemail.net` (veya istemciniz izin veriyorsa sadece `carddav.forwardemail.net`)

### Takvimlerimi nasıl bağlar ve yapılandırırım {#how-do-i-connect-and-configure-my-calendars}

**Takviminizi yapılandırmak için CalDAV URL'sini kullanın:** `https://caldav.forwardemail.net` (veya istemciniz izin veriyorsa sadece `caldav.forwardemail.net`)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Takvim CalDAV Thunderbird Örnek Kurulum" />

### Daha fazla takvim nasıl ekler ve mevcut takvimleri nasıl yönetirim {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Ek takvimler eklemek isterseniz, yeni takvim URL'si olarak şunu ekleyin: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**`calendar-name` kısmını istediğiniz takvim adıyla değiştirin**)

Bir takvimin adını ve rengini oluşturduktan sonra değiştirebilirsiniz – tercih ettiğiniz takvim uygulamasını kullanmanız yeterlidir (örneğin Apple Mail veya [Thunderbird](https://thunderbird.net)).

### Görevlerimi ve hatırlatıcılarımı nasıl bağlar ve yapılandırırım {#how-do-i-connect-and-configure-tasks-and-reminders}

**Görevler ve hatırlatıcılar için takvimlerle aynı CalDAV URL'sini kullanın:** `https://caldav.forwardemail.net` (veya istemciniz izin veriyorsa sadece `caldav.forwardemail.net`)

Görevler ve hatırlatıcılar otomatik olarak takvim etkinliklerinden ayrılarak kendi "Hatırlatıcılar" veya "Görevler" takvim koleksiyonlarına yerleştirilir.

**Platforma göre kurulum talimatları:**

**macOS/iOS:**

1. Sistem Tercihleri > İnternet Hesapları (veya iOS'ta Ayarlar > Hesaplar) bölümünden yeni bir CalDAV hesabı ekleyin
2. Sunucu olarak `caldav.forwardemail.net` kullanın
3. Forward Email takma adınızı ve oluşturulan şifrenizi girin
4. Kurulumdan sonra hem "Takvim" hem de "Hatırlatıcılar" koleksiyonlarını göreceksiniz
5. Görevleri oluşturmak ve yönetmek için Hatırlatıcılar uygulamasını kullanın

**Android için Tasks.org:**

1. Google Play Store veya F-Droid'den Tasks.org uygulamasını yükleyin
2. Ayarlar > Senkronizasyon > Hesap Ekle > CalDAV yolunu izleyin
3. Sunucu olarak `https://caldav.forwardemail.net` girin
4. Forward Email takma adınızı ve oluşturulan şifrenizi girin
5. Tasks.org görev takvimlerinizi otomatik olarak bulacaktır

**Thunderbird:**

1. Lightning eklentisi yüklü değilse yükleyin
2. Türü "CalDAV" olan yeni bir takvim oluşturun
3. URL olarak `https://caldav.forwardemail.net` kullanın
4. Forward Email kimlik bilgilerinizi girin
5. Takvim arayüzünde hem etkinlikler hem de görevler kullanılabilir olacaktır

### macOS Hatırlatıcılar'da neden görev oluşturamıyorum {#why-cant-i-create-tasks-in-macos-reminders}
macOS Reminders'da görev oluşturmakta sorun yaşıyorsanız, bu sorun giderme adımlarını deneyin:

1. **Hesap ayarını kontrol edin**: CalDAV hesabınızın `caldav.forwardemail.net` ile doğru yapılandırıldığından emin olun

2. **Ayrı takvimleri doğrulayın**: Hesabınızda hem "Calendar" hem de "Reminders" görmelisiniz. Sadece "Calendar" görüyorsanız, görev desteği henüz tam olarak etkinleştirilmemiş olabilir.

3. **Hesabı yenileyin**: Sistem Tercihleri > İnternet Hesapları bölümünden CalDAV hesabınızı kaldırıp tekrar eklemeyi deneyin

4. **Sunucu bağlantısını kontrol edin**: Tarayıcınızda `https://caldav.forwardemail.net` adresine erişebildiğinizi test edin

5. **Kimlik bilgilerini doğrulayın**: Doğru takma ad e-posta adresi ve oluşturulan şifreyi (hesap şifreniz değil) kullandığınızdan emin olun

6. **Zorla senkronizasyon yapın**: Reminders uygulamasında bir görev oluşturup ardından senkronizasyonu manuel olarak yenilemeyi deneyin

**Yaygın sorunlar:**

* **"Reminders takvimi bulunamadı"**: Sunucunun ilk erişimde Reminders koleksiyonunu oluşturması için biraz zamana ihtiyacı olabilir
* **Görevler senkronize olmuyor**: Her iki cihazın da aynı CalDAV hesap kimlik bilgilerini kullandığını kontrol edin
* **Karışık içerik**: Görevlerin genel "Calendar" değil, "Reminders" takviminde oluşturulduğundan emin olun

### Android'de Tasks.org nasıl kurulur {#how-do-i-set-up-tasksorg-on-android}

Tasks.org, Forward Email'in CalDAV görev desteği ile mükemmel çalışan popüler açık kaynaklı bir görev yöneticisidir.

**Kurulum ve Ayarlar:**

1. **Tasks.org'u yükleyin**:
   * Google Play Store'dan: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * F-Droid'den: [Tasks.org on F-Droid](https://f-droid.org/packages/org.tasks/)

2. **CalDAV senkronizasyonunu yapılandırın**:
   * Tasks.org'u açın
   * ☰ Menü > Ayarlar > Senkronizasyon'a gidin
   * "Hesap Ekle"ye dokunun
   * "CalDAV" seçeneğini seçin

3. **Forward Email ayarlarını girin**:
   * **Sunucu URL'si**: `https://caldav.forwardemail.net`
   * **Kullanıcı Adı**: Forward Email takma adınız (örneğin, `you@yourdomain.com`)
   * **Şifre**: Takma adınıza özel oluşturulan şifre
   * "Hesap Ekle"ye dokunun

4. **Hesap keşfi**:
   * Tasks.org görev takvimlerinizi otomatik olarak bulacaktır
   * "Reminders" koleksiyonunuz görünmelidir
   * Görev takvimi senkronizasyonunu etkinleştirmek için "Abone Ol" seçeneğine dokunun

5. **Senkronizasyonu test edin**:
   * Tasks.org'da test amaçlı bir görev oluşturun
   * Görevin macOS Reminders gibi diğer CalDAV istemcilerinde göründüğünü kontrol edin
   * Değişikliklerin her iki yönde de senkronize olduğunu doğrulayın

**Mevcut özellikler:**

* ✅ Görev oluşturma ve düzenleme
* ✅ Son tarihler ve hatırlatıcılar
* ✅ Görev tamamlama ve durumu
* ✅ Öncelik seviyeleri
* ✅ Alt görevler ve görev hiyerarşisi
* ✅ Etiketler ve kategoriler
* ✅ Diğer CalDAV istemcileriyle çift yönlü senkronizasyon

**Sorun giderme:**

* Görev takvimleri görünmüyorsa, Tasks.org ayarlarında manuel yenilemeyi deneyin
* Sunucuda en az bir görev oluşturduğunuzdan emin olun (önce macOS Reminders'da bir görev oluşturabilirsiniz)
* `caldav.forwardemail.net` bağlantı durumunu kontrol edin

### Forward Email için SRS nasıl kurulur {#how-do-i-set-up-srs-for-forward-email}

[Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") otomatik olarak yapılandırılır – bunu kendiniz yapmanız gerekmez.

### Forward Email için MTA-STS nasıl kurulur {#how-do-i-set-up-mta-sts-for-forward-email}

Daha fazla bilgi için [MTA-STS bölümümüze](#do-you-support-mta-sts) bakınız.

### E-posta adresime profil fotoğrafı nasıl eklerim {#how-do-i-add-a-profile-picture-to-my-email-address}

Gmail kullanıyorsanız, aşağıdaki adımları izleyin:

1. <https://google.com> adresine gidin ve tüm e-posta hesaplarından çıkış yapın
2. "Oturum Aç" butonuna tıklayın ve açılır menüden "başka hesap" seçeneğine tıklayın
3. "Başka bir hesap kullan" seçeneğini seçin
4. "Hesap oluştur" seçeneğini seçin
5. "Bunun yerine mevcut e-posta adresimi kullan" seçeneğini seçin
6. Özel alan adınıza ait e-posta adresinizi girin
7. E-posta adresinize gönderilen doğrulama e-postasını alın
8. Bu e-postadaki doğrulama kodunu girin
9. Yeni Google hesabınız için profil bilgilerini tamamlayın
10. Tüm Gizlilik ve Kullanım Şartları politikalarını kabul edin
11. <https://google.com> adresine gidin, sağ üst köşedeki profil simgenize tıklayın ve "değiştir" butonuna tıklayın
12. Hesabınız için yeni bir fotoğraf veya avatar yükleyin
13. Değişikliklerin yayılması yaklaşık 1-2 saat sürecektir, ancak bazen çok hızlı olabilir.
14. Test amaçlı bir e-posta gönderin ve profil fotoğrafının göründüğünü kontrol edin.
## Gelişmiş Özellikler {#advanced-features}

### Pazarlama ile ilgili e-posta için bültenleri veya posta listelerini destekliyor musunuz? {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Evet, daha fazlasını <https://forwardemail.net/guides/newsletter-with-listmonk> adresinde okuyabilirsiniz.

Lütfen IP itibarını korumak ve teslim edilebilirliği sağlamak için Forward Email'in **bülten onayı** için alan bazında manuel bir inceleme süreci olduğunu unutmayın. Onay için <support@forwardemail.net> adresine e-posta gönderin veya bir [yardım talebi](https://forwardemail.net/help) açın. Bu genellikle 24 saatten kısa sürer ve çoğu talep 1-2 saat içinde karşılanır. Yakın gelecekte bu süreci ek spam kontrolleri ve uyarılarla anlık hale getirmeyi hedefliyoruz. Bu süreç, e-postalarınızın gelen kutusuna ulaşmasını ve mesajlarınızın spam olarak işaretlenmemesini sağlar.

### API ile e-posta göndermeyi destekliyor musunuz? {#do-you-support-sending-email-with-api}

Evet, Mayıs 2023 itibarıyla tüm ücretli kullanıcılar için bir eklenti olarak API ile e-posta göndermeyi destekliyoruz.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Lütfen <a href="/terms" class="alert-link" target="_blank">Hüküm ve Koşullarımızı</a>, <a href="/privacy" class="alert-link" target="_blank">Gizlilik Politikamızı</a> ve <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Giden SMTP Limitlerini</a> okuduğunuzdan emin olun – kullanmanız kabul ve anlaşma olarak değerlendirilir.
  </span>
</div>

Seçenekler, örnekler ve daha fazla bilgi için API dokümantasyonumuzdaki [E-postalar](/email-api#outbound-emails) bölümüne bakınız.

API ile giden e-posta gönderebilmek için, [Hesabım Güvenlik](/my-account/security) altında bulunan API tokenınızı kullanmalısınız.

### IMAP ile e-posta almayı destekliyor musunuz? {#do-you-support-receiving-email-with-imap}

Evet, 16 Ekim 2023 itibarıyla tüm ücretli kullanıcılar için bir eklenti olarak IMAP üzerinden e-posta almayı destekliyoruz. **Lütfen [şifrelenmiş SQLite posta kutusu depolama özelliğimizin nasıl çalıştığına dair derinlemesine makalemizi](/blog/docs/best-quantum-safe-encrypted-email-service) okuyun.**

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Lütfen <a href="/terms" class="alert-link" target="_blank">Hüküm ve Koşullarımızı</a> ve <a href="/privacy" class="alert-link" target="_blank">Gizlilik Politikamızı</a> okuduğunuzdan emin olun – kullanmanız kabul ve anlaşma olarak değerlendirilir.
  </span>
</div>

1. Alan adınız için <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar altında yeni bir takma ad oluşturun (örneğin <code><hello@example.com></code>)

2. Yeni oluşturulan takma adın yanında bulunan <strong class="text-success"><i class="fa fa-key"></i> Şifre Oluştur</strong> butonuna tıklayın. Ekranda gösterilen oluşturulan şifreyi panonuza kopyalayın ve güvenli bir şekilde saklayın.

3. Tercih ettiğiniz e-posta uygulamasını kullanarak yeni oluşturduğunuz takma ad ile bir hesap ekleyin veya yapılandırın (örneğin <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       İpucu:
     </strong>
     <span><a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobil</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> veya <a href="/blog/open-source" class="alert-link" target="_blank">açık kaynaklı ve gizliliğe odaklı bir alternatif</a> kullanmanızı öneririz.</span>
   </div>

4. IMAP sunucu adı istendiğinde `imap.forwardemail.net` girin

5. IMAP sunucu portu istendiğinde `993` (SSL/TLS) girin – gerekirse [alternatif IMAP portlarına](/faq#what-are-your-imap-server-configuration-settings) bakınız
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       İpucu:
     </strong>
     <span>Thunderbird kullanıyorsanız, "Bağlantı güvenliği"nin "SSL/TLS" ve Kimlik doğrulama yönteminin "Normal şifre" olarak ayarlandığından emin olun.</span>
   </div>
6. IMAP sunucu şifresi istendiğinde, yukarıdaki 2. adımda bulunan <strong class="text-success"><i class="fa fa-key"></i> Şifre Oluştur</strong> bölümünden şifreyi yapıştırın

7. **Ayarlarınızı kaydedin** – sorun yaşıyorsanız, lütfen <a href="/help">bizimle iletişime geçin</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Tebrikler!
    </strong>
    <span>
      Tüm adımları başarıyla tamamladınız.
    </span>
  </div>
</div>

</div>

### POP3 destekliyor musunuz? {#do-you-support-pop3}

Evet, 4 Aralık 2023 itibarıyla tüm ücretli kullanıcılar için bir eklenti olarak [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) desteklemekteyiz.  **Lütfen şifrelenmiş SQLite posta kutusu depolama özelliğimizin nasıl çalıştığına dair derinlemesine makalemizi okuyun**: [how our encrypted SQLite mailbox storage feature works](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Lütfen <a href="/terms" class="alert-link" target="_blank">Hüküm ve Koşullarımızı</a> ve <a href="/privacy" class="alert-link" target="_blank">Gizlilik Politikamızı</a> okuduğunuzdan emin olun – kullanmanız kabul ve onayınız olarak değerlendirilir.
  </span>
</div>

1. Alan adınız için <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar altında yeni bir takma ad oluşturun (örneğin <code><hello@example.com></code>)

2. Yeni oluşturulan takma adın yanında bulunan <strong class="text-success"><i class="fa fa-key"></i> Şifre Oluştur</strong> butonuna tıklayın. Ekranda gösterilen şifreyi panonuza kopyalayın ve güvenli bir şekilde saklayın.

3. Tercih ettiğiniz e-posta uygulamasını kullanarak, yeni oluşturduğunuz takma ad ile bir hesap ekleyin veya yapılandırın (örneğin <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       İpucu:
     </strong>
     <span><a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobil</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> veya <a href="/blog/open-source" class="alert-link" target="_blank">açık kaynaklı ve gizliliğe odaklı bir alternatif</a> kullanmanızı öneririz.</span>
   </div>

4. POP3 sunucu adı istendiğinde, `pop3.forwardemail.net` girin

5. POP3 sunucu portu istendiğinde, `995` (SSL/TLS) girin – gerekirse [alternatif POP3 portlarına](/faq#what-are-your-pop3-server-configuration-settings) bakın
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       İpucu:
     </strong>
     <span>Eğer Thunderbird kullanıyorsanız, "Bağlantı güvenliği"nin "SSL/TLS" ve Kimlik doğrulama yönteminin "Normal şifre" olarak ayarlandığından emin olun.</span>
   </div>

6. POP3 sunucu şifresi istendiğinde, yukarıdaki 2. adımda bulunan <strong class="text-success"><i class="fa fa-key"></i> Şifre Oluştur</strong> bölümünden şifreyi yapıştırın

7. **Ayarlarınızı kaydedin** – sorun yaşıyorsanız, lütfen <a href="/help">bizimle iletişime geçin</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Tebrikler!
    </strong>
    <span>
      Tüm adımları başarıyla tamamladınız.
    </span>
  </div>
</div>

</div>

### Takvimleri (CalDAV) destekliyor musunuz? {#do-you-support-calendars-caldav}

Evet, 5 Şubat 2024 itibarıyla bu özelliği ekledik. Sunucumuz `caldav.forwardemail.net` olup, <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">durum sayfamızda</a> da izlenmektedir.
IPv4 ve IPv6'yı destekler ve `443` (HTTPS) portu üzerinden erişilebilir.

| Giriş    | Örnek                      | Açıklama                                                                                                                                                                                 |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kullanıcı Adı | `user@example.com`         | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> altında alan için var olan bir takma adın e-posta adresi. |
| Şifre    | `************************` | Takma ad için özel olarak oluşturulmuş şifre.                                                                                                                                             |

Takvim desteğini kullanmak için, **kullanıcı** <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> altında alan için var olan bir takma adın e-posta adresi olmalı – ve **şifre** takma ad için özel olarak oluşturulmuş bir şifre olmalıdır.

### Görevler ve hatırlatıcıları destekliyor musunuz (CalDAV VTODO) {#do-you-support-tasks-and-reminders-caldav-vtodo}

Evet, 14 Ekim 2025 itibarıyla görevler ve hatırlatıcılar için CalDAV VTODO desteği ekledik. Bu, takvim desteğimizde kullandığımız aynı sunucuyu kullanır: `caldav.forwardemail.net`.

CalDAV sunucumuz, **birleşik takvimler** kullanarak hem takvim etkinlikleri (VEVENT) hem de görevler (VTODO) bileşenlerini destekler. Bu, her takvimin hem etkinlik hem de görev içerebileceği anlamına gelir ve tüm CalDAV istemcileri arasında maksimum esneklik ve uyumluluk sağlar.

**Takvimler ve listeler nasıl çalışır:**

* **Her takvim hem etkinlikleri hem de görevleri destekler** - Herhangi bir takvime etkinlik, görev veya her ikisini ekleyebilirsiniz
* **Apple Hatırlatıcı listeleri** - Apple Hatırlatıcı’da oluşturduğunuz her liste, sunucuda ayrı bir takvim olur
* **Birden fazla takvim** - İhtiyacınız kadar takvim oluşturabilirsiniz, her biri kendi adı, rengi ve organizasyonuyla
* **İstemciler arası senkronizasyon** - Görevler ve etkinlikler tüm uyumlu istemciler arasında sorunsuz senkronize olur

**Desteklenen görev istemcileri:**

* **macOS Hatırlatıcılar** - Görev oluşturma, düzenleme, tamamlama ve senkronizasyon için tam yerel destek
* **iOS Hatırlatıcılar** - Tüm iOS cihazlarında tam yerel destek
* **Tasks.org (Android)** - CalDAV senkronizasyonu olan popüler açık kaynak görev yöneticisi
* **Thunderbird** - Masaüstü e-posta istemcisinde görev ve takvim desteği
* **Herhangi bir CalDAV uyumlu görev yöneticisi** - Standart VTODO bileşeni desteği

**Desteklenen görev özellikleri:**

* Görev oluşturma, düzenleme ve silme
* Bitiş ve başlangıç tarihleri
* Görev tamamlama durumu (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* Görev öncelik seviyeleri
* Tekrarlayan görevler
* Görev açıklamaları ve notları
* Çoklu cihaz senkronizasyonu
* RELATED-TO özelliği ile alt görevler
* VALARM ile görev hatırlatıcıları

Giriş bilgileri takvim desteği ile aynıdır:

| Giriş    | Örnek                      | Açıklama                                                                                                                                                                                 |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kullanıcı Adı | `user@example.com`         | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> altında alan için var olan bir takma adın e-posta adresi. |
| Şifre    | `************************` | Takma ad için özel olarak oluşturulmuş şifre.                                                                                                                                             |

**Önemli notlar:**

* **Her Hatırlatıcı listesi ayrı bir takvimdir** - Apple Hatırlatıcı’da yeni bir liste oluşturduğunuzda, CalDAV sunucusunda yeni bir takvim oluşturulur
* **Thunderbird kullanıcıları** - Senkronize etmek istediğiniz her takvim/listeye manuel olarak abone olmanız gerekir veya takvim ana URL’sini kullanabilirsiniz: `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **Apple kullanıcıları** - Takvim keşfi otomatik gerçekleşir, böylece tüm takvimleriniz ve listeleriniz Calendar.app ve Reminders.app’de görünür
* **Birleşik takvimler** - Tüm takvimler hem etkinlikleri hem de görevleri destekler, böylece verilerinizi nasıl organize edeceğiniz konusunda esneklik sağlar
### Kişileri destekliyor musunuz (CardDAV) {#do-you-support-contacts-carddav}

Evet, 12 Haziran 2025 itibarıyla bu özelliği ekledik. Sunucumuz `carddav.forwardemail.net` olup <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">durum sayfamızda</a> de izlenmektedir.

Hem IPv4 hem de IPv6'yı destekler ve `443` (HTTPS) portu üzerinden erişilebilir.

| Giriş     | Örnek                      | Açıklama                                                                                                                                                                                  |
| --------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kullanıcı | `user@example.com`         | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> altında alan adı için var olan bir takma adın e-posta adresi. |
| Şifre     | `************************` | Takma ada özel oluşturulmuş şifre.                                                                                                                                                        |

Kişi desteğini kullanmak için, **kullanıcı** <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> altında alan adı için var olan bir takma adın e-posta adresi olmalı – ve **şifre** takma ada özel oluşturulmuş bir şifre olmalıdır.

### SMTP ile e-posta göndermeyi destekliyor musunuz {#do-you-support-sending-email-with-smtp}

Evet, Mayıs 2023 itibarıyla tüm ücretli kullanıcılar için bir eklenti olarak SMTP ile e-posta göndermeyi destekliyoruz.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Lütfen <a href="/terms" class="alert-link" target="_blank">Şartlarımızı</a>, <a href="/privacy" class="alert-link" target="_blank">Gizlilik Politikamızı</a> ve <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Giden SMTP Limitlerini</a> okuduğunuzdan emin olun – kullanmanız kabul ve onayınız olarak değerlendirilir.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Gmail kullanıyorsanız, <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Gmail ile Özel Alan Adı Kullanarak E-posta Gönderme rehberimize</a> bakınız. Geliştiriciyseniz, <a class="alert-link" href="/email-api#outbound-emails" target="_blank">e-posta API dokümanlarımıza</a> başvurunuz.
  </span>
</div>

1. <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Ayarlar <i class="fa fa-angle-right"></i> Giden SMTP Yapılandırması sayfasına gidin ve kurulum talimatlarını takip edin

2. Alan adınız için <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar bölümünde yeni bir takma ad oluşturun (örneğin <code><hello@example.com></code>)

3. Yeni oluşturduğunuz takma adın yanında bulunan <strong class="text-success"><i class="fa fa-key"></i> Şifre Oluştur</strong> butonuna tıklayın. Ekranda gösterilen oluşturulan şifreyi panonuza kopyalayın ve güvenli bir şekilde saklayın.

4. Tercih ettiğiniz e-posta uygulamasını kullanarak, yeni oluşturduğunuz takma ad ile bir hesap ekleyin veya yapılandırın (örneğin <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       İpucu:
     </strong>
     <span><a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobil</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> veya <a href="/blog/open-source" class="alert-link" target="_blank">açık kaynaklı ve gizlilik odaklı bir alternatif</a> kullanmanızı öneririz.</span>
   </div>
5. SMTP sunucu adı istendiğinde, `smtp.forwardemail.net` girin

6. SMTP sunucu portu istendiğinde, `465` (SSL/TLS) girin – gerekirse [alternatif SMTP portlarına](/faq#what-are-your-smtp-server-configuration-settings) bakın
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       İpucu:
     </strong>
     <span>Thunderbird kullanıyorsanız, "Bağlantı güvenliği"nin "SSL/TLS" ve Kimlik doğrulama yönteminin "Normal parola" olarak ayarlandığından emin olun.</span>
   </div>

7. SMTP sunucu parolası istendiğinde, yukarıdaki 3. adımda <strong class="text-success"><i class="fa fa-key"></i> Parola Oluştur</strong> bölümünden parolayı yapıştırın

8. **Ayarlarınızı kaydedin ve ilk test e-postanızı gönderin** – sorun yaşarsanız, lütfen <a href="/help">bizimle iletişime geçin</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    IP itibarını korumak ve teslim edilebilirliği sağlamak için, giden SMTP onayı için alan bazında manuel bir inceleme sürecimiz olduğunu lütfen unutmayın. Bu genellikle 24 saatten kısa sürer ve çoğu talep 1-2 saat içinde onaylanır. Yakın gelecekte, ek spam kontrolleri ve uyarılarla bu süreci anlık hale getirmeyi hedefliyoruz. Bu süreç, e-postalarınızın gelen kutusuna ulaşmasını ve mesajlarınızın spam olarak işaretlenmemesini sağlar.
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Tebrikler!
    </strong>
    <span>
      Tüm adımları başarıyla tamamladınız.
    </span>
  </div>
</div>

</div>

### OpenPGP/MIME, uçtan uca şifreleme ("E2EE") ve Web Anahtar Dizini ("WKD") destekliyor musunuz? {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Evet, [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [uçtan uca şifreleme ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) ve genel anahtarların keşfi için [Web Anahtar Dizini ("WKD")](https://wiki.gnupg.org/WKD) desteğimiz vardır. OpenPGP'yi [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) üzerinden yapılandırabilir veya [kendi anahtarlarınızı barındırabilirsiniz](https://wiki.gnupg.org/WKDHosting) (WKD sunucu kurulumu için [bu gist'e](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79) bakınız).

* WKD sorguları, zamanında e-posta teslimatı için 1 saat önbelleğe alınır → bu nedenle WKD anahtarınızı ekler, değiştirir veya kaldırırsanız, önbelleği manuel temizlememiz için lütfen e-posta adresinizle birlikte `support@forwardemail.net` adresine e-posta gönderin.
* WKD sorgusu ile veya arayüzümüzde yüklenen PGP anahtarı kullanılarak iletilen mesajlar için PGP şifrelemesini destekliyoruz.
* Yüklenen anahtarlar, PGP onay kutusu etkin/işaretli olduğu sürece önceliklidir.
* Webhook'lara gönderilen mesajlar şu anda PGP ile şifrelenmemektedir.
* Bir yönlendirme adresi için birden fazla eşleşen takma adınız varsa (örneğin regex/wildcard/tam kombinasyon) ve bunlardan birden fazlası yüklenmiş PGP anahtarı içerip PGP işaretliyse → size bir hata uyarı e-postası göndeririz ve mesajı yüklenmiş PGP anahtarınızla şifrelemeyiz. Bu çok nadirdir ve genellikle karmaşık takma ad kuralları olan ileri düzey kullanıcılar için geçerlidir.
* **Gönderenin DMARC politikası reject ise, MX sunucularımız üzerinden e-posta yönlendirmede PGP şifrelemesi uygulanmaz. *Tüm* postalar için PGP şifrelemesi gerekiyorsa, IMAP servisimiz kullanmanızı ve takma adınız için gelen postalar için PGP anahtarınızı yapılandırmanızı öneririz.**

**Web Anahtar Dizini kurulumunuzu <https://wkd.chimbosonic.com/> (açık kaynak) veya <https://www.webkeydirectory.com/> (proprietary) adreslerinde doğrulayabilirsiniz.**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Otomatik Şifreleme:
  </strong>
  <span><a href="#do-you-support-sending-email-with-smtp" class="alert-link">Giden SMTP servisimiz</a> kullanıyorsanız ve şifrelenmemiş mesajlar gönderiyorsanız, alıcı bazında <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Anahtar Dizini ("WKD")</a> kullanarak mesajları otomatik olarak şifrelemeye çalışacağız.</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Özel alan adınız için OpenPGP'yi etkinleştirmek üzere aşağıdaki tüm adımları takip etmelisiniz.
  </span>
</div>

1. Aşağıda e-posta istemcinizin önerdiği eklentiyi indirip kurun:

   | E-posta İstemcisi | Platform | Önerilen Eklenti                                                                                                                                                                    | Notlar                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | ----------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird       | Masaüstü | [Thunderbird'de OpenPGP'yi Yapılandırma](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird, OpenPGP için yerleşik desteğe sahiptir.                                                                                                                                                                                                                                                                                                                                                                                     |
   | Gmail             | Tarayıcı | [Mailvelope](https://mailvelope.com/) veya [FlowCrypt](https://flowcrypt.com/download) (özel lisans)                                                                                | Gmail OpenPGP'yi desteklemez, ancak açık kaynaklı eklenti [Mailvelope](https://mailvelope.com/) veya [FlowCrypt](https://flowcrypt.com/download) indirilebilir.                                                                                                                                                                                                                                                                          |
   | Apple Mail        | macOS    | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                        | Apple Mail OpenPGP'yi desteklemez, ancak açık kaynaklı eklenti [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) indirilebilir.                                                                                                                                                                                                                                                               |
   | Apple Mail        | iOS      | [PGPro](https://github.com/opensourceios/PGPro/) veya [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (özel lisans)                             | Apple Mail OpenPGP'yi desteklemez, ancak açık kaynaklı eklenti [PGPro](https://github.com/opensourceios/PGPro/) veya [FlowCrypt](https://flowcrypt.com/download) indirilebilir.                                                                                                                                                                                                                                                        |
   | Outlook           | Windows  | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                        | Outlook masaüstü e-posta istemcisi OpenPGP'yi desteklemez, ancak açık kaynaklı eklenti [gpg4win](https://www.gpg4win.de/index.html) indirilebilir.                                                                                                                                                                                                                                                                                      |
   | Outlook           | Tarayıcı | [Mailvelope](https://mailvelope.com/) veya [FlowCrypt](https://flowcrypt.com/download) (özel lisans)                                                                                | Outlook web tabanlı e-posta istemcisi OpenPGP'yi desteklemez, ancak açık kaynaklı eklenti [Mailvelope](https://mailvelope.com/) veya [FlowCrypt](https://flowcrypt.com/download) indirilebilir.                                                                                                                                                                                                                                          |
   | Android           | Mobil    | [OpenKeychain](https://www.openkeychain.org/) veya [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                 | [Android e-posta istemcileri](/blog/open-source/android-email-clients) arasında [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) ve [FairEmail](https://github.com/M66B/FairEmail) açık kaynaklı eklenti [OpenKeychain](https://www.openkeychain.org/) desteğine sahiptir. Alternatif olarak açık kaynaklı (özel lisanslı) eklenti [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) kullanılabilir. |
   | Google Chrome     | Tarayıcı | [Mailvelope](https://mailvelope.com/) veya [FlowCrypt](https://flowcrypt.com/download) (özel lisans)                                                                                | Açık kaynaklı tarayıcı uzantısı [Mailvelope](https://mailvelope.com/) veya [FlowCrypt](https://flowcrypt.com/download) indirilebilir.                                                                                                                                                                                                                                                                                                   |
   | Mozilla Firefox   | Tarayıcı | [Mailvelope](https://mailvelope.com/) veya [FlowCrypt](https://flowcrypt.com/download) (özel lisans)                                                                                | Açık kaynaklı tarayıcı uzantısı [Mailvelope](https://mailvelope.com/) veya [FlowCrypt](https://flowcrypt.com/download) indirilebilir.                                                                                                                                                                                                                                                                                                   |
   | Microsoft Edge    | Tarayıcı | [Mailvelope](https://mailvelope.com/)                                                                                                                                               | Açık kaynaklı tarayıcı uzantısı [Mailvelope](https://mailvelope.com/) indirilebilir.                                                                                                                                                                                                                                                                                                                                                      |
   | Brave             | Tarayıcı | [Mailvelope](https://mailvelope.com/) veya [FlowCrypt](https://flowcrypt.com/download) (özel lisans)                                                                                | Açık kaynaklı tarayıcı uzantısı [Mailvelope](https://mailvelope.com/) veya [FlowCrypt](https://flowcrypt.com/download) indirilebilir.                                                                                                                                                                                                                                                                                                   |
   | Balsa             | Masaüstü | [Balsa'da OpenPGP'yi Yapılandırma](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                    | Balsa, OpenPGP için yerleşik desteğe sahiptir.                                                                                                                                                                                                                                                                                                                                                                                            |
   | KMail             | Masaüstü | [KMail'de OpenPGP'yi Yapılandırma](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                         | KMail, OpenPGP için yerleşik desteğe sahiptir.                                                                                                                                                                                                                                                                                                                                                                                            |
   | GNOME Evolution   | Masaüstü | [Evolution'da OpenPGP'yi Yapılandırma](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                       | GNOME Evolution, OpenPGP için yerleşik desteğe sahiptir.                                                                                                                                                                                                                                                                                                                                                                                  |
   | Terminal          | Masaüstü | [Terminalde gpg'yi Yapılandırma](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                   | Komut satırından yeni anahtar oluşturmak için açık kaynaklı [gpg komut satırı aracını](https://www.gnupg.org/download/) kullanabilirsiniz.                                                                                                                                                                                                                                                                                                  |
2. Eklentiyi açın, genel anahtarınızı oluşturun ve e-posta istemcinizi bunu kullanacak şekilde yapılandırın.

3. Genel anahtarınızı <https://keys.openpgp.org/upload> adresine yükleyin.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       İpucu:
     </strong>
     <span>Gelecekte anahtarınızı yönetmek için <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> adresini ziyaret edebilirsiniz.</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       İsteğe Bağlı Eklenti:
     </strong>
     <span>
       Eğer <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">şifreli depolama (IMAP/POP3)</a> hizmetimizi kullanıyorsanız ve (zaten şifrelenmiş) SQLite veritabanınızda depolanan <i>tüm</i> e-postaların genel anahtarınızla şifrelenmesini istiyorsanız, o zaman <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar (örneğin <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Düzenle <i class="fa fa-angle-right"></i> OpenPGP bölümüne gidip genel anahtarınızı yükleyin.
     </span>
   </div>

4. Alan adınıza yeni bir `CNAME` kaydı ekleyin (örneğin `example.com`):

   <table class="table table-striped table-hover my-3">
     <thead class="thead-dark">
       <tr>
         <th>Ad/Sunucu/Takma Ad</th>
         <th class="text-center">TTL</th>
         <th>Tür</th>
         <th>Cevap/Değer</th>
       </tr>
     </thead>
     <tbody>
       <tr>
         <td><code>openpgpkey</code></td>
         <td class="text-center">3600</td>
         <td class="notranslate">CNAME</td>
         <td><code>wkd.keys.openpgp.org</code></td>
       </tr>
     </tbody>
   </table>

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       İpucu:
     </strong>
     <span>Eğer takma adınız bizim <a class="alert-link" href="/disposable-addresses" target="_blank">geçici/vanity alan adlarımızı</a> (örneğin <code>hideaddress.net</code>) kullanıyorsa, bu adımı atlayabilirsiniz.</span>
   </div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Tebrikler!
    </strong>
    <span>
      Tüm adımları başarıyla tamamladınız.
    </span>
  </div>
</div>

### S/MIME şifrelemesini destekliyor musunuz? {#do-you-support-smime-encryption}

Evet, [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551) ile tanımlandığı şekilde [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME) şifrelemesini destekliyoruz. S/MIME, X.509 sertifikaları kullanarak uçtan uca şifreleme sağlar ve kurumsal e-posta istemcileri tarafından yaygın olarak desteklenir.

Hem RSA hem de ECC (Eliptik Eğri Kriptografisi) sertifikalarını destekliyoruz:

* **RSA sertifikaları**: minimum 2048-bit, önerilen 4096-bit
* **ECC sertifikaları**: P-256, P-384 ve P-521 NIST eğrileri

Takma adınız için S/MIME şifrelemesini yapılandırmak için:

1. Güvenilir bir Sertifika Otoritesi'nden (CA) bir S/MIME sertifikası alın veya test amaçlı kendinden imzalı bir sertifika oluşturun.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       İpucu:
     </strong>
     <span>Ücretsiz S/MIME sertifikaları <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> veya <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Ücretsiz S/MIME</a> gibi sağlayıcılardan temin edilebilir.</span>
   </div>

2. Sertifikanızı PEM formatında dışa aktarın (yalnızca genel sertifika, özel anahtar değil).

3. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar (örneğin <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> Düzenle <i class="fa fa-angle-right"></i> S/MIME bölümüne gidin ve genel sertifikanızı yükleyin.
4. Yapılandırıldıktan sonra, takma adınıza gelen tüm e-postalar, saklanmadan veya iletilmeden önce S/MIME sertifikanız kullanılarak şifrelenecektir.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Not:
     </strong>
     <span>
       S/MIME şifrelemesi, zaten şifrelenmemiş gelen mesajlara uygulanır. Bir mesaj zaten OpenPGP veya S/MIME ile şifrelenmişse, yeniden şifrelenmez.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Önemli:
     </strong>
     <span>
       Gönderenin DMARC politikası reject ise, S/MIME şifrelemesi MX sunucularımız üzerinden yapılan e-posta iletimine uygulanmayacaktır. <em>Tüm</em> postalar için S/MIME şifrelemesi gerekiyorsa, IMAP servisimiz kullanmanızı ve gelen postalar için takma adınıza S/MIME sertifikanızı yapılandırmanızı öneririz.
     </span>
   </div>

Aşağıdaki e-posta istemcileri yerleşik S/MIME desteğine sahiptir:

| E-posta İstemcisi | Platform | Notlar                                                                                                               |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| Apple Mail        | macOS    | Yerleşik S/MIME desteği. Sertifikaları yapılandırmak için Mail > Tercihler > Hesaplar > hesabınız > Güven > gidin.  |
| Apple Mail        | iOS      | Yerleşik S/MIME desteği. Yapılandırmak için Ayarlar > Mail > Hesaplar > hesabınız > Gelişmiş > S/MIME yolunu izleyin.|
| Microsoft Outlook | Windows  | Yerleşik S/MIME desteği. Yapılandırmak için Dosya > Seçenekler > Güven Merkezi > Güven Merkezi Ayarları > E-posta Güvenliği yolunu izleyin. |
| Microsoft Outlook | macOS    | Yerleşik S/MIME desteği. Yapılandırmak için Araçlar > Hesaplar > Gelişmiş > Güvenlik yolunu izleyin.                 |
| Thunderbird       | Masaüstü | Yerleşik S/MIME desteği. Yapılandırmak için Hesap Ayarları > Uçtan Uca Şifreleme > S/MIME yolunu izleyin.            |
| GNOME Evolution   | Masaüstü | Yerleşik S/MIME desteği. Yapılandırmak için Düzenle > Tercihler > Posta Hesapları > hesabınız > Güvenlik yolunu izleyin. |
| KMail             | Masaüstü | Yerleşik S/MIME desteği. Yapılandırmak için Ayarlar > KMail'i Yapılandır > Kimlikler > kimliğiniz > Kriptografi yolunu izleyin. |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Tebrikler!
    </strong>
    <span>
      Takma adınız için S/MIME şifrelemesini başarıyla yapılandırdınız.
    </span>
  </div>
</div>

### Sieve e-posta filtrelemeyi destekliyor musunuz {#do-you-support-sieve-email-filtering}

Evet! [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228) ile tanımlandığı şekilde [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) e-posta filtrelemeyi destekliyoruz. Sieve, gelen mesajları otomatik olarak düzenlemenize, filtrelemenize ve yanıtlamanıza olanak tanıyan güçlü, standartlaştırılmış bir sunucu tarafı e-posta filtreleme betik dilidir.

#### Desteklenen Sieve Uzantıları {#supported-sieve-extensions}

Kapsamlı bir Sieve uzantıları setini destekliyoruz:

| Uzantı                      | RFC                                                                                   | Açıklama                                        |
| --------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `fileinto`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                             | Mesajları belirli klasörlere dosyalama          |
| `reject` / `ereject`        | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                             | Hata ile mesajları reddetme                      |
| `vacation`                  | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                             | Otomatik tatil/ofis dışı yanıtları               |
| `vacation-seconds`          | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                             | İnce ayarlı tatil yanıt aralıkları               |
| `imap4flags`                | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                             | IMAP bayraklarını ayarlama (\Seen, \Flagged vb.)|
| `envelope`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                             | Zarf gönderen/alıcı testi                         |
| `body`                      | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                             | Mesaj gövdesi içeriği testi                       |
| `variables`                 | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                             | Betiklerde değişkenleri saklama ve kullanma      |
| `relational`                | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                             | İlişkisel karşılaştırmalar (büyüktür, küçüktür)  |
| `comparator-i;ascii-numeric`| [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                             | Sayısal karşılaştırmalar                          |
| `copy`                      | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                             | Yönlendirirken mesajları kopyalama               |
| `editheader`                | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                             | Mesaj başlıklarını ekleme veya silme              |
| `date`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                             | Tarih/saat değerlerini test etme                  |
| `index`                     | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                             | Belirli başlık tekrarlarına erişim                |
| `regex`                     | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex)| Düzenli ifade eşleştirme                          |
| `enotify`                   | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                             | Bildirim gönderme (örneğin, mailto:)             |
| `environment`               | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                             | Ortam bilgilerine erişim                           |
| `mailbox`                   | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                             | Posta kutusu varlığını test etme, posta kutuları oluşturma |
| `special-use`               | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                             | Özel kullanım posta kutularına dosyalama (\Junk, \Trash) |
| `duplicate`                 | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                             | Çift mesajları tespit etme                        |
| `ihave`                     | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                             | Uzantı kullanılabilirliğini test etme             |
| `subaddress`                | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                             | kullanıcı+detay adres parçalarına erişim          |
#### Desteklenmeyen Uzantılar {#extensions-not-supported}

Aşağıdaki uzantılar şu anda desteklenmemektedir:

| Uzantı                                                        | Sebep                                                               |
| ------------------------------------------------------------- | ------------------------------------------------------------------ |
| `include`                                                     | Güvenlik riski (script enjeksiyonu) ve global script depolama gerektirir |
| `mboxmetadata` / `servermetadata`                             | IMAP METADATA uzantısı desteği gerektirir                          |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | Karmaşık MIME ağacı manipülasyonu henüz uygulanmadı               |

#### Örnek Sieve Scriptleri {#example-sieve-scripts}

**Bültenleri bir klasöre dosyalama:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**Tatil durumunda otomatik yanıt:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "Şu anda ofis dışında bulunmaktayım ve döndüğümde yanıt vereceğim.";
```

**Önemli gönderenlerden gelen mesajları işaretleme:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**Belirli konulu spam mesajları reddetme:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Mesaj spam içeriği nedeniyle reddedildi.";
}
```

#### Sieve Scriptlerini Yönetme {#managing-sieve-scripts}

Sieve scriptlerinizi birkaç şekilde yönetebilirsiniz:

1. **Web Arayüzü**: Script oluşturmak ve yönetmek için <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar <i class="fa fa-angle-right"></i> Sieve Scriptleri bölümüne gidin.

2. **ManageSieve Protokolü**: Thunderbird'ün Sieve eklentisi veya [sieve-connect](https://github.com/philpennock/sieve-connect) gibi ManageSieve uyumlu herhangi bir istemci kullanarak `imap.forwardemail.net` adresine bağlanın. Çoğu istemci için önerilen STARTTLS ile `2190` portunu veya implicit TLS ile `4190` portunu kullanın.

3. **API**: Scriptleri programlı olarak yönetmek için [REST API](/api#sieve-scripts) kullanabilirsiniz.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Not:
  </strong>
  <span>
    Sieve filtreleme, gelen mesajlar posta kutunuza kaydedilmeden önce uygulanır. Scriptler öncelik sırasına göre çalıştırılır ve ilk eşleşen işlem mesajın nasıl işleneceğini belirler.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Güvenlik:
  </strong>
  <span>
    Güvenlik nedeniyle, yönlendirme işlemleri script başına 10 ve günlük 100 ile sınırlandırılmıştır. Tatil yanıtları kötüye kullanımı önlemek için oran sınırlamasına tabidir.
  </span>
</div>

### MTA-STS Destekliyor musunuz? {#do-you-support-mta-sts}

Evet, 2 Mart 2023 itibarıyla [MTA-STS](https://www.hardenize.com/blog/mta-sts) desteklemekteyiz. Alan adınızda etkinleştirmek isterseniz [bu şablonu](https://github.com/jpawlowski/mta-sts.template) kullanabilirsiniz.

Yapılandırmamız GitHub’da herkese açık olarak <https://github.com/forwardemail/mta-sts.forwardemail.net> adresinde bulunmaktadır.

### Passkey ve WebAuthn Destekliyor musunuz? {#do-you-support-passkeys-and-webauthn}

Evet! 13 Aralık 2023 itibarıyla yüksek talep nedeniyle [passkey desteği](https://github.com/orgs/forwardemail/discussions/182) ekledik.

Passkey’ler, parola ve iki faktörlü kimlik doğrulama gerektirmeden güvenli giriş yapmanızı sağlar.

Kimliğinizi dokunmatik, yüz tanıma, cihaz tabanlı parola veya PIN ile doğrulayabilirsiniz.

Tüm cihazlarınızla kolayca giriş yapabilmeniz için aynı anda 30 passkey yönetmenize izin veriyoruz.

Passkey’ler hakkında daha fazla bilgi için aşağıdaki bağlantılara bakabilirsiniz:

* [Uygulamalarınıza ve web sitelerinize passkey ile giriş yapın](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [iPhone’da uygulamalara ve web sitelerine passkey ile giriş yapma](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Passkey hakkında Vikipedi makalesi](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### E-posta en iyi uygulamalarını destekliyor musunuz {#do-you-support-email-best-practices}

Evet. Tüm planlarda SPF, DKIM, DMARC, ARC ve SRS için yerleşik destek sağlıyoruz. Ayrıca, bu spesifikasyonların orijinal yazarları ve diğer e-posta uzmanları ile kapsamlı çalışmalar yaparak mükemmellik ve yüksek teslim edilebilirlik sağladık.

### Bounce webhook'larını destekliyor musunuz {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    İpucu:
  </strong>
    E-posta webhook'ları hakkında dokümantasyon mu arıyorsunuz? Daha fazla bilgi için <a href="/faq#do-you-support-webhooks" class="alert-link">Webhook'ları destekliyor musunuz?</a> sayfasına bakın.
  <span>
  </span>
</div>

Evet, 14 Ağustos 2024 itibarıyla bu özelliği ekledik. Artık Hesabım → Alan Adları → Ayarlar → Bounce Webhook URL'si bölümüne gidip, gönderilen SMTP e-postaları bounce olduğunda `POST` isteği göndereceğimiz bir `http://` veya `https://` URL'si yapılandırabilirsiniz.

Bu, gönderdiğiniz SMTP e-postalarını yönetmek ve izlemek için faydalıdır – aboneleri yönetmek, çıkış işlemleri yapmak ve bounce oluştuğunda tespit etmek için kullanılabilir.

Bounce webhook yükleri şu özelliklere sahip JSON olarak gönderilir:

* `email_id` (String) - Hesabım → E-postalar (giden SMTP) bölümündeki e-postaya karşılık gelen e-posta ID'si
* `list_id` (String) - orijinal giden e-postadan varsa `List-ID` başlığı (büyük/küçük harf duyarsız) değeri
* `list_unsubscribe` (String) - orijinal giden e-postadan varsa `List-Unsubscribe` başlığı (büyük/küçük harf duyarsız) değeri
* `feedback_id` (String) - orijinal giden e-postadan varsa `Feedback-ID` başlığı (büyük/küçük harf duyarsız) değeri
* `recipient` (String) - bounce olan veya hata veren alıcının e-posta adresi
* `message` (String) - bounce için detaylı hata mesajı
* `response` (String) - SMTP yanıt mesajı
* `response_code` (Number) - ayrıştırılmış SMTP yanıt kodu
* `truth_source` (String) - yanıt kodu güvenilir bir kaynaktan geldiyse, bu değer kök alan adı ile doldurulur (örneğin `google.com` veya `yahoo.com`)
* `bounce` (Object) - bounce ve reddetme durumunu detaylandıran aşağıdaki özelliklere sahip nesne
  * `action` (String) - bounce işlemi (örneğin `"reject"`)
  * `message` (String) - bounce nedeni (örneğin `"Message Sender Blocked By Receiving Server"`)
  * `category` (String) - bounce kategorisi (örneğin `"block"`)
  * `code` (Number) - bounce durum kodu (örneğin `554`)
  * `status` (String) - yanıt mesajından bounce kodu (örneğin `5.7.1`)
  * `line` (Number) - ayrıştırılmış satır numarası, varsa, [Zone-MTA bounce ayrıştırma listesi](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (örneğin `526`)
* `headers` (Object) - giden e-postanın başlıklarının anahtar-değer çiftleri
* `bounced_at` (String) - bounce hatasının oluştuğu zaman için [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) formatında tarih

Örnek:

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "The email account that you tried to reach is over quota.",
  "response": "552 5.2.2 The email account that you tried to reach is over quota.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Gmail Mailbox is full",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

Bounce webhook'ları ile ilgili birkaç ek not:

* Eğer webhook yükünde `list_id`, `list_unsubscribe` veya `feedback_id` değeri varsa, gerekirse `recipient`'ı listeden çıkarmak için uygun işlemi yapmalısınız.
  * Eğer `bounce.category` değeri `"block"`, `"recipient"`, `"spam"` veya `"virus"` ise, kullanıcıyı listeden kesinlikle çıkarmalısınız.
* Webhook yüklerinin doğruluğunu kontrol etmeniz gerekiyorsa (gerçekten sunucumuzdan gelip gelmediğini doğrulamak için), [ters DNS sorgusu yaparak uzak istemci IP adresinin istemci ana bilgisayar adını çözebilirsiniz](https://nodejs.org/api/dns.html#dnspromisesreverseip) – bu `smtp.forwardemail.net` olmalıdır.
  * Ayrıca IP adresini [yayınladığımız IP adresleri](#what-are-your-servers-ip-addresses) ile karşılaştırabilirsiniz.
  * Webhook anahtarınızı almak için Hesabım → Alan Adları → Ayarlar → Webhook İmza Yükü Doğrulama Anahtarı bölümüne gidin.
    * Güvenlik nedeniyle bu anahtarı istediğiniz zaman değiştirebilirsiniz.
    * Webhook isteğimizden gelen `X-Webhook-Signature` değerini, bu anahtarı kullanarak hesaplanan gövde değeri ile karşılaştırın. Nasıl yapılacağına dair bir örnek [bu Stack Overflow gönderisinde](https://stackoverflow.com/a/68885281) mevcuttur.
  * Daha fazla bilgi için <https://github.com/forwardemail/free-email-forwarding/issues/235> tartışmasına bakabilirsiniz.
* Webhook uç noktanızın `200` durum kodu ile yanıt vermesi için `5` saniyeye kadar bekleyeceğiz ve `1` kez yeniden deneyeceğiz.
* Bounce webhook URL'nizde bir hata tespit edersek, haftada bir kez size nezaket amaçlı bir e-posta göndereceğiz.
### Webhook'ları destekliyor musunuz {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    İpucu:
  </strong>
    Bounce webhook'ları hakkında dokümantasyon mu arıyorsunuz? Daha fazla bilgi için <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Bounce webhook'ları destekliyor musunuz?</a> sayfasına bakın.
  <span>
  </span>
</div>

Evet, 15 Mayıs 2020 itibarıyla bu özelliği ekledik. Webhook(lar)ı, herhangi bir alıcıya ekler gibi kolayca ekleyebilirsiniz! Lütfen webhook URL'sinde "http" veya "https" protokolünün ön ek olarak bulunduğundan emin olun.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Gelişmiş Gizlilik Koruması:
  </strong>
  <span>
    Eğer gelişmiş gizlilik koruması içeren ücretli bir plandaysanız, lütfen <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> sayfasına gidin ve webhook'larınızı yapılandırmak için alan adınızın yanındaki "Takma Adlar" seçeneğine tıklayın. Ücretli planlar hakkında daha fazla bilgi almak isterseniz <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Fiyatlandırma</a> sayfamıza göz atabilirsiniz. Aksi takdirde aşağıdaki talimatları takip etmeye devam edebilirsiniz.
  </span>
</div>

Eğer ücretsiz plandaysanız, aşağıda gösterildiği gibi yeni bir DNS <strong class="notranslate">TXT</strong> kaydı eklemeniz yeterlidir:

Örneğin, `alias@example.com` adresine giden tüm e-postaların yeni bir [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect) test uç noktasına yönlendirilmesini istiyorsam:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ad/Sunucu/Takma Ad</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

Ya da belki `example.com` adresine giden tüm e-postaların bu uç noktaya yönlendirilmesini istiyorsunuz:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ad/Sunucu/Takma Ad</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

**Webhook'lar ile ilgili ek notlar şunlardır:**

* Webhook yüklerini doğrulamanız gerekiyorsa (yüklerin gerçekten sunucumuzdan geldiğinden emin olmak için), [ters DNS sorgusu kullanarak uzak istemci IP adresi istemci ana bilgisayar adını çözebilirsiniz](https://nodejs.org/api/dns.html#dnspromisesreverseip) – bu değer ya `mx1.forwardemail.net` ya da `mx2.forwardemail.net` olmalıdır.
  * Ayrıca IP adresini [yayınladığımız IP adresleriyle](#what-are-your-servers-ip-addresses) karşılaştırabilirsiniz.
  * Ücretli plandaysanız, webhook anahtarınızı almak için Hesabım → Alan Adları → Ayarlar → Webhook İmza Yükü Doğrulama Anahtarı sayfasına gidin.
    * Güvenlik nedeniyle bu anahtarı istediğiniz zaman değiştirebilirsiniz.
    * Webhook isteğimizden gelen `X-Webhook-Signature` değerini, bu anahtarı kullanarak hesaplanan gövde değeri ile karşılaştırın. Bunu nasıl yapacağınızla ilgili bir örnek [bu Stack Overflow gönderisinde](https://stackoverflow.com/a/68885281) mevcuttur.
  * Daha fazla bilgi için <https://github.com/forwardemail/free-email-forwarding/issues/235> tartışmasına bakabilirsiniz.
* Bir webhook `200` durum kodu ile yanıt vermezse, yanıtı [oluşturulan hata günlüğünde](#do-you-store-error-logs) saklanır – bu hata ayıklama için faydalıdır.
* Webhook HTTP istekleri, her SMTP bağlantı denemesinde en fazla 3 kez yeniden denenir ve her uç nokta POST isteği için maksimum 60 saniye zaman aşımı vardır. **Bu, sadece 3 kez deneneceği anlamına gelmez**, aslında 3. başarısız HTTP POST isteğinden sonra göndericiye daha sonra tekrar denemesi gerektiğini belirten 421 SMTP kodu göndererek sürekli olarak yeniden denenecektir. Bu, e-postanın 200 durum kodu alınana kadar günlerce sürekli yeniden deneneceği anlamına gelir.
* Yeniden denemeler, [superagent'ın retry yöntemi](https://ladjs.github.io/superagent/#retrying-requests) tarafından kullanılan varsayılan durum ve hata kodlarına göre otomatik olarak yapılır (biz bu kütüphanenin bakımcılarıyız).
* Aynı uç noktaya yapılan webhook HTTP isteklerini kaynakları korumak ve yanıt süresini hızlandırmak için tek bir istekte toplarız (birden fazla yerine). Örneğin, <webhook1@example.com>, <webhook2@example.com> ve <webhook3@example.com> adreslerine e-posta gönderirseniz ve bunların hepsi tam olarak aynı uç nokta URL'sine yapılandırılmışsa, sadece bir istek yapılır. Gruplama tam eşleşme ile yapılır.
* Mesajı JSON dostu bir nesneye ayrıştırmak için [mailparser](https://nodemailer.com/extras/mailparser/) kütüphanesinin "simpleParser" metodunu kullanıyoruz.
* Ham e-posta değeri String olarak "raw" özelliğiyle verilir.
* Kimlik doğrulama sonuçları "dkim", "spf", "arc", "dmarc" ve "bimi" özellikleri olarak verilir.
* Ayrıştırılmış e-posta başlıkları "headers" özelliği olarak verilir – ayrıca daha kolay yineleme ve ayrıştırma için "headerLines" kullanılabilir.
* Bu webhook için gruplanmış alıcılar "recipients" özelliği olarak verilir.
* SMTP oturum bilgileri "session" özelliği olarak verilir. Bu, mesajın göndericisi, mesajın varış zamanı, HELO ve istemci ana bilgisayar adı hakkında bilgi içerir. İstemci ana bilgisayar adı değeri `session.clientHostname` ya ters PTR sorgusundan elde edilen FQDN'dir ya da köşeli parantez içinde `session.remoteAddress` (örneğin `"[127.0.0.1]"`) olarak verilir.
* `X-Original-To` değerini hızlıca almak isterseniz, `session.recipient` değerini kullanabilirsiniz (aşağıdaki örneğe bakınız). `X-Original-To` başlığı, mesaj için orijinal alıcıyı (maskelenmiş yönlendirmeden önce) hata ayıklama amacıyla eklediğimiz bir başlıktır.
* Yük gövdesinden `attachments` ve/veya `raw` özelliklerini kaldırmak isterseniz, webhook uç noktanıza sorgu parametresi olarak `?attachments=false`, `?raw=false` veya `?attachments=false&raw=false` ekleyin (örneğin `https://example.com/webhook?attachments=false&raw=false`).
* Eğer ekler varsa, bunlar Buffer değerleri ile `attachments` Dizisine eklenir. İçeriği JavaScript ile şu şekilde tekrar ayrıştırabilirsiniz:
  ```js
  const data = [
    104,
    101,
    108,
    108,
    111,
    32,
    119,
    111,
    114,
    108,
    100,
    33
  ];

  //
  // outputs "hello world!" to the console
  // (this is the content from the filename "text1.txt" in the example JSON request payload above)
  //
  console.log(Buffer.from(data).toString());
  ```

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Curious what the webhook request looks like from forwarded emails?  We've included an example below for you!
  <span>
  </span>
</div>

```json
{
  "attachments": [
    {
      "type": "attachment",
      "content": {
        "type": "Buffer",
        "data": [
          104,
          101,
          108,
          108,
          111,
          32,
          119,
          111,
          114,
          108,
          100,
          33
        ]
      },
      "contentType": "text/plain",
      "partId": "2",
      "release": null,
      "contentDisposition": "attachment",
      "filename": "text1.txt",
      "headers": {},
      "checksum": "fc3ff98e8c6a0d3087d515c0473f8677",
      "size": 12
    }
  ],
  "headers": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\n",
  "headerLines": [
    {
      "key": "arc-seal",
      "line": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0="
    },
    {
      "key": "arc-message-signature",
      "line": "ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino="
    },
    {
      "key": "arc-authentication-results",
      "line": "ARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "received-spf",
      "line": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;"
    },
    {
      "key": "authentication-results",
      "line": "Authentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "x-forward-email-sender",
      "line": "X-Forward-Email-Sender: rfc822; test@example.net"
    },
    {
      "key": "x-forward-email-session-id",
      "line": "X-Forward-Email-Session-ID: w2czxgznghn5ryyw"
    },
    {
      "key": "x-forward-email-version",
      "line": "X-Forward-Email-Version: 9.0.0"
    },
    {
      "key": "content-type",
      "line": "Content-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\""
    },
    {
      "key": "from",
      "line": "From: some <random@example.com>"
    },
    {
      "key": "message-id",
      "line": "Message-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>"
    },
    {
      "key": "date",
      "line": "Date: Wed, 25 May 2022 19:26:41 +0000"
    },
    {
      "key": "mime-version",
      "line": "MIME-Version: 1.0"
    }
  ],
  "html": "<strong>some random text</strong>",
  "text": "some random text",
  "textAsHtml": "<p>some random text</p>",
  "date": "2022-05-25T19:26:41.000Z",
  "from": {
    "value": [
      {
        "address": "random@example.com",
        "name": "some"
      }
    ],
    "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">some</span> &lt;<a href=\"mailto:random@example.com\" class=\"mp_address_email\">random@example.com</a>&gt;</span>",
    "text": "some <random@example.com>"
  },
  "messageId": "<69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>",
  "raw": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nX-Forward-Email-Sender: rfc822; test@example.net\r\nX-Forward-Email-Session-ID: w2czxgznghn5ryyw\r\nX-Forward-Email-Version: 9.0.0\r\nContent-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\"\r\nFrom: some <random@example.com>\r\nMessage-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>\r\nDate: Wed, 25 May 2022 19:26:41 +0000\r\nMIME-Version: 1.0\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: multipart/alternative;\r\n boundary=\"--_NmP-179a735428ca7575-Part_2\"\r\n\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\nsome random text\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\n<strong>some random text</strong>\r\n----_NmP-179a735428ca7575-Part_2--\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: text/plain; name=text1.txt\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=text1.txt\r\n\r\naGVsbG8gd29ybGQh\r\n----_NmP-179a735428ca7575-Part_1--\r\n",
  "dkim": {
    "headerFrom": [
      "random@example.com"
    ],
    "envelopeFrom": "test@example.net",
    "results": [
      {
        "status": {
          "result": "none",
          "comment": "message not signed"
        },
        "info": "dkim=none (message not signed)"
      }
    ]
  },
  "spf": {
    "domain": "example.net",
    "client-ip": "127.0.0.1",
    "helo": "user.oem.local",
    "envelope-from": "test@example.net",
    "status": {
      "result": "none",
      "comment": "mx1.forwardemail.net: example.net does not designate permitted sender hosts",
      "smtp": {
        "mailfrom": "test@example.net",
        "helo": "user.oem.local"
      }
    },
    "header": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;",
    "info": "spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local",
    "lookups": {
      "limit": 50,
      "count": 1
    }
  },
  "arc": {
    "status": {
      "result": "none"
    },
    "i": 0,
    "authResults": "mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
  },
  "dmarc": {
    "status": {
      "result": "none",
      "header": {
        "from": "example.com"
      }
    },
    "domain": "example.com",
    "info": "dmarc=none header.from=example.com"
  },
  "bimi": {
    "status": {
      "header": {},
      "result": "skipped",
      "comment": "DMARC not enabled"
    },
    "info": "bimi=skipped (DMARC not enabled)"
  },
  "recipients": [
    "webhook1@webhooks.net"
  ],
  "session": {
    "recipient": "webhook1@webhooks.net",
    "remoteAddress": "127.0.0.1",
    "remotePort": 65138,
    "clientHostname": "[127.0.0.1]",
    "hostNameAppearsAs": "user.oem.local",
    "sender": "test@example.net",
    "mta": "mx1.forwardemail.net",
    "arrivalDate": "2022-05-25T19:26:41.423Z",
    "arrivalTime": 1653506801423
  }
}
```

### Düzenli ifadeleri veya regex'i destekliyor musunuz {#do-you-support-regular-expressions-or-regex}

Evet, 27 Eylül 2021 itibarıyla bu özelliği ekledik. Takma adları eşleştirmek ve değiştirmeler yapmak için düzenli ifadeler ("regex") yazabilirsiniz.

Düzenli ifade destekli takma adlar, `/` ile başlayıp `/` ile biten ve alıcıları e-posta adresleri veya webhook olanlardır. Alıcılar ayrıca regex değiştirme desteği de içerebilir (örneğin `$1`, `$2`).

`i` ve `g` olmak üzere iki düzenli ifade bayrağını destekliyoruz. `i` bayrağı (büyük/küçük harf duyarsızlığı) kalıcı varsayılan olup her zaman uygulanır. `g` bayrağı ise son `/` işaretinden sonra `/g` ekleyerek sizin tarafınızdan eklenebilir.

Ayrıca, <a href="#can-i-disable-specific-aliases">devre dışı bırakılmış takma ad özelliğimizi</a> regex desteğimizle alıcı kısmında da desteklediğimizi unutmayın.

Düzenli ifadeler <a href="/disposable-addresses" target="_blank">küresel sahte alan adlarında</a> desteklenmez (çünkü bu bir güvenlik açığı olabilir).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Gelişmiş Gizlilik Koruması:
  </strong>
  <span>
    Eğer ücretli bir plandaysanız (gelişmiş gizlilik koruması özellikli), lütfen <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> sayfasına gidin ve alan adınızın yanındaki "Takma Adlar" seçeneğine tıklayarak düzenli ifadeler dahil takma adları yapılandırın. Ücretli planlar hakkında daha fazla bilgi almak isterseniz <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Fiyatlandırma</a> sayfamıza bakabilirsiniz.
  </span>
</div>

#### Gelişmiş Gizlilik Koruması için Örnekler {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Takma Ad Adı</th>
      <th>Etki</th>
      <th>Test</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>`linus@example.com` veya `torvalds@example.com` adreslerine e-postalar</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">RegExr'de testi görüntüle</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>`24highst@example.com` veya `24highstreet@example.com` adreslerine e-postalar</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">RegExr'de testi görüntüle</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    İpucu:
  </strong>
    Bunları <a href="https://regexr.com" class="alert-link">RegExr</a> sitesinde test etmek için, ifadeyi üst kutuya yazın ve ardından altındaki metin kutusuna bir örnek takma ad yazın. Eşleşirse, maviye döner.
  <span>
  </span>
</div>

#### Ücretsiz plan için örnekler {#examples-for-the-free-plan}

Ücretsiz plandaysanız, aşağıdaki sağlanan örneklerden bir veya daha fazlasını kullanarak yeni bir DNS <strong class="notranslate">TXT</strong> kaydı ekleyin:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Basit Örnek:</strong> `linus@example.com` veya `torvalds@example.com` adreslerine giden tüm e-postaların `user@gmail.com` adresine iletilmesini istiyorsam:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ad/Sunucu/Takma Ad</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Ad Soyad Değiştirme Örneği:</strong> Tüm şirket e-posta adreslerinizin `firstname.lastname@example.com` formatında olduğunu varsayalım. `firstname.lastname@example.com` desenine uyan tüm e-postaların, değiştirme desteği ile (`<a href="https://regexr.com/66hnu" class="alert-link">RegExr'de testi görüntüle</a>`) `firstname.lastname@company.com` adresine iletilmesini istiyorsam:
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>İsim/Sunucu/Takma Ad</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Artı Sembolü Filtreleme Yerine Koyma Örneği:</strong> Eğer `info@example.com` veya `support@example.com` adreslerine giden tüm e-postaların sırasıyla `user+info@gmail.com` veya `user+support@gmail.com` adreslerine (yerine koyma desteği ile) yönlendirilmesini istiyorsanız (<a href="https://regexr.com/66ho7" class="alert-link">RegExr üzerinde testi görüntüle</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>İsim/Sunucu/Takma Ad</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Webhook Sorgu Dizisi Yerine Koyma Örneği:</strong> Belki de `example.com` adresine giden tüm e-postaların bir <a href="#do-you-support-webhooks" class="alert-link">webhook</a> adresine gitmesini ve e-posta adresinin kullanıcı adı kısmı değerine sahip dinamik bir "to" sorgu dizisi anahtarına sahip olmasını istiyorsunuz (<a href="https://regexr.com/66ho4" class="alert-link">RegExr üzerinde testi görüntüle</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>İsim/Sunucu/Takma Ad</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Sessiz reddetme örneği:</strong> Belirli bir desene uyan tüm e-postaların devre dışı bırakılmasını ve sessizce reddedilmesini istiyorsanız (göndericiye mesajın başarıyla gönderilmiş gibi görünmesi ama aslında hiçbir yere gitmemesi) ve durum kodu `250` ile (bakınız <a href="#can-i-disable-specific-aliases" class="alert-link">Belirli takma adları devre dışı bırakabilir miyim</a>), o zaman aynı yaklaşımı tek ünlem işareti "!" ile kullanmanız yeterlidir. Bu, göndericiye mesajın başarıyla teslim edildiğini bildirir, ancak aslında hiçbir yere gitmemiştir (örneğin kara delik veya `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>İsim/Sunucu/Takma Ad</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Yumuşak reddetme örneği:</strong> Belirli bir desene uyan tüm e-postaların devre dışı bırakılmasını ve durum kodu `421` ile yumuşak reddedilmesini istiyorsanız (bakınız <a href="#can-i-disable-specific-aliases" class="alert-link">Belirli takma adları devre dışı bırakabilir miyim</a>), o zaman aynı yaklaşımı çift ünlem işareti "!!" ile kullanmanız yeterlidir. Bu, göndericiye e-postasını tekrar denemesi gerektiğini bildirir ve bu takma ad için e-postalar yaklaşık 5 gün boyunca tekrar denenir ve ardından kalıcı olarak reddedilir.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>İsim/Sunucu/Takma Ad</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Sert reddetme örneği:</strong> Belirli bir desene uyan tüm e-postaların devre dışı bırakılmasını ve durum kodu `550` ile sert reddedilmesini istiyorsanız (bkz. <a href="#can-i-disable-specific-aliases" class="alert-link">Belirli takma adları devre dışı bırakabilir miyim</a>), aynı yaklaşımı üç ünlem işareti "!!!" ile kullanabilirsiniz. Bu, göndericiye kalıcı bir hata olduğunu bildirir ve e-postalar yeniden denenmez, bu takma ad için reddedilir.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ad/Sunucu/Takma Ad</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    İpucu:
  </strong>
    Düzenli ifade nasıl yazılır merak ediyor musunuz ya da yer değiştirmeyi test etmeniz mi gerekiyor? Ücretsiz düzenli ifade test sitesi <a href="https://regexr.com" class="alert-link">RegExr</a>'ye <a href="https://regexr.com/" class="alert-link">https://regexr.com</a> adresinden gidebilirsiniz.
  <span>
  </span>
</div>

### Giden SMTP limitleriniz nelerdir {#what-are-your-outbound-smtp-limits}

Kullanıcıları ve alan adlarını 1 gün içinde 300 giden SMTP mesajı ile sınırlandırıyoruz. Bu, takvim ayı başına ortalama 9000+ e-posta demektir. Bu miktarı aşmanız gerekiyorsa veya sürekli olarak büyük e-postalarınız varsa, lütfen [bize ulaşın](https://forwardemail.net/help).

### SMTP'yi etkinleştirmek için onay gerekiyor mu {#do-i-need-approval-to-enable-smtp}

Evet, IP itibarını korumak ve teslim edilebilirliği sağlamak için Forward Email, giden SMTP onayı için alan adı bazında manuel bir inceleme sürecine sahiptir. Onay için <support@forwardemail.net> adresine e-posta gönderin veya bir [yardım talebi](https://forwardemail.net/help) açın. Bu genellikle 24 saatten kısa sürer ve çoğu talep 1-2 saat içinde karşılanır. Yakın gelecekte bu süreci ek spam kontrolleri ve uyarılarla anlık hale getirmeyi hedefliyoruz. Bu süreç, e-postalarınızın gelen kutusuna ulaşmasını ve mesajlarınızın spam olarak işaretlenmemesini sağlar.

### SMTP sunucu yapılandırma ayarlarınız nelerdir {#what-are-your-smtp-server-configuration-settings}

Sunucumuz `smtp.forwardemail.net` olup <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">durum sayfamızda</a> de izlenmektedir.

Hem IPv4 hem de IPv6'yı destekler ve SSL/TLS (önerilen) için `465` ve `2465` portları ile TLS (STARTTLS) için `587`, `2587`, `2525` ve `25` portları üzerinden erişilebilir.

**Ekim 2025 itibarıyla**, artık eski cihazlar (yazıcılar, tarayıcılar, kameralar ve modern TLS sürümlerini destekleyemeyen eski e-posta istemcileri) için **legacy TLS 1.0** bağlantılarını `2455` (SSL/TLS) ve `2555` (STARTTLS) portlarında destekliyoruz. Bu portlar, Gmail, Yahoo, Outlook ve diğer sağlayıcıların eski TLS protokollerine desteği sonlandırmasına alternatif olarak sunulmaktadır.

> \[!CAUTION]
> **Legacy TLS 1.0 Desteği (Portlar 2455 ve 2555)**: Bu portlar, bilinen güvenlik açıkları (BEAST, POODLE) bulunan kullanımdan kaldırılmış TLS 1.0 protokolünü kullanır. Cihazınız kesinlikle TLS 1.2 veya üzerini destekleyemiyorsa bu portları kullanın. Cihaz yazılımınızı güncellemenizi veya mümkün olduğunda modern e-posta istemcilerine geçmenizi şiddetle tavsiye ederiz. Bu portlar yalnızca eski donanım uyumluluğu (eski yazıcılar, tarayıcılar, kameralar, IoT cihazları) için tasarlanmıştır.

|                                     Protokol                                     | Sunucu Adı              |            Portlar           |        IPv4        |        IPv6        | Notlar                                 |
| :------------------------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: | -------------------------------------- |
|                              `SSL/TLS` **Tercih Edilen**                         | `smtp.forwardemail.net` |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | Modern TLS 1.2+ (Önerilen)             |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | Destekleniyor (SSL/TLS portu `465` tercih edilir) |
|                             `SSL/TLS` **Sadece Legacy**                           | `smtp.forwardemail.net` |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: Eski cihazlar için TLS 1.0   |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **Sadece Legacy** | `smtp.forwardemail.net` |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: Eski cihazlar için TLS 1.0   |
| Giriş    | Örnek                      | Açıklama                                                                                                                                                                                 |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kullanıcı Adı | `user@example.com`         | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> altında alan için var olan bir takma adın e-posta adresi. |
| Şifre    | `************************` | Takma ad                                                                                                                                                                                 |

SMTP ile giden e-posta gönderebilmek için, **SMTP kullanıcısı** <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> altında alan için var olan bir takma adın e-posta adresi olmalıdır – ve **SMTP şifresi** takma ada özel oluşturulmuş bir şifre olmalıdır.

Adım adım talimatlar için lütfen [SMTP ile e-posta göndermeyi destekliyor musunuz](#do-you-support-sending-email-with-smtp) bölümüne bakınız.

### IMAP sunucu yapılandırma ayarlarınız nelerdir {#what-are-your-imap-server-configuration-settings}

Sunucumuz `imap.forwardemail.net` olup, <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">durum sayfamızda</a> de izlenmektedir.

Hem IPv4 hem de IPv6'yı destekler ve SSL/TLS için `993` ve `2993` portları üzerinden erişilebilir.

|         Protokol         | Sunucu Adı              |     Portlar    |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :------------: | :----------------: | :----------------: |
| `SSL/TLS` **Tercih Edilen** | `imap.forwardemail.net` | `993`, `2993`  | :white_check_mark: | :white_check_mark: |

| Giriş    | Örnek                      | Açıklama                                                                                                                                                                                 |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kullanıcı Adı | `user@example.com`         | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> altında alan için var olan bir takma adın e-posta adresi. |
| Şifre    | `************************` | Takma ada özel oluşturulmuş şifre.                                                                                                                                                        |

IMAP ile bağlanabilmek için, **IMAP kullanıcısı** <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> altında alan için var olan bir takma adın e-posta adresi olmalıdır – ve **IMAP şifresi** takma ada özel oluşturulmuş bir şifre olmalıdır.

Adım adım talimatlar için lütfen [IMAP ile e-posta almayı destekliyor musunuz](#do-you-support-receiving-email-with-imap) bölümüne bakınız.

### POP3 sunucu yapılandırma ayarlarınız nelerdir {#what-are-your-pop3-server-configuration-settings}

Sunucumuz `pop3.forwardemail.net` olup, <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">durum sayfamızda</a> de izlenmektedir.

Hem IPv4 hem de IPv6'yı destekler ve SSL/TLS için `995` ve `2995` portları üzerinden erişilebilir.

|         Protokol         | Sunucu Adı              |     Portlar    |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :------------: | :----------------: | :----------------: |
| `SSL/TLS` **Tercih Edilen** | `pop3.forwardemail.net` | `995`, `2995`  | :white_check_mark: | :white_check_mark: |
| Giriş    | Örnek                      | Açıklama                                                                                                                                                                                 |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kullanıcı Adı | `user@example.com`         | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> altında alan için var olan bir takma adın e-posta adresi. |
| Şifre    | `************************` | Takma ada özgü oluşturulmuş şifre.                                                                                                                                                        |

POP3 ile bağlanmak için, **POP3 kullanıcısı** <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> altında alan için var olan bir takma adın e-posta adresi olmalıdır – ve **IMAP şifresi** takma ada özgü oluşturulmuş bir şifre olmalıdır.

Adım adım talimatlar için lütfen [POP3 destekliyor musunuz](#do-you-support-pop3) bölümüne bakınız.

### Alan adım için e-posta otomatik keşfi nasıl kurarım {#how-do-i-set-up-email-autodiscovery-for-my-domain}

E-posta otomatik keşfi, kullanıcı e-posta hesabını eklediğinde **Thunderbird**, **Apple Mail**, **Microsoft Outlook** ve mobil cihazlar gibi e-posta istemcilerinin doğru IMAP, SMTP, POP3, CalDAV ve CardDAV sunucu ayarlarını otomatik olarak algılamasını sağlar. Bu, [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (e-posta) ve [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV) tarafından tanımlanır ve DNS SRV kayıtlarını kullanır.

Forward Email, `forwardemail.net` üzerinde otomatik keşif kayıtları yayınlar. Kayıtları doğrudan alan adınıza SRV olarak ekleyebilir veya daha basit bir CNAME yöntemi kullanabilirsiniz.

#### Seçenek A: CNAME kayıtları (en basit) {#option-a-cname-records-simplest}

Alan adınızın DNS'ine bu iki CNAME kaydını ekleyin. Bu, otomatik keşfi Forward Email sunucularına devreder:

|  Tür  | İsim/Host      | Hedef/Değer                    |
| :---: | -------------- | ------------------------------ |
| CNAME | `autoconfig`   | `autoconfig.forwardemail.net`  |
| CNAME | `autodiscover` | `autodiscover.forwardemail.net` |

`autoconfig` kaydı **Thunderbird** ve diğer Mozilla tabanlı istemciler tarafından kullanılır. `autodiscover` kaydı ise **Microsoft Outlook** tarafından kullanılır.

#### Seçenek B: SRV kayıtları (doğrudan) {#option-b-srv-records-direct}

Kayıtları doğrudan eklemeyi tercih ederseniz (veya DNS sağlayıcınız alt alan adlarında CNAME desteklemiyorsa), alan adınıza aşağıdaki SRV kayıtlarını ekleyin:

| Tür  | İsim/Host           | Öncelik | Ağırlık | Port | Hedef/Değer               | Amaç                                  |
| :--: | ------------------- | :------: | :----: | :--: | -------------------------- | ------------------------------------ |
|  SRV | `_imaps._tcp`       |     0    |    1   |  993 | `imap.forwardemail.net`    | SSL/TLS üzerinden IMAP (tercih edilen) |
|  SRV | `_imap._tcp`        |     0    |    0   |   0  | `.`                        | Düz metin IMAP devre dışı            |
|  SRV | `_submissions._tcp` |     0    |    1   |  465 | `smtp.forwardemail.net`    | SMTP gönderimi (SSL/TLS, önerilen)  |
|  SRV | `_submission._tcp`  |     5    |    1   |  587 | `smtp.forwardemail.net`    | SMTP gönderimi (STARTTLS)            |
|  SRV | `_pop3s._tcp`       |    10    |    1   |  995 | `pop3.forwardemail.net`    | SSL/TLS üzerinden POP3               |
|  SRV | `_pop3._tcp`        |     0    |    0   |   0  | `.`                        | Düz metin POP3 devre dışı            |
|  SRV | `_caldavs._tcp`     |     0    |    1   |  443 | `caldav.forwardemail.net`  | TLS üzerinden CalDAV (takvimler)     |
|  SRV | `_caldav._tcp`      |     0    |    0   |   0  | `.`                        | Düz metin CalDAV devre dışı          |
|  SRV | `_carddavs._tcp`    |     0    |    1   |  443 | `carddav.forwardemail.net` | TLS üzerinden CardDAV (kişiler)      |
|  SRV | `_carddav._tcp`     |     0    |    0   |   0  | `.`                        | Düz metin CardDAV devre dışı         |
> \[!NOTE]
> IMAP, POP3'e (10) göre daha düşük bir öncelik değeri (0) taşır; bu, her ikisi de mevcut olduğunda e-posta istemcilerinin IMAP'i POP3'e tercih etmesini sağlar. Hedefi `.` (tek nokta) olan kayıtlar, bu protokollerin düz metin (şifrelenmemiş) sürümlerinin [RFC 6186 Bölüm 3.4](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4) uyarınca kasıtlı olarak devre dışı bırakıldığını gösterir. CalDAV ve CardDAV SRV kayıtları, takvim ve kişi otomatik keşfi için [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) standardını takip eder.

#### Hangi e-posta istemcileri otomatik keşfi destekliyor? {#which-email-clients-support-autodiscovery}

| İstemci            | E-posta                                          | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | `autoconfig` CNAME veya SRV kayıtları            | `autoconfig` XML veya SRV kayıtları (RFC 6764) |
| Apple Mail (macOS) | SRV kayıtları (RFC 6186)                         | SRV kayıtları (RFC 6764)                   |
| Apple Mail (iOS)   | SRV kayıtları (RFC 6186)                         | SRV kayıtları (RFC 6764)                   |
| Microsoft Outlook  | `autodiscover` CNAME veya `_autodiscover._tcp` SRV | Desteklenmiyor                            |
| GNOME (Evolution)  | SRV kayıtları (RFC 6186)                         | SRV kayıtları (RFC 6764)                   |
| KDE (KMail)        | SRV kayıtları (RFC 6186)                         | SRV kayıtları (RFC 6764)                   |
| eM Client          | `autoconfig` veya `autodiscover`                 | SRV kayıtları (RFC 6764)                   |

> \[!TIP]
> Tüm istemcilerle en iyi uyumluluk için, **Seçenek A** (CNAME kayıtları) ile **Seçenek B**'den SRV kayıtlarının birlikte kullanılmasını öneriyoruz. Yalnızca CNAME yöntemi çoğu e-posta istemcisini kapsar. CalDAV/CardDAV SRV kayıtları ise takvim ve kişi istemcilerinin sunucu ayarlarınızı otomatik olarak keşfetmesini sağlar.


## Güvenlik {#security-1}

### Gelişmiş Sunucu Sertleştirme Teknikleri {#advanced-server-hardening-techniques}

> \[!TIP]
> Güvenlik altyapımız hakkında daha fazla bilgi için [Güvenlik sayfamızı](/security) ziyaret edin.

Forward Email, altyapımızın ve verilerinizin güvenliğini sağlamak için birçok sunucu sertleştirme tekniği uygular:

1. **Ağ Güvenliği**:
   * Katı kurallara sahip IP tabloları güvenlik duvarı
   * Brute force koruması için Fail2ban
   * Düzenli güvenlik denetimleri ve penetrasyon testleri
   * Yalnızca VPN ile yönetici erişimi

2. **Sistem Sertleştirme**:
   * Minimum paket kurulumu
   * Düzenli güvenlik güncellemeleri
   * Zorlayıcı modda SELinux
   * Root SSH erişiminin devre dışı bırakılması
   * Sadece anahtara dayalı kimlik doğrulama

3. **Uygulama Güvenliği**:
   * İçerik Güvenlik Politikası (CSP) başlıkları
   * HTTPS Strict Transport Security (HSTS)
   * XSS koruma başlıkları
   * Çerçeve seçenekleri ve referans politikası başlıkları
   * Düzenli bağımlılık denetimleri

4. **Veri Koruma**:
   * LUKS ile tam disk şifreleme
   * Güvenli anahtar yönetimi
   * Şifreli düzenli yedeklemeler
   * Veri minimizasyonu uygulamaları

5. **İzleme ve Müdahale**:
   * Gerçek zamanlı saldırı tespiti
   * Otomatik güvenlik taramaları
   * Merkezi günlük kaydı ve analiz
   * Olay müdahale prosedürleri

> \[!IMPORTANT]
> Güvenlik uygulamalarımız, ortaya çıkan tehditler ve zafiyetlere karşı sürekli güncellenmektedir.

> \[!TIP]
> Maksimum güvenlik için, hizmetimizi OpenPGP ile uçtan uca şifreleme kullanarak kullanmanızı öneririz.

### SOC 2 veya ISO 27001 sertifikalarınız var mı? {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email, sektör standartlarına uyumu sağlamak için sertifikalı alt işlemciler tarafından sağlanan altyapı üzerinde çalışır.

Forward Email doğrudan SOC 2 Tip II veya ISO 27001 sertifikalarına sahip değildir. Ancak, hizmet sertifikalı alt işlemciler tarafından sağlanan altyapı üzerinde çalışmaktadır:

* **DigitalOcean**: SOC 2 Tip II ve SOC 3 Tip II sertifikalı (Schellman & Company LLC tarafından denetlenmiş), birden fazla veri merkezinde ISO 27001 sertifikalı. Detaylar: <https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: SOC 2+ (HIPAA) sertifikalı, ISO/IEC sertifikaları: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Detaylar: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: SOC 2 uyumlu (sertifikayı almak için doğrudan DataPacket ile iletişime geçin), kurumsal düzeyde altyapı sağlayıcısı (Denver konumu). Detaylar: <https://www.datapacket.com/datacenters/denver>

Forward Email, güvenlik denetimleri için sektörün en iyi uygulamalarını takip eder ve düzenli olarak bağımsız güvenlik araştırmacılarıyla çalışır. Kaynak: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### E-posta iletimi için TLS şifrelemesi kullanıyor musunuz? {#do-you-use-tls-encryption-for-email-forwarding}

Evet. Forward Email, tüm bağlantılar (HTTPS, SMTP, IMAP, POP3) için TLS 1.2+ kullanımını kesinlikle zorunlu kılar ve geliştirilmiş TLS desteği için MTA-STS uygular. Uygulama şunları içerir:

* Tüm e-posta bağlantıları için TLS 1.2+ zorunluluğu
* Mükemmel ileri gizlilik için ECDHE (Eliptik Eğri Diffie-Hellman Ephemeral) anahtar değişimi
* Düzenli güvenlik güncellemeleriyle modern şifreleme paketleri
* Geliştirilmiş performans ve güvenlik için HTTP/2 desteği
* Büyük tarayıcılarda ön yüklemeli HSTS (HTTP Strict Transport Security)
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** ile sıkı TLS zorunluluğu

Kaynak: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STS Uygulaması**: Forward Email, kod tabanında sıkı MTA-STS zorunluluğu uygular. TLS hataları oluştuğunda ve MTA-STS zorunlu olduğunda, sistem e-postaların güvensiz şekilde teslim edilmek yerine daha sonra yeniden denenmesini sağlamak için 421 SMTP durum kodları döner. Uygulama detayları:

* TLS hata tespiti: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* send-email yardımcı programında MTA-STS zorunluluğu: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Üçüncü taraf doğrulaması: <https://www.hardenize.com/report/forwardemail.net/1750312779> tüm TLS ve taşıma güvenliği önlemleri için "İyi" derecelendirmeleri gösterir.

### E-posta kimlik doğrulama başlıklarını koruyor musunuz? {#do-you-preserve-email-authentication-headers}

Evet. Forward Email, e-posta kimlik doğrulama başlıklarını kapsamlı şekilde uygular ve korur:

* **SPF (Sender Policy Framework)**: Doğru şekilde uygulanmış ve korunmuş
* **DKIM (DomainKeys Identified Mail)**: Doğru anahtar yönetimi ile tam destek
* **DMARC**: SPF veya DKIM doğrulamasını geçemeyen e-postalar için politika uygulaması
* **ARC**: Açıkça detaylandırılmamış olsa da, hizmetin mükemmel uyum skorları kapsamlı kimlik doğrulama başlığı yönetimini gösterir

Kaynak: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Doğrulama: Internet.nl Mail Test, özellikle "SPF, DKIM ve DMARC" uygulaması için 100/100 puan gösterir. Hardenize değerlendirmesi SPF ve DMARC için "İyi" derecelendirmeleri doğrular: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Orijinal e-posta başlıklarını koruyor ve sahtekarlığı önlüyor musunuz? {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email, e-posta kötüye kullanımını önlemek için gelişmiş sahtekarlık önleme koruması uygular.

Forward Email, orijinal e-posta başlıklarını korurken MX kod tabanı aracılığıyla kapsamlı sahtekarlık önleme koruması uygular:

* **Başlık Koruma**: Orijinal kimlik doğrulama başlıkları iletim sırasında korunur
* **Sahtekarlık Önleme**: DMARC politika uygulaması, SPF veya DKIM doğrulamasını geçemeyen e-postaları reddederek başlık sahtekarlığını engeller
* **Başlık Enjeksiyonu Önleme**: striptags kütüphanesi kullanılarak giriş doğrulaması ve temizleme
* **Gelişmiş Koruma**: Sahtekarlık tespiti, taklit önleme ve kullanıcı bildirim sistemleri ile gelişmiş oltalama tespiti

**MX Uygulama Detayları**: Temel e-posta işleme mantığı MX sunucu kod tabanı tarafından yönetilir, özellikle:

* Ana MX veri işleyici: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Keyfi e-posta filtreleme (sahtekarlık önleme): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

`isArbitrary` yardımcı programı, alan taklidi, engellenmiş ifadeler ve çeşitli oltalama kalıplarının tespiti dahil olmak üzere gelişmiş sahtekarlık önleme kurallarını uygular.
### Spam ve kötüye kullanıma karşı nasıl korunuyorsunuz {#how-do-you-protect-against-spam-and-abuse}

Forward Email kapsamlı çok katmanlı koruma uygular:

* **Oran Sınırlaması**: Kimlik doğrulama denemeleri, API uç noktaları ve SMTP bağlantılarına uygulanır
* **Kaynak İzolasyonu**: Yüksek hacimli kullanıcıların etkisini önlemek için kullanıcılar arasında
* **DDoS Koruması**: DataPacket'in Shield sistemi ve Cloudflare aracılığıyla çok katmanlı koruma
* **Otomatik Ölçeklendirme**: Talebe göre dinamik kaynak ayarı
* **Kötüye Kullanım Önleme**: Kullanıcıya özel kötüye kullanım önleme kontrolleri ve kötü amaçlı içerik için hash tabanlı engelleme
* **E-posta Kimlik Doğrulama**: Gelişmiş oltalama tespiti ile SPF, DKIM, DMARC protokolleri

Kaynaklar:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (DDoS koruma detayları)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### E-posta içeriğini diskte saklıyor musunuz {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email, e-posta içeriğinin diske yazılmasını engelleyen sıfır bilgi mimarisi kullanır.

* **Sıfır Bilgi Mimarisi**: Bireysel olarak şifrelenmiş SQLite posta kutuları sayesinde Forward Email e-posta içeriğine erişemez
* **Bellek İçi İşleme**: E-posta işlemleri tamamen bellekte gerçekleşir, disk depolaması yapılmaz
* **İçerik Kaydı Yok**: "E-posta içeriği veya meta verileri diske kaydetmiyor veya loglamıyoruz"
* **Sandbox Şifreleme**: Şifreleme anahtarları asla düz metin olarak diskte saklanmaz

**MX Kod Tabanı Kanıtı**: MX sunucusu e-postaları tamamen bellekte işler, içeriği diske yazmaz. Ana e-posta işleme yöneticisi bu bellek içi yaklaşımı gösterir: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Kaynaklar:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Özet)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Sıfır bilgi detayları)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Sandbox şifreleme)

### Sistem çökmeleri sırasında e-posta içeriği açığa çıkabilir mi {#can-email-content-be-exposed-during-system-crashes}

Hayır. Forward Email, çökme kaynaklı veri açığa çıkmasına karşı kapsamlı önlemler uygular:

* **Çekirdek Dökümleri Devre Dışı**: Çökme sırasında bellek açığa çıkmasını önler
* **Swap Belleği Devre Dışı**: Swap dosyalarından hassas veri çıkarılmasını tamamen engeller
* **Bellek İçi Mimari**: E-posta içeriği işleme sırasında yalnızca geçici bellekte bulunur
* **Şifreleme Anahtarı Koruması**: Anahtarlar asla düz metin olarak diskte saklanmaz
* **Fiziksel Güvenlik**: LUKS v2 şifreli diskler fiziksel erişimi engeller
* **USB Depolama Devre Dışı**: Yetkisiz veri çıkarılmasını önler

**Sistem Sorunları için Hata Yönetimi**: Forward Email, `isCodeBug` ve `isTimeoutError` yardımcı fonksiyonlarını kullanarak, veritabanı bağlantı sorunları, DNS ağ/blok liste sorunları veya üst akış bağlantı sorunları oluşursa sistemin 421 SMTP durum kodları döndürmesini sağlar; böylece e-postalar kaybolmak veya açığa çıkmak yerine daha sonra tekrar denenir.

Uygulama detayları:

* Hata sınıflandırması: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* MX işleme sırasında zaman aşımı hatası yönetimi: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Kaynak: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### E-posta altyapınıza kimler erişebiliyor {#who-has-access-to-your-email-infrastructure}

Forward Email, minimal 2-3 kişilik mühendislik ekibi erişimi için kapsamlı erişim kontrolleri uygular ve sıkı 2FA gereksinimleri vardır:

* **Rol Tabanlı Erişim Kontrolü**: Kaynak bazlı izinlerle takım hesapları için
* **En Az Ayrıcalık İlkesi**: Tüm sistemlerde uygulanır
* **Görev Ayrımı**: Operasyonel roller arasında
* **Kullanıcı Yönetimi**: Ayrı dağıtım ve devops kullanıcıları, farklı izinlerle
* **Root Girişi Devre Dışı**: Erişim uygun şekilde kimlik doğrulanmış hesaplar üzerinden zorunlu kılınır
* **Sıkı 2FA**: MiTM saldırısı riski nedeniyle SMS tabanlı 2FA yok - sadece uygulama tabanlı veya donanım tokenları
* **Kapsamlı Denetim Kaydı**: Hassas veri gizlemeyle
* **Otomatik Anomali Tespiti**: Olağandışı erişim kalıpları için
* **Düzenli Güvenlik İncelemeleri**: Erişim kayıtları üzerinde
* **Evil Maid Saldırısı Önleme**: USB depolama devre dışı ve diğer fiziksel güvenlik önlemleri
Kaynaklar:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Yetkilendirme Kontrolleri)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Ağ Güvenliği)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Kötü Hizmetçi saldırısı önleme)

### Hangi altyapı sağlayıcılarını kullanıyorsunuz {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email, kapsamlı uyumluluk sertifikalarına sahip birden fazla altyapı alt işlemcisi kullanmaktadır.

Tam detaylar GDPR uyumluluk sayfamızda mevcuttur: <https://forwardemail.net/gdpr>

**Birincil Altyapı Alt İşlemcileri:**

| Sağlayıcı        | Veri Gizliliği Çerçevesi Sertifikalı mı | GDPR Uyumluluk Sayfası                                                                    |
| ---------------- | --------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Cloudflare**   | ✅ Evet                                 | <https://www.cloudflare.com/trust-hub/gdpr/>                                             |
| **DataPacket**   | ❌ Hayır                               | <https://www.datapacket.com/privacy-policy>                                              |
| **DigitalOcean** | ❌ Hayır                               | <https://www.digitalocean.com/legal/gdpr>                                                |
| **GitHub**       | ✅ Evet                                 | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**        | ❌ Hayır                               | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                          |

**Detaylı Sertifikalar:**

**DigitalOcean**

* SOC 2 Tip II & SOC 3 Tip II (Schellman & Company LLC tarafından denetlenmiştir)
* Birden fazla veri merkezinde ISO 27001 sertifikalı
* PCI-DSS uyumlu
* CSA STAR Seviye 1 sertifikalı
* APEC CBPR PRP sertifikalı
* Detaylar: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* SOC 2+ (HIPAA) sertifikalı
* PCI Merchant uyumlu
* CSA STAR Seviye 1 sertifikalı
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Detaylar: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* SOC 2 uyumlu (sertifika almak için doğrudan DataPacket ile iletişime geçin)
* Kurumsal düzeyde altyapı (Denver lokasyonu)
* Shield siber güvenlik yığını ile DDoS koruması
* 7/24 teknik destek
* 58 veri merkezi genelinde küresel ağ
* Detaylar: <https://www.datapacket.com/datacenters/denver>

**GitHub**

* Veri Gizliliği Çerçevesi sertifikalı (AB-ABD, İsviçre-ABD ve Birleşik Krallık Uzantısı)
* Kaynak kodu barındırma, CI/CD ve proje yönetimi
* GitHub Veri Koruma Anlaşması mevcut
* Detaylar: <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**Ödeme İşlemcileri:**

* **Stripe**: Veri Gizliliği Çerçevesi sertifikalı - <https://stripe.com/legal/privacy-center>
* **PayPal**: DPF sertifikalı değil - <https://www.paypal.com/uk/legalhub/privacy-full>

### Veri İşleme Sözleşmesi (DPA) sunuyor musunuz {#do-you-offer-a-data-processing-agreement-dpa}

Evet, Forward Email, kurumsal sözleşmemizle imzalanabilecek kapsamlı bir Veri İşleme Sözleşmesi (DPA) sunmaktadır. DPA kopyamız şurada mevcuttur: <https://forwardemail.net/dpa>

**DPA Detayları:**

* GDPR uyumluluğu ve AB-ABD/İsviçre-ABD Gizlilik Kalkanı çerçevelerini kapsar
* Hizmet Şartlarımızı kabul ettiğinizde otomatik olarak kabul edilir
* Standart DPA için ayrı imza gerekmez
* Kurumsal Lisans aracılığıyla özel DPA düzenlemeleri mevcuttur

**GDPR Uyumluluk Çerçevesi:**
DPA’mız GDPR ve uluslararası veri transferi gereksinimlerine uyumu detaylandırır. Tam bilgi şurada mevcuttur: <https://forwardemail.net/gdpr>

Özel DPA şartları veya belirli sözleşme düzenlemeleri isteyen kurumsal müşterilerimiz için bunlar **Kurumsal Lisans ($250/ay)** programımız aracılığıyla ele alınabilir.

### Veri ihlali bildirimlerini nasıl yönetiyorsunuz {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Email’in sıfır bilgi mimarisi, ihlal etkisini önemli ölçüde sınırlar.
* **Sınırlı Veri Maruziyeti**: Sıfır bilgi mimarisi nedeniyle şifrelenmiş e-posta içeriğine erişim yok
* **Minimum Veri Toplama**: Yalnızca temel abone bilgileri ve güvenlik için sınırlı IP kayıtları
* **Alt İşlemci Çerçeveleri**: DigitalOcean, GitHub ve Vultr GDPR uyumlu olay müdahale prosedürlerini sürdürür

**GDPR Temsilci Bilgileri:**
Forward Email, Madde 27 uyarınca GDPR temsilcileri atamıştır:

**AB Temsilcisi:**
Osano International Compliance Services Limited
ATTN: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**İngiltere Temsilcisi:**
Osano UK Compliance LTD
ATTN: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

Belirli ihlal bildirim SLA'larına ihtiyaç duyan kurumsal müşteriler için, bunlar bir **Kurumsal Lisans** anlaşması kapsamında görüşülmelidir.

Kaynaklar:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Test ortamı sunuyor musunuz {#do-you-offer-a-test-environment}

Forward Email'in teknik dokümantasyonu açıkça özel bir sandbox modundan bahsetmemektedir. Ancak, potansiyel test yaklaşımları şunları içerebilir:

* **Kendi Kendine Barındırma Seçeneği**: Test ortamları oluşturmak için kapsamlı kendi kendine barındırma yetenekleri
* **API Arayüzü**: Yapılandırmaların programatik olarak test edilme potansiyeli
* **Açık Kaynak**: %100 açık kaynak kod, müşterilerin yönlendirme mantığını incelemesine olanak tanır
* **Çoklu Alan Adları**: Birden fazla alan adı desteği test alanı oluşturmayı mümkün kılabilir

Resmi sandbox yeteneklerine ihtiyaç duyan kurumsal müşteriler için, bu bir **Kurumsal Lisans** düzenlemesi kapsamında görüşülmelidir.

Kaynak: <https://github.com/forwardemail/forwardemail.net> (Geliştirme ortamı detayları)

### İzleme ve uyarı araçları sağlıyor musunuz {#do-you-provide-monitoring-and-alerting-tools}

Forward Email bazı sınırlamalarla gerçek zamanlı izleme sağlar:

**Mevcut:**

* **Gerçek Zamanlı Teslimat İzleme**: Büyük e-posta sağlayıcıları için halka açık performans metrikleri
* **Otomatik Uyarı**: Teslimat süreleri 10 saniyeyi aştığında mühendislik ekibine bildirim
* **Şeffaf İzleme**: %100 açık kaynak izleme sistemleri
* **Altyapı İzleme**: Otomatik anormallik tespiti ve kapsamlı denetim kaydı

**Sınırlamalar:**

* Müşteri tarafı webhook'lar veya API tabanlı teslimat durumu bildirimleri açıkça belgelenmemiştir

Detaylı teslimat durumu webhook'ları veya özel izleme entegrasyonlarına ihtiyaç duyan kurumsal müşteriler için, bu yetenekler **Kurumsal Lisans** düzenlemeleri kapsamında sunulabilir.

Kaynaklar:

* <https://forwardemail.net> (Gerçek zamanlı izleme ekranı)
* <https://github.com/forwardemail/forwardemail.net> (İzleme uygulaması)

### Yüksek kullanılabilirliği nasıl sağlıyorsunuz {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email, birden fazla altyapı sağlayıcısı arasında kapsamlı yedeklilik uygular.

* **Dağıtılmış Altyapı**: Coğrafi bölgelerde birden fazla sağlayıcı (DigitalOcean, Vultr, DataPacket)
* **Coğrafi Yük Dengeleme**: Cloudflare tabanlı coğrafi konumlu yük dengeleme ve otomatik devreye alma
* **Otomatik Ölçeklendirme**: Talebe göre dinamik kaynak ayarlaması
* **Çok Katmanlı DDoS Koruması**: DataPacket'in Shield sistemi ve Cloudflare üzerinden
* **Sunucu Yedekliliği**: Her bölgede birden fazla sunucu ve otomatik devreye alma
* **Veritabanı Replikasyonu**: Birden fazla konumda gerçek zamanlı veri senkronizasyonu
* **İzleme ve Uyarı**: 7/24 izleme ve otomatik olay müdahalesi

**Çalışma Süresi Taahhüdü**: %99,9+ hizmet kullanılabilirliği ve şeffaf izleme <https://forwardemail.net> adresinde mevcuttur

Kaynaklar:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Ulusal Savunma Yetkilendirme Yasası (NDAA) Bölüm 889 ile uyumlu musunuz {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email, altyapı ortaklarının dikkatli seçimiyle Bölüm 889 ile tam uyumludur.

Evet, Forward Email **Bölüm 889 uyumludur**. Ulusal Savunma Yetkilendirme Yasası (NDAA) Bölüm 889, hükümet kurumlarının belirli şirketlerin (Huawei, ZTE, Hikvision, Dahua ve Hytera) telekomünikasyon ve video gözetim ekipmanlarını kullanmasını veya bu tür ekipmanları kullanan kuruluşlarla sözleşme yapmasını yasaklar.
**Forward Email'in Bölüm 889 Uyumluluğunu Nasıl Sağladığı:**

Forward Email, Bölüm 889 tarafından yasaklanan ekipmanları kullanmayan iki ana altyapı sağlayıcısına tamamen dayanır:

1. **Cloudflare**: Ağ hizmetleri ve e-posta güvenliği için birincil ortağımız
2. **DataPacket**: Sunucu altyapısı için birincil sağlayıcımız (yalnızca Arista Networks ve Cisco ekipmanları kullanmaktadır)
3. **Yedek Sağlayıcılar**: Digital Ocean ve Vultr yedek sağlayıcılarımız ayrıca yazılı olarak Bölüm 889 uyumlu oldukları teyit edilmiştir.

**Cloudflare'ın Taahhüdü**: Cloudflare, Üçüncü Taraf Davranış Kuralları'nda açıkça, Bölüm 889 tarafından yasaklanan herhangi bir telekomünikasyon ekipmanı, video gözetim ürünleri veya hizmetleri kullanmadıklarını belirtmektedir.

**Devlet Kullanım Durumu**: Bölüm 889 uyumluluğumuz, **ABD Deniz Harp Okulu** Forward Email'i güvenli e-posta yönlendirme ihtiyaçları için seçtiğinde doğrulanmış olup, federal uyumluluk standartlarımızın belgelenmesini gerektirmiştir.

Daha geniş federal düzenlemeler dahil olmak üzere devlet uyumluluk çerçevemiz hakkında tam detaylar için kapsamlı vaka çalışmamızı okuyun: [Federal Government Email Service Section 889 Compliant](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## Sistem ve Teknik Detaylar {#system-and-technical-details}

### E-postaları ve içeriklerini saklıyor musunuz? {#do-you-store-emails-and-their-contents}

Hayır, diske yazmıyoruz veya günlükleri saklamıyoruz – [hata kayıtları](#do-you-store-error-logs) ve [giden SMTP](#do-you-support-sending-email-with-smtp) istisnaları hariç (bkz. [Gizlilik Politikamız](/privacy)).

Her şey bellekte yapılır ve [kaynak kodumuz GitHub'da](https://github.com/forwardemail) mevcuttur.

### E-posta yönlendirme sisteminiz nasıl çalışır? {#how-does-your-email-forwarding-system-work}

E-posta, [SMTP protokolüne](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) dayanır. Bu protokol, bir sunucuya (çoğunlukla 25 numaralı portta çalışan) gönderilen komutlardan oluşur. İlk bağlantı kurulur, ardından gönderen e-postanın kimden olduğunu belirtir ("MAIL FROM"), sonra nereye gideceğini ("RCPT TO") ve son olarak e-postanın başlıkları ve gövdesi ("DATA") gelir. E-posta yönlendirme sistemimizin akışı, her SMTP protokol komutuna göre aşağıda açıklanmıştır:

* İlk Bağlantı (komut adı yok, örn. `telnet example.com 25`) - Bu ilk bağlantıdır. [İzin listemizde](#do-you-have-an-allowlist) olmayan gönderenleri [yasak listemize](#do-you-have-a-denylist) karşı kontrol ederiz. Son olarak, bir gönderici izin listesinde değilse, [gri listeye](#do-you-have-a-greylist) alınıp alınmadığını kontrol ederiz.

* `HELO` - Gönderenin FQDN'sini, IP adresini veya posta işleyici adını tanımlamak için bir selamlamadır. Bu değer sahte olabilir, bu yüzden bu veriye güvenmeyiz ve bunun yerine bağlantının IP adresinin ters ana bilgisayar adı sorgusunu kullanırız.

* `MAIL FROM` - E-postanın zarf üzerindeki gönderen adresini belirtir. Girilen değer geçerli bir RFC 5322 e-posta adresi olmalıdır. Boş değerler kabul edilir. Burada [geri yansıma kontrolü](#how-do-you-protect-against-backscatter) yaparız ve ayrıca MAIL FROM adresini [yasak listemize](#do-you-have-a-denylist) karşı kontrol ederiz. Son olarak, izin listesinde olmayan gönderenler için oran sınırlaması uygularız (daha fazla bilgi için [Oran Sınırlaması](#do-you-have-rate-limiting) ve [izin listesi](#do-you-have-an-allowlist) bölümlerine bakınız).

* `RCPT TO` - E-postanın alıcılarını belirtir. Bunlar geçerli RFC 5322 e-posta adresleri olmalıdır. Mesaj başına en fazla 50 zarf alıcısına izin veririz (bu, e-postadaki "To" başlığından farklıdır). Ayrıca, sahtekarlığı önlemek için geçerli bir [Gönderen Yeniden Yazma Şeması](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") adresi kontrolü yaparız.

* `DATA` - Hizmetimizin temel kısmı olup, bir e-postayı işler. Daha fazla bilgi için aşağıdaki [Bir e-postayı yönlendirmek için nasıl işliyorsunuz?](#how-do-you-process-an-email-for-forwarding) bölümüne bakınız.
### Bir e-postayı iletmek için nasıl işlersiniz {#how-do-you-process-an-email-for-forwarding}

Bu bölüm, yukarıdaki [E-posta iletme sisteminiz nasıl çalışıyor](#how-does-your-email-forwarding-system-work) bölümünde SMTP protokol komutu `DATA` ile ilgili sürecimizi açıklar – bir e-postanın başlıklarını, gövdesini, güvenliğini nasıl işlediğimizi, nereye teslim edilmesi gerektiğini nasıl belirlediğimizi ve bağlantıları nasıl yönettiğimizi anlatır.

1. Mesaj maksimum 50mb boyutunu aşarsa, 552 hata kodu ile reddedilir.

2. Mesajda bir "From" başlığı yoksa veya "From" başlığındaki herhangi bir değer geçerli RFC 5322 e-posta adresi değilse, 550 hata kodu ile reddedilir.

3. Mesajda 25'ten fazla "Received" başlığı varsa, yönlendirme döngüsünde takıldığına karar verilir ve 550 hata kodu ile reddedilir.

4. E-postanın parmak izi kullanılarak (bkz. [Parmak İzi Belirleme](#how-do-you-determine-an-email-fingerprint) bölümü), mesajın 5 günden fazla süredir tekrar denenip denenmediği kontrol edilir (bu, [varsayılan postfix davranışı](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime) ile eşleşir) ve eğer öyleyse, 550 hata kodu ile reddedilir.

5. E-postayı [Spam Scanner](https://spamscanner.net) kullanarak tarama sonuçlarını bellekte saklarız.

6. Spam Scanner'dan herhangi bir keyfi sonuç varsa, 554 hata kodu ile reddedilir. Keyfi sonuçlar şu anda yalnızca GTUBE testini içerir. Daha fazla bilgi için <https://spamassassin.apache.org/gtube/> adresine bakınız.

7. Mesajın hata ayıklama ve kötüye kullanım önleme amaçları için aşağıdaki başlıkları ekleriz:

   * `Received` - orijin IP ve ana bilgisayar, iletim türü, TLS bağlantı bilgisi, tarih/saat ve alıcı ile bu standart Received başlığını ekleriz.
   * `X-Original-To` - mesajın orijinal alıcısı:
     * Bu, bir e-postanın orijinal olarak nereye teslim edildiğini belirlemek için faydalıdır ("Received" başlığına ek olarak).
     * Bu, gizliliği korumak için IMAP ve/veya maskelenmiş iletme sırasında alıcı bazında eklenir.
   * `X-Forward-Email-Website` - <https://forwardemail.net> web sitemize bağlantı içerir.
   * `X-Forward-Email-Version` - kod tabanımızın `package.json` dosyasındaki mevcut [SemVer](https://semver.org/) sürümü.
   * `X-Forward-Email-Session-ID` - hata ayıklama amaçlı kullanılan bir oturum kimliği değeri (yalnızca üretim dışı ortamlarda geçerlidir).
   * `X-Forward-Email-Sender` - orijinal zarf MAIL FROM adresini (boş değilse), ters PTR istemci FQDN'sini (varsa) ve gönderenin IP adresini içeren virgülle ayrılmış liste.
   * `X-Forward-Email-ID` - yalnızca giden SMTP için geçerlidir ve Hesabım → E-postalar bölümünde saklanan e-posta kimliği ile ilişkilidir.
   * `X-Report-Abuse` - değeri `abuse@forwardemail.net` olan başlık.
   * `X-Report-Abuse-To` - değeri `abuse@forwardemail.net` olan başlık.
   * `X-Complaints-To` - değeri `abuse@forwardemail.net` olan başlık.

8. Daha sonra mesajı [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) ve [DMARC](https://en.wikipedia.org/wiki/DMARC) için kontrol ederiz.

   * Mesaj DMARC'ta başarısız olduysa ve alan adı reddetme politikası (örneğin `p=reject` [DMARC politikasında](https://wikipedia.org/wiki/DMARC) varsa), 550 hata kodu ile reddedilir. Genellikle bir alan adının DMARC politikası `_dmarc` alt alan adındaki <strong class="notranslate">TXT</strong> kaydında bulunur (örneğin `dig _dmarc.example.com txt`).
   * Mesaj SPF'te başarısız olduysa ve alan adının sert bir başarısızlık politikası varsa (örneğin SPF politikasında `-all` varsa, `~all` veya hiç politika yoksa değil), 550 hata kodu ile reddedilir. Genellikle bir alan adının SPF politikası kök alan adındaki <strong class="notranslate">TXT</strong> kaydında bulunur (örneğin `dig example.com txt`). SPF hakkında daha fazla bilgi için [Gmail ile mail gönderme](#can-i-send-mail-as-in-gmail-with-this) bölümüne bakınız.
9. Şimdi, yukarıdaki [E-posta yönlendirme sisteminiz nasıl çalışıyor](#how-does-your-email-forwarding-system-work) bölümünde `RCPT TO` komutundan toplanan mesaj alıcılarını işliyoruz. Her alıcı için aşağıdaki işlemleri gerçekleştiriyoruz:

   * Alan adının <strong class="notranslate">TXT</strong> kayıtlarını (örneğin, e-posta adresi `test@example.com` ise `@` sembolünden sonraki kısım olan `example.com`) sorguluyoruz. Örneğin, alan adı `example.com` ise `dig example.com txt` gibi bir DNS sorgusu yapıyoruz.
   * `forward-email=` (ücretsiz planlar) veya `forward-email-site-verification=` (ücretli planlar) ile başlayan tüm <strong class="notranslate">TXT</strong> kayıtlarını ayrıştırıyoruz. Kullanıcının plan yükseltme veya düşürme işlemi sırasında e-postaları işlemek için her ikisini de ayrıştırdığımızı unutmayın.
   * Bu ayrıştırılmış <strong class="notranslate">TXT</strong> kayıtlarından, yukarıdaki [E-posta yönlendirmeye nasıl başlarım ve kurarım](#how-do-i-get-started-and-set-up-email-forwarding) bölümünde açıklandığı gibi yönlendirme yapılandırmasını çıkarmak için üzerinde yineleme yapıyoruz. Sadece bir `forward-email-site-verification=` değeri desteklenmektedir; birden fazla sağlanırsa 550 hatası oluşur ve gönderen bu alıcı için bir bounce alır.
   * Çıkarılan yönlendirme yapılandırması üzerinde özyinelemeli olarak yineleme yaparak global yönlendirme, regex tabanlı yönlendirme ve diğer desteklenen tüm yönlendirme yapılandırmalarını belirliyoruz – bunlar artık "Yönlendirme Adreslerimiz" olarak bilinir.
   * Her Yönlendirme Adresi için bir özyinelemeli sorgulamayı destekliyoruz (bu, verilen adres üzerinde bu işlem dizisini başlatır). Özyinelemeli eşleşme bulunursa, üst sonuç Yönlendirme Adreslerinden kaldırılır ve alt adresler eklenir.
   * Yönlendirme Adresleri benzersizlik açısından ayrıştırılır (aynı adrese yinelenen gönderimler yapmak veya gereksiz SMTP istemci bağlantıları oluşturmak istemiyoruz).
   * Her Yönlendirme Adresi için, alan adını API uç noktamız `/v1/max-forwarded-addresses` ile sorguluyoruz (bir takma ad başına alanın kaç adrese e-posta yönlendirmesine izin verildiğini belirlemek için, örneğin varsayılan 10 – bkz. [takma ad başına yönlendirme sayısı sınırı var mı](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias) bölümü). Bu sınır aşılırsa, 550 hatası oluşur ve gönderen bu alıcı için bir bounce alır.
   * Orijinal alıcının ayarlarını API uç noktamız `/v1/settings` ile sorguluyoruz; bu, ücretli kullanıcılar için sorgulamayı destekler (ücretsiz kullanıcılar için yedekleme ile). Bu, `port` (Sayı, örn. `25`), `has_adult_content_protection` (Boolean), `has_phishing_protection` (Boolean), `has_executable_protection` (Boolean) ve `has_virus_protection` (Boolean) için gelişmiş ayarları içeren bir yapılandırma nesnesi döndürür.
   * Bu ayarlara dayanarak, Spam Tarayıcı sonuçlarını kontrol ediyoruz ve herhangi bir hata oluşursa, mesaj 554 hata kodu ile reddedilir (örneğin, `has_virus_protection` etkinse, Spam Tarayıcı sonuçlarını virüsler için kontrol ederiz). Tüm ücretsiz plan kullanıcıları, yetişkin içeriği, oltalama, yürütülebilir dosyalar ve virüslere karşı kontroller için varsayılan olarak dahil edilir. Ücretli plan kullanıcılarının tamamı da varsayılan olarak dahil edilir, ancak bu yapılandırma Forward Email kontrol panelindeki Alan Ayarları sayfasında değiştirilebilir).

10. İşlenen her alıcının Yönlendirme Adresleri için aşağıdaki işlemleri gerçekleştiriyoruz:

    * Adres, [reddetme listemiz](#do-you-have-a-denylist) ile kontrol edilir; listede ise 421 hata kodu oluşur (gönderenin daha sonra tekrar denemesini belirtir).
    * Adres bir webhook ise, gelecekteki işlemler için bir Boolean ayarlanır (aşağıya bakınız – teslimat için birden fazla POST isteği yerine benzer webhookları gruplayarak tek bir POST isteği yapıyoruz).
    * Adres bir e-posta adresi ise, gelecekteki işlemler için host ayrıştırılır (aşağıya bakınız – teslimat için birden fazla bireysel bağlantı yerine benzer hostları gruplayarak tek bağlantı yapıyoruz).
11. Alıcı yoksa ve geri dönen e-posta yoksa, "Invalid recipients" (Geçersiz alıcılar) hatasıyla 550 yanıtı veririz.

12. Alıcılar varsa, bunları aynı sunucuya göre gruplayarak üzerinde iterasyon yapar ve e-postaları teslim ederiz. Daha fazla bilgi için aşağıdaki [E-posta teslimat sorunlarını nasıl ele alıyorsunuz](#how-do-you-handle-email-delivery-issues) bölümüne bakınız.

    * E-postalar gönderilirken herhangi bir hata oluşursa, bunları daha sonra işlemek üzere bellekte saklarız.
    * E-posta gönderiminden kaynaklanan en düşük hata kodunu (varsa) alır ve `DATA` komutuna yanıt kodu olarak kullanırız. Bu, teslim edilmeyen e-postaların genellikle orijinal gönderici tarafından yeniden denenmesi anlamına gelir, ancak zaten teslim edilen e-postalar mesaj tekrar gönderildiğinde yeniden gönderilmez (çünkü [Parmak İzi](#how-do-you-determine-an-email-fingerprint) kullanıyoruz).
    * Hata oluşmadıysa, 250 başarılı SMTP yanıt durum kodu göndeririz.
    * Geri dönen e-posta, durum kodu >= 500 (kalıcı hatalar) olan herhangi bir teslimat denemesi olarak belirlenir.

13. Geri dönen e-posta (kalıcı hatalar) yoksa, kalıcı olmayan hatalardan en düşük hata kodu ile (veya hiç yoksa 250 başarılı durum kodu ile) SMTP yanıt durum kodu döneriz.

14. Geri dönen e-postalar varsa, tüm hata kodlarının en düşüğünü gönderen kişiye döndürdükten sonra arka planda geri dönen e-postaları göndeririz. Ancak, en düşük hata kodu >= 500 ise, geri dönen e-postaları göndermezsiniz. Çünkü bunu yaparsak, gönderenler çift geri dönen e-posta alır (örneğin, kendi çıkış MTA'larından, Gmail gibi – ve ayrıca bizden). Daha fazla bilgi için aşağıdaki [Backscatter'a karşı nasıl koruma sağlıyorsunuz](#how-do-you-protect-against-backscatter) bölümüne bakınız.

### E-posta teslimat sorunlarını nasıl ele alıyorsunuz {#how-do-you-handle-email-delivery-issues}

Gönderenin DMARC politikası geçmiyorsa VE "From" başlığıyla hizalanmış DKIM imzası yoksa, e-postalarda yalnızca bu durumda "Friendly-From" yeniden yazması yapacağımızı unutmayın. Bu, mesajdaki "From" başlığını değiştireceğimiz, "X-Original-From" ayarlayacağımız ve ayrıca "Reply-To" zaten ayarlanmamışsa onu da ayarlayacağımız anlamına gelir. Bu başlıkları değiştirdikten sonra mesajdaki ARC mührünü de yeniden mühürleriz.

Ayrıca, yığınımızın her seviyesinde hata mesajlarını akıllıca ayrıştırıyoruz – kodumuzda, DNS isteklerinde, Node.js iç yapılarında, HTTP isteklerinde (örneğin 408, 413 ve 429, alıcı bir webhook ise SMTP yanıt kodu 421 olarak eşlenir) ve posta sunucusu yanıtlarında (örneğin "defer" veya "slowdown" içeren yanıtlar 421 hatası olarak yeniden denenir).

Mantığımız aptal korumalıdır ve SSL/TLS hataları, bağlantı sorunları ve daha fazlası için de yeniden deneme yapar. Aptal koruma ile amaç, bir yönlendirme yapılandırması için tüm alıcılara teslim edilebilirliği en üst düzeye çıkarmaktır.

Alıcı bir webhook ise, isteğin tamamlanması için 60 saniyelik zaman aşımına ve 3 yeniden denemeye izin veririz (yani başarısızlık öncesi toplam 4 istek). 408, 413 ve 429 hata kodlarını doğru şekilde ayrıştırdığımızı ve bunları SMTP yanıt kodu 421'e eşlediğimizi unutmayın.

Alıcı bir e-posta adresi ise, e-postayı fırsatçı TLS ile göndermeye çalışırız (alıcı posta sunucusunda STARTTLS varsa kullanmaya çalışırız). E-posta gönderilirken bir SSL/TLS hatası oluşursa, TLS olmadan (STARTTLS kullanmadan) göndermeyi deneriz.

Herhangi bir DNS veya bağlantı hatası oluşursa, `DATA` komutuna SMTP yanıt kodu 421 döneriz, aksi takdirde >= 500 seviyesinde hatalar varsa geri dönen e-postalar gönderilir.

Teslim etmeye çalıştığımız bir e-posta sunucusunun posta değişim IP adreslerimizden bir veya daha fazlasını engellediğini tespit edersek (örneğin, spam gönderenleri ertelemek için kullandıkları teknoloji ne olursa olsun), gönderenin mesajını daha sonra yeniden denemesi için SMTP yanıt kodu 421 göndeririz (ve sorunu çözebilmek için uyarılırız).

### IP adreslerinizin engellenmesi durumunda nasıl davranıyorsunuz {#how-do-you-handle-your-ip-addresses-becoming-blocked}
Biz tüm büyük DNS engelleme listelerini rutin olarak izliyoruz ve eğer posta değişim ("MX") IP adreslerimizden herhangi biri büyük bir engelleme listesinde yer alırsa, mümkünse ilgili DNS A kaydı round robin'den çıkarıyoruz, ta ki sorun çözülene kadar.

Bu yazının yazıldığı sırada, birkaç DNS izin listesinde de yer almaktayız ve engelleme listelerini ciddiyetle takip ediyoruz. Eğer biz çözüm bulmadan önce herhangi bir sorun görürseniz, lütfen yazılı olarak <support@forwardemail.net> adresinden bize bildirin.

IP adreslerimiz herkese açıktır, [daha fazla bilgi için aşağıdaki bölüme bakınız](#what-are-your-servers-ip-addresses).

### Postmaster adresleri nedir {#what-are-postmaster-addresses}

Yanlış yönlendirilmiş geri dönen e-postaları ve tatil yanıtlayıcı mesajlarını izlenmeyen veya var olmayan posta kutularına göndermeyi önlemek için, mailer-daemon benzeri kullanıcı adlarından oluşan bir liste tutuyoruz:

* `automailer`
* `autoresponder`
* `bounce`
* `bounce-notification`
* `bounce-notifications`
* `bounces`
* `hostmaster`
* `listserv`
* `localhost`
* `mail-daemon`
* `mail.daemon`
* `maildaemon`
* `mailer-daemon`
* `mailer.daemon`
* `mailerdaemon`
* `majordomo`
* `postmaster`
* [ve herhangi bir no-reply adresi](#what-are-no-reply-addresses)

Bu tür listelerin verimli e-posta sistemleri oluşturmak için nasıl kullanıldığı hakkında daha fazla bilgi için [RFC 5320 Bölüm 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) adresine bakınız.

### No-reply adresleri nedir {#what-are-no-reply-addresses}

Aşağıdaki e-posta kullanıcı adlarından herhangi biri (büyük/küçük harf duyarsız) no-reply adresi olarak kabul edilir:

* `do-not-reply`
* `do-not-respond`
* `do.not.reply`
* `donotreply`
* `donotrespond`
* `dont-reply`
* `naoresponda`
* `no-replies`
* `no-reply`
* `no-replys`
* `no.replies`
* `no.reply`
* `no.replys`
* `no_reply`
* `nobody`
* `noreplies`
* `noreply`
* `noreplys`

Bu liste [GitHub'da açık kaynak proje olarak](https://github.com/forwardemail/reserved-email-addresses-list) tutulmaktadır.

### Sunucunuzun IP adresleri nelerdir {#what-are-your-servers-ip-addresses}

IP adreslerimizi <https://forwardemail.net/ips> adresinde yayımlıyoruz.

### İzin listeniz var mı {#do-you-have-an-allowlist}

Evet, varsayılan olarak izin verilen [alan adı uzantıları listemiz](#what-domain-name-extensions-are-allowlisted-by-default) ve [katı kriterlere](#what-is-your-allowlist-criteria) dayalı dinamik, önbelleğe alınmış ve dönen bir izin listemiz vardır.

Ücretli müşteriler tarafından kullanılan tüm alan adları, e-postalar ve IP adresleri saatlik olarak engelleme listemize karşı otomatik olarak kontrol edilir – bu da gerekirse yöneticilerin manuel müdahalesine olanak tanır.

Ayrıca, alan adlarınızdan veya e-posta adreslerinizden biri engelleme listesine alınırsa (örneğin spam, virüs gönderimi veya taklit saldırıları nedeniyle) – alan adı yöneticileri (siz) ve bizim ekip yöneticilerimiz hemen e-posta ile bilgilendirilir. Bunu önlemek için [DMARC yapılandırmanızı](#how-do-i-set-up-dmarc-for-forward-email) şiddetle tavsiye ederiz.

### Varsayılan olarak hangi alan adı uzantıları izinlidir {#what-domain-name-extensions-are-allowlisted-by-default}

Aşağıdaki alan adı uzantıları, Umbrella Popülerlik Listesinde olup olmamalarına bakılmaksızın varsayılan olarak izinli kabul edilir:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">edu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov</code></li>
  <li class="list-inline-item"><code class="notranslate">mil</code></li>
  <li class="list-inline-item"><code class="notranslate">int</code></li>
  <li class="list-inline-item"><code class="notranslate">arpa</code></li>
  <li class="list-inline-item"><code class="notranslate">dni.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fed.us</code></li>
  <li class="list-inline-item"><code class="notranslate">isa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">kids.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nsn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ak.us</code></li>
  <li class="list-inline-item"><code class="notranslate">al.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ar.us</code></li>
  <li class="list-inline-item"><code class="notranslate">as.us</code></li>
  <li class="list-inline-item"><code class="notranslate">az.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ca.us</code></li>
  <li class="list-inline-item"><code class="notranslate">co.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ct.us</code></li>
  <li class="list-inline-item"><code class="notranslate">dc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">de.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fl.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ga.us</code></li>
  <li class="list-inline-item"><code class="notranslate">gu.us</code></li>
  <li class="list-inline-item"><code class="notranslate">hi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ia.us</code></li>
  <li class="list-inline-item"><code class="notranslate">id.us</code></li>
  <li class="list-inline-item"><code class="notranslate">il.us</code></li>
  <li class="list-inline-item"><code class="notranslate">in.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ks.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ky.us</code></li>
  <li class="list-inline-item"><code class="notranslate">la.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ma.us</code></li>
  <li class="list-inline-item"><code class="notranslate">md.us</code></li>
  <li class="list-inline-item"><code class="notranslate">me.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mo.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ne.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nj.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nm.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ny.us</code></li>
  <li class="list-inline-item"><code class="notranslate">oh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ok.us</code></li>
  <li class="list-inline-item"><code class="notranslate">or.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pr.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ri.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tx.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ut.us</code></li>
  <li class="list-inline-item"><code class="notranslate">va.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wy.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.au</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.at</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.br</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">school.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">cri.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">health.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.in</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.in</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.in</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ed.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">lg.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.za</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.za</code></li>
  <li class="list-inline-item"><code class="notranslate">school.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">hs.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">es.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">kg.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.es</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.th</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.th</code></li>
  <li class="list-inline-item"><code class="notranslate">admin.ch</code></li>
  <li class="list-inline-item"><code class="notranslate">canada.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">go.id</code></li>
  <li class="list-inline-item"><code class="notranslate">go.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">go.ke</code></li>
  <li class="list-inline-item"><code class="notranslate">go.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">go.th</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.ar</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.es</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.mx</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gob.pe</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gob.ve</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.sv</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.nc</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.qc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ad</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.af</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ai</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.al</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.am</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ao</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.au</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.aw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ax</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.az</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.be</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bm</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gov.by</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.co</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cy</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.dz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.eg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fi</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ie</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.il</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.im</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.in</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.iq</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ir</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.it</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.je</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kp</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.krd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ky</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lb</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lv</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ma</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mm</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mo</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.my</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ng</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.np</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ph</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.py</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ro</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ru</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.scot</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.se</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.si</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.vn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.wales</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.za</code></li>
  <li class="list-inline-item"><code class="notranslate">government.pn</code></li>
  <li class="list-inline-item"><code class="notranslate">govt.nz</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gub.uy</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gv.at</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">bl.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">judiciary.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">mod.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">nhs.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">police.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">rct.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">royal.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>
Ayrıca bu [marka ve kurumsal üst düzey alan adları](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) varsayılan olarak izin verilenler listesine eklenmiştir (örneğin Apple Card banka ekstreleri için `applecard.apple` içindeki `apple`):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">aaa</code></li>
  <li class="list-inline-item"><code class="notranslate">aarp</code></li>
  <li class="list-inline-item"><code class="notranslate">abarth</code></li>
  <li class="list-inline-item"><code class="notranslate">abb</code></li>
  <li class="list-inline-item"><code class="notranslate">abbott</code></li>
  <li class="list-inline-item"><code class="notranslate">abbvie</code></li>
  <li class="list-inline-item"><code class="notranslate">abc</code></li>
  <li class="list-inline-item"><code class="notranslate">accenture</code></li>
  <li class="list-inline-item"><code class="notranslate">aco</code></li>
  <li class="list-inline-item"><code class="notranslate">aeg</code></li>
  <li class="list-inline-item"><code class="notranslate">aetna</code></li>
  <li class="list-inline-item"><code class="notranslate">afl</code></li>
  <li class="list-inline-item"><code class="notranslate">agakhan</code></li>
  <li class="list-inline-item"><code class="notranslate">aig</code></li>
  <li class="list-inline-item"><code class="notranslate">aigo</code></li>
  <li class="list-inline-item"><code class="notranslate">airbus</code></li>
  <li class="list-inline-item"><code class="notranslate">airtel</code></li>
  <li class="list-inline-item"><code class="notranslate">akdn</code></li>
  <li class="list-inline-item"><code class="notranslate">alfaromeo</code></li>
  <li class="list-inline-item"><code class="notranslate">alibaba</code></li>
  <li class="list-inline-item"><code class="notranslate">alipay</code></li>
  <li class="list-inline-item"><code class="notranslate">allfinanz</code></li>
  <li class="list-inline-item"><code class="notranslate">allstate</code></li>
  <li class="list-inline-item"><code class="notranslate">ally</code></li>
  <li class="list-inline-item"><code class="notranslate">alstom</code></li>
  <li class="list-inline-item"><code class="notranslate">amazon</code></li>
  <li class="list-inline-item"><code class="notranslate">americanexpress</code></li>
  <li class="list-inline-item"><code class="notranslate">amex</code></li>
  <li class="list-inline-item"><code class="notranslate">amica</code></li>
  <li class="list-inline-item"><code class="notranslate">android</code></li>
  <li class="list-inline-item"><code class="notranslate">anz</code></li>
  <li class="list-inline-item"><code class="notranslate">aol</code></li>
  <li class="list-inline-item"><code class="notranslate">apple</code></li>
  <li class="list-inline-item"><code class="notranslate">aquarelle</code></li>
  <li class="list-inline-item"><code class="notranslate">aramco</code></li>
  <li class="list-inline-item"><code class="notranslate">audi</code></li>
  <li class="list-inline-item"><code class="notranslate">auspost</code></li>
  <li class="list-inline-item"><code class="notranslate">aws</code></li>
  <li class="list-inline-item"><code class="notranslate">axa</code></li>
  <li class="list-inline-item"><code class="notranslate">azure</code></li>
  <li class="list-inline-item"><code class="notranslate">baidu</code></li>
  <li class="list-inline-item"><code class="notranslate">bananarepublic</code></li>
  <li class="list-inline-item"><code class="notranslate">barclaycard</code></li>
  <li class="list-inline-item"><code class="notranslate">barclays</code></li>
  <li class="list-inline-item"><code class="notranslate">basketball</code></li>
  <li class="list-inline-item"><code class="notranslate">bauhaus</code></li>
  <li class="list-inline-item"><code class="notranslate">bbc</code></li>
  <li class="list-inline-item"><code class="notranslate">bbt</code></li>
  <li class="list-inline-item"><code class="notranslate">bbva</code></li>
  <li class="list-inline-item"><code class="notranslate">bcg</code></li>
  <li class="list-inline-item"><code class="notranslate">bentley</code></li>
  <li class="list-inline-item"><code class="notranslate">bharti</code></li>
  <li class="list-inline-item"><code class="notranslate">bing</code></li>
  <li class="list-inline-item"><code class="notranslate">blanco</code></li>
  <li class="list-inline-item"><code class="notranslate">bloomberg</code></li>
  <li class="list-inline-item"><code class="notranslate">bms</code></li>
  <li class="list-inline-item"><code class="notranslate">bmw</code></li>
  <li class="list-inline-item"><code class="notranslate">bnl</code></li>
  <li class="list-inline-item"><code class="notranslate">bnpparibas</code></li>
  <li class="list-inline-item"><code class="notranslate">boehringer</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">bond</code></li>-->
  <li class="list-inline-item"><code class="notranslate">booking</code></li>
  <li class="list-inline-item"><code class="notranslate">bosch</code></li>
  <li class="list-inline-item"><code class="notranslate">bostik</code></li>
  <li class="list-inline-item"><code class="notranslate">bradesco</code></li>
  <li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
  <li class="list-inline-item"><code class="notranslate">brother</code></li>
  <li class="list-inline-item"><code class="notranslate">bugatti</code></li>
  <li class="list-inline-item"><code class="notranslate">cal</code></li>
  <li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
  <li class="list-inline-item"><code class="notranslate">canon</code></li>
  <li class="list-inline-item"><code class="notranslate">capitalone</code></li>
  <li class="list-inline-item"><code class="notranslate">caravan</code></li>
  <li class="list-inline-item"><code class="notranslate">cartier</code></li>
  <li class="list-inline-item"><code class="notranslate">cba</code></li>
  <li class="list-inline-item"><code class="notranslate">cbn</code></li>
  <li class="list-inline-item"><code class="notranslate">cbre</code></li>
  <li class="list-inline-item"><code class="notranslate">cbs</code></li>
  <li class="list-inline-item"><code class="notranslate">cern</code></li>
  <li class="list-inline-item"><code class="notranslate">cfa</code></li>
  <li class="list-inline-item"><code class="notranslate">chanel</code></li>
  <li class="list-inline-item"><code class="notranslate">chase</code></li>
  <li class="list-inline-item"><code class="notranslate">chintai</code></li>
  <li class="list-inline-item"><code class="notranslate">chrome</code></li>
  <li class="list-inline-item"><code class="notranslate">chrysler</code></li>
  <li class="list-inline-item"><code class="notranslate">cipriani</code></li>
  <li class="list-inline-item"><code class="notranslate">cisco</code></li>
  <li class="list-inline-item"><code class="notranslate">citadel</code></li>
  <li class="list-inline-item"><code class="notranslate">citi</code></li>
  <li class="list-inline-item"><code class="notranslate">citic</code></li>
  <li class="list-inline-item"><code class="notranslate">clubmed</code></li>
  <li class="list-inline-item"><code class="notranslate">comcast</code></li>
  <li class="list-inline-item"><code class="notranslate">commbank</code></li>
  <li class="list-inline-item"><code class="notranslate">creditunion</code></li>
  <li class="list-inline-item"><code class="notranslate">crown</code></li>
  <li class="list-inline-item"><code class="notranslate">crs</code></li>
  <li class="list-inline-item"><code class="notranslate">csc</code></li>
  <li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
  <li class="list-inline-item"><code class="notranslate">dabur</code></li>
  <li class="list-inline-item"><code class="notranslate">datsun</code></li>
  <li class="list-inline-item"><code class="notranslate">dealer</code></li>
  <li class="list-inline-item"><code class="notranslate">dell</code></li>
  <li class="list-inline-item"><code class="notranslate">deloitte</code></li>
  <li class="list-inline-item"><code class="notranslate">delta</code></li>
  <li class="list-inline-item"><code class="notranslate">dhl</code></li>
  <li class="list-inline-item"><code class="notranslate">discover</code></li>
  <li class="list-inline-item"><code class="notranslate">dish</code></li>
  <li class="list-inline-item"><code class="notranslate">dnp</code></li>
  <li class="list-inline-item"><code class="notranslate">dodge</code></li>
  <li class="list-inline-item"><code class="notranslate">dunlop</code></li>
  <li class="list-inline-item"><code class="notranslate">dupont</code></li>
  <li class="list-inline-item"><code class="notranslate">dvag</code></li>
  <li class="list-inline-item"><code class="notranslate">edeka</code></li>
  <li class="list-inline-item"><code class="notranslate">emerck</code></li>
  <li class="list-inline-item"><code class="notranslate">epson</code></li>
  <li class="list-inline-item"><code class="notranslate">ericsson</code></li>
  <li class="list-inline-item"><code class="notranslate">erni</code></li>
  <li class="list-inline-item"><code class="notranslate">esurance</code></li>
  <li class="list-inline-item"><code class="notranslate">etisalat</code></li>
  <li class="list-inline-item"><code class="notranslate">eurovision</code></li>
  <li class="list-inline-item"><code class="notranslate">everbank</code></li>
  <li class="list-inline-item"><code class="notranslate">extraspace</code></li>
  <li class="list-inline-item"><code class="notranslate">fage</code></li>
  <li class="list-inline-item"><code class="notranslate">fairwinds</code></li>
  <li class="list-inline-item"><code class="notranslate">farmers</code></li>
  <li class="list-inline-item"><code class="notranslate">fedex</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrari</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrero</code></li>
  <li class="list-inline-item"><code class="notranslate">fiat</code></li>
  <li class="list-inline-item"><code class="notranslate">fidelity</code></li>
  <li class="list-inline-item"><code class="notranslate">firestone</code></li>
  <li class="list-inline-item"><code class="notranslate">firmdale</code></li>
  <li class="list-inline-item"><code class="notranslate">flickr</code></li>
  <li class="list-inline-item"><code class="notranslate">flir</code></li>
  <li class="list-inline-item"><code class="notranslate">flsmidth</code></li>
  <li class="list-inline-item"><code class="notranslate">ford</code></li>
  <li class="list-inline-item"><code class="notranslate">fox</code></li>
  <li class="list-inline-item"><code class="notranslate">fresenius</code></li>
  <li class="list-inline-item"><code class="notranslate">forex</code></li>
  <li class="list-inline-item"><code class="notranslate">frogans</code></li>
  <li class="list-inline-item"><code class="notranslate">frontier</code></li>
  <li class="list-inline-item"><code class="notranslate">fujitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">fujixerox</code></li>
  <li class="list-inline-item"><code class="notranslate">gallo</code></li>
  <li class="list-inline-item"><code class="notranslate">gallup</code></li>
  <li class="list-inline-item"><code class="notranslate">gap</code></li>
  <li class="list-inline-item"><code class="notranslate">gbiz</code></li>
  <li class="list-inline-item"><code class="notranslate">gea</code></li>
  <li class="list-inline-item"><code class="notranslate">genting</code></li>
  <li class="list-inline-item"><code class="notranslate">giving</code></li>
  <li class="list-inline-item"><code class="notranslate">gle</code></li>
  <li class="list-inline-item"><code class="notranslate">globo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmail</code></li>
  <li class="list-inline-item"><code class="notranslate">gmo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmx</code></li>
  <li class="list-inline-item"><code class="notranslate">godaddy</code></li>
  <li class="list-inline-item"><code class="notranslate">goldpoint</code></li>
  <li class="list-inline-item"><code class="notranslate">goodyear</code></li>
  <li class="list-inline-item"><code class="notranslate">goog</code></li>
  <li class="list-inline-item"><code class="notranslate">google</code></li>
  <li class="list-inline-item"><code class="notranslate">grainger</code></li>
  <li class="list-inline-item"><code class="notranslate">guardian</code></li>
  <li class="list-inline-item"><code class="notranslate">gucci</code></li>
  <li class="list-inline-item"><code class="notranslate">hbo</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfc</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfcbank</code></li>
  <li class="list-inline-item"><code class="notranslate">hermes</code></li>
  <li class="list-inline-item"><code class="notranslate">hisamitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">hitachi</code></li>
  <li class="list-inline-item"><code class="notranslate">hkt</code></li>
  <li class="list-inline-item"><code class="notranslate">honda</code></li>
  <li class="list-inline-item"><code class="notranslate">honeywell</code></li>
  <li class="list-inline-item"><code class="notranslate">hotmail</code></li>
  <li class="list-inline-item"><code class="notranslate">hsbc</code></li>
  <li class="list-inline-item"><code class="notranslate">hughes</code></li>
  <li class="list-inline-item"><code class="notranslate">hyatt</code></li>
  <li class="list-inline-item"><code class="notranslate">hyundai</code></li>
  <li class="list-inline-item"><code class="notranslate">ibm</code></li>
  <li class="list-inline-item"><code class="notranslate">ieee</code></li>
  <li class="list-inline-item"><code class="notranslate">ifm</code></li>
  <li class="list-inline-item"><code class="notranslate">ikano</code></li>
  <li class="list-inline-item"><code class="notranslate">imdb</code></li>
  <li class="list-inline-item"><code class="notranslate">infiniti</code></li>
  <li class="list-inline-item"><code class="notranslate">intel</code></li>
  <li class="list-inline-item"><code class="notranslate">intuit</code></li>
  <li class="list-inline-item"><code class="notranslate">ipiranga</code></li>
  <li class="list-inline-item"><code class="notranslate">iselect</code></li>
  <li class="list-inline-item"><code class="notranslate">itau</code></li>
  <li class="list-inline-item"><code class="notranslate">itv</code></li>
  <li class="list-inline-item"><code class="notranslate">iveco</code></li>
  <li class="list-inline-item"><code class="notranslate">jaguar</code></li>
  <li class="list-inline-item"><code class="notranslate">java</code></li>
  <li class="list-inline-item"><code class="notranslate">jcb</code></li>
  <li class="list-inline-item"><code class="notranslate">jcp</code></li>
  <li class="list-inline-item"><code class="notranslate">jeep</code></li>
  <li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
  <li class="list-inline-item"><code class="notranslate">juniper</code></li>
  <li class="list-inline-item"><code class="notranslate">kddi</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryhotels</code></li>
  <li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryproperties</code></li>
  <li class="list-inline-item"><code class="notranslate">kfh</code></li>
  <li class="list-inline-item"><code class="notranslate">kia</code></li>
  <li class="list-inline-item"><code class="notranslate">kinder</code></li>
  <li class="list-inline-item"><code class="notranslate">kindle</code></li>
  <li class="list-inline-item"><code class="notranslate">komatsu</code></li>
  <li class="list-inline-item"><code class="notranslate">kpmg</code></li>
  <li class="list-inline-item"><code class="notranslate">kred</code></li>
  <li class="list-inline-item"><code class="notranslate">kuokgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">lacaixa</code></li>
  <li class="list-inline-item"><code class="notranslate">ladbrokes</code></li>
  <li class="list-inline-item"><code class="notranslate">lamborghini</code></li>
  <li class="list-inline-item"><code class="notranslate">lancaster</code></li>
  <li class="list-inline-item"><code class="notranslate">lancia</code></li>
  <li class="list-inline-item"><code class="notranslate">lancome</code></li>
  <li class="list-inline-item"><code class="notranslate">landrover</code></li>
  <li class="list-inline-item"><code class="notranslate">lanxess</code></li>
  <li class="list-inline-item"><code class="notranslate">lasalle</code></li>
  <li class="list-inline-item"><code class="notranslate">latrobe</code></li>
  <li class="list-inline-item"><code class="notranslate">lds</code></li>
  <li class="list-inline-item"><code class="notranslate">leclerc</code></li>
  <li class="list-inline-item"><code class="notranslate">lego</code></li>
  <li class="list-inline-item"><code class="notranslate">liaison</code></li>
  <li class="list-inline-item"><code class="notranslate">lexus</code></li>
  <li class="list-inline-item"><code class="notranslate">lidl</code></li>
  <li class="list-inline-item"><code class="notranslate">lifestyle</code></li>
  <li class="list-inline-item"><code class="notranslate">lilly</code></li>
  <li class="list-inline-item"><code class="notranslate">lincoln</code></li>
  <li class="list-inline-item"><code class="notranslate">linde</code></li>
  <li class="list-inline-item"><code class="notranslate">lipsy</code></li>
  <li class="list-inline-item"><code class="notranslate">lixil</code></li>
  <li class="list-inline-item"><code class="notranslate">locus</code></li>
  <li class="list-inline-item"><code class="notranslate">lotte</code></li>
  <li class="list-inline-item"><code class="notranslate">lpl</code></li>
  <li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
  <li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
  <li class="list-inline-item"><code class="notranslate">lupin</code></li>
  <li class="list-inline-item"><code class="notranslate">macys</code></li>
  <li class="list-inline-item"><code class="notranslate">maif</code></li>
  <li class="list-inline-item"><code class="notranslate">man</code></li>
  <li class="list-inline-item"><code class="notranslate">mango</code></li>
  <li class="list-inline-item"><code class="notranslate">marriott</code></li>
  <li class="list-inline-item"><code class="notranslate">maserati</code></li>
  <li class="list-inline-item"><code class="notranslate">mattel</code></li>
  <li class="list-inline-item"><code class="notranslate">mckinsey</code></li>
  <li class="list-inline-item"><code class="notranslate">metlife</code></li>
  <li class="list-inline-item"><code class="notranslate">microsoft</code></li>
  <li class="list-inline-item"><code class="notranslate">mini</code></li>
  <li class="list-inline-item"><code class="notranslate">mit</code></li>
  <li class="list-inline-item"><code class="notranslate">mitsubishi</code></li>
  <li class="list-inline-item"><code class="notranslate">mlb</code></li>
  <li class="list-inline-item"><code class="notranslate">mma</code></li>
  <li class="list-inline-item"><code class="notranslate">monash</code></li>
  <li class="list-inline-item"><code class="notranslate">mormon</code></li>
  <li class="list-inline-item"><code class="notranslate">moto</code></li>
  <li class="list-inline-item"><code class="notranslate">movistar</code></li>
  <li class="list-inline-item"><code class="notranslate">msd</code></li>
  <li class="list-inline-item"><code class="notranslate">mtn</code></li>
  <li class="list-inline-item"><code class="notranslate">mtr</code></li>
  <li class="list-inline-item"><code class="notranslate">mutual</code></li>
  <li class="list-inline-item"><code class="notranslate">nadex</code></li>
  <li class="list-inline-item"><code class="notranslate">nationwide</code></li>
  <li class="list-inline-item"><code class="notranslate">natura</code></li>
  <li class="list-inline-item"><code class="notranslate">nba</code></li>
  <li class="list-inline-item"><code class="notranslate">nec</code></li>
  <li class="list-inline-item"><code class="notranslate">netflix</code></li>
  <li class="list-inline-item"><code class="notranslate">neustar</code></li>
  <li class="list-inline-item"><code class="notranslate">newholland</code></li>
  <li class="list-inline-item"><code class="notranslate">nfl</code></li>
  <li class="list-inline-item"><code class="notranslate">nhk</code></li>
  <li class="list-inline-item"><code class="notranslate">nico</code></li>
  <li class="list-inline-item"><code class="notranslate">nike</code></li>
  <li class="list-inline-item"><code class="notranslate">nikon</code></li>
  <li class="list-inline-item"><code class="notranslate">nissan</code></li>
  <li class="list-inline-item"><code class="notranslate">nissay</code></li>
  <li class="list-inline-item"><code class="notranslate">nokia</code></li>
  <li class="list-inline-item"><code class="notranslate">northwesternmutual</code></li>
  <li class="list-inline-item"><code class="notranslate">norton</code></li>
  <li class="list-inline-item"><code class="notranslate">nra</code></li>
  <li class="list-inline-item"><code class="notranslate">ntt</code></li>
  <li class="list-inline-item"><code class="notranslate">obi</code></li>
  <li class="list-inline-item"><code class="notranslate">office</code></li>
  <li class="list-inline-item"><code class="notranslate">omega</code></li>
  <li class="list-inline-item"><code class="notranslate">oracle</code></li>
  <li class="list-inline-item"><code class="notranslate">orange</code></li>
  <li class="list-inline-item"><code class="notranslate">otsuka</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
  <li class="list-inline-item"><code class="notranslate">panasonic</code></li>
  <li class="list-inline-item"><code class="notranslate">pccw</code></li>
  <li class="list-inline-item"><code class="notranslate">pfizer</code></li>
  <li class="list-inline-item"><code class="notranslate">philips</code></li>
  <li class="list-inline-item"><code class="notranslate">piaget</code></li>
  <li class="list-inline-item"><code class="notranslate">pictet</code></li>
  <li class="list-inline-item"><code class="notranslate">ping</code></li>
  <li class="list-inline-item"><code class="notranslate">pioneer</code></li>
  <li class="list-inline-item"><code class="notranslate">play</code></li>
  <li class="list-inline-item"><code class="notranslate">playstation</code></li>
  <li class="list-inline-item"><code class="notranslate">pohl</code></li>
  <li class="list-inline-item"><code class="notranslate">politie</code></li>
  <li class="list-inline-item"><code class="notranslate">praxi</code></li>
  <li class="list-inline-item"><code class="notranslate">prod</code></li>
  <li class="list-inline-item"><code class="notranslate">progressive</code></li>
  <li class="list-inline-item"><code class="notranslate">pru</code></li>
  <li class="list-inline-item"><code class="notranslate">prudential</code></li>
  <li class="list-inline-item"><code class="notranslate">pwc</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">quest</code></li>-->
  <li class="list-inline-item"><code class="notranslate">qvc</code></li>
  <li class="list-inline-item"><code class="notranslate">redstone</code></li>
  <li class="list-inline-item"><code class="notranslate">reliance</code></li>
  <li class="list-inline-item"><code class="notranslate">rexroth</code></li>
  <li class="list-inline-item"><code class="notranslate">ricoh</code></li>
  <li class="list-inline-item"><code class="notranslate">rmit</code></li>
  <li class="list-inline-item"><code class="notranslate">rocher</code></li>
  <li class="list-inline-item"><code class="notranslate">rogers</code></li>
  <li class="list-inline-item"><code class="notranslate">rwe</code></li>
  <li class="list-inline-item"><code class="notranslate">safety</code></li>
  <li class="list-inline-item"><code class="notranslate">sakura</code></li>
  <li class="list-inline-item"><code class="notranslate">samsung</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvik</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li>
  <li class="list-inline-item"><code class="notranslate">sanofi</code></li>
  <li class="list-inline-item"><code class="notranslate">sap</code></li>
  <li class="list-inline-item"><code class="notranslate">saxo</code></li>
  <li class="list-inline-item"><code class="notranslate">sbi</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>-->
  <li class="list-inline-item"><code class="notranslate">sca</code></li>
  <li class="list-inline-item"><code class="notranslate">scb</code></li>
  <li class="list-inline-item"><code class="notranslate">schaeffler</code></li>
  <li class="list-inline-item"><code class="notranslate">schmidt</code></li>
  <li class="list-inline-item"><code class="notranslate">schwarz</code></li>
  <li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
  <li class="list-inline-item"><code class="notranslate">scor</code></li>
  <li class="list-inline-item"><code class="notranslate">seat</code></li>
  <li class="list-inline-item"><code class="notranslate">sener</code></li>
  <li class="list-inline-item"><code class="notranslate">ses</code></li>
  <li class="list-inline-item"><code class="notranslate">sew</code></li>
  <li class="list-inline-item"><code class="notranslate">seven</code></li>
  <li class="list-inline-item"><code class="notranslate">sfr</code></li>
  <li class="list-inline-item"><code class="notranslate">seek</code></li>
  <li class="list-inline-item"><code class="notranslate">shangrila</code></li>
  <li class="list-inline-item"><code class="notranslate">sharp</code></li>
  <li class="list-inline-item"><code class="notranslate">shaw</code></li>
  <li class="list-inline-item"><code class="notranslate">shell</code></li>
  <li class="list-inline-item"><code class="notranslate">shriram</code></li>
  <li class="list-inline-item"><code class="notranslate">sina</code></li>
  <li class="list-inline-item"><code class="notranslate">sky</code></li>
  <li class="list-inline-item"><code class="notranslate">skype</code></li>
  <li class="list-inline-item"><code class="notranslate">smart</code></li>
  <li class="list-inline-item"><code class="notranslate">sncf</code></li>
  <li class="list-inline-item"><code class="notranslate">softbank</code></li>
  <li class="list-inline-item"><code class="notranslate">sohu</code></li>
  <li class="list-inline-item"><code class="notranslate">sony</code></li>
  <li class="list-inline-item"><code class="notranslate">spiegel</code></li>
  <li class="list-inline-item"><code class="notranslate">stada</code></li>
  <li class="list-inline-item"><code class="notranslate">staples</code></li>
  <li class="list-inline-item"><code class="notranslate">star</code></li>
  <li class="list-inline-item"><code class="notranslate">starhub</code></li>
  <li class="list-inline-item"><code class="notranslate">statebank</code></li>
  <li class="list-inline-item"><code class="notranslate">statefarm</code></li>
  <li class="list-inline-item"><code class="notranslate">statoil</code></li>
  <li class="list-inline-item"><code class="notranslate">stc</code></li>
  <li class="list-inline-item"><code class="notranslate">stcgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">suzuki</code></li>
  <li class="list-inline-item"><code class="notranslate">swatch</code></li>
  <li class="list-inline-item"><code class="notranslate">swiftcover</code></li>
  <li class="list-inline-item"><code class="notranslate">symantec</code></li>
  <li class="list-inline-item"><code class="notranslate">taobao</code></li>
  <li class="list-inline-item"><code class="notranslate">target</code></li>
  <li class="list-inline-item"><code class="notranslate">tatamotors</code></li>
  <li class="list-inline-item"><code class="notranslate">tdk</code></li>
  <li class="list-inline-item"><code class="notranslate">telecity</code></li>
  <li class="list-inline-item"><code class="notranslate">telefonica</code></li>
  <li class="list-inline-item"><code class="notranslate">temasek</code></li>
  <li class="list-inline-item"><code class="notranslate">teva</code></li>
  <li class="list-inline-item"><code class="notranslate">tiffany</code></li>
  <li class="list-inline-item"><code class="notranslate">tjx</code></li>
  <li class="list-inline-item"><code class="notranslate">toray</code></li>
  <li class="list-inline-item"><code class="notranslate">toshiba</code></li>
  <li class="list-inline-item"><code class="notranslate">total</code></li>
  <li class="list-inline-item"><code class="notranslate">toyota</code></li>
  <li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">travelers</code></li>
  <li class="list-inline-item"><code class="notranslate">tui</code></li>
  <li class="list-inline-item"><code class="notranslate">tvs</code></li>
  <li class="list-inline-item"><code class="notranslate">ubs</code></li>
  <li class="list-inline-item"><code class="notranslate">unicom</code></li>
  <li class="list-inline-item"><code class="notranslate">uol</code></li>
  <li class="list-inline-item"><code class="notranslate">ups</code></li>
  <li class="list-inline-item"><code class="notranslate">vanguard</code></li>
  <li class="list-inline-item"><code class="notranslate">verisign</code></li>
  <li class="list-inline-item"><code class="notranslate">vig</code></li>
  <li class="list-inline-item"><code class="notranslate">viking</code></li>
  <li class="list-inline-item"><code class="notranslate">virgin</code></li>
  <li class="list-inline-item"><code class="notranslate">visa</code></li>
  <li class="list-inline-item"><code class="notranslate">vista</code></li>
  <li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
  <li class="list-inline-item"><code class="notranslate">vivo</code></li>
  <li class="list-inline-item"><code class="notranslate">volkswagen</code></li>
  <li class="list-inline-item"><code class="notranslate">volvo</code></li>
  <li class="list-inline-item"><code class="notranslate">walmart</code></li>
  <li class="list-inline-item"><code class="notranslate">walter</code></li>
  <li class="list-inline-item"><code class="notranslate">weatherchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">weber</code></li>
  <li class="list-inline-item"><code class="notranslate">weir</code></li>
  <li class="list-inline-item"><code class="notranslate">williamhill</code></li>
  <li class="list-inline-item"><code class="notranslate">windows</code></li>
  <li class="list-inline-item"><code class="notranslate">wme</code></li>
  <li class="list-inline-item"><code class="notranslate">wolterskluwer</code></li>
  <li class="list-inline-item"><code class="notranslate">woodside</code></li>
  <li class="list-inline-item"><code class="notranslate">wtc</code></li>
  <li class="list-inline-item"><code class="notranslate">xbox</code></li>
  <li class="list-inline-item"><code class="notranslate">xerox</code></li>
  <li class="list-inline-item"><code class="notranslate">xfinity</code></li>
  <li class="list-inline-item"><code class="notranslate">yahoo</code></li>
  <li class="list-inline-item"><code class="notranslate">yamaxun</code></li>
  <li class="list-inline-item"><code class="notranslate">yandex</code></li>
  <li class="list-inline-item"><code class="notranslate">yodobashi</code></li>
  <li class="list-inline-item"><code class="notranslate">youtube</code></li>
  <li class="list-inline-item"><code class="notranslate">zappos</code></li>
  <li class="list-inline-item"><code class="notranslate">zara</code></li>
  <li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>
18 Mart 2025 itibarıyla, bu listeye şu Fransız denizaşırı topraklarını da ekledik ([bu GitHub talebine göre](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

8 Temmuz 2025 itibarıyla, şu Avrupa'ya özgü ülkeleri ekledik:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

Ekim 2025'te talep üzerine <code class="notranslate">cz</code> (Çekya) da eklendi.

Yüksek spam etkinliği nedeniyle özellikle `ru` ve `ua` dahil edilmedi.

### İzin verilenler listenizin kriterleri nelerdir {#what-is-your-allowlist-criteria}

Statik bir [varsayılan olarak izin verilen alan adı uzantıları listemiz](#what-domain-name-extensions-are-allowlisted-by-default) var – ayrıca aşağıdaki sıkı kriterlere dayalı dinamik, önbelleğe alınmış, sürekli güncellenen bir izin verilenler listesi tutuyoruz:

* Gönderen kök alan adı, [ücretsiz planımızda sunduğumuz alan adı uzantıları listesiyle eşleşen](#what-domain-name-extensions-can-be-used-for-free) bir alan adı uzantısına sahip olmalıdır (ek olarak `biz` ve `info` dahil). Ayrıca `edu`, `gov` ve `mil` kısmi eşleşmelerini de içeriyoruz, örneğin `xyz.gov.au` ve `xyz.edu.au`.
* Gönderen kök alan adı, [Umbrella Popülerlik Listesi](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL")'den elde edilen en iyi 100.000 benzersiz kök alan adı arasında olmalıdır.
* Gönderen kök alan adı, UPL'nin son 7 gününde en az 4 gününde görünen benzersiz kök alan adları arasında en iyi 50.000 sonuç içinde olmalıdır (~%50+).
* Gönderen kök alan adı, Cloudflare tarafından [yetişkin içeriği veya kötü amaçlı yazılım olarak kategorize edilmemiş](https://radar.cloudflare.com/categorization-feedback/) olmalıdır.
* Gönderen kök alan adı, A veya MX kayıtlarından en az birine sahip olmalıdır.
* Gönderen kök alan adı, A kaydı(ları), MX kaydı(ları), `p=reject` veya `p=quarantine` içeren bir DMARC kaydı ya da `-all` veya `~all` niteleyicili bir SPF kaydına sahip olmalıdır.

Bu kriterler karşılanırsa, gönderen kök alan adı 7 gün boyunca önbelleğe alınır. Otomatik işimiz günlük çalıştığı için bu sürekli güncellenen bir izin verilenler önbelleğidir.

Otomatik işimiz, önceki 7 günün UPL'lerini belleğe indirir, açar ve yukarıdaki sıkı kriterlere göre bellekte ayrıştırır.

Bu yazının yazıldığı sırada Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify ve daha fazlası gibi popüler alan adları elbette dahil edilmiştir.
Eğer izin verilen listemizde olmayan bir göndericiyseniz, FQDN kök alan adınız veya IP adresiniz ilk kez bir e-posta gönderdiğinde, [rate limited](#do-you-have-rate-limiting) ve [greylisted](#do-you-have-a-greylist) olacaksınız. Bunun standart bir uygulama olduğunu ve bir e-posta standardı olarak benimsendiğini unutmayın. Çoğu e-posta sunucusu istemcisi, bir rate limit veya greylist hatası (örneğin 421 veya 4xx seviyesinde hata durum kodu) aldığında yeniden denemeye çalışacaktır.

**`a@gmail.com`, `b@xyz.edu` ve `c@gov.au` gibi belirli göndericilerin hala [denylisted](#do-you-have-a-denylist) olabileceğini unutmayın** (örneğin, bu göndericilerden otomatik olarak spam, kimlik avı veya kötü amaçlı yazılım tespit edilirse).

### Hangi alan adı uzantıları ücretsiz kullanılabilir {#what-domain-name-extensions-can-be-used-for-free}

31 Mart 2023 itibarıyla kullanıcılarımızı ve hizmetimizi korumak için yeni bir genel spam kuralı uygulamaya koyduk.

Bu yeni kural, ücretsiz planımızda yalnızca aşağıdaki alan adı uzantılarının kullanılmasına izin verir:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ac</code></li>
  <li class="list-inline-item"><code class="notranslate">ad</code></li>
  <li class="list-inline-item"><code class="notranslate">ag</code></li>
  <li class="list-inline-item"><code class="notranslate">ai</code></li>
  <li class="list-inline-item"><code class="notranslate">al</code></li>
  <li class="list-inline-item"><code class="notranslate">am</code></li>
  <li class="list-inline-item"><code class="notranslate">app</code></li>
  <li class="list-inline-item"><code class="notranslate">as</code></li>
  <li class="list-inline-item"><code class="notranslate">at</code></li>
  <li class="list-inline-item"><code class="notranslate">au</code></li>
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">ba</code></li>
  <li class="list-inline-item"><code class="notranslate">be</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">br</code></li>
  <li class="list-inline-item"><code class="notranslate">by</code></li>
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">ca</code></li>
  <li class="list-inline-item"><code class="notranslate">cat</code></li>
  <li class="list-inline-item"><code class="notranslate">cc</code></li>
  <li class="list-inline-item"><code class="notranslate">cd</code></li>
  <li class="list-inline-item"><code class="notranslate">ch</code></li>
  <li class="list-inline-item"><code class="notranslate">ck</code></li>
  <li class="list-inline-item"><code class="notranslate">co</code></li>
  <li class="list-inline-item"><code class="notranslate">com</code></li>
  <li class="list-inline-item"><code class="notranslate">de</code></li>
  <li class="list-inline-item"><code class="notranslate">dev</code></li>
  <li class="list-inline-item"><code class="notranslate">dj</code></li>
  <li class="list-inline-item"><code class="notranslate">dk</code></li>
  <li class="list-inline-item"><code class="notranslate">ee</code></li>
  <li class="list-inline-item"><code class="notranslate">es</code></li>
  <li class="list-inline-item"><code class="notranslate">eu</code></li>
  <li class="list-inline-item"><code class="notranslate">family</code></li>
  <li class="list-inline-item"><code class="notranslate">fi</code></li>
  <li class="list-inline-item"><code class="notranslate">fm</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gl</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">id</code></li>
  <li class="list-inline-item"><code class="notranslate">ie</code></li>
  <li class="list-inline-item"><code class="notranslate">il</code></li>
  <li class="list-inline-item"><code class="notranslate">im</code></li>
  <li class="list-inline-item"><code class="notranslate">in</code></li>
  <li class="list-inline-item"><code class="notranslate">io</code></li>
  <li class="list-inline-item"><code class="notranslate">ir</code></li>
  <li class="list-inline-item"><code class="notranslate">is</code></li>
  <li class="list-inline-item"><code class="notranslate">it</code></li>
  <li class="list-inline-item"><code class="notranslate">je</code></li>
  <li class="list-inline-item"><code class="notranslate">jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ke</code></li>
  <li class="list-inline-item"><code class="notranslate">kr</code></li>
  <li class="list-inline-item"><code class="notranslate">la</code></li>
  <li class="list-inline-item"><code class="notranslate">li</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">lv</code></li>
  <li class="list-inline-item"><code class="notranslate">ly</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">md</code></li>
  <li class="list-inline-item"><code class="notranslate">me</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mn</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">ms</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">mu</code></li>
  <li class="list-inline-item"><code class="notranslate">mx</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">net</code></li>
  <li class="list-inline-item"><code class="notranslate">ni</code></li>
  <li class="list-inline-item"><code class="notranslate">nl</code></li>
  <li class="list-inline-item"><code class="notranslate">no</code></li>
  <li class="list-inline-item"><code class="notranslate">nu</code></li>
  <li class="list-inline-item"><code class="notranslate">nz</code></li>
  <li class="list-inline-item"><code class="notranslate">org</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pl</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">pr</code></li>
  <li class="list-inline-item"><code class="notranslate">pt</code></li>
  <li class="list-inline-item"><code class="notranslate">pw</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">rs</code></li>
  <li class="list-inline-item"><code class="notranslate">sc</code></li>
  <li class="list-inline-item"><code class="notranslate">se</code></li>
  <li class="list-inline-item"><code class="notranslate">sh</code></li>
  <li class="list-inline-item"><code class="notranslate">si</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">sm</code></li>
  <li class="list-inline-item"><code class="notranslate">sr</code></li>
  <li class="list-inline-item"><code class="notranslate">st</code></li>
  <li class="list-inline-item"><code class="notranslate">tc</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">tm</code></li>
  <li class="list-inline-item"><code class="notranslate">to</code></li>
  <li class="list-inline-item"><code class="notranslate">tv</code></li>
  <li class="list-inline-item"><code class="notranslate">uk</code></li>
  <li class="list-inline-item"><code class="notranslate">us</code></li>
  <li class="list-inline-item"><code class="notranslate">uz</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
  <li class="list-inline-item"><code class="notranslate">vc</code></li>
  <li class="list-inline-item"><code class="notranslate">vg</code></li>
  <li class="list-inline-item"><code class="notranslate">vu</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">ws</code></li>
  <li class="list-inline-item"><code class="notranslate">xyz</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
  <li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>
### Bir gri listeye sahip misiniz? {#do-you-have-a-greylist}

Evet, çok gevşek bir [e-posta gri listeleme](https://en.wikipedia.org/wiki/Greylisting_\(email\)) politikamız var. Gri listeleme yalnızca izin verilenler listemizde olmayan göndericiler için geçerlidir ve önbelleğimizde 30 gün boyunca saklanır.

Yeni bir gönderici için, Redis veritabanımızda ilk isteğin geliş zamanını değer olarak ayarlayarak 30 gün boyunca bir anahtar saklarız. Ardından, e-postalarını 450 yeniden deneme durum kodu ile reddederiz ve yalnızca 5 dakika geçtikten sonra geçmelerine izin veririz.

Gönderici, bu ilk geliş zamanından itibaren 5 dakika başarıyla beklediyse, e-postaları kabul edilir ve 450 durum kodunu almazlar.

Anahtar, ya FQDN kök alan adı ya da göndericinin IP adresinden oluşur. Bu, gri listeden geçen herhangi bir alt alan adının kök alan adı için de geçerli olacağı ve bunun tersi anlamına gelir (bu, "çok gevşek" politika dememizin sebebidir).

Örneğin, bir e-posta `test.example.com` adresinden gelirse ve biz daha önce `example.com` adresinden bir e-posta görmemişsek, `test.example.com` ve/veya `example.com` adreslerinden gelen herhangi bir e-posta bağlantının ilk geliş zamanından itibaren 5 dakika beklemek zorunda kalır. `test.example.com` ve `example.com` için ayrı ayrı 5 dakikalık bekleme süreleri uygulamayız (gri listeleme politikamız kök alan adı düzeyinde geçerlidir).

Gri listelemenin, [izin verilenler listemizde](#do-you-have-an-allowlist) bulunan herhangi bir göndericiye uygulanmadığını unutmayın (örneğin, bu yazının yazıldığı tarihte Meta, Amazon, Netflix, Google, Microsoft).

### Bir engelleme listesine sahip misiniz? {#do-you-have-a-denylist}

Evet, kendi engelleme listemizi işletiyoruz ve bunu spam ve kötü amaçlı etkinlik tespitine dayanarak gerçek zamanlı ve manuel olarak güncelliyoruz.

Ayrıca, her saat başı <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> adresinden UCEPROTECT Seviye 1 engelleme listesindeki tüm IP adreslerini çekiyor ve bunları 7 günlük süreyle engelleme listemize ekliyoruz.

Engelleme listesinde bulunan göndericiler, [izin verilenler listesinde değillerse](#do-you-have-an-allowlist) 421 hata kodu alırlar (göndericiye daha sonra tekrar denemesi gerektiğini bildirir).

421 durum kodu kullanarak 554 durum kodu yerine, potansiyel yanlış pozitifler gerçek zamanlı olarak hafifletilebilir ve mesaj sonraki denemede başarıyla teslim edilebilir.

**Bu, diğer posta servislerinden farklı olarak tasarlanmıştır**, çünkü engelleme listesine alındığınızda sert ve kalıcı bir hata oluşmaz. Göndericilerden mesajları tekrar denemelerini istemek (özellikle büyük organizasyonlardan) genellikle zordur, bu nedenle bu yaklaşım ilk e-posta denemesinden itibaren yaklaşık 5 gün süre tanır; bu süre içinde gönderici, alıcı veya biz müdahale edip sorunu çözebiliriz (engelleme listesinden kaldırma talebi yaparak).

Tüm engelleme listesi kaldırma talepleri, yöneticiler tarafından gerçek zamanlı olarak izlenir (örneğin, tekrarlayan yanlış pozitiflerin kalıcı olarak izin verilenler listesine alınması için).

Engelleme listesi kaldırma talepleri <https://forwardemail.net/denylist> adresinden yapılabilir. Ücretli kullanıcıların kaldırma talepleri anında işlenirken, ücretsiz kullanıcıların talepleri yöneticiler tarafından işlenmek üzere bekletilir.

Spam veya virüs içeriği gönderen göndericiler aşağıdaki yaklaşımla engelleme listesine eklenir:

1. Spam veya "güvenilir" bir göndericiden (örneğin `gmail.com`, `microsoft.com`, `apple.com`) engelleme listesi tespiti yapıldığında, [ilk mesaj parmak izi](#how-do-you-determine-an-email-fingerprint) gri listeye alınır.
   * Gönderici izin verilenler listesinde ise, mesaj 1 saat boyunca gri listede kalır.
   * Gönderici izin verilenler listesinde değilse, mesaj 6 saat boyunca gri listede kalır.
2. Gönderici ve mesajdan alınan bilgilerle engelleme listesi anahtarları ayrıştırılır ve her anahtar için (varsa zaten yoksa oluşturulur) bir sayaç oluşturulur, 1 artırılır ve 24 saat boyunca önbelleğe alınır.
   * İzin verilen göndericiler için:
     * SPF geçen veya SPF olmayan ve [postmaster kullanıcı adı](#what-are-postmaster-addresses) veya [no-reply kullanıcı adı](#what-are-no-reply-addresses) olmayan zarf "MAIL FROM" e-posta adresi için bir anahtar eklenir.
     * "From" başlığı izin verilenler listesinde ise, SPF geçen veya DKIM geçen ve hizalanmış "From" başlığı e-posta adresi için bir anahtar eklenir.
     * "From" başlığı izin verilenler listesinde değilse, "From" başlığı e-posta adresi ve kök ayrıştırılmış alan adı için bir anahtar eklenir.
   * İzin verilmeyen göndericiler için:
     * SPF geçen zarf "MAIL FROM" e-posta adresi için bir anahtar eklenir.
     * "From" başlığı izin verilenler listesinde ise, SPF geçen veya DKIM geçen ve hizalanmış "From" başlığı e-posta adresi için bir anahtar eklenir.
     * "From" başlığı izin verilenler listesinde değilse, "From" başlığı e-posta adresi ve kök ayrıştırılmış alan adı için bir anahtar eklenir.
     * Göndericinin uzak IP adresi için bir anahtar eklenir.
     * Göndericinin IP adresinden ters DNS sorgusuyla çözümlenen istemci ana bilgisayar adı için bir anahtar eklenir (varsa).
     * İstemci ana bilgisayar adının kök alan adı için bir anahtar eklenir (varsa ve istemci ana bilgisayar adından farklıysa).
3. İzin verilmeyen gönderici ve anahtar için sayaç 5'e ulaşırsa, anahtar 30 gün boyunca engelleme listesine alınır ve bir e-posta kötüye kullanım ekibimize gönderilir. Bu sayılar değişebilir ve izledikçe burada güncellenecektir.
4. İzin verilen gönderici ve anahtar için sayaç 10'a ulaşırsa, anahtar 7 gün boyunca engelleme listesine alınır ve bir e-posta kötüye kullanım ekibimize gönderilir. Bu sayılar değişebilir ve izledikçe burada güncellenecektir.
> **NOT:** Yakın gelecekte itibar izleme özelliğini tanıtacağız. İtibar izleme, yukarıda belirtilen basit bir sayacın aksine, bir göndereni kara listeye alma zamanını bir yüzde eşiğine göre hesaplayacaktır.

### Oran sınırlamanız var mı {#do-you-have-rate-limiting}

Gönderen oran sınırlaması, gönderenin IP adresi üzerinde ters PTR sorgulamasıyla ayrıştırılan kök alan adına göre yapılır – ya da bu sonuç vermezse, doğrudan gönderenin IP adresi kullanılır. Aşağıda buna `Gönderen` olarak atıfta bulunuyoruz.

MX sunucularımız, [şifreli IMAP depolama](/blog/docs/best-quantum-safe-encrypted-email-service) için alınan gelen postalar için günlük limitlere sahiptir:

* Gelen postaları bireysel takma ad bazında (örneğin `you@yourdomain.com`) oran sınırlamak yerine – takma adın alan adı bazında (örneğin `yourdomain.com`) oran sınırlaması yapıyoruz. Bu, `Gönderen`lerin tüm alanınızdaki tüm takma adların gelen kutularını aynı anda doldurmasını engeller.
* Alıcıdan bağımsız olarak hizmetimizdeki tüm `Gönderen`lere uygulanan genel limitlerimiz vardır:
  * Gerçek kaynağı olarak "güvenilir" kabul ettiğimiz `Gönderen`ler (örneğin `gmail.com`, `microsoft.com`, `apple.com`) günlük 100 GB gönderimle sınırlıdır.
  * [İzin verilenler listesinde](#do-you-have-an-allowlist) olan `Gönderen`ler günlük 10 GB gönderimle sınırlıdır.
  * Diğer tüm `Gönderen`ler günlük 1 GB ve/veya 1000 mesajla sınırlıdır.
* Her `Gönderen` ve `yourdomain.com` için özel bir limit vardır: günlük 1 GB ve/veya 1000 mesaj.

MX sunucuları ayrıca, bir veya daha fazla alıcıya iletilen mesajları oran sınırlaması yoluyla sınırlar – ancak bu sadece [izin verilenler listesinde](#do-you-have-an-allowlist) olmayan `Gönderen`lere uygulanır:

* Saatte en fazla 100 bağlantıya izin veriyoruz, her `Gönderen`in çözümlenen FQDN kök alan adı (veya) `Gönderen`in uzak IP adresi (ters PTR yoksa) ve her zarf alıcısı için. Oran sınırlaması anahtarını Redis veritabanımızda kriptografik bir hash olarak saklıyoruz.

* Sistemimiz üzerinden e-posta gönderiyorsanız, tüm IP adresleriniz için ters PTR ayarladığınızdan emin olun (aksi takdirde gönderdiğiniz her benzersiz FQDN kök alan adı veya IP adresi oran sınırlamasına tabi tutulacaktır).

* Amazon SES gibi popüler bir sistem üzerinden gönderim yapıyorsanız, oran sınırlamasına tabi tutulmazsınız çünkü (bu yazının yazıldığı tarihte) Amazon SES izin verilenler listemizde yer almaktadır.

* `test.abc.123.example.com` gibi bir alan adından gönderiyorsanız, oran sınırlaması `example.com` üzerinde uygulanacaktır. Birçok spam gönderici, yalnızca benzersiz FQDN kök alan adlarını değil, benzersiz ana bilgisayar adlarını oran sınırlayan yaygın spam filtrelerini aşmak için yüzlerce alt alan adı kullanır.

* Oran sınırını aşan `Gönderen`ler 421 hatası ile reddedilecektir.

IMAP ve SMTP sunucularımız, takma adlarınızın aynı anda `60`'tan fazla eşzamanlı bağlantıya sahip olmasını sınırlar.

MX sunucularımız, [izin verilmeyen](#do-you-have-an-allowlist) gönderenlerin 10'dan fazla eşzamanlı bağlantı kurmasını engeller (sayaç için 3 dakikalık önbellek süresi vardır, bu da 3 dakikalık soket zaman aşımımızla aynıdır).

### Backscatter'a karşı nasıl koruma sağlıyorsunuz {#how-do-you-protect-against-backscatter}

Yanlış yönlendirilmiş geri dönenler veya geri dönen spam (bilinen adıyla "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))"), gönderen IP adreslerinin itibarına zarar verebilir.

Backscatter'a karşı koruma sağlamak için iki adım atıyoruz; bunlar aşağıdaki bölümlerde detaylandırılmıştır: [Bilinen MAIL FROM spam göndericilerinden geri dönenleri önleyin](#prevent-bounces-from-known-mail-from-spammers) ve [Backscatter'a karşı koruma için gereksiz geri dönenleri önleyin](#prevent-unnecessary-bounces-to-protect-against-backscatter).

### Bilinen MAIL FROM spam göndericilerinden geri dönenleri önleyin {#prevent-bounces-from-known-mail-from-spammers}

Listeyi her saat başı <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> adresinden [Backscatter.org](https://www.backscatterer.org/) (güç kaynağı [UCEPROTECT](https://www.uceprotect.net/)) sitesinden çekiyoruz ve Redis veritabanımıza aktarıyoruz (ayrıca önceden karşılaştırma yapıyoruz; onurlandırılması gereken IP'lerin kaldırılıp kaldırılmadığını kontrol etmek için).
Eğer MAIL FROM boşsa VEYA (büyük/küçük harf duyarsız) herhangi bir [postmaster adresi](#what-are-postmaster-addresses) (bir e-postadaki @ işaretinden önceki kısım) ile eşitse, gönderici IP adresinin bu listeden biriyle eşleşip eşleşmediğine bakarız.

Göndericinin IP adresi listede yer alıyorsa (ve bizim [izinli listemizde](#do-you-have-an-allowlist) değilse), `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}` mesajıyla birlikte 554 hatası göndeririz. Göndericinin hem Backscatterer listesinde hem de izinli listemizde olması durumunda uyarılırız, böylece gerekirse sorunu çözebiliriz.

Bu bölümde açıklanan teknikler, <https://www.backscatterer.org/?target=usage> adresindeki "GÜVENLİ MOD" önerisine uygundur – burada yalnızca belirli koşullar sağlandığında gönderici IP'si kontrol edilir.

### Gereksiz geri dönen e-postaları önleyerek backscatter koruması {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Geri dönen e-postalar, e-posta iletiminin alıcıya tamamen başarısız olduğunu ve e-postanın tekrar gönderilmeyeceğini gösteren mesajlardır.

Backscatterer listesine alınmanın yaygın bir nedeni yanlış yönlendirilmiş geri dönüşler veya geri dönüş spamidir, bu yüzden bunu birkaç şekilde korumamız gerekir:

1. Yalnızca >= 500 durum kodu hataları oluştuğunda gönderim yaparız (örneğin, iletilmeye çalışılan e-postalar başarısız olduğunda, Gmail 500 seviyesinde hata döner).

2. Yalnızca bir kez göndeririz (hesaplanmış bir geri dönüş parmak izi anahtarı kullanır ve çoğaltmaları önlemek için önbellekte saklarız). Geri dönüş parmak izi, mesajın parmak izi ile geri dönüş adresi ve hata kodunun karmasının birleşiminden oluşan bir anahtardır. Mesaj parmak izinin nasıl hesaplandığı hakkında daha fazla bilgi için [Parmak İzleme](#how-do-you-determine-an-email-fingerprint) bölümüne bakınız. Başarıyla gönderilen geri dönüş parmak izleri Redis önbelleğimizde 7 gün sonra süresi dolar.

3. Yalnızca MAIL FROM ve/veya From boş değilse ve (büyük/küçük harf duyarsız) bir [postmaster kullanıcı adı](#what-are-postmaster-addresses) (bir e-postadaki @ işaretinden önceki kısım) içermiyorsa göndeririz.

4. Orijinal mesaj aşağıdaki başlıklardan herhangi birine sahipse gönderim yapmayız (büyük/küçük harf duyarsız):

   * Değeri `no` olmayan `auto-submitted` başlığı.
   * Değeri `dr`, `autoreply`, `auto-reply`, `auto_reply` veya `all` olan `x-auto-response-suppress` başlığı.
   * Değeri ne olursa olsun `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` veya `x-auto-respond` başlıkları.
   * Değeri `bulk`, `autoreply`, `auto-reply`, `auto_reply` veya `list` olan `precedence` başlığı.

5. MAIL FROM veya From e-posta adresi `+donotreply`, `-donotreply`, `+noreply` veya `-noreply` ile bitiyorsa gönderim yapmayız.

6. From e-posta adresinin kullanıcı adı `mdaemon` ise ve büyük/küçük harf duyarsız `X-MDDSN-Message` başlığı varsa gönderim yapmayız.

7. Büyük/küçük harf duyarsız `content-type` başlığı `multipart/report` ise gönderim yapmayız.

### Bir e-postanın parmak izi nasıl belirlenir {#how-do-you-determine-an-email-fingerprint}

Bir e-postanın parmak izi, e-postanın benzersizliğini belirlemek ve [gereksiz geri dönüşlerin](#prevent-unnecessary-bounces-to-protect-against-backscatter) gönderilmesini önlemek için kullanılır.

Parmak izi aşağıdaki listeden hesaplanır:

* İstemcinin çözümlenen FQDN ana bilgisayar adı veya IP adresi
* `Message-ID` başlık değeri (varsa)
* `Date` başlık değeri (varsa)
* `From` başlık değeri (varsa)
* `To` başlık değeri (varsa)
* `Cc` başlık değeri (varsa)
* `Subject` başlık değeri (varsa)
* `Body` değeri (varsa)

### E-postaları 25 dışındaki portlara iletebilir miyim (örneğin ISS'im 25 portunu engellediyse) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Evet, 5 Mayıs 2020 itibarıyla bu özelliği ekledik. Şu anda bu özellik alan adı bazlıdır, takma ad bazlı değildir. Takma ad bazlı olmasını istiyorsanız, ihtiyaçlarınızı bize bildirmeniz için lütfen bizimle iletişime geçin.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Gelişmiş Gizlilik Koruması:
  </strong>
  <span>
    Eğer ücretli bir plandaysanız (gelişmiş gizlilik koruması özellikli), lütfen <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> sayfasına gidin, alan adınızın yanındaki "Kurulum" seçeneğine tıklayın ve ardından "Ayarlar" seçeneğine tıklayın. Ücretli planlar hakkında daha fazla bilgi almak isterseniz <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Fiyatlandırma</a> sayfamıza bakabilirsiniz. Aksi takdirde aşağıdaki talimatları izlemeye devam edebilirsiniz.
  </span>
</div>
Eğer ücretsiz plandaysanız, aşağıda gösterildiği gibi yeni bir DNS <strong class="notranslate">TXT</strong> kaydı ekleyin, ancak portu 25'ten istediğiniz porta değiştirin.

Örneğin, `example.com` adresine giden tüm e-postaların alias alıcıların SMTP portu 1337'ye yönlendirilmesini istiyorsam:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ad/Sunucu/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email-port=1337</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    İpucu:
  </strong>
    Özel port yönlendirme kurulumu için en yaygın senaryo, example.com adresine giden tüm e-postaları SMTP standardı olan 25 numaralı port dışında example.com'daki farklı bir porta yönlendirmek istediğiniz zamandır. Bunu ayarlamak için, aşağıdaki <strong class="notranslate">TXT</strong> catch-all kaydını eklemeniz yeterlidir.
  <span>
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ad/Sunucu/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=example.com</code></td>
    </tr>
  </tbody>
</table>

### Gmail aliasları için artı + sembolünü destekliyor mu? {#does-it-support-the-plus--symbol-for-gmail-aliases}

Evet, kesinlikle.

### Alt alan adlarını destekliyor mu? {#does-it-support-sub-domains}

Evet, kesinlikle. Ad/sunucu/alias olarak "@", ".", veya boş kullanmak yerine, alt alan adı adını değer olarak kullanırsınız.

Eğer `foo.example.com` adresine giden e-postaları yönlendirmek istiyorsanız, DNS ayarlarınızda (hem MX hem de <strong class="notranslate">TXT</strong> kayıtları için) ad/sunucu/alias değeri olarak `foo` girin.

### Bu, e-postamın başlıklarını yönlendiriyor mu? {#does-this-forward-my-emails-headers}

Evet, kesinlikle.

### Bu iyi test edildi mi? {#is-this-well-tested}

Evet, [ava](https://github.com/avajs/ava) ile yazılmış testleri var ve ayrıca kod kapsamı mevcut.

### SMTP yanıt mesajlarını ve kodlarını iletiyor musunuz? {#do-you-pass-along-smtp-response-messages-and-codes}

Evet, kesinlikle. Örneğin, `hello@example.com` adresine bir e-posta gönderiyorsanız ve bu adres `user@gmail.com`'a yönlendirilmişse, "gmail.com" SMTP sunucusundan gelen SMTP yanıt mesajı ve kodu, "mx1.forwardemail.net" veya "mx2.forwardemail.net" proxy sunucusu yerine döndürülür.

### Spam gönderenleri nasıl engelliyorsunuz ve iyi bir e-posta yönlendirme itibarı nasıl sağlıyorsunuz? {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Yukarıdaki [E-posta yönlendirme sisteminiz nasıl çalışıyor](#how-does-your-email-forwarding-system-work), [E-posta teslim sorunlarını nasıl ele alıyorsunuz](#how-do-you-handle-email-delivery-issues) ve [IP adreslerinizin engellenmesini nasıl yönetiyorsunuz](#how-do-you-handle-your-ip-addresses-becoming-blocked) bölümlerimize bakınız.

### Alan adlarında DNS sorgularını nasıl yapıyorsunuz? {#how-do-you-perform-dns-lookups-on-domain-names}

Açık kaynaklı bir yazılım projesi olan :tangerine: [Tangerine](https://github.com/forwardemail/tangerine)'ı oluşturduk ve DNS sorguları için kullanıyoruz. Varsayılan DNS sunucuları `1.1.1.1` ve `1.0.0.1`'dir ve DNS sorguları uygulama katmanında [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") üzerinden yapılır.

:tangerine: [Tangerine](https://github.com/tangerine), varsayılan olarak [CloudFlare'ın gizlilik odaklı tüketici DNS servisini][cloudflare-dns] kullanır.


## Hesap ve Faturalandırma {#account-and-billing}

### Ücretli planlarda para iade garantisi sunuyor musunuz? {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Evet! Planınız ilk başladığı tarihten itibaren 30 gün içinde yükseltme, düşürme veya iptal işlemi yaparsanız otomatik geri ödeme gerçekleşir. Bu sadece ilk kez müşteriler için geçerlidir.
### Plan değiştirirsem farkı orantılar ve iade eder misiniz {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Plan değiştirirken farkı orantılamıyor veya iade etmiyoruz. Bunun yerine mevcut planınızın bitiş tarihinden kalan süreyi yeni planınız için en yakın göreceli süreye dönüştürüyoruz (ay bazında aşağı yuvarlanır).

Ücretli planlar arasında ilk ücretli planınızı başlattıktan sonraki 30 gün içinde yükseltme veya düşürme yaparsanız, mevcut planınızın tam tutarını otomatik olarak iade edeceğimizi unutmayın.

### Bu e-posta yönlendirme hizmetini sadece "yedek" veya "fallover" MX sunucusu olarak kullanabilir miyim {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Hayır, önerilmez, çünkü aynı anda yalnızca bir posta değişim sunucusu kullanabilirsiniz. Yedekler genellikle öncelik yanlış yapılandırmaları ve posta sunucularının MX değişim öncelik kontrolüne uymaması nedeniyle hiç yeniden denenmez.

### Belirli takma adları devre dışı bırakabilir miyim {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Ücretli bir plandaysanız, <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar <i class="fa fa-angle-right"></i> Takma Adı Düzenle <i class="fa fa-angle-right"></i> "Aktif" onay kutusunun işaretini kaldır <i class="fa fa-angle-right"></i> Devam etmeniz gerekir.
  </span>
</div>

Evet, DNS <strong class="notranslate">TXT</strong> kaydınızı düzenleyip takma adın önüne bir, iki veya üç ünlem işareti koymanız yeterlidir (aşağıya bakınız).

":" eşlemesini korumalısınız, çünkü bu, kapatmaya karar verirseniz gereklidir (ve ayrıca ücretli planlarımıza yükseltirseniz içe aktarma için kullanılır).

**Sessiz reddetme için (göndericiye mesaj başarıyla gönderilmiş gibi görünür, ancak aslında hiçbir yere gitmez) (durum kodu `250`):** Bir takma adın önüne "!" (tek ünlem işareti) koyarsanız, bu adrese göndermeye çalışan göndericilere `250` başarılı durum kodu döner, ancak e-postalar hiçbir yere gitmez (örneğin bir kara delik veya `/dev/null`).

**Yumuşak reddetme için (durum kodu `421`):** Bir takma adın önüne "!!" (çift ünlem işareti) koyarsanız, bu adrese göndermeye çalışan göndericilere `421` yumuşak hata durum kodu döner ve e-postalar genellikle reddedilmeden ve geri dönmeden önce 5 güne kadar yeniden denenir.

**Sert reddetme için (durum kodu `550`):** Bir takma adın önüne "!!!" (üçlü ünlem işareti) koyarsanız, bu adrese göndermeye çalışan göndericilere kalıcı hata durum kodu `550` döner ve e-postalar reddedilir ve geri döner.

Örneğin, `alias@example.com` adresine giden tüm e-postaların `user@gmail.com` adresine yönlendirilmesini durdurmak ve reddedilip geri dönmesini istiyorsam (örneğin üç ünlem işareti kullanarak):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ad/Sunucu/Takma Ad</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    İpucu:
  </strong>
  <span>
    Yönlendirilen alıcının adresini basitçe "nobody@forwardemail.net" olarak da yeniden yazabilirsiniz, bu da aşağıdaki örnekte olduğu gibi onu kimseye yönlendirir.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ad/Sunucu/Takma Ad</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    İpucu:
  </strong>
  <span>
    Daha fazla güvenlik istiyorsanız, aşağıdaki örnekte olduğu gibi sadece "!!!alias" bırakarak ":user@gmail.com" (veya ":nobody@forwardemail.net") kısmını da kaldırabilirsiniz.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>İsim/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias</code></td>
    </tr>
  </tbody>
</table>

### E-postaları birden fazla alıcıya yönlendirebilir miyim? {#can-i-forward-emails-to-multiple-recipients}

Evet, kesinlikle. <strong class="notranslate">TXT</strong> kayıtlarınızda birden fazla alıcı belirtebilirsiniz.

Örneğin, `hello@example.com` adresine giden bir e-postanın `user+a@gmail.com` ve `user+b@gmail.com` adreslerine yönlendirilmesini istiyorsam, <strong class="notranslate">TXT</strong> kaydım şu şekilde olur:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>İsim/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Ya da, bunları iki ayrı satırda belirtebilirsiniz, şöyle:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>İsim/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Tercih size kalmış!

### Birden fazla global catch-all alıcım olabilir mi? {#can-i-have-multiple-global-catch-all-recipients}

Evet, olabilir. <strong class="notranslate">TXT</strong> kayıtlarınızda birden fazla global catch-all alıcısı belirtebilirsiniz.

Örneğin, `*@example.com` adresine giden her e-postanın (yıldız işareti wildcard yani catch-all anlamına gelir) `user+a@gmail.com` ve `user+b@gmail.com` adreslerine yönlendirilmesini istiyorsam, <strong class="notranslate">TXT</strong> kaydım şu şekilde olur:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>İsim/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Ya da, bunları iki ayrı satırda belirtebilirsiniz, şöyle:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>İsim/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tür</th>
      <th>Cevap/Değer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@, ".", veya boş</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>
Karar sizin!

### Her takma ad için iletebileceğim e-posta adresi sayısında maksimum bir sınır var mı? {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Evet, varsayılan sınır 10'dur. Bu, alan adınızda yalnızca 10 takma adınız olabileceği anlamına gelmez. İstediğiniz kadar takma ada sahip olabilirsiniz (sınırsız sayıda). Bu, bir takma adın yalnızca 10 benzersiz e-posta adresine yönlendirilebileceği anlamına gelir. Örneğin `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (1-10 arası) olabilir – ve `hello@example.com` adresine gelen tüm e-postalar `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (1-10 arası) adreslerine iletilir.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    İpucu:
  </strong>
  <span>
    Her takma ada 10'dan fazla alıcı mı gerekiyor? Bize bir e-posta gönderin, hesabınızın sınırını artırmaktan memnuniyet duyarız.
  </span>
</div>

### E-postaları özyinelemeli olarak iletebilir miyim? {#can-i-recursively-forward-emails}

Evet, iletebilirsiniz, ancak yine de maksimum sınıra uymanız gerekir. Eğer `hello:linus@example.com` ve `linus:user@gmail.com` varsa, `hello@example.com` adresine gelen e-postalar `linus@example.com` ve `user@gmail.com` adreslerine iletilir. Maksimum sınırı aşan özyinelemeli iletim denemelerinde hata oluşacağını unutmayın.

### İnsanlar iznim olmadan e-posta iletimimi kaydını silebilir veya kaydedebilir mi? {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

MX ve <strong class="notranslate">TXT</strong> kayıt doğrulaması kullanıyoruz, bu nedenle bu servisin ilgili MX ve <strong class="notranslate">TXT</strong> kayıtlarını eklerseniz kayıtlı olursunuz. Kayıtları kaldırırsanız kaydınız silinir. Alan adınızın ve DNS yönetiminizin sahibi sizsiniz, dolayısıyla birisi buna erişim sağlıyorsa bu bir sorundur.

### Bu nasıl ücretsiz? {#how-is-it-free}

Forward Email, açık kaynak geliştirme, verimli altyapı ve hizmeti destekleyen isteğe bağlı ücretli planların birleşimiyle ücretsiz bir katman sunar.

Ücretsiz katmanımız şu şekilde desteklenir:

1. **Açık Kaynak Geliştirme**: Kod tabanımız açık kaynaklıdır, topluluk katkılarına ve şeffaf çalışmaya olanak tanır.

2. **Verimli Altyapı**: E-posta iletimini minimum kaynak kullanımıyla gerçekleştirecek şekilde sistemlerimizi optimize ettik.

3. **Ücretli Premium Planlar**: SMTP gönderimi, IMAP alımı veya gelişmiş gizlilik seçenekleri gibi ek özelliklere ihtiyaç duyan kullanıcılar ücretli planlara abone olur.

4. **Mak reasonable Kullanım Sınırları**: Ücretsiz katmanda kötüye kullanımı önlemek için adil kullanım politikaları vardır.

> \[!NOTE]
> Temel e-posta iletimini ücretsiz tutmaya kararlıyız, ancak daha gelişmiş ihtiyaçları olan kullanıcılar için premium özellikler sunuyoruz.

> \[!TIP]
> Hizmetimizi değerli buluyorsanız, devam eden geliştirme ve bakım için destek olmak amacıyla ücretli plana yükseltmeyi düşünebilirsiniz.

### Maksimum e-posta boyutu sınırı nedir? {#what-is-the-max-email-size-limit}

Varsayılan olarak 50MB boyut sınırı uygulanır; bu içerik, başlıklar ve ekleri kapsar. Gmail ve Outlook gibi servislerin yalnızca 25MB boyut sınırı olduğunu unutmayın; bu sağlayıcılara gönderirken sınırı aşarsanız hata mesajı alırsınız.

Dosya boyutu sınırı aşılırsa uygun yanıt koduyla hata döndürülür.

### E-postaların günlüklerini saklıyor musunuz? {#do-you-store-logs-of-emails}

Hayır, diske yazmıyor veya günlükleri saklamıyoruz – [hatalar](#do-you-store-error-logs) ve [giden SMTP](#do-you-support-sending-email-with-smtp) (bkz. [Gizlilik Politikamız](/privacy)) hariç.

Her şey bellekte yapılır ve [kaynak kodumuz GitHub'da](https://github.com/forwardemail) mevcuttur.

### Hata günlüklerini saklıyor musunuz? {#do-you-store-error-logs}

**Evet. Hata günlüklerine [Hesabım → Günlükler](/my-account/logs) veya [Hesabım → Alan Adları](/my-account/domains) üzerinden erişebilirsiniz.**

Şubat 2023 itibarıyla, `4xx` ve `5xx` SMTP yanıt kodlarına ait hata günlüklerini 7 gün boyunca saklıyoruz – bunlar SMTP hatası, zarf ve e-posta başlıklarını içerir (e-posta gövdesi ve ekleri **saklanmaz**).
Hata günlükleri, [alan adlarınız](/my-account/domains) için önemli e-postaların eksik olup olmadığını kontrol etmenize ve spam yanlış pozitiflerini azaltmanıza olanak tanır. Ayrıca, [e-posta webhookları](#do-you-support-webhooks) ile ilgili sorunları gidermek için harika bir kaynaktır (çünkü hata günlükleri webhook uç noktası yanıtını içerir).

[Oran sınırlaması](#do-you-have-rate-limiting) ve [gri listeleme](#do-you-have-a-greylist) için hata günlüklerine erişilemez çünkü bağlantı erken sona erer (örneğin `RCPT TO` ve `MAIL FROM` komutları iletilemeden önce).

Daha fazla bilgi için [Gizlilik Politikamıza](/privacy) bakınız.

### E-postalarımı okuyor musunuz {#do-you-read-my-emails}

Hayır, kesinlikle hayır. [Gizlilik Politikamıza](/privacy) bakınız.

Birçok diğer e-posta yönlendirme hizmeti e-postalarınızı depolayabilir ve potansiyel olarak okuyabilir. Yönlendirilen e-postaların disk depolamasına kaydedilmesi için hiçbir neden yoktur – bu yüzden her şeyi bellekte yapan ilk açık kaynak çözümünü tasarladık.

Gizlilik hakkınızın olması gerektiğine inanıyoruz ve buna sıkı sıkıya saygı duyuyoruz. Sunucuya dağıtılan kod, şeffaflık ve güven oluşturmak için [GitHub'da açık kaynak yazılım](https://github.com/forwardemail) olarak mevcuttur.

### Gmail'de "gibi gönder" yapabilir miyim? {#can-i-send-mail-as-in-gmail-with-this}

Evet! 2 Ekim 2018 itibarıyla bu özelliği ekledik. Yukarıdaki [Gmail kullanarak Nasıl Gibi Gönderilir](#how-to-send-mail-as-using-gmail) bölümüne bakınız!

Ayrıca DNS yapılandırmanızda Gmail için SPF kaydını <strong class="notranslate">TXT</strong> kaydı olarak ayarlamalısınız.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Eğer Gmail (örneğin Gibi Gönder) veya G Suite kullanıyorsanız, SPF <strong class="notranslate">TXT</strong> kaydınıza <code>include:_spf.google.com</code> eklemeniz gerekir, örneğin:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### Outlook'ta "gibi gönder" yapabilir miyim? {#can-i-send-mail-as-in-outlook-with-this}

Evet! 2 Ekim 2018 itibarıyla bu özelliği ekledik. Aşağıdaki Microsoft bağlantılarına bakabilirsiniz:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Ayrıca DNS yapılandırmanızda Outlook için SPF kaydını <strong class="notranslate">TXT</strong> kaydı olarak ayarlamalısınız.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Önemli:
  </strong>
  <span>
    Microsoft Outlook veya Live.com kullanıyorsanız, SPF <strong class="notranslate">TXT</strong> kaydınıza <code>include:spf.protection.outlook.com</code> eklemeniz gerekir, örneğin:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### Apple Mail ve iCloud Mail'de "gibi gönder" yapabilir miyim? {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

iCloud+ abonesiyseniz, özel bir alan adı kullanabilirsiniz. [Hizmetimiz Apple Mail ile de uyumludur](#apple-mail).

Daha fazla bilgi için <https://support.apple.com/en-us/102540> adresine bakınız.

### Sınırsız e-posta yönlendirebilir miyim? {#can-i-forward-unlimited-emails-with-this}

Evet, ancak "nispeten bilinmeyen" gönderenler için saat başına hostname veya IP başına 100 bağlantı ile oran sınırlaması uygulanır. Yukarıdaki [Oran Sınırlaması](#do-you-have-rate-limiting) ve [Gri Listeleme](#do-you-have-a-greylist) bölümlerine bakınız.

"Nispeten bilinmeyen" ile [izin verilenler listesinde](#do-you-have-an-allowlist) olmayan gönderenleri kastediyoruz.

Bu limit aşılırsa, gönderenin posta sunucusuna daha sonra tekrar denemesi için 421 yanıt kodu gönderilir.

### Tek bir fiyatla sınırsız alan adı sunuyor musunuz? {#do-you-offer-unlimited-domains-for-one-price}

Evet. Hangi planı kullanıyor olursanız olun, tüm alan adlarınızı kapsayan tek bir aylık ücret ödersiniz.
### Hangi ödeme yöntemlerini kabul ediyorsunuz {#which-payment-methods-do-you-accept}

Forward Email aşağıdaki tek seferlik veya aylık/üç aylık/yıllık ödeme yöntemlerini kabul eder:

1. **Kredi/Banka Kartları/Banka Transferleri**: Visa, Mastercard, American Express, Discover, JCB, Diners Club, vb.
2. **PayPal**: Kolay ödemeler için PayPal hesabınızı bağlayın
3. **Kripto Para**: Ethereum, Polygon ve Solana ağlarında Stripe'ın stablecoin ödemeleri ile ödeme kabul ediyoruz

> \[!NOTE]
> Sunucularımızda yalnızca ödeme tanımlayıcıları ve [Stripe](https://stripe.com/global) ile [PayPal](https://www.paypal.com) işlem, müşteri, abonelik ve ödeme kimliklerine referanslar dahil olmak üzere sınırlı ödeme bilgisi saklıyoruz.

> \[!TIP]
> Maksimum gizlilik için kripto para ödemelerini kullanmayı düşünün.

Tüm ödemeler Stripe veya PayPal üzerinden güvenli bir şekilde işlenir. Ödeme bilgileriniz asla sunucularımızda saklanmaz.


## Ek Kaynaklar {#additional-resources}

> \[!TIP]
> Aşağıdaki makalelerimiz düzenli olarak yeni rehberler, ipuçları ve teknik bilgilerle güncellenmektedir. En son içerikler için sık sık kontrol edin.

* [Vaka Çalışmaları ve Geliştirici Dokümantasyonu](/blog/docs)
* [Kaynaklar](/resources)
* [Rehberler](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
