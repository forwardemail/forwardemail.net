# Kendi Sunucunuzda Barındırma {#self-hosted}


## İçindekiler {#table-of-contents}

* [Başlarken](#getting-started)
* [Gereksinimler](#requirements)
  * [Cloud-init / Kullanıcı verisi](#cloud-init--user-data)
* [Kurulum](#install)
  * [Kurulum betiğini hata ayıklama](#debug-install-script)
  * [İstemler](#prompts)
  * [İlk Kurulum (Seçenek 1)](#initial-setup-option-1)
* [Hizmetler](#services)
  * [Önemli dosya yolları](#important-file-paths)
* [Yapılandırma](#configuration)
  * [İlk DNS kurulumu](#initial-dns-setup)
* [Kayıt](#onboarding)
* [Test Etme](#testing)
  * [İlk takma adınızı oluşturma](#creating-your-first-alias)
  * [İlk e-postanızı gönderme / alma](#sending--receiving-your-first-email)
* [Sorun Giderme](#troubleshooting)
  * [Temel kimlik doğrulama kullanıcı adı ve şifresi nedir](#what-is-the-basic-auth-username-and-password)
  * [Ne çalışıyor nasıl anlarım](#how-do-i-know-what-is-running)
  * [Çalışması gereken bir şey çalışmıyorsa nasıl anlarım](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Günlükleri nasıl bulurum](#how-do-i-find-logs)
  * [Giden e-postalarım neden zaman aşımına uğruyor](#why-are-my-outgoing-emails-timing-out)


## Başlarken {#getting-started}

Kendi sunucunuzda barındırılan e-posta çözümümüz, tüm ürünlerimiz gibi, %100 açık kaynaklıdır—hem ön yüz hem de arka uç. Bu şu anlama gelir:

1. **Tam Şeffaflık**: E-postalarınızı işleyen her kod satırı kamuya açıktır
2. **Topluluk Katkıları**: Herkes iyileştirmeler yapabilir veya sorunları düzeltebilir
3. **Açıklık Yoluyla Güvenlik**: Güvenlik açıkları küresel bir topluluk tarafından tespit edilip düzeltilebilir
4. **Tedarikçi Bağımlılığı Yok**: Şirketimizin varlığına asla bağımlı olmazsınız

Tüm kod tabanı GitHub’da <https://github.com/forwardemail/forwardemail.net> adresinde MIT Lisansı altında mevcuttur.

Mimari şunları içerir:

* Giden e-posta için SMTP sunucusu
* E-posta alma için IMAP/POP3 sunucuları
* Yönetim için web arayüzü
* Yapılandırma depolama için veritabanı
* Önbellekleme ve performans için Redis
* Güvenli, şifrelenmiş posta kutusu depolaması için SQLite

> \[!NOTE]
> [Kendi sunucunuzda barındırma blogumuzu](https://forwardemail.net/blog/docs/self-hosted-solution) mutlaka inceleyin
>
> Ve daha ayrıntılı adım adım bir versiyon için [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) veya [Debian](https://forwardemail.net/guides/selfhosted-on-debian) tabanlı rehberlerimize bakabilirsiniz.


## Gereksinimler {#requirements}

Kurulum betiğini çalıştırmadan önce aşağıdakilere sahip olduğunuzdan emin olun:

* **İşletim Sistemi**: Linux tabanlı bir sunucu (şu anda Ubuntu 22.04+ desteklenmektedir).
* **Kaynaklar**: 1 vCPU ve 2GB RAM
* **Root Erişimi**: Komutları çalıştırmak için yönetici ayrıcalıkları.
* **Alan Adı**: DNS yapılandırması için hazır özel bir alan adı.
* **Temiz IP**: Sunucunuzun daha önce spam geçmişi olmayan temiz bir IP adresine sahip olduğundan emin olun, kara listeleri kontrol ederek. Daha fazla bilgi [burada](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Port 25 desteği olan genel IP adresi
* [ters PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) ayarlama yeteneği
* IPv4 ve IPv6 desteği

> \[!TIP]
> [Harika posta sunucusu sağlayıcıları](https://github.com/forwardemail/awesome-mail-server-providers) listemize göz atın

### Cloud-init / Kullanıcı verisi {#cloud-init--user-data}

Çoğu bulut sağlayıcısı, sanal özel sunucu (VPS) sağlanırken bir cloud-init yapılandırmasını destekler. Bu, betiğin çalışması sırasında ek bilgi isteme ihtiyacını atlayarak, betiğin ilk kurulum mantığı tarafından kullanılmak üzere bazı dosyaları ve ortam değişkenlerini önceden ayarlamanın harika bir yoludur.

**Seçenekler**

* `EMAIL` - certbot süresi dolma hatırlatmaları için kullanılan e-posta
* `DOMAIN` - kendi barındırma kurulumu için kullanılan özel alan adı (ör. `example.com`)
* `AUTH_BASIC_USERNAME` - siteyi korumak için ilk kurulumda kullanılan kullanıcı adı
* `AUTH_BASIC_PASSWORD` - siteyi korumak için ilk kurulumda kullanılan şifre
* `/root/.cloudflare.ini` - (**Sadece Cloudflare kullanıcıları için**) certbot tarafından DNS yapılandırması için kullanılan cloudflare yapılandırma dosyası. API token’ınızı `dns_cloudflare_api_token` ile ayarlamanız gerekir. Daha fazla bilgi için [buraya](https://certbot-dns-cloudflare.readthedocs.io/en/stable/) bakın.
Örnek:

```sh
#cloud-config
write_files:
  - path: /root/.cloudflare.ini
    content: |
      dns_cloudflare_api_token = "xxx"
    owner: root:root
    permissions: '0600'
  - path: /etc/profile.d/env.sh
    content: |
      export EMAIL="test@myemail.com"
      export DOMAIN="mydomain.com"

runcmd:
  - chmod +x /etc/profile.d/env.sh
```


## Kurulum {#install}

Kurulum betiğini indirmek ve çalıştırmak için sunucunuzda aşağıdaki komutu çalıştırın:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Kurulum betiğini hata ayıklama {#debug-install-script}

Ayrıntılı çıktı için kurulum betiğinin önüne `DEBUG=true` ekleyin:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### İstemler {#prompts}

```sh
1. İlk kurulum
2. Yedeklemeleri kur
3. Otomatik güncellemeleri kur
4. Sertifikaları yenile
5. Yedekten geri yükle
6. Yardım
7. Çıkış
```

* **İlk kurulum**: En son forward email kodunu indirir, ortamı yapılandırır, özel alan adınızı sorar ve gerekli tüm sertifikalar, anahtarlar ve gizli bilgileri kurar.
* **Yedeklemeleri kur**: Güvenli, uzak depolama için S3 uyumlu bir depolama kullanarak mongoDB ve redis için bir cron kurar. Ayrı olarak, değişiklik varsa girişte sqlite yedeklenecektir; bu, güvenli, şifrelenmiş yedeklemeler sağlar.
* **Güncellemeleri kur**: Gece güncellemelerini kontrol eden ve altyapı bileşenlerini güvenli şekilde yeniden inşa edip yeniden başlatan bir cron kurar.
* **Sertifikaları yenile**: SSL sertifikaları için Certbot / lets encrypt kullanılır ve anahtarlar her 3 ayda bir süresi dolar. Bu, alan adınız için sertifikaları yeniler ve ilgili bileşenlerin kullanması için gerekli klasöre yerleştirir. Bkz. [önemli dosya yolları](#important-file-paths)
* **Yedekten geri yükle**: mongodb ve redis'in yedek verilerinden geri yükleme yapmasını tetikler.

### İlk Kurulum (Seçenek 1) {#initial-setup-option-1}

Başlamak için `1. İlk kurulum` seçeneğini seçin.

Tamamlandığında, bir başarı mesajı görmelisiniz. Hatta `docker ps` komutunu çalıştırarak **başlatılan** bileşenleri görebilirsiniz. Bileşenler hakkında daha fazla bilgi aşağıdadır.


## Servisler {#services}

| Servis Adı  |         Varsayılan Port        | Açıklama                                               |
| ----------- | :----------------------------: | ------------------------------------------------------ |
| Web         |            `443`               | Tüm yönetim işlemleri için web arayüzü                 |
| API         |            `4000`              | Veritabanlarını soyutlayan API katmanı                 |
| Bree        |             Yok                | Arka plan iş ve görev çalıştırıcı                        |
| SMTP        | `465` (önerilen) / `587`       | Giden e-posta için SMTP sunucusu                        |
| SMTP Bree   |             Yok                | SMTP arka plan işi                                      |
| MX          |            `2525`              | Gelen e-posta ve e-posta yönlendirme için posta değişimi |
| IMAP        |          `993/2993`            | Gelen e-posta ve posta kutusu yönetimi için IMAP sunucusu |
| POP3        |          `995/2995`            | Gelen e-posta ve posta kutusu yönetimi için POP3 sunucusu |
| SQLite      |            `3456`              | sqlite veritabanları ile etkileşim için SQLite sunucusu |
| SQLite Bree |             Yok                | SQLite arka plan işi                                    |
| CalDAV      |            `5000`              | Takvim yönetimi için CalDAV sunucusu                    |
| CardDAV     |            `6000`              | Takvim yönetimi için CardDAV sunucusu                   |
| MongoDB     |           `27017`              | Çoğu veri yönetimi için MongoDB veritabanı              |
| Redis       |            `6379`              | Önbellekleme ve durum yönetimi için Redis               |
| SQLite      |             Yok                | Şifrelenmiş posta kutuları için SQLite veritabanları    |

### Önemli dosya yolları {#important-file-paths}

Not: Aşağıdaki *Host yolu* `/root/forwardemail.net/self-hosting/` dizinine göre görecelidir.

| Bileşen               |       Host yolu        | Konteyner yolu               |
| --------------------- | :--------------------: | ---------------------------- |
| MongoDB               |   `./mongo-backups`    | `/backups`                   |
| Redis                 |     `./redis-data`     | `/data`                      |
| Sqlite                |    `./sqlite-data`     | `/mnt/{SQLITE_STORAGE_PATH}` |
| Ortam dosyası         |        `./.env`        | `/app/.env`                  |
| SSL sertifikaları/anahtarları |        `./ssl`         | `/app/ssl/`                  |
| Özel anahtar          |  `./ssl/privkey.pem`   | `/app/ssl/privkey.pem`       |
| Tam zincir sertifikası| `./ssl/fullchain.pem`  | `/app/ssl/fullchain.pem`     |
| CA sertifikası        |    `./ssl/cert.pem`    | `/app/ssl/cert.pem`          |
| DKIM özel anahtarı    |    `./ssl/dkim.key`    | `/app/ssl/dkim.key`          |
> \[!IMPORTANT]
> `.env` dosyasını güvenli bir şekilde saklayın. Arıza durumunda kurtarma için kritik öneme sahiptir.
> Bunu `/root/forwardemail.net/self-hosting/.env` içinde bulabilirsiniz.


## Yapılandırma {#configuration}

### İlk DNS kurulumu {#initial-dns-setup}

Tercih ettiğiniz DNS sağlayıcısında uygun DNS kayıtlarını yapılandırın. Köşeli parantez içindekilerin (`<>`) dinamik olduğunu ve kendi değerinizle güncellenmesi gerektiğini unutmayın.

| Tür   | İsim               | İçerik                       | TTL  |
| ----- | ------------------ | ----------------------------- | ---- |
| A     | "@", ".", veya boş | <ip_address>                  | auto |
| CNAME | api                | <domain_name>                 | auto |
| CNAME | caldav             | <domain_name>                 | auto |
| CNAME | carddav            | <domain_name>                 | auto |
| CNAME | fe-bounces         | <domain_name>                 | auto |
| CNAME | imap               | <domain_name>                 | auto |
| CNAME | mx                 | <domain_name>                 | auto |
| CNAME | pop3               | <domain_name>                 | auto |
| CNAME | smtp               | <domain_name>                 | auto |
| MX    | "@", ".", veya boş | mx.<domain_name> (öncelik 0) | auto |
| TXT   | "@", ".", veya boş | "v=spf1 a -all"               | auto |

#### Ters DNS / PTR kaydı {#reverse-dns--ptr-record}

Ters DNS (rDNS) veya ters işaretçi kayıtları (PTR kayıtları) e-posta sunucuları için önemlidir çünkü e-postayı gönderen sunucunun meşruiyetini doğrulamaya yardımcı olur. Her bulut sağlayıcısı bunu farklı yapar, bu yüzden "Ters DNS" ekleyerek ana bilgisayar ve IP adresini karşılık gelen ana bilgisayar adına eşlemek için nasıl yapılacağını araştırmanız gerekir. Muhtemelen sağlayıcının ağ (networking) bölümünde bulunur.

#### 25 Numaralı Port Engellendi {#port-25-blocked}

Bazı ISS'ler ve bulut sağlayıcıları kötü niyetli kullanıcıları engellemek için 25 numaralı portu kapatır. SMTP / giden e-posta için 25 numaralı portu açtırmak üzere destek talebi oluşturmanız gerekebilir.


## Başlangıç {#onboarding}

1. Açılış Sayfasını Açın
   DNS ayarlarınızda yapılandırdığınız alan adı ile değiştirerek https\://\<domain_name> adresine gidin. Forward Email açılış sayfasını görmelisiniz.

2. Giriş Yapın ve Alan Adınızı Kaydedin

* Geçerli bir e-posta ve şifre ile giriş yapın.
* Kurmak istediğiniz alan adını girin (bu DNS yapılandırmasıyla eşleşmelidir).
* Doğrulama için gerekli **MX** ve **TXT** kayıtlarını eklemek için yönergeleri izleyin.

3. Kurulumu Tamamlayın

* Doğrulandıktan sonra, ilk takma adınızı oluşturmak için Takma Adlar sayfasına erişin.
* İsterseniz, **Alan Ayarları** bölümünde **giden e-posta için SMTP** yapılandırabilirsiniz. Bu ek DNS kayıtları gerektirir.

> \[!NOTE]
> Bilgiler sunucunuzun dışına gönderilmez. Self-hosted seçenek ve ilk hesap sadece yönetici girişi ve alan adları, takma adlar ve ilgili e-posta yapılandırmalarını yönetmek için web görünümü içindir.


## Test {#testing}

### İlk takma adınızı oluşturma {#creating-your-first-alias}

1. Takma Adlar Sayfasına Gidin
   Takma ad yönetim sayfasını açın:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Yeni Takma Ad Ekleyin

* Sağ üstteki **Takma Ad Ekle** butonuna tıklayın.
* Takma ad adını girin ve e-posta ayarlarını gerektiği gibi düzenleyin.
* (İsteğe bağlı) **IMAP/POP3/CalDAV/CardDAV** desteğini etkinleştirmek için kutucuğu işaretleyin.
* **Takma Ad Oluştur** butonuna tıklayın.

3. Şifre Belirleyin

* Güvenli bir şifre oluşturmak için **Şifre Oluştur** butonuna tıklayın.
* Bu şifre, e-posta istemcinize giriş yapmak için gerekecektir.

4. E-posta İstemcinizi Yapılandırın

* Thunderbird gibi bir e-posta istemcisi kullanın.
* Takma ad adını ve oluşturulan şifreyi girin.
* **IMAP** ve **SMTP** ayarlarını uygun şekilde yapılandırın.

#### E-posta sunucusu ayarları {#email-server-settings}

Kullanıcı adı: `<alias name>`

| Tür   | Ana Bilgisayar     | Port | Bağlantı Güvenliği  | Kimlik Doğrulama  |
| ----  | ------------------ | ---- | ------------------- | ----------------- |
| SMTP  | smtp.<domain_name> | 465  | SSL / TLS           | Normal Şifre      |
| IMAP  | imap.<domain_name> | 993  | SSL / TLS           | Normal Şifre      |

### İlk e-postanızı gönderme / alma {#sending--receiving-your-first-email}

Yapılandırıldıktan sonra, yeni oluşturduğunuz ve self-hosted e-posta adresinizle e-posta gönderip alabilmelisiniz!
## Sorun Giderme {#troubleshooting}

#### Neden bu Ubuntu ve Debian dışındayken çalışmıyor {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Şu anda MacOS desteği üzerinde çalışıyoruz ve diğer platformlara da bakacağız. Başka platformların desteklenmesini istiyorsanız lütfen bir [tartışma](https://github.com/orgs/forwardemail/discussions) açın veya katkıda bulunun.

#### Neden certbot acme challenge başarısız oluyor {#why-is-the-certbot-acme-challenge-failing}

En yaygın hata, certbot / letsencrypt bazen **2** challenge talep etmesidir. **HER İKİSİNİ DE** txt kayıtlarına eklediğinizden emin olmalısınız.

Örnek:
İki challenge şu şekilde görünebilir:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Ayrıca DNS yayılımının tamamlanmamış olması da mümkündür. Şu araçları kullanabilirsiniz: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Bu, TXT kayıt değişikliklerinizin yansıyıp yansımadığını anlamanıza yardımcı olur. Ayrıca, yerel DNS önbelleğinizin hala eski, geçersiz bir değeri kullanıyor olması veya son değişiklikleri almamış olması da mümkündür.

Başka bir seçenek, otomatik certbot DNS değişikliklerini kullanmaktır; bunun için VPS ilk kurulumu sırasında cloud-init / user-data içinde api token ile `/root/.cloudflare.ini` dosyasını ayarlayabilir veya bu dosyayı oluşturup scripti tekrar çalıştırabilirsiniz. Bu, DNS değişikliklerini ve challenge güncellemelerini otomatik olarak yönetecektir.

### Temel kimlik doğrulama kullanıcı adı ve şifre nedir {#what-is-the-basic-auth-username-and-password}

Kendi sunucunuzda barındırma için, ilk kez tarayıcıda basit bir kullanıcı adı (`admin`) ve şifre (ilk kurulumda rastgele oluşturulur) ile yerel bir kimlik doğrulama açılır. Bu, otomasyon / kazıyıcıların web deneyiminde ilk kayıt olmanızı engellemesi durumunda bir koruma olarak eklenir. Bu şifreyi ilk kurulumdan sonra `.env` dosyanızda `AUTH_BASIC_USERNAME` ve `AUTH_BASIC_PASSWORD` altında bulabilirsiniz.

### Ne çalışıyor nasıl anlarım {#how-do-i-know-what-is-running}

`docker ps` komutunu çalıştırarak `docker-compose-self-hosting.yml` dosyasından başlatılan tüm çalışan konteynerleri görebilirsiniz. Ayrıca `docker ps -a` komutunu kullanarak çalışan ve çalışmayan tüm konteynerleri görebilirsiniz.

### Çalışması gereken bir şey çalışmıyorsa nasıl anlarım {#how-do-i-know-if-something-isnt-running-that-should-be}

`docker ps -a` komutunu kullanarak çalışan ve çalışmayan tüm konteynerleri görebilirsiniz. Bir çıkış kaydı veya not görebilirsiniz.

### Logları nasıl bulurum {#how-do-i-find-logs}

`docker logs -f <container_name>` komutuyla daha fazla log alabilirsiniz. Eğer herhangi bir konteyner çıkış yaptıysa, muhtemelen `.env` dosyasının yanlış yapılandırılmasıyla ilgilidir.

Web arayüzünde, giden e-posta logları için `/admin/emails` ve hata logları için `/admin/logs` sayfalarını görüntüleyebilirsiniz.

### Giden e-postalarım neden zaman aşımına uğruyor {#why-are-my-outgoing-emails-timing-out}

MX sunucusuna bağlanırken Connection timed out gibi bir mesaj görüyorsanız, 25 numaralı portun engellenip engellenmediğini kontrol etmeniz gerekebilir. ISP'ler veya bulut sağlayıcıları genellikle bunu varsayılan olarak engeller; açtırmak için destek ile iletişime geçmeniz veya bir talep oluşturmanız gerekebilir.

#### E-posta yapılandırması en iyi uygulamalarını ve IP itibarını test etmek için hangi araçları kullanmalıyım {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

[SSS sayfamıza](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation) göz atabilirsiniz.
