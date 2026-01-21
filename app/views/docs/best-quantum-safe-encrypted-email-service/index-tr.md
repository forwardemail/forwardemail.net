# Kuantum Dirençli E-posta: E-postanızı güvende tutmak için şifreli SQLite posta kutularını nasıl kullanıyoruz? {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="" class="rounded-lg" />

## İçindekiler {#table-of-contents}

* [Önsöz](#foreword)
* [E-posta servis sağlayıcı karşılaştırması](#email-service-provider-comparison)
* [Nasıl çalışır?](#how-does-it-work)
* [Teknolojiler](#technologies)
  * [Veritabanları](#databases)
  * [Güvenlik](#security)
  * [Posta kutuları](#mailboxes)
  * [Eşzamanlılık](#concurrency)
  * [Yedeklemeler](#backups)
  * [Aramak](#search)
  * [Projeler](#projects)
  * [Sağlayıcılar](#providers)
* [Düşünceler](#thoughts)
  * [İlkeler](#principles)
  * [Deneyler](#experiments)
  * [Alternatif eksikliği](#lack-of-alternatives)
  * [E-postayı İlet'i deneyin](#try-out-forward-email)

## Önsöz {#foreword}

> \[!IMPORTANT]
> E-posta hizmetimiz [%100 açık kaynaklı](https://github.com/forwardemail) olup, güvenli ve şifreli SQLite posta kutuları aracılığıyla gizlilik odaklıdır.

[IMAP desteği](/faq#do-you-support-receiving-email-with-imap)'ı piyasaya sürene kadar kalıcı veri depolama ihtiyaçlarımız için MongoDB'yi kullanıyorduk.

Bu teknoloji harika ve biz bunu bugün hala kullanıyoruz; ancak MongoDB ile beklemede şifreleme özelliğinden yararlanmak için Digital Ocean veya Mongo Atlas gibi MongoDB Enterprise sunan bir sağlayıcı kullanmanız veya bir kurumsal lisans için ödeme yapmanız (ve sonrasında satış ekibinin gecikmesiyle uğraşmanız) gerekiyor.

[E-postayı İlet](https://forwardemail.net) ekibimiz, IMAP posta kutuları için geliştirici dostu, ölçeklenebilir, güvenilir ve şifreli bir depolama çözümüne ihtiyaç duyuyordu. Açık kaynaklı geliştiriciler olarak, bekleme durumunda şifreleme özelliğini kullanmak için lisans ücreti ödemeniz gereken bir teknolojiyi kullanmak [ilkelerimiz](#principles)'in beklentilerini karşılamıyordu; bu yüzden bu ihtiyaçları karşılamak için deneyler yaptık, araştırmalar yaptık ve sıfırdan yeni bir çözüm geliştirdik.

Posta kutularınızı paylaşmak için ortak bir veritabanı kullanmak yerine, posta kutularınızı ayrı ayrı saklıyor ve şifrenizle (ki bu şifre yalnızca sizdedir) şifreliyoruz. **E-posta hizmetimiz o kadar güvenlidir ki, şifrenizi unutursanız posta kutunuzu kaybedersiniz** (ve çevrimdışı yedeklemelerle kurtarmanız veya baştan başlamanız gerekir).

Aşağıda [e-posta servis sağlayıcılarının karşılaştırılması](#email-service-provider-comparison), [hizmetimiz nasıl çalışır](#how-does-it-work), [teknoloji yığınımız](#technologies) ve daha fazlasıyla ilgili derinlemesine incelememizi okumaya devam edin.

## E-posta servis sağlayıcı karşılaştırması {#email-service-provider-comparison}

Bireysel olarak şifrelenmiş SQLite posta kutularını depolayan, sınırsız alan adı, takma ad ve kullanıcı sunan ve giden SMTP, IMAP ve POP3 desteği sağlayan %100 açık kaynaklı ve gizliliğe odaklı tek e-posta servis sağlayıcısıyız:

**Diğer e-posta sağlayıcılarının aksine, Forward Email ile alan adı veya takma ad bazında depolama ücreti ödemenize gerek yoktur.** Depolama, tüm hesabınızda paylaşılır; yani birden fazla özel alan adınız ve her birinde birden fazla takma adınız varsa, sizin için mükemmel bir çözüm olabiliriz. Dilerseniz alan adı veya takma ad bazında depolama sınırlamaları uygulayabileceğinizi unutmayın.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">E-posta Hizmeti Karşılaştırmasını Okuyun <i class="fa fa-search-plus"></i></a>

## Nasıl çalışır? {#how-does-it-work}

1. Apple Mail, Thunderbird, Gmail veya Outlook gibi e-posta istemcinizi kullanarak, kullanıcı adınızı ve şifrenizi kullanarak güvenli [IMAP](/faq#do-you-support-receiving-email-with-imap) sunucularımıza bağlanın:

* Kullanıcı adınız, `hello@example.com` gibi alan adınızdaki tam takma adınızdır.
* Şifreniz rastgele oluşturulur ve yalnızca <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adlarım</a> <i class="fa fa-angle-right"></i> Takma Adlarım</i>'dan <strong class="text-success"><i class="fa fa-key"></i> Şifre Oluştur</strong>'a tıkladığınızda 30 saniye boyunca görüntülenir.

2. Bağlandıktan sonra, e-posta istemciniz posta kutunuzu senkronize tutmak için [IMAP protokol komutları](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) adresini IMAP sunucumuza gönderecektir. Bu, taslak e-postaları yazmayı ve depolamayı ve yapabileceğiniz diğer işlemleri (örneğin, bir e-postayı Önemli olarak etiketlemek veya Spam/İstenmeyen Posta olarak işaretlemek) içerir.

3. Posta değişim sunucuları (genellikle "MX" sunucuları olarak bilinir), gelen yeni e-postaları alır ve posta kutunuza depolar. Bu durum gerçekleştiğinde, e-posta istemciniz bilgilendirilir ve posta kutunuzu senkronize eder. Posta değişim sunucularımız, e-postalarınızı bir veya daha fazla alıcıya ([web kancaları](/faq#do-you-support-webhooks) dahil) iletebilir, e-postalarınızı şifreli IMAP depolama alanınızda depolayabilir veya **veya her ikisini de** yapabilir!

> \[!TIP]
> Daha fazla bilgi edinmek ister misiniz? [e-posta yönlendirme nasıl kurulur](/faq#how-do-i-get-started-and-set-up-email-forwarding), [posta değişim servisimiz nasıl çalışır](/faq#how-does-your-email-forwarding-system-work)'i okuyun veya [rehberlerimiz](/guides)'yi görüntüleyin.

4. Perde arkasında, güvenli e-posta depolama tasarımımız posta kutularınızı şifrelenmiş ve yalnızca sizin tarafınızdan erişilebilir tutmak için iki şekilde çalışır:

* Bir göndericiden sizin adınıza yeni bir e-posta alındığında, posta değişim sunucularımız sizin adınıza özel, geçici ve şifrelenmiş bir posta kutusuna yazar.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

* E-posta istemcinizle IMAP sunucumuza bağlandığınızda, parolanız bellekte şifrelenir ve posta kutunuza okumak ve yazmak için kullanılır. Posta kutunuz yalnızca bu parola ile okunabilir ve yazılabilir. Bu parolaya sahip tek kişi siz olduğunuz için, posta kutunuza erişirken **yalnızca siz** okuyabilir ve yazabilirsiniz. E-posta istemciniz bir sonraki e-posta sorgulama veya senkronizasyon girişiminde bulunduğunda, yeni iletileriniz bu geçici posta kutusundan aktarılacak ve verdiğiniz parola kullanılarak gerçek posta kutusu dosyanızda saklanacaktır. Bu geçici posta kutusunun daha sonra temizlenip silineceğini ve iletilerin yalnızca parola korumalı posta kutunuzda saklanacağını unutmayın.

* **IMAP'ye bağlıysanız (örneğin, Apple Mail veya Thunderbird gibi bir e-posta istemcisi kullanıyorsanız), geçici disk depolama alanına yazmamıza gerek kalmaz. Bunun yerine, bellek içi şifrelenmiş IMAP parolanız alınır ve kullanılır. Gerçek zamanlı olarak, size bir mesaj iletilmeye çalışıldığında, tüm IMAP sunucularına sizin için etkin bir oturum olup olmadığını soran bir WebSocket isteği göndeririz (bu, alma kısmıdır) ve ardından bu şifrelenmiş bellek içi parolayı iletiriz. Bu sayede geçici bir posta kutusuna yazmamıza gerek kalmaz, şifrelenmiş parolanızı kullanarak gerçek şifrelenmiş posta kutunuza yazabiliriz.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: You connect to IMAP server using an email client.
         IMAP->>SQLite: Transfer message from temporary mailbox to your alias' mailbox.
         Note over IMAP,SQLite: Your alias' mailbox is only available in-memory using IMAP password.
         SQLite->>IMAP: Retrieves messages as requested by email client.
         IMAP->>You: Success!
     ```

5. [Şifrelenmiş posta kutularınızın yedekleri](#backups) günlük olarak oluşturulur. İstediğiniz zaman yeni bir yedekleme talep edebilir veya en son yedeklemeyi <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar</a> bölümünden indirebilirsiniz. Başka bir e-posta hizmetine geçmeye karar verirseniz, posta kutularınızı ve yedeklerinizi istediğiniz zaman kolayca taşıyabilir, indirebilir, dışa aktarabilir ve temizleyebilirsiniz.

## Teknolojileri {#technologies}

### Veritabanları {#databases}

Diğer olası veritabanı depolama katmanlarını inceledik, ancak hiçbiri SQLite kadar gereksinimlerimizi karşılamadı:

| Veritabanı | Beklemede şifreleme | [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Posta Kutuları | Lisans | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **__HÜCRE_BAĞLANTISI_0__** :star: | :white_check_mark: Evet [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) ile | :beyaz_onay_işareti: | :white_check_mark: Kamu Malı | :beyaz_onay_işareti: |
| [MongoDB](https://www.mongodb.com/) | :x: __HÜCRE_BAĞLANTISI_0__ | :x: İlişkisel veritabanı | :x: AGPL ve `SSPL-1.0` | :X: |
| [rqlite](https://github.com/rqlite/rqlite) | :x: __HÜCRE_BAĞLANTISI_0__ | :x: İlişkisel veritabanı | :white_check_mark: __HÜCRE_KODU_0__ | :X: |
| [dqlite](https://dqlite.io/) | :x: __HÜCRE_BAĞLANTISI_0__ | :x: __HÜCRE_BAĞLANTISI_0__ | :white_check_mark: __HÜCRE_KODU_0__ | :X: |
| [PostgreSQL](https://www.postgresql.org/) | :white_check_mark: [Yes](https://www.postgresql.org/docs/current/encryption-options.html) | :x: İlişkisel veritabanı | :white_check_mark: `PostgreSQL` (`BSD` veya `MIT`'ye benzer) | :X: |
| [MariaDB](https://mariadb.com/) | :white_check_mark: [For InnoDB only](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) | :x: İlişkisel veritabanı | :white_check_mark: `GPLv2` ve `BUSL-1.1` | :X: |
| [CockroachDB](https://www.cockroachlabs.com/product/) | :x: __HÜCRE_BAĞLANTISI_0__ | :x: İlişkisel veritabanı | :x: `BUSL-1.1` ve diğerleri | :X: |

> Yukarıdaki tabloda [çeşitli SQLite veritabanı depolama seçeneklerini karşılaştıran blog yazısı](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) bulunmaktadır.

### Güvenlik {#security}

Posta kutularında her zaman [beklemede şifreleme](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [aktarım sırasında şifreleme](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [HTTPS üzerinden DNS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") şifrelemesini kullanıyoruz: :tangerine: [mandalina](https://tangeri.ne) ve [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Ayrıca, belirteç tabanlı iki faktörlü kimlik doğrulama ([aracı saldırıları](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)'e karşı şüpheli olan SMS'in aksine), kök erişimi devre dışı bırakılmış döndürülmüş SSH anahtarları, kısıtlı IP adresleri aracılığıyla sunuculara özel erişim ve daha fazlasını kullanıyoruz.

[kötü hizmetçi saldırısı](https://en.wikipedia.org/wiki/Evil_maid_attack) veya üçüncü taraf bir satıcıdan gelen kötü niyetli bir çalışan durumunda, **posta kutunuz yalnızca oluşturduğunuz parolayla açılabilir**. İçiniz rahat olsun, Cloudflare, DataPacket, Digital Ocean ve Vultr gibi SOC Tip 2 şikayet sunucu sağlayıcılarımız dışında hiçbir üçüncü taraf satıcıya güvenmiyoruz.

Amacımız mümkün olduğunca az [tek bir arıza noktası](https://en.wikipedia.org/wiki/Single_point_of_failure) olmasıdır.

### Posta Kutuları {#mailboxes}

> **tldr;** IMAP sunucularımız, posta kutularınızın her biri için ayrı ayrı şifrelenmiş SQLite veritabanları kullanır.

[SQLite son derece popüler bir](https://www.sqlite.org/mostdeployed.html) gömülü veritabanı – şu anda telefonunuzda ve bilgisayarınızda çalışıyor – [ve neredeyse tüm büyük teknolojiler tarafından kullanılır](https://www.sqlite.org/famous.html).

Örneğin, şifrelenmiş sunucularımızda `linux@example.com`, `info@example.com`, `hello@example.com` vb. için bir SQLite veritabanı posta kutusu bulunur; her biri için bir `.sqlite` veritabanı dosyası bulunur. Veritabanı dosyalarına e-posta adreslerini de dahil etmiyoruz; bunun yerine, posta kutusunun kime ait olduğunu veya hangi e-posta adresinin altında olduğunu paylaşmayan BSON ObjectID ve benzersiz UUID'ler kullanıyoruz (örneğin, `353a03f21e534321f5d6e267.sqlite`).

Bu veritabanlarının her biri, yalnızca sizin sahip olduğunuz parolanız kullanılarak ([sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/))) şifrelenir. Bu, posta kutularınızın ayrı ayrı şifrelendiği, kendi içinde tutarlı ([korumalı](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) ve taşınabilir olduğu anlamına gelir.

SQLite'ı aşağıdaki [PRAGMA](https://www.sqlite.org/pragma.html) ile ince ayarladık:

| `PRAGMA` | Amaç |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20` | [ChaCha20-Poly1305 SQLite database encryption](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Daha fazla bilgi için [Projects](#projects) altındaki `better-sqlite3-multiple-ciphers` ifadesine bakın. |
| `key="****************"` | Bu, e-posta istemcinizin IMAP bağlantısı üzerinden sunucumuza iletilen, şifresi çözülmüş, yalnızca bellekte saklanan parolanızdır. Her okuma ve yazma oturumu için yeni veritabanı örnekleri oluşturulur ve kapatılır (koruma ve izolasyonu sağlamak amacıyla). |
| `journal_model=WAL` | Yazma öncesi günlüğü ("[WAL](https://www.sqlite.org/wal.html)") [which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode). |
| `busy_timeout=5000` | Yazma kilidi hatalarını önler [while other writes are taking place](https://litestream.io/tips/#busy-timeout). |
| `synchronous=NORMAL` | [without data corruption risk](https://litestream.io/tips/#synchronous-pragma) işlemlerinin dayanıklılığını artırır. |
| `foreign_keys=ON` | Yabancı anahtar referanslarının (örneğin bir tablodan diğerine ilişki) zorunlu kılınmasını sağlar. [By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html), ancak doğrulama ve veri bütünlüğü için etkinleştirilmelidir. |
| `encoding='UTF-8'` | Geliştiricinin akıl sağlığını garantilemek için kullanılacak [Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding). |

> Diğer tüm varsayılanlar [resmi PRAGMA belgeleri](https://www.sqlite.org/pragma.html#pragma_auto_vacuum)'da belirtildiği gibi SQLite'tan gelir.

### Eşzamanlılık {#concurrency}

> **tldr;** Şifrelenmiş SQLite posta kutularınıza eş zamanlı okuma ve yazma işlemleri için `WebSocket` kullanıyoruz.

#### {#reads}'i okur

Telefonunuzdaki e-posta istemciniz `imap.forwardemail.net` adresini Digital Ocean IP adreslerimizden birine çözümleyebilir; masaüstü istemciniz ise tamamen farklı bir [sağlayıcı](#providers) adresinden ayrı bir IP adresine çözümleyebilir.

E-posta istemcinizin hangi IMAP sunucusuna bağlandığından bağımsız olarak, bağlantının veritabanınızdan %100 doğrulukla gerçek zamanlı okuma yapmasını istiyoruz. Bu, WebSockets aracılığıyla yapılır.

#### {#writes}'i yazar

Veritabanınıza yazmak biraz farklıdır; çünkü SQLite gömülü bir veritabanıdır ve posta kutunuz varsayılan olarak tek bir dosyada bulunur.

Aşağıda `litestream`, `rqlite` ve `dqlite` gibi seçenekleri inceledik; ancak bunların hiçbiri gereksinimlerimizi karşılamadı.

Yazma öncesi günlük kaydı ("[WAL](https://www.sqlite.org/wal.html)") etkinleştirilmiş halde yazma işlemlerini gerçekleştirmek için, bunu yapmaktan yalnızca bir sunucunun ("Birincil") sorumlu olduğundan emin olmamız gerekir. [WAL](https://www.sqlite.org/wal.html) eşzamanlılığı önemli ölçüde hızlandırır ve bir yazıcıya ve birden fazla okuyucuya izin verir.

Birincil sunucu, şifreli posta kutularını içeren bağlı birimlere sahip veri sunucularında çalışır. Dağıtım açısından, `imap.forwardemail.net`'ın arkasındaki tüm bireysel IMAP sunucularını ikincil sunucular ("İkincil") olarak düşünebilirsiniz.

[WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) ile iki yönlü iletişimi gerçekleştiriyoruz:

* Birincil sunucular, [ws](https://github.com/websockets/ws)'ın `WebSocketServer` sunucusunun bir örneğini kullanır.
* İkincil sunucular, [ws](https://github.com/websockets/ws)'nin `WebSocket` istemcisinin [websocket-söz-verildiği-gibi](https://github.com/vitalets/websocket-as-promised) ve [websocket'ı yeniden bağlama](https://github.com/opensumi/reconnecting-websocket) ile sarmalanmış bir örneğini kullanır. Bu iki sarmalayıcı, `WebSocket`'nın yeniden bağlanmasını ve belirli veritabanı yazma işlemleri için veri gönderip alabilmesini sağlar.

### Yedeklemeler {#backups}

> **tldr;** Şifrelenmiş posta kutularınızın yedekleri günlük olarak alınır. Ayrıca, istediğiniz zaman <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar'dan anında yeni bir yedekleme talep edebilir veya en son yedeklemeyi indirebilirsiniz.

Yedeklemeler için, IMAP komut işleme sırasında her gün, bellek içi bir IMAP bağlantısından şifrelenmiş parolanızı kullanan SQLite `VACUUM INTO` komutunu çalıştırıyoruz. Mevcut bir yedekleme algılanmazsa veya dosyadaki [SHA-256](https://en.wikipedia.org/wiki/SHA-2) özeti en son yedeklemeye göre değişmişse, yedeklemeler saklanır.

Yerleşik `backup` komutu yerine `VACUUM INTO` komutunu kullandığımızı unutmayın; çünkü `backup` komutu sırasında bir sayfa değiştirilirse, baştan başlamak zorunda kalır. `VACUUM INTO` komutu anlık görüntü alır. Daha fazla bilgi için [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) ve [Hacker Haberleri](https://news.ycombinator.com/item?id=31387556) hakkındaki yorumlara bakın.

Ayrıca `backup` yerine `VACUUM INTO` kullanıyoruz çünkü `backup` komutu, `rekey` çağrılana kadar veritabanını kısa bir süreliğine şifrelenmemiş halde bırakacaktır (bilgi için şu GitHub [Yorum](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927)'e bakın).

İkincil, `WebSocket` bağlantısı üzerinden Birincil'e yedeklemeyi yürütmesi talimatını verecek ve Birincil daha sonra bunu yapması için komutu alacak ve ardından şunları yapacaktır:

1. Şifrelenmiş posta kutunuza bağlanın.
2. Bir yazma kilidi edinin.
3. `wal_checkpoint(PASSIVE)` aracılığıyla bir WAL kontrol noktası çalıştırın.
4. `VACUUM INTO` SQLite komutunu çalıştırın.
5. Kopyalanan dosyanın şifrelenmiş parola ile açılabildiğinden emin olun (güvenlik/sahte parola koruması).
6. Depolama için Cloudflare R2'ye (veya belirtilmişse kendi sağlayıcınıza) yükleyin.

<!--
7. Elde edilen yedekleme dosyasını `gzip` ile sıkıştırın.
8. Depolama için Cloudflare R2'ye (veya belirtilmişse kendi sağlayıcınıza) yükleyin.
-->

Posta kutularınızın şifrelendiğini unutmayın; WebSocket iletişimi için IP kısıtlamalarımız ve diğer kimlik doğrulama önlemlerimiz olsa da, kötü niyetli bir aktörün saldırısı durumunda, WebSocket yükü IMAP parolanıza sahip olmadığı sürece veritabanınızı açamayacağından emin olabilirsiniz.

Şu anda posta kutusu başına yalnızca bir yedekleme saklanıyor, ancak gelecekte belirli bir zamanda kurtarma ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)") sunabiliriz.

### {#search}'i arayın

IMAP sunucularımız karmaşık sorgular, düzenli ifadeler ve daha fazlasıyla `SEARCH` komutunu destekler.

Hızlı arama performansı [FTS5](https://www.sqlite.org/fts5.html) ve [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex) sayesindedir.

`Date` değerlerini, [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) aracılığıyla (eşitlik karşılaştırmalarının düzgün çalışması için UTC zaman dilimiyle) SQLite posta kutularında [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) dizeleri olarak saklıyoruz.

Ayrıca arama sorgularında yer alan tüm özellikler için endeksler saklanır.

### Projeleri {#projects}

Kaynak kodumuzda ve geliştirme sürecimizde kullandığımız projeleri özetleyen bir tablo aşağıdadır (alfabetik olarak sıralanmıştır):

| Proje | Amaç |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/) | Tüm sunucu filomuzu kolaylıkla yönetmek, ölçeklendirmek ve sürdürmek için DevOps otomasyon platformu. |
| [Bree](https://github.com/breejs/bree) | Node.js ve JavaScript için cron, dates, ms, later ve kullanıcı dostu desteği olan iş zamanlayıcısı. |
| [Cabin](https://github.com/cabinjs/cabin) | Güvenlik ve gizliliği göz önünde bulunduran, geliştirici dostu JavaScript ve Node.js günlükleme kütüphanesi. |
| [Lad](https://github.com/ladjs/lad) | MVC ve daha fazlasıyla tüm mimarimizi ve mühendislik tasarımımızı destekleyen Node.js framework'ü. |
| [MongoDB](https://www.mongodb.com/) | Posta kutularının dışındaki tüm verileri (örneğin hesabınız, ayarlarınız, alan adlarınız ve takma ad yapılandırmalarınız) depolamak için kullandığımız NoSQL veritabanı çözümü. |
| [Mongoose](https://github.com/Automattic/mongoose) | Tüm yığınımızda kullandığımız MongoDB nesne belge modellemesi ("ODM"). **SQLite ile Mongoose** kullanmaya devam etmemizi sağlayan özel yardımcılar yazdık: tada: |
| [Node.js](https://nodejs.org/en) | Node.js, tüm sunucu süreçlerimizi çalıştıran açık kaynaklı, platformlar arası JavaScript çalışma zamanı ortamıdır. |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | E-posta göndermek, bağlantı oluşturmak ve daha fazlası için Node.js paketi. Bu projenin resmi sponsoruyuz. |
| [Redis](https://redis.io/) | Önbelleğe alma, yayınlama/abone olma kanalları ve HTTPS üzerinden DNS istekleri için bellek içi veritabanı. |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | SQLite için tüm veritabanı dosyalarının şifrelenmesine (yazma öncesi günlük ("[WAL](https://www.sqlite.org/wal.html)"), günlük, geri alma, ... dahil) izin veren şifreleme uzantısı. |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio) | Geliştirme posta kutularını test etmek, indirmek ve görüntülemek için görsel SQLite düzenleyicisi (bunu da kullanabilirsiniz). |
| [SQLite](https://www.sqlite.org/about.html) | Ölçeklenebilir, kendi kendine yeten, hızlı ve dayanıklı IMAP depolama için gömülü veritabanı katmanı. |
| [Spam Scanner](https://github.com/spamscanner/spamscanner) | Node.js anti-spam, e-posta filtreleme ve kimlik avı önleme aracı ([Spam Assassin](https://spamassassin.apache.org/) ve [rspamd](https://github.com/rspamd/rspamd)'e alternatifimiz). |
| [Tangerine](https://tangeri.ne) | Node.js ile HTTPS üzerinden DNS istekleri ve Redis ile önbellekleme – küresel tutarlılığı ve çok daha fazlasını sağlar. |
| [Thunderbird](https://www.thunderbird.net/) | Geliştirme ekibimiz bunu **Forward Email ile kullanılacak tercih edilen e-posta istemcisi** olarak kullanıyor (ve öneriyor). |
| [UTM](https://github.com/utmapp/UTM) | Geliştirme ekibimiz, farklı e-posta istemcilerini (paralel olarak) IMAP ve SMTP sunucularımızla test etmek amacıyla iOS ve macOS için bu sanal makineleri oluşturuyor. |
| [Ubuntu](https://ubuntu.com/download/server) | Tüm altyapımızı destekleyen modern, açık kaynaklı Linux tabanlı sunucu işletim sistemi. |
| [WildDuck](https://github.com/nodemailer/wildduck) | IMAP sunucu kütüphanesi – [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) ve [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md) hakkındaki notlarına bakın. |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Node.js'in SQLite3 ile programlı olarak etkileşime girmesini sağlayan hızlı ve basit API kütüphanesi. |
| [email-templates](https://github.com/forwardemail/email-templates) | Özel e-postalar (örneğin hesap bildirimleri ve daha fazlası) oluşturmak, önizlemek ve göndermek için geliştirici dostu e-posta çerçevesi. |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced) | Mongo tarzı sözdizimini kullanan SQL sorgu oluşturucu. Bu, veritabanından bağımsız bir yaklaşımla tüm yığında Mongo tarzında yazmaya devam edebileceğimiz için geliştirme ekibimize zaman kazandırıyor. **Ayrıca, sorgu parametreleri kullanılarak SQL enjeksiyon saldırılarından kaçınmaya da yardımcı oluyor.** |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector) | Mevcut veritabanı şeması hakkında bilgi çıkarmak için SQL yardımcı programı. Bu, tüm dizinlerin, tabloların, sütunların, kısıtlamaların ve daha fazlasının geçerli olduğunu ve olması gerektiği gibi `1:1` olduğunu kolayca doğrulamamızı sağlar. Hatta veritabanı şemalarında değişiklik yapıldığında yeni sütunlar ve dizinler eklemek için otomatik yardımcılar bile yazdık (son derece ayrıntılı hata uyarılarıyla birlikte). |
| [knex](https://github.com/knex/knex) | Sadece veritabanı geçişleri ve `knex-schema-inspector` aracılığıyla şema doğrulaması için kullandığımız SQL sorgu oluşturucusu. |
| [mandarin](https://github.com/ladjs/mandarin) | [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest) kullanılarak Markdown desteğiyle otomatik [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) cümle çevirisi. |
| [mx-connect](https://github.com/zone-eu/mx-connect) | MX sunucuları ile bağlantı kurmak ve hataları çözmek için Node.js paketi. |
| [pm2](https://github.com/Unitech/pm2) | Dahili yük dengeleyiciye sahip Node.js üretim süreci yöneticisi (performans için [fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214)). |
| [smtp-server](https://github.com/nodemailer/smtp-server) | SMTP sunucu kütüphanesi – bunu posta değişim ("MX") ve giden SMTP sunucularımız için kullanıyoruz. |
| [ImapTest](https://www.imapwiki.org/ImapTest) | IMAP sunucularını kıyaslama ölçütlerine ve RFC spesifikasyonu IMAP protokolü uyumluluğuna göre test etmek için kullanışlı bir araç. Bu proje, [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) ekibi (Temmuz 2002'den beri aktif bir açık kaynaklı IMAP ve POP3 sunucusu) tarafından oluşturulmuştur. IMAP sunucumuzu bu araçla kapsamlı bir şekilde test ettik. |

> [GitHub'daki kaynak kodumuz](https://github.com/forwardemail)'da kullandığımız diğer projeleri bulabilirsiniz.

### Sağlayıcıları {#providers}

| Sağlayıcı | Amaç |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/) | DNS sağlayıcısı, sağlık kontrolleri, yük dengeleyiciler ve [Cloudflare R2](https://developers.cloudflare.com/r2) kullanılarak yedekleme depolaması. |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Özel sunucu barındırma ve yönetilen veritabanları. |
| [Vultr](https://www.vultr.com/?ref=7429848) | Adanmış sunucu barındırma. |
| [DataPacket](https://www.datapacket.com) | Adanmış sunucu barındırma. |

## Düşünceler {#thoughts}

### İlkeleri {#principles}

Forward Email şu prensiplere göre tasarlanmıştır:

1. Her zaman geliştirici dostu, güvenlik ve gizlilik odaklı ve şeffaf olun.
2. [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [On İki Faktör](https://12factor.net/), [Occam'ın usturası](https://en.wikipedia.org/wiki/Occam%27s_razor) ve [köpek maması](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)'ye uyun.
3. Dağınık, önyüklemeli ve [ramen-kârlı](http://www.paulgraham.com/ramenprofitable.html) geliştiricilerini hedefleyin.

### Deneyler {#experiments}

> **kısacası;** Sonuç olarak S3 uyumlu nesne depolama ve/veya Sanal Tabloların kullanımı performans nedenlerinden dolayı teknik olarak mümkün değildir ve bellek kısıtlamaları nedeniyle hataya açıktır.

Yukarıda tartıştığımız gibi nihai SQLite çözümümüze ulaşana kadar birkaç deney yaptık.

Bunlardan biri, [rclone]() ve SQLite'ı S3 uyumlu bir depolama katmanıyla birlikte kullanmayı denemekti.

Bu deney, rclone, SQLite ve [VFS](https://en.wikipedia.org/wiki/Virtual_file_system) kullanımını çevreleyen uç durumları daha iyi anlamamızı ve keşfetmemizi sağladı:

* `--vfs-cache-mode writes` işaretini rclone ile etkinleştirirseniz, okumalar sorunsuz olur, ancak yazmalar önbelleğe alınır.
* Dünya çapında dağıtılmış birden fazla IMAP sunucunuz varsa, tek bir yazıcı ve birden fazla dinleyiciniz (örneğin, bir yayınla/abone ol yaklaşımı) olmadığı sürece önbellek bunlar arasında kapalı olacaktır.
* Bu inanılmaz derecede karmaşıktır ve bu tür ek karmaşıklıkların eklenmesi, daha fazla tekil hata noktasına yol açacaktır.
* S3 uyumlu depolama sağlayıcıları kısmi dosya değişikliklerini desteklemez; bu da `.sqlite` dosyasında yapılan herhangi bir değişikliğin, veritabanının tamamen değiştirilmesine ve yeniden yüklenmesine neden olacağı anlamına gelir.
* `rsync` gibi başka çözümler de mevcuttur, ancak bunlar önceden yazma günlüğü ("[WAL](https://www.sqlite.org/wal.html)") desteğine odaklanmadığından, Litestream'i incelemeye karar verdik. Neyse ki şifreleme kullanımımız zaten [WAL](https://www.sqlite.org/wal.html) dosyalarını bizim için şifreliyor, bu nedenle bunun için Litestream'e güvenmemize gerek yok. Ancak Litestream'in üretim kullanımı için henüz yeterli güvene sahip olmadığımızı düşünüyoruz ve bu konuda aşağıda birkaç notumuz var.
* `--vfs-cache-mode writes` seçeneğinin (yazma işlemleri için `rclone` yerine SQLite kullanmanın *tek* yolu) kullanılması, tüm veritabanını sıfırdan belleğe kopyalamaya çalışacaktır. 10 GB'lık tek bir posta kutusunu yönetmek sorun değil, ancak aşırı yüksek depolama alanına sahip birden fazla posta kutusunu yönetmek, IMAP sunucularının bellek sınırlamaları ve `ENOMEM` hataları, segmentasyon hataları ve veri bozulmasıyla karşılaşmasına neden olacaktır. * Verileri S3 uyumlu bir depolama katmanında canlı tutmak için SQLite [Sanal Tablolar](https://www.sqlite.org/vtab.html) (örneğin [s3db](https://github.com/jrhy/s3db) kullanarak) kullanmaya çalışırsanız, birkaç sorunla daha karşılaşırsınız:
* S3 API uç noktalarının HTTP `.sqlite`0, `.sqlite`1, `.sqlite`2 ve `.sqlite`3 yöntemleriyle etkilenmesi gerekeceğinden, okuma ve yazma işlemleri son derece yavaş olacaktır.
* Geliştirme testleri, fiber internette 500.000-1 milyon+ kaydın, S3 uyumlu sağlayıcılara yazma ve okuma kapasitesiyle sınırlı olduğunu göstermiştir. Örneğin, geliştiricilerimiz hem sıralı SQL `.sqlite`5 ifadelerini hem de büyük miktarda veriyi toplu olarak yazan ifadeleri gerçekleştirmek için `.sqlite`4 döngülerini çalıştırdı. Her iki durumda da performans şaşırtıcı derecede yavaştı.
* Sanal tablolar **indekslere**, `.sqlite`6 ifadelerine ve `.sqlite`7 `.sqlite`8'e sahip olamaz; bu da veri miktarına bağlı olarak 1-2 dakika veya daha fazla gecikmeye yol açar.
* Nesneler şifrelenmemiş olarak depolandı ve yerel şifreleme desteği mevcut değil.
* Ayrıca, kavramsal ve teknik olarak önceki madde işaretine benzer olan `.sqlite`9'u kullanmayı da araştırdık (bu nedenle aynı sorunları yaşıyor). Bir olasılık, `rsync`1 (şu anda yukarıdaki çözümümüzde kullandığımız) gibi `rsync`2 aracılığıyla şifrelemeyle sarılmış özel bir `rsync`0 derlemesi kullanmak olabilir.
* Bir diğer olası yaklaşım ise `rsync`3'ü kullanmaktı, ancak bunun 32 GB'lık bir sınırlaması var ve karmaşık derleme ve geliştirme sorunları gerektirecektir. * `rsync`4 ifadeleri gereklidir (bu nedenle Sanal Tabloların kullanımı tamamen devre dışıdır). `rsync`6 ile olan kancamızın düzgün çalışması için `rsync`5 ifadelerine ihtiyacımız var; bu, verilerin bozulmamasını ve alınan satırların `rsync`7 şema tanımlarımıza (kısıtlama, değişken türü ve keyfi veri doğrulaması dahil) göre geçerli belgelere dönüştürülebilmesini sağlar.
* Açık kaynak topluluğundaki SQLite ile ilgili S3 uyumlu projelerin neredeyse tamamı Python'dadır (yığınımızın %100'ü için kullandığımız JavaScript değil).
* `rsync`8 (bkz. `rsync`9) gibi sıkıştırma kütüphaneleri umut verici görünüyor, ancak __PROTECTED_LINK_189__0. __PROTECTED_LINK_189__1, __PROTECTED_LINK_189__2, __PROTECTED_LINK_189__3, __PROTECTED_LINK_189__4, __PROTECTED_LINK_189__5 ve __PROTECTED_LINK_189__6 gibi veri türlerinde uygulama tarafı sıkıştırma daha temiz ve daha kolay bir yaklaşım olacaktır (ve ayrıca geçişi de daha kolaydır, çünkü bir __PROTECTED_LINK_189__7 bayrağı veya sütunu depolayabiliriz - hatta sıkıştırma için __PROTECTED_LINK_189__8 __PROTECTED_LINK_189__9 veya sıkıştırma olmaması için __PROTECTED_LINK_190__0'ı veritabanı meta verileri olarak kullanabiliriz).
* Neyse ki, IMAP sunucu depolamamızda ek çoğaltma önleme özelliği zaten uygulanmıştır - bu nedenle aynı eki olan her ileti, ekin bir kopyasını tutmaz - bunun yerine, bir posta kutusunda birden fazla ileti ve iş parçacığı için tek bir ek depolanır (ve daha sonra yabancı bir referans kullanılır). * SQLite replikasyon ve yedekleme çözümü olan Litestream projesi oldukça umut verici ve büyük olasılıkla gelecekte de kullanacağız.
* Yazar(lar)ı itibarsızlaştırmak istemem - çünkü çalışmalarını ve açık kaynaklı yazılımlara katkılarını on yıldan uzun süredir seviyoruz - ancak gerçek dünyadaki kullanımdan, __PROTECTED_LINK_190__1 ve __PROTECTED_LINK_190__2 olduğu anlaşılıyor.
* Yedekleme geri yüklemesinin sorunsuz ve basit olması gerekiyor. __PROTECTED_LINK_190__3 ve __PROTECTED_LINK_190__4 içeren MongoDB gibi bir çözüm kullanmak sadece sıkıcı değil, aynı zamanda zaman alıcı ve yapılandırma karmaşıklığı da içeriyor.
* SQLite veritabanları bunu basitleştiriyor (tek bir dosya).
* Kullanıcıların posta kutularını istedikleri zaman alıp bırakabilecekleri bir çözüm tasarlamak istedik.
* __PROTECTED_LINK_190__5'e basit Node.js komutları ve disk depolama alanından kalıcı olarak silinmesi. * Benzer şekilde, kullanıcılar için anlık görüntüleri ve yedekleri kolayca kaldırmak amacıyla HTTP __PROTECTED_LINK_190__6 ile S3 uyumlu bir API kullanabiliriz.
* SQLite en basit, en hızlı ve en uygun maliyetli çözümdü.

### Alternatif eksikliği {#lack-of-alternatives}

Bildiğimiz kadarıyla, başka hiçbir e-posta hizmeti bu şekilde tasarlanmamıştır ve açık kaynaklı değildir.

Bunun, mevcut e-posta servislerinin [spagetti kodu](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti: ile üretimde eski teknolojiye sahip olmasından kaynaklandığını düşünüyoruz.

Mevcut e-posta servis sağlayıcılarının çoğu, hatta hepsi, ya kapalı kaynaklıdır ya da açık kaynaklı olduklarını iddia ederler, **ama gerçekte yalnızca ön yüzleri açık kaynaklıdır.**

**E-postanın en hassas kısmı** (gerçek depolama/IMAP/SMTP etkileşimi) **tamamen arka uçta (sunucu) yapılır ve ön uçta (istemci) *değildir*.**

### E-postayı İlet'i deneyin {#try-out-forward-email}

Bugün <https://forwardemail.net>! :rocket: adresinden kaydolun