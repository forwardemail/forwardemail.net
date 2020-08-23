const dns = require('dns');

const Boom = require('@hapi/boom');
const ForwardEmail = require('forward-email');
const isSANB = require('is-string-and-not-blank');
const { isFQDN } = require('validator');

const logger = require('../../../../helpers/logger');
const config = require('../../../../config');
const Domains = require('../../../models/domain');

const app = new ForwardEmail({
  logger,
  recordPrefix: config.recordPrefix,
  srs: { secret: 'null' },
  redis: false
});

async function maxForwardedAddresses(ctx) {
  try {
    if (!isSANB(ctx.query.domain) || !isFQDN(ctx.query.domain))
      throw Boom.badRequest(ctx.translateError('INVALID_FQDN'));

    // TXT lookup here to find `forward-email-site-verification`
    // if a verification record was found, then look it up and if it's valid
    // otherwise return default max count
    try {
      const records = await dns.promises.resolveTxt(ctx.query.domain);

      const verifications = [];

      for (const element of records) {
        const record = element.join('').trim(); // join chunks together
        if (record.startsWith(`${app.config.recordPrefix}-site-verification=`))
          verifications.push(
            record.replace(`${app.config.recordPrefix}-site-verification=`, '')
          );
      }

      let { maxForwardedAddresses } = app.config;

      if (verifications.length > 0) {
        if (verifications.length > 1)
          throw Boom.badRequest(
            ctx.translateError('SINGLE_VERIFICATION_RECORD_REQUIRED')
          );

        const domain = await Domains.findOne({
          verification_record: verifications[0],
          plan: { $ne: 'free' }
        })
          .select('max_recipients_per_alias')
          .lean()
          .exec();

        if (!domain)
          throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

        if (domain.max_recipients_per_alias > 0)
          maxForwardedAddresses = domain.max_recipients_per_alias;
      }

      ctx.body = { max_forwarded_addresses: maxForwardedAddresses };
    } catch (err) {
      throw Boom.badRequest(err);
    }
  } catch (err) {
    ctx.throw(err);
  }
}

module.exports = maxForwardedAddresses;
