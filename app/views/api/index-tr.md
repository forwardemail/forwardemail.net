# E-posta API'si {#email-api}

## İçindekiler {#table-of-contents}

* [Kütüphaneler](#libraries)
* [Temel URI](#base-uri)
* [Kimlik doğrulama](#authentication)
* [Hatalar](#errors)
* [Yerelleştirme](#localization)
* [Sayfalandırma](#pagination)
* [Günlükler](#logs)
  * [Günlükleri al](#retrieve-logs)
* [Hesap](#account)
  * [Hesap oluşturmak](#create-account)
  * [Hesabı al](#retrieve-account)
  * [Hesabı güncelle](#update-account)
* [Takma Adlı Kişiler (CardDAV)](#alias-contacts-carddav)
  * [Kişileri listele](#list-contacts)
  * [İletişim oluştur](#create-contact)
  * [İletişim bilgilerini al](#retrieve-contact)
  * [İletişim bilgilerini güncelle](#update-contact)
  * [Kişiyi sil](#delete-contact)
* [Takma Adlı Takvimler (CalDAV)](#alias-calendars-caldav)
  * [Takvimleri listele](#list-calendars)
  * [Takvim oluştur](#create-calendar)
  * [Takvimi al](#retrieve-calendar)
  * [Takvimi güncelle](#update-calendar)
  * [Takvimi sil](#delete-calendar)
* [Takma Ad Mesajları (IMAP/POP3)](#alias-messages-imappop3)
  * [Mesajları listele ve ara](#list-and-search-for-messages)
  * [Mesaj oluştur](#create-message)
  * [Mesajı al](#retrieve-message)
  * [Güncelleme mesajı](#update-message)
  * [Mesajı sil](#delete-message)
* [Takma Ad Klasörleri (IMAP/POP3)](#alias-folders-imappop3)
  * [Klasörleri listele](#list-folders)
  * [Klasör oluştur](#create-folder)
  * [Klasörü al](#retrieve-folder)
  * [Güncelleme klasörü](#update-folder)
  * [Klasörü sil](#delete-folder)
  * [Klasörü kopyala](#copy-folder)
* [Giden E-postalar](#outbound-emails)
  * [Giden SMTP e-posta sınırını alın](#get-outbound-smtp-email-limit)
  * [Giden SMTP e-postalarını listeleyin](#list-outbound-smtp-emails)
  * [Giden SMTP e-postası oluşturun](#create-outbound-smtp-email)
  * [Giden SMTP e-postasını al](#retrieve-outbound-smtp-email)
  * [Giden SMTP e-postasını sil](#delete-outbound-smtp-email)
* [Alan Adları](#domains)
  * [Alan adlarını listele](#list-domains)
  * [Alan adı oluştur](#create-domain)
  * [Alan adını al](#retrieve-domain)
  * [Alan adı kayıtlarını doğrulayın](#verify-domain-records)
  * [Alan adı SMTP kayıtlarını doğrulayın](#verify-domain-smtp-records)
  * [Alan adı genelindeki tüm parolaları listele](#list-domain-wide-catch-all-passwords)
  * [Alan genelinde kapsayıcı parola oluşturun](#create-domain-wide-catch-all-password)
  * [Alan adı genelinde geçerli olan genel parolayı kaldırın](#remove-domain-wide-catch-all-password)
  * [Alan adını güncelle](#update-domain)
  * [Alan adını sil](#delete-domain)
* [Davetler](#invites)
  * [Alan adı davetini kabul et](#accept-domain-invite)
  * [Alan adı daveti oluştur](#create-domain-invite)
  * [Alan davetini kaldır](#remove-domain-invite)
* [Üyeler](#members)
  * [Etki alanı üyesini güncelle](#update-domain-member)
  * [Etki alanı üyesini kaldır](#remove-domain-member)
* [Takma adlar](#aliases)
  * [Bir takma ad parolası oluşturun](#generate-an-alias-password)
  * [Alan adı takma adlarını listeleyin](#list-domain-aliases)
  * [Yeni alan adı oluşturun](#create-new-domain-alias)
  * [Alan adı takma adını al](#retrieve-domain-alias)
  * [Alan adı takma adını güncelle](#update-domain-alias)
  * [Alan adı takma adını sil](#delete-domain-alias)
* [Şifrele](#encrypt)
  * [TXT Kaydını Şifrele](#encrypt-txt-record)

## Kütüphaneler {#libraries}

Şu anda herhangi bir API sarmalayıcısı yayınlamadık, ancak yakın gelecekte yayınlamayı planlıyoruz. Belirli bir programlama dilinin API sarmalayıcısı yayınlandığında bildirim almak isterseniz <api@forwardemail.net> adresine e-posta gönderin. Bu arada, uygulamanızda bu önerilen HTTP istek kitaplıklarını kullanabilir veya aşağıdaki örneklerde olduğu gibi [bukle](https://stackoverflow.com/a/27442239/3586413) kullanabilirsiniz.

| Dil | Kütüphane |
| ---------- | ---------------------------------------------------------------------- |
| Yakut | [Faraday](https://github.com/lostisland/faraday) |
| piton | [requests](https://github.com/psf/requests) |
| Cava | [OkHttp](https://github.com/square/okhttp/) |
| PHP | [guzzle](https://github.com/guzzle/guzzle) |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (biz bakımcıyız) |
| Node.js | [superagent](https://github.com/ladjs/superagent) (biz bakımcıyız) |
| Gitmek | [net/http](https://golang.org/pkg/net/http/) |
| .NET | [RestSharp](https://github.com/restsharp/RestSharp) |

## Temel URI {#base-uri}

Mevcut HTTP taban URI yolu: `BASE_URI`.

## Kimlik Doğrulaması {#authentication}

Tüm uç noktalar, isteğin [Temel Yetkilendirme](https://en.wikipedia.org/wiki/Basic_access_authentication) başlığının "kullanıcı adı" değeri olarak [API anahtarı](https://forwardemail.net/my-account/security) değerini ayarlamanızı gerektirir ([Takma Ad Kişileri](#alias-contacts), [Takma Adlı Takvimler](#alias-calendars) ve [Takma Adlı Posta Kutuları](#alias-mailboxes) hariç, bunlar [oluşturulan takma ad kullanıcı adı ve şifresi](/faq#do-you-support-receiving-email-with-imap) kullanır).

Endişelenmeyin, eğer bunun ne olduğunu bilmiyorsanız aşağıda sizin için örnekler verilmiştir.

## Hataları {#errors}

Herhangi bir hata oluşması durumunda API isteğinin yanıt gövdesi ayrıntılı bir hata mesajı içerecektir.

| Kod | İsim |
| ---- | --------------------- |
| 200 | OK |
| 400 | Geçersiz istek |
| 401 | Yetkisiz |
| 403 | Yasaklı |
| 404 | Bulunamadı |
| 429 | Çok Fazla İstek |
| 500 | İç Sunucu Hatası |
| 501 | Uygulanmadı |
| 502 | Kötü Ağ Geçidi |
| 503 | hizmet kullanılamıyor |
| 504 | Ağ Geçidi Zaman Aşımı |

> \[!TIP]
> If you receive a 5xx status code (which should not happen), then please contact us at <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> and we will help you to resolve your issue immediately.

## Yerelleştirme {#localization}

Hizmetimiz 25'ten fazla farklı dile çevrilmiştir. Tüm API yanıt mesajları, API isteğinde bulunan kullanıcının algıladığı son yerel ayara çevrilir. Özel bir `Accept-Language` başlığı göndererek bunu geçersiz kılabilirsiniz. Bu sayfanın alt kısmındaki dil açılır menüsünü kullanarak deneyebilirsiniz.

## Sayfalama {#pagination}

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.

Sayfalandırma, sonuçları listeleyen tüm API uç noktaları tarafından desteklenir.

Sadece sorgu dizesi özelliklerini `page` (ve isteğe bağlı olarak `limit`) sağlayın.

`page` özelliği, `1` değerinden büyük veya ona eşit bir sayı olmalıdır. `limit` (aynı zamanda bir sayı) sağlarsanız, minimum değer `10`, maksimum değer ise `50` olur (aksi belirtilmedikçe).

| Sorgu Dize Parametreleri | Gerekli | Tip | Tanım |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page` | HAYIR | Sayı | Döndürülecek sonuç sayfası. Belirtilmezse, `page` değeri `1` olacaktır. `1` değerinden büyük veya ona eşit bir sayı olmalıdır. |
| `limit` | HAYIR | Sayı | Sayfa başına döndürülecek sonuç sayısı. Belirtilmezse varsayılan olarak `10` kullanılır. `1` değerinden büyük veya ona eşit ve `50` değerinden küçük veya ona eşit bir sayı olmalıdır. |

Daha fazla sonucun mevcut olup olmadığını belirlemek için, şu HTTP yanıt başlıklarını sağlıyoruz (bunları programatik olarak sayfalandırmak için ayrıştırabilirsiniz):

| HTTP Yanıt Başlığı | Örnek | Tanım |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count` | `X-Page-Count: 3` | Toplam sayfa sayısı mevcuttur. |
| `X-Page-Current` | `X-Page-Current: 1` | Döndürülen sonuçların geçerli sayfası (örneğin `page` sorgu dizesi parametresine göre). |
| `X-Page-Size` | `X-Page-Size: 10` | Sayfada döndürülen toplam sonuç sayısı (örneğin, `limit` sorgu dizesi parametresine ve döndürülen gerçek sonuçlara dayanarak). |
| `X-Item-Count` | `X-Item-Count: 30` | Tüm sayfalarda mevcut toplam öğe sayısı. |
| `Link` | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Örnekte gösterildiği gibi ayrıştırabileceğiniz bir `Link` HTTP yanıt başlığı sağlıyoruz. Bu, [similar to GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers)'dır (örneğin, ilgili veya kullanılabilir olmadıklarında tüm değerler sağlanmaz, örneğin başka bir sayfa yoksa `"next"` sağlanmaz). |

> Örnek Talep:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```

## Günlükler {#logs}

### Günlükleri al {#retrieve-logs}

API'miz, hesabınız için günlükleri programatik olarak indirmenize olanak tanır. Bu uç noktaya bir istek gönderdiğinizde, hesabınızdaki tüm günlükler işlenir ve tamamlandığında ek olarak ([Gzip](https://en.wikipedia.org/wiki/Gzip) sıkıştırılmış [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) elektronik tablo dosyası) size e-posta ile gönderilir.

Bu, [Cron işi](https://en.wikipedia.org/wiki/Cron) ile arka plan işleri oluşturmanıza veya istediğiniz zaman günlükleri almak için [Node.js iş planlama yazılımı Bree](https://github.com/breejs/bree) uygulamamızı kullanmanıza olanak tanır. Bu uç noktanın günlük `10` isteğiyle sınırlı olduğunu unutmayın.

Ek, `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` ifadesinin küçük harfli halidir ve e-postanın kendisi, alınan günlüklerin kısa bir özetini içerir. Ayrıca, günlükleri istediğiniz zaman [Hesabım → Günlükler](/my-account/logs) adresinden indirebilirsiniz.

> `GET /v1/logs/download`

| Sorgu Dize Parametreleri | Gerekli | Tip | Tanım |
| --------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | HAYIR | Dize (FQDN) | Günlükleri tam nitelikli etki alanına ("FQDN") göre filtreleyin. Bunu sağlamazsanız, tüm etki alanlarındaki tüm günlükler alınacaktır. |
| `q` | HAYIR | Sicim | Günlükleri e-postaya, etki alanına, takma ada, IP adresine veya tarihe göre arayın (`M/Y`, `M/D/YY`, `M-D`, `M-D-YY` veya `M.D.YY` biçimi). |
| `bounce_category` | HAYIR | Sicim | Belirli bir geri dönüş kategorisine göre günlükleri arayın (örn. `blocklist`). |
| `response_code` | HAYIR | Sayı | Belirli bir hata yanıt koduna göre günlükleri arayın (örn. `421` veya `550`). |

> Örnek Talep:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Örnek Cron işi (her gün gece yarısı):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Cron iş ifadenizin sözdizimini doğrulamak için [Crontab.guru](https://crontab.guru/) gibi servisleri kullanabileceğinizi unutmayın.

> Örnek Cron işi (her gün gece yarısı **ve bir önceki güne ait günlüklerle**):

MacOS için:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Linux ve Ubuntu için:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

## Hesabı {#account}

### Hesap oluştur {#create-account}

> `POST /v1/account`

| Vücut Parametresi | Gerekli | Tip | Tanım |
| -------------- | -------- | -------------- | ------------- |
| `email` | Evet | Dize (E-posta) | E-posta adresi |
| `password` | Evet | Sicim | Şifre |

> Örnek Talep:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### {#retrieve-account} hesabını al

> `GET /v1/account`

> Örnek Talep:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### {#update-account} hesabını güncelle

> `PUT /v1/account`

| Vücut Parametresi | Gerekli | Tip | Tanım |
| -------------- | -------- | -------------- | -------------------- |
| `email` | HAYIR | Dize (E-posta) | E-posta adresi |
| `given_name` | HAYIR | Sicim | İlk adı |
| `family_name` | HAYIR | Sicim | Soy isim |
| `avatar_url` | HAYIR | Dize (URL) | Avatar resmine bağlantı |

> Örnek Talep:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

## Takma Ad Kişileri (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

### Kişileri listele {#list-contacts}

> `GET /v1/contacts`

**Yakında gelecek**

### Kişi oluştur {#create-contact}

> `POST /v1/contacts`

**Yakında gelecek**

### Kişiyi al {#retrieve-contact}

> `GET /v1/contacts/:id`

**Yakında gelecek**

### İletişim bilgilerini güncelle {#update-contact}

> `PUT /v1/contacts/:id`

**Yakında gelecek**

### Kişiyi sil {#delete-contact}

> `DELETE /v1/contacts/:id`

**Yakında gelecek**

## Takma Adlı Takvimler (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

### Takvimleri listele {#list-calendars}

> `GET /v1/calendars`

**Yakında gelecek**

### Takvimi oluştur {#create-calendar}

> `POST /v1/calendars`

**Yakında gelecek**

### Takvimi al {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Yakında gelecek**

### Takvimi güncelle {#update-calendar}

> `PUT /v1/calendars/:id`

**Yakında gelecek**

### Takvimi sil {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Yakında gelecek**

## Takma Ad Mesajları (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

Lütfen alan adınız için kurulum talimatlarını izlediğinizden emin olun.

Bu talimatlar SSS bölümümüzde [E-postaların IMAP ile alınmasını destekliyor musunuz?](/faq#do-you-support-receiving-email-with-imap) bulunabilir.

### Mesajları listele ve ara {#list-and-search-for-messages}

> `GET /v1/messages`

**Yakında gelecek**

### Mesajı oluştur {#create-message}

> \[!NOTE]
> This will **NOT** send an email – it will only simply add the message to your mailbox folder (e.g. this is similar to the IMAP `APPEND` command).  If you would like to send an email, then see [Create outbound SMTP email](#create-outbound-smtp-email) below.  After creating the outbound SMTP email, then you can append a copy of it using this endpoint to your alias' mailbox for storage purposes.

> `POST /v1/messages`

**Yakında gelecek**

### {#retrieve-message} mesajını al

> `GET /v1/messages/:id`

**Yakında gelecek**

### Güncelleme mesajı {#update-message}

> `PUT /v1/messages/:id`

**Yakında gelecek**

### Mesajı sil {#delete-message}

> `DELETE /v1/messages:id`

**Yakında gelecek**

## Takma Ad Klasörleri (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Folder endpoints with a folder's path <code>/v1/folders/:path</code> as their endpoint are interchangeable with a folder's ID <code>:id</code>. This means you can refer to the folder by either its <code>path</code> or <code>id</code> value.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

### Klasörleri listele {#list-folders}

> `GET /v1/folders`

**Yakında gelecek**

### {#create-folder} klasörünü oluştur

> `POST /v1/folders`

**Yakında gelecek**

### {#retrieve-folder} klasörünü al

> `GET /v1/folders/:id`

**Yakında gelecek**

### {#update-folder} klasörünü güncelle

> `PUT /v1/folders/:id`

**Yakında gelecek**

### {#delete-folder} klasörünü sil

> `DELETE /v1/folders/:id`

**Yakında gelecek**

### {#copy-folder} klasörünü kopyala

> `POST /v1/folders/:id/copy`

**Yakında gelecek**

## Giden E-postalar {#outbound-emails}

Lütfen alan adınız için kurulum talimatlarını izlediğinizden emin olun.

Bu talimatlara [Hesabım → Alan Adları → Ayarlar → Giden SMTP Yapılandırması](/my-account/domains) adresinden ulaşabilirsiniz. Alan adınızla giden SMTP göndermek için DKIM, Return-Path ve DMARC ayarlarının doğru olduğundan emin olmanız gerekir.

### Giden SMTP e-posta sınırını al {#get-outbound-smtp-email-limit}

Bu, hesap bazında günlük SMTP giden mesajlarının sayısını `count` ve `limit` içeren bir JSON nesnesi döndüren basit bir uç noktadır.

> `GET /v1/emails/limit`

> Örnek Talep:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Giden SMTP e-postalarını listele {#list-outbound-smtp-emails}

Bu uç noktanın bir e-postanın `message`, `headers` veya `rejectedErrors` için özellik değerlerini döndürmediğini unutmayın.

Bu özellikleri ve değerlerini döndürmek için lütfen bir e-posta kimliğiyle [E-postayı al](#retrieve-email) uç noktasını kullanın.

> `GET /v1/emails`

| Sorgu Dize Parametreleri | Gerekli | Tip | Tanım |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | HAYIR | Dize (RegExp desteklenir) | E-postaları meta verilere göre arayın |
| `domain` | HAYIR | Dize (RegExp desteklenir) | Alan adına göre e-postaları arayın |
| `sort` | HAYIR | Sicim | Belirli bir alana göre sırala (bu alanın ters yönünde sıralamak için önek olarak tek bir tire `-` ekleyin). Ayarlanmamışsa varsayılan olarak `created_at` kullanılır. |
| `page` | HAYIR | Sayı | Daha fazla bilgi için [Pagination](#pagination)'a bakın |
| `limit` | HAYIR | Sayı | Daha fazla bilgi için [Pagination](#pagination)'a bakın |

> Örnek Talep:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Giden SMTP e-postası oluştur {#create-outbound-smtp-email}

E-posta oluşturma API'miz, Nodemailer'ın mesaj seçeneği yapılandırmasından esinlenmiştir ve bu yapılandırmayı kullanır. Lütfen aşağıdaki tüm gövde parametreleri için [Nodemailer mesaj yapılandırması](https://nodemailer.com/message/)'ya bakın.

`envelope` ve `dkim` hariç (bunları sizin için otomatik olarak ayarladığımız için), tüm Nodemailer seçeneklerini desteklediğimizi unutmayın. Güvenlik amacıyla `disableFileAccess` ve `disableUrlAccess` seçeneklerini otomatik olarak `true` olarak ayarlıyoruz.

Başlıklar dahil ham tam e-postanızla birlikte `raw` seçeneğini tek bir seçenek olarak iletmelisiniz **veya** aşağıdaki bireysel gövde parametre seçeneklerini iletmelisiniz.

Bu API uç noktası, başlıklarda bulunan emojileri sizin için otomatik olarak kodlayacaktır (örneğin, `Subject: 🤓 Hello` konu satırı otomatik olarak `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`'e dönüştürülür). Amacımız, son derece geliştirici dostu ve sahtekarlara karşı dayanıklı bir e-posta API'si oluşturmaktı.

> `POST /v1/emails`

| Vücut Parametresi | Gerekli | Tip | Tanım |
| ---------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from` | HAYIR | Dize (E-posta) | Gönderenin e-posta adresi (alan adının takma adı olarak bulunmalıdır). |
| `to` | HAYIR | Dize veya Dizi | "Kime" başlığı için virgülle ayrılmış alıcı listesi veya dizisi. |
| `cc` | HAYIR | Dize veya Dizi | "Cc" başlığı için virgülle ayrılmış alıcı listesi veya dizisi. |
| `bcc` | HAYIR | Dize veya Dizi | "Bcc" başlığı için virgülle ayrılmış liste veya alıcı dizisi. |
| `subject` | HAYIR | Sicim | E-postanın konusu. |
| `text` | HAYIR | Dize veya Arabellek | Mesajın düz metin versiyonu. |
| `html` | HAYIR | Dize veya Arabellek | Mesajın HTML versiyonu. |
| `attachments` | HAYIR | Sıralamak | Bir dizi ek nesnesi (bkz. [Nodemailer's common fields](https://nodemailer.com/message/#common-fields)). |
| `sender` | HAYIR | Sicim | "Gönderen" başlığı için e-posta adresi (bkz. [Nodemailer's more advanced fields](https://nodemailer.com/message/#more-advanced-fields)). |
| `replyTo` | HAYIR | Sicim | "Yanıtla" başlığı için e-posta adresi. |
| `inReplyTo` | HAYIR | Sicim | Mesajın cevap olarak gönderildiği Mesaj Kimliği. |
| `references` | HAYIR | Dize veya Dizi | Boşlukla ayrılmış liste veya Mesaj Kimliklerinin Dizisi. |
| `attachDataUrls` | HAYIR | Boolean | `true` ise mesajın HTML içeriğindeki `data:` görsellerini gömülü eklere dönüştürür. |
| `watchHtml` | HAYIR | Sicim | Mesajın Apple Watch'a özgü HTML sürümü ([according to the Nodemailer docs](https://nodemailer.com/message/#content-options]), en son saatlerde bunun ayarlanması gerekmez). |
| `amp` | HAYIR | Sicim | Mesajın AMP4EMAIL'e özgü HTML sürümü (bkz. [Nodemailer's example](https://nodemailer.com/message/#amp-example)). |
| `icalEvent` | HAYIR | Nesne | Alternatif mesaj içeriği olarak kullanılacak bir iCalendar etkinliği (bkz. [Nodemailer's calendar events](https://nodemailer.com/message/calendar-events/)). |
| `alternatives` | HAYIR | Sıralamak | Alternatif mesaj içeriği dizisi (bkz. [Nodemailer's alternative content](https://nodemailer.com/message/alternatives/)). |
| `encoding` | HAYIR | Sicim | Metin ve HTML dizeleri için kodlama (varsayılanı `"utf-8"`'dır, ancak `"hex"` ve `"base64"` kodlama değerlerini de destekler). |
| `raw` | HAYIR | Dize veya Arabellek | Kullanılacak özel olarak oluşturulmuş RFC822 biçimli bir mesaj (Nodemailer tarafından oluşturulan bir mesaj yerine – bkz. [Nodemailer's custom source](https://nodemailer.com/message/custom-source/)). |
| `textEncoding` | HAYIR | Sicim | Metin değerleri için kullanılması zorunlu kodlama (`"quoted-printable"` veya `"base64"`). Varsayılan değer, algılanan en yakın değerdir (ASCII için `"quoted-printable"` kullanın). |
| `priority` | HAYIR | Sicim | E-posta için öncelik düzeyi (`"high"`, `"normal"` (varsayılan) veya `"low"` olabilir). `"normal"` değerinin bir öncelik başlığı ayarlamadığını unutmayın (bu varsayılan davranıştır). `"high"` veya `"low"` değeri ayarlanırsa, `X-Priority`, `X-MSMail-Priority` ve `Importance` başlıkları [will be set accordingly](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers` | HAYIR | Nesne veya Dizi | Ayarlanacak ek başlık alanlarının bir Nesnesi veya Dizisi (bkz. [Nodemailer's custom headers](https://nodemailer.com/message/custom-headers/)). |
| `messageId` | HAYIR | Sicim | "Message-ID" başlığı için isteğe bağlı bir Message-ID değeri (ayarlanmazsa varsayılan bir değer otomatik olarak oluşturulacaktır - değerin [adhere to the RFC2822 specification](https://stackoverflow.com/a/4031705) olması gerektiğini unutmayın). |
| `date` | HAYIR | Dize veya Tarih | Ayrıştırma sonrasında Tarih başlığı eksikse kullanılacak isteğe bağlı bir Tarih değeri. Aksi takdirde, ayarlanmamışsa geçerli UTC dizesi kullanılır. Tarih başlığı, geçerli saatten 30 günden fazla önce olamaz. |
| `list` | HAYIR | Nesne | `List-*` başlıklarının isteğe bağlı bir Nesnesi (bkz. [Nodemailer's list headers](https://nodemailer.com/message/list-headers/)). |

> Örnek Talep:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Örnek Talep:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Giden SMTP e-postasını al {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Örnek Talep:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Giden SMTP e-postasını sil {#delete-outbound-smtp-email}

E-posta silme işlemi, yalnızca geçerli durum `"pending"`, `"queued"` veya `"deferred"` ise durumu `"rejected"` olarak ayarlar (ve daha sonra kuyrukta işlemez). E-postaları oluşturulduktan ve/veya gönderildikten 30 gün sonra otomatik olarak temizleyebiliriz; bu nedenle, giden SMTP e-postalarının bir kopyasını istemcinizde, veritabanınızda veya uygulamanızda saklamalısınız. İsterseniz veritabanınızda e-posta kimliği değerimize başvurabilirsiniz; bu değer hem [E-posta oluştur](#create-email) hem de [E-postayı al](#retrieve-email) uç noktalarından döndürülür.

> `DELETE /v1/emails/:id`

> Örnek Talep:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

## Alan Adları {#domains}

> \[!TIP]
> Domain endpoints with a domain's name <code>/v1/domains/:domain_name</code> as their endpoint are interchangeable with a domain's ID <code>:domain_id</code>. This means you can refer to the domain by either its <code>name</code> or <code>id</code> value.

### Alan adlarını listele {#list-domains}

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.  See [Pagination](#pagination) for more insight.

> `GET /v1/domains`

| Sorgu Dize Parametreleri | Gerekli | Tip | Tanım |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | HAYIR | Dize (RegExp desteklenir) | Alan adlarını adına göre arayın |
| `name` | HAYIR | Dize (RegExp desteklenir) | Alan adlarını adına göre arayın |
| `sort` | HAYIR | Sicim | Belirli bir alana göre sırala (bu alanın ters yönünde sıralamak için önek olarak tek bir tire `-` ekleyin). Ayarlanmamışsa varsayılan olarak `created_at` kullanılır. |
| `page` | HAYIR | Sayı | Daha fazla bilgi için [Pagination](#pagination)'a bakın |
| `limit` | HAYIR | Sayı | Daha fazla bilgi için [Pagination](#pagination)'a bakın |

> Örnek Talep:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### {#create-domain} etki alanını oluştur

> `POST /v1/domains`

| Vücut Parametresi | Gerekli | Tip | Tanım |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Evet | Dize (FQDN veya IP) | Tam nitelikli alan adı ("FQDN") veya IP adresi |
| `team_domain` | HAYIR | Dize (alan adı kimliği veya alan adı; FQDN) | Bu etki alanını başka bir etki alanından aynı ekibe otomatik olarak atayın. Bu, bu etki alanındaki tüm üyelerin ekip üyesi olarak atanacağı ve `plan` değerinin de otomatik olarak `team` olarak ayarlanacağı anlamına gelir. Bunu açıkça devre dışı bırakmak için gerekirse `"none"` olarak ayarlayabilirsiniz, ancak bu gerekli değildir. |
| `plan` | HAYIR | Dize (numaralandırılabilir) | Plan türü (`"free"`, `"enhanced_protection"` veya `"team"` olmalıdır, varsayılan olarak `"free"` veya kullanıcının mevcut ücretli planı varsa) |
| `catchall` | HAYIR | Dize (ayrılmış e-posta adresleri) veya Boole | Varsayılan bir genel takma ad oluşturun, varsayılan olarak `true` olur (`true` ise, alıcı olarak API kullanıcısının e-posta adresini kullanır ve `false` ise genel bir takma ad oluşturulmaz). Bir Dize geçirilirse, alıcı olarak kullanılacak e-posta adreslerinin ayrılmış bir listesi olur (satır sonu, boşluk ve/veya virgülle ayrılmış). |
| `has_adult_content_protection` | HAYIR | Boolean | Bu etki alanında Spam Tarayıcısının yetişkinlere yönelik içerik korumasının etkinleştirilip etkinleştirilmeyeceği |
| `has_phishing_protection` | HAYIR | Boolean | Bu etki alanında Spam Tarayıcı kimlik avı korumasının etkinleştirilip etkinleştirilmeyeceği |
| `has_executable_protection` | HAYIR | Boolean | Bu etki alanında Spam Tarayıcısı yürütülebilir korumasının etkinleştirilip etkinleştirilmeyeceği |
| `has_virus_protection` | HAYIR | Boolean | Bu etki alanında Spam Tarayıcı virüs korumasının etkinleştirilip etkinleştirilmeyeceği |
| `has_recipient_verification` | HAYIR | Boolean | E-postaların iletilmesi için takma ad alıcılarının bir e-posta doğrulama bağlantısına tıklamasını zorunlu kılmak için küresel etki alanı varsayılanı |
| `ignore_mx_check` | HAYIR | Boolean | Alan adı doğrulaması için MX kaydı kontrolünün göz ardı edilip edilmeyeceği. Bu, esas olarak gelişmiş MX değişim yapılandırma kurallarına sahip olan ve mevcut MX değişimlerini saklayıp bizimkine yönlendirmesi gereken kullanıcılar içindir. |
| `retention_days` | HAYIR | Sayı | `0` ile `30` arasında, başarıyla teslim edilen veya kalıcı olarak hata veren giden SMTP e-postalarının saklanacağı saklama günü sayısına karşılık gelen bir tam sayı. Varsayılan olarak `0` değeri kullanılır; bu, giden SMTP e-postalarının güvenliğiniz için derhal temizlenip düzenlendiği anlamına gelir. |
| `bounce_webhook` | HAYIR | Dize (URL) veya Boole (yanlış) | Geri dönen webhook'ları göndermek için seçtiğiniz `http://` veya `https://` webhook URL'sini kullanın. Bu URL'ye, giden SMTP arızaları (örneğin, yazılım veya donanım arızaları - böylece abonelerinizi yönetebilir ve giden e-postalarınızı programatik olarak yönetebilirsiniz) hakkında bilgi içeren bir `POST` isteği göndereceğiz. |
| `max_quota_per_alias` | HAYIR | Sicim | Bu alan adındaki takma adlar için maksimum depolama kotası. [bytes](https://github.com/visionmedia/bytes.js) tarafından ayrıştırılacak "1 GB" gibi bir değer girin. |

> Örnek Talep:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Alan adını al {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Örnek Talep:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Alan adı kayıtlarını doğrulayın {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Örnek Talep:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Alan adı SMTP kayıtlarını doğrulayın {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Örnek Talep:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Alan adı genelindeki tüm parolaları listele {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Örnek Talep:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Alan adı genelinde geçerli parolayı oluştur {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Vücut Parametresi | Gerekli | Tip | Tanım |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | HAYIR | Sicim | Alan genelindeki genel parola için kullanılacak özel yeni parolanız. Rastgele oluşturulmuş ve güçlü bir parola almak istiyorsanız, bunu API istek gövdenizden boş veya tamamen eksik bırakabileceğinizi unutmayın. |
| `description` | HAYIR | Sicim | Açıklama yalnızca organizasyon amaçlıdır. |

> Örnek Talep:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Alan adı genelindeki genel parolayı kaldır {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Örnek Talep:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Alan adını güncelle {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Vücut Parametresi | Gerekli | Tip | Tanım |
| ------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port` | HAYIR | Dize veya Sayı | SMTP yönlendirmesi için yapılandırılacak özel bağlantı noktası (varsayılan `"25"`) |
| `has_adult_content_protection` | HAYIR | Boolean | Bu etki alanında Spam Tarayıcısının yetişkinlere yönelik içerik korumasının etkinleştirilip etkinleştirilmeyeceği |
| `has_phishing_protection` | HAYIR | Boolean | Bu etki alanında Spam Tarayıcı kimlik avı korumasının etkinleştirilip etkinleştirilmeyeceği |
| `has_executable_protection` | HAYIR | Boolean | Bu etki alanında Spam Tarayıcısı yürütülebilir korumasının etkinleştirilip etkinleştirilmeyeceği |
| `has_virus_protection` | HAYIR | Boolean | Bu etki alanında Spam Tarayıcı virüs korumasının etkinleştirilip etkinleştirilmeyeceği |
| `has_recipient_verification` | HAYIR | Boolean | E-postaların iletilmesi için takma ad alıcılarının bir e-posta doğrulama bağlantısına tıklamasını zorunlu kılmak için küresel etki alanı varsayılanı |
| `ignore_mx_check` | HAYIR | Boolean | Alan adı doğrulaması için MX kaydı kontrolünün göz ardı edilip edilmeyeceği. Bu, esas olarak gelişmiş MX değişim yapılandırma kurallarına sahip olan ve mevcut MX değişimlerini saklayıp bizimkine yönlendirmesi gereken kullanıcılar içindir. |
| `retention_days` | HAYIR | Sayı | `0` ile `30` arasında, başarıyla teslim edilen veya kalıcı olarak hata veren giden SMTP e-postalarının saklanacağı saklama günü sayısına karşılık gelen bir tam sayı. Varsayılan olarak `0` değeri kullanılır; bu, giden SMTP e-postalarının güvenliğiniz için derhal temizlenip düzenlendiği anlamına gelir. |
| `bounce_webhook` | HAYIR | Dize (URL) veya Boole (yanlış) | Geri dönen webhook'ları göndermek için seçtiğiniz `http://` veya `https://` webhook URL'sini kullanın. Bu URL'ye, giden SMTP arızaları (örneğin, yazılım veya donanım arızaları - böylece abonelerinizi yönetebilir ve giden e-postalarınızı programatik olarak yönetebilirsiniz) hakkında bilgi içeren bir `POST` isteği göndereceğiz. |
| `max_quota_per_alias` | HAYIR | Sicim | Bu alan adındaki takma adlar için maksimum depolama kotası. [bytes](https://github.com/visionmedia/bytes.js) tarafından ayrıştırılacak "1 GB" gibi bir değer girin. |

> Örnek Talep:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### {#delete-domain} etki alanını sil

> `DELETE /v1/domains/:domain_name`

> Örnek Talep:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```

## Davetler {#invites}

### Alan adı davetini kabul et {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Örnek Talep:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Alan adı daveti oluştur {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Vücut Parametresi | Gerekli | Tip | Tanım |
| -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email` | Evet | Dize (E-posta) | Alan adı üyeleri listesine davet edilecek e-posta adresi |
| `group` | Evet | Dize (numaralandırılabilir) | Kullanıcının etki alanı üyeliğine ekleneceği grup (`"admin"` veya `"user"` olabilir) |

> Örnek Talep:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> If the user being invited is already an accepted member of any other domains the admin inviting them is a member of, then it will auto-accept the invite and not send an email.

### Alan adı davetini kaldır {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Vücut Parametresi | Gerekli | Tip | Tanım |
| -------------- | -------- | -------------- | ------------------------------------------------ |
| `email` | Evet | Dize (E-posta) | Etki alanı üyeleri listesinden kaldırılacak e-posta adresi |

> Örnek Talep:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

## Üyeler {#members}

### Etki alanı üyesini güncelle {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Vücut Parametresi | Gerekli | Tip | Tanım |
| -------------- | -------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `group` | Evet | Dize (numaralandırılabilir) | Kullanıcıyı etki alanı üyeliğine güncellemek için kullanılacak grup (`"admin"` veya `"user"` olabilir) |

> Örnek Talep:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Etki alanı üyesini kaldır {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Örnek Talep:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```

## Takma Adlar {#aliases}

### Bir takma ad parolası oluşturun {#generate-an-alias-password}

Talimatları e-postayla göndermezseniz, kullanıcı adı ve parola başarılı bir isteğin JSON yanıt gövdesinde `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }` biçiminde yer alacaktır.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Vücut Parametresi | Gerekli | Tip | Tanım |
| ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | HAYIR | Sicim | Takma ad için kullanacağınız özel yeni parolanız. Rastgele oluşturulmuş ve güçlü bir parola istiyorsanız, API istek gövdenizde bu alanı boş bırakabilir veya tamamen silebilirsiniz. |
| `password` | HAYIR | Sicim | Mevcut IMAP posta kutusu depolama alanını silmeden parolayı değiştirmek için takma adın mevcut parolası (mevcut parolanız yoksa aşağıdaki `is_override` seçeneğine bakın). |
| `is_override` | HAYIR | Boolean | **DİKKATLİ KULLANIN**: Bu, mevcut takma ad parolasını ve veritabanını tamamen geçersiz kılacak, mevcut IMAP depolama alanını kalıcı olarak silecek ve takma adın SQLite e-posta veritabanını tamamen sıfırlayacaktır. Bu takma ada bağlı mevcut bir posta kutunuz varsa, lütfen mümkünse bir yedek alın. |
| `emailed_instructions` | HAYIR | Sicim | Takma adın şifresini ve kurulum talimatlarını göndereceğiniz e-posta adresi. |

> Örnek Talep:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Alan adı takma adlarını listele {#list-domain-aliases}

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.  See [Pagination](#pagination) for more insight.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Sorgu Dize Parametreleri | Gerekli | Tip | Tanım |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | HAYIR | Dize (RegExp desteklenir) | Bir etki alanındaki takma adları ad, etiket veya alıcıya göre arayın |
| `name` | HAYIR | Dize (RegExp desteklenir) | Bir alan adındaki takma adları adına göre arayın |
| `recipient` | HAYIR | Dize (RegExp desteklenir) | Alıcıya göre bir alandaki takma adları arayın |
| `sort` | HAYIR | Sicim | Belirli bir alana göre sırala (bu alanın ters yönünde sıralamak için önek olarak tek bir tire `-` ekleyin). Ayarlanmamışsa varsayılan olarak `created_at` kullanılır. |
| `page` | HAYIR | Sayı | Daha fazla bilgi için [Pagination](#pagination)'a bakın |
| `limit` | HAYIR | Sayı | Daha fazla bilgi için [Pagination](#pagination)'a bakın |

> Örnek Talep:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Yeni alan adı takma adı oluştur {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Vücut Parametresi | Gerekli | Tip | Tanım |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | HAYIR | Sicim | Takma ad (sağlanmazsa veya boş bırakılırsa, rastgele bir takma ad oluşturulur) |
| `recipients` | HAYIR | Dize veya Dizi | Alıcıların listesi (satır sonu/boşluk/virgülle ayrılmış geçerli e-posta adresleri, tam nitelikli alan adları ("FQDN"), IP adresleri ve/veya webhook URL'lerinden oluşan bir Dize veya Dizi olmalıdır - ve sağlanmazsa veya boş bir Dizi ise, API isteğinde bulunan kullanıcının e-postası alıcı olarak ayarlanacaktır) |
| `description` | HAYIR | Sicim | Takma ad açıklaması |
| `labels` | HAYIR | Dize veya Dizi | Etiketlerin listesi (satır sonu/boşluk/virgülle ayrılmış Dize veya Dizi olmalıdır) |
| `has_recipient_verification` | HAYIR | Boolean | E-postaların iletilmesi için alıcıların bir e-posta doğrulama bağlantısına tıklamasını gerektir (istek gövdesinde açıkça belirtilmemişse varsayılan olarak etki alanının ayarı kullanılır) |
| `is_enabled` | HAYIR | Boolean | Bu takma adın etkinleştirilip etkinleştirilmeyeceği (devre dışı bırakılırsa, e-postalar hiçbir yere yönlendirilmez, ancak başarılı durum kodları döndürülür). Bir değer geçirilirse, [boolean](https://github.com/thenativeweb/boolean#quick-start) kullanılarak bir Boole değerine dönüştürülür.) |
| `error_code_if_disabled` | HAYIR | Sayı (__HÜCRE_KODU_0__, __HÜCRE_KODU_1__ veya __HÜCRE_KODU_2__) | Bu takma ada gelen e-posta, `is_enabled` değeri `false` ise ve `250` (hiçbir yere sessizce iletilmez, örn. kara delik veya `/dev/null`), `421` (yumuşak reddetme; ve ~5 güne kadar yeniden deneme) veya `550` kalıcı başarısızlık ve reddetme durumunda reddedilecektir. Varsayılan olarak `250` kullanılır. |
| `has_imap` | HAYIR | Boolean | Bu takma ad için IMAP depolamanın etkinleştirilip etkinleştirilmeyeceği (devre dışı bırakılırsa, alınan gelen e-postalar [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service)'a kaydedilmez. Bir değer geçirilirse, [boolean](https://github.com/thenativeweb/boolean#quick-start) kullanılarak bir Boole değerine dönüştürülür) |
| `has_pgp` | HAYIR | Boolean | [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) için `public_key` takma adını kullanarak [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)'ın etkinleştirilmesi veya devre dışı bırakılması. |
| `public_key` | HAYIR | Sicim | ASCII Armor formatında OpenPGP genel anahtarı ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); örneğin `support@forwardemail.net` için GPG anahtarı). Bu yalnızca `has_pgp` değerini `true` olarak ayarladıysanız geçerlidir. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | HAYIR | Sicim | Bu takma ad için maksimum depolama kotası. Alan adının geçerli maksimum kotasına sıfırlamak için boş bırakın veya [bytes](https://github.com/visionmedia/bytes.js) tarafından ayrıştırılacak "1 GB" gibi bir değer girin. Bu değer yalnızca alan adı yöneticileri tarafından ayarlanabilir. |
| `vacation_responder_is_enabled` | HAYIR | Boolean | Otomatik tatil yanıtlayıcısını etkinleştirmek veya devre dışı bırakmak. |
| `vacation_responder_start_date` | HAYIR | Sicim | Tatil yanıtlayıcısı için başlangıç tarihi (etkinleştirilmişse ve burada bir başlangıç tarihi ayarlanmamışsa, yanıtlayıcının zaten başlatıldığı varsayılır). `MM/DD/YYYY`, `YYYY-MM-DD` ve `dayjs` kullanarak akıllı ayrıştırma yoluyla diğer tarih biçimlerini destekliyoruz. |
| `vacation_responder_end_date` | HAYIR | Sicim | Tatil yanıtlayıcısı için bitiş tarihi (etkinleştirilmişse ve burada bir bitiş tarihi ayarlanmamışsa, yanıtlayıcının asla bitmeyeceği varsayılır ve sonsuza kadar yanıt verir). `MM/DD/YYYY`, `YYYY-MM-DD` ve `dayjs` kullanarak akıllı ayrıştırma yoluyla diğer tarih biçimlerini destekliyoruz. |
| `vacation_responder_subject` | HAYIR | Sicim | Tatil yanıtlayıcısı için konu düz metin olarak, örneğin "Ofis Dışında". Burada tüm HTML kodunu kaldırmak için `striptags` kullanıyoruz. |
| `vacation_responder_message` | HAYIR | Sicim | Tatil yanıtlayıcısı için düz metin halinde ileti, örneğin "Şubat ayına kadar ofiste olmayacağım.". Burada tüm HTML kodunu kaldırmak için `striptags` kullanıyoruz. |

> Örnek Talep:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Alan adı takma adını al {#retrieve-domain-alias}

Bir alan takma adını `id` veya `name` değerinden alabilirsiniz.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Örnek Talep:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Örnek Talep:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Alan adı takma adını güncelle {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Vücut Parametresi | Gerekli | Tip | Tanım |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | HAYIR | Sicim | Takma ad |
| `recipients` | HAYIR | Dize veya Dizi | Alıcı listesi (geçerli e-posta adresleri, tam nitelikli alan adları ("FQDN"), IP adresleri ve/veya webhook URL'lerinden oluşan satır sonu/boşluk/virgülle ayrılmış Dize veya Dizi olmalıdır) |
| `description` | HAYIR | Sicim | Takma ad açıklaması |
| `labels` | HAYIR | Dize veya Dizi | Etiketlerin listesi (satır sonu/boşluk/virgülle ayrılmış Dize veya Dizi olmalıdır) |
| `has_recipient_verification` | HAYIR | Boolean | E-postaların iletilmesi için alıcıların bir e-posta doğrulama bağlantısına tıklamasını gerektir (istek gövdesinde açıkça belirtilmemişse varsayılan olarak etki alanının ayarı kullanılır) |
| `is_enabled` | HAYIR | Boolean | Bu takma adın etkinleştirilip etkinleştirilmeyeceği (devre dışı bırakılırsa, e-postalar hiçbir yere yönlendirilmez, ancak başarılı durum kodları döndürülür). Bir değer geçirilirse, [boolean](https://github.com/thenativeweb/boolean#quick-start) kullanılarak bir Boole değerine dönüştürülür.) |
| `error_code_if_disabled` | HAYIR | Sayı (__HÜCRE_KODU_0__, __HÜCRE_KODU_1__ veya __HÜCRE_KODU_2__) | Bu takma ada gelen e-posta, `is_enabled` değeri `false` ise ve `250` (hiçbir yere sessizce iletilmez, örn. kara delik veya `/dev/null`), `421` (yumuşak reddetme; ve ~5 güne kadar yeniden deneme) veya `550` kalıcı başarısızlık ve reddetme durumunda reddedilecektir. Varsayılan olarak `250` kullanılır. |
| `has_imap` | HAYIR | Boolean | Bu takma ad için IMAP depolamanın etkinleştirilip etkinleştirilmeyeceği (devre dışı bırakılırsa, alınan gelen e-postalar [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service)'a kaydedilmez. Bir değer geçirilirse, [boolean](https://github.com/thenativeweb/boolean#quick-start) kullanılarak bir Boole değerine dönüştürülür) |
| `has_pgp` | HAYIR | Boolean | [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) için `public_key` takma adını kullanarak [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)'ın etkinleştirilmesi veya devre dışı bırakılması. |
| `public_key` | HAYIR | Sicim | ASCII Armor formatında OpenPGP genel anahtarı ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); örneğin `support@forwardemail.net` için GPG anahtarı). Bu yalnızca `has_pgp` değerini `true` olarak ayarladıysanız geçerlidir. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | HAYIR | Sicim | Bu takma ad için maksimum depolama kotası. Alan adının geçerli maksimum kotasına sıfırlamak için boş bırakın veya [bytes](https://github.com/visionmedia/bytes.js) tarafından ayrıştırılacak "1 GB" gibi bir değer girin. Bu değer yalnızca alan adı yöneticileri tarafından ayarlanabilir. |
| `vacation_responder_is_enabled` | HAYIR | Boolean | Otomatik tatil yanıtlayıcısını etkinleştirmek veya devre dışı bırakmak. |
| `vacation_responder_start_date` | HAYIR | Sicim | Tatil yanıtlayıcısı için başlangıç tarihi (etkinleştirilmişse ve burada bir başlangıç tarihi ayarlanmamışsa, yanıtlayıcının zaten başlatıldığı varsayılır). `MM/DD/YYYY`, `YYYY-MM-DD` ve `dayjs` kullanarak akıllı ayrıştırma yoluyla diğer tarih biçimlerini destekliyoruz. |
| `vacation_responder_end_date` | HAYIR | Sicim | Tatil yanıtlayıcısı için bitiş tarihi (etkinleştirilmişse ve burada bir bitiş tarihi ayarlanmamışsa, yanıtlayıcının asla bitmeyeceği varsayılır ve sonsuza kadar yanıt verir). `MM/DD/YYYY`, `YYYY-MM-DD` ve `dayjs` kullanarak akıllı ayrıştırma yoluyla diğer tarih biçimlerini destekliyoruz. |
| `vacation_responder_subject` | HAYIR | Sicim | Tatil yanıtlayıcısı için konu düz metin olarak, örneğin "Ofis Dışında". Burada tüm HTML kodunu kaldırmak için `striptags` kullanıyoruz. |
| `vacation_responder_message` | HAYIR | Sicim | Tatil yanıtlayıcısı için düz metin halinde ileti, örneğin "Şubat ayına kadar ofiste olmayacağım.". Burada tüm HTML kodunu kaldırmak için `striptags` kullanıyoruz. |

> Örnek Talep:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Alan adı takma adını sil {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Örnek Talep:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

## {#encrypt} adresini şifrele

Ücretsiz planda bile kayıtlarınızı ücretsiz olarak şifrelemenize olanak tanıyoruz. Gizlilik bir özellik olmamalı, ürünün tüm yönlerine entegre edilmelidir. [Gizlilik Kılavuzları tartışması](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) ve [GitHub sorunlarımız](https://github.com/forwardemail/forwardemail.net/issues/254)'da yoğun talep üzerine bunu ekledik.

### TXT Kaydını Şifrele {#encrypt-txt-record}

> `POST /v1/encrypt`

| Vücut Parametresi | Gerekli | Tip | Tanım |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input` | Evet | Sicim | Herhangi bir geçerli Yönlendirilmiş E-posta düz metin TXT kaydı |

> Örnek Talep:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
