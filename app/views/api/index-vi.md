# API Email {#email-api}

## Mục lục {#table-of-contents}

* [Thư viện](#libraries)
* [URI cơ sở](#base-uri)
* [Xác thực](#authentication)
* [Lỗi](#errors)
* [Bản địa hóa](#localization)
* [Phân trang](#pagination)
* [Nhật ký](#logs)
  * [Lấy lại nhật ký](#retrieve-logs)
* [Tài khoản](#account)
  * [Tạo tài khoản](#create-account)
  * [Lấy lại tài khoản](#retrieve-account)
  * [Cập nhật tài khoản](#update-account)
* [Danh bạ bí danh (CardDAV)](#alias-contacts-carddav)
  * [Liệt kê danh bạ](#list-contacts)
  * [Tạo liên hệ](#create-contact)
  * [Lấy lại liên lạc](#retrieve-contact)
  * [Cập nhật liên hệ](#update-contact)
  * [Xóa liên hệ](#delete-contact)
* [Lịch bí danh (CalDAV)](#alias-calendars-caldav)
  * [Liệt kê lịch](#list-calendars)
  * [Tạo lịch](#create-calendar)
  * [Lấy lại lịch](#retrieve-calendar)
  * [Cập nhật lịch](#update-calendar)
  * [Xóa lịch](#delete-calendar)
* [Tin nhắn bí danh (IMAP/POP3)](#alias-messages-imappop3)
  * [Liệt kê và tìm kiếm tin nhắn](#list-and-search-for-messages)
  * [Tạo tin nhắn](#create-message)
  * [Lấy lại tin nhắn](#retrieve-message)
  * [Cập nhật tin nhắn](#update-message)
  * [Xóa tin nhắn](#delete-message)
* [Thư mục bí danh (IMAP/POP3)](#alias-folders-imappop3)
  * [Liệt kê các thư mục](#list-folders)
  * [Tạo thư mục](#create-folder)
  * [Lấy lại thư mục](#retrieve-folder)
  * [Cập nhật thư mục](#update-folder)
  * [Xóa thư mục](#delete-folder)
  * [Sao chép thư mục](#copy-folder)
* [Email gửi đi](#outbound-emails)
  * [Nhận giới hạn email SMTP gửi đi](#get-outbound-smtp-email-limit)
  * [Liệt kê các email SMTP gửi đi](#list-outbound-smtp-emails)
  * [Tạo email SMTP gửi đi](#create-outbound-smtp-email)
  * [Lấy email SMTP gửi đi](#retrieve-outbound-smtp-email)
  * [Xóa email SMTP gửi đi](#delete-outbound-smtp-email)
* [Tên miền](#domains)
  * [Danh sách tên miền](#list-domains)
  * [Tạo tên miền](#create-domain)
  * [Lấy lại tên miền](#retrieve-domain)
  * [Xác minh bản ghi tên miền](#verify-domain-records)
  * [Xác minh bản ghi SMTP của miền](#verify-domain-smtp-records)
  * [Liệt kê mật khẩu bắt tất cả trên toàn miền](#list-domain-wide-catch-all-passwords)
  * [Tạo mật khẩu bắt tất cả trên toàn miền](#create-domain-wide-catch-all-password)
  * [Xóa mật khẩu bắt tất cả trên toàn miền](#remove-domain-wide-catch-all-password)
  * [Cập nhật tên miền](#update-domain)
  * [Xóa tên miền](#delete-domain)
* [Lời mời](#invites)
  * [Chấp nhận lời mời tên miền](#accept-domain-invite)
  * [Tạo lời mời tên miền](#create-domain-invite)
  * [Xóa lời mời tên miền](#remove-domain-invite)
* [Thành viên](#members)
  * [Cập nhật thành viên miền](#update-domain-member)
  * [Xóa thành viên miền](#remove-domain-member)
* [Bí danh](#aliases)
  * [Tạo mật khẩu bí danh](#generate-an-alias-password)
  * [Liệt kê các bí danh tên miền](#list-domain-aliases)
  * [Tạo bí danh tên miền mới](#create-new-domain-alias)
  * [Lấy lại bí danh tên miền](#retrieve-domain-alias)
  * [Cập nhật bí danh tên miền](#update-domain-alias)
  * [Xóa bí danh tên miền](#delete-domain-alias)
* [Mã hóa](#encrypt)
  * [Mã hóa bản ghi TXT](#encrypt-txt-record)

## Thư viện {#libraries}

Hiện tại, chúng tôi chưa phát hành bất kỳ trình bao bọc API nào, nhưng chúng tôi dự định sẽ sớm ra mắt trong tương lai gần. Vui lòng gửi email đến <api@forwardemail.net> nếu bạn muốn nhận thông báo khi trình bao bọc API của một ngôn ngữ lập trình cụ thể được phát hành. Trong thời gian chờ đợi, bạn có thể sử dụng các thư viện yêu cầu HTTP được đề xuất này trong ứng dụng của mình, hoặc chỉ cần sử dụng [xoăn](https://stackoverflow.com/a/27442239/3586413) như trong các ví dụ bên dưới.

| Ngôn ngữ | Thư viện |
| ---------- | ---------------------------------------------------------------------- |
| Hồng ngọc | [Faraday](https://github.com/lostisland/faraday) |
| Python | [requests](https://github.com/psf/requests) |
| Java | [OkHttp](https://github.com/square/okhttp/) |
| PHP | [guzzle](https://github.com/guzzle/guzzle) |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (chúng tôi là người bảo trì) |
| Node.js | [superagent](https://github.com/ladjs/superagent) (chúng tôi là người bảo trì) |
| Đi | [net/http](https://golang.org/pkg/net/http/) |
| .NET | [RestSharp](https://github.com/restsharp/RestSharp) |

## URI cơ sở {#base-uri}

Đường dẫn URI cơ sở HTTP hiện tại là: `BASE_URI`.

## Xác thực {#authentication}

Tất cả các điểm cuối đều yêu cầu [Khóa API](https://forwardemail.net/my-account/security) của bạn được đặt làm giá trị "tên người dùng" của tiêu đề [Ủy quyền cơ bản](https://en.wikipedia.org/wiki/Basic_access_authentication) của yêu cầu (ngoại trừ [Liên hệ bí danh](#alias-contacts), [Lịch bí danh](#alias-calendars) và [Hộp thư bí danh](#alias-mailboxes) sử dụng [tên người dùng và mật khẩu bí danh đã tạo](/faq#do-you-support-receiving-email-with-imap))..

Đừng lo lắng – các ví dụ được cung cấp bên dưới nếu bạn không chắc đây là gì.

## Lỗi {#errors}

Nếu xảy ra bất kỳ lỗi nào, nội dung phản hồi của yêu cầu API sẽ chứa thông báo lỗi chi tiết.

| Mã số | Tên |
| ---- | --------------------- |
| 200 | OK |
| 400 | Yêu cầu không hợp lệ |
| 401 | Không được phép |
| 403 | Cấm |
| 404 | Không tìm thấy |
| 429 | Quá nhiều yêu cầu |
| 500 | Lỗi máy chủ nội bộ |
| 501 | Chưa thực hiện |
| 502 | Cổng xấu |
| 503 | Dịch vụ không khả dụng |
| 504 | Hết thời gian chờ cổng |

> \[!TIP]
> If you receive a 5xx status code (which should not happen), then please contact us at <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> and we will help you to resolve your issue immediately.

## Bản địa hóa {#localization}

Dịch vụ của chúng tôi được dịch sang hơn 25 ngôn ngữ khác nhau. Tất cả các thông báo phản hồi API đều được dịch sang ngôn ngữ gần nhất được phát hiện bởi người dùng thực hiện yêu cầu API. Bạn có thể ghi đè điều này bằng cách truyền tiêu đề `Accept-Language` tùy chỉnh. Bạn có thể dùng thử bằng cách sử dụng menu thả xuống ngôn ngữ ở cuối trang này.

## Phân trang {#pagination}

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.

Phân trang được hỗ trợ bởi tất cả các điểm cuối API liệt kê kết quả.

Chỉ cần cung cấp các thuộc tính chuỗi truy vấn `page` (và tùy chọn `limit`).

Thuộc tính `page` phải là một số lớn hơn hoặc bằng `1`. Nếu bạn cung cấp `limit` (cũng là một số), thì giá trị tối thiểu là `10` và giá trị tối đa là `50` (trừ khi có ghi chú khác).

| Tham số chuỗi truy vấn | Yêu cầu | Kiểu | Sự miêu tả |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page` | KHÔNG | Con số | Trang kết quả cần trả về. Nếu không được chỉ định, giá trị `page` sẽ là `1`. Giá trị này phải lớn hơn hoặc bằng `1`. |
| `limit` | KHÔNG | Con số | Số lượng kết quả trả về trên mỗi trang. Mặc định là `10` nếu không được chỉ định. Phải là một số lớn hơn hoặc bằng `1` và nhỏ hơn hoặc bằng `50`. |

Để xác định có thêm kết quả hay không, chúng tôi cung cấp các tiêu đề phản hồi HTTP sau (bạn có thể phân tích cú pháp để phân trang theo chương trình):

| Tiêu đề phản hồi HTTP | Ví dụ | Sự miêu tả |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count` | `X-Page-Count: 3` | Tổng số trang có sẵn. |
| `X-Page-Current` | `X-Page-Current: 1` | Trang kết quả hiện tại được trả về (ví dụ: dựa trên tham số chuỗi truy vấn `page`). |
| `X-Page-Size` | `X-Page-Size: 10` | Tổng số kết quả trả về trên trang (ví dụ: dựa trên tham số chuỗi truy vấn `limit` và kết quả thực tế trả về). |
| `X-Item-Count` | `X-Item-Count: 30` | Tổng số mục có sẵn trên tất cả các trang. |
| `Link` | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Chúng tôi cung cấp tiêu đề phản hồi HTTP `Link` mà bạn có thể phân tích cú pháp như trong ví dụ. Tiêu đề này là [similar to GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (ví dụ: không phải tất cả các giá trị sẽ được cung cấp nếu chúng không liên quan hoặc không khả dụng, ví dụ: `"next"` sẽ không được cung cấp nếu không có trang nào khác). |

> Ví dụ yêu cầu:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```

## Nhật ký {#logs}

### Truy xuất nhật ký {#retrieve-logs}

API của chúng tôi cho phép bạn tải xuống nhật ký cho tài khoản của mình theo chương trình. Việc gửi yêu cầu đến điểm cuối này sẽ xử lý tất cả nhật ký cho tài khoản của bạn và gửi qua email cho bạn dưới dạng tệp đính kèm ([Gzip](https://en.wikipedia.org/wiki/Gzip) tệp bảng tính [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) được nén) sau khi hoàn tất.

Tính năng này cho phép bạn tạo các tác vụ nền với [Công việc Cron](https://en.wikipedia.org/wiki/Cron) hoặc sử dụng [Phần mềm lập lịch công việc Node.js Bree](https://github.com/breejs/bree) của chúng tôi để nhận nhật ký bất cứ khi nào bạn muốn. Lưu ý rằng điểm cuối này bị giới hạn ở `10` yêu cầu mỗi ngày.

Tệp đính kèm là dạng chữ thường của `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` và email chứa bản tóm tắt ngắn gọn về các nhật ký đã thu thập được. Bạn cũng có thể tải xuống nhật ký bất cứ lúc nào từ [Tài khoản của tôi → Nhật ký](/my-account/logs)

> `GET /v1/logs/download`

| Tham số chuỗi truy vấn | Yêu cầu | Kiểu | Sự miêu tả |
| --------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | KHÔNG | Chuỗi (FQDN) | Lọc nhật ký theo tên miền đủ điều kiện ("FQDN"). Nếu bạn không cung cấp thông tin này, tất cả nhật ký trên tất cả các tên miền sẽ được truy xuất. |
| `q` | KHÔNG | Sợi dây | Tìm kiếm nhật ký theo email, tên miền, tên bí danh, địa chỉ IP hoặc ngày (định dạng `M/Y`, `M/D/YY`, `M-D`, `M-D-YY` hoặc `M.D.YY`). |
| `bounce_category` | KHÔNG | Sợi dây | Tìm kiếm nhật ký theo danh mục trả lại cụ thể (ví dụ: `blocklist`). |
| `response_code` | KHÔNG | Con số | Tìm kiếm nhật ký theo mã phản hồi lỗi cụ thể (ví dụ: `421` hoặc `550`). |

> Ví dụ yêu cầu:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Ví dụ về công việc Cron (vào lúc nửa đêm mỗi ngày):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Lưu ý rằng bạn có thể sử dụng các dịch vụ như [Crontab.guru](https://crontab.guru/) để xác thực cú pháp biểu thức cron job của mình.

> Ví dụ về công việc Cron (vào nửa đêm mỗi ngày **và có nhật ký của ngày hôm trước**):

Đối với MacOS:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Đối với Linux và Ubuntu:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

## Tài khoản {#account}

### Tạo tài khoản {#create-account}

> `POST /v1/account`

| Tham số cơ thể | Yêu cầu | Kiểu | Sự miêu tả |
| -------------- | -------- | -------------- | ------------- |
| `email` | Đúng | Chuỗi (Email) | Địa chỉ email |
| `password` | Đúng | Sợi dây | Mật khẩu |

> Ví dụ yêu cầu:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Truy xuất tài khoản {#retrieve-account}

> `GET /v1/account`

> Ví dụ yêu cầu:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Cập nhật tài khoản {#update-account}

> `PUT /v1/account`

| Tham số cơ thể | Yêu cầu | Kiểu | Sự miêu tả |
| -------------- | -------- | -------------- | -------------------- |
| `email` | KHÔNG | Chuỗi (Email) | Địa chỉ email |
| `given_name` | KHÔNG | Sợi dây | Tên |
| `family_name` | KHÔNG | Sợi dây | Họ |
| `avatar_url` | KHÔNG | Chuỗi (URL) | Liên kết đến hình ảnh đại diện |

> Ví dụ yêu cầu:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

## Danh bạ bí danh (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

### Liệt kê danh bạ {#list-contacts}

> `GET /v1/contacts`

**Sắp ra mắt**

### Tạo liên hệ {#create-contact}

> `POST /v1/contacts`

**Sắp ra mắt**

### Lấy lại thông tin liên hệ {#retrieve-contact}

> `GET /v1/contacts/:id`

**Sắp ra mắt**

### Cập nhật liên hệ {#update-contact}

> `PUT /v1/contacts/:id`

**Sắp ra mắt**

### Xóa liên hệ {#delete-contact}

> `DELETE /v1/contacts/:id`

**Sắp ra mắt**

## Lịch bí danh (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

### Liệt kê lịch {#list-calendars}

> `GET /v1/calendars`

**Sắp ra mắt**

### Tạo lịch {#create-calendar}

> `POST /v1/calendars`

**Sắp ra mắt**

### Truy xuất lịch {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Sắp ra mắt**

### Cập nhật lịch {#update-calendar}

> `PUT /v1/calendars/:id`

**Sắp ra mắt**

### Xóa lịch {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Sắp ra mắt**

## Tin nhắn bí danh (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

Hãy đảm bảo rằng bạn đã làm theo hướng dẫn thiết lập cho tên miền của mình.

Bạn có thể tìm thấy những hướng dẫn này trong phần Câu hỏi thường gặp [Bạn có hỗ trợ nhận email bằng IMAP không?](/faq#do-you-support-receiving-email-with-imap) của chúng tôi.

### Liệt kê và tìm kiếm tin nhắn {#list-and-search-for-messages}

> `GET /v1/messages`

**Sắp ra mắt**

### Tạo tin nhắn {#create-message}

> \[!NOTE]
> This will **NOT** send an email – it will only simply add the message to your mailbox folder (e.g. this is similar to the IMAP `APPEND` command).  If you would like to send an email, then see [Create outbound SMTP email](#create-outbound-smtp-email) below.  After creating the outbound SMTP email, then you can append a copy of it using this endpoint to your alias' mailbox for storage purposes.

> `POST /v1/messages`

**Sắp ra mắt**

### Lấy lại tin nhắn {#retrieve-message}

> `GET /v1/messages/:id`

**Sắp ra mắt**

### Cập nhật tin nhắn {#update-message}

> `PUT /v1/messages/:id`

**Sắp ra mắt**

### Xóa tin nhắn {#delete-message}

> `DELETE /v1/messages:id`

**Sắp ra mắt**

## Thư mục bí danh (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Folder endpoints with a folder's path <code>/v1/folders/:path</code> as their endpoint are interchangeable with a folder's ID <code>:id</code>. This means you can refer to the folder by either its <code>path</code> or <code>id</code> value.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

### Liệt kê các thư mục {#list-folders}

> `GET /v1/folders`

**Sắp ra mắt**

### Tạo thư mục {#create-folder}

> `POST /v1/folders`

**Sắp ra mắt**

### Lấy lại thư mục {#retrieve-folder}

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

Hãy đảm bảo rằng bạn đã làm theo hướng dẫn thiết lập cho tên miền của mình.

Bạn có thể tìm thấy hướng dẫn này tại [Tài khoản của tôi → Tên miền → Cài đặt → Cấu hình SMTP gửi đi](/my-account/domains). Bạn cần đảm bảo thiết lập DKIM, Return-Path và DMARC để gửi SMTP đi bằng tên miền của mình.

### Nhận giới hạn email SMTP gửi đi {#get-outbound-smtp-email-limit}

Đây là điểm cuối đơn giản trả về một đối tượng JSON chứa `count` và `limit` cho số lượng tin nhắn SMTP gửi đi hàng ngày trên mỗi tài khoản.

> `GET /v1/emails/limit`

> Ví dụ yêu cầu:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Liệt kê các email SMTP gửi đi {#list-outbound-smtp-emails}

Lưu ý rằng điểm cuối này không trả về giá trị thuộc tính cho `message`, `headers` hay `rejectedErrors` của email.

Để trả về các thuộc tính đó và giá trị của chúng, vui lòng sử dụng điểm cuối [Lấy lại email](#retrieve-email) với ID email.

> `GET /v1/emails`

| Tham số chuỗi truy vấn | Yêu cầu | Kiểu | Sự miêu tả |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | KHÔNG | Chuỗi (RegExp được hỗ trợ) | Tìm kiếm email theo siêu dữ liệu |
| `domain` | KHÔNG | Chuỗi (RegExp được hỗ trợ) | Tìm kiếm email theo tên miền |
| `sort` | KHÔNG | Sợi dây | Sắp xếp theo một trường cụ thể (thêm tiền tố `-` để sắp xếp theo hướng ngược lại của trường đó). Mặc định là `created_at` nếu không được thiết lập. |
| `page` | KHÔNG | Con số | Xem [Pagination](#pagination) để biết thêm thông tin chi tiết |
| `limit` | KHÔNG | Con số | Xem [Pagination](#pagination) để biết thêm thông tin chi tiết |

> Ví dụ yêu cầu:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Tạo email SMTP gửi đi {#create-outbound-smtp-email}

API tạo email của chúng tôi được lấy cảm hứng và tận dụng cấu hình tùy chọn tin nhắn của Nodemailer. Vui lòng tuân thủ [Cấu hình tin nhắn Nodemailer](https://nodemailer.com/message/) cho tất cả các tham số nội dung bên dưới.

Xin lưu ý rằng ngoại trừ `envelope` và `dkim` (vì chúng tôi tự động thiết lập cho bạn), chúng tôi hỗ trợ tất cả các tùy chọn của Nodemailer. Chúng tôi tự động thiết lập các tùy chọn `disableFileAccess` và `disableUrlAccess` thành `true` vì mục đích bảo mật.

Bạn nên truyền tùy chọn duy nhất `raw` vào email đầy đủ thô của bạn bao gồm cả tiêu đề **hoặc** truyền từng tùy chọn tham số nội dung bên dưới.

Điểm cuối API này sẽ tự động mã hóa biểu tượng cảm xúc cho bạn nếu chúng xuất hiện trong tiêu đề (ví dụ: dòng chủ đề `Subject: 🤓 Hello` sẽ tự động được chuyển đổi thành `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Mục tiêu của chúng tôi là tạo ra một API email cực kỳ thân thiện với nhà phát triển và chống giả mạo.

> `POST /v1/emails`

| Tham số cơ thể | Yêu cầu | Kiểu | Sự miêu tả |
| ---------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from` | KHÔNG | Chuỗi (Email) | Địa chỉ email của người gửi (phải tồn tại dưới dạng bí danh của tên miền). |
| `to` | KHÔNG | Chuỗi hoặc Mảng | Danh sách được phân tách bằng dấu phẩy hoặc Mảng người nhận cho tiêu đề "Đến". |
| `cc` | KHÔNG | Chuỗi hoặc Mảng | Danh sách được phân tách bằng dấu phẩy hoặc Mảng người nhận cho tiêu đề "Cc". |
| `bcc` | KHÔNG | Chuỗi hoặc Mảng | Danh sách được phân tách bằng dấu phẩy hoặc Mảng người nhận cho tiêu đề "Bcc". |
| `subject` | KHÔNG | Sợi dây | Tiêu đề của email. |
| `text` | KHÔNG | Chuỗi hoặc Bộ đệm | Phiên bản văn bản thuần túy của tin nhắn. |
| `html` | KHÔNG | Chuỗi hoặc Bộ đệm | Phiên bản HTML của tin nhắn. |
| `attachments` | KHÔNG | Mảng | Một mảng các đối tượng đính kèm (xem [Nodemailer's common fields](https://nodemailer.com/message/#common-fields)). |
| `sender` | KHÔNG | Sợi dây | Địa chỉ email cho tiêu đề "Người gửi" (xem [Nodemailer's more advanced fields](https://nodemailer.com/message/#more-advanced-fields)). |
| `replyTo` | KHÔNG | Sợi dây | Địa chỉ email cho tiêu đề "Trả lời". |
| `inReplyTo` | KHÔNG | Sợi dây | ID tin nhắn dùng để trả lời tin nhắn. |
| `references` | KHÔNG | Chuỗi hoặc Mảng | Danh sách được phân tách bằng dấu cách hoặc Mảng ID tin nhắn. |
| `attachDataUrls` | KHÔNG | Boolean | Nếu `true` thì chuyển đổi hình ảnh `data:` trong nội dung HTML của tin nhắn thành tệp đính kèm được nhúng. |
| `watchHtml` | KHÔNG | Sợi dây | Phiên bản HTML dành riêng cho Apple Watch của tin nhắn ([according to the Nodemailer docs](https://nodemailer.com/message/#content-options]), các đồng hồ mới nhất không yêu cầu phải thiết lập tùy chọn này). |
| `amp` | KHÔNG | Sợi dây | Phiên bản HTML dành riêng cho AMP4EMAIL của tin nhắn (xem [Nodemailer's example](https://nodemailer.com/message/#amp-example)). |
| `icalEvent` | KHÔNG | Sự vật | Sự kiện iCalendar được sử dụng làm nội dung tin nhắn thay thế (xem [Nodemailer's calendar events](https://nodemailer.com/message/calendar-events/)). |
| `alternatives` | KHÔNG | Mảng | Một mảng nội dung tin nhắn thay thế (xem [Nodemailer's alternative content](https://nodemailer.com/message/alternatives/)). |
| `encoding` | KHÔNG | Sợi dây | Mã hóa cho chuỗi văn bản và HTML (mặc định là `"utf-8"`, nhưng cũng hỗ trợ các giá trị mã hóa `"hex"` và `"base64"`). |
| `raw` | KHÔNG | Chuỗi hoặc Bộ đệm | Một thông báo được định dạng theo RFC822 tùy chỉnh để sử dụng (thay vì thông báo được tạo bởi Nodemailer – xem [Nodemailer's custom source](https://nodemailer.com/message/custom-source/)). |
| `textEncoding` | KHÔNG | Sợi dây | Mã hóa bắt buộc phải sử dụng cho các giá trị văn bản (`"quoted-printable"` hoặc `"base64"`). Giá trị mặc định là giá trị gần nhất được phát hiện (đối với ASCII, sử dụng `"quoted-printable"`). |
| `priority` | KHÔNG | Sợi dây | Mức độ ưu tiên cho email (có thể là `"high"`, `"normal"` (mặc định) hoặc `"low"`). Lưu ý rằng giá trị `"normal"` không thiết lập tiêu đề ưu tiên (đây là hành vi mặc định). Nếu giá trị `"high"` hoặc `"low"` được thiết lập, thì các tiêu đề `X-Priority`, `X-MSMail-Priority` và `Importance` sẽ là [will be set accordingly](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers` | KHÔNG | Đối tượng hoặc Mảng | Một Đối tượng hoặc một Mảng các trường tiêu đề bổ sung để thiết lập (xem [Nodemailer's custom headers](https://nodemailer.com/message/custom-headers/)). |
| `messageId` | KHÔNG | Sợi dây | Giá trị Message-ID tùy chọn cho tiêu đề "Message-ID" (giá trị mặc định sẽ được tự động tạo nếu không được đặt – lưu ý rằng giá trị phải là [adhere to the RFC2822 specification](https://stackoverflow.com/a/4031705)). |
| `date` | KHÔNG | Chuỗi hoặc Ngày | Giá trị Ngày tùy chọn sẽ được sử dụng nếu tiêu đề Ngày bị thiếu sau khi phân tích cú pháp. Nếu không, chuỗi UTC hiện tại sẽ được sử dụng nếu không được thiết lập. Tiêu đề ngày không được vượt quá 30 ngày so với thời gian hiện tại. |
| `list` | KHÔNG | Sự vật | Một Đối tượng tùy chọn của tiêu đề `List-*` (xem [Nodemailer's list headers](https://nodemailer.com/message/list-headers/)). |

> Ví dụ yêu cầu:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Ví dụ yêu cầu:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Truy xuất email SMTP gửi đi {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Ví dụ yêu cầu:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Xóa email SMTP gửi đi {#delete-outbound-smtp-email}

Việc xóa email sẽ đặt trạng thái thành `"rejected"` (và sau đó không xử lý email trong hàng đợi) nếu và chỉ khi trạng thái hiện tại là một trong các trạng thái `"pending"`, `"queued"` hoặc `"deferred"`. Chúng tôi có thể tự động xóa email sau 30 ngày kể từ khi email được tạo và/hoặc gửi – do đó, bạn nên lưu một bản sao email SMTP gửi đi trong máy khách, cơ sở dữ liệu hoặc ứng dụng của mình. Bạn có thể tham chiếu giá trị ID email của chúng tôi trong cơ sở dữ liệu nếu muốn – giá trị này được trả về từ cả hai điểm cuối [Tạo email](#create-email) và [Lấy lại email](#retrieve-email).

> `DELETE /v1/emails/:id`

> Ví dụ yêu cầu:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

## Tên miền {#domains}

> \[!TIP]
> Domain endpoints with a domain's name <code>/v1/domains/:domain_name</code> as their endpoint are interchangeable with a domain's ID <code>:domain_id</code>. This means you can refer to the domain by either its <code>name</code> or <code>id</code> value.

### Liệt kê các tên miền {#list-domains}

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.  See [Pagination](#pagination) for more insight.

> `GET /v1/domains`

| Tham số chuỗi truy vấn | Yêu cầu | Kiểu | Sự miêu tả |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | KHÔNG | Chuỗi (RegExp được hỗ trợ) | Tìm kiếm tên miền theo tên |
| `name` | KHÔNG | Chuỗi (RegExp được hỗ trợ) | Tìm kiếm tên miền theo tên |
| `sort` | KHÔNG | Sợi dây | Sắp xếp theo một trường cụ thể (thêm tiền tố `-` để sắp xếp theo hướng ngược lại của trường đó). Mặc định là `created_at` nếu không được thiết lập. |
| `page` | KHÔNG | Con số | Xem [Pagination](#pagination) để biết thêm thông tin chi tiết |
| `limit` | KHÔNG | Con số | Xem [Pagination](#pagination) để biết thêm thông tin chi tiết |

> Ví dụ yêu cầu:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Tạo tên miền {#create-domain}

> `POST /v1/domains`

| Tham số cơ thể | Yêu cầu | Kiểu | Sự miêu tả |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Đúng | Chuỗi (FQDN hoặc IP) | Tên miền đủ điều kiện ("FQDN") hoặc địa chỉ IP |
| `team_domain` | KHÔNG | Chuỗi (ID miền hoặc tên miền; FQDN) | Tự động gán miền này cho cùng một nhóm từ một miền khác. Điều này có nghĩa là tất cả thành viên từ miền này sẽ được gán làm thành viên nhóm, và `plan` cũng sẽ tự động được đặt thành `team`. Bạn có thể đặt thành `"none"` nếu cần để tắt tính năng này một cách rõ ràng, nhưng điều đó không bắt buộc. |
| `plan` | KHÔNG | Chuỗi (có thể đếm được) | Loại gói cước (phải là `"free"`, `"enhanced_protection"` hoặc `"team"`, mặc định là `"free"` hoặc gói cước trả phí hiện tại của người dùng nếu có) |
| `catchall` | KHÔNG | Chuỗi (địa chỉ email phân tách) hoặc Boolean | Tạo một bí danh catch-all mặc định, mặc định là `true` (nếu `true`, nó sẽ sử dụng địa chỉ email của người dùng API làm người nhận, và nếu `false` thì sẽ không tạo bí danh catch-all nào). Nếu truyền một String, thì đó là một danh sách các địa chỉ email được phân cách để sử dụng làm người nhận (được phân tách bằng dấu ngắt dòng, khoảng trắng và/hoặc dấu phẩy). |
| `has_adult_content_protection` | KHÔNG | Boolean | Có nên bật tính năng bảo vệ nội dung người lớn của Spam Scanner trên miền này không |
| `has_phishing_protection` | KHÔNG | Boolean | Có nên bật tính năng bảo vệ chống lừa đảo Spam Scanner trên miền này không |
| `has_executable_protection` | KHÔNG | Boolean | Có nên bật tính năng bảo vệ thực thi Spam Scanner trên miền này không |
| `has_virus_protection` | KHÔNG | Boolean | Có nên bật tính năng bảo vệ chống vi-rút Spam Scanner trên miền này không |
| `has_recipient_verification` | KHÔNG | Boolean | Mặc định của miền toàn cầu về việc có yêu cầu người nhận bí danh nhấp vào liên kết xác minh email để email có thể chạy qua hay không |
| `ignore_mx_check` | KHÔNG | Boolean | Có nên bỏ qua việc kiểm tra bản ghi MX trên tên miền để xác minh hay không. Điều này chủ yếu dành cho người dùng có quy tắc cấu hình trao đổi MX nâng cao và cần giữ lại trao đổi MX hiện có và chuyển tiếp đến trao đổi MX của chúng tôi. |
| `retention_days` | KHÔNG | Con số | Số nguyên nằm giữa `0` và `30` tương ứng với số ngày lưu trữ email SMTP gửi đi sau khi đã gửi thành công hoặc bị lỗi vĩnh viễn. Mặc định là `0`, nghĩa là email SMTP gửi đi sẽ bị xóa và biên tập ngay lập tức để đảm bảo an toàn cho bạn. |
| `bounce_webhook` | KHÔNG | Chuỗi (URL) hoặc Boolean (sai) | URL webhook `http://` hoặc `https://` mà bạn chọn để gửi webhook trả lại. Chúng tôi sẽ gửi yêu cầu `POST` đến URL này kèm theo thông tin về lỗi SMTP gửi đi (ví dụ: lỗi mềm hoặc lỗi cứng – để bạn có thể quản lý người đăng ký và quản lý email gửi đi theo chương trình). |
| `max_quota_per_alias` | KHÔNG | Sợi dây | Hạn ngạch lưu trữ tối đa cho các bí danh trên tên miền này. Nhập một giá trị như "1 GB" sẽ được phân tích cú pháp bởi [bytes](https://github.com/visionmedia/bytes.js). |

> Ví dụ yêu cầu:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Truy xuất tên miền {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Ví dụ yêu cầu:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Xác minh bản ghi miền {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Ví dụ yêu cầu:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Xác minh bản ghi SMTP của miền {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Ví dụ yêu cầu:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Liệt kê mật khẩu bắt tất cả trên toàn miền {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Ví dụ yêu cầu:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Tạo mật khẩu chung cho toàn miền {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Tham số cơ thể | Yêu cầu | Kiểu | Sự miêu tả |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | KHÔNG | Sợi dây | Mật khẩu mới tùy chỉnh của bạn để sử dụng cho mật khẩu catch-all trên toàn miền. Lưu ý rằng bạn có thể để trống hoặc bỏ qua hoàn toàn mục này khỏi nội dung yêu cầu API của mình nếu bạn muốn có mật khẩu mạnh và được tạo ngẫu nhiên. |
| `description` | KHÔNG | Sợi dây | Mô tả chỉ nhằm mục đích tổ chức. |

> Ví dụ yêu cầu:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Xóa mật khẩu bắt tất cả trên toàn miền {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Ví dụ yêu cầu:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Cập nhật tên miền {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Tham số cơ thể | Yêu cầu | Kiểu | Sự miêu tả |
| ------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port` | KHÔNG | Chuỗi hoặc Số | Cổng tùy chỉnh để cấu hình chuyển tiếp SMTP (mặc định là `"25"`) |
| `has_adult_content_protection` | KHÔNG | Boolean | Có nên bật tính năng bảo vệ nội dung người lớn của Spam Scanner trên miền này không |
| `has_phishing_protection` | KHÔNG | Boolean | Có nên bật tính năng bảo vệ chống lừa đảo Spam Scanner trên miền này không |
| `has_executable_protection` | KHÔNG | Boolean | Có nên bật tính năng bảo vệ thực thi Spam Scanner trên miền này không |
| `has_virus_protection` | KHÔNG | Boolean | Có nên bật tính năng bảo vệ chống vi-rút Spam Scanner trên miền này không |
| `has_recipient_verification` | KHÔNG | Boolean | Mặc định của miền toàn cầu về việc có yêu cầu người nhận bí danh nhấp vào liên kết xác minh email để email có thể chạy qua hay không |
| `ignore_mx_check` | KHÔNG | Boolean | Có nên bỏ qua việc kiểm tra bản ghi MX trên tên miền để xác minh hay không. Điều này chủ yếu dành cho người dùng có quy tắc cấu hình trao đổi MX nâng cao và cần giữ lại trao đổi MX hiện có và chuyển tiếp đến trao đổi MX của chúng tôi. |
| `retention_days` | KHÔNG | Con số | Số nguyên nằm giữa `0` và `30` tương ứng với số ngày lưu trữ email SMTP gửi đi sau khi đã gửi thành công hoặc bị lỗi vĩnh viễn. Mặc định là `0`, nghĩa là email SMTP gửi đi sẽ bị xóa và biên tập ngay lập tức để đảm bảo an toàn cho bạn. |
| `bounce_webhook` | KHÔNG | Chuỗi (URL) hoặc Boolean (sai) | URL webhook `http://` hoặc `https://` mà bạn chọn để gửi webhook trả lại. Chúng tôi sẽ gửi yêu cầu `POST` đến URL này kèm theo thông tin về lỗi SMTP gửi đi (ví dụ: lỗi mềm hoặc lỗi cứng – để bạn có thể quản lý người đăng ký và quản lý email gửi đi theo chương trình). |
| `max_quota_per_alias` | KHÔNG | Sợi dây | Hạn ngạch lưu trữ tối đa cho các bí danh trên tên miền này. Nhập một giá trị như "1 GB" sẽ được phân tích cú pháp bởi [bytes](https://github.com/visionmedia/bytes.js). |

> Ví dụ yêu cầu:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Xóa tên miền {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Ví dụ yêu cầu:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```

## Mời {#invites}

### Chấp nhận lời mời tên miền {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Ví dụ yêu cầu:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Tạo lời mời tên miền {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Tham số cơ thể | Yêu cầu | Kiểu | Sự miêu tả |
| -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email` | Đúng | Chuỗi (Email) | Địa chỉ email để mời vào danh sách thành viên miền |
| `group` | Đúng | Chuỗi (có thể đếm được) | Nhóm để thêm người dùng vào tư cách thành viên miền (có thể là một trong `"admin"` hoặc `"user"`) |

> Ví dụ yêu cầu:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> If the user being invited is already an accepted member of any other domains the admin inviting them is a member of, then it will auto-accept the invite and not send an email.

### Xóa lời mời tên miền {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Tham số cơ thể | Yêu cầu | Kiểu | Sự miêu tả |
| -------------- | -------- | -------------- | ------------------------------------------------ |
| `email` | Đúng | Chuỗi (Email) | Địa chỉ email cần xóa khỏi danh sách thành viên miền |

> Ví dụ yêu cầu:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

## Thành viên {#members}

### Cập nhật thành viên miền {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Tham số cơ thể | Yêu cầu | Kiểu | Sự miêu tả |
| -------------- | -------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `group` | Đúng | Chuỗi (có thể đếm được) | Nhóm để cập nhật người dùng thành thành viên miền (có thể là một trong `"admin"` hoặc `"user"`) |

> Ví dụ yêu cầu:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Xóa thành viên miền {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Ví dụ yêu cầu:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```

## Bí danh {#aliases}

### Tạo mật khẩu bí danh {#generate-an-alias-password}

Lưu ý rằng nếu bạn không gửi hướng dẫn qua email, thì tên người dùng và mật khẩu sẽ nằm trong nội dung phản hồi JSON của yêu cầu thành công theo định dạng `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Tham số cơ thể | Yêu cầu | Kiểu | Sự miêu tả |
| ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | KHÔNG | Sợi dây | Mật khẩu mới tùy chỉnh của bạn để sử dụng cho bí danh. Lưu ý rằng bạn có thể để trống hoặc bỏ qua mục này trong nội dung yêu cầu API nếu muốn có một mật khẩu mạnh và được tạo ngẫu nhiên. |
| `password` | KHÔNG | Sợi dây | Mật khẩu hiện tại cho bí danh để thay đổi mật khẩu mà không xóa bộ nhớ hộp thư IMAP hiện có (xem tùy chọn `is_override` bên dưới nếu bạn không còn mật khẩu hiện tại). |
| `is_override` | KHÔNG | Boolean | **SỬ DỤNG THẬN TRỌNG**: Thao tác này sẽ ghi đè hoàn toàn mật khẩu và cơ sở dữ liệu bí danh hiện có, đồng thời xóa vĩnh viễn bộ nhớ IMAP hiện có và đặt lại hoàn toàn cơ sở dữ liệu email SQLite của bí danh. Vui lòng sao lưu nếu có thể nếu bạn có hộp thư hiện có được kết nối với bí danh này. |
| `emailed_instructions` | KHÔNG | Sợi dây | Địa chỉ email để gửi mật khẩu bí danh và hướng dẫn thiết lập. |

> Ví dụ yêu cầu:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Liệt kê các bí danh tên miền {#list-domain-aliases}

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.  See [Pagination](#pagination) for more insight.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Tham số chuỗi truy vấn | Yêu cầu | Kiểu | Sự miêu tả |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | KHÔNG | Chuỗi (RegExp được hỗ trợ) | Tìm kiếm bí danh trong một miền theo tên, nhãn hoặc người nhận |
| `name` | KHÔNG | Chuỗi (RegExp được hỗ trợ) | Tìm kiếm bí danh trong một miền theo tên |
| `recipient` | KHÔNG | Chuỗi (RegExp được hỗ trợ) | Tìm kiếm bí danh trong một miền theo người nhận |
| `sort` | KHÔNG | Sợi dây | Sắp xếp theo một trường cụ thể (thêm tiền tố `-` để sắp xếp theo hướng ngược lại của trường đó). Mặc định là `created_at` nếu không được thiết lập. |
| `page` | KHÔNG | Con số | Xem [Pagination](#pagination) để biết thêm thông tin chi tiết |
| `limit` | KHÔNG | Con số | Xem [Pagination](#pagination) để biết thêm thông tin chi tiết |

> Ví dụ yêu cầu:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Tạo bí danh tên miền mới {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Tham số cơ thể | Yêu cầu | Kiểu | Sự miêu tả |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | KHÔNG | Sợi dây | Tên bí danh (nếu không được cung cấp hoặc để trống, thì một bí danh ngẫu nhiên sẽ được tạo) |
| `recipients` | KHÔNG | Chuỗi hoặc Mảng | Danh sách người nhận (phải là Chuỗi hoặc Mảng các địa chỉ email hợp lệ, tên miền đủ điều kiện ("FQDN"), địa chỉ IP và/hoặc URL webhook được phân tách bằng dấu ngắt dòng/dấu cách/dấu phẩy – và nếu không được cung cấp hoặc là Mảng trống, thì email của người dùng thực hiện yêu cầu API sẽ được đặt làm người nhận) |
| `description` | KHÔNG | Sợi dây | Mô tả bí danh |
| `labels` | KHÔNG | Chuỗi hoặc Mảng | Danh sách nhãn (phải được phân tách bằng dấu ngắt dòng/dấu cách/dấu phẩy Chuỗi hoặc Mảng) |
| `has_recipient_verification` | KHÔNG | Boolean | Yêu cầu người nhận nhấp vào liên kết xác minh email để email có thể được gửi qua (mặc định là cài đặt của tên miền nếu không được thiết lập rõ ràng trong nội dung yêu cầu) |
| `is_enabled` | KHÔNG | Boolean | Bật hay tắt bí danh này (nếu tắt, email sẽ không được chuyển hướng đến đâu cả mà chỉ trả về mã trạng thái thành công). Nếu một giá trị được truyền vào, nó sẽ được chuyển đổi thành boolean bằng cách sử dụng [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `error_code_if_disabled` | KHÔNG | Số (`250`, `421` hoặc `550`) | Email đến bí danh này sẽ bị từ chối nếu `is_enabled` là `false` với `250` (chuyển thư âm thầm đến nơi không mong muốn, ví dụ: blackhole hoặc `/dev/null`), `421` (từ chối nhẹ nhàng; và thử lại trong tối đa ~5 ngày) hoặc `550` lỗi và từ chối vĩnh viễn. Mặc định là `250`. |
| `has_imap` | KHÔNG | Boolean | Có nên bật hay tắt lưu trữ IMAP cho bí danh này không (nếu tắt, thì email đến sẽ không được lưu trữ vào [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Nếu truyền giá trị, giá trị đó sẽ được chuyển đổi thành boolean bằng [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `has_pgp` | KHÔNG | Boolean | Có nên bật hay tắt [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) cho [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) bằng cách sử dụng bí danh `public_key` không. |
| `public_key` | KHÔNG | Sợi dây | Khóa công khai OpenPGP ở định dạng ASCII Armor ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); ví dụ: khóa GPG cho `support@forwardemail.net`). Điều này chỉ áp dụng nếu bạn đã đặt `has_pgp` thành `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | KHÔNG | Sợi dây | Hạn ngạch lưu trữ tối đa cho bí danh này. Để trống để đặt lại về hạn ngạch tối đa hiện tại của miền hoặc nhập một giá trị như "1 GB" sẽ được phân tích cú pháp bởi [bytes](https://github.com/visionmedia/bytes.js). Giá trị này chỉ có thể được điều chỉnh bởi quản trị viên miền. |
| `vacation_responder_is_enabled` | KHÔNG | Boolean | Có nên bật hay tắt chế độ trả lời tự động khi đi nghỉ không. |
| `vacation_responder_start_date` | KHÔNG | Sợi dây | Ngày bắt đầu cho tính năng trả lời tự động (nếu được bật và không có ngày bắt đầu nào được đặt ở đây, thì tính năng này sẽ mặc định là đã bắt đầu). Chúng tôi hỗ trợ các định dạng ngày như `MM/DD/YYYY`, `YYYY-MM-DD` và các định dạng ngày khác thông qua phân tích cú pháp thông minh bằng `dayjs`. |
| `vacation_responder_end_date` | KHÔNG | Sợi dây | Ngày kết thúc cho tính năng trả lời tự động (nếu được bật và không đặt ngày kết thúc ở đây, thì tính năng này sẽ mặc định là không bao giờ kết thúc và trả lời mãi mãi). Chúng tôi hỗ trợ các định dạng ngày như `MM/DD/YYYY`, `YYYY-MM-DD` và các định dạng ngày khác thông qua phân tích cú pháp thông minh bằng `dayjs`. |
| `vacation_responder_subject` | KHÔNG | Sợi dây | Tiêu đề ở dạng văn bản thuần túy dành cho người trả lời tự động, ví dụ: "Vắng mặt". Chúng tôi sử dụng `striptags` để xóa toàn bộ mã HTML tại đây. |
| `vacation_responder_message` | KHÔNG | Sợi dây | Tin nhắn dạng văn bản thuần túy dành cho người trả lời tự động, ví dụ: "Tôi sẽ vắng mặt cho đến tháng 2". Chúng tôi sử dụng `striptags` để xóa toàn bộ mã HTML tại đây. |

> Ví dụ yêu cầu:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Truy xuất bí danh tên miền {#retrieve-domain-alias}

Bạn có thể lấy bí danh tên miền bằng giá trị `id` hoặc `name` của nó.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Ví dụ yêu cầu:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Ví dụ yêu cầu:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Cập nhật bí danh tên miền {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Tham số cơ thể | Yêu cầu | Kiểu | Sự miêu tả |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | KHÔNG | Sợi dây | Tên bí danh |
| `recipients` | KHÔNG | Chuỗi hoặc Mảng | Danh sách người nhận (phải được phân tách bằng dấu ngắt dòng/dấu cách/dấu phẩy Chuỗi hoặc Mảng các địa chỉ email hợp lệ, tên miền đủ điều kiện ("FQDN"), địa chỉ IP và/hoặc URL webhook) |
| `description` | KHÔNG | Sợi dây | Mô tả bí danh |
| `labels` | KHÔNG | Chuỗi hoặc Mảng | Danh sách nhãn (phải được phân tách bằng dấu ngắt dòng/dấu cách/dấu phẩy Chuỗi hoặc Mảng) |
| `has_recipient_verification` | KHÔNG | Boolean | Yêu cầu người nhận nhấp vào liên kết xác minh email để email có thể được gửi qua (mặc định là cài đặt của tên miền nếu không được thiết lập rõ ràng trong nội dung yêu cầu) |
| `is_enabled` | KHÔNG | Boolean | Bật hay tắt bí danh này (nếu tắt, email sẽ không được chuyển hướng đến đâu cả mà chỉ trả về mã trạng thái thành công). Nếu một giá trị được truyền vào, nó sẽ được chuyển đổi thành boolean bằng cách sử dụng [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `error_code_if_disabled` | KHÔNG | Số (`250`, `421` hoặc `550`) | Email đến bí danh này sẽ bị từ chối nếu `is_enabled` là `false` với `250` (chuyển thư âm thầm đến nơi không mong muốn, ví dụ: blackhole hoặc `/dev/null`), `421` (từ chối nhẹ nhàng; và thử lại trong tối đa ~5 ngày) hoặc `550` lỗi và từ chối vĩnh viễn. Mặc định là `250`. |
| `has_imap` | KHÔNG | Boolean | Có nên bật hay tắt lưu trữ IMAP cho bí danh này không (nếu tắt, thì email đến sẽ không được lưu trữ vào [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Nếu truyền giá trị, giá trị đó sẽ được chuyển đổi thành boolean bằng [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `has_pgp` | KHÔNG | Boolean | Có nên bật hay tắt [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) cho [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) bằng cách sử dụng bí danh `public_key` không. |
| `public_key` | KHÔNG | Sợi dây | Khóa công khai OpenPGP ở định dạng ASCII Armor ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); ví dụ: khóa GPG cho `support@forwardemail.net`). Điều này chỉ áp dụng nếu bạn đã đặt `has_pgp` thành `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | KHÔNG | Sợi dây | Hạn ngạch lưu trữ tối đa cho bí danh này. Để trống để đặt lại về hạn ngạch tối đa hiện tại của miền hoặc nhập một giá trị như "1 GB" sẽ được phân tích cú pháp bởi [bytes](https://github.com/visionmedia/bytes.js). Giá trị này chỉ có thể được điều chỉnh bởi quản trị viên miền. |
| `vacation_responder_is_enabled` | KHÔNG | Boolean | Có nên bật hay tắt chế độ trả lời tự động khi đi nghỉ không. |
| `vacation_responder_start_date` | KHÔNG | Sợi dây | Ngày bắt đầu cho tính năng trả lời tự động (nếu được bật và không có ngày bắt đầu nào được đặt ở đây, thì tính năng này sẽ mặc định là đã bắt đầu). Chúng tôi hỗ trợ các định dạng ngày như `MM/DD/YYYY`, `YYYY-MM-DD` và các định dạng ngày khác thông qua phân tích cú pháp thông minh bằng `dayjs`. |
| `vacation_responder_end_date` | KHÔNG | Sợi dây | Ngày kết thúc cho tính năng trả lời tự động (nếu được bật và không đặt ngày kết thúc ở đây, thì tính năng này sẽ mặc định là không bao giờ kết thúc và trả lời mãi mãi). Chúng tôi hỗ trợ các định dạng ngày như `MM/DD/YYYY`, `YYYY-MM-DD` và các định dạng ngày khác thông qua phân tích cú pháp thông minh bằng `dayjs`. |
| `vacation_responder_subject` | KHÔNG | Sợi dây | Tiêu đề ở dạng văn bản thuần túy dành cho người trả lời tự động, ví dụ: "Vắng mặt". Chúng tôi sử dụng `striptags` để xóa toàn bộ mã HTML tại đây. |
| `vacation_responder_message` | KHÔNG | Sợi dây | Tin nhắn dạng văn bản thuần túy dành cho người trả lời tự động, ví dụ: "Tôi sẽ vắng mặt cho đến tháng 2". Chúng tôi sử dụng `striptags` để xóa toàn bộ mã HTML tại đây. |

> Ví dụ yêu cầu:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Xóa bí danh tên miền {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Ví dụ yêu cầu:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

## Mã hóa {#encrypt}

Chúng tôi cho phép bạn mã hóa hồ sơ ngay cả trên gói miễn phí mà không mất phí. Quyền riêng tư không nên là một tính năng, mà nên được tích hợp sẵn trong mọi khía cạnh của sản phẩm. Theo yêu cầu cao trong [Thảo luận về Hướng dẫn Quyền riêng tư](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) và trên [các vấn đề GitHub của chúng tôi](https://github.com/forwardemail/forwardemail.net/issues/254), chúng tôi đã thêm tính năng này.

### Mã hóa bản ghi TXT {#encrypt-txt-record}

> `POST /v1/encrypt`

| Tham số cơ thể | Yêu cầu | Kiểu | Sự miêu tả |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input` | Đúng | Sợi dây | Bất kỳ bản ghi TXT văn bản thuần túy Email chuyển tiếp hợp lệ nào |

> Ví dụ yêu cầu:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
