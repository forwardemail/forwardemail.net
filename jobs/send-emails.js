/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');
const { setTimeout } = require('node:timers/promises');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const mongoose = require('mongoose');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const sharedConfig = require('@ladjs/shared-config');
const { default: PQueue } = require('p-queue');

const Domains = require('#models/domains');
const Emails = require('#models/emails');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const processEmail = require('#helpers/process-email');
const setupMongoose = require('#helpers/setup-mongoose');
const getBlockedHashes = require('#helpers/get-blocked-hashes');
const monitorServer = require('#helpers/monitor-server');
const fairQueue = require('#helpers/fair-queue');
const { PRIORITY_LEVELS } = require('#config/priority-levels');

monitorServer();

const IP_ADDRESS = ip.address();
const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const resolver = createTangerine(client, logger);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

const queue = new PQueue({
  concurrency: Math.round(config.smtpMaxQueue / 2)
  // concurrency: config.concurrency * 30
  // timeout: config.smtpQueueTimeout
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
    if (message === 'cancel') {
      isCancelled = true;
      // clear the queue
      queue.clear();
    }
  });

graceful.listen();

async function sendEmails() {
  // return early if the job was already cancelled
  if (isCancelled) return;

  if (queue.size >= config.smtpMaxQueue) {
    logger.info(`queue has more than ${config.smtpMaxQueue} tasks`);
    await setTimeout(5000);
    return;
  }

  try {
    // Clean up expired throttling first
    await fairQueue.cleanupExpiredThrottling();

    // Calculate queue health and adaptive limits
    const queueHealth = await fairQueue.calculateQueueHealth();
    const limit = config.smtpMaxQueue - queue.size;
    
    logger.info(
      'Fair queue: processing up to %d emails (health: %.2f, age: %dm)', 
      limit, 
      queueHealth.multiplier, 
      queueHealth.queueAge
    );

    if (limit <= 0) {
      await setTimeout(5000);
      return;
    }

    const now = new Date();

    // Get excluded domains and emails (same as original logic)
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

    logger.info('%d suspended domains, %d recently blocked emails', 
      suspendedDomainIds.length, recentlyBlockedIds.length);

    // Base query for fair queue processing
    const query = {
      _id: { $nin: recentlyBlockedIds },
      is_locked: false,
      status: 'queued',
      domain: { $nin: suspendedDomainIds },
      date: { $lte: now },
      // Exclude throttled emails (not expired)
      $or: [
        { throttled_until: { $exists: false } },
        { throttled_until: { $lt: now } }
      ]
    };

    // Use fair distribution to get emails with adaptive priority limits
    const selectedEmails = await fairQueue.getDomainFairDistribution(query, limit, queueHealth);
    
    logger.info(`Fair queue: selected ${selectedEmails.length} emails for processing`);

    // Process selected emails with priority-aware queuing
    for (const email of selectedEmails) {
      // return early if the job was already cancelled
      if (isCancelled) break;

      // Add to queue with priority (PQueue doesn't use priority directly, 
      // but we maintain order through our selection process)
      queue.add(
        async () => {
          try {
            await processEmail({ email, resolver, client });
          } catch (err) {
            logger.error(err, { email: email._id });
          }
        },
        {
          // Future: could implement priority queues here
          priority: email.priority || PRIORITY_LEVELS.NORMAL
        }
      );
    }

    // Log queue distribution for monitoring
    if (selectedEmails.length > 0) {
      const priorityDistribution = {};
      for (const email of selectedEmails) {
        const priority = email.priority || PRIORITY_LEVELS.NORMAL;
        priorityDistribution[priority] = (priorityDistribution[priority] || 0) + 1;
      }

      logger.debug('Priority distribution:', priorityDistribution);
    }

  } catch (err) {
    logger.error('Fair queue error:', err);
    // Fall back to basic processing in case of fair queue failure
    const basicQuery = {
      is_locked: false,
      status: 'queued',
      date: { $lte: new Date() }
    };
    
    const fallbackEmails = await Emails.find(basicQuery)
      .sort({ priority: -1, created_at: 1 })
      .limit(Math.min(10, config.smtpMaxQueue - queue.size))
      .lean();
      
    function processEmailWrapper(email) {
      return async () => {
        try {
          await processEmail({ email, resolver, client });
        } catch (err) {
          logger.error(err, { email: email._id });
        }
      };
    }
      
    for (const email of fallbackEmails) {
      if (isCancelled) break;
      queue.add(processEmailWrapper(email));
    }
  }

  await setTimeout(5000);
}

(async () => {
  await setupMongoose(logger);

  (async function startRecursion() {
    if (isCancelled) {
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
