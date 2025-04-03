/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const prettyMilliseconds = require('pretty-ms');
const _ = require('#helpers/lodash');

const SMTPError = require('#helpers/smtp-error');
const config = require('#config');

async function hasFingerprintExpired(session, client) {
  if (!session.fingerprint) throw new TypeError('Fingerprint missing');
  const key = `${config.fingerprintPrefix}:${session.fingerprint}`;
  let value = await client.get(key);
  if (value) {
    value = new Date(value);

    // reset if cache invalid
    if (!_.isDate(value)) value = null;
  }

  if (value) {
    if (value.getTime() + config.maxRetryDuration <= session.arrivalTime) {
      throw new SMTPError(
        `This message has been retried for the maximum period of ${prettyMilliseconds(
          config.maxRetryDuration,
          { verbose: true, secondsDecimalDigits: 0 }
        )} and has permanently failed`
      );
    }
  } else {
    // after 5 days the message fingerprint is deleted (to save on storage)
    await client.set(
      key,
      new Date(session.arrivalTime).toISOString(),
      'PX',
      config.greylistTtlMs
    );
  }
}

module.exports = hasFingerprintExpired;
