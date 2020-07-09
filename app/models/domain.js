const dns = require('dns');

const Boom = require('@hapi/boom');
const ForwardEmail = require('forward-email');
const RE2 = require('re2');
const _ = require('lodash');
const captainHook = require('captain-hook');
const cryptoRandomString = require('crypto-random-string');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const { boolean } = require('boolean');
const { isFQDN, isIP, isEmail, isPort, isURL } = require('validator');

const logger = require('../../helpers/logger');
const config = require('../../config');
const i18n = require('../../helpers/i18n');

const app = new ForwardEmail({
  logger,
  recordPrefix: config.recordPrefix,
  srs: { secret: 'null' },
  redis: false
});

const EXCHANGES = app.config.exchanges
  .map(
    (exchange, i) =>
      `<li><code>${Number.parseInt((i + 1) * 10, 10)} ${exchange}</code></li>`
  )
  .join('');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const verificationRecordOptions = require('../../config/verification-record');

const REGEX_VERIFICATION = new RE2(/[^\da-z]/gi);

const Member = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
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
  plan: {
    type: String,
    enum: ['free', 'enhanced_protection', 'team'],
    default: 'free'
  },
  max_recipients_per_alias: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
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
  }
});

Domain.plugin(captainHook);

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

Domain.pre('validate', function (next) {
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
      this.verification_record = cryptoRandomString(verificationRecordOptions);

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
      !domain.members.find(
        (member) =>
          typeof member.user !== 'undefined' && member.group === 'admin'
      )
    )
      throw Boom.badRequest(
        i18n.translateError('AT_LEAST_ONE_ADMIN_REQUIRED', domain.locale)
      );
    const { txt, mx } = await getVerificationResults(domain);
    domain.has_txt_record = txt;
    domain.has_mx_record = mx;
    next();
  } catch (err) {
    next(err);
  }
});

Domain.plugin(mongooseCommonPlugin, {
  object: 'domain',
  omitExtraFields: ['is_global']
});

// eslint-disable-next-line complexity
async function getVerificationResults(domain) {
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
  // validate TXT records
  //
  try {
    ({
      forwardingAddresses,
      globalForwardingAddresses,
      ignoredAddresses,
      errors,
      verifications
    } = await getTxtAddresses(domain.name, domain.locale, true));

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
    if (err.code === 'ENOTFOUND')
      errors.push(new Error(config.i18n.phrases.ENOTFOUND));
    else if (err.code === 'ENODATA') {
      if (isPaidPlan) errors.push(MISSING_VERIFICATION_RECORD);
      else errors.push(new Error(MISSING_DNS_TXT));
    } else errors.push(err);
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
    const regex = new RegExp(testEmail, 'g');
    err.message = err.message.replace(regex, domain.name);
    if (err.code === 'ENOTFOUND')
      errors.push(new Error(config.i18n.phrases.ENOTFOUND));
    else if (err.code === 'ENODATA') errors.push(MISSING_DNS_MX);
    else errors.push(err);
  }

  if (!txt || !mx) errors.push(PURGE_CACHE);

  errors = _.uniqBy(errors, 'message');

  return { txt, mx, errors };
}

Domain.statics.getVerificationResults = getVerificationResults;

async function verifyRecords(_id, locale) {
  const domain = await this.model('Domain').findById(_id);

  if (!domain)
    throw Boom.badRequest(
      i18n.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE', locale)
    );

  const { txt, mx, errors } = await getVerificationResults(domain);
  domain.has_txt_record = txt;
  domain.has_mx_record = mx;
  domain.locale = locale;
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
async function getTxtAddresses(domainName, locale, allowEmpty = false) {
  if (!isFQDN(domainName))
    throw Boom.badRequest(i18n.translateError('INVALID_FQDN', locale));

  logger.debug('resolveTxt', { domainName });
  const records = await dns.promises.resolveTxt(domainName);

  // verification records that contain `forward-email-site-verification=` prefix
  const verifications = [];

  // dns TXT record must contain `forward-email=` prefix
  const validRecords = [];

  // add support for multi-line TXT records
  for (let i = 0; i < records.length; i++) {
    records[i] = records[i].join(''); // join chunks together
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
      lowerCaseAddress.includes(':') &&
      !isURL(element, app.config.isURLOptions)
    ) {
      const addr = lowerCaseAddress.split(':');

      // addr[0] = hello (username)
      // addr[1] = niftylettuce@gmail.com (forwarding email)
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
            `Domain has an invalid "${app.config.recordPrefix}" TXT record due to an invalid email address of "${element}".`
          )
        );

      forwardingAddresses.push({ name: addr[0], recipient: addr[1] });
    } else if (isFQDN(lowerCaseAddress) || isIP(lowerCaseAddress)) {
      // allow domain alias forwarding
      // (e.. the record is just "b.com" if it's not a valid email)
      globalForwardingAddresses.push(lowerCaseAddress);
    } else if (isEmail(lowerCaseAddress)) {
      const domain = app.parseDomain(lowerCaseAddress, false);
      if (isFQDN(domain) || isIP(domain))
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

Domain.postCreate((domain, next) => {
  logger.info('domain created', {
    domain: domain.toObject(),
    slack: true
  });
  next();
});

module.exports = mongoose.model('Domain', Domain);
