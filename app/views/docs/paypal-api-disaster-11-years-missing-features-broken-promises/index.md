# PayPal's 11-Year API Disaster: How We Built Workarounds While They Ignored Developers

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="" class="rounded-lg" />

<p class="lead mt-3">At Forward Email, we've been dealing with PayPal's broken APIs for over a decade. What started as minor frustrations has turned into a complete disaster that forced us to build our own workarounds, block their phishing templates, and ultimately halt all PayPal payments during a critical account migration.</p>
<p class="lead mt-3">This is the story of 11 years of PayPal ignoring basic developer needs while we tried everything to make their platform work.</p>
<p class="lead mt-3">If anyone at PayPal is reading this, please resolve #PP-L-555681076245, #5438494065044876800, and case #15607630 because clearly nobody is paying attention.</p>


## Table of Contents

* [The Missing Piece: No Way to List Subscriptions](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: The Problem Emerges](#2014-2017-the-problem-emerges)
* [2020: We Give Them Extensive Feedback](#2020-we-give-them-extensive-feedback)
  * [The 27-Item Feedback List](#the-27-item-feedback-list)
  * [Teams Got Involved, Promises Were Made](#teams-got-involved-promises-were-made)
  * [The Result? Nothing.](#the-result-nothing)
* [The Executive Exodus: How PayPal Lost All Institutional Memory](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: New Leadership, Same Problems](#2025-new-leadership-same-problems)
  * [The New CEO Gets Involved](#the-new-ceo-gets-involved)
  * [Michelle Gill's Response](#michelle-gills-response)
  * [Our Response: No More Meetings](#our-response-no-more-meetings)
  * [Marty Brodbeck's Overengineering Response](#marty-brodbecks-overengineering-response)
  * [The "Simple CRUD" Contradiction](#the-simple-crud-contradiction)
  * [The Disconnect Becomes Clear](#the-disconnect-becomes-clear)
* [Years of Bug Reports They Ignored](#years-of-bug-reports-they-ignored)
  * [2016: Early UI/UX Complaints](#2016-early-uiux-complaints)
  * [2021: Business Email Bug Report](#2021-business-email-bug-report)
  * [2021: UI Improvement Suggestions](#2021-ui-improvement-suggestions)
  * [2021: Sandbox Environment Failures](#2021-sandbox-environment-failures)
  * [2021: Reports System Completely Broken](#2021-reports-system-completely-broken)
  * [2022: Core API Feature Missing (Again)](#2022-core-api-feature-missing-again)
* [The Developer Experience Nightmare](#the-developer-experience-nightmare)
  * [Broken User Interface](#broken-user-interface)
  * [SDK Problems](#sdk-problems)
  * [Content Security Policy Violations](#content-security-policy-violations)
  * [Documentation Chaos](#documentation-chaos)
  * [Security Vulnerabilities](#security-vulnerabilities)
  * [Session Management Disaster](#session-management-disaster)
* [July 2025: The Final Straw](#july-2025-the-final-straw)
* [Why We Can't Just Drop PayPal](#why-we-cant-just-drop-paypal)
* [The Community Workaround](#the-community-workaround)
* [Blocking PayPal Templates Due to Phishing](#blocking-paypal-templates-due-to-phishing)
  * [The Real Problem: PayPal's Templates Look Like Scams](#the-real-problem-paypals-templates-look-like-scams)
  * [Our Implementation](#our-implementation)
  * [Why We Had to Block PayPal](#why-we-had-to-block-paypal)
  * [The Scale of the Problem](#the-scale-of-the-problem)
  * [The Irony](#the-irony)
  * [Real-World Impact: Novel PayPal Scams](#real-world-impact-novel-paypal-scams)
* [PayPal's Backwards KYC Process](#paypals-backwards-kyc-process)
  * [How It Should Work](#how-it-should-work)
  * [How PayPal Actually Works](#how-paypal-actually-works)
  * [The Real-World Impact](#the-real-world-impact)
  * [The July 2025 Account Migration Disaster](#the-july-2025-account-migration-disaster)
  * [Why This Matters](#why-this-matters)
* [How Every Other Payment Processor Does It Right](#how-every-other-payment-processor-does-it-right)
  * [Stripe](#stripe)
  * [Paddle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Square](#square)
  * [The Industry Standard](#the-industry-standard)
  * [What Other Processors Provide vs PayPal](#what-other-processors-provide-vs-paypal)
* [What This Means for Developers](#what-this-means-for-developers)


## The Missing Piece: No Way to List Subscriptions

Here's the thing that blows our minds: PayPal has had subscription billing since 2014, but they've never provided a way for merchants to list their own subscriptions.

Think about that for a second. You can create subscriptions, you can cancel them if you have the ID, but you can't get a list of all active subscriptions for your account. It's like having a database with no SELECT statement.

We need this for basic business operations:

* Customer support (when someone emails asking about their subscription)
* Financial reporting and reconciliation
* Automated billing management
* Compliance and auditing

But PayPal? They just... never built it.


## 2014-2017: The Problem Emerges

The subscription listing issue first appeared in PayPal's community forums back in 2017. Developers were asking the obvious question: "How do I get a list of all my subscriptions?"

PayPal's response? Crickets.

Community members started getting frustrated:

> "Very odd omission if a merchant can't list all active Agreements. If the Agreement ID is lost this means only the user can cancel or suspend an agreement." - leafspider

> "+1. It has been almost 3 years." - laudukang (meaning the problem existed since \~2014)

The [original community post](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) from 2017 shows developers begging for this basic functionality. PayPal's response was to archive the repository where people were reporting the issue.


## 2020: We Give Them Extensive Feedback

In October 2020, PayPal reached out to us for a formal feedback session. This wasn't some casual chat - they organized a 45-minute Microsoft Teams call with 8 PayPal executives including Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze, and others.

### The 27-Item Feedback List

We came prepared. After 6 hours of trying to integrate with their APIs, we had compiled 27 specific issues. Mark Stuart from the PayPal Checkout team said:

> Hey Nick, thanks for sharing w/ everyone today! I think this will be the catalyst for getting some more support and investment for our team to go and fix these things. It's been difficult to get rich feedback like what you've left us so far.

The feedback wasn't theoretical - it came from real integration attempts:

1. **Access token generation not working**:

> Access token generation is not working. Also, there should be more than just cURL examples.

2. **No web UI for subscription creation**:

> How the heck can you create subscriptions without having to do it using cURL? There doesn't seem to be a web UI to do this (like Stripe has)

Mark Stuart found the access token issue particularly concerning:

> We don't typically hear of issues around access token generation.

### Teams Got Involved, Promises Were Made

As we discovered more issues, PayPal kept adding more teams to the conversation. Darshan Raju from the Subscriptions management UI team joined and said:

> Acknowledge the gap. We'll track and address this. Thanks again for your feedback!

The session was described as seeking a:

> candid walk through of your experience

to:

> make PayPal what it should be for developers.

### The Result? Nothing.

Despite the formal feedback session, the extensive 27-item list, multiple team involvement, and promises to:

> track and address

issues, absolutely nothing got fixed.


## The Executive Exodus: How PayPal Lost All Institutional Memory

Here's where it gets really interesting. Every single person who received our 2020 feedback has left PayPal:

**Leadership Changes:**

* [Dan Schulman (CEO for 9 years) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (September 2023)
* [Sri Shivananda (CTO who organized feedback) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (January 2024)

**Technical Leaders Who Made Promises, Then Left:**

* **Mark Stuart** (promised feedback would be "catalyst") → [Now at Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18-year PayPal veteran) → [CEO of MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP Global Consumer Product) → [Retired](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (one of the last remaining) → [Just left for Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (January 2025)

PayPal has become a revolving door where executives collect developer feedback, make promises, then leave for better companies like JPMorgan, Ripple, and other fintech firms.

This explains why the 2025 GitHub issue response seemed completely disconnected from our 2020 feedback - literally everyone who received that feedback has left PayPal.


## 2025: New Leadership, Same Problems

Fast forward to 2025, and the exact same pattern emerges. After years of no progress, PayPal's new leadership reaches out again.

### The New CEO Gets Involved

On June 30, 2025, we escalated directly to PayPal's new CEO Alex Chriss. His response was brief:

> Hi Nick – Thank you for reaching out and the feedback. Michelle (cc'd) is on point with her team to engage and work through this with you. Thanks -A

### Michelle Gill's Response

Michelle Gill, EVP and General Manager of Small Business and Financial Services, responded:

> Thanks very much Nick, moving Alex to bcc. We have been looking into this since your earlier post. We will give you a call before the week is out. Can you please send me your contact info so one of my colleagues can reach out. Michelle

### Our Response: No More Meetings

We declined another meeting, explaining our frustration:

> Thank you. However I don't feel like getting on a call is going to do anything. Here's why... I got on a call in the past and it went absolutely nowhere. I wasted 2+ hours of my time talking to the entire team and leadership and nothing got done... Tons of emails back and forth. Absolutely nothing done. Feedback went nowhere. I tried for years, get listened to, and then it goes nowhere.

### Marty Brodbeck's Overengineering Response

Then Marty Brodbeck, who heads consumer engineering at PayPal, reached out:

> Hi Nick, this is Marty Brodbeck. I head up all consumer engineering here at PayPal and have been driving the api development for the company. Can you and I connect on the problem you are facing and how we may help here.

When we explained the simple need for a subscription listing endpoint, his response revealed the exact problem:

> Thanks Nick, we are in the process of creating a single subscription api with full SDK (supports full error handling, event-based subscription tracking, robust uptime) where billing is also split out as a separate API for merchants to go to rather than having to orchestrate across multiple endpoints to get a single response.

This is exactly the wrong approach. We don't need months of complex architecture. We need one simple REST endpoint that lists subscriptions - something that should have existed since 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### The "Simple CRUD" Contradiction

When we pointed out this was basic CRUD functionality that should have existed since 2014, Marty's response was telling:

> Simple Crud operations are part of the core API my friend, so it won't take months of development

The PayPal TypeScript SDK, which currently supports only three endpoints after months of development, along with its historical timeline, clearly demonstrates that such projects require more than a few months to complete.

This response shows he doesn't understand his own API. If "simple CRUD operations are part of the core API," then where is the subscription listing endpoint? We responded:

> If 'simple CRUD operations are part of the core API' then where is the subscription listing endpoint? Developers have been asking for this 'simple CRUD operation' since 2014. It's been 11 years. Every other payment processor has had this basic functionality since day one.

### The Disconnect Becomes Clear

The 2025 exchanges with Alex Chriss, Michelle Gill, and Marty Brodbeck show the same organizational dysfunction:

1. **New leadership has no knowledge of previous feedback sessions**
2. **They propose the same overengineered solutions**
3. **They don't understand their own API limitations**
4. **They want more meetings instead of just fixing the issue**

This pattern explains why PayPal teams in 2025 seem completely disconnected from the extensive feedback provided in 2020 - the people who received that feedback are gone, and the new leadership is repeating the same mistakes.


## Years of Bug Reports They Ignored

We didn't just complain about missing features. We actively reported bugs and tried to help them improve. Here's a comprehensive timeline of the issues we documented:

### 2016: Early UI/UX Complaints

Even back in 2016, we were publicly reaching out to PayPal leadership including Dan Schulman about interface problems and usability issues. This was 9 years ago, and the same UI/UX problems persist today.

### 2021: Business Email Bug Report

In March 2021, we reported that PayPal's business email system was sending incorrect cancellation notifications. The email template had variables rendered incorrectly, showing confusing messages to customers.

Mark Stuart acknowledged the issue:

> Thanks Nick! Moving to BCC. @Prasy, is your team responsible for this e-mail or know who is? The "Niftylettuce, LLC, we'll no longer bill you" leads me to believe there's a mix-up in who it's addressed to and the contents of the e-mail.

**Result**: They actually fixed this one! Mark Stuart confirmed:

> Just heard from the notifications team that the e-mail template has been fixed and rolled out. Appreciate you reaching out to report it. Thank you!

This shows they CAN fix things when they want to - they just choose not to for most issues.

### 2021: UI Improvement Suggestions

In February 2021, we provided detailed feedback on their dashboard UI, specifically the "PayPal Recent Activity" section:

> I think the dashboard at paypal.com, specifically "PayPal Recent Activity" needs improved. I don't think you should show the $0 Recurring payment "Created" status lines - it just adds a ton of extra lines and you can't easily see at a glance how much income is generating for the day/past few days.

Mark Stuart forwarded it to the consumer products team:

> Thanks! I'm not sure what team is responsible for Activity, but I forwarded it to the head of consumer products to find the correct team. A $0.00 recurring payment seems like a bug. Should probably be filtered out.

**Result**: Never fixed. The UI still shows these useless $0 entries.

### 2021: Sandbox Environment Failures

In November 2021, we reported critical issues with PayPal's sandbox environment:

* Sandbox secret API keys were randomly changed and disabled
* All sandbox test accounts were deleted without notice
* Error messages when trying to view sandbox account details
* Intermittent loading failures

> For some reason my sandbox secret API key was changed and it was Disabled. Also all my old Sandbox test accounts were deleted.

> Sometimes they load and sometimes they don't as well. This is insanely frustrating.

**Result**: No response, no fix. Developers still face sandbox reliability issues.

### 2021: Reports System Completely Broken

In May 2021, we reported that PayPal's download system for transaction reports was completely broken:

> Seems like reporting downloads don't work right now and haven't all day. Also should probably get an email notification if it fails.

We also pointed out the session management disaster:

> Also if you're inactive while logged into PayPal for like 5 minutes you get logged out. So when you refresh the button again next to the report you want to check the status of (after you wait forever), it's a pita to have to log back in again.

Mark Stuart acknowledged the session timeout issue:

> I remember you had reported that in the past w/ your session expiring often and disrupting your development flow while you're switching between your IDE and developer.paypal.com or your merchant dashboard, then you'd come back and be logged out again.

**Result**: Session timeouts are still 60 seconds. Reports system still fails regularly.

### 2022: Core API Feature Missing (Again)

In January 2022, we escalated the subscription listing issue again, this time with even more detail about how their documentation was wrong:

> There is no GET which lists all subscriptions (previously called billing agreements)

We discovered their official documentation was completely inaccurate:

> The API docs are also totally inaccurate. We thought we could do a workaround by downloading a hard-coded list of subscription ID's. But that doesn't even work!

> From the official docs here... It says you can do this... Here's the kicker- there's no "Subscription ID" field at all anywhere to be found to be checked off.

Christina Monti from PayPal responded:

> Apologize for the frustrations caused by these steps being wrong, we'll fix that this week.

Sri Shivananda (CTO) thanked us:

> Thanks for your continued help in making us better. Much appreciated.

**Result**: Documentation was never fixed. The subscription listing endpoint was never created.


## The Developer Experience Nightmare

Working with PayPal's APIs is like stepping back in time 10 years. Here are the technical issues we've documented:

### Broken User Interface

The PayPal developer dashboard is a disaster. Here's what we deal with daily:

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  PayPal's UI is so broken you can't even dismiss notifications
  </div></figcaption>
  <video loading="lazy" controls>
    <source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  The developer dashboard literally makes you drag a slider then logs you out after 60 seconds
  </div></figcaption>
  <video loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  More UI disasters in the PayPal developer interface showing broken workflows
  </div></figcaption>
  <video loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  The subscription management interface - the interface is so bad we had to rely on code to generate products and subscription plans
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  A view of the broken subscription interface with missing functionality (you can't easily create products/plans/subscriptions &ndash; and there does not seem to be a way at all to delete products nor plans once created in the UI)
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Typical PayPal error messages - cryptic and unhelpful
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-errors.png" alt="" class="rounded-lg" />
</figure>

### SDK Problems

* Can't handle both one-time payments and subscriptions without complex workarounds involving swapping and re-rendering buttons while re-loading the SDK with script tags
* JavaScript SDK violates basic conventions (lowercase class names, no instance checking)
* Error messages don't indicate which fields are missing
* Inconsistent data types (requiring string amounts instead of numbers)

### Content Security Policy Violations

Their SDK requires unsafe-inline and unsafe-eval in your CSP, **forcing you to compromise your site's security**.

### Documentation Chaos

Mark Stuart himself admitted:

> Agreed that there's an absurd amount of legacy and new APIs. Really difficult to find what to look for (even for us who work here).

### Security Vulnerabilities

**PayPal's 2FA implementation is backwards**. Even with TOTP apps enabled, they force SMS verification - making accounts vulnerable to SIM swap attacks. If you have TOTP enabled, it should use that exclusively. The fallback should be email, not SMS.

### Session Management Disaster

**Their developer dashboard logs you out after 60 seconds of inactivity**. Try to do anything productive and you're constantly going through: login → captcha → 2FA → logout → repeat.  Using a VPN?  Good luck.


## July 2025: The Final Straw

After 11 years of the same issues, the breaking point came during a routine account migration. We needed to transition to a new PayPal account to match our company name "Forward Email LLC" for cleaner accounting.

What should have been simple turned into a complete disaster:

* Initial testing showed everything worked correctly
* Hours later, PayPal suddenly blocked all subscription payments without notice
* Customers couldn't pay, creating confusion and support burden
* PayPal support gave contradictory responses claiming accounts were verified
* We were forced to completely halt PayPal payments

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  The error customers saw when trying to pay - no explanation, no logs, nothing
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  PayPal support claiming everything was fine while payments were completely broken. The final message shows them saying they "restored some features" but still asking for more unspecified information - classic PayPal support theater
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  The identity verification process that supposedly "fixed" nothing
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-6.png" alt="" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-7.png" alt="" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Vague message and still no resolution.  Zero information, notices, or anything as to what additional information is required.  Customer support goes silent.
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-restored.png" alt="" class="rounded-lg" />
</figure>


## Why We Can't Just Drop PayPal

Despite all these issues, we can't completely abandon PayPal because some customers only have PayPal as a payment option. As one customer said on our [status page](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> PayPal is my only option for payment

**We're stuck supporting a broken platform because PayPal has created a payment monopoly for certain users.**


## The Community Workaround

Since PayPal won't provide basic subscription listing functionality, the developer community has built workarounds. We created a script that helps manage PayPal subscriptions: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

This script references a [community gist](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4) where developers share solutions. Users are actually [thanking us](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) for providing what PayPal should have built years ago.


## Blocking PayPal Templates Due to Phishing

The problems go beyond APIs. PayPal's email templates are so poorly designed that we had to implement specific filtering in our email service because they're indistinguishable from phishing attempts.

### The Real Problem: PayPal's Templates Look Like Scams

We regularly receive reports of PayPal emails that look exactly like phishing attempts. Here's an actual example from our abuse reports:

**Subject:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

This email was forwarded to `abuse@microsoft.com` because it appeared to be a phishing attempt. The problem? It was actually from PayPal's sandbox environment, but their template design is so poor that it triggers phishing detection systems.

### Our Implementation

You can see our PayPal-specific filtering implemented in our [email filtering code](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

```javascript
// check for paypal scam (very strict until PayPal resolves phishing on their end)
// (seems to only come from "outlook.com" and "paypal.com" hosts)
//
// X-Email-Type-Id = RT000238
// PPC001017
// RT000542 = gift message hack
// <https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-fraud/>
//
if (
  session.originalFromAddressRootDomain === 'paypal.com' &&
  headers.hasHeader('x-email-type-id') &&
  ['PPC001017', 'RT000238', 'RT000542'].includes(
    headers.getFirst('x-email-type-id')
  )
) {
  const err = new SMTPError(
    'Due to ongoing PayPal invoice spam, you must manually send an invoice link'
  );
  err.isCodeBug = true; // alert admins for inspection
  throw err;
}
```

### Why We Had to Block PayPal

We implemented this because PayPal refused to fix massive spam/phishing/fraud issues despite our repeated reports to their abuse teams. The specific email types we block include:

* **RT000238** - Suspicious invoice notifications
* **PPC001017** - Problematic payment confirmations
* **RT000542** - Gift message hack attempts

### The Scale of the Problem

Our spam filtering logs show the massive volume of PayPal invoice spam we process daily. Examples of blocked subjects include:

* "Invoice from PayPal Billing Team:- This charge will be auto-debited from your account. Please contact us immediately at \[PHONE]"
* "Invoice from \[COMPANY NAME] (\[ORDER-ID])"
* Multiple variations with different phone numbers and fake order IDs

These emails often come from `outlook.com` hosts but appear to originate from PayPal's legitimate systems, making them particularly dangerous. The emails pass SPF, DKIM, and DMARC authentication because they're sent through PayPal's actual infrastructure.

Our technical logs show these spam emails contain legitimate PayPal headers:

* `X-Email-Type-Id: RT000238` (the same ID we block)
* `From: "service@paypal.com" <service@paypal.com>`
* Valid DKIM signatures from `paypal.com`
* Proper SPF records showing PayPal's mail servers

This creates an impossible situation: legitimate PayPal emails and spam both have identical technical characteristics.

### The Irony

PayPal, a company that should be leading the fight against financial fraud, has email templates so poorly designed that they trigger anti-phishing systems. We're forced to block legitimate PayPal emails because they're indistinguishable from scams.

This is documented in security research: [Beware PayPal new address fraud](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - showing how PayPal's own systems are exploited for fraud.

### Real-World Impact: Novel PayPal Scams

The problem extends beyond just poor template design. PayPal's invoice system is so easily exploited that scammers regularly abuse it to send legitimate-looking fraudulent invoices. Security researcher Chris Anderegg documented [A Novel PayPal Scam](https://anderegg.ca/2023/02/01/a-novel-paypal-scam) where scammers send real PayPal invoices that pass all authentication checks:

> "Inspecting the source, the email looked like it actually came from PayPal (SPF, DKIM, and DMARC all passed). The button also linked to what looked like a legitimate PayPal URL... It took a second to dawn on me that it was a legit email. I had just been sent a random 'invoice' from a scammer."

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Screenshot showing multiple fraudulent PayPal invoices flooding an inbox, all appearing legitimate because they actually come from PayPal's systems
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="" class="rounded-lg" />
</figure>

The researcher noted:

> "It also seems like a convenience feature that PayPal should consider locking down. I immediately assumed this was some form of scam and was only interested in the technical details. It seems far too easy to pull off, and I worry that others might fall for it."

This perfectly illustrates the problem: PayPal's own legitimate systems are so poorly designed that they enable fraud while simultaneously making legitimate communications look suspicious.

To make matters worse, this affected our deliverability with Yahoo resulting in customer complaints and hours of meticulous testing and pattern checking.


## PayPal's Backwards KYC Process

One of the most frustrating aspects of PayPal's platform is their backwards approach to compliance and Know Your Customer (KYC) procedures. Unlike every other payment processor, PayPal allows developers to integrate their APIs and start collecting payments in production before completing proper verification.

### How It Should Work

Every legitimate payment processor follows this logical sequence:

1. **Complete KYC verification first**
2. **Approve the merchant account**
3. **Provide production API access**
4. **Allow payment collection**

This protects both the payment processor and the merchant by ensuring compliance before any money changes hands.

### How PayPal Actually Works

PayPal's process is completely backwards:

1. **Provide production API access immediately**
2. **Allow payment collection for hours or days**
3. **Suddenly block payments without notice**
4. **Demand KYC documentation after customers are already affected**
5. **Provide no notification to the merchant**
6. **Let customers discover the problem and report it**

### The Real-World Impact

This backwards process creates disasters for businesses:

* **Customers can't complete purchases** during peak sales periods
* **No advance warning** that verification is needed
* **No email notifications** when payments are blocked
* **Merchants learn about problems from confused customers**
* **Revenue loss** during critical business periods
* **Customer trust damage** when payments mysteriously fail

### The July 2025 Account Migration Disaster

This exact scenario played out during our routine account migration in July 2025. PayPal allowed payments to work initially, then suddenly blocked them without any notification. We only discovered the problem when customers started reporting they couldn't pay.

When we contacted support, we received contradictory responses about what documentation was needed, with no clear timeline for resolution. This forced us to completely halt PayPal payments, confusing customers who had no other payment options.

### Why This Matters

PayPal's approach to compliance shows a fundamental misunderstanding of how businesses operate. Proper KYC should happen **before** production integration, not after customers are already trying to pay. The lack of proactive communication when issues arise demonstrates PayPal's disconnect from merchant needs.

This backwards process is symptomatic of PayPal's broader organizational problems: they prioritize their internal processes over merchant and customer experience, leading to the kind of operational disasters that drive businesses away from their platform.


## How Every Other Payment Processor Does It Right

The subscription listing functionality that PayPal refuses to implement has been standard in the industry for over a decade. Here's how other payment processors handle this basic requirement:

### Stripe

Stripe has had subscription listing since their API launched. Their documentation clearly shows how to retrieve all subscriptions for a customer or merchant account. This is considered basic CRUD functionality.

### Paddle

Paddle provides comprehensive subscription management APIs including listing, filtering, and pagination. They understand that merchants need to see their recurring revenue streams.

### Coinbase Commerce

Even cryptocurrency payment processors like Coinbase Commerce provide better subscription management than PayPal.

### Square

Square's API includes subscription listing as a fundamental feature, not an afterthought.

### The Industry Standard

Every modern payment processor provides:

* List all subscriptions
* Filter by status, date, customer
* Pagination for large datasets
* Webhook notifications for subscription changes
* Comprehensive documentation with working examples

### What Other Processors Provide vs PayPal

**Stripe - List All Subscriptions:**

```http
GET https://api.stripe.com/v1/subscriptions
Authorization: Bearer sk_test_...

Response:
{
  "object": "list",
  "data": [
    {
      "id": "sub_1MowQVLkdIwHu7ixeRlqHVzs",
      "object": "subscription",
      "status": "active",
      "customer": "cus_Na6dX7aXxi11N4",
      "current_period_start": 1679609767,
      "current_period_end": 1682288167
    }
  ],
  "has_more": false
}
```

**Stripe - Filter by Customer:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Filter by Status:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - What You Actually Get:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# You can ONLY get ONE subscription if you already know the ID
# There is NO endpoint to list all subscriptions
# There is NO way to search or filter
# You must track all subscription IDs yourself
```

**PayPal's Available Endpoints:**

* `POST /v1/billing/subscriptions` - Create a subscription
* `GET /v1/billing/subscriptions/{id}` - Get ONE subscription (if you know the ID)
* `PATCH /v1/billing/subscriptions/{id}` - Update a subscription
* `POST /v1/billing/subscriptions/{id}/cancel` - Cancel subscription
* `POST /v1/billing/subscriptions/{id}/suspend` - Suspend subscription

**What's Missing from PayPal:**

* ❌ No `GET /v1/billing/subscriptions` (list all)
* ❌ No search functionality
* ❌ No filtering by status, customer, date
* ❌ No pagination support

PayPal is the only major payment processor that forces developers to manually track subscription IDs in their own databases.


## What This Means for Developers

PayPal's systematic failure to address basic developer needs while collecting extensive feedback shows a fundamental organizational problem. They treat feedback collection as a substitute for actually fixing issues.

The pattern is clear:

1. Developers report issues
2. PayPal organizes feedback sessions with executives
3. Extensive feedback is provided
4. Teams acknowledge gaps and promise to "track and address"
5. Nothing gets implemented
6. Executives leave for better companies
7. New teams ask for the same feedback
8. Cycle repeats

Meanwhile, developers are forced to build workarounds, compromise security, and deal with broken UIs just to accept payments.

If you're building a payment system, learn from our experience: build your [trifecta approach](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) with multiple processors, but don't expect PayPal to provide the basic functionality you need. Plan to build workarounds from day one.

> This post documents our 11-year experience with PayPal's APIs at Forward Email. All code examples and links are from our actual production systems. We continue to support PayPal payments despite these issues because some customers have no other option
