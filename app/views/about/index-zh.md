# 关于 Forward Email {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email 团队和公司故事" class="rounded-lg" />

# 关于 Forward Email {#about-forward-email-1}


## 目录 {#table-of-contents}

* [概览](#overview)
* [创始人和使命](#founder-and-mission)
* [时间线](#timeline)
  * [2017 - 创立与启动](#2017---founding-and-launch)
  * [2018 - 基础设施与集成](#2018---infrastructure-and-integration)
  * [2019 - 性能革命](#2019---performance-revolution)
  * [2020 - 隐私与安全聚焦](#2020---privacy-and-security-focus)
  * [2021 - 平台现代化](#2021---platform-modernization)
  * [2023 - 基础设施与功能扩展](#2023---infrastructure-and-feature-expansion)
  * [2024 - 服务优化与高级功能](#2024---service-optimization-and-advanced-features)
  * [2025 - 隐私增强与协议支持 {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - RFC 合规与高级过滤 {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [核心原则](#core-principles)
* [当前状态](#current-status)


## 概览 {#overview}

> \[!TIP]
> 有关我们架构、安全实现和路线图的技术细节，请参阅[技术白皮书](https://forwardemail.net/technical-whitepaper.pdf)。

Forward Email 是一项[免费且开源](https://en.wikipedia.org/wiki/Free_and_open-source "免费且开源")的[邮件转发](https://en.wikipedia.org/wiki/Email_forwarding "邮件转发")服务，专注于用户的[隐私权](https://en.wikipedia.org/wiki/Right_to_privacy "隐私权")。它起初是2017年推出的一个简单邮件转发解决方案，现已发展成为一个全面的邮件平台，提供无限制的自定义域名、无限制的邮箱地址和别名、无限制的一次性邮箱地址、垃圾邮件和钓鱼防护、加密邮箱存储以及众多高级功能。

该服务由最初的设计师和开发者团队维护和拥有。它完全基于开源软件构建，使用了[JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript")、[Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")、[DNS](https://en.wikipedia.org/wiki/Domain_Name_System "域名系统")、[HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS")、[TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS")和[SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP")。


## 创始人和使命 {#founder-and-mission}

Forward Email 由**Nicholas Baugh**于2017年创立。根据[Forward Email 技术白皮书](https://forwardemail.net/technical-whitepaper.pdf)，Baugh 最初是在为他的副项目寻找一种经济且简单的域名邮件解决方案。在调研现有选项后，他开始编写自己的解决方案，并于2017年10月2日购买了域名 `forwardemail.net`。

Forward Email 的使命不仅仅是提供邮件服务——它旨在改变行业对邮件隐私和安全的态度。公司的核心价值观包括透明度、用户控制权，以及通过技术实现隐私保护，而不仅仅是政策承诺。


## 时间线 {#timeline}

### 2017 - 创立与启动 {#2017---founding-and-launch}

**2017年10月2日**：Nicholas Baugh 在调研经济实惠的邮件解决方案后，购买了域名 `forwardemail.net`，用于他的副项目。

**2017年11月5日**：Baugh 使用[Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")编写了一个634行的 JavaScript 文件，用于转发任何自定义域名的邮件。该初始实现作为开源项目发布在[GitHub](https://github.com/forwardemail)，并通过 GitHub Pages 启动了服务。
**2017年11月**：Forward Email在初始版本发布后正式推出。早期版本完全基于DNS，无需账户注册或登录流程——仅有一个用Markdown编写的README文件，内含说明。用户只需通过配置MX记录指向`mx1.forwardemail.net`和`mx2.forwardemail.net`，并添加包含`forward-email=user@gmail.com`的TXT记录，即可设置邮件转发。

这种简洁且高效的解决方案吸引了知名开发者的关注，包括Ruby on Rails的创建者[David Heinemeier Hansson](https://dhh.dk)，他至今仍在其域名`dhh.dk`上使用Forward Email。

### 2018 - 基础设施与集成 {#2018---infrastructure-and-integration}

**2018年4月**：当[Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare")推出其[以隐私为先的消费者DNS服务](https://blog.cloudflare.com/announcing-1111/)，Forward Email将DNS查询处理从使用[OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS")切换到[Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare")，体现了公司对隐私优先基础设施选择的承诺。

**2018年10月**：Forward Email允许用户通过[Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail")和[Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook")实现“以此身份发送邮件”，扩展了与主流邮件服务提供商的集成能力。

### 2019 - 性能革命 {#2019---performance-revolution}

**2019年5月**：Forward Email发布了v2版本，代表了对初始版本的重大重写。此次更新通过使用[Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")的[streams](https://en.wikipedia.org/wiki/Streams "Streams")，专注于[性能](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing")提升，为平台的可扩展性奠定了基础。

### 2020 - 隐私与安全聚焦 {#2020---privacy-and-security-focus}

**2020年2月**：Forward Email发布了增强隐私保护计划，允许用户关闭在其邮件转发配置别名中设置公共DNS记录条目。通过该计划，用户的邮件别名信息不会被公开搜索到。公司还推出了启用或禁用特定别名的功能，同时仍允许这些别名作为有效邮箱地址出现并返回成功的[SMTP状态码](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes")，邮件会被立即丢弃（类似于将输出重定向到[/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")）。

**2020年4月**：在现有垃圾邮件检测解决方案未能遵守Forward Email隐私政策的多次阻碍后，公司发布了其初始alpha版本的垃圾邮件扫描器。这是一款完全免费且开源的[反垃圾邮件过滤](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques")解决方案，采用[朴素贝叶斯垃圾邮件过滤](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering")方法，结合[反钓鱼](https://en.wikipedia.org/wiki/Phishing "Phishing")和[IDN同形异义攻击](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack")防护。Forward Email还推出了基于[一次性密码](https://en.wikipedia.org/wiki/One-time_password "One-time password")（OTP）的[双因素认证](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication")（2FA），以增强账户安全。

**2020年5月**：Forward Email允许自定义[端口转发](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding")，作为用户绕过其[ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider")端口阻塞的解决方案。公司还发布了其[免费邮件转发RESTful API](email-api)，提供完整文档和实时请求与响应示例，并支持webhooks。
**2020年8月**：Forward Email 增加了对[Authenticated Received Chain](arc)（“ARC”）电子邮件认证系统的支持，进一步增强了电子邮件的安全性和可达性。

**2020年11月23日**：Forward Email 正式从测试版推出，标志着平台发展的一个重要里程碑。

### 2021年 - 平台现代化 {#2021---platform-modernization}

**2021年2月**：Forward Email 重构了代码库，移除了所有对[Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)")的依赖，使其技术栈完全基于[JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript")和[Node.js](https://en.wikipedia.org/wiki/Node.js)。这一架构决策符合公司保持一致且开源技术栈的承诺。

**2021年9月27日**：Forward Email [增加了对](email-forwarding-regex-pattern-filter)电子邮件转发别名匹配[正则表达式](https://en.wikipedia.org/wiki/Regular_expression "Regular expression")的支持，为用户提供了更复杂的邮件路由功能。

### 2023年 - 基础设施和功能扩展 {#2023---infrastructure-and-feature-expansion}

**2023年1月**：Forward Email 推出了重新设计并优化页面加载速度的网站，提升了用户体验和性能。

**2023年2月**：公司增加了对[错误日志](/faq#do-you-store-error-logs)的支持，并实现了[暗色模式](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme)网站配色方案，以响应用户偏好和无障碍需求。

**2023年3月**：Forward Email 发布了[Tangerine](https://github.com/forwardemail/tangerine#readme)并将其集成到整个基础设施中，实现了应用层的[DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS)（“DoH”）功能。公司还增加了对[MTA-STS](/faq#do-you-support-mta-sts)的支持，并从[hCaptcha](/)切换到[Cloudflare Turnstile](https://developers.cloudflare.com/turnstile)。

**2023年4月**：Forward Email 实施并完全自动化了全新的基础设施。整个服务开始运行在全球负载均衡和基于地理位置的DNS上，配备健康检查和故障切换，使用[Cloudflare](https://cloudflare.com)，取代了之前的轮询DNS方式。公司切换到多家供应商的**裸金属服务器**，包括符合SOC 2 Type 1标准的[Vultr](https://www.vultr.com/?ref=429848)和[Digital Ocean](https://m.do.co/c/a7cecd27e071)。MongoDB和Redis数据库迁移到带有主节点和备用节点的集群配置，实现高可用性、端到端SSL加密、静态加密和时间点恢复（PITR）。

**2023年5月**：Forward Email 推出了**出站SMTP**功能，支持[通过SMTP发送邮件](/faq#do-you-support-sending-email-with-smtp)和[通过API发送邮件](/faq#do-you-support-sending-email-with-api)请求。该功能内置保障措施以确保高投递率，拥有现代且强大的队列和重试系统，并且[支持实时错误日志](/faq#do-you-store-error-logs)。

**2023年11月**：Forward Email 推出了[**加密邮箱存储**](/blog/docs/best-quantum-safe-encrypted-email-service)功能，支持[IMAP](/faq#do-you-support-receiving-email-with-imap)，代表了电子邮件隐私和安全性的重大进步。

**2023年12月**：公司[增加了对](/faq#do-you-support-pop3)[POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol)、[通行密钥和WebAuthn](/faq#do-you-support-passkeys-and-webauthn)、[收件时间监控](/faq#i)以及[IMAP存储的OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)的支持。

### 2024年 - 服务优化与高级功能 {#2024---service-optimization-and-advanced-features}

**2024年2月**：Forward Email [增加了日历（CalDAV）支持](/faq#do-you-support-calendars-caldav)，将平台功能扩展到电子邮件之外，支持日历同步。
**2024年3月至7月**：Forward Email 对其 IMAP、POP3 和 CalDAV 服务进行了重大优化和改进，目标是使其服务速度达到甚至超过其他替代方案。

**2024年7月**：公司[新增了 iOS 推送支持](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016)，以解决 iOS 上 Apple Mail 不支持 IMAP `IDLE` 命令的问题，实现 Apple iOS 设备的实时通知。Forward Email 还增加了对自家服务及 Yahoo/AOL 的收件箱时间（“TTI”）监控，并开始允许用户即使在免费计划中也能加密整个 DNS TXT 记录。根据[Privacy Guides 讨论](https://discuss.privacyguides.net/t/forward-email-email-provider/13370)和[GitHub 问题](https://github.com/forwardemail/forwardemail.net/issues/254)的请求，公司新增了别名在禁用时可以选择静默拒绝 `250`、软拒绝 `421` 或硬拒绝 `550` 的功能。

**2024年8月**：Forward Email 新增支持将邮箱导出为[EML](https://en.wikipedia.org/wiki/Email#Filename_extensions)和[Mbox](https://en.wikipedia.org/wiki/Mbox)格式（除了已有的[SQLite](https://en.wikipedia.org/wiki/SQLite)导出格式）。[Webhook 签名支持也被添加](https://forwardemail.net/faq#do-you-support-bounce-webhooks)，公司开始允许用户通过其外发 SMTP 服务发送新闻通讯、公告和电子邮件营销。还实施了针对 IMAP/POP3/CalDAV 的全域及别名特定存储配额。

### 2025 - 隐私增强与协议支持 {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**2024年9月至2025年1月**：Forward Email [新增了备受期待的假期自动回复功能和用于邮件转发的 OpenPGP/WKD 加密](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254)，在其已实现的加密邮箱存储功能基础上进一步扩展。

**2025年1月21日**：创始人的挚友“Jack”，他忠诚的犬类伙伴，安详地离世，享年近11岁。Jack [将永远被铭记](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b)，感谢他坚定的陪伴支持了 Forward Email 的创建。[Forward Email 技术白皮书](https://forwardemail.net/technical-whitepaper.pdf) 特别献给 Jack，致敬他在服务开发中的贡献。

**2025年2月**：Forward Email 选择 [DataPacket](https://www.datapacket.com) 作为新的主要数据中心供应商，部署定制的、以性能为重点的裸金属硬件，进一步提升服务的可靠性和速度。

**2025年3月**：Forward Email 1.0 版本正式发布。

**2025年4月**：发布了首个[Forward Email 技术白皮书](https://forwardemail.net/technical-whitepaper.pdf)，公司开始接受加密货币支付。

**2025年5月**：服务推出了使用 [Scalar](https://github.com/scalar/scalar) 的新 API 文档。

**2025年6月**：Forward Email 推出对[CardDAV 协议](/faq#do-you-support-contacts-carddav)的支持，扩展平台功能，新增联系人同步，补充现有的邮件和日历服务。

**2025年8月**：平台新增了[CalDAV VTODO/任务支持](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\))，实现任务管理与日历事件的结合。

**2025年11月**：平台安全性提升，密码哈希算法从 PBKDF2 迁移至[Argon2id](https://en.wikipedia.org/wiki/Argon2)，基础设施从 Redis 迁移至[Valkey](https://github.com/valkey-io/valkey)。

**2025年12月**：发布 2.0 版本，引入了[REQUIRETLS (RFC 8689)](/rfc#requiretls-support) 支持，实现邮件传输的强制 TLS 加密，并升级至 [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) v6。
### 2026 - RFC 合规性与高级过滤 {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**2026 年 1 月**：Forward Email 发布了全面的 [RFC 协议合规文档](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison)，并新增支持 [S/MIME 加密 (RFC 8551)](/faq#do-you-support-smime-encryption) 以及全面的 [Sieve 邮件过滤 (RFC 5228)](/faq#do-you-support-sieve-email-filtering) 和 [ManageSieve 协议 (RFC 5804)](/faq#do-you-support-sieve-email-filtering) 支持。REST API 也扩展到了 39 个端点。

**2026 年 2 月**：官方开源的网页邮件客户端在 [mail.forwardemail.net](https://mail.forwardemail.net) 上线（[GitHub 源代码](https://github.com/forwardemail/mail.forwardemail.net)）。平台还新增支持 [CalDAV 调度扩展 (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638)、[DANE/TLSA (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities) 以及用于一键 DNS 设置的 [Domain Connect](https://domainconnect.org)。通过 WebSockets 推出了 IMAP、CalDAV 和 CardDAV 的实时推送通知。

**2026 年 3 月**：新增对每个域名自定义 S3 兼容存储的支持，并提供了命令行管理工具。开始开发基于相同开源网页邮件代码库的跨平台桌面和移动应用，支持 macOS、Windows、Linux、iOS 和 Android，使用 [Tauri](https://tauri.app) 构建。

## 核心原则 {#core-principles}

自成立以来，Forward Email 始终坚持隐私和安全的核心原则：

**100% 开源理念**：不同于只开源前端而后端闭源的竞争对手，Forward Email 将其完整代码库——包括前端和后端——公开托管在 [GitHub](https://github.com/forwardemail) 上，接受公众监督。

**隐私优先设计**：从一开始，Forward Email 就采用独特的内存处理方式，避免将邮件写入磁盘，这与传统邮件服务将邮件存储在数据库或文件系统中的做法截然不同。

**持续创新**：服务从简单的邮件转发解决方案发展为功能全面的邮件平台，支持加密邮箱、抗量子加密以及包括 SMTP、IMAP、POP3 和 CalDAV 在内的标准协议。

**透明公开**：所有代码均开源并可供审查，确保用户能够验证隐私声明，而非仅仅依赖营销宣传。

**用户掌控**：赋予用户更多选择，包括如果愿意，可以自行托管整个平台。

## 当前状态 {#current-status}

截至 2026 年 3 月，Forward Email 服务全球超过 50 万个域名，包括以下知名组织和行业领导者：

* **科技公司**：Canonical（Ubuntu）、Netflix Games、Linux 基金会、PHP 基金会、jQuery、LineageOS
* **媒体机构**：Fox News Radio、Disney 广告销售
* **教育机构**：剑桥大学、马里兰大学、华盛顿大学、塔夫茨大学、斯沃斯莫尔学院
* **政府机构**：南澳大利亚政府、多米尼加共和国政府
* **其他组织**：RCD Hotels、Fly<span>.</span>io
* **知名开发者**：Isaac Z. Schlueter（npm 创始人）、David Heinemeier Hansson（Ruby on Rails 创始人）

该平台持续发展，定期发布新功能和基础设施改进，保持其作为目前唯一 100% 开源、加密、注重隐私、透明且抗量子攻击的邮件服务的地位。

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
