# Chính sách bảo mật {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Chính sách bảo mật Forward Email" class="rounded-lg" />


## Mục lục {#table-of-contents}

* [Tuyên bố từ chối trách nhiệm](#disclaimer)
* [Thông tin không được thu thập](#information-not-collected)
* [Thông tin được thu thập](#information-collected)
  * [Thông tin tài khoản](#account-information)
  * [Lưu trữ email](#email-storage)
  * [Nhật ký lỗi](#error-logs)
  * [Email SMTP gửi đi](#outbound-smtp-emails)
* [Xử lý dữ liệu tạm thời](#temporary-data-processing)
  * [Giới hạn tốc độ](#rate-limiting)
  * [Theo dõi kết nối](#connection-tracking)
  * [Cố gắng xác thực](#authentication-attempts)
* [Nhật ký kiểm toán](#audit-logs)
  * [Thay đổi tài khoản](#account-changes)
  * [Thay đổi cài đặt tên miền](#domain-settings-changes)
* [Cookie và phiên làm việc](#cookies-and-sessions)
* [Phân tích](#analytics)
* [Thông tin được chia sẻ](#information-shared)
* [Xóa thông tin](#information-removal)
* [Tiết lộ bổ sung](#additional-disclosures)


## Tuyên bố từ chối trách nhiệm {#disclaimer}

Vui lòng tham khảo [Điều khoản](/terms) của chúng tôi vì nó áp dụng trên toàn trang.


## Thông tin không được thu thập {#information-not-collected}

**Ngoại trừ [nhật ký lỗi](#error-logs), [email SMTP gửi đi](#outbound-smtp-emails), và/hoặc khi phát hiện hoạt động spam hoặc độc hại (ví dụ: để giới hạn tốc độ):**

* Chúng tôi không lưu trữ bất kỳ email chuyển tiếp nào trên bộ nhớ đĩa hoặc cơ sở dữ liệu.
* Chúng tôi không lưu trữ bất kỳ siêu dữ liệu nào về email chuyển tiếp trên bộ nhớ đĩa hoặc cơ sở dữ liệu.
* Chúng tôi không lưu trữ bất kỳ nhật ký hoặc địa chỉ IP nào trên bộ nhớ đĩa hoặc cơ sở dữ liệu.
* Chúng tôi không sử dụng bất kỳ dịch vụ phân tích hoặc thu thập dữ liệu từ bên thứ ba nào.


## Thông tin được thu thập {#information-collected}

Để minh bạch, bạn có thể <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">xem mã nguồn của chúng tôi</a> bất cứ lúc nào để biết cách thông tin dưới đây được thu thập và sử dụng.

**Chỉ để phục vụ chức năng và cải thiện dịch vụ, chúng tôi thu thập và lưu trữ an toàn các thông tin sau:**

### Thông tin tài khoản {#account-information}

* Chúng tôi lưu trữ địa chỉ email mà bạn cung cấp cho chúng tôi.
* Chúng tôi lưu trữ tên miền, bí danh và cấu hình mà bạn cung cấp cho chúng tôi.
* Bất kỳ thông tin bổ sung nào bạn tự nguyện cung cấp, chẳng hạn như bình luận hoặc câu hỏi gửi cho chúng tôi qua email hoặc trên trang <a href="/help">trợ giúp</a> của chúng tôi.

**Gán nguồn đăng ký** (lưu trữ vĩnh viễn trên tài khoản của bạn):

Khi bạn tạo tài khoản, chúng tôi lưu trữ các thông tin sau để hiểu cách người dùng tìm thấy dịch vụ của chúng tôi:

* Tên miền trang web giới thiệu (không phải URL đầy đủ)
* Trang đầu tiên bạn truy cập trên trang của chúng tôi
* Tham số chiến dịch UTM nếu có trong URL

### Lưu trữ email {#email-storage}

* Chúng tôi lưu trữ email và thông tin lịch trong [cơ sở dữ liệu SQLite được mã hóa](/blog/docs/best-quantum-safe-encrypted-email-service) chỉ dành cho truy cập IMAP/POP3/CalDAV/CardDAV và chức năng hộp thư của bạn.
  * Lưu ý rằng nếu bạn chỉ sử dụng dịch vụ chuyển tiếp email của chúng tôi, thì không có email nào được lưu trữ trên đĩa hoặc cơ sở dữ liệu như mô tả trong [Thông tin không được thu thập](#information-not-collected).
  * Dịch vụ chuyển tiếp email của chúng tôi chỉ hoạt động trong bộ nhớ (không ghi vào bộ nhớ đĩa hoặc cơ sở dữ liệu).
  * Lưu trữ IMAP/POP3/CalDAV/CardDAV được mã hóa khi nghỉ, mã hóa khi truyền và lưu trên đĩa được mã hóa LUKS.
  * Sao lưu cho lưu trữ IMAP/POP3/CalDAV/CardDAV được mã hóa khi nghỉ, mã hóa khi truyền và lưu trên [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).

### Nhật ký lỗi {#error-logs}

* Chúng tôi lưu trữ mã phản hồi SMTP `4xx` và `5xx` trong [nhật ký lỗi](/faq#do-you-store-error-logs) trong 7 ngày.
* Nhật ký lỗi chứa lỗi SMTP, phong bì và tiêu đề email (chúng tôi **không** lưu trữ nội dung email hoặc tệp đính kèm).
* Nhật ký lỗi có thể chứa địa chỉ IP và tên máy chủ của các máy chủ gửi để phục vụ mục đích gỡ lỗi.
* Nhật ký lỗi cho [giới hạn tốc độ](/faq#do-you-have-rate-limiting) và [danh sách xám](/faq#do-you-have-a-greylist) không thể truy cập được vì kết nối kết thúc sớm (ví dụ: trước khi các lệnh `RCPT TO` và `MAIL FROM` được truyền).
### Email SMTP gửi đi {#outbound-smtp-emails}

* Chúng tôi lưu trữ [email SMTP gửi đi](/faq#do-you-support-sending-email-with-smtp) trong khoảng \~30 ngày.
  * Thời gian này thay đổi dựa trên tiêu đề "Date"; vì chúng tôi cho phép email được gửi trong tương lai nếu tồn tại tiêu đề "Date" trong tương lai.
  * **Lưu ý rằng khi một email được gửi thành công hoặc lỗi vĩnh viễn, chúng tôi sẽ xóa và làm sạch nội dung tin nhắn.**
  * Nếu bạn muốn cấu hình để nội dung email SMTP gửi đi được giữ lâu hơn mặc định 0 ngày (sau khi gửi thành công hoặc lỗi vĩnh viễn), hãy vào Cài đặt nâng cao cho tên miền của bạn và nhập giá trị từ `0` đến `30`.
  * Một số người dùng thích sử dụng tính năng xem trước [Tài khoản của tôi > Email](/my-account/emails) để xem email của họ được hiển thị như thế nào, do đó chúng tôi hỗ trợ khoảng thời gian lưu trữ có thể cấu hình.
  * Lưu ý rằng chúng tôi cũng hỗ trợ [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).


## Xử lý dữ liệu tạm thời {#temporary-data-processing}

Các dữ liệu sau được xử lý tạm thời trong bộ nhớ hoặc Redis và **không** được lưu trữ vĩnh viễn:

### Giới hạn tốc độ {#rate-limiting}

* Địa chỉ IP được sử dụng tạm thời trong Redis để giới hạn tốc độ.
* Dữ liệu giới hạn tốc độ tự động hết hạn (thường trong vòng 24 giờ).
* Điều này ngăn chặn lạm dụng và đảm bảo sử dụng công bằng dịch vụ của chúng tôi.

### Theo dõi kết nối {#connection-tracking}

* Số lượng kết nối đồng thời được theo dõi theo địa chỉ IP trong Redis.
* Dữ liệu này tự động hết hạn khi kết nối đóng hoặc sau một khoảng thời gian ngắn.
* Dùng để ngăn chặn lạm dụng kết nối và đảm bảo dịch vụ luôn sẵn sàng.

### Thử đăng nhập {#authentication-attempts}

* Các lần thử đăng nhập thất bại được theo dõi theo địa chỉ IP trong Redis.
* Dữ liệu này tự động hết hạn (thường trong vòng 24 giờ).
* Dùng để ngăn chặn các cuộc tấn công brute-force vào tài khoản người dùng.


## Nhật ký kiểm tra {#audit-logs}

Để giúp bạn giám sát và bảo mật tài khoản cũng như tên miền, chúng tôi duy trì nhật ký kiểm tra cho một số thay đổi nhất định. Các nhật ký này được sử dụng để gửi email thông báo cho chủ tài khoản và quản trị viên tên miền.

### Thay đổi tài khoản {#account-changes}

* Chúng tôi theo dõi các thay đổi quan trọng trong cài đặt tài khoản (ví dụ: xác thực hai yếu tố, tên hiển thị, múi giờ).
* Khi phát hiện thay đổi, chúng tôi gửi email thông báo đến địa chỉ email đã đăng ký của bạn.
* Các trường nhạy cảm (ví dụ: mật khẩu, token API, khóa khôi phục) được theo dõi nhưng giá trị sẽ bị làm mờ trong thông báo.
* Các mục nhật ký kiểm tra được xóa sau khi email thông báo được gửi.

### Thay đổi cài đặt tên miền {#domain-settings-changes}

Đối với các tên miền có nhiều quản trị viên, chúng tôi cung cấp nhật ký kiểm tra chi tiết để giúp nhóm theo dõi các thay đổi cấu hình:

**Chúng tôi theo dõi:**

* Thay đổi cài đặt tên miền (ví dụ: webhook bounce, lọc spam, cấu hình DKIM)
* Ai đã thực hiện thay đổi (địa chỉ email người dùng)
* Khi nào thay đổi được thực hiện (dấu thời gian)
* Địa chỉ IP từ nơi thực hiện thay đổi
* Chuỗi user-agent trình duyệt/khách hàng

**Cách hoạt động:**

* Tất cả quản trị viên tên miền nhận được một email thông báo tổng hợp khi có thay đổi cài đặt.
* Thông báo bao gồm bảng hiển thị từng thay đổi với người thực hiện, địa chỉ IP và dấu thời gian.
* Các trường nhạy cảm (ví dụ: khóa webhook, token API, khóa riêng DKIM) được theo dõi nhưng giá trị bị làm mờ.
* Thông tin user-agent được đưa vào phần "Chi tiết kỹ thuật" có thể thu gọn.
* Các mục nhật ký kiểm tra được xóa sau khi email thông báo được gửi.

**Tại sao chúng tôi thu thập điều này:**

* Giúp quản trị viên tên miền duy trì giám sát bảo mật
* Cho phép nhóm kiểm tra ai đã thực hiện thay đổi cấu hình
* Hỗ trợ xử lý sự cố nếu có thay đổi không mong muốn xảy ra
* Cung cấp trách nhiệm giải trình cho quản lý tên miền chung


## Cookie và Phiên làm việc {#cookies-and-sessions}

* Chúng tôi lưu cookie trong phiên làm việc cho lưu lượng truy cập trang web của bạn.
* Cookie là HTTP-only, được ký và sử dụng bảo vệ SameSite.
* Cookie phiên làm việc hết hạn sau 30 ngày không hoạt động.
* Chúng tôi không tạo phiên cho bot hoặc trình thu thập dữ liệu.
* Chúng tôi sử dụng cookie cho:
  * Xác thực và trạng thái đăng nhập
  * Tính năng "ghi nhớ tôi" của xác thực hai yếu tố
  * Thông báo và tin nhắn flash
## Phân tích {#analytics}

Chúng tôi sử dụng hệ thống phân tích tập trung vào quyền riêng tư của riêng mình để hiểu cách dịch vụ của chúng tôi được sử dụng. Hệ thống này được thiết kế với quyền riêng tư là nguyên tắc cốt lõi:

**Những gì chúng tôi KHÔNG thu thập:**

* Chúng tôi không lưu trữ địa chỉ IP
* Chúng tôi không sử dụng cookie hoặc định danh bền vững cho phân tích
* Chúng tôi không sử dụng bất kỳ dịch vụ phân tích bên thứ ba nào
* Chúng tôi không theo dõi người dùng qua các ngày hoặc phiên làm việc

**Những gì chúng tôi CÓ thu thập (đã ẩn danh):**

* Lượt xem trang tổng hợp và sử dụng dịch vụ (SMTP, IMAP, POP3, API, v.v.)
* Loại trình duyệt và hệ điều hành (phân tích từ user agent, dữ liệu thô bị loại bỏ)
* Loại thiết bị (máy tính để bàn, di động, máy tính bảng)
* Tên miền giới thiệu (không phải URL đầy đủ)
* Loại ứng dụng email cho các giao thức thư (ví dụ Thunderbird, Outlook)

**Lưu giữ dữ liệu:**

* Dữ liệu phân tích tự động bị xóa sau 30 ngày
* Định danh phiên làm việc được thay đổi hàng ngày và không thể dùng để theo dõi người dùng qua các ngày


## Thông tin được chia sẻ {#information-shared}

Chúng tôi không chia sẻ thông tin của bạn với bất kỳ bên thứ ba nào.

Chúng tôi có thể cần và sẽ tuân thủ các yêu cầu pháp lý theo lệnh tòa án (nhưng hãy nhớ rằng [chúng tôi không thu thập thông tin được đề cập ở phần "Thông tin không được thu thập"](#information-not-collected), nên chúng tôi sẽ không thể cung cấp nó ngay từ đầu).


## Xóa thông tin {#information-removal}

Nếu bất kỳ lúc nào bạn muốn xóa thông tin mà bạn đã cung cấp cho chúng tôi, hãy truy cập <a href="/my-account/security">Tài khoản của tôi > Bảo mật</a> và nhấn "Xóa tài khoản".

Do phòng chống và giảm thiểu lạm dụng, tài khoản của bạn có thể cần được quản trị viên xem xét xóa thủ công nếu bạn xóa trong vòng 5 ngày kể từ lần thanh toán đầu tiên.

Quá trình này thường mất chưa đến 24 giờ và được thực hiện do có người dùng spam dịch vụ của chúng tôi, sau đó nhanh chóng xóa tài khoản – điều này ngăn chúng tôi chặn dấu vân tay phương thức thanh toán của họ trên Stripe.


## Tiết lộ bổ sung {#additional-disclosures}

Trang web này được bảo vệ bởi Cloudflare và [Chính sách quyền riêng tư](https://www.cloudflare.com/privacypolicy/) cùng [Điều khoản dịch vụ](https://www.cloudflare.com/website-terms/) của họ được áp dụng.
