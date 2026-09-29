/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

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
const mongoose = require('mongoose');

const jobs = require('./jobs');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const {
  capWorkerHeap,
  createJobGate,
  trackExitCodes
} = require('#helpers/bree-job-gate');

function positiveInt(value, fallback) {
  const number = Number.parseInt(value, 10);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

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
const workerHeapMb = capWorkerHeap(
  positiveInt(process.env.BREE_WORKER_MAX_OLD_SPACE_MB, 10_240)
);

const bree = new Bree({
  logger,
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
const gate = createJobGate(bree, {
  maxConcurrent: positiveInt(process.env.BREE_MAX_CONCURRENT_JOBS, 10),
  reservedForFrequent: 3,
  logger
});

// exit code of each job's last run (bree removes the worker before
// "worker deleted", so it cannot be read from there)
const exitCodes = trackExitCodes(bree);

logger.info('bree job concurrency', {
  hide_meta: true,
  maxConcurrent: gate.maxConcurrent,
  reservedForFrequent: gate.reservedForFrequent,
  workerHeapMb
});

// Track job start times for duration calculation
const jobStartTimes = new Map();

// Get job configuration by name
function getJobConfig(name) {
  const job = jobs.find((j) =>
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
      interval: jobConfig.interval,
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
        interval: jobConfig.interval,
        cron: jobConfig.cron,
        timeout: jobConfig.timeout
      },
      err: {
        message: `Job exited with code ${exitCode}`,
        code: exitCode
      }
    });
  } else {
    logger.info('job:complete', {
      ignore_hook: false,
      job: {
        name,
        breeInstance: 'bree',
        startedAt: startTime ? new Date(startTime).toISOString() : null,
        finishedAt: new Date(endTime).toISOString(),
        duration,
        exitCode,
        interval: jobConfig.interval,
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
  logger
});
graceful.listen();

(async () => {
  try {
    await bree.start();
    await setupMongoose(logger);
    if (process.send) process.send('ready');
  } catch (err) {
    // Use timeout to prevent hanging if MongoDB pool is exhausted
    await Promise.race([logger.error(err), setTimeout(5000)]);
    process.exit(1);
  }
})();

logger.info('Lad bree started', { hide_meta: true });
