# E-posta API'si {#email-api}


## İçindekiler {#table-of-contents}

* [Kütüphaneler](#libraries)
* [Temel URI](#base-uri)
* [Kimlik Doğrulama](#authentication)
  * [API Token Kimlik Doğrulaması (Çoğu uç nokta için önerilir)](#api-token-authentication-recommended-for-most-endpoints)
  * [Alias Kimlik Bilgileri ile Kimlik Doğrulama (Giden e-posta için)](#alias-credentials-authentication-for-outbound-email)
  * [Sadece Alias Uç Noktaları](#alias-only-endpoints)
* [Hatalar](#errors)
* [Yerelleştirme](#localization)
* [Sayfalandırma](#pagination)
* [Kayıtlar](#logs)
  * [Kayıtları al](#retrieve-logs)
* [Hesap](#account)
  * [Hesap oluştur](#create-account)
  * [Hesabı al](#retrieve-account)
  * [Hesabı güncelle](#update-account)
* [Alias Kişiler (CardDAV)](#alias-contacts-carddav)
  * [Kişileri listele](#list-contacts)
  * [Kişi oluştur](#create-contact)
  * [Kişiyi al](#retrieve-contact)
  * [Kişiyi güncelle](#update-contact)
  * [Kişiyi sil](#delete-contact)
* [Alias Takvimler (CalDAV)](#alias-calendars-caldav)
  * [Takvimleri listele](#list-calendars)
  * [Takvim oluştur](#create-calendar)
  * [Takvimi al](#retrieve-calendar)
  * [Takvimi güncelle](#update-calendar)
  * [Takvimi sil](#delete-calendar)
* [Alias Mesajlar (IMAP/POP3)](#alias-messages-imappop3)
  * [Mesajları listele ve ara](#list-and-search-for-messages)
  * [Mesaj oluştur](#create-message)
  * [Mesajı al](#retrieve-message)
  * [Mesajı güncelle](#update-message)
  * [Mesajı sil](#delete-message)
* [Alias Klasörler (IMAP/POP3)](#alias-folders-imappop3)
  * [Klasörleri listele](#list-folders)
  * [Klasör oluştur](#create-folder)
  * [Klasörü al](#retrieve-folder)
  * [Klasörü güncelle](#update-folder)
  * [Klasörü sil](#delete-folder)
  * [Klasörü kopyala](#copy-folder)
* [Giden E-postalar](#outbound-emails)
  * [Giden SMTP e-posta limitini al](#get-outbound-smtp-email-limit)
  * [Giden SMTP e-postalarını listele](#list-outbound-smtp-emails)
  * [Giden SMTP e-postası oluştur](#create-outbound-smtp-email)
  * [Giden SMTP e-postasını al](#retrieve-outbound-smtp-email)
  * [Giden SMTP e-postasını sil](#delete-outbound-smtp-email)
* [Alan Adları](#domains)
  * [Alan adlarını listele](#list-domains)
  * [Alan adı oluştur](#create-domain)
  * [Alan adını al](#retrieve-domain)
  * [Alan adı kayıtlarını doğrula](#verify-domain-records)
  * [Alan adı SMTP kayıtlarını doğrula](#verify-domain-smtp-records)
  * [Alan adı genel catch-all şifrelerini listele](#list-domain-wide-catch-all-passwords)
  * [Alan adı genel catch-all şifresi oluştur](#create-domain-wide-catch-all-password)
  * [Alan adı genel catch-all şifresini kaldır](#remove-domain-wide-catch-all-password)
  * [Alan adını güncelle](#update-domain)
  * [Alan adını sil](#delete-domain)
* [Davetler](#invites)
  * [Alan adı davetini kabul et](#accept-domain-invite)
  * [Alan adı daveti oluştur](#create-domain-invite)
  * [Alan adı davetini kaldır](#remove-domain-invite)
* [Üyeler](#members)
  * [Alan adı üyesini güncelle](#update-domain-member)
  * [Alan adı üyesini kaldır](#remove-domain-member)
* [Aliaslar](#aliases)
  * [Alias şifresi oluştur](#generate-an-alias-password)
  * [Alan adı aliaslarını listele](#list-domain-aliases)
  * [Yeni alan adı aliası oluştur](#create-new-domain-alias)
  * [Alan adı aliasını al](#retrieve-domain-alias)
  * [Alan adı aliasını güncelle](#update-domain-alias)
  * [Alan adı aliasını sil](#delete-domain-alias)
* [Şifrele](#encrypt)
  * [TXT Kaydını Şifrele](#encrypt-txt-record)


## Kütüphaneler {#libraries}

Şu anda henüz herhangi bir API sarmalayıcısı yayınlamadık, ancak yakın gelecekte bunu yapmayı planlıyoruz. Belirli bir programlama dilinin API sarmalayıcısı yayınlandığında bilgilendirilmek isterseniz <api@forwardemail.net> adresine e-posta gönderin. Bu arada, uygulamanızda bu önerilen HTTP istek kütüphanelerini kullanabilir veya aşağıdaki örneklerde olduğu gibi basitçe [curl](https://stackoverflow.com/a/27442239/3586413) kullanabilirsiniz.

| Dil        | Kütüphane                                                             |
| ---------- | -------------------------------------------------------------------- |
| Ruby       | [Faraday](https://github.com/lostisland/faraday)                    |
| Python     | [requests](https://github.com/psf/requests)                          |
| Java       | [OkHttp](https://github.com/square/okhttp/)                         |
| PHP        | [guzzle](https://github.com/guzzle/guzzle)                          |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (biz yöneticileriz) |
| Node.js    | [superagent](https://github.com/ladjs/superagent) (biz yöneticileriz) |
| Go         | [net/http](https://golang.org/pkg/net/http/)                        |
| .NET       | [RestSharp](https://github.com/restsharp/RestSharp)                 |
## Temel URI {#base-uri}

Mevcut HTTP temel URI yolu: `BASE_URI`.


## Kimlik Doğrulama {#authentication}

Tüm uç noktalar [Temel Yetkilendirme](https://en.wikipedia.org/wiki/Basic_access_authentication) kullanılarak kimlik doğrulaması gerektirir. İki kimlik doğrulama yöntemi destekliyoruz:

### API Jetonu Kimlik Doğrulaması (Çoğu uç nokta için önerilir) {#api-token-authentication-recommended-for-most-endpoints}

[API anahtarınızı](https://forwardemail.net/my-account/security) "kullanıcı adı" değeri olarak, boş bir parola ile ayarlayın:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

API jetonundan sonra gelen iki nokta üst üste (`:`) işaretine dikkat edin – bu, Temel Yetkilendirme formatında boş bir parolayı gösterir.

### Takma Ad Kimlik Bilgileri Kimlik Doğrulaması (Giden e-posta için) {#alias-credentials-authentication-for-outbound-email}

[SMTP üzerinden giden e-posta oluşturma](#create-outbound-smtp-email) uç noktası, takma ad e-posta adresiniz ve [oluşturulmuş takma ad parolası](/faq#do-you-support-receiving-email-with-imap) kullanılarak kimlik doğrulamayı da destekler:

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hello" \
  -d "text=Test email"
```

Bu yöntem, zaten SMTP kimlik bilgileri kullanan uygulamalardan e-posta gönderirken faydalıdır ve SMTP'den API'ye geçişi sorunsuz hale getirir.

### Sadece Takma Ad Uç Noktaları {#alias-only-endpoints}

[Takma Ad Kişileri](#alias-contacts-carddav), [Takma Ad Takvimleri](#alias-calendars-caldav), [Takma Ad Mesajları](#alias-messages-imappop3) ve [Takma Ad Klasörleri](#alias-folders-imappop3) uç noktaları takma ad kimlik bilgileri gerektirir ve API jetonu kimlik doğrulamasını desteklemez.

Endişelenmeyin – ne olduğunu bilmiyorsanız aşağıda örnekler sağlanmıştır.


## Hatalar {#errors}

Herhangi bir hata oluşursa, API isteğinin yanıt gövdesinde ayrıntılı bir hata mesajı bulunacaktır.

| Kod  | Adı                   |
| ---- | --------------------- |
| 200  | Tamam                 |
| 400  | Geçersiz İstek        |
| 401  | Yetkisiz              |
| 403  | Yasaklanmış           |
| 404  | Bulunamadı            |
| 429  | Çok Fazla İstek       |
| 500  | Dahili Sunucu Hatası  |
| 501  | Uygulanmadı           |
| 502  | Kötü Ağ Geçidi        |
| 503  | Hizmet Kullanılamıyor |
| 504  | Ağ Geçidi Zaman Aşımı |

> \[!TIP]
> Eğer 5xx durum kodu alırsanız (bu olmamalı), lütfen <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> adresinden bizimle iletişime geçin, sorununuzu hemen çözmenize yardımcı olacağız.


## Yerelleştirme {#localization}

Hizmetimiz 25'ten fazla farklı dile çevrilmiştir. Tüm API yanıt mesajları, API isteğini yapan kullanıcının algılanan son yereline göre çevrilir. Bunu, özel bir `Accept-Language` başlığı geçirerek geçersiz kılabilirsiniz. Bu sayfanın altındaki dil açılır menüsünü kullanarak denemekten çekinmeyin.


## Sayfalama {#pagination}

> \[!NOTE]
> 1 Kasım 2024 itibarıyla [Alanları Listele](#list-domains) ve [Alan Takma Adlarını Listele](#list-domain-aliases) API uç noktaları sayfa başına varsayılan olarak `1000` maksimum sonuç döndürecektir. Bu davranışı erken kullanmak isterseniz, uç nokta sorgu URL'sine ek bir sorgu parametresi olarak `?paginate=true` geçebilirsiniz.

Sayfalama, sonuçları listeleyen tüm API uç noktaları tarafından desteklenir.

Sadece `page` (ve isteğe bağlı olarak `limit`) sorgu dizesi özelliklerini sağlayın.

`page` özelliği `1` veya daha büyük bir sayı olmalıdır. `limit` sağlarsanız (o da bir sayı), minimum değer `10` ve maksimum değer `50`'dir (aksi belirtilmedikçe).

| Sorgu Dizisi Parametresi | Zorunlu | Tür    | Açıklama                                                                                                                                                 |
| ------------------------ | ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                   | Hayır   | Sayı   | Döndürülecek sonuç sayfası. Belirtilmezse, `page` değeri `1` olur. `1` veya daha büyük bir sayı olmalıdır.                                               |
| `limit`                  | Hayır   | Sayı   | Sayfa başına döndürülecek sonuç sayısı. Belirtilmezse varsayılan `10`'dur. `1` veya daha büyük ve `50` veya daha küçük bir sayı olmalıdır.               |
Daha fazla sonucun olup olmadığını belirlemek için, programlı olarak sayfalama yapmak üzere ayrıştırabileceğiniz bu HTTP yanıt başlıklarını sağlıyoruz:

| HTTP Response Header | Örnek                                                                                                                                                                                                                                                    | Açıklama                                                                                                                                                                                                                                                                                                                                                          |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `X-Page-Count`       | `X-Page-Count: 3`                                                                                                                                                                                                                                        | Mevcut toplam sayfa sayısı.                                                                                                                                                                                                                                                                                                                                     |
| `X-Page-Current`     | `X-Page-Current: 1`                                                                                                                                                                                                                                      | Döndürülen sonuçların mevcut sayfası (örneğin `page` sorgu parametresine göre).                                                                                                                                                                                                                                                                                   |
| `X-Page-Size`        | `X-Page-Size: 10`                                                                                                                                                                                                                                        | Döndürülen sayfadaki toplam sonuç sayısı (örneğin `limit` sorgu parametresine ve döndürülen gerçek sonuçlara göre).                                                                                                                                                                                                                                               |
| `X-Item-Count`       | `X-Item-Count: 30`                                                                                                                                                                                                                                       | Tüm sayfalarda mevcut toplam öğe sayısı.                                                                                                                                                                                                                                                                                                                       |
| `Link`               | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Örnekte gösterildiği gibi ayrıştırabileceğiniz bir `Link` HTTP yanıt başlığı sağlıyoruz. Bu, [GitHub'a benzer](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (örneğin, ilgili veya mevcut değilse tüm değerler sağlanmaz, örneğin başka bir sayfa yoksa `"next"` sağlanmaz). |
> Örnek İstek:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## Kayıtlar {#logs}

### Kayıtları al {#retrieve-logs}

API'miz, hesabınız için kayıtları programlı olarak indirmenize olanak tanır. Bu uç noktaya yapılan bir istek, hesabınızdaki tüm kayıtları işler ve tamamlandığında bunları bir ek olarak ([Gzip](https://en.wikipedia.org/wiki/Gzip) sıkıştırılmış [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) elektronik tablo dosyası) e-posta ile size gönderir.

Bu, istediğiniz zaman kayıtları almak için bir [Cron işi](https://en.wikipedia.org/wiki/Cron) veya bizim [Node.js iş zamanlama yazılımımız Bree](https://github.com/breejs/bree) kullanarak arka plan işleri oluşturmanıza olanak tanır. Bu uç noktanın günde `10` istek ile sınırlı olduğunu unutmayın.

Ek dosya, `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` dosyasının küçük harfli hali olup, e-postanın kendisi alınan kayıtların kısa bir özetini içerir. Ayrıca kayıtları istediğiniz zaman [Hesabım → Kayıtlar](/my-account/logs) bölümünden indirebilirsiniz.

> `GET /v1/logs/download`

| Sorgu Parametresi    | Zorunlu | Tür           | Açıklama                                                                                                                       |
| -------------------- | ------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `domain`             | Hayır   | String (FQDN) | Kayıtları tam nitelikli alan adına ("FQDN") göre filtreleyin. Sağlanmazsa tüm alanlardaki tüm kayıtlar alınır.                 |
| `q`                  | Hayır   | String        | Kayıtları e-posta, alan adı, takma ad, IP adresi veya tarih (`M/Y`, `M/D/YY`, `M-D`, `M-D-YY` veya `M.D.YY` formatında) ile arayın. |
| `bounce_category`    | Hayır   | String        | Belirli bir bounce kategorisine göre kayıtları arayın (ör. `blocklist`).                                                        |
| `response_code`      | Hayır   | Number        | Belirli bir hata yanıt koduna göre kayıtları arayın (ör. `421` veya `550`).                                                    |

> Örnek İstek:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Örnek Cron işi (her gece yarısı):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Cron işi ifade sözdiziminizi doğrulamak için [Crontab.guru](https://crontab.guru/) gibi hizmetleri kullanabileceğinizi unutmayın.

> Örnek Cron işi (her gece yarısı **ve önceki günün kayıtları ile**):

MacOS için:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Linux ve Ubuntu için:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```


## Hesap {#account}

### Hesap oluştur {#create-account}

> `POST /v1/account`

| Gövde Parametresi | Zorunlu | Tür            | Açıklama       |
| ----------------- | ------- | -------------- | -------------- |
| `email`           | Evet    | String (Email) | E-posta adresi |
| `password`        | Evet    | String         | Şifre          |

> Örnek İstek:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Hesabı al {#retrieve-account}

> `GET /v1/account`

> Örnek İstek:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Hesabı güncelle {#update-account}

> `PUT /v1/account`

| Gövde Parametresi | Zorunlu | Tür            | Açıklama            |
| ----------------- | ------- | -------------- | ------------------- |
| `email`           | Hayır   | String (Email) | E-posta adresi      |
| `given_name`      | Hayır   | String         | İsim                |
| `family_name`     | Hayır   | String         | Soyisim             |
| `avatar_url`      | Hayır   | String (URL)   | Avatar resim bağlantısı |

> Örnek İstek:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## Takma Ad Kişileri (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Diğer API uç noktalarının aksine, bunlar [Kimlik Doğrulama](#authentication) "kullanıcı adı" olarak takma ad kullanıcı adı ve "şifre" olarak takma ad tarafından oluşturulan şifre ile Basic Authorization başlıkları gerektirir.
> \[!WARNING]
> Bu uç nokta bölümü üzerinde çalışmalar devam etmektedir ve (umarız) 2024 yılında yayınlanacaktır. Bu süre zarfında lütfen web sitemizin navigasyonundaki "Apps" açılır menüsünden bir IMAP istemcisi kullanın.

### Kişileri listele {#list-contacts}

> `GET /v1/contacts`

**Yakında geliyor**

### Kişi oluştur {#create-contact}

> `POST /v1/contacts`

**Yakında geliyor**

### Kişiyi getir {#retrieve-contact}

> `GET /v1/contacts/:id`

**Yakında geliyor**

### Kişiyi güncelle {#update-contact}

> `PUT /v1/contacts/:id`

**Yakında geliyor**

### Kişiyi sil {#delete-contact}

> `DELETE /v1/contacts/:id`

**Yakında geliyor**


## Alias Takvimleri (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> Diğer API uç noktalarının aksine, bunlar [Authentication](#authentication) "kullanıcı adı" olarak alias kullanıcı adı ve "şifre" olarak alias tarafından oluşturulan şifreyi Basic Authorization başlıklarında gerektirir.

> \[!WARNING]
> Bu uç nokta bölümü üzerinde çalışmalar devam etmektedir ve (umarız) 2024 yılında yayınlanacaktır. Bu süre zarfında lütfen web sitemizin navigasyonundaki "Apps" açılır menüsünden bir IMAP istemcisi kullanın.

### Takvimleri listele {#list-calendars}

> `GET /v1/calendars`

**Yakında geliyor**

### Takvim oluştur {#create-calendar}

> `POST /v1/calendars`

**Yakında geliyor**

### Takvimi getir {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Yakında geliyor**

### Takvimi güncelle {#update-calendar}

> `PUT /v1/calendars/:id`

**Yakında geliyor**

### Takvimi sil {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Yakında geliyor**


## Alias Mesajları (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> Diğer API uç noktalarının aksine, bunlar [Authentication](#authentication) "kullanıcı adı" olarak alias kullanıcı adı ve "şifre" olarak alias tarafından oluşturulan şifreyi Basic Authorization başlıklarında gerektirir.

> \[!WARNING]
> Bu uç nokta bölümü üzerinde çalışmalar devam etmektedir ve (umarız) 2024 yılında yayınlanacaktır. Bu süre zarfında lütfen web sitemizin navigasyonundaki "Apps" açılır menüsünden bir IMAP istemcisi kullanın.

Lütfen alan adınız için kurulum talimatlarını takip ettiğinizden emin olun.

Bu talimatlar SSS bölümümüzde [IMAP ile e-posta almayı destekliyor musunuz?](/faq#do-you-support-receiving-email-with-imap) başlığı altında bulunabilir.

### Mesajları listele ve ara {#list-and-search-for-messages}

> `GET /v1/messages`

**Yakında geliyor**

### Mesaj oluştur {#create-message}

> \[!NOTE]
> Bu işlem bir e-posta göndermeyecektir – sadece mesajı posta kutusu klasörünüze ekleyecektir (örneğin, bu IMAP `APPEND` komutuna benzer). Eğer e-posta göndermek istiyorsanız, aşağıdaki [Giden SMTP e-postası oluştur](#create-outbound-smtp-email) bölümüne bakınız. Giden SMTP e-postasını oluşturduktan sonra, depolama amaçlı olarak bir kopyasını bu uç nokta ile alias posta kutunuza ekleyebilirsiniz.

> `POST /v1/messages`

**Yakında geliyor**

### Mesajı getir {#retrieve-message}

> `GET /v1/messages/:id`

**Yakında geliyor**

### Mesajı güncelle {#update-message}

> `PUT /v1/messages/:id`

**Yakında geliyor**

### Mesajı sil {#delete-message}

> `DELETE /v1/messages:id`

**Yakında geliyor**


## Alias Klasörleri (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Klasör uç noktaları, klasörün yolu <code>/v1/folders/:path</code> olarak veya klasörün ID'si <code>:id</code> olarak kullanılabilir. Bu, klasöre <code>path</code> veya <code>id</code> değeri ile başvurabileceğiniz anlamına gelir.

> \[!WARNING]
> Bu uç nokta bölümü üzerinde çalışmalar devam etmektedir ve (umarız) 2024 yılında yayınlanacaktır. Bu süre zarfında lütfen web sitemizin navigasyonundaki "Apps" açılır menüsünden bir IMAP istemcisi kullanın.

### Klasörleri listele {#list-folders}

> `GET /v1/folders`

**Yakında geliyor**

### Klasör oluştur {#create-folder}

> `POST /v1/folders`

**Yakında geliyor**

### Klasörü getir {#retrieve-folder}

> `GET /v1/folders/:id`

**Yakında geliyor**

### Klasörü güncelle {#update-folder}

> `PUT /v1/folders/:id`

**Yakında geliyor**

### Klasörü sil {#delete-folder}

> `DELETE /v1/folders/:id`

**Yakında geliyor**

### Klasörü kopyala {#copy-folder}

> `POST /v1/folders/:id/copy`

**Yakında geliyor**


## Giden E-postalar {#outbound-emails}

Lütfen alan adınız için kurulum talimatlarını takip ettiğinizden emin olun.

Bu talimatlar [Hesabım → Alan Adları → Ayarlar → Giden SMTP Yapılandırması](/my-account/domains) bölümünde bulunabilir. Giden SMTP ile alan adınızdan e-posta göndermek için DKIM, Return-Path ve DMARC yapılandırmalarını sağlamanız gerekmektedir.
### Giden SMTP e-posta limiti al {#get-outbound-smtp-email-limit}

Bu, günlük SMTP giden mesaj sayısı için hesap bazında `count` ve `limit` içeren bir JSON nesnesi döndüren basit bir uç noktadır.

> `GET /v1/emails/limit`

> Örnek İstek:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Giden SMTP e-postalarını listele {#list-outbound-smtp-emails}

Bu uç noktanın bir e-postanın `message`, `headers` veya `rejectedErrors` özellik değerlerini döndürmediğine dikkat edin.

Bu özellikleri ve değerlerini döndürmek için lütfen bir e-posta ID'si ile [E-postayı al](#retrieve-email) uç noktasını kullanın.

> `GET /v1/emails`

| Sorgu Parametresi    | Zorunlu | Tür                       | Açıklama                                                                                                                                          |
| -------------------- | ------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                  | Hayır   | String (RegExp destekli)  | Meta veriye göre e-postaları arar                                                                                                               |
| `domain`             | Hayır   | String (RegExp destekli)  | Alan adına göre e-postaları arar                                                                                                                |
| `sort`               | Hayır   | String                    | Belirli bir alana göre sıralar (ters yönde sıralamak için alanın başına tek tire `-` ekleyin). Ayarlanmazsa varsayılan `created_at`'dir.         |
| `page`               | Hayır   | Number                    | Daha fazla bilgi için [Sayfalama](#pagination) bölümüne bakınız                                                                                   |
| `limit`              | Hayır   | Number                    | Daha fazla bilgi için [Sayfalama](#pagination) bölümüne bakınız                                                                                   |

> Örnek İstek:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Giden SMTP e-postası oluştur {#create-outbound-smtp-email}

E-posta oluşturma API'miz Nodemailer'ın mesaj seçenek yapılandırmasından esinlenmiş ve onu kullanmaktadır. Aşağıdaki tüm gövde parametreleri için lütfen [Nodemailer mesaj yapılandırması](https://nodemailer.com/message/) bölümüne bakınız.

`envelope` ve `dkim` dışında (bunları sizin için otomatik ayarladığımız için) tüm Nodemailer seçeneklerini desteklediğimizi unutmayın. Güvenlik amacıyla `disableFileAccess` ve `disableUrlAccess` seçeneklerini otomatik olarak `true` olarak ayarlıyoruz.

Ya başlıklar dahil tam ham e-postanızı içeren tek bir `raw` seçeneğini geçmelisiniz **veya** aşağıdaki bireysel gövde parametre seçeneklerini kullanmalısınız.

Bu API uç noktası, başlıklarda emoji bulunursa bunları otomatik olarak kodlar (örneğin `Subject: 🤓 Hello` konusu otomatik olarak `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello` olarak dönüştürülür). Amacımız son derece geliştirici dostu ve hata yapmaya karşı dayanıklı bir e-posta API'si sağlamaktı.

**Kimlik Doğrulama:** Bu uç nokta hem [API token kimlik doğrulamasını](#api-token-authentication-recommended-for-most-endpoints) hem de [takma ad kimlik bilgileri kimlik doğrulamasını](#alias-credentials-authentication-for-outbound-email) destekler. Detaylar için yukarıdaki [Kimlik Doğrulama](#authentication) bölümüne bakınız.

> `POST /v1/emails`

| Gövde Parametresi | Zorunlu | Tür              | Açıklama                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`            | Hayır   | String (E-posta) | Gönderenin e-posta adresi (alanın bir takma adı olarak mevcut olmalıdır).                                                                                                                                                                                                                                                                                                                                                                                      |
| `to`              | Hayır   | String veya Dizi  | "To" başlığı için virgülle ayrılmış liste veya alıcıların dizisi.                                                                                                                                                                                                                                                                                                                                                                                              |
| `cc`              | Hayır   | String veya Dizi  | "Cc" başlığı için virgülle ayrılmış liste veya alıcıların dizisi.                                                                                                                                                                                                                                                                                                                                                                                              |
| `bcc`             | Hayır   | String veya Dizi  | "Bcc" başlığı için virgülle ayrılmış liste veya alıcıların dizisi.                                                                                                                                                                                                                                                                                                                                                                                             |
| `subject`         | Hayır   | String           | E-postanın konusu.                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `text`            | Hayır   | String veya Buffer | Mesajın düz metin versiyonu.                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `html`            | Hayır   | String veya Buffer | Mesajın HTML versiyonu.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `attachments`     | Hayır   | Dizi             | Eklenti nesnelerinden oluşan dizi (bakınız [Nodemailer'ın ortak alanları](https://nodemailer.com/message/#common-fields)).                                                                                                                                                                                                                                                                                                                                      |
| `sender`          | Hayır   | String           | "Sender" başlığı için e-posta adresi (bakınız [Nodemailer'ın daha gelişmiş alanları](https://nodemailer.com/message/#more-advanced-fields)).                                                                                                                                                                                                                                                                                                                 |
| `replyTo`         | Hayır   | String           | "Reply-To" başlığı için e-posta adresi.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `inReplyTo`       | Hayır   | String           | Mesajın yanıtlandığı Message-ID.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `references`      | Hayır   | String veya Dizi  | Boşlukla ayrılmış liste veya Message-ID'lerden oluşan dizi.                                                                                                                                                                                                                                                                                                                                                                                                     |
| `attachDataUrls`  | Hayır   | Boolean          | `true` ise mesajın HTML içeriğindeki `data:` resimlerini gömülü eklentilere dönüştürür.                                                                                                                                                                                                                                                                                                                                                                         |
| `watchHtml`       | Hayır   | String           | Apple Watch'a özel HTML versiyonu ([Nodemailer dokümanlarına göre](https://nodemailer.com/message/#content-options)), en yeni saatlerde ayarlanması gerekmez.                                                                                                                                                                                                                                                                                                   |
| `amp`             | Hayır   | String           | AMP4EMAIL'e özel HTML versiyonu (bakınız [Nodemailer örneği](https://nodemailer.com/message/#amp-example)).                                                                                                                                                                                                                                                                                                                                                      |
| `icalEvent`       | Hayır   | Nesne            | Alternatif mesaj içeriği olarak kullanılacak iCalendar etkinliği (bakınız [Nodemailer'ın takvim etkinlikleri](https://nodemailer.com/message/calendar-events/)).                                                                                                                                                                                                                                                                                                |
| `alternatives`    | Hayır   | Dizi             | Alternatif mesaj içeriği dizisi (bakınız [Nodemailer'ın alternatif içerik](https://nodemailer.com/message/alternatives/)).                                                                                                                                                                                                                                                                                                                                       |
| `encoding`        | Hayır   | String           | Metin ve HTML dizeleri için kodlama (varsayılan `"utf-8"` olup `"hex"` ve `"base64"` kodlamalarını da destekler).                                                                                                                                                                                                                                                                                                                                              |
| `raw`             | Hayır   | String veya Buffer | Nodemailer tarafından oluşturulan yerine kullanılacak özel oluşturulmuş RFC822 formatlı mesaj (bakınız [Nodemailer'ın özel kaynağı](https://nodemailer.com/message/custom-source/)).                                                                                                                                                                                                                                                                             |
| `textEncoding`    | Hayır   | String           | Metin değerleri için zorunlu kodlama (ya `"quoted-printable"` ya da `"base64"`). Varsayılan değer algılanan en yakın değerdir (ASCII için `"quoted-printable"` kullanılır).                                                                                                                                                                                                                                                                                   |
| `priority`        | Hayır   | String           | E-postanın öncelik seviyesi (ya `"high"`, `"normal"` (varsayılan) ya da `"low"` olabilir). `"normal"` değeri öncelik başlığı ayarlamaz (varsayılan davranış budur). `"high"` veya `"low"` ayarlanırsa, `X-Priority`, `X-MSMail-Priority` ve `Importance` başlıkları [uygun şekilde ayarlanır](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers`         | Hayır   | Nesne veya Dizi   | Ek başlık alanları ayarlamak için Nesne veya Dizi (bakınız [Nodemailer'ın özel başlıkları](https://nodemailer.com/message/custom-headers/)).                                                                                                                                                                                                                                                                                                                  |
| `messageId`       | Hayır   | String           | "Message-ID" başlığı için isteğe bağlı Message-ID değeri (ayarlanmazsa otomatik varsayılan oluşturulur – değerin [RFC2822 spesifikasyonuna uygun olması gerekir](https://stackoverflow.com/a/4031705)).                                                                                                                                                                                                                                                        |
| `date`            | Hayır   | String veya Tarih | Tarih başlığı eksikse kullanılacak isteğe bağlı Tarih değeri, ayarlanmazsa geçerli UTC zamanı kullanılır. Tarih başlığı mevcut zamandan 30 günden fazla ileri olamaz.                                                                                                                                                                                                                                                                                          |
| `list`            | Hayır   | Nesne            | İsteğe bağlı `List-*` başlıkları nesnesi (bakınız [Nodemailer'ın liste başlıkları](https://nodemailer.com/message/list-headers/)).                                                                                                                                                                                                                                                                                                                               |
> Örnek İstek (API Token):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Örnek İstek (Alias Kimlik Bilgileri):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Örnek İstek (Ham E-posta):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Giden SMTP e-postasını al {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Örnek İstek:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Giden SMTP e-postasını sil {#delete-outbound-smtp-email}

E-posta silme işlemi, mevcut durum yalnızca `"pending"`, `"queued"` veya `"deferred"` ise durumu `"rejected"` olarak ayarlayacak (ve böylece kuyruğa işlemeyecektir).  E-postalar oluşturulduktan ve/veya gönderildikten sonra 30 gün içinde otomatik olarak temizlenebilir – bu nedenle giden SMTP e-postalarının bir kopyasını istemcinizde, veritabanınızda veya uygulamanızda saklamalısınız.  İsterseniz veritabanınızda e-posta ID değerimize referans verebilirsiniz – bu değer hem [E-posta oluştur](#create-email) hem de [E-postayı al](#retrieve-email) uç noktalarından döndürülür.

> `DELETE /v1/emails/:id`

> Örnek İstek:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## Alan Adları {#domains}

> \[!TIP]
> Bir alan adının adı ile erişilen alan adı uç noktaları <code>/v1/domains/:domain_name</code>, alan adının ID'si <code>:domain_id</code> ile erişilen uç noktalarla değiştirilebilir. Bu, alan adına ya <code>name</code> ya da <code>id</code> değeri ile başvurabileceğiniz anlamına gelir.

### Alan adlarını listele {#list-domains}

> \[!NOTE]
> 1 Kasım 2024 itibarıyla [Alan adlarını listele](#list-domains) ve [Alan adı takma adlarını listele](#list-domain-aliases) API uç noktaları sayfa başına varsayılan olarak `1000` maksimum sonuç döndürecektir.  Bu davranışı erken kullanmak isterseniz, uç nokta sorgusunun URL'sine ek bir sorgu parametresi olarak `?paginate=true` geçebilirsiniz. Daha fazla bilgi için [Sayfalandırma](#pagination) bölümüne bakınız.

> `GET /v1/domains`

| Sorgu Parametresi      | Zorunlu | Tür                       | Açıklama                                                                                                                                          |
| --------------------- | ------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | Hayır   | String (RegExp destekli)  | Alan adlarını ada göre arayın                                                                                                                    |
| `name`                | Hayır   | String (RegExp destekli)  | Alan adlarını ada göre arayın                                                                                                                    |
| `sort`                | Hayır   | String                    | Belirli bir alana göre sıralayın (ters yönde sıralamak için alanın önüne tek tire `-` koyun). Ayarlanmazsa varsayılan `created_at`'dır.           |
| `page`                | Hayır   | Number                    | Daha fazla bilgi için [Sayfalandırma](#pagination) bölümüne bakınız                                                                              |
| `limit`               | Hayır   | Number                    | Daha fazla bilgi için [Sayfalandırma](#pagination) bölümüne bakınız                                                                              |

> Örnek İstek:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Alan adı oluştur {#create-domain}

> `POST /v1/domains`

| Gövde Parametresi               | Zorunlu | Tür                                            | Açıklama                                                                                                                                                                                                                                                                                                            |
| ------------------------------ | ------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `domain`                       | Evet    | String (FQDN veya IP)                          | Tam nitelikli alan adı ("FQDN") veya IP adresi                                                                                                                                                                                                                                                                     |
| `team_domain`                  | Hayır   | String (alan adı ID'si veya alan adı; FQDN)   | Bu alan adını başka bir alan adından aynı takıma otomatik olarak atar. Bu, bu alan adındaki tüm üyelerin takım üyesi olarak atanacağı ve `plan`'ın otomatik olarak `team` olarak ayarlanacağı anlamına gelir. Gerekirse bunu `"none"` olarak ayarlayarak açıkça devre dışı bırakabilirsiniz, ancak bu gerekli değildir. |
| `plan`                         | Hayır   | String (enumerable)                            | Plan türü (zorunlu olarak `"free"`, `"enhanced_protection"` veya `"team"` olmalıdır, varsayılan `"free"` veya kullanıcının mevcut ücretli planı)                                                                                                                                                                    |
| `catchall`                     | Hayır   | String (ayırıcı ile ayrılmış e-posta adresleri) veya Boolean | Varsayılan catch-all takma adı oluşturur, varsayılan `true` (eğer `true` ise API kullanıcısının e-posta adresini alıcı olarak kullanır, `false` ise catch-all oluşturulmaz). String verilirse, alıcı olarak kullanılacak e-posta adreslerinin ayırıcı ile ayrılmış listesi olur (satır sonu, boşluk ve/veya virgül ile ayrılmış) |
| `has_adult_content_protection` | Hayır   | Boolean                                        | Bu alan adı için Spam Tarayıcı yetişkin içerik korumasını etkinleştirip etkinleştirmeme                                                                                                                                                                                                                              |
| `has_phishing_protection`      | Hayır   | Boolean                                        | Bu alan adı için Spam Tarayıcı oltalama korumasını etkinleştirip etkinleştirmeme                                                                                                                                                                                                                                     |
| `has_executable_protection`    | Hayır   | Boolean                                        | Bu alan adı için Spam Tarayıcı çalıştırılabilir dosya korumasını etkinleştirip etkinleştirmeme                                                                                                                                                                                                                        |
| `has_virus_protection`         | Hayır   | Boolean                                        | Bu alan adı için Spam Tarayıcı virüs korumasını etkinleştirip etkinleştirmeme                                                                                                                                                                                                                                         |
| `has_recipient_verification`   | Hayır   | Boolean                                        | E-posta akışının devamı için takma ad alıcılarının e-posta doğrulama bağlantısını tıklamasını gerektirip gerektirmeme konusunda global alan adı varsayılanı                                                                                                                                                         |
| `ignore_mx_check`              | Hayır   | Boolean                                        | Alan adının doğrulaması için MX kaydı kontrolünü yoksayma. Bu, gelişmiş MX değişim yapılandırma kuralları olan ve mevcut MX değişimini koruyup bizimkine yönlendirmek isteyen kullanıcılar içindir.                                                                                                                    |
| `retention_days`               | Hayır   | Number                                         | Başarıyla teslim edilen veya kalıcı olarak hata alan giden SMTP e-postalarını saklamak için `0` ile `30` arasında tam sayı. Varsayılan `0` olup, bu durumda giden SMTP e-postaları güvenliğiniz için hemen temizlenir ve sansürlenir.                                                                             |
| `bounce_webhook`               | Hayır   | String (URL) veya Boolean (false)              | Geri dönen e-postalar için webhook gönderilecek tercihinize bağlı `http://` veya `https://` URL'si. Giden SMTP hataları (örneğin yumuşak veya sert hatalar) hakkında bilgi içeren `POST` isteği bu URL'ye gönderilecektir – böylece abonelerinizi yönetebilir ve giden e-postalarınızı programlı olarak yönetebilirsiniz. |
| `max_quota_per_alias`          | Hayır   | String                                         | Bu alan adı üzerindeki takma adlar için maksimum depolama kotası. [bytes](https://github.com/visionmedia/bytes.js) tarafından ayrıştırılacak "1 GB" gibi bir değer girin.                                                                                                                                           |
> Örnek İstek:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Alan adını al {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Örnek İstek:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Alan adı kayıtlarını doğrula {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Örnek İstek:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Alan adı SMTP kayıtlarını doğrula {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Örnek İstek:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Alan genelindeki catch-all şifrelerini listele {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Örnek İstek:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Alan genelinde catch-all şifresi oluştur {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Body Parametresi | Zorunlu | Tür    | Açıklama                                                                                                                                                                                                                   |
| ---------------- | ------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`   | Hayır   | String | Alan genelindeki catch-all şifresi için kullanmak istediğiniz özel yeni şifre.  API isteğinizin gövdesinde bunu boş bırakabilir veya tamamen eksik bırakabilirsiniz; bu durumda rastgele oluşturulmuş güçlü bir şifre verilir.  Özel posta kutusu şifreleri 128 karakter veya daha az olmalı, boşlukla başlayıp bitmemeli ve tırnak işareti veya apostrof içermemelidir. Catch-all şifreleri yalnızca SMTP gönderimi içindir. IMAP, POP3, CalDAV, CardDAV ve posta kutusu erişimi için belirli takma ad için şifre oluşturun. |
| `description`    | Hayır   | String | Sadece organizasyon amaçlı açıklama.                                                                                                                                                                                      |

> Örnek İstek:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Alan genelindeki catch-all şifresini kaldır {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Örnek İstek:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Alan adını güncelle {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Body Parametresi               | Zorunlu | Tür                            | Açıklama                                                                                                                                                                                                                                                                                     |
| ----------------------------- | ------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port`                   | Hayır   | String veya Number             | SMTP yönlendirme için yapılandırılacak özel port (varsayılan `"25"`)                                                                                                                                                                                                                         |
| `has_adult_content_protection`| Hayır   | Boolean                       | Bu alan adı için Spam Tarayıcı yetişkin içerik korumasını etkinleştirip etkinleştirmemek                                                                                                                                                                                                     |
| `has_phishing_protection`     | Hayır   | Boolean                       | Bu alan adı için Spam Tarayıcı oltalama korumasını etkinleştirip etkinleştirmemek                                                                                                                                                                                                             |
| `has_executable_protection`   | Hayır   | Boolean                       | Bu alan adı için Spam Tarayıcı çalıştırılabilir dosya korumasını etkinleştirip etkinleştirmemek                                                                                                                                                                                             |
| `has_virus_protection`        | Hayır   | Boolean                       | Bu alan adı için Spam Tarayıcı virüs korumasını etkinleştirip etkinleştirmemek                                                                                                                                                                                                               |
| `has_recipient_verification`  | Hayır   | Boolean                       | E-posta akışı için takma ad alıcılarının bir e-posta doğrulama bağlantısını tıklamasını gerektirip gerektirmemek konusunda alan adı genelinde varsayılan                                                                                                                                     |
| `ignore_mx_check`             | Hayır   | Boolean                       | Alan adı doğrulaması için MX kaydı kontrolünü yoksaymak.  Bu, gelişmiş MX değişim yapılandırma kuralları olan ve mevcut MX değişimini koruyup bizimkine yönlendirmek isteyen kullanıcılar içindir.                                                                                              |
| `retention_days`              | Hayır   | Number                        | Başarıyla teslim edilen veya kalıcı olarak hata alınan giden SMTP e-postalarını saklamak için `0` ile `30` arasında bir tam sayı.  Varsayılan `0` olup, bu durumda giden SMTP e-postaları güvenliğiniz için hemen silinir ve sansürlenir.                                                  |
| `bounce_webhook`              | Hayır   | String (URL) veya Boolean (false) | Giden SMTP hataları (örneğin yumuşak veya sert hatalar – böylece abonelerinizi yönetebilir ve giden e-postalarınızı programlı olarak yönetebilirsiniz) hakkında bilgi içeren POST isteği göndereceğimiz, seçtiğiniz `http://` veya `https://` webhook URL'si.                                  |
| `max_quota_per_alias`         | Hayır   | String                        | Bu alan adı altındaki takma adlar için maksimum depolama kotası.  [bytes](https://github.com/visionmedia/bytes.js) tarafından ayrıştırılacak "1 GB" gibi bir değer girin.                                                                                                                    |
> Örnek İstek:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Alan adını sil {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Örnek İstek:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## Davetler {#invites}

### Alan adı davetini kabul et {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Örnek İstek:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Alan adı daveti oluştur {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Gövde Parametresi | Zorunlu | Tür                 | Açıklama                                                                                  |
| ----------------- | ------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email`           | Evet    | String (Email)      | Alan adı üyeler listesine davet etmek için e-posta adresi                                |
| `group`           | Evet    | String (enumerable) | Kullanıcıyı alan adı üyeliğine eklemek için grup ( `"admin"` veya `"user"` olabilir)      |

> Örnek İstek:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Davet edilen kullanıcı, davet eden yöneticinin üye olduğu diğer herhangi bir alan adının zaten kabul edilmiş bir üyesiyse, davet otomatik olarak kabul edilir ve e-posta gönderilmez.

### Alan adı davetini kaldır {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Gövde Parametresi | Zorunlu | Tür           | Açıklama                                         |
| ----------------- | ------- | ------------- | ------------------------------------------------ |
| `email`           | Evet    | String (Email) | Alan adı üyeler listesinden kaldırılacak e-posta adresi |

> Örnek İstek:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## Üyeler {#members}

### Alan adı üyesini güncelle {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Gövde Parametresi | Zorunlu | Tür                 | Açıklama                                                                                  |
| ----------------- | ------- | ------------------- | ------------------------------------------------------------------------------------------ |
| `group`           | Evet    | String (enumerable) | Kullanıcıyı alan adı üyeliğinde güncellemek için grup ( `"admin"` veya `"user"` olabilir)  |

> Örnek İstek:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Alan adı üyesini kaldır {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Örnek İstek:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## Takma adlar {#aliases}

### Takma ad parolası oluştur {#generate-an-alias-password}

Eğer talimatları e-posta ile göndermezseniz, kullanıcı adı ve parola başarılı bir isteğin JSON yanıt gövdesinde `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }` formatında olacaktır.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Gövde Parametresi       | Zorunlu | Tür     | Açıklama                                                                                                                                                                                                                                                                                         |
| ----------------------- | ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `new_password`          | Hayır   | String  | Takma ad için kullanmak istediğiniz özel yeni parola. Eğer rastgele oluşturulmuş ve güçlü bir parola almak isterseniz, bu alanı boş bırakabilir veya API istek gövdesinden tamamen çıkarabilirsiniz.                                                                                               Özel posta kutusu şifreleri 128 karakter veya daha az olmalı, boşlukla başlayıp bitmemeli ve tırnak işareti veya apostrof içermemelidir. |
| `password`              | Hayır   | String  | Mevcut parolayı kullanarak takma adın parolasını değiştirmek için (mevcut IMAP posta kutusu depolamasını silmeden). (Mevcut parolaya artık erişiminiz yoksa aşağıdaki `is_override` seçeneğine bakınız.)                                                                                           |
| `is_override`           | Hayır   | Boolean | **DİKKATLİ KULLANIN**: Bu, mevcut takma ad parolasını ve veritabanını tamamen geçersiz kılar, mevcut IMAP depolamasını kalıcı olarak siler ve takma adın SQLite e-posta veritabanını tamamen sıfırlar. Eğer bu takma ada bağlı mevcut bir posta kutunuz varsa, mümkünse yedek alın.              |
| `emailed_instructions`  | Hayır   | String  | Takma adın parolası ve kurulum talimatlarının gönderileceği e-posta adresi.                                                                                                                                                                                                                      |
> Örnek İstek:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Alan adı takma adlarını listele {#list-domain-aliases}

> \[!NOTE]
> 1 Kasım 2024 itibarıyla [Alan adlarını listele](#list-domains) ve [Alan adı takma adlarını listele](#list-domain-aliases) API uç noktaları sayfa başına varsayılan olarak `1000` maksimum sonuç döndürecektir. Bu davranışı erken tercih etmek isterseniz, uç nokta sorgusunun URL'sine ek bir sorgu parametresi olarak `?paginate=true` gönderebilirsiniz. Daha fazla bilgi için [Sayfalandırma](#pagination) bölümüne bakınız.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Sorgu Parametresi      | Zorunlu | Tür                        | Açıklama                                                                                                                                          |
| --------------------- | ------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | Hayır   | String (RegExp destekli)   | Bir alan adındaki takma adları isim, etiket veya alıcıya göre arayın                                                                                 |
| `name`                | Hayır   | String (RegExp destekli)   | Bir alan adındaki takma adları isme göre arayın                                                                                                   |
| `recipient`           | Hayır   | String (RegExp destekli)   | Bir alan adındaki takma adları alıcıya göre arayın                                                                                                |
| `sort`                | Hayır   | String                     | Belirli bir alana göre sıralayın (ters sıralama için alanın önüne tek tire `-` koyun). Ayarlanmazsa varsayılan `created_at` olur.                  |
| `page`                | Hayır   | Number                     | Daha fazla bilgi için [Sayfalandırma](#pagination) bölümüne bakınız                                                                                |
| `limit`               | Hayır   | Number                     | Daha fazla bilgi için [Sayfalandırma](#pagination) bölümüne bakınız                                                                                |

> Örnek İstek:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Yeni alan adı takma adı oluştur {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Gövde Parametresi               | Zorunlu | Tür                                    | Açıklama                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------ | ------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                         | Hayır   | String                                | Takma ad ismi (verilmezse veya boş bırakılırsa, rastgele bir takma ad oluşturulur)                                                                                                                                                                                                                                                                                                        |
| `recipients`                   | Hayır   | String veya Dizi                      | Alıcı listesi (geçerli e-posta adresleri, tam nitelikli alan adları ("FQDN"), IP adresleri ve/veya webhook URL'leri içeren, satır sonu/boşluk/virgül ile ayrılmış String veya Dizi olmalıdır – verilmezse veya boş Dizi ise, API isteğini yapan kullanıcının e-postası alıcı olarak atanır)                                                                                                     |
| `description`                  | Hayır   | String                                | Takma ad açıklaması                                                                                                                                                                                                                                                                                                                                                                       |
| `labels`                      | Hayır   | String veya Dizi                      | Etiket listesi (satır sonu/boşluk/virgül ile ayrılmış String veya Dizi olmalıdır)                                                                                                                                                                                                                                                                                                           |
| `has_recipient_verification`   | Hayır   | Boolean                               | Alıcıların e-postaların iletilmesi için e-posta doğrulama bağlantısına tıklamasını zorunlu kılar (istek gövdesinde açıkça ayarlanmazsa alan adının ayarını kullanır)                                                                                                                                                                                                                      |
| `is_enabled`                   | Hayır   | Boolean                               | Bu takma adın etkinleştirilip etkinleştirilmeyeceği (devre dışı bırakılırsa, e-postalar hiçbir yere yönlendirilmez ancak başarılı durum kodları döner). Bir değer verilirse, [boolean](https://github.com/thenativeweb/boolean#quick-start) kullanılarak boolean'a dönüştürülür.                                                                                                            |
| `error_code_if_disabled`       | Hayır   | Number (`250`, `421` veya `550`)      | `is_enabled` `false` ise gelen e-posta bu takma ad için reddedilir; `250` (sessizce hiçbir yere teslim etmez, örn. kara delik veya `/dev/null`), `421` (geçici reddetme; yaklaşık 5 gün boyunca yeniden denenecek) veya `550` (kalıcı hata ve reddetme) kodlarından biri ile. Varsayılan `250`'dir.                                                                                          |
| `has_imap`                    | Hayır   | Boolean                               | Bu takma ad için IMAP depolamasının etkinleştirilip etkinleştirilmeyeceği (devre dışı bırakılırsa, alınan e-postalar [IMAP depolamasına](/blog/docs/best-quantum-safe-encrypted-email-service) kaydedilmez). Bir değer verilirse, [boolean](https://github.com/thenativeweb/boolean#quick-start) kullanılarak boolean'a dönüştürülür.                                                        |
| `has_pgp`                     | Hayır   | Boolean                               | Takma adın `public_key` kullanarak [IMAP/POP3/CalDAV/CardDAV şifreli e-posta depolaması](/blog/docs/best-quantum-safe-encrypted-email-service) için [OpenPGP şifrelemesini](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) etkinleştirip etkinleştirmeyeceği.                                                                                     |
| `public_key`                  | Hayır   | String                                | ASCII Armor formatında OpenPGP açık anahtarı ([örnek görmek için tıklayın](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); örn. `support@forwardemail.net` için GPG anahtarı). Bu yalnızca `has_pgp` `true` olarak ayarlanmışsa geçerlidir. [Uçtan uca şifreleme hakkında daha fazla bilgi için SSS'ye bakınız](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                   | Hayır   | String                                | Bu takma ad için maksimum depolama kotası. Boş bırakılırsa alan adının mevcut maksimum kotasına sıfırlanır veya [bytes](https://github.com/visionmedia/bytes.js) tarafından ayrıştırılacak "1 GB" gibi bir değer girilebilir. Bu değer yalnızca alan adı yöneticileri tarafından ayarlanabilir.                                                                                              |
| `vacation_responder_is_enabled` | Hayır   | Boolean                               | Otomatik tatil yanıtlayıcısının etkinleştirilip etkinleştirilmeyeceği.                                                                                                                                                                                                                                                                                                                     |
| `vacation_responder_start_date` | Hayır   | String                                | Tatil yanıtlayıcısının başlangıç tarihi (etkinleştirilmiş ve burada başlangıç tarihi ayarlanmamışsa, zaten başlamış kabul edilir). `MM/DD/YYYY`, `YYYY-MM-DD` ve `dayjs` kullanılarak akıllı ayrıştırma ile diğer tarih formatları desteklenir.                                                                                                                                           |
| `vacation_responder_end_date`   | Hayır   | String                                | Tatil yanıtlayıcısının bitiş tarihi (etkinleştirilmiş ve burada bitiş tarihi ayarlanmamışsa, sonsuza kadar yanıt verir). `MM/DD/YYYY`, `YYYY-MM-DD` ve `dayjs` kullanılarak akıllı ayrıştırma ile diğer tarih formatları desteklenir.                                                                                                                                                      |
| `vacation_responder_subject`    | Hayır   | String                                | Tatil yanıtlayıcısı için düz metin konu, örn. "Ofiste Değilim". Burada tüm HTML'yi kaldırmak için `striptags` kullanılır.                                                                                                                                                                                                                                                                   |
| `vacation_responder_message`    | Hayır   | String                                | Tatil yanıtlayıcısı için düz metin mesaj, örn. "Şubata kadar ofiste olmayacağım.". Burada tüm HTML'yi kaldırmak için `striptags` kullanılır.                                                                                                                                                                                                                                               |
> Örnek İstek:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Alan adı takma adını al {#retrieve-domain-alias}

Bir alan adı takma adını ya `id` ya da `name` değeri ile alabilirsiniz.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Örnek İstek:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Örnek İstek:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Alan adı takma adını güncelle {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Gövde Parametresi               | Zorunlu | Tür                                    | Açıklama                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | Hayır    | String                                 | Takma ad adı                                                                                                                                                                                                                                                                                                                                                                               |
| `recipients`                    | Hayır    | String veya Dizi                       | Alıcı listesi (geçerli e-posta adresleri, tam nitelikli alan adları ("FQDN"), IP adresleri ve/veya webhook URL'leri içeren, satır sonu/boşluk/virgül ile ayrılmış String veya Dizi olmalıdır)                                                                                                                                                                                               |
| `description`                   | Hayır    | String                                 | Takma ad açıklaması                                                                                                                                                                                                                                                                                                                                                                        |
| `labels`                        | Hayır    | String veya Dizi                       | Etiket listesi (satır sonu/boşluk/virgül ile ayrılmış String veya Dizi olmalıdır)                                                                                                                                                                                                                                                                                                          |
| `has_recipient_verification`    | Hayır    | Boolean                                | Alıcıların e-postaların iletilmesi için bir e-posta doğrulama bağlantısına tıklamasını gerektirir (istek gövdesinde açıkça belirtilmezse alan adının ayarına göre varsayılan olarak ayarlanır)                                                                                                                                                                                             |
| `is_enabled`                    | Hayır    | Boolean                                | Bu takma adın etkinleştirilip etkinleştirilmeyeceği (devre dışı bırakılırsa, e-postalar hiçbir yere yönlendirilmez ancak başarılı durum kodları döner). Bir değer gönderilirse, [boolean](https://github.com/thenativeweb/boolean#quick-start) kullanılarak boolean'a dönüştürülür)                                                                                                         |
| `error_code_if_disabled`        | Hayır    | Sayı (`250`, `421` veya `550`)         | Bu takma ad için `is_enabled` `false` ise gelen e-posta ya `250` (sessizce hiçbir yere teslim etmez, örn. kara delik veya `/dev/null`), `421` (geçici reddetme; yaklaşık 5 gün boyunca yeniden deneme) veya `550` kalıcı hata ve reddetme ile reddedilir. Varsayılan `250`'dir.                                                                                                           |
| `has_imap`                      | Hayır    | Boolean                                | Bu takma ad için IMAP depolamanın etkinleştirilip etkinleştirilmeyeceği (devre dışı bırakılırsa, alınan gelen e-postalar [IMAP depolamaya](/blog/docs/best-quantum-safe-encrypted-email-service) kaydedilmez). Bir değer gönderilirse, [boolean](https://github.com/thenativeweb/boolean#quick-start) kullanılarak boolean'a dönüştürülür)                                                        |
| `has_pgp`                       | Hayır    | Boolean                                | Takma adın `public_key` kullanarak [IMAP/POP3/CalDAV/CardDAV şifreli e-posta depolaması](/blog/docs/best-quantum-safe-encrypted-email-service) için [OpenPGP şifrelemesini](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) etkinleştirip etkinleştirmeyeceği                                                                                     |
| `public_key`                    | Hayır    | String                                 | ASCII Armor formatında OpenPGP açık anahtarı ([örnek görmek için tıklayın](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); örn. `support@forwardemail.net` için GPG anahtarı). Bu sadece `has_pgp` `true` olarak ayarlanmışsa geçerlidir. [Uçtan uca şifreleme hakkında daha fazla bilgi için SSS'ye bakın](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | Hayır    | String                                 | Bu takma ad için maksimum depolama kotası. Boş bırakılırsa alan adının mevcut maksimum kotasına sıfırlanır veya [bytes](https://github.com/visionmedia/bytes.js) tarafından ayrıştırılacak "1 GB" gibi bir değer girilebilir. Bu değer yalnızca alan adı yöneticileri tarafından ayarlanabilir.                                                                                             |
| `vacation_responder_is_enabled` | Hayır    | Boolean                                | Otomatik tatil yanıtlayıcısının etkinleştirilip etkinleştirilmeyeceği                                                                                                                                                                                                                                                                                                                     |
| `vacation_responder_start_date` | Hayır    | String                                 | Tatil yanıtlayıcısının başlangıç tarihi (etkinleştirilmiş ve burada başlangıç tarihi ayarlanmamışsa, zaten başlamış varsayılır). `MM/DD/YYYY`, `YYYY-MM-DD` ve `dayjs` kullanılarak akıllı ayrıştırma ile diğer tarih formatları desteklenir.                                                                                                                                              |
| `vacation_responder_end_date`   | Hayır    | String                                 | Tatil yanıtlayıcısının bitiş tarihi (etkinleştirilmiş ve burada bitiş tarihi ayarlanmamışsa, asla bitmez ve sonsuza kadar yanıt verir). `MM/DD/YYYY`, `YYYY-MM-DD` ve `dayjs` kullanılarak akıllı ayrıştırma ile diğer tarih formatları desteklenir.                                                                                                                                       |
| `vacation_responder_subject`    | Hayır    | String                                 | Tatil yanıtlayıcısı için düz metin konu, örn. "Ofiste Değilim". Burada tüm HTML'yi kaldırmak için `striptags` kullanılır.                                                                                                                                                                                                                                                                  |
| `vacation_responder_message`    | Hayır    | String                                 | Tatil yanıtlayıcısı için düz metin mesaj, örn. "Şubata kadar ofiste olmayacağım.". Burada tüm HTML'yi kaldırmak için `striptags` kullanılır.                                                                                                                                                                                                                                              |
> Örnek İstek:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Alan adı takma adını sil {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Örnek İstek:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```


## Şifrele {#encrypt}

Kayıtları ücretsiz planda bile ücretsiz olarak şifrelemenize izin veriyoruz. Gizlilik bir özellik olmamalı, ürünün tüm yönlerine doğrudan entegre edilmiş olmalıdır. [Privacy Guides tartışmasında](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) ve [GitHub sorunlarımızda](https://github.com/forwardemail/forwardemail.net/issues/254) yoğun talep üzerine bunu ekledik.

### TXT Kaydını Şifrele {#encrypt-txt-record}

> `POST /v1/encrypt`

| Body Parametresi | Zorunlu | Tür    | Açıklama                                    |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input`        | Evet     | String | Geçerli herhangi bir Forward Email düz metin TXT kaydı |

> Örnek İstek:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
