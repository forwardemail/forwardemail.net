# Node.js Üretim Altyapısını Nasıl Optimize Edilir: En İyi Uygulamalar {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performans optimizasyon rehberi" class="rounded-lg" />


## İçindekiler {#table-of-contents}

* [Önsöz](#foreword)
* [%573 Tek Çekirdek Performans Optimizasyonu Devrimiz](#our-573-single-core-performance-optimization-revolution)
  * [Node.js için Tek Çekirdek Performans Optimizasyonunun Önemi](#why-single-core-performance-optimization-matters-for-nodejs)
  * [İlgili İçerik](#related-content)
* [Node.js Üretim Ortamı Kurulumu: Teknoloji Yığınımız](#nodejs-production-environment-setup-our-technology-stack)
  * [Paket Yöneticisi: Üretim Verimliliği için pnpm](#package-manager-pnpm-for-production-efficiency)
  * [Web Çatısı: Modern Node.js Üretimi için Koa](#web-framework-koa-for-modern-nodejs-production)
  * [Arka Plan İşlemeleri: Üretim Güvenilirliği için Bree](#background-job-processing-bree-for-production-reliability)
  * [Hata Yönetimi: Üretim Güvenilirliği için @hapi/boom](#error-handling-hapiboom-for-production-reliability)
* [Node.js Uygulamalarını Üretimde Nasıl İzleriz](#how-to-monitor-nodejs-applications-in-production)
  * [Sistem Seviyesinde Node.js Üretim İzleme](#system-level-nodejs-production-monitoring)
  * [Node.js Üretimi için Uygulama Seviyesi İzleme](#application-level-monitoring-for-nodejs-production)
  * [Uygulamaya Özel İzleme](#application-specific-monitoring)
* [PM2 Sağlık Kontrolleri ile Node.js Üretim İzleme](#nodejs-production-monitoring-with-pm2-health-checks)
  * [PM2 Sağlık Kontrol Sistemimiz](#our-pm2-health-check-system)
  * [PM2 Üretim Konfigürasyonumuz](#our-pm2-production-configuration)
  * [Otomatik PM2 Dağıtımı](#automated-pm2-deployment)
* [Üretim Hata Yönetimi ve Sınıflandırma Sistemi](#production-error-handling-and-classification-system)
  * [Üretim için isCodeBug Uygulamamız](#our-iscodebug-implementation-for-production)
  * [Üretim Loglamamız ile Entegrasyon](#integration-with-our-production-logging)
  * [İlgili İçerik](#related-content-1)
* [v8-profiler-next ve cpupro ile Gelişmiş Performans Hata Ayıklama](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Node.js Üretimi için Profil Oluşturma Yaklaşımımız](#our-profiling-approach-for-nodejs-production)
  * [Heap Snapshot Analizini Nasıl Uyguluyoruz](#how-we-implement-heap-snapshot-analysis)
  * [Performans Hata Ayıklama İş Akışı](#performance-debugging-workflow)
  * [Node.js Uygulamanız için Önerilen Uygulama](#recommended-implementation-for-your-nodejs-application)
  * [Üretim İzlememiz ile Entegrasyon](#integration-with-our-production-monitoring)
* [Node.js Üretim Altyapısı Güvenliği](#nodejs-production-infrastructure-security)
  * [Node.js Üretimi için Sistem Seviyesi Güvenlik](#system-level-security-for-nodejs-production)
  * [Node.js Uygulamaları için Uygulama Güvenliği](#application-security-for-nodejs-applications)
  * [Altyapı Güvenliği Otomasyonu](#infrastructure-security-automation)
  * [Güvenlik İçeriğimiz](#our-security-content)
* [Node.js Uygulamaları için Veritabanı Mimarisi](#database-architecture-for-nodejs-applications)
  * [Node.js Üretimi için SQLite Uygulaması](#sqlite-implementation-for-nodejs-production)
  * [Node.js Üretimi için MongoDB Uygulaması](#mongodb-implementation-for-nodejs-production)
* [Node.js Üretim Arka Plan İşlemeleri](#nodejs-production-background-job-processing)
  * [Üretim için Bree Sunucu Kurulumumuz](#our-bree-server-setup-for-production)
  * [Üretim İş Örnekleri](#production-job-examples)
  * [Node.js Üretimi için İş Zamanlama Kalıplarımız](#our-job-scheduling-patterns-for-nodejs-production)
* [Üretim Node.js Uygulamaları için Otomatik Bakım](#automated-maintenance-for-production-nodejs-applications)
  * [Temizlik Uygulamamız](#our-cleanup-implementation)
  * [Node.js Üretimi için Disk Alanı Yönetimi](#disk-space-management-for-nodejs-production)
  * [Altyapı Bakım Otomasyonu](#infrastructure-maintenance-automation)
* [Node.js Üretim Dağıtım Uygulama Rehberi](#nodejs-production-deployment-implementation-guide)
  * [Üretim En İyi Uygulamaları için Gerçek Kodlarımızı İnceleyin](#study-our-actual-code-for-production-best-practices)
  * [Blog Yazılarımızdan Öğrenin](#learn-from-our-blog-posts)
  * [Node.js Üretimi için Altyapı Otomasyonu](#infrastructure-automation-for-nodejs-production)
  * [Vaka Çalışmalarımız](#our-case-studies)
* [Sonuç: Node.js Üretim Dağıtım En İyi Uygulamaları](#conclusion-nodejs-production-deployment-best-practices)
* [Node.js Üretimi için Tam Kaynak Listesi](#complete-resource-list-for-nodejs-production)
  * [Temel Uygulama Dosyalarımız](#our-core-implementation-files)
  * [Sunucu Uygulamalarımız](#our-server-implementations)
  * [Altyapı Otomasyonumuz](#our-infrastructure-automation)
  * [Teknik Blog Yazılarımız](#our-technical-blog-posts)
  * [Kurumsal Vaka Çalışmalarımız](#our-enterprise-case-studies)
## Önsöz {#foreword}

Forward Email olarak, Node.js üretim ortamı kurulumumuzu yıllar boyunca mükemmelleştirdik. Bu kapsamlı rehber, performans optimizasyonu, izleme ve günlük milyonlarca işlemi yönetmek için Node.js uygulamalarını ölçeklendirme konusunda öğrendiğimiz derslere odaklanarak, test edilmiş Node.js üretim dağıtım en iyi uygulamalarımızı paylaşıyor.

## %573 Tek Çekirdek Performans Optimizasyonu Devrimiz {#our-573-single-core-performance-optimization-revolution}

Intel'den AMD Ryzen işlemcilere geçiş yaptığımızda, Node.js uygulamalarımızda **%573 performans artışı** sağladık. Bu sadece küçük bir optimizasyon değildi—Node.js uygulamalarımızın üretimde nasıl performans gösterdiğini kökten değiştirdi ve herhangi bir Node.js uygulaması için tek çekirdek performans optimizasyonunun önemini gösteriyor.

> \[!TIP]
> Node.js üretim dağıtımı en iyi uygulamaları için donanım seçimi kritik önemdedir. JavaScript yürütmesi tek iş parçacıklı olduğu için Node.js uygulamalarında tek çekirdek performansı çok önemlidir; bu yüzden AMD Ryzen erişimi nedeniyle özellikle DataPacket barındırmayı seçtik.

### Node.js için Tek Çekirdek Performans Optimizasyonu Neden Önemlidir {#why-single-core-performance-optimization-matters-for-nodejs}

Intel'den AMD Ryzen'e geçişimiz sonucunda:

* İstek işleme performansında **%573 iyileşme** (belgelenmiş [durum sayfamızdaki GitHub Issue #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* İşlem gecikmelerinin ortadan kalkması ve neredeyse anlık yanıtlar (bahsedilen [GitHub Issue #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* Node.js üretim ortamları için daha iyi fiyat-performans oranı
* Tüm uygulama uç noktalarımızda geliştirilmiş yanıt süreleri

Performans artışı o kadar önemliydi ki, artık AMD Ryzen işlemcileri web uygulamaları, API'ler, mikroservisler veya diğer herhangi bir Node.js iş yükü çalıştırıyor olun, ciddi bir Node.js üretim dağıtımı için vazgeçilmez olarak görüyoruz.

### İlgili İçerik {#related-content}

Altyapı seçimlerimiz hakkında daha fazla bilgi için bakınız:

* [En İyi E-posta Yönlendirme Servisi](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Performans karşılaştırmaları
* [Kendi Kendine Barındırılan Çözüm](https://forwardemail.net/blog/docs/self-hosted-solution) - Donanım önerileri

## Node.js Üretim Ortamı Kurulumu: Teknoloji Yığınımız {#nodejs-production-environment-setup-our-technology-stack}

Node.js üretim dağıtımı en iyi uygulamalarımız, yılların üretim deneyimine dayalı kasıtlı teknoloji seçimlerini içerir. İşte kullandıklarımız ve bu seçimlerin herhangi bir Node.js uygulamasına neden uygulanabilir olduğu:

### Paket Yöneticisi: Üretim Verimliliği için pnpm {#package-manager-pnpm-for-production-efficiency}

**Kullandığımız:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (sabitlenmiş sürüm)

Node.js üretim ortamı kurulumumuz için npm ve yarn yerine pnpm'yi seçtik çünkü:

* CI/CD boru hatlarında **daha hızlı kurulum süreleri**
* Sert bağlantı yoluyla **disk alanı verimliliği**
* Hayalet bağımlılıkları önleyen **katı bağımlılık çözümü**
* Üretim dağıtımlarında **daha iyi performans**

> \[!NOTE]
> Node.js üretim dağıtımı en iyi uygulamalarımızın bir parçası olarak, pnpm gibi kritik araçların tam sürümlerini sabitleyerek tüm ortamlar ve ekip üyelerinin makinelerinde tutarlı davranış sağlıyoruz.

**Uygulama detayları:**

* [package.json yapılandırmamız](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [NPM ekosistemi blog yazımız](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Web Çatısı: Modern Node.js Üretimi için Koa {#web-framework-koa-for-modern-nodejs-production}

**Kullandıklarımız:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
Node.js üretim altyapımız için Express yerine Koa'yı seçtik çünkü modern async/await desteği ve daha temiz middleware bileşimi sunuyor. Kurucumuz Nick Baugh, hem Express hem de Koa'ya katkıda bulundu, bu da bize her iki framework hakkında üretim kullanımı için derin bir içgörü sağladı.

Bu kalıplar, REST API'leri, GraphQL sunucuları, web uygulamaları veya mikroservisler inşa ediyor olun fark etmez geçerlidir.

**Uygulama örneklerimiz:**

* [Web sunucusu kurulumu](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API sunucusu yapılandırması](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [İletişim formları uygulama rehberi](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Arka Plan İşlemeleri: Üretim Güvenilirliği için Bree {#background-job-processing-bree-for-production-reliability}

**Kullandığımız:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) zamanlayıcı

Mevcut iş zamanlayıcıları, üretim Node.js ortamlarında işçi iş parçacığı desteği ve modern JavaScript özellikleri ihtiyaçlarımızı karşılamadığı için Bree'yi oluşturduk ve sürdürüyoruz. Bu, arka plan işlemleri, zamanlanmış görevler veya işçi iş parçacıkları gerektiren herhangi bir Node.js uygulaması için geçerlidir.

**Uygulama örneklerimiz:**

* [Bree sunucu kurulumu](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Tüm iş tanımlarımız](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [PM2 sağlık kontrol işi](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Temizlik işi uygulaması](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Hata Yönetimi: Üretim Güvenilirliği için @hapi/boom {#error-handling-hapiboom-for-production-reliability}

**Kullandığımız:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Node.js üretim uygulamalarımızda yapılandırılmış hata yanıtları için @hapi/boom kullanıyoruz. Bu kalıp, tutarlı hata yönetimi gereken herhangi bir Node.js uygulaması için geçerlidir.

**Uygulama örneklerimiz:**

* [Hata sınıflandırma yardımcı fonksiyonu](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Logger uygulaması](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)


## Üretimde Node.js Uygulamalarını Nasıl İzleriz {#how-to-monitor-nodejs-applications-in-production}

Üretimde Node.js uygulamalarını izleme yaklaşımımız, yıllarca ölçekli uygulamalar çalıştırarak evrildi. Her tür Node.js uygulaması için güvenilirlik ve performans sağlamak amacıyla izlemeyi birden fazla katmanda uyguluyoruz.

### Sistem Seviyesinde Node.js Üretim İzleme {#system-level-nodejs-production-monitoring}

**Temel uygulamamız:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Kullandığımız:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Üretim izleme eşiklerimiz (gerçek üretim kodumuzdan):

* **2GB heap boyutu limiti** ile otomatik uyarılar
* **%25 bellek kullanımı** uyarı eşiği
* **%80 CPU kullanımı** uyarı eşiği
* **%75 disk kullanımı** uyarı eşiği

> \[!WARNING]
> Bu eşikler, bizim özel donanım konfigürasyonumuz için geçerlidir. Node.js üretim izlemesi uygularken, tam mantığı anlamak ve değerleri kendi kurulumunuza uyarlamak için monitor-server.js uygulamamızı inceleyin.

### Uygulama Seviyesinde Node.js Üretim İzleme {#application-level-monitoring-for-nodejs-production}

**Hata sınıflandırmamız:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Bu yardımcı fonksiyon şunları ayırt eder:

* **Derhal müdahale gerektiren gerçek kod hataları**
* **Beklenen davranış olan kullanıcı hataları**
* **Kontrol edemediğimiz dış servis hataları**

Bu kalıp, web uygulamaları, API'ler, mikroservisler veya arka plan servisleri gibi herhangi bir Node.js uygulaması için geçerlidir.
**Kayıt uygulamamız:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Node.js üretim ortamımızda faydalı hata ayıklama yeteneklerini korurken hassas bilgileri korumak için kapsamlı alan sansürleme uyguluyoruz.

### Uygulamaya Özel İzleme {#application-specific-monitoring}

**Sunucu uygulamalarımız:**

* [SMTP sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3 sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Kuyruk izleme:** Kaynak tükenmesini önlemek için 5GB kuyruk sınırları ve istek işleme için 180 saniyelik zaman aşımı uyguluyoruz. Bu desenler, kuyrukları veya arka plan işlemleri olan herhangi bir Node.js uygulamasına uygulanır.


## PM2 Sağlık Kontrolleri ile Node.js Üretim İzleme {#nodejs-production-monitoring-with-pm2-health-checks}

Yılların üretim deneyimiyle PM2 kullanarak Node.js üretim ortamı kurulumumuzu geliştirdik. PM2 sağlık kontrollerimiz, herhangi bir Node.js uygulamasında güvenilirliği sürdürmek için çok önemlidir.

### PM2 Sağlık Kontrol Sistemimiz {#our-pm2-health-check-system}

**Temel uygulamamız:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

PM2 sağlık kontrolleri ile Node.js üretim izlememiz şunları içerir:

* **Her 20 dakikada bir çalışır** cron zamanlaması ile
* **Bir işlemi sağlıklı saymadan önce en az 15 dakika çalışma süresi gerektirir**
* **İşlem durumu ve bellek kullanımını doğrular**
* **Başarısız işlemleri otomatik olarak yeniden başlatır**
* **Akıllı sağlık kontrolü ile yeniden başlatma döngülerini önler**

> \[!CAUTION]
> Node.js üretim dağıtımı en iyi uygulamaları için, yeniden başlatma döngülerini önlemek amacıyla bir işlemi sağlıklı saymadan önce 15+ dakika çalışma süresi gerektiriyoruz. Bu, işlemler bellek veya diğer sorunlarla mücadele ederken zincirleme hataları önler.

### PM2 Üretim Yapılandırmamız {#our-pm2-production-configuration}

**Ekosistem kurulumumuz:** Node.js üretim ortamı kurulumu için sunucu başlatma dosyalarımızı inceleyin:

* [Web sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree zamanlayıcı](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Bu desenler, Express uygulamaları, Koa sunucuları, GraphQL API'leri veya diğer herhangi bir Node.js uygulaması çalıştırıyor olsanız da geçerlidir.

### Otomatik PM2 Dağıtımı {#automated-pm2-deployment}

**PM2 dağıtımı:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Tüm PM2 kurulumumuzu Ansible ile otomatikleştiriyoruz, böylece tüm sunucularımızda tutarlı Node.js üretim dağıtımları sağlıyoruz.


## Üretim Hata Yönetimi ve Sınıflandırma Sistemi {#production-error-handling-and-classification-system}

En değerli Node.js üretim dağıtımı en iyi uygulamalarımızdan biri, herhangi bir Node.js uygulamasına uygulanabilen akıllı hata sınıflandırmasıdır:

### Üretim için isCodeBug Uygulamamız {#our-iscodebug-implementation-for-production}

**Kaynak:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Bu yardımcı, üretimdeki Node.js uygulamaları için akıllı hata sınıflandırması sağlar:

* **Kullanıcı hatalarından ziyade gerçek hatalara öncelik verir**
* **Gerçek sorunlara odaklanarak olay müdahalemizi iyileştirir**
* **Beklenen kullanıcı hatalarından kaynaklanan uyarı yorgunluğunu azaltır**
* **Uygulama ile kullanıcı kaynaklı sorunları daha iyi anlamamızı sağlar**

Bu desen, e-ticaret siteleri, SaaS platformları, API'ler veya mikroservisler geliştiriyor olun fark etmeksizin herhangi bir Node.js uygulaması için çalışır.

### Üretim Kayıtlarımızla Entegrasyon {#integration-with-our-production-logging}

**Logger entegrasyonumuz:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
Logger’ımız, gerçek sorunlar hakkında bildirim almamızı sağlarken Node.js üretim ortamımızdaki gürültüyü filtrelemek için uyarı seviyelerini ve alan gizlemeyi belirlemek üzere `isCodeBug` kullanır.

### İlgili İçerik {#related-content-1}

Hata yönetimi kalıplarımız hakkında daha fazla bilgi edinin:

* [Güvenilir Ödeme Sistemi Kurmak](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Hata yönetimi kalıpları
* [E-posta Gizlilik Koruması](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Güvenlik hata yönetimi


## v8-profiler-next ve cpupro ile Gelişmiş Performans Hata Ayıklama {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Üretim ortamımızda heap anlık görüntülerini analiz etmek ve OOM (Bellek Yetersizliği) sorunlarını, performans darboğazlarını ve Node.js bellek problemlerini hata ayıklamak için gelişmiş profil oluşturma araçları kullanıyoruz. Bu araçlar, bellek sızıntısı veya performans sorunları yaşayan herhangi bir Node.js uygulaması için çok önemlidir.

### Node.js Üretimi İçin Profil Oluşturma Yaklaşımımız {#our-profiling-approach-for-nodejs-production}

**Önerdiğimiz araçlar:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Heap anlık görüntüleri ve CPU profilleri oluşturmak için
* [`cpupro`](https://github.com/discoveryjs/cpupro) - CPU profilleri ve heap anlık görüntülerini analiz etmek için

> \[!TIP]
> Node.js uygulamalarımız için eksiksiz bir performans hata ayıklama iş akışı oluşturmak üzere v8-profiler-next ve cpupro’yu birlikte kullanıyoruz. Bu kombinasyon, bellek sızıntılarını, performans darboğazlarını tespit etmemize ve üretim kodumuzu optimize etmemize yardımcı olur.

### Heap Anlık Görüntü Analizini Nasıl Uyguluyoruz {#how-we-implement-heap-snapshot-analysis}

**İzleme uygulamamız:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Üretim izlememiz, bellek eşik değerleri aşıldığında otomatik heap anlık görüntüsü oluşturmayı içerir. Bu, uygulama çökmelerine neden olmadan önce OOM sorunlarını hata ayıklamamıza yardımcı olur.

**Temel uygulama kalıpları:**

* Heap boyutu 2GB eşik değerini aştığında **otomatik anlık görüntüler**
* Üretimde talep üzerine analiz için **sinyal tabanlı profil oluşturma**
* Anlık görüntü depolamasını yönetmek için **saklama politikaları**
* Otomatik bakım için **temizlik işleri ile entegrasyon**

### Performans Hata Ayıklama İş Akışı {#performance-debugging-workflow}

**Gerçek uygulamamızı inceleyin:**

* [Sunucu izleme uygulaması](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Heap izleme ve anlık görüntü oluşturma
* [Temizlik işi](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Anlık görüntü saklama ve temizlik
* [Logger entegrasyonu](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Performans kaydı

### Node.js Uygulamanız İçin Önerilen Uygulama {#recommended-implementation-for-your-nodejs-application}

**Heap anlık görüntü analizi için:**

1. Anlık görüntü oluşturmak için **v8-profiler-next’i yükleyin**
2. Oluşturulan anlık görüntüleri analiz etmek için **cpupro’yu kullanın**
3. `monitor-server.js` benzeri **izleme eşik değerleri uygulayın**
4. Anlık görüntü depolamasını yönetmek için **otomatik temizlik kurun**
5. Üretimde talep üzerine profil oluşturma için **sinyal işleyicileri oluşturun**

**CPU profilleme için:**

1. Yüksek trafik dönemlerinde **CPU profilleri oluşturun**
2. Darboğazları tespit etmek için **cpupro ile analiz edin**
3. Sıcak yollar ve optimizasyon fırsatlarına **odaklanın**
4. Performans iyileştirmelerinden önce/sonra **izleme yapın**

> \[!WARNING]
> Heap anlık görüntüleri ve CPU profilleri oluşturmak performansı etkileyebilir. Profil oluşturmayı yalnızca belirli sorunları araştırırken veya bakım pencerelerinde etkinleştirmenizi ve sınırlama uygulamanızı öneririz.

### Üretim İzlememizle Entegrasyon {#integration-with-our-production-monitoring}

Profil oluşturma araçlarımız, daha geniş izleme stratejimizle entegre olur:

* Bellek/CPU eşik değerlerine göre **otomatik tetikleme**
* Performans sorunları tespit edildiğinde **uyarı entegrasyonu**
* Zaman içinde performans trendlerini izlemek için **tarihsel analiz**
* Kapsamlı hata ayıklama için **uygulama metrikleri ile korelasyon**
Bu yaklaşım, bellek sızıntılarını tespit etmemize ve çözmemize, sıcak kod yollarını optimize etmemize ve Node.js üretim ortamımızda kararlı performansı sürdürmemize yardımcı oldu.


## Node.js Üretim Altyapısı Güvenliği {#nodejs-production-infrastructure-security}

Node.js üretim altyapımız için kapsamlı güvenliği Ansible otomasyonu ile uygularız. Bu uygulamalar herhangi bir Node.js uygulaması için geçerlidir:

### Node.js Üretimi için Sistem Düzeyi Güvenlik {#system-level-security-for-nodejs-production}

**Ansible uygulamamız:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Node.js üretim ortamları için temel güvenlik önlemlerimiz:

* **Swap devre dışı bırakıldı** hassas verilerin diske yazılmasını önlemek için
* **Core dump devre dışı bırakıldı** hassas bilgileri içeren bellek dökümlerini önlemek için
* **USB depolama engellendi** yetkisiz veri erişimini önlemek için
* **Çekirdek parametre ayarları** hem güvenlik hem performans için

> \[!WARNING]
> Node.js üretim dağıtımı en iyi uygulamalarını uygularken, swap devre dışı bırakmak uygulamanız mevcut RAM'i aşarsa bellek yetersizliği nedeniyle süreçlerin sonlandırılmasına neden olabilir. Bellek kullanımını dikkatle izliyor ve sunucularımızı uygun şekilde boyutlandırıyoruz.

### Node.js Uygulamaları için Uygulama Güvenliği {#application-security-for-nodejs-applications}

**Log alanı sansürleme:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Parolalar, tokenlar, API anahtarları ve kişisel bilgiler dahil olmak üzere hassas alanları loglardan sansürlüyoruz. Bu, kullanıcı gizliliğini korurken herhangi bir Node.js üretim ortamında hata ayıklama yeteneklerini sürdürür.

### Altyapı Güvenliği Otomasyonu {#infrastructure-security-automation}

**Node.js üretimi için tam Ansible kurulumu:**

* [Güvenlik playbook'u](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [SSH anahtar yönetimi](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Sertifika yönetimi](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [DKIM kurulumu](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Güvenlik İçeriğimiz {#our-security-content}

Güvenlik yaklaşımımız hakkında daha fazla bilgi edinin:

* [En İyi Güvenlik Denetim Şirketleri](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Kuantum Güvenli Şifreli E-posta](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Neden Açık Kaynak E-posta Güvenliği](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)


## Node.js Uygulamaları için Veritabanı Mimarisi {#database-architecture-for-nodejs-applications}

Node.js uygulamalarımız için optimize edilmiş hibrit bir veritabanı yaklaşımı kullanıyoruz. Bu desenler herhangi bir Node.js uygulamasına uyarlanabilir:

### Node.js Üretimi için SQLite Uygulaması {#sqlite-implementation-for-nodejs-production}

**Kullandıklarımız:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Yapılandırmamız:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Node.js uygulamalarımızda kullanıcıya özel veriler için SQLite kullanıyoruz çünkü:

* **Kullanıcı/tenant başına veri izolasyonu**
* **Tek kullanıcı sorguları için daha iyi performans**
* **Basitleştirilmiş yedekleme** ve taşıma
* **Paylaşılan veritabanlarına kıyasla azalmış karmaşıklık**

Bu desen SaaS uygulamaları, çoklu tenant sistemleri veya veri izolasyonu gereken herhangi bir Node.js uygulaması için iyi çalışır.

### Node.js Üretimi için MongoDB Uygulaması {#mongodb-implementation-for-nodejs-production}

**Kullandıklarımız:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
**Kurulum uygulamamız:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Yapılandırmamız:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Node.js üretim ortamımızda uygulama verileri için MongoDB kullanıyoruz çünkü şunları sağlar:

* **Esnek şema** gelişen veri yapıları için
* **Daha iyi performans** karmaşık sorgular için
* **Yatay ölçeklenebilirlik** yetenekleri
* **Zengin sorgu dili**

> \[!NOTE]
> Hibrit yaklaşımımız belirli kullanım durumumuz için optimize edilmiştir. Bu yaklaşımın Node.js uygulamanızın ihtiyaçlarına uyup uymadığını anlamak için kod tabanındaki gerçek veritabanı kullanım desenlerimizi inceleyin.


## Node.js Üretim Arka Plan İşlem İşleme {#nodejs-production-background-job-processing}

Arka plan iş mimarimizi güvenilir Node.js üretim dağıtımı için Bree etrafında kurduk. Bu, arka plan işlemi gereken herhangi bir Node.js uygulaması için geçerlidir:

### Üretim için Bree Sunucu Kurulumumuz {#our-bree-server-setup-for-production}

**Ana uygulamamız:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Ansible dağıtımımız:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Üretim İş Örnekleri {#production-job-examples}

**Sağlık izleme:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Temizlik otomasyonu:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Tüm işlerimiz:** [Tam iş dizinimize göz atın](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Bu desenler, aşağıdakilere ihtiyaç duyan herhangi bir Node.js uygulaması için geçerlidir:

* Planlanmış görevler (veri işleme, raporlar, temizlik)
* Arka plan işlemleri (resim yeniden boyutlandırma, e-posta gönderimi, veri aktarımları)
* Sağlık izleme ve bakım
* CPU yoğun görevler için işçi iş parçacığı kullanımı

### Node.js Üretim için İş Zamanlama Desenlerimiz {#our-job-scheduling-patterns-for-nodejs-production}

Gerçek iş zamanlama desenlerimizi anlamak için iş dizinimizi inceleyin:

* Node.js üretimde cron benzeri zamanlamayı nasıl uyguladığımız
* Hata yönetimi ve yeniden deneme mantığımız
* CPU yoğun görevler için işçi iş parçacıklarını nasıl kullandığımız


## Üretim Node.js Uygulamaları için Otomatik Bakım {#automated-maintenance-for-production-nodejs-applications}

Yaygın Node.js üretim sorunlarını önlemek için proaktif bakım uygularız. Bu desenler herhangi bir Node.js uygulaması için geçerlidir:

### Temizlik Uygulamamız {#our-cleanup-implementation}

**Kaynak:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Node.js üretim uygulamaları için otomatik bakımımız hedefler:

* **24 saatten eski geçici dosyalar**
* **Saklama sınırlarını aşan günlük dosyaları**
* **Önbellek dosyaları** ve geçici veriler
* **Artık ihtiyaç duyulmayan yüklenen dosyalar**
* Performans hata ayıklama için **Heap anlık görüntüleri**

Bu desenler, geçici dosya, günlük veya önbelleğe alınmış veri üreten herhangi bir Node.js uygulaması için geçerlidir.

### Node.js Üretim için Disk Alanı Yönetimi {#disk-space-management-for-nodejs-production}

**İzleme eşiklerimiz:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* Arka plan işlemleri için **Kuyruk sınırları**
* **%75 disk kullanımı** uyarı eşiği
* Eşikler aşıldığında **otomatik temizlik**

### Altyapı Bakım Otomasyonu {#infrastructure-maintenance-automation}

**Node.js üretim için Ansible otomasyonumuz:**

* [Ortam dağıtımı](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Dağıtım anahtarları yönetimi](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)


## Node.js Üretim Dağıtım Uygulama Kılavuzu {#nodejs-production-deployment-implementation-guide}
### Üretim İçin Gerçek Kodumuzu İnceleyin {#study-our-actual-code-for-production-best-practices}

**Node.js üretim ortamı kurulumu için bu temel dosyalarla başlayın:**

1. **Yapılandırma:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **İzleme:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Hata yönetimi:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Kayıt tutma:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Süreç sağlığı:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Blog Yazılarımızdan Öğrenin {#learn-from-our-blog-posts}

**Node.js üretimi için teknik uygulama rehberlerimiz:**

* [NPM Paketleri Ekosistemi](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Ödeme Sistemleri Kurmak](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [E-posta Gizliliği Uygulaması](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript İletişim Formları](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React E-posta Entegrasyonu](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Node.js Üretimi İçin Altyapı Otomasyonu {#infrastructure-automation-for-nodejs-production}

**Node.js üretim dağıtımı için incelemeniz gereken Ansible playbook’larımız:**

* [Tam playbook dizini](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Güvenlik sertleştirme](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js kurulumu](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Vaka Çalışmalarımız {#our-case-studies}

**Kurumsal uygulamalarımız:**

* [Linux Foundation Vaka Çalışması](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu Vaka Çalışması](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Mezun E-posta Yönlendirme](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)


## Sonuç: Node.js Üretim Dağıtımı En İyi Uygulamaları {#conclusion-nodejs-production-deployment-best-practices}

Node.js üretim altyapımız, Node.js uygulamalarının kurumsal düzeyde güvenilirliğe ulaşabileceğini göstermektedir:

* **Kanıtlanmış donanım seçimleri** (AMD Ryzen ile %573 tek çekirdek performans optimizasyonu)
* **Sınırları belirlenmiş ve otomatik yanıtlar içeren savaşta test edilmiş Node.js üretim izleme**
* **Üretim ortamlarında olay müdahalesini geliştiren akıllı hata sınıflandırması**
* **OOM önleme için v8-profiler-next ve cpupro ile gelişmiş performans hata ayıklama**
* **Ansible otomasyonu ile kapsamlı güvenlik sertleştirme**
* **Uygulama ihtiyaçlarına göre optimize edilmiş hibrit veritabanı mimarisi**
* **Yaygın Node.js üretim sorunlarını önlemek için otomatik bakım**

**Ana çıkarım:** Genel en iyi uygulamaları takip etmek yerine gerçek uygulama dosyalarımızı ve blog yazılarımızı inceleyin. Kod tabanımız, web uygulamaları, API’ler, mikroservisler veya arka plan servisleri gibi herhangi bir Node.js uygulaması için uyarlanabilecek gerçek dünya Node.js üretim dağıtım kalıpları sunar.


## Node.js Üretimi İçin Tam Kaynak Listesi {#complete-resource-list-for-nodejs-production}

### Temel Uygulama Dosyalarımız {#our-core-implementation-files}

* [Ana yapılandırma](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Paket bağımlılıkları](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Sunucu izleme](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Hata sınıflandırması](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Kayıt sistemi](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [PM2 sağlık kontrolleri](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Otomatik temizlik](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)
### Sunucu Uygulamalarımız {#our-server-implementations}

* [Web sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree zamanlayıcı](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3 sunucusu](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Altyapı Otomasyonumuz {#our-infrastructure-automation}

* [Tüm Ansible playbook'larımız](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Güvenlik sertleştirme](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js kurulumu](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Veritabanı yapılandırması](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Teknik Blog Yazılarımız {#our-technical-blog-posts}

* [NPM Ekosistem Analizi](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Ödeme Sistemi Uygulaması](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [E-posta Gizliliği Teknik Rehberi](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript İletişim Formları](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React E-posta Entegrasyonu](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Kendi Kendine Barındırılan Çözüm Rehberi](https://forwardemail.net/blog/docs/self-hosted-solution)

### Kurumsal Vaka Çalışmalarımız {#our-enterprise-case-studies}

* [Linux Foundation Uygulaması](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu Vaka Çalışması](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Federal Hükümet Uyumluluğu](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Mezun E-posta Sistemleri](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)
