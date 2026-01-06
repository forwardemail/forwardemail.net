/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

const Bree = require('bree');
const Graceful = require('@ladjs/graceful');

const logger = require('#helpers/logger');

// SQLite Bree job configuration
const sqliteJobs = [
  {
    //
    // this job cleans up any backup artifacts from 4 hr+ ago for 'rekey' and 'backup' sqlite-server cases
    // (e.g. the server stopped mid-backup or an error occurred, e.g. ran out of memory)
    // and in an attempt to save on disk stoarge, we will run `fs.unlink` on each of these files
    // and it also updates the storage size across all aliases found
    //
    name: 'cleanup-sqlite',
    interval: '1h',
    timeout: 0
  },
  {
    name: 'cleanup-r2-backups',
    timeout: 0,
    interval: '1d'
  }
];

const bree = new Bree({
  logger,
  jobs: sqliteJobs
});

// Track job start times for duration calculation
const jobStartTimes = new Map();

// Get job configuration by name
function getJobConfig(name) {
  const job = sqliteJobs.find((j) => j.name === name);
  return job || { name };
}

// Log job lifecycle events with ignore_hook: false to store in Logs collection
bree.on('worker created', (name) => {
  const startTime = Date.now();
  jobStartTimes.set(name, startTime);
  const jobConfig = getJobConfig(name);

  logger.info('job:start', {
    ignore_hook: false,
    job: {
      name,
      breeInstance: 'sqlite-bree',
      startedAt: new Date(startTime).toISOString(),
      interval: jobConfig.interval,
      cron: jobConfig.cron,
      timeout: jobConfig.timeout
    }
  });
});

bree.on('worker deleted', (name) => {
  const startTime = jobStartTimes.get(name);
  const endTime = Date.now();
  const duration = startTime ? endTime - startTime : null;
  const jobConfig = getJobConfig(name);

  // Get worker to check for errors
  const worker = bree.workers.get(name);
  const hasError = worker && worker.exitCode && worker.exitCode !== 0;

  if (hasError) {
    logger.error('job:error', {
      ignore_hook: false,
      job: {
        name,
        breeInstance: 'sqlite-bree',
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
    logger.info('job:complete', {
      ignore_hook: false,
      job: {
        name,
        breeInstance: 'sqlite-bree',
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

const graceful = new Graceful({
  brees: [bree],
  logger
});
graceful.listen();

(async () => {
  try {
    await bree.start();
  } catch (err) {
    await logger.fatal(err);

    process.exit(1);
  }
})();

logger.info('SQLite bree started', { hide_meta: true });
