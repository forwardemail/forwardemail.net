# Node.js Üretim Altyapısı Nasıl Optimize Edilir: En İyi Uygulamalar {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="tembel" src="/img/articles/nodejs-performance.webp" alt="" class="rounded-lg" />

## İçindekiler {#table-of-contents}

* [Önsöz](#foreword)
* [%573 Tek Çekirdek Performans Optimizasyon Devrimimiz](#our-573-single-core-performance-optimization-revolution)
  * [Node.js için Tek Çekirdek Performans Optimizasyonunun Önemi](#why-single-core-performance-optimization-matters-for-nodejs)
  * [İlgili İçerik](#related-content)
* [Node.js Üretim Ortamı Kurulumu: Teknoloji Yığını](#nodejs-production-environment-setup-our-technology-stack)
  * [Paket Yöneticisi: Üretim Verimliliği için pnpm](#package-manager-pnpm-for-production-efficiency)
  * [Web Çerçevesi: Modern Node.js Üretimi için Koa](#web-framework-koa-for-modern-nodejs-production)
  * [Arka Plan İş İşleme: Üretim Güvenilirliği için Bree](#background-job-processing-bree-for-production-reliability)
  * [Hata İşleme: Üretim Güvenilirliği için @hapi/boom](#error-handling-hapiboom-for-production-reliability)
* [Üretimde Node.js Uygulamaları Nasıl İzlenir](#how-to-monitor-nodejs-applications-in-production)
  * [Sistem Düzeyinde Node.js Üretim İzleme](#system-level-nodejs-production-monitoring)
  * [Node.js Üretimi için Uygulama Düzeyinde İzleme](#application-level-monitoring-for-nodejs-production)
  * [Uygulamaya Özel İzleme](#application-specific-monitoring)
* [PM2 Sağlık Kontrolleriyle Node.js Üretim İzleme](#nodejs-production-monitoring-with-pm2-health-checks)
  * [PM2 Sağlık Kontrol Sistemimiz](#our-pm2-health-check-system)
  * [PM2 Üretim Yapılandırmamız](#our-pm2-production-configuration)
  * [Otomatik PM2 Dağıtımı](#automated-pm2-deployment)
* [Üretim Hatası İşleme ve Sınıflandırma Sistemi](#production-error-handling-and-classification-system)
  * [Üretim için isCodeBug Uygulamamız](#our-iscodebug-implementation-for-production)
  * [Üretim Kaydımızla Entegrasyon](#integration-with-our-production-logging)
  * [İlgili İçerik](#related-content-1)
* [v8-profiler-next ve cpupro ile Gelişmiş Performans Hata Ayıklama](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Node.js Üretimi için Profilleme Yaklaşımımız](#our-profiling-approach-for-nodejs-production)
  * [Yığın Anlık Görüntü Analizini Nasıl Uyguluyoruz](#how-we-implement-heap-snapshot-analysis)
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
  * [Üretim için Bree Sunucu Kurulumumuz](#our-bree-server-setup-for-production)
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

Forward Email'de, Node.js üretim ortamı kurulumumuzu mükemmelleştirmek için yıllar harcadık. Bu kapsamlı kılavuz, savaşta test edilmiş Node.js üretim dağıtım en iyi uygulamalarımızı paylaşarak, performans optimizasyonuna, izlemeye ve Node.js uygulamalarını milyonlarca günlük işlemi idare edecek şekilde ölçeklendirme konusunda öğrendiğimiz derslere odaklanıyor.

## %573 Tek Çekirdek Performans Optimizasyonu Devrimimiz {#our-573-single-core-performance-optimization-revolution}

Intel'den AMD Ryzen işlemcilere geçtiğimizde Node.js uygulamalarımızda **%573'lük bir performans iyileştirmesi** elde ettik. Bu sadece küçük bir iyileştirme değildi; Node.js uygulamalarımızın üretimde nasıl performans gösterdiğini temelden değiştirdi ve herhangi bir Node.js uygulaması için tek çekirdek performans iyileştirmesinin önemini gösteriyor.

> \[!TIP]
> For Node.js production deployment best practices, hardware choice is critical. We specifically chose DataPacket hosting for their AMD Ryzen availability because single-core performance is crucial for Node.js applications since JavaScript execution is single-threaded.

### Node.js için Tek Çekirdek Performans Optimizasyonunun Önemi {#why-single-core-performance-optimization-matters-for-nodejs}

Intel'den AMD Ryzen'a geçişimiz şu sonuçları verdi:

* İstek işlemede **%573 performans iyileştirmesi** ([Durum sayfamızın GitHub Sorunu #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **İşlem gecikmeleri ortadan kaldırıldı** ve neredeyse anında yanıtlar sağlandı ([GitHub Sorunu #298](https://github.com/forwardemail/forwardemail.net/issues/298)'de belirtilmiştir)
* **Node.js üretim ortamları için daha iyi fiyat-performans oranı**
* **Tüm uygulama uç noktalarımızda iyileştirilmiş yanıt süreleri**

Performans artışı o kadar önemliydi ki, ister web uygulamaları, ister API'ler, ister mikro hizmetler veya başka herhangi bir Node.js iş yükü çalıştırıyor olun, artık AMD Ryzen işlemcileri her türlü ciddi Node.js üretim dağıtımı için olmazsa olmaz olarak görüyoruz.

### İlgili İçerikler {#related-content}

Altyapı seçeneklerimiz hakkında daha fazla bilgi için şuraya göz atın:

* [En İyi E-posta Yönlendirme Hizmeti](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Performans karşılaştırmaları bölümünde belgelenmiştir)
* [Kendi Kendine Barındırılan Çözüm](https://forwardemail.net/blog/docs/self-hosted-solution) - Donanım önerileri

## Node.js Üretim Ortamı Kurulumu: Teknoloji Yığınımız {#nodejs-production-environment-setup-our-technology-stack}

Node.js üretim dağıtım en iyi uygulamalarımız, yılların üretim deneyimine dayalı bilinçli teknoloji seçimlerini içerir. İşte kullandığımız şey ve bu seçimlerin herhangi bir Node.js uygulamasına neden uygulandığı:

### Paket Yöneticisi: Üretim Verimliliği için pnpm {#package-manager-pnpm-for-production-efficiency}

**Ne kullanıyoruz:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (sabitlenmiş sürüm)

Node.js üretim ortamı kurulumumuz için npm ve yarn yerine pnpm'yi seçtik çünkü:

* CI/CD hatlarında **Daha hızlı kurulum süreleri**
* Sert bağlantı yoluyla **Disk alanı verimliliği**
* Hayali bağımlılıkları önleyen **Sıkı bağımlılık çözümü**
* Üretim dağıtımlarında **Daha iyi performans**

> \[!NOTE]
> As part of our Node.js production deployment best practices, we pin exact versions of critical tools like pnpm to ensure consistent behavior across all environments and team members' machines.

**Uygulama detayları:**

* [package.json yapılandırmamız](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [NPM ekosistemi blog yazımız](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Web Çerçevesi: Modern Node.js Üretimi için Koa {#web-framework-koa-for-modern-nodejs-production}

**Ne kullanıyoruz:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Node.js üretim altyapımız için Express yerine Koa'yı seçtik çünkü modern async/await desteği ve daha temiz ara yazılım bileşimi vardı. Kurucumuz Nick Baugh hem Express'e hem de Koa'ya katkıda bulunarak üretim kullanımı için her iki çerçeveye dair derinlemesine bir içgörü sağladı.

Bu kalıplar, REST API'leri, GraphQL sunucuları, web uygulamaları veya mikro hizmetler oluşturuyor olmanızdan bağımsız olarak geçerlidir.

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

Node.js üretim uygulamalarımızda yapılandırılmış hata yanıtları için @hapi/boom kullanıyoruz. Bu desen, tutarlı hata işleme gerektiren herhangi bir Node.js uygulaması için işe yarar.

**Uygulama örneklerimiz:**

* [Hata sınıflandırma yardımcısı](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Logger uygulaması](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## Üretimde Node.js Uygulamaları Nasıl İzlenir? {#how-to-monitor-nodejs-applications-in-production}

Üretimde Node.js uygulamalarını izleme yaklaşımımız, uygulamaları ölçeklenebilir şekilde çalıştırmanın yıllar sürmesiyle gelişti. Herhangi bir Node.js uygulaması için güvenilirlik ve performansı garantilemek amacıyla izlemeyi birden fazla katmanda uyguluyoruz.

### Sistem Düzeyinde Node.js Üretim İzleme {#system-level-nodejs-production-monitoring}

**Temel uygulamamız:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Ne kullanıyoruz:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Üretim izleme eşiklerimiz (gerçek üretim kodumuzdan):

* **2GB yığın boyutu sınırı** otomatik uyarılarla
* **%25 bellek kullanımı** uyarı eşiği
* **%80 CPU kullanımı** uyarı eşiği
* **%75 disk kullanımı** uyarı eşiği

> \[!WARNING]
> These thresholds work for our specific hardware configuration. When implementing Node.js production monitoring, review our monitor-server.js implementation to understand the exact logic and adapt the values for your setup.

### Node.js Üretimi için Uygulama Düzeyinde İzleme {#application-level-monitoring-for-nodejs-production}

**Hata sınıflandırmamız:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Bu yardımcı şunları birbirinden ayırır:

* Hemen dikkat gerektiren **Gerçek kod hataları**
* Beklenen davranış olan **Kullanıcı hataları**
* Kontrol edemediğimiz **Harici hizmet arızaları**

Bu desen tüm Node.js uygulamalarına uygulanabilir - web uygulamaları, API'ler, mikro hizmetler veya arka plan hizmetleri.

**Günlük kaydı uygulamamız:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Node.js üretim ortamımızda yararlı hata ayıklama yeteneklerini korurken hassas bilgileri korumak için kapsamlı alan düzenlemesi uyguluyoruz.

### Uygulamaya Özel İzleme {#application-specific-monitoring}

**Sunucu uygulamalarımız:**

* [SMTP sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3 sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Kuyruk izleme:** Kaynak tükenmesini önlemek için istek işleme için 5 GB kuyruk limitleri ve 180 saniyelik zaman aşımı süreleri uyguluyoruz. Bu kalıplar, kuyrukları veya arka plan işlemesi olan tüm Node.js uygulamaları için geçerlidir.

## PM2 Sağlık Kontrolleriyle Node.js Üretim İzleme {#nodejs-production-monitoring-with-pm2-health-checks}

Yıllar süren üretim deneyimimiz sayesinde Node.js üretim ortamı kurulumumuzu PM2 ile geliştirdik. PM2 sağlık kontrollerimiz herhangi bir Node.js uygulamasında güvenilirliği korumak için olmazsa olmazdır.

### PM2 Sağlık Kontrol Sistemimiz {#our-pm2-health-check-system}

**Temel uygulamamız:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

PM2 sağlık kontrolleri içeren Node.js üretim izleme sistemimiz şunları içerir:

* **Her 20 dakikada bir çalışır** cron zamanlaması aracılığıyla
* **Bir işlemin sağlıklı olduğunu düşünmeden önce minimum 15 dakika çalışma süresi gerektirir**
* **İşlem durumunu ve bellek kullanımını doğrular**
* **Başarısız işlemleri otomatik olarak yeniden başlatır**
* **Akıllı sağlık kontrolü aracılığıyla yeniden başlatma döngülerini önler**

> \[!CAUTION]
> For Node.js production deployment best practices, we require 15+ minutes uptime before considering a process healthy to avoid restart loops. This prevents cascading failures when processes are struggling with memory or other issues.

### PM2 Üretim Yapılandırmamız {#our-pm2-production-configuration}

**Ekosistem kurulumumuz:** Node.js üretim ortamı kurulumu için sunucu başlatma dosyalarımızı inceleyin:

* [Web sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree planlayıcısı](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Bu kalıplar, Express uygulamaları, Koa sunucuları, GraphQL API'leri veya diğer herhangi bir Node.js uygulamasını çalıştırıyor olmanıza bakılmaksızın geçerlidir.

### Otomatik PM2 Dağıtımı {#automated-pm2-deployment}

**PM2 dağıtımı:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Tüm sunucularımızda tutarlı Node.js üretim dağıtımlarını garantilemek için tüm PM2 kurulumumuzu Ansible aracılığıyla otomatikleştiriyoruz.

## Üretim Hata İşleme ve Sınıflandırma Sistemi {#production-error-handling-and-classification-system}

En değerli Node.js üretim dağıtım en iyi uygulamalarımızdan biri, herhangi bir Node.js uygulamasına uygulanabilen akıllı hata sınıflandırmasıdır:

### Üretim İçin isCodeBug Uygulamamız {#our-iscodebug-implementation-for-production}

**Kaynak:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Bu yardımcı, üretimdeki Node.js uygulamaları için akıllı hata sınıflandırması sağlar:

* **Kullanıcı hataları yerine gerçek hatalara** öncelik verin
* **Gerçek sorunlara odaklanarak olay yanıtımızı iyileştirin**
* **Beklenen kullanıcı hatalarından kaynaklanan uyarı yorgunluğunu azaltın**
* **Uygulama ile kullanıcı tarafından oluşturulan sorunları** daha iyi anlayın

Bu model, e-ticaret siteleri, SaaS platformları, API'ler veya mikro hizmetler oluşturuyor olmanız fark etmeksizin tüm Node.js uygulamaları için işe yarar.

### Üretim Kaydımızla Entegrasyon {#integration-with-our-production-logging}

**Kaydedici entegrasyonumuz:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Kaydedicilerimiz, uyarı seviyelerini ve alan düzenlemesini belirlemek için `isCodeBug` kullanır ve Node.js üretim ortamımızda gürültüyü filtrelerken gerçek sorunlar hakkında bildirim aldığımızdan emin olur.

### İlgili İçerik {#related-content-1}

Hata işleme modellerimiz hakkında daha fazla bilgi edinin:

* [Güvenilir Ödeme Sistemi Oluşturma](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Hata işleme kalıpları
* [E-posta Gizlilik Koruması](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Güvenlik hatası işleme

## v8-profiler-next ve cpupro ile Gelişmiş Performans Hata Ayıklama {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Üretim ortamımızda yığın anlık görüntülerini analiz etmek ve OOM (Bellek Yetersiz) sorunlarını, performans darboğazlarını ve Node.js bellek sorunlarını ayıklamak için gelişmiş profil oluşturma araçları kullanıyoruz. Bu araçlar, bellek sızıntıları veya performans sorunları yaşayan herhangi bir Node.js uygulaması için olmazsa olmazdır.

### Node.js Üretimi için Profilleme Yaklaşımımız {#our-profiling-approach-for-nodejs-production}

**Önerdiğimiz araçlar:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Yığın anlık görüntüleri ve CPU profilleri oluşturmak için
* [`cpupro`](https://github.com/discoveryjs/cpupro) - CPU profillerini ve yığın anlık görüntülerini analiz etmek için

> \[!TIP]
> We use v8-profiler-next and cpupro together to create a complete performance debugging workflow for our Node.js applications. This combination helps us identify memory leaks, performance bottlenecks, and optimize our production code.

### Yığın Anlık Görüntü Analizini Nasıl Uyguluyoruz? {#how-we-implement-heap-snapshot-analysis}

**İzleme uygulamamız:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Üretim izlememiz, bellek eşikleri aşıldığında otomatik yığın anlık görüntüsü oluşturmayı içerir. Bu, uygulama çökmelerine neden olmadan önce OOM sorunlarını gidermemize yardımcı olur.

**Temel uygulama kalıpları:**

* **Yığın boyutu 2 GB eşiğini aştığında otomatik anlık görüntüler**
* Üretimde talep üzerine analiz için **Sinyal tabanlı profilleme**
* Anlık görüntü depolamasını yönetmek için **Saklama politikaları**
* Otomatik bakım için **Temizleme işlerimizle entegrasyon**

### Performans Hata Ayıklama İş Akışı {#performance-debugging-workflow}

**Gerçek uygulamamızı inceleyin:**

* [Sunucu uygulamasını izleyin](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Yığın izleme ve anlık görüntü oluşturma
* [Temizlik işi](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Anlık görüntü saklama ve temizleme
* [Logger entegrasyonu](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Performans günlüğü kaydı

### Node.js Uygulamanız İçin Önerilen Uygulama {#recommended-implementation-for-your-nodejs-application}

**Yığın anlık görüntü analizi için:**

1. Anlık görüntü oluşturma için **v8-profiler-next** yükleyin
2. Oluşturulan anlık görüntüleri analiz etmek için **cpupro** kullanın
3. Monitor-server.js'mize benzer şekilde **izleme eşiklerini uygulayın**
4. Anlık görüntü depolamasını yönetmek için **otomatik temizleme** ayarlayın
5. Üretimde talep üzerine profilleme için **sinyal işleyicileri** oluşturun

**CPU profillemesi için:**

1. Yüksek yük dönemlerinde **CPU profilleri oluşturun**
2. Darboğazları belirlemek için **cpupro ile analiz edin**
3. Sıcak yollara** ve optimizasyon fırsatlarına odaklanın
4. Performans iyileştirmelerinden önce/sonra izleyin**

> \[!WARNING]
> Generating heap snapshots and CPU profiles can impact performance. We recommend implementing throttling and only enabling profiling when investigating specific issues or during maintenance windows.

### Üretim İzleme Sistemimizle Entegrasyon {#integration-with-our-production-monitoring}

Profilleme araçlarımız daha geniş izleme stratejimizle bütünleşir:

* Bellek/CPU eşiklerine dayalı **Otomatik tetikleme**
* Performans sorunları algılandığında **Uyarı entegrasyonu**
* Zaman içinde performans eğilimlerini izlemek için **Geçmiş analizi**
* Kapsamlı hata ayıklama için **Uygulama ölçümleriyle korelasyon**

Bu yaklaşım, bellek sızıntılarını tespit edip çözmemize, sıcak kod yollarını optimize etmemize ve Node.js üretim ortamımızda istikrarlı performansı korumamıza yardımcı oldu.

## Node.js Üretim Altyapısı Güvenliği {#nodejs-production-infrastructure-security}

Ansible otomasyonu aracılığıyla Node.js üretim altyapımız için kapsamlı güvenlik uyguluyoruz. Bu uygulamalar herhangi bir Node.js uygulaması için geçerlidir:

### Node.js Üretimi için Sistem Düzeyinde Güvenlik {#system-level-security-for-nodejs-production}

**Ansible uygulamamız:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Node.js üretim ortamları için temel güvenlik önlemlerimiz:

* Hassas verilerin diske yazılmasını önlemek için **Swap devre dışı bırakıldı**
* Hassas bilgiler içeren bellek dökümlerini önlemek için **Çekirdek dökümleri devre dışı bırakıldı**
* Yetkisiz veri erişimini önlemek için **USB depolama engellendi**
* Hem güvenlik hem de performans için **Çekirdek parametresi ayarı**

> \[!WARNING]
> When implementing Node.js production deployment best practices, disabling swap can cause out-of-memory kills if your application exceeds available RAM. We monitor memory usage carefully and size our servers appropriately.

### Node.js Uygulamaları için Uygulama Güvenliği {#application-security-for-nodejs-applications}

**Günlük alanı düzenlememiz:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Şifreler, belirteçler, API anahtarları ve kişisel bilgiler dahil olmak üzere hassas alanları günlüklerden sansürlüyoruz. Bu, herhangi bir Node.js üretim ortamında hata ayıklama yeteneklerini korurken kullanıcı gizliliğini korur.

### Altyapı Güvenlik Otomasyonu {#infrastructure-security-automation}

**Node.js üretimi için eksiksiz Ansible kurulumumuz:**

* [Güvenlik kılavuzu](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [SSH anahtar yönetimi](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Sertifika yönetimi](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [DKIM kurulumu](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Güvenlik İçeriğimiz {#our-security-content}

Güvenlik yaklaşımımız hakkında daha fazla bilgi edinin:

* [En İyi Güvenlik Denetim Şirketleri](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Quantum Güvenli Şifrelenmiş E-posta](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Neden Açık Kaynaklı E-posta Güvenliği?](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## Node.js Uygulamaları için Veritabanı Mimarisi {#database-architecture-for-nodejs-applications}

Node.js uygulamalarımız için optimize edilmiş bir hibrit veritabanı yaklaşımı kullanıyoruz. Bu kalıplar herhangi bir Node.js uygulamasına uyarlanabilir:

### Node.js Üretimi için SQLite Uygulaması {#sqlite-implementation-for-nodejs-production}

**Ne kullanıyoruz:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Yapılandırmamız:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Node.js uygulamalarımızda kullanıcıya özel veriler için SQLite kullanıyoruz çünkü şunları sağlıyor:

* Kullanıcı/kiracı başına **Veri izolasyonu**
* Tek kullanıcı sorguları için **Daha iyi performans**
* Basitleştirilmiş yedekleme** ve geçiş
* Paylaşılan veritabanlarına kıyasla **Azaltılmış karmaşıklık**

Bu model, SaaS uygulamaları, çok kiracılı sistemler veya veri izolasyonuna ihtiyaç duyan herhangi bir Node.js uygulaması için iyi çalışır.

### Node.js Üretimi için MongoDB Uygulaması {#mongodb-implementation-for-nodejs-production}

**Ne kullanıyoruz:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Kurulum uygulamamız:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Yapılandırmamız:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Node.js üretim ortamımızda uygulama verileri için MongoDB'yi kullanıyoruz çünkü şunları sağlıyor:

* **Gelişen veri yapıları için esnek şema**
* **Karmaşık sorgular için daha iyi performans**
* **Yatay ölçekleme** yetenekleri
* **Zengin sorgu dili**

> \[!NOTE]
> Our hybrid approach optimizes for our specific use case. Study our actual database usage patterns in the codebase to understand if this approach fits your Node.js application needs.

## Node.js Üretim Arkaplan İş İşleme {#nodejs-production-background-job-processing}

Güvenilir Node.js üretim dağıtımı için arka plan iş mimarimizi Bree etrafında oluşturduk. Bu, arka plan işleme ihtiyacı olan herhangi bir Node.js uygulaması için geçerlidir:

### Üretim İçin Bree Sunucu Kurulumumuz {#our-bree-server-setup-for-production}

**Ana uygulamamız:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Ansible dağıtımımız:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Üretim İşi Örnekleri {#production-job-examples}

**Sağlık izleme:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Temizlik otomasyonu:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Tüm işlerimiz:** [Tam iş dizinimize göz atın](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Bu kalıplar, aşağıdakilere ihtiyaç duyan herhangi bir Node.js uygulaması için geçerlidir:

* Zamanlanmış görevler (veri işleme, raporlar, temizleme)
* Arkaplan işleme (görüntü yeniden boyutlandırma, e-posta gönderme, veri içe aktarma)
* Sağlık izleme ve bakım
* CPU yoğun görevler için çalışan iş parçacığı kullanımı

### Node.js Üretimi için İş Planlama Modellerimiz {#our-job-scheduling-patterns-for-nodejs-production}

İş rehberimizdeki gerçek iş planlama kalıplarımızı inceleyerek şunları anlayabilirsiniz:

* Node.js üretiminde cron benzeri zamanlamayı nasıl uygularız
* Hata işleme ve yeniden deneme mantığımız
* CPU yoğun görevler için çalışan iş parçacıklarını nasıl kullanırız

## Üretim Node.js Uygulamaları için Otomatik Bakım {#automated-maintenance-for-production-nodejs-applications}

Yaygın Node.js üretim sorunlarını önlemek için proaktif bakım uygularız. Bu kalıplar herhangi bir Node.js uygulaması için geçerlidir:

### Temizleme Uygulamamız {#our-cleanup-implementation}

**Kaynak:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Node.js üretim uygulamalarına yönelik otomatik bakımımız şunları hedefliyor:

* 24 saatten eski **Geçici dosyalar**
* Saklama sınırlarının ötesindeki **Günlük dosyaları**
* **Önbellek dosyaları** ve geçici veriler
* Artık ihtiyaç duyulmayan **Yüklenen dosyalar**
* Performans hata ayıklamasından **Yığın anlık görüntüleri**

Bu kalıplar, geçici dosyalar, günlükler veya önbelleğe alınmış veriler üreten tüm Node.js uygulamaları için geçerlidir.

### Node.js Üretimi için Disk Alanı Yönetimi {#disk-space-management-for-nodejs-production}

**İzleme eşiklerimiz:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* Arkaplan işleme için **Kuyruk sınırları**
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
* [E-posta Gizlilik Uygulaması](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript İletişim Formları](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React E-posta Entegrasyonu](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Node.js Üretimi için Altyapı Otomasyonu {#infrastructure-automation-for-nodejs-production}

**Node.js üretim dağıtımı için çalışacağımız Ansible oyun kitaplarımız:**

* [Tam oyun kitapları dizini](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Güvenlik sertleştirme](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js kurulumu](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Vaka Çalışmalarımız {#our-case-studies}

**Kurumsal uygulamalarımız:**

* [Linux Foundation Vaka Çalışması](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu Vaka Çalışması](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Mezun E-posta Yönlendirme](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## Sonuç: Node.js Üretim Dağıtımı En İyi Uygulamaları {#conclusion-nodejs-production-deployment-best-practices}

Node.js üretim altyapımız, Node.js uygulamalarının aşağıdakiler aracılığıyla kurumsal düzeyde güvenilirliğe ulaşabileceğini göstermektedir:

* **Kanıtlanmış donanım seçenekleri** (AMD Ryzen %573 tek çekirdek performans optimizasyonu için)
* **Savaşta test edilmiş Node.js üretim izleme**, belirli eşikler ve otomatik yanıtlar ile
* **Akıllı hata sınıflandırması**, üretim ortamlarında olay yanıtını iyileştirmek için
* **OOM önleme için v8-profiler-next ve cpupro ile **Gelişmiş performans hata ayıklama**
* **Ansible otomasyonu ile **Kapsamlı güvenlik güçlendirmesi**
* **Uygulama ihtiyaçları için optimize edilmiş hibrit veritabanı mimarisi**
* **Ortak Node.js üretim sorunlarını önlemek için **Otomatik bakım**

**Önemli çıkarım:** Genel en iyi uygulamaları takip etmek yerine gerçek uygulama dosyalarımızı ve blog yazılarımızı inceleyin. Kod tabanımız, herhangi bir Node.js uygulamasına - web uygulamaları, API'ler, mikro hizmetler veya arka plan hizmetleri - uyarlanabilen Node.js üretim dağıtımı için gerçek dünya kalıpları sağlar.

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
* [Güvenlik sertleştirme](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js kurulumu](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Veritabanı yapılandırması](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Teknik Blog Yazılarımız {#our-technical-blog-posts}

* [NPM Ekosistem Analizi](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Ödeme Sistemi Uygulaması](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [E-posta Gizlilik Teknik Kılavuzu](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript İletişim Formları](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React E-posta Entegrasyonu](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Kendi Kendine Barındırılan Çözüm Kılavuzu](https://forwardemail.net/blog/docs/self-hosted-solution)

### Kurumsal Vaka Çalışmalarımız {#our-enterprise-case-studies}

* [Linux Foundation Uygulaması](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu Vaka Çalışması](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Federal Hükümet Uyumluluğu](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Mezun E-posta Sistemleri](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)