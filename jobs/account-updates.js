/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
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
    return;
  }

  // Build set of redacted field names for quick lookup
  const redactedFieldNames = new Set(
    config.accountUpdateRedactedFields.map((field) => _.get(config, field))
  );

  // merge and map to actionable email
  const accountUpdates = user[config.userFields.accountUpdates].map(
    (update) => {
      const { fieldName, current, previous } = update;
      const isRedacted = redactedFieldNames.has(fieldName);
      return {
        name: fieldName,
        text: i18n.api.t({
          phrase: titleize(humanize(fieldName)),
          locale: user[config.lastLocaleField]
        }),
        // Redact sensitive field values for security
        current: isRedacted ? '[REDACTED]' : current,
        previous: isRedacted ? '[REDACTED]' : previous,
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
    // delete account updates
    await Users.findByIdAndUpdate(user._id, {
      $set: {
        [config.userFields.accountUpdates]: []
      }
    });
  } catch (err) {
    await logger.error(err);
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    for await (const user of Users.find({
      [config.userFields.accountUpdates]: {
        $exists: true,
        $ne: []
      },
      [config.userFields.hasVerifiedEmail]: true,
      [config.userFields.isBanned]: false
    })
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
