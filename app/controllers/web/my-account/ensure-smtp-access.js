/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const _ = require('#helpers/lodash');

const Domains = require('#models/domains');

async function ensureSMTPAccess(ctx, next) {
  // domain cannot be global
  if (ctx.state.domain.is_global)
    throw Boom.badRequest(
      ctx.translateError('EMAIL_SMTP_GLOBAL_NOT_PERMITTED')
    );

  // domain cannot be in suspended domains list
  if (_.isDate(ctx.state.domain.smtp_suspended_sent_at))
    throw Boom.badRequest(ctx.translateError('DOMAIN_SUSPENDED'));

  // safeguard to ensure keys are generated
  if (
    !isSANB(ctx.state.domain.dkim_private_key) ||
    !isSANB(ctx.state.domain.return_path)
  ) {
    const domain = await Domains.findById(ctx.state.domain._id);
    domain.locale = ctx.locale;
    domain.skip_payment_check = true;
    domain.skip_verification = true;

    // Set audit metadata for domain update tracking
    domain.__audit_metadata = {
      user: ctx.state.user,
      ip: ctx.ip,
      userAgent: ctx.get('User-Agent')
    };

    await domain.save();
    ctx.state.domain.dkim_key_selector = domain.dkim_key_selector;
    ctx.state.domain.dkim_public_key = domain.dkim_public_key;
    ctx.state.domain.dkim_private_key = domain.dkim_private_key;
    ctx.state.domain.return_path = domain.return_path;
  }

  // domain must be enabled
  // if (!ctx.state.domain.has_smtp)
  //   throw Boom.badRequest(ctx.translateError('EMAIL_SMTP_ACCESS_REQUIRED'));

  return next();
}

module.exports = ensureSMTPAccess;
