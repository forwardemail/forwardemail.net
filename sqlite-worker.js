/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const os = require('node:os');
const process = require('node:process');
const { setTimeout } = require('node:timers/promises');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const mongoose = require('mongoose');
const ms = require('ms');
const sharedConfig = require('@ladjs/shared-config');

const config = require('#config');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { backup, rekey } = require('#helpers/worker');

const imapSharedConfig = sharedConfig('IMAP');
const client = new Redis(imapSharedConfig.redis, logger);
const subscriber = new Redis(imapSharedConfig.redis, logger);

client.setMaxListeners(0);
subscriber.setMaxListeners(0);

//
// Configuration
//
const CHANNEL = `sqlite_backup_queue:${config.env}`;
const BUSY_KEY = `sqlite_worker_busy:${config.env}`;
const MAX_CONCURRENCY = 2;
const MIN_FREE_MEM = 1024 * 1024 * 1024; // 1 GB

//
// State
//
let isShuttingDown = false;
let activeJobs = 0;

//
// Publish busy state to Redis so IMAP/POP3 clients can skip backup requests.
// The key holds the current number of active jobs; deleted when 0.
//
async function updateBusyCounter(delta) {
  try {
    if (delta > 0) {
      await client.multi().incr(BUSY_KEY).expire(BUSY_KEY, 60).exec();
    } else {
      const val = await client.decr(BUSY_KEY);
      if (val <= 0) await client.del(BUSY_KEY);
    }
  } catch (err) {
    logger.debug(err);
  }
}

//
// Process a single backup or rekey job
//
async function processJob(payload) {
  activeJobs++;
  await updateBusyCounter(1);

  try {
    switch (payload.action) {
      case 'backup': {
        await backup(payload);
        break;
      }

      case 'rekey': {
        await rekey(payload);
        break;
      }

      default: {
        logger.warn('sqlite-worker received unknown action', {
          action: payload.action
        });
      }
    }
  } catch (err) {
    logger.fatal(err, { payload: { ...payload, session: undefined } });
  } finally {
    activeJobs--;
    await updateBusyCounter(-1);
  }
}

//
// Redis Pub/Sub message handler
//
function onMessage(channel, message) {
  if (channel !== CHANNEL) return;
  if (isShuttingDown) return;

  let payload;
  try {
    payload = JSON.parse(message);
  } catch (err) {
    logger.warn('sqlite-worker failed to parse message', { err, message });
    return;
  }

  //
  // Memory gate: skip backup (not rekey) if free memory is too low.
  // Rekey is user-initiated and must not be silently dropped.
  //
  if (payload.action === 'backup' && os.freemem() < MIN_FREE_MEM) {
    logger.warn('sqlite-worker skipping backup due to low memory', {
      freemem: os.freemem(),
      threshold: MIN_FREE_MEM,
      alias_id: payload?.session?.user?.alias_id
    });
    return;
  }

  //
  // Concurrency gate: skip backup if at capacity.
  // Rekey is always accepted (user-initiated, must not be dropped).
  //
  if (payload.action === 'backup' && activeJobs >= MAX_CONCURRENCY) {
    logger.debug('sqlite-worker skipping backup due to concurrency limit', {
      activeJobs,
      alias_id: payload?.session?.user?.alias_id
    });
    return;
  }

  // Fire and forget — processJob handles its own errors
  processJob(payload);
}

//
// Graceful shutdown
//
const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client, subscriber],
  logger,
  timeoutMs: ms('2m'),
  customHandlers: [
    async () => {
      isShuttingDown = true;
      // Unsubscribe to stop receiving new jobs
      try {
        await subscriber.unsubscribe(CHANNEL);
      } catch (err) {
        logger.debug(err);
      }

      // Wait for in-flight jobs to complete (up to 90s)
      if (activeJobs > 0) {
        logger.info(
          `sqlite-worker waiting for ${activeJobs} in-flight jobs to complete`
        );
        const deadline = Date.now() + ms('90s');
        // eslint-disable-next-line no-unmodified-loop-condition
        while (activeJobs > 0 && Date.now() < deadline) {
          await setTimeout(500);
        }

        if (activeJobs > 0) {
          logger.warn(
            `sqlite-worker shutdown timeout with ${activeJobs} jobs still active`
          );
        }
      }

      // Clean up busy counter
      try {
        await client.del(BUSY_KEY);
      } catch (err) {
        logger.debug(err);
      }
    }
  ]
});

graceful.listen();

//
// Start
//
(async () => {
  try {
    await setupMongoose(logger);

    // Subscribe to the backup/rekey channel
    subscriber.on('message', onMessage);
    await subscriber.subscribe(CHANNEL);

    if (process.send) process.send('ready');
    logger.info('SQLite backup worker started', {
      hide_meta: true,
      channel: CHANNEL,
      maxConcurrency: MAX_CONCURRENCY
    });
  } catch (err) {
    await Promise.race([logger.error(err), setTimeout(5000)]);
    process.exit(1);
  }
})();
