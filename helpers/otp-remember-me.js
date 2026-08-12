/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const crypto = require('node:crypto');

const ms = require('ms');

const { decrypt, encrypt } = require('#helpers/encrypt-decrypt');

const MAX_AGE = ms('30d');

function createOtpRememberMeCookie(userId) {
  if (!userId) throw new TypeError('User ID missing');

  return encrypt(
    JSON.stringify({
      expiresAt: Date.now() + MAX_AGE,
      userId: String(userId)
    })
  );
}

function isValidOtpRememberMeCookie(value, userId) {
  if (typeof value !== 'string' || !value || !userId) return false;

  try {
    const payload = JSON.parse(decrypt(value));
    if (
      !payload ||
      typeof payload.userId !== 'string' ||
      !Number.isSafeInteger(payload.expiresAt) ||
      payload.expiresAt < Date.now()
    ) {
      return false;
    }

    const expected = Buffer.from(String(userId));
    const actual = Buffer.from(payload.userId);
    return (
      expected.length === actual.length &&
      crypto.timingSafeEqual(expected, actual)
    );
  } catch {
    return false;
  }
}

module.exports = { createOtpRememberMeCookie, isValidOtpRememberMeCookie };
