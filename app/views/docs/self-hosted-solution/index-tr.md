# Kendi Sunucunuzda Barındırılan E-posta: Açık Kaynak Taahhüdü {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Kendi sunucunuzda barındırılan e-posta çözümü illüstrasyonu" class="rounded-lg" />


## İçindekiler {#table-of-contents}

* [Önsöz](#foreword)
* [Kendi Sunucunuzda Barındırılan E-postanın Önemi](#why-self-hosted-email-matters)
  * [Geleneksel E-posta Hizmetlerinin Sorunları](#the-problem-with-traditional-email-services)
  * [Kendi Sunucunuzda Barındırılan Alternatif](#the-self-hosted-alternative)
* [Kendi Sunucumuzda Barındırılan Uygulamamız: Teknik Genel Bakış](#our-self-hosted-implementation-technical-overview)
  * [Basitlik ve Taşınabilirlik için Docker Tabanlı Mimari](#docker-based-architecture-for-simplicity-and-portability)
  * [Bash Script Kurulumu: Erişilebilirlik ve Güvenlik](#bash-script-installation-accessibility-meets-security)
  * [Geleceğe Dayanıklı Gizlilik için Kuantum Güvenli Şifreleme](#quantum-safe-encryption-for-future-proof-privacy)
  * [Otomatik Bakım ve Güncellemeler](#automated-maintenance-and-updates)
* [Açık Kaynak Taahhüdü](#the-open-source-commitment)
* [Kendi Sunucunuzda Barındırılan vs. Yönetilen: Doğru Seçimi Yapmak](#self-hosted-vs-managed-making-the-right-choice)
  * [E-postayı Kendi Sunucunuzda Barındırmanın Gerçekleri](#the-reality-of-self-hosting-email)
  * [Yönetilen Hizmetimizi Ne Zaman Seçmelisiniz](#when-to-choose-our-managed-service)
* [Kendi Sunucunuzda Barındırılan Forward Email ile Başlamak](#getting-started-with-self-hosted-forward-email)
  * [Sistem Gereksinimleri](#system-requirements)
  * [Kurulum Adımları](#installation-steps)
* [Kendi Sunucunuzda Barındırılan E-postanın Geleceği](#the-future-of-self-hosted-email)
* [Sonuç: Herkes için E-posta Özgürlüğü](#conclusion-email-freedom-for-everyone)
* [Kaynaklar](#references)


## Önsöz {#foreword}

Bugünün dijital ortamında, e-posta çevrimiçi kimliğimizin ve iletişimimizin bel kemiği olmaya devam ediyor. Ancak gizlilik endişeleri arttıkça, birçok kullanıcı zor bir seçimle karşı karşıya kalıyor: gizliliğin bedeli olarak kolaylık mı, yoksa kolaylığın bedeli olarak gizlilik mi? Forward Email olarak, ikisi arasında seçim yapmak zorunda olmadığınıza her zaman inandık.

Bugün, yolculuğumuzda önemli bir dönüm noktasını duyurmaktan heyecan duyuyoruz: kendi sunucunuzda barındırılan e-posta çözümümüzün lansmanı. Bu özellik, açık kaynak ilkelerine, gizlilik odaklı tasarıma ve kullanıcı güçlendirmesine olan en derin bağlılığımızı temsil ediyor. Kendi sunucunuzda barındırılan seçeneğimizle, e-posta iletişiminizin tüm gücünü ve kontrolünü doğrudan sizin ellerinize veriyoruz.

Bu blog yazısı, kendi sunucunuzda barındırılan çözümümüzün arkasındaki felsefeyi, teknik uygulamasını ve dijital iletişimlerinde hem gizliliği hem de sahipliği önceliklendiren kullanıcılar için neden önemli olduğunu inceliyor.


## Kendi Sunucunuzda Barındırılan E-postanın Önemi {#why-self-hosted-email-matters}

Kendi sunucunuzda barındırılan e-posta çözümümüz, gerçek gizliliğin kontrol anlamına geldiği ve kontrolün açık kaynakla başladığı inancımızın en net ifadesidir. Dijital iletişimleri üzerinde tam sahiplik talep eden kullanıcılar için kendi sunucunuzda barındırmak artık marjinal bir fikir değil — temel bir haktır. Kendi şartlarınızda çalıştırabileceğiniz tamamen açık, doğrulanabilir bir platformla bu inancın arkasında durmaktan gurur duyuyoruz.

### Geleneksel E-posta Hizmetlerinin Sorunları {#the-problem-with-traditional-email-services}

Geleneksel e-posta hizmetleri, gizlilik bilincine sahip kullanıcılar için birkaç temel zorluk sunar:

1. **Güven Gereksinimleri**: Sağlayıcının verilerinize erişmemesi, analiz etmemesi veya paylaşmaması için güvenmeniz gerekir
2. **Merkezi Kontrol**: Erişiminiz herhangi bir zamanda herhangi bir nedenle iptal edilebilir
3. **Gözetim Açığı**: Merkezi hizmetler gözetim için birincil hedeflerdir
4. **Sınırlı Şeffaflık**: Çoğu hizmet, özel ve kapalı kaynaklı yazılımlar kullanır
5. **Tedarikçi Bağımlılığı**: Bu hizmetlerden taşınmak zor veya imkansız olabilir

Hatta "gizlilik odaklı" e-posta sağlayıcıları bile genellikle sadece ön uç uygulamalarını açık kaynak yaparken, arka uç sistemlerini özel ve kapalı tutarak eksik kalır. Bu, önemli bir güven açığı yaratır — gizlilik vaatlerine inanmanız beklenir ancak bunları doğrulama imkanınız olmaz.

### Kendi Sunucunuzda Barındırılan Alternatif {#the-self-hosted-alternative}
E-postanızı kendi sunucunuzda barındırmak temelde farklı bir yaklaşım sunar:

1. **Tam Kontrol**: Tüm e-posta altyapısına sahip olur ve kontrol edersiniz
2. **Doğrulanabilir Gizlilik**: Tüm sistem şeffaf ve denetlenebilir
3. **Güven Gerektirmez**: İletişimleriniz için üçüncü bir tarafa güvenmeniz gerekmez
4. **Özelleştirme Özgürlüğü**: Sistemi özel ihtiyaçlarınıza göre uyarlayın
5. **Dayanıklılık**: Hizmetiniz herhangi bir şirketin kararlarından bağımsız olarak devam eder

Bir kullanıcının dediği gibi: "E-postamı kendi sunucumda barındırmak, kendi yiyeceğimi yetiştirmeye dijital olarak eşdeğer—daha fazla emek gerektiriyor ama içinde ne olduğunu tam olarak biliyorum."


## Kendi Sunucumuzda Barındırılan Uygulamamız: Teknik Genel Bakış {#our-self-hosted-implementation-technical-overview}

Kendi sunucumuzda barındırılan e-posta çözümümüz, tüm ürünlerimizi yönlendiren gizlilik öncelikli prensipler üzerine kuruludur. Bunu mümkün kılan teknik uygulamayı keşfedelim.

### Basitlik ve Taşınabilirlik için Docker Tabanlı Mimari {#docker-based-architecture-for-simplicity-and-portability}

Tüm e-posta altyapımızı Docker kullanarak paketledik, böylece neredeyse her Linux tabanlı sistemde kolayca dağıtılabilir. Bu konteyner tabanlı yaklaşım birkaç önemli avantaj sağlar:

1. **Basitleştirilmiş Kurulum**: Tek bir komut tüm altyapıyı kurar
2. **Tutarlı Ortam**: "Kendi makinemde çalışıyor" sorunlarını ortadan kaldırır
3. **İzolasyonlu Bileşenler**: Her servis kendi konteynerinde çalışır, güvenlik için
4. **Kolay Güncellemeler**: Tüm yığını güncellemek için basit komutlar
5. **Minimum Bağımlılıklar**: Sadece Docker ve Docker Compose gerektirir

Mimari şu konteynerleri içerir:

* Yönetim için web arayüzü
* Giden e-posta için SMTP sunucusu
* E-posta alma için IMAP/POP3 sunucuları
* Takvimler için CalDAV sunucusu
* Kişiler için CardDAV sunucusu
* Konfigürasyon depolama için veritabanı
* Önbellekleme ve performans için Redis
* Güvenli, şifreli posta kutusu depolaması için SQLite

> \[!NOTE]
> Kesinlikle [kendi sunucunuzda geliştirici rehberimizi](https://forwardemail.net/self-hosted) inceleyin

### Bash Script Kurulumu: Erişilebilirlik ve Güvenlik Bir Arada {#bash-script-installation-accessibility-meets-security}

Kurulum sürecini mümkün olduğunca basit tutarken güvenlik en iyi uygulamalarını koruyacak şekilde tasarladık:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Bu tek komut:

1. Sistem gereksinimlerini doğrular
2. Konfigürasyon boyunca size rehberlik eder
3. DNS kayıtlarını kurar
4. TLS sertifikalarını yapılandırır
5. Docker konteynerlerini dağıtır
6. İlk güvenlik sertleştirmesini yapar

Bash'e script yönlendirmek konusunda endişeleriniz varsa (ki olmalı!), çalıştırmadan önce scripti incelemenizi öneririz. Tamamen açık kaynaklıdır ve incelemeye açıktır.

### Geleceğe Hazır Gizlilik için Kuantum Güvenli Şifreleme {#quantum-safe-encryption-for-future-proof-privacy}

Barındırılan servisimiz gibi, kendi sunucumuzda barındırılan çözümümüz de SQLite veritabanları için şifre olarak ChaCha20-Poly1305 kullanan kuantum dirençli şifrelemeyi uygular. Bu yaklaşım, e-posta verilerinizi sadece mevcut tehditlere karşı değil, aynı zamanda gelecekteki kuantum bilgisayar saldırılarına karşı da korur.

Her posta kutusu kendi şifreli SQLite veritabanı dosyasında saklanır, bu da kullanıcılar arasında tam izolasyon sağlar—geleneksel paylaşılan veritabanı yaklaşımlarına göre önemli bir güvenlik avantajıdır.

### Otomatik Bakım ve Güncellemeler {#automated-maintenance-and-updates}

Kendi sunucumuzda barındırılan çözüme kapsamlı bakım araçları entegre ettik:

1. **Otomatik Yedeklemeler**: Tüm kritik verilerin planlı yedekleri
2. **Sertifika Yenileme**: Otomatik Let's Encrypt sertifika yönetimi
3. **Sistem Güncellemeleri**: En son sürüme güncellemek için basit komut
4. **Sağlık İzleme**: Sistem bütünlüğünü sağlamak için yerleşik kontroller

Bu araçlara basit etkileşimli bir menü üzerinden erişilebilir:

```bash
# script prompt

1. İlk kurulum
2. Yedeklemeleri Kur
3. Otomatik Güncellemeleri Kur
4. Sertifikaları Yenile
5. Yedekten Geri Yükle
6. Yardım
7. Çıkış
```


## Açık Kaynak Taahhüdü {#the-open-source-commitment}

Kendi sunucumuzda barındırılan e-posta çözümümüz, tüm ürünlerimiz gibi, %100 açık kaynaklıdır—hem ön yüz hem arka uç. Bu demektir ki:
1. **Tam Şeffaflık**: E-postalarınızı işleyen her kod satırı kamu incelemesine açıktır  
2. **Topluluk Katkıları**: Herkes iyileştirmeler yapabilir veya sorunları düzeltebilir  
3. **Açıklık Yoluyla Güvenlik**: Güvenlik açıkları küresel bir topluluk tarafından tespit edilip giderilebilir  
4. **Tedarikçi Bağımlılığı Yok**: Şirketimizin varlığına asla bağımlı olmazsınız  

Tüm kod tabanı GitHub’da mevcuttur: <https://github.com/forwardemail/forwardemail.net>.


## Kendi Sunucunuzda Barındırma vs. Yönetilen Hizmet: Doğru Seçimi Yapmak {#self-hosted-vs-managed-making-the-right-choice}

Kendi sunucunuzda barındırma seçeneği sunmaktan gurur duysak da, bunun herkes için doğru seçim olmadığını kabul ediyoruz. E-posta kendi sunucunuzda barındırmak gerçek sorumluluklar ve zorluklar getirir:

### E-postayı Kendi Sunucunuzda Barındırmanın Gerçekleri {#the-reality-of-self-hosting-email}

#### Teknik Hususlar {#technical-considerations}

* **Sunucu Yönetimi**: Bir VPS veya özel sunucuyu yönetmeniz gerekir  
* **DNS Yapılandırması**: Doğru DNS ayarları teslim edilebilirlik için kritik önemdedir  
* **Güvenlik Güncellemeleri**: Güvenlik yamalarını güncel tutmak zorunludur  
* **Spam Yönetimi**: Spam filtrelemeyi kendiniz yapmalısınız  
* **Yedekleme Stratejisi**: Güvenilir yedeklemeleri uygulamak sizin sorumluluğunuzdadır  

#### Zaman Yatırımı {#time-investment}

* **İlk Kurulum**: Kurulum, doğrulama ve dokümantasyon okuma süresi  
* **Sürekli Bakım**: Ara sıra güncellemeler ve izleme  
* **Sorun Giderme**: Sorunları çözmek için zaman ayırma  

#### Finansal Hususlar {#financial-considerations}

* **Sunucu Maliyetleri**: Temel bir VPS için ayda 5-20 $  
* **Alan Adı Kaydı**: Yılda 10-20 $  
* **Zamanın Değeri**: Harcadığınız zamanın gerçek bir değeri vardır  

### Yönetilen Hizmetimizi Ne Zaman Tercih Etmeli? {#when-to-choose-our-managed-service}

Birçok kullanıcı için yönetilen hizmetimiz en iyi seçenek olmaya devam ediyor:

1. **Kolaylık**: Tüm bakım, güncellemeler ve izlemeyi biz yaparız  
2. **Güvenilirlik**: Kurulu altyapımız ve uzmanlığımızdan faydalanırsınız  
3. **Destek**: Sorun çıktığında yardım alırsınız  
4. **Teslim Edilebilirlik**: Kurulu IP itibarımızdan yararlanırsınız  
5. **Maliyet Etkinliği**: Zaman maliyetlerini hesaba kattığınızda hizmetimiz genellikle daha ekonomiktir  

Her iki seçenek de aynı gizlilik avantajlarını ve açık kaynak şeffaflığını sunar—fark sadece altyapıyı kimin yönettiğindedir.


## Kendi Sunucunuzda Forward Email ile Başlamak {#getting-started-with-self-hosted-forward-email}

E-posta altyapınızın kontrolünü ele almaya hazır mısınız? İşte nasıl başlayacağınız:

### Sistem Gereksinimleri {#system-requirements}

* Ubuntu 20.04 LTS veya daha yenisi (önerilir)  
* En az 1GB RAM (2GB+ önerilir)  
* 20GB depolama önerilir  
* Kontrolünüzde bir alan adı  
* Port 25 desteği olan genel IP adresi  
* [ters PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) ayarlama yeteneği  
* IPv4 ve IPv6 desteği  

> \[!TIP]  
> Birkaç posta sunucusu sağlayıcısını <https://forwardemail.net/blog/docs/best-mail-server-providers> adresinde öneriyoruz (kaynak: <https://github.com/forwardemail/awesome-mail-server-providers>)

### Kurulum Adımları {#installation-steps}

1. **Kurulum Betiğini Çalıştırın**:  
   ```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Etkileşimli Yönergeleri Takip Edin**:  
   * Alan adınızı girin  
   * Yönetici kimlik bilgilerini yapılandırın  
   * Talimatlara göre DNS kayıtlarını ayarlayın  
   * Tercih ettiğiniz yapılandırma seçeneklerini seçin  

3. **Kurulumu Doğrulayın**:  
   Kurulum tamamlandıktan sonra her şeyin çalıştığını doğrulamak için:  
   * Konteyner durumunu kontrol edin: `docker ps`  
   * Test e-postası gönderin  
   * Web arayüzüne giriş yapın  


## Kendi Sunucunuzda Barındırılan E-postanın Geleceği {#the-future-of-self-hosted-email}

Kendi sunucunuzda barındırılan çözümümüz sadece başlangıç. Bu teklifi sürekli geliştirmeye kararlıyız:

1. **Gelişmiş Yönetim Araçları**: Daha güçlü web tabanlı yönetim  
2. **Ek Kimlik Doğrulama Seçenekleri**: Donanım güvenlik anahtarı desteği dahil  
3. **Gelişmiş İzleme**: Sistem sağlığı ve performansı hakkında daha iyi bilgiler  
4. **Çoklu Sunucu Dağıtımı**: Yüksek erişilebilirlik konfigürasyonları için seçenekler  
5. **Topluluk Odaklı İyileştirmeler**: Kullanıcı katkılarını dahil etme
## Sonuç: Herkes İçin E-posta Özgürlüğü {#conclusion-email-freedom-for-everyone}

Kendi kendine barındırılan e-posta çözümümüzün lansmanı, gizliliğe odaklı, şeffaf e-posta hizmetleri sunma misyonumuzda önemli bir dönüm noktasını temsil ediyor. Yönetilen hizmetimizi veya kendi kendine barındırılan seçeneğimizi tercih edin, açık kaynak ilkelerine ve gizliliği önceliklendiren tasarıma olan sarsılmaz bağlılığımızdan faydalanırsınız.

E-posta, kullanıcı gizliliğinden çok veri toplamayı önceliklendiren kapalı, özel sistemler tarafından kontrol edilmek için çok önemlidir. Forward Email'in kendi kendine barındırılan çözümü ile, dijital iletişimleriniz üzerinde tam kontrol sahibi olmanızı sağlayan gerçek bir alternatif sunmaktan gurur duyuyoruz.

Gizliliğin sadece bir özellik değil, temel bir hak olduğuna inanıyoruz. Ve kendi kendine barındırılan e-posta seçeneğimizle, bu hakkı her zamankinden daha erişilebilir hale getiriyoruz.

E-postanızın kontrolünü ele almaya hazır mısınız? [Bugün başlayın](https://forwardemail.net/self-hosted) veya daha fazla bilgi edinmek için [GitHub depomuzu](https://github.com/forwardemail/forwardemail.net) keşfedin.


## Kaynaklar {#references}

\[1] Forward Email GitHub Deposu: <https://github.com/forwardemail/forwardemail.net>

\[2] Kendi Kendine Barındırılan Dokümantasyon: <https://forwardemail.net/en/self-hosted>

\[3] E-posta Gizliliği Teknik Uygulaması: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Neden Açık Kaynak E-posta Önemlidir: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>
