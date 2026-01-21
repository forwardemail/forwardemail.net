# 十年影响：我们的 npm 软件包如何达到 10 亿次下载量并塑造 JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />

## 目录 {#table-of-contents}

* [前言](#foreword)
* [信任我们的先驱者：Isaac Z. Schlueter 和 Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [从 npm 的创立到 Node.js 的领导地位](#from-npms-creation-to-nodejs-leadership)
* [代码背后的建筑师：尼克·鲍夫的旅程](#the-architect-behind-the-code-nick-baughs-journey)
  * [Express 技术委员会和核心贡献](#express-technical-committee-and-core-contributions)
  * [Koa 框架贡献](#koa-framework-contributions)
  * [从个人贡献者到组织领导者](#from-individual-contributor-to-organization-leader)
* [我们的 GitHub 组织：创新生态系统](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin：适用于现代应用程序的结构化日志记录](#cabin-structured-logging-for-modern-applications)
  * [垃圾邮件扫描程序：打击电子邮件滥用](#spam-scanner-fighting-email-abuse)
  * [Bree：使用工作线程进行现代作业调度](#bree-modern-job-scheduling-with-worker-threads)
  * [转发电子邮件：开源电子邮件基础设施](#forward-email-open-source-email-infrastructure)
  * [Lad：Koa 实用工具](#lad-essential-koa-utilities-and-tools)
  * [Upptime：开源正常运行时间监控](#upptime-open-source-uptime-monitoring)
* [我们对转发电子邮件生态系统的贡献](#our-contributions-to-the-forward-email-ecosystem)
  * [从包装到生产](#from-packages-to-production)
  * [反馈回路](#the-feedback-loop)
* [Forward Email 的核心原则：卓越的基础](#forward-emails-core-principles-a-foundation-for-excellence)
  * [始终对开发人员友好、注重安全且透明](#always-developer-friendly-security-focused-and-transparent)
  * [遵循经过时间考验的软件开发原则](#adherence-to-time-tested-software-development-principles)
  * [针对精力充沛、自力更生的开发人员](#targeting-the-scrappy-bootstrapped-developer)
  * [实践原则：转发电子邮件代码库](#principles-in-practice-the-forward-email-codebase)
  * [设计隐私](#privacy-by-design)
  * [可持续开源](#sustainable-open-source)
* [数字不会说谎：我们惊人的 npm 下载统计数据](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [鸟瞰我们的影响](#a-birds-eye-view-of-our-impact)
  * [每日规模影响](#daily-impact-at-scale)
  * [超越原始数据](#beyond-the-raw-numbers)
* [支持生态系统：我们的开源赞助](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman：电子邮件基础设施先驱](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus：实用程序包策划者](#sindre-sorhus-utility-package-mastermind)
* [揭示 JavaScript 生态系统中的安全漏洞](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Koa-Router 救援](#the-koa-router-rescue)
  * [解决 ReDoS 漏洞](#addressing-redos-vulnerabilities)
  * [倡导 Node.js 和 Chromium 安全](#advocating-for-nodejs-and-chromium-security)
  * [保护 npm 基础设施](#securing-npm-infrastructure)
* [我们对转发电子邮件生态系统的贡献](#our-contributions-to-the-forward-email-ecosystem-1)
  * [增强 Nodemailer 的核心功能](#enhancing-nodemailers-core-functionality)
  * [使用 Mailauth 推进电子邮件身份验证](#advancing-email-authentication-with-mailauth)
  * [关键正常运行时间增强功能](#key-upptime-enhancements)
* [将一切凝聚在一起的粘合剂：大规模自定义代码](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [巨大的开发努力](#a-massive-development-effort)
  * [核心依赖项集成](#core-dependencies-integration)
  * [使用 Tangerine 和 mx-connect 的 DNS 基础设施](#dns-infrastructure-with-tangerine-and-mx-connect)
* [企业影响：从开源到关键任务解决方案](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [关键任务电子邮件基础设施案例研究](#case-studies-in-mission-critical-email-infrastructure)
* [开源十年：展望未来](#a-decade-of-open-source-looking-forward)

## 前言 {#foreword}

在 [JavaScript](https://en.wikipedia.org/wiki/JavaScript) 和 [Node.js](https://en.wikipedia.org/wiki/Node.js) 的世界里，有些软件包至关重要——每天下载量达数百万次，为世界各地的应用程序提供支持。这些工具的背后是专注于开源质量的开发者。今天，我们将展示我们的团队如何帮助构建和维护 npm 软件包，这些软件包已成为 JavaScript 生态系统的重要组成部分。

## 信任我们的先驱：Isaac Z. Schlueter 和转发电子邮件 {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

我们很荣幸拥有 [艾萨克·Z·施吕特](https://izs.me/)（[GitHub：isaacs](https://github.com/isaacs)）这样的用户。Isaac 创建了 [npm](https://en.wikipedia.org/wiki/Npm_\(software\)，并帮助构建了 [Node.js](https://en.wikipedia.org/wiki/Node.js)。他对 Forward Email 的信任体现了我们对质量和安全的重视。Isaac 使用 Forward Email 服务于多个域名，包括 izs.me。

Isaac 对 JavaScript 的影响是巨大的。2009 年，他与 Node.js 平台的创建者 [瑞安·达尔](https://en.wikipedia.org/wiki/Ryan_Dahl) 合作，成为首批发现 Node.js 潜力的人之一。正如 Isaac 在一篇 [接受《Increment》杂志采访](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/) 文章中所说：“当时，只有一小部分人试图探索如何实现服务器端 JS，Ryan Dahl 提出了 Node，这显然是正确的方法。我全力投入其中，并在 2009 年中期积极参与其中。”

> \[!NOTE]
> 对于那些对 Node.js 历史感兴趣的人，有一些优秀的纪录片记录了它的发展历程，包括 [Node.js 的故事](https://www.youtube.com/watch?v=LB8KwiiUGy0) 和 [我对 Node.js 感到遗憾的 10 件事 - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I)。Ryan Dahl 的 [个人网站](https://tinyclouds.org/) 也包含了一些关于他工作的宝贵见解。

### 从 npm 的创建到 Node.js 的领导地位 {#from-npms-creation-to-nodejs-leadership}

Isaac 于 2009 年 9 月创建了 npm，并于 2010 年初发布了第一个可用版本。这个包管理器满足了 Node.js 的一个关键需求，让开发者能够轻松地共享和重用代码。根据 [Node.js 维基百科页面](https://en.wikipedia.org/wiki/Node.js) 的描述，“2010 年 1 月，一个名为 npm 的包管理器被引入到 Node.js 环境中。该包管理器允许程序员发布和共享 Node.js 包及其附带的源代码，旨在简化包的安装、更新和卸载。”

2012 年 1 月，Ryan Dahl 退出 Node.js 项目后，Isaac 接任项目负责人。正如 [他的总结](https://izs.me/resume) 上所述，他“领导了多个 Node.js 核心 API 的开发，包括 CommonJS 模块系统、文件系统 API 和流”，并且“担任该项目的终身仁慈独裁者 (BDFL) 两年，确保 Node.js v0.6 到 v0.10 版本的质量不断提升，构建流程也更加可靠”。

Isaac 带领 Node.js 度过了一个关键的成长期，并制定了至今仍影响着该平台的标准。后来，他于 2014 年创立了 npm, Inc.，以支持他之前独自运营的 npm 注册表。

我们感谢 Isaac 对 JavaScript 的巨大贡献，并将继续使用他创建的众多软件包。他的工作改变了我们构建软件的方式，也改变了全球数百万开发者共享代码的方式。

## 代码背后的架构师：Nick Baugh 的旅程 {#the-architect-behind-the-code-nick-baughs-journey}

我们开源成功的核心是 Forward Email 的创始人兼所有者 Nick Baugh。他在 JavaScript 领域耕耘近 20 年，影响了无数开发者的应用构建方式。他的开源之旅展现了其精湛的技术实力和社区领导力。

### Express 技术委员会和核心贡献 {#express-technical-committee-and-core-contributions}

Nick 凭借其在 Web 框架方面的专业知识，在 [快递技术委员会](https://expressjs.com/en/resources/community.html) 中赢得了一席之地，并在那里帮助开发了最常用的 Node.js 框架之一。Nick 目前在 [Express 社区页面](https://expressjs.com/en/resources/community.html) 中被列为非活跃成员。

> \[!IMPORTANT]
> Express 最初由 TJ Holowaychuk 创建，他是一位多产的开源贡献者，塑造了 Node.js 生态系统的大部分内容。我们感谢 TJ 的奠基性工作，并对他广泛的开源贡献表示敬意。[决定休息一下](https://news.ycombinator.com/item?id=37687017)

作为 [快递技术委员会](https://expressjs.com/en/resources/community.html) 的成员，Nick 在澄清 `req.originalUrl` 文档和修复多部分表单处理问题等问题上表现出了极大的细节关注。

### Koa 框架贡献 {#koa-framework-contributions}

Nick 开发的 [Koa 框架](https://github.com/koajs/koa)（一款现代、轻量级的 Express 替代方案，同样由 TJ Holowaychuk 创建）进一步展现了他致力于改进 Web 开发工具的决心。他对 Koa 的贡献包括通过拉取请求提交问题和代码，解决了错误处理、内容类型管理和文档改进等问题。

他在 Express 和 Koa 方面的工作使他对 Node.js Web 开发有了独特的见解，帮助我们的团队创建了可与多个框架生态系统良好配合的软件包。

### 从个人贡献者到组织领导者 {#from-individual-contributor-to-organization-leader}

Nick 最初只是帮助现有项目，后来逐渐发展到创建和维护整个软件包生态系统。他创建了多个 GitHub 组织，包括 [舱](https://github.com/cabinjs)、[垃圾邮件扫描程序](https://github.com/spamscanner)、[转发电子邮件](https://github.com/forwardemail)、[小伙子](https://github.com/ladjs) 和 [布里](https://github.com/breejs)，每个组织都致力于解决 JavaScript 社区的特定需求。

从贡献者到领导者的转变，展现了 Nick 致力于开发能够解决实际问题的精心设计的软件的愿景。通过将相关的软件包组织到专注的 GitHub 组织下，他构建了能够协同工作的工具生态系统，同时保持了模块化和灵活性，从而服务于更广泛的开发者社区。

## 我们的 GitHub 组织：创新生态系统 {#our-github-organizations-ecosystems-of-innovation}

我们围绕专注的 GitHub 组织来组织开源工作，每个组织都致力于解决 JavaScript 中的特定需求。这种结构创建了紧密结合的软件包系列，它们在保持模块化的同时能够良好地协同工作。

### 小屋：现代应用程序的结构化日志记录 {#cabin-structured-logging-for-modern-applications}

[客舱组织](https://github.com/cabinjs) 是我们打造的简洁而强大的应用日志记录工具。[`cabin`](https://github.com/cabinjs/cabin) 主软件包拥有近 900 个 GitHub 星标和超过 10 万次的每周下载量[^1]。Cabin 提供结构化日志记录，可与 Sentry、LogDNA 和 Papertrail 等热门服务兼容。

Cabin 的独特之处在于其周到的 API 和插件系统。诸如用于 Express 中间件的 [`axe`](https://github.com/cabinjs/axe) 和用于 HTTP 请求解析的 [`parse-request`](https://github.com/cabinjs/parse-request) 等支持包，体现了我们致力于打造完整解决方案而非孤立工具的决心。

[`bson-objectid`](https://github.com/cabinjs/bson-objectid) 软件包值得特别一提，短短两个月内下载量就超过 170 万次[^2]。对于需要 ID 且无需完全依赖 MongoDB 的开发者来说，这个轻量级的 MongoDB ObjectID 实现已经成为他们的首选。

### 垃圾邮件扫描程序：打击电子邮件滥用 {#spam-scanner-fighting-email-abuse}

[垃圾邮件扫描程序组织](https://github.com/spamscanner) 体现了我们致力于解决实际问题的决心。主要的 [`spamscanner`](https://github.com/spamscanner/spamscanner) 软件包提供了高级垃圾邮件检测功能，但 [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) 软件包的采用率令人瞩目。

`url-regex-safe` 在两个月内下载量超过 120 万次[^3]，它修复了其他 URL 检测正则表达式中的关键安全问题。该软件包展示了我们的开源理念：发现常见问题（在本例中为 URL 验证中的 [重做](https://en.wikipedia.org/wiki/ReDoS) 漏洞），创建可靠的解决方案，并精心维护。

### Bree：使用工作线程的现代作业调度{#bree-modern-job-scheduling-with-worker-threads}

[布里组织](https://github.com/breejs) 是我们针对 Node.js 常见挑战的答案：可靠的作业调度。主软件包 [`bree`](https://github.com/breejs/bree) 拥有超过 3,100 个 GitHub 星标，它提供了一个使用 Node.js 工作线程的现代作业调度程序，以实现更高的性能和可靠性。

> \[!NOTE]
> Bree 是在我们帮助维护 [议程](https://github.com/agenda/agenda) 之后创建的，我们运用经验教训构建了一个更好的作业调度程序。我们在议程上的贡献帮助我们找到了改进作业调度的方法。

Bree 与 Agenda 等其他调度程序有何不同：

* **无外部依赖**：与需要 MongoDB 的 Agenda 不同，Bree 不需要 Redis 或 MongoDB 来管理作业状态。
* **工作线程**：Bree 使用 Node.js 工作线程进行沙盒进程，从而提供更好的隔离和性能。
* **简单的 API**：Bree 提供简单的详细控制，使其更容易实现复杂的调度需求。
* **内置支持**：默认包含优雅重新加载、cron 作业、日期和人性化时间等功能。

Bree 是 [forwardemail.net](https://github.com/forwardemail/forwardemail.net) 的重要组成部分，负责处理电子邮件处理、清理和定期维护等关键后台任务。在 Forward Email 中使用 Bree 体现了我们致力于在生产环境中使用自主研发的工具，确保其符合高可靠性标准。

我们也使用并欣赏其他优秀的工作线程包，例如 [水池](https://github.com/piscinajs/piscina) 和 HTTP 客户端，例如 [十一](https://github.com/nodejs/undici)。Piscina 和 Bree 一样，也使用 Node.js 工作线程来高效处理任务。我们感谢 [马修·希尔](https://github.com/mcollina)（他同时维护 undici 和 piscina）对 Node.js 的重大贡献。Matteo 是 Node.js 技术指导委员会的成员，他极大地提升了 Node.js 的 HTTP 客户端功能。

### 转发电子邮件：开源电子邮件基础设施 {#forward-email-open-source-email-infrastructure}

我们最雄心勃勃的项目是 [转发电子邮件](https://github.com/forwardemail)，这是一个开源电子邮件服务，提供电子邮件转发、存储和 API 服务。其主代码库已获得超过 1,100 个 GitHub 星标 [^4]，彰显了社区对这款专有电子邮件服务替代方案的赞赏。

该组织开发的 [`preview-email`](https://github.com/forwardemail/preview-email) 软件包在两个月内下载量超过 250 万次[^5]，已成为使用电子邮件模板的开发者的必备工具。它提供了一种在开发过程中预览电子邮件的简便方法，解决了构建电子邮件应用程序时的一个常见痛点。

### Lad：必备 Koa 实用程序和工具 {#lad-essential-koa-utilities-and-tools}

[青年组织](https://github.com/ladjs) 提供了一系列实用工具，主要致力于增强 Koa 框架生态系统。这些软件包解决了 Web 开发中的常见挑战，旨在无缝协作，同时又能独立使用。

#### koa-better-error-handler：改进了 Koa 的错误处理 {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) 为 Koa 应用程序提供了更完善的错误处理方案。该软件包拥有超过 50 个 GitHub 星标，它使 `ctx.throw` 能够生成用户友好的错误消息，同时解决了 Koa 内置错误处理器的若干限制：

* 检测并正确处理 Node.js DNS 错误、Mongoose 错误和 Redis 错误
* 使用 [繁荣](https://github.com/hapijs/boom) 创建一致且格式良好的错误响应
* 保留标头（与 Koa 的内置处理程序不同）
* 维护适当的状态码，而不是默认为 500
* 支持 Flash 消息和会话保留
* 为验证错误提供 HTML 错误列表
* 支持多种响应类型（HTML、JSON 和纯文本）

当与 [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) 一起使用以对 Koa 应用程序中的全面错误管理时，此包特别有价值。

#### 护照：对 Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) 扩展了流行的 Passport.js 身份验证中间件，并针对现代 Web 应用程序进行了特定的增强。此软件包支持多种开箱即用的身份验证策略：

* 使用电子邮件进行本地身份验证
* 使用 Apple 登录
* GitHub 身份验证
* Google 身份验证
* 一次性密码 (OTP) 身份验证

该软件包高度可定制，允许开发人员根据其应用程序的需求调整字段名称和短语。它旨在与 Mongoose 无缝集成以进行用户管理，使其成为需要强大身份验证的基于 Koa 的应用程序的理想解决方案。

#### 优雅：优雅关闭应用程序 {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) 解决了优雅关闭 Node.js 应用程序的关键挑战。该软件包拥有超过 70 个 GitHub 星标，可确保您的应用程序能够干净地终止，而不会丢失数据或导致连接挂起。主要功能包括：

* 支持优雅关闭 HTTP 服务器（Express/Koa/Fastify）
* 干净地关闭数据库连接（MongoDB/Mongoose）
* 正确关闭 Redis 客户端
* 处理 Bree 作业调度程序
* 支持自定义关闭处理程序
* 可配置的超时设置
* 与日志系统集成

此软件包对于生产环境的应用程序至关重要，因为意外关机可能会导致数据丢失或损坏。`@ladjs/graceful` 通过实施适当的关机程序，有助于确保应用程序的可靠性和稳定性。

### Upptime：开源正常运行时间监控 {#upptime-open-source-uptime-monitoring}

[Upptime 组织](https://github.com/upptime) 代表了我们对透明开源监控的承诺。[`upptime`](https://github.com/upptime/upptime) 主仓库拥有超过 13,000 个 GitHub 星标，使其成为我们贡献的最受欢迎的项目之一。Upptime 提供了一个由 GitHub 驱动的正常运行时间监控器和状态页面，完全无需服务器即可运行。

我们使用 Upptime 制作我们自己的状态页面，网址为 <https://status.forwardemail.net>，源代码可在 <https://github.com/forwardemail/status.forwardemail.net>.

Upptime 的独特之处在于其架构：

* **100% 开源**：每个组件都完全开源且可定制。
* **由 GitHub 提供支持**：利用 GitHub Actions、Issues 和 Pages 实现无服务器监控解决方案。
* **无需服务器**：与传统监控工具不同，Upptime 不需要您运行或维护服务器。
* **自动生成状态页面**：生成可托管在 GitHub Pages 上的精美状态页面。
* **强大的通知功能**：集成各种通知渠道，包括电子邮件、短信和 Slack。

为了提升用户体验，我们将 [@octokit/核心](https://github.com/octokit/core.js/) 集成到 forwardemail.net 代码库中，以便直接在我们的网站上呈现实时状态更新和事件。此集成通过即时 Toast 通知、徽章图标更改、警告颜色等功能，为用户提供清晰透明的信息，以应对我们整个堆栈（网站、API、MongoDB、Redis、SQLite、SMTP、POP3、IMAP、Bree 等）出现任何问题。

@octokit/core 库使我们能够从 Upptime GitHub 代码库中获取实时数据，对其进行处理，并以用户友好的方式显示。当任何服务出现中断或性能下降时，用户无需离开主应用程序即可通过可视化指示器立即收到通知。这种无缝集成确保用户始终掌握最新的系统状态信息，从而增强透明度和信任度。

数百家组织已采用 Upptime，寻求一种透明可靠的方式监控其服务并向用户传达状态。该项目的成功展现了构建利用现有基础设施（在本例中为 GitHub）的工具的强大力量，能够以新的方式解决常见问题。

## 我们对转发电子邮件生态系统的贡献 {#our-contributions-to-the-forward-email-ecosystem}

我们的开源软件包不仅被世界各地的开发者使用，也构成了我们自己的“转发电子邮件”服务的基础。我们既是这些工具的创造者，又是其使用者，这种双重角色赋予了我们独特的视角来看待这些工具的实际应用，并推动着我们持续改进。

### 从软件包到生产环境 {#from-packages-to-production}

从单个软件包到集成生产系统，整个过程需要精心集成和扩展。对于 Forward Email 而言，这个过程包括：

* **自定义扩展**：为我们的开源软件包构建 Forward Email 专用扩展，以满足我们的独特需求。
* **集成模式**：开发这些软件包在生产环境中交互的模式。
* **性能优化**：识别并解决仅在规模化时出现的性能瓶颈。
* **安全强化**：添加专门用于电子邮件处理和用户数据保护的额外安全层。

这项工作代表了核心软件包本身之外的数千小时的开发，最终形成了一个强大、安全的电子邮件服务，充分利用了我们最好的开源贡献。

### 反馈循环 {#the-feedback-loop}

在生产环境中使用我们自己的软件包最有价值的地方或许在于它所创建的反馈循环。当我们在 Forward Email 中遇到限制或边缘情况时，我们不会只是在本地进行修补，而是会改进底层软件包，从而让我们的服务和更广泛的社区都受益。

这种方法带来了许多改进：

* **Bree 的优雅关机**：Forward Email 对零停机部署的需求促使 Bree 增强了优雅关机功能。
* **垃圾邮件扫描程序的模式识别**：Forward Email 中遇到的实际垃圾邮件模式已为垃圾邮件扫描程序的检测算法提供了参考。
* **Cabin 的性能优化**：生产环境中的大量日志记录揭示了 Cabin 中的优化机会，这将使所有用户受益。

通过维持我们的开源工作和生产服务之间的良性循环，我们确保我们的软件包仍然是实用的、经过实战检验的解决方案，而不是理论上的实现。

## 转发电子邮件的核心原则：卓越的基础 {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email 的设计遵循一系列核心原则，这些原则指导着我们所有的开发决策。这些原则在我们的 [网站](/blog/docs/best-quantum-safe-encrypted-email-service#principles) 中进行了详细说明，旨在确保我们的服务始终方便开发者、安全可靠，并注重用户隐私。

### 始终对开发者友好、注重安全且透明 {#always-developer-friendly-security-focused-and-transparent}

我们的首要原则是打造对开发者友好的软件，同时保持最高的安全性和隐私标准。我们坚信，卓越的技术不应以牺牲可用性为代价，而透明度能够赢得社区的信任。

这一原则体现在我们详尽的文档、清晰的错误提示以及对成功和挑战的开放沟通中。通过将整个代码库开源，我们欢迎审查与协作，从而增强我们的软件和更广泛的生态系统。

### 遵守经过时间考验的软件开发原则 {#adherence-to-time-tested-software-development-principles}

我们遵循几项成熟的软件开发原则，这些原则的价值已在数十年中得到证实：

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**：通过模型-视图-控制器模式分离关注点
* **[Unix 哲学](https://en.wikipedia.org/wiki/Unix_philosophy)**：创建专注于单一功能的模块化组件
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**：保持简洁明了
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**：避免重复，促进代码复用
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**：无需重复，避免过早优化
* **[十二因素](https://12factor.net/)**：遵循构建现代可扩展应用程序的最佳实践
* **[奥卡姆剃刀](https://en.wikipedia.org/wiki/Occam%27s_razor)**：选择满足需求的最简单解决方案
* **[内部测试](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**：广泛使用我们自己的产品

这些原则不仅仅是理论概念，它们根植于我们的日常开发实践中。例如，我们对 Unix 哲学的坚持体现在 npm 包的构建方式上：小型、专注的模块，可以组合在一起解决复杂问题。

### 针对精力充沛、自力更生的开发人员 {#targeting-the-scrappy-bootstrapped-developer}

我们专门针对那些精力充沛、自力更生且“临时占位符”的开发者。这种关注点贯穿了我们的方方面面，从定价模式到技术决策。我们深知在资源有限的情况下构建产品的挑战，因为我们自己也经历过。

这一原则在我们对待开源的方式中尤为重要。我们创建并维护一些软件包，为没有企业预算的开发者解决实际问题，让每个人都能使用强大的工具，无论他们的资源如何。

### 实践原则：转发电子邮件代码库 {#principles-in-practice-the-forward-email-codebase}

这些原则在 Forward Email 的代码库中清晰可见。我们的 package.json 文件展示了我们精心挑选的依赖项，每个依赖项都与我们的核心价值观相符：

* 专注于安全的软件包，例如用于电子邮件身份验证的 `mailauth`
* 开发者友好型工具，例如 `preview-email`，方便调试
* 模块化组件，例如 Sindre Sorhus 提供的各种 `p-*` 实用程序

通过长期始终如一地遵循这些原则，我们构建了一项开发人员可以信赖的电子邮件基础设施服务——安全、可靠且符合开源社区的价值观。

### 隐私设计 {#privacy-by-design}

对于 Forward Email 来说，隐私并不是事后才想到的或营销功能——它是贯穿我们服务和代码各个方面的基本设计原则：

* **零访问加密**：我们实施的系统从技术上来说无法读取用户的电子邮件。
* **最少数据收集**：我们只收集提供服务所需的数据，仅此而已。
* **透明政策**：我们的隐私政策以清晰易懂的语言编写，不含任何法律术语。
* **开源验证**：我们的开源代码库允许安全研究人员验证我们的隐私声明。

这一承诺延伸到我们的开源软件包，这些软件包从一开始就采用了内置的安全和隐私最佳实践。

### 可持续开源 {#sustainable-open-source}

我们相信，开源软件需要可持续的模式才能长期蓬勃发展。我们的方法包括：

* **商业支持**：围绕我们的开源工具提供优质的支持和服务。
* **平衡许可**：使用既能保护用户自由又能保障项目可持续性的许可。
* **社区参与**：积极与贡献者互动，构建一个互助的社区。
* **透明路线图**：分享我们的开发计划，以便用户进行相应的规划。

通过关注可持续性，我们确保我们的开源贡献能够随着时间的推移不断增长和改进，而不是被忽视。

## 数字不会说谎：我们惊人的 npm 下载统计数据 {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

当我们谈论开源软件的影响力时，下载量统计数据能够切实衡量其采用率和信任度。我们参与维护的许多软件包已经达到了少数开源项目难以企及的规模，总下载量已达数十亿次。

![下载量最高的 npm 软件包](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> 虽然我们很荣幸能够维护 JavaScript 生态系统中几个下载量很高的软件包，但我们也要承认，其中许多软件包最初是由其他才华横溢的开发者创建的。像 superagent 和 supertest 这样的软件包最初是由 TJ Holowaychuk 创建的，他对开源的丰富贡献对塑造 Node.js 生态系统起到了至关重要的作用。

### 我们的影响鸟瞰图 {#a-birds-eye-view-of-our-impact}

仅在 2025 年 2 月至 3 月的两个月时间里，我们贡献并帮助维护的顶级软件包就创下了惊人的下载量：

* **[超级特工](https://www.npmjs.com/package/superagent)**：84,575,829 次下载\[^7]（最初由 TJ Holowaychuk 创建）
* **[超级测试](https://www.npmjs.com/package/supertest)**：76,432,591 次下载\[^8]（最初由 TJ Holowaychuk 创建）
* **[还](https://www.npmjs.com/package/koa)**：28,539,295 次下载\[^34]（最初由 TJ Holowaychuk 创建）
* **[@koa/路由器](https://www.npmjs.com/package/@koa/router)**：11,007,327 次下载\[^35]
* **[koa-路由器](https://www.npmjs.com/package/koa-router)**：3,498,918 次下载\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**：2,819,520下载次数\[^37]
* **[预览电子邮件](https://www.npmjs.com/package/preview-email)**: 2,500,000 次下载\[^9]
* **[舱](https://www.npmjs.com/package/cabin)**: 1,800,000 次下载\[^10]
* **[@breejs/稍后](https://www.npmjs.com/package/@breejs/later)**: 1,709,938 次下载\[^38]
* **[电子邮件模板](https://www.npmjs.com/package/email-templates)**: 1,128,139 次下载\[^39]
* **__PROTECTED_LINK_259__0**: 1,124,686 次下载\[^40]
* **__PROTECTED_LINK_259__1**: 1,200,000 次下载\[^11]
* **__PROTECTED_LINK_259__2**: 894,666下载量\[^41]
* **__PROTECTED_LINK_259__3**: 839,585 次下载\[^42]
* **__PROTECTED_LINK_259__4**: 145,000 次下载\[^12]
* **__PROTECTED_LINK_259__5**: 24,270 次下载\[^30]

> \[!NOTE]
> 我们参与维护但未参与创建的其他几个软件包的下载量甚至更高，包括 `form-data`（下载量超过 7.38 亿次）、`toidentifier`（下载量超过 3.09 亿次）、`stackframe`（下载量超过 1.16 亿次）和 `error-stack-parser`（下载量超过 1.13 亿次）。我们很荣幸能够为这些软件包做出贡献，同时尊重其原作者的劳动成果。

这些不仅仅是令人印象深刻的数字——它们代表着真正的开发者正在用我们参与维护的代码解决实际问题。每一次下载都表明这些软件包帮助人们构建了有意义的项目，从业余爱好者的项目到数百万人使用的企业应用程序。

![套餐类别分布](/img/art/category_pie_chart.svg)

### 每日规模影响 {#daily-impact-at-scale}

每日下载模式显示出持续的高使用量，峰值甚至达到每日数百万次[^13]。这种一致性证明了这些软件包的稳定性和可靠性——开发人员不仅仅是试用它们；他们将它们集成到核心工作流程中，并日复一日地依赖它们。

每周下载量的数据更是令人印象深刻，每周下载量始终徘徊在数千万次左右[^14]。这代表着 JavaScript 生态系统的巨大影响力，这些软件包在全球各地的生产环境中运行。

### 超越原始数字 {#beyond-the-raw-numbers}

虽然下载量本身就令人印象深刻，但它们更深刻地体现了社区对这些软件包的信任。维护如此规模的软件包需要坚定不移地致力于：

* **向后兼容性**：必须谨慎考虑更改，以免破坏现有实现。
* **安全性**：数百万个应用程序依赖于这些软件包，安全漏洞可能会造成深远的影响。
* **性能**：在这种规模下，即使是微小的性能改进也能带来显著的总体效益。
* **文档**：对于所有经验水平的开发人员使用的软件包来说，清晰、全面的文档都至关重要。

下载量随时间持续增长反映了我们成功履行了这些承诺，并通过可靠、维护良好的软件包与开发者社区建立了信任。

## 支持生态系统：我们的开源赞助 {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> 开源可持续性不仅仅在于贡献代码，还在于支持维护关键基础设施的开发人员。

除了对 JavaScript 生态系统的直接贡献外，我们还很荣幸地赞助了众多杰出的 Node.js 贡献者，他们的工作构成了众多现代应用程序的基础。我们的赞助项目包括：

### Andris Reinman：电子邮件基础设施先驱 {#andris-reinman-email-infrastructure-pioneer}

[安德里斯·雷因曼](https://github.com/andris9) 是 [Nodemailer](https://github.com/nodemailer/nodemailer) 的创建者。__PROTECTED_LINK_276__ 是 Node.js 最受欢迎的电子邮件发送库，每周下载量超过 1400 万次[^15]。他的工作成果还延伸到其他关键的电子邮件基础设施组件，例如 [SMTP 服务器](https://github.com/nodemailer/smtp-server)、[邮件解析器](https://github.com/nodemailer/mailparser) 和 [野鸭](https://github.com/nodemailer/wildduck)。

我们的赞助有助于确保这些重要工具的持续维护和开发，这些工具为无数 Node.js 应用程序（包括我们自己的转发电子邮件服务）提供电子邮件通信支持。

### Sindre Sorhus：实用程序包策划者 {#sindre-sorhus-utility-package-mastermind}

[辛德雷·索胡斯](https://github.com/sindresorhus) 是 JavaScript 生态系统中最活跃的开源贡献者之一，他名下贡献了超过 1,000 个 npm 软件包。他开发的实用程序（例如 [p-图](https://github.com/sindresorhus/p-map)、[预重试](https://github.com/sindresorhus/p-retry) 和 [是流](https://github.com/sindresorhus/is-stream)）是整个 Node.js 生态系统的基础构建块。

通过赞助 Sindre 的工作，我们帮助维持这些关键实用程序的开发，使 JavaScript 开发更加高效和可靠。

这些赞助体现了我们对更广泛的开源生态系统的承诺。我们深知，我们的成功建立在这些及其他贡献者奠定的基础之上，我们致力于确保整个生态系统的可持续性。

## 发现 JavaScript 生态系统中的安全漏洞 {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

我们对开源的承诺不仅局限于功能开发，还包括识别和解决可能影响数百万开发者的安全漏洞。我们对 JavaScript 生态系统的多项最重大贡献都与安全领域相关。

### Koa-Router 救援 {#the-koa-router-rescue}

2019 年 2 月，Nick 发现了热门软件包 koa-router 维护中存在一个关键问题。由于 [Hacker News 报道](https://news.ycombinator.com/item?id=19156707)，该软件包已被其原始维护者放弃，导致安全漏洞未得到解决，社区也得不到更新。

> \[!WARNING]
> 存在安全漏洞的废弃软件包对整个生态系统构成重大风险，尤其是当它们每周被下载数百万次时。

为此，Nick 创建了 [@koa/路由器](https://github.com/koajs/router) 并向社区通报了这一情况。从那时起，他一直维护着这个关键的包，确保 Koa 用户拥有一个安全且维护良好的路由解决方案。

### 解决 ReDoS 漏洞 {#addressing-redos-vulnerabilities}

2020 年，Nick 发现并解决了广泛使用的 `url-regex` 软件包中一个严重的 [正则表达式拒绝服务（ReDoS）](https://en.wikipedia.org/wiki/ReDoS) 漏洞。此漏洞 ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) 允许攻击者通过提供特制输入来引发拒绝服务攻击，从而导致正则表达式出现灾难性的回溯。

Nick 并没有简单地修补现有软件包，而是创建了 [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe)，这是一个完全重写的实现，在修复漏洞的同时保持了与原始 API 的兼容性。他还发布了 [综合博客文章](/blog/docs/url-regex-javascript-node-js)，解释了该漏洞及其缓解方法。

这项工作展示了我们的安全方法：不仅要解决问题，还要教育社区并提供强有力的替代方案，以防止将来出现类似问题。

### 倡导 Node.js 和 Chromium 安全性 {#advocating-for-nodejs-and-chromium-security}

Nick 还积极倡导在更广泛的生态系统中改进安全性。2020 年 8 月，他发现了 Node.js 中一个与 HTTP 标头处理相关的重大安全问题，并已在 [登记册](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/) 中报告。

这个问题源于 Chromium 的一个补丁，可能使攻击者能够绕过安全措施。Nick 的倡议帮助确保了这个问题得到及时解决，从而保护了数百万 Node.js 应用程序免受潜在攻击。

### 保护 npm 基础设施 {#securing-npm-infrastructure}

同月晚些时候，Nick 发现了另一个严重的安全问题，这次是 npm 的电子邮件基础设施中存在的问题。正如 [登记册](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/) 中报告的那样，npm 没有正确实施 DMARC、SPF 和 DKIM 电子邮件身份验证协议，这可能使攻击者能够发送看似来自 npm 的网络钓鱼电子邮件。

Nick 的报告促进了 npm 电子邮件安全态势的改善，保护了依赖 npm 进行包管理的数百万开发人员免受潜在的网络钓鱼攻击。

## 我们对转发电子邮件生态系统的贡献 {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email 基于多个关键开源项目构建，包括 Nodemailer、WildDuck 和 mailauth。我们的团队为这些项目做出了重大贡献，帮助识别并修复了影响电子邮件投递和安全的深层问题。

### 增强 Nodemailer 的核心功能 {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) 是 Node.js 中电子邮件发送的支柱，我们的贡献使其更加健壮：

* **SMTP 服务器改进**：我们修复了 SMTP 服务器组件中的解析错误、流处理问题以及 TLS 配置问题\[^16]\[^17]。
* **邮件解析器增强**：我们解决了字符序列解码错误，并解决了可能导致电子邮件处理失败的解析器问题\[^18]\[^19]。

这些贡献确保 Nodemailer 仍然是 Node.js 应用程序（包括 Forward Email）中电子邮件处理的可靠基础。

### 使用 Mailauth 推进电子邮件身份验证 {#advancing-email-authentication-with-mailauth}

[邮件](https://github.com/postalsys/mailauth) 提供了关键的电子邮件身份验证功能，我们的贡献显著提高了其功能：

* **DKIM 验证改进**：我们发现并报告了 X/Twitter 的 DNS 缓存问题，导致其出站邮件的 DKIM 失败，并在 Hacker One\[^20] 上进行了报告。
* **DMARC 和 ARC 增强功能**：我们修复了 DMARC 和 ARC 验证中可能导致身份验证结果不正确的问题\[^21]\[^22]。
* **性能优化**：我们贡献了一些优化措施，以提高电子邮件身份验证过程的性能\[^23]\[^24]\[^25]\[^26]。

这些改进有助于确保电子邮件身份验证的准确和可靠，保护用户免受网络钓鱼和欺骗攻击。

### 关键正常运行时间增强功能 {#key-upptime-enhancements}

我们对 Upptime 的贡献包括：

* **SSL 证书监控**：我们添加了监控 SSL 证书过期的功能，防止证书过期导致的意外停机\[^27]。
* **多个短信号码支持**：我们实现了在事件发生时通过短信向多个团队成员发出警报的支持，从而缩短了响应时间\[^28]。
* **IPv6 检查修复**：我们修复了 IPv6 连接检查的问题，确保在现代网络环境中进行更准确的监控\[^29]。
* **暗/亮模式支持**：我们添加了主题支持，以改善状态页面的用户体验\[^31]。
* **更好的 TCP-Ping 支持**：我们增强了 TCP ping 功能，以提供更可靠的连接测试\[^32]。

这些改进不仅有利于 Forward Email 的状态监控，而且可供整个 Upptime 用户社区使用，表明我们致力于改进我们所依赖的工具。

## 将所有内容粘合在一起的粘合剂：大规模自定义代码 {#the-glue-that-holds-it-all-together-custom-code-at-scale}

虽然我们的 npm 软件包和对现有项目的贡献意义重大，但真正展现我们技术专长的是集成这些组件的自定义代码。Forward Email 代码库凝聚了我们十年的开发心血，最早可以追溯到 2017 年，当时项目名为 [免费电子邮件转发](https://github.com/forwardemail/free-email-forwarding)，后来合并到 monorepo 中。

### 大规模开发工作 {#a-massive-development-effort}

这个自定义集成代码的规模令人印象深刻：

* **总贡献**：超过 3,217 次提交
* **代码库大小**：JavaScript、Pug、CSS 和 JSON 文件超过 421,545 行代码 [^33]

这代表着数千小时的开发工作、调试会话和性能优化。它是将单个软件包转化为每天供数千名客户使用的、紧密集成、可靠的服务的“秘诀”。

### 核心依赖项集成 {#core-dependencies-integration}

Forward Email 代码库将众多依赖项集成为一个无缝整体：

* **邮件处理**：集成 Nodemailer 发送邮件、SMTP 服务器接收邮件以及 Mailparser 解析邮件
* **身份验证**：使用 Mailauth 进行 DKIM、SPF、DMARC 和 ARC 验证
* **DNS 解析**：利用 Tangerine 实现 DNS-over-HTTPS 和全局缓存
* **MX 连接**：利用 mx-connect 与 Tangerine 集成，实现可靠的邮件服务器连接
* **任务调度**：使用 Bree 通过工作线程进行可靠的后台任务处理
* **模板**：使用邮件模板在客户沟通中复用网站上的样式表
* **邮件存储**：使用 better-sqlite3-multiple-ciphers 和 ChaCha20-Poly1305 加密技术，实现单独加密的 SQLite 邮箱，确保用户之间完全隔离，并且只有用户才能访问其邮箱

每种集成都需要仔细考虑各种极端情况、性能影响和安全问题。最终，我们打造了一个能够可靠处理数百万封电子邮件交易的强大系统。我们的 SQLite 实现还利用 msgpackr 进行高效的二进制序列化，并使用 WebSockets（通过 ws）在整个基础架构中进行实时状态更新。

### 带有 Tangerine 和 mx-connect 的 DNS 基础设施 {#dns-infrastructure-with-tangerine-and-mx-connect}

Forward Email 基础设施的一个关键组件是我们的 DNS 解析系统，它围绕两个关键包构建：

* **[柑橘](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**：我们的 Node.js DNS-over-HTTPS 实现为标准 DNS 解析器提供了直接替代品，具有内置重试、超时、智能服务器轮换和缓存支持。

* **[mx-连接](https://github.com/zone-eu/mx-connect)**：此包建立与 MX 服务器的 TCP 连接，获取目标域或电子邮件地址，解析适当的 MX 服务器，并按优先级顺序连接到它们。

我们通过 [拉取请求 #4](https://github.com/zone-eu/mx-connect/pull/4），确保 Forward Email 始终通过 HTTP 请求进行应用层 DNS 解析。这为 DNS 提供了大规模全局缓存，并实现了跨任何区域、应用或进程的 1:1 一致性——这对于在分布式系统中实现可靠的电子邮件传递至关重要。

## 企业影响力：从开源到关键任务解决方案 {#enterprise-impact-from-open-source-to-mission-critical-solutions}

我们十年开源开发历程的巅峰之作，使 Forward Email 不仅能够服务于个人开发者，还能服务于构成开源运动支柱的大型企业和教育机构。

### 关键任务电子邮件基础设施案例研究 {#case-studies-in-mission-critical-email-infrastructure}

我们对可靠性、隐私性和开源原则的承诺，使 Forward Email 成为对电子邮件要求苛刻的组织的可靠之选：

* **教育机构**：详见我们的[校友电子邮件转发案例研究]](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study) 将 Tangerine 与 mx-connect 集成，各大大学依靠我们的基础设施通过可靠的电子邮件转发服务与数十万校友保持终身联系。

* **企业 Linux 解决方案**：[Canonical Ubuntu 电子邮件企业案例研究](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) 展示了我们的开源方法如何完美地满足企业 Linux 提供商的需求，为他们提供所需的透明度和控制力。

* **开源基金会**：也许最有说服力的是我们与 Linux 基金会的合作，正如 [Linux 基金会电子邮件企业案例研究](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study) 中记录的那样，我们的服务为管理 Linux 开发的组织提供通信支持。

多年来，我们精心维护的开源软件包，使我们能够构建电子邮件服务，如今它正支持着那些倡导开源软件的社区和组织，这其中蕴含着一种美妙的对称性。从贡献单个软件包到为开源领袖提供企业级电子邮件基础设施，这段完整的历程代表了我们软件开发方法的终极验证。

## 开源十年：展望未来 {#a-decade-of-open-source-looking-forward}

当我们回顾过去十年的开源贡献并展望未来十年时，我们对支持我们工作的社区充满感激，并对未来充满兴奋。

我们从个人软件包贡献者成长为大型企业和开源基金会所使用的综合电子邮件基础设施的维护者，走过了一段非凡的历程。这证明了开源开发的力量，以及精心设计、维护良好的软件能够对更广泛的生态系统产生的影响。

在未来的几年里，我们致力于：

* **持续维护和改进我们现有的软件包**，确保它们始终是全球开发者的可靠工具。
* **扩大我们对关键基础设施项目的贡献**，尤其是在电子邮件和安全领域。
* **增强 Forward Email 的功能**，同时坚守我们对隐私、安全和透明度的承诺。
* **通过指导、赞助和社区参与，**支持下一代开源贡献者**。

我们相信，软件开发的未来是开放的、协作的，并且建立在信任的基础之上。通过持续为 JavaScript 生态系统贡献高质量、注重安全的软件包，我们希望为构建这样的未来贡献一份绵薄之力。

感谢每一位使用过我们软件包、参与过我们项目的用户、报告过问题的用户，以及任何一位传播我们成果的人。是你们的支持成就了我们这十年的辉煌，我们期待着在未来十年里携手共创辉煌。

\[^1]: 2025 年 4 月 cabbing 的 npm 下载统计
\[^2]: 2025 年 2 月至 3 月 bson-objectid 的 npm 下载统计
\[^3]: 2025 年 4 月 url-regex-safe 的 npm 下载统计
\[^4]: 截至 2025 年 4 月 forwardemail/forwardemail.net 的 GitHub 星数
\[^5]: 2025 年 4 月 preview-email 的 npm 下载统计
\[^7]: 2025 年 2 月至 3 月 superagent 的 npm 下载统计
\[^8]: 2025 年 2 月至 3 月 supertest 的 npm 下载统计
\[^9]: 2025 年 2 月至 3 月 preview-email 的 npm 下载统计
\[^10]: 2025 年 2 月至 3 月 cabbing 的 npm 下载统计
\[^11]: url-regex-safe，2025 年 2 月至 3 月
\[^12]: npm 垃圾邮件扫描器 (spamscanner) 的下载统计数据，2025 年 2 月至 3 月
\[^13]: npm 统计数据中的每日下载模式，2025 年 4 月
\[^14]: npm 统计数据中的每周下载模式，2025 年 4 月
\[^15]: npm 节点邮件器 (nodemailer) 的下载统计数据，2025 年 4 月
\[^16]: <https://github.com/nodemailer/smtp-server/issues/155>
\[^17]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>
\[^18]: <https://github.com/nodemailer/mailparser/issues/261>
\[^19]: <https://github.com/nodemailer/nodemailer/issues/1102>
\[^20]: <https://github.com/postalsys/mailauth/issues/30>
\[^21]: <https://github.com/postalsys/mailauth/issues/58>
\[^22]: <https://github.com/postalsys/mailauth/issues/48>
\[^23]: <https://github.com/postalsys/mailauth/issues/74>
\[^24]: <https://github.com/postalsys/mailauth/issues/75>
\[^25]: <https://github.com/postalsys/mailauth/issues/60>
\[^26]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>0
\[^27]: 基于 Upptime 仓库中的 GitHub 问题
\[^28]: 基于 Upptime 仓库中的 GitHub 问题
\[^29]: 基于 Upptime 仓库中的 GitHub 问题
\[^30]: 2025 年 2 月至 3 月 bree 的 npm 下载统计
\[^31]: 基于 Upptime 的 GitHub 拉取请求
\[^32]: 基于 Upptime 的 GitHub 拉取请求
\[^34]: 2025 年 2 月至 3 月 koa 的 npm 下载统计
\[^35]: npm 2025 年 2 月至 3 月 @koa/router 的下载统计数据
\[^36]: 2025 年 2 月至 3 月 npm koa-router 的下载统计数据
\[^37]: 2025 年 2 月至 3 月 npm url-regex 的下载统计数据
\[^38]: 2025 年 2 月至 3 月 @breejs/later 的下载统计数据
\[^39]: 2025 年 2 月至 3 月 npm email-templates 的下载统计数据
\[^40]: 2025 年 2 月至 3 月 npm get-paths 的下载统计数据
\[^41]: 2025 年 2 月至 3 月 npm dotenv-parse-variables 的下载统计数据
\[^42]: 2025 年 2 月至 3 月 @koa/multer 的下载统计数据