# PayPal 11 年的 API 灾难：当他们忽视开发人员时，我们如何构建解决方法{#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">在 Forward Email，我们十多年来一直在处理 PayPal 的 API 问题。起初只是些小麻烦，后来却演变成一场彻底的灾难，迫使我们自行构建变通方案，屏蔽他们的钓鱼模板，并最终在一次关键的账户迁移期间暂停所有 PayPal 付款。</p>
<p class="lead mt-3">这 11 年来，PayPal 一直忽视开发者的基本需求，而我们却竭尽全力让他们的平台正常运行。</p>

## 目录 {#table-of-contents}

* [缺失的部分：无法列出订阅](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017：问题浮现](#2014-2017-the-problem-emerges)
* [2020年：我们给予他们广泛的反馈](#2020-we-give-them-extensive-feedback)
  * [27项反馈清单](#the-27-item-feedback-list)
  * [团队参与，承诺达成](#teams-got-involved-promises-were-made)
  * [结果如何？毫无进展。](#the-result-nothing)
* [高管大批离职：PayPal如何失去所有机构记忆](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025年：新的领导，同样的问题](#2025-new-leadership-same-problems)
  * [新任首席执行官参与其中](#the-new-ceo-gets-involved)
  * [米歇尔·吉尔的回应](#michelle-gills-response)
  * [我们的回应：不再开会](#our-response-no-more-meetings)
  * [马蒂·布罗德贝克的过度设计回应](#marty-brodbecks-overengineering-response)
  * [“简单的 CRUD” 矛盾](#the-simple-crud-contradiction)
  * [脱节变得清晰起来](#the-disconnect-becomes-clear)
* [多年来他们忽略了错误报告](#years-of-bug-reports-they-ignored)
  * [2016 年：早期 UI/UX 投诉](#2016-early-uiux-complaints)
  * [2021 年：商业电子邮件错误报告](#2021-business-email-bug-report)
  * [2021：UI 改进建议](#2021-ui-improvement-suggestions)
  * [2021年：沙盒环境故障](#2021-sandbox-environment-failures)
  * [2021年：报告系统彻底崩溃](#2021-reports-system-completely-broken)
  * [2022：核心 API 功能再次缺失](#2022-core-api-feature-missing-again)
* [开发者体验噩梦](#the-developer-experience-nightmare)
  * [用户界面损坏](#broken-user-interface)
  * [SDK问题](#sdk-problems)
  * [内容安全政策违规](#content-security-policy-violations)
  * [文档混乱](#documentation-chaos)
  * [安全漏洞](#security-vulnerabilities)
  * [会话管理灾难](#session-management-disaster)
* [2025年7月：最后一根稻草](#july-2025-the-final-straw)
* [为什么我们不能放弃 PayPal](#why-we-cant-just-drop-paypal)
* [社区解决方法](#the-community-workaround)
* [由于网络钓鱼而阻止 PayPal 模板](#blocking-paypal-templates-due-to-phishing)
  * [真正的问题：PayPal 的模板看起来像骗局](#the-real-problem-paypals-templates-look-like-scams)
  * [我们的实施](#our-implementation)
  * [为什么我们必须屏蔽 PayPal](#why-we-had-to-block-paypal)
  * [问题的规模](#the-scale-of-the-problem)
  * [讽刺的是](#the-irony)
  * [现实世界的影响：新型 PayPal 诈骗](#real-world-impact-novel-paypal-scams)
* [PayPal 的反向 KYC 流程](#paypals-backwards-kyc-process)
  * [它应该如何运作](#how-it-should-work)
  * [PayPal 的实际运作方式](#how-paypal-actually-works)
  * [现实世界的影响](#the-real-world-impact)
  * [2025年7月账户迁移灾难](#the-july-2025-account-migration-disaster)
  * [为什么这很重要](#why-this-matters)
* [其他支付处理商如何做得好](#how-every-other-payment-processor-does-it-right)
  * [条纹](#stripe)
  * [桨](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [正方形](#square)
  * [行业标准](#the-industry-standard)
  * [其他处理器与 PayPal 相比提供什么](#what-other-processors-provide-vs-paypal)
* [PayPal 的系统性掩盖：压制 600 万人的声音](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [大抹杀](#the-great-erasure)
  * [第三方救援](#the-third-party-rescue)
* [持续11年的捕获漏洞灾难：损失1899美元，而且还在继续](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Forward Email 的 1,899 美元损失](#forward-emails-1899-loss)
  * [2013年原始报告：11年以上的疏忽](#the-2013-original-report-11-years-of-negligence)
  * [2016 年的承认：PayPal 破坏了他们自己的 SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [2024年升级：依然破裂](#the-2024-escalation-still-broken)
  * [Webhook 可靠性灾难](#the-webhook-reliability-disaster)
  * [系统性疏忽的模式](#the-pattern-of-systematic-negligence)
  * [未记录的要求](#the-undocumented-requirement)
* [PayPal 更广泛的欺诈模式](#paypals-broader-pattern-of-deception)
  * [纽约金融服务部行动](#the-new-york-department-of-financial-services-action)
  * [Honey 诉讼：重写联盟链接](#the-honey-lawsuit-rewriting-affiliate-links)
  * [PayPal 疏忽的代价](#the-cost-of-paypals-negligence)
  * [文档谎言](#the-documentation-lie)
* [这对开发人员意味着什么](#what-this-means-for-developers)

## 缺失的部分：无法列出订阅{#the-missing-piece-no-way-to-list-subscriptions}

让我们震惊的是：PayPal 自 2014 年以来就提供订阅计费服务，但他们从未为商家提供列出自己的订阅的方式。

想一想。你可以创建订阅，如果你有 ID，也可以取消订阅，但你无法获取你账户下所有活跃订阅的列表。这就像一个没有 SELECT 语句的数据库。

我们需要它来进行基本的业务运营：

* 客户支持（当有人通过电子邮件询问其订阅情况时）
* 财务报告和对账
* 自动账单管理
* 合规性和审计

但 PayPal 呢？他们根本就没开发过。

## 2014-2017：问题浮现{#2014-2017-the-problem-emerges}

订阅列表问题最早出现在 2017 年的 PayPal 社区论坛上。开发人员提出了一个显而易见的问题：“如何获取所有订阅的列表？”

PayPal 对此有何回应？毫无动静。

社区成员开始感到沮丧：

> “如果商家无法列出所有有效协议，这真是一个很奇怪的遗漏。如果协议ID丢失，这意味着只有用户可以取消或暂停协议。” - leafspider

> “+1。已经快 3 年了。” - laudukang（意思是这个问题自 2014 年左右就存在了）

2017 年的 [原始社区帖子](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) 表明开发人员正在恳求这项基本功能。PayPal 的回应是将人们报告该问题的存储库存档。

## 2020：我们向他们提供广泛的反馈{#2020-we-give-them-extensive-feedback}

2020年10月，PayPal 与我们联系，希望召开一次正式的反馈会议。这可不是一次轻松的闲聊——他们组织了一场45分钟的 Microsoft Teams 电话会议，与会的8位 PayPal 高管包括 Sri Shivananda（首席技术官）、Edwin Aoki、Jim Magats、John Kunze 等。

### 27 项反馈列表 {#the-27-item-feedback-list}

我们做好了准备。经过 6 个小时的尝试，我们整合了他们的 API，发现了 27 个具体问题。PayPal Checkout 团队的 Mark Stuart 说：

> 嘿，Nick，谢谢你今天和大家分享！我认为这会成为我们团队获得更多支持和投资的催化剂，让我们能够去解决这些问题。到目前为止，很难得到像你这样丰富的反馈。

这些反馈并不是理论上的——它来自于真实的整合尝试：

1. **访问令牌生成不起作用**：

> 访问令牌生成功能无法正常工作。另外，应该有更多 cURL 示例。

2. **没有用于创建订阅的 Web UI**：

> 不用 cURL 怎么创建订阅？好像没有网页界面可以实现这个功能（Stripe 有）。

Mark Stuart 发现访问令牌问题尤其令人担忧：

> 我们通常不会听说有关访问令牌生成的问题。

### 支球队参与，并做出承诺 {#teams-got-involved-promises-were-made}

随着我们发现越来越多的问题，PayPal 不断邀请更多团队参与讨论。订阅管理 UI 团队的 Darshan Raju 也加入了讨论，他说道：

> 确认差距。我们会跟踪并解决此问题。再次感谢您的反馈！

据描述，此次会议旨在寻求：

> 坦诚地讲述你的经历

到：

> 让 PayPal 成为开发人员应该使用的工具。

### 结果如何？没有。{#the-result-nothing}

尽管进行了正式的反馈会议，但清单仍然包含 27 项内容，多个团队参与，并承诺：

> 追踪并解决

问题，根本没有得到解决。

## 高管大批离职：PayPal 如何失去所有机构记忆 {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

真正有趣的地方来了。所有收到我们 2020 年反馈的用户都离开了 PayPal：

**领导层变动：**

* [丹·舒尔曼（Dan Schulman，任职 9 年的首席执行官）→亚历克斯·克里斯（Alex Chriss）](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/)（2023 年 9 月）
* [Sri Shivananda（组织反馈的首席技术官）→摩根大通](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/)（2024 年 1 月）

**做出承诺然后离开的技术领导者：**

* **Mark Stuart**（承诺的反馈将成为“催化剂”）→ [现在在 Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats**（PayPal 18 年资深员工）→ [MX首席执行官](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html)（2022 年）
* **John Kunze**（全球消费产品副总裁）→ [已退休](https://www.linkedin.com/in/john-kunze-5724a86)（2023 年）
* **Edwin Aoki**（最后几位留任者之一）→ [刚刚前往纳斯达克](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ)（2025 年 1 月）

PayPal 已经成为一扇旋转门，高管们在这里收集开发人员的反馈，做出承诺，然后跳槽到摩根大通、Ripple 和其他金融科技公司等更好的公司。

这就解释了为什么 2025 年 GitHub 问题响应似乎与我们 2020 年的反馈完全脱节——实际上所有收到该反馈的人都离开了 PayPal。

## 2025：新的领导，同样的问题 {#2025-new-leadership-same-problems}

快进到2025年，同样的模式再次出现。在多年毫无进展之后，PayPal的新领导层再次伸出援手。

### 新任首席执行官参与其中 {#the-new-ceo-gets-involved}

2025年6月30日，我们直接向PayPal新任首席执行官Alex Chriss汇报了此事。他的回复很简短：

> 嗨，Nick，感谢您的联系和反馈。Michelle（已抄送）和她的团队会积极与您沟通并共同解决此事。谢谢 -A

### Michelle Gill 的回复 {#michelle-gills-response}

小型企业和金融服务部执行副总裁兼总经理 Michelle Gill 回应道：

> 非常感谢 Nick，把 Alex 改为密件抄送了。自从你之前发帖以来，我们一直在调查此事。我们会在本周结束前给你打电话。请把你的联系方式发给我，这样我的同事就能联系你了。Michelle

### 我们的回应：不再开会 {#our-response-no-more-meetings}

我们拒绝了另一次会面，并解释了我们的沮丧之情：

> 谢谢。不过我觉得打电话没什么用。原因如下……我以前打过一次电话，但完全没有进展。我浪费了两个多小时的时间与整个团队和领导层沟通，但什么也没做……来来回回发了好多邮件，什么也没做。反馈也没有任何进展。我尝试了好几年，希望有人能听取我的意见，但最终却毫无进展。

### 马蒂·布罗德贝克的过度工程回应 {#marty-brodbecks-overengineering-response}

然后，PayPal 消费者工程主管 Marty Brodbeck 伸出了援手：

> 你好，Nick，我是 Marty Brodbeck。我负责 PayPal 的所有消费者工程，并一直在推动公司的 API 开发。能否请你和我们谈谈你遇到的问题以及我们可以如何提供帮助？

当我们解释了订阅列表端点的简单需求时，他的回答揭示了确切的问题：

> 谢谢 Nick，我们正在创建一个具有完整 SDK 的单一订阅 API（支持完整的错误处理、基于事件的订阅跟踪、强大的正常运行时间），其中计费也被拆分为一个单独的 API 供商家使用，而不必跨多个端点进行协调以获得单一响应。

这完全是错误的做法。我们不需要耗费数月时间构建复杂的架构。我们需要一个简单的 REST 端点来列出订阅信息——这早在 2014 年就应该存在了。

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### “简单的 CRUD”矛盾 {#the-simple-crud-contradiction}

当我们指出这是自 2014 年起就应该存在的基本 CRUD 功能时，Marty 的回应是：

> 简单的 Crud 操作是核心 API 的一部分，所以不需要花费数月的开发时间

PayPal TypeScript SDK 经过数月的开发，目前仅支持三个端点，结合其历史时间线，可以清楚地看出此类项目需要几个月以上的时间才能完成。

这条回复表明他根本不了解自己的 API。如果“简单的 CRUD 操作是核心 API 的一部分”，那么订阅列表端点又在哪里呢？我们回复道：

> 如果“简单的 CRUD 操作是核心 API 的一部分”，那么订阅列表端点在哪里？自 2014 年以来，开发人员就一直在要求提供这种“简单的 CRUD 操作”。至今已有 11 年。其他所有支付处理器从第一天起就具备这项基本功能。

### 断开连接变得清晰 {#the-disconnect-becomes-clear}

2025 年与亚历克斯·克里斯 (Alex Chriss)、米歇尔·吉尔 (Michelle Gill) 和马蒂·布罗德贝克 (Marty Brodbeck) 的交流表现出同样的组织功能障碍：

1. **新领导层对之前的反馈会议一无所知**
2. **他们提出的都是同样过度设计的解决方案**
3. **他们不了解自身 API 的局限性**
4. **他们想要更多会议，而不是仅仅解决问题**

这种模式解释了为什么 2025 年的 PayPal 团队似乎与 2020 年提供的广泛反馈完全脱节——收到反馈的人已经离开，而新的领导层正在重复同样的错误。

## 他们忽略了多年的错误报告 {#years-of-bug-reports-they-ignored}

我们不只是抱怨功能缺失。我们积极报告错误，并努力帮助他们改进。以下是我们记录的问题的完整时间表：

### 2016：早期 UI/UX 投诉 {#2016-early-uiux-complaints}

早在 2016 年，我们就曾公开与包括 Dan Schulman 在内的 PayPal 领导层沟通，探讨界面和可用性问题。这已经是 9 年前的事了，同样的 UI/UX 问题至今仍然存在。

### 2021：企业电子邮件错误报告 {#2021-business-email-bug-report}

2021年3月，我们报告了PayPal企业电子邮件系统发送错误的取消通知的问题。该电子邮件模板中的变量渲染不正确，导致客户收到令人困惑的消息。

马克·斯图尔特承认了这个问题：

> 谢谢 Nick！现在改用密件抄送。@Prasy，你的团队负责这封邮件吗？或者知道是谁负责的吗？“Niftylettuce, LLC，我们将不再向您收费”这句话让我怀疑邮件的收件者和内容有误。

**结果**：他们真的修复了这个问题！Mark Stuart 确认：

> 刚刚收到通知团队的通知，邮件模板已修复并正式上线。感谢您联系我们报告此问题。谢谢！

这表明他们能够在需要的时候解决问题——只是对于大多数问题他们选择不这么做。

### 2021：UI 改进建议 {#2021-ui-improvement-suggestions}

2021 年 2 月，我们对其仪表板 UI，特别是“PayPal 最近活动”部分提供了详细的反馈：

> 我认为paypal.com的仪表盘，特别是“PayPal近期活动”需要改进。我认为你们不应该显示$0的定期付款“已创建”状态行——这只会增加很多额外的行数，而且你无法一目了然地看到当天/过去几天的收入。

马克·斯图尔特将其转发给了消费者产品团队：

> 谢谢！我不确定哪个团队负责“活动”，但我已将其转发给消费者产品负责人，以便找到正确的团队。0.00 美元的定期付款似乎是一个 bug。应该过滤掉。

**结果**：问题从未修复。用户界面仍然显示这些无用的 $0 条目。

### 2021：沙盒环境故障 {#2021-sandbox-environment-failures}

2021 年 11 月，我们报告了 PayPal 沙盒环境的严重问题：

* 沙盒 API 密钥被随机更改并禁用
* 所有沙盒测试帐户均被删除，恕不另行通知
* 尝试查看沙盒帐户详情时出现错误消息
* 间歇性加载失败

> 由于某种原因，我的沙盒 API 密钥被更改了，并且被禁用了。此外，我所有旧的沙盒测试帐户都被删除了。

> 有时候能加载，有时候加载不出来。这真是让人抓狂。

**结果**：没有回应，没有修复。开发人员仍然面临沙盒可靠性问题。

### 2021：报告系统完全崩溃 {#2021-reports-system-completely-broken}

2021 年 5 月，我们报告称 PayPal 的交易报告下载系统已完全崩溃：

> 报告下载功能目前似乎无法使用，而且一整天都无法使用。如果失败，应该会收到电子邮件通知。

我们还指出了会话管理灾难：

> 另外，如果你在登录 PayPal 时有 5 分钟左右没有活动，你就会被注销。所以，当你再次刷新你想查看状态的报告旁边的按钮时（你得等很久），不得不重新登录，真是太麻烦了。

Mark Stuart 承认了会话超时问题：

> 我记得您过去曾报告过，当您在 IDE 和developer.paypal.com 或商家仪表板之间切换时，您的会话经常过期并中断您的开发流程，然后您会回来并再次被注销。

**结果**：会话超时仍为 60 秒。报告系统仍然经常出现故障。

### 2022：核心 API 功能缺失（再次）{#2022-core-api-feature-missing-again}

2022 年 1 月，我们再次升级了订阅列表问题，这次更详细地说明了他们的文档是如何错误的：

> 没有列出所有订阅的 GET（以前称为计费协议）

我们发现他们的官方文件完全不准确：

> API 文档也完全不准确。我们以为可以通过下载硬编码的订阅 ID 列表来解决这个问题。但这根本行不通！

> 从这里的官方文档来看...它说你可以这样做...问题是 - 根本没有任何地方可以找到需要勾选的“订阅 ID”字段。

PayPal 的 Christina Monti 回应道：

> 对于这些步骤错误造成的困扰，我们深感抱歉，我们将在本周修复该问题。

Sri Shivananda（首席技术官）对我们表示感谢：

> 感谢您一直以来的帮助，让我们变得更好。非常感谢。

**结果**：文档从未修复。订阅列表端点从未创建。

## 开发者体验噩梦 {#the-developer-experience-nightmare}

使用 PayPal 的 API 就像回到了十年前。以下是我们记录的技术问题：

### 损坏的用户界面 {#broken-user-interface}

PayPal 开发者面板简直是一场灾难。以下是我们每天要处理的问题：

<figure>
<figcaption><div class="alert alert-danger small text-center">
PayPal 的用户界面太糟糕了，你甚至无法关闭通知。
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
您的浏览器不支持视频标签。
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
开发者面板会要求你拖动滑块，然后在 60 秒后退出。
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
您的浏览器不支持 video 标签。
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
PayPal 开发者界面中更多 UI 灾难，显示工作流程中断
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
您的浏览器不支持视频标签。
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
订阅管理界面 - 界面太差，我们不得不依赖代码来生成产品和订阅计划
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
功能缺失、崩溃的订阅界面（无法轻松创建产品/方案/订阅 - 而且似乎根本没有办法在界面中创建产品或方案后删除它们）
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
典型的 PayPal 错误信息 - 晦涩难懂且毫无帮助
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### SDK 问题 {#sdk-problems}

* 无法同时处理一次性付款和订阅，除非采用复杂的变通方法，例如在使用脚本标签重新加载 SDK 时切换和重新渲染按钮
* JavaScript SDK 违反了基本约定（类名小写，没有实例检查）
* 错误消息未指示缺少哪些字段
* 数据类型不一致（要求使用字符串金额而不是数字）

### 内容安全政策违规行为 {#content-security-policy-violations}

他们的 SDK 需要您的 CSP 中使用 unsafe-inline 和 unsafe-eval，**迫使您损害网站的安全性**。

### 文档混乱 {#documentation-chaos}

马克·斯图尔特本人也承认：

> 同意，遗留 API 和新 API 的数量实在是太夸张了。真的很难找到要查找的内容（即使对于我们这些在这里工作的人来说也是如此）。

### 安全漏洞 {#security-vulnerabilities}

**PayPal 的 2FA 实现方式是倒退的**。即使启用了 TOTP 应用，它们也会强制使用短信验证，这会使账户容易受到 SIM 卡交换攻击。如果您启用了 TOTP，它应该只使用 TOTP。备用方案应该是电子邮件，而不是短信。

### 会话管理灾难 {#session-management-disaster}

**他们的开发者控制面板会在你 60 秒不活动后自动注销**。尝试做任何有用的事情，你都会不断经历：登录 → 验证码 → 双重认证 → 注销 → 重复。用 VPN 吗？祝你好运。

## 2025 年 7 月：最后一根稻草 {#july-2025-the-final-straw}

同样的麻烦持续了11年，终于在一次例行账户迁移中出现了转折点。为了更清晰地记录账目，我们需要迁移到一个新的PayPal账户，以匹配我们的公司名称“Forward Email LLC”。

本来应该很简单的事情却变成了一场彻底的灾难：

* 初步测试显示一切正常
* 数小时后，PayPal 突然冻结所有订阅付款，且未另行通知
* 客户无法付款，造成混乱并加重了客服负担
* PayPal 客服给出的回复前后矛盾，声称账户已验证
* 我们被迫完全停止 PayPal 付款

<figure>
<figcaption><div class="alert alert-danger small text-center">
客户尝试付款时看到的错误 - 没有解释，没有日志，什么都没有
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
PayPal 支持人员声称一切正常，但付款却完全中断。最后一条消息显示，他们声称“恢复了部分功能”，但仍要求提供更多未指定的信息——典型的 PayPal 支持剧
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="PayPal help center screenshot 1" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="PayPal help center screenshot 2" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="PayPal help center screenshot 3" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="PayPal help center screenshot 4" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="PayPal help center screenshot 5" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="PayPal help center screenshot 6" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
据称“解决”不了任何问题的身份验证流程
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="PayPal take care screenshot 1" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="PayPal take care screenshot 2" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="PayPal take care screenshot 3" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="PayPal take care screenshot 4" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="PayPal take care screenshot 5" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-6.png" alt="PayPal take care screenshot 6" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-7.png" alt="PayPal take care screenshot 7" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
消息模糊，仍然没有解决方案。没有任何信息、通知或任何关于需要补充的信息。客服沉默了。
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>

## 为什么我们不能放弃 PayPal {#why-we-cant-just-drop-paypal}

尽管存在诸多问题，我们也无法完全放弃 PayPal，因为有些客户只选择 PayPal 作为付款方式。正如一位客户在我们的 [状态页面](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515) 上所说：

> PayPal 是我唯一的付款方式

**我们只能支持一个有缺陷的平台，因为 PayPal 为某些用户创造了支付垄断权。**

## 社区解决方案 {#the-community-workaround}

由于 PayPal 不提供基本的订阅列表功能，开发者社区已构建了相应的解决方案。我们创建了一个脚本来帮助管理 PayPal 订阅：[set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

此脚本引用了一个 [社区要点](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4)，开发者可以在其中分享解决方案。用户实际上是 [感谢我们](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775)，因为他们提供了 PayPal 多年前就应该构建的功能。

## 因网络钓鱼而阻止 PayPal 模板 {#blocking-paypal-templates-due-to-phishing}

问题不仅仅在于 API。PayPal 的电子邮件模板设计非常糟糕，以至于我们不得不在电子邮件服务中实施特定的过滤措施，因为它们与网络钓鱼攻击难以区分。

### 真正的问题：PayPal 的模板看起来像骗局 {#the-real-problem-paypals-templates-look-like-scams}

我们经常收到一些看似类似网络钓鱼的 PayPal 电子邮件报告。以下是我们从滥用报告中摘录的一个真实案例：

**主题：** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

这封邮件被转发给了 `abuse@microsoft.com`，因为它疑似网络钓鱼攻击。问题出在哪里？它实际上来自 PayPal 的沙盒环境，但其模板设计非常糟糕，以至于触发了网络钓鱼检测系统。

### 我们的实施 {#our-implementation}

您可以在 [电子邮件过滤代码](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172) 中看到我们针对 PayPal 实施的过滤功能：

```javascript
// check for paypal scam (very strict until PayPal resolves phishing on their end)
// (seems to only come from "outlook.com" and "paypal.com" hosts)
//
// X-Email-Type-Id = RT000238
// PPC001017
// RT000542 = gift message hack
// RT002947 = paypal invoice spam
// <https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-fraud/>
//
if (
  session.originalFromAddressRootDomain === 'paypal.com' &&
  headers.hasHeader('x-email-type-id') &&
  ['PPC001017', 'RT000238', 'RT000542', 'RT002947'].includes(
    headers.getFirst('x-email-type-id')
  )
) {
  const err = new SMTPError(
    'Due to ongoing PayPal invoice spam, you must manually send an invoice link'
  );
  err.isCodeBug = true; // alert admins for inspection
  throw err;
}
```

### 我们为什么必须屏蔽 PayPal {#why-we-had-to-block-paypal}

我们实施这一措施的原因是，尽管我们多次向 PayPal 的滥用团队报告，但 PayPal 仍拒绝修复大量垃圾邮件/网络钓鱼/欺诈问题。我们阻止的电子邮件类型具体包括：

* **RT000238** - 可疑发票通知
* **PPC001017** - 付款确认问题
* **RT000542** - 礼品信息被黑客入侵

### 问题的规模 {#the-scale-of-the-problem}

我们的垃圾邮件过滤日志显示，我们每天处理的 PayPal 发票垃圾邮件数量巨大。被拦截的主题示例包括：

* PayPal 账单团队开具的发票：- 此费用将从您的账户中自动扣除。请立即致电 [电话] 联系我们。
* 公司名称 [公司名称] (订单号 [ORDER-ID]) 开具的发票。
* 包含多个不同电话号码和虚假订单号的发票

这些电子邮件通常来自 `outlook.com` 主机，但看似来自 PayPal 的合法系统，因此特别危险。由于这些电子邮件是通过 PayPal 的实际基础设施发送的，因此它们能够通过 SPF、DKIM 和 DMARC 身份验证。

我们的技术日志显示这些垃圾邮件包含合法的 PayPal 标头：

* `X-Email-Type-Id: RT000238`（与我们阻止的 ID 相同）
* `From: "service@paypal.com" <service@paypal.com>`
* 来自 `paypal.com` 的有效 DKIM 签名
* 显示 PayPal 邮件服务器的正确 SPF 记录

这就造成了一种不可能的情况：合法的 PayPal 电子邮件和垃圾邮件都具有相同的技术特征。

### 讽刺 {#the-irony}

PayPal 本应引领金融诈骗的斗争，但其电子邮件模板设计却极其糟糕，甚至会触发反钓鱼系统。我们被迫屏蔽合法的 PayPal 邮件，因为它们与诈骗邮件难以区分。

这在安全研究中有所记录：[警惕PayPal新地址诈骗](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - 展示了 PayPal 自己的系统如何被利用进行欺诈。

### 现实世界的影响：新型 PayPal 诈骗 {#real-world-impact-novel-paypal-scams}

问题不仅仅在于糟糕的模板设计。PayPal 的发票系统极易被利用，骗子经常滥用它来发送看似合法的欺诈性发票。安全研究员 Gavin Anderegg 记录了 [新型 PayPal 骗局](https://anderegg.ca/2023/02/01/a-novel-paypal-scam) 的情况，骗子会通过所有身份验证检查，发送真实的 PayPal 发票：

> “检查邮件来源后，发现这封邮件似乎真的来自 PayPal（SPF、DKIM 和 DMARC 均已通过）。按钮还链接到一个看似合法的 PayPal 网址……我愣了一下才意识到这是一封合法邮件。我刚刚收到一张骗子发来的随机“发票”。

<figure>
<figcaption><div class="alert alert-danger small text-center">
屏幕截图显示，多张 PayPal 欺诈性发票涌入收件箱，所有发票都看似合法，因为它们实际上来自 PayPal 系统。
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

研究人员指出：

> “这似乎也算是一项 PayPal 应该考虑锁定的便捷功能。我立刻就觉得这是某种骗局，只对技术细节感兴趣。这看起来太容易上当了，我担心其他人也会上当。”

这完美地说明了问题所在：PayPal 自己的合法系统设计非常糟糕，以至于它们会导致欺诈，同时使合法通信看起来可疑。

更糟糕的是，这影响了我们与雅虎的交付能力，导致客户投诉以及数小时的细致测试和模式检查。

## PayPal 的反向 KYC 流程 {#paypals-backwards-kyc-process}

PayPal 平台最令人沮丧的一点是其在合规性和了解你的客户 (KYC) 流程方面的落后做法。与其他支付处理器不同，PayPal 允许开发者在未完成适当验证的情况下集成其 API 并开始在生产环境中收款。

### 工作原理 {#how-it-should-work}

每个合法的支付处理器都遵循以下逻辑顺序：

1. **首先完成 KYC 验证**
2. **批准商家账户**
3. **提供生产 API 访问权限**
4. **允许收款**

通过确保任何资金易手之前的合规性，这可以保护支付处理商和商家。

### PayPal 的实际运作方式 {#how-paypal-actually-works}

PayPal 的流程完全是倒退的：

1. **立即提供生产 API 访问权限**
2. **允许收款持续数小时或数天**
3. **突然冻结付款，恕不另行通知**
4. **在客户已受到影响后要求提供 KYC 文件**
5. **不通知商户**
6. **让客户发现问题并报告**

### 现实世界的影响 {#the-real-world-impact}

这种倒退的过程会给企业带来灾难：

* **客户在销售高峰期无法完成购买**
* **没有提前警告**需要验证
* **付款被阻止时没有电子邮件通知**
* **商家从困惑的客户那里了解到问题**
* **关键业务期间收入损失**
* **付款神秘失败时客户信任受损**

### 2025 年 7 月帐户迁移灾难 {#the-july-2025-account-migration-disaster}

2025年7月，我们例行账户迁移时就曾遇到过类似的情况。PayPal最初允许付款，然后突然在没有任何通知的情况下将其屏蔽。直到客户开始反映无法付款，我们才发现这个问题。

当我们联系客服时，他们给出了自相矛盾的回复，要求我们提供所需的文件，并且没有明确的解决时间表。这迫使我们彻底停止了 PayPal 付款，让那些没有其他付款方式的客户感到困惑。

### 为什么这很重要 {#why-this-matters}

PayPal 的合规做法表明其对企业运营方式存在根本性的误解。正确的 KYC 应该在生产集成之前进行，而不是在客户尝试付款之后。当问题出现时，PayPal 缺乏主动沟通，这表明它与商家的需求脱节。

这种落后的流程是 PayPal 更广泛的组织问题的征兆：他们优先考虑内部流程而不是商家和客户体验，从而导致了导致企业远离其平台的运营灾难。

## 其他支付处理器如何正确运作 {#how-every-other-payment-processor-does-it-right}

PayPal 拒绝实现的订阅列表功能，十多年来一直是行业标准。以下是其他支付处理商处理这一基本要求的方式：

### 条纹 {#stripe}

Stripe 自 API 上线以来就提供了订阅列表功能。他们的文档清晰地展示了如何检索客户或商家账户的所有订阅。这被视为基本的 CRUD 功能。

### 桨 {#paddle}

Paddle 提供全面的订阅管理 API，包括列表、筛选和分页。他们深知商家需要了解自己的经常性收入来源。

### Coinbase 商务 {#coinbase-commerce}

甚至像 Coinbase Commerce 这样的加密货币支付处理器也比 PayPal 提供更好的订阅管理。

### 正方形 {#square}

Square 的 API 将订阅列表作为一项基本功能，而不是事后才想到的功能。

### 行业标准 {#the-industry-standard}

每个现代支付处理器都提供：

* 列出所有订阅
* 按状态、日期和客户筛选
* 大数据集分页
* 订阅变更的 Webhook 通知
* 包含实用示例的详尽文档

### 其他处理器与 PayPal 相比提供哪些功能 {#what-other-processors-provide-vs-paypal}

**Stripe - 列出所有订阅：**

```http
GET https://api.stripe.com/v1/subscriptions
Authorization: Bearer sk_test_...

Response:
{
  "object": "list",
  "data": [
    {
      "id": "sub_1MowQVLkdIwHu7ixeRlqHVzs",
      "object": "subscription",
      "status": "active",
      "customer": "cus_Na6dX7aXxi11N4",
      "current_period_start": 1679609767,
      "current_period_end": 1682288167
    }
  ],
  "has_more": false
}
```

**Stripe - 按客户筛选：**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - 按状态过滤：**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - 您实际得到的是：**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# You can ONLY get ONE subscription if you already know the ID
# There is NO endpoint to list all subscriptions
# There is NO way to search or filter
# You must track all subscription IDs yourself
```

**PayPal 的可用端点：**

* `POST /v1/billing/subscriptions` - 创建订阅
* `GET /v1/billing/subscriptions/{id}` - 获取一个订阅（如果您知道 ID）
* `PATCH /v1/billing/subscriptions/{id}` - 更新订阅
* `POST /v1/billing/subscriptions/{id}/cancel` - 取消订阅
* `POST /v1/billing/subscriptions/{id}/suspend` - 暂停订阅

PayPal 缺少什么：

* ❌ 无 `GET /v1/billing/subscriptions`（列出全部）
* ❌ 无搜索功能
* ❌ 不支持按状态、客户和日期筛选
* ❌ 不支持分页

PayPal 是唯一一家强制开发人员在自己的数据库中手动跟踪订阅 ID 的主要支付处理商。

## PayPal 的系统性掩盖：压制 600 万人的声音 {#paypals-systematic-cover-up-silencing-6-million-voices}

最近，PayPal 将整个社区论坛下线，此举完美体现了 PayPal 处理批评的态度，实际上让 600 多万会员噤声，并删除了数十万条记录其失败的帖子。

### 大抹杀 {#the-great-erasure}

`paypal-community.com` 上的原始 PayPal 社区拥有**6,003,558 名成员**，其中包含数十万条关于 PayPal API 故障的帖子、错误报告、投诉和讨论。这代表了 PayPal 十多年来系统性问题的记录证据。

2025年6月30日，PayPal悄悄下线了整个论坛。所有`paypal-community.com`链接现在都返回404错误。这并非迁移或升级。

### 第三方救援 {#the-third-party-rescue}

幸运的是，[ppl.lithium.com](https://ppl.lithium.com/) 的第三方服务保留了部分内容，让我们能够访问 PayPal 试图隐藏的讨论。然而，第三方的保留并不完整，随时可能消失。

这种隐藏证据的做法对 PayPal 来说并不新鲜。他们有过这样的记录：

* 删除公众可见的关键错误报告
* 未经通知停止开发工具
* 更改 API 且未提供适当文档
* 禁止社区讨论其失败之处

论坛被关闭是迄今为止最肆无忌惮的企图，旨在掩盖其系统性失误，避免公众监督。

## 持续 11 年的捕获漏洞灾难：损失 1,899 美元，而且还在继续 {#the-11-year-capture-bug-disaster-1899-and-counting}

当 PayPal 忙于组织反馈会议并做出承诺时，其核心支付处理系统却已彻底崩溃，长达 11 年之久。证据确凿。

### 转发电子邮件造成 1,899 美元损失 {#forward-emails-1899-loss}

在我们的生产系统中，我们发现有 108 笔 PayPal 付款，总额达 **1,899 美元**，由于 PayPal 捕获失败而丢失。这些付款呈现出一致的模式：

* 已收到 `CHECKOUT.ORDER.APPROVED` 个 webhook
* PayPal 的捕获 API 返回 404 错误
* 订单无法通过 PayPal API 访问

由于 PayPal 会在 14 天后完全隐藏调试日志，并从仪表板中删除未捕获的订单 ID 的所有数据，因此无法确定客户是否被收费。

这仅代表一家企业。**超过11年来，数千家商户的集体损失可能高达数百万美元。**

**我们要再次声明：11 年多来，数千家商家的集体损失可能高达数百万美元。**

我们发现这一点的唯一原因是因为我们非常细致并且以数据为导向。

### 2013 年原始报告：11 年以上的疏忽{#the-2013-original-report-11-years-of-negligence}

关于此确切问题的最早记录报告出现在 [2013 年 11 月 Stack Overflow](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([已归档](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)) 上：

> “使用 Rest API 进行捕获时不断收到 404 错误”

2013 年报告的错误与 Forward Email 在 2024 年遇到的错误**相同**：

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

2013 年社区的反应很有启发：

> “目前 REST API 存在一个问题。PayPal 正在努力解决。”

**11年多过去了，他们仍在“努力”。**

### 2016 年承认：PayPal 破坏了他们自己的 SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

2016年，PayPal 自己的 GitHub 代码库记录了 [大规模捕获失败](https://github.com/paypal/PayPal-PHP-SDK/issues/660) 对其官方 PHP SDK 的影响。影响规模之大令人震惊：

> “自 2016 年 9 月 20 日起，所有 PayPal 数据捕获尝试均失败，并显示‘INVALID_RESOURCE_ID - 未找到请求的资源 ID’。9 月 19 日至 9 月 20 日期间，API 集成没有任何变化。**自 9 月 20 日起，100% 的捕获尝试均返回此错误。**”

一位商家报告说：

> “我在过去 24 小时内有超过 1,400 次捕获尝试失败，所有尝试均出现 INVALID_RESOURCE_ID 错误响应。”

PayPal 最初的反应是指责商家，并让他们寻求技术支持。在巨大的压力之下，他们才承认了错误：

> “我收到了产品开发人员的更新。他们注意到，在发送的标头中，PayPal 请求 ID 的长度为 42 个字符，但**似乎最近进行了更改，将此 ID 的长度限制为 38 个字符**。”

这一承认暴露了 PayPal 的系统性疏忽：

1. **他们做出了未记录的重大更改**
2. **他们破坏了自己的官方 SDK**
3. **他们先指责商家**
4. **他们只在压力之下才承认错误**

即使在“解决”该问题后，商家仍报告称：

> “已将 SDK 升级至 v1.7.4，但问题仍然存在。”

### 2024 年升级：仍然失败 {#the-2024-escalation-still-broken}

来自已保存的 PayPal 社区的最新报告显示，问题实际上变得更加严重。[2024 年 9 月讨论](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([已归档](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) 记录了同样的问题：

> “该问题大约在两周前才开始出现，并且不会影响所有订单。**更常见的问题似乎是捕获时出现 404 错误。**”

商家描述了转发电子邮件所经历的相同模式：

> “尝试捕获订单后，PayPal 返回 404。检索订单详细信息时：{'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **这没有任何表明我们成功捕获的痕迹。**”

### Webhook 可靠性灾难 {#the-webhook-reliability-disaster}

另一个 [保留社区讨论](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) 揭示了 PayPal 的 webhook 系统从根本上来说是不可靠的：

> “理论上，它应该有两个来自 Webhook 事件的事件（CHECKOUT.ORDER.APPROVED 和 PAYMENT.CAPTURE.COMPLETED）。实际上，**这两个事件很少会立即收到，PAYMENT.CAPTURE.COMPLETED 大多数情况下都无法收到，或者会在几个小时后收到。**”

对于订阅付款：

> “**有时无法收到‘PAYMENT.SALE.COMPLETED’，或者需要几个小时才能收到。**”

商家的疑问揭示了 PayPal 可靠性问题的严重性：

1. **“为什么会发生这种情况？”** - PayPal 的 Webhook 系统根本就存在问题
2. **“如果订单状态为‘已完成’，我可以认为我已经收到款项了吗？”** - 商家无法信任 PayPal 的 API 响应
3. **“为什么‘事件日志’->Webhook 事件’找不到任何日志？”** - 即使是 PayPal 自己的日志系统也无法正常工作

### 系统性疏忽模式 {#the-pattern-of-systematic-negligence}

证据跨越了 11 年多的时间，并显示出清晰的模式：

* **2013**：“PayPal 正在努力解决这个问题”
* **2016**：PayPal 承认存在重大变更，并提供修复方案
* **2024**：同样的错误仍在发生，影响了 Forward Email 和无数其他应用

这不是一个错误 - **这是系统性疏忽**。PayPal 十多年来一直知道这些关键的支付处理故障，并且一直：

1. **将 PayPal 漏洞归咎于商家**
2. **进行未记录的重大更改**
3. **提供的修复方案不充分且无效**
4. **忽视对企业的财务影响**
5. **通过关闭社区论坛来隐藏证据**

### 未记录的要求 {#the-undocumented-requirement}

PayPal 的官方文档中从未提及商家必须为捕获操作实现重试逻辑。他们的文档指出商家应该“批准后立即捕获”，但却没有提到他们的 API 会随机返回 404 错误，需要复杂的重试机制。

这迫使每个商家：

* 实现指数退避重试逻辑
* 处理不一致的 webhook 传递
* 构建复杂的状态管理系统
* 手动监控失败的捕获

**其他所有支付处理器均提供可靠的捕获 API，且首次运行。**

## PayPal 更广泛的欺骗模式 {#paypals-broader-pattern-of-deception}

捕获错误灾难只是 PayPal 欺骗客户和隐藏故障的系统方法的一个例子。

### 纽约金融服务部行动{#the-new-york-department-of-financial-services-action}

2025 年 1 月，纽约金融服务部针对欺骗行为发布了 [针对 PayPal 的执法行动](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) 警告，表明 PayPal 的欺骗模式远远超出了其 API 的范围。

此次监管行动表明 PayPal 愿意在其整个业务范围内采取欺骗行为，而不仅仅是在其开发工具范围内。

### Honey 诉讼：重写联盟链接 {#the-honey-lawsuit-rewriting-affiliate-links}

PayPal 收购 Honey 导致 [诉讼称 Honey 重写了联盟链接](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer) 窃取了内容创作者和网红的佣金。这体现了另一种系统性欺诈行为，PayPal 通过将本应归于他人的收入转移来牟利。

模式很清晰：

1. **API 故障**：隐藏故障功能，将责任推卸给商家
2. **社区禁言**：消除问题证据
3. **违反监管规定**：从事欺诈行为
4. **联盟营销盗窃**：通过技术手段窃取佣金

### PayPal 疏忽的代价 {#the-cost-of-paypals-negligence}

Forward Email 的 1,899 美元损失只是冰山一角。请考虑更广泛的影响：

* **个人商户**：数千家商家每家损失数百甚至数千美元
* **企业客户**：潜在数百万美元的收入损失
* **开发人员耗费大量时间**：他们耗费大量时间构建 PayPal 漏洞 API 的变通方案
* **客户信任**：企业因 PayPal 支付失败而失去客户

如果一个小型电子邮件服务损失近 2,000 美元，并且这个问题已经存在了 11 年以上，影响了数千家商家，那么集体财务损失可能总计**数亿美元**。

### 文档谎言 {#the-documentation-lie}

PayPal 的官方文档始终未提及商家可能遇到的关键限制和错误。例如：

* **捕获 API**：未提及 404 错误很常见且需要重试逻辑
* **Webhook 可靠性**：未提及 Webhook 通常会延迟数小时
* **订阅列表**：文档暗示即使不存在端点也可以列出订阅
* **会话超时**：未提及激进的 60 秒超时

这种系统性的关键信息遗漏迫使商家在生产系统中反复试验以发现 PayPal 的局限性，这常常导致财务损失。

## 这对开发者意味着什么 {#what-this-means-for-developers}

PayPal 在收集大量反馈的同时，却未能系统性地满足开发者的基本需求，这暴露出一个根本性的组织问题。他们把收集反馈当成了解决问题的替代品。

模式很清晰：

1. 开发人员报告问题
2. PayPal 组织高管反馈会议
3. 提供详尽的反馈
4. 团队承认差距并承诺“跟踪并解决”
5. 未实施任何措施
6. 高管跳槽至更好的公司
7. 新团队寻求相同的反馈
8. 循环往复

与此同时，开发人员被迫构建变通方法、损害安全性并处理损坏的用户界面才能接受付款。

如果您正在构建支付系统，请借鉴我们的经验：构建包含多个处理器的 [三连胜方法](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal)，但不要指望 PayPal 能够提供您所需的基本功能。从第一天起，就应制定变通方案。

> 这篇文章记录了我们在 Forward Email 使用 PayPal API 11 年的经验。所有代码示例和链接均来自我们的实际生产系统。尽管存在这些问题，我们仍继续支持 PayPal 付款，因为有些客户别无选择。

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />