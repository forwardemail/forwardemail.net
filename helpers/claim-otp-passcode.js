/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');

//
// A two-factor passcode stays valid for up to 90 seconds, in which anyone
// who saw it (and has the password) could use it as well.  The first session
// to use a passcode keeps it: the same session may send it again (a form
// sent twice, or signing in and then turning two-factor off), another one
// may not.
//
const CLAIM_TTL = ms('2m');

/**
 * @param   {object}  ctx Koa context (its Redis client and session ID)
 * @param   {string}  userId The account the passcode is for
 * @param   {string}  passcode The passcode that was found valid
 * @returns {Promise<boolean>} Whether this session may use it
 */
async function claimOtpPasscode(ctx, userId, passcode) {
  const key = `otp_used:${userId}:${passcode}`;
  const result = await ctx.client.set(
    key,
    ctx.sessionId,
    'PX',
    CLAIM_TTL,
    'NX'
  );
  if (result === 'OK') return true;
  return (await ctx.client.get(key)) === ctx.sessionId;
}

module.exports = claimOtpPasscode;
