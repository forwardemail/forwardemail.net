# İhlal Bildirimi {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Forward Email'e kötüye kullanım ve spam bildir" class="rounded-lg" />


## İçindekiler {#table-of-contents}

* [Feragatname](#disclaimer)
* [İhlal bildirimi nasıl gönderilir](#how-to-submit-an-abuse-report)
* [Genel halk için](#for-the-general-public)
* [Emniyet güçleri için](#for-law-enforcement)
  * [Hangi bilgiler mevcut](#what-information-is-available)
  * [Hangi bilgiler mevcut değil](#what-information-is-not-available)
  * [ABD merkezli emniyet güçleri](#law-enforcement-based-in-the-united-states)
  * [ABD dışı emniyet güçleri](#law-enforcement-based-outside-of-the-united-states)
  * [Emniyet güçleri acil talepleri](#law-enforcement-emergency-requests)
  * [Emniyet güçleri talepleri hesap bildirimlerini tetikleyebilir](#law-enforcement-requests-may-trigger-account-notices)
  * [Emniyet güçleri bilgi koruma talepleri](#law-enforcement-requests-to-preserve-information)
  * [Emniyet güçleri tebligat süreci](#law-enforcement-serving-process)


## Feragatname {#disclaimer}

Lütfen site genelinde geçerli olan [Şartlarımıza](/terms) bakınız.


## İhlal bildirimi nasıl gönderilir {#how-to-submit-an-abuse-report}

İhlal bildirimlerini inceliyor ve [genel halk](#for-the-general-public) ile [emniyet güçleri](#for-law-enforcement) için bilgi taleplerini vaka bazında e-posta yoluyla karşılıyoruz.

Kullanıcılar, e-postalar, IP adresleri ve/veya alan adlarıyla ilgili ihlal bildirimleri ve bilgi talepleri aşağıda topluca "Hesap" olarak anılmaktadır.

Kötüye kullanım ile ilgili talep veya bildiriminiz için iletişim e-posta adreslerimiz: `support@forwardemail.net`, `abuse@forwardemail.net` ve `security@forwardemail.net`.

Mümkünse bu e-posta adreslerinin hepsine birer kopya gönderiniz ve 24-48+ saat içinde dönüş yapmazsak hatırlatma e-postaları gönderiniz.

Size uygun olabilecek daha fazla bilgi için aşağıdaki bölümleri okuyunuz.


## Genel halk için {#for-the-general-public}

<u>**Eğer siz veya bir başkası acil tehlike altındaysa, lütfen hemen polis ve acil servislerle iletişime geçin.**</u>

<u>**Hesabınıza erişimi geri kazanmak veya kötü niyetli bir aktörü durdurmak için profesyonel hukuki danışmanlık almanız önerilir.**</u>

Hizmetimizi kullanan bir Hesaptan kötüye kullanım mağduruysanız, lütfen yukarıdaki adrese e-posta ile bildiriminizi gönderin. Hesabınız kötü niyetli bir aktör tarafından ele geçirildiyse (örneğin, alan adınız yakın zamanda süresi doldu ve üçüncü bir taraf tarafından yeniden kaydedilip kötüye kullanım için kullanıldıysa), lütfen tam Hesap bilgilerinizi (örneğin alan adınız) içeren bir raporu yukarıdaki adrese e-posta ile gönderin. Önceki sahipliğiniz doğrulandıktan sonra Hesabı [gölge yasaklama](https://en.wikipedia.org/wiki/Shadow_banning) yoluyla engellemenize yardımcı olabiliriz. Hesabınıza erişimi geri kazanmanız konusunda yetkimiz olmadığını lütfen unutmayın.

Hukuki temsilciniz, sizi emniyet güçleri, Hesap sahibi (örneğin alan adının kayıt kuruluşu; alan adını kaydettiğiniz web sitesi) ile iletişime geçmeye veya sizi [ICANN'in kayıp alan adları sayfasına](https://www.icann.org/resources/pages/lost-domain-names) yönlendirebilir.


## Emniyet güçleri için {#for-law-enforcement}

Çoğu talep için, bilgi açıklama yetkimiz [Elektronik İletişim Gizliliği Yasası](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701) ve devamı ("ECPA") ile düzenlenmektedir. ECPA, belirli türdeki yasal talepler (mahkeme celbi, mahkeme emri ve arama emri gibi) karşılığında emniyet güçlerine belirli kullanıcı bilgilerini açıklamamızı zorunlu kılar.

Eğer bir emniyet gücü mensubuysanız ve bir Hesap hakkında bilgi talep ediyorsanız, talebinizde Hesap bilgileri ile tarih ve zaman aralığı belirtilmelidir. Çok geniş ve/veya belirsiz talepleri işleyemeyiz – bu, kullanıcılarımızın verilerini ve güvenini korumak ve en önemlisi verilerini güvende tutmak içindir.
Talebiniz bize [Hükümlerimiz](/terms) ihlalini işaret ediyorsa, bunu kötüye kullanımı ele almak için yalnızca dahili en iyi uygulamalarımıza göre işleyeceğiz – bazı durumlarda bunun Hesabın askıya alınması ve/veya yasaklanmasıyla sonuçlanabileceğini unutmayın.

**Biz bir alan adı kayıt kuruluşu olmadığımız için**, bir alan adıyla ilgili tarihsel DNS kayıt bilgisi arıyorsanız, ilgili alan adına karşılık gelen belirli alan adı kayıt kuruluşuyla iletişime geçmelisiniz. [Security Trails]() gibi hizmetler tarihsel kayıt sorgulaması sağlayabilir, ancak daha spesifik ve doğru bilgiler kayıt kuruluşundan temin edilebilir. Bir alan adı için alan adı kayıt kuruluşu ve/veya DNS ad sunucusu sahiplerini belirlemek için `dig` ve `whois` araçları faydalı olabilir (örneğin `whois example.com` veya `dig example.com ns`). Bir Hesabın hizmetimizde ücretli plan mı yoksa ücretsiz plan mı kullandığını DNS kayıt sorgulaması yaparak belirleyebilirsiniz (örneğin `dig example.com mx` ve `dig example.com txt`). MX kayıtları `mx1.forwardemail.net` ve `mx2.forwardemail.net` gibi değerler döndürmüyorsa, alan adı hizmetimizi kullanmıyor demektir. TXT kayıtları düz metin e-posta adresi döndürüyorsa (örneğin `forward-email=user@example.com`), bu alan adı için e-posta yönlendirme adresi hedefini gösterir. Eğer bunun yerine `forward-email-site-verification=XXXXXXXXXX` gibi bir değer dönerse, bu alan adının ücretli planda olduğunu ve yönlendirme yapılandırmasının `XXXXXXXXXX` kimliği altında veritabanımızda saklandığını gösterir. Hizmetimizin DNS düzeyinde nasıl çalıştığı hakkında daha fazla bilgi için lütfen [SSS](/faq) bölümüne bakınız.

### Hangi bilgiler mevcuttur {#what-information-is-available}

Lütfen [Toplanan Bilgiler](/privacy#information-collected) için Gizlilik Politikası bölümümüze bakınız. Hesapların, veri saklama ve gizlilik yasalarına uygun olarak sistemimizden bilgilerini kaldırmalarına izin verilir; [Bilgi Kaldırma](/privacy#information-removal) için Gizlilik Politikası bölümüne bakınız. Bu, talep edilen bilgilerin Hesap silinmesi nedeniyle talep anında mevcut olmayabileceği anlamına gelir.

### Hangi bilgiler mevcut değildir {#what-information-is-not-available}

Lütfen [Toplanmayan Bilgiler](/privacy#information-not-collected) için Gizlilik Politikası bölümümüze bakınız.

### Amerika Birleşik Devletleri merkezli kolluk kuvvetleri {#law-enforcement-based-in-the-united-states}

[Acil durumlar hariç](#law-enforcement-emergency-requests), Hesap bilgilerini yalnızca geçerli bir celp, ECPA ABD mahkeme emri ve/veya arama emri alındığında paylaşırız.

Ayrıca, kanun veya mahkeme emriyle yasaklanmadıkça, bir kolluk kuvveti talebi hakkında [bir Hesabı bilgilendirebiliriz](#law-enforcement-requests-may-trigger-account-notices).

Geçerli bir celp, ECPA mahkeme emri ve/veya arama emri alırsak, ilgili ve mevcut bilgileri elimizden geldiğince sağlarız.

### Amerika Birleşik Devletleri dışındaki kolluk kuvvetleri {#law-enforcement-based-outside-of-the-united-states}

ABD dışındaki kolluk kuvvetleri için taleplerin aşağıdakilerden biri aracılığıyla iletilmesini şart koşarız:

* Birleşik Devletler mahkemesi.
* [Birleşik Devletler karşılıklı adli yardım anlaşması](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT") prosedürleri kapsamında bir yaptırım kurumu.
* ABD Başsavcısının, Kongreye sunduğu ve [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523) gerekliliklerini karşıladığını belirleyip onayladığı yürütme anlaşmasına tabi yabancı hükümetten bir emir.

### Kolluk kuvvetleri acil durum talepleri {#law-enforcement-emergency-requests}

ABD yasalarının izin verdiği ölçüde (örneğin [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)to%20a%20governmental%20entity%2C%20if%20the%20provider%2C%20in%20good%20faith%2C%20believes%20that%20an%20emergency%20involving%20danger%20of%20death%20or%20serious%20physical%20injury%20to%20any%20person%20requires%20disclosure%20without%20delay%20of%20communications%20relating%20to%20the%20emergency%3B%20or) ve [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Exceptions%20for%20Disclosure%20of%20Customer%20Records.%E2%80%94A%20provider%20described%20in%20subsection%20\(a\)%20may%20divulge%20a%20record%20or%20other%20information%20pertaining%20to%20a%20subscriber%20to%20or%20customer%20of%20such%20service%20\(not%20including%20the%20contents%20of%20communications%20covered%20by%20subsection%20\(a\)\(1\)%20or%20\(a\)\(2\)\)%E2%80%94)), talep edenin iyi niyetle ve bağımsız doğrulamasıyla – ölüm veya ciddi fiziksel yaralanmayı önlemek için gecikmeden yapılması gerektiğine inandığımız durumlarda, celp, ECPA mahkeme emri ve/veya arama emri olmadan Hesap bilgilerini kolluk kuvvetleriyle açıklayabilir ve paylaşabiliriz.
Acil veri taleplerinin ("EDR") e-posta yoluyla gönderilmesini ve zamanında ve hızlandırılmış bir süreç sağlamak için tüm ilgili bilgilerin dahil edilmesini talep ediyoruz.

E-postayla yapılan gelişmiş sahtecilik, oltalama ve taklit saldırılarının farkında olduğumuzu unutmayın (örneğin, [The Guardian'dan bu makaleye bakınız](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

EDR işlemlerimizle ilgili politikamız aşağıdaki gibidir:

1. Doğrulama için e-posta başlık meta verilerini (örneğin DKIM/SPF/DMARC) (veya yokluğunu) bağımsız olarak araştırmak.

2. Talebin doğruluğunu teyit etmek amacıyla talepte bulunan kişiyle telefonla bağımsız olarak iletişim kurmak için iyi niyetle en iyi çabayı göstermek (gerekirse tekrar eden denemelerle). Örneğin, talebin geldiği yargı alanıyla ilgili `.gov` web sitesini araştırabilir ve ardından talebi doğrulamak için kamuya açık resmi telefon numarasından ofisi arayabiliriz.

### Kolluk kuvveti talepleri hesap bildirimlerini tetikleyebilir {#law-enforcement-requests-may-trigger-account-notices}

Hukuken veya mahkeme emriyle yasaklanmadığımız sürece (örneğin [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)) bir Hesabı bilgilendirebilir ve onlara kendileriyle ilgili bir kolluk kuvveti talebinin bir kopyasını sağlayabiliriz. Bu durumlarda, geçerliyse, gizlilik emri sona erdiğinde Hesabı bilgilendirebiliriz.

Kolluk kuvvetleri tarafından yapılan bilgi talebi geçerliyse, [gerekli ve talep edilen Hesap bilgilerini koruyacağız](#law-enforcement-requests-to-preserve-information) ve Hesap sahibine kayıtlı ve doğrulanmış e-posta adresi üzerinden makul bir çabayla (örneğin 7 takvim günü içinde) ulaşmaya çalışacağız. Zamanında itiraz (örneğin 7 takvim günü içinde) alırsak, Hesap bilgilerini paylaşmayı erteleyip yasal süreci gerektiği şekilde sürdüreceğiz.

### Bilgi koruma talepleri {#law-enforcement-requests-to-preserve-information}

[18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703) uyarınca, kolluk kuvvetlerinden gelen geçerli bilgi koruma taleplerini yerine getireceğiz. Veri korumasının yalnızca özel olarak talep edilen ve mevcut olan bilgilerle sınırlı olduğunu unutmayın.

### Kolluk kuvveti tebligatı {#law-enforcement-serving-process}

Tüm geçerli kolluk kuvveti taleplerinin, bizimle yazışabileceğimiz ve talep edilen bilgileri elektronik olarak sağlayabileceğimiz geçerli ve işlevsel bir e-posta adresi içermesini talep ediyoruz.

Tüm talepler yukarıda belirtilen [Kötüye kullanım raporu nasıl gönderilir](#how-to-submit-an-abuse-report) bölümündeki e-posta adresine gönderilmelidir.

Tüm kolluk kuvveti talepleri, ajans veya departman antetli kağıdında (örneğin PDF taranmış ek olarak), resmi ve ilgili bir e-posta adresinden ve imzalı olarak gönderilmelidir.

Eğer bu bir [acil talep](#law-enforcement-emergency-requests) ise, lütfen e-postanın Konu başlığına "Acil kolluk kuvveti talebi" yazınız.

Lütfen talebinizi inceleyip yanıtlamamızın en az iki hafta sürebileceğini unutmayınız.
