/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const pMap = require('p-map');

const AnalyticsEvents = require('#models/analytics-events');
const { Users } = require('#models');

// Cache TTL configuration (in milliseconds)
const CACHE_TTL = {
  dashboard: ms('5m'), // Dashboard data cached for 5 minutes
  realtime: ms('30s'), // Realtime data cached for 30 seconds
  service: ms('5m') // Service breakdown cached for 5 minutes
};

// Cache key prefixes
const CACHE_PREFIX = 'analytics:';

/**
 * Generate cache key for analytics data
 * @param {string} type - Type of analytics data
 * @param {Object} params - Query parameters
 * @returns {string} - Cache key
 */
function getCacheKey(type, params = {}) {
  const parts = [CACHE_PREFIX, type];
  if (params.period) parts.push(params.period);
  if (params.service) parts.push(params.service);
  if (params.device_type) parts.push(params.device_type);
  if (params.start) parts.push(params.start);
  if (params.end) parts.push(params.end);
  return parts.join(':');
}

/**
 * Get cached data or execute query
 * @param {Object} ctx - Koa context
 * @param {string} cacheKey - Cache key
 * @param {number} ttl - Cache TTL in milliseconds
 * @param {Function} queryFn - Function to execute if cache miss
 * @returns {Promise<any>} - Cached or fresh data
 */
async function getCachedOrQuery(ctx, cacheKey, ttl, queryFn) {
  // Try to get from cache
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

  // Execute query
  const result = await queryFn();

  // Store in cache
  if (ctx.client && ctx.client.status === 'ready') {
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
 * Optimized overview stats aggregation
 * Uses $sum instead of $addToSet for better performance
 * Unique visitors are estimated from a sampled distinct count
 */
async function getOverviewStats(match) {
  const [stats, uniqueVisitors] = await Promise.all([
    // Get counts using efficient $sum
    AnalyticsEvents.aggregate(
      [
        { $match: match },
        {
          $group: {
            _id: null,
            total_events: { $sum: 1 },
            successful_events: {
              $sum: { $cond: [{ $eq: ['$success', true] }, 1, 0] }
            },
            failed_events: {
              $sum: { $cond: [{ $eq: ['$success', false] }, 1, 0] }
            }
          }
        }
      ],
      { allowDiskUse: true }
    ),
    // Get unique visitor count using distinct (more efficient than $addToSet)
    AnalyticsEvents.distinct('session_hash', match).then((arr) => arr.length)
  ]);

  const overview = stats[0] || {
    total_events: 0,
    successful_events: 0,
    failed_events: 0
  };

  overview.unique_visitors = uniqueVisitors;
  overview.success_rate =
    overview.total_events > 0
      ? (overview.successful_events / overview.total_events) * 100
      : 0;

  return overview;
}

/**
 * Optimized visitors over time aggregation
 * Groups by date and counts events, then gets unique visitors per day
 */
async function getVisitorsOverTime(match) {
  // Get event counts per day (fast)
  const dailyEvents = await AnalyticsEvents.aggregate(
    [
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$created_at' }
          },
          events: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ],
    { allowDiskUse: true }
  );

  // Get unique visitors per day using a more efficient approach
  const uniquePerDay = await AnalyticsEvents.aggregate(
    [
      { $match: match },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$created_at' }
            },
            session: '$session_hash'
          }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          visitors: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ],
    { allowDiskUse: true }
  );

  // Merge the results
  const visitorMap = new Map(uniquePerDay.map((d) => [d._id, d.visitors]));

  return dailyEvents.map((d) => ({
    date: d._id,
    events: d.events,
    visitors: visitorMap.get(d._id) || 0
  }));
}

/**
 * Optimized sessions by service - simpler version
 */
async function getSessionsByServiceSimple(match) {
  const [serviceCounts, serviceVisitors] = await Promise.all([
    // Get event counts per service
    AnalyticsEvents.aggregate(
      [
        { $match: match },
        {
          $group: {
            _id: '$service',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ],
      { allowDiskUse: true }
    ),
    // Get unique visitors per service
    AnalyticsEvents.aggregate(
      [
        { $match: match },
        {
          $group: {
            _id: {
              service: '$service',
              session: '$session_hash'
            }
          }
        },
        {
          $group: {
            _id: '$_id.service',
            visitors: { $sum: 1 }
          }
        }
      ],
      { allowDiskUse: true }
    )
  ]);

  const visitorMap = new Map(serviceVisitors.map((s) => [s._id, s.visitors]));

  return serviceCounts.map((s) => ({
    service: s._id,
    count: s.count,
    visitors: visitorMap.get(s._id) || 0
  }));
}

/**
 * Optimized top items aggregation (browsers, OS, etc.)
 * @param {Object} match - Base match query
 * @param {string} field - Field to group by
 * @param {number} limit - Number of results
 * @param {Object} extraMatch - Additional match conditions
 */
async function getTopItems(match, field, limit = 10, extraMatch = {}) {
  const fullMatch = { ...match, ...extraMatch };

  const [counts, visitors] = await Promise.all([
    // Get counts
    AnalyticsEvents.aggregate(
      [
        { $match: fullMatch },
        {
          $group: {
            _id: `$${field}`,
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: limit * 2 } // Get more to account for filtering
      ],
      { allowDiskUse: true }
    ),
    // Get unique visitors
    AnalyticsEvents.aggregate(
      [
        { $match: fullMatch },
        {
          $group: {
            _id: {
              field: `$${field}`,
              session: '$session_hash'
            }
          }
        },
        {
          $group: {
            _id: '$_id.field',
            visitors: { $sum: 1 }
          }
        },
        { $sort: { visitors: -1 } },
        { $limit: limit * 2 }
      ],
      { allowDiskUse: true }
    )
  ]);

  const visitorMap = new Map(visitors.map((v) => [v._id, v.visitors]));

  return counts
    .map((c) => ({
      [field]: c._id,
      count: c.count,
      visitors: visitorMap.get(c._id) || 0
    }))
    .sort((a, b) => b.visitors - a.visitors)
    .slice(0, limit);
}

/**
 * Optimized top referrers aggregation
 */
async function getTopReferrers(match, limit = 20) {
  const fullMatch = { ...match, referrer: { $exists: true, $ne: null } };

  const [counts, visitors] = await Promise.all([
    AnalyticsEvents.aggregate(
      [
        { $match: fullMatch },
        {
          $group: {
            _id: { referrer: '$referrer', source: '$referrer_source' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: limit * 2 }
      ],
      { allowDiskUse: true }
    ),
    AnalyticsEvents.aggregate(
      [
        { $match: fullMatch },
        {
          $group: {
            _id: {
              referrer: '$referrer',
              source: '$referrer_source',
              session: '$session_hash'
            }
          }
        },
        {
          $group: {
            _id: { referrer: '$_id.referrer', source: '$_id.source' },
            visitors: { $sum: 1 }
          }
        },
        { $sort: { visitors: -1 } },
        { $limit: limit * 2 }
      ],
      { allowDiskUse: true }
    )
  ]);

  const visitorMap = new Map(
    visitors.map((v) => [`${v._id.referrer}:${v._id.source}`, v.visitors])
  );

  return counts
    .map((c) => ({
      referrer: c._id.referrer,
      source: c._id.source,
      count: c.count,
      visitors: visitorMap.get(`${c._id.referrer}:${c._id.source}`) || 0
    }))
    .sort((a, b) => b.visitors - a.visitors)
    .slice(0, limit);
}

/**
 * Optimized top pages aggregation
 */
async function getTopPages(match, limit = 20) {
  const fullMatch = {
    ...match,
    pathname: { $exists: true, $ne: null },
    service: 'web'
  };

  return getTopItems(fullMatch, 'pathname', limit);
}

/**
 * Optimized top landing pages aggregation
 */
async function getTopLandingPages(match, limit = 10) {
  const fullMatch = {
    ...match,
    is_landing_page: true,
    pathname: { $exists: true, $ne: null }
  };

  return getTopItems(fullMatch, 'pathname', limit);
}

/**
 * Optimized device types aggregation
 */
async function getDeviceTypes(match) {
  return getTopItems(match, 'device_type', 10);
}

/**
 * Optimized success rate over time
 */
async function getSuccessRateOverTime(match) {
  return AnalyticsEvents.aggregate(
    [
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
    ],
    { allowDiskUse: true }
  );
}

/**
 * Optimized current visitors (last 5 minutes)
 */
async function getCurrentVisitors() {
  const fiveMinutesAgo = dayjs().subtract(5, 'minutes').toDate();
  const sessions = await AnalyticsEvents.distinct('session_hash', {
    created_at: { $gte: fiveMinutesAgo }
  });
  return sessions.length;
}

/**
 * Main analytics dashboard - optimized version
 */
async function dashboard(ctx) {
  const { startDate, endDate, period } = getDateRange(ctx.query);
  const filters = {
    service: ctx.query.service,
    browser: ctx.query.browser,
    device_type: ctx.query.device_type
  };

  const match = buildMatchQuery(startDate, endDate, filters);

  // Generate cache key
  const cacheKey = getCacheKey('dashboard', {
    period,
    service: filters.service,
    device_type: filters.device_type,
    start: ctx.query.start,
    end: ctx.query.end
  });

  // Try to get cached dashboard data
  const dashboardData = await getCachedOrQuery(
    ctx,
    cacheKey,
    CACHE_TTL.dashboard,
    async () => {
      // Run optimized aggregations in parallel with controlled concurrency
      const aggregationTasks = [
        () => getOverviewStats(match),
        () => getVisitorsOverTime(match),
        () => getSessionsByServiceSimple(match),
        () =>
          getTopItems(match, 'browser', 10, {
            browser: { $exists: true, $ne: 'Unknown' }
          }),
        () =>
          getTopItems(match, 'os', 10, {
            os: { $exists: true, $ne: 'Unknown' }
          }),
        () =>
          getTopItems(match, 'client_app', 10, {
            client_app: { $exists: true, $ne: null }
          }),
        () => getTopReferrers(match, 20),
        () => getTopPages(match, 20),
        () => getTopLandingPages(match, 10),
        () => getDeviceTypes(match),
        () => getSuccessRateOverTime(match),
        () => getCurrentVisitors()
      ];

      // Execute with concurrency limit to avoid overwhelming the database
      const results = await pMap(aggregationTasks, (task) => task(), {
        concurrency: 4
      });

      return {
        overview: results[0],
        visitorsOverTime: results[1],
        sessionsByService: results[2],
        topBrowsers: results[3],
        topOS: results[4],
        topClientApps: results[5],
        topReferrers: results[6],
        topPages: results[7],
        topLandingPages: results[8],
        deviceTypes: results[9],
        successRate: results[10],
        currentVisitors: results[11]
      };
    }
  );

  // Get signup attribution data (from Users model) - separate cache
  const signupCacheKey = getCacheKey('signup', {
    period,
    start: ctx.query.start,
    end: ctx.query.end
  });

  const signupData = await getCachedOrQuery(
    ctx,
    signupCacheKey,
    CACHE_TTL.dashboard,
    async () => {
      const signupStartDate = dayjs(startDate).toDate();
      const signupEndDate = dayjs(endDate).toDate();

      const [signupReferrers, signupLandingPages, signupUTMSources] =
        await Promise.all([
          // Top signup referrers
          Users.aggregate(
            [
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
            ],
            { allowDiskUse: true }
          ),

          // Top signup landing pages
          Users.aggregate(
            [
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
            ],
            { allowDiskUse: true }
          ),

          // Top UTM sources for signups
          Users.aggregate(
            [
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
            ],
            { allowDiskUse: true }
          )
        ]);

      return { signupReferrers, signupLandingPages, signupUTMSources };
    }
  );

  // Get available services for filter dropdown
  const availableServices = AnalyticsEvents.SERVICE_TYPES;

  // Format chart data for ApexCharts
  const chartData = {
    visitors: dashboardData.visitorsOverTime.map((d) => ({
      x: d.date,
      y: d.visitors
    })),
    events: dashboardData.visitorsOverTime.map((d) => ({
      x: d.date,
      y: d.events
    })),
    services: dashboardData.sessionsByService.map((d) => ({
      service: d.service,
      count: d.count,
      visitors: d.visitors
    })),
    deviceTypes: dashboardData.deviceTypes.map((d) => ({
      type: d.device_type || 'unknown',
      count: d.count,
      visitors: d.visitors
    })),
    successRate: dashboardData.successRate.map((d) => ({
      x: d.date,
      rate: Math.round(d.success_rate * 100) / 100
    }))
  };

  // Render the dashboard
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
    availableServices
  };

  return ctx.render('admin/analytics/index');
}

/**
 * Real-time analytics data (for AJAX updates) - optimized version
 */
async function realtime(ctx) {
  const cacheKey = getCacheKey('realtime', {});

  const data = await getCachedOrQuery(
    ctx,
    cacheKey,
    CACHE_TTL.realtime,
    async () => {
      const fiveMinutesAgo = dayjs().subtract(5, 'minutes').toDate();

      const [currentVisitors, recentEvents] = await Promise.all([
        // Current visitors - use distinct for efficiency
        AnalyticsEvents.distinct('session_hash', {
          created_at: { $gte: fiveMinutesAgo }
        }).then((arr) => arr.length),

        // Recent events by service
        AnalyticsEvents.aggregate(
          [
            { $match: { created_at: { $gte: fiveMinutesAgo } } },
            {
              $group: {
                _id: '$service',
                count: { $sum: 1 }
              }
            },
            { $sort: { count: -1 } }
          ],
          { allowDiskUse: true }
        )
      ]);

      return {
        current_visitors: currentVisitors,
        recent_events: recentEvents.map((e) => ({
          service: e._id,
          count: e.count
        })),
        timestamp: new Date().toISOString()
      };
    }
  );

  ctx.body = data;
}

/**
 * Detailed breakdown by service - optimized version
 */
async function byService(ctx) {
  const { startDate, endDate, period } = getDateRange(ctx.query);
  const { service } = ctx.params;

  if (!AnalyticsEvents.SERVICE_TYPES.includes(service)) {
    throw Boom.badRequest('Invalid service type');
  }

  const match = buildMatchQuery(startDate, endDate, { service });

  const cacheKey = getCacheKey('service', {
    period,
    service,
    start: ctx.query.start,
    end: ctx.query.end
  });

  const serviceData = await getCachedOrQuery(
    ctx,
    cacheKey,
    CACHE_TTL.service,
    async () => {
      const [overview, overTime, topBrowsers, topClientApps] =
        await Promise.all([
          // Overview for this service
          getOverviewStats(match),

          // Events over time
          getVisitorsOverTime(match),

          // Top browsers for this service
          getTopItems(match, 'browser', 10, {
            browser: { $exists: true, $ne: 'Unknown' }
          }),

          // Top client apps for this service
          getTopItems(match, 'client_app', 10, {
            client_app: { $exists: true, $ne: null }
          })
        ]);

      return { overview, overTime, topBrowsers, topClientApps };
    }
  );

  ctx.state.analytics = {
    service,
    overview: serviceData.overview,
    overTime: serviceData.overTime,
    topBrowsers: serviceData.topBrowsers,
    topClientApps: serviceData.topClientApps,
    period,
    startDate,
    endDate
  };

  return ctx.render('admin/analytics/service');
}

/**
 * Export analytics data as JSON - with limits for safety
 */
async function exportData(ctx) {
  const { startDate, endDate } = getDateRange(ctx.query);

  const data = await AnalyticsEvents.find(
    buildMatchQuery(startDate, endDate, ctx.query)
  )
    .select('-_id -__v')
    .sort({ created_at: -1 })
    .limit(10000)
    .lean()
    .allowDiskUse(true);

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
