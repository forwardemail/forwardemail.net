/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');

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
      'service',
      'browser',
      'os',
      'device_type',
      'client_app',
      'referrer',
      'pathname',
      'utm'
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
  }
});

// Primary query index: hour range + dimension type
// This supports all dashboard queries efficiently
AnalyticsSummary.index({ hour: 1, dimension: 1 });

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
 * Upsert a summary document
 * @param {Object} options - Upsert options
 * @param {Date} options.hour - Hour bucket
 * @param {string} options.dimension - Dimension type (service, browser, etc.)
 * @param {string} options.value - Dimension value
 * @param {Object} options.metrics - Metrics to increment
 * @param {string} [options.value2] - Secondary value for compound dimensions
 */
AnalyticsSummary.statics.upsertSummary = async function (options) {
  const { hour, dimension, value, metrics, value2 = null } = options;
  const query = {
    hour,
    dimension,
    value
  };

  if (value2 !== null) {
    query.value2 = value2;
  }

  const update = {
    $inc: {
      event_count: metrics.event_count || 0,
      unique_visitors: metrics.unique_visitors || 0,
      successful_events: metrics.successful_events || 0,
      failed_events: metrics.failed_events || 0,
      landing_page_entries: metrics.landing_page_entries || 0
    }
  };

  // Use findOneAndUpdate with upsert to ensure id field is set
  // The mongoose-common-plugin sets id in pre('save'), but upserts bypass save hooks
  // So we use $setOnInsert to set id and object on insert
  const objectId = new mongoose.Types.ObjectId();
  update.$setOnInsert = {
    id: objectId.toString(),
    object: 'analytics_summary'
  };

  return this.updateOne(query, update, { upsert: true });
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
        dimension
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
    dimension: 'service'
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
    dimension: 'service'
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
        visitors: { $sum: '$unique_visitors' }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: '$_id',
        events: 1,
        visitors: 1,
        _id: 0
      }
    }
  ]);
};

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'LOGS_URI'
);
if (!conn) throw new Error('Mongoose connection does not exist');
module.exports = conn.model('AnalyticsSummary', AnalyticsSummary);
