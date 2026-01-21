# Kendi Kendine Barındırılan E-posta: Açık Kaynak Taahhüdü {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Self-hosted email solution illustration" class="rounded-lg" />

## İçindekiler {#table-of-contents}

* [Önsöz](#foreword)
* [Kendinden Barındırılan E-postanın Önemi](#why-self-hosted-email-matters)
  * [Geleneksel E-posta Hizmetlerindeki Sorun](#the-problem-with-traditional-email-services)
  * [Kendinden Barındırılan Alternatif](#the-self-hosted-alternative)
* [Kendi Kendine Barındırılan Uygulamamız: Teknik Genel Bakış](#our-self-hosted-implementation-technical-overview)
  * [Basitlik ve Taşınabilirlik için Docker Tabanlı Mimari](#docker-based-architecture-for-simplicity-and-portability)
  * [Bash Script Kurulumu: Erişilebilirlik Güvenlikle Buluşuyor](#bash-script-installation-accessibility-meets-security)
  * [Geleceğe Hazır Gizlilik için Kuantum Güvenli Şifreleme](#quantum-safe-encryption-for-future-proof-privacy)
  * [Otomatik Bakım ve Güncellemeler](#automated-maintenance-and-updates)
* [Açık Kaynak Taahhüdü](#the-open-source-commitment)
* [Kendinden Barındırılan ve Yönetilen: Doğru Seçimi Yapmak](#self-hosted-vs-managed-making-the-right-choice)
  * [Kendi Kendine Barındırılan E-postanın Gerçeği](#the-reality-of-self-hosting-email)
  * [Yönetilen Hizmetimizi Ne Zaman Seçmelisiniz?](#when-to-choose-our-managed-service)
* [Kendinden Barındırılan Yönlendirme E-postasına Başlarken](#getting-started-with-self-hosted-forward-email)
  * [Sistem Gereksinimleri](#system-requirements)
  * [Kurulum Adımları](#installation-steps)
* [Kendinden Barındırılan E-postanın Geleceği](#the-future-of-self-hosted-email)
* [Sonuç: Herkes İçin E-posta Özgürlüğü](#conclusion-email-freedom-for-everyone)
* [Referanslar](#references)

## Önsöz {#foreword}

Günümüzün dijital dünyasında e-posta, çevrimiçi kimliğimizin ve iletişimimizin omurgasını oluşturmaya devam ediyor. Ancak gizlilik endişeleri arttıkça, birçok kullanıcı zor bir seçimle karşı karşıya: gizlilik pahasına kolaylık mı, yoksa kolaylık pahasına gizlilik mi? Forward Email olarak, her zaman ikisi arasında seçim yapmak zorunda kalmamanız gerektiğine inandık.

Bugün, yolculuğumuzda önemli bir dönüm noktasını duyurmaktan heyecan duyuyoruz: kendi barındırdığımız e-posta çözümümüzün lansmanı. Bu özellik, açık kaynak ilkelerine, gizlilik odaklı tasarıma ve kullanıcı yetkilendirmesine olan en derin bağlılığımızı temsil ediyor. Kendi barındırdığımız seçeneğimizle, e-posta iletişiminizin tüm gücünü ve kontrolünü doğrudan ellerinize veriyoruz.

Bu blog yazısı, kendi barındırdığımız çözümümüzün ardındaki felsefeyi, teknik uygulamasını ve dijital iletişimlerinde hem gizliliğe hem de mülkiyete öncelik veren kullanıcılar için neden önemli olduğunu inceliyor.

## Kendinden Barındırılan E-postanın Önemi {#why-self-hosted-email-matters}

Kendi barındırdığımız e-posta çözümümüz, gerçek gizliliğin kontrol anlamına geldiğine ve kontrolün açık kaynakla başladığına olan inancımızın en açık ifadesidir. Dijital iletişimleri üzerinde tam mülkiyet talep eden kullanıcılar için kendi barındırma artık uç bir fikir değil, olmazsa olmaz bir haktır. Kendi şartlarınızla yönetebileceğiniz, tamamen açık ve doğrulanabilir bir platformla bu inancın arkasında durmaktan gurur duyuyoruz.

### Geleneksel E-posta Hizmetlerindeki Sorun {#the-problem-with-traditional-email-services}

Geleneksel e-posta servisleri, gizlilik konusunda bilinçli kullanıcılar için bazı temel zorluklar ortaya çıkarıyor:

1. **Güven Gereksinimleri**: Sağlayıcının verilerinize erişmeyeceğine, analiz etmeyeceğine veya paylaşmayacağına güvenmelisiniz.
2. **Merkezi Kontrol**: Erişiminiz herhangi bir zamanda herhangi bir nedenle iptal edilebilir.
3. **Gözetim Açığı**: Merkezi hizmetler, gözetim için başlıca hedeflerdir.
4. **Sınırlı Şeffaflık**: Çoğu hizmet, tescilli, kapalı kaynaklı yazılım kullanır.
5. **Satıcı Bağımlılığı**: Bu hizmetlerden geçiş yapmak zor veya imkansız olabilir.

"Gizlilik odaklı" e-posta sağlayıcıları bile, arka uç sistemlerini özel ve kapalı tutarken, yalnızca ön uç uygulamalarını açık kaynaklı hale getirerek genellikle yetersiz kalmaktadır. Bu durum, önemli bir güven boşluğu yaratmaktadır; gizlilik vaatlerine inanmanız istenirken, bunları doğrulama olanağınız yoktur.

### Kendinden Barındırılan Alternatif {#the-self-hosted-alternative}

E-postanızı kendiniz barındırmanız temelde farklı bir yaklaşım sağlar:

1. **Tam Kontrol**: Tüm e-posta altyapısının sahibi ve kontrol sahibi sizsiniz.
2. **Doğrulanabilir Gizlilik**: Tüm sistem şeffaf ve denetlenebilir.
3. **Güven Gerektirmez**: İletişimleriniz için üçüncü bir tarafa güvenmeniz gerekmez.
4. **Özelleştirme Özgürlüğü**: Sistemi özel ihtiyaçlarınıza göre uyarlayın.
5. **Dayanıklılık**: Hizmetiniz, herhangi bir şirketin kararlarından bağımsız olarak devam eder.

Bir kullanıcının söylediği gibi: "E-postamı kendim barındırmak, kendi yemeğimi yetiştirmekle aynı şey. Daha fazla iş gerektiriyor ama içinde ne olduğunu tam olarak biliyorum."

## Kendi Barındırdığımız Uygulama: Teknik Genel Bakış {#our-self-hosted-implementation-technical-overview}

Kendi barındırdığımız e-posta çözümümüz, tüm ürünlerimize rehberlik eden aynı gizlilik odaklı ilkeler üzerine kuruludur. Bunu mümkün kılan teknik uygulamayı inceleyelim.

### Basitlik ve Taşınabilirlik için Docker Tabanlı Mimari {#docker-based-architecture-for-simplicity-and-portability}

Tüm e-posta altyapımızı Docker kullanarak paketledik ve bu sayede neredeyse tüm Linux tabanlı sistemlere kolayca dağıtılabiliyor. Bu konteynerleştirilmiş yaklaşım, birkaç önemli avantaj sağlıyor:

1. **Basitleştirilmiş Dağıtım**: Tek bir komut tüm altyapıyı kurar
2. **Tutarlı Ortam**: "Benim makinemde çalışıyor" sorunlarını ortadan kaldırır
3. **İzole Bileşenler**: Her hizmet, güvenlik için kendi kapsayıcısında çalışır
4. **Kolay Güncellemeler**: Tüm yığını güncellemek için basit komutlar
5. **Minimum Bağımlılıklar**: Yalnızca Docker ve Docker Compose gerektirir

Mimaride şunlar için kapsayıcılar bulunur:

* Yönetim için web arayüzü
* Giden e-postalar için SMTP sunucusu
* E-posta alımı için IMAP/POP3 sunucuları
* Takvimler için CalDAV sunucusu
* Kişiler için CardDAV sunucusu
* Yapılandırma depolaması için veritabanı
* Önbelleğe alma ve performans için Redis
* Güvenli, şifreli posta kutusu depolaması için SQLite

> \[!NOTE]
> [kendi kendine barındırılan geliştirici kılavuzu](https://forwardemail.net/self-hosted)'imize göz atmayı unutmayın

### Bash Komut Dosyası Kurulumu: Erişilebilirlik Güvenlikle Buluşuyor {#bash-script-installation-accessibility-meets-security}

Kurulum sürecini, güvenlik en iyi uygulamalarını koruyarak mümkün olduğunca basit olacak şekilde tasarladık:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Bu tek komut:

1. Sistem gereksinimlerini doğrular
2. Yapılandırma sürecinde size rehberlik eder
3. DNS kayıtlarını ayarlar
4. TLS sertifikalarını yapılandırır
5. Docker kapsayıcılarını dağıtır
6. İlk güvenlik güçlendirmesini gerçekleştirir

Betikleri bash'e aktarma konusunda endişeleriniz varsa (ki olmalı!), çalıştırmadan önce betiği incelemenizi öneririz. Tamamen açık kaynaklıdır ve incelemeye açıktır.

### Geleceğe Hazır Gizlilik için Kuantum Güvenli Şifreleme {#quantum-safe-encryption-for-future-proof-privacy}

Barındırılan hizmetimiz gibi, kendi barındırdığımız çözümümüz de SQLite veritabanları için şifre olarak ChaCha20-Poly1305 kullanan kuantum dirençli şifreleme uygular. Bu yaklaşım, e-posta verilerinizi yalnızca mevcut tehditlere karşı değil, aynı zamanda gelecekteki kuantum bilişim saldırılarına karşı da korur.

Her posta kutusu kendi şifreli SQLite veritabanı dosyasında saklanır ve bu sayede kullanıcılar arasında tam bir izolasyon sağlanır; bu da geleneksel paylaşımlı veritabanı yaklaşımlarına kıyasla önemli bir güvenlik avantajıdır.

### Otomatik Bakım ve Güncellemeler {#automated-maintenance-and-updates}

Kapsamlı bakım yardımcı programlarını doğrudan kendi barındırdığımız çözüme entegre ettik:

1. **Otomatik Yedeklemeler**: Tüm kritik verilerin planlı yedeklemeleri
2. **Sertifika Yenileme**: Otomatik Let's Encrypt sertifika yönetimi
3. **Sistem Güncellemeleri**: En son sürüme güncellemek için basit bir komut
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

Kendi barındırdığımız e-posta çözümümüz, tüm ürünlerimiz gibi, hem ön uç hem de arka uç olarak %100 açık kaynaklıdır. Bu da şu anlama gelir:

1. **Tam Şeffaflık**: E-postalarınızı işleyen her kod satırı kamunun incelemesine açıktır.
2. **Topluluk Katkıları**: Herkes iyileştirmeler sunabilir veya sorunları giderebilir.
3. **Açıklık Yoluyla Güvenlik**: Güvenlik açıkları küresel bir topluluk tarafından tespit edilip giderilebilir.
4. **Tedarikçiye Bağlılık Yok**: Şirketimizin varlığına asla bağımlı değilsiniz.

Tüm kod tabanı GitHub'da <https://github.com/forwardemail/forwardemail.net>. adresinde mevcuttur

## Kendinden Barındırılan ve Yönetilen: Doğru Seçimi Yapmak {#self-hosted-vs-managed-making-the-right-choice}

Kendi kendine barındırılan bir seçenek sunmaktan gurur duysak da, bunun herkes için doğru seçim olmadığının farkındayız. Kendi kendine barındırılan e-posta, beraberinde gerçek sorumluluklar ve zorluklar getirir:

### Kendi Kendine Barındırılan E-postanın Gerçeği {#the-reality-of-self-hosting-email}

#### Teknik Hususlar {#technical-considerations}

* **Sunucu Yönetimi**: Bir VPS veya özel sunucuya sahip olmanız gerekecektir.
* **DNS Yapılandırması**: Doğru DNS kurulumu, teslimat için kritik öneme sahiptir.
* **Güvenlik Güncellemeleri**: Güvenlik yamalarını güncel tutmak çok önemlidir.
* **Spam Yönetimi**: Spam filtrelemesini yönetmeniz gerekecektir.
* **Yedekleme Stratejisi**: Güvenilir yedeklemeler uygulamak sizin sorumluluğunuzdadır.

#### Zaman Yatırımı {#time-investment}

* **İlk Kurulum**: Kurulum, doğrulama ve dokümanları okuma zamanı
* **Sürekli Bakım**: Zaman zaman güncellemeler ve izleme
* **Sorun Giderme**: Zaman zaman sorunları çözmek için zaman

#### Finansal Hususlar {#financial-considerations}

* **Sunucu Maliyetleri**: Temel bir VPS için aylık 5-20 ABD Doları
* **Alan Adı Kaydı**: Yıllık 10-20 ABD Doları
* **Zaman Değeri**: Zaman yatırımınızın gerçek değeri vardır

### Yönetilen Hizmetimizi Ne Zaman Seçmelisiniz? {#when-to-choose-our-managed-service}

Birçok kullanıcı için yönetilen hizmetimiz en iyi seçenek olmaya devam ediyor:

1. **Kullanışlılık**: Tüm bakım, güncelleme ve izleme işlemlerini biz üstleniyoruz.
2. **Güvenilirlik**: Köklü altyapımızdan ve uzmanlığımızdan yararlanın.
3. **Destek**: Sorunlar ortaya çıktığında yardım alın.
4. **Teslimat**: Köklü IP itibarımızdan yararlanın.
5. **Maliyet Etkinliği**: Zaman maliyetlerini de hesaba kattığınızda, hizmetimiz genellikle daha ekonomiktir.

Her iki seçenek de aynı gizlilik avantajlarını ve açık kaynaklı şeffaflığı sağlar; tek fark, altyapıyı kimin yönettiğidir.

## Kendinden Barındırılan Yönlendirme E-postasına Başlarken {#getting-started-with-self-hosted-forward-email}

E-posta altyapınızın kontrolünü ele geçirmeye hazır mısınız? İşte başlamanız için yapmanız gerekenler:

### Sistem Gereksinimleri {#system-requirements}

* Ubuntu 20.04 LTS veya daha yenisi (önerilir)
* Minimum 1 GB RAM (2 GB+ önerilir)
* 20 GB depolama alanı önerilir
* Kontrolünüzde olan bir alan adı
* 25 numaralı bağlantı noktasını destekleyen genel IP adresi
* [ters PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) ayarlayabilme
* IPv4 ve IPv6 desteği

> \[!TIP]
> <https://forwardemail.net/blog/docs/best-mail-server-providers> (kaynak <https://github.com/forwardemail/awesome-mail-server-providers>) adresindeki çeşitli posta sunucusu sağlayıcılarını öneriyoruz.

### Kurulum Adımları {#installation-steps}

1. **Kurulum Komut Dosyasını Çalıştırın**:
```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Etkileşimli Komutları Takip Edin**:
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

Kendi kendine barındırılan çözümümüz sadece bir başlangıç. Bu hizmeti sürekli olarak geliştirmeye kararlıyız:

1. **Gelişmiş Yönetim Araçları**: Daha güçlü web tabanlı yönetim
2. **Ek Kimlik Doğrulama Seçenekleri**: Donanım güvenlik anahtarı desteği dahil
3. **Gelişmiş İzleme**: Sistem sağlığı ve performansı hakkında daha iyi bilgiler
4. **Çoklu Sunucu Dağıtımı**: Yüksek kullanılabilirlik yapılandırmaları için seçenekler
5. **Topluluk Odaklı İyileştirmeler**: Kullanıcıların katkılarını dahil etme

## Sonuç: Herkes İçin E-posta Özgürlüğü {#conclusion-email-freedom-for-everyone}

Kendi barındırdığımız e-posta çözümümüzün lansmanı, gizlilik odaklı ve şeffaf e-posta hizmetleri sunma misyonumuzda önemli bir dönüm noktasını temsil ediyor. İster yönetilen hizmetimizi ister kendi barındırdığımız seçeneği tercih edin, açık kaynak ilkelerine ve gizlilik odaklı tasarıma olan sarsılmaz bağlılığımızdan faydalanacaksınız.

E-posta, kullanıcı gizliliğinden ziyade veri toplamayı önceliklendiren kapalı, özel sistemler tarafından kontrol edilemeyecek kadar önemlidir. Forward Email'in kendi kendine barındırılan çözümüyle, dijital iletişimleriniz üzerinde tam kontrol sahibi olmanızı sağlayan gerçek bir alternatif sunmaktan gurur duyuyoruz.

Gizliliğin sadece bir özellik değil, temel bir hak olduğuna inanıyoruz. Kendi barındırdığımız e-posta seçeneğimizle bu hakkı her zamankinden daha erişilebilir hale getiriyoruz.

E-postanızın kontrolünü ele almaya hazır mısınız? [Bugün başlayın](https://forwardemail.net/self-hosted) veya daha fazla bilgi edinmek için [GitHub deposu](https://github.com/forwardemail/forwardemail.net) sayfamızı inceleyin.

## Başvuruları {#references}

\[1] E-postayı GitHub Deposuna İlet: <https://github.com/forwardemail/forwardemail.net>

\[2] Kendi Kendine Barındırılan Belgeler: <https://forwardemail.net/en/self-hosted>

\[3] E-posta Gizliliği Teknik Uygulaması: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Açık Kaynaklı E-postanın Önemi: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>