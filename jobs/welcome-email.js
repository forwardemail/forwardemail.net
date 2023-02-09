// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const { parentPort } = require('worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');

const mongoose = require('mongoose');
const config = require('#config');
const email = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const Users = require('#models/users');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    const object = {
      created_at: {
        $lte: dayjs().subtract(1, 'minute').toDate()
      }
    };
    object[config.userFields.welcomeEmailSentAt] = { $exists: false };
    object[config.userFields.hasVerifiedEmail] = true;
    object[config.userFields.isBanned] = false;

    const _ids = await Users.distinct('_id', object);

    // send welcome email
    await Promise.all(
      _ids.map(async (_id) => {
        try {
          const user = await Users.findById(_id).lean().exec();

          // in case email was sent for whatever reason
          if (user[config.userFields.welcomeEmailSentAt]) return;

          // send email
          await email({
            template: 'welcome',
            message: {
              to: user[config.userFields.fullEmail]
            },
            locals: { user }
          });

          // store that we sent this email
          await Users.findByIdAndUpdate(user._id, {
            $set: {
              [config.userFields.welcomeEmailSentAt]: new Date()
            }
          });
        } catch (err) {
          await logger.error(err);
        }
      })
    );
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
