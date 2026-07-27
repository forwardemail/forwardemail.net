/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Incremental analytics summary repair.
 *
 * Bree runs this immediately and periodically, and operators can safely run:
 *   node scripts/backfill-analytics.js
 *   node scripts/backfill-analytics.js --force
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
const AnalyticsSummary = require('#models/analytics-summary');
const setupMongoose = require('#helpers/setup-mongoose');

const DEFAULT_DAYS = 30;
let isCancelled = false;

if (parentPort)
  parentPort.once('message', (message) => {
    if (message === 'cancel') isCancelled = true;
  });

function getRepairRange() {
  const days = Math.max(
    1,
    Math.min(
      365,
      Number.parseInt(process.env.ANALYTICS_BACKFILL_DAYS, 10) || DEFAULT_DAYS
    )
  );
  const end = dayjs().subtract(3, 'hours').startOf('hour');
  return {
    start: end.subtract(days, 'days').startOf('hour'),
    end
  };
}

async function getPendingHours(start, end, force) {
  const completeHours = force
    ? []
    : await AnalyticsSummary.distinct('hour', {
        hour: { $gte: start.toDate(), $lte: end.toDate() },
        dimension: AnalyticsSummary.HOUR_MANIFEST_DIMENSION,
        value: AnalyticsSummary.HOUR_MANIFEST_VALUE,
        schema_version: AnalyticsSummary.CURRENT_SCHEMA_VERSION,
        is_complete: true
      });
  const complete = new Set(
    completeHours.map((hour) => dayjs(hour).startOf('hour').valueOf())
  );
  const pending = [];

  let current = start;
  while (current.isBefore(end) || current.isSame(end)) {
    if (!complete.has(current.valueOf())) pending.push(current.toDate());
    current = current.add(1, 'hour');
  }

  // Repair newest hours first so common 24-hour and 7-day dashboards become
  // complete quickly after a fresh deployment or schema migration.
  return pending.reverse();
}

/**
 * Repair missing or outdated hourly generations in the dashboard range.
 *
 * @param {Object} [options] Repair options.
 * @param {boolean} [options.force] Rebuild already current hours too.
 * @returns {Promise<Object>} Repair totals.
 */
async function main(options = {}) {
  const graceful = new Graceful({ mongooses: [mongoose], logger });
  graceful.listen();
  await setupMongoose(logger);

  const force =
    options.force === true || process.argv.slice(2).includes('--force');
  const { start, end } = getRepairRange();
  const pendingHours = await getPendingHours(start, end, force);

  logger.info('Starting analytics summary repair', {
    from: start.toISOString(),
    to: end.toISOString(),
    pendingHours: pendingHours.length,
    force
  });

  let processedHours = 0;
  let totalEvents = 0;
  let totalSignups = 0;
  let totalSummaries = 0;
  const failures = [];

  for (const hour of pendingHours) {
    if (isCancelled) break;

    try {
      const result = await aggregateAnalyticsHour(hour, {
        isCancelled() {
          return isCancelled;
        }
      });
      if (result.cancelled) break;

      processedHours++;
      totalEvents += result.processed;
      totalSignups += result.signups;
      totalSummaries += result.summaries;

      if (processedHours % 24 === 0) {
        logger.info('Analytics summary repair progress', {
          processedHours,
          pendingHours: pendingHours.length,
          events: totalEvents,
          signups: totalSignups,
          summaries: totalSummaries
        });
      }
    } catch (err) {
      failures.push({ hour, err });
      logger.error('Error repairing analytics hour', {
        hour: hour.toISOString(),
        err
      });
    }
  }

  if (failures.length > 0) {
    throw new AggregateError(
      failures.map(({ err }) => err),
      `Failed to repair ${failures.length} analytics hour(s)`
    );
  }

  if (!isCancelled) {
    await AnalyticsSummary.deleteMany({
      hour: { $gte: start.toDate(), $lte: end.toDate() },
      schema_version: { $ne: AnalyticsSummary.CURRENT_SCHEMA_VERSION },
      $or: [{ aggregation_id: { $exists: false } }, { aggregation_id: null }]
    });
  }

  const totals = {
    cancelled: isCancelled,
    processedHours,
    pendingHours: pendingHours.length,
    events: totalEvents,
    signups: totalSignups,
    summaries: totalSummaries
  };
  logger.info('Analytics summary repair completed', totals);
  return totals;
}

if (require.main === module) {
  main()
    .then(() => {
      if (parentPort) parentPort.postMessage('done');
      else process.exit(0);
    })
    .catch(async (err) => {
      await logger.error('Analytics summary repair failed', { err });
      if (parentPort) throw err;
      else process.exit(1);
    });
}

module.exports = { getPendingHours, getRepairRange, main };
