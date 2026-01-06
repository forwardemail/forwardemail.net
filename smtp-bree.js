/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// SMTP Bree Job Scheduler
//
// This module manages email sending throughput using Bree job scheduler.
// The send-emails job handles the actual email processing with optional
// Piscina thread pool support for multi-threaded parallelism.
//
// Configuration (via environment variables):
// - SMTP_PISCINA_ENABLED: Enable/disable Piscina (default: false)
// - SMTP_MAX_THREADS: Maximum worker threads (default: CPU count, max 8)
// - SMTP_MIN_THREADS: Minimum worker threads (default: 1)
// - SMTP_IDLE_TIMEOUT: Worker idle timeout in ms (default: 30000)
//

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const os = require('node:os');
const process = require('node:process');

const Bree = require('bree');
const Graceful = require('@ladjs/graceful');
const mongoose = require('mongoose');
const ms = require('ms');

const env = require('#config/env');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

//
// Piscina Configuration
//
// These settings are passed to the send-emails job via workerData.
// The job creates the Piscina instance in its own process.
//
const cpuCount = os.cpus().length;
const maxThreads = env.SMTP_MAX_THREADS
  ? Number.parseInt(env.SMTP_MAX_THREADS, 10)
  : Math.min(cpuCount, 8);
const minThreads = env.SMTP_MIN_THREADS
  ? Number.parseInt(env.SMTP_MIN_THREADS, 10)
  : 1;
const idleTimeout = env.SMTP_IDLE_TIMEOUT
  ? Number.parseInt(env.SMTP_IDLE_TIMEOUT, 10)
  : ms('30s');

//
// Check if Piscina should be enabled
//
// IMPORTANT: Piscina is disabled by default because:
// 1. Each worker thread loads the full application context (heavy memory usage)
// 2. Each worker needs its own MongoDB connection (connection pool exhaustion)
// 3. The "task queue is at limit" error occurs when queue fills faster than processing
//
// Only enable Piscina if you have:
// - Sufficient memory (each thread uses ~100-200MB)
// - Sufficient MongoDB connection pool capacity
// - Properly tuned SMTP_MAX_THREADS for your workload
//
const piscinaEnabled =
  env.SMTP_PISCINA_ENABLED === 'true' || env.SMTP_PISCINA_ENABLED === true;

logger.info(
  `SMTP bree starting (Piscina: ${
    piscinaEnabled ? 'enabled' : 'disabled'
  }, threads: ${minThreads}-${maxThreads}, CPUs: ${cpuCount})`,
  { hide_meta: true }
);

// SMTP Bree job configuration
const smtpJobs = [
  {
    //
    // This is a long running job, but we attempt to restart it
    // every 30s in case errors (e.g. uncaught exception edge case causes `process.exit()`)
    // This job is recursive and calls its main function to keep itself running (and sending emails)
    // (for putting emails back into queue that are frozen or need to be retried, see jobs/unlock-emails)
    //
    name: 'send-emails',
    interval: '30s',
    timeout: 0,
    //
    // Pass Piscina configuration to the job via workerData
    // The job will use this to determine whether to use Piscina
    // or fall back to single-threaded PQueue processing
    //
    worker: {
      workerData: {
        piscinaEnabled,
        maxThreads,
        minThreads,
        idleTimeout
      }
    }
  },
  {
    // This is a long running job as well
    // (with setTimeout upon completion)
    // (so it never exits, but this is just in case it does)
    // Time to inbox monitoring
    name: 'tti',
    interval: '10m',
    timeout: 0
  }
];

const bree = new Bree({
  logger,
  jobs: smtpJobs
});

// Track job start times for duration calculation
const jobStartTimes = new Map();

// Get job configuration by name
function getJobConfig(name) {
  const job = smtpJobs.find((j) => j.name === name);
  return job || { name };
}

// Log job lifecycle events with ignore_hook: false to store in Logs collection
bree.on('worker created', async (name) => {
  const startTime = Date.now();
  jobStartTimes.set(name, startTime);
  const jobConfig = getJobConfig(name);

  await logger.info('job:start', {
    ignore_hook: false,
    job: {
      name,
      breeInstance: 'smtp-bree',
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
  const worker = bree.workers.get(name);
  const hasError = worker && worker.exitCode && worker.exitCode !== 0;

  if (hasError) {
    await logger.error('job:error', {
      ignore_hook: false,
      job: {
        name,
        breeInstance: 'smtp-bree',
        startedAt: startTime ? new Date(startTime).toISOString() : null,
        finishedAt: new Date(endTime).toISOString(),
        duration,
        exitCode: worker.exitCode,
        interval: jobConfig.interval,
        cron: jobConfig.cron,
        timeout: jobConfig.timeout
      },
      err: {
        message: `Job exited with code ${worker.exitCode}`,
        code: worker.exitCode
      }
    });
  } else {
    await logger.info('job:complete', {
      ignore_hook: false,
      job: {
        name,
        breeInstance: 'smtp-bree',
        startedAt: startTime ? new Date(startTime).toISOString() : null,
        finishedAt: new Date(endTime).toISOString(),
        duration,
        exitCode: worker ? worker.exitCode : 0,
        interval: jobConfig.interval,
        cron: jobConfig.cron,
        timeout: jobConfig.timeout
      }
    });
  }

  jobStartTimes.delete(name);
});

//
// Graceful shutdown handling
//
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
  } catch (err) {
    await logger.error(err);

    process.exit(1);
  }
})();

logger.info('SMTP bree started', { hide_meta: true });
