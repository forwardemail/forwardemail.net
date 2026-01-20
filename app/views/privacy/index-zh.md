# 隐私政策 {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" class="rounded-lg" />

## 目录 {#table-of-contents}

* [免责声明](#disclaimer)
* [未收集信息](#information-not-collected)
* [收集的信息](#information-collected)
* [信息共享](#information-shared)
* [信息删除](#information-removal)
* [补充披露](#additional-disclosures)

## 免责声明 {#disclaimer}

请遵循我们的 [条款](/terms)，因为它适用于整个网站。

## 信息未收集 {#information-not-collected}

**除 [错误](/faq#do-you-store-error-logs)、[出站 SMTP 电子邮件](/faq#do-you-support-sending-email-with-smtp) 和/或检测到垃圾邮件或恶意活动时（例如，为了限制速率）：**

* 我们不会将任何转发的电子邮件存储到磁盘存储或数据库中。
* 我们不会将任何有关电子邮件的元数据存储到磁盘存储或数据库中。
* 我们不会将任何日志或 IP 地址存储到磁盘存储或数据库中。

## 已收集信息 {#information-collected}

为了透明起见，您可以随时<a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">查看我们的源代码</a>，了解以下信息的收集和使用方式：

**严格为了功能和改进我们的服务，我们收集并安全地存储以下信息：**

* 我们将电子邮件和日历信息存储在您的 [加密的 SQLite 数据库](/blog/docs/best-quantum-safe-encrypted-email-service) 中，仅用于您的 IMAP/POP3/CalDAV/CardDAV 访问和邮箱功能。
* 请注意，如果您仅使用我们的电子邮件转发服务，则不会将任何电子邮件存储到磁盘或数据库中，如 [未收集信息](#information-not-collected) 中所述。
* 我们的电子邮件转发服务仅在内存中运行（不会写入磁盘存储或数据库）。
* IMAP/POP3/CalDAV/CardDAV 存储是静态加密、传输加密的，并存储在 LUKS 加密磁盘上。
* 您的 IMAP/POP3/CalDAV/CardDAV 存储的备份是静态加密、传输加密的，并存储在 [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) 上。
* 我们在会话中存储 cookie，用于网站流量。
* 我们会存储您提供给我们的电子邮件地址。
* 我们会存储您提供的域名、别名和配置。
* 我们会将 `4xx` 和 `5xx` SMTP 响应代码以及 [错误日志](/faq#do-you-store-error-logs) 存储 7 天。
* 我们会将 [出站 SMTP 电子邮件](/faq#do-you-support-sending-email-with-smtp) 存储 \~30 天。
* 此存储时长会根据“日期”标头而有所不同；因为如果存在未来的“日期”标头，我们就会允许将来发送电子邮件。
* **请注意，一旦电子邮件成功送达或出现永久错误，我们将编辑并清除邮件正文。**
* 如果您希望将出站 SMTP 电子邮件正文的保留时间配置为超过默认值 0 天（成功送达或出现永久错误后），请前往您域名的“高级设置”，并输入介于 `0` 和 `30` 之间的值。
* 一些用户喜欢使用 [我的帐户 > 电子邮件](/my-account/emails) 预览功能来查看他们的电子邮件是如何呈现的，因此我们支持可配置的保留期。
* 请注意，我们也支持 __PROTECTED_LINK_30__0。
* 您自愿提供给我们的任何其他信息，例如通过电子邮件或在我们的<a href="/help">帮助</a>页面上提交的评论或问题。

## 信息共享 {#information-shared}

我们不会与任何第三方共享您的信息。我们也不使用任何第三方分析或遥测软件服务。

我们可能需要并将遵守法院命令的法律要求（但请记住 [我们不收集上述“未收集的信息”中提到的信息](#information-not-collected)，因此我们一开始就无法提供它）。

## 信息删除 {#information-removal}

如果您希望随时删除向我们提供的信息，请前往<a href="/my-account/security">我的帐户 > 安全</a>，然后单击“删除帐户”。

出于防止和缓解滥用的目的，如果您在首次付款后 5 天内删除您的帐户，则可能需要我们的管理员进行手动删除审核。

此过程通常需要不到 24 小时，其实施是因为用户使用我们的服务发送垃圾邮件，然后迅速删除他们的帐户 - 这使得我们无法在 Stripe 中阻止他们的付款方式指纹。

## 附加披露信息 {#additional-disclosures}

该网站受 Cloudflare 保护，并适用其 [隐私政策](https://www.cloudflare.com/privacypolicy/) 和 [服务条款](https://www.cloudflare.com/website-terms/)。