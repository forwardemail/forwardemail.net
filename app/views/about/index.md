# About Forward Email


## Table of Contents

* [Foreword](#foreword)
* [History](#history)


## Foreword

Forward Email is a [free and open-source](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [email forwarding](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") service focused on a user's [right to privacy](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy"), and was launched in November 2017.  It offers unlimited custom domain names, unlimited email addresses and aliases, unlimited disposable email addresses, spam and phishing protection, and other features. It is built with 100% open-source software using [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS"), and [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").

The service is maintained and owned by its original founding team of designers and developers.


## History

We launched in November 2017 after an initial release.

In April 2018 [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") launched their [privacy-first consumer DNS service](https://blog.cloudflare.com/announcing-1111/), and we switched from using [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") to [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") for handling [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System") lookups.

In October 2018, we allowed users to "Send Mail As" with [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") and [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook").

In May 2019, we released v2, which was a major rewrite from the initial versions and focused on [performance](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") through the use of [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")'s [streams](https://en.wikipedia.org/wiki/Streams "Streams").

In February 2020, we released the Enhanced Privacy Protection plan.  This plan allows users to switch off setting public DNS record entries with their email forwarding configuration aliases. Through this plan, a user's email alias information is hidden from being publicly searchable over the Internet. We also released a feature to enable or disable specific aliases while still allowing them to appear as a valid email address and return a successful [SMTP status code](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes"), but the emails will be immediately discarded (similar to piping output from a process to [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

In April 2020, we released our initial alpha version of Spam Scanner after hitting countless roadblocks with existing spam-detection solutions and because none of these solutions ([Rspamd](https://fr.wikipedia.org/wiki/Rspamd) and [SpamAssassin](https://en.wikipedia.org/wiki/SpamAssassin "SpamAssassin")) honored (our) privacy policy". Spam Scanner is a completely free and open-source [anti-spam filtering](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") solution which uses a [Naive Bayes spam filtering](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") approach in combination with [anti-phishing](https://en.wikipedia.org/wiki/Phishing "Phishing") and [IDN homograph attack](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack") protection.  We also released a feature to allow [two-factor authentication](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) using a [one-time password](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) for enhanced account security.

In May 2020, we allowed custom [port forwarding](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") as workaround for users to circumvent port blocking by their [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider").  We also released our [Free Email Forwarding RESTful API](/api), with complete documentation and real-time request and response examples.  We also released support for webhooks.

In August 2020, we added support for the [Authenticated Received Chain][arc] ("ARC") email authentication system.

On November 23, 2020 we publicly launched out of our beta program.

In February 2021, we refactored our codebase to remove all [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\)) dependencies – which allowed our stack to become 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript) and [Node.js](https://en.wikipedia.org/wiki/Node.js).

On September 27, 2021, [we added support](/email-forwarding-regex-pattern-filter) for email forwarding aliases to match [regular expressions](https://en.wikipedia.org/wiki/Regular_expression).

In January 2023, we launched a re-designed and page-speed optimized website.

In February 2023, we added support for [error logs](/faq#do-you-store-error-logs) and a [dark mode](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) website color scheme.

In March 2023, we released [Tangerine](https://github.com/forwardemail/tangerine#readme) and integrated it throughout our infrastructure – this means we use [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") at the application layer.  We also added support for [MTA-STS](/faq#do-you-support-mta-sts).

[arc]: https://en.wikipedia.org/wiki/Authenticated_Received_Chain
