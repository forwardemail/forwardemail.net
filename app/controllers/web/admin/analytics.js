/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const dayjs = require('dayjs-with-plugins');
const ms = require('ms');

const AnalyticsEvents = require('#models/analytics-events');
const AnalyticsSummary = require('#models/analytics-summary');
const { Users } = require('#models');

// Cache TTL in milliseconds
const CACHE_TTL = ms('5m');
const CACHE_PREFIX = 'analytics:';

/**
 * Get cached data or execute query
 */
async function getCachedOrQuery(ctx, cacheKey, queryFn) {
  if (ctx.client && ctx.client.status === 'ready') {
    try {
      const cached = await ctx.client.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err) {
      ctx.logger.warn('Cache read error', { err, cacheKey });
    }
  }

  const result = await queryFn();

  if (ctx.client && ctx.client.status === 'ready') {
    try {
      await ctx.client.set(cacheKey, JSON.stringify(result), 'PX', CACHE_TTL);
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
 * Check if we have pre-aggregated summary data
 */
async function hasSummaryData(startDate, endDate) {
  const count = await AnalyticsSummary.countDocuments({
    hour: { $gte: startDate, $lte: endDate }
  });
  return count > 0;
}

/**
 * Get current visitors (last 5 minutes) from raw events
 * This is the only query that hits raw events on page load
 */
async function getCurrentVisitors() {
  const fiveMinutesAgo = dayjs().subtract(5, 'minutes').toDate();

  // Use estimatedDocumentCount to check collection size
  const totalDocs = await AnalyticsEvents.estimatedDocumentCount();

  if (totalDocs > 1_000_000) {
    // For large collections, estimate from recent event count
    const recentCount = await AnalyticsEvents.countDocuments({
      created_at: { $gte: fiveMinutesAgo }
    });
    // Estimate unique visitors as ~30% of events
    return Math.round(recentCount * 0.3);
  }

  // For smaller collections, use distinct
  const sessions = await AnalyticsEvents.distinct('session_hash', {
    created_at: { $gte: fiveMinutesAgo }
  });
  return sessions.length;
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

  const cacheKey = `${CACHE_PREFIX}dashboard:${period}:${
    filters.service || 'all'
  }:${filters.device_type || 'all'}`;

  const dashboardData = await getCachedOrQuery(ctx, cacheKey, async () => {
    // Check if we have pre-aggregated data
    const hasData = await hasSummaryData(startDate, endDate);

    if (!hasData) {
      return {
        overview: {
          total_events: 0,
          unique_visitors: 0,
          successful_events: 0,
          failed_events: 0,
          success_rate: 0
        },
        visitorsOverTime: [],
        sessionsByService: [],
        topBrowsers: [],
        topOS: [],
        topClientApps: [],
        topReferrers: [],
        topPages: [],
        topLandingPages: [],
        deviceTypes: [],
        currentVisitors: 0,
        noData: true
      };
    }

    // Query all data from AnalyticsSummary
    const [
      overview,
      visitorsOverTime,
      sessionsByService,
      topBrowsers,
      topOS,
      topClientApps,
      topReferrers,
      topPages,
      deviceTypes,
      currentVisitors
    ] = await Promise.all([
      // Overview stats
      AnalyticsSummary.getOverview(startDate, endDate, filters.service),

      // Visitors over time
      AnalyticsSummary.getVisitorsOverTime(startDate, endDate, filters.service),

      // Sessions by service
      AnalyticsSummary.getByDimension(startDate, endDate, 'service'),

      // Top browsers
      AnalyticsSummary.getByDimension(startDate, endDate, 'browser', {
        limit: 10
      }),

      // Top OS
      AnalyticsSummary.getByDimension(startDate, endDate, 'os', { limit: 10 }),

      // Top client apps
      AnalyticsSummary.getByDimension(startDate, endDate, 'client_app', {
        limit: 10
      }),

      // Top referrers
      AnalyticsSummary.getByDimension(startDate, endDate, 'referrer', {
        limit: 20,
        includeValue2: true
      }),

      // Top pages
      AnalyticsSummary.getByDimension(startDate, endDate, 'pathname', {
        limit: 20
      }),

      // Device types
      AnalyticsSummary.getByDimension(startDate, endDate, 'device_type'),

      // Current visitors (from raw events - small time window)
      getCurrentVisitors()
    ]);

    return {
      overview,
      visitorsOverTime,
      sessionsByService: sessionsByService.map((s) => ({
        service: s._id,
        count: s.event_count,
        visitors: s.unique_visitors
      })),
      topBrowsers: topBrowsers.map((b) => ({
        browser: b._id,
        count: b.event_count,
        visitors: b.unique_visitors
      })),
      topOS: topOS.map((o) => ({
        os: o._id,
        count: o.event_count,
        visitors: o.unique_visitors
      })),
      topClientApps: topClientApps.map((c) => ({
        client_app: c._id,
        count: c.event_count,
        visitors: c.unique_visitors
      })),
      topReferrers: topReferrers.map((r) => ({
        referrer: r._id.value || r._id,
        source: r._id.value2 || null,
        count: r.event_count,
        visitors: r.unique_visitors
      })),
      topPages: topPages.map((p) => ({
        pathname: p._id,
        count: p.event_count,
        visitors: p.unique_visitors
      })),
      topLandingPages: topPages
        .filter((p) => p.landing_page_entries > 0)
        .sort((a, b) => b.landing_page_entries - a.landing_page_entries)
        .slice(0, 10)
        .map((p) => ({
          pathname: p._id,
          count: p.landing_page_entries,
          visitors: p.unique_visitors
        })),
      deviceTypes: deviceTypes.map((d) => ({
        device_type: d._id || 'unknown',
        count: d.event_count,
        visitors: d.unique_visitors
      })),
      currentVisitors,
      noData: false
    };
  });

  // Get signup attribution data (from Users model)
  const signupCacheKey = `${CACHE_PREFIX}signup:${period}`;
  const signupData = await getCachedOrQuery(ctx, signupCacheKey, async () => {
    const [signupReferrers, signupLandingPages, signupUTMSources] =
      await Promise.all([
        Users.aggregate(
          [
            {
              $match: {
                created_at: { $gte: startDate, $lte: endDate },
                signup_referrer: { $exists: true, $ne: null }
              }
            },
            {
              $group: {
                _id: {
                  referrer: '$signup_referrer',
                  source: '$signup_referrer_source'
                },
                count: { $sum: 1 }
              }
            },
            {
              $project: {
                referrer: '$_id.referrer',
                source: '$_id.source',
                count: 1
              }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],
          { allowDiskUse: true }
        ),
        Users.aggregate(
          [
            {
              $match: {
                created_at: { $gte: startDate, $lte: endDate },
                signup_landing_page: { $exists: true, $ne: null }
              }
            },
            {
              $group: {
                _id: '$signup_landing_page',
                count: { $sum: 1 }
              }
            },
            {
              $project: {
                landing_page: '$_id',
                count: 1
              }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],
          { allowDiskUse: true }
        ),
        Users.aggregate(
          [
            {
              $match: {
                created_at: { $gte: startDate, $lte: endDate },
                signup_utm_source: { $exists: true, $ne: null }
              }
            },
            {
              $group: {
                _id: {
                  source: '$signup_utm_source',
                  medium: '$signup_utm_medium',
                  campaign: '$signup_utm_campaign'
                },
                count: { $sum: 1 }
              }
            },
            {
              $project: {
                source: '$_id.source',
                medium: '$_id.medium',
                campaign: '$_id.campaign',
                count: 1
              }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],
          { allowDiskUse: true }
        )
      ]);

    return { signupReferrers, signupLandingPages, signupUTMSources };
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
    services: dashboardData.sessionsByService,
    deviceTypes: dashboardData.deviceTypes.map((d) => ({
      type: d.device_type,
      count: d.count,
      visitors: d.visitors
    }))
  };

  ctx.state.analytics = {
    overview: dashboardData.overview,
    currentVisitors: dashboardData.currentVisitors,
    topBrowsers: dashboardData.topBrowsers,
    topOS: dashboardData.topOS,
    topClientApps: dashboardData.topClientApps,
    topReferrers: dashboardData.topReferrers,
    topPages: dashboardData.topPages,
    topLandingPages: dashboardData.topLandingPages,
    signupReferrers: signupData.signupReferrers,
    signupLandingPages: signupData.signupLandingPages,
    signupUTMSources: signupData.signupUTMSources,
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

  const data = await getCachedOrQuery(ctx, cacheKey, async () => {
    const fiveMinutesAgo = dayjs().subtract(5, 'minutes').toDate();
    const totalDocs = await AnalyticsEvents.estimatedDocumentCount();

    let currentVisitors;
    let recentEvents;

    if (totalDocs > 1_000_000) {
      const [recentCount, serviceBreakdown] = await Promise.all([
        AnalyticsEvents.countDocuments({
          created_at: { $gte: fiveMinutesAgo }
        }),
        AnalyticsEvents.aggregate(
          [
            { $match: { created_at: { $gte: fiveMinutesAgo } } },
            { $group: { _id: '$service', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          { allowDiskUse: true }
        )
      ]);

      currentVisitors = Math.round(recentCount * 0.3);
      recentEvents = serviceBreakdown;
    } else {
      const [sessions, serviceBreakdown] = await Promise.all([
        AnalyticsEvents.distinct('session_hash', {
          created_at: { $gte: fiveMinutesAgo }
        }),
        AnalyticsEvents.aggregate(
          [
            { $match: { created_at: { $gte: fiveMinutesAgo } } },
            { $group: { _id: '$service', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          { allowDiskUse: true }
        )
      ]);

      currentVisitors = sessions.length;
      recentEvents = serviceBreakdown;
    }

    return {
      current_visitors: currentVisitors,
      recent_events: recentEvents.map((e) => ({
        service: e._id,
        count: e.count
      })),
      timestamp: new Date().toISOString()
    };
  });

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

  const cacheKey = `${CACHE_PREFIX}service:${service}:${period}`;

  const serviceData = await getCachedOrQuery(ctx, cacheKey, async () => {
    const hasData = await hasSummaryData(startDate, endDate);

    if (!hasData) {
      return {
        overview: {
          total_events: 0,
          unique_visitors: 0,
          successful_events: 0,
          failed_events: 0,
          success_rate: 0
        },
        overTime: [],
        topBrowsers: [],
        topClientApps: [],
        noData: true
      };
    }

    const [overview, overTime, topBrowsers, topClientApps] = await Promise.all([
      AnalyticsSummary.getOverview(startDate, endDate, service),
      AnalyticsSummary.getVisitorsOverTime(startDate, endDate, service),
      AnalyticsSummary.getByDimension(startDate, endDate, 'browser', {
        limit: 10
      }),
      AnalyticsSummary.getByDimension(startDate, endDate, 'client_app', {
        limit: 10
      })
    ]);

    return {
      overview,
      overTime,
      topBrowsers: topBrowsers.map((b) => ({
        browser: b._id,
        count: b.event_count,
        visitors: b.unique_visitors
      })),
      topClientApps: topClientApps.map((c) => ({
        client_app: c._id,
        count: c.event_count,
        visitors: c.unique_visitors
      })),
      noData: false
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
    hour: { $gte: startDate, $lte: endDate }
  })
    .select('-_id -__v')
    .sort({ hour: -1 })
    .limit(10000)
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
