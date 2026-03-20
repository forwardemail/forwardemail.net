# Forward Email MCP Server {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>Tóm tắt:</strong> <a href="https://github.com/forwardemail/mcp-server">Máy chủ MCP mã nguồn mở</a> của chúng tôi cho phép các trợ lý AI như Claude, ChatGPT, Cursor và Windsurf quản lý email, tên miền, bí danh, danh bạ và lịch của bạn thông qua ngôn ngữ tự nhiên. Tất cả 68 điểm cuối API đều được cung cấp dưới dạng công cụ MCP. Nó chạy cục bộ qua <code>npx @forwardemail/mcp-server</code> — thông tin đăng nhập của bạn không bao giờ rời khỏi máy của bạn.
</p>


## Mục lục {#table-of-contents}

* [MCP là gì?](#what-is-mcp)
* [Bắt đầu nhanh](#quick-start)
  * [Lấy khóa API](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Các khách hàng MCP khác](#other-mcp-clients)
* [Xác thực](#authentication)
  * [Xác thực khóa API](#api-key-auth)
  * [Xác thực bí danh](#alias-auth)
  * [Tạo mật khẩu bí danh](#generating-an-alias-password)
* [Tất cả 68 công cụ](#all-68-tools)
  * [Tài khoản (Xác thực khóa API hoặc bí danh)](#account-api-key-or-alias-auth)
  * [Tên miền (Khóa API)](#domains-api-key)
  * [Bí danh (Khóa API)](#aliases-api-key)
  * [Email — SMTP gửi đi (Khóa API; Gửi hỗ trợ cả hai)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Tin nhắn — IMAP (Xác thực bí danh)](#messages--imap-alias-auth)
  * [Thư mục — IMAP (Xác thực bí danh)](#folders--imap-alias-auth)
  * [Danh bạ — CardDAV (Xác thực bí danh)](#contacts--carddav-alias-auth)
  * [Lịch — CalDAV (Xác thực bí danh)](#calendars--caldav-alias-auth)
  * [Sự kiện lịch — CalDAV (Xác thực bí danh)](#calendar-events--caldav-alias-auth)
  * [Kịch bản Sieve (Khóa API)](#sieve-scripts-api-key)
  * [Kịch bản Sieve (Xác thực bí danh)](#sieve-scripts-alias-auth)
  * [Thành viên và lời mời tên miền (Khóa API)](#domain-members-and-invites-api-key)
  * [Mật khẩu Catch-All (Khóa API)](#catch-all-passwords-api-key)
  * [Nhật ký (Khóa API)](#logs-api-key)
  * [Mã hóa (Không xác thực)](#encrypt-no-auth)
* [20 trường hợp sử dụng thực tế](#20-real-world-use-cases)
  * [1. Phân loại email](#1-email-triage)
  * [2. Tự động thiết lập tên miền](#2-domain-setup-automation)
  * [3. Quản lý bí danh hàng loạt](#3-bulk-alias-management)
  * [4. Giám sát chiến dịch email](#4-email-campaign-monitoring)
  * [5. Đồng bộ và dọn dẹp danh bạ](#5-contact-sync-and-cleanup)
  * [6. Quản lý lịch](#6-calendar-management)
  * [7. Tự động hóa kịch bản Sieve](#7-sieve-script-automation)
  * [8. Đưa đội nhóm vào làm việc](#8-team-onboarding)
  * [9. Kiểm tra bảo mật](#9-security-auditing)
  * [10. Thiết lập chuyển tiếp email](#10-email-forwarding-setup)
  * [11. Tìm kiếm và phân tích hộp thư đến](#11-inbox-search-and-analysis)
  * [12. Tổ chức thư mục](#12-folder-organization)
  * [13. Xoay vòng mật khẩu](#13-password-rotation)
  * [14. Mã hóa bản ghi DNS](#14-dns-record-encryption)
  * [15. Phân tích nhật ký giao hàng](#15-delivery-log-analysis)
  * [16. Quản lý đa tên miền](#16-multi-domain-management)
  * [17. Cấu hình Catch-All](#17-catch-all-configuration)
  * [18. Quản lý lời mời tên miền](#18-domain-invite-management)
  * [19. Kiểm tra lưu trữ S3](#19-s3-storage-testing)
  * [20. Soạn thảo email](#20-email-draft-composition)
* [Ví dụ về lời nhắc](#example-prompts)
* [Biến môi trường](#environment-variables)
* [Bảo mật](#security)
* [Sử dụng lập trình](#programmatic-usage)
* [Mã nguồn mở](#open-source)


## MCP là gì? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) là một tiêu chuẩn mở được tạo ra bởi Anthropic cho phép các mô hình AI gọi các công cụ bên ngoài một cách an toàn. Thay vì sao chép-dán phản hồi API vào cửa sổ trò chuyện, MCP cung cấp cho mô hình quyền truy cập trực tiếp, có cấu trúc vào các dịch vụ của bạn.

Máy chủ MCP của chúng tôi bao bọc toàn bộ [Forward Email API](/email-api) — mọi điểm cuối, mọi tham số — và cung cấp chúng dưới dạng các công cụ mà bất kỳ khách hàng tương thích MCP nào cũng có thể sử dụng. Máy chủ chạy cục bộ trên máy của bạn sử dụng giao thức stdio. Thông tin đăng nhập của bạn được giữ trong biến môi trường và không bao giờ được gửi đến mô hình AI.


## Bắt đầu nhanh {#quick-start}

### Lấy khóa API {#get-an-api-key}
1. Đăng nhập vào [tài khoản Forward Email của bạn](/my-account/domains).
2. Vào **Tài Khoản Của Tôi** → **Bảo Mật** → **Khóa API**.
3. Tạo một khóa API mới và sao chép nó.

### Claude Desktop {#claude-desktop}

Thêm đoạn này vào tệp cấu hình Claude Desktop của bạn:

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

Mở Cài đặt Cursor → MCP → Thêm Máy chủ:

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

Mở Cài đặt Windsurf → MCP → Thêm Máy chủ với cấu hình giống như trên.

### Các Khách Hàng MCP Khác {#other-mcp-clients}

Bất kỳ khách hàng nào hỗ trợ giao thức MCP stdio đều hoạt động. Lệnh là:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Xác thực {#authentication}

API Forward Email sử dụng **xác thực HTTP Basic** với hai loại thông tin đăng nhập khác nhau tùy theo điểm cuối. Máy chủ MCP xử lý việc này tự động — bạn chỉ cần cung cấp thông tin đăng nhập đúng.

### Xác thực Khóa API {#api-key-auth}

Hầu hết các điểm cuối quản lý (tên miền, bí danh, email gửi đi, nhật ký) sử dụng **khóa API** của bạn làm tên đăng nhập Basic auth với mật khẩu để trống.

Đây là cùng một khóa API bạn dùng cho REST API. Thiết lập nó qua biến môi trường `FORWARD_EMAIL_API_KEY`.

### Xác thực Bí danh {#alias-auth}

Các điểm cuối hộp thư (tin nhắn, thư mục, danh bạ, lịch, kịch bản sieve theo bí danh) sử dụng **thông tin đăng nhập bí danh** — địa chỉ email bí danh làm tên đăng nhập và mật khẩu được tạo làm mật khẩu.

Các điểm cuối này truy cập dữ liệu theo từng bí danh qua các giao thức IMAP, CalDAV và CardDAV. Chúng yêu cầu email bí danh và mật khẩu được tạo, không phải khóa API.

Bạn có thể cung cấp thông tin đăng nhập bí danh theo hai cách:

1. **Biến môi trường** (khuyến nghị cho bí danh mặc định): Thiết lập `FORWARD_EMAIL_ALIAS_USER` và `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Tham số gọi từng công cụ**: Truyền `alias_username` và `alias_password` làm đối số cho bất kỳ công cụ xác thực bí danh nào. Chúng sẽ ghi đè biến môi trường, hữu ích khi làm việc với nhiều bí danh.

### Tạo Mật khẩu Bí danh {#generating-an-alias-password}

Trước khi sử dụng các công cụ xác thực bí danh, bạn cần tạo mật khẩu cho bí danh. Bạn có thể làm điều này bằng công cụ `generateAliasPassword` hoặc qua API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

Phản hồi bao gồm các trường `username` (email bí danh) và `password`. Sử dụng chúng làm thông tin đăng nhập bí danh của bạn.

> **Mẹo:** Bạn cũng có thể hỏi trợ lý AI của mình: *"Tạo mật khẩu cho bí danh <user@example.com> trên tên miền example.com"* — nó sẽ gọi công cụ `generateAliasPassword` và trả về thông tin đăng nhập.

Bảng dưới đây tóm tắt phương thức xác thực mà mỗi nhóm công cụ yêu cầu:

| Nhóm Công Cụ                                                  | Phương Thức Xác Thực      | Thông Tin Đăng Nhập                                        |
| ------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------- |
| Tài khoản                                                    | Khóa API **hoặc** Xác thực Bí danh | Cả hai                                                   |
| Tên miền, Bí danh, Thành viên tên miền, Lời mời, Mật khẩu Catch-All | Khóa API                   | `FORWARD_EMAIL_API_KEY`                                    |
| Email gửi đi (danh sách, lấy, xóa, giới hạn)                 | Khóa API                   | `FORWARD_EMAIL_API_KEY`                                    |
| Gửi Email                                                   | Khóa API **hoặc** Xác thực Bí danh | Cả hai                                                   |
| Tin nhắn (IMAP)                                              | Xác thực Bí danh           | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Thư mục (IMAP)                                               | Xác thực Bí danh           | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Danh bạ (CardDAV)                                           | Xác thực Bí danh           | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Lịch (CalDAV)                                               | Xác thực Bí danh           | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sự kiện Lịch (CalDAV)                                       | Xác thực Bí danh           | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kịch bản Sieve (theo tên miền)                              | Khóa API                   | `FORWARD_EMAIL_API_KEY`                                    |
| Kịch bản Sieve (theo bí danh)                               | Xác thực Bí danh           | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Nhật ký                                                     | Khóa API                   | `FORWARD_EMAIL_API_KEY`                                    |
| Mã hóa                                                      | Không                     | Không cần thông tin đăng nhập                               |
## Tất cả 68 Công cụ {#all-68-tools}

Mỗi công cụ tương ứng trực tiếp với một điểm cuối [Forward Email API](/email-api). Các tham số sử dụng cùng tên như trong tài liệu API. Phương thức xác thực được ghi chú trong tiêu đề mỗi phần.

### Tài khoản (Xác thực API Key hoặc Alias) {#account-api-key-or-alias-auth}

Với xác thực API key, các công cụ này trả về thông tin tài khoản người dùng của bạn. Với xác thực alias, chúng trả về thông tin alias/hộp thư bao gồm hạn mức lưu trữ và cài đặt.

| Công cụ          | Điểm cuối API       | Mô tả                         |
| --------------- | ------------------- | ----------------------------- |
| `getAccount`    | `GET /v1/account`   | Lấy thông tin tài khoản của bạn |
| `updateAccount` | `PUT /v1/account`   | Cập nhật cài đặt tài khoản của bạn |

### Tên miền (API Key) {#domains-api-key}

| Công cụ               | Điểm cuối API                                    | Mô tả                      |
| --------------------- | ------------------------------------------------ | -------------------------- |
| `listDomains`         | `GET /v1/domains`                                | Liệt kê tất cả tên miền của bạn |
| `createDomain`        | `POST /v1/domains`                               | Thêm tên miền mới           |
| `getDomain`           | `GET /v1/domains/:domain_id`                     | Lấy chi tiết tên miền       |
| `updateDomain`        | `PUT /v1/domains/:domain_id`                     | Cập nhật cài đặt tên miền   |
| `deleteDomain`        | `DELETE /v1/domains/:domain_id`                  | Xóa tên miền                |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records`      | Xác minh bản ghi DNS        |
| `verifySmtpRecords`   | `GET /v1/domains/:domain_id/verify-smtp`         | Xác minh cấu hình SMTP      |
| `testS3Connection`    | `POST /v1/domains/:domain_id/test-s3-connection` | Kiểm tra lưu trữ S3 tùy chỉnh |

### Alias (API Key) {#aliases-api-key}

| Công cụ                 | Điểm cuối API                                                     | Mô tả                                  |
| ----------------------- | ----------------------------------------------------------------- | -------------------------------------- |
| `listAliases`           | `GET /v1/domains/:domain_id/aliases`                              | Liệt kê alias cho một tên miền         |
| `createAlias`           | `POST /v1/domains/:domain_id/aliases`                             | Tạo alias mới                         |
| `getAlias`              | `GET /v1/domains/:domain_id/aliases/:alias_id`                    | Lấy chi tiết alias                    |
| `updateAlias`           | `PUT /v1/domains/:domain_id/aliases/:alias_id`                    | Cập nhật alias                        |
| `deleteAlias`           | `DELETE /v1/domains/:domain_id/aliases/:alias_id`                 | Xóa alias                            |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Tạo mật khẩu IMAP/SMTP cho xác thực alias |

### Email — SMTP gửi đi (API Key; Send hỗ trợ cả hai) {#emails--outbound-smtp-api-key-send-supports-both}

| Công cụ          | Điểm cuối API          | Xác thực               | Mô tả                         |
| --------------- | ---------------------- | ---------------------- | ----------------------------- |
| `sendEmail`     | `POST /v1/emails`      | API Key hoặc Alias Auth | Gửi email qua SMTP            |
| `listEmails`    | `GET /v1/emails`       | API Key                | Liệt kê email gửi đi          |
| `getEmail`      | `GET /v1/emails/:id`   | API Key                | Lấy chi tiết và trạng thái email |
| `deleteEmail`   | `DELETE /v1/emails/:id`| API Key                | Xóa email trong hàng đợi      |
| `getEmailLimit` | `GET /v1/emails/limit` | API Key                | Kiểm tra giới hạn gửi của bạn |

Công cụ `sendEmail` chấp nhận các tham số `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html`, và `attachments`. Đây là cùng điểm cuối với `POST /v1/emails`.

### Tin nhắn — IMAP (Xác thực Alias) {#messages--imap-alias-auth}

> **Yêu cầu thông tin đăng nhập alias.** Truyền `alias_username` và `alias_password` hoặc đặt biến môi trường `FORWARD_EMAIL_ALIAS_USER` và `FORWARD_EMAIL_ALIAS_PASSWORD`.
| Công cụ          | API Endpoint              | Mô tả                                |
| --------------- | ------------------------- | ------------------------------------- |
| `listMessages`  | `GET /v1/messages`        | Liệt kê và tìm kiếm tin nhắn trong hộp thư |
| `createMessage` | `POST /v1/messages`       | Tạo bản nháp hoặc tải lên một tin nhắn    |
| `getMessage`    | `GET /v1/messages/:id`    | Lấy tin nhắn theo ID                   |
| `updateMessage` | `PUT /v1/messages/:id`    | Cập nhật cờ (đã đọc, đánh dấu sao, v.v.)    |
| `deleteMessage` | `DELETE /v1/messages/:id` | Xóa một tin nhắn                      |

Công cụ `listMessages` hỗ trợ hơn 15 tham số tìm kiếm bao gồm `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread`, và `has_attachment`. Xem [API docs](/email-api) để biết danh sách đầy đủ.

### Thư mục — IMAP (Xác thực bí danh) {#folders--imap-alias-auth}

> **Yêu cầu thông tin đăng nhập bí danh.** Truyền `alias_username` và `alias_password` hoặc thiết lập biến môi trường `FORWARD_EMAIL_ALIAS_USER` và `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Công cụ         | API Endpoint             | Mô tả                   |
| -------------- | ------------------------ | ------------------------ |
| `listFolders`  | `GET /v1/folders`        | Liệt kê tất cả thư mục hộp thư |
| `createFolder` | `POST /v1/folders`       | Tạo thư mục mới          |
| `getFolder`    | `GET /v1/folders/:id`    | Lấy chi tiết thư mục     |
| `updateFolder` | `PUT /v1/folders/:id`    | Đổi tên thư mục          |
| `deleteFolder` | `DELETE /v1/folders/:id` | Xóa thư mục              |

### Danh bạ — CardDAV (Xác thực bí danh) {#contacts--carddav-alias-auth}

> **Yêu cầu thông tin đăng nhập bí danh.** Truyền `alias_username` và `alias_password` hoặc thiết lập biến môi trường `FORWARD_EMAIL_ALIAS_USER` và `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Công cụ          | API Endpoint              | Mô tả                 |
| --------------- | ------------------------- | --------------------- |
| `listContacts`  | `GET /v1/contacts`        | Liệt kê tất cả danh bạ |
| `createContact` | `POST /v1/contacts`       | Tạo danh bạ mới       |
| `getContact`    | `GET /v1/contacts/:id`    | Lấy chi tiết danh bạ  |
| `updateContact` | `PUT /v1/contacts/:id`    | Cập nhật danh bạ      |
| `deleteContact` | `DELETE /v1/contacts/:id` | Xóa danh bạ           |

### Lịch — CalDAV (Xác thực bí danh) {#calendars--caldav-alias-auth}

> **Yêu cầu thông tin đăng nhập bí danh.** Truyền `alias_username` và `alias_password` hoặc thiết lập biến môi trường `FORWARD_EMAIL_ALIAS_USER` và `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Công cụ           | API Endpoint               | Mô tả                  |
| ---------------- | -------------------------- | ---------------------- |
| `listCalendars`  | `GET /v1/calendars`        | Liệt kê tất cả lịch    |
| `createCalendar` | `POST /v1/calendars`       | Tạo lịch mới           |
| `getCalendar`    | `GET /v1/calendars/:id`    | Lấy chi tiết lịch      |
| `updateCalendar` | `PUT /v1/calendars/:id`    | Cập nhật lịch           |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Xóa lịch               |

### Sự kiện lịch — CalDAV (Xác thực bí danh) {#calendar-events--caldav-alias-auth}

> **Yêu cầu thông tin đăng nhập bí danh.** Truyền `alias_username` và `alias_password` hoặc thiết lập biến môi trường `FORWARD_EMAIL_ALIAS_USER` và `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Công cụ                | API Endpoint                     | Mô tả                |
| --------------------- | -------------------------------- | -------------------- |
| `listCalendarEvents`  | `GET /v1/calendar-events`        | Liệt kê tất cả sự kiện |
| `createCalendarEvent` | `POST /v1/calendar-events`       | Tạo sự kiện mới       |
| `getCalendarEvent`    | `GET /v1/calendar-events/:id`    | Lấy chi tiết sự kiện  |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id`    | Cập nhật sự kiện      |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Xóa sự kiện           |

### Kịch bản Sieve (Khóa API) {#sieve-scripts-api-key}

Những kịch bản này sử dụng đường dẫn theo phạm vi tên miền và xác thực bằng khóa API của bạn.

| Công cụ                | API Endpoint                                                              | Mô tả                      |
| --------------------- | ------------------------------------------------------------------------- | -------------------------- |
| `listSieveScripts`    | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                      | Liệt kê kịch bản cho bí danh |
| `createSieveScript`   | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                     | Tạo kịch bản mới           |
| `getSieveScript`      | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Lấy chi tiết kịch bản      |
| `updateSieveScript`   | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Cập nhật kịch bản          |
| `deleteSieveScript`   | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`        | Xóa kịch bản               |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Kích hoạt kịch bản         |
### Kịch bản Sieve (Xác thực Bí danh) {#sieve-scripts-alias-auth}

Chúng sử dụng xác thực cấp độ bí danh. Hữu ích cho tự động hóa theo từng bí danh mà không cần khóa API.

> **Yêu cầu thông tin đăng nhập bí danh.** Truyền `alias_username` và `alias_password` hoặc thiết lập biến môi trường `FORWARD_EMAIL_ALIAS_USER` và `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Công cụ                       | API Endpoint                                 | Mô tả               |
| ------------------------------ | -------------------------------------------- | -------------------- |
| `listSieveScriptsAliasAuth`    | `GET /v1/sieve-scripts`                      | Liệt kê các kịch bản |
| `createSieveScriptAliasAuth`   | `POST /v1/sieve-scripts`                     | Tạo một kịch bản     |
| `getSieveScriptAliasAuth`      | `GET /v1/sieve-scripts/:script_id`           | Lấy chi tiết kịch bản |
| `updateSieveScriptAliasAuth`   | `PUT /v1/sieve-scripts/:script_id`           | Cập nhật một kịch bản |
| `deleteSieveScriptAliasAuth`   | `DELETE /v1/sieve-scripts/:script_id`        | Xóa một kịch bản     |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Kích hoạt một kịch bản |

### Thành viên và Lời mời Miền (Khóa API) {#domain-members-and-invites-api-key}

| Công cụ               | API Endpoint                                       | Mô tả                      |
| -------------------- | -------------------------------------------------- | -------------------------- |
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id`    | Thay đổi vai trò thành viên |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | Xóa thành viên             |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites`               | Chấp nhận lời mời đang chờ |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites`              | Mời ai đó vào miền         |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites`            | Thu hồi lời mời            |

### Mật khẩu Catch-All (Khóa API) {#catch-all-passwords-api-key}

| Công cụ                   | API Endpoint                                                  | Mô tả                      |
| ------------------------ | ------------------------------------------------------------- | -------------------------- |
| `listCatchAllPasswords`  | `GET /v1/domains/:domain_id/catch-all-passwords`              | Liệt kê mật khẩu catch-all |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords`             | Tạo mật khẩu catch-all     |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Xóa mật khẩu catch-all     |

### Nhật ký (Khóa API) {#logs-api-key}

| Công cụ           | API Endpoint            | Mô tả                        |
| -------------- | ----------------------- | ---------------------------- |
| `downloadLogs` | `GET /v1/logs/download` | Tải xuống nhật ký giao nhận email |

### Mã hóa (Không Xác thực) {#encrypt-no-auth}

| Công cụ          | API Endpoint       | Mô tả                      |
| --------------- | ------------------ | -------------------------- |
| `encryptRecord` | `POST /v1/encrypt` | Mã hóa bản ghi DNS TXT     |

Công cụ này không yêu cầu xác thực. Nó mã hóa các bản ghi chuyển tiếp như `forward-email=user@example.com` để sử dụng trong bản ghi DNS TXT.


## 20 Trường hợp Sử dụng Thực tế {#20-real-world-use-cases}

Dưới đây là các cách thực tế để sử dụng máy chủ MCP với trợ lý AI của bạn:

### 1. Phân loại Email {#1-email-triage}

Yêu cầu AI quét hộp thư đến của bạn và tóm tắt các tin nhắn chưa đọc. Nó có thể đánh dấu email khẩn cấp, phân loại theo người gửi và soạn thảo trả lời — tất cả bằng ngôn ngữ tự nhiên. *(Yêu cầu thông tin đăng nhập bí danh để truy cập hộp thư.)*

### 2. Tự động Thiết lập Miền {#2-domain-setup-automation}

Đang thiết lập một miền mới? Yêu cầu AI tạo miền, thêm các bí danh của bạn, xác minh bản ghi DNS và kiểm tra cấu hình SMTP. Những việc thường mất 10 phút nhấp chuột qua các bảng điều khiển giờ chỉ còn một cuộc trò chuyện.

### 3. Quản lý Bí danh Số lượng lớn {#3-bulk-alias-management}

Cần tạo 20 bí danh cho một dự án mới? Mô tả nhu cầu của bạn và để AI xử lý công việc lặp đi lặp lại. Nó có thể tạo bí danh, thiết lập quy tắc chuyển tiếp và tạo mật khẩu trong một lần thực hiện.
### 4. Giám sát Chiến dịch Email {#4-email-campaign-monitoring}

Yêu cầu AI của bạn kiểm tra giới hạn gửi, liệt kê các email gửi đi gần đây và báo cáo trạng thái giao hàng. Hữu ích để giám sát sức khỏe email giao dịch.

### 5. Đồng bộ và Dọn dẹp Danh bạ {#5-contact-sync-and-cleanup}

Sử dụng công cụ CardDAV để liệt kê tất cả danh bạ, tìm các bản sao, cập nhật thông tin lỗi thời hoặc tạo hàng loạt danh bạ từ bảng tính bạn dán vào trò chuyện. *(Yêu cầu thông tin đăng nhập alias.)*

### 6. Quản lý Lịch {#6-calendar-management}

Tạo lịch, thêm sự kiện, cập nhật thời gian họp và xóa các sự kiện đã hủy — tất cả qua cuộc trò chuyện. Công cụ CalDAV hỗ trợ CRUD đầy đủ trên cả lịch và sự kiện. *(Yêu cầu thông tin đăng nhập alias.)*

### 7. Tự động hóa Kịch bản Sieve {#7-sieve-script-automation}

Kịch bản Sieve rất mạnh mẽ nhưng cú pháp khó hiểu. Hãy yêu cầu AI viết kịch bản Sieve cho bạn: "Lọc tất cả email từ <billing@example.com> vào thư mục Billing" sẽ trở thành một kịch bản hoạt động mà không cần chạm vào đặc tả RFC 5228.

### 8. Đưa Thành viên Vào Nhóm {#8-team-onboarding}

Khi một thành viên mới gia nhập, yêu cầu AI tạo alias cho họ, tạo mật khẩu, gửi email chào mừng kèm thông tin đăng nhập và thêm họ làm thành viên miền. Một lệnh, bốn cuộc gọi API.

### 9. Kiểm tra Bảo mật {#9-security-auditing}

Yêu cầu AI liệt kê tất cả các miền, kiểm tra trạng thái xác minh DNS, xem lại cấu hình alias và xác định các miền có bản ghi chưa được xác minh. Một cuộc quét bảo mật nhanh bằng ngôn ngữ tự nhiên.

### 10. Cài đặt Chuyển tiếp Email {#10-email-forwarding-setup}

Thiết lập chuyển tiếp email cho miền mới? Yêu cầu AI tạo miền, thêm alias chuyển tiếp, mã hóa bản ghi DNS và xác minh mọi thứ được cấu hình đúng.

### 11. Tìm kiếm và Phân tích Hộp thư {#11-inbox-search-and-analysis}

Sử dụng công cụ tìm kiếm tin nhắn để tìm email cụ thể: "Tìm tất cả email từ <john@example.com> trong 30 ngày qua có tệp đính kèm." Hơn 15 tham số tìm kiếm làm cho công cụ này rất mạnh mẽ. *(Yêu cầu thông tin đăng nhập alias.)*

### 12. Tổ chức Thư mục {#12-folder-organization}

Yêu cầu AI tạo cấu trúc thư mục cho dự án mới, di chuyển tin nhắn giữa các thư mục hoặc dọn dẹp các thư mục cũ bạn không còn cần nữa. *(Yêu cầu thông tin đăng nhập alias.)*

### 13. Thay đổi Mật khẩu {#13-password-rotation}

Tạo mật khẩu alias mới theo lịch trình. Yêu cầu AI tạo mật khẩu mới cho mỗi alias và báo cáo thông tin đăng nhập mới.

### 14. Mã hóa Bản ghi DNS {#14-dns-record-encryption}

Mã hóa các bản ghi chuyển tiếp trước khi thêm vào DNS. Công cụ `encryptRecord` xử lý việc này mà không cần xác thực — hữu ích cho việc mã hóa nhanh một lần.

### 15. Phân tích Nhật ký Giao hàng {#15-delivery-log-analysis}

Tải xuống nhật ký giao hàng email và yêu cầu AI phân tích tỷ lệ trả lại, xác định người nhận có vấn đề hoặc theo dõi thời gian giao hàng.

### 16. Quản lý Nhiều Miền {#16-multi-domain-management}

Nếu bạn quản lý nhiều miền, yêu cầu AI cung cấp báo cáo trạng thái: miền nào đã được xác minh, miền nào có vấn đề, mỗi miền có bao nhiêu alias và giới hạn gửi như thế nào.

### 17. Cấu hình Catch-All {#17-catch-all-configuration}

Thiết lập mật khẩu catch-all cho các miền cần nhận email ở bất kỳ địa chỉ nào. AI có thể tạo, liệt kê và quản lý các mật khẩu này cho bạn.

### 18. Quản lý Lời mời Miền {#18-domain-invite-management}

Mời thành viên nhóm quản lý miền, kiểm tra lời mời đang chờ và dọn dẹp các lời mời hết hạn. Hữu ích cho các tổ chức có nhiều quản trị viên miền.

### 19. Kiểm tra Lưu trữ S3 {#19-s3-storage-testing}

Nếu bạn sử dụng lưu trữ S3 tùy chỉnh cho sao lưu email, yêu cầu AI kiểm tra kết nối và xác minh nó hoạt động đúng.

### 20. Soạn thảo Email {#20-email-draft-composition}

Tạo bản nháp email trong hộp thư của bạn mà không gửi đi. Hữu ích để chuẩn bị email cần xem xét trước khi gửi hoặc để xây dựng mẫu email. *(Yêu cầu thông tin đăng nhập alias.)*


## Ví dụ Lệnh {#example-prompts}

Dưới đây là các lệnh bạn có thể sử dụng trực tiếp với trợ lý AI của mình:

**Gửi email:**

> "Gửi email từ <hello@mydomain.com> đến <john@example.com> với chủ đề 'Cuộc họp ngày mai' và nội dung 'Chào John, chúng ta vẫn họp lúc 2 giờ chiều chứ?'"
**Quản lý tên miền:**

> "Liệt kê tất cả các tên miền của tôi và cho tôi biết tên miền nào có bản ghi DNS chưa được xác minh."

**Tạo bí danh:**

> "Tạo một bí danh mới <support@mydomain.com> chuyển tiếp đến email cá nhân của tôi."

**Tìm kiếm hộp thư đến (yêu cầu thông tin đăng nhập bí danh):**

> "Tìm tất cả email chưa đọc trong tuần qua có đề cập đến 'invoice'."

**Lịch (yêu cầu thông tin đăng nhập bí danh):**

> "Tạo một lịch có tên 'Work' và thêm một cuộc họp vào ngày mai lúc 2 giờ chiều có tên 'Team Standup'."

**Kịch bản Sieve:**

> "Viết một kịch bản Sieve cho <info@mydomain.com> tự động trả lời email với nội dung 'Cảm ơn bạn đã liên hệ, chúng tôi sẽ phản hồi trong vòng 24 giờ.'"

**Thao tác hàng loạt:**

> "Tạo các bí danh cho sales@, support@, billing@, và info@ trên mydomain.com, tất cả chuyển tiếp đến <team@mydomain.com>."

**Kiểm tra bảo mật:**

> "Kiểm tra trạng thái xác minh DNS và SMTP cho tất cả các tên miền của tôi và cho tôi biết nếu có điều gì cần chú ý."

**Tạo mật khẩu bí danh:**

> "Tạo mật khẩu cho bí danh <user@example.com> để tôi có thể truy cập hộp thư đến của mình."


## Biến môi trường {#environment-variables}

| Biến                          | Bắt buộc | Mặc định                      | Mô tả                                                                          |
| ------------------------------ | -------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `FORWARD_EMAIL_API_KEY`        | Có       | —                              | Khóa API Forward Email của bạn (dùng làm tên đăng nhập Basic auth cho các điểm cuối API-key) |
| `FORWARD_EMAIL_ALIAS_USER`     | Không    | —                              | Địa chỉ email bí danh cho các điểm cuối hộp thư (ví dụ `user@example.com`)     |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Không    | —                              | Mật khẩu bí danh được tạo cho các điểm cuối hộp thư                            |
| `FORWARD_EMAIL_API_URL`        | Không    | `https://api.forwardemail.net` | URL cơ sở API (cho tự lưu trữ hoặc thử nghiệm)                                |


## Bảo mật {#security}

Máy chủ MCP chạy cục bộ trên máy của bạn. Đây là cách bảo mật hoạt động:

* **Thông tin đăng nhập của bạn được giữ cục bộ.** Cả khóa API và thông tin đăng nhập bí danh của bạn được đọc từ biến môi trường và dùng để xác thực các yêu cầu API qua HTTP Basic auth. Chúng không bao giờ được gửi đến mô hình AI.
* **Giao tiếp stdio.** Máy chủ giao tiếp với client AI qua stdin/stdout. Không mở bất kỳ cổng mạng nào.
* **Không lưu trữ dữ liệu.** Máy chủ không trạng thái. Nó không lưu bộ nhớ đệm, ghi nhật ký hay lưu trữ bất kỳ dữ liệu email nào của bạn.
* **Mã nguồn mở.** Toàn bộ mã nguồn có trên [GitHub](https://github.com/forwardemail/mcp-server). Bạn có thể kiểm tra từng dòng mã.


## Sử dụng lập trình {#programmatic-usage}

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

Forward Email MCP Server là [mã nguồn mở trên GitHub](https://github.com/forwardemail/mcp-server) theo giấy phép BUSL-1.1. Chúng tôi tin vào sự minh bạch. Nếu bạn phát hiện lỗi hoặc muốn một tính năng, [mở một issue](https://github.com/forwardemail/mcp-server/issues).
