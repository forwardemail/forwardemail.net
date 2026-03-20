# 十年的影响力：我们的 npm 包如何达到 10 亿下载量并塑造了 JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />


## 目录 {#table-of-contents}

* [前言](#foreword)
* [信任我们的先驱者：Isaac Z. Schlueter 和 Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [从 npm 的创建到 Node.js 领导地位](#from-npms-creation-to-nodejs-leadership)
* [代码背后的架构师：Nick Baugh 的旅程](#the-architect-behind-the-code-nick-baughs-journey)
  * [Express 技术委员会和核心贡献](#express-technical-committee-and-core-contributions)
  * [Koa 框架贡献](#koa-framework-contributions)
  * [从个人贡献者到组织领导者](#from-individual-contributor-to-organization-leader)
* [我们的 GitHub 组织：创新生态系统](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin：现代应用的结构化日志](#cabin-structured-logging-for-modern-applications)
  * [Spam Scanner：打击邮件滥用](#spam-scanner-fighting-email-abuse)
  * [Bree：使用 Worker Threads 的现代任务调度](#bree-modern-job-scheduling-with-worker-threads)
  * [Forward Email：开源邮件基础设施](#forward-email-open-source-email-infrastructure)
  * [Lad：必备的 Koa 工具和实用程序](#lad-essential-koa-utilities-and-tools)
  * [Upptime：开源正常运行时间监控](#upptime-open-source-uptime-monitoring)
* [我们对 Forward Email 生态系统的贡献](#our-contributions-to-the-forward-email-ecosystem)
  * [从包到生产环境](#from-packages-to-production)
  * [反馈循环](#the-feedback-loop)
* [Forward Email 的核心原则：卓越的基础](#forward-emails-core-principles-a-foundation-for-excellence)
  * [始终以开发者友好、安全为先和透明为原则](#always-developer-friendly-security-focused-and-transparent)
  * [遵循经过时间考验的软件开发原则](#adherence-to-time-tested-software-development-principles)
  * [面向坚韧不拔、自力更生的开发者](#targeting-the-scrappy-bootstrapped-developer)
  * [原则的实践：Forward Email 代码库](#principles-in-practice-the-forward-email-codebase)
  * [隐私设计](#privacy-by-design)
  * [可持续的开源](#sustainable-open-source)
* [数据不撒谎：我们惊人的 npm 下载统计](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [我们影响力的鸟瞰图](#a-birds-eye-view-of-our-impact)
  * [规模化的每日影响](#daily-impact-at-scale)
  * [超越原始数字](#beyond-the-raw-numbers)
* [支持生态系统：我们的开源赞助](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman：邮件基础设施先驱](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus：实用包大师](#sindre-sorhus-utility-package-mastermind)
* [揭示 JavaScript 生态系统中的安全漏洞](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Koa-Router 的救援](#the-koa-router-rescue)
  * [解决 ReDoS 漏洞](#addressing-redos-vulnerabilities)
  * [倡导 Node.js 和 Chromium 安全](#advocating-for-nodejs-and-chromium-security)
  * [保障 npm 基础设施安全](#securing-npm-infrastructure)
* [我们对 Forward Email 生态系统的贡献](#our-contributions-to-the-forward-email-ecosystem-1)
  * [增强 Nodemailer 的核心功能](#enhancing-nodemailers-core-functionality)
  * [推动邮件认证 Mailauth](#advancing-email-authentication-with-mailauth)
  * [Upptime 的关键改进](#key-upptime-enhancements)
* [将一切联系起来的胶水：大规模定制代码](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [庞大的开发工作](#a-massive-development-effort)
  * [核心依赖集成](#core-dependencies-integration)
  * [使用 Tangerine 和 mx-connect 的 DNS 基础设施](#dns-infrastructure-with-tangerine-and-mx-connect)
* [企业影响力：从开源到关键任务解决方案](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [关键任务邮件基础设施案例研究](#case-studies-in-mission-critical-email-infrastructure)
* [十年开源：展望未来](#a-decade-of-open-source-looking-forward)
## 前言 {#foreword}

在 [JavaScript](https://en.wikipedia.org/wiki/JavaScript) 和 [Node.js](https://en.wikipedia.org/wiki/Node.js) 世界中，有些包是必不可少的——每天被下载数百万次，驱动着全球的应用程序。这些工具背后是专注于开源质量的开发者团队。今天，我们展示我们的团队如何帮助构建和维护已成为 JavaScript 生态系统关键部分的 npm 包。

## 信任我们的先驱者：Isaac Z. Schlueter 和 Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

我们很自豪拥有 [Isaac Z. Schlueter](https://izs.me/)（[GitHub: isaacs](https://github.com/isaacs)）作为用户。Isaac 创建了 [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) 并帮助构建了 [Node.js](https://en.wikipedia.org/wiki/Node.js)。他对 Forward Email 的信任体现了我们对质量和安全的关注。Isaac 使用 Forward Email 管理多个域名，包括 izs.me。

Isaac 对 JavaScript 的影响巨大。2009 年，他是最早看到 Node.js 潜力的人之一，与平台创建者 [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl) 一起工作。正如 Isaac 在 [Increment 杂志采访](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/) 中所说：“在这个由一群人试图实现服务器端 JS 的非常小的社区中，Ryan Dahl 推出了 Node，这显然是正确的方向。我全力支持，并在 2009 年中期深度参与。”

> \[!NOTE]
> 对于对 Node.js 历史感兴趣的人，有一些优秀的纪录片记录了其发展历程，包括 [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) 和 [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I)。Ryan Dahl 的 [个人网站](https://tinyclouds.org/) 也包含了他工作的重要见解。

### 从 npm 的创建到 Node.js 领导 {#from-npms-creation-to-nodejs-leadership}

Isaac 于 2009 年 9 月创建了 npm，首个可用版本于 2010 年初发布。这个包管理器满足了 Node.js 的关键需求，使开发者能够轻松共享和重用代码。根据 [Node.js 维基百科页面](https://en.wikipedia.org/wiki/Node.js)：“2010 年 1 月，为 Node.js 环境引入了一个名为 npm 的包管理器。该包管理器允许程序员发布和共享 Node.js 包及其源代码，旨在简化包的安装、更新和卸载。”

当 Ryan Dahl 于 2012 年 1 月退出 Node.js 项目时，Isaac 接任项目负责人。正如他在 [简历](https://izs.me/resume) 中所述，他“领导开发了多个核心 Node.js API，包括 CommonJS 模块系统、文件系统 API 和流”，并“担任项目的终身仁慈独裁者（BDFL）两年，确保 Node.js v0.6 到 v0.10 版本的质量不断提升和构建流程可靠。”

Isaac 引导 Node.js 进入关键增长期，制定了至今仍影响平台的标准。他后来于 2014 年创立了 npm, Inc.，支持他之前独立运营的 npm 注册表。

我们感谢 Isaac 对 JavaScript 的巨大贡献，并继续使用他创建的许多包。他的工作改变了我们构建软件的方式，以及数百万开发者共享代码的方式。

## 代码背后的架构师：Nick Baugh 的历程 {#the-architect-behind-the-code-nick-baughs-journey}

我们开源成功的核心是 Nick Baugh，Forward Email 的创始人和所有者。他在 JavaScript 领域的工作跨越近 20 年，塑造了无数开发者构建应用的方式。他的开源历程展现了技术能力和社区领导力。

### Express 技术委员会和核心贡献 {#express-technical-committee-and-core-contributions}

Nick 在 Web 框架方面的专业知识使他获得了 [Express 技术委员会](https://expressjs.com/en/resources/community.html) 的席位，帮助维护这个最受欢迎的 Node.js 框架之一。Nick 现在被列为 [Express 社区页面](https://expressjs.com/en/resources/community.html) 上的非活跃成员。
> \[!IMPORTANT]
> Express 最初由 TJ Holowaychuk 创建，他是一位多产的开源贡献者，塑造了大量 Node.js 生态系统。我们感谢 TJ 的基础性工作，并尊重他[决定暂时休息](https://news.ycombinator.com/item?id=37687017)于他广泛的开源贡献。

作为[Express 技术委员会](https://expressjs.com/en/resources/community.html)的成员，Nick 在澄清 `req.originalUrl` 文档和修复多部分表单处理问题等细节上表现出极大的关注。

### Koa 框架贡献 {#koa-framework-contributions}

Nick 在[TJ Holowaychuk 创建的现代轻量级 Express 替代品 Koa 框架](https://github.com/koajs/koa)上的工作，进一步展示了他对更好 Web 开发工具的承诺。他对 Koa 的贡献包括通过拉取请求解决错误处理、内容类型管理和文档改进等问题。

他在 Express 和 Koa 两个框架上的工作让他对 Node.js Web 开发有独特的见解，帮助我们的团队创建能兼容多个框架生态的包。

### 从个人贡献者到组织领导者 {#from-individual-contributor-to-organization-leader}

从帮助现有项目开始，发展到创建和维护完整的包生态系统。Nick 创立了多个 GitHub 组织——包括 [Cabin](https://github.com/cabinjs)、[Spam Scanner](https://github.com/spamscanner)、[Forward Email](https://github.com/forwardemail)、[Lad](https://github.com/ladjs) 和 [Bree](https://github.com/breejs)——每个组织都解决 JavaScript 社区的特定需求。

这种从贡献者到领导者的转变体现了 Nick 对设计良好、解决实际问题的软件的愿景。通过将相关包组织在专注的 GitHub 组织下，他构建了协同工作的工具生态，同时保持模块化和灵活性，惠及更广泛的开发者社区。

## 我们的 GitHub 组织：创新生态系统 {#our-github-organizations-ecosystems-of-innovation}

我们围绕专注的 GitHub 组织组织开源工作，每个组织解决 JavaScript 中的特定需求。这种结构创造了紧密协作的包家族，同时保持模块化。

### Cabin：现代应用的结构化日志 {#cabin-structured-logging-for-modern-applications}

[Cabin 组织](https://github.com/cabinjs)是我们对简单且强大应用日志的诠释。主包[`cabin`](https://github.com/cabinjs/cabin)拥有近 900 个 GitHub 星标和超过 100,000 次每周下载量\[^1]。Cabin 提供结构化日志，兼容 Sentry、LogDNA 和 Papertrail 等流行服务。

Cabin 的特别之处在于其周到的 API 和插件系统。支持包如用于 Express 中间件的[`axe`](https://github.com/cabinjs/axe)和用于 HTTP 请求解析的[`parse-request`](https://github.com/cabinjs/parse-request)展示了我们对完整解决方案而非孤立工具的承诺。

[`bson-objectid`](https://github.com/cabinjs/bson-objectid)包值得特别提及，两个月内下载量超过 170 万\[^2]。这个轻量级 MongoDB ObjectID 实现已成为开发者在无需完整 MongoDB 依赖时生成 ID 的首选。

### Spam Scanner：打击邮件滥用 {#spam-scanner-fighting-email-abuse}

[Spam Scanner 组织](https://github.com/spamscanner)体现了我们解决实际问题的决心。主包[`spamscanner`](https://github.com/spamscanner/spamscanner)提供先进的邮件垃圾检测，但真正被广泛采用的是[`url-regex-safe`](https://github.com/spamscanner/url-regex-safe)包。

`url-regex-safe` 两个月内下载量超过 120 万\[^3]，修复了其他 URL 检测正则表达式中的关键安全问题。该包展示了我们的开源理念：发现常见问题（此处为 URL 验证中的[ReDoS](https://en.wikipedia.org/wiki/ReDoS)漏洞），创建稳健解决方案，并细心维护。
### Bree：使用 Worker Threads 的现代作业调度 {#bree-modern-job-scheduling-with-worker-threads}

[Bree 组织](https://github.com/breejs) 是我们对一个常见 Node.js 挑战的解决方案：可靠的作业调度。主要的 [`bree`](https://github.com/breejs/bree) 包拥有超过 3,100 个 GitHub 星标，提供了一个使用 Node.js worker threads 的现代作业调度器，以获得更好的性能和可靠性。

> \[!NOTE]
> Bree 是在我们协助维护 [Agenda](https://github.com/agenda/agenda) 后创建的，应用了从中学到的经验教训来构建更好的作业调度器。我们对 Agenda 的贡献帮助我们找到了改进作业调度的方法。

Bree 与其他调度器（如 Agenda）不同之处：

* **无外部依赖**：与需要 MongoDB 的 Agenda 不同，Bree 不需要 Redis 或 MongoDB 来管理作业状态。
* **Worker Threads**：Bree 使用 Node.js worker threads 进行沙箱进程，提供更好的隔离和性能。
* **简单的 API**：Bree 提供详细控制且简单易用，使实现复杂调度需求更容易。
* **内置支持**：默认包含优雅重载、cron 作业、日期和人性化时间等功能。

Bree 是 [forwardemail.net](https://github.com/forwardemail/forwardemail.net) 的关键部分，处理关键的后台任务，如邮件处理、清理和定期维护。在 Forward Email 中使用 Bree 展示了我们在生产环境中使用自家工具的承诺，确保它们达到高可靠性标准。

我们还使用并欣赏其他优秀的 worker thread 包，如 [piscina](https://github.com/piscinajs/piscina) 和 HTTP 客户端如 [undici](https://github.com/nodejs/undici)。Piscina 和 Bree 一样，使用 Node.js worker threads 进行高效任务处理。我们感谢维护 undici 和 piscina 的 [Matteo Collina](https://github.com/mcollina) 对 Node.js 的重大贡献。Matteo 是 Node.js 技术指导委员会成员，极大地提升了 Node.js 中 HTTP 客户端的能力。

### Forward Email：开源邮件基础设施 {#forward-email-open-source-email-infrastructure}

我们最雄心勃勃的项目是 [Forward Email](https://github.com/forwardemail)，一个提供邮件转发、存储和 API 服务的开源邮件服务。主仓库拥有超过 1,100 个 GitHub 星标\[^4]，显示了社区对这一专有邮件服务替代方案的认可。

该组织的 [`preview-email`](https://github.com/forwardemail/preview-email) 包在两个月内下载量超过 250 万\[^5]，已成为开发者处理邮件模板的必备工具。它通过提供一种简单的方式在开发过程中预览邮件，解决了构建邮件功能应用时的常见痛点。

### Lad：Koa 必备实用工具和工具集 {#lad-essential-koa-utilities-and-tools}

[Lad 组织](https://github.com/ladjs) 提供了一系列主要聚焦于增强 Koa 框架生态的必备实用工具和工具包。这些包解决了 Web 开发中的常见挑战，设计上既能无缝协作，也能独立使用。

#### koa-better-error-handler：改进的 Koa 错误处理 {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) 为 Koa 应用提供了更好的错误处理方案。该包拥有超过 50 个 GitHub 星标，使 `ctx.throw` 产生用户友好的错误信息，同时解决了 Koa 内置错误处理器的多个限制：

* 检测并正确处理 Node.js DNS 错误、Mongoose 错误和 Redis 错误
* 使用 [Boom](https://github.com/hapijs/boom) 创建一致且格式良好的错误响应
* 保留头信息（不同于 Koa 内置处理器）
* 保持适当的状态码，而非默认 500
* 支持闪存消息和会话保持
* 为验证错误提供 HTML 错误列表
* 支持多种响应类型（HTML、JSON 和纯文本）
该包在与 [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) 一起使用时，特别有价值，可实现 Koa 应用的全面错误管理。

#### passport: Lad 的身份验证 {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) 扩展了流行的 Passport.js 身份验证中间件，针对现代 Web 应用进行了特定增强。该包开箱即用支持多种身份验证策略：

* 使用电子邮件的本地身份验证
* 使用 Apple 登录
* GitHub 身份验证
* Google 身份验证
* 一次性密码（OTP）身份验证

该包高度可定制，允许开发者调整字段名称和短语以匹配其应用需求。它设计为与 Mongoose 无缝集成进行用户管理，是需要强大身份验证的基于 Koa 应用的理想解决方案。

#### graceful: 优雅的应用关闭 {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) 解决了 Node.js 应用优雅关闭的关键挑战。该包拥有超过 70 个 GitHub 星标，确保您的应用能够干净地终止，不丢失数据或留下悬挂连接。主要功能包括：

* 支持优雅关闭 HTTP 服务器（Express/Koa/Fastify）
* 干净关闭数据库连接（MongoDB/Mongoose）
* 正确关闭 Redis 客户端
* 处理 Bree 任务调度器
* 支持自定义关闭处理程序
* 可配置的超时设置
* 与日志系统集成

该包对于生产环境应用至关重要，避免意外关闭导致数据丢失或损坏。通过实现正确的关闭流程，`@ladjs/graceful` 有助于确保应用的可靠性和稳定性。

### Upptime：开源正常运行时间监控 {#upptime-open-source-uptime-monitoring}

[Upptime 组织](https://github.com/upptime) 体现了我们对透明、开源监控的承诺。主仓库 [`upptime`](https://github.com/upptime/upptime) 拥有超过 13,000 个 GitHub 星标，是我们贡献的最受欢迎项目之一。Upptime 提供了一个完全无服务器运行的基于 GitHub 的正常运行时间监控和状态页面。

我们在 <https://status.forwardemail.net> 使用 Upptime 作为自己的状态页面，源代码托管在 <https://github.com/forwardemail/status.forwardemail.net>。

Upptime 的特别之处在于其架构：

* **100% 开源**：每个组件都是完全开源且可定制的。
* **由 GitHub 驱动**：利用 GitHub Actions、Issues 和 Pages 实现无服务器监控解决方案。
* **无需服务器**：与传统监控工具不同，Upptime 不需要您运行或维护服务器。
* **自动状态页面**：生成漂亮的状态页面，可托管在 GitHub Pages 上。
* **强大的通知功能**：集成多种通知渠道，包括电子邮件、短信和 Slack。

为了提升用户体验，我们将 [@octokit/core](https://github.com/octokit/core.js/) 集成到 forwardemail.net 代码库中，实时渲染状态更新和事件，直接在我们的网站上展示。此集成为用户提供了清晰透明的服务状态信息，涵盖整个技术栈（网站、API、MongoDB、Redis、SQLite、SMTP、POP3、IMAP、Bree 等），并通过即时弹出通知、徽章图标变化、警告颜色等方式提醒用户。

@octokit/core 库使我们能够从 Upptime GitHub 仓库获取实时数据，处理后以用户友好的方式展示。当任何服务出现故障或性能下降时，用户会通过视觉指示立即收到通知，无需离开主应用。这种无缝集成确保用户始终掌握系统状态的最新信息，增强透明度和信任感。

Upptime 已被数百个组织采用，作为一种透明、可靠的服务监控和状态沟通方式。该项目的成功展示了利用现有基础设施（此处为 GitHub）以新方式解决常见问题的强大能力。
## 我们对 Forward Email 生态系统的贡献 {#our-contributions-to-the-forward-email-ecosystem}

虽然我们的开源包被全球开发者使用，但它们也构成了我们自身 Forward Email 服务的基础。作为这些工具的创造者和用户，这种双重身份让我们对其实际应用有独特的视角，并推动持续改进。

### 从包到生产环境 {#from-packages-to-production}

从单个包到一个连贯的生产系统的过程涉及细致的集成和扩展。对于 Forward Email，这一过程包括：

* **自定义扩展**：构建针对 Forward Email 的开源包特定扩展，以满足我们的独特需求。
* **集成模式**：开发这些包在生产环境中如何交互的模式。
* **性能优化**：识别并解决仅在大规模下出现的性能瓶颈。
* **安全加固**：增加针对邮件处理和用户数据保护的额外安全层。

这项工作代表了在核心包之外数千小时的开发，最终打造出一个稳健、安全的邮件服务，充分利用了我们开源贡献的优势。

### 反馈循环 {#the-feedback-loop}

也许在生产环境中使用我们自己的包最有价值的方面是它所创造的反馈循环。当我们在 Forward Email 中遇到限制或边缘情况时，我们不仅仅是本地修补——我们改进底层包，惠及我们的服务和更广泛的社区。

这种方法带来了许多改进：

* **Bree 的优雅关闭**：Forward Email 对零停机部署的需求推动了 Bree 优雅关闭功能的增强。
* **Spam Scanner 的模式识别**：Forward Email 中遇到的真实垃圾邮件模式促进了 Spam Scanner 检测算法的改进。
* **Cabin 的性能优化**：生产环境中的高量日志记录揭示了 Cabin 的优化机会，惠及所有用户。

通过保持开源工作与生产服务之间的良性循环，我们确保我们的包保持实用、经过实战检验的解决方案，而非理论实现。

## Forward Email 的核心原则：卓越的基础 {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email 的设计遵循一套核心原则，指导我们所有的开发决策。这些原则详见我们的[网站](/blog/docs/best-quantum-safe-encrypted-email-service#principles)，确保我们的服务始终对开发者友好、安全且注重用户隐私。

### 始终对开发者友好，注重安全与透明 {#always-developer-friendly-security-focused-and-transparent}

我们的首要原则是创建对开发者友好的软件，同时保持最高的安全和隐私标准。我们相信技术卓越绝不应以牺牲可用性为代价，透明度则建立了与社区的信任。

这一原则体现在我们详尽的文档、清晰的错误信息以及对成功与挑战的公开沟通中。通过将整个代码库开源，我们邀请审查与协作，强化了我们的软件和更广泛的生态系统。

### 遵循经过时间考验的软件开发原则 {#adherence-to-time-tested-software-development-principles}

我们遵循多项经过数十年验证的软件开发原则：

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**：通过模型-视图-控制器模式分离关注点
* **[Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy)**：创建只做好一件事的模块化组件
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**：保持简单明了
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**：不重复自己，促进代码复用
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**：你不会需要它，避免过早优化
* **[Twelve Factor](https://12factor.net/)**：遵循构建现代可扩展应用的最佳实践
* **[Occam's razor](https://en.wikipedia.org/wiki/Occam%27s_razor)**：选择满足需求的最简单方案
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**：广泛使用我们自己的产品
这些原则不仅仅是理论概念——它们已经融入到我们的日常开发实践中。例如，我们对 Unix 哲学的坚持体现在我们如何构建 npm 包：小而专注的模块，可以组合在一起解决复杂问题。

### 面向坚韧、自力更生的开发者 {#targeting-the-scrappy-bootstrapped-developer}

我们特别面向坚韧、自力更生且实现了[拉面盈利](https://www.paulgraham.com/ramenprofitable.html)的开发者。这一定位影响了我们从定价模型到技术决策的方方面面。我们理解在资源有限的情况下构建产品的挑战，因为我们自己也经历过。

这一原则在我们对开源的态度中尤为重要。我们创建并维护解决开发者实际问题的包，尤其是那些没有企业预算的开发者，使强大的工具对所有人开放，无论其资源多少。

### 原则的实践：Forward Email 代码库 {#principles-in-practice-the-forward-email-codebase}

这些原则在 Forward Email 代码库中清晰可见。我们的 package.json 文件展示了经过深思熟虑的依赖选择，每个依赖都与我们的核心价值观相契合：

* 以安全为中心的包，如用于邮件认证的 `mailauth`
* 方便开发者调试的工具，如 `preview-email`
* 模块化组件，如 Sindre Sorhus 的各种 `p-*` 工具

通过长期坚持这些原则，我们构建了一个开发者可以信赖的邮件基础设施服务——安全、可靠，并且符合开源社区的价值观。

### 隐私设计 {#privacy-by-design}

隐私对 Forward Email 来说不是事后考虑或营销噱头——它是指导我们服务和代码每个方面的基本设计原则：

* **零访问加密**：我们实现了技术上不可能读取用户邮件的系统。
* **最小数据收集**：我们只收集提供服务所必需的数据，绝不多收。
* **透明政策**：我们的隐私政策用清晰易懂的语言编写，没有法律术语。
* **开源验证**：我们的开源代码库允许安全研究人员验证我们的隐私声明。

这一承诺也延伸到我们的开源包，这些包从一开始就内置了安全和隐私的最佳实践。

### 可持续的开源 {#sustainable-open-source}

我们相信开源软件需要可持续的模式才能长期繁荣。我们的做法包括：

* **商业支持**：围绕我们的开源工具提供高级支持和服务。
* **平衡许可**：使用既保护用户自由又保障项目可持续性的许可协议。
* **社区参与**：积极与贡献者互动，构建支持性的社区。
* **透明路线图**：分享我们的开发计划，方便用户做出相应规划。

通过关注可持续性，我们确保我们的开源贡献能够持续增长和改进，而不是被遗忘。

## 数据不撒谎：我们惊人的 npm 下载统计 {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

谈到开源软件的影响力，下载统计提供了采用率和信任度的有形衡量。我们维护的许多包达到了极少数开源项目能达到的规模，累计下载量达到数十亿。

![按下载量排名的顶级 npm 包](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> 虽然我们很自豪能帮助维护 JavaScript 生态中多个高下载量的包，但我们也要承认，许多这些包最初是由其他才华横溢的开发者创建的。像 superagent 和 supertest 这样的包最初由 TJ Holowaychuk 创建，他对开源的丰富贡献对塑造 Node.js 生态系统起到了关键作用。
### 我们影响力的鸟瞰图 {#a-birds-eye-view-of-our-impact}

仅在2025年2月至3月这两个月期间，我们贡献并协助维护的顶级包记录了惊人的下载量：

* **[superagent](https://www.npmjs.com/package/superagent)**：84,575,829 次下载\[^7]（最初由 TJ Holowaychuk 创建）
* **[supertest](https://www.npmjs.com/package/supertest)**：76,432,591 次下载\[^8]（最初由 TJ Holowaychuk 创建）
* **[koa](https://www.npmjs.com/package/koa)**：28,539,295 次下载\[^34]（最初由 TJ Holowaychuk 创建）
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**：11,007,327 次下载\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**：3,498,918 次下载\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**：2,819,520 次下载\[^37]
* **[preview-email](https://www.npmjs.com/package/preview-email)**：2,500,000 次下载\[^9]
* **[cabin](https://www.npmjs.com/package/cabin)**：1,800,000 次下载\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)**：1,709,938 次下载\[^38]
* **[email-templates](https://www.npmjs.com/package/email-templates)**：1,128,139 次下载\[^39]
* **[get-paths](https://www.npmjs.com/package/get-paths)**：1,124,686 次下载\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)**：1,200,000 次下载\[^11]
* **[dotenv-parse-variables](https://www.npmjs.com/package/dotenv-parse-variables)**：894,666 次下载\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**：839,585 次下载\[^42]
* **[spamscanner](https://www.npmjs.com/package/spamscanner)**：145,000 次下载\[^12]
* **[bree](https://www.npmjs.com/package/bree)**：24,270 次下载\[^30]

> \[!NOTE]
> 我们协助维护但未创建的其他几个包的下载量甚至更高，包括 `form-data`（超过7.38亿次下载）、`toidentifier`（超过3.09亿次下载）、`stackframe`（超过1.16亿次下载）和 `error-stack-parser`（超过1.13亿次下载）。我们很荣幸能为这些包做出贡献，同时尊重其原作者的工作。

这些不仅仅是令人印象深刻的数字——它们代表了真实的开发者通过我们协助维护的代码解决真实问题的实例。每一次下载都是这些包帮助某人构建有意义项目的体现，从业余爱好项目到数百万用户使用的企业应用。

![Package Categories Distribution](/img/art/category_pie_chart.svg)

### 大规模的每日影响 {#daily-impact-at-scale}

每日下载模式显示出持续的高使用量，峰值达到每天数百万次下载\[^13]。这种持续性体现了这些包的稳定性和可靠性——开发者不仅仅是尝试它们，而是将它们集成到核心工作流程中，并日复一日地依赖它们。

每周下载模式显示出更为惊人的数字，持续稳定在每周数千万次下载\[^14]。这代表了在 JavaScript 生态系统中的巨大影响力，这些包在全球的生产环境中运行。

### 超越原始数字 {#beyond-the-raw-numbers}

虽然下载统计数据本身令人印象深刻，但它们讲述了社区对这些包信任的更深层故事。在如此规模下维护包需要坚定不移的承诺：

* **向后兼容性**：变更必须谨慎考虑，以避免破坏现有实现。
* **安全性**：数百万应用依赖这些包，安全漏洞可能带来深远影响。
* **性能**：在此规模下，即使是微小的性能提升也能带来显著的整体效益。
* **文档**：清晰、全面的文档对所有经验水平的开发者都至关重要。

下载量的持续增长反映了我们在履行这些承诺方面的成功，通过可靠且维护良好的包赢得了开发者社区的信任。
## 支持生态系统：我们的开源赞助计划 {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> 开源的可持续发展不仅仅是贡献代码——还包括支持维护关键基础设施的开发者。

除了我们对 JavaScript 生态系统的直接贡献外，我们还自豪地赞助了许多杰出的 Node.js 贡献者，他们的工作构成了许多现代应用的基础。我们的赞助包括：

### Andris Reinman：电子邮件基础设施先锋 {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) 是 [Nodemailer](https://github.com/nodemailer/nodemailer) 的创建者，这是 Node.js 最受欢迎的邮件发送库，每周下载量超过 1400 万次\[^15]。他的工作还扩展到其他关键的邮件基础设施组件，如 [SMTP Server](https://github.com/nodemailer/smtp-server)、[Mailparser](https://github.com/nodemailer/mailparser) 和 [WildDuck](https://github.com/nodemailer/wildduck)。

我们的赞助帮助确保这些为无数 Node.js 应用（包括我们自己的 Forward Email 服务）提供邮件通信支持的关键工具能够持续维护和开发。

### Sindre Sorhus：实用工具包大师 {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) 是 JavaScript 生态系统中最高产的开源贡献者之一，拥有超过 1000 个 npm 包。他的实用工具如 [p-map](https://github.com/sindresorhus/p-map)、[p-retry](https://github.com/sindresorhus/p-retry) 和 [is-stream](https://github.com/sindresorhus/is-stream) 是 Node.js 生态系统中广泛使用的基础构件。

通过赞助 Sindre 的工作，我们帮助维持这些关键实用工具的开发，使 JavaScript 开发更加高效和可靠。

这些赞助体现了我们对更广泛开源生态系统的承诺。我们认识到自身的成功建立在这些及其他贡献者奠定的基础之上，并致力于确保整个生态系统的可持续发展。


## 揭示 JavaScript 生态系统中的安全漏洞 {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

我们对开源的承诺不仅限于功能开发，还包括识别和解决可能影响数百万开发者的安全漏洞。我们对 JavaScript 生态系统最重要的贡献之一就是在安全领域。

### Koa-Router 的救援行动 {#the-koa-router-rescue}

2019 年 2 月，Nick 发现了流行的 koa-router 包维护存在的关键问题。正如他在 [Hacker News 上报道](https://news.ycombinator.com/item?id=19156707) 的那样，该包已被原维护者遗弃，安全漏洞未得到修复，社区也没有更新。

> \[!WARNING]
> 被遗弃且存在安全漏洞的包对整个生态系统构成重大风险，尤其是当它们每周被下载数百万次时。

对此，Nick 创建了 [@koa/router](https://github.com/koajs/router)，并帮助社区了解这一情况。从那时起，他一直维护这个关键包，确保 Koa 用户拥有一个安全且维护良好的路由解决方案。

### 解决 ReDoS 漏洞 {#addressing-redos-vulnerabilities}

2020 年，Nick 发现并修复了广泛使用的 `url-regex` 包中的一个关键 [正则表达式拒绝服务（ReDoS）](https://en.wikipedia.org/wiki/ReDoS) 漏洞。该漏洞（[SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)）允许攻击者通过提供特制输入，导致正则表达式发生灾难性回溯，从而引发拒绝服务。

Nick 没有简单地修补现有包，而是创建了 [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe)，这是一个完全重写的实现，解决了漏洞，同时保持与原始 API 的兼容性。他还发布了一篇[全面的博客文章](/blog/docs/url-regex-javascript-node-js)，解释该漏洞及其缓解方法。
这项工作展示了我们的安全方法：不仅仅是修复问题，还包括教育社区并提供强大的替代方案，以防止未来出现类似问题。

### 倡导 Node.js 和 Chromium 安全 {#advocating-for-nodejs-and-chromium-security}

Nick 还积极倡导更广泛生态系统中的安全改进。2020 年 8 月，他发现了 Node.js 在处理 HTTP 头时的一个重大安全问题，该问题被报道在 [The Register](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/)。

该问题源自 Chromium 的一个补丁，可能允许攻击者绕过安全措施。Nick 的倡导帮助确保该问题得到及时解决，保护了数百万 Node.js 应用免受潜在利用。

### 保障 npm 基础设施安全 {#securing-npm-infrastructure}

同月晚些时候，Nick 发现了另一个关键安全问题，这次是在 npm 的电子邮件基础设施中。如 [The Register](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/) 报道，npm 未正确实施 DMARC、SPF 和 DKIM 邮件认证协议，可能允许攻击者发送看似来自 npm 的钓鱼邮件。

Nick 的报告促使 npm 改进了邮件安全态势，保护了依赖 npm 进行包管理的数百万开发者免受潜在钓鱼攻击。

## 我们对 Forward Email 生态系统的贡献 {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email 构建于多个关键开源项目之上，包括 Nodemailer、WildDuck 和 mailauth。我们的团队对这些项目做出了重大贡献，帮助识别并修复影响邮件投递和安全的深层问题。

### 增强 Nodemailer 的核心功能 {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) 是 Node.js 中邮件发送的骨干，我们的贡献帮助其变得更加稳健：

* **SMTP 服务器改进**：我们修复了 SMTP 服务器组件中的解析错误、流处理问题和 TLS 配置问题\[^16]\[^17]。
* **邮件解析器增强**：我们解决了字符序列解码错误和地址解析器问题，这些问题可能导致邮件处理失败\[^18]\[^19]。

这些贡献确保 Nodemailer 依然是 Node.js 应用（包括 Forward Email）邮件处理的可靠基础。

### 推进 Mailauth 的邮件认证 {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) 提供关键的邮件认证功能，我们的贡献显著提升了其能力：

* **DKIM 验证改进**：我们发现并报告了 X/Twitter 的 DNS 缓存问题，导致其外发邮件 DKIM 验证失败，并在 Hacker One 上进行了报告\[^20]。
* **DMARC 和 ARC 增强**：我们修复了 DMARC 和 ARC 验证中的问题，这些问题可能导致认证结果错误\[^21]\[^22]。
* **性能优化**：我们贡献了提升邮件认证流程性能的优化\[^23]\[^24]\[^25]\[^26]。

这些改进有助于确保邮件认证准确可靠，保护用户免受钓鱼和伪造攻击。

### 关键的 Upptime 增强 {#key-upptime-enhancements}

我们对 Upptime 的贡献包括：

* **SSL 证书监控**：我们添加了监控 SSL 证书过期的功能，防止因证书过期导致的意外停机\[^27]。
* **多短信号码支持**：我们实现了在事件发生时通过短信提醒多个团队成员的支持，提升响应速度\[^28]。
* **IPv6 检查修复**：我们修复了 IPv6 连接检查的问题，确保在现代网络环境中更准确的监控\[^29]。
* **暗/亮模式支持**：我们添加了主题支持，改善状态页面的用户体验\[^31]。
* **更好的 TCP-Ping 支持**：我们增强了 TCP ping 功能，提供更可靠的连接测试\[^32]。
这些改进不仅有利于 Forward Email 的状态监控，也对整个 Upptime 用户社区开放，体现了我们致力于改进所依赖工具的承诺。


## 将一切紧密结合的纽带：大规模定制代码 {#the-glue-that-holds-it-all-together-custom-code-at-scale}

虽然我们的 npm 包和对现有项目的贡献非常重要，但真正展示我们技术专长的是将这些组件集成在一起的定制代码。Forward Email 代码库代表了十年的开发努力，始于 2017 年，当时该项目作为 [free-email-forwarding](https://github.com/forwardemail/free-email-forwarding) 启动，后来合并到一个 monorepo 中。

### 巨大的开发投入 {#a-massive-development-effort}

这段定制集成代码的规模令人印象深刻：

* **总贡献次数**：超过 3,217 次提交
* **代码库规模**：超过 421,545 行代码，涵盖 JavaScript、Pug、CSS 和 JSON 文件\[^33]

这代表了数千小时的开发工作、调试过程和性能优化。这是将单个包转变为一个由数千客户每天使用的连贯、可靠服务的“秘密配方”。

### 核心依赖集成 {#core-dependencies-integration}

Forward Email 代码库将众多依赖集成成一个无缝整体：

* **邮件处理**：集成 Nodemailer 用于发送，SMTP Server 用于接收，Mailparser 用于解析
* **身份验证**：使用 Mailauth 进行 DKIM、SPF、DMARC 和 ARC 验证
* **DNS 解析**：利用 Tangerine 实现带有全局缓存的 DNS-over-HTTPS
* **MX 连接**：使用集成了 Tangerine 的 mx-connect 实现可靠的邮件服务器连接
* **任务调度**：采用 Bree 通过工作线程实现可靠的后台任务处理
* **模板引擎**：使用 email-templates 在客户通信中重用网站样式表
* **邮件存储**：采用 better-sqlite3-multiple-ciphers 实现单独加密的 SQLite 邮箱，使用 ChaCha20-Poly1305 加密确保量子安全隐私，保证用户之间完全隔离，且只有用户本人能访问其邮箱

每项集成都需要仔细考虑边缘情况、性能影响和安全问题。最终形成了一个强健的系统，能够可靠地处理数百万封邮件交易。我们的 SQLite 实现还利用 msgpackr 进行高效的二进制序列化，并通过 WebSockets（使用 ws）实现基础设施中的实时状态更新。

### 使用 Tangerine 和 mx-connect 的 DNS 基础设施 {#dns-infrastructure-with-tangerine-and-mx-connect}

Forward Email 基础设施的关键组成部分是我们的 DNS 解析系统，围绕两个关键包构建：

* **[Tangerine](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**：我们的 Node.js DNS-over-HTTPS 实现，提供标准 DNS 解析器的替代方案，内置重试、超时、智能服务器轮换和缓存支持。

* **[mx-connect](https://github.com/zone-eu/mx-connect)**：该包建立与 MX 服务器的 TCP 连接，接受目标域名或电子邮件地址，解析合适的 MX 服务器，并按优先级顺序连接。

我们通过 [pull request #4](https://github.com/zone-eu/mx-connect/pull/4) 将 Tangerine 与 mx-connect 集成，确保 Forward Email 全程使用应用层的 DNS over HTTP 请求。这为大规模 DNS 提供了全球缓存和 1:1 一致性，覆盖任何区域、应用或进程——这是分布式系统中实现可靠邮件投递的关键。


## 企业影响力：从开源到关键任务解决方案 {#enterprise-impact-from-open-source-to-mission-critical-solutions}

我们十年开源开发历程的结晶，使 Forward Email 不仅服务于个人开发者，也服务于构成开源运动支柱的主要企业和教育机构。
### 关键任务电子邮件基础设施案例研究 {#case-studies-in-mission-critical-email-infrastructure}

我们对可靠性、隐私和开源原则的承诺，使 Forward Email 成为具有严格电子邮件需求的组织的可信选择：

* **教育机构**：正如我们在[校友电子邮件转发案例研究](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)中详细介绍的，主要大学依赖我们的基础设施，通过可靠的电子邮件转发服务与数十万校友保持终身联系。

* **企业级 Linux 解决方案**：[Canonical Ubuntu 企业电子邮件案例研究](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)展示了我们的开源方法如何完美契合企业 Linux 提供商的需求，为他们提供所需的透明度和控制权。

* **开源基金会**：也许最具认可意义的是我们与 Linux 基金会的合作，详见[Linux 基金会企业电子邮件案例研究](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)，我们的服务为这个负责 Linux 开发的组织提供通信支持。

我们的开源软件包经过多年精心维护，正是这些软件包让我们能够构建一个电子邮件服务，支持那些倡导开源软件的社区和组织。这一完整的循环——从贡献单个软件包到为开源领导者提供企业级电子邮件基础设施——代表了我们软件开发方法的终极验证。

## 十年开源历程：展望未来 {#a-decade-of-open-source-looking-forward}

回顾十年的开源贡献，展望未来十年，我们满怀感激之情，感谢支持我们工作的社区，也对未来充满期待。

我们从单个软件包贡献者成长为维护被大型企业和开源基金会广泛使用的综合电子邮件基础设施的团队，这一历程非凡。这证明了开源开发的力量，以及周到且维护良好的软件对更广泛生态系统的影响。

未来几年，我们致力于：

* **持续维护和改进现有软件包**，确保它们继续成为全球开发者可靠的工具。
* **扩大对关键基础设施项目的贡献**，特别是在电子邮件和安全领域。
* **增强 Forward Email 的功能**，同时坚持我们的隐私、安全和透明承诺。
* **通过指导、赞助和社区参与支持新一代开源贡献者**。

我们相信软件开发的未来是开放的、协作的，并建立在信任的基础上。通过持续向 JavaScript 生态系统贡献高质量、注重安全的软件包，我们希望为构建这一未来贡献一份力量。

感谢所有使用我们软件包、贡献项目、报告问题或仅仅传播我们工作的朋友。正是有了你们的支持，这十年的影响才成为可能，我们期待未来十年能共同取得更多成就。

\[^1]: cabin 的 npm 下载统计，2025 年 4 月  
\[^2]: bson-objectid 的 npm 下载统计，2025 年 2-3 月  
\[^3]: url-regex-safe 的 npm 下载统计，2025 年 4 月  
\[^4]: forwardemail/forwardemail.net 的 GitHub 星标数，截至 2025 年 4 月  
\[^5]: preview-email 的 npm 下载统计，2025 年 4 月  
\[^7]: superagent 的 npm 下载统计，2025 年 2-3 月  
\[^8]: supertest 的 npm 下载统计，2025 年 2-3 月  
\[^9]: preview-email 的 npm 下载统计，2025 年 2-3 月  
\[^10]: cabin 的 npm 下载统计，2025 年 2-3 月  
\[^11]: url-regex-safe 的 npm 下载统计，2025 年 2-3 月  
\[^12]: spamscanner 的 npm 下载统计，2025 年 2-3 月  
\[^13]: npm 统计的每日下载模式，2025 年 4 月  
\[^14]: npm 统计的每周下载模式，2025 年 4 月  
\[^15]: nodemailer 的 npm 下载统计，2025 年 4 月  
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
\[^26]: <https://github.com/postalsys/mailauth/issues/73>  
\[^27]: 基于 Upptime 仓库的 GitHub 问题  
\[^28]: 基于 Upptime 仓库的 GitHub 问题  
\[^29]: 基于 Upptime 仓库的 GitHub 问题  
\[^30]: bree 的 npm 下载统计，2025 年 2-3 月  
\[^31]: 基于 Upptime 的 GitHub 拉取请求  
\[^32]: 基于 Upptime 的 GitHub 拉取请求  
\[^34]: koa 的 npm 下载统计，2025 年 2-3 月  
\[^35]: @koa/router 的 npm 下载统计，2025 年 2-3 月  
\[^36]: koa-router 的 npm 下载统计，2025 年 2-3 月  
\[^37]: url-regex 的 npm 下载统计，2025 年 2-3 月  
\[^38]: @breejs/later 的 npm 下载统计，2025 年 2-3 月  
\[^39]: email-templates 的 npm 下载统计，2025 年 2-3 月  
\[^40]: get-paths 的 npm 下载统计，2025 年 2-3 月  
\[^41]: dotenv-parse-variables 的 npm 下载统计，2025 年 2-3 月  
\[^42]: @koa/multer 的 npm 下载统计，2025 年 2-3 月
