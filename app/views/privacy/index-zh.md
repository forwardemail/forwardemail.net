# 隐私政策 {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email 隐私政策" class="rounded-lg" />


## 目录 {#table-of-contents}

* [免责声明](#disclaimer)
* [未收集的信息](#information-not-collected)
* [收集的信息](#information-collected)
  * [账户信息](#account-information)
  * [邮件存储](#email-storage)
  * [错误日志](#error-logs)
  * [外发 SMTP 邮件](#outbound-smtp-emails)
* [临时数据处理](#temporary-data-processing)
  * [速率限制](#rate-limiting)
  * [连接跟踪](#connection-tracking)
  * [认证尝试](#authentication-attempts)
* [审计日志](#audit-logs)
  * [账户变更](#account-changes)
  * [域名设置变更](#domain-settings-changes)
* [Cookies 和会话](#cookies-and-sessions)
* [分析](#analytics)
* [共享的信息](#information-shared)
* [信息删除](#information-removal)
* [额外披露](#additional-disclosures)


## 免责声明 {#disclaimer}

请参阅我们适用于全站的[条款](/terms)。


## 未收集的信息 {#information-not-collected}

**除本政策明确描述的信息外——包括[错误日志](#error-logs)、[出站 SMTP 电子邮件](#outbound-smtp-emails)、[账户信息](#account-information)、[临时数据处理](#temporary-data-processing)、[审计日志](#audit-logs)以及[Cookie 和会话](#cookies-and-sessions)：**

* 我们不会将任何转发的电子邮件存储到磁盘存储或数据库中。
* 我们不会将关于转发的电子邮件的任何元数据存储到磁盘存储或数据库中。
* 除非本政策明确说明，否则我们不会将日志或 IP 地址存储到磁盘存储或数据库中。
* 我们不使用任何第三方分析或遥测服务。


## 收集的信息 {#information-collected}

为了透明起见，您可以随时<a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">查看我们的源代码</a>，了解以下信息是如何被收集和使用的。

**严格为了功能性和改进我们的服务，我们收集并安全存储以下信息：**

### 账户信息 {#account-information}

* 我们存储您提供给我们的电子邮件地址。
* 我们存储您提供给我们的域名、别名和配置。
* 我们存储保护您的账户和管理访问所需的有限账户安全元数据，包括活跃的网站会话标识符、失败的登录尝试计数器以及最后一次登录尝试的时间戳。
* 您自愿提供给我们的任何额外信息，例如通过电子邮件或在我们的 <a href="/help">help</a> 页面上提交给我们的评论或问题。


**注册归因**（永久存储在您的账户中）：

当您创建账户时，我们存储以下信息以了解用户如何找到我们的服务：

* 引荐网站域名（非完整 URL）
* 您访问我们网站的第一个页面
* URL 中存在的 UTM 活动参数

### 邮件存储 {#email-storage}

* 我们将邮件和日历信息存储在您的[加密 SQLite 数据库](/blog/docs/best-quantum-safe-encrypted-email-service)中，严格用于您的 IMAP/POP3/CalDAV/CardDAV 访问和邮箱功能。
  * 请注意，如果您仅使用我们的邮件转发服务，则不会将任何邮件存储到磁盘或数据库中，如[未收集的信息](#information-not-collected)所述。
  * 我们的邮件转发服务仅在内存中操作（不写入磁盘存储或数据库）。
  * IMAP/POP3/CalDAV/CardDAV 存储为静态加密、传输加密，并存储在 LUKS 加密磁盘上。
  * 您的 IMAP/POP3/CalDAV/CardDAV 存储备份为静态加密、传输加密，并存储在 [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)。

### 错误日志 {#error-logs}

* 我们存储 `4xx` 和 `5xx` SMTP 响应代码的[错误日志](/faq#do-you-store-error-logs)，保存期限为 7 天。
* 错误日志包含 SMTP 错误、信封和邮件头（我们**不**存储邮件正文或附件）。
* 错误日志可能包含发送服务器的 IP 地址和主机名，用于调试目的。
* 用于[速率限制](/faq#do-you-have-rate-limiting)和[灰名单](/faq#do-you-have-a-greylist)的错误日志不可访问，因为连接会提前结束（例如在 `RCPT TO` 和 `MAIL FROM` 命令传输之前）。
### 出站 SMTP 邮件 {#outbound-smtp-emails}

* 我们存储 [出站 SMTP 邮件](/faq#do-you-support-sending-email-with-smtp) 大约 30 天。
  * 该时长基于“Date”头部变化；因为如果存在未来的“Date”头部，我们允许邮件在未来发送。
  * **请注意，一旦邮件成功投递或永久错误，我们将对邮件正文进行编辑并清除。**
  * 如果您希望配置出站 SMTP 邮件正文在成功投递或永久错误后保留时间超过默认的 0 天，请进入您域名的高级设置，输入一个介于 `0` 到 `30` 之间的值。
  * 一些用户喜欢使用 [我的账户 > 邮件](/my-account/emails) 预览功能查看邮件渲染效果，因此我们支持可配置的保留期限。
  * 请注意，我们也支持 [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)。

## 临时数据处理 {#temporary-data-processing}

以下数据在内存或 Redis 中临时处理，**不会**永久存储：

### 速率限制 {#rate-limiting}

* IP 地址临时存储于 Redis 用于速率限制。
* 速率限制数据会自动过期（通常在 24 小时内）。
* 这防止滥用并确保服务公平使用。

### 连接跟踪 {#connection-tracking}

* 并发连接数按 IP 地址在 Redis 中跟踪。
* 连接关闭或短时间超时后数据自动过期。
* 用于防止连接滥用并确保服务可用性。

### 认证尝试 {#authentication-attempts}

* 失败的身份验证尝试会在 Redis 中按 IP 地址进行跟踪。
* 我们还存储有限的账户级身份验证元数据，包括失败的登录尝试计数器以及最后一次登录尝试的时间戳。
* 基于 Redis 的身份验证尝试数据会自动过期（通常在 24 小时内）。
* 用于防止对用户账户的暴力破解攻击。


## 审计日志 {#audit-logs}

为了帮助您监控和保护您的账户及域名，我们维护某些变更的审计日志。这些日志用于向账户持有人和域名管理员发送通知邮件。

### 账户变更 {#account-changes}

* 我们跟踪重要账户设置的变更（例如，两步验证、显示名称、时区）。
* 变更检测后，我们会向您注册的邮箱发送通知邮件。
* 敏感字段（如密码、API 令牌、恢复密钥）会被跟踪，但通知中其值会被编辑。
* 审计日志条目在通知邮件发送后被清除。

### 域名设置变更 {#domain-settings-changes}

对于拥有多个管理员的域名，我们提供详细的审计日志，帮助团队跟踪配置变更：

**我们跟踪的内容：**

* 域名设置变更（例如，退信 webhook、垃圾邮件过滤、DKIM 配置）
* 变更执行者（用户邮箱地址）
* 变更时间戳
* 变更时的 IP 地址
* 浏览器/客户端用户代理字符串

**工作原理：**

* 所有域名管理员在设置变更时会收到一封合并的邮件通知。
* 通知中包含一个表格，显示每项变更、执行者、IP 地址和时间戳。
* 敏感字段（如 webhook 密钥、API 令牌、DKIM 私钥）会被跟踪，但其值会被编辑。
* 用户代理信息包含在可折叠的“技术细节”部分。
* 审计日志条目在通知邮件发送后被清除。

**我们收集这些信息的原因：**

* 帮助域名管理员维护安全监督
* 使团队能够审计谁进行了配置变更
* 协助排查意外变更问题
* 为共享域名管理提供责任追踪

## Cookie 和会话 {#cookies-and-sessions}

* 我们为您的网站流量存储仅限 HTTP 的签名 Cookie 和服务器端会话数据。
* Cookie 使用 SameSite 保护。
* 我们在您的账户上存储活跃的网站会话标识符，以支持诸如"注销其他设备"等功能和与安全相关的会话失效。
* 会话 Cookie 在不活动 30 天后过期。
* 我们不会为机器人或爬虫创建会话。
* 我们将 Cookie 和会话用于：
  * 身份验证和登录状态
  * 双因素身份验证的"记住我"功能
  * 闪现消息和通知


## Analytics {#analytics}

我们使用自己的注重隐私的分析系统来了解我们的服务如何被使用。该系统以隐私为核心原则设计：

**我们不收集的内容：**

* 我们不存储IP地址
* 我们不使用Cookie或持久标识符进行分析
* 我们不使用任何第三方分析服务
* 我们不跨天或跨会话跟踪用户

**我们收集的内容（匿名化）：**

* 汇总的页面浏览量和服务使用情况（SMTP、IMAP、POP3、API等）
* 浏览器和操作系统类型（从用户代理解析，原始数据被丢弃）
* 设备类型（桌面、移动、平板）
* 引荐域名（非完整URL）
* 邮件协议的邮件客户端类型（例如 Thunderbird、Outlook）

**数据保留：**

* 分析数据会在30天后自动删除
* 会话标识符每日轮换，无法用于跨天跟踪用户


## Information Shared {#information-shared}

我们不会与任何第三方共享您的信息。

我们可能需要并将遵守法院的法律请求（但请记住，[我们不收集“未收集信息”部分提到的信息](#information-not-collected)，因此我们根本无法提供这些信息）。


## Information Removal {#information-removal}

如果您任何时候希望删除您提供给我们的信息，请前往 <a href="/my-account/security">我的账户 > 安全</a> 并点击“删除账户”。

由于防止滥用和缓解风险，如果您在首次付款后5天内删除账户，您的账户可能需要我们的管理员进行人工删除审核。

此过程通常少于24小时完成，之所以实施，是因为有用户滥用我们的服务后迅速删除账户——这阻止了我们在Stripe中封锁他们的支付方式指纹。


## Additional Disclosures {#additional-disclosures}

本网站受Cloudflare保护，其[隐私政策](https://www.cloudflare.com/privacypolicy/)和[服务条款](https://www.cloudflare.com/website-terms/)适用。
