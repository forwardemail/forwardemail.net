# Email API {#email-api}


## Mục lục {#table-of-contents}

* [Thư viện](#libraries)
* [Base URI](#base-uri)
* [Xác thực](#authentication)
  * [Xác thực API Token (Khuyến nghị cho hầu hết các điểm cuối)](#api-token-authentication-recommended-for-most-endpoints)
  * [Xác thực thông tin đăng nhập Alias (Dành cho email gửi đi)](#alias-credentials-authentication-for-outbound-email)
  * [Các điểm cuối chỉ dành cho Alias](#alias-only-endpoints)
* [Lỗi](#errors)
* [Địa phương hóa](#localization)
* [Phân trang](#pagination)
* [Nhật ký](#logs)
  * [Lấy nhật ký](#retrieve-logs)
* [Tài khoản](#account)
  * [Tạo tài khoản](#create-account)
  * [Lấy tài khoản](#retrieve-account)
  * [Cập nhật tài khoản](#update-account)
* [Danh bạ Alias (CardDAV)](#alias-contacts-carddav)
  * [Liệt kê danh bạ](#list-contacts)
  * [Tạo danh bạ](#create-contact)
  * [Lấy danh bạ](#retrieve-contact)
  * [Cập nhật danh bạ](#update-contact)
  * [Xóa danh bạ](#delete-contact)
* [Lịch Alias (CalDAV)](#alias-calendars-caldav)
  * [Liệt kê lịch](#list-calendars)
  * [Tạo lịch](#create-calendar)
  * [Lấy lịch](#retrieve-calendar)
  * [Cập nhật lịch](#update-calendar)
  * [Xóa lịch](#delete-calendar)
* [Tin nhắn Alias (IMAP/POP3)](#alias-messages-imappop3)
  * [Liệt kê và tìm kiếm tin nhắn](#list-and-search-for-messages)
  * [Tạo tin nhắn](#create-message)
  * [Lấy tin nhắn](#retrieve-message)
  * [Cập nhật tin nhắn](#update-message)
  * [Xóa tin nhắn](#delete-message)
* [Thư mục Alias (IMAP/POP3)](#alias-folders-imappop3)
  * [Liệt kê thư mục](#list-folders)
  * [Tạo thư mục](#create-folder)
  * [Lấy thư mục](#retrieve-folder)
  * [Cập nhật thư mục](#update-folder)
  * [Xóa thư mục](#delete-folder)
  * [Sao chép thư mục](#copy-folder)
* [Email gửi đi](#outbound-emails)
  * [Lấy giới hạn email SMTP gửi đi](#get-outbound-smtp-email-limit)
  * [Liệt kê email SMTP gửi đi](#list-outbound-smtp-emails)
  * [Tạo email SMTP gửi đi](#create-outbound-smtp-email)
  * [Lấy email SMTP gửi đi](#retrieve-outbound-smtp-email)
  * [Xóa email SMTP gửi đi](#delete-outbound-smtp-email)
* [Tên miền](#domains)
  * [Liệt kê tên miền](#list-domains)
  * [Tạo tên miền](#create-domain)
  * [Lấy tên miền](#retrieve-domain)
  * [Xác minh bản ghi tên miền](#verify-domain-records)
  * [Xác minh bản ghi SMTP tên miền](#verify-domain-smtp-records)
  * [Liệt kê mật khẩu catch-all toàn miền](#list-domain-wide-catch-all-passwords)
  * [Tạo mật khẩu catch-all toàn miền](#create-domain-wide-catch-all-password)
  * [Xóa mật khẩu catch-all toàn miền](#remove-domain-wide-catch-all-password)
  * [Cập nhật tên miền](#update-domain)
  * [Xóa tên miền](#delete-domain)
* [Lời mời](#invites)
  * [Chấp nhận lời mời tên miền](#accept-domain-invite)
  * [Tạo lời mời tên miền](#create-domain-invite)
  * [Xóa lời mời tên miền](#remove-domain-invite)
* [Thành viên](#members)
  * [Cập nhật thành viên tên miền](#update-domain-member)
  * [Xóa thành viên tên miền](#remove-domain-member)
* [Alias](#aliases)
  * [Tạo mật khẩu alias](#generate-an-alias-password)
  * [Liệt kê alias tên miền](#list-domain-aliases)
  * [Tạo alias tên miền mới](#create-new-domain-alias)
  * [Lấy alias tên miền](#retrieve-domain-alias)
  * [Cập nhật alias tên miền](#update-domain-alias)
  * [Xóa alias tên miền](#delete-domain-alias)
* [Mã hóa](#encrypt)
  * [Mã hóa bản ghi TXT](#encrypt-txt-record)


## Thư viện {#libraries}

Hiện tại chúng tôi chưa phát hành bất kỳ thư viện API nào, nhưng chúng tôi dự định sẽ làm điều đó trong tương lai gần. Gửi email đến <api@forwardemail.net> nếu bạn muốn được thông báo khi thư viện API cho một ngôn ngữ lập trình cụ thể được phát hành. Trong khi đó, bạn có thể sử dụng các thư viện HTTP request được khuyến nghị dưới đây trong ứng dụng của mình, hoặc đơn giản sử dụng [curl](https://stackoverflow.com/a/27442239/3586413) như trong các ví dụ bên dưới.

| Ngôn ngữ  | Thư viện                                                               |
| --------- | --------------------------------------------------------------------- |
| Ruby      | [Faraday](https://github.com/lostisland/faraday)                      |
| Python    | [requests](https://github.com/psf/requests)                           |
| Java      | [OkHttp](https://github.com/square/okhttp/)                           |
| PHP       | [guzzle](https://github.com/guzzle/guzzle)                            |
| JavaScript| [superagent](https://github.com/ladjs/superagent) (chúng tôi là người duy trì) |
| Node.js   | [superagent](https://github.com/ladjs/superagent) (chúng tôi là người duy trì) |
| Go        | [net/http](https://golang.org/pkg/net/http/)                          |
| .NET      | [RestSharp](https://github.com/restsharp/RestSharp)                   |
## Base URI {#base-uri}

Đường dẫn cơ sở HTTP hiện tại là: `BASE_URI`.


## Xác thực {#authentication}

Tất cả các điểm cuối yêu cầu xác thực bằng [Basic Authorization](https://en.wikipedia.org/wiki/Basic_access_authentication). Chúng tôi hỗ trợ hai phương thức xác thực:

### Xác thực API Token (Khuyến nghị cho hầu hết các điểm cuối) {#api-token-authentication-recommended-for-most-endpoints}

Đặt [API key](https://forwardemail.net/my-account/security) của bạn làm giá trị "username" với mật khẩu để trống:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

Lưu ý dấu hai chấm (`:`) sau API token – điều này biểu thị mật khẩu trống trong định dạng Basic Auth.

### Xác thực Thông tin đăng nhập Alias (Cho email gửi đi) {#alias-credentials-authentication-for-outbound-email}

Điểm cuối [Tạo email SMTP gửi đi](#create-outbound-smtp-email) cũng hỗ trợ xác thực bằng địa chỉ email alias của bạn và [mật khẩu alias được tạo](/faq#do-you-support-receiving-email-with-imap):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hello" \
  -d "text=Test email"
```

Phương thức này hữu ích khi gửi email từ các ứng dụng đã sử dụng thông tin đăng nhập SMTP và giúp việc chuyển đổi từ SMTP sang API của chúng tôi trở nên liền mạch.

### Các điểm cuối chỉ dùng Alias {#alias-only-endpoints}

Các điểm cuối [Alias Contacts](#alias-contacts-carddav), [Alias Calendars](#alias-calendars-caldav), [Alias Messages](#alias-messages-imappop3), và [Alias Folders](#alias-folders-imappop3) yêu cầu thông tin đăng nhập alias và không hỗ trợ xác thực bằng API token.

Đừng lo – các ví dụ được cung cấp bên dưới nếu bạn chưa rõ đây là gì.


## Lỗi {#errors}

Nếu có lỗi xảy ra, phần thân phản hồi của yêu cầu API sẽ chứa thông báo lỗi chi tiết.

| Mã   | Tên                   |
| ---- | --------------------- |
| 200  | OK                    |
| 400  | Yêu cầu không hợp lệ   |
| 401  | Chưa xác thực         |
| 403  | Bị cấm                |
| 404  | Không tìm thấy         |
| 429  | Quá nhiều yêu cầu      |
| 500  | Lỗi máy chủ nội bộ    |
| 501  | Chưa được triển khai   |
| 502  | Cổng lỗi               |
| 503  | Dịch vụ không khả dụng |
| 504  | Hết thời gian chờ cổng|

> \[!TIP]
> Nếu bạn nhận được mã trạng thái 5xx (điều này không nên xảy ra), vui lòng liên hệ với chúng tôi tại <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> và chúng tôi sẽ giúp bạn giải quyết vấn đề ngay lập tức.


## Địa phương hóa {#localization}

Dịch vụ của chúng tôi được dịch sang hơn 25 ngôn ngữ khác nhau. Tất cả các thông báo phản hồi API được dịch theo ngôn ngữ cuối cùng được phát hiện của người dùng thực hiện yêu cầu API. Bạn có thể ghi đè điều này bằng cách truyền header `Accept-Language` tùy chỉnh. Hãy thử sử dụng menu chọn ngôn ngữ ở cuối trang này.


## Phân trang {#pagination}

> \[!NOTE]
> Từ ngày 1 tháng 11 năm 2024, các điểm cuối API cho [Liệt kê tên miền](#list-domains) và [Liệt kê bí danh tên miền](#list-domain-aliases) sẽ mặc định trả về tối đa `1000` kết quả mỗi trang. Nếu bạn muốn sử dụng tính năng này sớm hơn, bạn có thể thêm `?paginate=true` làm tham số truy vấn bổ sung vào URL của điểm cuối.

Phân trang được hỗ trợ bởi tất cả các điểm cuối API liệt kê kết quả.

Chỉ cần cung cấp các thuộc tính truy vấn `page` (và tùy chọn `limit`).

Thuộc tính `page` phải là số lớn hơn hoặc bằng `1`. Nếu bạn cung cấp `limit` (cũng là số), thì giá trị tối thiểu là `10` và tối đa là `50` (trừ khi có ghi chú khác).

| Tham số truy vấn      | Bắt buộc | Loại   | Mô tả                                                                                                                                                   |
| --------------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                | Không    | Số     | Trang kết quả cần trả về. Nếu không chỉ định, giá trị `page` sẽ là `1`. Phải là số lớn hơn hoặc bằng `1`.                                               |
| `limit`               | Không    | Số     | Số lượng kết quả trả về mỗi trang. Mặc định là `10` nếu không chỉ định. Phải là số lớn hơn hoặc bằng `1`, và nhỏ hơn hoặc bằng `50`.                    |
Để xác định xem có còn kết quả khác hay không, chúng tôi cung cấp các header phản hồi HTTP sau (bạn có thể phân tích cú pháp để phân trang tự động):

| HTTP Response Header | Ví dụ                                                                                                                                                                                                                                                   | Mô tả                                                                                                                                                                                                                                                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `X-Page-Count`       | `X-Page-Count: 3`                                                                                                                                                                                                                                       | Tổng số trang có sẵn.                                                                                                                                                                                                                                                                                                                                             |
| `X-Page-Current`     | `X-Page-Current: 1`                                                                                                                                                                                                                                     | Trang kết quả hiện tại được trả về (ví dụ dựa trên tham số truy vấn `page`).                                                                                                                                                                                                                                                                                      |
| `X-Page-Size`        | `X-Page-Size: 10`                                                                                                                                                                                                                                       | Tổng số kết quả trong trang được trả về (ví dụ dựa trên tham số truy vấn `limit` và kết quả thực tế trả về).                                                                                                                                                                                                                                                     |
| `X-Item-Count`       | `X-Item-Count: 30`                                                                                                                                                                                                                                      | Tổng số mục có sẵn trên tất cả các trang.                                                                                                                                                                                                                                                                                                                        |
| `Link`               | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Chúng tôi cung cấp một header phản hồi HTTP `Link` mà bạn có thể phân tích cú pháp như ví dụ. Điều này [tương tự như GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (ví dụ không phải tất cả các giá trị sẽ được cung cấp nếu không phù hợp hoặc không có sẵn, ví dụ `"next"` sẽ không được cung cấp nếu không có trang tiếp theo). |
> Ví dụ Yêu cầu:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## Nhật ký {#logs}

### Lấy nhật ký {#retrieve-logs}

API của chúng tôi cho phép bạn tải xuống nhật ký cho tài khoản của bạn một cách lập trình. Gửi yêu cầu đến điểm cuối này sẽ xử lý tất cả nhật ký cho tài khoản của bạn và gửi email cho bạn dưới dạng tệp đính kèm ([Gzip](https://en.wikipedia.org/wiki/Gzip) nén [CSV](https://en.wikipedia.org/wiki/Comma-separated_values)) khi hoàn tất.

Điều này cho phép bạn tạo các công việc nền với một [Cron job](https://en.wikipedia.org/wiki/Cron) hoặc sử dụng phần mềm lập lịch công việc [Node.js Bree](https://github.com/breejs/bree) của chúng tôi để nhận nhật ký bất cứ khi nào bạn muốn. Lưu ý rằng điểm cuối này giới hạn `10` yêu cầu mỗi ngày.

Tệp đính kèm có dạng chữ thường của `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` và email chứa một bản tóm tắt ngắn gọn về các nhật ký đã lấy. Bạn cũng có thể tải xuống nhật ký bất cứ lúc nào từ [Tài khoản của tôi → Nhật ký](/my-account/logs)

> `GET /v1/logs/download`

| Tham số Querystring | Bắt buộc | Loại          | Mô tả                                                                                                                         |
| ------------------- | -------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `domain`            | Không    | Chuỗi (FQDN)  | Lọc nhật ký theo tên miền đầy đủ ("FQDN"). Nếu bạn không cung cấp thì tất cả nhật ký trên tất cả các tên miền sẽ được lấy.     |
| `q`                 | Không    | Chuỗi         | Tìm kiếm nhật ký theo email, tên miền, tên bí danh, địa chỉ IP hoặc ngày (`M/Y`, `M/D/YY`, `M-D`, `M-D-YY`, hoặc định dạng `M.D.YY`). |
| `bounce_category`   | Không    | Chuỗi         | Tìm kiếm nhật ký theo một loại bounce cụ thể (ví dụ: `blocklist`).                                                             |
| `response_code`     | Không    | Số            | Tìm kiếm nhật ký theo mã phản hồi lỗi cụ thể (ví dụ: `421` hoặc `550`).                                                        |

> Ví dụ Yêu cầu:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Ví dụ Cron job (vào nửa đêm mỗi ngày):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Lưu ý bạn có thể sử dụng các dịch vụ như [Crontab.guru](https://crontab.guru/) để kiểm tra cú pháp biểu thức cron job của bạn.

> Ví dụ Cron job (vào nửa đêm mỗi ngày **và với nhật ký của ngày trước đó**):

Dành cho MacOS:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Dành cho Linux và Ubuntu:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```


## Tài khoản {#account}

### Tạo tài khoản {#create-account}

> `POST /v1/account`

| Tham số Body | Bắt buộc | Loại           | Mô tả          |
| ------------ | -------- | -------------- | -------------- |
| `email`      | Có       | Chuỗi (Email)  | Địa chỉ email  |
| `password`   | Có       | Chuỗi          | Mật khẩu       |

> Ví dụ Yêu cầu:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Lấy tài khoản {#retrieve-account}

> `GET /v1/account`

> Ví dụ Yêu cầu:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Cập nhật tài khoản {#update-account}

> `PUT /v1/account`

| Tham số Body  | Bắt buộc | Loại           | Mô tả                |
| ------------- | -------- | -------------- | -------------------- |
| `email`       | Không    | Chuỗi (Email)  | Địa chỉ email        |
| `given_name`  | Không    | Chuỗi          | Tên                  |
| `family_name` | Không    | Chuỗi          | Họ                   |
| `avatar_url`  | Không    | Chuỗi (URL)    | Liên kết đến ảnh đại diện |

> Ví dụ Yêu cầu:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## Danh bạ Bí danh (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Khác với các điểm cuối API khác, những điểm này yêu cầu [Xác thực](#authentication) "tên người dùng" bằng tên người dùng bí danh và "mật khẩu" bằng mật khẩu được tạo cho bí danh dưới dạng tiêu đề ủy quyền Basic.
> \[!WARNING]
> Phần endpoint này đang trong quá trình phát triển và dự kiến sẽ được phát hành (hy vọng) vào năm 2024. Trong thời gian chờ đợi, vui lòng sử dụng một ứng dụng IMAP từ menu "Apps" trong phần điều hướng của trang web chúng tôi.

### Liệt kê liên hệ {#list-contacts}

> `GET /v1/contacts`

**Sắp ra mắt**

### Tạo liên hệ {#create-contact}

> `POST /v1/contacts`

**Sắp ra mắt**

### Lấy thông tin liên hệ {#retrieve-contact}

> `GET /v1/contacts/:id`

**Sắp ra mắt**

### Cập nhật liên hệ {#update-contact}

> `PUT /v1/contacts/:id`

**Sắp ra mắt**

### Xóa liên hệ {#delete-contact}

> `DELETE /v1/contacts/:id`

**Sắp ra mắt**


## Lịch Alias (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> Khác với các endpoint API khác, các endpoint này yêu cầu [Xác thực](#authentication) với "username" bằng tên người dùng alias và "password" bằng mật khẩu được tạo cho alias dưới dạng header Basic Authorization.

> \[!WARNING]
> Phần endpoint này đang trong quá trình phát triển và dự kiến sẽ được phát hành (hy vọng) vào năm 2024. Trong thời gian chờ đợi, vui lòng sử dụng một ứng dụng IMAP từ menu "Apps" trong phần điều hướng của trang web chúng tôi.

### Liệt kê lịch {#list-calendars}

> `GET /v1/calendars`

**Sắp ra mắt**

### Tạo lịch {#create-calendar}

> `POST /v1/calendars`

**Sắp ra mắt**

### Lấy thông tin lịch {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Sắp ra mắt**

### Cập nhật lịch {#update-calendar}

> `PUT /v1/calendars/:id`

**Sắp ra mắt**

### Xóa lịch {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Sắp ra mắt**


## Tin nhắn Alias (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> Khác với các endpoint API khác, các endpoint này yêu cầu [Xác thực](#authentication) với "username" bằng tên người dùng alias và "password" bằng mật khẩu được tạo cho alias dưới dạng header Basic Authorization.

> \[!WARNING]
> Phần endpoint này đang trong quá trình phát triển và dự kiến sẽ được phát hành (hy vọng) vào năm 2024. Trong thời gian chờ đợi, vui lòng sử dụng một ứng dụng IMAP từ menu "Apps" trong phần điều hướng của trang web chúng tôi.

Vui lòng đảm bảo bạn đã làm theo hướng dẫn thiết lập cho tên miền của mình.

Các hướng dẫn này có thể được tìm thấy trong phần Câu hỏi thường gặp của chúng tôi [Bạn có hỗ trợ nhận email qua IMAP không?](/faq#do-you-support-receiving-email-with-imap).

### Liệt kê và tìm kiếm tin nhắn {#list-and-search-for-messages}

> `GET /v1/messages`

**Sắp ra mắt**

### Tạo tin nhắn {#create-message}

> \[!NOTE]
> Điều này sẽ **KHÔNG** gửi email – nó chỉ đơn giản thêm tin nhắn vào thư mục hộp thư của bạn (ví dụ tương tự lệnh IMAP `APPEND`). Nếu bạn muốn gửi email, hãy xem [Tạo email SMTP gửi đi](#create-outbound-smtp-email) bên dưới. Sau khi tạo email SMTP gửi đi, bạn có thể thêm một bản sao của nó vào hộp thư alias của bạn để lưu trữ bằng endpoint này.

> `POST /v1/messages`

**Sắp ra mắt**

### Lấy tin nhắn {#retrieve-message}

> `GET /v1/messages/:id`

**Sắp ra mắt**

### Cập nhật tin nhắn {#update-message}

> `PUT /v1/messages/:id`

**Sắp ra mắt**

### Xóa tin nhắn {#delete-message}

> `DELETE /v1/messages:id`

**Sắp ra mắt**


## Thư mục Alias (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Các endpoint thư mục với đường dẫn thư mục <code>/v1/folders/:path</code> có thể thay thế cho ID thư mục <code>:id</code>. Điều này có nghĩa bạn có thể tham chiếu thư mục bằng giá trị <code>path</code> hoặc <code>id</code>.

> \[!WARNING]
> Phần endpoint này đang trong quá trình phát triển và dự kiến sẽ được phát hành (hy vọng) vào năm 2024. Trong thời gian chờ đợi, vui lòng sử dụng một ứng dụng IMAP từ menu "Apps" trong phần điều hướng của trang web chúng tôi.

### Liệt kê thư mục {#list-folders}

> `GET /v1/folders`

**Sắp ra mắt**

### Tạo thư mục {#create-folder}

> `POST /v1/folders`

**Sắp ra mắt**

### Lấy thư mục {#retrieve-folder}

> `GET /v1/folders/:id`

**Sắp ra mắt**

### Cập nhật thư mục {#update-folder}

> `PUT /v1/folders/:id`

**Sắp ra mắt**

### Xóa thư mục {#delete-folder}

> `DELETE /v1/folders/:id`

**Sắp ra mắt**

### Sao chép thư mục {#copy-folder}

> `POST /v1/folders/:id/copy`

**Sắp ra mắt**


## Email gửi đi {#outbound-emails}

Vui lòng đảm bảo bạn đã làm theo hướng dẫn thiết lập cho tên miền của mình.

Các hướng dẫn này có thể được tìm thấy tại [Tài khoản của tôi → Tên miền → Cài đặt → Cấu hình SMTP gửi đi](/my-account/domains). Bạn cần đảm bảo thiết lập DKIM, Return-Path và DMARC để gửi SMTP đi với tên miền của bạn.
### Lấy giới hạn email SMTP gửi đi {#get-outbound-smtp-email-limit}

Đây là một endpoint đơn giản trả về một đối tượng JSON chứa `count` và `limit` cho số lượng tin nhắn SMTP gửi đi hàng ngày trên cơ sở từng tài khoản.

> `GET /v1/emails/limit`

> Ví dụ yêu cầu:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Liệt kê email SMTP gửi đi {#list-outbound-smtp-emails}

Lưu ý rằng endpoint này không trả về giá trị thuộc tính cho `message`, `headers`, cũng như `rejectedErrors` của một email.

Để trả về các thuộc tính và giá trị đó, vui lòng sử dụng endpoint [Lấy email](#retrieve-email) với ID email.

> `GET /v1/emails`

| Tham số Querystring | Bắt buộc | Loại                      | Mô tả                                                                                                                                               |
| ------------------- | -------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                 | Không    | Chuỗi (hỗ trợ RegExp)     | Tìm kiếm email theo metadata                                                                                                                       |
| `domain`            | Không    | Chuỗi (hỗ trợ RegExp)     | Tìm kiếm email theo tên miền                                                                                                                       |
| `sort`              | Không    | Chuỗi                     | Sắp xếp theo một trường cụ thể (thêm dấu gạch ngang `-` ở đầu để sắp xếp theo chiều ngược lại của trường đó). Mặc định là `created_at` nếu không đặt. |
| `page`              | Không    | Số                        | Xem [Phân trang](#pagination) để biết thêm chi tiết                                                                                                |
| `limit`             | Không    | Số                        | Xem [Phân trang](#pagination) để biết thêm chi tiết                                                                                                |

> Ví dụ yêu cầu:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Tạo email SMTP gửi đi {#create-outbound-smtp-email}

API của chúng tôi để tạo email được lấy cảm hứng và tận dụng cấu hình tùy chọn message của Nodemailer. Vui lòng tham khảo [Cấu hình message của Nodemailer](https://nodemailer.com/message/) cho tất cả các tham số thân dưới đây.

Lưu ý rằng ngoại trừ `envelope` và `dkim` (vì chúng tôi tự động thiết lập cho bạn), chúng tôi hỗ trợ tất cả các tùy chọn của Nodemailer. Chúng tôi tự động đặt các tùy chọn `disableFileAccess` và `disableUrlAccess` thành `true` vì lý do bảo mật.

Bạn nên truyền một tùy chọn duy nhất `raw` với email thô đầy đủ của bạn bao gồm cả headers **hoặc** truyền các tùy chọn tham số thân riêng lẻ dưới đây.

Endpoint API này sẽ tự động mã hóa emoji cho bạn nếu chúng được tìm thấy trong headers (ví dụ: dòng chủ đề `Subject: 🤓 Hello` sẽ được chuyển thành `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello` một cách tự động). Mục tiêu của chúng tôi là tạo ra một API email cực kỳ thân thiện với nhà phát triển và dễ sử dụng.

**Xác thực:** Endpoint này hỗ trợ cả [xác thực token API](#api-token-authentication-recommended-for-most-endpoints) và [xác thực thông tin đăng nhập bí danh](#alias-credentials-authentication-for-outbound-email). Xem phần [Xác thực](#authentication) phía trên để biết chi tiết.

> `POST /v1/emails`

| Tham số thân     | Bắt buộc | Loại             | Mô tả                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------- | -------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `from`           | Không    | Chuỗi (Email)    | Địa chỉ email của người gửi (phải tồn tại như một bí danh của tên miền).                                                                                                                                                                                                                                                                                                                                                                                     |
| `to`             | Không    | Chuỗi hoặc Mảng  | Danh sách người nhận phân tách bằng dấu phẩy hoặc một Mảng cho header "To".                                                                                                                                                                                                                                                                                                                                                                                   |
| `cc`             | Không    | Chuỗi hoặc Mảng  | Danh sách người nhận phân tách bằng dấu phẩy hoặc một Mảng cho header "Cc".                                                                                                                                                                                                                                                                                                                                                                                   |
| `bcc`            | Không    | Chuỗi hoặc Mảng  | Danh sách người nhận phân tách bằng dấu phẩy hoặc một Mảng cho header "Bcc".                                                                                                                                                                                                                                                                                                                                                                                  |
| `subject`        | Không    | Chuỗi            | Chủ đề của email.                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `text`           | Không    | Chuỗi hoặc Buffer| Phiên bản văn bản thuần của tin nhắn.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `html`           | Không    | Chuỗi hoặc Buffer| Phiên bản HTML của tin nhắn.                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `attachments`    | Không    | Mảng             | Một mảng các đối tượng đính kèm (xem [các trường phổ biến của Nodemailer](https://nodemailer.com/message/#common-fields)).                                                                                                                                                                                                                                                                                                                                   |
| `sender`         | Không    | Chuỗi            | Địa chỉ email cho header "Sender" (xem [các trường nâng cao hơn của Nodemailer](https://nodemailer.com/message/#more-advanced-fields)).                                                                                                                                                                                                                                                                                                                      |
| `replyTo`        | Không    | Chuỗi            | Địa chỉ email cho header "Reply-To".                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `inReplyTo`      | Không    | Chuỗi            | Message-ID mà tin nhắn này trả lời.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `references`     | Không    | Chuỗi hoặc Mảng  | Danh sách Message-ID phân tách bằng dấu cách hoặc một Mảng các Message-ID.                                                                                                                                                                                                                                                                                                                                                                                     |
| `attachDataUrls` | Không    | Boolean          | Nếu là `true` thì chuyển đổi các hình ảnh `data:` trong nội dung HTML của tin nhắn thành các tệp đính kèm nhúng.                                                                                                                                                                                                                                                                                                                                              |
| `watchHtml`      | Không    | Chuỗi            | Phiên bản HTML dành riêng cho Apple Watch của tin nhắn ([theo tài liệu Nodemailer](https://nodemailer.com/message/#content-options]), các đồng hồ mới nhất không yêu cầu thiết lập này).                                                                                                                                                                                                                                                                       |
| `amp`            | Không    | Chuỗi            | Phiên bản HTML dành riêng cho AMP4EMAIL của tin nhắn (xem [ví dụ của Nodemailer](https://nodemailer.com/message/#amp-example)).                                                                                                                                                                                                                                                                                                                               |
| `icalEvent`      | Không    | Đối tượng        | Một sự kiện iCalendar để sử dụng như nội dung tin nhắn thay thế (xem [sự kiện lịch của Nodemailer](https://nodemailer.com/message/calendar-events/)).                                                                                                                                                                                                                                                                                                        |
| `alternatives`   | Không    | Mảng             | Một mảng các nội dung tin nhắn thay thế (xem [nội dung thay thế của Nodemailer](https://nodemailer.com/message/alternatives/)).                                                                                                                                                                                                                                                                                                                                |
| `encoding`       | Không    | Chuỗi            | Mã hóa cho chuỗi văn bản và HTML (mặc định là `"utf-8"`, nhưng cũng hỗ trợ các giá trị mã hóa `"hex"` và `"base64"`).                                                                                                                                                                                                                                                                                                                                         |
| `raw`            | Không    | Chuỗi hoặc Buffer| Một tin nhắn định dạng RFC822 được tạo tùy chỉnh để sử dụng (thay vì một tin nhắn được tạo bởi Nodemailer – xem [nguồn tùy chỉnh của Nodemailer](https://nodemailer.com/message/custom-source/)).                                                                                                                                                                                                                                                               |
| `textEncoding`   | Không    | Chuỗi            | Mã hóa được ép buộc sử dụng cho các giá trị văn bản (hoặc `"quoted-printable"` hoặc `"base64"`). Giá trị mặc định là giá trị gần nhất được phát hiện (với ASCII sử dụng `"quoted-printable"`).                                                                                                                                                                                                                                                             |
| `priority`       | Không    | Chuỗi            | Mức độ ưu tiên cho email (có thể là `"high"`, `"normal"` (mặc định), hoặc `"low"`). Lưu ý rằng giá trị `"normal"` không đặt header ưu tiên (đây là hành vi mặc định). Nếu đặt giá trị `"high"` hoặc `"low"` thì các header `X-Priority`, `X-MSMail-Priority`, và `Importance` [sẽ được thiết lập tương ứng](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers`        | Không    | Đối tượng hoặc Mảng | Một đối tượng hoặc một mảng các trường header bổ sung để thiết lập (xem [header tùy chỉnh của Nodemailer](https://nodemailer.com/message/custom-headers/)).                                                                                                                                                                                                                                                                                                |
| `messageId`      | Không    | Chuỗi            | Giá trị Message-ID tùy chọn cho header "Message-ID" (một giá trị mặc định sẽ được tạo tự động nếu không đặt – lưu ý rằng giá trị này nên [tuân thủ theo chuẩn RFC2822](https://stackoverflow.com/a/4031705)).                                                                                                                                                                                                                                               |
| `date`           | Không    | Chuỗi hoặc Ngày  | Giá trị Date tùy chọn sẽ được sử dụng nếu header Date bị thiếu sau khi phân tích, nếu không sẽ sử dụng chuỗi UTC hiện tại nếu không đặt. Header ngày không được vượt quá 30 ngày so với thời gian hiện tại.                                                                                                                                                                                                                                               |
| `list`           | Không    | Đối tượng        | Một đối tượng tùy chọn của các header `List-*` (xem [header danh sách của Nodemailer](https://nodemailer.com/message/list-headers/)).                                                                                                                                                                                                                                                                                                                        |
> Yêu cầu ví dụ (API Token):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Yêu cầu ví dụ (Thông tin đăng nhập Alias):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Yêu cầu ví dụ (Email thô):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Lấy email SMTP gửi đi {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Yêu cầu ví dụ:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Xóa email SMTP gửi đi {#delete-outbound-smtp-email}

Việc xóa email sẽ đặt trạng thái thành `"rejected"` (và sau đó không xử lý trong hàng đợi) nếu và chỉ nếu trạng thái hiện tại là một trong các trạng thái `"pending"`, `"queued"`, hoặc `"deferred"`.  Chúng tôi có thể tự động xóa email sau 30 ngày kể từ khi chúng được tạo và/hoặc gửi – do đó bạn nên giữ một bản sao email SMTP gửi đi trong client, cơ sở dữ liệu hoặc ứng dụng của bạn.  Bạn có thể tham chiếu giá trị ID email của chúng tôi trong cơ sở dữ liệu nếu muốn – giá trị này được trả về từ cả hai điểm cuối [Tạo email](#create-email) và [Lấy email](#retrieve-email).

> `DELETE /v1/emails/:id`

> Yêu cầu ví dụ:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## Tên miền {#domains}

> \[!TIP]
> Các điểm cuối tên miền với tên miền dưới dạng <code>/v1/domains/:domain_name</code> có thể thay thế cho ID tên miền <code>:domain_id</code>. Điều này có nghĩa là bạn có thể tham chiếu tên miền bằng giá trị <code>name</code> hoặc <code>id</code>.

### Liệt kê tên miền {#list-domains}

> \[!NOTE]
> Từ ngày 1 tháng 11 năm 2024, các điểm cuối API cho [Liệt kê tên miền](#list-domains) và [Liệt kê bí danh tên miền](#list-domain-aliases) sẽ mặc định giới hạn tối đa `1000` kết quả mỗi trang.  Nếu bạn muốn chọn tham gia hành vi này sớm, bạn có thể truyền `?paginate=true` như một tham số truy vấn bổ sung vào URL của điểm cuối.  Xem thêm [Phân trang](#pagination) để hiểu rõ hơn.

> `GET /v1/domains`

| Tham số truy vấn       | Bắt buộc | Loại                      | Mô tả                                                                                                                                               |
| --------------------- | -------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                   | Không    | Chuỗi (hỗ trợ RegExp)     | Tìm kiếm tên miền theo tên                                                                                                                         |
| `name`                | Không    | Chuỗi (hỗ trợ RegExp)     | Tìm kiếm tên miền theo tên                                                                                                                         |
| `sort`                | Không    | Chuỗi                    | Sắp xếp theo trường cụ thể (thêm dấu gạch ngang `-` ở đầu để sắp xếp theo chiều ngược lại). Mặc định là `created_at` nếu không đặt.               |
| `page`                | Không    | Số                       | Xem [Phân trang](#pagination) để hiểu rõ hơn                                                                                                      |
| `limit`               | Không    | Số                       | Xem [Phân trang](#pagination) để hiểu rõ hơn                                                                                                      |

> Yêu cầu ví dụ:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Tạo tên miền {#create-domain}

> `POST /v1/domains`

| Tham số thân yêu cầu           | Bắt buộc | Loại                                          | Mô tả                                                                                                                                                                                                                                                                                                               |
| ------------------------------ | -------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`                       | Có       | Chuỗi (FQDN hoặc IP)                          | Tên miền đầy đủ ("FQDN") hoặc địa chỉ IP                                                                                                                                                                                                                                                                           |
| `team_domain`                  | Không    | Chuỗi (ID tên miền hoặc tên miền; FQDN)      | Tự động gán tên miền này cho cùng một nhóm từ một tên miền khác. Điều này có nghĩa tất cả thành viên từ tên miền này sẽ được gán làm thành viên nhóm, và `plan` cũng sẽ tự động đặt thành `team`. Bạn có thể đặt thành `"none"` nếu cần để tắt rõ ràng tính năng này, nhưng không bắt buộc.                      |
| `plan`                         | Không    | Chuỗi (liệt kê)                              | Loại gói (phải là `"free"`, `"enhanced_protection"`, hoặc `"team"`, mặc định là `"free"` hoặc gói trả phí hiện tại của người dùng nếu có)                                                                                                                                                                        |
| `catchall`                     | Không    | Chuỗi (địa chỉ email phân tách) hoặc Boolean | Tạo bí danh catch-all mặc định, mặc định là `true` (nếu `true` sẽ dùng địa chỉ email của người dùng API làm người nhận, nếu `false` sẽ không tạo catch-all). Nếu truyền chuỗi, đó là danh sách địa chỉ email phân tách làm người nhận (phân tách bằng xuống dòng, dấu cách, và/hoặc dấu phẩy)                      |
| `has_adult_content_protection` | Không    | Boolean                                       | Có bật bảo vệ nội dung người lớn của Bộ quét Spam trên tên miền này không                                                                                                                                                                                                                                          |
| `has_phishing_protection`      | Không    | Boolean                                       | Có bật bảo vệ lừa đảo của Bộ quét Spam trên tên miền này không                                                                                                                                                                                                                                                     |
| `has_executable_protection`    | Không    | Boolean                                       | Có bật bảo vệ tệp thực thi của Bộ quét Spam trên tên miền này không                                                                                                                                                                                                                                                |
| `has_virus_protection`         | Không    | Boolean                                       | Có bật bảo vệ virus của Bộ quét Spam trên tên miền này không                                                                                                                                                                                                                                                       |
| `has_recipient_verification`   | Không    | Boolean                                       | Mặc định toàn cục của tên miền về việc có yêu cầu người nhận bí danh phải nhấp vào liên kết xác minh email để email được chuyển tiếp hay không                                                                                                                                                                   |
| `ignore_mx_check`              | Không    | Boolean                                       | Có bỏ qua kiểm tra bản ghi MX trên tên miền để xác minh không. Điều này chủ yếu dành cho người dùng có quy tắc cấu hình MX nâng cao và cần giữ bản ghi MX hiện tại và chuyển tiếp đến MX của chúng tôi.                                                                                                           |
| `retention_days`               | Không    | Số                                            | Số nguyên từ `0` đến `30` tương ứng với số ngày lưu trữ email SMTP gửi đi sau khi đã gửi thành công hoặc lỗi vĩnh viễn. Mặc định là `0`, nghĩa là email SMTP gửi đi sẽ bị xóa và làm mờ ngay lập tức để bảo mật cho bạn.                                                                                           |
| `bounce_webhook`               | Không    | Chuỗi (URL) hoặc Boolean (false)              | URL webhook `http://` hoặc `https://` bạn chọn để gửi webhook trả lại. Chúng tôi sẽ gửi yêu cầu `POST` đến URL này với thông tin về lỗi gửi SMTP (ví dụ lỗi mềm hoặc lỗi cứng – để bạn quản lý người đăng ký và quản lý email gửi đi một cách lập trình).                                                    |
| `max_quota_per_alias`          | Không    | Chuỗi                                         | Dung lượng tối đa lưu trữ cho các bí danh trên tên miền này. Nhập giá trị như "1 GB" sẽ được phân tích bởi [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                                       |
> Ví dụ Yêu cầu:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Lấy thông tin domain {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Ví dụ Yêu cầu:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Xác minh bản ghi domain {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Ví dụ Yêu cầu:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Xác minh bản ghi SMTP domain {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Ví dụ Yêu cầu:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Liệt kê mật khẩu catch-all toàn domain {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Ví dụ Yêu cầu:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Tạo mật khẩu catch-all toàn domain {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Tham số Body  | Bắt buộc | Loại   | Mô tả                                                                                                                                                                                                                      |
| ------------- | -------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Không    | Chuỗi  | Mật khẩu mới tùy chỉnh của bạn để sử dụng cho mật khẩu catch-all toàn domain. Lưu ý bạn có thể để trống hoặc không gửi tham số này trong body yêu cầu API nếu muốn nhận mật khẩu mạnh được tạo ngẫu nhiên.                Mật khẩu hộp thư tùy chỉnh phải tối đa 128 ký tự, không được bắt đầu hoặc kết thúc bằng khoảng trắng và không được chứa dấu ngoặc kép hoặc dấu nháy đơn. Mật khẩu catch-all chỉ dành cho gửi SMTP. Đối với IMAP, POP3, CalDAV, CardDAV và truy cập hộp thư, hãy tạo mật khẩu cho bí danh cụ thể. |
| `description`  | Không    | Chuỗi  | Mô tả chỉ dùng cho mục đích tổ chức.                                                                                                                                                                                      |

> Ví dụ Yêu cầu:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Xóa mật khẩu catch-all toàn domain {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Ví dụ Yêu cầu:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Cập nhật domain {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Tham số Body                  | Bắt buộc | Loại                            | Mô tả                                                                                                                                                                                                                                                                                       |
| ----------------------------- | -------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port`                   | Không    | Chuỗi hoặc Số                   | Cổng tùy chỉnh để cấu hình cho chuyển tiếp SMTP (mặc định là `"25"`)                                                                                                                                                                                                                        |
| `has_adult_content_protection`| Không    | Boolean                        | Có bật bảo vệ nội dung người lớn của Bộ quét Spam trên domain này hay không                                                                                                                                                                                                                 |
| `has_phishing_protection`     | Không    | Boolean                        | Có bật bảo vệ lừa đảo (phishing) của Bộ quét Spam trên domain này hay không                                                                                                                                                                                                                  |
| `has_executable_protection`   | Không    | Boolean                        | Có bật bảo vệ tệp thực thi của Bộ quét Spam trên domain này hay không                                                                                                                                                                                                                       |
| `has_virus_protection`        | Không    | Boolean                        | Có bật bảo vệ virus của Bộ quét Spam trên domain này hay không                                                                                                                                                                                                                              |
| `has_recipient_verification`  | Không    | Boolean                        | Mặc định toàn cục domain cho việc yêu cầu người nhận alias phải nhấp vào liên kết xác minh email để email được chuyển tiếp                                                                                                                                                                |
| `ignore_mx_check`             | Không    | Boolean                        | Có bỏ qua kiểm tra bản ghi MX trên domain để xác minh hay không. Điều này chủ yếu dành cho người dùng có quy tắc cấu hình MX nâng cao và cần giữ bản ghi MX hiện tại và chuyển tiếp đến MX của chúng tôi.                                                                                   |
| `retention_days`              | Không    | Số                             | Số nguyên từ `0` đến `30` tương ứng với số ngày lưu trữ email SMTP gửi đi sau khi đã gửi thành công hoặc lỗi vĩnh viễn. Mặc định là `0`, nghĩa là email SMTP gửi đi sẽ bị xóa và làm mờ ngay lập tức để bảo mật cho bạn.                                                                |
| `bounce_webhook`              | Không    | Chuỗi (URL) hoặc Boolean (false) | URL webhook `http://` hoặc `https://` bạn chọn để nhận webhook trả về khi email bị trả lại. Chúng tôi sẽ gửi yêu cầu `POST` đến URL này với thông tin về lỗi gửi SMTP (ví dụ lỗi mềm hoặc lỗi cứng – để bạn quản lý người đăng ký và tự động quản lý email gửi đi).                      |
| `max_quota_per_alias`         | Không    | Chuỗi                          | Dung lượng tối đa lưu trữ cho các alias trên domain này. Nhập giá trị như "1 GB" sẽ được phân tích bởi [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                   |
> Ví dụ Yêu cầu:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Xóa domain {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Ví dụ Yêu cầu:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## Lời mời {#invites}

### Chấp nhận lời mời domain {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Ví dụ Yêu cầu:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Tạo lời mời domain {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Tham số Body  | Bắt buộc | Loại                | Mô tả                                                                                     |
| ------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email`       | Có       | Chuỗi (Email)       | Địa chỉ email để mời vào danh sách thành viên domain                                      |
| `group`       | Có       | Chuỗi (liệt kê)     | Nhóm để thêm người dùng vào thành viên domain (có thể là `"admin"` hoặc `"user"`)        |

> Ví dụ Yêu cầu:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Nếu người dùng được mời đã là thành viên được chấp nhận của bất kỳ domain nào khác mà admin mời họ cũng là thành viên, thì lời mời sẽ tự động được chấp nhận và không gửi email.

### Xóa lời mời domain {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Tham số Body  | Bắt buộc | Loại           | Mô tả                                              |
| ------------- | -------- | -------------- | ------------------------------------------------- |
| `email`       | Có       | Chuỗi (Email)  | Địa chỉ email để xóa khỏi danh sách thành viên domain |

> Ví dụ Yêu cầu:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## Thành viên {#members}

### Cập nhật thành viên domain {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Tham số Body  | Bắt buộc | Loại                | Mô tả                                                                                     |
| ------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `group`       | Có       | Chuỗi (liệt kê)     | Nhóm để cập nhật người dùng vào thành viên domain (có thể là `"admin"` hoặc `"user"`)    |

> Ví dụ Yêu cầu:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Xóa thành viên domain {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Ví dụ Yêu cầu:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## Bí danh {#aliases}

### Tạo mật khẩu bí danh {#generate-an-alias-password}

Lưu ý rằng nếu bạn không gửi email hướng dẫn, thì tên người dùng và mật khẩu sẽ có trong phần thân phản hồi JSON của yêu cầu thành công với định dạng `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Tham số Body          | Bắt buộc | Loại    | Mô tả                                                                                                                                                                                                                                                                                             |
| --------------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `new_password`        | Không    | Chuỗi   | Mật khẩu mới tùy chỉnh của bạn để sử dụng cho bí danh. Lưu ý bạn có thể để trống hoặc không gửi tham số này trong body yêu cầu API nếu muốn nhận mật khẩu mạnh được tạo ngẫu nhiên.                                                                                                             Mật khẩu hộp thư tùy chỉnh phải tối đa 128 ký tự, không được bắt đầu hoặc kết thúc bằng khoảng trắng và không được chứa dấu ngoặc kép hoặc dấu nháy đơn. |
| `password`            | Không    | Chuỗi   | Mật khẩu hiện tại của bí danh để thay đổi mật khẩu mà không xóa bộ nhớ hộp thư IMAP hiện có (xem tùy chọn `is_override` bên dưới nếu bạn không còn mật khẩu hiện tại).                                                                                                                         |
| `is_override`         | Không    | Boolean | **SỬ DỤNG CẨN THẬN**: Điều này sẽ ghi đè hoàn toàn mật khẩu bí danh hiện có và cơ sở dữ liệu, đồng thời sẽ xóa vĩnh viễn bộ nhớ IMAP hiện có và đặt lại hoàn toàn cơ sở dữ liệu email SQLite của bí danh. Vui lòng sao lưu nếu có thể nếu bạn có hộp thư hiện có gắn với bí danh này. |
| `emailed_instructions`| Không    | Chuỗi   | Địa chỉ email để gửi mật khẩu bí danh và hướng dẫn thiết lập.                                                                                                                                                                                                                                   |
> Ví dụ Yêu cầu:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Liệt kê bí danh miền {#list-domain-aliases}

> \[!NOTE]
> Từ ngày 1 tháng 11 năm 2024, các điểm cuối API cho [Liệt kê miền](#list-domains) và [Liệt kê bí danh miền](#list-domain-aliases) sẽ mặc định là `1000` kết quả tối đa mỗi trang. Nếu bạn muốn chọn tham gia hành vi này sớm, bạn có thể truyền `?paginate=true` như một tham số chuỗi truy vấn bổ sung vào URL cho truy vấn điểm cuối. Xem [Phân trang](#pagination) để biết thêm chi tiết.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Tham số Chuỗi truy vấn | Bắt buộc | Loại                      | Mô tả                                                                                                                                               |
| --------------------- | -------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                   | Không    | Chuỗi (hỗ trợ RegExp)     | Tìm kiếm bí danh trong một miền theo tên, nhãn hoặc người nhận                                                                                     |
| `name`                | Không    | Chuỗi (hỗ trợ RegExp)     | Tìm kiếm bí danh trong một miền theo tên                                                                                                          |
| `recipient`           | Không    | Chuỗi (hỗ trợ RegExp)     | Tìm kiếm bí danh trong một miền theo người nhận                                                                                                   |
| `sort`                | Không    | Chuỗi                    | Sắp xếp theo một trường cụ thể (thêm dấu gạch ngang đơn `-` để sắp xếp theo hướng ngược lại của trường đó). Mặc định là `created_at` nếu không đặt. |
| `page`                | Không    | Số                       | Xem [Phân trang](#pagination) để biết thêm chi tiết                                                                                                |
| `limit`               | Không    | Số                       | Xem [Phân trang](#pagination) để biết thêm chi tiết                                                                                                |

> Ví dụ Yêu cầu:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Tạo bí danh miền mới {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Tham số Body                  | Bắt buộc | Loại                                   | Mô tả                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------- | -------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                        | Không    | Chuỗi                                 | Tên bí danh (nếu không cung cấp hoặc để trống, thì một bí danh ngẫu nhiên sẽ được tạo)                                                                                                                                                                                                                                                                                                    |
| `recipients`                  | Không    | Chuỗi hoặc Mảng                       | Danh sách người nhận (phải là Chuỗi phân tách bằng xuống dòng/khoảng trắng/dấu phẩy hoặc Mảng các địa chỉ email hợp lệ, tên miền đủ điều kiện ("FQDN"), địa chỉ IP, và/hoặc URL webhook – và nếu không cung cấp hoặc là Mảng rỗng, thì email của người dùng thực hiện yêu cầu API sẽ được đặt làm người nhận)                                                                                     |
| `description`                 | Không    | Chuỗi                                 | Mô tả bí danh                                                                                                                                                                                                                                                                                                                                                                             |
| `labels`                      | Không    | Chuỗi hoặc Mảng                       | Danh sách nhãn (phải là Chuỗi phân tách bằng xuống dòng/khoảng trắng/dấu phẩy hoặc Mảng)                                                                                                                                                                                                                                                                                                  |
| `has_recipient_verification`  | Không    | Boolean                               | Yêu cầu người nhận nhấp vào liên kết xác minh email để email được chuyển tiếp (mặc định theo cài đặt của miền nếu không được đặt rõ trong thân yêu cầu)                                                                                                                                                                                                                                  |
| `is_enabled`                  | Không    | Boolean                               | Bật hoặc tắt bí danh này (nếu tắt, email sẽ không được chuyển tiếp mà trả về mã trạng thái thành công). Nếu truyền giá trị, nó sẽ được chuyển thành boolean sử dụng [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                                                       |
| `error_code_if_disabled`      | Không    | Số (có thể là `250`, `421`, hoặc `550`) | Email đến bí danh này sẽ bị từ chối nếu `is_enabled` là `false` với mã `250` (im lặng không chuyển tiếp, ví dụ hố đen hoặc `/dev/null`), `421` (từ chối mềm; và thử lại trong khoảng ~5 ngày) hoặc `550` (lỗi vĩnh viễn và từ chối). Mặc định là `250`.                                                                                                                                       |
| `has_imap`                    | Không    | Boolean                               | Bật hoặc tắt lưu trữ IMAP cho bí danh này (nếu tắt, email đến sẽ không được lưu vào [lưu trữ IMAP](/blog/docs/best-quantum-safe-encrypted-email-service). Nếu truyền giá trị, nó sẽ được chuyển thành boolean sử dụng [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                      |
| `has_pgp`                     | Không    | Boolean                               | Bật hoặc tắt [mã hóa OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) cho [lưu trữ email mã hóa IMAP/POP3/CalDAV/CardDAV](/blog/docs/best-quantum-safe-encrypted-email-service) sử dụng `public_key` của bí danh.                                                                                                                             |
| `public_key`                  | Không    | Chuỗi                                 | Khóa công khai OpenPGP ở định dạng ASCII Armor ([nhấn vào đây để xem ví dụ](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); ví dụ khóa GPG cho `support@forwardemail.net`). Chỉ áp dụng nếu bạn đặt `has_pgp` là `true`. [Tìm hiểu thêm về mã hóa đầu cuối trong FAQ của chúng tôi](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                   | Không    | Chuỗi                                 | Dung lượng lưu trữ tối đa cho bí danh này. Để trống để đặt lại về dung lượng tối đa hiện tại của miền hoặc nhập giá trị như "1 GB" sẽ được phân tích bởi [bytes](https://github.com/visionmedia/bytes.js). Giá trị này chỉ có thể được điều chỉnh bởi quản trị viên miền.                                                                                                         |
| `vacation_responder_is_enabled` | Không    | Boolean                               | Bật hoặc tắt trả lời tự động khi nghỉ phép.                                                                                                                                                                                                                                                                                                                                                 |
| `vacation_responder_start_date` | Không    | Chuỗi                                 | Ngày bắt đầu trả lời tự động khi nghỉ phép (nếu bật và không đặt ngày bắt đầu ở đây, thì giả định đã bắt đầu). Hỗ trợ các định dạng ngày như `MM/DD/YYYY`, `YYYY-MM-DD`, và các định dạng ngày khác qua phân tích thông minh sử dụng `dayjs`.                                                                                                                                          |
| `vacation_responder_end_date`   | Không    | Chuỗi                                 | Ngày kết thúc trả lời tự động khi nghỉ phép (nếu bật và không đặt ngày kết thúc ở đây, thì giả định không bao giờ kết thúc và trả lời mãi mãi). Hỗ trợ các định dạng ngày như `MM/DD/YYYY`, `YYYY-MM-DD`, và các định dạng ngày khác qua phân tích thông minh sử dụng `dayjs`.                                                                                                        |
| `vacation_responder_subject`    | Không    | Chuỗi                                 | Chủ đề bằng văn bản thuần cho trả lời tự động khi nghỉ phép, ví dụ "Ngoài văn phòng". Chúng tôi sử dụng `striptags` để loại bỏ tất cả HTML ở đây.                                                                                                                                                                                                                                         |
| `vacation_responder_message`    | Không    | Chuỗi                                 | Tin nhắn bằng văn bản thuần cho trả lời tự động khi nghỉ phép, ví dụ "Tôi sẽ nghỉ phép đến tháng Hai.". Chúng tôi sử dụng `striptags` để loại bỏ tất cả HTML ở đây.                                                                                                                                                                                                                       |
> Ví dụ Yêu cầu:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Lấy alias miền {#retrieve-domain-alias}

Bạn có thể lấy alias miền bằng `id` hoặc giá trị `name` của nó.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Ví dụ Yêu cầu:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Ví dụ Yêu cầu:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Cập nhật alias miền {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Tham số Body                   | Bắt buộc | Loại                                   | Mô tả                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------- | -------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | Không    | Chuỗi                                 | Tên alias                                                                                                                                                                                                                                                                                                                                                                                  |
| `recipients`                    | Không    | Chuỗi hoặc Mảng                       | Danh sách người nhận (phải là Chuỗi phân tách bằng xuống dòng/khoảng trắng/dấu phẩy hoặc Mảng các địa chỉ email hợp lệ, tên miền đầy đủ ("FQDN"), địa chỉ IP, và/hoặc URL webhook)                                                                                                                                                                                                       |
| `description`                   | Không    | Chuỗi                                 | Mô tả alias                                                                                                                                                                                                                                                                                                                                                                                |
| `labels`                        | Không    | Chuỗi hoặc Mảng                       | Danh sách nhãn (phải là Chuỗi phân tách bằng xuống dòng/khoảng trắng/dấu phẩy hoặc Mảng)                                                                                                                                                                                                                                                                                                   |
| `has_recipient_verification`    | Không    | Boolean                               | Yêu cầu người nhận nhấp vào liên kết xác minh email để email được chuyển tiếp (mặc định theo cài đặt của miền nếu không được thiết lập rõ trong thân yêu cầu)                                                                                                                                                                                                                              |
| `is_enabled`                    | Không    | Boolean                               | Bật hoặc tắt alias này (nếu tắt, email sẽ không được chuyển tiếp mà trả về mã trạng thái thành công). Nếu có giá trị được truyền, nó sẽ được chuyển đổi thành boolean sử dụng [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                                           |
| `error_code_if_disabled`        | Không    | Số (có thể là `250`, `421`, hoặc `550`) | Email đến alias này sẽ bị từ chối nếu `is_enabled` là `false` với mã `250` (im lặng không chuyển tiếp, ví dụ hố đen hoặc `/dev/null`), `421` (từ chối mềm; và thử lại trong khoảng ~5 ngày) hoặc `550` lỗi vĩnh viễn và từ chối. Mặc định là `250`.                                                                                                                                           |
| `has_imap`                      | Không    | Boolean                               | Bật hoặc tắt lưu trữ IMAP cho alias này (nếu tắt, email đến sẽ không được lưu trữ vào [lưu trữ IMAP](/blog/docs/best-quantum-safe-encrypted-email-service). Nếu có giá trị được truyền, nó sẽ được chuyển đổi thành boolean sử dụng [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                      |
| `has_pgp`                       | Không    | Boolean                               | Bật hoặc tắt [mã hóa OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) cho [lưu trữ email mã hóa IMAP/POP3/CalDAV/CardDAV](/blog/docs/best-quantum-safe-encrypted-email-service) sử dụng `public_key` của alias.                                                                                                                               |
| `public_key`                    | Không    | Chuỗi                                 | Khóa công khai OpenPGP ở định dạng ASCII Armor ([nhấn vào đây để xem ví dụ](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); ví dụ khóa GPG cho `support@forwardemail.net`). Chỉ áp dụng nếu bạn đã đặt `has_pgp` thành `true`. [Tìm hiểu thêm về mã hóa đầu cuối trong FAQ của chúng tôi](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | Không    | Chuỗi                                 | Dung lượng lưu trữ tối đa cho alias này. Để trống để đặt lại về dung lượng tối đa hiện tại của miền hoặc nhập giá trị như "1 GB" sẽ được phân tích bởi [bytes](https://github.com/visionmedia/bytes.js). Giá trị này chỉ có thể được điều chỉnh bởi quản trị viên miền.                                                                                                            |
| `vacation_responder_is_enabled` | Không    | Boolean                               | Bật hoặc tắt trả lời tự động khi nghỉ phép.                                                                                                                                                                                                                                                                                                                                               |
| `vacation_responder_start_date` | Không    | Chuỗi                                 | Ngày bắt đầu trả lời tự động khi nghỉ phép (nếu bật và không đặt ngày bắt đầu ở đây, thì giả định đã bắt đầu). Hỗ trợ các định dạng ngày như `MM/DD/YYYY`, `YYYY-MM-DD`, và các định dạng ngày khác qua phân tích thông minh sử dụng `dayjs`.                                                                                                                                             |
| `vacation_responder_end_date`   | Không    | Chuỗi                                 | Ngày kết thúc trả lời tự động khi nghỉ phép (nếu bật và không đặt ngày kết thúc ở đây, thì giả định không bao giờ kết thúc và trả lời mãi mãi). Hỗ trợ các định dạng ngày như `MM/DD/YYYY`, `YYYY-MM-DD`, và các định dạng ngày khác qua phân tích thông minh sử dụng `dayjs`.                                                                                                         |
| `vacation_responder_subject`    | Không    | Chuỗi                                 | Chủ đề bằng văn bản thuần cho trả lời tự động khi nghỉ phép, ví dụ "Ngoài văn phòng". Chúng tôi sử dụng `striptags` để loại bỏ tất cả HTML ở đây.                                                                                                                                                                                                                                       |
| `vacation_responder_message`    | Không    | Chuỗi                                 | Tin nhắn bằng văn bản thuần cho trả lời tự động khi nghỉ phép, ví dụ "Tôi sẽ nghỉ phép đến tháng Hai.". Chúng tôi sử dụng `striptags` để loại bỏ tất cả HTML ở đây.                                                                                                                                                                                                                       |
> Ví dụ Yêu cầu:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Xóa bí danh miền {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Ví dụ Yêu cầu:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```


## Mã hóa {#encrypt}

Chúng tôi cho phép bạn mã hóa các bản ghi ngay cả trên gói miễn phí mà không mất phí. Quyền riêng tư không nên là một tính năng, mà nên được tích hợp sẵn trong tất cả các khía cạnh của sản phẩm. Như đã được yêu cầu nhiều trong một [thảo luận Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) và trên [các vấn đề GitHub của chúng tôi](https://github.com/forwardemail/forwardemail.net/issues/254), chúng tôi đã thêm tính năng này.

### Mã hóa bản ghi TXT {#encrypt-txt-record}

> `POST /v1/encrypt`

| Tham số Body  | Bắt buộc | Loại   | Mô tả                                        |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input`        | Có       | Chuỗi  | Bất kỳ bản ghi TXT plaintext hợp lệ của Forward Email |

> Ví dụ Yêu cầu:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
