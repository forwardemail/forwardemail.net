/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');

const i18n = require('#helpers/i18n');
const onAuth = require('#helpers/on-auth');
const refreshSession = require('#helpers/refresh-session');

async function onAuthPromise(auth, session) {
  return new Promise((resolve, reject) => {
    onAuth.call(this, auth, session, (err, user) => {
      if (err) return reject(err);
      resolve(user);
    });
  });
}

async function setupAuthSession(ctx, username, password) {
  ctx.state.session = {
    id: ctx.req.id,
    remoteAddress: ctx.ip,
    request: ctx.request
  };

  try {
    const { user } = await onAuthPromise.call(
      this,
      // auth
      {
        username,
        password
      },
      // session
      ctx.state.session
    );

    // set user in session and state
    ctx.state.user = user;
    ctx.state.session.user = user;

    //
    // store boolean if we're on an Apple device
    //
    // ctx.headers['user-agent'] is something like:
    // - 'macOS/12.7.4 (21H1105) CalendarAgent/961.4.2'
    // (or)
    // - 'iOS/18.3.2 (22D82) dataaccessd/1.0'
    //
    ctx.state.isApple =
      typeof ctx.headers['user-agent'] === 'string' &&
      (ctx.headers['user-agent'].includes('macOS') ||
        ctx.headers['user-agent'].includes('iOS'));

    ctx.logger.debug('isApple', ctx.state.isApple);

    // set locale for translation in ctx
    ctx.isAuthenticated = () => true;
    ctx.request.acceptsLanguages = () => false;
    await i18n.middleware(ctx, () => Promise.resolve());

    // connect to db
    await refreshSession.call(
      this,
      ctx.state.session,
      this.constructor.name.toUpperCase()
    );
  } catch (err) {
    ctx.logger.error(err);
    // if the error is already a Boom error, re-throw it directly
    // to preserve the original status code (e.g. 401 Unauthorized)
    if (err.isBoom) throw err;
    throw Boom.unauthorized(err);
  }
}

module.exports = setupAuthSession;
