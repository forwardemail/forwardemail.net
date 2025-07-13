/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');

const Domains = require('#models/domains');
const config = require('#config');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');

const HTTP_RETRY_ERROR_CODES = new Set([
  'ETIMEDOUT',
  'ECONNRESET',
  'EADDRINUSE',
  'ECONNREFUSED',
  'EPIPE',
  'ENOTFOUND',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'EAI_AGAIN'
]);

async function getMaxForwardedAddresses(
  name,
  resolver,
  locale = i18n.config.defaultLocale
) {
  if (!isSANB(name) || !isFQDN(name))
    throw Boom.badRequest(i18n.translateError('INVALID_FQDN', locale));

  // TXT lookup here to find `forward-email-site-verification`
  // if a verification record was found, then look it up and if it's valid
  // otherwise return default max count
  try {
    const records = await resolver.resolveTxt(name);

    const verifications = [];

    for (const element of records) {
      const record = element.join('').trim(); // join chunks together
      if (record.startsWith(`${config.recordPrefix}-site-verification=`))
        verifications.push(
          record.replace(`${config.recordPrefix}-site-verification=`, '').trim()
        );
    }

    let { maxForwardedAddresses } = config;

    if (verifications.length > 0) {
      if (verifications.length > 1)
        logger.warn(
          i18n.translateError('SINGLE_VERIFICATION_RECORD_REQUIRED', locale),
          { domain: name }
        );

      const domain = await Domains.findOne({
        name,
        verification_record: verifications[0],
        plan: { $in: ['enhanced_protection', 'team', 'enterprise'] },
        max_recipients_per_alias: { $gt: maxForwardedAddresses }
      })
        .select('max_recipients_per_alias')
        .lean()
        .exec();

      if (domain && domain.max_recipients_per_alias > maxForwardedAddresses)
        maxForwardedAddresses = domain.max_recipients_per_alias;
    }

    return { max_forwarded_addresses: maxForwardedAddresses };
  } catch (err) {
    // superagent inside of the smtp-server will retry on 408 error code
    // therefore if it is a DNS error, then send that retry code
    // otherwise send a bad request error with the error
    if (err.code && HTTP_RETRY_ERROR_CODES.has(err.code))
      throw Boom.clientTimeout(err);
    throw Boom.badRequest(err);
  }
}

module.exports = getMaxForwardedAddresses;
