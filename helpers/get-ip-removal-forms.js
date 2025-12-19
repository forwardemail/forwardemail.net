/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const RE2 = require('re2');

//
// IP address regex pattern for parsing from error messages
//
const IP_REGEX = new RE2(
  /\b(?:25[0-5]|2[0-4]\d|1?\d{1,2})(?:\.(?:25[0-5]|2[0-4]\d|1?\d{1,2})){3}\b/
);

//
// Mapping of truth sources to their IP removal form URLs and contact information
// This is used by the blocklist-digest job to provide actionable removal links
//
// NOTE: Some providers do not have public removal forms and require
//       contacting support directly or waiting for automatic delisting
//
const IP_REMOVAL_FORMS = {
  // Google
  'google.com': {
    name: 'Google/Gmail',
    url: 'https://support.google.com/mail/contact/bulk_send_new',
    notes: 'Submit bulk sender contact form'
  },

  // Microsoft
  'mx.microsoft': {
    name: 'Microsoft',
    url: 'https://sender.office.com',
    notes: 'Office 365 IP delist portal'
  },
  'office.com': {
    name: 'Microsoft Office 365',
    url: 'https://sender.office.com',
    notes: 'Office 365 IP delist portal'
  },
  'outlook.com': {
    name: 'Microsoft Outlook',
    url: 'https://sender.office.com',
    notes: 'Office 365 IP delist portal'
  },
  'windows.com': {
    name: 'Microsoft Windows',
    url: 'https://sender.office.com',
    notes: 'Office 365 IP delist portal'
  },

  // Yahoo/AOL/Verizon
  'yahoodns.net': {
    name: 'Yahoo/AOL/Verizon',
    url: 'https://senders.yahooinc.com/',
    notes: 'Yahoo Sender Hub - also check Spamhaus'
  },

  // Apple/iCloud
  'apple.com': {
    name: 'Apple',
    url: 'https://ipcheck.proofpoint.com/',
    notes: 'Apple uses Proofpoint for IP reputation'
  },
  'icloud.com': {
    name: 'iCloud',
    url: 'https://ipcheck.proofpoint.com/',
    notes: 'iCloud uses Proofpoint for IP reputation'
  },

  // Proofpoint
  'pphosted.com': {
    name: 'Proofpoint',
    url: 'https://ipcheck.proofpoint.com/',
    notes: 'Proofpoint IP check and removal'
  },

  // Barracuda
  'barracudanetworks.com': {
    name: 'Barracuda Networks',
    url: 'https://www.barracudacentral.org/lookups/lookup-reputation',
    notes: 'Barracuda reputation lookup and removal'
  },

  // Cloudmark
  'cloudmark.com': {
    name: 'Cloudmark',
    url: 'https://csi.cloudmark.com/en/reset/',
    notes: 'Cloudmark CSI reset request'
  },

  // GoDaddy/SecureServer
  'secureserver.net': {
    name: 'GoDaddy/SecureServer',
    url: 'https://unblock.secureserver.net',
    notes: 'GoDaddy IP unblock request form'
  },

  // Comcast/Xfinity
  'comcast.net': {
    name: 'Comcast/Xfinity',
    url: 'https://spa.xfinity.com/report',
    notes: 'Comcast IP removal request'
  },

  // Charter/Spectrum
  'charter.net': {
    name: 'Charter/Spectrum',
    url: 'https://www.spectrum.net/support/internet/understanding-email-error-codes',
    notes: 'Contact Spectrum support for removal'
  },
  'rr.com': {
    name: 'Road Runner (Spectrum)',
    url: 'https://www.spectrum.net/support/internet/understanding-email-error-codes',
    notes: 'Contact Spectrum support for removal'
  },

  // T-Online (German)
  't-online.de': {
    name: 'T-Online (Germany)',
    url: 'https://postmaster.t-online.de/kontakt.en.php',
    contact: 'tobr@rx.t-online.de',
    notes: 'Email tobr@rx.t-online.de for removal'
  },

  // Orange France
  'orange.fr': {
    name: 'Orange France',
    url: 'https://postmaster.orange.fr/',
    contact: 'abuse@orange.fr',
    notes: 'Use contact form or email abuse@orange.fr'
  },

  // GMX
  'gmx.net': {
    name: 'GMX',
    url: 'https://postmaster.gmx.net/en/contact',
    notes: 'GMX postmaster contact form'
  },

  // Mail.ru
  'mail.ru': {
    name: 'Mail.ru',
    url: 'https://postmaster.mail.ru/',
    contact: 'postmaster@corp.mail.ru',
    notes: 'Mail.ru postmaster portal'
  },

  // Yandex
  'yandex.ru': {
    name: 'Yandex',
    url: 'https://postmaster.yandex.ru/',
    notes: 'Yandex postmaster portal'
  },

  // QQ/Tencent
  'qq.com': {
    name: 'QQ Mail (Tencent)',
    url: 'https://open.mail.qq.com/',
    contact: 'service@mail.qq.com',
    notes: 'QQ Mail whitelist application (Chinese)'
  },

  // Netease (163.com)
  'netease.com': {
    name: 'Netease (163.com)',
    url: 'https://mail.163.com/postmaster/',
    contact: 'service@163.com',
    notes: 'Netease postmaster portal'
  },

  // Alibaba/Aliyun
  'alibaba.com': {
    name: 'Alibaba',
    url: 'https://www.alibabacloud.com/help/en/alibaba-mail/',
    notes: 'Contact via Alibaba Cloud console'
  },
  'aliyun.com': {
    name: 'Aliyun',
    url: 'https://www.alibabacloud.com/help/en/alibaba-mail/',
    notes: 'Contact via Alibaba Cloud console'
  },
  'mxhichina.com': {
    name: 'Alibaba Mail (HiChina)',
    url: 'https://www.alibabacloud.com/help/en/alibaba-mail/',
    notes: 'Contact via Alibaba Cloud console'
  },

  // Amazon
  'amazon.com': {
    name: 'Amazon',
    url: 'https://aws.amazon.com/ses/',
    notes: 'Contact AWS support'
  },
  'amazonses.com': {
    name: 'Amazon SES',
    url: 'https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html',
    notes: 'AWS SES console > Blacklist Removal'
  },

  // SendGrid
  'sendgrid.net': {
    name: 'SendGrid',
    url: 'https://support.sendgrid.com/',
    notes: 'Contact SendGrid support'
  },

  // Mimecast
  'mimecast.com': {
    name: 'Mimecast',
    url: 'https://community.mimecast.com/',
    notes: 'Uses third-party RBLs - contact specific RBL'
  },

  // Fastmail
  'messagingengine.com': {
    name: 'Fastmail',
    url: 'https://www.fastmail.com/support/',
    notes: 'Contact Fastmail support'
  },

  // Zoho
  'zoho.com': {
    name: 'Zoho',
    url: 'https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address',
    contact: 'support@zohomail.com',
    notes: 'Contact Zoho support'
  },
  'zoho.eu': {
    name: 'Zoho EU',
    url: 'https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address',
    contact: 'support@zohomail.com',
    notes: 'Contact Zoho support'
  },
  'zoho.in': {
    name: 'Zoho India',
    url: 'https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address',
    contact: 'support@zohomail.com',
    notes: 'Contact Zoho support'
  },

  // ProtonMail
  'protonmail.ch': {
    name: 'ProtonMail',
    url: 'https://proton.me/support/contact',
    notes: 'Contact Proton support'
  },

  // Tutanota
  'tutanota.de': {
    name: 'Tutanota',
    url: 'https://tutanota.com/support',
    contact: 'support@tutao.de',
    notes: 'Contact Tutanota support'
  },

  // Facebook/WhatsApp
  'facebook.com': {
    name: 'Facebook',
    url: 'https://www.facebook.com/business/help',
    notes: 'Contact Facebook business support'
  },
  'facebook.net': {
    name: 'Facebook',
    url: 'https://www.facebook.com/business/help',
    notes: 'Contact Facebook business support'
  },
  'whatsapp.net': {
    name: 'WhatsApp',
    url: 'https://www.whatsapp.com/contact',
    notes: 'Contact WhatsApp support'
  },

  // LinkedIn
  'linkedin.com': {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/help/linkedin',
    notes: 'Contact LinkedIn support'
  },

  // Groups.io
  'groups.io': {
    name: 'Groups.io',
    url: 'https://groups.io/helpcenter',
    notes: 'Contact Groups.io support'
  },

  // Hushmail
  'hushmail.com': {
    name: 'Hushmail',
    url: 'https://www.hushmail.com/support/',
    notes: 'Contact Hushmail support'
  },

  // Mailbox.org
  'mailbox.org': {
    name: 'Mailbox.org',
    url: 'https://mailbox.org/en/support',
    notes: 'Contact Mailbox.org support'
  },

  // Posteo
  'posteo.de': {
    name: 'Posteo',
    url: 'https://posteo.de/en/site/contact',
    notes: 'Contact Posteo support'
  },

  // Duck.com (DuckDuckGo)
  'duck.com': {
    name: 'DuckDuckGo Email',
    url: 'https://duckduckgo.com/email/support',
    notes: 'Contact DuckDuckGo support'
  },

  // Sonic.net
  'sonic.net': {
    name: 'Sonic.net',
    url: 'https://www.sonic.com/support',
    notes: 'Contact Sonic support'
  },

  // Telus
  'telus.com': {
    name: 'Telus',
    url: 'https://www.telus.com/en/support',
    notes: 'Contact Telus support'
  },

  // Vodafone
  'vodafonemail.de': {
    name: 'Vodafone Germany',
    url: 'https://www.vodafone.de/hilfe/',
    notes: 'Contact Vodafone support'
  },

  // CenturyLink
  'centurylink.net': {
    name: 'CenturyLink/Lumen',
    url: 'https://www.lumen.com/en-us/contact-us.html',
    contact: 'abuse@centurylink.com',
    notes: 'Uses Cloudfilter - email abuse@centurylink.com'
  },

  // Windstream
  'windstream.net': {
    name: 'Windstream',
    url: 'https://www.windstream.com/support',
    contact: 'abuse@windstream.net',
    notes: 'Email abuse@windstream.net'
  },

  // Xtra (Spark NZ)
  'xtra.co.nz': {
    name: 'Xtra (Spark NZ)',
    url: 'https://www.spark.co.nz/help/',
    notes: 'Contact Spark NZ support'
  },

  // UOL/BOL (Brazil)
  'uol.com.br': {
    name: 'UOL (Brazil)',
    url: 'https://ajuda.uol.com.br/',
    notes: 'Contact UOL support (Portuguese)'
  },
  'bol.com.br': {
    name: 'BOL (Brazil)',
    url: 'https://ajuda.uol.com.br/',
    notes: 'Contact UOL support (Portuguese)'
  },

  // Libero (Italy)
  'libero.it': {
    name: 'Libero (Italy)',
    url: 'https://aiuto.libero.it/',
    notes: 'Contact Libero support (Italian)'
  },

  // Telenet (Belgium)
  'telenet-ops.be': {
    name: 'Telenet (Belgium)',
    url: 'https://www2.telenet.be/en/support/',
    notes: 'Contact Telenet support'
  },

  // Antispamcloud (SpamExperts)
  'antispamcloud.com': {
    name: 'SpamExperts/Antispamcloud',
    url: 'https://www.spamexperts.com/',
    notes: 'Contact via hosting provider'
  },

  // Cloudflare Email Security
  'cf-emailsecurity.net': {
    name: 'Cloudflare Email Security',
    url: 'https://www.cloudflare.com/products/zero-trust/email-security/',
    notes: 'Contact Cloudflare support'
  },

  // Expurgate (Hornetsecurity)
  'expurgate.net': {
    name: 'Hornetsecurity/Expurgate',
    url: 'https://www.hornetsecurity.com/',
    notes: 'Contact Hornetsecurity support'
  },

  // Earthlink/Vade Secure
  'earthlink-vadesecure.net': {
    name: 'Earthlink/Vade Secure',
    url: 'https://sendertool.vadesecure.com/en/',
    notes: 'Vade Secure sender tool'
  },

  // AV-MX
  'av-mx.com': {
    name: 'AV-MX',
    url: null,
    notes: 'Contact via hosting provider'
  },

  // Hostedemail
  'hostedemail.com': {
    name: 'Hostedemail',
    url: null,
    notes: 'Contact via hosting provider'
  },

  // Mail2World
  'mail2world.com': {
    name: 'Mail2World',
    url: 'https://www.mail2world.com/support/',
    notes: 'Contact Mail2World support'
  },

  // Openwave
  'openwave.ai': {
    name: 'Openwave',
    url: null,
    notes: 'Contact via hosting provider'
  },

  // Pangia
  'pangia.biz': {
    name: 'Pangia',
    url: null,
    notes: 'Contact via hosting provider'
  },

  // Spamfiltering.io
  'spamfiltering.io': {
    name: 'Spamfiltering.io',
    url: null,
    notes: 'Contact via hosting provider'
  },

  // Spamfri (Denmark)
  'spamfri.dk': {
    name: 'Spamfri (Denmark)',
    url: null,
    notes: 'Contact via hosting provider'
  }
};

/**
 * Get IP removal form information for a given truth source
 * @param {string} truthSource - The truth source domain (e.g., 'google.com')
 * @returns {object|null} - IP removal form info or null if not found
 */
function getIpRemovalForm(truthSource) {
  if (!truthSource || typeof truthSource !== 'string') return null;
  const normalized = truthSource.toLowerCase().trim();
  return IP_REMOVAL_FORMS[normalized] || null;
}

/**
 * Parse IP address from error response or message
 * @param {string} text - Error response or message text
 * @returns {string|null} - Parsed IP address or null
 */
function parseIpFromError(text) {
  if (!text || typeof text !== 'string') return null;
  const match = IP_REGEX.exec(text);
  return match ? match[0] : null;
}

/**
 * Get all IP removal forms as an array for documentation
 * @returns {Array} - Array of IP removal form objects with truthSource key
 */
function getAllIpRemovalForms() {
  return Object.entries(IP_REMOVAL_FORMS).map(([truthSource, info]) => ({
    truthSource,
    ...info
  }));
}

module.exports = {
  IP_REMOVAL_FORMS,
  getIpRemovalForm,
  parseIpFromError,
  getAllIpRemovalForms
};
