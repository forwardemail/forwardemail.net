# Kendi Kendine Barındırılan E-posta: Açık Kaynak Taahhüdü {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="" class="rounded-lg" />

## İçindekiler {#table-of-contents}

* [Önsöz](#foreword)
* [Kendinden Barındırılan E-postanın Önemi](#why-self-hosted-email-matters)
  * [Geleneksel E-posta Hizmetlerindeki Sorun](#the-problem-with-traditional-email-services)
  * [Kendi Kendine Barındırılan Alternatif](#the-self-hosted-alternative)
* [Kendi Kendine Barındırılan Uygulamamız: Teknik Genel Bakış](#our-self-hosted-implementation-technical-overview)
  * [Basitlik ve Taşınabilirlik için Docker Tabanlı Mimari](#docker-based-architecture-for-simplicity-and-portability)
  * [Bash Script Kurulumu: Erişilebilirlik Güvenlikle Buluşuyor](#bash-script-installation-accessibility-meets-security)
  * [Geleceğe Hazır Gizlilik İçin Kuantum Güvenli Şifreleme](#quantum-safe-encryption-for-future-proof-privacy)
  * [Otomatik Bakım ve Güncellemeler](#automated-maintenance-and-updates)
* [Açık Kaynak Taahhüdü](#the-open-source-commitment)
* [Kendinden Barındırılan ve Yönetilen: Doğru Seçimi Yapmak](#self-hosted-vs-managed-making-the-right-choice)
  * [Kendi Kendine Barındırılan E-postanın Gerçeği](#the-reality-of-self-hosting-email)
  * [Yönetilen Hizmetimizi Ne Zaman Seçmelisiniz?](#when-to-choose-our-managed-service)
* [Kendinden Barındırılan Yönlendirilmiş E-postaya Başlarken](#getting-started-with-self-hosted-forward-email)
  * [Sistem Gereksinimleri](#system-requirements)
  * [Kurulum Adımları](#installation-steps)
* [Kendinden Barındırılan E-postanın Geleceği](#the-future-of-self-hosted-email)
* [Sonuç: Herkes İçin E-posta Özgürlüğü](#conclusion-email-freedom-for-everyone)
* [Referanslar](#references)

## Önsöz {#foreword}

Günümüzün dijital ortamında, e-posta çevrimiçi kimliğimizin ve iletişimimizin omurgasını oluşturmaya devam ediyor. Ancak, gizlilik endişeleri arttıkça, birçok kullanıcı zor bir seçimle karşı karşıya kalıyor: gizlilik pahasına kolaylık veya kolaylık pahasına gizlilik. Forward Email'de, her zaman ikisi arasında seçim yapmak zorunda olmamanız gerektiğine inandık.

Bugün, yolculuğumuzda önemli bir dönüm noktasını duyurmaktan heyecan duyuyoruz: kendi barındırdığımız e-posta çözümümüzün lansmanı. Bu özellik, açık kaynak ilkelerine, gizlilik odaklı tasarıma ve kullanıcı güçlendirmesine olan en derin bağlılığımızı temsil ediyor. Kendi barındırdığımız seçeneğimizle, e-posta iletişiminizin tüm gücünü ve kontrolünü doğrudan ellerinize veriyoruz.

Bu blog yazısı, kendi barındırdığımız çözümümüzün ardındaki felsefeyi, teknik uygulamasını ve dijital iletişimlerinde hem gizliliğe hem de sahipliğe öncelik veren kullanıcılar için neden önemli olduğunu inceliyor.

## Kendinden Barındırılan E-postanın Önemi {#why-self-hosted-email-matters}

Kendi barındırdığımız e-posta çözümümüz, gerçek gizliliğin kontrol anlamına geldiğine ve kontrolün açık kaynakla başladığına olan inancımızın en açık ifadesidir. Dijital iletişimleri üzerinde tam mülkiyet talep eden kullanıcılar için kendi kendine barındırma artık uç bir fikir değil, olmazsa olmaz bir haktır. Kendi şartlarınıza göre çalıştırabileceğiniz tamamen açık, doğrulanabilir bir platformla bu inancın arkasında durmaktan gurur duyuyoruz.

### Geleneksel E-posta Hizmetlerindeki Sorun {#the-problem-with-traditional-email-services}

Geleneksel e-posta servisleri, gizliliğe önem veren kullanıcılar için bazı temel zorluklar ortaya çıkarıyor:

1. **Güven Gereksinimleri**: Sağlayıcının verilerinize erişmeyeceğine, bunları analiz etmeyeceğine veya paylaşmayacağına güvenmelisiniz
2. **Merkezi Kontrol**: Erişiminiz herhangi bir zamanda herhangi bir nedenle iptal edilebilir
3. **Gözetim Açığı**: Merkezi hizmetler gözetim için birincil hedeflerdir
4. **Sınırlı Şeffaflık**: Çoğu hizmet tescilli, kapalı kaynaklı yazılım kullanır
5. **Satıcı Kilitlenmesi**: Bu hizmetlerden uzaklaşmak zor veya imkansız olabilir

"Gizlilik odaklı" e-posta sağlayıcıları bile genellikle yalnızca ön uç uygulamalarını açık kaynaklı hale getirirken arka uç sistemlerini özel ve kapalı tutarak yetersiz kalmaktadır. Bu önemli bir güven boşluğu yaratır; gizlilik vaatlerine inanmanız istenir ancak bunları doğrulama olanağınız yoktur.

### Kendinden Barındırılan Alternatif {#the-self-hosted-alternative}

E-postanızı kendiniz barındırmak temelde farklı bir yaklaşım sunar:

1. **Tam Kontrol**: Tüm e-posta altyapısına sahip olursunuz ve onu kontrol edersiniz
2. **Doğrulanabilir Gizlilik**: Tüm sistem şeffaftır ve denetlenebilir
3. **Güven Gerekmez**: İletişimleriniz için üçüncü bir tarafa güvenmeniz gerekmez
4. **Özelleştirme Özgürlüğü**: Sistemi özel ihtiyaçlarınıza göre uyarlayın
5. **Dayanıklılık**: Hizmetiniz herhangi bir şirketin kararlarından bağımsız olarak devam eder

Bir kullanıcının söylediği gibi: "E-postamı kendim barındırmak, kendi yemeğimi yetiştirmekle aynı şey. Daha fazla iş gerektiriyor ama içinde ne olduğunu tam olarak biliyorum."

## Kendi Kendine Barındırılan Uygulamamız: Teknik Genel Bakış {#our-self-hosted-implementation-technical-overview}

Kendi barındırdığımız e-posta çözümümüz, tüm ürünlerimizi yönlendiren aynı gizlilik öncelikli ilkeler üzerine kurulmuştur. Bunu mümkün kılan teknik uygulamayı inceleyelim.

### Basitlik ve Taşınabilirlik için Docker Tabanlı Mimari {#docker-based-architecture-for-simplicity-and-portability}

Tüm e-posta altyapımızı Docker kullanarak paketledik ve bu sayede neredeyse tüm Linux tabanlı sistemlere kolayca dağıtılabilir hale getirdik. Bu kapsayıcı yaklaşım birkaç önemli avantaj sağlar:

1. **Basitleştirilmiş Dağıtım**: Tek bir komut tüm altyapıyı kurar
2. **Tutarlı Ortam**: "Benim makinemde çalışır" sorunlarını ortadan kaldırır
3. **İzole Bileşenler**: Her hizmet güvenlik için kendi konteynerinde çalışır
4. **Kolay Güncellemeler**: Tüm yığını güncellemek için basit komutlar
5. **Minimal Bağımlılıklar**: Yalnızca Docker ve Docker Compose gerektirir

Mimari şu kapsayıcıları içerir:

* Yönetim için web arayüzü
* Giden e-posta için SMTP sunucusu
* E-posta alımı için IMAP/POP3 sunucuları
* Takvimler için CalDAV sunucusu
* Kişiler için CardDAV sunucusu
* Yapılandırma depolama için veritabanı
* Önbelleğe alma ve performans için Redis
* Güvenli, şifrelenmiş posta kutusu depolama için SQLite

> \[!NOTE]
> Be sure to check out our [self-hosted developer guide](https://forwardemail.net/self-hosted)

### Bash Komut Dosyası Kurulumu: Erişilebilirlik Güvenlikle Buluşuyor {#bash-script-installation-accessibility-meets-security}

Kurulum sürecini, güvenlik en iyi uygulamalarını koruyarak mümkün olduğunca basit olacak şekilde tasarladık:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Bu tek komut:

1. Sistem gereksinimlerini doğrular
2. Yapılandırmada size rehberlik eder
3. DNS kayıtlarını ayarlar
4. TLS sertifikalarını yapılandırır
5. Docker kapsayıcılarını dağıtır
6. İlk güvenlik sertleştirmesini gerçekleştirir

Komut dosyalarını bash'e iletme konusunda endişeli olanlar için (ki öyle olmalısınız!), yürütmeden önce komut dosyasını incelemenizi öneririz. Tamamen açık kaynaklıdır ve incelemeye açıktır.

### Geleceğe Hazır Gizlilik için Kuantum Güvenli Şifreleme {#quantum-safe-encryption-for-future-proof-privacy}

Barındırılan hizmetimiz gibi, kendi barındırdığımız çözümümüz de SQLite veritabanları için şifre olarak ChaCha20-Poly1305 kullanarak kuantum dirençli şifreleme uygular. Bu yaklaşım, e-posta verilerinizi yalnızca mevcut tehditlere karşı değil, aynı zamanda gelecekteki kuantum hesaplama saldırılarına karşı da korur.

Her posta kutusu kendi şifrelenmiş SQLite veritabanı dosyasında saklanır ve bu sayede kullanıcılar arasında tam bir izolasyon sağlanır; bu da geleneksel paylaşımlı veritabanı yaklaşımlarına kıyasla önemli bir güvenlik avantajıdır.

### Otomatik Bakım ve Güncellemeler {#automated-maintenance-and-updates}

Kapsamlı bakım yardımcı programlarını doğrudan kendi barındırdığımız çözüme entegre ettik:

1. **Otomatik Yedeklemeler**: Tüm kritik verilerin planlı yedeklemeleri
2. **Sertifika Yenileme**: Otomatik Let's Encrypt sertifika yönetimi
3. **Sistem Güncellemeleri**: En son sürüme güncellemek için basit komut
4. **Sağlık İzleme**: Sistem bütünlüğünü sağlamak için yerleşik kontroller

Bu yardımcı programlara basit bir etkileşimli menü aracılığıyla erişilebilir:

```bash
# script prompt

1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

## Açık Kaynak Taahhüdü {#the-open-source-commitment}

Kendi barındırdığımız e-posta çözümümüz, tüm ürünlerimiz gibi, %100 açık kaynaklıdır—hem ön uç hem de arka uç. Bu şu anlama gelir:

1. **Tam Şeffaflık**: E-postalarınızı işleyen her kod satırı kamu denetimine açıktır
2. **Topluluk Katkıları**: Herkes iyileştirmeler yapabilir veya sorunları düzeltebilir
3. **Açıklık Yoluyla Güvenlik**: Güvenlik açıkları küresel bir topluluk tarafından belirlenebilir ve düzeltilebilir
4. **Tedarikçiye Bağlılık Yok**: Şirketimizin varlığına asla bağımlı değilsiniz

Tüm kod tabanı GitHub'da <https://github.com/forwardemail/forwardemail.net>. adresinde mevcuttur

## Kendinden Barındırılan ve Yönetilen: Doğru Seçimi Yapmak {#self-hosted-vs-managed-making-the-right-choice}

Kendi kendine barındırılan bir seçenek sunmaktan gurur duysak da, bunun herkes için doğru tercih olmadığını biliyoruz. Kendi kendine barındırılan e-posta gerçek sorumluluklar ve zorluklarla birlikte gelir:

### Kendi Kendine Barındırılan E-postanın Gerçeği {#the-reality-of-self-hosting-email}

#### Teknik Hususlar {#technical-considerations}

* **Sunucu Yönetimi**: Bir VPS veya özel sunucuyu korumanız gerekecektir
* **DNS Yapılandırması**: Uygun DNS kurulumu, teslimat için kritik öneme sahiptir
* **Güvenlik Güncellemeleri**: Güvenlik yamalarıyla güncel kalmak esastır
* **Spam Yönetimi**: Spam filtrelemesini yönetmeniz gerekecektir
* **Yedekleme Stratejisi**: Güvenilir yedeklemeleri uygulamak sizin sorumluluğunuzdadır

#### Zaman Yatırımı {#time-investment}

* **İlk Kurulum**: Kurulum, doğrulama ve belgeleri okuma zamanı
* **Sürekli Bakım**: Zaman zaman güncellemeler ve izleme
* **Sorun Giderme**: Zaman zaman sorunları çözmek için zaman

#### Finansal Hususlar {#financial-considerations}

* **Sunucu Maliyetleri**: Temel bir VPS için ayda 5-20 ABD Doları
* **Alan Kaydı**: Yılda 10-20 ABD Doları
* **Zaman Değeri**: Zaman yatırımınızın gerçek değeri vardır

### Yönetilen Hizmetimizi Ne Zaman Seçmelisiniz? {#when-to-choose-our-managed-service}

Birçok kullanıcı için yönetilen hizmetimiz en iyi seçenek olmaya devam ediyor:

1. **Kolaylık**: Tüm bakım, güncelleme ve izlemeyi biz üstleniyoruz
2. **Güvenilirlik**: Yerleşik altyapımızdan ve uzmanlığımızdan yararlanın
3. **Destek**: Sorunlar ortaya çıktığında yardım alın
4. **Teslim edilebilirlik**: Yerleşik IP itibarımızdan yararlanın
5. **Maliyet Etkinliği**: Zaman maliyetlerini hesaba kattığınızda, hizmetimiz genellikle daha ekonomiktir

Her iki seçenek de aynı gizlilik avantajlarını ve açık kaynaklı şeffaflığı sağlıyor; tek fark, altyapıyı kimin yönettiğidir.

## Kendinden Barındırılan Yönlendirme E-postasına Başlarken {#getting-started-with-self-hosted-forward-email}

E-posta altyapınızın kontrolünü ele geçirmeye hazır mısınız? Başlamak için yapmanız gerekenler şunlardır:

### Sistem Gereksinimleri {#system-requirements}

* Ubuntu 20.04 LTS veya daha yenisi (önerilir)
* Minimum 1 GB RAM (2 GB+ önerilir)
* 20 GB depolama alanı önerilir
* Kontrolünüzde olan bir alan adı
* 25 numaralı portu destekleyen genel IP adresi
* [ters PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) ayarlayabilme
* IPv4 ve IPv6 desteği

> \[!TIP]
> We recommend several mail server providers at <https://forwardemail.net/blog/docs/best-mail-server-providers> (source at <https://github.com/forwardemail/awesome-mail-server-providers>)

### Kurulum Adımları {#installation-steps}

1. **Kurulum Komut Dosyasını Çalıştırın**:
```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Etkileşimli İstemleri Takip Edin**:
* Alan adınızı girin
* Yönetici kimlik bilgilerini yapılandırın
* DNS kayıtlarını talimatlara göre ayarlayın
* Tercih ettiğiniz yapılandırma seçeneklerini seçin

3. **Kurulumu Doğrulayın**:
Kurulum tamamlandıktan sonra, her şeyin çalıştığını şu şekilde doğrulayabilirsiniz:
* Konteyner durumunu kontrol edin: `docker ps`
* Bir test e-postası gönderin
* Web arayüzüne giriş yapın

## Kendinden Barındırılan E-postanın Geleceği {#the-future-of-self-hosted-email}

Kendi kendine barındırılan çözümümüz sadece bir başlangıç. Bu teklifi sürekli olarak geliştirmeye kararlıyız:

1. **Gelişmiş Yönetim Araçları**: Daha güçlü web tabanlı yönetim
2. **Ek Kimlik Doğrulama Seçenekleri**: Donanım güvenlik anahtarı desteği dahil
3. **Gelişmiş İzleme**: Sistem sağlığı ve performansına ilişkin daha iyi içgörüler
4. **Çoklu Sunucu Dağıtımı**: Yüksek kullanılabilirlik yapılandırmaları için seçenekler
5. **Topluluk Odaklı İyileştirmeler**: Kullanıcılardan gelen katkıların dahil edilmesi

## Sonuç: Herkes İçin E-posta Özgürlüğü {#conclusion-email-freedom-for-everyone}

Kendi barındırdığımız e-posta çözümümüzün lansmanı, gizlilik odaklı, şeffaf e-posta hizmetleri sunma misyonumuzda önemli bir dönüm noktasını temsil ediyor. Yönetilen hizmetimizi veya kendi barındırdığımız seçeneğimizi seçmeniz fark etmeksizin, açık kaynak ilkelerine ve gizlilik odaklı tasarıma olan sarsılmaz bağlılığımızdan faydalanırsınız.

E-posta, kullanıcı gizliliğinden çok veri toplamayı önceliklendiren kapalı, tescilli sistemler tarafından kontrol edilemeyecek kadar önemlidir. Forward Email'in kendi kendine barındırılan çözümüyle, dijital iletişimlerinizin tam kontrolünü size veren gerçek bir alternatif sunmaktan gurur duyuyoruz.

Gizliliğin sadece bir özellik olmadığına inanıyoruz; temel bir haktır. Ve kendi barındırdığımız e-posta seçeneğimizle bu hakkı her zamankinden daha erişilebilir hale getiriyoruz.

E-postanızın kontrolünü ele geçirmeye hazır mısınız? [Bugün başlayın](https://forwardemail.net/self-hosted) veya daha fazla bilgi edinmek için [GitHub deposu](https://github.com/forwardemail/forwardemail.net) sayfamızı inceleyin.

## Referanslar {#references}

\[1] E-postayı GitHub Deposuna İlet: <https://github.com/forwardemail/forwardemail.net>

\[2] Kendinden Barındırılan Belgeler: <https://forwardemail.net/en/self-hosted>

\[3] E-posta Gizliliği Teknik Uygulaması: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Açık Kaynaklı E-postanın Önemi: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>