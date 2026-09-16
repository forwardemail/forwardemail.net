/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const config = require('#config');

async function disableAPIToken(ctx) {
  ctx.state.user[config.userFields.apiTokenDisabled] = true;
  ctx.state.user = await ctx.state.user.save();

  if (!ctx.api)
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translateError('API_TOKEN_DISABLED'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { [config.userFields.apiTokenDisabled]: true };
}

module.exports = disableAPIToken;
