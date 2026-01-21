# On Yıllık Etki: npm Paketlerimiz 1 Milyar İndirmeye Nasıl Ulaştı ve JavaScript'i Nasıl Şekillendirdi? {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />

## İçindekiler {#table-of-contents}

* [Önsöz](#foreword)
* [Bize Güvenen Öncüler: Isaac Z. Schlueter ve Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [npm'in Oluşturulmasından Node.js Liderliğine](#from-npms-creation-to-nodejs-leadership)
* [Kodun Arkasındaki Mimar: Nick Baugh'un Yolculuğu](#the-architect-behind-the-code-nick-baughs-journey)
  * [Ekspres Teknik Komite ve Temel Katkılar](#express-technical-committee-and-core-contributions)
  * [Koa Çerçeve Katkıları](#koa-framework-contributions)
  * [Bireysel Katkıda Bulunandan Kuruluş Liderine](#from-individual-contributor-to-organization-leader)
* [GitHub Organizasyonlarımız: Yenilik Ekosistemleri](#our-github-organizations-ecosystems-of-innovation)
  * [Kabin: Modern Uygulamalar için Yapılandırılmış Günlük Kaydı](#cabin-structured-logging-for-modern-applications)
  * [Spam Tarayıcı: E-posta İstismarıyla Mücadele](#spam-scanner-fighting-email-abuse)
  * [Bree: İşçi İş Parçacıklarıyla Modern İş Planlaması](#bree-modern-job-scheduling-with-worker-threads)
  * [E-postayı İlet: Açık Kaynaklı E-posta Altyapısı](#forward-email-open-source-email-infrastructure)
  * [Lad: Temel Koa Yardımcı Programları ve Araçları](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Açık Kaynaklı Çalışma Süresi İzleme](#upptime-open-source-uptime-monitoring)
* [İleri E-posta Ekosistemine Katkılarımız](#our-contributions-to-the-forward-email-ecosystem)
  * [Paketlerden Üretime](#from-packages-to-production)
  * [Geri Bildirim Döngüsü](#the-feedback-loop)
* [Forward Email'in Temel İlkeleri: Mükemmelliğin Temeli](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Her Zaman Geliştirici Dostu, Güvenlik Odaklı ve Şeffaf](#always-developer-friendly-security-focused-and-transparent)
  * [Zamanla Test Edilmiş Yazılım Geliştirme İlkelerine Uyum](#adherence-to-time-tested-software-development-principles)
  * [Hırçın, Önyüklemeli Geliştiriciyi Hedefleme](#targeting-the-scrappy-bootstrapped-developer)
  * [Uygulamada İlkeler: İleri E-posta Kod Tabanı](#principles-in-practice-the-forward-email-codebase)
  * [Tasarımda Gizlilik](#privacy-by-design)
  * [Sürdürülebilir Açık Kaynak](#sustainable-open-source)
* [Rakamlar Yalan Söylemez: Şaşırtıcı npm İndirme İstatistiklerimiz](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Etkimizin Kuşbakışı Görünümü](#a-birds-eye-view-of-our-impact)
  * [Ölçekte Günlük Etki](#daily-impact-at-scale)
  * [Ham Sayıların Ötesinde](#beyond-the-raw-numbers)
* [Ekosistemi Desteklemek: Açık Kaynak Sponsorluklarımız](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: E-posta Altyapısı Öncüsü](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Fayda Paketi Beyni](#sindre-sorhus-utility-package-mastermind)
* [JavaScript Ekosistemindeki Güvenlik Açıklarını Ortaya Çıkarma](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Koa-Router Kurtarma](#the-koa-router-rescue)
  * [ReDoS Güvenlik Açıklarının Giderilmesi](#addressing-redos-vulnerabilities)
  * [Node.js ve Chromium Güvenliğini Savunmak](#advocating-for-nodejs-and-chromium-security)
  * [npm Altyapısının Güvenliğini Sağlama](#securing-npm-infrastructure)
* [İleri E-posta Ekosistemine Katkılarımız](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Nodemailer'ın Temel İşlevselliğini Geliştirme](#enhancing-nodemailers-core-functionality)
  * [Mailauth ile E-posta Kimlik Doğrulamasını Geliştirme](#advancing-email-authentication-with-mailauth)
  * [Temel Çalışma Süresi Geliştirmeleri](#key-upptime-enhancements)
* [Her Şeyi Bir Arada Tutturan Tutkal: Ölçekte Özel Kod](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Büyük Bir Geliştirme Çabası](#a-massive-development-effort)
  * [Çekirdek Bağımlılıkların Entegrasyonu](#core-dependencies-integration)
  * [Tangerine ve mx-connect ile DNS Altyapısı](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Kurumsal Etki: Açık Kaynaktan Görev Kritik Çözümlere](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Görev Kritik E-posta Altyapısında Vaka Çalışmaları](#case-studies-in-mission-critical-email-infrastructure)
* [Açık Kaynaklı Bir On Yıl: Geleceğe Bakış](#a-decade-of-open-source-looking-forward)

## Önsöz {#foreword}

[JavaScript](https://en.wikipedia.org/wiki/JavaScript) ve [Node.js](https://en.wikipedia.org/wiki/Node.js) dünyasında, bazı paketler olmazsa olmazdır: Günde milyonlarca kez indirilir ve dünya çapındaki uygulamalara güç verirler. Bu araçların arkasında, açık kaynak kalitesine odaklanmış geliştiriciler var. Bugün, ekibimizin JavaScript ekosisteminin önemli bir parçası haline gelen npm paketlerinin oluşturulmasına ve bakımına nasıl yardımcı olduğunu gösteriyoruz.

## Bize Güvenen Öncüler: Isaac Z. Schlueter ve Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

[Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) kullanıcısını aramızda görmekten gurur duyuyoruz. Isaac, [npm](https://en.wikipedia.org/wiki/Npm_\(software\)'yi oluşturdu ve [Node.js](https://en.wikipedia.org/wiki/Node.js)'ün oluşturulmasına yardımcı oldu. Forward Email'e olan güveni, kalite ve güvenliğe verdiğimiz önemi gösteriyor. Isaac, izs.me de dahil olmak üzere birçok alan adı için Forward Email kullanıyor.

Isaac'ın JavaScript üzerindeki etkisi muazzam. 2009 yılında, platformu oluşturan [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl) ile çalışarak Node.js'nin potansiyelini ilk fark edenlerden biriydi. Isaac'ın [Increment dergisiyle röportaj](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/)'de söylediği gibi: "Sunucu taraflı JS'nin nasıl hayata geçirileceğini anlamaya çalışan bir grup insandan oluşan bu çok küçük topluluğun ortasında, Ryan Dahl, Node'u ortaya çıkardı ve bu kesinlikle doğru yaklaşımdı. Ben de tüm gücümle bu işe giriştim ve 2009'un ortalarında sürece dahil oldum."

> \[!NOTE]
> Node.js'nin geçmişiyle ilgilenenler için, [Node.js'nin Hikayesi](https://www.youtube.com/watch?v=LB8KwiiUGy0) ve [Node.js Hakkında Pişman Olduğum 10 Şey - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I) gibi gelişimini anlatan mükemmel belgeseller mevcuttur. Ryan Dahl'ın [kişisel web sitesi](https://tinyclouds.org/) adlı belgeseli de çalışmalarına dair değerli bilgiler içermektedir.

### npm'nin Oluşturulmasından Node.js Liderliğine {#from-npms-creation-to-nodejs-leadership}

Isaac, npm'i Eylül 2009'da oluşturdu ve ilk kullanılabilir sürümü 2010 başlarında yayınlandı. Bu paket yöneticisi, Node.js'deki önemli bir ihtiyacı karşılayarak geliştiricilerin kodu kolayca paylaşmasına ve yeniden kullanmasına olanak tanıdı. [Node.js Wikipedia sayfası](https://en.wikipedia.org/wiki/Node.js)'a göre, "Ocak 2010'da, Node.js ortamı için npm adlı bir paket yöneticisi tanıtıldı. Paket yöneticisi, programcıların Node.js paketlerini ve bunlara eşlik eden kaynak kodlarını yayınlamasına ve paylaşmasına olanak tanır ve paketlerin kurulumunu, güncellenmesini ve kaldırılmasını basitleştirmek üzere tasarlanmıştır."

Ryan Dahl, Ocak 2012'de Node.js'den ayrıldığında, Isaac proje liderliğini devraldı. [özeti](https://izs.me/resume)'da belirtildiği gibi, "CommonJS modül sistemi, dosya sistemi API'leri ve akışlar dahil olmak üzere birçok temel Node.js çekirdek API'sinin geliştirilmesine öncülük etti" ve "2 yıl boyunca projenin BDFL'si (Ömür Boyu Hayırsever Diktatör) olarak görev yaptı ve Node.js'nin v0.6'dan v0.10'a kadar olan sürümleri için sürekli artan kalite ve güvenilir bir derleme süreci sağladı."

Isaac, Node.js'i önemli bir büyüme döneminde yönlendirerek, bugün hala platformu şekillendiren standartları belirledi. Daha sonra, daha önce kendi başına çalıştırdığı npm kayıt defterini desteklemek için 2014 yılında npm, Inc.'i kurdu.

JavaScript'e yaptığı büyük katkılardan dolayı Isaac'e teşekkür ediyor ve onun oluşturduğu birçok paketi kullanmaya devam ediyoruz. Çalışmaları, yazılım geliştirme biçimimizi ve dünya çapında milyonlarca geliştiricinin kod paylaşma biçimini değiştirdi.

## Kodun Arkasındaki Mimar: Nick Baugh'un Yolculuğu {#the-architect-behind-the-code-nick-baughs-journey}

Açık kaynak başarımızın merkezinde, Forward Email'in kurucusu ve sahibi Nick Baugh yer alıyor. JavaScript alanındaki çalışmaları yaklaşık 20 yılı kapsıyor ve sayısız geliştiricinin uygulama geliştirme biçimini şekillendirdi. Açık kaynak yolculuğu, hem teknik becerilerini hem de topluluk liderliğini ortaya koyuyor.

### Teknik Komite ve Temel Katkılar {#express-technical-committee-and-core-contributions}

Nick'in web framework uzmanlığı, ona [Ekspres Teknik Komitesi](https://expressjs.com/en/resources/community.html)'da yer kazandırdı ve burada en çok kullanılan Node.js framework'lerinden birine yardımcı oldu. Nick artık [Express topluluk sayfası](https://expressjs.com/en/resources/community.html)'de etkin olmayan üye olarak listeleniyor.

> \[!IMPORTANT]
> Express, Node.js ekosisteminin büyük bir kısmını şekillendirmiş, üretken bir açık kaynak geliştiricisi olan TJ Holowaychuk tarafından oluşturuldu. TJ'nin temel çalışmaları için minnettarız ve kapsamlı açık kaynak katkılarından dolayı [ara verme kararı](https://news.ycombinator.com/item?id=37687017)'ine saygı duyuyoruz.

[Ekspres Teknik Komitesi](https://expressjs.com/en/resources/community.html) üyesi olarak Nick, `req.originalUrl` belgelerinin açıklığa kavuşturulması ve çok parçalı form işleme sorunlarının giderilmesi gibi konularda ayrıntılara büyük önem verdi.

### Koa Çerçeve Katkıları {#koa-framework-contributions}

Nick'in, yine TJ Holowaychuk tarafından geliştirilen, Express'e modern ve daha hafif bir alternatif olan [Koa çerçevesi](https://github.com/koajs/koa) ile yaptığı çalışma, daha iyi web geliştirme araçlarına olan bağlılığını daha da ortaya koyuyor. Koa'ya katkıları arasında hem sorunlar hem de çekme istekleri aracılığıyla kod geliştirme, hata yönetimi, içerik türü yönetimi ve dokümantasyon iyileştirmeleri yer alıyor.

Hem Express hem de Koa'daki çalışmaları, Node.js web geliştirme konusunda ona benzersiz bir bakış açısı kazandırıyor ve ekibimizin birden fazla çerçeve ekosistemiyle uyumlu çalışan paketler oluşturmasına yardımcı oluyor.

### Bireysel Katkıda Bulunandan Kuruluş Liderine {#from-individual-contributor-to-organization-leader}

Mevcut projelere yardım etmekle başlayan süreç, kapsamlı paket ekosistemleri oluşturup sürdürmeye dönüştü. Nick, [Kabin](https://github.com/cabinjs), [Spam Tarayıcı](https://github.com/spamscanner), [E-postayı İlet](https://github.com/forwardemail), [Delikanlı](https://github.com/ladjs) ve [Bree](https://github.com/breejs) dahil olmak üzere birden fazla GitHub kuruluşu kurdu ve bunların her biri JavaScript topluluğunun belirli ihtiyaçlarını karşıladı.

Katkıda bulunandan lidere geçiş, Nick'in gerçek sorunları çözen, iyi tasarlanmış yazılım vizyonunu ortaya koyuyor. İlgili paketleri odaklanmış GitHub organizasyonları altında düzenleyerek, daha geniş geliştirici topluluğu için modüler ve esnek kalırken birlikte çalışan araç ekosistemleri oluşturdu.

## GitHub Kuruluşlarımız: Yenilik Ekosistemleri {#our-github-organizations-ecosystems-of-innovation}

Açık kaynak çalışmalarımızı, her biri JavaScript'teki belirli ihtiyaçları çözen, odaklanmış GitHub organizasyonları etrafında düzenliyoruz. Bu yapı, modüler kalırken birlikte iyi çalışan, uyumlu paket aileleri oluşturur.

### Kabin: Modern Uygulamalar için Yapılandırılmış Günlük Kaydı {#cabin-structured-logging-for-modern-applications}

[Kabin organizasyonu](https://github.com/cabinjs), basit ve güçlü uygulama günlüğü oluşturma konusundaki yaklaşımımızdır. Ana [`cabin`](https://github.com/cabinjs/cabin) paketi yaklaşık 900 GitHub yıldızına ve 100.000'den fazla haftalık indirmeye sahiptir. Cabin, Sentry, LogDNA ve Papertrail gibi popüler hizmetlerle çalışan yapılandırılmış günlük kaydı sağlar.

Cabin'i özel kılan şey, özenli API ve eklenti sistemidir. Express ara yazılımı için [`axe`](https://github.com/cabinjs/axe) ve HTTP istek ayrıştırma için [`parse-request`](https://github.com/cabinjs/parse-request) gibi paketleri desteklemek, izole araçlar yerine eksiksiz çözümlere olan bağlılığımızı göstermektedir.

[`bson-objectid`](https://github.com/cabinjs/bson-objectid) paketi, yalnızca iki ayda 1,7 milyondan fazla indirilerek özel bir ilgiyi hak ediyor. Bu hafif MongoDB ObjectID uygulaması, tam MongoDB bağımlılıkları olmadan kimliklere ihtiyaç duyan geliştiriciler için vazgeçilmez hale geldi.

### Spam Tarayıcısı: E-posta Kötüye Kullanımıyla Mücadele {#spam-scanner-fighting-email-abuse}

[Spam Tarayıcı organizasyonu](https://github.com/spamscanner), gerçek sorunları çözme konusundaki kararlılığımızı gösteriyor. Ana [`spamscanner`](https://github.com/spamscanner/spamscanner) paketi gelişmiş e-posta spam tespiti sağlıyor, ancak en çok benimsenen paket [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) paketi oldu.

İki ayda 1,2 milyondan fazla indirilen `url-regex-safe`, diğer URL algılama düzenli ifadelerindeki kritik güvenlik sorunlarını gideriyor. Bu paket, açık kaynak kodlu yazılımlara yaklaşımımızı gösteriyor: yaygın bir sorunu (bu durumda, URL doğrulamasındaki [RedoS](https://en.wikipedia.org/wiki/ReDoS) güvenlik açıklarını) bulmak, sağlam bir çözüm oluşturmak ve bunu dikkatlice sürdürmek.

### Bree: İşçi İş Parçacıklarıyla Modern İş Planlaması {#bree-modern-job-scheduling-with-worker-threads}

[Bree organizasyonu](https://github.com/breejs), Node.js'in yaygın bir sorunu olan güvenilir iş planlamasına verdiğimiz yanıttır. 3.100'den fazla GitHub yıldızına sahip ana [`bree`](https://github.com/breejs/bree) paketi, daha iyi performans ve güvenilirlik için Node.js çalışan iş parçacıklarını kullanan modern bir iş planlayıcısı sağlar.

> \[!NOTE]
> Bree, [Gündem](https://github.com/agenda/agenda)'in bakımına yardımcı olduktan ve edinilen dersleri daha iyi bir iş planlayıcısı oluşturmak için kullandıktan sonra oluşturuldu. Agenda katkılarımız, iş planlamasını iyileştirmenin yollarını bulmamıza yardımcı oldu.

Bree'yi Agenda gibi diğer planlayıcılardan farklı kılan nedir?

* **Harici Bağımlılık Yok**: MongoDB gerektiren Agenda'nın aksine, Bree iş durumunu yönetmek için Redis veya MongoDB'ye ihtiyaç duymaz.
* **Çalışan İş Parçacıkları**: Bree, korumalı süreçler için Node.js çalışan iş parçacıklarını kullanarak daha iyi izolasyon ve performans sağlar.
* **Basit API**: Bree, karmaşık zamanlama ihtiyaçlarının uygulanmasını kolaylaştırarak ayrıntılı kontrolü basit bir şekilde sunar.
* **Yerleşik Destek**: Sorunsuz yeniden yükleme, cron işleri, tarihler ve kullanıcı dostu zamanlar gibi özellikler varsayılan olarak dahildir.

Bree, e-posta işleme, temizleme ve planlı bakım gibi kritik arka plan görevlerini yöneten [forwardemail.net](https://github.com/forwardemail/forwardemail.net)'ın önemli bir parçasıdır. Bree'yi Forward Email'da kullanmak, üretimde kendi araçlarımızı kullanma ve yüksek güvenilirlik standartlarını karşılama konusundaki kararlılığımızı göstermektedir.

[havuz](https://github.com/piscinajs/piscina) gibi diğer harika çalışan iş parçacığı paketlerini ve [on bir](https://github.com/nodejs/undici) gibi HTTP istemcilerini de kullanıyor ve takdir ediyoruz. Bree gibi Piscina da verimli görev işleme için Node.js çalışan iş parçacıklarını kullanıyor. Hem Undicici hem de Piscina'yı yöneten [Matthew Hill](https://github.com/mcollina)'ye Node.js'ye yaptığı önemli katkılardan dolayı teşekkür ederiz. Matteo, Node.js Teknik Yönlendirme Komitesi'nde görev yapıyor ve Node.js'deki HTTP istemci yeteneklerini önemli ölçüde geliştirdi.

### E-postayı İlet: Açık Kaynaklı E-posta Altyapısı {#forward-email-open-source-email-infrastructure}

En iddialı projemiz, e-posta yönlendirme, depolama ve API hizmetleri sunan açık kaynaklı bir e-posta hizmeti olan [E-postayı İlet](https://github.com/forwardemail)'dır. Ana depoda 1.100'den fazla GitHub yıldızı bulunmaktadır\[^4] ve bu, özel e-posta hizmetlerine alternatif olarak topluluğun takdirini göstermektedir.

Bu kuruluşun [`preview-email`](https://github.com/forwardemail/preview-email) paketi, iki ayda 2,5 milyondan fazla indirilerek, e-posta şablonlarıyla çalışan geliştiriciler için vazgeçilmez bir araç haline geldi. Geliştirme sırasında e-postaları önizlemenin basit bir yolunu sunarak, e-posta özellikli uygulamalar oluştururken karşılaşılan yaygın bir sorunu çözüyor.

### Lad: Temel Koa Yardımcı Programları ve Araçları {#lad-essential-koa-utilities-and-tools}

[Delikanlı örgütü](https://github.com/ladjs), öncelikle Koa çerçeve ekosistemini geliştirmeye odaklanan temel yardımcı program ve araçlardan oluşan bir koleksiyon sunar. Bu paketler, web geliştirmedeki yaygın zorlukları çözer ve bağımsız olarak kullanışlı kalırken sorunsuz bir şekilde birlikte çalışacak şekilde tasarlanmıştır.

#### koa-better-error-handler: Koa {#koa-better-error-handler-improved-error-handling-for-koa} için Geliştirilmiş Hata İşleme

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler), Koa uygulamaları için daha iyi bir hata işleme çözümü sunar. 50'den fazla GitHub yıldızına sahip olan bu paket, `ctx.throw`'in kullanıcı dostu hata mesajları üretmesini sağlarken, Koa'nın yerleşik hata işleyicisinin çeşitli sınırlamalarını da ele alır:

* Node.js DNS hatalarını, Mongoose hatalarını ve Redis hatalarını algılar ve düzgün bir şekilde işler
* Tutarlı ve iyi biçimlendirilmiş hata yanıtları oluşturmak için [Patlama](https://github.com/hapijs/boom) kullanır
* Başlıkları korur (Koa'nın yerleşik işleyicisinin aksine)
* Varsayılan olarak 500 yerine uygun durum kodlarını korur
* Flash mesajları ve oturum korumasını destekler
* Doğrulama hataları için HTML hata listeleri sağlar
* Birden fazla yanıt türünü destekler (HTML, JSON ve düz metin)

Bu paket, Koa uygulamalarında kapsamlı hata yönetimi için [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) ile birlikte kullanıldığında özellikle değerlidir.

#### pasaportu: Lad {#passport-authentication-for-lad} için kimlik doğrulaması

[`@ladjs/passport`](https://github.com/ladjs/passport), popüler Passport.js kimlik doğrulama ara yazılımını modern web uygulamalarına özel geliştirmelerle genişletir. Bu paket, kullanıma hazır birden fazla kimlik doğrulama stratejisini destekler:

* E-posta ile yerel kimlik doğrulama
* Apple ile oturum açma
* GitHub kimlik doğrulaması
* Google kimlik doğrulaması
* Tek seferlik parola (OTP) kimlik doğrulaması

Paket, geliştiricilerin alan adlarını ve ifadeleri uygulamalarının gereksinimlerine uyacak şekilde ayarlamalarına olanak tanıyan son derece özelleştirilebilir bir yapıya sahiptir. Kullanıcı yönetimi için Mongoose ile sorunsuz bir şekilde entegre olacak şekilde tasarlanmıştır ve bu da onu, güçlü kimlik doğrulaması gerektiren Koa tabanlı uygulamalar için ideal bir çözüm haline getirir.

#### zarif: Zarif Uygulama Kapatma {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful), Node.js uygulamalarını sorunsuz bir şekilde kapatma gibi kritik bir sorunu çözer. 70'ten fazla GitHub yıldızına sahip bu paket, uygulamanızın veri kaybı yaşamadan veya bağlantıları askıda bırakmadan temiz bir şekilde sonlandırılmasını sağlar. Temel özellikleri şunlardır:

* HTTP sunucularını (Express/Koa/Fastify) düzgün bir şekilde kapatma desteği
* Veritabanı bağlantılarının (MongoDB/Mongoose) temiz bir şekilde kapatılması
* Redis istemcilerinin düzgün bir şekilde kapatılması
* Bree iş zamanlayıcılarının yönetilmesi
* Özel kapatma işleyicileri desteği
* Yapılandırılabilir zaman aşımı ayarları
* Günlük sistemleriyle entegrasyon

Bu paket, beklenmedik kapanmaların veri kaybına veya bozulmasına yol açabileceği üretim uygulamaları için olmazsa olmazdır. Doğru kapatma prosedürlerini uygulayarak, `@ladjs/graceful` uygulamanızın güvenilirliğini ve kararlılığını sağlamaya yardımcı olur.

### Upptime: Açık Kaynaklı Uptime İzleme {#upptime-open-source-uptime-monitoring}

[Upptime organizasyonu](https://github.com/upptime), şeffaf ve açık kaynaklı izleme konusundaki kararlılığımızı temsil eder. Ana [`upptime`](https://github.com/upptime/upptime) deposu 13.000'den fazla GitHub yıldızına sahiptir ve bu da onu katkıda bulunduğumuz en popüler projelerden biri yapar. Upptime, tamamen sunucu olmadan çalışan, GitHub destekli bir çalışma süresi izleme ve durum sayfası sağlar.

<https://status.forwardemail.net> adresindeki kendi durum sayfamız için Upptime'ı kullanıyoruz ve kaynak kodu <https://github.com/forwardemail/status.forwardemail.net>. adresinde mevcuttur

Upptime'ı özel kılan şey mimarisidir:

* **%100 Açık Kaynak**: Her bileşen tamamen açık kaynaklıdır ve özelleştirilebilir.
* **GitHub Destekli**: Sunucusuz bir izleme çözümü için GitHub Eylemleri, Sorunları ve Sayfaları'ndan yararlanır.
* **Sunucu Gerektirmez**: Geleneksel izleme araçlarının aksine, Upptime bir sunucu çalıştırmanızı veya sürdürmenizi gerektirmez.
* **Otomatik Durum Sayfası**: GitHub Sayfaları'nda barındırılabilen güzel bir durum sayfası oluşturur.
* **Güçlü Bildirimler**: E-posta, SMS ve Slack dahil olmak üzere çeşitli bildirim kanallarıyla entegre olur.

Kullanıcılarımızın deneyimini geliştirmek için, gerçek zamanlı durum güncellemelerini ve olayları doğrudan web sitemizde sunmak üzere [@octokit/çekirdek](https://github.com/octokit/core.js/)'ı forwardemail.net kod tabanına entegre ettik. Bu entegrasyon, tüm yığınımızda (Web Sitesi, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree vb.) herhangi bir sorun olması durumunda kullanıcılarımıza anında bildirimler, rozet simgesi değişiklikleri, uyarı renkleri ve daha fazlasıyla net bir şeffaflık sağlar.

@octokit/core kütüphanesi, Upptime GitHub havuzumuzdan gerçek zamanlı verileri almamızı, işlememizi ve kullanıcı dostu bir şekilde görüntülememizi sağlar. Herhangi bir hizmette kesinti veya performans düşüşü yaşandığında, kullanıcılar ana uygulamadan ayrılmalarına gerek kalmadan görsel göstergeler aracılığıyla anında bilgilendirilir. Bu kusursuz entegrasyon, kullanıcılarımızın sistem durumumuz hakkında her zaman güncel bilgilere sahip olmasını sağlayarak şeffaflığı ve güveni artırır.

Upptime, hizmetlerini izlemek ve durumu kullanıcılara iletmek için şeffaf ve güvenilir bir yol arayan yüzlerce kuruluş tarafından benimsenmiştir. Projenin başarısı, yaygın sorunları yeni yollarla çözmek için mevcut altyapıyı (bu durumda GitHub) kullanan araçlar geliştirmenin gücünü göstermektedir.

## İleri E-posta Ekosistemine Katkılarımız {#our-contributions-to-the-forward-email-ecosystem}

Açık kaynaklı paketlerimiz dünya çapındaki geliştiriciler tarafından kullanılırken, aynı zamanda kendi Forward Email hizmetimizin de temelini oluşturmaktadır. Bu araçların hem yaratıcısı hem de kullanıcısı olarak üstlendiğimiz bu ikili rol, bize gerçek dünyadaki uygulamalarına benzersiz bir bakış açısı kazandırıyor ve sürekli iyileştirmeyi teşvik ediyor.

### Paketlerden Üretime {#from-packages-to-production}

Bireysel paketlerden bütünleşik bir üretim sistemine geçiş, dikkatli bir entegrasyon ve genişletme süreci gerektirir. Forward Email için bu süreç şunları içerir:

* **Özel Uzantılar**: Benzersiz gereksinimlerimizi karşılayan açık kaynaklı paketlerimize e-postaya özgü uzantılar ekleme.
* **Entegrasyon Modelleri**: Bu paketlerin üretim ortamında nasıl etkileşime gireceğine dair modeller geliştirme.
* **Performans Optimizasyonları**: Yalnızca ölçeklenebilirlik düzeyinde ortaya çıkan performans darboğazlarını belirleme ve giderme.
* **Güvenlik Güçlendirmesi**: E-posta yönetimi ve kullanıcı verilerinin korunmasına özgü ek güvenlik katmanları ekleme.

Bu çalışma, temel paketlerin ötesinde binlerce saatlik bir geliştirmeyi temsil ediyor ve açık kaynaklı katkılarımızın en iyilerinden yararlanan sağlam ve güvenli bir e-posta hizmetiyle sonuçlanıyor.

### Geri Bildirim Döngüsü {#the-feedback-loop}

Üretimde kendi paketlerimizi kullanmanın belki de en değerli yanı, yarattığı geri bildirim döngüsüdür. Forward Email'de sınırlamalar veya uç durumlarla karşılaştığımızda, bunları yalnızca yerel olarak düzeltmekle kalmıyor, aynı zamanda temel paketleri de iyileştirerek hem hizmetimize hem de daha geniş topluluğa fayda sağlıyoruz.

Bu yaklaşım çok sayıda iyileştirmeye yol açtı:

* **Bree'nin Zarif Kapatılması**: Forward Email'in sıfır kesinti süresiyle dağıtım ihtiyacı, Bree'de gelişmiş zarif kapatma yeteneklerine yol açtı.
* **Spam Tarayıcısının Desen Tanıma**: Forward Email'de karşılaşılan gerçek dünya spam desenleri, Spam Tarayıcısının tespit algoritmalarını bilgilendirdi.
* **Cabin'in Performans Optimizasyonları**: Üretimde yüksek hacimli günlük kaydı, Cabin'de tüm kullanıcılara fayda sağlayan optimizasyon fırsatlarını ortaya çıkardı.

Açık kaynaklı çalışmalarımız ile üretim hizmetimiz arasındaki bu erdemli döngüyü koruyarak, paketlerimizin teorik uygulamalar yerine pratik, savaşta test edilmiş çözümler olarak kalmasını sağlıyoruz.

## E-posta İletmenin Temel İlkeleri: Mükemmellik İçin Bir Temel {#forward-emails-core-principles-a-foundation-for-excellence}

E-postayı İlet, tüm geliştirme kararlarımıza rehberlik eden bir dizi temel ilkeye göre tasarlanmıştır. [web sitesi](/blog/docs/best-quantum-safe-encrypted-email-service#principles)'da ayrıntılı olarak açıklanan bu ilkeler, hizmetimizin geliştirici dostu, güvenli ve kullanıcı gizliliğine odaklı kalmasını sağlar.

### Her Zaman Geliştirici Dostu, Güvenlik Odaklı ve Şeffaf {#always-developer-friendly-security-focused-and-transparent}

İlk ve en önemli ilkemiz, en yüksek güvenlik ve gizlilik standartlarını korurken geliştirici dostu yazılımlar oluşturmaktır. Teknik mükemmelliğin asla kullanılabilirlikten ödün verilmesi gerektiğine ve şeffaflığın topluluğumuzla güven inşa ettiğine inanıyoruz.

Bu ilke, ayrıntılı dokümantasyonumuzda, net hata mesajlarımızda ve hem başarılar hem de zorluklar hakkında açık iletişimimizde kendini göstermektedir. Tüm kod tabanımızı açık kaynaklı hale getirerek, hem yazılımımızı hem de daha geniş ekosistemi güçlendirerek, inceleme ve iş birliğini teşvik ediyoruz.

### Zamanla Test Edilmiş Yazılım Geliştirme İlkelerine Uyum {#adherence-to-time-tested-software-development-principles}

Onlarca yıldır değerlerini kanıtlamış, yerleşik yazılım geliştirme prensiplerini takip ediyoruz:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Model-Görünüm-Denetleyici örüntüsüyle endişeleri ayırma
* **[Unix Felsefesi](https://en.wikipedia.org/wiki/Unix_philosophy)**: Tek bir işi iyi yapan modüler bileşenler oluşturma
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Basit ve Anlaşılır Tutma
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Kendini Tekrarlama, kod yeniden kullanımını teşvik etme
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Buna İhtiyacınız Olmayacak, erken optimizasyondan kaçınma
* **[On İki Faktör](https://12factor.net/)**: Modern, ölçeklenebilir uygulamalar oluşturmak için en iyi uygulamaları takip etme
* **[Occam'ın usturası](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Gereksinimleri karşılayan en basit çözümü seçme
* **[Köpek Maması](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Kendi ürünlerimizi kapsamlı bir şekilde kullanma

Bu ilkeler yalnızca teorik kavramlar değil; günlük geliştirme uygulamalarımızın ayrılmaz bir parçası. Örneğin, Unix felsefesine bağlılığımız, npm paketlerimizi yapılandırma biçimimizde açıkça görülüyor: karmaşık sorunları çözmek için bir araya getirilebilen küçük, odaklanmış modüller.

### Zorlu, Önyüklemeli Geliştiriciyi Hedefliyor {#targeting-the-scrappy-bootstrapped-developer}

Özellikle hırslı, kendi kendine yeten ve [ramen-kârlı](https://www.paulgraham.com/ramenprofitable.html) geliştiricilerini hedefliyoruz. Bu odaklanma, fiyatlandırma modelimizden teknik kararlarımıza kadar her şeyi şekillendiriyor. Sınırlı kaynaklarla ürün geliştirmenin zorluklarını anlıyoruz çünkü biz de aynı şeyleri yaşadık.

Bu ilke, açık kaynak yaklaşımımızda özellikle önemlidir. Kurumsal bütçeleri olmayan geliştiriciler için gerçek sorunları çözen paketler oluşturuyor ve sürdürüyor, güçlü araçları kaynakları ne olursa olsun herkesin erişimine sunuyoruz.

### Uygulamada İlkeler: Yönlendirme E-posta Kod Tabanı {#principles-in-practice-the-forward-email-codebase}

Bu ilkeler, Forward Email kod tabanında açıkça görülebilir. package.json dosyamız, her biri temel değerlerimizle uyumlu olacak şekilde seçilmiş, özenle seçilmiş bağımlılıkları ortaya koyuyor:

* E-posta kimlik doğrulaması için `mailauth` gibi güvenlik odaklı paketler
* Daha kolay hata ayıklama için `preview-email` gibi geliştirici dostu araçlar
* Sindre Sorhus'un çeşitli `p-*` yardımcı programları gibi modüler bileşenler

Bu prensipleri zaman içinde tutarlı bir şekilde uygulayarak, geliştiricilerin e-posta altyapılarına güvenebilecekleri, güvenli, güvenilir ve açık kaynak topluluğunun değerleriyle uyumlu bir hizmet oluşturduk.

### Tasarıma Göre Gizlilik {#privacy-by-design}

Gizlilik, Forward Email için sonradan akla gelen bir şey veya pazarlama özelliği değildir; hizmetimizin ve kodumuzun her yönünü bilgilendiren temel bir tasarım ilkesidir:

* **Sıfır Erişimli Şifreleme**: Kullanıcıların e-postalarını okumamızı teknik olarak imkansız kılan sistemler uyguladık.
* **Minimum Veri Toplama**: Hizmetimizi sunmak için yalnızca gerekli verileri topluyoruz, daha fazlasını değil.
* **Şeffaf Politikalar**: Gizlilik politikamız, hukuki jargon içermeyen açık ve anlaşılır bir dille yazılmıştır.
* **Açık Kaynak Doğrulaması**: Açık kaynak kod tabanımız, güvenlik araştırmacılarının gizlilik iddialarımızı doğrulamalarına olanak tanır.

Bu taahhüt, baştan sona güvenlik ve gizlilik en iyi uygulamalarıyla tasarlanmış açık kaynaklı paketlerimize de uzanıyor.

### Sürdürülebilir Açık Kaynak {#sustainable-open-source}

Açık kaynaklı yazılımların uzun vadede başarılı olabilmesi için sürdürülebilir modellere ihtiyaç duyduğuna inanıyoruz. Yaklaşımımız şunları içerir:

* **Ticari Destek**: Açık kaynaklı araçlarımız için birinci sınıf destek ve hizmetler sunuyoruz.
* **Dengeli Lisanslama**: Hem kullanıcı özgürlüklerini hem de proje sürdürülebilirliğini koruyan lisanslar kullanıyoruz.
* **Topluluk Katılımı**: Destekleyici bir topluluk oluşturmak için katkıda bulunanlarla aktif olarak etkileşim kuruyoruz.
* **Şeffaf Yol Haritaları**: Kullanıcıların buna göre plan yapabilmelerini sağlamak için geliştirme planlarımızı paylaşıyoruz.

Sürdürülebilirliğe odaklanarak, açık kaynaklı katkılarımızın ihmal edilmek yerine zaman içinde büyümeye ve gelişmeye devam etmesini sağlıyoruz.

## Rakamlar Yalan Söylemez: Şaşırtıcı npm İndirme İstatistiklerimiz {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Açık kaynaklı yazılımların etkisinden bahsettiğimizde, indirme istatistikleri benimsenme ve güven konusunda somut bir ölçüt sunar. Bakımını üstlendiğimiz paketlerin çoğu, çok az açık kaynaklı projenin ulaşabildiği bir ölçeğe ulaşmış ve toplam indirme sayıları milyarları bulmuştur.

![İndirmelere Göre En İyi npm Paketleri](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> JavaScript ekosistemindeki çok indirilen birkaç paketin devamlılığını sağlamaktan gurur duysak da, bu paketlerin çoğunun aslında başka yetenekli geliştiriciler tarafından oluşturulduğunu belirtmek isteriz. Superagent ve supertest gibi paketler, açık kaynaklı yazılımlara yaptığı verimli katkılarla Node.js ekosisteminin şekillenmesinde etkili olan TJ Holowaychuk tarafından oluşturulmuştur.

### Etkimizin Kuşbakışı Görünümü {#a-birds-eye-view-of-our-impact}

Sadece Şubat-Mart 2025 arasındaki iki aylık dönemde, katkıda bulunduğumuz ve kaydedilen şaşırtıcı indirme sayılarını korumaya yardımcı olduğumuz en iyi paketler:

* **[süper ajan](https://www.npmjs.com/package/superagent)**: 84.575.829 indirme\[^7] (ilk olarak TJ Holowaychuk tarafından oluşturuldu)
* **[süper test](https://www.npmjs.com/package/supertest)**: 76.432.591 indirme\[^8] (ilk olarak TJ Holowaychuk tarafından oluşturuldu)
* **[Ayrıca](https://www.npmjs.com/package/koa)**: 28.539.295 indirme\[^34] (ilk olarak TJ Holowaychuk tarafından oluşturuldu)
* **[@koa/yönlendirici](https://www.npmjs.com/package/@koa/router)**: 11.007.327 indirme\[^35]
* **[koa-yönlendirici](https://www.npmjs.com/package/koa-router)**: 3.498.918 indirme\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2.819.520 indirme\[^37]
* **[önizleme e-postası](https://www.npmjs.com/package/preview-email)**: 2.500.000 indirme\[^9]
* **[kabin](https://www.npmjs.com/package/cabin)**: 1.800.000 indirme\[^10]
* **[@breejs/daha sonra](https://www.npmjs.com/package/@breejs/later)**: 1.709.938 indirme\[^38]
* **[e-posta şablonları](https://www.npmjs.com/package/email-templates)**: 1.128.139 indirme\[^39]
* **__PROTECTED_LINK_259__0**: 1.124.686 indirme\[^40]
* **__PROTECTED_LINK_259__1**: 1.200.000 indirme\[^11]
* **__PROTECTED_LINK_259__2**: 894.666 indirme\[^41]
* **__PROTECTED_LINK_259__3**: 839.585 indirme\[^42]
* **__PROTECTED_LINK_259__4**: 145.000 indirme\[^12]
* **__PROTECTED_LINK_259__5**: 24.270 indirme\[^30]

> \[!NOTE]
> Bakımına yardımcı olduğumuz ancak oluşturmadığımız diğer bazı paketlerin indirme sayıları daha da yüksek. Bunlar arasında `form-data` (738 milyondan fazla indirme), `toidentifier` (309 milyondan fazla indirme), `stackframe` (116 milyondan fazla indirme) ve `error-stack-parser` (113 milyondan fazla indirme) bulunuyor. Bu paketlere, orijinal yazarlarının çalışmalarına saygı göstererek katkıda bulunmaktan onur duyuyoruz.

Bunlar yalnızca etkileyici rakamlar değil; aynı zamanda bakımına yardımcı olduğumuz kodlarla gerçek sorunları çözen gerçek geliştiricileri temsil ediyor. Her indirme, bu paketlerin birinin hobi projelerinden milyonlarca kişi tarafından kullanılan kurumsal uygulamalara kadar anlamlı bir şey oluşturmasına yardımcı olduğunun bir örneğidir.

![Paket Kategorileri Dağıtımı](/img/art/category_pie_chart.svg)

### Ölçekte Günlük Etki {#daily-impact-at-scale}

Günlük indirme kalıpları, günde milyonlarca indirmeye ulaşan zirvelerle tutarlı ve yüksek hacimli bir kullanım ortaya koyuyor. Bu tutarlılık, bu paketlerin kararlılığını ve güvenilirliğini gösteriyor; geliştiriciler bunları yalnızca denemekle kalmıyor, aynı zamanda temel iş akışlarına entegre ediyor ve her gün bunlara bağımlı kalıyorlar.

Haftalık indirme kalıpları daha da etkileyici sayılar gösteriyor ve haftada sürekli olarak on milyonlarca indirme civarında seyrediyor. Bu, JavaScript ekosisteminde devasa bir ayak izini temsil ediyor ve bu paketler dünya genelindeki üretim ortamlarında çalışıyor.

### Ham Sayıların Ötesinde {#beyond-the-raw-numbers}

İndirme istatistikleri tek başına etkileyici olsa da, topluluğun bu paketlere duyduğu güven hakkında daha derin bir hikaye anlatıyor. Paketleri bu ölçekte sürdürmek, şu konularda sarsılmaz bir bağlılık gerektirir:

* **Geriye Dönük Uyumluluk**: Mevcut uygulamaları bozmamak için değişiklikler dikkatlice değerlendirilmelidir.
* **Güvenlik**: Milyonlarca uygulama bu paketlere bağlı olduğundan, güvenlik açıkları geniş kapsamlı sonuçlara yol açabilir.
* **Performans**: Bu ölçekte, küçük performans iyileştirmeleri bile önemli toplu faydalar sağlayabilir.
* **Dokümantasyon**: Her deneyim seviyesindeki geliştirici tarafından kullanılan paketler için açık ve kapsamlı dokümantasyon şarttır.

Zaman içinde indirme sayılarındaki istikrarlı büyüme, bu taahhütlerin yerine getirilmesindeki başarıyı ve güvenilir, iyi yönetilen paketler aracılığıyla geliştirici topluluğuyla güven oluşturulmasını yansıtıyor.

## Ekosistemi Desteklemek: Açık Kaynak Sponsorluklarımız {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Açık kaynaklı sürdürülebilirlik yalnızca kod katkısı sağlamakla ilgili değil; aynı zamanda kritik altyapıyı sürdüren geliştiricileri desteklemekle de ilgilidir.

JavaScript ekosistemine doğrudan katkılarımızın yanı sıra, çalışmaları birçok modern uygulamanın temelini oluşturan önemli Node.js katılımcılarına sponsor olmaktan gurur duyuyoruz. Sponsorluklarımız şunları içerir:

### Andris Reinman: E-posta Altyapısı Öncüsü {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9), haftalık 14 milyondan fazla indirmeyle Node.js için en popüler e-posta gönderme kütüphanesi olan [Nodemailer](https://github.com/nodemailer/nodemailer)'in yaratıcısıdır. Çalışmaları, [SMTP Sunucusu](https://github.com/nodemailer/smtp-server), [Posta ayrıştırıcısı](https://github.com/nodemailer/mailparser) ve [Vahşi Ördek](https://github.com/nodemailer/wildduck) gibi diğer kritik e-posta altyapısı bileşenlerini de kapsamaktadır.

Sponsorluğumuz, kendi Forward Email servisimiz de dahil olmak üzere sayısız Node.js uygulaması için e-posta iletişimini destekleyen bu temel araçların sürekli bakımının ve geliştirilmesinin sağlanmasına yardımcı olur.

### Sindre Sorhus: Hizmet Paketi Beyni {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus), 1.000'den fazla npm paketiyle JavaScript ekosisteminin en üretken açık kaynaklı geliştiricilerinden biridir. [p-haritası](https://github.com/sindresorhus/p-map), [p-yeniden deneme](https://github.com/sindresorhus/p-retry) ve [is-stream](https://github.com/sindresorhus/is-stream) gibi yardımcı programları, Node.js ekosisteminde kullanılan temel yapı taşlarıdır.

Sindre'nin çalışmalarına sponsor olarak, JavaScript geliştirmeyi daha verimli ve güvenilir hale getiren bu kritik yardımcı programların geliştirilmesinin sürdürülmesine yardımcı oluyoruz.

Bu sponsorluklar, daha geniş açık kaynak ekosistemine olan bağlılığımızı yansıtmaktadır. Başarımızın, bu ve diğer katılımcılar tarafından atılan temeller üzerine inşa edildiğinin bilincindeyiz ve tüm ekosistemin sürdürülebilirliğini sağlamaya kendimizi adadık.

## JavaScript Ekosistemindeki Güvenlik Açıklarını Ortaya Çıkarma {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Açık kaynak kodlu yazılımlara olan bağlılığımız, özellik geliştirmenin ötesine geçerek milyonlarca geliştiriciyi etkileyebilecek güvenlik açıklarını tespit edip gidermeyi de kapsar. JavaScript ekosistemine sağladığımız en önemli katkılardan bazıları güvenlik alanında olmuştur.

### Koa-Router Kurtarma {#the-koa-router-rescue}

Şubat 2019'da Nick, popüler koa-router paketinin bakımında kritik bir sorun tespit etti. [Hacker News'da bildirildi](https://news.ycombinator.com/item?id=19156707) olarak adlandırılan paket, orijinal bakımcısı tarafından terk edilmiş, güvenlik açıkları giderilmemiş ve topluluk güncellemelerden mahrum kalmıştı.

> \[!WARNING]
> Güvenlik açıkları içeren terk edilmiş paketler, özellikle haftada milyonlarca kez indirildiklerinde, tüm ekosistem için önemli riskler oluşturur.

Nick, buna yanıt olarak [@koa/yönlendirici](https://github.com/koajs/router) paketini oluşturdu ve topluluğun durum hakkında uyarılmasına yardımcı oldu. O zamandan beri bu kritik paketi yönetiyor ve Koa kullanıcılarının güvenli ve iyi yönetilen bir yönlendirme çözümüne sahip olmasını sağlıyor.

### ReDoS Güvenlik Açıklarını Giderme {#addressing-redos-vulnerabilities}

Nick, 2020 yılında yaygın olarak kullanılan `url-regex` paketindeki kritik bir [Düzenli İfade Hizmet Reddi (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) güvenlik açığını tespit edip giderdi. Bu güvenlik açığı ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)), saldırganların düzenli ifadede felaket niteliğinde geri izlemeye neden olan özel olarak hazırlanmış girdiler sağlayarak hizmet reddi oluşturmasına olanak tanıyabilir.

Nick, mevcut paketi yamalamak yerine, orijinal API ile uyumluluğu korurken güvenlik açığını gideren tamamen yeniden yazılmış bir uygulama olan [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe)'ı oluşturdu. Ayrıca, güvenlik açığını ve nasıl azaltılacağını açıklayan bir [kapsamlı blog yazısı](/blog/docs/url-regex-javascript-node-js) yayınladı.

Bu çalışma, güvenliğe yönelik yaklaşımımızı göstermektedir: yalnızca sorunları çözmek değil, aynı zamanda toplumu eğitmek ve gelecekte benzer sorunların ortaya çıkmasını önleyecek sağlam alternatifler sunmak.

### Node.js ve Chromium Güvenliğini Savunuyor {#advocating-for-nodejs-and-chromium-security}

Nick ayrıca daha geniş ekosistemde güvenlik iyileştirmeleri için aktif olarak savunuculuk yapmıştır. Ağustos 2020'de, [Kayıt](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/)'da bildirilen, Node.js'nin HTTP başlıklarının işlenmesiyle ilgili önemli bir güvenlik sorunu tespit etmiştir.

Chromium'daki bir yamadan kaynaklanan bu sorun, saldırganların güvenlik önlemlerini aşmalarına olanak tanıyabilir. Nick'in savunuculuğu, sorunun derhal ele alınmasını sağlayarak milyonlarca Node.js uygulamasının olası istismarlardan korunmasını sağladı.

### npm Altyapısını Güvence Altına Alma {#securing-npm-infrastructure}

Aynı ayın ilerleyen günlerinde Nick, bu sefer npm'nin e-posta altyapısında başka bir kritik güvenlik sorunu tespit etti. [Kayıt](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/)'da bildirildiği gibi, npm, DMARC, SPF ve DKIM e-posta kimlik doğrulama protokollerini düzgün bir şekilde uygulamıyordu ve bu da saldırganların npm'den geliyormuş gibi görünen kimlik avı e-postaları göndermesine olanak tanıyordu.

Nick'in raporu, npm'nin e-posta güvenliği duruşunda iyileştirmelere yol açarak, paket yönetimi için npm'ye güvenen milyonlarca geliştiriciyi potansiyel kimlik avı saldırılarından korudu.

## İleri E-posta Ekosistemine Katkılarımız {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email, Nodemailer, WildDuck ve mailauth gibi birçok önemli açık kaynaklı proje üzerine inşa edilmiştir. Ekibimiz, e-posta teslimatını ve güvenliğini etkileyen derin sorunların belirlenmesine ve düzeltilmesine yardımcı olarak bu projelere önemli katkılarda bulunmuştur.

### Nodemailer'ın Temel İşlevselliğini Geliştirme {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer), Node.js'de e-posta göndermenin omurgasıdır ve katkılarımız onu daha sağlam hale getirmeye yardımcı oldu:

* **SMTP Sunucusu İyileştirmeleri**: SMTP sunucusu bileşenindeki ayrıştırma hatalarını, akış işleme sorunlarını ve TLS yapılandırma sorunlarını düzelttik\[^16]\[^17].
* **Posta Ayrıştırıcı Geliştirmeleri**: Karakter dizisi kod çözme hatalarını ve e-posta işleme hatalarına neden olabilecek ayrıştırıcı sorunlarını giderdik\[^18]\[^19].

Bu katkılar, Nodemailer'ın Forward Email dahil Node.js uygulamalarında e-posta işleme için güvenilir bir temel olarak kalmasını sağlar.

### Mailauth ile E-posta Kimlik Doğrulamasını Geliştirme {#advancing-email-authentication-with-mailauth}

[Posta Yetkisi](https://github.com/postalsys/mailauth) kritik e-posta kimlik doğrulama işlevselliği sağlar ve katkılarımız onun yeteneklerini önemli ölçüde iyileştirdi:

* **DKIM Doğrulama İyileştirmeleri**: X/Twitter'ın giden iletilerinde DKIM hatasına neden olan DNS önbellek sorunları yaşadığını tespit ettik ve Hacker One'a bildirdik\[^20].
* **DMARC ve ARC İyileştirmeleri**: Yanlış kimlik doğrulama sonuçlarına yol açabilecek DMARC ve ARC doğrulama sorunlarını düzelttik\[^21]\[^22].
* **Performans İyileştirmeleri**: E-posta kimlik doğrulama süreçlerinin performansını iyileştiren iyileştirmelere katkıda bulunduk\[^23]\[^24]\[^25]\[^26].

Bu iyileştirmeler, e-posta kimlik doğrulamasının doğru ve güvenilir olmasını sağlayarak kullanıcıları kimlik avı ve sahtekarlık saldırılarından korur.

### Anahtar Çalışma Süresi Geliştirmeleri {#key-upptime-enhancements}

Upptime'a katkılarımız şunlardır:

* **SSL Sertifika İzleme**: SSL sertifikalarının süresinin dolmasını izleme işlevini ekledik ve süresi dolan sertifikalar nedeniyle beklenmeyen kesintileri önledik\[^27].
* **Birden Fazla SMS Numarası Desteği**: Olaylar meydana geldiğinde birden fazla ekip üyesini SMS yoluyla uyarma desteğini hayata geçirdik ve yanıt sürelerini iyileştirdik\[^28].
* **IPv6 Kontrol Düzeltmeleri**: IPv6 bağlantı kontrollerindeki sorunları gidererek modern ağ ortamlarında daha doğru izleme sağladık\[^29].
* **Koyu/Açık Mod Desteği**: Durum sayfalarının kullanıcı deneyimini iyileştirmek için tema desteği ekledik\[^31].
* **Daha İyi TCP-Ping Desteği**: Daha güvenilir bağlantı testi sağlamak için TCP ping işlevini geliştirdik\[^32].

Bu geliştirmeler yalnızca Forward Email'in durum izleme özelliğini geliştirmekle kalmıyor, aynı zamanda Upptime kullanıcılarının tüm topluluğuna da sunuluyor ve bu da güvendiğimiz araçları iyileştirme konusundaki kararlılığımızı gösteriyor.

## Her Şeyi Bir Arada Tutturan Tutkal: Ölçekte Özel Kod {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Npm paketlerimiz ve mevcut projelere katkılarımız önemli olsa da, teknik uzmanlığımızı asıl ortaya koyan, bu bileşenleri entegre eden özel kodlardır. Forward Email kod tabanı, projenin [ücretsiz e-posta yönlendirme](https://github.com/forwardemail/free-email-forwarding) olarak başladığı ve daha sonra bir monorepoya birleştirildiği 2017 yılına dayanan on yıllık bir geliştirme çabasını temsil ediyor.

### Büyük Bir Geliştirme Çabası {#a-massive-development-effort}

Bu özel entegrasyon kodunun ölçeği etkileyici:

* **Toplam Katkı Sayısı**: 3.217'den fazla commit
* **Kod Tabanı Boyutu**: JavaScript, Pug, CSS ve JSON dosyalarında 421.545'ten fazla satır kod\[^33]

Bu, binlerce saatlik geliştirme çalışması, hata ayıklama oturumları ve performans optimizasyonlarını temsil eder. Bu, her bir paketi her gün binlerce müşteri tarafından kullanılan tutarlı ve güvenilir bir hizmete dönüştüren "gizli sos"tur.

### Temel Bağımlılıklar Entegrasyonu {#core-dependencies-integration}

Forward Email kod tabanı çok sayıda bağımlılığı kusursuz bir bütün halinde birleştirir:

* **E-posta İşleme**: Gönderme için Nodemailer'ı, alma için SMTP Sunucusu'nu ve ayrıştırma için Mailparser'ı entegre eder
* **Kimlik Doğrulama**: DKIM, SPF, DMARC ve ARC doğrulaması için Mailauth'u kullanır
* **DNS Çözümleme**: Küresel önbelleğe alma ile DNS-over-HTTPS için Tangerine'den yararlanır
* **MX Bağlantısı**: Güvenilir posta sunucusu bağlantıları için Tangerine entegrasyonu ile mx-connect'i kullanır
* **İş Planlaması**: Çalışan iş parçacıklarıyla güvenilir arka plan görevi işleme için Bree'yi kullanır
* **Şablonlama**: Müşteri iletişimlerinde web sitesindeki stil sayfalarını yeniden kullanmak için e-posta şablonlarını kullanır
* **E-posta Depolama**: Kuantum güvenli gizlilik için better-sqlite3-multiple-ciphers ve ChaCha20-Poly1305 şifrelemesi kullanarak ayrı ayrı şifrelenmiş SQLite posta kutuları uygular, kullanıcılar arasında tam izolasyon sağlar ve posta kutusuna yalnızca kullanıcının erişebilmesini sağlar

Bu entegrasyonların her biri, uç durumların, performans etkilerinin ve güvenlik endişelerinin dikkatlice değerlendirilmesini gerektirir. Sonuç, milyonlarca e-posta işlemini güvenilir bir şekilde işleyen sağlam bir sistemdir. SQLite uygulamamız ayrıca, verimli ikili serileştirme için msgpackr ve altyapımız genelinde gerçek zamanlı durum güncellemeleri için WebSockets'ı (ws aracılığıyla) kullanır.

### Tangerine ve mx-connect ile DNS Altyapısı {#dns-infrastructure-with-tangerine-and-mx-connect}

Forward Email altyapısının kritik bir bileşeni, iki temel paket etrafında oluşturulmuş DNS çözümleme sistemimizdir:

* **[mandalina](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Node.js DNS-over-HTTPS uygulamamız, yerleşik yeniden denemeler, zaman aşımları, akıllı sunucu rotasyonu ve önbelleğe alma desteğiyle standart DNS çözümleyicisine anında bir alternatif sunar.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Bu paket, hedef etki alanını veya e-posta adresini alarak, uygun MX sunucularını çözümleyerek ve bunlara öncelik sırasına göre bağlanarak MX sunucularına TCP bağlantıları kurar.

Tangerine'i [Çekme isteği #4](https://github.com/zone-eu/mx-connect/pull/4), Forward Email boyunca HTTP istekleri üzerinden uygulama katmanı DNS'i sağlar. Bu, dağıtılmış bir sistemde güvenilir e-posta teslimi için kritik öneme sahip, herhangi bir bölge, uygulama veya işlem genelinde 1:1 tutarlılıkla ölçeklenebilir DNS için küresel önbelleğe alma sağlar.

## Kurumsal Etki: Açık Kaynaktan Görev Açısından Kritik Çözümlere {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Açık kaynak geliştirme alanındaki on yıllık yolculuğumuzun doruk noktası, Forward Email'in yalnızca bireysel geliştiricilere değil, aynı zamanda açık kaynak hareketinin omurgasını oluşturan büyük kuruluşlara ve eğitim kurumlarına da hizmet vermesini sağladı.

### Görev Açısından Kritik E-posta Altyapısında Örnek Olaylar {#case-studies-in-mission-critical-email-infrastructure}

Güvenilirlik, gizlilik ve açık kaynak ilkelerine olan bağlılığımız, Forward Email'i zorlu e-posta gereksinimleri olan kuruluşlar için güvenilir bir tercih haline getirmiştir:

* **Eğitim Kurumları**: [Mezun e-posta yönlendirme örnek olay incelememizde] ayrıntılı olarak açıklandığı gibi](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study) aracılığıyla mx-connect ile entegre ettik. Büyük üniversiteler, güvenilir e-posta yönlendirme hizmetleri aracılığıyla yüz binlerce mezunla ömür boyu bağlantı kurmak için altyapımıza güveniyor.

* **Kurumsal Linux Çözümleri**: [Canonical Ubuntu e-posta kurumsal vaka çalışması](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study), açık kaynak yaklaşımımızın kurumsal Linux sağlayıcılarının ihtiyaçlarıyla nasıl mükemmel bir şekilde uyumlu olduğunu ve onlara ihtiyaç duydukları şeffaflığı ve kontrolü nasıl sağladığını göstermektedir.

* **Açık Kaynaklı Temeller**: Belki de en geçerli olanı, [Linux Foundation e-posta kurumsal vaka çalışması](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)'da belgelendiği gibi, Linux Vakfı ile olan ortaklığımızdır; burada hizmetimiz, Linux gelişimini yöneten kuruluşun iletişimini sağlar.

Uzun yıllardır özenle sürdürdüğümüz açık kaynak paketlerimiz, artık açık kaynak yazılımlarını savunan toplulukları ve kuruluşları destekleyen bir e-posta hizmeti oluşturmamızı sağlayan güzel bir simetriye sahip. Tek tek paketler sunmaktan açık kaynak liderleri için kurumsal düzeyde e-posta altyapısı sağlamaya uzanan bu tam döngülü yolculuk, yazılım geliştirme yaklaşımımızın nihai doğrulamasını temsil ediyor.

## On Yıllık Açık Kaynak: Geleceğe Bakış {#a-decade-of-open-source-looking-forward}

Açık kaynaklı yazılımlara yapılan on yıllık katkılara geri dönüp baktığımızda ve önümüzdeki on yıla baktığımızda, çalışmalarımızı destekleyen topluluğa duyduğumuz minnettarlık ve geleceğe dair heyecanla doluyoruz.

Bireysel paket katkıcılarından, büyük kuruluşlar ve açık kaynak vakıfları tarafından kullanılan kapsamlı bir e-posta altyapısının bakımcılarına dönüşme yolculuğumuz olağanüstüydü. Bu, açık kaynak geliştirmenin gücünün ve özenli, iyi yönetilen yazılımların daha geniş ekosistem üzerindeki etkisinin bir kanıtıdır.

Önümüzdeki yıllarda şunları taahhüt ediyoruz:

* **Mevcut paketlerimizi sürdürmeye ve geliştirmeye devam ederek**, bunların dünya çapındaki geliştiriciler için güvenilir araçlar olmaya devam etmesini sağlamak.
* **Özellikle e-posta ve güvenlik alanlarındaki kritik altyapı projelerine katkılarımızı genişletmek**.
* **Gizlilik, güvenlik ve şeffaflık taahhüdümüzü sürdürürken Forward Email'in yeteneklerini geliştirmek**.
* **Yeni nesil açık kaynak geliştiricilerini** mentorluk, sponsorluk ve topluluk katılımı yoluyla desteklemek.

Yazılım geliştirmenin geleceğinin açık, iş birliğine dayalı ve güven temeline dayalı olduğuna inanıyoruz. JavaScript ekosistemine yüksek kaliteli, güvenliğe odaklı paketler sunmaya devam ederek, bu geleceğin inşasında küçük de olsa bir rol oynamayı umuyoruz.

Paketlerimizi kullanan, projelerimize katkıda bulunan, sorunları bildiren veya çalışmalarımızı duyuran herkese teşekkür ederiz. Desteğiniz bu on yıllık etkiyi mümkün kıldı ve önümüzdeki on yılda birlikte neler başarabileceğimizi görmek için heyecanlıyız.

\[^1]: npm, cabin için indirme istatistikleri, Nisan 2025
\[^2]: npm, bson-objectid için indirme istatistikleri, Şubat-Mart 2025
\[^3]: npm, url-regex-safe için indirme istatistikleri, Nisan 2025
\[^4]: forwardemail/forwardemail.net için Nisan 2025 itibarıyla GitHub yıldız sayısı
\[^5]: npm, preview-email için indirme istatistikleri, Nisan 2025
\[^7]: npm, superagent için indirme istatistikleri, Şubat-Mart 2025
\[^8]: npm, supertest için indirme istatistikleri, Şubat-Mart 2025
\[^9]: npm, preview-email için indirme istatistikleri, Şubat-Mart 2025
\[^10]: npm, cabin için indirme istatistikleri, Şubat-Mart 2025
\[^11]: url-regex-safe için npm indirme istatistikleri, Şubat-Mart 2025
\[^12]: spamscanner için npm indirme istatistikleri, Şubat-Mart 2025
\[^13]: npm istatistiklerinden günlük indirme kalıpları, Nisan 2025
\[^14]: npm istatistiklerinden haftalık indirme kalıpları, Nisan 2025
\[^15]: nodemailer için npm indirme istatistikleri, Nisan 2025
\[^16]: <https://github.com/nodemailer/smtp-server/issues/155>
\[^17]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>
\[^18]: <https://github.com/nodemailer/mailparser/issues/261>
\[^19]: <https://github.com/nodemailer/nodemailer/issues/1102>
\[^20]: <https://github.com/postalsys/mailauth/issues/30>
\[^21]: <https://github.com/postalsys/mailauth/issues/58>
\[^22]: <https://github.com/postalsys/mailauth/issues/48>
\[^23]: <https://github.com/postalsys/mailauth/issues/74>
\[^24]: <https://github.com/postalsys/mailauth/issues/75>
\[^25]: <https://github.com/postalsys/mailauth/issues/60>
\[^26]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>0
\[^27]: Upptime deposundaki GitHub sorunlarına dayanmaktadır
\[^28]: Upptime deposundaki GitHub sorunlarına dayanmaktadır
\[^29]: Upptime deposundaki GitHub sorunlarına dayanmaktadır
\[^30]: bree için npm indirme istatistikleri, Şubat-Mart 2025
\[^31]: Upptime'a yapılan GitHub çekme isteklerine dayanmaktadır
\[^32]: Upptime'a yapılan GitHub çekme isteklerine dayanmaktadır
\[^34]: Upptime için npm indirme istatistikleri koa, Şubat-Mart 2025
\[^35]: @koa/router için npm indirme istatistikleri, Şubat-Mart 2025
\[^36]: koa-router için npm indirme istatistikleri, Şubat-Mart 2025
\[^37]: url-regex için npm indirme istatistikleri, Şubat-Mart 2025
\[^38]: @breejs/later için npm indirme istatistikleri, Şubat-Mart 2025
\[^39]: email-templates için npm indirme istatistikleri, Şubat-Mart 2025
\[^40]: get-paths için npm indirme istatistikleri, Şubat-Mart 2025
\[^41]: dotenv-parse-variables için npm indirme istatistikleri, Şubat-Mart 2025
\[^42]: @koa/multer için npm indirme istatistikleri, Şubat-Mart 2025