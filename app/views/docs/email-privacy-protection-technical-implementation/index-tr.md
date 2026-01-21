# E-posta Yönlendirme, E-posta Yönlendirme ile Nasıl Çalışır: Kapsamlı Kılavuz {#how-email-forwarding-works-with-forward-email-the-ultimate-guide}

<img loading="lazy" src="/img/articles/email-privacy.webp" alt="Email privacy protection technical implementation" class="rounded-lg" />

## İçindekiler {#table-of-contents}

* [Önsöz](#foreword)
* [E-posta Yönlendirme Nedir?](#what-is-email-forwarding)
* [E-posta Yönlendirme Nasıl Çalışır: Teknik Açıklama](#how-email-forwarding-works-the-technical-explanation)
  * [E-posta Yönlendirme Süreci](#the-email-forwarding-process)
  * [SRS'nin (Gönderen Yeniden Yazma Şeması) Rolü](#the-role-of-srs-sender-rewriting-scheme)
* [E-posta Yönlendirme Nasıl Çalışır: Basit Açıklama](#how-email-forwarding-works-the-simple-explanation)
* [Forward Email ile E-posta Yönlendirmeyi Ayarlama](#setting-up-email-forwarding-with-forward-email)
  * [1. Bir Hesap Oluşturun](#1-sign-up-for-an-account)
  * [2. Alan Adınızı Ekleyin](#2-add-your-domain)
  * [3. DNS Kayıtlarını Yapılandırın](#3-configure-dns-records)
  * [4. E-posta Yönlendirmeleri Oluşturun](#4-create-email-forwards)
  * [5. Yeni E-posta Adreslerinizi Kullanmaya Başlayın](#5-start-using-your-new-email-addresses)
* [E-postayı İletmenin Gelişmiş Özellikleri](#advanced-features-of-forward-email)
  * [Tek Kullanımlık Adresler](#disposable-addresses)
  * [Çoklu Alıcılar ve Joker Karakterler](#multiple-recipients-and-wildcards)
  * ["Postaları Şu Şekilde Gönder" Entegrasyonu](#send-mail-as-integration)
  * [Kuantum Dirençli Güvenlik](#quantum-resistant-security)
  * [Bireysel Şifrelenmiş SQLite Posta Kutuları](#individually-encrypted-sqlite-mailboxes)
* [Rakipler Yerine Forward Email'i Neden Seçmelisiniz?](#why-choose-forward-email-over-competitors)
  * [1. %100 Açık Kaynak](#1-100-open-source)
  * [2. Gizlilik Odaklı](#2-privacy-focused)
  * [3. Üçüncü Taraflara Güvenilmemesi](#3-no-third-party-reliance)
  * [4. Maliyet Etkin Fiyatlandırma](#4-cost-effective-pricing)
  * [5. Sınırsız Kaynaklar](#5-unlimited-resources)
  * [6. Büyük Kuruluşlar Tarafından Güveniliyor](#6-trusted-by-major-organizations)
* [E-posta Yönlendirme için Yaygın Kullanım Örnekleri](#common-use-cases-for-email-forwarding)
  * [İşletmeler İçin](#for-businesses)
  * [Geliştiriciler İçin](#for-developers)
  * [Gizlilik Bilincine Sahip Bireyler İçin](#for-privacy-conscious-individuals)
* [E-posta Yönlendirme için En İyi Uygulamalar](#best-practices-for-email-forwarding)
  * [1. Açıklayıcı Adresler Kullanın](#1-use-descriptive-addresses)
  * [2. Uygun Kimlik Doğrulamayı Uygulayın](#2-implement-proper-authentication)
  * [3. İletilerinizi Düzenli Olarak İnceleyin](#3-regularly-review-your-forwards)
  * [4. Sorunsuz Yanıtlar için "Postaları Şu Adresten Gönder"i Ayarlayın](#4-set-up-send-mail-as-for-seamless-replies)
  * [5. Her Şeyi Kapsayan Adresleri Dikkatli Kullanın](#5-use-catch-all-addresses-cautiously)
* [Çözüm](#conclusion)

## Önsöz {#foreword}

E-posta yönlendirme, çevrimiçi iletişimlerinizi yönetme biçiminizi değiştirebilecek güçlü bir araçtır. İster özel alan adınızla profesyonel e-posta adresleri oluşturmak isteyen bir işletme sahibi, ister birincil e-postanızı korumak isteyen gizliliğe önem veren biri, ister esnek e-posta yönetimine ihtiyaç duyan bir geliştirici olun, günümüzün dijital dünyasında e-posta yönlendirmeyi anlamak çok önemlidir.

Forward Email olarak, dünyanın en güvenli, gizli ve esnek e-posta yönlendirme hizmetini geliştirdik. Bu kapsamlı kılavuzda, e-posta yönlendirmenin nasıl çalıştığını (hem teknik hem de pratik açıdan) açıklayacak, basit kurulum sürecimizi adım adım anlatacak ve hizmetimizin rakiplerinden neden öne çıktığını vurgulayacağız.

## E-posta Yönlendirme Nedir? {#what-is-email-forwarding}

E-posta yönlendirme, bir e-posta adresine gönderilen e-postaları otomatik olarak başka bir hedef adrese yönlendiren bir işlemdir. Örneğin, birisi <contact@yourdomain.com> adresine bir e-posta gönderdiğinde, bu ileti otomatik olarak kişisel Gmail, Outlook veya başka bir e-posta hesabınıza yönlendirilebilir.

Görünüşte basit olan bu özellik güçlü faydalar sunar:

* **Profesyonel Markalaşma**: Mevcut kişisel gelen kutunuzdan her şeyi yönetirken, özel alan adınıza (<siz@alanadiniz.com>) sahip e-posta adresleri kullanın.
* **Gizlilik Koruması**: Birincil e-postanızı koruyan tek kullanımlık veya amaca özel adresler oluşturun.
* **Basitleştirilmiş Yönetim**: Birden fazla e-posta adresini tek bir gelen kutusunda birleştirin.
* **Esneklik**: Birden fazla hesabı yönetmeden farklı amaçlar için sınırsız adres oluşturun.

## E-posta Yönlendirme Nasıl Çalışır: Teknik Açıklama {#how-email-forwarding-works-the-technical-explanation}

Teknik detaylarla ilgilenenler için, bir e-postanın iletilmesi sırasında perde arkasında neler yaşandığına bir göz atalım.

### E-posta Yönlendirme İşlemi {#the-email-forwarding-process}

1. **DNS Yapılandırması**: İşlem, alan adınızın DNS kayıtlarıyla başlar. E-posta yönlendirmeyi ayarladığınızda, alan adınıza ait e-postaların internette nereye iletileceğini belirten MX (Posta Değişimi) kayıtlarını yapılandırırsınız. Bu kayıtlar, e-posta sunucularımıza işaret eder.

2. **E-posta Alımı**: Birisi özel alan adı adresinize (örneğin, <siz@alanadiniz.com>) bir e-posta gönderdiğinde, e-posta sunucusu alan adınızın MX kayıtlarını arar ve mesajı sunucularımıza iletir.

3. **İşleme ve Kimlik Doğrulama**: Sunucularımız e-postayı alır ve birkaç kritik işlevi yerine getirir:
* SPF, DKIM ve DMARC gibi protokolleri kullanarak gönderenin kimliğini doğrular
* Kötü amaçlı içerik taraması yapar
* Alıcıyı yönlendirme kurallarınıza göre kontrol eder

4. **Gönderen Yeniden Yazma**: İşte sihir burada gerçekleşiyor. E-postanın dönüş yolunu değiştirmek için Gönderen Yeniden Yazma Şeması (SRS) kullanıyoruz. Bu çok önemli çünkü birçok e-posta sağlayıcısı, sahte gibi görünebilecekleri için uygun SRS uygulaması olmadan iletilen e-postaları reddediyor.

5. **Yönlendirme**: E-posta, orijinal içeriği bozulmadan hedef adresinize gönderilir.

6. **Teslimat**: E-posta, özel alan adınızın profesyonel görünümünü koruyarak, yönlendirme adresinize gönderilmiş gibi görünerek gelen kutunuza ulaşır.

### SRS'nin (Gönderen Yeniden Yazma Şeması) Rolü {#the-role-of-srs-sender-rewriting-scheme}

SRS, güvenilir e-posta yönlendirmesi için olmazsa olmaz olduğundan özel bir ilgiyi hak ediyor. Bir e-posta yönlendirildiğinde, e-postanın nihai hedefte SPF kontrollerinden geçmesini sağlamak için gönderenin adresinin yeniden yazılması gerekir.

SRS olmadan, iletilen e-postalar genellikle SPF doğrulamasından geçemez ve spam olarak işaretlenir veya tamamen reddedilir. SRS uygulamamız, iletilen e-postalarınızın güvenilir bir şekilde teslim edilmesini sağlarken, orijinal gönderen bilgilerinin sizin için şeffaf bir şekilde korunmasını sağlar.

## E-posta Yönlendirme Nasıl Çalışır: Basit Açıklama {#how-email-forwarding-works-the-simple-explanation}

Teknik detaylar gözünüzü korkutuyorsa, e-posta yönlendirmeyi anlamanın daha basit bir yolu şudur:

E-posta yönlendirmeyi, fiziksel postalar için posta yönlendirme gibi düşünün. Yeni bir eve taşındığınızda, posta hizmetinden eski adresinizdeki tüm postaları yeni adresinize yönlendirmesini isteyebilirsiniz. E-posta yönlendirme de benzer şekilde çalışır, ancak dijital mesajlar için geçerlidir.

E-postayı İlet ile:

1. Alan adınızda hangi e-posta adreslerini kurmak istediğinizi bize bildirin (örneğin <sales@yourdomain.com> veya <contact@yourdomain.com>)
2. Bu e-postaların nereye iletilmesini istediğinizi bize bildirin (örneğin Gmail veya Outlook hesabınız)
3. Özel adreslerinize gönderilen e-postaların belirttiğiniz gelen kutunuza güvenli bir şekilde ulaşmasını sağlamak için tüm teknik ayrıntıları biz hallederiz.

İşte bu kadar basit! Mevcut e-posta iş akışınızı değiştirmeden profesyonel e-posta adreslerini kullanabilirsiniz.

## E-posta İletme Özelliğini {#setting-up-email-forwarding-with-forward-email} ile Ayarlama

Forward Email'in en büyük avantajlarından biri, kurulumunun ne kadar kolay olduğudur. İşte adım adım bir kılavuz:

### 1. Bir Hesap Oluşturun {#1-sign-up-for-an-account}

[forwardemail.net](https://forwardemail.net) adresini ziyaret edin ve ücretsiz bir hesap oluşturun. Kayıt işlemimiz bir dakikadan az sürer.

### 2. Alan Adınızı Ekleyin {#2-add-your-domain}

Giriş yaptıktan sonra, e-posta yönlendirme için kullanmak istediğiniz alan adını ekleyin. Henüz bir alan adınız yoksa, önce bir alan adı kayıt kuruluşundan satın almanız gerekir.

### 3. DNS Kayıtlarını Yapılandırın {#3-configure-dns-records}

Alan adınıza eklemeniz gereken DNS kayıtlarını size tam olarak sağlayacağız. Bu genellikle şunları içerir:

* E-posta sunucularımıza yönlendiren MX kayıtları ekleme
* Doğrulama ve güvenlik için TXT kayıtları ekleme

Çoğu alan adı kayıt kuruluşunun bu kayıtları eklemek için basit bir arayüzü vardır. Bu süreci olabildiğince sorunsuz hale getirmek için tüm büyük alan adı kayıt kuruluşlarına ayrıntılı kılavuzlar sunuyoruz.

### 4. E-posta Yönlendirmeleri Oluşturun {#4-create-email-forwards}

DNS kayıtlarınız doğrulandıktan sonra (ki bu genellikle sadece birkaç dakika sürer), e-posta yönlendirmeleri oluşturabilirsiniz. Tek yapmanız gereken şunu belirtmek:

* Alan adınızdaki e-posta adresi (ör. <contact@yourdomain.com>)
* E-postaların gönderilmesini istediğiniz hedef adres (ör. kişisel Gmail adresiniz)

### 5. Yeni E-posta Adreslerinizi Kullanmaya Başlayın {#5-start-using-your-new-email-addresses}

İşte bu kadar! Özel alan adı adreslerinize gönderilen e-postalar artık belirlediğiniz hedefe yönlendirilecek. Alan adınızdaki herhangi bir adrese gönderilen tüm e-postaları yönlendiren "toplu e-posta" adresleri de dahil olmak üzere, ihtiyacınız olan sayıda yönlendirme oluşturabilirsiniz.

## E-postayı İletmenin Gelişmiş Özellikleri {#advanced-features-of-forward-email}

Temel e-posta yönlendirme kendi başına güçlü bir özellik olsa da, Forward Email bizi diğerlerinden ayıran birçok gelişmiş özellik sunar:

### Tek Kullanımlık Adresler {#disposable-addresses}

Ana hesabınıza yönlendiren özel veya anonim e-posta adresleri oluşturun. Bu adreslere etiketler atayabilir ve gelen kutunuzu düzenli tutmak için bunları istediğiniz zaman etkinleştirebilir veya devre dışı bırakabilirsiniz. Gerçek e-posta adresiniz asla ifşa edilmez.

### Birden Fazla Alıcı ve Joker Karakter {#multiple-recipients-and-wildcards}

Tek bir adresi birden fazla alıcıya yönlendirerek, bir ekiple bilgi paylaşımını kolaylaştırın. Ayrıca, alan adınızdaki herhangi bir adrese gönderilen e-postaları almak için joker karakterli adresler (her şeyi kapsayan yönlendirme) de kullanabilirsiniz.

### "Postayı Şu Şekilde Gönder" Entegrasyonu {#send-mail-as-integration}

Özel alan adınızdan e-posta göndermek için gelen kutunuzdan ayrılmanıza gerek kalmayacak. <siz@alanadiniz.com> adresinden geliyormuş gibi doğrudan Gmail veya Outlook hesabınızdan iletiler gönderin ve yanıtlayın.

### Kuantum Dirençli Güvenlik {#quantum-resistant-security}

Kuantum dirençli şifrelemeyi kullanan dünyanın ilk ve tek e-posta hizmetiyiz; iletişimlerinizi gelecekteki en gelişmiş tehditlere karşı bile koruyoruz.

### Bireysel Şifrelenmiş SQLite Posta Kutuları {#individually-encrypted-sqlite-mailboxes}

Tüm kullanıcı e-postalarını paylaşımlı veritabanlarında saklayan diğer sağlayıcıların aksine, benzersiz gizlilik ve güvenlik için ayrı ayrı şifrelenmiş SQLite posta kutuları kullanıyoruz.

## Neden Rakipler Yerine E-posta İletmeyi Seçmelisiniz? {#why-choose-forward-email-over-competitors}

E-posta yönlendirme pazarında birçok oyuncu var, ancak Forward Email birkaç önemli açıdan öne çıkıyor:

### 1. %100 Açık Kaynak {#1-100-open-source}

Arka uç kodlarımız da dahil olmak üzere tamamen açık kaynaklı tek e-posta yönlendirme hizmetiyiz. Bu şeffaflık, güven oluşturur ve bağımsız güvenlik denetimlerine olanak tanır. Diğer hizmetler açık kaynaklı olduklarını iddia edebilir, ancak arka uç kodlarını yayınlamazlar.

### 2. Gizlilik Odaklı {#2-privacy-focused}

Bu hizmeti, gizlilik hakkınız olduğu için oluşturduk. TLS ile güçlü şifreleme kullanıyoruz, SMTP günlüklerini (hatalar ve giden SMTP hariç) saklamıyoruz ve e-postalarınızı disk depolama alanına yazmıyoruz.

### 3. Üçüncü Tarafa Güven Yok {#3-no-third-party-reliance}

Amazon SES veya diğer üçüncü taraf hizmetlere güvenen rakiplerin aksine, altyapımız üzerinde tam kontrole sahip olarak hem güvenilirliği hem de gizliliği artırıyoruz.

### 4. Maliyet Etkin Fiyatlandırma {#4-cost-effective-pricing}

Fiyatlandırma modelimiz, uygun maliyetli bir şekilde ölçeklenmenizi sağlar. Kullanıcı başına ücret almıyoruz ve depolama alanı için kullandıkça ödeme yapabilirsiniz. Aylık 3 ABD doları ile Gandi (aylık 3,99 ABD doları) gibi rakiplerimizden daha düşük bir fiyata daha fazla özellik sunuyoruz.

### 5. Sınırsız Kaynaklar {#5-unlimited-resources}

Birçok rakibimizin yaptığı gibi alan adlarına, takma adlara veya e-posta adreslerine yapay sınırlamalar getirmiyoruz.

### 6. Büyük Kuruluşlar Tarafından Güvenilen {#6-trusted-by-major-organizations}

Hizmetimiz, [ABD Deniz Harp Okulu](/blog/docs/federal-government-email-service-section-889-compliant), Netflix, [Linux Vakfı](/blog/docs/linux-foundation-email-enterprise-case-study), [Kanonik/Ubuntu](/blog/docs/canonical-ubuntu-email-enterprise-case-study), Disney Ad Sales ve daha birçok önemli kuruluş dahil olmak üzere 500.000'den fazla alan adı tarafından kullanılmaktadır.

## E-posta Yönlendirme için Yaygın Kullanım Örnekleri {#common-use-cases-for-email-forwarding}

E-posta yönlendirme, farklı kullanıcı tipleri için çok sayıda zorluğun çözülmesini sağlar:

### İşletmeler İçin {#for-businesses}

* Farklı departmanlar için profesyonel e-posta adresleri oluşturun (sales@, support@, info@)
* Ekip e-posta iletişimlerini kolayca yönetin
* Tüm iletişimlerde marka tutarlılığını koruyun
* Personel değişiklikleri sırasında e-posta yönetimini basitleştirin

### Geliştiriciler İçin {#for-developers}

* Otomatik bildirim sistemleri kurun
* Farklı projeler için amaca özel adresler oluşturun
* Gelişmiş otomasyon için webhook'larla entegre edin
* Özel uygulamalar için API'mizden yararlanın

### Gizlilik Bilincine Sahip Bireyler İçin {#for-privacy-conscious-individuals}

* Bilgilerinizi kimlerin paylaştığını takip etmek için farklı hizmetler için ayrı e-posta adresleri oluşturun
* Tek seferlik kayıtlar için tek kullanımlık adresler kullanın
* Birincil e-posta adresinizi koruyarak gizliliği koruyun
* Spam almaya başlayan adresleri kolayca devre dışı bırakın

## E-posta Yönlendirme için En İyi Uygulamalar {#best-practices-for-email-forwarding}

E-posta yönlendirmeden en iyi şekilde yararlanmak için şu en iyi uygulamaları göz önünde bulundurun:

### 1. Açıklayıcı Adresler Kullanın {#1-use-descriptive-addresses}

Gelen postalarınızı düzenlemenize yardımcı olması için amacını açıkça belirten e-posta adresleri oluşturun (örneğin, <newsletter@yourdomain.com>, <shopping@yourdomain.com>).

### 2. Uygun Kimlik Doğrulamasını Uygulayın {#2-implement-proper-authentication}

Teslimatı en üst düzeye çıkarmak için alan adınızın uygun SPF, DKIM ve DMARC kayıtlarına sahip olduğundan emin olun. Forward Email, rehberli kurulumumuzla bunu kolaylaştırır.

### 3. İletilerinizi Düzenli Olarak İnceleyin {#3-regularly-review-your-forwards}

Artık ihtiyaç duyulmayan veya aşırı spam alan e-posta iletilerini devre dışı bırakmak için e-posta iletilerinizi düzenli olarak denetleyin.

### 4. Sorunsuz Yanıtlar için "Postaları Şu Şekilde Gönder" Ayarını Yapın {#4-set-up-send-mail-as-for-seamless-replies}

İletilen e-postalara yanıt verirken tutarlı bir deneyim için ana e-posta istemcinizi, postaları özel etki alanı adresleriniz olarak gönderecek şekilde yapılandırın.

### 5. Tüm Adresleri Dikkatli Kullanın {#5-use-catch-all-addresses-cautiously}

Her şeyi kapsayan adresler kullanışlı olsa da, potansiyel olarak daha fazla spam alabilirler. Önemli iletişimler için özel yönlendirmeler oluşturmayı düşünün.

## Sonuç {#conclusion}

E-posta yönlendirme, e-posta iletişimlerinize profesyonellik, gizlilik ve sadelik katan güçlü bir araçtır. Forward Email ile mevcut en güvenli, gizli ve esnek e-posta yönlendirme hizmetine sahip olursunuz.

Kuantum dirençli şifreleme ve gizliliğe odaklanma özelliğine sahip %100 açık kaynaklı tek sağlayıcı olarak, haklarınıza saygı duyarken olağanüstü işlevsellik sunan bir hizmet oluşturduk.

İşletmeniz için profesyonel e-posta adresleri oluşturmak, tek kullanımlık adreslerle gizliliğinizi korumak veya birden fazla e-posta hesabının yönetimini basitleştirmek istiyorsanız, Forward Email mükemmel çözümü sunar.

E-posta deneyiminizi dönüştürmeye hazır mısınız? Bugün [Ücretsiz kaydolun](https://forwardemail.net)'ı seçin ve hizmetimizden faydalanan 500.000'den fazla alan adına katılın.

---

*Bu blog yazısı, dünyanın en güvenli, gizli ve esnek e-posta yönlendirme hizmetinin yaratıcıları olan Forward Email ekibi tarafından yazılmıştır. Hizmetimiz hakkında daha fazla bilgi edinmek ve e-postalarınızı güvenle yönlendirmeye başlamak için [forwardemail.net](https://forwardemail.net) adresini ziyaret edin.*