/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

const Boom = require('@hapi/boom');
const isBase64 = require('is-base64');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const { isPort } = require('validator');

const env = require('#config/env');
const config = require('#config');
const Domains = require('#models/domains');
const { encrypt, decrypt } = require('#helpers/encrypt-decrypt');

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

// eslint-disable-next-line complexity
async function settings(ctx) {
  try {
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
      let hasAdultContentProtection = true;
      let hasPhishingProtection = true;
      let hasExecutableProtection = true;
      let hasVirusProtection = true;
      let allowlist = [];
      let denylist = [];
      let webhookKey;

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
          ctx.logger.warn(
            ctx.translateError('SINGLE_VERIFICATION_RECORD_REQUIRED')
          );

        const domain = await Domains.findOne({
          name: ctx.query.domain,
          verification_record: verifications[0]
        })
          .select(
            'allowlist denylist smtp_port has_adult_content_protection has_phishing_protection has_executable_protection has_virus_protection webhook_key'
          )
          .lean()
          .exec();

        if (domain && domain.plan !== 'free') {
          port = domain.smtp_port;
          hasAdultContentProtection = domain.has_adult_content_protection;
          hasPhishingProtection = domain.has_phishing_protection;
          hasExecutableProtection = domain.has_executable_protection;
          hasVirusProtection = domain.has_virus_protection;
          //
          // if domain does not yet have a webhook key then create one for it
          // `crypto.randomBytes(16).toString('hex')` yields 32 bytes
          //
          if (!domain.webhook_key) {
            // SHA256 HMAC should not exceed 512 bytes for key length
            // <https://security.stackexchange.com/a/96176>
            webhookKey = encrypt(crypto.randomBytes(16).toString('hex'));
            await Domains.findByIdAndUpdate(domain._id, {
              $set: { webhook_key: webhookKey }
            });
          }

          if (Array.isArray(domain.allowlist)) allowlist = domain.allowlist;
          if (Array.isArray(domain.denylist)) denylist = domain.denylist;
        } else {
          ctx.logger.warn(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));
          /*
          // TODO: <https://github.com/forwardemail/forwardemail.net/issues/60>
          ctx.logger.error(
            new Error(
              `${ctx.query.domain} has forward-email-site-verification=${verifications[0]} which is no longer valid and needs fixed`
            )
          );
          */
        }
      } else if (ports.length > 0) {
        if (ports.length > 1)
          ctx.logger.warn(ctx.translateError('MULTIPLE_PORT_RECORDS'));
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

      if (!isPort(port)) {
        ctx.logger.warn(ctx.translateError('INVALID_PORT'));
        port = '25';
      }

      ctx.body = {
        port,
        has_adult_content_protection: hasAdultContentProtection,
        has_phishing_protection: hasPhishingProtection,
        has_executable_protection: hasExecutableProtection,
        has_virus_protection: hasVirusProtection,
        allowlist,
        denylist,
        webhook_key: webhookKey
      };
    } catch (err) {
      // superagent inside of the smtp-server will retry on 408 error code
      // therefore if it is a DNS error, then send that retry code
      // otherwise send a bad request error with the error
      if (err.code && HTTP_RETRY_ERROR_CODES.has(err.code))
        throw Boom.clientTimeout(err);
      throw Boom.badRequest(err);
    }
  } catch (err) {
    ctx.throw(err);
  }
}

module.exports = settings;
