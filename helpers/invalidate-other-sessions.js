/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const pMap = require('p-map');

const Users = require('#models/users');

async function invalidateOtherSessions(ctx) {
  if (!ctx?.state?.user?.id || !ctx?.sessionId)
    throw new TypeError('Invalidate sessions called incorrectly');

  // using latest stored in user model, purge those sessions
  const user = await Users.findOne({ id: ctx.state.user.id });
  if (!Array.isArray(user.sessions)) user.sessions = [];
  // remove all sessions where it does not match
  if (user.sessions.length > 0) {
    for (const id of user.sessions) {
      try {
        // eslint-disable-next-line no-await-in-loop
        if (id !== ctx.sessionId) await ctx.client.del(`koa:sess:${id}`);
      } catch (err) {
        ctx.logger.fatal(err);
      }
    }
  }

  // ensure only session set in user model is the current (so UI is reflected)
  await Users.findByIdAndUpdate(user._id, {
    $set: {
      sessions: [ctx.sessionId]
    }
  });

  // run in the background a scan to ensure redis database is aligned correctly
  const stream = ctx.client.scanStream({
    match: `koa:sess:*`,
    type: 'string'
  });
  stream.on('data', (keys) => {
    // `GET $key` returns JSON string
    // when `JSON.parse` is called it looks like this:
    // json = {
    //   cookie: {
    //     httpOnly: true,
    //     path: '/',
    //     overwrite: true,
    //     signed: true,
    //     maxAge: 2592000000,
    //     secure: false,
    //     sameSite: 'lax'
    //   },
    //   _gh_issue: false,
    //   prevPath: '/en/my-account/security',
    //   prevMethod: 'GET',
    //   maxRedirects: 0,
    //   passport: { user: 'some-mongodb-object-id' }
    // }
    pMap(keys, async (key) => {
      try {
        const value = await ctx.client.get(key);
        const json = JSON.parse(value);
        const id = key.replace('koa:sess:', '');
        // delete other sessions that do not match the current
        if (
          id !== ctx.sessionId &&
          json?.passport?.user === ctx.state.user.id
        ) {
          await ctx.client.del(key);
        }
      } catch (err) {
        ctx.logger.fatal(err);
      }
    })
      .then()
      .catch((err) => ctx.logger.fatal(err));
  });
}

module.exports = invalidateOtherSessions;
