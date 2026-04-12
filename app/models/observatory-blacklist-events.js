/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const ms = require('ms');

const EVENT_TYPES = ['listed', 'delisted'];
const SUBJECT_TYPES = ['domain', 'ip'];

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'LOGS_URI'
);
if (!conn) throw new Error('Mongoose connection does not exist');

const ObservatoryBlacklistEvents = new mongoose.Schema({
  // Reference to the subject (domain or IP)
  subject: {
    type: mongoose.Schema.ObjectId,
    ref: 'ObservatorySubjects',
    index: true
  },

  // Denormalized for queries without joins
  subject_value: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  subject_type: {
    type: String,
    enum: SUBJECT_TYPES,
    required: true
  },

  // Which blacklist (matches name from config/observatory.js DNSBL_LISTS)
  list_name: {
    type: String,
    required: true,
    index: true
  },

  // Whether the subject was listed or delisted
  event_type: {
    type: String,
    enum: EVENT_TYPES,
    required: true,
    index: true
  },

  // When this listing/delisting was first detected
  detected_at: {
    type: Date,
    required: true,
    index: true
  },

  // Raw DNS TXT response or lookup result
  raw_response: {
    type: String
  },

  // TTL: auto-expire after 365 days
  created_at: {
    type: Date,
    default: Date.now,
    expires: ms('365d') / 1000 // mongoose uses seconds for TTL
  }
});

// For querying a subject's blacklist history
ObservatoryBlacklistEvents.index({
  subject: 1,
  list_name: 1,
  detected_at: -1
});

// For querying recent events across all subjects
ObservatoryBlacklistEvents.index({
  list_name: 1,
  event_type: 1,
  detected_at: -1
});

ObservatoryBlacklistEvents.plugin(mongooseCommonPlugin, {
  object: 'observatory_blacklist_event',
  locale: false
});

module.exports = conn.model(
  'ObservatoryBlacklistEvents',
  ObservatoryBlacklistEvents
);
