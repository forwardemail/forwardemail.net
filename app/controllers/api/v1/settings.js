const Boom = require('@hapi/boom');
const ForwardEmail = require('forward-email');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const { isPort } = require('validator');

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

async function settings(ctx) {
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
      let hasAdultContentProtection = true;
      let hasPhishingProtection = true;
      let hasExecutableProtection = true;
      let hasVirusProtection = true;

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
          ctx.logger.error(
            ctx.translateError('SINGLE_VERIFICATION_RECORD_REQUIRED')
          );

        const domain = await Domains.findOne({
          verification_record: verifications[0],
          plan: { $ne: 'free' }
        })
          .select(
            'smtp_port has_adult_content_protection has_phishing_protection has_executable_protection has_virus_protection'
          )
          .lean()
          .exec();

        if (domain) {
          port = domain.smtp_port;
          hasAdultContentProtection = domain.has_adult_content_protection;
          hasPhishingProtection = domain.has_phishing_protection;
          hasExecutableProtection = domain.has_executable_protection;
          hasVirusProtection = domain.has_virus_protection;
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
          ctx.logger.error(ctx.translateError('MULTIPLE_PORT_RECORDS'));
        port = ports[0];
      }

      if (!isPort(port)) {
        ctx.logger.error(ctx.translateError('INVALID_PORT'));
        port = '25';
      }

      ctx.body = {
        port,
        has_adult_content_protection: hasAdultContentProtection,
        has_phishing_protection: hasPhishingProtection,
        has_executable_protection: hasExecutableProtection,
        has_virus_protection: hasVirusProtection
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
