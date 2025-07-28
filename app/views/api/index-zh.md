# 电子邮件 API {#email-api}

## 目录 {#table-of-contents}

* [图书馆](#libraries)
* [基本 URI](#base-uri)
* [验证](#authentication)
* [错误](#errors)
* [本土化](#localization)
* [分页](#pagination)
* [日志](#logs)
  * [检索日志](#retrieve-logs)
* [帐户](#account)
  * [创建账户](#create-account)
  * [找回账户](#retrieve-account)
  * [更新帐户](#update-account)
* [别名联系人 (CardDAV)](#alias-contacts-carddav)
  * [列出联系人](#list-contacts)
  * [创建联系人](#create-contact)
  * [检索联系人](#retrieve-contact)
  * [更新联系方式](#update-contact)
  * [删除联系人](#delete-contact)
* [别名日历（CalDAV）](#alias-calendars-caldav)
  * [列出日历](#list-calendars)
  * [创建日历](#create-calendar)
  * [检索日历](#retrieve-calendar)
  * [更新日历](#update-calendar)
  * [删除日历](#delete-calendar)
* [别名邮件（IMAP/POP3）](#alias-messages-imappop3)
  * [列出并搜索消息](#list-and-search-for-messages)
  * [创建消息](#create-message)
  * [检索消息](#retrieve-message)
  * [更新消息](#update-message)
  * [删除消息](#delete-message)
* [别名文件夹 (IMAP/POP3)](#alias-folders-imappop3)
  * [列出文件夹](#list-folders)
  * [创建文件夹](#create-folder)
  * [检索文件夹](#retrieve-folder)
  * [更新文件夹](#update-folder)
  * [删除文件夹](#delete-folder)
  * [复制文件夹](#copy-folder)
* [出站电子邮件](#outbound-emails)
  * [获取出站 SMTP 电子邮件限制](#get-outbound-smtp-email-limit)
  * [列出出站 SMTP 电子邮件](#list-outbound-smtp-emails)
  * [创建出站 SMTP 电子邮件](#create-outbound-smtp-email)
  * [检索出站 SMTP 电子邮件](#retrieve-outbound-smtp-email)
  * [删除出站 SMTP 电子邮件](#delete-outbound-smtp-email)
* [域](#domains)
  * [列出域名](#list-domains)
  * [创建域](#create-domain)
  * [检索域名](#retrieve-domain)
  * [验证域名记录](#verify-domain-records)
  * [验证域 SMTP 记录](#verify-domain-smtp-records)
  * [列出全域通用密码](#list-domain-wide-catch-all-passwords)
  * [创建域范围的万能密码](#create-domain-wide-catch-all-password)
  * [删除域范围内的万能密码](#remove-domain-wide-catch-all-password)
  * [更新域](#update-domain)
  * [删除域名](#delete-domain)
* [邀请](#invites)
  * [接受域名邀请](#accept-domain-invite)
  * [创建域名邀请](#create-domain-invite)
  * [删除域名邀请](#remove-domain-invite)
* [成员](#members)
  * [更新域成员](#update-domain-member)
  * [删除域成员](#remove-domain-member)
* [别名](#aliases)
  * [生成别名密码](#generate-an-alias-password)
  * [列出域别名](#list-domain-aliases)
  * [创建新的域别名](#create-new-domain-alias)
  * [检索域别名](#retrieve-domain-alias)
  * [更新域别名](#update-domain-alias)
  * [删除域别名](#delete-domain-alias)
* [加密](#encrypt)
  * [加密 TXT 记录](#encrypt-txt-record)

## 库 {#libraries}

目前我们尚未发布任何 API 封装器，但计划在不久的将来发布。如果您希望在特定编程语言的 API 封装器发布时收到通知，请发送电子邮件至 <api@forwardemail.net>。目前，您可以在应用中使用这些推荐的 HTTP 请求库，或者像以下示例一样直接使用 [卷曲](https://stackoverflow.com/a/27442239/3586413)。

| 语言 | 图书馆 |
| ---------- | ---------------------------------------------------------------------- |
| 红宝石 | [Faraday](https://github.com/lostisland/faraday) |
| Python | [requests](https://github.com/psf/requests) |
| Java | [OkHttp](https://github.com/square/okhttp/) |
| PHP | [guzzle](https://github.com/guzzle/guzzle) |
| JavaScript | [superagent](https://github.com/ladjs/superagent)（我们是维护者） |
| Node.js | [superagent](https://github.com/ladjs/superagent)（我们是维护者） |
| 去 | [net/http](https://golang.org/pkg/net/http/) |
| .NET | [RestSharp](https://github.com/restsharp/RestSharp) |

## 基本 URI {#base-uri}

当前 HTTP 基本 URI 路径为：`BASE_URI`。

## 身份验证 {#authentication}

所有端点都要求将 [API 密钥](https://forwardemail.net/my-account/security) 设置为请求的 [基本授权](https://en.wikipedia.org/wiki/Basic_access_authentication) 标头的“用户名”值（使用 [生成的别名用户名和密码](/faq#do-you-support-receiving-email-with-imap) 的 [别名联系人](#alias-contacts)、[别名日历](#alias-calendars) 和 [别名邮箱](#alias-mailboxes) 除外）。

别担心——如果您不确定这是什么，下面会为您提供示例。

## 错误 {#errors}

如果发生任何错误，API 请求的响应主体将包含详细的错误消息。

| 代码 | 姓名 |
| ---- | --------------------- |
| 200 | OK |
| 400 | 错误的请求 |
| 401 | 未经授权 |
| 403 | 禁止 |
| 404 | 未找到 |
| 429 | 请求过多 |
| 500 | 内部服务器错误 |
| 501 | 未实施 |
| 502 | 坏网关 |
| 503 | 暂停服务 |
| 504 | 网关超时 |

> \[!TIP]
> If you receive a 5xx status code (which should not happen), then please contact us at <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> and we will help you to resolve your issue immediately.

## 本地化 {#localization}

我们的服务已翻译成超过 25 种不同的语言。所有 API 响应消息均会翻译为检测到的 API 请求用户的最新语言环境。您可以通过传递自定义 `Accept-Language` 标头来覆盖此设置。欢迎使用本页面底部的语言下拉菜单进行尝试。

## 分页 {#pagination}

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.

所有列出结果的 API 端点都支持分页。

只需提供查询字符串属性 `page`（以及可选的 `limit`）。

属性 `page` 应为大于或等于 `1` 的数字。如果您提供的是 `limit`（也是一个数字），则最小值为 `10`，最大值为 `50`（除非另有说明）。

| 查询字符串参数 | 必需的 | 类型 | 描述 |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page` | 不 | 数字 | 返回结果页。如果未指定，`page` 值将为 `1`。必须大于或等于 `1`。 |
| `limit` | 不 | 数字 | 每页返回的结果数。如果未指定，则默认为 `10`。必须大于或等于 `1`，且小于或等于 `50`。 |

为了确定是否有更多结果可用，我们提供了这些 HTTP 响应标头（您可以解析它们以便以编程方式进行分页）：

| HTTP 响应头 | 例子 | 描述 |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count` | `X-Page-Count: 3` | 可用的总页数。 |
| `X-Page-Current` | `X-Page-Current: 1` | 返回的当前结果页面（例如基于`page`查询字符串参数）。 |
| `X-Page-Size` | `X-Page-Size: 10` | 返回的页面结果总数（例如基于`limit`查询字符串参数和返回的实际结果）。 |
| `X-Item-Count` | `X-Item-Count: 30` | 所有页面上可用的项目总数。 |
| `Link` | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | 我们提供了一个 `Link` HTTP 响应标头，您可以按照示例所示进行解析。该标头是 [similar to GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers)（例如，如果值不相关或不可用，则不会提供所有值；例如，如果没有其他页面，则不会提供 `"next"`）。 |

> 示例请求：

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```

## 日志 {#logs}

### 检索日志 {#retrieve-logs}

我们的 API 允许您以编程方式下载您帐户的日志。向此端点提交请求后，系统会处理您帐户的所有日志，并在完成后以附件（[Gzip](https://en.wikipedia.org/wiki/Gzip) 压缩的 [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) 电子表格文件）的形式通过电子邮件发送给您。

您可以使用 [计划任务](https://en.wikipedia.org/wiki/Cron) 创建后台作业，或使用我们的 [Node.js 作业调度软件 Bree](https://github.com/breejs/bree) 随时接收日志。请注意，此端点每日限制 `10` 个请求。

附件是`email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz`的小写形式，电子邮件本身包含已检索日志的简要摘要。您也可以随时从[我的账户 → 日志](/my-account/logs)下载日志。

> `GET /v1/logs/download`

| 查询字符串参数 | 必需的 | 类型 | 描述 |
| --------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | 不 | 字符串 (FQDN) | 按完全限定域名 (FQDN) 过滤日志。如果不提供此参数，则系统将检索所有域中的所有日志。 |
| `q` | 不 | 细绳 | 通过电子邮件、域、别名、IP 地址或日期 (`M/Y`、`M/D/YY`、`M-D`、`M-D-YY` 或 `M.D.YY` 格式) 搜索日志。 |
| `bounce_category` | 不 | 细绳 | 按特定退回类别搜索日志（例如 `blocklist`）。 |
| `response_code` | 不 | 数字 | 通过特定的错误响应代码（例如 `421` 或 `550`）搜索日志。 |

> 示例请求：

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> 示例 Cron 作业（每天午夜）：

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

请注意，您可以使用诸如[Crontab.guru](https://crontab.guru/)之类的服务来验证您的 cron 作业表达式语法。

> 示例 Cron 作业（每天午夜 **并记录前一天的日志**）：

对于 MacOS：

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

对于 Linux 和 Ubuntu：

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

## 帐户 {#account}

### 创建帐户 {#create-account}

> `POST /v1/account`

| 身体参数 | 必需的 | 类型 | 描述 |
| -------------- | -------- | -------------- | ------------- |
| `email` | 是的 | 字符串（电子邮件） | 电子邮件 |
| `password` | 是的 | 细绳 | 密码 |

> 示例请求：

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### 检索帐户 {#retrieve-account}

> `GET /v1/account`

> 示例请求：

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### 更新帐户 {#update-account}

> `PUT /v1/account`

| 身体参数 | 必需的 | 类型 | 描述 |
| -------------- | -------- | -------------- | -------------------- |
| `email` | 不 | 字符串（电子邮件） | 电子邮件 |
| `given_name` | 不 | 细绳 | 名 |
| `family_name` | 不 | 细绳 | 姓 |
| `avatar_url` | 不 | 字符串（URL） | 头像图片链接 |

> 示例请求：

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

## 别名联系人 (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

### 列出联系人 {#list-contacts}

> `GET /v1/contacts`

**即将推出**

### 创建联系人 {#create-contact}

> `POST /v1/contacts`

**即将推出**

### 检索联系人 {#retrieve-contact}

> `GET /v1/contacts/:id`

**即将推出**

### 更新联系人 {#update-contact}

> `PUT /v1/contacts/:id`

**即将推出**

### 删除联系人 {#delete-contact}

> `DELETE /v1/contacts/:id`

**即将推出**

## 别名日历 (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

### 列出日历 {#list-calendars}

> `GET /v1/calendars`

**即将推出**

### 创建日历 {#create-calendar}

> `POST /v1/calendars`

**即将推出**

### 检索日历 {#retrieve-calendar}

> `GET /v1/calendars/:id`

**即将推出**

### 更新日历 {#update-calendar}

> `PUT /v1/calendars/:id`

**即将推出**

### 删除日历 {#delete-calendar}

> `DELETE /v1/calendars/:id`

**即将推出**

## 别名邮件 (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

请确保您已遵循域名的设置说明。

这些说明可以在我们的常见问题解答部分[你们支持使用 IMAP 接收电子邮件吗？](/faq#do-you-support-receiving-email-with-imap)中找到。

### 列出并搜索消息 {#list-and-search-for-messages}

> `GET /v1/messages`

**即将推出**

### 创建消息 {#create-message}

> \[!NOTE]
> This will **NOT** send an email – it will only simply add the message to your mailbox folder (e.g. this is similar to the IMAP `APPEND` command).  If you would like to send an email, then see [Create outbound SMTP email](#create-outbound-smtp-email) below.  After creating the outbound SMTP email, then you can append a copy of it using this endpoint to your alias' mailbox for storage purposes.

> `POST /v1/messages`

**即将推出**

### 检索消息 {#retrieve-message}

> `GET /v1/messages/:id`

**即将推出**

### 更新消息 {#update-message}

> `PUT /v1/messages/:id`

**即将推出**

### 删除消息 {#delete-message}

> `DELETE /v1/messages:id`

**即将推出**

## 别名文件夹 (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Folder endpoints with a folder's path <code>/v1/folders/:path</code> as their endpoint are interchangeable with a folder's ID <code>:id</code>. This means you can refer to the folder by either its <code>path</code> or <code>id</code> value.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

### 列出文件夹 {#list-folders}

> `GET /v1/folders`

**即将推出**

### 创建文件夹 {#create-folder}

> `POST /v1/folders`

**即将推出**

### 检索文件夹 {#retrieve-folder}

> `GET /v1/folders/:id`

**即将推出**

### 更新文件夹 {#update-folder}

> `PUT /v1/folders/:id`

**即将推出**

### 删除文件夹 {#delete-folder}

> `DELETE /v1/folders/:id`

**即将推出**

### 复制文件夹 {#copy-folder}

> `POST /v1/folders/:id/copy`

**即将推出**

## 出站电子邮件 {#outbound-emails}

请确保您已遵循域名的设置说明。

这些说明可在 [我的账户 → 域名 → 设置 → 出站 SMTP 配置](/my-account/domains) 找到。您需要确保已设置 DKIM、Return-Path 和 DMARC，以便使用您的域名发送出站 SMTP 邮件。

### 获取出站 SMTP 电子邮件限制 {#get-outbound-smtp-email-limit}

这是一个简单的端点，它返回一个 JSON 对象，其中包含每个帐户每天 SMTP 出站消息数量的 `count` 和 `limit`。

> `GET /v1/emails/limit`

> 示例请求：

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### 列出出站 SMTP 电子邮件 {#list-outbound-smtp-emails}

请注意，此端点不会返回电子邮件的`message`、`headers` 和`rejectedErrors` 的属性值。

要返回这些属性及其值，请使用带有电子邮件 ID 的 [检索电子邮件](#retrieve-email) 端点。

> `GET /v1/emails`

| 查询字符串参数 | 必需的 | 类型 | 描述 |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | 不 | 字符串（支持正则表达式） | 按元数据搜索电子邮件 |
| `domain` | 不 | 字符串（支持正则表达式） | 按域名搜索电子邮件 |
| `sort` | 不 | 细绳 | 按特定字段排序（以单个连字符 `-` 为前缀，按该字段的反向排序）。如果未设置，则默认为 `created_at`。 |
| `page` | 不 | 数字 | 请参阅[Pagination](#pagination)了解更多信息 |
| `limit` | 不 | 数字 | 请参阅[Pagination](#pagination)了解更多信息 |

> 示例请求：

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### 创建出站 SMTP 电子邮件 {#create-outbound-smtp-email}

我们用于创建电子邮件的 API 灵感源自 Nodemailer 的消息选项配置，并充分利用了它。以下所有正文参数请遵循 [Nodemailer 消息配置](https://nodemailer.com/message/) 的规范。

请注意，除了 `envelope` 和 `dkim`（因为我们会自动为您设置）之外，我们支持所有 Nodemailer 选项。出于安全考虑，我们会自动将 `disableFileAccess` 和 `disableUrlAccess` 选项设置为 `true`。

您应该将 `raw` 的单一选项与包含标题的原始完整电子邮件一起传递，或者传递下面的单独正文参数选项。

如果在邮件头中发现表情符号，此 API 端点会自动为您编码（例如，主题行 `Subject: 🤓 Hello` 会自动转换为 `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`）。我们的目标是打造一个对开发者极其友好且防伪的电子邮件 API。

> `POST /v1/emails`

| 身体参数 | 必需的 | 类型 | 描述 |
| ---------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from` | 不 | 字符串（电子邮件） | 发件人的电子邮件地址（必须作为域的别名存在）。 |
| `to` | 不 | 字符串或数组 | “收件人”标题的收件人逗号分隔列表或数组。 |
| `cc` | 不 | 字符串或数组 | “抄送”标头的收件人逗号分隔列表或数组。 |
| `bcc` | 不 | 字符串或数组 | “Bcc”标头的收件人的逗号分隔列表或数组。 |
| `subject` | 不 | 细绳 | 电子邮件的主题。 |
| `text` | 不 | 字符串或缓冲区 | 消息的纯文本版本。 |
| `html` | 不 | 字符串或缓冲区 | 消息的 HTML 版本。 |
| `attachments` | 不 | 大批 | 附件对象数组（参见[Nodemailer's common fields](https://nodemailer.com/message/#common-fields)）。 |
| `sender` | 不 | 细绳 | “发件人”标题的电子邮件地址（参见[Nodemailer's more advanced fields](https://nodemailer.com/message/#more-advanced-fields)）。 |
| `replyTo` | 不 | 细绳 | “回复”标题的电子邮件地址。 |
| `inReplyTo` | 不 | 细绳 | 该消息所回复的消息 ID。 |
| `references` | 不 | 字符串或数组 | 以空格分隔的列表或消息 ID 数组。 |
| `attachDataUrls` | 不 | 布尔值 | 如果是 `true`，则将消息 HTML 内容中的 `data:` 图像转换为嵌入附件。 |
| `watchHtml` | 不 | 细绳 | Apple Watch 特定的 HTML 版本消息（[according to the Nodemailer docs](https://nodemailer.com/message/#content-options])，最新的手表不需要设置此项）。 |
| `amp` | 不 | 细绳 | AMP4EMAIL 特定的 HTML 版本消息（参见 [Nodemailer's example](https://nodemailer.com/message/#amp-example)）。 |
| `icalEvent` | 不 | 目的 | 用作替代消息内容的 iCalendar 事件（参见 [Nodemailer's calendar events](https://nodemailer.com/message/calendar-events/)）。 |
| `alternatives` | 不 | 大批 | 备选消息内容数组（参见[Nodemailer's alternative content](https://nodemailer.com/message/alternatives/)）。 |
| `encoding` | 不 | 细绳 | 文本和 HTML 字符串的编码（默认为 `"utf-8"`，但也支持 `"hex"` 和 `"base64"` 编码值）。 |
| `raw` | 不 | 字符串或缓冲区 | 要使用的自定义生成的 RFC822 格式的消息（而不是由 Nodemailer 生成的消息 - 参见 [Nodemailer's custom source](https://nodemailer.com/message/custom-source/)）。 |
| `textEncoding` | 不 | 细绳 | 强制用于文本值的编码（`"quoted-printable"` 或 `"base64"`）。默认值为检测到的最接近的值（对于 ASCII，使用 `"quoted-printable"`）。 |
| `priority` | 不 | 细绳 | 电子邮件的优先级（可以是 `"high"`、`"normal"`（默认）或 `"low"`）。请注意，`"normal"` 值不会设置优先级标头（这是默认行为）。如果设置了 `"high"` 或 `"low"` 值，则 `X-Priority`、`X-MSMail-Priority` 和 `Importance` 标头将设置为 [will be set accordingly](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240)。 |
| `headers` | 不 | 对象或数组 | 要设置的附加标头字段的对象或数组（参见[Nodemailer's custom headers](https://nodemailer.com/message/custom-headers/)）。 |
| `messageId` | 不 | 细绳 | “Message-ID”标头的可选 Message-ID 值（如果未设置，将自动创建默认值 - 请注意该值应为 [adhere to the RFC2822 specification](https://stackoverflow.com/a/4031705)）。 |
| `date` | 不 | 字符串或日期 | 可选的日期值，如果解析后缺少日期标头，则将使用此值；否则，如果未设置，则将使用当前 UTC 字符串。日期标头不能比当前时间提前超过 30 天。 |
| `list` | 不 | 目的 | `List-*` 标头的可选对象（参见 [Nodemailer's list headers](https://nodemailer.com/message/list-headers/)）。 |

> 示例请求：

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> 示例请求：

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### 检索出站 SMTP 电子邮件 {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> 示例请求：

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### 删除出站 SMTP 电子邮件 {#delete-outbound-smtp-email}

当且仅当当前状态为 `"pending"`、`"queued"` 或 `"deferred"` 之一时，删除电子邮件会将状态设置为 `"rejected"`（并且随后不会在队列中处理该邮件）。我们可能会在电子邮件创建和/或发送 30 天后自动清除这些邮件，因此您应该在客户端、数据库或应用程序中保留一份已发送 SMTP 电子邮件的副本。如果需要，您可以在数据库中引用我们的电子邮件 ID 值，该值会从 [创建电子邮件](#create-email) 和 [检索电子邮件](#retrieve-email) 端点返回。

> `DELETE /v1/emails/:id`

> 示例请求：

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

## 域名 {#domains}

> \[!TIP]
> Domain endpoints with a domain's name <code>/v1/domains/:domain_name</code> as their endpoint are interchangeable with a domain's ID <code>:domain_id</code>. This means you can refer to the domain by either its <code>name</code> or <code>id</code> value.

### 列出域 {#list-domains}

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.  See [Pagination](#pagination) for more insight.

> `GET /v1/domains`

| 查询字符串参数 | 必需的 | 类型 | 描述 |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | 不 | 字符串（支持正则表达式） | 按名称搜索域名 |
| `name` | 不 | 字符串（支持正则表达式） | 按名称搜索域名 |
| `sort` | 不 | 细绳 | 按特定字段排序（以单个连字符 `-` 为前缀，按该字段的反向排序）。如果未设置，则默认为 `created_at`。 |
| `page` | 不 | 数字 | 请参阅[Pagination](#pagination)了解更多信息 |
| `limit` | 不 | 数字 | 请参阅[Pagination](#pagination)了解更多信息 |

> 示例请求：

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### 创建域名 {#create-domain}

> `POST /v1/domains`

| 身体参数 | 必需的 | 类型 | 描述 |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | 是的 | 字符串（FQDN 或 IP） | 完全限定域名（“FQDN”）或 IP 地址 |
| `team_domain` | 不 | 字符串（域 ID 或域名；FQDN） | 自动将此域分配给来自其他域的同一团队。这意味着来自此域的所有成员都将被分配为团队成员，并且 `plan` 也将自动设置为 `team`。如有必要，您可以将其设置为 `"none"` 以明确禁用此功能，但这不是必需的。 |
| `plan` | 不 | 字符串（可枚举） | 计划类型（必须是 `"free"`、`"enhanced_protection"` 或 `"team"`，默认为 `"free"` 或用户当前的付费计划（如果是）） |
| `catchall` | 不 | 字符串（分隔的电子邮件地址）或布尔值 | 创建默认的 catch-all 别名，默认为 `true`（如果是 `true`，则使用 API 用户的电子邮件地址作为收件人；如果是 `false`，则不会创建 catch-all）。如果传递的是字符串，则它是一个以分隔符分隔的收件人电子邮件地址列表（以换行符、空格和/或逗号分隔）。 |
| `has_adult_content_protection` | 不 | 布尔值 | 是否在此域上启用垃圾邮件扫描程序成人内容保护 |
| `has_phishing_protection` | 不 | 布尔值 | 是否在此域上启用垃圾邮件扫描程序钓鱼保护 |
| `has_executable_protection` | 不 | 布尔值 | 是否在此域上启用垃圾邮件扫描程序可执行保护 |
| `has_virus_protection` | 不 | 布尔值 | 是否在此域上启用垃圾邮件扫描程序病毒防护 |
| `has_recipient_verification` | 不 | 布尔值 | 全局域默认是否要求别名收件人单击电子邮件验证链接才能让电子邮件流过 |
| `ignore_mx_check` | 不 | 布尔值 | 是否忽略域名的 MX 记录检查以进行验证。这主要适用于拥有高级 MX 交换配置规则，并且需要保留现有 MX 交换并转发到我们的 MX 交换的用户。 |
| `retention_days` | 不 | 数字 | `0` 和 `30` 之间的整数，对应于成功投递或永久错误后存储出站 SMTP 电子邮件的保留天数。默认值为 `0`，这意味着出于安全考虑，出站 SMTP 电子邮件会被立即清除并屏蔽。 |
| `bounce_webhook` | 不 | 字符串 (URL) 或布尔值 (false) | 您选择的 `http://` 或 `https://` webhook URL，用于发送退回 webhook。我们将向此 URL 提交 `POST` 请求，其中包含有关出站 SMTP 故障（例如软故障或硬故障）的信息，以便您管理订阅者并以编程方式管理出站电子邮件。 |
| `max_quota_per_alias` | 不 | 细绳 | 此域名上别名的最大存储配额。请输入一个将由 [bytes](https://github.com/visionmedia/bytes.js) 解析的值，例如“1 GB”。 |

> 示例请求：

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### 检索域名 {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> 示例请求：

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### 验证域名记录 {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> 示例请求：

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### 验证域 SMTP 记录 {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> 示例请求：

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### 列出域范围的万能密码 {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> 示例请求：

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### 创建全域通用密码 {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| 身体参数 | 必需的 | 类型 | 描述 |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | 不 | 细绳 | 您的自定义新密码，用于全域通用密码。请注意，如果您希望获取随机生成的强密码，则可以将此字段留空，或者在 API 请求正文中完全不填写。 |
| `description` | 不 | 细绳 | 仅用于组织目的的描述。 |

> 示例请求：

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### 删除域范围的万能密码 {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> 示例请求：

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### 更新域名 {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| 身体参数 | 必需的 | 类型 | 描述 |
| ------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port` | 不 | 字符串或数字 | 用于配置 SMTP 转发的自定义端口（默认为 `"25"`） |
| `has_adult_content_protection` | 不 | 布尔值 | 是否在此域上启用垃圾邮件扫描程序成人内容保护 |
| `has_phishing_protection` | 不 | 布尔值 | 是否在此域上启用垃圾邮件扫描程序钓鱼保护 |
| `has_executable_protection` | 不 | 布尔值 | 是否在此域上启用垃圾邮件扫描程序可执行保护 |
| `has_virus_protection` | 不 | 布尔值 | 是否在此域上启用垃圾邮件扫描程序病毒防护 |
| `has_recipient_verification` | 不 | 布尔值 | 全局域默认是否要求别名收件人单击电子邮件验证链接才能让电子邮件流过 |
| `ignore_mx_check` | 不 | 布尔值 | 是否忽略域名的 MX 记录检查以进行验证。这主要适用于拥有高级 MX 交换配置规则，并且需要保留现有 MX 交换并转发到我们的 MX 交换的用户。 |
| `retention_days` | 不 | 数字 | `0` 和 `30` 之间的整数，对应于成功投递或永久错误后存储出站 SMTP 电子邮件的保留天数。默认值为 `0`，这意味着出于安全考虑，出站 SMTP 电子邮件会被立即清除并屏蔽。 |
| `bounce_webhook` | 不 | 字符串 (URL) 或布尔值 (false) | 您选择的 `http://` 或 `https://` webhook URL，用于发送退回 webhook。我们将向此 URL 提交 `POST` 请求，其中包含有关出站 SMTP 故障（例如软故障或硬故障）的信息，以便您管理订阅者并以编程方式管理出站电子邮件。 |
| `max_quota_per_alias` | 不 | 细绳 | 此域名上别名的最大存储配额。请输入一个将由 [bytes](https://github.com/visionmedia/bytes.js) 解析的值，例如“1 GB”。 |

> 示例请求：

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### 删除域名 {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> 示例请求：

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```

## 邀请 {#invites}

### 接受域名邀请 {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> 示例请求：

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### 创建域名邀请 {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| 身体参数 | 必需的 | 类型 | 描述 |
| -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email` | 是的 | 字符串（电子邮件） | 邀请加入域成员列表的电子邮件地址 |
| `group` | 是的 | 字符串（可枚举） | 将用户添加到域成员资格的组（可以是 `"admin"` 或 `"user"` 之一） |

> 示例请求：

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> If the user being invited is already an accepted member of any other domains the admin inviting them is a member of, then it will auto-accept the invite and not send an email.

### 删除域名邀请 {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| 身体参数 | 必需的 | 类型 | 描述 |
| -------------- | -------- | -------------- | ------------------------------------------------ |
| `email` | 是的 | 字符串（电子邮件） | 要从域成员列表中删除的电子邮件地址 |

> 示例请求：

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

## 成员 {#members}

### 更新域成员 {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| 身体参数 | 必需的 | 类型 | 描述 |
| -------------- | -------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `group` | 是的 | 字符串（可枚举） | 用于将用户更新为域成员的组（可以是 `"admin"` 或 `"user"` 之一） |

> 示例请求：

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### 删除域成员 {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> 示例请求：

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```

## 别名 {#aliases}

### 生成别名密码 {#generate-an-alias-password}

请注意，如果您不通过电子邮件发送说明，则用户名和密码将以 `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }` 格式出现在成功请求的 JSON 响应正文中。

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| 身体参数 | 必需的 | 类型 | 描述 |
| ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | 不 | 细绳 | 用于别名的自定义新密码。请注意，如果您希望获取随机生成的强密码，则可以将此字段留空，或者在 API 请求正文中完全省略。 |
| `password` | 不 | 细绳 | 别名的现有密码，用于在不删除现有 IMAP 邮箱存储的情况下更改密码（如果您不再拥有现有密码，请参阅下面的 `is_override` 选项）。 |
| `is_override` | 不 | 布尔值 | **谨慎使用**：此操作将完全覆盖现有别名的密码和数据库，并永久删除现有的 IMAP 存储，并完全重置别名的 SQLite 电子邮件数据库。如果您已将现有邮箱关联到此别名，请尽可能进行备份。 |
| `emailed_instructions` | 不 | 细绳 | 用于发送别名密码和设置说明的电子邮件地址。 |

> 示例请求：

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### 列出域别名 {#list-domain-aliases}

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.  See [Pagination](#pagination) for more insight.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| 查询字符串参数 | 必需的 | 类型 | 描述 |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | 不 | 字符串（支持正则表达式） | 按名称、标签或收件人搜索域中的别名 |
| `name` | 不 | 字符串（支持正则表达式） | 按名称搜索域中的别名 |
| `recipient` | 不 | 字符串（支持正则表达式） | 按收件人搜索域中的别名 |
| `sort` | 不 | 细绳 | 按特定字段排序（以单个连字符 `-` 为前缀，按该字段的反向排序）。如果未设置，则默认为 `created_at`。 |
| `page` | 不 | 数字 | 请参阅[Pagination](#pagination)了解更多信息 |
| `limit` | 不 | 数字 | 请参阅[Pagination](#pagination)了解更多信息 |

> 示例请求：

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### 创建新的域别名 {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| 身体参数 | 必需的 | 类型 | 描述 |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | 不 | 细绳 | 别名（如果未提供或为空，则生成随机别名） |
| `recipients` | 不 | 字符串或数组 | 收件人列表（必须是换行符/空格/逗号分隔的有效电子邮件地址、完全限定域名（“FQDN”）、IP 地址和/或 webhook URL 的字符串或数组 - 如果未提供或为空数组，则发出 API 请求的用户电子邮件将被设置为收件人） |
| `description` | 不 | 细绳 | 别名描述 |
| `labels` | 不 | 字符串或数组 | 标签列表（必须是以换行符/空格/逗号分隔的字符串或数组） |
| `has_recipient_verification` | 不 | 布尔值 | 要求收件人单击电子邮件验证链接才能使电子邮件流过（如果未在请求正文中明确设置，则默认为域的设置） |
| `is_enabled` | 不 | 布尔值 | 启用或禁用此别名（如果禁用，电子邮件将不会被路由到任何地方，但会返回成功状态代码）。如果传递了值，则会使用 [boolean](https://github.com/thenativeweb/boolean#quick-start) 将其转换为布尔值。 |
| `error_code_if_disabled` | 不 | 数字（`250`、`421` 或 `550`） | 如果 `is_enabled` 为 `false`，且 `250`（悄悄投递，例如 blackhole 或 `/dev/null`）、`421`（软拒绝；最多重试约 5 天）或 `550` 为永久失败并被拒绝，则发送到此别名的邮件将被拒绝。默认为 `250`。 |
| `has_imap` | 不 | 布尔值 | 是否启用或禁用此别名的 IMAP 存储（如果禁用，则收到的入站电子邮件将不会存储到 [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service)。如果传递了一个值，则使用 [boolean](https://github.com/thenativeweb/boolean#quick-start) 将其转换为布尔值） |
| `has_pgp` | 不 | 布尔值 | 是否使用别名 `public_key` 为 [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) 启用或禁用 [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)。 |
| `public_key` | 不 | 细绳 | ASCII Armor 格式的 OpenPGP 公钥（[click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt)；例如 `support@forwardemail.net` 的 GPG 密钥）。仅当您将 `has_pgp` 设置为 `true` 时才适用。[Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)。 |
| `max_quota` | 不 | 细绳 | 此别名的最大存储配额。留空可重置为域当前的最大配额，或输入一个将由 [bytes](https://github.com/visionmedia/bytes.js) 解析的值（例如“1 GB”）。此值只能由域管理员调整。 |
| `vacation_responder_is_enabled` | 不 | 布尔值 | 是否启用或禁用自动休假响应器。 |
| `vacation_responder_start_date` | 不 | 细绳 | 休假响应程序的开始日期（如果已启用且未在此处设置开始日期，则系统将假定休假响应程序已开始）。我们支持 `MM/DD/YYYY`、`YYYY-MM-DD` 等日期格式，并通过 `dayjs` 进行智能解析，支持其他日期格式。 |
| `vacation_responder_end_date` | 不 | 细绳 | 休假响应器的结束日期（如果启用但未在此处设置结束日期，则系统将假定休假永不结束并永久响应）。我们支持 `MM/DD/YYYY`、`YYYY-MM-DD` 等日期格式，并通过 `dayjs` 进行智能解析，支持其他日期格式。 |
| `vacation_responder_subject` | 不 | 细绳 | 休假回复者的纯文本主题，例如“外出办公”。我们使用 `striptags` 删除此处的所有 HTML 代码。 |
| `vacation_responder_message` | 不 | 细绳 | 休假回复者的纯文本消息，例如“我将休假至二月。”。我们使用 `striptags` 删除此处的所有 HTML。 |

> 示例请求：

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### 检索域别名 {#retrieve-domain-alias}

您可以通过 `id` 或 `name` 值检索域别名。

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> 示例请求：

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> 示例请求：

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### 更新域别名 {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| 身体参数 | 必需的 | 类型 | 描述 |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | 不 | 细绳 | 别名 |
| `recipients` | 不 | 字符串或数组 | 收件人列表（必须是以换行符/空格/逗号分隔的有效电子邮件地址、完全限定域名（“FQDN”）、IP 地址和/或 webhook URL 的字符串或数组） |
| `description` | 不 | 细绳 | 别名描述 |
| `labels` | 不 | 字符串或数组 | 标签列表（必须是以换行符/空格/逗号分隔的字符串或数组） |
| `has_recipient_verification` | 不 | 布尔值 | 要求收件人单击电子邮件验证链接才能使电子邮件流过（如果未在请求正文中明确设置，则默认为域的设置） |
| `is_enabled` | 不 | 布尔值 | 启用或禁用此别名（如果禁用，电子邮件将不会被路由到任何地方，但会返回成功状态代码）。如果传递了值，则会使用 [boolean](https://github.com/thenativeweb/boolean#quick-start) 将其转换为布尔值。 |
| `error_code_if_disabled` | 不 | 数字（`250`、`421` 或 `550`） | 如果 `is_enabled` 为 `false`，且 `250`（悄悄投递，例如 blackhole 或 `/dev/null`）、`421`（软拒绝；最多重试约 5 天）或 `550` 为永久失败并被拒绝，则发送到此别名的邮件将被拒绝。默认为 `250`。 |
| `has_imap` | 不 | 布尔值 | 是否启用或禁用此别名的 IMAP 存储（如果禁用，则收到的入站电子邮件将不会存储到 [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service)。如果传递了一个值，则使用 [boolean](https://github.com/thenativeweb/boolean#quick-start) 将其转换为布尔值） |
| `has_pgp` | 不 | 布尔值 | 是否使用别名 `public_key` 为 [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) 启用或禁用 [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)。 |
| `public_key` | 不 | 细绳 | ASCII Armor 格式的 OpenPGP 公钥（[click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt)；例如 `support@forwardemail.net` 的 GPG 密钥）。仅当您将 `has_pgp` 设置为 `true` 时才适用。[Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)。 |
| `max_quota` | 不 | 细绳 | 此别名的最大存储配额。留空可重置为域当前的最大配额，或输入一个将由 [bytes](https://github.com/visionmedia/bytes.js) 解析的值（例如“1 GB”）。此值只能由域管理员调整。 |
| `vacation_responder_is_enabled` | 不 | 布尔值 | 是否启用或禁用自动休假响应器。 |
| `vacation_responder_start_date` | 不 | 细绳 | 休假响应程序的开始日期（如果已启用且未在此处设置开始日期，则系统将假定休假响应程序已开始）。我们支持 `MM/DD/YYYY`、`YYYY-MM-DD` 等日期格式，并通过 `dayjs` 进行智能解析，支持其他日期格式。 |
| `vacation_responder_end_date` | 不 | 细绳 | 休假响应器的结束日期（如果启用但未在此处设置结束日期，则系统将假定休假永不结束并永久响应）。我们支持 `MM/DD/YYYY`、`YYYY-MM-DD` 等日期格式，并通过 `dayjs` 进行智能解析，支持其他日期格式。 |
| `vacation_responder_subject` | 不 | 细绳 | 休假回复者的纯文本主题，例如“外出办公”。我们使用 `striptags` 删除此处的所有 HTML 代码。 |
| `vacation_responder_message` | 不 | 细绳 | 休假回复者的纯文本消息，例如“我将休假至二月。”。我们使用 `striptags` 删除此处的所有 HTML。 |

> 示例请求：

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### 删除域别名 {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> 示例请求：

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

## 加密 {#encrypt}

即使在免费方案中，我们也允许您免费加密记录。隐私不应只是一项功能，而应融入产品的各个方面。应[隐私指南讨论](https://discuss.privacyguides.net/t/forward-email-email-provider/13370)和[我们的 GitHub 问题](https://github.com/forwardemail/forwardemail.net/issues/254)中的强烈要求，我们已添加此功能。

### 加密 TXT 记录 {#encrypt-txt-record}

> `POST /v1/encrypt`

| 身体参数 | 必需的 | 类型 | 描述 |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input` | 是的 | 细绳 | 任何有效的转发电子邮件纯文本 TXT 记录 |

> 示例请求：

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
