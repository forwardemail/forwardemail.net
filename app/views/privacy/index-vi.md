# Chính sách bảo mật {#privacy-policy}

<!-- <img loading="lazy" src="/img/articles/privacy.webp" alt="Chính sách bảo mật Forward Email" class="rounded-lg" /> -->


## Mục lục {#table-of-contents}

* [Tuyên bố từ chối trách nhiệm](#disclaimer)
* [Thông tin không được thu thập](#information-not-collected)
* [Thông tin được thu thập](#information-collected)
  * [Thông tin tài khoản](#account-information)
  * [Lưu trữ email](#email-storage)
  * [Nhật ký lỗi](#error-logs)
  * [Nhật ký máy chủ](#server-logs)
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
* [Ứng dụng và webmail](#apps-and-webmail)
  * [Dữ liệu trên thiết bị của bạn](#data-on-your-device)
  * [Dữ liệu ứng dụng gửi cho chúng tôi](#data-the-apps-send-us)
  * [Thông báo đẩy](#push-notifications)
  * [Hình ảnh và liên kết trong email](#images-and-links-in-emails)
  * [Kết nối khác](#other-connections)
* [Thông tin được chia sẻ](#information-shared)
* [Xóa thông tin](#information-removal)
* [Tiết lộ bổ sung](#additional-disclosures)


## Tuyên bố từ chối trách nhiệm {#disclaimer}

Vui lòng tham khảo [Điều khoản](/terms) của chúng tôi vì nó áp dụng trên toàn trang.


## Thông tin không được thu thập {#information-not-collected}

**Ngoại trừ các thông tin được mô tả rõ ràng trong chính sách này (bao gồm [nhật ký lỗi](#error-logs), [nhật ký máy chủ](#server-logs), [email SMTP gửi đi](#outbound-smtp-emails), [thông tin tài khoản](#account-information), [xử lý dữ liệu tạm thời](#temporary-data-processing), [nhật ký kiểm toán](#audit-logs), [cookie và phiên](#cookies-and-sessions), [phân tích](#analytics), và [ứng dụng và webmail](#apps-and-webmail)):**

* Chúng tôi không lưu trữ bất kỳ email được chuyển tiếp nào vào bộ nhớ đĩa hoặc cơ sở dữ liệu.
* Chúng tôi không lưu trữ bất kỳ siêu dữ liệu nào về các email được chuyển tiếp vào bộ nhớ đĩa hoặc cơ sở dữ liệu.
* Ngoại trừ các trường hợp được mô tả rõ ràng trong chính sách này, chúng tôi không lưu trữ nhật ký hoặc địa chỉ IP vào bộ nhớ đĩa hoặc cơ sở dữ liệu.
* Chúng tôi không sử dụng bất kỳ dịch vụ phân tích hoặc đo từ xa của bên thứ ba nào.


## Thông tin được thu thập {#information-collected}

Để minh bạch, bạn có thể <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">xem mã nguồn của chúng tôi</a> bất cứ lúc nào để biết cách thông tin dưới đây được thu thập và sử dụng.

**Chỉ để phục vụ chức năng và cải thiện dịch vụ, chúng tôi thu thập và lưu trữ an toàn các thông tin sau:**

### Thông tin tài khoản {#account-information}

* Chúng tôi lưu trữ địa chỉ email mà bạn cung cấp cho chúng tôi.
* Chúng tôi lưu trữ tên miền, bí danh và cấu hình mà bạn cung cấp cho chúng tôi.
* Chúng tôi lưu trữ siêu dữ liệu bảo mật tài khoản hạn chế cần thiết để bảo vệ tài khoản của bạn và quản lý quyền truy cập, bao gồm các định danh phiên trang web đang hoạt động, bộ đếm số lần đăng nhập không thành công và dấu thời gian của lần thử đăng nhập cuối cùng.
* Bất kỳ thông tin bổ sung nào bạn tự nguyện cung cấp cho chúng tôi, chẳng hạn như nhận xét hoặc câu hỏi được gửi cho chúng tôi qua email hoặc trên trang <a href="/help">trợ giúp</a> của chúng tôi.


**Gán nguồn đăng ký** (lưu trữ vĩnh viễn trên tài khoản của bạn):

Khi bạn tạo tài khoản, chúng tôi lưu trữ các thông tin sau để hiểu cách người dùng tìm thấy dịch vụ của chúng tôi:

* Tên miền trang web giới thiệu (không phải URL đầy đủ)
* Trang đầu tiên bạn truy cập trên trang của chúng tôi, trong đó các giá trị trong đường dẫn như tên miền, ID và token được thay thế bằng giá trị giữ chỗ
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
* Chúng tôi cũng lưu trữ nhật ký lỗi cho các yêu cầu đến trang web và API không thành công hoặc mất quá nhiều thời gian, và cho các lỗi trên máy chủ IMAP, POP3, CalDAV và CardDAV của chúng tôi, trong 7 ngày.
* Các nhật ký này có thể chứa địa chỉ IP, URL yêu cầu (bao gồm chuỗi truy vấn như từ khóa tìm kiếm), các tiêu đề yêu cầu như user agent, và tài khoản hoặc bí danh liên quan.
* Mật khẩu, token API, cookie và nội dung yêu cầu được làm mờ trước khi các nhật ký này được lưu trữ.

### Nhật ký máy chủ {#server-logs}

* Máy chủ của chúng tôi ghi một dòng nhật ký cho mỗi yêu cầu đến trang web và API, trong đó có thể bao gồm địa chỉ IP, phương thức và URL yêu cầu (bao gồm chuỗi truy vấn), các tiêu đề yêu cầu, trạng thái phản hồi, và tài khoản đã đăng nhập.
* Chúng tôi sử dụng các nhật ký này để tìm và khắc phục sự cố cũng như ngăn chặn lạm dụng, và chúng tôi lưu giữ chúng tối đa 30 ngày.

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

* Các lần thử xác thực không thành công được theo dõi theo từng địa chỉ IP trong Redis.
* Chúng tôi cũng lưu trữ siêu dữ liệu xác thực cấp tài khoản hạn chế, bao gồm bộ đếm số lần đăng nhập không thành công và dấu thời gian của lần thử đăng nhập cuối cùng.
* Dữ liệu thử xác thực dựa trên Redis sẽ tự động hết hạn (thường trong vòng 24 giờ).
* Được sử dụng để ngăn chặn các cuộc tấn công brute-force vào tài khoản người dùng.


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

* Chúng tôi lưu trữ các cookie chỉ HTTP, đã ký và dữ liệu phiên phía máy chủ cho lưu lượng truy cập trang web của bạn.
* Cookie sử dụng bảo vệ SameSite.
* Chúng tôi lưu trữ các định danh phiên trang web đang hoạt động trên tài khoản của bạn để hỗ trợ các tính năng như "đăng xuất các thiết bị khác" và vô hiệu hóa phiên liên quan đến bảo mật.
* Cookie phiên hết hạn sau 30 ngày không hoạt động.
* Chúng tôi không tạo phiên cho bot hoặc trình thu thập dữ liệu.
* Chúng tôi sử dụng cookie và phiên cho:
  * Trạng thái xác thực và đăng nhập
  * Chức năng "ghi nhớ tôi" của xác thực hai yếu tố
  * Tin nhắn flash và thông báo
  * [Phân tích](#analytics): trang đầu tiên trong lượt truy cập của bạn, tên miền giới thiệu, các tham số chiến dịch (UTM) và số lượng trang


## Phân tích {#analytics}

Chúng tôi sử dụng hệ thống phân tích tập trung vào quyền riêng tư của riêng mình để hiểu cách dịch vụ của chúng tôi được sử dụng. Hệ thống này được thiết kế với quyền riêng tư là nguyên tắc cốt lõi:

**Những gì chúng tôi KHÔNG thu thập:**

* Chúng tôi không lưu trữ địa chỉ IP
* Chúng tôi không đặt cookie riêng cho phân tích
* Chúng tôi không sử dụng bất kỳ dịch vụ phân tích bên thứ ba nào
* Chúng tôi không theo dõi khách truy cập qua các ngày hoặc phiên làm việc khi họ chưa đăng nhập

**Những gì chúng tôi CÓ thu thập:**

* Lượt xem trang tổng hợp và sử dụng dịch vụ (SMTP, IMAP, POP3, API, v.v.)
* Loại và phiên bản của trình duyệt và hệ điều hành (phân tích từ user agent, dữ liệu thô bị loại bỏ)
* Loại thiết bị (máy tính để bàn, di động, máy tính bảng)
* Tên miền giới thiệu (không phải URL đầy đủ) và các tham số chiến dịch (UTM)
* Loại ứng dụng email cho các giao thức thư (ví dụ Thunderbird, Outlook)
* Trang hoặc đường dẫn API được yêu cầu, trong đó các giá trị như tên miền, ID và token được thay thế bằng giá trị giữ chỗ, và yêu cầu có thành công hay không
* Đối với lượt truy cập trang web, trang đầu tiên của lượt truy cập và số lượng trang, được lưu trong phiên của bạn (xem [Cookie và phiên làm việc](#cookies-and-sessions))
* Khi bạn đã đăng nhập, ID tài khoản, bí danh hoặc tên miền của bạn, để chúng tôi có thể biết từng dịch vụ được sử dụng như thế nào và khắc phục sự cố

**Lưu giữ dữ liệu:**

* Các sự kiện phân tích tự động bị xóa sau 30 ngày
* Số liệu tổng theo giờ, không liên kết với bất kỳ tài khoản nào, được lưu giữ trong 90 ngày
* Định danh phiên làm việc được thay đổi hàng ngày và không thể dùng để theo dõi khách truy cập qua các ngày


## Ứng dụng và webmail {#apps-and-webmail}

Phần này đề cập đến các ứng dụng email của chúng tôi cho iOS, Android, macOS, Windows và Linux, cùng webmail của chúng tôi tại <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a>, vốn dùng chung mã nguồn. Các ứng dụng không chứa mã quảng cáo hay mã theo dõi, và không có phân tích của bên thứ ba.

### Dữ liệu trên thiết bị của bạn {#data-on-your-device}

* Các ứng dụng lưu trữ email, danh bạ, lịch, cài đặt và thông tin đăng nhập của bạn trên thiết bị của bạn, để ứng dụng tải nhanh và hoạt động ngoại tuyến.
* Nếu bạn bật App Lock, ứng dụng sẽ mã hóa nội dung email, danh bạ và thông tin đăng nhập đã lưu bằng một khóa được bảo vệ bởi mã PIN hoặc passkey của bạn. Ngày tháng, thư mục, nhãn và cờ vẫn không được mã hóa để ứng dụng có thể sắp xếp và đếm email của bạn.
* Việc đăng xuất khỏi một tài khoản sẽ xóa dữ liệu của tài khoản đó khỏi thiết bị của bạn.

### Dữ liệu ứng dụng gửi cho chúng tôi {#data-the-apps-send-us}

* Địa chỉ email và mật khẩu bí danh của bạn, kèm theo mỗi yêu cầu, để đăng nhập cho bạn.
* Email, danh bạ, lịch, nhãn và bộ lọc mà bạn gửi, tạo hoặc thay đổi. Chúng tôi lưu trữ email, danh bạ và lịch như mô tả trong [Lưu trữ email](#email-storage), và lưu trữ email bạn gửi như mô tả trong [Email SMTP gửi đi](#outbound-smtp-emails).
* Từ khóa tìm kiếm của bạn, để chúng tôi có thể tìm kiếm trong hộp thư của bạn trên máy chủ của chúng tôi. Từ khóa tìm kiếm là một phần của URL yêu cầu, nên có thể xuất hiện trong [nhật ký lỗi](#error-logs) và [nhật ký máy chủ](#server-logs).
* Phản hồi mà bạn chọn gửi từ ứng dụng, được gửi qua email từ bí danh của bạn đến nhóm hỗ trợ của chúng tôi, kèm theo mọi thông tin chẩn đoán mà bạn chọn đính kèm.
* Email bạn báo cáo là spam, được ứng dụng chuyển tiếp đến nhóm xử lý vi phạm của chúng tôi (hoặc đến một địa chỉ khác mà bạn đặt trong Settings).

### Thông báo đẩy {#push-notifications}

* Khi bạn cho phép thông báo, ứng dụng sẽ đăng ký một token thông báo đẩy với chúng tôi. Chúng tôi lưu token này cùng với nền tảng, bí danh và tài khoản tương ứng, thời điểm gửi gần nhất và tên thiết bị lấy từ user agent của ứng dụng, trong đó có phiên bản hệ điều hành của bạn và, trên Android, mẫu thiết bị của bạn.
* Chúng tôi giữ token thông báo đẩy tối đa một năm kể từ lần sử dụng cuối cùng. Chúng tôi xóa token sớm hơn khi bạn đăng xuất khỏi ứng dụng, khi việc gửi thất bại ba lần liên tiếp, khi mật khẩu bí danh thay đổi, khi bạn xóa bí danh hoặc tài khoản của mình, hoặc khi bí danh chuyển sang chủ sở hữu khác.
* Trên iOS và macOS, thông báo được gửi qua Apple Push Notification service. Trong ứng dụng Android của chúng tôi từ Google Play, thông báo được gửi qua Firebase Cloud Messaging. Thông báo email mới bao gồm tên và địa chỉ của người gửi, chủ đề, một đoạn xem trước ngắn và tên thư mục, kể cả đối với email đến mà không hiển thị cảnh báo, chẳng hạn như email được đưa vào thư mục Thư rác hoặc thư mục Đã gửi. Khi email, lịch hoặc danh bạ thay đổi, chúng tôi cũng gửi thông báo im lặng chứa định danh nhưng không chứa nội dung email, để ứng dụng luôn được cập nhật.
* Với [UnifiedPush](https://unifiedpush.org/) trên Android, và với thông báo trong trình duyệt web, mỗi thông báo đều được mã hóa để chỉ thiết bị của bạn mới đọc được.
* Ứng dụng Android của chúng tôi từ Google Play bao gồm Firebase Cloud Messaging, thành phần này gửi cho Google ID cài đặt Firebase, phiên bản ứng dụng, cùng thông tin về thiết bị và SDK. Ứng dụng Android không phụ thuộc Google của chúng tôi từ GitHub không bao gồm Firebase.

### Hình ảnh và liên kết trong email {#images-and-links-in-emails}

* Hình ảnh trong email được tải từ máy chủ của người gửi, các máy chủ này có thể thấy địa chỉ IP của bạn và thời điểm hình ảnh được tải.
* Các ứng dụng chặn pixel theo dõi theo mặc định. Bạn cũng có thể chặn tất cả hình ảnh bên ngoài trong Settings > Privacy & Security, rồi tải chúng cho từng email một.
* Liên kết trong email được mở trong trình duyệt web của bạn.

### Kết nối khác {#other-connections}

* Webmail của chúng tôi hỏi GitHub về phiên bản mới nhất của mình khi được tải, khi bạn quay lại webmail và mỗi 10 phút trong lúc đang mở. About & Help hỏi GitHub về bản phát hành mới nhất dành cho máy tính, và các ứng dụng dành cho máy tính kiểm tra bản cập nhật trên GitHub. GitHub nhận được địa chỉ IP của bạn qua các yêu cầu này.


## Thông tin được chia sẻ {#information-shared}

Chúng tôi không chia sẻ thông tin của bạn với bất kỳ bên thứ ba nào, ngoại trừ các nhà cung cấp dịch vụ vận hành một số phần trong dịch vụ của chúng tôi, chẳng hạn như Cloudflare (bảo vệ trang web và bản sao lưu được mã hóa), Stripe và PayPal (thanh toán), và các dịch vụ gửi thông báo đẩy đến thiết bị của bạn (xem [Thông báo đẩy](#push-notifications)).

Chúng tôi có thể cần và sẽ tuân thủ các yêu cầu pháp lý theo lệnh tòa án (nhưng hãy nhớ rằng [chúng tôi không thu thập thông tin được đề cập ở phần "Thông tin không được thu thập"](#information-not-collected), nên chúng tôi sẽ không thể cung cấp nó ngay từ đầu).


## Xóa thông tin {#information-removal}

Nếu bất kỳ lúc nào bạn muốn xóa thông tin mà bạn đã cung cấp cho chúng tôi, hãy truy cập <a href="/my-account/security">Tài khoản của tôi > Bảo mật</a> và nhấn "Xóa tài khoản".

Do phòng chống và giảm thiểu lạm dụng, tài khoản của bạn có thể cần được quản trị viên xem xét xóa thủ công nếu bạn xóa trong vòng 5 ngày kể từ lần thanh toán đầu tiên.

Quá trình này thường mất chưa đến 24 giờ và được thực hiện do có người dùng spam dịch vụ của chúng tôi, sau đó nhanh chóng xóa tài khoản – điều này ngăn chúng tôi chặn dấu vân tay phương thức thanh toán của họ trên Stripe.

Việc xóa tài khoản cũng sẽ xóa các tên miền mà bạn quản trị, các bí danh của bạn và các token thông báo đẩy đã đăng ký cho chúng. Riêng bản ghi tài khoản thì vẫn còn, nhưng địa chỉ email, thông tin lập hóa đơn, mật khẩu và passkey trong đó bị xóa, còn xác thực hai yếu tố và token API của tài khoản bị thu hồi, và chúng tôi giữ lại các bản ghi thanh toán của tài khoản để phục vụ việc hoàn tiền và kế toán. Nhật ký và dữ liệu phân tích liên quan đến tài khoản của bạn sẽ bị xóa theo các thời hạn nêu trên.

Để xóa dữ liệu của ứng dụng khỏi thiết bị, hãy đăng xuất khỏi ứng dụng hoặc gỡ cài đặt ứng dụng.


## Tiết lộ bổ sung {#additional-disclosures}

Trang web này được bảo vệ bởi Cloudflare và [Chính sách quyền riêng tư](https://www.cloudflare.com/privacypolicy/) cùng [Điều khoản dịch vụ](https://www.cloudflare.com/website-terms/) của họ được áp dụng.
