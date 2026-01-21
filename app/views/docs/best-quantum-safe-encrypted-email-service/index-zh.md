# 抗量子电子邮件：我们如何使用加密的 SQLite 邮箱来保障您的电子邮件安全 {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Quantum-safe encrypted email service illustration" class="rounded-lg" />

## 目录 {#table-of-contents}

* [前言](#foreword)
* [电子邮件服务提供商比较](#email-service-provider-comparison)
* [它是如何工作的](#how-does-it-work)
* [技术](#technologies)
  * [数据库](#databases)
  * [安全](#security)
  * [邮箱](#mailboxes)
  * [并发](#concurrency)
  * [备份](#backups)
  * [搜索](#search)
  * [项目](#projects)
  * [提供商](#providers)
* [思考](#thoughts)
  * [原则](#principles)
  * [实验](#experiments)
  * [缺乏替代方案](#lack-of-alternatives)
  * [尝试转发电子邮件](#try-out-forward-email)

## 前言 {#foreword}

> \[!IMPORTANT]
> 我们的电子邮件服务是 [100%开源](https://github.com/forwardemail)，并通过安全加密的 SQLite 邮箱注重隐私。

在我们推出 [IMAP 支持](/faq#do-you-support-receiving-email-with-imap) 之前，我们使用 MongoDB 来满足持久数据存储需求。

这项技术非常了不起，我们至今仍在使用它 - 但为了使用 MongoDB 进行静态加密，您需要使用提供 MongoDB Enterprise 的提供商，例如 Digital Ocean 或 Mongo Atlas - 或者支付企业许可证费用（随后必须与销售团队合作以应对延迟）。

[转发电子邮件](https://forwardemail.net) 团队需要一款开发者友好、可扩展、可靠且加密的 IMAP 邮箱存储解决方案。作为开源开发者，使用需要支付许可费用才能获得静态加密功能的技术违反了 [我们的原则](#principles) 的要求——因此，我们进行了实验、研究，并从零开始开发了一款全新的解决方案来满足这些需求。

我们不使用共享数据库来存储您的邮箱，而是单独存储您的邮箱，并使用您的密码（只有您拥有）进行加密。**我们的电子邮件服务非常安全，如果您忘记密码，您的邮箱就会丢失**（需要使用离线备份进行恢复或重新开始）。

请继续阅读，我们将深入探讨 [电子邮件服务提供商的比较](#email-service-provider-comparison)、[我们的服务如何运作](#how-does-it-work)、[我们的技术堆栈](#technologies) 等。

## 电子邮件服务提供商比较 {#email-service-provider-comparison}

我们是唯一一家 100% 开源且注重隐私的电子邮件服务提供商，可存储单独加密的 SQLite 邮箱，提供无限的域、别名和用户，并支持出站 SMTP、IMAP 和 POP3：

**与其他电子邮件提供商不同，使用 Forward Email，您无需按域名或别名支付存储空间费用。**存储空间将在您的整个帐户中共享——因此，如果您拥有多个自定义域名，并且每个域名都拥有多个别名，那么我们将是您的理想解决方案。请注意，您仍然可以根据需要按域名或别名强制执行存储空间限制。

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">阅读电子邮件服务比较 <i class="fa fa-search-plus"></i></a>

## 如何运作 {#how-does-it-work}

1. 使用您的电子邮件客户端（例如 Apple Mail、Thunderbird、Gmail 或 Outlook）– 使用您的用户名和密码连接到我们安全的 [IMAP](/faq#do-you-support-receiving-email-with-imap) 服务器：

* 您的用户名是您域名的完整别名，例如 `hello@example.com`。
* 您的密码是随机生成的，并且仅在您点击<strong class="text-success"><i class="fa fa-key"></i>从<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的帐户<i class="fa fa-angle-right"></i>域</a> <i class="fa fa-angle-right"></i>别名生成密码时显示 30 秒。

2. 连接后，您的电子邮件客户端会将 [IMAP 协议命令](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) 发送到我们的 IMAP 服务器，以保持您的邮箱同步。这包括撰写和存储电子邮件草稿，以及您可能执行的其他操作（例如，将电子邮件标记为“重要”或将电子邮件标记为“垃圾邮件”）。

3. 邮件交换服务器（通常称为“MX”服务器）接收新的入站邮件并将其存储到您的邮箱。当这种情况发生时，您的电子邮件客户端将收到通知并同步您的邮箱。我们的邮件交换服务器可以将您的邮件转发给一个或多个收件人（包括 [网络钩子](/faq#do-you-support-webhooks)），将您的邮件存储在我们提供的加密 IMAP 存储空间中，**或两者兼而有之**！

> \[!TIP]
> 想了解更多？阅读 [如何设置电子邮件转发](/faq#how-do-i-get-started-and-set-up-email-forwarding)、[我们的邮件交换服务如何运作](/faq#how-does-your-email-forwarding-system-work)，或查看 [我们的指南](/guides)。

4. 在后台，我们的安全电子邮件存储设计采用两种方式来保护您的邮箱加密，并且只有您可以访问：

* 当从发件人收到您的新邮件时，我们的邮件交换服务器会将邮件写入您的个人、临时且加密的邮箱。

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

* 当您使用电子邮件客户端连接到我们的 IMAP 服务器时，您的密码将被加密并存储在内存中，用于读写您的邮箱。只有使用此密码才能读写您的邮箱。请注意，由于您是唯一拥有此密码的人，因此在您访问邮箱时，**只有您**才能读写您的邮箱。下次您的电子邮件客户端尝试轮询邮件或同步时，您的新邮件将从此临时邮箱传输到您的实际邮箱文件中，并使用您提供的密码进行存储。请注意，此临时邮箱随后将被清除并删除，因此只有您受密码保护的邮箱才能保留这些邮件。

* **如果您已连接到 IMAP（例如使用 Apple Mail 或 Thunderbird 等电子邮件客户端），则我们无需写入临时磁盘存储。我们会提取并使用您内存中加密的 IMAP 密码。实时情况下，当邮件尝试发送给您时，我们会向所有 IMAP 服务器发送 WebSocket 请求，询问它们是否有您的活动会话（这是提取部分），然后会将该加密的内存密码传递给服务器——因此，我们无需写入临时邮箱，而是可以使用您的加密密码写入您实际的加密邮箱。**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: You connect to IMAP server using an email client.
         IMAP->>SQLite: Transfer message from temporary mailbox to your alias' mailbox.
         Note over IMAP,SQLite: Your alias' mailbox is only available in-memory using IMAP password.
         SQLite->>IMAP: Retrieves messages as requested by email client.
         IMAP->>You: Success!
     ```

5. [加密邮箱的备份](#backups) 每日生成。您也可以随时请求新的备份，或从<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的帐户<i class="fa fa-angle-right"></i>域名</a> <i class="fa fa-angle-right"></i>别名下载最新备份。如果您决定切换到其他电子邮件服务，您可以随时轻松迁移、下载、导出和清除您的邮箱和备份。

## 技术 {#technologies}

### 数据库 {#databases}

我们探索了其他可能的数据库存储层，但没有一个能像 SQLite 那样满足我们的要求：

| 数据库 | 静态加密 | [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) 邮箱 | 执照 | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** ：星号： | :white_check_mark: 是，使用 [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | ：白色勾号： | :white_check_mark: 公共领域 | ：白色勾号： |
| [MongoDB](https://www.mongodb.com/) | ：x：["Available in MongoDB Enterprise only"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/) | :x: 关系数据库 | :x: AGPL 和 `SSPL-1.0` | ：x： |
| [rqlite](https://github.com/rqlite/rqlite) | ：x：[Network only](https://github.com/rqlite/rqlite/issues/1406) | :x: 关系数据库 | ：白色复选标记：`MIT` | ：x： |
| [dqlite](https://dqlite.io/) | ：x：[Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | ：x：[Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | ：白色复选标记：`LGPL-3.0-only` | ：x： |
| [PostgreSQL](https://www.postgresql.org/) | ：白色勾选标记：[Yes](https://www.postgresql.org/docs/current/encryption-options.html) | :x: 关系数据库 | :white_check_mark: `PostgreSQL`（类似于 `BSD` 或 `MIT`） | ：x： |
| [MariaDB](https://mariadb.com/) | ：白色勾选标记：[For InnoDB only](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) | :x: 关系数据库 | ：white_check_mark：`GPLv2` 和 `BUSL-1.1` | ：x： |
| [CockroachDB](https://www.cockroachlabs.com/product/) | ：x：[Enterprise-only feature](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing) | :x: 关系数据库 | :x: `BUSL-1.1` 及其他 | ：x： |

> 上表中有一个 [比较几种 SQLite 数据库存储选项的博客文章](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/)。

### 安全 {#security}

我们始终使用 [静态加密](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard))、[传输中加密](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security))、[通过 HTTPS 进行 DNS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) (“DoH”) 和 [柑橘](https://tangeri.ne) (:tangerine:) 加密邮箱，以及 [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) 加密邮箱。此外，我们还使用基于令牌的双因素身份验证（而非易受 [中间人攻击](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) 攻击的短信验证码）、禁用 root 访问权限的轮换 SSH 密钥、通过受限 IP 地址独占访问服务器等等。

如果出现 [邪恶女仆袭击](https://en.wikipedia.org/wiki/Evil_maid_attack) 或第三方供应商的恶意员工，**您的邮箱仍然只能使用您生成的密码打开**。请放心，除了符合 SOC Type 2 投诉标准的服务器提供商 Cloudflare、DataPacket、Digital Ocean 和 Vultr 之外，我们不依赖任何第三方供应商。

我们的目标是尽可能少地使用 [单点故障](https://en.wikipedia.org/wiki/Single_point_of_failure)。

### 个邮箱 {#mailboxes}

> **tldr;** 我们的 IMAP 服务器对您的每个邮箱使用单独加密的 SQLite 数据库。

[SQLite 非常流行](https://www.sqlite.org/mostdeployed.html) 嵌入式数据库 – 它当前在您的手机和计算机上运行 – [并被几乎所有主要技术所采用](https://www.sqlite.org/famous.html)。

例如，在我们的加密服务器上，`linux@example.com`、`info@example.com`、`hello@example.com` 等邮箱对应一个 SQLite 数据库文件，每个文件对应一个 `.sqlite` 数据库文件。我们也不会使用邮箱地址来命名数据库文件，而是使用 BSON ObjectID 和生成的唯一 UUID，这些 UUID 不会透露邮箱的所属者或邮箱地址（例如 `353a03f21e534321f5d6e267.sqlite`）。

每个数据库都使用您的密码（只有您知道）通过 [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) 进行加密。这意味着您的邮箱是单独加密的、独立的、可移植的。

我们已经使用以下 [PRAGMA](https://www.sqlite.org/pragma.html) 对 SQLite 进行了微调：

| `PRAGMA` | 目的 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20` | 参考 [Projects](#projects) 下的 `better-sqlite3-multiple-ciphers` 以了解更多信息。 |
| `key="****************"` | 这是您已解密的仅存储在内存中的密码，它将通过您的电子邮件客户端的 IMAP 连接传递到我们的服务器。每次读写会话都会创建并关闭新的数据库实例（以确保沙盒和隔离）。 |
| `journal_model=WAL` | 预写日志（“[WAL](https://www.sqlite.org/wal.html)”）[which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode)。 |
| `busy_timeout=5000` | 防止写锁错误[while other writes are taking place](https://litestream.io/tips/#busy-timeout)。 |
| `synchronous=NORMAL` | 增加交易 [without data corruption risk](https://litestream.io/tips/#synchronous-pragma) 的持久性。 |
| `foreign_keys=ON` | 强制执行外键引用（例如从一个表到另一个表的关系）。[By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html)，但为了验证和数据完整性，应该启用它。 |
| `encoding='UTF-8'` | [Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding) 用于确保开发人员的理智。 |

> 所有其他默认值均来自 [官方 PRAGMA 文档](https://www.sqlite.org/pragma.html#pragma_auto_vacuum) 所指定的 SQLite。

### 并发 {#concurrency}

> **tldr;** 我们使用 `WebSocket` 对您的加密 SQLite 邮箱进行并发读取和写入。

#### 读取 {#reads}

您手机上的电子邮件客户端可能会将 `imap.forwardemail.net` 解析为我们的一个 Digital Ocean IP 地址，而您的桌面客户端可能会将 [提供者](#providers) 解析为一个单独的 IP。

无论您的电子邮件客户端连接到哪个 IMAP 服务器，我们都希望该连接能够实时、100% 准确地从您的数据库读取数据。这可以通过 WebSocket 实现。

#### 写入 {#writes}

写入数据库有点不同 - 因为 SQLite 是一个嵌入式数据库，并且您的邮箱默认位于单个文件中。

我们已经探索了下面的 `litestream`、`rqlite` 和 `dqlite` 等选项 - 但是这些都不能满足我们的要求。

为了在启用预写日志（“[WAL](https://www.sqlite.org/wal.html)”）的情况下完成写入操作，我们需要确保只有一台服务器（“主服务器”）负责执行此操作。[WAL](https://www.sqlite.org/wal.html) 可以显著加快并发速度，并允许一个写入器和多个读取器。

主服务器运行在已挂载了加密邮箱卷的数据服务器上。从分发的角度来看，您可以将 `imap.forwardemail.net` 后面的所有 IMAP 服务器视为辅助服务器（“辅助服务器”）。

我们通过[WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)实现双向通信：

* 主服务器使用 [WS](https://github.com/websockets/ws) 的 `WebSocketServer` 服务器实例。
* 辅助服务器使用 [WS](https://github.com/websockets/ws) 的 `WebSocket` 客户端实例，该客户端实例由 [websocket 承诺](https://github.com/vitalets/websocket-as-promised) 和 [重新连接 websocket](https://github.com/opensumi/reconnecting-websocket) 包装。这两个包装器确保 `WebSocket` 能够重新连接，并能够针对特定的数据库写入操作发送和接收数据。

### 备份 {#backups}

> **tldr;** 您的加密邮箱每天都会备份。您也可以随时从<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户<i class="fa fa-angle-right"></i>域名</a> <i class="fa fa-angle-right"></i>别名中立即请求新的备份或下载最新备份。

对于备份，我们只需在 IMAP 命令处理期间每天运行 SQLite `VACUUM INTO` 命令，该命令会利用您通过内存 IMAP 连接获取的加密密码。如果未检测到现有备份，或者文件的 [SHA-256](https://en.wikipedia.org/wiki/SHA-2) 哈希值与最新备份相比发生变化，则会存储备份。

请注意，我们使用 `VACUUM INTO` 命令，而不是内置的 `backup` 命令，因为如果在 `backup` 命令操作期间修改了页面，则必须重新开始。`VACUUM INTO` 命令将创建快照。有关更多信息，请参阅关于 [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) 和 [黑客新闻](https://news.ycombinator.com/item?id=31387556) 的注释。

此外，我们使用 `VACUUM INTO` 而不是 `backup`，因为 `backup` 命令会使数据库在短时间内保持未加密状态，直到调用 `rekey`（有关详情，请参阅此 GitHub [评论](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927)）。

辅助服务器将通过 `WebSocket` 连接指示主服务器执行备份 - 然后主服务器将收到执行备份的命令，随后将：

1. 连接到您的加密邮箱。
2. 获取写锁。
3. 通过 `wal_checkpoint(PASSIVE)` 运行 WAL 检查点。
4. 运行 `VACUUM INTO` SQLite 命令。
5. 确保复制的文件可以使用加密密码打开（安全保护/防伪）。
6. 将其上传到 Cloudflare R2 进行存储（或如果您指定，则上传到您自己的提供商）。

<!--
7. 使用 `gzip` 压缩生成的备份文件。
8. 将其上传到 Cloudflare R2 进行存储（或上传到您自己的提供商，如果指定）。
-->

请记住，您的邮箱是加密的 - 虽然我们对 WebSocket 通信有 IP 限制和其他身份验证措施 - 但如果出现不良行为者，您可以放心，除非 WebSocket 有效负载具有您的 IMAP 密码，否则它无法打开您的数据库。

目前每个邮箱仅存储一个备份，但将来我们可能会提供时间点恢复（“[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)”）。

### 搜索 {#search}

我们的 IMAP 服务器支持具有复杂查询、正则表达式等的 `SEARCH` 命令。

快速的搜索性能得益于 [FTS5](https://www.sqlite.org/fts5.html) 和 [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex)。

我们通过 [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) 将 `Date` 值作为 [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) 字符串存储在 SQLite 邮箱中（使用 UTC 时区以确保相等性比较正常运行）。

还存储了搜索查询中所有属性的索引。

### 项目 {#projects}

下表概述了我们在源代码和开发过程中使用的项目（按字母顺序排列）：

| 项目 | 目的 |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/) | DevOps 自动化平台可轻松维护、扩展和管理我们的整个服务器群。 |
| [Bree](https://github.com/breejs/bree) | Node.js 和 JavaScript 的作业调度程序，具有 cron、dates、ms、later 和人性化支持。 |
| [Cabin](https://github.com/cabinjs/cabin) | 开发人员友好的 JavaScript 和 Node.js 日志库，兼顾安全性和隐私性。 |
| [Lad](https://github.com/ladjs/lad) | Node.js 框架通过 MVC 等为我们的整个架构和工程设计提供支持。 |
| [MongoDB](https://www.mongodb.com/) | NoSQL 数据库解决方案，我们用于存储邮箱之外的所有其他数据（例如您的帐户、设置、域和别名配置）。 |
| [Mongoose](https://github.com/Automattic/mongoose) | MongoDB 对象文档模型（“ODM”），我们在整个堆栈中都使用这个模型。我们编写了特殊的辅助函数，以便我们能够轻松地继续将 Mongoose 与 SQLite 结合使用。 |
| [Node.js](https://nodejs.org/en) | Node.js 是开源、跨平台的 JavaScript 运行时环境，可运行我们所有的服务器进程。 |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | 用于发送电子邮件、创建连接等功能的 Node.js 软件包。我们是该项目的官方赞助商。 |
| [Redis](https://redis.io/) | 用于缓存、发布/订阅渠道和 HTTPS 请求上的 DNS 的内存数据库。 |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | SQLite 的加密扩展允许对整个数据库文件进行加密（包括预写日志（“[WAL](https://www.sqlite.org/wal.html)”）、日志、回滚等）。 |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio) | 可视化 SQLite 编辑器（您也可以使用它）来测试、下载和查看开发邮箱。 |
| [SQLite](https://www.sqlite.org/about.html) | 嵌入式数据库层，用于可扩展、独立、快速且有弹性的 IMAP 存储。 |
| [Spam Scanner](https://github.com/spamscanner/spamscanner) | Node.js 反垃圾邮件、电子邮件过滤和网络钓鱼预防工具（我们对 [Spam Assassin](https://spamassassin.apache.org/) 和 [rspamd](https://github.com/rspamd/rspamd) 的替代品）。 |
| [Tangerine](https://tangeri.ne) | 使用 Node.js 通过 HTTPS 请求进行 DNS 处理并使用 Redis 进行缓存 - 从而确保全局一致性等等。 |
| [Thunderbird](https://www.thunderbird.net/) | 我们的开发团队使用它（并且也推荐它）作为**转发电子邮件的首选电子邮件客户端**。 |
| [UTM](https://github.com/utmapp/UTM) | 我们的开发团队使用它为 iOS 和 macOS 创建虚拟机，以便使用我们的 IMAP 和 SMTP 服务器（并行）测试不同的电子邮件客户端。 |
| [Ubuntu](https://ubuntu.com/download/server) | 基于现代开源 Linux 的服务器操作系统，为我们所有的基础设施提供支持。 |
| [WildDuck](https://github.com/nodemailer/wildduck) | IMAP 服务器库 – 请参阅其关于 [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) 和 [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md) 的注释。 |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Node.js 的快速、简单的 API 库，用于以编程方式与 SQLite3 交互。 |
| [email-templates](https://github.com/forwardemail/email-templates) | 开发人员友好的电子邮件框架，用于创建、预览和发送自定义电子邮件（例如帐户通知等）。 |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced) | 使用 Mongo 风格语法的 SQL 查询构建器。这节省了我们开发团队的时间，因为我们可以在整个堆栈中继续使用 Mongo 风格编写，并且采用与数据库无关的方法。**它还可以通过使用查询参数来避免 SQL 注入攻击**。 |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector) | SQL 实用程序用于提取现有数据库架构的信息。这使我们能够轻松验证所有索引、表、列、约束等是否有效，以及 `1:1` 是否符合其应有的状态。我们甚至编写了自动化助手，以便在数据库架构发生更改时添加新的列和索引（并附带极其详细的错误警报）。 |
| [knex](https://github.com/knex/knex) | SQL 查询生成器，我们仅通过 `knex-schema-inspector` 进行数据库迁移和模式验证。 |
| [mandarin](https://github.com/ladjs/mandarin) | 使用 [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest) 自动进行 [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) 短语翻译，并支持 Markdown。 |
| [mx-connect](https://github.com/zone-eu/mx-connect) | Node.js 包用于解析和建立与 MX 服务器的连接并处理错误。 |
| [pm2](https://github.com/Unitech/pm2) | 带有内置负载均衡器（用于提高性能的[fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214)）的 Node.js 生产流程管理器。 |
| [smtp-server](https://github.com/nodemailer/smtp-server) | SMTP 服务器库 – 我们将其用于我们的邮件交换（“MX”）和出站 SMTP 服务器。 |
| [ImapTest](https://www.imapwiki.org/ImapTest) | 一款实用的工具，用于根据基准测试和 RFC 规范测试 IMAP 协议兼容性。该项目由 [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\) 团队（一个自 2002 年 7 月起活跃的开源 IMAP 和 POP3 服务器）创建。我们使用此工具对我们的 IMAP 服务器进行了广泛的测试。 |

> 您可以在 [我们在 GitHub 上的源代码](https://github.com/forwardemail) 中找到我们使用的其他项目。

### 提供商 {#providers}

| 提供者 | 目的 |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/) | 使用 [Cloudflare R2](https://developers.cloudflare.com/r2) 的 DNS 提供商、健康检查、负载均衡器和备份存储。 |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | 专用服务器托管和管理数据库。 |
| [Vultr](https://www.vultr.com/?ref=7429848) | 专用服务器托管。 |
| [DataPacket](https://www.datapacket.com) | 专用服务器托管。 |

## 想法 {#thoughts}

### 原则 {#principles}

转发电子邮件是根据以下原则设计的：

1. 始终以开发者友好为中心，注重安全和隐私，并保持透明。
2. 遵循 [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)、[Unix](https://en.wikipedia.org/wiki/Unix_philosophy)、[KISS](https://en.wikipedia.org/wiki/KISS_principle)、[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)、[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)、[十二因素](https://12factor.net/)、[奥卡姆剃刀](https://en.wikipedia.org/wiki/Occam%27s_razor) 和 [内部测试](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) 原则。
3. 面向精力充沛、自力更生和 [拉面盈利](http://www.paulgraham.com/ramenprofitable.html) 的开发者。

### 实验 {#experiments}

> **tldr;** 最终，使用与 S3 兼容的对象存储和/或虚拟表在技术上是不可行的，因为性能原因，并且由于内存限制而容易出错。

正如上面所讨论的，在最终的 SQLite 解决方案之前，我们已经做了一些实验。

其中之一是尝试将 [rclone]() 和 SQLite 与 S3 兼容存储层一起使用。

该实验使我们进一步了解和发现了有关 rclone、SQLite 和 [VFS](https://en.wikipedia.org/wiki/Virtual_file_system) 使用的一些极端情况：

* 如果您在 rclone 中启用了 `--vfs-cache-mode writes` 标志，则读取操作可以正常进行，但写入操作会被缓存。
* 如果您有多个分布在全球的 IMAP 服务器，除非您使用单个写入器和多个侦听器（例如，发布/订阅模式），否则缓存将无法跨服务器使用。
* 这非常复杂，任何额外的复杂性都会导致更多的单点故障。
* 与 S3 兼容的存储提供商不支持部分文件更改 - 这意味着对 `.sqlite` 文件的任何更改都会导致数据库完全更改并重新上传。
* 还有其他解决方案，例如 `rsync`，但它们并不专注于预写日志（“[WAL](https://www.sqlite.org/wal.html)”）的支持 - 因此我们最终评估了 Litestream。幸运的是，我们的加密系统已经为我们加密了 [WAL](https://www.sqlite.org/wal.html) 文件，因此我们不需要依赖 Litestream 来实现这一点。然而，我们尚不确定 Litestream 是否适合用于生产环境，因此，以下列出一些注意事项。
* 使用 `--vfs-cache-mode writes` 的此选项（这是使用 SQLite 而非 `rclone` 进行写入的*唯一*方法）将尝试在内存中从头复制整个数据库 - 处理一个 10 GB 的邮箱是可以的，但是处理多个存储空间过大的邮箱将导致 IMAP 服务器遇到内存限制，并出现 `ENOMEM` 错误、分段错误和数据损坏。
* 如果您尝试使用 SQLite [虚拟表](https://www.sqlite.org/vtab.html)（例如使用 [s3db](https://github.com/jrhy/s3db)）来将数据保存在与 S3 兼容的存储层上，那么您将遇到更多问题：
* 读写操作将极其缓慢，因为需要使用 HTTP `.sqlite`0、`.sqlite`1、`.sqlite`2 和 `.sqlite`3 方法访问 S3 API 端点。
* 开发测试表明，在光纤互联网上超过 50 万到 100 万条记录仍然会受到 S3 兼容提供商的读写吞吐量限制。例如，我们的开发人员运行了 `.sqlite`4 循环来执行顺序 SQL `.sqlite`5 语句和批量写入大量数据的语句。在这两种情况下，性能都非常缓慢。
* 虚拟表**不能包含索引**、`.sqlite`6 语句以及 `.sqlite`7 和 `.sqlite`8——这会导致延迟高达 1-2 分钟甚至更长时间，具体取决于数据量。
* 对象以未加密的形式存储，并且没有现成的原生加密支持。
* 我们还探索了使用 `.sqlite`9，它在概念和技术上与上一条要点类似（因此存在相同的问题）。一种可能性是使用自定义的 `rsync`0 构建，并将其加密，例如 `rsync`1（我们目前在上面的解决方案中使用）到 `rsync`2。
* 另一种可能的方法是使用 `rsync`3，但它的容量限制为 32 GB，并且需要复杂的构建和开发工作。
* `rsync`4 语句是必需的（因此完全排除了使用虚拟表的可能性）。我们需要 `rsync`5 语句才能使我们的 `rsync`6 钩子正常工作——这确保数据不会损坏，并且检索到的行可以根据我们的 `rsync`7 模式定义（包括约束、变量类型和任意数据验证）转换为有效文档。
* 开源社区中几乎所有与 SQLite 相关的 S3 兼容项目都是用 Python 编写的（而不是 JavaScript，而我们 100% 的技术栈都使用 JavaScript）。
* 诸如 `rsync`8（参见 `rsync`9）之类的压缩库看起来很有前景，但 __PROTECTED_LINK_189__0 则不然。相反，对 __PROTECTED_LINK_189__1、__PROTECTED_LINK_189__2、__PROTECTED_LINK_189__3、__PROTECTED_LINK_189__4、__PROTECTED_LINK_189__5 和 __PROTECTED_LINK_189__6 等数据类型进行应用程序端压缩将是一种更简洁、更简单的方法（并且也更易于迁移，因为我们可以存储 __PROTECTED_LINK_189__7 标志或列 - 甚至可以使用 __PROTECTED_LINK_189__8 __PROTECTED_LINK_189__9 进行压缩，或使用 __PROTECTED_LINK_190__0 进行不压缩作为数据库元数据）。
* 幸运的是，我们已经在 IMAP 服务器存储中实现了附件重复数据删除 - 因此，每条带有相同附件的消息都不会保留附件的副本 - 而是为邮箱中的多条消息和线程存储一个附件（随后使用外部引用）。
* Litestream 项目是一个 SQLite 复制和备份解决方案，前景非常光明，我们将来很可能会使用它。
* 并非要贬低作者——因为我们热爱他们十多年来的工作和对开源的贡献——然而，从实际使用情况来看，__PROTECTED_LINK_190__1 和 __PROTECTED_LINK_190__2 似乎存在问题。
* 备份恢复需要顺畅且简单。使用 MongoDB 等带有 __PROTECTED_LINK_190__3 和 __PROTECTED_LINK_190__4 的解决方案不仅繁琐，而且耗时且配置复杂。
* SQLite 数据库使其变得简单（它是一个单个文件）。
* 我们希望设计一个解决方案，让用户可以随时取走邮箱并离开。
* 只需向 __PROTECTED_LINK_190__5 发送简单的 Node.js 命令，它就会从磁盘存储中永久删除。
* 我们同样可以使用与 S3 兼容的 API 和 HTTP __PROTECTED_LINK_190__6 轻松为用户删除快照和备份。
* SQLite 是最简单、最快、最具成本效益的解决方案。

### 缺乏替代方案 {#lack-of-alternatives}

据我们所知，没有其他电子邮件服务是这样设计的，也不是开源的。

我们*认为这可能是因为*现有的电子邮件服务在生产中使用了 [意大利面条代码](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti: 的遗留技术。

大多数（如果不是全部）现有的电子邮件服务提供商要么是闭源的，要么宣传为开源，**但实际上只有他们的前端是开源的。**

**电子邮件最敏感的部分**（实际存储/IMAP/SMTP 交互）**全部在后端（服务器）完成，而不是在前端（客户端）完成**。

### 尝试转发电子邮件 {#try-out-forward-email}

立即注册 <https://forwardemail.net>! :rocket: