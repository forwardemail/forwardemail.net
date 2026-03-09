/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// turn off max length eslint rule since this is a config file with long strs
/* eslint max-len: 0 */

// meta tags is an object of paths
// where each path is an array containing
//
// '/some/path': [ title, description ]
//
// note that you can include <span class="notranslate">
// if needed around certain text values in ordre to
// prevent Google Translate from translating them
// note that the helper named `meta` in `helpers/meta.js`
// will automatically remove HTML tags from the strings
// before returning them to be rendered in tags such as
// `<title>` and `<meta name="description">`
//
// const arrayJoinConjunction = require('array-join-conjunction');
const dashify = require('dashify');
const dayjs = require('dayjs-with-plugins');

const alternatives = require('./alternatives');
const {
  developerDocs,
  nsProviders,
  platforms,
  getServersOrClientsList,
  useCases
} = require('#config/utilities');

module.exports = function (config, isSitemap = false) {
  // in order for snapshots to be consistent we need the same date to be used
  const now =
    config.env === 'test'
      ? dayjs.tz('2024-01-01', 'America/Los_Angeles').toDate()
      : new Date();

  // currently we cannot use the `|` pipe character due to this issue
  // <https://github.com/mashpie/i18n-node/issues/274>
  // otherwise we'd have `| Lad` below, which is SEO standard
  // so instead we need to use `&#124;` which is the html entity
  // which gets decoded to a `|` in the helper.meta function
  const currentYear = dayjs(now).format('YYYY');
  const meta = {
    // note that we don't do `Home ${lad}` because if we forget to define
    // meta for a specific route it'd be confusing to see Home
    // in the title bar in the user's browser
    '/': [
      `Free Email Forwarding for Custom Domains - #1 Open Source Email Service ${currentYear}`,
      `Get free email forwarding for custom domains. Send & receive as you@yourdomain.com with unlimited aliases, 10GB storage, IMAP/POP3/SMTP & 100% open-source security. Trusted by 500K+ users. Setup in 2 minutes.`
    ],
    '/about': [
      `About Forward Email - Our Story & Mission`,
      `Learn about Forward Email's journey from open-source project to the most trusted privacy-focused email service. Discover our commitment to transparency, security, and user privacy.`,
      'img/articles/about.webp'
    ],
    '/press': [
      `Press & Media Kit - Forward Email Brand Assets & Resources`,
      `Download Forward Email logos, brand guidelines, screenshots, and media assets. Press inquiries welcome. Get official graphics and branding for articles and publications.`,
      'img/articles/press.webp'
    ],
    '/private-business-email': [
      `Private Business Email - Encrypted & Secure`,
      `Create private, encrypted business email for your custom domain. End-to-end encryption, zero-knowledge architecture, GDPR compliant. Professional email addresses like <span class="notranslate font-weight-bold text-nowrap">you@yourdomain.com</span> with enterprise security.`
    ],
    '/tti': [
      `Email Deliverability & Time to Inbox Monitoring`,
      `Real-time email deliverability monitoring and time-to-inbox metrics. Compare Forward Email's delivery speed vs Gmail, Outlook, Yahoo, and iCloud. Transparent performance data updated every minute.`,
      'img/articles/tti.webp'
    ],
    '/faq': [
      `Email Forwarding FAQ - Complete Setup Guide & Troubleshooting ${currentYear}`,
      `Answers to all your email forwarding questions. DNS configuration, SMTP setup, custom domains, troubleshooting, and advanced features. Step-by-step guides with video tutorials.`,
      'img/articles/faq.webp'
    ],
    '/encrypt': [
      `Encrypt DNS TXT Records - Protect Email Forwarding Addresses`,
      `Encrypt your email forwarding TXT records to prevent public DNS lookups from exposing your email addresses. Free encryption tool for enhanced privacy protection.`
    ],
    '/email-api': [
      `Email API for Developers - RESTful API with Webhooks & SMTP ${currentYear}`,
      `Powerful RESTful email API for developers. Send transactional emails, manage domains, create aliases programmatically. Comprehensive documentation, SDKs, and code examples.`,
      'img/articles/email-api.webp'
    ],
    '/free-email-webhooks': [
      `Free Email Webhooks - HTTP Callbacks for Incoming Email ${currentYear}`,
      `Receive email via HTTP webhooks. Forward incoming emails to your API endpoint as JSON. Perfect for helpdesks, CRMs, and automation. No server required.`
    ],
    '/email-forwarding-regex-pattern-filter': [
      `Email Regex Filtering - Advanced Pattern Matching for Custom Domains`,
      `Filter and route emails using regular expressions. Create complex forwarding rules with regex patterns. Support for wildcards, catch-all, and conditional routing.`
    ],
    '/terms': [
      `Terms of Service - Forward Email User Agreement`,
      `Read Forward Email's terms of service, acceptable use policy, and user agreement. Transparent policies for our privacy-focused email forwarding service.`,
      'img/articles/terms.webp'
    ],
    '/gdpr': [
      `GDPR Compliance - EU Data Protection & Privacy Standards`,
      `Forward Email is fully GDPR compliant. Learn about our data protection practices, user rights, data processing, EU privacy law compliance, and how we safeguard your information.`,
      'img/articles/gdpr.webp'
    ],
    '/security': [
      `Security Practices - How We Protect Your Email ${currentYear}`,
      `Comprehensive security measures protecting your email. TLS encryption, SPF/DKIM/DMARC authentication, zero-knowledge architecture, regular security audits, and bug bounty program.`
    ],
    '/dpa': [
      `Data Processing Agreement (DPA) - GDPR Compliance Documentation`,
      `Download Forward Email's Data Processing Agreement for GDPR compliance. Standard contractual clauses, data protection terms, and processor obligations.`,
      'img/articles/dpa.webp'
    ],
    '/report-abuse': [
      `Report Abuse - Spam, Phishing & Security Incident Reporting`,
      `Report spam, phishing, abuse, or security incidents. Information for the public and law enforcement. We respond to all reports within 24 hours.`,
      'img/articles/report-abuse.webp'
    ],
    '/privacy': [
      `Privacy Policy - How We Protect Your Data & Email`,
      `Read Forward Email's privacy policy. We collect minimal data, never sell your information, and provide complete transparency about data handling practices and user rights.`,
      'img/articles/privacy.webp'
    ],
    '/help': [
      `Help & Support - Get Answers Fast ${currentYear}`,
      `Get help with Forward Email. Search our knowledge base, contact support, or join our community. Average response time under 4 hours. Find answers to all your email questions.`,
      'img/articles/help.webp'
    ],
    '/denylist': [
      `Denylist Removal - Unblock Your Email, Domain, or IP Address`,
      `Request removal from Forward Email's denylist. Submit your email address, domain, or IP for review. Most requests processed within 24 hours.`
    ],
    '/logout': [
      `Sign Out - Forward Email`,
      `Securely sign out of your Forward Email account. Your session will be terminated on all devices for maximum security. Return anytime to manage your email forwarding.`
    ],
    '/register': [
      `Create Free Account - Start Email Forwarding in 2 Minutes`,
      `Sign up for free email forwarding. No credit card required. Get unlimited aliases, custom domain support, and 10GB storage. Setup takes just 2 minutes.`
    ],
    '/disposable-addresses': [
      `Disposable Email Addresses - Temporary Aliases for Custom Domains`,
      `Create disposable email addresses with your custom domain. Generate unlimited temporary aliases for signups, trials, and spam protection. Auto-expire or keep forever.`
    ],
    '/self-hosted': [
      `Self-Hosted Email Server - Complete Open Source Setup Guide`,
      `Deploy your own email server with Forward Email's open-source code. Docker, Kubernetes, and bare-metal installation guides. Full control over your email infrastructure.`
    ],
    '/resources': [
      `Free Email Tools & Resources for Developers ${currentYear}`,
      `Curated collection of free email tools, APIs, libraries, and resources for developers and startups. DNS tools, SMTP testers, deliverability checkers, and more.`
    ],
    '/blog/docs': [
      `Email Developer Documentation & API Reference ${currentYear}`,
      `Complete developer documentation for Forward Email. RESTful API reference, code examples, SDKs, webhooks, and integration guides for all major languages.`
    ],
    '/guides': [
      `Email Setup Guides & Tutorials - Step-by-Step Instructions ${currentYear}`,
      `Comprehensive email setup guides for all major DNS providers and registrars. Video tutorials, screenshots, and troubleshooting tips. Setup email forwarding in minutes.`
    ],
    '/guides/send-email-with-custom-domain-smtp': [
      `How to Setup Custom Domain Email with SMTP - Complete Guide ${currentYear}`,
      `Step-by-step guide to setup email with your custom domain. Configure DNS, SMTP, IMAP, and POP3. Works with Gmail, Outlook, Apple Mail, and all email clients.`
    ],
    '/guides/newsletter-with-listmonk': [
      `Listmonk Newsletter Setup with Forward Email SMTP ${currentYear}`,
      `Create and manage newsletters using Listmonk with Forward Email as your SMTP provider. Self-hosted newsletter solution with reliable email delivery and high deliverability.`
    ],
    '/guides/selfhosted-on-debian': [
      `Self-Hosted Forward Email on Debian - Installation Guide ${currentYear}`,
      `Complete guide to self-hosting Forward Email on Debian Linux. Docker and bare-metal installation, configuration, and maintenance instructions. Full control over your email.`
    ],
    '/guides/selfhosted-on-ubuntu': [
      `Self-Hosted Forward Email on Ubuntu - Installation Guide ${currentYear}`,
      `Complete guide to self-hosting Forward Email on Ubuntu Linux. Docker and bare-metal installation, configuration, and maintenance instructions. Full control over your email.`
    ],
    '/guides/send-mail-as-gmail-custom-domain': [
      `Gmail Send Mail As - Use Custom Domain with Gmail ${currentYear}`,
      `Setup Gmail to send and receive email from your custom domain. Step-by-step guide with video tutorial. Fix "Send Mail As" not working issues. Works with all Gmail accounts.`
    ],
    '/guides/smtp-integration': [
      `SMTP Integration Examples - Code Samples for All Languages`,
      `SMTP integration examples for Node.js, Python, PHP, Ruby, Go, Java, and more. Copy-paste code samples for reliable email sending with Forward Email. Production-ready code.`
    ],
    '/guides/port-25-blocked-by-isp-workaround': [
      `Port 25 Blocked by ISP - Workaround Solutions ${currentYear}`,
      `Fix ISP blocking port 25 for email. Alternative SMTP ports, relay solutions, and workarounds for residential and business internet connections. Send email from home.`
    ],
    '/guides/printer-camera-fax-scanner-email-smtp-setup-guide-tls-compatibility':
      [
        `Printer & Scanner Email Setup - SMTP Configuration Guide ${currentYear}`,
        `Fix scan-to-email on HP, Canon, Brother, Epson printers. Complete SMTP setup for IP cameras, fax machines, and scanners with TLS support. Works with all devices.`
      ],
    '/guides/nas-email-notifications-smtp-setup-guide-synology-qnap-truenas': [
      `NAS Email Notifications - SMTP Setup for Synology, QNAP, TrueNAS ${currentYear}`,
      `Configure email notifications on your NAS device. Complete SMTP setup guide for Synology DSM, QNAP QTS, TrueNAS, ReadyNAS, and more. Get alerts for all NAS events.`
    ],
    '/guides/raspberry-pi-ftp-server-email-relay-security-camera': [
      `Raspberry Pi Email Relay for Security Cameras - FTP Server Setup`,
      `Build a Raspberry Pi FTP server with email relay for security cameras. Receive motion alerts via email. Works with all IP cameras and Pi models. Complete DIY guide.`
    ],
    '/domain-registration': [
      `Register Domain for Email - Find Your Perfect Domain Name`,
      `Search and register domain names for email. Instant DNS setup for email forwarding. Free WHOIS privacy and SSL certificates included. Start your custom domain email today.`
    ],
    '/reserved-email-addresses': [
      `Reserved Email Addresses - 1250+ Blocked Addresses for Security`,
      `Complete list of reserved email addresses blocked for security. Protect your domain from abuse, phishing, and impersonation attacks. Essential for domain administrators.`
    ],
    '/my-account': [
      `My Account - Manage Domains & Email Forwarding`,
      `Manage your Forward Email account, domains, aliases, and settings. View analytics, update billing, configure security options, and control all your email forwarding.`
    ],
    '/my-account/analytics': [
      `Email Analytics - Track Forwarding & Delivery Stats`,
      `View your email forwarding analytics. Track delivery rates, bounce rates, and usage statistics for all your domains and aliases. Monitor performance in real-time.`
    ],
    '/my-account/domains': [
      `Manage Domains - Add, Configure & Verify Custom Domains`,
      `Manage your custom domains for email forwarding. Add new domains, configure DNS, verify settings, manage aliases, and control all your email routing in one place.`
    ],
    '/my-account/emails': [
      `Manage Emails - View & Search Your Email History`,
      `View and search your email history. Track sent and received messages, check delivery status, manage your mailbox, and access your complete email archive securely.`
    ],
    '/my-account/logs': [
      `Email Logs - Detailed Delivery & Error Tracking`,
      `View detailed email logs for troubleshooting. Track delivery attempts, errors, bounces, and spam filtering decisions. Debug email issues with comprehensive logs.`
    ],
    '/my-account/profile': [
      `Profile Settings - Update Account Information`,
      `Update your Forward Email profile. Change email, password, notification preferences, and account settings. Customize your experience and manage your personal information.`
    ],
    '/my-account/billing': [
      `Billing & Subscription - Manage Your Plan`,
      `Manage your Forward Email subscription. View invoices, update payment methods, change your plan, and access your complete billing history. Flexible payment options available.`
    ],
    '/my-account/security': [
      `Security Settings - Two-Factor Authentication & API Keys`,
      `Manage your account security. Enable two-factor authentication, manage API keys, review login history, and protect your email with advanced security features.`,
      'img/articles/security.webp'
    ],
    '/admin': [
      `Admin Dashboard - Forward Email`,
      `Access your Forward Email admin dashboard for advanced management and configuration. Monitor system health, manage users, and control all administrative settings.`
    ],
    '/forgot-password': [
      `Reset Password - Recover Your Forward Email Account`,
      `Reset your Forward Email password. Enter your email to receive a secure password reset link. Regain access to your account quickly and safely with our recovery process.`
    ],
    '/ips': [
      `IP Addresses - Forward Email Server Infrastructure`,
      `Complete list of Forward Email IP addresses for SPF records and firewall whitelisting. Automatically updated and always current. Essential for DNS configuration.`
    ],
    '/reset-password': [
      `Confirm Password Reset - Forward Email`,
      `Confirm your password reset and create a new secure password for your Forward Email account. Choose a strong password to keep your email forwarding secure.`
    ],
    '/auth': [
      `Authenticate - Forward Email Login`,
      `Complete authentication to access your Forward Email account. Secure login process with multiple authentication options including passkeys, OAuth, and two-factor verification.`
    ],
    '/ubuntu': [
      `Ubuntu @ubuntu.com Email - Official Ubuntu Member Email`,
      `Manage email forwarding and SMTP for your @ubuntu.com email address. Log in with your Ubuntu One account. Exclusive email service for official Ubuntu community members.`
    ],
    '/kubuntu': [
      `Kubuntu @kubuntu.org Email - Official Kubuntu Member Email`,
      `Manage email forwarding and SMTP for your @kubuntu.org email address. Log in with your Ubuntu One account. Exclusive email service for official Kubuntu community members.`
    ],
    '/lubuntu': [
      `Lubuntu @lubuntu.me Email - Official Lubuntu Member Email`,
      `Manage email forwarding and SMTP for your @lubuntu.me email address. Log in with your Ubuntu One account. Exclusive email service for official Lubuntu community members.`
    ],
    '/edubuntu': [
      `Edubuntu @edubuntu.org Email - Official Edubuntu Member Email`,
      `Manage email forwarding and SMTP for your @edubuntu.org email address. Log in with your Ubuntu One account. Exclusive email service for official Edubuntu community members.`
    ],
    '/ubuntu-studio': [
      `Ubuntu Studio @ubuntustudio.com Email - Official Member Email`,
      `Manage email forwarding and SMTP for your @ubuntustudio.com email address. Log in with your Ubuntu One account. Exclusive email for Ubuntu Studio community members.`
    ]
  };

  // guides for each provider (39 total at time of this writing)
  for (const [x, provider] of nsProviders.entries()) {
    const name = `<span class="notranslate">${provider.name}</span>`;
    const year = `<span class="notranslate">${currentYear}</span>`;

    // Rotate through SEO-optimized title patterns (kept under 60 chars)
    const titlePatterns = [
      `${name} Email Setup Guide ${year}`,
      `Setup Email with ${name} ${year}`,
      `${name} Email Forwarding Tutorial ${year}`,
      `Free Email for ${name} Domains ${year}`,
      `${name} DNS Email Setup ${year}`,
      `Custom Domain Email - ${name} ${year}`,
      `${name} Email Guide ${year}`,
      `Email Forwarding - ${name} ${year}`,
      `${name} Domain Email Setup ${year}`,
      `Free Email with ${name} ${year}`,
      `${name} Email DNS Tutorial ${year}`,
      `${name} Email Forwarding ${year}`,
      `${name} Email Made Easy ${year}`
    ];

    const descPatterns = [
      `Complete guide to setup free email forwarding with ${provider.name}. Step-by-step DNS configuration, video tutorial, and troubleshooting tips. Works with Gmail, Outlook, and all email clients.`,
      `Setup custom domain email with ${provider.name} in minutes. Free email forwarding, SMTP, IMAP, and POP3 configuration. Includes video walkthrough and DNS verification tool.`,
      `Learn how to configure email for your ${provider.name} domain. Free email hosting with unlimited aliases. Complete DNS setup guide with screenshots and video.`,
      `Free email forwarding setup guide for ${provider.name}. Configure MX, TXT, and SPF records. Send and receive email from your custom domain in minutes.`,
      `Step-by-step ${provider.name} email setup tutorial. Free custom domain email with SMTP access. Works with Gmail Send Mail As feature.`
    ];

    const titleIndex = x % titlePatterns.length;
    const descIndex = x % descPatterns.length;

    meta[`/guides/${provider.slug}`] = [
      titlePatterns[titleIndex],
      descPatterns[descIndex]
    ];
  }

  if (platforms.length > 0) {
    meta['/blog/open-source'] = [
      `${platforms.length} Best Open Source Email Clients & Servers ${currentYear}`,
      `Comprehensive reviews of the best open-source email clients and servers. Side-by-side comparisons, screenshots, features, and setup guides for Linux, Windows, macOS, Android, and iOS.`
    ];
  }

  for (const [i, platform] of platforms.entries()) {
    // Rotate through power words for variety
    const powerWords = [
      'Best',
      'Top',
      'Top-Rated',
      'Most Popular',
      'Highest-Rated',
      'Leading',
      'Outstanding',
      'Excellent',
      'Notable',
      'Amazing',
      'Greatest',
      'Favorited',
      'Important',
      'Mighty'
    ];
    const sample = powerWords[i % powerWords.length];

    // email server
    const serverCount = getServersOrClientsList(platform, false).length;
    meta[`/blog/open-source/${dashify(platform)}-email-server`] = [
      `${serverCount} ${sample} Open Source Email Servers for <span class="notranslate">${platform}</span> ${currentYear}`,
      `Compare the ${serverCount} ${sample.toLowerCase()} open-source email servers for ${platform}. Features, performance, security, and step-by-step setup guides with screenshots.`
    ];

    // email client
    const clientCount = getServersOrClientsList(platform, true).length;
    meta[`/blog/open-source/${dashify(platform)}-email-clients`] = [
      `${clientCount} ${sample} Open Source Email Clients for <span class="notranslate">${platform}</span> ${currentYear}`,
      `Reviews and comparison of the ${clientCount} ${sample.toLowerCase()} open-source email clients for ${platform}. Screenshots, features, pros/cons, and installation guides.`
    ];
  }

  meta[`/blog/best-email-service`] = [
    `${alternatives.length} Best Email Services Compared - Honest Reviews ${currentYear}`,
    `In-depth comparison of ${alternatives.length} email services. Pricing, features, privacy, security, and performance. Find the perfect email provider for your needs.`
  ];

  meta[`/blog/best-private-email-service`] = [
    `${
      alternatives.filter((a) => a.e2ee || a.openpgp || a.wkd).length
    } Best Private Email Services - End-to-End Encrypted ${currentYear}`,
    `Compare the most private and secure email services with end-to-end encryption. Features, pricing, and privacy analysis. Protect your communications.`
  ];

  meta[`/blog/best-open-source-email-service`] = [
    `${
      alternatives.filter((a) => a.oss).length
    } Best Open-Source Email Services - Transparent & Auditable ${currentYear}`,
    `Reviews of open-source email services you can trust. Full source code transparency, security audits, and community-driven development.`
  ];

  meta[`/blog/best-transactional-email-service`] = [
    `${
      alternatives.filter((a) => a.api).length
    } Best Transactional Email Services for Developers ${currentYear}`,
    `Compare transactional email APIs for developers. Deliverability, pricing, features, and integration guides. Send password resets, receipts, and notifications.`
  ];

  meta[`/blog/best-email-api-developer-service`] = [
    `${
      alternatives.filter((a) => a.api).length
    } Best Email APIs for Developers - Complete Comparison ${currentYear}`,
    `In-depth comparison of email APIs for developers. RESTful APIs, SDKs, webhooks, and code examples. Find the best email API for your application.`
  ];

  meta['/blog/best-email-spam-filtering-service'] = [
    `${
      alternatives.filter((a) => a.api).length
    } Best Email Spam Filtering Services - Stop Spam ${currentYear}`,
    `Compare spam filtering services to protect your inbox. Machine learning detection, false positive rates, and integration options. Block spam without losing legitimate email.`
  ];

  // developer docs (titles kept under 60 chars for SEO)
  for (const doc of developerDocs) {
    // Use shortTitle if available, otherwise truncate title
    const displayTitle = doc.shortTitle || doc.title;
    if (doc.notCodeExample) {
      meta[doc.slug] = [
        doc.noYearAffix
          ? displayTitle
          : `${displayTitle} - Guide ${currentYear}`,
        doc.description
      ];
    } else {
      meta[doc.slug] = [
        doc.noYearAffix
          ? displayTitle
          : `${displayTitle} - Tutorial ${currentYear}`,
        doc.description
      ];
    }
  }

  meta[config.loginRoute] = [
    `Log In to Forward Email - Access Your Account`,
    `Sign in to your Forward Email account. Manage domains, aliases, and email forwarding settings. Secure login with passkeys, OAuth, and two-factor authentication.`
  ];
  meta[config.verifyRoute] = [
    `Verify Email Address - Confirm Your Forward Email Account`,
    `Verify your email address to activate your Forward Email account and start using email forwarding. Complete verification to unlock all features and start forwarding.`
  ];
  meta[config.otpRoutePrefix] = [
    `Two-Factor Authentication - Secure Login Verification`,
    `Enter your two-factor authentication code to complete login. Protect your account with 2FA security. Supports authenticator apps, SMS, and hardware security keys.`
  ];

  if (isSitemap) {
    const titleSlugs = [
      'Free Email Forwarding',
      'Free Email Provider',
      'Free Email Hosting',
      'Free Email Service',
      'Free Email Newsletters',
      'Free Email API',
      'Free Email Masking',
      'Free Email Marketing',
      'Free Bulk Email Service',
      'Free Mass Email Service'
    ].map((s) => dashify(s.replace('Free', '').trim()));
    for (const key of Object.keys(useCases)) {
      if (titleSlugs.some((s) => key.endsWith(s))) continue;
      meta[key] = useCases[key];
    }
  } else {
    Object.assign(meta, useCases);
  }

  return meta;
};
