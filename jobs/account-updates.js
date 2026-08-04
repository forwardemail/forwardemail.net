/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const bytes = require('@forwardemail/bytes');
const humanize = require('humanize-string');
const titleize = require('titleize');
const mongoose = require('mongoose');
const _ = require('#helpers/lodash');

const config = require('#config');
const email = require('#helpers/email');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const Users = require('#models/users');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

async function mapper(user) {
  // safeguard
  if (!user) return;

  // ensure it still had a non-empty array
  if (
    !_.isArray(user[config.userFields.accountUpdates]) ||
    _.isEmpty(user[config.userFields.accountUpdates])
  ) {
    logger.warn('user had empty account updates', { user });
    await Users.updateOne(
      {
        _id: user._id,
        [`${config.userFields.accountUpdates}.0`]: { $exists: false }
      },
      { $set: { [config.userFields.hasPendingAccountUpdates]: false } }
    );
    return;
  }

  // Build set of redacted field names for quick lookup
  const redactedFieldNames = new Set(
    config.accountUpdateRedactedFields.map((field) => _.get(config, field))
  );

  // Build set of byte-valued field names for human-readable formatting
  const byteFieldNames = new Set(
    config.accountUpdateByteFields.map((field) => _.get(config, field))
  );

  // merge and map to actionable email
  const accountUpdates = user[config.userFields.accountUpdates].map(
    (update) => {
      const { fieldName, current, previous } = update;
      const isRedacted = redactedFieldNames.has(fieldName);
      const isByteField = byteFieldNames.has(fieldName);
      return {
        name: fieldName,
        text: i18n.api.t({
          phrase: titleize(humanize(fieldName)),
          locale: user[config.lastLocaleField]
        }),
        // Redact sensitive field values for security
        // Format byte-valued fields with human-readable strings (e.g. "10 GB")
        current: isRedacted
          ? '[REDACTED]'
          : isByteField && typeof current === 'number'
          ? bytes(current)
          : current,
        previous: isRedacted
          ? '[REDACTED]'
          : isByteField && typeof previous === 'number'
          ? bytes(previous)
          : previous,
        redacted: isRedacted
      };
    }
  );

  // send account updates email
  try {
    await email({
      template: 'account-update',
      message: {
        to: user.email
      },
      locals: {
        accountUpdates,
        user
      }
    });
    // Clear only the exact snapshot that was sent.  A concurrent account
    // change must remain queued instead of being erased by this worker.
    const results = await Users.updateOne(
      {
        _id: user._id,
        [config.userFields.accountUpdates]:
          user[config.userFields.accountUpdates]
      },
      {
        $set: {
          [config.userFields.accountUpdates]: [],
          [config.userFields.hasPendingAccountUpdates]: false
        }
      }
    );

    if (results.modifiedCount === 0)
      logger.warn('account updates changed while notification was sent', {
        user: user._id
      });
  } catch (err) {
    await logger.error(err);
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    for await (const user of Users.find({
      [config.userFields.hasPendingAccountUpdates]: true,
      [config.userFields.hasVerifiedEmail]: true,
      [config.userFields.isBanned]: false
    })
      .lean()
      .cursor()
      .addCursorFlag('noCursorTimeout', true)) {
      try {
        await mapper(user);
      } catch (err) {
        logger.error(err);
      }
    }
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
