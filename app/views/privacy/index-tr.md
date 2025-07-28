# Gizlilik Politikası {#privacy-policy}

<img loading="tembel" src="/img/articles/privacy.webp" alt="" class="rounded-lg" />

## İçindekiler {#table-of-contents}

* [Sorumluluk reddi](#disclaimer)
* [Toplanmayan Bilgiler](#information-not-collected)
* [Toplanan Bilgiler](#information-collected)
* [Paylaşılan Bilgiler](#information-shared)
* [Bilgi Kaldırma](#information-removal)
* [Ek Açıklamalar](#additional-disclosures)

## Yasal Uyarı {#disclaimer}

Lütfen site genelinde geçerli olan [Şartlar](/terms) politikamıza uyun.

## Bilgi Toplanmadı {#information-not-collected}

**[hatalar](/faq#do-you-store-error-logs), [giden SMTP e-postaları](/faq#do-you-support-sending-email-with-smtp) ve/veya spam ya da kötü amaçlı etkinlik tespit edildiğinde (örneğin hız sınırlaması için) istisna olmak üzere:**

* İletilen e-postaları disk depolama alanına veya veritabanlarına kaydetmiyoruz.
* E-postalarla ilgili meta verileri disk depolama alanına veya veritabanlarına kaydetmiyoruz.
* Günlükleri veya IP adreslerini disk depolama alanına veya veritabanlarına kaydetmiyoruz.

## Toplanan Bilgiler {#information-collected}

Şeffaflık açısından, aşağıdaki bilgilerin nasıl toplandığını ve kullanıldığını görmek için istediğiniz zaman <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">kaynak kodumuzu görüntüleyebilirsiniz</a>:

**Sadece işlevsellik ve hizmetimizi iyileştirmek için aşağıdaki bilgileri topluyor ve güvenli bir şekilde saklıyoruz:**

* E-postalarınızı ve takvim bilgilerinizi yalnızca IMAP/POP3/CalDAV/CardDAV erişiminiz ve posta kutusu işlevselliğiniz için [şifrelenmiş SQLite veritabanı](/blog/docs/best-quantum-safe-encrypted-email-service) adresinde saklıyoruz.
* Yalnızca e-posta yönlendirme hizmetlerimizi kullanıyorsanız, [Toplanmayan Bilgiler](#information-not-collected) adresinde açıklandığı gibi hiçbir e-postanın diske veya veritabanı deposuna kaydedilmediğini unutmayın.
* E-posta yönlendirme hizmetlerimiz yalnızca bellek içinde çalışır (disk depolama alanına veya veritabanlarına yazma işlemi yapılmaz).
* IMAP/POP3/CalDAV/CardDAV depolama alanı, bekleme sırasında şifrelenir, aktarım sırasında şifrelenir ve LUKS şifreli bir diskte saklanır.
* IMAP/POP3/CalDAV/CardDAV depolama alanınızın yedekleri, bekleme sırasında şifrelenir, aktarım sırasında şifrelenir ve [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) adresinde saklanır.
* Web sitesi trafiğiniz için bir oturumda çerez saklıyoruz.
* Bize sağladığınız e-posta adresinizi saklıyoruz.
* Bize sağladığınız alan adlarınızı, takma adlarınızı ve yapılandırmalarınızı saklıyoruz.
* `4xx` ve `5xx` SMTP yanıt kodu [hata günlükleri](/faq#do-you-store-error-logs)'yi 7 gün boyunca saklıyoruz.
* [giden SMTP e-postaları](/faq#do-you-support-sending-email-with-smtp)'ü \~30 gün boyunca saklıyoruz.
* Bu uzunluk, "Tarih" başlığına göre değişir; çünkü gelecekte bir "Tarih" başlığı varsa, e-postaların gelecekte gönderilmesine izin veriyoruz.
* **Bir e-posta başarıyla teslim edildiğinde veya kalıcı hatalar oluştuğunda, mesaj gövdesini düzenleyip temizleyeceğimizi unutmayın.**
* Giden SMTP e-posta mesajınızın gövdesinin varsayılan 0 günden (başarılı teslimat veya kalıcı hatadan sonra) daha uzun süre saklanmasını istiyorsanız, alan adınız için Gelişmiş Ayarlar'a gidin ve `0` ile `30` arasında bir değer girin. * Bazı kullanıcılar, e-postalarının nasıl görüntülendiğini görmek için [Hesabım > E-postalar](/my-account/emails) önizleme özelliğini kullanmaktan keyif alır, bu nedenle yapılandırılabilir bir saklama süresini destekliyoruz.
* Ayrıca [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) özelliğini de desteklediğimizi unutmayın.
* Bize e-posta yoluyla veya <a href="/help">yardım</a> sayfamız aracılığıyla gönderilen yorumlar veya sorular gibi gönüllü olarak bize sağladığınız ek bilgiler.

## Paylaşılan Bilgiler {#information-shared}

Bilgilerinizi hiçbir üçüncü tarafla paylaşmıyoruz. Ayrıca hiçbir üçüncü taraf analitik veya telemetri yazılım hizmetini kullanmıyoruz.

Mahkeme tarafından emredilen yasal taleplere uymamız gerekebilir ve uyacağız (ancak [Yukarıda "Toplanmayan Bilgiler" başlığı altında belirtilen bilgileri toplamıyoruz](#information-not-collected)'yı unutmayın, bu nedenle başlangıçta bunu sağlayamayacağız).

## Bilgi Kaldırma {#information-removal}

Herhangi bir zamanda bize sağladığınız bilgileri kaldırmak isterseniz, <a href="/my-account/security">Hesabım > Güvenlik</a> bölümüne gidin ve "Hesabı Sil" seçeneğine tıklayın.

Kötüye kullanımın önlenmesi ve azaltılması amacıyla, ilk ödemenizden itibaren 5 gün içinde hesabınızı silmeniz durumunda yöneticilerimiz tarafından manuel silme incelemesi gerekebilir.

Bu süreç genellikle 24 saatten az sürer ve kullanıcıların hizmetimizde spam göndermesi ve ardından hesaplarını hızla silmeleri nedeniyle uygulandı; bu da Stripe'ta ödeme yöntemi parmak izlerini engellememizi engelledi.

## Ek Açıklamalar {#additional-disclosures}

Bu site Cloudflare tarafından korunmaktadır ve [Gizlilik Politikası](https://www.cloudflare.com/privacypolicy/) ve [Hizmet Şartları](https://www.cloudflare.com/website-terms/) geçerlidir.