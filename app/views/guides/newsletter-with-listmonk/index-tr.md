# Güvenli Bülten Teslimatı için Forward Email ile Listmonk {#listmonk-with-forward-email-for-secure-newsletter-delivery}


## İçindekiler {#table-of-contents}

* [Genel Bakış](#overview)
* [Neden Listmonk ve Forward Email](#why-listmonk-and-forward-email)
* [Ön Koşullar](#prerequisites)
* [Kurulum](#installation)
  * [1. Sunucunuzu Güncelleyin](#1-update-your-server)
  * [2. Bağımlılıkları Yükleyin](#2-install-dependencies)
  * [3. Listmonk Yapılandırmasını İndirin](#3-download-listmonk-configuration)
  * [4. Güvenlik Duvarını (UFW) Yapılandırın](#4-configure-firewall-ufw)
  * [5. HTTPS Erişimini Yapılandırın](#5-configure-https-access)
  * [6. Listmonk'u Başlatın](#6-start-listmonk)
  * [7. Listmonk'ta Forward Email SMTP'sini Yapılandırın](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Bounce İşlemeyi Yapılandırın](#8-configure-bounce-processing)
* [Test Etme](#testing)
  * [Bir Mailing Listesi Oluşturun](#create-a-mailing-list)
  * [Aboneler Ekleyin](#add-subscribers)
  * [Bir Kampanya Oluşturun ve Gönderin](#create-and-send-a-campaign)
* [Doğrulama](#verification)
* [Geliştirici Notları](#developer-notes)
* [Sonuç](#conclusion)


## Genel Bakış {#overview}

Bu rehber, geliştiricilere güçlü açık kaynaklı bülten ve mailing listesi yöneticisi olan [Listmonk](https://listmonk.app/)'u, SMTP sağlayıcısı olarak [Forward Email](https://forwardemail.net/)'i kullanacak şekilde kurmaları için adım adım talimatlar sunar. Bu kombinasyon, kampanyalarınızı etkili bir şekilde yönetmenizi sağlarken güvenli, özel ve güvenilir e-posta teslimatı sağlar.

* **Listmonk**: Abone yönetimi, liste organizasyonu, kampanya oluşturma ve performans takibini gerçekleştirir.
* **Forward Email**: Güvenli SMTP sunucusu olarak görev yapar, SPF, DKIM, DMARC ve TLS şifrelemesi gibi yerleşik güvenlik özellikleriyle e-postaların gerçek gönderimini yönetir.

Bu ikisini entegre ederek, verileriniz ve altyapınız üzerinde tam kontrolü korurken Forward Email'in sağlam teslimat sisteminden faydalanırsınız.


## Neden Listmonk ve Forward Email {#why-listmonk-and-forward-email}

* **Açık Kaynak**: Hem Listmonk hem de Forward Email'in prensipleri şeffaflık ve kontrolü vurgular. Listmonk'u kendiniz barındırır, verilerinizin sahibi olursunuz.
* **Gizlilik Odaklı**: Forward Email gizliliği temel alarak inşa edilmiştir, veri saklamayı en aza indirir ve güvenli iletime odaklanır.
* **Maliyet Etkin**: Listmonk ücretsizdir ve Forward Email cömert ücretsiz katmanlar ve uygun fiyatlı ücretli planlar sunar, bu da bütçe dostu bir çözümdür.
* **Ölçeklenebilirlik**: Listmonk yüksek performanslıdır ve Forward Email'in altyapısı ölçeklenebilir güvenilir teslimat için tasarlanmıştır.
* **Geliştirici Dostu**: Listmonk sağlam bir API sunar ve Forward Email basit SMTP entegrasyonu ve webhooklar sağlar.


## Ön Koşullar {#prerequisites}

Başlamadan önce aşağıdakilere sahip olduğunuzdan emin olun:

* Güncel bir Linux dağıtımı (Ubuntu 20.04+ önerilir) çalıştıran, en az 1 CPU ve 1GB RAM (2GB önerilir) olan bir Sanal Özel Sunucu (VPS).
  * Sağlayıcı mı arıyorsunuz? [Önerilen VPS listesine](https://github.com/forwardemail/awesome-mail-server-providers) göz atın.
* Kontrolünüzde bir alan adı (DNS erişimi gerekli).
* [Forward Email](https://forwardemail.net/) ile aktif bir hesap.
* VPS'inizde root veya `sudo` erişimi.
* Linux komut satırı işlemlerine temel aşinalık.


## Kurulum {#installation}

Bu adımlar, VPS'inizde Docker ve Docker Compose kullanarak Listmonk'u kurmanıza rehberlik eder.

### 1. Sunucunuzu Güncelleyin {#1-update-your-server}

Sistem paket listenizin ve yüklü paketlerin güncel olduğundan emin olun.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Bağımlılıkları Yükleyin {#2-install-dependencies}

Docker, Docker Compose ve UFW (Basitleştirilmiş Güvenlik Duvarı) yükleyin.

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Listmonk Yapılandırmasını İndirin {#3-download-listmonk-configuration}

Listmonk için bir dizin oluşturun ve resmi `docker-compose.yml` dosyasını indirin.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Bu dosya, Listmonk uygulama konteynerini ve gerekli PostgreSQL veritabanı konteynerini tanımlar.
### 4. Güvenlik Duvarını (UFW) Yapılandırma {#4-configure-firewall-ufw}

Güvenlik duvarından temel trafiğe (SSH, HTTP, HTTPS) izin verin. SSH'niz standart olmayan bir portta çalışıyorsa, buna göre ayarlayın.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

İstendiğinde güvenlik duvarını etkinleştirmeyi onaylayın.

### 5. HTTPS Erişimini Yapılandırma {#5-configure-https-access}

Listmonk'u HTTPS üzerinden çalıştırmak güvenlik için çok önemlidir. İki temel seçeneğiniz vardır:

#### Seçenek A: Cloudflare Proxy Kullanımı (Basitlik İçin Önerilir) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Alan adınızın DNS'i Cloudflare tarafından yönetiliyorsa, kolay HTTPS için onların proxy özelliğini kullanabilirsiniz.

1. **DNS Yönlendirme**: Cloudflare'de Listmonk alt alan adınız (örneğin, `listmonk.yourdomain.com`) için VPS IP adresinize işaret eden bir `A` kaydı oluşturun. **Proxy durumu**nun **Proxied** (turuncu bulut) olarak ayarlandığından emin olun.
2. **Docker Compose Dosyasını Değiştirin**: İndirdiğiniz `docker-compose.yml` dosyasını düzenleyin:
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   Bu, Listmonk'un dahili olarak 80 numaralı portta erişilebilir olmasını sağlar; Cloudflare bu portu proxy yaparak HTTPS ile güvence altına alabilir.

#### Seçenek B: Reverse Proxy Kullanımı (Nginx, Caddy, vb.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Alternatif olarak, VPS'nizde Nginx veya Caddy gibi bir reverse proxy kurarak HTTPS sonlandırmasını yapabilir ve istekleri Listmonk'a (varsayılan olarak 9000 portunda çalışan) iletebilirsiniz.

* `docker-compose.yml` dosyasında varsayılan `ports: - "127.0.0.1:9000:9000"` ayarını koruyun, böylece Listmonk sadece yerel olarak erişilebilir olur.
* Seçtiğiniz reverse proxy'yi 80 ve 443 portlarında dinleyecek şekilde yapılandırın, SSL sertifikası edinimini (örneğin Let's Encrypt ile) yönetin ve trafiği `http://127.0.0.1:9000` adresine yönlendirin.
* Reverse proxy kurulumu bu rehberin kapsamı dışındadır, ancak çevrimiçi birçok detaylı eğitim mevcuttur.

### 6. Listmonk'u Başlatma {#6-start-listmonk}

`listmonk` dizinine geri gidin (zaten orada değilseniz) ve konteynerleri ayrık modda başlatın.

```bash
cd ~/listmonk # Veya docker-compose.yml dosyasını kaydettiğiniz dizin
docker compose up -d
```

Docker gerekli imajları indirip Listmonk uygulaması ve veritabanı konteynerlerini başlatacaktır. İlk seferde bir veya iki dakika sürebilir.

✅ **Listmonk'a Erişim**: Artık yapılandırdığınız alan adı üzerinden Listmonk web arayüzüne erişebilmelisiniz (örneğin, `https://listmonk.yourdomain.com`).

### 7. Listmonk'ta Forward Email SMTP Ayarlarını Yapılandırma {#7-configure-forward-email-smtp-in-listmonk}

Sonraki adımda, Listmonk'un e-postaları Forward Email hesabınız üzerinden göndermesini yapılandırın.

1. **Forward Email'de SMTP'yi Etkinleştirin**: Forward Email hesap panelinizde SMTP kimlik bilgileri oluşturduğunuzdan emin olun. Henüz yapmadıysanız, [Forward Email rehberini kullanarak özel alan adı ile SMTP üzerinden e-posta gönderme](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp) adımlarını takip edin.
2. **Listmonk'u Yapılandırın**: Listmonk yönetici panelinize giriş yapın.
   * **Ayarlar -> SMTP** bölümüne gidin.

   * Listmonk, Forward Email için yerleşik destek sunar. Sağlayıcı listesinden **ForwardEmail**'i seçin veya aşağıdaki bilgileri manuel olarak girin:

     | Ayar              | Değer                                                                                                              |
     | :---------------- | :----------------------------------------------------------------------------------------------------------------- |
     | **Host**          | `smtp.forwardemail.net`                                                                                            |
     | **Port**          | `465`                                                                                                              |
     | **Auth protocol** | `LOGIN`                                                                                                            |
     | **Kullanıcı Adı** | Forward Email **SMTP kullanıcı adınız**                                                                           |
     | **Parola**        | Forward Email **SMTP parolanız**                                                                                   |
     | **TLS**           | `SSL/TLS`                                                                                                          |
     | **Gönderen e-posta** | İstediğiniz `From` adresi (örneğin, `newsletter@yourdomain.com`). Bu alan adının Forward Email'de yapılandırıldığından emin olun. |
* **Önemli**: Forward Email ile güvenli bağlantılar için her zaman `SSL/TLS` ile Port `465` kullanın (önerilir). STARTTLS ile Port `587` de desteklenmektedir ancak SSL/TLS tercih edilir.

   * **Kaydet**'e tıklayın.
3. **Test E-postası Gönder**: SMTP ayarları sayfasındaki "Test E-postası Gönder" butonunu kullanın. Erişebileceğiniz bir alıcı adresi girin ve **Gönder**'e tıklayın. E-postanın alıcının gelen kutusuna ulaştığını doğrulayın.

### 8. Bounce İşleme Yapılandırması {#8-configure-bounce-processing}

Bounce işleme, Listmonk'un teslim edilemeyen e-postaları (örneğin, geçersiz adresler nedeniyle) otomatik olarak işlemesini sağlar. Forward Email, Listmonk'u bounce hakkında bilgilendirmek için bir webhook sağlar.

#### Forward Email Kurulumu {#forward-email-setup}

1. [Forward Email Kontrol Panelinize](https://forwardemail.net/) giriş yapın.
2. **Domains** bölümüne gidin, gönderim için kullandığınız alan adını seçin ve **Settings** sayfasına gidin.
3. **Bounce Webhook URL** bölümüne ilerleyin.
4. Aşağıdaki URL'yi girin, `<your_listmonk_domain>` kısmını Listmonk örneğinizin erişilebilir olduğu gerçek alan adı veya alt alan adı ile değiştirin:
   ```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *Örnek*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Daha aşağıdaki **Webhook Signature Payload Verification Key** bölümüne ilerleyin.
6. Oluşturulan doğrulama anahtarını **kopyalayın**. Bunu Listmonk'ta kullanacaksınız.
7. Forward Email alan adı ayarlarınızda değişiklikleri kaydedin.

#### Listmonk Kurulumu {#listmonk-setup}

1. Listmonk yönetici panelinizde **Settings -> Bounces** bölümüne gidin.
2. **Enable bounce processing** seçeneğini etkinleştirin.
3. **Enable bounce webhooks** seçeneğini etkinleştirin.
4. **Webhook Providers** bölümüne ilerleyin.
5. **Forward Email** seçeneğini etkinleştirin.
6. Forward Email kontrol panelinden kopyaladığınız **Webhook Signature Payload Verification Key**'i **Forward Email Key** alanına yapıştırın.
7. Sayfanın altındaki **Save** butonuna tıklayın.
8. Bounce işleme artık yapılandırıldı! Forward Email, Listmonk tarafından gönderilen bir e-postada bounce algıladığında webhook aracılığıyla Listmonk örneğinizi bilgilendirecek ve Listmonk aboneyi buna göre işaretleyecektir.
9. Her şeyin çalıştığından emin olmak için aşağıdaki [Testing](#testing) bölümündeki adımları tamamlayın.


## Test Etme {#testing}

İşte temel Listmonk fonksiyonlarının hızlı bir özeti:

### Bir Mailing Listesi Oluşturma {#create-a-mailing-list}

* Kenar çubuğunda **Lists** bölümüne gidin.
* **New List**'e tıklayın.
* Detayları doldurun (İsim, Tür: Public/Private, Açıklama, Etiketler) ve **Kaydet**.

### Abone Ekleme {#add-subscribers}

* **Subscribers** bölümüne gidin.
* Aboneleri şu yollarla ekleyebilirsiniz:
  * **Manuel**: **New Subscriber**'a tıklayın.
  * **İçe Aktar**: CSV dosyası yüklemek için **Import Subscribers**'a tıklayın.
  * **API**: Programatik eklemeler için Listmonk API'sini kullanın.
* Aboneleri oluşturma veya içe aktarma sırasında bir veya daha fazla listeye atayın.
* **En İyi Uygulama**: Çift onay (double opt-in) süreci kullanın. Bunu **Settings -> Opt-in & Subscriptions** altında yapılandırabilirsiniz.

### Kampanya Oluşturma ve Gönderme {#create-and-send-a-campaign}

* **Campaigns** -> **New Campaign**'e gidin.
* Kampanya detaylarını doldurun (İsim, Konu, Gönderen E-posta, Gönderilecek Liste(ler)).
* İçerik türünüzü seçin (Rich Text/HTML, Plain Text, Raw HTML).
* E-posta içeriğinizi oluşturun. `{{ .Subscriber.Email }}` veya `{{ .Subscriber.FirstName }}` gibi şablon değişkenleri kullanabilirsiniz.
* **Her zaman önce test e-postası gönderin!** E-postayı gelen kutunuzda önizlemek için "Send Test" seçeneğini kullanın.
* Memnun kaldığınızda, hemen göndermek için **Start Campaign**'e tıklayın veya daha sonra planlayın.


## Doğrulama {#verification}

* **SMTP Teslimatı**: Listmonk'un SMTP ayarları sayfasından ve test kampanyalarından düzenli olarak test e-postaları göndererek e-postaların doğru teslim edildiğinden emin olun.
* **Bounce İşleme**: Bilinen geçersiz bir e-posta adresine test kampanyası gönderin (örneğin, gerçek bir adresiniz yoksa `bounce-test@yourdomain.com` kullanabilirsiniz, ancak sonuçlar değişebilir). Kısa bir süre sonra Listmonk kampanya istatistiklerini kontrol ederek bounce kaydının yapılıp yapılmadığını görün.
* **E-posta Başlıkları**: [Mail-Tester](https://www.mail-tester.com/) gibi araçları kullanarak veya e-posta başlıklarını manuel inceleyerek SPF, DKIM ve DMARC doğrulamalarının geçtiğini kontrol edin; bu, Forward Email üzerinden doğru yapılandırmayı gösterir.
* **Forward Email Kayıtları**: SMTP sunucusundan kaynaklanan teslimat sorunlarından şüpheleniyorsanız Forward Email kontrol panelinizdeki kayıtları kontrol edin.
## Geliştirici Notları {#developer-notes}

* **Şablonlama**: Listmonk, Go'nun şablon motorunu kullanır. Gelişmiş kişiselleştirme için belgelerini inceleyin: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk, listeler, aboneler, kampanyalar, şablonlar ve daha fazlasını yönetmek için kapsamlı bir REST API sağlar. API dokümantasyon bağlantısını Listmonk örneğinizin altbilgisinde bulabilirsiniz.
* **Özel Alanlar**: Ek veri depolamak için **Ayarlar -> Abone Alanları** altında özel abone alanları tanımlayın.
* **Webhooklar**: Geri dönen e-postaların yanı sıra, Listmonk diğer olaylar (örneğin, abonelikler) için de webhook gönderebilir ve böylece diğer sistemlerle entegrasyon sağlar.


## Sonuç {#conclusion}

Listmonk'un kendi kendine barındırılan gücünü, Forward Email'in güvenli ve gizliliğe saygılı teslimatıyla entegre ederek sağlam ve etik bir e-posta pazarlama platformu oluşturursunuz. Hedef kitlenizin verileri üzerinde tam sahiplik sağlarken, yüksek teslimat oranları ve otomatik güvenlik özelliklerinden faydalanırsınız.

Bu kurulum, tescilli e-posta hizmetlerine karşı ölçeklenebilir, maliyet etkin ve geliştirici dostu bir alternatif sunar ve açık kaynak yazılım ile kullanıcı gizliliği anlayışıyla mükemmel şekilde uyumludur.

İyi Göndermeler! 🚀
