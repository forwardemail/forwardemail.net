/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isBsonOverflow = require('./is-bson-overflow');
const logger = require('./logger');

const { Emails } = require('#models');

/**
 * Attempt to save an email document; if the save fails with a BSON overflow,
 * fall back to an atomic findByIdAndUpdate that marks the email as 'bounced'
 * to break the infinite retry loop.
 *
 * @param {object} email   - Mongoose Email document
 * @param {object} [meta]  - Optional logging metadata
 * @returns {Promise<object>} The saved (or fallback-updated) email
 */
async function bsonOverflowFallbackSave(email, meta) {
  try {
    email = await email.save();
    // TODO: remove debug instrumentation once queue issue is resolved
    console.log(
      '[DEBUG:bsonOverflowFallbackSave] save succeeded',
      JSON.stringify({
        emailId: email._id,
        status: email.status,
        is_locked: email.is_locked,
        locked_by: email.locked_by
      })
    );
    return email;
  } catch (saveErr) {
    // TODO: remove debug instrumentation once queue issue is resolved
    console.error(
      '[DEBUG:bsonOverflowFallbackSave] save failed',
      JSON.stringify({
        emailId: email?._id,
        errName: saveErr.name,
        errMessage: saveErr.message?.slice(0, 200),
        isBsonOverflow: isBsonOverflow(saveErr)
      })
    );
    if (isBsonOverflow(saveErr)) {
      // BSON overflow is a data-size issue, not a programming error.
      // Mark it so the Logs post-save hook does not send an alert email.
      saveErr.isCodeBug = false;
      logger.error(saveErr, {
        ...meta,
        bson_overflow_fallback: true
      });
      // Atomic update that bypasses full-document serialization entirely.
      // Use 'bounced' (not 'deferred') to permanently stop retries —
      // the document is too large to ever be saved via mongoose, so
      // retrying would just create an infinite error loop.
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
      // Return the email as-is (the DB has been updated atomically)
      return email;
    }

    throw saveErr;
  }
}

module.exports = bsonOverflowFallbackSave;
