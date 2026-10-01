# Forward Email 如何保护您的隐私、域名和安全：技术深度解析 {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<!-- <img loading="lazy" src="/img/articles/email-forwarding.webp" alt="最佳邮件转发服务比较" class="rounded-lg" /> -->


## 目录 {#table-of-contents}

* [前言](#foreword)
* [Forward Email 的隐私理念](#the-forward-email-privacy-philosophy)
* [SQLite 实现：为您的数据提供持久性和可移植性](#sqlite-implementation-durability-and-portability-for-your-data)
* [智能队列与重试机制：确保邮件送达](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [智能速率限制下的无限资源](#unlimited-resources-with-intelligent-rate-limiting)
* [沙箱加密以增强安全性](#sandboxed-encryption-for-enhanced-security)
* [内存中邮件处理：无磁盘存储，最大化隐私](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [使用 OpenPGP 的端到端加密，实现完全隐私](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [多层内容保护，全面保障安全](#multi-layered-content-protection-for-comprehensive-security)
* [我们与其他邮件服务的区别：技术隐私优势](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [开源透明，隐私可验证](#open-source-transparency-for-verifiable-privacy)
  * [无供应商锁定，实现无妥协的隐私](#no-vendor-lock-in-for-privacy-without-compromise)
  * [沙箱数据，真正隔离](#sandboxed-data-for-true-isolation)
  * [数据可移植性与控制权](#data-portability-and-control)
* [隐私优先邮件转发的技术挑战](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [无日志邮件处理的内存管理](#memory-management-for-no-logging-email-processing)
  * [无内容分析的垃圾邮件检测，实现隐私保护过滤](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [隐私优先设计下的兼容性维护](#maintaining-compatibility-with-privacy-first-design)
* [Forward Email 用户的隐私最佳实践](#privacy-best-practices-for-forward-email-users)
* [结论：私密邮件转发的未来](#conclusion-the-future-of-private-email-forwarding)


## 前言 {#foreword}

数据泄露、监控以及基于邮件内容的定向广告促使越来越多的用户转向优先保护隐私的服务。在 Forward Email，我们从零开始构建服务，将隐私作为架构的基础。本文介绍使我们的服务成为最注重隐私的邮件转发解决方案之一的技术实现。


## Forward Email 的隐私理念 {#the-forward-email-privacy-philosophy}

我们的隐私理念：**您的邮件属于您，且仅属于您**。这一原则指导着我们每一个技术决策，从邮件转发的处理方式到加密的实现。

与许多为广告目的扫描您的邮件或无限期存储邮件的邮件服务商不同，Forward Email 的做法不同：

1. **仅内存处理**：我们不将您的转发邮件存储到磁盘
2. **不存储元数据**：我们不保留谁给谁发邮件的记录
3. **100% 开源**：我们的全部代码透明且可审计
4. **端到端加密**：我们支持 OpenPGP，实现私密的通信


## SQLite 实现：为您的数据提供持久性和可移植性 {#sqlite-implementation-durability-and-portability-for-your-data}

Forward Email 的主要隐私优势之一是我们的 [SQLite](https://en.wikipedia.org/wiki/SQLite) 实现。我们通过特定的 PRAGMA 设置和 [预写日志（WAL）](https://en.wikipedia.org/wiki/Write-ahead_logging) 对 SQLite 进行了优化，使您的数据持久、可移植、私密且安全。
我们如何使用 [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) 作为量子抗性加密密码实现 SQLite 的示例：

```javascript
// 使用 better-sqlite3-multiple-ciphers 初始化数据库
const Database = require('better-sqlite3-multiple-ciphers');

// 使用 ChaCha20-Poly1305 密码设置加密
db.pragma(`key="${decrypt(session.user.password)}"`);

// 启用写前日志以提高持久性和性能
db.pragma('journal_mode=WAL');

// 用零覆盖已删除内容以保护隐私
db.pragma('secure_delete=ON');

// 启用自动清理以实现高效存储管理
db.pragma('auto_vacuum=FULL');

// 设置忙等待超时以处理并发访问
db.pragma(`busy_timeout=${config.busyTimeout}`);

// 优化同步以提高可靠性
db.pragma('synchronous=NORMAL');

// 启用外键约束以保证数据完整性
db.pragma('foreign_keys=ON');

// 设置 UTF-8 编码以支持国际字符
db.pragma(`encoding='UTF-8'`);

// 优化数据库性能
db.pragma('optimize=0x10002;');

// 使用磁盘作为临时存储而非内存
db.pragma('temp_store=1;');
```

此实现使您的数据安全且可移植。您可以随时通过导出为 [MBOX](https://en.wikipedia.org/wiki/Email#Storage)、[EML](https://en.wikipedia.org/wiki/Email#Storage) 或 SQLite 格式来携带您的邮件。当您删除数据时，我们会从磁盘存储中删除文件，而不是执行 SQL DELETE ROW 命令，因为后者可能会在数据库中留下痕迹。

我们实现中的量子加密部分在初始化数据库时使用 ChaCha20-Poly1305 作为密码，为您的数据隐私提供对当前和未来威胁的强力保护。


## 智能队列和重试机制：确保邮件投递 {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

除了邮件头处理之外，我们还通过 `getBounceInfo` 方法实现了智能队列和重试机制。这让您的邮件在出现临时问题时有最佳的投递机会。

```javascript
function getBounceInfo(err) {
  // 使用默认值初始化退信信息
  const bounceInfo = {
    action: err.responseCode >= 500 ? 'reject' : 'defer',
    category: err.category || 'other',
    message: err.message,
    code: err.responseCode || err.code
  };

  // 分析错误响应以确定适当的操作
  const response = err.response || err.message || '';

  // 判断问题是临时还是永久
  if (response.includes('temporarily deferred') ||
      response.includes('try again later')) {
    bounceInfo.action = 'defer';
  }

  // 分类退信原因以便适当处理
  if (response.includes('mailbox full')) {
    bounceInfo.category = 'full';
    bounceInfo.action = 'defer';
  } else if (response.includes('user unknown')) {
    bounceInfo.category = 'unknown';
  }

  return bounceInfo;
}
```

> \[!NOTE]
> 这是 `getBounceInfo` 方法的摘录，并非完整实现。完整代码可在 [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js) 查看。

我们会重试邮件投递长达 5 天，类似于行业标准如 [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\))，给临时问题留出解决时间。这提高了投递成功率，同时保持隐私。

类似地，我们还会在成功投递后对外发 SMTP 邮件的内容进行脱敏处理。此配置在我们的存储系统中，默认保留期为 30 天，您可以在域的高级设置中调整。超过该期限后，邮件内容会自动被脱敏并清除，只保留占位消息：

```txt
此邮件已成功发送。为保障您的安全和隐私，邮件内容已被脱敏并清除。如需延长邮件保留时间，请前往您的域的高级设置页面。
```
这种方法确保您发送的电子邮件不会无限期存储，从而降低数据泄露或未经授权访问您的通信的风险。


## 具有智能速率限制的无限资源 {#unlimited-resources-with-intelligent-rate-limiting}

虽然 Forward Email 提供无限的域名和别名，但我们实施了速率限制，以保护我们的系统免受滥用，并确保所有用户的公平使用。例如，非企业客户每天最多可以创建 50+ 个别名，这防止了我们的数据库被垃圾邮件和洪水攻击，并允许我们的实时滥用和保护功能有效运行。

```javascript
// Rate limiter implementation
const rateLimiter = new RateLimiter({
  // Configuration settings
});

// Check rate limits before processing
const limit = await rateLimiter.get({
  key: `domain:${domain.id}`,
  duration: ms('1d')
});

// Apply appropriate action based on limit status
if (limit.remaining <= 0) {
  // Handle rate limit exceeded
}
```

您可以根据隐私管理的需要创建任意数量的电子邮件地址，而我们的服务对所有用户都保持快速和稳定。


## 用于增强安全性的沙箱加密 {#sandboxed-encryption-for-enhanced-security}

我们的沙箱加密方法提供了一个许多用户在选择电子邮件服务时往往忽视的安全优势。

像 Gmail 和 Proton 这样的服务很可能使用共享的[关系数据库](https://en.wikipedia.org/wiki/Relational_database)，这造成了一个结构性的安全弱点。在共享数据库环境中，如果有人获得了一个用户的数据访问权限，他们可能也有途径访问其他用户的数据。这是因为所有用户数据都存储在相同的数据库表中，仅通过用户 ID 或类似标识符进行区分。

Forward Email 则使用沙箱加密：

1. **完全隔离**：每个用户的数据存储在其自己的加密 SQLite 数据库文件中，完全与其他用户隔离
2. **独立加密密钥**：每个数据库使用从用户密码派生的唯一密钥进行加密
3. **无共享存储**：不同于关系数据库中所有用户的电子邮件可能存储在单一的“emails”表中，我们的方法确保数据不混合
4. **纵深防御**：即使某个用户的数据库被破坏，也无法访问任何其他用户的数据

这种沙箱方法类似于将您的电子邮件存放在一个独立的物理保险库中，而不是在带有内部隔断的共享存储设施中。这种架构增强了您的隐私和安全性。


## 内存中电子邮件处理：无磁盘存储以实现最大隐私 {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

对于我们的电子邮件转发服务，我们完全在内存中处理电子邮件，绝不将其写入磁盘存储或数据库。这可以保护您免受电子邮件监控和元数据收集。

我们电子邮件处理的简化示例：

```javascript
async function onData(stream, _session, fn) {
  // Store clone of session since it gets modified/destroyed
  const session = JSON.parse(safeStringify(_session));

  try {
    // Process the email stream in memory
    const messageSplitter = new MessageSplitter({
      maxBytes: MAX_BYTES
    });
    stream.pipe(messageSplitter);
    const body = await getStream.buffer(messageSplitter);

    const { headers } = messageSplitter;

    // Update session object with useful debug info for error logs
    await updateSession.call(this, body, headers, session);

    // Process the email without storing to disk
    // [Processing code omitted for brevity]

    // Return success without persisting email data
    fn();
  } catch (err) {
    // Handle errors without storing sensitive information
    fn(err);
  }
}
```
这种方法意味着即使我们的服务器被攻破，攻击者也无法访问任何历史邮件数据。您的邮件通过我们的系统后直接送达目的地，不会留下任何痕迹。这种无日志的邮件转发方式保护您的通信免受监控。


## 使用 OpenPGP 实现端到端加密，保障完全隐私 {#end-to-end-encryption-with-openpgp-for-complete-privacy}

对于需要最高级别隐私保护以防止邮件监控的用户，我们支持用于端到端加密的 [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy)。与许多需要专有桥接或应用程序的邮件服务提供商不同，我们的实现兼容标准邮件客户端，使安全通信对所有人都可用。

我们如何实现 OpenPGP 加密：

```javascript
async function encryptMessage(pubKeyArmored, raw, isArmored = true) {
  // [Initial validation code omitted for brevity]

  // Read the public key
  const pubKey = isArmored
    ? await openpgp.readKey({
        armoredKey: tools.prepareArmoredPubKey(pubKeyArmored),
        config: { tolerant: true }
      })
    : pubKeyArmored;

  if (!pubKey) throw new TypeError('Public key does not exist');

  // Perform the actual encryption using OpenPGP
  const ciphertext = await openpgp.encrypt({
    message: await openpgp.createMessage({
      binary: Buffer.concat([Buffer.from(bodyHeaders + '\r\n\r\n'), body])
    }),
    encryptionKeys: pubKey,
    format: 'armored',
    config: { minRSABits: 1024 }
  });

  // Format the encrypted message as a proper MIME message
  // [MIME formatting code omitted for brevity]

  return Buffer.concat([headers, breaker, Buffer.from(text)]);
}
```

此实现确保您的邮件在离开设备之前即被加密，且只有预期收件人能够解密，即使是我们也无法访问您的通信内容。


## 多层内容保护，提供全面安全保障 {#multi-layered-content-protection-for-comprehensive-security}

Forward Email 默认启用多层内容保护：

1. **成人内容保护**：过滤不当内容，同时不影响隐私
2. **[网络钓鱼](https://en.wikipedia.org/wiki/Phishing)保护**：阻止窃取信息的尝试，同时保持匿名
3. **可执行文件保护**：阻止潜在有害附件，无需扫描内容
4. **[病毒](https://en.wikipedia.org/wiki/Computer_virus)保护**：使用隐私保护技术扫描恶意软件

许多提供商将这些功能设为可选启用。我们将其设为默认启用，因此所有用户都默认享有这些保护。


## 我们与其他邮件服务的区别：技术隐私优势 {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

将 Forward Email 与其他邮件服务进行比较时，有几个关键技术差异凸显了我们的隐私优先策略：

### 开源透明，确保隐私可验证 {#open-source-transparency-for-verifiable-privacy}

虽然许多邮件提供商声称开源，但通常其后端代码是封闭的。Forward Email 完全是 [开源](https://en.wikipedia.org/wiki/Open_source) 的，包括前端和后端代码。这种透明度允许对所有组件进行独立安全审计，确保我们的隐私声明可被任何人验证。

### 无供应商锁定，实现无妥协的隐私 {#no-vendor-lock-in-for-privacy-without-compromise}

许多注重隐私的邮件提供商要求您使用其专有应用或桥接。Forward Email 通过 [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol)、[POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) 和 [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) 协议兼容任何标准邮件客户端，让您自由选择喜欢的邮件软件，同时不妥协隐私。
### 真实隔离的沙箱数据 {#sandboxed-data-for-true-isolation}

与使用共享数据库、所有用户数据混合存储的服务不同，我们的沙箱方法确保每个用户的数据完全隔离。这种架构提供了比大多数电子邮件服务更强的隐私保障。

### 数据可移植性与控制权 {#data-portability-and-control}

我们相信您的数据属于您自己，这就是为什么我们让您可以轻松以标准格式（MBOX、EML、SQLite）导出您的邮件，并在您需要时彻底删除您的数据。很少有电子邮件提供商提供这种程度的控制权。


## 以隐私为先的邮件转发的技术挑战 {#the-technical-challenges-of-privacy-first-email-forwarding}

构建一个以隐私为先的电子邮件服务面临技术挑战。我们克服的障碍：

### 无日志邮件处理的内存管理 {#memory-management-for-no-logging-email-processing}

在内存中处理邮件而不使用磁盘存储，需要精心的内存管理以高效处理大量邮件流量。我们的内存优化在不违背无存储政策的前提下保持了可靠的性能。

### 无内容分析的垃圾邮件检测以实现隐私保护过滤 {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

大多数[垃圾邮件](https://en.wikipedia.org/wiki/Email_spam)检测系统依赖于分析邮件内容，这与我们的隐私原则相冲突。我们开发了无需读取邮件内容即可识别垃圾邮件模式的技术。

### 在隐私优先设计中保持兼容性 {#maintaining-compatibility-with-privacy-first-design}

在实现先进隐私功能的同时确保与所有邮件客户端兼容，需要创造性的工程解决方案。我们的团队致力于让隐私功能易于使用，使您无需在便利性和安全性之间做出选择。


## Forward Email 用户的隐私最佳实践 {#privacy-best-practices-for-forward-email-users}

为了最大限度地保护您免受邮件监控并提升使用 Forward Email 时的隐私，我们建议以下最佳实践：

1. **为不同服务使用唯一别名**：为您注册的每个服务创建不同的邮件别名，防止跨服务跟踪
2. **启用 OpenPGP 加密**：对于敏感通信，使用端到端加密以确保完全隐私
3. **定期更换邮件别名**：定期更新重要服务的别名，减少长期数据收集
4. **使用强且唯一的密码**：使用强密码保护您的 Forward Email 账户，防止未经授权访问
5. **实施[IP 地址](https://en.wikipedia.org/wiki/IP_address)匿名化**：考虑结合使用[VPN](https://en.wikipedia.org/wiki/Virtual_private_network)与 Forward Email 实现完全匿名


## 结论：私密邮件转发的未来 {#conclusion-the-future-of-private-email-forwarding}

在 Forward Email，我们将隐私视为一项基本权利。我们的技术实现体现了这一信念，为您提供尊重隐私的邮件转发，保护您免受邮件监控和元数据收集。

在开发服务的过程中，我们持续研究新的加密方法，探索更多隐私保护措施，并优化代码库，致力于提供最安全的邮件体验。

选择 Forward Email，您就是在支持一个以隐私为默认的互联网。
<!-- *Keywords: private email forwarding, email privacy protection, secure email service, open-source email, quantum-safe encryption, OpenPGP email, in-memory email processing, no-log email service, email metadata protection, email header privacy, end-to-end encrypted email, privacy-first email, anonymous email forwarding, email security best practices, email content protection, phishing protection, email virus scanning, privacy-focused email provider, secure email headers, email privacy implementation, protection from email surveillance, no-logging email forwarding, prevent email metadata leakage, email privacy techniques, IP address anonymization for email, private email aliases, email forwarding security, email privacy from advertisers, quantum-resistant email encryption, email privacy without compromise, SQLite email storage, sandboxed email encryption, data portability for email* -->

