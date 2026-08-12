/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const crypto = require('node:crypto');
const process = require('node:process');

const isSANB = require('is-string-and-not-blank');

const env = require('#config/env');

function getSessionKeys() {
  const keys = isSANB(process.env.SESSION_KEYS)
    ? process.env.SESSION_KEYS.split(',').map((key) => key.trim())
    : [
        crypto
          .createHash('sha512')
          .update(env.HELPER_ENCRYPTION_KEY)
          .update('forwardemail-cookie-signing-v1')
          .digest('base64url')
      ];

  if (
    keys.length === 0 ||
    keys.some((key) => !isSANB(key) || Buffer.byteLength(key) < 32)
  ) {
    throw new TypeError(
      'SESSION_KEYS must contain values of at least 32 bytes'
    );
  }

  return keys;
}

module.exports = getSessionKeys;
