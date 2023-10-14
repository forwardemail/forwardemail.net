/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');

const config = require('#config');

async function ensureNotBanned(ctx, next) {
  if (!ctx.isAuthenticated()) return next();
  if (ctx.state.user[config.userFields.isBanned]) {
    if (ctx.api) throw Boom.forbidden(ctx.translateError('ACCOUNT_BANNED'));

    const redirectTo = ctx.state.l('/');
    try {
      ctx.logout();
      await ctx.regenerateSession();
      ctx.flash('error', ctx.translate('ACCOUNT_BANNED'));
      await ctx.saveSession();
    } catch (err) {
      ctx.logger.error(err);
    }

    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
    return;
  }

  return next();
}

module.exports = ensureNotBanned;
