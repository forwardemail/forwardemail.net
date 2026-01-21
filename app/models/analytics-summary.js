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
 * This collection stores summarized metrics that would otherwise
 * require expensive aggregations over millions of raw events.
 */
const AnalyticsSummary = new mongoose.Schema({
  // Time bucket for this summary (hourly granularity)
  hour: {
    type: Date,
    required: true,
    index: true
  },

  // Aggregation dimensions
  service: {
    type: String,
    index: true
  },
  browser: {
    type: String,
    index: true
  },
  os: {
    type: String,
    index: true
  },
  device_type: {
    type: String,
    index: true
  },
  client_app: {
    type: String,
    index: true
  },
  referrer: {
    type: String,
    index: true
  },
  referrer_source: {
    type: String,
    index: true
  },
  pathname: {
    type: String,
    index: true
  },
  utm_source: {
    type: String,
    index: true
  },
  utm_campaign: {
    type: String,
    index: true
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

  // Metadata
  created_at: {
    type: Date,
    default: Date.now,
    index: true
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Compound indexes for common query patterns
// These support the dashboard queries efficiently
AnalyticsSummary.index({ hour: -1, service: 1 });
AnalyticsSummary.index({ hour: -1, browser: 1 });
AnalyticsSummary.index({ hour: -1, os: 1 });
AnalyticsSummary.index({ hour: -1, device_type: 1 });
AnalyticsSummary.index({ hour: -1, client_app: 1 });
AnalyticsSummary.index({ hour: -1, referrer: 1 });
AnalyticsSummary.index({ hour: -1, pathname: 1 });
AnalyticsSummary.index({ hour: -1, utm_source: 1 });

// Unique index to prevent duplicate summaries
AnalyticsSummary.index(
  {
    hour: 1,
    service: 1,
    browser: 1,
    os: 1,
    device_type: 1,
    client_app: 1,
    referrer: 1,
    pathname: 1
  },
  { unique: true, sparse: true }
);

// TTL index - keep summaries for 90 days
AnalyticsSummary.index(
  { created_at: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 }
);

// Pre-save hook to update timestamps
AnalyticsSummary.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

// Apply common plugin
AnalyticsSummary.plugin(mongooseCommonPlugin, {
  object: 'analytics_summary',
  locale: false
});

// Static method to get or create a summary for a specific hour and dimensions
AnalyticsSummary.statics.upsertSummary = async function (
  hour,
  dimensions,
  metrics
) {
  const query = {
    hour,
    ...dimensions
  };

  const update = {
    $inc: {
      event_count: metrics.event_count || 0,
      unique_visitors: metrics.unique_visitors || 0,
      successful_events: metrics.successful_events || 0,
      failed_events: metrics.failed_events || 0,
      landing_page_entries: metrics.landing_page_entries || 0
    },
    $set: {
      updated_at: new Date()
    },
    $setOnInsert: {
      created_at: new Date()
    }
  };

  return this.findOneAndUpdate(query, update, {
    upsert: true,
    new: true
  });
};

// Static method to get aggregated stats for a date range
AnalyticsSummary.statics.getAggregatedStats = async function (
  startDate,
  endDate,
  filters = {}
) {
  const match = {
    hour: { $gte: startDate, $lte: endDate }
  };

  if (filters.service) match.service = filters.service;
  if (filters.browser) match.browser = filters.browser;
  if (filters.device_type) match.device_type = filters.device_type;

  return this.aggregate([
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
};

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'LOGS_URI'
);
if (!conn) throw new Error('Mongoose connection does not exist');
module.exports = conn.model('AnalyticsSummary', AnalyticsSummary);
