/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const os = require('node:os');
const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const { setTimeout } = require('node:timers/promises');
const Bree = require('bree');
const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const mongoose = require('mongoose');
const sharedConfig = require('@ladjs/shared-config');

const jobs = require('./jobs');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const {
  capWorkerHeap,
  createJobGate,
  trackExitCodes
} = require('#helpers/bree-job-gate');
const {
  catchUp,
  recordCompletion,
  trackStopped
} = require('#helpers/bree-catch-up');
const { scheduleJobs } = require('#helpers/bree-schedule');

function positiveInt(value, fallback) {
  const number = Number.parseInt(value, 10);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

// (0 is allowed: it turns the setting off)
function nonNegativeInt(value, fallback) {
  const number = Number.parseInt(value, 10);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

const MB = 1024 * 1024;
const totalMemoryMb = Math.floor(os.totalmem() / MB);
const cpus = Math.max(1, os.cpus().length);

//
// Run the job threads at a lower CPU priority than the rest of the host, so
// SSH, pm2 and the kernel's own work still get the CPU while jobs keep every
// core busy. Threads take the priority of the thread that creates them, and
// every job worker is created by this one, after this line.
//
try {
  os.setPriority(nonNegativeInt(process.env.BREE_NICE, 10));
} catch (err) {
  logger.warn('could not lower the bree process priority', { err });
}

// each job at a fixed time of day, spread out (see helpers/bree-schedule.js)
const scheduledJobs = scheduleJobs(jobs);

//
// Cap each job worker's heap. Without a cap a worker that runs away grows
// until the host is out of memory and V8 aborts the whole bree process (every
// other running job with it); with one, only that worker is stopped
// (ERR_WORKER_OUT_OF_MEMORY) and it is reported as a failed run.
//
// Node 18 ignores `resourceLimits` for worker threads, so the cap is set with
// the V8 flag (see helpers/bree-job-gate.js), before any worker exists. The
// `resourceLimits` below applies the same cap on Node versions that honor it.
//
// (by default a quarter of the host's memory, between 2 and 8 GB: with up to
// ten workers at once the old 10 GB default allowed several times the host's
// RAM, and the memory guard below holds back or stops jobs when it runs low)
const workerHeapMb = capWorkerHeap(
  positiveInt(
    process.env.BREE_WORKER_MAX_OLD_SPACE_MB,
    Math.min(8192, Math.max(2048, Math.floor(totalMemoryMb / 4)))
  )
);

const bree = new Bree({
  logger,
  jobs: scheduledJobs,
  worker: {
    resourceLimits: {
      maxOldGenerationSizeMb: workerHeapMb
    }
  }
});

//
// Cap how many job workers run at once (see helpers/bree-job-gate.js): each
// one loads the app first, about a quarter of a gigabyte, and ~50 jobs start
// together on boot, which ran the host out of memory in a restart loop.
//
// (by default one long job per core, at least four since most of them wait on
// MongoDB, Redis or DNS more than they use a core, plus the three slots kept
// for frequent jobs; at most 10)
const reservedForFrequent = 3;
const gate = createJobGate(bree, {
  maxConcurrent: positiveInt(
    process.env.BREE_MAX_CONCURRENT_JOBS,
    Math.min(10, Math.max(4, cpus) + reservedForFrequent)
  ),
  reservedForFrequent,
  // the host has no swap: hold back long jobs below 15% of memory (at least
  // 2 GB) available, and stop the longest running one below 7% (at least 1 GB)
  // (0 turns either off)
  memory: {
    pauseBelow:
      nonNegativeInt(
        process.env.BREE_PAUSE_BELOW_MB,
        Math.max(2048, Math.floor(totalMemoryMb * 0.15))
      ) * MB,
    stopBelow:
      nonNegativeInt(
        process.env.BREE_STOP_BELOW_MB,
        Math.max(1024, Math.floor(totalMemoryMb * 0.07))
      ) * MB
  },
  logger
});

// exit code of each job's last run (bree removes the worker before
// "worker deleted", so it cannot be read from there)
const exitCodes = trackExitCodes(bree);

// jobs a stop (a deploy or restart) cut short, which catch-up runs again
const wasStopped = trackStopped(bree);

logger.info('bree job concurrency', {
  hide_meta: true,
  maxConcurrent: gate.maxConcurrent,
  reservedForFrequent: gate.reservedForFrequent,
  workerHeapMb
});

// when each job last finished (to run again on start what a restart cut short)
const client = new Redis(sharedConfig('BREE').redis, logger);

// Track job start times for duration calculation
const jobStartTimes = new Map();

// Get job configuration by name
function getJobConfig(name) {
  const job = scheduledJobs.find((j) =>
    typeof j === 'string' ? j === name : j.name === name
  );
  if (!job) return {};
  if (typeof job === 'string') return { name: job };
  return job;
}

// Log job lifecycle events with ignore_hook: false to store in Logs collection
bree.on('worker created', async (name) => {
  const startTime = Date.now();
  jobStartTimes.set(name, startTime);
  const jobConfig = getJobConfig(name);

  logger.info('job:start', {
    ignore_hook: false,
    job: {
      name,
      breeInstance: 'bree',
      startedAt: new Date(startTime).toISOString(),
      interval: jobConfig.everyMs ?? jobConfig.interval,
      offset: jobConfig.offsetMs,
      cron: jobConfig.cron,
      timeout: jobConfig.timeout
    }
  });
});

bree.on('worker deleted', async (name) => {
  const startTime = jobStartTimes.get(name);
  const endTime = Date.now();
  const duration = startTime ? endTime - startTime : null;
  const jobConfig = getJobConfig(name);

  // Get worker to check for errors
  const exitCode = exitCodes.has(name) ? exitCodes.get(name) : 0;
  exitCodes.delete(name);
  const hasError = Number.isFinite(exitCode) && exitCode !== 0;
  const stoppedEarly = wasStopped(name);

  if (hasError) {
    logger.error('job:error', {
      ignore_hook: false,
      job: {
        name,
        breeInstance: 'bree',
        startedAt: startTime ? new Date(startTime).toISOString() : null,
        finishedAt: new Date(endTime).toISOString(),
        duration,
        exitCode,
        interval: jobConfig.everyMs ?? jobConfig.interval,
        offset: jobConfig.offsetMs,
        cron: jobConfig.cron,
        timeout: jobConfig.timeout
      },
      err: {
        message: `Job exited with code ${exitCode}`,
        code: exitCode
      }
    });
  } else {
    // (a run a stop cut short ends the same way, but is not complete)
    if (!stoppedEarly)
      recordCompletion(client, name).catch((err) =>
        logger.error(err, { job: { name } })
      );
    logger.info('job:complete', {
      ignore_hook: false,
      job: {
        name,
        breeInstance: 'bree',
        startedAt: startTime ? new Date(startTime).toISOString() : null,
        finishedAt: new Date(endTime).toISOString(),
        duration,
        exitCode,
        stoppedEarly,
        interval: jobConfig.everyMs ?? jobConfig.interval,
        offset: jobConfig.offsetMs,
        cron: jobConfig.cron,
        timeout: jobConfig.timeout
      }
    });
  }

  jobStartTimes.delete(name);
});

const graceful = new Graceful({
  brees: [bree],
  mongooses: [mongoose],
  redisClients: [client],
  logger
});
graceful.listen();

(async () => {
  try {
    await bree.start();
    await setupMongoose(logger);
    // (not awaited for long: a Redis outage must not stop bree from starting)
    catchUp(bree, client, scheduledJobs, { logger }).catch((err) =>
      logger.error(err)
    );
    if (process.send) process.send('ready');
  } catch (err) {
    // Use timeout to prevent hanging if MongoDB pool is exhausted
    await Promise.race([logger.error(err), setTimeout(5000)]);
    process.exit(1);
  }
})();

logger.info('Lad bree started', { hide_meta: true });
