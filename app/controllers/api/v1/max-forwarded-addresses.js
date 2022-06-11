const Boom = require('@hapi/boom');
const ForwardEmail = require('forward-email');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');

const logger = require('#helpers/logger');
const config = require('#config');
const Domains = require('#models/domain');

const app = new ForwardEmail({
  logger,
  recordPrefix: config.recordPrefix,
  srs: { secret: 'null' },
  redis: false
});

const HTTP_RETRY_ERROR_CODES = new Set([
  'ETIMEDOUT',
  'ECONNRESET',
  'EADDRINUSE',
  'ECONNREFUSED',
  'EPIPE',
  'ENOTFOUND',
  'ENETUNREACH',
  'EAI_AGAIN'
]);

async function maxForwardedAddresses(ctx) {
  try {
    if (!isSANB(ctx.query.domain) || !isFQDN(ctx.query.domain))
      throw Boom.badRequest(ctx.translateError('INVALID_FQDN'));

    // TXT lookup here to find `forward-email-site-verification`
    // if a verification record was found, then look it up and if it's valid
    // otherwise return default max count
    try {
      const records = await app.resolver(
        ctx.query.domain,
        'TXT',
        false,
        ctx.client
      );

      const verifications = [];

      for (const element of records) {
        const record = element.join('').trim(); // join chunks together
        if (record.startsWith(`${app.config.recordPrefix}-site-verification=`))
          verifications.push(
            record
              .replace(`${app.config.recordPrefix}-site-verification=`, '')
              .trim()
          );
      }

      let { maxForwardedAddresses } = app.config;

      if (verifications.length > 0) {
        if (verifications.length > 1)
          ctx.logger.fatal(
            ctx.translateError('SINGLE_VERIFICATION_RECORD_REQUIRED'),
            { domain: ctx.query.domain }
          );

        const domain = await Domains.findOne({
          verification_record: { $in: verifications },
          plan: { $ne: 'free' },
          max_recipients_per_alias: { $gt: maxForwardedAddresses }
        })
          .select('max_recipients_per_alias')
          .lean()
          .exec();

        if (domain && domain.max_recipients_per_alias > maxForwardedAddresses)
          maxForwardedAddresses = domain.max_recipients_per_alias;
      }

      ctx.body = { max_forwarded_addresses: maxForwardedAddresses };
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

module.exports = maxForwardedAddresses;
