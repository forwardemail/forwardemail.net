/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');

const config = require('#config');

// Service types that can be tracked
const SERVICE_TYPES = [
  'smtp',
  'imap',
  'pop3',
  'api',
  'web',
  'caldav',
  'carddav',
  'mx'
];

// Event types that can be tracked
const EVENT_TYPES = [
  'auth', // Authentication/login event
  'session', // Session start
  'pageview', // Web page view
  'api_call' // API endpoint call
];

// Device types derived from user agent
const DEVICE_TYPES = ['desktop', 'mobile', 'tablet', 'unknown'];

/**
 * AnalyticsEvents Schema
 *
 * Privacy-focused analytics tracking:
 * - NO IP addresses stored
 * - NO cookies or persistent identifiers for analytics
 * - User agents parsed and raw UA discarded
 * - 30-day automatic expiration via TTL index
 */
const AnalyticsEvents = new mongoose.Schema({
  // Event identification
  event_type: {
    type: String,
    enum: EVENT_TYPES,
    required: true,
    index: true
  },
  service: {
    type: String,
    enum: SERVICE_TYPES,
    required: true,
    index: true
  },

  // User context (privacy-focused - no PII)
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    index: true
  },
  domain: {
    type: mongoose.Schema.ObjectId,
    ref: 'Domains',
    index: true
  },

  // Session tracking (daily rotating hash for unique visitor tracking)
  // This is NOT a persistent identifier - it rotates daily
  session_hash: {
    type: String,
    index: true
  },

  // Parsed from User-Agent (raw UA NOT stored)
  browser: {
    type: String,
    maxlength: 50,
    index: true
  },
  browser_version: {
    type: String,
    maxlength: 20
  },
  os: {
    type: String,
    maxlength: 50,
    index: true
  },
  os_version: {
    type: String,
    maxlength: 20
  },
  device_type: {
    type: String,
    enum: DEVICE_TYPES,
    default: 'unknown',
    index: true
  },
  // Email client app (Thunderbird, Apple Mail, Outlook, etc.)
  client_app: {
    type: String,
    maxlength: 100,
    index: true
  },

  // Web-specific fields
  referrer: {
    type: String,
    maxlength: 255 // Domain only, not full URL
  },
  referrer_source: {
    type: String,
    maxlength: 50, // Categorized: 'search', 'social', 'direct', etc.
    index: true
  },
  pathname: {
    type: String,
    maxlength: 500,
    index: true
  },

  // Landing page tracking (first page in session)
  is_landing_page: {
    type: Boolean,
    default: false,
    index: true
  },

  // UTM tracking
  utm_source: {
    type: String,
    maxlength: 100,
    index: true
  },
  utm_medium: {
    type: String,
    maxlength: 100
  },
  utm_campaign: {
    type: String,
    maxlength: 100,
    index: true
  },
  utm_content: {
    type: String,
    maxlength: 100
  },
  utm_term: {
    type: String,
    maxlength: 100
  },

  // Timing and status
  duration: {
    type: Number, // Session duration in milliseconds
    min: 0
  },
  success: {
    type: Boolean,
    default: true,
    index: true
  },
  error_code: {
    type: String,
    maxlength: 50
  },

  // Server/hostname that processed the request
  hostname: {
    type: String,
    maxlength: 100,
    index: true
  },

  // Timestamp with 30-day TTL
  created_at: {
    type: Date,
    default: Date.now,
    expires: config.analyticsRetention || '30d',
    index: true
  }
});

// Compound indexes for common query patterns
AnalyticsEvents.index({ service: 1, created_at: -1 });
AnalyticsEvents.index({ event_type: 1, service: 1, created_at: -1 });
AnalyticsEvents.index({ browser: 1, created_at: -1 });
AnalyticsEvents.index({ client_app: 1, created_at: -1 });
AnalyticsEvents.index({ referrer_source: 1, created_at: -1 });
AnalyticsEvents.index({ pathname: 1, created_at: -1 });
AnalyticsEvents.index({ utm_source: 1, created_at: -1 });
AnalyticsEvents.index({ device_type: 1, created_at: -1 });
AnalyticsEvents.index({ success: 1, service: 1, created_at: -1 });

// Index for unique visitor counting (session_hash per day)
AnalyticsEvents.index({ session_hash: 1, created_at: 1 });

// Index for user-specific analytics
AnalyticsEvents.index({ user: 1, created_at: -1 });
AnalyticsEvents.index({ domain: 1, created_at: -1 });

// Index for landing page queries
AnalyticsEvents.index({ is_landing_page: 1, pathname: 1, created_at: -1 });

// Apply common plugin
AnalyticsEvents.plugin(mongooseCommonPlugin, {
  object: 'analytics_event',
  locale: false
});

// Static method to get service types
AnalyticsEvents.statics.SERVICE_TYPES = SERVICE_TYPES;
AnalyticsEvents.statics.EVENT_TYPES = EVENT_TYPES;
AnalyticsEvents.statics.DEVICE_TYPES = DEVICE_TYPES;

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'LOGS_URI'
);
if (!conn) throw new Error('Mongoose connection does not exist');
module.exports = conn.model('AnalyticsEvents', AnalyticsEvents);
