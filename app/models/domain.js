const dns = require('dns');
const util = require('util');

const Boom = require('@hapi/boom');
const ForwardEmail = require('forward-email');
const _ = require('lodash');
const cryptoRandomString = require('crypto-random-string');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const { isFQDN, isIP, isEmail } = require('validator');

const logger = require('../../helpers/logger');
const config = require('../../config');

const app = new ForwardEmail({ logger, recordPrefix: config.recordPrefix });

dns.setServers(app.config.dns);

const resolveTxtAsync = util.promisify(dns.resolveTxt);

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const verificationRecordOptions = require('../../config/verification-record');

const Domain = new mongoose.Schema({
  plan: {
    type: String,
    enum: ['free', 'enhanced_protection', 'team'],
    default: 'free'
  },
  members: [
    {
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
    }
  ],
  invites: [
    {
      email: {
        type: String,
        required: true,
        index: true,
        trim: true,
        lowercase: true,
        validate: val => isEmail(val)
      },
      group: {
        type: String,
        default: 'user',
        enum: ['admin', 'user'],
        lowercase: true,
        trim: true
      }
    }
  ],
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    // must be IP or FQDN
    validate: {
      validator: name => isFQDN(name) || isIP(name),
      message:
        'Domain name is not a fully-qualified domain name ("FQDN") nor IP address.'
    }
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
    unique: true,
    validate: {
      validator: val => isSANB(val) && val.replace(/[^0-9a-z]/gi, '') === val,
      message:
        'Verification record must only use characters A-Z and numbers 0-9.'
    }
  }
});

Domain.pre('validate', function(next) {
  if (!this.plan) this.plan = 'free';
  if (this.is_global) this.plan = 'team';
  if (!isSANB(this.verification_record))
    this.verification_record = cryptoRandomString(verificationRecordOptions);
  next();
});

Domain.pre('validate', async function(next) {
  try {
    const domain = this;
    if (
      !Array.isArray(domain.members) ||
      domain.members.length === 0 ||
      !domain.members.find(
        member => typeof member.user !== 'undefined' && member.group === 'admin'
      )
    )
      throw new Error('At least one admin user must belong to the domain.');
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
  omitExtraFields: []
});

// eslint-disable-next-line complexity
async function getVerificationResults(domain) {
  const ENOTFOUND = new Error(
    `Domain is not a registered domain name. <a href="/domain-registration">Click here to register it now</a>.`
  );

  const MISSING_DNS_TXT = new Error(
    'Domain is missing required DNS TXT records.'
  );

  const MISSING_DNS_MX = new Error(`
    <p class="mb-0">Domain is missing required DNS MX records of:</p>
    <ul class="markdown-body ml-0 mr-0 mb-3">
      ${app.config.exchanges
        .map(
          (exchange, i) =>
            `<li><code>${parseInt((i + 1) * 10, 10)} ${exchange}</code></li>`
        )
        .join(
          ''
        )}</ul><p class="mb-0">Please ensure you do not have any typos and have both unique records added (e.g. make sure both records aren't the same).</p>`);

  const PAID_PLAN = new Error(
    `Domain is on a paid plan and has "Enhanced Protection".  To proceed with verification, please <a href="${config.urls.web}/my-account/domains/${domain.id}/aliases">configure and import</a> your Aliases.  Once you have configured your Aliases, then please remove all TXT records prefixed with "${app.config.recordPrefix}=" and try again.`
  );

  const verificationRecord = `${app.config.recordPrefix}-site-verification=${domain.verification_record}`;
  const verificationMarkdown = `<span class="markdown-body ml-0 mr-0"><code>${verificationRecord}</code></span>`;

  const MISSING_VERIFICATION_RECORD = new Error(
    `Domain is missing required DNS TXT record of: ${verificationMarkdown}`
  );

  const INCORRECT_VERIFICATION_RECORD = new Error(
    `Domain has an incorrect DNS TXT record for verification.  Please ensure ${verificationMarkdown} is the only verification record that exists.`
  );

  const MULTIPLE_VERIFICATION_RECORDS = new Error(
    `Domain has multiple verification records.  Please ensure ${verificationMarkdown} is the only verification record that exists.`
  );

  const PURGE_CACHE = new Error(
    `If you recently updated your DNS records for ${domain.name}, then you should purge its cache using <a href="https://1.1.1.1/purge-cache/" rel="noopener" target="_blank">Cloudflare's Purge Cache Tool</a> and optionally <a href="https://developers.google.com/speed/public-dns/cache" rel="noopener" target="_blank">Google's Purge Cache Tool</a>.  Note that sometimes it may take 30 minutes to 24 hours (depending on your location and provider) for the Internet's DNS propagation to finish.`
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
    } = await getTxtAddresses(domain.name, true));

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
      errors.push(MISSING_DNS_TXT);
    else if (errors.length === 0) txt = true;
  } catch (err) {
    logger.error(err);
    if (err.code === 'ENOTFOUND') errors.push(ENOTFOUND);
    else if (err.code === 'ENODATA') {
      if (isPaidPlan) errors.push(MISSING_VERIFICATION_RECORD);
      else errors.push(MISSING_DNS_TXT);
    } else errors.push(err);
  }

  //
  // validate MX records
  //
  const testEmail = `test@${domain.name}`;
  try {
    const addresses = await app.validateMX(testEmail);
    const exchanges = addresses.map(mxAddress => mxAddress.exchange);
    const hasAllExchanges = app.config.exchanges.every(exchange =>
      exchanges.includes(exchange)
    );
    if (hasAllExchanges) mx = true;
    else errors.push(MISSING_DNS_MX);
  } catch (err) {
    logger.error(err);
    const regex = new RegExp(testEmail, 'g');
    err.message = err.message.replace(regex, domain.name);
    if (err.code === 'ENOTFOUND') errors.push(ENOTFOUND);
    else if (err.code === 'ENODATA') errors.push(MISSING_DNS_MX);
    else errors.push(err);
  }

  if (!txt || !mx) errors.push(PURGE_CACHE);

  errors = _.uniqBy(errors, 'message');

  return { txt, mx, errors };
}

Domain.statics.getVerificationResults = getVerificationResults;

async function verifyRecords(_id) {
  const domain = await this.model('Domain').findById(_id);

  if (!domain) throw new Error('Domain does not exist.');

  const { txt, mx, errors } = await getVerificationResults(domain);
  domain.has_txt_record = txt;
  domain.has_mx_record = mx;
  await domain.save();

  // TODO: these errors need translated better
  // (e.g. we could use `koa-better-error-handler`'s `no_translate=true`
  if (errors.length > 0)
    throw new Error(
      `<ul class="text-left mb-0"><li class="mb-3">${errors
        .map(err => err.message)
        .join('</li><li class="mb-3">')}</li></ul>`
    );
}

Domain.statics.verifyRecords = verifyRecords;

async function getTxtAddresses(domainName, allowEmpty = false) {
  if (!isFQDN(domainName))
    throw new Error('Domain must be a fully-qualified domain name ("FQDN")');

  const records = await resolveTxtAsync(domainName);

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
  const record = validRecords
    .join(',')
    .replace(/,+/g, ',')
    .trim();

  // remove trailing whitespaces from each address listed
  const addresses = isSANB(record) ? record.split(',').map(a => a.trim()) : [];

  if (!allowEmpty && addresses.length === 0)
    throw Boom.badRequest('Domain did not have any valid TXT records.');

  // store if we have a forwarding address or not
  const forwardingAddresses = [];

  // store if we have a global redirect or not
  const globalForwardingAddresses = [];

  // store if we have ignored addresses or not
  const ignoredAddresses = [];

  // store errors
  const errors = [];

  for (let i = 0; i < addresses.length; i++) {
    // convert addresses to lowercase
    addresses[i] = addresses[i].toLowerCase();
    if (addresses[i].includes(':')) {
      const addr = addresses[i].split(':');

      if (addr.length !== 2 || !isEmail(addr[1]))
        errors.push(
          new Error(
            `Domain has an invalid "${app.config.recordPrefix}" TXT record due to an invalid email address of "${addresses[i]}".`
          )
        );

      // addr[0] = hello (username)
      // addr[1] = niftylettuce@gmail.com (forwarding email)

      // check if we have a match (and if it is ignored)
      if (addr[0].indexOf('!') === 0)
        ignoredAddresses.push({ name: addr[0].slice(1), recipient: addr[1] });
      else forwardingAddresses.push({ name: addr[0], recipient: addr[1] });
    } else if (isFQDN(addresses[i])) {
      // TODO: allow domain alias forwarding
      // (e.. the record is just "b.com" if it's not a valid email)
      // globalForwardingAddresses.push(addresses[i]);
      errors.push(
        new Error(
          `Catch-all address that forwards to ${addresses[i]} was ignored (coming soon; please email support@forwardemail.net if you critically need this feature).`
        )
      );
    } else {
      const domain = app.parseDomain(addresses[i], false);
      if (isFQDN(domain) && isEmail(addresses[i]))
        globalForwardingAddresses.push(addresses[i]);
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

module.exports = mongoose.model('Domain', Domain);
