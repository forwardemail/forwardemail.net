/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Detect DANE verification errors.
 *
 * DANE verification failures are treated as temporary (421) errors so
 * the message queue can retry delivery later (e.g. after the remote
 * server rotates its certificate or updates its TLSA records).
 *
 * Per RFC 7672 Section 2.2, when DANE TLSA records are present and the
 * certificate does not match, the connection MUST be aborted and the
 * message MUST NOT be delivered on that attempt.  However, the failure
 * is not necessarily permanent — transient DNS issues or key rollovers
 * may resolve on a subsequent attempt.
 *
 * Our DANE TLS wrapper (helpers/dane-tls-wrapper.js) sets `err.category`
 * to `'dane'` on all DANE verification failures. Nodemailer may overwrite
 * `err.code` to `'ESOCKET'` when the socket is destroyed, but the
 * `category` property is preserved.
 *
 * @param {Error} err
 * @returns {boolean}
 */
function isDaneError(err) {
  if (typeof err !== 'object' || err === null) return false;
  // Primary check: our DANE wrapper sets err.category = 'dane'
  if (err.category === 'dane') return true;
  // Secondary check: original error code before nodemailer wraps it
  if (typeof err.code === 'string' && err.code === 'DANE_VERIFICATION_FAILED')
    return true;
  // Check error message as a fallback
  if (
    typeof err.message === 'string' &&
    err.message.startsWith('DANE verification failed')
  )
    return true;
  return false;
}

module.exports = isDaneError;
