/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isBsonOverflow = require('./is-bson-overflow');
const logger = require('./logger');

const { Emails } = require('#models');

const MAX_DELIVERIES = 50;

/**
 * Progressive trimming steps applied to an email document when a BSON
 * overflow is detected at save time. Each step is a function that mutates
 * the document in place and returns true if it made any changes (meaning
 * a retry is worthwhile). Steps are ordered from least to most aggressive.
 */
const TRIM_STEPS = [
  // Step 1: Drop non-essential nested fields from rejectedErrors
  (email) => {
    if (
      !Array.isArray(email.rejectedErrors) ||
      email.rejectedErrors.length === 0
    )
      return false;
    let changed = false;
    for (const err of email.rejectedErrors) {
      if (err.response) {
        delete err.response;
        changed = true;
      }

      if (err.error) {
        delete err.error;
        changed = true;
      }
    }

    return changed;
  },
  // Step 2: Keep only the 50 most recent rejectedErrors
  (email) => {
    if (
      !Array.isArray(email.rejectedErrors) ||
      email.rejectedErrors.length <= 50
    )
      return false;
    email.rejectedErrors = email.rejectedErrors.slice(-50);
    return true;
  },
  // Step 3: Strip rejectedErrors to essential fields only
  (email) => {
    if (
      !Array.isArray(email.rejectedErrors) ||
      email.rejectedErrors.length === 0
    )
      return false;
    email.rejectedErrors = email.rejectedErrors.map((err) => ({
      recipient: err.recipient,
      responseCode: err.responseCode,
      isCodeBug: err.isCodeBug,
      date: err.date,
      message:
        typeof err.message === 'string'
          ? err.message.slice(0, 256)
          : err.message,
      name: err.name,
      code: err.code,
      bounceInfo: err.bounceInfo
    }));
    return true;
  },
  // Step 4: Keep only 10 rejectedErrors
  (email) => {
    if (
      !Array.isArray(email.rejectedErrors) ||
      email.rejectedErrors.length <= 10
    )
      return false;
    email.rejectedErrors = email.rejectedErrors.slice(-10);
    return true;
  },
  // Step 5: Strip deliveries to essential fields only
  (email) => {
    if (!Array.isArray(email.deliveries) || email.deliveries.length === 0)
      return false;
    email.deliveries = email.deliveries.map((d) => ({
      recipient: d.recipient,
      date: d.date,
      responseCode: d.responseCode,
      mx: d.mx ? { host: d.mx.host } : undefined,
      tls: d.tls ? { version: d.tls.version } : undefined
    }));
    return true;
  },
  // Step 6: Cap deliveries at MAX_DELIVERIES
  (email) => {
    if (
      !Array.isArray(email.deliveries) ||
      email.deliveries.length <= MAX_DELIVERIES
    )
      return false;
    email.deliveries = email.deliveries.slice(-MAX_DELIVERIES);
    return true;
  },
  // Step 7: Clear deliveries entirely
  (email) => {
    if (!Array.isArray(email.deliveries) || email.deliveries.length === 0)
      return false;
    email.deliveries = [];
    return true;
  },
  // Step 8: Nuclear — clear rejectedErrors entirely, keep one summary error
  (email) => {
    const recipient = Array.isArray(email.envelope?.to)
      ? email.envelope.to[0]
      : 'unknown';
    email.rejectedErrors = [
      {
        recipient,
        responseCode: 421,
        isCodeBug: true,
        date: new Date(),
        message:
          'Document too large; rejectedErrors and deliveries cleared to prevent BSON overflow',
        name: 'RangeError',
        code: 'ERR_OUT_OF_RANGE'
      }
    ];
    email.deliveries = [];
    return true;
  }
];

/**
 * Attempt to save an email document; if the save fails with a BSON overflow,
 * progressively trim the document and retry. If all trimming steps are
 * exhausted, fall back to an atomic findByIdAndUpdate that marks the email
 * as 'bounced' to break the infinite retry loop.
 *
 * @param {object} email   - Mongoose Email document
 * @param {object} [meta]  - Optional logging metadata
 * @returns {Promise<object>} The saved (or fallback-updated) email
 */
async function bsonOverflowFallbackSave(email, meta) {
  try {
    email = await email.save();
    return email;
  } catch (saveErr) {
    if (!isBsonOverflow(saveErr)) {
      throw saveErr;
    }

    // BSON overflow detected — attempt progressive trimming
    console.error(
      '[WARN:bsonOverflowFallbackSave] BSON overflow on save, starting progressive trim',
      JSON.stringify({
        emailId: email?._id,
        errName: saveErr.name,
        errMessage: saveErr.message?.slice(0, 200)
      })
    );

    for (const [i, TRIM_STEP] of TRIM_STEPS.entries()) {
      // eslint-disable-next-line new-cap
      const changed = TRIM_STEP(email);
      if (!changed) continue;

      try {
        email = await email.save();
        console.log(
          '[INFO:bsonOverflowFallbackSave] save succeeded after trim step',
          JSON.stringify({ emailId: email._id, step: i + 1 })
        );
        return email;
      } catch (retryErr) {
        if (!isBsonOverflow(retryErr)) {
          throw retryErr;
        }
        // Still overflowing — continue to next trim step
      }
    }

    // All trim steps exhausted — atomic fallback to bounce
    console.error(
      '[ERROR:bsonOverflowFallbackSave] all trim steps exhausted, bouncing via atomic update',
      JSON.stringify({ emailId: email?._id })
    );

    saveErr.isCodeBug = false;
    try {
      logger.error(saveErr, {
        ...meta,
        bson_overflow_fallback: true
      });
    } catch {}

    await Emails.findByIdAndUpdate(email._id, {
      $set: {
        status: 'bounced',
        is_locked: false
      },
      $unset: {
        locked_by: 1,
        locked_at: 1
      }
    });

    return email;
  }
}

module.exports = bsonOverflowFallbackSave;
