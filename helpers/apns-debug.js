/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const env = require('#config/env');

//
// APNs push diagnostics, printed to stdout (pm2 logs) when APNS_DEBUG=true.
//
// Production logs only `error` and `fatal` (see config/logger.js), so the
// usual logger.debug/info/warn lines never appear there.  Every place a push
// can be skipped, sent or refused writes one `[APNs]` line, which makes it
// possible to follow one registration or one new message through the
// IMAP, SQLite and MX processes with `pm2 logs | grep '\[APNs\]'`.
//
// Device tokens are shortened; certificates and keys are never printed.
//

function maskToken(token) {
  if (typeof token !== 'string' || token.length < 16) return token;
  return `${token.slice(0, 8)}…${token.slice(-4)}`;
}

function apnsDebug(message, meta = {}) {
  if (!env.APNS_DEBUG) return;
  try {
    console.log(`[APNs] ${message} ${JSON.stringify(meta)}`);
  } catch {
    console.log(`[APNs] ${message}`);
  }
}

module.exports = apnsDebug;
module.exports.maskToken = maskToken;
