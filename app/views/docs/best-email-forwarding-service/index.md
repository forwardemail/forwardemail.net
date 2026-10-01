# How Forward Email Protects Your Privacy, Domain, and Security: The Technical Deep Dive

<!-- <img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Best email forwarding service comparison" class="rounded-lg" /> -->


## Table of Contents

* [Foreword](#foreword)
* [The Forward Email Privacy Philosophy](#the-forward-email-privacy-philosophy)
* [SQLite Implementation: Durability and Portability for Your Data](#sqlite-implementation-durability-and-portability-for-your-data)
* [Smart Queue and Retry Mechanism: Ensuring Email Delivery](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Unlimited Resources with Intelligent Rate Limiting](#unlimited-resources-with-intelligent-rate-limiting)
* [Sandboxed Encryption for Enhanced Security](#sandboxed-encryption-for-enhanced-security)
* [In-Memory Email Processing: No Disk Storage for Maximum Privacy](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [End-to-End Encryption with OpenPGP for Complete Privacy](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Multi-Layered Content Protection for Comprehensive Security](#multi-layered-content-protection-for-comprehensive-security)
* [How We Differ from Other Email Services: The Technical Privacy Advantage](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Open Source Transparency for Verifiable Privacy](#open-source-transparency-for-verifiable-privacy)
  * [No Vendor Lock-In for Privacy Without Compromise](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Sandboxed Data for True Isolation](#sandboxed-data-for-true-isolation)
  * [Data Portability and Control](#data-portability-and-control)
* [The Technical Challenges of Privacy-First Email Forwarding](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Memory Management for No-Logging Email Processing](#memory-management-for-no-logging-email-processing)
  * [Spam Detection Without Content Analysis for Privacy-Preserving Filtering](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Maintaining Compatibility with Privacy-First Design](#maintaining-compatibility-with-privacy-first-design)
* [Privacy Best Practices for Forward Email Users](#privacy-best-practices-for-forward-email-users)
* [Conclusion: The Future of Private Email Forwarding](#conclusion-the-future-of-private-email-forwarding)


## Foreword

Data breaches, surveillance, and targeted advertising based on email content push more users toward services that prioritize privacy. At Forward Email, we built our service from the ground up with privacy as the basis of our architecture. This post covers the technical implementations that make our service one of the most privacy-focused email forwarding solutions available.


## The Forward Email Privacy Philosophy

Our privacy philosophy: **your emails belong to you and only you**. This principle guides every technical decision we make, from how we handle email forwarding to how we implement encryption.

Unlike many email providers who scan your messages for advertising purposes or store them indefinitely on their servers, Forward Email works differently:

1. **In-memory processing only**: We don't store your forwarded emails to disk
2. **No metadata storage**: We don't keep records of who's emailing whom
3. **100% open-source**: Our entire codebase is transparent and auditable
4. **End-to-end encryption**: We support OpenPGP for private communications


## SQLite Implementation: Durability and Portability for Your Data

One of Forward Email's main privacy advantages is our [SQLite](https://en.wikipedia.org/wiki/SQLite) implementation. We've fine-tuned SQLite with specific PRAGMA settings and [Write-Ahead Logging (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) to keep your data durable, portable, private, and secure.

How we've implemented SQLite with [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) as the cipher for quantum-resistant encryption:

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

This implementation keeps your data secure and portable. You can take your email and go at any time by exporting in [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage), or SQLite formats. When you delete your data, we delete the files from disk storage rather than running SQL DELETE ROW commands, which can leave traces in the database.

The quantum-encryption aspect of our implementation uses ChaCha20-Poly1305 as the cipher when we initialize the database, providing strong protection against both current and future threats to your data privacy.


## Smart Queue and Retry Mechanism: Ensuring Email Delivery

Beyond header handling, we've implemented a smart queue and retry mechanism with our `getBounceInfo` method. It gives your emails the best chance of delivery when temporary issues arise.

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
> This is an excerpt of the `getBounceInfo` method and not the actual extensive implementation. For the complete code, you can review it on [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

We retry mail delivery for 5 days, similar to industry standards like [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\)), giving temporary issues time to resolve themselves. This improves delivery rates while maintaining privacy.

On a similar note, we also redact the message content of outbound SMTP emails after successful delivery. This is configured in our storage system with a default retention period of 30 days, which you can adjust in your domain's Advanced Settings. After this period, the email content is automatically redacted and purged, with only a placeholder message remaining:

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```

This approach ensures that your sent emails don't remain stored indefinitely, reducing the risk of data breaches or unauthorized access to your communications.


## Unlimited Resources with Intelligent Rate Limiting

While Forward Email offers unlimited domains and aliases, we've implemented rate limiting to protect our system from abuse and ensure fair usage for all users. For example, non-enterprise customers can create up to 50+ aliases per day, which prevents our database from being spammed and flooded, and allows our real-time abuse and protection features to function effectively.

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

You can create as many email addresses as you need for privacy management, and our service stays fast and stable for all users.


## Sandboxed Encryption for Enhanced Security

Our sandboxed encryption approach provides a security advantage that many users overlook when choosing an email service.

Services like Gmail and Proton most likely use shared [relational databases](https://en.wikipedia.org/wiki/Relational_database), which creates a structural security weakness. In a shared database environment, if someone gains access to one user's data, they potentially have a pathway to access other users' data as well. This is because all user data resides in the same database tables, separated only by user IDs or similar identifiers.

Forward Email uses sandboxed encryption instead:

1. **Complete isolation**: Each user's data is stored in its own encrypted SQLite database file, completely isolated from other users
2. **Independent encryption keys**: Each database is encrypted with its own unique key derived from the user's password
3. **No shared storage**: Unlike relational databases where all users' emails might be in a single "emails" table, our approach ensures no commingling of data
4. **Defense in depth**: Even if one user's database were somehow compromised, it would not provide access to any other user's data

This sandboxed approach is similar to having your email in a separate physical vault rather than in a shared storage facility with internal dividers. This architecture strengthens your privacy and security.


## In-Memory Email Processing: No Disk Storage for Maximum Privacy

For our email forwarding service, we process emails entirely in RAM and never write them to disk storage or databases. This protects you against email surveillance and metadata collection.

A simplified view of our email processing:

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

This approach means that even if our servers were compromised, there would be no historical email data for attackers to access. Your emails pass through our system and go straight to their destination without leaving a trace. This no-logging email forwarding approach protects your communications from surveillance.


## End-to-End Encryption with OpenPGP for Complete Privacy

For users who require the highest level of privacy protection from email surveillance, we support [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) for end-to-end encryption. Unlike many email providers that require proprietary bridges or apps, our implementation works with standard email clients, making secure communication accessible to everyone.

How we implement OpenPGP encryption:

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

This implementation ensures that your emails are encrypted before they leave your device and can only be decrypted by the intended recipient, keeping your communications private even from us.


## Multi-Layered Content Protection for Comprehensive Security

Forward Email enables multiple layers of content protection by default:

1. **Adult content protection**: Filters out inappropriate content without compromising privacy
2. **[Phishing](https://en.wikipedia.org/wiki/Phishing) protection**: Blocks attempts to steal your information while preserving anonymity
3. **Executable protection**: Prevents potentially harmful attachments without scanning content
4. **[Virus](https://en.wikipedia.org/wiki/Computer_virus) protection**: Scans for malware using privacy-preserving techniques

Many providers make these features opt-in. We made them opt-out, so all users get these protections by default.


## How We Differ from Other Email Services: The Technical Privacy Advantage

When comparing Forward Email to other email services, several key technical differences highlight our privacy-first approach:

### Open Source Transparency for Verifiable Privacy

While many email providers claim to be open source, they often keep their backend code closed. Forward Email is 100% [open source](https://en.wikipedia.org/wiki/Open_source), including both frontend and backend code. This transparency allows for independent security auditing of all components, ensuring that our privacy claims can be verified by anyone.

### No Vendor Lock-In for Privacy Without Compromise

Many privacy-focused email providers require you to use their proprietary apps or bridges. Forward Email works with any standard email client through [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), and [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) protocols, giving you the freedom to choose your preferred email software without compromising on privacy.

### Sandboxed Data for True Isolation

Unlike services that use shared databases where all users' data is commingled, our sandboxed approach ensures that each user's data is completely isolated. This architecture provides stronger privacy guarantees than most email services offer.

### Data Portability and Control

We believe that your data belongs to you, which is why we make it easy to export your emails in standard formats (MBOX, EML, SQLite) and fully delete your data when you want to. Few email providers offer this level of control.


## The Technical Challenges of Privacy-First Email Forwarding

Building a privacy-first email service comes with technical challenges. Obstacles we've overcome:

### Memory Management for No-Logging Email Processing

Processing emails in-memory without disk storage requires careful memory management to handle high volumes of email traffic efficiently. Our memory optimizations keep performance reliable without breaking our no-storage policy.

### Spam Detection Without Content Analysis for Privacy-Preserving Filtering

Most [spam](https://en.wikipedia.org/wiki/Email_spam) detection systems rely on analyzing email content, which conflicts with our privacy principles. We've developed techniques to identify spam patterns without reading the content of your emails.

### Maintaining Compatibility with Privacy-First Design

Ensuring compatibility with all email clients while implementing advanced privacy features has required creative engineering solutions. Our team has worked to make privacy features easy to use, so you don't have to choose between convenience and security.


## Privacy Best Practices for Forward Email Users

To maximize your protection against email surveillance and maximize your privacy when using Forward Email, we recommend the following best practices:

1. **Use unique aliases for different services**: Create a different email alias for each service you sign up for to prevent cross-service tracking
2. **Enable OpenPGP encryption**: For sensitive communications, use end-to-end encryption to ensure complete privacy
3. **Regularly rotate your email aliases**: Periodically update aliases for important services to minimize long-term data collection
4. **Use strong, unique passwords**: Protect your Forward Email account with a strong password to prevent unauthorized access
5. **Implement [IP address](https://en.wikipedia.org/wiki/IP_address) anonymization**: Consider using a [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) in conjunction with Forward Email for complete anonymity


## Conclusion: The Future of Private Email Forwarding

At Forward Email, we treat privacy as a fundamental right. Our technical implementations reflect this belief, providing you with email forwarding that respects your privacy at every level and protects you from email surveillance and metadata collection.

As we develop our service, we keep researching new encryption methods, exploring additional privacy protections, and refining our codebase to provide the most secure email experience possible.

By choosing Forward Email, you support an internet where privacy is the default.

<!-- *Keywords: private email forwarding, email privacy protection, secure email service, open-source email, quantum-safe encryption, OpenPGP email, in-memory email processing, no-log email service, email metadata protection, email header privacy, end-to-end encrypted email, privacy-first email, anonymous email forwarding, email security best practices, email content protection, phishing protection, email virus scanning, privacy-focused email provider, secure email headers, email privacy implementation, protection from email surveillance, no-logging email forwarding, prevent email metadata leakage, email privacy techniques, IP address anonymization for email, private email aliases, email forwarding security, email privacy from advertisers, quantum-resistant email encryption, email privacy without compromise, SQLite email storage, sandboxed email encryption, data portability for email* -->
