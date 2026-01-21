# Email chống lượng tử: Cách chúng tôi sử dụng hộp thư SQLite được mã hóa để giữ an toàn cho email của bạn {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="" class="rounded-lg" />

## Mục lục {#table-of-contents}

* [Lời nói đầu](#foreword)
* [So sánh nhà cung cấp dịch vụ email](#email-service-provider-comparison)
* [Nó hoạt động như thế nào](#how-does-it-work)
* [Công nghệ](#technologies)
  * [Cơ sở dữ liệu](#databases)
  * [Bảo vệ](#security)
  * [Hộp thư](#mailboxes)
  * [Đồng thời](#concurrency)
  * [Sao lưu](#backups)
  * [Tìm kiếm](#search)
  * [Dự án](#projects)
  * [Nhà cung cấp](#providers)
* [Suy nghĩ](#thoughts)
  * [Nguyên tắc](#principles)
  * [Thí nghiệm](#experiments)
  * [Thiếu các giải pháp thay thế](#lack-of-alternatives)
  * [Hãy thử Chuyển tiếp Email](#try-out-forward-email)

## Lời nói đầu {#foreword}

> \[!IMPORTANT]
> Dịch vụ email của chúng tôi là [100% mã nguồn mở](https://github.com/forwardemail) và tập trung vào quyền riêng tư thông qua hộp thư SQLite an toàn và được mã hóa.

Cho đến khi chúng tôi ra mắt [Hỗ trợ IMAP](/faq#do-you-support-receiving-email-with-imap), chúng tôi đã sử dụng MongoDB cho nhu cầu lưu trữ dữ liệu lâu dài của mình.

Công nghệ này thật tuyệt vời và chúng ta vẫn sử dụng nó cho đến ngày nay – nhưng để có thể mã hóa dữ liệu khi lưu trữ với MongoDB, bạn cần sử dụng nhà cung cấp cung cấp MongoDB Enterprise, chẳng hạn như Digital Ocean hoặc Mongo Atlas – hoặc trả phí cho giấy phép doanh nghiệp (và sau đó phải làm việc với độ trễ của nhóm bán hàng).

Nhóm [Chuyển tiếp Email](https://forwardemail.net) của chúng tôi cần một giải pháp lưu trữ thân thiện với nhà phát triển, có khả năng mở rộng, đáng tin cậy và được mã hóa cho hộp thư IMAP. Là các nhà phát triển mã nguồn mở, việc sử dụng một công nghệ đòi hỏi phải trả phí bản quyền để có được tính năng mã hóa khi không hoạt động là điều bất lợi cho [nguyên tắc của chúng tôi](#principles) – vì vậy chúng tôi đã thử nghiệm, nghiên cứu và phát triển một giải pháp hoàn toàn mới để giải quyết những nhu cầu này.

Thay vì sử dụng cơ sở dữ liệu dùng chung để lưu trữ hộp thư của bạn, chúng tôi sẽ lưu trữ và mã hóa riêng từng hộp thư bằng mật khẩu của bạn (chỉ bạn mới có). **Dịch vụ email của chúng tôi an toàn đến mức nếu bạn quên mật khẩu, bạn sẽ mất hộp thư** (và cần khôi phục bằng bản sao lưu ngoại tuyến hoặc bắt đầu lại).

Hãy tiếp tục đọc khi chúng tôi đi sâu vào phân tích bên dưới với [so sánh các nhà cung cấp dịch vụ email](#email-service-provider-comparison), [dịch vụ của chúng tôi hoạt động như thế nào](#how-does-it-work), [công nghệ của chúng tôi](#technologies) và nhiều hơn nữa.

## So sánh nhà cung cấp dịch vụ email {#email-service-provider-comparison}

Chúng tôi là nhà cung cấp dịch vụ email duy nhất 100% mã nguồn mở và tập trung vào quyền riêng tư, lưu trữ các hộp thư SQLite được mã hóa riêng lẻ, cung cấp tên miền, bí danh và người dùng không giới hạn và hỗ trợ SMTP, IMAP và POP3 gửi đi:

**Không giống như các nhà cung cấp dịch vụ email khác, bạn không cần phải trả phí lưu trữ theo tên miền hoặc bí danh với Forward Email.** Dung lượng lưu trữ được chia sẻ trên toàn bộ tài khoản của bạn – vì vậy nếu bạn có nhiều tên miền tùy chỉnh và nhiều bí danh trên mỗi tên miền, thì chúng tôi là giải pháp hoàn hảo dành cho bạn. Lưu ý rằng bạn vẫn có thể áp dụng giới hạn lưu trữ theo tên miền hoặc bí danh nếu muốn.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Đọc So sánh Dịch vụ Email <i class="fa fa-search-plus"></i></a>

## Nó hoạt động như thế nào {#how-does-it-work}

1. Sử dụng ứng dụng email như Apple Mail, Betterbird, Gmail hoặc Outlook – bạn kết nối với máy chủ [IMAP](/faq#do-you-support-receiving-email-with-imap) an toàn của chúng tôi bằng tên người dùng và mật khẩu của bạn:

* Tên người dùng của bạn là bí danh đầy đủ với tên miền của bạn, chẳng hạn như `hello@example.com`.
* Mật khẩu của bạn được tạo ngẫu nhiên và chỉ hiển thị cho bạn trong 30 giây khi bạn nhấp vào <strong class="text-success"><i class="fa fa-key"></i> Tạo mật khẩu</strong> từ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh.

2. Sau khi kết nối, ứng dụng email của bạn sẽ gửi [Các lệnh giao thức IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) đến máy chủ IMAP của chúng tôi để đồng bộ hóa hộp thư của bạn. Điều này bao gồm việc soạn thảo và lưu trữ email nháp cũng như các thao tác khác mà bạn có thể thực hiện (ví dụ: gắn nhãn email là Quan trọng hoặc đánh dấu email là Thư rác/Thư rác).

3. Máy chủ trao đổi thư (thường được gọi là máy chủ "MX") nhận email mới đến và lưu trữ vào hộp thư của bạn. Khi điều này xảy ra, ứng dụng email của bạn sẽ được thông báo và đồng bộ hóa hộp thư. Máy chủ trao đổi thư của chúng tôi có thể chuyển tiếp email của bạn đến một hoặc nhiều người nhận (bao gồm cả [webhook](/faq#do-you-support-webhooks)), lưu trữ email của bạn trong bộ nhớ IMAP được mã hóa của chúng tôi, **hoặc cả hai**!

> \[!TIP]
> Bạn muốn tìm hiểu thêm? Đọc [cách thiết lập chuyển tiếp email](/faq#how-do-i-get-started-and-set-up-email-forwarding), [dịch vụ trao đổi thư của chúng tôi hoạt động như thế nào](/faq#how-does-your-email-forwarding-system-work) hoặc xem [hướng dẫn của chúng tôi](/guides).

4. Về cơ bản, thiết kế lưu trữ email an toàn của chúng tôi hoạt động theo hai cách để giữ cho hộp thư của bạn được mã hóa và chỉ bạn mới có thể truy cập:

* Khi nhận được thư mới từ người gửi, máy chủ trao đổi thư của chúng tôi sẽ ghi vào hộp thư riêng, tạm thời và được mã hóa cho bạn.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

* Khi bạn kết nối với máy chủ IMAP của chúng tôi bằng ứng dụng email, mật khẩu của bạn sẽ được mã hóa trong bộ nhớ và được sử dụng để đọc và ghi vào hộp thư. Hộp thư của bạn chỉ có thể được đọc và ghi bằng mật khẩu này. Xin lưu ý rằng vì bạn là người duy nhất có mật khẩu này, **chỉ bạn** mới có thể đọc và ghi vào hộp thư khi bạn truy cập. Lần tới khi ứng dụng email của bạn thử kiểm tra thư hoặc đồng bộ hóa, thư mới của bạn sẽ được chuyển từ hộp thư tạm thời này và lưu trữ trong tệp hộp thư thực tế của bạn bằng mật khẩu bạn đã cung cấp. Lưu ý rằng hộp thư tạm thời này sẽ được xóa và xóa sau đó để chỉ hộp thư được bảo vệ bằng mật khẩu của bạn mới có thư.

* **Nếu bạn đang kết nối với IMAP (ví dụ: sử dụng ứng dụng email như Apple Mail hoặc Betterbird), chúng tôi không cần ghi vào bộ nhớ tạm thời. Thay vào đó, mật khẩu IMAP được mã hóa trong bộ nhớ của bạn sẽ được lấy và sử dụng. Trong thời gian thực, khi một thư đang được gửi đến bạn, chúng tôi sẽ gửi một yêu cầu WebSocket đến tất cả các máy chủ IMAP để hỏi xem chúng có phiên làm việc nào đang hoạt động với bạn không (đây là phần lấy thư), và sau đó sẽ chuyển tiếp mật khẩu được mã hóa trong bộ nhớ đó – vì vậy chúng tôi không cần ghi vào hộp thư tạm thời, chúng tôi có thể ghi vào hộp thư mã hóa thực tế của bạn bằng mật khẩu đã mã hóa.**

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

5. [Sao lưu hộp thư được mã hóa của bạn](#backups) được tạo hàng ngày. Bạn cũng có thể yêu cầu bản sao lưu mới bất cứ lúc nào hoặc tải xuống bản sao lưu mới nhất từ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh. Nếu bạn quyết định chuyển sang dịch vụ email khác, bạn có thể dễ dàng di chuyển, tải xuống, xuất và xóa hộp thư và bản sao lưu bất cứ lúc nào.

## Công nghệ {#technologies}

### Cơ sở dữ liệu {#databases}

Chúng tôi đã khám phá các lớp lưu trữ cơ sở dữ liệu khả thi khác, tuy nhiên không có lớp nào đáp ứng được yêu cầu của chúng tôi nhiều như SQLite:

| Cơ sở dữ liệu | Mã hóa khi nghỉ | [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Hộp thư | Giấy phép | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: | :white_check_mark: Có với [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | :white_check_mark: | :white_check_mark: Miền công cộng | :white_check_mark: |
| [MongoDB](https://www.mongodb.com/) | :x: ["Available in MongoDB Enterprise only"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/) | :x: Cơ sở dữ liệu quan hệ | :x: AGPL và `SSPL-1.0` | :x: |
| [rqlite](https://github.com/rqlite/rqlite) | :x: [Network only](https://github.com/rqlite/rqlite/issues/1406) | :x: Cơ sở dữ liệu quan hệ | :white_check_mark: __MÃ_TÔ_0__ | :x: |
| [dqlite](https://dqlite.io/) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :white_check_mark: __MÃ_TÔ_0__ | :x: |
| [PostgreSQL](https://www.postgresql.org/) | :white_check_mark: [Yes](https://www.postgresql.org/docs/current/encryption-options.html) | :x: Cơ sở dữ liệu quan hệ | :white_check_mark: `PostgreSQL` (tương tự như `BSD` hoặc `MIT`) | :x: |
| [MariaDB](https://mariadb.com/) | :white_check_mark: [For InnoDB only](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) | :x: Cơ sở dữ liệu quan hệ | :white_check_mark: `GPLv2` và `BUSL-1.1` | :x: |
| [CockroachDB](https://www.cockroachlabs.com/product/) | :x: [Enterprise-only feature](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing) | :x: Cơ sở dữ liệu quan hệ | :x: `BUSL-1.1` và những cái khác | :x: |

> Đây là [bài đăng trên blog so sánh một số tùy chọn lưu trữ cơ sở dữ liệu SQLite](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) trong bảng ở trên.

### Bảo mật {#security}

Chúng tôi luôn sử dụng mã hóa [mã hóa khi nghỉ ngơi](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [mã hóa trong quá trình chuyển tiếp](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS qua HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") bằng cách sử dụng mã hóa :tangerine: [Quýt](https://tangeri.ne) và [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) trên hộp thư. Ngoài ra, chúng tôi sử dụng xác thực hai yếu tố dựa trên mã thông báo (thay vì SMS, vốn dễ bị nghi ngờ là [tấn công trung gian](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), khóa SSH được luân chuyển với quyền truy cập root bị vô hiệu hóa, quyền truy cập độc quyền vào máy chủ thông qua địa chỉ IP bị hạn chế, v.v.

Trong trường hợp [cuộc tấn công của người hầu gái độc ác](https://en.wikipedia.org/wiki/Evil_maid_attack) hoặc nhân viên gian lận từ nhà cung cấp bên thứ ba, **hộp thư của bạn vẫn chỉ có thể được mở bằng mật khẩu bạn đã tạo**. Xin hãy yên tâm, chúng tôi không dựa vào bất kỳ nhà cung cấp bên thứ ba nào ngoài các nhà cung cấp máy chủ tuân thủ SOC Loại 2 của chúng tôi là Cloudflare, DataPacket, Digital Ocean và Vultr.

Mục tiêu của chúng tôi là có càng ít [điểm lỗi duy nhất](https://en.wikipedia.org/wiki/Single_point_of_failure) càng tốt.

### Hộp thư {#mailboxes}

> **tldr;** Máy chủ IMAP của chúng tôi sử dụng cơ sở dữ liệu SQLite được mã hóa riêng cho từng hộp thư của bạn.

Cơ sở dữ liệu nhúng [SQLite là một ngôn ngữ cực kỳ phổ biến](https://www.sqlite.org/mostdeployed.html) – hiện đang chạy trên điện thoại và máy tính của bạn – [và được sử dụng bởi hầu hết các công nghệ chính](https://www.sqlite.org/famous.html).

Ví dụ, trên các máy chủ được mã hóa của chúng tôi, có một hộp thư cơ sở dữ liệu SQLite cho `linux@example.com`, `info@example.com`, `hello@example.com`, v.v. - mỗi hộp thư có một tệp cơ sở dữ liệu `.sqlite`. Chúng tôi cũng không đặt tên tệp cơ sở dữ liệu bằng địa chỉ email - thay vào đó, chúng tôi sử dụng BSON ObjectID và các UUID duy nhất được tạo ra, không chia sẻ thông tin về chủ sở hữu hộp thư hoặc địa chỉ email mà hộp thư đó thuộc về (ví dụ: `353a03f21e534321f5d6e267.sqlite`).

Mỗi cơ sở dữ liệu này đều được mã hóa bằng mật khẩu của bạn (chỉ bạn mới có) với [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Điều này có nghĩa là các hộp thư của bạn được mã hóa riêng lẻ, độc lập, [hộp cát](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) và có thể di động.

Chúng tôi đã tinh chỉnh SQLite với [PRAGMA](https://www.sqlite.org/pragma.html) sau:

| `PRAGMA` | Mục đích |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20` | [ChaCha20-Poly1305 SQLite database encryption](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Tham khảo `better-sqlite3-multiple-ciphers` trong [Projects](#projects) để hiểu rõ hơn. |
| `key="****************"` | Đây là mật khẩu được giải mã chỉ lưu trong bộ nhớ của bạn, được truyền qua kết nối IMAP của ứng dụng email đến máy chủ của chúng tôi. Các phiên bản cơ sở dữ liệu mới sẽ được tạo và đóng cho mỗi phiên đọc và ghi (để đảm bảo hộp cát và cô lập). |
| `journal_model=WAL` | Nhật ký ghi trước ("[WAL](https://www.sqlite.org/wal.html)") [which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode). |
| `busy_timeout=5000` | Ngăn chặn lỗi khóa ghi [while other writes are taking place](https://litestream.io/tips/#busy-timeout). |
| `synchronous=NORMAL` | Tăng độ bền của giao dịch [without data corruption risk](https://litestream.io/tips/#synchronous-pragma). |
| `foreign_keys=ON` | Thực thi các tham chiếu khóa ngoại (ví dụ: mối quan hệ từ bảng này sang bảng khác). [By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html), nhưng để xác thực và toàn vẹn dữ liệu thì phải bật tính năng này. |
| `encoding='UTF-8'` | [Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding) để đảm bảo sự minh bạch cho nhà phát triển. |

> Tất cả các giá trị mặc định khác đều từ SQLite như được chỉ định từ [tài liệu PRAGMA chính thức](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Đồng thời {#concurrency}

> **tldr;** Chúng tôi sử dụng `WebSocket` để đọc và ghi đồng thời vào hộp thư SQLite được mã hóa của bạn.

#### Đọc {#reads}

Ứng dụng email trên điện thoại của bạn có thể phân giải `imap.forwardemail.net` thành một trong các địa chỉ IP Digital Ocean của chúng tôi – và ứng dụng máy tính để bàn của bạn có thể phân giải một IP riêng biệt từ một [nhà cung cấp](#providers) hoàn toàn khác.

Bất kể máy chủ IMAP nào mà ứng dụng email của bạn kết nối, chúng tôi đều muốn kết nối được đọc từ cơ sở dữ liệu của bạn theo thời gian thực với độ chính xác 100%. Điều này được thực hiện thông qua WebSockets.

#### Ghi {#writes}

Việc ghi vào cơ sở dữ liệu của bạn hơi khác một chút – vì SQLite là cơ sở dữ liệu nhúng và hộp thư của bạn mặc định nằm trong một tệp duy nhất.

Chúng tôi đã khám phá các tùy chọn như `litestream`, `rqlite` và `dqlite` bên dưới – tuy nhiên không có tùy chọn nào đáp ứng được yêu cầu của chúng tôi.

Để thực hiện ghi với tính năng ghi trước ("[WAL](https://www.sqlite.org/wal.html)") được bật – chúng ta cần đảm bảo rằng chỉ có một máy chủ ("Chính") chịu trách nhiệm thực hiện việc này. [WAL](https://www.sqlite.org/wal.html) tăng tốc đáng kể khả năng đồng thời và cho phép một trình ghi và nhiều trình đọc.

Máy chủ chính đang chạy trên các máy chủ dữ liệu với các ổ đĩa được gắn kết chứa các hộp thư được mã hóa. Về mặt phân phối, bạn có thể coi tất cả các máy chủ IMAP riêng lẻ đằng sau `imap.forwardemail.net` là máy chủ thứ cấp ("Thứ cấp").

Chúng tôi thực hiện giao tiếp hai chiều với [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Máy chủ chính sử dụng phiên bản máy chủ `WebSocketServer` của [tuần](https://github.com/websockets/ws).
* Máy chủ phụ sử dụng phiên bản máy khách `WebSocket` của [tuần](https://github.com/websockets/ws) được đóng gói với [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) và [kết nối lại-websocket](https://github.com/opensumi/reconnecting-websocket). Hai lớp đóng gói này đảm bảo `WebSocket` kết nối lại và có thể gửi và nhận dữ liệu cho các lần ghi cơ sở dữ liệu cụ thể.

### Sao lưu {#backups}

> **tldr;** Các hộp thư được mã hóa của bạn sẽ được sao lưu hàng ngày. Bạn cũng có thể yêu cầu sao lưu mới ngay lập tức hoặc tải xuống bản sao lưu mới nhất bất cứ lúc nào từ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh.

Đối với bản sao lưu, chúng tôi chỉ cần chạy lệnh SQLite `VACUUM INTO` mỗi ngày trong quá trình xử lý lệnh IMAP, lệnh này sẽ tận dụng mật khẩu được mã hóa của bạn từ kết nối IMAP trong bộ nhớ. Bản sao lưu được lưu trữ nếu không phát hiện bản sao lưu nào hiện có hoặc nếu hàm băm [SHA-256](https://en.wikipedia.org/wiki/SHA-2) trên tệp đã thay đổi so với bản sao lưu gần đây nhất.

Lưu ý rằng chúng tôi sử dụng lệnh `VACUUM INTO` thay vì lệnh `backup` tích hợp sẵn vì nếu một trang bị sửa đổi trong quá trình thực hiện lệnh `backup`, nó sẽ phải bắt đầu lại từ đầu. Lệnh `VACUUM INTO` sẽ chụp ảnh nhanh. Xem các bình luận về [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) và [Tin tức Hacker](https://news.ycombinator.com/item?id=31387556) để biết thêm chi tiết.

Ngoài ra, chúng tôi sử dụng `VACUUM INTO` thay vì `backup`, vì lệnh `backup` sẽ không mã hóa cơ sở dữ liệu trong một khoảng thời gian ngắn cho đến khi `rekey` được gọi (xem GitHub [bình luận](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) này để biết thêm thông tin chi tiết).

Thiết bị thứ cấp sẽ hướng dẫn thiết bị chính thông qua kết nối `WebSocket` thực hiện sao lưu – và sau đó thiết bị chính sẽ nhận được lệnh để thực hiện việc sao lưu và sẽ:

1. Kết nối với hộp thư được mã hóa của bạn.
2. Thiết lập khóa ghi.
3. Chạy điểm kiểm tra WAL thông qua `wal_checkpoint(PASSIVE)`.
4. Chạy lệnh `VACUUM INTO` SQLite.
5. Đảm bảo rằng tệp đã sao chép có thể được mở bằng mật khẩu đã mã hóa (bảo vệ/chống giả mạo).
6. Tải tệp lên Cloudflare R2 để lưu trữ (hoặc nhà cung cấp dịch vụ của riêng bạn nếu được chỉ định).

<!--
7. Nén tệp sao lưu kết quả bằng `gzip`.
8. Tải tệp lên Cloudflare R2 để lưu trữ (hoặc nhà cung cấp dịch vụ của bạn nếu được chỉ định).
-->

Hãy nhớ rằng hộp thư của bạn được mã hóa – và mặc dù chúng tôi có các hạn chế về IP và các biện pháp xác thực khác dành cho giao tiếp WebSocket – trong trường hợp có kẻ xấu, bạn có thể yên tâm rằng trừ khi tải trọng WebSocket có mật khẩu IMAP của bạn, nếu không thì nó không thể mở cơ sở dữ liệu của bạn.

Hiện tại, chỉ có một bản sao lưu được lưu trữ cho mỗi hộp thư, nhưng trong tương lai, chúng tôi có thể cung cấp tính năng khôi phục tại một thời điểm ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Tìm kiếm {#search}

Máy chủ IMAP của chúng tôi hỗ trợ lệnh `SEARCH` với các truy vấn phức tạp, biểu thức chính quy, v.v.

Hiệu suất tìm kiếm nhanh là nhờ [FTS5](https://www.sqlite.org/fts5.html) và [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Chúng tôi lưu trữ các giá trị `Date` trong hộp thư SQLite dưới dạng chuỗi [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) thông qua [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (với múi giờ UTC để so sánh bằng nhau hoạt động bình thường).

Chỉ mục cũng được lưu trữ cho tất cả các thuộc tính có trong truy vấn tìm kiếm.

### Dự án {#projects}

Sau đây là bảng tóm tắt các dự án chúng tôi sử dụng trong mã nguồn và quy trình phát triển (sắp xếp theo thứ tự bảng chữ cái):

| Dự án | Mục đích |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/) | Nền tảng tự động hóa DevOps giúp bảo trì, mở rộng quy mô và quản lý toàn bộ đội máy chủ của chúng tôi một cách dễ dàng. |
| [Bree](https://github.com/breejs/bree) | Trình lập lịch công việc cho Node.js và JavaScript với cron, ngày, ms, sau đó và hỗ trợ thân thiện với con người. |
| [Cabin](https://github.com/cabinjs/cabin) | Thư viện ghi nhật ký JavaScript và Node.js thân thiện với nhà phát triển, chú trọng đến bảo mật và quyền riêng tư. |
| [Lad](https://github.com/ladjs/lad) | Khung Node.js hỗ trợ toàn bộ thiết kế kiến trúc và kỹ thuật của chúng tôi với MVC và nhiều tính năng khác. |
| [MongoDB](https://www.mongodb.com/) | Giải pháp cơ sở dữ liệu NoSQL mà chúng tôi sử dụng để lưu trữ mọi dữ liệu khác bên ngoài hộp thư (ví dụ: tài khoản, cài đặt, tên miền và cấu hình bí danh của bạn). |
| [Mongoose](https://github.com/Automattic/mongoose) | Mô hình hóa tài liệu đối tượng MongoDB ("ODM") mà chúng tôi sử dụng trên toàn bộ ngăn xếp. Chúng tôi đã viết các trình trợ giúp đặc biệt cho phép chúng tôi tiếp tục sử dụng **Mongoose với SQLite** :tada: |
| [Node.js](https://nodejs.org/en) | Node.js là môi trường chạy JavaScript mã nguồn mở, đa nền tảng, chạy tất cả các quy trình máy chủ của chúng tôi. |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | Gói Node.js để gửi email, tạo kết nối và nhiều tính năng khác. Chúng tôi là nhà tài trợ chính thức của dự án này. |
| [Redis](https://redis.io/) | Cơ sở dữ liệu trong bộ nhớ để lưu trữ đệm, xuất bản/đăng ký kênh và yêu cầu DNS qua HTTPS. |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | Phần mở rộng mã hóa cho SQLite cho phép mã hóa toàn bộ tệp cơ sở dữ liệu (bao gồm nhật ký ghi trước ("[WAL](https://www.sqlite.org/wal.html)"), nhật ký, khôi phục, …). |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio) | Trình soạn thảo Visual SQLite (bạn cũng có thể sử dụng) để kiểm tra, tải xuống và xem hộp thư phát triển. |
| [SQLite](https://www.sqlite.org/about.html) | Lớp cơ sở dữ liệu nhúng cho khả năng lưu trữ IMAP nhanh chóng, có khả năng mở rộng, độc lập và linh hoạt. |
| [Spam Scanner](https://github.com/spamscanner/spamscanner) | Công cụ chống thư rác, lọc email và ngăn chặn lừa đảo của Node.js (giải pháp thay thế cho [Spam Assassin](https://spamassassin.apache.org/) và [rspamd](https://github.com/rspamd/rspamd)). |
| [Tangerine](https://tangeri.ne) | Yêu cầu DNS qua HTTPS với Node.js và lưu trữ đệm bằng Redis – đảm bảo tính nhất quán toàn cầu và nhiều tính năng khác. |
| [Betterbird](https://betterbird.eu/) | Nhóm phát triển của chúng tôi sử dụng (và cũng khuyến nghị) ứng dụng này làm **ứng dụng email được ưu tiên sử dụng với Forward Email**. |
| [UTM](https://github.com/utmapp/UTM) | Nhóm phát triển của chúng tôi sử dụng công cụ này để tạo máy ảo cho iOS và macOS nhằm thử nghiệm nhiều ứng dụng email khác nhau (song song) với máy chủ IMAP và SMTP của chúng tôi. |
| [Ubuntu](https://ubuntu.com/download/server) | Hệ điều hành máy chủ mã nguồn mở hiện đại chạy trên nền tảng Linux, cung cấp năng lượng cho toàn bộ cơ sở hạ tầng của chúng tôi. |
| [WildDuck](https://github.com/nodemailer/wildduck) | Thư viện máy chủ IMAP – xem ghi chú về [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) và [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md). |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Thư viện API nhanh và đơn giản để Node.js tương tác với SQLite3 theo cách lập trình. |
| [email-templates](https://github.com/forwardemail/email-templates) | Khung email thân thiện với nhà phát triển để tạo, xem trước và gửi email tùy chỉnh (ví dụ: thông báo tài khoản, v.v.). |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced) | Trình xây dựng truy vấn SQL sử dụng cú pháp kiểu Mongo. Điều này giúp nhóm phát triển của chúng tôi tiết kiệm thời gian vì chúng tôi có thể tiếp tục viết theo kiểu Mongo trên toàn bộ ngăn xếp với phương pháp tiếp cận độc lập với cơ sở dữ liệu. **Nó cũng giúp tránh các cuộc tấn công SQL injection bằng cách sử dụng tham số truy vấn.** |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector) | Tiện ích SQL để trích xuất thông tin về lược đồ cơ sở dữ liệu hiện có. Điều này cho phép chúng tôi dễ dàng xác thực tất cả chỉ mục, bảng, cột, ràng buộc, v.v. đều hợp lệ và đúng với `1:1`. Chúng tôi thậm chí còn viết các trình trợ giúp tự động để thêm cột và chỉ mục mới nếu có thay đổi đối với lược đồ cơ sở dữ liệu (cùng với cảnh báo lỗi cực kỳ chi tiết). |
| [knex](https://github.com/knex/knex) | Trình xây dựng truy vấn SQL mà chúng tôi chỉ sử dụng để di chuyển cơ sở dữ liệu và xác thực lược đồ thông qua `knex-schema-inspector`. |
| [mandarin](https://github.com/ladjs/mandarin) | Dịch cụm từ [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) tự động với sự hỗ trợ cho Markdown bằng cách sử dụng [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest). |
| [mx-connect](https://github.com/zone-eu/mx-connect) | Gói Node.js để giải quyết và thiết lập kết nối với máy chủ MX và xử lý lỗi. |
| [pm2](https://github.com/Unitech/pm2) | Trình quản lý quy trình sản xuất Node.js với bộ cân bằng tải tích hợp ([fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) để tăng hiệu suất). |
| [smtp-server](https://github.com/nodemailer/smtp-server) | Thư viện máy chủ SMTP – chúng tôi sử dụng thư viện này cho máy chủ trao đổi thư ("MX") và máy chủ SMTP gửi đi. |
| [ImapTest](https://www.imapwiki.org/ImapTest) | Công cụ hữu ích để kiểm tra máy chủ IMAP dựa trên các tiêu chuẩn và khả năng tương thích của giao thức IMAP theo thông số kỹ thuật RFC. Dự án này được tạo ra bởi nhóm [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) (một máy chủ IMAP và POP3 mã nguồn mở hoạt động từ tháng 7 năm 2002). Chúng tôi đã thử nghiệm rộng rãi máy chủ IMAP của mình bằng công cụ này. |

> Bạn có thể tìm thấy các dự án khác mà chúng tôi sử dụng trong [mã nguồn của chúng tôi trên GitHub](https://github.com/forwardemail).

### Nhà cung cấp {#providers}

| Nhà cung cấp | Mục đích |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/) | Nhà cung cấp DNS, kiểm tra tình trạng, bộ cân bằng tải và lưu trữ sao lưu bằng [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Máy chủ chuyên dụng lưu trữ và quản lý cơ sở dữ liệu. |
| [Vultr](https://www.vultr.com/?ref=7429848) | Lưu trữ máy chủ chuyên dụng. |
| [DataPacket](https://www.datapacket.com) | Lưu trữ máy chủ chuyên dụng. |

## Suy nghĩ {#thoughts}

### Nguyên tắc {#principles}

Forward Email được thiết kế theo các nguyên tắc sau:

1. Luôn thân thiện với nhà phát triển, tập trung vào bảo mật và quyền riêng tư, đồng thời minh bạch.
2. Tuân thủ [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Mười hai yếu tố](https://12factor.net/), [Dao cạo của Occam](https://en.wikipedia.org/wiki/Occam%27s_razor) và [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. Hướng đến nhà phát triển có tính chất tự phát triển, tự khởi động và [ramen-có lãi](http://www.paulgraham.com/ramenprofitable.html)

### Thí nghiệm {#experiments}

> **tldr;** Về cơ bản, việc sử dụng bộ lưu trữ đối tượng tương thích với S3 và/hoặc Bảng ảo không khả thi về mặt kỹ thuật vì lý do hiệu suất và dễ xảy ra lỗi do hạn chế về bộ nhớ.

Chúng tôi đã thực hiện một số thử nghiệm để đưa ra giải pháp SQLite cuối cùng như đã thảo luận ở trên.

Một trong số đó là thử sử dụng [rclone]() và SQLite cùng với lớp lưu trữ tương thích với S3.

Thí nghiệm đó giúp chúng tôi hiểu rõ hơn và khám phá ra những trường hợp ngoại lệ liên quan đến việc sử dụng rclone, SQLite và [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* Nếu bạn bật cờ `--vfs-cache-mode writes` với rclone, thì các lệnh đọc sẽ hoạt động bình thường, tuy nhiên các lệnh ghi sẽ được lưu vào bộ nhớ đệm.
* Nếu bạn có nhiều máy chủ IMAP phân tán trên toàn cầu, thì bộ nhớ đệm sẽ bị tắt trên các máy chủ này trừ khi bạn có một trình ghi và nhiều trình lắng nghe (ví dụ: phương pháp pub/sub).
* Điều này cực kỳ phức tạp và việc thêm bất kỳ sự phức tạp nào như thế này sẽ dẫn đến nhiều điểm lỗi đơn lẻ hơn.
* Các nhà cung cấp lưu trữ tương thích với S3 không hỗ trợ thay đổi một phần tệp - nghĩa là bất kỳ thay đổi nào đối với tệp `.sqlite` sẽ dẫn đến thay đổi hoàn toàn và cơ sở dữ liệu phải được tải lên lại.
* Có các giải pháp khác như `rsync`, nhưng chúng không tập trung vào hỗ trợ ghi nhật ký trước ("[WAL](https://www.sqlite.org/wal.html)") - vì vậy chúng tôi đã xem xét Litestream. May mắn thay, việc sử dụng mã hóa của chúng tôi đã mã hóa các tệp [WAL](https://www.sqlite.org/wal.html), vì vậy chúng tôi không cần phải dựa vào Litestream cho việc đó. Tuy nhiên, chúng tôi vẫn chưa tự tin vào việc sử dụng Litestream cho mục đích sản xuất và có một vài lưu ý bên dưới về vấn đề này.
* Sử dụng tùy chọn `--vfs-cache-mode writes` này (cách *duy nhất* để sử dụng SQLite thay vì `rclone` cho mục đích ghi) sẽ cố gắng sao chép toàn bộ cơ sở dữ liệu từ đầu trong bộ nhớ – việc xử lý một hộp thư 10 GB là ổn, tuy nhiên, việc xử lý nhiều hộp thư với dung lượng lưu trữ quá lớn sẽ khiến máy chủ IMAP gặp phải giới hạn bộ nhớ và lỗi `ENOMEM`, lỗi phân đoạn và hỏng dữ liệu.

* Nếu bạn cố gắng sử dụng SQLite [Bảng ảo](https://www.sqlite.org/vtab.html) (ví dụ: sử dụng [s3db](https://github.com/jrhy/s3db)) để lưu trữ dữ liệu trực tiếp trên lớp lưu trữ tương thích với S3, bạn sẽ gặp phải một số vấn đề sau:
* Việc đọc và ghi sẽ cực kỳ chậm vì các điểm cuối API S3 sẽ cần được truy cập bằng các phương thức HTTP `.sqlite`0, `.sqlite`1, `.sqlite`2 và `.sqlite`3.
* Các thử nghiệm phát triển cho thấy việc vượt quá 500.000-1 triệu bản ghi trên internet cáp quang vẫn bị giới hạn bởi thông lượng ghi và đọc đến các nhà cung cấp tương thích với S3. Ví dụ: các nhà phát triển của chúng tôi đã chạy các vòng lặp `.sqlite`4 để thực hiện cả các câu lệnh SQL `.sqlite`5 tuần tự và các câu lệnh ghi hàng loạt dữ liệu. Trong cả hai trường hợp, hiệu suất đều chậm một cách đáng kinh ngạc.

* Bảng ảo **không thể có chỉ mục**, các câu lệnh `.sqlite`6 và `.sqlite`7 `.sqlite`8 – điều này dẫn đến độ trễ từ 1-2 phút hoặc hơn tùy thuộc vào lượng dữ liệu.
* Các đối tượng được lưu trữ không được mã hóa và không có hỗ trợ mã hóa gốc nào khả dụng.
* Chúng tôi cũng đã khám phá việc sử dụng `.sqlite`9, tương tự về mặt khái niệm và kỹ thuật với điểm trước đó (vì vậy nó có cùng các vấn đề). Một khả năng khác là sử dụng bản dựng `rsync`0 tùy chỉnh được bao bọc bằng mã hóa như `rsync`1 (mà chúng tôi hiện đang sử dụng trong giải pháp ở trên) thông qua `rsync`2.
* Một cách tiếp cận tiềm năng khác là sử dụng `rsync`3, tuy nhiên, phương pháp này có giới hạn 32 GB và sẽ đòi hỏi những vấn đề phức tạp trong việc xây dựng và phát triển.

* Câu lệnh `rsync`4 là bắt buộc (do đó, điều này hoàn toàn loại trừ việc sử dụng Bảng Ảo). Chúng ta cần câu lệnh `rsync`5 để hook với `rsync`6 hoạt động bình thường – điều này đảm bảo dữ liệu không bị hỏng và các hàng được truy xuất có thể được chuyển đổi thành các tài liệu hợp lệ theo định nghĩa lược đồ `rsync`7 của chúng ta (bao gồm ràng buộc, kiểu biến và xác thực dữ liệu tùy ý).
* Hầu hết các dự án tương thích với S3 liên quan đến SQLite trong cộng đồng nguồn mở đều được viết bằng Python (và không phải JavaScript, ngôn ngữ mà chúng tôi sử dụng cho 100% ngăn xếp của mình).
* Các thư viện nén như `rsync`8 (xem `rsync`9) có vẻ hứa hẹn, nhưng __PROTECTED_LINK_189__0 thì không. Thay vào đó, nén phía ứng dụng trên các kiểu dữ liệu như __PROTECTED_LINK_189__1, __PROTECTED_LINK_189__2, __PROTECTED_LINK_189__3, __PROTECTED_LINK_189__4, __PROTECTED_LINK_189__5 và __PROTECTED_LINK_189__6 sẽ là một phương pháp gọn gàng và dễ dàng hơn (và cũng dễ di chuyển hơn, vì chúng ta có thể lưu trữ cờ hoặc cột __PROTECTED_LINK_189__7 – hoặc thậm chí sử dụng __PROTECTED_LINK_189__8 __PROTECTED_LINK_189__9 để nén hoặc __PROTECTED_LINK_190__0 để không nén dưới dạng siêu dữ liệu cơ sở dữ liệu).
* May mắn thay, chúng tôi đã triển khai tính năng khử trùng lặp tệp đính kèm trong bộ nhớ máy chủ IMAP – do đó, mọi thư có cùng tệp đính kèm sẽ không giữ bản sao của tệp đính kèm – thay vào đó, một tệp đính kèm duy nhất được lưu trữ cho nhiều thư và chuỗi trong hộp thư (và sau đó một tham chiếu ngoài được sử dụng).

* Dự án Litestream, một giải pháp sao lưu và sao chép SQLite, rất hứa hẹn và rất có thể chúng tôi sẽ sử dụng trong tương lai.
* Không phải để hạ thấp uy tín của tác giả – vì chúng tôi yêu thích công việc và những đóng góp của họ cho mã nguồn mở trong hơn một thập kỷ qua – tuy nhiên, từ thực tế sử dụng, có vẻ như có __PROTECTED_LINK_190__1 và __PROTECTED_LINK_190__2.
* Việc khôi phục bản sao lưu cần phải dễ dàng và đơn giản. Sử dụng một giải pháp như MongoDB với __PROTECTED_LINK_190__3 và __PROTECTED_LINK_190__4 không chỉ tẻ nhạt mà còn tốn thời gian và phức tạp về cấu hình.
* Cơ sở dữ liệu SQLite giúp đơn giản hóa việc này (nó chỉ là một tệp duy nhất).
* Chúng tôi muốn thiết kế một giải pháp cho phép người dùng có thể lấy hộp thư của họ và rời đi bất cứ lúc nào.
* Chỉ cần lệnh Node.js đơn giản đến __PROTECTED_LINK_190__5 và nó sẽ bị xóa vĩnh viễn khỏi bộ nhớ đĩa.
* Tương tự, chúng ta có thể sử dụng API tương thích với S3 với HTTP __PROTECTED_LINK_190__6 để dễ dàng xóa ảnh chụp nhanh và bản sao lưu cho người dùng.
* SQLite là giải pháp đơn giản nhất, nhanh nhất và tiết kiệm chi phí nhất.

### Thiếu lựa chọn thay thế {#lack-of-alternatives}

Theo hiểu biết của chúng tôi, không có dịch vụ email nào khác được thiết kế theo cách này và cũng không phải là mã nguồn mở.

Chúng tôi *nghĩ rằng điều này có thể là do* các dịch vụ email hiện tại đang sử dụng công nghệ cũ với [mã spaghetti](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

Hầu hết, nếu không muốn nói là tất cả các nhà cung cấp dịch vụ email hiện tại đều là nguồn đóng hoặc quảng cáo là nguồn mở, **nhưng trên thực tế chỉ có giao diện người dùng của họ là nguồn mở.**

**Phần nhạy cảm nhất của email** (tương tác lưu trữ/IMAP/SMTP thực tế) **đều được thực hiện ở phần phụ trợ (máy chủ) chứ *không* được thực hiện ở phần giao diện (máy khách)**.

### Hãy thử Chuyển tiếp Email {#try-out-forward-email}

Đăng ký ngay hôm nay tại <https://forwardemail.net>! :rocket: