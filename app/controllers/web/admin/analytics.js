/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const dayjs = require('dayjs-with-plugins');

const AnalyticsEvents = require('#models/analytics-events');
const { Users } = require('#models');

/**
 * Get date range from query parameters
 * @param {Object} query - Query parameters
 * @returns {Object} - { startDate, endDate, period }
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
 * Build base match query for analytics
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Object} filters - Additional filters
 * @returns {Object} - MongoDB match query
 */
function buildMatchQuery(startDate, endDate, filters = {}) {
  const match = {
    created_at: { $gte: startDate, $lte: endDate }
  };

  if (filters.service && filters.service !== 'all') {
    match.service = filters.service;
  }

  if (filters.browser) {
    match.browser = filters.browser;
  }

  if (filters.device_type && filters.device_type !== 'all') {
    match.device_type = filters.device_type;
  }

  return match;
}

/**
 * Main analytics dashboard
 */
async function dashboard(ctx) {
  const { startDate, endDate, period } = getDateRange(ctx.query);
  const filters = {
    service: ctx.query.service,
    browser: ctx.query.browser,
    device_type: ctx.query.device_type
  };

  const match = buildMatchQuery(startDate, endDate, filters);

  // Run all aggregations in parallel for performance
  const [
    overview,
    visitorsOverTime,
    sessionsByService,
    topBrowsers,
    topOS,
    topClientApps,
    topReferrers,
    topPages,
    topLandingPages,
    deviceTypes,
    successRate,
    currentVisitors
  ] = await Promise.all([
    // Overview stats
    AnalyticsEvents.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          total_events: { $sum: 1 },
          unique_sessions: { $addToSet: '$session_hash' },
          successful_events: {
            $sum: { $cond: [{ $eq: ['$success', true] }, 1, 0] }
          },
          failed_events: {
            $sum: { $cond: [{ $eq: ['$success', false] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          total_events: 1,
          unique_visitors: { $size: '$unique_sessions' },
          successful_events: 1,
          failed_events: 1,
          success_rate: {
            $cond: [
              { $eq: ['$total_events', 0] },
              0,
              {
                $multiply: [
                  { $divide: ['$successful_events', '$total_events'] },
                  100
                ]
              }
            ]
          }
        }
      }
    ]),

    // Visitors over time (daily)
    AnalyticsEvents.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$created_at' }
          },
          events: { $sum: 1 },
          unique_sessions: { $addToSet: '$session_hash' }
        }
      },
      {
        $project: {
          date: '$_id',
          events: 1,
          visitors: { $size: '$unique_sessions' }
        }
      },
      { $sort: { date: 1 } }
    ]),

    // Sessions by service
    AnalyticsEvents.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$service',
          count: { $sum: 1 },
          unique_sessions: { $addToSet: '$session_hash' }
        }
      },
      {
        $project: {
          service: '$_id',
          count: 1,
          visitors: { $size: '$unique_sessions' }
        }
      },
      { $sort: { count: -1 } }
    ]),

    // Top browsers
    AnalyticsEvents.aggregate([
      { $match: { ...match, browser: { $exists: true, $ne: 'Unknown' } } },
      {
        $group: {
          _id: '$browser',
          count: { $sum: 1 },
          unique_sessions: { $addToSet: '$session_hash' }
        }
      },
      {
        $project: {
          browser: '$_id',
          count: 1,
          visitors: { $size: '$unique_sessions' }
        }
      },
      { $sort: { visitors: -1 } },
      { $limit: 10 }
    ]),

    // Top operating systems
    AnalyticsEvents.aggregate([
      { $match: { ...match, os: { $exists: true, $ne: 'Unknown' } } },
      {
        $group: {
          _id: '$os',
          count: { $sum: 1 },
          unique_sessions: { $addToSet: '$session_hash' }
        }
      },
      {
        $project: {
          os: '$_id',
          count: 1,
          visitors: { $size: '$unique_sessions' }
        }
      },
      { $sort: { visitors: -1 } },
      { $limit: 10 }
    ]),

    // Top email client apps
    AnalyticsEvents.aggregate([
      { $match: { ...match, client_app: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$client_app',
          count: { $sum: 1 },
          unique_sessions: { $addToSet: '$session_hash' }
        }
      },
      {
        $project: {
          client_app: '$_id',
          count: 1,
          visitors: { $size: '$unique_sessions' }
        }
      },
      { $sort: { visitors: -1 } },
      { $limit: 10 }
    ]),

    // Top referrers
    AnalyticsEvents.aggregate([
      { $match: { ...match, referrer: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: { referrer: '$referrer', source: '$referrer_source' },
          count: { $sum: 1 },
          unique_sessions: { $addToSet: '$session_hash' }
        }
      },
      {
        $project: {
          referrer: '$_id.referrer',
          source: '$_id.source',
          count: 1,
          visitors: { $size: '$unique_sessions' }
        }
      },
      { $sort: { visitors: -1 } },
      { $limit: 20 }
    ]),

    // Top pages
    AnalyticsEvents.aggregate([
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
          count: { $sum: 1 },
          unique_sessions: { $addToSet: '$session_hash' }
        }
      },
      {
        $project: {
          pathname: '$_id',
          count: 1,
          visitors: { $size: '$unique_sessions' }
        }
      },
      { $sort: { visitors: -1 } },
      { $limit: 20 }
    ]),

    // Top landing pages (first page in session)
    AnalyticsEvents.aggregate([
      {
        $match: {
          ...match,
          is_landing_page: true,
          pathname: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$pathname',
          count: { $sum: 1 },
          unique_sessions: { $addToSet: '$session_hash' }
        }
      },
      {
        $project: {
          pathname: '$_id',
          count: 1,
          visitors: { $size: '$unique_sessions' }
        }
      },
      { $sort: { visitors: -1 } },
      { $limit: 10 }
    ]),

    // Device types
    AnalyticsEvents.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$device_type',
          count: { $sum: 1 },
          unique_sessions: { $addToSet: '$session_hash' }
        }
      },
      {
        $project: {
          device_type: '$_id',
          count: 1,
          visitors: { $size: '$unique_sessions' }
        }
      },
      { $sort: { visitors: -1 } }
    ]),

    // Success rate over time
    AnalyticsEvents.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$created_at' }
          },
          total: { $sum: 1 },
          successful: {
            $sum: { $cond: [{ $eq: ['$success', true] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          date: '$_id',
          total: 1,
          successful: 1,
          success_rate: {
            $cond: [
              { $eq: ['$total', 0] },
              0,
              { $multiply: [{ $divide: ['$successful', '$total'] }, 100] }
            ]
          }
        }
      },
      { $sort: { date: 1 } }
    ]),

    // Current visitors (last 5 minutes)
    AnalyticsEvents.aggregate([
      {
        $match: {
          created_at: { $gte: dayjs().subtract(5, 'minutes').toDate() }
        }
      },
      {
        $group: {
          _id: null,
          unique_sessions: { $addToSet: '$session_hash' }
        }
      },
      {
        $project: {
          current_visitors: { $size: '$unique_sessions' }
        }
      }
    ])
  ]);

  // Get signup attribution data (from Users model)
  const signupStartDate = dayjs(startDate).toDate();
  const signupEndDate = dayjs(endDate).toDate();

  const [signupReferrers, signupLandingPages, signupUTMSources] =
    await Promise.all([
      // Top signup referrers
      Users.aggregate([
        {
          $match: {
            created_at: { $gte: signupStartDate, $lte: signupEndDate },
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
      ]),

      // Top signup landing pages
      Users.aggregate([
        {
          $match: {
            created_at: { $gte: signupStartDate, $lte: signupEndDate },
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
      ]),

      // Top UTM sources for signups
      Users.aggregate([
        {
          $match: {
            created_at: { $gte: signupStartDate, $lte: signupEndDate },
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
      ])
    ]);

  // Get available services for filter dropdown
  const availableServices = AnalyticsEvents.SERVICE_TYPES;

  // Format chart data for ApexCharts
  const chartData = {
    visitors: visitorsOverTime.map((d) => ({
      x: d.date,
      y: d.visitors
    })),
    events: visitorsOverTime.map((d) => ({
      x: d.date,
      y: d.events
    })),
    services: sessionsByService.map((d) => ({
      service: d.service,
      count: d.count,
      visitors: d.visitors
    })),
    deviceTypes: deviceTypes.map((d) => ({
      type: d.device_type || 'unknown',
      count: d.count,
      visitors: d.visitors
    })),
    successRate: successRate.map((d) => ({
      x: d.date,
      rate: Math.round(d.success_rate * 100) / 100
    }))
  };

  // Render the dashboard
  ctx.state.analytics = {
    overview: overview[0] || {
      total_events: 0,
      unique_visitors: 0,
      successful_events: 0,
      failed_events: 0,
      success_rate: 0
    },
    currentVisitors: currentVisitors[0]?.current_visitors || 0,
    topBrowsers,
    topOS,
    topClientApps,
    topReferrers,
    topPages,
    topLandingPages,
    signupReferrers,
    signupLandingPages,
    signupUTMSources,
    chartData,
    period,
    startDate,
    endDate,
    filters,
    availableServices
  };

  return ctx.render('admin/analytics/index');
}

/**
 * Real-time analytics data (for AJAX updates)
 */
async function realtime(ctx) {
  const fiveMinutesAgo = dayjs().subtract(5, 'minutes').toDate();

  const [currentVisitors, recentEvents] = await Promise.all([
    // Current visitors
    AnalyticsEvents.aggregate([
      { $match: { created_at: { $gte: fiveMinutesAgo } } },
      {
        $group: {
          _id: null,
          unique_sessions: { $addToSet: '$session_hash' }
        }
      },
      {
        $project: {
          current_visitors: { $size: '$unique_sessions' }
        }
      }
    ]),

    // Recent events by service
    AnalyticsEvents.aggregate([
      { $match: { created_at: { $gte: fiveMinutesAgo } } },
      {
        $group: {
          _id: '$service',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ])
  ]);

  ctx.body = {
    current_visitors: currentVisitors[0]?.current_visitors || 0,
    recent_events: recentEvents.map((e) => ({
      service: e._id,
      count: e.count
    })),
    timestamp: new Date().toISOString()
  };
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

  const match = buildMatchQuery(startDate, endDate, { service });

  const [overview, overTime, topBrowsers, topClientApps] = await Promise.all([
    // Overview for this service
    AnalyticsEvents.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          total_events: { $sum: 1 },
          unique_sessions: { $addToSet: '$session_hash' },
          successful: {
            $sum: { $cond: [{ $eq: ['$success', true] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          total_events: 1,
          unique_visitors: { $size: '$unique_sessions' },
          successful: 1,
          success_rate: {
            $cond: [
              { $eq: ['$total_events', 0] },
              0,
              {
                $multiply: [{ $divide: ['$successful', '$total_events'] }, 100]
              }
            ]
          }
        }
      }
    ]),

    // Events over time
    AnalyticsEvents.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$created_at' }
          },
          events: { $sum: 1 },
          unique_sessions: { $addToSet: '$session_hash' }
        }
      },
      {
        $project: {
          date: '$_id',
          events: 1,
          visitors: { $size: '$unique_sessions' }
        }
      },
      { $sort: { date: 1 } }
    ]),

    // Top browsers for this service
    AnalyticsEvents.aggregate([
      { $match: { ...match, browser: { $exists: true, $ne: 'Unknown' } } },
      {
        $group: {
          _id: '$browser',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),

    // Top client apps for this service
    AnalyticsEvents.aggregate([
      { $match: { ...match, client_app: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$client_app',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])
  ]);

  ctx.state.analytics = {
    service,
    overview: overview[0] || {
      total_events: 0,
      unique_visitors: 0,
      successful: 0,
      success_rate: 0
    },
    overTime,
    topBrowsers,
    topClientApps,
    period,
    startDate,
    endDate
  };

  return ctx.render('admin/analytics/service');
}

/**
 * Export analytics data as JSON
 */
async function exportData(ctx) {
  const { startDate, endDate } = getDateRange(ctx.query);

  const data = await AnalyticsEvents.find(
    buildMatchQuery(startDate, endDate, ctx.query)
  )
    .select('-_id -__v')
    .sort({ created_at: -1 })
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
