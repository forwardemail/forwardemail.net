# Email Chống Lượng Tử: Cách chúng tôi sử dụng hộp thư SQLite được mã hóa để giữ an toàn cho email của bạn {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Quantum-safe encrypted email service illustration" class="rounded-lg" />


## Mục Lục {#table-of-contents}

* [Lời nói đầu](#foreword)
* [So sánh nhà cung cấp dịch vụ email](#email-service-provider-comparison)
* [Nó hoạt động như thế nào](#how-does-it-work)
* [Công nghệ](#technologies)
  * [Cơ sở dữ liệu](#databases)
  * [Bảo mật](#security)
  * [Hộp thư](#mailboxes)
  * [Đồng thời](#concurrency)
  * [Sao lưu](#backups)
  * [Tìm kiếm](#search)
  * [Dự án](#projects)
  * [Nhà cung cấp](#providers)
* [Suy nghĩ](#thoughts)
  * [Nguyên tắc](#principles)
  * [Thí nghiệm](#experiments)
  * [Thiếu lựa chọn thay thế](#lack-of-alternatives)
  * [Thử Forward Email](#try-out-forward-email)


## Lời nói đầu {#foreword}

> \[!IMPORTANT]
> Dịch vụ email của chúng tôi là [mã nguồn mở 100%](https://github.com/forwardemail) và tập trung vào quyền riêng tư thông qua các hộp thư SQLite được mã hóa và bảo mật.

Cho đến khi chúng tôi ra mắt [hỗ trợ IMAP](/faq#do-you-support-receiving-email-with-imap), chúng tôi đã sử dụng MongoDB cho nhu cầu lưu trữ dữ liệu bền vững.

Công nghệ này thật tuyệt vời và chúng tôi vẫn sử dụng nó đến ngày nay – nhưng để có mã hóa khi lưu trữ với MongoDB, bạn cần sử dụng nhà cung cấp có MongoDB Enterprise, như Digital Ocean hoặc Mongo Atlas – hoặc phải trả phí giấy phép doanh nghiệp (và sau đó phải làm việc với đội ngũ bán hàng có độ trễ).

Đội ngũ của chúng tôi tại [Forward Email](https://forwardemail.net) cần một giải pháp lưu trữ thân thiện với nhà phát triển, có thể mở rộng, đáng tin cậy và được mã hóa cho các hộp thư IMAP. Là những nhà phát triển mã nguồn mở, việc sử dụng một công nghệ mà bạn phải trả phí giấy phép để có tính năng mã hóa khi lưu trữ là trái với [nguyên tắc của chúng tôi](#principles) – vì vậy chúng tôi đã thử nghiệm, nghiên cứu và phát triển một giải pháp mới từ đầu để đáp ứng những nhu cầu này.

Thay vì sử dụng một cơ sở dữ liệu chia sẻ để lưu trữ hộp thư của bạn, chúng tôi lưu trữ và mã hóa từng hộp thư của bạn riêng biệt bằng mật khẩu của bạn (chỉ có bạn mới có).  **Dịch vụ email của chúng tôi bảo mật đến mức nếu bạn quên mật khẩu, bạn sẽ mất hộp thư của mình** (và cần phục hồi bằng sao lưu ngoại tuyến hoặc bắt đầu lại).

Hãy tiếp tục đọc để chúng tôi đi sâu vào chi tiết với [so sánh các nhà cung cấp dịch vụ email](#email-service-provider-comparison), [cách dịch vụ của chúng tôi hoạt động](#how-does-it-work), [công nghệ của chúng tôi](#technologies), và nhiều hơn nữa.


## So sánh nhà cung cấp dịch vụ email {#email-service-provider-comparison}

Chúng tôi là nhà cung cấp dịch vụ email duy nhất 100% mã nguồn mở và tập trung vào quyền riêng tư, lưu trữ các hộp thư SQLite được mã hóa riêng biệt, cung cấp tên miền, bí danh và người dùng không giới hạn, và hỗ trợ SMTP gửi đi, IMAP, và POP3:

**Không giống như các nhà cung cấp email khác, bạn không cần phải trả phí lưu trữ theo từng tên miền hoặc bí danh với Forward Email.**  Bộ nhớ được chia sẻ trên toàn bộ tài khoản của bạn – vì vậy nếu bạn có nhiều tên miền tùy chỉnh và nhiều bí danh trên mỗi tên miền, thì chúng tôi là giải pháp hoàn hảo cho bạn. Lưu ý rằng bạn vẫn có thể áp dụng giới hạn lưu trữ nếu muốn theo từng tên miền hoặc bí danh.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Đọc So Sánh Dịch Vụ Email <i class="fa fa-search-plus"></i></a>


## Nó hoạt động như thế nào {#how-does-it-work}

1. Sử dụng ứng dụng email của bạn như Apple Mail, Thunderbird, Gmail, hoặc Outlook – bạn kết nối với các máy chủ [IMAP](/faq#do-you-support-receiving-email-with-imap) bảo mật của chúng tôi bằng tên đăng nhập và mật khẩu của bạn:

   * Tên đăng nhập của bạn là bí danh đầy đủ với tên miền của bạn như `hello@example.com`.
   * Mật khẩu của bạn được tạo ngẫu nhiên và chỉ hiển thị cho bạn trong 30 giây khi bạn nhấp <strong class="text-success"><i class="fa fa-key"></i> Tạo Mật Khẩu</strong> từ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài Khoản Của Tôi <i class="fa fa-angle-right"></i> Tên Miền</a> <i class="fa fa-angle-right"></i> Bí Danh.
2. Khi đã kết nối, ứng dụng email của bạn sẽ gửi [các lệnh giao thức IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) đến máy chủ IMAP của chúng tôi để giữ cho hộp thư của bạn được đồng bộ. Điều này bao gồm việc viết và lưu các email nháp cũng như các hành động khác mà bạn có thể thực hiện (ví dụ: gắn nhãn một email là Quan trọng hoặc đánh dấu một email là Thư rác/Spam).

3. Các máy chủ trao đổi thư (thường được gọi là máy chủ "MX") nhận email mới đến và lưu trữ nó vào hộp thư của bạn. Khi điều này xảy ra, ứng dụng email của bạn sẽ được thông báo và đồng bộ hộp thư. Các máy chủ trao đổi thư của chúng tôi có thể chuyển tiếp email của bạn đến một hoặc nhiều người nhận (bao gồm cả [webhooks](/faq#do-you-support-webhooks)), lưu trữ email của bạn trong bộ nhớ IMAP được mã hóa với chúng tôi, **hoặc cả hai**!

   > \[!TIP]
   > Quan tâm muốn tìm hiểu thêm? Đọc [cách thiết lập chuyển tiếp email](/faq#how-do-i-get-started-and-set-up-email-forwarding), [cách dịch vụ trao đổi thư của chúng tôi hoạt động](/faq#how-does-your-email-forwarding-system-work), hoặc xem [các hướng dẫn của chúng tôi](/guides).

4. Ở phía sau, thiết kế lưu trữ email an toàn của chúng tôi hoạt động theo hai cách để giữ cho các hộp thư của bạn được mã hóa và chỉ bạn mới có thể truy cập:

   * Khi thư mới được gửi đến cho bạn từ người gửi, các máy chủ trao đổi thư của chúng tôi sẽ ghi vào một hộp thư tạm thời, cá nhân và được mã hóa dành cho bạn.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Tin nhắn đến cho bí danh của bạn (ví dụ: you@yourdomain.com).
         MX->>SQLite: Tin nhắn được lưu trong hộp thư tạm thời.
         Note over MX,SQLite: Chuyển tiếp đến các người nhận khác và webhooks đã cấu hình.
         MX->>Sender: Thành công!
     ```

   * Khi bạn kết nối với máy chủ IMAP của chúng tôi bằng ứng dụng email, mật khẩu của bạn sẽ được mã hóa trong bộ nhớ và sử dụng để đọc và ghi vào hộp thư của bạn. Hộp thư của bạn chỉ có thể được đọc và ghi với mật khẩu này. Hãy nhớ rằng vì chỉ bạn mới có mật khẩu này, **chỉ có bạn** mới có thể đọc và ghi vào hộp thư khi bạn truy cập nó. Lần tiếp theo ứng dụng email của bạn cố gắng kiểm tra thư hoặc đồng bộ, các tin nhắn mới sẽ được chuyển từ hộp thư tạm thời này và lưu vào tệp hộp thư thực tế của bạn bằng mật khẩu bạn cung cấp. Lưu ý rằng hộp thư tạm thời này sẽ bị xóa sau đó để chỉ có hộp thư được bảo vệ bằng mật khẩu của bạn chứa các tin nhắn.

   * **Nếu bạn đang kết nối với IMAP (ví dụ sử dụng ứng dụng email như Apple Mail hoặc Thunderbird), thì chúng tôi không cần ghi vào bộ nhớ đĩa tạm thời. Mật khẩu IMAP được mã hóa trong bộ nhớ của bạn sẽ được lấy và sử dụng. Trong thời gian thực, khi một tin nhắn cố gắng được gửi đến bạn, chúng tôi gửi yêu cầu WebSocket đến tất cả các máy chủ IMAP hỏi xem họ có phiên hoạt động cho bạn không (đây là phần lấy dữ liệu), và sau đó sẽ truyền mật khẩu được mã hóa trong bộ nhớ đó – vì vậy chúng tôi không cần ghi vào hộp thư tạm thời, chúng tôi có thể ghi vào hộp thư mã hóa thực tế của bạn bằng mật khẩu được mã hóa của bạn.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: Bạn kết nối với máy chủ IMAP bằng ứng dụng email.
         IMAP->>SQLite: Chuyển tin nhắn từ hộp thư tạm thời sang hộp thư bí danh của bạn.
         Note over IMAP,SQLite: Hộp thư bí danh của bạn chỉ có sẵn trong bộ nhớ với mật khẩu IMAP.
         SQLite->>IMAP: Lấy tin nhắn theo yêu cầu của ứng dụng email.
         IMAP->>You: Thành công!
     ```

5. [Sao lưu các hộp thư được mã hóa của bạn](#backups) được thực hiện hàng ngày. Bạn cũng có thể yêu cầu sao lưu mới bất cứ lúc nào hoặc tải xuống bản sao lưu mới nhất từ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Bí danh. Nếu bạn quyết định chuyển sang dịch vụ email khác, bạn có thể dễ dàng di chuyển, tải xuống, xuất và xóa các hộp thư và bản sao lưu của mình bất cứ lúc nào.


## Công nghệ {#technologies}

### Cơ sở dữ liệu {#databases}

Chúng tôi đã khám phá các lớp lưu trữ cơ sở dữ liệu khác, tuy nhiên không có cái nào đáp ứng yêu cầu của chúng tôi tốt như SQLite:
| Database                                               |                                                                    Mã hóa khi lưu trữ                                                                   |  [Hộp thư Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\))  |                           Giấy phép                           | [Được sử dụng rộng rãi](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: |                          :white_check_mark: Có với [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                         |                                  :white_check_mark:                                  |               :white_check_mark: Public Domain              |                      :white_check_mark:                     |
| [MongoDB](https://www.mongodb.com/)                    |                   :x: ["Chỉ có trong MongoDB Enterprise"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: Cơ sở dữ liệu quan hệ                               |                   :x: AGPL và `SSPL-1.0`                   |                             :x:                             |
| [rqlite](https://github.com/rqlite/rqlite)             |                                             :x: [Chỉ mạng](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: Cơ sở dữ liệu quan hệ                               |                   :white_check_mark: `MIT`                  |                             :x:                             |
| [dqlite](https://dqlite.io/)                           |                                   :x: [Chưa kiểm tra và chưa được hỗ trợ?](https://github.com/canonical/dqlite/issues/32)                                  | :x: [Chưa kiểm tra và chưa được hỗ trợ?](https://github.com/canonical/dqlite/issues/32) |              :white_check_mark: `LGPL-3.0-only`             |                             :x:                             |
| [PostgreSQL](https://www.postgresql.org/)              |                                :white_check_mark: [Có](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: Cơ sở dữ liệu quan hệ                               | :white_check_mark: `PostgreSQL` (tương tự `BSD` hoặc `MIT`) |                             :x:                             |
| [MariaDB](https://mariadb.com/)                        | :white_check_mark: [Chỉ dành cho InnoDB](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: Cơ sở dữ liệu quan hệ                               |          :white_check_mark: `GPLv2` và `BUSL-1.1`          |                             :x:                             |
| [CockroachDB](https://www.cockroachlabs.com/product/)  |                               :x: [Chỉ tính năng Enterprise](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: Cơ sở dữ liệu quan hệ                               |                  :x: `BUSL-1.1` và các loại khác                  |                             :x:                             |

> Đây là một [bài đăng blog so sánh một số tùy chọn lưu trữ cơ sở dữ liệu SQLite](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) trong bảng trên.

### Bảo mật {#security}

Luôn luôn chúng tôi sử dụng [mã hóa khi lưu trữ](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [mã hóa khi truyền tải](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS qua HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") sử dụng :tangerine: [Tangerine](https://tangeri.ne), và [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) mã hóa trên các hộp thư. Ngoài ra, chúng tôi sử dụng xác thực hai yếu tố dựa trên token (thay vì SMS vốn dễ bị tấn công [man-in-the-middle-attacks](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), khóa SSH được xoay vòng với quyền root bị vô hiệu hóa, truy cập độc quyền vào máy chủ qua các địa chỉ IP giới hạn, và nhiều biện pháp khác.
Trong trường hợp xảy ra [tấn công evil maid](https://en.wikipedia.org/wiki/Evil_maid_attack) hoặc nhân viên bất chính từ nhà cung cấp bên thứ ba, **hộp thư của bạn vẫn chỉ có thể được mở bằng mật khẩu do bạn tạo ra**. Hãy yên tâm, chúng tôi không dựa vào bất kỳ nhà cung cấp bên thứ ba nào ngoài các nhà cung cấp máy chủ tuân thủ SOC Type 2 của chúng tôi như Cloudflare, DataPacket, Digital Ocean, GitHub và Vultr.

Mục tiêu của chúng tôi là giảm thiểu số lượng [điểm lỗi đơn lẻ](https://en.wikipedia.org/wiki/Single_point_of_failure) càng nhiều càng tốt.

### Hộp thư {#mailboxes}

> **tóm tắt;** Máy chủ IMAP của chúng tôi sử dụng các cơ sở dữ liệu SQLite được mã hóa riêng biệt cho từng hộp thư của bạn.

[SQLite là một cơ sở dữ liệu nhúng cực kỳ phổ biến](https://www.sqlite.org/mostdeployed.html) – hiện đang chạy trên điện thoại và máy tính của bạn – [và được sử dụng bởi hầu hết các công nghệ lớn](https://www.sqlite.org/famous.html).

Ví dụ, trên các máy chủ được mã hóa của chúng tôi có một cơ sở dữ liệu SQLite cho hộp thư `linux@example.com`, `info@example.com`, `hello@example.com` và các hộp thư khác – mỗi hộp thư là một tệp cơ sở dữ liệu `.sqlite`. Chúng tôi cũng không đặt tên tệp cơ sở dữ liệu theo địa chỉ email – thay vào đó, chúng tôi sử dụng BSON ObjectID và UUID duy nhất được tạo ra mà không tiết lộ hộp thư thuộc về ai hoặc địa chỉ email nào (ví dụ `353a03f21e534321f5d6e267.sqlite`).

Mỗi cơ sở dữ liệu này được mã hóa riêng bằng mật khẩu của bạn (chỉ bạn có) sử dụng [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Điều này có nghĩa là các hộp thư của bạn được mã hóa riêng biệt, tự chứa, [được cách ly](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) và có thể di động.

Chúng tôi đã tinh chỉnh SQLite với các [PRAGMA](https://www.sqlite.org/pragma.html) sau:

| `PRAGMA`                 | Mục đích                                                                                                                                                                                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [Mã hóa cơ sở dữ liệu SQLite ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Tham khảo `better-sqlite3-multiple-ciphers` trong phần [Projects](#projects) để hiểu rõ hơn.                                 |
| `key="****************"` | Đây là mật khẩu giải mã chỉ lưu trong bộ nhớ tạm thời được truyền qua kết nối IMAP của ứng dụng email của bạn tới máy chủ của chúng tôi. Các phiên bản cơ sở dữ liệu mới được tạo và đóng cho mỗi phiên đọc và ghi (để đảm bảo cách ly và bảo vệ). |
| `journal_model=WAL`      | Write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") [giúp tăng hiệu suất và cho phép truy cập đọc đồng thời](https://litestream.io/tips/#wal-journal-mode).                                                                                   |
| `busy_timeout=5000`      | Ngăn lỗi khóa ghi [khi các thao tác ghi khác đang diễn ra](https://litestream.io/tips/#busy-timeout).                                                                                                                                                    |
| `synchronous=NORMAL`     | Tăng độ bền của các giao dịch [mà không gây rủi ro hỏng dữ liệu](https://litestream.io/tips/#synchronous-pragma).                                                                                                                                         |
| `foreign_keys=ON`        | Bắt buộc kiểm tra các khóa ngoại (ví dụ: quan hệ giữa các bảng). [Mặc định tính năng này không được bật trong SQLite](https://www.sqlite.org/foreignkeys.html), nhưng để đảm bảo xác thực và tính toàn vẹn dữ liệu thì nên bật.                         |
| `encoding='UTF-8'`       | [Mã hóa mặc định](https://www.sqlite.org/pragma.html#pragma_encoding) được sử dụng để đảm bảo sự nhất quán cho nhà phát triển.                                                                                                                            |
> Tất cả các mặc định khác đều từ SQLite như được chỉ định trong [tài liệu PRAGMA chính thức](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Đồng thời {#concurrency}

> **tldr;** Chúng tôi sử dụng `WebSocket` để đọc và ghi đồng thời vào các hộp thư SQLite được mã hóa của bạn.

#### Đọc {#reads}

Ứng dụng email trên điện thoại của bạn có thể phân giải `imap.forwardemail.net` thành một trong các địa chỉ IP của Digital Ocean – và ứng dụng trên máy tính để bàn của bạn có thể phân giải một địa chỉ IP khác từ một [nhà cung cấp](#providers) khác hoàn toàn.

Bất kể máy chủ IMAP nào mà ứng dụng email của bạn kết nối, chúng tôi muốn kết nối đó đọc dữ liệu từ cơ sở dữ liệu của bạn theo thời gian thực với độ chính xác 100%. Điều này được thực hiện thông qua WebSockets.

#### Ghi {#writes}

Việc ghi vào cơ sở dữ liệu của bạn hơi khác – vì SQLite là cơ sở dữ liệu nhúng và hộp thư của bạn mặc định nằm trong một tệp duy nhất.

Chúng tôi đã khám phá các lựa chọn như `litestream`, `rqlite`, và `dqlite` bên dưới – tuy nhiên không lựa chọn nào đáp ứng được yêu cầu của chúng tôi.

Để thực hiện ghi với ghi nhật ký trước ("[WAL](https://www.sqlite.org/wal.html)") được bật – chúng tôi cần đảm bảo chỉ có một máy chủ ("Primary") chịu trách nhiệm thực hiện việc này.  [WAL](https://www.sqlite.org/wal.html) tăng tốc đáng kể khả năng đồng thời và cho phép một người ghi và nhiều người đọc.

Máy chủ Primary chạy trên các máy chủ dữ liệu với các ổ đĩa gắn chứa các hộp thư được mã hóa.  Về mặt phân phối, bạn có thể coi tất cả các máy chủ IMAP riêng lẻ phía sau `imap.forwardemail.net` là các máy chủ phụ ("Secondary").

Chúng tôi thực hiện giao tiếp hai chiều với [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Máy chủ Primary sử dụng một phiên bản của máy chủ `WebSocketServer` từ [ws](https://github.com/websockets/ws).
* Máy chủ Secondary sử dụng một phiên bản client `WebSocket` từ [ws](https://github.com/websockets/ws) được bao bọc bởi [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) và [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket). Hai lớp bao bọc này đảm bảo rằng `WebSocket` sẽ tự kết nối lại và có thể gửi và nhận dữ liệu cho các ghi cơ sở dữ liệu cụ thể.

### Sao lưu {#backups}

> **tldr;** Sao lưu các hộp thư được mã hóa của bạn được thực hiện hàng ngày. Bạn cũng có thể yêu cầu sao lưu mới ngay lập tức hoặc tải xuống bản sao lưu mới nhất bất cứ lúc nào từ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài Khoản Của Tôi <i class="fa fa-angle-right"></i> Tên Miền</a> <i class="fa fa-angle-right"></i> Bí Danh.

Đối với sao lưu, chúng tôi đơn giản chạy lệnh SQLite `VACUUM INTO` mỗi ngày trong quá trình xử lý lệnh IMAP, sử dụng mật khẩu mã hóa của bạn từ kết nối IMAP trong bộ nhớ. Sao lưu được lưu nếu không phát hiện bản sao lưu hiện có hoặc nếu hàm băm [SHA-256](https://en.wikipedia.org/wiki/SHA-2) của tệp đã thay đổi so với bản sao lưu gần nhất.

Lưu ý rằng chúng tôi sử dụng lệnh `VACUUM INTO` thay vì lệnh `backup` tích hợp sẵn vì nếu một trang bị sửa đổi trong quá trình thực hiện lệnh `backup`, thì nó phải bắt đầu lại. Lệnh `VACUUM INTO` sẽ chụp một ảnh chụp nhanh. Xem các bình luận này trên [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) và [Hacker News](https://news.ycombinator.com/item?id=31387556) để hiểu thêm.

Ngoài ra, chúng tôi sử dụng `VACUUM INTO` thay vì `backup`, vì lệnh `backup` sẽ để cơ sở dữ liệu không được mã hóa trong một khoảng thời gian ngắn cho đến khi `rekey` được gọi (xem bình luận GitHub này [comment](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) để hiểu thêm).

Máy chủ Secondary sẽ chỉ dẫn máy chủ Primary qua kết nối `WebSocket` để thực hiện sao lưu – và Primary sẽ nhận lệnh và sau đó:

1. Kết nối với hộp thư được mã hóa của bạn.
2. Chiếm quyền khóa ghi.
3. Thực hiện điểm kiểm tra WAL qua `wal_checkpoint(PASSIVE)`.
4. Chạy lệnh SQLite `VACUUM INTO`.
5. Đảm bảo tệp sao chép có thể mở được với mật khẩu mã hóa (bảo vệ/chống lỗi).
6. Tải lên Cloudflare R2 để lưu trữ (hoặc nhà cung cấp của bạn nếu được chỉ định).
<!--
7. Nén tệp sao lưu kết quả bằng `gzip`.
8. Tải lên Cloudflare R2 để lưu trữ (hoặc nhà cung cấp của bạn nếu được chỉ định).
-->

Hãy nhớ rằng các hộp thư của bạn được mã hóa – và mặc dù chúng tôi có các hạn chế IP và các biện pháp xác thực khác cho giao tiếp WebSocket – trong trường hợp có kẻ xấu, bạn có thể yên tâm rằng trừ khi payload WebSocket có mật khẩu IMAP của bạn, nó không thể mở cơ sở dữ liệu của bạn.

Hiện tại chỉ lưu trữ một bản sao lưu cho mỗi hộp thư, nhưng trong tương lai chúng tôi có thể cung cấp phục hồi điểm thời gian ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Tìm kiếm {#search}

Các máy chủ IMAP của chúng tôi hỗ trợ lệnh `SEARCH` với các truy vấn phức tạp, biểu thức chính quy và nhiều hơn nữa.

Hiệu suất tìm kiếm nhanh nhờ vào [FTS5](https://www.sqlite.org/fts5.html) và [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Chúng tôi lưu trữ các giá trị `Date` trong các hộp thư SQLite dưới dạng chuỗi [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) thông qua [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (với múi giờ UTC để các phép so sánh bằng nhau hoạt động đúng).

Các chỉ mục cũng được lưu cho tất cả các thuộc tính có trong các truy vấn tìm kiếm.

### Dự án {#projects}

Dưới đây là bảng liệt kê các dự án mà chúng tôi sử dụng trong mã nguồn và quy trình phát triển (sắp xếp theo thứ tự bảng chữ cái):

| Dự án                                                                                        | Mục đích                                                                                                                                                                                                                                                                                                                                                             |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/)                                                          | Nền tảng tự động hóa DevOps để duy trì, mở rộng và quản lý toàn bộ hệ thống máy chủ của chúng tôi một cách dễ dàng.                                                                                                                                                                                                                                                  |
| [Bree](https://github.com/breejs/bree)                                                       | Trình lập lịch công việc cho Node.js và JavaScript với hỗ trợ cron, dates, ms, later, và thân thiện với người dùng.                                                                                                                                                                                                                                                 |
| [Cabin](https://github.com/cabinjs/cabin)                                                    | Thư viện ghi log JavaScript và Node.js thân thiện với nhà phát triển, chú trọng bảo mật và quyền riêng tư.                                                                                                                                                                                                                                                          |
| [Lad](https://github.com/ladjs/lad)                                                          | Framework Node.js cung cấp toàn bộ kiến trúc và thiết kế kỹ thuật của chúng tôi với MVC và nhiều hơn nữa.                                                                                                                                                                                                                                                            |
| [MongoDB](https://www.mongodb.com/)                                                          | Giải pháp cơ sở dữ liệu NoSQL mà chúng tôi sử dụng để lưu trữ tất cả dữ liệu khác ngoài hộp thư (ví dụ: tài khoản của bạn, cài đặt, tên miền và cấu hình bí danh).                                                                                                                                                                                                 |
| [Mongoose](https://github.com/Automattic/mongoose)                                           | Mô hình đối tượng tài liệu MongoDB ("ODM") mà chúng tôi sử dụng trên toàn bộ hệ thống. Chúng tôi đã viết các trợ giúp đặc biệt cho phép chúng tôi tiếp tục sử dụng **Mongoose với SQLite** :tada:                                                                                                                                                               |
| [Node.js](https://nodejs.org/en)                                                             | Node.js là môi trường chạy JavaScript mã nguồn mở, đa nền tảng, chạy tất cả các tiến trình máy chủ của chúng tôi.                                                                                                                                                                                                                                                  |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                       | Gói Node.js để gửi email, tạo kết nối và nhiều hơn nữa. Chúng tôi là nhà tài trợ chính thức của dự án này.                                                                                                                                                                                                                                                          |
| [Redis](https://redis.io/)                                                                   | Cơ sở dữ liệu trong bộ nhớ để lưu cache, kênh publish/subscribe và các yêu cầu DNS qua HTTPS.                                                                                                                                                                                                                                                                        |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                   | Phần mở rộng mã hóa cho SQLite cho phép mã hóa toàn bộ tệp cơ sở dữ liệu (bao gồm cả write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)"), nhật ký, rollback, …).                                                                                                                                                                                              |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                  | Trình chỉnh sửa SQLite trực quan (mà bạn cũng có thể sử dụng) để thử nghiệm, tải xuống và xem các hộp thư phát triển.                                                                                                                                                                                                                                              |
| [SQLite](https://www.sqlite.org/about.html)                                                  | Lớp cơ sở dữ liệu nhúng cho lưu trữ IMAP có khả năng mở rộng, tự chứa, nhanh và bền bỉ.                                                                                                                                                                                                                                                                             |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                   | Công cụ chống spam, lọc email và ngăn chặn phishing cho Node.js (thay thế cho [Spam Assassin](https://spamassassin.apache.org/) và [rspamd](https://github.com/rspamd/rspamd)).                                                                                                                                                                                       |
| [Tangerine](https://tangeri.ne)                                                              | Yêu cầu DNS qua HTTPS với Node.js và lưu cache sử dụng Redis – đảm bảo tính nhất quán toàn cầu và nhiều hơn nữa.                                                                                                                                                                                                                                                     |
| [Thunderbird](https://www.thunderbird.net/)                                                  | Nhóm phát triển của chúng tôi sử dụng (và cũng khuyến nghị) đây là **ứng dụng email ưu tiên để sử dụng với Forward Email**.                                                                                                                                                                                                                                        |
| [UTM](https://github.com/utmapp/UTM)                                                         | Nhóm phát triển của chúng tôi sử dụng để tạo máy ảo cho iOS và macOS nhằm thử nghiệm các ứng dụng email khác nhau (song song) với các máy chủ IMAP và SMTP của chúng tôi.                                                                                                                                                                                         |
| [Ubuntu](https://ubuntu.com/download/server)                                                 | Hệ điều hành máy chủ dựa trên Linux mã nguồn mở hiện đại cung cấp năng lượng cho toàn bộ hạ tầng của chúng tôi.                                                                                                                                                                                                                                                     |
| [WildDuck](https://github.com/nodemailer/wildduck)                                           | Thư viện máy chủ IMAP – xem ghi chú về [loại bỏ trùng lặp tệp đính kèm](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) và [hỗ trợ giao thức IMAP](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md).                                                                                 |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Thư viện API nhanh và đơn giản cho Node.js để tương tác với SQLite3 theo lập trình.                                                                                                                                                                                                                                                                                |
| [email-templates](https://github.com/forwardemail/email-templates)                           | Framework email thân thiện với nhà phát triển để tạo, xem trước và gửi email tùy chỉnh (ví dụ: thông báo tài khoản và nhiều hơn nữa).                                                                                                                                                                                                                                |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                       | Trình tạo truy vấn SQL sử dụng cú pháp kiểu Mongo. Điều này giúp nhóm phát triển của chúng tôi tiết kiệm thời gian vì có thể tiếp tục viết theo kiểu Mongo trên toàn bộ hệ thống với cách tiếp cận không phụ thuộc vào cơ sở dữ liệu. **Nó cũng giúp tránh các cuộc tấn công SQL injection bằng cách sử dụng tham số truy vấn.**                                   |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                       | Tiện ích SQL để trích xuất thông tin về cấu trúc cơ sở dữ liệu hiện có. Điều này cho phép chúng tôi dễ dàng xác thực rằng tất cả các chỉ mục, bảng, cột, ràng buộc và nhiều hơn nữa đều hợp lệ và `1:1` với cách chúng nên có. Chúng tôi thậm chí đã viết các trợ giúp tự động để thêm cột và chỉ mục mới nếu có thay đổi trong cấu trúc cơ sở dữ liệu (với cảnh báo lỗi cực kỳ chi tiết). |
| [knex](https://github.com/knex/knex)                                                         | Trình tạo truy vấn SQL mà chúng tôi chỉ sử dụng cho các di cư cơ sở dữ liệu và xác thực cấu trúc thông qua `knex-schema-inspector`.                                                                                                                                                                                                                                  |
| [mandarin](https://github.com/ladjs/mandarin)                                                | Dịch cụm từ tự động [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) với hỗ trợ Markdown sử dụng [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest).                                                                                                                                                   |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                          | Gói Node.js để giải quyết và thiết lập kết nối với các máy chủ MX và xử lý lỗi.                                                                                                                                                                                                                                                                                     |
| [pm2](https://github.com/Unitech/pm2)                                                        | Trình quản lý tiến trình sản xuất Node.js với bộ cân bằng tải tích hợp ([được tinh chỉnh](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) để tăng hiệu suất).                                                                                                                                                                                     |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                     | Thư viện máy chủ SMTP – chúng tôi sử dụng cho các máy chủ trao đổi thư ("MX") và SMTP gửi đi.                                                                                                                                                                                                                                                                        |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                                | Công cụ hữu ích để kiểm tra các máy chủ IMAP theo các tiêu chuẩn và khả năng tương thích giao thức IMAP theo RFC. Dự án này được tạo bởi nhóm [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) (một máy chủ IMAP và POP3 mã nguồn mở hoạt động từ tháng 7 năm 2002). Chúng tôi đã kiểm tra kỹ lưỡng máy chủ IMAP của mình với công cụ này.                                   |
> Bạn có thể tìm thấy các dự án khác mà chúng tôi sử dụng trong [mã nguồn của chúng tôi trên GitHub](https://github.com/forwardemail).

### Nhà cung cấp {#providers}

| Nhà cung cấp                                     | Mục đích                                                                                                                     |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | Nhà cung cấp DNS, kiểm tra sức khỏe, cân bằng tải và lưu trữ dự phòng sử dụng [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [GitHub](https://github.com/)                   | Lưu trữ mã nguồn, CI/CD và quản lý dự án.                                                                                    |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Lưu trữ máy chủ chuyên dụng và cơ sở dữ liệu được quản lý.                                                                    |
| [Vultr](https://www.vultr.com/?ref=7429848)     | Lưu trữ máy chủ chuyên dụng.                                                                                                 |
| [DataPacket](https://www.datapacket.com)        | Lưu trữ máy chủ chuyên dụng.                                                                                                 |


## Suy nghĩ {#thoughts}

### Nguyên tắc {#principles}

Forward Email được thiết kế theo các nguyên tắc sau:

1. Luôn thân thiện với nhà phát triển, tập trung vào bảo mật và quyền riêng tư, và minh bạch.
2. Tuân thủ [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Twelve Factor](https://12factor.net/), [Occam's razor](https://en.wikipedia.org/wiki/Occam%27s_razor), và [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. Nhắm đến các nhà phát triển tự lực, khởi nghiệp và [lợi nhuận ramen](http://www.paulgraham.com/ramenprofitable.html)

### Thí nghiệm {#experiments}

> **tldr;** Cuối cùng việc sử dụng lưu trữ đối tượng tương thích S3 và/hoặc Bảng ảo về mặt kỹ thuật không khả thi vì lý do hiệu năng và dễ xảy ra lỗi do giới hạn bộ nhớ.

Chúng tôi đã thực hiện một vài thí nghiệm dẫn đến giải pháp SQLite cuối cùng như đã thảo luận ở trên.

Một trong số đó là thử sử dụng [rclone]() và SQLite cùng với lớp lưu trữ tương thích S3.

Thí nghiệm đó giúp chúng tôi hiểu rõ hơn và phát hiện các trường hợp đặc biệt liên quan đến rclone, SQLite và việc sử dụng [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* Nếu bạn bật cờ `--vfs-cache-mode writes` với rclone, thì việc đọc sẽ ổn, tuy nhiên việc ghi sẽ được lưu vào bộ nhớ đệm.
  * Nếu bạn có nhiều máy chủ IMAP phân phối toàn cầu, thì bộ nhớ đệm sẽ không đồng bộ giữa chúng trừ khi bạn có một người ghi duy nhất và nhiều người nghe (ví dụ như cách tiếp cận pub/sub).
  * Điều này cực kỳ phức tạp và thêm bất kỳ sự phức tạp nào như vậy sẽ dẫn đến nhiều điểm lỗi đơn lẻ hơn.
  * Các nhà cung cấp lưu trữ tương thích S3 không hỗ trợ thay đổi một phần tệp – điều này có nghĩa là bất kỳ thay đổi nào của tệp `.sqlite` sẽ dẫn đến thay đổi hoàn toàn và tải lại cơ sở dữ liệu.
  * Các giải pháp khác như `rsync` tồn tại, nhưng chúng không tập trung vào hỗ trợ ghi trước nhật ký ("[WAL](https://www.sqlite.org/wal.html)") – vì vậy chúng tôi đã xem xét Litestream. May mắn là việc sử dụng mã hóa của chúng tôi đã mã hóa các tệp [WAL](https://www.sqlite.org/wal.html), nên chúng tôi không cần dựa vào Litestream cho việc đó. Tuy nhiên, chúng tôi vẫn chưa tự tin về Litestream cho việc sử dụng sản xuất và có một vài ghi chú bên dưới về điều đó.
  * Sử dụng tùy chọn `--vfs-cache-mode writes` này (cách *duy nhất* để sử dụng SQLite qua `rclone` cho việc ghi) sẽ cố gắng sao chép toàn bộ cơ sở dữ liệu từ đầu trong bộ nhớ – xử lý một hộp thư 10 GB thì ổn, nhưng xử lý nhiều hộp thư với dung lượng lưu trữ cực lớn sẽ khiến các máy chủ IMAP gặp giới hạn bộ nhớ và lỗi `ENOMEM`, lỗi phân đoạn, và hỏng dữ liệu.
* Nếu bạn cố gắng sử dụng [Bảng ảo SQLite](https://www.sqlite.org/vtab.html) (ví dụ như sử dụng [s3db](https://github.com/jrhy/s3db)) để dữ liệu tồn tại trên lớp lưu trữ tương thích S3, thì bạn sẽ gặp thêm nhiều vấn đề:
  * Đọc và ghi sẽ cực kỳ chậm vì các điểm cuối API S3 sẽ cần được gọi bằng các phương thức HTTP `GET`, `PUT`, `HEAD`, và `POST`.
  * Các thử nghiệm phát triển cho thấy vượt quá 500K-1M+ bản ghi trên internet cáp quang vẫn bị giới hạn bởi tốc độ ghi và đọc đến các nhà cung cấp tương thích S3. Ví dụ, các nhà phát triển của chúng tôi đã chạy các vòng `for` để thực hiện cả các câu lệnh SQL `INSERT` tuần tự và các câu lệnh ghi hàng loạt lượng lớn dữ liệu. Trong cả hai trường hợp, hiệu năng đều rất chậm.
  * Bảng ảo **không thể có chỉ mục**, các câu lệnh `ALTER TABLE`, và [các](https://stackoverflow.com/a/12507650) [giới hạn](https://sqlite.org/lang_createvtab.html) khác – dẫn đến độ trễ lên đến 1-2 phút hoặc hơn tùy thuộc vào lượng dữ liệu.
  * Các đối tượng được lưu trữ không mã hóa và không có hỗ trợ mã hóa gốc sẵn có.
* Chúng tôi cũng đã khám phá việc sử dụng [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs) tương tự về mặt khái niệm và kỹ thuật với điểm trên (vì vậy nó có cùng các vấn đề). Một khả năng là sử dụng bản dựng `sqlite3` tùy chỉnh được bọc với mã hóa như [wxSQLite3](https://github.com/utelle/wxsqlite3) (mà chúng tôi hiện đang sử dụng trong giải pháp ở trên) thông qua [chỉnh sửa tệp thiết lập](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276).
* Một cách tiếp cận tiềm năng khác là sử dụng [phần mở rộng multiplex](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c), tuy nhiên nó có giới hạn 32 GB và sẽ yêu cầu xây dựng phức tạp và gây đau đầu trong phát triển.
* Các câu lệnh `ALTER TABLE` là cần thiết (vì vậy điều này hoàn toàn loại trừ việc sử dụng Bảng ảo). Chúng tôi cần các câu lệnh `ALTER TABLE` để hook với `knex-schema-inspector` hoạt động đúng – đảm bảo dữ liệu không bị hỏng và các hàng truy xuất có thể được chuyển đổi thành các tài liệu hợp lệ theo định nghĩa schema `mongoose` của chúng tôi (bao gồm ràng buộc, kiểu biến và xác thực dữ liệu tùy ý).
* Hầu hết các dự án tương thích S3 liên quan đến SQLite trong cộng đồng mã nguồn mở đều bằng Python (chứ không phải JavaScript mà chúng tôi sử dụng cho 100% stack).
* Các thư viện nén như [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (xem [bình luận](https://news.ycombinator.com/item?id=32303762)) có vẻ hứa hẹn, nhưng [có thể chưa sẵn sàng cho sử dụng sản xuất](https://github.com/phiresky/sqlite-zstd#usage). Thay vào đó, nén phía ứng dụng trên các kiểu dữ liệu như `String`, `Object`, `Map`, `Array`, `Set`, và `Buffer` sẽ là cách tiếp cận sạch hơn và dễ dàng hơn (và cũng dễ di chuyển hơn, vì chúng tôi có thể lưu một cờ `Boolean` hoặc cột – hoặc thậm chí dùng `PRAGMA` `user_version=1` cho nén hoặc `user_version=0` cho không nén như metadata cơ sở dữ liệu).
  * May mắn là chúng tôi đã triển khai loại bỏ trùng lặp tệp đính kèm trong lưu trữ máy chủ IMAP – do đó mỗi tin nhắn có cùng tệp đính kèm sẽ không giữ bản sao của tệp đính kèm – thay vào đó một tệp đính kèm duy nhất được lưu cho nhiều tin nhắn và luồng trong một hộp thư (và tham chiếu ngoại được sử dụng sau đó).
* Dự án Litestream, một giải pháp sao chép và sao lưu SQLite, rất hứa hẹn và chúng tôi rất có thể sẽ sử dụng nó trong tương lai.
  * Không phải để phủ nhận tác giả – vì chúng tôi yêu thích công việc và đóng góp của họ cho mã nguồn mở hơn một thập kỷ nay – tuy nhiên từ việc sử dụng thực tế có vẻ như [có nhiều vấn đề đau đầu](https://github.com/benbjohnson/litestream/issues) và [có khả năng mất dữ liệu khi sử dụng](https://github.com/benbjohnson/litestream/issues/218).
* Việc phục hồi sao lưu cần phải dễ dàng và đơn giản. Sử dụng giải pháp như MongoDB với `mongodump` và `mongoexport` không chỉ tẻ nhạt mà còn tốn thời gian và có độ phức tạp cấu hình.
  * Cơ sở dữ liệu SQLite làm điều đó đơn giản (nó chỉ là một tệp duy nhất).
  * Chúng tôi muốn thiết kế một giải pháp để người dùng có thể lấy hộp thư của họ và rời đi bất cứ lúc nào.
    * Các lệnh Node.js đơn giản như `fs.unlink('mailbox.sqlite'))` và nó sẽ bị xóa vĩnh viễn khỏi bộ nhớ đĩa.
    * Chúng tôi cũng có thể sử dụng API tương thích S3 với HTTP `DELETE` để dễ dàng xóa các snapshot và bản sao lưu cho người dùng.
  * SQLite là giải pháp đơn giản nhất, nhanh nhất và tiết kiệm chi phí nhất.
### Thiếu các lựa chọn thay thế {#lack-of-alternatives}

Theo hiểu biết của chúng tôi, không có dịch vụ email nào khác được thiết kế theo cách này cũng như không phải là mã nguồn mở.

Chúng tôi *nghĩ rằng điều này có thể là do* các dịch vụ email hiện có đang sử dụng công nghệ cũ trong sản xuất với [mã spaghetti](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

Hầu hết nếu không muốn nói là tất cả các nhà cung cấp dịch vụ email hiện có đều là mã nguồn đóng hoặc quảng cáo là mã nguồn mở, **nhưng thực tế chỉ có phần giao diện người dùng (front-end) của họ là mã nguồn mở.**

**Phần nhạy cảm nhất của email** (phần lưu trữ thực tế/tương tác IMAP/SMTP) **đều được thực hiện ở phía máy chủ (back-end), và *không* phải ở phía giao diện người dùng (client).**

### Thử dùng Forward Email {#try-out-forward-email}

Đăng ký ngay hôm nay tại <https://forwardemail.net>! :rocket:
