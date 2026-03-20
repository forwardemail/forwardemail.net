# Forward Email MCP Server {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>ÖZET:</strong> <a href="https://github.com/forwardemail/mcp-server">açık kaynak MCP sunucumuz</a>, Claude, ChatGPT, Cursor ve Windsurf gibi yapay zeka asistanlarının e-postalarınızı, alan adlarınızı, takma adlarınızı, kişilerinizi ve takvimlerinizi doğal dil aracılığıyla yönetmesini sağlar. Tüm 68 API uç noktası MCP araçları olarak sunulur. <code>npx @forwardemail/mcp-server</code> ile yerel olarak çalışır — kimlik bilgileriniz asla makinenizden dışarı çıkmaz.
</p>


## İçindekiler {#table-of-contents}

* [MCP Nedir?](#what-is-mcp)
* [Hızlı Başlangıç](#quick-start)
  * [Bir API Anahtarı Alın](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Diğer MCP İstemcileri](#other-mcp-clients)
* [Kimlik Doğrulama](#authentication)
  * [API Anahtarı Doğrulaması](#api-key-auth)
  * [Takma Ad Doğrulaması](#alias-auth)
  * [Takma Ad Parolası Oluşturma](#generating-an-alias-password)
* [Tüm 68 Araç](#all-68-tools)
  * [Hesap (API Anahtarı veya Takma Ad Doğrulaması)](#account-api-key-or-alias-auth)
  * [Alan Adları (API Anahtarı)](#domains-api-key)
  * [Takma Adlar (API Anahtarı)](#aliases-api-key)
  * [E-postalar — Giden SMTP (API Anahtarı; Gönderme her ikisini destekler)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Mesajlar — IMAP (Takma Ad Doğrulaması)](#messages--imap-alias-auth)
  * [Klasörler — IMAP (Takma Ad Doğrulaması)](#folders--imap-alias-auth)
  * [Kişiler — CardDAV (Takma Ad Doğrulaması)](#contacts--carddav-alias-auth)
  * [Takvimler — CalDAV (Takma Ad Doğrulaması)](#calendars--caldav-alias-auth)
  * [Takvim Etkinlikleri — CalDAV (Takma Ad Doğrulaması)](#calendar-events--caldav-alias-auth)
  * [Sieve Betikleri (API Anahtarı)](#sieve-scripts-api-key)
  * [Sieve Betikleri (Takma Ad Doğrulaması)](#sieve-scripts-alias-auth)
  * [Alan Adı Üyeleri ve Davetler (API Anahtarı)](#domain-members-and-invites-api-key)
  * [Catch-All Parolaları (API Anahtarı)](#catch-all-passwords-api-key)
  * [Kayıtlar (API Anahtarı)](#logs-api-key)
  * [Şifrele (Kimlik Doğrulama Yok)](#encrypt-no-auth)
* [20 Gerçek Dünya Kullanım Senaryosu](#20-real-world-use-cases)
  * [1. E-posta Önceliklendirme](#1-email-triage)
  * [2. Alan Adı Kurulum Otomasyonu](#2-domain-setup-automation)
  * [3. Toplu Takma Ad Yönetimi](#3-bulk-alias-management)
  * [4. E-posta Kampanyası İzleme](#4-email-campaign-monitoring)
  * [5. Kişi Senkronizasyonu ve Temizliği](#5-contact-sync-and-cleanup)
  * [6. Takvim Yönetimi](#6-calendar-management)
  * [7. Sieve Betik Otomasyonu](#7-sieve-script-automation)
  * [8. Takım Oryantasyonu](#8-team-onboarding)
  * [9. Güvenlik Denetimi](#9-security-auditing)
  * [10. E-posta Yönlendirme Kurulumu](#10-email-forwarding-setup)
  * [11. Gelen Kutusu Arama ve Analizi](#11-inbox-search-and-analysis)
  * [12. Klasör Organizasyonu](#12-folder-organization)
  * [13. Parola Döndürme](#13-password-rotation)
  * [14. DNS Kaydı Şifreleme](#14-dns-record-encryption)
  * [15. Teslimat Kayıt Analizi](#15-delivery-log-analysis)
  * [16. Çoklu Alan Adı Yönetimi](#16-multi-domain-management)
  * [17. Catch-All Yapılandırması](#17-catch-all-configuration)
  * [18. Alan Adı Davet Yönetimi](#18-domain-invite-management)
  * [19. S3 Depolama Testi](#19-s3-storage-testing)
  * [20. E-posta Taslak Oluşturma](#20-email-draft-composition)
* [Örnek Komutlar](#example-prompts)
* [Ortam Değişkenleri](#environment-variables)
* [Güvenlik](#security)
* [Programatik Kullanım](#programmatic-usage)
* [Açık Kaynak](#open-source)


## MCP Nedir? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP), Anthropic tarafından oluşturulan ve yapay zeka modellerinin harici araçları güvenli bir şekilde çağırmasını sağlayan açık bir standarttır. API yanıtlarını sohbet penceresine kopyalayıp yapıştırmak yerine, MCP modele hizmetlerinize doğrudan, yapılandırılmış erişim sağlar.

MCP sunucumuz, tüm [Forward Email API](/email-api) — her uç nokta, her parametre — sarmalar ve bunları herhangi bir MCP uyumlu istemcinin kullanabileceği araçlar olarak sunar. Sunucu, stdio taşıma kullanarak makinenizde yerel olarak çalışır. Kimlik bilgileriniz ortam değişkenlerinizde kalır ve asla yapay zeka modeline gönderilmez.


## Hızlı Başlangıç {#quick-start}

### Bir API Anahtarı Alın {#get-an-api-key}
1. [Forward Email hesabınıza](/my-account/domains) giriş yapın.
2. **Hesabım** → **Güvenlik** → **API Anahtarları** bölümüne gidin.
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

Claude Desktop'ı yeniden başlatın. Araç seçicide Forward Email araçlarını görmelisiniz.

> **Not:** `FORWARD_EMAIL_ALIAS_USER` ve `FORWARD_EMAIL_ALIAS_PASSWORD` değişkenleri isteğe bağlıdır ancak posta kutusu araçları (mesajlar, klasörler, kişiler, takvimler) için gereklidir. Detaylar için [Kimlik Doğrulama](#authentication) bölümüne bakın.

### Cursor {#cursor}

Cursor Ayarları → MCP → Sunucu Ekle bölümünü açın:

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

Windsurf Ayarları → MCP → Yukarıdaki yapılandırmayla Sunucu Ekle bölümünü açın.

### Diğer MCP İstemcileri {#other-mcp-clients}

MCP stdio taşımasını destekleyen herhangi bir istemci çalışacaktır. Komut şudur:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```

## Kimlik Doğrulama {#authentication}

Forward Email API, uç noktaya bağlı olarak iki farklı kimlik bilgisi türü ile **HTTP Basic kimlik doğrulaması** kullanır. MCP sunucusu bunu otomatik olarak yönetir — sadece doğru kimlik bilgilerini sağlamanız gerekir.

### API Anahtarı Kimlik Doğrulaması {#api-key-auth}

Çoğu yönetim uç noktası (alan adları, takma adlar, giden e-postalar, günlükler) **API anahtarınızı** Basic auth kullanıcı adı olarak ve boş şifre ile kullanır.

Bu, REST API için kullandığınız aynı API anahtarıdır. `FORWARD_EMAIL_API_KEY` ortam değişkeni ile ayarlayın.

### Takma Ad Kimlik Doğrulaması {#alias-auth}

Posta kutusu uç noktaları (mesajlar, klasörler, kişiler, takvimler, takma ad kapsamlı sieve betikleri) **takma ad kimlik bilgileri** kullanır — kullanıcı adı olarak takma ad e-posta adresi ve şifre olarak oluşturulmuş bir parola.

Bu uç noktalar IMAP, CalDAV ve CardDAV protokolleri aracılığıyla takma ad bazlı verilere erişir. API anahtarı değil, takma ad e-postası ve oluşturulmuş parola gerektirir.

Takma ad kimlik bilgilerini iki şekilde sağlayabilirsiniz:

1. **Ortam değişkenleri** (varsayılan takma ad için önerilir): `FORWARD_EMAIL_ALIAS_USER` ve `FORWARD_EMAIL_ALIAS_PASSWORD` ayarlayın.  
2. **Araç çağrısı başına parametreler**: Herhangi bir takma ad kimlik doğrulamalı araca `alias_username` ve `alias_password` argümanları geçin. Bunlar ortam değişkenlerinin önüne geçer, çoklu takma adlarla çalışırken faydalıdır.

### Takma Ad Parolası Oluşturma {#generating-an-alias-password}

Takma ad kimlik doğrulamalı araçları kullanmadan önce, takma ad için bir parola oluşturmanız gerekir. Bunu `generateAliasPassword` aracıyla veya API üzerinden yapabilirsiniz:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

Yanıt `username` (takma ad e-postası) ve `password` alanlarını içerir. Bunları takma ad kimlik bilgileri olarak kullanın.

> **İpucu:** AI asistanınıza şu şekilde de sorabilirsiniz: *"example.com alan adındaki <user@example.com> takma adı için parola oluştur"* — bu, `generateAliasPassword` aracını çağırır ve kimlik bilgilerini döner.

Aşağıdaki tablo, her araç grubunun hangi kimlik doğrulama yöntemini gerektirdiğini özetlemektedir:

| Araç Grubu                                                    | Kimlik Doğrulama Yöntemi | Kimlik Bilgileri                                            |
| ------------------------------------------------------------- | ------------------------ | ----------------------------------------------------------- |
| Hesap                                                         | API Anahtarı **veya** Takma Ad Kimlik Doğrulaması | Her ikisi de                                              |
| Alan Adları, Takma Adlar, Alan Üyeleri, Davetler, Catch-All Parolaları | API Anahtarı             | `FORWARD_EMAIL_API_KEY`                                     |
| Giden E-postalar (listele, al, sil, limit)                    | API Anahtarı             | `FORWARD_EMAIL_API_KEY`                                     |
| E-posta Gönder                                               | API Anahtarı **veya** Takma Ad Kimlik Doğrulaması | Her ikisi de                                              |
| Mesajlar (IMAP)                                              | Takma Ad Kimlik Doğrulaması | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Klasörler (IMAP)                                             | Takma Ad Kimlik Doğrulaması | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kişiler (CardDAV)                                            | Takma Ad Kimlik Doğrulaması | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Takvimler (CalDAV)                                           | Takma Ad Kimlik Doğrulaması | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Takvim Etkinlikleri (CalDAV)                                | Takma Ad Kimlik Doğrulaması | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieve Betikleri (alan adı kapsamlı)                          | API Anahtarı             | `FORWARD_EMAIL_API_KEY`                                     |
| Sieve Betikleri (takma ad kapsamlı)                          | Takma Ad Kimlik Doğrulaması | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Günlükler                                                    | API Anahtarı             | `FORWARD_EMAIL_API_KEY`                                     |
| Şifreleme                                                   | Yok                      | Kimlik bilgisi gerekmez                                     |
## Tüm 68 Araç {#all-68-tools}

Her araç doğrudan bir [Forward Email API](/email-api) uç noktasına karşılık gelir. Parametreler API dokümanlarındaki ile aynı isimleri kullanır. Yetkilendirme yöntemi her bölüm başlığında belirtilmiştir.

### Hesap (API Anahtarı veya Takma Ad Yetkilendirmesi) {#account-api-key-or-alias-auth}

API anahtarı yetkilendirmesi ile, bunlar kullanıcı hesap bilgilerinizi döner. Takma ad yetkilendirmesi ile, depolama kotası ve ayarlar dahil olmak üzere takma ad/posta kutusu bilgilerini döner.

| Araç             | API Uç Noktası       | Açıklama                     |
| ---------------- | -------------------- | ---------------------------- |
| `getAccount`     | `GET /v1/account`    | Hesap bilgilerinizi alın     |
| `updateAccount`  | `PUT /v1/account`    | Hesap ayarlarınızı güncelleyin |

### Alan Adları (API Anahtarı) {#domains-api-key}

| Araç                  | API Uç Noktası                                     | Açıklama                   |
| --------------------- | ------------------------------------------------- | -------------------------- |
| `listDomains`         | `GET /v1/domains`                                 | Tüm alan adlarınızı listeleyin |
| `createDomain`        | `POST /v1/domains`                                | Yeni bir alan adı ekleyin  |
| `getDomain`           | `GET /v1/domains/:domain_id`                      | Alan adı detaylarını alın  |
| `updateDomain`        | `PUT /v1/domains/:domain_id`                      | Alan adı ayarlarını güncelleyin |
| `deleteDomain`        | `DELETE /v1/domains/:domain_id`                   | Bir alan adını kaldırın    |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records`      | DNS kayıtlarını doğrulayın |
| `verifySmtpRecords`   | `GET /v1/domains/:domain_id/verify-smtp`         | SMTP yapılandırmasını doğrulayın |
| `testS3Connection`    | `POST /v1/domains/:domain_id/test-s3-connection` | Özel S3 depolamayı test edin |

### Takma Adlar (API Anahtarı) {#aliases-api-key}

| Araç                    | API Uç Noktası                                                      | Açıklama                                |
| ----------------------- | ------------------------------------------------------------------ | -------------------------------------- |
| `listAliases`           | `GET /v1/domains/:domain_id/aliases`                              | Bir alan adı için takma adları listeleyin |
| `createAlias`           | `POST /v1/domains/:domain_id/aliases`                             | Yeni bir takma ad oluşturun             |
| `getAlias`              | `GET /v1/domains/:domain_id/aliases/:alias_id`                    | Takma ad detaylarını alın               |
| `updateAlias`           | `PUT /v1/domains/:domain_id/aliases/:alias_id`                    | Bir takma adı güncelleyin                |
| `deleteAlias`           | `DELETE /v1/domains/:domain_id/aliases/:alias_id`                 | Bir takma adı silin                     |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Takma ad yetkilendirmesi için IMAP/SMTP şifresi oluşturun |

### E-postalar — Giden SMTP (API Anahtarı; Gönderme her ikisini de destekler) {#emails--outbound-smtp-api-key-send-supports-both}

| Araç            | API Uç Noktası            | Yetkilendirme          | Açıklama                     |
| --------------- | ------------------------- | ---------------------- | ---------------------------- |
| `sendEmail`     | `POST /v1/emails`         | API Anahtarı veya Takma Ad Yetkilendirmesi | SMTP üzerinden e-posta gönderin |
| `listEmails`    | `GET /v1/emails`          | API Anahtarı           | Giden e-postaları listeleyin  |
| `getEmail`      | `GET /v1/emails/:id`      | API Anahtarı           | E-posta detaylarını ve durumunu alın |
| `deleteEmail`   | `DELETE /v1/emails/:id`   | API Anahtarı           | Kuyrukta bekleyen bir e-postayı silin |
| `getEmailLimit` | `GET /v1/emails/limit`    | API Anahtarı           | Gönderim limitinizi kontrol edin |

`sendEmail` aracı `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` ve `attachments` parametrelerini kabul eder. Bu, `POST /v1/emails` uç noktası ile aynıdır.

### Mesajlar — IMAP (Takma Ad Yetkilendirmesi) {#messages--imap-alias-auth}

> **Takma ad kimlik bilgileri gerektirir.** `alias_username` ve `alias_password` geçirin veya `FORWARD_EMAIL_ALIAS_USER` ve `FORWARD_EMAIL_ALIAS_PASSWORD` ortam değişkenlerini ayarlayın.
| Araç            | API Uç Noktası              | Açıklama                           |
| --------------- | --------------------------- | --------------------------------- |
| `listMessages`  | `GET /v1/messages`          | Bir posta kutusundaki mesajları listele ve ara |
| `createMessage` | `POST /v1/messages`         | Taslak oluştur veya mesaj yükle    |
| `getMessage`    | `GET /v1/messages/:id`      | ID ile mesaj al                   |
| `updateMessage` | `PUT /v1/messages/:id`      | Bayrakları güncelle (okundu, yıldızlı, vb.)    |
| `deleteMessage` | `DELETE /v1/messages/:id`   | Mesaj sil                        |

`listMessages` aracı, `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` ve `has_attachment` dahil 15'ten fazla arama parametresini destekler. Tam liste için [API docs](/email-api) sayfasına bakınız.

### Klasörler — IMAP (Alias Yetkilendirmesi) {#folders--imap-alias-auth}

> **Alias kimlik bilgileri gerektirir.** `alias_username` ve `alias_password` geçin veya `FORWARD_EMAIL_ALIAS_USER` ve `FORWARD_EMAIL_ALIAS_PASSWORD` ortam değişkenlerini ayarlayın.

| Araç           | API Uç Noktası             | Açıklama              |
| -------------- | -------------------------- | --------------------- |
| `listFolders`  | `GET /v1/folders`          | Tüm posta kutusu klasörlerini listele |
| `createFolder` | `POST /v1/folders`         | Yeni klasör oluştur    |
| `getFolder`    | `GET /v1/folders/:id`      | Klasör detaylarını al  |
| `updateFolder` | `PUT /v1/folders/:id`      | Klasör adını değiştir  |
| `deleteFolder` | `DELETE /v1/folders/:id`   | Klasör sil            |

### Kişiler — CardDAV (Alias Yetkilendirmesi) {#contacts--carddav-alias-auth}

> **Alias kimlik bilgileri gerektirir.** `alias_username` ve `alias_password` geçin veya `FORWARD_EMAIL_ALIAS_USER` ve `FORWARD_EMAIL_ALIAS_PASSWORD` ortam değişkenlerini ayarlayın.

| Araç            | API Uç Noktası              | Açıklama          |
| --------------- | --------------------------- | ----------------- |
| `listContacts`  | `GET /v1/contacts`          | Tüm kişileri listele |
| `createContact` | `POST /v1/contacts`         | Yeni kişi oluştur  |
| `getContact`    | `GET /v1/contacts/:id`      | Kişi detaylarını al |
| `updateContact` | `PUT /v1/contacts/:id`      | Kişiyi güncelle    |
| `deleteContact` | `DELETE /v1/contacts/:id`   | Kişiyi sil        |

### Takvimler — CalDAV (Alias Yetkilendirmesi) {#calendars--caldav-alias-auth}

> **Alias kimlik bilgileri gerektirir.** `alias_username` ve `alias_password` geçin veya `FORWARD_EMAIL_ALIAS_USER` ve `FORWARD_EMAIL_ALIAS_PASSWORD` ortam değişkenlerini ayarlayın.

| Araç             | API Uç Noktası             | Açıklama           |
| ---------------- | -------------------------- | ------------------ |
| `listCalendars`  | `GET /v1/calendars`        | Tüm takvimleri listele |
| `createCalendar` | `POST /v1/calendars`       | Yeni takvim oluştur |
| `getCalendar`    | `GET /v1/calendars/:id`    | Takvim detaylarını al |
| `updateCalendar` | `PUT /v1/calendars/:id`    | Takvimi güncelle    |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Takvimi sil        |

### Takvim Etkinlikleri — CalDAV (Alias Yetkilendirmesi) {#calendar-events--caldav-alias-auth}

> **Alias kimlik bilgileri gerektirir.** `alias_username` ve `alias_password` geçin veya `FORWARD_EMAIL_ALIAS_USER` ve `FORWARD_EMAIL_ALIAS_PASSWORD` ortam değişkenlerini ayarlayın.

| Araç                  | API Uç Noktası                     | Açıklama        |
| --------------------- | --------------------------------- | --------------- |
| `listCalendarEvents`  | `GET /v1/calendar-events`          | Tüm etkinlikleri listele |
| `createCalendarEvent` | `POST /v1/calendar-events`         | Yeni etkinlik oluştur |
| `getCalendarEvent`    | `GET /v1/calendar-events/:id`      | Etkinlik detaylarını al |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id`      | Etkinliği güncelle  |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id`   | Etkinliği sil      |

### Sieve Scriptleri (API Anahtarı) {#sieve-scripts-api-key}

Bunlar alan adı kapsamlı yollar kullanır ve API anahtarınızla kimlik doğrulaması yapar.

| Araç                  | API Uç Noktası                                                              | Açıklama               |
| --------------------- | --------------------------------------------------------------------------- | --------------------- |
| `listSieveScripts`    | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                        | Bir alias için scriptleri listele |
| `createSieveScript`   | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                       | Yeni script oluştur    |
| `getSieveScript`      | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`             | Script detaylarını al  |
| `updateSieveScript`   | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`             | Scripti güncelle       |
| `deleteSieveScript`   | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`          | Scripti sil            |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate`   | Scripti etkinleştir    |
### Elek Scriptleri (Alias Kimlik Doğrulama) {#sieve-scripts-alias-auth}

Bunlar alias seviyesinde kimlik doğrulama kullanır. API anahtarına ihtiyaç duymadan alias başına otomasyon için faydalıdır.

> **Alias kimlik bilgileri gerektirir.** `alias_username` ve `alias_password` geçirin veya `FORWARD_EMAIL_ALIAS_USER` ve `FORWARD_EMAIL_ALIAS_PASSWORD` ortam değişkenlerini ayarlayın.

| Araç                          | API Uç Noktası                                | Açıklama           |
| ----------------------------- | --------------------------------------------- | ------------------ |
| `listSieveScriptsAliasAuth`   | `GET /v1/sieve-scripts`                       | Scriptleri listele  |
| `createSieveScriptAliasAuth`  | `POST /v1/sieve-scripts`                      | Bir script oluştur  |
| `getSieveScriptAliasAuth`     | `GET /v1/sieve-scripts/:script_id`            | Script detaylarını al |
| `updateSieveScriptAliasAuth`  | `PUT /v1/sieve-scripts/:script_id`            | Bir script güncelle |
| `deleteSieveScriptAliasAuth`  | `DELETE /v1/sieve-scripts/:script_id`         | Bir script sil      |
| `activateSieveScriptAliasAuth`| `POST /v1/sieve-scripts/:script_id/activate` | Bir script etkinleştir |

### Alan Üyesi ve Davetler (API Anahtarı) {#domain-members-and-invites-api-key}

| Araç                 | API Uç Noktası                                      | Açıklama                  |
| -------------------- | --------------------------------------------------- | ------------------------- |
| `updateDomainMember`  | `PUT /v1/domains/:domain_id/members/:member_id`     | Üyenin rolünü değiştir    |
| `removeDomainMember`  | `DELETE /v1/domains/:domain_id/members/:member_id`  | Üyeyi kaldır              |
| `acceptDomainInvite`  | `GET /v1/domains/:domain_id/invites`                | Bekleyen daveti kabul et  |
| `createDomainInvite`  | `POST /v1/domains/:domain_id/invites`               | Birini domaine davet et   |
| `removeDomainInvite`  | `DELETE /v1/domains/:domain_id/invites`             | Daveti iptal et           |

### Catch-All Parolalar (API Anahtarı) {#catch-all-passwords-api-key}

| Araç                     | API Uç Noktası                                                   | Açıklama                   |
| ------------------------ | ---------------------------------------------------------------- | -------------------------- |
| `listCatchAllPasswords`  | `GET /v1/domains/:domain_id/catch-all-passwords`                 | Catch-all parolaları listele |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords`                | Catch-all parolası oluştur  |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id`    | Catch-all parolası sil      |

### Kayıtlar (API Anahtarı) {#logs-api-key}

| Araç           | API Uç Noktası           | Açıklama                      |
| -------------- | ------------------------ | ----------------------------- |
| `downloadLogs` | `GET /v1/logs/download`  | E-posta teslimat kayıtlarını indir |

### Şifrele (Kimlik Doğrulama Yok) {#encrypt-no-auth}

| Araç            | API Uç Noktası      | Açıklama                   |
| --------------- | ------------------- | -------------------------- |
| `encryptRecord` | `POST /v1/encrypt`  | Bir DNS TXT kaydını şifrele |

Bu araç kimlik doğrulama gerektirmez. DNS TXT kayıtlarında kullanılmak üzere `forward-email=user@example.com` gibi yönlendirme kayıtlarını şifreler.


## 20 Gerçek Dünya Kullanım Senaryosu {#20-real-world-use-cases}

İşte MCP sunucusunu AI asistanınızla kullanmanın pratik yolları:

### 1. E-posta Önceliklendirme {#1-email-triage}

AI'nizden gelen kutunuzu taramasını ve okunmamış mesajları özetlemesini isteyin. Acil e-postaları işaretleyebilir, gönderenlere göre kategorize edebilir ve yanıt taslakları oluşturabilir — hepsi doğal dil ile. *(Gelen kutusuna erişim için alias kimlik bilgileri gerektirir.)*

### 2. Alan Adı Kurulum Otomasyonu {#2-domain-setup-automation}

Yeni bir alan adı mı kuruyorsunuz? AI'den alan adını oluşturmasını, alias'larınızı eklemesini, DNS kayıtlarını doğrulamasını ve SMTP yapılandırmasını test etmesini isteyin. Normalde panellerde 10 dakika süren tıklamalar tek bir konuşmaya dönüşür.

### 3. Toplu Alias Yönetimi {#3-bulk-alias-management}

Yeni bir proje için 20 alias mı oluşturmanız gerekiyor? İhtiyacınızı anlatın ve AI tekrar eden işleri halletsin. Alias oluşturabilir, yönlendirme kuralları ayarlayabilir ve parolalar oluşturabilir.
### 4. E-posta Kampanyası İzleme {#4-email-campaign-monitoring}

AI’nizden gönderim limitlerini kontrol etmesini, son gönderilen e-postaları listelemesini ve teslimat durumunu raporlamasını isteyin. İşlem e-postalarının sağlığını izlemek için faydalıdır.

### 5. Kişi Senkronizasyonu ve Temizliği {#5-contact-sync-and-cleanup}

CardDAV araçlarını kullanarak tüm kişileri listeleyin, kopyaları bulun, güncel olmayan bilgileri güncelleyin veya sohbet penceresine yapıştırdığınız bir elektronik tablodan toplu kişi oluşturun. *(Takma ad kimlik bilgileri gerektirir.)*

### 6. Takvim Yönetimi {#6-calendar-management}

Takvimler oluşturun, etkinlikler ekleyin, toplantı saatlerini güncelleyin ve iptal edilen etkinlikleri silin — hepsi sohbet yoluyla. CalDAV araçları takvimler ve etkinlikler üzerinde tam CRUD desteği sunar. *(Takma ad kimlik bilgileri gerektirir.)*

### 7. Sieve Script Otomasyonu {#7-sieve-script-automation}

Sieve scriptleri güçlüdür ancak sözdizimi karmaşıktır. AI’nizden sizin için Sieve scriptleri yazmasını isteyin: "Tüm <billing@example.com> adresinden gelen e-postaları Billing klasörüne filtrele" ifadesi, RFC 5228 spesifikasyonuna dokunmadan çalışan bir script haline gelir.

### 8. Takım Katılımı {#8-team-onboarding}

Yeni bir takım üyesi katıldığında, AI’dan onların takma adını oluşturmasını, bir şifre üretmesini, kimlik bilgileriyle birlikte hoş geldin e-postası göndermesini ve onları alan adı üyesi olarak eklemesini isteyin. Bir komut, dört API çağrısı.

### 9. Güvenlik Denetimi {#9-security-auditing}

AI’nizden tüm alan adlarını listelemesini, DNS doğrulama durumunu kontrol etmesini, takma ad yapılandırmalarını gözden geçirmesini ve doğrulanmamış kayıtları olan alan adlarını tespit etmesini isteyin. Doğal dil ile hızlı bir güvenlik taraması.

### 10. E-posta Yönlendirme Kurulumu {#10-email-forwarding-setup}

Yeni bir alan adı için e-posta yönlendirmesi mi kuruyorsunuz? AI’dan alan adını oluşturmasını, yönlendirme takma adlarını eklemesini, DNS kayıtlarını şifrelemesini ve her şeyin doğru yapılandırıldığını doğrulamasını isteyin.

### 11. Gelen Kutusu Arama ve Analiz {#11-inbox-search-and-analysis}

Mesaj arama araçlarını kullanarak belirli e-postaları bulun: "Son 30 gün içinde <john@example.com> adresinden gelen ve eki olan tüm e-postaları bul." 15+ arama parametresi ile bu çok güçlüdür. *(Takma ad kimlik bilgileri gerektirir.)*

### 12. Klasör Organizasyonu {#12-folder-organization}

AI’nizden yeni bir proje için klasör yapısı oluşturmasını, mesajları klasörler arasında taşımasını veya artık ihtiyacınız olmayan eski klasörleri temizlemesini isteyin. *(Takma ad kimlik bilgileri gerektirir.)*

### 13. Şifre Döndürme {#13-password-rotation}

Takma adlar için yeni şifreler belirli aralıklarla oluşturun. AI’nizden her takma ad için yeni bir şifre oluşturmasını ve yeni kimlik bilgilerini raporlamasını isteyin.

### 14. DNS Kaydı Şifreleme {#14-dns-record-encryption}

Yönlendirme kayıtlarınızı DNS’e eklemeden önce şifreleyin. `encryptRecord` aracı bunu kimlik doğrulama olmadan yapar — hızlı tek seferlik şifrelemeler için kullanışlıdır.

### 15. Teslimat Günlüğü Analizi {#15-delivery-log-analysis}

E-posta teslimat günlüklerinizi indirin ve AI’dan bounce oranlarını analiz etmesini, sorunlu alıcıları tespit etmesini veya teslimat sürelerini takip etmesini isteyin.

### 16. Çoklu Alan Adı Yönetimi {#16-multi-domain-management}

Birden fazla alan adı yönetiyorsanız, AI’dan size bir durum raporu vermesini isteyin: hangi alan adları doğrulanmış, hangilerinde sorun var, her birinin kaç takma adı var ve gönderim limitleri nasıl görünüyor.

### 17. Catch-All Yapılandırması {#17-catch-all-configuration}

Herhangi bir adrese e-posta alması gereken alan adları için catch-all şifreleri ayarlayın. AI bunları oluşturabilir, listeleyebilir ve yönetebilir.

### 18. Alan Adı Davet Yönetimi {#18-domain-invite-management}

Takım üyelerini alan adı yönetimi için davet edin, bekleyen davetleri kontrol edin ve süresi dolanları temizleyin. Çoklu alan adı yöneticisi olan organizasyonlar için faydalıdır.

### 19. S3 Depolama Testi {#19-s3-storage-testing}

E-posta yedeklemeleri için özel S3 depolama kullanıyorsanız, AI’dan bağlantıyı test etmesini ve düzgün çalıştığını doğrulamasını isteyin.

### 20. E-posta Taslak Oluşturma {#20-email-draft-composition}

Posta kutunuzda e-posta taslakları oluşturun, göndermeden önce inceleme için faydalıdır veya e-posta şablonları oluşturmak için kullanılır. *(Takma ad kimlik bilgileri gerektirir.)*


## Örnek Komutlar {#example-prompts}

AI asistanınızla doğrudan kullanabileceğiniz komutlar:

**E-posta gönderme:**

> "<hello@mydomain.com> adresinden <john@example.com> adresine 'Yarın Toplantı' konusu ve 'Merhaba John, saat 14:00 için hala planımız var mı?' içeriğiyle bir e-posta gönder."
**Alan yönetimi:**

> "Tüm alan adlarımı listele ve doğrulanmamış DNS kayıtları olanları bana söyle."

**Takma ad oluşturma:**

> "Kişisel e-postama yönlendiren <support@mydomain.com> adlı yeni bir takma ad oluştur."

**Gelen kutusu araması (takma ad kimlik bilgileri gerektirir):**

> "Son bir haftadan 'fatura' geçen tüm okunmamış e-postaları bul."

**Takvim (takma ad kimlik bilgileri gerektirir):**

> "'İş' adlı bir takvim oluştur ve yarın saat 14:00'te 'Takım Toplantısı' adlı bir toplantı ekle."

**Sieve betikleri:**

> "<info@mydomain.com> için 'İlginiz için teşekkürler, 24 saat içinde size geri döneceğiz.' şeklinde otomatik yanıt veren bir Sieve betiği yaz."

**Toplu işlemler:**

> "mydomain.com üzerinde sales@, support@, billing@ ve info@ için takma adlar oluştur, hepsi <team@mydomain.com> adresine yönlendirilsin."

**Güvenlik kontrolü:**

> "Tüm alan adlarımın DNS ve SMTP doğrulama durumunu kontrol et ve dikkat edilmesi gereken bir şey varsa bana bildir."

**Takma ad şifresi oluştur:**

> "<user@example.com> takma adı için gelen kutuma erişebilmem için bir şifre oluştur."


## Environment Variables {#environment-variables}

| Variable                       | Required | Default                        | Description                                                                    |
| ------------------------------ | -------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `FORWARD_EMAIL_API_KEY`        | Yes      | —                              | Your Forward Email API key (used as Basic auth username for API-key endpoints) |
| `FORWARD_EMAIL_ALIAS_USER`     | No       | —                              | Alias email address for mailbox endpoints (e.g. `user@example.com`)            |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | No       | —                              | Generated alias password for mailbox endpoints                                 |
| `FORWARD_EMAIL_API_URL`        | No       | `https://api.forwardemail.net` | API base URL (for self-hosted or testing)                                      |


## Security {#security}

MCP sunucusu yerel olarak makinenizde çalışır. Güvenlik şöyle işler:

* **Kimlik bilgileriniz yerel kalır.** Hem API anahtarınız hem de takma ad kimlik bilgileriniz ortam değişkenlerinden okunur ve API isteklerini HTTP Basic auth ile doğrulamak için kullanılır. Hiçbir zaman AI modeline gönderilmezler.
* **stdio taşıması.** Sunucu AI istemcisi ile stdin/stdout üzerinden iletişim kurar. Ağ portları açılmaz.
* **Veri depolama yok.** Sunucu durumsuzdur. E-posta verilerinizi önbelleğe almaz, kaydetmez veya loglamaz.
* **Açık kaynak.** Tüm kod tabanı [GitHub](https://github.com/forwardemail/mcp-server) üzerinde mevcuttur. Her satırı denetleyebilirsiniz.


## Programmatic Usage {#programmatic-usage}

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


## Open Source {#open-source}

Forward Email MCP Sunucusu [GitHub'da açık kaynak](https://github.com/forwardemail/mcp-server) olarak BUSL-1.1 lisansı altında sunulmaktadır. Şeffaflığa inanıyoruz. Bir hata bulursanız veya bir özellik isterseniz, [bir sorun açın](https://github.com/forwardemail/mcp-server/issues).
