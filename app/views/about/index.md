# About Forward Email


## Table of Contents

* [Foreword](#foreword)
* [History](#history)


## Foreword

Forward Email is a [free and open-source](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [email forwarding](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") service focused on a user's [right to privacy](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy"), and was launched in November 2017.  It offers unlimited custom domain names, unlimited email addresses and aliases, unlimited disposable email addresses, spam and phishing protection, and other features.  The service is maintained and owned by its original founding team of designers and developers.  It is built with 100% open-source software using [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS"), and [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").


## History

We launched in November 2017 after an initial release.

In April 2018 [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") launched their [privacy-first consumer DNS service](https://blog.cloudflare.com/announcing-1111/), and we switched from using [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") to [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") for handling [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System") lookups.

In October 2018, we allowed users to "Send Mail As" with [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") and [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook").

In May 2019, we released v2, which was a major rewrite from the initial versions and focused on [performance](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") through the use of [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")'s [streams](https://en.wikipedia.org/wiki/Streams "Streams").

In February 2020, we released the Enhanced Privacy Protection plan.  This plan allows users to switch off setting public DNS record entries with their email forwarding configuration aliases. Through this plan, a user's email alias information is hidden from being publicly searchable over the Internet. We also released a feature to enable or disable specific aliases while still allowing them to appear as a valid email address and return a successful [SMTP status code](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes"), but the emails will be immediately discarded (similar to piping output from a process to [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

In April 2020, we released our initial alpha version of Spam Scanner after hitting countless roadblocks with existing spam-detection solutions and because none of these solutions ([Rspamd](https://fr.wikipedia.org/wiki/Rspamd) and [SpamAssassin](https://en.wikipedia.org/wiki/SpamAssassin "SpamAssassin")) honored our privacy policy. Spam Scanner is a completely free and open-source [anti-spam filtering](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") solution which uses a [Naive Bayes spam filtering](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") approach in combination with [anti-phishing](https://en.wikipedia.org/wiki/Phishing "Phishing") and [IDN homograph attack](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack") protection.  We also released a feature to allow [two-factor authentication](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) using a [one-time password](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) for enhanced account security.

In May 2020, we allowed custom [port forwarding](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") as workaround for users to circumvent port blocking by their [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider").  We also released our [Free Email Forwarding RESTful API](/email-api), with complete documentation and real-time request and response examples.  We also released support for webhooks.

In August 2020, we added support for the [Authenticated Received Chain][arc] ("ARC") email authentication system.

On November 23, 2020 we publicly launched out of our beta program.

In February 2021, we refactored our codebase to remove all [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\)) dependencies – which allowed our stack to become 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript) and [Node.js](https://en.wikipedia.org/wiki/Node.js).

On September 27, 2021, [we added support](/email-forwarding-regex-pattern-filter) for email forwarding aliases to match [regular expressions](https://en.wikipedia.org/wiki/Regular_expression).

In January 2023, we launched a re-designed and page-speed optimized website.

In February 2023, we added support for [error logs](/faq#do-you-store-error-logs) and a [dark mode](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) website color scheme.

In March 2023, we released [Tangerine](https://github.com/forwardemail/tangerine#readme) and integrated it throughout our infrastructure – this means we use [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") at the application layer.  We also added support for [MTA-STS](/faq#do-you-support-mta-sts) and [switched](https://github.com/cloudflare/cloudflare-docs/pull/7858) from [hCaptcha]() to [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile).

In April 2023, we implemented and automated entirely new infrastructure.  Our entire service is now running on globally load-balanced and proximity-based DNS (with health checks and failover) using [Cloudflare](https://cloudflare.com) (before we were using round-robin DNS on Cloudflare).  Additionally we switched to **bare metal servers** across multiple providers – which include [Vultr](https://www.vultr.com/?ref=7429848) and [Digital Ocean](https://m.do.co/c/a7fe489d1b27) (before we solely used Digital Ocean).  Both of these providers are SOC 2 Type 2 compliant – see [Vultr's Compliance](https://www.vultr.com/legal/compliance/) and [Digital Ocean's Certifications](https://www.digitalocean.com/trust/certification-reports) for more insight.  Furthermore, our MongoDB and Redis databases are now running on clusters with primary and standby nodes for high availability, end-to-end SSL encryption, encryption-at-rest, and point-in-time recovery (PITR).

In May 2023, we launched our **outbound SMTP** feature for [sending email with SMTP](/faq#do-you-support-sending-email-with-smtp) and [sending email with API](/faq#do-you-support-sending-email-with-api) requests.  This feature has built-in safeguards to ensure high deliverability, a modern and robust queue and retry system, and [supports error logs in real-time](/faq#do-you-store-error-logs).

In November 2023, we launched our [**encrypted mailbox storage**](/blog/docs/best-quantum-safe-encrypted-email-service) feature for [IMAP suppport](/faq#do-you-support-receiving-email-with-imap).

In December 2023, [we added support](/faq#do-you-support-pop3) for [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [passkeys and WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [time to inbox](/#tti) monitoring, and [OpenPGP for IMAP Storage](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

In February 2024, [we added calendar (CalDAV) support](/faq#do-you-support-calendars-caldav).

Throughout March to July 2024, we released major optimizations and improvements to our IMAP, POP3, and CalDAV service.  Our goal was to make our service snappy –  and as fast, if not faster than alternatives.

In July 2024, [we added iOS Push support](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) since Apple Mail on iOS does not support IMAP `IDLE` command.  Now users can get real-time notifications of new mail on their Apple iOS devices.  We also added time to inbox ("TTI") monitoring for our own service – as well as Yahoo/AOL (now that they support app-generated passwords again) to the footer of every page on our website.  Additionally, we now allow users to encrypt their plaintext DNS TXT records even on the free plan at no cost.  Privacy should not be a feature, it should be inherently built-in to all aspects of a product. As highly requested in a [Privacy Guides discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) and on [our GitHub issues](https://github.com/forwardemail/forwardemail.net/issues/254) we've added this.  Lastly, we added the ability for aliases to either quietly reject `250`, soft reject `421`, or hard reject `550` if they are disabled.  Previously, disabled aliases only routed to a blackhole (e.g. `/dev/null`) and it appeared to senders as if their messages to these disabled aliases succeeded.

In August 2024, we added support for exporting mailboxes as [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) and [Mbox](https://en.wikipedia.org/wiki/Mbox) formats (in addition to the [SQLite](https://en.wikipedia.org/wiki/SQLite) export format already supported).  [Webhook signature support](https://forwardemail.net/faq#do-you-support-webhooks:\~:text=If%20you%27re%20on%20a%20paid%20plan%2C%20then%20go%20to%20My%20Account%20%E2%86%92%20Domains%20%E2%86%92%20Settings%20%E2%86%92%20Webhook%20Signature%20Payload%20Verification%20Key%20to%20obtain%20your%20webhook%20key.) via `X-Webhook-Signature` header was added.  [Bounce webhook support was added](/faq#do-you-support-bounce-webhooks) and we now allow users to send newsletters, announcements, and email marketing through our outbound SMTP service.  We also added the ability to set domain-wide and alias-specific storage quotas for IMAP/POP3/CalDAV.

Through September 2024 to January 2025, [we added a highly-requested vacation responder feature and OpenPGP/WKD encryption for email forwarding](https://discuss.privacyguides.net/t/forward-email-new-features/24845/45) (in addition to IMAP that already was implemented).

<!--On January 21, 2025, our founder's best friend "Jack", whom was his loyal canine companion, peacefully passed away at the age of nearly 11 – may he rest in peace and [always be remembered](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) :paw\_prints:.-->

In February 2025, we switched to [DataPacket](https://www.datapacket.com) as our new primary data center provider – complete with our [own custom, performance-focused, bare-metal hardware](https://x.com/fwdemail/status/1889440529647280580).  We also removed Vultr as a data center provider and migrated all servers except mail exchange servers ("MX") from Digital Ocean.

[arc]: https://en.wikipedia.org/wiki/Authenticated_Received_Chain
