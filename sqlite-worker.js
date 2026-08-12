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

const Aliases = require('#models/aliases');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const config = require('#config');
const email = require('#helpers/email');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { backup, rekey, vacuum } = require('#helpers/worker');
const {
  MAX_CONCURRENCY,
  MIN_FREE_MEM,
  REKEY_STALE_THRESHOLD
} = require('#helpers/sqlite-worker-config');

const imapSharedConfig = sharedConfig('IMAP');
const client = new Redis(imapSharedConfig.redis, logger);
const subscriber = new Redis(imapSharedConfig.redis, logger);

client.setMaxListeners(0);
subscriber.setMaxListeners(0);

//
// Configuration
//
const CHANNEL = `sqlite_backup_queue:${config.env}`;
const VACUUM_CHANNEL = `sqlite_vacuum_queue:${config.env}`;
const REKEY_QUEUE = `rekey_queue:${config.env}`;
const BUSY_KEY = `sqlite_worker_busy:${config.env}`;

//
// State
//
let isShuttingDown = false;
let activeJobs = 0;

// Track in-flight rekey payloads so they can be re-queued on shutdown
const inFlightRekeyPayloads = new Set();

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
async function processJob(payload, payloadStr) {
  activeJobs++;
  await updateBusyCounter(1);

  // Track in-flight rekey jobs for re-queue on shutdown
  if (payload.action === 'rekey' && payloadStr) {
    inFlightRekeyPayloads.add(payloadStr);
  }

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

      case 'vacuum': {
        await vacuum(payload);
        break;
      }

      default: {
        logger.warn('sqlite-worker received unknown action', {
          action: payload.action
        });
      }
    }
  } catch (err) {
    //
    // If the rekey was interrupted by shutdown, re-queue it immediately
    // so it survives the restart. Do NOT log as fatal — it's expected.
    //
    if (payload.action === 'rekey' && err instanceof ServerShutdownError) {
      if (payloadStr) {
        try {
          await client.rpush(REKEY_QUEUE, payloadStr);
          logger.info('Re-queued rekey job interrupted by shutdown', {
            alias_id: payload?.session?.user?.alias_id
          });
        } catch (requeueErr) {
          logger.fatal('Failed to re-queue rekey job during shutdown', {
            err: requeueErr,
            alias_id: payload?.session?.user?.alias_id
          });
        }
      }
    } else {
      logger.fatal(err, { payload: { ...payload, session: undefined } });
    }
  } finally {
    if (payload.action === 'rekey' && payloadStr) {
      inFlightRekeyPayloads.delete(payloadStr);
    }

    activeJobs--;
    await updateBusyCounter(-1);
  }
}

//
// Redis Pub/Sub message handler (backups only — rekey uses List polling)
//
function onMessage(channel, message) {
  if (channel !== CHANNEL && channel !== VACUUM_CHANNEL) return;
  if (isShuttingDown) return;

  let payload;
  try {
    payload = JSON.parse(message);
  } catch (err) {
    logger.warn('sqlite-worker failed to parse message', { err, message });
    return;
  }

  // Rekey jobs should no longer arrive via Pub/Sub (they use the Redis List).
  // If one does arrive (e.g. during a rolling deploy with mixed versions),
  // push it to the List so it's handled by the polling loop.
  if (payload.action === 'rekey') {
    client
      .rpush(REKEY_QUEUE, message)
      .catch((err) => logger.fatal('Failed to redirect rekey to queue', err));
    return;
  }

  //
  // Vacuum jobs: same concurrency/memory gates as backup.
  //
  if (payload.action === 'vacuum') {
    if (os.freemem() < MIN_FREE_MEM) {
      logger.debug('sqlite-worker skipping vacuum due to low memory', {
        freemem: os.freemem(),
        alias_id: payload?.session?.user?.alias_id
      });
      return;
    }

    if (activeJobs >= MAX_CONCURRENCY) {
      logger.debug('sqlite-worker skipping vacuum due to concurrency limit', {
        activeJobs,
        alias_id: payload?.session?.user?.alias_id
      });
      return;
    }

    processJob(payload, message);
    return;
  }

  //
  // Memory gate: skip backup if free memory is too low.
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
  //
  if (payload.action === 'backup' && activeJobs >= MAX_CONCURRENCY) {
    logger.debug('sqlite-worker skipping backup due to concurrency limit', {
      activeJobs,
      alias_id: payload?.session?.user?.alias_id
    });
    return;
  }

  // Fire and forget — processJob handles its own errors
  processJob(payload, message);
}

//
// Poll the Redis List for rekey jobs.
// Uses BLPOP with a 5s timeout so we can check isShuttingDown periodically.
//
async function pollRekeyQueue() {
  // eslint-disable-next-line no-unmodified-loop-condition
  while (!isShuttingDown) {
    try {
      // BLPOP returns [key, value] or null on timeout
      const result = await client.blpop(REKEY_QUEUE, 5);
      if (!result) continue; // timeout — loop and check isShuttingDown

      const [, payloadStr] = result;
      let payload;
      try {
        payload = JSON.parse(payloadStr);
      } catch (err) {
        logger.warn('sqlite-worker failed to parse rekey queue item', {
          err,
          payloadStr
        });
        continue;
      }

      // Process rekey synchronously (one at a time) to avoid resource contention
      await processJob(payload, payloadStr);
    } catch (err) {
      // If Redis disconnects, wait briefly and retry
      if (!isShuttingDown) {
        logger.error('Rekey queue poll error', { err });
        await setTimeout(2000);
      }
    }
  }
}

//
// Startup recovery: detect aliases stuck in rekey state from previous
// crashes/deploys and clear them (email the user to retry).
//
async function recoverStuckRekeys() {
  try {
    const threshold = new Date(Date.now() - REKEY_STALE_THRESHOLD);

    const stuckAliases = await Aliases.find({
      is_rekey: true,
      $or: [
        { rekey_started_at: { $lt: threshold } },
        // Handle legacy aliases without rekey_started_at (pre-migration)
        { rekey_started_at: { $exists: false } }
      ]
    })
      .select('name domain user rekey_started_at')
      .populate('domain', 'name')
      .populate('user', 'email locale')
      .lean()
      .exec();

    if (stuckAliases.length === 0) return;

    logger.warn(
      `sqlite-worker startup: found ${stuckAliases.length} stuck rekey operations`
    );

    for (const alias of stuckAliases) {
      try {
        await Aliases.findByIdAndUpdate(alias._id, {
          $set: { is_rekey: false },
          $unset: { rekey_started_at: 1 }
        });

        const ownerEmail = alias.user?.email;
        const locale = alias.user?.locale || i18n.config.defaultLocale;
        const domainName = alias.domain?.name || 'unknown';
        const username = `${alias.name}@${domainName}`;

        if (ownerEmail) {
          await email({
            template: 'alert',
            message: {
              to: ownerEmail,
              cc: config.alertsEmail,
              subject: i18n.translate(
                'ALIAS_REKEY_INTERRUPTED_SUBJECT',
                locale,
                username
              )
            },
            locals: {
              message: i18n.translate(
                'ALIAS_REKEY_INTERRUPTED',
                locale,
                username
              ),
              locale
            }
          });
        }

        logger.info('Cleared stuck rekey', {
          alias_id: alias._id,
          alias_name: username,
          rekey_started_at: alias.rekey_started_at
        });
      } catch (err) {
        logger.error('Failed to clear stuck rekey', {
          err,
          alias_id: alias._id
        });
      }
    }
  } catch (err) {
    logger.error('recoverStuckRekeys failed', { err });
  }
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

      // Unsubscribe to stop receiving new backup jobs
      try {
        await subscriber.unsubscribe(CHANNEL, VACUUM_CHANNEL);
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

          //
          // Re-queue any in-flight rekey jobs that didn't complete.
          // This ensures they survive the deploy and get picked up
          // by the next worker instance.
          //
          for (const payloadStr of inFlightRekeyPayloads) {
            try {
              await client.rpush(REKEY_QUEUE, payloadStr);
              logger.info('Re-queued in-flight rekey job during shutdown');
            } catch (err) {
              logger.fatal('Failed to re-queue rekey job during shutdown', {
                err
              });
            }
          }
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

    // Recover any stuck rekeys from previous crashes/deploys
    await recoverStuckRekeys();

    // Subscribe to the backup channel (backups still use Pub/Sub)
    subscriber.on('message', onMessage);
    await subscriber.subscribe(CHANNEL, VACUUM_CHANNEL);

    // Start polling the rekey queue (Redis List — persistent, survives restarts)
    pollRekeyQueue();

    if (process.send) process.send('ready');
    logger.info('SQLite backup worker started', {
      hide_meta: true,
      channel: CHANNEL,
      vacuumChannel: VACUUM_CHANNEL,
      rekeyQueue: REKEY_QUEUE,
      maxConcurrency: MAX_CONCURRENCY
    });
  } catch (err) {
    await Promise.race([logger.error(err), setTimeout(5000)]);
    process.exit(1);
  }
})();
