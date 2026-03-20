# Veri İşleme Sözleşmesi {#data-processing-agreement}

<!-- v1.0 from <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email veri işleme sözleşmesi" class="rounded-lg" />


## İçindekiler {#table-of-contents}

* [Anahtar Terimler](#key-terms)
* [Sözleşmedeki Değişiklikler](#changes-to-the-agreement)
* [1. İşleyen ve Alt İşleyen İlişkileri](#1-processor-and-subprocessor-relationships)
  * [1. Sağlayıcı olarak İşleyen](#1-provider-as-processor)
  * [2. Sağlayıcı olarak Alt İşleyen](#2-provider-as-subprocessor)
* [2. İşleme](#2-processing)
  * [1. İşleme Detayları](#1-processing-details)
  * [2. İşleme Talimatları](#2-processing-instructions)
  * [3. Sağlayıcı Tarafından İşleme](#3-processing-by-provider)
  * [4. Müşteri İşlemesi](#4-customer-processing)
  * [5. İşlemeye Onay](#5-consent-to-processing)
  * [6. Alt İşleyenler](#6-subprocessors)
* [3. Kısıtlı Aktarımlar](#3-restricted-transfers)
  * [1. Yetkilendirme](#1-authorization)
  * [2. EEA Dışına Aktarımlar](#2-ex-eea-transfers)
  * [3. Birleşik Krallık Dışına Aktarımlar](#3-ex-uk-transfers)
  * [4. Diğer Uluslararası Aktarımlar](#4-other-international-transfers)
* [4. Güvenlik Olayı Müdahalesi](#4-security-incident-response)
* [5. Denetim ve Raporlar](#5-audit--reports)
  * [1. Denetim Hakları](#1-audit-rights)
  * [2. Güvenlik Raporları](#2-security-reports)
  * [3. Güvenlik Durum Tespiti](#3-security-due-diligence)
* [6. Koordinasyon ve İşbirliği](#6-coordination--cooperation)
  * [1. Sorgulara Yanıt](#1-response-to-inquiries)
  * [2. DPIA ve DTIA'lar](#2-dpias-and-dtias)
* [7. Müşteri Kişisel Verilerinin Silinmesi](#7-deletion-of-customer-personal-data)
  * [1. Müşteri Tarafından Silme](#1-deletion-by-customer)
  * [2. DPA Süresi Dolduğunda Silme](#2-deletion-at-dpa-expiration)
* [8. Sorumluluğun Sınırlandırılması](#8-limitation-of-liability)
  * [1. Sorumluluk Limitleri ve Tazminat Feragatı](#1-liability-caps-and-damages-waiver)
  * [2. İlgili Taraf Talepleri](#2-related-party-claims)
  * [3. İstisnalar](#3-exceptions)
* [9. Belgeler Arasındaki Çelişkiler](#9-conflicts-between-documents)
* [10. Sözleşme Süresi](#10-term-of-agreement)
* [11. Geçerli Hukuk ve Seçilen Mahkemeler](#11-governing-law-and-chosen-courts)
* [12. Hizmet Sağlayıcı İlişkisi](#12-service-provider-relationship)
* [13. Tanımlar](#13-definitions)
* [Katkılar](#credits)


## Anahtar Terimler {#key-terms}

| Terim                                      | Değer                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Sözleşme</strong>                   | Bu DPA, [Hizmet Şartları](/terms) ile tamamlayıcıdır                                                                                                                                                                                                                                                                                                                                                                                                                             |
| <strong>Onaylanmış Alt İşleyenler</strong> | [Cloudflare](https://cloudflare.com) (ABD; DNS, ağ ve güvenlik sağlayıcısı), [DataPacket](https://www.datapacket.com/) (ABD/İngiltere; barındırma sağlayıcısı), [Digital Ocean](https://digitalocean.com) (ABD; barındırma sağlayıcısı), [GitHub](https://github.com) (ABD; kaynak kod barındırma, CI/CD ve proje yönetimi), [Vultr](https://www.vultr.com) (ABD; barındırma sağlayıcısı), [Stripe](https://stripe.com) (ABD; ödeme işlemcisi), [PayPal](https://paypal.com) (ABD; ödeme işlemcisi) |
| <strong>Sağlayıcı Güvenlik İletişim</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a>                                                                                                                                                                                                                                                                                                                                                                                                       |
| <strong>Güvenlik Politikası</strong>       | [GitHub'daki Güvenlik Politikamızı görüntüleyin](https://github.com/forwardemail/forwardemail.net/security/policy)                                                                                                                                                                                                                                                                                                                                                              |
| <strong>Geçerli Devlet</strong>             | Delaware Eyaleti, Amerika Birleşik Devletleri                                                                                                                                                                                                                                                                                                                                                                                                                                    |
## Sözleşmedeki Değişiklikler {#changes-to-the-agreement}

Bu belge, [Common Paper DPA Standart Şartları (Sürüm 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) türevidir ve aşağıdaki değişiklikler yapılmıştır:

1. [Geçerli Hukuk ve Seçilen Mahkemeler](#11-governing-law-and-chosen-courts) aşağıda bir bölüm olarak dahil edilmiştir ve yukarıda `Geçerli Devlet` belirtilmiştir.
2. [Hizmet Sağlayıcı İlişkisi](#12-service-provider-relationship) aşağıda bir bölüm olarak dahil edilmiştir.


## 1. İşleyen ve Alt İşleyen İlişkileri {#1-processor-and-subprocessor-relationships}

### 1. Sağlayıcı İşleyen Olarak {#1-provider-as-processor}

<strong>Müşteri</strong>, Müşteri Kişisel Verilerinin Kontrolörü olduğu durumlarda, <strong>Sağlayıcı</strong>, <strong>Müşteri</strong> adına Kişisel Verileri İşleyen bir İşleyen olarak kabul edilecektir.

### 2. Sağlayıcı Alt İşleyen Olarak {#2-provider-as-subprocessor}

<strong>Müşteri</strong>, Müşteri Kişisel Verilerinin İşleyeni olduğu durumlarda, <strong>Sağlayıcı</strong>, Müşteri Kişisel Verilerinin bir Alt İşleyeni olarak kabul edilecektir.


## 2. İşleme {#2-processing}

### 1. İşleme Detayları {#1-processing-details}

Kapak Sayfasındaki Ek I(B), bu İşlemenin konusu, niteliği, amacı ve süresi ile toplanan <strong>Kişisel Veri Kategorileri</strong> ve <strong>Veri Sahibi Kategorileri</strong>ni açıklar.

### 2. İşleme Talimatları {#2-processing-instructions}

<strong>Müşteri</strong>, <strong>Sağlayıcı</strong>'ya Müşteri Kişisel Verilerini İşlemesi için şu talimatları verir: (a) Hizmeti sağlamak ve sürdürmek; (b) <strong>Müşteri</strong>'nin Hizmeti kullanımıyla daha fazla belirtilebilecek şekilde; (c) <strong>Sözleşme</strong>'de belgelenen şekilde; ve (d) <strong>Müşteri</strong> tarafından verilen ve <strong>Sağlayıcı</strong> tarafından kabul edilen, bu DPA kapsamında Müşteri Kişisel Verilerinin İşlenmesine ilişkin diğer yazılı talimatlarda belirtilen şekilde. <strong>Sağlayıcı</strong>, geçerli yasalarca yasaklanmadığı sürece bu talimatlara uyacaktır. <strong>Sağlayıcı</strong>, İşleme talimatlarını takip edememesi durumunda derhal <strong>Müşteri</strong>'yi bilgilendirecektir. <strong>Müşteri</strong>, geçerli yasalara uygun talimatlar vermiş ve vermeye devam edecektir.

### 3. Sağlayıcı Tarafından İşleme {#3-processing-by-provider}

<strong>Sağlayıcı</strong>, Müşteri Kişisel Verilerini yalnızca bu DPA ve Kapak Sayfasındaki detaylara uygun olarak işleyecektir. <strong>Sağlayıcı</strong>, Hizmeti mevcut ürünleri, özellikleri veya işlevselliği güncellemek veya yeni ürünler, özellikler veya işlevsellik eklemek için güncellerse, <strong>Veri Sahibi Kategorileri</strong>, <strong>Kişisel Veri Kategorileri</strong>, <strong>Özel Kategori Verileri</strong>, <strong>Özel Kategori Veri Kısıtlamaları veya Güvenceleri</strong>, <strong>Aktarım Sıklığı</strong>, <strong>İşlemenin Niteliği ve Amacı</strong> ve <strong>İşlemenin Süresi</strong> gibi bilgileri, güncellemeleri yansıtacak şekilde değiştirebilir ve bu güncellemeler hakkında <strong>Müşteri</strong>'yi bilgilendirir.

### 4. Müşteri İşlemesi {#4-customer-processing}

<strong>Müşteri</strong>, bir İşleyen ve <strong>Sağlayıcı</strong> bir Alt İşleyen olduğunda, <strong>Müşteri</strong>, Müşteri Kişisel Verilerinin İşlenmesine ilişkin tüm geçerli yasalara uyacaktır. <strong>Müşteri</strong>'nin Kontrolörü ile yaptığı anlaşma da benzer şekilde, <strong>Müşteri</strong>'nin bir İşleyen olarak tabi olduğu tüm geçerli yasalara uymasını gerektirecektir. Ayrıca, <strong>Müşteri</strong>, Kontrolörü ile yaptığı anlaşmadaki Alt İşleyen gereksinimlerine uyacaktır.

### 5. İşlemeye Onay {#5-consent-to-processing}

<strong>Müşteri</strong>, <strong>Sağlayıcı</strong>'ya ve/veya Hizmete Müşteri Kişisel Verilerini sağlamasıyla ilgili olarak tüm Geçerli Veri Koruma Yasalarına uymuş ve uymaya devam edecektir; bu, tüm açıklamaların yapılması, tüm onayların alınması, yeterli tercih sunulması ve Geçerli Veri Koruma Yasaları kapsamında gerekli olan ilgili güvencelerin uygulanmasını içerir.
### 6. Alt İşlemciler {#6-subprocessors}

a. <strong>Sağlayıcı</strong>, <strong>Müşteri</strong> Alt İşlemciyi onaylamadıkça, herhangi bir Müşteri Kişisel Verisini bir Alt İşlemciye sağlamayacak, aktarmayacak veya teslim etmeyecektir. Mevcut <strong>Onaylanmış Alt İşlemciler</strong> listesi, Alt İşlemcilerin kimliklerini, bulundukları ülkeyi ve beklenen İşleme görevlerini içermektedir. <strong>Sağlayıcı</strong>, herhangi bir Alt İşlemci eklenmesi veya değiştirilmesi yoluyla <strong>Onaylanmış Alt İşlemciler</strong>de yapılacak değişiklikleri en az 10 iş günü önceden yazılı olarak <strong>Müşteri</strong>'ye bildirecek, böylece <strong>Müşteri</strong>'ye yeni Alt İşlemci(ler)i kullanmaya başlamadan önce değişikliklere itiraz etme imkanı tanınacaktır. <strong>Sağlayıcı</strong>, <strong>Müşteri</strong>'nin <strong>Onaylanmış Alt İşlemciler</strong>deki değişikliğe itiraz hakkını kullanabilmesi için gerekli bilgileri sağlayacaktır. <strong>Müşteri</strong>, <strong>Onaylanmış Alt İşlemciler</strong>deki değişiklik bildiriminden sonra 30 gün içinde itirazda bulunmazsa, değişiklikleri kabul etmiş sayılır. <strong>Müşteri</strong>, bildirimden sonraki 30 gün içinde değişikliğe itiraz ederse, <strong>Müşteri</strong> ve <strong>Sağlayıcı</strong>, <strong>Müşteri</strong>'nin itirazını veya endişesini çözmek için iyi niyetle iş birliği yapacaktır.

b. Bir Alt İşlemci ile çalışırken, <strong>Sağlayıcı</strong>, Alt İşlemcinin yalnızca (i) kendisine devredilen yükümlülükleri yerine getirmek için gerekli ölçüde ve (ii) <strong>Sözleşme</strong> şartlarıyla tutarlı olarak Müşteri Kişisel Verilerine erişmesini ve kullanmasını sağlayan yazılı bir anlaşmaya sahip olacaktır.

c. GDPR, Müşteri Kişisel Verilerinin İşlenmesine uygulanıyorsa, (i) bu DPA’da tanımlanan veri koruma yükümlülükleri (varsa GDPR Madde 28(3)’te belirtilenler) Alt İşlemciye de uygulanır ve (ii) <strong>Sağlayıcı</strong>'nın Alt İşlemci ile yaptığı anlaşma bu yükümlülükleri içerecek, ayrıca <strong>Sağlayıcı</strong> ile Alt İşlemcinin Müşteri Kişisel Verilerinin İşlenmesine ilişkin taleplere veya sorulara nasıl yanıt vereceğine dair koordinasyon detaylarını kapsayacaktır. Ayrıca, <strong>Sağlayıcı</strong>, <strong>Müşteri</strong>'nin talebi üzerine, Alt İşlemcileri ile yaptığı anlaşmaların (herhangi bir değişiklik dahil) bir kopyasını paylaşacaktır. İş sırlarını veya diğer gizli bilgileri, kişisel veriler dahil, korumak için gerekli olduğu ölçüde, <strong>Sağlayıcı</strong>, Alt İşlemci ile yaptığı anlaşmanın metnini paylaşmadan önce sansürleyebilir.

d. <strong>Sağlayıcı</strong>, Alt İşlemcilerine devrettiği tüm yükümlülüklerden, Alt İşlemcilerin Müşteri Kişisel Verilerini İşleme konusundaki eylem ve ihmallerinden tamamen sorumludur. <strong>Sağlayıcı</strong>, Alt İşlemcilerinin Müşteri Kişisel Verileri ile ilgili maddi bir yükümlülüğü yerine getirmemesi durumunda <strong>Müşteri</strong>'yi bilgilendirecektir.


## 3. Kısıtlı Aktarımlar {#3-restricted-transfers}

### 1. Yetkilendirme {#1-authorization}

<strong>Müşteri</strong>, <strong>Sağlayıcı</strong>'nın Hizmeti sağlamak için gerekli olduğu ölçüde Müşteri Kişisel Verilerini AEA, Birleşik Krallık veya diğer ilgili coğrafi bölge dışına aktarabileceğini kabul eder. <strong>Sağlayıcı</strong>, Müşteri Kişisel Verilerini Avrupa Komisyonu veya diğer ilgili denetleyici otorite tarafından yeterlilik kararı verilmemiş bir bölgeye aktarırsa, geçerli Veri Koruma Yasalarına uygun olarak bu bölgeye yapılacak aktarım için uygun güvenceleri uygulayacaktır.

### 2. AEA Dışı Aktarımlar {#2-ex-eea-transfers}

<strong>Müşteri</strong> ve <strong>Sağlayıcı</strong>, GDPR’nin Müşteri Kişisel Verilerinin aktarımını koruduğu durumlarda, aktarımın AEA içinden <strong>Müşteri</strong>'den AEA dışındaki <strong>Sağlayıcı</strong>'ya yapılması ve aktarımın Avrupa Komisyonu tarafından verilen bir yeterlilik kararı ile düzenlenmemesi halinde, bu DPA’yı imzalayarak <strong>Müşteri</strong> ve <strong>Sağlayıcı</strong>'nın EEA SCC’leri ve Eklerini imzalamış sayılacaklarını kabul ederler; bu belgeler atıf yoluyla dahil edilmiştir. Bu tür herhangi bir aktarım, aşağıdaki şekilde tamamlanan EEA SCC’lere uygun olarak yapılır:
a. EEA SCC'lerinin Modül İki (Kontrolörden İşleyiciye) bölümü, <strong>Müşteri</strong>'nin Kontrolör ve <strong>Sağlayıcı</strong>'nın <strong>Müşteri</strong> adına İşleyici olarak Müşteri Kişisel Verilerini İşlediği durumlarda uygulanır.

b. EEA SCC'lerinin Modül Üç (İşleyiciden Alt İşleyiciye) bölümü, <strong>Müşteri</strong>'nin İşleyici ve <strong>Sağlayıcı</strong>'nın <strong>Müşteri</strong> adına Alt İşleyici olarak Müşteri Kişisel Verilerini İşlediği durumlarda uygulanır.

c. Her modül için, aşağıdakiler geçerlidir (uygulanabilir olduğunda):

1. Madde 7'deki isteğe bağlı bağlama maddesi uygulanmaz;

2. Madde 9'da, Seçenek 2 (genel yazılı yetkilendirme) uygulanır ve Alt İşleyici değişiklikleri için önceden bildirim süresi en az 10 iş günüdür;

3. Madde 11'de, isteğe bağlı dil uygulanmaz;

4. Madde 13'teki tüm köşeli parantezler kaldırılır;

5. Madde 17'de (Seçenek 1), EEA SCC'leri <strong>Yönetici Üye Devlet</strong> yasalarına tabi olacaktır;

6. Madde 18(b)'de, uyuşmazlıklar <strong>Yönetici Üye Devlet</strong> mahkemelerinde çözülecektir; ve

7. Bu DPA'nın Kapak Sayfası, EEA SCC'lerinin Ek I, Ek II ve Ek III'ünde gereken bilgileri içerir.

### 3. İngiltere Dışı Transferler {#3-ex-uk-transfers}

<strong>Müşteri</strong> ve <strong>Sağlayıcı</strong>, eğer İngiltere GDPR'si Müşteri Kişisel Verilerinin transferini koruyorsa, transferin <strong>Müşteri</strong>'den Birleşik Krallık içinden <strong>Sağlayıcı</strong>'ya Birleşik Krallık dışına yapıldığını ve transferin Birleşik Krallık Devlet Sekreteri tarafından verilen bir yeterlilik kararıyla yönetilmediğini kabul ederler; bu durumda bu DPA'yı imzalayarak, <strong>Müşteri</strong> ve <strong>Sağlayıcı</strong> UK Ek Sözleşmesini ve eklerini imzalamış sayılırlar ve bunlar referansla dahil edilmiştir. Böyle bir transfer, aşağıdaki şekilde tamamlanan UK Ek Sözleşmesi uyarınca yapılır:

a. Bu DPA'nın Bölüm 3.2'si, UK Ek Sözleşmesi Tablo 2'de gereken bilgileri içerir.

b. UK Ek Sözleşmesi Tablo 4 aşağıdaki şekilde değiştirilmiştir: Hiçbir taraf, UK Ek Sözleşmesini UK Ek Sözleşmesi'nin Bölüm 19'unda belirtildiği şekilde sona erdiremez; ICO, UK Ek Sözleşmesi'nin Bölüm ‎18'i uyarınca revize edilmiş Onaylı Ek Sözleşme yayınlarsa, taraflar bu DPA'yı buna uygun olarak iyi niyetle revize etmek için çalışacaktır.

c. Kapak Sayfası, UK Ek Sözleşmesi'nin Ek 1A, Ek 1B, Ek II ve Ek III'ünde gereken bilgileri içerir.

### 4. Diğer Uluslararası Transferler {#4-other-international-transfers}

Uluslararası transferin doğası gereği İsviçre yasalarının (ve herhangi bir EEA üye devleti veya Birleşik Krallık yasalarının değil) uygulandığı Kişisel Veriler için, EEA SCC'lerinin Madde 4'ündeki GDPR referansları, yasal olarak gerekli olduğu ölçüde, İsviçre Federal Veri Koruma Yasası veya halefi olarak değiştirilir ve denetleyici otorite kavramı İsviçre Federal Veri Koruma ve Bilgi Komiserliği'ni de kapsar.

## 4. Güvenlik Olayı Müdahalesi {#4-security-incident-response}

1. Herhangi bir Güvenlik Olayından haberdar olur olmaz, <strong>Sağlayıcı</strong>: (a) mümkün olan en kısa sürede, ancak Güvenlik Olayından haberdar olduktan sonra en geç 72 saat içinde <strong>Müşteri</strong>'yi gecikmeksizin bilgilendirecektir; (b) Güvenlik Olayı hakkında <strong>Müşteri</strong> tarafından makul şekilde talep edildiği veya bilindiği ölçüde zamanında bilgi sağlayacaktır; ve (c) Güvenlik Olayını sınırlamak ve araştırmak için makul adımları derhal atacaktır. Bu DPA uyarınca <strong>Sağlayıcı</strong>'nın bir Güvenlik Olayı hakkında bildirimde bulunması veya müdahalesi, <strong>Sağlayıcı</strong>'nın Güvenlik Olayı ile ilgili herhangi bir kusur veya sorumluluğu kabul ettiği anlamına gelmez.

## 5. Denetim ve Raporlar {#5-audit--reports}

### 1. Denetim Hakları {#1-audit-rights}

<strong>Sağlayıcı</strong>, bu DPA'ya uyumunu göstermek için makul şekilde gerekli tüm bilgileri <strong>Müşteri</strong>'ye sağlayacak ve <strong>Sağlayıcı</strong>'nın bu DPA'ya uyumunu değerlendirmek için <strong>Müşteri</strong> tarafından yapılacak denetimler, incelemeler dahil olmak üzere denetimlere izin verecek ve katkıda bulunacaktır. Ancak, <strong>Sağlayıcı</strong>, <strong>Müşteri</strong>'nin bilgiye erişiminin <strong>Sağlayıcı</strong>'nın fikri mülkiyet haklarına, gizlilik yükümlülüklerine veya Geçerli Yasalar kapsamındaki diğer yükümlülüklerine olumsuz etkisi olması durumunda veri veya bilgiye erişimi kısıtlayabilir. <strong>Müşteri</strong>, bu DPA kapsamındaki denetim haklarını ve Geçerli Veri Koruma Yasaları tarafından verilen denetim haklarını yalnızca <strong>Sağlayıcı</strong>'ya aşağıdaki raporlama ve özen yükümlülüklerine uyma talimatı vererek kullanacağını kabul ve beyan eder. <strong>Sağlayıcı</strong>, bu DPA'ya uyum kayıtlarını DPA sona erdikten sonra 3 yıl boyunca saklayacaktır.
### 2. Güvenlik Raporları {#2-security-reports}

<strong>Müşteri</strong>, <strong>Sağlayıcı</strong>'nın <strong>Güvenlik Politikası</strong>nda tanımlanan standartlara karşı bağımsız üçüncü taraf denetçiler tarafından düzenli olarak denetlendiğini kabul eder. Yazılı talep üzerine, <strong>Sağlayıcı</strong>, <strong>Müşteri</strong>'ye gizli bir şekilde, o anki Raporunun özet bir kopyasını vererek <strong>Müşteri</strong>'nin <strong>Sağlayıcı</strong>'nın <strong>Güvenlik Politikası</strong>nda tanımlanan standartlara uyumunu doğrulamasını sağlar.

### 3. Güvenlik Durum Tespiti {#3-security-due-diligence}

Raporun yanı sıra, <strong>Sağlayıcı</strong>, bu DPA'ya uyumunu doğrulamak için <strong>Müşteri</strong> tarafından yapılan makul bilgi taleplerine yanıt verecektir; bu, bilgi güvenliği, durum tespiti ve denetim anketlerine yanıt vermek veya bilgi güvenliği programı hakkında ek bilgi sağlamak şeklinde olabilir. Tüm bu talepler yazılı olmalı ve <strong>Sağlayıcı Güvenlik İletişim</strong> noktasına yapılmalı ve yılda yalnızca bir kez yapılabilir.


## 6. Koordinasyon ve İşbirliği {#6-coordination--cooperation}

### 1. Sorgulara Yanıt {#1-response-to-inquiries}

Eğer <strong>Sağlayıcı</strong>, Müşteri Kişisel Verilerinin İşlenmesi hakkında başka birinden herhangi bir sorgu veya talep alırsa, <strong>Sağlayıcı</strong>, <strong>Müşteri</strong>'yi bu talep hakkında bilgilendirecek ve <strong>Müşteri</strong>'nin önceden onayı olmadan talebe yanıt vermeyecektir. Bu tür sorgu ve taleplere örnek olarak, <strong>Müşteri</strong>'yi bilgilendirmenin Geçerli Hukuk tarafından yasaklanmadığı durumlarda, Müşteri Kişisel Verileri hakkında yargısal, idari veya düzenleyici bir kurumun emri veya bir veri sahibinin talebi verilebilir. Geçerli Hukuk izin veriyorsa, <strong>Sağlayıcı</strong>, bu taleplerle ilgili olarak <strong>Müşteri</strong>'nin makul talimatlarını takip edecek, <strong>Müşteri</strong> tarafından makul şekilde talep edilen durum güncellemeleri ve diğer bilgileri sağlayacaktır. Eğer bir veri sahibi, Geçerli Veri Koruma Yasaları kapsamında <strong>Müşteri</strong>'nin <strong>Sağlayıcı</strong>'ya verdiği Müşteri Kişisel Verilerinin silinmesi veya vazgeçilmesi için geçerli bir talepte bulunursa, <strong>Sağlayıcı</strong>, Geçerli Veri Koruma Yasasına uygun olarak <strong>Müşteri</strong>'nin talebin yerine getirilmesine yardımcı olacaktır. <strong>Sağlayıcı</strong>, bu DPA kapsamında <strong>Sağlayıcı</strong>'nın Müşteri Kişisel Verilerinin İşlenmesi ile ilgili üçüncü taraf talebine karşı <strong>Müşteri</strong> tarafından yapılan herhangi bir yasal yanıt veya diğer usul işlemlerinde, <strong>Müşteri</strong>'nin masrafları karşılığında, <strong>Müşteri</strong> ile işbirliği yapacak ve makul yardım sağlayacaktır.

### 2. DPIA'lar ve DTIA'lar {#2-dpias-and-dtias}

Geçerli Veri Koruma Yasaları gerektiriyorsa, <strong>Sağlayıcı</strong>, İşlemenin niteliği ve Müşteri Kişisel Verileri dikkate alınarak, zorunlu veri koruma etki değerlendirmeleri veya veri transferi etki değerlendirmeleri ve ilgili veri koruma otoriteleri ile danışmanlıkların yapılmasında <strong>Müşteri</strong>'ye makul şekilde yardımcı olacaktır.


## 7. Müşteri Kişisel Verilerinin Silinmesi {#7-deletion-of-customer-personal-data}

### 1. Müşteri Tarafından Silme {#1-deletion-by-customer}

<strong>Sağlayıcı</strong>, <strong>Müşteri</strong>'nin Hizmetlerin işlevselliğiyle uyumlu bir şekilde Müşteri Kişisel Verilerini silmesini sağlayacaktır. <strong>Sağlayıcı</strong>, Geçerli Hukuk tarafından Müşteri Kişisel Verilerinin daha fazla saklanması gerekmedikçe, bu talimata makul bir şekilde mümkün olan en kısa sürede uyacaktır.

### 2. DPA Süresi Dolduğunda Silme {#2-deletion-at-dpa-expiration}

a. DPA süresi dolduktan sonra, <strong>Sağlayıcı</strong>, Geçerli Hukuk tarafından Müşteri Kişisel Verilerinin daha fazla saklanması gerekmediği veya yetkilendirilmediği sürece, <strong>Müşteri</strong>'nin talimatına göre Müşteri Kişisel Verilerini iade edecek veya silecektir. İade veya imha Geçerli Yasalarca uygulanamaz veya yasaklanmışsa, <strong>Sağlayıcı</strong>, Müşteri Kişisel Verilerinin ek İşlenmesini önlemek için makul çaba gösterecek ve elinde, kontrolünde veya gözetiminde kalan Müşteri Kişisel Verilerini korumaya devam edecektir. Örneğin, Geçerli Yasalar <strong>Sağlayıcı</strong>'nın Müşteri Kişisel Verilerini barındırmaya veya işlemeye devam etmesini gerektirebilir.
b. Eğer <strong>Müşteri</strong> ve <strong>Sağlayıcı</strong> bu DPA'nın bir parçası olarak EEA SCC'leri veya Birleşik Krallık Ekini kabul etmişlerse, <strong>Sağlayıcı</strong>, <strong>Müşteri</strong> talep ettiği takdirde yalnızca EEA SCC'lerin 8.1(d) ve 8.5 Maddelerinde tanımlanan Kişisel Verilerin silinmesine ilişkin sertifikayı <strong>Müşteri</strong>'ye verecektir.


## 8. Sorumluluğun Sınırlandırılması {#8-limitation-of-liability}

### 1. Sorumluluk Limitleri ve Tazminat Feragatleri {#1-liability-caps-and-damages-waiver}

**Geçerli Veri Koruma Yasaları kapsamında izin verilen en geniş ölçüde, her tarafın diğer tarafa karşı bu DPA'dan kaynaklanan veya bununla ilgili toplam kümülatif sorumluluğu, <strong>Anlaşma</strong>'da belirtilen feragatlar, istisnalar ve sorumluluk sınırlamalarına tabi olacaktır.**

### 2. İlgili Taraf Talepleri {#2-related-party-claims}

**Bu DPA'dan kaynaklanan veya bununla ilgili olarak <strong>Sağlayıcı</strong> veya bağlı kuruluşlarına karşı yapılan herhangi bir talep yalnızca <strong>Anlaşma</strong>'nın tarafı olan <strong>Müşteri</strong> kuruluşu tarafından ileri sürülebilir.**

### 3. İstisnalar {#3-exceptions}

1. Bu DPA, Geçerli Veri Koruma Yasaları kapsamında bireyin veri koruma haklarıyla ilgili herhangi bir sorumluluğu sınırlamaz. Ayrıca, bu DPA, taraflar arasında EEA SCC'ler veya Birleşik Krallık Eki ihlalleri nedeniyle herhangi bir sorumluluğu sınırlamaz.


## 9. Belgeler Arasındaki Çelişkiler {#9-conflicts-between-documents}

1. Bu DPA, Anlaşmanın bir parçasını oluşturur ve onu tamamlar. Bu DPA, <strong>Anlaşma</strong> veya bunların herhangi bir parçası arasında herhangi bir tutarsızlık olması durumunda, daha önce listelenen kısım, o tutarsızlık için daha sonra listelenen kısma üstün gelir: (1) EEA SCC'ler veya Birleşik Krallık Eki, (2) bu DPA ve ardından (3) <strong>Anlaşma</strong>.


## 10. Anlaşmanın Süresi {#10-term-of-agreement}

Bu DPA, <strong>Sağlayıcı</strong> ve <strong>Müşteri</strong> DPA için bir Kapak Sayfası üzerinde anlaşmaya varıp <strong>Anlaşma</strong>'yı imzaladıklarında veya elektronik olarak kabul ettiklerinde başlar ve <strong>Anlaşma</strong> sona erene veya feshedilene kadar devam eder. Ancak, <strong>Sağlayıcı</strong> ve <strong>Müşteri</strong>, <strong>Müşteri</strong> <strong>Sağlayıcı</strong>'ya Müşteri Kişisel Verilerini aktarmayı durdurana ve <strong>Sağlayıcı</strong> Müşteri Kişisel Verilerini işlemeyi durdurana kadar bu DPA'daki ve Geçerli Veri Koruma Yasalarındaki yükümlülüklere tabi olmaya devam edecektir.


## 11. Geçerli Hukuk ve Seçilen Mahkemeler {#11-governing-law-and-chosen-courts}

<strong>Anlaşma</strong>'nın geçerli hukuk veya benzeri maddelerine bakılmaksızın, bu DPA ile ilgili tüm yorumlar ve uyuşmazlıklar, çatışan hukuk hükümleri dikkate alınmaksızın <strong>Geçerli Devlet</strong>'in yasalarına tabi olacaktır. Ayrıca, <strong>Anlaşma</strong>'nın forum seçimi, yargı yetkisi veya benzeri maddelerine bakılmaksızın, taraflar bu DPA ile ilgili herhangi bir dava, işlem veya takibatı <strong>Geçerli Devlet</strong> mahkemelerinde açmayı kabul eder ve her taraf geri alınamaz şekilde <strong>Geçerli Devlet</strong> mahkemelerinin münhasır yargı yetkisine tabi olur.


## 12. Hizmet Sağlayıcı İlişkisi {#12-service-provider-relationship}

California Tüketici Gizliliği Yasası, Cal. Civ. Code § 1798.100 ve devamı ("CCPA") uygulanabilir olduğu ölçüde, taraflar <strong>Sağlayıcı</strong>'nın bir hizmet sağlayıcı olduğunu ve <strong>Anlaşma</strong>'da kararlaştırıldığı şekilde Hizmeti sağlamak için <strong>Müşteri</strong>'den Kişisel Veri aldığını kabul ve beyan ederler; bu bir iş amacını oluşturur. <strong>Sağlayıcı</strong>, <strong>Anlaşma</strong> kapsamında <strong>Müşteri</strong> tarafından sağlanan herhangi bir Kişisel Veriyi satmayacaktır. Ayrıca, <strong>Sağlayıcı</strong>, <strong>Anlaşma</strong> kapsamında <strong>Müşteri</strong> tarafından sağlanan herhangi bir Kişisel Veriyi, Hizmeti sağlamak için gerekli olduğu durumlar dışında, <strong>Anlaşma</strong>'da belirtilen şekilde veya Geçerli Veri Koruma Yasaları tarafından izin verilen durumlar dışında tutmayacak, kullanmayacak veya açıklamayacaktır. <strong>Sağlayıcı</strong>, bu paragrafın kısıtlamalarını anladığını onaylar.
## 13. Tanımlar {#13-definitions}

1. **"Uygulanabilir Yasalar"**, bir tarafı ilgilendiren veya yöneten ilgili bir devlet otoritesinin yasaları, kuralları, düzenlemeleri, mahkeme kararları ve diğer bağlayıcı gereklilikler anlamına gelir.

2. **"Uygulanabilir Veri Koruma Yasaları"**, Hizmetin bir bireyin kişisel bilgilerini, kişisel verilerini, kişisel olarak tanımlanabilir bilgilerini veya benzer diğer terimleri nasıl işleyebileceğini veya kullanabileceğini düzenleyen Uygulanabilir Yasalar anlamına gelir.

3. **"Kontrolör"**, Kişisel Verilerin İşlenme amacını ve kapsamını belirleyen şirket için Uygulanabilir Veri Koruma Yasalarında verilen anlam(lar)a sahip olacaktır.

4. **"Kapak Sayfası"**, taraflarca imzalanan veya elektronik olarak kabul edilen, bu DPA Standart Şartlarını içeren ve <strong>Sağlayıcı</strong>, <strong>Müşteri</strong> ile veri işleme konusu ve detaylarını belirten bir belge anlamına gelir.

5. **"Müşteri Kişisel Verileri"**, <strong>Müşteri</strong>'nin Hizmet kapsamında <strong>Sağlayıcı</strong>'ya yüklediği veya sağladığı ve bu DPA tarafından yönetilen Kişisel Veriler anlamına gelir.

6. **"DPA"**, bu DPA Standart Şartları, <strong>Sağlayıcı</strong> ile <strong>Müşteri</strong> arasındaki Kapak Sayfası ve Kapak Sayfasında referans verilen veya eklenen politika ve belgeler anlamına gelir.

7. **"AEA SCC'leri"**, Avrupa Komisyonunun 4 Haziran 2021 tarihli ve 2021/914 sayılı Uygulama Kararına eklenen, Avrupa Parlamentosu ve Avrupa Konseyi Tüzüğü (AB) 2016/679 uyarınca kişisel verilerin üçüncü ülkelere aktarımı için standart sözleşme maddeleri anlamına gelir.

8. **"Avrupa Ekonomik Alanı"** veya **"AEA"**, Avrupa Birliği üye devletleri, Norveç, İzlanda ve Lihtenştayn anlamına gelir.

9. **"GDPR"**, ilgili AEA üye ülkesinde yerel kanunla uygulanan Avrupa Birliği Tüzüğü 2016/679 anlamına gelir.

10. **"Kişisel Veri"**, Uygulanabilir Veri Koruma Yasalarında kişisel bilgi, kişisel veri veya benzer diğer terim için verilen anlam(lar)a sahip olacaktır.

11. **"İşleme"** veya **"İşlemek"**, Uygulanabilir Veri Koruma Yasalarında Kişisel Verilerin herhangi bir şekilde kullanılması veya üzerinde bilgisayar işlemi yapılması anlam(lar)ına sahip olacaktır; bu otomatik yöntemlerle de olabilir.

12. **"İşleyen"**, Kontrolör adına Kişisel Verileri İşleyen şirket için Uygulanabilir Veri Koruma Yasalarında verilen anlam(lar)a sahip olacaktır.

13. **"Rapor"**, Sağlayıcı adına Güvenlik Politikası'nda tanımlanan standartlara göre başka bir şirket tarafından hazırlanan denetim raporları anlamına gelir.

14. **"Kısıtlı Aktarım"**, (a) GDPR'nin uygulandığı durumlarda, AEA'dan Avrupa Komisyonu tarafından yeterlilik kararı verilmemiş bir ülkeye kişisel veri aktarımı; ve (b) Birleşik Krallık GDPR'sinin uygulandığı durumlarda, Birleşik Krallık'tan Birleşik Krallık Veri Koruma Yasası 2018'in 17A Bölümü uyarınca yeterlilik düzenlemelerine tabi olmayan herhangi bir ülkeye kişisel veri aktarımı anlamına gelir.

15. **"Güvenlik Olayı"**, GDPR'nin 4. Maddesinde tanımlanan Kişisel Veri İhlali anlamına gelir.

16. **"Hizmet"**, <strong>Sözleşme</strong>'de tanımlanan ürün ve/veya hizmetler anlamına gelir.

17. **"Özel Kategori Verileri"**, GDPR'nin 9. Maddesinde verilen anlamına sahip olacaktır.

18. **"Alt İşleyen"**, Kontrolörün onayı ve kabulü ile Kontrolör adına İşleyene Kişisel Verilerin İşlenmesinde yardımcı olan şirket için Uygulanabilir Veri Koruma Yasalarında verilen anlam(lar)a sahip olacaktır.

19. **"Birleşik Krallık GDPR"**, Birleşik Krallık'ta 2018 tarihli Avrupa Birliği (Çekilme) Yasası'nın 3. Bölümü ile uygulanan Avrupa Birliği Tüzüğü 2016/679 anlamına gelir.

20. **"Birleşik Krallık Ek'i"**, S119A(1) Veri Koruma Yasası 2018 uyarınca Kısıtlı Aktarımlar yapan Taraflar için Bilgi Komiseri tarafından yayımlanan AEA SCC'lerine uluslararası veri aktarım eki anlamına gelir.


## Krediler {#credits}

Bu belge, [Common Paper DPA Standart Şartları (Sürüm 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) türevidir ve [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) lisansı altındadır.
