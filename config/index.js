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

const filters = require('./filters');
const i18n = require('./i18n');
const loggerConfig = require('./logger');
const meta = require('./meta');
const phrases = require('./phrases');
const utilities = require('./utilities');
const payments = require('./payments');
const metaConfig = require('./meta-config');
const alternatives = require('./alternatives');
const _ = require('#helpers/lodash');

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
  'bond',
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

const config = {
  ...metaConfig,

  optOutTemplates: [
    // 'dmarc-issue', // TODO: need to hook this in
    'domain-configuration-issue',
    'domain-onboard',
    'domain-restrictions-reminder',
    'domain-verified',
    'feature-reminder',
    'phishing-alert',
    'two-factor-reminder',
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
  INITIAL_DB_SIZE: 270336,
  STRIPE_LOCALES,
  openPGPKey: '/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.asc',
  returnPath: 'fe-bounces',
  imapConfigurations: env.SELF_HOSTED ? [] : imapConfigurations,
  passkeyLimit: 30,
  IMAP_REDIS_CHANNEL_NAME: 'imap_events',

  srs: {
    separator: '=',
    secret: env.SRS_SECRET,
    maxAge: 24 * 60 * 10 // 10 days
  },
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
  smtpQueueTimeout: ms('180s'),
  smtpLimitMessages: env.NODE_ENV === 'test' ? 10 : 300,
  smtpLimitAuth: env.NODE_ENV === 'test' ? Number.MAX_VALUE : 10,
  smtpLimitAuthDuration: ms('1h'),
  smtpLimitDuration: ms('1d'),
  smtpLimitNamespace: `smtp_auth_limit_${env.NODE_ENV.toLowerCase()}`,
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
  fingerprintTTL: ms('7d'),

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

  greylistTimeout: ms('5m'),
  greylistTtlMs: ms('5d'),

  emailRetention: env.EMAIL_RETENTION,
  logRetention: env.LOG_RETENTION,

  // custom rate limiting lookup for allowing whitelisted customers
  rateLimit: {
    id(ctx) {
      if (ctx.allowlistValue) return false;
      if (typeof ctx.isAuthenticated !== 'function' || !ctx.isAuthenticated())
        return ctx.ip;
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

  // app
  dkimKeySelector: 'forwardemail', // forwardemail._domainkey.example.com
  supportRequestMaxLength: env.SUPPORT_REQUEST_MAX_LENGTH,
  abuseEmail: env.EMAIL_ABUSE,
  friendlyFromEmail: env.EMAIL_FRIENDLY_FROM,
  securityEmail: env.EMAIL_SECURITY,
  isSelfHosted: env.SELF_HOSTED,
  email: {
    preview: {
      open: env.PREVIEW_EMAIL,
      openSimulator: false,
      simpleParser: {
        Iconv,
        skipHtmlToText: true,
        skipTextLinks: true,
        skipTextToHtml: true,
        skipImageLinks: true,
        maxHtmlLengthToParse: bytes(env.SMTP_MESSAGE_MAX_SIZE)
      }
    },
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
      updateFiles: true,
      syncFiles: true
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
    'userFields.addressCountry'
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
    fullEmail: 'full_email',
    apiToken: 'api_token',
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
    maxQuotaPerAlias: 'max_quota_per_alias'
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
    // limitAttempts: true,
    // maxAttempts: env.NODE_ENV === 'development' ? Number.POSITIVE_INFINITY : 10,
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
      TooManyAttemptsError: phrases.PASSPORT_TOO_MANY_ATTEMPTS_ERROR_,
      NoSaltValueStoredError: phrases.PASSPORT_NO_SALT_VALUE_STORED_ERROR,
      IncorrectPasswordError: phrases.PASSPORT_INCORRECT_PASSWORD_ERROR,
      IncorrectUsernameError: phrases.PASSPORT_INCORRECT_USERNAME_ERROR,
      MissingUsernameError: phrases.PASSPORT_MISSING_USERNAME_ERROR,
      UserExistsError: phrases.PASSPORT_USER_EXISTS_ERROR
    }
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
    'ac.jp',
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
    'ag',
    'ai',
    'al',
    'am',
    'app',
    'as',
    'at',
    'au',
    'ba',
    'be',
    'br',
    'by',
    'ca',
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

// add selective `config` object to be used by views
config.views.locals.config = _.pick(config, [
  'smtpMessageMaxSize',
  'alternatives',
  'smtpLimitMessages',
  'smtpLimitDuration',
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

module.exports = config;
