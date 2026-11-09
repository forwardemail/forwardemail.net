/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const dns = require('node:dns').promises;
const process = require('node:process');
const { setTimeout: delay } = require('node:timers/promises');
const { parentPort, workerData } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const pMap = require('p-map');

const Domains = require('#models/domains');
const Users = require('#models/users');
const config = require('#config');
const email = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

// (see `longRunning` in jobs/index.js)
const { longRunning, interval } = workerData?.job ?? {};
let isCancelled = false;
const cancelled = new AbortController();
if (parentPort)
  parentPort.on('message', (message) => {
    if (message !== 'cancel') return;
    isCancelled = true;
    cancelled.abort();
  });

async function getHasEncryptedTxtRecord(domain, locale) {
  if (!domain?.name) return;

  try {
    const { hasBase64 } = await Domains.getTxtAddresses(
      domain.name,
      locale,
      true,
      {
        resolveTxt(name) {
          return dns.resolveTxt(name);
        }
      },
      false
    );

    return hasBase64;
  } catch (err) {
    logger.warn(err, { domain: domain.name });
  }
}

async function run() {
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

    logger.info('_ids', _ids.length);

    // send welcome email
    await pMap(
      _ids,
      async (_id) => {
        try {
          const user = await Users.findById(_id).lean().exec();

          // in case email was sent for whatever reason
          if (user[config.userFields.welcomeEmailSentAt]) return;

          // find a domain that the user created
          const domain = await Domains.findOne({
            members: {
              $elemMatch: {
                user: user._id,
                group: 'admin'
              }
            }
          })
            .lean()
            .exec();

          const locale = user[config.lastLocaleField] || 'en';
          const hasEncryptedTxtRecord = await getHasEncryptedTxtRecord(
            domain,
            locale
          );

          // send email
          await email({
            template: 'welcome',
            message: {
              to: user.email
            },
            locals: {
              to: user.email,
              locale,
              user,
              domain,
              hasEncryptedTxtRecord
            }
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
      },
      { concurrency: 4 }
    );
  } catch (err) {
    await logger.error(err);
  }
}

(async () => {
  await setupMongoose(logger);

  for (;;) {
    await run();
    if (!longRunning || !Number.isFinite(interval) || isCancelled) break;
    // (a cancel ends the wait, so bree stops without waiting out the interval)
    await delay(interval, undefined, { signal: cancelled.signal }).catch(
      () => {}
    );
    if (isCancelled) break;
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})().catch(async (err) => {
  // (otherwise the worker keeps running, holding its job slot, until bree
  // restarts)
  await Promise.race([logger.error(err), delay(10_000)]);
  process.exit(1);
});
