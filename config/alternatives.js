/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const isSANB = require('is-string-and-not-blank');
const puppeteer = require('puppeteer');
const slug = require('speakingurl');
const { isURL } = require('@forwardemail/validator');
const { parse } = require('node-html-parser');

const env = require('./env');
const _ = require('#helpers/lodash');

const logger = require('#helpers/logger');
const parseRootDomain = require('#helpers/parse-root-domain');

// TODO: Duck/Firefox Relay?
// TODO: make note that the API must be able to send email
// TODO: outbound smtp monthly limit
// TODO: webhooks
// TODO: CardDAV/CalDAV
// TODO: inbound limit
// TODO: webmail
// TODO: desktop app
// TODO: mobile app
// TODO: iOS Push Notification support (via XAPPLEPUSHSERVICE capability)
// TODO: regex-based aliases
// TODO: calendar/contacts/newsletter columns

const obj = {
  AOL: [
    // description
    'AOL Mail is a free web-based email service provided by AOL, a division of Yahoo! Inc.',
    // website
    'https://mail.aol.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$12/yr',
    // storage
    '1000 GB',
    // attachment_limit
    '25 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    true,
    // pop3
    true,
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/aol.com/1705298152">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/aol.com/2577668/">55%</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/aol.com/1121781/">42%</a>',
    // ssl_labs
    'B'
  ],
  'AT&T': [
    // AT&T -> Yahoo
    // description
    'AT&T Mail is now Yahoo Mail',
    // website
    'https://www.att.com/partners/currently/email-sign-up/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$5/mo',
    // storage
    '5000 GB',
    // attachment_limit
    '25 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    '<a target="_blank" rel="noopener noreferrer" href="https://www.reddit.com/r/yahoo/comments/v5hkc6/comment/ibbf3ml/">No longer supported</a>',
    // imap
    '<a target="_blank" rel="noopener noreferrer" href="https://www.reddit.com/r/yahoo/comments/v5hkc6/comment/ibbf3ml/">No longer supported</a>',
    // pop3
    '<a target="_blank" rel="noopener noreferrer" href="https://www.reddit.com/r/yahoo/comments/v5hkc6/comment/ibbf3ml/">No longer supported</a>',
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/yahoo.com/1705359927>">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/yahoo.com/2577663/">73/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/yahoo.com/1121778/">38/100</a>',
    // ssl_labs
    'B'
  ],
  ActiveCampaign: [
    // description
    'Postmark, the leading service for transactional email, is now part of ActiveCampaign',
    // website
    'https://www.activecampaign.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    'https://tti.postmarkapp.com/',
    // pricing
    '$15/mo',
    // storage
    false,
    // attachment_limit
    '10 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    false,
    // pop3
    false,
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/activecampaign.com/1705384565">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/activecampaign.com/2577845/">68/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/activecampaign.com/1121872/">60/100</a>',
    // ssl_labs
    'A'
  ],
  'Amazon Workmail': [
    // description
    'Amazon WorkMail is a secure, managed business email and calendar service with support for existing desktop and mobile email client applications',
    // website
    'https://aws.amazon.com/workmail/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$4/mo',
    // storage
    '50 GB',
    // attachment_limit
    '25 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    true,
    // pop3
    false,
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/amazon.com/1705384778">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/amazon.com/2577850/">52/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/amazon.com/1121876/">60/100</a>',
    // ssl_labs
    'B'
  ],
  'Amazon Simple Email Service (SES)': [
    // description
    'Get reliable, scalable email to communicate with customers at the lowest industry prices',
    // website
    'https://aws.amazon.com/ses/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    "$X/mo; varies, using shared IP's from SES are known to have negative effect on deliverability",
    // storage
    false,
    // attachment_limit
    '10 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    false,
    // pop3
    false,
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/amazon.com/1705384778">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/amazon.com/2577850/">52/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/amazon.com/1121876/">60/100</a>',
    // ssl_labs
    'B'
  ],
  'Apple Mail (iCloud)': [
    // description
    'Private, secure, and personal email from Apple',
    // website
    'https://support.apple.com/en-us/HT201238',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$0.99',
    // storage
    '50 GB pooled',
    // attachment_limit
    '20 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    true,
    // pop3
    '<a target="_blank" rel="noopener noreferrer" href="https://support.apple.com/en-us/102525#sections">iCloud does not support POP3</a>',
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd,
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/apple.com/1705299256">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/apple.com/2577797/">68/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/apple.com/">Fail</a>',
    // ssl_labs
    'Not_Available'
  ],
  Brevo: [
    // 20K monthly outbound for $15/mo
    // description
    'The most approachable CRM to cultivate lasting customer relationships across Email, SMS, Chat and more',
    // website
    'https://www.brevo.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$15/mo',
    // storage
    false,
    // attachment_limit
    '20 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    false,
    // pop3
    false,
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/brevo.com/1705380761">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/brevo.com/2577800/">70/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/brevo.com/1121849/">77/100</a>',
    // ssl_labs
    'A+'
  ],
  'Customer.io': [
    // description
    'Send messages people actually want to receive using real-time customer data',
    // website
    'https://customer.io/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$100/mo',
    // storage
    false,
    // attachment_limit
    '2 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    false,
    // pop3
    false,
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/customer.io/1705381301">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/customer.io/2577803/>49/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/customer.io/1121850/">72/100</a>',
    // ssl_labs
    'B'
  ],
  'Elastic Email': [
    // description
    'Take your email marketing and email delivery to the next level',
    // website
    'https://elasticemail.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$9/mo',
    // storage
    false,
    // attachment_limit
    '10 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    false,
    // pop3
    false,
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/elasticemail.com/1705381568">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/elasticemail.com/2577806/">49/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/elasticemail.com/1121852/">72/100</a>',
    // ssl_labs
    'A'
  ],
  Fastmail: [
    // description
    'Fast, private email that’s just for you',
    // website
    'https://www.fastmail.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$3/mo',
    // storage
    '2 GB',
    // attachment_limit
    '70 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    true,
    // pop3
    true,
    // api
    false,
    // e2ee
    false,
    // openpgp
    '<a target="_blank" rel="noopener noreferrer" href="https://www.fastmail.com/blog/why-we-dont-offer-pgp/">Fastmail does support PGP, but not in their webmail; see this blog post for insight</a>',
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/fastmail.com">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/fastmail.com/2577809/">34/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/fastmail.com/1121853/">44/100</a>',
    // ssl_labs
    'A+'
  ],
  'Forward Email': [
    // description
    'Email for everyone',
    // website
    'https://forwardemail.net',
    // oss
    true,
    // sandboxed
    true,
    // tti
    'https://forwardemail.net/tti',
    // pricing
    '$3/mo',
    // storage
    '10 GB pooled',
    // attachment_limit
    '50 MB',
    // unlimited_domains
    true,
    // unlimited_aliases
    true,
    // smtp
    true,
    // imap
    true,
    // pop3
    true,
    // api
    true,
    // e2ee
    '<a target="_blank" rel="noopener noreferrer" href="/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd">Opt-in</a>',
    // openpgp
    true,
    // wkd
    true,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/forwardemail.net/1705359887">Pass</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/forwardemail.net/2577814/">100/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/forwardemail.net/1121856/">100/100</a>',
    // ssl_labs
    'A+'
  ],
  GMX: [
    // mirror of Mail.com
    // description
    'Create a free email account fast',
    // website
    'https://www.gmx.com/mail/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$29.99/yr',
    // storage
    '65 GB',
    // attachment_limit
    '100 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    true,
    // pop3
    true,
    // api
    false,
    // e2ee
    false,
    // openpgp
    true,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/gmx.com/1705382687">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/gmx.com/2577815/">81/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/gmx.com/1121857/">87/100</a>',
    // ssl_labs
    'A+'
  ],
  Gandi: [
    // description
    'We manage over 780,000 email addresses on our email servers, why not yours?',
    // website
    'https://www.gandi.net/en/domain/email',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$3.99/mo',
    // storage
    '10 GB',
    // attachment_limit
    '25 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    true,
    // pop3
    true,
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/gandi.net/1705382736">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/gandi.net/2577821/">70/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/gandi.net/1121858/">69/100</a>',
    // ssl_labs
    'A'
  ],
  'Get Response': [
    // description
    'An affordable, easy platform to send emails, grow your list, and automate communication',
    // website
    'https://www.getresponse.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$187.20/yr',
    // storage
    false,
    // attachment_limit
    // https://www.getresponse.com/help/attachment.html (400 KB)
    '0.4 MB',
    // unlimited_domains
    true,
    // unlimited_aliases
    true,
    // smtp
    true,
    // imap
    false,
    // pop3
    false,
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/getresponse.com/1705382992">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/getresponse.com/2577824/">49/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/getresponse.com/1121860/">65/100</a>',
    // ssl_labs
    'A'
  ],
  Gmail: [
    // description
    'Secure, smart, and easy to use email',
    // website
    'https://www.google.com/gmail/about/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$7.20/mo',
    // storage
    '30 GB pooled',
    // attachment_limit
    '25 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    true,
    // pop3
    true,
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/gmail.com/1705216000">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/gmail.com/2577826/">65/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/getresponse.com/1121860/">65/100</a>',
    // ssl_labs
    'B'
  ],
  GoDaddy: [
    // description
    'Create a professional email using your domain',
    // website
    'https://www.godaddy.com/email/professional-business-email',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$35.88/yr',
    // storage
    '10 GB',
    // attachment_limit
    '20 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    true,
    // pop3
    true,
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/godaddy.com/1705383264">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/godaddy.com/2577830/">52/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/godaddy.com/1121862/">65/100</a>',
    // ssl_labs
    'A'
  ],
  HEY: [
    // description
    'We finally fixed your email + calendar!',
    // website
    'https://www.hey.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$99/yr + $12/mo per user',
    // storage
    '100 GB',
    // attachment_limit
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hey.com/features/big-files/">HEY does not use regular email attachments, which also prevents them from being encrypted with PGP</a>',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    false,
    // imap
    false,
    // pop3
    false,
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/hey.com/1705383257">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/hey.com/2577831/">52/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/hey.com/1121863/">65/100</a>',
    // ssl_labs
    'A+'
  ],
  HubSpot: [
    // description
    'Grow better with HubSpot',
    // website
    'https://www.hubspot.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$890/mo (varies, some plans do not include SMTP)',
    // storage
    false,
    // attachment_limit
    '20 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    false,
    // pop3
    false,
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/hubspot.com/1705384195">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/hubspot.com/2577836/">94/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/hubspot.com/1121866/">62/100</a>',
    // ssl_labs
    'A+'
  ],
  ImprovMX: [
    // description
    'Create free email aliases for your domain name',
    // website
    'https://improvmx.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    'https://improvmx.com/#tti__apple',
    // pricing
    '$9/mo',
    // storage
    false,
    // attachment_limit
    '50 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    false,
    // pop3
    false,
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/improvmx.com/1705384235">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/improvmx.com/2577837/">66/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/improvmx.com/1121867/">85/100</a>',
    // ssl_labs
    'A+'
  ],
  Klaviyo: [
    // description
    'Power smarter digital relationships',
    // website
    'https://www.klaviyo.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$20/mo',
    // storage
    false,
    // attachment_limit
    // Klaviyo does not support attachments
    // https://community.klaviyo.com/integrations-and-reviews-39/attachments-needs-to-be-added-5991?postid=21581#post21581
    '0 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    false,
    // imap
    false,
    // pop3
    false,
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/klaviyo.com/1705384402">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/klaviyo.com/2577841/">52/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/klaviyo.com/1121869/">72/100</a>',
    // ssl_labs
    'A'
  ],
  'Mail.com': [
    // mirror of GMX
    // description
    'Free email – Customized to your needs',
    // website
    'https://www.mail.com/mail/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$29.99/yr',
    // storage
    '65 GB',
    // attachment_limit
    '100 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    true,
    // pop3
    true,
    // api
    false,
    // e2ee
    false,
    // openpgp
    true,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/mail.com/1705384404">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/mail.com/2577844/">81/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/mail.com/1121870/">83/100</a>',
    // ssl_labs
    'A+'
  ],
  Migadu: [
    // description
    'The Missing Email',
    // website
    'https://www.migadu.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$9/mo',
    // storage
    '30 GB',
    // attachment_limit
    'Unknown',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    true,
    // pop3
    true,
    // api
    false,
    // e2ee
    '<a target="_blank" rel="noopener noreferrer" href="https://www.migadu.com/procon/#not-encrypted">Not encrypted</a>',
    // openpgp
    '<a target="_blank" rel="noopener noreferrer" href="https://www.migadu.com/procon/#not-encrypted">Does not allow you to upload OpenPGP key</a>',
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/migadu.com/1723989512">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/migadu.com/2920307/">92/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/migadu.com/1313797/">97/100</a>',
    // ssl_labs
    'A'
  ],
  'mailbox.org': [
    // description
    'Privacy made in Germany',
    // website
    'https://mailbox.org/en/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '€3/mo',
    // storage
    '10 GB',
    // attachment_limit
    '100 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    true,
    // pop3
    true,
    // api
    false,
    // e2ee
    false,
    // openpgp
    // '<a target="_blank" rel="noopener noreferrer" href="https://kb.mailbox.org/en/business/security-privacy-article/an-introduction-to-mailbox-org-guard">Supported although they require you to upload your private keys, which is a security issue</a>; also see this blog post for <a href="https://kb.mailbox.org/en/private/e-mail-article/your-encrypted-mailbox/" target="_blank" rel="noopener noreferrer">uploading public keys</a>.',
    true,
    // wkd
    // '<a target="_blank" rel="noopener noreferrer" href="https://wiki.gnupg.org/WKD#:~:text=claims%20to%20offer%20web%20key%20directory%20lookup">GnuPG.org states that it is claimed they offer WKD, but it is not advertised on their website currently</a>',
    true,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/mailbox.org/1704462519">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/mailbox.org/2560359/">92/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/mailbox.org/1111658/">71/100</a>',
    // ssl_labs
    'A+'
  ],
  Mailchimp: [
    // description
    'Turn Emails into Revenue',
    // website
    'https://mailchimp.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    // '$13/mo + $20/mo Mandrill add-on',
    '$33/mo',
    // storage
    false,
    // attachment_limit
    '25 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    '<a target="_blank" rel="noopener noreferrer" href="https://mailchimp.com/help/add-or-remove-transactional-email/">Requires paid add-on for Mandrill of at least $20/mo</a>',
    // imap
    false,
    // pop3
    false,
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/mailchimp.com/1705384573">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/mailchimp.com/2577847/">52/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/mailchimp.com/1121873/">77/100</a>',
    // ssl_labs
    'A'
  ],
  MailerSend: [
    // description
    'Intuitive email API and SMTP',
    // website
    'https://www.mailersend.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$288/yr',
    // storage
    false,
    // attachment_limit
    '25 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    false,
    // pop3
    false,
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/mailersend.com/1705384808">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/mailersend.com/2577852/">68/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/mailersend.com/1121875/">52/100</a>',
    // ssl_labs
    'A'
  ],
  Mailfence: [
    // description
    'Secure and private email',
    // website
    'https://mailfence.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$3.50/mo',
    // storage
    '10 GB',
    // attachment_limit
    '50 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    true,
    // pop3
    true,
    // api
    false,
    // e2ee
    '<a target="_blank" rel="noopener noreferrer" href="https://kb.mailfence.com/categories/openpgp-encryption-and-digital-signature/">Opt-in</a>',
    // openpgp
    true,
    // wkd
    true,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/mailfence.com/1705387158">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/mailfence.com/2577854/">66/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/mailfence.com/1121878/">50/100</a>',
    // ssl_labs
    'A+'
  ],
  Mailgun: [
    // description
    'Flexible, scalable, and results driven email sending platform',
    // website
    'https://www.mailgun.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$35/mo',
    // storage
    false,
    // attachment_limit
    '25 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    false,
    // pop3
    false,
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/mailgun.com/1705391746">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/mailgun.com/2577956/">55/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/mailgun.com/1121954/">65/100</a>',
    // ssl_labs
    'A+'
  ],
  Mailjet: [
    // description
    'Effortlessly create and deploy marketing and transactional emails in one place',
    // website
    'https://www.mailjet.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$15/mo',
    // storage
    false,
    // attachment_limit
    '15 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    false,
    // pop3
    false,
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/mailjet.com/1705391910">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/mailjet.com/2577960/">40/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/mailjet.com/1121957/">52/100</a>',
    // ssl_labs
    'A+'
  ],
  Mailtrap: [
    // description
    'Email Delivery Platform that delivers just in time. Great for businesses and individuals',
    // website
    'https://mailtrap.io/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$10/mo',
    // storage
    false,
    // attachment_limit
    '10 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    false,
    // pop3
    false,
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/mailtrap.io/1705392152">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/mailtrap.io/2577972/">68/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/mailtrap.io/1121966/">50/100</a>',
    // ssl_labs
    'A'
  ],
  Mandrill: [
    // description
    'Reach inboxes when it matters most',
    // website
    'https://mailchimp.com/features/transactional-email/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    // '$13/mo + $20/mo Mandrill add-on',
    '$33/mo',
    // storage
    false,
    // attachment_limit
    '25 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    '<a target="_blank" rel="noopener noreferrer" href="https://mailchimp.com/help/add-or-remove-transactional-email/">Requires paid add-on for Mandrill of at least $20/mo</a>',
    // imap
    false,
    // pop3
    false,
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/mailchimp.com/1705384573">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/mailchimp.com/2577847/">52/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/mailchimp.com/1121873/">77/100</a>',
    // ssl_labs
    'A'
  ],
  MessageBird: [
    // description
    'Omnichannel automation platform for APIs, service & marketing',
    // website
    'https://messagebird.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$20/mo',
    // storage
    false,
    // attachment_limit
    '100 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    false,
    // pop3
    false,
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/messagebird.com/1705392302">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/messagebird.com/2577976/">73/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/messagebird.com/1121967/">77/100</a>',
    // ssl_labs
    'A+'
  ],
  'Microsoft 365': [
    // description
    'Grow your business with Microsoft 365',
    // website
    'https://www.microsoft.com/en-us/microsoft-365/business',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$72/yr',
    // storage
    '1000 GB pooled',
    // attachment_limit
    '150 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    true,
    // pop3
    true,
    // api
    false,
    // e2ee
    false,
    // openpgp
    '<a target="_blank" rel="noopener noreferrer" href="https://learn.microsoft.com/en-us/purview/email-encryption">Microsoft 365 does not support PGP/MIME</a>',
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/microsoft.com/1705393951">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/microsoft.com/2578031/">73/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/microsoft.com/1122001/">65/100</a>',
    // ssl_labs
    'A+'
  ],
  '123 Reg': [
    // description
    'Professional email that shows you mean business',
    // website
    'https://www.123-reg.co.uk/email-hosting/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '£35.88/yr',
    // storage
    '10 GB',
    // attachment limit
    '30 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    true,
    // pop3
    true,
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/123-reg.co.uk/1705421094">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/123-reg.co.uk/2579020/">70/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/123-reg.co.uk/1122457/">52/100</a>',
    // ssl_labs
    'A'
  ],
  Namecheap: [
    // description
    'Do more with Professional Email, for less',
    // website
    'https://www.namecheap.com/hosting/email/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$14.88/yr',
    // storage
    '5 GB',
    // attachment_limit
    '20 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    true,
    // pop3
    true,
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/namecheap.com/1705420715">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/namecheap.com/2579010/">47/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/namecheap.com/1122455/">62/100</a>',
    // ssl_labs
    'A+'
  ],
  Pobox: [
    // description
    'Unlock your email identity',
    // website
    'https://www.pobox.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$50/yr',
    // storage
    '50 GB',
    // attachment_limit
    '25 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    true,
    // pop3
    true,
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/pobox.com/1705421279">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/pobox.com/2579026/">34/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/pobox.com/1122459/">35/100</a>',
    // ssl_labs
    'B'
  ],
  // NOTE: Posteo doesn't support custom domains so we left it out
  Postmark: [
    // description
    'The email delivery service that people actually like',
    // website
    'https://postmarkapp.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    'https://tti.postmarkapp.com/',
    // pricing
    '$15/mo',
    // storage
    false,
    // attachment_limit
    '10 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    false,
    // pop3
    false,
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/postmarkapp.com/1705421468">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/postmarkapp.com/2579032/">49/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/postmarkapp.com/1122464/">77/100</a>',
    // ssl_labs
    'B'
  ],
  'Proton Mail': [
    // description
    'Secure email that protects your privacy',
    // website
    'https://proton.me/mail',
    // oss
    '<a target="_blank" rel="noopener noreferrer" href="https://github.com/ProtonMail/WebClients/issues/257#issuecomment-964240013">Proton Mail claims to be open-source, but their back-end actually is closed source</a>',
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$3.99/mo',
    // storage
    '15 GB',
    // attachment_limit
    '25 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    '<a target="_blank" rel="noopener noreferrer" href="https://proton.me/blog/smtp-imap-pop3#protonmail">Requires you to download Proton Mail Bridge and forces vendor lock-in</a>',
    // imap
    '<a target="_blank" rel="noopener noreferrer" href="https://proton.me/blog/smtp-imap-pop3#protonmail">Requires you to download Proton Mail Bridge and forces vendor lock-in</a>',
    // pop3
    '<a target="_blank" rel="noopener noreferrer" href="https://proton.me/support/imap-smtp-and-pop3-setup">Proton Mail does not support POP3</a>',
    // api
    false,
    // e2ee
    '<a target="_blank" rel="noopener noreferrer" href="https://jfloren.net/b/2023/7/7/0">Proton Mail rewrites your emails</a>',
    // openpgp
    true,
    // wkd
    true,
    // hardenize
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/protonmail.com/1704459294">Fail</a>',
    // internetnl_site
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/protonmail.com/2560226/">66/100</a>',
    // internetnl_mail
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/protonmail.com/1111619/">75/100</a>',
    // ssl_labs
    'A+'
  ],
  Resend: [
    // description
    'Email for developers',
    // website
    'https://resend.com',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$20/mo',
    // storage
    false,
    // attachment_limit
    '40 MB',
    // unlimited_domains
    true,
    // unlimited_aliases
    true,
    // smtp
    true,
    // imap
    false,
    // pop3
    false,
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/resend.com/1705421701">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/resend.com/2579038/">52/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/resend.com/1122468/">72/100</a>',
    // ssl_labs
    'A+'
  ],
  SMTP2GO: [
    // description
    'Like a first-class courier, for email',
    // website
    'https://www.smtp2go.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$10/mo',
    // storage
    false,
    // attachment_limit
    '50 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    false,
    // pop3
    false,
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/smtp2go.com/1705423161">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/smtp2go.com/2579059/">32/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/smtp2go.com/1122482/">65/100</a>',
    // ssl_labs
    'A'
  ],
  Sendgrid: [
    // description
    'Get your emails to the inbox—where they belong',
    // website
    'https://sendgrid.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$19.95/mo',
    // storage
    false,
    // attachment_limit
    '30 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    false,
    // pop3
    false,
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/sendgrid.com/1705423356">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/sendgrid.com/2579063/">55/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/sendgrid.com/1122483/">60/100</a>',
    // ssl_labs
    'A'
  ],
  // Sendinblue is now Brevo (see above)
  /*
  Skiff: [
    // description
    'Privacy-first end-to-end encrypted email (NOTE: this company is no longer in business and shutting down service in August 2024)',
    // website
    'https://skiff.com/',
    // oss
    '<a target="_blank" rel="noopener noreferrer" href="https://www.reddit.com/r/Skiff/comments/10yn8a5/comment/j811jki/">Skiff claims to be open-source, but their back-end is actually closed-source</a>',
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$3/mo',
    // storage
    '15 GB',
    // attachment_limit
    '25 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Skiff does not support SMTP and forces vendor lock-in',
    // imap
    'Skiff does not support IMAP and forces vendor lock-in',
    // pop3
    'Skiff does not support POP3 and forces vendor lock-in',
    // api
    false,
    // e2ee
    '<a target="_blank" rel="noopener noreferrer" href="https://news.ycombinator.com/item?id=38993680">Supported, but Skiff manages your private keys and is closed-source</a>',
    // openpgp
    true,
    // wkd
    true,
    // hardenize
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/skiff.com/1705453431">Pass</a>',
    // internetnl_site
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/skiff.com/2560253/">97/100</a>',
    // internetnl_mail
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/skiff.com/1111628/">87/100</a>',
    // ssl_labs
    'A+'
  ],
  */
  // SparkPost is now MessageBird
  Startmail: [
    // description
    'Private email you can trust',
    // website
    'https://www.startmail.com/',
    // oss
    false,
    // sandboxed
    '<a target="_blank" rel="noopener noreferrer" href="https://www.startmail.com/whitepaper/#422-user-vault">Startmail claims to use a User Vault, but this statement has not been audited and their source code is closed-source</a>',
    // tti
    false,
    // pricing
    '$7/mo',
    // storage
    '20 GB',
    // attachment_limit
    '25 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    true,
    // pop3
    true,
    // api
    false,
    // e2ee
    'Supported if both sender and recipient are using OpenPGP',
    // openpgp
    '<a target="_blank" rel="noopener noreferrer" href="https://support.startmail.com/hc/en-us/articles/360007509378-Getting-started-with-email-encryption">Supports OpenPGP, but does not support WKD</a>',
    // wkd
    false,
    // hardenize
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/startmail.com/1705361614">Fail</a>',
    // internetnl_site
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/startmail.com/2560203/">100/100</a>',
    // internetnl_mail
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/startmail.com/1111613/">83/100</a>',
    // ssl_labs
    'A+'
  ],
  Titan: [
    // description
    'The customer-centric business email service that helps you grow',
    // website
    'https://titan.email/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    'Undisclosed',
    // storage
    'Undisclosed',
    // attachment_limit
    '30 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    true,
    // pop3
    true,
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/titan.email/1705365327">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/titan.email/2577697/">55/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/titan.email/1121813/">55/100</a>',
    // ssl_labs
    'A+'
  ],
  Tutanota: [
    // description
    'Secure, green and ad-free. Email to feel good about',
    // website
    'https://tutanota.com/',
    // oss
    '<a target="_blank" rel="noopener noreferrer" href="https://old.reddit.com/r/tutanota/comments/10hghin/tutanota_opens_backend_server_side/">Tutanota claims to be open-source, but their back-end is actually closed-source</a>',
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '€36/yr',
    // storage
    '20 GB',
    // attachment_limit
    '25 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    false,
    // imap
    false,
    // pop3
    false,
    // api
    false,
    // e2ee
    false,
    // openpgp
    '<a target="_blank" rel="noopener noreferrer" href="https://old.reddit.com/r/tutanota/comments/q8ou3m/is_it_true_that_tutanota_doesnt_support_openpgp/hgqpe8j/">Tutanota does not support PGP</a>',
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/tuta.com/1705453437">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/tuta.com/2560241/">100/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/tuta.com/1111623/">87/100</a>',
    // ssl_labs
    'A'
  ],
  // TODO: add Vivaldi browser to list of alternatives like Thunderbird
  Yahoo: [
    // description
    'Yahoo Mail Plus helps you gain the upper hand on clutter in your inbox',
    // website
    'https://www.yahoo.com/plus/mail',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$5/mo',
    // storage
    '5000 GB',
    // attachment_limit
    '25 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    '<a target="_blank" rel="noopener noreferrer" href="https://www.reddit.com/r/yahoo/comments/v5hkc6/comment/ibbf3ml/">No longer supported</a>',
    // imap
    '<a target="_blank" rel="noopener noreferrer" href="https://www.reddit.com/r/yahoo/comments/v5hkc6/comment/ibbf3ml/">No longer supported</a>',
    // pop3
    '<a target="_blank" rel="noopener noreferrer" href="https://www.reddit.com/r/yahoo/comments/v5hkc6/comment/ibbf3ml/">No longer supported</a>',
    // api
    false,
    // e2ee
    false,
    // openpgp,
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/yahoo.com/1705359927>">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/yahoo.com/2577663/">73/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/yahoo.com/1121778/">38/100</a>',
    // ssl_labs
    'B'
  ],
  Yandex: [
    "An email address with your company's name is an easy way to stand out",
    // website
    'https://360.yandex.com/business/domain-mail/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '₽2988/yr',
    // storage
    '100 GB',
    // attachment_limit
    '30 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    true,
    // pop3
    true,
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/yandex.com/1705424812">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/yandex.com/2579085/">65/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/yandex.com/1122501/">71/100</a>',
    // ssl_labs
    'B'
  ],
  Zoho: [
    // description
    'Secure business email for your organization',
    // website
    'https://www.zoho.com/mail/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$12/yr',
    // storage
    '5 GB',
    // attachment_limit
    '20 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    true,
    // pop3
    true,
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/zoho.com/1705425088">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/zoho.com/2579088/">55/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/zoho.com/1122504/">62/100</a>',
    // ssl_labs
    'A+'
  ],
  'Cloudflare Email Routing': [
    // description
    'Easily create addresses and route emails for free',
    // website
    'https://www.cloudflare.com/developer-platform/email-routing/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$25/mo',
    // storage
    false,
    // attachment_limit
    '25 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    false,
    // imap
    false,
    // pop3
    false,
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/cloudflare.com/1705459129">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/cloudflare.com/2579602/">92/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/cloudflare.com/1122887/">62/100</a>',
    // ssl_labs
    'B'
  ],
  'SMTP.com': [
    // description
    'Transactional and email relay API',
    // website
    'https://www.smtp.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$25/mo',
    // storage
    false,
    // attachment_limit
    '15 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    false,
    // pop3
    false,
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/smtp.com/1705459078">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/smtp.com/2579603/">49/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/smtp.com/1122885/">72/100</a>',
    // ssl_labs
    'A'
  ],
  SimpleLogin: [
    // description
    'Receive and send emails anonymously',
    // website
    'https://simplelogin.io/',
    // oss
    true,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$4/mo',
    // storage
    false,
    // attachment_limit
    '25 MB',
    // unlimited_domains
    true,
    // unlimited_aliases
    true,
    // smtp
    false,
    // imap
    false,
    // pop3
    false,
    // api
    false,
    // e2ee
    '<a target="_blank" rel="noopener noreferrer" href="https://simplelogin.io/blog/introducing-pgp/">Opt-in</a>',
    // openpgp
    true,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/simplelogin.io/1705459076">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/simplelogin.io/2579605/">76/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/simplelogin.io/1122888/">87/100</a>',
    // ssl_labs
    'A+'
  ],
  'addy.io': [
    // description
    'Protect your real email address using email aliases',
    // website
    'https://addy.io/',
    // oss
    true,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$4/mo',
    // storage
    false,
    // attachment_limit
    '25 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    true,
    // smtp
    false,
    // imap
    false,
    // pop3
    false,
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/addy.io/1705459145">Pass</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/addy.io/2579606/">100/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/addy.io/1122890/">100/100</a>',
    // ssl_labs
    'A+'
  ],
  Intercom: [
    // description
    'The only AI customer service solution you need',
    // website
    'https://www.intercom.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$39/mo',
    // storage
    false,
    // attachment_limit
    '20 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    false,
    // imap
    false,
    // pop3
    false,
    // api
    '<a target="_blank" rel="noopener noreferrer" href="https://medium.com/@cathal.horan/how-to-send-html-emails-with-the-intercom-conversations-api-748eb2784b1">See blog post</a>',
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/intercom.com/1705459146">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/intercom.com/2579607/">52/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/intercom.com/1122886/">72/100</a>',
    // ssl_labs
    'A+'
  ],
  'Drift Chat': [
    // description
    'Create enduring customer relationships',
    // website
    'https://www.drift.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$2,500/mo billed annually ($30,000/yr)',
    // storage
    false,
    // attachment_limit
    '25 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    false,
    // imap
    false,
    // pop3
    false,
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/drift.com/1705459071">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/drift.com/2579611/">71/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/drift.com/1122892/">56/100</a>',
    // ssl_labs
    'A'
  ],
  'Crisp Chat': [
    // description
    'Give your customer experience a human touch',
    // website
    'https://crisp.chat',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$25/mo',
    // storage
    false,
    // attachment_limit
    '10 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    false,
    // imap
    false,
    // pop3
    false,
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/crisp.chat/1705459166">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/crisp.chat/2579609/">94/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/crisp.chat/1122891/">80/100</a>',
    // ssl_labs
    'B'
  ],
  'Help Scout': [
    // description
    'One unified platform',
    // website
    'https://www.helpscout.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$20/mo',
    // storage
    false,
    // attachment_limit
    '10 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    false,
    // imap
    false,
    // pop3
    false,
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/helpscout.com/1705459167">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/helpscout.com/2579604/">52/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/helpscout.com/1122889/">68/100</a>',
    // ssl_labs
    'A'
  ],
  Zendesk: [
    // description
    'Unlock the power of customer experiences',
    // website
    'https://www.zendesk.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$69/mo',
    // storage
    false,
    // attachment_limit
    '50 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    false,
    // imap
    false,
    // pop3
    false,
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/zendesk.com/1705459069">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/zendesk.com/2579610/">49/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/zendesk.com/1122893/">70/100</a>',
    // ssl_labs
    'A'
  ],
  Olark: [
    // description
    'Customers want to talk to you. Make it easy',
    // website
    'https://www.olark.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$29/mo',
    // storage
    false,
    // attachment_limit
    '50 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    false,
    // imap
    false,
    // pop3
    false,
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/olark.com/1705459170">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/olark.com/2579612/">52/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/olark.com/1122895/">77/100</a>',
    // ssl_labs
    'B'
  ],
  HelpCrunch: [
    // description
    'Customer service software that covers all your business needs',
    // website
    'https://helpcrunch.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$23/mo (for the mininum plan to send emails)',
    // storage
    false,
    // attachment_limit
    '10 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    false,
    // imap
    false,
    // pop3
    false,
    // api
    false,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/helpcrunch.com/1705459190">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/helpcrunch.com/2579614/">68/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/helpcrunch.com/1122896/">77/100</a>',
    // ssl_labs
    'B'
  ],
  Posteo: [
    // description
    'Green, secure, ad-free',
    // website
    'https://posteo.de/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '€1/mo',
    // storage
    '2 GB',
    // attachment_limit
    '50 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    true,
    // imap
    true,
    // pop3
    true,
    // api
    false,
    // e2ee
    '<a target="_blank", rel="noopener noreferrer" href="https://posteo.de/en/help/how-do-i-set-up-end-to-end-encryption-in-the-browser">Opt-in</a>',
    // openpgp
    true,
    // wkd
    true,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/posteo.de/1722691888">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/posteo.deo/2910817/">33/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/posteo.de/1308586/">83/100</a>',
    // ssl_labs
    'A+'
  ],
  Mimecast: [
    // description
    'Email & Collaboration Security',
    // website
    'https://www.mimecast.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '<a target="_blank" rel="noopener noreferrer" href="https://www.mimecast.com/products/mimecast-plans/">See Mimecast plans (requires you to talk to a sales team)</a> (<a target="_blank" rel="noopener noreferrer" href="https://www.reddit.com/r/mimecast/comments/1ay3vem/mimecast_planspricing/">according to a Reddit thread</a> it may cost upwards of +$1000-2000 per month)',
    // storage
    'Unknown',
    // attachment_limit
    '200 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Requires 3rd party',
    // imap
    'Requires 3rd party',
    // pop3
    'Requires 3rd party',
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/mimecast.com/1723138070">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/mimecast.com/2910819/">34/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/mimecast.com/1308587/">52/100</a>',
    // ssl_labs
    'A'
  ],
  Proofpoint: [
    // description
    'The leader in human-centric cybersecurity',
    // website
    'https://www.proofpoint.com/us',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '<a target="_blank" rel="noopener noreferrer" href="https://www.proofpoint.com/sites/default/files/data-sheets/pfpt-us-ds-essentials-pricelist-msrp-us.pdf">See Proofpoint plans (requires you to talk to a sales team)</a> (<a target="_blank" rel="noopener noreferrer" href="https://www.reddit.com/r/mimecast/comments/1ay3vem/mimecast_planspricing/">according to a Reddit thread</a> it may cost upwards of +$1000-2000 per month)',
    // storage
    'Unknown',
    // attachment_limit
    '150 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Requires 3rd party',
    // imap
    'Requires 3rd party',
    // pop3
    'Requires 3rd party',
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/proofpoint.com/1723138425">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/proofpoint.com/2910823/">73/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/proofpoint.com/1308590/">60/100</a>',
    // ssl_labs
    'A+'
  ],
  SpamTitan: [
    // description
    'Email Security Solutions',
    // website
    'https://www.spamtitan.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '<a target="_blank" rel="noopener noreferrer" href="https://www.spamtitan.com/spamtitan-quote/">Rrequires you to talk to a sales team</a>',
    // storage
    'Unknown',
    // attachment_limit
    '150 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Requires 3rd party',
    // imap
    'Requires 3rd party',
    // pop3
    'Requires 3rd party',
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/spamtitan.com/1723139616">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/spamtitan.com/2910843/">47/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/spamtitan.com/1308598/">40/100</a>',
    // ssl_labs
    'A'
  ],
  Barracuda: [
    // description
    'Cybersecurity Solutions: Email, Apps, Network, Data',
    // website
    'https://www.barracuda.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '<a target="_blank" rel="noopener noreferrer" href="https://www.barracuda.com/products/email-protection/plans">Requires you to talk to a sales team</a>',
    // storage
    'Unknown',
    // attachment_limit
    '100 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Requires 3rd party',
    // imap
    'Requires 3rd party',
    // pop3
    'Requires 3rd party',
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/barracuda.com">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/barracuda.com/2910849/">49/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/barracuda.com/1308599/">55/100</a>',
    // ssl_labs
    'B'
  ],
  'Cisco Secure Email Defense': [
    // description
    'Advanced protection to safeguard your inboxes',
    // website
    'https://www.cisco.com/site/us/en/products/security/secure-email/index.html',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    'Requires you to talk to a sales team',
    // storage
    'Unknown',
    // attachment_limit
    '100 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Requires 3rd party',
    // imap
    'Requires 3rd party',
    // pop3
    'Requires 3rd party',
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/cisco.com/1723142293">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/cisco.com/2910858/">68/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/cisco.com/1308607/">70/100</a>',
    // ssl_labs
    'A-'
  ],
  // Fortinet
  Fortinet: [
    // description
    'Global Leader of Cybersecurity Solutions and Services',
    // website
    'https://www.fortinet.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    'Requires you to talk to a sales team',
    // storage
    'Unknown',
    // attachment_limit
    'Unknown',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Requires 3rd party',
    // imap
    'Requires 3rd party',
    // pop3
    'Requires 3rd party',
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/fortinet.com/1723142304">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/fortinet.com/2910861/">29/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/fortinet.com/1308608/">46/100</a>',
    // ssl_labs
    'A'
  ],
  // Darktrace
  Darktrace: [
    // description
    'Cyber security that learns you',
    // website
    'https://darktrace.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    'Requires you to talk to a sales team (<a target="_blank" rel="noopener noreferrer" href="https://aws.amazon.com/marketplace/pp/prodview-7jaubfwm2vvhc">according to Amazon AWS Marketplace</a> it may cost upwards of $30,000/mo)',
    // storage
    'Requires 3rd party',
    // attachment_limit
    'Unknown',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Requires 3rd party',
    // imap
    'Requires 3rd party',
    // pop3
    'Requires 3rd party',
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/darktrace.com/1723140960">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/darktrace.com/2910859/">79/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/darktrace.com/1308606/">85/100</a>',
    // ssl_labs
    'A+'
  ],
  // Abnormal Security
  'Abnormal Security': [
    // description
    'Cloud Email Security - Block Malicious Email Attacks',
    // website
    'https://abnormalsecurity.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    'Requires you to talk to a sales team',
    // storage
    'Requires 3rd party',
    // attachment_limit
    'Unknown',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Requires 3rd party',
    // imap
    'Requires 3rd party',
    // pop3
    'Requires 3rd party',
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/abnormalsecurity.com/1723140967">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/abnormalsecurity.com/2910860/">52/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/abnormalsecurity.com/1308610/">77/100</a>',
    // ssl_labs
    'A+'
  ],
  // Spam Hero
  'Spam Hero': [
    // description
    'Cloud-Based Spam Filtering',
    // website
    'https://www.spamhero.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$8/mo',
    // storage
    'Requires 3rd party',
    // attachment_limit
    '50 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Requires 3rd party',
    // imap
    'Requires 3rd party',
    // pop3
    'Requires 3rd party',
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/spamhero.com/1723140651">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/spamhero.com/2910862/">34/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/spamhero.com/1308609/">41/100</a>',
    // ssl_labs
    'A'
  ],
  'Vade Secure': [
    // description
    'Simple, Sophisticated Email Security Powered by AI',
    // website
    'https://www.vadesecure.com',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    'Requires you to talk to a sales team',
    // storage
    'Requires 3rd party',
    // attachment_limit
    '50 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Requires 3rd party',
    // imap
    'Requires 3rd party',
    // pop3
    'Requires 3rd party',
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/vadesecure.com/1723141625">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/vadesecure.com/2910874/">47/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/vadesecure.com/1308613/">61/100</a>',
    // ssl_labs
    'A'
  ],
  'N‑able Mail Assure': [
    // description
    'Email protection to help you secure and scale',
    // website
    'https://www.n-able.com/products/mail-assure',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    'Requires you to talk to a sales team',
    // storage
    'Requires 3rd party',
    // attachment_limit
    '<a target="_blank" rel="noopener noreferrer" href="https://documentation.n-able.com/mail-assure/troubleshooting/Content/kb/What-is-the-maximum-message-size-allowed-in-Mail-Assure.htm#:~:text=The%20vast%20majority%20of%20MTA%27s%20do%20not%20allow%20more%20than%2010MB%20total%20message%20size">Depends on inbound/outbound (e.g. 10 MB)</a>',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Requires 3rd party',
    // imap
    'Requires 3rd party',
    // pop3
    'Requires 3rd party',
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/n-able.com/1723141972">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/n-able.com/2910876/">47/100</a',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/n-able.com/1308615/">56/100</a>',
    // ssl_labs
    'A'
  ],
  DuoCircle: [
    // description
    'Protect Email Against Phishing, Spam and Malware',
    // website
    'https://www.duocircle.com',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    'Requires you to talk to a sales team',
    // storage
    'Requires 3rd party',
    // attachment_limit
    '50 MB',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Requires 3rd party',
    // imap
    'Requires 3rd party',
    // pop3
    'Requires 3rd party',
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/duocircle.com/1723143105">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/duocircle.com/2910878/">47/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/duocircle.com/1308620/">72/100</a>',
    // ssl_labs
    'A'
  ],
  OOPSpam: [
    // description
    'Automate your Spam and Abuse Detection',
    // website
    'https://www.oopspam.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    '$49/mo',
    // storage
    'Requires 3rd party',
    // attachment_limit
    'Unknown',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Requires 3rd party',
    // imap
    'Requires 3rd party',
    // pop3
    'Requires 3rd party',
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/oopspam.com/1723145721">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/oopspam.com/2910897/">49/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/oopspam.com/1308635/">61/100</a>',
    // ssl_labs
    'A'
  ],
  Libraesva: [
    // description
    'Email Security, Email Archiving, Phishing Awareness, DMARC',
    // website
    'https://www.libraesva.com',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    'Requires you to talk to a sales team',
    // storage
    'Requires 3rd party',
    // attachment_limit
    'Unknown',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Requires 3rd party',
    // imap
    'Requires 3rd party',
    // pop3
    'Requires 3rd party',
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/libraesva.com/1723145854">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/libraesva.com/2910898/">68/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/libraesva.com/1308636/">62/100</a>',
    // ssl_labs
    'A'
  ],
  Trustifi: [
    // description
    'Protect Your Business Emails with AI-Powered Security',
    // website
    'https://trustifi.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    'Requires you to talk to a sales team',
    // storage
    'Requires 3rd party',
    // attachment_limit
    'Unknown',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Requires 3rd party',
    // imap
    'Requires 3rd party',
    // pop3
    'Requires 3rd party',
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/trustifi.com/1723145991">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/trustifi.com/2910899/">66/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/trustifi.com/1308638/">65/100</a>',
    // ssl_labs
    'A'
  ],
  'Check Point Avanan': [
    // description
    'Prevent Phishing before the Inbox with Email Security from Check Point',
    // website
    'https://www.avanan.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    'Requires you to talk to a sales team',
    // storage
    'Requires 3rd party',
    // attachment_limit
    'Unknown',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Requires 3rd party',
    // imap
    'Requires 3rd party',
    // pop3
    'Requires 3rd party',
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/avanan.com/1723146216">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/avanan.com/2910900/">76/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/avanan.com/1308639/">77/100</a>',
    // ssl_labs
    'A+'
  ],
  Heimdal: [
    // description
    'One Platform. Total Security.',
    // website
    'https://heimdalsecurity.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    'Requires you to talk to a sales team',
    // storage
    'Requires 3rd party',
    // attachment_limit
    'Unknown',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Requires 3rd party',
    // imap
    'Requires 3rd party',
    // pop3
    'Requires 3rd party',
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/heimdalsecurity.com/1723146419">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/heimdalsecurity.com/2910906/">79/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/heimdalsecurity.com/1308647/">65/100</a>',
    // ssl_labs
    'A+'
  ],
  Altospam: [
    // description
    'Antispam, Antivirus & Anti-Phishing Software',
    // website
    'https://www.altospam.com/en/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    'Requires you to talk to a sales team',
    // storage
    'Requires 3rd party',
    // attachment_limit
    'Unknown',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Requires 3rd party',
    // imap
    'Requires 3rd party',
    // pop3
    'Requires 3rd party',
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/altospam.com/1723146088">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/altospam.com/2910901/">97/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/altospam.com/1308643/">85/100</a>',
    // ssl_labs
    'A+'
  ],
  Mailinblack: [
    // description
    'Your cybersecurity is our job',
    // website
    'https://www.mailinblack.com/en/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    'Requires you to talk to a sales team',
    // storage
    'Requires 3rd party',
    // attachment_limit
    'Unknown',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Requires 3rd party',
    // imap
    'Requires 3rd party',
    // pop3
    'Requires 3rd party',
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/mailinblack.com/1723146261">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/mailinblack.com/2910902/">45/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/mailinblack.com/1308641/">48/100</a>',
    // ssl_labs
    'B'
  ],
  Egress: [
    // description
    'Stop more advanced phishing attacks',
    // website
    'https://www.egress.com/',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    'Requires you to talk to a sales team',
    // storage
    'Requires 3rd party',
    // attachment_limit
    'Unknown',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Requires 3rd party',
    // imap
    'Requires 3rd party',
    // pop3
    'Requires 3rd party',
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/egress.com/1723146158">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/egress.com/2910903/">49/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/egress.com/1308642/">61/100</a>',
    // ssl_labs
    'A'
  ],
  'Spam Scanner': [
    // description
    'Spam Scanner is the best anti-spam, email filtering, and phishing prevention service',
    // website
    'https://spamscanner.net',
    // oss
    false,
    // sandboxed
    false,
    // tti
    false,
    // pricing
    'Free (built-in to <a href="https://forwardemail.net">Forward Email</a>)',
    // storage
    'Requires 3rd party',
    // attachment_limit
    'Unknown',
    // unlimited_domains
    false,
    // unlimited_aliases
    false,
    // smtp
    'Requires 3rd party',
    // imap
    'Requires 3rd party',
    // pop3
    'Requires 3rd party',
    // api
    true,
    // e2ee
    false,
    // openpgp
    false,
    // wkd
    false,
    // hardenize (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://www.hardenize.com/report/spamscanner.net/1723146305">Fail</a>',
    // internetnl_site (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/site/spamscanner.net/2910904/">52/100</a>',
    // internetnl_mail (on root domain)
    '<a target="_blank" rel="noopener noreferrer" href="https://internet.nl/mail/spamscanner.net/1308645/">65/100</a>',
    // ssl_labs
    'A'
  ]
};

let alternatives = [];
for (const name of Object.keys(obj)) {
  const [
    description,
    website,
    oss,
    sandboxed,
    tti,
    pricing,
    storage,
    attachment_limit,
    unlimited_domains,
    unlimited_aliases,
    smtp,
    imap,
    pop3,
    api,
    e2ee,
    openpgp,
    wkd,
    hardenize,
    internetnl_site,
    internetnl_mail,
    ssl_labs
  ] = obj[name];

  const img = `img/alternatives/${slug(name)}.webp`;
  const root_domain = parseRootDomain(website);

  const hardenize_href = parse(hardenize)
    .querySelector('a')
    .getAttribute('href');
  const hardenize_pass =
    parse(hardenize).querySelector('a').innerHTML === 'Pass';

  const internetnl_site_href = parse(internetnl_site)
    .querySelector('a')
    .getAttribute('href');
  const internetnl_site_value = Number.parseInt(
    parse(internetnl_site).querySelector('a').innerHTML.split('/')[0],
    10
  );

  const internetnl_mail_href = parse(internetnl_mail)
    .querySelector('a')
    .getAttribute('href');
  const internetnl_mail_value = Number.parseInt(
    parse(internetnl_mail).querySelector('a').innerHTML.split('/')[0],
    10
  );

  alternatives.push({
    name,
    description,
    website,
    oss,
    sandboxed,
    tti,
    pricing,
    storage,
    attachment_limit,
    unlimited_domains,
    unlimited_aliases,
    smtp,
    imap,
    pop3,
    api,
    e2ee,
    openpgp,
    wkd,
    hardenize,
    internetnl_site,
    internetnl_mail,
    ssl_labs,
    img,
    root_domain,
    hardenize_href,
    hardenize_pass,
    internetnl_site_href,
    internetnl_site_value,
    internetnl_mail_href,
    internetnl_mail_value,
    slug: slug(name)
  });
}

//
// only run puppeteer if we're on the web server
//
if (
  env.NODE_ENV !== 'test' &&
  (env.NODE_ENV !== 'production' || env.WEB_HOST === os.hostname())
) {
  (async () => {
    let browser;
    try {
      browser = await puppeteer.launch();

      for (const a of alternatives) {
        // name, description, pricing, storage (string)
        for (const k of ['name', 'description', 'pricing', 'storage']) {
          if (!isSANB(a[k]) && typeof a[k] !== 'boolean')
            throw new Error(`${JSON.stringify(a)} missing "${k}"`);
        }

        // website (url)
        if (!isURL(a.website)) throw new Error(`${a.name} missing "website"`);

        // screenshot (valid image path)
        const p = path.join(
          __dirname,
          '..',
          'assets',
          'img',
          'alternatives',
          `${slug(a.name)}.webp`
        );
        if (!fs.existsSync(p)) {
          const err = new TypeError(
            `${a.name} missing valid "screenshot" at ${p}`
          );
          err.isCodeBug = true;
          logger.fatal(err);

          const page = await browser.newPage();

          // <https://www.useragents.me/>
          const customUserAgent =
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.1';

          await page.setUserAgent(customUserAgent);

          await page.setViewport({
            width: 1366,
            height: 768,
            deviceScaleFactor: 2
          });

          await page.goto(a.website);
          try {
            await page.screenshot({
              path: p
            });
          } catch (err) {
            err.isCodeBug = true;
            logger.fatal(err);
          }

          // <https://stackoverflow.com/a/76505750>

          await page.close();
        }

        // unlimited_domains, unlimited_aliases, smtp, imap, pop3, api, openpgp, wkd (boolean | string)
        for (const k of [
          'unlimited_domains',
          'unlimited_aliases',
          'smtp',
          'imap',
          'pop3',
          'api',
          'e2ee',
          'openpgp',
          'wkd',
          'hardenize',
          'internetnl_site',
          'internetnl_mail',
          'ssl_labs'
        ]) {
          if (!isSANB(a[k]) && typeof a[k] !== 'boolean')
            throw new Error(
              `${a.name} missing valid string or boolean for "${k}"`
            );
        }
      }
    } catch (err) {
      err.isCodeBug = true;
      logger.fatal(err);
    }

    if (browser) {
      try {
        // <https://stackoverflow.com/a/76505750>

        const pages = await browser.pages();
        for (const page of pages) {
          await page.close();
        }

        await browser.close();
      } catch (err) {
        err.isCodeBug = true;
        logger.fatal(err);
      }
    }
  })();
}

// add points
alternatives = alternatives.map((a) => {
  // rudimentary point system
  let points = 100;
  if (a.name === 'Forward Email') points += 10000000;
  for (const k of ['smtp', 'imap', 'pop3', 'api', 'tti', 'oss']) {
    const v = a[k];
    if (typeof v === 'boolean') points += v ? 20 : -20;
    else if (typeof v === 'string') points += isURL(v) ? 20 : 1;
  }

  for (const k of ['e2ee', 'unlimited_domains', 'unlimited_aliases', 'wkd']) {
    const v = a[k];
    if (typeof v === 'boolean') points += v ? 10 : -10;
    else if (typeof v === 'string') points += isURL(v) ? 10 : 1;
  }

  // storage (we could use bytes conversion for points but would need to convert to a scale)
  points += a.storage === false ? -10 : 10;

  // attachment_limit (we could use bytes conversion for points but would need to convert to a scale)
  points += a.attachment_limit === false ? -10 : 10;

  a.points = points;

  return a;
});

// sort alternatives
alternatives = _.sortBy(alternatives, 'points').reverse();

module.exports = alternatives;
