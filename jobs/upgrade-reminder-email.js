/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const os = require('node:os');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const sharedConfig = require('@ladjs/shared-config');
const { boolean } = require('boolean');
const mongoose = require('mongoose');

const config = require('#config');
const email = require('#helpers/email');
const forEachInBatches = require('#helpers/for-each-in-batches');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Users, Domains, UpgradeReminders } = require('#models');

const concurrency = os.cpus().length;
const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const graceful = new Graceful({
  redisClients: [client],
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

  // check if the domain was banned and if so then don't send
  const domainBanned = await client.get(`denylist:${upgradeReminder.domain}`);
  if (boolean(domainBanned)) return;

  // check if the mail was banned and if so then don't send
  const cleanQueue = [];
  for (const addr of upgradeReminder.queue) {
    const emailBanned = await client.get(`denylist:${addr}`);
    if (!boolean(emailBanned)) cleanQueue.push(addr);
  }

  if (cleanQueue.length === 0) return;

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
    logger.debug(`${upgradeReminder.domain} has more than 10 recipients`, {
      upgradeReminder
    });
    return;
  }

  try {
    logger.info('sending email', { upgradeReminder });
    await email({
      template: 'upgrade-reminder',
      message: { to: cleanQueue },
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
          $each: cleanQueue
        }
      }
    });
  } catch (err) {
    logger.error(err);
  }
}

(async () => {
  await setupMongoose(logger);

  //
  // find all aliases that haven't been sent verification emails yet
  // also don't send emails to users that are banned
  // and don't send emails for non-paid plans just in case
  //
  try {
    logger.info('starting upgrade reminder emails');

    //
    // emails of banned users (one query, where loading each banned user
    // document in turn held a full document per banned user)
    //
    const bannedUserEmails = new Set(
      await Users.distinct('email', { [config.userFields.isBanned]: true })
    );

    //
    // read the reminders from a cursor and send them a batch at a time
    // (the whole result used to be loaded, and then logged, at once)
    //
    let found = 0;
    let sent = 0;
    const cursor = UpgradeReminders.aggregate([
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
    ])
      .allowDiskUse(true)
      .cursor({ batchSize: 100 });

    await forEachInBatches(
      cursor,
      { batchSize: 100, concurrency },
      async (upgradeReminder) => {
        found++;

        // filter out from queue where email is not in banned list
        upgradeReminder.queue = upgradeReminder.queue.filter(
          (email) => !bannedUserEmails.has(email)
        );

        // skip if no email is left in the queue
        if (upgradeReminder.queue.length === 0) return;

        sent++;
        await mapper(upgradeReminder);
      }
    );

    logger.info('sent upgrade reminders', { found, filtered: sent });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
