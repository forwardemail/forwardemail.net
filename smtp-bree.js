/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// SMTP Bree Job Scheduler with Piscina Thread Pool
//
// This module manages email sending throughput using a combination of:
// 1. Bree job scheduler - Coordinates the send-emails job
// 2. Piscina thread pool - Provides true multi-threaded parallelism
//
// The Piscina thread pool allows email processing to utilize all available
// CPU cores, significantly increasing throughput compared to single-threaded
// processing with PQueue alone.
//
// Configuration (via environment variables):
// - SMTP_PISCINA_ENABLED: Enable/disable Piscina (default: true in production)
// - SMTP_MAX_THREADS: Maximum worker threads (default: CPU count, max 8)
// - SMTP_MIN_THREADS: Minimum worker threads (default: 1)
// - SMTP_IDLE_TIMEOUT: Worker idle timeout in ms (default: 30000)
//

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const os = require('node:os');
const path = require('node:path');

const Bree = require('bree');
const Graceful = require('@ladjs/graceful');
const Piscina = require('piscina');
const ms = require('ms');

const config = require('#config');
const env = require('#config/env');
const logger = require('#helpers/logger');

//
// Piscina Configuration
//
// Thread pool settings optimized for email processing workloads.
// Email sending is I/O-bound (network), so we can use more threads
// than CPU cores to maximize throughput.
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

// Check if Piscina should be enabled
// Default to true in production, false in test/development for easier debugging
const piscinaEnabled =
  env.SMTP_PISCINA_ENABLED === undefined
    ? config.env === 'production'
    : env.SMTP_PISCINA_ENABLED === 'true' || env.SMTP_PISCINA_ENABLED === true;

logger.info(
  `SMTP bree starting (Piscina: ${
    piscinaEnabled ? 'enabled' : 'disabled'
  }, threads: ${minThreads}-${maxThreads}, CPUs: ${cpuCount})`,
  { hide_meta: true }
);

//
// Create Piscina thread pool for email processing
//
// The thread pool is created at module load time and shared across
// all job invocations. This avoids the overhead of creating new
// threads for each batch of emails.
//
let piscina = null;

if (piscinaEnabled) {
  piscina = new Piscina({
    filename: path.resolve(__dirname, 'helpers', 'smtp-worker.js'),
    // maxQueue: 'auto' sets queue size to maxThreads^2
    // This provides backpressure when the pool is saturated
    maxQueue: 'auto',
    idleTimeout,
    minThreads,
    maxThreads
  });

  logger.info(
    `Piscina thread pool created (min: ${minThreads}, max: ${maxThreads}, idleTimeout: ${idleTimeout}ms)`,
    { hide_meta: true }
  );
}

const bree = new Bree({
  logger,
  jobs: [
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
          minThreads
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
  ]
});

//
// Graceful shutdown handling
//
// Ensures both Bree and Piscina are properly shut down when the
// process receives a termination signal.
//
const graceful = new Graceful({
  brees: [bree],
  logger,
  customHandlers: piscina
    ? [
        async () => {
          logger.info('Shutting down Piscina thread pool...', {
            hide_meta: true
          });
          await piscina.destroy();
          logger.info('Piscina thread pool destroyed', { hide_meta: true });
        }
      ]
    : []
});

graceful.listen();

//
// Export piscina for use by send-emails job
//
// The send-emails job imports this module to access the shared
// Piscina instance, avoiding the need to create a new thread pool
// for each job invocation.
//
module.exports = { piscina, piscinaEnabled };

(async () => {
  await bree.start();
})();

logger.info('SMTP bree started', { hide_meta: true });
