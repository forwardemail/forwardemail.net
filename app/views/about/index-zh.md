# 关于转发电子邮件 {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# 关于转发电子邮件 {#about-forward-email-1}

## 目录 {#table-of-contents}

* [概述](#overview)
* [创始人和使命](#founder-and-mission)
* [时间线](#timeline)
  * [2017年 - 创立并启动](#2017---founding-and-launch)
  * [2018 年 - 基础设施与集成](#2018---infrastructure-and-integration)
  * [2019年——性能革命](#2019---performance-revolution)
  * [2020 年 - 隐私和安全焦点](#2020---privacy-and-security-focus)
  * [2021 年 - 平台现代化](#2021---platform-modernization)
  * [2023 年 - 基础设施和功能扩展](#2023---infrastructure-and-feature-expansion)
  * [2024 年 - 服务优化和高级功能](#2024---service-optimization-and-advanced-features)
  * [2025年——持续创新](#2025---continued-innovation)
* [核心原则](#core-principles)
* [当前状态](#current-status)

## 概览 {#overview}

> \[!TIP]
> 有关我们的架构、安全实现和路线图的技术细节，请参阅 [技术白皮书](https://forwardemail.net/technical-whitepaper.pdf)。

Forward Email 是一项专注于用户 [免费且开源](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [电子邮件转发](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") 的服务。它最初于 2017 年推出，最初只是一个简单的电子邮件转发解决方案，如今已发展成为一个全面的电子邮件平台，提供无限的自定义域名、无限的电子邮件地址和别名、无限的一次性电子邮件地址、垃圾邮件和网络钓鱼防护、加密邮箱存储空间以及众多高级功能。

该服务由其最初的创始设计师和开发者团队维护和拥有。它采用 [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript")、[Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")、[DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System")、[HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS")、[TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") 和 [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP") 等 100% 开源软件构建。

## 创始人和使命 {#founder-and-mission}

Forward Email 由 **Nicholas Baugh** 于 2017 年创立。据 [转发电子邮件技术白皮书](https://forwardemail.net/technical-whitepaper.pdf) 称，Baugh 最初正在寻找一种经济高效且简单的解决方案，以便在其副业项目中通过域名启用电子邮件功能。在研究了各种可用方案后，他开始编写自己的解决方案，并于 2017 年 10 月 2 日购买了域名 `forwardemail.net`。

Forward Email 的使命不仅仅是提供电子邮件服务，更旨在改变行业处理电子邮件隐私和安全的方式。公司的核心价值观包括透明度、用户控制权以及通过技术实施而非仅仅提供政策承诺来保护隐私。

## 时间线 {#timeline}

### 2017 - 创立并启动 {#2017---founding-and-launch}

**2017 年 10 月 2 日**：Nicholas Baugh 在为其副业研究了具有成本效益的电子邮件解决方案后购买了域名 `forwardemail.net`。

2017年11月5日：Baugh 使用 [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") 创建了一个 634 行的 JavaScript 文件，用于转发任何自定义域名的电子邮件。此初始实现已作为开源项目发布到 [GitHub](https://github.com/forwardemail)，并通过 GitHub Pages 启动了该服务。

2017 年 11 月：Forward Email 在首次发布后正式上线。早期版本纯粹基于 DNS，无需账户注册或登录流程——只是一个用 Markdown 编写的 README 文件，其中包含使用说明。用户可以通过配置 MX 记录指向 `mx1.forwardemail.net` 和 `mx2.forwardemail.net`，并添加指向 `forward-email=user@gmail.com` 的 TXT 记录来设置电子邮件转发。

该解决方案的简单性和有效性吸引了众多知名开发人员的关注，其中包括 [戴维·海涅迈尔·汉森](https://dhh.dk)（Ruby on Rails 的创建者），他至今仍在其域名 `dhh.dk` 上使用转发电子邮件功能。

### 2018 - 基础设施和集成 {#2018---infrastructure-and-integration}

**2018 年 4 月**：当 [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") 推出其 [隐私优先的消费者 DNS 服务](https://blog.cloudflare.com/announcing-1111/) 时，Forward Email 从使用 [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") 切换到使用 [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") 来处理 [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System") 查找，这表明该公司致力于以隐私为中心的基础设施选择。

**2018 年 10 月**：转发电子邮件允许用户使用 [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") 和 [前景](https://en.wikipedia.org/wiki/Outlook "Outlook")“以...身份发送邮件”，扩展了与流行电子邮件提供商的集成功能。

### 2019 - 性能革命 {#2019---performance-revolution}

2019 年 5 月：Forward Email 发布 v2 版本，对初始版本进行了重大改写。本次更新重点改进了 [表现](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing")，并利用了 [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") 的 [流](https://en.wikipedia.org/wiki/Streams "Streams")，为平台的可扩展性奠定了基础。

### 2020 - 隐私和安全焦点 {#2020---privacy-and-security-focus}

2020 年 2 月：Forward Email 发布了增强隐私保护计划，允许用户关闭使用电子邮件转发配置别名设置公共 DNS 记录条目的功能。通过该计划，用户的电子邮件别名信息将被隐藏，无法在互联网上公开搜索。该公司还发布了一项功能，可以启用或禁用特定别名，同时仍允许它们显示为有效的电子邮件地址并返回成功的 [SMTP 状态代码](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes")，而电子邮件将被立即丢弃（类似于将输出管道传输到 [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")）。

**2020 年 4 月**：在现有垃圾邮件检测解决方案屡屡受阻，且不符合 Forward Email 隐私政策后，该公司发布了垃圾邮件扫描程序的初始 Alpha 版本。这款完全免费开源的 [反垃圾邮件过滤](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") 解决方案采用 [朴素贝叶斯垃圾邮件过滤器](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") 方法，并结合了 [反网络钓鱼](https://en.wikipedia.org/wiki/Phishing "Phishing") 和 [IDN同形异义词攻击](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack") 保护措施。Forward Email 还发布了 [双因素身份验证](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication")（双重身份验证），使用 [一次性密码](https://en.wikipedia.org/wiki/One-time_password "One-time password")（一次性密码）来增强账户安全性。

**2020 年 5 月**：Forward Email 允许自定义 [端口转发](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding")，以便用户规避 [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider") 的端口阻塞。该公司还发布了 [免费电子邮件转发 RESTful API](email-api)，其中包含完整的文档、实时请求和响应示例，以及对 Webhook 的支持。

**2020 年 8 月**：Forward Email 增加了对 [已验证接收链](arc)（“ARC”）电子邮件身份验证系统的支持，进一步增强了电子邮件的安全性和可传递性。

**2020 年 11 月 23 日**：Forward Email 公开推出其测试版程序，标志着该平台发展的一个重要里程碑。

### 2021 - 平台现代化 {#2021---platform-modernization}

**2021 年 2 月**：Forward Email 重构了其代码库，移除了所有 [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\)（Python（编程语言））依赖项，使其堆栈完全由 [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") 和 [Node.js](https://en.wikipedia.org/wiki/Node.js) 构成。这一架构决策与公司致力于维护一致的开源技术堆栈的承诺相一致。

**2021 年 9 月 27 日**：将电子邮件转发别名 [增加了支持](email-forwarding-regex-pattern-filter) 与 [正则表达式](https://en.wikipedia.org/wiki/Regular_expression "Regular expression") 匹配，为用户提供更复杂的电子邮件路由功能。

### 2023 - 基础设施和功能扩展 {#2023---infrastructure-and-feature-expansion}

**2023 年 1 月**：Forward Email 推出了重新设计并优化页面速度的网站，改善了用户体验和性能。

**2023 年 2 月**：公司增加了对 [错误日志](/faq#do-you-store-error-logs) 的支持，并实施了 [黑暗模式](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) 网站配色方案，以满足用户偏好和可访问性需求。

**2023 年 3 月**：Forward Email 发布了 [柑橘](https://github.com/forwardemail/tangerine#readme)，并将其集成到其整个基础架构中，从而支持在应用层使用 [通过 HTTPS 进行 DNS](https://en.wikipedia.org/wiki/DNS_over_HTTPS)（“DoH”）。该公司还增加了对 [MTA-STS](/faq#do-you-support-mta-sts) 的支持，并将 [验证码](/) 切换至 [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile)。

2023 年 4 月：Forward Email 实施并自动化了全新的基础架构。整个服务开始在全局负载均衡和基于邻近度的 DNS 上运行，并使用 [Cloudflare](https://cloudflare.com) 进行健康检查和故障转移，取代了之前的循环 DNS 方法。公司已切换到多个提供商的**裸机服务器**，包括 [Vultr](https://www.vultr.com/?ref=429848) 和 [数字海洋](https://m.do.co/c/a7cecd27e071)，这两家提供商均符合 SOC 2 Type 1 标准。MongoDB 和 Redis 数据库迁移到具有主节点和备用节点的集群配置，以实现高可用性、端到端 SSL 加密、静态加密和时间点恢复 (PITR)。

**2023 年 5 月**：Forward Email 针对 [使用 SMTP 发送电子邮件](/faq#do-you-support-sending-email-with-smtp) 和 [使用 API 发送电子邮件](/faq#do-you-support-sending-email-with-api) 请求推出了 **出站 SMTP** 功能。此功能包含内置安全措施以确保高送达率、先进且强大的队列和重试系统以及 [支持实时错误日志](/faq#do-you-store-error-logs)。

**2023 年 11 月**：Forward Email 为 [IMAP 支持](/faq#do-you-support-receiving-email-with-imap) 推出了 [**加密邮箱存储**](/blog/docs/best-quantum-safe-encrypted-email-service) 功能，代表着电子邮件隐私和安全方面的重大进步。

**2023 年 12 月**：公司 [增加了支持](/faq#do-you-support-pop3) 用于 [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol)、[密钥和 WebAuthn](/faq#do-you-support-passkeys-and-webauthn)、[收件箱时间](/faq#i) 监控，以及 [用于 IMAP 存储的 OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)。

### 2024 - 服务优化和高级功能 {#2024---service-optimization-and-advanced-features}

**2024 年 2 月**：转发电子邮件 [添加了日历（CalDAV）支持](/faq#do-you-support-calendars-caldav)，扩展平台的功能，使其不仅包括电子邮件，还包括日历同步。

**2024 年 3 月至 7 月**：Forward Email 对其 IMAP、POP3 和 CalDAV 服务进行了重大优化和改进，目标是使其服务速度与其他服务一样快，甚至更快。

**2024 年 7 月**：[添加了 iOS Push 支持](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) 公司解决了 iOS 版 Apple Mail 缺乏 IMAP `IDLE` 命令支持的问题，从而为 Apple iOS 设备提供实时通知功能。Forward Email 还为其自身服务和 Yahoo/AOL 添加了收件箱时间（“TTI”）监控功能，并开始允许用户即使在免费套餐中也能加密其整个 DNS TXT 记录。根据 [隐私指南讨论](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) 和 [GitHub 问题](https://github.com/forwardemail/forwardemail.net/issues/254) 中的请求，该公司添加了允许别名静默拒绝 `250`、软拒绝 `421` 或硬拒绝 `550`（禁用时）的功能。

**2024 年 8 月**：Forward Email 新增了将邮箱导出为 [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) 和 [Mbox](https://en.wikipedia.org/wiki/Mbox) 格式的支持（除了现有的 [SQLite](https://en.wikipedia.org/wiki/SQLite) 导出格式之外）。此外，公司还新增了 [添加了 Webhook 签名支持](https://forwardemail.net/faq#do-you-support-bounce-webhooks) 格式，允许用户通过其出站 SMTP 服务发送新闻通讯、公告和电子邮件营销。此外，还实现了针对 IMAP/POP3/CalDAV 的域范围和特定别名的存储配额。

### 2025 - 持续创新 {#2025---continued-innovation}

**2024 年 9 月至 2025 年 1 月**：转发电子邮件 [添加了备受期待的休假回复功能和用于电子邮件转发的 OpenPGP/WKD 加密](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254)，以建立在其已实施的加密邮箱存储功能的基础上。

**2025年1月21日**：创始人挚友“杰克”，他忠诚的狗狗伙伴，安详离世，年仅11岁。杰克 [永远会被记住](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) 感谢他坚定不移的陪伴，支持了“转发邮件”的创建。[转发电子邮件技术白皮书](https://forwardemail.net/technical-whitepaper.pdf) 献给杰克，以表彰他为这项服务的发展所做出的贡献。

**2025 年 2 月**：Forward Email 改用 [数据包](https://www.datapacket.com) 作为其新的主要数据中心提供商，实施定制的、注重性能的裸机硬件，以进一步提高服务可靠性和速度。

**2025 年 6 月**：Forward Email 推出了对 [CardDAV 协议](/faq#do-you-support-contacts-carddav) 的支持，扩展了平台的功能，包括联系人同步以及现有的电子邮件和日历服务。

## 核心原则 {#core-principles}

自成立以来，Forward Email 始终坚定地致力于隐私和安全原则：

**100% 开源理念**：与仅开源前端而保持后端封闭的竞争对手不同，Forward Email 已将其整个代码库（前端和后端）在 [GitHub](https://github.com/forwardemail) 上公开供公众审查。

**隐私优先设计**：从第一天起，Forward Email 就实施了一种独特的内存处理方法，避免将电子邮件写入磁盘，这使其有别于将消息存储在数据库或文件系统中的传统电子邮件服务。

**持续创新**：该服务已从简单的电子邮件转发解决方案发展成为一个综合的电子邮件平台，具有加密邮箱、抗量子加密等功能，并支持包括 SMTP、IMAP、POP3 和 CalDAV 在内的标准协议。

**透明度**：使所有代码开源并可供检查，确保用户可以验证隐私声明，而不是简单地相信营销声明。

**用户控制**：为用户提供选项，包括根据需要自行托管整个平台的能力。

## 当前状态 {#current-status}

截至 2025 年，Forward Email 为全球超过 500,000 个域名提供服务，其中包括知名组织和行业领导者，例如：

* **科技公司**：Canonical (Ubuntu)、Netflix Games、Linux 基金会、PHP 基金会、jQuery、LineageOS
* **媒体机构**：福克斯新闻广播、迪士尼广告销售
* **教育机构**：剑桥大学、马里兰大学、华盛顿大学、塔夫茨大学、斯沃斯莫尔学院
* **政府机构**：南澳大利亚州政府、多米尼加共和国政府
* **其他组织**：RCD Hotels、Fly<span>.</span>io
* **知名开发者**：Isaac Z. Schlueter（npm 创建者）、David Heinemeier Hansson（Ruby on Rails 创建者）

该平台不断发展，定期发布功能并改进基础设施，保持其作为当今唯一 100% 开源、加密、注重隐私、透明和抗量子的电子邮件服务的地位。

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />