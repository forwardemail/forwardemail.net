/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const Users = require('#models/users');

async function updateTimezone(ctx) {
  if (!isSANB(ctx.request.body.timeZone))
    throw Boom.badRequest(ctx.translateError('UNKNOWN_ERROR'));

  await Users.findByIdAndUpdate(ctx.state.user._id, {
    $set: {
      timezone: ctx.request.body.timeZone
    }
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

module.exports = updateTimezone;
