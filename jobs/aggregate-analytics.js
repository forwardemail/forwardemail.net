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
const pMap = require('p-map');

const AnalyticsEvents = require('#models/analytics-events');
const AnalyticsSummary = require('#models/analytics-summary');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

/**
 * Aggregate analytics events for a specific hour
 * @param {Date} hourStart - Start of the hour to aggregate
 */
async function aggregateHour(hourStart) {
  const hourEnd = dayjs(hourStart).add(1, 'hour').toDate();

  logger.info('Aggregating analytics for hour', {
    hourStart: hourStart.toISOString(),
    hourEnd: hourEnd.toISOString()
  });

  const match = {
    created_at: { $gte: hourStart, $lt: hourEnd }
  };

  // Check if there are any events for this hour
  const eventCount = await AnalyticsEvents.countDocuments(match);
  if (eventCount === 0) {
    logger.info('No events found for hour', {
      hourStart: hourStart.toISOString()
    });
    return;
  }

  logger.info(`Found ${eventCount} events to aggregate`);

  // Aggregate by service
  const serviceAggregation = await AnalyticsEvents.aggregate(
    [
      { $match: match },
      {
        $group: {
          _id: '$service',
          event_count: { $sum: 1 },
          successful_events: {
            $sum: { $cond: [{ $eq: ['$success', true] }, 1, 0] }
          },
          failed_events: {
            $sum: { $cond: [{ $eq: ['$success', false] }, 1, 0] }
          },
          sessions: { $addToSet: '$session_hash' }
        }
      }
    ],
    { allowDiskUse: true }
  );

  // Save service summaries
  await pMap(
    serviceAggregation,
    async (agg) => {
      await AnalyticsSummary.upsertSummary(
        hourStart,
        { service: agg._id },
        {
          event_count: agg.event_count,
          unique_visitors: agg.sessions.length,
          successful_events: agg.successful_events,
          failed_events: agg.failed_events
        }
      );
    },
    { concurrency: 5 }
  );

  // Aggregate by browser
  const browserAggregation = await AnalyticsEvents.aggregate(
    [
      { $match: { ...match, browser: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$browser',
          event_count: { $sum: 1 },
          sessions: { $addToSet: '$session_hash' }
        }
      },
      { $sort: { event_count: -1 } },
      { $limit: 50 }
    ],
    { allowDiskUse: true }
  );

  await pMap(
    browserAggregation,
    async (agg) => {
      await AnalyticsSummary.upsertSummary(
        hourStart,
        { browser: agg._id },
        {
          event_count: agg.event_count,
          unique_visitors: agg.sessions.length
        }
      );
    },
    { concurrency: 5 }
  );

  // Aggregate by OS
  const osAggregation = await AnalyticsEvents.aggregate(
    [
      { $match: { ...match, os: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$os',
          event_count: { $sum: 1 },
          sessions: { $addToSet: '$session_hash' }
        }
      },
      { $sort: { event_count: -1 } },
      { $limit: 50 }
    ],
    { allowDiskUse: true }
  );

  await pMap(
    osAggregation,
    async (agg) => {
      await AnalyticsSummary.upsertSummary(
        hourStart,
        { os: agg._id },
        {
          event_count: agg.event_count,
          unique_visitors: agg.sessions.length
        }
      );
    },
    { concurrency: 5 }
  );

  // Aggregate by device type
  const deviceAggregation = await AnalyticsEvents.aggregate(
    [
      { $match: match },
      {
        $group: {
          _id: '$device_type',
          event_count: { $sum: 1 },
          sessions: { $addToSet: '$session_hash' }
        }
      }
    ],
    { allowDiskUse: true }
  );

  await pMap(
    deviceAggregation,
    async (agg) => {
      await AnalyticsSummary.upsertSummary(
        hourStart,
        { device_type: agg._id || 'unknown' },
        {
          event_count: agg.event_count,
          unique_visitors: agg.sessions.length
        }
      );
    },
    { concurrency: 5 }
  );

  // Aggregate by client app
  const clientAppAggregation = await AnalyticsEvents.aggregate(
    [
      { $match: { ...match, client_app: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$client_app',
          event_count: { $sum: 1 },
          sessions: { $addToSet: '$session_hash' }
        }
      },
      { $sort: { event_count: -1 } },
      { $limit: 50 }
    ],
    { allowDiskUse: true }
  );

  await pMap(
    clientAppAggregation,
    async (agg) => {
      await AnalyticsSummary.upsertSummary(
        hourStart,
        { client_app: agg._id },
        {
          event_count: agg.event_count,
          unique_visitors: agg.sessions.length
        }
      );
    },
    { concurrency: 5 }
  );

  // Aggregate by referrer
  const referrerAggregation = await AnalyticsEvents.aggregate(
    [
      { $match: { ...match, referrer: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: { referrer: '$referrer', source: '$referrer_source' },
          event_count: { $sum: 1 },
          sessions: { $addToSet: '$session_hash' }
        }
      },
      { $sort: { event_count: -1 } },
      { $limit: 100 }
    ],
    { allowDiskUse: true }
  );

  await pMap(
    referrerAggregation,
    async (agg) => {
      await AnalyticsSummary.upsertSummary(
        hourStart,
        {
          referrer: agg._id.referrer,
          referrer_source: agg._id.source
        },
        {
          event_count: agg.event_count,
          unique_visitors: agg.sessions.length
        }
      );
    },
    { concurrency: 5 }
  );

  // Aggregate by pathname (top pages)
  const pathnameAggregation = await AnalyticsEvents.aggregate(
    [
      {
        $match: {
          ...match,
          pathname: { $exists: true, $ne: null },
          service: 'web'
        }
      },
      {
        $group: {
          _id: '$pathname',
          event_count: { $sum: 1 },
          sessions: { $addToSet: '$session_hash' },
          landing_entries: {
            $sum: { $cond: [{ $eq: ['$is_landing_page', true] }, 1, 0] }
          }
        }
      },
      { $sort: { event_count: -1 } },
      { $limit: 100 }
    ],
    { allowDiskUse: true }
  );

  await pMap(
    pathnameAggregation,
    async (agg) => {
      await AnalyticsSummary.upsertSummary(
        hourStart,
        { pathname: agg._id },
        {
          event_count: agg.event_count,
          unique_visitors: agg.sessions.length,
          landing_page_entries: agg.landing_entries
        }
      );
    },
    { concurrency: 5 }
  );

  // Aggregate by UTM source
  const utmAggregation = await AnalyticsEvents.aggregate(
    [
      { $match: { ...match, utm_source: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: { source: '$utm_source', campaign: '$utm_campaign' },
          event_count: { $sum: 1 },
          sessions: { $addToSet: '$session_hash' }
        }
      },
      { $sort: { event_count: -1 } },
      { $limit: 50 }
    ],
    { allowDiskUse: true }
  );

  await pMap(
    utmAggregation,
    async (agg) => {
      await AnalyticsSummary.upsertSummary(
        hourStart,
        {
          utm_source: agg._id.source,
          utm_campaign: agg._id.campaign
        },
        {
          event_count: agg.event_count,
          unique_visitors: agg.sessions.length
        }
      );
    },
    { concurrency: 5 }
  );

  logger.info('Completed aggregation for hour', {
    hourStart: hourStart.toISOString()
  });
}

/**
 * Main aggregation job
 * Aggregates the last 2 hours of data (to catch any late-arriving events)
 */
async function main() {
  await setupMongoose(logger);

  try {
    // Get the current hour and the previous hour
    const now = dayjs();
    const currentHour = now.startOf('hour').toDate();
    const previousHour = now.subtract(1, 'hour').startOf('hour').toDate();
    const twoHoursAgo = now.subtract(2, 'hours').startOf('hour').toDate();

    // Aggregate the last 2-3 hours to catch late events
    const hoursToAggregate = [twoHoursAgo, previousHour, currentHour];

    for (const hour of hoursToAggregate) {
      try {
        await aggregateHour(hour);
      } catch (err) {
        logger.error('Error aggregating hour', {
          hour: hour.toISOString(),
          err
        });
      }
    }

    logger.info('Analytics aggregation job completed successfully');
  } catch (err) {
    await logger.error('Analytics aggregation job failed', { err });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
}

main();
