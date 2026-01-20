# Forward Email 如何保护您的隐私、域名和安全：技术深度探究 {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Best email forwarding service comparison" class="rounded-lg" />

## 目录 {#table-of-contents}

* [前言](#foreword)
* [Forward 电子邮件隐私理念](#the-forward-email-privacy-philosophy)
* [SQLite 实现：数据的持久性和可移植性](#sqlite-implementation-durability-and-portability-for-your-data)
* [智能队列和重试机制：确保电子邮件送达](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [无限资源与智能速率限制](#unlimited-resources-with-intelligent-rate-limiting)
* [沙盒加密增强安全性](#sandboxed-encryption-for-enhanced-security)
* [内存电子邮件处理：无需磁盘存储，最大程度保护隐私](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [使用 OpenPGP 进行端到端加密，确保完全隐私](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [多层内容保护，全面保障安全](#multi-layered-content-protection-for-comprehensive-security)
* [我们与其他电子邮件服务的区别：技术隐私优势](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [开源透明度，实现可验证的隐私](#open-source-transparency-for-verifiable-privacy)
  * [无需供应商锁定，隐私安全无虞](#no-vendor-lock-in-for-privacy-without-compromise)
  * [沙盒数据实现真正隔离](#sandboxed-data-for-true-isolation)
  * [数据可移植性和控制](#data-portability-and-control)
* [隐私优先电子邮件转发的技术挑战](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [无日志电子邮件处理的内存管理](#memory-management-for-no-logging-email-processing)
  * [无需内容分析的垃圾邮件检测，实现隐私保护过滤](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [保持与隐私优先设计的兼容性](#maintaining-compatibility-with-privacy-first-design)
* [转发电子邮件用户的隐私最佳实践](#privacy-best-practices-for-forward-email-users)
* [结论：私人电子邮件转发的未来](#conclusion-the-future-of-private-email-forwarding)

## 前言 {#foreword}

在当今的数字时代，电子邮件隐私比以往任何时候都更加重要。由于数据泄露、监控担忧以及基于电子邮件内容的定向广告，用户越来越寻求以隐私为优先的解决方案。在 Forward Email，我们从一开始就以隐私作为架构的基石来构建我们的服务。这篇博文探讨了使我们的服务成为目前最注重隐私的电子邮件转发解决方案之一的技术实现。

## 转发电子邮件隐私理念 {#the-forward-email-privacy-philosophy}

在深入探讨技术细节之前，务必先了解我们的基本隐私理念：**您的电子邮件只属于您**。从如何处理电子邮件转发到如何实施加密，这一原则指导着我们做出的每一个技术决策。

与许多出于广告目的扫描您的邮件或将其无限期存储在其服务器上的电子邮件提供商不同，转发电子邮件采用了截然不同的运作方式：

1. **仅内存处理** - 我们不会将您转发的邮件存储到磁盘
2. **不存储元数据** - 我们不会记录谁给谁发了邮件
3. **100% 开源** - 我们的整个代码库透明且可审计
4. **端到端加密** - 我们支持 OpenPGP，确保真正的私密通信

## SQLite 实现：数据的持久性和可移植性 {#sqlite-implementation-durability-and-portability-for-your-data}

Forward Email 最显著的隐私优势之一，在于我们精心设计的 [SQLite](https://en.wikipedia.org/wiki/SQLite) 实现。我们通过特定的 PRAGMA 设置和 [预写日志（WAL）](https://en.wikipedia.org/wiki/Write-ahead_logging) 对 SQLite 进行了微调，以确保数据的持久性和可移植性，同时保持最高的隐私和安全标准。

下面我们来看看如何使用 [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) 作为抗量子加密的密码来实现 SQLite：

```javascript
// Initialize the database with better-sqlite3-multiple-ciphers
const Database = require('better-sqlite3-multiple-ciphers');

// Set up encryption with ChaCha20-Poly1305 cipher
db.pragma(`key="${decrypt(session.user.password)}"`);

// Enable Write-Ahead Logging for durability and performance
db.pragma('journal_mode=WAL');

// Overwrite deleted content with zeros for privacy
db.pragma('secure_delete=ON');

// Enable auto vacuum for efficient storage management
db.pragma('auto_vacuum=FULL');

// Set busy timeout for handling concurrent access
db.pragma(`busy_timeout=${config.busyTimeout}`);

// Optimize synchronization for reliability
db.pragma('synchronous=NORMAL');

// Enable foreign key constraints for data integrity
db.pragma('foreign_keys=ON');

// Set UTF-8 encoding for international character support
db.pragma(`encoding='UTF-8'`);

// Optimize database performance
db.pragma('optimize=0x10002;');

// Use disk for temporary storage instead of memory
db.pragma('temp_store=1;');
```

此方案不仅确保您的数据安全，而且便于携带。您可以随时将电子邮件导出为 [MBOX](https://en.wikipedia.org/wiki/Email#Storage)、[EML](https://en.wikipedia.org/wiki/Email#Storage) 或 SQLite 格式，轻松携带。即使您想删除数据，数据也真的消失了——我们只需从磁盘存储中删除文件，无需运行 SQL DELETE ROW 命令，因为这些命令会在数据库中留下痕迹。

我们实施的量子加密方面在初始化数据库时使用 ChaCha20-Poly1305 作为密码，为您的数据隐私提供强有力的保护，以抵御当前和未来的威胁。

## 智能队列和重试机制：确保电子邮件送达 {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

我们不再仅仅关注邮件头的处理，而是通过 `getBounceInfo` 方法实现了一套完善的智能队列和重试机制。该系统确保您的邮件即使在出现临时问题时也能获得最佳的投递机会。

```javascript
function getBounceInfo(err) {
  // Initialize bounce info with default values
  const bounceInfo = {
    action: err.responseCode >= 500 ? 'reject' : 'defer',
    category: err.category || 'other',
    message: err.message,
    code: err.responseCode || err.code
  };

  // Analyze error response to determine appropriate action
  const response = err.response || err.message || '';

  // Determine if the issue is temporary or permanent
  if (response.includes('temporarily deferred') ||
      response.includes('try again later')) {
    bounceInfo.action = 'defer';
  }

  // Categorize the bounce reason for appropriate handling
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
> 这是 `getBounceInfo` 方法的摘录，而非实际的完整实现。完整代码可在 [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js) 中查看。

我们会按照行业标准（例如 [后缀](https://en.wikipedia.org/wiki/Postfix_\(software\)）重试邮件投递 5 天，以便临时问题有时间自行解决。这种方法在保障隐私的同时，显著提高了邮件投递率。

同样，我们也会在成功投递后屏蔽外发 SMTP 邮件的内容。此功能在我们的存储系统中配置，默认保留期为 30 天，您可以在域名的“高级设置”中调整。超过此期限后，邮件内容将自动屏蔽并清除，只留下一条占位符消息：

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```

这种方法可确保您发送的电子邮件不会无限期地存储，从而降低数据泄露或未经授权访问您的通信的风险。

## 无限资源，智能速率限制 {#unlimited-resources-with-intelligent-rate-limiting}

虽然 Forward Email 提供无限的域名和别名，但我们实施了智能速率限制，以保护我们的系统免受滥用，并确保所有用户的公平使用。例如，非企业客户每天最多可以创建 50 个以上的别名，这可以防止我们的数据库受到垃圾邮件和洪水攻击，并确保我们的实时滥用和保护功能有效运行。

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

这种平衡的方法为您提供了灵活性，您可以根据需要创建尽可能多的电子邮件地址，以进行全面的隐私管理，同时仍然为所有用户保持我们服务的完整性和性能。

## 沙盒加密，增强安全性 {#sandboxed-encryption-for-enhanced-security}

我们独特的沙盒加密方法提供了一项关键的安全优势，而许多用户在选择电子邮件服务时却忽略了这一点。让我们来探讨一下沙盒数据（尤其是电子邮件）为何如此重要。

Gmail 和 Proton 等服务很可能使用了共享的 [关系数据库](https://en.wikipedia.org/wiki/Relational_database)，这会带来根本性的安全漏洞。在共享数据库环境中，如果有人获得了某个用户数据的访问权限，他们就有可能获得访问其他用户数据的途径。这是因为所有用户数据都驻留在同一个数据库表中，仅通过用户 ID 或类似的标识符进行分隔。

通过我们的沙盒加密，转发电子邮件采用了根本不同的方法：

1. **完全隔离**：每个用户的数据都存储在各自独立的加密 SQLite 数据库文件中，与其他用户完全隔离。
2. **独立加密密钥**：每个数据库都使用从用户密码派生的唯一密钥进行加密。
3. **无共享存储**：与关系型数据库不同，在关系型数据库中，所有用户的电子邮件地址可能都存储在一个“电子邮件”表中，而我们的方法可确保数据不会混合。
4. **纵深防御**：即使某个用户的数据库以某种方式遭到入侵，也无法访问其他用户的数据。

这种沙盒化方法类似于将您的电子邮件存放在一个独立的物理保管库中，而不是存放在带有内部隔板的共享存储设施中。这是一个根本性的架构差异，可显著增强您的隐私和安全性。

## 内存电子邮件处理：无需磁盘存储即可实现最大程度的隐私 {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

对于我们的电子邮件转发服务，我们完全在 RAM 中处理电子邮件，绝不会将其写入磁盘存储或数据库。这种方法提供了无与伦比的保护，可有效防止电子邮件被监控和元数据被收集。

以下是我们的电子邮件处理流程的简化视图：

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

这种方法意味着，即使我们的服务器遭到入侵，攻击者也无法获取任何历史电子邮件数据。您的电子邮件只需通过我们的系统，即可立即转发至目的地，不留任何痕迹。这种无日志电子邮件转发方法对于保护您的通信免受监控至关重要。

## 使用 OpenPGP 进行端到端加密，实现完全隐私 {#end-to-end-encryption-with-openpgp-for-complete-privacy}

对于需要最高级别隐私保护以抵御电子邮件监控的用户，我们支持 [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) 端到端加密。与许多需要专有桥接器或应用程序的电子邮件提供商不同，我们的实现与标准电子邮件客户端兼容，确保每个人都能享受安全的通信。

以下是我们实现 OpenPGP 加密的方法：

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

此方案可确保您的电子邮件在离开您的设备之前就已加密，并且只有预期的收件人才能解密，从而确保您的通信内容即使对我们而言也保持私密。这对于保护敏感通信免遭未经授权的访问和监控至关重要。

## 多层内容保护，全面保障安全 {#multi-layered-content-protection-for-comprehensive-security}

Forward Email 提供多层内容保护，这些保护默认启用，可提供针对各种威胁的全面安全保护：

1. **成人内容保护** - 过滤不适当内容，同时不损害隐私
2. **[网络钓鱼](https://en.wikipedia.org/wiki/Phishing) 保护** - 阻止窃取您信息的企图，同时保持匿名
3. **可执行文件保护** - 无需扫描内容即可阻止潜在有害附件
4. **[病毒](https://en.wikipedia.org/wiki/Computer_virus) 保护** - 使用隐私保护技术扫描恶意软件

与许多提供商将这些功能设置为可选功能不同，我们将其设置为可选功能，以确保所有用户默认享受这些保护。这种方法体现了我们对隐私和安全的承诺，实现了许多电子邮件服务无法实现的平衡。

## 我们与其他电子邮件服务的区别：技术隐私优势 {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

将转发电子邮件与其他电子邮件服务进行比较时，几个关键的技术差异凸显了我们的隐私优先方法：

### 开源透明度，实现可验证的隐私 {#open-source-transparency-for-verifiable-privacy}

虽然许多电子邮件提供商声称自己是开源的，但他们通常保持后端代码的封闭性。Forward Email 100% [开源](https://en.wikipedia.org/wiki/Open_source)，包括前端和后端代码。这种透明性允许对所有组件进行独立的安全审计，确保我们的隐私声明能够被任何人验证。

### 无需供应商锁定，隐私无虞 {#no-vendor-lock-in-for-privacy-without-compromise}

许多注重隐私的电子邮件提供商要求您使用其专有应用程序或桥接器。Forward Email 通过 [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol)、[POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) 和 [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) 协议与任何标准电子邮件客户端兼容，让您可以自由选择您喜欢的电子邮件软件，而不会损害您的隐私。

### 沙盒数据，实现真正的隔离 {#sandboxed-data-for-true-isolation}

与使用共享数据库的服务（所有用户的数据都会混杂在一起）不同，我们的沙盒方法确保每个用户的数据完全隔离。这种根本性的架构差异提供了比大多数电子邮件服务更强大的隐私保障。

### 数据可移植性和控制 {#data-portability-and-control}

我们相信您的数据属于您，因此我们简化了以标准格式（MBOX、EML、SQLite）导出电子邮件的功能，并在您需要时真正删除您的数据。这种级别的控制在电子邮件提供商中并不常见，但对于真正的隐私保护至关重要。

## 隐私优先电子邮件转发的技术挑战 {#the-technical-challenges-of-privacy-first-email-forwarding}

构建隐私至上的电子邮件服务面临着巨大的技术挑战。以下是我们克服的一些挑战：

### 无日志电子邮件处理的内存管理 {#memory-management-for-no-logging-email-processing}

在没有磁盘存储的情况下，在内存中处理电子邮件需要谨慎的内存管理，才能高效地处理大量电子邮件流量。我们实施了先进的内存优化技术，以确保可靠的性能，同时又不损害我们的无存储政策——这是我们隐私保护策略的关键组成部分。

### 无需内容分析即可进行隐私保护过滤的垃圾邮件检测 {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

大多数 [垃圾邮件](https://en.wikipedia.org/wiki/Email_spam) 检测系统依赖于分析电子邮件内容，这与我们的隐私原则相冲突。我们开发了无需阅读电子邮件内容即可识别垃圾邮件模式的技术，在隐私和可用性之间取得平衡，从而保护您的通信机密性。

### 保持与隐私优先设计的兼容性 {#maintaining-compatibility-with-privacy-first-design}

确保与所有电子邮件客户端兼容，同时实现高级隐私功能，需要富有创意的工程解决方案。我们的团队不懈努力，致力于实现无缝隐私保护，让您在保护电子邮件通信时无需在便捷性和安全性之间做出取舍。

## 转发电子邮件用户的隐私最佳实践 {#privacy-best-practices-for-forward-email-users}

为了最大限度地防止电子邮件监视并在使用“转发电子邮件”时最大限度地保护您的隐私，我们建议您采取以下最佳做法：

1. **为不同的服务使用不同的别名** - 为您注册的每项服务创建不同的电子邮件别名，以防止跨服务跟踪
2. **启用 OpenPGP 加密** - 对于敏感通信，请使用端到端加密以确保完全的隐私
3. **定期轮换您的电子邮件别名** - 定期更新重要服务的别名，以最大限度地减少长期数据收集
4. **使用强大的唯一密码** - 使用强密码保护您的转发电子邮件帐户，以防止未经授权的访问
5. **实施 [IP 地址](https://en.wikipedia.org/wiki/IP_address) 匿名化** - 考虑将 [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) 与转发电子邮件结合使用，以实现完全匿名

## 结论：私人电子邮件转发的未来 {#conclusion-the-future-of-private-email-forwarding}

在 Forward Email，我们相信隐私不仅仅是一项功能，更是一项基本权利。我们的技术实现也体现了这一理念，为您提供全方位尊重您隐私的电子邮件转发服务，并保护您免受电子邮件监控和元数据收集的侵害。

随着我们不断开发和改进服务，我们对隐私的承诺始终坚定不移。我们不断研究新的加密方法，探索额外的隐私保护措施，并不断优化我们的代码库，以提供尽可能最安全的电子邮件体验。

选择“转发电子邮件”，您不仅仅是选择了一项电子邮件服务，更是在支持互联网的愿景：隐私是默认的，而非例外。加入我们，通过一封邮件，构建更私密的数字未来。

<!-- *关键词：私人电子邮件转发、电子邮件隐私保护、安全电子邮件服务、开源电子邮件、量子安全加密、OpenPGP 电子邮件、内存电子邮件处理、无日志电子邮件服务、电子邮件元数据保护、电子邮件标头隐私、端到端加密电子邮件、隐私优先电子邮件、匿名电子邮件转发、电子邮件安全最佳实践、电子邮件内容保护、网络钓鱼防护、电子邮件病毒扫描、以隐私为中心的电子邮件提供商、安全电子邮件标头、电子邮件隐私实施、防止电子邮件监视、无日志电子邮件转发、防止电子邮件元数据泄露、电子邮件隐私技术、电子邮件的 IP 地址匿名化、私人电子邮件别名、电子邮件转发安全、来自广告商的电子邮件隐私、抗量子电子邮件加密、不受损害的电子邮件隐私、SQLite 电子邮件存储、沙盒电子邮件加密、电子邮件的数据可移植性* -->