# About Forward Email


## Table of Contents

* [Foreword](#foreword)
* [History](#history)
* [Service](#service)
* [Privacy](#privacy)
* [Special Thanks](#special-thanks)


## Foreword

**Forward Email** is a [free and open-source](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [email forwarding](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") service focused on a user's [right to privacy](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy"), and was launched in November 2017. It is powered by [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") and operates using the [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), and [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP") protocols. The service offers unlimited custom domain names, unlimited email addresses and aliases, unlimited disposable email addresses, spam and phishing protection, and other features.  Paid plans are offered for "Enhanced Privacy Protection", whereas the email alias configuration is hidden from the public.


## History

We launched [in November 2017](https://github.com/forwardemail/free-email-forwarding/commit/0769047d51524601949c0622b2a763b83332f0b0) after an initial release by co-founders [Niftylettuce](https://github.com/niftylettuce) and [Shaun Warman](https://github.com/shaunwarman).

In April 2018 [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") launched their [privacy-first consumer DNS service](https://blog.cloudflare.com/announcing-1111/), and we switched from using [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") to [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") for handling [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System") lookups.

In October 2018, we allowed users to "Send Mail As" with [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail"), [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook"), [Zoho](https://en.wikipedia.org/wiki/Zoho "Zoho"), [Apple Mail](https://en.wikipedia.org/wiki/Apple_Mail "Apple Mail"), and other [webmail](https://en.wikipedia.org/wiki/Webmail "Webmail") services.

In May 2019, we released [v2.0.0](https://github.com/forwardemail/free-email-forwarding/releases/tag/v2.0.0), which was a major rewrite from the initial versions v0.x and v1.x, which focused on [performance](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") through the use of [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")'s [streams](https://en.wikipedia.org/wiki/Streams "Streams").

In February 2020, we [released](https://github.com/forwardemail/free-email-forwarding/commit/f8978b0c267c08cd541115b55dba83c3ac8f82f6) the Enhanced Privacy Protection plan.  This plan allows users to switch off setting public DNS record entries with their email forwarding configuration aliases. Through this plan, a user's email alias information is hidden from being publicly searchable over the Internet. We also [released a feature](https://github.com/forwardemail/free-email-forwarding/commit/74fc6f3e75556b718cf4a1ea81ef0c96d83ab796) to enable or disable specific aliases while still allowing them to appear as a valid email address and return a successful [SMTP status code](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes"), but the emails will be immediately discarded (similar to piping output from a process to [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

In April 2020, our developer Niftylettuce [released](https://github.com/spamscanner/spamscanner/commit/6d25c1424ed8207d74d6370edb4ae82e54cd8d50) its initial alpha version of [Spam Scanner](https://github.com/spamscanner/spamscanner) "after hitting countless roadblocks with existing spam-detection solutions" and because "none of these solutions ([Rspamd](https://fr.wikipedia.org/wiki/Rspamd) and [SpamAssassin](https://en.wikipedia.org/wiki/SpamAssassin "SpamAssassin")) honored (our) privacy policy". Spam Scanner is a completely free and open-source [anti-spam filtering](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") solution which uses a [Naive Bayes spam filtering](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") approach in combination with [anti-phishing](https://en.wikipedia.org/wiki/Phishing "Phishing") and [IDN homograph attack](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack") protection. We also [released](https://github.com/forwardemail/forwardemail.net/commit/b171c9e2e2774c747298d0ecca2d4213f0a9f0c0) a feature to allow [two-factor authentication](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) using a [one-time password](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) for enhanced account security.

In May 2020, we [allowed](https://github.com/forwardemail/free-email-forwarding/commit/0c2f6a49a9069cfe03555eab82255ac5dcb3026e) custom [port forwarding](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") as workaround for users to circumvent port blocking by their [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider").  We also released our [Free Email Forwarding RESTful API](/api), with complete documentation and real-time request and response examples.  We also [released](https://github.com/forwardemail/free-email-forwarding/commit/6b4227e0b2728342719426ef4e5a806ca6f66a35) support for webhooks, due to high demand from users [switching](https://news.ycombinator.com/item?id=22192543) to use our service as a Mailgun webhook alternative.

In June 2020, we publicly released our real-time metrics and revenue on our [Open Startup](/open-startup) page (also available as a link in the footer of our site).

In August 2020, we added support for the [Authenticated Received Chain][arc] ("ARC") email authentication system.


## Service

As of May 2020, we operate from 3 server locations across 2 countries.  We have future plans to move our servers to a country such as Iceland, which has [championed itself as a beacon of net neutrality and online privacy](https://www.ivpn.net/internet-privacy-laws-in-iceland).


## Privacy

We have a "zero tolerance policy" [privacy policy](/privacy), which states that we don't store logs nor emails, and we don't track users. Our statement clearly states that we do not collect nor store forwarded emails, metadata, server-side nor client-side logs, IP addresses, or browser information.

Only an email address is required to create and configure the Enhanced Protection Plan, which hides DNS email alias information on the free plan through a managed and hosted service.

User's accounts, domains, and all related information can be permanently deleted at any time by the user.


## Special Thanks

Forward Email's source code is primarily developed by [Niftylettuce](https://github.com/niftylettuce), whom publicly credits immense open-source contributions from the following people:

* [Ryan Lee Sipes](https://ryanleesipes.me/) (the driving force to revitalize and modernize [Mozilla Thunderbird](https://www.thunderbird.net/)) for serving as an advisor, assisting with growth, and relentlessly contributing feedback on product iterations.

* [Shaun Warman](https://www.shaunwarman.com) for [integration](https://www.shaunwarman.com/posts/enable-2fa-in-ladjs.html) of [two-factor authentication](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) using a [one-time password](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP), [Content Security Policy](https://en.wikipedia.org/wiki/Content_Security_Policy "Content Security Policy") (CSP), and [Subresource Integrity](https://en.wikipedia.org/wiki/Subresource_Integrity "Subresource Integrity") (SRI) into the [Lad](https://en.wikipedia.org/w/index.php?title=Lad_(web_application_framework)&action=edit&redlink=1 "Lad (web application framework) (page does not exist)") framework, which is [used internally](https://github.com/forwardemail/forwardemail.net/commit/b171c9e2e2774c747298d0ecca2d4213f0a9f0c0) in Forward Email.

* [Fedor Indutny](https://github.com/indutny) for [questions and answers](https://github.com/forwardemail/free-email-forwarding/commit/58ea4b8ce7016272e5301a5a3e6ccec940f237fb) regarding Forward Email's compliance with strict and modern [TLS](https://en.wikipedia.org/wiki/TLS "TLS") [cryptographic ciphers](https://en.wikipedia.org/wiki/Cipher "Cipher").

* [Andris Reisman](https://github.com/andris9) (the author of the [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") [npm](https://en.wikipedia.org/wiki/Npm_(software) "Npm (software)") package nodemailer, which is used internally in Forward Email.

* [Scott Kitterman](https://kitterman.com/) (the author of the [Sender Policy Framework](https://en.wikipedia.org/wiki/Sender_Policy_Framework "Sender Policy Framework") (SPF) [RFC 7208](https://tools.ietf.org/html/rfc7208) specification) for [questions](https://git.launchpad.net/dkimpy/commit/?id=3e16ceac23672bf336cd6c11a7c9ea1610e353cd) and [answers](https://git.launchpad.net/dkimpy/commit/?id=5b9dc1253d61999a111973a55a7ea79d2a55859b) regarding Forward Email's compliance with [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme "Sender Rewriting Scheme") (SRS), [DMARC](https://en.wikipedia.org/wiki/DMARC "DMARC"), [Sender Policy Framework](https://en.wikipedia.org/wiki/Sender_Policy_Framework "Sender Policy Framework") (SPF), and [DKIM](https://en.wikipedia.org/wiki/DKIM "DKIM") compliance over [IRC](https://en.wikipedia.org/wiki/Internet_Relay_Chat "Internet Relay Chat").

[arc]: https://en.wikipedia.org/wiki/Authenticated_Received_Chain
