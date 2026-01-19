/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const os = require('node:os');
const punycode = require('node:punycode');
const { Buffer } = require('node:buffer');
const { isIP } = require('node:net');
const { promisify } = require('node:util');

const { setTimeout } = require('node:timers/promises');
const Boom = require('@hapi/boom');
const RE2 = require('re2');
const bytes = require('@forwardemail/bytes');
const cryptoRandomString = require('crypto-random-string');
const dayjs = require('dayjs-with-plugins');
const getDmarcRecord = require('mailauth/lib/dmarc/get-dmarc-record');
const isBase64 = require('is-base64');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const ms = require('ms');
const pMap = require('p-map');
const revHash = require('rev-hash');
const striptags = require('striptags');
const { boolean } = require('boolean');
const { convert } = require('html-to-text');
const { isPort, isURL } = require('@forwardemail/validator');
const tlds = require('tlds');

const pkg = require('../../package.json');
const _ = require('#helpers/lodash');

const isEmail = require('#helpers/is-email');
const REGEX_LOCALHOST = require('#helpers/regex-localhost');
const env = require('#config/env');
const config = require('#config');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const parseRootDomain = require('#helpers/parse-root-domain');
const retryRequest = require('#helpers/retry-request');
const verificationRecordOptions = require('#config/verification-record');
const { encrypt, decrypt } = require('#helpers/encrypt-decrypt');
const {
  hasReputableDNS,
  respondsToHTTP
} = require('#helpers/check-domain-reputation');

const concurrency = os.cpus().length;
const CACHE_TYPES = ['NS', 'MX', 'TXT'];
const CLOUDFLARE_PURGE_CACHE_URL = 'https://1.1.1.1/api/v1/purge';
const USER_AGENT = `${pkg.name}/${pkg.version}`;

// <https://github.com/validatorjs/validator.js/blob/master/src/lib/isEmail.js>
const quotedEmailUserUtf8 = new RE2(
  // eslint-disable-next-line no-control-regex
  /^([\s\u0001-\u0008\u000E-\u001F!\u0023-\u005B\u005D-\u007F\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\u0001-\u0009\u000B-\u007F\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i
);

// <https://github.com/nodejs/node/blob/08dd4b1723b20d56fbedf37d52e736fe09715f80/lib/dns.js#L296-L320>
// <https://docs.rs/c-ares/4.0.3/c_ares/enum.Error.html>
const DNS_RETRY_CODES = new Set([
  'EADDRGETNETWORKPARAMS',
  'EBADFAMILY',
  'EBADFLAGS',
  'EBADHINTS',
  'EBADNAME',
  'EBADQUERY',
  'EBADRESP',
  'EBADSTR',
  'ECANCELED',
  'ECANCELLED',
  'ECONNREFUSED',
  'EDESTRUCTION',
  'EFILE',
  'EFORMERR',
  'ELOADIPHLPAPI',
  // NOTE: ENODATA is handled by error handling below
  // 'ENODATA',
  'ENOMEM',
  'ENONAME',
  // NOTE: ENOTFOUND is handled by error handling below
  // 'ENOTFOUND',
  'ENOTIMP',
  'ENOTINITIALIZED',
  'EOF',
  'EREFUSED',
  // NOTE: ESERVFAIL indicates the NS does not work
  'ESERVFAIL',
  'ETIMEOUT'
]);

const EXCHANGES = config.exchanges
  .map((exchange) => `<li><code>10 ${exchange}</code> (10 = Priority)</li>`)
  .join('');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const REGEX_MAIL_DISPOSABLE_INBOX = new RE2(
  /disposable|temporary|10minut|24hour|minutemail|tempmail/i
);

//
// TODO: this should be moved to redis or its own package under forwardemail or @ladjs
//
/*
const disposableDomains = new Set();

async function crawlDisposable() {
  try {
    const response = await retryRequest(
      'https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.json',
      { resolver }
    );

    const json = await response.body.json();
    if (!Array.isArray(json) || json.length === 0) {
      throw new Error('Disposable did not crawl data.');
    }

    for (const d of json) {
      disposableDomains.add(d);
    }
  } catch (err) {
    logger.error(err);
  }
}
*/

const REGEX_VERIFICATION = new RE2(/[^\da-z]/i);

const WILDCARD_TLDS = new Set();

for (const tld of tlds) {
  WILDCARD_TLDS.add(`*.${punycode.toASCII(tld)}`);
}

function isWildcardTLD(v) {
  return WILDCARD_TLDS.has(v);
}

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'MONGO_URI'
);
if (!conn) {
  throw new Error('Mongoose connection does not exist');
}

const Token = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    index: true,
    required: true
  },
  description: {
    type: String,
    maxlength: 150,
    trim: true
  },
  salt: {
    type: String,
    select: false,
    required: true
  },
  hash: {
    type: String,
    select: false,
    required: true
  },
  has_pbkdf2_migration: {
    type: Boolean,
    default: false,
    select: false
  }
});

Token.plugin(mongooseCommonPlugin, {
  object: 'token',
  omitCommonFields: false,
  omitExtraFields: ['_id', '__v', 'salt', 'hash', 'has_pbkdf2_migration'],
  uniqueId: false,
  locale: false
});

const Member = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    index: true
  },
  group: {
    type: String,
    default: 'user',
    enum: ['admin', 'user'],
    lowercase: true,
    trim: true,
    index: true
  }
});

Member.plugin(mongooseCommonPlugin, {
  object: 'member',
  omitCommonFields: false,
  omitExtraFields: ['_id', '__v'],
  uniqueId: false,
  locale: false
});

const Invite = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
    trim: true,
    lowercase: true,
    validate: (value) => isEmail(value)
  },
  group: {
    type: String,
    default: 'user',
    enum: ['admin', 'user'],
    lowercase: true,
    trim: true
  }
});

Invite.plugin(mongooseCommonPlugin, {
  object: 'invite',
  omitCommonFields: false,
  omitExtraFields: ['_id', '__v'],
  uniqueId: false,
  locale: false
});

const Domains = new mongoose.Schema({
  // opt-in delivery logs (success)
  has_delivery_logs: {
    type: Boolean,
    default: false
  },

  // domain specific max quota per alias
  max_quota_per_alias: {
    type: Number,
    min: 0,
    //
    // NOTE: hard-coded max of 100 GB (safeguard)
    //
    max: bytes('100GB')
  },
  // URL to POST to when a bounce is detected from outbound SMTP servers
  // (NOTE: see additional validation below where we prevent localhost and private IP's from being webhooks)
  bounce_webhook: {
    type: String,
    trim: true,
    validate: (value) =>
      typeof value === 'string' ? isURL(value, config.isURLOptions) : true
  },
  // once a week we email courtesy email in case bounce webhook error
  bounce_webhook_sent_at: Date,
  has_newsletter: {
    type: Boolean,
    default: false,
    index: true
  },
  newsletter_sent_at: Date,

  // <https://github.com/forwardemail/free-email-forwarding/issues/235>
  webhook_key: {
    type: String
  },

  ignore_mx_check: {
    type: Boolean,
    default: false
  },

  retention_days: {
    type: Number,
    min: 0,
    max: 30,
    default: 0
  },

  // booleans for lookup optimizations
  has_regex: { type: Boolean, default: true },
  has_catchall: { type: Boolean, default: true },

  //
  // NOTE: allowlist/denylist are stored in DB as an array
  //       but when rendered we join by \n in a <textarea>
  //       and allow users to use comma, space, or newline to delimit
  //       (we automatically filter for to lowercase and uniqueness, and compact)
  //
  allowlist: [String],
  denylist: [String],

  // restricted alias names for admins only (prevents non-admin from using)
  restricted_alias_names: [String],

  has_adult_content_protection: {
    type: Boolean,
    default: true
  },
  has_phishing_protection: {
    type: Boolean,
    default: true
  },
  has_executable_protection: {
    type: Boolean,
    default: true
  },
  has_virus_protection: {
    type: Boolean,
    default: true
  },

  // On larger domains with 1K+ aliases (or global domains)
  // we prohibit catch-all aliases
  is_catchall_regex_disabled: {
    type: Boolean,
    default: false
  },

  //
  // domains can be individually suspended by admins
  // or automatically by SMTP outbound responses
  // (e.g. automatic spam responses from Gmail/Apple)
  // (note that this only currently affects outbound SMTP)
  //
  smtp_emails_blocked: [
    {
      type: String,
      trim: true,
      lowercase: true,
      validate: (value) => isEmail(value)
    }
  ],
  smtp_last_checked_at: Date,
  smtp_verified_at: Date,
  has_smtp: {
    type: Boolean,
    default: false,
    index: true
  },
  smtp_suspended_sent_at: {
    type: Date,
    index: true
  },
  is_smtp_suspended: {
    type: Boolean,
    default: false,
    index: true
  },

  // When the txt/mx was last checked at
  last_checked_at: Date,

  // If the user was suspended for non-payment, the date of notice sent
  email_suspended_sent_at: Date,

  is_api: {
    type: Boolean,
    default: false
  },
  plan: {
    type: String,
    enum: ['free', 'enhanced_protection', 'team'],
    default: 'free',
    index: true
  },
  max_recipients_per_alias: {
    type: Number,
    default: 0,
    min: 0,
    max: 1000
  },
  smtp_port: {
    type: String,
    default: '25',
    validator: (value) => isPort(value)
  },
  alias_count: {
    type: Number,
    min: 0,
    index: true
  },
  members: [Member],
  invites: [Invite],
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  dkim_modulus_length: {
    type: Number,
    default: config.defaultModulusLength,
    enum: [1024, 2048]
  },
  dkim_key_selector: {
    type: String,
    default: () => `fe-${revHash(dayjs().format('YYYYMMDDHHmmss'))}`
  },
  dkim_private_key: String,
  // Rendered as base64 in front-end
  dkim_public_key: mongoose.Schema.Types.Buffer,
  return_path: {
    type: String,
    default: config.returnPath
  },
  has_mx_record: {
    type: Boolean,
    default: false,
    index: true
  },
  has_txt_record: {
    type: Boolean,
    default: false,
    index: true
  },
  is_global: {
    type: Boolean,
    default: false,
    index: true
  },
  verification_record: {
    type: String,
    index: true,
    required: true,
    unique: true
  },

  //
  // outbound smtp related
  //
  has_dkim_record: {
    type: Boolean,
    default: false,
    index: true
  },
  has_return_path_record: {
    type: Boolean,
    default: false,
    index: true
  },
  has_dmarc_record: {
    type: Boolean,
    default: false,
    index: true
  },
  // tracks if DMARC policy is set to p=reject (recommended)
  has_strict_dmarc: {
    type: Boolean,
    default: false,
    index: true
  },
  has_spf_record: {
    type: Boolean,
    default: false,
    index: true
  },
  missing_smtp_sent_at: Date,
  restrictions_reminder_sent_at: Date,
  onboard_email_sent_at: Date,
  verified_email_sent_at: Date,
  missing_txt_sent_at: Date,
  multiple_exchanges_sent_at: Date,
  //
  // Require TLS for inbound connections
  // When enabled, the server will reject emails that are not sent over TLS
  // This provides enhanced security for domains that require encrypted connections
  //
  require_tls_inbound: {
    type: Boolean,
    default: false,
    index: true
  },

  // Default option to require `has_recipient_verification`
  // on all aliases for verification emails to send
  has_recipient_verification: {
    type: Boolean,
    // If true then aliases default to true
    // (if not explicitly set, e.g. via API request)
    default: false
  },
  // Premium alias verification template
  // (manually enabled by admins only upon request)
  has_custom_verification: {
    type: Boolean,
    default: false
  },
  custom_verification: {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: (value) => isEmail(value) || value === ''
    },
    subject: {
      type: String,
      trim: true
    },
    html: {
      type: String,
      trim: true
    },
    text: {
      type: String,
      trim: true
    },
    redirect: {
      type: String,
      trim: true,
      validate: (value) => isURL(value) || value === ''
    }
  },
  // Nameservers (Array of either IP or FQDN)
  ns: [
    {
      type: String,
      validate: (value) => isIP(value) || isFQDN(value)
    }
  ],
  tokens: [Token]
});

// Domain compound index for auth query
Domains.index({ name: 1, verification_record: 1, plan: 1 });

// Member user index
Domains.index({ 'members.user': 1, 'members.group': 1 });

Domains.index({ plan: 1, has_txt_record: 1, _id: 1 });

Domains.index(
  { smtp_suspended_sent_at: 1 },
  {
    partialFilterExpression: {
      smtp_suspended_sent_at: { $exists: true }
    }
  }
);

Domains.index({ 'members.user': 1, 'members.group': 1 });

Domains.index({
  name: 1,
  verification_record: 1
});

Domains.index({
  name: 1,
  verification_record: 1,
  plan: 1
});

// Shared tangerine resolver
Domains.virtual('resolver')
  .get(function () {
    return this.__resolver;
  })
  .set(function (resolver) {
    this.__resolver = resolver;
  });

Domains.virtual('link')
  .get(function () {
    return this.__link;
  })
  .set(function (link) {
    this.__link = link;
  });

Domains.virtual('skip_payment_check')
  .get(function () {
    return this.__skip_payment_check;
  })
  .set(function (skipPaymentCheck) {
    this.__skip_payment_check = boolean(skipPaymentCheck);
  });

Domains.virtual('skip_verification')
  .get(function () {
    return this.__skip_verification;
  })
  .set(function (skipVerification) {
    this.__skip_verification = boolean(skipVerification);
  });

Domains.virtual('skip_ns_check')
  .get(function () {
    return this.__skip_ns_check;
  })
  .set(function (skipNsCheck) {
    this.__skip_ns_check = boolean(skipNsCheck);
  });

Domains.pre('remove', function (next) {
  if (this.is_global) {
    return next(
      Boom.badRequest(
        i18n.translateError('CANNOT_REMOVE_GLOBAL_DOMAIN', this.locale)
      )
    );
  }

  next();
});

// generate webhook_key if one does not exist
Domains.pre('validate', function (next) {
  if (isSANB(this.webhook_key)) return next();
  try {
    this.webhook_key = encrypt(crypto.randomBytes(16).toString('hex'));
    next();
  } catch (err) {
    next(err);
  }
});

Domains.pre('validate', function (next) {
  for (const key of ['allowlist', 'denylist']) {
    if (!Array.isArray(this[key])) this[key] = [];

    // cleanup allowlist/denylist
    this[key] = _.compact(_.uniq(this[key].map((v) => v.toLowerCase().trim())));

    // must be IP, FQDN, email, or wildcard TLD
    this[key] = this[key].filter(
      (v) => isIP(v) || isFQDN(v) || isEmail(v) || isWildcardTLD(v)
    );

    // can have at most 1000 entries in each list (arbitrary, can increase later)
    if (this[key].length > 1000)
      return next(
        Boom.badRequest(
          i18n.translateError(
            'ALLOWLIST_DENYLIST_EXCEEDS_LIMIT',
            this.locale,
            1000
          )
        )
      );
  }

  next();
});

// Set a default dkim key for the user
Domains.pre('validate', async function (next) {
  if (isSANB(this.dkim_private_key)) {
    return next();
  }

  // If the provider is cloudflare then default to 2048 bit modulus
  if (
    Array.isArray(this.ns) &&
    this.ns.length > 0 &&
    this.ns.every((value) => value.endsWith('cloudflare.com')) &&
    !this.skip_ns_check
  ) {
    this.dkim_modulus_length = 2048;
  }

  try {
    const { privateKey, publicKey } = await promisify(crypto.generateKeyPair)(
      'rsa',
      {
        modulusLength: this.dkim_modulus_length || config.defaultModulusLength,
        // Default as of nodemailer v6.9.1
        hashAlgorithm: 'RSA-SHA256',
        publicKeyEncoding: {
          type: 'spki',
          format: 'der'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      }
    );
    this.dkim_private_key = encrypt(privateKey);
    this.dkim_public_key = publicKey;
  } catch (err) {
    next(err);
  }
});

Domains.pre('validate', async function (next) {
  try {
    const domain = this;
    if (!domain.plan) {
      domain.plan = 'free';
    }

    if (domain.is_global) {
      domain.plan = 'team';
    }

    // Domain.name must be IP or FQDN
    if (!isSANB(domain.name) || (!isFQDN(domain.name) && !isIP(domain.name))) {
      throw Boom.badRequest(
        i18n.translateError('INVALID_DOMAIN', domain.locale)
      );
    }

    // If it is a FQDN then convert to unicode
    if (isFQDN(domain.name)) {
      domain.name = punycode.toUnicode(domain.name);
      const root = parseRootDomain(domain.name);
      // Domain cannot be one of the trusted senders
      if (config.truthSources.has(root)) {
        const users = await conn.models.Users.find({
          _id: {
            $in: domain.members
              .filter((member) => member.group === 'admin')
              .map((member) =>
                typeof member?.user?._id === 'object'
                  ? member.user._id
                  : member.user
              )
          },
          [config.userFields.hasVerifiedEmail]: true,
          [config.userFields.isBanned]: false
        })
          .select(
            `email ${config.lastLocaleField} ${config.userFields.hasVerifiedEmail}`
          )
          .lean()
          .exec();
        if (
          users.length === 0 ||
          !users.some(
            (u) =>
              u.email.endsWith(`@${root}`) ||
              u.email.endsWith(`@${domain.name}`)
          )
        ) {
          throw Boom.badRequest(
            i18n.translateError(
              'ALLOWLIST_DOMAIN_NOT_ALLOWED',
              domain.locale,
              parseRootDomain(domain.name),
              `/${domain.locale}/help`
            )
          );
        }
      }
    }

    if (!isSANB(this.verification_record)) {
      this.verification_record = await cryptoRandomString.async(
        verificationRecordOptions
      );
    }

    if (
      this.verification_record.replace(REGEX_VERIFICATION, '') !==
      this.verification_record
    ) {
      throw Boom.badRequest(
        i18n.translateError('INVALID_VERIFICATION_RECORD', domain.locale)
      );
    }

    next();
  } catch (err) {
    next(err);
  }
});

Domains.pre('validate', function (next) {
  if (
    !Array.isArray(this.members) ||
    this.members.length === 0 ||
    !this.members.some(
      (member) => typeof member.user !== 'undefined' && member.group === 'admin'
    )
  ) {
    throw Boom.badRequest(
      i18n.translateError('AT_LEAST_ONE_ADMIN_REQUIRED', this.locale)
    );
  }

  next();
});

// Prevent new domains from being created with a plan
// that the user is not yet subscribed to, and also
// enforce that when domains are saved, they are required
// to have at least one admin with the plan of the domain
// (otherwise throw an error that tells them what's wrong)
Domains.pre('validate', async function (next) {
  // We can skip this for TXT validation since it has duplicate logic
  if (this.skip_payment_check) {
    return next();
  }

  try {
    const domain = this;

    const { isGood, isDisposable, isRestricted } = getNameRestrictions(
      domain.name
    );

    const users = await conn.models.Users.find({
      _id: { $in: domain.members.map((m) => m.user) }
    })
      .lean()
      .select(`id plan email ${config.userFields.maxQuotaPerAlias}`)
      .exec();

    //
    // NOTE: we ensure that max quota per alias cannot exceed global
    //       max or value higher than any current admin's max quota
    //
    const adminUserIds = new Set(
      domain.members
        .filter((m) => m.group === 'admin' && m.user)
        .map((m) =>
          m?.user?._id
            ? m.user._id.toString()
            : m?.user?.id || m.user.toString()
        )
    );
    const adminUsers = users.filter((user) => adminUserIds.has(user.id));

    const adminMaxQuota =
      adminUsers.length === 0
        ? config.maxQuotaPerAlias
        : _.max(
            adminUsers.map((user) =>
              typeof user[config.userFields.maxQuotaPerAlias] === 'number'
                ? user[config.userFields.maxQuotaPerAlias]
                : config.maxQuotaPerAlias
            )
          );

    //
    // NOTE: hard-coded max of 100 GB (safeguard)
    //
    const maxQuota = _.clamp(adminMaxQuota, 0, bytes('100GB'));
    if (
      Number.isFinite(domain.max_quota_per_alias) &&
      domain.max_quota_per_alias > maxQuota
    )
      throw Boom.badRequest(
        i18n.translateError(
          'DOMAIN_MAX_QUOTA_EXCEEDS_USER',
          domain.locale,
          domain.name,
          bytes(domain.max_quota_per_alias),
          bytes(maxQuota)
        )
      );

    const hasValidPlan = users.some((user) => {
      if (domain.plan === 'team' && user.plan === 'team') {
        return true;
      }

      if (
        domain.plan === 'enhanced_protection' &&
        ['enhanced_protection', 'team'].includes(user.plan)
      ) {
        return true;
      }

      return false;
    });

    // If it is a restricted domain then ensure has paid plan
    // and ensure every user has a restricted extension (no personal emails allowed)
    if (isRestricted) {
      const badUserEmails = [];
      for (const user of users) {
        if (
          config.restrictedDomains.every(
            (ext) => !user.email.endsWith(`.${ext}`)
          )
        ) {
          badUserEmails.push(user.email);
        }
      }

      if (badUserEmails.length > 0) {
        logger.debug(
          new Error(
            `Restricted domain had personal emails: ${domain.name} (${domain.id})`
          ),
          { domain, badUserEmails }
        );
      }

      // If the domain is not on a paid plan then it's not valid
      if (domain.plan === 'free') {
        throw Boom.paymentRequired(
          i18n.translateError(
            'RESTRICTED_PLAN_UPGRADE_REQUIRED',
            domain.locale,
            domain.name,
            `/${domain.locale}/my-account/domains/${punycode.toASCII(
              domain.name
            )}/billing?plan=enhanced_protection`
          )
        );
      }
    }

    if (domain.plan === 'free') {
      if (!isGood) {
        throw Boom.paymentRequired(
          i18n.translateError(
            'MALICIOUS_DOMAIN_PLAN_UPGRADE_REQUIRED',
            domain.locale,
            domain.name,
            `/${domain.locale}/my-account/domains/${punycode.toASCII(
              domain.name
            )}/billing?plan=enhanced_protection`
          )
        );
      }

      // If the domain contained any of these words then require paid upgrade
      // - mail
      // - disposable
      // - inbox
      if (isDisposable) {
        throw Boom.paymentRequired(
          i18n.translateError(
            'RESERVED_KEYWORD_DOMAIN_PLAN_UPGRADE_REQUIRED',
            domain.locale,
            domain.name,
            `/${domain.locale}/my-account/domains/${punycode.toASCII(
              domain.name
            )}/billing?plan=enhanced_protection`
          )
        );
      }
    }

    if (!hasValidPlan && domain.plan !== 'free') {
      throw Boom.paymentRequired(
        i18n.translateError(
          'DOMAIN_PLAN_UPGRADE_REQUIRED',
          domain.locale,
          domain.name,
          i18n.translate(domain.plan.toUpperCase(), domain.locale),
          `/${domain.locale}/my-account/domains/${punycode.toASCII(
            domain.name
          )}/billing?plan=${domain.plan}`
        )
      );
    }

    next();
  } catch (err) {
    next(err);
  }
});

Domains.pre('validate', function (next) {
  const domain = this;
  // Domain must be on a paid plan in order to require verification
  if (domain.plan === 'free' && domain.has_recipient_verification) {
    return next(
      Boom.badRequest(
        i18n.translateError(
          'PAID_PLAN_REQUIRED_FOR_RECIPIENT_VERIFICATION',
          domain.locale
        )
      )
    );
  }

  next();
});

Domains.pre('validate', function (next) {
  const domain = this;

  // Boolean helper for fast querying against an indexed boolean
  domain.is_smtp_suspended = _.isDate(domain.smtp_suspended_sent_at);

  // We return early here in case the boolean was set to false
  // and we want to preserve what the user had already set for templates
  // (e.g. as a backup in case they ever restore it or we turn it back on)
  if (!domain.has_custom_verification) {
    return next();
  }

  // If template was empty for html then assume it's not set
  if (!isSANB(domain.custom_verification.html)) {
    domain.custom_verification.html = '';
    domain.custom_verification.text = '';
    return next();
  }

  // Strip subject of all tags
  domain.custom_verification.subject = striptags(
    domain.custom_verification.subject
  );

  if (!isSANB(domain.custom_verification.subject)) {
    domain.custom_verification.subject = '';
  }

  // TODO: clean up the HTML
  if (!isSANB(domain.custom_verification.html)) {
    domain.custom_verification.html = '';
    domain.custom_verification.text = '';
    return next();
  }

  // Ensure that the HTML has at least one occurrence
  // of the `VERIFICATION_LINK` variable
  // (even though we interpolate all of them)
  if (!domain.custom_verification.html.includes('VERIFICATION_LINK')) {
    return next(
      Boom.badRequest(
        i18n.translateError('MISSING_VERIFICATION_LINK', domain.locale)
      )
    );
  }

  // Auto-generate text portion if blank
  if (isSANB(domain.custom_verification.text)) {
    domain.custom_verification.text = striptags(
      domain.custom_verification.text
    );
  } else {
    domain.custom_verification.text = convert(domain.custom_verification.html, {
      selectors: [{ selector: 'img', format: 'skip' }]
    });
  }

  // Ensure that text has at least one occurrence
  // of the `VERIFICATION_LINK` variable
  // (even though we interpolate all of them)
  if (!domain.custom_verification.text.includes('VERIFICATION_LINK')) {
    return next(
      Boom.badRequest(
        i18n.translateError('MISSING_VERIFICATION_LINK', domain.locale)
      )
    );
  }

  next();
});

//
// If the domain isNew and it's one of the ubuntu domains
// then prevent creating it if one already exists
// and instead, throw an error that informs the user to
// sign in with their Ubuntu SSO account
//
Domains.pre('save', async function (next) {
  if (!this.isNew) return next();

  if (!Object.keys(config.ubuntuTeamMapping).includes(this.name)) return next();

  // lookup the domain to see if it exists
  const exists = await this.constructor.exists({
    name: this.name,
    plan: 'team',
    has_txt_record: true
  });

  if (exists)
    throw Boom.badRequest(
      i18n.translateError(
        'UBUNTU_LOGIN_REQUIRED',
        this.locale,
        `${config.urls.web}/ubuntu`
      )
    );

  next();
});

//
// Prevent `bounce_webhook` from being localhost or private IP
//
// NOTE: this similar logic is also in MX server to prevent local-like webhooks in MX
//
Domains.pre('save', async function (next) {
  if (!isSANB(this.bounce_webhook)) return next();
  if (config.env === 'test' && this.bounce_webhook.endsWith('?test=true'))
    return next();
  try {
    // TODO: we may want to prevent localhost bound reverse hostname
    //       (in which case we'd need `punycode.toASCII` on the domain)
    if (
      isIP(parseRootDomain(this.bounce_webhook)) &&
      REGEX_LOCALHOST.test(parseRootDomain(this.bounce_webhook))
    )
      throw Boom.badRequest(
        i18n.translateError('INVALID_LOCALHOST_URL', this.locale)
      );
    next();
  } catch (err) {
    next(err);
  }
});

// Validate and convert to lowercase restricted alias names
Domains.pre('save', function (next) {
  if (
    !Array.isArray(this.restricted_alias_names) ||
    this.restricted_alias_names.length === 0
  )
    return next();

  // make compact / unique / lowercased
  this.restricted_alias_names = _.compact(
    _.uniq(this.restricted_alias_names.map((name) => name.toLowerCase()))
  );

  // validate they're actual alias usernames
  for (const name of this.restricted_alias_names) {
    if (!quotedEmailUserUtf8.test(name))
      return next(
        Boom.badRequest(
          i18n.translateError('INVALID_LOCAL_PART', this.locale, name)
        )
      );
  }

  next();
});

// Prevent members from existing on domains after plan changes
Domains.pre('save', function (next) {
  if (this.plan === 'team') {
    return next();
  }

  if (this.members.length === 1) {
    return next();
  }

  return next(
    Boom.badRequest(
      i18n.translateError('REMOVE_MEMBERS_BEFORE_PLAN_CHANGE', this.locale)
    )
  );
});

Domains.pre('save', async function (next) {
  try {
    const domain = this;

    // Helper virtual to skip verification results
    // (e.g. when onboarding a user that's just visiting the API/FAQ page)
    // (or if we already performed the verification results lookup)
    if (domain.skip_verification) {
      return next();
    }

    // If (!domain.resolver) {
    //   logger.fatal(new Error('Resolver not passed'));
    //   return next();
    // }

    const { ns, txt, mx, errors } = await getVerificationResults(
      domain,
      domain.resolver
    );

    //
    // run a save on the domain name
    // (as long as `errors` does not have a temporary DNS error)
    //
    const hasDNSError =
      Array.isArray(errors) &&
      errors.some((error) => error.code && DNS_RETRY_CODES.has(error.code));

    if (!hasDNSError) {
      // Reset missing txt so we alert users if they are missing a TXT in future again
      if (
        !domain.has_txt_record &&
        txt &&
        _.isDate(domain.missing_txt_sent_at)
      ) {
        domain.missing_txt_sent_at = undefined;
      }

      // Reset multiple exchanges error so we alert users if they have multiple MX in the future
      if (
        !domain.has_mx_record &&
        mx &&
        _.isDate(domain.multiple_exchanges_sent_at)
      ) {
        domain.multiple_exchanges_sent_at = undefined;
      }

      domain.has_txt_record = txt;
      domain.has_mx_record = mx;
      if (ns) {
        domain.ns = ns;
      }
    }

    // Store when we last checked it
    domain.last_checked_at = new Date();

    next();
  } catch (err) {
    next(err);
  }
});

// TODO: move this into an automated job and also on alias save
Domains.pre('save', async function (next) {
  if (this.is_catchall_regex_disabled) return next();

  try {
    if (typeof conn?.models?.Aliases?.aggregate !== 'function')
      throw new TypeError('Aliases model is not ready');

    const count = await conn.models.Aliases.countDocuments({
      domain: this._id
    });

    if (count >= 10000 || this.is_global) {
      this.is_catchall_regex_disabled = true;
      return next();
    }

    const arr = await conn.models.Aliases.aggregate([
      { $match: { domain: this._id } },
      { $group: { _id: '$name' } }
    ])
      .allowDiskUse(true)
      .exec();

    let hasCatchall = false;
    let hasRegex = false;

    for (const v of arr) {
      if (hasCatchall && hasRegex) break;
      if (v._id === '*') hasCatchall = true;
      else if (v._id.startsWith('/')) hasRegex = true;
    }

    this.has_catchall = hasCatchall;
    this.has_regex = hasRegex;
  } catch (err) {
    logger.fatal(err);
  }

  next();
});

// if `ignore_mx_check` is true then set `has_mx_record` to `true`
Domains.pre('save', function (next) {
  if (this.ignore_mx_check === true) this.has_mx_record = true;
  next();
});

Domains.plugin(mongooseCommonPlugin, {
  object: 'domain',
  omitExtraFields: [
    'alias_count',
    'is_global',
    'is_api',
    'onboard_email_sent_at',
    'verified_email_sent_at',
    'smtp_last_checked_at',
    // 'smtp_verified_at',
    // 'smtp_suspended_sent_at',
    // 'is_smtp_suspended',
    'last_checked_at',
    'email_suspended_sent_at',
    'missing_txt_sent_at',
    'multiple_exchanges_sent_at',
    'ns',
    'dkim_modulus_length',
    'dkim_key_selector',
    'dkim_private_key',
    'dkim_public_key',
    'return_path',
    'missing_smtp_sent_at',
    // 'has_dkim_record',
    // 'has_return_path_record',
    // 'has_dmarc_record',
    'smtp_emails_blocked',
    'tokens',
    'webhook_key'
  ],
  mongooseHidden: {
    virtuals: {
      resolver: 'hide'
    }
  },
  defaultLocale: i18n.config.defaultLocale
});

async function getNSRecords(domain, resolver) {
  let ns = false;
  const errors = [];
  try {
    let records = await resolver.resolveNs(domain.name, {
      purgeCache: true
    });
    if (Array.isArray(records) && records.length > 0) {
      // Filter records for IP and FQDN only values
      records = records.filter(
        (record) => (isSANB(record) && isIP(record)) || isFQDN(record)
      );
      // Only set `ns` if we have at least one record
      if (records.length > 1) {
        ns = records;
      }
    }
  } catch (err) {
    try {
      const rootDomain = parseRootDomain(domain.name);
      if (rootDomain === domain.name) {
        // logger.debug(err);
        if (err.code === 'ENOTFOUND') {
          const error = Boom.badRequest(
            i18n.translateError('ENOTFOUND', domain.locale)
          );
          error.code = err.code;
          errors.push(error);
        } else if (err.code === 'ENODATA') {
          const error = Boom.badRequest(
            i18n.translateError('MISSING_DNS_NS', domain.locale)
          );
          error.code = err.code;
          errors.push(error);
        } else if (err.code && DNS_RETRY_CODES.has(err.code)) {
          const error = Boom.badRequest(
            i18n.translateError('DNS_RETRY', domain.locale, err.code)
          );
          error.code = err.code;
          errors.push(error);
        } else {
          errors.push(err);
        }
      } else if (err.code === 'ENOTFOUND' || err.code === 'ENODATA') {
        //
        // NOTE: we only want to do this if ENOTFOUND or ENODATA
        //
        // perform lookup on root domain and use those values instead
        //
        let records = await resolver.resolveNs(rootDomain, {
          purgeCache: true
        });
        if (Array.isArray(records) && records.length > 0) {
          // Filter records for IP and FQDN only values
          records = records.filter(
            (record) => (isSANB(record) && isIP(record)) || isFQDN(record)
          );
          // Only set `ns` if we have at least one record
          if (records.length > 1) {
            ns = records;
          }
        }
      }
    } catch (err) {
      // logger.debug(err);
      if (err.code === 'ENOTFOUND') {
        const error = Boom.badRequest(
          i18n.translateError('ENOTFOUND', domain.locale)
        );
        error.code = err.code;
        errors.push(error);
      } else if (err.code === 'ENODATA') {
        const error = Boom.badRequest(
          i18n.translateError('MISSING_DNS_NS', domain.locale)
        );
        error.code = err.code;
        errors.push(error);
      } else if (err.code && DNS_RETRY_CODES.has(err.code)) {
        const error = Boom.badRequest(
          i18n.translateError('DNS_RETRY', domain.locale, err.code)
        );
        error.code = err.code;
        errors.push(error);
      } else {
        errors.push(err);
      }
    }
  }

  return { ns, errors };
}

async function verifySMTP(domain, resolver, purgeCache = true) {
  const errors = [];
  let ns = false;
  let dkim = false;
  let returnPath = false;
  let dmarc = false;
  let strictDmarc = false;
  let spf = false;
  let hasLegitimateHosting = false;
  let reputableDNS = false;
  let legitimateA = false;
  let httpResponds = false;

  //
  // attempt to purge Cloudflare cache programmatically
  //
  if (purgeCache) {
    // NOTE: we don't purge ns here since we assume it's already setup
    const records = [
      {
        // Dkim
        domain: `${domain.dkim_key_selector}._domainkey.${domain.name}`,
        type: 'TXT'
      },
      {
        // Return-path
        domain: `${domain.return_path}.${domain.name}`,
        type: 'CNAME'
      },
      {
        // Dmarc
        domain: `_dmarc.${domain.name}`,
        type: 'TXT'
      },
      {
        // SPF
        domain: domain.name,
        type: 'TXT'
      }
    ];

    try {
      await pMap(
        records,
        async (record) => {
          const url = new URL(CLOUDFLARE_PURGE_CACHE_URL);
          url.searchParams.append('domain', record.domain);
          url.searchParams.append('type', record.type);
          const response = await retryRequest(url, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'User-Agent': USER_AGENT
            },
            timeout: ms('3s'),
            retries: 1,
            resolver
          });
          // consume body
          if (
            !response?.signal?.aborted &&
            typeof response?.body?.dump === 'function'
          )
            await response.body.dump();
        },
        { concurrency }
      );
      logger.debug('cleared DNS cache for cloudflare', {
        domain,
        records
      });
      // Wait one second for DNS changes to propagate
      await setTimeout(ms('1s'));
    } catch (err) {
      err.domain = domain;
      err.records = records;
      logger.error(err);
    }
  }

  await Promise.all([
    //
    // fetch NS records (same as in `getVerificationResults`)
    //
    (async function () {
      const results = await getNSRecords(domain, resolver);
      ns = results.ns;
      errors.push(...results.errors);
      //
      // check NS records for reputable DNS providers
      //
      if (Array.isArray(ns) && ns.length > 0)
        reputableDNS = hasReputableDNS(ns, domain.name);
    })(),

    //
    // check A records for legitimate hosting (not parking pages)
    //
    (async function () {
      try {
        const aRecords = await resolver.resolve4(domain.name, {
          purgeCache: true
        });
        if (Array.isArray(aRecords) && aRecords.length > 0)
          legitimateA = hasLegitimateHosting(aRecords);
      } catch (err) {
        logger.debug(err);
      }
    })(),

    //
    // check HTTP response (basic availability check)
    //
    (async function () {
      try {
        httpResponds = await respondsToHTTP(domain.name);
      } catch (err) {
        logger.debug(err);
      }
    })(),

    //
    // fetch dkim record (TXT)
    //
    (async function () {
      try {
        const records = await resolver.resolveTxt(
          `${domain.dkim_key_selector}._domainkey.${domain.name}`,
          { purgeCache: true }
        );
        const string_ = `v=DKIM1; k=rsa; p=${domain.dkim_public_key.toString(
          'base64'
        )};`.trim();
        for (const record of records) {
          // <https://github.com/forwardemail/forwardemail.net/issues/201>
          const line = record
            .join('')
            .split(';')
            .join('; ')
            // Remove double whitespace
            .replace(/\s\s+/g, ' ')
            .trim(); // Join chunks together
          if (line === string_ || line === string_.slice(0, -1)) {
            dkim = true;
            break;
          }
        }
      } catch (err) {
        logger.debug(err);
        // TODO: isCodeBug needs integrated anywhere resolver is used
        if (err.code && DNS_RETRY_CODES.has(err.code)) {
          const error = Boom.badRequest(
            i18n.translateError('DNS_RETRY', domain.locale, err.code)
          );
          error.code = err.code;
          errors.push(error);
        } else if (err.code !== 'ENOTFOUND') {
          errors.push(err);
        }
      }
    })(),

    //
    // fetch return-path record (CNAME)
    //
    (async function () {
      try {
        const records = await resolver.resolveCname(
          `${domain.return_path}.${domain.name}`,
          { purgeCache: true }
        );
        if (
          Array.isArray(records) &&
          records.includes(
            config.webHost === 'localhost' && config.env === 'development'
              ? 'forwardemail.net'
              : config.webHost
          )
        ) {
          returnPath = true;
        }
      } catch (err) {
        logger.debug(err);
        // TODO: isCodeBug needs integrated anywhere resolver is used
        if (err.code && DNS_RETRY_CODES.has(err.code)) {
          const error = Boom.badRequest(
            i18n.translateError('DNS_RETRY', domain.locale, err.code)
          );
          error.code = err.code;
          errors.push(error);
        } else if (err.code !== 'ENOTFOUND') {
          errors.push(err);
        }
      }
    })(),

    //
    // fetch dmarc record (TXT)
    //
    (async function () {
      try {
        // <https://github.com/postalsys/mailauth#dmarc>
        // <https://github.com/postalsys/mailauth/pull/29>
        // <https://github.com/postalsys/mailauth/issues/27>
        await resolver.resolveTxt(`_dmarc.${domain.name}`, {
          purgeCache: true
        });
        const dmarcRecord = await getDmarcRecord(domain.name, resolver.resolve);
        // {
        //   v: 'DMARC1',
        //   p: 'none',
        //   pct: 100,
        //   rua: 'mailto:foo@bar.com',
        //   sp: 'none',
        //   aspf: 'r',
        //   rr: 'v=DMARC1; p=none; pct=100; rua=mailto:foo@bar.com; sp=none; aspf=r;',
        //   isOrgRecord: false
        // }
        if (
          dmarcRecord &&
          dmarcRecord.v === 'DMARC1' &&
          (typeof dmarcRecord.pct !== 'number' || dmarcRecord.pct === 100)
        ) {
          dmarc = true;
          // track if DMARC has strict p=reject policy
          if (dmarcRecord.p === 'reject') {
            strictDmarc = true;
          }
        }
      } catch (err) {
        logger.debug(err);
        // TODO: isCodeBug needs integrated anywhere resolver is used
        if (err.code && DNS_RETRY_CODES.has(err.code)) {
          const error = Boom.badRequest(
            i18n.translateError('DNS_RETRY', domain.locale, err.code)
          );
          error.code = err.code;
          errors.push(error);
        } else if (err.code !== 'ENOTFOUND') {
          errors.push(err);
        }
      }
    })(),

    //
    // fetch spf record (TXT)
    //
    (async function () {
      try {
        const records = await resolver.resolveTxt(domain.name, {
          purgeCache: true
        });
        for (const record of records) {
          const line = record.join('').toLowerCase().trim();
          if (
            line.startsWith('v=spf1') &&
            line.includes('include:spf.forwardemail.net')
          ) {
            spf = true;
            break;
          }
        }
      } catch (err) {
        logger.debug(err);
        if (err.code && DNS_RETRY_CODES.has(err.code)) {
          const error = Boom.badRequest(
            i18n.translateError('DNS_RETRY', domain.locale, err.code)
          );
          error.code = err.code;
          errors.push(error);
        } else if (err.code !== 'ENOTFOUND') {
          errors.push(err);
        }
      }
    })()
  ]);

  // domain has legitimate hosting if it has reputable DNS AND legitimate A records AND HTTP response
  hasLegitimateHosting = reputableDNS && legitimateA && httpResponds;

  if (!dkim) {
    errors.push(
      Boom.badRequest(
        i18n.translateError('INVALID_DKIM_SIGNATURE', domain.locale)
      )
    );
  }

  if (!returnPath) {
    errors.push(
      Boom.badRequest(i18n.translateError('INVALID_RETURN_PATH', domain.locale))
    );
  }

  if (!dmarc) {
    errors.push(
      Boom.badRequest(
        i18n.translateError('INVALID_DMARC_RESULT', domain.locale)
      )
    );
  }

  if (!dkim || !returnPath || !dmarc) {
    errors.unshift(
      Boom.badRequest(
        i18n.translateError('DNS_CHANGES_TAKE_TIME', domain.locale)
      )
    );
  }

  return {
    ns,
    dkim,
    returnPath,
    dmarc,
    strictDmarc,
    spf,
    hasLegitimateHosting,
    errors: _.uniqBy(errors, 'message')
  };
}

Domains.statics.verifySMTP = verifySMTP;

async function getVerificationResults(domain, resolver, purgeCache = false) {
  const verificationRecord = `${config.recordPrefix}-site-verification=${domain.verification_record}`;
  const verificationMarkdown = `<span class="markdown-body ml-0 mr-0"><code>${verificationRecord}</code></span>`;
  const isPaidPlan = _.isString(domain.plan) && domain.plan !== 'free';

  //
  // attempt to purge Cloudflare cache programmatically
  //
  if (purgeCache) {
    try {
      await pMap(
        CACHE_TYPES,
        async (type) => {
          const url = new URL(CLOUDFLARE_PURGE_CACHE_URL);
          url.searchParams.append('domain', domain.name);
          url.searchParams.append('type', type);
          const response = await retryRequest(url, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'User-Agent': USER_AGENT
            },
            timeout: ms('3s'),
            retries: 1,
            resolver
          });
          // consume body
          if (
            !response?.signal?.aborted &&
            typeof response?.body?.dump === 'function'
          )
            await response.body.dump();
        },
        { concurrency }
      );
      logger.debug('cleared DNS cache for cloudflare', {
        domain,
        types: CACHE_TYPES
      });
      // Wait one second for DNS changes to propagate
      await setTimeout(ms('1s'));
    } catch (err) {
      err.domain = domain;
      logger.error(err);
    }
  }

  const errors = [];

  let ns = false;
  let txt = false;
  let mx = false;
  let requiresPaidPlan = false;

  await Promise.all([
    //
    // fetch NS records
    // (we store these in order to render helpful animated gifs and videos for user onboarding)
    // (and we also can use these to statistically determine which registrar and DNS providers our users use)
    //
    // NOTE: this first attempts to fetch the domain name (regardless if it was subdomain or root)
    //       but if it was a subdomain and had no NS then it parses the parent
    //
    (async function () {
      const results = await getNSRecords(domain, resolver);
      ns = results.ns;
      errors.push(...results.errors);
    })(),
    //
    // validate TXT records
    //

    (async function () {
      try {
        const result = await getTxtAddresses(
          domain.name,
          domain.locale,
          true,
          resolver
        );

        if (isPaidPlan) {
          if (
            result.forwardingAddresses.length > 0 ||
            result.globalForwardingAddresses.length > 0 ||
            result.ignoredAddresses.length > 0
          ) {
            errors.push(
              Boom.badRequest(
                i18n.translateError(
                  'PAID_PLAN_HAS_UNENCRYPTED_RECORDS',
                  domain.locale,
                  `/my-account/domains/${punycode.toASCII(
                    domain.name
                  )}/aliases`,
                  config.recordPrefix,
                  `/my-account/domains/${punycode.toASCII(domain.name)}`
                )
              )
            );
            txt = true;
          }

          if (result.verifications.length === 0) {
            errors.push(
              Boom.badRequest(
                i18n.translateError(
                  'MISSING_VERIFICATION_RECORD',
                  domain.locale,
                  verificationMarkdown
                )
              )
            );
            txt = false;
          } else if (result.verifications.length > 1) {
            errors.push(
              Boom.badRequest(
                i18n.translateError(
                  'MULTIPLE_VERIFICATION_RECORDS',
                  domain.locale,
                  verificationMarkdown
                )
              )
            );
            txt = false;
          } else if (
            !result.verifications.includes(domain.verification_record)
          ) {
            errors.push(
              Boom.badRequest(
                i18n.translateError(
                  'INCORRECT_VERIFICATION_RECORD',
                  domain.locale,
                  verificationMarkdown
                )
              )
            );
            txt = false;
          }

          if (errors.length === 0 && result.errors.length === 0) {
            txt = true;
          }
        } else if (
          !result.hasRegex &&
          !result.hasBase64 &&
          result.forwardingAddresses.length === 0 &&
          result.globalForwardingAddresses.length === 0 &&
          result.ignoredAddresses.length === 0
        ) {
          errors.push(
            Boom.badRequest(
              i18n.translateError('MISSING_DNS_TXT', domain.locale, domain.name)
            )
          );
        } else if (result.errors.length === 0) {
          const { isGood, isDisposable, isRestricted } = getNameRestrictions(
            domain.name
          );
          if (isRestricted) {
            requiresPaidPlan = true;
            errors.push(
              Boom.paymentRequired(
                i18n.translateError(
                  'RESTRICTED_PLAN_UPGRADE_REQUIRED',
                  domain.locale,
                  domain.name,
                  `/${domain.locale}/my-account/domains/${punycode.toASCII(
                    domain.name
                  )}/billing?plan=enhanced_protection`
                )
              )
            );
          } else if (!isGood) {
            requiresPaidPlan = true;
            errors.push(
              Boom.paymentRequired(
                i18n.translateError(
                  'MALICIOUS_DOMAIN_PLAN_UPGRADE_REQUIRED',
                  domain.locale,
                  domain.name,
                  `/${domain.locale}/my-account/domains/${punycode.toASCII(
                    domain.name
                  )}/billing?plan=enhanced_protection`
                )
              )
            );
          } else if (isDisposable) {
            requiresPaidPlan = true;
            errors.push(
              Boom.paymentRequired(
                i18n.translateError(
                  'RESERVED_KEYWORD_DOMAIN_PLAN_UPGRADE_REQUIRED',
                  domain.locale,
                  domain.name,
                  `/${domain.locale}/my-account/domains/${punycode.toASCII(
                    domain.name
                  )}/billing?plan=enhanced_protection`
                )
              )
            );
          } else {
            txt = true;
          }
        } else {
          errors.push(...result.errors);
        }
      } catch (err) {
        // logger.debug(err);
        if (err.code === 'ENOTFOUND') {
          const error = Boom.badRequest(
            i18n.translateError('ENOTFOUND', domain.locale)
          );
          error.code = err.code;
          errors.push(error);
        } else if (err.code === 'ENODATA') {
          if (isPaidPlan) {
            const error = Boom.badRequest(
              i18n.translateError(
                'MISSING_VERIFICATION_RECORD',
                domain.locale,
                verificationMarkdown
              )
            );
            error.code = err.code;
            errors.push(error);
          } else {
            const error = Boom.badRequest(
              i18n.translateError('MISSING_DNS_TXT', domain.locale, domain.name)
            );
            error.code = err.code;
            errors.push(error);
          }
        } else if (err.code && DNS_RETRY_CODES.has(err.code)) {
          const error = Boom.badRequest(
            i18n.translateError('DNS_RETRY', domain.locale, err.code)
          );
          error.code = err.code;
          errors.push(error);
        } else {
          errors.push(err);
        }
      }
    })(),
    //
    // validate MX records
    //
    (async function () {
      // if `ignore_mx_check` is true then set `has_mx_record` to `true`
      if (domain.ignore_mx_check === true) {
        mx = true;
        return;
      }

      try {
        const results = await resolver.resolveMx(domain.name, {
          purgeCache: true
        });
        const exchanges = results.map((result) =>
          result.exchange.toLowerCase()
        );
        const hasOtherExchanges = exchanges.some(
          (exchange) => !config.exchanges.includes(exchange)
        );
        const hasAllExchanges =
          exchanges.length > 0 &&
          exchanges.every((exchange) => config.exchanges.includes(exchange));
        if (hasOtherExchanges) {
          const error = Boom.badRequest(
            i18n.translateError(
              'MX_HAS_OTHER',
              domain.locale,
              EXCHANGES,
              domain.name
            )
          );
          error.has_multiple_exchanges = hasAllExchanges;
          errors.push(error);
        } else if (hasAllExchanges) {
          mx = true;
        } else {
          errors.push(
            Boom.badRequest(
              i18n.translateError(
                'MISSING_DNS_MX',
                domain.locale,
                EXCHANGES,
                domain.name
              )
            )
          );
        }
      } catch (err) {
        // Logger.debug(err);
        if (err.code === 'ENOTFOUND') {
          const error = Boom.badRequest(
            i18n.translateError('ENOTFOUND', domain.locale)
          );
          error.code = err.code;
          errors.push(error);
        } else if (err.code === 'ENODATA') {
          const error = Boom.badRequest(
            i18n.translateError(
              'MISSING_DNS_MX',
              domain.locale,
              EXCHANGES,
              domain.name
            )
          );
          error.code = err.code;
          errors.push(error);
        } else if (err.code && DNS_RETRY_CODES.has(err.code)) {
          const error = Boom.badRequest(
            i18n.translateError('DNS_RETRY', domain.locale, err.code)
          );
          error.code = err.code;
          errors.push(error);
        } else {
          errors.push(err);
        }
      }
    })()
  ]);

  if (!requiresPaidPlan) {
    if (!txt || !mx) {
      errors.push(
        Boom.badRequest(i18n.translateError('AUTOMATED_CHECK', domain.locale))
      );
    }

    if (!txt && !mx) {
      errors.push(
        Boom.badRequest(i18n.translateError('NAMESERVER_CHECK', domain.locale))
      );
    }

    if (!txt || !mx) {
      errors.unshift(
        Boom.badRequest(
          i18n.translateError('DNS_CHANGES_TAKE_TIME', domain.locale)
        )
      );
    }
  }

  return { ns, txt, mx, errors: _.uniqBy(errors, 'message') };
}

Domains.statics.getVerificationResults = getVerificationResults;

function getNameRestrictions(domainName) {
  const rootDomain = parseRootDomain(domainName);
  const isGood = config.goodDomains.some((ext) =>
    rootDomain.endsWith(`.${ext}`)
  );
  const isDisposable = REGEX_MAIL_DISPOSABLE_INBOX.test(rootDomain);
  // REGEX_MAIL_DISPOSABLE_INBOX.test(rootDomain) ||
  // disposableDomains.has(rootDomain);
  // NOTE: this also takes into account `nic.ext` for registrars
  const isRestricted = config.restrictedDomains.some(
    (ext) =>
      rootDomain === ext ||
      rootDomain.endsWith(`.${ext}`) ||
      rootDomain === `nic.${ext}`
  );

  return { isGood, isDisposable, isRestricted };
}

Domains.statics.getNameRestrictions = getNameRestrictions;

async function getToAndMajorityLocaleByDomain(domain) {
  // Get all the admins we should send the email to
  let users = await conn.models.Users.find({
    _id: {
      $in: domain.members
        .filter((member) => member.group === 'admin')
        .map((member) =>
          typeof member?.user?._id === 'object' ? member.user._id : member.user
        )
    },
    // [config.userFields.hasVerifiedEmail]: true,
    [config.userFields.isBanned]: false
  })
    .select(
      `email ${config.lastLocaleField} ${config.userFields.hasVerifiedEmail}`
    )
    .lean()
    .exec();

  if (users.length === 0) {
    throw Boom.badRequest('Domain had zero admins');
  }

  users = users.filter((u) => u[config.userFields.hasVerifiedEmail]);

  if (users.length === 0) {
    throw Boom.badRequest(
      i18n.translateError(
        'USER_UNVERIFIED',
        'en',
        `${config.urls.web}${config.verifyRoute}`
      )
    );
  }

  const to = _.uniq(users.map((user) => user.email));

  // <https://stackoverflow.com/a/49731453>
  const locales = users.map((user) => user[config.lastLocaleField]);

  // const locale = _.head(_.chain(locales).countBy().entries().maxBy(_.last));
  const countedLocales = _.countBy(locales);
  const localeEntries = Object.entries(countedLocales);
  const maxLocaleEntry = _.maxBy(localeEntries, (entry) => entry[1]);
  const locale = maxLocaleEntry[0];

  return { to, locale };
}

Domains.statics.getToAndMajorityLocaleByDomain = getToAndMajorityLocaleByDomain;

function splitString(string_) {
  if (string_.indexOf('/') === 0) {
    // It can either be split by ",/" or ","
    const index = string_.includes(',/')
      ? string_.lastIndexOf('/:', string_.indexOf(',/'))
      : string_.indexOf('/:');
    const lastComma = string_.indexOf(',', index);
    if (lastComma === -1) {
      return [string_];
    }

    if (lastComma === string_.length - 1) {
      return [string_.slice(0, lastComma)];
    }

    return [
      string_.slice(0, lastComma),
      ...splitString(string_.slice(lastComma + 1))
    ];
  }

  return string_.includes(',')
    ? [
        string_.slice(0, string_.indexOf(',')),
        ...splitString(string_.slice(string_.indexOf(',') + 1))
      ]
    : [string_];
}

// eslint-disable-next-line max-params
async function getTxtAddresses(
  domainName,
  locale,
  allowEmpty = false,
  resolver,
  purgeCache = true
) {
  if (!isFQDN(domainName)) {
    throw Boom.badRequest(i18n.translateError('INVALID_FQDN', locale));
  }

  if (
    typeof resolver !== 'object' ||
    typeof resolver.resolveTxt !== 'function'
  ) {
    throw new TypeError('Resolver missing');
  }

  const records = await resolver.resolveTxt(domainName, { purgeCache });

  // Verification records that contain `forward-email-site-verification=` prefix
  const verifications = [];

  // Dns TXT record must contain `forward-email=` prefix
  const validRecords = [];

  // Add support for multi-line TXT records
  for (let i = 0; i < records.length; i++) {
    records[i] = records[i].join('').trim(); // Join chunks together
    if (records[i].startsWith(config.freePrefix)) {
      validRecords.push(records[i].replace(config.freePrefix, ''));
    } else if (records[i].startsWith(config.paidPrefix)) {
      verifications.push(records[i].replace(config.paidPrefix, ''));
    }
  }

  // Join multi-line TXT records together and replace double w/single commas
  const record = validRecords.join(',').replace(/,+/g, ',').trim();

  const addresses = isSANB(record)
    ? record
        .split({
          [Symbol.split](string_) {
            return splitString(string_);
          }
        })
        // Remove trailing whitespaces from each address listed
        .map((string_) => string_.trim())
    : [];

  if (!allowEmpty && addresses.length === 0) {
    throw Boom.badRequest(
      i18n.translateError('MISSING_DNS_TXT', locale, domainName)
    );
  }

  // Store if we have a forwarding address or not
  const forwardingAddresses = [];

  // Store if we have a global redirect or not
  const globalForwardingAddresses = [];

  // Store if we have ignored addresses or not
  const ignoredAddresses = [];

  // Store errors
  const errors = [];

  //
  // Store if base64 encryption or not (e.g. free plan)
  // https://forwardemail.net/encrypt
  //
  let hasBase64 = false;

  //
  // Store if user has regex
  //
  let hasRegex = false;

  for (const element of addresses) {
    // Convert addresses to lowercase
    const lowerCaseAddress = element.toLowerCase();

    // rudimentary regex support
    if (element.indexOf('/') === 0 && element.lastIndexOf('/') !== 0) {
      hasRegex = true;
    } else if (
      (lowerCaseAddress.includes(':') || lowerCaseAddress.indexOf('!') === 0) &&
      !isURL(element, config.isURLOptions)
    ) {
      // > const str = 'foo:https://foo.com'
      // > str.slice(0, str.indexOf(':'))
      // 'foo'
      // > str.slice(str.indexOf(':') + 1)
      // 'https://foo.com'
      const index = element.indexOf(':');
      const addr =
        index === -1
          ? [element]
          : [element.slice(0, index), element.slice(index + 1)];

      // Addr[0] = hello (username)
      // addr[1] = forwardemail@gmail.com (forwarding email)
      // check if we have a match (and if it is ignored)
      if (_.isString(addr[0]) && addr[0].indexOf('!') === 0) {
        // !foo
        let name = addr[0].slice(1);
        let errorCode = 250;
        if (addr[0].indexOf('!!!') === 0) {
          // !!!foo -> 550
          name = addr[0].slice(3);
          errorCode = 550;
        } else if (addr[0].indexOf('!!') === 0) {
          // !!foo -> 421
          name = addr[0].slice(2);
          errorCode = 421;
        }

        ignoredAddresses.push({
          name,
          recipient: isSANB(addr[1]) ? addr[1] : false,
          error_code_if_disabled: errorCode
        });
        continue;
      }

      if (
        addr.length !== 2 ||
        !_.isString(addr[1]) ||
        (!isFQDN(addr[1]) &&
          !isIP(addr[1]) &&
          !isEmail(addr[1]) &&
          !isURL(addr[1], config.isURLOptions))
      ) {
        errors.push(
          Boom.badRequest(
            // TODO: we may want to replace this with "Invalid Recipients"
            `Domain has an invalid "${config.recordPrefix}" TXT record due to an invalid email address of "${element}".`
          )
        );
      }

      forwardingAddresses.push({ name: addr[0], recipient: addr[1] });
    } else if (isFQDN(lowerCaseAddress) || isIP(lowerCaseAddress)) {
      // Allow domain alias forwarding
      // (e.. the record is just "b.com" if it's not a valid email)
      globalForwardingAddresses.push(lowerCaseAddress);
    } else if (isEmail(lowerCaseAddress)) {
      globalForwardingAddresses.push(lowerCaseAddress);
    } else if (isURL(element, config.isURLOptions)) {
      globalForwardingAddresses.push(element);
    } else if (isBase64(element)) {
      try {
        decrypt(
          Buffer.from(element, 'base64').toString('utf8'),
          env.TXT_ENCRYPTION_KEY
        );
        hasBase64 = true;
      } catch {
        try {
          decrypt(
            Buffer.from(element, 'base64').toString('hex'),
            env.TXT_ENCRYPTION_KEY
          );
          hasBase64 = true;
        } catch (err) {
          logger.debug(err);
        }
      }
    }
  }

  return {
    hasBase64,
    hasRegex,
    verifications,
    forwardingAddresses,
    globalForwardingAddresses,
    ignoredAddresses,
    errors
  };
}

Domains.statics.getTxtAddresses = getTxtAddresses;

async function ensureUserHasValidPlan(user, locale) {
  // If the user was on the team plan
  // then all of their domains would be valid
  if (user.plan === 'team') {
    return;
  }

  // Get all domains associated with this user
  const domains = await this.find({
    plan: { $in: ['enhanced_protection', 'team'] },
    'members.user': user._id
  })
    .select('name plan members.user members.group')
    .populate('members.user')
    .lean()
    .exec();

  // If no domains then return early
  if (domains.length === 0) {
    return;
  }

  const errors = [];

  for (const domain of domains) {
    // Determine what plans are required
    const validPlans =
      domain.plan === 'team' ? ['team'] : ['enhanced_protection', 'team'];
    let isValid = false;

    for (const member of domain.members) {
      // Return early if the member is not an admin (irrelevant)
      if (member.group !== 'admin') {
        continue;
      }

      // If the user did not exist then return early
      if (!member.user || !member.user.id) {
        logger.error(new Error(`Member in ${domain.name} no longer exists.`));
        continue;
      }

      // Use the new/latest plan passed in the `user` argument (as opposed to what exists)
      // (e.g. this method `ensureUserHasValidPlan` is called before saving a user's plan change)
      const memberPlan =
        member.user.id === user.id ? user.plan : member.user.plan;

      if (validPlans.includes(memberPlan)) {
        isValid = true;
        break;
      }
    }

    if (!isValid) {
      errors.push(
        i18n.translateError(
          'DOMAIN_PLAN_UPGRADE_REQUIRED',
          locale,
          domain.name,
          i18n.translate(domain.plan.toUpperCase(), locale),
          `/${locale}/my-account/domains/${punycode.toASCII(
            domain.name
          )}/billing?plan=${domain.plan}`
        )
      );
    }
  }

  if (errors.length === 0) {
    return;
  }

  logger.error('Member did not have valid plan', { errors });

  if (errors.length === 1) {
    throw Boom.badRequest(errors[0].message);
  }

  throw Boom.badRequest(`
    <p class="font-weight-bold text-danger">${i18n.translate(
      'ERRORS_OCCURRED',
      locale
    )}</p>
    <ul class="mb-0 text-left"><li>${errors
      .map((e) => e.message)
      .join('</li><li>')}</li><ul>
  `);
}

Domains.statics.ensureUserHasValidPlan = ensureUserHasValidPlan;

//
// NOTE: in order to save db lookups, you can pass an alias object with `max_quota` property
//       instead of a string for `aliasId` value, so it will re-use an existing alias object
//
async function getMaxQuota(_id, aliasId, locale = i18n.config.defaultLocale) {
  if (typeof conn?.models?.Aliases?.findOne !== 'function')
    throw new TypeError('Aliases model is not ready');

  const [domain, alias] = await Promise.all([
    this.findById(_id)
      .populate(
        'members.user',
        `_id id plan ${config.userFields.isBanned} ${config.userFields.maxQuotaPerAlias}`
      )
      .lean()
      .exec(),
    typeof aliasId === 'string'
      ? conn.models.Aliases.findOne({ id: aliasId })
          .select('max_quota')
          .lean()
          .exec()
      : Promise.resolve(
          typeof aliasId === 'object' && aliasId !== null ? aliasId : null
        )
  ]);

  if (!domain)
    throw Boom.badRequest(
      i18n.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE', locale)
    );

  // Safeguard to not check storage used for global domains
  if (domain.is_global) {
    throw new TypeError('Global domains not supported for storage');
  }

  // Safeguard for storage to only be used on paid plans
  if (domain.plan === 'free') {
    throw Boom.badRequest(
      i18n.translateError(
        'DOMAIN_PLAN_UPGRADE_REQUIRED',
        locale,
        domain.name,
        i18n.translate('ENHANCED_PROTECTION', locale),
        `${config.urls.web}/${locale}/my-account/domains/${punycode.toASCII(
          domain.name
        )}/billing?plan=enhanced_protection`
      )
    );
  }

  // If we're on non-team plan, then there should only be one member (safeguard)
  if (domain.plan !== 'team' && domain.members.length > 1) {
    throw new TypeError(
      `Domain ${domain.name} (${domain.id}) has more than one member`
    );
  }

  if (aliasId && !alias) {
    const err = Boom.badRequest(
      i18n.translateError('ALIAS_DOES_NOT_EXIST', locale)
    );
    err.isCodeBug = true;
    err._id = _id;
    err.aliasId = aliasId;
    err.alias = alias;
    logger.fatal(err);
    throw err;
  }

  // Filter out a domain's members without actual users
  const adminMembers = domain.members.filter(
    (member) =>
      _.isObject(member.user) &&
      !member.user[config.userFields.isBanned] &&
      member.group === 'admin' &&
      mongoose.isObjectIdOrHexString(member.user._id)
  );

  if (adminMembers.length === 0) {
    throw Boom.badRequest(
      i18n.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE', locale)
    );
  }

  // If we're on non-team plan, then there should only be one admin (safeguard)
  if (domain.plan !== 'team' && adminMembers.length > 1) {
    throw new TypeError(
      `Domain ${domain.name} (${domain.id}) has more than one admin`
    );
  }

  // go through all admins and get the max value
  let max = _.max(
    adminMembers.map((member) =>
      typeof member.user[config.userFields.maxQuotaPerAlias] === 'number'
        ? member.user[config.userFields.maxQuotaPerAlias]
        : config.maxQuotaPerAlias
    )
  );

  // if domain had a max value set, and it was less than `max`, then set new max
  if (
    Number.isFinite(domain.max_quota_per_alias) &&
    domain.max_quota_per_alias < max
  )
    max = domain.max_quota_per_alias;

  // if alias passed, and had a max value set, and it was less than `max`, then set new max
  if (
    alias &&
    Number.isFinite(alias.max_quota) &&
    alias.max_quota_per_alias < max
  )
    max = alias.max_quota_per_alias;

  //
  // NOTE: hard-coded max of 100 GB (safeguard)
  //
  return _.clamp(max, 0, bytes('100GB'));
}

Domains.statics.getMaxQuota = getMaxQuota;

async function getStorageUsed(_id, _locale, aliasesOnly = false) {
  //
  // calculate storage used across entire domain and its admin users domains
  // (this is rudimentary storage system and has edge cases)
  // (e.g. multi-accounts when users on team plan edge case)
  //
  const domain = await this.findById(_id)
    .populate('members.user', `_id id plan ${config.userFields.isBanned}`)
    .lean()
    .exec();

  if (!domain) {
    throw Boom.badRequest(
      i18n.translateError(
        'DOMAIN_DOES_NOT_EXIST_ANYWHERE',
        _locale || i18n.config.defaultLocale
      )
    );
  }

  const locale = _locale || domain.locale || i18n.config.defaultLocale;

  // Safeguard to not check storage used for global domains
  if (domain.is_global) {
    throw new TypeError('Global domains not supported for storage');
  }

  // Safeguard for storage to only be used on paid plans
  if (domain.plan === 'free') {
    throw Boom.badRequest(
      i18n.translateError(
        'DOMAIN_PLAN_UPGRADE_REQUIRED',
        locale,
        domain.name,
        i18n.translate('ENHANCED_PROTECTION', locale),
        `${config.urls.web}/${locale}/my-account/domains/${punycode.toASCII(
          domain.name
        )}/billing?plan=enhanced_protection`
      )
    );
  }

  // If we're on non-team plan, then there should only be one member (safeguard)
  if (domain.plan !== 'team' && domain.members.length > 1) {
    throw new TypeError(
      `Domain ${domain.name} (${domain.id}) has more than one member`
    );
  }

  // Filter out a domain's members without actual users
  const adminMembers = domain.members.filter(
    (member) =>
      _.isObject(member.user) &&
      !member.user[config.userFields.isBanned] &&
      member.group === 'admin' &&
      mongoose.isObjectIdOrHexString(member.user._id)
  );

  if (adminMembers.length === 0) {
    throw Boom.badRequest(
      i18n.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE', locale)
    );
  }

  // If we're on non-team plan, then there should only be one admin (safeguard)
  if (domain.plan !== 'team' && adminMembers.length > 1) {
    throw new TypeError(
      `Domain ${domain.name} (${domain.id}) has more than one admin`
    );
  }

  // Now get all domains where $elemMatch is the admin user id and group is admin
  const domainIds = aliasesOnly
    ? [_id]
    : await this.distinct('_id', {
        members: {
          $elemMatch: {
            user: { $in: adminMembers.map((m) => m.user._id) },
            group: 'admin'
          }
        }
      });

  // Safeguard
  if (domainIds.length === 0) {
    throw Boom.badRequest(
      i18n.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE', locale)
    );
  }

  let storageUsed = 0;

  if (domainIds.length > 0) {
    if (typeof conn?.models?.Aliases?.aggregate !== 'function') {
      throw new TypeError('Aliases model is not ready');
    }

    const results = await conn.models.Aliases.aggregate([
      {
        $match: {
          domain: {
            $in: domainIds
          }
        }
      },
      {
        $project: {
          _id: 0,
          storage_used: 1
        }
      },
      {
        $group: {
          _id: null,
          storage_used: {
            $sum: '$storage_used'
          }
        }
      }
    ]);

    // Results [ { _id: '', storage_used: 91360 } ] or []
    if (
      results.length > 1 ||
      (results.length === 1 &&
        (typeof results[0] !== 'object' ||
          typeof results[0].storage_used !== 'number'))
    ) {
      throw Boom.badRequest(
        i18n.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE', locale)
      );
    }

    if (results.length === 1) storageUsed += results[0].storage_used;
  }

  return storageUsed;
}

Domains.statics.getStorageUsed = getStorageUsed;

module.exports = conn.model('Domains', Domains);

// setInterval(crawlDisposable, ms('1d'));
// crawlDisposable();
