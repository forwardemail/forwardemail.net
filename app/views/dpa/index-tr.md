# Veri İşleme Sözleşmesi {#data-processing-agreement}

<!-- v1.0 <https://github.com/CommonPaper/DPA> --> adresinden

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email data processing agreement" class="rounded-lg" />

## İçindekiler {#table-of-contents}

* [Anahtar Terimler](#key-terms)
* [Sözleşmede Değişiklikler](#changes-to-the-agreement)
* [1. İşlemci ve Alt İşlemci İlişkileri](#1-processor-and-subprocessor-relationships)
  * [1. Sağlayıcı İşlemci Olarak](#1-provider-as-processor)
  * [2. Alt İşlemci Olarak Sağlayıcı](#2-provider-as-subprocessor)
* [2. İşleme](#2-processing)
  * [1. İşlem Ayrıntıları](#1-processing-details)
  * [2. İşleme Talimatları](#2-processing-instructions)
  * [3. Sağlayıcı Tarafından İşleme](#3-processing-by-provider)
  * [4. Müşteri İşlemleri](#4-customer-processing)
  * [5. İşleme Onayı](#5-consent-to-processing)
  * [6. Alt İşlemciler](#6-subprocessors)
* [3. Sınırlı Transferler](#3-restricted-transfers)
  * [1. Yetkilendirme](#1-authorization)
  * [2. Eski AEA Transferleri](#2-ex-eea-transfers)
  * [3. İngiltere'den Yurtdışına Transferler](#3-ex-uk-transfers)
  * [4. Diğer Uluslararası Transferler](#4-other-international-transfers)
* [4. Güvenlik Olaylarına Müdahale](#4-security-incident-response)
* [5. Denetim ve Raporlar](#5-audit--reports)
  * [1. Denetim Hakları](#1-audit-rights)
  * [2. Güvenlik Raporları](#2-security-reports)
  * [3. Güvenlik Durum Tespiti](#3-security-due-diligence)
* [6. Koordinasyon ve İşbirliği](#6-coordination--cooperation)
  * [1. Sorulara Yanıt](#1-response-to-inquiries)
  * [2. DPIA'lar ve DTIA'lar](#2-dpias-and-dtias)
* [7. Müşteri Kişisel Verilerinin Silinmesi](#7-deletion-of-customer-personal-data)
  * [1. Müşteri Tarafından Silme](#1-deletion-by-customer)
  * [2. DPA Süresi Dolduğunda Silme](#2-deletion-at-dpa-expiration)
* [8. Sorumluluğun Sınırlandırılması](#8-limitation-of-liability)
  * [1. Sorumluluk Sınırları ve Zarar Feragatnamesi](#1-liability-caps-and-damages-waiver)
  * [2. İlgili Taraf Talepleri](#2-related-party-claims)
  * [3. İstisnalar](#3-exceptions)
* [9. Belgeler Arasındaki Çakışmalar](#9-conflicts-between-documents)
* [10. Sözleşmenin Süresi](#10-term-of-agreement)
* [11. Geçerli Hukuk ve Seçilen Mahkemeler](#11-governing-law-and-chosen-courts)
* [12. Hizmet Sağlayıcı İlişkisi](#12-service-provider-relationship)
* [13. Tanımlar](#13-definitions)
* [Krediler](#credits)

## Anahtar Terimler {#key-terms}

| Terim | Değer |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Anlaşma</strong> | Bu DPA, [Terms of Service](/terms)'ı tamamlar |
| <strong>Onaylanmış Alt İşlemciler</strong> | [Cloudflare](https://cloudflare.com) (ABD; DNS, ağ ve güvenlik sağlayıcısı), [DataPacket](https://www.datapacket.com/) (ABD/BK; barındırma sağlayıcısı), [Digital Ocean](https://digitalocean.com) (ABD; barındırma sağlayıcısı), [Vultr](https://www.vultr.com) (ABD; barındırma sağlayıcısı), [Stripe](https://stripe.com) (ABD; ödeme işlemcisi), [PayPal](https://paypal.com) (ABD; ödeme işlemcisi) |
| <strong>Sağlayıcı Güvenlik İletişim Kişisi</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a> |
| <strong>Güvenlik Politikası</strong> | [our Security Policy on GitHub](https://github.com/forwardemail/forwardemail.net/security/policy) görüntüle |
| <strong>Yönetim Devleti</strong> | Delaware Eyaleti, Amerika Birleşik Devletleri |

## Sözleşmede Yapılan Değişiklikler {#changes-to-the-agreement}

Bu belge [Ortak Kağıt DPA Standart Terimleri (Sürüm 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0)'ın bir türevidir ve aşağıdaki değişiklikler yapılmıştır:

1. [Yürürlükteki Hukuk ve Seçilen Mahkemeler](#11-governing-law-and-chosen-courts), yukarıda tanımlanan `Governing State` ile birlikte aşağıda bir bölüm olarak eklenmiştir.
2. [Hizmet Sağlayıcı İlişkisi](#12-service-provider-relationship), aşağıda bir bölüm olarak eklenmiştir.

## 1. İşlemci ve Alt İşlemci İlişkileri {#1-processor-and-subprocessor-relationships}

### 1. İşlemci Olarak Sağlayıcı {#1-provider-as-processor}

<strong>Müşteri</strong>'nin Müşteri Kişisel Verilerinin Denetleyicisi olduğu durumlarda, <strong>Sağlayıcı</strong>, <strong>Müşteri</strong> adına Kişisel Verileri İşleyen bir İşlemci olarak kabul edilecektir.

### 2. Alt İşlemci Olarak Sağlayıcı {#2-provider-as-subprocessor}

<strong>Müşteri</strong>'nin Müşteri Kişisel Verilerinin İşleyicisi olduğu durumlarda, <strong>Sağlayıcı</strong> Müşteri Kişisel Verilerinin Alt İşleyicisi olarak kabul edilecektir.

## 2. {#2-processing} işleniyor

### 1. İşleme Ayrıntıları {#1-processing-details}

Kapak Sayfasındaki Ek I(B), bu İşlemenin konusunu, niteliğini, amacını ve süresini, ayrıca toplanan <strong>Kişisel Veri Kategorileri</strong>'ni ve <strong>Veri Sahibi Kategorileri</strong>'ni açıklamaktadır.

### 2. İşleme Talimatları {#2-processing-instructions}

<strong>Müşteri</strong>, <strong>Sağlayıcı</strong>'ya Müşteri Kişisel Verilerini şu amaçlarla işlemesi talimatını verir: (a) Hizmeti sağlamak ve sürdürmek; (b) <strong>Müşterinin</strong> Hizmeti kullanımıyla daha ayrıntılı olarak açıklanabileceği şekilde; (c) <strong>Sözleşme</strong>'de belgelendiği şekilde; ve (d) <strong>Müşteri</strong> tarafından verilen ve <strong>Sağlayıcı</strong> tarafından bu DPA kapsamında Müşteri Kişisel Verilerinin İşlenmesi hakkında kabul edilen diğer yazılı talimatlarda belgelendiği şekilde. <strong>Sağlayıcı</strong>, yürürlükteki yasalarca yasaklanmadığı sürece bu talimatlara uyacaktır. <strong>Sağlayıcı</strong>, İşleme talimatlarını takip edememesi durumunda derhal <strong>Müşteri</strong>'yi bilgilendirecektir. <strong>Müşteri</strong>, yalnızca yürürlükteki yasalara uygun talimatlar vermiştir ve verecektir.

### 3. Sağlayıcı Tarafından İşleniyor {#3-processing-by-provider}

<strong>Sağlayıcı</strong>, Müşteri Kişisel Verilerini yalnızca Kapak Sayfasındaki bilgiler de dahil olmak üzere bu DPA'ya uygun olarak işleyecektir. <strong>Sağlayıcı</strong>, mevcut ürünleri, özellikleri veya işlevleri güncellemek veya yeni ürünler, özellikler veya işlevler eklemek için Hizmeti güncellerse, <strong>Veri Sahipleri Kategorilerini</strong>, <strong>Kişisel Veri Kategorilerini</strong>, <strong>Özel Kategori Verilerini</strong>, <strong>Özel Kategori Veri Kısıtlamalarını veya Korumalarını</strong>, <strong>Aktarım Sıklığını</strong>, <strong>İşlemenin Niteliğini ve Amacını</strong> ve <strong>İşleme Süresini</strong>, güncellemeleri ve değişiklikleri yansıtmak için gerektiği şekilde <strong>Müşteri</strong>'yi bilgilendirerek değiştirebilir.

### 4. Müşteri İşleme {#4-customer-processing}

<strong>Müşteri</strong> bir İşlemci ve <strong>Sağlayıcı</strong> bir Alt İşlemci olduğunda, <strong>Müşteri</strong>, Müşteri Kişisel Verilerinin <strong>Müşteri</strong> tarafından İşlenmesine ilişkin tüm Geçerli Yasalara uyacaktır. <strong>Müşterinin</strong> Denetleyicisi ile yaptığı sözleşme, <strong>Müşteri</strong>'nin İşlemci olarak <strong>Müşteri</strong>'ye uygulanan tüm Geçerli Yasalara uymasını gerektirecektir. Ayrıca, <strong>Müşteri</strong>, Denetleyicisi ile yaptığı sözleşmedeki Alt İşlemci gerekliliklerine uyacaktır.

### 5. İşleme Onayı {#5-consent-to-processing}

<strong>Müşteri</strong>, Müşteri Kişisel Verilerinin <strong>Sağlayıcı</strong>ya ve/veya Hizmete sağlanmasıyla ilgili olarak tüm Geçerli Veri Koruma Yasalarına uymuştur ve uymaya devam edecektir; bu, tüm açıklamaları yapmak, tüm izinleri almak, yeterli seçenekleri sunmak ve Geçerli Veri Koruma Yasaları uyarınca gerekli olan ilgili güvenlik önlemlerini uygulamak anlamına gelir.

### 6. Alt İşlemciler {#6-subprocessors}

a. <strong>Sağlayıcı</strong>, <strong>Müşteri</strong> Alt İşlemciyi onaylamadığı sürece hiçbir Müşteri Kişisel Verisini bir Alt İşlemciye sağlamayacak, devretmeyecek veya teslim etmeyecektir. Güncel <strong>Onaylı Alt İşlemciler</strong> listesi, Alt İşlemcilerin kimliklerini, bulundukları ülkeyi ve öngörülen İşleme görevlerini içerir. <strong>Sağlayıcı</strong>, <strong>Onaylı Alt İşlemcilerde</strong>, bir Alt İşlemcinin eklenmesi veya değiştirilmesi yoluyla yapılması planlanan tüm değişiklikler hakkında <strong>Müşteri</strong>'yi en az 10 iş günü önceden ve yazılı olarak bilgilendirecektir. Bu, <strong>Müşteri</strong>'ye, <strong>Sağlayıcı</strong> yeni Alt İşlemci(ler)i kullanmaya başlamadan önce değişikliklere itiraz etmek için yeterli zaman tanır. <strong>Sağlayıcı</strong>, <strong>Müşteri</strong>'ye, <strong>Onaylı Alt İşlemciler</strong>'deki değişikliğe itiraz etme hakkını kullanabilmesi için gerekli bilgileri verecektir. <strong>Müşteri</strong>, <strong>Onaylı Alt İşlemciler</strong>'deki bir değişikliğin bildiriminden itibaren 30 gün içinde itiraz edebilir; aksi takdirde <strong>Müşteri</strong> değişiklikleri kabul etmiş sayılır. <strong>Müşteri</strong>, bildirimden itibaren 30 gün içinde değişikliğe itiraz ederse, <strong>Müşteri</strong> ve <strong>Sağlayıcı</strong>, <strong>Müşteri</strong>'nin itirazını veya endişesini gidermek için iyi niyetle iş birliği yapacaktır.

b. Bir Alt İşlemci ile çalışırken, <strong>Sağlayıcı</strong>, Alt İşlemcinin Müşteri Kişisel Verilerine yalnızca (i) kendisine alt sözleşmeyle verilen yükümlülükleri yerine getirmek için gereken ölçüde ve (ii) <strong>Sözleşme</strong> şartlarıyla tutarlı bir şekilde erişmesini ve kullanmasını garanti eden Alt İşlemci ile yazılı bir sözleşmeye sahip olacaktır.

c. GDPR, Müşteri Kişisel Verilerinin İşlenmesine uygulanıyorsa, (i) bu DPA'da açıklanan veri koruma yükümlülükleri (geçerliyse, GDPR'nin 28(3) Maddesinde belirtildiği gibi) Alt İşlemciye de uygulanır ve (ii) <strong>Sağlayıcı</strong>'nın Alt İşlemci ile olan sözleşmesi, <strong>Sağlayıcı</strong> ve Alt İşlemcisinin Müşteri Kişisel Verilerinin İşlenmesiyle ilgili sorulara veya taleplere nasıl yanıt vermek için koordine olacaklarına dair ayrıntılar da dahil olmak üzere bu yükümlülükleri içerecektir. Ayrıca, <strong>Sağlayıcı</strong>, <strong>Müşterinin</strong> talebi üzerine, sözleşmelerinin bir kopyasını (değişiklikler dahil) Alt İşlemcileriyle paylaşacaktır. Ticari sırları veya kişisel veriler de dahil olmak üzere diğer gizli bilgileri korumak için gerekli olduğu ölçüde, <strong>Sağlayıcı</strong>, bir kopya paylaşmadan önce Alt İşlemcisiyle yaptığı sözleşmenin metnini düzenleyebilir.

d. <strong>Sağlayıcı</strong>, Müşteri Kişisel Verilerini İşleme sürecinde Alt İşlemcilerinin eylem ve ihmalleri de dahil olmak üzere, Alt İşlemcilerine alt sözleşme yoluyla devredilen tüm yükümlülüklerden tamamen sorumlu olmaya devam eder. <strong>Sağlayıcı</strong>, Alt İşlemcilerinin <strong>Sağlayıcı</strong> ile Alt İşlemci arasındaki sözleşme kapsamında Müşteri Kişisel Verileri ile ilgili önemli bir yükümlülüğü yerine getirmemesi durumunda Müşteriyi bilgilendirecektir.

## 3. Kısıtlı Transferler {#3-restricted-transfers}

### 1. Yetkilendirme {#1-authorization}

<strong>Müşteri</strong>, <strong>Sağlayıcı</strong>'nın, Hizmeti sağlamak için gerekli olduğu takdirde Müşteri Kişisel Verilerini AEA, Birleşik Krallık veya diğer ilgili coğrafi bölgelerin dışına aktarabileceğini kabul eder. <strong>Sağlayıcı</strong>, Müşteri Kişisel Verilerini Avrupa Komisyonu veya diğer ilgili denetim otoritesinin yeterlilik kararı vermediği bir bölgeye aktarırsa, <strong>Sağlayıcı</strong>, Müşteri Kişisel Verilerinin söz konusu bölgeye aktarımı için Geçerli Veri Koruma Yasaları ile uyumlu uygun güvenlik önlemlerini uygulayacaktır.

### 2. Eski AEA Transferleri {#2-ex-eea-transfers}

<strong>Müşteri</strong> ve <strong>Sağlayıcı</strong>, GDPR'nin Müşteri Kişisel Verilerinin aktarımını koruması durumunda, aktarımın AEA içindeki <strong>Müşteri</strong>'den AEA dışındaki <strong>Sağlayıcı</strong>'ya yapılması ve aktarımın Avrupa Komisyonu tarafından verilen bir yeterlilik kararına tabi olmaması durumunda, bu DPA'yı imzalayarak <strong>Müşteri</strong> ve <strong>Sağlayıcı</strong>'nın, atıf yoluyla dahil edilen AEA SCC'lerini ve Eklerini imzalamış sayılacağı konusunda anlaşmışlardır. Bu tür aktarımlar, aşağıdaki şekilde tamamlanan AEA SCC'leri uyarınca yapılır:

a. AEA SCC'lerinin İkinci Modülü (Denetleyiciden İşlemciye), <strong>Müşteri</strong> bir Denetleyici olduğunda ve <strong>Sağlayıcı</strong> bir İşlemci olarak <strong>Müşteri</strong> adına Müşteri Kişisel Verilerini İşlediğinde geçerlidir.

b. AEA SCC'lerinin Üçüncü Modülü (İşlemciden Alt İşlemciye), <strong>Müşteri</strong> bir İşlemci olduğunda ve <strong>Sağlayıcı</strong>, <strong>Müşteri</strong> adına bir Alt İşlemci olarak Müşteri Kişisel Verilerini İşlediğinde geçerlidir.

c. Her modül için aşağıdakiler geçerlidir (uygulanabilir olduğunda):

1. Madde 7'deki isteğe bağlı yerleştirme hükmü uygulanmaz;

2. Madde 9'da, Seçenek 2 (genel yazılı yetki) geçerlidir ve Alt İşlemci değişikliklerinin önceden bildirilmesi için asgari süre 10 iş günüdür;

3. Madde 11'de isteğe bağlı ifade uygulanmaz;

4. Madde 13'teki tüm köşeli parantezler kaldırılmıştır;

5. Madde 17'de (Seçenek 1), AEA SCC'leri <strong>Yönetim Üye Devleti</strong>nin yasalarına tabi olacaktır;

6. Madde 18(b)'de, uyuşmazlıklar <strong>Yönetim Üyesi Devlet</strong> mahkemelerinde çözülecektir; ve

7. Bu DPA'nın Kapak Sayfası, AEA SCC'lerinin Ek I, Ek II ve Ek III'ünde gerekli olan bilgileri içermektedir.

### 3. Eski Birleşik Krallık Transferleri {#3-ex-uk-transfers}

<strong>Müşteri</strong> ve <strong>Sağlayıcı</strong>, Birleşik Krallık GDPR'sinin Müşteri Kişisel Verilerinin aktarımını koruması durumunda, aktarımın Birleşik Krallık içindeki <strong>Müşteri</strong>'den Birleşik Krallık dışındaki <strong>Sağlayıcı</strong>'ya yapılması ve aktarımın Birleşik Krallık Dışişleri Bakanlığı tarafından verilen bir yeterlilik kararına tabi olmaması durumunda, bu DPA'yı imzalayarak <strong>Müşteri</strong> ve <strong>Sağlayıcı</strong>'nın, atıf yoluyla dahil edilen Birleşik Krallık Eki ve Eklerini imzalamış sayılacağı konusunda anlaşmışlardır. Bu tür aktarımlar, aşağıdaki şekilde tamamlanan Birleşik Krallık Eki uyarınca yapılır:

a. Bu DPA'nın 3.2. Bölümü, Birleşik Krallık Eki'nin 2. Tablosunda gerekli olan bilgileri içermektedir.

b. Birleşik Krallık Ek Sözleşmesi'nin 4. Tablosu aşağıdaki şekilde değiştirilmiştir: Tarafların hiçbiri Birleşik Krallık Ek Sözleşmesi'ni Birleşik Krallık Ek Sözleşmesi'nin 19. Bölümü'nde belirtildiği şekilde sonlandıramaz; ICO, Birleşik Krallık Ek Sözleşmesi'nin 18. Bölümü uyarınca revize edilmiş bir Onaylanmış Ek Sözleşmesi yayınladığı ölçüde, taraflar bu DPA'yı buna göre revize etmek için iyi niyetle çalışacaklardır.

c. Kapak Sayfası, Birleşik Krallık Ek Sözleşmesinin Ek 1A, Ek 1B, Ek II ve Ek III'ünde istenen bilgileri içerir.

### 4. Diğer Uluslararası Transferler {#4-other-international-transfers}

Uluslararası nitelikteki aktarımlara İsviçre hukukunun (herhangi bir AEA üye devletinin veya Birleşik Krallık'ın hukukunun değil) uygulandığı Kişisel Veri aktarımları için, AEA SCC'lerinin 4. Maddesindeki GDPR'ye yapılan atıflar, yasal olarak gerekli olduğu ölçüde, İsviçre Federal Veri Koruma Yasası'na veya onun halefine atıfta bulunacak şekilde değiştirilecek ve denetleyici makam kavramı İsviçre Federal Veri Koruma ve Bilgi Komiseri'ni de içerecektir.

## 4. Güvenlik Olayı Müdahalesi {#4-security-incident-response}

1. Herhangi bir Güvenlik Olayı'nın farkına vardığında, <strong>Sağlayıcı</strong>: (a) mümkün olduğunda gereksiz gecikme olmaksızın, ancak Güvenlik Olayı'nın farkına vardıktan sonraki 72 saat içinde <strong>Müşteri</strong>'yi bilgilendirecektir; (b) Güvenlik Olayı hakkında, öğrenildiği veya <strong>Müşteri</strong> tarafından makul bir şekilde talep edildiği anda zamanında bilgi sağlayacaktır; ve (c) Güvenlik Olayı'nı kontrol altına almak ve araştırmak için makul adımları derhal atacaktır. <strong>Sağlayıcı</strong>'nın bu DPA'da gerekli görüldüğü şekilde bir Güvenlik Olayı'nı bildirmesi veya buna yanıt vermesi, <strong>Sağlayıcı</strong> tarafından Güvenlik Olayı'na ilişkin herhangi bir hata veya yükümlülüğün kabul edildiği şeklinde yorumlanmayacaktır.

## 5. Denetim ve Raporlar {#5-audit--reports}

### 1. Denetim Hakları {#1-audit-rights}

<strong>Sağlayıcı</strong>, bu DPA'ya uyumunu göstermek için makul ölçüde gerekli tüm bilgileri <strong>Müşteri</strong>'ye verecek ve <strong>Sağlayıcı</strong>'nın bu DPA'ya uyumunu değerlendirmek için <strong>Müşteri</strong> tarafından yapılan incelemeler de dahil olmak üzere denetimlere izin verecek ve katkıda bulunacaktır. Ancak, <strong>Müşteri</strong>'nin bilgilere erişiminin <strong>Sağlayıcı</strong>'nın fikri mülkiyet haklarını, gizlilik yükümlülüklerini veya Geçerli Yasalar kapsamındaki diğer yükümlülüklerini olumsuz etkilemesi durumunda <strong>Sağlayıcı</strong>, verilere veya bilgilere erişimi kısıtlayabilir. <strong>Müşteri</strong>, bu DPA kapsamındaki denetim haklarını ve Geçerli Veri Koruma Yasaları tarafından verilen tüm denetim haklarını yalnızca <strong>Sağlayıcı</strong>'ya aşağıdaki raporlama ve gerekli özeni gösterme gerekliliklerine uyması talimatını vererek kullanacağını kabul ve beyan eder. <strong>Sağlayıcı</strong>, bu DPA'ya uyumuna ilişkin kayıtları, DPA sona erdikten sonra 3 yıl boyunca saklayacaktır.

### 2. Güvenlik Raporları {#2-security-reports}

<strong>Müşteri</strong>, <strong>Sağlayıcı</strong>'nın <strong>Güvenlik Politikası</strong>'nda tanımlanan standartlara göre bağımsız üçüncü taraf denetçiler tarafından düzenli olarak denetlendiğini kabul eder. <strong>Sağlayıcı</strong>, yazılı talep üzerine, <strong>Müşteri</strong>'ya, <strong>Müşteri</strong>'nin <strong>Sağlayıcı</strong>'nın <strong>Güvenlik Politikası</strong>'nda tanımlanan standartlara uygunluğunu doğrulayabilmesi için, o tarihteki güncel Raporunun özet bir kopyasını gizli bir şekilde verecektir.

### 3. Güvenlik Durum Tespiti {#3-security-due-diligence}

Rapora ek olarak, <strong>Sağlayıcı</strong>, <strong>Müşteri</strong> tarafından <strong>Sağlayıcı</strong>'nın bu DPA'ya uyumunu teyit etmek için yapılan makul bilgi taleplerine yanıt verecektir. Bu talepler arasında bilgi güvenliği, gerekli özen ve denetim anketlerine verilen yanıtlar veya bilgi güvenliği programı hakkında ek bilgiler yer almaktadır. Bu tür taleplerin tümü yazılı olmalı ve <strong>Sağlayıcı Güvenlik İrtibat Kişisi</strong>'ne iletilmelidir ve yılda yalnızca bir kez yapılabilir.

## 6. Koordinasyon ve İşbirliği {#6-coordination--cooperation}

### 1. Sorulara Yanıt {#1-response-to-inquiries}

<strong>Sağlayıcı</strong>, Müşteri Kişisel Verilerinin İşlenmesi hakkında başka birinden herhangi bir sorgu veya talep alırsa, <strong>Sağlayıcı</strong>, <strong>Müşteri</strong>'yi talep hakkında bilgilendirecek ve <strong>Müşteri</strong>'nin önceden onayı olmadan talebe yanıt vermeyecektir. Bu tür sorgu ve taleplere örnek olarak, <strong>Müşteri</strong>'ye bildirimde bulunmanın Uygulanabilir Yasa tarafından yasaklanmadığı durumlarda Müşteri Kişisel Verileri hakkında bir adli, idari veya düzenleyici kurum emri veya bir veri sahibinin talebi verilebilir. Uygulanabilir Yasa tarafından izin verilmesi halinde, <strong>Sağlayıcı</strong>, <strong>Müşteri</strong> tarafından makul olarak talep edilen durum güncellemeleri ve diğer bilgiler de dahil olmak üzere, bu talepler hakkında <strong>Müşteri</strong>'nin makul talimatlarını izleyecektir. Bir veri sahibi, Müşterinin Kişisel Verilerinin Sağlayıcıya verilmesini silmek veya reddetmek için Geçerli Veri Koruma Yasaları uyarınca geçerli bir talepte bulunursa, Sağlayıcı, Müşterinin talebini Geçerli Veri Koruma Yasası uyarınca yerine getirmesine yardımcı olacaktır. Sağlayıcı, bu DPA kapsamında Müşteri Kişisel Verilerinin Sağlayıcı tarafından İşlenmesine ilişkin üçüncü taraf talebine yanıt olarak Müşteri tarafından alınan herhangi bir yasal yanıt veya diğer prosedürel işlemde, Müşterinin masrafları ile Müşteriyle iş birliği yapacak ve ona makul yardımı sağlayacaktır.

### 2. DPIA'lar ve DTIA'lar {#2-dpias-and-dtias}

Uygulanabilir Veri Koruma Yasaları tarafından gerektirildiği takdirde, <strong>Sağlayıcı</strong>, İşleme ve Müşteri Kişisel Verilerinin niteliğini göz önünde bulundurarak, <strong>Müşteri</strong>'ye zorunlu veri koruma etki değerlendirmeleri veya veri aktarımı etki değerlendirmeleri ve ilgili veri koruma otoriteleriyle istişareler yürütme konusunda makul ölçüde yardımcı olacaktır.

## 7. Müşteri Kişisel Verilerinin Silinmesi {#7-deletion-of-customer-personal-data}

### 1. Müşteri Tarafından Silme {#1-deletion-by-customer}

<strong>Sağlayıcı</strong>, <strong>Müşteri</strong>'nin, Hizmetlerin işlevselliğiyle tutarlı bir şekilde Müşteri Kişisel Verilerini silmesine olanak tanıyacaktır. <strong>Sağlayıcı</strong>, Müşteri Kişisel Verilerinin daha fazla saklanmasının Uygulanabilir Yasa tarafından gerekli kılındığı durumlar haricinde, makul ölçüde uygulanabilir olduğu anda bu talimata uyacaktır.

### 2. DPA Süresi Dolduğunda Silme {#2-deletion-at-dpa-expiration}

a. DPA'nın süresi dolduktan sonra, <strong>Sağlayıcı</strong>, Müşteri Kişisel Verilerinin daha fazla saklanması Geçerli Yasa tarafından gerekli kılınmadığı veya yetkilendirilmediği sürece, Müşteri'nin talimatı üzerine Müşteri Kişisel Verilerini iade edecek veya silecektir. İade veya imhanın Uygulanabilir Yasalar tarafından mümkün olmaması veya yasaklanması durumunda, <strong>Sağlayıcı</strong>, Müşteri Kişisel Verilerinin daha fazla işlenmesini önlemek için makul çabayı gösterecek ve elinde, muhafazasında veya kontrolünde kalan Müşteri Kişisel Verilerini korumaya devam edecektir. Örneğin, Geçerli Yasalar, <strong>Sağlayıcı</strong>'nın Müşteri Kişisel Verilerini barındırmaya veya İşlemeye devam etmesini gerektirebilir.

b. <strong>Müşteri</strong> ve <strong>Sağlayıcı</strong>, bu DPA'nın bir parçası olarak AEA SCC'lerine veya Birleşik Krallık Eki'ne girmişlerse, <strong>Sağlayıcı</strong>, yalnızca <strong>Müşteri</strong>'nin talep etmesi halinde AEA SCC'lerinin 8.1(d) ve 8.5 Maddelerinde açıklanan Kişisel Verilerin silinmesine ilişkin sertifikayı verecektir.

## 8. Sorumluluğun Sınırlandırılması {#8-limitation-of-liability}

### 1. Sorumluluk Sınırları ve Zarar Feragatnamesi {#1-liability-caps-and-damages-waiver}

**Uygulanabilir Veri Koruma Yasaları kapsamında izin verilen azami ölçüde, her bir tarafın bu DPA'dan kaynaklanan veya bu DPA ile ilgili olarak diğer tarafa karşı toplam kümülatif sorumluluğu, <strong>Sözleşme</strong>'de belirtilen feragatlere, istisnalara ve sorumluluk sınırlamalarına tabi olacaktır.**

### 2. İlgili Taraf Talepleri {#2-related-party-claims}

**Bu DPA'dan kaynaklanan veya bununla ilgili olarak <strong>Sağlayıcı</strong> veya Bağlı Şirketlerine karşı yapılan tüm talepler yalnızca <strong>Sözleşme</strong>'ye taraf olan <strong>Müşteri</strong> tüzel kişi tarafından ileri sürülebilir.**

### 3. İstisnalar {#3-exceptions}

1. Bu DPA, bir bireyin Geçerli Veri Koruma Yasaları kapsamındaki veri koruma haklarına ilişkin sorumluluğunu sınırlamaz. Ayrıca, bu DPA, taraflar arasındaki AEA SCC'leri veya Birleşik Krallık Eki'nin ihlalleri nedeniyle ortaya çıkan sorumluluğu sınırlamaz.

## 9. Belgeler Arasındaki Çakışmalar {#9-conflicts-between-documents}

1. Bu DPA, Sözleşme'nin bir parçasını oluşturur ve onu tamamlar. Bu DPA, Sözleşme veya bunların herhangi bir kısmı arasında herhangi bir tutarsızlık olması durumunda, daha önce listelenen kısım, söz konusu tutarsızlık için daha sonra listelenen kısım üzerinde kontrol sahibi olacaktır: (1) AEA SCC'leri veya Birleşik Krallık Eki, (2) bu DPA ve ardından (3) Sözleşme.

## 10. Sözleşmenin Süresi {#10-term-of-agreement}

Bu DPA, <strong>Sağlayıcı</strong> ve <strong>Müşteri</strong>'nin DPA için bir Kapak Sayfası üzerinde anlaşıp <strong>Sözleşme</strong>'yi imzalamaları veya elektronik olarak kabul etmeleri ile başlayacak ve <strong>Sözleşme</strong> sona erene veya feshedilene kadar devam edecektir. Ancak, <strong>Sağlayıcı</strong> ve <strong>Müşteri</strong>, <strong>Müşteri</strong>, Müşteri Kişisel Verilerini <strong>Sağlayıcı</strong>'ya aktarmayı ve <strong>Sağlayıcı</strong>, Müşteri Kişisel Verilerini İşlemeyi durdurana kadar bu DPA ve Geçerli Veri Koruma Yasaları kapsamındaki yükümlülüklere tabi olmaya devam edecektir.

## 11. Yürürlükteki Hukuk ve Seçilen Mahkemeler {#11-governing-law-and-chosen-courts}

<strong>Sözleşme</strong>'nin yürürlükteki yasalarına veya benzer maddelerine bakılmaksızın, bu DPA ile ilgili tüm yorumlar ve anlaşmazlıklar, kanunlar ihtilafı hükümleri dikkate alınmaksızın <strong>Yönetim Devleti</strong> yasalarına tabi olacaktır. Ayrıca, <strong>Sözleşme</strong>'nin mahkeme seçimi, yargı yetkisi veya benzer maddelerine bakılmaksızın, taraflar bu DPA ile ilgili herhangi bir hukuki dava, eylem veya yargılamayı <strong>Yönetim Devleti</strong> mahkemelerinde açmayı kabul eder ve her iki taraf da geri dönülmez bir şekilde bu mahkemelerin münhasır yargı yetkisine tabi olur.

## 12. Hizmet Sağlayıcı İlişkisi {#12-service-provider-relationship}

Kaliforniya Tüketici Gizliliği Yasası, Cal. Civ. Code § 1798.100 ve devamı ("CCPA") geçerli olduğu ölçüde, taraflar <strong>Sağlayıcı</strong>'nın bir hizmet sağlayıcı olduğunu ve <strong>Sözleşme</strong>'de kararlaştırıldığı şekilde Hizmeti sağlamak için <strong>Müşteri</strong>'den Kişisel Veriler aldığını ve bunun bir ticari amaç teşkil ettiğini kabul ve beyan eder. <strong>Sağlayıcı</strong>, <strong>Müşteri</strong> tarafından <strong>Sözleşme</strong> kapsamında sağlanan hiçbir Kişisel Veriyi satmayacaktır. Ayrıca, <strong>Sağlayıcı</strong>, <strong>Müşteri</strong> tarafından <strong>Sözleşme</strong> kapsamında sağlanan hiçbir Kişisel Veriyi, <strong>Sözleşme</strong>'de belirtildiği gibi veya Geçerli Veri Koruma Yasaları tarafından izin verildiği şekilde <strong>Müşteri</strong>'ye Hizmeti sağlamak için gerekli olmadıkça saklamayacak, kullanmayacak veya ifşa etmeyecektir. <strong>Sağlayıcı</strong> bu paragrafın kısıtlamalarını anladığını beyan eder.

## 13. Tanımlar {#13-definitions}

1. **"Uygulanabilir Yasalar"**, bir tarafa uygulanan veya onu yöneten ilgili bir devlet otoritesinin yasaları, kuralları, yönetmelikleri, mahkeme emirleri ve diğer bağlayıcı gereklilikleri anlamına gelir.

2. **"Uygulanabilir Veri Koruma Yasaları"**, Hizmetin bir bireyin kişisel bilgilerini, kişisel verilerini, kişisel olarak tanımlanabilir bilgilerini veya diğer benzer terimleri nasıl işleyebileceğini veya kullanabileceğini düzenleyen Uygulanabilir Yasalar anlamına gelir.

3. **"Denetleyici"**, Kişisel Verilerin İşlenme amacını ve kapsamını belirleyen şirket için Uygulanabilir Veri Koruma Kanunlarında belirtilen anlamı/anlamları taşıyacaktır.

4. **"Kapak Sayfası"**, taraflarca imzalanan veya elektronik olarak kabul edilen, bu DPA Standart Şartlarını içeren ve <strong>Sağlayıcı</strong>'yı, <strong>Müşteri</strong>'yi ve veri işlemenin konusunu ve ayrıntılarını tanımlayan bir belge anlamına gelir.

5. **"Müşteri Kişisel Verileri"**, <strong>Müşterinin</strong> Hizmet kapsamında <strong>Sağlayıcıya</strong> yüklediği veya sağladığı ve bu DPA tarafından yönetilen Kişisel Veriler anlamına gelir.

6. **"DPA"**, bu DPA Standart Şartları, <strong>Sağlayıcı</strong> ile <strong>Müşteri</strong> arasındaki Kapak Sayfası ve Kapak Sayfasında atıfta bulunulan veya Kapak Sayfasına eklenen politikalar ve belgeler anlamına gelir.

7. **"AEA SCC'leri"**, Avrupa Komisyonu'nun 4 Haziran 2021 tarihli 2021/914 sayılı Uygulama Kararı'na eklenen, Avrupa Parlamentosu ve Avrupa Konseyi'nin (AB) 2016/679 sayılı Tüzüğü uyarınca kişisel verilerin üçüncü ülkelere aktarılmasına ilişkin standart sözleşme hükümlerini ifade eder.

8. **"Avrupa Ekonomik Alanı"** veya **"AEA"** Avrupa Birliği üye devletleri, Norveç, İzlanda ve Lihtenştayn anlamına gelir.

9. **"GDPR"** ilgili AEA üye ülkesinde yerel yasalarca uygulanan 2016/679 sayılı Avrupa Birliği Tüzüğü anlamına gelir.

10. **"Kişisel Veriler"**, Kişisel Bilgi, Kişisel Veri veya benzeri terimler için Uygulanabilir Veri Koruma Kanunlarında belirtilen anlamı taşıyacaktır.

11. **"İşleme"** veya **"İşlem"**, otomatik yöntemler de dahil olmak üzere, Kişisel Verilerin herhangi bir şekilde kullanılması veya Kişisel Veriler üzerinde bir bilgisayar işlemi gerçekleştirilmesi için Uygulanabilir Veri Koruma Yasalarında verilen anlamı taşıyacaktır.

12. **"İşlemci"**, Denetleyici adına Kişisel Verileri İşleyen şirket için Uygulanabilir Veri Koruma Kanunlarında belirtilen anlamı taşıyacaktır.

13. **“Rapor”**, Güvenlik Politikasında tanımlanan standartlara uygun olarak Sağlayıcı adına başka bir şirket tarafından hazırlanan denetim raporları anlamına gelir.

14. **"Sınırlı Aktarım"** (a) GDPR'nin uygulandığı durumlarda, kişisel verilerin Avrupa Ekonomik Alanı'ndan (AEA) Avrupa Komisyonu tarafından yeterliliğe ilişkin bir tespite tabi olmayan AEA dışındaki bir ülkeye aktarılması; ve (b) Birleşik Krallık GDPR'sinin uygulandığı durumlarda, kişisel verilerin Birleşik Krallık'tan Birleşik Krallık Veri Koruma Yasası 2018'in 17A Bölümü uyarınca kabul edilen yeterliliğe ilişkin düzenlemelere tabi olmayan herhangi bir başka ülkeye aktarılması anlamına gelir.

15. **“Güvenlik Olayı”**, GDPR’nin 4. maddesinde tanımlanan Kişisel Veri İhlali anlamına gelir.

16. **"Hizmet"**, <strong>Sözleşme</strong>'de açıklanan ürün ve/veya hizmetler anlamına gelir.

17. **“Özel Nitelikli Veriler”** GDPR’nin 9. maddesinde belirtilen anlamı taşıyacaktır.

18. **"Alt İşlemci"**, Denetleyicinin onayı ve kabulüyle Denetleyici adına Kişisel Verilerin İşlenmesinde İşlemciye yardımcı olan bir şirket için Uygulanabilir Veri Koruma Kanunlarında verilen anlamı taşıyacaktır.

19. **"BK GDPR"** Birleşik Krallık'ın 2018 tarihli Avrupa Birliği (Çekilme) Yasası'nın 3. bölümü uyarınca Birleşik Krallık'ta uygulanan 2016/679 sayılı Avrupa Birliği Tüzüğü anlamına gelir.

20. **"BK Eki"**, S119A(1) Veri Koruma Yasası 2018 uyarınca Kısıtlı Transferler yapan Taraflar için Bilgi Komiseri tarafından AEA SCC'lerine verilen uluslararası veri transferi eki anlamına gelir.

## Krediler {#credits}

Bu belge [Ortak Kağıt DPA Standart Terimleri (Sürüm 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0)'ın bir türevidir ve [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) lisansı altında lisanslanmıştır.