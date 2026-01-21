# Why Open-Source Email is the Future: The Forward Email Advantage

<img loading="lazy" src="/img/articles/open-source.webp" alt="Open source email security and privacy" class="rounded-lg" />


## Table of Contents

* [Foreword](#foreword)
* [The Open-Source Advantage: More Than Just Marketing](#the-open-source-advantage-more-than-just-marketing)
  * [What True Open-Source Means](#what-true-open-source-means)
  * [The Backend Problem: Where Most "Open-Source" Email Services Fall Short](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Forward Email: 100% Open-Source, Frontend AND Backend](#forward-email-100-open-source-frontend-and-backend)
  * [Our Unique Technical Approach](#our-unique-technical-approach)
* [The Self-Hosting Option: Freedom of Choice](#the-self-hosting-option-freedom-of-choice)
  * [Why We Support Self-Hosting](#why-we-support-self-hosting)
  * [The Reality of Self-Hosting Email](#the-reality-of-self-hosting-email)
* [Why Our Paid Service Makes Sense (Even Though We're Open-Source)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Cost Comparison](#cost-comparison)
  * [The Best of Both Worlds](#the-best-of-both-worlds)
* [The Closed-Source Deception: What Proton and Tutanota Don't Tell You](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Proton Mail's Open-Source Claims](#proton-mails-open-source-claims)
  * [Tutanota's Similar Approach](#tutanotas-similar-approach)
  * [The Privacy Guides Debate](#the-privacy-guides-debate)
* [The Future is Open-Source](#the-future-is-open-source)
  * [Why Open-Source is Winning](#why-open-source-is-winning)
* [Making the Switch to Forward Email](#making-the-switch-to-forward-email)
* [Conclusion: Open-Source Email for a Private Future](#conclusion-open-source-email-for-a-private-future)


## Foreword

In an era where digital privacy concerns are at an all-time high, the email services we choose matter more than ever. While many providers claim to prioritize your privacy, there's a fundamental difference between those who merely talk about privacy and those who truly walk the walk. At Forward Email, we've built our service on a foundation of complete transparency through open-source development—not just in our frontend applications, but in our entire infrastructure.

This blog post explores why open-source email solutions are superior to closed-source alternatives, how our approach differs from competitors like Proton Mail and Tutanota, and why—despite our commitment to self-hosting options—our paid service offers the best value for most users.


## The Open-Source Advantage: More Than Just Marketing

The term "open-source" has become a popular marketing buzzword in recent years, with the global open-source services market projected to grow at a CAGR of over 16% between 2024 and 2032\[^1]. But what does being truly open-source mean, and why does it matter for your email privacy?

### What True Open-Source Means

Open-source software makes its entire source code freely available for anyone to inspect, modify, and enhance. This transparency creates an environment where:

* Security vulnerabilities can be identified and fixed by a global community of developers
* Privacy claims can be verified through independent code review
* Users aren't locked into proprietary ecosystems
* Innovation happens faster through collaborative improvement

When it comes to email—the backbone of your online identity—this transparency isn't just nice to have; it's essential for genuine privacy and security.

### The Backend Problem: Where Most "Open-Source" Email Services Fall Short

Here's where things get interesting. Many popular "privacy-focused" email providers advertise themselves as open-source, but there's a critical distinction they hope you won't notice: **they only open-source their frontends while keeping their backends closed**.

What does this mean? The frontend is what you see and interact with—the web interface or mobile app. The backend is where the actual email processing happens—where your messages are stored, encrypted, and transmitted. When a provider keeps their backend closed-source:

1. You can't verify how your emails are actually being processed
2. You can't confirm if their privacy claims are legitimate
3. You're trusting marketing claims rather than verifiable code
4. Security vulnerabilities may remain hidden from public scrutiny

As discussions on Privacy Guides forums have highlighted, both Proton Mail and Tutanota claim to be open-source, but their backends remain closed and proprietary\[^2]. This creates a significant trust gap—you're asked to believe their privacy promises without the ability to verify them.


## Forward Email: 100% Open-Source, Frontend AND Backend

At Forward Email, we've taken a fundamentally different approach. Our entire codebase—both frontend and backend—is open-source and available for anyone to inspect at <https://github.com/forwardemail/forwardemail.net>.

This means:

1. **Complete Transparency**: Every line of code that processes your emails is available for public scrutiny.
2. **Verifiable Privacy**: Our privacy claims aren't marketing speak—they're verifiable facts that anyone can confirm by examining our code.
3. **Community-Driven Security**: Our security is strengthened by the collective expertise of the global developer community.
4. **No Hidden Functionality**: What you see is what you get—no hidden tracking, no secret backdoors.

### Our Unique Technical Approach

Our commitment to privacy goes beyond just being open-source. We've implemented several technical innovations that set us apart:

#### Individually Encrypted SQLite Mailboxes

Unlike traditional email providers that use shared relational databases (where a single breach could expose all users' data), we use individually encrypted SQLite files for each mailbox. This means:

* Each mailbox is a separate encrypted file
* Access to one user's data doesn't grant access to others
* Even our own employees cannot access your data—it's a core design decision

As we explained in Privacy Guides discussions:

> "Shared relational databases (e.g., MongoDB, SQL Server, PostgreSQL, Oracle, MySQL, etc) all require a login (with user/password) to establish the database connection. This means that anyone with this password could query the database for anything. Be it a rogue employee or evil maid attack. This also means that having access to one user's data means you also have access to everyone else's. On the other hand, SQLite could be considered a shared database, but how we use it (each mailbox = individual SQLite file) makes it sandboxed."\[^3]

#### Quantum-Resistant Encryption

While other providers are still catching up, we've already implemented quantum-resistant encryption methods to future-proof your email privacy against emerging threats from quantum computing.

#### No Third-Party Dependencies

Unlike competitors who rely on services like Amazon SES for email delivery, we've built our entire infrastructure in-house. This eliminates potential privacy leaks through third-party services and gives us complete control over the entire email pipeline.


## The Self-Hosting Option: Freedom of Choice

One of the most powerful aspects of open-source software is the freedom it provides. With Forward Email, you're never locked in—you can self-host our entire platform if you choose to.

### Why We Support Self-Hosting

We believe in giving users complete control over their data. That's why we've made our entire platform self-hostable with comprehensive documentation and setup guides. This approach:

* Provides maximum control for technically-inclined users
* Eliminates any need to trust us as a service provider
* Allows for customization to meet specific requirements
* Ensures the service can continue even if our company doesn't

### The Reality of Self-Hosting Email

While self-hosting is a powerful option, it's important to understand the real costs involved:

#### Financial Costs

* VPS or server costs: $5-$50/month for a basic setup\[^4]
* Domain registration and renewal: $10-20/year
* SSL certificates (though Let's Encrypt offers free options)
* Potential costs for monitoring services and backup solutions

#### Time Costs

* Initial setup: Several hours to days depending on technical expertise
* Ongoing maintenance: 5-10 hours/month for updates, security patches, and troubleshooting\[^5]
* Learning curve: Understanding email protocols, security best practices, and server administration

#### Technical Challenges

* Email deliverability issues (messages being marked as spam)
* Keeping up with evolving security standards
* Ensuring high availability and reliability
* Managing spam filtering effectively

As one experienced self-hoster put it: "Email is a commodity service... It is cheaper to host my email at \[a provider] than it is to spend money *and* time self hosting it."\[^6]


## Why Our Paid Service Makes Sense (Even Though We're Open-Source)

Given the challenges of self-hosting, our paid service offers the best of both worlds: the transparency and security of open-source with the convenience and reliability of a managed service.

### Cost Comparison

When you factor in both financial and time costs, our paid service offers exceptional value:

* **Self-hosting total cost**: $56-$252/month (including server costs and time valuation)
* **Forward Email paid plans**: $3-$9/month

Our paid service provides:

* Professional management and maintenance
* Established IP reputation for better deliverability
* Regular security updates and monitoring
* Support when issues arise
* All the privacy benefits of our open-source approach

### The Best of Both Worlds

By choosing Forward Email, you get:

1. **Verifiable Privacy**: Our open-source codebase means you can trust our privacy claims
2. **Professional Management**: No need to become an email server expert
3. **Cost-Effectiveness**: Lower total cost than self-hosting
4. **Freedom from Lock-in**: The option to self-host always remains available


## The Closed-Source Deception: What Proton and Tutanota Don't Tell You

Let's take a closer look at how our approach differs from popular "privacy-focused" email providers.

### Proton Mail's Open-Source Claims

Proton Mail advertises itself as open-source, but this only applies to their frontend applications. Their backend—where your emails are actually processed and stored—remains closed-source\[^7]. This means:

* You can't verify how your emails are being handled
* You must trust their privacy claims without verification
* Security vulnerabilities in their backend remain hidden from public scrutiny
* You're locked into their ecosystem without self-hosting options

### Tutanota's Similar Approach

Like Proton Mail, Tutanota only open-sources their frontend while keeping their backend proprietary\[^8]. They face the same trust issues:

* No way to verify backend privacy claims
* Limited transparency into actual email processing
* Potential security issues hidden from public view
* Vendor lock-in with no self-hosting option

### The Privacy Guides Debate

These limitations haven't gone unnoticed in the privacy community. In discussions on Privacy Guides, we highlighted this critical distiction:

> "It states that both Protonmail and Tuta are closed source. Because their backend is indeed closed source."\[^9]

We also stated:

> "There have been zero publicly shared audits of any currently listed PG email service provider's backend infrastructures nor open source code snippets shared of how they process inbound email."\[^10]

This lack of transparency creates a fundamental trust problem. Without open-source backends, users are forced to take privacy claims on faith rather than verification.


## The Future is Open-Source

The trend toward open-source solutions is accelerating across the software industry. According to recent research:

* Open-source software market is growing from $41.83 billion in 2024 to $48.92 billion in 2025\[^11]
* 80% of companies report increased use of open-source over the past year\[^12]
* The adoption of open-source is projected to continue its rapid expansion

This growth reflects a fundamental shift in how we think about software security and privacy. As users become more privacy-conscious, the demand for verifiable privacy through open-source solutions will only increase.

### Why Open-Source is Winning

The advantages of open-source are becoming increasingly clear:

1. **Security Through Transparency**: Open-source code can be reviewed by thousands of experts, not just an internal team
2. **Faster Innovation**: Collaborative development accelerates improvement
3. **Trust Through Verification**: Claims can be verified rather than taken on faith
4. **Freedom from Vendor Lock-in**: Users maintain control over their data and services
5. **Community Support**: A global community helps identify and fix issues


## Making the Switch to Forward Email

Moving to Forward Email is straightforward, whether you're coming from a mainstream provider like Gmail or another privacy-focused service like Proton Mail or Tutanota.

Our service offers:

* Unlimited domains and aliases
* Standard protocol support (SMTP, IMAP, POP3) without proprietary bridges
* Seamless integration with existing email clients
* Simple setup process with comprehensive documentation
* Affordable pricing plans starting at just $3/month


## Conclusion: Open-Source Email for a Private Future

In a world where digital privacy is increasingly under threat, the transparency of open-source solutions provides a crucial safeguard. At Forward Email, we're proud to be leading the way with our fully open-source approach to email privacy.

Unlike competitors who only partially embrace open-source, we've made our entire platform—frontend and backend—available for public scrutiny. This commitment to transparency, combined with our innovative technical approach, provides a level of verifiable privacy that closed-source alternatives simply cannot match.

Whether you choose to use our managed service or self-host our platform, you benefit from the security, privacy, and peace of mind that comes from truly open-source email.

The future of email is open, transparent, and privacy-focused. The future is Forward Email.

\[^1]: SNS Insider. "The Open Source Services Market was valued at USD 28.6 billion in 2023 and will reach to USD 114.8 Billion by 2032, growing at a CAGR of 16.70% by 2032." [Open Source Services Market Size & Analysis Report 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. "Generally, you can expect to spend anywhere from $5 to $50 monthly for a basic virtual private server (VPS) to run your email server." [10 Best Self-Hosted Email Server Platforms to Use in 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Mail-in-a-Box Forum. "Maintenance took me maybe 16 hours in that period..." [Self hosting mail server frowned upon](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)

\[^6]: Reddit r/selfhosted. "TL:DR: As everything self hosted, IT WILL REQUIRE YOUR TIME. If you don't have time to spend on it, it's always better to stick with a hosted..." [Self-hosting an email server? Why or why not? What's popular?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: Forward Email. "Proton Mail claims to be open-source, but their back-end actually is closed source." [Tutanota vs Proton Mail Comparison (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: Forward Email. "Tutanota claims to be open-source, but their back-end is actually closed-source." [Proton Mail vs Tutanota Comparison (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Privacy Guides Community. "It states that both Protonmail and Tuta are closed source. Because their backend is indeed closed source." [Forward Email (email provider) - Site Development / Tool Suggestions](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Privacy Guides Community. "There have been zero publicly shared audits of any currently listed PG email service provider's backend infrastructures nor open source code snippets shared of how they process inbound email." [Forward Email (email provider) - Site Development / Tool Suggestions](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. "The open source software market will grow from USD 41.83 billion in 2024 to USD 48.92 billion in 2025 at a compound..." [What Is Open Source Software?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. "With 80% of companies reporting increased utilization of open source technologies over the past year, it's..." [Emerging Trends in Open Source Communities 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)
