/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const ms = require('ms');

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'LOGS_URI'
);
if (!conn) throw new Error('Mongoose connection does not exist');

const ObservatoryCtEvents = new mongoose.Schema({
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

  // SHA-256 hash of the certificate (for deduplication)
  certificate_hash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  // Certificate Authority that issued the cert
  issuer: {
    type: String,
    index: true
  },

  // Validity period
  not_before: {
    type: Date
  },
  not_after: {
    type: Date
  },

  // Subject Alternative Names on the certificate
  san_list: [String],

  // Which CT log reported this
  ct_log_name: {
    type: String
  },

  // Flagged if the issuer is not an expected CA for this domain
  is_suspicious: {
    type: Boolean,
    default: false,
    index: true
  },

  // When this certificate was first seen in CT logs
  detected_at: {
    type: Date,
    required: true
  },

  // TTL: auto-expire after 365 days
  created_at: {
    type: Date,
    default: Date.now,
    expires: ms('365d') / 1000
  }
});

// For querying a subject's CT event history
ObservatoryCtEvents.index({ subject: 1, detected_at: -1 });

// For finding suspicious certs
ObservatoryCtEvents.index({ is_suspicious: 1, detected_at: -1 });

ObservatoryCtEvents.plugin(mongooseCommonPlugin, {
  object: 'observatory_ct_event',
  locale: false
});

module.exports = conn.model('ObservatoryCtEvents', ObservatoryCtEvents);
