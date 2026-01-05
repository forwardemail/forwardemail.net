/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Send Emails Job with Optional Piscina Thread Pool Support
//
// This job processes the email queue and sends emails using either:
// 1. Piscina thread pool (when enabled) - True multi-threaded parallelism
// 2. PQueue (default) - Single-threaded async concurrency
//
// IMPORTANT: Piscina is disabled by default due to:
// - High memory usage (each thread loads full app context)
// - MongoDB connection pool exhaustion risk
// - "Task queue is at limit" errors under high load
//
// Only enable Piscina with proper resource tuning.
//

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const os = require('node:os');
const path = require('node:path');
const process = require('node:process');
const { parentPort, workerData } = require('node:worker_threads');
const { setTimeout } = require('node:timers/promises');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const mongoose = require('mongoose');
const ms = require('ms');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const sharedConfig = require('@ladjs/shared-config');
const { default: PQueue } = require('p-queue');

const Domains = require('#models/domains');
const Emails = require('#models/emails');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const emailHelper = require('#helpers/email');

const getBlockedHashes = require('#helpers/get-blocked-hashes');
const logger = require('#helpers/logger');
const processEmail = require('#helpers/process-email');
const setupMongoose = require('#helpers/setup-mongoose');

const IP_ADDRESS = ip.address();
const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const resolver = createTangerine(client, logger);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

//
// Piscina Thread Pool Configuration
//
// When Piscina is enabled (via workerData from smtp-bree.js), we create
// a thread pool that distributes email processing across multiple CPU cores.
//
const piscinaEnabled = workerData?.piscinaEnabled ?? false;
const maxThreads = workerData?.maxThreads ?? Math.min(os.cpus().length, 8);
const minThreads = workerData?.minThreads ?? 1;
const idleTimeout = workerData?.idleTimeout ?? ms('30s');

let piscina = null;

if (piscinaEnabled) {
  // Lazy load Piscina only when enabled to avoid unnecessary overhead
  const Piscina = require('piscina');

  //
  // Calculate appropriate maxQueue to prevent "task queue is at limit" errors
  //
  // The queue size should be large enough to buffer work but not so large
  // that it causes memory issues. We use smtpMaxQueue * 2 to provide
  // headroom for burst traffic.
  //
  const maxQueue = config.smtpMaxQueue * 2;

  piscina = new Piscina({
    filename: path.resolve(__dirname, '..', 'helpers', 'smtp-worker.js'),
    maxQueue,
    idleTimeout,
    minThreads,
    maxThreads,
    //
    // Resource limits to prevent runaway memory usage
    //
    resourceLimits: {
      maxOldGenerationSizeMb: 256,
      maxYoungGenerationSizeMb: 64
    }
  });

  //
  // Monitor Piscina queue status for debugging
  //
  piscina.on('drain', () => {
    logger.debug('Piscina queue drained', { hide_meta: true });
  });

  logger.info(
    `send-emails: Piscina thread pool created (threads: ${minThreads}-${maxThreads}, maxQueue: ${maxQueue})`,
    { hide_meta: true }
  );
}

//
// PQueue Configuration
//
// PQueue provides async concurrency control. When Piscina is enabled,
// PQueue acts as a rate limiter to prevent overwhelming the thread pool.
// When Piscina is disabled, PQueue handles all concurrency.
//
const queueConcurrency = piscinaEnabled
  ? // When using Piscina, limit PQueue concurrency to match thread count
    // This prevents queue saturation
    maxThreads * 2
  : // Without Piscina, use the original concurrency
    Math.round(config.smtpMaxQueue / 2);

const queue = new PQueue({
  concurrency: queueConcurrency
});

logger.info(
  `send-emails: initialized (Piscina: ${piscinaEnabled}, PQueue concurrency: ${queueConcurrency})`,
  { hide_meta: true }
);

// Store boolean if the job is cancelled
let isCancelled = false;

// Handle cancellation (this is a very simple example)
if (parentPort)
  parentPort.once('message', (message) => {
    //
    // TODO: once we can manipulate concurrency option to p-map
    // we could make it `Number.MAX_VALUE` here to speed cancellation up
    // <https://github.com/sindresorhus/p-map/issues/28>
    //
    if (message === 'cancel') {
      isCancelled = true;
      // Clear the queue
      queue.clear();
      // Destroy Piscina if it exists
      if (piscina) {
        piscina.destroy().catch((err) => logger.error(err));
      }
    }
  });

graceful.listen();

//
// Process a single email using Piscina or direct processing
//
// @param {Object} email - The email document to process
// @returns {Promise} - Resolves when processing is complete
//
async function processEmailTask(email) {
  if (piscinaEnabled && piscina) {
    //
    // Check if Piscina queue has capacity before submitting
    // This prevents "task queue is at limit" errors
    //
    if (piscina.queueSize >= piscina.options.maxQueue) {
      logger.warn(
        `Piscina queue full (${piscina.queueSize}/${piscina.options.maxQueue}), processing directly`,
        { email: email._id }
      );
      // Fall back to direct processing when queue is full
      try {
        await processEmail({ email, resolver, client });
      } catch (err) {
        logger.error(err, { email });
      }

      return;
    }

    // Use Piscina thread pool for parallel processing
    try {
      const result = await piscina.run({ email });
      if (!result.success) {
        logger.error(new Error(result.error), { email });
      }
    } catch (err) {
      //
      // Handle Piscina-specific errors
      //
      if (err.message && err.message.includes('queue is at limit')) {
        logger.warn('Piscina queue at limit, processing directly', {
          email: email._id
        });
        // Fall back to direct processing
        try {
          await processEmail({ email, resolver, client });
        } catch (processErr) {
          logger.error(processErr, { email });
        }
      } else {
        logger.error(err, { email });
      }
    }
  } else {
    // Fall back to direct processing (single-threaded)
    try {
      await processEmail({ email, resolver, client });
    } catch (err) {
      logger.error(err, { email });
    }
  }
}

async function sendEmails() {
  // Return early if the job was already cancelled
  if (isCancelled) return;

  //
  // Check queue capacity before fetching more emails
  //
  const currentQueueSize = queue.size + queue.pending;
  if (currentQueueSize >= config.smtpMaxQueue) {
    logger.info(
      `queue has ${currentQueueSize} tasks (max: ${config.smtpMaxQueue}), waiting...`
    );
    await setTimeout(5000);
    return;
  }

  // TODO: capacity/recipient issues should be hard 550 bounce for outbound

  const now = new Date();
  //
  // Calculate how many emails to fetch based on available queue capacity
  //
  const limit = Math.min(
    config.smtpMaxQueue - currentQueueSize,
    piscinaEnabled ? maxThreads * 4 : config.smtpMaxQueue
  );

  if (limit <= 0) {
    logger.info('no queue capacity available, waiting...');
    await setTimeout(5000);
    return;
  }

  logger.info(
    'queueing %d emails (queue: %d/%d)',
    limit,
    currentQueueSize,
    config.smtpMaxQueue
  );

  // TODO: filter out recently blocked targets by rejectedErrors[x].mx.target

  //
  // NOTE: if you change this then also update `jobs/check-smtp-frozen-queue` if necessary
  //
  // Get list of all suspended domains
  // and recently blocked emails to exclude
  //
  // Optimized to use cursor-based iteration instead of aggregation
  // to avoid MongoDB MaxTimeMSExpired errors on large datasets
  //
  const suspendedDomainIds = [];
  const recentlyBlockedIds = [];

  await Promise.all([
    (async () => {
      for await (const domain of Domains.find({
        is_smtp_suspended: true
      })
        .select('_id')
        .lean()
        .cursor()
        .addCursorFlag('noCursorTimeout', true)) {
        suspendedDomainIds.push(domain._id);
      }
    })(),
    (async () => {
      for await (const email of Emails.find({
        updated_at: {
          $gte: dayjs().subtract(1, 'hour').toDate(),
          $lte: now
        },
        has_blocked_hashes: true,
        blocked_hashes: {
          $in: getBlockedHashes(IP_ADDRESS)
        }
      })
        .select('_id')
        .lean()
        .cursor()
        .addCursorFlag('noCursorTimeout', true)) {
        recentlyBlockedIds.push(email._id);
      }
    })()
  ]);

  logger.info('%d suspended domain ids', suspendedDomainIds.length);

  logger.info('%d recently blocked ids', recentlyBlockedIds.length);

  //
  // TODO: warm up IP addresses
  // <https://serverfault.com/a/1016122>
  //

  //
  // TODO: SMTP pooling by target
  //

  // NOTE: if you change this then also update `jobs/check-smtp-frozen-queue` if necessary
  // TODO: optimize this query
  const query = {
    _id: { $nin: recentlyBlockedIds },
    is_locked: false,
    status: 'queued',
    domain: {
      $nin: suspendedDomainIds
    },
    date: {
      $lte: now
    }
  };

  /*
  const count = await Emails.countDocuments(query);

  logger.info('%d emails pending in queue', count);

  // if count is > limit then we need to aggregate
  // and group for equal queue flow
  if (count > limit) {
    // TODO: get all those with priority > 0 first
    //       then subtract from limit and find more
    // TODO: monetize priority queue feature (paid add-on)

    const domainIds = await Emails.distinct('domain', query);
    // limit could be 60, domains 40 = 2 (1.5 -> 2)
    // limit could be 30, domains = 50 = (0.6 -> 1)
    // limit could be 2, domains = 1 = (2)
    // limit could be 1, domains = 1000 = (0.001 -> 1)
    const maxPerDomain = Math.ceil(limit / domainIds.length);

    const emailIds = [];

    // for each domain, subtract the count that it already has with "queued" + locked state
    for (const domainId of domainIds) {
      // eslint-disable-next-line no-await-in-loop
      const ids = await Emails.distinct('_id', {
        ...query,
        domain: { $in: [domainId] },
        is_locked: true
      });
      if (ids.length >= maxPerDomain) {
        // cannot queue any more
        logger.error(
          'Queue size exceeded for domain %s (%d/%d)',
          domainId.toString(),
          ids.length,
          maxPerDomain
        );
      } else {
        logger.info(
          'Adding %d to queue for domain %s (%d/%d)',
          maxPerDomain - ids.length,
          domainId.toString(),
          ids.length,
          maxPerDomain
        );
        emailIds.push(...ids.slice(0, maxPerDomain - ids.length));
      }
    }

    // modify `queue` such that it uses `_id: { $in: ids }`
    // whereas `_id` is an email ID to send out
    queue._id = { $in: emailIds };
  }
  */

  // eslint-disable-next-line unicorn/no-array-callback-reference
  for await (const email of Emails.find(query)
    .sort({ created_at: -1 }) // TODO: slows this query down by having sort
    .lean()
    .limit(limit)
    .cursor()
    .addCursorFlag('noCursorTimeout', true)) {
    // Return early if the job was already cancelled
    if (isCancelled) break;

    //
    // Check queue capacity before adding more tasks
    // This provides additional backpressure
    //
    if (queue.size + queue.pending >= config.smtpMaxQueue) {
      logger.info('queue full during iteration, breaking');
      break;
    }

    // TODO: implement queue on a per-target/provider basis (e.g. 10 at once to Cox addresses)
    queue.add(() => processEmailTask(email), {
      // TODO: if the email was admin owned domain then priority higher (see email pre-save hook)
      // priority: email.priority || 0
    });
  }

  await setTimeout(5000);
}

(async () => {
  await setupMongoose(logger);

  (async function startRecursion() {
    if (isCancelled) {
      // Clean up Piscina before exiting
      if (piscina) {
        try {
          await piscina.destroy();
        } catch (err) {
          logger.error(err);
        }
      }

      if (parentPort) parentPort.postMessage('done');
      else process.exit(0);
      return;
    }

    try {
      await sendEmails();
    } catch (err) {
      logger.error(err);

      emailHelper({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: 'Send emails had an error'
        },
        locals: {
          message: `<pre><code>${safeStringify(
            parseErr(err),
            null,
            2
          )}</code></pre>`
        }
      })
        .then()
        .catch((err) => logger.fatal(err));

      await setTimeout(5000);
    }

    startRecursion();
  })();
})();
