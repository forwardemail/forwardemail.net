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
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const os = require('node:os');
const path = require('node:path');
const process = require('node:process');
const { parentPort, workerData } = require('node:worker_threads');
const { setTimeout } = require('node:timers/promises');
const pTimeout = require('p-timeout');

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
const { encode } = require('html-entities');
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
// Maximum time (ms) a single processEmail call is allowed to run before
// being considered hung. This prevents a single stalled SMTP connection
// or DNS lookup from permanently occupying a PQueue slot and leaving the
// email locked. The SMTP socket timeout is 180s, so we allow 5 minutes
// (300s) to account for DNS + connect + multiple recipients + save.
//
const PROCESS_EMAIL_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

//
// Safety-net: if processEmail times out or throws after the lock was
// acquired, atomically unlock the email and record the timeout error
// in rejectedErrors so there's a clear audit trail. Also sends an
// admin alert email for visibility.
//
//
// IMPORTANT: safetyNetUnlock MUST resolve quickly (within 30s) to ensure
// the PQueue slot is freed. If the MongoDB operation itself hangs (e.g.,
// connection pool exhausted), we use pTimeout to guarantee this function
// returns, preventing cascading PQueue starvation.
//
const SAFETY_NET_TIMEOUT_MS = 30 * 1000; // 30 seconds

async function safetyNetUnlock(emailId, reason) {
  const timeoutErr = {
    name: 'TimeoutError',
    message: `processEmail timed out after ${PROCESS_EMAIL_TIMEOUT_MS}ms (reason: ${reason})`,
    responseCode: 421,
    isCodeBug: true,
    date: new Date()
  };

  const MAX_UNLOCK_RETRIES = 3;
  const RETRY_DELAY_MS = 5000; // 5 seconds between retries

  for (let attempt = 1; attempt <= MAX_UNLOCK_RETRIES; attempt++) {
    try {
      // Atomically unlock AND push the timeout error to rejectedErrors
      // so the email has a record of why it was interrupted.
      // Wrapped in its own timeout to prevent this from hanging the PQueue slot.
      await pTimeout(
        Emails.findByIdAndUpdate(emailId, {
          $set: { is_locked: false },
          $unset: { locked_by: 1, locked_at: 1 },
          $push: {
            rejectedErrors: timeoutErr
          }
        }),
        SAFETY_NET_TIMEOUT_MS
      );
      console.error(
        '[WARN:send-emails] safety-net unlocked hung email',
        JSON.stringify({
          emailId,
          reason,
          timeoutMs: PROCESS_EMAIL_TIMEOUT_MS,
          attempt
        })
      );
      return; // Success — exit the retry loop
    } catch (unlockErr) {
      console.error(
        '[ERROR:send-emails] safety-net unlock failed',
        JSON.stringify({
          emailId,
          reason,
          attempt,
          maxRetries: MAX_UNLOCK_RETRIES,
          unlockErrName: unlockErr.name,
          unlockErrMessage: unlockErr.message?.slice(0, 200)
        })
      );

      // If we have retries left and it's a transient error, wait and retry
      if (attempt < MAX_UNLOCK_RETRIES) {
        await setTimeout(RETRY_DELAY_MS);
      }
    }
  }

  // All retries exhausted — PQueue slot will still be freed, unlock-emails job is the last resort
  console.error(
    '[ERROR:send-emails] safety-net unlock exhausted all retries (PQueue slot will still be freed)',
    JSON.stringify({ emailId, reason, maxRetries: MAX_UNLOCK_RETRIES })
  );

  // Send admin alert so hung emails get immediate visibility
  emailHelper({
    template: 'alert',
    message: {
      to: config.supportEmail,
      subject: `Hung email detected: ${emailId} (${reason})`
    },
    locals: {
      message: `<pre><code>${encode(
        safeStringify(
          {
            emailId,
            reason,
            timeoutMs: PROCESS_EMAIL_TIMEOUT_MS,
            timeoutErr
          },
          null,
          2
        )
      )}</code></pre>`
    }
  })
    .then()
    .catch((err) => logger.fatal(err));
}

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
        await pTimeout(
          processEmail({ email, resolver, client }),
          PROCESS_EMAIL_TIMEOUT_MS
        );
      } catch (err) {
        if (err instanceof pTimeout.TimeoutError) {
          console.error(
            '[ERROR:send-emails] processEmail timed out (piscina fallback)',
            JSON.stringify({
              emailId: email._id,
              timeoutMs: PROCESS_EMAIL_TIMEOUT_MS
            })
          );
          await safetyNetUnlock(email._id, 'timeout_piscina_fallback');
        } else {
          console.error(
            '[ERROR:send-emails] processEmail threw (piscina fallback), attempting unlock',
            JSON.stringify({
              emailId: email._id,
              errName: err.name,
              errMessage: err.message?.slice(0, 200)
            })
          );
          try {
            await pTimeout(
              Emails.findByIdAndUpdate(email._id, {
                $set: { is_locked: false },
                $unset: { locked_by: 1, locked_at: 1 }
              }),
              SAFETY_NET_TIMEOUT_MS
            );
          } catch {}

          try {
            logger.error(err, { email: email._id });
          } catch {}
        }
      }

      return;
    }

    // Use Piscina thread pool for parallel processing
    try {
      const result = await pTimeout(
        piscina.run({ email }),
        PROCESS_EMAIL_TIMEOUT_MS
      );
      if (!result.success) {
        try {
          logger.error(new Error(result.error), { email: email._id });
        } catch {}
      }
    } catch (err) {
      //
      // Handle Piscina-specific errors
      //
      if (err instanceof pTimeout.TimeoutError) {
        console.error(
          '[ERROR:send-emails] piscina.run timed out',
          JSON.stringify({
            emailId: email._id,
            timeoutMs: PROCESS_EMAIL_TIMEOUT_MS
          })
        );
        await safetyNetUnlock(email._id, 'timeout_piscina');
      } else if (err.message && err.message.includes('queue is at limit')) {
        logger.warn('Piscina queue at limit, processing directly', {
          email: email._id
        });
        // Fall back to direct processing
        try {
          await pTimeout(
            processEmail({ email, resolver, client }),
            PROCESS_EMAIL_TIMEOUT_MS
          );
        } catch (processErr) {
          if (processErr instanceof pTimeout.TimeoutError) {
            console.error(
              '[ERROR:send-emails] processEmail timed out (queue-at-limit fallback)',
              JSON.stringify({
                emailId: email._id,
                timeoutMs: PROCESS_EMAIL_TIMEOUT_MS
              })
            );
            await safetyNetUnlock(email._id, 'timeout_queue_limit_fallback');
          } else {
            console.error(
              '[ERROR:send-emails] processEmail threw (queue-at-limit fallback), attempting unlock',
              JSON.stringify({
                emailId: email._id,
                errName: processErr.name,
                errMessage: processErr.message?.slice(0, 200)
              })
            );
            try {
              await pTimeout(
                Emails.findByIdAndUpdate(email._id, {
                  $set: { is_locked: false },
                  $unset: { locked_by: 1, locked_at: 1 }
                }),
                SAFETY_NET_TIMEOUT_MS
              );
            } catch {}

            try {
              logger.error(processErr, { email: email._id });
            } catch {}
          }
        }
      } else {
        console.error(
          '[ERROR:send-emails] piscina error (non-timeout, non-queue-limit), attempting unlock',
          JSON.stringify({
            emailId: email._id,
            errName: err.name,
            errMessage: err.message?.slice(0, 200)
          })
        );
        try {
          await pTimeout(
            Emails.findByIdAndUpdate(email._id, {
              $set: { is_locked: false },
              $unset: { locked_by: 1, locked_at: 1 }
            }),
            SAFETY_NET_TIMEOUT_MS
          );
        } catch {}

        try {
          logger.error(err, { email: email._id });
        } catch {}
      }
    }
  } else {
    // Fall back to direct processing (single-threaded)
    try {
      await pTimeout(
        processEmail({ email, resolver, client }),
        PROCESS_EMAIL_TIMEOUT_MS
      );
    } catch (err) {
      if (err instanceof pTimeout.TimeoutError) {
        console.error(
          '[ERROR:send-emails] processEmail timed out (direct)',
          JSON.stringify({
            emailId: email._id,
            timeoutMs: PROCESS_EMAIL_TIMEOUT_MS
          })
        );
        await safetyNetUnlock(email._id, 'timeout_direct');
      } else {
        // Non-timeout error: processEmail threw without saving/unlocking the email.
        // This can happen when bsonOverflowFallbackSave fails inside processEmail's
        // catch block (e.g. "Recipient was missing from error" validation).
        // We MUST unlock the email here to prevent it from being stuck forever.
        console.error(
          '[ERROR:send-emails] processEmail threw, attempting unlock',
          JSON.stringify({
            emailId: email._id,
            errName: err.name,
            errMessage: err.message?.slice(0, 200)
          })
        );
        try {
          await pTimeout(
            Emails.findByIdAndUpdate(email._id, {
              $set: { is_locked: false },
              $unset: { locked_by: 1, locked_at: 1 }
            }),
            SAFETY_NET_TIMEOUT_MS
          );
          console.error(
            '[WARN:send-emails] unlocked email after processEmail error',
            JSON.stringify({ emailId: email._id, errName: err.name })
          );
        } catch (unlockErr) {
          console.error(
            '[ERROR:send-emails] failed to unlock email after processEmail error',
            JSON.stringify({
              emailId: email._id,
              unlockErrName: unlockErr.name,
              unlockErrMessage: unlockErr.message?.slice(0, 200)
            })
          );
        }

        try {
          logger.error(err, { email: email._id });
        } catch {}
      }
    }
  }
}

//
// Hard timeout for the entire sendEmails() function.
// This is a belt-and-suspenders safeguard: if ANY part of sendEmails()
// hangs (pre-fetch cursors, email cursor, or anything else), this
// Promise.race guarantees we return control to startRecursion() so the
// loop never stops. Set to 3 minutes — longer than any individual
// sub-timeout but short enough to recover quickly.
//
const SEND_EMAILS_HARD_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes

//
// Helper: race a promise against a hard timeout using raw setTimeout.
// Unlike p-timeout (which relies on the same event loop scheduling),
// this creates a completely independent timer and resolves via
// Promise.race, ensuring the timeout fires even if the inner promise's
// microtask chain is misbehaving.
//
function hardTimeout(promise, ms, label) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = globalThis.setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error(`[HARD_TIMEOUT] ${label} exceeded ${ms}ms`));
      }
    }, ms);
    // Ensure the timer doesn't keep the process alive
    if (timer.unref) timer.unref();
    promise.then(
      (val) => {
        if (!settled) {
          settled = true;
          globalThis.clearTimeout(timer);
          resolve(val);
        }
      },
      (err) => {
        if (!settled) {
          settled = true;
          globalThis.clearTimeout(timer);
          reject(err);
        }
      }
    );
  });
}

async function sendEmails() {
  // Return early if the job was already cancelled
  if (isCancelled) return;

  //
  // Check queue capacity before fetching more emails
  //
  const currentQueueSize = queue.size + queue.pending;

  // Log queue state every cycle for debugging stuck queue issues
  // TODO: remove debug instrumentation once queue issue is resolved
  console.log(
    '[DEBUG:send-emails] cycle start',
    JSON.stringify({
      queueSize: queue.size,
      queuePending: queue.pending,
      total: currentQueueSize,
      max: config.smtpMaxQueue,
      isCancelled,
      piscinaEnabled
    })
  );

  if (currentQueueSize >= config.smtpMaxQueue) {
    //
    // STALL DETECTION: If the queue has been full for a long time,
    // it likely means tasks are hung. Clear the queue and alert.
    //
    console.error(
      '[WARN:send-emails] queue is full, cannot fetch new emails',
      JSON.stringify({
        queueSize: queue.size,
        queuePending: queue.pending,
        total: currentQueueSize,
        max: config.smtpMaxQueue
      })
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
  // Use .find().lean() with maxTimeMS instead of cursor-based iteration.
  // Cursor-based iteration with for-await-of can hang indefinitely when
  // the MongoDB connection pool is under pressure, and p-timeout cannot
  // reliably interrupt a hanging cursor.next() call. Using .find() with
  // maxTimeMS lets the MongoDB server enforce the timeout at the query
  // level, which is far more reliable than client-side promise racing.
  //
  const PRE_FETCH_TIMEOUT_MS = 30 * 1000; // 30 seconds
  let suspendedDomainIds = [];
  let recentlyBlockedIds = [];

  try {
    const [suspendedDomains, recentlyBlocked] = await hardTimeout(
      Promise.all([
        Domains.find({ is_smtp_suspended: true })
          .select('_id')
          .lean()
          .maxTimeMS(PRE_FETCH_TIMEOUT_MS)
          .exec(),
        Emails.find({
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
          .maxTimeMS(PRE_FETCH_TIMEOUT_MS)
          .exec()
      ]),
      PRE_FETCH_TIMEOUT_MS + 5000, // 5s grace on top of maxTimeMS
      'pre-fetch queries'
    );
    suspendedDomainIds = suspendedDomains.map((d) => d._id);
    recentlyBlockedIds = recentlyBlocked.map((e) => e._id);
  } catch (preFetchErr) {
    // Proceed with empty exclusion lists rather than blocking the entire queue
    console.error(
      '[ERROR:send-emails] pre-fetch queries failed — proceeding with empty exclusion lists',
      JSON.stringify({
        errName: preFetchErr.name,
        errMessage: preFetchErr.message?.slice(0, 300)
      })
    );
  }

  console.log(
    '[DEBUG:send-emails] pre-fetch complete',
    JSON.stringify({
      suspendedDomainCount: suspendedDomainIds.length,
      recentlyBlockedCount: recentlyBlockedIds.length
    })
  );

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

  //
  // Wrap the main email cursor iteration in a timeout to prevent
  // sendEmails() from hanging indefinitely if the cursor stalls.
  // Uses hardTimeout (raw setTimeout + Promise.race) instead of p-timeout
  // to guarantee the timeout fires even if cursor.next() microtasks
  // are blocking p-timeout's internal scheduling.
  //
  const CURSOR_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes
  let emailsFetched = 0;
  try {
    await hardTimeout(
      (async () => {
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

          emailsFetched++;
          // TODO: implement queue on a per-target/provider basis (e.g. 10 at once to Cox addresses)
          //
          // CRITICAL: queue.add() returns a promise that MUST have a .catch()
          // handler. Without it, if processEmailTask throws an error that
          // escapes its internal try/catch (e.g. logger.error itself throws
          // due to BSON overflow), the promise becomes an unhandled rejection.
          // @ladjs/graceful's unhandledRejection handler re-throws it as an
          // uncaughtException, which CRASHES THE ENTIRE PROCESS — orphaning
          // all in-flight locked emails.
          //
          queue
            .add(() => processEmailTask(email), {
              // TODO: if the email was admin owned domain then priority higher (see email pre-save hook)
              // priority: email.priority || 0
            })
            .catch((err) => {
              console.error(
                '[ERROR:send-emails] queue task unhandled rejection (process NOT crashing)',
                JSON.stringify({
                  emailId: email._id,
                  errName: err?.name,
                  errMessage: err?.message?.slice(0, 300)
                })
              );
            });
        }
      })(),
      CURSOR_TIMEOUT_MS,
      'email cursor iteration'
    );
  } catch (cursorErr) {
    console.error(
      '[ERROR:send-emails] email cursor failed',
      JSON.stringify({
        errName: cursorErr.name,
        errMessage: cursorErr.message?.slice(0, 300),
        emailsFetched
      })
    );
  }

  // TODO: remove debug instrumentation once queue issue is resolved
  if (emailsFetched === 0) {
    console.log(
      '[DEBUG:send-emails] no emails fetched this cycle',
      JSON.stringify({
        suspendedDomainCount: suspendedDomainIds.length,
        recentlyBlockedCount: recentlyBlockedIds.length,
        limit
      })
    );
  } else {
    console.log(
      '[DEBUG:send-emails] fetched and queued',
      emailsFetched,
      'emails'
    );
  }

  await setTimeout(5000);
}

(async () => {
  await setupMongoose(logger);

  (async function startRecursion() {
    if (isCancelled) {
      //
      // Graceful shutdown: unlock all emails locked by this server's IP
      // so they can be immediately picked up by another server or the
      // restarted process, instead of waiting for the unlock-emails job.
      //
      try {
        const unlockResult = await Emails.updateMany(
          {
            is_locked: true,
            locked_by: IP_ADDRESS,
            status: { $in: ['queued', 'deferred'] }
          },
          {
            $set: { is_locked: false, status: 'queued' },
            $unset: { locked_by: 1, locked_at: 1 }
          }
        );
        if (unlockResult?.modifiedCount > 0) {
          console.log(
            '[INFO:send-emails] graceful shutdown: unlocked emails locked by this server',
            JSON.stringify({
              ip: IP_ADDRESS,
              modifiedCount: unlockResult.modifiedCount
            })
          );
        }
      } catch (err) {
        console.error(
          '[ERROR:send-emails] graceful shutdown unlock failed',
          err.message
        );
      }

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

    //
    // Wrap the entire sendEmails() call in a hard timeout so the
    // recursion loop NEVER stops, even if sendEmails() hangs on a
    // MongoDB cursor, a logger.info() call, or anything else.
    //
    try {
      await hardTimeout(
        sendEmails(),
        SEND_EMAILS_HARD_TIMEOUT_MS,
        'sendEmails()'
      );
    } catch (err) {
      console.error(
        '[ERROR:send-emails] sendEmails() failed or timed out — restarting cycle',
        JSON.stringify({
          errName: err.name,
          errMessage: err.message?.slice(0, 300)
        })
      );

      emailHelper({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: 'Send emails had an error'
        },
        locals: {
          message: `<pre><code>${encode(
            safeStringify(parseErr(err), null, 2)
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
