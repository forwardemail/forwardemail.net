/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const config = require('#config');

async function checkVerifiedEmail(ctx, next) {
  if (ctx.method !== 'GET' || !ctx.accepts('html')) return next();
  if (!ctx.isAuthenticated()) return next();
  if (ctx.state.user[config.userFields.hasVerifiedEmail]) return next();
  ctx.flash('custom', {
    title: ctx.request.t('Warning'),
    html: ctx.translate('USER_UNVERIFIED', ctx.state.l(config.verifyRoute)),
    type: 'warning',
    toast: true,
    position: 'top',
    showConfirmButton: false
  });
  return next();
}

module.exports = checkVerifiedEmail;
