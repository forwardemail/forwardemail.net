// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const os = require('os');
const { parentPort } = require('worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const _ = require('lodash');
const humanize = require('humanize-string');
const pMap = require('p-map');
const titleize = require('titleize');
const mongoose = require('mongoose');

const config = require('#config');
const email = require('#helpers/email');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const Users = require('#models/users');

const concurrency = os.cpus().length;

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

async function mapper(id) {
  const user = await Users.findById(id).lean().exec();
  if (!user) throw new Error('User does not exist');

  // ensure it still had a non-empty array
  if (
    !_.isArray(user[config.userFields.accountUpdates]) ||
    _.isEmpty(user[config.userFields.accountUpdates])
  ) {
    logger.warn('user had empty account updates', { user });
    return;
  }

  // merge and map to actionable email
  const accountUpdates = user[config.userFields.accountUpdates].map(
    (update) => {
      const { fieldName, current, previous } = update;
      return {
        name: fieldName,
        text: i18n.api.t({
          phrase: titleize(humanize(fieldName)),
          locale: user[config.lastLocaleField]
        }),
        current,
        previous
      };
    }
  );

  // send account updates email
  try {
    await email({
      template: 'account-update',
      message: {
        to: user[config.userFields.fullEmail]
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
    const ids = await Users.distinct('_id', {
      account_updates: {
        $exists: true,
        $ne: []
      },
      [config.userFields.hasVerifiedEmail]: true,
      [config.userFields.isBanned]: false
    });

    await pMap(ids, mapper, { concurrency });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
