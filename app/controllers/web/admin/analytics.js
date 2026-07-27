/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const dayjs = require('dayjs-with-plugins');
const ms = require('ms');

const AnalyticsEvents = require('#models/analytics-events');
const AnalyticsSummary = require('#models/analytics-summary');

// Cache TTL in milliseconds (1h is fine since data is hourly-aggregated)
const CACHE_TTL = ms('10m');
const REALTIME_CACHE_TTL = ms('15s');
const CACHE_PREFIX = 'analytics:v3:';

/**
 * Get cached data or execute query
 */
async function getCachedOrQuery(ctx, cacheKey, queryFn, ttl = CACHE_TTL) {
  if (ctx.client && ctx.client.status === 'ready') {
    try {
      const cached = await ctx.client.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (err) {
      ctx.logger.warn('Cache read error', { err, cacheKey });
    }
  }

  const result = await queryFn();

  if (ctx.client && ctx.client.status === 'ready' && result?.noData !== true) {
    try {
      await ctx.client.set(cacheKey, JSON.stringify(result), 'PX', ttl);
    } catch (err) {
      ctx.logger.warn('Cache write error', { err, cacheKey });
    }
  }

  return result;
}

/**
 * Get date range from query parameters
 */
function getDateRange(query) {
  const period = query.period || '7d';
  const endDate = dayjs().endOf('day').toDate();
  let startDate;

  switch (period) {
    case '24h': {
      startDate = dayjs().subtract(24, 'hours').toDate();
      break;
    }

    case '7d': {
      startDate = dayjs().subtract(7, 'days').startOf('day').toDate();
      break;
    }

    case '30d': {
      startDate = dayjs().subtract(30, 'days').startOf('day').toDate();
      break;
    }

    case 'custom': {
      if (query.start && query.end) {
        startDate = dayjs(query.start).startOf('day').toDate();
        const customEnd = dayjs(query.end).endOf('day').toDate();
        return { startDate, endDate: customEnd, period };
      }

      startDate = dayjs().subtract(7, 'days').startOf('day').toDate();
      break;
    }

    default: {
      startDate = dayjs().subtract(7, 'days').startOf('day').toDate();
    }
  }

  return { startDate, endDate, period };
}

/**
 * Build a stable cache suffix for a date range.
 */
function getRangeCacheKey(period, startDate, endDate) {
  if (period !== 'custom') return period;

  return `${dayjs(startDate).format('YYYY-MM-DD')}:${dayjs(endDate).format(
    'YYYY-MM-DD'
  )}`;
}

/**
 * Main analytics dashboard
 */
async function dashboard(ctx) {
  const { startDate, endDate, period } = getDateRange(ctx.query);
  const filters = {
    service: ctx.query.service,
    device_type: ctx.query.device_type
  };

  const rangeCacheKey = getRangeCacheKey(period, startDate, endDate);
  const cacheKey = `${CACHE_PREFIX}dashboard:${rangeCacheKey}:${
    filters.service || 'all'
  }:${filters.device_type || 'all'}`;

  const dashboardData = await getCachedOrQuery(ctx, cacheKey, async () => {
    const summary = await AnalyticsSummary.getDashboardData(
      startDate,
      endDate,
      filters
    );

    return {
      overview: summary.overview,
      visitorsOverTime: summary.visitorsOverTime,
      sessionsByService: summary.sessionsByService.map((entry) => ({
        service: entry._id,
        count: entry.event_count,
        visitors: entry.unique_visitors
      })),
      topBrowsers: summary.topBrowsers.map((entry) => ({
        browser: entry._id,
        count: entry.event_count,
        visitors: entry.unique_visitors
      })),
      topOS: summary.topOS.map((entry) => ({
        os: entry._id,
        count: entry.event_count,
        visitors: entry.unique_visitors
      })),
      topClientApps: summary.topClientApps.map((entry) => ({
        client_app: entry._id,
        count: entry.event_count,
        visitors: entry.unique_visitors
      })),
      topReferrers: summary.topReferrers.map((entry) => ({
        referrer: entry._id.value,
        source: entry._id.value2 || null,
        count: entry.event_count,
        visitors: entry.unique_visitors
      })),
      topPages: summary.topPages.map((entry) => ({
        pathname: entry._id,
        count: entry.event_count,
        visitors: entry.unique_visitors
      })),
      topLandingPages: summary.topLandingPages.map((entry) => ({
        pathname: entry._id,
        count: entry.landing_page_entries,
        visitors: entry.unique_visitors
      })),
      deviceTypes: summary.deviceTypes.map((entry) => ({
        device_type: entry._id || 'unknown',
        count: entry.event_count,
        visitors: entry.unique_visitors
      })),
      signupReferrers: summary.signupReferrers,
      signupLandingPages: summary.signupLandingPages,
      signupUTMSources: summary.signupUTMSources,
      noData: !summary.hasData
    };
  });

  // Format chart data
  const chartData = {
    visitors: dashboardData.visitorsOverTime.map((d) => ({
      x: d.date,
      y: d.visitors
    })),
    events: dashboardData.visitorsOverTime.map((d) => ({
      x: d.date,
      y: d.events
    })),
    successRate: dashboardData.visitorsOverTime.map((d) => ({
      x: d.date,
      rate: d.success_rate
    })),
    services: dashboardData.sessionsByService,
    deviceTypes: dashboardData.deviceTypes.map((d) => ({
      type: d.device_type,
      count: d.count,
      visitors: d.visitors
    }))
  };

  ctx.state.analytics = {
    overview: dashboardData.overview,
    // Realtime visitors are populated immediately after render by AJAX.
    currentVisitors: 0,
    topBrowsers: dashboardData.topBrowsers,
    topOS: dashboardData.topOS,
    topClientApps: dashboardData.topClientApps,
    topReferrers: dashboardData.topReferrers,
    topPages: dashboardData.topPages,
    topLandingPages: dashboardData.topLandingPages,
    signupReferrers: dashboardData.signupReferrers,
    signupLandingPages: dashboardData.signupLandingPages,
    signupUTMSources: dashboardData.signupUTMSources,
    chartData,
    period,
    startDate,
    endDate,
    filters,
    availableServices: AnalyticsEvents.SERVICE_TYPES,
    noData: dashboardData.noData
  };

  return ctx.render('admin/analytics/index');
}

/**
 * Real-time analytics data (for AJAX updates)
 */
async function realtime(ctx) {
  const cacheKey = `${CACHE_PREFIX}realtime`;

  const data = await getCachedOrQuery(
    ctx,
    cacheKey,
    async () => {
      const fiveMinutesAgo = dayjs().subtract(5, 'minutes').toDate();
      const [result = {}] = await AnalyticsEvents.aggregate([
        { $match: { created_at: { $gte: fiveMinutesAgo } } },
        {
          $facet: {
            visitors: [
              { $group: { _id: '$session_hash' } },
              { $count: 'count' }
            ],
            services: [
              { $group: { _id: '$service', count: { $sum: 1 } } },
              { $sort: { count: -1 } }
            ]
          }
        }
      ]);

      return {
        current_visitors: result.visitors?.[0]?.count || 0,
        recent_events: (result.services || []).map((entry) => ({
          service: entry._id,
          count: entry.count
        })),
        timestamp: new Date().toISOString()
      };
    },
    REALTIME_CACHE_TTL
  );

  ctx.body = data;
}

/**
 * Detailed breakdown by service
 */
async function byService(ctx) {
  const { startDate, endDate, period } = getDateRange(ctx.query);
  const { service } = ctx.params;

  if (!AnalyticsEvents.SERVICE_TYPES.includes(service)) {
    throw Boom.badRequest('Invalid service type');
  }

  const rangeCacheKey = getRangeCacheKey(period, startDate, endDate);
  const cacheKey = `${CACHE_PREFIX}service:${service}:${rangeCacheKey}`;

  const serviceData = await getCachedOrQuery(ctx, cacheKey, async () => {
    const summary = await AnalyticsSummary.getDashboardData(
      startDate,
      endDate,
      { service }
    );

    return {
      overview: summary.overview,
      overTime: summary.visitorsOverTime,
      topBrowsers: summary.topBrowsers.map((entry) => ({
        browser: entry._id,
        count: entry.event_count,
        visitors: entry.unique_visitors
      })),
      topClientApps: summary.topClientApps.map((entry) => ({
        client_app: entry._id,
        count: entry.event_count,
        visitors: entry.unique_visitors
      })),
      noData: !summary.hasData
    };
  });

  ctx.state.analytics = {
    service,
    overview: serviceData.overview,
    overTime: serviceData.overTime,
    topBrowsers: serviceData.topBrowsers,
    topClientApps: serviceData.topClientApps,
    period,
    startDate,
    endDate,
    noData: serviceData.noData
  };

  return ctx.render('admin/analytics/service');
}

/**
 * Export analytics data as JSON
 */
async function exportData(ctx) {
  const { startDate, endDate } = getDateRange(ctx.query);

  const data = await AnalyticsSummary.find({
    hour: { $gte: startDate, $lte: endDate },
    dimension: { $ne: AnalyticsSummary.HOUR_MANIFEST_DIMENSION },
    schema_version: AnalyticsSummary.CURRENT_SCHEMA_VERSION,
    is_complete: true
  })
    .select('-_id -__v')
    .sort({ hour: -1 })
    .limit(10_000)
    .lean();

  ctx.set('Content-Type', 'application/json');
  ctx.set(
    'Content-Disposition',
    `attachment; filename="analytics-${dayjs(startDate).format(
      'YYYY-MM-DD'
    )}-to-${dayjs(endDate).format('YYYY-MM-DD')}.json"`
  );
  ctx.body = JSON.stringify(data, null, 2);
}

module.exports = {
  dashboard,
  realtime,
  byService,
  exportData
};
