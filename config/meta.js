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
  const lad = config.metaTitleAffix;
  const meta = {
    // note that we don't do `Home ${lad}` because if we forget to define
    // meta for a specific route it'd be confusing to see Home
    // in the title bar in the user's browser
    '/': [
      'Free Email Forwarding for Custom Domains',
      'Get free email forwarding for your custom domain. Send & receive as you@yourdomain.com with unlimited aliases, 10GB storage & 100% open-source security.'
      // TODO: 'img/articles/faq.webp'
    ],
    '/about': [
      'History of Forward Email',
      `Learn more about ${config.appName} and the history of our service.`,
      'img/articles/about.webp'
    ],
    '/press': [
      'Press & Media Kit',
      'Learn more about Forward Email for journalists and the press, and download Forward Email graphics, branding, and media kit.',
      'img/articles/press.webp'
    ],
    '/private-business-email': [
      'Private Business Email for Custom Domains',
      'Create your free, private, encrypted, and secure email for professional businesses, enterprises, and custom domains. Send and receive email as <span class="notranslate font-weight-bold text-nowrap">you@yourdomain.com</span>.'
    ],
    '/tti': [
      'Time to Inbox Monitoring & Deliverability',
      'Time to inbox ("TTI") is the duration it takes from when an email is sent until it is delivered to the user\'s mailbox.  We publicly measure and compare our deliverability and timings for both email forwarding and direct outbound SMTP across all major email providers (including Gmail, Outlook/Hotmail, Apple iCloud, and Yahoo/AOL).',
      'img/articles/tti.webp'
    ],
    '/faq': [
      'Frequently Asked Questions',
      'How to configure email for custom domain names, outbound SMTP service, and more.',
      'img/articles/faq.webp'
    ],
    '/encrypt': [
      'Encrypt Plaintext TXT Record',
      'Encrypt your plaintext TXT record from being publicly searchable in DNS records.'
    ],
    '/email-api': [
      'Developer Email API for Custom Domains and Webhooks',
      'Developers love our RESTful email forwarding API for custom domains.',
      'img/articles/email-api.webp'
    ],
    '/free-email-webhooks': [
      'Free Email Webhooks for Developers and Custom Domains',
      'Send email with HTTP using our developer webhooks and DNS email forwarding service.'
    ],
    '/email-forwarding-regex-pattern-filter': [
      'Email Forwarding Regular Expression for Custom Domains',
      'Send email with regular expression matching and DNS email forwarding service.'
    ],
    '/terms': [
      'Terms of Service',
      'Read our terms and conditions of use for our email forwarding service.',
      'img/articles/terms.webp'
    ],
    '/gdpr': [
      'GDPR Compliance',
      'Read how our service is GDPR compliant.',
      'img/articles/gdpr.webp'
    ],
    '/security': [
      'Security Practices',
      "We've implemented comprehensive security measures to protect your email communications and personal data."
    ],
    '/dpa': [
      'Data Processing Agreement',
      'Read our data processing agreement, terms of service, and how our service is GDPR compliant.',
      'img/articles/dpa.webp'
    ],
    '/report-abuse': [
      'Report Abuse',
      'Information on how to report abuse for the general public and law enforcement.',
      'img/articles/report-abuse.webp'
    ],
    '/privacy': [
      'Privacy Policy',
      'Read our privacy policy for our email forwarding service.',
      'img/articles/privacy.webp'
    ],
    '/help': [
      'Help',
      'Ask a question and get support from our team.',
      'img/articles/help.webp'
    ],
    '/denylist': [
      'Denylist Removal',
      'Submit your email, domain, or IP address for DNS denylist removal.'
    ],
    '/logout': [`Sign out of ${lad}`, 'Sign out of your account now.'],
    '/register': [
      `Sign up ${lad}`,
      'Get a free account for custom domain email forwarding service.'
    ],
    '/disposable-addresses': [
      'Disposable Email Addresses for Custom Domains',
      'Get disposable email forwarding addresses using your custom domain name.'
    ],
    '/self-hosted': [
      'Self Hosted',
      'Check out our complete self hosted setup.'
    ],
    '/resources': [
      `Free Startup and Developer Email Tools List in <span class="notranslate">${dayjs(
        now
      ).format('YYYY')}</span>`,
      'Get free startup and developer email tools, bundles, resources, guides, tutorials, code samples, and more.'
    ],
    '/blog/docs': [
      `Free Email Developer Tools and Resources in <span class="notranslate">${dayjs(
        now
      ).format('YYYY')}</span>`,
      'Free email developer tools and resources for startups and businesses. See our complete RESTful email API reference and manage your custom domains and aliases.'
    ],
    // TODO: put a number in here
    '/guides': [
      `Top Email Hosting and Email Forwarding Setup Tutorials in <span class="notranslate">${dayjs(
        now
      ).format('YYYY')}</span>`,
      'Follow our free email forwarding and hosting guides to send and receive mail with your custom domain. We publish an email hosting guide list of the most popular website and DNS providers.'
    ],
    '/guides/send-email-with-custom-domain-smtp': [
      `How to Setup Email for Custom Domain Name in <span class="notranslate">${dayjs(
        now
      ).format('YYYY')}</span>`,
      'Set up free email forwarding and email hosting with your custom domain, DNS, SMTP, IMAP, and POP3 configuration setup guide.'
    ],
    '/guides/newsletter-with-listmonk': [
      `Create and Manage Newsletters with Listmonk in <span class="notranslate">${dayjs(
        now
      ).format('YYYY')}</span>`,
      'setting up a newsletter and mailing list system using Listmonk for campaign management and Forward Email as the SMTP provider for secure and reliable email delivery.'
    ],
    '/guides/selfhosted-on-debian': [
      `Setup Self-hosted Forward Email on Debian in <span class="notranslate">${dayjs(
        now
      ).format('YYYY')}</span>`,
      'Setting up self-hosted forward email on Debian OS.'
    ],
    '/guides/selfhosted-on-ubuntu': [
      `Setup Self-hosted Forward Email on Ubuntu in <span class="notranslate">${dayjs(
        now
      ).format('YYYY')}</span>`,
      'Setting up self-hosted forward email on Ubuntu OS.'
    ],
    '/guides/send-mail-as-gmail-custom-domain': [
      `How to Send Mail As for Gmail Alias <span class="notranslate">${dayjs(
        now
      ).format('YYYY')}</span>`,
      'Set up email forwarding for free with custom domain and Gmail to forward, send, and receive email. Send mail as not working? Follow our video and instructions.'
    ],
    '/guides/smtp-integration': [
      'SMTP Integration Examples',
      "Integrate with Forward Email's SMTP service using various programming languages, frameworks, and email clients. Our SMTP service is designed to be reliable, secure, and easy to integrate with your existing applications."
    ],

    '/guides/port-25-blocked-by-isp-workaround': [
      'Port 25 blocked by ISP',
      'Workaround port blocking set by your Internet Service Provider on port 25.'
    ],
    '/guides/printer-camera-fax-scanner-email-smtp-setup-guide-tls-compatibility':
      [
        'Printer & Camera Email Setup: Fix SMTP & TLS Issues 2025',
        'Fix printer scan-to-email, IP camera alerts & fax notifications. Complete SMTP setup guide for HP, Canon, Brother, Foscam & legacy TLS 1.0 devices.'
      ],
    '/guides/nas-email-notifications-smtp-setup-guide-synology-qnap-truenas': [
      'NAS Email Setup Guide: SMTP Configuration for All Devices 2025',
      'Complete NAS email notification setup guide for Synology, QNAP, TrueNAS, ReadyNAS & more. Fix TLS compatibility issues with Forward Email SMTP server.'
    ],
    '/guides/raspberry-pi-ftp-server-email-relay-security-camera': [
      'Raspberry Pi FTP Server with Email Relay for Security Cameras',
      'Setup a Raspberry Pi FTP server with automated email relay for security cameras & IoT devices. Supports legacy TLS 1.0. Works with all Pi models.'
    ],
    '/domain-registration': [
      'Register Custom Domain for Email',
      'Buy a custom domain name for email forwarding.'
    ],
    '/reserved-email-addresses': [
      'Reserved Email Addresses For Administrators',
      'List of 1250+ email addresses reserved for security concerns.'
    ],
    '/my-account': [
      'My Account',
      `Manage your ${config.appName} account, domains, and email forwarding aliases.`
    ],
    '/my-account/analytics': [
      'My Analytics',
      `View your ${config.appName} analytics.`
    ],
    '/my-account/domains': [
      'My Domains',
      `Manage your ${config.appName} domains.`
    ],
    '/my-account/emails': [
      'My Emails',
      `Manage your ${config.appName} emails.`
    ],
    '/my-account/logs': ['My Logs', `Manage your ${config.appName} logs.`],
    '/my-account/profile': [
      'My Profile',
      `Manage your ${config.appName} profile.`
    ],
    '/my-account/billing': [
      'My Billing',
      `Manage your ${config.appName} billing.`
    ],
    '/my-account/security': [
      'My Security',
      `Manage your ${config.appName} security.`,
      'img/articles/security.webp'
    ],
    '/admin': [`Admin ${lad}`, `Access your ${config.appName} admin.`],
    '/forgot-password': [
      'Forgot Password',
      'Reset your account password to regain access to your account.'
    ],
    '/ips': [
      'IP Addresses',
      'We publish and automatically update the IP addresses used by our server infrastructure.'
    ],
    '/reset-password': ['Reset Password', 'Confirm your password reset token.'],
    '/auth': [`Auth ${lad}`, 'Authenticate yourself to log in.'],
    '/ubuntu': [
      'Ubuntu @ubuntu.com email',
      'Log in with your Ubuntu One account to manage email forwarding and SMTP for your @ubuntu.com email address.'
    ],
    '/kubuntu': [
      'Kubuntu @kubuntu.org email',
      'Log in with your Ubuntu One account to manage email forwarding and SMTP for your @kubuntu.org email address.'
    ],
    '/lubuntu': [
      'Lubuntu @lubuntu.me email',
      'Log in with your Ubuntu One account to manage email forwarding and SMTP for your @lubuntu.me email address.'
    ],
    '/edubuntu': [
      'Edubuntu @edubuntu.org email',
      'Log in with your Ubuntu One account to manage email forwarding and SMTP for your @edubuntu.org email address.'
    ],
    '/ubuntu-studio': [
      'Ubuntu Studio @ubuntustudio.com email',
      'Log in with your Ubuntu One account to manage email forwarding and SMTP for your @ubuntustudio.com email address.'
    ]
  };

  // guides for each provider (39 total at time of this writing)
  for (const [x, provider] of nsProviders.entries()) {
    const name = `<span class="notranslate">${provider.name}</span>`;

    const year = `<span class="notranslate">${dayjs(now).format(
      'YYYY'
    )}</span>`;

    let title = `Free Email Setup for ${name} in ${year}`;
    let description = `How to send and receive emails with ${name} DNS and setup free email forwarding for ${name} with video and step by step instructions.`;

    if (x >= 3 && x < 6) {
      title = `Free Email Forwarding for ${name}`;
      description = `Setup free email forwarding with ${name} DNS records in seconds.`;
    } else if (x < 9) {
      title = `${year} Email Hosting Guide for ${name}`;
      description = `Learn about how to setup free email hosting for ${name} using ${name} DNS records.`;
    } else if (x < 12) {
      title = `Setup Free Email for ${name} in ${year}`;
      description = `Free email forwarding and setup guide for ${name} with step by step instructions.`;
    } else if (x < 15) {
      title = `Free ${year} Email Guide for ${name}`;
      description = `Follow our free email setup guide for ${name} and configure DNS records in minutes.`;
    } else if (x < 18) {
      title = `Free Email Forwarding in ${year} for ${name}`;
      description = `Learn how to setup free email forwarding for ${name} in minutes with our step by step guide.`;
    } else if (x < 21) {
      title = `Step by Step ${year} Email Guide for ${name}`;
      description = `Follow our step by step email setup guide for ${name} and setup email forwarding in minutes.`;
    } else if (x < 24) {
      title = `${year} Email Setup Instructions for ${name}`;
      description = `Quick and easy email setup instructions for ${name} to setup email forwarding and hosting.`;
    } else if (x < 27) {
      title = `Free Email Hosting for ${name} ${year}`;
      description = `Learn how to setup free email hosting and forwarding for ${name} using our step by step guide.`;
    } else if (x < 30) {
      title = `Email Hosting DNS Setup for ${name}`;
      description = `Need to configure your DNS records to setup email for ${name}?  Follow our step by step email hosting DNS setup guide.`;
    } else if (x < 33) {
      title = `Simple Email Setup for ${name} in ${year}`;
      description = `Simple and painless email setup guide for ${name}, which will let you setup email forwarding in minutes.`;
    } else if (x < 36) {
      title = `Easy Email Forwarding for ${name} (${year})`;
      description = `The easiest to follow guide for setting up email forwarding and hosting for ${name}.`;
    } else if (x < 39) {
      title = `(${year}) Quick Email Setup for ${name}`;
      description = `Quickly setup email in minutes for ${name} using our instructional guide and verification tool.`;
    }

    meta[`/guides/${provider.slug}`] = [title, description];
  }

  if (platforms.length > 0) {
    meta['/blog/open-source'] = [
      `Top ${
        platforms.length
      } Open Source Email Clients and Servers in <span class="notranslate">${dayjs(
        now
      ).format('YYYY')}</span>`,
      'Open-source email client and server reviews, side by side comparisons, screenshots, and step by step setup tutorial guides.'
      // `Open-source email client and server reviews, side by side comparisons, screenshots, and step by step setup tutorial guides for ${arrayJoinConjunction(
      //   [
      //     'Linux',
      //     ...platforms.filter((p) => !p.toLowerCase().includes('linux'))
      //   ]
      // )}.`
    ];
  }

  for (const [i, platform] of platforms.entries()) {
    let sample;
    if (i < 3) {
      sample = 'Top';
    } else if (i < 6) {
      sample = 'Best';
    } else if (i < 9) {
      sample = 'Top-Rated';
    } else if (i < 12) {
      sample = 'Most Popular';
    } else if (i < 15) {
      sample = 'Highest-Rated';
    } else if (i < 18) {
      sample = 'Greatest';
    } else if (i < 21) {
      sample = 'Amazing';
    } else if (i < 24) {
      sample = 'Excellent';
    } else if (i < 27) {
      sample = 'Favorited';
    } else if (i < 30) {
      sample = 'Notable';
    } else if (i < 33) {
      sample = 'Leading';
    } else if (i < 36) {
      sample = 'Outstanding';
    } else if (i < 39) {
      sample = 'Important';
    } else if (i < 41) {
      sample = 'Mighty';
    } else if (i < 44) {
      sample = 'Best';
    } else {
      sample = 'Top';
    }

    // email server
    const serverCount = getServersOrClientsList(platform, false).length;
    meta[`/blog/open-source/${dashify(platform)}-email-server`] = [
      `${serverCount} ${sample} Open Source Email Servers for <span class="notranslate">${platform}</span> in <span class="notranslate">${dayjs(
        now
      ).format('YYYY')}</span>`,
      `The ${serverCount} ${sample.toLowerCase()} free and open-source email servers for <span class="notranslate">${platform}</span> with setup guides, tutorials, videos, and instructions.`
    ];

    // email client
    const clientCount = getServersOrClientsList(platform, true).length;
    meta[`/blog/open-source/${dashify(platform)}-email-clients`] = [
      `${clientCount} ${sample} Open Source Email Clients for <span class="notranslate">${platform}</span> in <span class="notranslate">${dayjs(
        now
      ).format('YYYY')}</span>`,
      `Reviews, comparison, screenshots and more for the ${clientCount} ${sample.toLowerCase()} open-source email clients for <span class="notranslate">${platform}</span>.`
    ];
  }

  meta[`/blog/best-email-service`] = [
    `${
      alternatives.length
    } Best Email Services in <span class="notranslate">${dayjs(now).format(
      'YYYY'
    )}</span>`,
    `Reviews, comparison, screenshots and more for the ${alternatives.length} best email services.`
  ];

  meta[`/blog/best-private-email-service`] = [
    `${
      alternatives.filter((a) => a.e2ee || a.openpgp || a.wkd).length
    } Best Private Email Services in <span class="notranslate">${dayjs(
      now
    ).format('YYYY')}</span>`,
    `Reviews, comparison, screenshots and more for the ${
      alternatives.filter((a) => a.e2ee || a.openpgp || a.wkd).length
    } best private email services.`
  ];

  meta[`/blog/best-open-source-email-service`] = [
    `${
      alternatives.filter((a) => a.oss).length
    } Best Open-Source Email Services in <span class="notranslate">${dayjs(
      now
    ).format('YYYY')}</span>`,
    `Reviews, comparison, screenshots and more for the ${
      alternatives.filter((a) => a.oss).length
    } best open-source email services.`
  ];

  meta[`/blog/best-transactional-email-service`] = [
    `${
      alternatives.filter((a) => a.api).length
    } Best Transactional Email Services in <span class="notranslate">${dayjs(
      now
    ).format('YYYY')}</span>`,
    `Reviews, comparison, screenshots and more for the ${
      alternatives.filter((a) => a.api).length
    } best transactional email services.`
  ];

  meta[`/blog/best-email-api-developer-service`] = [
    `${
      alternatives.filter((a) => a.api).length
    } Best Email API's for Developers in <span class="notranslate">${dayjs(
      now
    ).format('YYYY')}</span>`,
    `Reviews, comparison, screenshots and more for the ${
      alternatives.filter((a) => a.api).length
    } best email service API's for developers.`
  ];

  meta['/blog/best-email-spam-filtering-service'] = [
    `${
      alternatives.filter((a) => a.api).length
    } Best Email Spam Filtering Services in <span class="notranslate">${dayjs(
      now
    ).format('YYYY')}</span>`,
    `Reviews, comparison, screenshots and more for the ${
      alternatives.filter((a) => a.api).length
    } best email spam filtering services.`
  ];

  // developer docs
  for (const doc of developerDocs) {
    if (doc.notCodeExample) {
      meta[doc.slug] = [
        doc.noYearAffix
          ? doc.title
          : `${doc.title} in <span class="notranslate">${dayjs(now).format(
              'YYYY'
            )}</span>`,
        doc.description
      ];
    } else {
      meta[doc.slug] = [
        doc.noYearAffix
          ? doc.title
          : `${doc.title} Code Example in <span class="notranslate">${dayjs(
              now
            ).format('YYYY')}</span>`,
        doc.description
      ];
    }
  }

  meta[config.loginRoute] = [
    `Log in ${lad}`,
    'Log in to your free email forwarding service account.'
  ];
  meta[config.verifyRoute] = [
    `Verify email ${lad}`,
    `Verify your ${config.appName} email address.`
  ];
  meta[config.otpRoutePrefix] = [
    `Two Factor Auth ${lad}`,
    'Authenticate yourself with optional OTP to log in.'
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
