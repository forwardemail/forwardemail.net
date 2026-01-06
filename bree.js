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

const Bree = require('bree');
const Graceful = require('@ladjs/graceful');
const mongoose = require('mongoose');

const jobs = require('./jobs');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const bree = new Bree({ logger });

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

  await logger.info('job:start', {
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
  const worker = bree.workers.get(name);
  const hasError = worker && worker.exitCode && worker.exitCode !== 0;

  if (hasError) {
    await logger.error('job:error', {
      ignore_hook: false,
      job: {
        name,
        breeInstance: 'bree',
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
        breeInstance: 'bree',
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

logger.info('Lad bree started', { hide_meta: true });
