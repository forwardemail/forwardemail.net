# Sıkça Sorulan Sorular {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="" class="rounded-lg" />

## İçindekiler {#table-of-contents}

* [Hızlı Başlangıç](#quick-start)
* [giriiş](#introduction)
  * [E-postayı İletmek Nedir?](#what-is-forward-email)
  * [Forward Email'i kim kullanır?](#who-uses-forward-email)
  * [Forward Email'in geçmişi nedir?](#what-is-forward-emails-history)
  * [Bu hizmet ne kadar hızlı?](#how-fast-is-this-service)
* [E-posta İstemcileri](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [Mobil Cihazlar](#mobile-devices)
  * [Gmail'i kullanarak Mail Nasıl Gönderilir?](#how-to-send-mail-as-using-gmail)
  * [Gmail kullanarak Posta Gönderme için eski ücretsiz kılavuz nedir?](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Gelişmiş Gmail Yönlendirme Yapılandırması](#advanced-gmail-routing-configuration)
  * [Gelişmiş Outlook Yönlendirme Yapılandırması](#advanced-outlook-routing-configuration)
* [Sorun giderme](#troubleshooting)
  * [Test e-postalarımı neden alamıyorum?](#why-am-i-not-receiving-my-test-emails)
  * [E-posta istemcimi E-postayı İlet ile çalışacak şekilde nasıl yapılandırabilirim?](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [E-postalarım neden Spam ve Gereksiz klasörüne düşüyor ve alan adı itibarımı nasıl kontrol edebilirim?](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Spam e-postaları alırsam ne yapmalıyım?](#what-should-i-do-if-i-receive-spam-emails)
  * [Gmail'de bana gönderilen test e-postalarım neden "şüpheli" olarak görünüyor?](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Gmail'de via forwardemail dot net ifadesini kaldırabilir miyim?](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Veri Yönetimi](#data-management)
  * [Sunucularınız nerede bulunuyor?](#where-are-your-servers-located)
  * [Posta kutumu nasıl dışa aktarabilir ve yedekleyebilirim?](#how-do-i-export-and-backup-my-mailbox)
  * [Mevcut posta kutumu nasıl içe aktarabilir ve taşıyabilirim?](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Kendi kendine barındırmayı destekliyor musunuz?](#do-you-support-self-hosting)
* [E-posta Yapılandırması](#email-configuration)
  * [E-posta yönlendirmeye nasıl başlayabilirim ve ayarlarım?](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Gelişmiş yönlendirme için birden fazla MX değişimi ve sunucusunu kullanabilir miyim?](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Tatil yanıtlayıcısını (ofis dışında otomatik yanıtlayıcı) nasıl ayarlarım?](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [E-postayı İletmek için SPF'yi nasıl ayarlarım?](#how-do-i-set-up-spf-for-forward-email)
  * [E-postayı İletmek için DKIM'i nasıl ayarlarım?](#how-do-i-set-up-dkim-for-forward-email)
  * [E-postayı İletmek için DMARC'ı nasıl ayarlarım?](#how-do-i-set-up-dmarc-for-forward-email)
  * [Kişilerimi nasıl bağlayabilir ve yapılandırabilirim?](#how-do-i-connect-and-configure-my-contacts)
  * [Takvimlerimi nasıl bağlayabilir ve yapılandırabilirim?](#how-do-i-connect-and-configure-my-calendars)
  * [Daha fazla takvim nasıl eklerim ve mevcut takvimleri nasıl yönetirim?](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [E-postayı İletmek için SRS'yi nasıl ayarlarım?](#how-do-i-set-up-srs-for-forward-email)
  * [E-postayı İletmek için MTA-STS'yi nasıl ayarlarım?](#how-do-i-set-up-mta-sts-for-forward-email)
  * [E-posta adresime profil resmi nasıl eklerim?](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Gelişmiş Özellikler](#advanced-features)
  * [Pazarlama ile ilgili e-postalar için haber bültenlerini veya e-posta listelerini destekliyor musunuz?](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [API ile e-posta göndermeyi destekliyor musunuz?](#do-you-support-sending-email-with-api)
  * [IMAP ile e-posta almayı destekliyor musunuz?](#do-you-support-receiving-email-with-imap)
  * [POP3'ü destekliyor musunuz?](#do-you-support-pop3)
  * [Takvimleri (CalDAV) destekliyor musunuz?](#do-you-support-calendars-caldav)
  * [Kişileri (CardDAV) destekliyor musunuz?](#do-you-support-contacts-carddav)
  * [SMTP ile e-posta göndermeyi destekliyor musunuz?](#do-you-support-sending-email-with-smtp)
  * [OpenPGP/MIME, uçtan uca şifreleme ("E2EE") ve Web Anahtar Dizini ("WKD")'ni destekliyor musunuz?](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [MTA-STS'yi destekliyor musunuz?](#do-you-support-mta-sts)
  * [Geçiş anahtarlarını ve WebAuthn'ı destekliyor musunuz?](#do-you-support-passkeys-and-webauthn)
  * [E-posta en iyi uygulamalarını destekliyor musunuz?](#do-you-support-email-best-practices)
  * [Bounce webhooks'u destekliyor musunuz?](#do-you-support-bounce-webhooks)
  * [Webhooks'u destekliyor musunuz?](#do-you-support-webhooks)
  * [Düzenli ifadeleri veya regex'i destekliyor musunuz?](#do-you-support-regular-expressions-or-regex)
  * [Giden SMTP sınırlarınız nelerdir?](#what-are-your-outbound-smtp-limits)
  * [SMTP'yi etkinleştirmek için onaya ihtiyacım var mı?](#do-i-need-approval-to-enable-smtp)
  * [SMTP sunucunuzun yapılandırma ayarları nelerdir?](#what-are-your-smtp-server-configuration-settings)
  * [IMAP sunucunuzun yapılandırma ayarları nelerdir?](#what-are-your-imap-server-configuration-settings)
  * [POP3 sunucu yapılandırma ayarlarınız nelerdir?](#what-are-your-pop3-server-configuration-settings)
  * [Postfix SMTP Röle Yapılandırması](#postfix-smtp-relay-configuration)
* [Güvenlik](#security)
  * [Gelişmiş Sunucu Güçlendirme Teknikleri](#advanced-server-hardening-techniques)
  * [SOC 2 veya ISO 27001 sertifikalarınız var mı?](#do-you-have-soc-2-or-iso-27001-certifications)
  * [E-posta yönlendirme için TLS şifrelemesini kullanıyor musunuz?](#do-you-use-tls-encryption-for-email-forwarding)
  * [E-posta kimlik doğrulama başlıklarını koruyor musunuz?](#do-you-preserve-email-authentication-headers)
  * [Orijinal e-posta başlıklarını koruyor ve sahteciliği engelliyor musunuz?](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Spam ve kötüye kullanıma karşı nasıl korunuyorsunuz?](#how-do-you-protect-against-spam-and-abuse)
  * [E-posta içeriğini diskte mi saklıyorsunuz?](#do-you-store-email-content-on-disk)
  * [Sistem çökmeleri sırasında e-posta içeriği açığa çıkabilir mi?](#can-email-content-be-exposed-during-system-crashes)
  * [E-posta altyapınıza kimlerin erişimi var?](#who-has-access-to-your-email-infrastructure)
  * [Hangi altyapı sağlayıcılarını kullanıyorsunuz?](#what-infrastructure-providers-do-you-use)
  * [Veri İşleme Sözleşmesi (DPA) sunuyor musunuz?](#do-you-offer-a-data-processing-agreement-dpa)
  * [Veri ihlali bildirimlerini nasıl ele alıyorsunuz?](#how-do-you-handle-data-breach-notifications)
  * [Bir test ortamı sunuyor musunuz?](#do-you-offer-a-test-environment)
  * [İzleme ve uyarı araçları sağlıyor musunuz?](#do-you-provide-monitoring-and-alerting-tools)
  * [Yüksek kullanılabilirliği nasıl sağlarsınız?](#how-do-you-ensure-high-availability)
  * [Ulusal Savunma Yetkilendirme Yasası'nın (NDAA) 889. Bölümü'ne uygun musunuz?](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Sistem ve Teknik Detaylar](#system-and-technical-details)
  * [E-postaları ve içeriklerini saklıyor musunuz?](#do-you-store-emails-and-their-contents)
  * [E-posta yönlendirme sisteminiz nasıl çalışır?](#how-does-your-email-forwarding-system-work)
  * [Bir e-postayı yönlendirmek için nasıl işlersiniz?](#how-do-you-process-an-email-for-forwarding)
  * [E-posta teslimat sorunlarını nasıl çözüyorsunuz?](#how-do-you-handle-email-delivery-issues)
  * [IP adreslerinizin engellenmesini nasıl yönetiyorsunuz?](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Postane adresleri nelerdir?](#what-are-postmaster-addresses)
  * [Cevap verilmeyen adresler nelerdir?](#what-are-no-reply-addresses)
  * [Sunucunuzun IP adresleri nelerdir?](#what-are-your-servers-ip-addresses)
  * [İzin verilenler listeniz var mı?](#do-you-have-an-allowlist)
  * [Hangi alan adı uzantıları varsayılan olarak izin verilenler listesindedir?](#what-domain-name-extensions-are-allowlisted-by-default)
  * [İzin listenizin kriterleri nelerdir?](#what-is-your-allowlist-criteria)
  * [Hangi alan adı uzantıları ücretsiz olarak kullanılabilir?](#what-domain-name-extensions-can-be-used-for-free)
  * [Gri listeniz var mı?](#do-you-have-a-greylist)
  * [Reddetme listeniz var mı?](#do-you-have-a-denylist)
  * [Hız sınırlamanız var mı?](#do-you-have-rate-limiting)
  * [Geri saçılmaya karşı nasıl korunursunuz?](#how-do-you-protect-against-backscatter)
  * [Bilinen MAIL FROM spam göndericilerinden gelen geri dönüşleri önleyin](#prevent-bounces-from-known-mail-from-spammers)
  * [Geri saçılmaya karşı koruma sağlamak için gereksiz sıçramaları önleyin](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Bir e-posta parmak izi nasıl belirlenir?](#how-do-you-determine-an-email-fingerprint)
  * [E-postaları 25'ten farklı portlara yönlendirebilir miyim (örneğin, İSS'im 25 portunu engellediyse)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Gmail takma adları için artı + simgesini destekliyor mu?](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Alt alan adlarını destekliyor mu?](#does-it-support-sub-domains)
  * [Bu, e-postamın başlıklarını iletir mi?](#does-this-forward-my-emails-headers)
  * [Bu iyi test edilmiş mi?](#is-this-well-tested)
  * [SMTP yanıt mesajlarını ve kodlarını iletiyor musunuz?](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Spam gönderenleri nasıl engellersiniz ve iyi e-posta yönlendirme itibarını nasıl sağlarsınız?](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Alan adlarında DNS aramaları nasıl yapılır?](#how-do-you-perform-dns-lookups-on-domain-names)
* [Hesap ve Faturalandırma](#account-and-billing)
  * [Ücretli planlarda para iade garantisi sunuyor musunuz?](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Plan değiştirirsem, aradaki farkı orantılı olarak hesaplayıp iade ediyor musunuz?](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Bu e-posta yönlendirme hizmetini yalnızca "yedek" veya "dönüşümlü" bir MX sunucusu olarak kullanabilir miyim?](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Belirli takma adları devre dışı bırakabilir miyim?](#can-i-disable-specific-aliases)
  * [E-postaları birden fazla alıcıya iletebilir miyim?](#can-i-forward-emails-to-multiple-recipients)
  * [Birden fazla küresel genel alıcım olabilir mi?](#can-i-have-multiple-global-catch-all-recipients)
  * [Takma ad başına iletebileceğim e-posta adresi sayısında bir üst sınır var mı?](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [E-postaları yinelemeli olarak iletebilir miyim?](#can-i-recursively-forward-emails)
  * [İnsanlar benim iznim olmadan e-posta yönlendirmemi kaydedebilir veya kaydını silebilir mi?](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Nasıl ücretsiz?](#how-is-it-free)
  * [Maksimum e-posta boyutu sınırı nedir?](#what-is-the-max-email-size-limit)
  * [E-postaların kayıtlarını saklıyor musunuz?](#do-you-store-logs-of-emails)
  * [Hata günlüklerini saklıyor musunuz?](#do-you-store-error-logs)
  * [E-postalarımı okuyor musun?](#do-you-read-my-emails)
  * [Bunu kullanarak Gmail'de "postaları şu şekilde gönder" seçeneğini kullanabilir miyim?](#can-i-send-mail-as-in-gmail-with-this)
  * [Outlook'ta bu komutla "postayı şu şekilde gönder" seçeneğini kullanabilir miyim?](#can-i-send-mail-as-in-outlook-with-this)
  * [Bunu kullanarak Apple Mail ve iCloud Mail'de "postayı şu şekilde gönder" seçeneğini kullanabilir miyim?](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Bununla sınırsız e-posta iletebilir miyim?](#can-i-forward-unlimited-emails-with-this)
  * [Tek bir fiyat karşılığında sınırsız alan adı mı sunuyorsunuz?](#do-you-offer-unlimited-domains-for-one-price)
  * [Hangi ödeme yöntemlerini kabul ediyorsunuz?](#which-payment-methods-do-you-accept)
* [Ek Kaynaklar](#additional-resources)

## Hızlı Başlangıç {#quick-start}

E-postayı İlet'e başlamak için:

1. [forwardemail.net/register](https://forwardemail.net/register) adresinde bir **hesap oluşturun**

2. **Alan adınızı ekleyin ve doğrulayın** [Hesabım → Alan Adları](/my-account/domains) altında

3. **[Hesabım → Alan Adları](/my-account/domains) → Takma Adlar altında e-posta takma adlarını/posta kutularını ekleyin ve yapılandırın**

4. **Kurulumunuzu test edin** Yeni takma adlarınızdan birine e-posta göndererek

> \[!TIP]
> DNS değişikliklerinin küresel olarak yayılması 24-48 saat sürebilir, ancak genellikle çok daha kısa sürede etkili olur.

> \[!IMPORTANT]
> Daha iyi teslimat için [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) ve [DMARC](#how-do-i-set-up-dmarc-for-forward-email) kayıtlarını ayarlamanızı öneririz.

## Giriş {#introduction}

### E-postayı İlet {#what-is-forward-email}} nedir?

> \[!NOTE]
> Forward Email, tam kapsamlı bir e-posta barındırma çözümünün maliyeti ve bakımı olmadan profesyonel e-posta adresleri isteyen bireyler, küçük işletmeler ve geliştiriciler için mükemmeldir.

Forward Email, **tam özellikli bir e-posta servis sağlayıcısı** ve **özel alan adları için e-posta barındırma sağlayıcısıdır**.

Bu, tek ücretsiz ve açık kaynaklı hizmettir ve kendi e-posta sunucunuzu kurma ve yönetme karmaşıklığı olmadan özel alan adı e-posta adresleri kullanmanıza olanak tanır.

Hizmetimiz, özel alan adınıza gönderilen e-postaları mevcut e-posta hesabınıza yönlendirir; hatta bizi özel e-posta barındırma sağlayıcınız olarak bile kullanabilirsiniz.

Forward Email'in temel özellikleri:

* **Özel Alan Adı E-postası**: Kendi alan adınızla profesyonel e-posta adresleri kullanın
* **Ücretsiz Katman**: Ücretsiz temel e-posta yönlendirme
* **Gelişmiş Gizlilik**: E-postalarınızı okumuyoruz veya verilerinizi satmıyoruz
* **Açık Kaynak**: Tüm kod tabanımız GitHub'da mevcuttur
* **SMTP, IMAP ve POP3 Desteği**: Tam e-posta gönderme ve alma özellikleri
* **Uçtan Uca Şifreleme**: OpenPGP/MIME Desteği
* **Özel Tümünü Yakalayan Takma Adlar**: Sınırsız e-posta takma adı oluşturun

Bizi [E-posta Karşılaştırma sayfamız](/blog/best-email-service) adresinde 56'dan fazla diğer e-posta servis sağlayıcısıyla karşılaştırabilirsiniz.

> \[!TIP]
> Ücretsiz [Teknik Beyaz Bülten](/technical-whitepaper.pdf) kılavuzumuzu okuyarak E-posta Yönlendirme hakkında daha fazla bilgi edinin.

### E-postayı İlet {#who-uses-forward-email}'i kim kullanır?

500.000'den fazla alan adına ve şu önemli kullanıcılara e-posta barındırma ve e-posta yönlendirme hizmeti sağlıyoruz:

| Müşteri | Vaka Çalışması |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| ABD Deniz Harp Okulu | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| Kanonik | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Netflix Oyunları |  |
| Linux Vakfı | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| PHP Vakfı |  |
| Fox Haber Radyosu |  |
| Disney Reklam Satışları |  |
| jQuery | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| LineageOS |  |
| Ubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Özgür | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Lubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Cambridge Üniversitesi | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Maryland Üniversitesi | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Washington Üniversitesi | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Tufts Üniversitesi | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Swarthmore Koleji | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Güney Avustralya Hükümeti |  |
| Dominik Cumhuriyeti Hükümeti |  |
| Uç<span>.</span>io |  |
| RCD Otelleri |  |
| Isaac Z. Schlueter (npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |  |

### E-postayı İletme geçmişi nedir? {#what-is-forward-emails-history}

E-postayı İletme hakkında daha fazla bilgiyi [Hakkımızda sayfamız](/about) adresinden edinebilirsiniz.

### Bu hizmet ne kadar hızlı? {#how-fast-is-this-service}

> \[!NOTE]
> Sistemimiz, e-postalarınızın hızlı bir şekilde teslim edilmesini sağlamak için birden fazla yedekli sunucuyla hız ve güvenilirlik için tasarlanmıştır.

Forward Email, mesajları genellikle alındıktan saniyeler sonra, minimum gecikmeyle iletir.

Performans ölçümleri:

* **Ortalama Teslimat Süresi**: Alınmasından iletilmesine kadar 5-10 saniyeden az (["TTI" izleme sayfamıza bakın](/tti))
* **Çalışma Süresi**: %99,9+ hizmet kullanılabilirliği
* **Küresel Altyapı**: Optimum yönlendirme için stratejik olarak konumlandırılmış sunucular
* **Otomatik Ölçeklendirme**: Sistemimiz, e-postaların yoğun olduğu dönemlerde ölçeklenir

Diğer sağlayıcıların aksine, gecikmeli kuyruklara dayalı olarak gerçek zamanlı çalışıyoruz.

[hata istisnası](#do-you-store-error-logs) ve [giden SMTP](#do-you-support-sending-email-with-smtp) ile diske yazmıyoruz veya günlükleri saklamıyoruz ([Gizlilik Politikası](/privacy)'mize bakın).

Her şey bellek içinde ve [kaynak kodumuz GitHub'da](https://github.com/forwardemail)'da yapılır.

## E-posta İstemcileri {#email-clients}

### Thunderbird {#thunderbird}

1. E-posta İletme panonuzda yeni bir takma ad oluşturun ve bir parola oluşturun.
2. Thunderbird'ü açın ve **Düzenle → Hesap Ayarları → Hesap İşlemleri → E-posta Hesabı Ekle** bölümüne gidin.
3. Adınızı, İletme E-posta adresinizi ve parolanızı girin.
4. **Manuel olarak yapılandır**'a tıklayın ve şunları girin:
* Gelen: IMAP, `imap.forwardemail.net`, port 993, SSL/TLS
* Giden: SMTP, `smtp.forwardemail.net`, port 587, STARTTLS
5. **Bitti**'ye tıklayın.

### Microsoft Outlook {#microsoft-outlook}

1. Yönlendirme E-postası panonuzda yeni bir takma ad oluşturun ve bir parola oluşturun.
2. **Dosya → Hesap Ekle**'ye gidin.
3. Yönlendirme E-postası adresinizi girin ve **Bağlan**'a tıklayın.
4. **Gelişmiş Seçenekler**'i seçin ve **Hesabımı manuel olarak kurmama izin ver**'i seçin.
5. **IMAP**'i seçin ve şunları girin:
* Gelen: `imap.forwardemail.net`, port 993, SSL
* Giden: `smtp.forwardemail.net`, port 587, TLS
* Kullanıcı Adı: Tam e-posta adresiniz
* Parola: Oluşturduğunuz parola
6. **Bağlan**'a tıklayın.

### Apple Mail {#apple-mail}

1. E-posta İletme panonuzda yeni bir takma ad oluşturun ve bir parola oluşturun.
2. **Posta → Tercihler → Hesaplar → +**'ya gidin.
3. **Diğer Posta Hesabı**'nı seçin.
4. Adınızı, İletme E-posta adresinizi ve parolanızı girin.
5. Sunucu ayarları için şunları girin:
* Gelen: `imap.forwardemail.net`
* Giden: `smtp.forwardemail.net`
* Kullanıcı Adı: Tam e-posta adresiniz
* Parola: Oluşturduğunuz parola
6. **Oturum Aç**'a tıklayın.

### Mobil Cihazlar {#mobile-devices}

iOS için:

1. **Ayarlar → Posta → Hesaplar → Hesap Ekle → Diğer**'e gidin.
2. **Posta Hesabı Ekle**'ye dokunun ve bilgilerinizi girin.
3. Sunucu ayarları için yukarıdakiyle aynı IMAP ve SMTP ayarlarını kullanın.

Android için:

1. **Ayarlar → Hesaplar → Hesap Ekle → Kişisel (IMAP)** bölümüne gidin.
2. Yönlendirme E-posta adresinizi ve şifrenizi girin.
3. Sunucu ayarları için yukarıdakiyle aynı IMAP ve SMTP ayarlarını kullanın.

### Gmail Kullanarak Posta Nasıl Gönderilir {#how-to-send-mail-as-using-gmail}

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
<a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">E-posta yönlendirmeyi nasıl başlatırım ve ayarlarım</a> bölümündeki talimatları uyguladıysanız, aşağıdaki okumaya devam edebilirsiniz.
</span>
</div>

<div id="postayı-içerik-olarak-gönder">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Önemli:
</strong>
<span>
Lütfen <a href="/terms" class="alert-link" target="_blank">Şartlarımızı</a>, <a href="/privacy" class="alert-link" target="_blank">Gizlilik Politikamızı</a> ve <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Giden SMTP Sınırlamalarımızı</a> okuduğunuzdan emin olun; kullanımınız onay ve sözleşme olarak kabul edilir.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Önemli:
</strong>
<span>
Geliştiriciyseniz, <a class="alert-link" href="/email-api#outbound-emails" target="_blank">e-posta API belgelerimize</a> bakın.
</span>
</div>

1. <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Ayarlar <i class="fa fa-angle-right"></i> Giden SMTP Yapılandırması'na gidin ve kurulum talimatlarını izleyin.

2. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar (ör. <code><hello@example.com></code>) altında alan adınız için yeni bir takma ad oluşturun.

3. Yeni oluşturulan takma adın yanındaki <strong class="text-success"><i class="fa fa-key"></i>Şifre Oluştur</strong>'a tıklayın. Ekranda gösterilen oluşturulan şifreyi panonuza kopyalayın ve güvenli bir şekilde saklayın.

4. [Gmail](https://gmail.com) adresine gidin ve [Ayarlar <i class="fa fa-angle-right"></i> Hesaplar ve İçe Aktarma <i class="fa fa-angle-right"></i> E-postayı şu şekilde gönder:](https://mail.google.com/mail/u/0/#settings/accounts) altında "Başka bir e-posta adresi ekle" seçeneğine tıklayın.

5. "Ad" sorulduğunda, e-postanızın "Kimden" olarak görünmesini istediğiniz adı girin (örneğin "Linus Torvalds").

6. "E-posta adresi" istendiğinde, <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar (ör. <code><hello@example.com></code>) altında oluşturduğunuz bir takma adın tam e-posta adresini girin.

7. "Takma ad olarak davran" seçeneğinin işaretini kaldırın

8. Devam etmek için "Sonraki Adım"a tıklayın

9. "SMTP Sunucusu" istendiğinde <code>smtp.forwardemail.net</code> adresini girin ve bağlantı noktasını <code>587</code> olarak bırakın.

10. "Kullanıcı Adı" istendiğinde, <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar (ör. <code><hello@example.com></code>) altında oluşturduğunuz bir takma adın tam e-posta adresini girin.

11. "Şifre" istendiğinde, yukarıdaki 3. adımda <strong class="text-success"><i class="fa fa-key"></i>Şifre Oluştur</strong>'dan şifreyi yapıştırın

12. "TLS kullanarak güvenli bağlantı" seçeneğinin işaretli olduğundan emin olun.

13. Devam etmek için "Hesap Ekle"ye tıklayın

14. [Gmail](https://gmail.com) için yeni bir sekme açın ve doğrulama e-postanızın gelmesini bekleyin ("Postaları Şu Şekilde Gönder"e tıkladığınız e-posta adresinin sahibi olduğunuzu doğrulayan bir doğrulama kodu alacaksınız).

15. Geldiğinde, bir önceki adımda aldığınız istemdeki doğrulama kodunu kopyalayıp yapıştırın.

16. Bunu yaptıktan sonra e-postaya geri dönün ve "isteği onayla" bağlantısına tıklayın. E-postanın doğru şekilde yapılandırılması için büyük olasılıkla bu adımı ve önceki adımı uygulamanız gerekecektir.

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

### Gmail kullanarak Posta Gönderme için eski ücretsiz kılavuz nedir? {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Önemli:</strong> Bu eski ücretsiz kılavuz, <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we artık giden SMTP'yi desteklediği</a> için Mayıs 2023 itibarıyla kullanımdan kaldırılmıştır. Aşağıdaki kılavuzu kullanırsanız, <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this giden e-postanızın Gmail'de "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" yazmasına neden olur.</a></div>

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
<a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">E-posta yönlendirmeyi nasıl başlatırım ve ayarlarım</a> bölümündeki talimatları uyguladıysanız, aşağıdaki okumaya devam edebilirsiniz.
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="Gmail Kullanarak Mail Adresi Nasıl Gönderilir" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Bunun çalışması için [Gmail'in İki Faktörlü Kimlik Doğrulaması][gmail-2fa] özelliğinin etkinleştirilmiş olması gerekir. Etkinleştirilmemişse <https://www.google.com/landing/2step/> adresini ziyaret edin.

2. İki Faktörlü Kimlik Doğrulama etkinleştirildikten sonra (veya zaten etkinleştirdiyseniz), <https://myaccount.google.com/apppasswords>. adresini ziyaret edin

3. "Uygulama şifresini oluşturmak istediğiniz uygulamayı ve cihazı seçin" istendiğinde:
* "Uygulama seç" açılır menüsünden "Posta"yı seçin
* "Cihaz seç" açılır menüsünden "Diğer"i seçin
* Metin girişi istendiğinde, yönlendirme yaptığınız özel alan adınızın e-posta adresini girin (örneğin <code><hello@example.com></code> - bu, bu hizmeti birden fazla hesap için kullanmanız durumunda takip etmenize yardımcı olacaktır)

4. Otomatik olarak oluşturulan şifreyi panonuza kopyalayın.
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Önemli:
</strong>
<span>
G Suite kullanıyorsanız, yönetici panelinize gidin <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Uygulamalar <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Gmail Ayarları <i class="fa fa-angle-right"></i> Ayarlar</a> ve "Kullanıcıların harici bir SMTP sunucusu üzerinden e-posta göndermesine izin ver..." seçeneğini işaretlediğinizden emin olun. Bu değişikliğin etkinleştirilmesi biraz gecikmeli olacağından lütfen birkaç dakika bekleyin.
</span>
</div>

5. [Gmail](https://gmail.com) adresine gidin ve [Ayarlar <i class="fa fa-angle-right"></i> Hesaplar ve İçe Aktarma <i class="fa fa-angle-right"></i> E-postayı şu şekilde gönder:](https://mail.google.com/mail/u/0/#settings/accounts) altında "Başka bir e-posta adresi ekle" seçeneğine tıklayın.

6. "Ad" istendiğinde, e-postanızın "Kimden" olarak görünmesini istediğiniz adı girin (örneğin "Linus Torvalds")

7. "E-posta adresi" istendiğinde, yukarıda kullandığınız özel alan adına sahip e-posta adresini girin (örneğin <code><hello@example.com></code>)

8. "Takma ad olarak davran" seçeneğinin işaretini kaldırın

9. Devam etmek için "Sonraki Adım"a tıklayın

10. "SMTP Sunucusu" istendiğinde <code>smtp.gmail.com</code> adresini girin ve bağlantı noktasını <code>587</code> olarak bırakın.

11. "Kullanıcı Adı" istendiğinde, Gmail adresinizin <span>gmail.com</span> kısmını eklemeden ilgili kısmını girin (örneğin, e-posta adresim <span><user@gmail.com></span> ise sadece "user" yazın).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Önemli:
</strong>
<span>
"Kullanıcı Adı" kısmı otomatik olarak dolduruluyorsa, <u><strong>bunu</strong></u> Gmail adresinizin kullanıcı adı kısmıyla değiştirmeniz</strong></u> gerekecektir.
</span>
</div>

12. "Şifre" istendiğinde, yukarıdaki 2. adımda oluşturduğunuz şifreyi panonuzdan yapıştırın

13. "TLS kullanarak güvenli bağlantı" seçeneğinin işaretli olduğundan emin olun.

14. Devam etmek için "Hesap Ekle"ye tıklayın

15. [Gmail](https://gmail.com) için yeni bir sekme açın ve doğrulama e-postanızın gelmesini bekleyin ("Posta Gönderme"yi denediğiniz e-posta adresinin sahibi olduğunuzu doğrulayan bir doğrulama kodu alacaksınız)

16. Geldiğinde, bir önceki adımda aldığınız istemdeki doğrulama kodunu kopyalayıp yapıştırın.

17. Bunu yaptıktan sonra e-postaya geri dönün ve "isteği onayla" bağlantısına tıklayın. E-postanın doğru şekilde yapılandırılması için büyük olasılıkla bu adımı ve önceki adımı uygulamanız gerekecektir.

</div>

### Gelişmiş Gmail Yönlendirme Yapılandırması {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Tahmini Kurulum Süresi:</strong>
<span>15-30 dakika</span>
</div>

Gmail'de gelişmiş yönlendirmeyi ayarlayarak, posta kutusuyla eşleşmeyen takma adların Forward Email'in posta alışverişlerine yönlendirilmesini istiyorsanız, şu adımları izleyin:

1. [admin.google.com](https://admin.google.com) adresinden Google Yönetici konsolunuza giriş yapın.
2. **Uygulamalar → Google Workspace → Gmail → Yönlendirme** bölümüne gidin.
3. **Yönlendirme Ekle** seçeneğine tıklayın ve aşağıdaki ayarları yapılandırın:

**Tek Alıcı Ayarları:**

* "Zarf alıcısını değiştir" seçeneğini belirleyin ve birincil Gmail adresinizi girin.
* "Orijinal alıcıyla X-Gm-Original-To başlığını ekle" seçeneğini işaretleyin.

**Zarf Alıcı Desenleri:**

* Var olmayan tüm posta kutularıyla eşleşen bir desen ekleyin (örneğin, `.*@yourdomain.com`)

**E-posta Sunucusu Ayarları:**

* "Ana bilgisayara yönlendir" seçeneğini belirleyin ve birincil sunucu olarak `mx1.forwardemail.net` girin.
* `mx2.forwardemail.net`'i yedek sunucu olarak ekleyin.
* Bağlantı noktasını 25 olarak ayarlayın.
* Güvenlik için "TLS Gerektir" seçeneğini belirleyin.

4. Rotayı oluşturmak için **Kaydet**'e tıklayın

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Önemli:
</strong>
<span>
Bu yapılandırma yalnızca özel alan adlarına sahip Google Workspace hesapları için çalışır, normal Gmail hesapları için çalışmaz.
</span>
</div>

### Gelişmiş Outlook Yönlendirme Yapılandırması {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Tahmini Kurulum Süresi:</strong>
<span>15-30 dakika</span>
</div>

Posta kutusuyla eşleşmeyen takma adların Forward Email'in posta alışverişlerine yönlendirilmesi için gelişmiş yönlendirme ayarlamak isteyen Microsoft 365 (eski adıyla Office 365) kullanıcıları için:

1. [admin.microsoft.com](https://admin.microsoft.com) adresinden Microsoft 365 yönetim merkezine giriş yapın.
2. **Exchange → Posta akışı → Kurallar**'a gidin.
3. **Kural ekle**'ye tıklayın ve **Yeni kural oluştur**'u seçin.
4. Kuralınıza bir ad verin (örneğin, "Mevcut olmayan posta kutularını E-postayı İlet'e ilet").
5. **Bu kuralı şu durumlarda uygula** altında şunları seçin:
* "Alıcı adresi şu şekilde eşleşiyorsa..."
* Alan adınızdaki tüm adreslerle eşleşen bir kalıp girin (örneğin, `*@yourdomain.com`)
6. **Aşağıdakileri yap** altında şunları seçin:
* "İletiyi şuraya yönlendir..."
* "Aşağıdaki posta sunucusu"nu seçin.
* `mx1.forwardemail.net` ve 25 numaralı bağlantı noktasını girin.
* `mx2.forwardemail.net`'ü yedek sunucu olarak ekleyin.
7. **Şu durumlar hariç** altında şunları seçin:
* "Alıcı şu şekilde..."
* Yönlendirilmemesi gereken tüm mevcut posta kutularınızı ekleyin.
8. Diğer posta akışı kurallarından sonra çalışmasını sağlamak için kural önceliğini ayarlayın
9. Kuralı etkinleştirmek için **Kaydet**'e tıklayın

## Sorun Giderme {#troubleshooting}

### Test e-postalarımı neden alamıyorum {#why-am-i-not-receiving-my-test-emails}

Kendinize bir test e-postası gönderiyorsanız, aynı "Message-ID" başlığına sahip olduğu için gelen kutunuzda görünmeyebilir.

Bu yaygın olarak bilinen bir sorundur ve Gmail gibi hizmetleri de etkiler. <a href="https://support.google.com/a/answer/1703601">Here, bu sorunla ilgili resmi Gmail yanıtıdır</a>.

Sorun yaşamaya devam ederseniz, büyük olasılıkla DNS yayılımıyla ilgili bir sorun vardır. Biraz daha bekleyip tekrar denemeniz (veya <strong class="notranslate">TXT</strong> kayıtlarınıza daha düşük bir TTL değeri ayarlamanız) gerekecektir.

**Hala sorun mu yaşıyorsunuz?** Lütfen <a href="/help">bizimle iletişime geçin</a>, böylece sorunu araştırıp hızlı bir çözüm bulabiliriz.

### E-posta istemcimi E-postayı İlet {#how-do-i-configure-my-email-client-to-work-with-forward-email} ile çalışacak şekilde nasıl yapılandırabilirim?

<div class="mb-3">
Hizmetimiz aşağıdaki gibi popüler e-posta istemcileriyle çalışır:
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
<li class="list-inline-item"><a href="/blog/açık-kaynak/linux-e-posta-istemcileri" target="_blank" class="rozet rozet-light arka plan ışığı metin-koyu"><i class="fab fa-linux"></i> Linux&reg;</a></li>
<li class="list-inline-item"><a href="/blog/açık-kaynak/masaüstü-e-posta-istemcileri" target="_blank" class="rozet rozet-light arka plan ışığı metin-koyu"><i class="fas fa-masaüstü"></i> Masaüstü</a></li>
<li class="list-inline-item"><a href="/blog/açık-kaynak/mozilla-firefox-e-posta-istemcileri" target="_blank" class="rozet rozet-light arka plan ışığı metin-koyu"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
<li class="list-inline-item"><a href="/blog/açık-kaynak/safari-e-posta-istemcileri" target="_blank" class="rozet rozet-ışık arka plan ışığı metin-koyu">Safari&reg;</a></li>
<li class="list-inline-item"><a href="/blog/açık-kaynak/google-chrome-e-posta-istemcileri" target="_blank" class="rozet rozet-ışık arka plan ışığı metin-koyu"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
<li class="list-inline-item"><a href="/blog/açık-kaynak/terminal-e-posta-istemcileri" target="_blank" class="rozet rozet-ışık arka plan ışığı metin-koyu"><i class="fas fa-terminal"></i> Terminal</a></li>
  </ul>
</div>

<div class="alert alert-primary">
Kullanıcı adınız, takma adınızın e-posta adresidir ve şifreniz <strong class="text-success"><i class="fa fa-key"></i>Şifre Oluştur</strong> ("Normal Şifre") adresinden alınmıştır.
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
İpucu:
</strong>
<span>Thunderbird kullanıyorsanız, "Bağlantı güvenliği"nin "SSL/TLS" ve Kimlik Doğrulama yönteminin "Normal parola" olarak ayarlandığından emin olun.</span>
</div>

| Tip | Ana bilgisayar adı | Protokol | Limanlar |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **Tercih Edilen** | __HÜCRE_KODU_0__ ve __HÜCRE_KODU_1__ |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Tercih Edilen** veya TLS (STARTTLS) | SSL/TLS için `465` ve `2465` (veya) TLS için `587`, `2587`, `2525` ve `25` (STARTTLS) |

### E-postalarım neden Spam ve Önemsiz klasörüne düşüyor ve alan adı itibarımı nasıl kontrol edebilirim? {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

Bu bölüm, giden postanızın SMTP sunucularımızı (örneğin `smtp.forwardemail.net`) kullanıp kullanmadığını (veya `mx1.forwardemail.net` ya da `mx2.forwardemail.net` üzerinden yönlendirilip yönlendirilmediğini) ve alıcıların Spam veya Önemsiz klasörüne teslim edilip edilmediğini anlamanıza yardımcı olur.

[IP adresleri](#what-are-your-servers-ip-addresses)'ımızı [tüm saygın DNS reddi listeleri](#how-do-you-handle-your-ip-addresses-becoming-blocked) ile düzenli olarak izliyoruz, **bu nedenle büyük olasılıkla bu, alan adı itibarına özgü bir sorundur**.

E-postalar çeşitli nedenlerle spam klasörüne düşebilir:

1. **Eksik Kimlik Doğrulaması**: [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) ve [DMARC](#how-do-i-set-up-dmarc-for-forward-email) kayıtlarını ayarlayın.

2. **Alan Adı İtibarı**: Yeni alan adları, gönderim geçmişi oluşturulana kadar genellikle nötr bir itibara sahiptir.

3. **İçerik Tetikleyicileri**: Bazı kelimeler veya ifadeler spam filtrelerini tetikleyebilir.

4. **Gönderme Modelleri**: E-posta hacmindeki ani artışlar şüpheli görünebilir.

Alan adınızın itibarını ve kategorisini kontrol etmek için aşağıdaki araçlardan birini veya birkaçını kullanmayı deneyebilirsiniz:

| Araç Adı | URL | Tip |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Cloudflare Alan Adı Kategorizasyonu Geri Bildirimi | <https://radar.cloudflare.com/domains/feedback> | Kategorizasyon |
| Spamhaus IP ve Alan Adı İtibarı Denetleyicisi | <https://check.spamhaus.org/> | DNSBL |
| Cisco Talos IP ve Alan Adı İtibar Merkezi | <https://talosintelligence.com/reputation_center> | İtibar |
| Barracuda IP ve Alan Adı İtibarı Arama | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| MX Toolbox Kara Liste Kontrolü | <https://mxtoolbox.com/blacklists.aspx> | Kara liste |
| Google Postmaster Araçları | <https://www.gmail.com/postmaster/> | İtibar |
| Yahoo Gönderici Merkezi | <https://senders.yahooinc.com/> | İtibar |
| MultiRBL.valli.org Kara Liste Kontrolü | <https://multirbl.valli.org/lookup/> | DNSBL |
| Gönderen Puanı | <https://senderscore.org/act/blocklist-remover/> | İtibar |
| Değer düşüklüğü | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| Apple/Proofpoint IP kaldırma | <https://ipcheck.proofpoint.com/> | Kaldırma |
| Cloudmark IP kaldırma | <https://csi.cloudmark.com/tr/sıfırla/> | Kaldırma |
| SpamCop | <https://www.spamcop.net/bl.shtml> | DNSBL |
| Microsoft Outlook ve Office 365 IP kaldırma | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | Kaldırma |
| UCEPROTECT'in 1, 2 ve 3. Seviyeleri | <https://www.uceprotect.net/tr/rblcheck.php> | DNSBL |
| UCEPROTECT'in backscatterer.org | <https://www.backscatterer.org/> | Geri Saçılma Koruması |
| UCEPROTECT'in whitelisted.org'u | <https://www.whitelisted.org/> (ücret gerektirir) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | Kaldırma |
| AOL/Verizon (örn. `[IPTS04]`) | <https://senders.yahooinc.com/> | Kaldırma |
| Cox İletişim | `unblock.request@cox.net` | Kaldırma |
| t-online.de (Almanca/T-Mobile) | `tobr@rx.t-online.de` | Kaldırma |

> \[!TIP]
> Daha büyük hacimlerde göndermeden önce olumlu bir itibar oluşturmak için düşük hacimli, yüksek kaliteli e-postalarla başlayın.

> \[!IMPORTANT]
> Alan adınız kara listedeyse, her kara listenin kendi kaldırma süreci vardır. Talimatlar için web sitelerini kontrol edin.

> \[!TIP]
> Ek yardıma ihtiyacınız varsa veya belirli bir e-posta servis sağlayıcısı tarafından spam olarak yanlış pozitif olarak listelendiğimizi tespit ederseniz, lütfen <a href="/help">bizimle iletişime geçin</a>.

### Spam e-postaları alırsam ne yapmalıyım? {#what-should-i-do-if-i-receive-spam-emails}

E-posta listesinden çıkmanız (mümkünse) ve göndereni engellemeniz gerekir.

Lütfen mesajı spam olarak bildirmeyin, bunun yerine elle düzenlenmiş ve gizlilik odaklı kötüye kullanım önleme sistemimize iletin.

**Spam'ı iletmek için e-posta adresi:** <abuse@forwardemail.net>

### Gmail'de bana gönderilen test e-postalarım neden "şüpheli" olarak görünüyor? {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Kendinize bir test gönderdiğinizde veya takma adınızla e-posta gönderdiğiniz bir kişi sizden gelen bir e-postayı ilk kez gördüğünde Gmail'de bu hata mesajını görüyorsanız, **lütfen endişelenmeyin** – çünkü bu, Gmail'in yerleşik bir güvenlik özelliğidir.

"Güvenli görünüyor" seçeneğine tıklamanız yeterli. Örneğin, "postayı şu adresten gönder" özelliğini kullanarak (başka birine) bir test mesajı gönderirseniz, bu mesajı göremezler.

Ancak bu mesajı görürlerse, bunun nedeni normalde e-postalarınızın <john@customdomain.com> adresinden değil de <john@gmail.com> adresinden geldiğini görmeye alışmış olmalarıdır (sadece bir örnek). Gmail, her ihtimale karşı her şeyin güvenli olduğundan emin olmak için kullanıcıları uyarır, başka bir çözüm yolu yoktur.

### Gmail'de via forwardemail dot net ifadesini kaldırabilir miyim? {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Bu konu [Gmail'de gönderenin adının yanında ek bilgilerin göründüğü yaygın olarak bilinen bir sorun](https://support.google.com/mail/answer/1311182) ile ilgilidir.

Mayıs 2023 itibarıyla tüm ücretli kullanıcılar için eklenti olarak SMTP ile e-posta göndermeyi destekliyoruz. Bu, Gmail'de <span class="notranslate">via forwardemail dot net</span> kodunu kaldırabileceğiniz anlamına geliyor.

Bu SSS konusunun [Gmail'i kullanarak Mail Nasıl Gönderilir?](#how-to-send-mail-as-using-gmail) özelliğini kullananlara özel olduğunu unutmayın.

Yapılandırma talimatları için lütfen [SMTP ile e-posta göndermeyi destekliyor musunuz?](#do-you-support-sending-email-with-smtp) bölümüne bakın.

## Veri Yönetimi {#data-management}

### Sunucularınız nerede bulunuyor? {#where-are-your-servers-located}

> \[!TIP]
> Yakında [forwardemail.eu](https://forwardemail.eu) altında barındırılan AB veri merkezi konumumuzu duyurabiliriz. Güncellemeler için <https://github.com/orgs/forwardemail/discussions/336> adresindeki tartışmaya abone olun.

Sunucularımız öncelikli olarak Denver, Colorado'da bulunmaktadır; IP adreslerimizin tam listesi için <https://forwardemail.net/ips> adresine bakın.

Alt işlemcilerimiz hakkında bilgi edinmek için [GDPR](/gdpr), [DPA](/dpa) ve [Mahremiyet](/privacy) sayfalarımızı ziyaret edebilirsiniz.

### Posta kutumu nasıl dışa aktarabilir ve yedekleyebilirim? {#how-do-i-export-and-backup-my-mailbox}

İstediğiniz zaman posta kutularınızı [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) veya şifreli [SQLite](https://en.wikipedia.org/wiki/SQLite) formatlarında dışa aktarabilirsiniz.

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar <i class="fa fa-angle-right"></i> bölümüne gidin. Yedeklemeyi indirin ve tercih ettiğiniz dışa aktarma biçimi türünü seçin.

İhracat tamamlandığında indirme bağlantısı size e-postayla gönderilecektir.

Güvenlik endişeleri nedeniyle bu dışa aktarma indirme bağlantısının 4 saat sonra sona ereceğini unutmayın.

Eğer dışa aktardığınız EML veya Mbox formatlarını incelemeniz gerekiyorsa, o zaman bu açık kaynaklı araçlar faydalı olabilir:

| İsim | Biçim | Platform | GitHub URL |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox Görüntüleyici | Mbox | Pencereler | <https://github.com/eneam/mboxviewer> |
| mbox-web-görüntüleyici | Mbox | Tüm platformlar | <https://github.com/PHMRanger/mbox-web-görüntüleyici> |
| EmlReader | EML | Pencereler | <https://github.com/ayamadori/EmlReader> |
| E-posta görüntüleyicisi | EML | VSCode | <https://github.com/joelharkes/vscode_email_viewer> |
| eml okuyucu | EML | Tüm platformlar | <https://github.com/s0ph1e/eml-reader> |

Ayrıca, bir Mbox dosyasını EML dosyasına dönüştürmeniz gerekiyorsa, <https://github.com/noelmartinon/mboxzilla>. kullanabilirsiniz

### Mevcut posta kutumu nasıl içe aktarabilir ve taşıyabilirim? {#how-do-i-import-and-migrate-my-existing-mailbox}

Aşağıdaki talimatları izleyerek e-postanızı Forward Email'e (örneğin [Thunderbird](https://www.thunderbird.net) kullanarak) kolayca aktarabilirsiniz:

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Önemli:
</strong>
<span>
Mevcut e-postanızı içe aktarmak için aşağıdaki adımların tümünü izlemelisiniz.
</span>
</div>

1. Mevcut e-posta sağlayıcınızdan e-postanızı dışa aktarın:

| E-posta Sağlayıcısı | Dışa Aktarma Biçimi | İhracat Talimatları |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gmail | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| Görünüm | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">İpucu:</strong> <span>Outlook kullanıyorsanız (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST dışa aktarma biçimi</a>), aşağıdaki "Diğer" bölümündeki talimatları takip edebilirsiniz. Ancak işletim sisteminize bağlı olarak PST'yi MBOX/EML biçimine dönüştürmek için aşağıda bağlantılar sağladık:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Windows için Zinkuba</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">Windows için readpst cygwin</a> – (örneğin <code>readpst -u -o $OUT_DIR $IN_DIR</code> yerine <code>$OUT_DIR</code> ve <code>$IN_DIR</code> sırasıyla çıktı dizini ve girdi dizini yollarıyla).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">Ubuntu/Linux için readpst</a> – (örneğin, <code>sudo apt-get install readpst</code> ve ardından <code>readpst -u -o $OUT_DIR $IN_DIR</code>, <code>$OUT_DIR</code> ve <code>$IN_DIR</code> sırasıyla çıktı dizini ve girdi dizini yollarıyla değiştirilir).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">macOS için readpst (brew üzerinden)</a> – (örneğin, <code>brew install libpst</code> ve ardından <code>readpst -u -o $OUT_DIR $IN_DIR</code>, <code>$OUT_DIR</code> ve <code>$IN_DIR</code>'i sırasıyla çıkış dizini ve giriş dizini yollarıyla değiştirir).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">Windows için PST Dönüştürücü (GitHub)</a></li></ul><br /></span></div> |
| Apple Mail | MBOX | <https://support.apple.com/guide/mail/posta-kutularını-içe-aktarma-veya-dışa-aktarma-mlhlp1030/mac#apd37a3190755974> |
| Hızlı posta | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-Tüm-verilerinizi-indirin#downloadmail> |
| Proton Postası | MBOX/EML | <https://proton.me/support/e-postalari-dışa-aktarma-uygulamasi> |
| Tutanota | EML | <https://github.com/crepererum-oss/tatutanatata> |
| Düşünmek | EML | <https://docs.gandi.net/tr/gandimail/ortak_operasyonlar/yedekleme_e-postası.html#contents> |
| Zoho | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| Diğer | [Use Thunderbird](https://www.thunderbird.net) | Mevcut e-posta hesabınızı Thunderbird'de kurun ve ardından e-postalarınızı içe ve dışa aktarmak için [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) eklentisini kullanın. **Ayrıca, e-postaları bir hesaptan diğerine kopyalayıp yapıştırabilir veya sürükleyip bırakabilirsiniz.** |

2. [Thunderbird](https://www.thunderbird.net)'ı indirin, kurun ve açın.

3. Takma adınızın tam e-posta adresini (örneğin <code><you@yourdomain.com></code>) ve oluşturduğunuz parolayı kullanarak yeni bir hesap oluşturun. <strong>Henüz oluşturulmuş bir parolanız yoksa, <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">kurulum talimatlarımıza bakın</a></strong>.

4. [İthalatİhracatAraçları](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird eklentisini indirin ve kurun.

5. Thunderbird'de yeni bir yerel klasör oluşturun ve ardından üzerine sağ tıklayın → `ImportExportTools NG` seçeneğini seçin → `Import mbox file`'i (MBOX dışa aktarma biçimi için) veya – `Import messages` / `Import all messages from a directory`'ü (EML dışa aktarma biçimi için) seçin.

6. Mesajlarınızı yerel klasörden, Thunderbird'deki yeni (veya mevcut) bir IMAP klasörüne sürükleyip bırakın. Bu, mesajlarınızın SQLite şifreli depolama alanımızda çevrimiçi olarak yedeklenmesini sağlayacaktır.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
İpucu:
</strong>
<span>
Thunderbird'e nasıl aktaracağınız konusunda kafanız karışıksa, <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> ve <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>. adreslerindeki resmi talimatlara başvurabilirsiniz.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Önemli:
</strong>
<span>
Dışa aktarma ve içe aktarma işlemini tamamladıktan sonra, mevcut e-posta hesabınızda yönlendirmeyi etkinleştirmek ve gönderenlere yeni bir e-posta adresiniz olduğunu bildirmek için bir otomatik yanıtlayıcı ayarlamak isteyebilirsiniz (örneğin, daha önce Gmail kullanıyorsanız ve şimdi özel alan adınıza sahip bir e-posta kullanıyorsanız).
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

### Kendi kendinize barındırmayı destekliyor musunuz? {#do-you-support-self-hosting}

Evet, Mart 2025 itibarıyla kendi kendine barındırılan bir seçeneği destekliyoruz. [Burada](https://forwardemail.net/blog/docs/self-hosted-solution) blogunu okuyun. Başlamak için [kendi kendine barındırılan rehber](https://forwardemail.net/self-hosted)'e göz atın. Daha ayrıntılı, adım adım bir sürümle ilgilenenler için [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) veya [Debian](https://forwardemail.net/guides/selfhosted-on-debian) tabanlı kılavuzlarımıza göz atın.

## E-posta Yapılandırması {#email-configuration}

### E-posta yönlendirmeyi nasıl başlatabilirim ve ayarlayabilirim? {#how-do-i-get-started-and-set-up-email-forwarding}

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
Aşağıda listelenen birinci adımdan sekizinci adıma kadar olan adımları dikkatlice okuyun ve uygulayın. <code>user@gmail.com</code> e-posta adresini, e-postaları iletmek istediğiniz e-posta adresiyle (doğru değilse) değiştirdiğinizden emin olun. Benzer şekilde, <code>example.com</code> adresini de özel alan adınızla (doğru değilse) değiştirdiğinizden emin olun.
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">Alan adınızı daha önce bir yerde kaydettiyseniz, bu adımı tamamen atlayıp ikinci adıma geçmelisiniz! Aksi takdirde, <a href="/domain-registration" rel="noopener noreferrer">alan adınızı kaydettirmek için buraya tıklayabilirsiniz</a>.</li>
<li class="mb-2 mb-md-3 mb-lg-5">
Alan adınızı nerede kaydettirdiğinizi hatırlıyor musunuz? Bunu hatırladıktan sonra aşağıdaki talimatları izleyin:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Önemli:
</strong>
<span>
Yeni bir sekme açıp alan adı kayıt kuruluşunuza giriş yapmalısınız. Bunu otomatik olarak yapmak için aşağıdaki "Kayıt Kuruluşunuz"a kolayca tıklayabilirsiniz. Bu yeni sekmede, kayıt kuruluşunuzun DNS yönetim sayfasına gitmeniz gerekir; "Yapılandırma Adımları" sütununda adım adım gezinme adımlarını bulabilirsiniz. Yeni sekmede bu sayfaya gittikten sonra, bu sekmeye geri dönebilir ve aşağıdaki üçüncü adıma geçebilirsiniz.
<strong class="font-weight-bold">Açık sekmeyi henüz kapatmayın; sonraki adımlar için ihtiyacınız olacak!</strong>
</span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Kayıt Kuruluşu</th>
<th>Yapılandırma Adımları</th>
</tr>
</thead>
<tbody>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
<td>Giriş Yap <i class="fa fa-angle-right"></i> Alan Adı Merkezi <i class="fa fa-angle-right"></i> (Alan Adınızı Seçin) <i class="fa fa-angle-right"></i> DNS Ayarlarını Düzenle</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
<td>Giriş Yap <i class="fa fa-angle-right"></i> Barındırılan Bölgeler <i class="fa fa-angle-right"></i> (Alan Adınızı Seçin)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>Giriş Yap <i class="fa fa-angle-right"></i> Sunucularım <i class="fa fa-angle-right"></i> Alan Adı Yönetimi <i class="fa fa-angle-right"></i> DNS Yöneticisi</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>ROCK İÇİN: Giriş Yap <i class="fa fa-angle-right"></i> Alan Adları <i class="fa fa-angle-right"></i> (Yönetmek için yanındaki ▼ simgesine tıklayın) <i class="fa fa-angle-right"></i> DNS
<br />
ESKİ İÇİN: Giriş yapın <i class="fa fa-angle-right"></i> Alan Adları <i class="fa fa-angle-right"></i> Bölge düzenleyici <i class="fa fa-angle-right"></i> (Alan adınızı seçin)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>Giriş yapın <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Yapıldı Kolay</a></td>
<td>Giriş yap <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Alan adınızı seçin)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>Giriş yap <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Yönet</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
<td>Giriş yap <i class="fa fa-angle-right"></i> Ağ <i class="fa fa-angle-right"></i> Alan Adları <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i> Daha Fazla <i class="fa fa-angle-right"></i> Alan Adını Yönet</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>Giriş Yap <i class="fa fa-angle-right"></i> Kart görünümünde, alan adınızda yönet'e tıklayın <i class="fa fa-angle-right"></i> Liste görünümünde,
dişli simgesine tıklayın <i class="fa fa-angle-right"></i> DNS ve Ad Sunucuları <i class="fa fa-angle-right"></i> DNS Kayıtları</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon0 class="fa fa-play-circle"></i> İzle</a>
</td>
<td>Giriş yap <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i> Yönet <i class="fa fa-angle-right"></i> (dişli simgesine tıklayın) <i class="fa fa-angle-right"></i> Sol taraftaki menüden DNS ve İsim Sunucuları'na tıklayın</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon1
<td>Giriş yap <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Alan Adları <i class="fa fa-angle-right"></i> Alan Adlarını Yönet <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon2
<td>Giriş Yap <i class="fa fa-angle-right"></i> Genel Bakış <i class="fa fa-angle-right"></i> Basit Düzenleyici <i class="fa fa-angle-right"></i> Kayıtları Yönet</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon3
<td>Giriş Yap <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i> Yönetim <i class="fa fa-angle-right"></i> Bölgeyi düzenleyin</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon4
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon5 class="fa fa-play-circle"></i> İzle</a>
</td>
<td>Giriş yap <i class="fa fa-angle-right"></i> Alan adlarımı yönet <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i> DNS'i yönet</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon6 Alan Adları</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon7 class="fa fa-play-circle"></i> İzle</a>
</td>
<td>Giriş yap <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i> DNS'i yapılandır</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon8
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon9 class="fa fa-play-circle"></i> İzle</a>
</td>
<td>Giriş Yap <i class="fa fa-angle-right"></i> Alan Adı Listesi <i class="fa fa-angle-right"></i> (Alan Adınızı Seçin) <i class="fa fa-angle-right"></i> Yönet <i class="fa fa-angle-right"></i> Gelişmiş DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>0
<td>Giriş Yap <i class="fa fa-angle-right"></i> (Alan Adınızı Seçin) <i class="fa fa-angle-right"></i> Netlify DNS Kurulumu</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>1 Çözümler</a></td>
<td>Giriş Yap <i class="fa fa-angle-right"></i> Hesap Yöneticisi <i class="fa fa-angle-right"></i> Alan Adlarım <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i> Yönet <i class="fa fa-angle-right"></i> Alan Adının Yönlendirildiği Yeri Değiştir <i class="fa fa-angle-right"></i> Gelişmiş DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>2
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>3 class="fa fa-play-circle"></i> İzle</a>
</td>
<td>Giriş Yap <i class="fa fa-angle-right"></i> Yönetilen Alan Adları <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i> DNS Ayarları</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>4
<td>Giriş Yap <i class="fa fa-angle-right"></i> Ana Menü <i class="fa fa-angle-right"></i> Ayarlar <i class="fa fa-angle-right"></i> Alan Adları <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i>
Gelişmiş Ayarlar <i class="fa fa-angle-right"></i> Özel Kayıtlar</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>5 Şimdi</a></td>
<td>"Şimdi" Komut Satırı Arayüzü Kullanımı <i class="fa fa-angle-right"></i> <code>Şimdi DNS Ekle [alan adı] '@' MX [kayıt değeri] [öncelik]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>6
<td>Giriş Yap <i class="fa fa-angle-right"></i> Alan Adları sayfası <i class="fa fa-angle-right"></i> (Alan adınızı seçin) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>7
<td>Giriş yap <i class="fa fa-angle-right"></i> Alan Adları sayfası <i class="fa fa-angle-right"></i> (<i class="fa fa-ellipsis-h"></i> simgesine tıklayın) <i class="fa fa-angle-right"></i> DNS Kayıtlarını Yönet'i seçin</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>8
<td>Giriş yap <i class="fa fa-angle-right"></i> Alan Adları <i class="fa fa-angle-right"></i> Alan Adlarım</td>
</tr>
<tr>
<td>Diğer</td>
<td>
<div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Önemli:</strong> Kayıt kuruluşunuzun adını burada göremiyor musunuz? İnternette "$REGISTRAR'da DNS kayıtları nasıl değiştirilir" araması yapın (örneğin, GoDaddy kullanıyorsanız "GoDaddy'de DNS kayıtları nasıl değiştirilir").</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Kayıt kuruluşunuzun DNS yönetim sayfasını (açtığınız diğer sekme) kullanarak aşağıdaki "MX" kayıtlarını ayarlayın:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Önemli:
</strong>
<span>
Başka MX kaydı ayarlanmamış olması gerektiğini unutmayın. Aşağıda gösterilen her iki kayıt da MUTLAKA mevcut olmalıdır. Yazım hatası olmadığından ve hem mx1 hem de mx2'nin doğru yazıldığından emin olun. Zaten mevcut MX kayıtları varsa, lütfen bunları tamamen silin.
"TTL" değerinin 3600 olması gerekmez, gerekirse daha düşük veya daha yüksek bir değer olabilir.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Öncelik</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx1.forwardemail.net</code></td>
</tr>
<tr>
<td><em>"@", "." veya boş</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx2.forwardemail.net</code></td>
</tr>
</tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Kayıt kuruluşunuzun DNS yönetim sayfasını (açtığınız diğer sekme) kullanarak aşağıdaki <strong class="notranslate">TXT</strong> kaydını ayarlayın:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Önemli:
</strong>
<span>
Ücretli bir plan kullanıyorsanız, bu adımı tamamen atlayıp beşinci adıma geçmelisiniz! Ücretli bir plan kullanmıyorsanız, yönlendirilen adresleriniz herkese açık olarak aranabilir olacaktır. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> bölümüne gidin ve isterseniz alan adınızı ücretli bir plana yükseltin. Ücretli planlar hakkında daha fazla bilgi edinmek isterseniz <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Fiyatlandırma</a> sayfamıza bakın. Aksi takdirde, aşağıda listelenen A Seçeneği ile F Seçeneği arasındaki bir veya daha fazla kombinasyonu seçmeye devam edebilirsiniz.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Seçenek A:
</strong>
<span>
Alan adınızdaki tüm e-postaları (örneğin, "all@example.com", "hello@example.com" vb.) belirli bir "user@gmail.com" adresine yönlendiriyorsanız:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
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
Yukarıdaki "Değer" sütunundaki değerleri kendi e-posta adresinizle değiştirdiğinizden emin olun. "TTL" değerinin 3600 olması gerekmez, gerekirse daha düşük veya daha yüksek bir değer olabilir. Daha düşük bir geçerlilik süresi ("TTL") değeri, DNS kayıtlarınızda yapılacak gelecekteki değişikliklerin internete daha hızlı yayılmasını sağlar; bunu, bellekte ne kadar süre (saniye cinsinden) önbelleğe alınacağı olarak düşünün. <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL</a> hakkında daha fazla bilgiyi Wikipedia'da bulabilirsiniz.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Seçenek B:
</strong>
<span>
Yalnızca tek bir e-posta adresini (örneğin, <code>hello@example.com</code> adresini <code>user@gmail.com</code> adresine yönlendirmeniz gerekiyorsa; bu, "hello+test@example.com" adresini de otomatik olarak "user+test@gmail.com" adresine yönlendirecektir):
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
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
Birden fazla e-posta iletiyorsanız, iletileri virgülle ayırmanız gerekir:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
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
Sınırsız sayıda e-posta yönlendirme ayarı yapabilirsiniz; tek bir satırda 255 karakteri aşmadığınızdan ve her satıra "forward-email=" ile başladığınızdan emin olun. Aşağıda bir örnek verilmiştir:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." veya boş</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." veya boş</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." veya boş</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." veya boş</em></td>
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
Küresel takma ad yönlendirmesi için <strong class="notranslate">TXT</strong> kaydınızda bir alan adı da belirtebilirsiniz (örneğin, "user@example.com", "user@example.net" adresine yönlendirilecektir):
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
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
E-postaları yönlendirmek için webhook'ları genel veya bireysel takma ad olarak bile kullanabilirsiniz. Aşağıdaki <a href="#do-you-support-webhooks" class="alert-link">Webhook'ları destekliyor musunuz</a> başlıklı örneğe ve webhook'larla ilgili tam bölüme bakın.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
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
Takma adları eşleştirmek ve e-postaları iletmek için değişiklikleri yönetmek amacıyla düzenli ifadeler ("regex") bile kullanabilirsiniz. Örnekleri ve aşağıdaki <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Düzenli ifadeleri veya düzenli ifadeleri destekliyor musunuz</a> başlıklı düzenli ifadeler bölümünün tamamını inceleyin.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>İkame içeren gelişmiş bir düzenli ifadeye mi ihtiyacınız var?</strong> Aşağıdaki <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Düzenli ifadeleri veya düzenli ifadeleri destekliyor musunuz?</a> başlıklı düzenli ifade örneklerine ve tam bölümüne bakın.
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Basit Örnek:</strong> `linus@example.com` veya `torvalds@example.com` adresine giden tüm e-postaların `user@gmail.com` adresine iletilmesini istiyorsam:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
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
Tümünü kapsayan yönlendirme kuralları, "düşüş" olarak da tanımlanabilir.
Bu, en az bir belirli yönlendirme kuralıyla eşleşen gelen e-postaların, tümünü kapsayan kural yerine kullanılacağı anlamına gelir.
Belirli kurallar, e-posta adreslerini ve düzenli ifadeleri içerir. <br /><br />
Örneğin:
<br />
<code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
<code>hello@example.com</code> adresine gönderilen e-postalar bu yapılandırmayla <code>second@gmail.com</code> adresine (tümünü yakala) **yönlendirilmeyecek** ve bunun yerine yalnızca <code>first@gmail.com</code> adresine teslim edilecektir.
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Kayıt kuruluşunuzun DNS yönetim sayfasını (açtığınız diğer sekme) kullanarak, ayrıca aşağıdaki <strong class="notranslate">TXT</strong> kaydını ayarlayın:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
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
Gmail (ör. Postaları Şu Adresten Gönder) veya G Suite kullanıyorsanız, yukarıdaki değere <code>include:_spf.google.com</code> eklemeniz gerekir, örneğin:
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
"v=spf1" ile benzer bir satırınız varsa, mevcut tüm "include:host.com" kayıtlarından hemen önce ve aynı satırdaki "-all" ifadesinden önce <code>include:spf.forwardemail.net</code> eklemeniz gerekir, örneğin:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
"-all" ve "~all" arasında bir fark olduğunu unutmayın. "-", eşleşme olmazsa SPF denetiminin BAŞARISIZ olması gerektiğini, "~" ise SPF denetiminin SOFTFAIL olması gerektiğini belirtir. Alan adı sahteciliğini önlemek için "-all" yaklaşımını kullanmanızı öneririz.
<br /><br />
E-posta gönderdiğiniz sunucunun (örneğin Outlook) SPF kaydını da eklemeniz gerekebilir.
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Kurulumu'nda bulunan "Kayıtları Doğrula" aracımızı kullanarak DNS kayıtlarınızı doğrulayın.

</li><li class="mb-2 mb-md-3 mb-lg-5">Çalıştığını onaylamak için bir test e-postası gönderin. DNS kayıtlarınızın yayılmasının biraz zaman alabileceğini unutmayın.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
İpucu:
</strong>
<span>
</span>
Test e-postaları almıyorsanız veya "Bu mesaja dikkat edin" yazan bir test e-postası alıyorsanız, sırasıyla <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Test e-postalarımı neden almıyorum</a> ve <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Gmail'de bana gönderilen test e-postaları neden "şüpheli" olarak görünüyor</a> sorularının yanıtlarına bakın.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Gmail'den "Postaları Şu Şekilde Gönder" özelliğini kullanmak istiyorsanız, <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">bu videoyu izlemeniz</a></strong> veya aşağıdaki <a href="#how-to-send-mail-as-using-gmail">How Gmail Kullanarak Postaları Şu Şekilde Gönderme</a> adımlarını izlemeniz gerekir.

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
İsteğe bağlı eklentiler aşağıda listelenmiştir. Bu eklentilerin tamamen isteğe bağlı olduğunu ve gerekli olmayabileceğini unutmayın. Gerekirse size en azından ek bilgi sağlamak istedik.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
İsteğe Bağlı Eklenti:
</strong>
<span>
Gmail kullanarak <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How: Postaları Farklı Gönder</a> özelliğini kullanıyorsanız, kendinizi bir izin listesine eklemek isteyebilirsiniz. Bu konu hakkında <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">Gmail'in bu talimatlarına</a> bakın.
</span>
</div>

### Gelişmiş yönlendirme için birden fazla MX değişimi ve sunucusunu kullanabilir miyim? {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Evet, ancak **DNS kayıtlarınızda yalnızca bir MX borsası listelenmelidir**.

Birden fazla MX değişimini yapılandırmanın bir yolu olarak "Öncelik"i kullanmaya çalışmayın.

Bunun yerine, mevcut MX borsanızı, eşleşmeyen tüm takma adlara ait postaları hizmetimizin borsalarına (`mx1.forwardemail.net` ve/veya `mx2.forwardemail.net`) iletecek şekilde yapılandırmanız gerekir.

Google Workspace kullanıyorsanız ve eşleşmeyen tüm takma adları hizmetimize iletmek istiyorsanız <https://support.google.com/a/answer/6297084>.'a bakın

Microsoft 365 (Outlook) kullanıyorsanız ve eşleşmeyen tüm takma adları hizmetimize iletmek istiyorsanız, <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> ve <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.'e bakın

### Tatil yanıtlayıcısını (ofis dışında otomatik yanıtlayıcı) nasıl ayarlarım? {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar bölümüne gidin ve tatil otomatik yanıtlayıcısını yapılandırmak istediğiniz takma adı oluşturun veya düzenleyin.

Başlangıç tarihi, bitiş tarihi, konu ve mesajı yapılandırma ve bunları istediğiniz zaman etkinleştirme veya devre dışı bırakma olanağına sahipsiniz:

* Düz metin konu ve mesaj şu anda desteklenmektedir (tüm HTML kodlarını kaldırmak için dahili olarak `striptags` paketini kullanıyoruz).
* Konu 100 karakterle sınırlıdır.
* Mesaj 1000 karakterle sınırlıdır.
* Kurulum, Giden SMTP yapılandırması gerektirir (örneğin, DKIM, DMARC ve Return-Path DNS kayıtlarını ayarlamanız gerekir).
* <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Ayarlar <i class="fa fa-angle-right"></i> Giden SMTP Yapılandırması'na gidin ve kurulum talimatlarını izleyin.
* Geçici yanıtlayıcı, genel vanity alan adlarında etkinleştirilemez (örneğin, [tek kullanımlık adresler](/disposable-addresses) desteklenmez).
* Tatil yanıtlayıcısı, joker karakterli/her şeyi kapsayan (`*`) takma adlar veya düzenli ifadeler için etkinleştirilemez.

`postfix` (örneğin `sieve` tatil filtresi uzantısını kullananlar) gibi posta sistemlerinin aksine – E-postayı İlet, DKIM imzanızı otomatik olarak ekler, tatil yanıtları gönderirken bağlantı sorunlarını (örneğin yaygın SSL/TLS bağlantı sorunları ve eski bakımlı sunucular nedeniyle) önler ve hatta tatil yanıtları için Açık WKD ve PGP şifrelemesini destekler.

<!--
* Kötüye kullanımı önlemek amacıyla, gönderilen her tatil yanıtlayıcı mesajı için 1 giden SMTP kredisi düşülecektir.
* Tüm ücretli hesaplar varsayılan olarak günlük 300 kredi içerir. Daha yüksek bir tutara ihtiyacınız varsa lütfen bizimle iletişime geçin.
-->

1. Her 4 günde bir [izin verilenler listesinde](#do-you-have-an-allowlist) göndericisine yalnızca bir kez e-posta gönderiyoruz (bu, Gmail'in davranışına benzer).

* Redis önbelleğimiz `alias_id` ve `sender` parmak izlerini kullanır; `alias_id` ise takma ad MongoDB kimliğidir ve `sender` ise Gönderen adresidir (izin verilenler listesindeyse) veya Gönderen adresindeki kök etki alanıdır (izin verilenler listesinde değilse). Kolaylık olması açısından, bu parmak izinin önbellekteki son kullanma tarihi 4 güne ayarlanmıştır.

* İzin listesinde olmayan gönderenler için Gönderen adresinde ayrıştırılan kök etki alanını kullanma yaklaşımımız, nispeten bilinmeyen gönderenlerin (örneğin kötü niyetli kişilerin) tatil yanıtlayıcı mesajlarını kötüye kullanmasını önler.

2. Yalnızca MAIL FROM ve/veya From boş olmadığında ve (büyük/küçük harfe duyarlı olmayan) [posta müdürü kullanıcı adı](#what-are-postmaster-addresses) (bir e-postadaki @ işaretinden önceki kısım) içermediğinde göndeririz.

3. Orijinal mesajda aşağıdaki başlıklardan herhangi biri varsa göndermiyoruz (büyük/küçük harfe duyarlı değil):

* `no`'e eşit olmayan bir değere sahip `auto-submitted` başlığı.
* `dr`, `autoreply`, `auto-reply`, `auto_reply` veya `all` değerine sahip `x-auto-response-suppress` başlığı.
* `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 veya `no`7 başlığı (değerden bağımsız olarak). * `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 veya `x-auto-response-suppress`3 değerine sahip `no`8 başlığı.

4. MAIL FROM veya From e-posta adresiniz `+donotreply`, `-donotreply`, `+noreply` veya `-noreply` ile bitiyorsa gönderim yapmayız.

5. Gönderen e-posta adresi kullanıcı adı kısmı `mdaemon` ise ve büyük/küçük harfe duyarlı olmayan `X-MDDSN-Message` başlığına sahipse göndermeyiz.

6. `multipart/report` başlığının büyük/küçük harfe duyarlı olmayan `content-type` başlığı varsa göndermiyoruz.

### {#how-do-i-set-up-spf-for-forward-email} E-postayı İletmek için SPF'yi nasıl ayarlarım?

Kayıt kuruluşunuzun DNS yönetim sayfasını kullanarak aşağıdaki <strong class="notranslate">TXT</strong> kaydını ayarlayın:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
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
Gmail (ör. Postaları Şu Adresten Gönder) veya G Suite kullanıyorsanız, yukarıdaki değere <code>include:_spf.google.com</code> eklemeniz gerekir, örneğin:
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
"v=spf1" ile benzer bir satırınız varsa, mevcut tüm "include:host.com" kayıtlarından hemen önce ve aynı satırdaki "-all" ifadesinden önce <code>include:spf.forwardemail.net</code> eklemeniz gerekir, örneğin:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
"-all" ve "~all" arasında bir fark olduğunu unutmayın. "-", eşleşme olmazsa SPF denetiminin BAŞARISIZ olması gerektiğini, "~" ise SPF denetiminin SOFTFAIL olması gerektiğini belirtir. Alan adı sahteciliğini önlemek için "-all" yaklaşımını kullanmanızı öneririz.
<br /><br />
E-posta gönderdiğiniz sunucunun (örneğin Outlook) SPF kaydını da eklemeniz gerekebilir.
</span>
</div>

### {#how-do-i-set-up-dkim-for-forward-email} E-postasını İletmek için DKIM'i nasıl ayarlarım?

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Ayarlar <i class="fa fa-angle-right"></i> Giden SMTP Yapılandırması'na gidin ve kurulum talimatlarını izleyin.

### {#how-do-i-set-up-dmarc-for-forward-email} E-postasını İletmek için DMARC'ı nasıl ayarlarım?

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Ayarlar <i class="fa fa-angle-right"></i> Giden SMTP Yapılandırması'na gidin ve kurulum talimatlarını izleyin.

### Kişilerimi nasıl bağlayabilir ve yapılandırabilirim? {#how-do-i-connect-and-configure-my-contacts}

**Kişilerinizi yapılandırmak için şu CardDAV URL'sini kullanın:** `https://carddav.forwardemail.net` (veya istemciniz izin veriyorsa yalnızca `carddav.forwardemail.net`)

### Takvimlerimi nasıl bağlayabilir ve yapılandırabilirim? {#how-do-i-connect-and-configure-my-calendars}

**Takviminizi yapılandırmak için şu CalDAV URL'sini kullanın:** `https://caldav.forwardemail.net` (veya istemciniz izin veriyorsa yalnızca `caldav.forwardemail.net`)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="E-posta Takvimini İletme CalDAV Thunderbird Örnek Kurulumu" />

### Daha fazla takvim nasıl eklerim ve mevcut takvimleri nasıl yönetirim? {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Ek takvimler eklemek isterseniz, `https://caldav.forwardemail.net/dav/principals/calendar-name` adlı yeni bir takvim URL'si eklemeniz yeterlidir (**`calendar-name`'i istediğiniz takvim adıyla değiştirdiğinizden emin olun**)

Bir takvimin adını ve rengini oluşturduktan sonra değiştirebilirsiniz; bunun için tercih ettiğiniz takvim uygulamasını (örneğin Apple Mail veya [Thunderbird](https://thunderbird.net)) kullanmanız yeterlidir.

### {#how-do-i-set-up-srs-for-forward-email} E-postasını İletmek için SRS'yi nasıl ayarlarım?

[Gönderen Yeniden Yazma Şeması](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS")'ı otomatik olarak yapılandırıyoruz; bunu kendiniz yapmanıza gerek yok.

### {#how-do-i-set-up-mta-sts-for-forward-email}} E-postayı İletmek için MTA-STS'yi nasıl ayarlarım?

Daha fazla bilgi için lütfen [MTA-STS bölümümüz](#do-you-support-mta-sts)'a bakın.

### E-posta adresime nasıl profil resmi eklerim? {#how-do-i-add-a-profile-picture-to-my-email-address}

Gmail kullanıyorsanız aşağıdaki adımları izleyin:

1. <https://google.com> adresine gidin ve tüm e-posta hesaplarınızdan çıkış yapın.
2. "Oturum Aç"a tıklayın ve açılır menüden "diğer hesap"a tıklayın.
3. "Başka bir hesap kullan"ı seçin.
4. "Hesap oluştur"u seçin.
5. "Bunun yerine mevcut e-posta adresimi kullan"ı seçin.
6. Özel alan adı e-posta adresinizi girin.
7. E-posta adresinize gönderilen doğrulama e-postasını alın.
8. Bu e-postadaki doğrulama kodunu girin.
9. Yeni Google hesabınız için profil bilgilerinizi doldurun.
10. Tüm Gizlilik ve Kullanım Şartları politikalarını kabul edin.
11. <https://google.com> adresine gidin ve sağ üst köşedeki profil simgenize ve "değiştir" düğmesine tıklayın.
12. Hesabınız için yeni bir fotoğraf veya avatar yükleyin.
13. Değişikliklerin uygulanması yaklaşık 1-2 saat sürecektir, ancak bazen çok hızlı olabilir.
14. Bir test e-postası gönderin; profil fotoğrafınız görünecektir.

## Gelişmiş Özellikler {#advanced-features}

### Pazarlama ile ilgili e-postalar için haber bültenlerini veya e-posta listelerini destekliyor musunuz? {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Evet, daha fazlasını <https://forwardemail.net/guides/newsletter-with-listmonk>. adresinden okuyabilirsiniz

IP itibarını korumak ve teslimatı garanti altına almak için Forward Email'in, **bülten onayı** için alan adı bazında manuel bir inceleme süreci uyguladığını lütfen unutmayın. Onay için <support@forwardemail.net> adresine e-posta gönderin veya bir [yardım talebi](https://forwardemail.net/help) adresi açın. Bu işlem genellikle 24 saatten kısa sürer ve çoğu istek 1-2 saat içinde karşılanır. Yakın gelecekte, ek spam kontrolleri ve uyarılarla bu süreci anında gerçekleştirmeyi hedefliyoruz. Bu süreç, e-postalarınızın gelen kutusuna ulaşmasını ve mesajlarınızın spam olarak işaretlenmemesini sağlar.

### {#do-you-support-sending-email-with-api} API'siyle e-posta göndermeyi destekliyor musunuz?

Evet, Mayıs 2023 itibarıyla tüm ücretli kullanıcılar için API ile e-posta göndermeyi eklenti olarak destekliyoruz.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Önemli:
</strong>
<span>
Lütfen <a href="/terms" class="alert-link" target="_blank">Şartlarımızı</a>, <a href="/privacy" class="alert-link" target="_blank">Gizlilik Politikamızı</a> ve <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Giden SMTP Sınırlamalarımızı</a> okuduğunuzdan emin olun; kullanımınız onay ve sözleşme olarak kabul edilir.
</span>
</div>

Seçenekler, örnekler ve daha fazla bilgi için lütfen API dokümantasyonumuzdaki [E-postalar](/email-api#outbound-emails) bölümümüze bakın.

API'miz ile giden e-posta gönderebilmek için [Güvenliğim](/my-account/security) altında bulunan API token'ınızı kullanmanız gerekmektedir.

### IMAP ile e-posta almayı destekliyor musunuz? {#do-you-support-receiving-email-with-imap}

Evet, 16 Ekim 2023 itibarıyla tüm ücretli kullanıcılar için eklenti olarak IMAP üzerinden e-posta almayı destekliyoruz. **Lütfen [Şifreli SQLite posta kutusu depolama özelliğimiz nasıl çalışır?](/blog/docs/best-quantum-safe-encrypted-email-service) hakkındaki ayrıntılı makalemizi okuyun**.

<div id="imap-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Önemli:
</strong>
<span>
Lütfen <a href="/terms" class="alert-link" target="_blank">Şartlarımızı</a> ve <a href="/privacy" class="alert-link" target="_blank">Gizlilik Politikamızı</a> okuduğunuzdan emin olun; kullanımınız onay ve sözleşme olarak kabul edilir.
</span>
</div>

1. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar (ör. <code><hello@example.com></code>) altında alan adınız için yeni bir takma ad oluşturun.

2. Yeni oluşturulan takma adın yanındaki <strong class="text-success"><i class="fa fa-key"></i>Şifre Oluştur</strong>'a tıklayın. Ekranda gösterilen oluşturulan şifreyi panonuza kopyalayın ve güvenli bir şekilde saklayın.

3. Tercih ettiğiniz e-posta uygulamasını kullanarak, yeni oluşturduğunuz takma adınızla bir hesap ekleyin veya yapılandırın (ör. <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
İpucu:
</strong>
<span><a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> veya <a href="/blog/open-source" class="alert-link" target="_blank">açık kaynaklı ve gizlilik odaklı bir alternatif</a>.</span>
</div>

4. IMAP sunucu adı istendiğinde `imap.forwardemail.net` girin

5. IMAP sunucu portu istendiğinde `993` (SSL/TLS) girin - gerekirse [alternatif IMAP bağlantı noktaları](/faq#what-are-your-imap-server-configuration-settings)'e bakın.
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
İpucu:
</strong>
<span>Thunderbird kullanıyorsanız, "Bağlantı güvenliği"nin "SSL/TLS" ve Kimlik Doğrulama yönteminin "Normal parola" olarak ayarlandığından emin olun.</span>
</div>

6. IMAP sunucusu parolası istendiğinde, yukarıdaki 2. adımda <strong class="text-success"><i class="fa fa-key"></i>Parola Oluştur</strong>'dan parolayı yapıştırın

7. **Ayarlarınızı kaydedin** – Sorun yaşıyorsanız lütfen <a href="/help">bizimle iletişime geçin</a>

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

### POP3'ü destekliyor musunuz? {#do-you-support-pop3}

Evet, 4 Aralık 2023 itibarıyla tüm ücretli kullanıcılar için [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) eklentisini destekliyoruz. **Lütfen [Şifreli SQLite posta kutusu depolama özelliğimiz nasıl çalışır?](/blog/docs/best-quantum-safe-encrypted-email-service) hakkındaki ayrıntılı makalemizi okuyun**.

<div id="pop3-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Önemli:
</strong>
<span>
Lütfen <a href="/terms" class="alert-link" target="_blank">Şartlarımızı</a> ve <a href="/privacy" class="alert-link" target="_blank">Gizlilik Politikamızı</a> okuduğunuzdan emin olun; kullanımınız onay ve sözleşme olarak kabul edilir.
</span>
</div>

1. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar (ör. <code><hello@example.com></code>) altında alan adınız için yeni bir takma ad oluşturun.

2. Yeni oluşturulan takma adın yanındaki <strong class="text-success"><i class="fa fa-key"></i>Şifre Oluştur</strong>'a tıklayın. Ekranda gösterilen oluşturulan şifreyi panonuza kopyalayın ve güvenli bir şekilde saklayın.

3. Tercih ettiğiniz e-posta uygulamasını kullanarak, yeni oluşturduğunuz takma adınızla bir hesap ekleyin veya yapılandırın (ör. <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
İpucu:
</strong>
<span><a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> veya <a href="/blog/open-source" class="alert-link" target="_blank">açık kaynaklı ve gizlilik odaklı bir alternatif</a>.</span>
</div>

4. POP3 sunucu adı istendiğinde `pop3.forwardemail.net` girin

5. POP3 sunucu portu istendiğinde `995` (SSL/TLS) girin - gerekirse [alternatif POP3 portları](/faq#what-are-your-pop3-server-configuration-settings)'e bakın.
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
İpucu:
</strong>
<span>Thunderbird kullanıyorsanız, "Bağlantı güvenliği"nin "SSL/TLS" ve Kimlik Doğrulama yönteminin "Normal parola" olarak ayarlandığından emin olun.</span>
</div>

6. POP3 sunucusu parolası istendiğinde, yukarıdaki 2. adımda <strong class="text-success"><i class="fa fa-key"></i>Parola Oluştur</strong>'dan parolayı yapıştırın

7. **Ayarlarınızı kaydedin** – Sorun yaşıyorsanız lütfen <a href="/help">bizimle iletişime geçin</a>

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

Evet, 5 Şubat 2024 itibarıyla bu özelliği ekledik. Sunucumuz `caldav.forwardemail.net` olup, <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">durum sayfamızdan</a> da izlenmektedir.

Hem IPv4 hem de IPv6'yı destekler ve `443` (HTTPS) portu üzerinden kullanılabilir.

| Giriş yapmak | Örnek | Tanım |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kullanıcı adı | `user@example.com` | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a>'nda bulunan bir takma adın e-posta adresi. |
| Şifre | `************************` | Takma ada özgü oluşturulmuş parola. |

Takvim desteğini kullanmak için **kullanıcı** <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a>'nda alan adı için var olan bir takma adın e-posta adresi olmalıdır ve **parola** takma ada özgü oluşturulmuş bir parola olmalıdır.

### Kişileri (CardDAV) destekliyor musunuz? {#do-you-support-contacts-carddav}

Evet, 12 Haziran 2025 itibarıyla bu özelliği ekledik. Sunucumuz `carddav.forwardemail.net` olup, <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">durum sayfamızdan</a> da izlenmektedir.

Hem IPv4 hem de IPv6'yı destekler ve `443` (HTTPS) portu üzerinden kullanılabilir.

| Giriş yapmak | Örnek | Tanım |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kullanıcı adı | `user@example.com` | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a>'nda bulunan bir takma adın e-posta adresi. |
| Şifre | `************************` | Takma ada özgü oluşturulmuş parola. |

Kişiler desteğini kullanabilmek için **kullanıcı** <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a>'nda bulunan bir takma adın e-posta adresi olmalıdır ve **şifre** takma ada özgü oluşturulmuş bir şifre olmalıdır.

### SMTP ile e-posta göndermeyi destekliyor musunuz? {#do-you-support-sending-email-with-smtp}

Evet, Mayıs 2023 itibarıyla tüm ücretli kullanıcılarımız için eklenti olarak SMTP ile e-posta göndermeyi destekliyoruz.

<div id="smtp-talimatları">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Önemli:
</strong>
<span>
Lütfen <a href="/terms" class="alert-link" target="_blank">Şartlarımızı</a>, <a href="/privacy" class="alert-link" target="_blank">Gizlilik Politikamızı</a> ve <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Giden SMTP Sınırlamalarımızı</a> okuduğunuzdan emin olun; kullanımınız onay ve sözleşme olarak kabul edilir.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Önemli:
</strong>
<span>
Gmail kullanıyorsanız, <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Gmail ile E-posta Gönderme kılavuzumuza</a> bakın. Geliştiriciyseniz, <a class="alert-link" href="/email-api#outbound-emails" target="_blank">e-posta API belgelerimize</a> bakın.
</span>
</div>

1. <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Ayarlar <i class="fa fa-angle-right"></i> Giden SMTP Yapılandırması'na gidin ve kurulum talimatlarını izleyin.

2. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar (ör. <code><hello@example.com></code>) altında alan adınız için yeni bir takma ad oluşturun.

3. Yeni oluşturulan takma adın yanındaki <strong class="text-success"><i class="fa fa-key"></i>Şifre Oluştur</strong>'a tıklayın. Ekranda gösterilen oluşturulan şifreyi panonuza kopyalayın ve güvenli bir şekilde saklayın.

4. Tercih ettiğiniz e-posta uygulamasını kullanarak, yeni oluşturduğunuz takma adınızla bir hesap ekleyin veya yapılandırın (ör. <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
İpucu:
</strong>
<span><a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> veya <a href="/blog/open-source" class="alert-link" target="_blank">açık kaynaklı ve gizlilik odaklı bir alternatif</a>.</span>
</div>

5. SMTP sunucu adı istendiğinde `smtp.forwardemail.net` girin

6. SMTP sunucu portu istendiğinde `465` (SSL/TLS) girin - gerekirse [alternatif SMTP bağlantı noktaları](/faq#what-are-your-smtp-server-configuration-settings)'e bakın.
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
İpucu:
</strong>
<span>Thunderbird kullanıyorsanız, "Bağlantı güvenliği"nin "SSL/TLS" ve Kimlik Doğrulama yönteminin "Normal parola" olarak ayarlandığından emin olun.</span>
</div>

7. SMTP sunucusu parolası istendiğinde, yukarıdaki 3. adımda <strong class="text-success"><i class="fa fa-key"></i>Parola Oluştur</strong>'dan parolayı yapıştırın

8. **Ayarlarınızı kaydedin ve ilk test e-postanızı gönderin** – sorun yaşıyorsanız lütfen <a href="/help">bizimle iletişime geçin</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Önemli:
</strong>
<span>
IP itibarını korumak ve teslimatı sağlamak için, giden SMTP onayı için alan adı bazında manuel bir inceleme sürecimiz olduğunu lütfen unutmayın. Bu süreç genellikle 24 saatten kısa sürer ve çoğu istek 1-2 saat içinde karşılanır. Yakın gelecekte, ek spam kontrolleri ve uyarılarla bu süreci anında gerçekleştirmeyi hedefliyoruz. Bu süreç, e-postalarınızın gelen kutusuna ulaşmasını ve mesajlarınızın spam olarak işaretlenmemesini sağlar.
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

### OpenPGP/MIME, uçtan uca şifreleme ("E2EE") ve Web Anahtar Dizini ("WKD")'ni destekliyor musunuz? {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Evet, [AçıkPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [uçtan uca şifreleme ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) ve [Web Anahtar Dizini ("WKD")](https://wiki.gnupg.org/WKD) kullanılarak genel anahtarların keşfedilmesini destekliyoruz. OpenPGP'yi [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) veya [kendi anahtarlarınızı kendiniz barındırın](https://wiki.gnupg.org/WKDHosting) kullanarak yapılandırabilirsiniz (bkz. [WKD sunucu kurulumu için bu özet](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* WKD aramaları, e-postaların zamanında teslim edilmesini sağlamak için 1 saat boyunca önbelleğe alınır → bu nedenle, WKD anahtarınızı ekler, değiştirir veya kaldırırsanız, önbelleği manuel olarak temizleyebilmemiz için lütfen e-posta adresinizi `support@forwardemail.net` adresine e-posta ile gönderin.
* Arayüzümüzde WKD araması veya yüklenmiş bir PGP anahtarı kullanılarak iletilen mesajlar için PGP şifrelemesini destekliyoruz.
* PGP onay kutusu etkin/işaretli olduğu sürece yüklenen anahtarlar geçerli olur.
* Web kancalarına gönderilen mesajlar şu anda PGP ile şifrelenmemektedir.
* Belirli bir yönlendirme adresiyle eşleşen birden fazla takma adınız varsa (örneğin, regex/joker karakter/tam kombinasyon) ve bunlardan birden fazlası yüklenmiş bir PGP anahtarı içeriyorsa ve PGP işaretliyse, size bir hata uyarı e-postası göndeririz ve mesajı yüklenen PGP anahtarınızla şifrelemeyiz. Bu çok nadirdir ve genellikle yalnızca karmaşık takma ad kurallarına sahip ileri düzey kullanıcılar için geçerlidir. * **Gönderenin DMARC reddetme politikası varsa, MX sunucularımız üzerinden e-posta yönlendirmelerinde PGP şifrelemesi uygulanmayacaktır. *Tüm* e-postalarda PGP şifrelemesi gerekiyorsa, IMAP hizmetimizi kullanmanızı ve gelen e-postalar için takma adınız olarak PGP anahtarınızı yapılandırmanızı öneririz.**

**Web Anahtar Dizini kurulumunuzu <https://wkd.chimbosonic.com/> (açık kaynak) veya <https://www.webkeydirectory.com/> (özel) konumunda doğrulayabilirsiniz.**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Otomatik Şifreleme:
</strong>
<span><a href="#do-you-support-sending-email-with-smtp" class="alert-link">Giden SMTP hizmetimizi</a> kullanıyor ve şifrelenmemiş mesajlar gönderiyorsanız, <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Anahtar Dizini ("WKD")</a> kullanarak alıcı bazında mesajları otomatik olarak şifrelemeye çalışacağız.</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Önemli:
</strong>
<span>
Özel alan adınız için OpenPGP'yi etkinleştirmek üzere aşağıdaki tüm adımları izlemelisiniz.
</span>
</div>

1. Aşağıda e-posta istemcinizin önerdiği eklentiyi indirin ve yükleyin:

| E-posta İstemcisi | Platform | Önerilen Eklenti | Notlar |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thunderbird | Masaüstü | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird'ün OpenPGP desteği yerleşiktir. |
| Gmail | Tarayıcı | [Mailvelope](https://mailvelope.com/) veya [FlowCrypt](https://flowcrypt.com/download) (özel lisans) | Gmail, OpenPGP'yi desteklemez, ancak açık kaynaklı [Mailvelope](https://mailvelope.com/) veya [FlowCrypt](https://flowcrypt.com/download) eklentisini indirebilirsiniz. |
| Apple Mail | macOS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Apple Mail OpenPGP'yi desteklemez, ancak açık kaynaklı eklenti [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)'ı indirebilirsiniz. |
| Apple Mail | iOS | [PGPro](https://github.com/opensourceios/PGPro/) veya [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (özel lisans) | Apple Mail, OpenPGP'yi desteklemez; ancak açık kaynaklı [PGPro](https://github.com/opensourceios/PGPro/) veya [FlowCrypt](https://flowcrypt.com/download) eklentisini indirebilirsiniz. |
| Görünüm | Pencereler | [gpg4win](https://www.gpg4win.de/index.html) | Outlook'un masaüstü e-posta istemcisi OpenPGP'yi desteklemez, ancak açık kaynaklı [gpg4win](https://www.gpg4win.de/index.html) eklentisini indirebilirsiniz. |
| Görünüm | Tarayıcı | [Mailvelope](https://mailvelope.com/) veya [FlowCrypt](https://flowcrypt.com/download) (özel lisans) | Outlook'un web tabanlı e-posta istemcisi OpenPGP'yi desteklemez, ancak açık kaynaklı [Mailvelope](https://mailvelope.com/) veya [FlowCrypt](https://flowcrypt.com/download) eklentisini indirebilirsiniz. |
| Android | Mobil | __HÜCRE_BAĞLANTISI_0__ veya __HÜCRE_BAĞLANTISI_1__ | [Android mail clients](/blog/open-source/android-email-clients), [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) ve [FairEmail](https://github.com/M66B/FairEmail) gibi eklentiler, açık kaynaklı [OpenKeychain](https://www.openkeychain.org/) eklentisini destekler. Alternatif olarak, açık kaynaklı (özel lisanslı) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) eklentisini kullanabilirsiniz. |
| Google Chrome | Tarayıcı | [Mailvelope](https://mailvelope.com/) veya [FlowCrypt](https://flowcrypt.com/download) (özel lisans) | Açık kaynaklı tarayıcı eklentisi [Mailvelope](https://mailvelope.com/) veya [FlowCrypt](https://flowcrypt.com/download)'i indirebilirsiniz. |
| Mozilla Firefox | Tarayıcı | [Mailvelope](https://mailvelope.com/) veya [FlowCrypt](https://flowcrypt.com/download) (özel lisans) | Açık kaynaklı tarayıcı eklentisi [Mailvelope](https://mailvelope.com/) veya [FlowCrypt](https://flowcrypt.com/download)'i indirebilirsiniz. |
| Microsoft Edge | Tarayıcı | [Mailvelope](https://mailvelope.com/) | Açık kaynaklı tarayıcı eklentisi [Mailvelope](https://mailvelope.com/)'ı indirebilirsiniz. |
| Cesur | Tarayıcı | [Mailvelope](https://mailvelope.com/) veya [FlowCrypt](https://flowcrypt.com/download) (özel lisans) | Açık kaynaklı tarayıcı eklentisi [Mailvelope](https://mailvelope.com/) veya [FlowCrypt](https://flowcrypt.com/download)'i indirebilirsiniz. |
| Balsa | Masaüstü | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | Balsa'nın OpenPGP desteği yerleşiktir. |
| KMail | Masaüstü | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | KMail'de OpenPGP desteği yerleşik olarak bulunmaktadır. |
| GNOME Evrimi | Masaüstü | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | GNOME Evolution'ın OpenPGP desteği yerleşiktir. |
| terminal | Masaüstü | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | Komut satırından yeni bir anahtar üretmek için açık kaynaklı [gpg command line tool](https://www.gnupg.org/download/) komutunu kullanabilirsiniz. |

2. Eklentiyi açın, genel anahtarınızı oluşturun ve e-posta istemcinizi onu kullanacak şekilde yapılandırın.

3. Genel anahtarınızı <https://keys.openpgp.org/upload>. adresine yükleyin

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
İpucu:
</strong>
<span>Anahtarınızı ileride yönetmek için <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> adresini ziyaret edebilirsiniz.</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
İsteğe Bağlı Eklenti:
</strong>
<span>
<a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">Şifreli depolama (IMAP/POP3)</a> hizmetimizi kullanıyorsanız ve (şifrelenmiş) SQLite veritabanınızda depolanan <i>tüm</i> e-postaların genel anahtarınızla şifrelenmesini istiyorsanız, <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar'a gidin (örneğin <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> OpenPGP'yi düzenleyin ve genel anahtarınızı yükleyin.
</span>
</div>

4. Alan adınıza yeni bir `CNAME` kaydı ekleyin (örneğin `example.com`):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
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
<span>Takma adınız <a class="alert-link" href="/disposable-addresses" target="_blank">özel/tek kullanımlık alan adlarımızı</a> (ör. <code>hideaddress.net</code>) kullanıyorsa, bu adımı atlayabilirsiniz.</span>
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

### MTA-STS'yi destekliyor musunuz? {#do-you-support-mta-sts}

Evet, 2 Mart 2023 itibarıyla [MTA-STS](https://www.hardenize.com/blog/mta-sts)'ı destekliyoruz. Alan adınızda etkinleştirmek isterseniz [bu şablon](https://github.com/jpawlowski/mta-sts.template)'i kullanabilirsiniz.

Yapılandırmamız GitHub'da <https://github.com/forwardemail/mta-sts.forwardemail.net>. adresinde herkese açık olarak bulunabilir

### Geçiş anahtarlarını ve WebAuthn'ı destekliyor musunuz? {#do-you-support-passkeys-and-webauthn}

Evet! 13 Aralık 2023 itibarıyla [yüksek talep nedeniyle](https://github.com/orgs/forwardemail/discussions/182) geçiş anahtarları için destek ekledik.

Parola ve iki faktörlü kimlik doğrulaması gerektirmeden güvenli bir şekilde oturum açmanızı sağlar.

Kimliğinizi dokunma, yüz tanıma, cihaz tabanlı şifre veya PIN ile doğrulayabilirsiniz.

Aynı anda 30'a kadar şifreyi yönetmenize olanak tanıyoruz, böylece tüm cihazlarınızdan kolayca giriş yapabilirsiniz.

Şifreler hakkında daha fazla bilgi edinmek için aşağıdaki bağlantılara bakabilirsiniz:

* [Uygulamalarınıza ve web sitelerinize şifrelerle giriş yapın](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [iPhone'da uygulamalara ve web sitelerine giriş yapmak için parolaları kullanın](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Geçiş anahtarları hakkındaki Wikipedia makalesi](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### E-posta en iyi uygulamalarını destekliyor musunuz? {#do-you-support-email-best-practices}

Evet. Tüm planlarımızda SPF, DKIM, DMARC, ARC ve SRS için yerleşik desteğimiz mevcut. Ayrıca, mükemmelliği ve yüksek teslimat oranını sağlamak için bu spesifikasyonların orijinal yazarları ve diğer e-posta uzmanlarıyla kapsamlı bir şekilde çalıştık.

### Geri tepme web kancalarını destekliyor musunuz? {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
İpucu:
</strong>
E-posta webhook'ları hakkında dokümanlar mı arıyorsunuz? Daha fazla bilgi için <a href="/faq#do-you-support-webhooks" class="alert-link">Webhook'ları destekliyor musunuz?</a> bölümüne bakın.
<span>
</span>
</div>

Evet, 14 Ağustos 2024 itibarıyla bu özelliği ekledik. Artık Hesabım → Alan Adları → Ayarlar → Geri Dönen Webhook URL'sine gidip, giden SMTP e-postaları geri döndüğünde `POST` isteği göndereceğimiz bir `http://` veya `https://` URL'si yapılandırabilirsiniz.

Bu, giden SMTP'nizi yönetmeniz ve izlemeniz için kullanışlıdır; ayrıca aboneleri yönetmek, abonelikten çıkmak ve geri dönüşler olduğunda bunları tespit etmek için kullanılabilir.

Bounce webhook yükleri şu özelliklere sahip bir JSON olarak gönderilir:

* `email_id` (Dize) - Hesabım → E-postalar'daki bir e-postaya karşılık gelen e-posta kimliği (giden SMTP)
* `list_id` (Dize) - Varsa, orijinal giden e-postadaki `List-ID` başlık değeri (büyük/küçük harfe duyarlı değil)
* `list_unsubscribe` (Dize) - Varsa, orijinal giden e-postadaki `List-Unsubscribe` başlık değeri (büyük/küçük harfe duyarlı değil)
* `feedback_id` (Dize) - Varsa, orijinal giden e-postadaki `Feedback-ID` başlık değeri (büyük/küçük harfe duyarlı değil)
* `recipient` (Dize) - Geri dönen veya hata veren alıcının e-posta adresi
* `message` (Dize) - Geri dönen ileti için ayrıntılı bir hata mesajı
* `response` (Dize) - SMTP yanıtı mesaj
* `list_id`0 (Sayı) - ayrıştırılmış SMTP yanıt kodu
* `list_id`1 (Dize) - yanıt kodu güvenilir bir kaynaktan geliyorsa, bu değer kök etki alanı adıyla doldurulur (ör. `list_id`2 veya `list_id`3)
* `list_id`4 (Nesne) - geri dönme ve reddetme durumunu ayrıntılı olarak açıklayan aşağıdaki özellikleri içeren bir nesne
* `list_id`5 (Dize) - geri dönme eylemi (ör. `list_id`6)
* `list_id`7 (Dize) - geri dönme nedeni (ör. `list_id`8)
* `list_id`9 (Dize) - geri dönme kategorisi (ör. `List-ID`0)
* `List-ID`1 (Sayı) - geri dönüş durum kodu (ör. `List-ID`2)
* `List-ID`3 (Dize) - yanıt mesajından geri dönüş kodu (ör. `List-ID`4)
* `List-ID`5 (Sayı) - varsa ayrıştırılmış satır numarası, `List-ID`6 (ör. `List-ID`7)
* `List-ID`8 (Nesne) - giden e-posta için anahtar değer başlık çifti
* `List-ID`9 (Dize) - geri dönüş hatasının oluştuğu tarih için biçimlendirilmiş `list_unsubscribe`0

Örneğin:

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

İşte geri dönen webhook'larla ilgili birkaç ek not:

* Webhook yükü `list_id`, `list_unsubscribe` veya `feedback_id` değerini içeriyorsa, gerekirse `recipient` değerini listeden kaldırmak için uygun işlemi yapmalısınız.
* `bounce.category` değeri `"block"`, `"recipient"`, `"spam"` veya `"virus"` ise, kullanıcıyı mutlaka listeden kaldırmalısınız.
* Webhook yüklerini doğrulamanız gerekiyorsa (sunucumuzdan gerçekten geldiklerinden emin olmak için), [ters arama kullanarak uzak istemci IP adresini istemci ana bilgisayar adını çözün](https://nodejs.org/api/dns.html#dnspromisesreverseip) değerini kullanabilirsiniz; `list_unsubscribe`0 olmalıdır.
* IP'yi `list_unsubscribe`1 ile de karşılaştırabilirsiniz.
* Webhook anahtarınızı almak için Hesabım → Alan Adları → Ayarlar → Webhook İmza Yükü Doğrulama Anahtarı'na gidin. * Güvenlik nedeniyle bu anahtarı istediğiniz zaman döndürebilirsiniz.
* Webhook isteğimizdeki `list_unsubscribe`2 değerini, bu anahtarı kullanarak hesaplanan gövde değeriyle hesaplayın ve karşılaştırın. Bunun nasıl yapılacağına dair bir örnek `list_unsubscribe`3 adresinde mevcuttur.
* Daha fazla bilgi için <`list_unsubscribe`4 adresindeki tartışmaya bakın.
* Webhook uç noktanızın `list_unsubscribe`6 durum koduyla yanıt vermesi için `list_unsubscribe`5 saniyeye kadar bekleyeceğiz ve `list_unsubscribe`7 saniyeye kadar tekrar deneyeceğiz.
* Bir istek göndermeye çalışırken geri dönen webhook URL'nizde bir hata tespit edersek, size haftada bir nezaket e-postası göndereceğiz.

### Webhook'ları destekliyor musunuz? {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
İpucu:
</strong>
Geri dönen web kancalarıyla ilgili belgeler mi arıyorsunuz? Daha fazla bilgi için <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Geri dönen web kancalarını destekliyor musunuz?</a> bölümüne bakın.
<span>
</span>
</div>

Evet, 15 Mayıs 2020 itibarıyla bu özelliği ekledik. Herhangi bir alıcıda yaptığınız gibi webhook(lar) ekleyebilirsiniz! Lütfen webhook URL'sinde "http" veya "https" protokolünün ön ekinin bulunduğundan emin olun.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Gelişmiş Gizlilik Koruması:
</strong>
<span>
Ücretli bir plandaysanız (gelişmiş gizlilik koruması sunar), lütfen <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a>'na gidin ve webhook'larınızı yapılandırmak için alan adınızın yanındaki "Takma Adlar"a tıklayın. Ücretli planlar hakkında daha fazla bilgi edinmek isterseniz <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Fiyatlandırma</a> sayfamıza bakın. Aksi takdirde aşağıdaki talimatları izlemeye devam edebilirsiniz.
</span>
</div>

Ücretsiz plandaysanız, aşağıda gösterildiği gibi yeni bir DNS <strong class="notranslate">TXT</strong> kaydı eklemeniz yeterlidir:

Örneğin, `alias@example.com`'a giden tüm e-postaların yeni bir [istek kutusu](https://requestbin.com/r/en8pfhdgcculn?inspect) test uç noktasına iletilmesini istiyorsam:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

Ya da belki `example.com`'a giden tüm e-postaların bu uç noktaya iletilmesini istiyorsunuz:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

**Webhook'larla ilgili ek notlar şunlardır:**

* Webhook yüklerini doğrulamanız gerekiyorsa (sunucumuzdan gerçekten geldiklerinden emin olmak için), [ters arama kullanarak uzak istemci IP adresini istemci ana bilgisayar adını çözün](https://nodejs.org/api/dns.html#dnspromisesreverseip) kullanabilirsiniz; `mx1.forwardemail.net` veya `mx2.forwardemail.net` olmalıdır.
* IP'yi [yayınlanan IP adreslerimiz](#what-are-your-servers-ip-addresses) ile de karşılaştırabilirsiniz.
* Ücretli bir plandaysanız, webhook anahtarınızı almak için Hesabım → Alan Adları → Ayarlar → Webhook İmza Yükü Doğrulama Anahtarı'na gidin.
* Güvenlik nedeniyle bu anahtarı istediğiniz zaman değiştirebilirsiniz.
* Webhook isteğimizdeki `X-Webhook-Signature` değerini hesaplayın ve bu anahtarı kullanarak hesaplanan gövde değeriyle karşılaştırın. Bunun nasıl yapılacağına dair bir örnek [bu Stack Overflow gönderisi](https://stackoverflow.com/a/68885281) adresinde mevcuttur.
* Daha fazla bilgi için <https://github.com/forwardemail/free-email-forwarding/issues/235> adresindeki tartışmaya bakın. * Bir webhook, `200` durum koduyla yanıt vermezse, yanıtını [hata günlüğü oluşturuldu](#do-you-store-error-logs)'de saklayacağız; bu, hata ayıklama için kullanışlıdır.
* Webhook HTTP istekleri, her SMTP bağlantı denemesinde en fazla 3 kez yeniden denenir ve uç nokta POST isteği başına en fazla 60 saniyelik bir zaman aşımı olur. **Bunun yalnızca 3 kez yeniden denendiği anlamına gelmediğini unutmayın**, aslında 3. başarısız HTTP POST isteği denemesinden sonra 421 SMTP kodu göndererek (gönderene daha sonra yeniden denemesini belirten) zaman içinde sürekli olarak yeniden denenir. Bu, e-postanın 200 durum koduna ulaşılana kadar günlerce sürekli olarak yeniden deneneceği anlamına gelir.
* [süper ajanın yeniden deneme yöntemi](https://ladjs.github.io/superagent/#retrying-requests)'da kullanılan varsayılan durum ve hata kodlarına göre otomatik olarak yeniden deneyeceğiz (bakımcıyız).
* Kaynak tasarrufu sağlamak ve yanıt süresini hızlandırmak için aynı uç noktaya yapılan webhook HTTP isteklerini (birden fazla istek yerine) tek bir istekte gruplandırıyoruz. Örneğin, <webhook1@example.com>, <webhook2@example.com> ve <webhook3@example.com> adreslerine bir e-posta gönderirseniz ve bunların tümü aynı *tam* uç nokta URL'sine ulaşacak şekilde yapılandırılmışsa, yalnızca bir istek yapılır. Kesin eşitlikle tam uç nokta eşleşmesine göre gruplandırırız.
* Mesajı JSON uyumlu bir nesneye ayrıştırmak için `mx1.forwardemail.net`0 kütüphanesinin "simpleParser" yöntemini kullandığımızı unutmayın.
* Dize olarak ham e-posta değeri "raw" özelliği olarak verilir.
* Kimlik doğrulama sonuçları "dkim", "spf", "arc", "dmarc" ve "bimi" özellikleri olarak verilir.
* Ayrıştırılan e-posta başlıkları "headers" özelliği olarak verilir; ancak daha kolay yineleme ve ayrıştırma için "headerLines" özelliğini de kullanabileceğinizi unutmayın. * Bu webhook için gruplandırılmış alıcılar birlikte gruplandırılır ve "recipients" özelliğiyle verilir.
* SMTP oturum bilgileri "session" özelliğiyle verilir. Bu, mesajın göndereni, mesajın varış saati, HELO ve istemci ana bilgisayar adı hakkında bilgi içerir. `mx1.forwardemail.net`1 olarak istemci ana bilgisayar adı değeri, tam alan adıdır (ters PTR aramasından) veya köşeli parantez içine alınmış `mx1.forwardemail.net`2'dir (örneğin, `mx1.forwardemail.net`3).
* `mx1.forwardemail.net`4 değerini almanın hızlı bir yoluna ihtiyacınız varsa, `mx1.forwardemail.net`5 değerini kullanabilirsiniz (aşağıdaki örneğe bakın). `mx1.forwardemail.net`6 başlığı, mesaj için orijinal alıcıyla (maskeli yönlendirmeden önce) hata ayıklama yapmak amacıyla mesajlara eklediğimiz bir başlıktır. * `mx1.forwardemail.net`7 ve/veya `mx1.forwardemail.net`8 özelliklerini yük gövdesinden kaldırmanız gerekiyorsa, `mx1.forwardemail.net`9, `mx2.forwardemail.net`0 veya `mx2.forwardemail.net`1'i webhook uç noktanıza sorgu dizesi parametresi olarak ekleyin (ör. `mx2.forwardemail.net`2).
* Ekler varsa, bunlar Arabellek değerleriyle `mx2.forwardemail.net`3 Dizisine eklenir. Bunları JavaScript ile aşağıdaki gibi bir yaklaşım kullanarak içeriğe geri dönüştürebilirsiniz:

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
İpucu:
</strong>
İletilen e-postalardan gelen webhook isteğinin nasıl göründüğünü merak mı ediyorsunuz? Aşağıda sizin için bir örnek ekledik!
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

### Düzenli ifadeleri veya regex'i destekliyor musunuz? {#do-you-support-regular-expressions-or-regex}

Evet, 27 Eylül 2021 itibarıyla bu özelliği ekledik. Takma adları eşleştirmek ve değiştirmeler yapmak için düzenli ifadeler ("regex") yazmanız yeterli.

Düzenli ifade destekli takma adlar, `/` ile başlayıp `/` ile biten ve alıcıları e-posta adresleri veya web kancaları olan takma adlardır. Alıcılar ayrıca düzenli ifade değiştirme desteği de içerebilir (örneğin, `$1`, `$2`).

`i` ve `g` olmak üzere iki düzenli ifade işaretini destekliyoruz. Büyük/küçük harfe duyarlı olmayan `i` işareti kalıcı bir varsayılan değerdir ve her zaman uygulanır. `g` genel işaretini, `/` sonuna `/g` ekleyerek ekleyebilirsiniz.

Ayrıca, regex desteğimizle alıcı kısmı için <a href="#can-i-disable-specific-aliases">disabled takma ad özelliğimizi</a> de desteklediğimizi unutmayın.

Düzenli ifadeler <a href="/disposable-addresses" target="_blank">küresel vanity etki alanlarında</a> desteklenmez (çünkü bu bir güvenlik açığı olabilir).

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Gelişmiş Gizlilik Koruması:
</strong>
<span>
Ücretli bir plandaysanız (gelişmiş gizlilik koruması sunar), lütfen <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a>'na gidin ve düzenli ifadeleri yapılandırmak için alan adınızın yanındaki "Takma Adlar"a tıklayın. Ücretli planlar hakkında daha fazla bilgi edinmek isterseniz <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Fiyatlandırma</a> sayfamıza bakın. Aksi takdirde aşağıdaki talimatları izlemeye devam edebilirsiniz.
</span>
</div>

Ücretsiz plandaysanız, aşağıda verilen örneklerden bir veya daha fazlasını kullanarak yeni bir DNS <strong class="notranslate">TXT</strong> kaydı eklemeniz yeterlidir:

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Basit Örnek:</strong> `linus@example.com` veya `torvalds@example.com` adresine giden tüm e-postaların `user@gmail.com` adresine iletilmesini istiyorsam:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Ad Soyad Değiştirme Örneği:</strong> Tüm şirket e-posta adreslerinizin `firstname.lastname@example.com` düzeninde olduğunu varsayalım. `firstname.lastname@example.com` düzenine giden tüm e-postaların, değiştirme desteğiyle `firstname.lastname@company.com`'ye iletilmesini istiyorsam (<a href="https://regexr.com/66hnu" class="alert-link">RegExr'de testi görüntüle</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Artı Simgesi Filtreleme Değiştirme Örneği:</strong> `info@example.com` veya `support@example.com` adresine giden tüm e-postaların sırasıyla `user+info@gmail.com` veya `user+support@gmail.com` adresine iletilmesini istiyorsam (değiştirme desteğiyle) (<a href="https://regexr.com/66ho7" class="alert-link">RegExr'de testi görüntüle</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Webhook Sorgu Dizisi Değiştirme Örneği:</strong> Belki de `example.com` adresine giden tüm e-postaların bir <a href="#do-you-support-webhooks" class="alert-link">webhook</a> adresine gitmesini ve e-posta adresinin kullanıcı adı kısmının değeri olan "to" dinamik sorgu dizisi anahtarına sahip olmasını istiyorsunuz (<a href="https://regexr.com/66ho4" class="alert-link">RegExr'de testi görüntüle</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Sessiz reddetme örneği:</strong> Belirli bir desene uyan tüm e-postaların devre dışı bırakılmasını ve `250` durum koduyla (bkz. <a href="#can-i-disable-specific-aliases" class="alert-link">Belirli takma adları devre dışı bırakabilir miyim</a>) sessizce reddedilmesini istiyorsanız, aynı yaklaşımı tek bir ünlem işareti "!" ile kullanın. Bu, gönderene mesajın başarıyla iletildiğini ancak aslında hiçbir yere gitmediğini (örneğin, kara delik veya `/dev/null`) belirtir.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Yumuşak reddetme örneği:</strong> Belirli bir desenle eşleşen tüm e-postaların devre dışı bırakılmasını ve `421` durum koduyla yumuşak reddedilmesini istiyorsanız (bkz. <a href="#can-i-disable-specific-aliases" class="alert-link">Belirli takma adları devre dışı bırakabilir miyim</a>), aynı yaklaşımı çift ünlem işareti "!!" kullanarak kullanın. Bu, gönderene e-postasını yeniden denemesini bildirir ve bu takma ada gönderilen e-postalar yaklaşık 5 gün boyunca yeniden denenir ve ardından kalıcı olarak reddedilir.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Zorunlu reddetme örneği:</strong> Belirli bir desenle eşleşen tüm e-postaların devre dışı bırakılmasını ve `550` durum koduyla kalıcı olarak reddedilmesini istiyorsanız (bkz. <a href="#can-i-disable-specific-aliases" class="alert-link">Belirli takma adları devre dışı bırakabilir miyim</a>), aynı yaklaşımı üçlü ünlem işareti "!!!" ile kullanın. Bu, gönderene kalıcı bir hata olduğunu ve e-postaların yeniden denenmeyeceğini, bu takma ad için reddedileceğini belirtir.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
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
Düzenli ifadenin nasıl yazılacağını mı merak ediyorsunuz veya değiştirdiğiniz ifadeyi test etmeniz mi gerekiyor? Ücretsiz düzenli ifade test web sitesi <a href="https://regexr.com" class="alert-link">RegExr</a>'e <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>. adresinden ulaşabilirsiniz.
<span>
</span>
</div>

### Giden SMTP sınırlarınız nelerdir? {#what-are-your-outbound-smtp-limits}

Kullanıcı ve alan adlarını günde 300 giden SMTP mesajıyla sınırlıyoruz. Bu, bir takvim ayında ortalama 9000'den fazla e-posta anlamına gelir. Bu miktarı aşmanız gerekiyorsa veya sürekli olarak büyük e-postalarınız varsa, lütfen [bize Ulaşın](https://forwardemail.net/help) değerini girin.

### SMTP'yi etkinleştirmek için onaya ihtiyacım var mı? {#do-i-need-approval-to-enable-smtp}

Evet, lütfen IP itibarını korumak ve teslimatı garanti altına almak için Forward Email'in, giden SMTP onayı için alan adı bazında manuel bir inceleme süreci uyguladığını unutmayın. Onay için <support@forwardemail.net> adresine e-posta gönderin veya [yardım talebi](https://forwardemail.net/help) adresini açın. Bu işlem genellikle 24 saatten kısa sürer ve çoğu istek 1-2 saat içinde karşılanır. Yakın gelecekte, ek spam kontrolleri ve uyarılarla bu süreci anında gerçekleştirmeyi hedefliyoruz. Bu süreç, e-postalarınızın gelen kutusuna ulaşmasını ve mesajlarınızın spam olarak işaretlenmemesini sağlar.

### SMTP sunucunuzun yapılandırma ayarları nelerdir? {#what-are-your-smtp-server-configuration-settings}

Sunucumuz `smtp.forwardemail.net` olup ayrıca <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">durum sayfamızdan</a> izlenmektedir.

Hem IPv4 hem de IPv6'yı destekler ve SSL/TLS için `465` ve `2465`, TLS için ise `587`, `2587`, `2525` ve `25` portları üzerinden kullanılabilir (STARTTLS).

| Protokol | Ana bilgisayar adı | Limanlar | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **Tercih Edilen** | `smtp.forwardemail.net` | `465`, `2465` | :beyaz_onay_işareti: | :beyaz_onay_işareti: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :beyaz_onay_işareti: | :beyaz_onay_işareti: |

| Giriş yapmak | Örnek | Tanım |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kullanıcı adı | `user@example.com` | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a>'nda bulunan bir takma adın e-posta adresi. |
| Şifre | `************************` | Takma ada özgü oluşturulmuş parola. |

SMTP ile giden e-posta göndermek için **SMTP kullanıcısı** <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a>'nda bulunan bir takma adın e-posta adresi olmalıdır ve **SMTP parolası** takma ada özgü oluşturulmuş bir parola olmalıdır.

Adım adım talimatlar için lütfen [SMTP ile e-posta göndermeyi destekliyor musunuz?](#do-you-support-sending-email-with-smtp)'a bakın.

### IMAP sunucunuzun yapılandırma ayarları nelerdir? {#what-are-your-imap-server-configuration-settings}

Sunucumuz `imap.forwardemail.net` olup ayrıca <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">durum sayfamızdan</a> izlenmektedir.

Hem IPv4 hem de IPv6'yı destekler ve SSL/TLS için `993` ve `2993` portları üzerinden kullanılabilir.

| Protokol | Ana bilgisayar adı | Limanlar | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Tercih Edilen** | `imap.forwardemail.net` | `993`, `2993` | :beyaz_onay_işareti: | :beyaz_onay_işareti: |

| Giriş yapmak | Örnek | Tanım |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kullanıcı adı | `user@example.com` | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a>'nda bulunan bir takma adın e-posta adresi. |
| Şifre | `************************` | Takma ada özgü oluşturulmuş parola. |

IMAP'e bağlanmak için **IMAP kullanıcısı** <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a>'nda bulunan bir takma adın e-posta adresi olmalıdır ve **IMAP parolası** takma adlara özgü oluşturulmuş bir parola olmalıdır.

Adım adım talimatlar için lütfen [IMAP ile e-posta almayı destekliyor musunuz?](#do-you-support-receiving-email-with-imap)'a bakın.

### POP3 sunucu yapılandırma ayarlarınız nelerdir? {#what-are-your-pop3-server-configuration-settings}

Sunucumuz `pop3.forwardemail.net` olup ayrıca <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">durum sayfamızdan</a> izlenmektedir.

Hem IPv4 hem de IPv6'yı destekler ve SSL/TLS için `995` ve `2995` portları üzerinden kullanılabilir.

| Protokol | Ana bilgisayar adı | Limanlar | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Tercih Edilen** | `pop3.forwardemail.net` | `995`, `2995` | :beyaz_onay_işareti: | :beyaz_onay_işareti: |

| Giriş yapmak | Örnek | Tanım |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kullanıcı adı | `user@example.com` | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a>'nda bulunan bir takma adın e-posta adresi. |
| Şifre | `************************` | Takma ada özgü oluşturulmuş parola. |

POP3'e bağlanmak için **POP3 kullanıcısı** <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a>'nda bulunan bir takma adın e-posta adresi olmalıdır ve **IMAP parolası** takma adlara özgü oluşturulmuş bir parola olmalıdır.

Adım adım talimatlar için lütfen [POP3'ü destekliyor musunuz?](#do-you-support-pop3)'a bakın.

### Sonek SMTP Röle Yapılandırması {#postfix-smtp-relay-configuration}

Postfix'i, e-postaları Forward Email'in SMTP sunucuları üzerinden iletecek şekilde yapılandırabilirsiniz. Bu, e-posta göndermesi gereken sunucu uygulamaları için kullanışlıdır.

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

#### Kurulumu {#installation}

1. Sunucunuza Postfix'i yükleyin:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Kurulum sırasında yapılandırma türü sorulduğunda "İnternet Sitesi"ni seçin.

#### Yapılandırması {#configuration}

1. Ana Postfix yapılandırma dosyasını düzenleyin:

```bash
sudo nano /etc/postfix/main.cf
```

2. Bu ayarları ekleyin veya değiştirin:

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. SASL parola dosyasını oluşturun:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. İletme E-postası kimlik bilgilerinizi ekleyin:

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. Şifre dosyasını güvenli hale getirin ve karıştırın:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Postfix'i yeniden başlatın:

```bash
sudo systemctl restart postfix
```

#### {#testing} test ediliyor

Yapılandırmanızı test etmek için bir test e-postası gönderin:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## Güvenlik {#security}

### Gelişmiş Sunucu Güçlendirme Teknikleri {#advanced-server-hardening-techniques}

> \[!TIP]
> Güvenlik altyapımız hakkında daha fazla bilgi edinmek için [Güvenlik sayfamız](/security) adresini ziyaret edin.

Forward Email, altyapımızın ve verilerinizin güvenliğini sağlamak için çok sayıda sunucu güçlendirme tekniği uygular:

1. **Ağ Güvenliği**:
* Katı kurallara sahip IP tabloları güvenlik duvarı
* Kaba kuvvet koruması için Fail2ban
* Düzenli güvenlik denetimleri ve sızma testleri
* Yalnızca VPN üzerinden yönetici erişimi

2. **Sistem Güçlendirme**:
* Minimum paket kurulumu
* Düzenli güvenlik güncellemeleri
* SELinux zorlama modunda
* Kök SSH erişimi devre dışı bırakıldı
* Yalnızca anahtar tabanlı kimlik doğrulama

3. **Uygulama Güvenliği**:
* İçerik Güvenlik Politikası (CSP) başlıkları
* HTTPS Sıkı Aktarım Güvenliği (HSTS)
* XSS koruma başlıkları
* Çerçeve seçenekleri ve yönlendiren politika başlıkları
* Düzenli bağımlılık denetimleri

4. **Veri Koruması**:
* LUKS ile tam disk şifreleme
* Güvenli anahtar yönetimi
* Şifreleme ile düzenli yedeklemeler
* Veri minimizasyon uygulamaları

5. **İzleme ve Müdahale**:
* Gerçek zamanlı saldırı tespiti
* Otomatik güvenlik taraması
* Merkezi kayıt ve analiz
* Olay müdahale prosedürleri

> \[!IMPORTANT]
> Güvenlik uygulamalarımız, ortaya çıkan tehdit ve güvenlik açıklarını ele almak için sürekli olarak güncellenmektedir.

> \[!TIP]
> Maksimum güvenlik için, OpenPGP aracılığıyla uçtan uca şifreleme hizmetimizi kullanmanızı öneririz.

### SOC 2 veya ISO 27001 sertifikalarınız var mı? {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> E-posta İletme, sektör standartlarına uygunluğu sağlamak için sertifikalı alt işlemciler tarafından sağlanan altyapı üzerinde çalışır.

Forward Email, doğrudan SOC 2 Tip II veya ISO 27001 sertifikalarına sahip değildir. Ancak hizmet, sertifikalı alt işlemciler tarafından sağlanan altyapı üzerinde çalışır:

* **DigitalOcean**: SOC 2 Tip II ve SOC 3 Tip II sertifikalı (Schellman & Company LLC tarafından denetlenmiştir), birden fazla veri merkezinde ISO 27001 sertifikalıdır. Ayrıntılar: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: SOC 2+ (HIPAA) sertifikalı, ISO/IEC sertifikaları: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Ayrıntılar: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: SOC 2 uyumlu (sertifika almak için doğrudan DataPacket ile iletişime geçin), kurumsal düzeyde altyapı sağlayıcısı (Denver konumu). Ayrıntılar: <https://www.datapacket.com/datacenters/denver>

Forward Email, güvenlik denetimleri için sektördeki en iyi uygulamaları takip eder ve bağımsız güvenlik araştırmacılarıyla düzenli olarak iletişim kurar. Kaynak: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### E-posta yönlendirme için TLS şifrelemesi kullanıyor musunuz? {#do-you-use-tls-encryption-for-email-forwarding}

Evet. Forward Email, tüm bağlantılar (HTTPS, SMTP, IMAP, POP3) için TLS 1.2+ standardını sıkı bir şekilde uygular ve gelişmiş TLS desteği için MTA-STS'yi kullanır. Uygulama şunları içerir:

* Tüm e-posta bağlantıları için TLS 1.2+ uygulaması
* Mükemmel ileri gizlilik için ECDHE (Eliptik Eğri Diffie-Hellman Geçici) anahtar değişimi
* Düzenli güvenlik güncellemeleri ile modern şifre paketleri
* Gelişmiş performans ve güvenlik için HTTP/2 desteği
* Başlıca tarayıcılarda ön yüklemeli HSTS (HTTP Sıkı Taşıma Güvenliği)
* Sıkı TLS uygulaması için **MTA-STS (Posta Aktarım Aracısı Sıkı Taşıma Güvenliği)**

Kaynak: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STS Uygulaması**: Forward Email, kod tabanında sıkı MTA-STS uygulamasını uygular. TLS hataları oluştuğunda ve MTA-STS uygulandığında, sistem e-postaların güvenli olmayan bir şekilde iletilmesini önlemek için 421 SMTP durum kodu döndürür. Uygulama ayrıntıları:

* TLS hata tespiti: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* E-posta gönderme yardımcı programında MTA-STS uygulaması: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Üçüncü taraf doğrulaması: <https://www.hardenize.com/report/forwardemail.net/1750312779> tüm TLS ve taşıma güvenlik önlemleri için "İyi" derecelendirmelerini gösterir.

### E-posta kimlik doğrulama başlıklarını koruyor musunuz? {#do-you-preserve-email-authentication-headers}

Evet. Forward Email, e-posta kimlik doğrulama başlıklarını kapsamlı bir şekilde uygular ve korur:

* **SPF (Gönderen Politika Çerçevesi)**: Doğru şekilde uygulanmış ve korunmuştur
* **DKIM (Alan Anahtarlarıyla Tanımlanmış Posta)**: Doğru anahtar yönetimiyle tam destek
* **DMARC**: SPF veya DKIM doğrulamasında başarısız olan e-postalar için politika uygulaması
* **ARC**: Açıkça belirtilmemiş olsa da, hizmetin mükemmel uyumluluk puanları kapsamlı kimlik doğrulama başlığı işlemeyi önermektedir

Kaynak: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Doğrulama: Internet.nl Posta Testi, özellikle "SPF, DKIM ve DMARC" uygulaması için 100/100 puan gösteriyor. Hardenize değerlendirmesi, SPF ve DMARC için "İyi" derecelendirmelerini doğruluyor: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Orijinal e-posta başlıklarını koruyor ve sahteciliği engelliyor musunuz? {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> E-posta İletme, e-posta kötüye kullanımını önlemek için gelişmiş sahteciliğe karşı koruma sağlar.

Forward Email, MX kod tabanı aracılığıyla kapsamlı bir sahteciliğe karşı koruma uygularken orijinal e-posta başlıklarını korur:

* **Başlık Koruma**: İletim sırasında orijinal kimlik doğrulama başlıkları korunur.
* **Sahtecilik Önleme**: DMARC politika uygulaması, SPF veya DKIM doğrulamasında başarısız olan e-postaları reddederek başlık sahteciliğini önler.
* **Başlık Enjeksiyonu Önleme**: striptags kütüphanesi kullanılarak giriş doğrulama ve temizleme
* **Gelişmiş Koruma**: Sahtecilik algılama, kimliğe bürünme önleme ve kullanıcı bildirim sistemleriyle gelişmiş kimlik avı algılama

**MX Uygulama Ayrıntıları**: Temel e-posta işleme mantığı, özellikle MX sunucu kod tabanı tarafından işlenir:

* Ana MX veri işleyicisi: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Keyfi e-posta filtreleme (sahtekarlığa karşı koruma): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

`isArbitrary` yardımcısı, alan adı taklitlerinin, engellenen ifadelerin ve çeşitli kimlik avı kalıplarının tespiti de dahil olmak üzere gelişmiş kimlik sahteciliği önleme kurallarını uygular.

Kaynak: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### Spam ve kötüye kullanıma karşı nasıl korunuyorsunuz? {#how-do-you-protect-against-spam-and-abuse}

Forward Email kapsamlı çok katmanlı koruma sağlar:

* **Hız Sınırlaması**: Kimlik doğrulama girişimlerine, API uç noktalarına ve SMTP bağlantılarına uygulanır
* **Kaynak İzolasyonu**: Yüksek hacimli kullanıcıların etkisini önlemek için kullanıcılar arasında
* **DDoS Koruması**: DataPacket Shield sistemi ve Cloudflare aracılığıyla çok katmanlı koruma
* **Otomatik Ölçeklendirme**: Talebe göre dinamik kaynak ayarlaması
* **Kötüye Kullanım Önleme**: Kullanıcıya özel kötüye kullanım önleme kontrolleri ve kötü amaçlı içerik için karma tabanlı engelleme
* **E-posta Kimlik Doğrulaması**: Gelişmiş kimlik avı algılama özelliğine sahip SPF, DKIM, DMARC protokolleri

Kaynaklar:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (DDoS koruma ayrıntıları)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### E-posta içeriğini {#do-you-store-email-content-on-disk}} diskinde saklıyor musunuz?

> \[!IMPORTANT]
> E-postayı İlet, e-posta içeriğinin diske yazılmasını engelleyen sıfır bilgi mimarisini kullanır.

* **Sıfır Bilgi Mimarisi**: Tek tek şifrelenmiş SQLite posta kutuları, Forward Email'in e-posta içeriğine erişemeyeceği anlamına gelir.
* **Bellek İçi İşleme**: E-posta işleme tamamen bellekte gerçekleşir ve disk depolamasından kaçınılır.
* **İçerik Kaydı Yok**: "E-posta içeriğini veya meta verilerini diske kaydetmiyoruz veya depolamıyoruz"
* **Korumalı Şifreleme**: Şifreleme anahtarları asla diskte düz metin olarak depolanmaz.

**MX Kod Tabanı Kanıtı**: MX sunucusu, içeriği diske yazmadan e-postaları tamamen bellekte işler. Ana e-posta işleme işleyicisi bu bellek içi yaklaşımı gösterir: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Kaynaklar:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Özet)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Sıfır bilgi ayrıntıları)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Korumalı şifreleme)

### Sistem çökmeleri sırasında e-posta içeriği açığa çıkabilir mi? {#can-email-content-be-exposed-during-system-crashes}

Hayır. Forward Email, çökme kaynaklı veri ifşasına karşı kapsamlı güvenlik önlemleri uygular:

* **Çekirdek Dökümleri Devre Dışı**: Çökmeler sırasında belleğin ifşa edilmesini önler
* **Takas Belleği Devre Dışı**: Takas dosyalarından hassas verilerin çıkarılmasını önlemek için tamamen devre dışı
* **Bellek İçi Mimari**: E-posta içeriği, işlem sırasında yalnızca geçici bellekte bulunur
* **Şifreleme Anahtarı Koruması**: Anahtarlar asla diskte düz metin olarak saklanmaz
* **Fiziksel Güvenlik**: LUKS v2 şifreli diskler, verilere fiziksel erişimi engeller
* **USB Depolama Devre Dışı**: Yetkisiz veri çıkarılmasını önler

**Sistem Sorunları için Hata İşleme**: Forward Email, herhangi bir veritabanı bağlantı sorunu, DNS ağı/engelleme listesi sorunu veya yukarı akış bağlantı sorunu ortaya çıkarsa sistemin 421 SMTP durum kodlarını döndürerek e-postaların kaybolmasını veya açığa çıkmasını önlemek için `isCodeBug` ve `isTimeoutError` yardımcı işlevlerini kullanır.

Uygulama detayları:

* Hata sınıflandırması: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* MX işlemede zaman aşımı hatası işleme: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Kaynak: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### E-posta altyapınıza kimler erişebilir? {#who-has-access-to-your-email-infrastructure}

Forward Email, sıkı 2FA gereklilikleriyle minimum 2-3 kişilik mühendislik ekibinin erişimi için kapsamlı erişim kontrolleri uygular:

* **Rol Tabanlı Erişim Kontrolü**: Kaynak tabanlı izinlere sahip ekip hesapları için
* **En Az Ayrıcalık İlkesi**: Tüm sistemlerde uygulanır
* **Görevlerin Ayrımı**: Operasyonel roller arasında
* **Kullanıcı Yönetimi**: Ayrı yetkilere sahip dağıtım ve devops kullanıcılarını ayırın
* **Kök Oturum Açma Devre Dışı Bırakıldı**: Doğru şekilde kimliği doğrulanmış hesaplar üzerinden erişimi zorunlu kılar
* **Sıkı 2FA**: MiTM saldırıları riski nedeniyle SMS tabanlı 2FA yok - yalnızca uygulama tabanlı veya donanım belirteçleri
* **Kapsamlı Denetim Günlüğü**: Hassas veri düzenlemesiyle
* **Otomatik Anomali Algılama**: Olağandışı erişim kalıpları için
* **Düzenli Güvenlik İncelemeleri**: Erişim günlüklerinin
* **Kötü Amaçlı Saldırı Önleme**: USB depolama devre dışı bırakıldı ve diğer fiziksel güvenlik önlemleri

Kaynaklar:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Yetkilendirme Kontrolleri)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Ağ Güvenliği)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Kötü amaçlı hizmetçi saldırılarının önlenmesi)

### Hangi altyapı sağlayıcılarını kullanıyorsunuz? {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> E-postayı İlet, kapsamlı uyumluluk sertifikalarına sahip birden fazla altyapı alt işlemcisi kullanır.

Ayrıntılı bilgilere GDPR uyumluluk sayfamızdan ulaşabilirsiniz: <https://forwardemail.net/gdpr>

**Birincil Altyapı Alt İşlemcileri:**

| Sağlayıcı | Veri Gizliliği Çerçevesi Sertifikalı | GDPR Uyumluluk Sayfası |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **Cloudflare** | ✅ Evet | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **VeriPaketi** | ❌ Hayır | <https://www.datapacket.com/gizlilik-politikasi> |
| **DijitalOkyanus** | ❌ Hayır | <https://www.digitalocean.com/legal/gdpr> |
| **Vultr** | ❌ Hayır | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**Ayrıntılı Sertifikalar:**

**DijitalOkyanus**

* SOC 2 Tip II ve SOC 3 Tip II (Schellman & Company LLC tarafından denetlenmiştir)
* Birden fazla veri merkezinde ISO 27001 sertifikalı
* PCI-DSS uyumlu
* CSA STAR Seviye 1 sertifikalı
* APEC CBPR PRP sertifikalı
* Ayrıntılar: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* SOC 2+ (HIPAA) sertifikalı
* PCI Merchant uyumlu
* CSA STAR Seviye 1 sertifikalı
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Ayrıntılar: <https://www.vultr.com/legal/compliance/>

**VeriPaketi**

* SOC 2 uyumlu (sertifika almak için doğrudan DataPacket ile iletişime geçin)
* Kurumsal düzeyde altyapı (Denver lokasyonu)
* Shield siber güvenlik paketi aracılığıyla DDoS koruması
* 7/24 teknik destek
* 58 veri merkezinde küresel ağ
* Ayrıntılar: <https://www.datapacket.com/datacenters/denver>

**Ödeme İşlemcileri:**

* **Stripe**: Veri Gizliliği Çerçevesi sertifikalı - <https://stripe.com/legal/privacy-center>
* **PayPal**: DPF sertifikalı değil - <https://www.paypal.com/uk/legalhub/privacy-full>

### Veri İşleme Sözleşmesi (DPA) sunuyor musunuz? {#do-you-offer-a-data-processing-agreement-dpa}

Evet, Forward Email, kurumsal sözleşmemizle birlikte imzalanabilen kapsamlı bir Veri İşleme Sözleşmesi (DPA) sunmaktadır. DPA'mızın bir kopyasına şu adresten ulaşabilirsiniz: <https://forwardemail.net/dpa>

**DPA Ayrıntıları:**

* GDPR uyumluluğunu ve AB-ABD/İsviçre-ABD Gizlilik Kalkanı çerçevelerini kapsar
* Hizmet Şartlarımızı kabul ettiğinizde otomatik olarak kabul edilir
* Standart DPA için ayrı bir imza gerekmez
* Kurumsal Lisans aracılığıyla özel DPA düzenlemeleri mevcuttur

**GDPR Uyumluluk Çerçevesi:**
Veri Koruma Politikamız, GDPR uyumluluğunun yanı sıra uluslararası veri aktarım gerekliliklerini de ayrıntılı olarak açıklamaktadır. Ayrıntılı bilgiye şu adresten ulaşabilirsiniz: <https://forwardemail.net/gdpr>

Özel DPA şartlarına veya belirli sözleşme düzenlemelerine ihtiyaç duyan kurumsal müşteriler için bu, **Kurumsal Lisans (ayda 250 ABD Doları)** programımız aracılığıyla karşılanabilir.

### Veri ihlali bildirimlerini nasıl ele alıyorsunuz? {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Email'in sıfır bilgi mimarisi, ihlal etkisini önemli ölçüde azaltır.

* **Sınırlı Veri Açığa Çıkarımı**: Sıfır bilgi mimarisi nedeniyle şifrelenmiş e-posta içeriğine erişilemez
* **Minimum Veri Toplama**: Güvenlik için yalnızca temel abone bilgileri ve sınırlı IP günlükleri
* **Alt İşlemci Çerçeveleri**: DigitalOcean ve Vultr, GDPR uyumlu olay müdahale prosedürlerini sürdürmektedir

**GDPR Temsilci Bilgileri:**
Forward Email, 27. Madde uyarınca GDPR temsilcileri atadı:

**AB Temsilcisi:**
Osano International Compliance Services Limited
ATTN: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**Birleşik Krallık Temsilcisi:**
Osano UK Compliance LTD
ATTN: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

Belirli ihlal bildirimi SLA'larına ihtiyaç duyan kurumsal müşteriler için bunlar **Kurumsal Lisans** sözleşmesinin bir parçası olarak görüşülmelidir.

Kaynaklar:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### {#do-you-offer-a-test-environment}} adlı bir test ortamı sunuyor musunuz?

Forward Email'in teknik dokümanlarında özel bir deneme ortamı modu açıkça tanımlanmamıştır. Ancak, olası test yaklaşımları şunlardır:

* **Kendi Kendine Barındırma Seçeneği**: Test ortamları oluşturmak için kapsamlı kendi kendine barındırma yetenekleri
* **API Arayüzü**: Yapılandırmaların programlı olarak test edilmesi potansiyeli
* **Açık Kaynak**: %100 açık kaynaklı kod, müşterilerin yönlendirme mantığını incelemesine olanak tanır
* **Birden Çok Alan Adı**: Birden çok alan adı desteği, test alanı oluşturulmasını sağlayabilir

Resmi deneme ortamı yeteneklerine ihtiyaç duyan kurumsal müşteriler için bu konu **Kurumsal Lisans** düzenlemesinin bir parçası olarak görüşülmelidir.

Kaynak: <https://github.com/forwardemail/forwardemail.net> (Geliştirme ortamı ayrıntıları)

### İzleme ve uyarı araçları sağlıyor musunuz? {#do-you-provide-monitoring-and-alerting-tools}

Forward Email, bazı sınırlamalarla gerçek zamanlı izleme sağlar:

**Mevcut:**

* **Gerçek Zamanlı Teslimat İzleme**: Büyük e-posta sağlayıcıları için herkese açık performans ölçümleri
* **Otomatik Uyarı**: Teslimat süreleri 10 saniyeyi aştığında mühendislik ekibine uyarı gönderilir
* **Şeffaf İzleme**: %100 açık kaynaklı izleme sistemleri
* **Altyapı İzleme**: Otomatik anormallik tespiti ve kapsamlı denetim kaydı

**Sınırlamalar:**

* Müşteriye yönelik web kancaları veya API tabanlı teslimat durumu bildirimleri açıkça belgelenmemiştir

Ayrıntılı teslimat durumu web kancaları veya özel izleme entegrasyonlarına ihtiyaç duyan kurumsal müşteriler için bu özellikler **Kurumsal Lisans** düzenlemeleri aracılığıyla sağlanabilir.

Kaynaklar:

* <https://forwardemail.net> (Gerçek zamanlı izleme ekranı)
* <https://github.com/forwardemail/forwardemail.net> (İzleme uygulaması)

### Yüksek kullanılabilirliği nasıl sağlarsınız? {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> E-postayı İlet, birden fazla altyapı sağlayıcısı arasında kapsamlı yedeklilik sağlar.

* **Dağıtık Altyapı**: Coğrafi bölgelerde birden fazla sağlayıcı (DigitalOcean, Vultr, DataPacket)
* **Coğrafi Yük Dengeleme**: Otomatik yük devretme özellikli Cloudflare tabanlı coğrafi konumlu yük dengeleme
* **Otomatik Ölçekleme**: Talebe göre dinamik kaynak ayarlama
* **Çok Katmanlı DDoS Koruması**: DataPacket Shield sistemi ve Cloudflare aracılığıyla
* **Sunucu Yedekliliği**: Otomatik yük devretme özellikli bölge başına birden fazla sunucu
* **Veritabanı Çoğaltma**: Birden fazla konumda gerçek zamanlı veri senkronizasyonu
* **İzleme ve Uyarı**: Otomatik olay müdahalesi ile 7/24 izleme

**Çalışma Süresi Taahhüdü**: <https://forwardemail.net> konumunda şeffaf izleme ile %99,9+ hizmet kullanılabilirliği

Kaynaklar:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Ulusal Savunma Yetkilendirme Yasası'nın (NDAA) 889. Bölümü'ne uygun musunuz? {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> E-posta İletme, altyapı ortaklarının dikkatli bir şekilde seçilmesi sayesinde 889. Bölüm ile tamamen uyumludur.

Evet, E-posta İletme **Bölüm 889'a uygundur**. Ulusal Savunma Yetkilendirme Yasası'nın (NDAA) 889. Bölümü, devlet kurumlarının belirli şirketlerin (Huawei, ZTE, Hikvision, Dahua ve Hytera) telekomünikasyon ve video gözetim ekipmanlarını kullanan kuruluşları kullanmasını veya bu kuruluşlarla sözleşme yapmasını yasaklamaktadır.

**Forward Email, Bölüm 889 Uyumluluğunu Nasıl Sağlar:**

Forward Email, yalnızca iki önemli altyapı sağlayıcısına güvenmektedir ve bunların hiçbiri 889. Bölümde yasaklanmış ekipmanı kullanmamaktadır:

1. **Cloudflare**: Ağ hizmetleri ve e-posta güvenliği için birincil ortağımız
2. **DataPacket**: Sunucu altyapısı için birincil sağlayıcımız (sadece Arista Networks ve Cisco ekipmanlarını kullanarak)
3. **Yedekleme Sağlayıcıları**: Yedekleme sağlayıcılarımız Digital Ocean ve Vultr'ın ayrıca 889. Bölüm'e uyumlu olduğu yazılı olarak onaylanmıştır.

**Cloudflare'in Taahhüdü**: Cloudflare, Üçüncü Taraf Davranış Kuralları'nda açıkça, 889. Bölüm'de yasaklanmış hiçbir kuruluştan telekomünikasyon ekipmanı, video gözetim ürünleri veya hizmetleri kullanmadığını belirtmektedir.

**Hükümet Kullanım Örneği**: **ABD Deniz Harp Okulu** güvenli e-posta yönlendirme ihtiyaçları için Forward Email'i seçtiğinde ve federal uyumluluk standartlarımızın belgelenmesini gerektirdiğinde, Bölüm 889 uyumluluğumuz doğrulandı.

Daha geniş federal düzenlemeler de dahil olmak üzere hükümet uyumluluk çerçevemiz hakkında eksiksiz ayrıntılar için kapsamlı vaka çalışmamızı okuyun: [Federal Hükümet E-posta Hizmeti Bölüm 889 Uyumlu](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## Sistem ve Teknik Ayrıntılar {#system-and-technical-details}

### E-postaları ve içeriklerini saklıyor musunuz? {#do-you-store-emails-and-their-contents}

Hayır, [hata istisnası](#do-you-store-error-logs) ve [giden SMTP](#do-you-support-sending-email-with-smtp) ile diske yazmıyoruz veya günlükleri saklamıyoruz ([Gizlilik Politikası](/privacy)'mize bakın).

Her şey bellek içinde ve [kaynak kodumuz GitHub'da](https://github.com/forwardemail)'da yapılır.

### E-posta yönlendirme sisteminiz nasıl çalışır? {#how-does-your-email-forwarding-system-work}

E-posta, [SMTP protokolü](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) protokolüne dayanır. Bu protokol, bir sunucuya gönderilen komutlardan oluşur (çoğunlukla 25 numaralı portta çalışır). İlk bağlantı kurulur, ardından gönderen e-postanın kimden geldiğini ("MAIL FROM"), ardından nereye gideceğini ("RCPT TO") ve son olarak e-postanın başlıklarını ve gövdesini ("DATA") belirtir. E-posta yönlendirme sistemimizin akışı, aşağıda her SMTP protokol komutuna göre açıklanmıştır:

* İlk Bağlantı (komut adı yok, örneğin `telnet example.com 25`) - Bu ilk bağlantıdır. [izin listesi](#do-you-have-an-allowlist)'imizde olmayan göndericileri [inkar listesi](#do-you-have-a-denylist)'mizle karşılaştırırız. Son olarak, bir gönderici izin verilenler listemizde değilse, [gri listeye alınmış](#do-you-have-a-greylist)'te olup olmadığını kontrol ederiz.

* `HELO` - Bu, gönderenin tam alan adını (FQDN), IP adresini veya posta işleyicisi adını belirlemek için bir karşılama mesajıdır. Bu değer sahte olabilir, bu nedenle bu verilere güvenmiyoruz ve bunun yerine bağlantının IP adresinin ters ana bilgisayar adı aramasını kullanıyoruz.

* `MAIL FROM` - Bu, e-postanın zarf posta adresini belirtir. Bir değer girilirse, geçerli bir RFC 5322 e-posta adresi olmalıdır. Boş değerlere izin verilir. Burada [geri saçılmayı kontrol edin](#how-do-you-protect-against-backscatter) kullanıyoruz ve ayrıca MAIL FROM'u [inkar listesi](#do-you-have-a-denylist) ile karşılaştırıyoruz. Son olarak, izin verilenler listesinde olmayan gönderenleri hız sınırlaması açısından kontrol ediyoruz (daha fazla bilgi için [Hız Sınırlaması](#do-you-have-rate-limiting) ve [izin listesi](#do-you-have-an-allowlist) bölümlerine bakın).

* `RCPT TO` - Bu, e-postanın alıcısını/alıcılarını belirtir. Bunlar geçerli RFC 5322 e-posta adresleri olmalıdır. Mesaj başına en fazla 50 zarf alıcısına izin veriyoruz (bu, bir e-postanın "Kime" başlığından farklıdır). Ayrıca, SRS alan adımızla sahteciliğe karşı koruma sağlamak için burada geçerli bir [Gönderen Yeniden Yazma Şeması](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") adresi olup olmadığını kontrol ediyoruz.

* `DATA` - Bu, e-postaları işleyen hizmetimizin temel parçasıdır. Daha fazla bilgi için aşağıdaki [Bir e-postayı yönlendirmek için nasıl işlersiniz?](#how-do-you-process-an-email-for-forwarding) bölümüne bakın.

### {#how-do-you-process-an-email-for-forwarding} e-postasını iletmek için nasıl işlem yapıyorsunuz?

Bu bölüm, yukarıdaki [E-posta yönlendirme sisteminiz nasıl çalışır?](#how-does-your-email-forwarding-system-work) bölümünde yer alan SMTP protokol komutu `DATA` ile ilgili sürecimizi açıklamaktadır; bu, bir e-postanın başlıklarını, gövdesini, güvenliğini nasıl işlediğimizi, nereye teslim edilmesi gerektiğini nasıl belirlediğimizi ve bağlantıları nasıl ele aldığımızı gösterir.

1. Mesajın maksimum boyutu 50mb'ı aşarsa 552 hata koduyla reddedilir.

2. Mesajda "Kimden" başlığı yoksa veya "Kimden" başlığındaki değerlerden herhangi biri geçerli RFC 5322 e-posta adresleri değilse, 550 hata koduyla reddedilir.

3. Mesajda 25'ten fazla "Alındı" başlığı varsa, yönlendirme döngüsüne takıldığı tespit edilir ve 550 hata koduyla reddedilir.

4. E-postanın parmak izini kullanarak ([Parmak izi](#how-do-you-determine-an-email-fingerprint) bölümüne bakın), mesajın 5 günden uzun süredir yeniden denenip denenmediğini ([varsayılan son ek davranışı](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime) ile eşleşiyorsa) kontrol edeceğiz ve eğer öyleyse, 550 hata koduyla reddedilecektir.

5. E-postayı [Spam Tarayıcı](https://spamscanner.net) kullanarak tarayarak elde ettiğimiz sonuçları bellekte saklıyoruz.

6. Spam Tarayıcısından herhangi bir keyfi sonuç çıkarsa, 554 hata koduyla reddedilir. Keyfi sonuçlar, bu yazının yazıldığı tarihte yalnızca GTUBE testini içerir. Daha fazla bilgi için <https://spamassassin.apache.org/gtube/>'a bakın.

7. Hata ayıklama ve kötüye kullanımı önleme amacıyla mesaja aşağıdaki başlıkları ekleyeceğiz:

* `Received` - Kaynak IP ve ana bilgisayar, iletim türü, TLS bağlantı bilgileri, tarih/saat ve alıcı bilgilerini içeren bu standart Alınan başlığını ekliyoruz.
* `X-Original-To` - Mesajın orijinal alıcısı:
* Bu, bir e-postanın başlangıçta nereye teslim edildiğini belirlemek için kullanışlıdır ("Alındı" başlığına ek olarak).
* Bu, IMAP ve/veya maskeli yönlendirme sırasında (gizliliği korumak amacıyla) alıcı başına eklenir.
* `X-Forward-Email-Website` - <https://forwardemail.net> web sitemize bir bağlantı içerir.
* `X-Forward-Email-Version` - Kod tabanımızın `package.json` sürümünden güncel [SemVer](https://semver.org/) sürümü.
* `X-Forward-Email-Session-ID` - Hata ayıklama amacıyla kullanılan bir oturum kimliği değeri (yalnızca üretim dışı ortamlarda geçerlidir). * `X-Forward-Email-Sender` - orijinal zarf MAIL FROM adresini (boş değilse), ters PTR istemci FQDN'sini (varsa) ve gönderenin IP adresini içeren virgülle ayrılmış bir liste.
* `X-Forward-Email-ID` - bu yalnızca giden SMTP için geçerlidir ve Hesabım → E-postalar'da saklanan e-posta kimliğiyle ilişkilidir.
* `X-Original-To`0 - `X-Original-To`1 değerine sahiptir.
* `X-Original-To`2 - `X-Original-To`3 değerine sahiptir.
* `X-Original-To`4 - `X-Original-To`5 değerine sahiptir.

8. Daha sonra [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) ve [DMARC](https://en.wikipedia.org/wiki/DMARC) için mesajı kontrol ediyoruz.

* İleti DMARC'ı geçemediyse ve etki alanında bir reddetme politikası varsa (ör. `p=reject` [DMARC politikasındaydı](https://wikipedia.org/wiki/DMARC)), 550 hata koduyla reddedilir. Genellikle bir etki alanı için bir DMARC politikası, `_dmarc` alt etki alanı <strong class="notranslate">TXT</strong> kaydında bulunabilir (ör. `dig _dmarc.example.com txt`).
* İleti SPF'yi geçemediyse ve etki alanında bir kesin başarısızlık politikası varsa (ör. `-all`, SPF politikasında yer alırken `~all` veya hiç politika yoksa), 550 hata koduyla reddedilir. Genellikle bir etki alanı için bir SPF politikası, kök etki alanının <strong class="notranslate">TXT</strong> kaydında bulunabilir (ör. `dig example.com txt`). SPF ile ilgili [Gmail'de olduğu gibi posta gönderme](#can-i-send-mail-as-in-gmail-with-this) hakkında daha fazla bilgi için bu bölüme bakın.

9. Şimdi, yukarıdaki [E-posta yönlendirme sisteminiz nasıl çalışır?](#how-does-your-email-forwarding-system-work) bölümünde `RCPT TO` komutundan toplanan mesajın alıcılarını işliyoruz. Her alıcı için aşağıdaki işlemleri gerçekleştiriyoruz:

* Alan adının <strong class="notranslate">TXT</strong> kayıtlarını ararız (`@` sembolünden sonraki kısım, örneğin e-posta adresi `test@example.com` ise `example.com`). Örneğin, alan adı `example.com` ise, `dig example.com txt` gibi bir DNS araması yaparız.
* `forward-email=` (ücretsiz planlar) veya `forward-email-site-verification=` (ücretli planlar) ile başlayan tüm <strong class="notranslate">TXT</strong> kayıtlarını ayrıştırırız. Kullanıcının plan yükseltmesi veya düşürmesi sırasında e-postaları işlemek için her ikisini de ayrıştırdığımızı unutmayın.
* Bu ayrıştırılmış <strong class="notranslate">TXT</strong> kayıtlarından, yönlendirme yapılandırmasını çıkarmak için bunlar üzerinde yineleme yaparız (yukarıdaki [E-posta yönlendirmeye nasıl başlayabilirim ve ayarlarım?](#how-do-i-get-started-and-set-up-email-forwarding) bölümünde açıklandığı gibi). Yalnızca bir `forward-email-site-verification=` değerini desteklediğimizi ve birden fazla değer girilirse 550 hatası oluşacağını ve gönderenin bu alıcı için geri dönüş alacağını unutmayın.
* Genel yönlendirmeyi, regex tabanlı yönlendirmeyi ve artık "Yönlendirme Adreslerimiz" olarak bilinen diğer tüm desteklenen yönlendirme yapılandırmalarını belirlemek için çıkarılan yönlendirme yapılandırması üzerinde yinelemeli olarak yineleme yaparız.
* Her Yönlendirme Adresi için, bir yinelemeli aramayı destekleriz (bu, belirtilen adreste bu işlem serisini başlatır). Yinelemeli bir eşleşme bulunursa, ana sonuç Yönlendirme Adreslerinden kaldırılır ve alt sonuçlar eklenir.
* Yönlendirme Adresleri benzersizlik açısından ayrıştırılır (çünkü tek bir adrese yinelemeler göndermek veya gereksiz SMTP istemci bağlantıları oluşturmak istemiyoruz). * Her Yönlendirme Adresi için, alan adını `/v1/max-forwarded-addresses` API uç noktamızla karşılaştırıyoruz (alan adının takma ad başına kaç adrese e-posta iletmesine izin verildiğini belirlemek için, örneğin varsayılan olarak 10 - `example.com`0 bölümüne bakın). Bu sınır aşılırsa, 550 hatası oluşur ve gönderen, bu alıcı için geri dönüş alır.
* Orijinal alıcının ayarlarını, ücretli kullanıcılar için bir aramayı destekleyen (ücretsiz kullanıcılar için bir geri dönüşle birlikte) `example.com`1 API uç noktamızla karşılaştırıyoruz. Bu, `example.com`2 (Sayı, ör. `example.com`3), `example.com`4 (Boole), `example.com`5 (Boole), `example.com`6 (Boole) ve `example.com`7 (Boole) için gelişmiş ayarlara yönelik bir yapılandırma nesnesi döndürür.
* Bu ayarlara dayanarak, Spam Tarayıcı sonuçlarını kontrol ederiz ve herhangi bir hata oluşursa, ileti 554 hata koduyla reddedilir (ör. `example.com`8 etkinleştirilmişse, Spam Tarayıcı sonuçlarını virüsler açısından kontrol ederiz). Tüm ücretsiz plan kullanıcılarının yetişkinlere yönelik içerik, kimlik avı, yürütülebilir dosyalar ve virüslere karşı kontroller için etkinleştirileceğini unutmayın. Varsayılan olarak, tüm ücretli plan kullanıcıları da etkinleştirilir, ancak bu yapılandırma, E-posta İletme panosundaki bir alan adı için Ayarlar sayfasından değiştirilebilir).

10. İşlenen her alıcının Yönlendirme Adresi için aşağıdaki işlemleri gerçekleştiririz:

* Adres, [inkar listesi](#do-you-have-a-denylist) ile karşılaştırılır ve listelenmişse, 421 hata kodu oluşur (gönderene daha sonra tekrar denemesini belirtir).
* Adres bir webhook ise, gelecekteki işlemler için bir Boole değeri ayarlarız (aşağıya bakın - teslimat için birden fazla bağlantı yerine tek bir POST isteği yapmak üzere benzer webhook'ları gruplandırırız).
* Adres bir e-posta adresi ise, gelecekteki işlemler için ana bilgisayarı ayrıştırırız (aşağıya bakın - teslimat için birden fazla bağlantı yerine tek bir bağlantı yapmak üzere benzer ana bilgisayarları gruplandırırız).

11. Alıcı yoksa ve geri dönme yoksa, "Geçersiz alıcılar" 550 hatasıyla yanıt veriyoruz.

12. Alıcılar varsa, bunları (aynı sunucu tarafından gruplandırılmış olarak) yineleyerek e-postaları iletiriz. Daha fazla bilgi için aşağıdaki [E-posta teslimat sorunlarını nasıl çözüyorsunuz?](#how-do-you-handle-email-delivery-issues) bölümüne bakın.

* E-posta gönderirken herhangi bir hata oluşursa, bunları daha sonra işlenmek üzere bellekte saklayacağız.
* E-posta gönderimlerindeki en düşük hata kodunu (varsa) alacağız ve bunu `DATA` komutuna yanıt kodu olarak kullanacağız. Bu, teslim edilmeyen e-postaların genellikle orijinal gönderen tarafından yeniden deneneceği, ancak teslim edilmiş e-postaların bir sonraki mesaj gönderiminde yeniden gönderilmeyeceği anlamına gelir ([Parmak izi](#how-do-you-determine-an-email-fingerprint) kullandığımız gibi).
* Herhangi bir hata oluşmamışsa, 250 başarılı SMTP yanıt durum kodu göndereceğiz.
* Geri dönen ileti, 500'den büyük bir durum koduyla sonuçlanan herhangi bir teslimat girişimi olarak belirlenir (kalıcı hatalar).

13. Eğer herhangi bir geri dönüş (kalıcı arıza) meydana gelmezse, o zaman kalıcı olmayan arızalardan en düşük hata kodunun SMTP yanıt durum kodunu (veya hiç yoksa 250 başarılı durum kodunu) döndüreceğiz.

14. Geri dönmeler meydana gelirse, gönderene tüm hata kodlarının en düşük olanını döndürdükten sonra arka planda geri dönme e-postaları göndeririz. Ancak, en düşük hata kodu 500'den büyükse, geri dönme e-postası göndermeyiz. Çünkü geri dönme olsaydı, gönderenler çift geri dönme e-postası alırlardı (örneğin, Gmail gibi giden MTA'larından biri ve ayrıca bizden biri). Daha fazla bilgi için aşağıdaki [Geri saçılmaya karşı nasıl korunursunuz?](#how-do-you-protect-against-backscatter) bölümüne bakın.

### E-posta teslim sorunlarını nasıl çözüyorsunuz? {#how-do-you-handle-email-delivery-issues}

E-postalarda yalnızca gönderenin DMARC politikasının geçerli olmaması VE hiçbir DKIM imzasının "Kimden" başlığıyla uyumlu olmaması durumunda "Dostça Gönderen" yeniden yazımını uygulayacağımızı unutmayın. Bu, mesajdaki "Kimden" başlığını değiştireceğimiz, "X-Original-From" değerini ayarlayacağımız ve daha önce ayarlanmamışsa bir "Yanıtla" değeri ayarlayacağımız anlamına gelir. Ayrıca, bu başlıkları değiştirdikten sonra mesajdaki ARC mührünü yeniden mühürleyeceğiz.

Ayrıca, yığınımızın her seviyesinde hata mesajlarının akıllı ayrıştırmasını kullanıyoruz - kodumuzda, DNS isteklerinde, Node.js iç bileşenlerinde, HTTP isteklerinde (örneğin, alıcı bir webhook ise 408, 413 ve 429, 421'in SMTP yanıt koduna eşlenir) ve posta sunucusu yanıtlarında (örneğin, "erteleme" veya "yavaşlatma" içeren yanıtlar 421 hataları olarak yeniden denenir).

Mantığımız sahteciliğe karşı dayanıklıdır ve SSL/TLS hataları, bağlantı sorunları ve daha fazlası için de yeniden deneme yapacaktır. Sahteciliğe karşı korumanın amacı, yönlendirme yapılandırması için tüm alıcılara teslimatı en üst düzeye çıkarmaktır.

Alıcı bir webhook ise, isteğin tamamlanması için 3 yeniden denemeye kadar 60 saniyelik bir zaman aşımına izin vereceğiz (yani bir başarısızlıktan önce toplam 4 istek). 408, 413 ve 429 hata kodlarını doğru bir şekilde ayrıştırdığımızı ve bunları 421 SMTP yanıt koduna eşlediğimizi unutmayın.

Aksi takdirde, alıcı bir e-posta adresiyse, e-postayı fırsatçı TLS ile göndermeyi deneyeceğiz (alıcının posta sunucusunda mevcutsa STARTTLS kullanmayı deneyeceğiz). E-postayı göndermeye çalışırken bir SSL/TLS hatası oluşursa, e-postayı TLS olmadan (STARTTLS kullanmadan) göndermeyi deneyeceğiz.

Herhangi bir DNS veya bağlantı hatası oluşursa, `DATA` komutuna 421 SMTP yanıt kodunu döndüreceğiz, aksi takdirde >= 500 düzeyinde hatalar varsa, o zaman geri dönüşler gönderilecektir.

E-posta göndermeye çalıştığımız bir sunucunun posta değişim IP adreslerimizden bir veya daha fazlasını engellediğini tespit edersek (örneğin, spam göndericilerini ertelemek için kullandıkları herhangi bir teknoloji tarafından), göndericinin mesajını daha sonra tekrar denemesi için 421 SMTP yanıt kodunu göndeririz (ve sorun konusunda uyarılacağız, böylece umarız bir sonraki denemeden önce sorunu çözebiliriz).

### IP adreslerinizin engellenmesini nasıl yönetiyorsunuz? {#how-do-you-handle-your-ip-addresses-becoming-blocked}

Rutin olarak tüm önemli DNS reddi listelerini izliyoruz ve posta değişim ("MX") IP adreslerimizden herhangi biri önemli bir reddi listesinde listeleniyorsa, sorun çözülene kadar mümkünse ilgili DNS A kaydından sırayla çıkaracağız.

Bu yazının yazıldığı sırada, birçok DNS izin listesinde de yer alıyoruz ve izleme reddi listelerini ciddiye alıyoruz. Herhangi bir sorunla karşılaşırsanız, lütfen <support@forwardemail.net> adresinden yazılı olarak bize bildirin.

IP adreslerimiz kamuya açıktır, [daha fazla bilgi için aşağıdaki bölüme bakın](#what-are-your-servers-ip-addresses).

### Posta yöneticisi adresleri nelerdir? {#what-are-postmaster-addresses}

Yanlış yönlendirilmiş geri dönüşleri ve izlenmeyen veya var olmayan posta kutularına tatil yanıtlayıcı mesajları gönderilmesini önlemek için, posta gönderici-daemon benzeri kullanıcı adlarından oluşan bir liste tutuyoruz:

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
* [ve herhangi bir cevapsız adres](#what-are-no-reply-addresses)

Bu tür listelerin verimli e-posta sistemleri oluşturmak için nasıl kullanıldığına dair daha fazla bilgi için [RFC 5320 Bölüm 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6)'a bakın.

### Yanıt verilmeyen adresler nelerdir? {#what-are-no-reply-addresses}

Aşağıdakilerden herhangi birine eşit olan e-posta kullanıcı adları (büyük/küçük harfe duyarlı değildir) yanıt verilmeyen adresler olarak kabul edilir:

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

Bu liste [GitHub'da açık kaynaklı bir proje olarak](https://github.com/forwardemail/reserved-email-addresses-list) olarak tutulur.

### Sunucunuzun IP adresleri nelerdir? {#what-are-your-servers-ip-addresses}

IP adreslerimizi <https://forwardemail.net/ips>. adresinde yayınlıyoruz

### {#do-you-have-an-allowlist} adlı bir izin listeniz var mı?

Evet, varsayılan olarak izin verilenler listesine eklenmiş bir [alan adı uzantılarının listesi](#what-domain-name-extensions-are-allowlisted-by-default)'ımız ve [sıkı kriterler](#what-is-your-allowlist-criteria)'e dayalı dinamik, önbelleğe alınmış ve sürekli değişen bir izin verilenler listemiz var.

Ücretli planlardaki müşterilerimize ait tüm e-postalar, alan adları ve alıcılar otomatik olarak izin verilenler listemize eklenir.

### Hangi alan adı uzantıları varsayılan olarak izin verilenler listesindedir? {#what-domain-name-extensions-are-allowlisted-by-default}

Aşağıdaki alan adı uzantıları varsayılan olarak izin verilenler listesinde kabul edilir (Şemsiye Popülerlik Listesi'nde olup olmadıklarına bakılmaksızın):

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
<li class="list-inline-item"><kod class="notranslate">ca.us</code></li>
<li class="list-inline-item"><kod class="notranslate">co.us</code></li>
<li class="list-inline-item"><kod class="notranslate">ct.us</code></li>
<li class="list-inline-item"><kod class="notranslate">dc.us</code></li>
<li class="list-inline-item"><kod class="notranslate">de.us</code></li>
<li class="list-inline-item"><kod class="notranslate">fl.us</code></li>
<li class="list-inline-item"><kod class="notranslate">ga.us</code></li>
<li class="list-inline-item"><kod class="notranslate">gu.us</code></li>
<li class="list-inline-item"><code class="notranslate">hi.us</code></li>
<li class="list-inline-item"><code class="notranslate">ia.us</code></li>
<li class="list-inline-item"><code class="notranslate">id.us</code></li>
<li class="list-inline-item"><code class="notranslate">il.us</code></li>
<li class="list-inline-item"><code class="notranslate">in.us</code></li>
<li class="list-inline-item"><code class="notranslate">ks.us</code></li>
<li class="list-inline-item"><code class="notranslate">ky.us</code></li>
<li class="list-inline-item"><kod class="notranslate">la.us</code></li>
<li class="list-inline-item"><kod class="notranslate">ma.us</code></li>
<li class="list-inline-item"><kod class="notranslate">md.us</code></li>
<li class="list-inline-item"><kod class="notranslate">me.us</code></li>
<li class="list-inline-item"><kod class="notranslate">mi.us</code></li>
<li class="list-inline-item"><kod class="notranslate">mn.us</code></li>
<li class="list-inline-item"><kod class="notranslate">mo.us</code></li>
<li class="list-inline-item"><kod class="notranslate">ms.us</code></li>
<li class="list-inline-item"><code class="notranslate">mt.us</code></li>
<li class="list-inline-item"><code class="notranslate">nc.us</code></li>
<li class="list-inline-item"><code class="notranslate">nd.us</code></li>
<li class="list-inline-item"><code class="notranslate">ne.us</code></li>
<li class="list-inline-item"><code class="notranslate">nh.us</code></li>
<li class="list-inline-item"><code class="notranslate">nj.us</code></li>
<li class="list-inline-item"><code class="notranslate">nm.us</code></li>
<li class="list-inline-item"><kod class="notranslate">nv.us</code></li>
<li class="list-inline-item"><kod class="notranslate">ny.us</code></li>
<li class="list-inline-item"><kod class="notranslate">oh.us</code></li>
<li class="list-inline-item"><kod class="notranslate">ok.us</code></li>
<li class="list-inline-item"><kod class="notranslate">or.us</code></li>
<li class="list-inline-item"><kod class="notranslate">pa.us</code></li>
<li class="list-inline-item"><kod class="notranslate">pr.us</code></li>
<li class="list-inline-item"><kod class="notranslate">ri.us</code></li>
<li class="list-inline-item"><code class="notranslate">sc.us</code></li>
<li class="list-inline-item"><code class="notranslate">sd.us</code></li>
<li class="list-inline-item"><code class="notranslate">tn.us</code></li>
<li class="list-inline-item"><code class="notranslate">tx.us</code></li>
<li class="list-inline-item"><code class="notranslate">ut.us</code></li>
<li class="list-inline-item"><code class="notranslate">va.us</code></li>
<li class="list-inline-item"><code class="notranslate">vi.us</code></li>
<li class="list-inline-item"><kod class="notranslate">vt.us</code></li>
<li class="list-inline-item"><kod class="notranslate">wa.us</code></li>
<li class="list-inline-item"><kod class="notranslate">wi.us</code></li>
<li class="list-inline-item"><kod class="notranslate">wv.us</code></li>
<li class="list-inline-item"><kod class="notranslate">wy.us</code></li>
<li class="list-inline-item"><kod class="notranslate">mil.tt</code></li>
<li class="list-inline-item"><kod class="notranslate">edu.tt</code></li>
<li class="list-inline-item"><kod class="notranslate">edu.tr</code></li>
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
<li class="list-inline-item"><kod class="notranslate">hs.kr</code></li>
<li class="list-inline-item"><kod class="notranslate">ms.kr</code></li>
<li class="list-inline-item"><kod class="notranslate">es.kr</code></li>
<li class="list-inline-item"><kod class="notranslate">sc.kr</code></li>
<li class="list-inline-item"><kod class="notranslate">kg.kr</code></li>
<li class="list-inline-item"><kod class="notranslate">edu.es</code></li>
<li class="list-inline-item"><kod class="notranslate">ac.lk</code></li>
<li class="list-inline-item"><kod class="notranslate">sch.lk</code></li>
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
<li class="list-inline-item"><kod class="notranslate">gov.ax</code></li>
<li class="list-inline-item"><kod class="notranslate">gov.az</code></li>
<li class="list-inline-item"><kod class="notranslate">gov.bd</code></li>
<li class="list-inline-item"><kod class="notranslate">gov.be</code></li>
<li class="list-inline-item"><kod class="notranslate">gov.bg</code></li>
<li class="list-inline-item"><kod class="notranslate">gov.bm</code></li>
<!--<li class="list-inline-item"><kod class="notranslate">gov.br</code></li>-->
<li class="list-inline-item"><kod class="notranslate">gov.by</code></li>
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

Ek olarak, bu [marka ve kurumsal üst düzey alan adları](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) varsayılan olarak izin verilenler listesindedir (örneğin, Apple Card banka ekstreleri için `applecard.apple` için `apple`):

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
<li class="list-inline-item"><code class="notranslate">Airbus</code></li>
<li class="list-inline-item"><code class="notranslate">Airtel</code></li>
<li class="list-inline-item"><code class="notranslate">akdn</code></li>
<li class="list-inline-item"><code class="notranslate">Alfaromeo</code></li>
<li class="list-inline-item"><code class="notranslate">Alibaba</code></li>
<li class="list-inline-item"><code class="notranslate">Alipay</code></li>
<li class="list-inline-item"><code class="notranslate">Allfinanz</code></li>
<li class="list-inline-item"><code class="notranslate">Allstate</code></li>
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
<li class="list-inline-item"><code class="notranslate">basketbol</code></li>
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
<li class="list-inline-item"><kod class="notranslate">bms</code></li>
<li class="list-inline-item"><kod class="notranslate">bmw</code></li>
<li class="list-inline-item"><kod class="notranslate">bnl</code></li>
<li class="list-inline-item"><kod class="notranslate">bnpparibas</code></li>
<li class="list-inline-item"><kod class="notranslate">boehringer</code></li>
<li class="list-inline-item"><kod class="notranslate">tahvil</code></li>
<li class="list-inline-item"><kod class="notranslate">rezervasyon</code></li>
<li class="list-inline-item"><kod class="notranslate">bosch</code></li>
<li class="list-inline-item"><code class="notranslate">bostik</code></li>
<li class="list-inline-item"><code class="notranslate">bradesco</code></li>
<li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
<li class="list-inline-item"><code class="notranslate">brother</code></li>
<li class="list-inline-item"><code class="notranslate">bugatti</code></li>
<li class="list-inline-item"><code class="notranslate">cal</code></li>
<li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
<li class="list-inline-item"><code class="notranslate">canon</code></li>
<li class="list-inline-item"><code class="notranslate">capitalone</code></li>
<li class="list-inline-item"><code class="notranslate">karavan</code></li>
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
<li class="list-inline-item"><code class="notranslate">kale</code></li>
<li class="list-inline-item"><code class="notranslate">citi</code></li>
<li class="list-inline-item"><code class="notranslate">citic</code></li>
<li class="list-inline-item"><code class="notranslate">clubmed</code></li>
<li class="list-inline-item"><code class="notranslate">comcast</code></li>
<li class="list-inline-item"><code class="notranslate">commbank</code></li>
<li class="list-inline-item"><code class="notranslate">kredi</code></li>
<li class="list-inline-item"><code class="notranslate">taç</code></li>
<li class="list-inline-item"><kod class="notranslate">crs</code></li>
<li class="list-inline-item"><kod class="notranslate">csc</code></li>
<li class="list-inline-item"><kod class="notranslate">cuisinella</code></li>
<li class="list-inline-item"><kod class="notranslate">dabur</code></li>
<li class="list-inline-item"><kod class="notranslate">datsun</code></li>
<li class="list-inline-item"><kod class="notranslate">bayi</code></li>
<li class="list-inline-item"><kod class="notranslate">dell</code></li>
<li class="list-inline-item"><kod class="notranslate">deloitte</code></li>
<li class="list-inline-item"><kod class="notranslate">delta</code></li>
<li class="list-inline-item"><kod class="notranslate">dhl</code></li>
<li class="list-inline-item"><kod class="notranslate">keşfet</code></li>
<li class="list-inline-item"><kod class="notranslate">yemek</code></li>
<li class="list-inline-item"><kod class="notranslate">dnp</code></li>
<li class="list-inline-item"><kod class="notranslate">kaç</code></li>
<li class="list-inline-item"><kod class="notranslate">dunlop</code></li>
<li class="list-inline-item"><kod class="notranslate">dupont</code></li>
<li class="list-inline-item"><code class="notranslate">dvag</code></li>
<li class="list-inline-item"><code class="notranslate">edeka</code></li>
<li class="list-inline-item"><code class="notranslate">emerck</code></li>
<li class="list-inline-item"><code class="notranslate">epson</code></li>
<li class="list-inline-item"><code class="notranslate">ericsson</code></li>
<li class="list-inline-item"><code class="notranslate">erni</code></li>
<li class="list-inline-item"><code class="notranslate">güvenlik</code></li>
<li class="list-inline-item"><code class="notranslate">etisalat</code></li>
<li class="list-inline-item"><code class="notranslate">Eurovision</code></li>
<li class="list-inline-item"><code class="notranslate">Everbank</code></li>
<li class="list-inline-item"><code class="notranslate">Ekstra alan</code></li>
<li class="list-inline-item"><code class="notranslate">Fage</code></li>
<li class="list-inline-item"><code class="notranslate">Fairwinds</code></li>
<li class="list-inline-item"><code class="notranslate">Çiftçiler</code></li>
<li class="list-inline-item"><code class="notranslate">FedEx</code></li>
<li class="list-inline-item"><code class="notranslate">Ferrari</code></li>
<li class="list-inline-item"><code class="notranslate">ferrero</code></li>
<li class="list-inline-item"><code class="notranslate">fiat</code></li>
<li class="list-inline-item"><code class="notranslate">sadıklık</code></li>
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
<li class="list-inline-item"><code class="notranslate">gle</code></li>
<li class="list-inline-item"><code class="notranslate">globo</code></li>
<li class="list-inline-item"><code class="notranslate">gmail</code></li>
<li class="list-inline-item"><code class="notranslate">gdo</code></li>
<li class="list-inline-item"><code class="notranslate">gmx</code></li>
<li class="list-inline-item"><code class="notranslate">godaddy</code></li>
<li class="list-inline-item"><code class="notranslate">goldpoint</code></li>
<li class="list-inline-item"><code class="notranslate">goodyear</code></li>
<li class="list-inline-item"><code class="notranslate">goog</code></li>
<li class="list-inline-item"><code class="notranslate">google</code></li>
<li class="list-inline-item"><code class="notranslate">grainger</code></li>
<li class="list-inline-item"><code class="notranslate">guardian</code></li>
<li class="list-inline-item"><code class="notranslate">Gucci</code></li>
<li class="list-inline-item"><code class="notranslate">hbo</code></li>
<li class="list-inline-item"><code class="notranslate">hdfc</code></li>
<li class="list-inline-item"><code class="notranslate">hdfcbank</code></li>
<li class="list-inline-item"><code class="notranslate">Hermes</code></li>
<li class="list-inline-item"><kod class="notranslate">hisamitsu</code></li>
<li class="list-inline-item"><kod class="notranslate">hitachi</code></li>
<li class="list-inline-item"><kod class="notranslate">hkt</code></li>
<li class="list-inline-item"><kod class="notranslate">honda</code></li>
<li class="list-inline-item"><kod class="notranslate">honeywell</code></li>
<li class="list-inline-item"><kod class="notranslate">hotmail</code></li>
<li class="list-inline-item"><kod class="notranslate">hsbc</code></li>
<li class="list-inline-item"><kod class="notranslate">hughes</code></li>
<li class="list-inline-item"><kod class="notranslate">hyatt</code></li>
<li class="list-inline-item"><kod class="notranslate">hyundai</code></li>
<li class="list-inline-item"><kod class="notranslate">ibm</code></li>
<li class="list-inline-item"><kod class="notranslate">ieee</code></li>
<li class="list-inline-item"><kod class="notranslate">ifm</code></li>
<li class="list-inline-item"><kod class="notranslate">ikano</code></li>
<li class="list-inline-item"><kod class="notranslate">imdb</code></li>
<li class="list-inline-item"><kod class="notranslate">infiniti</code></li>
<li class="list-inline-item"><kod class="notranslate">intel</kod></li>
<li class="list-inline-item"><kod class="notranslate">intuit</kod></li>
<li class="list-inline-item"><kod class="notranslate">ipiranga</kod></li>
<li class="list-inline-item"><kod class="notranslate">iselect</kod></li>
<li class="list-inline-item"><kod class="notranslate">itau</kod></li>
<li class="list-inline-item"><kod class="notranslate">itv</kod></li>
<li class="list-inline-item"><kod class="notranslate">iveco</kod></li>
<li class="list-inline-item"><kod class="notranslate">jaguar</kod></li>
<li class="list-inline-item"><code class="notranslate">java</code></li>
<li class="list-inline-item"><code class="notranslate">jcb</code></li>
<li class="list-inline-item"><code class="notranslate">jcp</code></li>
<li class="list-inline-item"><code class="notranslate">jeep</code></li>
<li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
<li class="list-inline-item"><code class="notranslate">ardıç</code></li>
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
<li class="list-inline-item"><code class="notranslate">Lancome</code></li>
<li class="list-inline-item"><code class="notranslate">Lanxess ... <li class="list-inline-item"><code class="notranslate">irtibat görevlisi</code></li>
<li class="list-inline-item"><code class="notranslate">lexus</code></li>
<li class="list-inline-item"><code class="notranslate">lidl</code></li>
<li class="list-inline-item"><code class="notranslate">yaşam tarzı</code></li>
<li class="list-inline-item"><code class="notranslate">lilly</code></li>
<li class="list-inline-item"><code class="notranslate">lincoln</code></li>
<li class="list-inline-item"><code class="notranslate">linde</code></li>
<li class="list-inline-item"><code class="notranslate">lipsy</code></li>
<li class="list-inline-item"><code class="notranslate">lixil</code></li>
<li class="list-inline-item"><code class="notranslate">locus</code></li>
<li class="list-inline-item"><code class="notranslate">lotte</code></li>
<li class="list-inline-item"><code class="notranslate">lpl</code></li>
<li class="list-inline-item"><code class="notranslate">lplffinancial</code></li>
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
<li class="list-inline-item"><code class="notranslate">karşılıklı</code></li>
<li class="list-inline-item"><code class="notranslate">nadex</code></li>
<li class="list-inline-item"><code class="notranslate">ülke çapında</code></li>
<li class="list-inline-item"><code class="notranslate">doğa</code></ li>
<li class="list-inline-item"><code class="notranslate">nba</code></li>
<li class="list-inline-item"><code class="notranslate">nec</code></li>
<li class="list-inline-item"><code class="notranslate">netflix</code></li>
<li class="list-inline-item"><code class="notranslate">neustar</code></li>
<li class="list-inline-item"><code class="notranslate">newholland</code></li>
<li class="list-inline-item"><code class="notranslate">nfl</code></li>
<li class="list-inline-item"><code class="notranslate">nhk</code></li>
<li class="list-inline-item"><code class="notranslate">nico</code></li>
<li class="list-inline-item"><kod class="notranslate">nike</code></li>
<li class="list-inline-item"><kod class="notranslate">nikon</code></li>
<li class="list-inline-item"><kod class="notranslate">nissan</code></li>
<li class="list-inline-item"><kod class="notranslate">nissay</code></li>
<li class="list-inline-item"><kod class="notranslate">nokia</code></li>
<li class="list-inline-item"><kod class="notranslate">northwesternmutual</code></li>
<li class="list-inline-item"><kod class="notranslate">norton</code></li>
<li class="list-inline-item"><kod class="notranslate">nra</code></li>
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
<li class="list-inline-item"><code class="notranslate">öncü</code></li>
<li class="list-inline-item"><code class="notranslate">oyun</code></li>
<li class="list-inline-item"><code class="notranslate">PlayStation</code></li>
<li class="list-inline-item"><code class="notranslate">oyun</code></li>
<li class="list-inline-item"><code class="notranslate">siyaset</code></li>
<li class="list-inline-item"><code class="notranslate">uygulama</code></li>
<li class="list-inline-item"><code class="notranslate">ürün</code></li>
<li class="list-inline-item"><code class="notranslate">ilerici</code></li>
<li class="list-inline-item"><code class="notranslate">pru</code></li>
<li class="list-inline-item"><code class="notranslate">ihtiyatlı</code></li>
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
<li class="list-inline-item"><code class="notranslate">güvenlik</code></li>
<li class="list-inline-item"><code class="notranslate">sakura</code></li>
<li class="list-inline-item"><code class="notranslate">samsung</code></li>
<li class="list-inline-item"><code class="notranslate">sandvik</code></li>
<li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li>
<li class="list-inline-item"><code class="notranslate">sanofi</code></li>
<li class="list-inline-item"><code class="notranslate">sap</code></li>
<li class="list-inline-item"><code class="notranslate">saxo</code></li>
<li class="list-inline-item"><code class="notranslate">sbi</code></li>
<!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>-->
<li class="list-inline-item"><kod class="notranslate">sca</code></li>
<li class="list-inline-item"><kod class="notranslate">scb</code></li>
<li class="list-inline-item"><kod class="notranslate">schaeffler</code></li>
<li class="list-inline-item"><kod class="notranslate">schmidt</code></li>
<li class="list-inline-item"><kod class="notranslate">schwarz</code></li>
<li class="list-inline-item"><kod class="notranslate">scjohnson</code></li>
<li class="list-inline-item"><kod class="notranslate">scor</code></li>
<li class="list-inline-item"><kod class="notranslate">seat</code></li>
<li class="list-inline-item"><code class="notranslate">sener</code></li>
<li class="list-inline-item"><code class="notranslate">ses</code></li>
<li class="list-inline-item"><code class="notranslate">dik</code></li>
<li class="list-inline-item"><code class="notranslate">yedi</code></li>
<li class="list-inline-item"><code class="notranslate">sfr</code></li>
<li class="list-inline-item"><code class="notranslate">ara</code></li>
<li class="list-inline-item"><code class="notranslate">şangrila</code></li>
<li class="list-inline-item"><code class="notranslate">keskin</code></li>
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
<li class="list-inline-item"><code class="notranslate">zımba teli</code></li>
<li class="list-inline-item"><code class="notranslate">yıldız</code></li>
<li class="list-inline-item"><code class="notranslate">starhub</code></li>
<li class="list-inline-item"><code class="notranslate">statebank</code></li>
<li class="list-inline-item"><code class="notranslate">statefarm</code></li>
<li class="list-inline-item"><code class="notranslate">statoil</code></li>
<li class="list-inline-item"><code class="notranslate">stc</code></li>
<li class="list-inline-item"><code class="notranslate">stcgroup</code></li>
<li class="list-inline-item"><code class="notranslate">Suzuki</code></li>
<li class="list-inline-item"><code class="notranslate">Swatch</code></li>
<li class="list-inline-item"><code class="notranslate">Swiftcover</code></li>
<li class="list-inline-item"><kod class="notranslate">symantec</code></li>
<li class="list-inline-item"><kod class="notranslate">taobao</code></li>
<li class="list-inline-item"><kod class="notranslate">hedef</code></li>
<li class="list-inline-item"><kod class="notranslate">tatamotorlar</code></li>
<li class="list-inline-item"><kod class="notranslate">tdk</code></li>
<li class="list-inline-item"><kod class="notranslate">telecity</code></li>
<li class="list-inline-item"><kod class="notranslate">telefonica</code></li>
<li class="list-inline-item"><kod class="notranslate">temasek</code></li>
<li class="list-inline-item"><code class="notranslate">teva</code></li>
<li class="list-inline-item"><code class="notranslate">tiffany</code></li>
<li class="list-inline-item"><code class="notranslate">tjx</code></li>
<li class="list-inline-item"><code class="notranslate">toray</code></li>
<li class="list-inline-item"><code class="notranslate">toshiba</code></li>
<li class="list-inline-item"><code class="notranslate">toplam</code></li>
<li class="list-inline-item"><code class="notranslate">toyota</code></li>
<li class="list-inline-item"><code class="notranslate">seyahat kanalı</code></li>
<li class="list-inline-item"><code class="notranslate">gezginler</code></li>
<li class="list-inline-item"><code class="notranslate">tui</code></li>
<li class="list-inline-item"><code class="notranslate">tv'ler</code></li>
<li class="list-inline-item"><code class="notranslate">ub'ler</code></li>
<li class="list-inline-item"><code class="notranslate">unicom</code></li>
<li class="list-inline-item"><code class="notranslate">uol</code></li>
<li class="list-inline-item"><code class="notranslate">up'lar</code></li>
<li class="list-inline-item"><code class="notranslate">öncü</code></li>
<li class="list-inline-item"><kod class="notranslate">verisign</code></li>
<li class="list-inline-item"><kod class="notranslate">vig</code></li>
<li class="list-inline-item"><kod class="notranslate">viking</code></li>
<li class="list-inline-item"><kod class="notranslate">virgin</code></li>
<li class="list-inline-item"><kod class="notranslate">vize</code></li>
<li class="list-inline-item"><kod class="notranslate">vista</code></li>
<li class="list-inline-item"><kod class="notranslate">vistaprint</code></li>
<li class="list-inline-item"><kod class="notranslate">vivo</code></li>
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

18 Mart 2025 tarihi itibarıyla bu listeye şu Fransız denizaşırı bölgelerini de ekledik ([bu GitHub isteğine göre](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">bzh</code></li>
<li class="list-inline-item"><code class="notranslate">gf</code></li>
<li class="list-inline-item"><code class="notranslate">gp</code></li>
<li class="list-inline-item"><code class="notranslate">mq</code></li>
<li class="list-inline-item"><code class="notranslate">nc</code></li>
<li class="list-inline-item"><code class="notranslate">pf</code></li>
<li class="list-inline-item"><code class="notranslate">pm</code></li>
<li class="list-inline-item"><code class="notranslate">yeniden</code></li>
<li class="list-inline-item"><code class="notranslate">tf</code></li>
<li class="list-inline-item"><code class="notranslate">wf</code></li>
<li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

8 Temmuz 2025 itibarıyla Avrupa'ya özgü şu ülkeleri ekledik:

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

Yüksek spam etkinliği nedeniyle `cz`, `ru` ve `ua`'yi özellikle dahil etmedik.

### İzin listenizdeki kriterler nelerdir? {#what-is-your-allowlist-criteria}

[alan adı uzantıları varsayılan olarak izin verilenler listesine eklendi](#what-domain-name-extensions-are-allowlisted-by-default) adlı statik bir listemiz var ve ayrıca aşağıdaki katı ölçütlere dayalı dinamik, önbelleğe alınmış, sürekli değişen bir izin listesi de tutuyoruz:

* Gönderen kök etki alanı [ücretsiz planımızda sunduğumuz listeyle eşleşen alan adı uzantısı](#what-domain-name-extensions-can-be-used-for-free) (`biz` ve `info` eklenerek) olmalıdır. Ayrıca `edu`, `gov` ve `mil` kısmi eşleşmelerini de dahil ediyoruz; örneğin `xyz.gov.au` ve `xyz.edu.au`.
* Gönderen kök etki alanı, [Şemsiye Popülerlik Listesi](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL") tarafından ayrıştırılan ilk 100.000 benzersiz kök etki alanı sonucu içinde olmalıdır.
* Gönderen kök etki alanı, son 7 günlük UPL'lerin en az 4'ünde (~%50+) görünen benzersiz kök etki alanlarından ilk 50.000 sonuç içinde olmalıdır.
* Gönderen kök etki alanı, Cloudflare tarafından yetişkinlere yönelik içerik veya kötü amaçlı yazılım olarak [kategorize edilmiş](https://radar.cloudflare.com/categorization-feedback/) olmamalıdır.
* Gönderen kök etki alanında A veya MX kayıtları ayarlanmış olmalıdır. * Gönderen kök etki alanının A kaydı(ları), MX kaydı(ları), `biz`0 veya `biz`1 niteleyicili DMARC kaydı veya `biz`2 veya `biz`3 niteleyicili bir SPF kaydı olması gerekir.

Bu kriter karşılanırsa, gönderen kök etki alanı 7 gün boyunca önbelleğe alınır. Otomatik işimizin günlük olarak çalıştığını unutmayın; bu nedenle bu, günlük olarak güncellenen sürekli bir izin listesi önbelleğidir.

Otomatik işimiz, UPL'nin bellekteki son 7 gününü indirecek, bunları açacak ve daha sonra yukarıdaki katı kriterlere göre bellekte ayrıştıracaktır.

Bu yazının yazıldığı sırada popüler olan Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify ve daha fazlası gibi alan adları da elbette dahil edilmiştir.

İzin verilenler listemizde olmayan bir göndericiyseniz, FQDN kök etki alanınız veya IP adresiniz ilk kez e-posta gönderdiğinde [sınırlı oran](#do-you-have-rate-limiting) ve [gri listeye alınmış](#do-you-have-a-greylist) olursunuz. Bunun, e-posta standardı olarak benimsenen standart bir uygulama olduğunu unutmayın. Çoğu e-posta sunucusu istemcisi, bir hız sınırı veya gri liste hatası (örneğin, 421 veya 4xx düzeyinde bir hata durum kodu) alırsa yeniden denemeyi dener.

**`a@gmail.com`, `b@xyz.edu` ve `c@gov.au` gibi belirli göndericilerin hâlâ [reddedildi](#do-you-have-a-denylist) olabileceğini unutmayın** (örneğin, bu göndericilerden otomatik olarak spam, kimlik avı veya kötü amaçlı yazılım tespit edersek).

### Hangi alan adı uzantıları ücretsiz olarak kullanılabilir? {#what-domain-name-extensions-can-be-used-for-free}

31 Mart 2023 tarihi itibarıyla kullanıcılarımızı ve hizmetimizi korumak amacıyla yeni bir genel spam kuralı uygulamaya koyduk.

Bu yeni kural, ücretsiz planımızda yalnızca aşağıdaki alan adı uzantılarının kullanılmasına izin vermektedir:

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
<li class="list-inline-item"><code class="notranslate">ba</code></li>
<li class="list-inline-item"><code class="notranslate">be</code></li>
<li class="list-inline-item"><code class="notranslate">br</code></li>
<li class="list-inline-item"><code class="notranslate">by</code></li>
<li class="list-inline-item"><code class="notranslate">ca</code></li>
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
<li class="list-inline-item"><code class="notranslate">fr</code></li>
<li class="list-inline-item"><code class="notranslate">gg</code></li>
<li class="list-inline-item"><code class="notranslate">gl</code></li>
<li class="list-inline-item"><code class="notranslate">id</code></li>
<li class="list-inline-item"><code class="notranslate">ie</code></li>
<li class="list-inline-item"><code class="notranslate">il</code></li>
<li class="list-inline-item"><code class="notranslate">im</code></li>
<li class="list-inline-item"><code class="notranslate">in</code></li>
<li class="list-inline-item"><code class="notranslate">io</code></li>
<li class="list-inline-item"><code class="notranslate">ir</code></li>
<li class="list-inline-item"><code class="notranslate">dır</code></li>
<li class="list-inline-item"><code class="notranslate">bu</code></li>
<li class="list-inline-item"><code class="notranslate">o</code></li>
<li class="list-inline-item"><code class="notranslate">jp</code></li>
<li class="list-inline-item"><code class="notranslate">ke</code></li>
<li class="list-inline-item"><code class="notranslate">kr</code></li>
<li class="list-inline-item"><code class="notranslate">la</code></li>
<li class="list-inline-item"><code class="notranslate">li</code></li>
<li class="list-inline-item"><code class="notranslate">lv</code></li>
<li class="list-inline-item"><code class="notranslate">ly</code></li>
<li class="list-inline-item"><code class="notranslate">md</code></li>
<li class="list-inline-item"><code class="notranslate">me</code></li>
<li class="list-inline-item"><code class="notranslate">mn</code></li>
<li class="list-inline-item"><code class="notranslate">ms</code></li>
<li class="list-inline-item"><code class="notranslate">mu</code></li>
<li class="list-inline-item"><code class="notranslate">mx</code></li>
<li class="list-inline-item"><code class="notranslate">net</code></li>
<li class="list-inline-item"><code class="notranslate">ni</code></li>
<li class="list-inline-item"><code class="notranslate">nl</code></li>
<li class="list-inline-item"><code class="notranslate">no</code></li>
<li class="list-inline-item"><code class="notranslate">nu</code></li>
<li class="list-inline-item"><code class="notranslate">nz</code></li>
<li class="list-inline-item"><code class="notranslate">org</code></li>
<li class="list-inline-item"><code class="notranslate">pl</code></li>
<li class="list-inline-item"><code class="notranslate">pr</code></li>
<li class="list-inline-item"><code class="notranslate">pt</code></li>
<li class="list-inline-item"><code class="notranslate">pw</code></li>
<li class="list-inline-item"><code class="notranslate">rs</code></li>
<li class="list-inline-item"><code class="notranslate">sc</code></li>
<li class="list-inline-item"><code class="notranslate">se</code></li>
<li class="list-inline-item"><code class="notranslate">sh</code></li>
<li class="list-inline-item"><code class="notranslate">si</code></li>
<li class="list-inline-item"><code class="notranslate">sm</code></li>
<li class="list-inline-item"><code class="notranslate">sr</code></li>
<li class="list-inline-item"><code class="notranslate">st</code></li>
<li class="list-inline-item"><code class="notranslate">tc</code></li>
<li class="list-inline-item"><code class="notranslate">tm</code></li>
<li class="list-inline-item"><code class="notranslate">to</code></li>
<li class="list-inline-item"><code class="notranslate">tv</code></li>
<li class="list-inline-item"><code class="notranslate">uk</code></li>
<li class="list-inline-item"><code class="notranslate">us</code></li>
<li class="list-inline-item"><code class="notranslate">uz</code></li>
<li class="list-inline-item"><code class="notranslate">vc</code></li>
<li class="list-inline-item"><code class="notranslate">vg</code></li>
<li class="list-inline-item"><code class="notranslate">vu</code></li>
<li class="list-inline-item"><code class="notranslate">ws</code></li>
<li class="list-inline-item"><code class="notranslate">xyz</code></li>
<li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>

### {#do-you-have-a-greylist}} adlı bir gri listeniz var mı?

Evet, çok gevşek bir [e-posta gri listeleme](https://en.wikipedia.org/wiki/Greylisting_\(email\)) politikamız var. Gri listeleme yalnızca izin verilenler listemizde olmayan gönderenler için geçerlidir ve önbelleğimizde 30 gün kalır.

Her yeni gönderici için, Redis veritabanımızda 30 gün boyunca, ilk isteklerinin ilk varış saatine ayarlanmış bir anahtar saklıyoruz. Ardından, e-postalarını 450 yeniden deneme durum koduyla reddediyor ve yalnızca 5 dakika geçtikten sonra geçmesine izin veriyoruz.

Eğer bu ilk varış saatinden itibaren 5 dakikayı başarıyla beklemişlerse, e-postaları kabul edilecek ve bu 450 durum kodunu almayacaklardır.

Anahtar, FQDN kök etki alanı veya gönderenin IP adresinden oluşur. Bu, gri listeden geçen herhangi bir alt etki alanının aynı zamanda kök etki alanı olarak da geçeceği ve bunun tersi anlamına gelir (bu, "çok gevşek" bir politikadan kastımızdır).

Örneğin, `example.com`'den gelen bir e-postayı görmeden önce `test.example.com`'dan bir e-posta gelirse, `test.example.com` ve/veya `example.com`'ten gelen tüm e-postalar, bağlantının ilk varış saatinden itibaren 5 dakika beklemek zorunda kalacaktır. Hem `test.example.com` hem de `example.com`'in kendi 5 dakikalık sürelerini beklemesini zorunlu kılmıyoruz (gri listeleme politikamız kök etki alanı düzeyinde geçerlidir).

Gri listelemenin [izin listesi](#do-you-have-an-allowlist)'ımızdaki hiçbir göndericiye (örneğin, bu yazının yazıldığı tarihte Meta, Amazon, Netflix, Google, Microsoft) uygulanmadığını unutmayın.

### Reddetme listeniz var mı? {#do-you-have-a-denylist}

Evet, kendi reddetme listemizi işletiyoruz ve spam ve kötü amaçlı aktivite tespit edildiğinde bunu gerçek zamanlı ve manuel olarak otomatik olarak güncelliyoruz.

Ayrıca her saat <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> konumundaki UCEPROTECT Seviye 1 red listesinden tüm IP adreslerini çekiyoruz ve bunları 7 günlük bir süre sonunda red listemize ekliyoruz.

Reddedilenler listesinde bulunan gönderenler, [izin verilenler listesinde değil](#do-you-have-an-allowlist) değerini girerlerse 421 hata kodunu alırlar (gönderene daha sonra tekrar denemesini belirtir).

554 durum kodu yerine 421 durum kodu kullanıldığında, gerçek zamanlı olarak olası yanlış pozitifler azaltılabilir ve daha sonra mesaj bir sonraki denemede başarıyla iletilebilir.

**Bu, diğer e-posta hizmetlerinden farklı olarak tasarlanmıştır**. Engelleme listesine alındığınızda kalıcı ve kalıcı bir hata oluşur. Göndericilerden mesajları tekrar denemelerini istemek genellikle zordur (özellikle büyük kuruluşlardan gelenler için) ve bu nedenle bu yaklaşım, ilk e-posta denemesinden itibaren göndericiye, alıcıya veya bize müdahale edip sorunu çözmemiz (reddetme listesinin kaldırılmasını talep ederek) için yaklaşık 5 gün süre tanır.

Tüm red listesi kaldırma istekleri yöneticiler tarafından gerçek zamanlı olarak izlenir (örneğin, tekrarlayan yanlış pozitifler yöneticiler tarafından kalıcı olarak izin listesine alınabilir).

Reddetme listesi kaldırma talepleri <https://forwardemail.net/denylist>. adresinden talep edilebilir. Ücretli kullanıcıların reddetme listesi kaldırma talepleri anında işleme alınırken, ücretli olmayan kullanıcıların taleplerinin yöneticiler tarafından işlenmesini beklemeleri gerekir.

Spam veya virüs içeriği gönderdiği tespit edilen gönderenler, aşağıdaki yaklaşımla reddedilenler listesine eklenecektir:

1. "Güvenilir" bir göndericiden (ör. `gmail.com`, `microsoft.com`, `apple.com`) spam veya engelleme listesi tespit edildiğinde [ilk mesaj parmak izi](#how-do-you-determine-an-email-fingerprint) gri listeye alınır.
* Gönderen izin verilenler listesindeyse, mesaj 1 saat boyunca gri listede kalır.
* Gönderen izin verilenler listesinde değilse, mesaj 6 saat boyunca gri listede kalır.
2. Gönderen ve mesajdan gelen bilgilerden reddetme listesi anahtarlarını ayrıştırırız ve bu anahtarların her biri için (eğer mevcut değilse) bir sayaç oluşturur, 1 artırır ve 24 saat boyunca önbelleğe alırız.
* İzin verilenler listesindeki göndericilere yönelik:
* "MAIL FROM" e-posta adresi için, SPF'si varsa veya yoksa ve [bir posta yöneticisi kullanıcı adı](#what-are-postmaster-addresses) veya [cevap vermeyen bir kullanıcı adı](#what-are-no-reply-addresses) değilse, zarf anahtarı ekleyin. * "From" başlığı izin verilenler listesindeyse, "From" başlığı e-posta adresi için, SPF veya uyumlu ve hizalanmış DKIM'ye sahipse bir anahtar ekleyin.
* "From" başlığı izin verilenler listesinde değilse, "From" başlığı e-posta adresi ve kökten ayrıştırılmış alan adı için bir anahtar ekleyin.
* İzin verilenler listesinde olmayan gönderenler için:
* "From" başlığı izin verilenler listesindeyse, "From" başlığı e-posta adresi için, SPF veya uyumlu ve hizalanmış DKIM'ye sahipse bir anahtar ekleyin.
* "From" başlığı izin verilenler listesinde değilse, "From" başlığı e-posta adresi ve kökten ayrıştırılmış alan adı için bir anahtar ekleyin.
* Gönderenin uzak IP adresi için bir anahtar ekleyin.
* Gönderenin IP adresinden (varsa) ters arama yaparak istemci tarafından çözümlenen ana bilgisayar adı için bir anahtar ekleyin. * İstemci tarafından çözümlenen ana bilgisayar adının kök etki alanı için bir anahtar ekleyin (varsa ve istemci tarafından çözümlenen ana bilgisayar adından farklıysa).
3. İzin verilenler listesinde olmayan bir gönderici ve anahtar için sayaç 5'e ulaşırsa, anahtarı 30 gün boyunca reddederiz ve kötüye kullanım ekibimize bir e-posta gönderilir. Bu sayılar değişebilir ve kötüye kullanımı izlerken güncellemeler buraya yansıtılır.
4. İzin verilenler listesinde bulunan bir gönderici ve anahtar için sayaç 10'a ulaşırsa, anahtarı 7 gün boyunca reddederiz ve kötüye kullanım ekibimize bir e-posta gönderilir. Bu sayılar değişebilir ve kötüye kullanımı izlerken güncellemeler buraya yansıtılır.

> **NOT:** Yakın gelecekte itibar izleme özelliğini kullanıma sunacağız. İtibar izleme, bir göndericinin reddedilme listesine alınma zamanını, yukarıda belirtilen basit bir sayacın aksine, yüzdelik bir eşik değerine göre hesaplayacaktır.

### {#do-you-have-rate-limiting} hız sınırlamanız var mı?

Gönderici hız sınırlaması, göndericinin IP adresindeki ters PTR aramasından ayrıştırılan kök etki alanıyla yapılır veya bu bir sonuç vermezse, yalnızca göndericinin IP adresini kullanır. Buna aşağıda `Sender` olarak atıfta bulunacağız.

MX sunucularımızda [şifreli IMAP depolama](/blog/docs/best-quantum-safe-encrypted-email-service) için alınan gelen postalar için günlük limitler bulunmaktadır:

* Tek tek takma adlar (ör. `you@yourdomain.com`) temelinde alınan gelen postaları sınırlamak yerine, takma adın alan adına göre (ör. `yourdomain.com`) sınırlama uyguluyoruz. Bu, `Senders`'nin alan adınızdaki tüm takma adların gelen kutularını aynı anda doldurmasını önler.
* Alıcıdan bağımsız olarak hizmetimiz genelindeki tüm `Senders`'ler için geçerli olan genel sınırlamalarımız vardır:
* Doğruluk kaynağı olarak "güvenilir" olduğunu düşündüğümüz `Senders`'ler (ör. `gmail.com`, `microsoft.com`, `apple.com`) günde 100 GB gönderimle sınırlıdır.
* [izin verilenler listesinde](#do-you-have-an-allowlist) olan `Senders`'ler günde 10 GB gönderimle sınırlıdır. * Diğer tüm `yourdomain.com`0'lar günde 1 GB ve/veya 1000 mesaj gönderme sınırına sahiptir.
* `yourdomain.com`1 ve `yourdomain.com`2 için günlük 1 GB ve/veya 1000 mesaj gönderme sınırımız vardır.

MX sunucuları ayrıca hız sınırlaması yoluyla bir veya daha fazla alıcıya iletilen mesajları sınırlar; ancak bu yalnızca `Senders` için geçerlidir, [izin listesi](#do-you-have-an-allowlist) için geçerli değildir:

* `Sender` tarafından çözümlenen FQDN kök etki alanı (veya) `Sender` uzak IP adresi (ters PTR mevcut değilse) ve zarf alıcısı başına saatte en fazla 100 bağlantıya izin veriyoruz. Hız sınırlama anahtarını Redis veritabanımızda kriptografik bir karma olarak saklıyoruz.

* Sistemimiz üzerinden e-posta gönderiyorsanız, lütfen tüm IP adresleriniz için ters PTR ayarladığınızdan emin olun (aksi takdirde gönderdiğiniz her benzersiz FQDN kök etki alanı veya IP adresi hız sınırlamasına tabi olacaktır).

* Amazon SES gibi popüler bir sistem üzerinden gönderim yaparsanız, (bu yazının yazıldığı tarihte) Amazon SES izin verilenler listemizde yer aldığından, herhangi bir ücret sınırlamasına tabi tutulmayacağınızı unutmayın.

* `test.abc.123.example.com` gibi bir alan adından gönderim yapıyorsanız, oran sınırı `example.com`'e uygulanır. Birçok spam gönderici, benzersiz FQDN kök alan adlarının aksine yalnızca benzersiz ana bilgisayar adlarına oran sınırı uygulayan yaygın spam filtrelerini aşmak için yüzlerce alt alan adı kullanır.

* Oran sınırını aşan `Senders` 421 hatasıyla reddedilecektir.

IMAP ve SMTP sunucularımız, takma adlarınızın aynı anda `60`'dan fazla eş zamanlı bağlantıya sahip olmasını sınırlar.

MX sunucularımız [izin verilenler listesinde olmayan](#do-you-have-an-allowlist) göndericilerinin 10'dan fazla eş zamanlı bağlantı kurmasını sınırlar (sayaç için 3 dakikalık önbellek süresi sonu ile, bu da 3 dakikalık soket zaman aşımımızı yansıtır).

### {#how-do-you-protect-against-backscatter}} geri saçılmaya karşı nasıl korunursunuz?

Yanlış yönlendirilmiş geri dönüşler veya geri dönüş spam'leri ("[Geri saçılma](https://en.wikipedia.org/wiki/Backscatter_\(email\)" olarak bilinir) gönderici IP adreslerinde olumsuz itibara neden olabilir.

Geri saçılmaya karşı koruma sağlamak için aşağıdaki [Bilinen MAIL FROM spam göndericilerinden gelen geri dönüşleri önleyin](#prevent-bounces-from-known-mail-from-spammers) ve [Geri saçılmaya karşı koruma sağlamak için gereksiz sıçramaları önleyin](#prevent-unnecessary-bounces-to-protect-against-backscatter) bölümlerinde ayrıntılı olarak açıklanan iki adım atıyoruz.

### Bilinen MAIL FROM spam göndericilerinden gelen geri dönüşleri önle {#prevent-bounces-from-known-mail-from-spammers}

Listeyi her saat <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> konumunda [Backscatter.org](https://www.backscatterer.org/)'dan ([UCEPROTECT](https://www.uceprotect.net/) tarafından desteklenmektedir) çekiyoruz ve Redis veritabanımıza giriyoruz (ayrıca, herhangi bir IP'nin kaldırılması durumunda, dikkate alınması gereken farkları önceden karşılaştırıyoruz).

MAIL FROM boşsa VEYA (büyük/küçük harfe duyarlı değil) [posta müdürü adresleri](#what-are-postmaster-addresses)'dan (bir e-postadaki @ işaretinden önceki kısım) herhangi birine eşitse, gönderici IP'sinin bu listeden biriyle eşleşip eşleşmediğini kontrol ederiz.

Gönderenin IP'si listelenmişse (ve [izin listesi](#do-you-have-an-allowlist) listemizde değilse), `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}` mesajıyla 554 hatası göndeririz. Bir gönderici hem Backscatterer listesinde hem de izin verilenler listemizdeyse, gerekirse sorunu çözebilmemiz için bize bildirim gönderilir.

Bu bölümde açıklanan teknikler, <https://www.backscatterer.org/?target=usage>'daki "GÜVENLİ MOD" önerisine uymaktadır; burada yalnızca belirli koşullar zaten karşılanmışsa gönderici IP'sini kontrol ederiz.

### Geri saçılmaya karşı koruma sağlamak için gereksiz sıçramaları önleyin {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Geri dönen e-postalar, e-postanın alıcıya iletilmesinin tamamen başarısız olduğunu ve e-postanın yeniden denenmeyeceğini gösteren e-postalardır.

Backscatterer listesinde yer almamızın yaygın bir nedeni yanlış yönlendirilmiş geri dönüşler veya geri dönüş spam'idir, bu nedenle buna karşı birkaç şekilde korunmamız gerekir:

1. Yalnızca >= 500 durum kodu hataları oluştuğunda (iletilmeyi deneyen e-postalar başarısız olduğunda, örneğin Gmail 500 düzeyinde bir hatayla yanıt verdiğinde) e-posta göndeririz.

2. Yalnızca bir kez göndeririz (hesaplanmış bir geri dönüş parmak izi anahtarı kullanır ve tekrar gönderimini önlemek için önbellekte saklarız). Geri dönüş parmak izi, mesajın parmak izinin geri dönüş adresinin ve hata kodunun bir karması ile birleştirilmiş bir anahtardır. Mesaj parmak izinin nasıl hesaplandığı hakkında daha fazla bilgi için [Parmak izi](#how-do-you-determine-an-email-fingerprint) bölümüne bakın. Başarıyla gönderilen geri dönüş parmak izleri, Redis önbelleğimizde 7 gün sonra geçerliliğini yitirecektir.

3. Yalnızca MAIL FROM ve/veya From boş olmadığında ve (büyük/küçük harfe duyarlı olmayan) [posta müdürü kullanıcı adı](#what-are-postmaster-addresses) (bir e-postadaki @ işaretinden önceki kısım) içermediğinde göndeririz.

4. Orijinal mesajda aşağıdaki başlıklardan herhangi biri varsa göndermiyoruz (büyük/küçük harfe duyarlı değil):

* `no`'e eşit olmayan bir değere sahip `auto-submitted` başlığı.
* `dr`, `autoreply`, `auto-reply`, `auto_reply` veya `all` değerine sahip `x-auto-response-suppress` başlığı.
* `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 veya `no`7 başlığı (değerden bağımsız olarak). * `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 veya `x-auto-response-suppress`3 değerine sahip `no`8 başlığı.

5. MAIL FROM veya From e-posta adresiniz `+donotreply`, `-donotreply`, `+noreply` veya `-noreply` ile bitiyorsa gönderim yapmayız.

6. E-posta adresinin kullanıcı adı kısmı `mdaemon` ise ve büyük/küçük harfe duyarlı olmayan `X-MDDSN-Message` başlığına sahipse göndermiyoruz.

7. `multipart/report` başlığının büyük/küçük harfe duyarlı olmayan `content-type` başlığı varsa göndermiyoruz.

### Bir e-posta parmak izi nasıl belirlenir? {#how-do-you-determine-an-email-fingerprint}

Bir e-postanın parmak izi, e-postanın benzersizliğini belirlemek ve yinelenen mesajların iletilmesini ve [yinelenen sıçramalar](#prevent-unnecessary-bounces-to-protect-against-backscatter)'ın gönderilmesini önlemek için kullanılır.

Parmak izi aşağıdaki listeden hesaplanır:

* İstemci tarafından çözümlenen FQDN ana bilgisayar adı veya IP adresi
* `Message-ID` başlık değeri (varsa)
* `Date` başlık değeri (varsa)
* `From` başlık değeri (varsa)
* `To` başlık değeri (varsa)
* `Cc` başlık değeri (varsa)
* `Subject` başlık değeri (varsa)
* `Body` değeri (varsa)

### E-postaları 25 dışındaki portlara iletebilir miyim (örneğin, İSS'm 25 portunu engellediyse) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Evet, 5 Mayıs 2020 itibarıyla bu özelliği ekledik. Şu anda bu özellik takma ada değil, alan adına özeldir. Takma ada özel olmasını istiyorsanız, lütfen ihtiyaçlarınızı bize bildirmek için bizimle iletişime geçin.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Gelişmiş Gizlilik Koruması:
</strong>
<span>
Ücretli bir plandaysanız (gelişmiş gizlilik koruması sunar), lütfen <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a>'na gidin, alan adınızın yanındaki "Kurulum"a ve ardından "Ayarlar"a tıklayın. Ücretli planlar hakkında daha fazla bilgi edinmek isterseniz <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Fiyatlandırma</a> sayfamıza bakın. Aksi takdirde aşağıdaki talimatları izlemeye devam edebilirsiniz.
</span>
</div>

Ücretsiz plandaysanız, aşağıda gösterildiği gibi yeni bir DNS <strong class="notranslate">TXT</strong> kaydı ekleyin, ancak bağlantı noktasını 25'ten istediğiniz bağlantı noktasına değiştirin.

Örneğin, `example.com` adresine giden tüm e-postaların, 25 yerine 1337 numaralı takma ad alıcılarının SMTP portuna iletilmesini istiyorsam:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
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
Özel port yönlendirme kurulumu için en yaygın senaryo, example.com adresine giden tüm e-postaları, SMTP standardı olan 25 numaralı port dışında, example.com adresindeki farklı bir porta yönlendirmek istemenizdir. Bunu ayarlamak için, aşağıdaki <strong class="notranslate">TXT</strong> tümünü yakalama kaydını eklemeniz yeterlidir.
<span>
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=example.com</code></td>
</tr>
</tbody>
</table>

### Gmail takma adları için artı + sembolünü destekliyor mu? {#does-it-support-the-plus--symbol-for-gmail-aliases}

Evet, kesinlikle.

### {#does-it-support-sub-domains} alt alan adlarını destekliyor mu?

Evet, kesinlikle. Ad/ana bilgisayar/takma ad olarak "@", "." veya boşluk kullanmak yerine, değer olarak alt alan adını kullanın.

`foo.example.com`'ın e-postaları yönlendirmesini istiyorsanız, DNS ayarlarınızda ad/ana bilgisayar/takma ad değerini `foo` olarak girin (hem MX hem de <strong class="notranslate">TXT</strong> kayıtları için).

### Bu, e-postamın başlıklarını {#does-this-forward-my-emails-headers}'e iletir mi?

Evet, kesinlikle.

### Bu iyi test edilmiş {#is-this-well-tested}

Evet, [ava](https://github.com/avajs/ava) ile yazılmış testleri var ve ayrıca kod kapsamı da var.

### SMTP yanıt mesajlarını ve kodlarını iletiyor musunuz? {#do-you-pass-along-smtp-response-messages-and-codes}

Evet, kesinlikle. Örneğin, `hello@example.com` adresine bir e-posta gönderiyorsanız ve bu e-posta `user@gmail.com` adresine iletilmek üzere kayıtlıysa, "mx1.forwardemail.net" veya "mx2.forwardemail.net" adresindeki proxy sunucusu yerine "gmail.com" SMTP sunucusundan gelen SMTP yanıt mesajı ve kodu döndürülür.

### Spam gönderenleri nasıl engellersiniz ve iyi bir e-posta yönlendirme itibarı nasıl sağlarsınız? {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Yukarıdaki [E-posta yönlendirme sisteminiz nasıl çalışır?](#how-does-your-email-forwarding-system-work), [E-posta teslimat sorunlarını nasıl çözüyorsunuz?](#how-do-you-handle-email-delivery-issues) ve [IP adreslerinizin engellenmesini nasıl yönetiyorsunuz?](#how-do-you-handle-your-ip-addresses-becoming-blocked) bölümlerimize bakın.

### {#how-do-you-perform-dns-lookups-on-domain-names} etki alanı adlarında DNS aramaları nasıl yapılır?

:tangerine: [mandalina](https://github.com/forwardemail/tangerine) adında açık kaynaklı bir yazılım projesi oluşturduk ve bunu DNS aramaları için kullanıyoruz. Kullanılan varsayılan DNS sunucuları `1.1.1.1` ve `1.0.0.1`'dir ve DNS sorguları uygulama katmanında [HTTPS üzerinden DNS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") üzerinden yapılır.

:tangerine: [mandalina](https://github.com/tangerine) [varsayılan olarak CloudFlare'in gizlilik odaklı tüketici DNS hizmetini][cloudflare-dns] kullanır.

## Hesap ve Faturalandırma {#account-and-billing}

### Ücretli planlarda para iade garantisi sunuyor musunuz? {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Evet! Planınızın ilk başladığı tarihten itibaren 30 gün içinde hesabınızı yükselttiğinizde, düşürdüğünüzde veya iptal ettiğinizde otomatik geri ödemeler yapılır. Bu yalnızca ilk kez abone olanlar için geçerlidir.

### Plan değiştirirsem, aradaki farkı orantılı olarak hesaplayıp iade ediyor musunuz? {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Plan değiştirdiğinizde, aradaki farkı orantılı olarak bölüştürmez veya iade etmeyiz. Bunun yerine, mevcut planınızın bitiş tarihinden kalan süreyi, yeni planınız için en yakın göreceli süreye (ay bazında yuvarlanarak) dönüştürürüz.

Ücretli bir plana ilk kez başladığınız tarihten itibaren 30 günlük süre içinde ücretli planlar arasında geçiş yapmanız veya düşürmeniz durumunda, mevcut planınızdaki tutarın tamamını otomatik olarak iade edeceğimizi unutmayın.

### Bu e-posta yönlendirme hizmetini yalnızca "yedek" veya "dönüşümlü" bir MX sunucusu olarak kullanabilir miyim? {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Hayır, önerilmez çünkü aynı anda yalnızca bir posta değişim sunucusu kullanabilirsiniz. Öncelik yanlış yapılandırmaları ve posta sunucularının MX değişim öncelik denetimine uymaması nedeniyle, yedekler genellikle yeniden denenmez.

### Belirli takma adları devre dışı bırakabilir miyim? {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Önemli:
</strong>
<span>
Ücretli bir plandaysanız, <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar <i class="fa fa-angle-right"></i> Takma Adı Düzenle <i class="fa fa-angle-right"></i> "Etkin" onay kutusunun işaretini kaldırın <i class="fa fa-angle-right"></i> Devam Et.
</span>
</div>

Evet, DNS <strong class="notranslate">TXT</strong> kaydınızı düzenleyin ve takma adın önüne bir, iki veya üç ünlem işareti ekleyin (aşağıya bakın).

":" eşlemesini korumanız gerektiğini unutmayın, çünkü bunu kapatmaya karar verirseniz bu gereklidir (ayrıca ücretli planlarımızdan birine yükseltme yaparsanız içe aktarma için de kullanılır).

**Sessiz reddetme için (gönderene mesaj başarıyla gönderilmiş gibi görünür, ancak aslında hiçbir yere gitmez) (durum kodu `250`):** Bir takma adın önüne "!" (tek ünlem işareti) eklerseniz, bu adrese e-posta göndermeye çalışan göndericilere `250` başarılı durum kodu döndürülür, ancak e-postaların kendisi hiçbir yere gitmez (örneğin bir kara delik veya `/dev/null`).

**Yumuşak reddetme için (durum kodu `421`):** Bir takma adın başına "!!" (çift ünlem işareti) eklerseniz, bu adrese göndermeye çalışan göndericilere `421` yumuşak hata durum kodu döndürülür ve e-postalar reddedilip geri dönmeden önce genellikle 5 güne kadar yeniden denenir.

**Zorunlu reddetme için (durum kodu `550`):** Bir takma adın başına "!!!" (üçlü ünlem işareti) eklerseniz, bu adrese e-posta göndermeye çalışan göndericilere `550` kalıcı hata durum kodu döndürülür ve e-postalar reddedilir ve geri döner.

Örneğin, `alias@example.com` adresine giden tüm e-postaların `user@gmail.com` adresine akışının durmasını ve reddedilip geri dönmesini istiyorsam (örneğin üç ünlem işareti kullanın):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
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
Ayrıca, iletilen alıcının adresini basitçe "nobody@forwardemail.net" olarak yeniden yazabilirsiniz; bu, aşağıdaki örnekte olduğu gibi iletiyi nobody adresine yönlendirecektir.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
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
Daha fazla güvenlik istiyorsanız, aşağıdaki örnekte olduğu gibi ":user@gmail.com" (veya ":nobody@forwardemail.net") kısmını kaldırıp sadece "!!!alias" kısmını bırakabilirsiniz.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias</code></td>
</tr>
</tbody>
</table>

### E-postaları birden fazla alıcıya iletebilir miyim? {#can-i-forward-emails-to-multiple-recipients}

Evet, kesinlikle. <strong class="notranslate">TXT</strong> kayıtlarınızda birden fazla alıcı belirtmeniz yeterli.

Örneğin, `hello@example.com` adresine giden bir e-postanın `user+a@gmail.com` ve `user+b@gmail.com` adreslerine iletilmesini istiyorsam, <strong class="notranslate">TXT</strong> kaydım şöyle görünecektir:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Veya bunları iki ayrı satırda şu şekilde belirtebilirsiniz:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>"@", "." veya boş</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

O size kalmış!

### Birden fazla genel alıcıya sahip olabilir miyim? {#can-i-have-multiple-global-catch-all-recipients}

Evet, yapabilirsiniz. <strong class="notranslate">TXT</strong> kayıtlarınızda birden fazla genel alıcı belirtmeniz yeterli.

Örneğin, `*@example.com`'a (yıldız işareti joker karakter anlamına gelir, yani her şeyi kapsar) giden her e-postanın `user+a@gmail.com` ve `user+b@gmail.com`'ye iletilmesini istiyorsam, <strong class="notranslate">TXT</strong> kaydım şöyle görünecektir:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Veya bunları iki ayrı satırda şu şekilde belirtebilirsiniz:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ad/Ana Bilgisayar/Takma Ad</th>
<th class="text-center">TTL</th>
<th>Tür</th>
<th>Yanıt/Değer</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." veya boş</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>@, "." veya boş</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

O size kalmış!

### {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias} takma adına yönlendirebileceğim e-posta adresi sayısında bir üst sınır var mı?

Evet, varsayılan sınır 10'dur. Bu, alan adınızda yalnızca 10 takma adınız olabileceği anlamına GELMEZ. İstediğiniz kadar takma adınız olabilir (sınırsız). Bu, yalnızca bir takma adı 10 benzersiz e-posta adresine yönlendirebileceğiniz anlamına gelir. `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (1-10 arası) olabilir ve `hello@example.com` adresine gönderilen tüm e-postalar `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (1-10 arası) adreslerine yönlendirilir.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
İpucu:
</strong>
<span>
Takma ad başına 10'dan fazla alıcıya mı ihtiyacınız var? Bize bir e-posta gönderin, hesap limitinizi artırmaktan memnuniyet duyarız.
</span>
</div>

### {#can-i-recursively-forward-emails}} e-postalarını yinelemeli olarak iletebilir miyim?

Evet, yapabilirsiniz, ancak yine de maksimum sınıra uymalısınız. `hello:linus@example.com` ve `linus:user@gmail.com`'iniz varsa, `hello@example.com`'ye gönderilen e-postalar `linus@example.com` ve `user@gmail.com`'e yönlendirilir. Maksimum sınırın üzerindeki e-postaları yinelemeli olarak iletmeye çalışırsanız bir hata oluşacağını unutmayın.

### İnsanlar benim iznim olmadan e-posta yönlendirmemi kaydedebilir veya kaydını silebilir mi? {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

MX ve <strong class="notranslate">TXT</strong> kayıt doğrulaması kullanıyoruz, bu nedenle bu hizmetin ilgili MX ve <strong class="notranslate">TXT</strong> kayıtlarını eklerseniz kayıtlı olursunuz. Bunları kaldırırsanız, kaydınız silinir. Alan adınızın ve DNS yönetiminin mülkiyeti sizdedir, bu nedenle birinin bunlara erişimi varsa bu bir sorun teşkil eder.

### Nasıl ücretsiz {#how-is-it-free}

Forward Email, açık kaynaklı geliştirme, verimli altyapı ve hizmeti destekleyen isteğe bağlı ücretli planların bir kombinasyonu aracılığıyla ücretsiz bir katman sunar.

Ücretsiz katmanımız şunlar tarafından desteklenmektedir:

1. **Açık Kaynaklı Geliştirme**: Kod tabanımız açık kaynaklıdır, bu da topluluk katkılarına ve şeffaf bir işletime olanak tanır.

2. **Verimli Altyapı**: E-posta yönlendirmeyi minimum kaynakla gerçekleştirecek şekilde sistemlerimizi optimize ettik.

3. **Ücretli Premium Planlar**: SMTP gönderme, IMAP alma veya gelişmiş gizlilik seçenekleri gibi ek özelliklere ihtiyaç duyan kullanıcılar ücretli planlarımıza abone olurlar.

4. **Makul Kullanım Sınırları**: Ücretsiz katmanda kötüye kullanımı önlemek için adil kullanım politikaları vardır.

> \[!NOTE]
> Daha gelişmiş ihtiyaçları olan kullanıcılar için premium özellikler sunarken, temel e-posta yönlendirmeyi ücretsiz tutmaya kararlıyız.

> \[!TIP]
> Hizmetimizi değerli buluyorsanız, devam eden geliştirme ve bakımı desteklemek için ücretli bir plana yükseltmeyi düşünün.

### Maksimum e-posta boyutu sınırı nedir? {#what-is-the-max-email-size-limit}

İçerik, başlıklar ve ekler dahil olmak üzere varsayılan boyut sınırımız 50 MB'tır. Gmail ve Outlook gibi hizmetlerin yalnızca 25 MB boyut sınırına izin verdiğini ve bu sağlayıcılardaki adreslere gönderim yaparken sınırı aşmanız durumunda bir hata mesajı alacağınızı unutmayın.

Dosya boyutu sınırı aşıldığında doğru yanıt koduyla bir hata döndürülür.

### E-postaların kayıtlarını saklıyor musunuz? {#do-you-store-logs-of-emails}

Hayır, [hata istisnası](#do-you-store-error-logs) ve [giden SMTP](#do-you-support-sending-email-with-smtp) ile diske yazmıyoruz veya günlükleri saklamıyoruz ([Gizlilik Politikası](/privacy)'mize bakın).

Her şey bellek içinde ve [kaynak kodumuz GitHub'da](https://github.com/forwardemail)'da yapılır.

### {#do-you-store-error-logs} hata günlüklerini saklıyor musunuz?

**Evet. Hata günlüklerine [Hesabım → Günlükler](/my-account/logs) veya [Hesabım → Alan Adları](/my-account/domains) altından erişebilirsiniz.**

Şubat 2023 itibarıyla, `4xx` ve `5xx` SMTP yanıt kodları için SMTP hatasını, zarfı ve e-posta başlıklarını içeren hata günlüklerini 7 günlük bir süre boyunca saklıyoruz (e-posta gövdesini veya ekleri **saklamıyoruz**).

Hata günlükleri, önemli e-postaların eksik olup olmadığını kontrol etmenize ve [alan adlarınız](/my-account/domains) için spam hatalarını azaltmanıza olanak tanır. Ayrıca, [e-posta web kancaları](#do-you-support-webhooks) ile ilgili sorunları gidermek için de harika bir kaynaktır (çünkü hata günlükleri webhook uç nokta yanıtını içerir).

[hız sınırlaması](#do-you-have-rate-limiting) ve [gri listeleme](#do-you-have-a-greylist) için hata günlüklerine, bağlantı erken sona erdiğinden (örneğin `RCPT TO` ve `MAIL FROM` komutları iletilmeden önce) erişilemiyor.

Daha fazla bilgi için [Gizlilik Politikası](/privacy)'ımıza bakın.

### E-postalarımı okuyor musun? {#do-you-read-my-emails}

Hayır, kesinlikle hayır. [Gizlilik Politikası](/privacy)'ımıza bakın.

Diğer birçok e-posta yönlendirme hizmeti, e-postalarınızı depolar ve potansiyel olarak okuyabilir. Yönlendirilen e-postaların disk depolama alanına depolanması için hiçbir sebep yok; bu nedenle, her şeyi bellekte yapan ilk açık kaynaklı çözümü geliştirdik.

Gizliliğinize saygı duymanız gerektiğine inanıyor ve buna kesinlikle saygı duyuyoruz. Sunucuya dağıtılan kod, şeffaflık ve güven oluşturmak için [GitHub'da açık kaynaklı yazılım](https://github.com/forwardemail)'dır.

### Bu {#can-i-send-mail-as-in-gmail-with-this} ile Gmail'de "postaları şu şekilde gönderebilir miyim"?

Evet! 2 Ekim 2018 itibarıyla bu özelliği ekledik. Yukarıdaki [Gmail'i kullanarak Mail Nasıl Gönderilir?](#how-to-send-mail-as-using-gmail)'a bakın!

DNS yapılandırmanızda <strong class="notranslate">TXT</strong> kaydında Gmail için SPF kaydını da ayarlamalısınız.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Önemli:
</strong>
<span>
Gmail (ör. Postaları Şu Adresten Gönder) veya G Suite kullanıyorsanız, SPF <strong class="notranslate">TXT</strong> kaydınıza <code>include:_spf.google.com</code> eklemeniz gerekir, örneğin:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### Bu {#can-i-send-mail-as-in-outlook-with-this} ile Outlook'ta "postayı şu şekilde gönder" özelliğini kullanabilir miyim?

Evet! 2 Ekim 2018 itibarıyla bu özelliği ekledik. Microsoft'un aşağıdaki iki bağlantısına göz atabilirsiniz:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

DNS yapılandırmanızda <strong class="notranslate">TXT</strong> kaydında Outlook için SPF kaydını da ayarlamalısınız.

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

### Bu {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this} ile Apple Mail ve iCloud Mail'de "postaları şu şekilde gönderebilir miyim"?

iCloud+ abonesiyseniz özel bir alan adı kullanabilirsiniz. [Hizmetimiz Apple Mail ile de uyumludur](#apple-mail).

Daha fazla bilgi için lütfen <https://support.apple.com/en-us/102540> adresine bakın.

### Bu {#can-i-forward-unlimited-emails-with-this} ile sınırsız e-posta iletebilir miyim?

Evet, ancak "nispeten bilinmeyen" göndericilerin hızı, ana bilgisayar adı veya IP başına saatte 100 bağlantıyla sınırlıdır. Yukarıdaki [Hız Sınırlaması](#do-you-have-rate-limiting) ve [Gri listeleme](#do-you-have-a-greylist) bölümlerine bakın.

"Nispeten bilinmeyen" derken, [izin listesi](#do-you-have-an-allowlist)'da görünmeyen göndericileri kastediyoruz.

Bu limit aşıldığında göndericinin posta sunucusuna daha sonra tekrar denemesini söyleyen 421 yanıt kodu göndeririz.

### Tek bir fiyat karşılığında sınırsız alan adı sunuyor musunuz? {#do-you-offer-unlimited-domains-for-one-price}

Evet. Hangi planda olursanız olun, tüm alan adlarınızı kapsayan tek bir aylık ücret ödeyeceksiniz.

### Hangi ödeme yöntemlerini kabul ediyorsunuz? {#which-payment-methods-do-you-accept}

Forward Email aşağıdaki tek seferlik veya aylık/üç aylık/yıllık ödeme yöntemlerini kabul eder:

1. **Kredi/Banka Kartları/Banka Havaleleri**: Visa, Mastercard, American Express, Discover, JCB, Diners Club vb.
2. **PayPal**: Kolay ödemeler için PayPal hesabınızı bağlayın
3. **Kripto Para Birimi**: Ethereum, Polygon ve Solana ağlarında Stripe'ın stablecoin ödemeleri aracılığıyla ödemeleri kabul ediyoruz.

> \[!NOTE]
> Sunucularımızda yalnızca ödeme tanımlayıcılarını ve [Şerit](https://stripe.com/global) ve [PayPal](https://www.paypal.com) işlem, müşteri, abonelik ve ödeme kimliklerine ilişkin referansları içeren sınırlı ödeme bilgilerini saklıyoruz.

> \[!TIP]
> Maksimum gizlilik için kripto para ödemelerini kullanmayı düşünün.

Tüm ödemeler Stripe veya PayPal aracılığıyla güvenli bir şekilde işlenir. Ödeme bilgileriniz hiçbir zaman sunucularımızda saklanmaz.

## Ek Kaynaklar {#additional-resources}

> \[!TIP]
> Aşağıdaki makalelerimiz düzenli olarak yeni kılavuzlar, ipuçları ve teknik bilgilerle güncellenmektedir. En güncel içerikler için sık sık kontrol edin.

* [Vaka Çalışmaları ve Geliştirici Dokümantasyonu](/blog/docs)
* [Kaynaklar](/resources)
* [Rehberler](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/