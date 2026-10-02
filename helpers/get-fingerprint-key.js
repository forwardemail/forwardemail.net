/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const revHash = require('rev-hash');

const config = require('#config');

//
// The key that records a message (its fingerprint) was delivered, or is being
// delivered, to a destination (an alias id, an address, or a webhook), so a
// retry of the message skips it
//
function getFingerprintKey(session, value) {
  if (!session?.fingerprint) throw new TypeError('Fingerprint missing');
  if (!value) throw new TypeError('Value missing');
  return `${config.fingerprintPrefix}:${session.fingerprint}:${revHash(value)}`;
}

module.exports = getFingerprintKey;
