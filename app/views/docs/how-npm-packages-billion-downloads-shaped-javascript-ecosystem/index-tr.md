# Bir On Yıllık Etki: npm Paketlerimizin 1 Milyar İndirmeye Ulaşması ve JavaScript'i Şekillendirmesi {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM paketleri milyar indirme ekosistemi" class="rounded-lg" />


## İçindekiler {#table-of-contents}

* [Önsöz](#foreword)
* [Bize Güvenen Öncüler: Isaac Z. Schlueter ve Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [npm'nin Oluşumundan Node.js Liderliğine](#from-npms-creation-to-nodejs-leadership)
* [Kodun Arkasındaki Mimar: Nick Baugh'un Yolculuğu](#the-architect-behind-the-code-nick-baughs-journey)
  * [Express Teknik Komitesi ve Temel Katkılar](#express-technical-committee-and-core-contributions)
  * [Koa Framework Katkıları](#koa-framework-contributions)
  * [Bireysel Katılımcıdan Organizasyon Liderine](#from-individual-contributor-to-organization-leader)
* [GitHub Organizasyonlarımız: Yenilik Ekosistemleri](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: Modern Uygulamalar için Yapılandırılmış Kayıt](#cabin-structured-logging-for-modern-applications)
  * [Spam Scanner: E-posta İstismarına Karşı Mücadele](#spam-scanner-fighting-email-abuse)
  * [Bree: Worker Threads ile Modern İş Zamanlaması](#bree-modern-job-scheduling-with-worker-threads)
  * [Forward Email: Açık Kaynak E-posta Altyapısı](#forward-email-open-source-email-infrastructure)
  * [Lad: Temel Koa Yardımcıları ve Araçları](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Açık Kaynak Uptime İzleme](#upptime-open-source-uptime-monitoring)
* [Forward Email Ekosistemine Katkılarımız](#our-contributions-to-the-forward-email-ecosystem)
  * [Paketlerden Üretime](#from-packages-to-production)
  * [Geri Bildirim Döngüsü](#the-feedback-loop)
* [Forward Email'in Temel İlkeleri: Mükemmellik İçin Bir Temel](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Her Zaman Geliştirici Dostu, Güvenlik Odaklı ve Şeffaf](#always-developer-friendly-security-focused-and-transparent)
  * [Zamana Dayanmış Yazılım Geliştirme İlkelerine Bağlılık](#adherence-to-time-tested-software-development-principles)
  * [Azimli, Kendi Kendine Yetebilen Geliştiriciyi Hedeflemek](#targeting-the-scrappy-bootstrapped-developer)
  * [İlkelerin Pratikte Uygulanması: Forward Email Kod Tabanı](#principles-in-practice-the-forward-email-codebase)
  * [Tasarımda Gizlilik](#privacy-by-design)
  * [Sürdürülebilir Açık Kaynak](#sustainable-open-source)
* [Rakamlar Yalan Söylemez: Şaşırtıcı npm İndirme İstatistiklerimiz](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Etkimizin Kuşbakışı Görünümü](#a-birds-eye-view-of-our-impact)
  * [Günlük Ölçekli Etki](#daily-impact-at-scale)
  * [Ham Rakamların Ötesinde](#beyond-the-raw-numbers)
* [Ekosistemi Desteklemek: Açık Kaynak Sponsorluklarımız](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: E-posta Altyapısı Öncüsü](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Yardımcı Paket Ustası](#sindre-sorhus-utility-package-mastermind)
* [JavaScript Ekosistemindeki Güvenlik Açıklarını Ortaya Çıkarmak](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Koa-Router Kurtarılması](#the-koa-router-rescue)
  * [ReDoS Açıklarının Ele Alınması](#addressing-redos-vulnerabilities)
  * [Node.js ve Chromium Güvenliği İçin Savunuculuk](#advocating-for-nodejs-and-chromium-security)
  * [npm Altyapısının Güvenliği](#securing-npm-infrastructure)
* [Forward Email Ekosistemine Katkılarımız](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Nodemailer'ın Temel Fonksiyonlarının Geliştirilmesi](#enhancing-nodemailers-core-functionality)
  * [Mailauth ile E-posta Doğrulamasının İlerlemesi](#advancing-email-authentication-with-mailauth)
  * [Önemli Upptime İyileştirmeleri](#key-upptime-enhancements)
* [Her Şeyi Bir Arada Tutan Tutkal: Ölçekli Özel Kod](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Büyük Bir Geliştirme Çabası](#a-massive-development-effort)
  * [Temel Bağımlılıkların Entegrasyonu](#core-dependencies-integration)
  * [Tangerine ve mx-connect ile DNS Altyapısı](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Kurumsal Etki: Açık Kaynaktan Kritik Görev Çözümlerine](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Kritik Görev E-posta Altyapısı Vaka Çalışmaları](#case-studies-in-mission-critical-email-infrastructure)
* [Bir On Yıllık Açık Kaynak: Geleceğe Bakış](#a-decade-of-open-source-looking-forward)
## Önsöz {#foreword}

[JavaScript](https://en.wikipedia.org/wiki/JavaScript) ve [Node.js](https://en.wikipedia.org/wiki/Node.js) dünyasında, bazı paketler vazgeçilmezdir—günde milyonlarca kez indirilen ve dünya çapında uygulamalara güç veren. Bu araçların arkasında açık kaynak kalitesine odaklanan geliştiriciler bulunuyor. Bugün, ekibimizin JavaScript ekosisteminin önemli parçaları haline gelen npm paketlerini nasıl oluşturup sürdürdüğünü gösteriyoruz.


## Bize Güvenen Öncüler: Isaac Z. Schlueter ve Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Kullanıcımız olarak [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) ile gurur duyuyoruz. Isaac, [npm](https://en.wikipedia.org/wiki/Npm_\(software\))'yi yarattı ve [Node.js](https://en.wikipedia.org/wiki/Node.js)'nin geliştirilmesine katkıda bulundu. Isaac'in Forward Email'e olan güveni, kalite ve güvenliğe verdiğimiz önemi gösteriyor. Isaac, izs.me dahil olmak üzere birkaç alan adı için Forward Email kullanıyor.

Isaac'in JavaScript üzerindeki etkisi büyüktür. 2009 yılında, platformu yaratan [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl) ile birlikte Node.js'in potansiyelini gören ilk kişilerden biriydi. Isaac'in [Increment dergisi ile yaptığı bir röportajda](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/) söylediği gibi: "Sunucu tarafı JS'nin nasıl yapılacağını anlamaya çalışan çok küçük bir topluluğun ortasında, Ryan Dahl Node'u çıkardı, bu açıkça doğru yaklaşımdı. Ben de bu işe dahil oldum ve 2009 ortalarında çok aktif hale geldim."

> \[!NOTE]
> Node.js tarihine ilgi duyanlar için, gelişimini kronikleştiren mükemmel belgeseller mevcut, bunlar arasında [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) ve [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I) bulunuyor. Ryan Dahl'ın [kişisel web sitesi](https://tinyclouds.org/) de çalışmalarına dair değerli bilgiler içeriyor.

### npm'nin Yaratılmasından Node.js Liderliğine {#from-npms-creation-to-nodejs-leadership}

Isaac, npm'yi Eylül 2009'da yarattı ve ilk kullanılabilir sürümü 2010 başında yayınladı. Bu paket yöneticisi, Node.js'de önemli bir ihtiyacı karşıladı ve geliştiricilerin kodu kolayca paylaşmasını ve yeniden kullanmasını sağladı. [Node.js Wikipedia sayfasına](https://en.wikipedia.org/wiki/Node.js) göre, "Ocak 2010'da Node.js ortamı için npm adlı bir paket yöneticisi tanıtıldı. Paket yöneticisi, programcıların Node.js paketlerini ve beraberindeki kaynak kodu yayınlamasına ve paylaşmasına olanak tanır ve paketlerin kurulumu, güncellenmesi ve kaldırılmasını kolaylaştırmak için tasarlanmıştır."

Ryan Dahl, Ocak 2012'de Node.js'den çekildiğinde, proje liderliğini Isaac devraldı. [Özgeçmişinde](https://izs.me/resume) belirtildiği gibi, "CommonJS modül sistemi, dosya sistemi API'leri ve akışlar dahil olmak üzere birkaç temel Node.js çekirdek API'sinin geliştirilmesine liderlik etti" ve "Projenin BDFL'si (Yaşam Boyu İyi Niyetli Diktatörü) olarak 2 yıl görev yaptı, Node.js sürümleri v0.6'dan v0.10'a kadar artan kalite ve güvenilir derleme sürecini sağladı."

Isaac, Node.js'i önemli bir büyüme döneminden geçirdi ve bugün platformu şekillendiren standartları belirledi. Daha sonra 2014'te npm kayıt defterini desteklemek için npm, Inc.'yi kurdu; bu kayıt defterini önceden kendi başına yönetiyordu.

JavaScript'e yaptığı büyük katkılar için Isaac'e teşekkür ediyor ve yarattığı birçok paketi kullanmaya devam ediyoruz. Onun çalışmaları, yazılım geliştirme şeklimizi ve milyonlarca geliştiricinin dünya çapında kod paylaşımını değiştirdi.


## Kodun Mimarı: Nick Baugh'un Yolculuğu {#the-architect-behind-the-code-nick-baughs-journey}

Açık kaynak başarımızın kalbinde, Forward Email'in kurucusu ve sahibi Nick Baugh var. JavaScript alanındaki yaklaşık 20 yıllık çalışmaları, sayısız geliştiricinin uygulama oluşturma biçimini şekillendirdi. Açık kaynak yolculuğu hem teknik beceri hem de topluluk liderliğini gösteriyor.

### Express Teknik Komitesi ve Temel Katkılar {#express-technical-committee-and-core-contributions}

Nick'in web framework uzmanlığı, onu en çok kullanılan Node.js frameworklerinden biri olan [Express Teknik Komitesi](https://expressjs.com/en/resources/community.html)'nde yer almaya hak kazandırdı. Nick artık [Express topluluk sayfasında](https://expressjs.com/en/resources/community.html) pasif üye olarak listeleniyor.
> \[!IMPORTANT]
> Express, Node.js ekosisteminin büyük bir kısmını şekillendiren üretken açık kaynak katkıcısı TJ Holowaychuk tarafından oluşturulmuştur. TJ'nin temel çalışmalarına minnettarız ve kapsamlı açık kaynak katkılarından bir süre ara verme [kararına](https://news.ycombinator.com/item?id=37687017) saygı duyuyoruz.

[Express Teknik Komitesi](https://expressjs.com/en/resources/community.html) üyesi olarak Nick, `req.originalUrl` dokümantasyonunun netleştirilmesi ve çok parçalı form işleme sorunlarının düzeltilmesi gibi konularda büyük bir titizlik gösterdi.

### Koa Framework Katkıları {#koa-framework-contributions}

Nick'in [Koa framework](https://github.com/koajs/koa) ile çalışmaları—TJ Holowaychuk tarafından oluşturulan Express'e modern, daha hafif bir alternatif—daha iyi web geliştirme araçlarına olan bağlılığını gösteriyor. Koa katkıları, hata yönetimi, içerik türü yönetimi ve dokümantasyon iyileştirmelerini ele alan sorunlar ve pull request'ler aracılığıyla kod içerir.

Express ve Koa üzerindeki çalışmaları, Node.js web geliştirmeye benzersiz bir bakış açısı kazandırarak ekibimizin birden fazla framework ekosistemiyle iyi çalışan paketler oluşturmasına yardımcı oluyor.

### Bireysel Katkıdan Organizasyon Liderliğine {#from-individual-contributor-to-organization-leader}

Mevcut projelere yardım etmekle başlayan süreç, tüm paket ekosistemlerini oluşturma ve sürdürme aşamasına dönüştü. Nick, JavaScript topluluğundaki belirli ihtiyaçları çözen [Cabin](https://github.com/cabinjs), [Spam Scanner](https://github.com/spamscanner), [Forward Email](https://github.com/forwardemail), [Lad](https://github.com/ladjs) ve [Bree](https://github.com/breejs) gibi birden fazla GitHub organizasyonu kurdu.

Katkı sağlayıcıdan liderliğe geçiş, Nick'in gerçek problemleri çözen iyi tasarlanmış yazılımlar vizyonunu gösteriyor. İlgili paketleri odaklanmış GitHub organizasyonları altında toplayarak, daha geniş geliştirici topluluğu için modüler ve esnek kalırken birlikte çalışan araç ekosistemleri oluşturdu.


## GitHub Organizasyonlarımız: Yenilik Ekosistemleri {#our-github-organizations-ecosystems-of-innovation}

Açık kaynak çalışmalarımızı, JavaScript'teki belirli ihtiyaçları çözen odaklanmış GitHub organizasyonları etrafında düzenliyoruz. Bu yapı, birlikte iyi çalışan ancak modüler kalan uyumlu paket aileleri yaratıyor.

### Cabin: Modern Uygulamalar için Yapılandırılmış Kayıt {#cabin-structured-logging-for-modern-applications}

[Cabin organizasyonu](https://github.com/cabinjs), basit ve güçlü uygulama kayıt tutma yaklaşımımızdır. Ana [`cabin`](https://github.com/cabinjs/cabin) paketi yaklaşık 900 GitHub yıldızına ve haftalık 100.000'den fazla indirmeye sahiptir\[^1]. Cabin, Sentry, LogDNA ve Papertrail gibi popüler servislerle çalışan yapılandırılmış kayıt sağlar.

Cabin'i özel kılan, düşünceli API'si ve eklenti sistemidir. Express ara yazılımı için [`axe`](https://github.com/cabinjs/axe) ve HTTP istek ayrıştırma için [`parse-request`](https://github.com/cabinjs/parse-request) gibi destekleyici paketler, izole araçlar yerine eksiksiz çözümlere olan bağlılığımızı gösterir.

[`bson-objectid`](https://github.com/cabinjs/bson-objectid) paketi özel bir anmayı hak ediyor; sadece iki ayda 1,7 milyondan fazla indirme aldı\[^2]. Bu hafif MongoDB ObjectID uygulaması, tam MongoDB bağımlılıkları olmadan kimliklere ihtiyaç duyan geliştiriciler için tercih edilen hale geldi.

### Spam Scanner: E-posta Suistimaline Karşı Mücadele {#spam-scanner-fighting-email-abuse}

[Spam Scanner organizasyonu](https://github.com/spamscanner), gerçek problemleri çözme taahhüdümüzü gösteriyor. Ana [`spamscanner`](https://github.com/spamscanner/spamscanner) paketi gelişmiş e-posta spam tespiti sağlarken, olağanüstü benimsenme gören paket [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) oldu.

İki ayda 1,2 milyondan fazla indirme ile\[^3], `url-regex-safe` diğer URL tespit düzenli ifadelerindeki kritik güvenlik sorunlarını gideriyor. Bu paket, açık kaynağa yaklaşımımızı gösteriyor: ortak bir problemi (bu durumda URL doğrulamadaki [ReDoS](https://en.wikipedia.org/wiki/ReDoS) zafiyetleri) bulmak, sağlam bir çözüm oluşturmak ve dikkatle sürdürmek.
### Bree: Worker Threads ile Modern İş Zamanlama {#bree-modern-job-scheduling-with-worker-threads}

[Bree organizasyonu](https://github.com/breejs), yaygın bir Node.js zorluğuna yanıtımızdır: güvenilir iş zamanlama. 3.100'den fazla GitHub yıldızına sahip ana [`bree`](https://github.com/breejs/bree) paketi, daha iyi performans ve güvenilirlik için Node.js worker thread'leri kullanarak modern bir iş zamanlayıcı sağlar.

> \[!NOTE]
> Bree, [Agenda](https://github.com/agenda/agenda) projesine katkıda bulunduktan sonra oluşturuldu ve öğrenilen dersler uygulanarak daha iyi bir iş zamanlayıcı geliştirildi. Agenda katkılarımız, iş zamanlamayı geliştirme yolları bulmamıza yardımcı oldu.

Bree'yi Agenda gibi diğer zamanlayıcılardan farklı kılanlar:

* **Dış Bağımlılık Yok**: MongoDB gerektiren Agenda'nın aksine, Bree iş durumu yönetimi için Redis veya MongoDB gerektirmez.
* **Worker Thread'ler**: Bree, izole edilmiş süreçler için Node.js worker thread'lerini kullanır, bu da daha iyi izolasyon ve performans sağlar.
* **Basit API**: Bree, karmaşık zamanlama ihtiyaçlarını uygulamayı kolaylaştıran ayrıntılı kontrolü basitlikle sunar.
* **Yerleşik Destek**: Nazik yeniden yükleme, cron işleri, tarihler ve insan dostu zamanlar gibi özellikler varsayılan olarak dahildir.

Bree, kritik arka plan görevlerini (e-posta işleme, temizlik ve planlı bakım gibi) yöneten [forwardemail.net](https://github.com/forwardemail/forwardemail.net) sitesinin önemli bir parçasıdır. Forward Email'de Bree kullanmak, kendi araçlarımızı üretimde kullanma taahhüdümüzü gösterir ve yüksek güvenilirlik standartlarını karşılamalarını sağlar.

Ayrıca [piscina](https://github.com/piscinajs/piscina) gibi diğer harika worker thread paketlerini ve [undici](https://github.com/nodejs/undici) gibi HTTP istemcilerini kullanıyor ve takdir ediyoruz. Piscina, Bree gibi, verimli görev işleme için Node.js worker thread'lerini kullanır. Hem undici hem de piscina'yı sürdüren [Matteo Collina](https://github.com/mcollina)'ya Node.js'e yaptığı büyük katkılar için teşekkür ederiz. Matteo, Node.js Teknik Yönlendirme Komitesi'nde görev yapmakta ve Node.js'teki HTTP istemci yeteneklerini büyük ölçüde geliştirmiştir.

### Forward Email: Açık Kaynak E-posta Altyapısı {#forward-email-open-source-email-infrastructure}

En iddialı projemiz, e-posta yönlendirme, depolama ve API hizmetleri sunan açık kaynaklı bir e-posta servisi olan [Forward Email](https://github.com/forwardemail)'dir. Ana depo 1.100'den fazla GitHub yıldızına sahiptir\[^4], bu da topluluğun bu tescilli e-posta servislerine alternatif projeye olan takdirini gösterir.

Bu organizasyondan gelen [`preview-email`](https://github.com/forwardemail/preview-email) paketi, iki ayda 2,5 milyondan fazla indirilme sayısına ulaşmış\[^5] ve e-posta şablonlarıyla çalışan geliştiriciler için vazgeçilmez bir araç haline gelmiştir. Geliştirme sırasında e-postaları önizlemenin basit bir yolunu sunarak, e-posta özellikli uygulamalar oluştururken yaygın bir sorunu çözer.

### Lad: Temel Koa Yardımcıları ve Araçları {#lad-essential-koa-utilities-and-tools}

[Lad organizasyonu](https://github.com/ladjs), öncelikle Koa framework ekosistemini geliştirmeye odaklanan temel yardımcılar ve araçlar koleksiyonu sunar. Bu paketler, web geliştirmede yaygın zorlukları çözer ve bağımsız olarak faydalı kalırken sorunsuz bir şekilde birlikte çalışacak şekilde tasarlanmıştır.

#### koa-better-error-handler: Koa için Geliştirilmiş Hata Yönetimi {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler), Koa uygulamaları için daha iyi bir hata yönetimi çözümü sunar. 50'den fazla GitHub yıldızına sahip bu paket, `ctx.throw`'un kullanıcı dostu hata mesajları üretmesini sağlar ve Koa'nın yerleşik hata yöneticisinin birkaç sınırlamasını giderir:

* Node.js DNS hatalarını, Mongoose hatalarını ve Redis hatalarını algılar ve doğru şekilde işler
* Tutarlı, iyi biçimlendirilmiş hata yanıtları oluşturmak için [Boom](https://github.com/hapijs/boom) kullanır
* Başlıkları korur (Koa'nın yerleşik yöneticisinin aksine)
* Varsayılan olarak 500'e dönmek yerine uygun durum kodlarını korur
* Flash mesajları ve oturum korumasını destekler
* Doğrulama hataları için HTML hata listeleri sağlar
* Birden fazla yanıt türünü destekler (HTML, JSON ve düz metin)
Bu paket, Koa uygulamalarında kapsamlı hata yönetimi için [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) ile birlikte kullanıldığında özellikle değerlidir.

#### passport: Lad için Kimlik Doğrulama {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport), popüler Passport.js kimlik doğrulama ara yazılımını modern web uygulamaları için özel geliştirmelerle genişletir. Bu paket kutudan çıktığı gibi birden fazla kimlik doğrulama stratejisini destekler:

* E-posta ile yerel kimlik doğrulama
* Apple ile giriş yapma
* GitHub kimlik doğrulaması
* Google kimlik doğrulaması
* Tek kullanımlık şifre (OTP) kimlik doğrulaması

Paket, geliştiricilerin alan adlarını ve ifadeleri uygulamalarının gereksinimlerine göre ayarlamasına olanak tanıyan yüksek derecede özelleştirilebilir. Kullanıcı yönetimi için Mongoose ile sorunsuz entegrasyon sağlamak üzere tasarlanmıştır ve sağlam kimlik doğrulama gerektiren Koa tabanlı uygulamalar için ideal bir çözümdür.

#### graceful: Zarif Uygulama Kapatma {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful), Node.js uygulamalarını zarif bir şekilde kapatma konusundaki kritik sorunu çözer. 70'ten fazla GitHub yıldızı ile bu paket, uygulamanızın veri kaybetmeden veya bağlantıları açık bırakmadan temiz bir şekilde sonlanmasını sağlar. Temel özellikler şunlardır:

* HTTP sunucularını (Express/Koa/Fastify) zarifçe kapatma desteği
* Veritabanı bağlantılarının (MongoDB/Mongoose) temiz kapatılması
* Redis istemcilerinin düzgün kapatılması
* Bree iş zamanlayıcılarının yönetimi
* Özel kapatma işleyicileri desteği
* Yapılandırılabilir zaman aşımı ayarları
* Günlükleme sistemleri ile entegrasyon

Bu paket, beklenmedik kapanmaların veri kaybına veya bozulmaya yol açabileceği üretim uygulamaları için gereklidir. Doğru kapatma prosedürlerini uygulayarak, `@ladjs/graceful` uygulamanızın güvenilirliğini ve kararlılığını sağlar.

### Upptime: Açık Kaynak Çalışma Süresi İzleme {#upptime-open-source-uptime-monitoring}

[Upptime organizasyonu](https://github.com/upptime), şeffaf, açık kaynak izlemeye olan bağlılığımızı temsil eder. Ana [`upptime`](https://github.com/upptime/upptime) deposu 13.000'den fazla GitHub yıldızına sahiptir ve katkıda bulunduğumuz en popüler projelerden biridir. Upptime, tamamen sunucusuz çalışan GitHub destekli bir çalışma süresi izleyicisi ve durum sayfası sağlar.

Kendi durum sayfamız için Upptime kullanıyoruz: <https://status.forwardemail.net> ve kaynak kodu <https://github.com/forwardemail/status.forwardemail.net> adresinde mevcuttur.

Upptime'ı özel kılan mimarisi şudur:

* **%100 Açık Kaynak**: Her bileşen tamamen açık kaynaklı ve özelleştirilebilir.
* **GitHub Destekli**: GitHub Actions, Issues ve Pages kullanarak sunucusuz izleme çözümü sağlar.
* **Sunucu Gerektirmez**: Geleneksel izleme araçlarının aksine, Upptime sunucu çalıştırmanızı veya bakımını yapmanızı gerektirmez.
* **Otomatik Durum Sayfası**: GitHub Pages üzerinde barındırılabilen güzel bir durum sayfası oluşturur.
* **Güçlü Bildirimler**: E-posta, SMS ve Slack dahil çeşitli bildirim kanallarıyla entegre olur.

Kullanıcı deneyimini artırmak için, forwardemail.net kod tabanına [@octokit/core](https://github.com/octokit/core.js/) entegre ettik; böylece gerçek zamanlı durum güncellemeleri ve olaylar doğrudan web sitemizde görüntüleniyor. Bu entegrasyon, tüm yığınımızdaki (Web Sitesi, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree vb.) herhangi bir sorun durumunda kullanıcılara anlık toast bildirimleri, rozet simgesi değişiklikleri, uyarı renkleri ve daha fazlasıyla net şeffaflık sağlar.

@octokit/core kütüphanesi, Upptime GitHub depomuzdan gerçek zamanlı verileri çekmemize, işlememize ve kullanıcı dostu şekilde görüntülememize olanak tanır. Herhangi bir hizmette kesinti veya performans düşüklüğü olduğunda, kullanıcılar ana uygulamadan ayrılmadan görsel göstergelerle hemen bilgilendirilir. Bu sorunsuz entegrasyon, kullanıcılarımızın sistem durumumuz hakkında her zaman güncel bilgiye sahip olmasını sağlayarak şeffaflığı ve güveni artırır.

Upptime, hizmetlerini şeffaf ve güvenilir bir şekilde izlemek ve durumlarını kullanıcılara iletmek isteyen yüzlerce kuruluş tarafından benimsenmiştir. Projenin başarısı, mevcut altyapıyı (bu durumda GitHub) kullanarak yaygın sorunları yeni yollarla çözmenin gücünü göstermektedir.
## Forward Email Ekosistemine Katkılarımız {#our-contributions-to-the-forward-email-ecosystem}

Açık kaynak paketlerimiz dünya çapında geliştiriciler tarafından kullanılırken, aynı zamanda kendi Forward Email servisimizin temelini oluştururlar. Bu çift rol—hem bu araçların yaratıcısı hem de kullanıcısı olmamız—bize gerçek dünya uygulamaları hakkında benzersiz bir bakış açısı kazandırır ve sürekli iyileştirmeyi sağlar.

### Paketlerden Üretime {#from-packages-to-production}

Bireysel paketlerden uyumlu bir üretim sistemine geçiş, dikkatli entegrasyon ve genişletme gerektirir. Forward Email için bu süreç şunları içerir:

* **Özel Uzantılar**: Açık kaynak paketlerimize Forward Email’e özgü, benzersiz gereksinimlerimizi karşılayan uzantılar geliştirmek.
* **Entegrasyon Kalıpları**: Bu paketlerin üretim ortamında nasıl etkileşime girdiğine dair kalıplar oluşturmak.
* **Performans Optimizasyonları**: Ölçeklendikçe ortaya çıkan performans darboğazlarını tespit etmek ve çözmek.
* **Güvenlik Sertleştirmesi**: E-posta işleme ve kullanıcı verisi korumasına özgü ek güvenlik katmanları eklemek.

Bu çalışma, temel paketlerin ötesinde binlerce saatlik geliştirme anlamına gelir ve açık kaynak katkılarımızın en iyilerini kullanan sağlam, güvenli bir e-posta servisi ortaya çıkarır.

### Geri Bildirim Döngüsü {#the-feedback-loop}

Kendi paketlerimizi üretimde kullanmanın en değerli yönü, yarattığı geri bildirim döngüsüdür. Forward Email’de sınırlamalar veya uç durumlarla karşılaştığımızda, sadece yerel yamalar yapmakla kalmayıp, temel paketleri geliştiririz; bu hem servisimize hem de daha geniş topluluğa fayda sağlar.

Bu yaklaşım birçok iyileştirmeye yol açtı:

* **Bree’nin Zarif Kapanışı**: Forward Email’in kesintisiz dağıtım ihtiyacı, Bree’de gelişmiş zarif kapanış yeteneklerine yol açtı.
* **Spam Scanner’ın Desen Tanıması**: Forward Email’de karşılaşılan gerçek spam desenleri, Spam Scanner’ın algılama algoritmalarını geliştirdi.
* **Cabin’in Performans Optimizasyonları**: Üretimde yüksek hacimli kayıtlar, Cabin’de tüm kullanıcılar için faydalı optimizasyon fırsatlarını ortaya çıkardı.

Açık kaynak çalışmalarımız ile üretim servisimiz arasındaki bu erdemli döngüyü sürdürerek, paketlerimizin teorik uygulamalar değil, pratik ve sınanmış çözümler olarak kalmasını sağlıyoruz.


## Forward Email’in Temel İlkeleri: Mükemmellik İçin Bir Temel {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email, tüm geliştirme kararlarımızı yönlendiren bir dizi temel ilkeye göre tasarlanmıştır. Bu ilkeler, [web sitemizde](/blog/docs/best-quantum-safe-encrypted-email-service#principles) detaylandırılmış olup, servisimizin geliştirici dostu, güvenli ve kullanıcı gizliliğine odaklı kalmasını sağlar.

### Her Zaman Geliştirici Dostu, Güvenlik Odaklı ve Şeffaf {#always-developer-friendly-security-focused-and-transparent}

Birinci ve en önemli ilkemiz, en yüksek güvenlik ve gizlilik standartlarını korurken geliştirici dostu yazılım yaratmaktır. Teknik mükemmeliyetin kullanılabilirlik pahasına olmaması gerektiğine ve şeffaflığın topluluğumuzla güven inşa ettiğine inanıyoruz.

Bu ilke, ayrıntılı dokümantasyonumuzda, net hata mesajlarımızda ve hem başarılar hem zorluklar hakkında açık iletişimimizde kendini gösterir. Tüm kod tabanımızı açık kaynak yaparak, inceleme ve iş birliğine davet ediyor, hem yazılımımızı hem de daha geniş ekosistemi güçlendiriyoruz.

### Zaman Testinden Geçmiş Yazılım Geliştirme İlkelerine Bağlılık {#adherence-to-time-tested-software-development-principles}

Değerini onlarca yıldır kanıtlamış birkaç yerleşik yazılım geliştirme ilkesini takip ediyoruz:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Model-Görünüm-Kontrolcü kalıbıyla sorumlulukların ayrılması
* **[Unix Felsefesi](https://en.wikipedia.org/wiki/Unix_philosophy)**: Bir işi iyi yapan modüler bileşenler oluşturmak
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Basit ve anlaşılır tutmak
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Kendini Tekrarlama, kod tekrarını önlemek
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: İhtiyacın Olmayacak, erken optimizasyondan kaçınmak
* **[Twelve Factor](https://12factor.net/)**: Modern, ölçeklenebilir uygulamalar geliştirmek için en iyi uygulamaları takip etmek
* **[Occam’ın Usturası](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Gereksinimleri karşılayan en basit çözümü seçmek
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Kendi ürünlerimizi yoğun şekilde kullanmak
Bu ilkeler sadece teorik kavramlar değildir—günlük geliştirme uygulamalarımıza derinlemesine işlemiştir. Örneğin, Unix felsefesine bağlılığımız, npm paketlerimizi nasıl yapılandırdığımızda belirgindir: küçük, odaklanmış modüller, karmaşık problemleri çözmek için bir araya getirilebilir.

### Mücadeleci, Kendi Kaynaklarıyla Geliştiriciye Yönelmek {#targeting-the-scrappy-bootstrapped-developer}

Özellikle mücadeleci, kendi kaynaklarıyla ilerleyen ve [ramen-kârlı](https://www.paulgraham.com/ramenprofitable.html) geliştiriciyi hedefliyoruz. Bu odak, fiyatlandırma modelimizden teknik kararlarımıza kadar her şeyi şekillendiriyor. Sınırlı kaynaklarla ürün geliştirme zorluklarını anlıyoruz çünkü biz de bu süreci bizzat yaşadık.

Bu ilke, açık kaynak yaklaşımımızda özellikle önemlidir. Kurumsal bütçesi olmayan geliştiriciler için gerçek problemleri çözen paketler oluşturuyor ve sürdürüyoruz; böylece güçlü araçları kaynakları ne olursa olsun herkesin erişimine açıyoruz.

### Pratikte İlkeler: Forward Email Kod Tabanı {#principles-in-practice-the-forward-email-codebase}

Bu ilkeler Forward Email kod tabanında açıkça görülür. package.json dosyamız, temel değerlerimizle uyumlu olarak özenle seçilmiş bağımlılıkları ortaya koyar:

* E-posta kimlik doğrulaması için `mailauth` gibi güvenlik odaklı paketler
* Daha kolay hata ayıklama için `preview-email` gibi geliştirici dostu araçlar
* Sindre Sorhus’un çeşitli `p-*` yardımcıları gibi modüler bileşenler

Bu ilkeleri zaman içinde tutarlı şekilde takip ederek, geliştiricilerin e-posta altyapılarını güvenle emanet edebileceği—güvenli, güvenilir ve açık kaynak topluluğunun değerleriyle uyumlu—bir servis inşa ettik.

### Tasarımda Gizlilik {#privacy-by-design}

Gizlilik Forward Email için sonradan düşünülmüş ya da pazarlama özelliği değil—hizmetimizin ve kodumuzun her yönünü şekillendiren temel bir tasarım ilkesidir:

* **Sıfır Erişim Şifrelemesi**: Kullanıcıların e-postalarını bizim okumamızı teknik olarak imkansız kılan sistemler uyguladık.
* **Minimum Veri Toplama**: Hizmetimizi sunmak için gerekli olan verileri topluyoruz, fazlasını değil.
* **Şeffaf Politikalar**: Gizlilik politikamız, yasal jargon olmadan açık ve anlaşılır bir dille yazılmıştır.
* **Açık Kaynak Doğrulaması**: Açık kaynak kod tabanımız, güvenlik araştırmacılarının gizlilik iddialarımızı doğrulamasına olanak tanır.

Bu taahhüt, güvenlik ve gizlilik en iyi uygulamalarıyla baştan tasarlanmış açık kaynak paketlerimize de yansır.

### Sürdürülebilir Açık Kaynak {#sustainable-open-source}

Açık kaynak yazılımın uzun vadede gelişmesi için sürdürülebilir modellere ihtiyacı olduğuna inanıyoruz. Yaklaşımımız şunları içerir:

* **Ticari Destek**: Açık kaynak araçlarımız etrafında premium destek ve hizmetler sunmak.
* **Dengeli Lisanslama**: Hem kullanıcı özgürlüklerini hem de proje sürdürülebilirliğini koruyan lisanslar kullanmak.
* **Topluluk Katılımı**: Katılımcılarla aktif etkileşim kurarak destekleyici bir topluluk oluşturmak.
* **Şeffaf Yol Haritaları**: Kullanıcıların plan yapabilmesi için geliştirme planlarımızı paylaşmak.

Sürdürülebilirliğe odaklanarak, açık kaynak katkılarımızın zamanla büyüyüp gelişmeye devam etmesini sağlıyoruz; ihmal edilmek yerine.

## Sayılar Yalan Söylemez: Şaşırtıcı npm İndirme İstatistiklerimiz {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Açık kaynak yazılımın etkisinden bahsederken, indirme istatistikleri benimsenme ve güvenin somut bir ölçüsünü sunar. Yardımcı olduğumuz birçok paket, birleşik indirme sayıları milyarları bulan ve nadiren açık kaynak projelerinin ulaştığı bir ölçeğe erişmiştir.

![Top npm Packages by Downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> JavaScript ekosisteminde yüksek indirme sayılarına sahip birkaç paketin bakımına yardımcı olmaktan gurur duysak da, bu paketlerin çoğunun orijinal olarak diğer yetenekli geliştiriciler tarafından yaratıldığını kabul etmek isteriz. superagent ve supertest gibi paketler, Node.js ekosisteminin şekillenmesinde önemli katkıları olan TJ Holowaychuk tarafından oluşturulmuştur.
### Etkimizin Kuşbakışı Görünümü {#a-birds-eye-view-of-our-impact}

Sadece Şubat ile Mart 2025 arasındaki iki aylık dönemde, katkıda bulunduğumuz ve bakımını yaptığımız en popüler paketler şaşırtıcı indirme sayılarına ulaştı:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84.575.829 indirme\[^7] (orijinal olarak TJ Holowaychuk tarafından oluşturulmuştur)
* **[supertest](https://www.npmjs.com/package/supertest)**: 76.432.591 indirme\[^8] (orijinal olarak TJ Holowaychuk tarafından oluşturulmuştur)
* **[koa](https://www.npmjs.com/package/koa)**: 28.539.295 indirme\[^34] (orijinal olarak TJ Holowaychuk tarafından oluşturulmuştur)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11.007.327 indirme\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3.498.918 indirme\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2.819.520 indirme\[^37]
* **[preview-email](https://www.npmjs.com/package/preview-email)**: 2.500.000 indirme\[^9]
* **[cabin](https://www.npmjs.com/package/cabin)**: 1.800.000 indirme\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)**: 1.709.938 indirme\[^38]
* **[email-templates](https://www.npmjs.com/package/email-templates)**: 1.128.139 indirme\[^39]
* **[get-paths](https://www.npmjs.com/package/get-paths)**: 1.124.686 indirme\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)**: 1.200.000 indirme\[^11]
* **[dotenv-parse-variables](https://www.npmjs.com/package/dotenv-parse-variables)**: 894.666 indirme\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839.585 indirme\[^42]
* **[spamscanner](https://www.npmjs.com/package/spamscanner)**: 145.000 indirme\[^12]
* **[bree](https://www.npmjs.com/package/bree)**: 24.270 indirme\[^30]

> \[!NOTE]
> Oluşturmamıza rağmen bakımını yaptığımız diğer birçok paketin indirme sayıları daha da yüksek, bunlar arasında `form-data` (738M+ indirme), `toidentifier` (309M+ indirme), `stackframe` (116M+ indirme) ve `error-stack-parser` (113M+ indirme) yer alıyor. Bu paketlere katkıda bulunmaktan ve orijinal yazarlarının çalışmalarına saygı duymaktan onur duyuyoruz.

Bunlar sadece etkileyici sayılar değil—gerçek geliştiricilerin gerçek problemleri çözdüğü, bizim bakımını yaptığımız kodlarla gerçekleşen olaylardır. Her indirme, bu paketlerin birinin anlamlı bir şey inşa etmesine yardımcı olduğu bir anı temsil eder; hobi projelerinden milyonlarca kişinin kullandığı kurumsal uygulamalara kadar.

![Package Categories Distribution](/img/art/category_pie_chart.svg)

### Ölçekli Günlük Etki {#daily-impact-at-scale}

Günlük indirme desenleri, milyonlarca indirmeye ulaşan zirvelerle tutarlı, yüksek hacimli kullanımı ortaya koyuyor\[^13]. Bu tutarlılık, bu paketlerin kararlılığı ve güvenilirliği hakkında konuşuyor—geliştiriciler sadece denemiyor; onları temel iş akışlarına entegre ediyor ve gün be gün onlara güveniyor.

Haftalık indirme desenleri ise daha da etkileyici sayılar gösteriyor, haftada onlarca milyon indirme civarında sürekli seyrediyor\[^14]. Bu, JavaScript ekosisteminde devasa bir ayak izi temsil ediyor; bu paketler dünya çapında üretim ortamlarında çalışıyor.

### Ham Sayıların Ötesinde {#beyond-the-raw-numbers}

İndirme istatistikleri kendi başına etkileyici olsa da, bu paketlere topluluğun duyduğu güven hakkında daha derin bir hikaye anlatıyor. Bu ölçekte paketlerin bakımını yapmak, sarsılmaz bir bağlılık gerektirir:

* **Geriye Dönük Uyumluluk**: Değişiklikler, mevcut uygulamaların bozulmaması için dikkatle değerlendirilmelidir.
* **Güvenlik**: Milyonlarca uygulamanın bu paketlere bağımlı olması, güvenlik açıklarının geniş kapsamlı sonuçları olabileceği anlamına gelir.
* **Performans**: Bu ölçekte, küçük performans iyileştirmeleri bile önemli toplu faydalar sağlayabilir.
* **Dokümantasyon**: Her deneyim seviyesinden geliştiriciler tarafından kullanılan paketler için net ve kapsamlı dokümantasyon şarttır.

Zaman içinde indirme sayılarındaki tutarlı artış, bu taahhütlerin yerine getirilmesindeki başarıyı yansıtır; güvenilir, iyi bakımı yapılan paketlerle geliştirici topluluğunun güvenini inşa etmek.
## Ekosistemi Desteklemek: Açık Kaynak Sponsorluklarımız {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Açık kaynak sürdürülebilirliği sadece kod katkısı yapmakla ilgili değildir—aynı zamanda kritik altyapıyı sürdüren geliştiricileri desteklemekle de ilgilidir.

JavaScript ekosistemine doğrudan katkılarımızın ötesinde, birçok modern uygulamanın temelini oluşturan önemli Node.js katkıcılarını desteklemekten gurur duyuyoruz. Sponsorluklarımız şunları içerir:

### Andris Reinman: E-posta Altyapısı Öncüsü {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9), haftalık 14 milyondan fazla indirme sayısına sahip Node.js için en popüler e-posta gönderme kütüphanesi olan [Nodemailer](https://github.com/nodemailer/nodemailer)'ın yaratıcısıdır\[^15]. Çalışmaları, [SMTP Server](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser) ve [WildDuck](https://github.com/nodemailer/wildduck) gibi diğer kritik e-posta altyapısı bileşenlerini de kapsamaktadır.

Sponsorluklarımız, sayısız Node.js uygulamasının e-posta iletişimini güçlendiren bu temel araçların devam eden bakımını ve geliştirilmesini sağlamaya yardımcı olur; bunlar arasında kendi Forward Email servisimiz de bulunmaktadır.

### Sindre Sorhus: Yardımcı Paket Ustası {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus), JavaScript ekosisteminde 1.000'den fazla npm paketine sahip en üretken açık kaynak katkıcılarından biridir. [p-map](https://github.com/sindresorhus/p-map), [p-retry](https://github.com/sindresorhus/p-retry) ve [is-stream](https://github.com/sindresorhus/is-stream) gibi yardımcıları, Node.js ekosistemi genelinde kullanılan temel yapı taşlarıdır.

Sindre'nin çalışmalarını destekleyerek, JavaScript geliştirmeyi daha verimli ve güvenilir hale getiren bu kritik yardımcıların geliştirilmesini sürdürüyoruz.

Bu sponsorluklar, daha geniş açık kaynak ekosistemine olan bağlılığımızı yansıtır. Kendi başarımızın, bu ve diğer katkıcılar tarafından atılan temeller üzerine kurulu olduğunu kabul ediyor ve tüm ekosistemin sürdürülebilirliğini sağlamaya kararlıyız.


## JavaScript Ekosistemindeki Güvenlik Açıklarını Ortaya Çıkarmak {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Açık kaynağa olan bağlılığımız, özellik geliştirmelerin ötesine geçerek milyonlarca geliştiriciyi etkileyebilecek güvenlik açıklarını tespit etmeyi ve çözmeyi de içerir. JavaScript ekosistemine yaptığımız en önemli katkılardan bazıları güvenlik alanındadır.

### Koa-Router Kurtarılması {#the-koa-router-rescue}

Şubat 2019'da Nick, popüler koa-router paketinin bakımında kritik bir sorun tespit etti. [Hacker News'de bildirdiği üzere](https://news.ycombinator.com/item?id=19156707), paket orijinal bakımcısı tarafından terk edilmiş, güvenlik açıkları giderilmemiş ve topluluk güncellemelerden mahrum kalmıştı.

> \[!WARNING]
> Güvenlik açıkları içeren terk edilmiş paketler, özellikle haftalık milyonlarca kez indirildiklerinde, tüm ekosistem için önemli riskler oluşturur.

Buna yanıt olarak Nick, [@koa/router](https://github.com/koajs/router)'ı oluşturdu ve durumu topluluğa duyurmaya yardımcı oldu. O zamandan beri bu kritik paketin bakımını üstlenerek Koa kullanıcılarının güvenli ve iyi bakımlı bir yönlendirme çözümüne sahip olmalarını sağladı.

### ReDoS Güvenlik Açıklarının Ele Alınması {#addressing-redos-vulnerabilities}

2020 yılında Nick, yaygın kullanılan `url-regex` paketinde kritik bir [Düzenli İfade Hizmet Engelleme (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) açığını tespit edip çözdü. Bu açık ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)), saldırganların özel olarak hazırlanmış girdilerle düzenli ifadede felaket geri izlemeye neden olarak hizmet engelleme yapmasına olanak tanıyabiliyordu.

Mevcut paketi sadece yamalamak yerine, Nick, açığı gideren ve orijinal API ile uyumluluğu koruyan tamamen yeniden yazılmış bir uygulama olan [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe)'yi oluşturdu. Ayrıca açığı ve nasıl önleneceğini açıklayan [kapsamlı bir blog yazısı](/blog/docs/url-regex-javascript-node-js) yayımladı.
Bu çalışma, güvenliğe yaklaşımımızı gösteriyor: sadece sorunları düzeltmek değil, topluluğu eğitmek ve gelecekte benzer sorunları önleyen sağlam alternatifler sunmak.

### Node.js ve Chromium Güvenliği İçin Savunuculuk {#advocating-for-nodejs-and-chromium-security}

Nick ayrıca daha geniş ekosistemde güvenlik iyileştirmeleri için aktif olarak savunuculuk yapmaktadır. Ağustos 2020'de, HTTP başlıklarının işlenmesiyle ilgili Node.js'de önemli bir güvenlik sorunu tespit etti; bu, [The Register](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/) sitesinde bildirildi.

Chromium'daki bir yamadan kaynaklanan bu sorun, saldırganların güvenlik önlemlerini atlatmasına olanak tanıyabilirdi. Nick'in savunuculuğu, sorunun hızlıca ele alınmasını sağlayarak milyonlarca Node.js uygulamasını potansiyel istismardan korudu.

### npm Altyapısının Güvenliğinin Sağlanması {#securing-npm-infrastructure}

Aynı ayın ilerleyen günlerinde, Nick bu sefer npm'in e-posta altyapısında kritik bir güvenlik sorunu tespit etti. [The Register](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/) tarafından bildirildiği üzere, npm DMARC, SPF ve DKIM e-posta kimlik doğrulama protokollerini düzgün uygulamıyordu; bu da saldırganların npm'den geliyormuş gibi görünen oltalama e-postaları göndermesine olanak tanıyabilirdi.

Nick'in raporu, npm'in e-posta güvenliği duruşunda iyileştirmelere yol açtı ve paket yönetimi için npm'e güvenen milyonlarca geliştiriciyi potansiyel oltalama saldırılarından korudu.


## Forward Email Ekosistemine Katkılarımız {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email, Nodemailer, WildDuck ve mailauth gibi birkaç kritik açık kaynak projesi üzerine inşa edilmiştir. Ekibimiz, bu projelere önemli katkılar yaparak e-posta teslimatı ve güvenliğini etkileyen derin sorunların tespit edilip düzeltilmesine yardımcı oldu.

### Nodemailer'ın Temel İşlevselliğinin Geliştirilmesi {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer), Node.js'de e-posta gönderiminin belkemiğidir ve katkılarımız onu daha sağlam hale getirdi:

* **SMTP Sunucu İyileştirmeleri**: SMTP sunucu bileşeninde ayrıştırma hatalarını, akış işleme sorunlarını ve TLS yapılandırma problemlerini düzelttik\[^16]\[^17].
* **Mail Ayrıştırıcı Geliştirmeleri**: Karakter dizisi kod çözme hatalarını ve e-posta işleme hatalarına yol açabilecek adres ayrıştırıcı sorunlarını ele aldık\[^18]\[^19].

Bu katkılar, Nodemailer'ın Forward Email dahil olmak üzere Node.js uygulamalarında e-posta işleme için güvenilir bir temel olarak kalmasını sağlar.

### Mailauth ile E-posta Kimlik Doğrulamasının İlerletilmesi {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth), kritik e-posta kimlik doğrulama işlevselliği sağlar ve katkılarımız yeteneklerini önemli ölçüde geliştirdi:

* **DKIM Doğrulama İyileştirmeleri**: X/Twitter'ın DNS önbellek sorunları nedeniyle giden mesajlarında DKIM başarısızlığı yaşandığını keşfettik ve Hacker One'da bildirdik\[^20].
* **DMARC ve ARC Geliştirmeleri**: Yanlış kimlik doğrulama sonuçlarına yol açabilecek DMARC ve ARC doğrulama sorunlarını düzelttik\[^21]\[^22].
* **Performans Optimizasyonları**: E-posta kimlik doğrulama süreçlerinin performansını artıran optimizasyonlar yaptık\[^23]\[^24]\[^25]\[^26].

Bu iyileştirmeler, e-posta kimlik doğrulamasının doğru ve güvenilir olmasını sağlayarak kullanıcıları oltalama ve taklit saldırılarından korur.

### Upptime İçin Önemli İyileştirmeler {#key-upptime-enhancements}

Upptime'a yaptığımız katkılar şunları içerir:

* **SSL Sertifikası İzleme**: SSL sertifikası süresinin dolmasını izleme işlevi ekledik, böylece süresi dolmuş sertifikalar nedeniyle beklenmedik kesintilerin önüne geçildi\[^27].
* **Birden Fazla SMS Numarası Desteği**: Olaylar gerçekleştiğinde birden fazla ekip üyesine SMS ile uyarı gönderme desteği sağladık, yanıt sürelerini iyileştirdik\[^28].
* **IPv6 Kontrol Düzeltmeleri**: IPv6 bağlantı kontrollerindeki sorunları giderdik, böylece modern ağ ortamlarında daha doğru izleme sağlandı\[^29].
* **Karanlık/Aydınlık Mod Desteği**: Durum sayfalarının kullanıcı deneyimini artırmak için tema desteği ekledik\[^31].
* **Daha İyi TCP-Ping Desteği**: TCP ping işlevselliğini geliştirerek daha güvenilir bağlantı testi sağladık\[^32].
Bu iyileştirmeler yalnızca Forward Email'in durum izleme sistemine fayda sağlamakla kalmaz, aynı zamanda Upptime kullanıcılarının tamamına sunularak, bağımlı olduğumuz araçları geliştirmeye olan bağlılığımızı gösterir.


## Her Şeyi Bir Arada Tutan Yapıştırıcı: Ölçekli Özel Kod {#the-glue-that-holds-it-all-together-custom-code-at-scale}

npm paketlerimiz ve mevcut projelere yaptığımız katkılar önemli olmakla birlikte, bu bileşenleri entegre eden özel kod, teknik uzmanlığımızı gerçekten ortaya koyar. Forward Email kod tabanı, 2017'de [free-email-forwarding](https://github.com/forwardemail/free-email-forwarding) olarak başlayan ve daha sonra monorepo'ya dahil edilen projenin on yıllık geliştirme çabasını temsil eder.

### Devasa Bir Geliştirme Çabası {#a-massive-development-effort}

Bu özel entegrasyon kodunun ölçeği etkileyicidir:

* **Toplam Katkılar**: 3.217'den fazla commit
* **Kod Tabanı Büyüklüğü**: JavaScript, Pug, CSS ve JSON dosyalarında 421.545'ten fazla satır kod\[^33]

Bu, binlerce saatlik geliştirme çalışması, hata ayıklama oturumları ve performans optimizasyonlarını temsil eder. Bireysel paketleri, her gün binlerce müşteri tarafından kullanılan uyumlu ve güvenilir bir hizmete dönüştüren "gizli sos" budur.

### Temel Bağımlılıkların Entegrasyonu {#core-dependencies-integration}

Forward Email kod tabanı, birçok bağımlılığı sorunsuz bir bütün haline getirir:

* **E-posta İşleme**: Gönderim için Nodemailer, alma için SMTP Server ve ayrıştırma için Mailparser entegrasyonu
* **Kimlik Doğrulama**: DKIM, SPF, DMARC ve ARC doğrulaması için Mailauth kullanımı
* **DNS Çözümleme**: Küresel önbellekleme ile DNS-over-HTTPS için Tangerine kullanımı
* **MX Bağlantısı**: Güvenilir posta sunucusu bağlantıları için Tangerine entegrasyonlu mx-connect kullanımı
* **İş Zamanlama**: İşçi iş parçacıkları ile güvenilir arka plan görev işleme için Bree kullanımı
* **Şablonlama**: Müşteri iletişimlerinde web sitesinden stil sayfalarını yeniden kullanmak için email-templates kullanımı
* **E-posta Depolama**: better-sqlite3-multiple-ciphers ile ChaCha20-Poly1305 şifrelemesi kullanarak bireysel olarak şifrelenmiş SQLite posta kutuları uygulaması; kuantum güvenli gizlilik sağlar, kullanıcılar arasında tam izolasyon ve yalnızca kullanıcının posta kutusuna erişimi garanti eder

Bu entegrasyonların her biri, uç durumlar, performans etkileri ve güvenlik endişeleri açısından dikkatli değerlendirme gerektirir. Sonuç, milyonlarca e-posta işlemini güvenilir şekilde yöneten sağlam bir sistemdir. SQLite uygulamamız ayrıca verimli ikili serileştirme için msgpackr ve altyapımız genelinde gerçek zamanlı durum güncellemeleri için WebSockets (ws aracılığıyla) kullanır.

### Tangerine ve mx-connect ile DNS Altyapısı {#dns-infrastructure-with-tangerine-and-mx-connect}

Forward Email'in altyapısının kritik bir bileşeni, iki ana paket etrafında inşa edilen DNS çözümleme sistemimizdir:

* **[Tangerine](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Node.js DNS-over-HTTPS uygulamamız, yerleşik yeniden denemeler, zaman aşımı, akıllı sunucu rotasyonu ve önbellekleme desteği ile standart DNS çözücüsüne drop-in yedek sağlar.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Bu paket, hedef alan adı veya e-posta adresini alır, uygun MX sunucularını çözer ve öncelik sırasına göre onlara TCP bağlantıları kurar.

Tangerine'yi mx-connect ile [pull request #4](https://github.com/zone-eu/mx-connect/pull/4) aracılığıyla entegre ettik; böylece Forward Email genelinde uygulama katmanı DNS üzerinden HTTP istekleri sağlanır. Bu, herhangi bir bölge, uygulama veya süreçte 1:1 tutarlılıkla ölçekli küresel DNS önbellekleme sunar—dağıtık bir sistemde güvenilir e-posta teslimatı için kritik önemdedir.


## Kurumsal Etki: Açık Kaynaktan Kritik Görev Çözümlerine {#enterprise-impact-from-open-source-to-mission-critical-solutions}

On yıllık açık kaynak geliştirme yolculuğumuzun doruk noktası, Forward Email'in yalnızca bireysel geliştiricilere değil, aynı zamanda açık kaynak hareketinin belkemiğini oluşturan büyük işletmelere ve eğitim kurumlarına da hizmet vermesini sağlamıştır.
### Kritik Görev E-posta Altyapısında Vaka Çalışmaları {#case-studies-in-mission-critical-email-infrastructure}

Güvenilirlik, gizlilik ve açık kaynak ilkelerine olan bağlılığımız, Forward Email'i zorlu e-posta gereksinimleri olan kuruluşlar için güvenilir tercih haline getirdi:

* **Eğitim Kurumları**: [mezun e-posta yönlendirme vaka çalışmamızda](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study) ayrıntılı olarak belirtildiği gibi, büyük üniversiteler altyapımıza güvenerek yüz binlerce mezunla ömür boyu bağlantılarını güvenilir e-posta yönlendirme hizmetleri aracılığıyla sürdürüyor.

* **Kurumsal Linux Çözümleri**: [Canonical Ubuntu e-posta kurumsal vaka çalışması](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study), açık kaynak yaklaşımımızın kurumsal Linux sağlayıcılarının ihtiyaçlarıyla nasıl mükemmel uyum sağladığını, onlara gereken şeffaflık ve kontrolü sunduğunu gösteriyor.

* **Açık Kaynak Vakıfları**: Belki de en doğrulayıcı olanı, Linux Foundation ile ortaklığımızdır; [Linux Foundation e-posta kurumsal vaka çalışmasında](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study) belgelenmiştir; hizmetimiz, Linux geliştirmesini yöneten kuruluşun iletişimini güçlendiriyor.

Yıllar boyunca özenle sürdürülen açık kaynak paketlerimizin, açık kaynak yazılımı savunan topluluklar ve kuruluşlar için kurumsal düzeyde e-posta altyapısı inşa etmemizi sağlamasında güzel bir simetri var. Bireysel paket katkılarından açık kaynak liderleri için kurumsal e-posta altyapısı sağlamaya kadar uzanan bu tam döngü yolculuğu, yazılım geliştirme yaklaşımımızın nihai doğrulamasını temsil ediyor.


## Açık Kaynağın On Yılı: İleriye Bakış {#a-decade-of-open-source-looking-forward}

On yıllık açık kaynak katkılarımıza geriye bakarken ve önümüzdeki on yıla doğru ilerlerken, çalışmalarımızı destekleyen topluluğa minnettarız ve gelecek için heyecanlıyız.

Bireysel paket katkıcılarından büyük işletmeler ve açık kaynak vakıfları tarafından kullanılan kapsamlı bir e-posta altyapısının bakımcılarına dönüşme yolculuğumuz olağanüstü oldu. Bu, açık kaynak geliştirme gücünün ve düşünceli, iyi bakılan yazılımın daha geniş ekosistem üzerindeki etkisinin bir kanıtıdır.

Önümüzdeki yıllarda taahhütlerimiz şunlardır:

* **Mevcut paketlerimizi korumaya ve geliştirmeye devam etmek**, böylece dünya çapındaki geliştiriciler için güvenilir araçlar olmaya devam etmelerini sağlamak.
* **Özellikle e-posta ve güvenlik alanlarında kritik altyapı projelerine katkılarımızı genişletmek.**
* **Forward Email'in yeteneklerini artırmak** ve gizlilik, güvenlik ve şeffaflık taahhüdümüzü sürdürmek.
* **Mentorluk, sponsorluk ve topluluk katılımı yoluyla açık kaynak katkıcılarının yeni neslini desteklemek.**

Yazılım geliştirme geleceğinin açık, işbirlikçi ve güven temelli olduğuna inanıyoruz. JavaScript ekosistemine yüksek kaliteli, güvenlik odaklı paketler katkı sağlamaya devam ederek, bu geleceğin inşasında küçük bir rol oynamayı umuyoruz.

Paketlerimizi kullanan, projelerimize katkıda bulunan, sorun bildiren veya çalışmalarımızı sadece duyuran herkese teşekkür ederiz. Desteğiniz, bu on yıllık etkiyi mümkün kıldı ve önümüzdeki on yılda birlikte neler başarabileceğimizi görmek için heyecanlıyız.

\[^1]: cabin için npm indirme istatistikleri, Nisan 2025  
\[^2]: bson-objectid için npm indirme istatistikleri, Şubat-Mart 2025  
\[^3]: url-regex-safe için npm indirme istatistikleri, Nisan 2025  
\[^4]: forwardemail/forwardemail.net için GitHub yıldız sayısı, Nisan 2025 itibarıyla  
\[^5]: preview-email için npm indirme istatistikleri, Nisan 2025  
\[^7]: superagent için npm indirme istatistikleri, Şubat-Mart 2025  
\[^8]: supertest için npm indirme istatistikleri, Şubat-Mart 2025  
\[^9]: preview-email için npm indirme istatistikleri, Şubat-Mart 2025  
\[^10]: cabin için npm indirme istatistikleri, Şubat-Mart 2025  
\[^11]: url-regex-safe için npm indirme istatistikleri, Şubat-Mart 2025  
\[^12]: spamscanner için npm indirme istatistikleri, Şubat-Mart 2025  
\[^13]: npm istatistiklerinden günlük indirme desenleri, Nisan 2025  
\[^14]: npm istatistiklerinden haftalık indirme desenleri, Nisan 2025  
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
\[^26]: <https://github.com/postalsys/mailauth/issues/73>  
\[^27]: Upptime deposundaki GitHub sorunlarına dayanır  
\[^28]: Upptime deposundaki GitHub sorunlarına dayanır  
\[^29]: Upptime deposundaki GitHub sorunlarına dayanır  
\[^30]: bree için npm indirme istatistikleri, Şubat-Mart 2025  
\[^31]: Upptime için GitHub çekme isteklerine dayanır  
\[^32]: Upptime için GitHub çekme isteklerine dayanır  
\[^34]: koa için npm indirme istatistikleri, Şubat-Mart 2025  
\[^35]: @koa/router için npm indirme istatistikleri, Şubat-Mart 2025  
\[^36]: koa-router için npm indirme istatistikleri, Şubat-Mart 2025  
\[^37]: url-regex için npm indirme istatistikleri, Şubat-Mart 2025  
\[^38]: @breejs/later için npm indirme istatistikleri, Şubat-Mart 2025  
\[^39]: email-templates için npm indirme istatistikleri, Şubat-Mart 2025  
\[^40]: get-paths için npm indirme istatistikleri, Şubat-Mart 2025  
\[^41]: dotenv-parse-variables için npm indirme istatistikleri, Şubat-Mart 2025  
\[^42]: @koa/multer için npm indirme istatistikleri, Şubat-Mart 2025
