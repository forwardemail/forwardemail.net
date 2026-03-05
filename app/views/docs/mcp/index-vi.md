# Máy chủ MCP của Forward Email {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> <a href="https://github.com/forwardemail/mcp-server">Máy chủ MCP mã nguồn mở</a> của chúng tôi cho phép các trợ lý AI như Claude, ChatGPT, Cursor và Windsurf quản lý email, tên miền, bí danh, danh bạ và lịch của bạn thông qua ngôn ngữ tự nhiên. Tất cả 68 điểm cuối API đều được hiển thị dưới dạng công cụ MCP. Nó chạy cục bộ thông qua <code>npx @forwardemail/mcp-server</code> — thông tin đăng nhập của bạn không bao giờ rời khỏi máy của bạn.
</p>

## Mục lục {#table-of-contents}

* [MCP là gì?](#what-is-mcp)
* [Bắt đầu nhanh](#quick-start)
  * [Lấy khóa API](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Các máy khách MCP khác](#other-mcp-clients)
* [Xác thực](#authentication)
  * [Xác thực bằng khóa API](#api-key-auth)
  * [Xác thực bằng bí danh](#alias-auth)
  * [Tạo mật khẩu bí danh](#generating-an-alias-password)
* [Tất cả 68 công cụ](#all-68-tools)
  * [Tài khoản (Khóa API hoặc Xác thực bí danh)](#account-api-key-or-alias-auth)
  * [Tên miền (Khóa API)](#domains-api-key)
  * [Bí danh (Khóa API)](#aliases-api-key)
  * [Email — SMTP gửi đi (Khóa API; Gửi hỗ trợ cả hai)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Tin nhắn — IMAP (Xác thực bí danh)](#messages--imap-alias-auth)
  * [Thư mục — IMAP (Xác thực bí danh)](#folders--imap-alias-auth)
  * [Danh bạ — CardDAV (Xác thực bí danh)](#contacts--carddav-alias-auth)
  * [Lịch — CalDAV (Xác thực bí danh)](#calendars--caldav-alias-auth)
  * [Sự kiện lịch — CalDAV (Xác thực bí danh)](#calendar-events--caldav-alias-auth)
  * [Tập lệnh Sieve (Khóa API)](#sieve-scripts-api-key)
  * [Tập lệnh Sieve (Xác thực bí danh)](#sieve-scripts-alias-auth)
  * [Thành viên và lời mời tên miền (Khóa API)](#domain-members-and-invites-api-key)
  * [Mật khẩu Catch-All (Khóa API)](#catch-all-passwords-api-key)
  * [Nhật ký (Khóa API)](#logs-api-key)
  * [Mã hóa (Không xác thực)](#encrypt-no-auth)
* [20 trường hợp sử dụng thực tế](#20-real-world-use-cases)
* [Ví dụ về lời nhắc](#example-prompts)
* [Biến môi trường](#environment-variables)
* [Bảo mật](#security)
* [Sử dụng theo chương trình](#programmatic-usage)
* [Mã nguồn mở](#open-source)


## MCP là gì? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) là một tiêu chuẩn mở được tạo bởi Anthropic cho phép các mô hình AI gọi các công cụ bên ngoài một cách an toàn. Thay vì sao chép-dán phản hồi API vào cửa sổ trò chuyện, MCP cung cấp cho mô hình quyền truy cập trực tiếp, có cấu trúc vào các dịch vụ của bạn.

Máy chủ MCP của chúng tôi bao bọc toàn bộ [API Forward Email](/email-api) — mọi điểm cuối, mọi tham số — và hiển thị chúng dưới dạng các công cụ mà bất kỳ máy khách tương thích MCP nào cũng có thể sử dụng. Máy chủ chạy cục bộ trên máy của bạn bằng cách sử dụng giao thức stdio. Thông tin đăng nhập của bạn vẫn nằm trong các biến môi trường của bạn và không bao giờ được gửi đến mô hình AI.


## Bắt đầu nhanh {#quick-start}

### Lấy khóa API {#get-an-api-key}

1. Đăng nhập vào tài khoản [Forward Email](/my-account/domains) của bạn.
2. Truy cập **Tài khoản của tôi** → **Bảo mật** → **Khóa API**.
3. Tạo khóa API mới và sao chép nó.

### Claude Desktop {#claude-desktop}

Thêm đoạn mã này vào tệp cấu hình Claude Desktop của bạn:

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

Khởi động lại Claude Desktop. Bạn sẽ thấy các công cụ Forward Email trong bộ chọn công cụ.

> **Lưu ý:** Các biến `FORWARD_EMAIL_ALIAS_USER` và `FORWARD_EMAIL_ALIAS_PASSWORD` là tùy chọn nhưng bắt buộc đối với các công cụ hộp thư (tin nhắn, thư mục, danh bạ, lịch). Xem [Xác thực](#authentication) để biết chi tiết.

### Cursor {#cursor}

Mở Cài đặt Cursor → MCP → Thêm máy chủ:

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

Mở Cài đặt Windsurf → MCP → Thêm máy chủ với cấu hình tương tự như trên.

### Các máy khách MCP khác {#other-mcp-clients}

Bất kỳ máy khách nào hỗ trợ giao thức stdio của MCP đều sẽ hoạt động. Lệnh là:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Xác thực {#authentication}

API Forward Email sử dụng **xác thực HTTP Basic** với hai loại thông tin đăng nhập khác nhau tùy thuộc vào điểm cuối. Máy chủ MCP xử lý việc này tự động — bạn chỉ cần cung cấp thông tin đăng nhập phù hợp.

### Xác thực bằng khóa API {#api-key-auth}

Hầu hết các điểm cuối quản lý (tên miền, bí danh, email gửi đi, nhật ký) sử dụng **khóa API** của bạn làm tên người dùng xác thực Basic với mật khẩu trống.

Đây là cùng một khóa API mà bạn sử dụng cho API REST. Đặt nó thông qua biến môi trường `FORWARD_EMAIL_API_KEY`.

### Xác thực bằng bí danh {#alias-auth}

Các điểm cuối hộp thư (tin nhắn, thư mục, danh bạ, lịch, tập lệnh Sieve theo bí danh) sử dụng **thông tin đăng nhập bí danh** — địa chỉ email bí danh làm tên người dùng và mật khẩu được tạo làm mật khẩu.

Các điểm cuối này truy cập dữ liệu theo bí danh thông qua các giao thức IMAP, CalDAV và CardDAV. Chúng yêu cầu email bí danh và mật khẩu được tạo, không phải khóa API.

Bạn có thể cung cấp thông tin đăng nhập bí danh theo hai cách:

1. **Biến môi trường** (được khuyến nghị cho bí danh mặc định): Đặt `FORWARD_EMAIL_ALIAS_USER` và `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Tham số theo từng lần gọi công cụ**: Truyền `alias_username` và `alias_password` làm đối số cho bất kỳ công cụ xác thực bí danh nào. Các tham số này sẽ ghi đè các biến môi trường, điều này hữu ích khi làm việc với nhiều bí danh.

### Tạo mật khẩu bí danh {#generating-an-alias-password}

Trước khi bạn có thể sử dụng các công cụ xác thực bí danh, bạn cần tạo mật khẩu cho bí danh. Bạn có thể thực hiện việc này bằng công cụ `generateAliasPassword` hoặc thông qua API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

Phản hồi bao gồm các trường `username` (email bí danh) và `password`. Sử dụng chúng làm thông tin đăng nhập bí danh của bạn.

> **Mẹo:** Bạn cũng có thể hỏi trợ lý AI của mình: *"Tạo mật khẩu cho bí danh user@example.com trên tên miền example.com"* — nó sẽ gọi công cụ `generateAliasPassword` và trả về thông tin đăng nhập.

Bảng dưới đây tóm tắt phương pháp xác thực mà mỗi nhóm công cụ yêu cầu:

| Nhóm công cụ | Phương pháp xác thực | Thông tin đăng nhập |
|-----------|-------------|-------------|
| Tài khoản | Khóa API **hoặc** Xác thực bí danh | Một trong hai |
| Tên miền, Bí danh, Thành viên tên miền, Lời mời, Mật khẩu Catch-All | Khóa API | `FORWARD_EMAIL_API_KEY` |
| Email gửi đi (liệt kê, lấy, xóa, giới hạn) | Khóa API | `FORWARD_EMAIL_API_KEY` |
| Gửi Email | Khóa API **hoặc** Xác thực bí danh | Một trong hai |
| Tin nhắn (IMAP) | Xác thực bí danh | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Thư mục (IMAP) | Xác thực bí danh | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Danh bạ (CardDAV) | Xác thực bí danh | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Lịch (CalDAV) | Xác thực bí danh | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sự kiện lịch (CalDAV) | Xác thực bí danh | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Tập lệnh Sieve (phạm vi tên miền) | Khóa API | `FORWARD_EMAIL_API_KEY` |
| Tập lệnh Sieve (phạm vi bí danh) | Xác thực bí danh | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Nhật ký | Khóa API | `FORWARD_EMAIL_API_KEY` |
| Mã hóa | Không | Không cần thông tin đăng nhập |


## Tất cả 68 công cụ {#all-68-tools}

Mỗi công cụ ánh xạ trực tiếp đến một điểm cuối [API Forward Email](/email-api). Các tham số sử dụng cùng tên với tài liệu API. Phương pháp xác thực được ghi chú trong tiêu đề mỗi phần.

### Tài khoản (Khóa API hoặc Xác thực bí danh) {#account-api-key-or-alias-auth}

Với xác thực khóa API, các công cụ này trả về thông tin tài khoản người dùng của bạn. Với xác thực bí danh, chúng trả về thông tin bí danh/hộp thư bao gồm hạn ngạch lưu trữ và cài đặt.

| Công cụ | Điểm cuối API | Mô tả |
|------|-------------|-------------|
| `getAccount` | `GET /v1/account` | Lấy thông tin tài khoản của bạn |
| `updateAccount` | `PUT /v1/account` | Cập nhật cài đặt tài khoản của bạn |

### Tên miền (Khóa API) {#domains-api-key}

| Công cụ | Điểm cuối API | Mô tả |
|------|-------------|-------------|
| `listDomains` | `GET /v1/domains` | Liệt kê tất cả các tên miền của bạn |
| `createDomain` | `POST /v1/domains` | Thêm một tên miền mới |
| `getDomain` | `GET /v1/domains/:domain_id` | Lấy chi tiết tên miền |
| `updateDomain` | `PUT /v1/domains/:domain_id` | Cập nhật cài đặt tên miền |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | Xóa một tên miền |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | Xác minh bản ghi DNS |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | Xác minh cấu hình SMTP |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | Kiểm tra kết nối lưu trữ S3 tùy chỉnh |

### Bí danh (Khóa API) {#aliases-api-key}

| Công cụ | Điểm cuối API | Mô tả |
|------|-------------|-------------|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | Liệt kê các bí danh cho một tên miền |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | Tạo một bí danh mới |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | Lấy chi tiết bí danh |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | Cập nhật một bí danh |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | Xóa một bí danh |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Tạo mật khẩu IMAP/SMTP để xác thực bí danh |

### Email — SMTP gửi đi (Khóa API; Gửi hỗ trợ cả hai) {#emails--outbound-smtp-api-key-send-supports-both}

| Công cụ | Điểm cuối API | Xác thực | Mô tả |
|------|-------------|------|-------------|
| `sendEmail` | `POST /v1/emails` | Khóa API hoặc Xác thực bí danh | Gửi email qua SMTP |
| `listEmails` | `GET /v1/emails` | Khóa API | Liệt kê các email gửi đi |
| `getEmail` | `GET /v1/emails/:id` | Khóa API | Lấy chi tiết và trạng thái email |
| `deleteEmail` | `DELETE /v1/emails/:id` | Khóa API | Xóa một email đang chờ xử lý |
| `getEmailLimit` | `GET /v1/emails/limit` | Khóa API | Kiểm tra giới hạn gửi của bạn |

Công cụ `sendEmail` chấp nhận `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` và `attachments`. Điều này giống như điểm cuối `POST /v1/emails`.

### Tin nhắn — IMAP (Xác thực bí danh) {#messages--imap-alias-auth}

> **Yêu cầu thông tin đăng nhập bí danh.** Truyền `alias_username` và `alias_password` hoặc đặt các biến môi trường `FORWARD_EMAIL_ALIAS_USER` và `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Công cụ | Điểm cuối API | Mô tả |
|------|-------------|-------------|
| `listMessages` | `GET /v1/messages` | Liệt kê và tìm kiếm tin nhắn trong hộp thư |
| `createMessage` | `POST /v1/messages` | Tạo bản nháp hoặc tải lên tin nhắn |
| `getMessage` | `GET /v1/messages/:id` | Lấy tin nhắn theo ID |
| `updateMessage` | `PUT /v1/messages/:id` | Cập nhật cờ (đã đọc, gắn sao, v.v.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Xóa tin nhắn |

Công cụ `listMessages` hỗ trợ hơn 15 tham số tìm kiếm bao gồm `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` và `has_attachment`. Xem [tài liệu API](/email-api) để biết danh sách đầy đủ.

### Thư mục — IMAP (Xác thực bí danh) {#folders--imap-alias-auth}

> **Yêu cầu thông tin đăng nhập bí danh.** Truyền `alias_username` và `alias_password` hoặc đặt các biến môi trường `FORWARD_EMAIL_ALIAS_USER` và `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Công cụ | Điểm cuối API | Mô tả |
|------|-------------|-------------|
| `listFolders` | `GET /v1/folders` | Liệt kê tất cả các thư mục hộp thư |
| `createFolder` | `POST /v1/folders` | Tạo một thư mục mới |
| `getFolder` | `GET /v1/folders/:id` | Lấy chi tiết thư mục |
| `updateFolder` | `PUT /v1/folders/:id` | Đổi tên thư mục |
| `deleteFolder` | `DELETE /v1/folders/:id` | Xóa thư mục |

### Danh bạ — CardDAV (Xác thực bí danh) {#contacts--carddav-alias-auth}

> **Yêu cầu thông tin đăng nhập bí danh.** Truyền `alias_username` và `alias_password` hoặc đặt các biến môi trường `FORWARD_EMAIL_ALIAS_USER` và `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Công cụ | Điểm cuối API | Mô tả |
|------|-------------|-------------|
| `listContacts` | `GET /v1/contacts` | Liệt kê tất cả danh bạ |
| `createContact` | `POST /v1/contacts` | Tạo một danh bạ mới |
| `getContact` | `GET /v1/contacts/:id` | Lấy chi tiết danh bạ |
| `updateContact` | `PUT /v1/contacts/:id` | Cập nhật một danh bạ |
| `deleteContact` | `DELETE /v1/contacts/:id` | Xóa một danh bạ |

### Lịch — CalDAV (Xác thực bí danh) {#calendars--caldav-alias-auth}

> **Yêu cầu thông tin đăng nhập bí danh.** Truyền `alias_username` và `alias_password` hoặc đặt các biến môi trường `FORWARD_EMAIL_ALIAS_USER` và `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Công cụ | Điểm cuối API | Mô tả |
|------|-------------|-------------|
| `listCalendars` | `GET /v1/calendars` | Liệt kê tất cả các lịch |
| `createCalendar` | `POST /v1/calendars` | Tạo một lịch mới |
| `getCalendar` | `GET /v1/calendars/:id` | Lấy chi tiết lịch |
| `updateCalendar` | `PUT /v1/calendars/:id` | Cập nhật một lịch |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Xóa một lịch |

### Sự kiện lịch — CalDAV (Xác thực bí danh) {#calendar-events--caldav-alias-auth}

> **Yêu cầu thông tin đăng nhập bí danh.** Truyền `alias_username` và `alias_password` hoặc đặt các biến môi trường `FORWARD_EMAIL_ALIAS_USER` và `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Công cụ | Điểm cuối API | Mô tả |
|------|-------------|-------------|
| `listCalendarEvents` | `GET /v1/calendar-events` | Liệt kê tất cả các sự kiện |
| `createCalendarEvent` | `POST /v1/calendar-events` | Tạo một sự kiện mới |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | Lấy chi tiết sự kiện |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | Cập nhật một sự kiện |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Xóa một sự kiện |

### Tập lệnh Sieve (Khóa API) {#sieve-scripts-api-key}

Các tập lệnh này sử dụng đường dẫn có phạm vi tên miền và xác thực bằng khóa API của bạn.

| Công cụ | Điểm cuối API | Mô tả |
|------|-------------|-------------|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | Liệt kê các tập lệnh cho một bí danh |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | Tạo một tập lệnh mới |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Lấy chi tiết tập lệnh |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Cập nhật một tập lệnh |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Xóa một tập lệnh |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Kích hoạt một tập lệnh |

### Tập lệnh Sieve (Xác thực bí danh) {#sieve-scripts-alias-auth}

Các tập lệnh này sử dụng xác thực cấp bí danh. Hữu ích cho tự động hóa theo từng bí danh mà không cần khóa API.

> **Yêu cầu thông tin đăng nhập bí danh.** Truyền `alias_username` và `alias_password` hoặc đặt các biến môi trường `FORWARD_EMAIL_ALIAS_USER` và `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Công cụ | Điểm cuối API | Mô tả |
|------|-------------|-------------|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | Liệt kê các tập lệnh |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | Tạo một tập lệnh |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | Lấy chi tiết tập lệnh |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | Cập nhật một tập lệnh |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | Xóa một tập lệnh |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Kích hoạt một tập lệnh |

### Thành viên và lời mời tên miền (Khóa API) {#domain-members-and-invites-api-key}

| Công cụ | Điểm cuối API | Mô tả |
|------|-------------|-------------|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | Thay đổi vai trò của thành viên |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | Xóa một thành viên |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | Chấp nhận một lời mời đang chờ xử lý |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | Mời ai đó vào một tên miền |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | Thu hồi một lời mời |

### Mật khẩu Catch-All (Khóa API) {#catch-all-passwords-api-key}

| Công cụ | Điểm cuối API | Mô tả |
|------|-------------|-------------|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | Liệt kê mật khẩu catch-all |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | Tạo mật khẩu catch-all |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Xóa mật khẩu catch-all |

### Nhật ký (Khóa API) {#logs-api-key}

| Công cụ | Điểm cuối API | Mô tả |
|------|-------------|-------------|
| `downloadLogs` | `GET /v1/logs/download` | Tải xuống nhật ký gửi email |

### Mã hóa (Không xác thực) {#encrypt-no-auth}

| Công cụ | Điểm cuối API | Mô tả |
|------|-------------|-------------|
| `encryptRecord` | `POST /v1/encrypt` | Mã hóa bản ghi DNS TXT |

Công cụ này không yêu cầu xác thực. Nó mã hóa các bản ghi chuyển tiếp như `forward-email=user@example.com` để sử dụng trong các bản ghi DNS TXT.


## 20 trường hợp sử dụng thực tế {#20-real-world-use-cases}

Dưới đây là các cách thực tế để sử dụng máy chủ MCP với trợ lý AI của bạn:

### 1. Phân loại email {#email-triage}

Yêu cầu AI của bạn quét hộp thư đến và tóm tắt các tin nhắn chưa đọc. Nó có thể gắn cờ các email khẩn cấp, phân loại theo người gửi và soạn thảo trả lời — tất cả thông qua ngôn ngữ tự nhiên. *(Yêu cầu thông tin đăng nhập bí danh để truy cập hộp thư đến.)*

### 2. Tự động hóa thiết lập tên miền {#domain-setup-automation}

Thiết lập một tên miền mới? Yêu cầu AI tạo tên miền, thêm bí danh của bạn, xác minh bản ghi DNS và kiểm tra cấu hình SMTP. Những gì thường mất 10 phút nhấp qua các bảng điều khiển sẽ trở thành một cuộc trò chuyện.

### 3. Quản lý bí danh hàng loạt {#bulk-alias-management}

Cần tạo 20 bí danh cho một dự án mới? Mô tả những gì bạn cần và để AI xử lý công việc lặp đi lặp lại. Nó có thể tạo bí danh, đặt quy tắc chuyển tiếp và tạo mật khẩu trong một lần.

### 4. Giám sát chiến dịch email {#email-campaign-monitoring}

Yêu cầu AI của bạn kiểm tra giới hạn gửi, liệt kê các email gửi đi gần đây và báo cáo về trạng thái gửi. Hữu ích để giám sát tình trạng email giao dịch.

### 5. Đồng bộ hóa và dọn dẹp danh bạ {#contact-sync-and-cleanup}

Sử dụng các công cụ CardDAV để liệt kê tất cả danh bạ, tìm các bản sao, cập nhật thông tin lỗi thời hoặc tạo hàng loạt danh bạ từ một bảng tính bạn dán vào cuộc trò chuyện. *(Yêu cầu thông tin đăng nhập bí danh.)*

### 6. Quản lý lịch {#calendar-management}

Tạo lịch, thêm sự kiện, cập nhật thời gian cuộc họp và xóa các sự kiện đã hủy — tất cả thông qua trò chuyện. Các công cụ CalDAV hỗ trợ CRUD đầy đủ trên cả lịch và sự kiện. *(Yêu cầu thông tin đăng nhập bí danh.)*

### 7. Tự động hóa tập lệnh Sieve {#sieve-script-automation}

Tập lệnh Sieve rất mạnh mẽ nhưng cú pháp của chúng rất khó hiểu. Yêu cầu AI của bạn viết tập lệnh Sieve cho bạn: "Lọc tất cả email từ billing@example.com vào thư mục Thanh toán" trở thành một tập lệnh hoạt động mà không cần chạm vào thông số kỹ thuật RFC 5228.

### 8. Giới thiệu thành viên nhóm {#team-onboarding}

Khi một thành viên nhóm mới tham gia, hãy yêu cầu AI tạo bí danh của họ, tạo mật khẩu, gửi cho họ một email chào mừng với thông tin đăng nhập của họ và thêm họ làm thành viên tên miền. Một lời nhắc, bốn cuộc gọi API.

### 9. Kiểm tra bảo mật {#security-auditing}

Yêu cầu AI của bạn liệt kê tất cả các tên miền, kiểm tra trạng thái xác minh DNS, xem xét cấu hình bí danh và xác định bất kỳ tên miền nào có bản ghi chưa được xác minh. Một cuộc kiểm tra bảo mật nhanh chóng bằng ngôn ngữ tự nhiên.

### 10. Thiết lập chuyển tiếp email {#email-forwarding-setup}

Thiết lập chuyển tiếp email cho một tên miền mới? Yêu cầu AI tạo tên miền, thêm bí danh chuyển tiếp, mã hóa các bản ghi DNS và xác minh mọi thứ được cấu hình đúng cách.

### 11. Tìm kiếm và phân tích hộp thư đến {#inbox-search-and-analysis}

Sử dụng các công cụ tìm kiếm tin nhắn để tìm các email cụ thể: "Tìm tất cả email từ john@example.com trong 30 ngày qua có tệp đính kèm." Hơn 15 tham số tìm kiếm làm cho điều này trở nên mạnh mẽ. *(Yêu cầu thông tin đăng nhập bí danh.)*

### 12. Tổ chức thư mục {#folder-organization}

Yêu cầu AI của bạn tạo cấu trúc thư mục cho một dự án mới, di chuyển tin nhắn giữa các thư mục hoặc dọn dẹp các thư mục cũ mà bạn không còn cần nữa. *(Yêu cầu thông tin đăng nhập bí danh.)*

### 13. Xoay vòng mật khẩu {#password-rotation}

Tạo mật khẩu bí danh mới theo lịch trình. Yêu cầu AI của bạn tạo mật khẩu mới cho mỗi bí danh và báo cáo thông tin đăng nhập mới.

### 14. Mã hóa bản ghi DNS {#dns-record-encryption}

Mã hóa các bản ghi chuyển tiếp của bạn trước khi thêm chúng vào DNS. Công cụ `encryptRecord` xử lý việc này mà không cần xác thực — hữu ích cho việc mã hóa một lần nhanh chóng.

### 15. Phân tích nhật ký gửi {#delivery-log-analysis}

Tải xuống nhật ký gửi email của bạn và yêu cầu AI phân tích tỷ lệ trả lại, xác định người nhận có vấn đề hoặc theo dõi thời gian gửi.

### 16. Quản lý đa tên miền {#multi-domain-management}

Nếu bạn quản lý nhiều tên miền, hãy yêu cầu AI cung cấp cho bạn báo cáo trạng thái: tên miền nào đã được xác minh, tên miền nào có vấn đề, mỗi tên miền có bao nhiêu bí danh và giới hạn gửi trông như thế nào.

### 17. Cấu hình Catch-All {#catch-all-configuration}

Thiết lập mật khẩu catch-all cho các tên miền cần nhận email tại bất kỳ địa chỉ nào. AI có thể tạo, liệt kê và quản lý các mật khẩu này cho bạn.

### 18. Quản lý lời mời tên miền {#domain-invite-management}

Mời thành viên nhóm quản lý tên miền, kiểm tra lời mời đang chờ xử lý và dọn dẹp những lời mời đã hết hạn. Hữu ích cho các tổ chức có nhiều quản trị viên tên miền.

### 19. Kiểm tra lưu trữ S3 {#s3-storage-testing}

Nếu bạn sử dụng lưu trữ S3 tùy chỉnh để sao lưu email, hãy yêu cầu AI kiểm tra kết nối và xác minh nó hoạt động đúng cách.

### 20. Soạn thảo email nháp {#email-draft-composition}

Tạo email nháp trong hộp thư của bạn mà không gửi chúng. Hữu ích để chuẩn bị email cần xem xét trước khi gửi hoặc để xây dựng các mẫu email. *(Yêu cầu thông tin đăng nhập bí danh.)*


## Ví dụ về lời nhắc {#example-prompts}

Dưới đây là các lời nhắc bạn có thể sử dụng trực tiếp với trợ lý AI của mình:

**Gửi email:**
> "Gửi email từ hello@mydomain.com đến john@example.com với chủ đề 'Cuộc họp ngày mai' và nội dung 'Chào John, chúng ta vẫn sẽ gặp nhau lúc 2 giờ chiều chứ?'"

**Quản lý tên miền:**
> "Liệt kê tất cả các tên miền của tôi và cho tôi biết những tên miền nào có bản ghi DNS chưa được xác minh."

**Tạo bí danh:**
> "Tạo một bí danh mới support@mydomain.com chuyển tiếp đến email cá nhân của tôi."

**Tìm kiếm hộp thư đến (yêu cầu thông tin đăng nhập bí danh):**
> "Tìm tất cả các email chưa đọc trong tuần trước có đề cập đến 'hóa đơn'."

**Lịch (yêu cầu thông tin đăng nhập bí danh):**
> "Tạo một lịch có tên 'Công việc' và thêm một cuộc họp vào ngày mai lúc 2 giờ chiều có tên 'Họp nhóm'."

**Tập lệnh Sieve:**
> "Viết một tập lệnh Sieve cho info@mydomain.com tự động trả lời email với 'Cảm ơn bạn đã liên hệ, chúng tôi sẽ trả lời bạn trong vòng 24 giờ.'"

**Thao tác hàng loạt:**
> "Tạo bí danh cho sales@, support@, billing@ và info@ trên mydomain.com, tất cả đều chuyển tiếp đến team@mydomain.com."

**Kiểm tra bảo mật:**
> "Kiểm tra trạng thái xác minh DNS và SMTP cho tất cả các tên miền của tôi và cho tôi biết nếu có bất kỳ điều gì cần chú ý."

**Tạo mật khẩu bí danh:**
> "Tạo mật khẩu cho bí danh user@example.com để tôi có thể truy cập hộp thư đến của mình."


## Biến môi trường {#environment-variables}

| Biến | Bắt buộc | Mặc định | Mô tả |
|----------|----------|---------|-------------|
| `FORWARD_EMAIL_API_KEY` | Có | — | Khóa API Forward Email của bạn (được sử dụng làm tên người dùng xác thực Basic cho các điểm cuối khóa API) |
| `FORWARD_EMAIL_ALIAS_USER` | Không | — | Địa chỉ email bí danh cho các điểm cuối hộp thư (ví dụ: `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Không | — | Mật khẩu bí danh được tạo cho các điểm cuối hộp thư |
| `FORWARD_EMAIL_API_URL` | Không | `https://api.forwardemail.net` | URL cơ sở API (cho máy chủ tự lưu trữ hoặc thử nghiệm) |


## Bảo mật {#security}

Máy chủ MCP chạy cục bộ trên máy của bạn. Đây là cách hoạt động của bảo mật:

* **Thông tin đăng nhập của bạn vẫn ở cục bộ.** Cả khóa API và thông tin đăng nhập bí danh của bạn đều được đọc từ các biến môi trường và được sử dụng để xác thực các yêu cầu API thông qua xác thực HTTP Basic. Chúng không bao giờ được gửi đến mô hình AI.
* **Giao thức stdio.** Máy chủ giao tiếp với máy khách AI qua stdin/stdout. Không có cổng mạng nào được mở.
* **Không lưu trữ dữ liệu.** Máy chủ không trạng thái. Nó không lưu trữ, ghi nhật ký hoặc lưu trữ bất kỳ dữ liệu email nào của bạn.
* **Mã nguồn mở.** Toàn bộ mã nguồn có trên [GitHub](https://github.com/forwardemail/mcp-server). Bạn có thể kiểm tra từng dòng.


## Sử dụng theo chương trình {#programmatic-usage}

Bạn cũng có thể sử dụng máy chủ như một thư viện:

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## Mã nguồn mở {#open-source}

Máy chủ MCP của Forward Email là [mã nguồn mở trên GitHub](https://github.com/forwardemail/mcp-server) theo giấy phép BUSL-1.1. Chúng tôi tin vào sự minh bạch. Nếu bạn tìm thấy lỗi hoặc muốn có một tính năng, hãy [mở một vấn đề](https://github.com/forwardemail/mcp-server/issues).

