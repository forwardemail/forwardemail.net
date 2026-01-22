/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * One-time backfill script for analytics summaries.
 *
 * Run this manually to populate AnalyticsSummary with historical data:
 *   node scripts/backfill-analytics.js
 *
 * This script uses cursor-based iteration to process events hour by hour,
 * avoiding memory issues with large datasets.
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');

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
 * Aggregate a single hour of data using cursor-based iteration
 */
async function aggregateHour(hourStart) {
  const hourEnd = dayjs(hourStart).add(1, 'hour').toDate();

  // Check if there are any events for this hour
  const eventCount = await AnalyticsEvents.countDocuments({
    created_at: { $gte: hourStart, $lt: hourEnd }
  });

  if (eventCount === 0) {
    return { processed: 0, summaries: 0 };
  }

  // Use Maps to accumulate counts during cursor iteration
  const serviceCounts = new Map();
  const browserCounts = new Map();
  const osCounts = new Map();
  const deviceCounts = new Map();
  const clientAppCounts = new Map();
  const referrerCounts = new Map();
  const pathnameCounts = new Map();
  const utmCounts = new Map();

  // Track unique sessions per dimension
  const serviceSessions = new Map();
  const browserSessions = new Map();
  const osSessions = new Map();
  const deviceSessions = new Map();
  const clientAppSessions = new Map();
  const referrerSessions = new Map();
  const pathnameSessions = new Map();
  const utmSessions = new Map();

  // Cursor-based iteration
  for await (const event of AnalyticsEvents.find({
    created_at: { $gte: hourStart, $lt: hourEnd }
  })
    .select(
      'service browser os device_type client_app referrer referrer_source pathname utm_source utm_campaign session_hash success is_landing_page'
    )
    .lean()
    .cursor()
    .addCursorFlag('noCursorTimeout', true)) {
    const sessionHash = event.session_hash || 'unknown';

    // Aggregate by service
    if (event.service) {
      const key = event.service;
      if (!serviceCounts.has(key)) {
        serviceCounts.set(key, {
          event_count: 0,
          successful_events: 0,
          failed_events: 0
        });
        serviceSessions.set(key, new Set());
      }

      const counts = serviceCounts.get(key);
      counts.event_count++;
      if (event.success === true) counts.successful_events++;
      if (event.success === false) counts.failed_events++;
      serviceSessions.get(key).add(sessionHash);
    }

    // Aggregate by browser
    if (event.browser) {
      const key = event.browser;
      if (!browserCounts.has(key)) {
        browserCounts.set(key, { event_count: 0 });
        browserSessions.set(key, new Set());
      }

      browserCounts.get(key).event_count++;
      browserSessions.get(key).add(sessionHash);
    }

    // Aggregate by OS
    if (event.os) {
      const key = event.os;
      if (!osCounts.has(key)) {
        osCounts.set(key, { event_count: 0 });
        osSessions.set(key, new Set());
      }

      osCounts.get(key).event_count++;
      osSessions.get(key).add(sessionHash);
    }

    // Aggregate by device type
    const deviceType = event.device_type || 'unknown';
    if (!deviceCounts.has(deviceType)) {
      deviceCounts.set(deviceType, { event_count: 0 });
      deviceSessions.set(deviceType, new Set());
    }

    deviceCounts.get(deviceType).event_count++;
    deviceSessions.get(deviceType).add(sessionHash);

    // Aggregate by client app
    if (event.client_app) {
      const key = event.client_app;
      if (!clientAppCounts.has(key)) {
        clientAppCounts.set(key, { event_count: 0 });
        clientAppSessions.set(key, new Set());
      }

      clientAppCounts.get(key).event_count++;
      clientAppSessions.get(key).add(sessionHash);
    }

    // Aggregate by referrer
    if (event.referrer) {
      const key = `${event.referrer}|${event.referrer_source || ''}`;
      if (!referrerCounts.has(key)) {
        referrerCounts.set(key, {
          event_count: 0,
          referrer: event.referrer,
          referrer_source: event.referrer_source
        });
        referrerSessions.set(key, new Set());
      }

      referrerCounts.get(key).event_count++;
      referrerSessions.get(key).add(sessionHash);
    }

    // Aggregate by pathname (web only)
    if (event.pathname && event.service === 'web') {
      const key = event.pathname;
      if (!pathnameCounts.has(key)) {
        pathnameCounts.set(key, { event_count: 0, landing_page_entries: 0 });
        pathnameSessions.set(key, new Set());
      }

      pathnameCounts.get(key).event_count++;
      if (event.is_landing_page) {
        pathnameCounts.get(key).landing_page_entries++;
      }

      pathnameSessions.get(key).add(sessionHash);
    }

    // Aggregate by UTM source
    if (event.utm_source) {
      const key = `${event.utm_source}|${event.utm_campaign || ''}`;
      if (!utmCounts.has(key)) {
        utmCounts.set(key, {
          event_count: 0,
          utm_source: event.utm_source,
          utm_campaign: event.utm_campaign
        });
        utmSessions.set(key, new Set());
      }

      utmCounts.get(key).event_count++;
      utmSessions.get(key).add(sessionHash);
    }
  }

  // Save all summaries to database
  const savePromises = [];

  // Save service summaries
  for (const [service, counts] of serviceCounts) {
    savePromises.push(
      AnalyticsSummary.upsertSummary({
        hour: hourStart,
        dimension: 'service',
        value: service,
        metrics: {
          event_count: counts.event_count,
          unique_visitors: serviceSessions.get(service).size,
          successful_events: counts.successful_events,
          failed_events: counts.failed_events
        }
      })
    );
  }

  // Save browser summaries (top 50)
  const topBrowsers = [...browserCounts.entries()]
    .sort((a, b) => b[1].event_count - a[1].event_count)
    .slice(0, 50);
  for (const [browser, counts] of topBrowsers) {
    savePromises.push(
      AnalyticsSummary.upsertSummary({
        hour: hourStart,
        dimension: 'browser',
        value: browser,
        metrics: {
          event_count: counts.event_count,
          unique_visitors: browserSessions.get(browser).size
        }
      })
    );
  }

  // Save OS summaries (top 50)
  const topOS = [...osCounts.entries()]
    .sort((a, b) => b[1].event_count - a[1].event_count)
    .slice(0, 50);
  for (const [os, counts] of topOS) {
    savePromises.push(
      AnalyticsSummary.upsertSummary({
        hour: hourStart,
        dimension: 'os',
        value: os,
        metrics: {
          event_count: counts.event_count,
          unique_visitors: osSessions.get(os).size
        }
      })
    );
  }

  // Save device type summaries
  for (const [deviceType, counts] of deviceCounts) {
    savePromises.push(
      AnalyticsSummary.upsertSummary({
        hour: hourStart,
        dimension: 'device_type',
        value: deviceType,
        metrics: {
          event_count: counts.event_count,
          unique_visitors: deviceSessions.get(deviceType).size
        }
      })
    );
  }

  // Save client app summaries (top 50)
  const topClientApps = [...clientAppCounts.entries()]
    .sort((a, b) => b[1].event_count - a[1].event_count)
    .slice(0, 50);
  for (const [clientApp, counts] of topClientApps) {
    savePromises.push(
      AnalyticsSummary.upsertSummary({
        hour: hourStart,
        dimension: 'client_app',
        value: clientApp,
        metrics: {
          event_count: counts.event_count,
          unique_visitors: clientAppSessions.get(clientApp).size
        }
      })
    );
  }

  // Save referrer summaries (top 100)
  const topReferrers = [...referrerCounts.entries()]
    .sort((a, b) => b[1].event_count - a[1].event_count)
    .slice(0, 100);
  for (const [key, counts] of topReferrers) {
    savePromises.push(
      AnalyticsSummary.upsertSummary({
        hour: hourStart,
        dimension: 'referrer',
        value: counts.referrer,
        metrics: {
          event_count: counts.event_count,
          unique_visitors: referrerSessions.get(key).size
        },
        value2: counts.referrer_source || null
      })
    );
  }

  // Save pathname summaries (top 100)
  const topPathnames = [...pathnameCounts.entries()]
    .sort((a, b) => b[1].event_count - a[1].event_count)
    .slice(0, 100);
  for (const [pathname, counts] of topPathnames) {
    savePromises.push(
      AnalyticsSummary.upsertSummary({
        hour: hourStart,
        dimension: 'pathname',
        value: pathname,
        metrics: {
          event_count: counts.event_count,
          unique_visitors: pathnameSessions.get(pathname).size,
          landing_page_entries: counts.landing_page_entries
        }
      })
    );
  }

  // Save UTM summaries (top 50)
  const topUTM = [...utmCounts.entries()]
    .sort((a, b) => b[1].event_count - a[1].event_count)
    .slice(0, 50);
  for (const [key, counts] of topUTM) {
    savePromises.push(
      AnalyticsSummary.upsertSummary({
        hour: hourStart,
        dimension: 'utm',
        value: counts.utm_source,
        metrics: {
          event_count: counts.event_count,
          unique_visitors: utmSessions.get(key).size
        },
        value2: counts.utm_campaign || null
      })
    );
  }

  // Execute all saves
  await Promise.all(savePromises);

  return { processed: eventCount, summaries: savePromises.length };
}

/**
 * Main backfill function
 */
(async () => {
  await setupMongoose(logger);

  try {
    // Get the date range of existing analytics events
    const [oldest, newest] = await Promise.all([
      AnalyticsEvents.findOne({}).sort({ created_at: 1 }).select('created_at'),
      AnalyticsEvents.findOne({}).sort({ created_at: -1 }).select('created_at')
    ]);

    if (!oldest || !newest) {
      logger.info('No analytics events found, nothing to backfill');
      process.exit(0);
    }

    const startDate = dayjs(oldest.created_at).startOf('hour');
    const endDate = dayjs(newest.created_at).startOf('hour');

    logger.info('Starting backfill', {
      from: startDate.toISOString(),
      to: endDate.toISOString()
    });

    // Calculate total hours
    const totalHours = endDate.diff(startDate, 'hour') + 1;
    let processedHours = 0;
    let totalEvents = 0;
    let totalSummaries = 0;

    // Process each hour
    let currentHour = startDate;
    while (currentHour.isBefore(endDate) || currentHour.isSame(endDate)) {
      try {
        const result = await aggregateHour(currentHour.toDate());
        totalEvents += result.processed;
        totalSummaries += result.summaries;
        processedHours++;

        // Log progress every 24 hours
        if (processedHours % 24 === 0) {
          const progress = Math.round((processedHours / totalHours) * 100);
          logger.info('Backfill progress', {
            progress: `${progress}%`,
            hours: `${processedHours}/${totalHours}`,
            events: totalEvents.toLocaleString(),
            summaries: totalSummaries
          });
        }
      } catch (err) {
        logger.error('Error processing hour', {
          hour: currentHour.toISOString(),
          err: err.message
        });
      }

      currentHour = currentHour.add(1, 'hour');
    }

    logger.info('Backfill completed', {
      totalHours: processedHours,
      totalEvents,
      totalSummaries
    });
  } catch (err) {
    logger.error('Backfill failed', { err });
    process.exit(1);
  }

  process.exit(0);
})();
