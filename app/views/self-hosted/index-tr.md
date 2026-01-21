# Kendi Kendine Barındırılan {#self-hosted}

## İçindekiler {#table-of-contents}

* [Başlarken](#getting-started)
* [Gereksinimler](#requirements)
  * [Bulut-init / Kullanıcı-verileri](#cloud-init--user-data)
* [Düzenlemek](#install)
  * [Hata ayıklama kurulum betiği](#debug-install-script)
  * [İstemler](#prompts)
  * [İlk Kurulum (Seçenek 1)](#initial-setup-option-1)
* [Hizmetler](#services)
  * [Önemli dosya yolları](#important-file-paths)
* [Yapılandırma](#configuration)
  * [İlk DNS kurulumu](#initial-dns-setup)
* [Yerleştirme](#onboarding)
* [Test](#testing)
  * [İlk takma adınızı oluşturma](#creating-your-first-alias)
  * [İlk e-postanızı gönderme / alma](#sending--receiving-your-first-email)
* [Sorun giderme](#troubleshooting)
  * [Temel kimlik doğrulama kullanıcı adı ve şifresi nedir?](#what-is-the-basic-auth-username-and-password)
  * [Neyin çalıştığını nasıl bilebilirim?](#how-do-i-know-what-is-running)
  * [Çalışması gereken bir şeyin çalışmadığını nasıl anlarım?](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Günlükleri nasıl bulabilirim?](#how-do-i-find-logs)
  * [Giden e-postalarım neden zaman aşımına uğruyor?](#why-are-my-outgoing-emails-timing-out)

## Başlarken {#getting-started}

Kendi barındırdığımız e-posta çözümümüz, tüm ürünlerimiz gibi, hem ön uç hem de arka uç olarak %100 açık kaynaklıdır. Bu da şu anlama gelir:

1. **Tam Şeffaflık**: E-postalarınızı işleyen her kod satırı kamunun incelemesine açıktır.
2. **Topluluk Katkıları**: Herkes iyileştirmeler sunabilir veya sorunları giderebilir.
3. **Açıklık Yoluyla Güvenlik**: Güvenlik açıkları küresel bir topluluk tarafından tespit edilip giderilebilir.
4. **Tedarikçiye Bağlılık Yok**: Şirketimizin varlığına asla bağımlı değilsiniz.

Tüm kod tabanı GitHub'da <https://github.com/forwardemail/forwardemail.net>, adresinde MIT Lisansı altında lisanslı olarak mevcuttur.

Mimaride şunlar için kapsayıcılar bulunur:

* Giden e-posta için SMTP sunucusu
* E-posta alımı için IMAP/POP3 sunucuları
* Yönetim için web arayüzü
* Yapılandırma depolama için veritabanı
* Önbelleğe alma ve performans için Redis
* Güvenli, şifreli posta kutusu depolaması için SQLite

> \[!NOTE]
> [kendi kendine barındırılan blog](https://forwardemail.net/blog/docs/self-hosted-solution)'imize göz atmayı unutmayın
>
> Daha ayrıntılı, adım adım bir versiyonla ilgilenenler için [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) veya [Debian](https://forwardemail.net/guides/selfhosted-on-debian) tabanlı kılavuzlarımıza göz atın.

## Gereksinimleri {#requirements}

Kurulum betiğini çalıştırmadan önce aşağıdakilere sahip olduğunuzdan emin olun:

* **İşletim Sistemi**: Linux tabanlı bir sunucu (şu anda Ubuntu 22.04+ sürümünü desteklemektedir).
* **Kaynaklar**: 1 sanal işlemci ve 2 GB RAM
* **Kök Erişimi**: Komutları çalıştırmak için yönetici ayrıcalıkları.
* **Alan Adı**: DNS yapılandırmasına hazır özel bir alan adı.
* **Temiz IP**: Kara listeleri kontrol ederek sunucunuzun daha önce spam geçmişi olmayan temiz bir IP adresine sahip olduğundan emin olun. Daha fazla bilgi için [Burada](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation) adresini ziyaret edin.
* 25 numaralı bağlantı noktasını destekleyen genel IP adresi
* [ters PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) adresini ayarlayabilme
* IPv4 ve IPv6 desteği

> \[!TIP]
> [harika posta sunucusu sağlayıcıları](https://github.com/forwardemail/awesome-mail-server-providers) listemize bakın

### Bulut başlatma / Kullanıcı verileri {#cloud-init--user-data}

Çoğu bulut sağlayıcısı, sanal özel sunucu (VPS) sağlandığında bir bulut başlatma yapılandırmasını destekler. Bu, komut dosyasının ilk kurulum mantığı tarafından kullanılmak üzere bazı dosyaları ve ortam değişkenlerini önceden ayarlamanın harika bir yoludur ve komut dosyası çalışırken ek bilgi isteme ihtiyacını ortadan kaldırır.

**Seçenekler**

* `EMAIL` - certbot son kullanma tarihi hatırlatmaları için kullanılan e-posta
* `DOMAIN` - kendi barındırma kurulumu için kullanılan özel alan adı (ör. `example.com`)
* `AUTH_BASIC_USERNAME` - siteyi korumak için ilk kurulumda kullanılan kullanıcı adı
* `AUTH_BASIC_PASSWORD` - siteyi korumak için ilk kurulumda kullanılan parola
* `/root/.cloudflare.ini` - (**Yalnızca Cloudflare kullanıcıları**) certbot tarafından DNS yapılandırması için kullanılan Cloudflare yapılandırma dosyası. API belirtecinizi `dns_cloudflare_api_token` aracılığıyla ayarlamanızı gerektirir. [Burada](https://certbot-dns-cloudflare.readthedocs.io/en/stable/) hakkında daha fazla bilgi edinin.

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

## {#install}'i yükleyin

Kurulum betiğini indirmek ve çalıştırmak için sunucunuzda aşağıdaki komutu çalıştırın:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Hata ayıklama yükleme betiği {#debug-install-script}

Ayrıntılı çıktı için kurulum betiğinin önüne `DEBUG=true` ekleyin:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### İstemleri {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **İlk kurulum**: En son yönlendirme e-posta kodunu indirin, ortamı yapılandırın, özel alan adınızı isteyin ve gerekli tüm sertifikaları, anahtarları ve gizli anahtarları ayarlayın.
* **Yedekleme Kurulumu**: Güvenli ve uzak depolama için S3 uyumlu bir depolama alanı kullanarak MongoDB ve Redis'i yedeklemek üzere bir cron kurulacaktır. Ayrıca, güvenli ve şifreli yedeklemeler için oturum açıldığında SQLite yedeklenecektir.
* **Yükseltme Kurulumu**: Altyapı bileşenlerini güvenli bir şekilde yeniden oluşturup yeniden başlatacak gecelik güncellemeleri arayacak bir cron kurulacaktır.
* **Sertifikaları Yenile**: SSL sertifikaları için Certbot / Lets Encrypt kullanılır ve anahtarların süresi her 3 ayda bir dolar. Bu, alan adınız için sertifikaları yenileyecek ve ilgili bileşenlerin kullanması için gerekli klasöre yerleştirecektir. Bkz. [önemli dosya yolları](#important-file-paths)
* **Yedekten Geri Yükle**: MongoDB ve Redis'in yedek verilerden geri yükleme yapmasını tetikleyecektir.

### İlk Kurulum (Seçenek 1) {#initial-setup-option-1}

Başlamak için `1. Initial setup` seçeneğini seçin.

Tamamlandığında, bir başarı mesajı görmelisiniz. Bileşenlerin nasıl çalıştığını görmek için `docker ps` komutunu bile çalıştırabilirsiniz. Bileşenler hakkında daha fazla bilgi aşağıda.

## Hizmetleri {#services}

| Hizmet Adı | Varsayılan Bağlantı Noktası | Tanım |
| ------------ | :----------: | ------------------------------------------------------ |
| Web | `443` | Tüm yönetici etkileşimleri için web arayüzü |
| API | `4000` | Veritabanlarını soyutlamak için API katmanı |
| Bree | Hiçbiri | Arka plan işi ve görev yürütücüsü |
| SMTP | `465/587` | Giden e-posta için SMTP sunucusu |
| SMTP Bree | Hiçbiri | SMTP arka plan işi |
| MX | `2525` | Gelen e-posta ve e-posta yönlendirme için posta değişimi |
| IMAP | `993/2993` | Gelen e-posta ve posta kutusu yönetimi için IMAP sunucusu |
| POP3 | `995/2995` | Gelen e-posta ve posta kutusu yönetimi için POP3 sunucusu |
| SQLite | `3456` | SQLite veritabanı(ları) ile etkileşimler için SQLite sunucusu |
| SQLite Bree | Hiçbiri | SQLite arka plan işi |
| CalDAV | `5000` | Takvim yönetimi için CalDAV sunucusu |
| CardDAV | `6000` | Takvim yönetimi için CardDAV sunucusu |
| MongoDB | `27017` | Çoğu veri yönetimi için MongoDB veritabanı |
| Redis | `6379` | Önbelleğe alma ve durum yönetimi için Redis |
| SQLite | Hiçbiri | Şifrelenmiş posta kutuları için SQLite veritabanı(ları) |

### Önemli dosya yolları {#important-file-paths}

Not: Aşağıdaki *Ana bilgisayar yolu* `/root/forwardemail.net/self-hosting/`'a göredir.

| Bileşen | Ana bilgisayar yolu | Konteyner yolu |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| Sqlite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| Çevre dosyası | `./.env` | `/app/.env` |
| SSL sertifikaları/anahtarları | `./ssl` | `/app/ssl/` |
| Özel anahtar | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| Tam zincir sertifikası | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| Sertifikalı CA'lar | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| DKIM özel anahtarı | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> `.env` dosyasını güvenli bir şekilde kaydedin. Arıza durumunda kurtarma için kritik öneme sahiptir.
> Bunu `/root/forwardemail.net/self-hosting/.env` dosyasında bulabilirsiniz.

## Yapılandırması {#configuration}

### İlk DNS kurulumu {#initial-dns-setup}

Tercih ettiğiniz DNS sağlayıcınızda uygun DNS kayıtlarını yapılandırın. Parantez içindekilerin (`<>`) dinamik olduğunu ve sizin değerinizle güncellenmesi gerektiğini unutmayın.

| Tip | İsim | İçerik | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | "@", "." veya boş | <ip_adresi> | otomatik |
| CNAME | API | <alan_adı> | otomatik |
| CNAME | caldav | <alan_adı> | otomatik |
| CNAME | kartdav | <alan_adı> | otomatik |
| CNAME | fe-sıçramaları | <alan_adı> | otomatik |
| CNAME | imap | <alan_adı> | otomatik |
| CNAME | mx | <alan_adı> | otomatik |
| CNAME | pop3 | <alan_adı> | otomatik |
| CNAME | smtp | <alan_adı> | otomatik |
| MX | "@", "." veya boş | mx.<alan_adı> (öncelik 0) | otomatik |
| TXT | "@", "." veya boş | "v=spf1 a -all" | otomatik |

#### Ters DNS / PTR kaydı {#reverse-dns--ptr-record}

Ters DNS (rDNS) veya ters işaretçi kayıtları (PTR kayıtları), e-posta sunucuları için önemlidir çünkü e-postayı gönderen sunucunun meşruiyetini doğrulamaya yardımcı olurlar. Her bulut sağlayıcısı bunu farklı şekilde yapar, bu nedenle ana bilgisayarı ve IP'yi ilgili ana bilgisayar adına eşlemek için "Ters DNS" eklemenin nasıl yapılacağını araştırmanız gerekir. Büyük olasılıkla sağlayıcının ağ bölümünde bulunur.

#### Port 25 Engellendi {#port-25-blocked}

Bazı İSS'ler ve bulut sağlayıcıları, kötü niyetli kişileri engellemek için 25 numaralı portu engeller. SMTP/giden e-posta için 25 numaralı portu açmak üzere bir destek talebi göndermeniz gerekebilir.

## Katılım {#onboarding}

1. Açılış Sayfasını Açın
https\://\<alan_adı> adresine gidin ve \<alan_adı> kısmını DNS ayarlarınızda yapılandırdığınız alan adıyla değiştirin. "E-postayı İlet" açılış sayfasını görmelisiniz.

2. Giriş Yapın ve Alan Adınızı Ekleyin

* Geçerli bir e-posta ve parola ile giriş yapın.
* Kurmak istediğiniz alan adını girin (bu, DNS yapılandırmasıyla eşleşmelidir).
* Doğrulama için gerekli **MX** ve **TXT** kayıtlarını eklemek üzere talimatları izleyin.

3. Kurulumu Tamamlayın

* Doğrulamanın ardından, ilk takma adınızı oluşturmak için Takma Adlar sayfasına erişin.
* İsteğe bağlı olarak, **Alan Adı Ayarları**'nda **Giden e-postalar için SMTP**'yi yapılandırın. Bu, ek DNS kayıtları gerektirir.

> \[!NOTE]
> Sunucunuzun dışına hiçbir bilgi gönderilmez. Kendi kendine barındırma seçeneği ve ilk hesap, yalnızca yönetici girişi ve alan adlarını, takma adları ve ilgili e-posta yapılandırmalarını yönetmek için web görünümü içindir.

## {#testing} test ediliyor

### İlk takma adınız {#creating-your-first-alias} oluşturuluyor

1. Takma Adlar Sayfasına gidin
Takma ad yönetimi sayfasını açın:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Yeni Bir Takma Ad Ekleyin

* **Takma Ad Ekle**'ye tıklayın (sağ üst).
* Takma adı girin ve e-posta ayarlarınızı gerektiği gibi düzenleyin.
* (İsteğe bağlı) Onay kutusunu seçerek **IMAP/POP3/CalDAV/CardDAV** desteğini etkinleştirin.
* **Takma Ad Oluştur**'a tıklayın.

3. Bir Parola Belirleyin

* Güvenli bir parola oluşturmak için **Parola Oluştur**'a tıklayın.
* Bu parola, e-posta istemcinize giriş yapmak için gerekli olacaktır.

4. E-posta İstemcinizi Yapılandırın

* Betterbird gibi bir e-posta istemcisi kullanın.
* Takma adınızı ve oluşturulan parolayı girin.
* **IMAP** ve **SMTP** ayarlarını uygun şekilde yapılandırın.

#### E-posta sunucusu ayarları {#email-server-settings}

Kullanıcı adı: `<alias name>`

| Tip | Ana bilgisayar adı | Liman | Bağlantı Güvenliği | Kimlik doğrulama |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<alan_adı> | 465 | SSL / TLS | Normal Şifre |
| IMAP | imap.<alan_adı> | 993 | SSL / TLS | Normal Şifre |

### İlk e-postanızı gönderme / alma {#sending--receiving-your-first-email}

Yapılandırıldıktan sonra, yeni oluşturduğunuz ve kendi barındırdığınız e-posta adresinize e-posta gönderebilmeli ve alabilmelisiniz!

## Sorun Giderme {#troubleshooting}

#### Bu neden Ubuntu ve Debian dışında çalışmıyor? {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Şu anda macOS'u desteklemeyi düşünüyoruz ve diğer platformlara da yöneleceğiz. Başka platformların da desteklenmesini istiyorsanız lütfen [tartışma](https://github.com/orgs/forwardemail/discussions) sayfasını açın veya katkıda bulunun.

#### Certbot acme challenge'ı neden başarısız oluyor? {#why-is-the-certbot-acme-challenge-failing}

En sık karşılaşılan hata, certbot / letsencrypt'in bazen **2** sorgu talep etmesidir. **HER İKİ** txt kaydını da eklediğinizden emin olmalısınız.

Örnek:
Şuna benzer iki meydan okuma görebilirsiniz:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

DNS yayılımının tamamlanmamış olması da mümkündür. `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>` gibi araçları kullanabilirsiniz. Bu, TXT kaydınızdaki değişikliklerin yansıtılıp yansıtılmayacağı konusunda size fikir verecektir. Ayrıca, ana bilgisayarınızdaki yerel DNS önbelleğinin hala eski, güncel olmayan bir değer kullanıyor olması veya son değişiklikleri algılamamış olması da mümkündür.

Diğer bir seçenek ise, ilk VPS kurulumunda cloud-init/user-data'nızdaki API belirteciyle `/root/.cloudflare.ini` dosyasını ayarlayarak otomatik cerbot DNS değişikliklerini kullanmak veya bu dosyayı oluşturup betiği tekrar çalıştırmaktır. Bu, DNS değişikliklerini ve meydan okuma güncellemelerini otomatik olarak yönetecektir.

### Temel kimlik doğrulama kullanıcı adı ve şifresi nedir? {#what-is-the-basic-auth-username-and-password}

Kendi barındırma hizmetiniz için, basit bir kullanıcı adı (`admin`) ve parola (ilk kurulumda rastgele oluşturulur) içeren, tarayıcıya özgü ilk kimlik doğrulama açılır penceresi ekliyoruz. Bunu, otomasyon/kazıyıcıların web deneyimine ilk kaydolmanızı bir şekilde engellemesi ihtimaline karşı bir koruma olarak ekliyoruz. Bu parolayı, ilk kurulumdan sonra `.env` dosyanızda `AUTH_BASIC_USERNAME` ve `AUTH_BASIC_PASSWORD` altında bulabilirsiniz.

### {#how-do-i-know-what-is-running}'in ne çalıştırdığını nasıl bilebilirim?

`docker-compose-self-hosting.yml` dosyasından çalıştırılan tüm çalışan kapsayıcıları görmek için `docker ps` komutunu çalıştırabilirsiniz. Her şeyi (çalışmayan kapsayıcılar dahil) görmek için `docker ps -a` komutunu da çalıştırabilirsiniz.

### {#how-do-i-know-if-something-isnt-running-that-should-be} olması gereken bir şeyin çalışmadığını nasıl anlarım?

Her şeyi (çalışmayan kapsayıcılar dahil) görmek için `docker ps -a` komutunu çalıştırabilirsiniz. Bir çıkış günlüğü veya notu görebilirsiniz.

### {#how-do-i-find-logs} günlüklerini nasıl bulabilirim?

`docker logs -f <container_name>` aracılığıyla daha fazla günlük alabilirsiniz. Herhangi bir şey çıktıysa, büyük olasılıkla `.env` dosyasının yanlış yapılandırılmasıyla ilgilidir.

Web kullanıcı arayüzünde, giden e-posta günlükleri ve hata günlükleri için sırasıyla `/admin/emails` ve `/admin/logs` değerlerini görüntüleyebilirsiniz.

### Giden e-postalarım neden zaman aşımına uğruyor? {#why-are-my-outgoing-emails-timing-out}

MX sunucusuna bağlanırken bağlantı zaman aşımına uğradı... gibi bir mesaj görüyorsanız, 25 numaralı bağlantı noktasının engellenip engellenmediğini kontrol etmeniz gerekebilir. İSS'lerin veya bulut sağlayıcılarının bunu varsayılan olarak engellemesi yaygındır; bu durumda, bağlantının açılması için destek ekibiyle iletişime geçmeniz veya bir destek talebi oluşturmanız gerekebilir.

#### E-posta yapılandırma en iyi uygulamalarını ve IP itibarını test etmek için hangi araçları kullanmalıyım? {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

[SSS burada](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)'ımıza bir göz atın.