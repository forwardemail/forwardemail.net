const ForwardEmail = require('forward-email');
const _ = require('lodash');
const ajc = require('array-join-conjunction');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const { isFQDN, isIP } = require('validator');

const logger = require('../../helpers/logger');

const app = new ForwardEmail({ logger });

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const Domain = new mongoose.Schema({
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
  name: {
    type: String,
    required: true,
    // must be IP or FQDN
    validate: {
      validator: name => isFQDN(name) || isIP(name),
      message: props =>
        `"${props.value}" is not a valid fully-qualified domain name nor IP address.`
    }
  },
  has_mx_record: {
    type: Boolean,
    default: false
  },
  has_txt_record: {
    type: Boolean,
    default: false
  }
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

async function getVerificationResults(domain) {
  //
  // logic is pulled from `onRcptTo` in `forward-email` package
  //

  // validate forwarding address by looking up TXT record `forward-email=`
  const errors = [];
  const email = `test@${domain.name}`;
  const ENOTFOUND = new Error(
    `${domain.name} is not a registered domain name, but you can <a href="/domain-registration">register it now</a> if you're interested.`
  );
  const MISSING_DNS_MX = new Error(
    `${domain.name} is missing required DNS MX records of ${ajc(
      app.config.exchanges
    )}`
  );
  let txt = false;
  let mx = false;
  try {
    await app.getForwardingAddresses(email);
    txt = true;
  } catch (err) {
    logger.error(err);
    if (err.code === 'ENOTFOUND') errors.push(ENOTFOUND);
    else if (err.code === 'ENODATA')
      errors.push(
        new Error(`${domain.name} is missing the required DNS TXT records.`)
      );
    else errors.push(err);
  }

  try {
    // validate MX records exist and contain ours
    const addresses = await app.validateMX(email);
    const exchanges = addresses.map(mxAddress => mxAddress.exchange);
    const hasAllExchanges = app.config.exchanges.every(exchange =>
      exchanges.includes(exchange)
    );
    if (hasAllExchanges) mx = true;
    else errors.push(MISSING_DNS_MX);
  } catch (err) {
    logger.error(err);
    if (err.code === 'ENOTFOUND') errors.push(ENOTFOUND);
    else if (err.code === 'ENODATA') errors.push(MISSING_DNS_MX);
    else errors.push(err);
  }

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

  if (errors.length > 0)
    throw new Error(_.uniq(errors.map(err => err.message)).join(' '));
}

Domain.statics.verifyRecords = verifyRecords;

module.exports = mongoose.model('Domain', Domain);
