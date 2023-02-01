const Boom = require('@hapi/boom');
const ForwardEmail = require('forward-email');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const { isPort } = require('validator');

const logger = require('#helpers/logger');
const config = require('#config');
const Domains = require('#models/domains');

const app = new ForwardEmail({
  logger,
  recordPrefix: config.recordPrefix,
  srs: { secret: 'null' },
  redis: false
});

async function port(ctx) {
  try {
    if (!isSANB(ctx.query.domain) || !isFQDN(ctx.query.domain))
      throw Boom.badRequest(ctx.translateError('INVALID_FQDN'));

    // TXT lookup here to find `forward-email-site-verification`
    // if a verification record was found, then look it up and if it's valid
    // otherwise if use `forward-email-port` value if it exists and valid
    // otherwise return port 25
    try {
      const records = await app.resolver(
        ctx.query.domain,
        'TXT',
        false,
        ctx.client
      );

      const verifications = [];
      const ports = [];
      let port = '25';

      for (const element of records) {
        const record = element.join('').trim(); // join chunks together
        if (record.startsWith(`${app.config.recordPrefix}-site-verification=`))
          verifications.push(
            record.replace(`${app.config.recordPrefix}-site-verification=`, '')
          );

        if (record.startsWith(`${app.config.recordPrefix}-port=`))
          ports.push(record.replace(`${app.config.recordPrefix}-port=`, ''));
      }

      if (verifications.length > 0) {
        if (verifications.length > 1)
          throw Boom.badRequest(
            ctx.translateError('SINGLE_VERIFICATION_RECORD_REQUIRED')
          );

        const domain = await Domains.findOne({
          verification_record: verifications[0],
          plan: { $ne: 'free' }
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
      }

      if (!isPort(port))
        throw Boom.badRequest(ctx.translateError('INVALID_PORT'));

      ctx.body = { port };
    } catch (err) {
      throw Boom.badRequest(err);
    }
  } catch (err) {
    ctx.throw(err);
  }
}

module.exports = port;
