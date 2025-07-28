# 常见问题 {#frequently-asked-questions}

<img 加载="懒惰" src="/img/articles/faq.webp" alt="" class="rounded-lg" />

## 目录 {#table-of-contents}

* [快速入门](#quick-start)
* [介绍](#introduction)
  * [什么是转发电子邮件](#what-is-forward-email)
  * [谁使用转发电子邮件](#who-uses-forward-email)
  * [Forward Email 的历史记录是什么](#what-is-forward-emails-history)
  * [这项服务有多快](#how-fast-is-this-service)
* [电子邮件客户端](#email-clients)
  * [雷鸟](#thunderbird)
  * [微软 Outlook](#microsoft-outlook)
  * [苹果邮件](#apple-mail)
  * [移动设备](#mobile-devices)
  * [如何使用 Gmail 发送邮件](#how-to-send-mail-as-using-gmail)
  * [使用 Gmail 发送邮件的旧版免费指南是什么](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [高级 Gmail 路由配置](#advanced-gmail-routing-configuration)
  * [高级 Outlook 路由配置](#advanced-outlook-routing-configuration)
* [故障排除](#troubleshooting)
  * [为什么我收不到测试邮件](#why-am-i-not-receiving-my-test-emails)
  * [如何配置我的电子邮件客户端以使用“转发电子邮件”](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [为什么我的电子邮件被归类为垃圾邮件和垃圾邮件？我该如何检查我的域名声誉？](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [收到垃圾邮件该怎么办](#what-should-i-do-if-i-receive-spam-emails)
  * [为什么我发送给自己的测试邮件在 Gmail 中显示为“可疑”](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [我可以删除 Gmail 中的 via forwardemail dot net 吗](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [数据管理](#data-management)
  * [你们的服务器位于哪里](#where-are-your-servers-located)
  * [如何导出和备份我的邮箱](#how-do-i-export-and-backup-my-mailbox)
  * [如何导入和迁移我现有的邮箱](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [你们支持自托管吗](#do-you-support-self-hosting)
* [电子邮件配置](#email-configuration)
  * [如何开始并设置电子邮件转发](#how-do-i-get-started-and-set-up-email-forwarding)
  * [我可以使用多个 MX 交换器和服务器进行高级转发吗？](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [如何设置休假回复程序（外出自动回复程序）](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [如何设置 SPF 以转发电子邮件](#how-do-i-set-up-spf-for-forward-email)
  * [如何设置 DKIM 以转发电子邮件](#how-do-i-set-up-dkim-for-forward-email)
  * [如何设置 DMARC 以转发电子邮件](#how-do-i-set-up-dmarc-for-forward-email)
  * [如何连接和配置我的联系人](#how-do-i-connect-and-configure-my-contacts)
  * [如何连接和配置我的日历](#how-do-i-connect-and-configure-my-calendars)
  * [如何添加更多日历和管理现有日历](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [如何设置 SRS 来转发电子邮件](#how-do-i-set-up-srs-for-forward-email)
  * [如何设置 MTA-STS 来转发电子邮件](#how-do-i-set-up-mta-sts-for-forward-email)
  * [如何在我的电子邮件地址中添加个人资料图片](#how-do-i-add-a-profile-picture-to-my-email-address)
* [高级功能](#advanced-features)
  * [您是否支持营销相关电子邮件的新闻通讯或邮件列表](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [你们支持用API发送电子邮件吗](#do-you-support-sending-email-with-api)
  * [您是否支持使用 IMAP 接收电子邮件](#do-you-support-receiving-email-with-imap)
  * [你们支持POP3吗](#do-you-support-pop3)
  * [您是否支持日历（CalDAV）](#do-you-support-calendars-caldav)
  * [您是否支持联系人（CardDAV）](#do-you-support-contacts-carddav)
  * [您是否支持使用 SMTP 发送电子邮件](#do-you-support-sending-email-with-smtp)
  * [您是否支持 OpenPGP/MIME、端到端加密（“E2EE”）和 Web 密钥目录（“WKD”）](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [您是否支持 MTA-STS](#do-you-support-mta-sts)
  * [你们支持密码和 WebAuthn 吗](#do-you-support-passkeys-and-webauthn)
  * [您是否支持电子邮件最佳实践](#do-you-support-email-best-practices)
  * [您是否支持反弹 webhook](#do-you-support-bounce-webhooks)
  * [您是否支持 webhook](#do-you-support-webhooks)
  * [您是否支持正则表达式或 regex](#do-you-support-regular-expressions-or-regex)
  * [您的出站 SMTP 限制是多少](#what-are-your-outbound-smtp-limits)
  * [我需要批准才能启用 SMTP 吗](#do-i-need-approval-to-enable-smtp)
  * [您的 SMTP 服务器配置设置是什么](#what-are-your-smtp-server-configuration-settings)
  * [您的 IMAP 服务器配置设置是什么](#what-are-your-imap-server-configuration-settings)
  * [您的 POP3 服务器配置设置是什么](#what-are-your-pop3-server-configuration-settings)
  * [Postfix SMTP 中继配置](#postfix-smtp-relay-configuration)
* [安全](#security)
  * [高级服务器强化技术](#advanced-server-hardening-techniques)
  * [您有 SOC 2 或 ISO 27001 认证吗](#do-you-have-soc-2-or-iso-27001-certifications)
  * [您是否使用 TLS 加密来转发电子邮件](#do-you-use-tls-encryption-for-email-forwarding)
  * [您是否保留电子邮件身份验证标头](#do-you-preserve-email-authentication-headers)
  * [您是否保留原始电子邮件标题并防止欺骗](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [如何防范垃圾邮件和滥用](#how-do-you-protect-against-spam-and-abuse)
  * [您是否将电子邮件内容存储在磁盘上](#do-you-store-email-content-on-disk)
  * [系统崩溃时电子邮件内容是否会被泄露](#can-email-content-be-exposed-during-system-crashes)
  * [谁有权访问您的电子邮件基础设施](#who-has-access-to-your-email-infrastructure)
  * [您使用哪些基础设施提供商](#what-infrastructure-providers-do-you-use)
  * [你们提供数据处理协议 (DPA) 吗？](#do-you-offer-a-data-processing-agreement-dpa)
  * [如何处理数据泄露通知](#how-do-you-handle-data-breach-notifications)
  * [你们提供测试环境吗](#do-you-offer-a-test-environment)
  * [你们提供监控和警报工具吗](#do-you-provide-monitoring-and-alerting-tools)
  * [如何确保高可用性](#how-do-you-ensure-high-availability)
  * [您是否遵守《国防授权法案》（NDAA）第 889 条](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [系统和技术细节](#system-and-technical-details)
  * [您是否存储电子邮件及其内容](#do-you-store-emails-and-their-contents)
  * [您的电子邮件转发系统如何工作](#how-does-your-email-forwarding-system-work)
  * [如何处理电子邮件以便转发](#how-do-you-process-an-email-for-forwarding)
  * [如何处理电子邮件传递问题](#how-do-you-handle-email-delivery-issues)
  * [如何处理被阻止的 IP 地址](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [什么是邮政局长地址](#what-are-postmaster-addresses)
  * [什么是无回复地址](#what-are-no-reply-addresses)
  * [你的服务器的 IP 地址是什么](#what-are-your-servers-ip-addresses)
  * [你有允许名单吗](#do-you-have-an-allowlist)
  * [哪些域名扩展默认列入允许名单](#what-domain-name-extensions-are-allowlisted-by-default)
  * [你的允许名单标准是什么](#what-is-your-allowlist-criteria)
  * [哪些域名后缀可以免费使用](#what-domain-name-extensions-can-be-used-for-free)
  * [你有灰名单吗](#do-you-have-a-greylist)
  * [您有拒绝名单吗？](#do-you-have-a-denylist)
  * [你有速率限制吗](#do-you-have-rate-limiting)
  * [如何防止背向散射](#how-do-you-protect-against-backscatter)
  * [防止来自已知垃圾邮件发送者的邮件被退回](#prevent-bounces-from-known-mail-from-spammers)
  * [防止不必要的反弹以防止背向散射](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [如何确定电子邮件指纹](#how-do-you-determine-an-email-fingerprint)
  * [我可以将电子邮件转发到 25 以外的端口吗（例如，如果我的 ISP 已阻止端口 25）](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [它是否支持 Gmail 别名的加号 +](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [它是否支持子域名](#does-it-support-sub-domains)
  * [这会转发我的电子邮件标题吗](#does-this-forward-my-emails-headers)
  * [这是经过充分测试的吗](#is-this-well-tested)
  * [您是否传递 SMTP 响应消息和代码](#do-you-pass-along-smtp-response-messages-and-codes)
  * [如何防止垃圾邮件发送者并确保良好的电子邮件转发声誉](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [如何对域名执行 DNS 查找](#how-do-you-perform-dns-lookups-on-domain-names)
* [账户和账单](#account-and-billing)
  * [你们是否为付费计划提供退款保证](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [如果我更换计划，你们会按比例退还差额吗](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [我可以将此电子邮件转发服务用作“后备”或“故障转移” MX 服务器吗？](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [我可以禁用特定别名吗](#can-i-disable-specific-aliases)
  * [我可以将电子邮件转发给多个收件人吗](#can-i-forward-emails-to-multiple-recipients)
  * [我可以有多个全局接收者吗](#can-i-have-multiple-global-catch-all-recipients)
  * [每个别名可以转发的电子邮件地址数量是否有最大限制](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [我可以递归转发电子邮件吗](#can-i-recursively-forward-emails)
  * [未经我的许可，其他人可以注销或注册我的电子邮件转发吗？](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [怎么免费](#how-is-it-free)
  * [电子邮件大小上限是多少](#what-is-the-max-email-size-limit)
  * [你们会保存电子邮件日志吗](#do-you-store-logs-of-emails)
  * [您是否存储错误日志](#do-you-store-error-logs)
  * [你看过我的电子邮件吗](#do-you-read-my-emails)
  * [我可以在 Gmail 中使用此邮件发送邮件吗？](#can-i-send-mail-as-in-gmail-with-this)
  * [我可以在 Outlook 中使用此邮件发送邮件吗？](#can-i-send-mail-as-in-outlook-with-this)
  * [我可以在 Apple Mail 和 iCloud Mail 中用这个发送邮件吗？](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [我可以无限转发电子邮件吗](#can-i-forward-unlimited-emails-with-this)
  * [你们是否提供无限域名](#do-you-offer-unlimited-domains-for-one-price)
  * [你们接受哪些付款方式](#which-payment-methods-do-you-accept)
* [其他资源](#additional-resources)

## 快速入门 {#quick-start}

要开始转发电子邮件：

1. 在 [forwardemail.net/register](https://forwardemail.net/register) **创建账户**

2. 在 [我的账户 → 域名](/my-account/domains) 下**添加并验证您的域名**

3. 在 [我的账户 → 域名](/my-account/domains) → 别名下**添加并配置电子邮件别名/邮箱**

4. 通过向您的新别名之一发送电子邮件来**测试您的设置**

> \[!TIP]
> DNS changes can take up to 24-48 hours to propagate globally, though they often take effect much sooner.

> \[!IMPORTANT]
> For enhanced deliverability, we recommend setting up [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), and [DMARC](#how-do-i-set-up-dmarc-for-forward-email) records.

## 简介 {#introduction}

### 什么是转发电子邮件 {#what-is-forward-email}

> \[!NOTE]
> Forward Email is perfect for individuals, small businesses, and developers who want professional email addresses without the cost and maintenance of a full email hosting solution.

Forward Email 是一家**功能齐全的电子邮件服务提供商**和**自定义域名的电子邮件托管提供商**。

这是唯一的免费开源服务，让您可以使用自定义域电子邮件地址，而无需设置和维护自己的电子邮件服务器。

我们的服务将发送到您的自定义域的电子邮件转发到您现有的电子邮件帐户 - 您甚至可以将我们用作您的专用电子邮件托管服务提供商。

转发电子邮件的主要功能：

* **自定义域名邮箱**：使用您自己的域名作为专业邮箱地址
* **免费套餐**：免费提供基本邮件转发服务
* **增强隐私**：我们不会阅读您的邮件或出售您的数据
* **开源**：我们的全部代码库均可在 GitHub 上获取
* **支持 SMTP、IMAP 和 POP3**：完整的邮件收发功能
* **端到端加密**：支持 OpenPGP/MIME
* **自定义 Catch-All 别名**：创建无限数量的邮件别名

您可以在[我们的电子邮件比较页面](/blog/best-email-service)上将我们与 56 多个其他电子邮件服务提供商进行比较。

> \[!TIP]
> Learn more about Forward Email by reading our free [Technical Whitepaper](/technical-whitepaper.pdf)

### 谁使用转发电子邮件 {#who-uses-forward-email}

我们为 500,000 多个域名和以下知名用户提供电子邮件托管和电子邮件转发服务：

| 顾客 | 案例研究 |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 美国海军学院 | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| 典范 | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Netflix 游戏 |  |
| Linux基金会 | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| PHP基金会 |  |
| 福克斯新闻电台 |  |
| 迪士尼广告销售 |  |
| jQuery | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| LineageOS |  |
| Ubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| 自由的 | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| 鲁班图 | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| 剑桥大学 | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| 马里兰大学 | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| 华盛顿大学 | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| 塔夫茨大学 | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| 斯沃斯莫尔学院 | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| 南澳大利亚州政府 |  |
| 多米尼加共和国政府 |  |
| Fly<span>.</span>io |  |
| RCD 酒店 |  |
| Isaac Z. Schlueter（npm） | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson（Ruby on Rails） |  |

### 转发电子邮件的历史记录是什么 {#what-is-forward-emails-history}

您可以在[我们的“关于”页面](/about)上了解有关转发电子邮件的更多信息。

### 这项服务的速度有多快？{#how-fast-is-this-service}

> \[!NOTE]
> Our system is designed for speed and reliability, with multiple redundant servers to ensure your emails are delivered promptly.

转发电子邮件可以以最小的延迟传递消息，通常在收到后的几秒钟内。

性能指标：

* **平均送达时间**：从接收到转发只需不到 5-10 秒 ([请参阅我们的收件箱时间“TTI”监控页面](/tti))
* **正常运行时间**：服务可用性高达 99.9% 以上
* **全球基础设施**：服务器位于战略位置，可实现最佳路由
* **自动扩展**：我们的系统会在电子邮件高峰期进行扩展

我们实时运营，不像其他依赖延迟队列的提供商。

我们不会使用 [错误异常](#do-you-store-error-logs) 和 [出站 SMTP](#do-you-support-sending-email-with-smtp) 写入磁盘或存储日志（请参阅我们的 [隐私政策](/privacy)）。

所有操作均在内存中完成，并且[我们的源代码在 GitHub 上](https://github.com/forwardemail)。

## 电子邮件客户端 {#email-clients}

### 雷鸟 {#thunderbird}

1. 在“转发邮件”信息中心创建新别名并生成密码
2. 打开 Thunderbird，前往“编辑 → 账户设置 → 账户操作 → 添加邮件账户”
3. 输入您的姓名、转发邮件地址和密码
4. 点击“手动配置”并输入：
* 接收邮件：IMAP，`imap.forwardemail.net`，端口 993，SSL/TLS
* 发送邮件：SMTP，`smtp.forwardemail.net`，端口 587，STARTTLS
5. 点击“完成”

### Microsoft Outlook {#microsoft-outlook}

1. 在您的“转发邮件”信息中心中创建新的别名并生成密码
2. 前往“文件”→“添加帐户”
3. 输入您的转发邮件地址，然后点击“连接”
4. 选择“高级选项”，然后选择“让我手动设置我的帐户”
5. 选择“IMAP”并输入：
* 接收邮件：`imap.forwardemail.net`，端口 993，SSL
* 发送邮件：`smtp.forwardemail.net`，端口 587，TLS
* 用户名：您的完整电子邮件地址
* 密码：您生成的密码
6. 点击“连接”

### 苹果邮件 {#apple-mail}

1. 在“转发邮件”面板中创建新别名并生成密码
2. 前往“邮件”→“偏好设置”→“帐户”→“+”
3. 选择“其他邮件帐户”
4. 输入您的姓名、转发邮件地址和密码
5. 在服务器设置中，请输入：
* 接收邮件：`imap.forwardemail.net`
* 发送邮件：`smtp.forwardemail.net`
* 用户名：您的完整电子邮件地址
* 密码：您生成的密码
6. 点击“登录”

### 移动设备 {#mobile-devices}

对于 iOS：

1. 前往“设置”→“邮件”→“帐户”→“添加帐户”→“其他”
2. 点击“添加邮件帐户”并输入您的详细信息
3. 对于服务器设置，请使用与上述相同的 IMAP 和 SMTP 设置

对于Android：

1. 前往“设置”→“账户”→“添加账户”→“个人 (IMAP)”
2. 输入您的转发邮箱地址和密码
3. 服务器设置请使用与上述相同的 IMAP 和 SMTP 设置

### 如何使用 Gmail 发送邮件 {#how-to-send-mail-as-using-gmail}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">预计设置时间：</strong>
<span>少于 10 分钟</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
入门指南：
</strong>
<span>
如果您已按照上述<a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">如何开始并设置电子邮件转发</a>中的说明操作，则可以继续阅读下文。
</span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
请确保您已阅读我们的<a href="/terms" class="alert-link" target="_blank">条款</a>、<a href="/privacy" class="alert-link" target="_blank">隐私政策</a>以及<a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">出站 SMTP 限制</a>——您的使用将被视为确认并同意。
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
如果您是开发者，请参阅我们的<a class="alert-link" href="/email-api#outbound-emails" target="_blank">电子邮件 API 文档</a>。
</span>
</div>

1. 前往<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">我的账户<i class="fa fa-angle-right"></i>域名</a> <i class="fa fa-angle-right"></i>设置<i class="fa fa-angle-right"></i>出站 SMTP 配置并按照设置说明进行操作

2. 在<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的帐户<i class="fa fa-angle-right"></i>域名</a> <i class="fa fa-angle-right"></i>别名下为您的域名创建一个新的别名（例如 <code><hello@example.com></code>）

3. 点击新创建的别名旁边的<strong class="text-success"><i class="fa fa-key"></i>生成密码</strong>。将其复制到剪贴板并安全存储屏幕上显示的生成密码。

4. 前往 [Gmail](https://gmail.com)，然后在 [设置<i class="fa fa-angle-right"></i> 帐户和导入<i class="fa fa-angle-right"></i> 以...身份发送邮件](https://mail.google.com/mail/u/0/#settings/accounts) 下点击“添加其他电子邮件地址”

5. 当提示输入“姓名”时，输入您希望电子邮件显示为“发件人”的姓名（例如“Linus Torvalds”）。

6. 当系统提示输入“电子邮件地址”时，请输入您在<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的帐户<i class="fa fa-angle-right"></i>域</a> <i class="fa fa-angle-right"></i>别名下创建的别名的完整电子邮件地址（例如 <code><hello@example.com></code>）

7.取消选中“视为别名”

8. 点击“下一步”继续

9. 当提示“SMTP 服务器”时，输入 <code>smtp.forwardemail.net</code>，并将端口保留为 <code>587</code>

10. 当提示输入“用户名”时，请输入您在<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的帐户<i class="fa fa-angle-right"></i>域</a> <i class="fa fa-angle-right"></i>别名下创建的别名的完整电子邮件地址（例如<code><hello@example.com></code>）

11. 当提示输入“密码”时，请粘贴上述第 3 步中<strong class="text-success"><i class="fa fa-key"></i>生成密码</strong>中输入的密码

12. 保留“使用 TLS 的安全连接”单选按钮的选中状态

13. 点击“添加账户”继续

14. 打开新标签页访问 [Gmail](https://gmail.com) 并等待验证邮件到达（您将收到一个验证码，确认您是您尝试“以此身份发送邮件”的电子邮件地址的所有者）

15. 收到验证码后，请复制并粘贴上一步中收到的验证码

16. 完成后，返回邮件并点击“确认请求”链接。您很可能需要同时执行此步骤和上一步，以确保邮件配置正确。

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
恭喜！
</strong>
<span>
您已成功完成所有步骤。
</span>
</div>
</div>

</div>

### 使用 Gmail 发送邮件的旧版免费指南是什么？{#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">重要提示：</strong>自<a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we 现已支持出站 SMTP</a>以来，此旧版免费指南已于 2023 年 5 月弃用。如果您使用以下指南，<a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this 将导致您的出站电子邮件</a>在 Gmail 中显示“<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>”。</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">预计设置时间：</strong>
<span>少于 10 分钟</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
入门指南：
</strong>
<span>
如果您已按照上述<a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">如何开始并设置电子邮件转发</a>中的说明操作，则可以继续阅读下文。
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="如何使用 Gmail 发送邮件" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. 您需要启用 [Gmail 双重身份验证][gmail-2fa] 才能使用此功能。如果您尚未启用，请访问 <https://www.google.com/landing/2step/>。

2. 启用双重身份验证后（或者如果您已经启用），请访问 <https://myaccount.google.com/apppasswords>.

3. 当系统提示“选择要为其生成应用密码的应用和设备”时：
* 在“选择应用”下拉菜单中选择“邮件”
* 在“选择设备”下拉菜单中选择“其他”
* 当系统提示输入文本时，请输入您要转发邮件的自定义域名的电子邮件地址（例如 <code><hello@example.com></code> - 如果您将此服务用于多个帐户，这将帮助您进行跟踪）

4. 将自动生成的密码复制到剪贴板
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
如果您使用的是 G Suite，请访问您的管理面板 <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">应用 <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Gmail 设置 <i class="fa fa-angle-right"></i> 设置</a>，并确保选中“允许用户通过外部 SMTP 服务器发送邮件...”。此更改生效可能需要一些延迟，请等待几分钟。
</span>
</div>

5. 前往 [Gmail](https://gmail.com)，然后在 [设置<i class="fa fa-angle-right"></i> 帐户和导入<i class="fa fa-angle-right"></i> 以...身份发送邮件](https://mail.google.com/mail/u/0/#settings/accounts) 下点击“添加其他电子邮件地址”

6. 当提示输入“姓名”时，请输入您希望电子邮件显示为“发件人”的姓名（例如“Linus Torvalds”）

7. 当提示输入“电子邮件地址”时，请输入您上面使用的自定义域名的电子邮件地址（例如 <code><hello@example.com></code>）

8.取消选中“视为别名”

9. 点击“下一步”继续

10. 当提示“SMTP 服务器”时，输入 <code>smtp.gmail.com</code>，并将端口保留为 <code>587</code>

11. 当系统提示输入“用户名”时，请输入您的 Gmail 地址中不带 <span>gmail.com</span> 的部分（例如，如果我的邮箱是 <span><user@gmail.com></span>，则只需输入“user”即可）。
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
如果“用户名”部分已自动填充，则<u><strong>您需要将其</strong></u>更改为您的 Gmail 地址中的用户名部分。
</span>
</div>

12. 当提示输入“密码”时，从剪贴板粘贴您在上述步骤 2 中生成的密码

13. 保留“使用 TLS 的安全连接”单选按钮的选中状态

14. 点击“添加账户”继续

15. 打开新标签页访问 [Gmail](https://gmail.com) 并等待验证邮件到达（您将收到一个验证码，确认您是您尝试“以此身份发送邮件”的电子邮件地址的所有者）

16. 收到验证码后，请复制并粘贴上一步中收到的验证码

17. 完成后，返回邮件并点击“确认请求”链接。您很可能需要同时执行此步骤和上一步，以确保邮件配置正确。

</div>

### 高级 Gmail 路由配置 {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">预计设置时间：</strong>
<span>15-30 分钟</span>
</div>

如果您想在 Gmail 中设置高级路由，以便与邮箱不匹配的别名将转发到转发电子邮件的邮件交换，请按照以下步骤操作：

1. 登录您的 Google 管理控制台（网址为 [admin.google.com](https://admin.google.com)）
2. 前往 **应用 → Google Workspace → Gmail → 路由**
3. 点击 **添加路由** 并配置以下设置：

**单个收件人设置：**

* 选择“更改信封收件人”并输入您的主要 Gmail 地址
* 勾选“添加 X-Gm-Original-To 标头并注明原始收件人”

**信封收件人图案：**

* 添加与所有不存在的邮箱匹配的模式（例如，`.*@yourdomain.com`）

**电子邮件服务器设置：**

* 选择“路由到主机”，并输入 `mx1.forwardemail.net` 作为主服务器
* 添加 `mx2.forwardemail.net` 作为备用服务器
* 将端口设置为 25
* 选择“需要 TLS”以确保安全性

4. 点击**保存**创建路线

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
此配置仅适用于具有自定义域名的 Google Workspace 帐号，不适用于常规 Gmail 帐号。
</span>
</div>

### 高级 Outlook 路由配置 {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">预计设置时间：</strong>
<span>15-30 分钟</span>
</div>

对于想要设置高级路由的 Microsoft 365（以前称为 Office 365）用户，以便与邮箱不匹配的别名将转发到转发电子邮件的邮件交换：

1. 登录 Microsoft 365 管理中心，网址为 [admin.microsoft.com](https://admin.microsoft.com)
2. 前往 **Exchange → 邮件流 → 规则**
3. 点击 **添加规则**，然后选择 **创建新规则**
4. 为您的规则命名（例如，“将不存在的邮箱转发到转发邮件”）
5. 在 **如果应用此规则** 下，选择：
* “收件人地址匹配……”
* 输入与您域中所有地址匹配的模式（例如 `*@yourdomain.com`）
6. 在 **执行以下操作** 下，选择：
* “将邮件重定向到……”
* 选择“以下邮件服务器”
* 输入 `mx1.forwardemail.net` 和端口 25
* 添加 `mx2.forwardemail.net` 作为备用服务器
7. 在 **除非** 下，选择：
* “收件人是……”
* 添加您的所有不应转发的现有邮箱
8. 设置规则优先级，确保其在其他邮件流规则之后运行
9. 点击**保存**以激活规则

## 故障排除 {#troubleshooting}

### 为什么我收不到测试邮件 {#why-am-i-not-receiving-my-test-emails}

如果您向自己发送测试电子邮件，那么它可能不会出现在您的收件箱中，因为它具有相同的“Message-ID”标头。

这是一个众所周知的问题，也会影响 Gmail 等服务。<a href="https://support.google.com/a/answer/1703601">Here 是 Gmail 针对此问题的官方解答</a>。

如果问题仍然存在，则很可能是 DNS 传播问题。您需要等待一段时间后再试（或尝试在 <strong class="notranslate">TXT</strong> 记录中设置较低的 TTL 值）。

**仍有问题？**请<a href="/help">联系我们</a>，以便我们帮助调查问题并快速找到解决方案。

### 如何配置我的电子邮件客户端以使用转发电子邮件 {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
我们的服务兼容以下主流电子邮件客户端：
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> 桌面</a></li>
<li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> 终端</a></li>
</ul>
</div>

<div class="alert alert-primary">
您的用户名是您别名的电子邮件地址，密码来自<strong class="text-success"><i class="fa fa-key"></i>生成密码</strong>（“普通密码”）。
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
<span>如果您使用的是 Thunderbird，请确保“连接安全性”设置为“SSL/TLS”，并将身份验证方法设置为“普通密码”。</span>
</div>

| 类型 | 主机名 | 协议 | 端口 |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **首选** | `993` 和 `2993` |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **首选** 或 TLS (STARTTLS) | SSL/TLS 的 `465` 和 `2465`（或）TLS（STARTTLS）的 `587`、`2587`、`2525` 和 `25` |

### 为什么我的电子邮件被归类为垃圾邮件和垃圾邮件，我该如何检查我的域名信誉？{#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

本部分将指导您，您的外发邮件是否使用我们的 SMTP 服务器（例如 `smtp.forwardemail.net`）（或通过 `mx1.forwardemail.net` 或 `mx2.forwardemail.net` 转发），并且是否被投递到收件人的垃圾邮件或垃圾文件夹中。

我们定期监控我们的[IP 地址](#what-are-your-servers-ip-addresses)与[所有信誉良好的 DNS 拒绝列表](#how-do-you-handle-your-ip-addresses-becoming-blocked)之间的差异，**因此这很可能是一个与域名声誉相关的问题**。

电子邮件可能由于以下几个原因而被归入垃圾邮件文件夹：

1. **缺少身份验证**：设置[SPF](#how-do-i-set-up-spf-for-forward-email)、[DKIM](#how-do-i-set-up-dkim-for-forward-email)和[DMARC](#how-do-i-set-up-dmarc-for-forward-email)记录。

2. **域名信誉**：新域名通常具有中性信誉，直到建立发送历史记录。

3. **内容触发器**：某些单词或短语可以触发垃圾邮件过滤器。

4. **发送模式**：电子邮件数量的突然增加看起来很可疑。

您可以尝试使用以下一个或多个工具来检查您的域名的信誉和分类：

| 工具名称 | URL | 类型 |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Cloudflare 域名分类反馈 | <https://radar.cloudflare.com/domains/feedback> | 分类 |
| Spamhaus IP 和域名信誉检查器 | <https://check.spamhaus.org/> | DNSBL |
| Cisco Talos IP 和域名信誉中心 | <https://talosintelligence.com/reputation_center> | 名声 |
| Barracuda IP 和域名信誉查询 | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| MX Toolbox 黑名单检查 | <https://mxtoolbox.com/blacklists.aspx> | 黑名单 |
| Google 邮政局长工具 | <https://www.gmail.com/postmaster/> | 名声 |
| 雅虎发件人中心 | <https://senders.yahooinc.com/> | 名声 |
| MultiRBL.valli.org 黑名单检查 | <https://multirbl.valli.org/lookup/> | DNSBL |
| 发件人分数 | <https://senderscore.org/act/blocklist-remover/> | 名声 |
| 贬值 | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| Apple/Proofpoint IP 删除 | <https://ipcheck.proofpoint.com/> | 移动 |
| 删除 Cloudmark IP | <https://csi.cloudmark.com/en/reset/> | 移动 |
| 垃圾邮件警察 | <https://www.spamcop.net/bl.shtml> | DNSBL |
| Microsoft Outlook 和 Office 365 IP 删除 | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | 移动 |
| UCEPROTECT 的 1、2 和 3 级 | <https://www.uceprotect.net/en/rblcheck.php> | DNSBL |
| UCEPROTECT 的 backscatterer.org | <https://www.backscatterer.org/> | 背散射保护 |
| UCEPROTECT 的 whitelisted.org | <https://www.whitelisted.org/>（需付费） | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | 移动 |
| AOL/Verizon（例如 `[IPTS04]`） | <https://senders.yahooinc.com/> | 移动 |
| 考克斯通讯公司 | `unblock.request@cox.net` | 移动 |
| t-online.de（德语/T-Mobile） | `tobr@rx.t-online.de` | 移动 |

> \[!TIP]
> Start with a low volume of high-quality emails to build a positive reputation before sending in larger volumes.

> \[!IMPORTANT]
> If your domain is on a blacklist, each blacklist has its own removal process. Check their websites for instructions.

> \[!TIP]
> If you need additional help or find that we are false-positive listed as spam by a certain email service provider, then please <a href="/help">contact us</a>.

### 如果我收到垃圾邮件该怎么办？{#what-should-i-do-if-i-receive-spam-emails}

您应该取消订阅电子邮件列表（如果可能）并阻止发件人。

请不要将该消息报告为垃圾邮件，而是将其转发到我们手动策划且注重隐私的滥用预防系统。

**转发垃圾邮件的电子邮件地址是：** <abuse@forwardemail.net>

### 为什么我发送给自己的测试邮件在 Gmail 中显示为“可疑”{#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

如果您在向自己发送测试时在 Gmail 中看到此错误消息，或者当您使用别名发送电子邮件的人第一次看到您的电子邮件时，那么**请不要担心** - 因为这是 Gmail 的内置安全功能。

您只需点击“看起来安全”即可。例如，如果您使用“以身份发送邮件”功能向其他人发送测试邮件，那么他们将看不到此邮件。

但是，如果他们确实看到了这条消息，那是因为他们通常习惯于看到你的邮件来自 <john@gmail.com>，而不是 <john@customdomain.com>（仅举个例子）。Gmail 会提醒用户，以确保万无一失，但目前没有其他解决方法。

### 我可以删除 Gmail 中的 via forwardemail dot net 吗？{#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

此主题与[Gmail 中一个众所周知的问题：发件人姓名旁边会出现额外的信息](https://support.google.com/mail/answer/1311182)相关。

自 2023 年 5 月起，我们支持所有付费用户使用 SMTP 发送电子邮件作为附加功能 - 这意味着您可以在 Gmail 中删除 <span class="notranslate">via forwardemail dot net</span>。

请注意，此常见问题解答主题专门针对使用[如何使用 Gmail 发送邮件](#how-to-send-mail-as-using-gmail)功能的用户。

请参阅[您是否支持使用 SMTP 发送电子邮件](#do-you-support-sending-email-with-smtp)部分了解配置说明。

## 数据管理 {#data-management}

### 您的服务器位于哪里？{#where-are-your-servers-located}

> \[!TIP]
> We may soon announce our EU datacenter location hosted under [forwardemail.eu](https://forwardemail.eu).  Subscribe to the discussion at <https://github.com/orgs/forwardemail/discussions/336> for updates.

我们的服务器主要位于科罗拉多州丹佛市 - 请参阅<https://forwardemail.net/ips>以获取我们的完整 IP 地址列表。

您可以在我们的[GDPR](/gdpr)、[DPA](/dpa)和[隐私](/privacy)页面上了解我们的子处理器。

### 如何导出和备份我的邮箱 {#how-do-i-export-and-backup-my-mailbox}

您可以随时将您的邮箱导出为[EML](https://en.wikipedia.org/wiki/Email#Filename_extensions)、[Mbox](https://en.wikipedia.org/wiki/Mbox)或加密的[SQLite](https://en.wikipedia.org/wiki/SQLite)格式。

转至<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">我的帐户<i class="fa fa-angle-right"></i>域</a> <i class="fa fa-angle-right"></i>别名<i class="fa fa-angle-right"></i>下载备份并选择您喜欢的导出格式类型。

导出完成后，您将收到一封包含下载导出文件的链接的电子邮件。

请注意，出于安全考虑，此导出下载链接将在 4 小时后过期。

如果您需要检查导出的 EML 或 Mbox 格式，那么这些开源工具可能会有用：

| 姓名 | 格式 | 平台 | GitHub 网址 |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox 查看器 | Mbox | 视窗 | <https://github.com/eneam/mboxviewer> |
| mbox-web-viewer | Mbox | 所有平台 | <https://github.com/PHMRanger/mbox-web-viewer> |
| Eml阅读器 | EML | 视窗 | <https://github.com/ayamadori/EmlReader> |
| 电子邮件查看器 | EML | VSCode | <https://github.com/joelharkes/vscode_email_viewer> |
| eml阅读器 | EML | 所有平台 | <https://github.com/s0ph1e/eml-reader> |

此外，如果您需要将 Mbox 文件转换为 EML 文件，那么您可以使用 <https://github.com/noelmartinon/mboxzilla>.

### 如何导入和迁移我现有的邮箱 {#how-do-i-import-and-migrate-my-existing-mailbox}

您可以按照以下说明轻松地将您的电子邮件导入转发电子邮件（例如使用[雷鸟](https://www.thunderbird.net)）：

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
您必须遵循以下所有步骤才能导入现有电子邮件。
</span>
</div>

1. 从您现有的电子邮件提供商导出您的电子邮件：

| 电子邮件提供商 | 导出格式 | 出口指示 |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gmail | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| 前景 | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">提示：</strong> <span>如果您使用的是 Outlook（<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST 导出格式</a>），那么您只需按照下面“其他”下的说明进行操作即可。但是，我们提供了以下链接，可根据您的操作系统将 PST 转换为 MBOX/EML 格式：<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba for Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst for Windows cygwin</a> – （例如 <code>readpst -u -o $OUT_DIR $IN_DIR</code> 将 <code>$OUT_DIR</code> 和 <code>$IN_DIR</code> 替换为输出目录，分别将 <code>$OUT_DIR</code> 和 <code>$IN_DIR</code> 替换为输出目录和输入目录路径）。</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">适用于 Ubuntu/Linux 的 readpst</a> – （例如 <code>sudo apt-get install readpst</code>，然后执行 <code>readpst -u -o $OUT_DIR $IN_DIR</code>，分别将 <code>$OUT_DIR</code> 和 <code>$IN_DIR</code> 替换为输出目录和输入目录路径）。</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">适用于 macOS 的 readpst（通过 brew）</a> – （例如 <code>brew install libpst</code>，然后执行 <code>readpst -u -o $OUT_DIR $IN_DIR</code>，将 <code>$OUT_DIR</code> 和<code>$IN_DIR</code> 分别为输出目录和输入目录路径）。</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">适用于 Windows 的 PST 转换器 (GitHub)</a></li></ul><br /></span></div> |
| 苹果邮件 | MBOX | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974> |
| 快速邮件 | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail> |
| 质子邮件 | MBOX/EML | <https://proton.me/support/export-emails-import-export-app> |
| 图塔诺塔 | EML | <https://github.com/crepererum-oss/tatutanatata> |
| 思考 | EML | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents> |
| Zoho | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| 其他 | [Use Thunderbird](https://www.thunderbird.net) | 在 Thunderbird 中设置您现有的电子邮件帐户，然后使用 [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) 插件导出和导入您的电子邮件。**您也可以简单地在一个帐户之间复制/粘贴或拖放电子邮件。** |

2. 下载、安装并打开[雷鸟](https://www.thunderbird.net)。

3. 使用您别名的完整电子邮件地址（例如 <code><you@yourdomain.com></code>）和您生成的密码创建一个新帐户。<strong>如果您尚未生成密码，请<a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">参阅我们的设置说明</a></strong>。

4. 下载并安装[进出口工具](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird 插件。

5. 在 Thunderbird 中创建一个新的本地文件夹，然后右键单击它 → 选择 `ImportExportTools NG` 选项 → 选择 `Import mbox file`（用于 MBOX 导出格式） – 或 – `Import messages` / `Import all messages from a directory`（用于 EML 导出格式）。

6. 将本地文件夹拖放到 Thunderbird 中您想要使用我们的服务将邮件上传到 IMAP 存储的新建（或现有）IMAP 文件夹。这将确保邮件通过我们的 SQLite 加密存储进行在线备份。

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
<span>
如果您不清楚如何导入 Thunderbird，可以参考官方说明：<a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> 和 <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
完成导出和导入过程后，您可能还需要在现有电子邮件帐户中启用转发功能，并设置自动回复程序，以通知发件人您有新的电子邮件地址（例如，如果您之前使用的是 Gmail，现在使用的是带有自定义域名的电子邮件）。
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
恭喜！
</strong>
<span>
您已成功完成所有步骤。
</span>
</div>
</div>

### 您是否支持自托管 {#do-you-support-self-hosting}

是的，自 2025 年 3 月起，我们支持自托管选项。请阅读博客 [这里](https://forwardemail.net/blog/docs/self-hosted-solution)。查看 [自托管指南](https://forwardemail.net/self-hosted) 开始使用。如果您对更详细的分步版本感兴趣，请参阅我们基于 [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) 或 [Debian](https://forwardemail.net/guides/selfhosted-on-debian) 的指南。

## 电子邮件配置 {#email-configuration}

### 如何开始并设置电子邮件转发 {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">预计设置时间：</strong>
<span>少于 10 分钟</span>
</div>

<div class="alert my-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
入门指南：
</strong>
<span>
请仔细阅读并遵循以下列出的步骤一至八。请务必将 <code>user@gmail.com</code> 中的电子邮件地址替换为您要转发邮件的电子邮件地址（如果该地址不正确）。同样，请务必将 <code>example.com</code> 替换为您的自定义域名（如果该地址不正确）。
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">如果您已经在某个地方注册了域名，那么您必须完全跳过此步骤，直接进入第二步！否则，您可以<a href="/domain-registration" rel="noopener noreferrer">点击此处注册您的域名</a>。</li>
<li class="mb-2 mb-md-3 mb-lg-5">
您还记得您在哪里注册的域名吗？记起来后，请按照以下说明操作：

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
您必须打开新标签页并登录您的域名注册商。您可以轻松点击下方的“注册商”按钮自动登录。在此新标签页中，您必须导航至注册商的 DNS 管理页面——我们在下方“配置步骤”栏中提供了分步导航步骤。在新标签页中导航至此页面后，您可以返回此标签页并继续执行下面的第三步。
<strong class="font-weight-bold">请勿关闭已打开的标签页；您将需要它来完成后续步骤！</strong>
</span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>注册商</th>
<th>配置步骤</th>
</tr>
</thead>
<tbody>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
<td>登录 <i class="fa fa-angle-right"></i> 域名中心 <i class="fa fa-angle-right"></i>（选择您的域名）<i class="fa fa-angle-right"></i> 编辑 DNS 设置</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon 路由53</a></td>
<td>登录 <i class="fa fa-angle-right"></i> 托管区域 <i class="fa fa-angle-right"></i>（选择您的域名）</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>登录 <i class="fa fa-angle-right"></i> 我的服务器 <i class="fa fa-angle-right"></i> 域名管理 <i class="fa fa-angle-right"></i> DNS 管理器</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>FOR ROCK：登录 <i class="fa fa-angle-right"></i> 域名 <i class="fa fa-angle-right"></i>（点击管理旁边的 ▼ 图标）<i class="fa fa-angle-right"></i> DNS
<br />
旧版：登录 <i class="fa fa-angle-right"></i> 域名 <i class="fa fa-angle-right"></i> 区域编辑器 <i class="fa fa-angle-right"></i>（选择您的域名）</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>登录 <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS 轻松上手</a></td>
<td>登录 <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i>（选择您的域名）</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>登录 <i class="fa fa-angle-right"></i>（选择您的域名）<i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> 管理</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
<td>登录 <i class="fa fa-angle-right"></i> 网络 <i class="fa fa-angle-right"></i> 域名 <i class="fa fa-angle-right"></i>（选择您的域名）<i class="fa fa-angle-right"></i>更多<i class="fa fa-angle-right"></i>管理域名</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>登录<i class="fa fa-angle-right"></i>在卡片视图中，点击您的域名上的“管理”<i class="fa fa-angle-right"></i>在列表视图中，点击齿轮图标<i class="fa fa-angle-right"></i>DNS 和域名服务器<i class="fa fa-angle-right"></i>DNS 记录</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> 观看</a>
</td>
<td>登录 <i class="fa fa-angle-right"></i>（选择您的域名）<i class="fa fa-angle-right"></i> 管理 <i class="fa fa-angle-right"></i>（点击齿轮图标）<i class="fa fa-angle-right"></i> 点击左侧菜单中的“DNS 和域名服务器”</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
<td>登录 <i class="fa fa-angle-right"></i> 面板 <i class="fa fa-angle-right"></i>域名 <i class="fa fa-angle-right"></i> 管理域名 <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
<td>登录 <i class="fa fa-angle-right"></i> 概览 <i class="fa fa-angle-right"></i> 管理 <i class="fa fa-angle-right"></i> 简易编辑器 <i class="fa fa-angle-right"></i> 记录</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
<td>登录 <i class="fa fa-angle-right"></i>（选择您的域名）<i class="fa fa-angle-right"></i> 管理 <i class="fa fa-angle-right"></i> 编辑区域</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> 观看</a>
</td>
<td>登录 <i class="fa fa-angle-right"></i> 管理我的域名 <i class="fa fa-angle-right"></i>（选择您的域名）<i class="fa fa-angle-right"></i> 管理 DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google 域名</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> 观看</a>
</td>
<td>登录 <i class="fa fa-angle-right"></i>（选择您的域名）<i class="fa fa-angle-right"></i> 配置 DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> 观看</a>
</td>
<td>登录 <i class="fa fa-angle-right"></i> 域名列表 <i class="fa fa-angle-right"></i>（选择您的域名）<i class="fa fa-angle-right"></i> 管理 <i class="fa fa-angle-right"></i> 高级 DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
<td>登录 <i class="fa fa-angle-right"></i>（选择您的域名）<i class="fa fa-angle-right"></i> 设置 Netlify DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network 解决方案</a></td>
<td>登录 <i class="fa fa-angle-right"></i> 账户管理 <i class="fa fa-angle-right"></i> 我的域名 <i class="fa fa-angle-right"></i>（选择您的域名）<i class="fa fa-angle-right"></i> 管理 <i class="fa fa-angle-right"></i> 更改域名指向 <i class="fa fa-angle-right"></i> 高级 DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> 观看</a>
</td>
<td>登录 <i class="fa fa-angle-right"></i> 托管域名 <i class="fa fa-angle-right"></i>（选择您的域名）<i class="fa fa-angle-right"></i> DNS 设置</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
<td>登录 <i class="fa fa-angle-right"></i> 主菜单 <i class="fa fa-angle-right"></i> 设置 <i class="fa fa-angle-right"></i> 域名 <i class="fa fa-angle-right"></i>（选择您的域名）<i class="fa fa-angle-right"></i>
高级设置 <i class="fa fa-angle-right"></i> 自定义记录</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
<td>使用“now”CLI <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
<td>登录 <i class="fa fa-angle-right"></i> 域名页面 <i class="fa fa-angle-right"></i>（选择您的域名）<i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
<td>登录 <i class="fa fa-angle-right"></i> 域名页面 <i class="fa fa-angle-right"></i>（点击 <i class="fa fa-ellipsis-h"></i> 图标）<i class="fa fa-angle-right"></i> 选择“管理 DNS 记录”</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
<td>登录 <i class="fa fa-angle-right"></i> 域名 <i class="fa fa-angle-right"></i> 我的域名</td>
</tr>
<tr>
<td>其他</td>
<td>
<div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">重要提示：</strong> 此处未列出您的注册商名称？只需在互联网上搜索“如何在 $REGISTRAR 上更改 DNS 记录”（将 $REGISTRAR 替换为您的注册商名称 - 例如，如果您使用的是 GoDaddy，则搜索“如何在 GoDaddy 上更改 DNS 记录”）。</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">使用您的注册商的 DNS 管理页面（您打开的另一个选项卡），设置以下“MX”记录：

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
请注意，不应设置其他 MX 记录。以下所示的两条记录必须存在。请确保没有拼写错误；并且 mx1 和 mx2 的拼写正确。如果已经存在 MX 记录，请将其完全删除。
“TTL”值不必为 3600，可以根据需要设置为更低或更高的值。
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>优先级</th>
<th>应答/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx1.forwardemail.net</code></td>
</tr>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx2.forwardemail.net</code></td>
</tr>
</tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">使用您的注册商的 DNS 管理页面（您打开的另一个选项卡），设置以下 <strong class="notranslate">TXT</strong> 记录：

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
如果您使用的是付费方案，则必须完全跳过此步骤，直接跳至第五步！如果您不是付费方案，您的转发地址将可公开搜索 - 请前往<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户<i class="fa fa-angle-right"></i>域名</a>，并根据需要将您的域名升级为付费方案。如果您想了解更多关于付费方案的信息，请参阅我们的<a rel="noopener noreferrer" href="/private-business-email" class="alert-link">定价</a>页面。否则，您可以继续从下面列出的选项 A 到选项 F 中选择一个或多个组合。
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
选项 A：
</strong>
<span>
如果您要将来自您域名的所有电子邮件（例如“all@example.com”、“hello@example.com”等）转发到特定地址“user@gmail.com”：
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
<span>
请务必将“值”列中的上述值替换为您自己的电子邮件地址。“TTL”值不必是 3600，可以根据需要设置更低或更高的值。较低的生存时间 (TTL) 值将确保您未来对 DNS 记录所做的任何更改都能更快地在整个互联网上传播——可以将其视为在内存中缓存的时间（以秒为单位）。您可以在维基百科上了解更多关于<a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL</a>的信息。
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
选项 B：
</strong>
<span>
如果您只需要转发单个电子邮件地址（例如，将 <code>hello@example.com</code> 转发到 <code>user@gmail.com</code>；这将自动将“hello+test@example.com”转发到“user+test@gmail.com”）：
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
选项 C：
</strong>
<span>
如果您要转发多封电子邮件，则需要用逗号分隔：
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
选项 D：
</strong>
<span>
您可以设置无限数量的转发邮件——只需确保每行不超过 255 个字符，并且每行以“forward-email=”开头。示例如下：
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=errors:user@gmail.com,boop:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
选项 E：
</strong>
<span>
您还可以在 <strong class="notranslate">TXT</strong> 记录中指定域名，以进行全局别名转发（例如，“user@example.com”将被转发到“user@example.net”）：
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=example.net</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
选项 F：
</strong>
<span>
您甚至可以将 Webhook 用作全局或单独的别名来转发电子邮件。请参阅下方标题为<a href="#do-you-support-webhooks" class="alert-link">您是否支持 Webhook</a> 的示例和关于 Webhook 的完整部分。
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
选项 G：
</strong>
<span>
您甚至可以使用正则表达式 (“regex”) 来匹配别名并处理用于转发电子邮件的替换。请参阅下方标题为<a href="#do-you-support-regular-expressions-or-regex" class="alert-link">您支持正则表达式还是正则表达式</a>的示例和完整部分。
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>需要带替换功能的高级正则表达式？</strong> 请参阅下方标题为<a href="#do-you-support-regular-expressions-or-regex" class="alert-link">您支持正则表达式还是正则表达式</a>的示例和完整章节。
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>简单示例：</strong>如果我希望所有发送至 `linus@example.com` 或 `torvalds@example.com` 的邮件都转发至 `user@gmail.com`：
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
Catch-all 转发规则也可以描述为“fall-through”。
这意味着至少匹配一条特定转发规则的邮件将被使用，而不是 catch-all。
具体规则包括电子邮件地址和正则表达式。
<br /><br />
例如：
<br />
<code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
使用此配置，发送至 <code>hello@example.com</code> 的邮件将**不会**转发至 <code>second@gmail.com</code>（catch-all），而只会递送至 <code>first@gmail.com</code>。
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">使用您的注册商的 DNS 管理页面（您打开的另一个选项卡），另外设置以下 <strong class="notranslate">TXT</strong> 记录：

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
如果您使用的是 Gmail（例如“以…发送邮件”）或 G Suite，则需要将 <code>include:_spf.google.com</code> 附加到上述值，例如：
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
<span>
如果您已经有类似的包含“v=spf1”的行，则需要在同一行中任何现有的“include:host.com”记录之前以及“-all”之前添加 <code>include:spf.forwardemail.net</code>，例如：
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
请注意，“-all”和“~all”之间存在差异。“-”表示如果不匹配，SPF 检查应该失败，“~”表示 SPF 检查应该软失败。我们建议使用“-all”方法来防止域名伪造。
<br /><br />
您可能还需要添加发送邮件主机（例如 Outlook）的 SPF 记录。
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">使用我们的“验证记录”工具验证您的 DNS 记录，该工具可在<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的帐户<i class="fa fa-angle-right"></i>域</a> <i class="fa fa-angle-right"></i>设置中找到。

</li><li class="mb-2 mb-md-3 mb-lg-5">发送一封测试邮件确认其正常运行。请注意，您的 DNS 记录可能需要一些时间才能生效。

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
<span>
</span>
如果您没有收到测试邮件，或者收到一封显示“请小心此邮件”的测试邮件，请分别查看<a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">为什么我没有收到测试邮件</a>和<a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">为什么我发送给我的测试邮件在 Gmail 中显示为“可疑”</a>的答案。
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">如果您希望在 Gmail 中“以身份发送邮件”，则需要<strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">观看此视频</a></strong>，或按照下面<a href="#how-to-send-mail-as-using-gmail">How 使用 Gmail 以身份发送邮件</a>的步骤操作。

</li></ol>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
恭喜！
</strong>
<span>
您已成功完成所有步骤。
</span>
</div>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
<span>
以下列出了可选插件。请注意，这些插件完全是可选的，可能并非必需。我们希望至少在必要时为您提供更多信息。
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
可选插件：
</strong>
<span>
如果您使用<a class="alert-link" href="#how-to-send-mail-as-using-gmail">How 使用 Gmail 以身份发送邮件</a>功能，则可能需要将自己添加到允许列表。请参阅<a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">Gmail 的这些说明</a>中关于此主题的说明。
</span>
</div>

### 我可以使用多个 MX 交换和服务器进行高级转发吗？{#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

是的，但是**您的 DNS 记录中应该只列出一个 MX 交换**。

请勿尝试使用“优先级”来配置多个 MX 交换。

相反，您需要配置现有的 MX 交换，将所有不匹配别名的邮件转发到我们服务的交换（`mx1.forwardemail.net` 和/或 `mx2.forwardemail.net`）。

如果您正在使用 Google Workspace，并且想要将所有不匹配的别名转发到我们的服务，请参阅 <https://support.google.com/a/answer/6297084>.

如果您使用的是 Microsoft 365（Outlook），并且想要将所有不匹配的别名转发到我们的服务，请参阅 <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> 和 <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### 如何设置休假回复器（外出自动回复器）{#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

转至<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">我的帐户<i class="fa fa-angle-right"></i>域</a> <i class="fa fa-angle-right"></i>别名，然后创建或编辑您想要为其配置休假自动回复的别名。

您可以配置开始日期、结束日期、主题和消息，并随时启用或禁用它：

* 目前支持纯文本主题和消息（我们在内部使用 `striptags` 软件包来删除任何 HTML）。
* 主题限制为 100 个字符。
* 消息限制为 1000 个字符。
* 设置需要出站 SMTP 配置（例如，您需要设置 DKIM、DMARC 和 Return-Path DNS 记录）。
* 前往 <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">我的帐户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 设置 <i class="fa fa-angle-right"></i> 出站 SMTP 配置，并按照设置说明进行操作。
* 休假回复功能无法在全球虚荣域名上启用（例如，不支持 [一次性地址](/disposable-addresses)）。
* 无法为带有通配符/全部捕获（`*`）或正则表达式的别名启用休假响应器。

与 `postfix` 等邮件系统（例如使用 `sieve` 休假过滤器扩展）不同，转发电子邮件会自动添加您的 DKIM 签名，在发送休假回复时防止连接问题（例如由于常见的 SSL/TLS 连接问题和遗留维护的服务器），甚至支持对休假回复进行 Open WKD 和 PGP 加密。

<!--
* 为防止滥用，每发送一条休假回复邮件，将扣除 1 个出站 SMTP 信用点。
* 所有付费账户默认每日包含 300 个信用点。如果您需要更多信用点，请联系我们。
-->

1. 我们每 4 天仅向每个 [列入白名单](#do-you-have-an-allowlist) 发件人发送一次（这与 Gmail 的行为类似）。

* 我们的 Redis 缓存使用 `alias_id` 和 `sender` 指纹，其中 `alias_id` 是 MongoDB 别名 ID，而 `sender` 是发件人地址（如果已列入白名单）或发件人地址中的根域（如果未列入白名单）。为简单起见，此指纹在缓存中的有效期设置为 4 天。

* 我们对非允许名单发件人的发件人地址使用根域进行解析的方法可防止相对未知的发件人（例如恶意行为者）滥用洪水般的休假响应消息。

2. 仅当 MAIL FROM 和/或 From 不为空且不包含（不区分大小写）[邮政局长用户名](#what-are-postmaster-addresses)（电子邮件中 @ 之前的部分）时，我们才会发送。

3. 如果原始邮件具有以下任何标头（不区分大小写），则我们不会发送：

* `auto-submitted` 的标头，其值不等于 `no`。
* `x-auto-response-suppress` 的标头，其值为 `dr`、`autoreply`、`auto-reply`、`auto_reply` 或 `all`
* `list-id`、`list-subscribe`、`list-unsubscribe`、`list-help`、`list-post`、`list-owner`、`list-archive`、`x-autoreply`、`x-autorespond` 或`x-auto-respond`（无论值如何）。
* `precedence` 的标头，其值为 `bulk`、`autoreply`、`auto-reply`、`auto_reply` 或 `list`。

4. 如果 MAIL FROM 或 From 电子邮件地址以 `+donotreply`、`-donotreply`、`+noreply` 或 `-noreply` 结尾，我们不会发送。

5. 如果发件人电子邮件地址用户名部分为 `mdaemon` 并且具有不区分大小写的标题 `X-MDDSN-Message`，则我们不会发送。

6. 如果存在不区分大小写的 `multipart/report` 标头 `content-type`，则我们不会发送。

### 如何设置转发电子邮件的 SPF {#how-do-i-set-up-spf-for-forward-email}

使用您的注册商的 DNS 管理页面，设置以下 <strong class="notranslate">TXT</strong> 记录：

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
如果您使用的是 Gmail（例如“以…发送邮件”）或 G Suite，则需要将 <code>include:_spf.google.com</code> 附加到上述值，例如：
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
如果您使用的是 Microsoft Outlook 或 Live.com，则需要将 <code>include:spf.protection.outlook.com</code> 附加到您的 SPF <strong class="notranslate">TXT</strong> 记录中，例如：
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
<span>
如果您已经有类似的包含“v=spf1”的行，则需要在同一行中任何现有的“include:host.com”记录之前以及“-all”之前添加 <code>include:spf.forwardemail.net</code>，例如：
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
请注意，“-all”和“~all”之间存在差异。“-”表示如果不匹配，SPF 检查应该失败，“~”表示 SPF 检查应该软失败。我们建议使用“-all”方法来防止域名伪造。
<br /><br />
您可能还需要添加发送邮件主机（例如 Outlook）的 SPF 记录。
</span>
</div>

### 如何设置 DKIM 以转发电子邮件 {#how-do-i-set-up-dkim-for-forward-email}

转至<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">我的帐户<i class="fa fa-angle-right"></i>域</a> <i class="fa fa-angle-right"></i>设置<i class="fa fa-angle-right"></i>出站 SMTP 配置并按照设置说明进行操作。

### 如何设置 DMARC 以转发电子邮件 {#how-do-i-set-up-dmarc-for-forward-email}

转至<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">我的帐户<i class="fa fa-angle-right"></i>域</a> <i class="fa fa-angle-right"></i>设置<i class="fa fa-angle-right"></i>出站 SMTP 配置并按照设置说明进行操作。

### 如何连接和配置我的联系人{#how-do-i-connect-and-configure-my-contacts}

**要配置您的联系人，请使用 CardDAV URL：** `https://carddav.forwardemail.net`（或者，如果您的客户端允许，则只需使用 `carddav.forwardemail.net`）

### 如何连接和配置我的日历 {#how-do-i-connect-and-configure-my-calendars}

**要配置您的日历，请使用 CalDAV URL：** `https://caldav.forwardemail.net`（或者，如果您的客户端允许，则只需使用 `caldav.forwardemail.net`）

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="转发电子邮件日历 CalDAV Thunderbird 示例设置" />

### 如何添加更多日历并管理现有日历 {#how-do-i-add-more-calendars-and-manage-existing-calendars}

如果您想添加其他日历，只需添加一个新的日历 URL：`https://caldav.forwardemail.net/dav/principals/calendar-name`（**请务必将 `calendar-name` 替换为您想要的日历名称**）

您可以在创建后更改日历的名称和颜色 - 只需使用您喜欢的日历应用程序（例如 Apple Mail 或 [雷鸟](https://thunderbird.net)）。

### 如何设置 SRS 以转发电子邮件 {#how-do-i-set-up-srs-for-forward-email}

我们自动配置[发件人重写方案](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme)（“SRS”）——您无需自己执行此操作。

### 如何设置 MTA-STS 来转发电子邮件 {#how-do-i-set-up-mta-sts-for-forward-email}

请参阅[我们关于 MTA-STS 的部分](#do-you-support-mta-sts)以获得更多见解。

### 如何在我的电子邮件地址中添加个人资料图片 {#how-do-i-add-a-profile-picture-to-my-email-address}

如果您使用 Gmail，请按照以下步骤操作：

1. 前往 <https://google.com> 并退出所有电子邮件帐户
2. 点击“登录”，然后在下拉菜单中点击“其他帐户”
3. 选择“使用其他帐户”
4. 选择“创建帐户”
5. 选择“改用我当前的电子邮件地址”
6. 输入您的自定义域名和电子邮件地址
7. 检索发送到您电子邮件地址的验证邮件
8. 输入此邮件中的验证码
9. 填写您新 Google 帐户的个人资料信息
10. 同意所有隐私权和使用条款政策
11. 前往 <https://google.com> 并在右上角点击您的个人资料图标，然后点击“更改”按钮
12. 为您的帐户上传新的照片或头像
13. 更改大约需要 1-2 小时才能生效，但有时可能非常快。
14. 发送一封测试邮件，个人资料照片应该会显示出来。

## 高级功能 {#advanced-features}

### 您是否支持营销相关电子邮件的通讯或邮件列表{#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

是的，您可以在<https://forwardemail.net/guides/newsletter-with-listmonk>.阅读更多内容

请注意，为了维护 IP 信誉并确保邮件送达率，Forward Email 会根据每个域名设置手动审核流程来审批**简报**。请发送电子邮件至 <support@forwardemail.net> 或提交 [帮助请求](https://forwardemail.net/help) 申请审批。审批流程通常不超过 24 小时，大多数请求会在 1-2 小时内完成。我们计划在不久的将来通过额外的垃圾邮件控制和警报功能，实现即时审批。此流程可确保您的邮件顺利送达收件箱，并且不会被标记为垃圾邮件。

### 您是否支持使用 API {#do-you-support-sending-email-with-api} 发送电子邮件

是的，自 2023 年 5 月起，我们支持使用 API 发送电子邮件作为所有付费用户的附加组件。

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
请确保您已阅读我们的<a href="/terms" class="alert-link" target="_blank">条款</a>、<a href="/privacy" class="alert-link" target="_blank">隐私政策</a>以及<a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">出站 SMTP 限制</a>——您的使用将被视为确认并同意。
</span>
</div>

请查看我们的 API 文档中有关 [电子邮件](/email-api#outbound-emails) 的部分，了解选项、示例和更多见解。

为了使用我们的 API 发送出站电子邮件，您必须使用 [我的安全](/my-account/security) 下可用的 API 令牌。

### 您是否支持使用 IMAP 接收电子邮件 {#do-you-support-receiving-email-with-imap}

是的，自 2023 年 10 月 16 日起，我们支持所有付费用户通过 IMAP 接收电子邮件，这是一个附加功能。**请阅读我们关于 [我们的加密 SQLite 邮箱存储功能如何运作](/blog/docs/best-quantum-safe-encrypted-email-service) 的深度文章**。

<div id="imap-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
请确保您已阅读我们的<a href="/terms" class="alert-link" target="_blank">条款</a>和<a href="/privacy" class="alert-link" target="_blank">隐私政策</a>——您的使用即视为您已确认并同意。
</span>
</div>

1. 在<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的帐户<i class="fa fa-angle-right"></i>域名</a> <i class="fa fa-angle-right"></i>别名下为您的域名创建一个新的别名（例如 <code><hello@example.com></code>）

2. 点击新创建的别名旁边的<strong class="text-success"><i class="fa fa-key"></i>生成密码</strong>。将其复制到剪贴板并安全存储屏幕上显示的生成密码。

3. 使用您常用的电子邮件应用程序，添加或配置一个带有新创建别名的帐户（例如 <code><hello@example.com></code>）
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
<span>我们推荐使用 <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>、<a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a> 和 <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>，或者<a href="/blog/open-source" class="alert-link" target="_blank">一个开源且注重隐私的替代方案</a>。</span>
</div>

4. 当提示输入 IMAP 服务器名称时，输入 `imap.forwardemail.net`

5. 当系统提示输入 IMAP 服务器端口时，请输入 `993` (SSL/TLS) – 如有需要，请参阅 [备用 IMAP 端口](/faq#what-are-your-imap-server-configuration-settings)
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
<span>如果您使用的是 Thunderbird，请确保“连接安全性”设置为“SSL/TLS”，并将身份验证方法设置为“普通密码”。</span>
</div>

6. 当系统提示输入 IMAP 服务器密码时，请粘贴上述第 2 步中<strong class="text-success"><i class="fa fa-key"></i>生成密码</strong>中输入的密码

7. **保存您的设置** – 如果您遇到问题，请<a href="/help">联系我们</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
恭喜！
</strong>
<span>
您已成功完成所有步骤。
</span>
</div>
</div>

</div>

### 您是否支持 POP3 {#do-you-support-pop3}

是的，自 2023 年 12 月 4 日起，我们将以插件的形式支持所有付费用户使用 [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol)。**请阅读我们关于 [我们的加密 SQLite 邮箱存储功能如何运作](/blog/docs/best-quantum-safe-encrypted-email-service) 的深度文章**。

<div id="pop3-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
请确保您已阅读我们的<a href="/terms" class="alert-link" target="_blank">条款</a>和<a href="/privacy" class="alert-link" target="_blank">隐私政策</a>——您的使用即视为您已确认并同意。
</span>
</div>

1. 在<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的帐户<i class="fa fa-angle-right"></i>域名</a> <i class="fa fa-angle-right"></i>别名下为您的域名创建一个新的别名（例如 <code><hello@example.com></code>）

2. 点击新创建的别名旁边的<strong class="text-success"><i class="fa fa-key"></i>生成密码</strong>。将其复制到剪贴板并安全存储屏幕上显示的生成密码。

3. 使用您常用的电子邮件应用程序，添加或配置一个带有新创建的别名的帐户（例如 <code><hello@example.com></code>）
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
<span>我们推荐使用 <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>、<a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a> 和 <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>，或者<a href="/blog/open-source" class="alert-link" target="_blank">一个开源且注重隐私的替代方案</a>。</span>
</div>

4. 当提示输入 POP3 服务器名称时，输入 `pop3.forwardemail.net`

5. 当系统提示输入 POP3 服务器端口时，请输入 `995` (SSL/TLS) – 如有需要，请参阅 [备用 POP3 端口](/faq#what-are-your-pop3-server-configuration-settings)
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
<span>如果您使用的是 Thunderbird，请确保“连接安全性”设置为“SSL/TLS”，并将身份验证方法设置为“普通密码”。</span>
</div>

6. 当系统提示输入 POP3 服务器密码时，请粘贴上述第 2 步中<strong class="text-success"><i class="fa fa-key"></i>生成密码</strong>中输入的密码

7. **保存您的设置** – 如果您遇到问题，请<a href="/help">联系我们</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
恭喜！
</strong>
<span>
您已成功完成所有步骤。
</span>
</div>
</div>

</div>

### 您是否支持日历 (CalDAV) {#do-you-support-calendars-caldav}

是的，我们已于 2024 年 2 月 5 日添加了此功能。我们的服务器已启用 `caldav.forwardemail.net` 保护，并且在我们的<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">状态页面</a>上受到监控。

它支持 IPv4 和 IPv6，并且可通过端口 `443` (HTTPS) 使用。

| 登录 | 例子 | 描述 |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 用户名 | `user@example.com` | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的帐户<i class="fa fa-angle-right"></i>域</a>中存在的域别名的电子邮件地址。 |
| 密码 | `************************` | 别名特定的生成的密码。 |

为了使用日历支持，**用户**必须是<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的帐户<i class="fa fa-angle-right"></i>域</a>中存在的域别名的电子邮件地址 - 并且**密码**必须是特定于别名的生成密码。

### 您是否支持联系人 (CardDAV) {#do-you-support-contacts-carddav}

是的，我们已于 2025 年 6 月 12 日起添加此功能。我们的服务器已启用 `carddav.forwardemail.net` 保护，并且在我们的<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">状态页面</a>上受到监控。

它支持 IPv4 和 IPv6，并且可通过端口 `443` (HTTPS) 使用。

| 登录 | 例子 | 描述 |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 用户名 | `user@example.com` | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的帐户<i class="fa fa-angle-right"></i>域</a>中存在的域别名的电子邮件地址。 |
| 密码 | `************************` | 别名特定的生成的密码。 |

为了使用联系人支持，**用户**必须是<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的帐户<i class="fa fa-angle-right"></i>域</a>中存在的域别名的电子邮件地址 - 并且**密码**必须是特定于别名的生成密码。

### 您是否支持使用 SMTP 发送电子邮件 {#do-you-support-sending-email-with-smtp}

是的，自 2023 年 5 月起，我们支持所有付费用户使用 SMTP 发送电子邮件作为附加功能。

<div id="smtp-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
请确保您已阅读我们的<a href="/terms" class="alert-link" target="_blank">条款</a>、<a href="/privacy" class="alert-link" target="_blank">隐私政策</a>以及<a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">出站 SMTP 限制</a>——您的使用将被视为确认并同意。
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
如果您使用的是 Gmail，请参阅我们的<a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">使用 Gmail 发送邮件指南</a>。如果您是开发者，请参阅我们的<a class="alert-link" href="/email-api#outbound-emails" target="_blank">电子邮件 API 文档</a>。
</span>
</div>

1. 前往<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">我的账户<i class="fa fa-angle-right"></i>域名</a> <i class="fa fa-angle-right"></i>设置<i class="fa fa-angle-right"></i>出站 SMTP 配置并按照设置说明进行操作

2. 在<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的帐户<i class="fa fa-angle-right"></i>域名</a> <i class="fa fa-angle-right"></i>别名下为您的域名创建一个新的别名（例如 <code><hello@example.com></code>）

3. 点击新创建的别名旁边的<strong class="text-success"><i class="fa fa-key"></i>生成密码</strong>。将其复制到剪贴板并安全存储屏幕上显示的生成密码。

4. 使用您常用的电子邮件应用程序，添加或配置一个包含新创建别名的帐户（例如 <code><hello@example.com></code>）
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
<span>我们推荐使用 <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>、<a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a> 和 <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>，或者<a href="/blog/open-source" class="alert-link" target="_blank">一个开源且注重隐私的替代方案</a>。</span>
</div>

5. 当提示输入 SMTP 服务器名称时，输入 `smtp.forwardemail.net`

6. 当系统提示输入 SMTP 服务器端口时，请输入 `465` (SSL/TLS) – 如有需要，请参阅 [备用 SMTP 端口](/faq#what-are-your-smtp-server-configuration-settings)
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
<span>如果您使用的是 Thunderbird，请确保“连接安全性”设置为“SSL/TLS”，并将身份验证方法设置为“普通密码”。</span>
</div>

7. 当系统提示输入 SMTP 服务器密码时，请粘贴上述第 3 步中<strong class="text-success"><i class="fa fa-key"></i>生成密码</strong>中输入的密码

8. **保存您的设置并发送您的第一封测试电子邮件** – 如果您遇到问题，请<a href="/help">联系我们</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
请注意，为了维护 IP 信誉并确保邮件送达率，我们对每个域名的出站 SMTP 邮件审批都进行了人工审核。审核通常需要不到 24 小时，大多数请求会在 1-2 小时内得到处理。在不久的将来，我们的目标是通过额外的垃圾邮件控制和警报功能，使此流程即时完成。此流程可确保您的邮件到达收件箱，并且不会被标记为垃圾邮件。
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
恭喜！
</strong>
<span>
您已成功完成所有步骤。
</span>
</div>
</div>

</div>

### 您是否支持 OpenPGP/MIME、端到端加密（“E2EE”）和 Web 密钥目录（“WKD”）{#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

是的，我们支持[OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP)、[端到端加密（“E2EE”）](https://en.wikipedia.org/wiki/End-to-end_encryption)以及使用[Web 密钥目录（“WKD”）](https://wiki.gnupg.org/WKD)发现公钥。您可以使用[keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service)或[自托管您自己的密钥](https://wiki.gnupg.org/WKDHosting)配置OpenPGP（请参阅[这是 WKD 服务器设置的要点](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)）。

* WKD 查找会缓存 1 小时，以确保电子邮件及时送达 → 因此，如果您添加、更改或删除了 WKD 密钥，请发送电子邮件至 `support@forwardemail.net` 并提供您的电子邮件地址，以便我们手动清除缓存。
* 我们支持对通过 WKD 查找或在我们的界面上使用已上传的 PGP 密钥转发的消息进行 PGP 加密。
* 只要启用/选中 PGP 复选框，已上传的密钥就会生效。
* 发送到 webhook 的消息目前未使用 PGP 加密。
* 如果您有多个与给定转发地址匹配的别名（例如正则表达式/通配符/精确匹配组合），并且其中多个别名包含已上传的 PGP 密钥并已进行 PGP 校验 → 则我们将向您发送错误警报电子邮件，并且不会使用您上传的 PGP 密钥加密消息。这种情况非常罕见，通常仅适用于使用复杂别名规则的高级用户。
* **如果发件人的 DMARC 策略为拒绝，则 PGP 加密将不会应用于通过我们的 MX 服务器转发的邮件。如果您需要对*所有*邮件进行 PGP 加密，我们建议您使用我们的 IMAP 服务，并将您的 PGP 密钥配置为您的入站邮件别名。**

**您可以在<https://wkd.chimbosonic.com/>（开源）或<https://www.webkeydirectory.com/>（专有）验证您的 Web 密钥目录设置。**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
自动加密：
</strong>
<span>如果您使用我们的<a href="#do-you-support-sending-email-with-smtp" class="alert-link">出站 SMTP 服务</a>并发送未加密的邮件，我们将自动尝试使用<a class="alert-link" href="https://wiki.gnupg.org/WKD">Web 密钥目录 ("WKD")</a>对每个收件人的邮件进行加密。</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
您必须遵循以下所有步骤才能为您的自定义域名启用 OpenPGP。
</span>
</div>

1. 下载并安装您的电子邮件客户端推荐的插件：

| 电子邮件客户端 | 平台 | 推荐插件 | 笔记 |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 雷鸟 | 桌面 | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird 内置了对 OpenPGP 的支持。 |
| Gmail | 浏览器 | [Mailvelope](https://mailvelope.com/) 或 [FlowCrypt](https://flowcrypt.com/download) (专有许可证) | Gmail 不支持 OpenPGP，但是您可以下载开源插件 [Mailvelope](https://mailvelope.com/) 或 [FlowCrypt](https://flowcrypt.com/download)。 |
| 苹果邮件 | macOS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Apple Mail 不支持 OpenPGP，但是您可以下载开源插件 [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)。 |
| 苹果邮件 | iOS | [PGPro](https://github.com/opensourceios/PGPro/) 或 [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (专有许可证) | Apple Mail 不支持 OpenPGP，但是您可以下载开源插件 [PGPro](https://github.com/opensourceios/PGPro/) 或 [FlowCrypt](https://flowcrypt.com/download)。 |
| 前景 | 视窗 | [gpg4win](https://www.gpg4win.de/index.html) | Outlook 的桌面邮件客户端不支持 OpenPGP，但是您可以下载开源插件 [gpg4win](https://www.gpg4win.de/index.html)。 |
| 前景 | 浏览器 | [Mailvelope](https://mailvelope.com/) 或 [FlowCrypt](https://flowcrypt.com/download) (专有许可证) | Outlook 的基于 Web 的邮件客户端不支持 OpenPGP，但是您可以下载开源插件 [Mailvelope](https://mailvelope.com/) 或 [FlowCrypt](https://flowcrypt.com/download)。 |
| 安卓 | 移动的 | [OpenKeychain](https://www.openkeychain.org/) 或 [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | [Android mail clients](/blog/open-source/android-email-clients)（例如 [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) 和 [FairEmail](https://github.com/M66B/FairEmail)）均支持开源插件 [OpenKeychain](https://www.openkeychain.org/)。您也可以使用开源（专有许可）插件 [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)。 |
| 谷歌浏览器 | 浏览器 | [Mailvelope](https://mailvelope.com/) 或 [FlowCrypt](https://flowcrypt.com/download) (专有许可证) | 您可以下载开源浏览器扩展[Mailvelope](https://mailvelope.com/)或[FlowCrypt](https://flowcrypt.com/download)。 |
| 火狐浏览器 | 浏览器 | [Mailvelope](https://mailvelope.com/) 或 [FlowCrypt](https://flowcrypt.com/download) (专有许可证) | 您可以下载开源浏览器扩展[Mailvelope](https://mailvelope.com/)或[FlowCrypt](https://flowcrypt.com/download)。 |
| 微软 Edge | 浏览器 | [Mailvelope](https://mailvelope.com/) | 您可以下载开源浏览器扩展[Mailvelope](https://mailvelope.com/)。 |
| 勇敢的 | 浏览器 | [Mailvelope](https://mailvelope.com/) 或 [FlowCrypt](https://flowcrypt.com/download) (专有许可证) | 您可以下载开源浏览器扩展[Mailvelope](https://mailvelope.com/)或[FlowCrypt](https://flowcrypt.com/download)。 |
| 巴尔萨 | 桌面 | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | Balsa 内置了对 OpenPGP 的支持。 |
| KMail | 桌面 | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | KMail 内置了对 OpenPGP 的支持。 |
| GNOME 进化 | 桌面 | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | GNOME Evolution 内置了对 OpenPGP 的支持。 |
| 终端 | 桌面 | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | 您可以使用开源的[gpg command line tool](https://www.gnupg.org/download/)从命令行生成新密钥。 |

2. 打开插件，创建您的公钥，并配置您的电子邮件客户端以使用它。

3. 将您的公钥上传至<https://keys.openpgp.org/upload>.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
<span>您可以访问 <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> 来管理您的密钥。</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
可选插件：
</strong>
<span>
如果您正在使用我们的<a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">加密存储 (IMAP/POP3)</a> 服务，并且希望使用您的公钥加密存储在您（已加密）SQLite 数据库中的<i>所有</i>电子邮件，请前往<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户<i class="fa fa-angle-right"></i>域名</a> <i class="fa fa-angle-right"></i>别名（例如 <code>hello@example.com</code>） <i class="fa fa-angle-right"></i> 编辑 <i class="fa fa-angle-right"></i> OpenPGP 并上传你的公钥。
</span>
</div>

4. 向您的域名添加新的 `CNAME` 记录（例如 `example.com`）：

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>应答/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>openpgpkey</code></td>
<td class="text-center">3600</td>
<td class="notranslate">CNAME</td>
<td><code>wkd.keys.openpgp.org</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
<span>如果您的别名使用的是我们的<a class="alert-link" href="/disposable-addresses" target="_blank">虚荣/一次性域名</a>（例如 <code>hideaddress.net</code>），则可以跳过此步骤。</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
恭喜！
</strong>
<span>
您已成功完成所有步骤。
</span>
</div>
</div>

### 您是否支持 MTA-STS {#do-you-support-mta-sts}

是的，自 2023 年 3 月 2 日起，我们支持 [MTA-STS](https://www.hardenize.com/blog/mta-sts)。如果您想在您的域名上启用它，可以使用 [这个模板](https://github.com/jpawlowski/mta-sts.template)。

我们的配置可以在 GitHub 上公开找到，网址为 <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### 您是否支持密钥和 WebAuthn {#do-you-support-passkeys-and-webauthn}

是的！自 2023 年 12 月 13 日起，我们已添加对密钥 [由于需求量大](https://github.com/orgs/forwardemail/discussions/182) 的支持。

密钥允许您安全登录，而无需密码和双因素身份验证。

您可以通过触摸、面部识别、基于设备的密码或 PIN 来验证您的身份。

我们允许您一次管理最多 30 个密钥，以便您可以轻松地使用所有设备登录。

通过以下链接了解有关密钥的更多信息：

* [使用密钥登录您的应用程序和网站](https://support.google.com/android/answer/14124480?hl=en)（谷歌）
* [使用密钥登录 iPhone 上的应用和网站](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios)（苹果）
* [维基百科关于密钥的文章](https://en.wikipedia.org/wiki/Passkey_\(credential\)）

### 您是否支持电子邮件最佳实践 {#do-you-support-email-best-practices}

是的。所有方案均内置对 SPF、DKIM、DMARC、ARC 和 SRS 的支持。我们还与这些规范的原作者以及其他电子邮件专家进行了广泛的合作，以确保邮件的完善性和高送达率。

### 您是否支持反弹 webhook {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
正在寻找有关电子邮件 Webhook 的文档？请参阅<a href="/faq#do-you-support-webhooks" class="alert-link">你们支持 Webhook 吗？</a>了解更多信息。
<span>
</span>
</div>

是的，我们已于 2024 年 8 月 14 日起添加此功能。您现在可以前往“我的账户”→“域名”→“设置”→“退回 Webhook URL”，并配置一个 `http://` 或 `https://` URL，当外发 SMTP 电子邮件被退回时，我们会向该 URL 发送 `POST` 请求。

这对您管理和监控出站 SMTP 很有用 - 并且可用于维护订阅者、选择退出以及检测是否发生退回。

反弹 webhook 有效负载以 JSON 形式发送，具有以下属性：

* `email_id`（字符串）- 与“我的账户”→“电子邮件”（出站 SMTP）中的电子邮件对应的电子邮件 ID
* `list_id`（字符串）- 原始出站电子邮件的 `List-ID` 标头值（不区分大小写）（如果有）
* `list_unsubscribe`（字符串）- 原始出站电子邮件的 `List-Unsubscribe` 标头值（不区分大小写）（如果有）
* `feedback_id`（字符串）- 原始出站电子邮件的 `Feedback-ID` 标头值（不区分大小写）（如果有）
* `recipient`（字符串）- 退回或出错的收件人的电子邮件地址
* `message`（字符串）- 退回邮件的详细错误消息
* `response`（字符串）- SMTP 响应消息
* `response_code`（数字）- 已解析的 SMTP 响应代码
* `truth_source`（字符串）- 如果响应代码来自可信来源，则此值将填充根域名（例如 `google.com` 或 `yahoo.com`）
* `bounce`（对象）- 包含以下属性的对象，这些属性详细说明了退回和拒绝状态
* `action`（字符串）- 退回操作（例如 `"reject"`）
* `message`（字符串）- 退回原因（例如 `"Message Sender Blocked By Receiving Server"`）
* `category`（字符串）- 退回类别（例如 `"block"`）
* `code`（数字）- 退回状态代码（例如 `554`）
* `status`（字符串）- 响应消息中的退回代码（例如 `5.7.1`）
* `line`（数字）- 已解析的行号（如果有），[来自 Zone-MTA 反弹解析列表](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt)（例如 `526`）
* `headers`（对象）- 出站电子邮件标头的键值对
* `bounced_at`（字符串）- [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) 格式的退回错误发生日期

例如：

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "The email account that you tried to reach is over quota.",
  "response": "552 5.2.2 The email account that you tried to reach is over quota.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Gmail Mailbox is full",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

以下是有关反弹 webhook 的一些附加说明：

* 如果 webhook 负载包含 `list_id`、`list_unsubscribe` 或 `feedback_id` 值，则您应采取适当措施，在必要时从列表中移除 `recipient`。
* 如果 `bounce.category` 值为 `"block"`、`"recipient"`、`"spam"` 或 `"virus"`，则您务必将该用户从列表中移除。
* 如果您需要验证 webhook 负载（以确保它们确实来自我们的服务器），您可以使用 [使用反向查找来解析远程客户端 IP 地址客户端主机名](https://nodejs.org/api/dns.html#dnspromisesreverseip) – 它应该是 `smtp.forwardemail.net`。
* 您也可以根据 [我们公布的 IP 地址](#what-are-your-servers-ip-addresses) 检查 IP。
* 前往“我的账户”→“域名”→“设置”→“Webhook 签名负载验证密钥”获取您的 webhook 密钥。
* 出于安全考虑，您可以随时轮换此密钥。
* 使用此密钥计算并比较我们 webhook 请求中的 `X-Webhook-Signature` 值与计算出的 body 值。有关如何执行此操作的示例，请参阅 [这篇 Stack Overflow 帖子](https://stackoverflow.com/a/68885281)。
* 有关更多详细信息，请参阅 <https://github.com/forwardemail/free-email-forwarding/issues/235> 上的讨论。
* 我们将等待最多 `5` 秒，以便您的 webhook 端点响应 `200` 状态代码，并且我们将重试最多 `1` 次。
* 如果我们在尝试向您的反弹 webhook URL 发送请求时检测到该 URL 有错误，那么我们将每周向您发送一次礼貌电子邮件。

### 您是否支持 webhook {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
正在寻找关于反弹 Webhook 的文档？请参阅<a href="/faq#do-you-support-bounce-webhooks" class="alert-link">你们支持反弹 Webhook 吗？</a>了解更多信息。
<span>
</span>
</div>

是的，我们已于 2020 年 5 月 15 日添加了此功能。您可以像添加任何收件人一样轻松添加 Webhook！请确保 Webhook 的 URL 中添加了“http”或“https”协议前缀。

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
增强隐私保护：
</strong>
<span>
如果您使用的是付费方案（包含增强隐私保护），请前往<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户<i class="fa fa-angle-right"></i>域名</a>，然后点击域名旁边的“别名”来配置您的 webhook。如果您想了解更多关于付费方案的信息，请参阅我们的<a class="alert-link" rel="noopener noreferrer" href="/private-business-email">定价</a>页面。否则，您可以继续按照以下说明操作。
</span>
</div>

如果您使用的是免费计划，则只需添加一个新的 DNS <strong class="notranslate">TXT</strong> 记录，如下所示：

例如，如果我希望所有发送到 `alias@example.com` 的电子邮件转发到新的 [请求箱](https://requestbin.com/r/en8pfhdgcculn?inspect) 测试端点：

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

或者您可能希望所有发送到 `example.com` 的电子邮件都转发到此端点：

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

**以下是有关 webhook 的附加说明：**

* 如果您需要验证 webhook 负载（以确保它们确实来自我们的服务器），您可以使用 [使用反向查找来解析远程客户端 IP 地址客户端主机名](https://nodejs.org/api/dns.html#dnspromisesreverseip) - 它应该是 `mx1.forwardemail.net` 或 `mx2.forwardemail.net`。
* 您也可以根据 [我们公布的 IP 地址](#what-are-your-servers-ip-addresses) 检查 IP。
* 如果您使用的是付费套餐，请前往“我的账户”→“域名”→“设置”→“Webhook 签名负载验证密钥”获取您的 webhook 密钥。
* 出于安全考虑，您可以随时轮换此密钥。
* 使用此密钥计算并比较我们 webhook 请求中的 `X-Webhook-Signature` 值与计算出的 body 值。有关如何执行此操作的示例，请参阅 [这篇 Stack Overflow 帖子](https://stackoverflow.com/a/68885281)。
* 有关更多详细信息，请参阅 <https://github.com/forwardemail/free-email-forwarding/issues/235> 上的讨论。
* 如果 Webhook 未响应 `200` 状态码，我们会将其响应存储在 [错误日志已创建](#do-you-store-error-logs) 中，这有助于调试。
* Webhook HTTP 请求在每次 SMTP 连接尝试中最多会重试 3 次，每个端点 POST 请求的最大超时时间为 60 秒。**请注意，这并不意味着它只重试 3 次**，实际上它会在第三次 HTTP POST 请求尝试失败后发送 421 的 SMTP 状态码（指示发件人稍后重试），从而持续重试。这意味着电子邮件将持续重试数天，直到达到 200 状态码。
* 我们将根据 [superagent 的重试方法](https://ladjs.github.io/superagent/#retrying-requests) 中使用的默认状态和错误代码自动重试（我们是维护者）。
* 我们将对同一端点的 Webhook HTTP 请求（而不是多个）组合成一个请求，以节省资源并加快响应时间。例如，如果您向 <webhook1@example.com>、<webhook2@example.com> 和 <webhook3@example.com> 发送电子邮件，并且所有这些端点都配置为访问相同的*精确*端点 URL，则只会发出一个请求。我们通过精确的端点匹配和严格相等原则进行分组。
* 请注意，我们使用 [邮件解析器](https://nodemailer.com/extras/mailparser/) 库的“simpleParser”方法将消息解析为 JSON 友好对象。
* 原始电子邮件值作为字符串，以属性“raw”的形式提供。
* 身份验证结果以属性“dkim”、“spf”、“arc”、“dmarc”和“bimi”的形式提供。
* 解析后的电子邮件标头以属性“headers”的形式提供——另请注意，您可以使用“headerLines”更轻松地进行迭代和解析。
* 此 webhook 的分组收件人会被分组在一起，并以属性“recipients”的形式提供。
* SMTP 会话信息以属性“session”的形式提供。它包含有关邮件发件人、邮件到达时间、HELO 和客户端主机名的信息。客户端主机名值 `session.clientHostname` 可以是 FQDN（来自反向 PTR 查找），也可以是括号中的 `session.remoteAddress`（例如 `"[127.0.0.1]"`）。
* 如果您需要快速获取 `X-Original-To` 的值，那么您可以使用 `session.recipient` 的值（参见下方示例）。标头 `X-Original-To` 是我们添加到邮件中的标头，用于与邮件的原始收件人（在屏蔽转发之前）进行调试。
* 如果您需要从有效负载主体中移除 `attachments` 和/或 `raw` 属性，只需将 `?attachments=false`、`?raw=false` 或 `?attachments=false&raw=false` 作为查询字符串参数添加到您的 webhook 端点（例如 `https://example.com/webhook?attachments=false&raw=false`）。
* 如果有附件，它们将附加到带有缓冲区值的 `attachments` 数组中。您可以使用 JavaScript 中的以下方法将它们解析回内容：

  ```js
  const data = [
    104,
    101,
    108,
    108,
    111,
    32,
    119,
    111,
    114,
    108,
    100,
    33
  ];

  //
  // outputs "hello world!" to the console
  // (this is the content from the filename "text1.txt" in the example JSON request payload above)
  //
  console.log(Buffer.from(data).toString());
  ```

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
想知道转发邮件的 webhook 请求是什么样子的吗？我们在下面提供了一个示例！
<span>
</span>
</div>

```json
{
  "attachments": [
    {
      "type": "attachment",
      "content": {
        "type": "Buffer",
        "data": [
          104,
          101,
          108,
          108,
          111,
          32,
          119,
          111,
          114,
          108,
          100,
          33
        ]
      },
      "contentType": "text/plain",
      "partId": "2",
      "release": null,
      "contentDisposition": "attachment",
      "filename": "text1.txt",
      "headers": {},
      "checksum": "fc3ff98e8c6a0d3087d515c0473f8677",
      "size": 12
    }
  ],
  "headers": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\n",
  "headerLines": [
    {
      "key": "arc-seal",
      "line": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0="
    },
    {
      "key": "arc-message-signature",
      "line": "ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino="
    },
    {
      "key": "arc-authentication-results",
      "line": "ARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "received-spf",
      "line": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;"
    },
    {
      "key": "authentication-results",
      "line": "Authentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "x-forward-email-sender",
      "line": "X-Forward-Email-Sender: rfc822; test@example.net"
    },
    {
      "key": "x-forward-email-session-id",
      "line": "X-Forward-Email-Session-ID: w2czxgznghn5ryyw"
    },
    {
      "key": "x-forward-email-version",
      "line": "X-Forward-Email-Version: 9.0.0"
    },
    {
      "key": "content-type",
      "line": "Content-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\""
    },
    {
      "key": "from",
      "line": "From: some <random@example.com>"
    },
    {
      "key": "message-id",
      "line": "Message-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>"
    },
    {
      "key": "date",
      "line": "Date: Wed, 25 May 2022 19:26:41 +0000"
    },
    {
      "key": "mime-version",
      "line": "MIME-Version: 1.0"
    }
  ],
  "html": "<strong>some random text</strong>",
  "text": "some random text",
  "textAsHtml": "<p>some random text</p>",
  "date": "2022-05-25T19:26:41.000Z",
  "from": {
    "value": [
      {
        "address": "random@example.com",
        "name": "some"
      }
    ],
    "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">some</span> &lt;<a href=\"mailto:random@example.com\" class=\"mp_address_email\">random@example.com</a>&gt;</span>",
    "text": "some <random@example.com>"
  },
  "messageId": "<69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>",
  "raw": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nX-Forward-Email-Sender: rfc822; test@example.net\r\nX-Forward-Email-Session-ID: w2czxgznghn5ryyw\r\nX-Forward-Email-Version: 9.0.0\r\nContent-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\"\r\nFrom: some <random@example.com>\r\nMessage-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>\r\nDate: Wed, 25 May 2022 19:26:41 +0000\r\nMIME-Version: 1.0\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: multipart/alternative;\r\n boundary=\"--_NmP-179a735428ca7575-Part_2\"\r\n\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\nsome random text\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\n<strong>some random text</strong>\r\n----_NmP-179a735428ca7575-Part_2--\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: text/plain; name=text1.txt\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=text1.txt\r\n\r\naGVsbG8gd29ybGQh\r\n----_NmP-179a735428ca7575-Part_1--\r\n",
  "dkim": {
    "headerFrom": [
      "random@example.com"
    ],
    "envelopeFrom": "test@example.net",
    "results": [
      {
        "status": {
          "result": "none",
          "comment": "message not signed"
        },
        "info": "dkim=none (message not signed)"
      }
    ]
  },
  "spf": {
    "domain": "example.net",
    "client-ip": "127.0.0.1",
    "helo": "user.oem.local",
    "envelope-from": "test@example.net",
    "status": {
      "result": "none",
      "comment": "mx1.forwardemail.net: example.net does not designate permitted sender hosts",
      "smtp": {
        "mailfrom": "test@example.net",
        "helo": "user.oem.local"
      }
    },
    "header": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;",
    "info": "spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local",
    "lookups": {
      "limit": 50,
      "count": 1
    }
  },
  "arc": {
    "status": {
      "result": "none"
    },
    "i": 0,
    "authResults": "mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
  },
  "dmarc": {
    "status": {
      "result": "none",
      "header": {
        "from": "example.com"
      }
    },
    "domain": "example.com",
    "info": "dmarc=none header.from=example.com"
  },
  "bimi": {
    "status": {
      "header": {},
      "result": "skipped",
      "comment": "DMARC not enabled"
    },
    "info": "bimi=skipped (DMARC not enabled)"
  },
  "recipients": [
    "webhook1@webhooks.net"
  ],
  "session": {
    "recipient": "webhook1@webhooks.net",
    "remoteAddress": "127.0.0.1",
    "remotePort": 65138,
    "clientHostname": "[127.0.0.1]",
    "hostNameAppearsAs": "user.oem.local",
    "sender": "test@example.net",
    "mta": "mx1.forwardemail.net",
    "arrivalDate": "2022-05-25T19:26:41.423Z",
    "arrivalTime": 1653506801423
  }
}
```

### 您是否支持正则表达式或正则表达式 {#do-you-support-regular-expressions-or-regex}

是的，我们已于 2021 年 9 月 27 日添加了此功能。您只需编写正则表达式（“regex”）即可匹配别名并执行替换。

正则表达式支持的别名以 `/` 开头，以 `/` 结尾，且收件人为电子邮件地址或 Webhook。收件人还可以包含正则表达式替换支持（例如 `$1`、`$2`）。

我们支持两个正则表达式标记，包括 `i` 和 `g`。不区分大小写的 `i` 标记是永久默认标记，并且始终强制执行。全局标记 `g` 可以通过在 `/` 后加上 `/g` 来添加。

请注意，我们还通过正则表达式支持收件人部分的<a href="#can-i-disable-specific-aliases">disabled别名功能</a>。

<a href="/disposable-addresses" target="_blank">全局虚荣域名</a>不支持正则表达式（因为这可能是一个安全漏洞）。

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
增强隐私保护：
</strong>
<span>
如果您使用的是付费方案（包含增强隐私保护），请前往<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户<i class="fa fa-angle-right"></i>域名</a>，然后点击域名旁边的“别名”以配置正则表达式。如果您想了解更多关于付费方案的信息，请参阅我们的<a class="alert-link" rel="noopener noreferrer" href="/private-business-email">定价</a>页面。否则，您可以继续按照以下说明操作。
</span>
</div>

如果您使用的是免费计划，则只需使用下面提供的一个或多个示例添加新的 DNS <strong class="notranslate">TXT</strong> 记录：

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>简单示例：</strong>如果我希望所有发送至 `linus@example.com` 或 `torvalds@example.com` 的邮件都转发至 `user@gmail.com`：
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>名字姓氏替换示例：</strong>假设您公司的所有电子邮件地址都采用 `firstname.lastname@example.com` 格式。如果我希望所有采用 `firstname.lastname@example.com` 格式的邮件都转发到 `firstname.lastname@company.com` 格式，并支持替换 (<a href="https://regexr.com/66hnu" class="alert-link">在 RegExr 上查看测试</a>)：
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>加号过滤替换示例：</strong> 如果我希望所有发送至 `info@example.com` 或 `support@example.com` 的邮件分别转发至 `user+info@gmail.com` 或 `user+support@gmail.com`（支持替换）（<a href="https://regexr.com/66ho7" class="alert-link">查看 RegExr 上的测试</a>）：
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Webhook 查询字符串替换示例：</strong> 假设您希望所有发送至 `example.com` 的电子邮件都发送至一个 <a href="#do-you-support-webhooks" class="alert-link">webhook</a>，并使其动态查询字符串键为“to”，值为电子邮件地址的用户名部分（<a href="https://regexr.com/66ho4" class="alert-link">在 RegExr 上查看测试</a>）：
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>静默拒绝示例</strong>：如果您希望所有符合特定模式的电子邮件都被禁用并静默拒绝（在发件人看来，邮件似乎已成功发送，但实际上没有到达目的地），状态码为 `250`（请参阅<a href="#can-i-disable-specific-aliases" class="alert-link">我可以禁用特定别名吗</a>），那么只需使用相同的方法，并添加一个感叹号“!”即可。这向发件人表明邮件已成功送达，但实际上没有到达目的地（例如 blackhole 或 `/dev/null`）。
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>软拒绝示例</strong>：如果您希望所有符合特定模式的邮件都被禁用，并以状态码 `421` 进行软拒绝（请参阅<a href="#can-i-disable-specific-aliases" class="alert-link">我可以禁用特定别名吗</a>），那么只需使用相同的方法，并添加双感叹号“!!”。这表示发件人需要重试发送邮件，发送到此别名的邮件将重试大约 5 天，然后被永久拒绝。
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>硬拒绝示例</strong>：如果您希望所有符合特定模式的邮件都被禁用，并使用状态码 `550` 进行硬拒绝（请参阅<a href="#can-i-disable-specific-aliases" class="alert-link">我可以禁用特定别名吗</a>），那么只需使用相同的方法，并添加三个感叹号“!!!”。这向发件人发出永久性错误，邮件将无法重试，因为该别名会被拒绝。
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
想知道如何编写正则表达式或需要测试你的替换表达式吗？你可以访问免费的正则表达式测试网站 <a href="https://regexr.com" class="alert-link">RegExr</a>，网址为 <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
<span>
</span>
</div>

### 您的出站 SMTP 限制是多少？{#what-are-your-outbound-smtp-limits}

我们限制用户和域名每天发送 SMTP 邮件数量为 300 封。这意味着平均每个自然月会发送超过 9000 封邮件。如果您需要超过此数量或持续发送大量邮件，请使用 [联系我们](https://forwardemail.net/help)。

### 我是否需要获得批准才能启用 SMTP {#do-i-need-approval-to-enable-smtp}

是的，请注意，为了维护 IP 信誉并确保邮件送达率，Forward Email 会针对每个域名设置手动审核流程，以批准出站 SMTP 邮件。请发送电子邮件至 <support@forwardemail.net> 或提交 [帮助请求](https://forwardemail.net/help) 进行审核。审核通常需要不到 24 小时，大多数请求会在 1-2 小时内完成。我们计划在不久的将来通过额外的垃圾邮件控制和警报功能，使此流程即时完成。此流程可确保您的邮件到达收件箱，并且不会被标记为垃圾邮件。

### 您的 SMTP 服务器配置设置是什么？{#what-are-your-smtp-server-configuration-settings}

我们的服务器是`smtp.forwardemail.net`，并且也在我们的<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">状态页面</a>上受到监控。

它支持 IPv4 和 IPv6，可通过端口 `465` 和 `2465` 用于 SSL/TLS，以及 `587`、`2587`、`2525` 和 `25` 用于 TLS（STARTTLS）。

| 协议 | 主机名 | 端口 | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **首选** | `smtp.forwardemail.net` | `465`, `2465` | ：白色勾号： | ：白色勾号： |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | ：白色勾号： | ：白色勾号： |

| 登录 | 例子 | 描述 |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 用户名 | `user@example.com` | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的帐户<i class="fa fa-angle-right"></i>域</a>中存在的域别名的电子邮件地址。 |
| 密码 | `************************` | 别名特定的生成的密码。 |

为了使用 SMTP 发送出站电子邮件，**SMTP 用户**必须是<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的帐户<i class="fa fa-angle-right"></i>域</a>中存在的域别名的电子邮件地址 - 并且**SMTP 密码**必须是特定于别名的生成密码。

请参阅[您是否支持使用 SMTP 发送电子邮件](#do-you-support-sending-email-with-smtp)获取分步说明。

### 您的 IMAP 服务器配置设置是什么？{#what-are-your-imap-server-configuration-settings}

我们的服务器是`imap.forwardemail.net`，并且也在我们的<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">状态页面</a>上受到监控。

它支持 IPv4 和 IPv6，并且可通过端口 `993` 和 `2993` 用于 SSL/TLS。

| 协议 | 主机名 | 端口 | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **首选** | `imap.forwardemail.net` | `993`, `2993` | ：白色勾号： | ：白色勾号： |

| 登录 | 例子 | 描述 |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 用户名 | `user@example.com` | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的帐户<i class="fa fa-angle-right"></i>域</a>中存在的域别名的电子邮件地址。 |
| 密码 | `************************` | 别名特定的生成的密码。 |

为了连接 IMAP，**IMAP 用户**必须是<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的帐户<i class="fa fa-angle-right"></i>域</a>中存在的域别名的电子邮件地址 - 并且**IMAP 密码**必须是特定于别名的生成密码。

请参阅[您是否支持使用 IMAP 接收电子邮件](#do-you-support-receiving-email-with-imap)获取分步说明。

### 您的 POP3 服务器配置设置是什么？{#what-are-your-pop3-server-configuration-settings}

我们的服务器是`pop3.forwardemail.net`，并且也在我们的<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">状态页面</a>上受到监控。

它支持 IPv4 和 IPv6，并且可通过端口 `995` 和 `2995` 用于 SSL/TLS。

| 协议 | 主机名 | 端口 | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **首选** | `pop3.forwardemail.net` | `995`, `2995` | ：白色勾号： | ：白色勾号： |

| 登录 | 例子 | 描述 |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 用户名 | `user@example.com` | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的帐户<i class="fa fa-angle-right"></i>域</a>中存在的域别名的电子邮件地址。 |
| 密码 | `************************` | 别名特定的生成的密码。 |

为了连接 POP3，**POP3 用户**必须是<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的帐户<i class="fa fa-angle-right"></i>域</a>中存在的域别名的电子邮件地址 - 并且**IMAP 密码**必须是特定于别名的生成密码。

请参阅[你们支持POP3吗](#do-you-support-pop3)获取分步说明。

### Postfix SMTP 中继配置 {#postfix-smtp-relay-configuration}

您可以配置 Postfix 通过 Forward Email 的 SMTP 服务器中继邮件。这对于需要发送电子邮件的服务器应用程序非常有用。

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">预计设置时间：</strong>
<span>少于 15 分钟</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
这需要付费套餐并启用 SMTP 访问权限。
</span>
</div>

#### 安装 {#installation}

1. 在您的服务器上安装 Postfix：

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. 安装过程中，当提示配置类型时，选择“Internet 站点”。

#### 配置 {#configuration}

1.编辑主 Postfix 配置文件：

```bash
sudo nano /etc/postfix/main.cf
```

2. 添加或修改以下设置：

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3.创建SASL密码文件：

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. 添加您的转发电子邮件凭证：

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. 保护并散列密码文件：

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. 重新启动 Postfix：

```bash
sudo systemctl restart postfix
```

#### 测试 {#testing}

通过发送测试电子邮件来测试您的配置：

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## 安全 {#security}

### 高级服务器强化技术 {#advanced-server-hardening-techniques}

> \[!TIP]
> Learn more about our security infrastructure on [our Security page](/security).

Forward Email 实施了多种服务器强化技术，以确保我们的基础设施和您的数据的安全：

1. **网络安全**：
* 具有严格规则的 IP 表防火墙
* Fail2ban 提供暴力破解保护
* 定期安全审核和渗透测试
* 仅限 VPN 的管理访问权限

2. **系统强化**：
* 最小化软件包安装
* 定期安全更新
* SELinux 处于强制模式
* 禁用 root SSH 访问
* 仅基于密钥的身份验证

3. **应用安全**：
* 内容安全策略 (CSP) 标头
* HTTPS 严格传输安全 (HSTS)
* XSS 防护标头
* 框架选项和引用策略标头
* 定期依赖项审核

4. **数据保护**：
* 使用 LUKS 进行全盘加密
* 安全密钥管理
* 定期加密备份
* 数据最小化实践

5. **监控与响应**：
* 实时入侵检测
* 自动安全扫描
* 集中日志记录和分析
* 事件响应程序

> \[!IMPORTANT]
> Our security practices are continuously updated to address emerging threats and vulnerabilities.

> \[!TIP]
> For maximum security, we recommend using our service with end-to-end encryption via OpenPGP.

### 您是否拥有 SOC 2 或 ISO 27001 认证？{#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email operates on infrastructure provided by certified subprocessors to ensure compliance with industry standards.

Forward Email 并未直接持有 SOC 2 Type II 或 ISO 27001 认证。但是，该服务基于经认证的子处理商提供的基础架构运行：

* **DigitalOcean**：已获得 SOC 2 Type II 和 SOC 3 Type II 认证（由 Schellman & Company LLC 审核），并在多个数据中心获得 ISO 27001 认证。详情：<https://www.digitalocean.com/trust/certification-reports>

Vultr：已通过 SOC 2+ (HIPAA) 认证，ISO/IEC 认证：20000-1:2018、27001:2022、27017:2015、27018:2019。详情：<https://www.vultr.com/legal/compliance/>

* **DataPacket**：符合 SOC 2 标准（可直接联系 DataPacket 获取认证），企业级基础设施提供商（丹佛分公司）。详情：<https://www.datapacket.com/datacenters/denver>

Forward Email 遵循行业最佳实践进行安全审计，并定期与独立安全研究人员合作。来源：<https://forwardemail.net/technical-whitepaper.pdf#page=36>

### 您是否使用 TLS 加密进行电子邮件转发？{#do-you-use-tls-encryption-for-email-forwarding}

是的。Forward Email 对所有连接（HTTPS、SMTP、IMAP、POP3）严格执行 TLS 1.2+ 协议，并实施 MTA-STS 以增强 TLS 支持。具体实施包括：

* 所有电子邮件连接均强制使用 TLS 1.2+
* ECDHE（椭圆曲线 Diffie-Hellman 临时密钥）密钥交换，实现完美的前向保密性
* 现代密码套件，并定期进行安全更新
* 支持 HTTP/2，提升性能和安全性
* HSTS（HTTP 严格传输安全），可在主流浏览器中预加载
* **MTA-STS（邮件传输代理严格传输安全）**，用于严格执行 TLS

来源：<https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STS 实现**：Forward Email 在代码库中实现了严格的 MTA-STS 强制执行。当发生 TLS 错误且强制执行 MTA-STS 时，系统会返回 421 SMTP 状态代码，以确保电子邮件稍后重试，而不是以不安全的方式投递。实现详情：

* TLS 错误检测：<https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* 发送电子邮件助手中的 MTA-STS 强制执行：<https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

第三方验证：<https://www.hardenize.com/report/forwardemail.net/1750312779> 对所有 TLS 和传输安全措施均显示“良好”评级。

### 您是否保留电子邮件身份验证标头 {#do-you-preserve-email-authentication-headers}

是的。Forward Email 全面实现并保留了电子邮件身份验证标头：

* SPF（发件人策略框架）**：已妥善实施并保存
* DKIM（域名密钥识别邮件）**：全面支持并具备适当的密钥管理
* DMARC**：针对未通过 SPF 或 DKIM 验证的邮件强制执行策略
* ARC**：虽然没有明确详细说明，但该服务的完美合规性评分表明其采用了全面的身份验证标头处理

来源：<https://forwardemail.net/technical-whitepaper.pdf#page=31>

验证：Internet.nl 邮件测试显示“SPF、DKIM 和 DMARC”实施获得 100/100 分。强化评估确认 SPF 和 DMARC 评级为“良好”：<https://www.hardenize.com/report/forwardemail.net/1750312779>

### 您是否保留原始电子邮件标题并防止欺骗{#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email implements sophisticated anti-spoofing protection to prevent email abuse.

Forward Email 保留原始电子邮件标头，同时通过 MX 代码库实施全面的反欺骗保护：

* **标头保留**：转发过程中保留原始身份验证标头
* **反欺骗**：DMARC 策略强制执行，通过拒绝未通过 SPF 或 DKIM 验证的邮件来防止标头欺骗
* **标头注入防护**：使用 striptags 库进行输入验证和过滤
* **高级防护**：先进的网络钓鱼检测，包括欺骗检测、冒充防护和用户通知系统

**MX 实现细节**：核心电子邮件处理逻辑由 MX 服务器代码库处理，具体来说：

* 主 MX 数据处理程序：<https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* 任意电子邮件过滤（反欺骗）：<https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

`isArbitrary` 助手实现了复杂的反欺骗规则，包括检测域名模仿、阻止的短语和各种网络钓鱼模式。

来源：<https://forwardemail.net/technical-whitepaper.pdf#page=32>

### 如何防范垃圾邮件和滥用行为 {#how-do-you-protect-against-spam-and-abuse}

Forward Email 实现全面的多层保护：

* **速率限制**：应用于身份验证尝试、API 端点和 SMTP 连接
* **资源隔离**：在用户之间隔离，以防止高流量用户的影响
* **DDoS 防护**：通过 DataPacket 的 Shield 系统和 Cloudflare 提供多层防护
* **自动扩展**：根据需求动态调整资源
* **滥用预防**：针对特定用户的滥用预防检查和基于哈希值的恶意内容拦截
* **电子邮件身份验证**：SPF、DKIM、DMARC 协议，具有高级网络钓鱼检测功能

资料来源：

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>（DDoS 防护详情）
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### 您是否将电子邮件内容存储在磁盘 {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email uses a zero-knowledge architecture that prevents email content from being written to disk.

* **零知识架构**：每个 SQLite 邮箱均经过单独加密，这意味着 Forward Email 无法访问电子邮件内容
* **内存处理**：电子邮件处理完全在内存中进行，避免磁盘存储
* **无内容日志记录**：“我们不会将电子邮件内容或元数据记录或存储到磁盘”
* **沙盒加密**：加密密钥绝不会以明文形式存储在磁盘上

**MX 代码库证据**：MX 服务器完全在内存中处理电子邮件，无需将内容写入磁盘。主电子邮件处理程序演示了这种内存处理方式：<https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

资料来源：

* <https://forwardemail.net/technical-whitepaper.pdf#page=10>（摘要）
* <https://forwardemail.net/technical-whitepaper.pdf#page=59>（零知识详细信息）
* <https://forwardemail.net/technical-whitepaper.pdf#page=21>（沙盒加密）

### 系统崩溃时电子邮件内容是否会被泄露？{#can-email-content-be-exposed-during-system-crashes}

不会。Forward Email 实施了全面的保护措施，防止与崩溃相关的数据泄露：

* **核心转储已禁用**：防止崩溃期间内存泄露
* **交换内存已禁用**：完全禁用，以防止从交换文件中提取敏感数据
* **内存架构**：电子邮件内容在处理过程中仅存在于易失性内存中
* **加密密钥保护**：密钥绝不会以明文形式存储在磁盘上
* **物理安全**：LUKS v2 加密磁盘可防止物理访问数据
* **USB 存储已禁用**：防止未经授权的数据提取

**系统问题的错误处理**：转发电子邮件使用辅助函数 `isCodeBug` 和 `isTimeoutError` 来确保如果发生任何数据库连接问题、DNS 网络/阻止列表问题或上游连接问题，系统返回 421 SMTP 状态代码以确保电子邮件稍后重试，而不是丢失或暴露。

实施细节：

* 错误分类：<https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* MX 处理中的超时错误处理：<https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

来源：<https://forwardemail.net/technical-whitepaper.pdf#page=15>

### 谁有权访问您的电子邮件基础设施 {#who-has-access-to-your-email-infrastructure}

Forward Email 对其至少 2-3 人的工程团队访问权限实施了全面的访问控制，并具有严格的 2FA 要求：

* **基于角色的访问控制**：适用于具有基于资源权限的团队账户
* **最小特权原则**：适用于所有系统
* **职责分离**：适用于运营角色
* **用户管理**：为部署和开发运维用户分配不同的权限
* **禁用Root登录**：强制通过经过正确身份验证的账户访问
* **严格的双重身份验证**：由于存在中间人攻击风险，不采用基于短信的双重身份验证 - 仅使用基于应用程序或硬件的令牌
* **全面的审计日志记录**：包含敏感数据编辑功能
* **自动异常检测**：针对异常访问模式
* **定期安全审查**：访问日志
* **Evil Maid攻击预防**：禁用USB存储设备并采取其他物理安全措施

资料来源：

* <https://forwardemail.net/technical-whitepaper.pdf#page=30>（授权控制）
* <https://forwardemail.net/technical-whitepaper.pdf#page=30>（网络安全）
* <https://forwardemail.net/technical-whitepaper.pdf#page=15>（防止“邪恶女仆”攻击）

### 您使用哪些基础设施提供商 {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email uses multiple infrastructure subprocessors with comprehensive compliance certifications.

完整详细信息请参阅我们的 GDPR 合规页面：<https://forwardemail.net/gdpr>

**主要基础设施子处理器：**

| 提供者 | 数据隐私框架认证 | GDPR 合规页面 |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **Cloudflare** | ✅ 是的 | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **数据包** | ❌ 不 | <https://www.datapacket.com/privacy-policy> |
| **数字海洋** | ❌ 不 | <https://www.digitalocean.com/legal/gdpr> |
| **Vultr** | ❌ 不 | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**详细认证：**

**数字海洋**

* SOC 2 Type II 和 SOC 3 Type II（由 Schellman & Company LLC 审核）
* 多个数据中心通过 ISO 27001 认证
* 符合 PCI-DSS 标准
* CSA STAR Level 1 认证
* APEC CBPR PRP 认证
* 详情：<https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* SOC 2+ (HIPAA) 认证
* 符合 PCI 商户标准
* CSA STAR 1 级认证
* ISO/IEC 20000-1:2018、27001:2022、27017:2015、27018:2019
* 详情：<https://www.vultr.com/legal/compliance/>

**数据包**

* 符合 SOC 2 标准（直接联系 DataPacket 获取认证）
* 企业级基础设施（丹佛办事处）
* 通过 Shield 网络安全堆栈提供 DDoS 防护
* 全天候技术支持
* 覆盖 58 个数据中心的全球网络
* 详情：<https://www.datapacket.com/datacenters/denver>

**支付处理器：**

* **Stripe**：已通过数据隐私框架认证 - <https://stripe.com/legal/privacy-center>
* **PayPal**：未通过数据隐私框架认证 - <https://www.paypal.com/uk/legalhub/privacy-full>

### 您是否提供数据处理协议 (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

是的，Forward Email 提供全面的数据处理协议 (DPA)，您可以与我们的企业协议一起签署。我们的 DPA 副本可从以下网址获取：<https://forwardemail.net/dpa>

**DPA 详情：**

* 涵盖 GDPR 合规性以及欧盟-美国/瑞士-美国隐私护盾框架
* 同意我们的服务条款即自动接受
* 标准 DPA 无需单独签名
* 企业许可证提供定制 DPA 安排

**GDPR 合规框架**：我们的数据保护协议 (DPA) 详细说明了对 GDPR 以及国际数据传输要求的合规性。完整信息请访问：<https://forwardemail.net/gdpr>

对于需要定制 DPA 条款或特定合同安排的企业客户，可以通过我们的**企业许可证（250 美元/月）**计划来解决。

### 您如何处理数据泄露通知{#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Email's zero-knowledge architecture significantly limits breach impact.

* **有限的数据暴露**：由于零知识架构，无法访问加密的电子邮件内容
* **最低限度的数据收集**：出于安全考虑，仅收集基本的订阅者信息和有限的 IP 日志
* **子处理器框架**：DigitalOcean 和 Vultr 维护符合 GDPR 标准的事件响应程序

**GDPR 代表信息：**
Forward Email 已根据 GDPR 第 27 条任命了代表：

**欧盟代表：**
Osano International Compliance Services Limited
收件人：LFHC
都柏林码头3号，北墙码头
都柏林1区，D01C4E0

**英国代表：**
Osano UK Compliance LTD
收件人：LFHC
贝尔法斯特喷泉街42-46号
安特里姆，BT1-5EF

对于需要特定违规通知 SLA 的企业客户，应将其作为**企业许可**协议的一部分进行讨论。

资料来源：

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### 你们提供测试环境吗？{#do-you-offer-a-test-environment}

Forward Email 的技术文档并未明确描述专用的沙盒模式。不过，潜在的测试方法包括：

* **自托管选项**：全面的自托管功能，可用于创建测试环境
* **API 接口**：可用于对配置进行编程测试
* **开源**：100% 开源代码，方便客户检查转发逻辑
* **多域名**：支持多域名，方便创建测试域名

对于需要正式沙盒功能的企业客户，这应该作为**企业许可**安排的一部分进行讨论。

来源：<https://github.com/forwardemail/forwardemail.net>（开发环境详情）

### 您是否提供监控和警报工具？{#do-you-provide-monitoring-and-alerting-tools}

转发电子邮件提供实时监控，但有一些限制：

**可用的：**

* **实时交付监控**：公开可见主要电子邮件提供商的性能指标
* **自动警报**：交付时间超过 10 秒时，工程团队会收到警报
* **透明监控**：100% 开源监控系统
* **基础设施监控**：自动异常检测和全面的审计日志记录

**限制：**

* 面向客户的 webhook 或基于 API 的交付状态通知没有明确记录

对于需要详细交付状态 webhook 或自定义监控集成的企业客户，这些功能可以通过**企业许可证**安排获得。

资料来源：

* <https://forwardemail.net>（实时监控显示）
* <https://github.com/forwardemail/forwardemail.net>（监控执行）

### 如何确保高可用性 {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implements comprehensive redundancy across multiple infrastructure providers.

* **分布式基础设施**：跨地理区域的多家提供商（DigitalOcean、Vultr、DataPacket）
* **地理负载均衡**：基于 Cloudflare 的地理负载均衡，具有自动故障转移功能
* **自动扩展**：根据需求动态调整资源
* **多层 DDoS 防护**：通过 DataPacket 的 Shield 系统和 Cloudflare 实现
* **服务器冗余**：每个区域配备多台服务器，具有自动故障转移功能
* **数据库复制**：跨多个位置的实时数据同步
* **监控和警报**：全天候监控，自动事件响应

**正常运行时间承诺**：服务可用性 99.9% 以上，可通过 <https://forwardemail.net> 进行透明监控

资料来源：

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### 您是否遵守《国防授权法案》（NDAA）第 889 条的规定？{#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email is fully compliant with Section 889 through careful selection of infrastructure partners.

是的，转发电子邮件符合**第 889 条规定**。《国防授权法案》(NDAA) 第 889 条禁止政府机构使用或与使用特定公司（华为、中兴、海康威视、大华和海能达）的电信和视频监控设备的实体签订合同。

**转发电子邮件如何实现第 889 条合规性：**

Forward Email 完全依赖于两个关键基础设施提供商，这两个提供商均不使用第 889 条禁止的设备：

1. **Cloudflare**：我们主要的网络服务和电子邮件安全合作伙伴
2. **DataPacket**：我们主要的服务器基础设施提供商（仅使用 Arista Networks 和 Cisco 设备）
3. **备份提供商**：我们的备份提供商 Digital Ocean 和 Vultr 已书面确认符合第 889 条规定。

**Cloudflare 的承诺**：Cloudflare 在其第三方行为准则中明确声明，他们不使用任何第 889 条禁止实体的电信设备、视频监控产品或服务。

**政府用例**：当**美国海军学院**选择 Forward Email 满足其安全电子邮件转发需求时，我们的第 889 条合规性得到了验证，需要提供我们联邦合规标准的文件。

有关我们的政府合规框架（包括更广泛的联邦法规）的完整详细信息，请阅读我们的综合案例研究：[符合联邦政府电子邮件服务第 889 条规定](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## 系统和技术细节 {#system-and-technical-details}

### 您是否存储电子邮件及其内容 {#do-you-store-emails-and-their-contents}

不，我们不会使用[错误异常](#do-you-store-error-logs)和[出站 SMTP](#do-you-support-sending-email-with-smtp)（参见我们的[隐私政策](/privacy)）写入磁盘或存储日志。

所有操作均在内存中完成，并且[我们的源代码在 GitHub 上](https://github.com/forwardemail)。

### 您的电子邮件转发系统如何运作？{#how-does-your-email-forwarding-system-work}

电子邮件依赖于 [SMTP 协议](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)。该协议由发送到服务器（通常在 25 端口上运行）的命令组成。首先建立初始连接，然后发件人指示邮件的发件人（“MAIL FROM”），接着指示邮件的目的地（“RCPT TO”），最后是邮件的标题和正文（“DATA”）。我们的电子邮件转发系统流程针对每个 SMTP 协议命令进行了描述，如下所示：

* 初始连接（无命令名称，例如 `telnet example.com 25`）- 这是初始连接。我们会将不在我们的 [允许列表](#do-you-have-an-allowlist) 中的发件人与我们的 [拒绝名单](#do-you-have-a-denylist) 进行比对。最后，如果发件人不在我们的允许列表中，我们会检查他们是否已被 [灰名单](#do-you-have-a-greylist) 保护。

* `HELO` - 表示用于识别发件人 FQDN、IP 地址或邮件处理程序名称的问候语。此值可能被伪造，因此我们不依赖此数据，而是使用连接 IP 地址的反向主机名查找。

* `MAIL FROM` - 表示电子邮件的信封发件人地址。如果输入值，则必须是有效的 RFC 5322 电子邮件地址。允许为空。我们在此处使用 [检查背向散射](#how-do-you-protect-against-backscatter)，并且还会根据 [拒绝名单](#do-you-have-a-denylist) 检查 MAIL FROM。最后，我们会检查未列入允许列表的发件人，以进行速率限制（有关更多信息，请参阅 [速率限制](#do-you-have-rate-limiting) 和 [允许列表](#do-you-have-an-allowlist) 部分）。

* `RCPT TO` - 此项指示电子邮件的收件人。这些地址必须是有效的 RFC 5322 电子邮件地址。每封邮件最多允许 50 个收件人（这与电子邮件的“收件人”标头不同）。我们还会在此处检查有效的 [发件人重写方案](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme)（“SRS”）地址，以防止使用我们的 SRS 域名进行欺骗。

* `DATA` - 这是我们服务处理电子邮件的核心部分。请参阅下方 [如何处理电子邮件以便转发](#how-do-you-process-an-email-for-forwarding) 部分了解更多信息。

### 如何处理电子邮件以进行转发 {#how-do-you-process-an-email-for-forwarding}

本节描述了我们与上面 [您的电子邮件转发系统如何工作](#how-does-your-email-forwarding-system-work) 部分中的 SMTP 协议命令 `DATA` 相关的流程 - 它是我们如何处理电子邮件的标题、正文、安全性、确定需要将其发送到哪里以及我们如何处理连接。

1. 如果邮件超过 50mb 的最大大小，则会被拒绝并显示 552 错误代码。

2. 如果邮件不包含“发件人”标头，或者“发件人”标头中的任何值不是有效的 RFC 5322 电子邮件地址，则会被拒绝，并显示 550 错误代码。

3. 如果邮件中有超过 25 个“已接收”标头，则确定该邮件陷入了重定向循环，并使用 550 错误代码将其拒绝。

4. 使用电子邮件的指纹（请参阅[指纹识别](#how-do-you-determine-an-email-fingerprint)部分），我们将检查该消息是否已尝试重试超过 5 天（与[默认后缀行为](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)相匹配），如果是，则将使用 550 错误代码拒绝该消息。

5. 我们使用 [垃圾邮件扫描程序](https://spamscanner.net) 将扫描电子邮件的结果存储在内存中。

6. 如果垃圾邮件扫描程序有任何任意结果，则会将其拒绝并返回 554 错误代码。截至本文撰写时，任意结果仅包含 GTUBE 测试。更多信息，请参阅 <https://spamassassin.apache.org/gtube/>。

7. 我们将在消息中添加以下标头，以便进行调试和防止滥用：

* `Received` - 我们添加了此标准 Received 标头，其中包含原始 IP 和主机、传输类型、TLS 连接信息、日期/时间和收件人。
* `X-Original-To` - 邮件的原始收件人：
* 这有助于确定电子邮件最初的送达目的地（除了“Received”标头之外）。
* 此标头会在 IMAP 和/或屏蔽转发时为每个收件人添加（以保护隐私）。
* `X-Forward-Email-Website` - 包含指向我们网站 <https://forwardemail.net> 的链接。
* `X-Forward-Email-Version` - 我们代码库中 `package.json` 的当前 [语义版本](https://semver.org/) 版本。
* `X-Forward-Email-Session-ID` - 用于调试目的的会话 ID 值（仅适用于非生产环境）。
* `X-Forward-Email-Sender` - 以逗号分隔的列表，包含原始信封 MAIL FROM 地址（如果非空）、反向 PTR 客户端 FQDN（如果存在）以及发件人的 IP 地址。
* `X-Forward-Email-ID` - 仅适用于出站 SMTP，并与“我的账户”→“电子邮件”中存储的电子邮件 ID 相关联。
* `X-Report-Abuse` - 值为 `abuse@forwardemail.net`。
* `X-Report-Abuse-To` - 值为 `abuse@forwardemail.net`。
* `X-Complaints-To` - 值为 `abuse@forwardemail.net`。

8. 然后我们检查消息中的[DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail)、[SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework)、[ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain)和[DMARC](https://en.wikipedia.org/wiki/DMARC)。

* 如果邮件未通过 DMARC 验证，且域名设置了拒绝策略（例如 `p=reject` [符合 DMARC 政策](https://wikipedia.org/wiki/DMARC)），则会被拒绝，并返回 550 错误代码。通常，域名的 DMARC 策略可以在 `_dmarc` 子域名 <strong class="notranslate">TXT</strong> 记录中找到（例如 `dig _dmarc.example.com txt`）。
* 如果邮件未通过 SPF 验证，且域名设置了硬性失败策略（例如 SPF 策略中包含 `-all`，而不是 `~all` 或根本没有策略），则会被拒绝，并返回 550 错误代码。通常，域名的 SPF 策略可以在根域名的 <strong class="notranslate">TXT</strong> 记录中找到（例如 `dig example.com txt`）。有关 [像 Gmail 一样发送邮件](#can-i-send-mail-as-in-gmail-with-this) 和 SPF 的更多信息，请参阅本节。

9. 现在，我们处理从上文 [您的电子邮件转发系统如何工作](#how-does-your-email-forwarding-system-work) 部分中的 `RCPT TO` 命令收集的消息收件人。对于每个收件人，我们执行以下操作：

* 我们会查找域名的 <strong class="notranslate">TXT</strong> 记录（即 `@` 符号之后的部分，例如，如果电子邮件地址为 `test@example.com`，则查找 `example.com`）。例如，如果域名为 `example.com`，我们会进行 DNS 查找，例如 `dig example.com txt`。
* 我们会解析所有以 `forward-email=`（免费方案）或 `forward-email-site-verification=`（付费方案）开头的 <strong class="notranslate">TXT</strong> 记录。请注意，我们会同时解析这两个记录，以便在用户升级或降级方案时处理电子邮件。
* 从这些解析后的 <strong class="notranslate">TXT</strong> 记录中，我们会对其进行迭代以提取转发配置（如上文 [如何开始并设置电子邮件转发](#how-do-i-get-started-and-set-up-email-forwarding) 部分所述）。请注意，我们仅支持一个 `forward-email-site-verification=` 值，如果提供多个值，则会出现 550 错误，并且发件人将收到针对该收件人的退回邮件。
* 我们以递归方式迭代提取出的转发配置，以确定全局转发、基于正则表达式的转发以及所有其他受支持的转发配置——这些配置现在称为我们的“转发地址”。
* 对于每个转发地址，我们支持一次递归查找（这将在给定地址上重新开始这一系列操作）。如果找到递归匹配，则父结果将从转发地址中移除，并添加子结果。
* 转发地址会被解析以确保唯一性（因为我们不想向一个地址发送重复邮件，也不想额外生成不必要的 SMTP 客户端连接）。
* 对于每个转发地址，我们会根据 API 端点 `/v1/max-forwarded-addresses` 查找其域名（以确定该域名每个别名允许转发邮件到多少个地址，例如默认为 10 个 - 请参阅 [每个别名的转发最大限制](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias) 部分）。如果超过此限制，将发生 550 错误，发件人将收到针对此收件人的退回邮件。
* 我们会根据 API 端点 `/v1/settings` 查找原始收件人的设置，该端点支持付费用户的查找（免费用户可回退）。这将返回一个配置对象，用于设置 `port`（数字，例如 `25`）、`has_adult_content_protection`（布尔值）、`has_phishing_protection`（布尔值）、`has_executable_protection`（布尔值）和 `has_virus_protection`（布尔值）的高级设置。
* 根据这些设置，我们会检查垃圾邮件扫描程序的结果，如果出现任何错误，则会拒绝该邮件并返回 554 错误代码（例如，如果启用了 `has_virus_protection`，我们会检查垃圾邮件扫描程序的结果中是否存在病毒）。请注意，所有免费套餐用户都将选择加入针对成人内容、网络钓鱼、可执行文件和病毒的检查。默认情况下，所有付费计划用户也选择加入，但可以在转发电子邮件仪表板中的域的设置页面下更改此配置）。

10. 对于每个已处理的收件人的转发地址，我们执行以下操作：

* 我们会根据我们的 [拒绝名单](#do-you-have-a-denylist) 检查地址，如果已列出，则会显示 421 错误代码（指示发件人稍后重试）。
* 如果地址是 webhook，我们会为将来的操作设置一个布尔值（见下文 - 我们将相似的 webhook 组合在一起，以发出一个 POST 请求，而不是发送多个请求进行传递）。
* 如果地址是电子邮件地址，我们会解析主机以进行将来的操作（见下文 - 我们将相似的主机组合在一起，以发出一个连接，而不是发送多个单独的连接进行传递）。

11. 如果没有收件人且没有退回，那么我们将响应 550 错误“收件人无效”。

12. 如果有收件人，我们会遍历所有收件人（按同一主机分组）并发送电子邮件。更多详情，请参阅下方 [如何处理电子邮件传递问题](#how-do-you-handle-email-delivery-issues) 部分。

* 如果在发送电子邮件时发生任何错误，我们会将其存储在内存中以供后续处理。
* 我们会从发送电子邮件中取出最低的错误代码（如果有），并将其用作 `DATA` 命令的响应代码。这意味着未送达的电子邮件通常会由原始发件人重试，但已送达的电子邮件将不会在下次发送邮件时重新发送（因为我们使用 [指纹识别](#how-do-you-determine-an-email-fingerprint)）。
* 如果没有发生错误，我们将发送 250 表示成功的 SMTP 响应状态代码。
* 任何尝试送达但导致状态代码 >= 500（永久失败）的邮件都会被判定为退回邮件。

13. 如果没有发生退回（永久性故障），那么我们将返回非永久性故障中最低错误代码的 SMTP 响应状态代码（如果没有，则返回 250 成功状态代码）。

14. 如果确实发生退信，我们会在向发件人返回所有错误代码中最低的错误代码后，在后台发送退信邮件。但是，如果最低错误代码大于等于 500，我们不会发送任何退信邮件。这是因为，如果我们发送退信邮件，发件人将收到两封退信邮件（例如，一封来自他们的出站 MTA，例如 Gmail，另一封来自我们）。请参阅下文“[如何防止背向散射](#how-do-you-protect-against-backscatter)”部分了解更多信息。

### 您如何处理电子邮件递送问题 {#how-do-you-handle-email-delivery-issues}

请注意，当且仅当发件人的 DMARC 策略未通过且没有 DKIM 签名与“发件人”标头对齐时，我们才会对电子邮件进行“Friendly-From”重写。这意味着我们将更改邮件上的“发件人”标头，设置“X-Original-From”，如果尚未设置，还将设置“回复”。更改这些标头后，我们还将在邮件上重新密封 ARC 封条。

我们还在堆栈的每个级别使用错误消息的智能解析 - 在我们的代码中，DNS 请求、Node.js 内部、HTTP 请求（例如，如果收件人是 webhook，则 408、413 和 429 会映射到 SMTP 响应代码 421）和邮件服务器响应（例如，带有“defer”或“slowdown”的响应将作为 421 错误重试）。

我们的逻辑是防呆式的，它还会在 SSL/TLS 错误、连接问题等情况下重试。防呆式的目标是最大限度地提高转发配置中所有收件人的送达率。

如果收件人是 Webhook，我们将允许 60 秒的超时时间，以便请求完成，最多可重试 3 次（因此在失败前总共可进行 4 次请求）。请注意，我们正确解析了错误代码 408、413 和 429，并将它们映射到 SMTP 响应代码 421。

否则，如果收件人是电子邮件地址，我们将尝试使用机会性 TLS 发送电子邮件（如果收件人邮件服务器上有 STARTTLS，我们将尝试使用它）。如果在尝试发送电子邮件时发生 SSL/TLS 错误，我们将尝试不使用 TLS 发送电子邮件（不使用 STARTTLS）。

如果发生任何 DNS 或连接错误，那么我们将向 `DATA` 命令返回 SMTP 响应代码 421，否则如果存在 >= 500 级别的错误，则会发送退回邮件。

如果我们检测到我们尝试传递邮件的电子邮件服务器的一个或多个邮件交换 IP 地址被阻止（例如，通过他们用于延迟垃圾邮件发送者的任何技术），那么我们将发送 421 的 SMTP 响应代码，以便发件人稍后重试他们的消息（并且我们会收到有关该问题的警报，以便我们希望能够在下次尝试之前解决该问题）。

### 您的 IP 地址被屏蔽后，您该如何处理？{#how-do-you-handle-your-ip-addresses-becoming-blocked}

我们会定期监控所有主要的 DNS 拒绝列表，如果我们的任何邮件交换（“MX”）IP 地址列在主要拒绝列表中，我们将尽可能将其从相关的 DNS A 记录循环中拉出，直到问题得到解决。

在撰写本文时，我们也已被列入多个 DNS 允许列表，并且我们非常重视监控拒绝列表。如果您在我们解决问题之前发现任何问题，请通过 <support@forwardemail.net> 以书面形式通知我们。

我们的 IP 地址是公开的，[请参阅下面的部分以获得更多见解](#what-are-your-servers-ip-addresses)。

### 什么是邮政局长地址 {#what-are-postmaster-addresses}

为了防止错误重定向的退回邮件以及向不受监控或不存在的邮箱发送休假响应消息，我们维护了一个邮件守护进程（如用户名）列表：

* `automailer`
* `autoresponder`
* `bounce`
* `bounce-notification`
* `bounce-notifications`
* `bounces`
* `hostmaster`
* `listserv`
* `localhost`
* `mail-daemon`
* `mail.daemon`
* `maildaemon`
* `mailer-daemon`
* `mailer.daemon`
* `mailerdaemon`
* `majordomo`
* `postmaster`
* [以及任何无回复地址](#what-are-no-reply-addresses)

请参阅[RFC 5320 第 4.6 节](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6)以了解如何使用这些列表来创建高效的电子邮件系统。

### 什么是无回复地址 {#what-are-no-reply-addresses}

电子邮件用户名等于以下任何一个（不区分大小写）均被视为无回复地址：

* `do-not-reply`
* `do-not-respond`
* `do.not.reply`
* `donotreply`
* `donotrespond`
* `dont-reply`
* `naoresponda`
* `no-replies`
* `no-reply`
* `no-replys`
* `no.replies`
* `no.reply`
* `no.replys`
* `no_reply`
* `nobody`
* `noreplies`
* `noreply`
* `noreplys`

此列表由 [作为 GitHub 上的开源项目](https://github.com/forwardemail/reserved-email-addresses-list) 维护。

### 您的服务器的 IP 地址是多少？{#what-are-your-servers-ip-addresses}

我们在 <https://forwardemail.net/ips>. 上发布了我们的 IP 地址

### 您是否有允许列表 {#do-you-have-an-allowlist}

是的，我们有一个默认列入允许名单的[域名扩展列表](#what-domain-name-extensions-are-allowlisted-by-default)，以及一个基于[严格的标准](#what-is-your-allowlist-criteria)的动态、缓存和滚动允许名单。

付费计划客户的所有电子邮件、域名和收件人都会自动添加到我们的允许列表中。

### 哪些域名扩展默认列入允许名单 {#what-domain-name-extensions-are-allowlisted-by-default}

以下域名扩展默认被视为已列入允许名单（无论它们是否在 Umbrella 流行度列表中）：

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">edu</code></li>
<li class="list-inline-item"><code class="notranslate">gov</code></li>
<li class="list-inline-item"><code class="notranslate">mil</code></li>
<li class="list-inline-item"><code class="notranslate">int</code></li>
<li class="list-inline-item"><code class="notranslate">ARPA</code></li>
<li class="list-inline-item"><code class="notranslate">dni.us</code></li>
<li class="list-inline-item"><code class="notranslate">fed.us</code></li>
<li class="list-inline-item"><code class="notranslate">isa.us</code></li>
<li class="list-inline-item"><code class="notranslate">kids.us</code></li>
<li class="list-inline-item"><code class="notranslate">nsn.us</code></li>
<li class="list-inline-item"><code class="notranslate">ak.us</code></li>
<li class="list-inline-item"><code class="notranslate">al.us</code></li>
<li class="list-inline-item"><code class="notranslate">ar.us</code></li>
<li class="list-inline-item"><code class="notranslate">as.us</code></li>
<li class="list-inline-item"><code class="notranslate">az.us</code></li>
<li class="list-inline-item"><code class="notranslate">ca.us</code></li>
<li class="list-inline-item"><code class="notranslate">co.us</code></li>
<li class="list-inline-item"><code class="notranslate">ct.us</code></li>
<li class="list-inline-item"><code class="notranslate">dc.us</code></li>
<li class="list-inline-item"><code class="notranslate">de.us</code></li>
<li class="list-inline-item"><code class="notranslate">fl.us</code></li>
<li class="list-inline-item"><code class="notranslate">ga.us</code></li>
<li class="list-inline-item"><code class="notranslate">gu.us</code></li>
<li class="list-inline-item"><code class="notranslate">hi.us</code></li>
<li class="list-inline-item"><code class="notranslate">ia.us</code></li>
<li class="list-inline-item"><code class="notranslate">id.us</code></li>
<li class="list-inline-item"><code class="notranslate">il.us</code></li>
<li class="list-inline-item"><code class="notranslate">in.us</code></li>
<li class="list-inline-item"><code class="notranslate">ks.us</code></li>
<li class="list-inline-item"><code class="notranslate">ky.us</code></li>
<li class="list-inline-item"><code class="notranslate">la.us</code></li>
<li class="list-inline-item"><code class="notranslate">ma.us</code></li>
<li class="list-inline-item"><code class="notranslate">md.us</code></li>
<li class="list-inline-item"><code class="notranslate">me.us</code></li>
<li class="list-inline-item"><code class="notranslate">mi.us</code></li>
<li class="list-inline-item"><code class="notranslate">mn.us</code></li>
<li class="list-inline-item"><code class="notranslate">mo.us</code></li>
<li class="list-inline-item"><code class="notranslate">ms.us</code></li>
<li class="list-inline-item"><code class="notranslate">mt.us</code></li>
<li class="list-inline-item"><code class="notranslate">nc.us</code></li>
<li class="list-inline-item"><code class="notranslate">nd.us</code></li>
<li class="list-inline-item"><code class="notranslate">ne.us</code></li>
<li class="list-inline-item"><code class="notranslate">nh.us</code></li>
<li class="list-inline-item"><code class="notranslate">nj.us</code></li>
<li class="list-inline-item"><code class="notranslate">nm.us</code></li>
<li class="list-inline-item"><code class="notranslate">nv.us</code></li>
<li class="list-inline-item"><code class="notranslate">ny.us</code></li>
<li class="list-inline-item"><code class="notranslate">oh.us</code></li>
<li class="list-inline-item"><code class="notranslate">ok.us</code></li>
<li class="list-inline-item"><code class="notranslate">or.us</code></li>
<li class="list-inline-item"><code class="notranslate">pa.us</code></li>
<li class="list-inline-item"><code class="notranslate">pr.us</code></li>
<li class="list-inline-item"><code class="notranslate">ri.us</code></li>
<li class="list-inline-item"><code class="notranslate">sc.us</code></li>
<li class="list-inline-item"><code class="notranslate">sd.us</code></li>
<li class="list-inline-item"><code class="notranslate">tn.us</code></li>
<li class="list-inline-item"><code class="notranslate">tx.us</code></li>
<li class="list-inline-item"><code class="notranslate">ut.us</code></li>
<li class="list-inline-item"><code class="notranslate">va.us</code></li>
<li class="list-inline-item"><code class="notranslate">vi.us</code></li>
<li class="list-inline-item"><code class="notranslate">vt.us</code></li>
<li class="list-inline-item"><code class="notranslate">wa.us</code></li>
<li class="list-inline-item"><code class="notranslate">wi.us</code></li>
<li class="list-inline-item"><code class="notranslate">wv.us</code></li>
<li class="list-inline-item"><code class="notranslate">wy.us</code></li>
<li class="list-inline-item"><code class="notranslate">mil.tt</code></li>
<li class="list-inline-item"><code class="notranslate">edu.tt</code></li>
<li class="list-inline-item"><code class="notranslate">edu.tr</code></li>
<li class="list-inline-item"><code class="notranslate">edu.ua</code></li>
<li class="list-inline-item"><code class="notranslate">edu.au</code></li>
<li class="list-inline-item"><code class="notranslate">ac.at</code></li>
<li class="list-inline-item"><code class="notranslate">edu.br</code></li>
<li class="list-inline-item"><code class="notranslate">ac.nz</code></li>
<li class="list-inline-item"><code class="notranslate">school.nz</code></li>
<li class="list-inline-item"><code class="notranslate">cri.nz</code></li>
<li class="list-inline-item"><code class="notranslate">health.nz</code></li>
<li class="list-inline-item"><code class="notranslate">mil.nz</code></li>
<li class="list-inline-item"><code class="notranslate">parliament.nz</code></li>
<li class="list-inline-item"><code class="notranslate">ac.in</code></li>
<li class="list-inline-item"><code class="notranslate">edu.in</code></li>
<li class="list-inline-item"><code class="notranslate">mil.in</code></li>
<li class="list-inline-item"><code class="notranslate">ac.jp</code></li>
<li class="list-inline-item"><code class="notranslate">ed.jp</code></li>
<li class="list-inline-item"><code class="notranslate">lg.jp</code></li>
<li class="list-inline-item"><code class="notranslate">ac.za</code></li>
<li class="list-inline-item"><code class="notranslate">edu.za</code></li>
<li class="list-inline-item"><code class="notranslate">mil.za</code></li>
<li class="list-inline-item"><code class="notranslate">school.za</code></li>
<li class="list-inline-item"><code class="notranslate">mil.kr</code></li>
<li class="list-inline-item"><code class="notranslate">ac.kr</code></li>
<li class="list-inline-item"><code class="notranslate">hs.kr</code></li>
<li class="list-inline-item"><code class="notranslate">ms.kr</code></li>
<li class="list-inline-item"><code class="notranslate">es.kr</code></li>
<li class="list-inline-item"><code class="notranslate">sc.kr</code></li>
<li class="list-inline-item"><code class="notranslate">kg.kr</code></li>
<li class="list-inline-item"><code class="notranslate">edu.es</code></li>
<li class="list-inline-item"><code class="notranslate">ac.lk</code></li>
<li class="list-inline-item"><code class="notranslate">sch.lk</code></li>
<li class="list-inline-item"><code class="notranslate">edu.lk</code></li>
<li class="list-inline-item"><code class="notranslate">ac.th</code></li>
<li class="list-inline-item"><code class="notranslate">mi.th</code></li>
<li class="list-inline-item"><code class="notranslate">admin.ch</code></li>
<li class="list-inline-item"><code class="notranslate">canada.ca</code></li>
<li class="list-inline-item"><code class="notranslate">gc.ca</code></li>
<li class="list-inline-item"><code class="notranslate">go.id</code></li>
<li class="list-inline-item"><code class="notranslate">go.jp</code></li>
<li class="list-inline-item"><code class="notranslate">go.ke</code></li>
<li class="list-inline-item"><code class="notranslate">go.kr</code></li>
<li class="list-inline-item"><code class="notranslate">go.th</code></li>
<li class="list-inline-item"><code class="notranslate">gob.ar</code></li>
<li class="list-inline-item"><code class="notranslate">gob.cl</code></li>
<li class="list-inline-item"><code class="notranslate">gob.es</code></li>
<li class="list-inline-item"><code class="notranslate">gob.mx</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gob.pe</code></li>-->
<li class="list-inline-item"><code class="notranslate">gob.ve</code></li>
<li class="list-inline-item"><code class="notranslate">gob.sv</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.fr</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.nc</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.qc.ca</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ad</code></li>
<li class="list-inline-item"><code class="notranslate">gov.af</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ai</code></li>
<li class="list-inline-item"><code class="notranslate">gov.al</code></li>
<li class="list-inline-item"><code class="notranslate">gov.am</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ao</code></li>
<li class="list-inline-item"><code class="notranslate">gov.au</code></li>
<li class="list-inline-item"><code class="notranslate">gov.aw</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ax</code></li>
<li class="list-inline-item"><code class="notranslate">gov.az</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bd</code></li>
<li class="list-inline-item"><code class="notranslate">gov.be</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bm</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>-->
<li class="list-inline-item"><code class="notranslate">gov.by</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cl</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cn</code></li>
<li class="list-inline-item"><code class="notranslate">gov.co</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cy</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.dz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.eg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.fi</code></li>
<li class="list-inline-item"><code class="notranslate">gov.fk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.gg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.gr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hu</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ie</code></li>
<li class="list-inline-item"><code class="notranslate">gov.il</code></li>
<li class="list-inline-item"><code class="notranslate">gov.im</code></li>
<li class="list-inline-item"><code class="notranslate">gov.in</code></li>
<li class="list-inline-item"><code class="notranslate">gov.iq</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ir</code></li>
<li class="list-inline-item"><code class="notranslate">gov.it</code></li>
<li class="list-inline-item"><code class="notranslate">gov.je</code></li>
<li class="list-inline-item"><code class="notranslate">gov.kp</code></li>
<li class="list-inline-item"><code class="notranslate">gov.krd</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ky</code></li>
<li class="list-inline-item"><code class="notranslate">gov.kz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lb</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lv</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ma</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mm</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mo</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.my</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ng</code></li>
<li class="list-inline-item"><code class="notranslate">gov.np</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ph</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pl</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.py</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ro</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ru</code></li>
<li class="list-inline-item"><code class="notranslate">gov.scot</code></li>
<li class="list-inline-item"><code class="notranslate">gov.se</code></li>
<li class="list-inline-item"><code class="notranslate">gov.sg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.si</code></li>
<li class="list-inline-item"><code class="notranslate">gov.sk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tw</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ua</code></li>
<li class="list-inline-item"><code class="notranslate">gov.uk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.vn</code></li>
<li class="list-inline-item"><code class="notranslate">gov.wales</code></li>
<li class="list-inline-item"><code class="notranslate">gov.za</code></li>
<li class="list-inline-item"><code class="notranslate">government.pn</code></li>
<li class="list-inline-item"><code class="notranslate">govt.nz</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gub.uy</code></li>-->
<li class="list-inline-item"><code class="notranslate">gv.at</code></li>
<li class="list-inline-item"><code class="notranslate">ac.uk</code></li>
<li class="list-inline-item"><code class="notranslate">bl.uk</code></li>
<li class="list-inline-item"><code class="notranslate">judiciary.uk</code></li>
<li class="list-inline-item"><code class="notranslate">mod.uk</code></li>
<li class="list-inline-item"><code class="notranslate">nhs.uk</code></li>
<li class="list-inline-item"><code class="notranslate">parliament.uk</code></li>
<li class="list-inline-item"><code class="notranslate">police.uk</code></li>
<li class="list-inline-item"><code class="notranslate">rct.uk</code></li>
<li class="list-inline-item"><code class="notranslate">royal.uk</code></li>
<li class="list-inline-item"><code class="notranslate">sch.uk</code></li>
<li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>

此外，这些 [品牌和企业顶级域名](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) 默认被列入允许名单（例如，对于 Apple Card 银行对账单，`apple` 对应 `applecard.apple`）：

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">aaa</code></li>
<li class="list-inline-item"><code class="notranslate">aarp</code></li>
<li class="list-inline-item"><code class="notranslate">abarth</code></li>
<li class="list-inline-item"><code class="notranslate">abb</code></li>
<li class="list-inline-item"><code class="notranslate">abbott</code></li>
<li class="list-inline-item"><code class="notranslate">abbvie</code></li>
<li class="list-inline-item"><code class="notranslate">abc</code></li>
<li class="list-inline-item"><code class="notranslate">accenture</code></li>
<li class="list-inline-item"><code class="notranslate">aco</code></li>
<li class="list-inline-item"><code class="notranslate">aeg</code></li>
<li class="list-inline-item"><code class="notranslate">aetna</code></li>
<li class="list-inline-item"><code class="notranslate">afl</code></li>
<li class="list-inline-item"><code class="notranslate">agakhan</code></li>
<li class="list-inline-item"><code class="notranslate">aig</code></li>
<li class="list-inline-item"><code class="notranslate">aigo</code></li>
<li class="list-inline-item"><code class="notranslate">airbus</code></li>
<li class="list-inline-item"><code class="notranslate">airtel</code></li>
<li class="list-inline-item"><code class="notranslate">akdn</code></li>
<li class="list-inline-item"><code class="notranslate">alfaromeo</code></li>
<li class="list-inline-item"><code class="notranslate">阿里巴巴</code></li>
<li class="list-inline-item"><code class="notranslate">支付宝</code></li>
<li class="list-inline-item"><code class="notranslate">allfinanz</code></li>
<li class="list-inline-item"><code class="notranslate">allstate</code></li>
<li class="list-inline-item"><code class="notranslate">ally</code></li>
<li class="list-inline-item"><code class="notranslate">alstom</code></li>
<li class="list-inline-item"><code class="notranslate">亚马逊</code></li>
<li class="list-inline-item"><code class="notranslate">美国运通</code></li>
<li class="list-inline-item"><code class="notranslate">美国运通</code></li>
<li class="list-inline-item"><code class="notranslate">美国运通</code></li>
<li class="list-inline-item"><code class="notranslate">安卓</code></li>
<li class="list-inline-item"><code class="notranslate">澳新银行</code></li>
<li class="list-inline-item"><code class="notranslate">美国在线</code></li>
<li class="list-inline-item"><code class="notranslate">苹果</code></li>
<li class="list-inline-item"><code class="notranslate">aquarelle</code></li>
<li class="list-inline-item"><code class="notranslate">aramco</code></li>
<li class="list-inline-item"><code class="notranslate">audi</code></li>
<li class="list-inline-item"><code class="notranslate">auspost</code></li>
<li class="list-inline-item"><code class="notranslate">aws</code></li>
<li class="list-inline-item"><code class="notranslate">axa</code></li>
<li class="list-inline-item"><code class="notranslate">azure</code></li>
<li class="list-inline-item"><code class="notranslate">百度</code></li>
<li class="list-inline-item"><code class="notranslate">bananarepublic</code></li>
<li class="list-inline-item"><code class="notranslate">巴克莱卡</code></li>
<li class="list-inline-item"><code class="notranslate">巴克莱银行</code></li>
<li class="list-inline-item"><code class="notranslate">篮球</code></li>
<li class="list-inline-item"><code class="notranslate">包豪斯</code></li>
<li class="list-inline-item"><code class="notranslate">英国广播公司</code></li>
<li class="list-inline-item"><code class="notranslate">英国电信</code></li>
<li class="list-inline-item"><code class="notranslate">西班牙电力公司</code></li>
<li class="list-inline-item"><code class="notranslate">西班牙电力公司</code></li>
<li class="list-inline-item"><code class="notranslate">西班牙电力公司</code></li>
<li class="list-inline-item"><code class="notranslate">西班牙电力公司</code></li> class="notranslate">宾利</code></li>
<li class="list-inline-item"><code class="notranslate">巴帝</code></li>
<li class="list-inline-item"><code class="notranslate">必应</code></li>
<li class="list-inline-item"><code class="notranslate">布兰科</code></li>
<li class="list-inline-item"><code class="notranslate">彭博</code></li>
<li class="list-inline-item"><code class="notranslate">百事</code></li>
<li class="list-inline-item"><code class="notranslate">宝马</code></li>
<li class="list-inline-item"><code class="notranslate">宝马</code></li>
<li class="list-inline-item"><code class="notranslate">百事</code></li>
<li class="list-inline-item"><code class="notranslate">勃林格</code></li>
<li class="list-inline-item"><code class="notranslate">邦德</code></li>
<li class="list-inline-item"><code class="notranslate">Booking</code></li>
<li class="list-inline-item"><code class="notranslate">博世</code></li>
<li class="list-inline-item"><code class="notranslate">博斯蒂克</code></li>
<li class="list-inline-item"><code class="notranslate">布拉德斯科</code></li>
<li class="list-inline-item"><code class="notranslate">普利司通</code></li>
<li class="list-inline-item"><code class="notranslate">兄弟</code></li>
<li class="list-inline-item"><code class="notranslate">布加迪</code></li>
<li class="list-inline-item"><code class="notranslate">cal</code></li>
<li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
<li class="list-inline-item"><code class="notranslate">佳能</code></li>
<li class="list-inline-item"><code class="notranslate">capitalone</code></li>
<li class="list-inline-item"><code class="notranslate">caravan</code></li>
<li class="list-inline-item"><code class="notranslate">卡地亚</code></li>
<li class="list-inline-item"><code class="notranslate">cba</code></li>
<li class="list-inline-item"><code class="notranslate">cbn</code></li>
<li class="list-inline-item"><code class="notranslate">cbre</code></li>
<li class="list-inline-item"><code class="notranslate">cbs</code></li>
<li class="list-inline-item"><code class="notranslate">cern</code></li>
<li class="list-inline-item"><code class="notranslate">cfa</code></li>
<li class="list-inline-item"><code class="notranslate">chanel</code></li>
<li class="list-inline-item"><code class="notranslate">chase</code></li>
<li class="list-inline-item"><code class="notranslate">chintai</code></li>
<li class="list-inline-item"><code class="notranslate">chrome</code></li>
<li class="list-inline-item"><code class="notranslate">克莱斯勒</code></li>
<li class="list-inline-item"><code class="notranslate">Cipriani</code></li>
<li class="list-inline-item"><code class="notranslate">思科</code></li>
<li class="list-inline-item"><code class="notranslate">Citadel</code></li>
<li class="list-inline-item"><code class="notranslate">花旗</code></li>
<li class="list-inline-item"><code class="notranslate">中信</code></li>
<li class="list-inline-item"><code class="notranslate">ClubMed</code></li>
<li class="list-inline-item"><code class="notranslate">康卡斯特</code></li>
<li class="list-inline-item"><code class="notranslate">联邦银行</code></li>
<li class="list-inline-item"><code class="notranslate">creditunion</code></li>
<li class="list-inline-item"><code class="notranslate">crown</code></li>
<li class="list-inline-item"><code class="notranslate">crs</code></li>
<li class="list-inline-item"><code class="notranslate">csc</code></li>
<li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
<li class="list-inline-item"><code class="notranslate">dabur</code></li>
<li class="list-inline-item"><code class="notranslate">datsun</code></li>
<li class="list-inline-item"><code class="notranslate">dealer</code></li>
<li class="list-inline-item"><code class="notranslate">戴尔</code></li>
<li class="list-inline-item"><code class="notranslate">德勤</code></li>
<li class="list-inline-item"><code class="notranslate">达美乐</code></li>
<li class="list-inline-item"><code class="notranslate">敦豪</code></li>
<li class="list-inline-item"><code class="notranslate">发现</code></li>
<li class="list-inline-item"><code class="notranslate">碟</code></li>
<li class="list-inline-item"><code class="notranslate">dnp</code></li>
<li class="list-inline-item"><code class="notranslate">道奇</code></li>
<li class="list-inline-item"><code class="notranslate">邓禄普</code></li>
<li class="list-inline-item"><code class="notranslate">杜邦</code></li>
<li class="list-inline-item"><code class="notranslate">dvag</code></li>
<li class="list-inline-item"><code class="notranslate">edeka</code></li>
<li class="list-inline-item"><code class="notranslate">emerck</code></li>
<li class="list-inline-item"><code class="notranslate">爱普生</code></li>
<li class="list-inline-item"><code class="notranslate">爱立信</code></li>
<li class="list-inline-item"><code class="notranslate">erni</code></li>
<li class="list-inline-item"><code class="notranslate">esurance</code></li>
<li class="list-inline-item"><code class="notranslate">etisalat</code></li>
<li class="list-inline-item"><code class="notranslate">欧洲电视网</code></li>
<li class="list-inline-item"><code class="notranslate">everbank</code></li>
<li class="list-inline-item"><code class="notranslate">extraspace</code></li>
<li class="list-inline-item"><code class="notranslate">fage</code></li>
<li class="list-inline-item"><code class="notranslate">fairwinds</code></li>
<li class="list-inline-item"><code class="notranslate">farmers</code></li>
<li class="list-inline-item"><code class="notranslate">联邦快递</code></li>
<li class="list-inline-item"><code class="notranslate">法拉利</code></li>
<li class="list-inline-item"><code class="notranslate">费列罗</code></li>
<li class="list-inline-item"><code class="notranslate">菲亚特</code></li>
<li class="list-inline-item"><code class="notranslate">富达</code></li>
<li class="list-inline-item"><code class="notranslate">凡士通</code></li>
<li class="list-inline-item"><code class="notranslate">菲尔戴尔</code></li>
<li class="list-inline-item"><code class="notranslate">Flickr</code></li>
<li class="list-inline-item"><code class="notranslate">Flixir</code></li>
<li class="list-inline-item"><code class="notranslate">Flixmidth</code></li>
<li class="list-inline-item"><code class="notranslate">Flixmidth</code></li> class="notranslate">福特</code></li>
<li class="list-inline-item"><code class="notranslate">福克斯</code></li>
<li class="list-inline-item"><code class="notranslate">费森尤斯</code></li>
<li class="list-inline-item"><code class="notranslate">外汇</code></li>
<li class="list-inline-item"><code class="notranslate">福罗根斯</code></li>
<li class="list-inline-item"><code class="notranslate">边疆</code></li>
<li class="list-inline-item"><code class="notranslate">富士通</code></li>
<li class="list-inline-item"><code class="notranslate">富士施乐</code></li>
<li class="list-inline-item"><code class="notranslate">加洛</code></li>
<li class="list-inline-item"><code class="notranslate">盖洛普</code></li>
<li class="list-inline-item"><code class="notranslate">盖普</code></li>
<li class="list-inline-item"><code class="notranslate">gbiz</code></li>
<li class="list-inline-item"><code class="notranslate">gea</code></li>
<li class="list-inline-item"><code class="notranslate">云顶</code></li>
<li class="list-inline-item"><code class="notranslate">giving</code></li>
<li class="list-inline-item"><code class="notranslate">gle</code></li>
<li class="list-inline-item"><code class="notranslate">globo</code></li>
<li class="list-inline-item"><code class="notranslate">gmail</code></li>
<li class="list-inline-item"><code class="notranslate">gmo</code></li>
<li class="list-inline-item"><code class="notranslate">gmx</code></li>
<li class="list-inline-item"><code class="notranslate">godaddy</code></li>
<li class="list-inline-item"><code class="notranslate">goldpoint</code></li>
<li class="list-inline-item"><code class="notranslate">goodyear</code></li>
<li class="list-inline-item"><code class="notranslate">goog</code></li>
<li class="list-inline-item"><code class="notranslate">google</code></li>
<li class="list-inline-item"><code class="notranslate">grainger</code></li>
<li class="list-inline-item"><code class="notranslate">卫报</code></li>
<li class="list-inline-item"><code class="notranslate">古驰</code></li>
<li class="list-inline-item"><code class="notranslate">HBO</code></li>
<li class="list-inline-item"><code class="notranslate">HDFC</code></li>
<li class="list-inline-item"><code class="notranslate">HDFC银行</code></li>
<li class="list-inline-item"><code class="notranslate">爱马仕</code></li>
<li class="list-inline-item"><code class="notranslate">久光</code></li>
<li class="list-inline-item"><code class="notranslate">日立</code></li>
<li class="list-inline-item"><code class="notranslate">香港电讯</code></li>
<li class="list-inline-item"><code class="notranslate">本田</code></li>
<li class="list-inline-item"><code class="notranslate">霍尼韦尔</code></li>
<li class="list-inline-item"><code class="notranslate">Hotmail</code></li>
<li class="list-inline-item"><code class="notranslate">汇丰银行</code></li>
<li class="list-inline-item"><code class="notranslate">休斯</code></li>
<li class="list-inline-item"><code class="notranslate">凯悦</code></li>
<li class="list-inline-item"><code class="notranslate">现代</code></li>
<li class="list-inline-item"><code class="notranslate">IBM</code></li>
<li class="list-inline-item"><code class="notranslate">IEEE</code></li>
<li class="list-inline-item"><code class="notranslate">IFM</code></li>
<li class="list-inline-item"><code class="notranslate">Ikano</code></li>
<li class="list-inline-item"><code class="notranslate">IMDB</code></li>
<li class="list-inline-item"><code class="notranslate">英菲尼迪</code></li>
<li class="list-inline-item"><code class="notranslate">英特尔</code></li>
<li class="list-inline-item"><code class="notranslate">Intuit</code></li>
<li class="list-inline-item"><code class="notranslate">IPIRANGA</code></li>
<li class="list-inline-item"><code class="notranslate">iselect</code></li>
<li class="list-inline-item"><code class="notranslate">itau</code></li>
<li class="list-inline-item"><code class="notranslate">itv</code></li>
<li class="list-inline-item"><code class="notranslate">依维柯</code></li>
<li class="list-inline-item"><code class="notranslate">捷豹</code></li>
<li class="list-inline-item"><code class="notranslate">java</code></li>
<li class="list-inline-item"><code class="notranslate">jcb</code></li>
<li class="list-inline-item"><code class="notranslate">jcp</code></li>
<li class="list-inline-item"><code class="notranslate">吉普</code></li>
<li class="list-inline-item"><code class="notranslate">摩根大通</code></li>
<li class="list-inline-item"><code class="notranslate">瞻博网络</code></li>
<li class="list-inline-item"><code class="notranslate">凯迪拉克国际</code></li>
<li class="list-inline-item"><code class="notranslate">嘉里酒店</code></li>
<li class="list-inline-item"><code class="notranslate">嘉里物流</code></li>
<li class="list-inline-item"><code class="notranslate">嘉里物业</code></li>
<li class="list-inline-item"><code class="notranslate">凯迪拉克金融</code></li>
<li class="list-inline-item"><code class="notranslate">起亚</code></li>
<li class="list-inline-item"><code class="notranslate">kinder</code></li>
<li class="list-inline-item"><code class="notranslate">kindle</code></li>
<li class="list-inline-item"><code class="notranslate">小松</code></li>
<li class="list-inline-item"><code class="notranslate">毕马威</code></li>
<li class="list-inline-item"><code class="notranslate">kred</code></li>
<li class="list-inline-item"><code class="notranslate">国行</code></li>
<li class="list-inline-item"><code class="notranslate">lacaixa</code></li>
<li class="list-inline-item"><code class="notranslate">立博</code></li>
<li class="list-inline-item"><code class="notranslate">兰博基尼</code></li>
<li class="list-inline-item"><code class="notranslate">兰开斯特</code></li>
<li class="list-inline-item"><code class="notranslate">兰旗亚</code></li>
<li class="list-inline-item"><code class="notranslate">兰蔻</code></li>
<li class="list-inline-item"><code class="notranslate">路虎</code></li>
<li class="list-inline-item"><code class="notranslate">朗盛</code></li>
<li class="list-inline-item"><code class="notranslate">拉萨尔</code></li>
<li class="list-inline-item"><code class="notranslate">拉特罗布</code></li>
<li class="list-inline-item"><code class="notranslate">lds</code></li>
<li class="list-inline-item"><code class="notranslate">leclerc</code></li>
<li class="list-inline-item"><code class="notranslate">乐高</code></li>
<li class="list-inline-item"><code class="notranslate">Liaison</code></li>
<li class="list-inline-item"><code class="notranslate">雷克萨斯</code></li>
<li class="list-inline-item"><code class="notranslate">利德尔</code></li>
<li class="list-inline-item"><code class="notranslate">Lifestyle</code></li>
<li class="list-inline-item"><code class="notranslate">礼来</code></li>
<li class="list-inline-item"><code class="notranslate">林肯</code></li>
<li class="list-inline-item"><code class="notranslate">linde</code></li>
<li class="list-inline-item"><code class="notranslate">lipsy</code></li>
<li class="list-inline-item"><code class="notranslate">lixil</code></li>
<li class="list-inline-item"><code class="notranslate">locus</code></li>
<li class="list-inline-item"><code class="notranslate">lotte</code></li>
<li class="list-inline-item"><code class="notranslate">lpl</code></li>
<li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
<li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
<li class="list-inline-item"><code class="notranslate">lupin</code></li>
<li class="list-inline-item"><code class="notranslate">梅西百货</code></li>
<li class="list-inline-item"><code class="notranslate">梅西百货</code></li>
<li class="list-inline-item"><code class="notranslate">梅西百货</code></li>
<li class="list-inline-item"><code class="notranslate">曼氏</code></li>
<li class="list-inline-item"><code class="notranslate">芒果</code></li>
<li class="list-inline-item"><code class="notranslate">万豪</code></li>
<li class="list-inline-item"><code class="notranslate">玛莎拉蒂</code></li>
<li class="list-inline-item"><code class="notranslate">美泰</code></li>
<li class="list-inline-item"><code class="notranslate">麦肯锡</code></li>
<li class="list-inline-item"><code class="notranslate">大都会人寿</code></li>
<li class="list-inline-item"><code class="notranslate">微软</code></li>
<li class="list-inline-item"><code class="notranslate">迷你</code></li>
<li class="list-inline-item"><code class="notranslate">麻省理工学院</code></li>
<li class="list-inline-item"><code class="notranslate">三菱</code></li>
<li class="list-inline-item"><code class="notranslate">美国职棒大联盟</code></li>
<li class="list-inline-item"><code class="notranslate">美国运通</code></li>
<li class="list-inline-item"><code class="notranslate">美国运通</code></li>
<li class="list-inline-item"><code class="notranslate">美国运通</code></li>
<li class="list-inline-item"><code class="notranslate">moto</code></li>
<li class="list-inline-item"><code class="notranslate">movistar</code></li>
<li class="list-inline-item"><code class="notranslate">msd</code></li>
<li class="list-inline-item"><code class="notranslate">mtn</code></li>
<li class="list-inline-item"><code class="notranslate">mtr</code></li>
<li class="list-inline-item"><code class="notranslate">mutual</code></li>
<li class="list-inline-item"><code class="notranslate">nadex</code></li>
<li class="list-inline-item"><code class="notranslate">nationwide</code></li>
<li class="list-inline-item"><code类=“notranslate”>自然</code></ li>
<li class="list-inline-item"><code class="notranslate">NBA</code></li>
<li class="list-inline-item"><code class="notranslate">NEC</code></li>
<li class="list-inline-item"><code class="notranslate">Netflix</code></li>
<li class="list-inline-item"><code class="notranslate">NEUST</code></li>
<li class="list-inline-item"><code class="notranslate">NEUST</code></li>
<li class="list-inline-item"><code class="notranslate">NEWHOLAND</code></li>
<li class="list-inline-item"><code class="notranslate">NFL</code></li>
<li class="list-inline-item"><code class="notranslate">NHK</code></li>
<li class="list-inline-item"><code class="notranslate">NICO</code></li>
<li class="list-inline-item"><code class="notranslate">耐克</code></li>
<li class="list-inline-item"><code class="notranslate">尼康</code></li>
<li class="list-inline-item"><code class="notranslate">日产</code></li>
<li class="list-inline-item"><code class="notranslate">日产</code></li>
<li class="list-inline-item"><code class="notranslate">诺基亚</code></li>
<li class="list-inline-item"><code class="notranslate">西北互助保险公司</code></li>
<li class="list-inline-item"><code class="notranslate">诺顿</code></li>
<li class="list-inline-item"><code class="notranslate">美国铁路局</code></li>
<li class="list-inline-item"><code class="notranslate">NTT</code></li>
<li class="list-inline-item"><code class="notranslate">obi</code></li>
<li class="list-inline-item"><code class="notranslate">office</code></li>
<li class="list-inline-item"><code class="notranslate">omega</code></li>
<li class="list-inline-item"><code class="notranslate">oracle</code></li>
<li class="list-inline-item"><code class="notranslate">orange</code></li>
<li class="list-inline-item"><code class="notranslate">otsuka</code></li>
<!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
<li class="list-inline-item"><code class="notranslate">panasonic</code></li>
<li class="list-inline-item"><code class="notranslate">电讯盈科</code></li>
<li class="list-inline-item"><code class="notranslate">辉瑞</code></li>
<li class="list-inline-item"><code class="notranslate">飞利浦</code></li>
<li class="list-inline-item"><code class="notranslate">伯爵</code></li>
<li class="list-inline-item"><code class="notranslate">百达</code></li>
<li class="list-inline-item"><code class="notranslate">Ping</code></li>
<li class="list-inline-item"><code class="notranslate">先锋</code></li>
<li class="list-inline-item"><code class="notranslate">Play</code></li>
<li class="list-inline-item"><code class="notranslate">PlayStation</code></li>
<li class="list-inline-item"><code class="notranslate">pohl</code></li>
<li class="list-inline-item"><code class="notranslate">politie</code></li>
<li class="list-inline-item"><code class="notranslate">praxi</code></li>
<li class="list-inline-item"><code class="notranslate">prod</code></li>
<li class="list-inline-item"><code class="notranslate">progressive</code></li>
<li class="list-inline-item"><code class="notranslate">pru</code></li>
<li class="list-inline-item"><code class="notranslate">prudential</code></li>
<li class="list-inline-item"><code class="notranslate">pwc</code></li>
<!--<li class="list-inline-item"><code class="notranslate">quest</code></li>-->
<li class="list-inline-item"><code class="notranslate">qvc</code></li>
<li class="list-inline-item"><code class="notranslate">redstone</code></li>
<li class="list-inline-item"><code class="notranslate">reliance</code></li>
<li class="list-inline-item"><code class="notranslate">rexroth</code></li>
<li class="list-inline-item"><code class="notranslate">ricoh</code></li>
<li class="list-inline-item"><code class="notranslate">rmit</code></li>
<li class="list-inline-item"><code class="notranslate">rocher</code></li>
<li class="list-inline-item"><code class="notranslate">rogers</code></li>
<li class="list-inline-item"><code class="notranslate">rwe</code></li>
<li class="list-inline-item"><code class="notranslate">safety</code></li>
<li class="list-inline-item"><code class="notranslate">sakura</code></li>
<li class="list-inline-item"><code class="notranslate">三星</code></li>
<li class="list-inline-item"><code class="notranslate">山特维克</code></li>
<li class="list-inline-item"><code class="notranslate">山特维克可乐满</code></li>
<li class="list-inline-item"><code class="notranslate">赛诺菲</code></li>
<li class="list-inline-item"><code class="notranslate">SAP</code></li>
<li class="list-inline-item"><code class="notranslate">萨克斯</code></li>
<li class="list-inline-item"><code class="notranslate">sbi</code></li>
<!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>-->
<li class="list-inline-item"><code class="notranslate">sca</code></li>
<li class="list-inline-item"><code class="notranslate">scb</code></li>
<li class="list-inline-item"><code class="notranslate">舍弗勒</code></li>
<li class="list-inline-item"><code class="notranslate">施密特</code></li>
<li class="list-inline-item"><code class="notranslate">施瓦茨</code></li>
<li class="list-inline-item"><code约翰逊</code></li>
<li class="list-inline-item"><code class="notranslate">scor</code></li>
<li class="list-inline-item"><code class="notranslate">seat</code></li>
<li class="list-inline-item"><code class="notranslate">sener</code></li>
<li class="list-inline-item"><code class="notranslate">ses</code></li>
<li class="list-inline-item"><code class="notranslate">sew</code></li>
<li class="list-inline-item"><code class="notranslate">seven</code></li>
<li class="list-inline-item"><code class="notranslate">sfr</code></li>
<li class="list-inline-item"><code class="notranslate">seek</code></li>
<li class="list-inline-item"><code class="notranslate">香格里拉</code></li>
<li class="list-inline-item"><code class="notranslate">夏普</code></li>
<li class="list-inline-item"><code class="notranslate">肖</code></li>
<li class="list-inline-item"><code class="notranslate">壳牌</code></li>
<li class="list-inline-item"><code class="notranslate">什里拉姆</code></li>
<li class="list-inline-item"><code class="notranslate">新浪</code></li>
<li class="list-inline-item"><code class="notranslate">天空</code></li>
<li class="list-inline-item"><code class="notranslate">Skype</code></li>
<li class="list-inline-item"><code class="notranslate">智能</code></li>
<li class="list-inline-item"><code class="notranslate">法国国家铁路公司</code></li>
<li class="list-inline-item"><code class="notranslate">软银</code></li>
<li class="list-inline-item"><code class="notranslate">搜狐</code></li>
<li class="list-inline-item"><code class="notranslate">索尼</code></li>
<li class="list-inline-item"><code class="notranslate">明镜</code></li>
<li class="list-inline-item"><code class="notranslate">史泰博</code></li>
<li class="list-inline-item"><code class="notranslate">史泰博</code></li>
<li class="list-inline-item"><code class="notranslate">星汇</code></li>
<li class="list-inline-item"><code class="notranslate">州立银行</code></li>
<li class="list-inline-item"><code class="notranslate">州立农场</code></li>
<li class="list-inline-item"><code class="notranslate">挪威国家石油</code></li>
<li class="list-inline-item"><code class="notranslate">挪威国家石油</code></li>
<li class="list-inline-item"><code class="notranslate">挪威国家石油</code></li>
<li class="list-inline-item"><code class="notranslate">挪威国家石油集团</code></li>
<li class="list-inline-item"><code class="notranslate">铃木</code></li>
<li class="list-inline-item"><code class="notranslate">斯沃琪</code></li>
<li class="list-inline-item"><code class="notranslate">swiftcover</code></li>
<li class="list-inline-item"><code class="notranslate">赛门铁克</code></li>
<li class="list-inline-item"><code class="notranslate">淘宝</code></li>
<li class="list-inline-item"><code class="notranslate">Target</code></li>
<li class="list-inline-item"><code class="notranslate">Tatamotors</code></li>
<li class="list-inline-item"><code class="notranslate">TDK</code></li>
<li class="list-inline-item"><code class="notranslate">Telecity</code></li>
<li class="list-inline-item"><code class="notranslate">Telefonica</code></li>
<li class="list-inline-item"><code class="notranslate">淡马锡</code></li>
<li class="list-inline-item"><code class="notranslate">梯瓦</code></li>
<li class="list-inline-item"><code class="notranslate">蒂芙尼</code></li>
<li class="list-inline-item"><code class="notranslate">TJX</code></li>
<li class="list-inline-item"><code class="notranslate">东丽</code></li>
<li class="list-inline-item"><code class="notranslate">东芝</code></li>
<li class="list-inline-item"><code class="notranslate">道达尔</code></li>
<li class="list-inline-item"><code class="notranslate">丰田</code></li>
<li class="list-inline-item"><code class="notranslate">Travelchannel</code></li>
<li class="list-inline-item"><code class="notranslate">旅行者</code></li>
<li class="list-inline-item"><code class="notranslate">途易</code></li>
<li class="list-inline-item"><code class="notranslate">电视</code></li>
<li class="list-inline-item"><code class="notranslate">瑞银</code></li>
<li class="list-inline-item"><code class="notranslate">联通</code></li>
<li class="list-inline-item"><code class="notranslate">华联</code></li>
<li class="list-inline-item"><code class="notranslate">联通</code></li>
<li class="list-inline-item"><code class="notranslate">华联</code></li>
<li class="list-inline-item"><code class="notranslate">先锋</code></li>
<li class="list-inline-item"><code class="notranslate">威瑞信</code></li>
<li class="list-inline-item"><code class="notranslate">vig</code></li>
<li class="list-inline-item"><code class="notranslate">viking</code></li>
<li class="list-inline-item"><code class="notranslate">virgin</code></li>
<li class="list-inline-item"><code class="notranslate">visa</code></li>
<li class="list-inline-item"><code class="notranslate">vista</code></li>
<li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
<li class="list-inline-item"><code class="notranslate">vivo</code></li>
<li class="list-inline-item"><code class="notranslate">volkswagen</code></li>
<li class="list-inline-item"><code class="notranslate">沃尔沃</code></li>
<li class="list-inline-item"><code class="notranslate">沃尔玛</code></li>
<li class="list-inline-item"><code class="notranslate">沃尔特</code></li>
<li class="list-inline-item"><code class="notranslate">天气频道</code></li>
<li class="list-inline-item"><code class="notranslate">韦伯</code></li>
<li class="list-inline-item"><code class="notranslate">威尔</code></li>
<li class="list-inline-item"><code class="notranslate">威廉希尔</code></li>
<li class="list-inline-item"><code class="notranslate">窗户</code></li>
<li class="list-inline-item"><code class="notranslate">WME</code></li>
<li class="list-inline-item"><code class="notranslate">沃尔特斯克鲁沃</code></li>
<li class="list-inline-item"><code class="notranslate">伍德赛德</code></li>
<li class="list-inline-item"><code class="notranslate">wtc</code></li>
<li class="list-inline-item"><code class="notranslate">Xbox</code></li>
<li class="list-inline-item"><code class="notranslate">施乐</code></li>
<li class="list-inline-item"><code class="notranslate">Xfinity</code></li>
<li class="list-inline-item"><code class="notranslate">雅虎</code></li>
<li class="list-inline-item"><code class="notranslate">山猫</code></li>
<li class="list-inline-item"><code class="notranslate">yandex</code></li>
<li class="list-inline-item"><code class="notranslate">友都八喜</code></li>
<li class="list-inline-item"><code class="notranslate">youtube</code></li>
<li class="list-inline-item"><code class="notranslate">zappos</code></li>
<li class="list-inline-item"><code class="notranslate">zara</code></li>
<li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>

自 2025 年 3 月 18 日起，我们还将以下法国海外领土添加到此列表 ([根据此 GitHub 请求](https://github.com/forwardemail/forwardemail.net/issues/327))：

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">bzh</code></li>
<li class="list-inline-item"><code class="notranslate">gf</code></li>
<li class="list-inline-item"><code class="notranslate">gp</code></li>
<li class="list-inline-item"><code class="notranslate">mq</code></li>
<li class="list-inline-item"><code class="notranslate">nc</code></li>
<li class="list-inline-item"><code class="notranslate">pf</code></li>
<li class="list-inline-item"><code class="notranslate">pm</code></li>
<li class="list-inline-item"><code class="notranslate">re</code></li>
<li class="list-inline-item"><code class="notranslate">tf</code></li>
<li class="list-inline-item"><code class="notranslate">wf</code></li>
<li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

自 2025 年 7 月 8 日起，我们已添加以下欧洲特定国家/地区：

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ax</code></li>
<li class="list-inline-item"><code class="notranslate">bg</code></li>
<li class="list-inline-item"><code class="notranslate">fo</code></li>
<li class="list-inline-item"><code class="notranslate">gi</code></li>
<li class="list-inline-item"><code class="notranslate">gr</code></li>
<li class="list-inline-item"><code class="notranslate">hr</code></li>
<li class="list-inline-item"><code class="notranslate">hu</code></li>
<li class="list-inline-item"><code class="notranslate">lt</code></li>
<li class="list-inline-item"><code class="notranslate">lu</code></li>
<li class="list-inline-item"><code class="notranslate">mc</code></li>
<li class="list-inline-item"><code class="notranslate">mk</code></li>
<li class="list-inline-item"><code class="notranslate">mt</code></li>
<li class="list-inline-item"><code class="notranslate">ro</code></li>
<li class="list-inline-item"><code class="notranslate">sk</code></li>
<li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

由于垃圾邮件活动频繁，我们特意没有包括`cz`、`ru`和`ua`。

### 您的允许名单标准是什么？{#what-is-your-allowlist-criteria}

我们有一个静态的[默认列入允许名单的域名扩展](#what-domain-name-extensions-are-allowlisted-by-default)列表，并且我们还根据以下严格标准维护一个动态的、缓存的、滚动的允许列表：

* 发件人根域名必须属于 [与我们在免费计划中提供的列表相匹配的域名扩展](#what-domain-name-extensions-can-be-used-for-free)（此外还包含 `biz` 和 `info`）。我们还包含 `edu`、`gov` 和 `mil` 部分匹配，例如 `xyz.gov.au` 和 `xyz.edu.au`。
* 发件人根域名必须位于 [雨伞流行榜](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List")（“UPL”）解析结果的前 100,000 个唯一根域名之内。
* 发件人根域名必须位于过去 7 天 UPL 中至少 4 天出现的唯一根域名的前 50,000 个结果之内（\~50%+）。
* 发件人根域名不得被 Cloudflare 标记为包含成人内容或恶意软件 [已分类](https://radar.cloudflare.com/categorization-feedback/)。
* 发件人根域名必须设置 A 记录或 MX 记录。
* 发件人根域名必须具有 A 记录、MX 记录、带有 `p=reject` 或 `p=quarantine` 的 DMARC 记录，或带有 `-all` 或 `~all` 限定符的 SPF 记录。

如果满足此条件，则发件人根域将被缓存 7 天。请注意，我们的自动化作业每天都会运行，因此这是一个滚动的白名单缓存，每天更新。

我们的自动化作业将下载 UPL 内存中前 7 天的数据，解压缩它们，然后根据上述严格标准在内存中进行解析。

当然，其中包括撰写本文时的热门域名，例如 Google、Yahoo、Microsoft、Amazon、Meta、Twitter、Netflix、Spotify 等。

如果您的发件人不在我们的允许列表中，那么您的 FQDN 根域或 IP 地址首次发送电子邮件时，您的链接将被设置为 [速率受限](#do-you-have-rate-limiting) 和 [灰名单](#do-you-have-a-greylist)。请注意，这是电子邮件标准中采用的标准做法。大多数电子邮件服务器客户端在收到速率限制或灰名单错误（例如 421 或 4xx 级错误状态代码）时都会尝试重试。

**请注意，特定发件人（例如`a@gmail.com`、`b@xyz.edu` 和 `c@gov.au`）仍可能是[列入黑名单](#do-you-have-a-denylist)**（例如，如果我们自动检测来自这些发件人的垃圾邮件、网络钓鱼或恶意软件）。

### 哪些域名扩展可以免费使用 {#what-domain-name-extensions-can-be-used-for-free}

自 2023 年 3 月 31 日起，我们实施了一项新的综合垃圾邮件规则，以保护我们的用户和服务。

此新规则仅允许在我们的免费计划中使用以下域名扩展：

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ac</code></li>
<li class="list-inline-item"><code class="notranslate">ad</code></li>
<li class="list-inline-item"><code class="notranslate">ag</code></li>
<li class="list-inline-item"><code class="notranslate">ai</code></li>
<li class="list-inline-item"><code class="notranslate">al</code></li>
<li class="list-inline-item"><code class="notranslate">am</code></li>
<li class="list-inline-item"><code class="notranslate">app</code></li>
<li class="list-inline-item"><code class="notranslate">as</code></li>
<li class="list-inline-item"><code class="notranslate">在</code></li>
<li class="list-inline-item"><code class="notranslate">au</code></li>
<li class="list-inline-item"><code class="notranslate">ba</code></li>
<li class="list-inline-item"><code class="notranslate">be</code></li>
<li class="list-inline-item"><code class="notranslate">br</code></li>
<li class="list-inline-item"><code class="notranslate">by</code></li>
<li class="list-inline-item"><code class="notranslate">ca</code></li>
<li class="list-inline-item"><code class="notranslate">cc</code></li>
<li class="list-inline-item"><code class="notranslate">cd</code></li>
<li class="list-inline-item"><code class="notranslate">ch</code></li>
<li class="list-inline-item"><code class="notranslate">ck</code></li>
<li class="list-inline-item"><code class="notranslate">co</code></li>
<li class="list-inline-item"><code class="notranslate">com</code></li>
<li class="list-inline-item"><code class="notranslate">de</code></li>
<li class="list-inline-item"><code class="notranslate">dev</code></li>
<li class="list-inline-item"><code class="notranslate">dj</code></li>
<li class="list-inline-item"><code class="notranslate">dk</code></li>
<li class="list-inline-item"><code class="notranslate">ee</code></li>
<li class="list-inline-item"><code class="notranslate">es</code></li>
<li class="list-inline-item"><code class="notranslate">eu</code></li>
<li class="list-inline-item"><code class="notranslate">family</code></li>
<li class="list-inline-item"><code class="notranslate">fi</code></li>
<li class="list-inline-item"><code class="notranslate">fm</code></li>
<li class="list-inline-item"><code class="notranslate">fr</code></li>
<li class="list-inline-item"><code class="notranslate">gg</code></li>
<li class="list-inline-item"><code class="notranslate">gl</code></li>
<li class="list-inline-item"><code class="notranslate">id</code></li>
<li class="list-inline-item"><code class="notranslate">ie</code></li>
<li class="list-inline-item"><code class="notranslate">il</code></li>
<li class="list-inline-item"><code class="notranslate">im</code></li>
<li class="list-inline-item"><code class="notranslate">in</code></li>
<li class="list-inline-item"><code class="notranslate">io</code></li>
<li class="list-inline-item"><code class="notranslate">ir</code></li>
<li class="list-inline-item"><code class="notranslate">is</code></li>
<li class="list-inline-item"><code class="notranslate">it</code></li>
<li class="list-inline-item"><code class="notranslate">je</code></li>
<li class="list-inline-item"><code class="notranslate">jp</code></li>
<li class="list-inline-item"><code class="notranslate">ke</code></li>
<li class="list-inline-item"><code class="notranslate">kr</code></li>
<li class="list-inline-item"><code class="notranslate">la</code></li>
<li class="list-inline-item"><code class="notranslate">li</code></li>
<li class="list-inline-item"><code class="notranslate">lv</code></li>
<li class="list-inline-item"><code class="notranslate">ly</code></li>
<li class="list-inline-item"><code class="notranslate">md</code></li>
<li class="list-inline-item"><code class="notranslate">me</code></li>
<li class="list-inline-item"><code class="notranslate">mn</code></li>
<li class="list-inline-item"><code class="notranslate">ms</code></li>
<li class="list-inline-item"><code class="notranslate">mu</code></li>
<li class="list-inline-item"><code class="notranslate">mx</code></li>
<li class="list-inline-item"><code class="notranslate">net</code></li>
<li class="list-inline-item"><code class="notranslate">ni</code></li>
<li class="list-inline-item"><code class="notranslate">nl</code></li>
<li class="list-inline-item"><code class="notranslate">no</code></li>
<li class="list-inline-item"><code class="notranslate">nu</code></li>
<li class="list-inline-item"><code class="notranslate">nz</code></li>
<li class="list-inline-item"><code class="notranslate">org</code></li>
<li class="list-inline-item"><code class="notranslate">pl</code></li>
<li class="list-inline-item"><code class="notranslate">pr</code></li>
<li class="list-inline-item"><code class="notranslate">pt</code></li>
<li class="list-inline-item"><code class="notranslate">pw</code></li>
<li class="list-inline-item"><code class="notranslate">rs</code></li>
<li class="list-inline-item"><code class="notranslate">sc</code></li>
<li class="list-inline-item"><code class="notranslate">se</code></li>
<li class="list-inline-item"><code class="notranslate">sh</code></li>
<li class="list-inline-item"><code class="notranslate">si</code></li>
<li class="list-inline-item"><code class="notranslate">sm</code></li>
<li class="list-inline-item"><code class="notranslate">sr</code></li>
<li class="list-inline-item"><code class="notranslate">st</code></li>
<li class="list-inline-item"><code class="notranslate">tc</code></li>
<li class="list-inline-item"><code class="notranslate">tm</code></li>
<li class="list-inline-item"><code class="notranslate">to</code></li>
<li class="list-inline-item"><code class="notranslate">tv</code></li>
<li class="list-inline-item"><code class="notranslate">英国</code></li>
<li class="list-inline-item"><code class="notranslate">美国</code></li>
<li class="list-inline-item"><code class="notranslate">乌兹别克斯坦</code></li>
<li class="list-inline-item"><code class="notranslate">越南</code></li>
<li class="list-inline-item"><code class="notranslate">越南</code></li>
<li class="list-inline-item"><code class="notranslate">越南</code></li>
<li class="list-inline-item"><code class="notranslate">越南</code></li>
<li class="list-inline-item"><code class="notranslate">越南</code></li>
<li class="list-inline-item"><code class="notranslate">越南</code></li>
<li class="list-inline-item"><code class="notranslate">越南</code></li>类=“notranslate”>za</code></li>
</ul>

### 您有灰名单吗？{#do-you-have-a-greylist}

是的，我们采用了非常宽松的[电子邮件灰名单](https://en.wikipedia.org/wiki/Greylisting_\(email\))政策。灰名单仅适用于不在我们的允许名单上的发件人，并且会在我们的缓存中保留30天。

对于任何新发件人，我们会将一个密钥存储在 Redis 数据库中 30 天，其值设置为其首次请求的初始到达时间。之后，我们会使用 450 的重试状态码拒绝其邮件，并且仅在 5 分钟后才允许其通过。

如果他们从这个初始到达时间成功等待了 5 分钟，那么他们的电子邮件将被接受，并且他们将不会收到这个 450 状态代码。

密钥由 FQDN 根域或发件人的 IP 地址组成。这意味着任何通过灰名单的子域也会通过根域的审核，反之亦然（这就是我们所说的“非常宽松”的策略）。

例如，如果一封来自 `test.example.com` 的电子邮件在我们收到一封来自 `example.com` 的电子邮件之前就已发出，那么任何来自 `test.example.com` 和/或 `example.com` 的电子邮件都必须从连接初始到达时间起等待 5 分钟。我们不会要求 `test.example.com` 和 `example.com` 分别等待各自的 5 分钟（我们的灰名单政策适用于根域级别）。

请注意，灰名单不适用于我们[允许列表](#do-you-have-an-allowlist)上的任何发件人（例如，撰写本文时的 Meta、Amazon、Netflix、Google、Microsoft）。

### 您是否有拒绝列表 {#do-you-have-a-denylist}

是的，我们运营自己的拒绝名单，并根据检测到的垃圾邮件和恶意活动实时自动更新和手动更新。

我们还每小时从 UCEPROTECT 1 级拒绝列表 <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> 中提取所有 IP 地址，并将其输入到我们的拒绝列表中，有效期为 7 天。

如果发件人在拒绝名单中找到[未列入允许名单](#do-you-have-an-allowlist)，他们将收到 421 错误代码（指示发件人稍后重试）。

通过使用 421 状态代码而不是 554 状态代码，可以实时缓解潜在的误报，然后可以在下一次尝试时成功传递消息。

**此设计与其他邮件服务不同**，在其他邮件服务中，如果您被列入黑名单，将发生永久性的硬故障。要求发件人重试邮件通常很困难（尤其是来自大型组织的邮件），因此，此方法在首次尝试发送电子邮件后大约有 5 天的时间，供发件人、收件人或我们介入并缓解问题（通过请求删除黑名单）。

所有拒绝名单删除请求都由管理员实时监控（例如，以便管理员可以将反复出现的误报永久列入允许名单）。

可以在 <https://forwardemail.net/denylist>. 请求拒绝名单删除请求。付费用户的拒绝名单删除请求会立即得到处理，而非付费用户则必须等待管理员处理他们的请求。

检测到发送垃圾邮件或病毒内容的发件人将按照以下方式添加到拒绝名单中：

1. 检测到垃圾邮件或来自“受信任”发件人的黑名单后，[初始消息指纹](#how-do-you-determine-an-email-fingerprint) 会被列入灰名单（例如 `gmail.com`、`microsoft.com`、`apple.com`）。
* 如果发件人已列入白名单，则该邮件将被列入灰名单 1 小时。
* 如果发件人未列入白名单，则该邮件将被列入灰名单 6 小时。
2. 我们会根据发件人和邮件信息解析黑名单密钥，并为每个密钥创建一个计数器（如果不存在），将其加 1，然后缓存 24 小时。
* 对于已列入白名单的发件人：
* 如果“MAIL FROM”邮件地址的 SPF 已通过或未通过 SPF 验证，并且不是 [邮政局长用户名](#what-are-postmaster-addresses) 或 [无回复用户名](#what-are-no-reply-addresses)，则为其添加密钥。
* 如果“From”邮件头已列入白名单，则为其 SPF 已通过或 DKIM 已通过并对齐，则为其添加密钥。
* 如果“From”邮件头未列入白名单，则为其 SPF 已通过或 DKIM 已通过并对齐，则为其添加密钥。
* 对于未列入白名单的发件人：
* 如果“MAIL FROM”邮件地址的 SPF 已通过或未通过，则为其添加密钥。
* 如果“From”邮件头已列入白名单，则为其 SPF 已通过或 DKIM 已通过并对齐，则为其添加密钥。
* 如果“发件人”标头未列入白名单，则为“发件人”标头电子邮件地址及其解析的根域名添加一个密钥。
* 为发件人的远程 IP 地址添加一个密钥。
* 通过从发件人的 IP 地址进行反向查找，为客户端解析的主机名添加一个密钥（如果有）。
* 为客户端解析的主机名的根域添加一个密钥（如果有，并且该根域与客户端解析的主机名不同）。
3. 如果未列入白名单的发件人和密钥的计数器达到 5，我们会将该密钥列入黑名单 30 天，并向我们的滥用团队发送电子邮件。这些数字可能会发生变化，我们会在监控滥用情况时在此处更新。
4. 如果已列入白名单的发件人和密钥的计数器达到 10，我们会将该密钥列入黑名单 7 天，并向我们的滥用团队发送电子邮件。这些数字可能会发生变化，我们会在监控滥用情况时在此处更新。

> **注意：** 不久的将来，我们将引入信誉监控功能。信誉监控将根据百分比阈值（而不是像上面提到的那样使用简单的计数器）来计算何时将发件人列入黑名单。

### 您是否设置了速率限制 {#do-you-have-rate-limiting}

发件人速率限制可以通过对发件人 IP 地址进行反向 PTR 查询解析根域来实现；如果解析结果为空，则直接使用发件人的 IP 地址。请注意，下文中我们将其称为 `Sender`。

我们的 MX 服务器对 [加密的 IMAP 存储](/blog/docs/best-quantum-safe-encrypted-email-service) 接收的每日入站邮件数量有限制：

* 我们不再根据单个别名（例如 `you@yourdomain.com`）限制接收邮件的速率，而是根据别名的域名本身（例如 `yourdomain.com`）进行速率限制。这可以防止 `Senders` 邮件同时淹没您域中所有别名的收件箱。
* 我们对服务中的所有 `Senders` 邮件设置了通用限制，无论收件人是谁：
* 我们认为“可信”的可靠来源 `Senders`（例如 `gmail.com`、`microsoft.com`、`apple.com`）的邮件每日发送量限制为 100 GB。
* `Senders` 的 [列入白名单](#do-you-have-an-allowlist) 限制每天发送 10 GB 数据。
* 所有其他 `Senders` 限制每天发送 1 GB 数据和/或 1000 条消息。
* 我们对 `Sender` 和 `yourdomain.com` 的每日数据量和/或 1 GB 消息有特定的限制。

MX 服务器还通过速率限制来限制转发给一个或多个收件人的消息 - 但这仅适用于 `Senders`，而不适用于 [允许列表](#do-you-have-an-allowlist)：

* 我们每小时仅允许最多 100 个连接，每个 `Sender` 已解析的 FQDN 根域（或）`Sender` 远程 IP 地址（若无可用的反向 PTR），以及每个信封收件人。我们将速率限制密钥以加密哈希值的形式存储在 Redis 数据库中。

* 如果您通过我们的系统发送电子邮件，请确保为所有 IP 地址设置了反向 PTR（否则，您发送的每个唯一 FQDN 根域或 IP 地址都将受到速率限制）。

* 请注意，如果您通过流行的系统（例如 Amazon SES）发送，那么您将不会受到速率限制，因为（在撰写本文时）Amazon SES 已列在我们的允许列表中。

* 如果您从 `test.abc.123.example.com` 等域名发送邮件，则 `example.com` 也会受到速率限制。许多垃圾邮件发送者会使用数百个子域名来绕过常见的垃圾邮件过滤器，这些过滤器仅对唯一主机名进行速率限制，而不会对唯一 FQDN 根域名进行速率限制。

* 超出速率限制的 `Senders` 将被拒绝并出现 421 错误。

我们的 IMAP 和 SMTP 服务器限制您的别名同时拥有超过 `60` 个并发连接。

我们的 MX 服务器限制 [未列入白名单](#do-you-have-an-allowlist) 发送者建立超过 10 个并发连接（计数器的缓存有效期为 3 分钟，这反映了我们的 3 分钟套接字超时）。

### 如何防范反向散射 {#how-do-you-protect-against-backscatter}

错误定向的退回或退回垃圾邮件（称为“[背向散射](https://en.wikipedia.org/wiki/Backscatter_\(email\)”）可能会对发件人 IP 地址造成负面声誉。

我们采取两个步骤来防止反向散射，详见下面的[防止来自已知垃圾邮件发送者的邮件被退回](#prevent-bounces-from-known-mail-from-spammers)和[防止不必要的反弹以防止背向散射](#prevent-unnecessary-bounces-to-protect-against-backscatter)部分。

### 防止来自已知垃圾邮件发送者的邮件退回 {#prevent-bounces-from-known-mail-from-spammers}

我们每小时从 <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> 处的 [Backscatter.org](https://www.backscatterer.org/)（由 [UCEPROTECT](https://www.uceprotect.net/) 提供支持）提取列表并将其输入到我们的 Redis 数据库中（我们还会提前比较差异；以防删除了任何需要遵守的 IP）。

如果 MAIL FROM 为空或等于（不区分大小写）任何 [邮政局长地址](#what-are-postmaster-addresses)（电子邮件中 @ 之前的部分），那么我们会检查发件人 IP 是否与此列表中的一个匹配。

如果发件人的 IP 已列入我们的 [允许列表](#do-you-have-an-allowlist) 列表中（但不在我们的 `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}` 列表中），我们会发送 554 错误，并显示 `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}` 消息。如果发件人同时位于反向散射器列表和我们的允许列表中，我们会收到警报，以便在必要时解决问题。

本节中描述的技术遵循<https://www.backscatterer.org/?target=usage>处的“安全模式”建议 - 仅当已满足某些条件时我们才会检查发件人 IP。

### 防止不必要的反弹以防止反向散射 {#prevent-unnecessary-bounces-to-protect-against-backscatter}

退回的电子邮件表明电子邮件转发给收件人完全失败，并且不会重试该电子邮件。

被列入反向散射器列表的一个常见原因是错误导向的退回邮件或退回垃圾邮件，因此我们必须通过以下几种方式防止这种情况：

1. 我们仅在发生 >= 500 状态代码错误时发送（当尝试转发的电子邮件失败时，例如 Gmail 以 500 级错误响应）。

2. 我们只发送一次（我们使用计算出的弹回指纹密钥并将其存储在缓存中，以防止重复发送）。弹回指纹密钥是消息指纹与弹回地址及其错误代码的哈希值的组合。有关消息指纹计算方法的更多信息，请参阅 [指纹识别](#how-do-you-determine-an-email-fingerprint) 部分。成功发送的弹回指纹将在 Redis 缓存中保留 7 天。

3. 仅当 MAIL FROM 和/或 From 不为空且不包含（不区分大小写）[邮政局长用户名](#what-are-postmaster-addresses)（电子邮件中 @ 之前的部分）时，我们才会发送。

4. 如果原始邮件具有以下任何标头（不区分大小写），则我们不会发送：

* `auto-submitted` 的标头，其值不等于 `no`。
* `x-auto-response-suppress` 的标头，其值为 `dr`、`autoreply`、`auto-reply`、`auto_reply` 或 `all`
* `list-id`、`list-subscribe`、`list-unsubscribe`、`list-help`、`list-post`、`list-owner`、`list-archive`、`x-autoreply` 的标头`x-autorespond` 或 `x-auto-respond`（无论值如何）。
* `precedence` 的标头，其值为 `bulk`、`autoreply`、`auto-reply`、`auto_reply` 或 `list`。

5. 如果 MAIL FROM 或 From 电子邮件地址以 `+donotreply`、`-donotreply`、`+noreply` 或 `-noreply` 结尾，我们不会发送。

6. 如果发件人电子邮件地址用户名部分为 `mdaemon` 并且具有不区分大小写的标题 `X-MDDSN-Message`，则我们不会发送。

7. 如果存在不区分大小写的 `content-type` 或 `multipart/report` 标头，我们就不会发送。

### 如何确定电子邮件指纹 {#how-do-you-determine-an-email-fingerprint}

电子邮件的指纹用于确定电子邮件的唯一性，并防止传递重复的消息和发送[重复退回](#prevent-unnecessary-bounces-to-protect-against-backscatter)。

指纹是根据以下列表计算得出的：

* 客户端解析的 FQDN 主机名或 IP 地址
* `Message-ID` 标头值（如有）
* `Date` 标头值（如有）
* `From` 标头值（如有）
* `To` 标头值（如有）
* `Cc` 标头值（如有）
* `Subject` 标头值（如有）
* `Body` 值（如有）

### 我可以将电子邮件转发到 25 以外的端口吗（例如，如果我的 ISP 已阻止端口 25）{#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

是的，我们已于 2020 年 5 月 5 日添加了此功能。目前，此功能是针对特定域名的，而非针对特定别名的。如果您需要将其针对特定别名，请联系我们并告知您的需求。

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
增强隐私保护：
</strong>
<span>
如果您使用的是付费方案（包含增强隐私保护），请前往<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户<i class="fa fa-angle-right"></i>域名</a>，点击您域名旁边的“设置”，然后点击“设置”。如果您想了解更多关于付费方案的信息，请参阅我们的<a class="alert-link" rel="noopener noreferrer" href="/private-business-email">定价</a>页面。否则，您可以继续按照以下说明操作。
</span>
</div>

如果您使用的是免费计划，则只需添加一个新的 DNS <strong class="notranslate">TXT</strong> 记录，如下所示，但将端口从 25 更改为您选择的端口。

例如，如果我希望所有发送到 `example.com` 的电子邮件转发到别名收件人的 SMTP 端口 1337 而不是 25：

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email-port=1337</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
自定义端口转发设置最常见的场景是，您需要将所有发送到 example.com 的电子邮件转发到 example.com 的其他端口，而不是 SMTP 标准端口 25。要进行此设置，只需添加以下 <strong class="notranslate">TXT</strong> catch-all 记录即可。
<span>
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=example.com</code></td>
</tr>
</tbody>
</table>

### 它是否支持 Gmail 别名的加号 + 符号 {#does-it-support-the-plus--symbol-for-gmail-aliases}

是的，绝对是。

### 它是否支持子域名 {#does-it-support-sub-domains}

是的，完全正确。您无需使用“@”、“.”或空白作为名称/主机/别名，只需使用子域名作为值即可。

如果您希望使用 `foo.example.com` 转发电子邮件，请在 DNS 设置中输入 `foo` 作为名称/主机/别名值（对于 MX 和 <strong class="notranslate">TXT</strong> 记录）。

### 这会转发我的电子邮件标题吗？{#does-this-forward-my-emails-headers}

是的，绝对是。

### 这是经过充分测试的{#is-this-well-tested}

是的，它有用[艾娃](https://github.com/avajs/ava)编写的测试，并且还有代码覆盖率。

### 您是否传递 SMTP 响应消息和代码 {#do-you-pass-along-smtp-response-messages-and-codes}

是的，绝对可以。例如，如果您要将电子邮件发送至 `hello@example.com`，而该邮件已注册转发至 `user@gmail.com`，则系统将返回来自“gmail.com”SMTP 服务器的 SMTP 响应消息和代码，而不是来自“mx1.forwardemail.net”或“mx2.forwardemail.net”的代理服务器。

### 如何防止垃圾邮件发送者并确保良好的电子邮件转发声誉{#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

请参阅上面有关 [您的电子邮件转发系统如何工作](#how-does-your-email-forwarding-system-work)、[如何处理电子邮件传递问题](#how-do-you-handle-email-delivery-issues) 和 [如何处理被阻止的 IP 地址](#how-do-you-handle-your-ip-addresses-becoming-blocked) 的部分。

### 如何对域名执行 DNS 查找 {#how-do-you-perform-dns-lookups-on-domain-names}

我们创建了一个开源软件项目 :tangerine: [柑橘](https://github.com/forwardemail/tangerine)，并将其用于 DNS 查询。默认使用的 DNS 服务器是 `1.1.1.1` 和 `1.0.0.1`，DNS 查询通过应用层的 [通过 HTTPS 进行 DNS](https://en.wikipedia.org/wiki/DNS_over_HTTPS)（“DoH”）进行。

:tangerine: [柑橘](https://github.com/tangerine) 默认使用 [CloudFlare 的隐私优先消费者 DNS 服务][cloudflare-dns]。

## 帐户和账单 {#account-and-billing}

### 你们是否为付费计划提供退款保证？{#do-you-offer-a-money-back-guarantee-on-paid-plans}

是的！如果您在套餐生效后 30 天内升级、降级或取消账户，即可自动退款。此优惠仅适用于首次购买套餐的客户。

### 如果我更换计划，你们会按比例退还差额吗？{#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

当您更换套餐时，我们不会按比例退还差价。相反，我们会将您现有套餐到期日的剩余时长转换为新套餐最接近的时长（按月向下取整）。

请注意，如果您自首次开始付费计划以来的 30 天内在付费计划之间升级或降级，那么我们将自动从您的现有计划中退还全额金额。

### 我可以将此电子邮件转发服务用作“后备”或“故障转移” MX 服务器吗？{#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

不，不建议这样做，因为您一次只能使用一台邮件交换服务器。由于优先级配置错误以及邮件服务器不遵守 MX 交换优先级检查，回退通常不会重试。

### 我可以禁用特定别名吗？{#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
如果您使用的是付费套餐，则必须前往<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户<i class="fa fa-angle-right"></i>域名</a> <i class="fa fa-angle-right"></i>别名<i class="fa fa-angle-right"></i>编辑别名<i class="fa fa-angle-right"></i>取消选中“活动”复选框<i class="fa fa-angle-right"></i>继续。
</span>
</div>

是的，只需编辑您的 DNS <strong class="notranslate">TXT</strong> 记录并在别名前加上一个、两个或三个感叹号（见下文）。

请注意，您*应该*保留“：”映射，因为如果您决定关闭此功能，则需要保留该映射（如果您升级到我们的付费计划之一，它也会用于导入）。

**对于静默拒绝（在发件人看来，邮件好像已成功发送，但实际上无处可去）（状态代码`250`）：**如果在别名前加上“！”（单个感叹号），那么它将向尝试发送到此地址的发件人返回成功状态代码`250`，但电子邮件本身无处可去（例如黑洞或`/dev/null`）。

**对于软拒绝（状态代码 `421`）：**如果在别名前加上“!!”（双感叹号），那么它将向尝试发送到此地址的发件人返回软错误状态代码 `421`，并且电子邮件通常会在被拒绝和退回之前重试最多 5 天。

**对于硬拒绝（状态代码`550`）：**如果在别名前加上“!!!”（三个感叹号），那么它将向尝试发送到此地址的发件人返回永久错误状态代码`550`，并且电子邮件将被拒绝和退回。

例如，如果我希望所有发送到 `alias@example.com` 的电子邮件不再流向 `user@gmail.com` 并被拒绝和退回（例如，使用三个感叹号）：

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
<span>
您也可以将转发收件人的地址重写为“nobody@forwardemail.net”，这样邮件就不会被转发给任何人，如下例所示。
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
<span>
如果您想要提高安全性，也可以删除“:user@gmail.com”（或“:nobody@forwardemail.net”）部分，只保留“!!!alias”，如下例所示。
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias</code></td>
</tr>
</tbody>
</table>

### 我可以将电子邮件转发给多个收件人吗？{#can-i-forward-emails-to-multiple-recipients}

是的，完全可以。只需在您的 <strong class="notranslate">TXT</strong> 记录中指定多个收件人即可。

例如，如果我希望将发送到 `hello@example.com` 的电子邮件转发到 `user+a@gmail.com` 和 `user+b@gmail.com`，那么我的 <strong class="notranslate">TXT</strong> 记录将如下所示：

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

或者，您可以在两行单独的行中指定它们，例如：

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

由你决定！

### 我可以有多个全局接收者吗？{#can-i-have-multiple-global-catch-all-recipients}

是的，可以。只需在 <strong class="notranslate">TXT</strong> 记录中指定多个全局接收方即可。

例如，如果我希望每封发送到 `*@example.com`（星号表示通配符，又称万能）的电子邮件都转发到 `user+a@gmail.com` 和 `user+b@gmail.com`，那么我的 <strong class="notranslate">TXT</strong> 记录将如下所示：

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

或者，您可以在两行单独的行中指定它们，例如：

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名称/主机/别名</th>
<th class="text-center">TTL</th>
<th>类型</th>
<th>答案/值</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>“@”、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>@、“.”或空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

由你决定！

### 每个别名可以转发的电子邮件地址数量是否有最大限制？{#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

是的，默认限制为 10。这并不意味着您的域名只能拥有 10 个别名。您可以拥有任意数量的别名（数量不限）。这意味着您只能将一个别名转发到 10 个唯一的电子邮件地址。您可以拥有 `hello:user+1@gmail.com`、`hello:user+2@gmail.com`、`hello:user+3@gmail.com` 等（1-10 个）——任何发送到 `hello@example.com` 的邮件都会被转发到 `user+1@gmail.com`、`user+2@gmail.com`、`user+3@gmail.com` 等（1-10 个）。

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
提示：
</strong>
<span>
每个别名需要超过 10 个收件人？请发送电子邮件给我们，我们很乐意为您提升账户限额。
</span>
</div>

### 我可以递归转发电子邮件吗？{#can-i-recursively-forward-emails}

是的，您可以，但仍然必须遵守最大限制。如果您拥有 `hello:linus@example.com` 和 `linus:user@gmail.com`，那么发送至 `hello@example.com` 的电子邮件将被转发至 `linus@example.com` 和 `user@gmail.com`。请注意，如果您尝试递归转发超出最大限制的电子邮件，将会引发错误。

### 未经我的许可，其他人可以注销或注册我的电子邮件转发吗？{#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

我们使用 MX 和 <strong class="notranslate">TXT</strong> 记录验证，因此如果您添加此服务相应的 MX 和 <strong class="notranslate">TXT</strong> 记录，则表示您已注册。如果您删除它们，则表示您已注销。您拥有域名的所有权和 DNS 管理权，因此如果有人访问这些内容，那就有问题了。

### 它怎么免费？{#how-is-it-free}

Forward Email 通过开源开发、高效基础设施和支持该服务的可选付费计划的组合提供免费套餐。

我们的免费套餐由以下支持：

1. **开源开发**：我们的代码库是开源的，允许社区贡献和透明操作。

2.**高效的基础设施**：我们优化了我们的系统，以最少的资源处理电子邮件转发。

3. **付费高级计划**：需要附加功能（如 SMTP 发送、IMAP 接收或增强隐私选项）的用户可订阅我们的付费计划。

4.**合理的使用限制**：免费套餐有公平的使用政策，以防止滥用。

> \[!NOTE]
> We're committed to keeping basic email forwarding free while offering premium features for users with more advanced needs.

> \[!TIP]
> If you find our service valuable, consider upgrading to a paid plan to support ongoing development and maintenance.

### 电子邮件大小上限是多少 {#what-is-the-max-email-size-limit}

我们默认邮件大小限制为 50MB，包含正文、邮件头和附件。请注意，Gmail 和 Outlook 等服务仅允许 25MB 的邮件大小限制，如果您向这些服务商的邮箱发送邮件时超出限制，将会收到错误消息。

如果超出文件大小限制，则会返回带有正确响应代码的错误。

### 您是否存储电子邮件日志 {#do-you-store-logs-of-emails}

不，我们不会写入磁盘或存储日志 - 使用[错误异常](#do-you-store-error-logs)和[出站 SMTP](#do-you-support-sending-email-with-smtp)（请参阅我们的[隐私政策](/privacy)）。

所有操作均在内存中完成，并且[我们的源代码在 GitHub 上](https://github.com/forwardemail)。

### 您是否存储错误日志 {#do-you-store-error-logs}

**是的。您可以访问 [我的账户 → 日志](/my-account/logs) 或 [我的账户 → 域名](/my-account/domains) 下的错误日志。**

自 2023 年 2 月起，我们将存储 `4xx` 和 `5xx` SMTP 响应代码的错误日志，为期 7 天，其中包含 SMTP 错误、信封和电子邮件标头（我们**不**存储电子邮件正文或附件）。

错误日志可让您检查是否有重要邮件遗漏，并减少 [你的域名](/my-account/domains) 的垃圾邮件误报。它们也是调试 [电子邮件 webhook](#do-you-support-webhooks) 问题的绝佳资源（因为错误日志包含 Webhook 端点响应）。

由于连接提前结束（例如，在传输 `RCPT TO` 和 `MAIL FROM` 命令之前），因此无法访问 [速率限制](#do-you-have-rate-limiting) 和 [灰名单](#do-you-have-a-greylist) 的错误日志。

请参阅我们的[隐私政策](/privacy)以获得更多见解。

### 你会阅读我的电子邮件吗？{#do-you-read-my-emails}

不，绝对不行。请参阅我们的[隐私政策](/privacy)。

许多其他电子邮件转发服务会存储您的电子邮件，甚至可能读取您的电子邮件。转发的电子邮件无需存储到磁盘存储中——因此，我们构建了首个在内存中完成所有操作的开源解决方案。

我们相信您享有隐私权，并严格尊重您的隐私。为了确保透明度和建立信任，部署到服务器的代码已设置为 [GitHub 上的开源软件](https://github.com/forwardemail)。

### 我可以使用此 {#can-i-send-mail-as-in-gmail-with-this} 在 Gmail 中“以...身份发送邮件”吗？

是的！我们已于 2018 年 10 月 2 日添加了此功能。请参阅上面的 [如何使用 Gmail 发送邮件](#how-to-send-mail-as-using-gmail)！

您还应该在 DNS 配置 <strong class="notranslate">TXT</strong> 记录中设置 Gmail 的 SPF 记录。

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
如果您使用的是 Gmail（例如“以…发送邮件”）或 G Suite，则需要将 <code>include:_spf.google.com</code> 附加到您的 SPF <strong class="notranslate">TXT</strong> 记录中，例如：
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### 我可以使用此 {#can-i-send-mail-as-in-outlook-with-this} 在 Outlook 中“以...身份发送邮件”吗？

是的！我们已于 2018 年 10 月 2 日添加了此功能。只需查看以下来自 Microsoft 的这两个链接：

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

您还应该在 DNS 配置 <strong class="notranslate">TXT</strong> 记录中为 Outlook 设置 SPF 记录。

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要提示：
</strong>
<span>
如果您使用的是 Microsoft Outlook 或 Live.com，则需要将 <code>include:spf.protection.outlook.com</code> 附加到您的 SPF <strong class="notranslate">TXT</strong> 记录中，例如：
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

### 我可以使用此 {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this} 在 Apple Mail 和 iCloud Mail 中“以...身份发送邮件”吗？

如果您是 iCloud+ 订阅者，则可以使用自定义域名。[我们的服务也兼容 Apple Mail](#apple-mail)。

请参阅<https://support.apple.com/en-us/102540>了解更多信息。

### 我可以使用此 {#can-i-forward-unlimited-emails-with-this} 转发无限量的电子邮件吗？

是的，但是“相对未知”的发件人每个主机名或 IP 的连接速率限制为每小时 100 个。请参阅上文关于 [速率限制](#do-you-have-rate-limiting) 和 [灰名单](#do-you-have-a-greylist) 的部分。

“相对未知”是指未出现在[允许列表](#do-you-have-an-allowlist)中的发件人。

如果超过此限制，我们将发送 421 响应代码，告知发件人的邮件服务器稍后重试。

### 你们是否以一个价格提供无限域名？{#do-you-offer-unlimited-domains-for-one-price}

是的。无论您选择哪种方案，只需支付一个月费，即可涵盖您的所有域名。

### 您接受哪些付款方式 {#which-payment-methods-do-you-accept}

Forward Email 接受以下一次性或每月/每季度/每年的付款方式：

1. **信用卡/借记卡/银行转账**：Visa、Mastercard、American Express、Discover、JCB、Diners Club 等。
2. **PayPal**：连接您的 PayPal 账户，轻松付款。
3. **加密货币**：我们接受 Stripe 在以太坊、Polygon 和 Solana 网络上的稳定币付款。

> \[!NOTE]
> We store limited payment information on our servers, which only includes payment identifiers and references to [Stripe](https://stripe.com/global) and [PayPal](https://www.paypal.com) transaction, customer, subscription, and payment ID's.

> \[!TIP]
> For maximum privacy, consider using cryptocurrency payments.

所有付款均通过 Stripe 或 PayPal 安全处理。您的付款信息绝不会存储在我们的服务器上。

## 其他资源 {#additional-resources}

> \[!TIP]
> Our articles below are regularly updated with new guides, tips, and technical information. Check back often for the latest content.

* [案例研究和开发人员文档](/blog/docs)
* [资源](/resources)
* [指南](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/