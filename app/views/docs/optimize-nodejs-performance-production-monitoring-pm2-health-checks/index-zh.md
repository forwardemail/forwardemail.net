# 如何优化 Node.js 生产基础设施：最佳实践 {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />

## 目录 {#table-of-contents}

* [前言](#foreword)
* [我们的单核性能优化革命达到 573%](#our-573-single-core-performance-optimization-revolution)
  * [为什么单核性能优化对 Node.js 如此重要](#why-single-core-performance-optimization-matters-for-nodejs)
  * [相关内容](#related-content)
* [Node.js 生产环境设置：我们的技术栈](#nodejs-production-environment-setup-our-technology-stack)
  * [包管理器：pnpm，提高生产效率](#package-manager-pnpm-for-production-efficiency)
  * [Web 框架：用于现代 Node.js 生产的 Koa](#web-framework-koa-for-modern-nodejs-production)
  * [后台作业处理：Bree 实现生产可靠性](#background-job-processing-bree-for-production-reliability)
  * [错误处理：@hapi/boom 实现生产可靠性](#error-handling-hapiboom-for-production-reliability)
* [如何在生产环境中监控 Node.js 应用程序](#how-to-monitor-nodejs-applications-in-production)
  * [系统级 Node.js 生产监控](#system-level-nodejs-production-monitoring)
  * [Node.js 生产环境的应用程序级监控](#application-level-monitoring-for-nodejs-production)
  * [特定应用监控](#application-specific-monitoring)
* [使用 PM2 健康检查进行 Node.js 生产监控](#nodejs-production-monitoring-with-pm2-health-checks)
  * [我们的PM2健康检查系统](#our-pm2-health-check-system)
  * [我们的PM2生产配置](#our-pm2-production-configuration)
  * [自动 PM2 部署](#automated-pm2-deployment)
* [生产错误处理和分类系统](#production-error-handling-and-classification-system)
  * [我们的 isCodeBug 生产实现](#our-iscodebug-implementation-for-production)
  * [与我们的生产记录集成](#integration-with-our-production-logging)
  * [相关内容](#related-content-1)
* [使用 v8-profiler-next 和 cpupro 进行高级性能调试](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [我们针对 Node.js 生产的分析方法](#our-profiling-approach-for-nodejs-production)
  * [我们如何实现堆快照分析](#how-we-implement-heap-snapshot-analysis)
  * [性能调试工作流程](#performance-debugging-workflow)
  * [Node.js 应用程序的推荐实现](#recommended-implementation-for-your-nodejs-application)
  * [与我们的生产监控集成](#integration-with-our-production-monitoring)
* [Node.js 生产基础设施安全](#nodejs-production-infrastructure-security)
  * [Node.js 生产的系统级安全性](#system-level-security-for-nodejs-production)
  * [Node.js 应用程序的应用程序安全性](#application-security-for-nodejs-applications)
  * [基础设施安全自动化](#infrastructure-security-automation)
  * [我们的安全内容](#our-security-content)
* [Node.js 应用程序的数据库架构](#database-architecture-for-nodejs-applications)
  * [Node.js 生产的 SQLite 实现](#sqlite-implementation-for-nodejs-production)
  * [Node.js 生产的 MongoDB 实现](#mongodb-implementation-for-nodejs-production)
* [Node.js 生产后台作业处理](#nodejs-production-background-job-processing)
  * [我们的 Bree 服务器生产设置](#our-bree-server-setup-for-production)
  * [生产作业示例](#production-job-examples)
  * [Node.js 生产环境的作业调度模式](#our-job-scheduling-patterns-for-nodejs-production)
* [生产 Node.js 应用程序的自动维护](#automated-maintenance-for-production-nodejs-applications)
  * [我们的清理实施](#our-cleanup-implementation)
  * [Node.js 生产的磁盘空间管理](#disk-space-management-for-nodejs-production)
  * [基础设施维护自动化](#infrastructure-maintenance-automation)
* [Node.js 生产部署实施指南](#nodejs-production-deployment-implementation-guide)
  * [研究我们的实际代码以获得生产最佳实践](#study-our-actual-code-for-production-best-practices)
  * [从我们的博客文章中学习](#learn-from-our-blog-posts)
  * [Node.js 生产的基础设施自动化](#infrastructure-automation-for-nodejs-production)
  * [我们的案例研究](#our-case-studies)
* [结论：Node.js 生产部署最佳实践](#conclusion-nodejs-production-deployment-best-practices)
* [Node.js 生产的完整资源列表](#complete-resource-list-for-nodejs-production)
  * [我们的核心实施文件](#our-core-implementation-files)
  * [我们的服务器实现](#our-server-implementations)
  * [我们的基础设施自动化](#our-infrastructure-automation)
  * [我们的技术博客文章](#our-technical-blog-posts)
  * [我们的企业案例研究](#our-enterprise-case-studies)

## 前言 {#foreword}

在 Forward Email，我们花费了数年时间完善 Node.js 生产环境的搭建。本指南全面分享了我们久经考验的 Node.js 生产部署最佳实践，重点介绍性能优化、监控以及我们在扩展 Node.js 应用程序以处理每日数百万笔交易过程中积累的经验教训。

## 我们 573% 的单核性能优化革命 {#our-573-single-core-performance-optimization-revolution}

当我们从 Intel 处理器迁移到 AMD Ryzen 处理器后，我们的 Node.js 应用程序的性能提升了 573%。这不仅仅是一个小小的优化，它从根本上改变了我们的 Node.js 应用程序在生产环境中的表现，并证明了单核性能优化对于任何 Node.js 应用程序的重要性。

> \[!TIP]
> 对于 Node.js 生产部署的最佳实践，硬件选择至关重要。我们特意选择了 DataPacket 托管服务，因为他们支持 AMD Ryzen 处理器，因为 JavaScript 执行是单线程的，所以单核性能对于 Node.js 应用程序至关重要。

### 为什么单核性能优化对 Node.js 如此重要 {#why-single-core-performance-optimization-matters-for-nodejs}

我们从 Intel 迁移到 AMD Ryzen 的结果是：

* 请求处理性能提升 573%**（详情请参阅 [我们状态页面的 GitHub Issue #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **消除处理延迟**，实现近乎即时的响应（在 [GitHub Issue #298](https://github.com/forwardemail/forwardemail.net/issues/298)) 中提及）
* **为 Node.js 生产环境提供更佳的性价比**
* **缩短了所有应用程序端点的响应时间**

性能提升如此显著，以至于我们现在认为 AMD Ryzen 处理器对于任何重要的 Node.js 生产部署都至关重要，无论您运行的是 Web 应用程序、API、微服务还是任何其他 Node.js 工作负载。

### 相关内容 {#related-content}

有关我们基础设施选择的更多详情，请查看：

* [最佳电子邮件转发服务]](https://forwardemail.net/blog/docs/best-email-forwarding-service) - 性能对比
* [自托管解决方案](https://forwardemail.net/blog/docs/self-hosted-solution) - 硬件推荐

## Node.js 生产环境设置：我们的技术栈 {#nodejs-production-environment-setup-our-technology-stack}

我们的 Node.js 生产部署最佳实践包含基于多年生产经验的精心技术选择。以下是我们使用的技术以及这些选择适用于任何 Node.js 应用程序的原因：

### 软件包管理器：用于提高生产效率的 pnpm {#package-manager-pnpm-for-production-efficiency}

**我们使用的内容：** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)（固定版本）

我们选择 pnpm 而不是 npm 和 yarn 作为我们的 Node.js 生产环境设置，因为：

* CI/CD 流水线中的 **安装速度更快**
* 通过硬链接节省磁盘空间**
* 严格的依赖解析，防止幻影依赖
* 生产部署中的 **性能更佳**

> \[!NOTE]
> 作为 Node.js 生产部署最佳实践的一部分，我们固定了 pnpm 等关键工具的精确版本，以确保所有环境和团队成员机器上的行为一致。

**实施细节：**

* [我们的 package.json 配置](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [我们的 NPM 生态系统博客文章](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Web 框架：用于现代 Node.js 生产的 Koa {#web-framework-koa-for-modern-nodejs-production}

**我们使用的内容：**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

我们选择 Koa 而非 Express 作为 Node.js 生产基础架构，是因为它拥有先进的 async/await 支持和更简洁的中间件组合。我们的创始人 Nick Baugh 曾为 Express 和 Koa 做出过贡献，这让我们对这两个框架的生产应用有了深入的了解。

无论您构建的是 REST API、GraphQL 服务器、Web 应用程序还是微服务，这些模式都适用。

**我们的实施示例：**

* [Web 服务器设置](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API 服务器配置](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [联系表单实施指南](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### 后台作业处理：Bree 用于生产可靠性 {#background-job-processing-bree-for-production-reliability}

**我们使用：**[`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) 调度程序

我们创建并维护 Bree 是因为现有的作业调度程序无法满足我们在 Node.js 生产环境中对工作线程支持和现代 JavaScript 特性的需求。这适用于任何需要后台处理、计划任务或工作线程的 Node.js 应用程序。

**我们的实施示例：**

* [Bree 服务器设置](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [我们所有的职位定义](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [PM2健康检查工作](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [清理工作实施](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### 错误处理：@hapi/boom 用于生产可靠性 {#error-handling-hapiboom-for-production-reliability}

**我们使用的内容：** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

我们在整个 Node.js 生产应用程序中使用 @hapi/boom 来构建结构化的错误响应。此模式适用于任何需要一致错误处理的 Node.js 应用程序。

**我们的实施示例：**

* [错误分类助手](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [记录器实现](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## 如何在生产环境中监控 Node.js 应用程序 {#how-to-monitor-nodejs-applications-in-production}

我们在生产环境中监控 Node.js 应用程序的方法，是经过多年大规模运行应用程序的经验积累而不断演变的。我们实施多层监控，以确保任何类型的 Node.js 应用程序的可靠性和性能。

### 系统级 Node.js 生产监控 {#system-level-nodejs-production-monitoring}

**我们的核心实现：** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**我们使用的内容：** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

我们的生产监控阈值（来自我们的实际生产代码）：

* **2GB 堆大小限制**，并自动发出警报
* **25% 内存使用率** 警告阈值
* **80% CPU 使用率** 警告阈值
* **75% 磁盘使用率** 警告阈值

> \[!WARNING]
> 这些阈值适用于我们特定的硬件配置。在实施 Node.js 生产监控时，请查看我们的 Monitor-server.js 实现，以了解确切的逻辑并根据您的设置调整值。

### Node.js 生产环境的应用级监控 {#application-level-monitoring-for-nodejs-production}

**我们的错误分类：** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

此帮助程序区分：

* 需要立即关注的**实际代码错误**
* 预期行为的**用户错误**
* 我们无法控制的**外部服务故障**

此模式适用于任何 Node.js 应用程序 - Web 应用程序、API、微服务或后台服务。

**我们的日志记录实现：** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

我们实施全面的字段编辑来保护敏感信息，同时在我们的 Node.js 生产环境中保持有用的调试功能。

### 应用程序特定监控 {#application-specific-monitoring}

**我们的服务器实现：**

* [SMTP 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**队列监控**：我们实施 5GB 的队列限制和 180 秒的请求处理超时，以防止资源耗尽。这些模式适用于任何具有队列或后台处理的 Node.js 应用程序。

## 使用 PM2 健康检查进行 Node.js 生产监控 {#nodejs-production-monitoring-with-pm2-health-checks}

凭借多年的生产经验，我们利用 PM2 完善了 Node.js 生产环境的设置。PM2 健康检查对于维护任何 Node.js 应用程序的可靠性至关重要。

### 我们的 PM2 健康检查系统 {#our-pm2-health-check-system}

**我们的核心实现：** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

我们通过 PM2 健康检查进行 Node.js 生产监控包括：

* **通过 cron 调度每 20 分钟运行一次**
* **至少需要 15 分钟的正常运行时间**，才能认定进程健康
* **验证进程状态和内存使用情况**
* **自动重启失败的进程**
* **通过智能健康检查防止循环重启**

> \[!CAUTION]
> 根据 Node.js 生产部署的最佳实践，我们需要进程正常运行时间超过 15 分钟，才能将其视为健康进程，以避免出现重启循环。这可以防止进程在遇到内存或其他问题时发生级联故障。

### 我们的 PM2 生产配置 {#our-pm2-production-configuration}

**我们的生态系统设置：**研究我们的服务器启动文件以进行 Node.js 生产环境设置：

* [Web 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree 调度程序](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

无论您运行的是 Express 应用程序、Koa 服务器、GraphQL API 还是任何其他 Node.js 应用程序，这些模式都适用。

### 自动 PM2 部署 {#automated-pm2-deployment}

**PM2 部署：** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

我们通过 Ansible 自动化整个 PM2 设置，以确保所有服务器上的 Node.js 生产部署保持一致。

## 生产错误处理和分类系统 {#production-error-handling-and-classification-system}

我们最有价值的 Node.js 生产部署最佳实践之一是适用于任何 Node.js 应用程序的智能错误分类：

### 我们的 isCodeBug 生产实现 {#our-iscodebug-implementation-for-production}

**来源：**[`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

此帮助程序为生产中的 Node.js 应用程序提供智能错误分类，以便：

* **优先处理实际错误**，而非用户错误
* **通过关注实际问题来改进我们的事件响应**
* **减少预期用户错误导致的警报疲劳**
* **更好地理解**应用程序而非用户生成的问题

此模式适用于任何 Node.js 应用程序 - 无论您是构建电子商务网站、SaaS 平台、API 还是微服务。

### 与我们的生产日志集成 {#integration-with-our-production-logging}

**我们的记录器集成：** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

我们的记录器使用 `isCodeBug` 来确定警报级别和字段编辑，确保我们收到有关实际问题的通知，同时过滤掉 Node.js 生产环境中的噪音。

### 相关内容 {#related-content-1}

了解有关我们的错误处理模式的更多信息：

* [建立可靠的支付系统](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - 错误处理模式
* [电子邮件隐私保护](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - 安全错误处理

## 使用 v8-profiler-next 和 cpupro 进行高级性能调试 {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

我们使用高级性能分析工具来分析堆快照，并调试生产环境中的 OOM（内存溢出）问题、性能瓶颈以及 Node.js 内存问题。这些工具对于任何遇到内存泄漏或性能问题的 Node.js 应用程序都至关重要。

### 我们针对 Node.js 生产的分析方法 {#our-profiling-approach-for-nodejs-production}

**我们推荐的工具：**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - 用于生成堆快照和 CPU 配置文件
* [`cpupro`](https://github.com/discoveryjs/cpupro) - 用于分析 CPU 配置文件和堆快照

> \[!TIP]
> 我们结合使用 v8-profiler-next 和 cpupro，为 Node.js 应用程序创建了一套完整的性能调试工作流程。这种组合有助于我们识别内存泄漏、性能瓶颈，并优化生产代码。

### 我们如何实现堆快照分析 {#how-we-implement-heap-snapshot-analysis}

**我们的监控实现：** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

我们的生产监控功能包括在内存超过阈值时自动生成堆快照。这有助于我们在 OOM 问题导致应用程序崩溃之前进行调试。

**关键实施模式：**

* **当堆大小超过 2GB 阈值时自动创建快照**
* **基于信号的分析**，用于生产环境中的按需分析
* **保留策略**，用于管理快照存储
* **与我们的清理作业集成**，用于自动维护

### 性能调试工作流程 {#performance-debugging-workflow}

**研究我们的实际实施：**

* [监控服务器实施](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - 堆监控和快照生成
* [清理工作](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - 快照保留和清理
* [记录器集成](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - 性能日志

### 推荐用于您的 Node.js 应用程序的实现 {#recommended-implementation-for-your-nodejs-application}

**对于堆快照分析：**

1. **安装 v8-profiler-next** 用于生成快照
2. **使用 cpupro** 分析生成的快照
3. **实现监控阈值**，类似于我们的monitor-server.js
4. **设置自动清理** 来管理快照存储
5. **创建信号处理程序** 用于在生产环境中进行按需分析

**对于 CPU 分析：**

1. 在高负载期间生成 CPU 性能分析数据
2. 使用 cpupro 进行分析以识别瓶颈
3. 关注热点路径和优化机会
4. 监控性能改进前后的变化

> \[!WARNING]
> 生成堆快照和 CPU 配置文件可能会影响性能。我们建议实施限制，并且仅在调查特定问题或维护期间启用配置文件。

### 与我们的生产监控集成 {#integration-with-our-production-monitoring}

我们的分析工具与我们更广泛的监控策略相结合：

* **基于内存/CPU 阈值自动触发**
* **检测到性能问题时集成警报**
* **历史分析**，用于跟踪随时间推移的性能趋势
* **与应用程序指标关联**，用于全面调试

这种方法帮助我们识别和解决内存泄漏，优化热代码路径，并在 Node.js 生产环境中保持稳定的性能。

## Node.js 生产基础设施安全 {#nodejs-production-infrastructure-security}

我们通过 Ansible 自动化为 Node.js 生产基础架构实施全面的安全保护。以下实践适用于任何 Node.js 应用程序：

### Node.js 生产的系统级安全性 {#system-level-security-for-nodejs-production}

**我们的 Ansible 实现：** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

我们针对 Node.js 生产环境采取的主要安全措施：

* **禁用交换分区**，以防止敏感数据写入磁盘
* **禁用核心转储**，以防止包含敏感信息的内存转储
* **阻止 USB 存储设备**，以防止未经授权的数据访问
* **调整内核参数**，兼顾安全性和性能

> \[!WARNING]
> 在实施 Node.js 生产部署最佳实践时，如果您的应用程序超出可用内存，禁用交换空间可能会导致内存不足导致应用程序终止。我们会仔细监控内存使用情况，并适当调整服务器大小。

### Node.js 应用程序的应用程序安全性 {#application-security-for-nodejs-applications}

**我们的日志字段编辑：** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

我们从日志中删除了敏感字段，包括密码、令牌、API 密钥和个人信息。这不仅保护了用户隐私，还确保在任何 Node.js 生产环境中都能进行调试。

### 基础设施安全自动化 {#infrastructure-security-automation}

**我们为 Node.js 生产环境完成的 Ansible 设置：**

* [安全策略](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [SSH 密钥管理](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [证书管理](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [DKIM 设置](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### 我们的安全内容 {#our-security-content}

详细了解我们的安全方法：

* [最佳安全审计公司](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [量子安全加密电子邮件](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [为何选择开源电子邮件安全](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## Node.js 应用程序的数据库架构 {#database-architecture-for-nodejs-applications}

我们使用针对 Node.js 应用程序优化的混合数据库方法。这些模式可适用于任何 Node.js 应用程序：

### Node.js 生产的 SQLite 实现 {#sqlite-implementation-for-nodejs-production}

**我们使用的内容：**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**我们的配置：** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

我们在 Node.js 应用程序中使用 SQLite 来存储用户特定数据，因为它提供：

* **按用户/租户进行数据隔离**
* **单用户查询性能更佳**
* **简化备份**和迁移
* **与共享数据库相比，**降低复杂性**

此模式适用于 SaaS 应用程序、多租户系统或任何需要数据隔离的 Node.js 应用程序。

### 用于 Node.js 生产的 MongoDB 实现 {#mongodb-implementation-for-nodejs-production}

**我们使用的内容：**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**我们的设置实现：** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**我们的配置：** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

我们在 Node.js 生产环境中使用 MongoDB 来存储应用程序数据，因为它提供：

* **灵活的模式**，适用于不断变化的数据结构
* **更佳的复杂查询性能**
* **水平扩展**功能
* **丰富的查询语言**

> \[!NOTE]
> 我们的混合方法针对特定用例进行了优化。请研究代码库中实际的数据库使用模式，以了解此方法是否适合您的 Node.js 应用程序需求。

## Node.js 生产后台作业处理 {#nodejs-production-background-job-processing}

我们围绕 Bree 构建了后台作业架构，以实现可靠的 Node.js 生产部署。这适用于任何需要后台处理的 Node.js 应用程序：

### 我们的 Bree 服务器生产设置 {#our-bree-server-setup-for-production}

**我们的主要实现：** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**我们的 Ansible 部署：** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### 生产作业示例 {#production-job-examples}

**健康监测：** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**清理自动化：** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**我们所有的工作：** [浏览我们的完整职位目录](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

这些模式适用于需要以下功能的任何 Node.js 应用程序：

* 计划任务（数据处理、报告、清理）
* 后台处理（图像大小调整、电子邮件发送、数据导入）
* 健康监测与维护
* CPU 密集型任务的工作线程利用率

### 我们用于 Node.js 生产环境的作业调度模式 {#our-job-scheduling-patterns-for-nodejs-production}

研究我们的作业目录中的实际作业调度模式，以了解：

* 我们如何在 Node.js 生产环境中实现类似 cron 的调度
* 我们的错误处理和重试逻辑
* 我们如何使用工作线程执行 CPU 密集型任务

## 生产 Node.js 应用程序的自动维护 {#automated-maintenance-for-production-nodejs-applications}

我们实施主动维护，以防止常见的 Node.js 生产问题。以下模式适用于任何 Node.js 应用程序：

### 我们的清理实施 {#our-cleanup-implementation}

**来源：**[`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

我们对 Node.js 生产应用程序的自动化维护目标是：

* 超过 24 小时的临时文件
* 超出保留期限的日志文件
* 缓存文件和临时数据
* 不再需要的已上传文件
* 性能调试中的堆快照

这些模式适用于生成临时文件、日志或缓存数据的任何 Node.js 应用程序。

### Node.js 生产环境的磁盘空间管理 {#disk-space-management-for-nodejs-production}

**我们的监控阈值：** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* 后台处理的队列限制
* 75% 磁盘使用率警告阈值
* 超过阈值时自动清理

### 基础设施维护自动化 {#infrastructure-maintenance-automation}

**我们用于 Node.js 生产的 Ansible 自动化：**

* [环境部署](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [部署密钥管理](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## Node.js 生产部署实施指南 {#nodejs-production-deployment-implementation-guide}

### 研究我们的实际代码以获得生产最佳实践 {#study-our-actual-code-for-production-best-practices}

**从这些关键文件开始设置 Node.js 生产环境：**

1. **配置**：[`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **监控**：[`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **错误处理**：[`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **日志记录**：[`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **进程健康**：[`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### 从我们的博客文章中学习{#learn-from-our-blog-posts}

**我们针对 Node.js 生产的技术实施指南：**

* [NPM 软件包生态系统](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [建立支付系统](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [电子邮件隐私实施](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript 联系表单](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React 电子邮件集成](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Node.js 生产基础设施自动化 {#infrastructure-automation-for-nodejs-production}

**我们用于 Node.js 生产部署的 Ansible 剧本：**

* [完整的剧本目录](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [安全强化](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js 设置](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### 我们的案例研究 {#our-case-studies}

**我们的企业实施：**

* [Linux 基金会案例研究](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu 案例研究](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [校友电子邮件转发](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## 结论：Node.js 生产部署最佳实践 {#conclusion-nodejs-production-deployment-best-practices}

我们的 Node.js 生产基础设施证明 Node.js 应用程序可以通过以下方式实现企业级可靠性：

* **久经考验的硬件选择**（AMD Ryzen 处理器，单核性能优化 573%）
* **久经考验的 Node.js 生产监控**，具有特定阈值和自动响应功能
* **智能错误分类**，可提升生产环境中的事件响应能力
* **使用 v8-profiler-next 和 cpupro 进行高级性能调试**，可预防 OOM
* **通过 Ansible 自动化进行全面的安全加固**
* **混合数据库架构**，针对应用需求进行了优化
* **自动化维护**，可预防常见的 Node.js 生产问题

**关键要点**：研究我们实际的实现文件和博客文章，而不是遵循通用的最佳实践。我们的代码库为 Node.js 生产部署提供了实际的模式，可以适用于任何 Node.js 应用程序 - Web 应用、API、微服务或后台服务。

## Node.js 生产的完整资源列表 {#complete-resource-list-for-nodejs-production}

### 我们的核心实施文件 {#our-core-implementation-files}

* [主要配置](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [包依赖项](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [服务器监控](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [错误分类](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [日志系统](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [PM2 健康检查](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [自动清理](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### 我们的服务器实现 {#our-server-implementations}

* [Web 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree 调度程序](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### 我们的基础设施自动化 {#our-infrastructure-automation}

* [我们所有的 Ansible 剧本](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [安全强化](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js 设置](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [数据库配置](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### 我们的技术博客文章 {#our-technical-blog-posts}

* [NPM生态系统分析](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [支付系统实施](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [电子邮件隐私技术指南](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript 联系表单](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React 电子邮件集成](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [自托管解决方案指南](https://forwardemail.net/blog/docs/self-hosted-solution)

### 我们的企业案例研究 {#our-enterprise-case-studies}

* [Linux 基金会实施](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu 案例研究](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [联邦政府合规](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [校友电子邮件系统](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)