# Hướng dẫn Webmail của Forward Email {#forward-email-webmail-guide}

<p class="lead mt-3">
  <strong>Tóm tắt:</strong> <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">Webmail</a> là nơi bạn đọc và gửi thư. <a href="/my-account/domains">Bảng điều khiển web</a> là nơi bạn thiết lập tên miền, bí danh và mật khẩu. Bạn đăng nhập webmail bằng một địa chỉ bí danh và mật khẩu được tạo trong bảng điều khiển. Webmail miễn phí và <a href="/faq#do-you-offer-a-webmail-client">mã nguồn mở</a>, và cùng một ứng dụng chạy trên trình duyệt, máy tính, điện thoại và terminal.
</p>


## Mục lục {#table-of-contents}

* [Tải webmail ở đâu](#where-to-get-webmail)
* [Webmail và bảng điều khiển web](#webmail-and-the-web-dashboard)
* [Đăng nhập](#signing-in)
  * [Tạo mật khẩu bí danh](#generate-an-alias-password)
  * [Đăng nhập webmail](#sign-in-to-webmail)
* [Dùng nhiều tài khoản](#using-more-than-one-account)
  * [Gửi bằng một tài khoản khác đã đăng nhập](#send-as-another-signed-in-account)
* [Gửi từ bất kỳ địa chỉ nào trên tên miền của bạn](#send-from-any-address-on-your-domain)
  * [Bước 1: Tạo mật khẩu catch-all trong bảng điều khiển](#step-1-generate-a-catch-all-password-in-the-dashboard)
  * [Bước 2: Lưu mật khẩu trong webmail](#step-2-save-it-in-webmail)
  * [Bước 3: Chọn địa chỉ khi soạn thư](#step-3-pick-the-address-when-you-compose)
  * [Những điều cần biết khi gửi bằng catch-all](#what-to-know-about-catch-all-sending)
* [Tổng quan cài đặt webmail](#webmail-settings-at-a-glance)
* [Quyền riêng tư và App Lock](#privacy-and-app-lock)
* [Khắc phục sự cố](#troubleshooting)


## Tải webmail ở đâu {#where-to-get-webmail}

| Nền tảng                         | Ở đâu                                                                                                                         |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Trình duyệt                      | <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a> (không cần cài đặt) |
| Máy tính (macOS, Windows, Linux) | <a href="/download">Trang tải xuống</a> của chúng tôi                                                                         |
| Di động (Android, iOS)           | <a href="/download">Trang tải xuống</a> của chúng tôi                                                                         |
| Terminal                         | Lệnh `forwardemail`. Xem [Bạn có ứng dụng terminal không](/faq#do-you-have-a-terminal-app)                                    |

Tất cả đều được xây dựng từ cùng một dự án mã nguồn mở, nên mọi nội dung trong hướng dẫn này áp dụng cho từng phiên bản. Cài đặt và mật khẩu đã lưu được giữ trên từng thiết bị, vì vậy hãy thiết lập chúng trên mọi thiết bị bạn dùng.


## Webmail và bảng điều khiển web {#webmail-and-the-web-dashboard}

Forward Email có hai nơi đăng nhập riêng biệt, và chúng dùng thông tin đăng nhập khác nhau:

|                            | Bảng điều khiển web (forwardemail.net)                                                                       | Webmail (mail.forwardemail.net và các ứng dụng)                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| **Đăng nhập bằng**         | Email và mật khẩu tài khoản Forward Email của bạn (kèm 2FA hoặc passkey)                                     | Một địa chỉ bí danh (như `you@example.com`) và mật khẩu được tạo cho nó          |
| **Dùng để**                | Thêm tên miền, DNS, bí danh, thanh toán, thành viên nhóm, tạo mật khẩu, Cài đặt nâng cao                     | Đọc và gửi thư, thư mục, nhãn, tìm kiếm, lịch, danh bạ, bộ lọc                   |
| **Mật khẩu được tạo ở đây** | Mật khẩu bí danh và mật khẩu catch-all                                                                      | Không có. Webmail dùng các mật khẩu bạn đã tạo trong bảng điều khiển             |

Một cách thiết lập phổ biến như sau:

1. Trong bảng điều khiển, thêm tên miền của bạn và thiết lập DNS.
2. Tạo một bí danh có bật lưu trữ IMAP (ví dụ `you@example.com`).
3. Tạo mật khẩu cho bí danh đó.
4. Đăng nhập webmail bằng bí danh và mật khẩu đó.

Để gửi thư, tên miền của bạn cũng cần bật SMTP gửi đi trong <a href="/my-account/domains">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Cài đặt nâng cao <i class="fa fa-angle-right"></i> Cấu hình SMTP gửi đi, giống như với mọi ứng dụng email khác.


## Đăng nhập {#signing-in}

### Tạo mật khẩu bí danh {#generate-an-alias-password}

1. Vào <a href="/my-account/domains">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh.
2. Bên cạnh bí danh, nhấn **Tạo mật khẩu**.
3. Sao chép mật khẩu. Mật khẩu chỉ hiển thị một lần.

Đây cũng là mật khẩu bạn dùng cho IMAP, POP3, SMTP, CalDAV và CardDAV. Mật khẩu này không dùng để đăng nhập bảng điều khiển web.

### Đăng nhập webmail {#sign-in-to-webmail}

Mở webmail và nhập địa chỉ bí danh đầy đủ cùng mật khẩu đã tạo. Nếu bạn chỉ muốn xem thử trước, hãy dùng bản demo trên màn hình đăng nhập.


## Dùng nhiều tài khoản {#using-more-than-one-account}

Bạn có thể đăng nhập nhiều bí danh cùng lúc, kể cả trên các tên miền khác nhau. Chuyển đổi giữa chúng từ menu tài khoản, và quản lý chúng trong **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Your accounts**. Các tài khoản được lưu trên thiết bị nơi bạn thêm chúng và không được đồng bộ.

### Gửi bằng một tài khoản khác đã đăng nhập {#send-as-another-signed-in-account}

Khi soạn thư, menu **From** liệt kê mọi tài khoản đã đăng nhập trên thiết bị này. Chọn một tài khoản để gửi bằng địa chỉ đó. Thư được gửi bằng mật khẩu riêng của tài khoản đó, và bản sao được lưu vào thư mục Đã gửi của tài khoản đó.


## Gửi từ bất kỳ địa chỉ nào trên tên miền của bạn {#send-from-any-address-on-your-domain}

Nếu bạn sở hữu một tên miền, bạn có thể gửi từ bất kỳ địa chỉ nào trên đó, như `billing@example.com` hoặc `no-reply@example.com`, mà không cần tạo bí danh và đăng nhập cho từng địa chỉ. Bạn làm điều này bằng một **mật khẩu catch-all** cho tên miền.

Bạn **không** đăng nhập webmail bằng một tài khoản ký tự đại diện hay catch-all, và không có tính năng nào cần bật. Bạn lưu mật khẩu catch-all một lần trong cài đặt webmail, sau đó menu From cho phép bạn nhập bất kỳ địa chỉ nào trên tên miền đó.

### Bước 1: Tạo mật khẩu catch-all trong bảng điều khiển {#step-1-generate-a-catch-all-password-in-the-dashboard}

1. Vào <a href="/my-account/domains">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> và chọn tên miền của bạn.
2. Mở **Cài đặt nâng cao** và tìm **Mật khẩu tổng hợp**.
3. Nhấn **Tạo mật khẩu**. Để trống trường này để nhận một mật khẩu ngẫu nhiên mạnh, và thêm mô tả nếu muốn (ví dụ "Webmail trên laptop của tôi").
4. Sao chép mật khẩu. Mật khẩu chỉ hiển thị một lần.

Bạn cần là quản trị viên của tên miền để thấy mục này. Dùng **Quản lý mật khẩu** ở cùng chỗ để xem hoặc xoá mật khẩu catch-all sau này. Xoá một mật khẩu sẽ khiến nó ngừng hoạt động ở mọi nơi đã lưu.

### Bước 2: Lưu mật khẩu trong webmail {#step-2-save-it-in-webmail}

1. Trong webmail, mở **Settings <i class="fa fa-angle-right"></i> General**.
2. Tìm thẻ có tên **Send from any address**, ngay bên dưới **Your accounts**.
3. Nhấn **Add catch-all password**.
4. Nhập tên miền (ví dụ `example.com`) và dán mật khẩu catch-all.
5. Nhấn **Save**. Bạn sẽ thấy "You can now send from any address @example.com".

Bạn có thể lưu mật khẩu cho bao nhiêu tên miền tuỳ thích. Để xoá một mật khẩu, nhấn biểu tượng thùng rác bên cạnh.

### Bước 3: Chọn địa chỉ khi soạn thư {#step-3-pick-the-address-when-you-compose}

1. Bắt đầu một thư mới.
2. Mở menu **From**. Bên dưới các tài khoản đã đăng nhập có một mục cho mỗi tên miền đã lưu: **Other address @example.com…**
3. Chọn mục đó. Dòng From sẽ chuyển thành một ô nhập văn bản với `@example.com` phía sau.
4. Nhập phần trước dấu @ (ví dụ `billing`) và gửi.

Thư nháp giữ lại địa chỉ bạn đã nhập, nên thư nháp đã lưu sẽ mở lại với cùng địa chỉ From.

### Những điều cần biết khi gửi bằng catch-all {#what-to-know-about-catch-all-sending}

* **Chỉ có thể gửi.** Mật khẩu catch-all chỉ dùng để gửi. Nó không thể mở hộp thư, nên bạn không thể dùng nó để đọc thư của `billing@example.com`. Để đọc thư trả lời, hãy tạo một bí danh (hoặc một bí danh catch-all chuyển tiếp đến bạn) cho địa chỉ đó.
* **Bản sao đã gửi vào tài khoản bạn đang dùng.** Thư gửi bằng `billing@example.com` được lưu vào thư mục Đã gửi của tài khoản bạn dùng để soạn thư.
* **Dùng được từ mọi tài khoản trên thiết bị.** Mật khẩu đã lưu không gắn với một tài khoản đăng nhập cụ thể. Bất kỳ tài khoản nào trên thiết bị đó đều có thể dùng nó.
* **Chỉ nằm trên thiết bị này.** Mật khẩu chỉ được lưu trên thiết bị nơi bạn lưu nó. Nó không được đồng bộ, và ghép nối thiết bị bằng mã QR cũng không sao chép nó. Hãy thêm lại trên từng thiết bị.
* **App Lock bảo vệ nó.** Nếu App Lock đang bật, mật khẩu được mã hoá cùng với phần dữ liệu cục bộ còn lại, và các mục **Other address** bị ẩn khi ứng dụng đang khoá.
* **Không hỗ trợ gửi theo lịch** cho các địa chỉ gửi bằng mật khẩu catch-all, vì mật khẩu đó không thể đọc lại hay huỷ một thư đã lên lịch. Hãy gửi ngay, hoặc gửi bằng một tài khoản đã đăng nhập.
* **Mật khẩu sai sẽ không đăng xuất bạn.** Nếu mật khẩu catch-all sai hoặc đã bị xoá trong bảng điều khiển, việc gửi sẽ thất bại kèm thông báo lỗi, và bạn vẫn đăng nhập.


## Tổng quan cài đặt webmail {#webmail-settings-at-a-glance}

| Mục                    | Nội dung                                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| **General**            | Tài khoản của bạn, gửi từ bất kỳ địa chỉ nào (mật khẩu catch-all), thông báo, dung lượng |
| **Appearance**         | Chủ đề, bố cục, mật độ, mặc định khi soạn thư, chữ ký, phông chữ, liên kết ngoài         |
| **Privacy & Security** | App Lock, mã hoá PGP, tuỳ chọn quyền riêng tư, báo cáo thư rác                           |
| **Folders & Labels**   | Thư mục đặc biệt, thư mục của bạn, nhãn                                                  |
| **Filters**            | Bộ lọc thư cho bí danh đã đăng nhập                                                      |
| **Calendar**           | Ngày bắt đầu tuần và công việc                                                           |
| **Search**             | Lập chỉ mục tìm kiếm, tình trạng chỉ mục, tìm kiếm đã lưu, toán tử tìm kiếm              |
| **Advanced**           | Dung lượng hộp thư, bộ nhớ đệm cục bộ và đặt lại ứng dụng                                |
| **Keyboard Shortcuts** | Mọi phím tắt                                                                             |
| **About & Help**       | Phiên bản, tải ứng dụng máy tính, phản hồi và liên kết                                   |

Những thứ thuộc về chính tên miền hoặc bí danh, như DNS, người nhận chuyển tiếp, giới hạn dung lượng, trả lời tự động khi vắng mặt, mật khẩu catch-all và quét thư rác, được thiết lập trong <a href="/my-account/domains">bảng điều khiển web</a>.


## Quyền riêng tư và App Lock {#privacy-and-app-lock}

Webmail giữ một bản sao cục bộ thư của bạn để chạy nhanh và hoạt động ngoại tuyến. **App Lock** (trong **Settings <i class="fa fa-angle-right"></i> Privacy & Security**) mã hoá dữ liệu cục bộ đó, cài đặt và mật khẩu đã lưu của bạn trên thiết bị, và mở khoá bằng passkey hoặc mã PIN. Thư và cập nhật trực tiếp đi thẳng giữa ứng dụng và Forward Email, không có dịch vụ quảng cáo hay theo dõi nào ở giữa.


## Khắc phục sự cố {#troubleshooting}

**"Can't send as <name@example.com>: sign in to that account on this device again, or save its domain's catch-all password in Settings."**

Webmail không có mật khẩu cho địa chỉ đó trên thiết bị này. Hãy đăng nhập bí danh đó, hoặc lưu mật khẩu catch-all của tên miền trong **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Send from any address**. Nếu ứng dụng đang khoá, hãy mở khoá trước.

**Mục "Other address" không có trong menu From.**

Kiểm tra rằng bạn đã lưu mật khẩu catch-all trên thiết bị này, và App Lock đã được mở khoá.

**Gửi từ địa chỉ catch-all thất bại với lỗi xác thực.**

Mật khẩu catch-all có thể đã bị xoá hoặc nhập sai. Tạo một mật khẩu mới trong bảng điều khiển, sau đó xoá mật khẩu cũ trong webmail và thêm mật khẩu mới.

**Mật khẩu bảng điều khiển của tôi không dùng được trong webmail.**

Webmail cần mật khẩu bí danh, không phải mật khẩu bảng điều khiển. Xem [Tạo mật khẩu bí danh](#generate-an-alias-password).

Vẫn gặp khó khăn? Xem <a href="/faq">Câu hỏi thường gặp</a> của chúng tôi hoặc <a href="/help">liên hệ với chúng tôi</a>.
