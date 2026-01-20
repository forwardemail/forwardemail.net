# About Forward Email

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# About Forward Email


## Table of Contents

* [Overview](#overview)
* [Founder and Mission](#founder-and-mission)
* [Timeline](#timeline)
  * [2017 - Founding and Launch](#2017---founding-and-launch)
  * [2018 - Infrastructure and Integration](#2018---infrastructure-and-integration)
  * [2019 - Performance Revolution](#2019---performance-revolution)
  * [2020 - Privacy and Security Focus](#2020---privacy-and-security-focus)
  * [2021 - Platform Modernization](#2021---platform-modernization)
  * [2023 - Infrastructure and Feature Expansion](#2023---infrastructure-and-feature-expansion)
  * [2024 - Service Optimization and Advanced Features](#2024---service-optimization-and-advanced-features)
  * [2025 - Continued Innovation](#2025---continued-innovation)
* [Core Principles](#core-principles)
* [Current Status](#current-status)


## Overview

> \[!TIP]
> For technical details about our architecture, security implementations, and roadmap, see the [Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email is a [free and open-source](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [email forwarding](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") service focused on a user's [right to privacy](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy"). What began as a simple email forwarding solution in 2017 has evolved into a comprehensive email platform offering unlimited custom domain names, unlimited email addresses and aliases, unlimited disposable email addresses, spam and phishing protection, encrypted mailbox storage, and numerous advanced features.

The service is maintained and owned by its original founding team of designers and developers. It is built with 100% open-source software using [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS"), and [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").


## Founder and Mission

Forward Email was founded by **Nicholas Baugh** in 2017. According to the [Forward Email Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf), Baugh was initially searching for a cost-effective and simple solution for enabling email on domain names for his side-projects. After researching available options, he began coding his own solution and purchased the domain `forwardemail.net` on October 2, 2017.

Forward Email's mission extends beyond providing email services—it aims to transform how the industry approaches email privacy and security. The company's core values include transparency, user control, and privacy protection through technical implementation rather than just policy promises.


## Timeline

### 2017 - Founding and Launch

**October 2, 2017**: Nicholas Baugh purchased the domain `forwardemail.net` after researching cost-effective email solutions for his side-projects.

**November 5, 2017**: Baugh created a 634-line JavaScript file using [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") to forward emails for any custom domain name. This initial implementation was published as open-source to [GitHub](https://github.com/forwardemail) and the service was launched using GitHub Pages.

**November 2017**: Forward Email officially launched after an initial release. The early version was purely DNS-based with no account registration or sign-up process—simply a README file written in Markdown with instructions. Users could set up email forwarding by configuring MX records to point to `mx1.forwardemail.net` and `mx2.forwardemail.net`, and adding a TXT record with `forward-email=user@gmail.com`.

The simplicity and effectiveness of this solution attracted attention from prominent developers, including [David Heinemeier Hansson](https://dhh.dk) (creator of Ruby on Rails), who continues to use Forward Email on his domain `dhh.dk` to this day.

### 2018 - Infrastructure and Integration

**April 2018**: When [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") launched their [privacy-first consumer DNS service](https://blog.cloudflare.com/announcing-1111/), Forward Email switched from using [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") to [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") for handling [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System") lookups, demonstrating the company's commitment to privacy-focused infrastructure choices.

**October 2018**: Forward Email allowed users to "Send Mail As" with [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") and [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook"), expanding integration capabilities with popular email providers.

### 2019 - Performance Revolution

**May 2019**: Forward Email released v2, which represented a major rewrite from the initial versions. This update focused on [performance](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") improvements through the use of [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")'s [streams](https://en.wikipedia.org/wiki/Streams "Streams"), establishing the foundation for the platform's scalability.

### 2020 - Privacy and Security Focus

**February 2020**: Forward Email released the Enhanced Privacy Protection plan, allowing users to switch off setting public DNS record entries with their email forwarding configuration aliases. Through this plan, a user's email alias information is hidden from being publicly searchable over the Internet. The company also released a feature to enable or disable specific aliases while still allowing them to appear as valid email addresses and return successful [SMTP status codes](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes"), with emails being immediately discarded (similar to piping output to [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**April 2020**: After hitting countless roadblocks with existing spam-detection solutions that didn't honor Forward Email's privacy policy, the company released their initial alpha version of Spam Scanner. This completely free and open-source [anti-spam filtering](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") solution uses a [Naive Bayes spam filter](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") approach combined with [anti-phishing](https://en.wikipedia.org/wiki/Phishing "Phishing") and [IDN homograph attack](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack") protection. Forward Email also released [two-factor authentication](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) using [one-time passwords](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) for enhanced account security.

**May 2020**: Forward Email allowed custom [port forwarding](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") as a workaround for users to circumvent port blocking by their [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). The company also released their [Free Email Forwarding RESTful API](email-api) with complete documentation and real-time request and response examples, along with support for webhooks.

**August 2020**: Forward Email added support for the [Authenticated Received Chain](arc) ("ARC") email authentication system, further strengthening email security and deliverability.

**November 23, 2020**: Forward Email publicly launched out of their beta program, marking a significant milestone in the platform's development.

### 2021 - Platform Modernization

**February 2021**: Forward Email refactored their codebase to remove all [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)") dependencies, allowing their stack to become 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") and [Node.js](https://en.wikipedia.org/wiki/Node.js). This architectural decision aligned with the company's commitment to maintaining a consistent, open-source technology stack.

**September 27, 2021**: Forward Email [added support](email-forwarding-regex-pattern-filter) for email forwarding aliases to match [regular expressions](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), providing users with more sophisticated email routing capabilities.

### 2023 - Infrastructure and Feature Expansion

**January 2023**: Forward Email launched a re-designed and page-speed optimized website, improving user experience and performance.

**February 2023**: The company added support for [error logs](/faq#do-you-store-error-logs) and implemented a [dark mode](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) website color scheme, responding to user preferences and accessibility needs.

**March 2023**: Forward Email released [Tangerine](https://github.com/forwardemail/tangerine#readme) and integrated it throughout their infrastructure, enabling the use of [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") at the application layer. The company also added support for [MTA-STS](/faq#do-you-support-mta-sts) and switched from [hCaptcha](/) to [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile).

**April 2023**: Forward Email implemented and automated entirely new infrastructure. The entire service began running on globally load-balanced and proximity-based DNS with health checks and failover using [Cloudflare](https://cloudflare.com), replacing the previous round-robin DNS approach. The company switched to **bare metal servers** across multiple providers, including [Vultr](https://www.vultr.com/?ref=429848) and [Digital Ocean](https://m.do.co/c/a7cecd27e071), both SOC 2 Type 1 compliant providers. MongoDB and Redis databases were moved to clustered configurations with primary and standby nodes for high availability, end-to-end SSL encryption, encryption-at-rest, and point-in-time recovery (PITR).

**May 2023**: Forward Email launched their **outbound SMTP** feature for [sending email with SMTP](/faq#do-you-support-sending-email-with-smtp) and [sending email with API](/faq#do-you-support-sending-email-with-api) requests. This feature includes built-in safeguards to ensure high deliverability, a modern and robust queue and retry system, and [supports error logs in real-time](/faq#do-you-store-error-logs).

**November 2023**: Forward Email launched their [**encrypted mailbox storage**](/blog/docs/best-quantum-safe-encrypted-email-service) feature for [IMAP support](/faq#do-you-support-receiving-email-with-imap), representing a significant advancement in email privacy and security.

**December 2023**: The company [added support](/faq#do-you-support-pop3) for [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [passkeys and WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [time to inbox](/faq#i) monitoring, and [OpenPGP for IMAP Storage](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Service Optimization and Advanced Features

**February 2024**: Forward Email [added calendar (CalDAV) support](/faq#do-you-support-calendars-caldav), expanding the platform's capabilities beyond email to include calendar synchronization.

**March to July 2024**: Forward Email released major optimizations and improvements to their IMAP, POP3, and CalDAV services, with the goal of making their service as fast as, if not faster than, alternatives.

**July 2024**: The company [added iOS Push support](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) to address Apple Mail on iOS's lack of IMAP `IDLE` command support, enabling real-time notifications for Apple iOS devices. Forward Email also added time to inbox ("TTI") monitoring for their own service and Yahoo/AOL, and began allowing users to encrypt their entire DNS TXT record even on the free plan. As requested in [Privacy Guides discussions](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) and [GitHub issues](https://github.com/forwardemail/forwardemail.net/issues/254), the company added the ability for aliases to either quietly reject `250`, soft reject `421`, or hard reject `550` when disabled.

**August 2024**: Forward Email added support for exporting mailboxes as [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) and [Mbox](https://en.wikipedia.org/wiki/Mbox) formats (in addition to the existing [SQLite](https://en.wikipedia.org/wiki/SQLite) export format). [Webhook signature support was added](https://forwardemail.net/faq#do-you-support-bounce-webhooks), and the company began allowing users to send newsletters, announcements, and email marketing through their outbound SMTP service. Domain-wide and alias-specific storage quotas for IMAP/POP3/CalDAV were also implemented.

### 2025 - Continued Innovation

**September 2024 to January 2025**: Forward Email [added a highly-requested vacation responder feature and OpenPGP/WKD encryption for email forwarding](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), building upon their already implemented encrypted mailbox storage capabilities.

**January 21, 2025**: The founder's best friend "Jack", his loyal canine companion, peacefully passed away at the age of nearly 11. Jack [will always be remembered](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) for his unwavering companionship that supported the creation of Forward Email. The [Forward Email Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf) is dedicated to Jack, acknowledging his role in the service's development.

**February 2025**: Forward Email switched to [DataPacket](https://www.datapacket.com) as their new primary data center provider, implementing custom, performance-focused, bare-metal hardware to further enhance service reliability and speed.

**June 2025**: Forward Email launched support for the [CardDAV protocol](/faq#do-you-support-contacts-carddav), expanding the platform's capabilities to include contact synchronization alongside existing email and calendar services.


## Core Principles

Since its inception, Forward Email has maintained a steadfast commitment to privacy and security principles:

**100% Open-Source Philosophy**: Unlike competitors who only open-source their frontends while keeping backends closed, Forward Email has made its entire codebase—both frontend and backend—available for public scrutiny on [GitHub](https://github.com/forwardemail).

**Privacy-First Design**: From day one, Forward Email implemented a unique in-memory processing approach that avoids writing emails to disk, setting it apart from conventional email services that store messages in databases or file systems.

**Continuous Innovation**: The service has evolved from a simple email forwarding solution to a comprehensive email platform with features like encrypted mailboxes, quantum-resistant encryption, and support for standard protocols including SMTP, IMAP, POP3, and CalDAV.

**Transparency**: Making all code open-source and available for inspection, ensuring users can verify privacy claims rather than simply trusting marketing statements.

**User Control**: Empowering users with options, including the ability to self-host the entire platform if desired.


## Current Status

As of 2025, Forward Email serves over 500,000 domains worldwide, including notable organizations and industry leaders such as:

* **Technology Companies**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Media Organizations**: Fox News Radio, Disney Ad Sales
* **Educational Institutions**: The University of Cambridge, The University of Maryland, The University of Washington, Tufts University, Swarthmore College
* **Government Entities**: Government of South Australia, Government of Dominican Republic
* **Other Organizations**: RCD Hotels, Fly<span>.</span>io
* **Notable Developers**: Isaac Z. Schlueter (npm creator), David Heinemeier Hansson (Ruby on Rails creator)

The platform continues to evolve with regular feature releases and infrastructure improvements, maintaining its position as the only 100% open-source, encrypted, privacy-focused, transparent, and quantum-resistant email service available today.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
