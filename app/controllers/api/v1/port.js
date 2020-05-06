const dns = require('dns');
const util = require('util');

const Boom = require('@hapi/boom');
const ForwardEmail = require('forward-email');
const auth = require('basic-auth');
const isSANB = require('is-string-and-not-blank');
const { isFQDN, isPort } = require('validator');

const logger = require('../../../../helpers/logger');
const env = require('../../../../config/env');
const config = require('../../../../config');
const Domains = require('../../../models/domain');

const app = new ForwardEmail({ logger, recordPrefix: config.recordPrefix });

dns.setServers(app.config.dns);

const resolveTxtAsync = util.promisify(dns.resolveTxt);

async function port(ctx) {
  try {
    const credentials = auth(ctx.req);

    if (
      typeof credentials === 'undefined' ||
      typeof credentials.name !== 'string' ||
      !credentials.name
    )
      throw Boom.unauthorized(
        ctx.translate
          ? ctx.translate('INVALID_API_CREDENTIALS')
          : 'Invalid API credentials.'
      );

    if (!env.API_SECRETS.includes(credentials.name))
      throw Boom.unauthorized(
        ctx.translate
          ? ctx.translate('INVALID_API_TOKEN')
          : 'Invalid API token.'
      );

    if (!isSANB(ctx.query.domain) || !isFQDN(ctx.query.domain))
      throw Boom.badRequest(ctx.translate('INVALID_FQDN'));

    // TXT lookup here to find `forward-email-site-verification`
    // if a verification record was found, then look it up and if it's valid
    // otherwise if use `forward-email-port` value if it exists and valid
    // otherwise return port 25
    const records = await resolveTxtAsync(ctx.query.domain);

    const verifications = [];
    const ports = [];
    let port = 25;

    for (const element of records) {
      const record = element.join(''); // join chunks together
      if (record.startsWith(`${app.config.recordPrefix}-site-verification=`))
        verifications.push(
          record.replace(`${app.config.recordPrefix}-site-verification=`, '')
        );

      if (record.startsWith(`${app.config.recordPrefix}-port=`))
        ports.push(record.replace(`${app.config.recordPrefix}-port=`, ''));
    }

    if (verifications.length > 0) {
      if (verifications.length > 1)
        throw Boom.badRequest(ctx.translate('MULTIPLE_VERIFICATION_RECORDS'));

      const domain = await Domains.findOne({
        verification_record: verifications[0],
        plan: { $ne: 'free' }
      })
        .lean()
        .exec();

      if (!domain)
        throw Boom.badRequest(ctx.translate('DOMAIN_DOES_NOT_EXIST'));

      port = domain.smtp_port;
    } else if (ports.length > 0) {
      if (ports.length > 1)
        throw Boom.badRequest(ctx.translate('MULTIPLE_PORT_RECORDS'));
      port = ports[0];
    }

    if (!isPort(port)) throw Boom.badRequest(ctx.translate('INVALID_PORT'));

    ctx.body = { port };
  } catch (err) {
    ctx.throw(err);
  }
}

module.exports = port;
