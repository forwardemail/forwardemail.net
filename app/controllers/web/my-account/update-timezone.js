/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const TimezoneHandler = require('#helpers/timezone-handler');
const Users = require('#models/users');

const timezoneHandler = new TimezoneHandler();

async function updateTimezone(ctx) {
  if (!isSANB(ctx.request.body.timeZone))
    throw Boom.badRequest(ctx.translateError('UNKNOWN_ERROR'));

  let timezone = ctx.request.body.timeZone;

  try {
    const normalized = timezoneHandler.normalizeTimezone(timezone);
    const works = timezoneHandler.testTimezone(normalized);
    timezone = works ? normalized : 'UTC';
  } catch (err) {
    ctx.logger.fatal(err);
    timezone = 'UTC';
  }

  await Users.findByIdAndUpdate(ctx.state.user._id, {
    $set: {
      timezone
    }
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

module.exports = updateTimezone;
