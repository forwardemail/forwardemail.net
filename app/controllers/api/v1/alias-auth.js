/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const basicAuth = require('basic-auth');

const setupAuthSession = require('#helpers/setup-auth-session');

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

    return next();
  } catch (err) {
    ctx.logger.error(err);
    if (!err.isBoom) {
      ctx.response.set('WWW-Authenticate', 'Basic realm="forwardemail/api"');
      throw Boom.unauthorized('Authentication failed');
    }

    throw err;
  }
}

module.exports = aliasAuth;
