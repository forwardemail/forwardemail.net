# Node.js Üretim Altyapısı Nasıl Optimize Edilir: En İyi Uygulamalar {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />

## İçindekiler {#table-of-contents}

* [Önsöz](#foreword)
* [%573 Tek Çekirdek Performans Optimizasyonu Devrimimiz](#our-573-single-core-performance-optimization-revolution)
  * [Node.js için Tek Çekirdek Performans Optimizasyonunun Önemi](#why-single-core-performance-optimization-matters-for-nodejs)
  * [İlgili İçerik](#related-content)
* [Node.js Üretim Ortamı Kurulumu: Teknoloji Yığınımız](#nodejs-production-environment-setup-our-technology-stack)
  * [Paket Yöneticisi: Üretim Verimliliği için pnpm](#package-manager-pnpm-for-production-efficiency)
  * [Web Çerçevesi: Modern Node.js Üretimi için Koa](#web-framework-koa-for-modern-nodejs-production)
  * [Arka Plan İş İşleme: Üretim Güvenilirliği için Bree](#background-job-processing-bree-for-production-reliability)
  * [Hata İşleme: Üretim Güvenilirliği için @hapi/boom](#error-handling-hapiboom-for-production-reliability)
* [Üretimde Node.js Uygulamaları Nasıl İzlenir?](#how-to-monitor-nodejs-applications-in-production)
  * [Sistem Düzeyinde Node.js Üretim İzleme](#system-level-nodejs-production-monitoring)
  * [Node.js Üretimi için Uygulama Düzeyinde İzleme](#application-level-monitoring-for-nodejs-production)
  * [Uygulamaya Özel İzleme](#application-specific-monitoring)
* [PM2 Sağlık Kontrolleriyle Node.js Üretim İzleme](#nodejs-production-monitoring-with-pm2-health-checks)
  * [PM2 Sağlık Kontrol Sistemimiz](#our-pm2-health-check-system)
  * [PM2 Üretim Konfigürasyonumuz](#our-pm2-production-configuration)
  * [Otomatik PM2 Dağıtımı](#automated-pm2-deployment)
* [Üretim Hatası İşleme ve Sınıflandırma Sistemi](#production-error-handling-and-classification-system)
  * [Üretim İçin isCodeBug Uygulamamız](#our-iscodebug-implementation-for-production)
  * [Üretim Kaydımızla Entegrasyon](#integration-with-our-production-logging)
  * [İlgili İçerik](#related-content-1)
* [v8-profiler-next ve cpupro ile Gelişmiş Performans Hata Ayıklama](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Node.js Üretimi için Profilleme Yaklaşımımız](#our-profiling-approach-for-nodejs-production)
  * [Yığın Anlık Görüntü Analizini Nasıl Uyguluyoruz?](#how-we-implement-heap-snapshot-analysis)
  * [Performans Hata Ayıklama İş Akışı](#performance-debugging-workflow)
  * [Node.js Uygulamanız için Önerilen Uygulama](#recommended-implementation-for-your-nodejs-application)
  * [Üretim İzleme Sistemimizle Entegrasyon](#integration-with-our-production-monitoring)
* [Node.js Üretim Altyapısı Güvenliği](#nodejs-production-infrastructure-security)
  * [Node.js Üretimi için Sistem Düzeyinde Güvenlik](#system-level-security-for-nodejs-production)
  * [Node.js Uygulamaları için Uygulama Güvenliği](#application-security-for-nodejs-applications)
  * [Altyapı Güvenlik Otomasyonu](#infrastructure-security-automation)
  * [Güvenlik İçeriğimiz](#our-security-content)
* [Node.js Uygulamaları için Veritabanı Mimarisi](#database-architecture-for-nodejs-applications)
  * [Node.js Üretimi için SQLite Uygulaması](#sqlite-implementation-for-nodejs-production)
  * [Node.js Üretimi için MongoDB Uygulaması](#mongodb-implementation-for-nodejs-production)
* [Node.js Üretim Arkaplan İş İşleme](#nodejs-production-background-job-processing)
  * [Üretim İçin Bree Sunucu Kurulumumuz](#our-bree-server-setup-for-production)
  * [Üretim İş Örnekleri](#production-job-examples)
  * [Node.js Üretimi için İş Planlama Modellerimiz](#our-job-scheduling-patterns-for-nodejs-production)
* [Üretim Node.js Uygulamaları için Otomatik Bakım](#automated-maintenance-for-production-nodejs-applications)
  * [Temizleme Uygulamamız](#our-cleanup-implementation)
  * [Node.js Üretimi için Disk Alanı Yönetimi](#disk-space-management-for-nodejs-production)
  * [Altyapı Bakım Otomasyonu](#infrastructure-maintenance-automation)
* [Node.js Üretim Dağıtım Uygulama Kılavuzu](#nodejs-production-deployment-implementation-guide)
  * [Üretim En İyi Uygulamaları için Gerçek Kodumuzu İnceleyin](#study-our-actual-code-for-production-best-practices)
  * [Blog Yazılarımızdan Öğrenin](#learn-from-our-blog-posts)
  * [Node.js Üretimi için Altyapı Otomasyonu](#infrastructure-automation-for-nodejs-production)
  * [Vaka Çalışmalarımız](#our-case-studies)
* [Sonuç: Node.js Üretim Dağıtımı En İyi Uygulamaları](#conclusion-nodejs-production-deployment-best-practices)
* [Node.js Üretimi için Tam Kaynak Listesi](#complete-resource-list-for-nodejs-production)
  * [Temel Uygulama Dosyalarımız](#our-core-implementation-files)
  * [Sunucu Uygulamalarımız](#our-server-implementations)
  * [Altyapı Otomasyonumuz](#our-infrastructure-automation)
  * [Teknik Blog Yazılarımız](#our-technical-blog-posts)
  * [Kurumsal Vaka Çalışmalarımız](#our-enterprise-case-studies)

## Önsöz {#foreword}

Forward Email olarak, Node.js üretim ortamı kurulumumuzu mükemmelleştirmek için yıllar harcadık. Bu kapsamlı kılavuz, Node.js üretim dağıtımında en iyi uygulamalarımızı paylaşıyor ve performans optimizasyonu, izleme ve Node.js uygulamalarını milyonlarca günlük işlemi yönetecek şekilde ölçeklendirme konusunda edindiğimiz derslere odaklanıyor.

## %573 Tek Çekirdek Performans Optimizasyonu Devrimimiz {#our-573-single-core-performance-optimization-revolution}

Intel'den AMD Ryzen işlemcilere geçiş yaptığımızda, Node.js uygulamalarımızda **%573'lük bir performans artışı** elde ettik. Bu, yalnızca küçük bir iyileştirme değildi; Node.js uygulamalarımızın üretimdeki performansını temelden değiştirdi ve tüm Node.js uygulamaları için tek çekirdek performans optimizasyonunun önemini ortaya koydu.

> \[!TIP]
> Node.js üretim dağıtımının en iyi uygulamaları için donanım seçimi kritik öneme sahiptir. JavaScript yürütmesi tek iş parçacıklı olduğundan, tek çekirdek performansı Node.js uygulamaları için hayati önem taşıdığından, AMD Ryzen kullanılabilirliği nedeniyle özellikle DataPacket barındırma hizmetini seçtik.

### Node.js için Tek Çekirdek Performans Optimizasyonunun Önemi {#why-single-core-performance-optimization-matters-for-nodejs}

Intel'den AMD Ryzen'a geçişimiz şu sonuçları doğurdu:

* İstek işlemede **%573 performans iyileştirmesi** ([Durum sayfamızın GitHub Sorunu #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **İşlem gecikmeleri ortadan kaldırıldı** ve neredeyse anında yanıtlar sağlandı ([GitHub Sorunu #298](https://github.com/forwardemail/forwardemail.net/issues/298]'de belirtilmiştir)
* **Node.js üretim ortamları için daha iyi fiyat-performans oranı**
* **Tüm uygulama uç noktalarımızda iyileştirilmiş yanıt süreleri**

Performans artışı o kadar önemliydi ki, ister web uygulamaları, ister API'ler, ister mikro hizmetler veya başka herhangi bir Node.js iş yükü çalıştırıyor olun, artık AMD Ryzen işlemcileri her türlü ciddi Node.js üretim dağıtımı için olmazsa olmaz olarak görüyoruz.

### İlgili İçerikler {#related-content}

Altyapı seçeneklerimiz hakkında daha fazla bilgi için şuraya göz atın:

* [En İyi E-posta Yönlendirme Hizmeti](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Performans karşılaştırmaları bölümünde belgelenmiştir)
* [Kendinden Barındırılan Çözüm](https://forwardemail.net/blog/docs/self-hosted-solution) - Donanım önerileri

## Node.js Üretim Ortamı Kurulumu: Teknoloji Yığınımız {#nodejs-production-environment-setup-our-technology-stack}

Node.js üretim dağıtım en iyi uygulamalarımız, yılların üretim deneyimine dayanan bilinçli teknoloji seçimlerini içerir. Kullandığımız teknolojiler ve bu seçimlerin herhangi bir Node.js uygulaması için neden geçerli olduğu aşağıda açıklanmıştır:

### Paket Yöneticisi: Üretim Verimliliği için pnpm {#package-manager-pnpm-for-production-efficiency}

**Ne kullanıyoruz:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (sabitlenmiş sürüm)

Node.js üretim ortamı kurulumumuzda npm ve yarn yerine pnpm'i seçtik çünkü:

* CI/CD süreçlerinde **daha hızlı kurulum süreleri**
* Sabit bağlantı sayesinde **disk alanı verimliliği**
* Hayali bağımlılıkları önleyen **sıkı bağımlılık çözümü**
* Üretim dağıtımlarında **daha iyi performans**

> \[!NOTE]
> Node.js üretim dağıtım en iyi uygulamalarımızın bir parçası olarak, tüm ortamlarda ve ekip üyelerinin makinelerinde tutarlı davranış sağlamak için pnpm gibi kritik araçların tam sürümlerini sabitliyoruz.

**Uygulama detayları:**

* [package.json yapılandırmamız](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [NPM ekosistemi blog yazımız](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Web Çerçevesi: Modern Node.js Üretimi için Koa {#web-framework-koa-for-modern-nodejs-production}

**Ne kullanıyoruz:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Node.js üretim altyapımız için Express yerine Koa'yı seçtik çünkü modern asenkron/bekleme desteği ve daha temiz ara yazılım yapısı sunuyor. Kurucumuz Nick Baugh, hem Express hem de Koa'ya katkıda bulunarak, her iki çerçevenin de üretimde kullanımı hakkında derinlemesine bilgi edinmemizi sağladı.

Bu kalıplar, REST API'leri, GraphQL sunucuları, web uygulamaları veya mikro hizmetler oluşturuyor olsanız da geçerlidir.

**Uygulama örneklerimiz:**

* [Web sunucusu kurulumu](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API sunucu yapılandırması](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [İletişim formları uygulama kılavuzu](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Arka Plan İş İşleme: Üretim Güvenilirliği için Bree {#background-job-processing-bree-for-production-reliability}

**Ne kullanıyoruz:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) zamanlayıcı

Bree'yi oluşturduk ve sürdürdük çünkü mevcut iş zamanlayıcıları, üretim Node.js ortamlarında çalışan iş parçacığı desteği ve modern JavaScript özellikleri için ihtiyaçlarımızı karşılamıyordu. Bu, arka plan işleme, zamanlanmış görevler veya çalışan iş parçacıklarına ihtiyaç duyan tüm Node.js uygulamaları için geçerlidir.

**Uygulama örneklerimiz:**

* [Bree sunucu kurulumu](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Tüm iş tanımlarımız](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [PM2 sağlık kontrolü işi](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Temizleme işi uygulaması](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Hata İşleme: Üretim Güvenilirliği için @hapi/boom {#error-handling-hapiboom-for-production-reliability}

**Ne kullanıyoruz:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Node.js üretim uygulamalarımızda yapılandırılmış hata yanıtları için @hapi/boom kullanıyoruz. Bu kalıp, tutarlı hata yönetimi gerektiren tüm Node.js uygulamaları için uygundur.

**Uygulama örneklerimiz:**

* [Hata sınıflandırma yardımcısı](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Kaydedici uygulaması](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## Üretimde Node.js Uygulamaları Nasıl İzlenir? {#how-to-monitor-nodejs-applications-in-production}

Üretim ortamında Node.js uygulamalarını izleme yaklaşımımız, yıllardır büyük ölçekte uygulama çalıştırma deneyimimizle gelişti. Her türlü Node.js uygulaması için güvenilirlik ve performans sağlamak amacıyla izlemeyi birden fazla katmanda uyguluyoruz.

### Sistem Düzeyinde Node.js Üretim İzleme {#system-level-nodejs-production-monitoring}

**Temel uygulamamız:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Ne kullanıyoruz:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Üretim izleme eşiklerimiz (gerçek üretim kodumuzdan):

* **2 GB yığın boyutu sınırı** otomatik uyarılarla
* **%25 bellek kullanımı** uyarı eşiği
* **%80 CPU kullanımı** uyarı eşiği
* **%75 disk kullanımı** uyarı eşiği

> \[!WARNING]
> Bu eşikler, özel donanım yapılandırmamız için geçerlidir. Node.js üretim izlemesini uygularken, tam mantığı anlamak ve değerleri kurulumunuza uyarlamak için monitor-server.js uygulamamızı inceleyin.

### Node.js Üretimi için Uygulama Düzeyinde İzleme {#application-level-monitoring-for-nodejs-production}

**Hata sınıflandırmamız:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Bu yardımcı şunları birbirinden ayırır:

* Acil müdahale gerektiren **gerçek kod hataları**
* Beklenen davranış olan **kullanıcı hataları**
* Kontrol edemediğimiz **harici hizmet arızaları**

Bu desen tüm Node.js uygulamalarına uygulanabilir - web uygulamaları, API'ler, mikro hizmetler veya arka plan hizmetleri.

**Günlük kaydı uygulamamız:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Node.js üretim ortamımızda hassas bilgileri korurken, yararlı hata ayıklama yeteneklerini de koruyarak kapsamlı alan düzenlemesi uyguluyoruz.

### Uygulamaya Özel İzleme {#application-specific-monitoring}

**Sunucu uygulamalarımız:**

* [SMTP sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3 sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Kuyruk izleme:** Kaynak tükenmesini önlemek için istek işlemede 5 GB'lık kuyruk sınırlamaları ve 180 saniyelik zaman aşımları uyguluyoruz. Bu kalıplar, kuyruk veya arka plan işleme özelliğine sahip tüm Node.js uygulamaları için geçerlidir.

## PM2 Sağlık Kontrolleriyle Node.js Üretim İzleme {#nodejs-production-monitoring-with-pm2-health-checks}

Yılların üretim deneyimiyle Node.js üretim ortamı kurulumumuzu PM2 ile geliştirdik. PM2 sağlık kontrollerimiz, herhangi bir Node.js uygulamasında güvenilirliği korumak için olmazsa olmazdır.

### PM2 Sağlık Kontrol Sistemimiz {#our-pm2-health-check-system}

**Temel uygulamamız:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

PM2 sağlık kontrolleri içeren Node.js üretim izleme sistemimiz şunları içerir:

* **Cron zamanlaması aracılığıyla her 20 dakikada bir çalışır**
* **Bir işlemin sağlıklı olarak değerlendirilmesi için en az 15 dakika kesintisiz çalışma süresi gerekir**
* **İşlem durumunu ve bellek kullanımını doğrular**
* **Başarısız işlemleri otomatik olarak yeniden başlatır**
* **Akıllı sağlık kontrolü aracılığıyla yeniden başlatma döngülerini önler**

> \[!CAUTION]
> Node.js üretim dağıtımının en iyi uygulamaları için, yeniden başlatma döngülerinden kaçınmak amacıyla bir işlemin sağlıklı olarak değerlendirilmesinden önce 15 dakikadan fazla çalışma süresine ihtiyacımız var. Bu, işlemler bellek veya diğer sorunlarla boğuştuğunda ardışık arızaların oluşmasını önler.

### PM2 Üretim Yapılandırmamız {#our-pm2-production-configuration}

**Ekosistem kurulumumuz:** Node.js üretim ortamı kurulumu için sunucu başlangıç dosyalarımızı inceleyin:

* [Web sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree planlayıcısı](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Bu kalıplar, Express uygulamaları, Koa sunucuları, GraphQL API'leri veya diğer Node.js uygulamalarını çalıştırıyor olmanıza bakılmaksızın geçerlidir.

### Otomatik PM2 Dağıtımı {#automated-pm2-deployment}

**PM2 dağıtımı:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Tüm sunucularımızda tutarlı Node.js üretim dağıtımlarını garantilemek için tüm PM2 kurulumumuzu Ansible aracılığıyla otomatikleştiriyoruz.

## Üretim Hata İşleme ve Sınıflandırma Sistemi {#production-error-handling-and-classification-system}

En değerli Node.js üretim dağıtım uygulamalarımızdan biri, herhangi bir Node.js uygulamasına uygulanabilen akıllı hata sınıflandırmasıdır:

### Üretim için isCodeBug Uygulamamız {#our-iscodebug-implementation-for-production}

**Kaynak:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Bu yardımcı, üretimdeki Node.js uygulamaları için akıllı hata sınıflandırması sağlar:

* **Kullanıcı hataları yerine gerçek hatalara öncelik verin**
* **Gerçek sorunlara odaklanarak olay müdahalemizi iyileştirin**
* **Beklenen kullanıcı hatalarından kaynaklanan uyarı yorgunluğunu azaltın**
* **Uygulama kaynaklı sorunları kullanıcı kaynaklı sorunlara kıyasla daha iyi anlayın**

Bu model, e-ticaret siteleri, SaaS platformları, API'ler veya mikro hizmetler oluşturuyor olun, tüm Node.js uygulamaları için işe yarar.

### Üretim Kaydımızla Entegrasyon {#integration-with-our-production-logging}

**Kaydedici entegrasyonumuz:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Kaydedicilerimiz, uyarı seviyelerini ve alan düzenlemelerini belirlemek için `isCodeBug`'ı kullanır ve Node.js üretim ortamımızda gürültüyü filtrelerken gerçek sorunlar hakkında bildirim aldığımızdan emin olur.

### İlgili İçerik {#related-content-1}

Hata işleme kalıplarımız hakkında daha fazla bilgi edinin:

* [Güvenilir Ödeme Sistemi Oluşturma](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Hata işleme kalıpları
* [E-posta Gizlilik Koruması](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Güvenlik hatası işleme

## v8-profiler-next ve cpupro ile Gelişmiş Performans Hata Ayıklama {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Üretim ortamımızdaki yığın anlık görüntülerini analiz etmek ve OOM (Bellek Yetersizliği) sorunlarını, performans darboğazlarını ve Node.js bellek sorunlarını gidermek için gelişmiş profil oluşturma araçları kullanıyoruz. Bu araçlar, bellek sızıntıları veya performans sorunları yaşayan tüm Node.js uygulamaları için olmazsa olmazdır.

### Node.js Üretimi için Profilleme Yaklaşımımız {#our-profiling-approach-for-nodejs-production}

**Önerdiğimiz araçlar:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Yığın anlık görüntüleri ve CPU profilleri oluşturmak için
* [`cpupro`](https://github.com/discoveryjs/cpupro) - CPU profillerini ve yığın anlık görüntülerini analiz etmek için

> \[!TIP]
> Node.js uygulamalarımız için eksiksiz bir performans hata ayıklama iş akışı oluşturmak amacıyla v8-profiler-next ve cpupro'yu birlikte kullanıyoruz. Bu kombinasyon, bellek sızıntılarını, performans darboğazlarını belirlememize ve üretim kodumuzu optimize etmemize yardımcı oluyor.

### Yığın Anlık Görüntü Analizini Nasıl Uyguluyoruz? {#how-we-implement-heap-snapshot-analysis}

**İzleme uygulamamız:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Üretim izleme sistemimiz, bellek eşikleri aşıldığında otomatik yığın anlık görüntüsü oluşturmayı içerir. Bu, uygulama çökmelerine neden olmadan önce OOM sorunlarını gidermemize yardımcı olur.

**Temel uygulama kalıpları:**

* **Yığın boyutu 2 GB eşiğini aştığında otomatik anlık görüntüler**
* Üretimde isteğe bağlı analiz için **Sinyal tabanlı profilleme**
* Anlık görüntü depolamasını yönetmek için **Saklama politikaları**
* Otomatik bakım için **Temizleme işlerimizle entegrasyon**

### Performans Hata Ayıklama İş Akışı {#performance-debugging-workflow}

**Gerçek uygulamamızı inceleyin:**

* [Sunucu uygulamasını izleyin](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Yığın izleme ve anlık görüntü oluşturma
* [Temizlik işi](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Anlık görüntü saklama ve temizleme
* [Logger entegrasyonu](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Performans günlüğü kaydı

### Node.js Uygulamanız İçin Önerilen Uygulama {#recommended-implementation-for-your-nodejs-application}

**Yığın anlık görüntü analizi için:**

1. Anlık görüntü oluşturmak için **v8-profiler-next** yükleyin
2. Oluşturulan anlık görüntüleri analiz etmek için **cpupro** kullanın
3. monitor-server.js dosyamıza benzer şekilde **izleme eşikleri** uygulayın
4. Anlık görüntü depolamasını yönetmek için **otomatik temizleme** ayarlayın
5. Üretimde isteğe bağlı profilleme için **sinyal işleyicileri** oluşturun

**CPU profili için:**

1. Yüksek yük dönemlerinde **CPU profilleri oluşturun**
2. Darboğazları belirlemek için **cpupro ile analiz edin**
3. Sıcak yollara** ve optimizasyon fırsatlarına odaklanın
4. Performans iyileştirmelerini **önce/sonra izleyin**

> \[!WARNING]
> Yığın anlık görüntüleri ve CPU profilleri oluşturmak performansı etkileyebilir. Kısıtlama uygulamanızı ve profillemeyi yalnızca belirli sorunları araştırırken veya bakım aralıkları sırasında etkinleştirmenizi öneririz.

### Üretim İzleme Sistemimizle Entegrasyon {#integration-with-our-production-monitoring}

Profil oluşturma araçlarımız daha geniş izleme stratejimizle bütünleşir:

* Bellek/CPU eşiklerine dayalı **Otomatik tetikleme**
* Performans sorunları tespit edildiğinde **Uyarı entegrasyonu**
* Zaman içindeki performans eğilimlerini izlemek için **Geçmiş analizi**
* Kapsamlı hata ayıklama için **Uygulama ölçümleriyle korelasyon**

Bu yaklaşım, bellek sızıntılarını tespit edip çözmemize, sıcak kod yollarını optimize etmemize ve Node.js üretim ortamımızda istikrarlı performansı korumamıza yardımcı oldu.

## Node.js Üretim Altyapısı Güvenliği {#nodejs-production-infrastructure-security}

Ansible otomasyonu aracılığıyla Node.js üretim altyapımız için kapsamlı güvenlik sağlıyoruz. Bu uygulamalar tüm Node.js uygulamaları için geçerlidir:

### Node.js Üretimi için Sistem Düzeyinde Güvenlik {#system-level-security-for-nodejs-production}

**Ansible uygulamamız:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Node.js üretim ortamları için temel güvenlik önlemlerimiz:

* Hassas verilerin diske yazılmasını önlemek için **Swap devre dışı**
* Hassas bilgiler içeren bellek dökümlerini önlemek için **Çekirdek dökümleri devre dışı**
* Yetkisiz veri erişimini önlemek için **USB depolama engellendi**
* Hem güvenlik hem de performans için **Çekirdek parametresi ayarı**

> \[!WARNING]
> Node.js üretim dağıtım en iyi uygulamalarını uygularken, takas özelliğini devre dışı bırakmak, uygulamanızın kullanılabilir RAM'i aşması durumunda bellek yetersizliği nedeniyle çökmelere neden olabilir. Bellek kullanımını dikkatle izliyor ve sunucularımızı uygun şekilde boyutlandırıyoruz.

### Node.js Uygulamaları için Uygulama Güvenliği {#application-security-for-nodejs-applications}

**Günlük alanı düzenlememiz:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Şifreler, belirteçler, API anahtarları ve kişisel bilgiler dahil olmak üzere hassas alanları günlüklerden düzenliyoruz. Bu sayede, herhangi bir Node.js üretim ortamında hata ayıklama yeteneklerini korurken kullanıcı gizliliğini de koruyoruz.

### Altyapı Güvenlik Otomasyonu {#infrastructure-security-automation}

**Node.js üretimi için eksiksiz Ansible kurulumumuz:**

* [Güvenlik kılavuzu](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [SSH anahtar yönetimi](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Sertifika yönetimi](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [DKIM kurulumu](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Güvenlik İçeriğimiz {#our-security-content}

Güvenlik yaklaşımımız hakkında daha fazla bilgi edinin:

* [En İyi Güvenlik Denetim Şirketleri](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Quantum Safe Şifreli E-posta](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Neden Açık Kaynaklı E-posta Güvenliği?](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## Node.js Uygulamaları için Veritabanı Mimarisi {#database-architecture-for-nodejs-applications}

Node.js uygulamalarımız için optimize edilmiş hibrit bir veritabanı yaklaşımı kullanıyoruz. Bu kalıplar herhangi bir Node.js uygulamasına uyarlanabilir:

### Node.js Üretimi için SQLite Uygulaması {#sqlite-implementation-for-nodejs-production}

**Ne kullanıyoruz:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Yapılandırmamız:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Node.js uygulamalarımızda kullanıcıya özel veriler için SQLite kullanıyoruz çünkü şunları sağlıyor:

* Kullanıcı/kiracı başına **veri izolasyonu**
* Tek kullanıcı sorguları için **daha iyi performans**
* Basitleştirilmiş yedekleme** ve geçiş
* Paylaşımlı veritabanlarına kıyasla **Daha az karmaşıklık**

Bu model, SaaS uygulamaları, çok kiracılı sistemler veya veri izolasyonuna ihtiyaç duyan herhangi bir Node.js uygulaması için iyi çalışır.

### Node.js Üretimi için MongoDB Uygulaması {#mongodb-implementation-for-nodejs-production}

**Ne kullanıyoruz:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Kurulum uygulamamız:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Yapılandırmamız:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Node.js üretim ortamımızda uygulama verileri için MongoDB kullanıyoruz çünkü şunları sağlıyor:

* Gelişen veri yapıları için **Esnek şema**
* Karmaşık sorgular için **Daha iyi performans**
* Yatay ölçekleme** yetenekleri
* Zengin sorgu dili**

> \[!NOTE]
> Hibrit yaklaşımımız, özel kullanım senaryomuza göre optimize edilmiştir. Bu yaklaşımın Node.js uygulamanızın ihtiyaçlarına uygun olup olmadığını anlamak için kod tabanındaki gerçek veritabanı kullanım modellerimizi inceleyin.

## Node.js Üretim Arkaplan İş İşleme {#nodejs-production-background-job-processing}

Güvenilir Node.js üretim dağıtımı için arka plan iş mimarimizi Bree etrafında oluşturduk. Bu, arka plan işlemeye ihtiyaç duyan tüm Node.js uygulamaları için geçerlidir:

### Üretim için Bree Sunucu Kurulumumuz {#our-bree-server-setup-for-production}

**Ana uygulamamız:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Ansible dağıtımımız:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Üretim İşi Örnekleri {#production-job-examples}

**Sağlık izleme:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Temizlik otomasyonu:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Tüm işlerimiz:** [Tam iş ilanları dizinimize göz atın](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Bu kalıplar, aşağıdakilere ihtiyaç duyan herhangi bir Node.js uygulaması için geçerlidir:

* Zamanlanmış görevler (veri işleme, raporlar, temizleme)
* Arka plan işleme (görüntü yeniden boyutlandırma, e-posta gönderme, veri içe aktarma)
* Sağlık izleme ve bakım
* CPU yoğun görevler için çalışan iş parçacığı kullanımı

### Node.js Üretimi için İş Planlama Modellerimiz {#our-job-scheduling-patterns-for-nodejs-production}

İş rehberimizdeki gerçek iş planlama kalıplarımızı inceleyerek şunları anlayabilirsiniz:

* Node.js üretiminde cron benzeri zamanlamayı nasıl uyguluyoruz
* Hata yönetimi ve yeniden deneme mantığımız
* CPU yoğun görevler için çalışan iş parçacıklarını nasıl kullanıyoruz

## Üretim Node.js Uygulamaları için Otomatik Bakım {#automated-maintenance-for-production-nodejs-applications}

Yaygın Node.js üretim sorunlarını önlemek için proaktif bakım uyguluyoruz. Bu kalıplar tüm Node.js uygulamaları için geçerlidir:

### Temizleme Uygulamamız {#our-cleanup-implementation}

**Kaynak:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Node.js üretim uygulamaları için otomatik bakımımızın hedefleri:

* 24 saatten eski **Geçici dosyalar**
* Saklama sınırlarının ötesindeki **Günlük dosyaları**
* **Önbellek dosyaları** ve geçici veriler
* Artık ihtiyaç duyulmayan **Yüklenen dosyalar**
* Performans hata ayıklamasından **Yığın anlık görüntüleri**

Bu kalıplar, geçici dosyalar, günlükler veya önbelleğe alınmış veriler üreten tüm Node.js uygulamaları için geçerlidir.

### Node.js Üretimi için Disk Alanı Yönetimi {#disk-space-management-for-nodejs-production}

**İzleme eşiklerimiz:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* Arka plan işlemleri için **Kuyruk sınırları**
* **%75 disk kullanımı** uyarı eşiği
* Eşikler aşıldığında **Otomatik temizleme**

### Altyapı Bakım Otomasyonu {#infrastructure-maintenance-automation}

**Node.js üretimi için Ansible otomasyonumuz:**

* [Çevre dağıtımı](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Dağıtım anahtarları yönetimi](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## Node.js Üretim Dağıtım Uygulama Kılavuzu {#nodejs-production-deployment-implementation-guide}

### Üretim En İyi Uygulamaları için Gerçek Kodumuzu İnceleyin {#study-our-actual-code-for-production-best-practices}

**Node.js üretim ortamı kurulumu için şu temel dosyalarla başlayın:**

1. **Yapılandırma:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **İzleme:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Hata işleme:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Günlük kaydı:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **İşlem durumu:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Blog Yazılarımızdan Öğrenin {#learn-from-our-blog-posts}

**Node.js üretimi için teknik uygulama kılavuzlarımız:**

* [NPM Paketleri Ekosistemi](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Bina Ödeme Sistemleri](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [E-posta Gizliliği Uygulaması](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript İletişim Formları](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React E-posta Entegrasyonu](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Node.js Üretimi için Altyapı Otomasyonu {#infrastructure-automation-for-nodejs-production}

**Node.js üretim dağıtımı için inceleyeceğimiz Ansible kılavuzlarımız:**

* [Tam oyun kitapları dizini](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Güvenlik güçlendirme](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js kurulumu](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Vaka Çalışmalarımız {#our-case-studies}

**Kurumsal uygulamalarımız:**

* [Linux Foundation Vaka Çalışması](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu Vaka Çalışması](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Mezun E-posta Yönlendirme](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## Sonuç: Node.js Üretim Dağıtımı En İyi Uygulamaları {#conclusion-nodejs-production-deployment-best-practices}

Node.js üretim altyapımız, Node.js uygulamalarının aşağıdakiler aracılığıyla kurumsal düzeyde güvenilirliğe ulaşabileceğini göstermektedir:

* **Kanıtlanmış donanım seçenekleri** (%573 tek çekirdek performans optimizasyonu için AMD Ryzen)
* **Savaşta test edilmiş Node.js üretim izleme**, belirli eşikler ve otomatik yanıtlarla
* Üretim ortamlarında olay yanıtını iyileştirmek için **Akıllı hata sınıflandırması**
* **OOM önleme için v8-profiler-next ve cpupro ile **Gelişmiş performans hata ayıklama**
* **Ansible otomasyonu ile **Kapsamlı güvenlik güçlendirmesi**
* **Uygulama ihtiyaçları için optimize edilmiş hibrit veritabanı mimarisi**
* **Yaygın Node.js üretim sorunlarını önlemek için **Otomatik bakım**

**Önemli Nokta:** Genel en iyi uygulamaları takip etmek yerine, gerçek uygulama dosyalarımızı ve blog yazılarımızı inceleyin. Kod tabanımız, web uygulamaları, API'ler, mikro hizmetler veya arka plan hizmetleri gibi herhangi bir Node.js uygulamasına uyarlanabilen Node.js üretim dağıtımı için gerçek dünya kalıpları sunar.

## Node.js Üretimi için Tam Kaynak Listesi {#complete-resource-list-for-nodejs-production}

### Temel Uygulama Dosyalarımız {#our-core-implementation-files}

* [Ana yapılandırma](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Paket bağımlılıkları](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Sunucu izleme](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Hata sınıflandırması](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Kayıt sistemi](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [PM2 sağlık kontrolleri](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Otomatik temizleme](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Sunucu Uygulamalarımız {#our-server-implementations}

* [Web sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree planlayıcısı](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3 sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Altyapı Otomasyonumuz {#our-infrastructure-automation}

* [Tüm Ansible oyun kitaplarımız](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Güvenlik güçlendirme](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js kurulumu](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Veritabanı yapılandırması](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Teknik Blog Yazılarımız {#our-technical-blog-posts}

* [NPM Ekosistem Analizi](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Ödeme Sistemi Uygulaması](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [E-posta Gizliliği Teknik Kılavuzu](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript İletişim Formları](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React E-posta Entegrasyonu](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Kendinden Barındırılan Çözüm Kılavuzu](https://forwardemail.net/blog/docs/self-hosted-solution)

### Kurumsal Vaka Çalışmalarımız {#our-enterprise-case-studies}

* [Linux Foundation Uygulaması](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu Vaka Çalışması](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Federal Hükümet Uyumluluğu](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Mezun E-posta Sistemleri](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)