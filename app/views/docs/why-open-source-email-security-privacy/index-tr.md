# Açık Kaynaklı E-posta Neden Gelecek: Yönlendirmeli E-posta Avantajı {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="tembel" src="/img/articles/open-source.webp" alt="" class="rounded-lg" />

## İçindekiler {#table-of-contents}

* [Önsöz](#foreword)
* [Açık Kaynak Avantajı: Sadece Pazarlamadan Daha Fazlası](#the-open-source-advantage-more-than-just-marketing)
  * [Gerçek Açık Kaynak Ne Anlama Gelir](#what-true-open-source-means)
  * [Arka Uç Sorunu: Çoğu "Açık Kaynaklı" E-posta Hizmetinin Yetersiz Kaldığı Noktalar](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [E-postayı İlet: %100 Açık Kaynak, Ön Uç VE Arka Uç](#forward-email-100-open-source-frontend-and-backend)
  * [Benzersiz Teknik Yaklaşımımız](#our-unique-technical-approach)
* [Kendi Kendine Barındırma Seçeneği: Seçim Özgürlüğü](#the-self-hosting-option-freedom-of-choice)
  * [Neden Kendi Kendine Barındırmayı Destekliyoruz](#why-we-support-self-hosting)
  * [Kendi Kendine Barındırılan E-postanın Gerçeği](#the-reality-of-self-hosting-email)
* [Ücretli Hizmetimiz Neden Mantıklı (Açık Kaynaklı Olsak Bile)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Maliyet Karşılaştırması](#cost-comparison)
  * [Her İki Dünyanın En İyisi](#the-best-of-both-worlds)
* [Kapalı Kaynaklı Aldatmaca: Proton ve Tutanota'nın Size Söylemediği Şeyler](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Proton Mail'in Açık Kaynak İddiaları](#proton-mails-open-source-claims)
  * [Tutanota'nın Benzer Yaklaşımı](#tutanotas-similar-approach)
  * [Gizlilik Kılavuzları Tartışması](#the-privacy-guides-debate)
* [Gelecek Açık Kaynaklı](#the-future-is-open-source)
  * [Açık Kaynak Neden Kazanıyor?](#why-open-source-is-winning)
* [E-postayı İletmeye Geçiş Yapma](#making-the-switch-to-forward-email)
* [Sonuç: Özel Bir Gelecek İçin Açık Kaynaklı E-posta](#conclusion-open-source-email-for-a-private-future)

## Önsöz {#foreword}

Dijital gizlilik endişelerinin her zamankinden daha yüksek olduğu bir çağda, seçtiğimiz e-posta hizmetleri her zamankinden daha fazla önem taşıyor. Birçok sağlayıcı gizliliğinize öncelik verdiğini iddia etse de, yalnızca gizlilik hakkında konuşanlar ile gerçekten bunu yapanlar arasında temel bir fark vardır. Forward Email'de, hizmetimizi yalnızca ön uç uygulamalarımızda değil, tüm altyapımızda açık kaynaklı geliştirme yoluyla tam şeffaflık temeline kurduk.

Bu blog yazısı, açık kaynaklı e-posta çözümlerinin kapalı kaynaklı alternatiflere göre neden daha üstün olduğunu, yaklaşımımızın Proton Mail ve Tutanota gibi rakiplerimizden nasıl farklılaştığını ve kendi kendine barındırma seçeneklerine olan bağlılığımıza rağmen ücretli hizmetimizin neden çoğu kullanıcı için en iyi değeri sunduğunu araştırıyor.

## Açık Kaynak Avantajı: Sadece Pazarlamadan Daha Fazlası {#the-open-source-advantage-more-than-just-marketing}

"Açık kaynak" terimi son yıllarda popüler bir pazarlama modası haline geldi ve küresel açık kaynak hizmetleri pazarının 2024 ile 2032 arasında %16'nın üzerinde bir bileşik yıllık büyüme oranıyla büyümesi öngörülüyor\[^1]. Peki gerçekten açık kaynak olmak ne anlama geliyor ve e-posta gizliliğiniz için neden önemli?

### Gerçek Açık Kaynak Ne Anlama Gelir? {#what-true-open-source-means}

Açık kaynaklı yazılım, tüm kaynak kodunu herkesin incelemesi, değiştirmesi ve geliştirmesi için serbestçe kullanılabilir hale getirir. Bu şeffaflık, şu ortamı yaratır:

* Güvenlik açıkları, küresel bir geliştirici topluluğu tarafından belirlenip düzeltilebilir
* Gizlilik iddiaları, bağımsız kod incelemesi yoluyla doğrulanabilir
* Kullanıcılar, tescilli ekosistemlere kilitlenmez
* Yenilik, işbirlikçi iyileştirme yoluyla daha hızlı gerçekleşir

Çevrimiçi kimliğinizin omurgasını oluşturan e-posta söz konusu olduğunda, bu şeffaflık yalnızca hoş bir şey değil; aynı zamanda gerçek gizlilik ve güvenlik için de olmazsa olmazdır.

### Arka Uç Sorunu: Çoğu "Açık Kaynaklı" E-posta Hizmetinin Yetersiz Kaldığı Nokta {#the-backend-problem-where-most-open-source-email-services-fall-short}

İşler burada ilginçleşiyor. Birçok popüler "gizlilik odaklı" e-posta sağlayıcısı kendilerini açık kaynaklı olarak tanıtıyor, ancak fark etmeyeceğinizi umdukları kritik bir ayrım var: **sadece ön uçlarını açık kaynaklı hale getirirken arka uçlarını kapalı tutuyorlar**.

Bu ne anlama geliyor? Ön uç, gördüğünüz ve etkileşim kurduğunuz şeydir; web arayüzü veya mobil uygulama. Arka uç, gerçek e-posta işlemenin gerçekleştiği yerdir; mesajlarınızın depolandığı, şifrelendiği ve iletildiği yerdir. Bir sağlayıcı arka ucunu kapalı kaynak olarak tuttuğunda:

1. E-postalarınızın gerçekte nasıl işlendiğini doğrulayamıyorsunuz
2. Gizlilik iddialarının meşru olup olmadığını doğrulayamıyorsunuz
3. Doğrulanabilir koddan ziyade pazarlama iddialarına güveniyorsunuz
4. Güvenlik açıkları kamu incelemesinden gizli kalabilir

Gizlilik Kılavuzları forumlarındaki tartışmaların da vurguladığı gibi, hem Proton Mail hem de Tutanota açık kaynaklı olduklarını iddia ediyor, ancak arka uçları kapalı ve tescilli kalıyor\[^2]. Bu önemli bir güven boşluğu yaratıyor; gizlilik vaatlerine inanmanız isteniyor ancak bunları doğrulama olanağınız yok.

## E-postayı İlet: %100 Açık Kaynak, Ön Uç VE Arka Uç {#forward-email-100-open-source-frontend-and-backend}

Forward Email olarak, temelde farklı bir yaklaşım benimsedik. Tüm kod tabanımız (hem ön uç hem de arka uç) açık kaynaklıdır ve herkesin <https://github.com/forwardemail/forwardemail.net>. adresinden incelemesine açıktır.

Bu şu anlama gelir:

1. **Tam Şeffaflık**: E-postalarınızı işleyen her kod satırı kamu incelemesine açıktır.
2. **Doğrulanabilir Gizlilik**: Gizlilik iddialarımız pazarlama söylemi değildir; herkesin kodumuzu inceleyerek doğrulayabileceği doğrulanabilir gerçeklerdir.
3. **Topluluk Odaklı Güvenlik**: Güvenliğimiz, küresel geliştirici topluluğunun kolektif uzmanlığıyla güçlendirilmiştir.
4. **Gizli İşlevsellik Yok**: Ne görüyorsanız onu alırsınız; gizli izleme yok, gizli arka kapılar yok.

### Benzersiz Teknik Yaklaşımımız {#our-unique-technical-approach}

Gizliliğe olan bağlılığımız yalnızca açık kaynaklı olmaktan ötedir. Bizi farklı kılan birkaç teknik yenilik uyguladık:

#### Bireysel Şifrelenmiş SQLite Posta Kutuları {#individually-encrypted-sqlite-mailboxes}

Paylaşımlı ilişkisel veritabanları kullanan geleneksel e-posta sağlayıcılarının aksine (tek bir ihlalin tüm kullanıcıların verilerini ifşa edebileceği yerlerde), her posta kutusu için ayrı ayrı şifrelenmiş SQLite dosyaları kullanıyoruz. Bu şu anlama gelir:

* Her posta kutusu ayrı bir şifrelenmiş dosyadır
* Bir kullanıcının verilerine erişim, diğerlerine erişim hakkı vermez
* Kendi çalışanlarımız bile verilerinize erişemez—bu temel bir tasarım kararıdır

Gizlilik Kılavuzları tartışmalarında açıkladığımız gibi:

> "Paylaşımlı ilişkisel veritabanları (örneğin, MongoDB, SQL Server, PostgreSQL, Oracle, MySQL, vb.) veritabanı bağlantısını kurmak için bir oturum açma (kullanıcı adı/şifre ile) gerektirir. Bu, bu şifreye sahip olan herkesin veritabanında herhangi bir şey sorgulayabileceği anlamına gelir. İster kötü niyetli bir çalışan ister kötü niyetli bir hizmetçi saldırısı olsun. Bu ayrıca, bir kullanıcının verilerine erişebilmeniz durumunda diğer herkesin verilerine de erişebileceğiniz anlamına gelir. Öte yandan, SQLite paylaşımlı bir veritabanı olarak düşünülebilir, ancak onu nasıl kullandığımız (her posta kutusu = ayrı bir SQLite dosyası) onu korumalı hale getirir."\[^3]

#### Kuantum Dirençli Şifreleme {#quantum-resistant-encryption}

Diğer sağlayıcılar henüz bu konuda ilerleme kaydedememişken, biz kuantum bilişiminden kaynaklanan yeni tehditlere karşı e-posta gizliliğinizi geleceğe hazırlamak için kuantum dirençli şifreleme yöntemlerini uygulamaya koyduk.

#### Üçüncü Taraf Bağımlılığı Yok {#no-third-party-dependencies}

E-posta teslimi için Amazon SES gibi hizmetlere güvenen rakiplerin aksine, tüm altyapımızı şirket içinde oluşturduk. Bu, üçüncü taraf hizmetler aracılığıyla olası gizlilik sızıntılarını ortadan kaldırır ve bize tüm e-posta hattı üzerinde tam kontrol sağlar.

## Kendi Kendine Barındırma Seçeneği: Seçim Özgürlüğü {#the-self-hosting-option-freedom-of-choice}

Açık kaynaklı yazılımların en güçlü yönlerinden biri sağladığı özgürlüktür. Forward Email ile asla kilitli kalmazsınız; isterseniz tüm platformumuzu kendiniz barındırabilirsiniz.

### Neden Kendinden Barındırmayı Destekliyoruz? {#why-we-support-self-hosting}

Kullanıcılara verileri üzerinde tam kontrol sağlamayı düşünüyoruz. Bu nedenle, kapsamlı dokümantasyon ve kurulum kılavuzlarıyla tüm platformumuzu kendi kendine barındırılabilir hale getirdik. Bu yaklaşım:

* Teknik eğilimli kullanıcılar için maksimum kontrol sağlar
* Bir hizmet sağlayıcı olarak bize güvenme ihtiyacını ortadan kaldırır
* Belirli gereksinimleri karşılamak için özelleştirmeye izin verir
* Şirketimiz olmasa bile hizmetin devam etmesini sağlar

### E-postayı Kendi Kendine Barındırmanın Gerçeği {#the-reality-of-self-hosting-email}

Kendi kendinize barındırma güçlü bir seçenek olsa da, söz konusu gerçek maliyetleri anlamak önemlidir:

#### Finansal Maliyetler {#financial-costs}

* VPS veya sunucu maliyetleri: Temel bir kurulum için ayda 5-50 ABD doları\[^4]
* Alan adı kaydı ve yenileme: yılda 10-20 ABD doları
* SSL sertifikaları (Let's Encrypt ücretsiz seçenekler sunsa da)
* İzleme hizmetleri ve yedekleme çözümleri için potansiyel maliyetler

#### Zaman Maliyetleri {#time-costs}

* İlk kurulum: Teknik uzmanlığa bağlı olarak birkaç saat ila birkaç gün
* Devam eden bakım: Güncellemeler, güvenlik yamaları ve sorun giderme için ayda 5-10 saat\[^5]
* Öğrenme eğrisi: E-posta protokollerini, güvenlik en iyi uygulamalarını ve sunucu yönetimini anlama

#### Teknik Sorunlar {#technical-challenges}

* E-posta teslim edilebilirliği sorunları (mesajların spam olarak işaretlenmesi)
* Gelişen güvenlik standartlarını takip etme
* Yüksek kullanılabilirlik ve güvenilirliği sağlama
* Spam filtrelemeyi etkili bir şekilde yönetme

Deneyimli bir kendi kendine barındırmacının dediği gibi: "E-posta bir emtia hizmetidir... E-postamı bir sağlayıcıda barındırmak, para ve zaman harcayarak kendi kendime barındırmaktan daha ucuzdur."\[^6]

## Ücretli Hizmetimiz Neden Mantıklı (Açık Kaynaklı Olsak Bile) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Kendi kendinize barındırmanın zorlukları göz önüne alındığında, ücretli hizmetimiz her iki dünyanın da en iyisini sunar: açık kaynak kodunun şeffaflığı ve güvenliği ile yönetilen bir hizmetin rahatlığı ve güvenilirliği.

### Maliyet Karşılaştırması {#cost-comparison}

Hem maliyet hem de zaman maliyetlerini hesaba kattığınızda, ücretli hizmetimiz olağanüstü bir değer sunar:

* **Kendi kendine barındırma toplam maliyeti**: 56-252$/ay (sunucu maliyetleri ve zaman değerlemesi dahil)
* **Ödemeli E-posta Yönlendirme planları**: 3-9$/ay

Ücretli hizmetimiz şunları sağlar:

* Profesyonel yönetim ve bakım
* Daha iyi teslimat için yerleşik IP itibarı
* Düzenli güvenlik güncellemeleri ve izleme
* Sorunlar ortaya çıktığında destek
* Açık kaynaklı yaklaşımımızın tüm gizlilik avantajları

### Her İki Dünyanın En İyisi {#the-best-of-both-worlds}

E-postayı İlet'i seçerek şunları elde edersiniz:

1. **Doğrulanabilir Gizlilik**: Açık kaynaklı kod tabanımız, gizlilik iddialarımıza güvenebileceğiniz anlamına gelir
2. **Profesyonel Yönetim**: E-posta sunucusu uzmanı olmanıza gerek yok
3. **Maliyet Etkinliği**: Kendi kendine barındırmadan daha düşük toplam maliyet
4. **Bağlantıdan Kurtulma**: Kendi kendine barındırma seçeneği her zaman kullanılabilir kalır

## Kapalı Kaynaklı Aldatmaca: Proton ve Tutanota'nın Size Söylemediği Şeyler {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Yaklaşımımızın popüler "gizlilik odaklı" e-posta sağlayıcılarından nasıl farklılaştığına daha yakından bakalım.

### Proton Mail'in Açık Kaynak İddiaları {#proton-mails-open-source-claims}

Proton Mail kendini açık kaynaklı olarak tanıtır, ancak bu yalnızca ön uç uygulamaları için geçerlidir. E-postalarınızın gerçekten işlendiği ve depolandığı arka uçları kapalı kaynaklı kalır\[^7]. Bu şu anlama gelir:

* E-postalarınızın nasıl işlendiğini doğrulayamazsınız
* Doğrulama olmadan gizlilik iddialarına güvenmelisiniz
* Arka uçlarındaki güvenlik açıkları kamu incelemesinden gizli kalır
* Kendi kendine barındırma seçenekleri olmadan ekosistemlerine kilitlenirsiniz

### Tutanota'nın Benzer Yaklaşımı {#tutanotas-similar-approach}

Proton Mail gibi Tutanota da yalnızca ön uçlarını açık kaynaklı hale getirirken arka uçlarını özel tutuyor\[^8]. Aynı güven sorunlarıyla karşı karşıya kalıyorlar:

* Arka uç gizlilik iddialarını doğrulamanın bir yolu yok
* Gerçek e-posta işleme konusunda sınırlı şeffaflık
* Genel görünümden gizlenen potansiyel güvenlik sorunları
* Kendi kendine barındırma seçeneği olmadan satıcıya bağlılık

### Gizlilik Kılavuzları Tartışması {#the-privacy-guides-debate}

Bu sınırlamalar gizlilik topluluğunda fark edilmeden kalmadı. Gizlilik Kılavuzları'ndaki tartışmalarda, bu kritik ayrımı vurguladık:

> "Hem Protonmail hem de Tuta'nın kapalı kaynak olduğunu belirtiyor. Çünkü arka uçları gerçekten kapalı kaynak."\[^9]

Ayrıca şunu da belirttik:

> "Şu anda listelenen herhangi bir PG e-posta servis sağlayıcısının arka uç altyapılarının kamuya açık bir şekilde paylaşılan hiçbir denetimi veya gelen e-postaları nasıl işlediklerine dair açık kaynak kod parçacıkları paylaşılmadı."\[^10]

Bu şeffaflık eksikliği temel bir güven sorunu yaratır. Açık kaynaklı arka uçlar olmadan, kullanıcılar gizlilik iddialarını doğrulama yerine inançla kabul etmeye zorlanır.

## Gelecek Açık Kaynaklıdır {#the-future-is-open-source}

Yazılım sektöründe açık kaynaklı çözümlere doğru eğilim hız kazanıyor. Son araştırmalara göre:

* Açık kaynaklı yazılım pazarı 2024'te 41,83 milyar dolardan 2025'te 48,92 milyar dolara çıkıyor\[^11]
* Şirketlerin %80'i geçen yıl açık kaynaklı yazılım kullanımının arttığını bildiriyor\[^12]
* Açık kaynaklı yazılımların benimsenmesinin hızla artmaya devam etmesi öngörülüyor

Bu büyüme, yazılım güvenliği ve gizliliği hakkında düşünme şeklimizde temel bir değişimi yansıtıyor. Kullanıcılar gizlilik konusunda daha bilinçli hale geldikçe, açık kaynaklı çözümler aracılığıyla doğrulanabilir gizliliğe olan talep yalnızca artacaktır.

### Açık Kaynak Neden Kazanıyor? {#why-open-source-is-winning}

Açık kaynak kodlu yazılımların avantajları giderek daha da belirginleşiyor:

1. **Şeffaflık Yoluyla Güvenlik**: Açık kaynak kodu yalnızca dahili bir ekip tarafından değil, binlerce uzman tarafından incelenebilir
2. **Daha Hızlı Yenilik**: İşbirlikli geliştirme, iyileştirmeyi hızlandırır
3. **Doğrulama Yoluyla Güven**: İddialar inançla kabul edilmek yerine doğrulanabilir
4. **Satıcıya Bağlı Kalmaktan Kurtulma**: Kullanıcılar verileri ve hizmetleri üzerinde kontrolü korur
5. **Topluluk Desteği**: Küresel bir topluluk, sorunları belirlemeye ve düzeltmeye yardımcı olur

## E-postaları İletmeye Geçiş {#making-the-switch-to-forward-email}

İster Gmail gibi ana akım bir sağlayıcıdan, ister Proton Mail veya Tutanota gibi gizlilik odaklı başka bir hizmetten geliyor olun, Forward Email'e geçmek oldukça basittir.

Hizmetimiz şunları sunmaktadır:

* Sınırsız alan adı ve takma ad
* Özel köprüler olmadan standart protokol desteği (SMTP, IMAP, POP3)
* Mevcut e-posta istemcileriyle sorunsuz entegrasyon
* Kapsamlı belgelerle basit kurulum süreci
* Aylık sadece 3$'dan başlayan uygun fiyatlı planlar

## Sonuç: Özel Bir Gelecek İçin Açık Kaynaklı E-posta {#conclusion-open-source-email-for-a-private-future}

Dijital gizliliğin giderek daha fazla tehdit altında olduğu bir dünyada, açık kaynaklı çözümlerin şeffaflığı önemli bir koruma sağlar. Forward Email'de, e-posta gizliliğine yönelik tamamen açık kaynaklı yaklaşımımızla öncülük etmekten gurur duyuyoruz.

Açık kaynak kodlu yazılımları yalnızca kısmen benimseyen rakiplerimizin aksine, tüm platformumuzu (ön uç ve arka uç) kamu denetimine açtık. Şeffaflığa olan bu bağlılığımız, yenilikçi teknik yaklaşımımızla birleştiğinde, kapalı kaynak kodlu alternatiflerin asla yakalayamayacağı düzeyde doğrulanabilir gizlilik sağlar.

Yönetilen hizmetimizi kullanmayı veya platformumuzu kendiniz barındırmayı seçmeniz fark etmeksizin, gerçek anlamda açık kaynaklı e-postanın sağladığı güvenlik, gizlilik ve gönül rahatlığından faydalanırsınız.

E-postanın geleceği açık, şeffaf ve gizlilik odaklıdır. Gelecek, Forward Email'dır.

\[^1]: SNS Insider. "Açık Kaynak Hizmetleri Pazarı, 2023 yılında 28,6 milyar ABD doları değerindeydi ve 2032 yılına kadar %16,70'lik bir bileşik yıllık büyüme oranıyla 114,8 milyar ABD dolarına ulaşacak." [Açık Kaynak Hizmetleri Pazarı Boyutu ve Analiz Raporu 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Gizlilik Kılavuzları Topluluğu. "E-postayı İlet (e-posta sağlayıcısı) - Site Geliştirme / Araç Önerileri." [Gizlilik Kılavuzları Tartışması](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Gizlilik Kılavuzları Topluluğu. "E-postayı İlet (e-posta sağlayıcısı) - Site Geliştirme / Araç Önerileri." [Gizlilik Kılavuzları Tartışması](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. "Genellikle, e-posta sunucunuzu çalıştırmak için temel bir sanal özel sunucu (VPS) için aylık 5 ila 50 dolar arasında bir ücret ödemeniz beklenir." [2025'te Kullanılacak En İyi 10 Kendinden Barındırılan E-posta Sunucusu Platformu](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Mail-in-a-Box Forumu. "Bakım o dönemde yaklaşık 16 saatimi aldı..." [Kendi kendine barındırılan posta sunucusu hoş karşılanmıyor](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)

\[^6]: Reddit r/selfhosted. "ÖZET: Her şey kendi kendine barındırıldığından, ZAMAN GEREKTİRECEKTİR. Eğer harcayacak zamanınız yoksa, barındırılan bir siteye bağlı kalmak her zaman daha iyidir..." [Kendi e-posta sunucusunu barındırmak mı? Neden veya neden olmasın? Neler popüler?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: E-postayı İlet. "Proton Mail açık kaynaklı olduğunu iddia ediyor, ancak arka ucu aslında kapalı kaynaklı." [Tutanota ve Proton Mail Karşılaştırması (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: E-postayı İlet. "Tutanota açık kaynaklı olduğunu iddia ediyor, ancak arka ucu aslında kapalı kaynaklı." [Proton Mail ve Tutanota Karşılaştırması (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Gizlilik Kılavuzları Topluluğu. "Hem Protonmail hem de Tuta'nın kapalı kaynaklı olduğunu belirtiyor. Çünkü arka uçları gerçekten kapalı kaynaklı." [E-postayı İlet (e-posta sağlayıcısı) - Site Geliştirme / Araç Önerileri](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Gizlilik Kılavuzları Topluluğu. "Şu anda listelenen herhangi bir PG e-posta servis sağlayıcısının arka uç altyapılarının kamuya açık bir denetimi yapılmadı veya gelen e-postaları nasıl işlediklerine dair açık kaynak kod parçacıkları paylaşılmadı." [E-postayı İlet (e-posta sağlayıcısı) - Site Geliştirme / Araç Önerileri](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. "Açık kaynaklı yazılım pazarı, 2024'te 41,83 milyar ABD dolarından 2025'te 48,92 milyar ABD dolarına, bileşik..." [Açık Kaynak Yazılım Nedir?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. "Şirketlerin %80'inin son bir yılda açık kaynak teknolojilerinin kullanımının arttığını bildirmesiyle, bu..." [Açık Kaynak Topluluklarında Ortaya Çıkan Trendler 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)