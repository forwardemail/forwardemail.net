# 为什么开源电子邮件是未来：Forward Email 的优势 {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="开源电子邮件安全与隐私" class="rounded-lg" />


## 目录 {#table-of-contents}

* [前言](#foreword)
* [开源优势：不仅仅是营销](#the-open-source-advantage-more-than-just-marketing)
  * [真正的开源意味着什么](#what-true-open-source-means)
  * [后端问题：大多数“开源”电子邮件服务的短板](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Forward Email：100% 开源，前端和后端](#forward-email-100-open-source-frontend-and-backend)
  * [我们独特的技术方案](#our-unique-technical-approach)
* [自托管选项：自由选择](#the-self-hosting-option-freedom-of-choice)
  * [为什么我们支持自托管](#why-we-support-self-hosting)
  * [自托管电子邮件的现实](#the-reality-of-self-hosting-email)
* [为什么我们的付费服务合理（即使我们是开源的）](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [成本对比](#cost-comparison)
  * [两全其美](#the-best-of-both-worlds)
* [闭源的欺骗：Proton 和 Tutanota 没告诉你的事](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Proton Mail 的开源声明](#proton-mails-open-source-claims)
  * [Tutanota 的类似做法](#tutanotas-similar-approach)
  * [隐私指南的争论](#the-privacy-guides-debate)
* [未来是开源的](#the-future-is-open-source)
  * [为什么开源正在胜出](#why-open-source-is-winning)
* [切换到 Forward Email](#making-the-switch-to-forward-email)
* [结论：为隐私未来选择开源电子邮件](#conclusion-open-source-email-for-a-private-future)


## 前言 {#foreword}

在数字隐私问题达到历史高点的时代，我们选择的电子邮件服务比以往任何时候都更重要。虽然许多服务商声称优先保护您的隐私，但那些只是口头说说和真正践行隐私保护的服务之间存在根本区别。在 Forward Email，我们基于完全透明的开源开发构建服务——不仅仅是前端应用，而是整个基础设施。

本文将探讨为什么开源电子邮件解决方案优于闭源替代品，我们的方法如何区别于 Proton Mail 和 Tutanota 等竞争对手，以及为什么尽管我们支持自托管选项，我们的付费服务仍为大多数用户提供最佳价值。


## 开源优势：不仅仅是营销 {#the-open-source-advantage-more-than-just-marketing}

“开源”一词近年来已成为流行的营销热词，全球开源服务市场预计在 2024 年至 2032 年间的复合年增长率超过 16%\[^1]。但真正的开源意味着什么？它为何对您的电子邮件隐私至关重要？

### 真正的开源意味着什么 {#what-true-open-source-means}

开源软件将其全部源代码免费公开，任何人都可以检查、修改和改进。这种透明度创造了一个环境：

* 全球开发者社区可以发现并修复安全漏洞
* 隐私声明可以通过独立代码审查得到验证
* 用户不会被锁定在专有生态系统中
* 通过协作改进，创新速度更快

对于电子邮件——您在线身份的基石——这种透明度不仅是锦上添花，而是实现真正隐私和安全的必要条件。

### 后端问题：大多数“开源”电子邮件服务的短板 {#the-backend-problem-where-most-open-source-email-services-fall-short}

这里情况变得有趣。许多流行的“注重隐私”的电子邮件服务商宣传自己是开源的，但他们希望您忽略一个关键区别：**他们只开源前端，而后端保持闭源**。
这意味着什么？前端是你看到并与之交互的部分——网页界面或移动应用。后端是实际处理电子邮件的地方——你的邮件在这里被存储、加密和传输。当一个服务提供商保持其后端闭源时：

1. 你无法验证你的邮件到底是如何被处理的
2. 你无法确认他们的隐私声明是否真实可信
3. 你只能信任市场宣传，而非可验证的代码
4. 安全漏洞可能会被隐藏，无法接受公众审查

正如隐私指南论坛上的讨论所指出的，Proton Mail 和 Tutanota 都声称是开源的，但它们的后端仍然是闭源且专有的\[^2]。这造成了一个显著的信任缺口——你被要求相信他们的隐私承诺，却无法验证这些承诺。


## Forward Email：100% 开源，前端和后端均开源 {#forward-email-100-open-source-frontend-and-backend}

在 Forward Email，我们采取了根本不同的方法。我们的整个代码库——包括前端和后端——都是开源的，任何人都可以在 <https://github.com/forwardemail/forwardemail.net> 上查看。

这意味着：

1. **完全透明**：处理你邮件的每一行代码都可供公众审查。
2. **可验证的隐私**：我们的隐私声明不是市场宣传，而是任何人都可以通过查看代码确认的事实。
3. **社区驱动的安全**：我们的安全性由全球开发者社区的集体专业知识增强。
4. **无隐藏功能**：你看到的就是你得到的——没有隐藏的追踪，没有秘密后门。

### 我们独特的技术方法 {#our-unique-technical-approach}

我们对隐私的承诺不仅仅是开源。我们实施了多项技术创新，使我们与众不同：

#### 独立加密的 SQLite 邮箱 {#individually-encrypted-sqlite-mailboxes}

不同于传统邮件服务商使用共享关系型数据库（单点泄露可能暴露所有用户数据），我们为每个邮箱使用独立加密的 SQLite 文件。这意味着：

* 每个邮箱是一个独立加密的文件
* 访问一个用户的数据不意味着可以访问其他用户的数据
* 甚至我们的员工也无法访问你的数据——这是核心设计决策

正如我们在隐私指南讨论中解释的：

> “共享关系型数据库（例如 MongoDB、SQL Server、PostgreSQL、Oracle、MySQL 等）都需要登录（用户名/密码）来建立数据库连接。这意味着任何拥有该密码的人都可以查询数据库中的任何内容。无论是恶意员工还是恶意清洁工攻击。这也意味着访问一个用户的数据就等于访问了所有人的数据。另一方面，SQLite 可以被视为共享数据库，但我们使用它的方式（每个邮箱 = 独立 SQLite 文件）使其成为沙箱环境。”\[^3]

#### 抗量子加密 {#quantum-resistant-encryption}

当其他服务提供商还在追赶时，我们已经实现了抗量子加密方法，以保护你的邮件隐私免受量子计算带来的新兴威胁。

#### 无第三方依赖 {#no-third-party-dependencies}

不同于依赖 Amazon SES 等服务进行邮件发送的竞争对手，我们完全自主构建了整个基础设施。这消除了通过第三方服务可能产生的隐私泄露风险，并让我们对整个邮件流程拥有完全控制权。


## 自托管选项：自由选择 {#the-self-hosting-option-freedom-of-choice}

开源软件最强大的方面之一就是它提供的自由。使用 Forward Email，你永远不会被锁定——如果你愿意，可以自托管我们的整个平台。

### 我们支持自托管的原因 {#why-we-support-self-hosting}

我们相信用户应拥有对自己数据的完全控制权。这就是为什么我们让整个平台支持自托管，并提供了详尽的文档和安装指南。这种方式：

* 为技术用户提供最大控制权
* 消除对我们作为服务提供商的任何信任需求
* 允许根据具体需求进行定制
* 确保即使我们公司不再运营，服务仍能继续运行
### 自托管电子邮件的现实 {#the-reality-of-self-hosting-email}

虽然自托管是一个强大的选项，但了解其中的真实成本非常重要：

#### 财务成本 {#financial-costs}

* VPS 或服务器费用：基础配置每月 5-50 美元\[^4]
* 域名注册和续费：每年 10-20 美元
* SSL 证书（虽然 Let's Encrypt 提供免费选项）
* 监控服务和备份解决方案的潜在费用

#### 时间成本 {#time-costs}

* 初始设置：根据技术水平，需数小时到数天
* 持续维护：每月 5-10 小时，用于更新、安全补丁和故障排除\[^5]
* 学习曲线：理解电子邮件协议、安全最佳实践和服务器管理

#### 技术挑战 {#technical-challenges}

* 电子邮件送达率问题（邮件被标记为垃圾邮件）
* 跟上不断变化的安全标准
* 确保高可用性和可靠性
* 有效管理垃圾邮件过滤

正如一位有经验的自托管者所说：“电子邮件是一种商品服务……在 [某提供商] 托管我的电子邮件比花钱*和*时间自托管更便宜。”\[^6]


## 为什么我们的付费服务有意义（即使我们是开源的） {#why-our-paid-service-makes-sense-even-though-were-open-source}

鉴于自托管的挑战，我们的付费服务提供了两全其美的方案：开源的透明性和安全性，以及托管服务的便利性和可靠性。

### 成本比较 {#cost-comparison}

综合财务和时间成本，我们的付费服务提供了卓越的价值：

* **自托管总成本**：每月 56-252 美元（包括服务器费用和时间估值）
* **Forward Email 付费计划**：每月 3-9 美元

我们的付费服务提供：

* 专业的管理和维护
* 建立良好的 IP 声誉以提升送达率
* 定期的安全更新和监控
* 出现问题时的支持
* 我们开源方案的所有隐私优势

### 两全其美 {#the-best-of-both-worlds}

选择 Forward Email，您将获得：

1. **可验证的隐私**：我们的开源代码库意味着您可以信任我们的隐私声明
2. **专业管理**：无需成为电子邮件服务器专家
3. **成本效益**：总成本低于自托管
4. **无锁定自由**：始终可以选择自托管


## 封闭源代码的欺骗：Proton 和 Tutanota 没告诉你的事 {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

让我们仔细看看我们的做法与流行的“隐私优先”电子邮件提供商有何不同。

### Proton Mail 的开源声明 {#proton-mails-open-source-claims}

Proton Mail 宣称自己是开源的，但这仅适用于他们的前端应用程序。他们的后端——实际处理和存储您邮件的部分——仍然是封闭源代码\[^7]。这意味着：

* 您无法验证邮件的处理方式
* 必须无条件信任他们的隐私声明
* 后端的安全漏洞无法公开审查
* 您被锁定在他们的生态系统中，无法自托管

### Tutanota 的类似做法 {#tutanotas-similar-approach}

与 Proton Mail 类似，Tutanota 只开源其前端，后端保持专有\[^8]。他们面临相同的信任问题：

* 无法验证后端隐私声明
* 对实际邮件处理缺乏透明度
* 潜在的安全问题未公开
* 供应商锁定，无自托管选项

### 隐私指南的争论 {#the-privacy-guides-debate}

这些限制在隐私社区中并未被忽视。在 Privacy Guides 的讨论中，我们强调了这一关键区别：

> “它指出 Protonmail 和 Tuta 都是封闭源代码的。因为他们的后端确实是封闭源代码。”\[^9]

我们还指出：

> “目前列出的任何 PG 电子邮件服务提供商的后端基础设施都没有公开共享的审计报告，也没有开源代码片段展示他们如何处理入站邮件。”\[^10]
这种缺乏透明度造成了根本的信任问题。没有开源后端，用户只能凭信任而非验证来接受隐私声明。


## 未来是开源的 {#the-future-is-open-source}

开源解决方案在整个软件行业的趋势正在加速。根据最新研究：

* 开源软件市场从2024年的418.3亿美元增长到2025年的489.2亿美元\[^11]
* 80%的公司报告过去一年中开源使用量增加\[^12]
* 预计开源的采用将继续快速扩展

这种增长反映了我们对软件安全和隐私思考方式的根本转变。随着用户变得更加注重隐私，通过开源解决方案实现可验证隐私的需求只会增加。

### 为什么开源正在胜出 {#why-open-source-is-winning}

开源的优势日益明显：

1. **通过透明实现安全**：开源代码可以被成千上万的专家审查，而不仅仅是内部团队
2. **更快的创新**：协作开发加速改进
3. **通过验证建立信任**：声明可以被验证，而非凭信任接受
4. **摆脱供应商锁定**：用户保持对其数据和服务的控制权
5. **社区支持**：全球社区帮助识别和修复问题


## 迁移到 Forward Email {#making-the-switch-to-forward-email}

无论您是来自 Gmail 等主流提供商，还是 Proton Mail 或 Tutanota 等注重隐私的服务，迁移到 Forward Email 都很简单。

我们的服务提供：

* 无限域名和别名
* 标准协议支持（SMTP、IMAP、POP3），无专有桥接
* 与现有邮件客户端无缝集成
* 简单的设置流程和全面的文档
* 价格实惠，套餐起价仅为每月3美元


## 结论：面向私密未来的开源邮件 {#conclusion-open-source-email-for-a-private-future}

在数字隐私日益受到威胁的世界中，开源解决方案的透明性提供了关键的保障。Forward Email 自豪地以完全开源的邮件隐私方案引领潮流。

与那些仅部分采用开源的竞争对手不同，我们将整个平台——前端和后端——都开放给公众审查。这种对透明度的承诺，加上我们创新的技术方法，提供了封闭源代码替代方案无法匹敌的可验证隐私水平。

无论您选择使用我们的托管服务还是自托管平台，都能享受到真正开源邮件带来的安全、隐私和安心。

邮件的未来是开放、透明且注重隐私的。未来是 Forward Email。

\[^1]: SNS Insider. "The Open Source Services Market was valued at USD 28.6 billion in 2023 and will reach to USD 114.8 Billion by 2032, growing at a CAGR of 16.70% by 2032." [Open Source Services Market Size & Analysis Report 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. "Generally, you can expect to spend anywhere from $5 to $50 monthly for a basic virtual private server (VPS) to run your email server." [10 Best Self-Hosted Email Server Platforms to Use in 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Mail-in-a-Box Forum. "Maintenance took me maybe 16 hours in that period..." [Self hosting mail server frowned upon](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)
\[^6]: Reddit r/selfhosted. "简而言之：作为所有自托管的东西，它将需要你的时间。如果你没有时间投入，最好还是使用托管服务..." [自托管邮件服务器？为什么或为什么不？什么最受欢迎？](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: Forward Email. "Proton Mail 声称是开源的，但他们的后端实际上是闭源的。" [Tutanota 与 Proton Mail 比较（2025）](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: Forward Email. "Tutanota 声称是开源的，但他们的后端实际上是闭源的。" [Proton Mail 与 Tutanota 比较（2025）](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Privacy Guides Community. "它指出 Protonmail 和 Tuta 都是闭源的。因为他们的后端确实是闭源的。" [Forward Email（邮件提供商）- 网站开发 / 工具建议](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Privacy Guides Community. "目前没有任何公开分享的审计报告涉及任何列出的 PG 邮件服务提供商的后端基础设施，也没有开源代码片段分享他们如何处理入站邮件。" [Forward Email（邮件提供商）- 网站开发 / 工具建议](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. "开源软件市场将从2024年的418.3亿美元增长到2025年的489.2亿美元，复合..." [什么是开源软件？](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. "80%的公司报告过去一年中开源技术的使用率有所增加，..." [2024年开源社区新兴趋势](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)
