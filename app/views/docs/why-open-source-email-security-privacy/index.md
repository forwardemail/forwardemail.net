# Why Open-Source Email is the Future: The Forward Email Advantage

<!-- <img loading="lazy" src="/img/articles/open-source.webp" alt="Open source email security and privacy" class="rounded-lg" /> -->


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

Many email providers claim to prioritize your privacy, but few let you verify it. At Forward Email, we've built our service on open-source development across our entire infrastructure, frontend and backend.

This blog post explores why open-source email solutions are superior to closed-source alternatives, how our approach differs from competitors like Proton Mail and Tutanota, and why our paid service offers the best value for most users, even though you can self-host.


## The Open-Source Advantage: More Than Just Marketing

The term "open-source" has become a popular marketing buzzword in recent years, with the global open-source services market projected to grow at a CAGR of over 16% between 2024 and 2032\[^1].

### What True Open-Source Means

Open-source software makes its entire source code freely available for anyone to inspect, modify, and enhance. This transparency creates an environment where:

* Security vulnerabilities can be identified and fixed by a global community of developers
* Privacy claims can be verified through independent code review
* Users aren't locked into proprietary ecosystems
* Innovation happens faster through collaborative improvement

Email is the backbone of your online identity, so this transparency is essential for privacy and security.

### The Backend Problem: Where Most "Open-Source" Email Services Fall Short

Many popular "privacy-focused" email providers advertise themselves as open-source, but there's a critical distinction they hope you won't notice: **they only open-source their frontends while keeping their backends closed**.

The frontend is what you see and interact with: the web interface or mobile app. The backend processes your email: it stores, encrypts, and transmits your messages. When a provider keeps their backend closed-source:

1. You can't verify how they process your emails
2. You can't confirm if their privacy claims are legitimate
3. You're trusting marketing claims rather than verifiable code
4. Security vulnerabilities may remain hidden from public scrutiny

As discussions on Privacy Guides forums have highlighted, both Proton Mail and Tutanota claim to be open-source, but their backends remain closed and proprietary\[^2]. You're asked to believe their privacy promises without the ability to verify them.


## Forward Email: 100% Open-Source, Frontend AND Backend

At Forward Email, our entire codebase (frontend and backend) is open-source and available for anyone to inspect at <https://github.com/forwardemail/forwardemail.net>.

This means:

1. **Complete Transparency**: Every line of code that processes your emails is available for public scrutiny.
2. **Verifiable Privacy**: Anyone can confirm our privacy claims by examining our code.
3. **Community-Driven Security**: Our security is strengthened by the collective expertise of the global developer community.
4. **No Hidden Functionality**: The published code is the code we run, with no hidden tracking or secret backdoors.

### Our Unique Technical Approach

Beyond publishing our code, we've built several technical features that set us apart:

#### Individually Encrypted SQLite Mailboxes

Unlike traditional email providers that use shared relational databases (where a single breach could expose all users' data), we use individually encrypted SQLite files for each mailbox. This means:

* Each mailbox is a separate encrypted file
* Access to one user's data doesn't grant access to others
* Even our own employees cannot access your data, by design

As we explained in Privacy Guides discussions:

> "Shared relational databases (e.g., MongoDB, SQL Server, PostgreSQL, Oracle, MySQL, etc) all require a login (with user/password) to establish the database connection. This means that anyone with this password could query the database for anything. Be it a rogue employee or evil maid attack. This also means that having access to one user's data means you also have access to everyone else's. On the other hand, SQLite could be considered a shared database, but how we use it (each mailbox = individual SQLite file) makes it sandboxed."\[^3]

#### Quantum-Resistant Encryption

While other providers are still catching up, we've already implemented quantum-resistant encryption methods to future-proof your email privacy against emerging threats from quantum computing.

#### No Third-Party Dependencies

Some competitors rely on services like Amazon SES for email delivery. We built our entire infrastructure in-house. This eliminates potential privacy leaks through third-party services and gives us complete control over the entire email pipeline.


## The Self-Hosting Option: Freedom of Choice

Open-source software means you're never locked in. You can self-host the entire Forward Email platform if you choose to.

### Why We Support Self-Hosting

We made our entire platform self-hostable, with documentation and setup guides, so you keep control of your data. This approach:

* Provides maximum control for technically-inclined users
* Eliminates any need to trust us as a service provider
* Allows for customization to meet specific requirements
* Ensures the service can continue even if our company doesn't

### The Reality of Self-Hosting Email

Self-hosting has real costs:

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

Our paid service combines the transparency and security of open-source with the convenience and reliability of a managed service.

### Cost Comparison

When you factor in both financial and time costs, our paid service costs less:

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

Here is how our approach compares with popular "privacy-focused" email providers.

### Proton Mail's Open-Source Claims

Proton Mail advertises itself as open-source, but this only applies to their frontend applications. Their backend, which processes and stores your emails, remains closed-source\[^7]. This means:

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

Without open-source backends, users have to take privacy claims on faith.


## The Future is Open-Source

Open-source adoption is growing across the software industry. According to recent research:

* Open-source software market is growing from $41.83 billion in 2024 to $48.92 billion in 2025\[^11]
* 80% of companies report increased use of open-source over the past year\[^12]
* The adoption of open-source is projected to continue its rapid expansion

As users become more privacy-conscious, we expect demand for verifiable privacy through open-source solutions to grow.

### Why Open-Source is Winning

Open-source offers these advantages:

1. **Security Through Transparency**: Thousands of outside experts can review open-source code, in addition to an internal team
2. **Faster Innovation**: Collaborative development accelerates improvement
3. **Trust Through Verification**: Claims can be verified rather than taken on faith
4. **Freedom from Vendor Lock-in**: Users maintain control over their data and services
5. **Community Support**: A global community helps identify and fix issues


## Making the Switch to Forward Email

Moving to Forward Email is straightforward, whether you're coming from a mainstream provider like Gmail or another privacy-focused service like Proton Mail or Tutanota.

Our service offers:

* Unlimited domains and aliases
* Standard protocol support (SMTP, IMAP, POP3) without proprietary bridges
* Integration with existing email clients
* Simple setup process with documentation
* Affordable pricing plans starting at $3/month


## Conclusion: Open-Source Email for a Private Future

Open-source code lets you check a provider's privacy claims. Forward Email takes a fully open-source approach to email privacy.

Some competitors open-source only part of their stack. We've made our entire platform, frontend and backend, available for public scrutiny, so you can verify our privacy claims in a way closed-source alternatives don't allow.

You can use our managed service or self-host our platform and get the same open-source security and privacy either way.

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
