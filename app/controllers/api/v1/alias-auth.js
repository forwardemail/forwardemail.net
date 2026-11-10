/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const basicAuth = require('basic-auth');

const setupAuthSession = require('#helpers/setup-auth-session');
const {
  refreshSubscriptionsInBackground
} = require('#helpers/refresh-calendar-subscriptions');

async function aliasAuth(ctx, next) {
  try {
    // Get basic auth credentials
    const creds = basicAuth(ctx);

    if (!creds || !creds.name || !creds.pass) {
      ctx.response.set('WWW-Authenticate', 'Basic realm="forwardemail/api"');
      throw Boom.unauthorized('Basic authentication required');
    }

    ctx.logger.debug('authenticate', {
      username: creds.name
    });

    // Use setupAuthSession similar to CardDAV
    await setupAuthSession.call(ctx.instance, ctx, creds.name, creds.pass);

    // (calendars subscribed to a feed are refreshed while their owner is
    // signed in and looking at calendars; never waited for)
    if (ctx.path.startsWith('/v1/calendar'))
      refreshSubscriptionsInBackground(ctx.instance, ctx);

    return next();
  } catch (err) {
    // (refused attempts are answered with 429, see `setupAuthSession`)
    if (!err.isRateLimited) ctx.logger.error(err);
    if (!err.isBoom) {
      ctx.response.set('WWW-Authenticate', 'Basic realm="forwardemail/api"');
      throw Boom.unauthorized('Authentication failed');
    }

    throw err;
  }
}

module.exports = aliasAuth;
