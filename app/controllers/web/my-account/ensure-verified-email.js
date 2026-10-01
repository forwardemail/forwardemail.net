/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');

const config = require('#config');

//
// Sign-in methods (passkeys, two-factor) can only be added once the email
// address is verified.  Anyone can create an account for an email address
// they do not own; a passkey or two-factor secret added before the owner
// verifies (or recovers) it would otherwise keep working for them afterwards.
//
async function ensureVerifiedEmail(ctx, next) {
  if (ctx.state.user?.[config.userFields.hasVerifiedEmail]) return next();

  if (ctx.method === 'GET' && ctx.accepts('html')) {
    ctx.flash('warning', ctx.translate('EMAIL_VERIFICATION_REQUIRED'));
    ctx.redirect(ctx.state.l(config.verifyRoute));
    return;
  }

  throw Boom.forbidden(ctx.translateError('EMAIL_VERIFICATION_REQUIRED'));
}

module.exports = ensureVerifiedEmail;
