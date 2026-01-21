# 电子邮件转发如何与转发电子邮件配合使用：终极指南 {#how-email-forwarding-works-with-forward-email-the-ultimate-guide}

<img loading="lazy" src="/img/articles/email-privacy.webp" alt="Email privacy protection technical implementation" class="rounded-lg" />

## 目录 {#table-of-contents}

* [前言](#foreword)
* [什么是电子邮件转发](#what-is-email-forwarding)
* [电子邮件转发的工作原理：技术解释](#how-email-forwarding-works-the-technical-explanation)
  * [电子邮件转发流程](#the-email-forwarding-process)
  * [SRS（发件人重写方案）的作用](#the-role-of-srs-sender-rewriting-scheme)
* [电子邮件转发的工作原理：简单解释](#how-email-forwarding-works-the-simple-explanation)
* [使用“转发电子邮件”设置电子邮件转发](#setting-up-email-forwarding-with-forward-email)
  * [1. 注册账户](#1-sign-up-for-an-account)
  * [2. 添加您的域名](#2-add-your-domain)
  * [3.配置DNS记录](#3-configure-dns-records)
  * [4. 创建电子邮件转发](#4-create-email-forwards)
  * [5.开始使用您的新电子邮件地址](#5-start-using-your-new-email-addresses)
* [转发电子邮件的高级功能](#advanced-features-of-forward-email)
  * [一次性地址](#disposable-addresses)
  * [多个收件人和通配符](#multiple-recipients-and-wildcards)
  * [“以…身份发送邮件”集成](#send-mail-as-integration)
  * [抗量子安全性](#quantum-resistant-security)
  * [单独加密的 SQLite 邮箱](#individually-encrypted-sqlite-mailboxes)
* [为什么选择转发电子邮件而不是竞争对手](#why-choose-forward-email-over-competitors)
  * [1. 100% 开源](#1-100-open-source)
  * [2. 注重隐私](#2-privacy-focused)
  * [3. 不依赖第三方](#3-no-third-party-reliance)
  * [4. 具有成本效益的定价](#4-cost-effective-pricing)
  * [5.无限资源](#5-unlimited-resources)
  * [6. 受到各大机构的信任](#6-trusted-by-major-organizations)
* [电子邮件转发的常见用例](#common-use-cases-for-email-forwarding)
  * [对于企业](#for-businesses)
  * [对于开发人员](#for-developers)
  * [对于注重隐私的个人](#for-privacy-conscious-individuals)
* [电子邮件转发的最佳实践](#best-practices-for-email-forwarding)
  * [1. 使用描述性地址](#1-use-descriptive-addresses)
  * [2. 实施适当的身份验证](#2-implement-proper-authentication)
  * [3.定期回顾你的转发](#3-regularly-review-your-forwards)
  * [4. 设置“以…身份发送邮件”以实现无缝回复](#4-set-up-send-mail-as-for-seamless-replies)
  * [5. 谨慎使用“全部接收”地址](#5-use-catch-all-addresses-cautiously)
* [结论](#conclusion)

## 前言 {#foreword}

电子邮件转发是一款强大的工具，可以彻底改变您管理在线通信的方式。无论您是想使用自定义域名创建专业电子邮件地址的企业主，还是注重隐私、希望保护主要电子邮件的个人，亦或是需要灵活电子邮件管理的开发人员，在当今的数字环境中，了解电子邮件转发都至关重要。

在 Forward Email，我们打造了全球最安全、最私密、最灵活的电子邮件转发服务。在本指南中，我们将从技术和实践两个角度讲解电子邮件转发的工作原理，引导您完成简单的设置流程，并重点介绍我们的服务为何在众多竞争对手中脱颖而出。

## 什么是电子邮件转发 {#what-is-email-forwarding}

电子邮件转发是指将发送到一个电子邮件地址的电子邮件自动重定向到另一个目标地址的过程。例如，当有人向 <contact@yourdomain.com> 发送电子邮件时，该邮件会自动转发到您的个人 Gmail、Outlook 或任何其他电子邮件帐户。

这个看似简单的功能却带来了强大的好处：

* **专业品牌打造**：使用带有自定义域名 (<you@yourdomain.com>) 的电子邮件地址，同时管理您现有个人收件箱中的所有内容
* **隐私保护**：创建一次性或专用地址，保护您的主要电子邮件地址
* **简化管理**：将多个电子邮件地址整合到一个收件箱中
* **灵活性**：无需管理多个帐户，即可为不同用途创建无限数量的地址

## 电子邮件转发的工作原理：技术解释 {#how-email-forwarding-works-the-technical-explanation}

对于那些对技术细节感兴趣的人，让我们来探索一下转发电子邮件时幕后发生的事情。

### 电子邮件转发流程 {#the-email-forwarding-process}

1. **DNS 配置**：此过程从您域名的 DNS 记录开始。设置电子邮件转发时，您需要配置 MX（邮件交换）记录，该记录会告知互联网您域名的邮件应递送到何处。这些记录指向我们的电子邮件服务器。

2. **电子邮件接收**：当有人向您的自定义域地址（例如，<you@yourdomain.com>）发送电子邮件时，他们的电子邮件服务器会查找您域的 MX 记录并将邮件发送到我们的服务器。

3. **处理和身份验证**：我们的服务器接收电子邮件并执行以下几个关键功能：
* 使用 SPF、DKIM 和 DMARC 等协议验证发件人的真实性
* 扫描恶意内容
* 根据您的转发规则检查收件人

4. **发件人重写**：这就是奇迹发生的地方。我们实施了发件人重写方案 (SRS) 来修改电子邮件的返回路径。这一点至关重要，因为许多电子邮件提供商会拒绝未正确实施 SRS 的转发邮件，因为它们可能看起来像是伪造的。

5. **转发**：电子邮件将完整地发送到您的目标地址。

6. **递送**：电子邮件到达您的收件箱，看起来就像是发送到您的转发地址一样，保持了您的自定义域的专业外观。

### SRS（发件人重写方案）的作用{#the-role-of-srs-sender-rewriting-scheme}

SRS 值得特别关注，因为它对于可靠的电子邮件转发至关重要。转发电子邮件时，需要重写发件人的地址，以确保电子邮件在最终目的地通过 SPF 检查。

如果没有 SRS，转发的邮件通常会无法通过 SPF 验证，从而被标记为垃圾邮件或被彻底拒绝。我们实施的 SRS 可确保您转发的邮件能够可靠地送达，同时以对您透明的方式保留原始发件人信息。

## 电子邮件转发的工作原理：简单解释 {#how-email-forwarding-works-the-simple-explanation}

如果技术细节看起来太多，这里有一个更简单的方法来理解电子邮件转发：

电子邮件转发就像实体邮件的转发一样。当您搬到新家时，您可以要求邮政服务将所有邮件从旧地址转发到新地址。电子邮件转发的工作原理类似，但针对的是数字邮件。

转发电子邮件：

1. 您告诉我们您想要在您的域名上设置哪些电子邮件地址（例如 <sales@yourdomain.com> 或 <contact@yourdomain.com>）
2. 您告诉我们您希望将这些电子邮件发送到哪里（例如您的 Gmail 或 Outlook 帐户）
3. 我们处理所有技术细节，以确保发送到您自定义地址的电子邮件安全到达您指定的收件箱

就这么简单！您无需更改现有的电子邮件工作流程，即可使用专业的电子邮件地址。

## 使用转发电子邮件设置电子邮件转发 {#setting-up-email-forwarding-with-forward-email}

“转发电子邮件”最大的优势之一就是设置简单。以下是分步指南：

### 1. 注册账户 {#1-sign-up-for-an-account}

访问 [forwardemail.net](https://forwardemail.net) 并创建免费帐户。我们的注册过程只需不到一分钟。

### 2. 添加您的域名 {#2-add-your-domain}

登录后，添加您想要用于电子邮件转发的域名。如果您还没有域名，则需要先从域名注册商处购买一个。

### 3. 配置 DNS 记录 {#3-configure-dns-records}

我们将为您提供需要添加到域名的准确 DNS 记录。通常，这包括：

* 添加指向我们电子邮件服务器的 MX 记录
* 添加用于验证和安全的 TXT 记录

大多数域名注册商都提供简洁的界面来添加这些记录。我们为所有主流域名注册商提供了详细的指南，以确保此过程尽可能顺畅。

### 4. 创建电子邮件转发 {#4-create-email-forwards}

验证 DNS 记录后（通常只需几分钟），您就可以创建电子邮件转发。只需指定：

* 您域名下的电子邮件地址（例如 <contact@yourdomain.com>）
* 您希望将电子邮件发送到的目的地（例如，您的个人 Gmail 地址）

### 5. 开始使用您的新电子邮件地址 {#5-start-using-your-new-email-addresses}

就是这样！发送到您自定义域名地址的邮件现在将被转发到您指定的目的地。您可以根据需要创建任意数量的转发地址，包括用于转发发送到您域名下任意地址的所有邮件的“全部接收”地址。

## 转发电子邮件的高级功能 {#advanced-features-of-forward-email}

虽然基本的电子邮件转发功能本身就很强大，但“转发电子邮件”还提供了多项让我们脱颖而出的高级功能：

### 一次性地址 {#disposable-addresses}

创建特定或匿名的电子邮件地址，转发至您的主账户。您可以为这些地址分配标签，并随时启用或禁用它们，让您的收件箱井井有条。您的真实电子邮件地址绝不会暴露。

### 多个收件人和通配符 {#multiple-recipients-and-wildcards}

将单个地址转发给多个收件人，轻松与团队共享信息。您还可以使用通配符地址（全包转发）接收发送到您域名下任意地址的邮件。

###“以…身份发送邮件”集成 {#send-mail-as-integration}

您无需离开收件箱即可从自定义域名发送电子邮件。您可以直接从 Gmail 或 Outlook 帐户发送和回复邮件，就像它们来自 <you@yourdomain.com> 一样。

### 抗量子安全性 {#quantum-resistant-security}

我们是世界上第一个也是唯一一个使用抗量子加密的电子邮件服务，可以保护您的通信免受未来最先进的威胁。

### 单独加密的 SQLite 邮箱 {#individually-encrypted-sqlite-mailboxes}

与将所有用户电子邮件存储在共享数据库中的其他提供商不同，我们使用单独加密的 SQLite 邮箱来实现无与伦比的隐私和安全性。

## 为什么选择转发电子邮件而不是竞争对手{#why-choose-forward-email-over-competitors}

电子邮件转发市场有多家参与者，但 Forward Email 在几个重要方面脱颖而出：

### 1. 100% 开源 {#1-100-open-source}

我们是唯一一家完全开源的电子邮件转发服务，包括我们的后端代码。这种透明性有助于建立信任，并允许进行独立的安全审计。其他服务可能声称是开源的，但却不发布其后端代码。

### 2. 注重隐私 {#2-privacy-focused}

我们创建这项服务是因为您享有隐私权。我们使用强大的 TLS 加密，不存储 SMTP 日志（错误和出站 SMTP 除外），也不会将您的电子邮件写入磁盘存储。

### 3. 不依赖第三方 {#3-no-third-party-reliance}

与依赖 Amazon SES 或其他第三方服务的竞争对手不同，我们完全控制我们的基础设施，从而增强可靠性和隐私性。

### 4. 经济实惠的定价 {#4-cost-effective-pricing}

我们的定价模式让您能够经济高效地扩展。我们不按用户收费，您可以按使用量付费。每月 3 美元，我们提供的功能比 Gandi（每月 3.99 美元）等竞争对手更低。

### 5. 无限资源 {#5-unlimited-resources}

我们不会像许多竞争对手那样对域名、别名或电子邮件地址施加人为限制。

### 6. 受到主要组织的信任 {#6-trusted-by-major-organizations}

我们的服务被超过 500,000 个域名使用，其中包括 [美国海军学院](/blog/docs/federal-government-email-service-section-889-compliant)、Netflix、[Linux基金会](/blog/docs/linux-foundation-email-enterprise-case-study)、[Canonical/Ubuntu](/blog/docs/canonical-ubuntu-email-enterprise-case-study)、Disney Ad Sales 等知名组织。

## 电子邮件转发的常见用例 {#common-use-cases-for-email-forwarding}

电子邮件转发解决了不同类型的用户的众多挑战：

### 适用于企业 {#for-businesses}

* 为不同部门创建专业的电子邮件地址（sales@、support@、info@）
* 轻松管理团队电子邮件沟通
* 在所有沟通中保持品牌一致性
* 简化人员变动期间的电子邮件管理

### 面向开发者 {#for-developers}

* 设置自动通知系统
* 为不同项目创建专用地址
* 集成 Webhook 实现高级自动化
* 利用我们的 API 进行自定义实施

### 适用于注重隐私的个人 {#for-privacy-conscious-individuals}

* 为不同的服务创建单独的电子邮件地址，以追踪谁分享了您的信息
* 使用一次性地址进行一次性注册
* 通过屏蔽您的主要电子邮件地址来保护隐私
* 轻松禁用开始接收垃圾邮件的地址

## 电子邮件转发的最佳实践 {#best-practices-for-email-forwarding}

为了充分利用电子邮件转发功能，请考虑以下最佳做法：

### 1. 使用描述性地址 {#1-use-descriptive-addresses}

创建明确表明其用途的电子邮件地址（例如，<newsletter@yourdomain.com>，<shopping@yourdomain.com>）以帮助整理您的收到的邮件。

### 2. 实施适当的身份验证 {#2-implement-proper-authentication}

确保您的域名拥有正确的 SPF、DKIM 和 DMARC 记录，以最大程度地提高邮件送达率。Forward Email 的设置指南可让您轻松完成此操作。

### 3. 定期查看您的转发 {#3-regularly-review-your-forwards}

定期审核您的电子邮件转发，以禁用不再需要或接收过多垃圾邮件的转发。

### 4. 设置“以…身份发送邮件”以实现无缝回复{#4-set-up-send-mail-as-for-seamless-replies}

配置您的主电子邮件客户端以作为您的自定义域地址发送邮件，以便在回复转发的电子邮件时获得一致的体验。

### 5. 谨慎使用 Catch-All 地址 {#5-use-catch-all-addresses-cautiously}

虽然“全部接收”地址很方便，但它们可能会收到更多垃圾邮件。请考虑为重要邮件创建专门的转发地址。

## 结论 {#conclusion}

电子邮件转发是一款功能强大的工具，可为您的电子邮件通信带来专业性、私密性和便捷性。使用 Forward Email，您将获得最安全、最私密、最灵活的电子邮件转发服务。

作为唯一一家拥有抗量子加密技术并注重隐私的 100% 开源提供商，我们构建了一项在提供卓越功能的同时尊重您的权利的服务。

无论您是想为您的企业创建专业的电子邮件地址，使用一次性地址保护您的隐私，还是简化多个电子邮件帐户的管理，Forward Email 都能提供完美的解决方案。

准备好改变您的电子邮件体验了吗？立即 [免费注册](https://forwardemail.net)，加入已从我们的服务中受益的 500,000 多个域名。

---

*这篇博文由 Forward Email 团队撰写，该团队打造了全球最安全、最私密、最灵活的电子邮件转发服务。访问 [forwardemail.net](https://forwardemail.net) 了解更多关于我们服务的信息，并开始安心地转发电子邮件。*