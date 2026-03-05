# Forward Email MCP Sunucusu {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> <a href="https://github.com/forwardemail/mcp-server">Açık kaynak MCP sunucumuz</a>, Claude, ChatGPT, Cursor ve Windsurf gibi yapay zeka asistanlarının e-postalarınızı, alan adlarınızı, takma adlarınızı, kişilerinizi ve takvimlerinizi doğal dil aracılığıyla yönetmesine olanak tanır. Tüm 68 API uç noktası MCP araçları olarak sunulmuştur. <code>npx @forwardemail/mcp-server</code> aracılığıyla yerel olarak çalışır — kimlik bilgileriniz makinenizden asla ayrılmaz.
</p>

## İçindekiler {#table-of-contents}

* [MCP Nedir?](#what-is-mcp)
* [Hızlı Başlangıç](#quick-start)
  * [API Anahtarı Alın](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Diğer MCP İstemcileri](#other-mcp-clients)
* [Kimlik Doğrulama](#authentication)
  * [API Anahtarı Kimlik Doğrulaması](#api-key-auth)
  * [Takma Ad Kimlik Doğrulaması](#alias-auth)
  * [Takma Ad Parolası Oluşturma](#generating-an-alias-password)
* [Tüm 68 Araç](#all-68-tools)
  * [Hesap (API Anahtarı veya Takma Ad Kimlik Doğrulaması)](#account-api-key-or-alias-auth)
  * [Alan Adları (API Anahtarı)](#domains-api-key)
  * [Takma Adlar (API Anahtarı)](#aliases-api-key)
  * [E-postalar — Giden SMTP (API Anahtarı; Gönderme her ikisini de destekler)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Mesajlar — IMAP (Takma Ad Kimlik Doğrulaması)](#messages--imap-alias-auth)
  * [Klasörler — IMAP (Takma Ad Kimlik Doğrulaması)](#folders--imap-alias-auth)
  * [Kişiler — CardDAV (Takma Ad Kimlik Doğrulaması)](#contacts--carddav-alias-auth)
  * [Takvimler — CalDAV (Takma Ad Kimlik Doğrulaması)](#calendars--caldav-alias-auth)
  * [Takvim Etkinlikleri — CalDAV (Takma Ad Kimlik Doğrulaması)](#calendar-events--caldav-alias-auth)
  * [Sieve Komut Dosyaları (API Anahtarı)](#sieve-scripts-api-key)
  * [Sieve Komut Dosyaları (Takma Ad Kimlik Doğrulaması)](#sieve-scripts-alias-auth)
  * [Alan Adı Üyeleri ve Davetiyeleri (API Anahtarı)](#domain-members-and-invites-api-key)
  * [Tümünü Yakala Parolaları (API Anahtarı)](#catch-all-passwords-api-key)
  * [Günlükler (API Anahtarı)](#logs-api-key)
  * [Şifrele (Kimlik Doğrulama Yok)](#encrypt-no-auth)
* [20 Gerçek Dünya Kullanım Durumu](#20-real-world-use-cases)
* [Örnek İstemler](#example-prompts)
* [Ortam Değişkenleri](#environment-variables)
* [Güvenlik](#security)
* [Programatik Kullanım](#programmatic-usage)
* [Açık Kaynak](#open-source)


## MCP Nedir? {#what-is-mcp}

[Model Bağlam Protokolü](https://modelcontextprotocol.io) (MCP), Anthropic tarafından oluşturulan ve yapay zeka modellerinin harici araçları güvenli bir şekilde çağırmasına olanak tanıyan açık bir standarttır. API yanıtlarını bir sohbet penceresine kopyalayıp yapıştırmak yerine, MCP modele hizmetlerinize doğrudan, yapılandırılmış erişim sağlar.

MCP sunucumuz, tüm [Forward Email API'sini](/email-api) (her uç nokta, her parametre) sarar ve bunları herhangi bir MCP uyumlu istemcinin kullanabileceği araçlar olarak sunar. Sunucu, stdio aktarımı kullanarak makinenizde yerel olarak çalışır. Kimlik bilgileriniz ortam değişkenlerinizde kalır ve yapay zeka modeline asla gönderilmez.


## Hızlı Başlangıç {#quick-start}

### API Anahtarı Alın {#get-an-api-key}

1. [Forward Email hesabınıza](/my-account/domains) giriş yapın.
2. **Hesabım** → **Güvenlik** → **API Anahtarları**'na gidin.
3. Yeni bir API anahtarı oluşturun ve kopyalayın.

### Claude Desktop {#claude-desktop}

Bunu Claude Desktop yapılandırma dosyanıza ekleyin:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

Claude Desktop'ı yeniden başlatın. Forward Email araçlarını araç seçicide görmelisiniz.

> **Not:** `FORWARD_EMAIL_ALIAS_USER` ve `FORWARD_EMAIL_ALIAS_PASSWORD` değişkenleri isteğe bağlıdır ancak posta kutusu araçları (mesajlar, klasörler, kişiler, takvimler) için gereklidir. Ayrıntılar için [Kimlik Doğrulama](#authentication) bölümüne bakın.

### Cursor {#cursor}

Cursor Ayarları → MCP → Sunucu Ekle'yi açın:

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

### Windsurf {#windsurf}

Windsurf Ayarları → MCP → Sunucu Ekle'yi yukarıdaki yapılandırmanın aynısıyla açın.

### Diğer MCP İstemcileri {#other-mcp-clients}

MCP stdio aktarımını destekleyen herhangi bir istemci çalışacaktır. Komut şöyledir:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Kimlik Doğrulama {#authentication}

Forward Email API'si, uç noktaya bağlı olarak iki farklı kimlik bilgisi türüyle **HTTP Temel kimlik doğrulamasını** kullanır. MCP sunucusu bunu otomatik olarak halleder — sadece doğru kimlik bilgilerini sağlamanız gerekir.

### API Anahtarı Kimlik Doğrulaması {#api-key-auth}

Çoğu yönetim uç noktası (alan adları, takma adlar, giden e-postalar, günlükler), Temel kimlik doğrulama kullanıcı adı olarak **API anahtarınızı** ve boş bir parola kullanır.

Bu, REST API için kullandığınız API anahtarının aynısıdır. Bunu `FORWARD_EMAIL_API_KEY` ortam değişkeni aracılığıyla ayarlayın.

### Takma Ad Kimlik Doğrulaması {#alias-auth}

Posta kutusu uç noktaları (mesajlar, klasörler, kişiler, takvimler, takma ada özel Sieve komut dosyaları) **takma ad kimlik bilgilerini** kullanır — kullanıcı adı olarak takma ad e-posta adresi ve parola olarak oluşturulmuş bir parola.

Bu uç noktalar, IMAP, CalDAV ve CardDAV protokolleri aracılığıyla takma ad başına verilere erişir. API anahtarı değil, takma ad e-postası ve oluşturulmuş bir parola gerektirirler.

Takma ad kimlik bilgilerini iki şekilde sağlayabilirsiniz:

1. **Ortam değişkenleri** (varsayılan takma ad için önerilir): `FORWARD_EMAIL_ALIAS_USER` ve `FORWARD_EMAIL_ALIAS_PASSWORD` değerlerini ayarlayın.
2. **Araç çağrısı başına parametreler**: Herhangi bir takma ad kimlik doğrulama aracına `alias_username` ve `alias_password` argümanlarını geçirin. Bunlar, birden çok takma adla çalışırken yararlı olan ortam değişkenlerini geçersiz kılar.

### Takma Ad Parolası Oluşturma {#generating-an-alias-password}

Takma ad kimlik doğrulama araçlarını kullanmadan önce, takma ad için bir parola oluşturmanız gerekir. Bunu `generateAliasPassword` aracıyla veya API aracılığıyla yapabilirsiniz:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

Yanıt, `username` (takma ad e-postası) ve `password` alanlarını içerir. Bunları takma ad kimlik bilgileriniz olarak kullanın.

> **İpucu:** Yapay zeka asistanınıza da sorabilirsiniz: *"example.com alan adındaki user@example.com takma adı için bir parola oluştur"* — bu, `generateAliasPassword` aracını çağıracak ve kimlik bilgilerini döndürecektir.

Aşağıdaki tablo, her araç grubunun hangi kimlik doğrulama yöntemini gerektirdiğini özetlemektedir:

| Araç Grubu | Kimlik Doğrulama Yöntemi | Kimlik Bilgileri |
|-----------|-------------|-------------|
| Hesap | API Anahtarı **veya** Takma Ad Kimlik Doğrulaması | Her ikisi de |
| Alan Adları, Takma Adlar, Alan Adı Üyeleri, Davetiyeler, Tümünü Yakala Parolaları | API Anahtarı | `FORWARD_EMAIL_API_KEY` |
| Giden E-postalar (listele, al, sil, limit) | API Anahtarı | `FORWARD_EMAIL_API_KEY` |
| E-posta Gönder | API Anahtarı **veya** Takma Ad Kimlik Doğrulaması | Her ikisi de |
| Mesajlar (IMAP) | Takma Ad Kimlik Doğrulaması | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Klasörler (IMAP) | Takma Ad Kimlik Doğrulaması | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kişiler (CardDAV) | Takma Ad Kimlik Doğrulaması | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Takvimler (CalDAV) | Takma Ad Kimlik Doğrulaması | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Takvim Etkinlikleri (CalDAV) | Takma Ad Kimlik Doğrulaması | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieve Komut Dosyaları (alan adı kapsamlı) | API Anahtarı | `FORWARD_EMAIL_API_KEY` |
| Sieve Komut Dosyaları (takma ad kapsamlı) | Takma Ad Kimlik Doğrulaması | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Günlükler | API Anahtarı | `FORWARD_EMAIL_API_KEY` |
| Şifrele | Yok | Kimlik bilgisi gerekmez |


## Tüm 68 Araç {#all-68-tools}

Her araç doğrudan bir [Forward Email API](/email-api) uç noktasına eşlenir. Parametreler, API belgelerindeki adların aynısını kullanır. Kimlik doğrulama yöntemi her bölüm başlığında belirtilmiştir.

### Hesap (API Anahtarı veya Takma Ad Kimlik Doğrulaması) {#account-api-key-or-alias-auth}

API anahtarı kimlik doğrulamasıyla, bunlar kullanıcı hesabı bilgilerinizi döndürür. Takma ad kimlik doğrulamasıyla, depolama kotası ve ayarları dahil olmak üzere takma ad/posta kutusu bilgilerini döndürürler.

| Araç | API Uç Noktası | Açıklama |
|------|-------------|-------------|
| `getAccount` | `GET /v1/account` | Hesap bilgilerinizi alın |
| `updateAccount` | `PUT /v1/account` | Hesap ayarlarınızı güncelleyin |

### Alan Adları (API Anahtarı) {#domains-api-key}

| Araç | API Uç Noktası | Açıklama |
|------|-------------|-------------|
| `listDomains` | `GET /v1/domains` | Tüm alan adlarınızı listeleyin |
| `createDomain` | `POST /v1/domains` | Yeni bir alan adı ekleyin |
| `getDomain` | `GET /v1/domains/:domain_id` | Alan adı ayrıntılarını alın |
| `updateDomain` | `PUT /v1/domains/:domain_id` | Alan adı ayarlarını güncelleyin |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | Bir alan adını kaldırın |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | DNS kayıtlarını doğrulayın |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | SMTP yapılandırmasını doğrulayın |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | Özel S3 depolamasını test edin |

### Takma Adlar (API Anahtarı) {#aliases-api-key}

| Araç | API Uç Noktası | Açıklama |
|------|-------------|-------------|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | Bir alan adı için takma adları listeleyin |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | Yeni bir takma ad oluşturun |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | Takma ad ayrıntılarını alın |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | Bir takma adı güncelleyin |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | Bir takma adı silin |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Takma ad kimlik doğrulaması için IMAP/SMTP parolası oluşturun |

### E-postalar — Giden SMTP (API Anahtarı; Gönderme her ikisini de destekler) {#emails--outbound-smtp-api-key-send-supports-both}

| Araç | API Uç Noktası | Kimlik Doğrulama | Açıklama |
|------|-------------|------|-------------|
| `sendEmail` | `POST /v1/emails` | API Anahtarı veya Takma Ad Kimlik Doğrulaması | SMTP aracılığıyla e-posta gönderin |
| `listEmails` | `GET /v1/emails` | API Anahtarı | Giden e-postaları listeleyin |
| `getEmail` | `GET /v1/emails/:id` | API Anahtarı | E-posta ayrıntılarını ve durumunu alın |
| `deleteEmail` | `DELETE /v1/emails/:id` | API Anahtarı | Sıradaki bir e-postayı silin |
| `getEmailLimit` | `GET /v1/emails/limit` | API Anahtarı | Gönderme limitinizi kontrol edin |

`sendEmail` aracı `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` ve `attachments` kabul eder. Bu, `POST /v1/emails` uç noktasıyla aynıdır.

### Mesajlar — IMAP (Takma Ad Kimlik Doğrulaması) {#messages--imap-alias-auth}

> **Takma ad kimlik bilgileri gerektirir.** `alias_username` ve `alias_password` değerlerini geçirin veya `FORWARD_EMAIL_ALIAS_USER` ve `FORWARD_EMAIL_ALIAS_PASSWORD` ortam değişkenlerini ayarlayın.

| Araç | API Uç Noktası | Açıklama |
|------|-------------|-------------|
| `listMessages` | `GET /v1/messages` | Bir posta kutusundaki mesajları listeleyin ve arayın |
| `createMessage` | `POST /v1/messages` | Bir taslak oluşturun veya bir mesaj yükleyin |
| `getMessage` | `GET /v1/messages/:id` | Kimliğe göre bir mesaj alın |
| `updateMessage` | `PUT /v1/messages/:id` | Bayrakları güncelleyin (okundu, yıldızlı vb.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Bir mesajı silin |

`listMessages` aracı, `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` ve `has_attachment` dahil olmak üzere 15'ten fazla arama parametresini destekler. Tam liste için [API belgelerine](/email-api) bakın.

### Klasörler — IMAP (Takma Ad Kimlik Doğrulaması) {#folders--imap-alias-auth}

> **Takma ad kimlik bilgileri gerektirir.** `alias_username` ve `alias_password` değerlerini geçirin veya `FORWARD_EMAIL_ALIAS_USER` ve `FORWARD_EMAIL_ALIAS_PASSWORD` ortam değişkenlerini ayarlayın.

| Araç | API Uç Noktası | Açıklama |
|------|-------------|-------------|
| `listFolders` | `GET /v1/folders` | Tüm posta kutusu klasörlerini listeleyin |
| `createFolder` | `POST /v1/folders` | Yeni bir klasör oluşturun |
| `getFolder` | `GET /v1/folders/:id` | Klasör ayrıntılarını alın |
| `updateFolder` | `PUT /v1/folders/:id` | Bir klasörü yeniden adlandırın |
| `deleteFolder` | `DELETE /v1/folders/:id` | Bir klasörü silin |

### Kişiler — CardDAV (Takma Ad Kimlik Doğrulaması) {#contacts--carddav-alias-auth}

> **Takma ad kimlik bilgileri gerektirir.** `alias_username` ve `alias_password` değerlerini geçirin veya `FORWARD_EMAIL_ALIAS_USER` ve `FORWARD_EMAIL_ALIAS_PASSWORD` ortam değişkenlerini ayarlayın.

| Araç | API Uç Noktası | Açıklama |
|------|-------------|-------------|
| `listContacts` | `GET /v1/contacts` | Tüm kişileri listeleyin |
| `createContact` | `POST /v1/contacts` | Yeni bir kişi oluşturun |
| `getContact` | `GET /v1/contacts/:id` | Kişi ayrıntılarını alın |
| `updateContact` | `PUT /v1/contacts/:id` | Bir kişiyi güncelleyin |
| `deleteContact` | `DELETE /v1/contacts/:id` | Bir kişiyi silin |

### Takvimler — CalDAV (Takma Ad Kimlik Doğrulaması) {#calendars--caldav-alias-auth}

> **Takma ad kimlik bilgileri gerektirir.** `alias_username` ve `alias_password` değerlerini geçirin veya `FORWARD_EMAIL_ALIAS_USER` ve `FORWARD_EMAIL_ALIAS_PASSWORD` ortam değişkenlerini ayarlayın.

| Araç | API Uç Noktası | Açıklama |
|------|-------------|-------------|
| `listCalendars` | `GET /v1/calendars` | Tüm takvimleri listeleyin |
| `createCalendar` | `POST /v1/calendars` | Yeni bir takvim oluşturun |
| `getCalendar` | `GET /v1/calendars/:id` | Takvim ayrıntılarını alın |
| `updateCalendar` | `PUT /v1/calendars/:id` | Bir takvimi güncelleyin |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Bir takvimi silin |

### Takvim Etkinlikleri — CalDAV (Takma Ad Kimlik Doğrulaması) {#calendar-events--caldav-alias-auth}

> **Takma ad kimlik bilgileri gerektirir.** `alias_username` ve `alias_password` değerlerini geçirin veya `FORWARD_EMAIL_ALIAS_USER` ve `FORWARD_EMAIL_ALIAS_PASSWORD` ortam değişkenlerini ayarlayın.

| Araç | API Uç Noktası | Açıklama |
|------|-------------|-------------|
| `listCalendarEvents` | `GET /v1/calendar-events` | Tüm etkinlikleri listeleyin |
| `createCalendarEvent` | `POST /v1/calendar-events` | Yeni bir etkinlik oluşturun |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | Etkinlik ayrıntılarını alın |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | Bir etkinliği güncelleyin |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Bir etkinliği silin |

### Sieve Komut Dosyaları (API Anahtarı) {#sieve-scripts-api-key}

Bunlar alan adı kapsamlı yolları kullanır ve API anahtarınızla kimlik doğrulaması yapar.

| Araç | API Uç Noktası | Açıklama |
|------|-------------|-------------|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | Bir takma ad için komut dosyalarını listeleyin |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | Yeni bir komut dosyası oluşturun |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Komut dosyası ayrıntılarını alın |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Bir komut dosyasını güncelleyin |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Bir komut dosyasını silin |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Bir komut dosyasını etkinleştirin |

### Sieve Komut Dosyaları (Takma Ad Kimlik Doğrulaması) {#sieve-scripts-alias-auth}

Bunlar takma ad düzeyinde kimlik doğrulamasını kullanır. API anahtarına ihtiyaç duymadan takma ad başına otomasyon için kullanışlıdır.

> **Takma ad kimlik bilgileri gerektirir.** `alias_username` ve `alias_password` değerlerini geçirin veya `FORWARD_EMAIL_ALIAS_USER` ve `FORWARD_EMAIL_ALIAS_PASSWORD` ortam değişkenlerini ayarlayın.

| Araç | API Uç Noktası | Açıklama |
|------|-------------|-------------|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | Komut dosyalarını listeleyin |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | Bir komut dosyası oluşturun |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | Komut dosyası ayrıntılarını alın |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | Bir komut dosyasını güncelleyin |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | Bir komut dosyasını silin |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Bir komut dosyasını etkinleştirin |

### Alan Adı Üyeleri ve Davetiyeleri (API Anahtarı) {#domain-members-and-invites-api-key}

| Araç | API Uç Noktası | Açıklama |
|------|-------------|-------------|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | Bir üyenin rolünü değiştirin |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | Bir üyeyi kaldırın |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | Bekleyen bir daveti kabul edin |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | Birini bir alan adına davet edin |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | Bir daveti iptal edin |

### Tümünü Yakala Parolaları (API Anahtarı) {#catch-all-passwords-api-key}

| Araç | API Uç Noktası | Açıklama |
|------|-------------|-------------|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | Tümünü yakala parolalarını listeleyin |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | Bir tümünü yakala parolası oluşturun |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Bir tümünü yakala parolasını silin |

### Günlükler (API Anahtarı) {#logs-api-key}

| Araç | API Uç Noktası | Açıklama |
|------|-------------|-------------|
| `downloadLogs` | `GET /v1/logs/download` | E-posta teslim günlüklerini indirin |

### Şifrele (Kimlik Doğrulama Yok) {#encrypt-no-auth}

| Araç | API Uç Noktası | Açıklama |
|------|-------------|-------------|
| `encryptRecord` | `POST /v1/encrypt` | Bir DNS TXT kaydını şifreleyin |

Bu araç kimlik doğrulama gerektirmez. `forward-email=user@example.com` gibi yönlendirme kayıtlarını DNS TXT kayıtlarında kullanılmak üzere şifreler.


## 20 Gerçek Dünya Kullanım Durumu {#20-real-world-use-cases}

İşte MCP sunucusunu yapay zeka asistanınızla kullanmanın pratik yolları:

### 1. E-posta Önceliklendirme {#email-triage}

Yapay zekanızdan gelen kutunuzu taramasını ve okunmamış mesajları özetlemesini isteyin. Acil e-postaları işaretleyebilir, gönderene göre kategorize edebilir ve yanıt taslakları oluşturabilir — hepsi doğal dil aracılığıyla. *(Gelen kutusu erişimi için takma ad kimlik bilgileri gerektirir.)*

### 2. Alan Adı Kurulum Otomasyonu {#domain-setup-automation}

Yeni bir alan adı mı kuruyorsunuz? Yapay zekadan alan adını oluşturmasını, takma adlarınızı eklemesini, DNS kayıtlarını doğrulamasını ve SMTP yapılandırmasını test etmesini isteyin. Normalde panolarda tıklayarak 10 dakika süren şey, tek bir konuşma haline gelir.

### 3. Toplu Takma Ad Yönetimi {#bulk-alias-management}

Yeni bir proje için 20 takma ad oluşturmanız mı gerekiyor? Ne istediğinizi açıklayın ve yapay zekanın tekrarlayan işi halletmesine izin verin. Tek seferde takma adlar oluşturabilir, yönlendirme kuralları ayarlayabilir ve parolalar oluşturabilir.

### 4. E-posta Kampanyası İzleme {#email-campaign-monitoring}

Yapay zekanızdan gönderme limitlerini kontrol etmesini, son giden e-postaları listelemesini ve teslim durumu hakkında rapor vermesini isteyin. İşlemsel e-posta sağlığını izlemek için kullanışlıdır.

### 5. Kişi Senkronizasyonu ve Temizliği {#contact-sync-and-cleanup}

CardDAV araçlarını kullanarak tüm kişileri listeleyin, kopyaları bulun, güncel olmayan bilgileri güncelleyin veya sohbete yapıştırdığınız bir e-tablodan toplu kişi oluşturun. *(Takma ad kimlik bilgileri gerektirir.)*

### 6. Takvim Yönetimi {#calendar-management}

Takvimler oluşturun, etkinlikler ekleyin, toplantı saatlerini güncelleyin ve iptal edilen etkinlikleri silin — hepsi konuşma yoluyla. CalDAV araçları, hem takvimler hem de etkinlikler üzerinde tam CRUD desteği sunar. *(Takma ad kimlik bilgileri gerektirir.)*

### 7. Sieve Komut Dosyası Otomasyonu {#sieve-script-automation}

Sieve komut dosyaları güçlüdür ancak sözdizimi karmaşıktır. Yapay zekanızdan sizin için Sieve komut dosyaları yazmasını isteyin: "billing@example.com adresinden gelen tüm e-postaları Faturalama klasörüne filtrele" ifadesi, RFC 5228 spesifikasyonuna dokunmadan çalışan bir komut dosyası haline gelir.

### 8. Ekip Katılımı {#team-onboarding}

Yeni bir ekip üyesi katıldığında, yapay zekadan takma adını oluşturmasını, bir parola oluşturmasını, kimlik bilgileriyle bir hoş geldiniz e-postası göndermesini ve onu bir alan adı üyesi olarak eklemesini isteyin. Tek bir istem, dört API çağrısı.

### 9. Güvenlik Denetimi {#security-auditing}

Yapay zekanızdan tüm alan adlarını listelemesini, DNS doğrulama durumunu kontrol etmesini, takma ad yapılandırmalarını gözden geçirmesini ve doğrulanmamış kayıtlara sahip alan adlarını belirlemesini isteyin. Doğal dilde hızlı bir güvenlik taraması.

### 10. E-posta Yönlendirme Kurulumu {#email-forwarding-setup}

Yeni bir alan adı için e-posta yönlendirme mi kuruyorsunuz? Yapay zekadan alan adını oluşturmasını, yönlendirme takma adlarını eklemesini, DNS kayıtlarını şifrelemesini ve her şeyin doğru yapılandırıldığını doğrulamasını isteyin.

### 11. Gelen Kutusu Arama ve Analizi {#inbox-search-and-analysis}

Belirli e-postaları bulmak için mesaj arama araçlarını kullanın: "Son 30 günde john@example.com adresinden gelen ve ekleri olan tüm e-postaları bul." 15'ten fazla arama parametresi bunu güçlü kılar. *(Takma ad kimlik bilgileri gerektirir.)*

### 12. Klasör Organizasyonu {#folder-organization}

Yapay zekanızdan yeni bir proje için bir klasör yapısı oluşturmasını, mesajları klasörler arasında taşımasını veya artık ihtiyacınız olmayan eski klasörleri temizlemesini isteyin. *(Takma ad kimlik bilgileri gerektirir.)*

### 13. Parola Döngüsü {#password-rotation}

Belirli bir programa göre yeni takma ad parolaları oluşturun. Yapay zekanızdan her takma ad için yeni bir parola oluşturmasını ve yeni kimlik bilgilerini raporlamasını isteyin.

### 14. DNS Kaydı Şifreleme {#dns-record-encryption}

Yönlendirme kayıtlarınızı DNS'e eklemeden önce şifreleyin. `encryptRecord` aracı bunu kimlik doğrulama olmadan halleder — hızlı tek seferlik şifrelemeler için kullanışlıdır.

### 15. Teslimat Günlüğü Analizi {#delivery-log-analysis}

E-posta teslimat günlüklerinizi indirin ve yapay zekadan geri dönme oranlarını analiz etmesini, sorunlu alıcıları belirlemesini veya teslimat sürelerini izlemesini isteyin.

### 16. Çoklu Alan Adı Yönetimi {#multi-domain-management}

Birden çok alan adını yönetiyorsanız, yapay zekadan size bir durum raporu vermesini isteyin: hangi alan adları doğrulanmış, hangilerinde sorun var, her birinin kaç takma adı var ve gönderme limitleri nasıl görünüyor.

### 17. Tümünü Yakala Yapılandırması {#catch-all-configuration}

Herhangi bir adrese e-posta alması gereken alan adları için tümünü yakala parolaları ayarlayın. Yapay zeka bu parolaları sizin için oluşturabilir, listeleyebilir ve yönetebilir.

### 18. Alan Adı Daveti Yönetimi {#domain-invite-management}

Ekip üyelerini alan adlarını yönetmeye davet edin, bekleyen davetleri kontrol edin ve süresi dolmuş olanları temizleyin. Birden çok alan adı yöneticisi olan kuruluşlar için kullanışlıdır.

### 19. S3 Depolama Testi {#s3-storage-testing}

E-posta yedeklemeleri için özel S3 depolama kullanıyorsanız, yapay zekadan bağlantıyı test etmesini ve doğru çalıştığını doğrulamasını isteyin.

### 20. E-posta Taslağı Oluşturma {#email-draft-composition}

Göndermeden önce posta kutunuzda taslak e-postalar oluşturun. Göndermeden önce gözden geçirilmesi gereken e-postaları hazırlamak veya e-posta şablonları oluşturmak için kullanışlıdır. *(Takma ad kimlik bilgileri gerektirir.)*


## Örnek İstemler {#example-prompts}

İşte yapay zeka asistanınızla doğrudan kullanabileceğiniz istemler:

**E-posta gönderme:**
> "hello@mydomain.com adresinden john@example.com adresine 'Yarın Toplantı' konulu ve 'Merhaba John, hala saat 2'de miyiz?' gövdeli bir e-posta gönder."

**Alan adı yönetimi:**
> "Tüm alan adlarımı listele ve hangilerinin doğrulanmamış DNS kayıtlarına sahip olduğunu söyle."

**Takma ad oluşturma:**
> "Kişisel e-postama yönlendiren yeni bir support@mydomain.com takma adı oluştur."

**Gelen kutusu araması (takma ad kimlik bilgileri gerektirir):**
> "Son bir haftadan 'fatura' kelimesini içeren tüm okunmamış e-postaları bul."

**Takvim (takma ad kimlik bilgileri gerektirir):**
> "'İş' adında bir takvim oluştur ve yarın saat 2'de 'Ekip Toplantısı' adında bir toplantı ekle."

**Sieve komut dosyaları:**
> "info@mydomain.com için e-postalara otomatik olarak 'Ulaştığınız için teşekkür ederiz, 24 saat içinde size geri döneceğiz.' yanıtını veren bir Sieve komut dosyası yaz."

**Toplu işlemler:**
> "mydomain.com üzerinde sales@, support@, billing@ ve info@ için takma adlar oluştur, hepsi team@mydomain.com adresine yönlendirilsin."

**Güvenlik kontrolü:**
> "Tüm alan adlarımın DNS ve SMTP doğrulama durumunu kontrol et ve dikkat edilmesi gereken bir şey olup olmadığını söyle."

**Takma ad parolası oluştur:**
> "Gelen kutuma erişebilmem için user@example.com takma adı için bir parola oluştur."


## Ortam Değişkenleri {#environment-variables}

| Değişken | Gerekli | Varsayılan | Açıklama |
|----------|----------|---------|-------------|
| `FORWARD_EMAIL_API_KEY` | Evet | — | Forward Email API anahtarınız (API anahtarı uç noktaları için Temel kimlik doğrulama kullanıcı adı olarak kullanılır) |
| `FORWARD_EMAIL_ALIAS_USER` | Hayır | — | Posta kutusu uç noktaları için takma ad e-posta adresi (örn. `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Hayır | — | Posta kutusu uç noktaları için oluşturulmuş takma ad parolası |
| `FORWARD_EMAIL_API_URL` | Hayır | `https://api.forwardemail.net` | API temel URL'si (kendi kendine barındırılan veya test için) |


## Güvenlik {#security}

MCP sunucusu makinenizde yerel olarak çalışır. Güvenlik şu şekilde çalışır:

* **Kimlik bilgileriniz yerel kalır.** Hem API anahtarınız hem de takma ad kimlik bilgileriniz ortam değişkenlerinden okunur ve HTTP Temel kimlik doğrulaması aracılığıyla API isteklerini doğrulamak için kullanılır. Yapay zeka modeline asla gönderilmezler.
* **stdio aktarımı.** Sunucu, yapay zeka istemcisiyle stdin/stdout üzerinden iletişim kurar. Hiçbir ağ bağlantı noktası açılmaz.
* **Veri depolama yok.** Sunucu durumsuzdur. E-posta verilerinizin hiçbirini önbelleğe almaz, günlüğe kaydetmez veya depolamaz.
* **Açık kaynak.** Tüm kod tabanı [GitHub](https://github.com/forwardemail/mcp-server) üzerindedir. Her satırı denetleyebilirsiniz.


## Programatik Kullanım {#programmatic-usage}

Sunucuyu bir kütüphane olarak da kullanabilirsiniz:

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## Açık Kaynak {#open-source}

Forward Email MCP Sunucusu, BUSL-1.1 lisansı altında [GitHub'da açık kaynaklıdır](https://github.com/forwardemail/mcp-server). Şeffaflığa inanıyoruz. Bir hata bulursanız veya bir özellik isterseniz, [bir sorun açın](https://github.com/forwardemail/mcp-server/issues).

