/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Send Emails Job with Piscina Thread Pool Support
//
// This job processes the email queue and sends emails using either:
// 1. Piscina thread pool (when enabled) - True multi-threaded parallelism
// 2. PQueue (fallback) - Single-threaded async concurrency
//
// The Piscina approach distributes email processing across multiple CPU cores,
// significantly increasing throughput for high-volume email sending.
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
const Piscina = require('piscina');
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
// The thread pool is created here (in the Bree worker) rather than in
// smtp-bree.js because Bree workers run in separate processes, and we
// need the thread pool to be accessible within this process.
//
const piscinaEnabled = workerData?.piscinaEnabled ?? false;
const maxThreads = workerData?.maxThreads ?? Math.min(os.cpus().length, 8);
const minThreads = workerData?.minThreads ?? 1;

let piscina = null;

if (piscinaEnabled) {
  piscina = new Piscina({
    filename: path.resolve(__dirname, '..', 'helpers', 'smtp-worker.js'),
    maxQueue: 'auto',
    idleTimeout: ms('30s'),
    minThreads,
    maxThreads
  });

  logger.info(
    `send-emails: Piscina thread pool created (threads: ${minThreads}-${maxThreads})`,
    { hide_meta: true }
  );
}

//
// PQueue Configuration (fallback when Piscina is disabled)
//
// When Piscina is disabled, we fall back to PQueue for async concurrency.
// This provides concurrency within a single thread but doesn't utilize
// multiple CPU cores.
//
const queueConcurrency = piscinaEnabled
  ? // When using Piscina, we use a higher PQueue concurrency since
    // the actual work is done in the thread pool
    config.smtpMaxQueue
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
    // Use Piscina thread pool for parallel processing
    try {
      const result = await piscina.run({ email });
      if (!result.success) {
        logger.error(new Error(result.error), { email });
      }
    } catch (err) {
      logger.error(err, { email });
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

  if (queue.size >= config.smtpMaxQueue) {
    logger.info(`queue has more than ${config.smtpMaxQueue} tasks`);
    await setTimeout(5000);
    return;
  }

  // TODO: capacity/recipient issues should be hard 550 bounce for outbound

  const now = new Date();
  const limit = config.smtpMaxQueue - queue.size;

  logger.info('queueing %d emails', limit);

  // TODO: filter out recently blocked targets by rejectedErrors[x].mx.target

  //
  // NOTE: if you change this then also update `jobs/check-smtp-frozen-queue` if necessary
  //
  // Get list of all suspended domains
  // and recently blocked emails to exclude
  const [suspendedDomains, recentlyBlocked] = await Promise.all([
    Domains.aggregate([
      { $match: { is_smtp_suspended: true } },
      { $group: { _id: '$_id' } }
    ])
      .allowDiskUse(true)
      .exec(),
    Emails.aggregate([
      {
        $match: {
          updated_at: {
            $gte: dayjs().subtract(1, 'hour').toDate(),
            $lte: now
          },
          has_blocked_hashes: true,
          blocked_hashes: {
            $in: getBlockedHashes(IP_ADDRESS)
          }
        }
      },
      {
        $group: { _id: '$_id' }
      }
    ])
      .allowDiskUse(true)
      .exec()
  ]);

  const suspendedDomainIds = suspendedDomains.map((v) => v._id);
  const recentlyBlockedIds = recentlyBlocked.map((v) => v._id);

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
