/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const os = require('node:os');
const process = require('node:process');
const { randomUUID } = require('node:crypto');
const { setTimeout } = require('node:timers/promises');

const ms = require('ms');

const config = require('#config');
const logger = require('#helpers/logger');

//
// Exactly one sqlite-worker may run fleet-wide (helpers/sqlite-worker-config.js
// explains why).  Two of them would run the same rekey job at once -- each
// builds, verifies and swaps the rekeyed copy at the same path -- and the
// recovery pass of one would re-queue the jobs the other is running.
//
// This lease enforces that against operator mistakes (a second pm2 instance,
// a scaled container): a starting worker waits until the previous one has
// released the lease (graceful stop) or its lease has expired (SIGKILL), and
// a running worker that can no longer hold the lease stops itself.
//
const LEASE_KEY = `sqlite_worker_lease:${config.env}`;
const LEASE_TTL = ms('60s');
const LEASE_REFRESH_INTERVAL = ms('15s');
const WORKER_ID = `${os.hostname()}:${process.pid}:${randomUUID()}`;

// renew or release only while the lease is still ours (compare-and-set)
const RENEW_SCRIPT =
  "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('pexpire', KEYS[1], ARGV[2]) else return 0 end";
const RELEASE_SCRIPT =
  "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";

async function tryAcquire(client, workerId) {
  return Boolean(await client.set(LEASE_KEY, workerId, 'PX', LEASE_TTL, 'NX'));
}

//
// Wait until the lease is ours.  Resolves with `true` once acquired, or with
// `false` when `isCancelled()` became true while waiting.
//
async function acquireWorkerLease(
  client,
  { workerId = WORKER_ID, isCancelled = () => false, interval = ms('5s') } = {}
) {
  let warnedAt = 0;
  let erroredAt = 0;
  while (!isCancelled()) {
    try {
      if (await tryAcquire(client, workerId)) return true;

      if (Date.now() - warnedAt > ms('1m')) {
        warnedAt = Date.now();
        logger.warn(
          'Another sqlite-worker holds the worker lease, waiting for it to stop',
          { holder: await client.get(LEASE_KEY).catch(() => null) }
        );
      }
    } catch (err) {
      // Redis is unavailable: keep trying, but do not flood the logs
      if (Date.now() - erroredAt > ms('1m')) {
        erroredAt = Date.now();
        logger.error(err);
      }
    }

    await setTimeout(interval);
  }

  return false;
}

//
// Extend the lease.  Resolves with `true` when it is (still) ours, `false`
// when another worker holds it now.  A lease that vanished (Redis was
// restarted or flushed) is simply taken again.
//
async function renewWorkerLease(client, { workerId = WORKER_ID } = {}) {
  const renewed = await client.eval(
    RENEW_SCRIPT,
    1,
    LEASE_KEY,
    workerId,
    LEASE_TTL
  );
  if (renewed) return true;
  return tryAcquire(client, workerId);
}

async function releaseWorkerLease(client, { workerId = WORKER_ID } = {}) {
  return Boolean(await client.eval(RELEASE_SCRIPT, 1, LEASE_KEY, workerId));
}

//
// Keep the lease alive in the background.  `onLost(reason)` is called once
// when another worker took the lease over, or when Redis could not confirm
// the lease for longer than its TTL (by then another worker may hold it).
// Returns a function that stops the renewal.
//
function startWorkerLeaseRenewal(
  client,
  onLost,
  {
    workerId = WORKER_ID,
    interval = LEASE_REFRESH_INTERVAL,
    ttl = LEASE_TTL
  } = {}
) {
  let confirmedAt = Date.now();
  let lost = false;
  let timer;

  const stop = () => {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  };

  const lose = (reason) => {
    if (lost) return;
    lost = true;
    stop();
    onLost(reason);
  };

  timer = setInterval(async () => {
    try {
      if (await renewWorkerLease(client, { workerId })) {
        confirmedAt = Date.now();
        return;
      }

      lose('another sqlite-worker took the worker lease over');
    } catch (err) {
      logger.error(err);
      if (Date.now() - confirmedAt > ttl)
        lose('the worker lease could not be renewed before it expired');
    }
  }, interval);
  timer.unref();

  return stop;
}

module.exports = {
  LEASE_KEY,
  LEASE_REFRESH_INTERVAL,
  LEASE_TTL,
  WORKER_ID,
  acquireWorkerLease,
  releaseWorkerLease,
  renewWorkerLease,
  startWorkerLeaseRenewal
};
