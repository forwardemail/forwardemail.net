/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const Boom = require('@hapi/boom');

const i18n = require('#helpers/i18n');
const {
  getBandwidthLimitMessage,
  isOverBandwidth,
  recordBandwidth
} = require('#helpers/bandwidth-limiter');
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

const DAV_SERVICES = { CalDAV: 'caldav', CardDAV: 'carddav' };

async function setupAuthSession(ctx, username, password) {
  ctx.state.session = {
    id: ctx.req.id,
    remoteAddress: ctx.ip,
    request: ctx.request,
    // set only by the `POST /v1/emails` route (see `helpers/on-auth.js`)
    allowCatchallSend: ctx.state.allowCatchallSend === true
  };

  try {
    let user;
    try {
      ({ user } = await onAuthPromise.call(
        this,
        // auth
        {
          username,
          password
        },
        // session
        ctx.state.session
      ));
    } catch (err) {
      // failed-attempt limits are not wrong credentials
      if (err.isRateLimited) throw Boom.tooManyRequests(err.message);

      // on-auth leaves `response` unset for transient failures (database,
      // Redis, the server shutting down): answer 503 so clients retry
      // instead of treating the credentials as wrong
      if (!err.isBoom && err.response !== 'NO') {
        ctx.logger.error(err);
        throw Boom.serverUnavailable(
          typeof ctx.translateError === 'function'
            ? ctx.translateError('WEBSITE_OUTAGE')
            : 'Service unavailable'
        );
      }

      throw err;
    }

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
    // (a catch-all send-only login has no alias, so it has no mailbox to open)
    if (!user.catchall_send_only)
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

  //
  // CalDAV and CardDAV requests and responses count toward the account's
  // bandwidth limit, and are refused once it is used up (the REST API, which
  // signs in aliases here too, is not counted as either)
  //
  const service = DAV_SERVICES[this.constructor.name];
  if (!service) return;
  const bandwidth = {
    userId: ctx.state.user?.alias_user_id,
    service
  };
  const client = this.client || ctx.client;
  if (await isOverBandwidth(client, bandwidth))
    throw Boom.tooManyRequests(getBandwidthLimitMessage(ctx.locale));

  // (once per request, however many times it is authenticated)
  if (ctx.state.bandwidthCounted) return;
  ctx.state.bandwidthCounted = true;
  ctx.res.once('finish', () => {
    let size = Number(ctx.get('content-length')) || 0;
    const { body } = ctx;
    if (Number.isFinite(ctx.response.length)) size += ctx.response.length;
    else if (typeof body === 'string') size += Buffer.byteLength(body);
    else if (Buffer.isBuffer(body)) size += body.length;
    recordBandwidth(client, { ...bandwidth, bytes: size });
  });
}

module.exports = setupAuthSession;
