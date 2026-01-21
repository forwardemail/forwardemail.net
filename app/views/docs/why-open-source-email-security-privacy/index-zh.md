# 为什么开源电子邮件是未来：转发电子邮件的优势 {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="Open source email security and privacy" class="rounded-lg" />

## 目录 {#table-of-contents}

* [前言](#foreword)
* [开源优势：不仅仅是营销](#the-open-source-advantage-more-than-just-marketing)
  * [真正的开源意味着什么](#what-true-open-source-means)
  * [后端问题：大多数“开源”电子邮件服务的不足之处](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [转发电子邮件：100% 开源，前端和后端](#forward-email-100-open-source-frontend-and-backend)
  * [我们独特的技术方法](#our-unique-technical-approach)
* [自托管选项：自由选择](#the-self-hosting-option-freedom-of-choice)
  * [为什么我们支持自托管](#why-we-support-self-hosting)
  * [自托管电子邮件的现实](#the-reality-of-self-hosting-email)
* [为什么我们的付费服务有意义（即使我们是开源的）](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [成本比较](#cost-comparison)
  * [两全其美](#the-best-of-both-worlds)
* [闭源欺骗：Proton 和 Tutanota 没有告诉你的事情](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Proton Mail 的开源声明](#proton-mails-open-source-claims)
  * [Tutanota 的类似方法](#tutanotas-similar-approach)
  * [隐私指南之争](#the-privacy-guides-debate)
* [未来是开源的](#the-future-is-open-source)
  * [开源为何胜出](#why-open-source-is-winning)
* [切换到转发电子邮件](#making-the-switch-to-forward-email)
* [结论：开源电子邮件助力私人未来](#conclusion-open-source-email-for-a-private-future)

## 前言 {#foreword}

在这个数字隐私问题日益严重的时代，我们选择的电子邮件服务比以往任何时候都更加重要。虽然许多提供商声称将隐私放在首位，但那些只说不做的人和真正付诸行动的人之间存在着根本的区别。在 Forward Email，我们通过开源开发将我们的服务建立在完全透明的基础上——不仅在我们的前端应用程序，而且在我们整个基础设施中。

这篇博文探讨了为什么开源电子邮件解决方案优于闭源替代方案，我们的方法与 Proton Mail 和 Tutanota 等竞争对手有何不同，以及为什么尽管我们致力于自托管选项，但我们的付费服务仍为大多数用户提供了最佳价值。

## 开源优势：不仅仅是营销 {#the-open-source-advantage-more-than-just-marketing}

近年来，“开源”一词已成为热门的营销热词，预计全球开源服务市场在 2024 年至 2032 年期间的复合年增长率将超过 16%[^1]。但真正的开源究竟意味着什么？它为何事关您的电子邮件隐私？

### 真正的开源意味着什么 {#what-true-open-source-means}

开源软件将其全部源代码免费开放，任何人都可以检查、修改和增强。这种透明性创造了一个环境：

* 全球开发者社区可识别并修复安全漏洞
* 隐私声明可通过独立代码审查进行验证
* 用户不会被锁定在专有生态系统中
* 通过协作改进，创新速度更快

当谈到电子邮件（您的在线身份的支柱）时，这种透明度不仅仅是好事；它对于真正的隐私和安全至关重要。

### 后端问题：大多数“开源”电子邮件服务的不足之处 {#the-backend-problem-where-most-open-source-email-services-fall-short}

事情开始变得有趣了。许多流行的“注重隐私”的电子邮件提供商都标榜自己是开源的，但他们希望你不会注意到一个关键的区别：**他们只开源前端，而保持后端封闭**。

这是什么意思？前端是您看到并与之交互的部分——Web 界面或移动应用。后端是实际处理电子邮件的地方——您的邮件在此存储、加密和传输。当提供商将其后端保持闭源时：

1. 你无法验证你的电子邮件是如何被实际处理的
2. 你无法确认他们的隐私声明是否合法
3. 你相信营销宣传，而不是可验证的代码
4. 安全漏洞可能仍未被公众发现

正如“隐私指南”论坛上的讨论所强调的那样，Proton Mail 和 Tutanota 都声称自己是开源的，但它们的后端仍然是封闭且专有的 [^2]。这造成了巨大的信任缺口——你被要求相信他们的隐私承诺，却无法验证。

## 转发电子邮件：100% 开源，前端和后端 {#forward-email-100-open-source-frontend-and-backend}

在 Forward Email，我们采取了一种截然不同的方法。我们的整个代码库（包括前端和后端）都是开源的，任何人都可以在 <https://github.com/forwardemail/forwardemail.net>. 上查看。

这意味着：

1. **完全透明**：处理您电子邮件的每一行代码都接受公众审查。
2. **可验证的隐私**：我们的隐私声明并非营销噱头，而是可验证的事实，任何人都可以通过检查我们的代码来确认。
3. **社区驱动的安全**：全球开发者社区的集体智慧进一步增强了我们的安全性。
4. **无隐藏功能**：所见即所得——无隐藏跟踪，无秘密后门。

### 我们独特的技术方法 {#our-unique-technical-approach}

我们对隐私的承诺远不止开源。我们实施了多项技术创新，这些创新让我们脱颖而出：

#### 单独加密的 SQLite 邮箱 {#individually-encrypted-sqlite-mailboxes}

与使用共享关系数据库的传统电子邮件提供商（一次泄露就可能暴露所有用户的数据）不同，我们为每个邮箱使用单独加密的 SQLite 文件。这意味着：

* 每个邮箱都是一个独立的加密文件
* 访问一个用户的数据并不意味着其他用户也能访问
* 即使是我们自己的员工也无法访问您的数据——这是一项核心设计决策

正如我们在隐私指南讨论中所解释的那样：

> “共享关系数据库（例如 MongoDB、SQL Server、PostgreSQL、Oracle、MySQL 等）都需要登录（使用用户名/密码）才能建立数据库连接。这意味着任何拥有此密码的人都可以查询数据库中的任何内容，无论是流氓员工还是邪恶女佣的攻击。这也意味着，访问一个用户的数据意味着你也能访问其他所有人的数据。另一方面，SQLite 可以被视为共享数据库，但我们使用它的方式（每个邮箱 = 一个独立的 SQLite 文件）使其处于沙盒状态。”[^3]

#### 抗量子加密 {#quantum-resistant-encryption}

虽然其他提供商仍在追赶，但我们已经实施了抗量子加密方法，以确保您的电子邮件隐私免受量子计算带来的新兴威胁。

#### 无第三方依赖项 {#no-third-party-dependencies}

与依赖 Amazon SES 等服务进行电子邮件传递的竞争对手不同，我们内部构建了整个基础设施。这消除了通过第三方服务泄露隐私的潜在风险，并使我们能够完全控制整个电子邮件传递流程。

## 自托管选项：自由选择 {#the-self-hosting-option-freedom-of-choice}

开源软件最强大的优势之一在于它提供的自由。使用 Forward Email，您永远不会被束缚——如果您愿意，您可以自行托管我们的整个平台。

### 我们为何支持自托管 {#why-we-support-self-hosting}

我们秉持让用户完全掌控自身数据的理念。因此，我们打造了可自行托管的整个平台，并提供全面的文档和设置指南。这种方法：

* 为技术型用户提供最大程度的控制
* 无需信任我们作为服务提供商
* 允许定制以满足特定需求
* 确保即使我公司不提供服务，服务也能继续

### 自托管电子邮件的现实{#the-reality-of-self-hosting-email}

虽然自托管是一个强大的选择，但了解所涉及的实际成本非常重要：

#### 财务成本 {#financial-costs}

* VPS 或服务器费用：基本设置每月 5-50 美元 [^4]
* 域名注册和续费：每年 10-20 美元
* SSL 证书（Let's Encrypt 提供免费选项）
* 监控服务和备份解决方案的潜在费用

#### 时间成本 {#time-costs}

* 初始设置：根据技术专业知识，可能需要几小时到几天的时间
* 持续维护：每月 5-10 小时用于更新、安全补丁和故障排除\[^5]
* 学习曲线：了解电子邮件协议、安全最佳实践和服务器管理

#### 技术挑战 {#technical-challenges}

* 电子邮件送达问题（邮件被标记为垃圾邮件）
* 跟上不断发展的安全标准
* 确保高可用性和可靠性
* 有效管理垃圾邮件过滤

正如一位经验丰富的自托管用户所说：“电子邮件是一种商品服务……将我的电子邮件托管在[提供商]处比花费金钱和时间自行托管更便宜。”[^6]

## 为什么我们的付费服务有意义（即使我们是开源的）{#why-our-paid-service-makes-sense-even-though-were-open-source}

考虑到自托管的挑战，我们的付费服务提供了两全其美的解决方案：开源的透明度和安全性以及托管服务的便利性和可靠性。

### 成本比较 {#cost-comparison}

当您考虑财务和时间成本时，我们的付费服务提供了卓越的价值：

* **自托管总费用**：每月 56-252 美元（含服务器成本和时间估算）
* **转发邮件付费计划**：每月 3-9 美元

我们的付费服务提供：

* 专业管理和维护
* 建立 IP 信誉，提升交付能力
* 定期安全更新和监控
* 出现问题时提供支持
* 享受我们开源方法带来的所有隐私优势

### 两全其美 {#the-best-of-both-worlds}

通过选择转发电子邮件，您可以获得：

1. **可验证的隐私**：我们的开源代码库意味着您可以信赖我们的隐私声明
2. **专业管理**：无需成为电子邮件服务器专家
3. **经济高效**：总成本低于自托管
4. **摆脱锁定**：始终提供自托管选项

## 闭源欺骗：Proton 和 Tutanota 没有告诉你的事情 {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

让我们仔细看看我们的方法与流行的“以隐私为中心”的电子邮件提供商有何不同。

### Proton Mail 的开源声明 {#proton-mails-open-source-claims}

Proton Mail 标榜自己是开源的，但这仅限于其前端应用程序。其后端（也就是实际处理和存储邮件的地方）仍然是闭源的 [^7]。这意味着：

* 您无法验证您的电子邮件是如何被处理的
* 您必须在未经验证的情况下相信他们的隐私声明
* 他们后端的安全漏洞仍然隐藏在公众视线之外
* 您被锁定在他们的生态系统中，没有自托管选项

### Tutanota 的类似方法 {#tutanotas-similar-approach}

与 Proton Mail 类似，Tutanota 也只开源了前端，而后端则保持专有[^8]。它们面临着同样的信任问题：

* 无法验证后端隐私声明
* 实际电子邮件处理的透明度有限
* 潜在的安全问题隐藏在公众视野之外
* 供应商锁定，没有自托管选项

### 隐私指南辩论 {#the-privacy-guides-debate}

这些限制在隐私社区中引起了广泛关注。在关于隐私指南的讨论中，我们强调了这一关键区别：

> “它指出 Protonmail 和 Tuta 都是闭源的。因为它们的后端确实是闭源的。”[^9]

我们还声明：

> “目前列出的 PG 电子邮件服务提供商尚未公开分享任何后端基础设施的审计报告，也没有分享任何有关他们如何处理入站电子邮件的开源代码片段。”[^10]

这种缺乏透明度的情况造成了根本性的信任问题。没有开源后端，用户只能盲目相信隐私声明，而无法进行验证。

## 未来属于开源 {#the-future-is-open-source}

整个软件行业都加速推行开源解决方案。根据最近的研究：

* 开源软件市场规模将从 2024 年的 418.3 亿美元增长到 2025 年的 489.2 亿美元\[^11]
* 80% 的公司报告称过去一年开源软件的使用有所增加\[^12]
* 预计开源软件的采用将继续快速扩张

这种增长反映了我们对软件安全和隐私的根本性转变。随着用户隐私意识的增强，通过开源解决方案实现可验证隐私的需求只会越来越大。

### 开源为何胜出 {#why-open-source-is-winning}

开源的优势越来越明显：

1. **透明保障安全**：开源代码可由数千名专家审核，而非仅由内部团队审核
2. **加速创新**：协作开发加速改进
3. **通过验证建立信任**：声明可验证，而非盲目相信
4. **摆脱供应商锁定**：用户可掌控自身数据和服务
5. **社区支持**：全球社区助力发现和解决问题

## 切换到转发电子邮件 {#making-the-switch-to-forward-email}

转到转发电子邮件非常简单，无论您来自 Gmail 等主流提供商还是 Proton Mail 或 Tutanota 等其他注重隐私的服务。

我们的服务包括：

* 无限域名和别名
* 支持标准协议（SMTP、IMAP、POP3），无需专有桥接
* 与现有电子邮件客户端无缝集成
* 设置流程简单，文档齐全
* 价格实惠，每月仅需 3 美元起

## 结论：开源电子邮件，打造私密未来 {#conclusion-open-source-email-for-a-private-future}

在数字隐私日益受到威胁的当今世界，开源解决方案的透明度提供了至关重要的保障。在 Forward Email，我们很荣幸能够凭借完全开源的电子邮件隐私方案引领行业。

与仅部分采用开源的竞争对手不同，我们已将整个平台（包括前端和后端）开放给公众审查。这种对透明度的承诺，加上我们创新的技术方法，提供了可验证的隐私级别，这是闭源替代方案无法比拟的。

无论您选择使用我们的托管服务还是自行托管我们的平台，您都可以享受真正开源电子邮件带来的安全性、隐私性和安心。

电子邮件的未来是开放、透明、注重隐私的。未来是 Forward Email。

\[^1]：SNS Insider。“2023 年开源服务市场价值为 286 亿美元，到 2032 年将达到 1148 亿美元，复合年增长率为 16.70%。” [2032年开源服务市场规模及分析报告](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]：隐私指南社区。“转发电子邮件（电子邮件提供商） - 网站开发/工具建议。” [隐私指南讨论](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]：隐私指南社区。“转发电子邮件（电子邮件提供商） - 网站开发/工具建议。” [隐私指南讨论](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud。“一般来说，你每月大约需要花费 5 到 50 美元来购买一个基本的虚拟专用服务器 (VPS) 来运行你的电子邮件服务器。” [2025 年十大最佳自托管电子邮件服务器平台](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]：Mail-in-a-Box 论坛。“维护这段时间大概花了我 16 个小时……”[自托管邮件服务器不受欢迎](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)

\[^6]: Reddit r/selfhosted。“简而言之：由于所有东西都是自托管的，所以需要花费你的时间。如果你没时间，最好还是坚持使用托管服务……” [自建邮件服务器？为什么要建？现在流行什么？](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]：转发电子邮件。“Proton Mail 声称是开源的，但他们的后端实际上是闭源的。” [Tutanota 与 Proton Mail 对比（2025 年）](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]：转发电子邮件。“Tutanota 声称是开源的，但他们的后端实际上是闭源的。” [Proton Mail 与 Tutanota 对比（2025 年）](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]：隐私指南社区。“它声明 Protonmail 和 Tuta 都是闭源的。因为它们的后端确实是闭源的。” [转发电子邮件（电子邮件提供商） - 网站开发/工具建议](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]：隐私指南社区。“目前列出的任何 PG 电子邮件服务提供商的后端基础设施均未公开共享任何审计报告，也没有关于其如何处理入站电子邮件的开源代码片段。” [转发电子邮件（电子邮件提供商） - 网站开发/工具建议](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM。“开源软件市场规模将从 2024 年的 418.3 亿美元增长到 2025 年的 489.2 亿美元，复合年增长率为...” [什么是开源软件？](https://www.ibm.com/think/topics/open-source)

\[^12]：PingCAP。“80% 的公司报告称，过去一年开源技术的利用率有所提高，这……”[2024 年开源社区的新兴趋势](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)