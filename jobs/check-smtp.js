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
const Redis = require('@ladjs/redis');
const dayjs = require('dayjs-with-plugins');
const pMap = require('p-map');
const sharedConfig = require('@ladjs/shared-config');
const mongoose = require('mongoose');

const Domains = require('#models/domains');
const checkSMTPDomain = require('#helpers/check-smtp-domain');
const createTangerine = require('#helpers/create-tangerine');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const resolver = createTangerine(client, logger);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
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

async function mapper(id) {
  // return early if the job was already cancelled
  if (isCancelled) return;

  try {
    await checkSMTPDomain(id, { resolver, client });
  } catch (err) {
    logger.warn(err);
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    //
    // TODO: in the future when we integrate historical checks
    //       and routine checking (e.g. 3 in a row fail)
    //       then we will need to modify this query
    //
    // get all non-API created domains (sorted by last_checked_at)
    const results = await Domains.aggregate([
      {
        $match: {
          $and: [
            {
              plan: {
                $in: ['enhanced_protection', 'team']
              }
            },
            {
              $or: [
                {
                  smtp_last_checked_at: {
                    $exists: false
                  }
                },
                {
                  smtp_last_checked_at: {
                    $lte: dayjs().subtract(2, 'hour').toDate()
                  }
                },
                {
                  smtp_verified_at: {
                    $exists: false
                  }
                }
              ]
            }
          ]
        }
      },
      {
        $sort: {
          smtp_last_checked_at: 1
        }
      },
      {
        $group: {
          _id: '$_id'
        }
      }
    ]);

    // flatten array
    const ids = results.map((r) => r._id);

    logger.info('checking domains', { count: ids.length });

    await pMap(ids, mapper, { concurrency: 25 });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
