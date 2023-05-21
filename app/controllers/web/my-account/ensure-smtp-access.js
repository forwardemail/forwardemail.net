const Boom = require('@hapi/boom');
const _ = require('lodash');

function ensureSMTPAccess(ctx, next) {
  // domain cannot be in suspended domains list
  if (_.isDate(ctx.state.domain.smtp_suspended_sent_at))
    throw Boom.badRequest(ctx.translateError('DOMAIN_SUSPENDED'));

  // domain must be enabled
  if (!ctx.state.domain.has_smtp)
    throw Boom.badRequest(ctx.translateError('EMAIL_SMTP_ACCESS_REQUIRED'));

  return next();
}

module.exports = ensureSMTPAccess;
