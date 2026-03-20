# Neden Açık Kaynak E-posta Gelecektir: Forward Email Avantajı {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="Açık kaynak e-posta güvenliği ve gizliliği" class="rounded-lg" />


## İçindekiler {#table-of-contents}

* [Önsöz](#foreword)
* [Açık Kaynak Avantajı: Sadece Pazarlamadan Daha Fazlası](#the-open-source-advantage-more-than-just-marketing)
  * [Gerçek Açık Kaynak Ne Anlama Gelir](#what-true-open-source-means)
  * [Arka Uç Sorunu: Çoğu "Açık Kaynak" E-posta Hizmetinin Başarısız Olduğu Yer](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Forward Email: %100 Açık Kaynak, Ön Uç VE Arka Uç](#forward-email-100-open-source-frontend-and-backend)
  * [Benzersiz Teknik Yaklaşımımız](#our-unique-technical-approach)
* [Kendi Sunucunu Kullanma Seçeneği: Seçme Özgürlüğü](#the-self-hosting-option-freedom-of-choice)
  * [Neden Kendi Sunucunu Kullanmayı Destekliyoruz](#why-we-support-self-hosting)
  * [E-posta Kendi Sunucunu Kullanmanın Gerçekleri](#the-reality-of-self-hosting-email)
* [Neden Ücretli Hizmetimiz Mantıklı (Açık Kaynak Olmamıza Rağmen)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Maliyet Karşılaştırması](#cost-comparison)
  * [İki Dünyanın En İyisi](#the-best-of-both-worlds)
* [Kapalı Kaynak Aldatmacası: Proton ve Tutanota'nın Size Söylemedikleri](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Proton Mail'in Açık Kaynak İddiaları](#proton-mails-open-source-claims)
  * [Tutanota'nın Benzer Yaklaşımı](#tutanotas-similar-approach)
  * [Gizlilik Rehberleri Tartışması](#the-privacy-guides-debate)
* [Gelecek Açık Kaynak](#the-future-is-open-source)
  * [Neden Açık Kaynak Kazanıyor](#why-open-source-is-winning)
* [Forward Email'e Geçiş Yapmak](#making-the-switch-to-forward-email)
* [Sonuç: Özel Bir Gelecek İçin Açık Kaynak E-posta](#conclusion-open-source-email-for-a-private-future)


## Önsöz {#foreword}

Dijital gizlilik endişelerinin her zamankinden daha yüksek olduğu bir çağda, seçtiğimiz e-posta hizmetleri her zamankinden daha önemli. Birçok sağlayıcı gizliliğinizi önceliklendirdiğini iddia ederken, gizlilikten sadece bahsedenlerle gerçekten bunu uygulayanlar arasında temel bir fark vardır. Forward Email olarak, hizmetimizi sadece ön uç uygulamalarımızda değil, tüm altyapımızda açık kaynak geliştirme yoluyla tam şeffaflık temeli üzerine inşa ettik.

Bu blog yazısı, neden açık kaynak e-posta çözümlerinin kapalı kaynak alternatiflerden üstün olduğunu, yaklaşımımızın Proton Mail ve Tutanota gibi rakiplerden nasıl farklılaştığını ve kendi sunucunu kullanma seçeneklerine bağlı kalmamıza rağmen neden ücretli hizmetimizin çoğu kullanıcı için en iyi değeri sunduğunu inceliyor.


## Açık Kaynak Avantajı: Sadece Pazarlamadan Daha Fazlası {#the-open-source-advantage-more-than-just-marketing}

"Açık kaynak" terimi son yıllarda popüler bir pazarlama sloganı haline geldi ve küresel açık kaynak hizmetleri pazarının 2024 ile 2032 arasında %16'nın üzerinde bir bileşik yıllık büyüme oranıyla büyümesi bekleniyor\[^1]. Peki gerçek anlamda açık kaynak olmak ne demek ve e-posta gizliliğiniz için neden önemlidir?

### Gerçek Açık Kaynak Ne Anlama Gelir {#what-true-open-source-means}

Açık kaynak yazılım, tüm kaynak kodunu herkesin incelemesi, değiştirmesi ve geliştirmesi için ücretsiz olarak erişilebilir kılar. Bu şeffaflık şu ortamı yaratır:

* Güvenlik açıkları küresel bir geliştirici topluluğu tarafından tespit edilip düzeltilebilir
* Gizlilik iddiaları bağımsız kod incelemesiyle doğrulanabilir
* Kullanıcılar kapalı ekosistemlere bağlı kalmaz
* İşbirlikçi geliştirme sayesinde yenilik daha hızlı gerçekleşir

E-posta söz konusu olduğunda—çevrimiçi kimliğinizin temel taşı—bu şeffaflık sadece hoş bir özellik değil; gerçek gizlilik ve güvenlik için gereklidir.

### Arka Uç Sorunu: Çoğu "Açık Kaynak" E-posta Hizmetinin Başarısız Olduğu Yer {#the-backend-problem-where-most-open-source-email-services-fall-short}

İşte işin ilginç kısmı. Birçok popüler "gizlilik odaklı" e-posta sağlayıcısı kendini açık kaynak olarak tanıtır, ancak fark etmenizi istemedikleri kritik bir ayrım vardır: **sadece ön uçlarını açık kaynak yaparken arka uçlarını kapalı tutarlar**.
Bu ne anlama geliyor? Ön yüz, gördüğünüz ve etkileşimde bulunduğunuz kısımdır—web arayüzü veya mobil uygulama. Arka uç ise gerçek e-posta işlemlerinin gerçekleştiği yerdir—mesajlarınızın depolandığı, şifrelendiği ve iletildiği yer. Bir sağlayıcı arka ucunu kapalı kaynak tuttuğunda:

1. E-postalarınızın gerçekten nasıl işlendiğini doğrulayamazsınız
2. Gizlilik iddialarının meşru olup olmadığını teyit edemezsiniz
3. Doğrulanabilir kod yerine pazarlama iddialarına güvenirsiniz
4. Güvenlik açıkları kamu denetiminden gizli kalabilir

Privacy Guides forumlarındaki tartışmaların da vurguladığı gibi, hem Proton Mail hem de Tutanota açık kaynak olduklarını iddia ediyor, ancak arka uçları kapalı ve tescilli kalmaya devam ediyor\[^2]. Bu, önemli bir güven açığı yaratıyor—gizlilik vaatlerine inanmanız isteniyor ancak bunları doğrulama imkanınız yok.


## Forward Email: %100 Açık Kaynak, Ön Yüz VE Arka Uç {#forward-email-100-open-source-frontend-and-backend}

Forward Email olarak, temelden farklı bir yaklaşım benimsedik. Tüm kod tabanımız—hem ön yüz hem de arka uç—açık kaynaklıdır ve herkesin incelemesi için <https://github.com/forwardemail/forwardemail.net> adresinde mevcuttur.

Bu şu anlama gelir:

1. **Tam Şeffaflık**: E-postalarınızı işleyen her satır kod kamu denetimine açıktır.
2. **Doğrulanabilir Gizlilik**: Gizlilik iddialarımız pazarlama söylemi değil—kodumuzu inceleyerek herkesin doğrulayabileceği gerçeklerdir.
3. **Topluluk Odaklı Güvenlik**: Güvenliğimiz, küresel geliştirici topluluğunun ortak uzmanlığıyla güçlendirilir.
4. **Gizli İşlevsellik Yok**: Gördüğünüz şey aldığınızdır—gizli takip yok, gizli arka kapılar yok.

### Benzersiz Teknik Yaklaşımımız {#our-unique-technical-approach}

Gizliliğe bağlılığımız sadece açık kaynak olmakla sınırlı değil. Bizi farklı kılan birkaç teknik yenilik uyguladık:

#### Bireysel Şifrelenmiş SQLite Posta Kutuları {#individually-encrypted-sqlite-mailboxes}

Tüm kullanıcıların verilerinin tek bir ihlal ile açığa çıkabileceği paylaşılan ilişkisel veritabanları kullanan geleneksel e-posta sağlayıcılarının aksine, her posta kutusu için bireysel olarak şifrelenmiş SQLite dosyaları kullanıyoruz. Bu şu anlama gelir:

* Her posta kutusu ayrı bir şifrelenmiş dosyadır
* Bir kullanıcının verilerine erişim diğerlerine erişim sağlamaz
* Kendi çalışanlarımız bile verilerinize erişemez—bu temel bir tasarım kararıdır

Privacy Guides tartışmalarında açıkladığımız gibi:

> "Paylaşılan ilişkisel veritabanları (örneğin, MongoDB, SQL Server, PostgreSQL, Oracle, MySQL vb.) veritabanı bağlantısını kurmak için bir giriş (kullanıcı/şifre) gerektirir. Bu, bu şifreye sahip herhangi birinin veritabanını istediği gibi sorgulayabileceği anlamına gelir. İster kötü niyetli bir çalışan ister kötü niyetli hizmetçi saldırısı olsun. Bu ayrıca, bir kullanıcının verilerine erişim, diğer herkesin verilerine de erişim anlamına gelir. Öte yandan, SQLite paylaşılan bir veritabanı olarak kabul edilebilir, ancak bizim kullanım şeklimiz (her posta kutusu = bireysel SQLite dosyası) onu izole eder."\[^3]

#### Kuantum Dirençli Şifreleme {#quantum-resistant-encryption}

Diğer sağlayıcılar henüz yakalamaya çalışırken, biz kuantum bilişimden kaynaklanan yeni tehditlere karşı e-posta gizliliğinizi geleceğe hazırlamak için kuantum dirençli şifreleme yöntemlerini çoktan uyguladık.

#### Üçüncü Taraf Bağımlılıkları Yok {#no-third-party-dependencies}

Amazon SES gibi hizmetlere e-posta teslimatı için bağımlı olan rakiplerin aksine, tüm altyapımızı kendi bünyemizde inşa ettik. Bu, üçüncü taraf hizmetler yoluyla olası gizlilik sızıntılarını ortadan kaldırır ve tüm e-posta hattı üzerinde tam kontrol sağlar.


## Kendi Sunucunu Kullanma Seçeneği: Seçme Özgürlüğü {#the-self-hosting-option-freedom-of-choice}

Açık kaynak yazılımın en güçlü yönlerinden biri sağladığı özgürlüktür. Forward Email ile asla kilitlenmezsiniz—isterseniz tüm platformumuzu kendi sunucunuzda barındırabilirsiniz.

### Neden Kendi Sunucunu Kullanmayı Destekliyoruz {#why-we-support-self-hosting}

Kullanıcılara verileri üzerinde tam kontrol vermeye inanıyoruz. Bu yüzden tüm platformumuzu kapsamlı dokümantasyon ve kurulum rehberleriyle kendi sunucunuzda çalıştırılabilir hale getirdik. Bu yaklaşım:

* Teknik bilgiye sahip kullanıcılar için maksimum kontrol sağlar
* Hizmet sağlayıcı olarak bize güvenme ihtiyacını ortadan kaldırır
* Belirli gereksinimlere uyacak şekilde özelleştirmeye olanak tanır
* Şirketimiz olmasa bile hizmetin devam etmesini garanti eder
### E-posta Kendinize Ait Sunucuda Barındırmanın Gerçekleri {#the-reality-of-self-hosting-email}

Kendinize ait sunucuda barındırma güçlü bir seçenek olsa da, gerçek maliyetleri anlamak önemlidir:

#### Finansal Maliyetler {#financial-costs}

* VPS veya sunucu maliyetleri: Temel bir kurulum için ayda 5-50$\[^4]
* Alan adı kaydı ve yenileme: Yılda 10-20$
* SSL sertifikaları (Let's Encrypt ücretsiz seçenekler sunar)
* İzleme hizmetleri ve yedekleme çözümleri için potansiyel maliyetler

#### Zaman Maliyetleri {#time-costs}

* İlk kurulum: Teknik uzmanlığa bağlı olarak birkaç saatten birkaç güne kadar
* Sürekli bakım: Güncellemeler, güvenlik yamaları ve sorun giderme için ayda 5-10 saat\[^5]
* Öğrenme eğrisi: E-posta protokollerini, güvenlik en iyi uygulamalarını ve sunucu yönetimini anlamak

#### Teknik Zorluklar {#technical-challenges}

* E-posta teslim edilebilirlik sorunları (mesajların spam olarak işaretlenmesi)
* Gelişen güvenlik standartlarına ayak uydurmak
* Yüksek erişilebilirlik ve güvenilirlik sağlamak
* Spam filtrelemeyi etkili şekilde yönetmek

Deneyimli bir kendinize ait sunucu yöneticisinin dediği gibi: "E-posta bir emtia hizmetidir... E-postamı \[bir sağlayıcıda] barındırmak, hem para *hem* zaman harcayıp kendim barındırmaktan daha ucuzdur."\[^6]


## Neden Ücretli Hizmetimiz Mantıklı (Açık Kaynak Olmamıza Rağmen) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Kendinize ait sunucuda barındırmanın zorlukları göz önüne alındığında, ücretli hizmetimiz her iki dünyanın en iyisini sunar: açık kaynak şeffaflığı ve güvenliği ile yönetilen hizmetin kolaylığı ve güvenilirliği.

### Maliyet Karşılaştırması {#cost-comparison}

Hem finansal hem de zaman maliyetlerini hesaba kattığınızda, ücretli hizmetimiz olağanüstü bir değer sunar:

* **Kendinize ait sunucuda barındırmanın toplam maliyeti**: Ayda 56-252$ (sunucu maliyetleri ve zaman değeri dahil)
* **Forward Email ücretli planları**: Ayda 3-9$

Ücretli hizmetimiz şunları sağlar:

* Profesyonel yönetim ve bakım
* Daha iyi teslim edilebilirlik için yerleşik IP itibarı
* Düzenli güvenlik güncellemeleri ve izleme
* Sorun çıktığında destek
* Açık kaynak yaklaşımımızın tüm gizlilik avantajları

### Her İki Dünyanın En İyisi {#the-best-of-both-worlds}

Forward Email'i seçerek şunları elde edersiniz:

1. **Doğrulanabilir Gizlilik**: Açık kaynak kod tabanımız sayesinde gizlilik iddialarımıza güvenebilirsiniz
2. **Profesyonel Yönetim**: E-posta sunucusu uzmanı olmanıza gerek yok
3. **Maliyet Etkinliği**: Kendinize ait sunucuda barındırmaktan daha düşük toplam maliyet
4. **Kilitlenmeden Özgürlük**: Kendinize ait sunucuda barındırma seçeneği her zaman mevcut


## Kapalı Kaynak Aldatmacası: Proton ve Tutanota'nın Size Söylemedikleri {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Popüler "gizlilik odaklı" e-posta sağlayıcılarından farklı olarak yaklaşımımızı daha yakından inceleyelim.

### Proton Mail'in Açık Kaynak İddiaları {#proton-mails-open-source-claims}

Proton Mail kendini açık kaynak olarak tanıtır, ancak bu yalnızca ön uç uygulamalarına uygulanır. E-postalarınızın gerçekten işlendiği ve saklandığı arka uç kapalı kaynaktır\[^7]. Bu şu anlama gelir:

* E-postalarınızın nasıl işlendiğini doğrulayamazsınız
* Gizlilik iddialarına doğrulama olmadan güvenmek zorundasınız
* Arka uçtaki güvenlik açıkları kamu denetiminden gizlenir
* Kendinize ait sunucuda barındırma seçeneği olmadan onların ekosistemine kilitlenirsiniz

### Tutanota'nın Benzer Yaklaşımı {#tutanotas-similar-approach}

Proton Mail gibi, Tutanota da yalnızca ön ucunu açık kaynak yaparken arka ucunu tescilli tutar\[^8]. Aynı güven sorunlarıyla karşı karşıyadırlar:

* Arka uç gizlilik iddialarını doğrulamanın yolu yok
* Gerçek e-posta işleme konusunda sınırlı şeffaflık
* Kamuya açık olmayan potansiyel güvenlik sorunları
* Kendinize ait sunucuda barındırma seçeneği olmadan satıcıya bağımlılık

### Gizlilik Rehberleri Tartışması {#the-privacy-guides-debate}

Bu sınırlamalar gizlilik topluluğunda fark edilmiştir. Privacy Guides tartışmalarında bu kritik ayrımı vurguladık:

> "Hem Protonmail hem de Tuta'nın kapalı kaynak olduğunu belirtir. Çünkü arka uçları gerçekten kapalı kaynaktır."\[^9]

Ayrıca şunu belirttik:

> "Şu anda listelenen hiçbir PG e-posta hizmet sağlayıcısının arka uç altyapıları hakkında kamuya açık denetim paylaşımı ya da gelen e-postaları nasıl işlediklerine dair açık kaynak kod parçacıkları paylaşılmamıştır."\[^10]
Bu şeffaflık eksikliği temel bir güven sorunu yaratır. Açık kaynaklı arka uçlar olmadan, kullanıcılar gizlilik iddialarını doğrulama yerine inançla kabul etmek zorunda kalırlar.


## Gelecek Açık Kaynak {#the-future-is-open-source}

Yazılım endüstrisinde açık kaynak çözümlere yönelik eğilim hızlanıyor. Son araştırmalara göre:

* Açık kaynak yazılım pazarı 2024'te 41,83 milyar dolardan 2025'te 48,92 milyar dolara büyüyor\[^11]
* Şirketlerin %80'i geçen yıl içinde açık kaynak kullanımının arttığını bildiriyor\[^12]
* Açık kaynak benimsemesinin hızlı genişlemesini sürdürmesi bekleniyor

Bu büyüme, yazılım güvenliği ve gizliliği konusundaki temel bir değişimi yansıtıyor. Kullanıcılar daha fazla gizlilik bilincine sahip oldukça, açık kaynak çözümlerle doğrulanabilir gizlilik talebi artacaktır.

### Neden Açık Kaynak Kazanıyor {#why-open-source-is-winning}

Açık kaynağın avantajları giderek daha net hale geliyor:

1. **Şeffaflık Yoluyla Güvenlik**: Açık kaynak kod, sadece dahili bir ekip değil, binlerce uzman tarafından incelenebilir
2. **Daha Hızlı İnovasyon**: İşbirlikçi geliştirme iyileştirmeyi hızlandırır
3. **Doğrulama Yoluyla Güven**: İddialar inançla değil, doğrulanarak kabul edilir
4. **Tedarikçi Bağımlılığından Kurtulma**: Kullanıcılar verileri ve hizmetler üzerinde kontrolü elinde tutar
5. **Topluluk Desteği**: Küresel bir topluluk sorunları tespit edip çözer


## Forward Email'e Geçiş {#making-the-switch-to-forward-email}

Forward Email'e geçiş, Gmail gibi yaygın bir sağlayıcıdan veya Proton Mail ya da Tutanota gibi başka bir gizlilik odaklı hizmetten geliyorsanız bile kolaydır.

Hizmetimiz şunları sunar:

* Sınırsız alan adı ve takma ad
* Özel köprüler olmadan standart protokol desteği (SMTP, IMAP, POP3)
* Mevcut e-posta istemcileriyle sorunsuz entegrasyon
* Kapsamlı dokümantasyonla basit kurulum süreci
* Sadece ayda 3$'dan başlayan uygun fiyatlı planlar


## Sonuç: Özel Bir Gelecek İçin Açık Kaynak E-posta {#conclusion-open-source-email-for-a-private-future}

Dijital gizliliğin giderek tehdit altında olduğu bir dünyada, açık kaynak çözümlerin şeffaflığı hayati bir koruma sağlar. Forward Email olarak, tamamen açık kaynaklı e-posta gizliliği yaklaşımımızla öncü olmaktan gurur duyuyoruz.

Sadece kısmen açık kaynağı benimseyen rakiplerin aksine, tüm platformumuzu—ön uç ve arka uç—kamu incelemesine açtık. Bu şeffaflık taahhüdü ve yenilikçi teknik yaklaşımımız, kapalı kaynak alternatiflerin asla ulaşamayacağı doğrulanabilir bir gizlilik seviyesi sunar.

Yönetilen hizmetimizi kullanmayı veya platformumuzu kendi kendinize barındırmayı seçin, gerçekten açık kaynaklı e-postanın getirdiği güvenlik, gizlilik ve huzurdan faydalanırsınız.

E-postanın geleceği açık, şeffaf ve gizlilik odaklıdır. Gelecek Forward Email'dir.

\[^1]: SNS Insider. "The Open Source Services Market was valued at USD 28.6 billion in 2023 and will reach to USD 114.8 Billion by 2032, growing at a CAGR of 16.70% by 2032." [Open Source Services Market Size & Analysis Report 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. "Generally, you can expect to spend anywhere from $5 to $50 monthly for a basic virtual private server (VPS) to run your email server." [10 Best Self-Hosted Email Server Platforms to Use in 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Mail-in-a-Box Forum. "Maintenance took me maybe 16 hours in that period..." [Self hosting mail server frowned upon](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)
\[^6]: Reddit r/selfhosted. "Özet: Her şey kendi kendine barındırıldığında, ZAMANINIZI GEREKTİRİR. Buna zaman ayıramıyorsanız, her zaman barındırılan bir hizmeti kullanmak daha iyidir..." [Bir e-posta sunucusunu kendi kendine barındırmak mı? Neden veya neden olmasın? Neler popüler?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: Forward Email. "Proton Mail açık kaynak olduğunu iddia ediyor, ancak arka ucu aslında kapalı kaynak." [Tutanota vs Proton Mail Karşılaştırması (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: Forward Email. "Tutanota açık kaynak olduğunu iddia ediyor, ancak arka ucu aslında kapalı kaynak." [Proton Mail vs Tutanota Karşılaştırması (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Privacy Guides Community. "Hem Protonmail hem de Tuta'nın kapalı kaynak olduğu belirtiliyor. Çünkü arka uçları gerçekten kapalı kaynak." [Forward Email (e-posta sağlayıcısı) - Site Geliştirme / Araç Önerileri](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Privacy Guides Community. "Şu anda listelenen hiçbir PG e-posta hizmet sağlayıcısının arka uç altyapıları için kamuya açık denetimler paylaşılmamış ve gelen e-postaları nasıl işlediklerine dair açık kaynak kod parçacıkları paylaşılmamıştır." [Forward Email (e-posta sağlayıcısı) - Site Geliştirme / Araç Önerileri](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. "Açık kaynak yazılım pazarı, 2024'te 41,83 milyar USD'den 2025'te 48,92 milyar USD'ye bileşik..." [Açık Kaynak Yazılım Nedir?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. "Geçtiğimiz yıl içinde şirketlerin %80'i açık kaynak teknolojilerin kullanımında artış bildirdi, bu da..." [2024 Açık Kaynak Topluluklarında Ortaya Çıkan Trendler](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)
