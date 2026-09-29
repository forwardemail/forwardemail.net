/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const v8 = require('node:v8');

const ms = require('ms');

//
// Every bree job runs in its own worker thread, and every worker loads the app
// (config, i18n catalogs for every locale, models) before it does anything:
// roughly a quarter of a gigabyte of heap each. Most jobs are declared with
// `timeout: 0`, so on start (and after each crash) all ~50 of them started at
// once, and the frequent ones kept piling more on top. Together that exceeded
// the host's memory, V8 aborted the whole process ("JavaScript heap out of
// memory", "memory allocation of 24 bytes failed"), pm2 restarted it, and the
// same thing happened again a minute and a half later.
//
// This gate caps how many job worker threads exist at the same time. A job
// whose turn comes while the cap is reached waits in a queue (once, however
// many times its schedule fires meanwhile) and starts when a thread has
// exited. The queue is first come, first served, and some slots are kept for
// jobs that run every 15 minutes or more often, so a handful of long hourly
// jobs cannot hold up the minute-by-minute ones (scheduled sends, welcome and
// verification emails) while an hourly job still gets the next free general
// slot however busy the frequent ones are.
//
// A slot is released when the worker thread has exited, not when bree drops
// it: a job that posts "done" is removed right away while its thread (and
// heap) is still being torn down, and counting it as free there would let the
// gate exceed the cap in memory terms.
//

const FREQUENT_INTERVAL = ms('15m');

// a thread that has not exited this long after it was terminated is not
// counted against the cap any more (it cannot be allowed to block every job)
const EXIT_WAIT_MS = ms('1m');

function toMs(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = ms(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return Number.POSITIVE_INFINITY;
}

/**
 * @param {Object} bree - Bree instance
 * @param {Object} [options]
 * @param {number} [options.maxConcurrent] - Worker threads allowed at once
 * @param {number} [options.reservedForFrequent] - Of those, slots only jobs
 *   running every 15 minutes or more often may use
 * @param {Object} [options.logger] - Logger
 * @returns {Object} Gate state (for monitoring and tests)
 */
function createJobGate(bree, options = {}) {
  const maxConcurrent = Math.max(1, Number(options.maxConcurrent) || 10);
  const reservedForFrequent = Math.min(
    maxConcurrent - 1,
    Math.max(0, Number(options.reservedForFrequent ?? 3))
  );
  const { logger } = options;

  // jobs started through the gate whose worker is running (or starting)
  const active = new Set();
  // threads bree has dropped that have not exited yet: token -> job name
  const exiting = new Map();
  // worker of each active job, captured when bree creates it
  const workers = new Map();
  const queued = new Map(); // name -> queued at
  let stopping = false;
  let exitToken = 0;
  const originalRun = bree.run.bind(bree);

  function intervalOf(name) {
    const job = bree.config.jobs.find((j) => j.name === name);
    if (!job) return Number.POSITIVE_INFINITY;
    return toMs(job.interval);
  }

  function isFrequent(name) {
    return intervalOf(name) <= FREQUENT_INTERVAL;
  }

  function used() {
    return active.size + exiting.size;
  }

  function hasSlot(name) {
    if (used() >= maxConcurrent) return false;
    if (isFrequent(name)) return true;
    let slow = 0;
    for (const n of active) if (!isFrequent(n)) slow++;
    for (const n of exiting.values()) if (!isFrequent(n)) slow++;
    return slow < maxConcurrent - reservedForFrequent;
  }

  async function start(name) {
    active.add(name);
    try {
      await originalRun(name);
    } finally {
      // run() returns without a worker when the job is already running or
      // throws before creating one; either way it holds no slot
      if (!bree.workers.has(name) && !workers.has(name)) {
        active.delete(name);
        drain();
      }
    }
  }

  function drain() {
    if (stopping || queued.size === 0) return;
    // first come, first served (Map keeps insertion order); a job that does
    // not fit (a slow job while only reserved slots are free) lets the ones
    // behind it go, and stays at the head for the next free slot
    for (const name of queued.keys()) {
      if (used() >= maxConcurrent) break;
      if (!hasSlot(name)) continue;
      queued.delete(name);
      start(name).catch((err) => logger?.error?.(err, { job: name }));
    }
  }

  bree.run = async function (name) {
    // run() with no name runs every job, each through this gate
    if (!name) {
      for (const job of bree.config.jobs) {
        await bree.run(job.name);
      }

      return;
    }

    // already running or already waiting its turn: nothing to add
    if (active.has(name) || bree.workers.has(name) || queued.has(name)) return;

    if (stopping || !hasSlot(name)) {
      if (!stopping) queued.set(name, Date.now());
      logger?.debug?.('job deferred until a worker slot frees', {
        job: { name },
        active: active.size,
        exiting: exiting.size,
        queued: queued.size
      });
      return;
    }

    return start(name);
  };

  bree.on('worker created', (name) => {
    const worker = bree.workers.get(name);
    if (worker) workers.set(name, worker);
  });

  bree.on('worker deleted', (name) => {
    const worker = workers.get(name);
    workers.delete(name);
    if (!active.delete(name)) return;

    // Node sets threadId to -1 once the thread has exited
    if (worker && worker.threadId !== -1) {
      const token = ++exitToken;
      exiting.set(token, name);
      const timers = [];
      const release = () => {
        for (const timer of timers) clearTimeout(timer);
        if (!exiting.delete(token)) return;
        drain();
      };

      // bree removes its own exit listeners before terminate(), so this one
      // is the only one left and still fires
      worker.once('exit', release);
      const timer = setTimeout(release, EXIT_WAIT_MS);
      if (typeof timer.unref === 'function') timer.unref();
      timers.push(timer);
      return;
    }

    drain();
  });

  // Nothing waiting may start while bree shuts down (graceful stop on deploy
  // or restart): drop the queue and stop draining it until started again.
  const originalStop = bree.stop.bind(bree);
  bree.stop = async function (name) {
    if (name) {
      queued.delete(name);
    } else {
      stopping = true;
      queued.clear();
    }

    return originalStop(name);
  };

  const originalStart = bree.start.bind(bree);
  bree.start = async function (name) {
    if (!name) stopping = false;
    return originalStart(name);
  };

  return {
    active,
    exiting,
    queued,
    maxConcurrent,
    reservedForFrequent
  };
}

/**
 * Record each job worker's exit code. Bree deletes the worker before it emits
 * `worker deleted`, so reading `bree.workers.get(name).exitCode` there always
 * found nothing and failed jobs were logged as completed.
 *
 * @param {Object} bree - Bree instance
 * @returns {Map<string, number>} name -> exit code of the last run
 */
function trackExitCodes(bree) {
  const exitCodes = new Map();
  bree.on('worker created', (name) => {
    exitCodes.delete(name);
    const worker = bree.workers.get(name);
    if (worker)
      worker.once('exit', (code) => {
        exitCodes.set(name, code);
      });
  });
  return exitCodes;
}

/**
 * Cap the heap of every worker thread created after this call.
 *
 * Worker `resourceLimits.maxOldGenerationSizeMb` is ignored on Node 18: the
 * worker keeps the process default heap limit (several gigabytes), so a job
 * that runs away grows until the host is out of memory and V8 aborts the whole
 * process, every other running job with it. V8 reads --max-old-space-size when
 * it creates each isolate, so setting it here applies to every worker created
 * afterwards and leaves this (already created) thread's own limit as it is. A
 * worker that reaches it is stopped with ERR_WORKER_OUT_OF_MEMORY and exits on
 * its own with a non-zero code.
 *
 * Call it before any worker is created. Node documents changing V8 flags
 * after startup as unsupported; this is verified on Node 18 (see the test),
 * so re-check it when upgrading Node.
 *
 * @param {number} mb - Old generation limit in megabytes
 * @returns {number} The limit that was set
 */
function capWorkerHeap(mb) {
  const limit = Number(mb);
  if (!Number.isInteger(limit) || limit <= 0)
    throw new TypeError('Worker heap limit must be a positive integer (MB)');

  v8.setFlagsFromString(`--max-old-space-size=${limit}`);
  return limit;
}

module.exports = {
  createJobGate,
  trackExitCodes,
  capWorkerHeap,
  FREQUENT_INTERVAL
};
