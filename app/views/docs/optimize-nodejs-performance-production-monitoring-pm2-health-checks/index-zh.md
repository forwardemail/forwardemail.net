# 如何优化 Node.js 生产基础设施：最佳实践 {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js 性能优化指南" class="rounded-lg" />


## 目录 {#table-of-contents}

* [前言](#foreword)
* [我们 573% 单核性能优化革命](#our-573-single-core-performance-optimization-revolution)
  * [为什么单核性能优化对 Node.js 很重要](#why-single-core-performance-optimization-matters-for-nodejs)
  * [相关内容](#related-content)
* [Node.js 生产环境搭建：我们的技术栈](#nodejs-production-environment-setup-our-technology-stack)
  * [包管理器：pnpm 提升生产效率](#package-manager-pnpm-for-production-efficiency)
  * [Web 框架：Koa 适用于现代 Node.js 生产](#web-framework-koa-for-modern-nodejs-production)
  * [后台任务处理：Bree 保证生产可靠性](#background-job-processing-bree-for-production-reliability)
  * [错误处理：@hapi/boom 保证生产可靠性](#error-handling-hapiboom-for-production-reliability)
* [如何监控生产中的 Node.js 应用](#how-to-monitor-nodejs-applications-in-production)
  * [系统级 Node.js 生产监控](#system-level-nodejs-production-monitoring)
  * [应用级 Node.js 生产监控](#application-level-monitoring-for-nodejs-production)
  * [应用专属监控](#application-specific-monitoring)
* [使用 PM2 健康检查进行 Node.js 生产监控](#nodejs-production-monitoring-with-pm2-health-checks)
  * [我们的 PM2 健康检查系统](#our-pm2-health-check-system)
  * [我们的 PM2 生产配置](#our-pm2-production-configuration)
  * [自动化 PM2 部署](#automated-pm2-deployment)
* [生产错误处理与分类系统](#production-error-handling-and-classification-system)
  * [我们针对生产的 isCodeBug 实现](#our-iscodebug-implementation-for-production)
  * [与我们的生产日志集成](#integration-with-our-production-logging)
  * [相关内容](#related-content-1)
* [使用 v8-profiler-next 和 cpupro 进行高级性能调试](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [我们针对 Node.js 生产的性能分析方法](#our-profiling-approach-for-nodejs-production)
  * [我们如何实现堆快照分析](#how-we-implement-heap-snapshot-analysis)
  * [性能调试工作流程](#performance-debugging-workflow)
  * [推荐给您的 Node.js 应用的实现方案](#recommended-implementation-for-your-nodejs-application)
  * [与我们的生产监控集成](#integration-with-our-production-monitoring)
* [Node.js 生产基础设施安全](#nodejs-production-infrastructure-security)
  * [系统级 Node.js 生产安全](#system-level-security-for-nodejs-production)
  * [Node.js 应用安全](#application-security-for-nodejs-applications)
  * [基础设施安全自动化](#infrastructure-security-automation)
  * [我们的安全内容](#our-security-content)
* [Node.js 应用的数据库架构](#database-architecture-for-nodejs-applications)
  * [Node.js 生产的 SQLite 实现](#sqlite-implementation-for-nodejs-production)
  * [Node.js 生产的 MongoDB 实现](#mongodb-implementation-for-nodejs-production)
* [Node.js 生产后台任务处理](#nodejs-production-background-job-processing)
  * [我们的 Bree 服务器生产配置](#our-bree-server-setup-for-production)
  * [生产任务示例](#production-job-examples)
  * [我们针对 Node.js 生产的任务调度模式](#our-job-scheduling-patterns-for-nodejs-production)
* [生产 Node.js 应用的自动化维护](#automated-maintenance-for-production-nodejs-applications)
  * [我们的清理实现](#our-cleanup-implementation)
  * [Node.js 生产的磁盘空间管理](#disk-space-management-for-nodejs-production)
  * [基础设施维护自动化](#infrastructure-maintenance-automation)
* [Node.js 生产部署实施指南](#nodejs-production-deployment-implementation-guide)
  * [学习我们的实际代码以掌握生产最佳实践](#study-our-actual-code-for-production-best-practices)
  * [从我们的博客文章中学习](#learn-from-our-blog-posts)
  * [Node.js 生产的基础设施自动化](#infrastructure-automation-for-nodejs-production)
  * [我们的案例研究](#our-case-studies)
* [总结：Node.js 生产部署最佳实践](#conclusion-nodejs-production-deployment-best-practices)
* [Node.js 生产的完整资源列表](#complete-resource-list-for-nodejs-production)
  * [我们的核心实现文件](#our-core-implementation-files)
  * [我们的服务器实现](#our-server-implementations)
  * [我们的基础设施自动化](#our-infrastructure-automation)
  * [我们的技术博客文章](#our-technical-blog-posts)
  * [我们的企业案例研究](#our-enterprise-case-studies)
## 前言 {#foreword}

在 Forward Email，我们花费多年时间完善我们的 Node.js 生产环境设置。本综合指南分享了我们经过实战验证的 Node.js 生产部署最佳实践，重点关注性能优化、监控，以及我们在扩展 Node.js 应用以处理每日数百万交易时所学到的经验教训。

## 我们的 573% 单核性能优化革命 {#our-573-single-core-performance-optimization-revolution}

当我们从 Intel 迁移到 AMD Ryzen 处理器时，我们的 Node.js 应用实现了 **573% 的性能提升**。这不仅仅是一次小幅优化——它从根本上改变了我们 Node.js 应用在生产环境中的表现，并展示了单核性能优化对任何 Node.js 应用的重要性。

> \[!TIP]
> 对于 Node.js 生产部署最佳实践，硬件选择至关重要。我们特别选择了 DataPacket 托管服务，因为他们提供 AMD Ryzen 处理器，单核性能对 Node.js 应用至关重要，因为 JavaScript 执行是单线程的。

### 为什么单核性能优化对 Node.js 很重要 {#why-single-core-performance-optimization-matters-for-nodejs}

我们从 Intel 迁移到 AMD Ryzen 带来了：

* 请求处理性能提升 **573%**（记录于 [我们的状态页面 GitHub Issue #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671)）
* 处理延迟几乎消除，实现近乎即时响应（提及于 [GitHub Issue #298](https://github.com/forwardemail/forwardemail.net/issues/298)）
* Node.js 生产环境的性价比更高
* 我们所有应用端点的响应时间均有所改善

性能提升如此显著，以至于我们现在认为 AMD Ryzen 处理器是任何严肃的 Node.js 生产部署的必备，无论你运行的是 Web 应用、API、微服务还是任何其他 Node.js 工作负载。

### 相关内容 {#related-content}

有关我们基础设施选择的更多细节，请查看：

* [最佳邮件转发服务](https://forwardemail.net/blog/docs/best-email-forwarding-service) - 性能对比
* [自托管解决方案](https://forwardemail.net/blog/docs/self-hosted-solution) - 硬件推荐

## Node.js 生产环境设置：我们的技术栈 {#nodejs-production-environment-setup-our-technology-stack}

我们的 Node.js 生产部署最佳实践包括基于多年生产经验的深思熟虑的技术选择。以下是我们使用的技术及其适用于任何 Node.js 应用的原因：

### 包管理器：pnpm 提升生产效率 {#package-manager-pnpm-for-production-efficiency}

**我们使用：** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)（固定版本）

我们选择 pnpm 而非 npm 和 yarn 用于 Node.js 生产环境设置，原因包括：

* CI/CD 流水线中 **更快的安装速度**
* 通过硬链接实现的 **磁盘空间效率**
* **严格的依赖解析**，防止虚假依赖
* 生产部署中的 **更好性能**

> \[!NOTE]
> 作为我们 Node.js 生产部署最佳实践的一部分，我们固定关键工具如 pnpm 的确切版本，以确保所有环境和团队成员机器上的行为一致。

**实现细节：**

* [我们的 package.json 配置](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [我们的 NPM 生态系统博客文章](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Web 框架：Koa 适用于现代 Node.js 生产 {#web-framework-koa-for-modern-nodejs-production}

**我们使用：**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
我们选择 Koa 而非 Express 作为我们的 Node.js 生产基础设施，是因为它对现代 async/await 的支持以及更清晰的中间件组合。我们的创始人 Nick Baugh 曾为 Express 和 Koa 两者做出贡献，这让我们对这两个框架在生产环境中的使用有深入的了解。

无论你是在构建 REST API、GraphQL 服务器、Web 应用还是微服务，这些模式都适用。

**我们的实现示例：**

* [Web 服务器设置](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API 服务器配置](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [联系表单实现指南](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### 后台作业处理：用于生产可靠性的 Bree {#background-job-processing-bree-for-production-reliability}

**我们使用：** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) 调度器

我们创建并维护 Bree，是因为现有的作业调度器无法满足我们对工作线程支持和现代 JavaScript 特性的需求，适用于任何需要后台处理、定时任务或工作线程的 Node.js 应用。

**我们的实现示例：**

* [Bree 服务器设置](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [我们所有的作业定义](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [PM2 健康检查作业](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [清理作业实现](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### 错误处理：用于生产可靠性的 @hapi/boom {#error-handling-hapiboom-for-production-reliability}

**我们使用：** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

我们在整个 Node.js 生产应用中使用 @hapi/boom 来实现结构化错误响应。该模式适用于任何需要一致错误处理的 Node.js 应用。

**我们的实现示例：**

* [错误分类辅助](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [日志记录实现](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)


## 如何监控生产环境中的 Node.js 应用 {#how-to-monitor-nodejs-applications-in-production}

我们对生产环境中 Node.js 应用的监控方法，是经过多年大规模运行应用的经验演变而来。我们在多个层面实施监控，以确保任何类型的 Node.js 应用的可靠性和性能。

### 系统级 Node.js 生产监控 {#system-level-nodejs-production-monitoring}

**我们的核心实现：** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**我们使用：** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

我们的生产监控阈值（来自我们的实际生产代码）：

* **2GB 堆大小限制**，带自动警报
* **25% 内存使用率** 警告阈值
* **80% CPU 使用率** 警报阈值
* **75% 磁盘使用率** 警告阈值

> \[!WARNING]
> 这些阈值适用于我们特定的硬件配置。在实现 Node.js 生产监控时，请查看我们的 monitor-server.js 实现，了解具体逻辑并根据你的环境调整数值。

### 应用级 Node.js 生产监控 {#application-level-monitoring-for-nodejs-production}

**我们的错误分类：** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

该辅助区分：

* **实际代码错误**，需要立即关注
* **用户错误**，属于预期行为
* **外部服务故障**，我们无法控制

该模式适用于任何 Node.js 应用——Web 应用、API、微服务或后台服务。
**我们的日志实现：** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

我们在 Node.js 生产环境中实现了全面的字段脱敏，以保护敏感信息，同时保持有用的调试能力。

### 应用特定监控 {#application-specific-monitoring}

**我们的服务器实现：**

* [SMTP 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**队列监控：** 我们实现了 5GB 队列限制和 180 秒请求处理超时，以防止资源耗尽。这些模式适用于任何具有队列或后台处理的 Node.js 应用。

## 使用 PM2 健康检查的 Node.js 生产监控 {#nodejs-production-monitoring-with-pm2-health-checks}

经过多年生产经验，我们完善了基于 PM2 的 Node.js 生产环境设置。我们的 PM2 健康检查对于维护任何 Node.js 应用的可靠性至关重要。

### 我们的 PM2 健康检查系统 {#our-pm2-health-check-system}

**我们的核心实现：** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

我们的 Node.js 生产监控结合 PM2 健康检查包括：

* **每 20 分钟运行一次**，通过 cron 调度
* **要求至少 15 分钟的正常运行时间**，才视为进程健康
* **验证进程状态和内存使用情况**
* **自动重启失败的进程**
* **通过智能健康检查防止重启循环**

> \[!CAUTION]
> 关于 Node.js 生产部署最佳实践，我们要求进程至少运行 15 分钟后才视为健康，以避免重启循环。这防止了当进程因内存或其他问题挣扎时发生级联故障。

### 我们的 PM2 生产配置 {#our-pm2-production-configuration}

**我们的生态系统设置：** 研究我们的服务器启动文件，了解 Node.js 生产环境设置：

* [Web 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree 调度器](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

无论您运行的是 Express 应用、Koa 服务器、GraphQL API 还是其他任何 Node.js 应用，这些模式都适用。

### 自动化 PM2 部署 {#automated-pm2-deployment}

**PM2 部署：** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

我们通过 Ansible 自动化整个 PM2 设置，确保所有服务器上的 Node.js 生产部署一致。

## 生产错误处理与分类系统 {#production-error-handling-and-classification-system}

我们最有价值的 Node.js 生产部署最佳实践之一是智能错误分类，适用于任何 Node.js 应用：

### 我们的生产环境 isCodeBug 实现 {#our-iscodebug-implementation-for-production}

**源码：** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

该辅助工具为生产环境中的 Node.js 应用提供智能错误分类，以：

* **优先处理真正的代码缺陷**，而非用户错误
* **通过聚焦真实问题提升事件响应**
* **减少因预期用户错误产生的警报疲劳**
* **更好地理解** 应用问题与用户产生的问题

该模式适用于任何 Node.js 应用——无论您是在构建电商网站、SaaS 平台、API 还是微服务。

### 与我们的生产日志集成 {#integration-with-our-production-logging}

**我们的日志集成：** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
我们的日志记录器使用 `isCodeBug` 来确定警报级别和字段脱敏，确保我们在 Node.js 生产环境中收到真实问题的通知，同时过滤掉噪音。

### 相关内容 {#related-content-1}

了解更多关于我们的错误处理模式：

* [构建可靠的支付系统](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - 错误处理模式
* [电子邮件隐私保护](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - 安全错误处理


## 使用 v8-profiler-next 和 cpupro 进行高级性能调试 {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

我们使用高级分析工具来分析堆快照并调试 OOM（内存溢出）问题、性能瓶颈以及 Node.js 内存问题，这些工具对于任何遇到内存泄漏或性能问题的 Node.js 应用都至关重要。

### 我们的 Node.js 生产环境分析方法 {#our-profiling-approach-for-nodejs-production}

**我们推荐的工具：**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - 用于生成堆快照和 CPU 分析
* [`cpupro`](https://github.com/discoveryjs/cpupro) - 用于分析 CPU 分析和堆快照

> \[!TIP]
> 我们将 v8-profiler-next 和 cpupro 结合使用，为我们的 Node.js 应用创建完整的性能调试工作流程。此组合帮助我们识别内存泄漏、性能瓶颈，并优化生产代码。

### 我们如何实现堆快照分析 {#how-we-implement-heap-snapshot-analysis}

**我们的监控实现：** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

我们的生产监控包括在内存阈值超出时自动生成堆快照，帮助我们在 OOM 问题导致应用崩溃之前进行调试。

**关键实现模式：**

* 当堆大小超过 2GB 阈值时 **自动快照**
* 生产环境中基于信号的 **按需分析**
* **保留策略** 用于管理快照存储
* 与我们的清理任务集成，实现自动维护

### 性能调试工作流程 {#performance-debugging-workflow}

**研究我们的实际实现：**

* [监控服务器实现](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - 堆监控和快照生成
* [清理任务](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - 快照保留和清理
* [日志集成](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - 性能日志记录

### 推荐给您的 Node.js 应用的实现方案 {#recommended-implementation-for-your-nodejs-application}

**针对堆快照分析：**

1. **安装 v8-profiler-next** 以生成快照
2. **使用 cpupro** 分析生成的快照
3. **实现类似 monitor-server.js 的监控阈值**
4. **设置自动清理** 管理快照存储
5. **创建信号处理程序** 实现生产环境按需分析

**针对 CPU 分析：**

1. **在高负载期间生成 CPU 分析**
2. **使用 cpupro 分析** 以识别瓶颈
3. **关注热点路径** 和优化机会
4. **监控性能改进的前后变化**

> \[!WARNING]
> 生成堆快照和 CPU 分析可能影响性能。我们建议实现节流，并仅在调查特定问题或维护窗口期间启用分析。

### 与我们的生产监控集成 {#integration-with-our-production-monitoring}

我们的分析工具与更广泛的监控策略集成：

* 基于内存/CPU 阈值的 **自动触发**
* 发现性能问题时的 **警报集成**
* 用于跟踪性能趋势的 **历史分析**
* 与应用指标的 **关联分析**，实现全面调试
这种方法帮助我们识别和解决内存泄漏，优化热点代码路径，并在我们的 Node.js 生产环境中保持稳定的性能。


## Node.js 生产基础设施安全 {#nodejs-production-infrastructure-security}

我们通过 Ansible 自动化为 Node.js 生产基础设施实施全面的安全措施。这些做法适用于任何 Node.js 应用：

### Node.js 生产的系统级安全 {#system-level-security-for-nodejs-production}

**我们的 Ansible 实现：** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

我们针对 Node.js 生产环境的关键安全措施：

* **禁用交换分区**，防止敏感数据写入磁盘
* **禁用核心转储**，防止包含敏感信息的内存转储
* **阻止 USB 存储**，防止未经授权的数据访问
* **内核参数调优**，兼顾安全和性能

> \[!WARNING]
> 在实施 Node.js 生产部署最佳实践时，禁用交换分区可能会导致当应用程序超出可用内存时被系统杀死。我们会仔细监控内存使用情况，并合理配置服务器规模。

### Node.js 应用的应用安全 {#application-security-for-nodejs-applications}

**我们的日志字段脱敏：** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

我们从日志中脱敏包括密码、令牌、API 密钥和个人信息等敏感字段。这在保护用户隐私的同时，保持了任何 Node.js 生产环境中的调试能力。

### 基础设施安全自动化 {#infrastructure-security-automation}

**我们针对 Node.js 生产的完整 Ansible 配置：**

* [安全剧本](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [SSH 密钥管理](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [证书管理](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [DKIM 配置](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### 我们的安全内容 {#our-security-content}

了解更多关于我们的安全方法：

* [最佳安全审计公司](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [量子安全加密邮件](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [为何选择开源邮件安全](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)


## Node.js 应用的数据库架构 {#database-architecture-for-nodejs-applications}

我们采用混合数据库方案，针对我们的 Node.js 应用进行了优化。这些模式可适用于任何 Node.js 应用：

### Node.js 生产的 SQLite 实现 {#sqlite-implementation-for-nodejs-production}

**我们使用：**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**我们的配置：** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

我们在 Node.js 应用中使用 SQLite 存储用户特定数据，因为它提供：

* **每用户/租户的数据隔离**
* **单用户查询的更好性能**
* **简化的备份和迁移**
* **相比共享数据库更低的复杂度**

这种模式非常适合 SaaS 应用、多租户系统或任何需要数据隔离的 Node.js 应用。

### Node.js 生产的 MongoDB 实现 {#mongodb-implementation-for-nodejs-production}

**我们使用：**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
**我们的设置实现：** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**我们的配置：** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

我们在 Node.js 生产环境中使用 MongoDB 存储应用数据，因为它提供：

* **灵活的模式** 以适应不断变化的数据结构
* **更好的性能** 以支持复杂查询
* **水平扩展** 能力
* **丰富的查询语言**

> \[!NOTE]
> 我们的混合方法针对特定用例进行了优化。请研究代码库中实际的数据库使用模式，以了解此方法是否适合您的 Node.js 应用需求。


## Node.js 生产环境后台任务处理 {#nodejs-production-background-job-processing}

我们围绕 Bree 构建了后台任务架构，以实现可靠的 Node.js 生产部署。适用于任何需要后台处理的 Node.js 应用：

### 我们的 Bree 服务器生产环境设置 {#our-bree-server-setup-for-production}

**我们的主要实现：** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**我们的 Ansible 部署：** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### 生产任务示例 {#production-job-examples}

**健康监控：** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**清理自动化：** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**我们的所有任务：** [浏览我们的完整任务目录](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

这些模式适用于任何需要以下功能的 Node.js 应用：

* 定时任务（数据处理、报告、清理）
* 后台处理（图像缩放、邮件发送、数据导入）
* 健康监控与维护
* 利用工作线程处理 CPU 密集型任务

### 我们的 Node.js 生产环境任务调度模式 {#our-job-scheduling-patterns-for-nodejs-production}

研究我们任务目录中的实际任务调度模式，了解：

* 我们如何在 Node.js 生产环境中实现类似 cron 的调度
* 我们的错误处理和重试逻辑
* 我们如何使用工作线程处理 CPU 密集型任务


## 生产环境 Node.js 应用的自动维护 {#automated-maintenance-for-production-nodejs-applications}

我们实施主动维护以防止常见的 Node.js 生产问题。这些模式适用于任何 Node.js 应用：

### 我们的清理实现 {#our-cleanup-implementation}

**来源：** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

我们针对 Node.js 生产应用的自动维护包括：

* **超过 24 小时的临时文件**
* **超出保留期限的日志文件**
* **缓存文件** 和临时数据
* **不再需要的上传文件**
* **性能调试产生的堆快照**

这些模式适用于任何生成临时文件、日志或缓存数据的 Node.js 应用。

### Node.js 生产环境的磁盘空间管理 {#disk-space-management-for-nodejs-production}

**我们的监控阈值：** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **后台处理队列限制**
* **75% 磁盘使用率** 警告阈值
* **超过阈值时自动清理**

### 基础设施维护自动化 {#infrastructure-maintenance-automation}

**我们针对 Node.js 生产环境的 Ansible 自动化：**

* [环境部署](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [部署密钥管理](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)


## Node.js 生产部署实施指南 {#nodejs-production-deployment-implementation-guide}
### 学习我们用于生产环境的实际代码最佳实践 {#study-our-actual-code-for-production-best-practices}

**从这些关键文件开始，了解 Node.js 生产环境的设置：**

1. **配置：** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **监控：** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **错误处理：** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **日志记录：** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **进程健康：** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### 学习我们的博客文章 {#learn-from-our-blog-posts}

**我们关于 Node.js 生产环境的技术实现指南：**

* [NPM 包生态系统](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [构建支付系统](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [电子邮件隐私实现](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript 联系表单](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React 邮件集成](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Node.js 生产环境的基础设施自动化 {#infrastructure-automation-for-nodejs-production}

**我们用于 Node.js 生产部署的 Ansible 剧本学习：**

* [完整剧本目录](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [安全加固](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js 设置](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### 我们的案例研究 {#our-case-studies}

**我们的企业级实现案例：**

* [Linux 基金会案例研究](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu 案例研究](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [校友邮件转发](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)


## 结论：Node.js 生产部署最佳实践 {#conclusion-nodejs-production-deployment-best-practices}

我们的 Node.js 生产基础设施展示了 Node.js 应用如何通过以下方式实现企业级可靠性：

* **经过验证的硬件选择**（AMD Ryzen 实现 573% 单核性能优化）
* **经过实战考验的 Node.js 生产监控**，具备特定阈值和自动响应
* **智能错误分类**，提升生产环境的事件响应能力
* **先进的性能调试**，使用 v8-profiler-next 和 cpupro 预防 OOM
* **通过 Ansible 自动化实现全面安全加固**
* **针对应用需求优化的混合数据库架构**
* **自动化维护**，防止常见的 Node.js 生产问题

**关键要点：** 学习我们的实际实现文件和博客文章，而非仅仅遵循通用最佳实践。我们的代码库提供了适用于任何 Node.js 应用——无论是 Web 应用、API、微服务还是后台服务——的真实生产部署模式。


## Node.js 生产环境完整资源列表 {#complete-resource-list-for-nodejs-production}

### 我们的核心实现文件 {#our-core-implementation-files}

* [主配置](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [包依赖](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [服务器监控](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [错误分类](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [日志系统](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [PM2 健康检查](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [自动清理](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)
### 我们的服务器实现 {#our-server-implementations}

* [Web 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree 调度器](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3 服务器](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### 我们的基础设施自动化 {#our-infrastructure-automation}

* [我们所有的 Ansible 剧本](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [安全加固](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js 设置](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [数据库配置](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### 我们的技术博客文章 {#our-technical-blog-posts}

* [NPM 生态系统分析](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [支付系统实现](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [电子邮件隐私技术指南](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript 联系表单](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React 电子邮件集成](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [自托管解决方案指南](https://forwardemail.net/blog/docs/self-hosted-solution)

### 我们的企业案例研究 {#our-enterprise-case-studies}

* [Linux 基金会实施](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu 案例研究](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [联邦政府合规](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [校友电子邮件系统](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)
