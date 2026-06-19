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
const GB = 1024 * 1024 * 1024;

//
// Backups are bounded by disk space + I/O rather than heap (the `sqlite` format
// uses on-disk `VACUUM INTO` and the S3 upload is streamed), so a single backup
// never loads a large mailbox into RAM. The risk is two simultaneous backups of
// large databases competing for free memory / page cache on the host. The gates
// below are therefore memory-aware and adapt to live `os.freemem()`:
//
//   * MAX_CONCURRENCY        - absolute ceiling on concurrent backups.
//   * HIGH_WATER_FREE_MEM    - at/above this much free memory we allow the full
//                              MAX_CONCURRENCY; below it we throttle to 1 so a
//                              second large backup cannot pile on while memory
//                              is already tight.
//   * MIN_FREE_MEM           - hard floor: below this no new backup starts.
//
const MAX_CONCURRENCY = 2;
const HIGH_WATER_FREE_MEM = 4 * GB;
const MIN_FREE_MEM = 2 * GB;

//
// Effective concurrency limit given current free memory: full ceiling when
// memory is comfortable, throttled to a single backup when it is tight.
//
function getEffectiveMaxConcurrency() {
  return os.freemem() >= HIGH_WATER_FREE_MEM ? MAX_CONCURRENCY : 1;
}

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
  // Memory gate: skip backup (not rekey) if free memory is below the hard
  // floor. Rekey is user-initiated and must not be silently dropped.
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
  // Concurrency gate: skip backup if at the memory-aware effective capacity.
  // The effective limit drops to 1 when free memory is below the high-water
  // mark so a second large backup cannot pile on while memory is tight.
  // Rekey is always accepted (user-initiated, must not be dropped).
  //
  if (payload.action === 'backup') {
    const effectiveMax = getEffectiveMaxConcurrency();
    if (activeJobs >= effectiveMax) {
      logger.debug('sqlite-worker skipping backup due to concurrency limit', {
        activeJobs,
        effectiveMax,
        maxConcurrency: MAX_CONCURRENCY,
        freemem: os.freemem(),
        highWater: HIGH_WATER_FREE_MEM,
        alias_id: payload?.session?.user?.alias_id
      });
      return;
    }
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
