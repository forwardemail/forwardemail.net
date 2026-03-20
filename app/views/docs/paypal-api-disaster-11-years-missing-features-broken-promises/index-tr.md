# PayPal'ın 11 Yıllık API Felaketi: Geliştiricileri Görmezden Gelirken Nasıl Çözümler Ürettik {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

> \[!NOTE]
> **Başarı! PayPal sonunda `GET /v1/billing/subscriptions` uç noktasını ekledi.**
>
> Bu yazıyı yayınlayıp PayPal'ın üst düzey yöneticilerine e-posta gönderdikten sonra, ekipleri abonelikleri listelemek için çok ihtiyaç duyulan uç noktayı uyguladı. Değişiklik [25 Haziran 2025](https://web.archive.org/web/20250625121019/https://developer.paypal.com/docs/api/subscriptions/v1/) ile [9 Temmuz 2025](https://web.archive.org/web/20250709102200/https://developer.paypal.com/docs/api/subscriptions/v1/) tarihleri arasında gerçekleşti.
>
> Ancak, tipik PayPal tarzında, bize asla bildirilmedi. Bu güncellemeyi ancak Aralık 2025'te, özellik sessizce yayınlandıktan aylar sonra kendi başımıza keşfettik.

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API felaketi illüstrasyonu" class="rounded-lg" />

<p class="lead mt-3">Forward Email olarak, on yılı aşkın süredir PayPal'ın bozuk API'leriyle uğraşıyoruz. Küçük rahatsızlıklarla başlayan süreç, kendi çözümlerimizi geliştirmemize, onların oltalama şablonlarını engellememize ve nihayetinde kritik bir hesap geçişi sırasında tüm PayPal ödemelerini durdurmamıza neden olan tam bir felakete dönüştü.</p>
<p class="lead mt-3">Bu, PayPal'ın temel geliştirici ihtiyaçlarını 11 yıl boyunca görmezden gelmesi ve bizlerin platformlarını çalıştırmak için her şeyi denememizin hikayesidir.</p>


## İçindekiler {#table-of-contents}

* [Eksik Parça: Abonelikleri Listelemenin Yolu Yok](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: Sorun Ortaya Çıkıyor](#2014-2017-the-problem-emerges)
* [2020: Onlara Kapsamlı Geri Bildirim Veriyoruz](#2020-we-give-them-extensive-feedback)
  * [27 Maddelik Geri Bildirim Listesi](#the-27-item-feedback-list)
  * [Ekipler Dahil Oldu, Sözler Verildi](#teams-got-involved-promises-were-made)
  * [Sonuç? Hiçbir Şey.](#the-result-nothing)
* [Yönetici Göçü: PayPal Tüm Kurumsal Hafızasını Nasıl Kaybetti](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Yeni Liderlik, Aynı Sorunlar](#2025-new-leadership-same-problems)
  * [Yeni CEO Dahil Oluyor](#the-new-ceo-gets-involved)
  * [Michelle Gill'in Yanıtı](#michelle-gills-response)
  * [Bizim Yanıtımız: Artık Toplantı Yok](#our-response-no-more-meetings)
  * [Marty Brodbeck'in Aşırı Mühendislik Yanıtı](#marty-brodbecks-overengineering-response)
  * [“Basit CRUD” Çelişkisi](#the-simple-crud-contradiction)
  * [Bağlantısızlık Açığa Çıkıyor](#the-disconnect-becomes-clear)
* [Yıllarca Görmezden Gelinen Hata Raporları](#years-of-bug-reports-they-ignored)
  * [2016: Erken UI/UX Şikayetleri](#2016-early-uiux-complaints)
  * [2021: İş E-postası Hata Raporu](#2021-business-email-bug-report)
  * [2021: UI İyileştirme Önerileri](#2021-ui-improvement-suggestions)
  * [2021: Sandbox Ortamı Hataları](#2021-sandbox-environment-failures)
  * [2021: Raporlama Sistemi Tamamen Bozuk](#2021-reports-system-completely-broken)
  * [2022: Temel API Özelliği Eksik (Yine)](#2022-core-api-feature-missing-again)
* [Geliştirici Deneyimi Kabusu](#the-developer-experience-nightmare)
  * [Bozuk Kullanıcı Arayüzü](#broken-user-interface)
  * [SDK Sorunları](#sdk-problems)
  * [İçerik Güvenlik Politikası İhlalleri](#content-security-policy-violations)
  * [Dokümantasyon Kaosu](#documentation-chaos)
  * [Güvenlik Açıkları](#security-vulnerabilities)
  * [Oturum Yönetimi Felaketi](#session-management-disaster)
* [Temmuz 2025: Son Damla](#july-2025-the-final-straw)
* [Neden PayPal'ı Bırakamıyoruz](#why-we-cant-just-drop-paypal)
* [Topluluk Çözümü](#the-community-workaround)
* [Oltalama Nedeniyle PayPal Şablonlarını Engellemek](#blocking-paypal-templates-due-to-phishing)
  * [Gerçek Sorun: PayPal Şablonları Dolandırıcılık Gibi Görünüyor](#the-real-problem-paypals-templates-look-like-scams)
  * [Bizim Uygulamamız](#our-implementation)
  * [Neden PayPal'ı Engellemek Zorunda Kaldık](#why-we-had-to-block-paypal)
  * [Sorunun Ölçeği](#the-scale-of-the-problem)
  * [İroni](#the-irony)
  * [Gerçek Dünya Etkisi: Yeni PayPal Dolandırıcılıkları](#real-world-impact-novel-paypal-scams)
* [PayPal'ın Tersine İşleyen KYC Süreci](#paypals-backwards-kyc-process)
  * [Nasıl Olmalı](#how-it-should-work)
  * [PayPal Gerçekte Nasıl Çalışıyor](#how-paypal-actually-works)
  * [Gerçek Dünya Etkisi](#the-real-world-impact)
  * [Temmuz 2025 Hesap Geçişi Felaketi](#the-july-2025-account-migration-disaster)
  * [Neden Önemli](#why-this-matters)
* [Diğer Tüm Ödeme İşleyicileri Nasıl Doğru Yapıyor](#how-every-other-payment-processor-does-it-right)
  * [Stripe](#stripe)
  * [Paddle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Square](#square)
  * [Sektör Standardı](#the-industry-standard)
  * [Diğer İşleyicilerin Sağladıkları vs PayPal](#what-other-processors-provide-vs-paypal)
* [PayPal'ın Sistematik Örtbası: 6 Milyon Sesi Susturmak](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [Büyük Silme](#the-great-erasure)
  * [Üçüncü Taraf Kurtarma](#the-third-party-rescue)
* [11 Yıllık Capture Hatası Felaketi: 1.899$ ve Artıyor](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Forward Email'in 1.899$ Kaybı](#forward-emails-1899-loss)
  * [2013 Orijinal Raporu: 11+ Yıl İhmal](#the-2013-original-report-11-years-of-negligence)
  * [2016 Kabulü: PayPal Kendi SDK'sını Bozuyor](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [2024 Tırmanışı: Hala Bozuk](#the-2024-escalation-still-broken)
  * [Webhook Güvenilirlik Felaketi](#the-webhook-reliability-disaster)
  * [Sistematik İhmal Deseni](#the-pattern-of-systematic-negligence)
  * [Belgesiz Gereklilik](#the-undocumented-requirement)
* [PayPal'ın Daha Geniş Aldatma Deseni](#paypals-broader-pattern-of-deception)
  * [New York Finansal Hizmetler Departmanı Eylemi](#the-new-york-department-of-financial-services-action)
  * [Honey Davası: Ortaklık Linklerini Yeniden Yazmak](#the-honey-lawsuit-rewriting-affiliate-links)
  * [PayPal'ın İhmalinin Maliyeti](#the-cost-of-paypals-negligence)
  * [Dokümantasyon Yalanı](#the-documentation-lie)
* [Bu Geliştiriciler İçin Ne Anlama Geliyor](#what-this-means-for-developers)
## Eksik Parça: Abonelikleri Listelemenin Hiçbir Yolu Yok {#the-missing-piece-no-way-to-list-subscriptions}

İşte bizi şaşırtan şey: PayPal 2014'ten beri abonelik faturalandırmasına sahip, ancak satıcıların kendi aboneliklerini listelemeleri için hiçbir yol sağlamadı.

Bir saniye düşünün. Abonelik oluşturabilirsiniz, ID'niz varsa iptal edebilirsiniz, ancak hesabınızdaki tüm aktif aboneliklerin listesini alamazsınız. Bu, SELECT ifadesi olmayan bir veritabanına sahip olmak gibi.

Buna temel iş operasyonları için ihtiyacımız var:

* Müşteri desteği (birisi aboneliği hakkında e-posta gönderdiğinde)
* Finansal raporlama ve mutabakat
* Otomatik faturalama yönetimi
* Uyumluluk ve denetim

Ama PayPal? Onlar sadece... hiç yapmadılar.


## 2014-2017: Sorun Ortaya Çıkıyor {#2014-2017-the-problem-emerges}

Abonelik listeleme sorunu ilk olarak 2017'de PayPal'ın topluluk forumlarında ortaya çıktı. Geliştiriciler bariz soruyu soruyordu: "Tüm aboneliklerimin listesini nasıl alabilirim?"

PayPal'ın cevabı? Sessizlik.

Topluluk üyeleri sinirlenmeye başladı:

> "Bir satıcının tüm aktif Anlaşmaları listeleyememesi çok garip bir eksiklik. Anlaşma ID'si kaybolursa, bu sadece kullanıcının bir anlaşmayı iptal edebileceği veya askıya alabileceği anlamına gelir." - leafspider

> "+1. Neredeyse 3 yıl oldu." - laudukang (sorunun yaklaşık 2014'ten beri var olduğunu belirtiyor)

2017'deki [orijinal topluluk gönderisi](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) geliştiricilerin bu temel işlevselliği yalvardığını gösteriyor. PayPal'ın cevabı, sorunun raporlandığı depoyu arşivlemek oldu.


## 2020: Onlara Kapsamlı Geri Bildirim Veriyoruz {#2020-we-give-them-extensive-feedback}

Ekim 2020'de PayPal, resmi bir geri bildirim oturumu için bize ulaştı. Bu sıradan bir sohbet değildi - Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze ve diğer 8 PayPal yöneticisinin katıldığı 45 dakikalık Microsoft Teams çağrısı düzenlediler.

### 27 Maddelik Geri Bildirim Listesi {#the-27-item-feedback-list}

Hazırlıklı geldik. API'leri entegre etmeye çalıştıktan sonra 6 saat içinde 27 spesifik sorun derlemiştik. PayPal Checkout ekibinden Mark Stuart şöyle dedi:

> Hey Nick, bugün herkesle paylaştığın için teşekkürler! Bence bu, ekibimizin bu sorunları gidermek için daha fazla destek ve yatırım almasının katalizörü olacak. Şimdiye kadar bıraktığın gibi zengin geri bildirim almak zor oldu.

Geri bildirim teorik değildi - gerçek entegrasyon denemelerinden geliyordu:

1. **Erişim belirteci oluşturma çalışmıyor**:

> Erişim belirteci oluşturma çalışmıyor. Ayrıca, sadece cURL örneklerinden daha fazlası olmalı.

2. **Abonelik oluşturmak için web UI yok**:

> cURL kullanmadan abonelikleri nasıl oluşturabilirsiniz? Bunu yapmak için bir web UI yok gibi görünüyor (Stripe'da olduğu gibi)

Mark Stuart erişim belirteci sorununu özellikle endişe verici buldu:

> Genellikle erişim belirteci oluşturma ile ilgili sorunlar duymuyoruz.

### Takımlar Dahil Oldu, Sözler Verildi {#teams-got-involved-promises-were-made}

Daha fazla sorun keşfettikçe, PayPal konuşmaya daha fazla ekip eklemeye devam etti. Abonelik yönetimi UI ekibinden Darshan Raju katıldı ve şöyle dedi:

> Açığı kabul ediyoruz. Bunu takip edip çözeceğiz. Geri bildiriminiz için tekrar teşekkürler!

Oturum şöyle tanımlandı:

> deneyiminizin samimi bir şekilde gözden geçirilmesi

ve

> PayPal'ı geliştiriciler için olması gereken hale getirmek.

### Sonuç? Hiçbir Şey. {#the-result-nothing}

Resmi geri bildirim oturumuna, kapsamlı 27 maddelik listeye, çoklu ekip katılımına ve

> takip edip çözme

sözlerine rağmen, hiçbir şey düzeltilmedi.


## Yönetici Göçü: PayPal Tüm Kurumsal Hafızasını Nasıl Kaybetti {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

İşte işin gerçekten ilginç kısmı. 2020 geri bildirimimizi alan herkes PayPal'dan ayrıldı:

**Liderlik Değişiklikleri:**

* [Dan Schulman (9 yıl CEO) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (Eylül 2023)
* [Sri Shivananda (geri bildirimi organize eden CTO) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (Ocak 2024)
**Söz Verip Sonra Ayrılan Teknik Liderler:**

* **Mark Stuart** (geri bildirimin "katalizör" olacağını vaat etti) → [Şimdi Ripple'da](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18 yıllık PayPal veterineri) → [MX CEO'su](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (Küresel Tüketici Ürünleri Başkan Yardımcısı) → [Emekli](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (kalan son isimlerden biri) → [Yeni Nasdaq'ta](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (Ocak 2025)

PayPal, yöneticilerin geliştirici geri bildirimlerini topladığı, sözler verdiği ve sonra JPMorgan, Ripple ve diğer fintech firmaları gibi daha iyi şirketlere geçtiği bir dönme kapısı haline geldi.

Bu, 2025 GitHub sorun yanıtının 2020 geri bildirimimizden tamamen kopuk görünmesinin nedenini açıklıyor - o geri bildirimi alan herkes PayPal'dan ayrıldı.


## 2025: Yeni Liderlik, Aynı Sorunlar {#2025-new-leadership-same-problems}

2025'e hızlıca ilerleyelim, ve tam aynı desen ortaya çıkıyor. Yıllarca ilerleme olmadıktan sonra, PayPal'ın yeni liderliği tekrar iletişime geçiyor.

### Yeni CEO İşin İçine Giriyor {#the-new-ceo-gets-involved}

30 Haziran 2025'te doğrudan PayPal'ın yeni CEO'su Alex Chriss'e ulaştık. Yanıtı kısaydı:

> Merhaba Nick – Ulaştığın ve geri bildirim için teşekkürler. Michelle (cc'de) ekibiyle birlikte bu konuda seninle ilgilenmek ve çözmek için görevde. Teşekkürler -A

### Michelle Gill'in Yanıtı {#michelle-gills-response}

Küçük İşletmeler ve Finansal Hizmetler EVP'si ve Genel Müdürü Michelle Gill şöyle yanıt verdi:

> Çok teşekkürler Nick, Alex'i bcc'ye alıyorum. Daha önceki gönderinden beri bunu inceliyoruz. Haftasonu bitmeden seni arayacağız. Lütfen iletişim bilgilerini gönder ki bir meslektaşım sana ulaşabilsin. Michelle

### Bizim Yanıtımız: Artık Toplantı Yok {#our-response-no-more-meetings}

Bir toplantıyı daha reddettik, hayal kırıklığımızı açıkladık:

> Teşekkürler. Ancak bir görüşme yapmanın bir işe yarayacağını düşünmüyorum. Sebebi şu... Daha önce bir görüşme yaptım ve tamamen boşunaydı. Tüm ekip ve liderlikle 2+ saatimi harcadım ve hiçbir şey yapılmadı... Tonlarca e-posta gidip geldi. Hiçbir şey yapılmadı. Geri bildirim hiçbir yere varmadı. Yıllarca denedim, dinlendim, sonra hiçbir yere varmadı.

### Marty Brodbeck'in Aşırı Mühendislik Yanıtı {#marty-brodbecks-overengineering-response}

Sonra PayPal'da tüketici mühendisliğine liderlik eden Marty Brodbeck ulaştı:

> Merhaba Nick, ben Marty Brodbeck. Burada PayPal'da tüm tüketici mühendisliğine liderlik ediyorum ve şirket için API geliştirmeyi yürütüyorum. Karşılaştığın sorun hakkında seninle bağlantı kurabilir miyiz ve nasıl yardımcı olabiliriz.

Basit bir abonelik listeleme uç noktası ihtiyacını açıkladığımızda, yanıtı tam sorunu ortaya koydu:

> Teşekkürler Nick, tam hata yönetimini destekleyen, olay tabanlı abonelik takibi ve sağlam çalışma süresi olan tam SDK ile tek bir abonelik API'si oluşturma sürecindeyiz; ayrıca faturalama, satıcıların tek bir yanıt almak için birden fazla uç noktayı koordine etmek zorunda kalmaması için ayrı bir API olarak ayrıldı.

Bu tam olarak yanlış yaklaşım. Aylar süren karmaşık mimariye ihtiyacımız yok. 2014'ten beri olması gereken, abonelikleri listeleyen basit bir REST uç noktasına ihtiyacımız var.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### "Basit CRUD" Çelişkisi {#the-simple-crud-contradiction}

Bunun 2014'ten beri olması gereken temel CRUD işlevselliği olduğunu belirttiğimizde, Marty'nin yanıtı anlamlıydı:

> Basit CRUD işlemleri temel API'nin bir parçasıdır dostum, bu yüzden aylarca geliştirme sürmez

Aylarca geliştirme sonrası şu anda sadece üç uç noktayı destekleyen PayPal TypeScript SDK'sı ve tarihsel zaman çizelgesi, bu tür projelerin tamamlanmasının birkaç aydan fazla sürdüğünü açıkça gösteriyor.
Bu yanıt, kendi API'sini anlamadığını gösteriyor. Eğer "basit CRUD işlemleri çekirdek API'nin bir parçasıysa," o zaman abonelik listeleme uç noktası nerede? Biz şöyle yanıt verdik:

> Eğer 'basit CRUD işlemleri çekirdek API'nin bir parçasıysa' o zaman abonelik listeleme uç noktası nerede? Geliştiriciler bu 'basit CRUD işlemi'ni 2014'ten beri istiyor. 11 yıl oldu. Diğer tüm ödeme işlemcileri bu temel işlevselliğe ilk günden beri sahip.

### Kopukluk Açıkça Ortaya Çıkıyor {#the-disconnect-becomes-clear}

2025'te Alex Chriss, Michelle Gill ve Marty Brodbeck ile yapılan görüşmeler aynı organizasyonel işlevsizlikleri gösteriyor:

1. **Yeni liderlik önceki geri bildirim oturumlarından habersiz**
2. **Aynı aşırı karmaşık çözümleri öneriyorlar**
3. **Kendi API sınırlamalarını anlamıyorlar**
4. **Sorunu düzeltmek yerine daha fazla toplantı istiyorlar**

Bu kalıp, 2025'te PayPal ekiplerinin 2020'de sağlanan kapsamlı geri bildirimlerden tamamen kopuk görünmesinin nedenini açıklıyor - o geri bildirimi alan kişiler gitmiş ve yeni liderlik aynı hataları tekrarlıyor.


## Yıllardır Görmezden Geldikleri Hata Raporları {#years-of-bug-reports-they-ignored}

Sadece eksik özelliklerden şikayet etmedik. Aktif olarak hata bildirdik ve iyileştirmelerine yardımcı olmaya çalıştık. İşte belgelenen sorunların kapsamlı bir zaman çizelgesi:

### 2016: Erken UI/UX Şikayetleri {#2016-early-uiux-complaints}

2016'da bile, PayPal liderliğine, Dan Schulman dahil, arayüz sorunları ve kullanılabilirlik problemleri hakkında kamuya açık şekilde ulaşıyorduk. Bu 9 yıl önceydi ve aynı UI/UX sorunları bugün de devam ediyor.

### 2021: İş E-postası Hata Raporu {#2021-business-email-bug-report}

Mart 2021'de, PayPal'ın iş e-posta sisteminin yanlış iptal bildirimleri gönderdiğini bildirdik. E-posta şablonundaki değişkenler yanlış render edilerek müşterilere kafa karıştırıcı mesajlar gösteriyordu.

Mark Stuart sorunu kabul etti:

> Teşekkürler Nick! BCC'ye geçiyoruz. @Prasy, ekibiniz bu e-postadan sorumlu mu ya da kimin olduğunu biliyor musunuz? "Niftylettuce, LLC, artık size fatura göndermeyeceğiz" ifadesi, kime gönderildiği ile e-posta içeriği arasında bir karışıklık olduğunu düşündürüyor.

**Sonuç**: Bunu gerçekten düzelttiler! Mark Stuart onayladı:

> Bildirim ekibinden e-posta şablonunun düzeltildiği ve yayına alındığını yeni duydum. Bildirdiğiniz için teşekkür ederim!

Bu, istediklerinde sorunları DÜZELTEBİLDİKLERİNİ gösteriyor - sadece çoğu sorun için bunu yapmamayı tercih ediyorlar.

### 2021: UI İyileştirme Önerileri {#2021-ui-improvement-suggestions}

Şubat 2021'de, kontrol paneli UI'ları hakkında detaylı geri bildirim verdik, özellikle "PayPal Son Faaliyetler" bölümü için:

> Bence paypal.com'daki kontrol paneli, özellikle "PayPal Son Faaliyetler" geliştirilmesi gerekiyor. $0 Tekrarlayan ödeme "Oluşturuldu" durum satırlarını göstermemelisiniz - bu sadece çok fazla gereksiz satır ekliyor ve günün/son birkaç günün ne kadar gelir getirdiğini kolayca göremezsiniz.

Mark Stuart bunu tüketici ürünleri ekibine iletti:

> Teşekkürler! Faaliyetlerden hangi ekibin sorumlu olduğunu bilmiyorum ama doğru ekibi bulmak için tüketici ürünleri başkanına ilettim. $0.00 tekrarlayan ödeme bir hata gibi görünüyor. Muhtemelen filtrelenmeli.

**Sonuç**: Hiç düzeltilmedi. UI hala bu işe yaramaz $0 girdilerini gösteriyor.

### 2021: Sandbox Ortamı Hataları {#2021-sandbox-environment-failures}

Kasım 2021'de, PayPal'ın sandbox ortamında kritik sorunları bildirdik:

* Sandbox gizli API anahtarları rastgele değiştirildi ve devre dışı bırakıldı
* Tüm sandbox test hesapları habersiz silindi
* Sandbox hesap detaylarını görüntülemeye çalışırken hata mesajları
* Aralıklı yükleme hataları

> Nedense sandbox gizli API anahtarım değiştirildi ve devre dışı bırakıldı. Ayrıca tüm eski Sandbox test hesaplarım silindi.

> Bazen yükleniyor bazen yüklenmiyor da. Bu inanılmaz sinir bozucu.

**Sonuç**: Yanıt yok, düzeltme yok. Geliştiriciler hala sandbox güvenilirlik sorunlarıyla karşılaşıyor.

### 2021: Raporlama Sistemi Tamamen Bozuk {#2021-reports-system-completely-broken}
Mayıs 2021'de, PayPal'ın işlem raporları için indirme sisteminin tamamen bozuk olduğunu bildirdik:

> Görünüşe göre rapor indirmeleri şu anda çalışmıyor ve tüm gün boyunca çalışmadı. Ayrıca başarısız olursa bir e-posta bildirimi alınmalı.

Ayrıca oturum yönetimi felaketine de dikkat çektik:

> Ayrıca PayPal'da oturum açtıktan sonra yaklaşık 5 dakika hareketsiz kalırsanız oturumunuz kapanıyor. Yani sonsuza kadar bekledikten sonra raporun durumunu kontrol etmek için yanındaki düğmeye tekrar tıkladığınızda, tekrar giriş yapmak zorunda kalmak can sıkıcı oluyor.

Mark Stuart oturum zaman aşımı sorununu kabul etti:

> Daha önce oturumunuzun sık sık sona erdiğini ve IDE'niz ile developer.paypal.com veya satıcı kontrol paneliniz arasında geçiş yaparken geliştirme akışınızı bozduğunu bildirdiğinizi hatırlıyorum, sonra geri döndüğünüzde tekrar oturumunuzun kapandığını görüyordunuz.

**Sonuç**: Oturum zaman aşımı hâlâ 60 saniye. Rapor sistemi hâlâ düzenli olarak başarısız oluyor.

### 2022: Temel API Özelliği Eksik (Yine) {#2022-core-api-feature-missing-again}

Ocak 2022'de, abonelik listeleme sorununu tekrar yükselttik, bu sefer belgelerinin yanlış olduğuna dair daha fazla detayla:

> Tüm abonelikleri listeleyen bir GET yok (önceden faturalama anlaşmaları olarak adlandırılıyordu)

Resmi belgelerinin tamamen yanlış olduğunu keşfettik:

> API dokümanları da tamamen yanlış. Abonelik ID'lerinin sabit kodlanmış bir listesini indirerek bir çözüm bulabileceğimizi düşündük. Ama bu bile çalışmıyor!

> Resmi belgelerde buradan... Böyle yapabileceğinizi söylüyor... İşin püf noktası - kontrol edilecek hiçbir "Abonelik ID" alanı yok.

PayPal'dan Christina Monti yanıt verdi:

> Bu yanlış adımların neden olduğu hayal kırıklıkları için özür dileriz, bu hafta düzelteceğiz.

Sri Shivananda (CTO) teşekkür etti:

> Bizi daha iyi yapmamıza devam ettiğiniz için teşekkürler. Çok takdir ediyoruz.

**Sonuç**: Belgeler hiç düzeltilmedi. Abonelik listeleme uç noktası hiç oluşturulmadı.


## Geliştirici Deneyimi Kabusu {#the-developer-experience-nightmare}

PayPal'ın API'ları ile çalışmak 10 yıl öncesine geri gitmek gibi. İşte belgelediğimiz teknik sorunlar:

### Bozuk Kullanıcı Arayüzü {#broken-user-interface}

PayPal geliştirici kontrol paneli bir felaket. Günlük olarak karşılaştıklarımız:

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  PayPal'ın kullanıcı arayüzü o kadar bozuk ki bildirimleri kapatamıyorsunuz bile
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
    Tarayıcınız video etiketini desteklemiyor.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Geliştirici kontrol paneli sizi bir kaydırıcı sürüklemeye zorluyor ve sonra 60 saniye sonra oturumunuzu kapatıyor
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
    Tarayıcınız video etiketini desteklemiyor.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  PayPal geliştirici arayüzündeki daha fazla kullanıcı arayüzü felaketi, bozuk iş akışlarını gösteriyor
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
    Tarayıcınız video etiketini desteklemiyor.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Abonelik yönetim arayüzü - arayüz o kadar kötü ki ürünler ve abonelik planları oluşturmak için koda güvenmek zorunda kaldık
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal abonelik ekran görüntüsü" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Eksik işlevselliğe sahip bozuk abonelik arayüzünün bir görünümü (ürünler/planlar/abonelikler kolayca oluşturulamıyor – ve oluşturulduktan sonra ürünleri veya planları arayüzden silmenin hiçbir yolu görünmüyor)
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal abonelik ekran görüntüsü 2" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Tipik PayPal hata mesajları - şifreli ve yardımcı olmayan
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API hata ekran görüntüsü" class="rounded-lg" />
</figure>

### SDK Sorunları {#sdk-problems}

* Karmaşık çözümler gerektiren, SDK'yı script etiketleriyle yeniden yüklerken butonları değiştirme ve yeniden render etme işlemleri olmadan hem tek seferlik ödemeleri hem de abonelikleri yönetemiyor
* JavaScript SDK temel kuralları ihlal ediyor (küçük harf sınıf isimleri, örnek kontrolü yok)
* Hata mesajları hangi alanların eksik olduğunu belirtmiyor
* Tutarsız veri tipleri (sayılar yerine string tutar gerektiriyor)

### İçerik Güvenlik Politikası İhlalleri {#content-security-policy-violations}

SDK'ları CSP'nizde unsafe-inline ve unsafe-eval gerektiriyor, **bu da sitenizin güvenliğini tehlikeye atmanıza neden oluyor**.

### Dokümantasyon Karmaşası {#documentation-chaos}

Mark Stuart bizzat itiraf etti:

> Miras ve yeni API'lerin aşırı miktarda olduğu konusunda hemfikiriz. Ne arayacağınızı bulmak gerçekten zor (burada çalışan bizler için bile).

### Güvenlik Açıkları {#security-vulnerabilities}

**PayPal'ın 2FA uygulaması ters çalışıyor**. TOTP uygulamaları etkin olsa bile SMS doğrulaması zorunlu kılınıyor - bu da hesapları SIM takas saldırılarına karşı savunmasız bırakıyor. TOTP etkinse, sadece onun kullanılması gerekir. Yedek seçenek SMS değil, e-posta olmalıdır.

### Oturum Yönetimi Felaketi {#session-management-disaster}

**Geliştirici paneli 60 saniye hareketsizlikten sonra sizi otomatik olarak çıkış yapıyor**. Verimli bir şey yapmaya çalıştığınızda sürekli olarak: giriş → captcha → 2FA → çıkış → tekrar yaşanıyor. VPN mi kullanıyorsunuz? İyi şanslar.

## Temmuz 2025: Son Damla {#july-2025-the-final-straw}

Aynı sorunların 11 yıl boyunca devam etmesinin ardından, kırılma noktası rutin bir hesap geçişi sırasında geldi. Muhasebeyi daha temiz yapmak için şirket adımız "Forward Email LLC" ile uyumlu yeni bir PayPal hesabına geçmemiz gerekiyordu.

Basit olması gereken şey tam bir felakete dönüştü:

* İlk testler her şeyin doğru çalıştığını gösterdi
* Saatler sonra PayPal, abonelik ödemelerinin tamamını önceden haber vermeden engelledi
* Müşteriler ödeme yapamadı, bu da karışıklık ve destek yükü yarattı
* PayPal destek ekibi hesapların doğrulandığını iddia ederek çelişkili yanıtlar verdi
* PayPal ödemelerini tamamen durdurmak zorunda kaldık

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Müşterilerin ödeme yapmaya çalışırken gördüğü hata - açıklama yok, kayıt yok, hiçbir şey yok
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal bir şeyler yanlış gitti hatası" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Ödemeler tamamen bozukken PayPal desteğinin her şeyin yolunda olduğunu iddia etmesi. Son mesajda "bazı özellikleri geri yüklediklerini" söylüyorlar ama hala daha fazla belirtilmemiş bilgi istiyorlar - klasik PayPal destek tiyatrosu
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="PayPal yardım merkezi ekran görüntüsü 1" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="PayPal yardım merkezi ekran görüntüsü 2" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="PayPal yardım merkezi ekran görüntüsü 3" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="PayPal yardım merkezi ekran görüntüsü 4" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="PayPal yardım merkezi ekran görüntüsü 5" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="PayPal yardım merkezi ekran görüntüsü 6" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Hiçbir şeyi "düzeltmediği" iddia edilen kimlik doğrulama süreci
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="PayPal dikkat ekran görüntüsü 1" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="PayPal dikkat ekran görüntüsü 2" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="PayPal dikkat ekran görüntüsü 3" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="PayPal dikkat ekran görüntüsü 4" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="PayPal dikkat ekran görüntüsü 5" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-6.png" alt="PayPal dikkat ekran görüntüsü 6" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-7.png" alt="PayPal dikkat ekran görüntüsü 7" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Belirsiz mesaj ve hâlâ çözüm yok. Ek bilgi olarak ne gerektiğine dair sıfır bilgi, bildirim veya herhangi bir şey. Müşteri desteği sessiz kalıyor.
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>


## Neden PayPal'ı Tamamen Bırakamıyoruz {#why-we-cant-just-drop-paypal}

Tüm bu sorunlara rağmen, bazı müşterilerin sadece PayPal ödeme seçeneği olduğu için PayPal'ı tamamen bırakamıyoruz. Bir müşterinin [durum sayfamızda](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515) söylediği gibi:

> PayPal benim tek ödeme seçeneğim

**PayPal belirli kullanıcılar için bir ödeme tekelini oluşturduğu için kırık bir platformu desteklemek zorundayız.**


## Topluluk Çözümü {#the-community-workaround}

PayPal temel abonelik listeleme işlevselliği sağlamadığı için geliştirici topluluğu çözümler geliştirdi. PayPal aboneliklerini yönetmeye yardımcı olan bir betik oluşturduk: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Bu betik, geliştiricilerin çözümler paylaştığı bir [topluluk gist'ine](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4) referans verir. Kullanıcılar aslında PayPal'ın yıllar önce yapması gereken şeyi sağladığımız için [bize teşekkür ediyorlar](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775).


## Phishing Nedeniyle PayPal Şablonlarını Engelleme {#blocking-paypal-templates-due-to-phishing}

Sorunlar API'lerin ötesine geçiyor. PayPal'ın e-posta şablonları o kadar kötü tasarlanmış ki, e-posta servisimizde onları phishing girişimlerinden ayırt edemediğimiz için özel filtreleme uygulamak zorunda kaldık.

### Gerçek Sorun: PayPal Şablonları Dolandırıcılık Gibi Görünüyor {#the-real-problem-paypals-templates-look-like-scams}

Düzenli olarak phishing girişimlerine çok benzeyen PayPal e-postaları hakkında raporlar alıyoruz. İşte kötüye kullanım raporlarımızdan gerçek bir örnek:

**Konu:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Bu e-posta, phishing girişimi gibi göründüğü için `abuse@microsoft.com` adresine iletildi. Sorun neydi? Aslında PayPal'ın sandbox ortamından geliyordu, ancak şablon tasarımları o kadar kötü ki phishing tespit sistemlerini tetikliyor.

### Bizim Uygulamamız {#our-implementation}

PayPal'a özgü filtrelememizi [e-posta filtreleme kodumuzda](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172) görebilirsiniz:

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

### Neden PayPal'ı Engellemek Zorunda Kaldık {#why-we-had-to-block-paypal}

Bunu, PayPal'ın kötüye kullanım ekiplerine defalarca rapor vermemize rağmen büyük spam/phishing/dolandırıcılık sorunlarını düzeltmeyi reddetmesi nedeniyle uyguladık. Engellediğimiz belirli e-posta türleri şunlardır:

* **RT000238** - Şüpheli fatura bildirimleri
* **PPC001017** - Sorunlu ödeme onayları
* **RT000542** - Hediye mesajı hack girişimleri

### Sorunun Ölçeği {#the-scale-of-the-problem}

Spam filtreleme kayıtlarımız, günlük işlediğimiz büyük hacimli PayPal fatura spamlerini gösteriyor. Engellenen konu başlıklarından bazı örnekler:

* "PayPal Faturalama Ekibinden Fatura:- Bu ücret hesabınızdan otomatik olarak tahsil edilecektir. Lütfen hemen \[PHONE] numarasından bizimle iletişime geçin"
* "\[COMPANY NAME] (\[ORDER-ID]) tarafından gönderilen fatura"
* Farklı telefon numaraları ve sahte sipariş kimlikleri ile çeşitli varyasyonlar
Bu e-postalar genellikle `outlook.com` sunucularından gelir ancak PayPal'ın meşru sistemlerinden kaynaklanıyormuş gibi görünür, bu da onları özellikle tehlikeli kılar. E-postalar, PayPal'ın gerçek altyapısı üzerinden gönderildiği için SPF, DKIM ve DMARC doğrulamasından geçer.

Teknik kayıtlarımız bu spam e-postaların meşru PayPal başlıkları içerdiğini gösteriyor:

* `X-Email-Type-Id: RT000238` (engellediğimiz aynı ID)
* `From: "service@paypal.com" <service@paypal.com>`
* `paypal.com`'dan geçerli DKIM imzaları
* PayPal'ın posta sunucularını gösteren uygun SPF kayıtları

Bu imkansız bir durum yaratıyor: meşru PayPal e-postaları ile spamlerin teknik özellikleri tamamen aynı.

### İroni {#the-irony}

Finansal dolandırıcılıkla mücadelede öncü olması gereken PayPal, o kadar kötü tasarlanmış e-posta şablonlarına sahip ki, bunlar anti-phishing sistemlerini tetikliyor. Dolandırıcılıktan ayırt edilemedikleri için meşru PayPal e-postalarını engellemek zorunda kalıyoruz.

Bu, güvenlik araştırmalarında belgelenmiştir: [PayPal yeni adres dolandırıcılığına dikkat](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - PayPal'ın kendi sistemlerinin dolandırıcılık için nasıl kullanıldığını gösteriyor.

### Gerçek Dünya Etkisi: Yeni PayPal Dolandırıcılıkları {#real-world-impact-novel-paypal-scams}

Sorun sadece kötü şablon tasarımıyla sınırlı değil. PayPal'ın fatura sistemi o kadar kolay suistimal ediliyor ki, dolandırıcılar düzenli olarak meşru görünen sahte faturalar gönderiyor. Güvenlik araştırmacısı Gavin Anderegg, dolandırıcıların tüm doğrulama kontrollerinden geçen gerçek PayPal faturaları gönderdiği [Yeni Bir PayPal Dolandırıcılığı](https://anderegg.ca/2023/02/01/a-novel-paypal-scam) adlı çalışmayı belgeledi:

> "Kaynağı incelediğimde, e-posta gerçekten PayPal'dan gelmiş gibiydi (SPF, DKIM ve DMARC hepsi geçti). Buton da meşru görünen bir PayPal URL'sine bağlıydı... Gerçek bir e-posta olduğunu anlamam biraz zaman aldı. Bana rastgele bir dolandırıcıdan 'fatura' gönderilmişti."

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Bir gelen kutusunu dolduran ve hepsi meşru görünen çok sayıda sahte PayPal faturası gösteren ekran görüntüsü, çünkü aslında PayPal sistemlerinden geliyorlar
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal dolandırıcılık uyarısı ekran görüntüsü" class="rounded-lg" />
</figure>

Araştırmacı şöyle belirtti:

> "Bu aynı zamanda PayPal'ın kilitlemeyi düşünmesi gereken bir kolaylık özelliği gibi görünüyor. Hemen bunun bir dolandırıcılık türü olduğunu varsaydım ve sadece teknik detaylarla ilgilendim. Gerçekten çok kolay yapılabiliyor ve başkalarının buna kanmasından endişe ediyorum."

Bu, sorunu mükemmel şekilde ortaya koyuyor: PayPal'ın kendi meşru sistemleri o kadar kötü tasarlanmış ki, dolandırıcılığa olanak sağlarken aynı zamanda meşru iletişimleri şüpheli gösteriyor.

Dahası, bu durum Yahoo ile teslimat oranlarımızı etkiledi, müşteri şikayetlerine ve saatler süren titiz testler ile desen kontrolüne yol açtı.


## PayPal'ın Tersine İşleyen KYC Süreci {#paypals-backwards-kyc-process}

PayPal platformunun en sinir bozucu yönlerinden biri, uyumluluk ve Müşterini Tanı (KYC) prosedürlerine ters yaklaşımıdır. Diğer tüm ödeme işlemcilerinin aksine, PayPal geliştiricilerin API'lerini entegre etmelerine ve uygun doğrulamayı tamamlamadan önce üretimde ödeme almaya başlamalarına izin verir.

### Nasıl Olmalı {#how-it-should-work}

Her meşru ödeme işlemcisi şu mantıksal sırayı izler:

1. **Önce KYC doğrulamasını tamamla**
2. **Satıcı hesabını onayla**
3. **Üretim API erişimi sağla**
4. **Ödeme toplamaya izin ver**

Bu, ödeme işlemcisini ve satıcıyı, para el değiştirmeden önce uyumluluğu sağlayarak korur.

### PayPal Gerçekte Nasıl Çalışıyor {#how-paypal-actually-works}

PayPal'ın süreci tamamen ters:

1. **Üretim API erişimini hemen sağla**
2. **Saatler veya günlerce ödeme toplamaya izin ver**
3. **Aniden bildirim yapmadan ödemeleri engelle**
4. **Müşteriler zaten etkilenmişken KYC belgeleri talep et**
5. **Satıcıya hiçbir bildirim verme**
6. **Sorunu müşterilerin keşfetmesine ve bildirmesine izin ver**
### Gerçek Dünya Etkisi {#the-real-world-impact}

Bu ters süreç işletmeler için felaketler yaratır:

* **Müşteriler yoğun satış dönemlerinde alışverişlerini tamamlayamaz**
* **Doğrulamanın gerektiğine dair önceden uyarı yok**
* **Ödemeler engellendiğinde e-posta bildirimi yok**
* **Tüccarlar sorunları kafası karışmış müşterilerden öğrenir**
* **Kritik iş dönemlerinde gelir kaybı**
* **Ödemeler gizemli bir şekilde başarısız olduğunda müşteri güveni zarar görür**

### Temmuz 2025 Hesap Taşıma Felaketi {#the-july-2025-account-migration-disaster}

Bu tam senaryo Temmuz 2025’te rutin hesap taşıma sırasında yaşandı. PayPal başlangıçta ödemelerin çalışmasına izin verdi, sonra aniden herhangi bir bildirim olmadan engelledi. Sorunu ancak müşteriler ödeme yapamadıklarını bildirmeye başlayınca fark ettik.

Destekle iletişime geçtiğimizde, hangi belgelerin gerektiği konusunda çelişkili yanıtlar aldık ve çözüm için net bir zaman çizelgesi verilmedi. Bu durum, PayPal ödemelerini tamamen durdurmak zorunda kalmamıza yol açtı ve başka ödeme seçeneği olmayan müşterileri şaşırttı.

### Neden Önemli {#why-this-matters}

PayPal’ın uyumluluk yaklaşımı, işletmelerin nasıl çalıştığını temelinden yanlış anladığını gösteriyor. Doğru KYC, müşteriler zaten ödeme yapmaya çalışmadan **önce** yapılmalıdır. Sorunlar ortaya çıktığında proaktif iletişim eksikliği, PayPal’ın tüccar ihtiyaçlarından kopuk olduğunu gösterir.

Bu ters süreç, PayPal’ın daha geniş organizasyonel sorunlarının bir belirtisidir: İç süreçlerini tüccar ve müşteri deneyiminin önüne koyarlar, bu da işletmeleri platformlarından uzaklaştıran operasyonel felaketlere yol açar.


## Diğer Tüm Ödeme İşleyicilerinin Doğru Yaptığı Şey {#how-every-other-payment-processor-does-it-right}

PayPal’ın uygulamayı reddettiği abonelik listeleme işlevi, sektörde on yılı aşkın süredir standarttır. Diğer ödeme işleyicilerinin bu temel gereksinimi nasıl karşıladığı şöyle:

### Stripe {#stripe}

Stripe, API’si lansmanından beri abonelik listelemeye sahiptir. Belgeleri, bir müşteri veya tüccar hesabı için tüm aboneliklerin nasıl alınacağını açıkça gösterir. Bu temel CRUD işlevselliği olarak kabul edilir.

### Paddle {#paddle}

Paddle, listeleme, filtreleme ve sayfalama dahil kapsamlı abonelik yönetimi API’leri sunar. Tüccarların yinelenen gelir akışlarını görmesi gerektiğini anlarlar.

### Coinbase Commerce {#coinbase-commerce}

Kripto para ödeme işleyicileri bile, PayPal’dan daha iyi abonelik yönetimi sağlar, örneğin Coinbase Commerce.

### Square {#square}

Square’in API’si, abonelik listelemeyi temel bir özellik olarak içerir, sonradan eklenen bir şey değil.

### Sektör Standardı {#the-industry-standard}

Her modern ödeme işleyici şunları sağlar:

* Tüm abonelikleri listele
* Duruma, tarihe, müşteriye göre filtrele
* Büyük veri setleri için sayfalama
* Abonelik değişiklikleri için webhook bildirimleri
* Çalışan örneklerle kapsamlı dokümantasyon

### Diğer İşleyicilerin Sağladıkları vs PayPal {#what-other-processors-provide-vs-paypal}

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

**PayPal - Gerçekte Aldığınız:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# Sadece ID’yi zaten biliyorsanız TEK bir abonelik alabilirsiniz
# Tüm abonelikleri listeleyen bir uç nokta YOK
# Arama veya filtreleme YOK
# Tüm abonelik ID’lerini kendiniz takip etmelisiniz
```

**PayPal’ın Mevcut Uç Noktaları:**

* `POST /v1/billing/subscriptions` - Abonelik oluştur
* `GET /v1/billing/subscriptions/{id}` - TEK abonelik al (ID’yi biliyorsan)
* `PATCH /v1/billing/subscriptions/{id}` - Aboneliği güncelle
* `POST /v1/billing/subscriptions/{id}/cancel` - Aboneliği iptal et
* `POST /v1/billing/subscriptions/{id}/suspend` - Aboneliği askıya al
**PayPal'da Eksik Olanlar:**

* ❌ Hiç `GET /v1/billing/subscriptions` (tümünü listele) yok
* ❌ Arama işlevi yok
* ❌ Duruma, müşteriye, tarihe göre filtreleme yok
* ❌ Sayfalama desteği yok

PayPal, geliştiricilerin abonelik kimliklerini kendi veritabanlarında manuel olarak takip etmeye zorlayan tek büyük ödeme işlemcisidir.


## PayPal'ın Sistematik Örtbası: 6 Milyon Sesi Susturmak {#paypals-systematic-cover-up-silencing-6-million-voices}

PayPal'ın eleştirilerle başa çıkma yaklaşımını mükemmel şekilde özetleyen bir hamlede, yakın zamanda tüm topluluk forumunu çevrimdışı aldı, böylece 6 milyondan fazla üyeyi etkili bir şekilde susturdu ve başarısızlıklarını belgeleyen yüzbinlerce gönderiyi sildi.

### Büyük Silme {#the-great-erasure}

Orijinal PayPal Topluluğu `paypal-community.com` adresinde **6.003.558 üye** barındırıyordu ve yüzbinlerce gönderi, hata raporu, şikayet ve PayPal'ın API hataları hakkında tartışmalar içeriyordu. Bu, PayPal'ın sistematik sorunlarının on yılı aşkın belgelenmiş kanıtını temsil ediyordu.

30 Haziran 2025'te PayPal sessizce tüm forumu çevrimdışı aldı. Tüm `paypal-community.com` bağlantıları artık 404 hatası veriyor. Bu bir taşıma veya yükseltme değildi.

### Üçüncü Taraf Kurtarma {#the-third-party-rescue}

Neyse ki, [ppl.lithium.com](https://ppl.lithium.com/) adresindeki üçüncü taraf bir hizmet, içeriğin bir kısmını korudu ve PayPal'ın gizlemeye çalıştığı tartışmalara erişmemizi sağladı. Ancak bu üçüncü taraf koruma eksik ve herhangi bir zamanda kaybolabilir.

Kanıtları gizleme modeli PayPal için yeni değil. Belgelenmiş geçmişleri şunları içeriyor:

* Kritik hata raporlarını kamuoyundan kaldırmak
* Geliştirici araçlarını önceden haber vermeden durdurmak
* API'leri uygun dokümantasyon olmadan değiştirmek
* Başarısızlıkları hakkında topluluk tartışmalarını susturmak

Forumun kapatılması, sistematik hatalarını kamu incelemesinden gizlemek için şimdiye kadarki en cüretkar girişimi temsil ediyor.


## 11 Yıllık Capture Hatası Felaketi: 1.899 Dolar ve Artıyor {#the-11-year-capture-bug-disaster-1899-and-counting}

PayPal geri bildirim oturumları düzenleyip vaatlerde bulunurken, temel ödeme işleme sistemi 11 yılı aşkın süredir temelden bozuk durumda. Kanıtlar yıkıcı.

### Forward Email'in 1.899 Dolarlık Kaybı {#forward-emails-1899-loss}

Üretim sistemlerimizde, PayPal'ın capture hataları nedeniyle kaybolan toplam **1.899 $** tutarında 108 PayPal ödemesi keşfettik. Bu ödemeler tutarlı bir desen gösteriyor:

* `CHECKOUT.ORDER.APPROVED` webhook'ları alındı
* PayPal'ın capture API'si 404 hatası döndürdü
* Siparişler PayPal API'si üzerinden erişilemez hale geldi

Müşterilerin ücretlendirilip ücretlendirilmediğini belirlemek imkansız çünkü PayPal 14 gün sonra hata ayıklama günlüklerini tamamen gizliyor ve yakalanmayan sipariş kimlikleri için tüm verileri kontrol panelinden siliyor.

Bu sadece bir işletmeyi temsil ediyor. **11 yılı aşkın sürede binlerce satıcı arasındaki toplu kayıplar muhtemelen milyonlarca dolar tutuyor.**

**Tekrar söyleyelim: 11 yılı aşkın sürede binlerce satıcı arasındaki toplu kayıplar muhtemelen milyonlarca dolar tutuyor.**

Bunu keşfetmemizin tek nedeni son derece titiz ve veri odaklı olmamızdır.

### 2013 Orijinal Raporu: 11+ Yıllık İhmal {#the-2013-original-report-11-years-of-negligence}

Bu tam sorunun en erken belgelenmiş raporu [Stack Overflow'da Kasım 2013'te](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([arşivlenmiş](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)) ortaya çıkıyor:

> "Capture yaparken Rest API ile sürekli 404 Hatası alıyorum"

2013'te bildirilen hata, Forward Email'in 2024'te yaşadığıyla **tam olarak aynı**:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "İstenen kaynak kimliği bulunamadı",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

2013'te topluluk yanıtı anlamlıydı:

> "Şu anda REST API ile ilgili bildirilen bir sorun var. PayPal üzerinde çalışıyor."
**11+ yıl sonra, hâlâ "üzerinde çalışıyorlar."**

### 2016 İtirafı: PayPal Kendi SDK'sını Bozuyor {#the-2016-admission-paypal-breaks-their-own-sdk}

2016 yılında, PayPal'ın kendi GitHub deposu resmi PHP SDK'sını etkileyen [büyük yakalama hatalarını](https://github.com/paypal/PayPal-PHP-SDK/issues/660) belgeledi. Ölçek şaşırtıcıydı:

> "20.09.2016'dan beri, tüm PayPal yakalama denemeleri 'INVALID_RESOURCE_ID - İstenen kaynak kimliği bulunamadı.' hatasıyla başarısız oluyor. 19.09 ile 20.09 arasında API entegrasyonunda hiçbir değişiklik yapılmadı. **20.09'dan beri yapılan yakalama denemelerinin %100'ü bu hatayı döndürüyor.**"

Bir satıcı şöyle bildirdi:

> "Son 24 saatte **1.400'den fazla başarısız yakalama denemem oldu**, hepsi INVALID_RESOURCE_ID hata yanıtı ile."

PayPal'ın ilk tepkisi satıcıyı suçlamak ve teknik destek yönlendirmek oldu. Ancak büyük baskı sonrası hatalarını kabul ettiler:

> "Ürün Geliştiricilerimizden bir güncelleme aldım. Gönderilen başlıklarda PayPal-Request-ID'nin 42 karakter olarak gönderildiğini fark ettiler, ancak **son zamanlarda bu ID'nin sadece 38 karakterle sınırlandırıldığı bir değişiklik olmuş gibi görünüyor.**"

Bu itiraf PayPal'ın sistematik ihmalkarlığını ortaya koyuyor:

1. **Belgesiz kırıcı değişiklikler yaptılar**
2. **Kendi resmi SDK'larını bozdukları**
3. **Önce satıcıları suçladılar**
4. **Sadece baskı altında hatalarını kabul ettiler**

Sorunu "düzelttikten" sonra bile satıcılar bildirdi:

> "SDK'yı v1.7.4'e yükselttim ve **sorun hâlâ devam ediyor.**"

### 2024 Tırmanışı: Hâlâ Bozuk {#the-2024-escalation-still-broken}

Korunan PayPal Topluluğu'ndan gelen son raporlar sorunun aslında daha da kötüleştiğini gösteriyor. [Eylül 2024 tartışması](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([arşivlenmiş](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) aynı sorunları belgeliyor:

> "Sorun yaklaşık 2 hafta önce ortaya çıkmaya başladı ve tüm siparişleri etkilemiyor. **En yaygın olanı yakalamada 404 hataları gibi görünüyor.**"

Satıcı, Forward Email'in yaşadığı aynı deseni anlatıyor:

> "Siparişi yakalamaya çalıştıktan sonra PayPal 404 döndürüyor. Sipariş Detaylarını alırken: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Bu, bizim tarafımızda başarılı bir yakalama izi olmadan gerçekleşiyor.**"

### Webhook Güvenilirlik Felaketi {#the-webhook-reliability-disaster}

Başka bir [korunan topluluk tartışması](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) PayPal'ın webhook sisteminin temelde güvenilmez olduğunu ortaya koyuyor:

> "Teorik olarak, Webhook etkinliğinden iki olay olmalı (CHECKOUT.ORDER.APPROVED ve PAYMENT.CAPTURE.COMPLETED). Aslında, **bu iki olay nadiren hemen alınır, PAYMENT.CAPTURE.COMPLETED çoğu zaman alınamaz veya birkaç saat içinde alınır.**"

Abonelik ödemeleri için:

> "**'PAYMENT.SALE.COMPLETED' bazen alınmaz veya birkaç saat içinde alınır.**"

Satıcının soruları PayPal'ın güvenilirlik sorunlarının derinliğini gösteriyor:

1. **"Neden bu oluyor?"** - PayPal'ın webhook sistemi temelde bozuk
2. **"Sipariş durumu 'COMPLETED' ise, parayı aldığımı varsayabilir miyim?"** - Satıcılar PayPal'ın API yanıtlarına güvenemiyor
3. **"'Event Logs->Webhook Events' neden hiçbir kayıt bulamıyor?"** - PayPal'ın kendi kayıt sistemi bile çalışmıyor

### Sistematik İhmalkarlık Deseni {#the-pattern-of-systematic-negligence}

Kanıtlar 11+ yıl boyunca uzanıyor ve açık bir deseni gösteriyor:

* **2013**: "PayPal üzerinde çalışıyor"
* **2016**: PayPal kırıcı değişikliği kabul ediyor, bozuk bir düzeltme sunuyor
* **2024**: Aynı hatalar hâlâ devam ediyor, Forward Email ve sayısız başkalarını etkiliyor

Bu bir hata değil - **bu sistematik ihmalkarlık.** PayPal, bu kritik ödeme işleme hatalarını on yıldan fazla süredir biliyor ve sürekli olarak:
1. **PayPal'ın hataları için satıcıları suçladı**
2. **Belgesiz kırıcı değişiklikler yaptı**
3. **Çalışmayan yetersiz düzeltmeler sağladı**
4. **İşletmeler üzerindeki finansal etkiyi görmezden geldi**
5. **Topluluk forumlarını kapatarak kanıtları gizledi**

### Belgesiz Gereklilik {#the-undocumented-requirement}

PayPal'ın resmi belgelerinde satıcıların capture işlemleri için yeniden deneme mantığını uygulaması gerektiği hiçbir yerde belirtilmemektedir. Belgelerinde satıcıların "onaydan hemen sonra capture yapması" gerektiği yazılıdır, ancak API'nin rastgele 404 hataları döndürdüğü ve karmaşık yeniden deneme mekanizmaları gerektirdiği belirtilmemiştir.

Bu durum her satıcıyı zorunlu kılar:

* Üssel geri çekilme (exponential backoff) yeniden deneme mantığını uygulamaya
* Tutarsız webhook teslimatını yönetmeye
* Karmaşık durum yönetim sistemleri kurmaya
* Başarısız capture işlemlerini manuel olarak izlemeye

**Diğer tüm ödeme işlemcileri ilk seferde çalışan güvenilir capture API'leri sağlar.**


## PayPal'ın Daha Geniş Aldatma Deseni {#paypals-broader-pattern-of-deception}

Capture hatası felaketi, PayPal'ın müşterileri aldatma ve hatalarını gizleme konusundaki sistematik yaklaşımının sadece bir örneğidir.

### New York Finansal Hizmetler Departmanı İşlemi {#the-new-york-department-of-financial-services-action}

Ocak 2025'te New York Finansal Hizmetler Departmanı, PayPal'a karşı [aldatıcı uygulamalar nedeniyle yaptırım işlemi başlattı](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf), bu da PayPal'ın aldatma deseninin API'lerinin çok ötesine uzandığını göstermektedir.

Bu düzenleyici işlem, PayPal'ın sadece geliştirici araçlarında değil, tüm işinde aldatıcı uygulamalara başvurmaya istekli olduğunu ortaya koymaktadır.

### Honey Davası: Ortaklık Linklerini Yeniden Yazma {#the-honey-lawsuit-rewriting-affiliate-links}

PayPal'ın Honey'yi satın alması, Honey'nin ortaklık linklerini yeniden yazdığına dair [davalara yol açtı](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), içerik üreticileri ve influencerlardan komisyon çalındığı iddia ediliyor. Bu, PayPal'ın başkalarına gitmesi gereken geliri yönlendirerek kar ettiği başka bir sistematik aldatma biçimidir.

Desen açıktır:

1. **API hataları**: Bozuk işlevselliği gizle, satıcıları suçla
2. **Topluluğu susturma**: Sorunların kanıtlarını kaldır
3. **Düzenleyici ihlaller**: Aldatıcı uygulamalara başvur
4. **Ortaklık hırsızlığı**: Teknik manipülasyonla komisyonları çal

### PayPal'ın İhmalkarlığının Maliyeti {#the-cost-of-paypals-negligence}

Forward Email'in 1.899$ kaybı sadece buzdağının görünen kısmıdır. Daha geniş etkiyi düşünün:

* **Bireysel satıcılar**: Binlercesi yüzlerce ila binlerce dolar kaybediyor
* **Kurumsal müşteriler**: Potansiyel olarak milyonlarca dolar gelir kaybı
* **Geliştirici zamanı**: PayPal'ın bozuk API'leri için sayısız saatlik geçici çözümler geliştirme
* **Müşteri güveni**: PayPal'ın ödeme hataları nedeniyle müşterilerini kaybeden işletmeler

Küçük bir e-posta hizmeti neredeyse 2.000$ kaybettiyse ve bu sorun 11+ yıldır binlerce satıcıyı etkiliyorsa, toplu finansal zarar muhtemelen **yüz milyonlarca dolar** tutarındadır.

### Belgeleme Yalanı {#the-documentation-lie}

PayPal'ın resmi belgeleri, satıcıların karşılaşacağı kritik sınırlamalar ve hataları sürekli olarak belirtmez. Örneğin:

* **Capture API**: 404 hatalarının yaygın olduğu ve yeniden deneme mantığı gerektirdiği belirtilmez
* **Webhook güvenilirliği**: Webhook'ların saatlerce gecikebileceği belirtilmez
* **Abonelik listeleme**: Belgeleme, listelemenin mümkün olduğunu ima ederken hiçbir uç nokta yoktur
* **Oturum zaman aşımı**: Agresif 60 saniyelik zaman aşımı belirtilmez

Bu kritik bilgilerin sistematik olarak atlanması, satıcıların PayPal'ın sınırlamalarını üretim sistemlerinde deneme yanılma yoluyla keşfetmesine ve çoğunlukla finansal kayıplara yol açmasına neden olur.


## Geliştiriciler İçin Anlamı {#what-this-means-for-developers}

PayPal'ın temel geliştirici ihtiyaçlarını ele almaktaki sistematik başarısızlığı ve kapsamlı geri bildirim toplaması, temel bir organizasyonel sorunu gösterir. Geri bildirim toplamayı sorunları gerçekten çözmenin yerine koymaktadırlar.
Desen açık:

1. Geliştiriciler sorunları bildirir
2. PayPal, yöneticilerle geri bildirim oturumları düzenler
3. Kapsamlı geri bildirim sağlanır
4. Takımlar eksiklikleri kabul eder ve "takip edip çözeceklerine" söz verir
5. Hiçbir şey uygulanmaz
6. Yöneticiler daha iyi şirketlere gider
7. Yeni takımlar aynı geri bildirimi ister
8. Döngü tekrar eder

Bu arada, geliştiriciler ödeme kabul etmek için geçici çözümler üretmek, güvenlikten ödün vermek ve bozuk kullanıcı arayüzleriyle uğraşmak zorunda kalır.

Eğer bir ödeme sistemi kuruyorsanız, deneyimimizden öğrenin: birden fazla işlemci ile [üçlü yaklaşımınızı](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) oluşturun, ancak PayPal'ın ihtiyacınız olan temel işlevselliği sağlamasını beklemeyin. Baştan itibaren geçici çözümler geliştirmeyi planlayın.

> Bu yazı, Forward Email'deki 11 yıllık PayPal API deneyimimizi belgelemektedir. Tüm kod örnekleri ve bağlantılar gerçek üretim sistemlerimizden alınmıştır. Bazı müşterilerin başka seçeneği olmadığı için bu sorunlara rağmen PayPal ödemelerini desteklemeye devam ediyoruz.

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API felaketi illüstrasyonu" class="rounded-lg" />
