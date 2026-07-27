/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');

const aggregateAnalyticsHour = require('#helpers/aggregate-analytics-hour');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

let isCancelled = false;

if (parentPort)
  parentPort.once('message', (message) => {
    if (message === 'cancel') isCancelled = true;
  });

/**
 * Aggregate and publish one hour using the shared job/backfill implementation.
 *
 * @param {Date} hourStart Start of the hour.
 * @returns {Promise<Object>} Aggregation result.
 */
async function aggregateHour(hourStart) {
  if (isCancelled) return { cancelled: true, processed: 0 };

  const result = await aggregateAnalyticsHour(hourStart, {
    isCancelled() {
      return isCancelled;
    }
  });

  if (!result.cancelled) {
    logger.info('Completed analytics aggregation', {
      hour: hourStart.toISOString(),
      events: result.processed,
      signups: result.signups,
      summaries: result.summaries
    });
  }

  return result;
}

/**
 * Aggregate the current and two preceding hours to repair late-arriving data.
 */
async function main() {
  const graceful = new Graceful({ mongooses: [mongoose], logger });
  graceful.listen();
  await setupMongoose(logger);

  const now = dayjs();
  const hoursToAggregate = [
    now.subtract(2, 'hours').startOf('hour').toDate(),
    now.subtract(1, 'hour').startOf('hour').toDate(),
    now.startOf('hour').toDate()
  ];
  const failures = [];

  for (const hour of hoursToAggregate) {
    if (isCancelled) break;
    try {
      await aggregateHour(hour);
    } catch (err) {
      failures.push({ hour, err });
      logger.error('Error aggregating analytics hour', {
        hour: hour.toISOString(),
        err
      });
    }
  }

  if (failures.length > 0) {
    throw new AggregateError(
      failures.map(({ err }) => err),
      `Failed to aggregate ${failures.length} analytics hour(s)`
    );
  }

  logger.info('Analytics aggregation job completed');
}

if (require.main === module) {
  main()
    .then(() => {
      if (parentPort) parentPort.postMessage('done');
      else process.exit(0);
    })
    .catch(async (err) => {
      await logger.error('Analytics aggregation job failed', { err });
      if (parentPort) throw err;
      else process.exit(1);
    });
}

module.exports = { aggregateHour, main };
