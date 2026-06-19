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

  // scan to ensure redis database is aligned correctly. this is awaited so
  // that the purge of any other matching session is guaranteed to complete
  // before the caller returns a response; per-key and per-batch errors are
  // logged and swallowed so a single bad key cannot abort the sweep.
  await new Promise((resolve) => {
    const stream = ctx.client.scanStream({
      match: `koa:sess:*`,
      type: 'string'
    });
    const batches = [];
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
      batches.push(
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
        }).catch((err) => ctx.logger.fatal(err))
      );
    });
    stream.on('error', (err) => {
      ctx.logger.fatal(err);
      Promise.allSettled(batches).then(() => resolve());
    });
    stream.on('end', () => {
      Promise.allSettled(batches).then(() => resolve());
    });
  });
}

module.exports = invalidateOtherSessions;
