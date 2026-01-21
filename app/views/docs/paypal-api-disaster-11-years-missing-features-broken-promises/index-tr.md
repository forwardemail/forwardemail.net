# PayPal'ın 11 Yıllık API Felaketi: Geliştiricileri Göz Ardı Ederken Biz Nasıl Geçici Çözümler Ürettik? {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">Forward Email olarak, on yılı aşkın süredir PayPal'ın bozuk API'leriyle uğraşıyoruz. Küçük hayal kırıklıklarıyla başlayan süreç, bizi kendi çözümlerimizi oluşturmaya, kimlik avı şablonlarını engellemeye ve nihayetinde kritik bir hesap geçişi sırasında tüm PayPal ödemelerini durdurmaya zorlayan tam bir felakete dönüştü.</p>
<p class="lead mt-3">Bu, platformlarını çalışır hale getirmek için her şeyi denediğimiz sırada PayPal'ın temel geliştirici ihtiyaçlarını görmezden geldiği 11 yıllık sürecin hikayesi.</p>

## İçindekiler {#table-of-contents}

* [Eksik Parça: Abonelikleri Listelemenin Bir Yolu Yok](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: Sorun Ortaya Çıkıyor](#2014-2017-the-problem-emerges)
* [2020: Onlara Kapsamlı Geri Bildirim Veriyoruz](#2020-we-give-them-extensive-feedback)
  * [27 Maddelik Geri Bildirim Listesi](#the-27-item-feedback-list)
  * [Takımlar Katıldı, Sözler Verildi](#teams-got-involved-promises-were-made)
  * [Sonuç? Hiçbir şey.](#the-result-nothing)
* [Yöneticilerin Göçü: PayPal Tüm Kurumsal Hafızasını Nasıl Kaybetti?](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Yeni Liderlik, Aynı Sorunlar](#2025-new-leadership-same-problems)
  * [Yeni CEO İşe Dahil Oluyor](#the-new-ceo-gets-involved)
  * [Michelle Gill'in Yanıtı](#michelle-gills-response)
  * [Bizim Yanıtımız: Artık Toplantı Yok](#our-response-no-more-meetings)
  * [Marty Brodbeck'in Aşırı Mühendislik Tepkisi](#marty-brodbecks-overengineering-response)
  * ["Basit CRUD" Çelişkisi](#the-simple-crud-contradiction)
  * [Kopukluk Netleşiyor](#the-disconnect-becomes-clear)
* [Yıllardır Görmezden Geldikleri Hata Raporları](#years-of-bug-reports-they-ignored)
  * [2016: İlk UI/UX Şikayetleri](#2016-early-uiux-complaints)
  * [2021: İş E-postası Hata Raporu](#2021-business-email-bug-report)
  * [2021: Kullanıcı Arayüzü İyileştirme Önerileri](#2021-ui-improvement-suggestions)
  * [2021: Sandbox Ortamı Arızaları](#2021-sandbox-environment-failures)
  * [2021: Raporlama Sistemi Tamamen Çöktü](#2021-reports-system-completely-broken)
  * [2022: Temel API Özelliği Eksik (Yine)](#2022-core-api-feature-missing-again)
* [Geliştirici Deneyimi Kabusu](#the-developer-experience-nightmare)
  * [Bozuk Kullanıcı Arayüzü](#broken-user-interface)
  * [SDK Sorunları](#sdk-problems)
  * [İçerik Güvenlik Politikası İhlalleri](#content-security-policy-violations)
  * [Belgeleme Kaosu](#documentation-chaos)
  * [Güvenlik Açıkları](#security-vulnerabilities)
  * [Oturum Yönetimi Felaketi](#session-management-disaster)
* [Temmuz 2025: Son Damla](#july-2025-the-final-straw)
* [Neden PayPal'ı Bırakamıyoruz?](#why-we-cant-just-drop-paypal)
* [Topluluk Çözümü](#the-community-workaround)
* [Kimlik Avı Nedeniyle PayPal Şablonlarının Engellenmesi](#blocking-paypal-templates-due-to-phishing)
  * [Gerçek Sorun: PayPal'ın Şablonları Dolandırıcılık Gibi Görünüyor](#the-real-problem-paypals-templates-look-like-scams)
  * [Uygulamamız](#our-implementation)
  * [PayPal'ı Neden Engellemek Zorunda Kaldık?](#why-we-had-to-block-paypal)
  * [Sorunun Boyutu](#the-scale-of-the-problem)
  * [İroni](#the-irony)
  * [Gerçek Dünya Etkisi: Yeni PayPal Dolandırıcılıkları](#real-world-impact-novel-paypal-scams)
* [PayPal'ın Ters KYC Süreci](#paypals-backwards-kyc-process)
  * [Nasıl Çalışmalı?](#how-it-should-work)
  * [PayPal Aslında Nasıl Çalışır?](#how-paypal-actually-works)
  * [Gerçek Dünya Etkisi](#the-real-world-impact)
  * [Temmuz 2025 Hesap Taşıma Felaketi](#the-july-2025-account-migration-disaster)
  * [Bunun Önemi](#why-this-matters)
* [Diğer Ödeme İşlemcilerinin Bunu Doğru Yapması](#how-every-other-payment-processor-does-it-right)
  * [Şerit](#stripe)
  * [Kürek](#paddle)
  * [Coinbase Ticaret](#coinbase-commerce)
  * [Kare](#square)
  * [Endüstri Standardı](#the-industry-standard)
  * [Diğer İşlemciler PayPal'a Karşı Neler Sunar?](#what-other-processors-provide-vs-paypal)
* [PayPal'ın Sistematik Örtbas Etme Operasyonu: 6 Milyon Sesi Susturmak](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [Büyük Silinme](#the-great-erasure)
  * [Üçüncü Taraf Kurtarma](#the-third-party-rescue)
* [11 Yıllık Hata Yakalama Felaketi: 1.899 Dolar ve Sayımı Devam Ediyor](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Forward Email'in 1.899 Dolarlık Kaybı](#forward-emails-1899-loss)
  * [2013 Orijinal Raporu: 11+ Yıllık İhmal](#the-2013-original-report-11-years-of-negligence)
  * [2016 Kabulü: PayPal Kendi SDK'sını Kırıyor](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [2024 Tırmanışı: Hala Bozuk](#the-2024-escalation-still-broken)
  * [Webhook Güvenilirlik Felaketi](#the-webhook-reliability-disaster)
  * [Sistematik İhmal Örneği](#the-pattern-of-systematic-negligence)
  * [Belgelenmemiş Gereksinim](#the-undocumented-requirement)
* [PayPal'ın Daha Geniş Aldatmaca Modeli](#paypals-broader-pattern-of-deception)
  * [New York Mali Hizmetler Departmanı Eylemi](#the-new-york-department-of-financial-services-action)
  * [Bal Davası: Ortaklık Bağlantılarını Yeniden Yazmak](#the-honey-lawsuit-rewriting-affiliate-links)
  * [PayPal'ın İhmalinin Maliyeti](#the-cost-of-paypals-negligence)
  * [Belgeleme Yalanı](#the-documentation-lie)
* [Bu Geliştiriciler İçin Ne Anlama Geliyor?](#what-this-means-for-developers)

## Eksik Parça: Abonelikleri Listelemenin Bir Yolu Yok {#the-missing-piece-no-way-to-list-subscriptions}

İşte aklımızı başımızdan alan şey: PayPal 2014'ten beri abonelik faturalandırması kullanıyor, ancak satıcıların kendi aboneliklerini listelemelerine olanak sağlayan bir yol hiçbir zaman sağlamadı.

Bunu bir saniye düşünün. Abonelikler oluşturabilir, ID'niz varsa iptal edebilirsiniz, ancak hesabınızdaki tüm aktif aboneliklerin listesini alamazsınız. SELECT ifadesi olmayan bir veritabanına sahip olmak gibi.

Temel iş operasyonlarımız için buna ihtiyacımız var:

* Müşteri desteği (birisi aboneliği hakkında e-posta gönderdiğinde)
* Finansal raporlama ve mutabakat
* Otomatik faturalama yönetimi
* Uyumluluk ve denetim

Peki ya PayPal? Onu hiç... inşa etmediler.

## 2014-2017: Sorun Ortaya Çıkıyor {#2014-2017-the-problem-emerges}

Abonelik listeleme sorunu ilk olarak 2017 yılında PayPal'ın topluluk forumlarında ortaya çıktı. Geliştiriciler şu soruyu soruyorlardı: "Tüm aboneliklerimin listesini nasıl alabilirim?"

PayPal'ın cevabı mı? Cırcır böcekleri.

Topluluk üyeleri hayal kırıklığına uğramaya başladı:

> "Bir satıcı tüm aktif Sözleşmeleri listeleyemiyorsa bu çok garip bir eksiklik. Sözleşme Kimliği kaybolursa, bu yalnızca kullanıcının sözleşmeyi iptal edebileceği veya askıya alabileceği anlamına gelir." - leafspider

> "+1. Neredeyse 3 yıl oldu." - laudukang (sorunun 2014'ten beri var olduğu anlamına geliyor)

2017'den kalma [orijinal topluluk gönderisi](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066), geliştiricilerin bu temel işlevselliği talep ettiğini gösteriyor. PayPal'ın cevabı ise, insanların sorunu bildirdiği deponun arşivlenmesi oldu.

## 2020: Onlara Kapsamlı Geri Bildirim Veriyoruz {#2020-we-give-them-extensive-feedback}

Ekim 2020'de PayPal, resmi bir geri bildirim oturumu için bizimle iletişime geçti. Bu sıradan bir sohbet değildi; Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze ve diğerleri de dahil olmak üzere 8 PayPal yöneticisiyle 45 dakikalık bir Microsoft Teams görüşmesi organize ettiler.

### 27 Maddelik Geri Bildirim Listesi {#the-27-item-feedback-list}

Hazırlıklı geldik. API'leriyle entegrasyon için 6 saat uğraştıktan sonra 27 spesifik sorun tespit ettik. PayPal Checkout ekibinden Mark Stuart şunları söyledi:

> Hey Nick, bugün herkesle paylaştığın için teşekkürler! Sanırım bu, ekibimizin bu sorunları çözmesi için daha fazla destek ve yatırım almamızı sağlayacak bir katalizör olacak. Şimdiye kadar bize bıraktığın gibi zengin geri bildirimler almak zordu.

Geri bildirim teorik değildi; gerçek entegrasyon girişimlerinden geldi:

1. **Erişim belirteci oluşturma çalışmıyor**:

> Erişim belirteci oluşturma çalışmıyor. Ayrıca, yalnızca cURL örneklerinden daha fazlası olmalı.

2. **Abonelik oluşturma için web kullanıcı arayüzü yok**:

> cURL kullanmadan abonelikleri nasıl oluşturabilirsiniz? Bunu yapmak için bir web arayüzü yok gibi görünüyor (Stripe'ınki gibi)

Mark Stuart, erişim belirteci sorununu özellikle endişe verici buldu:

> Erişim belirteci üretimiyle ilgili sorunları genellikle duymuyoruz.

### Ekipler Katıldı, Sözler Verildi {#teams-got-involved-promises-were-made}

Daha fazla sorun keşfettikçe, PayPal sohbete daha fazla ekip eklemeye devam etti. Abonelik yönetimi kullanıcı arayüzü ekibinden Darshan Raju katıldı ve şunları söyledi:

> Boşluğu kabul edin. Bunu takip edip çözeceğiz. Geri bildiriminiz için tekrar teşekkürler!

Oturumun amacı şu şekilde tanımlandı:

> deneyiminizin samimi bir yürüyüşü

ile:

> PayPal'ı geliştiriciler için olması gereken hale getirmek.

### Sonuç? Hiçbir şey. {#the-result-nothing}

Resmi geri bildirim oturumuna, 27 maddelik kapsamlı listeye, birden fazla ekibin katılımına ve şu vaatlere rağmen:

> takip et ve adresle

Sorunlar, kesinlikle hiçbir şey düzeltilmedi.

## Yöneticilerin Göçü: PayPal Tüm Kurumsal Hafızasını Nasıl Kaybetti? {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

İşte asıl ilginç nokta burada başlıyor. 2020 geri bildirimlerimizi alan her kişi PayPal'dan ayrıldı:

**Liderlik Değişiklikleri:**

* [Dan Schulman (9 yıldır CEO) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (Eylül 2023)
* [Sri Shivananda (geri bildirimi organize eden CTO) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (Ocak 2024)

**Söz Veren, Sonra Ayrılan Teknik Liderler:**

* **Mark Stuart** (geri bildirimin "katalizör" olacağı sözü verildi) → [Şimdi Ripple'da](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18 yıllık PayPal çalışanı) → [MX'in CEO'su](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (Küresel Tüketici Ürünleri Başkan Yardımcısı) → [Emekli](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (kalan son kişilerden biri) → [Az önce Nasdaq'a doğru yola çıktım](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (Ocak 2025)

PayPal, yöneticilerin geliştiricilerden geri bildirim topladığı, sözler verdiği ve daha sonra JPMorgan, Ripple ve diğer fintech firmaları gibi daha iyi şirketlere geçtiği bir dönen kapı haline geldi.

Bu, 2025 GitHub sorunu yanıtının 2020 geri bildirimlerimizden tamamen kopuk görünmesinin nedenini açıklıyor; bu geri bildirimi alan herkes PayPal'dan ayrıldı.

## 2025: Yeni Liderlik, Aynı Sorunlar {#2025-new-leadership-same-problems}

2025 yılına geldiğimizde ise aynı durumla karşılaşıyoruz. Yıllardır hiçbir ilerleme kaydedilemeyen PayPal'ın yeni yönetimi, tekrar harekete geçiyor.

### Yeni CEO Göreve Başlıyor {#the-new-ceo-gets-involved}

30 Haziran 2025'te konuyu doğrudan PayPal'ın yeni CEO'su Alex Chriss'e ilettik. Yanıtı kısaydı:

> Merhaba Nick, bize ulaştığınız ve geri bildirimde bulunduğunuz için teşekkür ederiz. Michelle (cc'lendi), ekibiyle birlikte bu konuyu sizinle birlikte ele alıp birlikte çalışmak konusunda çok başarılı. Teşekkürler -A

### Michelle Gill'in Yanıtı {#michelle-gills-response}

Küçük İşletmeler ve Finansal Hizmetler İcra Başkan Yardımcısı ve Genel Müdürü Michelle Gill şu yanıtı verdi:

> Çok teşekkürler Nick, Alex'i gizli cc'ye taşıdın. Önceki gönderinden beri bu konuyu araştırıyorduk. Hafta bitmeden seni arayacağız. Meslektaşlarımdan birinin sana ulaşabilmesi için lütfen iletişim bilgilerini bana gönderebilir misin? Michelle.

### Yanıtımız: Toplantı Yok {#our-response-no-more-meetings}

Hayal kırıklığımızı dile getirerek başka bir görüşmeyi reddettik:

> Teşekkür ederim. Ancak bir görüşmeye katılmanın hiçbir işe yarayacağını düşünmüyorum. İşte nedeni... Geçmişte bir görüşmeye katıldım ve hiçbir işe yaramadı. Tüm ekip ve liderlerle konuşarak 2 saatten fazla zamanımı boşa harcadım ve hiçbir şey yapılmadı... Bir sürü e-posta alışverişi. Hiçbir şey yapılmadı. Geri bildirimler hiçbir işe yaramadı. Yıllarca uğraştım, dinlendim, sonra da hiçbir işe yaramadı.

### Marty Brodbeck'in Aşırı Mühendislik Yanıtı {#marty-brodbecks-overengineering-response}

Daha sonra PayPal'da tüketici mühendisliğinin başında bulunan Marty Brodbeck bize ulaştı:

> Merhaba Nick, ben Marty Brodbeck. PayPal'da tüm tüketici mühendisliğinin başındayım ve şirketin API geliştirme süreçlerini yönetiyorum. Karşılaştığınız sorun ve size nasıl yardımcı olabileceğimiz konusunda sizinle görüşebilir miyiz?

Abonelik listeleme uç noktasına olan basit ihtiyacı açıkladığımızda, verdiği yanıt tam olarak sorunu ortaya koydu:

> Teşekkürler Nick, tam SDK'lı (tam hata işleme, olay tabanlı abonelik takibi, sağlam çalışma süresi desteği) tek bir abonelik API'si oluşturma sürecindeyiz; bu sayede faturalama, satıcıların tek bir yanıt almak için birden fazla uç noktayı düzenlemelerine gerek kalmadan gidebilecekleri ayrı bir API olarak bölünüyor.

Bu kesinlikle yanlış bir yaklaşım. Aylarca süren karmaşık bir mimariye ihtiyacımız yok. Abonelikleri listeleyen basit bir REST uç noktasına ihtiyacımız var; 2014'ten beri var olması gereken bir şey.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### "Basit CRUD" Çelişkisi {#the-simple-crud-contradiction}

Bunun 2014'ten beri var olması gereken temel CRUD işlevselliği olduğunu belirttiğimizde Marty'nin yanıtı şuydu:

> Basit Crud işlemleri çekirdek API'nin bir parçasıdır dostum, bu yüzden aylarca geliştirme gerektirmez

Aylar süren geliştirme sürecinin ardından şu anda yalnızca üç uç noktayı destekleyen PayPal TypeScript SDK'sı ve geçmiş zaman çizelgesi, bu tür projelerin tamamlanmasının birkaç aydan fazla zaman aldığını açıkça ortaya koyuyor.

Bu yanıt, kendi API'sini anlamadığını gösteriyor. "Basit CRUD işlemleri temel API'nin bir parçasıysa", abonelik listeleme uç noktası nerede? Yanıtımız şu:

> 'Basit CRUD işlemleri çekirdek API'nin bir parçasıysa', abonelik listeleme uç noktası nerede? Geliştiriciler 2014'ten beri bu 'basit CRUD işlemini' talep ediyor. 11 yıl oldu. Diğer tüm ödeme işlemcileri ilk günden beri bu temel işlevselliğe sahip.

### Bağlantı Kesikliği Netleşiyor {#the-disconnect-becomes-clear}

Alex Chriss, Michelle Gill ve Marty Brodbeck ile 2025'teki görüşmeler aynı örgütsel işlev bozukluğunu gösteriyor:

1. **Yeni liderlik, önceki geri bildirim oturumları hakkında hiçbir bilgiye sahip değil**
2. **Aynı aşırı mühendislik çözümlerini öneriyorlar**
3. **Kendi API sınırlamalarını anlamıyor**
4. **Sorunu çözmek yerine daha fazla toplantı istiyorlar**

Bu model, 2025'teki PayPal ekiplerinin 2020'de sağlanan kapsamlı geri bildirimlerden neden tamamen kopuk göründüğünü açıklıyor; bu geri bildirimi alan kişiler artık yok ve yeni liderlik aynı hataları tekrarlıyor.

## Yıllardır Görmezden Geldikleri Hata Raporları {#years-of-bug-reports-they-ignored}

Sadece eksik özelliklerden şikayet etmedik. Hataları aktif olarak bildirdik ve iyileştirmelerine yardımcı olmaya çalıştık. İşte belgelediğimiz sorunların kapsamlı bir zaman çizelgesi:

### 2016: Erken UI/UX Şikayetleri {#2016-early-uiux-complaints}

2016 yılında bile, Dan Schulman da dahil olmak üzere PayPal yönetimine arayüz sorunları ve kullanılabilirlik sorunları hakkında kamuoyuyla iletişime geçiyorduk. Bu 9 yıl önceydi ve aynı kullanıcı arayüzü/kullanıcı deneyimi sorunları bugün de devam ediyor.

### 2021: İş E-postası Hata Raporu {#2021-business-email-bug-report}

Mart 2021'de, PayPal'ın iş e-posta sisteminin hatalı iptal bildirimleri gönderdiğini bildirmiştik. E-posta şablonundaki değişkenler hatalı bir şekilde oluşturulmuş ve müşterilere kafa karıştırıcı mesajlar gösteriyordu.

Mark Stuart bu konuyu şöyle kabul etti:

> Teşekkürler Nick! Gizli Bilgi'ye (BCC) geçiyoruz. @Prasy, bu e-postadan ekibiniz mi sorumlu veya kim sorumlu biliyor musunuz? "Niftylettuce, LLC, artık size fatura kesmeyeceğiz" ifadesi, kime gönderildiği ve e-postanın içeriği arasında bir karışıklık olduğunu düşündürüyor.

**Sonuç**: Bunu gerçekten düzelttiler! Mark Stuart doğruladı:

> Bildirim ekibinden, e-posta şablonunun düzeltildiğini ve kullanıma sunulduğunu duydum. Bize bildirdiğiniz için teşekkür ederiz. Teşekkürler!

Bu, istedikleri zaman sorunları düzeltebileceklerini gösteriyor; sadece çoğu sorun için bunu tercih etmiyorlar.

### 2021: Kullanıcı Arayüzü İyileştirme Önerileri {#2021-ui-improvement-suggestions}

Şubat 2021'de, özellikle "PayPal Son Aktiviteler" bölümü olmak üzere, panolarının kullanıcı arayüzü hakkında ayrıntılı geri bildirimler sağladık:

> PayPal.com'daki panonun, özellikle de "PayPal Son Aktiviteler" bölümünün iyileştirilmesi gerektiğini düşünüyorum. 0$ Tekrarlayan ödeme "Oluşturuldu" durum satırlarını göstermemeniz gerektiğini düşünüyorum; bu, bir sürü ek satır ekliyor ve gün/son birkaç gün içinde ne kadar gelir elde ettiğinizi bir bakışta kolayca göremiyorsunuz.

Mark Stuart bunu tüketici ürünleri ekibine iletti:

> Teşekkürler! Aktivite'den hangi ekibin sorumlu olduğundan emin değilim, ancak doğru ekibi bulmak için tüketici ürünleri müdürüne ilettim. 0,00$ tutarındaki tekrarlayan ödeme bir hata gibi görünüyor. Muhtemelen filtrelenmeli.

**Sonuç**: Hiçbir zaman düzeltilmedi. Kullanıcı arayüzü hâlâ bu işe yaramaz $0 girişlerini gösteriyor.

### 2021: Sandbox Ortamı Arızaları {#2021-sandbox-environment-failures}

Kasım 2021'de PayPal'ın deneme ortamıyla ilgili kritik sorunları bildirmiştik:

* Sandbox gizli API anahtarları rastgele değiştirildi ve devre dışı bırakıldı
* Tüm sandbox test hesapları bildirimde bulunulmadan silindi
* Sandbox hesap ayrıntılarını görüntülemeye çalışırken hata mesajları
* Aralıklı yükleme hataları

> Bilinmeyen bir sebepten dolayı Sandbox gizli API anahtarım değiştirildi ve Devre Dışı bırakıldı. Ayrıca tüm eski Sandbox test hesaplarım silindi.

> Bazen yükleniyor, bazen yüklenmiyor. Bu inanılmaz derecede sinir bozucu.

**Sonuç**: Yanıt yok, çözüm yok. Geliştiriciler hâlâ deneme ortamı güvenilirliği sorunlarıyla karşı karşıya.

### 2021: Rapor Sistemi Tamamen Bozuk {#2021-reports-system-completely-broken}

Mayıs 2021'de PayPal'ın işlem raporları için indirme sisteminin tamamen bozulduğunu bildirmiştik:

> Görünüşe göre indirme raporlaması şu anda çalışmıyor ve tüm gün de çalışmadı. Ayrıca, başarısız olursa muhtemelen bir e-posta bildirimi alırım.

Oturum yönetimi felaketine de dikkat çektik:

> Ayrıca PayPal'a 5 dakika kadar giriş yapmadığınızda oturumunuz kapatılıyor. Dolayısıyla, durumunu kontrol etmek istediğiniz raporun yanındaki butonu tekrar yenilediğinizde (sonsuza kadar bekledikten sonra), tekrar giriş yapmak zorunda kalmak can sıkıcı oluyor.

Mark Stuart oturum zaman aşımı sorununu kabul etti:

> Geçmişte, IDE'niz ile developer.paypal.com veya satıcı panonuz arasında geçiş yaparken oturumunuzun sık sık sona erdiğini ve geliştirme akışınızın kesintiye uğradığını, daha sonra geri döndüğünüzde tekrar çıkış yaptığınızı bildirdiğinizi hatırlıyorum.

**Sonuç**: Oturum zaman aşımı süreleri hala 60 saniye. Raporlama sistemi hala düzenli olarak başarısız oluyor.

### 2022: Çekirdek API Özelliği Eksik (Yine) {#2022-core-api-feature-missing-again}

Ocak 2022'de abonelik listeleme sorununu tekrar gündeme getirdik, bu sefer belgelerinin nasıl yanlış olduğuna dair daha da fazla ayrıntı verdik:

> Tüm abonelikleri (önceden faturalandırma anlaşmaları olarak adlandırılıyordu) listeleyen bir GET yok

Resmi belgelerinin tamamen yanlış olduğunu keşfettik:

> API belgeleri de tamamen hatalı. Abonelik kimliklerinin sabit kodlanmış bir listesini indirerek geçici bir çözüm bulabileceğimizi düşündük. Ama bu bile işe yaramıyor!

> Buradaki resmi belgelerden... Bunu yapabileceğinizi söylüyor... İşte en can alıcı nokta, işaretlenebilecek bir "Abonelik Kimliği" alanının hiçbir yerde bulunmaması.

PayPal'dan Christina Monti şu yanıtı verdi:

> Bu adımların yanlış olmasından kaynaklanan hayal kırıklıklarından dolayı özür dileriz, bu sorunu bu hafta düzelteceğiz.

Sri Shivananda (CTO) bize teşekkür etti:

> Bizi daha iyi hale getirmek için verdiğiniz sürekli yardım için teşekkür ederiz. Çok takdir ediyorum.

**Sonuç**: Belgeler hiçbir zaman düzeltilmedi. Abonelik listeleme uç noktası hiçbir zaman oluşturulmadı.

## Geliştirici Deneyimi Kabusu {#the-developer-experience-nightmare}

PayPal API'leriyle çalışmak, 10 yıl öncesine gitmek gibi. İşte belgelediğimiz teknik sorunlar:

### Bozuk Kullanıcı Arayüzü {#broken-user-interface}

PayPal geliştirici paneli tam bir felaket. İşte her gün karşılaştığımız sorunlar:

<figure>
<figcaption><div class="alert alert-danger small text-center">
PayPal'ın kullanıcı arayüzü o kadar bozuk ki bildirimleri bile kapatamıyorsunuz.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
Tarayıcınız video etiketini desteklemiyor.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Geliştirici panosu, bir kaydırıcıyı sürüklemenizi ve 60 saniye sonra oturumunuzu kapatmanızı sağlıyor.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
Tarayıcınız video etiketini desteklemiyor.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
PayPal geliştirici arayüzünde bozuk iş akışlarını gösteren daha fazla kullanıcı arayüzü felaketi
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
Tarayıcınız video etiketini desteklemiyor.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Abonelik yönetimi arayüzü - arayüz o kadar kötü ki, ürün ve abonelik planları oluşturmak için koda güvenmek zorunda kaldık.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Eksik işlevlere sahip bozuk abonelik arayüzünün bir görünümü (ürünleri/planları/abonelikleri kolayca oluşturamıyorsunuz ve kullanıcı arayüzünde oluşturulduktan sonra ürünleri veya planları silmenin bir yolu yok gibi görünüyor)
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Tipik PayPal hata mesajları - gizemli ve yardımcı olmayan
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### SDK Sorunları {#sdk-problems}

* SDK'yı betik etiketleriyle yeniden yüklerken düğmeleri değiştirme ve yeniden oluşturma gibi karmaşık geçici çözümler olmadan hem tek seferlik ödemeleri hem de abonelikleri işleyemez.
* JavaScript SDK'sı temel kuralları ihlal ediyor (küçük harfli sınıf adları, örnek denetimi yok)
* Hata mesajları hangi alanların eksik olduğunu belirtmiyor.
* Tutarsız veri türleri (sayılar yerine dize miktarları gerektiriyor)

### İçerik Güvenlik Politikası İhlalleri {#content-security-policy-violations}

SDK'ları CSP'nizde unsafe-inline ve unsafe-eval gerektirir ve **sitenizin güvenliğini tehlikeye atmanıza** neden olur.

### Belgeleme Kaosu {#documentation-chaos}

Mark Stuart'ın kendisi de itiraf etti:

> Çok fazla eski ve yeni API olduğu konusunda hemfikirim. Ne aradığımızı bulmak gerçekten zor (burada çalışan bizler için bile).

### Güvenlik Açıkları {#security-vulnerabilities}

**PayPal'ın 2FA uygulaması geriye dönüktür**. TOTP uygulamaları etkin olsa bile, SMS doğrulamasını zorunlu kılarak hesapları SIM kart değiştirme saldırılarına karşı savunmasız hale getirir. TOTP etkinse, yalnızca bunu kullanmalıdır. Yedek çözüm SMS değil, e-posta olmalıdır.

### Oturum Yönetimi Felaketi {#session-management-disaster}

**Geliştirici kontrol panelleri 60 saniyelik bir işlem yapılmadığında oturumunuzu kapatır**. Üretken bir şey yapmaya çalıştığınızda sürekli şu adımları izlersiniz: giriş → captcha → 2FA → çıkış → tekrar. VPN mi kullanıyorsunuz? İyi şanslar.

## Temmuz 2025: Son Damla {#july-2025-the-final-straw}

11 yıl boyunca aynı sorunlarla boğuştuktan sonra, rutin bir hesap geçişi sırasında kırılma noktası yaşandı. Daha temiz bir muhasebe için şirket adımız "Forward Email LLC" ile uyumlu yeni bir PayPal hesabına geçmemiz gerekiyordu.

Basit olması gereken şey tam bir felakete dönüştü:

* İlk testler her şeyin doğru çalıştığını gösterdi
* Saatler sonra PayPal, herhangi bir bildirimde bulunmadan tüm abonelik ödemelerini aniden engelledi
* Müşteriler ödeme yapamadı, bu da kafa karışıklığına ve destek yüküne yol açtı
* PayPal destek ekibi, hesapların doğrulandığını iddia ederek çelişkili yanıtlar verdi
* PayPal ödemelerini tamamen durdurmak zorunda kaldık

<figure>
<figcaption><div class="alert alert-danger small text-center">
Müşterilerin ödeme yapmaya çalışırken karşılaştığı hata - açıklama yok, kayıt yok, hiçbir şey yok
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
PayPal desteği, ödemeler tamamen bozulmuşken her şeyin yolunda olduğunu iddia ediyor. Son mesajda, "bazı özellikleri geri yüklediklerini" ancak yine de belirtilmemiş daha fazla bilgi istediklerini görüyoruz - klasik PayPal destek tiyatrosu
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="PayPal help center screenshot 1" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="PayPal help center screenshot 2" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="PayPal help center screenshot 3" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="PayPal help center screenshot 4" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="PayPal help center screenshot 5" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="PayPal help center screenshot 6" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Hiçbir şeyi "düzeltmediği" iddia edilen kimlik doğrulama süreci
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="PayPal take care screenshot 1" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="PayPal take care screenshot 2" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="PayPal take care screenshot 3" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="PayPal take care screenshot 4" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="PayPal take care screenshot 5" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-6.png" alt="PayPal take care screenshot 6" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-7.png" alt="PayPal take care screenshot 7" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Belirsiz bir mesaj ve hala bir çözüm yok. Ek bilgi gerekip gerekmediğine dair hiçbir bilgi, bildirim veya herhangi bir şey yok. Müşteri desteği sessizliğini koruyor.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>

## Neden PayPal'ı Bırakamıyoruz? {#why-we-cant-just-drop-paypal}

Tüm bu sorunlara rağmen, bazı müşterilerimiz yalnızca PayPal'ı ödeme seçeneği olarak kullandığı için PayPal'ı tamamen terk edemeyiz. Bir müşterimizin [durum sayfası](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515) sayfamızda söylediği gibi:

> PayPal ödeme için tek seçeneğim

**PayPal'ın belirli kullanıcılar için bir ödeme tekeli yaratması nedeniyle, bozuk bir platformu desteklemek zorunda kalıyoruz.**

## Topluluk Geçici Çözümü {#the-community-workaround}

PayPal temel abonelik listeleme işlevselliğini sağlamayacağı için, geliştirici topluluğu geçici çözümler geliştirdi. PayPal aboneliklerini yönetmeye yardımcı olan bir betik oluşturduk: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Bu betik, geliştiricilerin çözüm paylaştığı bir [topluluk özeti](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4)'a atıfta bulunur. Kullanıcılar ise aslında PayPal'ın yıllar önce oluşturması gereken şeyi sağladıkları için [bize teşekkür ediyor](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775)'dir.

## Kimlik Avı Nedeniyle PayPal Şablonlarının Engellenmesi {#blocking-paypal-templates-due-to-phishing}

Sorunlar API'lerin ötesine geçiyor. PayPal'ın e-posta şablonları o kadar kötü tasarlanmış ki, kimlik avı girişimlerinden ayırt edilemedikleri için e-posta servisimizde belirli filtrelemeler uygulamak zorunda kaldık.

### Gerçek Sorun: PayPal'ın Şablonları Dolandırıcılık Gibi Görünüyor {#the-real-problem-paypals-templates-look-like-scams}

PayPal'dan, tıpkı kimlik avı girişimleri gibi görünen e-postalar hakkında düzenli olarak bildirimler alıyoruz. İşte kötüye kullanım bildirimlerimizden gerçek bir örnek:

**Konu:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Bu e-posta, bir kimlik avı girişimi gibi göründüğü için `abuse@microsoft.com` adresine yönlendirildi. Sorun ne? Aslında PayPal'ın deneme ortamındandı, ancak şablon tasarımları o kadar kötü ki kimlik avı tespit sistemlerini tetikliyor.

### Uygulamamız {#our-implementation}

[e-posta filtreleme kodu](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172)'da uygulanan PayPal'a özgü filtrelemeyi görebilirsiniz:

```javascript
// check for paypal scam (very strict until PayPal resolves phishing on their end)
// (seems to only come from "outlook.com" and "paypal.com" hosts)
//
// X-Email-Type-Id = RT000238
// PPC001017
// RT000542 = gift message hack
// RT002947 = paypal invoice spam
// <https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-fraud/>
//
if (
  session.originalFromAddressRootDomain === 'paypal.com' &&
  headers.hasHeader('x-email-type-id') &&
  ['PPC001017', 'RT000238', 'RT000542', 'RT002947'].includes(
    headers.getFirst('x-email-type-id')
  )
) {
  const err = new SMTPError(
    'Due to ongoing PayPal invoice spam, you must manually send an invoice link'
  );
  err.isCodeBug = true; // alert admins for inspection
  throw err;
}
```

### PayPal'ı Neden Engellemek Zorunda Kaldık? {#why-we-had-to-block-paypal}

Bunu, PayPal'ın kötüye kullanım ekiplerine defalarca bildirmemize rağmen büyük çaplı spam/kimlik avı/dolandırıcılık sorunlarını düzeltmeyi reddetmesi nedeniyle uyguladık. Engellediğimiz belirli e-posta türleri şunlardır:

* **RT000238** - Şüpheli fatura bildirimleri
* **PPC001017** - Sorunlu ödeme onayları
* **RT000542** - Hediye mesajı hackleme girişimleri

### Sorunun Ölçeği {#the-scale-of-the-problem}

Spam filtreleme kayıtlarımız, her gün işlediğimiz PayPal fatura spam'lerinin ne kadar büyük olduğunu göstermektedir. Engellenen konulara örnek olarak şunlar verilebilir:

* "PayPal Faturalandırma Ekibinden Fatura: - Bu ücret hesabınızdan otomatik olarak çekilecektir. Lütfen hemen bizimle iletişime geçin: \[TELEFON]"
* "\[ŞİRKET ADI] (\[SİPARİŞ KİMLİĞİ]) tarafından gönderilen fatura"
* Farklı telefon numaraları ve sahte sipariş kimlikleriyle birden fazla varyasyon

Bu e-postalar genellikle `outlook.com` sunucularından geliyor, ancak PayPal'ın meşru sistemlerinden geliyormuş gibi görünüyor ve bu da onları özellikle tehlikeli kılıyor. E-postalar, PayPal'ın gerçek altyapısı üzerinden gönderildikleri için SPF, DKIM ve DMARC kimlik doğrulamasından geçiyor.

Teknik kayıtlarımız, bu spam e-postalarının meşru PayPal başlıkları içerdiğini gösteriyor:

* `X-Email-Type-Id: RT000238` (engellediğimiz kimlik)
* `From: "service@paypal.com" <service@paypal.com>`
* `paypal.com`'den geçerli DKIM imzaları
* PayPal'ın posta sunucularını gösteren uygun SPF kayıtları

Bu da imkânsız bir durum yaratıyor: Yasal PayPal e-postaları ve spam'lerin her ikisinin de teknik özellikleri aynı.

### İroni {#the-irony}

Finansal dolandırıcılıkla mücadelede öncü olması gereken PayPal'ın e-posta şablonları o kadar kötü tasarlanmış ki, kimlik avı önleme sistemlerini tetikliyor. Dolandırıcılıklardan ayırt edilemedikleri için meşru PayPal e-postalarını engellemek zorunda kalıyoruz.

Bu durum güvenlik araştırmasında belgelenmiştir: [PayPal yeni adres dolandırıcılığına dikkat edin](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - PayPal'ın kendi sistemlerinin dolandırıcılık için nasıl istismar edildiğini göstermektedir.

### Gerçek Dünya Etkisi: Yeni PayPal Dolandırıcılıkları {#real-world-impact-novel-paypal-scams}

Sorun, kötü şablon tasarımının ötesine uzanıyor. PayPal'ın fatura sistemi o kadar kolay suistimal ediliyor ki, dolandırıcılar bunu düzenli olarak meşru görünen sahte faturalar göndermek için kullanıyor. Güvenlik araştırmacısı Gavin Anderegg, dolandırıcıların tüm kimlik doğrulama kontrollerini geçen gerçek PayPal faturaları gönderdiği [Yeni Bir PayPal Dolandırıcılığı](https://anderegg.ca/2023/02/01/a-novel-paypal-scam)'ı belgeledi:

> "Kaynağı incelediğimde, e-postanın gerçekten PayPal'dan gelmiş gibi göründüğünü fark ettim (SPF, DKIM ve DMARC hepsi onaylanmış). Düğme ayrıca meşru bir PayPal URL'sine de bağlantı veriyordu... Meşru bir e-posta olduğunu anlamam bir saniye sürdü. Bir dolandırıcıdan rastgele bir 'fatura' gelmişti."

<figure>
<figcaption><div class="alert alert-danger small text-center">
Gelen kutusunu dolduran ve aslında PayPal sistemlerinden geldikleri için meşru görünen birden fazla sahte PayPal faturasını gösteren ekran görüntüsü
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

Araştırmacı şunları kaydetti:

> "Ayrıca PayPal'ın kilitlemeyi düşünmesi gereken bir kolaylık özelliği gibi görünüyor. Hemen bunun bir tür dolandırıcılık olduğunu düşündüm ve sadece teknik ayrıntılarla ilgilendim. Yapması çok kolay görünüyor ve başkalarının da buna kanmasından endişeleniyorum."

Bu, sorunu mükemmel bir şekilde açıklıyor: PayPal'ın kendi meşru sistemleri o kadar kötü tasarlanmış ki, dolandırıcılığa olanak tanırken aynı zamanda meşru iletişimleri şüpheli gösteriyor.

Daha da kötüsü, bu durum Yahoo ile teslimatımızı etkiledi ve müşteri şikayetlerine, saatlerce süren titiz testlere ve kalıp kontrollerine yol açtı.

## PayPal'ın Ters KYC Süreci {#paypals-backwards-kyc-process}

PayPal platformunun en sinir bozucu yönlerinden biri, uyumluluk ve Müşterinizi Tanıyın (KYC) prosedürlerine yönelik geriye dönük yaklaşımıdır. Diğer tüm ödeme işlemcilerinin aksine, PayPal, geliştiricilerin API'lerini entegre etmelerine ve gerekli doğrulamayı tamamlamadan önce üretim aşamasında ödeme toplamaya başlamalarına olanak tanır.

### Nasıl Çalışmalı {#how-it-should-work}

Her meşru ödeme işlemcisi şu mantıksal sırayı izler:

1. **Önce KYC doğrulamasını tamamlayın**
2. **Satıcı hesabını onaylayın**
3. **Üretim API erişimi sağlayın**
4. **Ödeme tahsilatına izin verin**

Bu, herhangi bir para el değiştirmeden önce uyumluluğu sağlayarak hem ödeme işlemcisini hem de satıcıyı korur.

### PayPal Aslında Nasıl Çalışır? {#how-paypal-actually-works}

PayPal'ın süreci tamamen tersine işliyor:

1. **Üretim API'sine hemen erişim sağlayın**
2. **Ödeme tahsilatına saatler veya günler boyunca izin verin**
3. **Ödemeleri bildirimde bulunmaksızın aniden engelleyin**
4. **Müşteriler etkilendikten sonra KYC belgeleri talep edin**
5. **Satıcıya herhangi bir bildirimde bulunmayın**
6. **Müşterilerin sorunu keşfetmesine ve bildirmesine izin verin**

### Gerçek Dünya Etkisi {#the-real-world-impact}

Bu geriye doğru süreç işletmeler için felaketlere yol açar:

* **Müşteriler yoğun satış dönemlerinde satın alımlarını tamamlayamıyor**
* **Doğrulama gerektiğine dair **önceden uyarı yok**
* **Ödemeler engellendiğinde** **e-posta bildirimi yok**
* **Satıcılar, kafası karışık müşterilerden sorunları öğreniyor**
* **Kritik iş dönemlerinde** **Gelir kaybı**
* **Ödemeler gizemli bir şekilde başarısız olduğunda** **Müşteri güveninin zedelenmesi**

### Temmuz 2025 Hesap Taşıma Felaketi {#the-july-2025-account-migration-disaster}

Temmuz 2025'teki rutin hesap geçişimiz sırasında tam olarak bu senaryo yaşandı. PayPal başlangıçta ödemelerin çalışmasına izin verdi, ancak daha sonra herhangi bir bildirimde bulunmadan aniden engelledi. Sorunu, müşteriler ödeme yapamadıklarını bildirmeye başladığında keşfettik.

Destek ekibiyle iletişime geçtiğimizde, hangi belgelerin gerekli olduğu konusunda çelişkili yanıtlar aldık ve çözüm için net bir zaman çizelgesi sunulmadı. Bu durum, başka ödeme seçeneği olmayan müşterilerimizin kafasını karıştırdı ve PayPal ödemelerini tamamen durdurmamıza neden oldu.

### Bunun Önemi {#why-this-matters}

PayPal'ın uyumluluk yaklaşımı, işletmelerin nasıl işlediğine dair temel bir yanlış anlamayı ortaya koyuyor. Doğru KYC, müşteriler ödeme yapmaya başladıktan sonra değil, üretim entegrasyonundan **önce** gerçekleşmelidir. Sorunlar ortaya çıktığında proaktif iletişim eksikliği, PayPal'ın satıcı ihtiyaçlarından kopuk olduğunu gösteriyor.

Bu geriye doğru işleyiş, PayPal'ın daha geniş kapsamlı organizasyonel sorunlarının bir göstergesi: Satıcı ve müşteri deneyiminin önüne kendi iç süreçlerini koyuyorlar ve bu da işletmeleri platformlarından uzaklaştıran türden operasyonel felaketlere yol açıyor.

## Diğer Ödeme İşlemcilerinin Bunu Doğru Yapması {#how-every-other-payment-processor-does-it-right}

PayPal'ın uygulamayı reddettiği abonelik listeleme işlevi, sektörde on yılı aşkın süredir standart olarak sunuluyor. Diğer ödeme işlemcilerinin bu temel gereksinimi nasıl karşıladığına bir bakalım:

### Çizgisi {#stripe}

Stripe, API'si kullanıma sunulduğundan beri abonelik listeleme özelliğine sahip. Dokümantasyonları, bir müşteri veya satıcı hesabı için tüm aboneliklerin nasıl alınacağını açıkça gösteriyor. Bu, temel CRUD işlevi olarak kabul ediliyor.

### Kürek {#paddle}

Paddle, listeleme, filtreleme ve sayfalama gibi kapsamlı abonelik yönetimi API'leri sunar. Satıcıların tekrarlayan gelir akışlarını görmeleri gerektiğinin farkındadırlar.

### Coinbase Ticaret {#coinbase-commerce}

Coinbase Commerce gibi kripto para ödeme işlemcileri bile PayPal'dan daha iyi abonelik yönetimi sağlıyor.

### Kare {#square}

Square'in API'si abonelik listelemeyi sonradan eklenen bir özellik değil, temel bir özellik olarak içeriyor.

### Endüstri Standardı {#the-industry-standard}

Her modern ödeme işlemcisi şunları sağlar:

* Tüm abonelikleri listele
* Durum, tarih ve müşteriye göre filtreleme
* Büyük veri kümeleri için sayfalandırma
* Abonelik değişiklikleri için webhook bildirimleri
* Çalışan örneklerle kapsamlı dokümantasyon

### Diğer İşlemcilerin Sağladığı ve PayPal'a Karşı Olan Özellikler {#what-other-processors-provide-vs-paypal}

**Stripe - Tüm Abonelikleri Listele:**

```http
GET https://api.stripe.com/v1/subscriptions
Authorization: Bearer sk_test_...

Response:
{
  "object": "list",
  "data": [
    {
      "id": "sub_1MowQVLkdIwHu7ixeRlqHVzs",
      "object": "subscription",
      "status": "active",
      "customer": "cus_Na6dX7aXxi11N4",
      "current_period_start": 1679609767,
      "current_period_end": 1682288167
    }
  ],
  "has_more": false
}
```

**Stripe - Müşteriye Göre Filtrele:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Duruma Göre Filtrele:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - Gerçekte Ne Alırsınız:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# You can ONLY get ONE subscription if you already know the ID
# There is NO endpoint to list all subscriptions
# There is NO way to search or filter
# You must track all subscription IDs yourself
```

**PayPal'ın Kullanılabilir Uç Noktaları:**

* `POST /v1/billing/subscriptions` - Abonelik oluştur
* `GET /v1/billing/subscriptions/{id}` - BİR abonelik al (kimliğini biliyorsan)
* `PATCH /v1/billing/subscriptions/{id}` - Aboneliği güncelle
* `POST /v1/billing/subscriptions/{id}/cancel` - Aboneliği iptal et
* `POST /v1/billing/subscriptions/{id}/suspend` - Aboneliği askıya al

**PayPal'da Neler Eksik:**

* ❌ `GET /v1/billing/subscriptions` yok (tümünü listele)
* ❌ Arama işlevi yok
* ❌ Durum, müşteri ve tarihe göre filtreleme yok
* ❌ Sayfalandırma desteği yok

PayPal, geliştiricilerin abonelik kimliklerini kendi veritabanlarında manuel olarak takip etmesini zorunlu kılan tek büyük ödeme işlemcisidir.

## PayPal'ın Sistematik Örtbas Etme Operasyonu: 6 Milyon Sesi Susturma {#paypals-systematic-cover-up-silencing-6-million-voices}

PayPal'ın eleştirilere yaklaşımını mükemmel bir şekilde özetleyen bir hamleyle, yakın zamanda tüm topluluk forumunu çevrimdışı hale getirdiler, 6 milyondan fazla üyeyi susturdular ve başarısızlıklarını belgeleyen yüz binlerce gönderiyi sildi.

### Büyük Silme {#the-great-erasure}

`paypal-community.com` adresindeki orijinal PayPal Topluluğu **6.003.558 üyeye** ev sahipliği yapmış ve PayPal'ın API arızalarıyla ilgili yüz binlerce gönderi, hata raporu, şikayet ve tartışma içeriyordu. Bu, PayPal'ın sistematik sorunlarına dair on yılı aşkın süredir belgelenmiş bir kanıttı.

PayPal, 30 Haziran 2025'te tüm forumu sessizce çevrimdışı hale getirdi. Tüm `paypal-community.com` bağlantıları artık 404 hatası veriyor. Bu bir geçiş veya yükseltme değildi.

### Üçüncü Taraf Kurtarma {#the-third-party-rescue}

Neyse ki, [ppl.lithium.com](https://ppl.lithium.com/) adresindeki bir üçüncü taraf hizmeti, içeriğin bir kısmını koruyarak PayPal'ın gizlemeye çalıştığı tartışmalara erişmemizi sağladı. Ancak, bu üçüncü taraf koruması eksik ve her an ortadan kalkabilir.

Bu delil gizleme yöntemi PayPal için yeni değil. Belgelenmiş bir geçmişleri var:

* Kritik hata raporlarının herkese açık görünümden kaldırılması
* Geliştirici araçlarının bildirimde bulunulmadan kullanımdan kaldırılması
* API'lerin uygun dokümantasyon olmadan değiştirilmesi
* Toplulukta, hataları hakkında tartışmaların susturulması

Forumun kapatılması, kamuoyunun incelemesinden sistematik başarısızlıklarını gizlemek için şimdiye kadar yapılmış en küstahça girişimdir.

## 11 Yıllık Hata Yakalama Felaketi: 1.899 Dolar ve Sayımı Devam Ediyor {#the-11-year-capture-bug-disaster-1899-and-counting}

PayPal geri bildirim oturumları düzenlemek ve vaatlerde bulunmakla meşgulken, temel ödeme işleme sistemleri 11 yıldan uzun süredir temelden bozuktu. Kanıtlar yıkıcı.

### E-postanın 1.899 Dolarlık Kaybını İlet {#forward-emails-1899-loss}

Üretim sistemlerimizde, PayPal'ın yakalama hataları nedeniyle kaybolan toplam **1.899$** tutarında 108 PayPal ödemesi tespit ettik. Bu ödemeler tutarlı bir model göstermektedir:

* `CHECKOUT.ORDER.APPROVED` webhook'ları alındı
* PayPal'ın yakalama API'si 404 hatası döndürdü
* Siparişler PayPal API'si üzerinden erişilemez hale geldi

PayPal'ın 14 gün sonra hata ayıklama kayıtlarını tamamen gizlemesi ve yakalanmayan sipariş kimliklerine ait tüm verileri kontrol panelinden silmesi nedeniyle müşterilerden ücret alınıp alınmadığını belirlemek imkansızdır.

Bu, yalnızca tek bir işletmeyi temsil ediyor. **11 yılı aşkın süredir binlerce tüccarın uğradığı toplam kayıpların toplamı muhtemelen milyonlarca doları buluyor.**

**Tekrar belirtelim: 11+ yılda binlerce tüccarın toplam kaybı muhtemelen milyonlarca doları buluyor.**

Bunu keşfetmemizin tek sebebi inanılmaz derecede titiz ve veri odaklı olmamızdır.

### 2013 Orijinal Raporu: 11+ Yıllık İhmal {#the-2013-original-report-11-years-of-negligence}

Bu sorunun en erken belgelenmiş raporu [Kasım 2013'te Stack Overflow](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([arşivlendi](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)) üzerinde görünmektedir:

> "Yakalama yaparken Rest API ile 404 Hatası almaya devam ediyorum"

2013 yılında bildirilen hata, Forward Email'in 2024 yılında yaşadığı hatayla **aynı**:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

2013 yılında toplumun tepkisi şu şekildeydi:

> "Şu anda REST API ile ilgili bir sorun bildiriliyor. PayPal bu sorun üzerinde çalışıyor."

**11+ yıl sonra, hala "bunun üzerinde çalışıyorlar."**

### 2016 Kabulü: PayPal Kendi SDK'sını Kırıyor {#the-2016-admission-paypal-breaks-their-own-sdk}

2016 yılında, PayPal'ın kendi GitHub deposu, [büyük yakalama başarısızlıkları](https://github.com/paypal/PayPal-PHP-SDK/issues/660)'ın resmi PHP SDK'sını etkilediğini belgeledi. Ölçek şaşırtıcıydı:

> "20.09.2016'dan bu yana, tüm PayPal yakalama girişimleri 'INVALID_RESOURCE_ID - İstenen kaynak kimliği bulunamadı' hatasıyla başarısız oluyor. 19.09 ile 20.09 arasında API entegrasyonunda hiçbir değişiklik yapılmadı. **20.09'dan bu yana yapılan yakalama girişimlerinin %100'ü bu hatayı döndürdü.**"

Bir tüccar şunları bildirdi:

> "Son 24 saatte **1.400'den fazla başarısız yakalama girişimim oldu** ve hepsinde INVALID_RESOURCE_ID hata yanıtı vardı."

PayPal'ın ilk tepkisi, satıcıyı suçlamak ve teknik desteğe yönlendirmek oldu. Ancak yoğun baskı sonrasında hatalarını kabul ettiler:

> "Ürün Geliştiricilerimizden bir güncelleme aldım. Gönderilen başlıklarda PayPal-Request-ID'nin 42 karakterle gönderildiğini fark ettiler, ancak **görünüşe göre yakın zamanda bu kimliği yalnızca 38 karakterle sınırlayan bir değişiklik yapılmış.**"

Bu itiraf PayPal'ın sistematik ihmalini ortaya koyuyor:

1. **Belgelenmemiş, bozucu değişiklikler yaptılar**
2. **Kendi resmi SDK'larını bozdular**
3. **Önce satıcıları suçladılar**
4. **Hatayı ancak baskı altında kabul ettiler**

Sorunu "düzelttikten" sonra bile tüccarlar şunları bildirdi:

> "SDK'yı v1.7.4'e yükselttim ve **sorun hala devam ediyor.**"

### 2024 Tırmanışı: Hala Bozuk {#the-2024-escalation-still-broken}

PayPal Topluluğu'ndan gelen son raporlar, sorunun aslında daha da kötüleştiğini gösteriyor. [Eylül 2024 tartışması](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([arşivlendi](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) aynı sorunları belgeliyor:

> "Sorun yaklaşık 2 hafta önce ortaya çıkmaya başladı ve tüm siparişleri etkilemiyor. **Daha yaygın olanı, yakalama sırasında 404 hatası gibi görünüyor.**"

Tüccar, Forward Email'in deneyimlediği aynı modeli şöyle anlatıyor:

> "Siparişi yakalamaya çalıştıktan sonra PayPal 404 hatası döndürüyor. Siparişin Ayrıntıları alınırken: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Bu, bizim tarafımızda başarılı bir yakalamanın izine rastlanmamıştır.**"

### Webhook Güvenilirlik Felaketi {#the-webhook-reliability-disaster}

Başka bir [korunan topluluk tartışması](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446), PayPal'ın webhook sisteminin temelde güvenilmez olduğunu ortaya koyuyor:

> "Teorik olarak, Webhook olayından iki olay (CHECKOUT.ORDER.APPROVED ve PAYMENT.CAPTURE.COMPLETED) olması gerekir. Aslında, **bu iki olay nadiren hemen alınır, PAYMENT.CAPTURE.COMPLETED çoğu zaman alınamaz veya birkaç saat içinde alınır.**"

Abonelik ödemeleri için:

> "**'ÖDEME.SATIŞ.TAMAMLANDI' bazen veya birkaç saat içinde alınamadı.**"

Satıcının soruları PayPal'ın güvenilirlik sorunlarının derinliğini ortaya koyuyor:

1. **"Bu neden oluyor?"** - PayPal'ın webhook sistemi temelden bozuk.
2. **"Sipariş durumu 'TAMAMLANDI' ise, parayı aldığımı varsayabilir miyim?"** - Satıcılar PayPal'ın API yanıtlarına güvenemiyor.
3. **"'Olay Günlükleri->Webhook Olayları' neden hiçbir günlük bulamıyor?"** - PayPal'ın kendi günlük sistemi bile çalışmıyor.

### Sistematik İhmal Örneği {#the-pattern-of-systematic-negligence}

Kanıtlar 11+ yılı kapsıyor ve net bir model gösteriyor:

* **2013**: "PayPal üzerinde çalışıyor"
* **2016**: PayPal, hatalı değişikliği kabul etti ve hatalı düzeltme sağladı
* **2024**: Aynı hatalar hâlâ devam ediyor ve Forward Email ve sayısız diğer özelliği etkiliyor

Bu bir hata değil - **bu sistematik bir ihmaldir.** PayPal, bu kritik ödeme işleme hatalarını on yıldan uzun süredir biliyor ve sürekli olarak şunları yapıyor:

1. **PayPal'ın hatalarından satıcıları sorumlu tuttu**
2. **Belgelenmemiş, bozucu değişiklikler yaptı**
3. **Çalışmayan yetersiz düzeltmeler sağladı**
4. **İşletmeler üzerindeki finansal etkiyi görmezden geldi**
5. **Topluluk forumlarını kapatarak kanıtları gizledi**

### Belgelenmemiş Gereksinim {#the-undocumented-requirement}

PayPal'ın resmi belgelerinde, satıcıların yakalama işlemleri için yeniden deneme mantığı uygulaması gerektiğinden hiçbir yerde bahsedilmiyor. Belgelerde, satıcıların "onaydan hemen sonra yakalama yapmaları" gerektiği belirtiliyor, ancak API'lerinin karmaşık yeniden deneme mekanizmaları gerektiren rastgele 404 hataları döndürdüğünden bahsedilmiyor.

Bu durum her tüccarı şuna zorlar:

* Üstel geri çekilme yeniden deneme mantığını uygulayın
* Tutarsız webhook teslimatını yönetin
* Karmaşık durum yönetim sistemleri oluşturun
* Başarısız yakalamaları manuel olarak izleyin

**Diğer tüm ödeme işlemcileri ilk seferde çalışan güvenilir yakalama API'leri sağlar.**

## PayPal'ın Daha Geniş Aldatma Modeli {#paypals-broader-pattern-of-deception}

Yakalama hatası felaketi, PayPal'ın müşterileri aldatma ve hatalarını gizleme konusundaki sistematik yaklaşımının sadece bir örneğidir.

### New York Mali Hizmetler Departmanı Eylemi {#the-new-york-department-of-financial-services-action}

Ocak 2025'te New York Mali Hizmetler Departmanı aldatıcı uygulamalar için [PayPal'a karşı yaptırım eylemi](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) yayınladı ve PayPal'ın aldatma modelinin API'lerinin çok ötesine uzandığını gösterdi.

Bu düzenleyici eylem, PayPal'ın yalnızca geliştirici araçlarında değil, tüm iş kolunda aldatıcı uygulamalara girme isteğini gösteriyor.

### Bal Davası: Ortaklık Bağlantılarının Yeniden Yazılması {#the-honey-lawsuit-rewriting-affiliate-links}

PayPal'ın Honey'i satın alması, içerik üreticilerinden ve etkileyicilerden komisyon çalan [Honey'nin ortaklık bağlantılarını yeniden yazdığı iddiasıyla açılan davalar](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer)'ın ortaya çıkmasına neden oldu. Bu, PayPal'ın başkalarına gitmesi gereken geliri yönlendirerek kâr elde ettiği sistematik bir aldatmacanın başka bir biçimini temsil ediyor.

Desen açıktır:

1. **API hataları**: Bozuk işlevleri gizleyin, satıcıları suçlayın
2. **Topluluk susturma**: Sorunlara dair kanıtları kaldırın
3. **Düzenleme ihlalleri**: Aldatıcı uygulamalara girişin
4. **Ortaklık hırsızlığı**: Teknik manipülasyon yoluyla komisyon çalın

### PayPal'ın İhmalinin Maliyeti {#the-cost-of-paypals-negligence}

Forward Email'in 1.899 dolarlık kaybı buzdağının sadece görünen kısmı. Daha geniş kapsamlı etkisini düşünün:

* **Bireysel satıcılar**: Her biri yüzlerce hatta binlerce dolar kaybeden binlerce kişi
* **Kurumsal müşteriler**: Potansiyel olarak milyonlarca dolar gelir kaybı
* **Geliştirici zamanı**: PayPal'ın bozuk API'leri için geçici çözümler geliştirmek için harcanan sayısız saat
* **Müşteri güveni**: PayPal'ın ödeme hataları nedeniyle müşteri kaybeden işletmeler

Küçük bir e-posta hizmeti yaklaşık 2.000 dolar kaybettiyse ve bu sorun 11 yıldan uzun süredir varlığını sürdürüyorsa ve binlerce satıcıyı etkiliyorsa, toplam mali zarar muhtemelen **yüz milyonlarca dolara** ulaşacaktır.

### Belgeleme Yalanı {#the-documentation-lie}

PayPal'ın resmi dokümanlarında, satıcıların karşılaşabileceği kritik sınırlamalar ve hatalardan sürekli olarak bahsedilmiyor. Örneğin:

* **Yakalama API'si**: 404 hatalarının yaygın olduğu ve yeniden deneme mantığı gerektirdiği belirtilmemiştir.
* **Webhook güvenilirliği**: Webhook'ların genellikle saatlerce geciktiği belirtilmemiştir.
* **Abonelik listesi**: Belgeler, uç nokta olmadığında listelemenin mümkün olduğunu ima etmektedir.
* **Oturum zaman aşımları**: 60 saniyelik agresif zaman aşımlarından bahsedilmemiştir.

Kritik bilgilerin sistematik olarak ihmal edilmesi, tüccarları üretim sistemlerinde deneme yanılma yoluyla PayPal'ın sınırlarını keşfetmeye zorluyor ve bu da çoğu zaman maddi kayıplara yol açıyor.

## Bunun Geliştiriciler İçin Anlamı {#what-this-means-for-developers}

PayPal'ın kapsamlı geri bildirim toplarken temel geliştirici ihtiyaçlarını karşılamadaki sistematik başarısızlığı, temel bir organizasyon sorununu ortaya koyuyor. Geri bildirim toplamayı, sorunları çözmenin bir alternatifi olarak görüyorlar.

Desen açıktır:

1. Geliştiriciler sorunları bildiriyor
2. PayPal, yöneticilerle geri bildirim oturumları düzenliyor
3. Kapsamlı geri bildirim sağlanıyor
4. Ekipler eksiklikleri kabul ediyor ve "izleyip ele alma" sözü veriyor
5. Hiçbir şey uygulanmıyor
6. Yöneticiler daha iyi şirketlere gidiyor
7. Yeni ekipler aynı geri bildirimi istiyor
8. Döngü tekrar ediyor

Bu arada geliştiriciler, ödemeleri kabul etmek için geçici çözümler üretmek, güvenliği tehlikeye atmak ve bozuk kullanıcı arayüzleriyle uğraşmak zorunda kalıyor.

Bir ödeme sistemi oluşturuyorsanız, deneyimlerimizden ders çıkarın: [üçlü yaklaşım](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal)'ınızı birden fazla işlemciyle oluşturun, ancak PayPal'ın ihtiyaç duyduğunuz temel işlevleri sağlamasını beklemeyin. İlk günden itibaren geçici çözümler üretmeyi planlayın.

> Bu gönderi, Forward Email'de PayPal API'leriyle ilgili 11 yıllık deneyimimizi belgeliyor. Tüm kod örnekleri ve bağlantılar gerçek üretim sistemlerimizden alınmıştır. Bazı müşterilerimizin başka seçeneği olmadığı için bu sorunlara rağmen PayPal ödemelerini desteklemeye devam ediyoruz.

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />