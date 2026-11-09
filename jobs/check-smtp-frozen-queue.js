/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort, workerData } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const { createHash } = require('node:crypto');
const { setTimeout } = require('node:timers/promises');
const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const ms = require('ms');

const env = require('#config/env');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const getBlockedHashes = require('#helpers/get-blocked-hashes');
const Emails = require('#models/emails');
const Domains = require('#models/domains');

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

//
// Summarize the ids of the emails a query matches: how many there are, an
// order-independent digest of them and the first few. Two runs with the same
// count and digest matched the same emails. Keeping every id (twice, then
// joining both lists into strings to compare them) held the whole queue in
// memory, and the queue is largest exactly when this check matters.
//
async function summarizeIds(query) {
  let count = 0;
  let sum = 0n;
  let xor = 0n;
  const sampleIds = [];
  // eslint-disable-next-line unicorn/no-array-callback-reference
  for await (const email of Emails.find(query)
    .select('id')
    .lean()
    .cursor()
    .addCursorFlag('noCursorTimeout', true)) {
    count++;
    if (sampleIds.length < 10) sampleIds.push(email.id);
    const hash = createHash('sha256').update(String(email.id)).digest();
    const value = hash.readBigUInt64BE(0);
    sum = BigInt.asUintN(64, sum + value);
    // eslint-disable-next-line no-bitwise
    xor ^= hash.readBigUInt64BE(8);
  }

  return {
    count,
    digest: `${sum.toString(16)}:${xor.toString(16)}`,
    sampleIds
  };
}

async function run() {
  try {
    //
    // NOTE: if you change this then also update `jobs/send-emails` if necessary
    //
    // get list of all suspended domains
    // and recently blocked emails to exclude
    //
    // Optimized to use cursor-based iteration instead of aggregation
    // to avoid MongoDB MaxTimeMSExpired errors on large datasets
    //
    const now = new Date();
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
            $in: getBlockedHashes(env.SMTP_HOST)
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
    // check the unique ids for emails in the queue
    // if the list is still the same after 1 minute
    // then email admins and throw an error
    //

    // NOTE: if you change this then also update `jobs/send-emails` if necessary
    //
    // This monitor intentionally checks only `status: 'queued'` and NOT
    // `deferred`. The send-emails finder includes `deferred` (they are retried),
    // but a deferred email staying deferred across the 1-minute window below is
    // expected, healthy behavior (e.g. a remote MX is temporarily unavailable);
    // counting it here would raise false "queue is frozen" alarms. A genuinely
    // frozen queue manifests as `queued` emails that are eligible to send right
    // now but never leave the queue, which is what we detect here.
    //
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

    //
    // Optimized to use cursor-based iteration instead of aggregation
    // to avoid MongoDB MaxTimeMSExpired errors on large datasets
    //
    const ids = await summarizeIds(query);

    // if no ids then return early
    if (ids.count === 0) {
      logger.info('No ids found');
      return;
    }

    // wait 1 minute
    await setTimeout(ms('1m'));

    // check if ids is the same
    const newIds = await summarizeIds({
      ...query,
      date: {
        $lte: new Date()
      }
    });

    // if no ids then return early
    if (newIds.count === 0) {
      logger.info('No new ids found');
      return;
    }

    if (ids.count === newIds.count && ids.digest === newIds.digest) {
      // TODO: remove debug instrumentation once queue issue is resolved
      console.error(
        '[DEBUG:check-smtp-frozen-queue] queue is frozen',
        JSON.stringify({
          frozenCount: ids.count,
          sampleIds: ids.sampleIds
        })
      );
      const err = new Error('Queue is frozen');
      err.isCodeBug = true; // triggers sms
      throw err;
    }
  } catch (err) {
    await logger.error(err);
    // only send one of these emails every 1 hour
    // (the queue is not checked again until then)
    await setTimeout(ms('1h'));
  }
}

(async () => {
  await setupMongoose(logger);

  for (;;) {
    await run();
    if (!longRunning || !Number.isFinite(interval) || isCancelled) break;
    // (a cancel ends the wait, so bree stops without waiting out the interval)
    await setTimeout(interval, undefined, { signal: cancelled.signal }).catch(
      () => {}
    );
    if (isCancelled) break;
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})().catch(async (err) => {
  // (otherwise the worker keeps running, holding its job slot, until bree
  // restarts)
  await Promise.race([logger.error(err), setTimeout(10_000)]);
  process.exit(1);
});
