/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const crypto = require('node:crypto');

const ms = require('ms');

const config = require('#config');
const { decrypt, encrypt } = require('#helpers/encrypt-decrypt');

const MAX_AGE = ms('30d');

function getOtpRememberMeEpochKey(userId) {
  return `otp_remember_me_epoch:${userId}`;
}

//
// the cookie is bound to the account state it was issued for, so changing the
// password (new salt), the OTP secret, or logging out other sessions (new
// epoch) invalidates every remember-me cookie issued before that change;
// only a digest is stored so no secret is ever placed in the cookie
//
function getAccountDigest(state) {
  return crypto
    .createHash('sha256')
    .update(
      JSON.stringify([
        'otp_remember_me',
        String(state.userId),
        state.otpToken || '',
        state.salt || '',
        state.epoch || ''
      ])
    )
    .digest('base64url');
}

// loads the current account state that remember-me cookies are bound to
// (the user model is passed in so this helper does not need a connection)
async function getOtpRememberMeState(ctx, Users) {
  const userId = ctx.state.user.id;
  const [user, epoch] = await Promise.all([
    Users.findById(ctx.state.user._id)
      .select(`salt ${config.passport.fields.otpToken}`)
      .lean()
      .exec(),
    ctx.client.get(getOtpRememberMeEpochKey(userId))
  ]);
  if (!user) return null;
  return {
    userId,
    otpToken: user[config.passport.fields.otpToken],
    salt: user.salt,
    epoch
  };
}

// rotating the epoch invalidates all remember-me cookies for the user
async function rotateOtpRememberMeEpoch(client, userId) {
  // (no expiry: if the key expired, cookies issued before the rotation
  // would be accepted again and cookies issued after it would stop working)
  await client.set(
    getOtpRememberMeEpochKey(userId),
    crypto.randomBytes(16).toString('hex')
  );
}

function safeEqual(a, b) {
  const expected = Buffer.from(String(a));
  const actual = Buffer.from(String(b));
  return (
    expected.length === actual.length &&
    crypto.timingSafeEqual(expected, actual)
  );
}

function createOtpRememberMeCookie(state) {
  if (!state || !state.userId) throw new TypeError('User ID missing');

  return encrypt(
    JSON.stringify({
      expiresAt: Date.now() + MAX_AGE,
      userId: String(state.userId),
      digest: getAccountDigest(state)
    })
  );
}

function isValidOtpRememberMeCookie(value, state) {
  if (typeof value !== 'string' || !value || !state || !state.userId)
    return false;

  // only accept the exact encoding that was issued (base64url decoding
  // silently ignores trailing characters)
  if (Buffer.from(value, 'base64url').toString('base64url') !== value)
    return false;

  try {
    const payload = JSON.parse(decrypt(value));
    if (
      !payload ||
      typeof payload.userId !== 'string' ||
      typeof payload.digest !== 'string' ||
      !Number.isSafeInteger(payload.expiresAt) ||
      payload.expiresAt < Date.now()
    ) {
      return false;
    }

    return (
      safeEqual(state.userId, payload.userId) &&
      safeEqual(getAccountDigest(state), payload.digest)
    );
  } catch {
    return false;
  }
}

module.exports = {
  createOtpRememberMeCookie,
  isValidOtpRememberMeCookie,
  getOtpRememberMeState,
  rotateOtpRememberMeEpoch
};
