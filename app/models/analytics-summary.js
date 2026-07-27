/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');

const CURRENT_SCHEMA_VERSION = 3;
const HOUR_MANIFEST_DIMENSION = 'hour';
const HOUR_MANIFEST_VALUE = `v${CURRENT_SCHEMA_VERSION}`;

/**
 * AnalyticsSummary Schema
 *
 * Pre-aggregated analytics data for fast dashboard queries.
 * Data is aggregated hourly by the aggregate-analytics job.
 *
 * Each document represents a single dimension (e.g., one browser, one service)
 * for a specific hour. This allows efficient querying without scanning
 * millions of raw events.
 */
const AnalyticsSummary = new mongoose.Schema({
  // Time bucket for this summary (hourly granularity)
  hour: {
    type: Date,
    required: true
  },

  // Dimension type - what this summary aggregates by
  // Only ONE of these should be set per document
  dimension: {
    type: String,
    required: true,
    enum: [
      'hour',
      'service',
      'service_device',
      'browser',
      'os',
      'device_type',
      'client_app',
      'referrer',
      'pathname',
      'utm',
      'signup_referrer',
      'signup_landing_page',
      'signup_utm'
    ]
  },

  // Dimension value (the actual service name, browser name, etc.)
  value: {
    type: String,
    required: true
  },

  // Secondary value for compound dimensions (e.g., referrer_source, utm_campaign)
  value2: {
    type: String
  },

  // Aggregated metrics
  event_count: {
    type: Number,
    default: 0
  },
  unique_visitors: {
    type: Number,
    default: 0
  },
  successful_events: {
    type: Number,
    default: 0
  },
  failed_events: {
    type: Number,
    default: 0
  },
  landing_page_entries: {
    type: Number,
    default: 0
  },

  // Schema-versioned rows let deployments ignore old summary contracts while
  // an automatic backfill repairs history in the background.
  schema_version: {
    type: Number,
    default: CURRENT_SCHEMA_VERSION
  },

  // A generation is only visible after every summary for the hour is written.
  // This prevents failed/partial aggregation batches from reaching the dashboard.
  aggregation_id: {
    type: String
  },
  aggregation_started_at: {
    type: Date
  },
  is_complete: {
    type: Boolean,
    default: false
  }
});

// Primary query index: hour range + dimension type
// This supports all dashboard queries efficiently
AnalyticsSummary.index({
  hour: 1,
  dimension: 1,
  schema_version: 1,
  is_complete: 1
});

// Unique constraint to prevent duplicates
// Each hour + dimension + value combination should be unique
AnalyticsSummary.index(
  { hour: 1, dimension: 1, value: 1, value2: 1 },
  { unique: true }
);

// TTL index - keep summaries for 90 days
AnalyticsSummary.index({ hour: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

// Apply common plugin with uniqueId disabled since we use upserts
AnalyticsSummary.plugin(mongooseCommonPlugin, {
  object: 'analytics_summary',
  locale: false,
  uniqueId: false
});

/**
 * Publish a replacement generation of summaries for one hour.
 *
 * MongoDB standalone deployments do not support transactions, so the current
 * generation is first marked incomplete.  A failed bulk write therefore cannot
 * be observed by dashboard queries.  Metrics are replaced (not incremented),
 * which makes overlapping hourly runs and manual backfills idempotent.
 *
 * @param {Date} hour - Hour bucket
 * @param {Array<Object>} summaries - Complete summary set for the hour
 */
AnalyticsSummary.statics.replaceHour = async function (hour, summaries) {
  const aggregationId = new mongoose.Types.ObjectId().toString();
  const aggregationStartedAt = new Date();
  const staleLockCutoff = new Date(
    aggregationStartedAt.getTime() - 60 * 60 * 1000
  );
  const manifestObjectId = new mongoose.Types.ObjectId();

  try {
    await this.findOneAndUpdate(
      {
        hour,
        dimension: HOUR_MANIFEST_DIMENSION,
        value: HOUR_MANIFEST_VALUE,
        value2: null,
        $or: [
          { aggregation_started_at: { $exists: false } },
          { aggregation_started_at: null },
          { aggregation_started_at: { $lt: staleLockCutoff } }
        ]
      },
      {
        $set: {
          schema_version: CURRENT_SCHEMA_VERSION,
          aggregation_id: aggregationId,
          aggregation_started_at: aggregationStartedAt,
          is_complete: false
        },
        $setOnInsert: {
          id: manifestObjectId.toString(),
          object: 'analytics_summary'
        }
      },
      { upsert: true }
    );
  } catch (err) {
    if (err?.code === 11000) {
      throw new Error(
        `Analytics aggregation already in progress for ${hour.toISOString()}`,
        { cause: err }
      );
    }

    throw err;
  }

  try {
    const completeSummaries = [
      {
        dimension: HOUR_MANIFEST_DIMENSION,
        value: HOUR_MANIFEST_VALUE,
        metrics: {}
      },
      ...summaries
    ];

    await this.updateMany({ hour }, { $set: { is_complete: false } });

    const operations = completeSummaries.map((summary) => {
      const value2 = summary.value2 || null;
      const objectId = new mongoose.Types.ObjectId();

      return {
        updateOne: {
          filter: {
            hour,
            dimension: summary.dimension,
            value: summary.value,
            value2
          },
          update: {
            $set: {
              event_count: summary.metrics.event_count || 0,
              unique_visitors: summary.metrics.unique_visitors || 0,
              successful_events: summary.metrics.successful_events || 0,
              failed_events: summary.metrics.failed_events || 0,
              landing_page_entries: summary.metrics.landing_page_entries || 0,
              schema_version: CURRENT_SCHEMA_VERSION,
              aggregation_id: aggregationId,
              is_complete: false
            },
            $setOnInsert: {
              id: objectId.toString(),
              object: 'analytics_summary'
            }
          },
          upsert: true
        }
      };
    });

    await this.bulkWrite(operations, { ordered: true });

    await this.deleteMany({
      hour,
      aggregation_id: { $ne: aggregationId }
    });

    const writtenSummaryCount = await this.countDocuments({
      hour,
      aggregation_id: aggregationId
    });
    if (writtenSummaryCount !== operations.length) {
      throw new Error(
        `Concurrent analytics aggregation detected for ${hour.toISOString()}`
      );
    }

    await this.updateMany(
      { hour, aggregation_id: aggregationId },
      {
        $set: { is_complete: true },
        $unset: { aggregation_started_at: 1 }
      }
    );
  } catch (err) {
    await this.updateOne(
      {
        hour,
        dimension: HOUR_MANIFEST_DIMENSION,
        value: HOUR_MANIFEST_VALUE,
        value2: null,
        aggregation_id: aggregationId
      },
      { $unset: { aggregation_started_at: 1 } }
    );
    throw err;
  }
};

/**
 * Check whether this range contains at least one current, fully published
 * hourly manifest. Legacy and in-progress rows are ignored instead of making
 * the entire dashboard blank while automatic repair is still running.
 *
 * @param {Date} startDate - Start of range
 * @param {Date} endDate - End of range
 * @returns {Promise<boolean>} Whether current summary data is available
 */
AnalyticsSummary.statics.hasCompleteData = async function (startDate, endDate) {
  return Boolean(
    await this.exists({
      hour: { $gte: startDate, $lte: endDate },
      dimension: HOUR_MANIFEST_DIMENSION,
      value: HOUR_MANIFEST_VALUE,
      schema_version: CURRENT_SCHEMA_VERSION,
      is_complete: true
    })
  );
};

/**
 * Get aggregated stats for a date range and dimension
 * @param {Date} startDate - Start of range
 * @param {Date} endDate - End of range
 * @param {string} dimension - Dimension to query
 * @param {Object} [options] - Query options
 * @returns {Promise<Array>} Aggregated results
 */
AnalyticsSummary.statics.getByDimension = async function (
  startDate,
  endDate,
  dimension,
  options = {}
) {
  const pipeline = [
    {
      $match: {
        hour: { $gte: startDate, $lte: endDate },
        dimension,
        schema_version: CURRENT_SCHEMA_VERSION,
        is_complete: true
      }
    },
    {
      $group: {
        _id: options.includeValue2
          ? { value: '$value', value2: '$value2' }
          : '$value',
        event_count: { $sum: '$event_count' },
        unique_visitors: { $sum: '$unique_visitors' },
        successful_events: { $sum: '$successful_events' },
        failed_events: { $sum: '$failed_events' },
        landing_page_entries: { $sum: '$landing_page_entries' }
      }
    },
    { $sort: { unique_visitors: -1 } }
  ];

  if (options.limit) {
    pipeline.push({ $limit: options.limit });
  }

  return this.aggregate(pipeline);
};

/**
 * Get total overview stats for a date range
 * @param {Date} startDate - Start of range
 * @param {Date} endDate - End of range
 * @param {string} [serviceFilter] - Optional service filter
 * @returns {Promise<Object>} Overview stats
 */
AnalyticsSummary.statics.getOverview = async function (
  startDate,
  endDate,
  serviceFilter = null
) {
  const match = {
    hour: { $gte: startDate, $lte: endDate },
    dimension: 'service',
    schema_version: CURRENT_SCHEMA_VERSION,
    is_complete: true
  };

  if (serviceFilter && serviceFilter !== 'all') {
    match.value = serviceFilter;
  }

  const result = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        total_events: { $sum: '$event_count' },
        unique_visitors: { $sum: '$unique_visitors' },
        successful_events: { $sum: '$successful_events' },
        failed_events: { $sum: '$failed_events' }
      }
    }
  ]);

  if (result.length === 0) {
    return {
      total_events: 0,
      unique_visitors: 0,
      successful_events: 0,
      failed_events: 0,
      success_rate: 0
    };
  }

  const overview = result[0];
  overview.success_rate =
    overview.total_events > 0
      ? (overview.successful_events / overview.total_events) * 100
      : 0;

  return overview;
};

/**
 * Get visitors over time for a date range
 * @param {Date} startDate - Start of range
 * @param {Date} endDate - End of range
 * @param {string} [serviceFilter] - Optional service filter
 * @returns {Promise<Array>} Daily visitor counts
 */
AnalyticsSummary.statics.getVisitorsOverTime = async function (
  startDate,
  endDate,
  serviceFilter = null
) {
  const match = {
    hour: { $gte: startDate, $lte: endDate },
    dimension: 'service',
    schema_version: CURRENT_SCHEMA_VERSION,
    is_complete: true
  };

  if (serviceFilter && serviceFilter !== 'all') {
    match.value = serviceFilter;
  }

  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$hour' } },
        events: { $sum: '$event_count' },
        visitors: { $sum: '$unique_visitors' },
        successful_events: { $sum: '$successful_events' },
        failed_events: { $sum: '$failed_events' }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: '$_id',
        events: 1,
        visitors: 1,
        successful_events: 1,
        failed_events: 1,
        success_rate: {
          $cond: [
            { $eq: ['$events', 0] },
            0,
            {
              $multiply: [{ $divide: ['$successful_events', '$events'] }, 100]
            }
          ]
        },
        _id: 0
      }
    }
  ]);
};

/**
 * Load the complete dashboard payload in one indexed aggregation.
 *
 * @param {Date} startDate Start of the selected range.
 * @param {Date} endDate End of the selected range.
 * @param {Object} [filters] Dashboard filters.
 * @returns {Promise<Object>} Faceted summary data.
 */
AnalyticsSummary.statics.getDashboardData = async function (
  startDate,
  endDate,
  filters = {}
) {
  const serviceFilter =
    filters.service && filters.service !== 'all' ? filters.service : null;
  const deviceFilter =
    filters.device_type && filters.device_type !== 'all'
      ? filters.device_type
      : null;
  const serviceMatch = deviceFilter
    ? { dimension: 'service_device', value2: deviceFilter }
    : { dimension: 'service' };

  if (serviceFilter) serviceMatch.value = serviceFilter;

  const groupDimension = (dimension, limit, includeValue2 = false) => {
    const pipeline = [
      { $match: { dimension } },
      {
        $group: {
          _id: includeValue2
            ? { value: '$value', value2: '$value2' }
            : '$value',
          event_count: { $sum: '$event_count' },
          unique_visitors: { $sum: '$unique_visitors' },
          landing_page_entries: { $sum: '$landing_page_entries' }
        }
      },
      { $sort: { unique_visitors: -1, event_count: -1 } }
    ];
    if (limit) pipeline.push({ $limit: limit });
    return pipeline;
  };

  const [result = {}] = await this.aggregate([
    {
      $match: {
        hour: { $gte: startDate, $lte: endDate },
        schema_version: CURRENT_SCHEMA_VERSION,
        is_complete: true
      }
    },
    {
      $facet: {
        hasData: [
          {
            $match: {
              dimension: { $ne: HOUR_MANIFEST_DIMENSION },
              aggregation_id: { $type: 'string' }
            }
          },
          { $limit: 1 },
          { $project: { _id: 1 } }
        ],
        overview: [
          { $match: serviceMatch },
          {
            $group: {
              _id: null,
              total_events: { $sum: '$event_count' },
              unique_visitors: { $sum: '$unique_visitors' },
              successful_events: { $sum: '$successful_events' },
              failed_events: { $sum: '$failed_events' }
            }
          },
          {
            $project: {
              _id: 0,
              total_events: 1,
              unique_visitors: 1,
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
        ],
        visitorsOverTime: [
          { $match: serviceMatch },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$hour' } },
              events: { $sum: '$event_count' },
              visitors: { $sum: '$unique_visitors' },
              successful_events: { $sum: '$successful_events' },
              failed_events: { $sum: '$failed_events' }
            }
          },
          { $sort: { _id: 1 } },
          {
            $project: {
              _id: 0,
              date: '$_id',
              events: 1,
              visitors: 1,
              successful_events: 1,
              failed_events: 1,
              success_rate: {
                $cond: [
                  { $eq: ['$events', 0] },
                  0,
                  {
                    $multiply: [
                      { $divide: ['$successful_events', '$events'] },
                      100
                    ]
                  }
                ]
              }
            }
          }
        ],
        sessionsByService: [
          {
            $match: deviceFilter
              ? { dimension: 'service_device', value2: deviceFilter }
              : { dimension: 'service' }
          },
          {
            $group: {
              _id: '$value',
              event_count: { $sum: '$event_count' },
              unique_visitors: { $sum: '$unique_visitors' }
            }
          },
          { $sort: { unique_visitors: -1, event_count: -1 } }
        ],
        topBrowsers: groupDimension('browser', 10),
        topOS: groupDimension('os', 10),
        topClientApps: groupDimension('client_app', 10),
        topReferrers: groupDimension('referrer', 20, true),
        topPages: groupDimension('pathname', 20),
        topLandingPages: [
          {
            $match: { dimension: 'pathname', landing_page_entries: { $gt: 0 } }
          },
          {
            $group: {
              _id: '$value',
              landing_page_entries: { $sum: '$landing_page_entries' },
              unique_visitors: { $sum: '$unique_visitors' }
            }
          },
          { $sort: { landing_page_entries: -1 } },
          { $limit: 10 }
        ],
        deviceTypes: groupDimension('device_type'),
        signupReferrers: [
          { $match: { dimension: 'signup_referrer' } },
          {
            $group: {
              _id: { referrer: '$value', source: '$value2' },
              count: { $sum: '$event_count' }
            }
          },
          { $sort: { count: -1 } },
          { $limit: 10 },
          {
            $project: {
              _id: 0,
              referrer: '$_id.referrer',
              source: '$_id.source',
              count: 1
            }
          }
        ],
        signupLandingPages: [
          { $match: { dimension: 'signup_landing_page' } },
          {
            $group: {
              _id: '$value',
              count: { $sum: '$event_count' }
            }
          },
          { $sort: { count: -1 } },
          { $limit: 10 },
          { $project: { _id: 0, landing_page: '$_id', count: 1 } }
        ],
        signupUTMSources: [
          { $match: { dimension: 'signup_utm' } },
          {
            $group: {
              _id: { source: '$value', metadata: '$value2' },
              count: { $sum: '$event_count' }
            }
          },
          { $sort: { count: -1 } },
          { $limit: 10 },
          {
            $project: {
              _id: 0,
              source: '$_id.source',
              metadata: '$_id.metadata',
              count: 1
            }
          }
        ]
      }
    }
  ]).allowDiskUse(true);

  result.hasData = (result.hasData || []).length > 0;
  const emptyOverview = {
    total_events: 0,
    unique_visitors: 0,
    successful_events: 0,
    failed_events: 0,
    success_rate: 0
  };

  if (!result.hasData) {
    return {
      hasData: false,
      overview: emptyOverview,
      visitorsOverTime: [],
      sessionsByService: [],
      topBrowsers: [],
      topOS: [],
      topClientApps: [],
      topReferrers: [],
      topPages: [],
      topLandingPages: [],
      deviceTypes: [],
      signupReferrers: [],
      signupLandingPages: [],
      signupUTMSources: []
    };
  }

  result.overview = result.overview?.[0] || emptyOverview;
  result.signupUTMSources = (result.signupUTMSources || []).map((entry) => {
    let metadata = {};
    try {
      metadata = JSON.parse(entry.metadata || '{}');
    } catch {}

    return {
      source: entry.source,
      medium: metadata.medium || null,
      campaign: metadata.campaign || null,
      count: entry.count
    };
  });

  return result;
};

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'LOGS_URI'
);
if (!conn) throw new Error('Mongoose connection does not exist');
const model = conn.model('AnalyticsSummary', AnalyticsSummary);
model.CURRENT_SCHEMA_VERSION = CURRENT_SCHEMA_VERSION;
model.HOUR_MANIFEST_DIMENSION = HOUR_MANIFEST_DIMENSION;
model.HOUR_MANIFEST_VALUE = HOUR_MANIFEST_VALUE;

module.exports = model;
