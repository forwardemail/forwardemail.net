# PayPal 11 年的 API 灾难：当他们忽视开发者时，我们如何构建变通方案 {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

> \[!NOTE]
> **成功！PayPal 终于添加了 `GET /v1/billing/subscriptions` 端点。**
>
> 在我们发布这篇文章并将其通过邮件发送给 PayPal 高层领导后，他们的团队实现了急需的订阅列表端点。该变更出现在 [2025 年 6 月 25 日](https://web.archive.org/web/20250625121019/https://developer.paypal.com/docs/api/subscriptions/v1/) 和 [2025 年 7 月 9 日](https://web.archive.org/web/20250709102200/https://developer.paypal.com/docs/api/subscriptions/v1/) 之间的某个时间点。
>
> 然而，典型的 PayPal 风格是，他们从未通知我们。我们是在 2025 年 12 月自己发现了这个更新，距离该功能悄然发布已经过去数月。

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">在 Forward Email，我们已经与 PayPal 破碎的 API 打交道超过十年。最初只是些小挫折，最终演变成一场彻底的灾难，迫使我们构建自己的变通方案，屏蔽他们的钓鱼模板，并在关键账户迁移期间最终停止所有 PayPal 付款。</p>
<p class="lead mt-3">这是 PayPal 11 年忽视基本开发者需求，而我们竭尽全力让他们的平台正常工作的故事。</p>


## 目录 {#table-of-contents}

* [缺失的关键：无法列出订阅](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017：问题浮现](#2014-2017-the-problem-emerges)
* [2020：我们提供了详尽反馈](#2020-we-give-them-extensive-feedback)
  * [27 项反馈清单](#the-27-item-feedback-list)
  * [团队介入，承诺被做出](#teams-got-involved-promises-were-made)
  * [结果？无任何改变。](#the-result-nothing)
* [高管大逃亡：PayPal 如何失去所有机构记忆](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025：新领导，同样的问题](#2025-new-leadership-same-problems)
  * [新 CEO 介入](#the-new-ceo-gets-involved)
  * [Michelle Gill 的回应](#michelle-gills-response)
  * [我们的回应：不再开会](#our-response-no-more-meetings)
  * [Marty Brodbeck 的过度设计回应](#marty-brodbecks-overengineering-response)
  * [“简单 CRUD”的矛盾](#the-simple-crud-contradiction)
  * [断层变得清晰](#the-disconnect-becomes-clear)
* [他们忽视的多年漏洞报告](#years-of-bug-reports-they-ignored)
  * [2016：早期 UI/UX 投诉](#2016-early-uiux-complaints)
  * [2021：商业邮箱漏洞报告](#2021-business-email-bug-report)
  * [2021：UI 改进建议](#2021-ui-improvement-suggestions)
  * [2021：沙箱环境故障](#2021-sandbox-environment-failures)
  * [2021：报告系统完全崩溃](#2021-reports-system-completely-broken)
  * [2022：核心 API 功能缺失（再次）](#2022-core-api-feature-missing-again)
* [开发者体验噩梦](#the-developer-experience-nightmare)
  * [破碎的用户界面](#broken-user-interface)
  * [SDK 问题](#sdk-problems)
  * [内容安全策略违规](#content-security-policy-violations)
  * [文档混乱](#documentation-chaos)
  * [安全漏洞](#security-vulnerabilities)
  * [会话管理灾难](#session-management-disaster)
* [2025 年 7 月：压垮骆驼的最后一根稻草](#july-2025-the-final-straw)
* [为什么我们不能轻易放弃 PayPal](#why-we-cant-just-drop-paypal)
* [社区变通方案](#the-community-workaround)
* [因钓鱼屏蔽 PayPal 模板](#blocking-paypal-templates-due-to-phishing)
  * [真正的问题：PayPal 模板看起来像诈骗](#the-real-problem-paypals-templates-look-like-scams)
  * [我们的实现](#our-implementation)
  * [我们为何必须屏蔽 PayPal](#why-we-had-to-block-paypal)
  * [问题规模](#the-scale-of-the-problem)
  * [讽刺意味](#the-irony)
  * [现实影响：新型 PayPal 诈骗](#real-world-impact-novel-paypal-scams)
* [PayPal 反向的 KYC 流程](#paypals-backwards-kyc-process)
  * [理应如何运作](#how-it-should-work)
  * [PayPal 实际如何运作](#how-paypal-actually-works)
  * [现实影响](#the-real-world-impact)
  * [2025 年 7 月账户迁移灾难](#the-july-2025-account-migration-disaster)
  * [为何这很重要](#why-this-matters)
* [其他支付处理商的正确做法](#how-every-other-payment-processor-does-it-right)
  * [Stripe](#stripe)
  * [Paddle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Square](#square)
  * [行业标准](#the-industry-standard)
  * [其他处理商提供的 vs PayPal](#what-other-processors-provide-vs-paypal)
* [PayPal 系统性掩盖：封杀 600 万声音](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [大清除](#the-great-erasure)
  * [第三方救援](#the-third-party-rescue)
* [11 年的捕获漏洞灾难：$1,899 及持续增加](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Forward Email 损失 $1,899](#forward-emails-1899-loss)
  * [2013 年原始报告：11 年以上的疏忽](#the-2013-original-report-11-years-of-negligence)
  * [2016 年承认：PayPal 破坏了自家 SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [2024 年升级：依然故障](#the-2024-escalation-still-broken)
  * [Webhook 可靠性灾难](#the-webhook-reliability-disaster)
  * [系统性疏忽的模式](#the-pattern-of-systematic-negligence)
  * [未记录的要求](#the-undocumented-requirement)
* [PayPal 更广泛的欺骗模式](#paypals-broader-pattern-of-deception)
  * [纽约金融服务部行动](#the-new-york-department-of-financial-services-action)
  * [Honey 诉讼：重写联盟链接](#the-honey-lawsuit-rewriting-affiliate-links)
  * [PayPal 疏忽的代价](#the-cost-of-paypals-negligence)
  * [文档谎言](#the-documentation-lie)
* [这对开发者意味着什么](#what-this-means-for-developers)
## 缺失的环节：无法列出订阅 {#the-missing-piece-no-way-to-list-subscriptions}

让我们震惊的是：PayPal 自 2014 年起就支持订阅计费，但他们从未为商家提供列出自己所有订阅的方式。

想想看。你可以创建订阅，如果有 ID 也能取消订阅，但你无法获取账户下所有活跃订阅的列表。这就像有一个数据库却没有 SELECT 语句。

我们需要这个功能来支持基本的业务操作：

* 客户支持（当有人发邮件询问他们的订阅时）
* 财务报告和对账
* 自动化账单管理
* 合规和审计

但 PayPal？他们就是……从未开发过。


## 2014-2017：问题浮现 {#2014-2017-the-problem-emerges}

订阅列表问题最早在 2017 年出现在 PayPal 的社区论坛。开发者们提出了显而易见的问题：“我如何获取所有订阅的列表？”

PayPal 的回应？鸦雀无声。

社区成员开始感到沮丧：

> “如果商家无法列出所有活跃协议，这真是非常奇怪的遗漏。如果协议 ID 丢失，这意味着只有用户自己能取消或暂停协议。” - leafspider

> “+1。已经快 3 年了。” - laudukang（意思是问题自大约 2014 年就存在）

2017 年的[原始社区帖子](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066)显示开发者们在恳求这项基本功能。PayPal 的回应是将报告问题的仓库归档。


## 2020：我们给出了详尽反馈 {#2020-we-give-them-extensive-feedback}

2020 年 10 月，PayPal 主动联系了我们进行正式反馈会议。这不是随意聊天——他们组织了一场 45 分钟的 Microsoft Teams 会议，参加者包括 8 位 PayPal 高管，如 Sri Shivananda（CTO）、Edwin Aoki、Jim Magats、John Kunze 等。

### 27 项反馈清单 {#the-27-item-feedback-list}

我们做了充分准备。经过 6 小时尝试集成他们的 API，我们整理出了 27 个具体问题。PayPal Checkout 团队的 Mark Stuart 说：

> 嗨 Nick，感谢你今天与大家分享！我认为这将成为推动我们团队获得更多支持和投资以修复这些问题的催化剂。像你给出的丰富反馈，我们很难得到。

这些反馈不是理论上的——而是来自真实的集成尝试：

1. **访问令牌生成不工作**：

> 访问令牌生成不工作。而且，示例不应该只有 cURL。

2. **没有订阅创建的网页 UI**：

> 没有网页 UI，怎么可能不通过 cURL 创建订阅？（Stripe 有网页 UI）

Mark Stuart 对访问令牌问题尤为关注：

> 我们通常不会听说访问令牌生成有问题。

### 多团队介入，承诺纷纷 {#teams-got-involved-promises-were-made}

随着我们发现更多问题，PayPal 不断加入更多团队参与讨论。订阅管理 UI 团队的 Darshan Raju 加入并表示：

> 承认存在差距。我们会跟踪并解决。再次感谢你的反馈！

会议被描述为寻求：

> 你体验的坦诚走查

以：

> 让 PayPal 成为开发者应有的样子。

### 结果？毫无进展。 {#the-result-nothing}

尽管有正式反馈会议、详尽的 27 项清单、多团队参与和承诺：

> 跟踪并解决

问题，结果却是一点修复都没有。


## 高管大逃亡：PayPal 如何失去所有机构记忆 {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

这里变得非常有趣。所有收到我们 2020 年反馈的人都已经离开了 PayPal：

**领导层变动：**

* [Dan Schulman（担任 CEO 9 年）→ Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/)（2023 年 9 月）
* [Sri Shivananda（组织反馈的 CTO）→ 摩根大通](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/)（2024 年 1 月）
**做出承诺后离开的技术领导者：**

* **Mark Stuart**（承诺反馈将成为“催化剂”）→ [现任Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats**（18年PayPal资深员工）→ [MX首席执行官](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html)（2022年）
* **John Kunze**（全球消费者产品副总裁）→ [退休](https://www.linkedin.com/in/john-kunze-5724a86)（2023年）
* **Edwin Aoki**（为数不多的剩余人员之一）→ [刚刚跳槽至纳斯达克](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ)（2025年1月）

PayPal 已成为一个旋转门，管理层收集开发者反馈，做出承诺，然后跳槽到更好的公司，如摩根大通、Ripple及其他金融科技公司。

这也解释了为什么2025年的GitHub问题回复与我们2020年的反馈完全脱节——收到反馈的几乎所有人都已经离开了PayPal。


## 2025年：新领导，同样的问题 {#2025-new-leadership-same-problems}

快进到2025年，同样的模式再次出现。经过多年的停滞，PayPal的新领导层再次主动联系。

### 新任CEO介入 {#the-new-ceo-gets-involved}

2025年6月30日，我们直接向PayPal新任CEO Alex Chriss升级反馈。他的回复简短：

> Hi Nick – Thank you for reaching out and the feedback. Michelle (cc'd) is on point with her team to engage and work through this with you. Thanks -A

### Michelle Gill的回复 {#michelle-gills-response}

Michelle Gill，负责小企业和金融服务的执行副总裁兼总经理，回复道：

> Thanks very much Nick, moving Alex to bcc. We have been looking into this since your earlier post. We will give you a call before the week is out. Can you please send me your contact info so one of my colleagues can reach out. Michelle

### 我们的回复：不再开会 {#our-response-no-more-meetings}

我们拒绝了另一次会议，表达了我们的沮丧：

> Thank you. However I don't feel like getting on a call is going to do anything. Here's why... I got on a call in the past and it went absolutely nowhere. I wasted 2+ hours of my time talking to the entire team and leadership and nothing got done... Tons of emails back and forth. Absolutely nothing done. Feedback went nowhere. I tried for years, get listened to, and then it goes nowhere.

### Marty Brodbeck的过度设计回复 {#marty-brodbecks-overengineering-response}

随后，负责PayPal消费者工程的Marty Brodbeck联系了我们：

> Hi Nick, this is Marty Brodbeck. I head up all consumer engineering here at PayPal and have been driving the api development for the company. Can you and I connect on the problem you are facing and how we may help here.

当我们解释了对订阅列表端点的简单需求时，他的回复暴露了问题的根源：

> Thanks Nick, we are in the process of creating a single subscription api with full SDK (supports full error handling, event-based subscription tracking, robust uptime) where billing is also split out as a separate API for merchants to go to rather than having to orchestrate across multiple endpoints to get a single response.

这恰恰是错误的做法。我们不需要几个月的复杂架构。我们需要一个简单的REST端点来列出订阅——这本应自2014年起就存在。

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### “简单CRUD”矛盾 {#the-simple-crud-contradiction}

当我们指出这只是自2014年起就应存在的基本CRUD功能时，Marty的回复耐人寻味：

> Simple Crud operations are part of the core API my friend, so it won't take months of development

而PayPal的TypeScript SDK，目前经过数月开发仅支持三个端点，以及其历史时间线，清楚表明此类项目远非几个月即可完成。
这个回应显示他不理解他自己的 API。如果“简单的 CRUD 操作是核心 API 的一部分”，那么订阅列表的端点在哪里？我们的回应是：

> 如果“简单的 CRUD 操作是核心 API 的一部分”，那么订阅列表的端点在哪里？开发者们自 2014 年起就一直在请求这个“简单的 CRUD 操作”。已经 11 年了。其他所有支付处理商从第一天起就拥有这个基本功能。

### 脱节变得明显 {#the-disconnect-becomes-clear}

2025 年与 Alex Chriss、Michelle Gill 和 Marty Brodbeck 的交流显示了同样的组织功能失调：

1. **新领导层不了解之前的反馈会议**
2. **他们提出同样的过度设计的解决方案**
3. **他们不理解自己 API 的限制**
4. **他们想要更多会议，而不是直接解决问题**

这种模式解释了为什么 2025 年的 PayPal 团队似乎完全脱节于 2020 年提供的大量反馈——收到那些反馈的人已经离开，新领导层在重复同样的错误。

## 多年被忽视的错误报告 {#years-of-bug-reports-they-ignored}

我们不仅仅是抱怨缺失的功能。我们积极报告错误并尝试帮助他们改进。以下是我们记录的问题的完整时间线：

### 2016 年：早期 UI/UX 投诉 {#2016-early-uiux-complaints}

早在 2016 年，我们就公开向 PayPal 领导层（包括 Dan Schulman）反映界面问题和可用性问题。那是 9 年前了，而同样的 UI/UX 问题至今依然存在。

### 2021 年：商业邮箱错误报告 {#2021-business-email-bug-report}

2021 年 3 月，我们报告 PayPal 的商业邮箱系统发送了错误的取消通知。邮件模板中的变量渲染错误，向客户显示了令人困惑的信息。

Mark Stuart 承认了这个问题：

> 谢谢 Nick！改用密送。@Prasy，你们团队负责这封邮件吗？或者知道是谁负责吗？“Niftylettuce, LLC，我们将不再向您收费”让我觉得邮件的收件人和内容混淆了。

**结果**：他们实际上修复了这个问题！Mark Stuart 确认：

> 刚收到通知团队的消息，邮件模板已经修复并推送上线。感谢你主动报告这个问题。谢谢！

这表明他们确实能修复问题——只是大多数情况下选择不修。

### 2021 年：UI 改进建议 {#2021-ui-improvement-suggestions}

2021 年 2 月，我们对他们的仪表盘 UI，特别是“PayPal 最近活动”部分，提供了详细反馈：

> 我认为 paypal.com 的仪表盘，特别是“PayPal 最近活动”需要改进。我觉得不应该显示 $0 的定期付款“已创建”状态行——这只会增加大量无用行，无法一眼看出当天/过去几天的收入情况。

Mark Stuart 转发给了消费者产品团队：

> 谢谢！我不确定哪个团队负责“活动”，但我已转发给消费者产品负责人以找到正确团队。$0.00 的定期付款看起来像是个错误，应该过滤掉。

**结果**：从未修复。UI 仍然显示这些无用的 $0 条目。

### 2021 年：沙箱环境故障 {#2021-sandbox-environment-failures}

2021 年 11 月，我们报告了 PayPal 沙箱环境的关键问题：

* 沙箱秘密 API 密钥被随机更改并禁用
* 所有沙箱测试账户被无通知删除
* 尝试查看沙箱账户详情时出现错误信息
* 间歇性加载失败

> 不知为何我的沙箱秘密 API 密钥被更改并禁用了。所有旧的沙箱测试账户也被删除了。

> 有时能加载，有时不能。这非常令人沮丧。

**结果**：没有回应，没有修复。开发者仍然面临沙箱可靠性问题。

### 2021 年：报告系统完全崩溃 {#2021-reports-system-completely-broken}
2021年5月，我们报告了PayPal的交易报告下载系统完全失效：

> 似乎报告下载现在无法正常工作，而且整天都没用。失败时也应该收到邮件通知。

我们还指出了会话管理的灾难：

> 另外，如果你登录PayPal后5分钟不活动，就会被登出。所以当你刷新想查看状态的报告旁边的按钮时（等了很久之后），必须重新登录，真是麻烦。

Mark Stuart承认了会话超时问题：

> 我记得你之前报告过会话经常过期，导致你在IDE和developer.paypal.com或商户后台之间切换时开发流程被打断，然后回来又被登出。

**结果**：会话超时仍然是60秒。报告系统仍然经常失败。

### 2022年：核心API功能缺失（再次）{#2022-core-api-feature-missing-again}

2022年1月，我们再次升级了订阅列表问题，这次更详细地指出他们文档的错误：

> 没有GET接口可以列出所有订阅（以前称为计费协议）

我们发现他们的官方文档完全不准确：

> API文档也完全不准确。我们本以为可以通过下载硬编码的订阅ID列表来做个变通。但这甚至都行不通！

> 从这里的官方文档来看……它说你可以这么做……关键是——根本找不到任何“订阅ID”字段可以勾选。

PayPal的Christina Monti回复：

> 对于这些步骤错误带来的挫折感表示歉意，我们这周会修复。

CTO Sri Shivananda感谢我们：

> 感谢你们持续帮助我们变得更好，非常感谢。

**结果**：文档从未修正。订阅列表端点从未创建。


## 开发者体验噩梦 {#the-developer-experience-nightmare}

使用PayPal的API就像回到了10年前。以下是我们记录的技术问题：

### 界面崩溃 {#broken-user-interface}

PayPal开发者后台是一场灾难。以下是我们每天面对的情况：

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  PayPal的UI如此糟糕，甚至无法关闭通知
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  开发者后台竟然让你拖动滑块，然后60秒后登出
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  PayPal开发者界面更多UI灾难，显示工作流程崩溃
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  订阅管理界面——界面糟糕到我们不得不依赖代码生成产品和订阅计划
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  破损的订阅界面视图，功能缺失（你无法轻松创建产品/计划/订阅——而且UI中似乎根本没有办法删除已创建的产品或计划）
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  典型的 PayPal 错误信息 - 难以理解且无帮助
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### SDK 问题 {#sdk-problems}

* 无法同时处理一次性付款和订阅，除非通过复杂的变通方法，涉及切换和重新渲染按钮，同时用 script 标签重新加载 SDK
* JavaScript SDK 违反基本规范（类名小写，不进行实例检查）
* 错误信息不指明缺少哪些字段
* 数据类型不一致（要求金额为字符串而非数字）

### 内容安全策略违规 {#content-security-policy-violations}

他们的 SDK 需要在你的 CSP 中使用 unsafe-inline 和 unsafe-eval，**迫使你妥协你网站的安全性**。

### 文档混乱 {#documentation-chaos}

Mark Stuart 本人承认：

> 同意存在大量荒谬的遗留和新 API。真的很难找到需要查找的内容（即使是我们这些在这里工作的人）。

### 安全漏洞 {#security-vulnerabilities}

**PayPal 的双因素认证实现是反向的**。即使启用了 TOTP 应用，他们仍强制短信验证——使账户易受 SIM 卡交换攻击。如果启用了 TOTP，应该只使用它。备用方式应为电子邮件，而非短信。

### 会话管理灾难 {#session-management-disaster}

**他们的开发者控制台在 60 秒无操作后会自动登出**。尝试做任何有成效的事情，你都会不断经历：登录 → 验证码 → 双因素认证 → 登出 → 重复。使用 VPN？祝你好运。

## 2025 年 7 月：压垮骆驼的最后一根稻草 {#july-2025-the-final-straw}

经历了 11 年的同样问题后，破裂点出现在一次例行账户迁移中。我们需要切换到一个新的 PayPal 账户，以匹配我们的公司名称“Forward Email LLC”，以便更清晰的财务核算。

本应简单的事情变成了彻底的灾难：

* 初步测试显示一切正常
* 几小时后，PayPal 突然无预警地阻止了所有订阅付款
* 客户无法付款，造成混乱和支持负担
* PayPal 支持给出矛盾的答复，声称账户已验证
* 我们被迫完全停止 PayPal 付款

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  客户尝试付款时看到的错误 - 无解释，无日志，什么都没有
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  PayPal 支持声称一切正常，而付款完全失效。最后一条消息显示他们说“恢复了一些功能”，但仍要求提供更多未说明的信息——典型的 PayPal 支持戏码
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
  据称“解决”问题的身份验证流程，实际上毫无作用
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
  模糊的信息且仍无解决方案。没有任何信息、通知或说明需要哪些额外信息。客户支持陷入沉默。
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>


## 为什么我们不能完全放弃 PayPal {#why-we-cant-just-drop-paypal}

尽管存在所有这些问题，我们不能完全放弃 PayPal，因为有些客户只有 PayPal 作为支付选项。正如一位客户在我们的[状态页面](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515)所说：

> PayPal 是我唯一的支付选项

**我们被迫支持一个有缺陷的平台，因为 PayPal 为某些用户创造了支付垄断。**


## 社区的解决方案 {#the-community-workaround}

由于 PayPal 不提供基本的订阅列表功能，开发者社区构建了替代方案。我们创建了一个脚本来帮助管理 PayPal 订阅：[set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

该脚本引用了一个[社区 gist](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4)，开发者们在这里分享解决方案。用户实际上在[感谢我们](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775)，因为我们提供了 PayPal 多年前本应构建的功能。


## 因钓鱼而屏蔽 PayPal 模板 {#blocking-paypal-templates-due-to-phishing}

问题不仅仅是 API。PayPal 的邮件模板设计非常糟糕，我们不得不在邮件服务中实施特定过滤，因为它们与钓鱼邮件几乎无法区分。

### 真正的问题：PayPal 的模板看起来像诈骗邮件 {#the-real-problem-paypals-templates-look-like-scams}

我们经常收到报告，称 PayPal 邮件看起来完全像钓鱼邮件。以下是我们滥用报告中的一个真实例子：

**主题：** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

这封邮件被转发到 `abuse@microsoft.com`，因为它看起来像钓鱼邮件。问题是？它实际上来自 PayPal 的沙箱环境，但他们的模板设计太差，触发了钓鱼检测系统。

### 我们的实现 {#our-implementation}

您可以在我们的[邮件过滤代码](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172)中看到我们针对 PayPal 的特定过滤实现：

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

### 我们为何必须屏蔽 PayPal {#why-we-had-to-block-paypal}

我们实施此措施是因为 PayPal 拒绝修复大量垃圾邮件/钓鱼/欺诈问题，尽管我们多次向他们的滥用团队报告。我们屏蔽的具体邮件类型包括：

* **RT000238** - 可疑的发票通知
* **PPC001017** - 有问题的付款确认
* **RT000542** - 礼物信息攻击尝试

### 问题的规模 {#the-scale-of-the-problem}

我们的垃圾邮件过滤日志显示了我们每天处理的大量 PayPal 发票垃圾邮件。被屏蔽的主题示例包括：

* "Invoice from PayPal Billing Team:- This charge will be auto-debited from your account. Please contact us immediately at \[PHONE]"
* "Invoice from \[COMPANY NAME] (\[ORDER-ID])"
* 多个带有不同电话号码和虚假订单号的变体
这些电子邮件通常来自 `outlook.com` 主机，但看起来是源自 PayPal 的合法系统，使它们特别危险。由于通过 PayPal 的实际基础设施发送，这些邮件通过了 SPF、DKIM 和 DMARC 认证。

我们的技术日志显示这些垃圾邮件包含合法的 PayPal 头信息：

* `X-Email-Type-Id: RT000238`（我们阻止的相同 ID）
* `From: "service@paypal.com" <service@paypal.com>`
* 来自 `paypal.com` 的有效 DKIM 签名
* 显示 PayPal 邮件服务器的正确 SPF 记录

这造成了一个不可能的局面：合法的 PayPal 邮件和垃圾邮件在技术特征上完全相同。

### 讽刺的是 {#the-irony}

PayPal 作为一家本应引领打击金融欺诈的公司，其电子邮件模板设计如此糟糕，以至于触发了反钓鱼系统。我们被迫阻止合法的 PayPal 邮件，因为它们与诈骗邮件无法区分。

这在安全研究中有记录：[警惕 PayPal 新地址欺诈](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) —— 展示了 PayPal 自身系统如何被利用进行欺诈。

### 现实影响：新型 PayPal 诈骗 {#real-world-impact-novel-paypal-scams}

问题不仅仅是模板设计差。PayPal 的发票系统极易被利用，骗子经常滥用它发送看似合法的欺诈发票。安全研究员 Gavin Anderegg 记录了[一种新型 PayPal 诈骗](https://anderegg.ca/2023/02/01/a-novel-paypal-scam)，骗子发送通过所有认证检查的真实 PayPal 发票：

> “检查邮件源时，邮件看起来确实来自 PayPal（SPF、DKIM 和 DMARC 全部通过）。按钮也链接到看似合法的 PayPal URL……我花了一会儿才意识到这是一封合法邮件。我刚刚收到了一张骗子随机发送的‘发票’。”

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  截图显示多个欺诈性 PayPal 发票涌入收件箱，所有发票看起来都合法，因为它们实际上来自 PayPal 的系统
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

研究员指出：

> “这似乎也是 PayPal 应该考虑锁定的一个便利功能。我立刻认为这是一种诈骗，只对技术细节感兴趣。实施起来似乎太容易了，我担心其他人可能会上当。”

这完美地说明了问题：PayPal 自身的合法系统设计如此糟糕，既助长了欺诈，又使合法通信看起来可疑。

更糟糕的是，这影响了我们在 Yahoo 的投递率，导致客户投诉和数小时的细致测试及模式检查。

## PayPal 反向的 KYC 流程 {#paypals-backwards-kyc-process}

PayPal 平台最令人沮丧的方面之一是其反向的合规和了解客户（KYC）程序。与其他支付处理商不同，PayPal 允许开发者集成其 API 并在完成适当验证之前开始生产环境收款。

### 正确的流程应该是 {#how-it-should-work}

每个合法的支付处理商都遵循以下逻辑顺序：

1. **先完成 KYC 验证**
2. **批准商户账户**
3. **提供生产 API 访问权限**
4. **允许收款**

这保护了支付处理商和商户，确保在资金流动前合规。

### PayPal 实际的工作方式 {#how-paypal-actually-works}

PayPal 的流程完全相反：

1. **立即提供生产 API 访问权限**
2. **允许收款数小时或数天**
3. **突然无通知地阻止付款**
4. **在客户已受影响后要求 KYC 资料**
5. **不向商户发出任何通知**
6. **让客户发现问题并举报**
### 现实影响 {#the-real-world-impact}

这种倒退的流程给企业带来了灾难：

* **客户在销售高峰期无法完成购买**
* **没有提前警告**需要验证
* **付款被阻止时没有邮件通知**
* **商家从困惑的客户那里得知问题**
* **关键业务期间的收入损失**
* **付款神秘失败时客户信任受损**

### 2025年7月账户迁移灾难 {#the-july-2025-account-migration-disaster}

这个场景正是在我们2025年7月例行账户迁移时发生的。PayPal最初允许付款正常进行，随后突然阻止付款且没有任何通知。我们是在客户开始报告无法付款时才发现问题。

当我们联系支持时，收到关于所需文档的矛盾回复，且没有明确的解决时间表。这迫使我们完全停止PayPal付款，令没有其他支付选项的客户感到困惑。

### 这为何重要 {#why-this-matters}

PayPal的合规方式显示出对企业运营的根本误解。正确的KYC应在生产集成**之前**完成，而不是客户已经尝试付款之后。问题出现时缺乏主动沟通，体现了PayPal与商家需求的脱节。

这种倒退的流程是PayPal更广泛组织问题的症状：他们优先考虑内部流程，而非商家和客户体验，导致运营灾难，驱使企业远离其平台。

## 其他支付处理商的正确做法 {#how-every-other-payment-processor-does-it-right}

PayPal拒绝实现的订阅列表功能，行业内已成为十多年的标准。其他支付处理商如何处理这一基本需求：

### Stripe {#stripe}

Stripe自API发布以来就支持订阅列表。其文档清楚展示如何检索客户或商家账户的所有订阅。这被视为基本的CRUD功能。

### Paddle {#paddle}

Paddle提供全面的订阅管理API，包括列表、过滤和分页。他们理解商家需要查看其经常性收入流。

### Coinbase Commerce {#coinbase-commerce}

即使是加密货币支付处理商Coinbase Commerce，也提供比PayPal更好的订阅管理。

### Square {#square}

Square的API将订阅列表作为基本功能，而非事后补充。

### 行业标准 {#the-industry-standard}

每个现代支付处理商都提供：

* 列出所有订阅
* 按状态、日期、客户过滤
* 大数据集的分页
* 订阅变更的Webhook通知
* 详尽的文档和可用示例

### 其他处理商提供的功能 vs PayPal {#what-other-processors-provide-vs-paypal}

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

**Stripe - 按客户过滤：**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - 按状态过滤：**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - 你实际得到的：**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# 你只能获取已知ID的单个订阅
# 没有列出所有订阅的端点
# 没有搜索或过滤功能
# 你必须自己跟踪所有订阅ID
```

**PayPal可用端点：**

* `POST /v1/billing/subscriptions` - 创建订阅
* `GET /v1/billing/subscriptions/{id}` - 获取单个订阅（如果你知道ID）
* `PATCH /v1/billing/subscriptions/{id}` - 更新订阅
* `POST /v1/billing/subscriptions/{id}/cancel` - 取消订阅
* `POST /v1/billing/subscriptions/{id}/suspend` - 暂停订阅
**PayPal 缺失的功能：**

* ❌ 没有 `GET /v1/billing/subscriptions`（列出所有订阅）
* ❌ 没有搜索功能
* ❌ 无法按状态、客户、日期过滤
* ❌ 不支持分页

PayPal 是唯一一个强制开发者在自己数据库中手动跟踪订阅 ID 的主要支付处理商。


## PayPal 的系统性掩盖：封杀 600 万声音 {#paypals-systematic-cover-up-silencing-6-million-voices}

PayPal 最近将其整个社区论坛下线，这一举动完美体现了其处理批评的方式，实际上封杀了超过 600 万会员，抹去了数十万条记录其失败的帖子。

### 大清除 {#the-great-erasure}

原 PayPal 社区网站 `paypal-community.com` 拥有 **6,003,558 名会员**，包含数十万条帖子、错误报告、投诉以及关于 PayPal API 失败的讨论。这代表了超过十年的 PayPal 系统性问题的文档证据。

2025 年 6 月 30 日，PayPal 静悄悄地将整个论坛下线。所有 `paypal-community.com` 链接现在均返回 404 错误。这不是迁移或升级。

### 第三方救援 {#the-third-party-rescue}

幸运的是，第三方服务 [ppl.lithium.com](https://ppl.lithium.com/) 保存了一部分内容，使我们能够访问 PayPal 试图隐藏的讨论内容。然而，这种第三方保存并不完整，且随时可能消失。

PayPal 隐藏证据的模式并不新鲜。他们有着以下记录：

* 从公开视野中移除关键错误报告
* 无预警地停止开发者工具
* 未经充分文档说明更改 API
* 封杀关于其失败的社区讨论

论坛下线是迄今为止最公然的试图掩盖其系统性失败的行为。


## 11 年捕获错误灾难：损失 $1,899 还在增加 {#the-11-year-capture-bug-disaster-1899-and-counting}

当 PayPal 忙于组织反馈会议和做出承诺时，其核心支付处理系统已经根本性地损坏超过 11 年。证据令人震惊。

### Forward Email 损失 $1,899 {#forward-emails-1899-loss}

在我们的生产系统中，发现了 108 笔 PayPal 付款，总计 **$1,899** 因 PayPal 捕获失败而丢失。这些付款表现出一致的模式：

* 收到了 `CHECKOUT.ORDER.APPROVED` webhook
* PayPal 的捕获 API 返回 404 错误
* 订单通过 PayPal API 无法访问

由于 PayPal 在 14 天后完全隐藏调试日志，并且对未捕获的订单 ID 从仪表盘删除所有数据，无法确定客户是否被收费。

这仅代表一个业务。**数千商家在 11 年以上时间里的累计损失可能高达数百万美元。**

**我们再说一遍：数千商家在 11 年以上时间里的累计损失可能高达数百万美元。**

我们之所以发现此问题，是因为我们极其细致且数据驱动。

### 2013 年最早报告：11 年以上的疏忽 {#the-2013-original-report-11-years-of-negligence}

最早关于此问题的文档报告出现在 [2013 年 11 月的 Stack Overflow](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)（[存档](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)）：

> “执行捕获时，REST API 持续收到 404 错误”

2013 年报告的错误与 Forward Email 2024 年遇到的错误 **完全相同**：

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

2013 年社区的回应耐人寻味：

> “目前 REST API 存在已报告的问题。PayPal 正在处理。”
**11年以上过去了，他们仍在“努力解决”。**

### 2016年承认：PayPal 自己破坏了他们的 SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

2016年，PayPal 自己的 GitHub 仓库记录了影响其官方 PHP SDK 的[大规模捕获失败](https://github.com/paypal/PayPal-PHP-SDK/issues/660)。规模惊人：

> “自2016年9月20日起，所有 PayPal 捕获尝试均失败，错误为 ‘INVALID_RESOURCE_ID - 请求的资源 ID 未找到。’ 在9月19日和9月20日之间，API 集成没有任何更改。**自9月20日起，100%的捕获尝试都返回此错误。**”

一位商家报告：

> “在过去24小时内，我有**超过1400次捕获失败尝试**，全部返回 INVALID_RESOURCE_ID 错误响应。”

PayPal 最初的回应是指责商家，并将其转给技术支持。只有在巨大压力下，他们才承认错误：

> “我从我们的产品开发人员那里得到更新。他们注意到发送的请求头中 PayPal-Request-ID 长度为42个字符，但**似乎最近发生了更改，将此 ID 限制为仅38个字符。**”

这一承认暴露了 PayPal 的系统性疏忽：

1. **他们进行了未记录的破坏性更改**
2. **他们破坏了自己的官方 SDK**
3. **他们首先指责商家**
4. **只有在压力下才承认错误**

即使在“修复”问题后，商家仍报告：

> “升级 SDK 到 v1.7.4 后，**问题依然存在。**”

### 2024年升级：问题依旧 {#the-2024-escalation-still-broken}

来自保存的 PayPal 社区的最新报告显示问题实际上变得更糟。一个[2024年9月的讨论](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)（[存档](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)）记录了完全相同的问题：

> “问题大约在两周前开始出现，并非所有订单都会受影响。**更常见的问题似乎是捕获时出现404错误。**”

商家描述了 Forward Email 遇到的相同模式：

> “尝试捕获订单后，PayPal 返回404。检索订单详情时：{'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **但我们这边没有任何成功捕获的痕迹。**”

### Webhook 可靠性灾难 {#the-webhook-reliability-disaster}

另一条[保存的社区讨论](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446)揭示了 PayPal 的 webhook 系统根本不可靠：

> “理论上，应该有两个事件（CHECKOUT.ORDER.APPROVED 和 PAYMENT.CAPTURE.COMPLETED）来自 Webhook 事件。实际上，**这两个事件很少能立即收到，PAYMENT.CAPTURE.COMPLETED 大多数时候收不到，或者要几个小时后才收到。**”

对于订阅支付：

> “**‘PAYMENT.SALE.COMPLETED’ 有时收不到，或者要几个小时后才收到。**”

商家的提问揭示了 PayPal 可靠性问题的深度：

1. **“为什么会这样？”** - PayPal 的 webhook 系统根本就是坏的
2. **“如果订单状态是‘COMPLETED’，我是否可以认为我已经收到款项？”** - 商家无法信任 PayPal 的 API 响应
3. **“为什么‘事件日志->Webhook 事件’找不到任何日志？”** - 甚至 PayPal 自己的日志系统也不工作

### 系统性疏忽的模式 {#the-pattern-of-systematic-negligence}

证据跨越11年以上，显示出明确的模式：

* **2013年**：“PayPal 正在努力解决”
* **2016年**：PayPal 承认破坏性更改，提供了破损的修复
* **2024年**：完全相同的错误依然发生，影响 Forward Email 和无数其他用户

这不是一个简单的漏洞——**这是系统性疏忽。** PayPal 已经知道这些关键支付处理失败超过十年，并且一直：
1. **将PayPal的漏洞归咎于商家**
2. **进行了未记录的破坏性更改**
3. **提供了无效的修复方案**
4. **忽视了对企业的财务影响**
5. **通过关闭社区论坛隐藏证据**

### 未记录的要求 {#the-undocumented-requirement}

PayPal官方文档中从未提到商家必须为捕获操作实现重试逻辑。文档中只说明商家应“在批准后立即捕获”，但未提及其API会随机返回404错误，需复杂的重试机制。

这迫使每个商家必须：

* 实现指数退避重试逻辑
* 处理不一致的Webhook传递
* 构建复杂的状态管理系统
* 手动监控捕获失败

**其他所有支付处理商都提供可靠的捕获API，第一次调用即成功。**


## PayPal更广泛的欺骗模式 {#paypals-broader-pattern-of-deception}

捕获漏洞灾难只是PayPal系统性欺骗客户、掩盖失败的一个例子。

### 纽约金融服务部的行动 {#the-new-york-department-of-financial-services-action}

2025年1月，纽约金融服务部对PayPal发起了[执法行动](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf)，指控其欺骗行为，表明PayPal的欺骗模式远超其API。

该监管行动显示PayPal愿意在整个业务中采取欺骗手段，而不仅限于开发者工具。

### Honey诉讼案：重写联盟链接 {#the-honey-lawsuit-rewriting-affiliate-links}

PayPal收购Honey后，出现了[诉讼指控Honey重写联盟链接](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer)，窃取内容创作者和影响者的佣金。这是PayPal通过技术手段重定向本应属于他人的收入的另一种系统性欺骗。

模式清晰：

1. **API故障**：隐藏功能缺陷，归咎商家
2. **社区封锁**：删除问题证据
3. **监管违规**：实施欺骗行为
4. **联盟盗窃**：通过技术操控窃取佣金

### PayPal疏忽的代价 {#the-cost-of-paypals-negligence}

Forward Email损失的1,899美元只是冰山一角。更广泛的影响包括：

* **个体商家**：成千上万商家损失数百至数千美元
* **企业客户**：潜在数百万美元的收入损失
* **开发者时间**：无数小时用于绕过PayPal破损的API
* **客户信任**：因PayPal支付失败导致企业流失客户

如果一个小型邮件服务损失近2,000美元，而此问题已存在11年以上，影响数千商家，累计财务损失可能高达**数亿美元**。

### 文档谎言 {#the-documentation-lie}

PayPal官方文档始终未提及商家将遇到的关键限制和漏洞。例如：

* **捕获API**：未提及404错误常见且需重试逻辑
* **Webhook可靠性**：未提及Webhook常延迟数小时
* **订阅列表**：文档暗示可列出订阅，但无对应端点
* **会话超时**：未提及激进的60秒超时限制

这种系统性遗漏关键信息，迫使商家通过生产环境的反复试错发现PayPal的限制，常导致财务损失。


## 这对开发者意味着什么 {#what-this-means-for-developers}

PayPal系统性未能满足基本开发者需求，却收集大量反馈，显示其组织存在根本性问题。他们将收集反馈视为解决问题的替代方案。
模式很清晰：

1. 开发者报告问题  
2. PayPal 组织与高管的反馈会议  
3. 提供大量反馈  
4. 团队承认存在差距并承诺“跟踪和解决”  
5. 什么都没实施  
6. 高管跳槽到更好的公司  
7. 新团队再次征求相同的反馈  
8. 循环重复  

与此同时，开发者被迫构建变通方案，妥协安全性，并处理破损的用户界面，仅仅为了接受支付。

如果你正在构建支付系统，请从我们的经验中学习：构建你的[三管齐下方法](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal)，使用多个支付处理器，但不要指望 PayPal 提供你所需的基本功能。计划从第一天起就构建变通方案。

> 本文记录了我们在 Forward Email 使用 PayPal API 的 11 年经验。所有代码示例和链接均来自我们的实际生产系统。尽管存在这些问题，我们仍继续支持 PayPal 支付，因为部分客户别无选择。

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />
