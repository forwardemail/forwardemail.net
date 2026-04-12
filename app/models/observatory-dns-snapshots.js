/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const ms = require('ms');

const RECORD_TYPES = ['MX', 'SPF', 'DMARC', 'DKIM', 'NS', 'A', 'AAAA'];
const CHANGE_TYPES = ['initial', 'modified', 'removed', 'added'];

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'LOGS_URI'
);
if (!conn) throw new Error('Mongoose connection does not exist');

const ObservatoryDnsSnapshots = new mongoose.Schema({
  // Reference to the subject (domain)
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

  // Which DNS record type changed
  record_type: {
    type: String,
    enum: RECORD_TYPES,
    required: true,
    index: true
  },

  // The new record data
  record_data: {
    type: mongoose.Schema.Types.Mixed
  },

  // What it was before (null for initial snapshots)
  previous_data: {
    type: mongoose.Schema.Types.Mixed
  },

  // Type of change
  change_type: {
    type: String,
    enum: CHANGE_TYPES,
    required: true
  },

  // When this change was detected
  detected_at: {
    type: Date,
    required: true,
    index: true
  },

  // TTL: auto-expire after 365 days
  created_at: {
    type: Date,
    default: Date.now,
    expires: ms('365d') / 1000
  }
});

// For querying a subject's DNS change history
ObservatoryDnsSnapshots.index({
  subject: 1,
  record_type: 1,
  detected_at: -1
});

ObservatoryDnsSnapshots.plugin(mongooseCommonPlugin, {
  object: 'observatory_dns_snapshot',
  locale: false
});

ObservatoryDnsSnapshots.statics.RECORD_TYPES = RECORD_TYPES;
ObservatoryDnsSnapshots.statics.CHANGE_TYPES = CHANGE_TYPES;

module.exports = conn.model('ObservatoryDnsSnapshots', ObservatoryDnsSnapshots);
