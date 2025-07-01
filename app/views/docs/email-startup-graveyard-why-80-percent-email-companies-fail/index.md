# The Email Startup Graveyard: Why 80%+ of Email Companies Fail

<img loading="lazy" src="/img/articles/email-startup-graveyard.webp" alt="" class="rounded-lg" />

<p class="lead mt-3">While countless email startups have burned through millions solving non-existent problems, we at <a href="https://forwardemail.net">Forward Email</a> have quietly built actual email infrastructure from scratch since 2017—proving that sustainable email services require engineering, not just venture capital.  This is an exhaustive analysis of email startup failures, acquisitions, and the fundamental misunderstanding of what email actually is.</p>

> \[!WARNING]
> **TL;DR**: Stop building email apps. Email isn't broken. This post documents why 80%+ of email startups fail and why you shouldn't be the next one.

> \[!NOTE]
> **Key Insight**: Most email startups don't build actual email infrastructure from scratch. They're just glue on top of Amazon SES or leveraging existing open-source solutions like Cyrus/Postfix (Fastmail, Resend, etc.). The infrastructure works perfectly - the problem is thinking it needs "improvement."


## Table of Contents

* [The Email Startup Failure Matrix](#the-email-startup-failure-matrix)
* [The Infrastructure Reality Check](#the-infrastructure-reality-check)
  * [What Actually Runs Email](#what-actually-runs-email)
  * [What "Email Startups" Actually Build](#what-email-startups-actually-build)
* [Case Study: The Skiff Disaster](#case-study-the-skiff-disaster)
  * [The Setup](#the-setup)
  * [The Acquisition](#the-acquisition)
  * [The Reality](#the-reality)
* [Case Study: When Email Infrastructure Goes Wrong](#case-study-when-email-infrastructure-goes-wrong)
  * [Resend's Security Meltdown](#resends-security-meltdown)
  * [ActiveCampaign's Postmark Acquisition: A Cautionary Tale](#activecampaigns-postmark-acquisition-a-cautionary-tale)
  * [MailGun: Customer Service Breakdown](#mailgun-customer-service-breakdown)
* [The Accelerator Analysis](#the-accelerator-analysis)
  * [Y Combinator: The Email App Factory](#y-combinator-the-email-app-factory)
  * [Techstars: The Email Graveyard](#techstars-the-email-graveyard)
* [Why Email Startups Always Fail](#why-email-startups-always-fail)
  * [1. Email Isn't Broken](#1-email-isnt-broken)
  * [2. Network Effects Are Unbreakable](#2-network-effects-are-unbreakable)
  * [3. They're Solving Non-Problems](#3-theyre-solving-non-problems)
  * [4. Technical Debt Is Massive](#4-technical-debt-is-massive)
  * [5. The Infrastructure Already Exists](#5-the-infrastructure-already-exists)
* [The Venture Capital Trap](#the-venture-capital-trap)
* [The Technical Reality: Modern Email Stacks](#the-technical-reality-modern-email-stacks)
  * [What Actually Powers "Email Startups"](#what-actually-powers-email-startups)
  * [The Performance Problems](#the-performance-problems)
* [The Acquisition-to-Shutdown Pipeline](#the-acquisition-to-shutdown-pipeline)
  * [The Standard Pattern](#the-standard-pattern)
  * [Recent Examples](#recent-examples)
* [The Infrastructure Consolidation Problem](#the-infrastructure-consolidation-problem)
  * [Resend's Acquisition Spree](#resends-acquisition-spree)
  * [The Degradation Pattern](#the-degradation-pattern)
  * [ImprovMX: The Serial Acquisition Target](#improvmx-the-serial-acquisition-target)
* [The Hacker News Reality Check](#the-hacker-news-reality-check)
* [The Modern AI Email Grift](#the-modern-ai-email-grift)
  * [The Latest Wave](#the-latest-wave)
  * [The Same Old Problems](#the-same-old-problems)
* [What Actually Works: The Real Email Success Stories](#what-actually-works-the-real-email-success-stories)
  * [Infrastructure Companies (The Winners)](#infrastructure-companies-the-winners)
  * [Email Providers (The Survivors)](#email-providers-the-survivors)
  * [The Exception: Xobni's Success Story](#the-exception-xobnis-success-story)
  * [The Pattern](#the-pattern)
* [Our Approach: Why We're Different](#our-approach-why-were-different)
  * [What We Do](#what-we-do)
  * [What We Don't Do](#what-we-dont-do)
* [How We Build Email Infrastructure That Actually Works](#how-we-build-email-infrastructure-that-actually-works)
  * [Our Anti-Startup Approach](#our-anti-startup-approach)
  * [What Makes Us Different](#what-makes-us-different)
  * [The Technical Timeline](#the-technical-timeline)
  * [Why We Succeed Where Others Fail](#why-we-succeed-where-others-fail)
  * [The Cost Reality Check](#the-cost-reality-check)
* [Conclusion: Stop Building Email Apps](#conclusion-stop-building-email-apps)
  * [The Evidence Is Overwhelming](#the-evidence-is-overwhelming)
  * [The Historical Context](#the-historical-context)
  * [The Real Lesson](#the-real-lesson)
* [The Extended Email Graveyard: More Failures and Shutdowns](#the-extended-email-graveyard-more-failures-and-shutdowns)
  * [Google's Email Experiments Gone Wrong](#googles-email-experiments-gone-wrong)
  * [The Serial Failure: Newton Mail's Three Deaths](#the-serial-failure-newton-mails-three-deaths)
  * [The Apps That Never Launched](#the-apps-that-never-launched)
  * [The Acquisition-to-Shutdown Pattern](#the-acquisition-to-shutdown-pattern)
  * [Email Infrastructure Consolidation](#email-infrastructure-consolidation)
* [The Open-Source Email Graveyard: When "Free" Isn't Sustainable](#the-open-source-email-graveyard-when-free-isnt-sustainable)
  * [Nylas Mail → Mailspring: The Fork That Couldn't](#nylas-mail--mailspring-the-fork-that-couldnt)
  * [Eudora: The 18-Year Death March](#eudora-the-18-year-death-march)
  * [FairEmail: Killed by Google Play Politics](#fairemail-killed-by-google-play-politics)
  * [The Maintenance Problem](#the-maintenance-problem)
* [The AI Email Startup Surge: History Repeating with "Intelligence"](#the-ai-email-startup-surge-history-repeating-with-intelligence)
  * [The Current AI Email Gold Rush](#the-current-ai-email-gold-rush)
  * [The Funding Frenzy](#the-funding-frenzy)
  * [Why They'll All Fail (Again)](#why-theyll-all-fail-again)
  * [The Inevitable Outcome](#the-inevitable-outcome)
* [The Consolidation Catastrophe: When "Survivors" Become Disasters](#the-consolidation-catastrophe-when-survivors-become-disasters)
  * [The Great Email Service Consolidation](#the-great-email-service-consolidation)
  * [Outlook: The "Survivor" That Can't Stop Breaking](#outlook-the-survivor-that-cant-stop-breaking)
  * [The Postmark Infrastructure Problem](#the-postmark-infrastructure-problem)
  * [Recent Email Client Casualties (2024-2025)](#recent-email-client-casualties-2024-2025)
  * [Email Extension and Service Acquisitions](#email-extension-and-service-acquisitions)
  * [The Survivors: Email Companies That Actually Work](#the-survivors-email-companies-that-actually-work)


## The Email Startup Failure Matrix

Here's every major email startup failure we could find, organized by accelerator, funding, and outcome:

| Company           | Year      | Accelerator | Funding                                                                                                                                                                                                            | Outcome                                                                                               | Status    | Key Issue                                                                                                                  |
| ----------------- | --------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Skiff**         | 2024      | -           | [$14.2M total](https://techcrunch.com/2022/03/30/skiff-series-a-encrypted-workspaces/)                                                                                                                             | Acquired by Notion → Shutdown                                                                         | 😵 Dead   | [Founders left Notion for Cursor](https://x.com/skeptrune/status/1939763513695903946)                                      |
| **Mailbox**       | 2013-2015 | -           | [$5.82M raised](https://tracxn.com/d/companies/mailbox/__XtlW8HQtkZDOIwcu6T-ULWo3Y0bqkeOZSadeySyjlDY), [$100M acquisition](https://techcrunch.com/2013/03/15/mailbox-cost-dropbox-around-100-million/)             | Acquired → Shutdown                                                                                   | 😵 Dead   | [Solved non-problem](https://www.theverge.com/2015/12/8/9873268/why-dropbox-mailbox-shutdown)                              |
| **Sparrow**       | 2012      | -           | [$247K seed](https://tracxn.com/d/companies/sparrow/__LsNDTN1nTTj_nLjwLREPeSvD-RXwRJEMKfafgEEhxO8), [<$25M acquisition](https://www.theverge.com/2012/7/20/3172365/sources-google-sparrow-25-million-gmail-client) | Acquired by Google → Shutdown                                                                         | 😵 Dead   | [Talent acquisition only](https://money.cnn.com/2012/07/20/technology/google-acquires-sparrow/index.htm)                   |
| **Email Copilot** | 2012      | Techstars   | ~$120K (Techstars standard)                                                                                                                                                                                        | Acquired → Shutdown                                                                                   | 😵 Dead   | [Now redirects to Validity](https://www.validity.com/everest/returnpath/)                                                  |
| **ReplySend**     | 2012      | Techstars   | ~$120K (Techstars standard)                                                                                                                                                                                        | Failed                                                                                                | 😵 Dead   | [Vague value proposition](https://www.crunchbase.com/organization/replysend)                                               |
| **Nveloped**      | 2012      | Techstars   | ~$120K (Techstars standard)                                                                                                                                                                                        | Failed                                                                                                | 😵 Dead   | ["Easy. Secure. Email"](https://www.crunchbase.com/organization/nveloped)                                                  |
| **Jumble**        | 2015      | Techstars   | ~$120K (Techstars standard)                                                                                                                                                                                        | Failed                                                                                                | 😵 Dead   | [Email encryption](https://www.crunchbase.com/organization/jumble/technology)                                              |
| **InboxFever**    | 2011      | Techstars   | ~$118K (Techstars 2011)                                                                                                                                                                                            | Failed                                                                                                | 😵 Dead   | [API for email apps](https://www.crunchbase.com/organization/inboxfever)                                                   |
| **Emailio**       | 2014      | YC          | ~$120K (YC standard)                                                                                                                                                                                               | Pivoted                                                                                               | 🧟 Zombie | [Mobile email → "wellness"](https://www.ycdb.co/company/emailio)                                                           |
| **MailTime**      | 2016      | YC          | ~$120K (YC standard)                                                                                                                                                                                               | Pivoted                                                                                               | 🧟 Zombie | [Email client → analytics](https://www.ycdb.co/company/mailtime)                                                           |
| **reMail**        | 2009      | YC          | ~$20K (YC 2009)                                                                                                                                                                                                    | [Acquired by Google](https://techcrunch.com/2010/02/17/google-remail-iphone/) → Shutdown              | 😵 Dead   | [iPhone email search](https://www.ycombinator.com/companies/remail)                                                        |
| **Rapportive**    | 2012      | YC          | ~$120K (YC 2006)                                                                                                                                                                                                   | [Acquired by LinkedIn](https://techcrunch.com/2012/02/22/rapportive-linkedin-acquisition/) → Shutdown | 😵 Dead   | [Gmail social profiles add-on](https://www.ycombinator.com/companies/rapportive)                                           |
| **Mailhaven**     | 2016      | 500 Global  | ~$100K (500 standard)                                                                                                                                                                                              | Exited                                                                                                | Unknown   | [Package tracking](https://medium.com/@Kela/the-mailhaven-a-smarter-way-to-track-manage-and-receive-packages-edf202d73b06) |

> \[!CAUTION]
> **Failure Rate**: Techstars alone has 28 email-related companies with only 5 exits - an exceedingly high failure rate (sometimes calculated to be 80%+).


## The Infrastructure Reality Check

Here's what nobody talks about: **every single "email startup" is just building UI on top of existing infrastructure**.

### What Actually Runs Email

* **Amazon SES**: Powers most "email APIs" and services
* **Postfix**: The actual SMTP server running everywhere
* **Cyrus IMAP**: What handles your actual email storage
* **SpamAssassin**: What filters your spam
* **DKIM/SPF/DMARC**: The authentication that actually works

### What "Email Startups" Actually Build

* React Native apps with memory leaks
* Web interfaces that break email threading
* "AI" features that Gmail already has
* "Security" layers that break existing workflows
* APIs that wrap Amazon SES with 10x markup

> \[!TIP]
> **Key Pattern for Email Success**: The companies that actually succeed in email don't try to reinvent the wheel. Instead, they build **infrastructure and tools that enhance** existing email workflows. SendGrid, Mailgun, and Postmark became billion-dollar companies by providing reliable SMTP APIs and delivery services - they work **with** email protocols, not against them. This is the same approach we take at Forward Email.


## Case Study: The Skiff Disaster

Skiff perfectly exemplifies everything wrong with email startups.

### The Setup

* **Positioning**: "Privacy-first email and productivity platform"
* **Funding**: Significant venture capital
* **Promise**: Better email through privacy and encryption

### The Acquisition

[Notion acquired Skiff in February 2024](https://techcrunch.com/2024/02/09/notion-acquires-privacy-focused-productivity-platform-skiff/) with typical acquisition promises about integration and continued development.

### The Reality

* **Immediate shutdown**: [Skiff shut down within months](https://www.reddit.com/r/ProtonMail/comments/1ap3wqf/skiff_is_shutting_down_how_to_migrate_to_proton/)
* **Founder exodus**: [Skiff founders left Notion and joined Cursor](https://x.com/skeptrune/status/1939763513695903946)
* **User abandonment**: Thousands of users forced to migrate


## Case Study: When Email Infrastructure Goes Wrong

### Resend's Security Meltdown

Resend, the "developer-focused email platform," had a catastrophic security incident that perfectly illustrates why email infrastructure is hard.

**The Incident**: [On January 7th, 2024, attackers used a leaked environment variable](https://resend.com/blog/incident-report-for-january-10-2024) that was **exposed client-side on the Resend Dashboard** to access customer data including:

* Email addresses and domains
* API keys (encrypted)
* Logs and contacts
* User information

**The Timeline**:

* **December 30th**: Database API key exposed client-side
* **January 7th**: Attackers started accessing data
* **January 9th**: Incident discovered and promoted to SEV-0
* **January 10th**: 25 minutes of downtime during remediation

> \[!WARNING]
> **The Root Cause**: A database API environment variable was accidentally bundled into client-side code. This is exactly the kind of mistake that happens when you're building "email infrastructure" without understanding email infrastructure.

### ActiveCampaign's Postmark Acquisition: A Cautionary Tale

**The Original Success**: Postmark was originally owned by [Wildbit](https://www.wildbit.com/blog/postmark-has-been-acquired-by-activecampaign.html), where it built a reputation as a reliable transactional email service beloved by developers.

**The Acquisition**: ActiveCampaign acquired Postmark in [May 2022](https://postmarkapp.com/blog/postmark-and-dmarc-digests-acquired-by-activecampaign) with promises that ["Postmark will remain a standalone product"](https://postmarkapp.com/postmark-activecampaign-faq).

**The Reality**:

* **SSL Certificate Failure**: [Nearly 10-hour outage in September 2024](https://postmarkapp.com/blog/outbound-smtp-outage-on-september-15-2024) due to expired SSL certificates
* **User Rejections**: [Marc Köhlbrugge getting rejected](https://x.com/marckohlbrugge/status/1935041134729769379) despite legitimate usage
* **Developer Exodus**: [@levelsio stating "Amazon SES is our last hope"](https://x.com/levelsio/status/1934197733989999084)

### MailGun: Customer Service Breakdown

[Scott reported](https://x.com/_SMBaxter/status/1934175626375704675): "The worst service from @Mail\_Gun... we've not been able to send emails for 2 weeks due to an issue on their side" with MailGun support providing only: "I'm afraid I don't have an update at this time."


## The Accelerator Analysis

### Y Combinator: The Email App Factory

From [YCDB.co](https://www.ycdb.co/) research:

**Emailio (W14)**: Started as ["Mobile email app"](https://www.ycdb.co/company/emailio), now pivoted to ["Email built for wellness"](http://www.emailio.com/) - appears to have pivoted.

**MailTime (W16)**: Began as email client, now ["turns transactional email receipts into actionable consumer insights"](https://www.ycdb.co/company/mailtime) - completely abandoned original vision.

**reMail (W09)**: ["Email search for iPhone. Acquired by Google in Feb 2010"](https://www.ycdb.co/) - another Google talent grab that disappeared.

### Techstars: The Email Graveyard

Techstars has funded 28 email-related companies with only 5 exits - an exceedingly high failure rate.

**The Failures**:

1. **Email Copilot (2012)**: [emailcopilot.com now redirects to Validity](https://www.validity.com/everest/returnpath/), which states ["Return Path was acquired by Validity in 2019, but the platform is no longer available for sale"](https://www.validity.com/everest/returnpath/)

2. **ReplySend (2012)**: ["Company developing software and tools for email"](https://www.crunchbase.com/organization/replysend) - vague enough to mean nothing

3. **Nveloped (2012)**: ["Easy. Secure. Email"](https://www.crunchbase.com/organization/nveloped) - solving problems that don't exist

4. **Jumble (2015)**: ["Email encryption that integrates directly into existing email clients"](https://www.crunchbase.com/organization/jumble/technology) - PGP already exists

5. **InboxFever (2011)**: ["API solution that enables them to create email applications"](https://www.crunchbase.com/organization/inboxfever) - building on email instead of replacing it (the right approach, but still failed)

**The Exception**: SendGrid succeeded because it's email **infrastructure** (APIs for sending) rather than trying to replace email clients.


## Why Email Startups Always Fail

### 1. Email Isn't Broken

Email is a 50+ year old protocol that successfully delivers messages between any two points on the internet. It works exactly as designed.

### 2. Network Effects Are Unbreakable

Email's value comes from universal adoption. A "better" email client that only works with other users defeats the entire purpose.

### 3. They're Solving Non-Problems

Most email startups focus on:

* UI/UX improvements (Gmail is fine)
* Workflow optimizations (filters work)
* "AI" features (Gmail has them)
* "Security" (DKIM/SPF/DMARC work)

### 4. Technical Debt Is Massive

Building email clients means dealing with:

* Decades of legacy protocols
* Spam filtering complexity
* Deliverability reputation systems
* Compatibility with every email server ever built

### 5. The Infrastructure Already Exists

> \[!IMPORTANT]
> **Almost nobody builds email infrastructure from scratch**. Most "email startups" are just:
>
> * Wrapping Amazon SES with a prettier API
> * Using existing open-source solutions like Postfix/Cyrus (Fastmail, Resend, etc.)
> * Building React Native apps on top of IMAP
> * Adding "AI" to existing email protocols


## The Venture Capital Trap

VCs keep funding email startups because:

1. **Large addressable market** (everyone uses email)
2. **Obvious pain points** (inbox overload, spam)
3. **Success stories** (Gmail - though it succeeded with storage, not "fixing" email)
4. **Founder conviction** (everyone thinks they can succeed where others failed)

But they ignore the fundamental reality: **email works perfectly for what it was designed to do**.


## The Technical Reality: Modern Email Stacks

### What Actually Powers "Email Startups"

```bash
# What Fastmail actually runs
postfix + cyrus-imap + spamassassin + custom-web-ui

# What Resend actually runs
amazon-ses + nodejs-wrapper + react-dashboard

# What Proton actually runs*
postfix + custom-encryption + web-interface

# What we actually run
100% custom Node.js JavaScript stack built from scratch

# What Gmail actually runs
custom-everything (because Google has infinite resources)
```

\* [APNIC Blog: SMTP downgrade attacks and MTA-STS](https://blog.apnic.net/2024/10/04/smtp-downgrade-attacks-and-mta-sts/#:\~:text=Logs%20indicate%20that%20Proton%20Mail%20uses%C2%A0postfix%2Dmta%2Dsts%2Dresolver%2C%20hinting%20that%20they%20run%20a%20Postfix%20stack) - Logs indicate that Proton Mail uses postfix-mta-sts-resolver, confirming they run a Postfix stack under the hood.

### The Performance Problems

Modern email startups suffer from:

* **Memory Bloat**: JavaScript-heavy applications consuming 500MB+ for basic email
* **Battery Drain**: Inefficient background processing
* **Compatibility Issues**: Breaking email threading, search, and standard workflows
* **Security Vulnerabilities**: Like [Resend's client-side environment variable exposure](https://resend.com/blog/incident-report-for-january-10-2024)


## The Acquisition-to-Shutdown Pipeline

### The Standard Pattern

1. **Startup raises funding** promising to "revolutionize email"
2. **Gains early traction** with users who like UI improvements
3. **Struggles with email complexity** (spam, deliverability, protocols)
4. **Gets acquired** for talent and technology
5. **Product gets shut down** within 6-24 months
6. **Founders leave** acquiring company
7. **Cycle repeats** with new entrepreneurs

### Recent Examples

* **Skiff → Notion → Shutdown → Founders to Cursor** (2024)
* **Mailbox → Dropbox → Shutdown** (2013-2015)
* **Sparrow → Google → Shutdown** (2012)


## The Infrastructure Consolidation Problem

### Resend's Acquisition Spree

Resend, founded by Zeno Rocha ([@zenorocha](https://x.com/zenorocha)), has been aggressively acquiring companies:

**Mergent Acquisition (April 2025)**: ["Resend has acquired Mergent, the serverless background job service"](https://resend.com/blog/resend-acquires-mergent) - consolidating email-adjacent services.

### The Degradation Pattern

When email infrastructure gets acquired:

1. **Initial promises** of improved resources
2. **Integration challenges** leading to outages
3. **Resource reallocation** to other products
4. **Service degradation** through reduced investment
5. **User migration** to alternatives

### ImprovMX: The Serial Acquisition Target

**ImprovMX** has been **acquired 2x and changed hands 3 times**:

* **Original founding** as email forwarding service
* **First acquisition** with promises of growth
* **Second acquisition** by [Matthew Tse in January 2025](https://substack.matthewtse.com/p/how-to-buy-a-saas-improvmx)
* **Latest sale** for [under $1.2M despite $30K MRR](https://quietlight.com/listings/15877422)

As noted in [Privacy Guides discussion](https://discuss.privacyguides.net/t/forward-email-new-features/24845/55): multiple ownership changes create uncertainty for users who need reliable email forwarding.


## The Hacker News Reality Check

[Hacker News discussions](https://hn.algolia.com) about email startups consistently show skepticism from technical users who understand that email's "problems" are often features, not bugs.
**Common HN Comments**:

* ["Email works fine, this solves a non-problem"](https://news.ycombinator.com/item?id=3843139) - tferris on "Email is not broken: It's a framework, not an application"
* ["Just use Gmail/Outlook like everyone else"](https://news.ycombinator.com/item?id=12049801) - Multiple users on "Email Apps Suck"
* ["Another email client that will be shut down in 2 years"](https://news.ycombinator.com/item?id=31615278) - Comments on Superhuman layoffs
* ["The real problem is spam, and this doesn't solve that"](https://news.ycombinator.com/item?id=3843139) - icefox on email infrastructure discussions

**The Technical Community Knows**: Email's decentralized, open nature is what makes it valuable, not something to be "fixed" by proprietary solutions.


## The Modern AI Email Grift

### The Latest Wave

Recent email startups are adding "AI" to their pitches:

* **NeveMind (2023)**: "Automatically replies to all your emails" - appears to be defunct or never launched
* **[Ripple AI (2024)](https://getripple.ai/)**: ["Design beautiful marketing emails in minutes"](https://tracxn.com/d/companies/ripple-ai/__zCu8ynu9ZVh29Fur5w-h9acRY8HSkIbbrtiRRxa425s) with [$20K total funding](https://tracxn.com/d/companies/ripple-ai/__zCu8ynu9ZVh29Fur5w-h9acRY8HSkIbbrtiRRxa425s)
* **[Moneiva (2024)](https://www.moneiva.com/)**: ["AI-driven communication platform for freight operations"](https://www.moneiva.com/) automating voice, email, SMS, and WhatsApp

### The Same Old Problems

They're still solving non-problems:

* **Email organization**: Filters and folders work fine
* **Smart replies**: Gmail has had this for years
* **Spam detection**: Already solved by existing providers
* **AI summarization**: Outlook already does this


## What Actually Works: The Real Email Success Stories

### Infrastructure Companies (The Winners)

1. **SendGrid**: Email delivery APIs (acquired by Twilio for $3B)
2. **Mailgun**: Email APIs for developers
3. **Amazon SES**: The infrastructure everyone actually uses
4. **Cloudflare Email Routing**: Simple forwarding that works

### Email Providers (The Survivors)

1. **Gmail**: Infinite Google resources + storage
2. **Outlook**: Microsoft integration + enterprise
3. **Fastmail**: Postfix + Cyrus + good UI
4. **Proton**: [Postfix + encryption + privacy focus](https://blog.apnic.net/2024/10/04/smtp-downgrade-attacks-and-mta-sts/#:\~:text=Logs%20indicate%20that%20Proton%20Mail%20uses%C2%A0postfix%2Dmta%2Dsts%2Dresolver%2C%20hinting%20that%20they%20run%20a%20Postfix%20stack)

### The Exception: Xobni's Success Story

Not every email company ends in failure. **Xobni** (inbox spelled backwards) stands as a rare example of email startup success, proving that building **on top of** email infrastructure rather than trying to replace it can work.

#### The Success Formula

**Founded**: 2006 by [Adam Smith](https://x.com/asmith) and [Matt Brezina](https://clarity.fm/brezina) from Adam's MIT dorm room as part of [Y Combinator Summer 2006](https://ycuniverse.com/xobni-acquired-by-yahoo/).

**The Product**: [Outlook plugin that enhanced email management](https://www.wired.com/2008/05/new-xobni-plug-in-supercharges-your-outlook-inbox/) with:

* Advanced contact management and social integration
* Fast email search and conversation threading
* Email analytics and relationship insights
* LinkedIn, Twitter, and Salesforce integrations

**The Funding**: [Raised over $40 million](https://ycuniverse.com/xobni-acquired-by-yahoo/) from investors including First Round Capital, Khosla Ventures, and Atomico.

**The Acquisition**: [Yahoo acquired Xobni in July 2013 for $30-60 million](https://allthingsd.com/20130703/yahoo-acquires-xobni-for-upwards-of-30-million-like-atd-said-part-2/), making it one of Y Combinator's early success stories.

#### Why Xobni Succeeded Where Others Failed

> \[!TIP]
> **The Key Insight**: Xobni enhanced existing email workflows instead of trying to replace them. They built a plugin that made Outlook better, not a new email client that competed with Outlook.

**What They Did Right**:

* **Worked with existing infrastructure**: Enhanced Outlook rather than replacing it
* **Solved real problems**: Outlook's contact management and search were genuinely poor
* **Focused on productivity**: Added features that actually saved time
* **Enterprise-friendly**: Integrated with business tools like Salesforce

#### The Founders' Continued Success

**Matt Brezina** went on to:

* Co-found [Sincerely](https://tracxn.com/d/companies/sincerely/__41RbG0-giTH4KWPDdM3GperZfJ0glQ75IuJtA0gnLlA) (mobile gifting platform) in 2011
* [Sell Sincerely to Provide Commerce](https://techcrunch.com/2013/11/07/provide-commerce-acquires-mobile-gifting-startup-sincerely-will-expand-into-new-categories-apps-in-2014/) for undisclosed amount in 2013
* Become an active [angel investor](https://mercury.com/investor-database/matt-brezina) with investments in Dropbox, Mailbox, and others

**Adam Smith** continued with:

* Co-found [Kite](https://www.businessinsider.com/adam-smith-kite-xobni-2016-4) (AI-powered coding assistant) in 2014
* [Raise $17 million for Kite](https://venturebeat.com/business/kite-raises-17-million-for-its-ai-powered-developer-environment/) before it eventually shut down in 2022
* Join [Affirm as VP of Engineering](https://www.crunchbase.com/person/adam-smith)
* Become a [seed investor](https://wellfound.com/p/asmith) in companies like Dropbox, Cruise, and Rescale

### The Pattern

**Winners build ON TOP of email**. **Losers try to REPLACE email**.


## Our Approach: Why We're Different

> **Full Disclosure**: This analysis is written by us at Forward Email, but the data speaks for itself.

### What We Do

* **Build custom infrastructure**: [100% custom Node.js JavaScript stack](https://forwardemail.net/en/blog/docs/self-hosted-solution) built from scratch
* **Focus on privacy**: End-to-end encryption without breaking compatibility
* **Open source everything**: [100% open source](https://github.com/forwardemail/forwardemail.net)
* **Build on email standards**: IMAP, SMTP, POP3 - not proprietary protocols

### What We Don't Do

* ❌ Try to "revolutionize" email
* ❌ Build proprietary protocols
* ❌ Promise to "fix" what isn't broken
* ❌ Wrap Amazon SES and call it innovation
* ❌ Build [memory-hungry Electron apps](https://github.com/electron/electron/issues/31330) or [Expo apps built on React Native with horrid performance](https://github.com/expo/expo/issues/24537)


## How We Build Email Infrastructure That Actually Works

### Our Anti-Startup Approach

While the companies above burned through millions trying to "revolutionize" email, we at [Forward Email](https://forwardemail.net) took a radically different approach: **actually building email infrastructure from scratch**.

> **Founded in 2017** by Nicholas Baugh, we have been quietly building real email infrastructure while others chase venture capital.

### What Makes Us Different

#### 1. **Built Everything From Scratch**

Unlike every other email service that relies on third parties:

```bash
# What most "email startups" actually are:
Amazon SES + React UI + VC funding = "Innovation"

# What we built:
Custom SMTP servers + IMAP/POP3 + CalDAV + CardDAV +
Bare metal infrastructure + 100% open source
```

**No third-party dependencies** except [DNS provider and datacenter](https://forwardemail.net/en/about). No third-party tracking tools, analytics, or external logging services - everything is in-house and completely open source.

#### 2. **Bare Metal Infrastructure**

As of February 2025, we run on [custom, performance-focused, bare-metal hardware](https://forwardemail.net/en/about) with [DataPacket](https://www.datapacket.com/) as our primary data center provider.

**Not cloud-based glue code.** Actual servers running actual email infrastructure.

#### 3. **100% Open Source (Frontend AND Backend)**

Unlike Proton Mail and Tutanota who only open-source their frontends, our [entire codebase is open source](https://github.com/forwardemail/forwardemail.net) - including the backend that actually processes your emails.

**The Legacy Infrastructure Problem**: [Proton Mail uses Postfix under the hood](https://blog.apnic.net/2024/10/04/smtp-downgrade-attacks-and-mta-sts/#:\~:text=Logs%20indicate%20that%20Proton%20Mail%20uses%C2%A0postfix%2Dmta%2Dsts%2Dresolver%2C%20hinting%20that%20they%20run%20a%20Postfix%20stack), a legacy C-based mail server that:

* **Hard to maintain**: Requires deep C programming knowledge
* **Difficult to contribute to**: Complex codebase with decades of technical debt
* **Requires extensive glue code**: Connecting 1980s C code to modern HTML/JS/CSS web interfaces
* **Not web-native**: Built for a different era of computing

**Our Modern Approach**: 100% JavaScript stack means:

* **Easy to maintain**: Single language across the entire stack
* **Easy to contribute to**: Modern, readable codebase that web developers understand
* **No glue code needed**: Native integration between backend and frontend
* **Web-native**: Built specifically for the modern web era

> \[!IMPORTANT]
> **Verifiable Privacy**: You can inspect every line of code that handles your emails. [Read their technical approach](https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy).

#### 4. **Individual Encrypted SQLite Files**

Instead of shared databases (where one breach = everyone's data), we use [individually encrypted SQLite files for each mailbox](https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy):

```javascript
// Traditional email providers:
MongoDB/PostgreSQL with shared access = security nightmare

// Our approach:
Each mailbox = separate encrypted SQLite file
Access to one ≠ access to all
```

#### 5. **Self-Hostable**

We offer a [complete self-hosted solution](https://forwardemail.net/en/blog/docs/self-hosted-solution) with Docker containers for:

* Web interface for administration
* SMTP server for outbound email
* IMAP/POP3 servers for email retrieval
* CalDAV server for calendars
* CardDAV server for contacts
* Database for configuration storage
* Redis for caching and performance

**You're never locked in.** You can run the entire stack yourself.

#### 6. **Features Users Actually Requested**

Unlike failed startups that build features nobody wants, we listen to users and build what they specifically ask for:

* **DNS-Only Operation**: Can run completely on DNS without requiring account creation
* **Privacy by Design**: Ability to hide forwarding destinations is built-in, not an add-on feature
* **User-Requested PGP Encryption**: Email forwarding WITH PGP encryption, adhering to [OpenWKD standards](https://tools.ietf.org/html/draft-koch-openpgp-webkey-service)
* **Standards Compliance**: Built on proven email protocols, not proprietary solutions

### The Technical Timeline

Our development shows what **actual email infrastructure development** looks like:

* **2017**: Founded, built initial email forwarding with 634 lines of JavaScript
* **2018**: Integrated with Cloudflare for privacy-first DNS
* **2019**: Major performance rewrite using Node.js streams
* **2020**: Released Spam Scanner (open-source anti-spam), 2FA, API
* **2021**: Removed all Python dependencies, 100% JavaScript/Node.js stack
* **2023**: Switched to bare metal servers, implemented DNS over HTTPS
* **2023**: Launched outbound SMTP with built-in deliverability safeguards
* **2023**: Added encrypted mailbox storage with IMAP support
* **2024**: Added CalDAV, iOS Push support, time-to-inbox monitoring
* **2025**: Switched to DataPacket bare metal infrastructure

[Full timeline with sources](https://forwardemail.net/en/about)

**Technical Documentation**: For comprehensive details on our approach, architecture, and security implementation, see our [technical whitepaper](https://forwardemail.net/technical-whitepaper.pdf) and extensive technical documentation:

* [Security Infrastructure](https://forwardemail.net/en/security)
* [Open-Source Email Security & Privacy](https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy)
* [Email Privacy Protection Technical Implementation](https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation)
* [Best Email Forwarding Service](https://forwardemail.net/en/blog/docs/best-email-forwarding-service)
* [How NPM Packages with Billion Downloads Shaped JavaScript Ecosystem](https://forwardemail.net/en/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Why We Succeed Where Others Fail

#### ✅ **Solves Real Problems**

* Email forwarding for custom domains
* Privacy-focused infrastructure
* Reliable SMTP delivery
* Standards-compliant protocols

#### ✅ **Uses Proven Technology**

* Built on email standards (SMTP, IMAP, POP3)
* Uses battle-tested protocols
* No proprietary lock-in

#### ✅ **Sustainable Business Model**

* Profitable since early days
* Transparent pricing
* No acquisition pressure

#### ✅ **Technical Excellence**

* [Quantum-safe encryption](https://forwardemail.net/en/blog/docs/best-quantum-safe-encrypted-email-service)
* Individual encrypted mailboxes
* Bare metal performance
* 100% open source

### The Cost Reality Check

**Self-hosting email** (what Forward Email makes possible):

* Server costs: $5-$50/month
* Time investment: 5-10 hours/month maintenance
* Technical expertise: Significant learning curve
* **Total cost**: $56-$252/month (including time valuation)

**Our managed service**: $3-$9/month

**Failed email startups**: $14.2M+ in funding → shutdown

> \[!NOTE]
> We prove you can build sustainable email infrastructure without burning venture capital or shutting down users' services.


## Conclusion: Stop Building Email Apps

### The Evidence Is Overwhelming

* **80%+ failure rate** in major accelerators
* **Acquisition-to-shutdown pattern** across all major "successes"
* **Technical problems** from trying to rebuild proven infrastructure
* **User abandonment** when services inevitably shut down

### The Historical Context

For deeper insight into the early days of email companies like Gmail, Yahoo, and Hotmail, Paul Graham's ["Founders at Work"](https://paulgraham.com/foundersatwork.html) provides invaluable historical context about what actually worked in email's formative years. Our founder was greatly inspired by this book in the early days of his career, learning from the successes and failures of email pioneers.

### The Real Lesson

Email is a **solved problem**. The protocol works. The infrastructure exists. The clients are good enough.

If you want to build something email-related:

1. **Build infrastructure tools** (like SendGrid)
2. **Build integrations** that work with existing email
3. **Build specialized tools** for specific use cases
4. **Don't build another email client**


## The Extended Email Graveyard: More Failures and Shutdowns

### Google's Email Experiments Gone Wrong

#### Google Buzz (2010-2011)

**The Promise**: [Social networking integrated into Gmail](https://www.failory.com/google/buzz) to compete with Facebook and Twitter.

**The Reality**:

* **Privacy Disaster**: [Automatically exposed users' contacts and email patterns](https://money.cnn.com/2011/10/14/technology/google_buzz_shut_down/index.htm) without consent
* **User Backlash**: [FTC complaint over privacy violations](https://en.wikipedia.org/wiki/Google_Buzz)
* **Quick Death**: [Shut down after just 20 months](https://www.theverge.com/2013/5/25/4364902/google-moving-buzz-posts-to-google-drive-date) in October 2011

> \[!WARNING]
> **The Lesson**: Even Google with infinite resources can't force social features into email. Users want email to be email, not a social network.

#### Google Wave (2009-2010)

**The Promise**: ["Real-time communication platform to replace email"](https://www.failory.com/google/wave) combining email, instant messaging, and collaboration.

**The Reality**:

* **Too Complex**: [Users couldn't understand what it was supposed to do](https://medium.com/swlh/why-google-wave-failed-fe85d9f859d3)
* **No Clear Use Case**: [Marketed as "better email" instead of collaboration tool](https://www.reddit.com/r/google/comments/fvhjfj/google_waves_failure_is_a_great_lesson_for_modern/)
* **Developer Abandonment**: [Shut down after just 1 year](https://www.cbc.ca/news/science/google-kills-wave-communications-tool-1.868073) in August 2010

**Quote from Museum of Failure**: ["Wave was supposed to be the ultimate communication tool. It was to replace email for better collaboration"](https://museumoffailure.com/exhibition/google-wave) - but nobody wanted email replaced.

#### Inbox by Gmail (2014-2019)

**The Promise**: [Experimental email client with smart features](https://www.failory.com/google/inbox) to reimagine email organization.

**The Success**: Actually worked well and had devoted users who loved the interface.

**The Problem**: [Google couldn't maintain two email products](https://thenextweb.com/news/google-inbox-killed-shortwave-app-analysis) and chose to focus on Gmail instead.

**The Death**: [Discontinued in April 2019](https://gcemetery.co/inbox-by-gmail/) despite user protests.

> \[!NOTE]
> **The Irony**: Inbox by Gmail was one of the few email "innovations" that actually worked - and Google still killed it. This shows that even successful email products can't survive corporate priorities.

### The Serial Failure: Newton Mail's Three Deaths

**Newton Mail** (originally CloudMagic) holds the record for most deaths and resurrections:

#### Death #1 (August 2018)

* [Original shutdown announced](https://www.theverge.com/2018/8/7/17661488/newton-mail-email-app-shutting-down-september-2018) due to unsustainable business model
* Users had 2 weeks to migrate

#### Resurrection #1 (February 2019)

* [Essential acquired Newton](https://www.theverge.com/2019/2/5/18212281/essential-newton-mail-app-back-available-ios-android-mac-windows-phone) and brought it back
* Promised continued development

#### Death #2 (February 2020)

* [Essential shut down](https://www.androidcentral.com/newton-mail-dies-second-time-following-essential-closure), taking Newton with it
* Users abandoned again

#### Resurrection #2 (May 2020)

* [Superfans acquired Newton](https://www.inverse.com/input/tech/newton-mail-is-being-resurrected-again-this-time-by-superfans) and reopened it
* Community-driven effort

#### Death #3 (July 2024)

* [Final shutdown announced](https://www.reddit.com/r/NewtonMail/comments/1ecd7k5/newton_shutting_down_july_31st_2024/) on July 31st, 2024
* ["Been in a downward spiral"](https://www.reddit.com/r/NewtonMail/comments/1ecd7k5/newton_shutting_down_july_31st_2024/) according to users

**The Pattern**: Even beloved email apps with dedicated users can't sustain themselves. Newton's multiple deaths prove that loving users ≠ viable business.

### The Apps That Never Launched

#### .mail (2010)

**The Concept**: [Email app designed in 2010](https://vanschneider.com/blog/story-dotmail/) by designer Tobias van Schneider.

**The Reality**: Never launched. The designer later wrote: ["DotMail was an email app concept I originally came up with and designed in 2010"](https://vanschneider.com/blog/story-dotmail/) but it remained just a concept.

**The Lesson**: Sometimes the smartest move is not launching at all. The email graveyard is full of apps that should have stayed concepts.

### The Acquisition-to-Shutdown Pattern

#### Astro (2016-2018)

**The Product**: [AI-powered email client](https://www.theverge.com/2018/9/24/17897658/slack-astro-acquisition-email-app-shut-down-integration) with smart scheduling and organization.

**The Acquisition**: [Slack acquired Astro in September 2018](https://slack.com/blog/news/slack-acquires-astro-to-help-email-and-channels-work-together) for talent and technology.

**The Shutdown**: [Apps stopped working October 10th, 2018](https://www.engadget.com/2018-09-24-slack-buys-intelligent-email-app-astro.html) - just 16 days after acquisition announcement.

**User Reaction**: ["What's the best mail client now?"](https://www.reddit.com/r/ios/comments/9ikcu5/astro_mail_is_being_shut_down_oct_10_whats_the/) - users scrambling for alternatives with 2 weeks notice.

### Email Infrastructure Consolidation

The email infrastructure space has seen massive consolidation, often leading to service degradation:

#### PostX → IronPort → Cisco (2006-2007)

* **PostX**: [Email encryption software provider](https://www.kroll.com/en/transactions/m-and-a/ironport-systems-to-acquire-postx)
* **Acquired by IronPort**: [November 2006 for undisclosed amount](https://venturebeat.com/business/security-co-ironport-systems-acquires-postx/)
* **IronPort acquired by Cisco**: [January 2007 for $830M](https://newsroom.cisco.com/press-release-content?articleId=2786535)
* **Result**: PostX technology absorbed into Cisco's enterprise security suite

#### 2ergo → SoundBite → Genesys (2012-2013)

* **2ergo Americas**: [Mobile marketing and SMS platform](https://www.mmaglobal.com/news/soundbite-communications-acquires-americas-operations-2ergo-group-plc)
* **Acquired by SoundBite**: [February 2012 for $3.8M](https://www.cbinsights.com/company/2ergo-americas)
* **SoundBite acquired by Genesys**: [May 2013 for $100M](https://opusresearch.net/2013/05/20/growing-its-cloud-thru-acquisition-genesys-buys-soundbite-communications/)
* **Result**: 2ergo's email/SMS technology integrated into enterprise communications

#### Newoldstamp → BlackPearl Group (2022)

* **Newoldstamp**: [Email signature marketing platform](https://newoldstamp.com/blog/blackpearl-group-acquires-newoldstamp/)
* **Acquired**: [November 2022 for $3.1M](https://itcluster.lviv.ua/en/novozelandska-blackpearl-group-kupyla-newoldstamp-kompaniyu-uchasnyczyu-lvivskogo-it-klastera/)
* **Status**: Still operating but now part of larger data-driven products portfolio

> \[!IMPORTANT]
> **The Consolidation Pattern**: Email infrastructure companies get acquired not for their innovation, but for their user base and technology to be absorbed into larger platforms. Independent email innovation dies in corporate integration.


## The Open-Source Email Graveyard: When "Free" Isn't Sustainable

Even open-source email projects, supposedly immune to venture capital pressures, follow the same failure patterns as commercial startups.

### Nylas Mail → Mailspring: The Fork That Couldn't

#### Nylas Mail (2014-2017)

**The Promise**: [Open-source desktop email client](https://www.nylas.com/blog/sunsetting-nylas-mail-development/) built with Electron, React, and Flux.

**The Success**: Actually gained traction with developers who loved the extensible architecture.

**The Death**: [Discontinued September 6, 2017](https://www.omgubuntu.co.uk/2017/06/nylas-mail-is-dead-jim) when Nylas pivoted to focus on their API business.

**The Quote**: ["We're committed to ensuring Nylas Mail lives on as open source"](https://www.nylas.com/blog/sunsetting-nylas-mail-development/) - Nylas team, before abandoning it completely.

#### Mailspring (2017-Present)

**The Fork**: [Community fork of Nylas Mail](https://www.linuxlinks.com/mailspring-new-version-nylas-mail/) attempting to continue development.

**The Problems**:

* **Abandoned Infrastructure**: ["Mailspring is unfortunately abandoned project, and their infrastructure is falling apart"](https://github.com/Foundry376/Mailspring/issues/2231) - GitHub Issue #2231
* **Persistent Sync Issues**: ["Dreaded 'One or more accounts are having connection issues'"](https://community.getmailspring.com/t/dreaded-one-or-more-accounts-are-having-connection-issues-v1-80-mailspring-free/1056) - daily problem for users
* **Email Loss**: ["Multiple reports of emails and drafts going missing from folders"](https://community.getmailspring.com/c/bugs/10) - Mailspring Community

**The Reality**: Even successful open-source projects can't survive when the underlying infrastructure becomes unmaintained.

### Eudora: The 18-Year Death March

**The Legacy**: [Discontinued by Qualcomm in 2006](https://tedium.co/2017/09/28/eudora-email-history/), but users refused to let it die.

**The Zombie State**: ["We Eudora v7.x email enthusiasts have been nursing along this unsupported email client for 18 years"](https://www.worldcadaccess.com/blog/2025/05/replacing-eudora-with-em-client.html) - WorldCAD Access, May 2025.

**The Community Effort**: [HERMES eudoramail 8.0 crowdfunding campaign](https://www.indiegogo.com/projects/hermes-eudoramail-8-0-the-final-stretch) attempting to revive a 20-year-old codebase.

**The Lesson**: Sometimes the kindest thing is to let dead software stay dead.

### FairEmail: Killed by Google Play Politics

**The Product**: [Fully featured, open source, privacy-focused Android email client](https://github.com/M66B/FairEmail).

**The Death**: [Developer pulled all apps from Google Play in May 2022](https://www.ghacks.net/2022/05/19/fairemail-developer-calls-it-quits-and-pulls-apps-from-google-play/) after Google falsely flagged it as spyware.

**The Controversy**: ["The problem here is the app was deceptively processing contact lists without user consent"](https://news.ycombinator.com/item?id=31432334) vs ["Google requires FairEmail to undergo an annual CASA security audit"](https://forum.f-droid.org/t/google-requires-fairemail-to-undergo-an-annual-casa-security-audit/29122).

**User Reaction**: ["Fairemail discontinued - Looking for new email app?"](https://forums.androidcentral.com/threads/fairemail-discontinued-looking-for-new-email-app.1044526/) - Android Central Forums.

> \[!WARNING]
> **The Platform Risk**: Even open-source projects are vulnerable to platform gatekeepers. Google's arbitrary enforcement can kill years of development overnight.

### The Maintenance Problem

**PHPMailer**: Still maintained but [legacy versions (5.2) no longer supported](https://github.com/PHPMailer/PHPMailer), even for security updates.

**Claws Mail**: [Active development continues](https://wiki.gentoo.org/wiki/Claws_Mail) but with a tiny contributor base and aging codebase.

**The Pattern**: Open-source email projects either die from lack of funding or become maintenance burdens that few developers want to touch.


## The AI Email Startup Surge: History Repeating with "Intelligence"

The latest wave of email startups has discovered the magic buzzword: **AI**. Spoiler alert: Adding artificial intelligence to email doesn't solve the fundamental problem that email already works perfectly.

### The Current AI Email Gold Rush

#### AI Email Assistants

* **[Lavender](https://www.lavender.ai/)**: "Your Magical AI Email Coach" - scores emails and gives AI feedback
* **[Shortwave](https://www.shortwave.com/)**: "Agentic AI that helps you organize, write, search, schedule"
* **[Superhuman](https://superhuman.com/)**: "AI-native email" with $33M+ funding
* **[WriteMail.ai](https://writemail.ai/)**: "Write professional, engaging emails in seconds"
* **[Mail-0/Zero](https://github.com/Mail-0/Zero)**: AI-powered email client startup building yet another email interface
* **[Inbox Zero](https://github.com/elie222/inbox-zero)**: Open-source AI email assistant attempting to automate email management

#### AI Cold Email Platforms

* **[Reply.io](https://reply.io/)**: "AI Sales Outreach & Cold Email Platform"
* **[Mails.ai](https://www.mails.ai/)**: "AI Cold Email Software"
* **[Smartlead](https://smartlead.ai/)**: "Running Personalized Cold Outreach"
* **[Instantly.ai](https://instantly.ai/)**: "Multichannel campaigns" with AI

#### AI Email Organization

* **[Fyxer AI](https://www.fyxer.com/)**: "Save 1 hour every day with an AI assistant"

### The Funding Frenzy

**The Numbers**: [According to Crunchbase, $100B of venture capital went to AI startups in 2024](https://www.hubspot.com/startups/reports/hypergrowth-startups/ai-startup-funding), representing an 80% increase from 2023.

**Y Combinator AI Obsession**: [Browse 100 of the top AI startups funded by Y Combinator](https://www.ycombinator.com/companies/industry/ai) - many focused on email and communication.

**Recent Examples**:

* **Skarbe**: [AI sales assistant secured $600K pre-seed](https://technews180.com/funding-news/ai-sales-assistant-skarbe-secures-600k-pre-seed/) (12 hours ago)
* **heyLibby**: [AI assistant for small businesses raised $4.5M seed](https://www.geekwire.com/2025/ai-assistant-startup-heylibby-finds-traction-in-wellness-sector-raises-4-5m/) (April 2025)
* **Martin AI**: [Yale and Berkeley dropouts raised $2M](https://venturebeat.com/ai/these-yale-and-berkeley-dropouts-just-raised-2-million-to-build-an-ai-assistant-that-could-rival-openai/) to build AI assistant (January 2025)

### Why They'll All Fail (Again)

#### The Same Old Problems with AI Lipstick

**Memory Bloat**: AI models require massive resources. These apps will consume even more RAM than the Electron disasters.

**Privacy Concerns**: AI email assistants need to read your emails to "help" you. Users will revolt when they realize the privacy implications.

**Accuracy Issues**: AI hallucinations in email could be catastrophic. One wrong AI-generated response could destroy business relationships.

**Cost Structure**: Running AI inference for every email interaction is expensive. These startups will burn through funding faster than traditional email apps.

#### The Fundamental Misunderstanding

> \[!IMPORTANT]
> **The Core Problem**: Email doesn't need artificial intelligence. It needs reliability, speed, and standards compliance. Adding AI to email is like adding AI to a hammer - it solves no real problem while creating new ones.

**Historical Parallel**: Just like the 2010s wave of "social email" (Google Buzz, Google Wave), the 2020s wave of "AI email" misunderstands what users actually want from email.

### The Inevitable Outcome

**Prediction**: Within 3-5 years, we'll see:

* **90%+ of AI email startups** will shut down or be acquired for talent
* **The survivors** will quietly remove AI features and become regular email apps
* **New buzzword** will emerge (probably "quantum email" or "blockchain email") to restart the cycle

**The Pattern**: Email startup failures follow technology hype cycles. We've seen "social email," "mobile-first email," "collaborative email," and now "AI email." The underlying problem remains: **email already works**.


## The Consolidation Catastrophe: When "Survivors" Become Disasters

Even the email services that "survived" the startup graveyard have become cautionary tales through endless acquisitions and mergers.

### The Great Email Service Consolidation

#### AOL Mail + Yahoo Mail: The Verizon Disaster (2015-2021)

**The Acquisitions**:

* **AOL**: [Verizon acquired for $4.4 billion in 2015](https://www.cnbc.com/2021/05/03/verizon-sells-yahoo-and-aol-businesses-to-apollo-for-5-billion.html)
* **Yahoo**: [Verizon acquired for $4.5 billion in 2017](https://www.axios.com/2021/05/04/verizon-aol-yahoo-valuations)

**The Failure**: [Verizon sold both to Apollo for $5 billion in 2021](https://www.aol.com/news/verizon-sells-yahoo-aol-businesses-122000556.html) - **losing $4 billion** on the combined investment.

**User Impact**: Both services became neglected stepchildren during Verizon ownership, with minimal investment in infrastructure or features.

#### Hotmail → Outlook: The Microsoft Mess (1997-Present)

**The Acquisition**: [Microsoft acquired Hotmail in 1997 for $400M](https://www.linkedin.com/posts/agazdecki_microsofts-1997-acquisition-of-hotmail-was-activity-7248327085612511233-EEMh) - the largest all-cash Internet startup deal of its era.

**The Problem**: Microsoft has spent 27 years trying to merge Hotmail into Outlook, and **it still doesn't work properly**.

**User Frustration**:

* ["It's not possible to merge or combine Microsoft accounts"](https://answers.microsoft.com/en-us/outlook_com/forum/all/i-have-hotmail-and-outlook-email-addresses-can-i/67a81ec7-1768-41e2-8997-93edb08e52ba) - Microsoft Support, November 2023
* ["HOTMAIL AND OUTLOOK ACCOUNT MERGE TURNED INTO A NIGHTMARE"](https://answers.microsoft.com/en-us/outlook_com/forum/all/hotmail-and-outlook-account-merge-turned-into-a/25ff4394-f7fa-43ba-9df7-a95c502409c7) - Microsoft Community

### Outlook: The "Survivor" That Can't Stop Breaking

#### Persistent Technical Issues

**2024 Problems**:

* ["Outlook stopped receiving/sending emails after the October 2024 update"](https://answers.microsoft.com/en-us/outlook_com/forum/all/outlook-stopped-receivingsending-emails-after-the/ebe3649b-d16f-4b07-b2b9-99de0b2cfda2)
* ["Emails stopped sending/receiving over wifi after July 22, 2024 update"](https://answers.microsoft.com/en-us/outlook_com/forum/all/outlook-update-22072024-emails-stopped/08d237bd-3de6-4dc2-ba81-087da1016293)
* ["Classic Outlook crashes on reply and forward"](https://support.microsoft.com/en-us/office/classic-outlook-crashes-on-reply-and-forward-b7394654-adc2-4fdb-b555-8d4d7e57ab1b) - January 2025

**Reddit Reality Check**: ["'New Outlook' is a mess"](https://www.reddit.com/r/Windows11/comments/1c91c2c/new_outlook_is_a_mess/) - r/Windows11, April 2024.

#### Our Real-World Experience with Outlook

Our codebase reveals the ongoing nightmare of Outlook compatibility through actual code comments and fixes:

**Microsoft's Arbitrary Spam Detection**:

```javascript
// Microsoft has an issue where they block emails from new IP addresses
// and there's no way to get them unblocked without going through their
// manual review process which can take weeks or months
// <https://github.com/forwardemail/forwardemail.net/blob/73a05c8a0e1b02e6dad40a35d7d130a42effb364/config/index.js#L502-L506>
```

**Outlook-Specific Email Handling**:

```javascript
// Outlook has issues with certain email headers and formatting
// so we need to handle them differently than other providers
// <https://github.com/forwardemail/forwardemail.net/blob/73a05c8a0e1b02e6dad40a35d7d130a42effb364/helpers/on-data-mx.js#L116-L121>
```

**Unprecedented Spam from Outlook**:

```javascript
// We had to implement specific filtering for Outlook.com domains
// due to unprecedented amounts of spam originating from their platform
// Despite multiple complaints to their abuse team, we received zero response
// This required implementing custom detection patterns specifically for Outlook spam
// <https://github.com/forwardemail/forwardemail.net/blob/73a05c8a0e1b02e6dad40a35d7d130a42effb364/helpers/is-arbitrary.js#L187-L207>
```

**The Complexity Problem**: Outlook requires 2FA for simple IMAP access, then requires app passwords, but even then is buggy since proper IMAP with Outlook requires OAuth2. It's overtly complex and creates unnecessary frustration for users who just want their email to work.

### The Postmark Infrastructure Problem

We also experienced firsthand how email infrastructure degrades after acquisition. **Postmark**, originally owned by Wildbit and beloved by developers, was [acquired by ActiveCampaign in May 2022](https://postmarkapp.com/blog/postmark-and-dmarc-digests-acquired-by-activecampaign).

**The Problem**: We had to temporarily block Postmark due to:

* **DKIM Replay Attacks**: Postmark wasn't preventing DKIM replay attacks properly
* **Poor KYC Process**: Allowing anyone to signup without proper verification
* **IP Reputation Damage**: Thousands of spam emails damaging their delivery reputation

This issue took months to resolve and demonstrates how even "reliable" email infrastructure can become problematic after corporate acquisition.

### Recent Email Client Casualties (2024-2025)

The email client graveyard continues to grow with recent high-profile shutdowns:

**[Postbox](https://www.postbox-inc.com/)**: After 16 years of development, [acquired and immediately shut down by eM Client in October 2024](https://www.emclient.com/blog/em-client-acquires-postbox-inc-695). Support ended December 22, 2024.

**Email Client Funding Continues**:

* **[Canary Mail](https://canarymail.io/)**: [Backed by Sequoia Capital's Surge program with $2M+ funding](https://www.crunchbase.com/organization/canary-mail), yet [users report features don't work and subscriptions can't be refunded](https://www.reddit.com/r/macapps/comments/1887h8w/warning_about_canary_mail/)
* **[Spark by Readdle](https://sparkmailapp.com/)**: Despite being part of a successful app company, [users report "nightmarish experience" and lack of responsiveness](https://www.reddit.com/r/SparkMail/comments/18d919k/a_nightmarish_experience_why_you_should_avoid/)
* **[Mailbird](https://www.getmailbird.com/)**: Windows email client that [users say "turned into a terrible company, which doesn't honor the licenses"](https://www.reddit.com/r/software/comments/17r3twi/best_windows_mail_program/)
* **[Airmail](https://airmailapp.com/)**: Mac/iOS email client by Italian company Bloop SRL, [originally based on the failed Sparrow client](https://en.wikipedia.org/wiki/Airmail_\(email_client\))

### Email Extension and Service Acquisitions

**Recent Acquisitions That Actually Worked**:

* **[ToutApp](https://www.crunchbase.com/organization/toutapp)**: [Acquired by Marketo in April 2017](https://www.prnewswire.com/news-releases/marketo-acquires-sales-engagement-platform-toutapp-300442494.html) after raising $15M+ in funding
* **[Bananatag](https://staffbase.com/en/bananatag/)**: Email tracking startup [acquired by Staffbase in 2021](https://betakit.com/following-merger-with-kelownas-bananatag-staffbase-secures-145-million/) and rebranded as "Staffbase Email"

**Discontinued Extensions**:

* **[HubSpot Sidekick](https://community.hubspot.com/t5/Releases-and-Updates/Sidekick-is-now-HubSpot-Sales/ba-p/418271)**: Popular Gmail extension [discontinued in 2016 and replaced with "HubSpot Sales"](https://community.hubspot.com/t5/Releases-and-Updates/Sidekick-is-now-HubSpot-Sales/ba-p/418271)
* **[Engage for Gmail](https://help.salesforce.com/s/articleView?id=release-notes.rn_mcae_engage_gmail_extension_eol.htm)**: Salesforce extension [retired in June 2024](https://help.salesforce.com/s/articleView?id=000927354\&language=en_US\&type=1) due to Google's Manifest V2 deprecation

### The Survivors: Email Companies That Actually Work

**Successful Email Startups** (proving the exception, not the rule):

* **[Mailmodo](https://www.mailmodo.com/)**: Y Combinator company that [raised $2M from Sequoia's Surge in 2021](https://www.forbes.com/sites/davidprosser/2021/07/22/mailmoto-secures-2m-of-funding-for-the-email-platform-of-the-future/) for interactive AMP emails
* **[Mixmax](https://www.mixmax.com/)**: [Raised $13.3M total funding](https://pitchbook.com/profiles/company/98273-71) and remains active as a sales engagement platform
* **[Outreach.io](https://www.outreach.io/)**: [Valued at $1.33B+ with $351M+ raised](https://www.crunchbase.com/organization/outreach), preparing for potential IPO
* **[Apollo.io](https://www.apollo.io/)**: [Reached $1.6B valuation with $100M Series D in 2023](https://news.crunchbase.com/sales-marketing/apollo-io-funding-sales-tech-unicorn/)
* **[GMass](https://www.gmass.co/)**: Bootstrap success story [generating $140K/month](https://mixergy.com/interviews/gmass-with-ajay-goel/) as a Gmail extension
* **[Streak CRM](https://www.streak.com/)**: [Raised $1.9M in 2012](https://techcrunch.com/2012/10/15/streak-raises-1-9-million-for-gmail-based-crm-app/) and continues as a successful Gmail-based CRM

**Key Pattern**: The survivors either enhance existing email workflows (like Streak, GMass) or serve specific business needs (like Outreach, Apollo) rather than trying to replace email entirely.

**The Cycle**:

1. **Acquire** promising email service for billions
2. **Neglect** infrastructure and development
3. **Merge** into existing platform (badly)
4. **Break** functionality that previously worked
5. **Blame** users for "configuration issues"

**The Result**: Email services that were once reliable become unreliable through corporate mismanagement, proving that acquisition often equals death - just slower and more painful.
