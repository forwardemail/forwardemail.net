const Boom = require('@hapi/boom');
const ForwardEmail = require('forward-email');
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
const striptags = require('striptags');
const superagent = require('superagent');
const { boolean } = require('boolean');
const { convert } = require('html-to-text');
const { isIP, isEmail, isPort, isURL } = require('validator');

const pkg = require('../../package.json');
const Users = require('./user');
const logger = require('#helpers/logger');
const config = require('#config');
const i18n = require('#helpers/i18n');
const verificationRecordOptions = require('#config/verification-record');

const CACHE_TYPES = ['MX', 'TXT'];
const CLOUDFLARE_PURGE_CACHE_URL = 'https://1.1.1.1/api/v1/purge';
const USER_AGENT = `${pkg.name}/${pkg.version}`;
const PAID_PLANS = ['enhanced_protection', 'team'];

const app = new ForwardEmail({
  logger,
  recordPrefix: config.recordPrefix,
  srs: { secret: 'null' },
  redis: false
});

const EXCHANGES = app.config.exchanges
  .map((exchange) => `<li><code>10 ${exchange}</code> (10 = Priority)</li>`)
  .join('');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const REGEX_VERIFICATION = new RE2(/[^\da-z]/gi);

const Member = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
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
  uniqueId: false
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
  uniqueId: false
});

const Domain = new mongoose.Schema({
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
    trim: true
  },
  has_mx_record: {
    type: Boolean,
    default: false
  },
  has_txt_record: {
    type: Boolean,
    default: false
  },
  is_global: {
    type: Boolean,
    default: false
  },
  verification_record: {
    type: String,
    index: true,
    required: true,
    unique: true
  },
  onboard_email_sent_at: Date,
  verified_email_sent_at: Date,
  missing_txt_sent_at: Date,
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
  }
});

Domain.plugin(captainHook);

// shared redis client
Domain.virtual('client')
  .get(function () {
    return this.__client;
  })
  .set(function (client) {
    this.__client = client;
  });

Domain.virtual('link')
  .get(function () {
    return this.__link;
  })
  .set(function (link) {
    this.__link = link;
  });

Domain.virtual('skip_verification')
  .get(function () {
    return this.__skip_verification;
  })
  .set(function (skipVerification) {
    this.__skip_verification = boolean(skipVerification);
  });

Domain.pre('validate', async function (next) {
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

Domain.pre('validate', async function (next) {
  try {
    const domain = this;
    // helper virtual to skip verification results
    // (e.g. when onboarding a user that's just visiting the API/FAQ page)
    if (domain.skip_verification) return next();
    if (
      !Array.isArray(domain.members) ||
      domain.members.length === 0 ||
      !domain.members.some(
        (member) =>
          typeof member.user !== 'undefined' && member.group === 'admin'
      )
    )
      throw Boom.badRequest(
        i18n.translateError('AT_LEAST_ONE_ADMIN_REQUIRED', domain.locale)
      );
    const { txt, mx } = await getVerificationResults(domain, domain.client);
    // reset missing txt so we alert users if they are missing a TXT in future again
    if (!domain.has_txt_record && txt && _.isDate(domain.missing_txt_sent_at))
      domain.missing_txt_sent_at = null;
    domain.has_txt_record = txt;
    domain.has_mx_record = mx;
    next();
  } catch (err) {
    next(err);
  }
});

Domain.pre('validate', function (next) {
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

Domain.pre('validate', function (next) {
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

Domain.plugin(mongooseCommonPlugin, {
  object: 'domain',
  omitExtraFields: [
    'is_global',
    'is_api',
    'onboard_email_sent_at',
    'verified_email_sent_at',
    'last_checked_at'
  ],
  mongooseHidden: {
    virtuals: {
      client: 'hide'
    }
  }
});

// eslint-disable-next-line complexity
async function getVerificationResults(domain, client = false) {
  const MISSING_DNS_MX = Boom.badRequest(
    i18n.translateError('MISSING_DNS_MX', domain.locale, EXCHANGES, domain.name)
  );

  const PAID_PLAN = Boom.badRequest(
    `Domain is on a paid plan and has "Enhanced Protection".  To proceed with verification, please <a href="${config.urls.web}/my-account/domains/${domain.name}/aliases">configure and import</a> your Aliases.  Once you have configured your Aliases, then please remove all TXT records prefixed with "${app.config.recordPrefix}=" and try again.`
  );

  const verificationRecord = `${app.config.recordPrefix}-site-verification=${domain.verification_record}`;
  const verificationMarkdown = `<span class="markdown-body ml-0 mr-0"><code>${verificationRecord}</code></span>`;

  const MISSING_VERIFICATION_RECORD = Boom.badRequest(
    i18n.translateError(
      'MISSING_VERIFICATION_RECORD',
      domain.locale,
      verificationMarkdown
    )
  );

  const INCORRECT_VERIFICATION_RECORD = Boom.badRequest(
    i18n.translateError(
      'INCORRECT_VERIFICATION_RECORD',
      domain.locale,
      verificationMarkdown
    )
  );

  const MULTIPLE_VERIFICATION_RECORDS = Boom.badRequest(
    i18n.translateError(
      'MULTIPLE_VERIFICATION_RECORDS',
      domain.locale,
      verificationMarkdown
    )
  );

  const PURGE_CACHE = Boom.badRequest(
    i18n.translateError('PURGE_CACHE', domain.locale, domain.name)
  );

  const AUTOMATED_CHECK = Boom.badRequest(
    i18n.translateError('AUTOMATED_CHECK', domain.locale)
  );

  const MISSING_DNS_TXT = Boom.badRequest(
    i18n.translateError('MISSING_DNS_TXT', domain.locale, domain.name)
  );

  const isPaidPlan = _.isString(domain.plan) && domain.plan !== 'free';

  let forwardingAddresses = [];
  let globalForwardingAddresses = [];
  let ignoredAddresses = [];
  let errors = [];
  let verifications = [];
  let txt = false;
  let mx = false;

  //
  // attempt to purge Cloudflare cache programmatically
  //
  try {
    await Promise.all(
      CACHE_TYPES.map((type) =>
        superagent
          .post(CLOUDFLARE_PURGE_CACHE_URL)
          .query({
            domain: domain.name,
            type
          })
          .set('Accept', 'json')
          .set('User-Agent', USER_AGENT)
          .timeout(ms('5s'))
      )
    );
    logger.info('cleared DNS cache for cloudflare', {
      domain,
      types: CACHE_TYPES
    });
    // wait one second for DNS changes to propagate
    await delay(ms('1s'));
  } catch (err) {
    logger.warn(err);
  }

  //
  // validate TXT records
  //
  try {
    ({
      forwardingAddresses,
      globalForwardingAddresses,
      ignoredAddresses,
      errors,
      verifications
    } = await getTxtAddresses(domain.name, domain.locale, true, client));

    if (isPaidPlan) {
      if (
        forwardingAddresses.length > 0 ||
        globalForwardingAddresses.length > 0 ||
        ignoredAddresses.length > 0
      )
        errors.push(PAID_PLAN);
      if (verifications.length === 0) errors.push(MISSING_VERIFICATION_RECORD);
      else if (verifications.length > 1)
        errors.push(MULTIPLE_VERIFICATION_RECORDS);
      else if (!verifications.includes(domain.verification_record))
        errors.push(INCORRECT_VERIFICATION_RECORD);
      if (errors.length === 0) txt = true;
    } else if (
      forwardingAddresses.length === 0 &&
      globalForwardingAddresses.length === 0 &&
      ignoredAddresses.length === 0
    )
      errors.push(new Error(MISSING_DNS_TXT));
    else if (errors.length === 0) txt = true;
  } catch (err) {
    logger.warn(err);
    if (err.code === 'ENOTFOUND') {
      const error = new Error(config.i18n.phrases.ENOTFOUND);
      error.code = err.code;
      errors.push(error);
    } else if (err.code === 'ENODATA') {
      if (isPaidPlan) {
        const error = MISSING_VERIFICATION_RECORD;
        error.code = err.code;
        errors.push(error);
      } else {
        const error = new Error(MISSING_DNS_TXT);
        error.code = err.code;
        errors.push(error);
      }
    } else {
      errors.push(err);
    }
  }

  //
  // validate MX records
  //
  const testEmail = `test@${domain.name}`;
  try {
    const addresses = await app.validateMX(testEmail);
    const exchanges = new Set(addresses.map((mxAddress) => mxAddress.exchange));
    const hasAllExchanges = app.config.exchanges.every((exchange) =>
      exchanges.has(exchange)
    );
    if (hasAllExchanges) mx = true;
    else errors.push(MISSING_DNS_MX);
  } catch (err) {
    logger.warn(err);
    const regex = new RE2(testEmail, 'g');
    err.message = err.message.replace(regex, domain.name);
    if (err.code === 'ENOTFOUND') {
      const error = new Error(config.i18n.phrases.ENOTFOUND);
      error.code = err.code;
      errors.push(error);
    } else if (err.code === 'ENODATA') {
      const error = MISSING_DNS_MX;
      error.code = err.code;
      errors.push(error);
    } else {
      errors.push(err);
    }
  }

  if (!txt || !mx) {
    errors.push(PURGE_CACHE, AUTOMATED_CHECK);
  }

  errors = _.uniqBy(errors, 'message');

  return { txt, mx, errors };
}

Domain.statics.getVerificationResults = getVerificationResults;

async function verifyRecords(_id, locale, client) {
  const domain = await this.model('Domain').findById(_id);

  if (!domain)
    throw Boom.notFound(
      i18n.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE', locale)
    );

  const { txt, mx, errors } = await getVerificationResults(domain, client);
  // reset missing txt so we alert users if they are missing a TXT in future again
  if (!domain.has_txt_record && txt && _.isDate(domain.missing_txt_sent_at))
    domain.missing_txt_sent_at = null;
  domain.has_txt_record = txt;
  domain.has_mx_record = mx;
  domain.locale = locale;
  domain.skip_verification = true;
  await domain.save();

  // if no errors, return early
  if (errors.length === 0) return;

  const err = new Error(
    errors.length === 1
      ? errors[0]
      : i18n.translate('MULTIPLE_VERIFICATION_ERRORS', locale)
  );
  err.no_translate = true;
  if (errors.length > 1) err.errors = errors;
  throw err;
}

Domain.statics.verifyRecords = verifyRecords;

// eslint-disable-next-line complexity
async function getTxtAddresses(
  domainName,
  locale,
  allowEmpty = false,
  client = false
) {
  if (!isFQDN(domainName))
    throw Boom.badRequest(i18n.translateError('INVALID_FQDN', locale));

  logger.debug('resolveTxt', { domainName });
  const records = await app.resolver(domainName, 'TXT', false, client);

  // verification records that contain `forward-email-site-verification=` prefix
  const verifications = [];

  // dns TXT record must contain `forward-email=` prefix
  const validRecords = [];

  // add support for multi-line TXT records
  for (let i = 0; i < records.length; i++) {
    records[i] = records[i].join('').trim(); // join chunks together
    if (records[i].startsWith(`${app.config.recordPrefix}=`))
      validRecords.push(records[i].replace(`${app.config.recordPrefix}=`, ''));
    if (records[i].startsWith(`${app.config.recordPrefix}-site-verification=`))
      verifications.push(
        records[i].replace(`${app.config.recordPrefix}-site-verification=`, '')
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
      !isURL(element, app.config.isURLOptions)
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
          !isURL(addr[1], app.config.isURLOptions))
      )
        errors.push(
          new Error(
            // TODO: we may want to replace this with "Invalid Recipients"
            `Domain has an invalid "${app.config.recordPrefix}" TXT record due to an invalid email address of "${element}".`
          )
        );

      forwardingAddresses.push({ name: addr[0], recipient: addr[1] });
    } else if (isFQDN(lowerCaseAddress) || isIP(lowerCaseAddress)) {
      // allow domain alias forwarding
      // (e.. the record is just "b.com" if it's not a valid email)
      globalForwardingAddresses.push(lowerCaseAddress);
    } else if (isEmail(lowerCaseAddress)) {
      globalForwardingAddresses.push(lowerCaseAddress);
    } else if (isURL(element, app.config.isURLOptions)) {
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

Domain.statics.getTxtAddresses = getTxtAddresses;

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
        logger.fatal(new Error(`Member in ${domain.name} no longer exists`));
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
    <p class="font-weight-bold text-danger">The following errors occurred:</p>
    <ul class="mb-0 text-left"><li>${errors
      .map((e) => e.message)
      .join('</li><li>')}</li><ul>
  `);
}

Domain.statics.ensureUserHasValidPlan = ensureUserHasValidPlan;

// prevent new domains from being created with a plan
// that the user is not yet subscribed to, and also
// enforce that when domains are saved, they are required
// to have at least one admin with the plan of the domain
// (otherwise throw an error that tells them what's wrong)
Domain.pre('save', async function (next) {
  try {
    const domain = this;

    const hasBadDomain = config.badDomains.some((ext) =>
      domain.name.endsWith(ext)
    );

    if (domain.plan === 'free' && !hasBadDomain) return next();

    const users = await Users.find({
      _id: { $in: domain.members.map((m) => m.user) }
    })
      .lean()
      .select('plan')
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

    if (hasBadDomain && !hasPaidPlan)
      throw Boom.paymentRequired(
        i18n.translateError(
          'MALICIOUS_DOMAIN_PLAN_UPGRADE_REQUIRED',
          domain.locale,
          domain.name,
          `/${domain.locale}/my-account/billing/upgrade?plan=enhanced_protection`
        )
      );

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

Domain.postCreate((domain, next) => {
  // log that the domain was created
  logger.info('domain created', {
    domain: domain.toObject()
  });

  next();
});

module.exports = mongoose.model('Domain', Domain);
