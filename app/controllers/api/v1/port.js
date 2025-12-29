/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const Boom = require('@hapi/boom');
const isBase64 = require('is-base64');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const { isPort } = require('@forwardemail/validator');

const env = require('#config/env');
const config = require('#config');
const Domains = require('#models/domains');
const { decrypt } = require('#helpers/encrypt-decrypt');

async function port(ctx) {
  if (!isSANB(ctx.query.domain) || !isFQDN(ctx.query.domain))
    throw Boom.badRequest(ctx.translateError('INVALID_FQDN'));

  // TXT lookup here to find `forward-email-site-verification`
  // if a verification record was found, then look it up and if it's valid
  // otherwise if use `forward-email-port` value if it exists and valid
  // otherwise return port 25
  try {
    const records = await ctx.resolver.resolveTxt(ctx.query.domain);

    const verifications = [];
    const ports = [];
    let port = '25';

    for (const element of records) {
      const record = element.join('').trim(); // join chunks together
      if (record.startsWith(`${config.recordPrefix}-site-verification=`))
        verifications.push(
          record.replace(`${config.recordPrefix}-site-verification=`, '')
        );

      if (record.startsWith(`${config.recordPrefix}-port=`))
        ports.push(record.replace(`${config.recordPrefix}-port=`, ''));
    }

    if (verifications.length > 0) {
      if (verifications.length > 1)
        throw Boom.badRequest(
          ctx.translateError('SINGLE_VERIFICATION_RECORD_REQUIRED')
        );

      const domain = await Domains.findOne({
        name: ctx.query.domain,
        verification_record: verifications[0],
        plan: { $in: ['enhanced_protection', 'team'] }
      })
        .lean()
        .exec();

      if (!domain)
        throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

      port = domain.smtp_port;
    } else if (ports.length > 0) {
      if (ports.length > 1)
        throw Boom.badRequest(ctx.translateError('MULTIPLE_PORT_RECORDS'));
      port = ports[0];
      // if it was base64 then attempt to decrypt it
      if (isBase64(port)) {
        try {
          port = decrypt(
            Buffer.from(port, 'base64').toString('hex'),
            env.TXT_ENCRYPTION_KEY
          );
        } catch (err) {
          ctx.logger.debug(err);
        }
      }
    }

    if (!isPort(port))
      throw Boom.badRequest(ctx.translateError('INVALID_PORT'));

    ctx.body = { port };
  } catch (err) {
    if (err.isBoom) throw err;
    throw Boom.badRequest(err);
  }
}

module.exports = port;
