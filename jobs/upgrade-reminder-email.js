// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const os = require('os');
const { parentPort } = require('worker_threads');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const pMap = require('p-map');
const sharedConfig = require('@ladjs/shared-config');

const config = require('#config');
const email = require('#helpers/email');
const logger = require('#helpers/logger');
const { Users, Domains, UpgradeReminders } = require('#models');

const concurrency = os.cpus().length;
const breeSharedConfig = sharedConfig('BREE');
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

// store boolean if the job is cancelled
let isCancelled = false;

// handle cancellation (this is a very simple example)
if (parentPort)
  parentPort.once('message', (message) => {
    //
    // TODO: once we can manipulate concurrency option to p-map
    // we could make it `Number.MAX_VALUE` here to speed cancellation up
    // <https://github.com/sindresorhus/p-map/issues/28>
    //
    if (message === 'cancel') isCancelled = true;
  });

graceful.listen();

async function mapper(upgradeReminder) {
  // return early if the job was already cancelled
  if (isCancelled) return;

  // if the domain does not have a 402 payment required error
  // then we don't need to prompt the user to upgrade
  // and we can remove this domain entirely from the system
  const { isGood, isDisposable, isRestricted } = Domains.getNameRestrictions(
    upgradeReminder.domain
  );
  if (isGood && !isDisposable && !isRestricted) {
    await UpgradeReminders.deleteMany({
      domain: upgradeReminder.domain
    });
    return;
  }

  // if queue size is greater than 10 then it must be abused for disposable service
  if (upgradeReminder.queue.length > 10) {
    logger.fatal(`${upgradeReminder.domain} has more than 10 recipients`, {
      upgradeReminder
    });
    return;
  }

  try {
    logger.info('sending email', { upgradeReminder });
    await email({
      template: 'upgrade-reminder',
      message: { to: upgradeReminder.queue },
      locals: {
        domain: upgradeReminder.domain,
        isGood,
        isDisposable,
        isRestricted
      }
    });

    // store that we sent this email
    await UpgradeReminders.findByIdAndUpdate(upgradeReminder._id, {
      $addToSet: {
        sent_recipients: {
          $each: upgradeReminder.queue
        }
      }
    });
  } catch (err) {
    logger.error(err);
  }
}

(async () => {
  await mongoose.connect();

  //
  // find all aliases that haven't been sent verification emails yet
  // also don't send emails to users that are banned
  // and don't send emails for non-paid plans just in case
  //

  logger.info('starting upgrade reminder emails');

  const bannedUserEmails = await Users.distinct('email', {
    [config.userFields.isBanned]: true
  });

  let upgradeReminders = await UpgradeReminders.aggregate([
    {
      $match: {
        // TODO: filter somehow?
        // <https://www.mongodb.com/docs/manual/reference/operator/aggregation/setEquals/>
      }
    },
    {
      $project: {
        _id: 1,
        domain: 1,
        pending_recipients: {
          $ifNull: ['$pending_recipients', []]
        },
        sent_recipients: {
          $ifNull: ['$sent_recipients', []]
        }
      }
    },
    {
      $project: {
        _id: 1,
        domain: 1,
        queue: {
          $setDifference: ['$pending_recipients', '$sent_recipients']
        }
      }
    },
    {
      $match: { $expr: { $gt: [{ $size: '$queue' }, 0] } }
    }
  ]);

  logger.info(`found ${upgradeReminders.length} upgrade reminders`);

  // filter out from queue where email is not in banned list
  for (const upgradeReminder of upgradeReminders) {
    upgradeReminder.queue = upgradeReminder.queue.filter(
      (email) => !bannedUserEmails.includes(email)
    );
  }

  // filter out queue where email has at least one
  upgradeReminders = upgradeReminders.filter(
    (upgradeReminder) => upgradeReminder.queue.length > 0
  );

  logger.info(`filtered ${upgradeReminders.length} upgrade reminders`);

  if (upgradeReminders.length > 0) {
    await pMap(upgradeReminders, mapper, { concurrency });
    logger.info('sent upgrade reminders', { upgradeReminders });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
