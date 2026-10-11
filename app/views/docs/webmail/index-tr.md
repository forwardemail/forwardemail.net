# Forward Email Webmail Kılavuzu {#forward-email-webmail-guide}

<p class="lead mt-3">
  <strong>ÖZET:</strong> <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">Webmail</a>, postalarınızı okuyup gönderdiğiniz yerdir. <a href="/my-account/domains">Web paneli</a> ise alan adlarını, takma adları ve parolaları ayarladığınız yerdir. Webmail'e bir takma ad adresi ve panelde oluşturulan bir parolayla giriş yaparsınız. Webmail ücretsiz ve <a href="/faq#do-you-offer-a-webmail-client">açık kaynaklıdır</a>; aynı uygulama tarayıcıda, masaüstünde, mobilde ve terminalde çalışır.
</p>


## İçindekiler {#table-of-contents}

* [Webmail nereden edinilir](#where-to-get-webmail)
* [Webmail ve web paneli](#webmail-and-the-web-dashboard)
* [Giriş yapma](#signing-in)
  * [Takma ad parolası oluşturun](#generate-an-alias-password)
  * [Webmail'e giriş yapın](#sign-in-to-webmail)
* [Birden fazla hesap kullanma](#using-more-than-one-account)
  * [Giriş yapılmış başka bir hesap olarak gönderin](#send-as-another-signed-in-account)
* [Alan adınızdaki herhangi bir adresten gönderin](#send-from-any-address-on-your-domain)
  * [Adım 1: Panelde bir catch-all parolası oluşturun](#step-1-generate-a-catch-all-password-in-the-dashboard)
  * [Adım 2: Webmail'e kaydedin](#step-2-save-it-in-webmail)
  * [Adım 3: Yazarken adresi seçin](#step-3-pick-the-address-when-you-compose)
  * [Catch-all ile gönderme hakkında bilmeniz gerekenler](#what-to-know-about-catch-all-sending)
* [Bir bakışta webmail ayarları](#webmail-settings-at-a-glance)
* [Gizlilik ve App Lock](#privacy-and-app-lock)
* [Sorun giderme](#troubleshooting)


## Webmail nereden edinilir {#where-to-get-webmail}

| Platform                        | Nereden                                                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Tarayıcı                        | <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a> (kurulum gerekmez) |
| Masaüstü (macOS, Windows, Linux) | <a href="/download">İndirme sayfamız</a>                                                                               |
| Mobil (Android, iOS)            | <a href="/download">İndirme sayfamız</a>                                                                                 |
| Terminal                        | `forwardemail` komutu. Bkz. [Terminal uygulamanız var mı](/faq#do-you-have-a-terminal-app)                              |

Hepsi aynı açık kaynak projeden derlenir, bu nedenle bu kılavuzdaki her şey hepsi için geçerlidir. Ayarlar ve kayıtlı parolalar her cihazda ayrı tutulur, bu yüzden kullandığınız her cihazda bunları ayarlayın.


## Webmail ve web paneli {#webmail-and-the-web-dashboard}

Forward Email'de giriş yapılan iki ayrı yer vardır ve farklı kimlik bilgileri kullanırlar:

|                              | Web paneli (forwardemail.net)                                                                          | Webmail (mail.forwardemail.net ve uygulamalar)                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| **Giriş bilgileri**          | Forward Email hesabınızın e-posta adresi ve parolası (artı 2FA veya bir geçiş anahtarı)                | Bir takma ad adresi (`you@example.com` gibi) ve onun için oluşturulan parola           |
| **Kullanım amacı**           | Alan adı ekleme, DNS, takma adlar, faturalandırma, ekip üyeleri, parola oluşturma, Gelişmiş Ayarlar    | Posta okuma ve gönderme, klasörler, etiketler, arama, takvim, kişiler, filtreler       |
| **Burada oluşturulan parolalar** | Takma ad parolaları ve catch-all parolaları                                                        | Yok. Webmail, panelde oluşturduğunuz parolaları kullanır                               |

Yaygın bir kurulum şöyledir:

1. Panelde alan adınızı ekleyin ve DNS'i ayarlayın.
2. IMAP depolaması açık bir takma ad oluşturun (örneğin `you@example.com`).
3. Bu takma ad için bir parola oluşturun.
4. Bu takma ad ve parolayla webmail'e giriş yapın.

Posta göndermek için, diğer tüm e-posta istemcilerinde olduğu gibi, alan adınızda <a href="/my-account/domains">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Gelişmiş Ayarlar <i class="fa fa-angle-right"></i> Giden SMTP Yapılandırması altında giden SMTP'nin de açık olması gerekir.


## Giriş yapma {#signing-in}

### Takma ad parolası oluşturun {#generate-an-alias-password}

1. <a href="/my-account/domains">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar sayfasına gidin.
2. Takma adın yanındaki **Şifre Oluştur** düğmesine tıklayın.
3. Parolayı kopyalayın. Yalnızca bir kez gösterilir.

Bu, IMAP, POP3, SMTP, CalDAV ve CardDAV için kullanacağınız parolanın aynısıdır. Web paneline giriş için kullanılamaz.

### Webmail'e giriş yapın {#sign-in-to-webmail}

Webmail'i açın ve tam takma ad adresini ve oluşturulan parolayı girin. Önce yalnızca etrafa göz atmak istiyorsanız, giriş ekranındaki demoyu deneyin.


## Birden fazla hesap kullanma {#using-more-than-one-account}

Farklı alan adlarında olsalar bile, aynı anda birden fazla takma ada giriş yapabilirsiniz. Aralarında hesap menüsünden geçiş yapın ve onları **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Your accounts** bölümünden yönetin. Hesaplar, eklendikleri cihazda tutulur ve eşitlenmez.

### Giriş yapılmış başka bir hesap olarak gönderin {#send-as-another-signed-in-account}

Yazarken **From** menüsü bu cihazda giriş yapılmış tüm hesapları listeler. O adres olarak göndermek için birini seçin. İleti o hesabın kendi parolasıyla gönderilir ve kopyası o hesabın Gönderilenler klasörüne gider.


## Alan adınızdaki herhangi bir adresten gönderin {#send-from-any-address-on-your-domain}

Bir alan adına sahipseniz, her biri için takma ad oluşturup giriş yapmadan, `billing@example.com` veya `no-reply@example.com` gibi alan adındaki herhangi bir adresten gönderebilirsiniz. Bunu alan adı için bir **catch-all parolası** ile yaparsınız.

Webmail'e joker karakterli veya catch-all bir hesap olarak giriş **yapmazsınız** ve açılması gereken bir özellik yoktur. Catch-all parolasını webmail ayarlarına bir kez kaydedersiniz; ardından From menüsü o alan adındaki herhangi bir adresi yazmanıza izin verir.

### Adım 1: Panelde bir catch-all parolası oluşturun {#step-1-generate-a-catch-all-password-in-the-dashboard}

1. <a href="/my-account/domains">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> sayfasına gidin ve alan adınızı seçin.
2. **Gelişmiş Ayarlar** bölümünü açın ve **Tüm Parolaları Kapsayan Parolalar** bölümünü bulun.
3. **Şifre Oluştur** düğmesine tıklayın. Güçlü, rastgele bir parola almak için alanı boş bırakın ve isterseniz bir açıklama ekleyin (örneğin "Dizüstü bilgisayarımdaki webmail").
4. Parolayı kopyalayın. Yalnızca bir kez gösterilir.

Bu bölümü görmek için alan adının yöneticisi olmanız gerekir. Catch-all parolalarını daha sonra görmek veya silmek için aynı yerdeki **Şifreleri Yönet** seçeneğini kullanın. Bir parolayı silmek, kayıtlı olduğu her yerde çalışmasını durdurur.

### Adım 2: Webmail'e kaydedin {#step-2-save-it-in-webmail}

1. Webmail'de **Settings <i class="fa fa-angle-right"></i> General** bölümünü açın.
2. **Your accounts** bölümünün hemen altındaki **Send from any address** kartını bulun.
3. **Add catch-all password** düğmesine tıklayın.
4. Alan adını girin (örneğin `example.com`) ve catch-all parolasını yapıştırın.
5. **Save** düğmesine tıklayın. "You can now send from any address @example.com" mesajını görürsünüz.

İstediğiniz kadar alan adı için parola kaydedebilirsiniz. Birini kaldırmak için yanındaki çöp kutusu simgesine tıklayın.

### Adım 3: Yazarken adresi seçin {#step-3-pick-the-address-when-you-compose}

1. Yeni bir ileti başlatın.
2. **From** menüsünü açın. Giriş yapılmış hesaplarınızın altında, kayıtlı her alan adı için bir giriş bulunur: **Other address @example.com…**
3. Bunu seçin. From satırı, sonunda `@example.com` olan bir metin kutusuna dönüşür.
4. @ işaretinden önceki kısmı yazın (örneğin `billing`) ve gönderin.

Taslaklar yazdığınız adresi korur, bu nedenle kayıtlı bir taslak aynı From adresiyle yeniden açılır.

### Catch-all ile gönderme hakkında bilmeniz gerekenler {#what-to-know-about-catch-all-sending}

* **Yalnızca gönderebilir.** Catch-all parolası yalnızca göndermek için çalışır. Bir posta kutusu açamaz, bu yüzden onunla `billing@example.com` adresine gelen postaları okuyamazsınız. Yanıtları okumak için o adres için bir takma ad (veya size yönlendiren bir catch-all takma adı) oluşturun.
* **Gönderilen kopyalar kullandığınız hesaba gider.** `billing@example.com` olarak gönderilen bir ileti, yazdığınız hesabın Gönderilenler klasörüne kaydedilir.
* **Cihazdaki her hesaptan çalışır.** Kayıtlı parola, giriş yapılmış tek bir hesaba bağlı değildir. O cihazdaki herhangi bir hesap onu kullanabilir.
* **Bu cihazda kalır.** Parola yalnızca kaydettiğiniz cihazda saklanır. Eşitlenmez ve QR ile cihaz eşleştirme onu kopyalamaz. Her cihazda yeniden ekleyin.
* **App Lock onu korur.** App Lock açıksa, parola diğer yerel verilerinizle birlikte şifrelenir ve uygulama kilitliyken **Other address** girişleri gizlenir.
* **Zamanlanmış gönderim kullanılamaz**; catch-all parolasıyla gönderilen adresler için bu özellik yoktur, çünkü bu parola zamanlanmış bir iletiyi geri okuyamaz veya iptal edemez. Hemen gönderin ya da giriş yapılmış bir hesap olarak gönderin.
* **Yanlış bir parola oturumunuzu kapatmaz.** Catch-all parolası yanlışsa veya panelde silindiyse, gönderim bir hatayla başarısız olur ve oturumunuz açık kalır.


## Bir bakışta webmail ayarları {#webmail-settings-at-a-glance}

| Bölüm                  | Kapsadıkları                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| **General**            | Hesaplarınız, herhangi bir adresten gönderme (catch-all parolaları), bildirimler, depolama |
| **Appearance**         | Tema, düzen, yoğunluk, ileti yazma varsayılanları, imza, yazı tipi, harici bağlantılar     |
| **Privacy & Security** | App Lock, PGP şifreleme, gizlilik seçenekleri, spam bildirimi                              |
| **Folders & Labels**   | Özel klasörler, klasörleriniz, etiketler                                                   |
| **Filters**            | Giriş yapılmış takma ad için posta filtreleri                                              |
| **Calendar**           | Hafta başlangıcı ve görevler                                                               |
| **Search**             | Arama dizinleme, dizin durumu, kayıtlı aramalar, arama operatörleri                        |
| **Advanced**           | Posta kutusu depolaması, yerel önbellek ve uygulamayı sıfırlama                            |
| **Keyboard Shortcuts** | Tüm kısayollar                                                                             |
| **About & Help**       | Sürüm, masaüstü uygulaması indirme, geri bildirim ve bağlantılar                           |

DNS, yönlendirme alıcıları, depolama sınırları, tatil yanıtlayıcıları, catch-all parolaları ve spam taraması gibi alan adına veya takma adın kendisine ait şeyler <a href="/my-account/domains">web panelinde</a> ayarlanır.


## Gizlilik ve App Lock {#privacy-and-app-lock}

Webmail, hızlı olması ve çevrimdışı çalışabilmesi için postalarınızın yerel bir kopyasını tutar. **App Lock** (**Settings <i class="fa fa-angle-right"></i> Privacy & Security** bölümünde) bu yerel verileri, ayarlarınızı ve kayıtlı parolalarınızı cihazda şifreler ve bir geçiş anahtarı veya PIN ile kilidi açılır. Postalar ve canlı güncellemeler, arada hiçbir reklam veya izleme hizmeti olmadan doğrudan uygulama ile Forward Email arasında gider.


## Sorun giderme {#troubleshooting}

**"Can't send as <name@example.com>: sign in to that account on this device again, or save its domain's catch-all password in Settings."**

Webmail'in bu cihazda o adres için bir parolası yok. Ya o takma ada giriş yapın ya da alan adının catch-all parolasını **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Send from any address** bölümüne kaydedin. Uygulama kilitliyse önce kilidini açın.

**From menüsünde "Other address" girişi yok.**

Catch-all parolasını bu cihaza kaydettiğinizi ve App Lock kilidinin açık olduğunu kontrol edin.

**Catch-all adresinden gönderim bir kimlik doğrulama hatasıyla başarısız oluyor.**

Catch-all parolası silinmiş veya yanlış yazılmış olabilir. Panelde yeni bir tane oluşturun, ardından webmail'de eskisini kaldırıp yenisini ekleyin.

**Panel parolam webmail'de çalışmıyor.**

Webmail, panel parolanızı değil, bir takma ad parolasını gerektirir. Bkz. [Takma ad parolası oluşturun](#generate-an-alias-password).

Hâlâ takıldınız mı? <a href="/faq">SSS</a> sayfamıza göz atın veya <a href="/help">bizimle iletişime geçin</a>.
