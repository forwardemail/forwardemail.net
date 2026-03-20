# Kuantum Dirençli E-posta: E-postanızı Güvende Tutmak İçin Şifrelenmiş SQLite Posta Kutularını Nasıl Kullanıyoruz {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Kuantum-güvenli şifrelenmiş e-posta servisi illüstrasyonu" class="rounded-lg" />


## İçindekiler {#table-of-contents}

* [Önsöz](#foreword)
* [E-posta servis sağlayıcı karşılaştırması](#email-service-provider-comparison)
* [Nasıl çalışır](#how-does-it-work)
* [Teknolojiler](#technologies)
  * [Veritabanları](#databases)
  * [Güvenlik](#security)
  * [Posta kutuları](#mailboxes)
  * [Eşzamanlılık](#concurrency)
  * [Yedeklemeler](#backups)
  * [Arama](#search)
  * [Projeler](#projects)
  * [Sağlayıcılar](#providers)
* [Düşünceler](#thoughts)
  * [Prensipler](#principles)
  * [Deneyler](#experiments)
  * [Alternatif eksikliği](#lack-of-alternatives)
  * [Forward Email'i deneyin](#try-out-forward-email)


## Önsöz {#foreword}

> \[!IMPORTANT]
> E-posta servisimiz [%100 açık kaynak](https://github.com/forwardemail) ve güvenli, şifrelenmiş SQLite posta kutuları sayesinde gizlilik odaklıdır.

[IMAP desteğini](/faq#do-you-support-receiving-email-with-imap) başlatana kadar kalıcı veri depolama ihtiyaçlarımız için MongoDB kullanıyorduk.

Bu teknoloji harika ve hâlâ kullanıyoruz – ancak MongoDB ile verilerin şifrelenmiş olarak saklanabilmesi için Digital Ocean veya Mongo Atlas gibi MongoDB Enterprise sunan bir sağlayıcı kullanmanız gerekiyor – ya da kurumsal lisans için ödeme yapmanız (ve ardından satış ekibiyle gecikmelerle uğraşmanız) gerekiyor.

[Forward Email](https://forwardemail.net) ekibimiz, IMAP posta kutuları için geliştirici dostu, ölçeklenebilir, güvenilir ve şifrelenmiş bir depolama çözümüne ihtiyaç duyuyordu. Açık kaynak geliştiriciler olarak, şifrelenmiş veri saklama özelliği için lisans ücreti ödemeniz gereken bir teknoloji kullanmak [prensiplerimize](#principles) aykırıydı – bu yüzden deneyler yaptık, araştırdık ve bu ihtiyaçları karşılamak için sıfırdan yeni bir çözüm geliştirdik.

Posta kutularınızı depolamak için paylaşılan bir veritabanı kullanmak yerine, posta kutularınızı şifrenizle (sadece sizin bildiğiniz) ayrı ayrı saklıyor ve şifreliyoruz.  **E-posta servisimiz o kadar güvenlidir ki, şifrenizi unutursanız posta kutunuzu kaybedersiniz** (ve çevrimdışı yedeklerle kurtarmanız veya baştan başlamanız gerekir).

Aşağıda [e-posta servis sağlayıcı karşılaştırması](#email-service-provider-comparison), [servisimizin nasıl çalıştığı](#how-does-it-work), [teknoloji yığınımız](#technologies) ve daha fazlası ile derinlemesine incelemeye devam edin.


## E-posta servis sağlayıcı karşılaştırması {#email-service-provider-comparison}

Bireysel olarak şifrelenmiş SQLite posta kutuları depolayan, sınırsız alan adı, takma ad ve kullanıcı sunan, ayrıca giden SMTP, IMAP ve POP3 desteği olan tek %100 açık kaynak ve gizlilik odaklı e-posta servis sağlayıcısıyız:

**Diğer e-posta sağlayıcılarının aksine, Forward Email ile alan adı veya takma ad başına depolama için ödeme yapmanız gerekmez.** Depolama tüm hesabınızda paylaşılır – yani birden fazla özel alan adınız ve her birinde birden fazla takma adınız varsa, biz sizin için mükemmel çözümdür. İsterseniz alan adı veya takma ad bazında depolama sınırları koyabilirsiniz.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">E-posta Servis Karşılaştırmasını Oku <i class="fa fa-search-plus"></i></a>


## Nasıl çalışır {#how-does-it-work}

1. Apple Mail, Thunderbird, Gmail veya Outlook gibi e-posta istemcinizi kullanarak, kullanıcı adınız ve şifrenizle güvenli [IMAP](/faq#do-you-support-receiving-email-with-imap) sunucularımıza bağlanırsınız:

   * Kullanıcı adınız, `hello@example.com` gibi alan adınızla birlikte tam takma adınızdır.
   * Şifreniz rastgele oluşturulur ve <strong class="text-success"><i class="fa fa-key"></i> Şifre Oluştur</strong> butonuna tıkladığınızda sadece 30 saniye boyunca size gösterilir. Bu buton <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar altında bulunur.
2. Bağlandıktan sonra, e-posta istemciniz posta kutunuzu senkronize tutmak için [IMAP protokol komutları](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) gönderecektir. Bu, taslak e-postaların yazılması ve saklanması ile yapabileceğiniz diğer işlemleri (örneğin bir e-postayı Önemli olarak etiketlemek veya bir e-postayı Spam/İstenmeyen Posta olarak işaretlemek) içerir.

3. Posta değişim sunucuları (genellikle "MX" sunucuları olarak bilinir) yeni gelen e-postaları alır ve posta kutunuza kaydeder. Bu olduğunda, e-posta istemciniz bilgilendirilir ve posta kutunuzu senkronize eder. Posta değişim sunucularımız e-postanızı bir veya daha fazla alıcıya (dahil olmak üzere [webhooklar](/faq#do-you-support-webhooks)) iletebilir, e-postanızı bizimle şifrelenmiş IMAP depolamanızda saklayabilir, **veya her ikisini de yapabilir!**

   > \[!TIP]
   > Daha fazlasını öğrenmek ister misiniz? [E-posta yönlendirmeyi nasıl kuracağınızı](/faq#how-do-i-get-started-and-set-up-email-forwarding), [posta değişim hizmetimizin nasıl çalıştığını](/faq#how-does-your-email-forwarding-system-work) okuyun veya [rehberlerimize](/guides) göz atın.

4. Sahne arkasında, güvenli e-posta depolama tasarımımız posta kutularınızı şifreli tutmak ve yalnızca sizin erişebilmeniz için iki şekilde çalışır:

   * Gönderen tarafından size yeni posta alındığında, posta değişim sunucularımız sizin için bireysel, geçici ve şifrelenmiş bir posta kutusuna yazar.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Takma adınız için gelen mesaj alındı (ör. you@yourdomain.com).
         MX->>SQLite: Mesaj geçici posta kutusuna kaydedildi.
         Note over MX,SQLite: Yapılandırılmış diğer alıcılara ve webhooklara iletilir.
         MX->>Sender: Başarılı!
     ```

   * E-posta istemcinizle IMAP sunucumuza bağlandığınızda, şifreniz bellekte şifrelenir ve posta kutunuzu okumak ve yazmak için kullanılır. Posta kutunuz yalnızca bu şifre ile okunabilir ve yazılabilir. Bu şifreye yalnızca sizin sahip olduğunuzu unutmayın, bu nedenle posta kutunuza erişirken **sadece siz** okuyabilir ve yazabilirsiniz. E-posta istemciniz bir sonraki sefer posta kontrolü veya senkronizasyon yapmaya çalıştığında, yeni mesajlar bu geçici posta kutusundan alınır ve sağladığınız şifre kullanılarak gerçek posta kutusu dosyanıza kaydedilir. Bu geçici posta kutusunun daha sonra temizlenip silindiğini ve böylece yalnızca şifre korumalı posta kutunuzun mesajları içerdiğini unutmayın.

   * **Eğer IMAP'e bağlıysanız (örneğin Apple Mail veya Thunderbird gibi bir e-posta istemcisi kullanıyorsanız), geçici disk depolamaya yazmamıza gerek yoktur. Bunun yerine, bellekte şifrelenmiş IMAP şifreniz alınır ve kullanılır. Gerçek zamanlı olarak, size bir mesaj teslim edilmeye çalışıldığında, tüm IMAP sunucularına aktif bir oturumunuz olup olmadığını soran bir WebSocket isteği göndeririz (bu alma kısmıdır) ve ardından şifrelenmiş bellekteki şifreyi iletiriz – böylece geçici posta kutusuna yazmamıza gerek kalmaz, şifrelenmiş şifrenizle gerçek şifrelenmiş posta kutunuza yazabiliriz.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: Bir e-posta istemcisi kullanarak IMAP sunucusuna bağlanırsınız.
         IMAP->>SQLite: Mesaj geçici posta kutusundan takma adınızın posta kutusuna aktarılır.
         Note over IMAP,SQLite: Takma adınızın posta kutusu yalnızca IMAP şifresi kullanılarak bellekte mevcuttur.
         SQLite->>IMAP: E-posta istemcisi tarafından istenen mesajlar alınır.
         IMAP->>You: Başarılı!
     ```

5. [Şifrelenmiş posta kutularınızın yedekleri](#backups) günlük olarak alınır. Ayrıca istediğiniz zaman yeni bir yedek talep edebilir veya en son yedeği <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar bölümünden indirebilirsiniz. Başka bir e-posta hizmetine geçmeye karar verirseniz, posta kutularınızı ve yedeklerinizi istediğiniz zaman kolayca taşıyabilir, indirebilir, dışa aktarabilir ve temizleyebilirsiniz.


## Teknolojiler {#technologies}

### Veritabanları {#databases}

Başka olası veritabanı depolama katmanlarını araştırdık, ancak hiçbiri SQLite kadar gereksinimlerimizi karşılamadı:
| Veritabanı                                               |                                                                    Dinlenme Halinde Şifreleme                                                                   |  [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Posta Kutuları  |                           Lisans                           | [Her Yerde Kullanılıyor](https://www.sqlite.org/mostdeployed.html) |
| -------------------------------------------------------- | :-----------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star:   |                          :white_check_mark: [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) ile Evet                          |                                  :white_check_mark:                                      |               :white_check_mark: Kamu Malı                   |                      :white_check_mark:                     |
| [MongoDB](https://www.mongodb.com/)                      |                   :x: ["Sadece MongoDB Enterprise'da Mevcut"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: İlişkisel veritabanı                                 |                   :x: AGPL ve `SSPL-1.0`                     |                             :x:                             |
| [rqlite](https://github.com/rqlite/rqlite)               |                                             :x: [Sadece Ağ](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: İlişkisel veritabanı                                 |                   :white_check_mark: `MIT`                    |                             :x:                             |
| [dqlite](https://dqlite.io/)                             |                                   :x: [Test edilmemiş ve henüz desteklenmiyor?](https://github.com/canonical/dqlite/issues/32)                                  | :x: [Test edilmemiş ve henüz desteklenmiyor?](https://github.com/canonical/dqlite/issues/32) |              :white_check_mark: `LGPL-3.0-only`               |                             :x:                             |
| [PostgreSQL](https://www.postgresql.org/)                |                                :white_check_mark: [Evet](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: İlişkisel veritabanı                                 | :white_check_mark: `PostgreSQL` ( `BSD` veya `MIT` benzeri)  |                             :x:                             |
| [MariaDB](https://mariadb.com/)                          | :white_check_mark: [Sadece InnoDB için](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: İlişkisel veritabanı                                 |          :white_check_mark: `GPLv2` ve `BUSL-1.1`             |                             :x:                             |
| [CockroachDB](https://www.cockroachlabs.com/product/)    |                               :x: [Sadece Enterprise özelliği](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: İlişkisel veritabanı                                 |                  :x: `BUSL-1.1` ve diğerleri                  |                             :x:                             |

> Yukarıdaki tabloda birkaç SQLite veritabanı depolama seçeneğini karşılaştıran bir [blog yazısı](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) bulunmaktadır.

### Güvenlik {#security}

Her zaman [dinlenme halindeki şifreleme](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [iletim halindeki şifreleme](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), :tangerine: [Tangerine](https://tangeri.ne) kullanarak [HTTPS üzerinden DNS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") ve posta kutularında [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) şifrelemesi kullanıyoruz. Ayrıca, SMS'in [araya girme saldırılarına](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) açık olması nedeniyle token tabanlı iki faktörlü kimlik doğrulama, root erişimi devre dışı bırakılmış dönen SSH anahtarları, kısıtlı IP adresleri üzerinden sunuculara özel erişim ve daha fazlasını kullanıyoruz.
Bir [kötü hizmetçi saldırısı](https://en.wikipedia.org/wiki/Evil_maid_attack) veya üçüncü taraf bir satıcıdan kötü niyetli bir çalışan durumunda, **posta kutunuz yalnızca sizin oluşturduğunuz şifre ile açılabilir**. İçiniz rahat olsun, Cloudflare, DataPacket, Digital Ocean, GitHub ve Vultr gibi SOC Tip 2 uyumlu sunucu sağlayıcılarımız dışında herhangi bir üçüncü taraf satıcıya güvenmiyoruz.

Amacımız mümkün olduğunca az [tek hata noktası](https://en.wikipedia.org/wiki/Single_point_of_failure) olmaktır.

### Posta Kutuları {#mailboxes}

> **özet;** IMAP sunucularımız her posta kutunuz için ayrı ayrı şifrelenmiş SQLite veritabanları kullanır.

[SQLite son derece popüler bir](https://www.sqlite.org/mostdeployed.html) gömülü veritabanıdır – şu anda telefonunuzda ve bilgisayarınızda çalışmaktadır – [ve neredeyse tüm büyük teknolojiler tarafından kullanılmaktadır](https://www.sqlite.org/famous.html).

Örneğin, şifrelenmiş sunucularımızda `linux@example.com`, `info@example.com`, `hello@example.com` gibi her biri için bir SQLite veritabanı posta kutusu vardır – her biri `.sqlite` veritabanı dosyası olarak. Veritabanı dosyalarını e-posta adresi ile isimlendirmiyoruz – bunun yerine posta kutusunun kime ait olduğunu veya hangi e-posta adresine bağlı olduğunu paylaşmayan BSON ObjectID ve benzersiz UUID'ler kullanıyoruz (örneğin `353a03f21e534321f5d6e267.sqlite`).

Bu veritabanlarının her biri, yalnızca sizin sahip olduğunuz şifreniz kullanılarak [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) ile şifrelenmiştir. Bu, posta kutularınızın ayrı ayrı şifrelendiği, kendi içinde bağımsız, [sandboxlanmış](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) ve taşınabilir olduğu anlamına gelir.

SQLite'ı aşağıdaki [PRAGMA](https://www.sqlite.org/pragma.html) ile ince ayar yaptık:

| `PRAGMA`                 | Amaç                                                                                                                                                                                                                                                    |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [ChaCha20-Poly1305 SQLite veritabanı şifrelemesi](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Daha fazla bilgi için [Projeler](#projects) altında `better-sqlite3-multiple-ciphers` referansına bakınız.                 |
| `key="****************"` | Bu, e-posta istemcinizin IMAP bağlantısı aracılığıyla sunucumuza iletilen, yalnızca bellekte çözülen şifrenizdir. Her okuma ve yazma oturumu için yeni veritabanı örnekleri oluşturulur ve kapatılır (sandboxlama ve izolasyonu sağlamak için).          |
| `journal_mode=WAL`       | Yazmadan önce günlük ("[WAL](https://www.sqlite.org/wal.html)") [performansı artırır ve eşzamanlı okuma erişimine izin verir](https://litestream.io/tips/#wal-journal-mode).                                                                             |
| `busy_timeout=5000`      | Yazma kilidi hatalarını [diğer yazmalar devam ederken önler](https://litestream.io/tips/#busy-timeout).                                                                                                                                                  |
| `synchronous=NORMAL`     | İşlemlerin dayanıklılığını [veri bozulması riski olmadan artırır](https://litestream.io/tips/#synchronous-pragma).                                                                                                                                       |
| `foreign_keys=ON`        | Yabancı anahtar referanslarının (örneğin bir tablodan diğerine ilişki) uygulanmasını sağlar. [SQLite'da varsayılan olarak kapalıdır](https://www.sqlite.org/foreignkeys.html), ancak doğrulama ve veri bütünlüğü için etkinleştirilmelidir.               |
| `encoding='UTF-8'`       | Geliştirici sağduyusunu sağlamak için kullanılacak [varsayılan kodlama](https://www.sqlite.org/pragma.html#pragma_encoding).                                                                                                                              |
> Diğer tüm varsayılanlar, [resmi PRAGMA dokümantasyonunda](https://www.sqlite.org/pragma.html#pragma_auto_vacuum) belirtildiği gibi SQLite'tandır.

### Eşzamanlılık {#concurrency}

> **kısaca;** Şifrelenmiş SQLite posta kutularınıza eşzamanlı okuma ve yazma işlemleri için `WebSocket` kullanıyoruz.

#### Okumalar {#reads}

Telefonunuzdaki e-posta istemcisi `imap.forwardemail.net` adresini Digital Ocean IP adreslerimizden birine çözümleyebilir – ve masaüstü istemciniz tamamen farklı bir [sağlayıcıdan](#providers) ayrı bir IP adresi çözümleyebilir.

E-posta istemcinizin hangi IMAP sunucusuna bağlandığına bakılmaksızın, bağlantının veritabanınızı gerçek zamanlı ve %100 doğrulukla okumasını istiyoruz. Bu, WebSocket'ler aracılığıyla yapılır.

#### Yazmalar {#writes}

Veritabanınıza yazmak biraz farklıdır – çünkü SQLite gömülü bir veritabanıdır ve posta kutunuz varsayılan olarak tek bir dosyada bulunur.

Aşağıda `litestream`, `rqlite` ve `dqlite` gibi seçenekleri araştırdık – ancak hiçbiri gereksinimlerimizi karşılamadı.

Write-ahead-logging ("[WAL](https://www.sqlite.org/wal.html)") etkinleştirilmiş yazmaları gerçekleştirmek için – yalnızca bir sunucunun ("Birincil") bu işlemi yapmasından emin olmamız gerekir. [WAL](https://www.sqlite.org/wal.html) eşzamanlılığı büyük ölçüde hızlandırır ve bir yazıcı ile birden fazla okuyucuya izin verir.

Birincil, şifrelenmiş posta kutularını içeren bağlanmış hacimlere sahip veri sunucularında çalışır. Dağıtım açısından, `imap.forwardemail.net` arkasındaki tüm bireysel IMAP sunucularını ikincil sunucular ("İkincil") olarak düşünebilirsiniz.

İki yönlü iletişimi [WebSocket'ler](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) ile sağlıyoruz:

* Birincil sunucular, [ws](https://github.com/websockets/ws)'nin `WebSocketServer` sunucu örneğini kullanır.
* İkincil sunucular, [ws](https://github.com/websockets/ws)'nin `WebSocket` istemci örneğini kullanır ve bu istemci [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) ve [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket) ile sarılır. Bu iki sarmalayıcı, `WebSocket`'in yeniden bağlanmasını ve belirli veritabanı yazmaları için veri gönderip almasını sağlar.

### Yedekler {#backups}

> **kısaca;** Şifrelenmiş posta kutularınızın yedekleri günlük olarak alınır. Ayrıca istediğiniz zaman <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Hesabım <i class="fa fa-angle-right"></i> Alan Adları</a> <i class="fa fa-angle-right"></i> Takma Adlar sayfasından yeni bir yedek talep edebilir veya en son yedeği indirebilirsiniz.

Yedekler için, IMAP komut işleme sırasında her gün SQLite `VACUUM INTO` komutunu çalıştırıyoruz; bu komut, bellekteki IMAP bağlantısından şifrelenmiş parolanızı kullanır. Yedekler, mevcut bir yedek algılanmazsa veya dosyanın [SHA-256](https://en.wikipedia.org/wiki/SHA-2) karması en son yedekle karşılaştırıldığında değişmişse saklanır.

`backup` komutu yerine `VACUUM INTO` komutunu kullanmamızın nedeni, `backup` komutu sırasında bir sayfa değiştirilirse işlemin baştan başlaması gerekmesidir. `VACUUM INTO` komutu ise bir anlık görüntü alır. Daha fazla bilgi için bu [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) ve [Hacker News](https://news.ycombinator.com/item?id=31387556) yorumlarına bakabilirsiniz.

Ayrıca `backup` komutu, `rekey` çağrılana kadar veritabanını kısa bir süre şifresiz bırakacağından `VACUUM INTO` komutunu tercih ediyoruz (detaylar için bu GitHub [yorumu](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) incelenebilir).

İkincil, Birincil'e `WebSocket` bağlantısı üzerinden yedekleme komutunu verir – Birincil bu komutu alır ve ardından:

1. Şifrelenmiş posta kutunuza bağlanır.
2. Yazma kilidi alır.
3. `wal_checkpoint(PASSIVE)` ile WAL kontrol noktası çalıştırır.
4. `VACUUM INTO` SQLite komutunu çalıştırır.
5. Kopyalanan dosyanın şifrelenmiş parola ile açılabildiğinden emin olur (güvenlik/koruma).
6. Dosyayı depolama için Cloudflare R2'ye (veya belirtilmişse kendi sağlayıcınıza) yükler.
<!--
7. Oluşan yedek dosyasını `gzip` ile sıkıştırın.
8. Depolama için Cloudflare R2'ye yükleyin (veya belirtilmişse kendi sağlayıcınıza).
-->

Posta kutularınızın şifreli olduğunu unutmayın – ve WebSocket iletişimi için IP kısıtlamaları ve diğer kimlik doğrulama önlemleri uygulamış olsak da – kötü niyetli bir durumda, WebSocket yükü IMAP şifrenizi içermediği sürece veritabanınızı açamaz.

Şu anda her posta kutusu için yalnızca bir yedek saklanmaktadır, ancak gelecekte nokta-zaman-kurtarma ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)") sunabiliriz.

### Arama {#search}

IMAP sunucularımız karmaşık sorgular, düzenli ifadeler ve daha fazlasını destekleyen `SEARCH` komutunu destekler.

Hızlı arama performansı, [FTS5](https://www.sqlite.org/fts5.html) ve [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex) sayesinde mümkündür.

`Date` değerlerini SQLite posta kutularında [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) dizeleri olarak saklıyoruz; bu, [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (UTC zaman dilimi ile, eşitlik karşılaştırmalarının doğru çalışması için) kullanılarak yapılır.

Arama sorgularında yer alan tüm özellikler için dizinler de saklanır.

### Projeler {#projects}

Kaynak kodumuzda ve geliştirme sürecimizde kullandığımız projeleri (alfabetik olarak sıralanmış) gösteren tablo:

| Proje                                                                                       | Amaç                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/)                                                         | Tüm sunucu filomuzu kolayca yönetmek, ölçeklendirmek ve sürdürmek için DevOps otomasyon platformu.                                                                                                                                                                                                                                                               |
| [Bree](https://github.com/breejs/bree)                                                      | Node.js ve JavaScript için cron, tarihler, ms, later ve insan dostu destekle iş zamanlayıcı.                                                                                                                                                                                                                                                                     |
| [Cabin](https://github.com/cabinjs/cabin)                                                   | Güvenlik ve gizlilik odaklı geliştirici dostu JavaScript ve Node.js günlükleme kütüphanesi.                                                                                                                                                                                                                                                                        |
| [Lad](https://github.com/ladjs/lad)                                                         | MVC ve daha fazlası ile tüm mimari ve mühendislik tasarımımızı güçlendiren Node.js çerçevesi.                                                                                                                                                                                                                                                                     |
| [MongoDB](https://www.mongodb.com/)                                                         | Posta kutuları dışındaki tüm diğer verileri (ör. hesap, ayarlar, alan adları ve takma ad yapılandırmaları) saklamak için kullandığımız NoSQL veritabanı çözümü.                                                                                                                                                                                                |
| [Mongoose](https://github.com/Automattic/mongoose)                                          | Tüm yığınımızda kullandığımız MongoDB nesne belge modelleme ("ODM"). **Mongoose'u SQLite ile kullanmaya devam etmemizi sağlayan özel yardımcılar yazdık** :tada:                                                                                                                                                                                                |
| [Node.js](https://nodejs.org/en)                                                            | Tüm sunucu süreçlerimizi çalıştıran açık kaynak, çapraz platform JavaScript çalışma zamanı ortamı.                                                                                                                                                                                                                                                               |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                      | E-posta gönderme, bağlantılar oluşturma ve daha fazlası için Node.js paketi. Bu projenin resmi sponsoru biziz.                                                                                                                                                                                                                                                   |
| [Redis](https://redis.io/)                                                                  | Önbellekleme, yayın/abonelik kanalları ve DNS üzerinden HTTPS istekleri için bellek içi veritabanı.                                                                                                                                                                                                                                                               |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                  | Tüm veritabanı dosyalarının (yazma öncesi günlük ("[WAL](https://www.sqlite.org/wal.html)"), günlük, geri alma vb. dahil) şifrelenmesine izin veren SQLite şifreleme eklentisi.                                                                                                                                                                                   |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                 | Geliştirme posta kutularını test etmek, indirmek ve görüntülemek için kullanabileceğiniz görsel SQLite düzenleyici.                                                                                                                                                                                                                                               |
| [SQLite](https://www.sqlite.org/about.html)                                                 | Ölçeklenebilir, kendi kendine yeten, hızlı ve dayanıklı IMAP depolama için gömülü veritabanı katmanı.                                                                                                                                                                                                                                                             |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                  | Node.js anti-spam, e-posta filtreleme ve kimlik avı önleme aracı (bizim [Spam Assassin](https://spamassassin.apache.org/) ve [rspamd](https://github.com/rspamd/rspamd) alternatifimiz).                                                                                                                                                                            |
| [Tangerine](https://tangeri.ne)                                                             | Node.js ile DNS üzerinden HTTPS istekleri ve Redis kullanarak önbellekleme – küresel tutarlılık ve çok daha fazlasını sağlar.                                                                                                                                                                                                                                      |
| [Thunderbird](https://www.thunderbird.net/)                                                 | Geliştirme ekibimiz tarafından kullanılan ve Forward Email ile kullanılması önerilen **tercih edilen e-posta istemcisi**.                                                                                                                                                                                                                                         |
| [UTM](https://github.com/utmapp/UTM)                                                        | Geliştirme ekibimiz, IMAP ve SMTP sunucularımızla farklı e-posta istemcilerini (paralel olarak) test etmek için iOS ve macOS üzerinde sanal makineler oluşturmak için bunu kullanır.                                                                                                                                                                               |
| [Ubuntu](https://ubuntu.com/download/server)                                                | Tüm altyapımızı güçlendiren modern açık kaynak Linux tabanlı sunucu işletim sistemi.                                                                                                                                                                                                                                                                               |
| [WildDuck](https://github.com/nodemailer/wildduck)                                          | IMAP sunucu kütüphanesi – [ek açıklamalarını](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) ve [IMAP protokol desteğini](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md) inceleyin.                                                                                              |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | SQLite3 ile programatik olarak etkileşim için Node.js'e hızlı ve basit API kütüphanesi.                                                                                                                                                                                                                                                                            |
| [email-templates](https://github.com/forwardemail/email-templates)                          | Geliştirici dostu e-posta çerçevesi; özel e-postalar (ör. hesap bildirimleri ve daha fazlası) oluşturmak, önizlemek ve göndermek için.                                                                                                                                                                                                                            |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                      | Mongo tarzı sözdizimi kullanan SQL sorgu oluşturucu. Bu, geliştirme ekibimizin tüm yığın boyunca Mongo tarzında yazmaya devam etmesini sağlar ve veritabanı bağımsız bir yaklaşım sunar. **Ayrıca sorgu parametreleri kullanarak SQL enjeksiyon saldırılarını önlemeye yardımcı olur.**                                                                         |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                      | Mevcut veritabanı şeması hakkında bilgi çıkarmak için SQL aracı. Bu, tüm dizinlerin, tabloların, sütunların, kısıtlamaların ve daha fazlasının geçerli ve olması gerektiği gibi `1:1` olduğunu kolayca doğrulamamızı sağlar. Veritabanı şemalarında değişiklik yapılırsa yeni sütunlar ve dizinler eklemek için otomatik yardımcılar bile yazdık (çok ayrıntılı hata uyarılarıyla). |
| [knex](https://github.com/knex/knex)                                                      | Yalnızca veritabanı geçişleri ve `knex-schema-inspector` ile şema doğrulama için kullandığımız SQL sorgu oluşturucu.                                                                                                                                                                                                                                                |
| [mandarin](https://github.com/ladjs/mandarin)                                             | Markdown desteği ile otomatik [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) ifade çevirisi için [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest) kullanımı.                                                                                                                                       |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                       | MX sunucularıyla bağlantı kurmak ve hataları yönetmek için Node.js paketi.                                                                                                                                                                                                                                                                                        |
| [pm2](https://github.com/Unitech/pm2)                                                     | Yerleşik yük dengeleyici ile Node.js üretim süreç yöneticisi ([performans için ince ayarlı](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214)).                                                                                                                                                                                                   |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                  | SMTP sunucu kütüphanesi – posta değişimi ("MX") ve giden SMTP sunucularımız için kullanıyoruz.                                                                                                                                                                                                                                                                     |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                             | IMAP sunucularını kıyaslamalar ve RFC spesifikasyonu IMAP protokol uyumluluğu açısından test etmek için faydalı araç. Bu proje, [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) ekibi tarafından oluşturuldu (Temmuz 2002'den beri aktif açık kaynak IMAP ve POP3 sunucusu). IMAP sunucumuzu bu araçla kapsamlı şekilde test ettik.                                    |
> Diğer kullandığımız projeleri [GitHub üzerindeki kaynak kodumuzda](https://github.com/forwardemail) bulabilirsiniz.

### Sağlayıcılar {#providers}

| Sağlayıcı                                        | Amaç                                                                                                                        |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | DNS sağlayıcısı, sağlık kontrolleri, yük dengeleyiciler ve [Cloudflare R2](https://developers.cloudflare.com/r2) kullanarak yedek depolama. |
| [GitHub](https://github.com/)                   | Kaynak kodu barındırma, CI/CD ve proje yönetimi.                                                                            |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Özel sunucu barındırma ve yönetilen veritabanları.                                                                          |
| [Vultr](https://www.vultr.com/?ref=7429848)     | Özel sunucu barındırma.                                                                                                      |
| [DataPacket](https://www.datapacket.com)        | Özel sunucu barındırma.                                                                                                      |


## Düşünceler {#thoughts}

### İlkeler {#principles}

Forward Email şu ilkeler doğrultusunda tasarlanmıştır:

1. Her zaman geliştirici dostu, güvenlik ve gizlilik odaklı ve şeffaf olmak.
2. [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Twelve Factor](https://12factor.net/), [Occam's razor](https://en.wikipedia.org/wiki/Occam%27s_razor) ve [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) prensiplerine bağlı kalmak.
3. Mütevazı, kendi kendine yeten ve [ramen-kârlı](http://www.paulgraham.com/ramenprofitable.html) geliştiriciyi hedeflemek.

### Deneyler {#experiments}

> **kısaca;** Sonuç olarak S3 uyumlu nesne depolama ve/veya Sanal Tabloların performans nedenleriyle teknik olarak uygulanabilir olmadığı ve bellek sınırlamaları nedeniyle hata yapmaya eğilimli olduğu görülmüştür.

Yukarıda tartışıldığı gibi nihai SQLite çözümümüze ulaşana kadar birkaç deney yaptık.

Bunlardan biri, [rclone]() ve SQLite'ı S3 uyumlu bir depolama katmanı ile birlikte kullanmayı denemekti.

Bu deney, rclone, SQLite ve [VFS](https://en.wikipedia.org/wiki/Virtual_file_system) kullanımıyla ilgili kenar durumları daha iyi anlamamıza ve keşfetmemize yol açtı:

* rclone ile `--vfs-cache-mode writes` bayrağını etkinleştirirseniz, okuma işlemleri iyi çalışır ancak yazmalar önbelleğe alınır.
  * Birden fazla IMAP sunucunuz küresel olarak dağıtılmışsa, önbellek bunlar arasında kapalı olur; ancak tek bir yazıcı ve birden fazla dinleyici (örneğin bir pub/sub yaklaşımı) varsa bu sorun olmaz.
  * Bu inanılmaz derecede karmaşıktır ve buna benzer ek karmaşıklıklar daha fazla tek hata noktası yaratır.
  * S3 uyumlu depolama sağlayıcıları kısmi dosya değişikliklerini desteklemez – bu, `.sqlite` dosyasındaki herhangi bir değişikliğin veritabanının tamamen değişmesi ve yeniden yüklenmesi anlamına gelir.
  * `rsync` gibi diğer çözümler vardır, ancak bunlar yazma öncesi günlük ("[WAL](https://www.sqlite.org/wal.html)") desteğine odaklanmaz – bu yüzden Litestream'i inceledik. Neyse ki şifreleme kullanımız zaten [WAL](https://www.sqlite.org/wal.html) dosyalarını bizim için şifreliyor, bu yüzden Litestream'e bu konuda güvenmemize gerek yok. Ancak Litestream'in üretim kullanımı için henüz tam güvenimiz yok ve aşağıda bununla ilgili birkaç notumuz var.
  * `--vfs-cache-mode writes` seçeneğini kullanmak (yazmalar için `rclone` üzerinden SQLite kullanmanın *tek* yolu) tüm veritabanını sıfırdan belleğe kopyalamaya çalışır – 10 GB'lık bir posta kutusunu yönetmek sorun değil, ancak çok yüksek depolama gerektiren birden fazla posta kutusunu yönetmek IMAP sunucularının bellek sınırlarına, `ENOMEM` hatalarına, segmentasyon hatalarına ve veri bozulmasına yol açar.
* SQLite [Sanal Tabloları](https://www.sqlite.org/vtab.html) (örneğin [s3db](https://github.com/jrhy/s3db) kullanarak) S3 uyumlu depolama katmanında veri tutmak için kullanmaya çalışırsanız, birkaç başka sorunla karşılaşırsınız:
  * Okuma ve yazma işlemleri çok yavaş olur çünkü S3 API uç noktalarına HTTP `GET`, `PUT`, `HEAD` ve `POST` yöntemleriyle erişilmesi gerekir.
  * Geliştirme testleri, fiber internet üzerinde 500K-1M+ kayıt aşımının bile S3 uyumlu sağlayıcılara yazma ve okuma hızlarıyla sınırlı olduğunu gösterdi. Örneğin geliştiricilerimiz hem ardışık SQL `INSERT` ifadeleri hem de büyük miktarda veriyi toplu yazan `for` döngüleri çalıştırdı. Her iki durumda da performans şaşırtıcı derecede yavaştı.
  * Sanal tablolar **indekslere**, `ALTER TABLE` ifadelerine ve [diğer](https://stackoverflow.com/a/12507650) [kısıtlamalara](https://sqlite.org/lang_createvtab.html) sahip olamaz – bu da veri miktarına bağlı olarak 1-2 dakika veya daha fazla gecikmeye yol açar.
  * Nesneler şifrelenmemiş olarak depolanır ve yerel şifreleme desteği mevcut değildir.
* Ayrıca [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs) kullanmayı araştırdık; bu kavramsal ve teknik olarak önceki maddeye benzer (dolayısıyla aynı sorunlara sahip). Bir olasılık, yukarıdaki çözümümüzde kullandığımız gibi şifreleme ile sarılmış özel bir `sqlite3` derlemesi kullanmak olabilir; örneğin [wxSQLite3](https://github.com/utelle/wxsqlite3) aracılığıyla [kurulum dosyasını düzenleyerek](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276).
* Başka bir potansiyel yaklaşım [multiplex eklentisi](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c) kullanmaktı, ancak bunun 32 GB sınırı var ve karmaşık derleme ve geliştirme zorlukları gerektirir.
* `ALTER TABLE` ifadeleri gereklidir (bu nedenle Sanal Tablolar tamamen elenir). `knex-schema-inspector` ile kancamızın düzgün çalışması için `ALTER TABLE` ifadelerine ihtiyacımız var – bu, verilerin bozulmamasını ve alınan satırların `mongoose` şema tanımlarımıza göre geçerli belgelere dönüştürülebilmesini sağlar (bu tanımlar kısıtlamalar, değişken türleri ve keyfi veri doğrulamasını içerir).
* Açık kaynak topluluğunda SQLite ile ilgili S3 uyumlu projelerin neredeyse tamamı Python'dadır (ve bizim kullandığımız %100 JavaScript değildir).
* [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) gibi sıkıştırma kütüphaneleri (bkz. [yorumlar](https://news.ycombinator.com/item?id=32303762)) umut verici görünmekle birlikte [henüz üretim kullanımı için hazır olmayabilir](https://github.com/phiresky/sqlite-zstd#usage). Bunun yerine `String`, `Object`, `Map`, `Array`, `Set` ve `Buffer` gibi veri türlerinde uygulama tarafı sıkıştırma daha temiz ve kolay bir yaklaşım olacaktır (ve geçişi de daha kolaydır, çünkü bir `Boolean` bayrak veya sütun saklayabiliriz – ya da veritabanı meta verisi olarak sıkıştırma için `PRAGMA user_version=1` veya sıkıştırmasız için `user_version=0` kullanabiliriz).
  * Neyse ki IMAP sunucu depolamamızda ek dosya çoğaltma önleme zaten uygulanmıştır – bu nedenle aynı eki içeren her mesaj eki kopyalamaz – bunun yerine bir posta kutusundaki birden fazla mesaj ve konu için tek bir ek saklanır ve yabancı bir referans kullanılır.
* SQLite çoğaltma ve yedekleme çözümü olan Litestream projesi çok umut verici ve muhtemelen gelecekte kullanacağız.
  * Yazarı/yazarları küçümsemek istemeyiz – çünkü onlar açık kaynak için on yılı aşkın süredir yaptıkları çalışmalar ve katkılarla çok seviyoruz – ancak gerçek dünya kullanımı, [birçok sorun](https://github.com/benbjohnson/litestream/issues) ve [kullanımdan kaynaklanan potansiyel veri kaybı](https://github.com/benbjohnson/litestream/issues/218) olabileceğini gösteriyor.
* Yedek geri yükleme sürtünmesiz ve basit olmalıdır. `mongodump` ve `mongoexport` kullanan MongoDB gibi çözümler sadece zahmetli değil, aynı zamanda zaman alıcı ve yapılandırma karmaşıklığına sahiptir.
  * SQLite veritabanları bunu basitleştirir (tek bir dosyadır).
  * Kullanıcıların posta kutularını istedikleri anda alıp ayrılabilecekleri bir çözüm tasarlamak istedik.
    * Basit Node.js komutlarıyla `fs.unlink('mailbox.sqlite')` yaparak dosya kalıcı olarak diskten silinir.
    * Benzer şekilde S3 uyumlu API ile HTTP `DELETE` kullanarak kullanıcılar için anlık görüntüleri ve yedekleri kolayca kaldırabiliriz.
  * SQLite en basit, en hızlı ve en maliyet etkin çözümdü.
### Alternatif Eksikliği {#lack-of-alternatives}

Bildiklerimize göre, başka hiçbir e-posta servisi bu şekilde tasarlanmamıştır ve açık kaynak değildir.

*Bunun sebebinin*, mevcut e-posta servislerinin üretimde [spagetti kod](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti: içeren eski teknolojiye sahip olmaları olduğunu düşünüyoruz.

Mevcut e-posta servis sağlayıcılarının çoğu ya kapalı kaynaklıdır ya da açık kaynak olarak reklam yapar, **ancak gerçekte sadece ön yüzleri açık kaynaktır.**

**E-postanın en hassas kısmı** (gerçek depolama/IMAP/SMTP etkileşimi) **tamamen arka uçta (sunucu) yapılır, *ön uçta* (istemci) değil.**

### Forward Email'i Deneyin {#try-out-forward-email}

Bugün <https://forwardemail.net> adresinden kaydolun! :rocket:
