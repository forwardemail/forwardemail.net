# 量子抗性电子邮件：我们如何使用加密的 SQLite 邮箱保护您的电子邮件安全 {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="量子安全加密电子邮件服务插图" class="rounded-lg" />


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
  * [试用 Forward Email](#try-out-forward-email)


## 前言 {#foreword}

> \[!IMPORTANT]
> 我们的电子邮件服务是[100%开源](https://github.com/forwardemail)且注重隐私，通过安全且加密的 SQLite 邮箱实现。

直到我们推出了[IMAP 支持](/faq#do-you-support-receiving-email-with-imap)之前，我们一直使用 MongoDB 作为持久化数据存储。

这项技术非常棒，我们至今仍在使用——但要实现 MongoDB 的静态加密，您需要使用提供 MongoDB Enterprise 的服务商，如 Digital Ocean 或 Mongo Atlas，或者购买企业许可证（随后还得应对销售团队的响应延迟）。

我们在 [Forward Email](https://forwardemail.net) 团队需要一个对开发者友好、可扩展、可靠且加密的 IMAP 邮箱存储解决方案。作为开源开发者，使用需要付费许可证才能获得静态加密功能的技术违背了我们的[原则](#principles)——因此我们进行了实验、研究，并从零开发了一个新方案来满足这些需求。

我们没有使用共享数据库来存储您的邮箱，而是用您的密码（只有您知道）单独存储并加密您的邮箱。**我们的电子邮件服务安全到如果您忘记密码，就会丢失邮箱**（需要通过离线备份恢复或重新开始）。

请继续阅读，我们将在下面深入探讨[电子邮件服务提供商比较](#email-service-provider-comparison)、[我们的服务如何工作](#how-does-it-work)、[我们的技术栈](#technologies)等内容。


## 电子邮件服务提供商比较 {#email-service-provider-comparison}

我们是唯一一个 100% 开源且注重隐私的电子邮件服务提供商，存储单独加密的 SQLite 邮箱，支持无限域名、别名和用户，并且支持出站 SMTP、IMAP 和 POP3：

**与其他电子邮件提供商不同，使用 Forward Email 您无需按域名或别名付费存储。** 存储空间在整个账户中共享——所以如果您有多个自定义域名和每个域名多个别名，我们是您的完美解决方案。注意，如果需要，您仍然可以按域名或别名强制执行存储限制。

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">阅读电子邮件服务比较 <i class="fa fa-search-plus"></i></a>


## 它是如何工作的 {#how-does-it-work}

1. 使用您的电子邮件客户端，如 Apple Mail、Thunderbird、Gmail 或 Outlook——您使用用户名和密码连接到我们安全的 [IMAP](/faq#do-you-support-receiving-email-with-imap) 服务器：

   * 您的用户名是带域名的完整别名，例如 `hello@example.com`。
   * 您的密码是随机生成的，仅在您点击 <strong class="text-success"><i class="fa fa-key"></i> 生成密码</strong> 后的 30 秒内显示，路径为 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 别名。
2. 一旦连接，您的邮件客户端将向我们的 IMAP 服务器发送 [IMAP 协议命令](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) 以保持您的邮箱同步。这包括编写和存储草稿邮件以及您可能执行的其他操作（例如，将邮件标记为重要或将邮件标记为垃圾邮件/垃圾邮件）。

3. 邮件交换服务器（通常称为“MX”服务器）接收新的入站邮件并将其存储到您的邮箱中。当发生这种情况时，您的邮件客户端将收到通知并同步您的邮箱。我们的邮件交换服务器可以将您的邮件转发给一个或多个收件人（包括 [webhooks](/faq#do-you-support-webhooks)），为您存储邮件到我们加密的 IMAP 存储中，**或者两者兼而有之**！

   > \[!TIP]
   > 想了解更多？请阅读 [如何设置邮件转发](/faq#how-do-i-get-started-and-set-up-email-forwarding)、[我们的邮件交换服务如何工作](/faq#how-does-your-email-forwarding-system-work)，或查看 [我们的指南](/guides)。

4. 在幕后，我们的安全邮件存储设计通过两种方式保持您的邮箱加密且仅您可访问：

   * 当收到发件人为您发送的新邮件时，我们的邮件交换服务器会写入一个单独的、临时的、加密的邮箱。

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: 收到发往您的别名（例如 you@yourdomain.com）的入站邮件。
         MX->>SQLite: 邮件存储在临时邮箱中。
         Note over MX,SQLite: 转发给配置的其他收件人和 webhooks。
         MX->>Sender: 成功！
     ```

   * 当您使用邮件客户端连接到我们的 IMAP 服务器时，您的密码会在内存中加密并用于读取和写入您的邮箱。您的邮箱只能使用此密码读取和写入。请记住，由于只有您拥有此密码，**只有您**在访问时才能读取和写入您的邮箱。下一次您的邮件客户端尝试轮询邮件或同步时，您的新邮件将从此临时邮箱传输并使用您提供的密码存储到您的实际邮箱文件中。请注意，此临时邮箱随后会被清除和删除，因此只有受密码保护的邮箱中保存有邮件。

   * **如果您已连接到 IMAP（例如使用 Apple Mail 或 Thunderbird 等邮件客户端），则我们无需写入临时磁盘存储。您的内存中加密的 IMAP 密码将被获取并使用。在实时情况下，当尝试向您投递邮件时，我们会向所有 IMAP 服务器发送 WebSocket 请求，询问它们是否有您的活动会话（这就是获取部分），随后会传递该加密的内存密码——因此我们无需写入临时邮箱，可以使用您的加密密码直接写入您实际的加密邮箱。**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: 您使用邮件客户端连接到 IMAP 服务器。
         IMAP->>SQLite: 将邮件从临时邮箱转移到您的别名邮箱。
         Note over IMAP,SQLite: 您的别名邮箱仅使用 IMAP 密码在内存中可用。
         SQLite->>IMAP: 按邮件客户端请求检索邮件。
         IMAP->>You: 成功！
     ```

5. [您的加密邮箱备份](#backups)每天制作一次。您也可以随时请求新的备份，或从 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 别名 下载最新备份。如果您决定切换到其他邮件服务，则可以随时轻松迁移、下载、导出和清除您的邮箱和备份。


## 技术 {#technologies}

### 数据库 {#databases}

我们探索了其他可能的数据库存储层，但没有哪个像 SQLite 那样满足我们的需求：
| 数据库                                               |                                                                    静态加密                                                                   |  [沙箱隔离](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) 邮箱  |                           许可证                           | [广泛使用](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: |                          :white_check_mark: 支持，使用 [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                         |                                  :white_check_mark:                                  |               :white_check_mark: 公共领域              |                      :white_check_mark:                     |
| [MongoDB](https://www.mongodb.com/)                    |                   :x: ["仅 MongoDB 企业版支持"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: 关系型数据库                               |                   :x: AGPL 和 `SSPL-1.0`                   |                             :x:                             |
| [rqlite](https://github.com/rqlite/rqlite)             |                                             :x: [仅网络加密](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: 关系型数据库                               |                   :white_check_mark: `MIT`                  |                             :x:                             |
| [dqlite](https://dqlite.io/)                           |                                   :x: [未经测试且尚不支持？](https://github.com/canonical/dqlite/issues/32)                                  | :x: [未经测试且尚不支持？](https://github.com/canonical/dqlite/issues/32) |              :white_check_mark: `LGPL-3.0-only`             |                             :x:                             |
| [PostgreSQL](https://www.postgresql.org/)              |                                :white_check_mark: [支持](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: 关系型数据库                               | :white_check_mark: `PostgreSQL`（类似于 `BSD` 或 `MIT`） |                             :x:                             |
| [MariaDB](https://mariadb.com/)                        | :white_check_mark: [仅支持 InnoDB](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: 关系型数据库                               |          :white_check_mark: `GPLv2` 和 `BUSL-1.1`          |                             :x:                             |
| [CockroachDB](https://www.cockroachlabs.com/product/)  |                               :x: [仅企业版功能](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: 关系型数据库                               |                  :x: `BUSL-1.1` 及其他                  |                             :x:                             |

> 这里有一篇[博客文章比较了上表中的几种 SQLite 数据库存储选项](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/)。

### 安全 {#security}

我们始终使用[静态加密](https://en.wikipedia.org/wiki/Data_at_rest)（[AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)）、[传输加密](https://en.wikipedia.org/wiki/Data_in_transit)（[TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)）、使用 :tangerine: [Tangerine](https://tangeri.ne) 的[HTTPS DNS](https://en.wikipedia.org/wiki/DNS_over_HTTPS)（“DoH”），以及邮箱上的 [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)（[ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)）加密。此外，我们使用基于令牌的双因素认证（相较于易受[中间人攻击](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)的短信），轮换的 SSH 密钥并禁用 root 访问，通过受限 IP 地址独占访问服务器，等等。
在发生[恶意女仆攻击](https://en.wikipedia.org/wiki/Evil_maid_attack)或来自第三方供应商的流氓员工事件时，**您的邮箱仍然只能通过您生成的密码打开**。请放心，我们不依赖除 Cloudflare、DataPacket、Digital Ocean、GitHub 和 Vultr 这些符合 SOC Type 2 标准的服务器提供商以外的任何第三方供应商。

我们的目标是尽可能减少[单点故障](https://en.wikipedia.org/wiki/Single_point_of_failure)。

### 邮箱 {#mailboxes}

> **简而言之；** 我们的 IMAP 服务器为您的每个邮箱使用单独加密的 SQLite 数据库。

[SQLite 是一个极其流行的](https://www.sqlite.org/mostdeployed.html)嵌入式数据库——它目前运行在您的手机和电脑上——[并被几乎所有主流技术使用](https://www.sqlite.org/famous.html)。

例如，在我们加密的服务器上，有一个 SQLite 数据库邮箱对应 `linux@example.com`、`info@example.com`、`hello@example.com` 等等——每个邮箱对应一个 `.sqlite` 数据库文件。我们也不会用邮箱地址来命名数据库文件——而是使用 BSON ObjectID 和唯一生成的 UUID，这些都不会透露邮箱属于谁或对应哪个邮箱地址（例如 `353a03f21e534321f5d6e267.sqlite`）。

这些数据库本身使用您的密码（只有您知道）通过 [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)（[ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)）进行加密。这意味着您的邮箱是单独加密的、自包含的、[沙箱化](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\))且可移植的。

我们对 SQLite 进行了以下 [PRAGMA](https://www.sqlite.org/pragma.html) 的微调：

| `PRAGMA`                 | 目的                                                                                                                                                                                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `cipher=chacha20`        | [ChaCha20-Poly1305 SQLite 数据库加密](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)。有关更多信息，请参考[项目](#projects)下的 `better-sqlite3-multiple-ciphers`。                                                     |
| `key="****************"` | 这是您在内存中解密的密码，通过您的邮件客户端的 IMAP 连接传递给我们的服务器。每次读写会话都会创建并关闭新的数据库实例（以确保沙箱化和隔离）。                                                                                                   |
| `journal_mode=WAL`       | 预写日志（"[WAL](https://www.sqlite.org/wal.html)"）[提升性能并允许并发读取访问](https://litestream.io/tips/#wal-journal-mode)。                                                                                                                        |
| `busy_timeout=5000`      | 防止在其他写操作进行时发生写锁错误，[详情见](https://litestream.io/tips/#busy-timeout)。                                                                                                                                                               |
| `synchronous=NORMAL`     | 提高事务的持久性，[且无数据损坏风险](https://litestream.io/tips/#synchronous-pragma)。                                                                                                                                                                |
| `foreign_keys=ON`        | 强制执行外键引用（例如一个表到另一个表的关系）。[SQLite 默认未开启此功能](https://www.sqlite.org/foreignkeys.html)，但为了验证和数据完整性应启用。                                                                                                   |
| `encoding='UTF-8'`       | [默认编码](https://www.sqlite.org/pragma.html#pragma_encoding)，确保开发者的合理性。                                                                                                                                                                     |
> 其他所有默认值均来自 SQLite，具体请参见[官方 PRAGMA 文档](https://www.sqlite.org/pragma.html#pragma_auto_vacuum)。

### 并发 {#concurrency}

> **简要说明；** 我们使用 `WebSocket` 来实现对您加密的 SQLite 邮箱的并发读写。

#### 读取 {#reads}

您手机上的邮件客户端可能会将 `imap.forwardemail.net` 解析到我们 Digital Ocean 的某个 IP 地址——而您的桌面客户端可能会解析到来自不同[提供商](#providers)的另一个 IP。

无论您的邮件客户端连接到哪个 IMAP 服务器，我们都希望连接能够实时且 100% 准确地从您的数据库读取数据。这是通过 WebSockets 实现的。

#### 写入 {#writes}

写入数据库则有所不同——因为 SQLite 是嵌入式数据库，您的邮箱默认存储在单个文件中。

我们曾探索过诸如 `litestream`、`rqlite` 和 `dqlite` 等选项，但这些都未能满足我们的需求。

为了在启用写前日志（"[WAL](https://www.sqlite.org/wal.html)"）的情况下完成写入——我们需要确保只有一个服务器（“主服务器”）负责写入。[WAL](https://www.sqlite.org/wal.html) 大幅提升了并发性能，允许一个写入者和多个读取者。

主服务器运行在挂载了包含加密邮箱卷的数据服务器上。从分布式角度来看，您可以将 `imap.forwardemail.net` 背后的所有单独 IMAP 服务器视为辅助服务器（“辅助服务器”）。

我们通过 [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) 实现双向通信：

* 主服务器使用 [ws](https://github.com/websockets/ws) 的 `WebSocketServer` 实例。
* 辅助服务器使用 [ws](https://github.com/websockets/ws) 的 `WebSocket` 客户端实例，并通过 [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) 和 [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket) 进行封装。这两个封装确保 `WebSocket` 能够重新连接，并能针对特定数据库写入发送和接收数据。

### 备份 {#backups}

> **简要说明；** 您加密邮箱的备份每天都会生成。您也可以随时从 <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">我的账户 <i class="fa fa-angle-right"></i> 域名</a> <i class="fa fa-angle-right"></i> 别名 页面即时请求新备份或下载最新备份。

对于备份，我们每天在 IMAP 命令处理期间简单运行 SQLite 的 `VACUUM INTO` 命令，该命令利用了来自内存中 IMAP 连接的加密密码。只有在检测不到现有备份或文件的 [SHA-256](https://en.wikipedia.org/wiki/SHA-2) 哈希与最近备份不同的情况下，才会存储备份。

请注意，我们使用 `VACUUM INTO` 命令而非内置的 `backup` 命令，因为如果在 `backup` 命令操作期间页面被修改，则必须重新开始。`VACUUM INTO` 命令会创建快照。有关更多见解，请参阅这些 [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) 和 [Hacker News](https://news.ycombinator.com/item?id=31387556) 上的评论。

此外，我们使用 `VACUUM INTO` 而非 `backup`，因为 `backup` 命令会导致数据库在调用 `rekey` 之前短暂处于未加密状态（详情见此 GitHub [评论](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927)）。

辅助服务器会通过 `WebSocket` 连接指示主服务器执行备份——主服务器随后会接收该命令并执行以下操作：

1. 连接到您的加密邮箱。
2. 获取写锁。
3. 通过 `wal_checkpoint(PASSIVE)` 运行 WAL 检查点。
4. 执行 SQLite 的 `VACUUM INTO` 命令。
5. 确保复制的文件可以使用加密密码打开（安全保障/防呆措施）。
6. 上传到 Cloudflare R2 进行存储（或如果指定了，则上传到您自己的提供商）。
<!--
7. 使用 `gzip` 压缩生成的备份文件。
8. 上传到 Cloudflare R2 进行存储（或指定的其他提供商）。
-->

请记住，您的邮箱是加密的——虽然我们对 WebSocket 通信实施了 IP 限制和其他身份验证措施——如果出现恶意行为者，您可以放心，除非 WebSocket 负载中包含您的 IMAP 密码，否则无法打开您的数据库。

目前每个邮箱只存储一个备份，但未来我们可能会提供时间点恢复（"[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)"）。

### 搜索 {#search}

我们的 IMAP 服务器支持带有复杂查询、正则表达式等的 `SEARCH` 命令。

快速的搜索性能得益于 [FTS5](https://www.sqlite.org/fts5.html) 和 [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex)。

我们将 `Date` 值以 [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) 字符串形式存储在 SQLite 邮箱中，通过 [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString)（使用 UTC 时区以确保相等比较正常工作）。

所有出现在搜索查询中的属性也都存储了索引。

### 项目 {#projects}

以下是我们在源代码和开发过程中使用的项目表（按字母顺序排列）：

| 项目                                                                                         | 目的                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/)                                                          | 用于轻松维护、扩展和管理我们整个服务器群的 DevOps 自动化平台。                                                                                                                                                                                                                                                                                                    |
| [Bree](https://github.com/breejs/bree)                                                       | Node.js 和 JavaScript 的作业调度器，支持 cron、日期、毫秒、later 和人性化时间。                                                                                                                                                                                                                                                                                   |
| [Cabin](https://github.com/cabinjs/cabin)                                                    | 以安全和隐私为核心的开发者友好型 JavaScript 和 Node.js 日志库。                                                                                                                                                                                                                                                                                                  |
| [Lad](https://github.com/ladjs/lad)                                                          | 支撑我们整个架构和工程设计的 Node.js 框架，支持 MVC 等功能。                                                                                                                                                                                                                                                                                                     |
| [MongoDB](https://www.mongodb.com/)                                                          | 我们用于存储邮箱外所有其他数据（例如您的账户、设置、域名和别名配置）的 NoSQL 数据库解决方案。                                                                                                                                                                                                                                                                     |
| [Mongoose](https://github.com/Automattic/mongoose)                                           | 我们整个技术栈中使用的 MongoDB 对象文档建模（"ODM"）。我们编写了特殊的辅助工具，使我们能够继续使用 **Mongoose 与 SQLite** :tada:                                                                                                                                                                                                                              |
| [Node.js](https://nodejs.org/en)                                                             | Node.js 是开源的跨平台 JavaScript 运行环境，运行我们所有的服务器进程。                                                                                                                                                                                                                                                                                            |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                       | 用于发送邮件、创建连接等的 Node.js 包。我们是该项目的官方赞助商。                                                                                                                                                                                                                                                                                               |
| [Redis](https://redis.io/)                                                                   | 用于缓存、发布/订阅频道和 DNS over HTTPS 请求的内存数据库。                                                                                                                                                                                                                                                                                                    |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                   | SQLite 的加密扩展，允许整个数据库文件加密（包括写前日志（"[WAL](https://www.sqlite.org/wal.html)"）、日志、回滚等）。                                                                                                                                                                                                                                              |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                  | 可视化 SQLite 编辑器（您也可以使用它）用于测试、下载和查看开发中的邮箱。                                                                                                                                                                                                                                                                                       |
| [SQLite](https://www.sqlite.org/about.html)                                                  | 用于可扩展、自包含、快速且高可靠性的 IMAP 存储的嵌入式数据库层。                                                                                                                                                                                                                                                                                               |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                   | Node.js 反垃圾邮件、邮件过滤和钓鱼防护工具（我们替代了 [Spam Assassin](https://spamassassin.apache.org/) 和 [rspamd](https://github.com/rspamd/rspamd)）。                                                                                                                                                                                                       |
| [Tangerine](https://tangeri.ne)                                                              | 使用 Node.js 和 Redis 缓存的 DNS over HTTPS 请求，确保全球一致性及更多功能。                                                                                                                                                                                                                                                                                    |
| [Thunderbird](https://www.thunderbird.net/)                                                  | 我们的开发团队使用并推荐作为 **Forward Email 的首选邮件客户端**。                                                                                                                                                                                                                                                                                               |
| [UTM](https://github.com/utmapp/UTM)                                                         | 我们的开发团队使用它在 iOS 和 macOS 上创建虚拟机，以便并行测试不同的邮件客户端与我们的 IMAP 和 SMTP 服务器。                                                                                                                                                                                                                                                    |
| [Ubuntu](https://ubuntu.com/download/server)                                                 | 现代开源的基于 Linux 的服务器操作系统，支撑我们所有的基础设施。                                                                                                                                                                                                                                                                                                |
| [WildDuck](https://github.com/nodemailer/wildduck)                                           | IMAP 服务器库——请参阅其关于[附件去重](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md)和[IMAP 协议支持](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md)的说明。                                                                                                               |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | 用于 Node.js 的快速且简单的 SQLite3 编程接口库。                                                                                                                                                                                                                                                                                                               |
| [email-templates](https://github.com/forwardemail/email-templates)                           | 开发者友好的邮件框架，用于创建、预览和发送自定义邮件（例如账户通知等）。                                                                                                                                                                                                                                                                                        |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                       | 使用 Mongo 风格语法的 SQL 查询构建器。节省了我们开发团队的时间，因为我们可以继续在整个技术栈中以数据库无关的方式使用 Mongo 风格语法。**它还通过使用查询参数帮助避免 SQL 注入攻击。**                                                                                                                                                                      |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                       | 用于提取现有数据库模式信息的 SQL 工具。它使我们能够轻松验证所有索引、表、列、约束等是否有效且与预期完全一致。我们甚至编写了自动化辅助工具，在数据库模式发生更改时添加新列和索引（并提供极其详细的错误警报）。                                                                                                                                           |
| [knex](https://github.com/knex/knex)                                                        | SQL 查询构建器，我们仅用于数据库迁移和通过 `knex-schema-inspector` 进行模式验证。                                                                                                                                                                                                                                                                             |
| [mandarin](https://github.com/ladjs/mandarin)                                               | 自动 [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) 短语翻译，支持使用 [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest) 的 Markdown。                                                                                                                                                      |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                         | Node.js 包，用于解析和建立与 MX 服务器的连接并处理错误。                                                                                                                                                                                                                                                                                                       |
| [pm2](https://github.com/Unitech/pm2)                                                       | Node.js 生产进程管理器，内置负载均衡器（针对性能进行了[微调](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214)）。                                                                                                                                                                                                                              |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                    | SMTP 服务器库——我们用于邮件交换（"MX"）和外发 SMTP 服务器。                                                                                                                                                                                                                                                                                                   |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                               | 用于测试 IMAP 服务器的基准和 RFC 规范 IMAP 协议兼容性的有用工具。该项目由 [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) 团队创建（一个自 2002 年 7 月起活跃的开源 IMAP 和 POP3 服务器）。我们使用该工具对我们的 IMAP 服务器进行了广泛测试。                                                                                                         |
> 你可以在[我们在 GitHub 上的源代码](https://github.com/forwardemail)中找到我们使用的其他项目。

### 提供商 {#providers}

| 提供商                                        | 目的                                                                                                                      |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | DNS 提供商，健康检查，负载均衡器，以及使用 [Cloudflare R2](https://developers.cloudflare.com/r2) 的备份存储。 |
| [GitHub](https://github.com/)                   | 源代码托管，CI/CD 和项目管理。                                                                          |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | 专用服务器托管和托管数据库。                                                                              |
| [Vultr](https://www.vultr.com/?ref=7429848)     | 专用服务器托管。                                                                                                    |
| [DataPacket](https://www.datapacket.com)        | 专用服务器托管。                                                                                                    |


## 思考 {#thoughts}

### 原则 {#principles}

Forward Email 的设计遵循以下原则：

1. 始终以开发者友好、安全和隐私为核心，并保持透明。
2. 遵循 [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)、[Unix](https://en.wikipedia.org/wiki/Unix_philosophy)、[KISS](https://en.wikipedia.org/wiki/KISS_principle)、[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)、[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)、[十二因素](https://12factor.net/)、[奥卡姆剃刀](https://en.wikipedia.org/wiki/Occam%27s_razor) 和 [自我验证](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)。
3. 面向有拼劲、自筹资金且[能维持基本生活](http://www.paulgraham.com/ramenprofitable.html)的开发者。

### 实验 {#experiments}

> **简述；** 由于性能原因，最终使用 S3 兼容对象存储和/或虚拟表在技术上不可行，并且由于内存限制容易出错。

我们做了一些实验，最终得出了上文讨论的 SQLite 解决方案。

其中一个实验是尝试将 [rclone]() 和 SQLite 结合使用，并配合 S3 兼容存储层。

该实验使我们进一步理解并发现了围绕 rclone、SQLite 和 [VFS](https://en.wikipedia.org/wiki/Virtual_file_system) 使用的边缘情况：

* 如果你启用 rclone 的 `--vfs-cache-mode writes` 标志，那么读取是正常的，但写入会被缓存。
  * 如果你有多个分布在全球的 IMAP 服务器，那么缓存将在它们之间失效，除非你有一个写入者和多个监听者（例如发布/订阅方式）。
  * 这非常复杂，增加任何额外的复杂性都会导致更多单点故障。
  * S3 兼容存储提供商不支持部分文件更改——这意味着任何对 `.sqlite` 文件的更改都会导致数据库的完整更改和重新上传。
  * 还有其他解决方案如 `rsync`，但它们不支持写前日志（"[WAL](https://www.sqlite.org/wal.html)"）——所以我们最终审查了 Litestream。幸运的是，我们的加密使用已经为我们加密了 [WAL](https://www.sqlite.org/wal.html) 文件，因此不需要依赖 Litestream。但我们对 Litestream 的生产使用还没有完全信心，下面有一些相关说明。
  * 使用 `--vfs-cache-mode writes` 选项（这是通过 `rclone` 使用 SQLite 写入的*唯一*方式）会尝试在内存中从头复制整个数据库——处理一个 10 GB 邮箱还可以，但处理多个存储极高的邮箱会导致 IMAP 服务器遇到内存限制和 `ENOMEM` 错误、段错误以及数据损坏。
* 如果你尝试使用 SQLite [虚拟表](https://www.sqlite.org/vtab.html)（例如使用 [s3db](https://github.com/jrhy/s3db)）以便数据存储在 S3 兼容存储层上，你会遇到更多问题：
  * 读写速度极慢，因为需要通过 HTTP 的 `GET`、`PUT`、`HEAD` 和 `POST` 方法访问 S3 API 端点。
  * 开发测试显示，在光纤网络上超过 50 万到 100 万条记录时，写入和读取 S3 兼容提供商的吞吐量仍然是瓶颈。例如，我们的开发者运行了 `for` 循环执行顺序 SQL `INSERT` 语句和批量写入大量数据，两种情况下性能都极其缓慢。
  * 虚拟表**不能有索引**，不能执行 `ALTER TABLE` 语句，并且有[其他](https://stackoverflow.com/a/12507650) [限制](https://sqlite.org/lang_createvtab.html)——这会导致根据数据量不同，延迟达到 1-2 分钟甚至更长。
  * 对象存储未加密，且没有现成的本地加密支持。
* 我们还探索了使用 [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs)，它在概念和技术上与前一点类似（因此存在相同问题）。一种可能是使用自定义的 `sqlite3` 构建，结合加密库如 [wxSQLite3](https://github.com/utelle/wxsqlite3)（我们当前在上述方案中使用），通过[编辑安装文件](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276)实现。
* 另一种潜在方法是使用 [multiplex 扩展](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c)，但它有 32 GB 限制，并且需要复杂的构建和开发工作。
* 需要使用 `ALTER TABLE` 语句（因此完全排除了使用虚拟表）。我们需要 `ALTER TABLE` 语句以使我们的 `knex-schema-inspector` 钩子正常工作——这确保数据不被破坏，检索的行可以根据我们的 `mongoose` 模式定义转换为有效文档（包括约束、变量类型和任意数据验证）。
* 几乎所有与 SQLite 相关的 S3 兼容项目都是用 Python 编写的（而我们 100% 使用 JavaScript 作为技术栈）。
* 压缩库如 [sqlite-zstd](https://github.com/phiresky/sqlite-zstd)（见[评论](https://news.ycombinator.com/item?id=32303762)）看起来很有前景，但[可能尚未准备好用于生产环境](https://github.com/phiresky/sqlite-zstd#usage)。相反，在应用端对 `String`、`Object`、`Map`、`Array`、`Set` 和 `Buffer` 等数据类型进行压缩会更简洁、更易于实现（且更易迁移，因为我们可以存储一个 `Boolean` 标志或列，甚至使用 `PRAGMA` `user_version=1` 表示压缩，`user_version=0` 表示不压缩，作为数据库元数据）。
  * 幸运的是，我们已经在 IMAP 服务器存储中实现了附件去重——因此每条带有相同附件的消息不会保存附件副本，而是为邮箱中的多条消息和线程存储单个附件，并使用外键引用。
* Litestream 项目是一个 SQLite 复制和备份解决方案，非常有前景，我们很可能未来会使用它。
  * 不是贬低作者——因为我们非常喜欢他们的工作和对开源的贡献，已经超过十年了——但从实际使用来看，似乎存在[许多麻烦](https://github.com/benbjohnson/litestream/issues)和[潜在的数据丢失风险](https://github.com/benbjohnson/litestream/issues/218)。
* 备份恢复需要无摩擦且简单。使用 MongoDB 的 `mongodump` 和 `mongoexport` 不仅繁琐，而且耗时且配置复杂。
  * SQLite 数据库很简单（它是单个文件）。
  * 我们希望设计一个方案，让用户可以随时带走他们的邮箱。
    * 简单的 Node.js 命令 `fs.unlink('mailbox.sqlite')`，即可永久从磁盘存储中删除。
    * 我们也可以类似地使用带有 HTTP `DELETE` 的 S3 兼容 API，轻松删除用户的快照和备份。
  * SQLite 是最简单、最快且最具成本效益的解决方案。
### 缺乏替代方案 {#lack-of-alternatives}

据我们所知，没有其他电子邮件服务是以这种方式设计的，也没有开源的。

我们*认为这可能是因为*现有的电子邮件服务在生产环境中使用了带有[意大利面条代码](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti: 的遗留技术。

现有的大多数电子邮件服务提供商要么是闭源的，要么声称开源，**但实际上只有他们的前端是开源的。**

**电子邮件中最敏感的部分**（实际的存储/IMAP/SMTP交互）**全部在后端（服务器）完成，*而不是*在前端（客户端）完成。**

### 试用 Forward Email {#try-out-forward-email}

今天就注册 <https://forwardemail.net>！ :rocket:
