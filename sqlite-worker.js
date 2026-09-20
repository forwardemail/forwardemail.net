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

const ServerShutdownError = require('#helpers/server-shutdown-error');
const config = require('#config');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const {
  backup,
  rekey,
  setWorkerCancelled,
  vacuum
} = require('#helpers/worker');
const { getRekeyKey, recoverRekeys } = require('#helpers/recover-rekeys');
const { REKEY_QUEUE } = require('#helpers/rekey-recovery');
const {
  enqueueRekeyJob,
  finishRekeyJob,
  requeueRekeyJob,
  takeRekeyJob
} = require('#helpers/rekey-queue');
const {
  acquireWorkerLease,
  releaseWorkerLease,
  startWorkerLeaseRenewal
} = require('#helpers/sqlite-worker-lease');
const {
  MAX_CONCURRENCY,
  MIN_FREE_MEM,
  REKEY_RETRY_BASE_DELAY,
  REKEY_RETRY_MAX_DELAY,
  REKEY_SWEEP_INTERVAL,
  SHUTDOWN_DRAIN_TIMEOUT
} = require('#helpers/sqlite-worker-config');

const imapSharedConfig = sharedConfig('IMAP');
const client = new Redis(imapSharedConfig.redis, logger);
const subscriber = new Redis(imapSharedConfig.redis, logger);
//
// Dedicated connection for the blocking rekey queue pop: a blocking command
// holds its connection for up to 5s and every other command sent on the
// same connection (busy counter, job re-queues, recovery) would wait for it.
//
const blockingClient = new Redis(imapSharedConfig.redis, logger);

client.setMaxListeners(0);
subscriber.setMaxListeners(0);
blockingClient.setMaxListeners(0);

//
// Configuration
//
const CHANNEL = `sqlite_backup_queue:${config.env}`;
const VACUUM_CHANNEL = `sqlite_vacuum_queue:${config.env}`;
const BUSY_KEY = `sqlite_worker_busy:${config.env}`;

//
// State
//
let isShuttingDown = false;
let activeJobs = 0;

//
// Rekeys currently running in this process (see helpers/recover-rekeys.js:
// the recovery pass must leave these alone).  Keyed by rekey operation.
//
const activeRekeyKeys = new Set();

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
// Process a single backup, vacuum or rekey job
//
async function processJob(payload, payloadStr) {
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
    // A rekey interrupted by a graceful shutdown is put back at the head of
    // the queue so it is the first thing the next worker runs.  (A rekey
    // interrupted by SIGKILL never gets here: its job stays in the
    // processing list and the next worker re-queues it on startup.)
    // Do NOT log as fatal — it's expected.
    //
    if (payload.action === 'rekey' && err instanceof ServerShutdownError) {
      if (payloadStr) {
        try {
          await requeueRekeyJob(client, payloadStr);
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
    } else if (payload.action === 'rekey' && err.isRekeyRetryable) {
      //
      // A transient condition (see helpers/worker.js): nothing about the
      // mailbox changed, run the job again after an exponential backoff.
      // The attempt counter and the earliest retry time travel with the
      // job; `pollRekeyQueue` defers a job whose time has not come.
      //
      const attempts =
        err.attempts || (Number(payload.rekey_attempts) || 0) + 1;
      const delay = Math.min(
        REKEY_RETRY_MAX_DELAY,
        REKEY_RETRY_BASE_DELAY * 2 ** (attempts - 1)
      );
      try {
        await enqueueRekeyJob(
          client,
          JSON.stringify({
            ...payload,
            rekey_attempts: attempts,
            rekey_not_before: Date.now() + delay
          })
        );
        logger.warn('Rekey job scheduled for retry', {
          alias_id: payload?.session?.user?.alias_id,
          rekey_id: payload?.rekey_id,
          attempts,
          delay_ms: delay,
          reason: err.message
        });
      } catch (requeueErr) {
        logger.fatal('Failed to schedule rekey job retry', {
          err: requeueErr,
          alias_id: payload?.session?.user?.alias_id
        });
      }
    } else if (payload.action === 'rekey' && err.isRekeySuperseded) {
      logger.warn(err.message, { alias_id: payload?.session?.user?.alias_id });
    } else {
      logger.fatal(err, { payload: { ...payload, session: undefined } });
    }
  } finally {
    activeJobs--;
    await updateBusyCounter(-1);
  }
}

//
// Redis Pub/Sub message handler (backups and vacuums — rekey uses the List)
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
    enqueueRekeyJob(client, message).catch((err) =>
      logger.fatal('Failed to redirect rekey to queue', err)
    );
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
//
// A job is moved atomically from the queue to the processing list (BLMOVE,
// blocking for up to 5s so `isShuttingDown` is checked periodically) and only
// removed from the processing list once its outcome is recorded, so a job
// survives a worker that dies while running it (see helpers/recover-rekeys.js).
//
async function pollRekeyQueue() {
  // eslint-disable-next-line no-unmodified-loop-condition
  while (!isShuttingDown) {
    try {
      //
      // Respect the same concurrency gate as backups and vacuums BEFORE
      // taking a job: a backup that is still running for this alias holds
      // its own handle (and -wal/-shm files) on the live database, which
      // would make the rekey fail its exclusivity proof.
      //
      // eslint-disable-next-line no-unmodified-loop-condition
      while (activeJobs >= MAX_CONCURRENCY && !isShuttingDown) {
        await setTimeout(500);
      }

      if (isShuttingDown) break;

      // resolves with the job or null on timeout
      const payloadStr = await takeRekeyJob(blockingClient, 5);
      if (!payloadStr) continue; // timeout — loop and check isShuttingDown

      let deferMs = 0;
      let rekeyKey;
      try {
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

        //
        // Register the job as running right away (before any await) and
        // keep it registered until it has left the processing list, so the
        // recovery sweep (which runs concurrently) never mistakes it for a
        // job left behind by a dead worker.
        //
        rekeyKey = getRekeyKey({
          rekeyId: payload?.rekey_id,
          aliasId: payload?.session?.user?.alias_id
        });
        activeRekeyKeys.add(rekeyKey);

        // a retry whose backoff has not elapsed goes back to the queue
        if (
          typeof payload.rekey_not_before === 'number' &&
          payload.rekey_not_before > Date.now()
        ) {
          deferMs = Math.min(5000, payload.rekey_not_before - Date.now());
          await enqueueRekeyJob(client, payloadStr);
          continue;
        }

        //
        // A backup may have started while the pop above was blocking; wait
        // for it rather than running two jobs at once (the job is safely
        // parked in the processing list meanwhile).
        //
        // eslint-disable-next-line no-unmodified-loop-condition
        while (activeJobs >= MAX_CONCURRENCY && !isShuttingDown) {
          await setTimeout(500);
        }

        if (isShuttingDown) {
          await requeueRekeyJob(client, payloadStr);
          continue;
        }

        // Process rekey synchronously (one at a time) to avoid resource contention
        await processJob(payload, payloadStr);
      } finally {
        //
        // The outcome of the job has been recorded (or the job was put back
        // in the queue), so it can leave the processing list.
        //
        try {
          await finishRekeyJob(client, payloadStr);
        } catch (err) {
          // harmless: the next recovery pass drops a settled job
          logger.error('Failed to remove rekey job from processing list', {
            err
          });
        }

        if (rekeyKey) activeRekeyKeys.delete(rekeyKey);

        // do not spin on a queue that only holds deferred retries
        if (deferMs > 0) await setTimeout(deferMs);
      }
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
// Recovery of interrupted rekeys (see helpers/recover-rekeys.js): once at
// startup, before any job is taken, and then periodically in case a pass
// failed (e.g. MongoDB was unavailable) or a job could not settle its alias.
//
let isRecovering = false;

async function recoverInterruptedRekeys() {
  if (isRecovering) return;
  isRecovering = true;
  try {
    await recoverRekeys(client, { activeKeys: activeRekeyKeys });
  } catch (err) {
    logger.error('Rekey recovery failed', { err });
  } finally {
    isRecovering = false;
  }
}

let recoveryInterval;

//
// Exactly one sqlite-worker may run fleet-wide (helpers/sqlite-worker-lease.js).
// A worker that loses its lease (another one was started by mistake and
// took it over after this one stalled, or Redis could not confirm the lease
// for a whole TTL) shuts down like on SIGTERM: in-flight jobs get their
// grace period and an unfinished rekey is re-run by the worker holding the
// lease (its job is still in the processing list).  pm2 then starts this
// worker again, and it waits for the lease before taking any work.
//
let stopLeaseRenewal;
let leaseHeld = false;

function onWorkerLeaseLost(reason) {
  leaseHeld = false;
  logger.fatal(
    `sqlite-worker lost its worker lease (${reason}), shutting down`
  );
  if (!isShuttingDown) process.kill(process.pid, 'SIGTERM');
}

//
// Graceful shutdown
//
const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client, subscriber, blockingClient],
  logger,
  timeoutMs: ms('2m'),
  customHandlers: [
    async () => {
      isShuttingDown = true;
      if (recoveryInterval) clearInterval(recoveryInterval);

      //
      // Tell the in-flight job to stop at its next checkpoint (it throws a
      // ServerShutdownError there, and a rekey is then put back in the
      // queue); the wait below gives it the time to get there.
      //
      setWorkerCancelled();

      // Unsubscribe to stop receiving new backup jobs
      try {
        await subscriber.unsubscribe(CHANNEL, VACUUM_CHANNEL);
      } catch (err) {
        logger.debug(err);
      }

      //
      // Wait for in-flight jobs to complete.  The wait stays below pm2's
      // kill_timeout (ecosystem-sqlite.json) so a worker that drained in
      // time exits cleanly instead of being killed.  A rekey that does not
      // finish in time is not lost: its job is still in the processing list
      // and the next worker re-queues it on startup.
      //
      // The worker lease keeps being renewed for the whole wait: another
      // worker must not start (and recover what still runs here) before
      // this one is really done.
      //
      if (activeJobs > 0) {
        logger.info(
          `sqlite-worker waiting for ${activeJobs} in-flight jobs to complete`
        );
        const deadline = Date.now() + SHUTDOWN_DRAIN_TIMEOUT;
        // eslint-disable-next-line no-unmodified-loop-condition
        while (activeJobs > 0 && Date.now() < deadline) {
          await setTimeout(500);
        }

        if (activeJobs > 0)
          logger.warn(
            `sqlite-worker shutdown timeout with ${activeJobs} jobs still active`
          );
      }

      // Clean up busy counter
      try {
        await client.del(BUSY_KEY);
      } catch (err) {
        logger.debug(err);
      }

      if (stopLeaseRenewal) stopLeaseRenewal();

      //
      // Hand the lease over only once nothing runs here any more.  With a
      // job still active the lease is left to expire on its own instead:
      // the process exits right after this handler (or pm2 kills it), and
      // until then no other worker may take over.
      //
      if (leaseHeld && activeJobs === 0) {
        leaseHeld = false;
        try {
          await releaseWorkerLease(client);
        } catch (err) {
          logger.debug(err);
        }
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

    //
    // Become THE sqlite-worker before touching any job or rekey state: a
    // second worker (a scaled container, a stray pm2 instance) waits here
    // until the running one stops, instead of racing it on the same files.
    //
    leaseHeld = await acquireWorkerLease(client, {
      isCancelled: () => isShuttingDown
    });
    if (!leaseHeld) return;
    stopLeaseRenewal = startWorkerLeaseRenewal(client, onWorkerLeaseLost);

    // Recover rekeys interrupted by the previous worker before taking jobs
    await recoverInterruptedRekeys();
    recoveryInterval = setInterval(
      recoverInterruptedRekeys,
      REKEY_SWEEP_INTERVAL
    );
    recoveryInterval.unref();

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
