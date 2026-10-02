/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const punycode = require('node:punycode');

const Axe = require('axe');
const Boom = require('@hapi/boom');
const bytes = require('@forwardemail/bytes');
const consolidate = require('@ladjs/consolidate');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const manifestRev = require('manifest-rev');
const ms = require('ms');
const nodemailer = require('nodemailer');
const tlds = require('tlds');
const splitLines = require('split-lines');
const { Iconv } = require('iconv');
const { boolean } = require('boolean');

const noReplyList = require('reserved-email-addresses-list/no-reply-list.json');

const pkg = require('../package');
const env = require('./env');

//
// NOTE: the pug filters (config/filters.js) pull in the markdown renderer and
//       its own i18n instance, about 170 MB of heap. Every process that reads
//       #config paid for it, including each of the ~50 bree job workers that
//       never render markdown, which is how starting the jobs together ran the
//       host out of memory. Load it on first use instead.
//
let loadedFilters;
const filters = {
  md(...args) {
    if (!loadedFilters) loadedFilters = require('./filters');
    return loadedFilters.md(...args);
  }
};
const i18n = require('./i18n');
const loggerConfig = require('./logger');
const meta = require('./meta');
const phrases = require('./phrases');
const utilities = require('./utilities');
const payments = require('./payments');
const metaConfig = require('./meta-config');
const alternatives = require('./alternatives');
const _ = require('#helpers/lodash');
const getIpBucket = require('#helpers/get-ip-bucket');

let zxcvbn;

const brandAndCorporateDomains = [
  'aaa',
  'aarp',
  'abarth',
  'abb',
  'abbott',
  'abbvie',
  'abc',
  'accenture',
  'aco',
  'aeg',
  'aetna',
  'afl',
  'agakhan',
  'aig',
  'aigo',
  'airbus',
  'airtel',
  'akdn',
  'alfaromeo',
  'alibaba',
  'alipay',
  'allfinanz',
  'allstate',
  'ally',
  'alstom',
  'amazon',
  'americanexpress',
  'amex',
  'amica',
  'android',
  'anz',
  'aol',
  'apple',
  'aquarelle',
  'aramco',
  'audi',
  'auspost',
  'aws',
  'axa',
  'azure',
  'baidu',
  'bananarepublic',
  'barclaycard',
  'barclays',
  'basketball',
  'bauhaus',
  'bbc',
  'bbt',
  'bbva',
  'bcg',
  'bentley',
  'bharti',
  'bing',
  'blanco',
  'bloomberg',
  'bms',
  'bmw',
  'bnl',
  'bnpparibas',
  'boehringer',
  // 'bond',
  'booking',
  'bosch',
  'bostik',
  'bradesco',
  'bridgestone',
  'brother',
  'bugatti',
  'cal',
  'calvinklein',
  'canon',
  'capitalone',
  'caravan',
  'cartier',
  'cba',
  'cbn',
  'cbre',
  'cbs',
  'cern',
  'cfa',
  'chanel',
  'chase',
  'chintai',
  'chrome',
  'chrysler',
  'cipriani',
  'cisco',
  'citadel',
  'citi',
  'citic',
  'clubmed',
  'comcast',
  'commbank',
  'creditunion',
  'crown',
  'crs',
  'csc',
  'cuisinella',
  'dabur',
  'datsun',
  'dealer',
  'dell',
  'deloitte',
  'delta',
  'dhl',
  'discover',
  'dish',
  'dnp',
  'dodge',
  'dunlop',
  'dupont',
  'dvag',
  'edeka',
  'emerck',
  'epson',
  'ericsson',
  'erni',
  'esurance',
  'etisalat',
  'eurovision',
  'everbank',
  'extraspace',
  'fage',
  'fairwinds',
  'farmers',
  'fedex',
  'ferrari',
  'ferrero',
  'fiat',
  'fidelity',
  'firestone',
  'firmdale',
  'flickr',
  'flir',
  'flsmidth',
  'ford',
  'fox',
  'fresenius',
  'forex',
  'frogans',
  'frontier',
  'fujitsu',
  'fujixerox',
  'gallo',
  'gallup',
  'gap',
  'gbiz',
  'gea',
  'genting',
  'giving',
  'gle',
  'globo',
  'gmail',
  'gmo',
  'gmx',
  'godaddy',
  'goldpoint',
  'goodyear',
  'goog',
  'google',
  'grainger',
  'guardian',
  'gucci',
  'hbo',
  'hdfc',
  'hdfcbank',
  'hermes',
  'hisamitsu',
  'hitachi',
  'hkt',
  'honda',
  'honeywell',
  'hotmail',
  'hsbc',
  'hughes',
  'hyatt',
  'hyundai',
  'ibm',
  'ieee',
  'ifm',
  'ikano',
  'imdb',
  'infiniti',
  'intel',
  'intuit',
  'ipiranga',
  'iselect',
  'itau',
  'itv',
  'iveco',
  'jaguar',
  'java',
  'jcb',
  'jcp',
  'jeep',
  'jpmorgan',
  'juniper',
  'kddi',
  'kerryhotels',
  'kerrylogistics',
  'kerryproperties',
  'kfh',
  'kia',
  'kinder',
  'kindle',
  'komatsu',
  'kpmg',
  'kred',
  'kuokgroup',
  'lacaixa',
  'ladbrokes',
  'lamborghini',
  'lancaster',
  'lancia',
  'lancome',
  'landrover',
  'lanxess',
  'lasalle',
  'latrobe',
  'lds',
  'leclerc',
  'lego',
  'liaison',
  'lexus',
  'lidl',
  'lifestyle',
  'lilly',
  'lincoln',
  'linde',
  'lipsy',
  'lixil',
  'locus',
  'lotte',
  'lpl',
  'lplfinancial',
  'lundbeck',
  'lupin',
  'macys',
  'maif',
  'man',
  'mango',
  'marriott',
  'maserati',
  'mattel',
  'mckinsey',
  'metlife',
  'microsoft',
  'mini',
  'mit',
  'mitsubishi',
  'mlb',
  'mma',
  'monash',
  'mormon',
  'moto',
  'movistar',
  'msd',
  'mtn',
  'mtr',
  'mutual',
  'nadex',
  'nationwide',
  'natura',
  'nba',
  'nec',
  'netflix',
  'neustar',
  'newholland',
  'nfl',
  'nhk',
  'nico',
  'nike',
  'nikon',
  'nissan',
  'nissay',
  'nokia',
  'northwesternmutual',
  'norton',
  'nra',
  'ntt',
  'obi',
  'office',
  'omega',
  'oracle',
  'orange',
  'otsuka',
  // 'ovh',
  'panasonic',
  'pccw',
  'pfizer',
  'philips',
  'piaget',
  'pictet',
  'ping',
  'pioneer',
  'play',
  'playstation',
  'pohl',
  'politie',
  'praxi',
  'prod',
  'progressive',
  'pru',
  'prudential',
  'pwc',
  // 'quest',
  'qvc',
  'redstone',
  'reliance',
  'rexroth',
  'ricoh',
  'rmit',
  'rocher',
  'rogers',
  'rwe',
  'safety',
  'sakura',
  'samsung',
  'sandvik',
  'sandvikcoromant',
  'sanofi',
  'sap',
  'saxo',
  'sbi',
  // 'sbs',
  'sca',
  'scb',
  'schaeffler',
  'schmidt',
  'schwarz',
  'scjohnson',
  'scor',
  'seat',
  'sener',
  'ses',
  'sew',
  'seven',
  'sfr',
  'seek',
  'shangrila',
  'sharp',
  'shaw',
  'shell',
  'shriram',
  'sina',
  'sky',
  'skype',
  'smart',
  'sncf',
  'softbank',
  'sohu',
  'sony',
  'spiegel',
  'stada',
  'staples',
  'star',
  'starhub',
  'statebank',
  'statefarm',
  'statoil',
  'stc',
  'stcgroup',
  'suzuki',
  'swatch',
  'swiftcover',
  'symantec',
  'taobao',
  'target',
  'tatamotors',
  'tdk',
  'telecity',
  'telefonica',
  'temasek',
  'teva',
  'tiffany',
  'tjx',
  'toray',
  'toshiba',
  'total',
  'toyota',
  'travelchannel',
  'travelers',
  'tui',
  'tvs',
  'ubs',
  'unicom',
  'uol',
  'ups',
  'vanguard',
  'verisign',
  'vig',
  'viking',
  'virgin',
  'visa',
  'vista',
  'vistaprint',
  'vivo',
  'volkswagen',
  'volvo',
  'walmart',
  'walter',
  'weatherchannel',
  'weber',
  'weir',
  'williamhill',
  'windows',
  'wme',
  'wolterskluwer',
  'woodside',
  'wtc',
  'xbox',
  'xerox',
  'xfinity',
  'yahoo',
  'yamaxun',
  'yandex',
  'yodobashi',
  'youtube',
  'zappos',
  'zara',
  'zippo'
];

// now we can set up imap clients for all providers and get their values all at once
const imapConfigurations = [];

// Forward Email
if (env.TTI_FE_IMAP_USER && env.TTI_FE_IMAP_PASS)
  imapConfigurations.push({
    name: 'Forward Email',
    forwarder: env.TTI_FE_FORWARDER,
    config: {
      host: 'imap.forwardemail.net',
      port: 993,
      secure: true,
      auth: {
        user: env.TTI_FE_IMAP_USER,
        pass: env.TTI_FE_IMAP_PASS
      }
    }
  });

// Gmail
// <https://support.google.com/mail/answer/7126229?hl=en>
if (env.TTI_GMAIL_IMAP_USER && env.TTI_GMAIL_IMAP_PASS)
  imapConfigurations.push({
    name: 'Gmail',
    forwarder: env.TTI_GMAIL_FORWARDER,
    config: {
      host: 'imap.gmail.com',
      port: 993,
      secure: true,
      auth: {
        user: env.TTI_GMAIL_IMAP_USER,
        pass: env.TTI_GMAIL_IMAP_PASS
      }
    }
  });

// Microsoft Outlook/Hotmail
// <https://support.microsoft.com/en-us/office/pop-imap-and-smtp-settings-8361e398-8af4-4e97-b147-6c6c4ac95353>
//
// NOTE: temporarily removing because Outlook is trash, their captcha codes nonsense, blocking VPN, slow to load, and blocking valid logins
//
if (env.TTI_OUTLOOK_IMAP_USER && env.TTI_OUTLOOK_IMAP_PASS)
  imapConfigurations.push({
    name: 'Outlook/Hotmail',
    forwarder: env.TTI_OUTLOOK_FORWARDER,
    config: {
      host:
        typeof env.TTI_OUTLOOK_IMAP_USER === 'string' &&
        env.TTI_OUTLOOK_IMAP_USER.endsWith('@hotmail.com')
          ? 'imap-mail.outlook.com'
          : 'outlook.office365.com',
      port: 993,
      secure: true,
      auth: {
        user: env.TTI_OUTLOOK_IMAP_USER,
        pass: env.TTI_OUTLOOK_IMAP_PASS
      }
    }
  });

// iCloud/Me
// <https://support.apple.com/en-us/102525>
if (env.TTI_APPLE_IMAP_USER && env.TTI_APPLE_IMAP_PASS)
  imapConfigurations.push({
    name: 'Apple iCloud',
    forwarder: env.TTI_APPLE_FORWARDER,
    config: {
      host: 'imap.mail.me.com',
      port: 993,
      secure: true,
      auth: {
        user: env.TTI_APPLE_IMAP_USER,
        pass: env.TTI_APPLE_IMAP_PASS
      }
    }
  });

// NOTE: removing fastmail since it requires a paid account after 30d
// Fastmail
// <https://www.fastmail.help/hc/en-us/articles/1500000279921-IMAP-POP-and-SMTP>
if (env.TTI_FASTMAIL_IMAP_USER && env.TTI_FASTMAIL_IMAP_PASS)
  imapConfigurations.push({
    name: 'Fastmail',
    forwarder: env.TTI_FASTMAIL_FORWARDER,
    config: {
      host: 'imap.fastmail.com',
      port: 993,
      secure: true,
      auth: {
        user: env.TTI_FASTMAIL_IMAP_USER,
        pass: env.TTI_FASTMAIL_IMAP_PASS
      }
    }
  });

//
// NOTE: Yahoo didn't have App Passwords working in the past
//       therefore it previously wasn't possible to access Yahoo via IMAP
//       <https://old.reddit.com/r/yahoo/comments/v5hkc6/yahoo_mail_app_password_not_working/>
//       <https://archive.is/SPAAT>
//
// Yahoo/AOL
// <https://help.yahoo.com/kb/SLN4075.html>
if (env.TTI_YAHOO_IMAP_USER && env.TTI_YAHOO_IMAP_PASS)
  imapConfigurations.push({
    name: 'Yahoo/AOL',
    forwarder: env.TTI_YAHOO_FORWARDER,
    config: {
      host: 'imap.mail.yahoo.com',
      port: 993,
      secure: true,
      auth: {
        user: env.TTI_YAHOO_IMAP_USER,
        pass: env.TTI_YAHOO_IMAP_PASS
      }
    }
  });

const STRIPE_LOCALES = new Set([
  'bg',
  'cs',
  'da',
  'de',
  'el',
  'en',
  'en-GB',
  'es',
  'es-419',
  'et',
  'fi',
  'fil',
  'fr',
  'fr-CA',
  'hr',
  'hu',
  'id',
  'it',
  'ja',
  'ko',
  'lt',
  'lv',
  'ms',
  'mt',
  'nb',
  'nl',
  'pl',
  'pt',
  'pt-BR',
  'ro',
  'ru',
  'sk',
  'sl',
  'sv',
  'th',
  'tr',
  'vi',
  'zh',
  'zh-HK',
  'zh-TW'
]);

const POSTMASTER_USERNAMES = new Set([
  // <https://datatracker.ietf.org/doc/html/rfc5230#:~:text=Implementations%20are%20encouraged,are%20also%20suggested.>
  'automailer',
  'autoresponder',
  'bounce',
  'bounce-notification',
  'bounce-notifications',
  'bounces',
  'hostmaster',
  'listserv',
  'localhost',
  'mail-daemon',
  'mail.daemon',
  'maildaemon',
  'mailer-daemon',
  'mailer.daemon',
  'mailerdaemon',
  'majordomo',
  'postmaster',
  ...noReplyList
]);

// daily outbound SMTP threshold for new senders (first reputation tier)
const SMTP_LIMIT_MESSAGES = env.NODE_ENV === 'test' ? 100 : 300;
// first tier for senders on the Team plan (see `smtpTeamLimitMessages`)
const SMTP_TEAM_LIMIT_MESSAGES = env.NODE_ENV === 'test' ? 300 : 900;

const config = {
  ...metaConfig,

  optOutTemplates: [
    // 'dmarc-issue', // TODO: need to hook this in
    'daily-log-alert',
    'domain-configuration-issue',
    'domain-onboard',
    'domain-restrictions-reminder',
    'domain-verified',
    'feature-reminder',
    'forwarding-issue',
    'phishing-alert',
    'two-factor-reminder',
    'weekly-dmarc-report',
    'welcome'
  ],

  signatureData: {
    signingDomain: env.DKIM_DOMAIN_NAME,
    selector: env.DKIM_KEY_SELECTOR,
    privateKey: isSANB(env.DKIM_PRIVATE_KEY_PATH)
      ? fs.readFileSync(env.DKIM_PRIVATE_KEY_PATH, 'utf8')
      : isSANB(env.DKIM_PRIVATE_KEY_VALUE)
      ? // GitHub CI may convert \n to \\n in env var rendering
        splitLines(env.DKIM_PRIVATE_KEY_VALUE.replace(/\\n/g, '\n')).join('\n')
      : undefined,
    algorithm: 'rsa-sha256',
    canonicalization: 'relaxed/relaxed'
  },

  socketTimeout: ms('3m'),
  POSTMASTER_USERNAMES,
  ubuntuTeamMapping: {
    'ubuntu.com': '~ubuntumembers',
    'kubuntu.org': '~kubuntu-members',
    'lubuntu.me': '~lubuntu-members',
    'edubuntu.org': '~edubuntu-members',
    // not being used
    // 'ubuntustudio.com': '~ubuntustudio-core',
    'ubuntu.net': '~ubuntu-smtp-test'
  },
  LOCK_ERRORS: new Set([
    'SQLITE_BUSY',
    'SQLITE_BUSY_SNAPSHOT',
    'SQLITE_BUSY_RECOVERY',
    'SQLITE_BUSY_TIMEOUT',
    'SQLITE_LOCKED'
  ]),
  INITIAL_DB_SIZE: 352256,
  STRIPE_LOCALES,
  openPGPKey: '/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.asc',
  returnPath: 'fe-bounces',
  imapConfigurations: env.SELF_HOSTED ? [] : imapConfigurations,
  passkeyLimit: 30,
  IMAP_REDIS_CHANNEL_NAME: 'imap_events',
  WS_REDIS_CHANNEL_NAME: 'websocket_notifications',

  //
  // Push notification configuration
  // Used by helpers/send-push-notification.js for APNs, FCM, and UnifiedPush delivery
  //
  pushNotifications: {
    // APNs (Apple Push Notification service)
    apnsBundleId: env.APNS_BUNDLE_ID || 'net.forwardemail.mail',
    appleKeyId: env.APPLE_KEY_ID || '',
    appleTeamId: env.APPLE_TEAM_ID || '',
    appleKeyPath: env.APPLE_KEY_PATH || '',
    apnsProduction: boolean(env.APNS_PRODUCTION),
    // FCM (Firebase Cloud Messaging)
    fcmProjectId: env.FCM_PROJECT_ID || '',
    fcmServiceAccountPath: env.FCM_SERVICE_ACCOUNT_PATH || '',
    // UnifiedPush/Web Push encryption and application-server identity
    vapidSubject: env.VAPID_SUBJECT || '',
    vapidPublicKey: env.VAPID_PUBLIC_KEY || '',
    vapidPrivateKey: env.VAPID_PRIVATE_KEY || ''
  },

  WS_TRUST_PROXY: boolean(env.WS_TRUST_PROXY),

  srs: {
    separator: '=',
    secret: env.SRS_SECRET,
    // (in days, as `sender-rewriting-scheme` counts them)
    maxAge: 10
  },
  // replies relayed to an SRS address per destination of a message we
  // forwarded or sent (a delay notice and the final bounce from the
  // destination's server, and an auto-reply), see `helpers/srs-reverse`
  srsReverseRepliesPerDestination: 3,
  twilio: {
    accountSid: env.TWILIO_ACCOUNT_SID,
    authToken: env.TWILIO_AUTH_TOKEN,
    from: env.TWILIO_FROM_NUMBER,
    to: env.TWILIO_TO_NUMBER
  },
  smtpMessageMaxSize: env.SMTP_MESSAGE_MAX_SIZE,
  defaultModulusLength: 1024,
  defaultStoragePath: env.SQLITE_STORAGE_PATH,
  // 100 items (50 MB * 100 = 5000 MB = 5 GB)
  smtpMaxQueue: 100,
  // Reduced from 180s to 60s to prevent SMTP connections from holding
  // PQueue slots too long. Most legitimate servers respond within 30s.
  // Emails to very slow servers will retry on the next queue cycle.
  smtpQueueTimeout: ms('60s'),
  smtpLimitMessages: SMTP_LIMIT_MESSAGES,
  // senders on the Team plan start (and are never reset below) this daily
  // threshold instead of the first tier's, and move up from the first tier
  // above it (see `helpers/get-user-smtp-limit.js`)
  smtpTeamLimitMessages: SMTP_TEAM_LIMIT_MESSAGES,
  smtpLimitAuth: env.NODE_ENV === 'test' ? Number.MAX_VALUE : 10,
  smtpLimitAuthDuration: ms('1d'),
  smtpLimitDuration: ms('1d'),
  smtpLimitNamespace: `smtp_auth_limit_${env.NODE_ENV.toLowerCase()}`,

  //
  // Outbound SMTP is unlimited and reputation-based.
  //
  // Each sender has a daily threshold that grows with reputation.
  // New senders start on the first tier (`smtpLimitMessages`) and move up one
  // tier at a time once they have been paying without a break long enough, they
  // have enough clean sending days on the current tier, and they use
  // their threshold.
  // A bad sending day (high bounce/reject rate, or spam/virus verdicts from
  // truth sources at a rate of the recipients sent to) steps the sender down
  // one tier, and verdicts at a higher rate or a severe bounce/reject rate
  // reset them to the first tier (see below).  The
  // last tier is a soft ceiling: growth past it requires an admin to raise
  // the user's manual `smtp_limit`.
  //
  // (see `helpers/get-user-smtp-limit.js` and `helpers/update-smtp-reputation.js`)
  //
  // Only mail delivered to unique recipients outside the sender's own domains
  // counts toward moving up (so sending to yourself or test blasts earn
  // nothing), each recipient domain only counts up to a cap per day, and the
  // busiest day must also reach enough distinct recipient domains
  // (`minRecipientDomains`, so a catch-all on a throwaway domain cannot be
  // used to build reputation).
  //
  smtpReputationTiers: [
    {
      limit: SMTP_LIMIT_MESSAGES,
      minPaidDays: 0,
      minCleanDays: 0,
      minRecipientDomains: 0
    },
    { limit: 500, minPaidDays: 7, minCleanDays: 5, minRecipientDomains: 10 },
    { limit: 1000, minPaidDays: 14, minCleanDays: 7, minRecipientDomains: 20 },
    { limit: 2000, minPaidDays: 30, minCleanDays: 10, minRecipientDomains: 40 },
    { limit: 5000, minPaidDays: 60, minCleanDays: 14, minRecipientDomains: 75 },
    {
      limit: 10000,
      minPaidDays: 120,
      minCleanDays: 21,
      minRecipientDomains: 150
    }
  ],
  // minimum external messages sent in a day before its bounce/reject rate counts
  smtpReputationMinSample: 20,
  // bounce + reject rate at or above which a day counts against reputation
  smtpReputationMaxBadRate: 0.05,
  // busiest day in the lookback must reach this share of the threshold (in
  // qualifying recipients) to move up
  smtpReputationMinUtilization: 0.5,
  // most unique recipients one recipient root domain counts for in a day
  // (except mailbox providers' consumer domains, see below)
  smtpReputationMaxRecipientsPerDomain: 50,
  // qualifying recipients a day needs to count as a clean sending day
  smtpReputationMinCleanDayRecipients: 5,
  // (recipient domains are grouped by root domain, so subdomains of one
  // domain count as one, and mail to the sending domain or the sender's own
  // domains does not count)
  //
  // Mail accepted by truth sources is mail a large mailbox provider could
  // have reported, so at least this share of qualifying recipients must be
  // delivered to truth source mail servers (an attacker's own mail servers
  // cannot build reputation on their own)
  // (only applies when `TRUTH_SOURCES` is configured)
  smtpReputationMinTruthSourceShare: 0.2,
  //
  // Spam and virus verdicts from truth sources (large mailbox providers whose
  // mail servers are listed in `TRUTH_SOURCES`) are the authority on abuse,
  // and count as a rate of the recipients the sender sent to, like major
  // providers and ESPs do (Gmail asks senders to stay below 0.1% and never
  // reach 0.3%, Amazon SES reviews senders at 0.1% and pauses them at 0.5%,
  // Postmark allows 0.1%), with a minimum count, so a single detection (or a
  // rare false positive for a large sender) never demotes or resets anyone:
  // (only permanent 5xx verdicts about the message count)
  // - verdicts (for different recipients) in a day at or above
  //   `smtpReputationBadDayReportRate` of that day's recipients (and at
  //   least `smtpReputationBadDayReports`) make the day a bad day (down one
  //   tier), as do verdicts about members who borrowed a Team plan admin's
  //   threshold at that rate of the members' recipients (for the admin)
  // - verdicts at or above `smtpReputationTruthSourceStrikeRate` (and at
  //   least `smtpReputationTruthSourceStrikes`, one of them on a mailbox
  //   provider's own domain) reset the sender to the first tier and pause
  //   moving up for `smtpReputationHoldDays` (a minimum an admin approved
  //   does not apply while paused)
  // - the same verdicts within 24 hours (as a rate of the recipients outside
  //   the domain sent from in the last 24 hours) also do so at once while
  //   sending
  // (the counts needed are capped, so they stay reachable with the reports
  // kept on a user)
  //
  smtpReputationBadDayReports: 2,
  smtpReputationBadDayReportRate: 0.001,
  smtpReputationBadDayReportsMax: 25,
  smtpReputationTruthSourceStrikes: 3,
  smtpReputationTruthSourceStrikeRate: 0.003,
  smtpReputationTruthSourceStrikesMax: 50,
  smtpReputationHoldDays: 30,
  // a day where at least this multiple of the bad rate bounced or was
  // rejected (with enough external recipients) also resets the sender
  smtpReputationSevereBadRateMultiplier: 3,
  //
  // Mailbox providers' own consumer domains: reports and recipients there are
  // decided by the provider (a spam verdict cannot be configured by someone
  // else, and addresses cannot be created in bulk).  Mail to other domains
  // hosted by a truth source (e.g. a company's Google Workspace or Microsoft
  // 365 tenant, whose admins can reject mail as they like and create
  // addresses at will) counts once per root domain for reports, and is capped
  // per root domain for reputation.
  //
  smtpReputationConsumerDomains: new Set([
    'gmail.com',
    'googlemail.com',
    'outlook.com',
    'hotmail.com',
    'hotmail.co.uk',
    'hotmail.fr',
    'hotmail.de',
    'hotmail.it',
    'hotmail.es',
    'live.com',
    'live.co.uk',
    'live.fr',
    'msn.com',
    'yahoo.com',
    'yahoo.co.uk',
    'yahoo.fr',
    'yahoo.de',
    'yahoo.it',
    'yahoo.es',
    'yahoo.co.jp',
    'yahoo.com.br',
    'ymail.com',
    'rocketmail.com',
    'aol.com',
    'icloud.com',
    'me.com',
    'mac.com',
    'proton.me',
    'protonmail.com',
    'pm.me',
    'gmx.com',
    'gmx.de',
    'gmx.net',
    'web.de',
    'mail.com',
    'zoho.com',
    'yandex.ru',
    'yandex.com',
    'mail.ru',
    'qq.com',
    '163.com',
    '126.com',
    'naver.com',
    'daum.net',
    'orange.fr',
    'free.fr',
    'comcast.net',
    'att.net',
    'verizon.net'
  ]),
  smtpReputationLookbackDays: 7,
  // days to wait before evaluating a day (so delivery outcomes are known)
  smtpReputationEvaluationDelayDays: 2,
  // days of history the job evaluates for a user it has not evaluated yet
  // (or catches up on after missed runs); matches how long sent mail is kept
  smtpReputationBackfillDays: 30,
  // how often admins are alerted about a sender at the soft ceiling
  smtpReputationCeilingAlertInterval: ms('30d'),
  // gap between paid periods that still counts as paying without a break
  smtpReputationPaidGap: ms('14d'),

  //
  // Unusual sending pattern slowdown (see `helpers/check-smtp-velocity.js`)
  //
  // Regardless of threshold, a sender is slowed down (421) when:
  // - today's volume exceeds a multiple of their recent normal volume
  //   (busiest day in the baseline window), so dormant or long-standing
  //   senders cannot send far more than usual
  // - they send too much within an hour, compared to both today's allowance
  //   and their own busiest hour in the baseline window
  // - too many of their recent messages are waiting in the queue
  //
  // (the baseline window is long enough to include monthly newsletters)
  //
  smtpVelocityBaselineDays: 45,
  smtpVelocitySpikeMultiplier: 2,
  smtpVelocityHourlyShare: 0.25,
  // most of a day's allowance that can be sent within an hour, even for a
  // sender whose busiest hour was larger
  smtpVelocityMaxHourlyShare: 0.5,
  smtpVelocityBacklogShare: 0.1,
  // recipients (across all messages) a sender can reach in a day, as a
  // multiple of the day's allowance (a message can have many recipients)
  smtpVelocityRecipientsMultiplier: 2,
  // hard bounce/reject rate over recent hours at which sending is slowed down
  smtpVelocityBounceWindow: ms('6h'),
  smtpVelocityBounceMinSample: 50,
  smtpVelocityMaxBounceRate: 0.1,
  // days with a slowdown remembered (so they are not clean sending days)
  smtpVelocityThrottledDaysKept: 60,

  //
  // Account-wide threshold and domain ramp-up
  // (see `helpers/get-smtp-sending-limits.js`)
  //
  // A threshold covers all mail sent from every domain its account is an
  // admin of (so adding domains or members does not multiply it), and each
  // domain ramps up within it: a domain sends at most a multiple of its
  // busiest day of delivered mail in the baseline window (at least the
  // starting threshold), so a new domain cannot use an established account's
  // threshold at once
  //
  smtpDomainRampMultiplier: 2,
  // vacation and other auto-replies per user per day (they are sent on
  // behalf of the user but do not count toward their threshold)
  smtpAutoReplyDailyLimit: 300,
  // auto-replies any one address can get per day, across all users (so a
  // victim cannot be flooded through many aliases)
  smtpAutoReplyDailyLimitPerRecipient: 20,
  supportEmail: env.EMAIL_DEFAULT_FROM_EMAIL,
  alertsEmail: env.EMAIL_ALERTS_FROM_EMAIL,
  maxRecipients: env.MAX_RECIPIENTS,
  paidPrefix: `${env.TXT_RECORD_PREFIX}-site-verification=`,
  freePrefix: `${env.TXT_RECORD_PREFIX}=`,
  breeHost: env.BREE_HOST,
  webHost: env.WEB_HOST,
  // TODO: clean this config up everywhere for `previewEmailOptions`
  previewEmailOptions: {
    open: env.PREVIEW_EMAIL,
    openSimulator: false,
    simpleParser: {
      Iconv,
      skipHtmlToText: true,
      skipTextLinks: true,
      skipTextToHtml: true,
      skipImageLinks: true,
      maxHtmlLengthToParse: bytes(env.SMTP_MESSAGE_MAX_SIZE)
    },
    returnHTML: true
  },
  maxRetryDuration: ms('5d'),
  concurrency:
    env.NODE_ENV === 'test' || env.NODE_ENV === 'development'
      ? 1
      : os.cpus().length,

  //
  // since PayPal doesn't help and there's no way to block unverified PayPal accounts
  // (e.g. in the PayPal UI you can't block a contact that doesn't have a verified account; e.g. by email)
  //
  paypalPayerIdsBlocked: new Set(
    _.isArray(env.PAYPAL_PAYER_IDS_BLOCKED)
      ? env.PAYPAL_PAYER_IDS_BLOCKED.map((key) => key.trim())
      : isSANB(env.PAYPAL_PAYER_IDS_BLOCKED)
      ? env.PAYPAL_PAYER_IDS_BLOCKED.split(',').map((key) => key.trim())
      : []
  ),

  allowlist: new Set(
    _.isArray(env.ALLOWLIST)
      ? env.ALLOWLIST.map((key) => key.toLowerCase().trim())
      : isSANB(env.ALLOWLIST)
      ? env.ALLOWLIST.split(',').map((key) => key.toLowerCase().trim())
      : []
  ),

  ignoredSelfTestDomains: new Set(
    _.isArray(env.IGNORED_SELF_TEST_DOMAINS)
      ? env.IGNORED_SELF_TEST_DOMAINS.map((key) => key.toLowerCase().trim())
      : isSANB(env.IGNORED_SELF_TEST_DOMAINS)
      ? env.IGNORED_SELF_TEST_DOMAINS.split(',').map((key) =>
          key.toLowerCase().trim()
        )
      : []
  ),

  fingerprintPrefix: 'f',
  fingerprintTTL: ms('1d'),

  //
  // Once part of a message has been delivered, a destination that keeps
  // deferring (4xx) is retried for at most this long, then the message is
  // accepted and the alias owner is emailed. This keeps a single slow or
  // full mailbox from making the sender give up on (and bounce) recipients
  // that already have the message. It must stay well below `fingerprintTTL`,
  // which is how long delivered destinations are skipped on retry.
  //
  partialDeliveryRetryWindow: ms('4h'),

  // how often a forwarding issue email is sent for the same alias domain and destination
  forwardingIssueEmailInterval: ms('7d'),
  // the most forwarding issue emails one domain can trigger in a day
  forwardingIssueEmailDailyLimit: 25,

  denylist: new Set(
    _.isArray(env.DENYLIST)
      ? env.DENYLIST.map((key) => key.toLowerCase().trim())
      : isSANB(env.DENYLIST)
      ? env.DENYLIST.split(',').map((key) => key.toLowerCase().trim())
      : []
  ),

  truthSources: new Set(
    _.isArray(env.TRUTH_SOURCES)
      ? env.TRUTH_SOURCES.map((key) => key.toLowerCase().trim())
      : isSANB(env.TRUTH_SOURCES)
      ? env.TRUTH_SOURCES.split(',').map((key) => key.toLowerCase().trim())
      : []
  ),

  smtpSpamSuspensionWindow: ms(env.SMTP_SPAM_SUSPENSION_WINDOW || '1h'),
  smtpSpamSuspensionSpamThreshold: Math.max(
    1,
    Number(env.SMTP_SPAM_SUSPENSION_SPAM_THRESHOLD) || 3
  ),
  smtpSpamSuspensionVirusThreshold: Math.max(
    1,
    Number(env.SMTP_SPAM_SUSPENSION_VIRUS_THRESHOLD) || 2
  ),
  smtpSpamSuspensionMinUniqueRecipients: Math.max(
    1,
    Number(env.SMTP_SPAM_SUSPENSION_MIN_UNIQUE_RECIPIENTS) || 2
  ),
  // only log and count (rather than reject) unauthenticated legacy-HELO mail
  // from generic reverse DNS that impersonates its From domain
  // (see `helpers/is-high-confidence-generic-rdns-spam.js`)
  genericRdnsSpamMonitorOnly: boolean(env.GENERIC_RDNS_SPAM_MONITOR_ONLY),
  // only log and count (rather than reject) unauthenticated mail from an
  // address without forward-confirmed reverse DNS that its SPF does not
  // authorize
  // (see `helpers/is-high-confidence-unconfirmed-rdns-spam.js`)
  unconfirmedRdnsSpamMonitorOnly: boolean(
    env.UNCONFIRMED_RDNS_SPAM_MONITOR_ONLY
  ),
  // only log and count (rather than reject) unauthenticated mail submitted by
  // root on the sending server under an unrelated From domain
  // (see `helpers/is-high-confidence-root-script-spam.js`)
  rootScriptSpamMonitorOnly: boolean(env.ROOT_SCRIPT_SPAM_MONITOR_ONLY),
  // Suspend domain when >= this fraction of its aliases are suspended
  smtpDomainSuspensionAliasThreshold:
    Number(env.SMTP_DOMAIN_SUSPENSION_ALIAS_THRESHOLD) || 0.25,
  // TTL for rate-limit alert dedup key in Redis (one alert per domain per window)
  smtpRateLimitAlertTTL: ms(env.SMTP_RATE_LIMIT_ALERT_TTL || '1d'),

  greylistTimeout: ms('5m'),
  greylistTtlMs: ms('5d'),

  emailRetention: env.EMAIL_RETENTION,
  logRetention: env.LOG_RETENTION,
  analyticsRetention: env.ANALYTICS_RETENTION || '30d',

  // custom rate limiting lookup for allowing whitelisted customers
  rateLimit: {
    id(ctx) {
      if (ctx.allowlistValue) return false;
      // anonymous clients are counted per address, or per /64 for IPv6
      // (see helpers/get-ip-bucket.js)
      if (typeof ctx.isAuthenticated !== 'function' || !ctx.isAuthenticated())
        return getIpBucket(ctx.ip);
      // return `false` if the user is whitelisted
      if (ctx.state.user[config.userFields.isRateLimitWhitelisted])
        return false;
      // in case user is abusing multiple IP addresses
      return ctx.state.user.id;
    },
    allowlist:
      typeof env.RATELIMIT_ALLOWLIST === 'string'
        ? env.RATELIMIT_ALLOWLIST.split(',')
        : Array.isArray(env.RATELIMIT_ALLOWLIST)
        ? env.RATELIMIT_ALLOWLIST
        : []
  },

  maxQuotaPerAlias: env.NODE_ENV === 'test' ? bytes('1GB') : bytes('10GB'),

  // <https://github.com/nodemailer/wildduck/issues/512>
  maxMailboxes: 10000,

  // up to 1024 characters indexed from plaintext
  maxPlaintextIndexed: 1024,

  // <https://github.com/nodemailer/smtp-server/pull/192>
  authRequiredMessage: 'Authentication is required',

  // package.json
  pkg,

  // paypal error threshold (e.g. for jobs)
  paypalErrorThreshold: 5,

  // stripe error threshold (e.g. for jobs)
  stripeErrorThreshold: 5,

  // max aliases per global domains
  maxAliasPerGlobalDomain: 50,

  // exchanges (matches SMTP)
  exchanges: (Array.isArray(env.SMTP_EXCHANGE_DOMAINS)
    ? env.SMTP_EXCHANGE_DOMAINS
    : env.SMTP_EXCHANGE_DOMAINS.split(',')
  ).map((exchange) => exchange.toLowerCase().trim()),

  // max recipients per alias (matches SMTP)
  maxForwardedAddresses: env.MAX_FORWARDED_ADDRESSES,

  // users that remove accounts get email
  // rewritten to `${user.id}@${removedEmailDomain}`
  removedEmailDomain: env.REMOVED_EMAIL_DOMAIN,

  // SQLite busy_timeout value
  // <https://activesphere.com/blog/2018/12/24/understanding-sqlite-busy>
  busyTimeout: ms('10s'),

  // customer support AI
  ollamaHost: env.OLLAMA_HOST || 'http://localhost:11434',
  ollamaModel: env.OLLAMA_MODEL || 'gpt-oss:20b',
  ollamaEmbeddingModel: env.OLLAMA_EMBEDDING_MODEL || 'mxbai-embed-large',
  // `|| 0.7` would silently discard an explicit 0 (falsy) - Number.isNaN
  // check instead so temperature: 0 (e.g. deterministic eval runs) works.
  ollamaTemperature: Number.isNaN(Number.parseFloat(env.OLLAMA_TEMPERATURE))
    ? 0.7
    : Number.parseFloat(env.OLLAMA_TEMPERATURE),
  // 2000 was too low for hybrid-reasoning models (e.g. Qwen3): reasoning
  // alone regularly consumed the full budget before an answer was ever
  // reached (~32% of calls empirically, on a real eval run). Raised to
  // give reasoning + answer room to actually complete.
  ollamaMaxTokens: Number.parseInt(env.OLLAMA_MAX_TOKENS, 10) || 6000,
  lancedbPath: env.LANCEDB_PATH,
  githubOctokitToken: env.GITHUB_OCTOKIT_TOKEN,
  inboxZero: env.INBOX_ZERO || false,
  forwardEmailAliasUsername: env.FORWARD_EMAIL_ALIAS_USERNAME,
  forwardEmailAliasPassword: env.FORWARD_EMAIL_ALIAS_PASSWORD,
  customerSupportAiInboxLimit:
    Number.parseInt(env.CUSTOMER_SUPPORT_AI_INBOX_LIMIT, 10) || 100,

  // server
  env: env.NODE_ENV.toLowerCase(),
  urls: {
    web: env.WEB_URL.toLowerCase(),
    api: env.API_URL.toLowerCase()
  },

  // vanity domains
  vanityDomains: env.VANITY_DOMAINS,

  // record prefix (matches SMTP)
  recordPrefix: env.TXT_RECORD_PREFIX,

  // url options for validator (matches SMTP)
  isURLOptions: {
    protocols: ['http', 'https'],
    require_protocol: true
  },

  // Domain Connect integration
  // <https://domainconnect.org/>
  // <https://developers.cloudflare.com/dns/reference/domain-connect/>
  domainConnect: {
    providerId: env.DOMAIN_CONNECT_PROVIDER_ID,
    providerName: env.DOMAIN_CONNECT_PROVIDER_NAME,
    serviceId: env.DOMAIN_CONNECT_SERVICE_ID,
    serviceName: env.DOMAIN_CONNECT_SERVICE_NAME,
    logoUrl: env.DOMAIN_CONNECT_LOGO_URL,
    description: env.DOMAIN_CONNECT_DESCRIPTION,
    // syncPubKeyDomain is the domain where the public key TXT record is published
    // for signing synchronous Domain Connect requests
    // <https://developers.cloudflare.com/dns/reference/domain-connect/#template-definition>
    syncPubKeyDomain: env.DOMAIN_CONNECT_SYNC_PUB_KEY_DOMAIN,
    // syncKeyId is the DNS host prefix where the public key TXT records are published
    // The DNS provider looks up {syncKeyId}.{syncPubKeyDomain} to fetch the public key
    syncKeyId: env.DOMAIN_CONNECT_SYNC_KEY_ID || '_dck1',
    // privateKey is the RSA private key (PEM) used to sign synchronous apply requests
    // (required for Cloudflare; optional for other providers)
    privateKey: env.DOMAIN_CONNECT_PRIVATE_KEY || null
  },
  // app
  dkimKeySelector: 'forwardemail', // forwardemail._domainkey.example.com
  supportRequestMaxLength: env.SUPPORT_REQUEST_MAX_LENGTH,
  abuseEmail: env.EMAIL_ABUSE,
  friendlyFromEmail: env.EMAIL_FRIENDLY_FROM,
  securityEmail: env.EMAIL_SECURITY,
  isSelfHosted: env.SELF_HOSTED,
  email: {
    // NOTE: preview must be `false` (not an object) when PREVIEW_EMAIL is false
    // otherwise email-templates will still call preview-email and write files to /tmp
    preview: boolean(env.PREVIEW_EMAIL)
      ? {
          open: true,
          openSimulator: false,
          simpleParser: {
            Iconv,
            skipHtmlToText: true,
            skipTextLinks: true,
            skipTextToHtml: true,
            skipImageLinks: true,
            maxHtmlLengthToParse: bytes(env.SMTP_MESSAGE_MAX_SIZE)
          }
        }
      : false,
    subjectPrefix: `${env.APP_NAME} – `,
    message: {
      from: env.EMAIL_DEFAULT_FROM,
      //
      // set DSN to NEVER so we do not get DSN notifications for SMTP queued emails of our own
      // <https://nodemailer.com/smtp/dsn#3-opting-out-of-dsn-entirely>
      //
      // TODO: we should add in a bounce webhook of our own for our own emails
      //       so that if an account is registered or emails can't be delivered to a user's account
      //       we can mark a boolean flag like `is_email_working: false` or something similar
      //       and then render an alert/toast notification for the user and email them
      //
      dsn: {
        notify: 'never'
      }
    },
    send: env.SEND_EMAIL,
    juiceResources: {
      preserveImportant: true,
      applyStyleTags: true,
      removeStyleTags: true,
      insertPreservedExtraCss: true,
      preservePseudos: false,
      preserveKeyFrames: false,
      preserveFontFaces: false
    },
    lastLocaleField: 'last_locale',
    i18n: {
      ...i18n,
      autoReload: false,
      // Locale catalogs are source-controlled, reviewed data. Runtime strings
      // must never become translation keys or write into every locale file.
      updateFiles: false,
      syncFiles: false
    }
  },
  logger: loggerConfig,
  appColor: env.APP_COLOR,
  i18n,

  // paypal
  paypal: {
    clientID: env.PAYPAL_CLIENT_ID,
    secret: env.PAYPAL_SECRET
  },

  // build directory
  assetsBase: 'assets',
  buildBase: 'build',

  // templating
  views: {
    // root is required by `koa-views`
    root: path.join(__dirname, '..', 'app', 'views'),
    // These are options passed to `koa-views`
    // <https://github.com/queckezz/koa-views>
    // They are also used by the email job rendering
    options: {
      extension: 'pug',
      map: {},
      engineSource: consolidate
    },
    // A complete reference of options for Pug (default):
    // <https://pugjs.org/api/reference.html>
    locals: {
      // i18n default locale
      defaultLocale: i18n.defaultLocale,
      locales: i18n.locales,
      // Even though pug deprecates this, we've added `pretty`
      // in `koa-views` package, so this option STILL works
      // <https://github.com/queckezz/koa-views/pull/111>
      pretty: env.NODE_ENV === 'development',
      cache: env.NODE_ENV !== 'development',
      // debug: env.NODE_ENV === 'development',
      // compileDebug: env.NODE_ENV === 'development',
      ...utilities,
      filters
    }
  },

  // user fields whose account updates create an action (e.g. email)
  accountUpdateFields: [
    'passport.fields.otpEnabled',
    'passport.fields.givenName',
    'passport.fields.familyName',
    'passportLocalMongoose.usernameField',
    'userFields.apiToken',
    'userFields.receiptEmail',
    'userFields.companyName',
    'userFields.addressLine1',
    'userFields.addressLine2',
    'userFields.addressCity',
    'userFields.addressState',
    'userFields.addressZip',
    'userFields.companyVAT',
    'userFields.addressCountry',
    // Additional fields for comprehensive audit logging
    'userFields.defaultDomain',
    'userFields.defaultForwardingAddress',
    'userFields.smtpLimit',
    'userFields.maxQuotaPerAlias'
  ],

  // user fields that should be redacted in account update emails (security-sensitive)
  accountUpdateRedactedFields: [
    'userFields.apiToken',
    'userFields.otpToken',
    'userFields.otpRecoveryKeys',
    'userFields.resetToken',
    'userFields.resetTokenExpiresAt',
    'userFields.verificationPin',
    'userFields.verificationPinExpiresAt',
    'userFields.verificationPinSentAt',
    'userFields.pendingRecovery'
  ],

  // user fields whose values are byte counts and should be formatted with bytes()
  accountUpdateByteFields: ['userFields.maxQuotaPerAlias'],

  // domain fields whose updates create an action (e.g. email to domain admins)
  domainUpdateFields: [
    // Webhook and logging settings
    'bounce_webhook',
    'has_delivery_logs',
    'webhook_key',

    // Quota and retention settings
    'max_quota_per_alias',
    'retention_days',

    // Security and protection settings
    'has_adult_content_protection',
    'has_phishing_protection',
    'has_executable_protection',
    'has_virus_protection',
    'require_tls_inbound',

    // Alias and recipient settings
    'is_catchall_regex_disabled',
    'has_recipient_verification',
    'max_recipients_per_alias',

    // SMTP settings
    'has_smtp',
    'smtp_port',

    // Newsletter
    'has_newsletter',

    // DNS and verification settings
    'ignore_mx_check',

    // Access control lists
    'allowlist',
    'denylist',
    'restricted_alias_names',

    // Custom verification template
    'has_custom_verification',
    'custom_verification',

    // DKIM settings
    'dkim_modulus_length',
    'dkim_key_selector',

    // Plan and status (admin-modifiable)
    'plan',
    'is_smtp_suspended',

    // Custom S3 storage settings
    'has_custom_s3',
    's3_endpoint',
    's3_access_key_id',
    's3_secret_access_key',
    's3_region',
    's3_bucket'
  ],

  // domain fields whose values are byte counts and should be formatted with bytes()
  domainUpdateByteFields: ['max_quota_per_alias'],

  // domain fields that should be redacted in domain update emails (security-sensitive)
  domainUpdateRedactedFields: [
    'webhook_key',
    'tokens',
    'verification_record',
    'dkim_private_key',
    'return_path',
    's3_access_key_id',
    's3_secret_access_key'
  ],

  // reference crypto random
  referenceOptions: {
    length: 6,
    type: 'alphanumeric'
  },

  // user fields (change these if you want camel case or whatever)
  userFields: {
    stripeTrialSentAt: 'stripe_trial_sent_at',
    paypalTrialSentAt: 'paypal_trial_sent_at',
    paymentReminderInitialSentAt: 'payment_reminder_initial_sent_at',
    paymentReminderFollowUpSentAt: 'payment_reminder_follow_up_sent_at',
    paymentReminderFinalNoticeSentAt: 'payment_reminder_final_notice_sent_at',
    paymentReminderTerminationNoticeSentAt:
      'payment_reminder_termination_notice_sent_at',
    apiPastDueSentAt: 'api_past_due_sent_at',
    apiRestrictedSentAt: 'api_restricted_sent_at',
    receiptEmail: 'receipt_email',
    isRateLimitWhitelisted: 'is_rate_limit_whitelisted',
    accountUpdates: 'account_updates',
    hasPendingAccountUpdates: 'has_pending_account_updates',
    fullEmail: 'full_email',
    apiToken: 'api_token',
    apiTokenDisabled: 'api_token_disabled',
    otpRecoveryKeys: 'otp_recovery_keys',
    resetTokenExpiresAt: 'reset_token_expires_at',
    resetToken: 'reset_token',
    changeEmailTokenExpiresAt: 'change_email_token_expires_at',
    changeEmailToken: 'change_email_token',
    changeEmailNewAddress: 'change_email_new_address',
    hasSetPassword: 'has_set_password',
    hasVerifiedEmail: 'has_verified_email',
    pendingRecovery: 'pending_recovery',
    verificationPinExpiresAt: 'verification_pin_expires_at',
    verificationPinSentAt: 'verification_pin_sent_at',
    verificationPin: 'verification_pin',
    verificationPinHasExpired: 'verification_pin_has_expired',
    welcomeEmailSentAt: 'welcome_email_sent_at',
    launchEmailSentAt: 'launch_email_sent_at',
    isRemoved: 'is_removed',
    isBanned: 'is_banned',
    banReason: 'ban_reason',
    twoFactorReminderSentAt: 'two_factor_reminder_sent_at',
    featureReminderSentAt: 'feature_reminder_sent_at',
    pastDueReliefSentAt: 'past_due_relief_sent_at',
    planSetAt: 'plan_set_at',
    planExpiresAt: 'plan_expires_at',
    stripeCustomerID: 'stripe_customer_id',
    stripeSubscriptionID: 'stripe_subscription_id',
    paypalPayerID: 'paypal_payer_id',
    paypalSubscriptionID: 'paypal_subscription_id',
    defaultDomain: 'default_domain',
    defaultForwardingAddress: 'default_forwarding_address',
    domainCount: 'domain_count',
    aliasCount: 'alias_count',
    companyName: 'company_name',
    addressLine1: 'address_line1',
    addressLine2: 'address_line2',
    addressCity: 'address_city',
    addressState: 'address_state',
    addressZip: 'address_zip',
    addressCountry: 'address_country',
    addressHTML: 'address_html',
    companyVAT: 'company_vat',
    hasDenylistRequests: 'has_denylist_requests',
    approvedDomains: 'approved_domains',
    smtpLimit: 'smtp_limit',
    smtpReputationTier: 'smtp_reputation_tier',
    smtpReputationCleanDays: 'smtp_reputation_clean_days',
    smtpReputationEvaluatedAt: 'smtp_reputation_evaluated_at',
    smtpReputationCeilingAlertedAt: 'smtp_reputation_ceiling_alerted_at',
    smtpReputationPaidSince: 'smtp_reputation_paid_since',
    smtpReputationPeak: 'smtp_reputation_peak',
    smtpReputationPeakDomains: 'smtp_reputation_peak_domains',
    smtpReputationNextPeak: 'smtp_reputation_next_peak',
    smtpReputationHoldUntil: 'smtp_reputation_hold_until',
    smtpReputationReports: 'smtp_reputation_reports',
    smtpReputationResetAt: 'smtp_reputation_reset_at',
    smtpReputationHoldReason: 'smtp_reputation_hold_reason',
    smtpReputationLendHoldUntil: 'smtp_reputation_lend_hold_until',
    smtpReputationReviewedAt: 'smtp_reputation_reviewed_at',
    smtpBaselineDaily: 'smtp_baseline_daily',
    smtpBaselineAt: 'smtp_baseline_at',
    smtpBaselineHourly: 'smtp_baseline_hourly',
    smtpThrottledAt: 'smtp_throttled_at',
    smtpThrottledDays: 'smtp_throttled_days',
    maxQuotaPerAlias: 'max_quota_per_alias',
    dailyLogAlertSentAt: 'daily_log_alert_sent_at'
  },

  // dynamic otp routes
  otpRouteLoginPath: '/login',

  verificationPinTimeoutMs: ms(env.VERIFICATION_PIN_TIMEOUT_MS),
  verificationPinEmailIntervalMs: ms(env.VERIFICATION_PIN_EMAIL_INTERVAL_MS),
  verificationPin: { length: 6, type: 'numeric' },

  // reset token
  resetTokenTimeoutMs: ms(env.RESET_TOKEN_TIMEOUT_MS),

  // change email token
  changeEmailTokenTimeoutMs: ms(env.CHANGE_EMAIL_TOKEN_TIMEOUT_MS),
  changeEmailLimitMs: ms(env.CHANGE_EMAIL_LIMIT_MS),

  turnstileEnabled: env.TURNSTILE_ENABLED,
  turnstileSecretKey: env.TURNSTILE_SECRET_KEY,
  turnstileSiteKey: env.TURNSTILE_SITE_KEY,

  // @ladjs/passport configuration (see defaults in package)
  // <https://github.com/ladjs/passport>
  passport: {
    fields: {
      // you may want to make this "full_name" instead
      displayName: 'display_name',
      // you could make this "first_name"
      givenName: 'given_name',
      // you could make this "last_name"
      familyName: 'family_name',
      avatarURL: 'avatar_url',
      // apple
      appleProfileID: 'apple_profile_id',
      appleAccessToken: 'apple_access_token',
      appleRefreshToken: 'apple_refresh_token',
      // google
      googleProfileID: 'google_profile_id',
      googleAccessToken: 'google_access_token',
      googleRefreshToken: 'google_refresh_token',
      // github
      githubProfileID: 'github_profile_id',
      githubAccessToken: 'github_access_token',
      githubRefreshToken: 'github_refresh_token',
      // ubuntu
      ubuntuProfileID: 'ubuntu_profile_id',
      ubuntuUsername: 'ubuntu_username',
      // otp
      otpToken: 'otp_token',
      otpEnabled: 'otp_enabled'
    },
    phrases: {
      INVALID_USER: phrases.INVALID_USER,
      INVALID_PROFILE_RESPONSE: phrases.INVALID_PROFILE_RESPONSE,
      INVALID_EMAIL: phrases.INVALID_EMAIL,
      INVALID_PROFILE_ID: phrases.INVALID_PROFILE_ID,
      CONSENT_REQUIRED: phrases.CONSENT_REQUIRED,
      OTP_NOT_ENABLED: phrases.OTP_NOT_ENABLED,
      OTP_TOKEN_DOES_NOT_EXIST: phrases.OTP_TOKEN_DOES_NOT_EXIST,
      INVALID_WEBAUTHN_KEY: phrases.INVALID_WEBAUTHN_KEY
    },
    //
    // OAuth CSRF protection: `@ladjs/passport` deep-merges these into its
    // default Google/GitHub strategy options (clientID, callbackURL, scope
    // are inherited). Neither passport-google-oauth20 nor passport-github2
    // sends a `state` parameter by default, which leaves the provider
    // callback open to login CSRF: an attacker can have a victim's browser
    // complete a callback carrying the attacker's authorization code and
    // silently log the victim into the attacker's account. With
    // `state: true`, passport-oauth2 stores a random value in the session
    // on the authorize redirect and rejects any callback that does not
    // present it.
    //
    // (`allRawEmails` gives every GitHub address with whether it was
    // verified, see helpers/passport.js)
    //
    strategies: {
      google: { state: true },
      github: { state: true, allRawEmails: true }
    }
  },

  // passport-local-mongoose options
  // <https://github.com/saintedlama/passport-local-mongoose>
  passportLocalMongoose: {
    usernameField: 'email',
    passwordField: 'password',
    attemptsField: 'login_attempts',
    lastLoginField: 'last_login_at',
    usernameLowerCase: true,
    // NOTE: we rate limit the /login endpoint
    // In addition to IP-based rate limiting, enable per-account lockout
    // to prevent brute-force attacks that bypass IP rate limits.
    // This ensures that even successful login attempts are blocked
    // after too many failed attempts until the lockout window expires.
    limitAttempts: true,
    maxAttempts: env.NODE_ENV === 'development' ? Number.POSITIVE_INFINITY : 10,
    interval: 100, // initial lockout interval in ms
    maxInterval: 300000, // max lockout interval: 5 minutes
    digestAlgorithm: 'sha256',
    encoding: 'hex',
    saltlen: 32,
    //
    // TODO: this should be bumped from 25000 to 100000
    //       (but we may need to do a migration of sorts if so)
    //       <https://github.com/nodemailer/wildduck/pull/648>
    //
    iterations: 25000,
    keylen: 512,
    passwordValidator(password, fn) {
      if (typeof password !== 'string') {
        const err = Boom.badRequest(phrases.INVALID_PASSWORD_STRENGTH);
        err.no_translate = true;
        return fn(err);
      }

      if (env.NODE_ENV === 'development') return fn();
      if (!zxcvbn) zxcvbn = require('#helpers/zxcvbn');
      const { score, feedback } = zxcvbn(password);
      if (score >= 3) return fn();
      let message = phrases.INVALID_PASSWORD_STRENGTH;
      if (_.isObject(feedback)) {
        if (isSANB(feedback.warning)) message += ` ${feedback.warning}.`;
        if (isSANB(feedback.suggestions))
          message += ` ${feedback.suggestions}.`;
      }

      const err = Boom.badRequest(message);
      err.no_translate = true;
      fn(err);
    },
    errorMessages: {
      MissingPasswordError: phrases.PASSPORT_MISSING_PASSWORD_ERROR,
      AttemptTooSoonError: phrases.PASSPORT_ATTEMPT_TOO_SOON_ERROR,
      TooManyAttemptsError: phrases.PASSPORT_TOO_MANY_ATTEMPTS_ERROR,
      NoSaltValueStoredError: phrases.PASSPORT_NO_SALT_VALUE_STORED_ERROR,
      IncorrectPasswordError: phrases.PASSPORT_INCORRECT_PASSWORD_ERROR,
      IncorrectUsernameError: phrases.PASSPORT_INCORRECT_USERNAME_ERROR,
      MissingUsernameError: phrases.PASSPORT_MISSING_USERNAME_ERROR,
      UserExistsError: phrases.PASSPORT_USER_EXISTS_ERROR
    }
  },

  //
  // argon2 configuration for domain and alias tokens
  // (separate from passportLocalMongoose which is used for user authentication)
  // <https://github.com/napi-rs/node-rs>
  // <https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html>
  // Bitwarden uses Argon2id for key derivation, with default settings of:
  // 64 MiB memory, 3 iterations, and 4 parallelism
  //
  // But with fail2ban and rate limiting (5 attempts per IP over 24 hours it becomes impractical)
  // However note we have allowlisted major ISP's and shared IP services (e.g. Gmail, Yahoo, etc)
  // Though they have their own rate limiting in place as well to keep us protected
  //
  // Our default passwords are created with the following config (24 characters)
  // which makes brute-force attempts totally impractical, but users can specify shorter
  // passwords, although we use zxcvbn to prevent them from making easily guessible combinations
  // and we also feed it a dictionary of metadata related to the user to protect them further
  //
  // Note that an attacker is limited by rate limiting (10 attempts per 24 hour by IP address) and NOT by hash speed
  //
  argon2: {
    //
    // previous onAuth with PBKDF2 takes 50-60ms for onAuth
    //
    memoryCost: 19456, // 19 MiB (20ms for onAuth)
    // memoryCost: 32768, // 32 MiB (30ms for onAuth)
    // memoryCost: 49152, // 48 MiB (40ms for onAuth)
    // memoryCost: 65536, // 64 MiB (60ms for onAuth)
    timeCost: 2, // iterations
    parallelism: 1,
    outputLen: 32 // hash length in bytes (8 bits per byte, 32 x 8 = 256 bits)
  },

  // passport callback options
  passportCallbackOptions: {
    successReturnToOrRedirect: '/my-account',
    failureRedirect: '/login',
    successFlash: true,
    failureFlash: true
  },

  // <https://github.com/ladjs/store-ip-address>
  storeIPAddress: false,

  // field name for a user's last locale
  // (this gets re-used by email-templates and @ladjs/i18n; see below)
  lastLocaleField: 'last_locale',

  // <https://en.wikipedia.org/wiki/Top-level_domain#Reserved_domains:~:text=%5B8%5D-,Reserved%20domains,-%5Bedit%5D>
  testDomains: [
    'example',
    'invalid',
    'localhost',
    'test',
    'local',
    'onion',
    'internal',
    'alt',
    // Cloud metadata bare hostnames (AWS/GCP instance metadata endpoints)
    'metadata',
    'instance-data',
    punycode.toASCII('испытание'),
    punycode.toASCII('テスト'),
    punycode.toASCII('δοκιμή'),
    punycode.toASCII('טעסט'),
    punycode.toASCII('آزمایشی'),
    punycode.toASCII('테스트'),
    punycode.toASCII('测试'),
    punycode.toASCII('परीक्षा'),
    punycode.toASCII('பரிட்சை'),
    punycode.toASCII('إختبار'),
    punycode.toASCII('測試')
  ],

  // <https://symantec-enterprise-blogs.security.com/blogs/feature-stories/top-20-shady-top-level-domains>
  // <https://www.spamhaus.org/statistics/tlds/>
  // <https://krebsonsecurity.com/tag/top-20-shady-top-level-domains/>
  // <https://tld-list.com/free-downloads>
  // <https://publicsuffix.org/list/public_suffix_list.dat>
  //
  restrictedDomains: [
    // government
    'edu',
    'gov',
    'mil',

    // IANA
    'int',

    // TODO: we don't allow this because IPv4 addresses like this
    //       would then get allowlisted and could be sending spam
    //       (e.g. "x.x.x.x.in-addr.arpa")
    // 'arpa',

    // us
    'dni.us',
    'fed.us',
    'isa.us',
    'kids.us',
    'nsn.us',

    // state abbreviations (includes k12)
    'ak.us',
    'al.us',
    'ar.us',
    'as.us',
    'az.us',
    'ca.us',
    'co.us',
    'ct.us',
    'dc.us',
    'de.us',
    'fl.us',
    'ga.us',
    'gu.us',
    'hi.us',
    'ia.us',
    'id.us',
    'il.us',
    'in.us',
    'ks.us',
    'ky.us',
    'la.us',
    'ma.us',
    'md.us',
    'me.us',
    'mi.us',
    'mn.us',
    'mo.us',
    'ms.us',
    'mt.us',
    'nc.us',
    'nd.us',
    'ne.us',
    'nh.us',
    'nj.us',
    'nm.us',
    'nv.us',
    'ny.us',
    'oh.us',
    'ok.us',
    'or.us',
    'pa.us',
    'pr.us',
    'ri.us',
    'sc.us',
    'sd.us',
    'tn.us',
    'tx.us',
    'ut.us',
    'va.us',
    'vi.us',
    'vt.us',
    'wa.us',
    'wi.us',
    'wv.us',
    'wy.us',

    // <https://en.wikipedia.org/wiki/Second-level_domain>
    'mil.tt',
    'edu.tt',
    'edu.tr',
    'edu.ua',
    'edu.au',
    'ac.at',
    'edu.br',
    'ac.nz',
    'school.nz',
    'cri.nz',
    'health.nz',
    'mil.nz',
    'parliament.nz',
    'ac.in',
    'edu.in',
    'mil.in',
    // 'ac.jp',
    'ed.jp',
    'lg.jp',
    'ac.za',
    'edu.za',
    'mil.za',
    'school.za',
    'mil.kr',
    'ac.kr',
    'hs.kr',
    'ms.kr',
    'es.kr',
    'sc.kr',
    'kg.kr',
    'edu.es',
    'ac.lk',
    'sch.lk',
    'edu.lk',
    'ac.th',
    'mi.th',

    // <https://en.wikipedia.org/wiki/.gov#International_equivalents>
    'admin.ch',
    'canada.ca',
    'gc.ca',
    'go.id',
    'go.jp',
    'go.ke',
    'go.kr',
    'go.th',
    'gob.ar',
    'gob.cl',
    'gob.es',
    'gob.mx',
    // 'gob.pe',
    'gob.ve',
    'gob.sv',
    'gouv.fr',
    'gouv.nc',
    'gouv.qc.ca',
    'gov.ad',
    'gov.af',
    'gov.ai',
    'gov.al',
    'gov.am',
    'gov.ao',
    'gov.au',
    'gov.aw',
    'gov.ax',
    'gov.az',
    'gov.bd',
    'gov.be',
    'gov.bg',
    'gov.bm',
    // 'gov.br',
    'gov.by',
    'gov.cl',
    'gov.cn',
    'gov.co',
    'gov.cy',
    'gov.cz',
    'gov.dz',
    'gov.eg',
    'gov.fi',
    'gov.fk',
    'gov.gg',
    'gov.gr',
    'gov.hk',
    'gov.hr',
    'gov.hu',
    'gov.ie',
    'gov.il',
    'gov.im',
    'gov.in',
    'gov.iq',
    'gov.ir',
    'gov.it',
    'gov.je',
    'gov.kp',
    'gov.krd',
    'gov.ky',
    'gov.kz',
    'gov.lb',
    'gov.lk',
    'gov.lt',
    'gov.lv',
    'gov.ma',
    'gov.mm',
    'gov.mo',
    'gov.mt',
    'gov.my',
    'gov.ng',
    'gov.np',
    'gov.ph',
    'gov.pk',
    'gov.pl',
    'gov.pt',
    'gov.py',
    'gov.ro',
    'gov.ru',
    'gov.scot',
    'gov.se',
    'gov.sg',
    'gov.si',
    'gov.sk',
    'gov.tr',
    'gov.tt',
    'gov.tw',
    'gov.ua',
    'gov.uk',
    'gov.vn',
    'gov.wales',
    'gov.za',
    'government.pn',
    'govt.nz',
    // NOTE: gub.uy removed due to spam from subdomains)
    // 'gub.uy',
    'gv.at',

    // <https://en.wikipedia.org/wiki/.uk#Second-level_domains>
    'ac.uk',
    'bl.uk',
    'judiciary.uk',
    'mod.uk',
    'nhs.uk',
    'parliament.uk',
    'police.uk',
    'rct.uk',
    'royal.uk',
    'sch.uk',
    'ukaea.uk',

    // <https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains>
    ...brandAndCorporateDomains
  ],

  goodDomains: [
    'ac',
    'ad',
    'ae',
    'ag',
    'ai',
    'al',
    'am',
    'app',
    'ar',
    'as',
    'at',
    'au',
    'ba',
    'be',
    'br',
    'by',
    'ca',
    'cat',
    'cc',
    'cd',
    'ch',
    'ck',
    'co',
    'com',
    'de',
    'dev',
    'dj',
    'dk',
    'ee',
    'es',
    'eu',
    'family',
    'fi',
    'fm',
    'fr',
    'gg',
    'gl',
    'id',
    'ie',
    'il',
    'im',
    'in',
    'io',
    'ir',
    'is',
    'it',
    'je',
    'jp',
    'ke',
    'kr',
    'la',
    'li',
    'lv',
    'ly',
    'md',
    'me',
    'mn',
    'ms',
    'mu',
    'mx',
    'net',
    'ni',
    'nl',
    'no',
    'nu',
    'nz',
    'org',
    'pl',
    'pr',
    'pt',
    'pw',
    'rs',
    'sc',
    'se',
    'sh',
    'si',
    'sm',
    'sr',
    'st',
    'tc',
    'tm',
    'to',
    'tv',
    'uk',
    'us',
    'uz',
    'vc',
    'vg',
    'vu',
    'ws',
    'xyz',
    'za',

    // french overseas territories
    // <https://github.com/forwardemail/forwardemail.net/issues/327>
    'bzh', // Bretagne
    'gf', // Guyane
    'gp', // Guadeloupe
    'mq', // Martinique
    'nc', // Nouvelle-Calédonie
    'pf', // Polynésie
    'pm', // Saint-Pierre-et-Miquelon
    're', // La Réunion
    'tf', // TAAF
    'wf', // Wallis-et-Futuna
    'yt', // Mayotte

    // europe specific countries
    'ax', // Åland Islands
    'bg', // Bulgaria
    'fo', // Faroe Islands
    'gi', // Gibraltar
    'gr', // Greece
    'hr', // Croatia
    'hu', // Hungary
    'lt', // Lithuania
    'lu', // Luxembourg
    'mc', // Monaco
    'cz', // Czech Republic
    // spammy and not supported
    // 'ru', // Russian Federation
    // 'ua', // Ukraine
    'mk', // North Macedonia
    'mt', // Malta
    'ro', // Romania
    'sk', // Slovakia
    'va' // Vatican (Holy See)
  ],

  validDurations: [
    ms('30d'), // 1 mo
    ms('60d'), // 2 mo
    ms('90d'), // 3 mo
    ms('180d'), // 6 mo
    ms('1y'),
    ms('2y'),
    ms('3y')
  ],

  // this is used for calculating plan_expires_at
  // (there is probably a better way to implement this)
  durationMapping: {
    [ms('30d').toString()]: ['1', 'month'],
    [ms('60d').toString()]: ['2', 'months'],
    [ms('90d').toString()]: ['3', 'months'],
    [ms('180d').toString()]: ['6', 'months'],
    [ms('1y').toString()]: ['1', 'year'],
    [ms('2y').toString()]: ['2', 'years'],
    [ms('3y').toString()]: ['3', 'years']
  }
};

// arbitrarily add domains to the denylist
for (const tld of tlds) {
  if (
    config.restrictedDomains.includes(tld) &&
    !brandAndCorporateDomains.includes(tld)
  )
    continue;
  // cash app scammers
  config.denylist.add(`kosomar.${punycode.toASCII(tld)}`);
  config.denylist.add(`amikalpop.${punycode.toASCII(tld)}`);
  config.denylist.add(`privacid.${punycode.toASCII(tld)}`);
  config.denylist.add(`klokpmaol.${punycode.toASCII(tld)}`);
  config.denylist.add(`postline.${punycode.toASCII(tld)}`);
  config.denylist.add(`andasifbymagic.${punycode.toASCII(tld)}`);
}

// sanity test against validDurations and durationMapping length
if (config.validDurations.length !== Object.keys(config.durationMapping).length)
  throw new Error('validDurations and durationMapping must be aligned');

// set dynamic login otp route
config.loginOtpRoute = `${config.otpRoutePrefix}${config.otpRouteLoginPath}`;

// set build dir based off build base dir name
config.buildDir = path.join(__dirname, '..', config.buildBase);

// meta support for SEO
config.meta = meta(config);

// add i18n api to views
const logger = new Axe(config.logger);

// add manifest helper for rev-manifest.json support
config.manifest = path.join(config.buildDir, 'rev-manifest.json');
config.srimanifest = path.join(config.buildDir, 'sri-manifest.json');
config.views.locals.manifest = manifestRev({
  prepend: '/',
  manifest: config.srimanifest
});

config.alternatives = alternatives;

config.views.locals.pkgVersion =
  env.NODE_ENV === 'test' ? '0.0.1' : pkg.version;

// add selective `config` object to be used by views
config.views.locals.config = _.pick(config, [
  'smtpMessageMaxSize',
  'alternatives',
  'argon2',
  'smtpLimitMessages',
  'smtpLimitDuration',
  'smtpReputationTiers',
  'smtpTeamLimitMessages',
  'smtpDomainSuspensionAliasThreshold',
  'smtpRateLimitAlertTTL',
  'supportEmail',
  'webHost',
  'appColor',
  'appName',
  'breeHost',
  'env',
  'turnstileEnabled',
  'turnstileSiteKey',
  'lastLocaleField',
  'loginRoute',
  'maxForwardedAddresses',
  'otpRoutePrefix',
  'passport',
  'passportCallbackOptions',
  'passportLocalMongoose',
  'paypal',
  'recordPrefix',
  'storeIPAddress',
  'supportRequestMaxLength',
  'urls',
  'userFields',
  'vanityDomains',
  'verificationPin',
  'verifyRoute',
  'goodDomains',
  'meta',
  'metaTitleAffix',
  'modulusLength',
  'openPGPKey',
  'ubuntuTeamMapping',
  'maxQuotaPerAlias',
  'optOutTemplates'
]);

// <https://nodemailer.com/transports/>
// <https://github.com/nodemailer/nodemailer/pull/1539>
config.email.transport = nodemailer.createTransport({
  streamTransport: true,
  buffer: false,
  logger,
  debug: boolean(env.TRANSPORT_DEBUG)
});

// add `views` to `config.email`
config.email.views = { ...config.views };
config.email.views.root = path.join(__dirname, '..', 'emails');
config.email.juiceResources.webResources = {
  relativeTo: config.buildDir,
  images: false
};
config.email.views.locals.manifest = manifestRev({
  prepend: `${config.urls.web}/`,
  manifest: config.srimanifest
});

// launch date is 11/23/2020 at 10:00 AM
config.launchDate = dayjs('11/23/2020 10:00 AM', 'MM/DD/YYYY h:mm A').toDate();

config.payments = payments;

//
// Monthly plan pricing for marketing views.
//
// The payments module itself is deliberately NOT added to the
// config.views.locals.config pick list above: it also carries Stripe price
// ids and PayPal plan credentials, and templates only need the display
// figures. This also has to be assigned after the pick, which runs earlier in
// this file and would capture payments as undefined.
//
config.views.locals.planPricing = {
  free: 0,
  enhanced: payments.PAYPAL_MAPPING.enhanced_protection['30d'],
  team: payments.PAYPAL_MAPPING.team['30d'],
  enterprise: payments.ENTERPRISE_MONTHLY
};

// Sieve configuration (used by ManageSieve server, API, and web controllers)
config.sieve = {
  // Server settings (for ManageSieve protocol)
  host: env.MANAGESIEVE_HOST,
  port: env.MANAGESIEVE_PORT,

  // Script limits
  maxScriptSize: env.SIEVE_MAX_SCRIPT_SIZE
    ? Number.parseInt(env.SIEVE_MAX_SCRIPT_SIZE, 10)
    : 1024 * 1024,
  maxScripts: env.SIEVE_MAX_SCRIPTS
    ? Number.parseInt(env.SIEVE_MAX_SCRIPTS, 10)
    : 100,
  maxScriptCount: env.SIEVE_MAX_SCRIPTS
    ? Number.parseInt(env.SIEVE_MAX_SCRIPTS, 10)
    : 100,
  maxScriptNameLength: 128,
  maxNestedDepth: 10,

  // Redirect limits
  maxRedirects: 5,
  maxRedirectsPerScript: 5,
  maxRedirectsPerDay: 100,

  // Vacation limits
  maxVacationsPerHour: 10,

  // Security settings
  allowedRedirectDomains: null,
  protectedHeaders: [
    'from',
    'sender',
    'return-path',
    'dkim-signature',
    'arc-seal',
    'arc-message-signature',
    'arc-authentication-results',
    'authentication-results',
    'received',
    'received-spf',
    'message-id',
    'date',
    'mime-version',
    'content-type',
    'content-transfer-encoding'
  ],

  // Enabled Sieve extensions
  enabledExtensions: [
    'fileinto',
    'reject',
    'ereject',
    'vacation',
    'vacation-seconds',
    'variables',
    'imap4flags',
    'body',
    'copy',
    'relational',
    'editheader',
    'envelope',
    'date',
    'index',
    'regex',
    'enotify',
    'environment'
  ]
};

module.exports = config;
