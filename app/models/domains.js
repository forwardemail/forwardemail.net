const os = require('node:os');

const Boom = require('@hapi/boom');
const RE2 = require('re2');
const _ = require('lodash');
const captainHook = require('captain-hook');
const cryptoRandomString = require('crypto-random-string');
const delay = require('delay');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const ms = require('ms');
const pMap = require('p-map');
const striptags = require('striptags');
const { boolean } = require('boolean');
const { convert } = require('html-to-text');
const { fromUrl, parseDomain, ParseResultType } = require('parse-domain');
const { isIP, isEmail, isPort, isURL } = require('validator');
const { request } = require('undici');

const pkg = require('../../package.json');
const Users = require('./users');

const logger = require('#helpers/logger');
const config = require('#config');
const i18n = require('#helpers/i18n');
const verificationRecordOptions = require('#config/verification-record');

const concurrency = os.cpus().length;
const CACHE_TYPES = ['NS', 'MX', 'TXT'];
const CLOUDFLARE_PURGE_CACHE_URL = 'https://1.1.1.1/api/v1/purge';
const USER_AGENT = `${pkg.name}/${pkg.version}`;
const PAID_PLANS = ['enhanced_protection', 'team'];

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
const disposableDomains = new Set();
async function crawlDisposable() {
  try {
    const { body } = await request(
      'https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.json',
      {
        signal: AbortSignal.timeout(10000)
      }
    );
    const json = await body.json();
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

setInterval(crawlDisposable, ms('1d'));
crawlDisposable();

const REGEX_VERIFICATION = new RE2(/[^\da-z]/i);

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
    trim: true
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
  last_checked_at: Date,
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
  members: [Member],
  invites: [Invite],
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
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
  restrictions_reminder_sent_at: Date,
  onboard_email_sent_at: Date,
  verified_email_sent_at: Date,
  missing_txt_sent_at: Date,
  multiple_exchanges_sent_at: Date,
  // default option to require `has_recipient_verification`
  // on all aliases for verification emails to send
  has_recipient_verification: {
    type: Boolean,
    // if true then aliases default to true
    // (if not explicitly set, e.g. via API request)
    default: false
  },
  // premium alias verification template
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
  // nameservers (Array of either IP or FQDN)
  ns: [
    {
      type: String,
      validate: (value) => isIP(value) || isFQDN(value)
    }
  ]
});

Domains.plugin(captainHook);

// shared tangerine resolver
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

Domains.virtual('skip_verification')
  .get(function () {
    return this.__skip_verification;
  })
  .set(function (skipVerification) {
    this.__skip_verification = boolean(skipVerification);
  });

Domains.pre('remove', function (next) {
  if (this.is_global)
    return next(
      Boom.badRequest(
        i18n.translateError('CANNOT_REMOVE_GLOBAL_DOMAIN', this.locale)
      )
    );
  next();
});

Domains.pre('validate', async function (next) {
  try {
    const domain = this;
    if (!domain.plan) domain.plan = 'free';
    if (domain.is_global) domain.plan = 'team';

    // domain.name must be IP or FQDN
    if (!isSANB(domain.name) || (!isFQDN(domain.name) && !isIP(domain.name)))
      throw Boom.badRequest(
        i18n.translateError('INVALID_DOMAIN', domain.locale)
      );

    if (!isSANB(this.verification_record))
      this.verification_record = await cryptoRandomString.async(
        verificationRecordOptions
      );

    if (
      this.verification_record.replace(REGEX_VERIFICATION, '') !==
      this.verification_record
    )
      throw Boom.badRequest(
        i18n.translateError('INVALID_VERIFICATION_RECORD', domain.locale)
      );

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
  )
    throw Boom.badRequest(
      i18n.translateError('AT_LEAST_ONE_ADMIN_REQUIRED', this.locale)
    );

  next();
});

// prevent new domains from being created with a plan
// that the user is not yet subscribed to, and also
// enforce that when domains are saved, they are required
// to have at least one admin with the plan of the domain
// (otherwise throw an error that tells them what's wrong)
Domains.pre('validate', async function (next) {
  try {
    const domain = this;

    const { isGood, isDisposable, isRestricted } = getNameRestrictions(
      domain.name
    );

    if (domain.plan === 'free' && isGood && !isDisposable) return next();

    const users = await Users.find({
      _id: { $in: domain.members.map((m) => m.user) }
    })
      .lean()
      .select('plan email')
      .exec();

    let hasPaidPlan = false;

    const hasValidPlan = users.some((user) => {
      if (PAID_PLANS.includes(user.plan)) hasPaidPlan = true;
      if (domain.plan === 'team' && user.plan === 'team') return true;
      if (
        domain.plan === 'enhanced_protection' &&
        PAID_PLANS.includes(user.plan)
      )
        return true;
      return false;
    });

    // if it is a restricted domain then ensure has paid plan
    // and ensure every user has a restricted extension (no personal emails allowed)
    if (isRestricted) {
      const badUserEmails = [];
      for (const user of users) {
        if (
          config.restrictedDomains.every(
            (ext) => !user.email.endsWith(`.${ext}`)
          )
        )
          badUserEmails.push(user.email);
      }

      if (badUserEmails.length > 0)
        logger.error(
          new Error(
            `Restricted domain had personal emails: ${domain.name} (${domain.id})`
          ),
          { domain, badUserEmails }
        );

      // if the domain is not on a paid plan then it's not valid
      if (!hasPaidPlan)
        throw Boom.paymentRequired(
          i18n.translateError(
            'RESTRICTED_PLAN_UPGRADE_REQUIRED',
            domain.locale,
            domain.name,
            `/${domain.locale}/my-account/billing/upgrade?plan=enhanced_protection`
          )
        );
    } else if (!hasPaidPlan && !isGood) {
      throw Boom.paymentRequired(
        i18n.translateError(
          'MALICIOUS_DOMAIN_PLAN_UPGRADE_REQUIRED',
          domain.locale,
          domain.name,
          `/${domain.locale}/my-account/billing/upgrade?plan=enhanced_protection`
        )
      );
    }

    // if the domain contained any of these words then require paid upgrade
    // - mail
    // - disposable
    // - inbox
    if (!hasPaidPlan && isDisposable) {
      throw Boom.paymentRequired(
        i18n.translateError(
          'RESERVED_KEYWORD_DOMAIN_PLAN_UPGRADE_REQUIRED',
          domain.locale,
          domain.name,
          `/${domain.locale}/my-account/billing/upgrade?plan=enhanced_protection`
        )
      );
    }

    if (!hasValidPlan && domain.plan !== 'free')
      throw Boom.paymentRequired(
        i18n.translateError(
          'DOMAIN_PLAN_UPGRADE_REQUIRED',
          domain.locale,
          domain.name,
          i18n.translate(domain.plan.toUpperCase(), domain.locale),
          `/${domain.locale}/my-account/domains/${domain.name}/billing?plan=${domain.plan}`
        )
      );

    next();
  } catch (err) {
    next(err);
  }
});

Domains.pre('validate', function (next) {
  const domain = this;
  // domain must be on a paid plan in order to require verification
  if (domain.plan === 'free' && domain.has_recipient_verification)
    return next(
      Boom.badRequest(
        i18n.translateError(
          'PAID_PLAN_REQUIRED_FOR_RECIPIENT_VERIFICATION',
          domain.locale
        )
      )
    );
  next();
});

Domains.pre('validate', function (next) {
  const domain = this;

  // we return early here in case the boolean was set to false
  // and we want to preserve what the user had already set for templates
  // (e.g. as a backup in case they ever restore it or we turn it back on)
  if (!domain.has_custom_verification) return next();

  // if template was empty for html then assume it's not set
  if (!isSANB(domain.custom_verification.html)) {
    domain.custom_verification.html = '';
    domain.custom_verification.text = '';
    return next();
  }

  // strip subject of all tags
  domain.custom_verification.subject = striptags(
    domain.custom_verification.subject
  );

  if (!isSANB(domain.custom_verification.subject))
    domain.custom_verification.subject = '';

  // TODO: clean up the HTML
  if (!isSANB(domain.custom_verification.html)) {
    domain.custom_verification.html = '';
    domain.custom_verification.text = '';
    return next();
  }

  // ensure that the HTML has at least one occurrence
  // of the `VERIFICATION_LINK` variable
  // (even though we interpolate all of them)
  if (!domain.custom_verification.html.includes('VERIFICATION_LINK'))
    return next(
      Boom.badRequest(
        i18n.translateError('MISSING_VERIFICATION_LINK', domain.locale)
      )
    );

  // auto-generate text portion if blank
  if (isSANB(domain.custom_verification.text))
    domain.custom_verification.text = striptags(
      domain.custom_verification.text
    );
  else
    domain.custom_verification.text = convert(domain.custom_verification.html, {
      selectors: [{ selector: 'img', format: 'skip' }]
    });

  // ensure that text has at least one occurrence
  // of the `VERIFICATION_LINK` variable
  // (even though we interpolate all of them)
  if (!domain.custom_verification.text.includes('VERIFICATION_LINK'))
    return next(
      Boom.badRequest(
        i18n.translateError('MISSING_VERIFICATION_LINK', domain.locale)
      )
    );

  next();
});

Domains.pre('save', async function (next) {
  try {
    const domain = this;

    // helper virtual to skip verification results
    // (e.g. when onboarding a user that's just visiting the API/FAQ page)
    // (or if we already performed the verification results lookup)
    if (domain.skip_verification) return next();

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
      errors.some((err) => err.code && DNS_RETRY_CODES.has(err.code));

    if (!hasDNSError) {
      // reset missing txt so we alert users if they are missing a TXT in future again
      if (!domain.has_txt_record && txt && _.isDate(domain.missing_txt_sent_at))
        domain.missing_txt_sent_at = undefined;
      // reset multiple exchanges error so we alert users if they have multiple MX in the future
      if (
        !domain.has_mx_record &&
        mx &&
        _.isDate(domain.multiple_exchanges_sent_at)
      )
        domain.multiple_exchanges_sent_at = undefined;
      domain.has_txt_record = txt;
      domain.has_mx_record = mx;
      if (ns) domain.ns = ns;
    }

    // store when we last checked it
    domain.last_checked_at = new Date();

    next();
  } catch (err) {
    next(err);
  }
});

Domains.plugin(mongooseCommonPlugin, {
  object: 'domain',
  omitExtraFields: [
    'is_global',
    'is_api',
    'onboard_email_sent_at',
    'verified_email_sent_at',
    'last_checked_at',
    'email_suspended_sent_at',
    'missing_txt_sent_at',
    'multiple_exchanges_sent_at',
    'ns'
  ],
  mongooseHidden: {
    virtuals: {
      resolver: 'hide'
    }
  },
  defaultLocale: i18n.getLocale()
});

async function getVerificationResults(domain, resolver) {
  const verificationRecord = `${config.recordPrefix}-site-verification=${domain.verification_record}`;
  const verificationMarkdown = `<span class="markdown-body ml-0 mr-0"><code>${verificationRecord}</code></span>`;
  const isPaidPlan = _.isString(domain.plan) && domain.plan !== 'free';

  //
  // attempt to purge Cloudflare cache programmatically
  //
  try {
    await pMap(
      CACHE_TYPES,
      (type) => {
        const url = new URL(CLOUDFLARE_PURGE_CACHE_URL);
        url.searchParams = new URLSearchParams({
          domain: domain.name,
          type
        });
        return request(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'User-Agent': USER_AGENT
          },
          signal: AbortSignal.timeout(10000)
        });
      },
      { concurrency }
    );
    logger.info('cleared DNS cache for cloudflare', {
      domain,
      types: CACHE_TYPES
    });
    // wait one second for DNS changes to propagate
    await delay(ms('1s'));
  } catch (err) {
    logger.error(err);
  }

  const errors = [];

  let ns = false;
  let txt = false;
  let mx = false;

  await Promise.all([
    //
    // fetch NS records
    // (we store these in order to render helpful animated gifs and videos for user onboarding)
    // (and we also can use these to statistically determine which registrar and DNS providers our users use)
    //
    // NOTE: this first attempts to fetch the domain name (regardless if it was subdomain or root)
    //       but if it was a subdomain and had no NS then it parses the parent
    //
    // eslint-disable-next-line complexity
    (async function () {
      try {
        let records = await resolver.resolveNs(domain.name, {
          purgeCache: true
        });
        if (Array.isArray(records) && records.length > 0) {
          // filter records for IP and FQDN only values
          records = records.filter(
            (record) => (isSANB(record) && isIP(record)) || isFQDN(record)
          );
          // only set `ns` if we have at least one record
          if (records.length > 1) ns = records;
        }
      } catch (err) {
        try {
          const parseResult = parseDomain(fromUrl(domain.name));
          const rootDomain = (
            parseResult.type === ParseResultType.Listed &&
            _.isObject(parseResult.icann) &&
            isSANB(parseResult.icann.domain)
              ? `${
                  parseResult.icann.domain
                }.${parseResult.icann.topLevelDomains.join('.')}`
              : domain.name
          ).toLowerCase();
          if (rootDomain === domain.name) {
            logger.warn(err);
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
              // filter records for IP and FQDN only values
              records = records.filter(
                (record) => (isSANB(record) && isIP(record)) || isFQDN(record)
              );
              // only set `ns` if we have at least one record
              if (records.length > 1) ns = records;
            }
          }
        } catch (err) {
          logger.warn(err);
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
                  `/my-account/domains/${domain.name}/aliases`,
                  config.recordPrefix,
                  `/my-account/domains/${domain.name}`
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

          if (errors.length === 0 && result.errors.length === 0) txt = true;
        } else if (
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
          txt = true;
        } else {
          errors.push(...result.errors);
        }
      } catch (err) {
        logger.warn(err);
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
      try {
        const results = await resolver.resolveMx(domain.name, {
          purgeCache: true
        });
        const exchanges = results.map((result) => result.exchange);
        const hasOtherExchanges = exchanges.some(
          (exchange) => !config.exchanges.includes(exchange)
        );
        const hasAllExchanges = exchanges.every((exchange) =>
          config.exchanges.includes(exchange)
        );
        if (hasOtherExchanges) {
          const err = Boom.badRequest(
            i18n.translateError(
              'MX_HAS_OTHER',
              domain.locale,
              EXCHANGES,
              domain.name
            )
          );
          err.has_multiple_exchanges = hasAllExchanges;
          errors.push(err);
        } else if (hasAllExchanges) mx = true;
        else
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
      } catch (err) {
        logger.warn(err);
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

  if (!txt || !mx)
    errors.push(
      Boom.badRequest(i18n.translateError('AUTOMATED_CHECK', domain.locale))
    );

  if (!txt && !mx)
    errors.push(
      Boom.badRequest(i18n.translateError('NAMESERVER_CHECK', domain.locale))
    );

  if (!txt || !mx)
    errors.unshift(
      Boom.badRequest(
        i18n.translateError('DNS_CHANGES_TAKE_TIME', domain.locale)
      )
    );

  return { ns, txt, mx, errors: _.uniqBy(errors, 'message') };
}

Domains.statics.getVerificationResults = getVerificationResults;

function getNameRestrictions(domainName) {
  const parseResult = parseDomain(fromUrl(domainName));
  const rootDomain = (
    parseResult.type === ParseResultType.Listed &&
    _.isObject(parseResult.icann) &&
    isSANB(parseResult.icann.domain)
      ? `${parseResult.icann.domain}.${parseResult.icann.topLevelDomains.join(
          '.'
        )}`
      : domainName
  ).toLowerCase();
  const isGood = config.goodDomains.some((ext) =>
    rootDomain.endsWith(`.${ext}`)
  );
  const isDisposable =
    REGEX_MAIL_DISPOSABLE_INBOX.test(rootDomain) ||
    disposableDomains.has(rootDomain);
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
  // get all the admins we should send the email to
  const users = await Users.find({
    _id: {
      $in: domain.members
        .filter((member) => member.group === 'admin')
        .map((member) => member.user)
    },
    [config.userFields.hasVerifiedEmail]: true,
    [config.userFields.isBanned]: false
  })
    .select(`email ${config.lastLocaleField}`)
    .lean()
    .exec();

  if (users.length === 0) throw new Error('Domain had zero admins');

  const to = _.uniq(users.map((user) => user.email));

  // <https://stackoverflow.com/a/49731453>
  const locales = users.map((user) => user[config.lastLocaleField]);
  const locale = _.head(_(locales).countBy().entries().maxBy(_.last));

  return { to, locale };
}

Domains.statics.getToAndMajorityLocaleByDomain = getToAndMajorityLocaleByDomain;

// eslint-disable-next-line complexity
async function getTxtAddresses(
  domainName,
  locale,
  allowEmpty = false,
  resolver
) {
  if (!isFQDN(domainName))
    throw Boom.badRequest(i18n.translateError('INVALID_FQDN', locale));

  const records = await resolver.resolveTxt(domainName, { purgeCache: true });

  // verification records that contain `forward-email-site-verification=` prefix
  const verifications = [];

  // dns TXT record must contain `forward-email=` prefix
  const validRecords = [];

  // add support for multi-line TXT records
  for (let i = 0; i < records.length; i++) {
    records[i] = records[i].join('').trim(); // join chunks together
    if (records[i].startsWith(`${config.recordPrefix}=`))
      validRecords.push(records[i].replace(`${config.recordPrefix}=`, ''));
    if (records[i].startsWith(`${config.recordPrefix}-site-verification=`))
      verifications.push(
        records[i].replace(`${config.recordPrefix}-site-verification=`, '')
      );
  }

  // join multi-line TXT records together and replace double w/single commas
  const record = validRecords.join(',').replace(/,+/g, ',').trim();

  // remove trailing whitespaces from each address listed
  const addresses = isSANB(record)
    ? record.split(',').map((a) => a.trim())
    : [];

  if (!allowEmpty && addresses.length === 0)
    throw Boom.badRequest(
      i18n.translateError('MISSING_DNS_TXT', locale, domainName)
    );

  // store if we have a forwarding address or not
  const forwardingAddresses = [];

  // store if we have a global redirect or not
  const globalForwardingAddresses = [];

  // store if we have ignored addresses or not
  const ignoredAddresses = [];

  // store errors
  const errors = [];

  for (const element of addresses) {
    // convert addresses to lowercase
    const lowerCaseAddress = element.toLowerCase();

    if (
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

      // addr[0] = hello (username)
      // addr[1] = forwardemail@gmail.com (forwarding email)
      // check if we have a match (and if it is ignored)
      if (_.isString(addr[0]) && addr[0].indexOf('!') === 0) {
        ignoredAddresses.push({
          name: addr[0].slice(1),
          recipient: isSANB(addr[1]) ? addr[1] : false
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
      )
        errors.push(
          new Error(
            // TODO: we may want to replace this with "Invalid Recipients"
            `Domain has an invalid "${config.recordPrefix}" TXT record due to an invalid email address of "${element}".`
          )
        );

      forwardingAddresses.push({ name: addr[0], recipient: addr[1] });
    } else if (isFQDN(lowerCaseAddress) || isIP(lowerCaseAddress)) {
      // allow domain alias forwarding
      // (e.. the record is just "b.com" if it's not a valid email)
      globalForwardingAddresses.push(lowerCaseAddress);
    } else if (isEmail(lowerCaseAddress)) {
      globalForwardingAddresses.push(lowerCaseAddress);
    } else if (isURL(element, config.isURLOptions)) {
      globalForwardingAddresses.push(element);
    }
  }

  return {
    verifications,
    forwardingAddresses,
    globalForwardingAddresses,
    ignoredAddresses,
    errors
  };
}

Domains.statics.getTxtAddresses = getTxtAddresses;

async function ensureUserHasValidPlan(user, locale) {
  // if the user was on the team plan
  // then all of their domains would be valid
  if (user.plan === 'team') return;

  // get all domains associated with this user
  const domains = await this.find({
    plan: { $ne: 'free' },
    'members.user': user._id
  })
    .select('name plan members.user members.group')
    .populate('members.user')
    .lean()
    .exec();

  // if no domains then return early
  if (domains.length === 0) return;

  const errors = [];

  for (const domain of domains) {
    // determine what plans are required
    const validPlans = domain.plan === 'team' ? ['team'] : PAID_PLANS;
    let isValid = false;

    for (const member of domain.members) {
      // return early if the member is not an admin (irrelevant)
      if (member.group !== 'admin') continue;

      // if the user did not exist then return early
      if (!member.user || !member.user.id) {
        logger.error(new Error(`Member in ${domain.name} no longer exists.`));
        continue;
      }

      // use the new/latest plan passed in the `user` argument (as opposed to what exists)
      // (e.g. this method `ensureUserHasValidPlan` is called before saving a user's plan change)
      const memberPlan =
        member.user.id === user.id ? user.plan : member.user.plan;

      if (validPlans.includes(memberPlan)) {
        isValid = true;
        break;
      }
    }

    if (!isValid)
      errors.push(
        i18n.translateError(
          'DOMAIN_PLAN_UPGRADE_REQUIRED',
          locale,
          domain.name,
          i18n.translate(domain.plan.toUpperCase(), locale),
          `/${locale}/my-account/domains/${domain.name}/billing?plan=${domain.plan}`
        )
      );
  }

  if (errors.length === 0) return;

  logger.error('Member did not have valid plan', { errors });

  if (errors.length === 1) throw Boom.badRequest(errors[0].message);

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

Domains.postCreate((domain, next) => {
  // log that the domain was created
  logger.info('domain created', {
    domain: domain.toObject()
  });

  next();
});

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'MONGO_URI'
);
if (!conn) throw new Error('Mongoose connection does not exist');
module.exports = conn.model('Domains', Domains);
