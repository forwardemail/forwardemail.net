# 常见问题 {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Forward Email 常见问题" class="rounded-lg" />


## 目录 {#table-of-contents}

* [快速开始](#quick-start)
* [介绍](#introduction)
  * [什么是 Forward Email](#what-is-forward-email)
  * [谁在使用 Forward Email](#who-uses-forward-email)
  * [Forward Email 的历史是什么](#what-is-forward-emails-history)
  * [此服务速度有多快](#how-fast-is-this-service)
* [电子邮件客户端](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [移动设备](#mobile-devices)
  * [Sendmail SMTP 中继配置](#sendmail-smtp-relay-configuration)
  * [Exim4 SMTP 中继配置](#exim4-smtp-relay-configuration)
  * [msmtp SMTP 客户端配置](#msmtp-smtp-client-configuration)
  * [命令行电子邮件客户端](#command-line-email-clients)
  * [Windows 电子邮件配置](#windows-email-configuration)
  * [Postfix SMTP 中继配置](#postfix-smtp-relay-configuration)
  * [如何使用 Gmail 发送邮件](#how-to-send-mail-as-using-gmail)
  * [使用 Gmail 发送邮件的传统免费指南是什么](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [高级 Gmail 路由配置](#advanced-gmail-routing-configuration)
  * [高级 Outlook 路由配置](#advanced-outlook-routing-configuration)
* [故障排除](#troubleshooting)
  * [为什么我收不到测试邮件](#why-am-i-not-receiving-my-test-emails)
  * [如何配置我的电子邮件客户端以使用 Forward Email](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [为什么我的邮件会进入垃圾邮件和垃圾箱，我如何检查我的域名信誉](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [如果我收到垃圾邮件，我该怎么办](#what-should-i-do-if-i-receive-spam-emails)
  * [为什么我发给自己的 Gmail 测试邮件显示为“可疑”](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [我可以在 Gmail 中移除 via forwardemail dot net 吗](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [数据管理](#data-management)
  * [你们的服务器位于哪里](#where-are-your-servers-located)
  * [如何导出和备份我的邮箱](#how-do-i-export-and-backup-my-mailbox)
  * [如何导入和迁移我现有的邮箱](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [如何使用我自己的兼容 S3 的存储进行备份](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [如何将 SQLite 备份转换为 EML 文件](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [你们支持自托管吗](#do-you-support-self-hosting)
* [电子邮件配置](#email-configuration)
  * [如何开始并设置邮件转发](#how-do-i-get-started-and-set-up-email-forwarding)
  * [我可以使用多个 MX 交换和服务器进行高级转发吗](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [如何设置假期自动回复（离开办公室自动回复）](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [如何为 Forward Email 设置 SPF](#how-do-i-set-up-spf-for-forward-email)
  * [如何为 Forward Email 设置 DKIM](#how-do-i-set-up-dkim-for-forward-email)
  * [如何为 Forward Email 设置 DMARC](#how-do-i-set-up-dmarc-for-forward-email)
  * [如何查看 DMARC 报告](#how-do-i-view-dmarc-reports)
  * [如何连接和配置联系人](#how-do-i-connect-and-configure-my-contacts)
  * [如何连接和配置日历](#how-do-i-connect-and-configure-my-calendars)
  * [如何添加更多日历和管理现有日历](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [如何连接和配置任务和提醒](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [为什么我不能在 macOS 提醒事项中创建任务](#why-cant-i-create-tasks-in-macos-reminders)
  * [如何在 Android 上设置 Tasks.org](#how-do-i-set-up-tasksorg-on-android)
  * [如何为 Forward Email 设置 SRS](#how-do-i-set-up-srs-for-forward-email)
  * [如何为 Forward Email 设置 MTA-STS](#how-do-i-set-up-mta-sts-for-forward-email)
  * [如何为我的电子邮件地址添加头像](#how-do-i-add-a-profile-picture-to-my-email-address)
* [高级功能](#advanced-features)
  * [你们支持用于营销相关邮件的新闻通讯或邮件列表吗](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [你们支持通过 API 发送邮件吗](#do-you-support-sending-email-with-api)
  * [你们支持通过 IMAP 接收邮件吗](#do-you-support-receiving-email-with-imap)
  * [你们支持 POP3 吗](#do-you-support-pop3)
  * [你们支持日历（CalDAV）吗](#do-you-support-calendars-caldav)
  * [你们支持任务和提醒（CalDAV VTODO）吗](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [你们支持联系人（CardDAV）吗](#do-you-support-contacts-carddav)
  * [你们支持通过 SMTP 发送邮件吗](#do-you-support-sending-email-with-smtp)
  * [你们支持 OpenPGP/MIME、端到端加密（“E2EE”）和 Web 密钥目录（“WKD”）吗](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [你们支持 S/MIME 加密吗](#do-you-support-smime-encryption)
  * [你们支持 Sieve 邮件过滤吗](#do-you-support-sieve-email-filtering)
  * [你们支持 MTA-STS 吗](#do-you-support-mta-sts)
  * [你们支持通行密钥和 WebAuthn 吗](#do-you-support-passkeys-and-webauthn)
  * [你们支持电子邮件最佳实践吗](#do-you-support-email-best-practices)
  * [你们支持退信 Webhooks 吗](#do-you-support-bounce-webhooks)
  * [你们支持 Webhooks 吗](#do-you-support-webhooks)
  * [你们支持正则表达式或 regex 吗](#do-you-support-regular-expressions-or-regex)
  * [你们的外发 SMTP 限制是多少](#what-are-your-outbound-smtp-limits)
  * [启用 SMTP 需要审批吗](#do-i-need-approval-to-enable-smtp)
  * [你们的 SMTP 服务器配置设置是什么](#what-are-your-smtp-server-configuration-settings)
  * [你们的 IMAP 服务器配置设置是什么](#what-are-your-imap-server-configuration-settings)
  * [你们的 POP3 服务器配置设置是什么](#what-are-your-pop3-server-configuration-settings)
  * [如何为我的域设置邮件自动发现](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [安全](#security-1)
  * [高级服务器加固技术](#advanced-server-hardening-techniques)
  * [你们有 SOC 2 或 ISO 27001 认证吗](#do-you-have-soc-2-or-iso-27001-certifications)
  * [你们使用 TLS 加密进行邮件转发吗](#do-you-use-tls-encryption-for-email-forwarding)
  * [你们保留邮件认证头吗](#do-you-preserve-email-authentication-headers)
  * [你们保留原始邮件头并防止伪造吗](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [你们如何防止垃圾邮件和滥用](#how-do-you-protect-against-spam-and-abuse)
  * [你们会将邮件内容存储在磁盘上吗](#do-you-store-email-content-on-disk)
  * [系统崩溃时邮件内容会被暴露吗](#can-email-content-be-exposed-during-system-crashes)
  * [谁可以访问你们的邮件基础设施](#who-has-access-to-your-email-infrastructure)
  * [你们使用哪些基础设施提供商](#what-infrastructure-providers-do-you-use)
  * [你们提供数据处理协议（DPA）吗](#do-you-offer-a-data-processing-agreement-dpa)
  * [你们如何处理数据泄露通知](#how-do-you-handle-data-breach-notifications)
  * [你们提供测试环境吗](#do-you-offer-a-test-environment)
  * [你们提供监控和告警工具吗](#do-you-provide-monitoring-and-alerting-tools)
  * [你们如何确保高可用性](#how-do-you-ensure-high-availability)
  * [你们是否符合《国防授权法案》（NDAA）第 889 条](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [系统和技术细节](#system-and-technical-details)
  * [你们存储邮件及其内容吗](#do-you-store-emails-and-their-contents)
  * [你们的邮件转发系统如何工作](#how-does-your-email-forwarding-system-work)
  * [你们如何处理邮件转发](#how-do-you-process-an-email-for-forwarding)
  * [你们如何处理邮件投递问题](#how-do-you-handle-email-delivery-issues)
  * [你们如何处理 IP 地址被封锁](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [什么是邮局管理员地址](#what-are-postmaster-addresses)
  * [什么是不回复地址](#what-are-no-reply-addresses)
  * [你们服务器的 IP 地址是什么](#what-are-your-servers-ip-addresses)
  * [你们有允许列表吗](#do-you-have-an-allowlist)
  * [默认允许的域名后缀有哪些](#what-domain-name-extensions-are-allowlisted-by-default)
  * [你们的允许列表标准是什么](#what-is-your-allowlist-criteria)
  * [哪些域名后缀可以免费使用](#what-domain-name-extensions-can-be-used-for-free)
  * [你们有灰名单吗](#do-you-have-a-greylist)
  * [你们有拒绝名单吗](#do-you-have-a-denylist)
  * [你们有速率限制吗](#do-you-have-rate-limiting)
  * [你们如何防止反弹邮件](#how-do-you-protect-against-backscatter)
  * [防止来自已知 MAIL FROM 垃圾邮件发送者的退信](#prevent-bounces-from-known-mail-from-spammers)
  * [防止不必要的退信以保护免受反弹邮件](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [你们如何确定邮件指纹](#how-do-you-determine-an-email-fingerprint)
  * [我可以转发邮件到除 25 端口以外的端口吗（例如我的 ISP 阻止了 25 端口）](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [支持 Gmail 别名的加号 + 符号吗](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [支持子域名吗](#does-it-support-sub-domains)
  * [这会转发我的邮件头吗](#does-this-forward-my-emails-headers)
  * [这是经过充分测试的吗](#is-this-well-tested)
  * [你们会传递 SMTP 响应消息和代码吗](#do-you-pass-along-smtp-response-messages-and-codes)
  * [你们如何防止垃圾邮件发送者并确保良好的邮件转发信誉](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [你们如何对域名执行 DNS 查询](#how-do-you-perform-dns-lookups-on-domain-names)
* [账户和计费](#account-and-billing)
  * [付费计划提供退款保证吗](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [如果我更换计划，你们会按比例退款吗](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [我可以仅将此邮件转发服务用作“备用”或“故障转移”MX 服务器吗](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [我可以禁用特定别名吗](#can-i-disable-specific-aliases)
  * [我可以转发邮件给多个收件人吗](#can-i-forward-emails-to-multiple-recipients)
  * [我可以有多个全局通配收件人吗](#can-i-have-multiple-global-catch-all-recipients)
  * [每个别名转发的邮件地址数量有限制吗](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [我可以递归转发邮件吗](#can-i-recursively-forward-emails)
  * [别人可以未经我允许注销或注册我的邮件转发吗](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [这是如何免费的](#how-is-it-free)
  * [最大邮件大小限制是多少](#what-is-the-max-email-size-limit)
  * [你们存储邮件日志吗](#do-you-store-logs-of-emails)
  * [你们存储错误日志吗](#do-you-store-error-logs)
  * [你们会读取我的邮件吗](#do-you-read-my-emails)
  * [我可以用它在 Gmail 中“发送邮件为”吗](#can-i-send-mail-as-in-gmail-with-this)
  * [我可以用它在 Outlook 中“发送邮件为”吗](#can-i-send-mail-as-in-outlook-with-this)
  * [我可以用它在 Apple Mail 和 iCloud Mail 中“发送邮件为”吗](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [我可以用它无限转发邮件吗](#can-i-forward-unlimited-emails-with-this)
  * [你们提供一个价格无限域名吗](#do-you-offer-unlimited-domains-for-one-price)
  * [你们接受哪些支付方式](#which-payment-methods-do-you-accept)
* [附加资源](#additional-resources)
## 快速开始 {#quick-start}

开始使用 Forward Email：

1. **创建账户**，访问 [forwardemail.net/register](https://forwardemail.net/register)

2. **添加并验证您的域名**，在 [我的账户 → 域名](/my-account/domains)

3. **添加并配置邮箱别名/邮箱**，在 [我的账户 → 域名](/my-account/domains) → 别名

4. **测试您的设置**，向您的新别名发送一封邮件

> \[!TIP]
> DNS 变更可能需要 24-48 小时才能全球生效，但通常会更快生效。

> \[!IMPORTANT]
> 为了提升邮件送达率，我们建议设置 [SPF](#how-do-i-set-up-spf-for-forward-email)、[DKIM](#how-do-i-set-up-dkim-for-forward-email) 和 [DMARC](#how-do-i-set-up-dmarc-for-forward-email) 记录。


## 介绍 {#introduction}

### 什么是 Forward Email {#what-is-forward-email}

> \[!NOTE]
> Forward Email 非常适合个人、小型企业和开发者，他们希望拥有专业的邮箱地址，但又不想承担完整邮件托管解决方案的成本和维护。

Forward Email 是一个**功能齐全的邮件服务提供商**和**自定义域名的邮件托管提供商**。

它是唯一免费且开源的服务，让您无需搭建和维护自己的邮件服务器即可使用自定义域名邮箱地址。

我们的服务会将发送到您自定义域名的邮件转发到您现有的邮箱账户——您甚至可以使用我们作为专属的邮件托管提供商。

Forward Email 的主要功能：

* **自定义域名邮箱**：使用带有您自己域名的专业邮箱地址
* **免费套餐**：基础邮件转发免费提供
* **增强隐私保护**：我们不读取您的邮件，也不出售您的数据
* **开源**：我们的全部代码库均在 GitHub 上公开
* **支持 SMTP、IMAP 和 POP3**：完整的邮件发送和接收功能
* **端到端加密**：支持 OpenPGP/MIME
* **自定义通配别名**：创建无限数量的邮箱别名

您可以在[我们的邮件服务对比页面](/blog/best-email-service)上，将我们与 56+ 其他邮件服务提供商进行比较。

> \[!TIP]
> 通过阅读我们的免费[技术白皮书](/technical-whitepaper.pdf)了解更多关于 Forward Email 的信息

### 谁在使用 Forward Email {#who-uses-forward-email}

我们为超过 1.6+ million 个域名提供邮件托管和邮件转发服务，以下是一些知名用户：

| 客户                                   | 案例研究                                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 美国海军学院                           | [:page_facing_up: 案例研究](/blog/docs/federal-government-email-service-section-889-compliant)         |
| Canonical                                | [:page_facing_up: 案例研究](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Netflix Games                            |                                                                                                          |
| Linux 基金会                           | [:page_facing_up: 案例研究](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| PHP 基金会                             |                                                                                                          |
| Fox News Radio                           |                                                                                                          |
| 迪士尼广告销售                        |                                                                                                          |
| jQuery                                   | [:page_facing_up: 案例研究](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| LineageOS                                |                                                                                                          |
| Ubuntu                                   | [:page_facing_up: 案例研究](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Kubuntu                                  | [:page_facing_up: 案例研究](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Lubuntu                                  | [:page_facing_up: 案例研究](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| 剑桥大学                               | [:page_facing_up: 案例研究](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| 马里兰大学                             | [:page_facing_up: 案例研究](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| 华盛顿大学                             | [:page_facing_up: 案例研究](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| 塔夫茨大学                           | [:page_facing_up: 案例研究](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| 斯沃斯莫尔学院                       | [:page_facing_up: 案例研究](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| 南澳大利亚政府                       |                                                                                                          |
| 多米尼加共和国政府                   |                                                                                                          |
| Fly<span>.</span>io                      |                                                                                                          |
| RCD 酒店                               |                                                                                                          |
| Isaac Z. Schlueter (npm)                 | [:page_facing_up: 案例研究](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |                                                                                                          |
### Forward Email 的历史是什么 {#what-is-forward-emails-history}

您可以在[我们的关于页面](/about)了解更多关于 Forward Email 的信息。

### 该服务有多快 {#how-fast-is-this-service}

> \[!NOTE]
> 我们的系统设计注重速度和可靠性，配备多个冗余服务器，确保您的邮件能够及时送达。

Forward Email 以极短的延迟传递邮件，通常在收到邮件后几秒内完成转发。

性能指标：

* **平均传递时间**：从接收至转发少于 5-10 秒（[查看我们的收件箱时间“TTI”监控页面](/tti)）
* **正常运行时间**：99.9% 以上的服务可用性
* **全球基础设施**：服务器战略性布局，实现最佳路由
* **自动扩展**：系统在邮件高峰期自动扩展

我们实时运行，不同于依赖延迟队列的其他服务提供商。

我们不写入磁盘或存储日志——[错误日志除外](#do-you-store-error-logs)和[外发 SMTP](#do-you-support-sending-email-with-smtp)（详见我们的[隐私政策](/privacy)）。

所有操作均在内存中完成，[我们的源代码托管在 GitHub](https://github.com/forwardemail)。

## 邮件客户端 {#email-clients}

### Thunderbird {#thunderbird}

1. 在 Forward Email 仪表盘创建新别名并生成密码
2. 打开 Thunderbird，进入 **编辑 → 账户设置 → 账户操作 → 添加邮件账户**
3. 输入您的姓名、Forward Email 地址和密码
4. 点击 **手动配置** 并输入：
   * 收件服务器：IMAP，`imap.forwardemail.net`，端口 993，SSL/TLS
   * 发件服务器：SMTP，`smtp.forwardemail.net`，端口 465，SSL/TLS（推荐；端口 587 支持 STARTTLS）
5. 点击 **完成**

### Microsoft Outlook {#microsoft-outlook}

1. 在 Forward Email 仪表盘创建新别名并生成密码
2. 进入 **文件 → 添加账户**
3. 输入您的 Forward Email 地址并点击 **连接**
4. 选择 **高级选项** 并勾选 **让我手动设置账户**
5. 选择 **IMAP** 并输入：
   * 收件服务器：`imap.forwardemail.net`，端口 993，SSL
   * 发件服务器：`smtp.forwardemail.net`，端口 465，SSL/TLS（推荐；端口 587 支持 STARTTLS）
   * 用户名：您的完整邮箱地址
   * 密码：您生成的密码
6. 点击 **连接**

### Apple Mail {#apple-mail}

1. 在 Forward Email 仪表盘创建新别名并生成密码
2. 进入 **邮件 → 偏好设置 → 账户 → +**
3. 选择 **其他邮件账户**
4. 输入您的姓名、Forward Email 地址和密码
5. 服务器设置填写：
   * 收件服务器：`imap.forwardemail.net`
   * 发件服务器：`smtp.forwardemail.net`
   * 用户名：您的完整邮箱地址
   * 密码：您生成的密码
6. 点击 **登录**

### eM Client {#em-client}

1. 在 Forward Email 仪表盘创建新别名并生成密码
2. 打开 eM Client，进入 **菜单 → 账户 → + 添加账户**
3. 点击 **邮件**，然后选择 **其他**
4. 输入您的 Forward Email 地址并点击 **下一步**
5. 输入以下服务器设置：
   * **收件服务器**：`imap.forwardemail.net`
   * **发件服务器**：`smtp.forwardemail.net`
6. 对收件和发件服务器均输入您的完整邮箱地址作为 **用户名**，生成的密码作为 **密码**
7. eM Client 会测试连接，测试通过后点击 **下一步**
8. 输入您的姓名并选择账户名称
9. 点击 **完成**

### 移动设备 {#mobile-devices}

iOS：

1. 进入 **设置 → 邮件 → 账户 → 添加账户 → 其他**
2. 点击 **添加邮件账户** 并输入您的信息
3. 服务器设置使用上述相同的 IMAP 和 SMTP 设置

Android：

1. 进入 **设置 → 账户 → 添加账户 → 个人（IMAP）**
2. 输入您的 Forward Email 地址和密码
3. 服务器设置使用上述相同的 IMAP 和 SMTP 设置

### Sendmail SMTP 中继配置 {#sendmail-smtp-relay-configuration}

您可以配置 Sendmail 通过 Forward Email 的 SMTP 服务器中继邮件。这是遗留系统或依赖 Sendmail 的应用程序常用的设置。
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">预计设置时间：</strong>
  <span>少于 20 分钟</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要：
  </strong>
  <span>
    这需要启用 SMTP 访问的付费计划。
  </span>
</div>

#### 配置 {#configuration}

1. 编辑您的 `sendmail.mc` 文件，通常位于 `/etc/mail/sendmail.mc`：

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. 添加以下行以定义智能主机和身份验证：

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. 创建身份验证文件 `/etc/mail/authinfo`：

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. 将您的 Forward Email 凭据添加到 `authinfo` 文件：

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. 生成身份验证数据库并保护文件：

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. 重建 Sendmail 配置并重启服务：

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### 测试 {#testing}

发送测试邮件以验证配置：

```bash
echo "Test email from Sendmail" | mail -s "Sendmail Test" recipient@example.com
```

### Exim4 SMTP 中继配置 {#exim4-smtp-relay-configuration}

Exim4 是 Debian 系统上流行的 MTA。您可以配置它使用 Forward Email 作为智能主机。

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">预计设置时间：</strong>
  <span>少于 15 分钟</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要：
  </strong>
  <span>
    这需要启用 SMTP 访问的付费计划。
  </span>
</div>

#### 配置 {#configuration-1}

1. 运行 Exim4 配置工具：

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. 选择以下选项：
   * **邮件配置的一般类型：** 通过智能主机发送邮件；通过 SMTP 或 fetchmail 接收
   * **系统邮件名称：** your.hostname
   * **监听传入 SMTP 连接的 IP 地址：** 127.0.0.1 ; ::1
   * **接受邮件的其他目的地：** （留空）
   * **中继邮件的域名：** （留空）
   * **外发智能主机的 IP 地址或主机名：** smtp.forwardemail.net::465
   * **在外发邮件中隐藏本地邮件名称？** 否
   * **保持 DNS 查询次数最少（按需拨号）？** 否
   * **本地邮件的投递方式：** /var/mail/ 中的 Mbox 格式
   * **将配置拆分为小文件？** 否

3. 编辑 `passwd.client` 文件以添加您的凭据：

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. 添加以下行：

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. 更新配置并重启 Exim4：

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### 测试 {#testing-1}

发送测试邮件：

```bash
echo "Test from Exim4" | mail -s "Exim4 Test" recipient@example.com
```

### msmtp SMTP 客户端配置 {#msmtp-smtp-client-configuration}

msmtp 是一个轻量级 SMTP 客户端，适合从脚本或命令行应用程序发送邮件。

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">预计设置时间：</strong>
  <span>少于 10 分钟</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要提示：
  </strong>
  <span>
    这需要启用 SMTP 访问的付费计划。
  </span>
</div>

#### 配置 {#configuration-2}

1. 创建或编辑 msmtp 配置文件 `~/.msmtprc`：

   ```bash
   nano ~/.msmtprc
   ```

2. 添加以下配置：

   ```
   defaults
   auth           on
   tls            on
   tls_trust_file /etc/ssl/certs/ca-certificates.crt
   logfile        ~/.msmtp.log

   account        forwardemail
   host           smtp.forwardemail.net
   port           465
   tls_starttls   off
   from           your-alias@yourdomain.com
   user           your-alias@yourdomain.com
   password       your-generated-password

   account default : forwardemail
   ```

3. 设置配置文件的正确权限：

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### 测试 {#testing-2}

发送测试邮件：

```bash
echo "This is a test email from msmtp" | msmtp -a default recipient@example.com
```

### 命令行邮件客户端 {#command-line-email-clients}

流行的命令行邮件客户端如 [Mutt](https://gitlab.com/muttmua/mutt)、[NeoMutt](https://neomutt.org) 和 [Alpine](https://alpine.x10.mx/alpine/release/) 可以配置使用 Forward Email 的 SMTP 服务器发送邮件。配置方式与 `msmtp` 类似，在相应的配置文件（`.muttrc`、`.neomuttrc` 或 `.pinerc`）中填写 SMTP 服务器详情和凭据。

### Windows 邮件配置 {#windows-email-configuration}

Windows 用户可以使用 Forward Email 账户提供的 IMAP 和 SMTP 设置配置流行的邮件客户端，如 **Microsoft Outlook** 和 **eM Client**。对于命令行或脚本使用，可以使用 PowerShell 的 `Send-MailMessage` cmdlet（尽管它已被视为过时）或轻量级 SMTP 中继工具如 [E-MailRelay](https://github.com/graeme-walker/emailrelay)。

### Postfix SMTP 中继配置 {#postfix-smtp-relay-configuration}

您可以配置 Postfix 通过 Forward Email 的 SMTP 服务器中继邮件。这对于需要发送邮件的服务器应用程序非常有用。

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
    这需要启用 SMTP 访问的付费计划。
  </span>
</div>

#### 安装 {#installation}

1. 在服务器上安装 Postfix：

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. 安装过程中，选择“Internet Site”作为配置类型。

#### 配置 {#configuration-3}

1. 编辑 Postfix 主配置文件：

```bash
sudo nano /etc/postfix/main.cf
```

2. 添加或修改以下设置：

```
# SMTP 中继配置
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. 创建 SASL 密码文件：

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. 添加您的 Forward Email 凭据：

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
```

5. 保护并生成密码文件的哈希：

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. 重启 Postfix：

```bash
sudo systemctl restart postfix
```

#### 测试 {#testing-3}

通过发送测试邮件来测试配置：

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

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
    如果您已按照上面 <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">如何开始并设置邮件转发</a> 中的说明操作，那么您可以继续阅读以下内容。
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要提示：
  </strong>
  <span>
    请确保您已阅读我们的 <a href="/terms" class="alert-link" target="_blank">条款</a>、<a href="/privacy" class="alert-link" target="_blank">隐私政策</a> 以及 <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">外发 SMTP 限制</a> —— 您的使用即视为认可并同意。
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要提示：
  </strong>
  <span>
    如果您是开发者，请参阅我们的 <a class="alert-link" href="/email-api#outbound-emails" target="_blank">邮件 API 文档</a>。
  </span>
</div>

1. 访问 <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 设置 <i class="fa fa-angle-right"></i> 外发 SMTP 配置，并按照设置说明操作

2. 在 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 别名 下为您的域名创建一个新的别名（例如 <code><hello@example.com></code>）

3. 点击新创建别名旁边的 <strong class="text-success"><i class="fa fa-key"></i> 生成密码</strong>。复制到剪贴板并安全保存屏幕上显示的生成密码。

4. 访问 [Gmail](https://gmail.com)，在 [设置 <i class="fa fa-angle-right"></i> 账户和导入 <i class="fa fa-angle-right"></i> 以此身份发送邮件](https://mail.google.com/mail/u/0/#settings/accounts) 下，点击“添加另一个邮箱地址”

5. 在提示输入“姓名”时，输入您希望邮件显示的发件人名称（例如“Linus Torvalds”）。

6. 在提示输入“电子邮件地址”时，输入您在 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 别名 下创建的完整别名邮箱地址（例如 <code><hello@example.com></code>）

7. 取消勾选“作为别名处理”

8. 点击“下一步”继续

9. 在提示输入“SMTP 服务器”时，输入 <code>smtp.forwardemail.net</code> 并将端口更改为 <code>465</code>

10. 在提示输入“用户名”时，输入您在 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 别名 下创建的完整别名邮箱地址（例如 <code><hello@example.com></code>）

11. 在提示输入“密码”时，粘贴步骤 3 中 <strong class="text-success"><i class="fa fa-key"></i> 生成密码</strong> 显示的密码

12. 选择“使用 SSL 的安全连接”单选按钮

13. 点击“添加账户”继续

14. 打开新标签页访问 [Gmail](https://gmail.com)，等待验证邮件到达（您将收到一个验证码，用于确认您是尝试“以此身份发送邮件”的邮箱地址的所有者）

15. 邮件到达后，将验证码复制并粘贴到上一步提示的输入框中
16. 完成后，返回邮件并点击“确认请求”的链接。您很可能需要执行此步骤和前面的步骤，邮件才能正确配置。

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

### 什么是使用 Gmail 发送邮件的传统免费指南 {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">重要：</strong> 该传统免费指南自2023年5月起已废弃，因为<a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">我们现在支持外发 SMTP</a>。如果您使用下面的指南，<a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">这将导致您的外发邮件</a> 在 Gmail 中显示“<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>”。</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">预计设置时间：</strong>
  <span>少于10分钟</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    入门指南：
  </strong>
  <span>
    如果您已按照上面<a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">如何开始并设置邮件转发</a>中的说明操作，则可以继续阅读以下内容。
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="如何使用 Gmail 发送邮件" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. 您需要启用[Gmail 的两步验证][gmail-2fa]才能使用此功能。如果尚未启用，请访问 <https://www.google.com/landing/2step/>。

2. 启用两步验证后（或如果您之前已启用），请访问 <https://myaccount.google.com/apppasswords>。

3. 当系统提示“选择您要为其生成应用密码的应用和设备”时：
   * 在“选择应用”下拉菜单中选择“邮件”
   * 在“选择设备”下拉菜单中选择“其他”
   * 当提示输入文本时，输入您转发的自定义域邮箱地址（例如 <code><hello@example.com></code> - 这将帮助您在为多个账户使用此服务时进行跟踪）

4. 复制自动生成的密码到剪贴板
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       重要：
     </strong>
     <span>
       如果您使用的是 G Suite，请访问您的管理员面板 <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">应用 <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Gmail 设置 <i class="fa fa-angle-right"></i> 设置</a>，确保勾选“允许用户通过外部 SMTP 服务器发送邮件...”。此更改生效可能会有延迟，请等待几分钟。
     </span>
   </div>

5. 访问 [Gmail](https://gmail.com)，在[设置 <i class="fa fa-angle-right"></i> 账户和导入 <i class="fa fa-angle-right"></i> 发送邮件为](https://mail.google.com/mail/u/0/#settings/accounts)中，点击“添加另一个邮箱地址”

6. 当提示“姓名”时，输入您希望邮件显示的发件人名称（例如“Linus Torvalds”）

7. 当提示“电子邮件地址”时，输入您上面使用的自定义域邮箱地址（例如 <code><hello@example.com></code>）
8. 取消选中“Treat as an alias”

9. 点击“Next Step”继续

10. 当提示输入“SMTP Server”时，输入<code>smtp.gmail.com</code>，端口保持为<code>587</code>

11. 当提示输入“Username”时，输入你的 Gmail 地址中不包含<span>gmail.com</span>部分的用户名（例如，如果我的邮箱是<span><user@gmail.com></span>，则只输入“user”）
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        重要提示：
      </strong>
      <span>
        如果“Username”部分被自动填充，则<u><strong>你需要将其更改为你的 Gmail 地址的用户名部分</strong></u>。
      </span>
    </div>

12. 当提示输入“Password”时，从剪贴板粘贴你在第2步生成的密码

13. 保持“Secured connection using TLS”单选按钮被选中

14. 点击“Add Account”继续

15. 打开新标签页访问[Gmail](https://gmail.com)，等待验证邮件到达（你将收到一个验证码，确认你是尝试“Send Mail As”的邮箱地址的所有者）

16. 邮件到达后，将验证码复制并粘贴到上一步提示的输入框中

17. 完成后，返回邮件并点击“confirm the request”链接。你很可能需要完成这一步和上一步，邮件才能正确配置。

</div>

### 高级 Gmail 路由配置 {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">预计设置时间：</strong>
  <span>15-30 分钟</span>
</div>

如果你想在 Gmail 中设置高级路由，使得不匹配邮箱的别名转发到 Forward Email 的邮件交换服务器，请按照以下步骤操作：

1. 登录你的 Google 管理控制台，网址为 [admin.google.com](https://admin.google.com)
2. 进入 **Apps → Google Workspace → Gmail → Routing**
3. 点击 **Add Route** 并配置以下设置：

**单收件人设置：**

* 选择“Change envelope recipient”，并输入你的主 Gmail 地址
* 勾选“Add X-Gm-Original-To header with original recipient”

**信封收件人模式：**

* 添加一个匹配所有不存在邮箱的模式（例如，`.*@yourdomain.com`）

**邮件服务器设置：**

* 选择“Route to host”，输入 `mx1.forwardemail.net` 作为主服务器
* 添加 `mx2.forwardemail.net` 作为备份服务器
* 端口设置为 25
* 选择“Require TLS”以确保安全

4. 点击 **Save** 创建路由

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要提示：
  </strong>
  <span>
    此配置仅适用于拥有自定义域名的 Google Workspace 账户，不适用于普通 Gmail 账户。
  </span>
</div>

### 高级 Outlook 路由配置 {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">预计设置时间：</strong>
  <span>15-30 分钟</span>
</div>

对于希望设置高级路由，使得不匹配邮箱的别名转发到 Forward Email 邮件交换服务器的 Microsoft 365（前身为 Office 365）用户：

1. 登录 Microsoft 365 管理中心，网址为 [admin.microsoft.com](https://admin.microsoft.com)
2. 进入 **Exchange → Mail flow → Rules**
3. 点击 **Add a rule** 并选择 **Create a new rule**
4. 为规则命名（例如，“Forward non-existent mailboxes to Forward Email”）
5. 在 **Apply this rule if** 下选择：
   * “The recipient address matches...”
   * 输入匹配你域名所有地址的模式（例如，`*@yourdomain.com`）
6. 在 **Do the following** 下选择：
   * “Redirect the message to...”
   * 选择“以下邮件服务器”
   * 输入 `mx1.forwardemail.net` 和端口 25
   * 添加 `mx2.forwardemail.net` 作为备份服务器
7. 在 **Except if** 下选择：
   * “The recipient is...”
   * 添加所有不应被转发的现有邮箱
8. 设置规则优先级，确保其在其他邮件流规则之后运行
9. 点击 **Save** 激活规则
## 故障排除 {#troubleshooting}

### 为什么我收不到测试邮件 {#why-am-i-not-receiving-my-test-emails}

如果你给自己发送测试邮件，邮件可能不会出现在收件箱中，因为它具有相同的“Message-ID”头。

这是一个广为人知的问题，也影响像 Gmail 这样的服务。<a href="https://support.google.com/a/answer/1703601">这里是 Gmail 关于此问题的官方答复</a>。

如果你仍然遇到问题，很可能是 DNS 传播的问题。你需要等待更长时间后再试（或者尝试在你的 <strong class="notranslate">TXT</strong> 记录上设置较低的 TTL 值）。

**仍然有问题？** 请<a href="/help">联系我们</a>，我们可以帮助调查问题并快速解决。

### 如何配置我的邮件客户端以使用 Forward Email {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  我们的服务支持以下流行的邮件客户端：
  <ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
    <li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> 桌面端</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> 终端</a></li>
  </ul>
</div>

<div class="alert alert-primary">
  你的用户名是你的别名邮箱地址，密码来自 <strong class="text-success"><i class="fa fa-key"></i> 生成密码</strong>（“普通密码”）。
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    提示：
  </strong>
  <span>如果你使用 Thunderbird，请确保“连接安全性”设置为“SSL/TLS”，认证方式设置为“普通密码”。</span>
</div>

| 类型 |         主机名         |         协议          |                                            端口                                            |
| :--: | :---------------------: | :---------------------: | :----------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` |  SSL/TLS **首选**       |                                      `993` 和 `2993`                                      |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **推荐**        | SSL/TLS（推荐）使用 `465` 和 `2465`，STARTTLS 使用 `587`、`2587`、`2525` 和 `25` |

### 为什么我的邮件会进入垃圾邮件和垃圾箱，以及我如何检查我的域名声誉 {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
本节指导您如果您的外发邮件使用我们的 SMTP 服务器（例如 `smtp.forwardemail.net`）（或通过 `mx1.forwardemail.net` 或 `mx2.forwardemail.net` 转发），且邮件被收件人投递到垃圾邮件或垃圾邮箱文件夹。

我们会定期监控我们的[IP 地址](#what-are-your-servers-ip-addresses)是否出现在[所有知名的 DNS 拒绝列表](#how-do-you-handle-your-ip-addresses-becoming-blocked)中，**因此很可能是域名声誉相关的问题**。

邮件被归类为垃圾邮件可能有多种原因：

1. **缺少认证**：请设置[SPF](#how-do-i-set-up-spf-for-forward-email)、[DKIM](#how-do-i-set-up-dkim-for-forward-email)和[DMARC](#how-do-i-set-up-dmarc-for-forward-email)记录。

2. **域名声誉**：新域名通常在建立发送历史之前声誉为中性。

3. **内容触发**：某些词语或短语可能触发垃圾邮件过滤器。

4. **发送模式**：邮件量突然增加可能看起来可疑。

您可以尝试使用以下一个或多个工具检查您的域名声誉和分类：

#### 声誉和黑名单检查工具 {#reputation-and-blocklist-check-tools}

| 工具名称                                   | URL                                                          | 类型                   |
| ------------------------------------------- | ------------------------------------------------------------ | ---------------------- |
| Cloudflare 域名分类反馈                      | <https://radar.cloudflare.com/domains/feedback>              | 分类                   |
| Spamhaus IP 和域名声誉检查器                 | <https://check.spamhaus.org/>                                | DNSBL                  |
| Cisco Talos IP 和域名声誉中心                 | <https://talosintelligence.com/reputation_center>            | 声誉                   |
| Barracuda IP 和域名声誉查询                   | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| MX Toolbox 黑名单检查                        | <https://mxtoolbox.com/blacklists.aspx>                      | 黑名单                 |
| Google 邮件管理员工具                        | <https://www.gmail.com/postmaster/>                          | 声誉                   |
| Yahoo 发送者中心                            | <https://senders.yahooinc.com/>                              | 声誉                   |
| MultiRBL.valli.org 黑名单检查                 | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                                | <https://senderscore.org/act/blocklist-remover/>             | 声誉                   |
| Invaluement                                 | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                       | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                     | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| UCEPROTECT 的等级 1、2 和 3                   | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| UCEPROTECT 的 backscatterer.org              | <https://www.backscatterer.org/>                             | 反向散射保护           |
| UCEPROTECT 的 whitelisted.org                | <https://www.whitelisted.org/>（需付费）                      | DNSWL                  |

#### 按提供商分类的 IP 移除请求表单 {#ip-removal-request-forms-by-provider}

如果您的 IP 地址被特定邮件提供商屏蔽，请使用相应的移除表单或以下联系方式：

| 提供商                               | 移除表单 / 联系方式                                                                                     | 备注                                        |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Google/Gmail                           | <https://support.google.com/mail/contact/bulk_send_new>                                                    | 大批量发送者联系表单                         |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                | Office 365 IP 移除门户                        |
| Yahoo/AOL/Verizon                      | <https://senders.yahooinc.com/>                                                                            | Yahoo 发送者中心                             |
| Apple/iCloud                           | <https://ipcheck.proofpoint.com/>                                                                          | Apple 使用 Proofpoint 进行 IP 声誉管理       |
| Proofpoint                             | <https://ipcheck.proofpoint.com/>                                                                          | Proofpoint IP 检查和移除                      |
| Barracuda Networks                     | <https://www.barracudacentral.org/lookups/lookup-reputation>                                               | Barracuda 声誉查询和移除                      |
| Cloudmark                              | <https://csi.cloudmark.com/en/reset/>                                                                      | Cloudmark CSI 重置请求                        |
| GoDaddy/SecureServer                   | <https://unblock.secureserver.net>                                                                         | GoDaddy IP 解封请求表单                       |
| Comcast/Xfinity                        | <https://spa.xfinity.com/report>                                                                           | Comcast IP 移除请求                           |
| Charter/Spectrum                       | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                | 联系 Spectrum 支持进行移除                    |
| AT&T                                   | `abuse_rbl@abuse-att.net`                                                                                  | 移除请求邮箱                                 |
| Cox Communications                     | `unblock.request@cox.net`                                                                                  | 移除请求邮箱                                 |
| CenturyLink/Lumen                      | `abuse@centurylink.com`                                                                                    | 使用 Cloudfilter                             |
| Windstream                             | `abuse@windstream.net`                                                                                     | 移除请求邮箱                                 |
| t-online.de（德国）                    | `tobr@rx.t-online.de`                                                                                      | 移除请求邮箱                                 |
| Orange France                          | <https://postmaster.orange.fr/>                                                                            | 使用联系表单或邮箱 `abuse@orange.fr`          |
| GMX                                    | <https://postmaster.gmx.net/en/contact>                                                                    | GMX 邮件管理员联系表单                        |
| Mail.ru                                | <https://postmaster.mail.ru/>                                                                              | Mail.ru 邮件管理员门户                        |
| Yandex                                 | <https://postmaster.yandex.ru/>                                                                            | Yandex 邮件管理员门户                         |
| QQ 邮箱（腾讯）                        | <https://open.mail.qq.com/>                                                                                | QQ 邮箱白名单申请（中文）                      |
| 网易（163.com）                        | <https://mail.163.com/postmaster/>                                                                         | 网易邮件管理员门户                            |
| 阿里巴巴/阿里云/万网                    | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                       | 通过阿里云控制台联系                          |
| Amazon SES                             | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                               | AWS SES 控制台 > 黑名单移除                   |
| SendGrid                               | <https://support.sendgrid.com/>                                                                            | 联系 SendGrid 支持                           |
| Mimecast                               | <https://community.mimecast.com/>                                                                          | 使用第三方 RBL - 联系具体 RBL                  |
| Fastmail                               | <https://www.fastmail.com/support/>                                                                        | 联系 Fastmail 支持                           |
| Zoho                                   | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address> | 联系 Zoho 支持                              |
| ProtonMail                             | <https://proton.me/support/contact>                                                                        | 联系 Proton 支持                            |
| Tutanota                               | <https://tutanota.com/support>                                                                             | 联系 Tutanota 支持                          |
| Hushmail                               | <https://www.hushmail.com/support/>                                                                        | 联系 Hushmail 支持                          |
| Mailbox.org                            | <https://mailbox.org/en/support>                                                                           | 联系 Mailbox.org 支持                       |
| Posteo                                 | <https://posteo.de/en/site/contact>                                                                        | 联系 Posteo 支持                            |
| DuckDuckGo 邮箱                       | <https://duckduckgo.com/email/support>                                                                     | 联系 DuckDuckGo 支持                        |
| Sonic.net                              | <https://www.sonic.com/support>                                                                            | 联系 Sonic 支持                             |
| Telus                                  | <https://www.telus.com/en/support>                                                                         | 联系 Telus 支持                             |
| Vodafone 德国                         | <https://www.vodafone.de/hilfe/>                                                                           | 联系 Vodafone 支持                          |
| Xtra (Spark NZ)                        | <https://www.spark.co.nz/help/>                                                                            | 联系 Spark NZ 支持                          |
| UOL/BOL（巴西）                       | <https://ajuda.uol.com.br/>                                                                                | 联系 UOL 支持（葡萄牙语）                     |
| Libero（意大利）                      | <https://aiuto.libero.it/>                                                                                 | 联系 Libero 支持（意大利语）                   |
| Telenet（比利时）                     | <https://www2.telenet.be/en/support/>                                                                      | 联系 Telenet 支持                           |
| Facebook/WhatsApp                      | <https://www.facebook.com/business/help>                                                                   | 联系 Facebook 商业支持                       |
| LinkedIn                               | <https://www.linkedin.com/help/linkedin>                                                                   | 联系 LinkedIn 支持                          |
| Groups.io                              | <https://groups.io/helpcenter>                                                                             | 联系 Groups.io 支持                         |
| Earthlink/Vade Secure                  | <https://sendertool.vadesecure.com/en/>                                                                    | Vade Secure 发送者工具                      |
| Cloudflare 邮件安全                    | <https://www.cloudflare.com/products/zero-trust/email-security/>                                           | 联系 Cloudflare 支持                        |
| Hornetsecurity/Expurgate               | <https://www.hornetsecurity.com/>                                                                          | 联系 Hornetsecurity 支持                    |
| SpamExperts/Antispamcloud              | <https://www.spamexperts.com/>                                                                             | 通过托管服务提供商联系                      |
| Mail2World                             | <https://www.mail2world.com/support/>                                                                      | 联系 Mail2World 支持                        |
> \[!TIP]
> 从少量高质量的邮件开始，建立良好的声誉后再发送大量邮件。

> \[!IMPORTANT]
> 如果您的域名被列入黑名单，每个黑名单都有自己的移除流程。请查看它们的网站获取说明。

> \[!TIP]
> 如果您需要额外帮助，或者发现我们被某些邮件服务提供商误判为垃圾邮件，请 <a href="/help">联系我们</a>。

### 如果我收到垃圾邮件，我应该怎么办 {#what-should-i-do-if-i-receive-spam-emails}

您应该从邮件列表中退订（如果可能）并屏蔽发件人。

请不要将邮件举报为垃圾邮件，而是转发给我们手动管理且注重隐私的滥用防范系统。

**转发垃圾邮件的邮箱地址是：** <abuse@forwardemail.net>

### 为什么我发给自己在 Gmail 的测试邮件显示为“可疑” {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

如果您在 Gmail 发送测试邮件给自己时，或您用别名发送邮件给某人时，对方第一次收到您的邮件出现此错误提示，**请不要担心**——这是 Gmail 内置的安全功能。

您只需点击“看起来安全”。例如，如果您使用“以此身份发送邮件”功能发送测试邮件（给别人），他们就不会看到此提示。

但如果他们看到此提示，是因为他们习惯了您的邮件来自 <john@gmail.com>，而不是 <john@customdomain.com>（仅举例）。Gmail 会提醒用户以确保安全，目前没有解决方法。

### 我能否在 Gmail 中去掉 via forwardemail dot net {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

此话题与[ Gmail 中发件人名称旁出现额外信息的广为人知问题](https://support.google.com/mail/answer/1311182)相关。

截至 2023 年 5 月，我们为所有付费用户支持通过 SMTP 发送邮件的附加功能——这意味着您可以在 Gmail 中去掉 <span class="notranslate">via forwardemail dot net</span>。

请注意，此常见问题专门针对使用[如何使用 Gmail 发送邮件](#how-to-send-mail-as-using-gmail)功能的用户。

配置说明请参见[您是否支持通过 SMTP 发送邮件](#do-you-support-sending-email-with-smtp)部分。

## 数据管理 {#data-management}

### 您的服务器位于哪里 {#where-are-your-servers-located}

> \[!TIP]
> 我们可能很快会宣布位于 [forwardemail.eu](https://forwardemail.eu) 托管的欧盟数据中心位置。请订阅 <https://github.com/orgs/forwardemail/discussions/336> 的讨论以获取更新。

我们的服务器主要位于科罗拉多州丹佛——完整 IP 地址列表见 <https://forwardemail.net/ips>。

您可以在我们的 [GDPR](/gdpr)、[DPA](/dpa) 和 [隐私](/privacy) 页面了解我们的子处理方。

### 如何导出和备份我的邮箱 {#how-do-i-export-and-backup-my-mailbox}

您随时可以将邮箱导出为 [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions)、[Mbox](https://en.wikipedia.org/wiki/Mbox) 或加密的 [SQLite](https://en.wikipedia.org/wiki/SQLite) 格式。

前往 <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 别名 <i class="fa fa-angle-right"></i> 下载备份，选择您偏好的导出格式。

导出完成后，您将收到一封包含下载链接的邮件。

请注意，出于安全考虑，该导出下载链接 4 小时后过期。

如果您需要查看导出的 EML 或 Mbox 格式文件，以下开源工具可能有用：

| 名称             | 格式  | 平台          | GitHub 链接                                         |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox Viewer     |  Mbox  | Windows       | <https://github.com/eneam/mboxviewer>               |
| mbox-web-viewer |  Mbox  | 所有平台      | <https://github.com/PHMRanger/mbox-web-viewer>      |
| EmlReader       |   EML  | Windows       | <https://github.com/ayamadori/EmlReader>            |
| Email viewer    |   EML  | VSCode        | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-reader      |   EML  | 所有平台      | <https://github.com/s0ph1e/eml-reader>              |
此外，如果您需要将 Mbox 文件转换为 EML 文件，可以使用 <https://github.com/noelmartinon/mboxzilla>。

### 如何导入和迁移我现有的邮箱 {#how-do-i-import-and-migrate-my-existing-mailbox}

您可以按照以下说明轻松将电子邮件导入 Forward Email（例如使用 [Thunderbird](https://www.thunderbird.net)）：

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要：
  </strong>
  <span>
    您必须遵循以下所有步骤才能导入现有的电子邮件。
  </span>
</div>

1. 从您现有的电子邮件提供商导出您的电子邮件：

   | 电子邮件提供商 | 导出格式                                  | 导出说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail          | MBOX                                           | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook        | PST                                            | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">提示：</strong> <span>如果您使用的是 Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST 导出格式</a>)，那么您可以简单地按照下面“其他”部分的说明操作。不过，我们根据您的操作系统提供了将 PST 转换为 MBOX/EML 格式的链接：<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Windows 版 Zinkuba</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">Windows cygwin 版 readpst</a> – （例如 <code>readpst -u -o $OUT_DIR $IN_DIR</code>，将 <code>$OUT_DIR</code> 和 <code>$IN_DIR</code> 替换为输出目录和输入目录路径）。</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">Ubuntu/Linux 版 readpst</a> – （例如 <code>sudo apt-get install readpst</code>，然后 <code>readpst -u -o $OUT_DIR $IN_DIR</code>，将 <code>$OUT_DIR</code> 和 <code>$IN_DIR</code> 替换为输出目录和输入目录路径）。</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">macOS 版 readpst（通过 brew）</a> – （例如 <code>brew install libpst</code>，然后 <code>readpst -u -o $OUT_DIR $IN_DIR</code>，将 <code>$OUT_DIR</code> 和 <code>$IN_DIR</code> 替换为输出目录和输入目录路径）。</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">Windows 版 PST Converter（GitHub）</a></li></ul><br /></span></div> |
   | Apple Mail     | MBOX                                           | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail       | EML                                            | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail    | MBOX/EML                                       | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota       | EML                                            | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi          | EML                                            | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho           | EML                                            | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | 其他           | [使用 Thunderbird](https://www.thunderbird.net) | 在 Thunderbird 中设置您现有的电子邮件账户，然后使用 [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) 插件导出和导入您的电子邮件。**您也可以尝试简单地复制/粘贴或拖放电子邮件在账户之间。**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. 下载、安装并打开 [Thunderbird](https://www.thunderbird.net)。

3. 使用您的别名完整电子邮件地址（例如 <code><you@yourdomain.com></code>）和生成的密码创建新账户。  <strong>如果您还没有生成的密码，请<a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">参阅我们的设置说明</a></strong>。

4. 下载并安装 [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird 插件。

5. 在 Thunderbird 中创建一个新的本地文件夹，然后右键点击它 → 选择 `ImportExportTools NG` 选项 → 选择 `Import mbox file`（用于 MBOX 导出格式）– 或 – `Import messages` / `Import all messages from a directory`（用于 EML 导出格式）。

6. 将邮件从本地文件夹拖放到 Thunderbird 中您希望上传到我们服务的 IMAP 存储的新（或现有）IMAP 文件夹中。 这将确保它们通过我们的 SQLite 加密存储在线备份。

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       提示：
     </strong>
     <span>
       如果您对如何导入到 Thunderbird 感到困惑，可以参考官方说明：<a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> 和 <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>。
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要提示：
  </strong>
  <span>
    完成导出和导入过程后，您可能还想在现有电子邮件账户上启用转发，并设置自动回复，通知发件人您有了新的电子邮件地址（例如，如果您之前使用 Gmail，现在使用带有自定义域名的电子邮件）。
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

### 我如何使用自己的兼容 S3 存储进行备份 {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

付费计划用户可以针对每个域配置自己的 [S3](https://en.wikipedia.org/wiki/Amazon_S3) 兼容存储提供商，用于 IMAP/SQLite 备份。 这意味着您的加密邮箱备份可以存储在您自己的基础设施上，而不是（或除了）我们的默认存储。

支持的提供商包括 [Amazon S3](https://aws.amazon.com/s3/)、[Cloudflare R2](https://developers.cloudflare.com/r2/)、[MinIO](https://github.com/minio/minio)、[Backblaze B2](https://www.backblaze.com/cloud-storage)、[DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) 以及任何其他兼容 S3 的服务。

#### 设置 {#setup}

1. 在您的兼容 S3 提供商处创建一个**私有**桶。该桶不得公开访问。
2. 创建具有该桶读写权限的访问凭证（访问密钥 ID 和秘密访问密钥）。
3. 访问 <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 高级设置 <i class="fa fa-angle-right"></i> 自定义兼容 S3 存储。
4. 勾选 **“启用自定义兼容 S3 存储”**，填写您的端点 URL、访问密钥 ID、秘密访问密钥、区域和桶名称。
5. 点击 **“测试连接”** 以验证您的凭证、桶访问权限和写入权限。
6. 点击 **“保存”** 以应用设置。

#### 备份工作原理 {#how-backups-work}

每个连接的 IMAP 别名都会自动触发备份。IMAP 服务器每小时检查所有活动连接，并为每个连接的别名调度备份。基于 Redis 的锁机制防止在 30 分钟内重复运行备份，如果在过去 24 小时内已经成功完成备份，则实际备份会被跳过（除非用户明确请求下载备份）。
备份也可以通过点击仪表板中任何别名的 **“下载备份”** 手动触发。手动备份始终会运行，不受24小时窗口限制。

备份流程如下：

1. 使用 `VACUUM INTO` 复制 SQLite 数据库，该操作创建一个一致的快照，不会中断活动连接，并且保留数据库加密。
2. 通过打开备份文件验证加密仍然有效。
3. 计算 SHA-256 哈希并与存储中的现有备份进行比较。如果哈希匹配，则跳过上传（自上次备份后无更改）。
4. 通过 [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage) 库使用分段上传将备份上传到 S3。
5. 生成一个签名下载 URL（有效期4小时）并通过电子邮件发送给用户。

#### 备份格式 {#backup-formats}

支持三种备份格式：

| 格式     | 扩展名    | 描述                                                                        |
| -------- | --------- | --------------------------------------------------------------------------- |
| `sqlite` | `.sqlite` | 原始加密的 SQLite 数据库快照（自动 IMAP 备份的默认格式）                     |
| `mbox`   | `.zip`    | 包含 mbox 格式邮箱的密码保护 ZIP 文件                                       |
| `eml`    | `.zip`    | 包含每条邮件单独 `.eml` 文件的密码保护 ZIP 文件                            |

> **提示：** 如果您有 `.sqlite` 备份文件并想在本地将其转换为 `.eml` 文件，请使用我们的独立 CLI 工具 **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**。该工具支持 Windows、Linux 和 macOS，且不需要网络连接。

#### 文件命名和键结构 {#file-naming-and-key-structure}

使用 **自定义 S3 存储** 时，备份文件会以 [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) 时间戳前缀存储，以便每个备份作为单独对象保留。这为您在自己的存储桶中提供完整的备份历史。

键格式为：

```
{ISO 8601 时间戳}-{alias_id}.{扩展名}
```

例如：

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

`alias_id` 是别名的 MongoDB ObjectId。您可以在别名设置页面或通过 API 找到它。

使用 **默认（系统）存储** 时，键是扁平的（例如 `65a31c53c36b75ed685f3fda.sqlite`），每次备份都会覆盖之前的备份。

> **注意：** 由于自定义 S3 存储会保留所有备份版本，存储使用量会随时间增长。我们建议在您的存储桶上配置 [生命周期规则](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)，自动过期旧备份（例如删除超过30天或90天的对象）。

#### 数据所有权和删除政策 {#data-ownership-and-deletion-policy}

您的自定义 S3 存储桶完全由您控制。我们**绝不会删除或修改**您自定义 S3 存储桶中的文件——无论是删除别名、移除域名，还是任何清理操作。我们只会向您的存储桶写入新的备份文件。

这意味着：

* **别名删除** — 删除别名时，我们仅从默认系统存储中移除备份。之前写入您自定义 S3 存储桶的备份保持不变。
* **域名移除** — 移除域名不会影响您自定义存储桶中的文件。
* **保留管理** — 您负责管理自己存储桶中的存储，包括配置生命周期规则以过期旧备份。

如果您禁用自定义 S3 存储或切换回我们的默认存储，存储桶中的现有文件将被保留。未来的备份将直接写入我们的默认存储。

#### 安全性 {#security}

* 您的访问密钥 ID 和秘密访问密钥在存储到我们的数据库之前，使用 [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) 进行**静态加密**。仅在执行备份操作时运行时解密。
* 我们会自动验证您的存储桶**不对公众开放**。如果检测到公共存储桶，保存时配置将被拒绝。如果备份时检测到公共访问，我们会回退到默认存储，并通过电子邮件通知所有域管理员。
* 通过 [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html) 调用在保存时验证凭证，确保存储桶存在且凭证正确。如果验证失败，自定义 S3 存储将自动禁用。
* 每个备份文件在其 S3 元数据中包含 SHA-256 哈希，用于检测数据库是否未更改，从而跳过冗余上传。
#### 错误通知 {#error-notifications}

如果使用自定义 S3 存储备份失败（例如由于凭证过期或连接问题），所有域管理员将通过电子邮件收到通知。为了防止重复警报，这些通知的发送频率限制为每 6 小时一次。如果在备份时检测到您的存储桶公开可访问，管理员将每天收到一次通知。

#### API {#api}

您也可以通过 API 配置自定义 S3 存储：

```sh
curl -X PUT https://api.forwardemail.net/v1/domains/example.com \
  -u API_TOKEN: \
  -d has_custom_s3=true \
  -d s3_endpoint=https://s3.us-east-1.amazonaws.com \
  -d s3_access_key_id=YOUR_ACCESS_KEY_ID \
  -d s3_secret_access_key=YOUR_SECRET_ACCESS_KEY \
  -d s3_region=us-east-1 \
  -d s3_bucket=my-email-backups
```

通过 API 测试连接：

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### 如何将 SQLite 备份转换为 EML 文件 {#how-do-i-convert-sqlite-backups-to-eml-files}

如果您下载或存储 SQLite 备份（无论是来自我们的默认存储还是您自己的 [自定义 S3 存储桶](#how-do-i-use-my-own-s3-compatible-storage-for-backups)），您可以使用我们的独立 CLI 工具 **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)** 将其转换为标准的 `.eml` 文件。EML 文件可以用任何邮件客户端打开（如 [Thunderbird](https://www.thunderbird.net/)、[Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook)、[Apple Mail](https://support.apple.com/mail) 等），也可以导入到其他邮件服务器。

#### 安装 {#installation-1}

您可以下载预编译的二进制文件（无需安装 [Node.js](https://github.com/nodejs/node)）或直接使用 [Node.js](https://github.com/nodejs/node) 运行：

**预编译二进制文件** — 从 [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases) 下载适用于您平台的最新版本：

| 平台     | 架构          | 文件                                  |
| -------- | ------------- | ------------------------------------ |
| Linux    | x64           | `convert-sqlite-to-eml-linux-x64`    |
| Linux    | arm64         | `convert-sqlite-to-eml-linux-arm64`  |
| macOS    | Apple Silicon | `convert-sqlite-to-eml-darwin-arm64` |
| Windows  | x64           | `convert-sqlite-to-eml-win-x64.exe`  |

> **macOS 用户：** 下载后，您可能需要在运行二进制文件前移除隔离属性：
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> （将 `./convert-sqlite-to-eml-darwin-arm64` 替换为实际下载文件的路径。）

> **Linux 用户：** 下载后，您可能需要赋予二进制文件执行权限：
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> （将 `./convert-sqlite-to-eml-linux-x64` 替换为实际下载文件的路径。）

**从源码安装**（需要 [Node.js](https://github.com/nodejs/node) >= 18）：

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### 使用方法 {#usage}

该工具支持交互式和非交互式两种模式。

**交互式模式** — 不带参数运行，程序会提示输入所有信息：

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - 将 SQLite 备份转换为 EML
  =============================================

  SQLite 备份文件路径: /path/to/backup.sqlite
  IMAP/别名密码: ********
  输出 ZIP 路径 [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**非交互式模式** — 通过命令行参数传递，用于脚本和自动化：

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "your-imap-password" \
  --output /path/to/output.zip
```

| 参数                | 说明                                                                           |
| ------------------- | ------------------------------------------------------------------------------ |
| `--path <path>`     | 加密的 SQLite 备份文件路径                                                     |
| `--password <pass>` | 用于解密的 IMAP/别名密码                                                       |
| `--output <path>`   | ZIP 文件输出路径（默认：自动生成，包含 ISO 8601 时间戳）                       |
| `--help`            | 显示帮助信息                                                                   |
#### 输出格式 {#output-format}

该工具生成一个受密码保护的 ZIP 压缩包（AES-256 加密），包含：

```
README.txt
INBOX/
  <message-id-1>.eml
  <message-id-2>.eml
Sent/
  <message-id-3>.eml
Drafts/
  <message-id-4>.eml
```

EML 文件按邮箱文件夹组织。ZIP 密码与您的 IMAP/别名密码相同。每个 `.eml` 文件是一个标准的 [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) 邮件消息，包含完整的头部、正文文本和从 SQLite 数据库重建的附件。

#### 工作原理 {#how-it-works}

1. 使用您的 IMAP/别名密码打开加密的 SQLite 数据库（支持 [ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) 和 [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) 加密算法）。
2. 读取 Mailboxes 表以发现文件夹结构。
3. 对每条消息，从 Messages 表中解码以 [Brotli](https://github.com/google/brotli) 压缩的 JSON 格式存储的 mimeTree。
4. 通过遍历 MIME 树并从 Attachments 表中获取附件内容，重建完整的 EML 文件。
5. 使用 [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted) 将所有内容打包成受密码保护的 ZIP 压缩包。

### 是否支持自托管 {#do-you-support-self-hosting}

是的，截至 2025 年 3 月，我们支持自托管选项。请阅读博客 [这里](https://forwardemail.net/blog/docs/self-hosted-solution)。查看 [自托管指南](https://forwardemail.net/self-hosted) 以开始使用。对于想要更详细分步骤版本的用户，请参阅我们的 [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) 或 [Debian](https://forwardemail.net/guides/selfhosted-on-debian) 基础指南。

## 邮件配置 {#email-configuration}

### 如何开始并设置邮件转发 {#how-do-i-get-started-and-set-up-email-forwarding}

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
    请仔细阅读并按照下面列出的第一步到第八步操作。确保将 <code>user@gmail.com</code> 替换为您想要转发邮件的邮箱地址（如果尚未正确）。同样，确保将 <code>example.com</code> 替换为您的自定义域名（如果尚未正确）。
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">如果您已经在某处注册了域名，则必须完全跳过此步骤，直接进入第二步！否则，您可以<a href="/domain-registration" rel="noopener noreferrer">点击这里注册您的域名</a>。</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  您还记得您的域名注册商吗？一旦记起，请按照以下说明操作：

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要提示：
  </strong>
  <span>
    您必须打开一个新标签页并登录您的域名注册商。您可以轻松点击下面的“注册商”链接自动完成此操作。在新标签页中，您必须导航到注册商的 DNS 管理页面——我们在“配置步骤”列中提供了逐步导航说明。导航到该页面后，您可以返回此标签页并继续执行下面的第三步。
    <strong class="font-weight-bold">请勿关闭已打开的标签页；您后续步骤还需要用到它！</strong>
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
      <td>登录 <i class="fa fa-angle-right"></i> 域名中心 <i class="fa fa-angle-right"></i> （选择您的域名） <i class="fa fa-angle-right"></i> 编辑 DNS 设置</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>登录 <i class="fa fa-angle-right"></i> 托管区域 <i class="fa fa-angle-right"></i> （选择您的域名）</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>登录 <i class="fa fa-angle-right"></i> 我的服务器 <i class="fa fa-angle-right"></i> 域名管理 <i class="fa fa-angle-right"></i> DNS 管理器</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>ROCK 版本：登录 <i class="fa fa-angle-right"></i> 域名 <i class="fa fa-angle-right"></i> （点击管理旁的 ▼ 图标） <i class="fa fa-angle-right"></i> DNS
      <br />
      传统版本：登录 <i class="fa fa-angle-right"></i> 域名 <i class="fa fa-angle-right"></i> 区域编辑器 <i class="fa fa-angle-right"></i> （选择您的域名）</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>登录 <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>登录 <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> （选择您的域名）</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>登录 <i class="fa fa-angle-right"></i> （选择您的域名） <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> 管理</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>登录 <i class="fa fa-angle-right"></i> 网络 <i class="fa fa-angle-right"></i> 域名 <i class="fa fa-angle-right"></i> （选择您的域名） <i class="fa fa-angle-right"></i> 更多 <i class="fa fa-angle-right"></i> 管理域名</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>登录 <i class="fa fa-angle-right"></i> 卡片视图中点击管理您的域名 <i class="fa fa-angle-right"></i> 列表视图中点击齿轮图标 <i class="fa fa-angle-right"></i> DNS 和名称服务器 <i class="fa fa-angle-right"></i> DNS 记录</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> 观看</a>
      </td>
      <td>登录 <i class="fa fa-angle-right"></i> （选择您的域名） <i class="fa fa-angle-right"></i> 管理 <i class="fa fa-angle-right"></i> （点击齿轮图标） <i class="fa fa-angle-right"></i> 点击左侧菜单中的 DNS &amp; 名称服务器</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>登录 <i class="fa fa-angle-right"></i> 面板 <i class="fa fa-angle-right"></i> 域名 <i class="fa fa-angle-right"></i> 管理域名 <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>登录 <i class="fa fa-angle-right"></i> 概览 <i class="fa fa-angle-right"></i> 管理 <i class="fa fa-angle-right"></i> 简易编辑器 <i class="fa fa-angle-right"></i> 记录</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>登录 <i class="fa fa-angle-right"></i> （选择您的域名） <i class="fa fa-angle-right"></i> 管理 <i class="fa fa-angle-right"></i> 编辑区域</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> 观看</a>
      </td>
      <td>登录 <i class="fa fa-angle-right"></i> 管理我的域名 <i class="fa fa-angle-right"></i> （选择您的域名） <i class="fa fa-angle-right"></i> 管理 DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> 观看</a>
      </td>
      <td>登录 <i class="fa fa-angle-right"></i> （选择您的域名） <i class="fa fa-angle-right"></i> 配置 DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> 观看</a>
      </td>
      <td>登录 <i class="fa fa-angle-right"></i> 域名列表 <i class="fa fa-angle-right"></i> （选择您的域名） <i class="fa fa-angle-right"></i> 管理 <i class="fa fa-angle-right"></i> 高级 DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>登录 <i class="fa fa-angle-right"></i> （选择您的域名） <i class="fa fa-angle-right"></i> 设置 Netlify DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>登录 <i class="fa fa-angle-right"></i> 账户管理 <i class="fa fa-angle-right"></i> 我的域名 <i class="fa fa-angle-right"></i> （选择您的域名） <i class="fa fa-angle-right"></i> 管理 <i class="fa fa-angle-right"></i> 更改域名指向 <i class="fa fa-angle-right"></i> 高级 DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> 观看</a>
      </td>
      <td>登录 <i class="fa fa-angle-right"></i> 管理域名 <i class="fa fa-angle-right"></i> （选择您的域名） <i class="fa fa-angle-right"></i> DNS 设置</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>登录 <i class="fa fa-angle-right"></i> 首页菜单 <i class="fa fa-angle-right"></i> 设置 <i class="fa fa-angle-right"></i> 域名 <i class="fa fa-angle-right"></i> （选择您的域名） <i class="fa fa-angle-right"></i>
高级设置 <i class="fa fa-angle-right"></i> 自定义记录</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel 的 Now</a></td>
      <td>使用 "now" CLI <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>登录 <i class="fa fa-angle-right"></i> 域名页面 <i class="fa fa-angle-right"></i> （选择您的域名） <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>登录 <i class="fa fa-angle-right"></i> 域名页面 <i class="fa fa-angle-right"></i> （点击 <i class="fa fa-ellipsis-h"></i> 图标） <i class="fa fa-angle-right"></i> 选择管理 DNS 记录</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>登录 <i class="fa fa-angle-right"></i> 域名 <i class="fa fa-angle-right"></i> 我的域名</td>
    </tr>
    <tr>
      <td>其他</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">重要：</strong> 没有看到您的注册商名称？只需在网上搜索“如何更改 $REGISTRAR 的 DNS 记录”（将 $REGISTRAR 替换为您的注册商名称，例如如果您使用 GoDaddy，则搜索“如何更改 GoDaddy 的 DNS 记录”）。</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">使用您注册商的 DNS 管理页面（您打开的另一个标签页），设置以下“MX”记录：
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要提示：
  </strong>
  <span>
    请注意，不应设置其他 MX 记录。下面显示的两个记录必须同时存在。确保没有拼写错误，并且 mx1 和 mx2 拼写正确。如果之前已经存在 MX 记录，请将其完全删除。
    “TTL”值不必是 3600，如果需要，可以设置为更低或更高的值。
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名称/主机/别名</th>
      <th class="text-center">TTL</th>
      <th>类型</th>
      <th>优先级</th>
      <th>答案/值</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx1.forwardemail.net</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx2.forwardemail.net</code></td>
    </tr>
  </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">使用您的注册商的 DNS 管理页面（您打开的另一个标签页），设置以下 <strong class="notranslate">TXT</strong> 记录：

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要提示：
  </strong>
  <span>
    如果您使用的是付费计划，则必须完全跳过此步骤，直接进入第五步！如果您不是付费计划用户，则您的转发地址将公开可搜索 – 请前往 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户 <i class="fa fa-angle-right"></i> 域名</a> 并根据需要将您的域名升级为付费计划。如果您想了解更多关于付费计划的信息，请参阅我们的 <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">价格</a> 页面。否则，您可以继续从下面列出的选项 A 到选项 F 中选择一个或多个组合。
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    选项 A：
  </strong>
  <span>
    如果您要将域名的所有邮件（例如 "all@example.com"、"hello@example.com" 等）转发到特定地址 "user@gmail.com"：
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
      <td><em>"@", ".", 或空白</em></td>
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
    请确保将上面“值”列中的内容替换为您自己的电子邮件地址。“TTL”值不必是 3600，如果需要，可以设置为更低或更高的值。较低的生存时间（“TTL”）值将确保您对 DNS 记录所做的任何未来更改能更快地传播到互联网——可以将其视为缓存的内存时间（秒）。您可以在 <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">维基百科上的 TTL 介绍</a> 了解更多信息。
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    选项 B：
  </strong>
  <span>
    如果您只需要转发单个电子邮件地址（例如 <code>hello@example.com</code> 到 <code>user@gmail.com</code>；这也会自动将 "hello+test@example.com" 转发到 "user+test@gmail.com"）：
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
      <td><em>"@", ".", 或空白</em></td>
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
    选项 C:
  </strong>
  <span>
    如果您要转发多个邮箱，则需要用逗号分隔它们：
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
      <td><em>"@", ".", 或空白</em></td>
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
    选项 D:
  </strong>
  <span>
    您可以设置无限数量的转发邮箱——只需确保单行不超过 255 个字符，并且每行都以 "forward-email=" 开头。下面提供了一个示例：
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
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", 或空白</em></td>
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
    选项 E:
  </strong>
  <span>
    您还可以在您的 <strong class="notranslate">TXT</strong> 记录中指定一个域名，以实现全局别名转发（例如 "user@example.com" 将被转发到 "user@example.net"）：
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
      <td><em>"@", ".", 或空白</em></td>
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
    选项 F:
  </strong>
  <span>
    您甚至可以使用 webhook 作为全局或单个别名来转发邮件。请参阅下面标题为 <a href="#do-you-support-webhooks" class="alert-link">您支持 webhook 吗</a> 的示例和完整章节。
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
      <td><em>"@", ".", 或空白</em></td>
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
    选项 G:
  </strong>
  <span>
    您甚至可以使用正则表达式（"regex"）来匹配别名并处理转发邮件的替换。请参阅下面标题为 <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">您支持正则表达式或 regex 吗</a> 的示例和完整章节。
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>需要带替换的高级正则表达式？</strong> 请参阅下面标题为 <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">您支持正则表达式或 regex 吗</a> 的示例和完整章节。
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>简单示例：</strong> 如果我想将所有发送到 `linus@example.com` 或 `torvalds@example.com` 的邮件转发到 `user@gmail.com`：
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
      <td><em>"@", ".", 或空白</em></td>
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
    重要：
  </strong>
  <span>
    通配符转发规则也可以描述为“穿透”。
    这意味着匹配至少一个特定转发规则的来信将优先使用，而不是通配符规则。
    特定规则包括电子邮件地址和正则表达式。
    <br /><br />
    例如：
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    使用此配置，发送到 <code>hello@example.com</code> 的邮件 **不会** 被转发到 <code>second@gmail.com</code>（通配符），而只会投递到 <code>first@gmail.com</code>。
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">使用您的注册商的 DNS 管理页面（您打开的另一个标签页），另外设置以下 <strong class="notranslate">TXT</strong> 记录：

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
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要：
  </strong>
  <span>
    如果您使用 Gmail（例如“发送邮件为”）或 G Suite，则需要在上述值后追加 <code>include:_spf.google.com</code>，例如：
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
    如果您已有类似包含 "v=spf1" 的记录，则需要在同一行中任何现有的 "include:host.com" 记录之前、"-all" 之前追加 <code>include:spf.forwardemail.net</code>，例如：
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    注意 "-all" 和 "~all" 之间的区别。"-" 表示如果不匹配则 SPF 检查失败，"~" 表示 SPF 检查软失败。我们建议使用 "-all" 以防止域名伪造。
    <br /><br />
    您可能还需要包含您发送邮件所用主机的 SPF 记录（例如 Outlook）。
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">使用我们位于 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 设置中的“验证记录”工具来验证您的 DNS 记录。

</li><li class="mb-2 mb-md-3 mb-lg-5">发送测试邮件以确认其是否正常工作。请注意，您的 DNS 记录可能需要一些时间才能传播。

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    提示：
  </strong>
  <span>
  </span>
    如果您没有收到测试邮件，或者收到的测试邮件显示“请小心此邮件”，请参阅<a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">为什么我没有收到测试邮件</a>和<a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">为什么我发送到自己 Gmail 的测试邮件显示为“可疑”</a>的解答。
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">如果您希望在 Gmail 中“以此身份发送邮件”，则需要<strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">观看此视频</a></strong>，或按照下面<a href="#how-to-send-mail-as-using-gmail">如何使用 Gmail 发送邮件</a>中的步骤操作。

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
    以下列出了可选的附加功能。请注意，这些附加功能完全是可选的，可能并非必需。我们至少希望在必要时为您提供额外的信息。
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    可选附加功能：
  </strong>
  <span>
    如果您正在使用<a class="alert-link" href="#how-to-send-mail-as-using-gmail">如何使用 Gmail 发送邮件</a>功能，您可能希望将自己添加到允许列表。请参阅<a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">Gmail 关于此主题的说明</a>。
  </span>
</div>

### 我可以为高级转发使用多个 MX 交换机和服务器吗 {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

可以，但**您的 DNS 记录中应只列出一个 MX 交换机**。

不要尝试使用“优先级”来配置多个 MX 交换机。

相反，您需要配置现有的 MX 交换机，将所有不匹配的别名邮件转发到我们的服务交换机（`mx1.forwardemail.net` 和/或 `mx2.forwardemail.net`）。

如果您使用的是 Google Workspace 并希望将所有不匹配的别名转发到我们的服务，请参阅 <https://support.google.com/a/answer/6297084>。

如果您使用的是 Microsoft 365（Outlook）并希望将所有不匹配的别名转发到我们的服务，请参阅 <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> 和 <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>。

### 如何设置假期自动回复（离开办公室自动回复） {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

前往 <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 别名，创建或编辑您想要配置假期自动回复的别名。
您可以配置开始日期、结束日期、主题和消息，并随时启用或禁用：

* 目前支持纯文本主题和消息（我们内部使用 `striptags` 包来移除任何 HTML）。
* 主题限制为 100 个字符。
* 消息限制为 1000 个字符。
* 设置需要出站 SMTP 配置（例如，您需要设置 DKIM、DMARC 和 Return-Path DNS 记录）。
  * 访问 <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 设置 <i class="fa fa-angle-right"></i> 出站 SMTP 配置并按照设置说明操作。
* 不能在全局自定义域名上启用假期自动回复（例如，不支持[一次性地址](/disposable-addresses)）。
* 不能为带有通配符/捕获所有 (`*`) 或正则表达式的别名启用假期自动回复。

与使用 `sieve` 假期过滤扩展的 `postfix` 等邮件系统不同——Forward Email 会自动添加您的 DKIM 签名，防止因连接问题导致假期回复发送失败（例如常见的 SSL/TLS 连接问题和维护中的旧服务器），甚至支持假期回复的 Open WKD 和 PGP 加密。

<!--
* 为防止滥用，每发送一条假期自动回复消息将扣除 1 个出站 SMTP 积分。
  * 所有付费账户默认每天包含 300 个积分。如果您需要更多，请联系我们。
-->

1. 我们每 4 天只向每个[允许列表](#do-you-have-an-allowlist)发件人发送一次。

   * 我们的 Redis 缓存使用 `alias_id` 和 `sender` 的指纹，其中 `alias_id` 是别名的 MongoDB ID，`sender` 是发件人地址中的 From 地址（如果在允许列表中）或 From 地址中的根域（如果不在允许列表中）。为简化起见，该指纹在缓存中的过期时间设置为 4 天。

   * 我们对非允许列表发件人使用 From 地址中解析出的根域的方法，防止相对不知名的发件人（例如恶意行为者）滥发假期自动回复消息。

2. 仅当 MAIL FROM 和/或 From 不为空且不包含（不区分大小写）[postmaster 用户名](#what-are-postmaster-addresses)（电子邮件中 @ 前的部分）时才发送。

3. 如果原始邮件包含以下任一头部（不区分大小写），则不发送：

   * `auto-submitted` 头部且值不等于 `no`。
   * `x-auto-response-suppress` 头部且值为 `dr`、`autoreply`、`auto-reply`、`auto_reply` 或 `all`。
   * `list-id`、`list-subscribe`、`list-unsubscribe`、`list-help`、`list-post`、`list-owner`、`list-archive`、`x-autoreply`、`x-autorespond` 或 `x-auto-respond` 头部（无论值为何）。
   * `precedence` 头部且值为 `bulk`、`autoreply`、`auto-reply`、`auto_reply` 或 `list`。

4. 如果 MAIL FROM 或 From 邮箱地址以 `+donotreply`、`-donotreply`、`+noreply` 或 `-noreply` 结尾，则不发送。

5. 如果 From 邮箱地址用户名部分为 `mdaemon` 且存在不区分大小写的 `X-MDDSN-Message` 头部，则不发送。

6. 如果存在不区分大小写的 `content-type` 头部且值为 `multipart/report`，则不发送。

### 如何为 Forward Email 设置 SPF {#how-do-i-set-up-spf-for-forward-email}

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
      <td><em>"@", ".", 或留空</em></td>
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
    如果您使用 Gmail（例如“以此身份发送邮件”）或 G Suite，则需要在上述值后追加 <code>include:_spf.google.com</code>，例如：
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
    如果您使用的是 Microsoft Outlook 或 Live.com，您需要在 SPF <strong class="notranslate">TXT</strong> 记录中追加 <code>include:spf.protection.outlook.com</code>，例如：
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    小贴士：
  </strong>
  <span>
    如果您已有类似包含 "v=spf1" 的记录，则需要在任何现有的 "include:host.com" 记录之前以及同一行的 "-all" 之前追加 <code>include:spf.forwardemail.net</code>，例如：
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    请注意 "-all" 和 "~all" 之间的区别。"-" 表示如果不匹配则 SPF 检查应失败，"~" 表示 SPF 检查应软失败。我们建议使用 "-all" 以防止域名伪造。
    <br /><br />
    您可能还需要包含您发送邮件所用主机的 SPF 记录（例如 Outlook）。
  </span>
</div>

### 我如何为 Forward Email 设置 DKIM {#how-do-i-set-up-dkim-for-forward-email}

前往 <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 设置 <i class="fa fa-angle-right"></i> 出站 SMTP 配置 并按照设置说明操作。

### 我如何为 Forward Email 设置 DMARC {#how-do-i-set-up-dmarc-for-forward-email}

前往 <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 设置 <i class="fa fa-angle-right"></i> 出站 SMTP 配置 并按照设置说明操作。

### 我如何查看 DMARC 报告 {#how-do-i-view-dmarc-reports}

Forward Email 提供了一个全面的 DMARC 报告仪表盘，允许您从单一界面监控所有域的邮件身份验证表现。

**什么是 DMARC 报告？**

DMARC（基于域的消息身份验证、报告和一致性）报告是接收邮件服务器发送的 XML 文件，告诉您邮件的身份验证情况。这些报告帮助您了解：

* 有多少邮件是从您的域发送的
* 这些邮件是否通过了 SPF 和 DKIM 身份验证
* 接收服务器采取了哪些操作（接受、隔离或拒绝）
* 哪些 IP 地址代表您的域发送邮件

**如何访问 DMARC 报告**

前往 <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> DMARC 报告</a> 查看您的仪表盘。您也可以通过 <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> 域名</a> 点击任一域名旁的 “DMARC” 按钮访问特定域的报告。

**仪表盘功能**

DMARC 报告仪表盘提供：

* **摘要指标**：收到的报告总数、分析的邮件总数、SPF 对齐率、DKIM 对齐率及整体通过率
* **邮件量随时间变化图表**：过去 30 天邮件量和身份验证率的趋势可视化
* **对齐摘要**：显示 SPF 与 DKIM 对齐分布的环形图
* **邮件处理情况**：堆叠条形图显示接收服务器如何处理您的邮件（接受、隔离或拒绝）
* **最近报告表**：带有筛选和分页功能的单个 DMARC 报告详细列表
* **域名筛选**：管理多个域时可按特定域筛选报告
**为什么这很重要**

对于管理多个域的组织（如企业、非营利组织或代理机构），DMARC 报告对于：

* **识别未经授权的发送者**：检测是否有人伪造您的域名
* **提高投递率**：确保您的合法邮件通过身份验证
* **监控邮件基础设施**：跟踪哪些服务和 IP 代表您发送邮件
* **合规性**：保持对邮件身份验证的可见性以进行安全审计

与其他需要单独 DMARC 监控工具的服务不同，Forward Email 将 DMARC 报告处理和可视化作为您账户的一部分，且无需额外费用。

**要求**

* DMARC 报告仅适用于付费计划
* 您的域必须配置了 DMARC（请参见 [如何为 Forward Email 设置 DMARC](#how-do-i-set-up-dmarc-for-forward-email)）
* 当接收邮件服务器将报告发送到您配置的 DMARC 报告地址时，报告会自动收集

**每周邮件报告**

付费计划用户会自动通过电子邮件收到每周 DMARC 报告摘要。这些邮件包括：

* 您所有域的摘要统计
* SPF 和 DKIM 对齐率
* 邮件处理结果细分（接受、隔离、拒绝）
* 主要报告组织（Google、Microsoft、Yahoo 等）
* 可能需要关注的对齐问题 IP 地址
* 直接链接到您的 DMARC 报告仪表板

每周报告会自动发送，无法单独关闭，必须与其他邮件通知一起管理。

### 如何连接和配置我的联系人 {#how-do-i-connect-and-configure-my-contacts}

**配置联系人时，请使用 CardDAV URL：** `https://carddav.forwardemail.net`（如果您的客户端允许，也可以直接使用 `carddav.forwardemail.net`）

### 如何连接和配置我的日历 {#how-do-i-connect-and-configure-my-calendars}

**配置日历时，请使用 CalDAV URL：** `https://caldav.forwardemail.net`（如果您的客户端允许，也可以直接使用 `caldav.forwardemail.net`）

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Example Setup" />

### 如何添加更多日历及管理现有日历 {#how-do-i-add-more-calendars-and-manage-existing-calendars}

如果您想添加额外的日历，只需添加新的日历 URL：`https://caldav.forwardemail.net/dav/principals/calendar-name`（**请务必将 `calendar-name` 替换为您想要的日历名称**）

创建后，您可以通过您喜欢的日历应用（例如 Apple Mail 或 [Thunderbird](https://thunderbird.net)）更改日历名称和颜色。

### 如何连接和配置任务和提醒 {#how-do-i-connect-and-configure-tasks-and-reminders}

**配置任务和提醒时，请使用与日历相同的 CalDAV URL：** `https://caldav.forwardemail.net`（如果您的客户端允许，也可以直接使用 `caldav.forwardemail.net`）

任务和提醒会自动从日历事件中分离，形成独立的“提醒”或“任务”日历集合。

**各平台设置说明：**

**macOS/iOS：**

1. 在系统偏好设置 > 互联网账户（iOS 上为设置 > 账户）中添加新的 CalDAV 账户
2. 服务器填写 `caldav.forwardemail.net`
3. 输入您的 Forward Email 别名和生成的密码
4. 设置完成后，您会看到“日历”和“提醒”两个集合
5. 使用提醒应用创建和管理任务

**Android 使用 Tasks.org：**

1. 从 Google Play 商店或 F-Droid 安装 Tasks.org
2. 进入设置 > 同步 > 添加账户 > CalDAV
3. 服务器填写：`https://caldav.forwardemail.net`
4. 输入您的 Forward Email 别名和生成的密码
5. Tasks.org 会自动发现您的任务日历

**Thunderbird：**

1. 如果未安装，请安装 Lightning 插件
2. 创建一个类型为“CalDAV”的新日历
3. 使用 URL：`https://caldav.forwardemail.net`
4. 输入您的 Forward Email 凭据
5. 日历界面中将同时显示事件和任务

### 为什么我无法在 macOS 提醒中创建任务 {#why-cant-i-create-tasks-in-macos-reminders}
如果您在 macOS 提醒事项中创建任务时遇到问题，请尝试以下故障排除步骤：

1. **检查账户设置**：确保您的 CalDAV 账户已正确配置为 `caldav.forwardemail.net`

2. **验证独立日历**：您应该在账户中看到“日历”和“提醒事项”两个选项。如果只看到“日历”，则任务支持可能尚未完全激活。

3. **刷新账户**：尝试在系统偏好设置 > 互联网账户中删除并重新添加您的 CalDAV 账户

4. **检查服务器连接**：测试您是否可以在浏览器中访问 `https://caldav.forwardemail.net`

5. **验证凭据**：确保您使用的是正确的别名邮箱和生成的密码（不是您的账户密码）

6. **强制同步**：在提醒事项应用中，尝试创建一个任务，然后手动刷新同步

**常见问题：**

* **“未找到提醒事项日历”**：服务器可能需要一些时间在首次访问时创建提醒事项集合
* **任务不同步**：检查两个设备是否使用相同的 CalDAV 账户凭据
* **内容混合**：确保任务是在“提醒事项”日历中创建，而不是一般的“日历”中

### 如何在 Android 上设置 Tasks.org {#how-do-i-set-up-tasksorg-on-android}

Tasks.org 是一个流行的开源任务管理器，与 Forward Email 的 CalDAV 任务支持配合良好。

**安装和设置：**

1. **安装 Tasks.org**：
   * 从 Google Play 商店：[Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * 从 F-Droid：[F-Droid 上的 Tasks.org](https://f-droid.org/packages/org.tasks/)

2. **配置 CalDAV 同步**：
   * 打开 Tasks.org
   * 进入 ☰ 菜单 > 设置 > 同步
   * 点击“添加账户”
   * 选择“CalDAV”

3. **输入 Forward Email 设置**：
   * **服务器 URL**：`https://caldav.forwardemail.net`
   * **用户名**：您的 Forward Email 别名（例如 `you@yourdomain.com`）
   * **密码**：您的别名专用生成密码
   * 点击“添加账户”

4. **账户发现**：
   * Tasks.org 会自动发现您的任务日历
   * 您应该能看到“提醒事项”集合
   * 点击“订阅”以启用任务日历同步

5. **测试同步**：
   * 在 Tasks.org 中创建测试任务
   * 检查它是否出现在其他 CalDAV 客户端（如 macOS 提醒事项）中
   * 验证更改是否双向同步

**可用功能：**

* ✅ 任务创建和编辑
* ✅ 截止日期和提醒
* ✅ 任务完成和状态
* ✅ 优先级等级
* ✅ 子任务和任务层级
* ✅ 标签和分类
* ✅ 与其他 CalDAV 客户端的双向同步

**故障排除：**

* 如果没有任务日历出现，尝试在 Tasks.org 设置中手动刷新
* 确保服务器上至少创建了一个任务（您可以先在 macOS 提醒事项中创建一个）
* 检查与 `caldav.forwardemail.net` 的网络连接

### 如何为 Forward Email 设置 SRS {#how-do-i-set-up-srs-for-forward-email}

我们会自动配置 [发件人重写方案](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme)（“SRS”）——您无需自行操作。

### 如何为 Forward Email 设置 MTA-STS {#how-do-i-set-up-mta-sts-for-forward-email}

请参阅[我们关于 MTA-STS 的章节](#do-you-support-mta-sts)以获取更多信息。

### 如何为我的邮箱地址添加头像 {#how-do-i-add-a-profile-picture-to-my-email-address}

如果您使用 Gmail，请按照以下步骤操作：

1. 访问 <https://google.com> 并退出所有邮箱账户
2. 点击“登录”，在下拉菜单中点击“其他账户”
3. 选择“使用其他账户”
4. 选择“创建账户”
5. 选择“改用我当前的邮箱地址”
6. 输入您的自定义域名邮箱地址
7. 获取发送到您邮箱的验证邮件
8. 输入该邮件中的验证码
9. 完成新 Google 账户的个人资料信息
10. 同意所有隐私和使用条款政策
11. 访问 <https://google.com>，点击右上角的头像图标，然后点击“更改”按钮
12. 上传新的照片或头像
13. 更改大约需要 1-2 小时生效，有时可能非常快
14. 发送测试邮件，头像应会显示。
## 高级功能 {#advanced-features}

### 您支持用于营销相关邮件的新闻通讯或邮件列表吗 {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

是的，您可以在 <https://forwardemail.net/guides/newsletter-with-listmonk> 阅读更多内容。

请注意，为了维护 IP 声誉并确保邮件送达，Forward Email 对每个域名的**新闻通讯审批**实行人工审核流程。请发送邮件至 <support@forwardemail.net> 或提交 [帮助请求](https://forwardemail.net/help) 以获得审批。此过程通常少于 24 小时，大多数请求会在 1-2 小时内得到处理。未来我们计划通过额外的垃圾邮件控制和警报，使此流程即时完成。此流程确保您的邮件能够到达收件箱，且您的消息不会被标记为垃圾邮件。

### 您支持通过 API 发送邮件吗 {#do-you-support-sending-email-with-api}

是的，自 2023 年 5 月起，我们支持作为所有付费用户的附加功能通过 API 发送邮件。

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要提示：
  </strong>
  <span>
    请确保您已阅读我们的<a href="/terms" class="alert-link" target="_blank">服务条款</a>、<a href="/privacy" class="alert-link" target="_blank">隐私政策</a>和<a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">外发 SMTP 限制</a> —— 您的使用即视为确认并同意。
  </span>
</div>

请查看我们 API 文档中关于[邮件](/email-api#outbound-emails)的章节，了解选项、示例及更多信息。

要通过我们的 API 发送外发邮件，您必须使用在[我的安全](/my-account/security)中可用的 API 令牌。

### 您支持通过 IMAP 接收邮件吗 {#do-you-support-receiving-email-with-imap}

是的，自 2023 年 10 月 16 日起，我们支持作为所有付费用户的附加功能通过 IMAP 接收邮件。**请阅读我们关于[加密 SQLite 邮箱存储功能工作原理](/blog/docs/best-quantum-safe-encrypted-email-service)的深度文章**。

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要提示：
  </strong>
  <span>
    请确保您已阅读我们的<a href="/terms" class="alert-link" target="_blank">服务条款</a>和<a href="/privacy" class="alert-link" target="_blank">隐私政策</a> —— 您的使用即视为确认并同意。
  </span>
</div>

1. 在 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 别名 下为您的域名创建一个新的别名（例如 <code><hello@example.com></code>）

2. 点击新创建别名旁的 <strong class="text-success"><i class="fa fa-key"></i> 生成密码</strong>。复制到剪贴板并安全保存屏幕上显示的生成密码。

3. 使用您喜欢的邮件应用，添加或配置一个使用您新创建别名的账户（例如 <code><hello@example.com></code>）
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       小贴士：
     </strong>
     <span>我们推荐使用 <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>、<a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>、<a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>，或<a href="/blog/open-source" class="alert-link" target="_blank">开源且注重隐私的替代方案</a>。</span>
   </div>

4. 当系统提示输入 IMAP 服务器名称时，填写 `imap.forwardemail.net`

5. 当系统提示输入 IMAP 服务器端口时，填写 `993`（SSL/TLS）—— 如有需要，请参阅[备用 IMAP 端口](/faq#what-are-your-imap-server-configuration-settings)
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       小贴士：
     </strong>
     <span>如果您使用 Thunderbird，请确保“连接安全性”设置为“SSL/TLS”，认证方法设置为“普通密码”。</span>
   </div>
6. 当系统提示输入 IMAP 服务器密码时，请粘贴上面第 2 步中 <strong class="text-success"><i class="fa fa-key"></i> 生成密码</strong> 中的密码

7. **保存您的设置** – 如果遇到问题，请 <a href="/help">联系我们</a>

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

### 您支持 POP3 吗 {#do-you-support-pop3}

是的，自 2023 年 12 月 4 日起，我们为所有付费用户提供 [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) 作为附加功能。**请阅读我们深入的文章**，了解[我们的加密 SQLite 邮箱存储功能如何工作](/blog/docs/best-quantum-safe-encrypted-email-service)。

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要提示：
  </strong>
  <span>
    请确保您已阅读我们的 <a href="/terms" class="alert-link" target="_blank">条款</a> 和 <a href="/privacy" class="alert-link" target="_blank">隐私政策</a> – 您的使用即视为认可和同意。
  </span>
</div>

1. 在 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 别名 下为您的域名创建一个新的别名（例如 <code><hello@example.com></code>）

2. 点击新创建别名旁边的 <strong class="text-success"><i class="fa fa-key"></i> 生成密码</strong>。复制到剪贴板并安全保存屏幕上显示的生成密码。

3. 使用您喜欢的邮件应用，添加或配置一个使用新创建别名的账户（例如 <code><hello@example.com></code>）
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       提示：
     </strong>
     <span>我们推荐使用 <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>、<a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird 移动版</a>、<a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>，或 <a href="/blog/open-source" class="alert-link" target="_blank">开源且注重隐私的替代方案</a>。</span>
   </div>

4. 当系统提示输入 POP3 服务器名称时，填写 `pop3.forwardemail.net`

5. 当系统提示输入 POP3 服务器端口时，填写 `995`（SSL/TLS）– 如有需要，请参阅[备用 POP3 端口](/faq#what-are-your-pop3-server-configuration-settings)
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       提示：
     </strong>
     <span>如果您使用 Thunderbird，请确保“连接安全性”设置为“SSL/TLS”，认证方法设置为“普通密码”。</span>
   </div>

6. 当系统提示输入 POP3 服务器密码时，请粘贴上面第 2 步中 <strong class="text-success"><i class="fa fa-key"></i> 生成密码</strong> 中的密码

7. **保存您的设置** – 如果遇到问题，请 <a href="/help">联系我们</a>

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

### 您支持日历（CalDAV）吗 {#do-you-support-calendars-caldav}

是的，自 2024 年 2 月 5 日起我们已添加此功能。我们的服务器是 `caldav.forwardemail.net`，并且在我们的 <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">状态页面</a> 上进行监控。
它支持 IPv4 和 IPv6，并且通过端口 `443`（HTTPS）提供服务。

| 登录名   | 示例                       | 说明                                                                                                                                                                                     |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 用户名   | `user@example.com`         | 在 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> 域名</a> 中存在的别名的电子邮件地址。                                                                                   |
| 密码     | `************************` | 别名专用生成的密码。                                                                                                                                                                      |

为了使用日历支持，**用户**必须是 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> 域名</a> 中存在的别名的电子邮件地址——且**密码**必须是别名专用生成的密码。

### 你们支持任务和提醒（CalDAV VTODO）吗？ {#do-you-support-tasks-and-reminders-caldav-vtodo}

是的，自 2025 年 10 月 14 日起，我们已添加对任务和提醒的 CalDAV VTODO 支持。该服务使用与我们的日历支持相同的服务器：`caldav.forwardemail.net`。

我们的 CalDAV 服务器支持使用 **统一日历** 的日历事件（VEVENT）和任务（VTODO）组件。这意味着每个日历都可以包含事件和任务，提供最大灵活性和所有 CalDAV 客户端的兼容性。

**日历和列表的工作方式：**

* **每个日历支持事件和任务** - 你可以向任何日历添加事件、任务或两者
* **Apple 提醒事项列表** - 你在 Apple 提醒事项中创建的每个列表都会成为服务器上的一个独立日历
* **多个日历** - 你可以创建任意数量的日历，每个日历都有自己的名称、颜色和组织方式
* **跨客户端同步** - 任务和事件在所有兼容客户端之间无缝同步

**支持的任务客户端：**

* **macOS 提醒事项** - 完全原生支持任务创建、编辑、完成和同步
* **iOS 提醒事项** - 在所有 iOS 设备上完全原生支持
* **Tasks.org（Android）** - 流行的开源任务管理器，支持 CalDAV 同步
* **Thunderbird** - 桌面邮件客户端中的任务和日历支持
* **任何支持 CalDAV 的任务管理器** - 标准 VTODO 组件支持

**支持的任务功能：**

* 任务创建、编辑和删除
* 到期日期和开始日期
* 任务完成状态（NEEDS-ACTION、IN-PROCESS、COMPLETED、CANCELLED）
* 任务优先级
* 循环任务
* 任务描述和备注
* 多设备同步
* 带 RELATED-TO 属性的子任务
* 带 VALARM 的任务提醒

登录凭据与日历支持相同：

| 登录名   | 示例                       | 说明                                                                                                                                                                                     |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 用户名   | `user@example.com`         | 在 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> 域名</a> 中存在的别名的电子邮件地址。                                                                                   |
| 密码     | `************************` | 别名专用生成的密码。                                                                                                                                                                      |

**重要说明：**

* **每个提醒事项列表都是一个独立日历** - 当你在 Apple 提醒事项中创建新列表时，会在 CalDAV 服务器上创建一个新日历
* **Thunderbird 用户** - 你需要手动订阅你想同步的每个日历/列表，或者使用日历主页 URL：`https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **Apple 用户** - 日历发现会自动进行，因此你所有的日历和列表都会出现在 Calendar.app 和 Reminders.app 中
* **统一日历** - 所有日历都支持事件和任务，给你组织数据的灵活性
### 你们支持联系人（CardDAV）吗 {#do-you-support-contacts-carddav}

是的，自2025年6月12日起我们已添加此功能。我们的服务器是 `carddav.forwardemail.net`，并且在我们的<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">状态页面</a>上也有监控。

它支持 IPv4 和 IPv6，并且通过端口 `443`（HTTPS）提供服务。

| 登录名   | 示例                       | 说明                                                                                                                                                                                     |
| -------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 用户名   | `user@example.com`         | 域名下存在的别名的电子邮件地址，管理位置在<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> 域名</a>。                   |
| 密码     | `************************` | 别名专用生成密码。                                                                                                                                                                        |

要使用联系人支持，**用户**必须是域名下存在的别名的电子邮件地址，管理位置在<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> 域名</a>，且**密码**必须是别名专用生成密码。

### 你们支持使用 SMTP 发送邮件吗 {#do-you-support-sending-email-with-smtp}

是的，自2023年5月起，我们支持作为所有付费用户的附加功能使用 SMTP 发送邮件。

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要提示：
  </strong>
  <span>
    请确保您已阅读我们的<a href="/terms" class="alert-link" target="_blank">服务条款</a>、<a href="/privacy" class="alert-link" target="_blank">隐私政策</a>以及<a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">SMTP 外发限制</a> —— 您的使用即视为认可并同意。
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要提示：
  </strong>
  <span>
    如果您使用 Gmail，请参阅我们的<a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Gmail 自定义域名发送邮件指南</a>。如果您是开发者，请参阅我们的<a class="alert-link" href="/email-api#outbound-emails" target="_blank">邮件 API 文档</a>。
  </span>
</div>

1. 访问<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 设置 <i class="fa fa-angle-right"></i> SMTP 外发配置，按照设置说明操作

2. 在<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 别名下为您的域名创建一个新别名（例如 <code><hello@example.com></code>）

3. 点击新创建别名旁的<strong class="text-success"><i class="fa fa-key"></i> 生成密码</strong>。复制到剪贴板并安全保存屏幕上显示的生成密码。

4. 使用您喜欢的邮件应用，添加或配置一个使用新创建别名的账户（例如 <code><hello@example.com></code>）
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       小贴士：
     </strong>
     <span>我们推荐使用<a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>、<a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird 移动版</a>、<a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>，或<a href="/blog/open-source" class="alert-link" target="_blank">开源且注重隐私的替代方案</a>。</span>
   </div>
5. 当系统提示输入 SMTP 服务器名称时，输入 `smtp.forwardemail.net`

6. 当系统提示输入 SMTP 服务器端口时，输入 `465`（SSL/TLS）– 如有必要，请参见[备用 SMTP 端口](/faq#what-are-your-smtp-server-configuration-settings)
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       提示：
     </strong>
     <span>如果您使用的是 Thunderbird，请确保“连接安全性”设置为“SSL/TLS”，认证方法设置为“普通密码”。</span>
   </div>

7. 当系统提示输入 SMTP 服务器密码时，粘贴上面第 3 步中 <strong class="text-success"><i class="fa fa-key"></i> 生成密码</strong> 的密码

8. **保存您的设置并发送您的第一封测试邮件** – 如果遇到问题，请<a href="/help">联系我们</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要提示：
  </strong>
  <span>
    请注意，为了维护 IP 声誉并确保邮件可达性，我们对每个域名的出站 SMTP 进行手动审核批准。此过程通常少于 24 小时，大多数请求会在 1-2 小时内处理完成。未来我们计划通过额外的垃圾邮件控制和警报，使此过程即时完成。此流程确保您的邮件能够送达收件箱，且您的消息不会被标记为垃圾邮件。
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

### 您支持 OpenPGP/MIME、端到端加密（“E2EE”）和 Web 密钥目录（“WKD”）吗？ {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

是的，我们支持[OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP)、[端到端加密（“E2EE”）](https://en.wikipedia.org/wiki/End-to-end_encryption)以及使用[Web 密钥目录（“WKD”）](https://wiki.gnupg.org/WKD)进行公钥发现。您可以使用[keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service)配置 OpenPGP，或者[自托管您的密钥](https://wiki.gnupg.org/WKDHosting)（参考[此 gist 了解 WKD 服务器设置](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)）。

* WKD 查询会缓存 1 小时以确保及时发送邮件 → 因此如果您添加、更改或删除了 WKD 密钥，请通过电子邮件发送您的邮箱地址至 `support@forwardemail.net`，以便我们手动清除缓存。
* 我们支持通过 WKD 查询或在界面上传的 PGP 密钥进行的消息加密。
* 只要启用/勾选了 PGP 复选框，上传的密钥将优先使用。
* 发送到 webhook 的消息当前不使用 PGP 加密。
* 如果针对某个转发地址存在多个匹配的别名（例如正则表达式/通配符/精确组合），且多个别名都上传了 PGP 密钥并勾选了 PGP → 我们将发送错误警报邮件，并且不会使用上传的 PGP 密钥加密消息。这种情况非常罕见，通常只适用于具有复杂别名规则的高级用户。
* **如果发件人设置了拒绝的 DMARC 策略，则通过我们的 MX 服务器转发的邮件不会应用 PGP 加密。如果您需要对*所有*邮件进行 PGP 加密，建议使用我们的 IMAP 服务，并为您的别名配置 PGP 密钥以处理入站邮件。**

**您可以在 <https://wkd.chimbosonic.com/>（开源）或 <https://www.webkeydirectory.com/>（专有）验证您的 Web 密钥目录设置。**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    自动加密：
  </strong>
  <span>如果您使用我们的<a href="#do-you-support-sending-email-with-smtp" class="alert-link">出站 SMTP 服务</a>发送未加密的邮件，我们将自动尝试基于<a class="alert-link" href="https://wiki.gnupg.org/WKD">Web 密钥目录（“WKD”）</a>对每个收件人进行加密。</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要提示：
  </strong>
  <span>
    您必须按照以下所有步骤操作，才能为您的自定义域名启用 OpenPGP。
  </span>
</div>

1. 下载并安装您邮件客户端推荐的插件：

   | 邮件客户端       | 平台     | 推荐插件                                                                                                                                                                             | 备注                                                                                                                                                                                                                                                                                                                                                                                                                                     |
   | --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird     | 桌面     | [在 Thunderbird 中配置 OpenPGP](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird 内置支持 OpenPGP。                                                                                                                                                                                                                                                                                                                                                                                                            |
   | Gmail           | 浏览器   | [Mailvelope](https://mailvelope.com/) 或 [FlowCrypt](https://flowcrypt.com/download)（专有许可）                                                                                      | Gmail 不支持 OpenPGP，但您可以下载开源插件 [Mailvelope](https://mailvelope.com/) 或 [FlowCrypt](https://flowcrypt.com/download)。                                                                                                                                                                                                                                                                                                       |
   | Apple Mail      | macOS    | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                           | Apple Mail 不支持 OpenPGP，但您可以下载开源插件 [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)。                                                                                                                                                                                                                                                                                              |
   | Apple Mail      | iOS      | [PGPro](https://github.com/opensourceios/PGPro/) 或 [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995)（专有许可）                                    | Apple Mail 不支持 OpenPGP，但您可以下载开源插件 [PGPro](https://github.com/opensourceios/PGPro/) 或 [FlowCrypt](https://flowcrypt.com/download)。                                                                                                                                                                                                                                                                                         |
   | Outlook         | Windows  | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                         | Outlook 桌面邮件客户端不支持 OpenPGP，但您可以下载开源插件 [gpg4win](https://www.gpg4win.de/index.html)。                                                                                                                                                                                                                                                                                                                                 |
   | Outlook         | 浏览器   | [Mailvelope](https://mailvelope.com/) 或 [FlowCrypt](https://flowcrypt.com/download)（专有许可）                                                                                      | Outlook 网页邮件客户端不支持 OpenPGP，但您可以下载开源插件 [Mailvelope](https://mailvelope.com/) 或 [FlowCrypt](https://flowcrypt.com/download)。                                                                                                                                                                                                                                                                                         |
   | Android         | 移动端   | [OpenKeychain](https://www.openkeychain.org/) 或 [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                      | [Android 邮件客户端](/blog/open-source/android-email-clients) 如 [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) 和 [FairEmail](https://github.com/M66B/FairEmail) 都支持开源插件 [OpenKeychain](https://www.openkeychain.org/)。您也可以使用开源（专有许可）插件 [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)。                                                                                  |
   | Google Chrome   | 浏览器   | [Mailvelope](https://mailvelope.com/) 或 [FlowCrypt](https://flowcrypt.com/download)（专有许可）                                                                                      | 您可以下载开源浏览器扩展 [Mailvelope](https://mailvelope.com/) 或 [FlowCrypt](https://flowcrypt.com/download)。                                                                                                                                                                                                                                                                                                                        |
   | Mozilla Firefox | 浏览器   | [Mailvelope](https://mailvelope.com/) 或 [FlowCrypt](https://flowcrypt.com/download)（专有许可）                                                                                      | 您可以下载开源浏览器扩展 [Mailvelope](https://mailvelope.com/) 或 [FlowCrypt](https://flowcrypt.com/download)。                                                                                                                                                                                                                                                                                                                        |
   | Microsoft Edge  | 浏览器   | [Mailvelope](https://mailvelope.com/)                                                                                                                                                 | 您可以下载开源浏览器扩展 [Mailvelope](https://mailvelope.com/)。                                                                                                                                                                                                                                                                                                                                                                         |
   | Brave           | 浏览器   | [Mailvelope](https://mailvelope.com/) 或 [FlowCrypt](https://flowcrypt.com/download)（专有许可）                                                                                      | 您可以下载开源浏览器扩展 [Mailvelope](https://mailvelope.com/) 或 [FlowCrypt](https://flowcrypt.com/download)。                                                                                                                                                                                                                                                                                                                        |
   | Balsa           | 桌面     | [在 Balsa 中配置 OpenPGP](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                               | Balsa 内置支持 OpenPGP。                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | KMail           | 桌面     | [在 KMail 中配置 OpenPGP](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                                  | KMail 内置支持 OpenPGP。                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | GNOME Evolution | 桌面     | [在 Evolution 中配置 OpenPGP](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                                | GNOME Evolution 内置支持 OpenPGP。                                                                                                                                                                                                                                                                                                                                                                                                       |
   | Terminal        | 桌面     | [在终端中配置 gpg](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                                | 您可以使用开源的 [gpg 命令行工具](https://www.gnupg.org/download/) 从命令行生成新密钥。                                                                                                                                                                                                                                                                                                                                                      |
2. 打开插件，创建您的公钥，并配置您的电子邮件客户端以使用它。

3. 在 <https://keys.openpgp.org/upload> 上传您的公钥。

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
       可选附加功能：
     </strong>
     <span>
       如果您正在使用我们的 <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">加密存储（IMAP/POP3）</a> 服务，并且希望将存储在您（已加密的）SQLite数据库中的<i>所有</i>邮件都用您的公钥加密，那么请前往 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 别名（例如 <code>hello@example.com</code>） <i class="fa fa-angle-right"></i> 编辑 <i class="fa fa-angle-right"></i> OpenPGP 并上传您的公钥。
     </span>
   </div>

4. 为您的域名（例如 `example.com`）添加一个新的 `CNAME` 记录：

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
     <span>如果您的别名使用了我们的 <a class="alert-link" href="/disposable-addresses" target="_blank">个性化/一次性域名</a>（例如 <code>hideaddress.net</code>），则可以跳过此步骤。</span>
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

### 您支持 S/MIME 加密吗 {#do-you-support-smime-encryption}

是的，我们支持根据 [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551) 定义的 [S/MIME（安全/多用途互联网邮件扩展）](https://en.wikipedia.org/wiki/S/MIME) 加密。S/MIME 使用 X.509 证书提供端到端加密，广泛被企业邮件客户端支持。

我们支持 RSA 和 ECC（椭圆曲线密码学）证书：

* **RSA 证书**：最小 2048 位，推荐 4096 位
* **ECC 证书**：P-256、P-384 和 P-521 NIST 曲线

配置您的别名的 S/MIME 加密：

1. 从受信任的证书颁发机构（CA）获取 S/MIME 证书，或生成自签名证书用于测试。

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       提示：
     </strong>
     <span>您可以从像 <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> 或 <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis 免费 S/MIME</a> 这样的提供商免费获取 S/MIME 证书。</span>
   </div>

2. 以 PEM 格式导出您的证书（仅公钥证书，不包括私钥）。

3. 前往 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 别名（例如 <code><hello@example.com></code>） <i class="fa fa-angle-right"></i> 编辑 <i class="fa fa-angle-right"></i> S/MIME 并上传您的公钥证书。
4. 一旦配置完成，所有发送到您的别名的来信将在存储或转发之前使用您的 S/MIME 证书进行加密。

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       注意：
     </strong>
     <span>
       S/MIME 加密适用于尚未加密的来信。如果邮件已经使用 OpenPGP 或 S/MIME 加密，则不会重新加密。
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       重要：
     </strong>
     <span>
       如果发件人设置了拒绝的 DMARC 策略，通过我们的 MX 服务器转发的邮件将不会应用 S/MIME 加密。如果您需要对<em>所有</em>邮件应用 S/MIME 加密，建议使用我们的 IMAP 服务，并为您的别名配置 S/MIME 证书以处理入站邮件。
     </span>
   </div>

以下邮件客户端内置支持 S/MIME：

| 邮件客户端        | 平台     | 说明                                                                                                               |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| Apple Mail        | macOS    | 内置 S/MIME 支持。前往 邮件 > 偏好设置 > 账户 > 您的账户 > 信任 来配置证书。                                         |
| Apple Mail        | iOS      | 内置 S/MIME 支持。前往 设置 > 邮件 > 账户 > 您的账户 > 高级 > S/MIME 来配置。                                       |
| Microsoft Outlook | Windows  | 内置 S/MIME 支持。前往 文件 > 选项 > 信任中心 > 信任中心设置 > 邮件安全 来配置。                                     |
| Microsoft Outlook | macOS    | 内置 S/MIME 支持。前往 工具 > 账户 > 高级 > 安全 来配置。                                                           |
| Thunderbird       | 桌面     | 内置 S/MIME 支持。前往 账户设置 > 端到端加密 > S/MIME 来配置。                                                       |
| GNOME Evolution   | 桌面     | 内置 S/MIME 支持。前往 编辑 > 偏好设置 > 邮件账户 > 您的账户 > 安全 来配置。                                         |
| KMail             | 桌面     | 内置 S/MIME 支持。前往 设置 > 配置 KMail > 身份 > 您的身份 > 加密 来配置。                                           |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      恭喜！
    </strong>
    <span>
      您已成功为您的别名配置了 S/MIME 加密。
    </span>
  </div>
</div>

### 您支持 Sieve 邮件过滤吗 {#do-you-support-sieve-email-filtering}

支持！我们支持根据 [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228) 定义的 [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) 邮件过滤。Sieve 是一种强大且标准化的服务器端邮件过滤脚本语言，允许您自动组织、过滤和响应来信。

#### 支持的 Sieve 扩展 {#supported-sieve-extensions}

我们支持一套全面的 Sieve 扩展：

| 扩展                       | RFC                                                                                     | 描述                                              |
| -------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `fileinto`                 | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                               | 将邮件归档到指定文件夹                             |
| `reject` / `ereject`       | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                               | 拒绝邮件并返回错误                                |
| `vacation`                 | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                               | 自动假期/离开回复                                 |
| `vacation-seconds`         | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                               | 精细控制假期回复间隔                              |
| `imap4flags`               | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                               | 设置 IMAP 标记（\Seen、\Flagged 等）              |
| `envelope`                 | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                               | 测试信封发件人/收件人                             |
| `body`                     | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                               | 测试邮件正文内容                                  |
| `variables`                | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                               | 在脚本中存储和使用变量                            |
| `relational`               | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                               | 关系比较（大于、小于）                            |
| `comparator-i;ascii-numeric` | [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                             | 数值比较                                          |
| `copy`                     | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                               | 重定向时复制邮件                                  |
| `editheader`               | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                               | 添加或删除邮件头                                  |
| `date`                     | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                               | 测试日期/时间值                                  |
| `index`                    | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                               | 访问特定邮件头出现次数                            |
| `regex`                    | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex)  | 正则表达式匹配                                   |
| `enotify`                  | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                               | 发送通知（例如 mailto:）                          |
| `environment`              | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                               | 访问环境信息                                     |
| `mailbox`                  | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                               | 测试邮箱存在性，创建邮箱                          |
| `special-use`              | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                               | 归档到特殊用途邮箱（\Junk、\Trash）               |
| `duplicate`                | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                               | 检测重复邮件                                     |
| `ihave`                    | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                               | 测试扩展可用性                                   |
| `subaddress`               | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                               | 访问 user+detail 地址部分                         |
#### 不支持的扩展 {#extensions-not-supported}

以下扩展当前不支持：

| 扩展                                                         | 原因                                                                |
| ------------------------------------------------------------ | ------------------------------------------------------------------- |
| `include`                                                    | 安全风险（脚本注入）且需要全局脚本存储                              |
| `mboxmetadata` / `servermetadata`                            | 需要 IMAP METADATA 扩展支持                                         |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | 复杂的 MIME 树操作尚未实现                                          |

#### 示例 Sieve 脚本 {#example-sieve-scripts}

**将新闻通讯归档到文件夹：**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**休假时自动回复：**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "I am currently out of the office and will respond when I return.";
```

**标记来自重要发件人的邮件：**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**拒绝带有特定主题的垃圾邮件：**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Message rejected due to spam content.";
}
```

#### 管理 Sieve 脚本 {#managing-sieve-scripts}

您可以通过多种方式管理您的 Sieve 脚本：

1. **网页界面**：访问 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 别名 <i class="fa fa-angle-right"></i> Sieve 脚本 来创建和管理脚本。

2. **ManageSieve 协议**：使用任何兼容 ManageSieve 的客户端（如 Thunderbird 的 Sieve 插件或 [sieve-connect](https://github.com/philpennock/sieve-connect)）连接到 `imap.forwardemail.net`。使用端口 `2190` 并启用 STARTTLS（大多数客户端推荐）或端口 `4190` 并启用隐式 TLS。

3. **API**：使用我们的 [REST API](/api#sieve-scripts) 以编程方式管理脚本。

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    注意：
  </strong>
  <span>
    Sieve 过滤在邮件存储到您的邮箱之前应用。脚本按优先级顺序执行，第一个匹配的动作决定邮件的处理方式。
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    安全性：
  </strong>
  <span>
    出于安全考虑，重定向操作每个脚本限制为 10 次，每天限制为 100 次。休假自动回复有速率限制以防止滥用。
  </span>
</div>

### 你们支持 MTA-STS 吗 {#do-you-support-mta-sts}

是的，自 2023 年 3 月 2 日起我们支持 [MTA-STS](https://www.hardenize.com/blog/mta-sts)。如果您希望在您的域启用它，可以使用[此模板](https://github.com/jpawlowski/mta-sts.template)。

我们的配置公开托管在 GitHub，地址为 <https://github.com/forwardemail/mta-sts.forwardemail.net>。

### 你们支持通行密钥和 WebAuthn 吗 {#do-you-support-passkeys-and-webauthn}

支持！自 2023 年 12 月 13 日起，我们因[强烈需求](https://github.com/orgs/forwardemail/discussions/182)增加了对通行密钥的支持。

通行密钥允许您无需密码和双因素认证即可安全登录。

您可以通过触摸、面部识别、设备密码或 PIN 验证身份。

我们允许您同时管理最多 30 个通行密钥，方便您使用所有设备轻松登录。

以下链接可了解更多关于通行密钥的信息：

* [使用通行密钥登录您的应用和网站](https://support.google.com/android/answer/14124480?hl=en)（Google）
* [在 iPhone 上使用通行密钥登录应用和网站](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios)（Apple）
* [维基百科关于通行密钥的条目](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### 你支持电子邮件最佳实践吗 {#do-you-support-email-best-practices}

是的。我们在所有计划中内置支持 SPF、DKIM、DMARC、ARC 和 SRS。我们还与这些规范的原始作者及其他电子邮件专家进行了广泛合作，以确保完美和高送达率。

### 你支持退信 webhook 吗 {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    提示：
  </strong>
    想了解电子邮件 webhook 的文档？请参见 <a href="/faq#do-you-support-webhooks" class="alert-link">你支持 webhook 吗？</a> 获取更多信息。
  <span>
  </span>
</div>

是的，自 2024 年 8 月 14 日起，我们已添加此功能。你现在可以前往 我的账户 → 域名 → 设置 → 退信 Webhook URL，配置一个 `http://` 或 `https://` URL，我们将在每次外发 SMTP 邮件退信时向该 URL 发送 `POST` 请求。

这对你管理和监控外发 SMTP 非常有用——可用于维护订阅者、退订以及检测退信发生的情况。

退信 webhook 的负载以 JSON 格式发送，包含以下属性：

* `email_id` (字符串) - 对应 我的账户 → 邮件（外发 SMTP）中的邮件 ID
* `list_id` (字符串) - 原始外发邮件中的 `List-ID` 头（不区分大小写）值（如果有）
* `list_unsubscribe` (字符串) - 原始外发邮件中的 `List-Unsubscribe` 头（不区分大小写）值（如果有）
* `feedback_id` (字符串) - 原始外发邮件中的 `Feedback-ID` 头（不区分大小写）值（如果有）
* `recipient` (字符串) - 退信或错误的收件人邮箱地址
* `message` (字符串) - 退信的详细错误信息
* `response` (字符串) - SMTP 响应消息
* `response_code` (数字) - 解析后的 SMTP 响应代码
* `truth_source` (字符串) - 如果响应代码来自可信源，该值将填充根域名（例如 `google.com` 或 `yahoo.com`）
* `bounce` (对象) - 包含以下属性的对象，详细说明退信和拒绝状态
  * `action` (字符串) - 退信动作（例如 `"reject"`）
  * `message` (字符串) - 退信原因（例如 `"Message Sender Blocked By Receiving Server"`）
  * `category` (字符串) - 退信类别（例如 `"block"`）
  * `code` (数字) - 退信状态码（例如 `554`）
  * `status` (字符串) - 响应消息中的退信代码（例如 `5.7.1`）
  * `line` (数字) - 解析的行号（如果有），来自 [Zone-MTA 退信解析列表](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt)（例如 `526`）
* `headers` (对象) - 外发邮件的头部键值对
* `bounced_at` (字符串) - 退信错误发生时间，采用 [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) 格式

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

关于退信 webhook，这里有一些额外说明：

* 如果 webhook 负载包含 `list_id`、`list_unsubscribe` 或 `feedback_id` 值，则应根据需要采取适当措施将 `recipient` 从列表中移除。
  * 如果 `bounce.category` 值为 `"block"`、`"recipient"`、`"spam"` 或 `"virus"`，则应当将用户从列表中移除。
* 如果你需要验证 webhook 负载（以确保它们确实来自我们的服务器），可以通过反向查找解析远程客户端 IP 地址的主机名（[reverse lookup](https://nodejs.org/api/dns.html#dnspromisesreverseip)）——应为 `smtp.forwardemail.net`。
  * 你也可以将 IP 与 [我们公布的 IP 地址](#what-are-your-servers-ip-addresses) 进行比对。
  * 前往 我的账户 → 域名 → 设置 → Webhook 签名负载验证密钥 获取你的 webhook 密钥。
    * 出于安全考虑，你可以随时轮换此密钥。
    * 使用此密钥计算并比较我们 webhook 请求中的 `X-Webhook-Signature` 值与计算出的正文值。具体示例见 [此 Stack Overflow 帖子](https://stackoverflow.com/a/68885281)。
  * 更多讨论见 <https://github.com/forwardemail/free-email-forwarding/issues/235>。
* 我们会等待你的 webhook 端点最多 `5` 秒以返回 `200` 状态码，并会重试最多 `1` 次。
* 如果我们检测到你的退信 webhook URL 在尝试发送请求时出现错误，我们将每周发送一次礼貌提醒邮件。
### 你支持 Webhooks 吗 {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    提示：
  </strong>
    想了解有关退信 Webhooks 的文档？请参见 <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">你支持退信 Webhooks 吗？</a> 获取更多信息。
  <span>
  </span>
</div>

是的，自 2020 年 5 月 15 日起我们已添加此功能。您可以像添加任何收件人一样简单地添加 webhook！请确保 webhook 的 URL 以 “http” 或 “https” 协议开头。

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    增强隐私保护：
  </strong>
  <span>
    如果您使用的是付费计划（包含增强隐私保护功能），请前往 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户 <i class="fa fa-angle-right"></i> 域名</a>，点击您域名旁的“别名”来配置您的 Webhooks。如果您想了解更多关于付费计划的信息，请参阅我们的 <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">价格</a> 页面。否则，您可以继续按照以下说明操作。
  </span>
</div>

如果您使用的是免费计划，只需添加一个新的 DNS <strong class="notranslate">TXT</strong> 记录，如下所示：

例如，如果我想让所有发送到 `alias@example.com` 的邮件转发到一个新的 [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect) 测试端点：

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
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

或者您想让所有发送到 `example.com` 的邮件转发到此端点：

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
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

**以下是关于 Webhooks 的额外说明：**

* 如果您需要验证 webhook 负载（以确保它们确实来自我们的服务器），可以[使用反向查找解析远程客户端 IP 地址的客户端主机名](https://nodejs.org/api/dns.html#dnspromisesreverseip) — 它应为 `mx1.forwardemail.net` 或 `mx2.forwardemail.net`。
  * 您也可以将 IP 与[我们公布的 IP 地址](#what-are-your-servers-ip-addresses)进行核对。
  * 如果您使用的是付费计划，请前往 我的账户 → 域名 → 设置 → Webhook 签名负载验证密钥 获取您的 webhook 密钥。
    * 出于安全考虑，您可以随时更换此密钥。
    * 使用此密钥计算并比较我们 webhook 请求中的 `X-Webhook-Signature` 值与计算出的正文值。如何操作的示例请参见[此 Stack Overflow 帖子](https://stackoverflow.com/a/68885281)。
  * 更多信息请参见 <https://github.com/forwardemail/free-email-forwarding/issues/235> 的讨论。
* 如果 webhook 未返回 `200` 状态码，我们会将其响应存储在[错误日志中](#do-you-store-error-logs) — 这对调试非常有用。
* Webhook HTTP 请求将在每次 SMTP 连接尝试时最多重试 3 次，每次端点 POST 请求最大超时为 60 秒。**注意这并不意味着只重试 3 次**，实际上它会通过在第 3 次 HTTP POST 请求失败后发送 SMTP 代码 421（表示稍后重试）持续重试。这意味着邮件会持续重试数天，直到收到 200 状态码。
* 我们会根据 [superagent 的 retry 方法](https://ladjs.github.io/superagent/#retrying-requests) 中使用的默认状态和错误代码自动重试（我们是维护者）。
* 我们会将发送到同一端点的 webhook HTTP 请求合并为一次请求（而非多次），以节省资源并加快响应速度。例如，如果您发送邮件到 <webhook1@example.com>、<webhook2@example.com> 和 <webhook3@example.com>，且这些都配置为指向完全相同的端点 URL，则只会发出一次请求。我们通过严格相等匹配端点 URL 来合并请求。
* 请注意，我们使用 [mailparser](https://nodemailer.com/extras/mailparser/) 库的 "simpleParser" 方法将邮件解析为 JSON 友好的对象。
* 原始邮件内容作为字符串提供，属性名为 "raw"。
* 认证结果以属性 "dkim"、"spf"、"arc"、"dmarc" 和 "bimi" 提供。
* 解析后的邮件头以属性 "headers" 提供 — 也可以使用 "headerLines" 方便迭代和解析。
* 此 webhook 的分组收件人以属性 "recipients" 提供。
* SMTP 会话信息以属性 "session" 提供。包含发件人信息、邮件到达时间、HELO 和客户端主机名。客户端主机名 `session.clientHostname` 是 FQDN（通过反向 PTR 查找获得）或用方括号括起的 `session.remoteAddress`（例如 `"[127.0.0.1]"`）。
* 如果您需要快速获取 `X-Original-To` 的值，可以使用 `session.recipient` 的值（见下例）。`X-Original-To` 是我们为调试添加的邮件头，表示邮件的原始收件人（掩码转发前）。
* 如果您需要从负载正文中移除 `attachments` 和/或 `raw` 属性，只需在 webhook 端点 URL 添加查询参数 `?attachments=false`、`?raw=false` 或 `?attachments=false&raw=false`（例如 `https://example.com/webhook?attachments=false&raw=false`）。
* 如果有附件，它们会以 Buffer 值追加到 `attachments` 数组中。您可以使用 JavaScript 方式将其解析回内容，例如：
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
    Tip:
  </strong>
    Curious what the webhook request looks like from forwarded emails?  We've included an example below for you!
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

### 你支持正则表达式或 regex 吗 {#do-you-support-regular-expressions-or-regex}

是的，自 2021 年 9 月 27 日起我们已添加此功能。你可以直接编写用于匹配别名和执行替换的正则表达式（“regex”）。

支持正则表达式的别名是以 `/` 开头并以 `/` 结尾的，且其收件人是电子邮件地址或 webhook。收件人也可以包含正则替换支持（例如 `$1`，`$2`）。

我们支持两个正则表达式标志，包括 `i` 和 `g`。不区分大小写的 `i` 标志是永久默认且始终强制执行。全局标志 `g` 可以通过在结尾的 `/` 后添加 `/g` 来启用。

请注意，我们的正则支持中，收件人部分也支持我们的<a href="#can-i-disable-specific-aliases">禁用别名功能</a>。

正则表达式不支持<a href="/disposable-addresses" target="_blank">全局虚荣域名</a>（因为这可能存在安全漏洞）。

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    增强隐私保护：
  </strong>
  <span>
    如果你使用的是付费计划（该计划具备增强隐私保护功能），请前往 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户 <i class="fa fa-angle-right"></i> 域名</a>，点击你的域名旁边的“别名”来配置别名，包括带有正则表达式的别名。如果你想了解更多关于付费计划的信息，请参阅我们的<a class="alert-link" rel="noopener noreferrer" href="/private-business-email">定价</a>页面。
  </span>
</div>

#### 增强隐私保护示例 {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>别名名称</th>
      <th>效果</th>
      <th>测试</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>邮件发送到 `linus@example.com` 或 `torvalds@example.com`</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">在 RegExr 上查看测试</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>邮件发送到 `24highst@example.com` 或 `24highstreet@example.com`</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">在 RegExr 上查看测试</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    提示：
  </strong>
    要在 <a href="https://regexr.com" class="alert-link">RegExr</a> 测试这些表达式，请在顶部框中编写表达式，然后在下面的文本框中输入示例别名。如果匹配，它将变为蓝色。
  <span>
  </span>
</div>

#### 免费计划示例 {#examples-for-the-free-plan}

如果你使用的是免费计划，只需使用以下提供的一个或多个示例添加新的 DNS <strong class="notranslate">TXT</strong> 记录：

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>简单示例：</strong> 如果我想让所有发送到 `linus@example.com` 或 `torvalds@example.com` 的邮件转发到 `user@gmail.com`：
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
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>名字姓氏替换示例：</strong> 假设你们公司的所有电子邮件地址都是 `firstname.lastname@example.com` 格式。如果我想让所有发送到 `firstname.lastname@example.com` 格式的邮件转发到支持替换的 `firstname.lastname@company.com`（<a href="https://regexr.com/66hnu" class="alert-link">在 RegExr 上查看测试</a>）：
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
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>加号符号过滤替换示例：</strong> 如果我想让所有发送到 `info@example.com` 或 `support@example.com` 的邮件分别转发到 `user+info@gmail.com` 或 `user+support@gmail.com`（支持替换）(<a href="https://regexr.com/66ho7" class="alert-link">在 RegExr 上查看测试</a>)：
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
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Webhook 查询字符串替换示例：</strong> 也许你想让所有发送到 `example.com` 的邮件转发到一个 <a href="#do-you-support-webhooks" class="alert-link">webhook</a>，并且带有一个动态查询字符串键 "to"，值为邮件地址的用户名部分 (<a href="https://regexr.com/66ho4" class="alert-link">在 RegExr 上查看测试</a>)：
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
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>静默拒绝示例：</strong> 如果你想让所有匹配某个模式的邮件被禁用并静默拒绝（对发送者表现为邮件发送成功，但实际上邮件未送达）且状态码为 `250`（参见 <a href="#can-i-disable-specific-aliases" class="alert-link">我可以禁用特定别名吗</a>），只需使用单个感叹号 "!" 的相同方法。这表示邮件对发送者来说已成功送达，但实际上邮件未被处理（例如黑洞或 `/dev/null`）。
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
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>软拒绝示例：</strong> 如果你想让所有匹配某个模式的邮件被禁用并软拒绝，状态码为 `421`（参见 <a href="#can-i-disable-specific-aliases" class="alert-link">我可以禁用特定别名吗</a>），只需使用双感叹号 "!!" 的相同方法。这表示发送者应重试发送邮件，且该别名的邮件将被重试约 5 天，之后永久拒绝。
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
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>硬拒绝示例：</strong> 如果您希望禁用所有匹配某个特定模式的邮件并以状态码 `550` 硬拒绝（参见 <a href="#can-i-disable-specific-aliases" class="alert-link">我可以禁用特定别名吗</a>），只需使用三个感叹号 "!!!" 的相同方法。这向发件人表示永久错误，邮件不会重试，将被拒绝该别名的邮件。
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
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    小贴士：
  </strong>
    想知道如何编写正则表达式或需要测试您的替换内容？您可以访问免费的正则表达式测试网站 <a href="https://regexr.com" class="alert-link">RegExr</a>，网址为 <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>。
  <span>
  </span>
</div>

### 您的出站 SMTP 限制是多少 {#what-are-your-outbound-smtp-limits}

我们对用户和域名的出站 SMTP 邮件数量限制为每天 300 封。这相当于日历月内平均超过 9000 封邮件。如果您需要超过此数量或经常发送大容量邮件，请[联系我们](https://forwardemail.net/help)。

### 启用 SMTP 是否需要审批 {#do-i-need-approval-to-enable-smtp}

是的，请注意，为了维护 IP 声誉并确保邮件可达性，Forward Email 对出站 SMTP 进行基于域名的手动审核审批。请发送邮件至 <support@forwardemail.net> 或提交[帮助请求](https://forwardemail.net/help)以获取审批。通常审批时间少于 24 小时，大多数请求会在 1-2 小时内得到处理。未来我们计划通过额外的垃圾邮件控制和警报，使此流程即时完成。此流程确保您的邮件能送达收件箱，且不会被标记为垃圾邮件。

### 您的 SMTP 服务器配置设置是什么 {#what-are-your-smtp-server-configuration-settings}

我们的服务器是 `smtp.forwardemail.net`，并在我们的 <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">状态页面</a> 上进行监控。

它支持 IPv4 和 IPv6，SSL/TLS（推荐）端口为 `465` 和 `2465`，TLS（STARTTLS）端口为 `587`、`2587`、`2525` 和 `25`。

**自 2025 年 10 月起**，我们支持在端口 `2455`（SSL/TLS）和 `2555`（STARTTLS）上使用**旧版 TLS 1.0**连接，适用于打印机、扫描仪、摄像头和无法支持现代 TLS 版本的旧邮件客户端等旧设备。这些端口作为 Gmail、Yahoo、Outlook 及其他已停止支持旧 TLS 协议的服务提供商的替代方案。

> \[!CAUTION]
> **旧版 TLS 1.0 支持（端口 2455 和 2555）**：这些端口使用已弃用的 TLS 1.0 协议，存在已知安全漏洞（BEAST、POODLE）。仅当您的设备绝对无法支持 TLS 1.2 或更高版本时才使用这些端口。我们强烈建议您升级设备固件或尽可能切换到现代邮件客户端。这些端口仅用于旧硬件兼容性（旧打印机、扫描仪、摄像头、物联网设备）。

|                                     协议                                     | 主机名                   |            端口            |        IPv4        |        IPv6        | 备注                                   |
| :------------------------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: | -------------------------------------- |
|                              `SSL/TLS` **推荐**                             | `smtp.forwardemail.net` |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | 现代 TLS 1.2+（推荐）                  |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | 支持（优先使用 SSL/TLS 端口 `465`）    |
|                             `SSL/TLS` **仅限旧版**                            | `smtp.forwardemail.net` |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: 仅限旧设备使用 TLS 1.0       |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **仅限旧版** | `smtp.forwardemail.net` |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: 仅限旧设备使用 TLS 1.0       |
| 登录     | 示例                       | 描述                                                                                                                                                                                      |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 用户名   | `user@example.com`         | 存在于 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> 域名</a> 下域的别名的电子邮件地址。                                                                                   |
| 密码     | `************************` | 别名                                                                                                                                                                                      |

为了使用 SMTP 发送外发邮件，**SMTP 用户** 必须是存在于 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> 域名</a> 下域的别名的电子邮件地址 – 并且 **SMTP 密码** 必须是别名专用生成的密码。

请参阅 [你们支持使用 SMTP 发送邮件吗](#do-you-support-sending-email-with-smtp) 获取分步说明。

### 你们的 IMAP 服务器配置设置是什么 {#what-are-your-imap-server-configuration-settings}

我们的服务器是 `imap.forwardemail.net`，并且在我们的 <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">状态页面</a> 上也有监控。

它支持 IPv4 和 IPv6，并且通过端口 `993` 和 `2993` 提供 SSL/TLS 服务。

|         协议             | 主机名                   |     端口      |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **首选**       | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| 登录     | 示例                       | 描述                                                                                                                                                                                      |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 用户名   | `user@example.com`         | 存在于 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> 域名</a> 下域的别名的电子邮件地址。                                                                                   |
| 密码     | `************************` | 别名专用生成的密码。                                                                                                                                                                       |

为了使用 IMAP 连接，**IMAP 用户** 必须是存在于 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> 域名</a> 下域的别名的电子邮件地址 – 并且 **IMAP 密码** 必须是别名专用生成的密码。

请参阅 [你们支持使用 IMAP 接收邮件吗](#do-you-support-receiving-email-with-imap) 获取分步说明。

### 你们的 POP3 服务器配置设置是什么 {#what-are-your-pop3-server-configuration-settings}

我们的服务器是 `pop3.forwardemail.net`，并且在我们的 <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">状态页面</a> 上也有监控。

它支持 IPv4 和 IPv6，并且通过端口 `995` 和 `2995` 提供 SSL/TLS 服务。

|         协议             | 主机名                   |     端口      |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **首选**       | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |
| 登录     | 示例                       | 描述                                                                                                                                                                                      |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 用户名   | `user@example.com`         | 在 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> 域名</a> 中存在的别名的电子邮件地址。                                                                                   |
| 密码     | `************************` | 别名专用生成密码。                                                                                                                                                                         |

为了连接 POP3，**POP3 用户** 必须是 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">我的账户 <i class="fa fa-angle-right"></i> 域名</a> 中存在的别名的电子邮件地址——且 **IMAP 密码** 必须是别名专用生成密码。

请参阅 [你们支持 POP3 吗](#do-you-support-pop3) 获取分步说明。

### 我如何为我的域设置邮件自动发现 {#how-do-i-set-up-email-autodiscovery-for-my-domain}

邮件自动发现允许邮件客户端如 **Thunderbird**、**Apple Mail**、**Microsoft Outlook** 以及移动设备在用户添加邮箱账户时自动检测正确的 IMAP、SMTP、POP3、CalDAV 和 CardDAV 服务器设置。此功能由 [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html)（邮件）和 [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html)（CalDAV/CardDAV）定义，并使用 DNS SRV 记录。

Forward Email 在 `forwardemail.net` 上发布自动发现记录。您可以直接向您的域添加 SRV 记录，或者使用更简单的 CNAME 方式。

#### 选项 A：CNAME 记录（最简单） {#option-a-cname-records-simplest}

向您的域的 DNS 添加以下两个 CNAME 记录。这将自动发现委托给 Forward Email 的服务器：

|  类型  | 名称/主机       | 目标/值                         |
| :----: | --------------- | ------------------------------- |
| CNAME  | `autoconfig`    | `autoconfig.forwardemail.net`   |
| CNAME  | `autodiscover`  | `autodiscover.forwardemail.net` |

`autoconfig` 记录被 **Thunderbird** 及其他基于 Mozilla 的客户端使用。`autodiscover` 记录被 **Microsoft Outlook** 使用。

#### 选项 B：SRV 记录（直接） {#option-b-srv-records-direct}

如果您更喜欢直接添加记录（或者您的 DNS 提供商不支持子域的 CNAME），请向您的域添加以下 SRV 记录：

| 类型 | 名称/主机           | 优先级 | 权重 | 端口 | 目标/值                    | 用途                                   |
| :--: | ------------------- | :----: | :--: | :--: | -------------------------- | -------------------------------------- |
|  SRV | `_imaps._tcp`       |   0    |  1   |  993 | `imap.forwardemail.net`    | IMAP 通过 SSL/TLS（首选）               |
|  SRV | `_imap._tcp`        |   0    |  0   |  0   | `.`                        | 禁用明文 IMAP                          |
|  SRV | `_submissions._tcp` |   0    |  1   |  465 | `smtp.forwardemail.net`    | SMTP 提交（SSL/TLS，推荐）              |
|  SRV | `_submission._tcp`  |   5    |  1   |  587 | `smtp.forwardemail.net`    | SMTP 提交（STARTTLS）                   |
|  SRV | `_pop3s._tcp`       |  10    |  1   |  995 | `pop3.forwardemail.net`    | POP3 通过 SSL/TLS                      |
|  SRV | `_pop3._tcp`        |   0    |  0   |  0   | `.`                        | 禁用明文 POP3                          |
|  SRV | `_caldavs._tcp`     |   0    |  1   |  443 | `caldav.forwardemail.net`  | CalDAV 通过 TLS（日历）                 |
|  SRV | `_caldav._tcp`      |   0    |  0   |  0   | `.`                        | 禁用明文 CalDAV                        |
|  SRV | `_carddavs._tcp`    |   0    |  1   |  443 | `carddav.forwardemail.net` | CardDAV 通过 TLS（联系人）              |
|  SRV | `_carddav._tcp`     |   0    |  0   |  0   | `.`                        | 禁用明文 CardDAV                       |
> \[!NOTE]
> IMAP 的优先级值（0）低于 POP3（10），这告诉邮件客户端在两者都可用时优先使用 IMAP。目标为 `.`（单个点）的记录表示根据 [RFC 6186 第3.4节](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4) 有意禁用了这些协议的明文（非加密）版本。CalDAV 和 CardDAV 的 SRV 记录遵循日历和联系人自动发现的 [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html)。

#### 哪些邮件客户端支持自动发现？ {#which-email-clients-support-autodiscovery}

| 客户端             | 邮件                                             | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | `autoconfig` CNAME 或 SRV 记录                    | `autoconfig` XML 或 SRV 记录（RFC 6764）    |
| Apple Mail (macOS) | SRV 记录（RFC 6186）                              | SRV 记录（RFC 6764）                       |
| Apple Mail (iOS)   | SRV 记录（RFC 6186）                              | SRV 记录（RFC 6764）                       |
| Microsoft Outlook  | `autodiscover` CNAME 或 `_autodiscover._tcp` SRV | 不支持                                     |
| GNOME (Evolution)  | SRV 记录（RFC 6186）                              | SRV 记录（RFC 6764）                       |
| KDE (KMail)        | SRV 记录（RFC 6186）                              | SRV 记录（RFC 6764）                       |
| eM Client          | `autoconfig` 或 `autodiscover`                    | SRV 记录（RFC 6764）                       |

> \[!TIP]
> 为了在所有客户端中获得最佳兼容性，我们建议使用 **选项 A**（CNAME 记录）结合 **选项 B** 的 SRV 记录。仅使用 CNAME 方法已覆盖大多数邮件客户端。CalDAV/CardDAV 的 SRV 记录确保日历和联系人客户端也能自动发现您的服务器设置。


## 安全 {#security-1}

### 高级服务器加固技术 {#advanced-server-hardening-techniques}

> \[!TIP]
> 了解更多关于我们安全基础设施的信息，请访问 [我们的安全页面](/security)。

Forward Email 实施了多种服务器加固技术，以确保我们的基础设施和您的数据安全：

1. **网络安全**：
   * 使用严格规则的 IP tables 防火墙
   * Fail2ban 防止暴力破解
   * 定期安全审计和渗透测试
   * 仅通过 VPN 进行管理访问

2. **系统加固**：
   * 最小化软件包安装
   * 定期安全更新
   * SELinux 处于强制模式
   * 禁用 root SSH 访问
   * 仅允许基于密钥的认证

3. **应用安全**：
   * 内容安全策略（CSP）头
   * HTTPS 严格传输安全（HSTS）
   * XSS 保护头
   * 框架选项和引用者策略头
   * 定期依赖项审计

4. **数据保护**：
   * 使用 LUKS 进行全盘加密
   * 安全的密钥管理
   * 定期加密备份
   * 数据最小化实践

5. **监控与响应**：
   * 实时入侵检测
   * 自动安全扫描
   * 集中日志记录与分析
   * 事件响应流程

> \[!IMPORTANT]
> 我们的安全措施会持续更新，以应对新出现的威胁和漏洞。

> \[!TIP]
> 为了最大限度保障安全，我们建议通过 OpenPGP 使用端到端加密来使用我们的服务。

### 你们有 SOC 2 或 ISO 27001 认证吗 {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email 运行在由认证子处理商提供的基础设施上，以确保符合行业标准。

Forward Email 本身不直接持有 SOC 2 Type II 或 ISO 27001 认证。但该服务运行在由认证子处理商提供的基础设施上：

* **DigitalOcean**：拥有 SOC 2 Type II 和 SOC 3 Type II 认证（由 Schellman & Company LLC 审计），多个数据中心获得 ISO 27001 认证。详情见：<https://www.digitalocean.com/trust/certification-reports>
* **Vultr**：SOC 2+（HIPAA）认证，ISO/IEC 认证：20000-1:2018，27001:2022，27017:2015，27018:2019。详情：<https://www.vultr.com/legal/compliance/>

* **DataPacket**：符合 SOC 2 标准（请直接联系 DataPacket 获取认证），企业级基础设施提供商（丹佛地点）。详情：<https://www.datapacket.com/datacenters/denver>

Forward Email 遵循行业最佳安全审计实践，并定期与独立安全研究人员合作。来源：<https://forwardemail.net/technical-whitepaper.pdf#page=36>

### 您是否为邮件转发使用 TLS 加密 {#do-you-use-tls-encryption-for-email-forwarding}

是的。Forward Email 严格执行所有连接（HTTPS、SMTP、IMAP、POP3）使用 TLS 1.2+，并实现了 MTA-STS 以增强 TLS 支持。具体实现包括：

* 所有邮件连接强制使用 TLS 1.2+
* 使用 ECDHE（椭圆曲线 Diffie-Hellman 临时密钥交换）实现完美前向保密
* 采用现代密码套件并定期进行安全更新
* 支持 HTTP/2 以提升性能和安全性
* HSTS（HTTP 严格传输安全）并在主流浏览器中预加载
* **MTA-STS（邮件传输代理严格传输安全）** 实现严格的 TLS 强制执行

来源：<https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STS 实现**：Forward Email 在代码库中实现了严格的 MTA-STS 强制执行。当发生 TLS 错误且启用 MTA-STS 时，系统返回 421 SMTP 状态码，确保邮件稍后重试而非不安全地投递。实现细节：

* TLS 错误检测：<https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* 发送邮件辅助函数中的 MTA-STS 强制执行：<https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

第三方验证：<https://www.hardenize.com/report/forwardemail.net/1750312779> 显示所有 TLS 和传输安全措施均为“良好”评级。

### 您是否保留邮件认证头 {#do-you-preserve-email-authentication-headers}

是的。Forward Email 全面实现并保留邮件认证头：

* **SPF（发件人策略框架）**：正确实现并保留
* **DKIM（域密钥识别邮件）**：全面支持并妥善管理密钥
* **DMARC**：对未通过 SPF 或 DKIM 验证的邮件执行策略
* **ARC**：虽然未明确说明，但服务的完美合规评分表明全面处理认证头

来源：<https://forwardemail.net/technical-whitepaper.pdf#page=31>

验证：Internet.nl 邮件测试针对“SPF、DKIM 和 DMARC”实现得分 100/100。Hardenize 评估确认 SPF 和 DMARC 为“良好”评级：<https://www.hardenize.com/report/forwardemail.net/1750312779>

### 您是否保留原始邮件头并防止伪造 {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email 实施了复杂的反伪造保护以防止邮件滥用。

Forward Email 在转发过程中保留原始邮件头，同时通过 MX 代码库实现全面的反伪造保护：

* **邮件头保留**：转发时保留原始认证邮件头
* **反伪造**：通过 DMARC 策略执行，拒绝未通过 SPF 或 DKIM 验证的邮件，防止邮件头伪造
* **防止邮件头注入**：使用 striptags 库进行输入验证和清理
* **高级保护**：复杂的钓鱼检测，包括伪造检测、冒充防护和用户通知系统

**MX 实现细节**：核心邮件处理逻辑由 MX 服务器代码库负责，具体包括：

* 主要 MX 数据处理器：<https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* 任意邮件过滤（反伪造）：<https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

`isArbitrary` 辅助函数实现了复杂的反伪造规则，包括域名冒充检测、禁止短语和各种钓鱼模式检测。
### 你如何防范垃圾邮件和滥用 {#how-do-you-protect-against-spam-and-abuse}

Forward Email 实施了全面的多层保护：

* **速率限制**：应用于身份验证尝试、API 端点和 SMTP 连接
* **资源隔离**：用户之间隔离，防止高流量用户影响其他用户
* **DDoS 保护**：通过 DataPacket 的 Shield 系统和 Cloudflare 实现多层保护
* **自动扩展**：根据需求动态调整资源
* **滥用防范**：针对用户的滥用防范检查和基于哈希的恶意内容阻断
* **邮件认证**：支持 SPF、DKIM、DMARC 协议及高级钓鱼检测

来源：

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>（DDoS 保护详情）
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### 你们是否将邮件内容存储到磁盘 {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email 采用零知识架构，防止邮件内容被写入磁盘。

* **零知识架构**：单独加密的 SQLite 邮箱意味着 Forward Email 无法访问邮件内容
* **内存处理**：邮件处理完全在内存中进行，避免磁盘存储
* **无内容日志**：“我们不记录或存储邮件内容或元数据到磁盘”
* **沙箱加密**：加密密钥绝不以明文形式存储在磁盘上

**MX 代码库证据**：MX 服务器完全在内存中处理邮件，不将内容写入磁盘。主要邮件处理程序展示了这种内存处理方式：<https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

来源：

* <https://forwardemail.net/technical-whitepaper.pdf#page=10>（摘要）
* <https://forwardemail.net/technical-whitepaper.pdf#page=59>（零知识细节）
* <https://forwardemail.net/technical-whitepaper.pdf#page=21>（沙箱加密）

### 系统崩溃时邮件内容会被泄露吗 {#can-email-content-be-exposed-during-system-crashes}

不会。Forward Email 实施了全面的防护措施，防止崩溃时数据泄露：

* **禁用核心转储**：防止崩溃时内存泄露
* **禁用交换内存**：完全禁用，防止从交换文件提取敏感数据
* **内存架构**：邮件内容仅存在于处理时的易失性内存中
* **加密密钥保护**：密钥绝不以明文形式存储在磁盘上
* **物理安全**：LUKS v2 加密磁盘防止物理访问数据
* **禁用 USB 存储**：防止未经授权的数据提取

**系统问题错误处理**：Forward Email 使用辅助函数 `isCodeBug` 和 `isTimeoutError`，确保在数据库连接问题、DNS 网络/黑名单问题或上游连接问题发生时，系统返回 421 SMTP 状态码，确保邮件稍后重试，而非丢失或泄露。

实现细节：

* 错误分类：<https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* MX 处理中的超时错误处理：<https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

来源：<https://forwardemail.net/technical-whitepaper.pdf#page=15>

### 谁可以访问你们的邮件基础设施 {#who-has-access-to-your-email-infrastructure}

Forward Email 对其极少的 2-3 人工程团队访问实施了全面的访问控制，并严格要求双因素认证：

* **基于角色的访问控制**：团队账户具备基于资源的权限
* **最小权限原则**：贯穿所有系统
* **职责分离**：操作角色之间分离
* **用户管理**：部署和运维用户分开，权限不同
* **禁用 root 登录**：强制通过正确认证的账户访问
* **严格的双因素认证**：不使用短信双因素认证以防中间人攻击，仅支持应用或硬件令牌
* **全面审计日志**：敏感数据经过脱敏处理
* **自动异常检测**：监测异常访问模式
* **定期安全审查**：访问日志的安全审查
* **防止恶意清洁工攻击**：禁用 USB 存储及其他物理安全措施
来源：

* <https://forwardemail.net/technical-whitepaper.pdf#page=30>（授权控制）
* <https://forwardemail.net/technical-whitepaper.pdf#page=30>（网络安全）
* <https://forwardemail.net/technical-whitepaper.pdf#page=15>（防止恶意女仆攻击）

### 您使用哪些基础设施提供商 {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email 使用多个具有全面合规认证的基础设施子处理器。

完整详情请参阅我们的 GDPR 合规页面：<https://forwardemail.net/gdpr>

**主要基础设施子处理器：**

| 提供商           | 数据隐私框架认证                | GDPR 合规页面                                                                             |
| ---------------- | ------------------------------ | ---------------------------------------------------------------------------------------- |
| **Cloudflare**   | ✅ 是                           | <https://www.cloudflare.com/trust-hub/gdpr/>                                             |
| **DataPacket**   | ❌ 否                           | <https://www.datapacket.com/privacy-policy>                                              |
| **DigitalOcean** | ❌ 否                           | <https://www.digitalocean.com/legal/gdpr>                                                |
| **GitHub**       | ✅ 是                           | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**        | ❌ 否                           | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                          |

**详细认证：**

**DigitalOcean**

* SOC 2 类型 II 和 SOC 3 类型 II（由 Schellman & Company LLC 审计）
* 多个数据中心通过 ISO 27001 认证
* 符合 PCI-DSS 标准
* CSA STAR 一级认证
* APEC CBPR PRP 认证
* 详情：<https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* SOC 2+（HIPAA）认证
* PCI 商户合规
* CSA STAR 一级认证
* ISO/IEC 20000-1:2018、27001:2022、27017:2015、27018:2019
* 详情：<https://www.vultr.com/legal/compliance/>

**DataPacket**

* SOC 2 合规（请直接联系 DataPacket 获取认证）
* 企业级基础设施（丹佛地点）
* 通过 Shield 网络安全堆栈提供 DDoS 保护
* 24/7 技术支持
* 覆盖 58 个数据中心的全球网络
* 详情：<https://www.datapacket.com/datacenters/denver>

**GitHub**

* 数据隐私框架认证（欧盟-美国、瑞士-美国及英国扩展）
* 源代码托管、CI/CD 和项目管理
* 提供 GitHub 数据保护协议
* 详情：<https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**支付处理商：**

* **Stripe**：数据隐私框架认证 - <https://stripe.com/legal/privacy-center>
* **PayPal**：未获得 DPF 认证 - <https://www.paypal.com/uk/legalhub/privacy-full>

### 您是否提供数据处理协议（DPA） {#do-you-offer-a-data-processing-agreement-dpa}

是的，Forward Email 提供全面的数据处理协议（DPA），可与我们的企业协议一同签署。我们的 DPA 副本可在此获取：<https://forwardemail.net/dpa>

**DPA 详情：**

* 涵盖 GDPR 合规及欧盟-美国/瑞士-美国隐私保护框架
* 同意我们的服务条款时自动接受
* 标准 DPA 无需单独签署
* 企业许可可提供定制 DPA 安排

**GDPR 合规框架：**
我们的 DPA 详细说明了 GDPR 以及国际数据传输要求的合规情况。完整信息请访问：<https://forwardemail.net/gdpr>

对于需要定制 DPA 条款或特定合同安排的企业客户，可通过我们的 **企业许可（每月 250 美元）** 计划进行处理。

### 您如何处理数据泄露通知 {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Email 的零知识架构显著限制了泄露影响。
* **有限的数据暴露**：由于零知识架构，无法访问加密的电子邮件内容  
* **最少的数据收集**：仅收集基本的订阅者信息和有限的IP日志以保障安全  
* **子处理器框架**：DigitalOcean、GitHub 和 Vultr 维护符合 GDPR 的事件响应程序  

**GDPR 代表信息：**  
Forward Email 已根据第27条任命 GDPR 代表：

**欧盟代表：**  
Osano International Compliance Services Limited  
ATTN: LFHC  
3 Dublin Landings, North Wall Quay  
Dublin 1, D01C4E0  

**英国代表：**  
Osano UK Compliance LTD  
ATTN: LFHC  
42-46 Fountain Street, Belfast  
Antrim, BT1 - 5EF  

对于需要特定违规通知服务水平协议（SLA）的企业客户，应作为**企业许可**协议的一部分进行讨论。

来源：

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>  
* <https://forwardemail.net/gdpr>  

### 您是否提供测试环境 {#do-you-offer-a-test-environment}

Forward Email 的技术文档未明确描述专用的沙箱模式。但潜在的测试方法包括：

* **自托管选项**：全面的自托管功能，可用于创建测试环境  
* **API 接口**：可能支持对配置进行编程测试  
* **开源**：100%开源代码允许客户检查转发逻辑  
* **多域名支持**：支持多个域名，可用于创建测试域  

对于需要正式沙箱功能的企业客户，应作为**企业许可**协议的一部分进行讨论。

来源：<https://github.com/forwardemail/forwardemail.net>（开发环境详情）

### 您是否提供监控和告警工具 {#do-you-provide-monitoring-and-alerting-tools}

Forward Email 提供实时监控，但存在一些限制：

**可用功能：**

* **实时投递监控**：主要邮件服务商的性能指标公开可见  
* **自动告警**：当投递时间超过10秒时，工程团队会收到告警  
* **透明监控**：100%开源的监控系统  
* **基础设施监控**：自动异常检测和全面的审计日志  

**限制：**

* 未明确记录面向客户的 webhook 或基于 API 的投递状态通知  

对于需要详细投递状态 webhook 或自定义监控集成的企业客户，这些功能可能通过**企业许可**协议提供。

来源：

* <https://forwardemail.net>（实时监控展示）  
* <https://github.com/forwardemail/forwardemail.net>（监控实现）  

### 您如何确保高可用性 {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]  
> Forward Email 在多个基础设施提供商之间实施了全面的冗余。

* **分布式基础设施**：多个提供商（DigitalOcean、Vultr、DataPacket）跨地理区域部署  
* **地理负载均衡**：基于 Cloudflare 的地理位置负载均衡及自动故障切换  
* **自动扩展**：根据需求动态调整资源  
* **多层 DDoS 保护**：通过 DataPacket 的 Shield 系统和 Cloudflare 实现  
* **服务器冗余**：每个区域多台服务器，支持自动故障切换  
* **数据库复制**：多地点实时数据同步  
* **监控与告警**：全天候监控及自动事件响应  

**正常运行时间承诺**：99.9%+ 服务可用性，透明监控可见于 <https://forwardemail.net>

来源：

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>  
* <https://www.datapacket.com/datacenters/denver>  

### 您是否符合《国防授权法案》（NDAA）第889条款 {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]  
> Forward Email 通过谨慎选择基础设施合作伙伴，完全符合第889条款。

是的，Forward Email **符合第889条款**。国防授权法案（NDAA）第889条禁止政府机构使用或与使用特定公司（华为、中兴、海康威视、大华和海能达）电信和视频监控设备的实体签约。
**Forward Email 如何实现第 889 条款合规：**

Forward Email 完全依赖两个关键基础设施提供商，且均未使用第 889 条款禁止的设备：

1. **Cloudflare**：我们主要的网络服务和邮件安全合作伙伴  
2. **DataPacket**：我们主要的服务器基础设施提供商（仅使用 Arista Networks 和 Cisco 设备）  
3. **备份提供商**：我们的备份提供商 Digital Ocean 和 Vultr 也已书面确认符合第 889 条款。

**Cloudflare 的承诺**：Cloudflare 在其第三方行为准则中明确表示，他们不使用任何第 889 条款禁止实体的电信设备、视频监控产品或服务。

**政府使用案例**：当 **美国海军学院** 选择 Forward Email 作为其安全邮件转发需求时，我们的第 889 条款合规性得到了验证，并提供了我们的联邦合规标准文档。

有关我们政府合规框架的完整详情，包括更广泛的联邦法规，请阅读我们的综合案例研究：[联邦政府电子邮件服务第 889 条款合规](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## 系统和技术细节 {#system-and-technical-details}

### 你们会存储邮件及其内容吗 {#do-you-store-emails-and-their-contents}

不会，我们不写入磁盘或存储日志——[错误日志除外](#do-you-store-error-logs) 和 [外发 SMTP](#do-you-support-sending-email-with-smtp)（详见我们的[隐私政策](/privacy)）。

所有操作均在内存中完成，[我们的源代码托管在 GitHub](https://github.com/forwardemail)。

### 你们的邮件转发系统如何工作 {#how-does-your-email-forwarding-system-work}

邮件依赖于 [SMTP 协议](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)。该协议由发送到服务器（通常运行在端口 25）的一系列命令组成。首先建立连接，然后发送方指明邮件来源（“MAIL FROM”），接着是收件人（“RCPT TO”），最后是邮件头和邮件正文（“DATA”）。我们的邮件转发系统流程相对于每个 SMTP 协议命令描述如下：

* 初始连接（无命令名，例如 `telnet example.com 25`）——这是初始连接。我们会将不在[允许列表](#do-you-have-an-allowlist)中的发送者与我们的[拒绝列表](#do-you-have-a-denylist)进行比对。最后，如果发送者不在允许列表中，我们会检查其是否被[灰名单](#do-you-have-a-greylist)。

* `HELO` —— 表示问候，用于识别发送者的完全限定域名（FQDN）、IP 地址或邮件处理程序名称。该值可能被伪造，因此我们不依赖此数据，而是使用连接 IP 地址的反向主机名查找。

* `MAIL FROM` —— 表示邮件的信封发件人地址。如果填写，必须是有效的 RFC 5322 邮箱地址。允许为空值。我们在此处[检查反弹邮件](#how-do-you-protect-against-backscatter)，并且检查 MAIL FROM 是否在我们的[拒绝列表](#do-you-have-a-denylist)中。最后，我们对不在允许列表中的发送者进行速率限制（详见[速率限制](#do-you-have-rate-limiting)和[允许列表](#do-you-have-an-allowlist)部分）。

* `RCPT TO` —— 表示邮件的收件人。必须是有效的 RFC 5322 邮箱地址。每封邮件最多允许 50 个信封收件人（这与邮件中的“收件人”头不同）。我们还会检查有效的[发送者重写方案](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme)（“SRS”）地址，以防止使用我们的 SRS 域名进行伪造。

* `DATA` —— 这是我们服务的核心部分，用于处理邮件。更多详情请参见下文[你们如何处理邮件以进行转发](#how-do-you-process-an-email-for-forwarding)部分。
### 如何处理转发的电子邮件 {#how-do-you-process-an-email-for-forwarding}

本节描述了我们与 SMTP 协议命令 `DATA` 相关的处理流程，详见上文章节 [你的邮件转发系统如何工作](#how-does-your-email-forwarding-system-work) — 这是我们如何处理电子邮件的头部、正文、安全性，确定其需要投递的目标，以及如何处理连接。

1. 如果邮件大小超过最大限制 50mb，则以 552 错误码拒绝。

2. 如果邮件未包含 "From" 头部，或 "From" 头部中的任何值不是有效的 RFC 5322 邮箱地址，则以 550 错误码拒绝。

3. 如果邮件包含超过 25 个 "Received" 头部，则判定邮件陷入重定向循环，拒绝并返回 550 错误码。

4. 使用邮件指纹（参见 [指纹识别](#how-do-you-determine-an-email-fingerprint) 部分），我们会检查邮件是否尝试重试超过 5 天（符合 [postfix 默认行为](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)），如果是，则以 550 错误码拒绝。

5. 我们在内存中存储使用 [Spam Scanner](https://spamscanner.net) 扫描邮件的结果。

6. 如果 Spam Scanner 返回任何任意结果，则以 554 错误码拒绝。任意结果目前仅包括 GTUBE 测试。详情见 <https://spamassassin.apache.org/gtube/>。

7. 我们会向邮件添加以下头部，用于调试和防止滥用：

   * `Received` - 添加此标准 Received 头部，包含源 IP 和主机、传输类型、TLS 连接信息、日期/时间及收件人。
   * `X-Original-To` - 邮件的原始收件人：
     * 用于确定邮件最初投递到哪里（除了 "Received" 头部外）。
     * 在 IMAP 和/或掩码转发时按收件人逐个添加（以保护隐私）。
   * `X-Forward-Email-Website` - 包含我们网站链接 <https://forwardemail.net>
   * `X-Forward-Email-Version` - 我们代码库中 `package.json` 的当前 [SemVer](https://semver.org/) 版本。
   * `X-Forward-Email-Session-ID` - 用于调试的会话 ID（仅适用于非生产环境）。
   * `X-Forward-Email-Sender` - 逗号分隔列表，包含原始信封 MAIL FROM 地址（如果非空）、反向 PTR 客户端 FQDN（如果存在）及发送者 IP 地址。
   * `X-Forward-Email-ID` - 仅适用于出站 SMTP，与“我的账户 → 邮件”中存储的邮件 ID 相关联。
   * `X-Report-Abuse` - 值为 `abuse@forwardemail.net`。
   * `X-Report-Abuse-To` - 值为 `abuse@forwardemail.net`。
   * `X-Complaints-To` - 值为 `abuse@forwardemail.net`。

8. 然后我们检查邮件的 [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail)、[SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework)、[ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) 和 [DMARC](https://en.wikipedia.org/wiki/DMARC)。

   * 如果邮件未通过 DMARC 且域名有拒绝策略（例如 DMARC 策略中包含 `p=reject` [详见](https://wikipedia.org/wiki/DMARC)），则以 550 错误码拒绝。通常，域名的 DMARC 策略可在 `_dmarc` 子域的 <strong class="notranslate">TXT</strong> 记录中找到（例如 `dig _dmarc.example.com txt`）。
   * 如果邮件未通过 SPF 且域名有严格失败策略（例如 SPF 策略中包含 `-all`，而非 `~all` 或无策略），则以 550 错误码拒绝。通常，域名的 SPF 策略可在根域的 <strong class="notranslate">TXT</strong> 记录中找到（例如 `dig example.com txt`）。有关 SPF 的更多信息，请参见本节 [如何使用 Gmail 发送邮件](#can-i-send-mail-as-in-gmail-with-this)。
9. 现在我们处理从上面章节 [你的邮件转发系统如何工作](#how-does-your-email-forwarding-system-work) 中的 `RCPT TO` 命令收集的消息收件人。对于每个收件人，我们执行以下操作：

   * 我们查询域名的 <strong class="notranslate">TXT</strong> 记录（即 `@` 符号后的部分，例如如果电子邮件地址是 `test@example.com`，则域名为 `example.com`）。例如，如果域名是 `example.com`，我们会进行类似 `dig example.com txt` 的 DNS 查询。
   * 我们解析所有以 `forward-email=`（免费计划）或 `forward-email-site-verification=`（付费计划）开头的 <strong class="notranslate">TXT</strong> 记录。注意，我们会解析这两种记录，以便在用户升级或降级计划时处理邮件。
   * 从这些解析出的 <strong class="notranslate">TXT</strong> 记录中，我们迭代提取转发配置（如上面章节 [我如何开始并设置邮件转发](#how-do-i-get-started-and-set-up-email-forwarding) 所述）。注意，我们只支持一个 `forward-email-site-verification=` 值，如果提供了多个，则会发生 550 错误，发送者将收到该收件人的退信。
   * 递归迭代提取的转发配置，以确定全局转发、基于正则表达式的转发以及所有其他支持的转发配置——这些现在被称为我们的“转发地址”。
   * 对于每个转发地址，我们支持一次递归查找（这将对给定地址重新开始这一系列操作）。如果找到递归匹配，则父结果将从转发地址中移除，子地址将被添加。
   * 解析转发地址以确保唯一性（因为我们不希望向同一地址发送重复邮件或产生额外不必要的 SMTP 客户端连接）。
   * 对于每个转发地址，我们通过我们的 API 端点 `/v1/max-forwarded-addresses` 查询其域名（以确定该域名每个别名允许转发的地址数量，例如默认是 10 个——详见章节 [每个别名转发的最大地址限制](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)）。如果超过此限制，则会发生 550 错误，发送者将收到该收件人的退信。
   * 我们通过 API 端点 `/v1/settings` 查询原始收件人的设置，该端点支持付费用户查询（并为免费用户提供回退）。这会返回一个配置对象，包含高级设置，如 `port`（数字，例如 `25`）、`has_adult_content_protection`（布尔值）、`has_phishing_protection`（布尔值）、`has_executable_protection`（布尔值）和 `has_virus_protection`（布尔值）。
   * 基于这些设置，我们检查垃圾邮件扫描器的结果，如果出现任何错误，则邮件将以 554 错误代码被拒绝（例如，如果启用了 `has_virus_protection`，我们将检查垃圾邮件扫描器的病毒检测结果）。注意，所有免费计划用户默认启用成人内容、钓鱼、可执行文件和病毒的检查。默认情况下，所有付费计划用户也启用此功能，但此配置可以在 Forward Email 仪表板的域名设置页面中更改。

10. 对于每个处理过的收件人的转发地址，我们执行以下操作：

    * 检查该地址是否在我们的 [拒绝列表](#do-you-have-a-denylist) 中，如果在，则会发生 421 错误代码（表示发送者稍后重试）。
    * 如果该地址是 webhook，则为后续操作设置一个布尔值（见下文——我们会将类似的 webhook 分组，合并为一次 POST 请求，而不是多次请求以进行投递）。
    * 如果该地址是电子邮件地址，则解析其主机以供后续操作（见下文——我们会将类似的主机分组，合并为一次连接，而不是多次单独连接以进行投递）。
11. 如果没有收件人且没有退信，则我们响应一个550错误，提示“无效的收件人”。

12. 如果有收件人，则我们按相同主机分组迭代处理，并投递邮件。有关更多详情，请参见下面的章节 [你如何处理邮件投递问题](#how-do-you-handle-email-delivery-issues)。

    * 如果发送邮件时发生任何错误，我们会将其存储在内存中以便后续处理。
    * 我们将取发送邮件时出现的最低错误代码（如果有）作为对 `DATA` 命令的响应代码。这意味着未投递的邮件通常会由原始发送者重试，而已成功投递的邮件在下一次发送时不会被重新发送（因为我们使用了[指纹识别](#how-do-you-determine-an-email-fingerprint)）。
    * 如果没有发生错误，则我们会发送250成功的SMTP响应状态码。
    * 退信被定义为任何投递尝试导致状态码 >= 500（永久失败）的情况。

13. 如果没有发生退信（永久失败），则我们将返回非永久失败中最低错误代码的SMTP响应状态码（如果没有，则返回250成功状态码）。

14. 如果发生了退信，则我们会在返回所有错误代码中最低的代码给发送者后，后台发送退信邮件。但是，如果最低错误代码 >= 500，则我们不会发送任何退信邮件。原因是如果发送退信，发送者将收到双重退信邮件（例如，一个来自他们的外发MTA，如Gmail，另一个来自我们）。有关更多详情，请参见下面的章节 [你如何防止反弹邮件](#how-do-you-protect-against-backscatter)。

### 你如何处理邮件投递问题 {#how-do-you-handle-email-delivery-issues}

请注意，只有当发送者的DMARC策略未通过且没有与“From”头对齐的DKIM签名时，我们才会对邮件进行“Friendly-From”重写。这意味着我们会修改邮件的“From”头，设置“X-Original-From”，并且如果未设置“Reply-To”，也会设置该字段。修改这些头后，我们还会重新封装邮件的ARC封印。

我们还在堆栈的每个层级使用智能解析错误消息——包括我们的代码、DNS请求、Node.js内部、HTTP请求（例如，408、413和429错误会映射为收件人是Webhook时的SMTP响应代码421），以及邮件服务器响应（例如，包含“defer”或“slowdown”的响应会被重试为421错误）。

我们的逻辑非常健壮，还会针对SSL/TLS错误、连接问题等进行重试。健壮性的目标是最大化转发配置中所有收件人的邮件可达性。

如果收件人是Webhook，我们允许请求完成的超时时间为60秒，最多重试3次（即总共4次请求后失败）。请注意，我们正确解析错误代码408、413和429，并将其映射为SMTP响应代码421。

如果收件人是电子邮件地址，则我们会尝试使用机会TLS发送邮件（如果收件人邮件服务器支持STARTTLS，则尝试使用）。如果发送邮件时发生SSL/TLS错误，则会尝试不使用TLS（不使用STARTTLS）发送邮件。

如果发生任何DNS或连接错误，则我们会向 `DATA` 命令返回SMTP响应代码421；否则，如果出现 >= 500级别错误，则会发送退信。

如果我们检测到尝试投递的邮件服务器阻止了我们一个或多个邮件交换IP地址（例如，使用某种技术来延迟垃圾邮件发送者），则我们会发送SMTP响应代码421，要求发送者稍后重试（同时我们会收到警报，以便在下一次尝试前尽可能解决问题）。

### 你如何处理你的IP地址被封锁 {#how-do-you-handle-your-ip-addresses-becoming-blocked}
我们定期监控所有主要的 DNS 拒绝列表，如果我们的任何邮件交换（“MX”）IP 地址被列入主要拒绝列表，我们将在可能的情况下将其从相关的 DNS A 记录轮询中移除，直到问题解决。

截至本文撰写时，我们也被列入了多个 DNS 允许列表，并且我们非常重视拒绝列表的监控。如果您在我们有机会解决问题之前发现任何问题，请通过书面形式通知我们，邮箱地址为 <support@forwardemail.net>。

我们的 IP 地址是公开的，[请参阅下面的这一节以获取更多信息](#what-are-your-servers-ip-addresses)。

### 什么是邮局管理员地址 {#what-are-postmaster-addresses}

为了防止错误的退信和向无人监控或不存在的邮箱发送假期自动回复消息，我们维护了一份类似 mailer-daemon 的用户名列表：

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
* [以及任何不回复地址](#what-are-no-reply-addresses)

有关此类列表如何用于创建高效电子邮件系统的更多信息，请参阅 [RFC 5320 第 4.6 节](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6)。

### 什么是不回复地址 {#what-are-no-reply-addresses}

电子邮件用户名与以下任一项（不区分大小写）相同的地址被视为不回复地址：

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

此列表作为一个开源项目维护在 [GitHub](https://github.com/forwardemail/reserved-email-addresses-list)。

### 你的服务器 IP 地址是什么 {#what-are-your-servers-ip-addresses}

我们在 <https://forwardemail.net/ips> 公布我们的 IP 地址。

### 你们有允许列表吗 {#do-you-have-an-allowlist}

有的，我们有一个默认允许的[域名后缀列表](#what-domain-name-extensions-are-allowlisted-by-default)，以及基于[严格标准](#what-is-your-allowlist-criteria)的动态、缓存和滚动允许列表。

所有付费客户使用的域名、电子邮件和 IP 地址都会每小时自动与我们的拒绝列表进行核对——这会提醒管理员在必要时手动干预。

此外，如果您的某个域名或其电子邮件地址被列入拒绝列表（例如因发送垃圾邮件、病毒或冒充攻击），域名管理员（您）和我们的团队管理员将立即通过电子邮件收到通知。我们强烈建议您[配置 DMARC](#how-do-i-set-up-dmarc-for-forward-email)以防止此类情况。

### 默认允许的域名后缀有哪些 {#what-domain-name-extensions-are-allowlisted-by-default}

以下域名后缀默认被视为允许（无论它们是否在 Umbrella 流行度列表中）：

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">edu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov</code></li>
  <li class="list-inline-item"><code class="notranslate">mil</code></li>
  <li class="list-inline-item"><code class="notranslate">int</code></li>
  <li class="list-inline-item"><code class="notranslate">arpa</code></li>
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
此外，这些[品牌和企业顶级域名](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains)默认被允许（例如，Apple Card 银行对账单的 `applecard.apple` 中的 `apple`）：

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
  <li class="list-inline-item"><code class="notranslate">alibaba</code></li>
  <li class="list-inline-item"><code class="notranslate">alipay</code></li>
  <li class="list-inline-item"><code class="notranslate">allfinanz</code></li>
  <li class="list-inline-item"><code class="notranslate">allstate</code></li>
  <li class="list-inline-item"><code class="notranslate">ally</code></li>
  <li class="list-inline-item"><code class="notranslate">alstom</code></li>
  <li class="list-inline-item"><code class="notranslate">amazon</code></li>
  <li class="list-inline-item"><code class="notranslate">americanexpress</code></li>
  <li class="list-inline-item"><code class="notranslate">amex</code></li>
  <li class="list-inline-item"><code class="notranslate">amica</code></li>
  <li class="list-inline-item"><code class="notranslate">android</code></li>
  <li class="list-inline-item"><code class="notranslate">anz</code></li>
  <li class="list-inline-item"><code class="notranslate">aol</code></li>
  <li class="list-inline-item"><code class="notranslate">apple</code></li>
  <li class="list-inline-item"><code class="notranslate">aquarelle</code></li>
  <li class="list-inline-item"><code class="notranslate">aramco</code></li>
  <li class="list-inline-item"><code class="notranslate">audi</code></li>
  <li class="list-inline-item"><code class="notranslate">auspost</code></li>
  <li class="list-inline-item"><code class="notranslate">aws</code></li>
  <li class="list-inline-item"><code class="notranslate">axa</code></li>
  <li class="list-inline-item"><code class="notranslate">azure</code></li>
  <li class="list-inline-item"><code class="notranslate">baidu</code></li>
  <li class="list-inline-item"><code class="notranslate">bananarepublic</code></li>
  <li class="list-inline-item"><code class="notranslate">barclaycard</code></li>
  <li class="list-inline-item"><code class="notranslate">barclays</code></li>
  <li class="list-inline-item"><code class="notranslate">basketball</code></li>
  <li class="list-inline-item"><code class="notranslate">bauhaus</code></li>
  <li class="list-inline-item"><code class="notranslate">bbc</code></li>
  <li class="list-inline-item"><code class="notranslate">bbt</code></li>
  <li class="list-inline-item"><code class="notranslate">bbva</code></li>
  <li class="list-inline-item"><code class="notranslate">bcg</code></li>
  <li class="list-inline-item"><code class="notranslate">bentley</code></li>
  <li class="list-inline-item"><code class="notranslate">bharti</code></li>
  <li class="list-inline-item"><code class="notranslate">bing</code></li>
  <li class="list-inline-item"><code class="notranslate">blanco</code></li>
  <li class="list-inline-item"><code class="notranslate">bloomberg</code></li>
  <li class="list-inline-item"><code class="notranslate">bms</code></li>
  <li class="list-inline-item"><code class="notranslate">bmw</code></li>
  <li class="list-inline-item"><code class="notranslate">bnl</code></li>
  <li class="list-inline-item"><code class="notranslate">bnpparibas</code></li>
  <li class="list-inline-item"><code class="notranslate">boehringer</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">bond</code></li>-->
  <li class="list-inline-item"><code class="notranslate">booking</code></li>
  <li class="list-inline-item"><code class="notranslate">bosch</code></li>
  <li class="list-inline-item"><code class="notranslate">bostik</code></li>
  <li class="list-inline-item"><code class="notranslate">bradesco</code></li>
  <li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
  <li class="list-inline-item"><code class="notranslate">brother</code></li>
  <li class="list-inline-item"><code class="notranslate">bugatti</code></li>
  <li class="list-inline-item"><code class="notranslate">cal</code></li>
  <li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
  <li class="list-inline-item"><code class="notranslate">canon</code></li>
  <li class="list-inline-item"><code class="notranslate">capitalone</code></li>
  <li class="list-inline-item"><code class="notranslate">caravan</code></li>
  <li class="list-inline-item"><code class="notranslate">cartier</code></li>
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
  <li class="list-inline-item"><code class="notranslate">chrysler</code></li>
  <li class="list-inline-item"><code class="notranslate">cipriani</code></li>
  <li class="list-inline-item"><code class="notranslate">cisco</code></li>
  <li class="list-inline-item"><code class="notranslate">citadel</code></li>
  <li class="list-inline-item"><code class="notranslate">citi</code></li>
  <li class="list-inline-item"><code class="notranslate">citic</code></li>
  <li class="list-inline-item"><code class="notranslate">clubmed</code></li>
  <li class="list-inline-item"><code class="notranslate">comcast</code></li>
  <li class="list-inline-item"><code class="notranslate">commbank</code></li>
  <li class="list-inline-item"><code class="notranslate">creditunion</code></li>
  <li class="list-inline-item"><code class="notranslate">crown</code></li>
  <li class="list-inline-item"><code class="notranslate">crs</code></li>
  <li class="list-inline-item"><code class="notranslate">csc</code></li>
  <li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
  <li class="list-inline-item"><code class="notranslate">dabur</code></li>
  <li class="list-inline-item"><code class="notranslate">datsun</code></li>
  <li class="list-inline-item"><code class="notranslate">dealer</code></li>
  <li class="list-inline-item"><code class="notranslate">dell</code></li>
  <li class="list-inline-item"><code class="notranslate">deloitte</code></li>
  <li class="list-inline-item"><code class="notranslate">delta</code></li>
  <li class="list-inline-item"><code class="notranslate">dhl</code></li>
  <li class="list-inline-item"><code class="notranslate">discover</code></li>
  <li class="list-inline-item"><code class="notranslate">dish</code></li>
  <li class="list-inline-item"><code class="notranslate">dnp</code></li>
  <li class="list-inline-item"><code class="notranslate">dodge</code></li>
  <li class="list-inline-item"><code class="notranslate">dunlop</code></li>
  <li class="list-inline-item"><code class="notranslate">dupont</code></li>
  <li class="list-inline-item"><code class="notranslate">dvag</code></li>
  <li class="list-inline-item"><code class="notranslate">edeka</code></li>
  <li class="list-inline-item"><code class="notranslate">emerck</code></li>
  <li class="list-inline-item"><code class="notranslate">epson</code></li>
  <li class="list-inline-item"><code class="notranslate">ericsson</code></li>
  <li class="list-inline-item"><code class="notranslate">erni</code></li>
  <li class="list-inline-item"><code class="notranslate">esurance</code></li>
  <li class="list-inline-item"><code class="notranslate">etisalat</code></li>
  <li class="list-inline-item"><code class="notranslate">eurovision</code></li>
  <li class="list-inline-item"><code class="notranslate">everbank</code></li>
  <li class="list-inline-item"><code class="notranslate">extraspace</code></li>
  <li class="list-inline-item"><code class="notranslate">fage</code></li>
  <li class="list-inline-item"><code class="notranslate">fairwinds</code></li>
  <li class="list-inline-item"><code class="notranslate">farmers</code></li>
  <li class="list-inline-item"><code class="notranslate">fedex</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrari</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrero</code></li>
  <li class="list-inline-item"><code class="notranslate">fiat</code></li>
  <li class="list-inline-item"><code class="notranslate">fidelity</code></li>
  <li class="list-inline-item"><code class="notranslate">firestone</code></li>
  <li class="list-inline-item"><code class="notranslate">firmdale</code></li>
  <li class="list-inline-item"><code class="notranslate">flickr</code></li>
  <li class="list-inline-item"><code class="notranslate">flir</code></li>
  <li class="list-inline-item"><code class="notranslate">flsmidth</code></li>
  <li class="list-inline-item"><code class="notranslate">ford</code></li>
  <li class="list-inline-item"><code class="notranslate">fox</code></li>
  <li class="list-inline-item"><code class="notranslate">fresenius</code></li>
  <li class="list-inline-item"><code class="notranslate">forex</code></li>
  <li class="list-inline-item"><code class="notranslate">frogans</code></li>
  <li class="list-inline-item"><code class="notranslate">frontier</code></li>
  <li class="list-inline-item"><code class="notranslate">fujitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">fujixerox</code></li>
  <li class="list-inline-item"><code class="notranslate">gallo</code></li>
  <li class="list-inline-item"><code class="notranslate">gallup</code></li>
  <li class="list-inline-item"><code class="notranslate">gap</code></li>
  <li class="list-inline-item"><code class="notranslate">gbiz</code></li>
  <li class="list-inline-item"><code class="notranslate">gea</code></li>
  <li class="list-inline-item"><code class="notranslate">genting</code></li>
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
  <li class="list-inline-item"><code class="notranslate">guardian</code></li>
  <li class="list-inline-item"><code class="notranslate">gucci</code></li>
  <li class="list-inline-item"><code class="notranslate">hbo</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfc</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfcbank</code></li>
  <li class="list-inline-item"><code class="notranslate">hermes</code></li>
  <li class="list-inline-item"><code class="notranslate">hisamitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">hitachi</code></li>
  <li class="list-inline-item"><code class="notranslate">hkt</code></li>
  <li class="list-inline-item"><code class="notranslate">honda</code></li>
  <li class="list-inline-item"><code class="notranslate">honeywell</code></li>
  <li class="list-inline-item"><code class="notranslate">hotmail</code></li>
  <li class="list-inline-item"><code class="notranslate">hsbc</code></li>
  <li class="list-inline-item"><code class="notranslate">hughes</code></li>
  <li class="list-inline-item"><code class="notranslate">hyatt</code></li>
  <li class="list-inline-item"><code class="notranslate">hyundai</code></li>
  <li class="list-inline-item"><code class="notranslate">ibm</code></li>
  <li class="list-inline-item"><code class="notranslate">ieee</code></li>
  <li class="list-inline-item"><code class="notranslate">ifm</code></li>
  <li class="list-inline-item"><code class="notranslate">ikano</code></li>
  <li class="list-inline-item"><code class="notranslate">imdb</code></li>
  <li class="list-inline-item"><code class="notranslate">infiniti</code></li>
  <li class="list-inline-item"><code class="notranslate">intel</code></li>
  <li class="list-inline-item"><code class="notranslate">intuit</code></li>
  <li class="list-inline-item"><code class="notranslate">ipiranga</code></li>
  <li class="list-inline-item"><code class="notranslate">iselect</code></li>
  <li class="list-inline-item"><code class="notranslate">itau</code></li>
  <li class="list-inline-item"><code class="notranslate">itv</code></li>
  <li class="list-inline-item"><code class="notranslate">iveco</code></li>
  <li class="list-inline-item"><code class="notranslate">jaguar</code></li>
  <li class="list-inline-item"><code class="notranslate">java</code></li>
  <li class="list-inline-item"><code class="notranslate">jcb</code></li>
  <li class="list-inline-item"><code class="notranslate">jcp</code></li>
  <li class="list-inline-item"><code class="notranslate">jeep</code></li>
  <li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
  <li class="list-inline-item"><code class="notranslate">juniper</code></li>
  <li class="list-inline-item"><code class="notranslate">kddi</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryhotels</code></li>
  <li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryproperties</code></li>
  <li class="list-inline-item"><code class="notranslate">kfh</code></li>
  <li class="list-inline-item"><code class="notranslate">kia</code></li>
  <li class="list-inline-item"><code class="notranslate">kinder</code></li>
  <li class="list-inline-item"><code class="notranslate">kindle</code></li>
  <li class="list-inline-item"><code class="notranslate">komatsu</code></li>
  <li class="list-inline-item"><code class="notranslate">kpmg</code></li>
  <li class="list-inline-item"><code class="notranslate">kred</code></li>
  <li class="list-inline-item"><code class="notranslate">kuokgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">lacaixa</code></li>
  <li class="list-inline-item"><code class="notranslate">ladbrokes</code></li>
  <li class="list-inline-item"><code class="notranslate">lamborghini</code></li>
  <li class="list-inline-item"><code class="notranslate">lancaster</code></li>
  <li class="list-inline-item"><code class="notranslate">lancia</code></li>
  <li class="list-inline-item"><code class="notranslate">lancome</code></li>
  <li class="list-inline-item"><code class="notranslate">landrover</code></li>
  <li class="list-inline-item"><code class="notranslate">lanxess</code></li>
  <li class="list-inline-item"><code class="notranslate">lasalle</code></li>
  <li class="list-inline-item"><code class="notranslate">latrobe</code></li>
  <li class="list-inline-item"><code class="notranslate">lds</code></li>
  <li class="list-inline-item"><code class="notranslate">leclerc</code></li>
  <li class="list-inline-item"><code class="notranslate">lego</code></li>
  <li class="list-inline-item"><code class="notranslate">liaison</code></li>
  <li class="list-inline-item"><code class="notranslate">lexus</code></li>
  <li class="list-inline-item"><code class="notranslate">lidl</code></li>
  <li class="list-inline-item"><code class="notranslate">lifestyle</code></li>
  <li class="list-inline-item"><code class="notranslate">lilly</code></li>
  <li class="list-inline-item"><code class="notranslate">lincoln</code></li>
  <li class="list-inline-item"><code class="notranslate">linde</code></li>
  <li class="list-inline-item"><code class="notranslate">lipsy</code></li>
  <li class="list-inline-item"><code class="notranslate">lixil</code></li>
  <li class="list-inline-item"><code class="notranslate">locus</code></li>
  <li class="list-inline-item"><code class="notranslate">lotte</code></li>
  <li class="list-inline-item"><code class="notranslate">lpl</code></li>
  <li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
  <li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
  <li class="list-inline-item"><code class="notranslate">lupin</code></li>
  <li class="list-inline-item"><code class="notranslate">macys</code></li>
  <li class="list-inline-item"><code class="notranslate">maif</code></li>
  <li class="list-inline-item"><code class="notranslate">man</code></li>
  <li class="list-inline-item"><code class="notranslate">mango</code></li>
  <li class="list-inline-item"><code class="notranslate">marriott</code></li>
  <li class="list-inline-item"><code class="notranslate">maserati</code></li>
  <li class="list-inline-item"><code class="notranslate">mattel</code></li>
  <li class="list-inline-item"><code class="notranslate">mckinsey</code></li>
  <li class="list-inline-item"><code class="notranslate">metlife</code></li>
  <li class="list-inline-item"><code class="notranslate">microsoft</code></li>
  <li class="list-inline-item"><code class="notranslate">mini</code></li>
  <li class="list-inline-item"><code class="notranslate">mit</code></li>
  <li class="list-inline-item"><code class="notranslate">mitsubishi</code></li>
  <li class="list-inline-item"><code class="notranslate">mlb</code></li>
  <li class="list-inline-item"><code class="notranslate">mma</code></li>
  <li class="list-inline-item"><code class="notranslate">monash</code></li>
  <li class="list-inline-item"><code class="notranslate">mormon</code></li>
  <li class="list-inline-item"><code class="notranslate">moto</code></li>
  <li class="list-inline-item"><code class="notranslate">movistar</code></li>
  <li class="list-inline-item"><code class="notranslate">msd</code></li>
  <li class="list-inline-item"><code class="notranslate">mtn</code></li>
  <li class="list-inline-item"><code class="notranslate">mtr</code></li>
  <li class="list-inline-item"><code class="notranslate">mutual</code></li>
  <li class="list-inline-item"><code class="notranslate">nadex</code></li>
  <li class="list-inline-item"><code class="notranslate">nationwide</code></li>
  <li class="list-inline-item"><code class="notranslate">natura</code></li>
  <li class="list-inline-item"><code class="notranslate">nba</code></li>
  <li class="list-inline-item"><code class="notranslate">nec</code></li>
  <li class="list-inline-item"><code class="notranslate">netflix</code></li>
  <li class="list-inline-item"><code class="notranslate">neustar</code></li>
  <li class="list-inline-item"><code class="notranslate">newholland</code></li>
  <li class="list-inline-item"><code class="notranslate">nfl</code></li>
  <li class="list-inline-item"><code class="notranslate">nhk</code></li>
  <li class="list-inline-item"><code class="notranslate">nico</code></li>
  <li class="list-inline-item"><code class="notranslate">nike</code></li>
  <li class="list-inline-item"><code class="notranslate">nikon</code></li>
  <li class="list-inline-item"><code class="notranslate">nissan</code></li>
  <li class="list-inline-item"><code class="notranslate">nissay</code></li>
  <li class="list-inline-item"><code class="notranslate">nokia</code></li>
  <li class="list-inline-item"><code class="notranslate">northwesternmutual</code></li>
  <li class="list-inline-item"><code class="notranslate">norton</code></li>
  <li class="list-inline-item"><code class="notranslate">nra</code></li>
  <li class="list-inline-item"><code class="notranslate">ntt</code></li>
  <li class="list-inline-item"><code class="notranslate">obi</code></li>
  <li class="list-inline-item"><code class="notranslate">office</code></li>
  <li class="list-inline-item"><code class="notranslate">omega</code></li>
  <li class="list-inline-item"><code class="notranslate">oracle</code></li>
  <li class="list-inline-item"><code class="notranslate">orange</code></li>
  <li class="list-inline-item"><code class="notranslate">otsuka</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
  <li class="list-inline-item"><code class="notranslate">panasonic</code></li>
  <li class="list-inline-item"><code class="notranslate">pccw</code></li>
  <li class="list-inline-item"><code class="notranslate">pfizer</code></li>
  <li class="list-inline-item"><code class="notranslate">philips</code></li>
  <li class="list-inline-item"><code class="notranslate">piaget</code></li>
  <li class="list-inline-item"><code class="notranslate">pictet</code></li>
  <li class="list-inline-item"><code class="notranslate">ping</code></li>
  <li class="list-inline-item"><code class="notranslate">pioneer</code></li>
  <li class="list-inline-item"><code class="notranslate">play</code></li>
  <li class="list-inline-item"><code class="notranslate">playstation</code></li>
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
  <li class="list-inline-item"><code class="notranslate">samsung</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvik</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li>
  <li class="list-inline-item"><code class="notranslate">sanofi</code></li>
  <li class="list-inline-item"><code class="notranslate">sap</code></li>
  <li class="list-inline-item"><code class="notranslate">saxo</code></li>
  <li class="list-inline-item"><code class="notranslate">sbi</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>-->
  <li class="list-inline-item"><code class="notranslate">sca</code></li>
  <li class="list-inline-item"><code class="notranslate">scb</code></li>
  <li class="list-inline-item"><code class="notranslate">schaeffler</code></li>
  <li class="list-inline-item"><code class="notranslate">schmidt</code></li>
  <li class="list-inline-item"><code class="notranslate">schwarz</code></li>
  <li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
  <li class="list-inline-item"><code class="notranslate">scor</code></li>
  <li class="list-inline-item"><code class="notranslate">seat</code></li>
  <li class="list-inline-item"><code class="notranslate">sener</code></li>
  <li class="list-inline-item"><code class="notranslate">ses</code></li>
  <li class="list-inline-item"><code class="notranslate">sew</code></li>
  <li class="list-inline-item"><code class="notranslate">seven</code></li>
  <li class="list-inline-item"><code class="notranslate">sfr</code></li>
  <li class="list-inline-item"><code class="notranslate">seek</code></li>
  <li class="list-inline-item"><code class="notranslate">shangrila</code></li>
  <li class="list-inline-item"><code class="notranslate">sharp</code></li>
  <li class="list-inline-item"><code class="notranslate">shaw</code></li>
  <li class="list-inline-item"><code class="notranslate">shell</code></li>
  <li class="list-inline-item"><code class="notranslate">shriram</code></li>
  <li class="list-inline-item"><code class="notranslate">sina</code></li>
  <li class="list-inline-item"><code class="notranslate">sky</code></li>
  <li class="list-inline-item"><code class="notranslate">skype</code></li>
  <li class="list-inline-item"><code class="notranslate">smart</code></li>
  <li class="list-inline-item"><code class="notranslate">sncf</code></li>
  <li class="list-inline-item"><code class="notranslate">softbank</code></li>
  <li class="list-inline-item"><code class="notranslate">sohu</code></li>
  <li class="list-inline-item"><code class="notranslate">sony</code></li>
  <li class="list-inline-item"><code class="notranslate">spiegel</code></li>
  <li class="list-inline-item"><code class="notranslate">stada</code></li>
  <li class="list-inline-item"><code class="notranslate">staples</code></li>
  <li class="list-inline-item"><code class="notranslate">star</code></li>
  <li class="list-inline-item"><code class="notranslate">starhub</code></li>
  <li class="list-inline-item"><code class="notranslate">statebank</code></li>
  <li class="list-inline-item"><code class="notranslate">statefarm</code></li>
  <li class="list-inline-item"><code class="notranslate">statoil</code></li>
  <li class="list-inline-item"><code class="notranslate">stc</code></li>
  <li class="list-inline-item"><code class="notranslate">stcgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">suzuki</code></li>
  <li class="list-inline-item"><code class="notranslate">swatch</code></li>
  <li class="list-inline-item"><code class="notranslate">swiftcover</code></li>
  <li class="list-inline-item"><code class="notranslate">symantec</code></li>
  <li class="list-inline-item"><code class="notranslate">taobao</code></li>
  <li class="list-inline-item"><code class="notranslate">target</code></li>
  <li class="list-inline-item"><code class="notranslate">tatamotors</code></li>
  <li class="list-inline-item"><code class="notranslate">tdk</code></li>
  <li class="list-inline-item"><code class="notranslate">telecity</code></li>
  <li class="list-inline-item"><code class="notranslate">telefonica</code></li>
  <li class="list-inline-item"><code class="notranslate">temasek</code></li>
  <li class="list-inline-item"><code class="notranslate">teva</code></li>
  <li class="list-inline-item"><code class="notranslate">tiffany</code></li>
  <li class="list-inline-item"><code class="notranslate">tjx</code></li>
  <li class="list-inline-item"><code class="notranslate">toray</code></li>
  <li class="list-inline-item"><code class="notranslate">toshiba</code></li>
  <li class="list-inline-item"><code class="notranslate">total</code></li>
  <li class="list-inline-item"><code class="notranslate">toyota</code></li>
  <li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">travelers</code></li>
  <li class="list-inline-item"><code class="notranslate">tui</code></li>
  <li class="list-inline-item"><code class="notranslate">tvs</code></li>
  <li class="list-inline-item"><code class="notranslate">ubs</code></li>
  <li class="list-inline-item"><code class="notranslate">unicom</code></li>
  <li class="list-inline-item"><code class="notranslate">uol</code></li>
  <li class="list-inline-item"><code class="notranslate">ups</code></li>
  <li class="list-inline-item"><code class="notranslate">vanguard</code></li>
  <li class="list-inline-item"><code class="notranslate">verisign</code></li>
  <li class="list-inline-item"><code class="notranslate">vig</code></li>
  <li class="list-inline-item"><code class="notranslate">viking</code></li>
  <li class="list-inline-item"><code class="notranslate">virgin</code></li>
  <li class="list-inline-item"><code class="notranslate">visa</code></li>
  <li class="list-inline-item"><code class="notranslate">vista</code></li>
  <li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
  <li class="list-inline-item"><code class="notranslate">vivo</code></li>
  <li class="list-inline-item"><code class="notranslate">volkswagen</code></li>
  <li class="list-inline-item"><code class="notranslate">volvo</code></li>
  <li class="list-inline-item"><code class="notranslate">walmart</code></li>
  <li class="list-inline-item"><code class="notranslate">walter</code></li>
  <li class="list-inline-item"><code class="notranslate">weatherchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">weber</code></li>
  <li class="list-inline-item"><code class="notranslate">weir</code></li>
  <li class="list-inline-item"><code class="notranslate">williamhill</code></li>
  <li class="list-inline-item"><code class="notranslate">windows</code></li>
  <li class="list-inline-item"><code class="notranslate">wme</code></li>
  <li class="list-inline-item"><code class="notranslate">wolterskluwer</code></li>
  <li class="list-inline-item"><code class="notranslate">woodside</code></li>
  <li class="list-inline-item"><code class="notranslate">wtc</code></li>
  <li class="list-inline-item"><code class="notranslate">xbox</code></li>
  <li class="list-inline-item"><code class="notranslate">xerox</code></li>
  <li class="list-inline-item"><code class="notranslate">xfinity</code></li>
  <li class="list-inline-item"><code class="notranslate">yahoo</code></li>
  <li class="list-inline-item"><code class="notranslate">yamaxun</code></li>
  <li class="list-inline-item"><code class="notranslate">yandex</code></li>
  <li class="list-inline-item"><code class="notranslate">yodobashi</code></li>
  <li class="list-inline-item"><code class="notranslate">youtube</code></li>
  <li class="list-inline-item"><code class="notranslate">zappos</code></li>
  <li class="list-inline-item"><code class="notranslate">zara</code></li>
  <li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>
截至2025年3月18日，我们还将以下法国海外领土添加到此列表中（[根据此GitHub请求](https://github.com/forwardemail/forwardemail.net/issues/327)）：

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

截至2025年7月8日，我们添加了以下欧洲特定国家：

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

2025年10月，我们还根据需求添加了<code class="notranslate">cz</code>（捷克共和国）。

我们特别没有包含`ru`和`ua`，因为这两个地区的垃圾邮件活动较高。

### 你的允许列表标准是什么 {#what-is-your-allowlist-criteria}

我们有一个静态的[默认允许的域名后缀列表](#what-domain-name-extensions-are-allowlisted-by-default)——同时我们还维护一个基于以下严格标准的动态缓存滚动允许列表：

* 发件人根域名必须是[我们免费计划中提供的域名后缀列表](#what-domain-name-extensions-can-be-used-for-free)中的后缀（另外还包括`biz`和`info`）。我们还包括部分匹配的`edu`、`gov`和`mil`，例如`xyz.gov.au`和`xyz.edu.au`。
* 发件人根域名必须位于[Umbrella Popularity List](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List")（“UPL”）解析出的前100,000个唯一根域名中。
* 发件人根域名必须出现在过去7天中至少4天的UPL的前50,000个唯一根域名结果中（约50%以上）。
* 发件人根域名不得被Cloudflare分类为成人内容或恶意软件（[分类反馈](https://radar.cloudflare.com/categorization-feedback/)）。
* 发件人根域名必须设置有A记录或MX记录。
* 发件人根域名必须有A记录、MX记录、带有`p=reject`或`p=quarantine`的DMARC记录，或带有`-all`或`~all`限定符的SPF记录。

如果满足此标准，则发件人根域名将被缓存7天。请注意，我们的自动任务每天运行一次——因此这是一个每天更新的滚动允许列表缓存。

我们的自动任务会下载过去7天的UPL数据到内存，解压后根据上述严格标准进行内存解析。

在撰写本文时，诸如Google、Yahoo、Microsoft、Amazon、Meta、Twitter、Netflix、Spotify等流行域名当然包含在内。
如果您是未在我们的允许列表中的发件人，那么当您的 FQDN 根域名或 IP 地址首次发送电子邮件时，您将被[限速](#do-you-have-rate-limiting)和[灰名单](#do-you-have-a-greylist)。请注意，这是作为电子邮件标准采用的常规做法。大多数电子邮件服务器客户端在收到限速或灰名单错误（例如 421 或 4xx 级别错误状态码）时会尝试重试。

**请注意，特定发件人如 `a@gmail.com`、`b@xyz.edu` 和 `c@gov.au` 仍然可能被[拒绝列表](#do-you-have-a-denylist)**（例如，如果我们自动检测到这些发件人发送垃圾邮件、网络钓鱼或恶意软件）。

### 免费计划可使用哪些域名后缀 {#what-domain-name-extensions-can-be-used-for-free}

自 2023 年 3 月 31 日起，我们实施了一项新的全面垃圾邮件规则，以保护我们的用户和服务。

该新规则仅允许以下域名后缀在我们的免费计划中使用：

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ac</code></li>
  <li class="list-inline-item"><code class="notranslate">ad</code></li>
  <li class="list-inline-item"><code class="notranslate">ag</code></li>
  <li class="list-inline-item"><code class="notranslate">ai</code></li>
  <li class="list-inline-item"><code class="notranslate">al</code></li>
  <li class="list-inline-item"><code class="notranslate">am</code></li>
  <li class="list-inline-item"><code class="notranslate">app</code></li>
  <li class="list-inline-item"><code class="notranslate">as</code></li>
  <li class="list-inline-item"><code class="notranslate">at</code></li>
  <li class="list-inline-item"><code class="notranslate">au</code></li>
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">ba</code></li>
  <li class="list-inline-item"><code class="notranslate">be</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">br</code></li>
  <li class="list-inline-item"><code class="notranslate">by</code></li>
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">ca</code></li>
  <li class="list-inline-item"><code class="notranslate">cat</code></li>
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
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gl</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
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
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">lv</code></li>
  <li class="list-inline-item"><code class="notranslate">ly</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">md</code></li>
  <li class="list-inline-item"><code class="notranslate">me</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mn</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">ms</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">mu</code></li>
  <li class="list-inline-item"><code class="notranslate">mx</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">net</code></li>
  <li class="list-inline-item"><code class="notranslate">ni</code></li>
  <li class="list-inline-item"><code class="notranslate">nl</code></li>
  <li class="list-inline-item"><code class="notranslate">no</code></li>
  <li class="list-inline-item"><code class="notranslate">nu</code></li>
  <li class="list-inline-item"><code class="notranslate">nz</code></li>
  <li class="list-inline-item"><code class="notranslate">org</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pl</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">pr</code></li>
  <li class="list-inline-item"><code class="notranslate">pt</code></li>
  <li class="list-inline-item"><code class="notranslate">pw</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">rs</code></li>
  <li class="list-inline-item"><code class="notranslate">sc</code></li>
  <li class="list-inline-item"><code class="notranslate">se</code></li>
  <li class="list-inline-item"><code class="notranslate">sh</code></li>
  <li class="list-inline-item"><code class="notranslate">si</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">sm</code></li>
  <li class="list-inline-item"><code class="notranslate">sr</code></li>
  <li class="list-inline-item"><code class="notranslate">st</code></li>
  <li class="list-inline-item"><code class="notranslate">tc</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">tm</code></li>
  <li class="list-inline-item"><code class="notranslate">to</code></li>
  <li class="list-inline-item"><code class="notranslate">tv</code></li>
  <li class="list-inline-item"><code class="notranslate">uk</code></li>
  <li class="list-inline-item"><code class="notranslate">us</code></li>
  <li class="list-inline-item"><code class="notranslate">uz</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
  <li class="list-inline-item"><code class="notranslate">vc</code></li>
  <li class="list-inline-item"><code class="notranslate">vg</code></li>
  <li class="list-inline-item"><code class="notranslate">vu</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">ws</code></li>
  <li class="list-inline-item"><code class="notranslate">xyz</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
  <li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>
### 你们有灰名单吗 {#do-you-have-a-greylist}

是的，我们采用了非常宽松的 [邮件灰名单](https://en.wikipedia.org/wiki/Greylisting_\(email\)) 策略。灰名单只适用于不在我们的允许列表中的发件人，并且在我们的缓存中保存30天。

对于任何新发件人，我们会在Redis数据库中存储一个键，保存30天，值为其首次请求的初始到达时间。然后我们以450重试状态码拒绝他们的邮件，只有在经过5分钟后才允许通过。

如果他们成功等待了从初始到达时间起的5分钟，那么他们的邮件将被接受，不会再收到450状态码。

该键由FQDN根域名或发件人IP地址组成。这意味着任何通过灰名单的子域也会通过根域，反之亦然（这就是我们所说的“非常宽松”的策略）。

例如，如果一封邮件来自 `test.example.com`，而我们还未见过来自 `example.com` 的邮件，那么来自 `test.example.com` 和/或 `example.com` 的任何邮件都必须从连接的初始到达时间起等待5分钟。我们不会让 `test.example.com` 和 `example.com` 各自等待各自的5分钟（我们的灰名单策略适用于根域级别）。

请注意，灰名单不适用于任何在我们的[允许列表](#do-you-have-an-allowlist)中的发件人（例如本文撰写时的Meta、Amazon、Netflix、Google、Microsoft）。

### 你们有拒绝名单吗 {#do-you-have-a-denylist}

是的，我们运营自己的拒绝名单，并基于检测到的垃圾邮件和恶意活动实时自动更新，也会手动更新。

我们还每小时从 UCEPROTECT Level 1 拒绝名单 <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> 拉取所有IP地址，并将其加入我们的拒绝名单，过期时间为7天。

如果发件人被发现位于拒绝名单中，且[不在允许列表](#do-you-have-an-allowlist)，则会收到421错误码（表示发件人稍后重试）。

通过使用421状态码而非554状态码，可以实时缓解潜在的误判，然后消息可以在下一次尝试时成功投递。

**这与其他邮件服务不同**，其他服务一旦被列入黑名单，会发生硬性且永久的失败。请求发件人重试消息（尤其是大型组织）通常很困难，因此这种方法从初始邮件尝试起大约提供5天时间，让发件人、收件人或我们介入并解决问题（通过请求拒绝名单移除）。

所有拒绝名单移除请求均由管理员实时监控（例如，以便管理员永久允许反复出现的误判）。

拒绝名单移除请求可在 <https://forwardemail.net/denylist> 提交。付费用户的移除请求会即时处理，非付费用户则需等待管理员处理。

检测到发送垃圾邮件或病毒内容的发件人将按以下方式加入拒绝名单：

1. 在检测到垃圾邮件或来自“可信”发件人（例如 `gmail.com`、`microsoft.com`、`apple.com`）的黑名单时，[初始消息指纹](#how-do-you-determine-an-email-fingerprint) 会被灰名单处理。
   * 如果发件人在允许列表中，消息灰名单时间为1小时。
   * 如果发件人不在允许列表中，消息灰名单时间为6小时。
2. 我们从发件人和消息信息中解析拒绝名单键，对于每个键（如果不存在则创建），创建计数器，计数器加1，并缓存24小时。
   * 对于允许列表发件人：
     * 如果信封“MAIL FROM”邮箱通过SPF或无SPF，且不是[postmaster用户名](#what-are-postmaster-addresses)或[no-reply用户名](#what-are-no-reply-addresses)，则添加该键。
     * 如果“From”头在允许列表中，则如果“From”头邮箱通过SPF或通过且对齐的DKIM，则添加该键。
     * 如果“From”头不在允许列表中，则添加“From”头邮箱及其根解析域名的键。
   * 对于非允许列表发件人：
     * 如果信封“MAIL FROM”邮箱通过SPF，则添加该键。
     * 如果“From”头在允许列表中，则如果“From”头邮箱通过SPF或通过且对齐的DKIM，则添加该键。
     * 如果“From”头不在允许列表中，则添加“From”头邮箱及其根解析域名的键。
     * 添加发件人远程IP地址的键。
     * 添加通过IP地址反向查找解析出的客户端主机名的键（如果有）。
     * 添加客户端解析主机名的根域名键（如果有且与客户端主机名不同）。
3. 如果计数器达到5，且对应发件人和键不在允许列表，则该键被拒绝名单封禁30天，并向我们的滥用团队发送邮件。数字可能会变动，更新会在此反映。
4. 如果计数器达到10，且对应发件人和键在允许列表，则该键被拒绝名单封禁7天，并向我们的滥用团队发送邮件。数字可能会变动，更新会在此反映。
> **注意：** 在不久的将来，我们将引入声誉监控。声誉监控将基于百分比阈值来计算何时将发件人列入拒收名单（而不是如上所述的简单计数器）。

### 你们有速率限制吗 {#do-you-have-rate-limiting}

发件人速率限制是通过对发件人 IP 地址进行反向 PTR 查找解析出的根域名来实现的——如果没有结果，则直接使用发件人的 IP 地址。请注意，下面我们将其称为 `Sender`。

我们的 MX 服务器对接收的[加密 IMAP 存储](/blog/docs/best-quantum-safe-encrypted-email-service)的入站邮件有每日限制：

* 我们不是基于单个别名（例如 `you@yourdomain.com`）来限制入站邮件速率，而是基于别名的域名本身（例如 `yourdomain.com`）进行限制。这防止了 `Sender` 一次性向你域名下所有别箱的收件箱发送大量邮件。
* 我们有适用于所有 `Sender` 的通用限制，无论收件人是谁：
  * 我们认为是“可信”来源的 `Sender`（例如 `gmail.com`、`microsoft.com`、`apple.com`）每天限制发送 100 GB。
  * 被[允许列表](#do-you-have-an-allowlist)中的 `Sender` 每天限制发送 10 GB。
  * 其他所有 `Sender` 每天限制发送 1 GB 和/或 1000 条消息。
* 对于每个 `Sender` 和 `yourdomain.com`，我们有具体的每日限制为 1 GB 和/或 1000 条消息。

MX 服务器还通过速率限制限制转发给一个或多个收件人的邮件——但这只适用于不在[允许列表](#do-you-have-an-allowlist)中的 `Sender`：

* 我们每小时仅允许每个 `Sender` 解析出的 FQDN 根域名（或如果没有反向 PTR，则为 `Sender` 远程 IP 地址）以及每个信封收件人最多 100 个连接。我们将速率限制的键存储为 Redis 数据库中的加密哈希。

* 如果你通过我们的系统发送邮件，请确保为所有 IP 地址设置了反向 PTR（否则你发送的每个唯一 FQDN 根域名或 IP 地址都会被速率限制）。

* 请注意，如果你通过像 Amazon SES 这样流行的系统发送邮件，则不会被速率限制，因为（截至本文撰写时）Amazon SES 已列入我们的允许列表。

* 如果你从类似 `test.abc.123.example.com` 的域发送邮件，则速率限制将施加在 `example.com` 上。许多垃圾邮件发送者使用数百个子域来绕过仅对唯一主机名而非唯一 FQDN 根域名进行速率限制的常见垃圾邮件过滤器。

* 超过速率限制的 `Sender` 将被拒绝，返回 421 错误。

我们的 IMAP 和 SMTP 服务器限制你的别名同时连接数不超过 `60`。

我们的 MX 服务器限制[非允许列表](#do-you-have-an-allowlist)的发件人同时建立的连接数不超过 10（计数器缓存过期时间为 3 分钟，与我们的套接字超时 3 分钟相同）。

### 你们如何防止反弹邮件泛滥 {#how-do-you-protect-against-backscatter}

错误发送的退信或退信垃圾邮件（称为“[反弹邮件泛滥](https://en.wikipedia.org/wiki/Backscatter_\(email\))”）可能会对发件人 IP 地址造成负面声誉影响。

我们采取两步措施防止反弹邮件泛滥，具体内容详见以下章节 [防止已知 MAIL FROM 垃圾邮件发件人的退信](#prevent-bounces-from-known-mail-from-spammers) 和 [防止不必要的退信以防止反弹邮件泛滥](#prevent-unnecessary-bounces-to-protect-against-backscatter)。

### 防止已知 MAIL FROM 垃圾邮件发件人的退信 {#prevent-bounces-from-known-mail-from-spammers}

我们每小时从 [Backscatter.org](https://www.backscatterer.org/)（由 [UCEPROTECT](https://www.uceprotect.net/) 提供支持）拉取列表，地址为 <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz>，并将其导入我们的 Redis 数据库（我们还会提前比较差异；以防有需要遵守的 IP 被移除）。
如果 MAIL FROM 为空 或 等于（不区分大小写）任何一个 [postmaster 地址](#what-are-postmaster-addresses)（电子邮件中 @ 之前的部分），那么我们会检查发件人 IP 是否匹配此列表中的某个 IP。

如果发件人的 IP 在列表中（且不在我们的 [允许列表](#do-you-have-an-allowlist) 中），那么我们会发送 554 错误，消息为 `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`。如果发件人同时出现在 Backscatterer 列表和我们的允许列表中，我们会收到警报，以便在必要时解决问题。

本节描述的技术遵循 <https://www.backscatterer.org/?target=usage> 上的“安全模式”建议——只有在满足某些条件时才检查发件人 IP。

### 防止不必要的退信以防止反弹邮件 {#prevent-unnecessary-bounces-to-protect-against-backscatter}

退信是指邮件转发完全失败给收件人的邮件，且邮件不会被重试。

被列入 Backscatterer 列表的一个常见原因是错误的退信或退信垃圾邮件，因此我们必须通过以下几种方式进行防护：

1. 只有当发生 >= 500 状态码错误时才发送（当尝试转发的邮件失败时，例如 Gmail 返回 500 级错误）。

2. 只发送一次（我们使用计算出的退信指纹键并将其存储在缓存中以防止重复发送）。退信指纹是消息指纹与退信地址及其错误代码的哈希组合的键。有关消息指纹如何计算的更多信息，请参见 [指纹识别](#how-do-you-determine-an-email-fingerprint) 部分。成功发送的退信指纹将在我们的 Redis 缓存中 7 天后过期。

3. 仅当 MAIL FROM 和/或 From 不为空且不包含（不区分大小写）[postmaster 用户名](#what-are-postmaster-addresses)（电子邮件中 @ 之前的部分）时才发送。

4. 如果原始邮件包含以下任一头部（不区分大小写），则不发送：

   * `auto-submitted` 头部且值不等于 `no`。
   * `x-auto-response-suppress` 头部且值为 `dr`、`autoreply`、`auto-reply`、`auto_reply` 或 `all`。
   * `list-id`、`list-subscribe`、`list-unsubscribe`、`list-help`、`list-post`、`list-owner`、`list-archive`、`x-autoreply`、`x-autorespond` 或 `x-auto-respond` 头部（无论值为何）。
   * `precedence` 头部且值为 `bulk`、`autoreply`、`auto-reply`、`auto_reply` 或 `list`。

5. 如果 MAIL FROM 或 From 邮箱地址以 `+donotreply`、`-donotreply`、`+noreply` 或 `-noreply` 结尾，则不发送。

6. 如果 From 邮箱地址用户名部分为 `mdaemon` 且存在不区分大小写的 `X-MDDSN-Message` 头部，则不发送。

7. 如果存在不区分大小写的 `content-type` 头部且值为 `multipart/report`，则不发送。

### 如何确定邮件指纹 {#how-do-you-determine-an-email-fingerprint}

邮件指纹用于确定邮件的唯一性，防止重复邮件被投递以及防止发送[重复退信](#prevent-unnecessary-bounces-to-protect-against-backscatter)。

指纹由以下列表计算得出：

* 客户端解析的 FQDN 主机名或 IP 地址
* `Message-ID` 头部值（如果有）
* `Date` 头部值（如果有）
* `From` 头部值（如果有）
* `To` 头部值（如果有）
* `Cc` 头部值（如果有）
* `Subject` 头部值（如果有）
* `Body` 内容（如果有）

### 我可以将邮件转发到除 25 端口以外的端口吗（例如，如果我的 ISP 阻止了 25 端口） {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

可以，自 2020 年 5 月 5 日起我们已添加此功能。目前该功能是基于域的，而非基于别名。如果您需要基于别名的功能，请联系我们告知您的需求。

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    增强隐私保护：
  </strong>
  <span>
    如果您使用的是付费计划（该计划具备增强隐私保护功能），请前往 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户 <i class="fa fa-angle-right"></i> 域名</a>，点击您的域名旁的“设置”，然后点击“设置”选项。如果您想了解更多关于付费计划的信息，请参阅我们的 <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">价格</a> 页面。否则，您可以继续按照以下说明操作。
  </span>
</div>
如果您使用的是免费计划，只需添加一个新的 DNS <strong class="notranslate">TXT</strong> 记录，如下所示，但将端口从 25 更改为您选择的端口。

例如，如果我想让所有发送到 `example.com` 的邮件转发到别名收件人的 SMTP 端口 1337，而不是 25：

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
      <td><em>"@", ".", 或空白</em></td>
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
    自定义端口转发设置最常见的场景是您想将所有发送到 example.com 的邮件转发到 example.com 上的不同端口，而不是 SMTP 标准端口 25。要设置此功能，只需添加以下 <strong class="notranslate">TXT</strong> 通配符记录。
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
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=example.com</code></td>
    </tr>
  </tbody>
</table>

### 是否支持 Gmail 别名中的加号 + 符号 {#does-it-support-the-plus--symbol-for-gmail-aliases}

是的，完全支持。

### 是否支持子域名 {#does-it-support-sub-domains}

是的，完全支持。您只需将名称/主机/别名从 "@", ".", 或空白改为子域名名称即可。

如果您想让 `foo.example.com` 转发邮件，则在 DNS 设置中（MX 和 <strong class="notranslate">TXT</strong> 记录）将名称/主机/别名值设置为 `foo`。

### 这会转发我的邮件头信息吗 {#does-this-forward-my-emails-headers}

是的，完全会。

### 这个系统经过充分测试吗 {#is-this-well-tested}

是的，已经使用 [ava](https://github.com/avajs/ava) 编写了测试，并且有代码覆盖率。

### 是否传递 SMTP 响应消息和代码 {#do-you-pass-along-smtp-response-messages-and-codes}

是的，完全传递。例如，如果您发送邮件到 `hello@example.com`，且该地址注册转发到 `user@gmail.com`，那么 SMTP 响应消息和代码将来自 "gmail.com" 的 SMTP 服务器，而不是代理服务器 "mx1.forwardemail.net" 或 "mx2.forwardemail.net"。

### 如何防止垃圾邮件发送者并确保良好的邮件转发声誉 {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

请参阅上文中关于 [您的邮件转发系统如何工作](#how-does-your-email-forwarding-system-work)、[您如何处理邮件投递问题](#how-do-you-handle-email-delivery-issues) 和 [您如何处理 IP 地址被封锁](#how-do-you-handle-your-ip-addresses-becoming-blocked) 的章节。

### 您如何对域名执行 DNS 查询 {#how-do-you-perform-dns-lookups-on-domain-names}

我们创建了一个开源软件项目 :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) 并用它进行 DNS 查询。默认使用的 DNS 服务器是 `1.1.1.1` 和 `1.0.0.1`，DNS 查询通过应用层的 [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") 进行。

:tangerine: [Tangerine](https://github.com/tangerine) 默认使用 [CloudFlare 的隐私优先消费者 DNS 服务][cloudflare-dns]。


## 账户与计费 {#account-and-billing}

### 付费计划是否提供退款保证 {#do-you-offer-a-money-back-guarantee-on-paid-plans}

是的！当您在计划开始后的 30 天内升级、降级或取消账户时，会自动退款。此政策仅适用于首次客户。
### 如果我切换套餐，你们会按比例退款差价吗 {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

当您切换套餐时，我们不会按比例退款差价。相反，我们会将您现有套餐剩余的有效期从过期日期转换为新套餐的最接近的相对时长（按月向下取整）。

请注意，如果您在首次开始付费套餐后的30天内升级或降级付费套餐，我们将自动全额退款您现有套餐的费用。

### 我可以仅将此邮件转发服务用作“备用”或“故障转移”MX服务器吗 {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

不建议这样做，因为您一次只能使用一个邮件交换服务器。由于优先级配置错误和邮件服务器不尊重MX交换优先级检查，备用服务器通常不会被重试。

### 我可以禁用特定别名吗 {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要提示：
  </strong>
  <span>
    如果您使用的是付费套餐，则必须前往 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 别名 <i class="fa fa-angle-right"></i> 编辑别名 <i class="fa fa-angle-right"></i> 取消勾选“激活”复选框 <i class="fa fa-angle-right"></i> 继续。
  </span>
</div>

是的，只需编辑您的DNS <strong class="notranslate">TXT</strong> 记录，并在别名前加上一个、两个或三个感叹号（见下文）。

请注意，您*应该*保留“:”映射，因为如果您以后决定关闭此功能，这个是必需的（如果您升级到我们的付费套餐，也用于导入）。

**静默拒绝（发送者看到邮件发送成功，但邮件实际上无处可去）（状态码 `250`）：** 如果您在别名前加上“!”（单个感叹号），则向尝试发送到该地址的发送者返回成功状态码 `250`，但邮件本身将无处可去（例如黑洞或 `/dev/null`）。

**软拒绝（状态码 `421`）：** 如果您在别名前加上“!!”（双感叹号），则向尝试发送到该地址的发送者返回软错误状态码 `421`，邮件通常会被重试最多5天，然后被拒绝并退回。

**硬拒绝（状态码 `550`）：** 如果您在别名前加上“!!!”（三感叹号），则向尝试发送到该地址的发送者返回永久错误状态码 `550`，邮件将被拒绝并退回。

例如，如果我想让所有发送到 `alias@example.com` 的邮件停止转发到 `user@gmail.com` 并被拒绝退回（例如使用三个感叹号）：

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
      <td><em>"@", ".", 或空白</em></td>
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
    您也可以将转发的收件人地址重写为简单的 "nobody@forwardemail.net"，这会将邮件路由到 nobody，如下面的示例所示。
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
      <td><em>"@", ".", 或空白</em></td>
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
    如果您想提高安全性，也可以删除 ":user@gmail.com"（或 ":nobody@forwardemail.net"）部分，只保留下面示例中的 "!!!alias"。
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
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias</code></td>
    </tr>
  </tbody>
</table>

### 我可以将邮件转发给多个收件人吗 {#can-i-forward-emails-to-multiple-recipients}

当然可以。只需在您的 <strong class="notranslate">TXT</strong> 记录中指定多个收件人。

例如，如果我想将发送到 `hello@example.com` 的邮件转发到 `user+a@gmail.com` 和 `user+b@gmail.com`，那么我的 <strong class="notranslate">TXT</strong> 记录如下：

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
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

或者，您也可以分两行指定，如下所示：

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
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

由您决定！

### 我可以有多个全局通配收件人吗 {#can-i-have-multiple-global-catch-all-recipients}

可以。只需在您的 <strong class="notranslate">TXT</strong> 记录中指定多个全局通配收件人。

例如，如果我想将发送到 `*@example.com`（星号表示通配符，即全局通配） 的所有邮件转发到 `user+a@gmail.com` 和 `user+b@gmail.com`，那么我的 <strong class="notranslate">TXT</strong> 记录如下：

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
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

或者，您也可以分两行指定，如下所示：

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
      <td><em>"@", ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@, ".", 或空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>
由你决定！

### 每个别名我可以转发到的电子邮件地址数量有限制吗 {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

是的，默认限制是10个。这并不意味着你的域名只能有10个别名。你可以拥有任意数量的别名（无限制）。这意味着你只能将一个别名转发到10个唯一的电子邮件地址。你可以有 `hello:user+1@gmail.com`、`hello:user+2@gmail.com`、`hello:user+3@gmail.com`，……（从1到10）——任何发送到 `hello@example.com` 的邮件都会被转发到 `user+1@gmail.com`、`user+2@gmail.com`、`user+3@gmail.com`，……（从1到10）。

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    提示：
  </strong>
  <span>
    需要每个别名超过10个收件人？给我们发送电子邮件，我们很乐意为你的账户提高限制。
  </span>
</div>

### 我可以递归转发邮件吗 {#can-i-recursively-forward-emails}

可以，不过你仍然必须遵守最大限制。如果你有 `hello:linus@example.com` 和 `linus:user@gmail.com`，那么发送到 `hello@example.com` 的邮件会被转发到 `linus@example.com` 和 `user@gmail.com`。请注意，如果你尝试递归转发邮件超过最大限制，将会抛出错误。

### 人们可以在未经我允许的情况下注销或注册我的邮件转发吗 {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

我们使用 MX 和 <strong class="notranslate">TXT</strong> 记录验证，因此如果你添加了本服务相应的 MX 和 <strong class="notranslate">TXT</strong> 记录，那么你就是已注册状态。如果你移除它们，则为未注册状态。你拥有你的域名和 DNS 管理权限，所以如果有人能访问这些，那就是一个问题。

### 这是如何免费的 {#how-is-it-free}

Forward Email 通过开源开发、高效基础设施和支持服务的可选付费计划，提供免费层服务。

我们的免费层由以下支持：

1. **开源开发**：我们的代码库是开源的，允许社区贡献和透明运营。

2. **高效基础设施**：我们优化了系统，以最小资源处理邮件转发。

3. **付费高级计划**：需要额外功能如 SMTP 发送、IMAP 接收或增强隐私选项的用户订阅我们的付费计划。

4. **合理使用限制**：免费层有公平使用政策以防止滥用。

> \[!NOTE]
> 我们致力于保持基础邮件转发免费，同时为有更高级需求的用户提供高级功能。

> \[!TIP]
> 如果你觉得我们的服务有价值，考虑升级到付费计划以支持持续开发和维护。

### 最大邮件大小限制是多少 {#what-is-the-max-email-size-limit}

我们默认的大小限制是50MB，包括内容、头部和附件。请注意，像 Gmail 和 Outlook 这样的服务只允许25MB大小限制，如果你发送到这些提供商的地址时超过限制，会收到错误消息。

如果文件大小超过限制，会返回带有正确响应代码的错误。

### 你们会存储邮件日志吗 {#do-you-store-logs-of-emails}

不会，我们不写入磁盘或存储日志——[错误日志除外](#do-you-store-error-logs) 和 [外发 SMTP](#do-you-support-sending-email-with-smtp)（详见我们的[隐私政策](/privacy)）。

所有操作均在内存中完成，[我们的源代码托管在 GitHub](https://github.com/forwardemail)。

### 你们会存储错误日志吗 {#do-you-store-error-logs}

**会。你可以在 [我的账户 → 日志](/my-account/logs) 或 [我的账户 → 域名](/my-account/domains) 下访问错误日志。**

截至2023年2月，我们存储 `4xx` 和 `5xx` SMTP 响应代码的错误日志，保存期限为7天——日志包含 SMTP 错误、信封和邮件头（我们**不**存储邮件正文和附件）。
错误日志允许您检查是否有重要邮件丢失，并减少针对[您的域名](/my-account/domains)的垃圾邮件误判。它们也是调试[email webhooks](#do-you-support-webhooks)问题的极好资源（因为错误日志包含 webhook 端点的响应）。

由于连接会提前结束（例如在 `RCPT TO` 和 `MAIL FROM` 命令传输之前），[速率限制](#do-you-have-rate-limiting)和[灰名单](#do-you-have-a-greylist)的错误日志无法访问。

有关更多信息，请参阅我们的[隐私政策](/privacy)。

### 你们会读取我的邮件吗 {#do-you-read-my-emails}

绝对不会。请参阅我们的[隐私政策](/privacy)。

许多其他邮件转发服务会存储并可能读取您的邮件。转发的邮件没有理由必须存储到磁盘存储中——因此我们设计了第一个完全在内存中运行的开源解决方案。

我们相信您应享有隐私权，并严格尊重这一点。部署到服务器的代码是[GitHub 上的开源软件](https://github.com/forwardemail)，以保证透明度并建立信任。

### 我可以用这个功能在 Gmail 中“以此身份发送邮件”吗 {#can-i-send-mail-as-in-gmail-with-this}

可以！自 2018 年 10 月 2 日起，我们已添加此功能。请参阅上文的[如何使用 Gmail 以此身份发送邮件](#how-to-send-mail-as-using-gmail)！

您还应在 DNS 配置的 <strong class="notranslate">TXT</strong> 记录中设置 Gmail 的 SPF 记录。

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要提示：
  </strong>
  <span>
    如果您使用 Gmail（例如“以此身份发送邮件”）或 G Suite，则需要在 SPF <strong class="notranslate">TXT</strong> 记录中追加 <code>include:_spf.google.com</code>，例如：
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### 我可以用这个功能在 Outlook 中“以此身份发送邮件”吗 {#can-i-send-mail-as-in-outlook-with-this}

可以！自 2018 年 10 月 2 日起，我们已添加此功能。请查看微软以下两个链接：

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

您还应在 DNS 配置的 <strong class="notranslate">TXT</strong> 记录中设置 Outlook 的 SPF 记录。

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要提示：
  </strong>
  <span>
    如果您使用 Microsoft Outlook 或 Live.com，则需要在 SPF <strong class="notranslate">TXT</strong> 记录中追加 <code>include:spf.protection.outlook.com</code>，例如：
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### 我可以用这个功能在 Apple Mail 和 iCloud Mail 中“以此身份发送邮件”吗 {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

如果您是 iCloud+ 订阅用户，可以使用自定义域名。[我们的服务也兼容 Apple Mail](#apple-mail)。

详情请参阅 <https://support.apple.com/en-us/102540>。

### 我可以用这个功能转发无限量的邮件吗 {#can-i-forward-unlimited-emails-with-this}

可以，但“相对不知名”的发件人每个主机名或 IP 每小时连接数限制为 100 次。请参阅上文的[速率限制](#do-you-have-rate-limiting)和[灰名单](#do-you-have-a-greylist)部分。

“相对不知名”指的是未出现在[允许列表](#do-you-have-an-allowlist)中的发件人。

如果超过此限制，我们会发送 421 响应码，告知发件人的邮件服务器稍后重试。

### 你们是否提供一个价格支持无限域名 {#do-you-offer-unlimited-domains-for-one-price}

是的。无论您使用哪个套餐，您只需支付一个月费——涵盖您所有的域名。
### 您接受哪些支付方式 {#which-payment-methods-do-you-accept}

Forward Email 接受以下一次性或每月/每季度/每年支付方式：

1. **信用卡/借记卡/银行转账**：Visa、Mastercard、American Express、Discover、JCB、大来卡等。
2. **PayPal**：连接您的 PayPal 账户以便轻松支付
3. **加密货币**：我们通过 Stripe 在以太坊、Polygon 和 Solana 网络上的稳定币支付接受付款

> \[!NOTE]
> 我们在服务器上存储有限的支付信息，仅包括支付标识符以及对 [Stripe](https://stripe.com/global) 和 [PayPal](https://www.paypal.com) 交易、客户、订阅和支付 ID 的引用。

> \[!TIP]
> 为了最大限度保护隐私，建议使用加密货币支付。

所有支付均通过 Stripe 或 PayPal 安全处理。您的支付详情绝不会存储在我们的服务器上。


## 额外资源 {#additional-resources}

> \[!TIP]
> 我们下面的文章会定期更新新的指南、技巧和技术信息。请经常回来查看最新内容。

* [案例研究与开发者文档](/blog/docs)
* [资源](/resources)
* [指南](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
