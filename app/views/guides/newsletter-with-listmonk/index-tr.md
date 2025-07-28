# Güvenli Haber Bülteni Teslimatı için E-postayı İletme Özelliğine Sahip Listmonk {#listmonk-with-forward-email-for-secure-newsletter-delivery}

## İçindekiler {#table-of-contents}

* [Genel bakış](#overview)
* [Neden Listmonk ve Forward E-posta](#why-listmonk-and-forward-email)
* [Ön koşullar](#prerequisites)
* [Kurulum](#installation)
  * [1. Sunucunuzu Güncelleyin](#1-update-your-server)
  * [2. Bağımlılıkları Yükleyin](#2-install-dependencies)
  * [3. Listmonk Yapılandırmasını İndirin](#3-download-listmonk-configuration)
  * [4. Güvenlik Duvarını (UFW) yapılandırın](#4-configure-firewall-ufw)
  * [5. HTTPS Erişimini Yapılandırın](#5-configure-https-access)
  * [6. Listmonk'u başlatın](#6-start-listmonk)
  * [7. Listmonk'ta E-posta SMTP'sini Yönlendir'i yapılandırın](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Geri Dönüş İşlemeyi Yapılandırın](#8-configure-bounce-processing)
* [Test](#testing)
  * [Bir Posta Listesi Oluşturun](#create-a-mailing-list)
  * [Abone Ekle](#add-subscribers)
  * [Bir Kampanya Oluşturun ve Gönderin](#create-and-send-a-campaign)
* [Doğrulama](#verification)
* [Geliştirici Notları](#developer-notes)
* [Çözüm](#conclusion)

## Genel Bakış {#overview}

Bu kılavuz, geliştiricilere güçlü bir açık kaynaklı bülten ve e-posta listesi yöneticisi olan [Liste rahibi](https://listmonk.app/)'ü SMTP sağlayıcısı olarak [E-postayı İlet](https://forwardemail.net/) ile birlikte kullanmak için adım adım kurulum talimatları sunar. Bu kombinasyon, güvenli, gizli ve güvenilir e-posta teslimatı sağlarken kampanyalarınızı etkili bir şekilde yönetmenizi sağlar.

* **Listmonk**: Abone yönetimi, liste organizasyonu, kampanya oluşturma ve performans takibini yönetir.
* **E-postayı İlet**: SPF, DKIM, DMARC ve TLS şifrelemesi gibi yerleşik güvenlik özellikleriyle e-postaların gerçek gönderimini yöneten güvenli SMTP sunucusu olarak hareket eder.

Bu ikisini entegre ederek, Forward Email'in güçlü dağıtım sisteminden yararlanırken verileriniz ve altyapınız üzerinde tam kontrole sahip olursunuz.

## Listmonk ve Yönlendirme E-postası Neden Kullanılır? {#why-listmonk-and-forward-email}

* **Açık Kaynak**: Hem Listmonk hem de Forward Email'in arkasındaki ilkeler şeffaflık ve kontrolü vurgular. Listmonk'u kendiniz barındırırsınız ve verilerinizin sahibi olursunuz.
* **Gizlilik Odaklı**: Forward Email, özünde gizlilikle oluşturulmuştur, veri saklamayı en aza indirir ve güvenli iletime odaklanır.
* **Maliyet Etkin**: Listmonk ücretsizdir ve Forward Email cömert ücretsiz kademeler ve uygun fiyatlı ücretli planlar sunar, bu da onu bütçe dostu bir çözüm haline getirir.
* **Ölçeklenebilirlik**: Listmonk oldukça performanslıdır ve Forward Email'in altyapısı ölçekte güvenilir teslimat için tasarlanmıştır.
* **Geliştirici Dostu**: Listmonk sağlam bir API sunar ve Forward Email basit SMTP entegrasyonu ve web kancaları sağlar.

## Önkoşullar {#prerequisites}

Başlamadan önce aşağıdakilere sahip olduğunuzdan emin olun:

* En az 1 CPU ve 1 GB RAM'e (2 GB önerilir) sahip, güncel bir Linux dağıtımı (Ubuntu 20.04+ önerilir) çalıştıran bir Sanal Özel Sunucu (VPS).
* Bir sağlayıcıya mı ihtiyacınız var? [önerilen VPS listesi](https://github.com/forwardemail/awesome-mail-server-providers)'ya göz atın.
* Kontrol ettiğiniz bir alan adı (DNS erişimi gereklidir).
* [E-postayı İlet](https://forwardemail.net/) erişimine sahip aktif bir hesap.
* VPS'nize root veya `sudo` erişimi.
* Linux komut satırı işlemlerine temel düzeyde aşinalık.

## Kurulum {#installation}

Bu adımlar, Docker ve Docker Compose kullanarak VPS'inizde Listmonk'u kurmanıza yardımcı olacaktır.

### 1. Sunucunuzu Güncelleyin {#1-update-your-server}

Sisteminizdeki paket listesinin ve yüklü paketlerin güncel olduğundan emin olun.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Bağımlılıkları Yükle {#2-install-dependencies}

Docker, Docker Compose ve UFW'yi (Karmaşık Olmayan Güvenlik Duvarı) yükleyin.

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Listmonk Yapılandırmasını İndirin {#3-download-listmonk-configuration}

Listmonk için bir dizin oluşturun ve resmi `docker-compose.yml` dosyasını indirin.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Bu dosya Listmonk uygulama kabını ve onun gerekli PostgreSQL veritabanı kabını tanımlar.

### 4. Güvenlik Duvarını (UFW) Yapılandırın {#4-configure-firewall-ufw}

Güvenlik duvarı üzerinden temel trafiğe (SSH, HTTP, HTTPS) izin verin. SSH'niz standart olmayan bir portta çalışıyorsa, buna göre ayarlayın.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

İstendiğinde güvenlik duvarının etkinleştirilmesini onaylayın.

### 5. HTTPS Erişimini Yapılandırın {#5-configure-https-access}

Listmonk'u HTTPS üzerinden çalıştırmak güvenlik açısından çok önemlidir. İki temel seçeneğiniz var:

#### Seçenek A: Cloudflare Proxy'yi Kullanma (Basitlik İçin Önerilir) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Alan adınızın DNS'i Cloudflare tarafından yönetiliyorsa, kolay HTTPS için proxy özelliğinden yararlanabilirsiniz.

1. **DNS Noktasını Belirle**: Listmonk alt alan adınız için Cloudflare'de VPS IP adresinize işaret eden bir `A` kaydı oluşturun (örneğin, `listmonk.yourdomain.com`). **Proxy durumunun** **Proxy'lendi** (turuncu bulut) olarak ayarlandığından emin olun.
2. **Docker Compose'u Değiştir**: İndirdiğiniz `docker-compose.yml` dosyasını düzenleyin:
```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
Bu, Listmonk'u 80 numaralı porttan dahili olarak erişilebilir hale getirir ve Cloudflare bu portu proxy olarak kullanabilir ve HTTPS ile güvenli hale getirebilir.

#### Seçenek B: Ters Proxy Kullanma (Nginx, Caddy, vb.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Alternatif olarak, HTTPS sonlandırmayı ve Listmonk'a (varsayılan olarak 9000 numaralı portta çalışır) gelen proxy isteklerini yönetmek için VPS'inizde Nginx veya Caddy gibi ters bir proxy ayarlayabilirsiniz.

* Listmonk'un yalnızca yerel olarak erişilebilir olmasını sağlamak için `docker-compose.yml` içindeki varsayılan `ports: - "127.0.0.1:9000:9000"` değerini koruyun.
* Seçtiğiniz ters proxy'yi 80 ve 443 portlarını dinleyecek, SSL sertifika alımını yönetecek (örneğin, Let's Encrypt aracılığıyla) ve trafiği `http://127.0.0.1:9000` adresine yönlendirecek şekilde yapılandırın.
* Ayrıntılı ters proxy kurulumu bu kılavuzun kapsamı dışındadır, ancak çevrimiçi olarak birçok eğitim mevcuttur.

### 6. Listmonk'u Başlat {#6-start-listmonk}

`listmonk` dizininize geri dönün (eğer orada değilseniz) ve kapsayıcıları ayrı modda başlatın.

```bash
cd ~/listmonk # Or the directory where you saved docker-compose.yml
docker compose up -d
```

Docker gerekli imajları indirecek ve Listmonk uygulamasını ve veritabanı kapsayıcılarını başlatacaktır. İlk seferde bir veya iki dakika sürebilir.

✅ **Listmonk'a Erişim**: Artık yapılandırdığınız etki alanı (örneğin, `https://listmonk.yourdomain.com`) üzerinden Listmonk web arayüzüne erişebilmeniz gerekir.

### 7. Listmonk'ta E-posta SMTP'sini Yönlendirmeyi Yapılandırın {#7-configure-forward-email-smtp-in-listmonk}

Daha sonra Listmonk'u, E-postaları İletme hesabınızı kullanarak gönderecek şekilde yapılandırın.

1. **İletilen E-postada SMTP'yi Etkinleştirin**: İletilen E-posta hesap panonuzda SMTP kimlik bilgilerinizi oluşturduğunuzdan emin olun. Henüz yapmadıysanız [SMTP aracılığıyla özel bir alan adıyla e-posta gönderme kılavuzunu iletin](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp) adımlarını izleyin.
2. **Listmonk'u Yapılandırın**: Listmonk yönetici panelinize giriş yapın.
* **Ayarlar -> SMTP** bölümüne gidin.

* Listmonk, Forward Email için yerleşik desteğe sahiptir. Sağlayıcı listesinden **ForwardEmail**'i seçin veya aşağıdaki ayrıntıları manuel olarak girin:

| Ayar | Değer |
| :---------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Ev sahibi** | `smtp.forwardemail.net` |
| **Liman** | `465` |
| **Yetkilendirme protokolü** | `LOGIN` |
| **Kullanıcı Adı** | İletilecek E-postanız **SMTP kullanıcı adı** |
| **Şifre** | İletilecek E-postanız **SMTP şifresi** |
| **TLS** | `SSL/TLS` |
| **E-postadan** | İstediğiniz `From` adresi (örneğin, `newsletter@yourdomain.com`). Bu etki alanının E-postayı İlet'te yapılandırıldığından emin olun. |

* **Önemli**: E-postayı İlet ile güvenli bağlantılar için her zaman `SSL/TLS` ile `465` portunu kullanın. STARTTLS (port 587) kullanmayın.

* **Kaydet**'e tıklayın.
3. **Test E-postası Gönder**: SMTP ayarları sayfasındaki "Test E-postası Gönder" düğmesini kullanın. Erişebileceğiniz bir alıcı adresi girin ve **Gönder**'e tıklayın. E-postanın alıcının gelen kutusuna ulaştığını doğrulayın.

### 8. Geri Dönüş İşlemeyi Yapılandırın {#8-configure-bounce-processing}

Geri tepme işleme, Listmonk'un teslim edilemeyen e-postaları (örneğin geçersiz adresler nedeniyle) otomatik olarak işlemesini sağlar. E-postayı İlet, Listmonk'u geri tepmeler hakkında bilgilendirmek için bir web kancası sağlar.

#### E-posta Yönlendirme Kurulumu {#forward-email-setup}

1. [E-postayı İlet Panosu](https://forwardemail.net/) hesabınıza giriş yapın.
2. **Etki Alanları** bölümüne gidin, gönderim için kullandığınız etki alanını seçin ve **Ayarlar** sayfasına gidin.
3. **Geri Dönen Web Kancası URL'si** bölümüne gidin.
4. Aşağıdaki URL'yi girin ve `<your_listmonk_domain>` adresini Listmonk örneğinizin erişilebilir olduğu gerçek etki alanı veya alt etki alanıyla değiştirin:
```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
*Örnek*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. **Web Kancası İmza Yükü Doğrulama Anahtarı** bölümüne doğru daha da aşağı kaydırın.
6. Oluşturulan doğrulama anahtarını **kopyalayın**. Buna Listmonk'ta ihtiyacınız olacak.
7. Yönlendirme E-postası etki alanı ayarlarınızdaki değişiklikleri kaydedin.

#### Listmonk Kurulumu {#listmonk-setup}

1. Listmonk yönetici panelinizde **Ayarlar -> Geri Dönenler** bölümüne gidin.
2. **Geri Dönme İşlemeyi Etkinleştir**'i etkinleştirin.
3. **Geri Dönme Web Kancalarını Etkinleştir**'i etkinleştirin.
4. **Web Kancası Sağlayıcıları** bölümüne gidin.
5. **E-postayı İlet**'i etkinleştirin.
6. E-posta İlet panosundan kopyaladığınız **Web Kancası İmza Yükü Doğrulama Anahtarını** **E-posta İlet Anahtarı** alanına yapıştırın.
7. Sayfanın altındaki **Kaydet**'e tıklayın.
8. Geri Dönme İşleme artık yapılandırıldı! E-posta İlet, Listmonk tarafından gönderilen bir e-posta için geri dönme tespit ettiğinde, web kancası aracılığıyla Listmonk örneğinize bildirimde bulunur ve Listmonk aboneyi buna göre işaretler.
9. Her şeyin çalıştığından emin olmak için aşağıdaki [Test](#testing) adımlarını tamamlayın.

## {#testing} test ediliyor

İşte temel Listmonk fonksiyonlarına dair kısa bir genel bakış:

### Bir Posta Listesi Oluşturun {#create-a-mailing-list}

* Kenar çubuğundaki **Listeler**'e gidin.
* **Yeni Liste**'ye tıklayın.
* Ayrıntıları girin (Ad, Tür: Genel/Özel, Açıklama, Etiketler) ve **Kaydet**.

### Abone Ekle {#add-subscribers}

* **Aboneler** bölümüne gidin.
* Aboneleri şu şekilde ekleyebilirsiniz:
* **Manuel**: **Yeni Abone**'ye tıklayın.
* **İçe Aktar**: CSV dosyası yüklemek için **Aboneleri İçe Aktar**'a tıklayın.
* **API**: Programatik eklemeler için Listmonk API'sini kullanın.
* Oluşturma veya içe aktarma sırasında aboneleri bir veya daha fazla listeye atayın.
* **En İyi Uygulama**: Çift katılım süreci kullanın. Bunu **Ayarlar -> Katılım ve Abonelikler** altında yapılandırın.

### Bir Kampanya Oluşturun ve Gönderin {#create-and-send-a-campaign}

* **Kampanyalar** -> **Yeni Kampanya**'ya gidin.
* Kampanya ayrıntılarını girin (Ad, Konu, Kimden E-postası, Gönderilecek Liste(ler)).
* İçerik türünüzü seçin (Zengin Metin/HTML, Düz Metin, Ham HTML).
* E-posta içeriğinizi oluşturun. `{{ .Subscriber.Email }}` veya `{{ .Subscriber.FirstName }}` gibi şablon değişkenleri kullanabilirsiniz.
* **Önce mutlaka bir test e-postası gönderin!** E-postayı gelen kutunuzda önizlemek için "Test Gönder" seçeneğini kullanın.
* Memnun kaldığınızda, hemen göndermek veya daha sonra göndermek için **Kampanyayı Başlat**'a tıklayın.

## Doğrulama {#verification}

* **SMTP Teslimatı**: Listmonk'un SMTP ayarları sayfası üzerinden düzenli olarak test e-postaları gönderin ve e-postaların doğru şekilde teslim edildiğinden emin olmak için kampanyaları test edin.
* **Geri Dönen İleti Yönetimi**: Bilinen geçersiz bir e-posta adresine (örneğin, elinizde gerçek bir e-posta adresi yoksa `bounce-test@yourdomain.com`, ancak sonuçlar değişiklik gösterebilir) bir test kampanyası gönderin. Geri dönmenin kaydedilip kaydedilmediğini görmek için kısa bir süre sonra Listmonk'taki kampanya istatistiklerini kontrol edin.
* **E-posta Başlıkları**: SPF, DKIM ve DMARC'nin geçtiğini ve E-posta İletme aracılığıyla doğru kurulumu gösterdiğini doğrulamak için [Posta Test Cihazı](https://www.mail-tester.com/) gibi araçları kullanın veya e-posta başlıklarını manuel olarak inceleyin.
* **İletilen E-posta Günlükleri**: SMTP sunucusundan kaynaklanan teslimat sorunlarından şüpheleniyorsanız, E-posta İletme panosu günlüklerinizi kontrol edin.

## Geliştirici Notları {#developer-notes}

* **Şablonlama**: Listmonk, Go'nun şablonlama motorunu kullanır. Gelişmiş kişiselleştirme için belgelerini inceleyin: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk, listeleri, aboneleri, kampanyaları, şablonları ve daha fazlasını yönetmek için kapsamlı bir REST API sağlar. API belgeleri bağlantısını Listmonk örneğinizin altbilgisinde bulabilirsiniz.
* **Özel Alanlar**: Ek verileri depolamak için **Ayarlar -> Abone Alanları** altında özel abone alanları tanımlayın.
* **Web Kancaları**: Listmonk, geri dönen iletilerin yanı sıra diğer olaylar (örneğin abonelikler) için de web kancaları göndererek diğer sistemlerle entegrasyona olanak tanır.

## Sonuç {#conclusion}

Listmonk'un kendi kendine barındırılan gücünü Forward Email'in güvenli, gizliliğe saygılı teslimatıyla bütünleştirerek sağlam ve etik bir e-posta pazarlama platformu yaratırsınız. Yüksek teslimat ve otomatik güvenlik özelliklerinden faydalanırken hedef kitlenizin verilerinin tam mülkiyetini korursunuz.

Bu kurulum, açık kaynaklı yazılım ve kullanıcı gizliliği ilkeleriyle mükemmel bir şekilde uyumlu, tescilli e-posta hizmetlerine ölçeklenebilir, uygun maliyetli ve geliştirici dostu bir alternatif sunar.

Mutlu Gönderiler! 🚀