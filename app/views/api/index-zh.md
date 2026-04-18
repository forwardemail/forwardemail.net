# 邮件 API {#email-api}


## 目录 {#table-of-contents}

* [库](#libraries)
* [基础 URI](#base-uri)
* [认证](#authentication)
  * [API 令牌认证（推荐用于大多数端点）](#api-token-authentication-recommended-for-most-endpoints)
  * [别名凭据认证（用于外发邮件）](#alias-credentials-authentication-for-outbound-email)
  * [仅限别名的端点](#alias-only-endpoints)
* [错误](#errors)
* [本地化](#localization)
* [分页](#pagination)
* [日志](#logs)
  * [检索日志](#retrieve-logs)
* [账户](#account)
  * [创建账户](#create-account)
  * [检索账户](#retrieve-account)
  * [更新账户](#update-account)
* [别名联系人（CardDAV）](#alias-contacts-carddav)
  * [列出联系人](#list-contacts)
  * [创建联系人](#create-contact)
  * [检索联系人](#retrieve-contact)
  * [更新联系人](#update-contact)
  * [删除联系人](#delete-contact)
* [别名日历（CalDAV）](#alias-calendars-caldav)
  * [列出日历](#list-calendars)
  * [创建日历](#create-calendar)
  * [检索日历](#retrieve-calendar)
  * [更新日历](#update-calendar)
  * [删除日历](#delete-calendar)
* [别名邮件（IMAP/POP3）](#alias-messages-imappop3)
  * [列出和搜索邮件](#list-and-search-for-messages)
  * [创建邮件](#create-message)
  * [检索邮件](#retrieve-message)
  * [更新邮件](#update-message)
  * [删除邮件](#delete-message)
* [别名文件夹（IMAP/POP3）](#alias-folders-imappop3)
  * [列出文件夹](#list-folders)
  * [创建文件夹](#create-folder)
  * [检索文件夹](#retrieve-folder)
  * [更新文件夹](#update-folder)
  * [删除文件夹](#delete-folder)
  * [复制文件夹](#copy-folder)
* [外发邮件](#outbound-emails)
  * [获取外发 SMTP 邮件限制](#get-outbound-smtp-email-limit)
  * [列出外发 SMTP 邮件](#list-outbound-smtp-emails)
  * [创建外发 SMTP 邮件](#create-outbound-smtp-email)
  * [检索外发 SMTP 邮件](#retrieve-outbound-smtp-email)
  * [删除外发 SMTP 邮件](#delete-outbound-smtp-email)
* [域名](#domains)
  * [列出域名](#list-domains)
  * [创建域名](#create-domain)
  * [检索域名](#retrieve-domain)
  * [验证域名记录](#verify-domain-records)
  * [验证域名 SMTP 记录](#verify-domain-smtp-records)
  * [列出域范围通配密码](#list-domain-wide-catch-all-passwords)
  * [创建域范围通配密码](#create-domain-wide-catch-all-password)
  * [移除域范围通配密码](#remove-domain-wide-catch-all-password)
  * [更新域名](#update-domain)
  * [删除域名](#delete-domain)
* [邀请](#invites)
  * [接受域邀请](#accept-domain-invite)
  * [创建域邀请](#create-domain-invite)
  * [移除域邀请](#remove-domain-invite)
* [成员](#members)
  * [更新域成员](#update-domain-member)
  * [移除域成员](#remove-domain-member)
* [别名](#aliases)
  * [生成别名密码](#generate-an-alias-password)
  * [列出域别名](#list-domain-aliases)
  * [创建新域别名](#create-new-domain-alias)
  * [检索域别名](#retrieve-domain-alias)
  * [更新域别名](#update-domain-alias)
  * [删除域别名](#delete-domain-alias)
* [加密](#encrypt)
  * [加密 TXT 记录](#encrypt-txt-record)


## 库 {#libraries}

目前我们尚未发布任何 API 封装库，但计划在不久的将来推出。如果您希望在某个特定编程语言的 API 封装库发布时收到通知，请发送邮件至 <api@forwardemail.net>。与此同时，您可以在应用程序中使用这些推荐的 HTTP 请求库，或者像下面示例中那样简单地使用 [curl](https://stackoverflow.com/a/27442239/3586413)。

| 语言       | 库                                                                    |
| ---------- | ---------------------------------------------------------------------- |
| Ruby       | [Faraday](https://github.com/lostisland/faraday)                       |
| Python     | [requests](https://github.com/psf/requests)                            |
| Java       | [OkHttp](https://github.com/square/okhttp/)                            |
| PHP        | [guzzle](https://github.com/guzzle/guzzle)                             |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (我们是维护者)       |
| Node.js    | [superagent](https://github.com/ladjs/superagent) (我们是维护者)       |
| Go         | [net/http](https://golang.org/pkg/net/http/)                           |
| .NET       | [RestSharp](https://github.com/restsharp/RestSharp)                    |
## Base URI {#base-uri}

当前的 HTTP 基础 URI 路径是：`BASE_URI`。


## Authentication {#authentication}

所有端点都需要使用[基本认证](https://en.wikipedia.org/wiki/Basic_access_authentication)进行身份验证。我们支持两种身份验证方法：

### API Token Authentication (推荐用于大多数端点) {#api-token-authentication-recommended-for-most-endpoints}

将您的[API 密钥](https://forwardemail.net/my-account/security)设置为“用户名”值，密码留空：

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

注意 API 令牌后的冒号（`:`）——这表示基本认证格式中的空密码。

### Alias Credentials Authentication (用于外发邮件) {#alias-credentials-authentication-for-outbound-email}

[创建外发 SMTP 邮件](#create-outbound-smtp-email)端点也支持使用您的别名邮箱地址和[生成的别名密码](/faq#do-you-support-receiving-email-with-imap)进行身份验证：

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hello" \
  -d "text=Test email"
```

当您从已经使用 SMTP 凭据的应用程序发送邮件时，此方法非常有用，并且使从 SMTP 迁移到我们的 API 变得无缝。

### Alias-Only Endpoints {#alias-only-endpoints}

[别名联系人](#alias-contacts-carddav)、[别名日历](#alias-calendars-caldav)、[别名消息](#alias-messages-imappop3) 和 [别名文件夹](#alias-folders-imappop3) 端点需要别名凭据，不支持 API 令牌认证。

别担心——如果您不确定这是什么，下面会提供示例。


## Errors {#errors}

如果发生任何错误，API 请求的响应体将包含详细的错误信息。

| 代码 | 名称                 |
| ---- | -------------------- |
| 200  | 成功                 |
| 400  | 错误请求             |
| 401  | 未授权               |
| 403  | 禁止访问             |
| 404  | 未找到               |
| 429  | 请求过多             |
| 500  | 服务器内部错误       |
| 501  | 未实现               |
| 502  | 错误网关             |
| 503  | 服务不可用           |
| 504  | 网关超时             |

> \[!TIP]
> 如果您收到 5xx 状态码（理论上不应发生），请通过 <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> 联系我们，我们将立即帮助您解决问题。


## Localization {#localization}

我们的服务已翻译成超过 25 种语言。所有 API 响应消息都会根据发起 API 请求的用户最后检测到的语言环境进行翻译。您可以通过传递自定义的 `Accept-Language` 头来覆盖此设置。欢迎使用本页底部的语言下拉菜单进行尝试。


## Pagination {#pagination}

> \[!NOTE]
> 自 2024 年 11 月 1 日起，[列出域](#list-domains) 和 [列出域别名](#list-domain-aliases) 的 API 端点默认每页最大返回 `1000` 条结果。如果您想提前启用此行为，可以在端点查询的 URL 中额外传递 `?paginate=true` 查询参数。

所有列出结果的 API 端点均支持分页。

只需提供查询字符串属性 `page`（可选 `limit`）。

属性 `page` 应为大于或等于 `1` 的数字。如果提供了 `limit`（也是数字），则最小值为 `10`，最大值为 `50`（除非另有说明）。

| 查询字符串参数       | 必填 | 类型   | 描述                                                                                         |
| -------------------- | ---- | ------ | -------------------------------------------------------------------------------------------- |
| `page`               | 否   | 数字   | 要返回的结果页码。如果未指定，`page` 值默认为 `1`。必须是大于或等于 `1` 的数字。             |
| `limit`              | 否   | 数字   | 每页返回的结果数量。如果未指定，默认为 `10`。必须是大于或等于 `1` 且小于或等于 `50` 的数字。 |
为了确定是否有更多结果可用，我们提供以下 HTTP 响应头（您可以解析这些头以实现程序化分页）：

| HTTP Response Header | 示例                                                                                                                                                                                                                                                     | 描述                                                                                                                                                                                                                                                                                                                                                              |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `X-Page-Count`       | `X-Page-Count: 3`                                                                                                                                                                                                                                        | 可用的总页数。                                                                                                                                                                                                                                                                                                                                                     |
| `X-Page-Current`     | `X-Page-Current: 1`                                                                                                                                                                                                                                      | 返回的当前结果页（例如基于 `page` 查询字符串参数）。                                                                                                                                                                                                                                                                                                             |
| `X-Page-Size`        | `X-Page-Size: 10`                                                                                                                                                                                                                                        | 返回页中的结果总数（例如基于 `limit` 查询字符串参数和实际返回的结果）。                                                                                                                                                                                                                                                                                            |
| `X-Item-Count`       | `X-Item-Count: 30`                                                                                                                                                                                                                                       | 所有页面中可用的项目总数。                                                                                                                                                                                                                                                                                                                                        |
| `Link`               | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | 我们提供了一个 `Link` HTTP 响应头，您可以按示例解析。此方式[类似于 GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers)（例如，如果某些值不相关或不可用，则不会提供所有值，例如如果没有下一页，则不会提供 `"next"`）。                                                                                     |
> 示例请求：

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## 日志 {#logs}

### 获取日志 {#retrieve-logs}

我们的 API 允许您以编程方式下载您账户的日志。向此端点提交请求将处理您账户的所有日志，并在完成后通过电子邮件将其作为附件（[Gzip](https://en.wikipedia.org/wiki/Gzip) 压缩的 [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) 电子表格文件）发送给您。

这使您可以使用 [Cron 任务](https://en.wikipedia.org/wiki/Cron) 或我们的 [Node.js 任务调度软件 Bree](https://github.com/breejs/bree) 创建后台作业，以便在您需要时接收日志。请注意，此端点每天限制 `10` 次请求。

附件的文件名格式为小写的 `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz`，电子邮件本身包含检索到的日志的简要摘要。您也可以随时从 [我的账户 → 日志](/my-account/logs) 下载日志。

> `GET /v1/logs/download`

| 查询参数             | 必需   | 类型           | 描述                                                                                                                         |
| -------------------- | ------ | -------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `domain`             | 否     | 字符串 (FQDN)  | 按完全限定域名（"FQDN"）过滤日志。如果不提供，则检索所有域的所有日志。                                                        |
| `q`                  | 否     | 字符串         | 按电子邮件、域名、别名、IP 地址或日期（`M/Y`、`M/D/YY`、`M-D`、`M-D-YY` 或 `M.D.YY` 格式）搜索日志。                         |
| `bounce_category`     | 否     | 字符串         | 按特定的退信类别搜索日志（例如 `blocklist`）。                                                                               |
| `response_code`       | 否     | 数字           | 按特定的错误响应代码搜索日志（例如 `421` 或 `550`）。                                                                         |

> 示例请求：

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> 示例 Cron 任务（每天午夜执行）：

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

请注意，您可以使用诸如 [Crontab.guru](https://crontab.guru/) 之类的服务来验证您的 cron 任务表达式语法。

> 示例 Cron 任务（每天午夜执行 **并获取前一天的日志**）：

MacOS 系统：

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Linux 和 Ubuntu 系统：

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```


## 账户 {#account}

### 创建账户 {#create-account}

> `POST /v1/account`

| 请求体参数      | 必需   | 类型           | 描述         |
| --------------- | ------ | -------------- | ------------ |
| `email`         | 是     | 字符串 (邮箱)  | 电子邮件地址 |
| `password`      | 是     | 字符串         | 密码         |

> 示例请求：

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### 获取账户 {#retrieve-account}

> `GET /v1/account`

> 示例请求：

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### 更新账户 {#update-account}

> `PUT /v1/account`

| 请求体参数      | 必需   | 类型           | 描述             |
| --------------- | ------ | -------------- | ---------------- |
| `email`         | 否     | 字符串 (邮箱)  | 电子邮件地址     |
| `given_name`    | 否     | 字符串         | 名               |
| `family_name`   | 否     | 字符串         | 姓               |
| `avatar_url`    | 否     | 字符串 (URL)   | 头像图片链接     |

> 示例请求：

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## 别名联系人 (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> 与其他 API 端点不同，这些端点要求 [认证](#authentication) 的“用户名”为别名用户名，“密码”为别名生成的密码，作为 Basic Authorization 头部。
> \[!WARNING]
> 本端点部分仍在开发中，预计将在2024年发布。在此期间，请使用我们网站导航中“Apps”下拉菜单中的IMAP客户端。

### 列出联系人 {#list-contacts}

> `GET /v1/contacts`

**即将推出**

### 创建联系人 {#create-contact}

> `POST /v1/contacts`

**即将推出**

### 获取联系人 {#retrieve-contact}

> `GET /v1/contacts/:id`

**即将推出**

### 更新联系人 {#update-contact}

> `PUT /v1/contacts/:id`

**即将推出**

### 删除联系人 {#delete-contact}

> `DELETE /v1/contacts/:id`

**即将推出**


## 别名日历（CalDAV） {#alias-calendars-caldav}

> \[!NOTE]
> 与其他API端点不同，这些端点需要[身份验证](#authentication)，“用户名”为别名用户名，“密码”为别名生成的密码，作为Basic授权头。

> \[!WARNING]
> 本端点部分仍在开发中，预计将在2024年发布。在此期间，请使用我们网站导航中“Apps”下拉菜单中的IMAP客户端。

### 列出日历 {#list-calendars}

> `GET /v1/calendars`

**即将推出**

### 创建日历 {#create-calendar}

> `POST /v1/calendars`

**即将推出**

### 获取日历 {#retrieve-calendar}

> `GET /v1/calendars/:id`

**即将推出**

### 更新日历 {#update-calendar}

> `PUT /v1/calendars/:id`

**即将推出**

### 删除日历 {#delete-calendar}

> `DELETE /v1/calendars/:id`

**即将推出**


## 别名邮件（IMAP/POP3） {#alias-messages-imappop3}

> \[!NOTE]
> 与其他API端点不同，这些端点需要[身份验证](#authentication)，“用户名”为别名用户名，“密码”为别名生成的密码，作为Basic授权头。

> \[!WARNING]
> 本端点部分仍在开发中，预计将在2024年发布。在此期间，请使用我们网站导航中“Apps”下拉菜单中的IMAP客户端。

请确保您已按照您的域名设置说明操作。

这些说明可在我们的常见问题部分找到：[您支持使用IMAP接收邮件吗？](/faq#do-you-support-receiving-email-with-imap)。

### 列出和搜索邮件 {#list-and-search-for-messages}

> `GET /v1/messages`

**即将推出**

### 创建邮件 {#create-message}

> \[!NOTE]
> 这**不会**发送电子邮件——它仅仅是将邮件添加到您的邮箱文件夹（例如，这类似于IMAP的`APPEND`命令）。如果您想发送电子邮件，请参见下方的[创建外发SMTP邮件](#create-outbound-smtp-email)。创建外发SMTP邮件后，您可以使用此端点将其副本追加到您的别名邮箱以便存储。

> `POST /v1/messages`

**即将推出**

### 获取邮件 {#retrieve-message}

> `GET /v1/messages/:id`

**即将推出**

### 更新邮件 {#update-message}

> `PUT /v1/messages/:id`

**即将推出**

### 删除邮件 {#delete-message}

> `DELETE /v1/messages:id`

**即将推出**


## 别名文件夹（IMAP/POP3） {#alias-folders-imappop3}

> \[!TIP]
> 以文件夹路径 <code>/v1/folders/:path</code> 作为端点的文件夹与以文件夹ID <code>:id</code> 作为端点的文件夹是可互换的。这意味着您可以通过文件夹的 <code>path</code> 或 <code>id</code> 来引用该文件夹。

> \[!WARNING]
> 本端点部分仍在开发中，预计将在2024年发布。在此期间，请使用我们网站导航中“Apps”下拉菜单中的IMAP客户端。

### 列出文件夹 {#list-folders}

> `GET /v1/folders`

**即将推出**

### 创建文件夹 {#create-folder}

> `POST /v1/folders`

**即将推出**

### 获取文件夹 {#retrieve-folder}

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


## 外发邮件 {#outbound-emails}

请确保您已按照您的域名设置说明操作。

这些说明可在[我的账户 → 域名 → 设置 → 外发SMTP配置](/my-account/domains)中找到。您需要确保为您的域名设置了DKIM、Return-Path和DMARC，以便发送外发SMTP邮件。
### 获取出站 SMTP 邮件限制 {#get-outbound-smtp-email-limit}

这是一个简单的端点，返回一个 JSON 对象，包含每个账户每日 SMTP 出站邮件的 `count` 和 `limit`。

> `GET /v1/emails/limit`

> 示例请求：

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### 列出出站 SMTP 邮件 {#list-outbound-smtp-emails}

请注意，此端点不会返回邮件的 `message`、`headers` 或 `rejectedErrors` 的属性值。

要返回这些属性及其值，请使用带有邮件 ID 的 [检索邮件](#retrieve-email) 端点。

> `GET /v1/emails`

| 查询字符串参数       | 必填   | 类型                      | 描述                                                                                                                                               |
| --------------------- | ------ | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                   | 否     | 字符串（支持正则表达式）  | 按元数据搜索邮件                                                                                                                                   |
| `domain`              | 否     | 字符串（支持正则表达式）  | 按域名搜索邮件                                                                                                                                     |
| `sort`                | 否     | 字符串                    | 按特定字段排序（在字段前加单个连字符 `-` 表示按该字段的反向顺序排序）。如果未设置，默认为 `created_at`。                                         |
| `page`                | 否     | 数字                      | 详情见 [分页](#pagination)                                                                                                                         |
| `limit`               | 否     | 数字                      | 详情见 [分页](#pagination)                                                                                                                         |

> 示例请求：

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### 创建出站 SMTP 邮件 {#create-outbound-smtp-email}

我们的创建邮件 API 灵感来源于并利用了 Nodemailer 的消息选项配置。请参考下面所有正文参数的 [Nodemailer 消息配置](https://nodemailer.com/message/)。

请注意，除了 `envelope` 和 `dkim`（因为我们会自动为您设置），我们支持所有 Nodemailer 选项。出于安全考虑，我们会自动将 `disableFileAccess` 和 `disableUrlAccess` 选项设置为 `true`。

您应当传递单个 `raw` 选项，包含带有头部的完整原始邮件 **或者** 传递下面的单独正文参数选项。

如果在头部发现表情符号（例如主题行 `Subject: 🤓 Hello`），此 API 端点会自动为您编码表情符号，转换为 `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`。我们的目标是打造一个极其友好且防呆的开发者邮件 API。

**认证：** 此端点支持 [API 令牌认证](#api-token-authentication-recommended-for-most-endpoints) 和 [别名凭据认证](#alias-credentials-authentication-for-outbound-email)。详情请参见上方的 [认证](#authentication) 部分。

> `POST /v1/emails`

| 正文参数          | 必填   | 类型              | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`            | 否     | 字符串（邮箱）    | 发件人邮箱地址（必须是域的别名）。                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `to`              | 否     | 字符串或数组      | “收件人”头部的收件人列表，逗号分隔字符串或数组。                                                                                                                                                                                                                                                                                                                                                                                                           |
| `cc`              | 否     | 字符串或数组      | “抄送”头部的收件人列表，逗号分隔字符串或数组。                                                                                                                                                                                                                                                                                                                                                                                                             |
| `bcc`             | 否     | 字符串或数组      | “密送”头部的收件人列表，逗号分隔字符串或数组。                                                                                                                                                                                                                                                                                                                                                                                                            |
| `subject`         | 否     | 字符串            | 邮件主题。                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `text`            | 否     | 字符串或缓冲区    | 邮件的纯文本版本。                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `html`            | 否     | 字符串或缓冲区    | 邮件的 HTML 版本。                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `attachments`     | 否     | 数组              | 附件对象数组（参见 [Nodemailer 的常用字段](https://nodemailer.com/message/#common-fields)）。                                                                                                                                                                                                                                                                                                                                                              |
| `sender`          | 否     | 字符串            | “发件人”头部的邮箱地址（参见 [Nodemailer 的高级字段](https://nodemailer.com/message/#more-advanced-fields)）。                                                                                                                                                                                                                                                                                                                                             |
| `replyTo`         | 否     | 字符串            | “回复至”头部的邮箱地址。                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `inReplyTo`       | 否     | 字符串            | 此邮件回复的 Message-ID。                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `references`      | 否     | 字符串或数组      | 以空格分隔的 Message-ID 列表或数组。                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `attachDataUrls`  | 否     | 布尔值            | 如果为 `true`，则将邮件 HTML 内容中的 `data:` 图片转换为嵌入附件。                                                                                                                                                                                                                                                                                                                                                                                           |
| `watchHtml`       | 否     | 字符串            | Apple Watch 专用的邮件 HTML 版本（[根据 Nodemailer 文档](https://nodemailer.com/message/#content-options)），最新的手表不需要设置此项。                                                                                                                                                                                                                                                                                                                    |
| `amp`             | 否     | 字符串            | AMP4EMAIL 专用的邮件 HTML 版本（参见 [Nodemailer 示例](https://nodemailer.com/message/#amp-example)）。                                                                                                                                                                                                                                                                                                                                                       |
| `icalEvent`       | 否     | 对象              | 用作替代消息内容的 iCalendar 事件（参见 [Nodemailer 的日历事件](https://nodemailer.com/message/calendar-events/)）。                                                                                                                                                                                                                                                                                                                                       |
| `alternatives`    | 否     | 数组              | 替代消息内容数组（参见 [Nodemailer 的替代内容](https://nodemailer.com/message/alternatives/)）。                                                                                                                                                                                                                                                                                                                                                            |
| `encoding`        | 否     | 字符串            | 文本和 HTML 字符串的编码（默认为 `"utf-8"`，也支持 `"hex"` 和 `"base64"` 编码）。                                                                                                                                                                                                                                                                                                                                                                           |
| `raw`             | 否     | 字符串或缓冲区    | 自定义生成的 RFC822 格式消息（替代 Nodemailer 生成的消息 – 参见 [Nodemailer 的自定义源](https://nodemailer.com/message/custom-source/)）。                                                                                                                                                                                                                                                                                                               |
| `textEncoding`    | 否     | 字符串            | 强制用于文本值的编码（`"quoted-printable"` 或 `"base64"`）。默认值为检测到的最接近值（ASCII 使用 `"quoted-printable"`）。                                                                                                                                                                                                                                                                                                                               |
| `priority`        | 否     | 字符串            | 邮件优先级（可为 `"high"`、`"normal"`（默认）或 `"low"`）。注意，`"normal"` 不会设置优先级头部（这是默认行为）。如果设置为 `"high"` 或 `"low"`，则会相应设置 `X-Priority`、`X-MSMail-Priority` 和 `Importance` 头部，[具体见此处](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240)。 |
| `headers`         | 否     | 对象或数组        | 额外头部字段的对象或数组（参见 [Nodemailer 的自定义头部](https://nodemailer.com/message/custom-headers/)）。                                                                                                                                                                                                                                                                                                                                                |
| `messageId`       | 否     | 字符串            | “Message-ID” 头部的可选 Message-ID 值（如果未设置，将自动创建默认值 – 注意该值应符合 [RFC2822 规范](https://stackoverflow.com/a/4031705)）。                                                                                                                                                                                                                                                                                                             |
| `date`            | 否     | 字符串或日期      | 如果解析后缺少 Date 头部，将使用此可选日期值，否则使用当前 UTC 字符串。日期头部不能比当前时间提前超过 30 天。                                                                                                                                                                                                                                                                                                                                             |
| `list`            | 否     | 对象              | 可选的 `List-*` 头部对象（参见 [Nodemailer 的列表头部](https://nodemailer.com/message/list-headers/)）。                                                                                                                                                                                                                                                                                                                                                      |
> 示例请求（API 令牌）：

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> 示例请求（别名凭据）：

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> 示例请求（原始邮件）：

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### 获取外发 SMTP 邮件 {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> 示例请求：

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### 删除外发 SMTP 邮件 {#delete-outbound-smtp-email}

邮件删除操作会将状态设置为 `"rejected"`（随后不会在队列中处理），前提是当前状态为 `"pending"`、`"queued"` 或 `"deferred"` 之一。我们可能会在邮件创建和/或发送后 30 天自动清理邮件——因此您应在客户端、数据库或应用程序中保留外发 SMTP 邮件的副本。如果需要，您可以在数据库中引用我们的邮件 ID 值——该值会从 [创建邮件](#create-email) 和 [获取邮件](#retrieve-email) 接口返回。

> `DELETE /v1/emails/:id`

> 示例请求：

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## 域 {#domains}

> \[!TIP]
> 以域名 <code>/v1/domains/:domain_name</code> 作为端点的域接口可以与以域 ID <code>:domain_id</code> 作为端点的接口互换。这意味着您可以通过域的 <code>name</code> 或 <code>id</code> 值来引用该域。

### 列出域 {#list-domains}

> \[!NOTE]
> 自 2024 年 11 月 1 日起，[列出域](#list-domains) 和 [列出域别名](#list-domain-aliases) 的 API 端点默认每页最大返回 `1000` 条结果。如果您想提前启用此行为，可以在端点查询的 URL 中额外传递 `?paginate=true` 查询参数。详情请参见 [分页](#pagination)。

> `GET /v1/domains`

| 查询参数               | 必填   | 类型                      | 描述                                                                                                                                               |
| --------------------- | ------ | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                   | 否     | 字符串（支持正则表达式）  | 按名称搜索域                                                                                                                                       |
| `name`                | 否     | 字符串（支持正则表达式）  | 按名称搜索域                                                                                                                                       |
| `sort`                | 否     | 字符串                    | 按特定字段排序（在字段前加单个连字符 `-` 表示按该字段的反向顺序排序）。如果未设置，默认按 `created_at` 排序。                                      |
| `page`                | 否     | 数字                      | 详情请参见 [分页](#pagination)                                                                                                                     |
| `limit`               | 否     | 数字                      | 详情请参见 [分页](#pagination)                                                                                                                     |

> 示例请求：

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### 创建域 {#create-domain}

> `POST /v1/domains`

| 请求体参数                     | 必填   | 类型                                          | 描述                                                                                                                                                                                                                                                                                                               |
| ------------------------------ | ------ | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `domain`                       | 是     | 字符串（FQDN 或 IP）                          | 完全限定域名（"FQDN"）或 IP 地址                                                                                                                                                                                                                                                                                   |
| `team_domain`                  | 否     | 字符串（域 ID 或域名；FQDN）                  | 自动将此域分配给另一个域所属的同一团队。这意味着该域的所有成员都会被分配为团队成员，且 `plan` 会自动设置为 `team`。如果需要，您可以将此设置为 `"none"` 来显式禁用此功能，但通常不必这样做。                                                                                                                     |
| `plan`                         | 否     | 字符串（枚举）                               | 计划类型（必须是 `"free"`、`"enhanced_protection"` 或 `"team"`，默认为 `"free"`，如果用户已有付费计划则默认为当前付费计划）                                                                                                                                                                                        |
| `catchall`                     | 否     | 字符串（分隔的邮箱地址）或布尔值              | 创建默认的 catch-all 别名，默认为 `true`（如果为 `true`，则使用 API 用户的邮箱地址作为收件人；如果为 `false`，则不创建 catch-all）。如果传入字符串，则为收件人的分隔邮箱地址列表（可用换行、空格和/或逗号分隔）                                                                                                  |
| `has_adult_content_protection` | 否     | 布尔值                                        | 是否启用该域的垃圾邮件扫描器成人内容保护                                                                                                                                                                                                                                                                             |
| `has_phishing_protection`      | 否     | 布尔值                                        | 是否启用该域的垃圾邮件扫描器钓鱼保护                                                                                                                                                                                                                                                                                 |
| `has_executable_protection`    | 否     | 布尔值                                        | 是否启用该域的垃圾邮件扫描器可执行文件保护                                                                                                                                                                                                                                                                           |
| `has_virus_protection`         | 否     | 布尔值                                        | 是否启用该域的垃圾邮件扫描器病毒保护                                                                                                                                                                                                                                                                                 |
| `has_recipient_verification`   | 否     | 布尔值                                        | 全局域默认设置，是否要求别名收件人点击邮件验证链接以使邮件通过                                                                                                                                                                                                                                                       |
| `ignore_mx_check`              | 否     | 布尔值                                        | 是否忽略域的 MX 记录检查。主要针对有高级 MX 交换配置规则且需要保留现有 MX 交换并转发到我们的用户。                                                                                                                                                                                                                     |
| `retention_days`               | 否     | 数字                                          | 介于 `0` 到 `30` 的整数，表示成功投递或永久错误后存储外发 SMTP 邮件的保留天数。默认为 `0`，表示为安全起见，外发 SMTP 邮件会立即被清理和脱敏。                                                                                                                                                                      |
| `bounce_webhook`               | 否     | 字符串（URL）或布尔值（false）                | 您选择的用于接收退信 webhook 的 `http://` 或 `https://` URL。我们会向该 URL 发送 `POST` 请求，包含外发 SMTP 失败的信息（例如软失败或硬失败），以便您管理订阅者并以编程方式管理外发邮件。                                                                                                                        |
| `max_quota_per_alias`          | 否     | 字符串                                        | 该域名别名的存储最大配额。输入类似 "1 GB" 的值，系统会通过 [bytes](https://github.com/visionmedia/bytes.js) 解析。                                                                                                                                                                                                    |
> 示例请求：

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### 获取域名 {#retrieve-domain}

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

### 验证域名 SMTP 记录 {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> 示例请求：

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### 列出域名范围内的通配密码 {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> 示例请求：

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### 创建域名范围内的通配密码 {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| 请求体参数       | 必填   | 类型   | 描述                                                                                                                                                                                                                       |
| -------------- | ------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | 否     | 字符串 | 您自定义的新密码，用于域名范围内的通配密码。注意，如果您希望获得随机生成且强度高的密码，可以在 API 请求体中留空或完全省略此字段。                                                                                          自定义邮箱密码必须为128个字符或更少，不能以空格开头或结尾，并且不能包含引号或撇号。 Catch-all密码仅用于SMTP发送。对于IMAP、POP3、CalDAV、CardDAV及邮箱访问，请为特定别名生成密码。 |
| `description`  | 否     | 字符串 | 仅用于组织管理的描述。                                                                                                                                                                                                     |

> 示例请求：

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### 删除域名范围内的通配密码 {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> 示例请求：

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### 更新域名 {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| 请求体参数                    | 必填   | 类型                            | 描述                                                                                                                                                                                                                                                                                       |
| ----------------------------- | ------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `smtp_port`                   | 否     | 字符串或数字                   | 用于配置 SMTP 转发的自定义端口（默认值为 `"25"`）                                                                                                                                                                                                                                         |
| `has_adult_content_protection` | 否     | 布尔值                         | 是否启用该域名的垃圾邮件扫描器成人内容保护                                                                                                                                                                                                                                                 |
| `has_phishing_protection`     | 否     | 布尔值                         | 是否启用该域名的垃圾邮件扫描器钓鱼保护                                                                                                                                                                                                                                                     |
| `has_executable_protection`   | 否     | 布尔值                         | 是否启用该域名的垃圾邮件扫描器可执行文件保护                                                                                                                                                                                                                                               |
| `has_virus_protection`        | 否     | 布尔值                         | 是否启用该域名的垃圾邮件扫描器病毒保护                                                                                                                                                                                                                                                     |
| `has_recipient_verification`  | 否     | 布尔值                         | 全局域名默认设置，是否要求别名收件人点击邮件验证链接以使邮件能够通过                                                                                                                                                                                                                       |
| `ignore_mx_check`             | 否     | 布尔值                         | 是否忽略域名的 MX 记录检查。此选项主要针对拥有高级 MX 交换配置规则且需要保留现有 MX 交换并转发到我们的用户。                                                                                                                                                                             |
| `retention_days`              | 否     | 数字                           | 介于 `0` 到 `30` 之间的整数，表示成功投递或永久错误后存储外发 SMTP 邮件的保留天数。默认为 `0`，表示外发 SMTP 邮件会立即被清除和脱敏，以保障您的安全。                                                                                                                               |
| `bounce_webhook`              | 否     | 字符串（URL）或布尔值（false） | 您选择的用于接收退信 webhook 的 `http://` 或 `https://` URL。我们会向该 URL 发送 `POST` 请求，包含外发 SMTP 失败的信息（例如软失败或硬失败），以便您管理订阅者并以编程方式管理外发邮件。                                                                                             |
| `max_quota_per_alias`         | 否     | 字符串                         | 该域名别名的存储最大配额。输入类似 "1 GB" 的值，系统会通过 [bytes](https://github.com/visionmedia/bytes.js) 进行解析。                                                                                                                                                                   |
> 示例请求：

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### 删除域 {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> 示例请求：

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## 邀请 {#invites}

### 接受域邀请 {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> 示例请求：

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### 创建域邀请 {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| 请求体参数     | 必填   | 类型                | 描述                                                                                     |
| -------------- | ------ | ------------------- | ---------------------------------------------------------------------------------------- |
| `email`        | 是     | 字符串（邮箱）      | 邀请加入域成员列表的邮箱地址                                                             |
| `group`        | 是     | 字符串（枚举）      | 将用户添加到域成员的组（可以是 `"admin"` 或 `"user"` 之一）                             |

> 示例请求：

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> 如果被邀请的用户已经是邀请管理员所在的其他域的已接受成员，则会自动接受邀请且不会发送邮件。

### 移除域邀请 {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| 请求体参数     | 必填   | 类型           | 描述                                      |
| -------------- | ------ | -------------- | ----------------------------------------- |
| `email`        | 是     | 字符串（邮箱） | 从域成员列表中移除的邮箱地址               |

> 示例请求：

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## 成员 {#members}

### 更新域成员 {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| 请求体参数     | 必填   | 类型                | 描述                                                                                      |
| -------------- | ------ | ------------------- | ----------------------------------------------------------------------------------------- |
| `group`        | 是     | 字符串（枚举）      | 更新用户在域成员中的组（可以是 `"admin"` 或 `"user"` 之一）                             |

> 示例请求：

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### 移除域成员 {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> 示例请求：

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## 别名 {#aliases}

### 生成别名密码 {#generate-an-alias-password}

请注意，如果您不通过邮件发送说明，则用户名和密码将包含在成功请求的 JSON 响应体中，格式为 `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`。

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| 请求体参数           | 必填   | 类型    | 描述                                                                                                                                                                                                                                                                                             |
| -------------------- | ------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `new_password`       | 否     | 字符串  | 您为别名自定义的新密码。注意，如果您希望获得随机生成的强密码，可以在 API 请求体中将此项留空或完全省略。                                                                                                                                                                                           自定义邮箱密码必须为128个字符或更少，不能以空格开头或结尾，并且不能包含引号或撇号。 |
| `password`           | 否     | 字符串  | 用于更改密码的现有别名密码，避免删除现有的 IMAP 邮箱存储（如果您不再拥有现有密码，请参见下面的 `is_override` 选项）。                                                                                                                                                                           |
| `is_override`        | 否     | 布尔值  | **谨慎使用**：这将完全覆盖现有别名密码和数据库，并永久删除现有的 IMAP 存储，完全重置别名的 SQLite 邮件数据库。如果您已有附加邮箱，请尽可能先备份。                                                                                                                                               |
| `emailed_instructions` | 否   | 字符串  | 发送别名密码和设置说明的邮箱地址。                                                                                                                                                                                                                                                               |
> 示例请求：

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### 列出域别名 {#list-domain-aliases}

> \[!注意]
> 自2024年11月1日起，[列出域](#list-domains)和[列出域别名](#list-domain-aliases)的API端点默认每页最大结果数为`1000`。如果您想提前启用此行为，可以在端点查询的URL中添加额外的查询字符串参数`?paginate=true`。详情请参见[分页](#pagination)。

> `GET /v1/domains/DOMAIN_NAME/aliases`

| 查询字符串参数          | 必填   | 类型                         | 描述                                                                                                                                            |
| --------------------- | ------ | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                   | 否     | 字符串（支持正则表达式）       | 按名称、标签或收件人搜索域中的别名                                                                                                              |
| `name`                | 否     | 字符串（支持正则表达式）       | 按名称搜索域中的别名                                                                                                                             |
| `recipient`           | 否     | 字符串（支持正则表达式）       | 按收件人搜索域中的别名                                                                                                                           |
| `sort`                | 否     | 字符串                       | 按特定字段排序（在字段前加单个连字符 `-` 表示按该字段的反向顺序排序）。如果未设置，默认为`created_at`。                                         |
| `page`                | 否     | 数字                         | 详情请参见[分页](#pagination)                                                                                                                    |
| `limit`               | 否     | 数字                         | 详情请参见[分页](#pagination)                                                                                                                    |

> 示例请求：

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### 创建新的域别名 {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| 请求体参数                      | 必填   | 类型                                   | 描述                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------- | ------ | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | 否     | 字符串                                 | 别名名称（如果未提供或为空，则生成随机别名）                                                                                                                                                                                                                                                                                                                                              |
| `recipients`                    | 否     | 字符串或数组                           | 收件人列表（必须是以换行符/空格/逗号分隔的字符串，或有效电子邮件地址、完全限定域名（"FQDN"）、IP地址和/或Webhook URL的数组 — 如果未提供或为空数组，则将发起API请求的用户邮箱设置为收件人）                                                                                                                                                                                               |
| `description`                   | 否     | 字符串                                 | 别名描述                                                                                                                                                                                                                                                                                                                                                                                 |
| `labels`                        | 否     | 字符串或数组                           | 标签列表（必须是以换行符/空格/逗号分隔的字符串或数组）                                                                                                                                                                                                                                                                                                                                   |
| `has_recipient_verification`    | 否     | 布尔值                                 | 是否要求收件人点击邮件验证链接以使邮件通过（如果请求体中未显式设置，则默认为域的设置）                                                                                                                                                                                                                                                                                                      |
| `is_enabled`                    | 否     | 布尔值                                 | 是否启用或禁用此别名（禁用时，邮件将不被路由，但返回成功状态码）。如果传入值，将使用[boolean](https://github.com/thenativeweb/boolean#quick-start)转换为布尔值。                                                                                                                                                                                                                             |
| `error_code_if_disabled`        | 否     | 数字（`250`、`421`或`550`之一）        | 如果`is_enabled`为`false`，则发送到此别名的邮件将被拒绝，拒绝代码为`250`（静默丢弃，例如黑洞或`/dev/null`）、`421`（软拒绝；并重试约5天）或`550`（永久失败并拒绝）。默认为`250`。                                                                                                                                                                                                       |
| `has_imap`                      | 否     | 布尔值                                 | 是否启用或禁用此别名的IMAP存储（禁用时，接收的入站邮件不会存储到[IMAP存储](/blog/docs/best-quantum-safe-encrypted-email-service)）。如果传入值，将使用[boolean](https://github.com/thenativeweb/boolean#quick-start)转换为布尔值。                                                                                                                                                     |
| `has_pgp`                       | 否     | 布尔值                                 | 是否启用或禁用[OpenPGP加密](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)用于使用该别名的`public_key`的[IMAP/POP3/CalDAV/CardDAV加密邮件存储](/blog/docs/best-quantum-safe-encrypted-email-service)。                                                                                                                                            |
| `public_key`                    | 否     | 字符串                                 | OpenPGP公钥，ASCII Armor格式（[点击这里查看示例](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt)；例如`support@forwardemail.net`的GPG密钥）。仅当`has_pgp`设置为`true`时生效。[了解更多关于端到端加密的信息请参见我们的FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)。                                         |
| `max_quota`                     | 否     | 字符串                                 | 此别名的存储最大配额。留空则重置为域当前最大配额，或输入如“1 GB”之类的值，将由[bytes](https://github.com/visionmedia/bytes.js)解析。此值仅可由域管理员调整。                                                                                                                                                                                                                              |
| `vacation_responder_is_enabled` | 否     | 布尔值                                 | 是否启用自动假期回复器。                                                                                                                                                                                                                                                                                                                                                                   |
| `vacation_responder_start_date` | 否     | 字符串                                 | 假期回复器开始日期（如果启用且此处未设置开始日期，则默认已开始）。支持`MM/DD/YYYY`、`YYYY-MM-DD`等日期格式，通过`dayjs`智能解析。                                                                                                                                                                                                                                                      |
| `vacation_responder_end_date`   | 否     | 字符串                                 | 假期回复器结束日期（如果启用且此处未设置结束日期，则默认永不结束，持续回复）。支持`MM/DD/YYYY`、`YYYY-MM-DD`等日期格式，通过`dayjs`智能解析。                                                                                                                                                                                                                                            |
| `vacation_responder_subject`    | 否     | 字符串                                 | 假期回复器的纯文本主题，例如“外出办公”。此处使用`striptags`移除所有HTML。                                                                                                                                                                                                                                                                                                                 |
| `vacation_responder_message`    | 否     | 字符串                                 | 假期回复器的纯文本消息，例如“我将外出办公至二月”。此处使用`striptags`移除所有HTML。                                                                                                                                                                                                                                                                                                         |
> 示例请求：

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### 获取域别名 {#retrieve-domain-alias}

您可以通过 `id` 或 `name` 值来获取域别名。

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

| 请求体参数                      | 必填   | 类型                                   | 描述                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------- | ------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | 否     | 字符串                                 | 别名名称                                                                                                                                                                                                                                                                                                                                                                                  |
| `recipients`                    | 否     | 字符串或数组                          | 收件人列表（必须是以换行符/空格/逗号分隔的字符串，或有效邮箱地址、完全限定域名（"FQDN"）、IP 地址和/或 webhook URL 的数组）                                                                                                                                                                                                                                                               |
| `description`                   | 否     | 字符串                                 | 别名描述                                                                                                                                                                                                                                                                                                                                                                                 |
| `labels`                        | 否     | 字符串或数组                          | 标签列表（必须是以换行符/空格/逗号分隔的字符串，或数组）                                                                                                                                                                                                                                                                                                                               |
| `has_recipient_verification`    | 否     | 布尔值                                 | 是否要求收件人点击邮件验证链接以使邮件通过（如果请求体中未显式设置，则默认为域的设置）                                                                                                                                                                                                                                                                                                    |
| `is_enabled`                    | 否     | 布尔值                                 | 是否启用或禁用此别名（禁用时，邮件将不会被路由，但返回成功状态码）。如果传入值，将使用 [boolean](https://github.com/thenativeweb/boolean#quick-start) 转换为布尔值                                                                                                                                                                                                                         |
| `error_code_if_disabled`        | 否     | 数字（`250`、`421` 或 `550`）          | 如果 `is_enabled` 为 `false`，则此别名的来信将被拒绝，返回代码为 `250`（静默丢弃，例如黑洞或 `/dev/null`）、`421`（软拒绝；并重试约 5 天）或 `550`（永久失败并拒绝）。默认值为 `250`。                                                                                                                                                                                                   |
| `has_imap`                      | 否     | 布尔值                                 | 是否启用或禁用此别名的 IMAP 存储（禁用时，收到的入站邮件不会存储到 [IMAP 存储](/blog/docs/best-quantum-safe-encrypted-email-service)）。如果传入值，将使用 [boolean](https://github.com/thenativeweb/boolean#quick-start) 转换为布尔值                                                                                                                                               |
| `has_pgp`                       | 否     | 布尔值                                 | 是否启用或禁用使用别名的 `public_key` 进行的 [OpenPGP 加密](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) 用于 [IMAP/POP3/CalDAV/CardDAV 加密邮件存储](/blog/docs/best-quantum-safe-encrypted-email-service)                                                                                                                                       |
| `public_key`                    | 否     | 字符串                                 | OpenPGP 公钥，ASCII Armor 格式（[点击这里查看示例](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt)；例如 `support@forwardemail.net` 的 GPG 密钥）。仅当 `has_pgp` 设置为 `true` 时生效。[了解更多关于端到端加密的内容，请参阅我们的 FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)。                     |
| `max_quota`                     | 否     | 字符串                                 | 此别名的存储最大配额。留空则重置为域当前最大配额，或输入如 "1 GB" 的值，该值将由 [bytes](https://github.com/visionmedia/bytes.js) 解析。此值仅可由域管理员调整。                                                                                                                                                                                                                         |
| `vacation_responder_is_enabled` | 否     | 布尔值                                 | 是否启用自动假期回复器。                                                                                                                                                                                                                                                                                                                                                                   |
| `vacation_responder_start_date` | 否     | 字符串                                 | 假期回复器的开始日期（如果启用且此处未设置开始日期，则默认假期回复器已开始）。支持的日期格式包括 `MM/DD/YYYY`、`YYYY-MM-DD` 以及通过 `dayjs` 智能解析的其他日期格式。                                                                                                                                                                                                                   |
| `vacation_responder_end_date`   | 否     | 字符串                                 | 假期回复器的结束日期（如果启用且此处未设置结束日期，则默认假期回复器永远有效）。支持的日期格式包括 `MM/DD/YYYY`、`YYYY-MM-DD` 以及通过 `dayjs` 智能解析的其他日期格式。                                                                                                                                                                                                                   |
| `vacation_responder_subject`    | 否     | 字符串                                 | 假期回复器的纯文本主题，例如 "外出办公"。此处会使用 `striptags` 移除所有 HTML。                                                                                                                                                                                                                                                                                                           |
| `vacation_responder_message`    | 否     | 字符串                                 | 假期回复器的纯文本消息，例如 "我将外出办公至二月。" 此处会使用 `striptags` 移除所有 HTML。                                                                                                                                                                                                                                                                                                 |
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

我们允许您即使在免费计划中也能免费加密记录。隐私不应该是一项功能，它应该内置于产品的所有方面。正如在[Privacy Guides 讨论](https://discuss.privacyguides.net/t/forward-email-email-provider/13370)和[我们的 GitHub 问题](https://github.com/forwardemail/forwardemail.net/issues/254)中强烈要求的那样，我们已经添加了此功能。

### 加密 TXT 记录 {#encrypt-txt-record}

> `POST /v1/encrypt`

| 请求体参数     | 必填   | 类型   | 描述                                         |
| -------------- | ------ | ------ | -------------------------------------------- |
| `input`        | 是     | 字符串 | 任何有效的 Forward Email 明文 TXT 记录       |

> 示例请求：

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
