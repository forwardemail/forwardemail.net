/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Users = require('#models/users');
const { rotateOtpRememberMeEpoch } = require('#helpers/otp-remember-me');

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

  // other devices must not skip OTP with a remember-me cookie issued before
  // (the current session receives a fresh cookie on its next request)
  try {
    await rotateOtpRememberMeEpoch(ctx.client, user.id);
    if (ctx.session) ctx.session.otp_remember_me_issued = false;
  } catch (err) {
    ctx.logger.fatal(err);
  }

  // Fire-and-forget: scan Redis in the background to catch any orphaned
  // sessions not tracked in the user model.  This is NOT awaited so the
  // HTTP response returns immediately (avoids the 30s request timeout on
  // large deployments).  Errors are logged and swallowed.
  scanAndPurgeOrphanedSessions(ctx).catch((err) => ctx.logger.fatal(err));
}

/**
 * Full Redis SCAN of koa:sess:* keys to delete any session belonging to
 * ctx.state.user that is not the current session.  Runs in the background.
 */
async function scanAndPurgeOrphanedSessions(ctx) {
  const stream = ctx.client.scanStream({
    match: 'koa:sess:*',
    type: 'string'
  });

  await new Promise((resolve) => {
    stream.on('data', (keys) => {
      if (!keys || keys.length === 0) return;
      for (const key of keys) {
        // fire-and-forget per key; errors logged individually
        (async () => {
          try {
            const value = await ctx.client.get(key);
            if (!value) return;
            const json = JSON.parse(value);
            const id = key.replace('koa:sess:', '');
            if (
              id !== ctx.sessionId &&
              json?.passport?.user === ctx.state.user.id
            ) {
              await ctx.client.del(key);
            }
          } catch (err) {
            ctx.logger.fatal(err);
          }
        })();
      }
    });
    stream.on('error', (err) => {
      ctx.logger.fatal(err);
      resolve();
    });
    stream.on('end', () => {
      resolve();
    });
  });
}

module.exports = invalidateOtherSessions;
