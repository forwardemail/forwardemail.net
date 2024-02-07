/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

async function updateTimezone(ctx) {
  if (!isSANB(ctx.request.body.timeZone))
    throw Boom.badRequest(ctx.translateError('UNKNOWN_ERROR'));

  ctx.state.user.timezone = ctx.request.body.timeZone;
  ctx.state.user = await ctx.state.user.save();

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

module.exports = updateTimezone;
