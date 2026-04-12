/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');

const SUBJECT_TYPES = ['domain', 'ip'];
const REPUTATION_GRADES = ['A+', 'A', 'B', 'C', 'D', 'F'];

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'MONGO_URI'
);
if (!conn) {
  throw new Error('Mongoose connection does not exist');
}

const ObservatorySubjects = new mongoose.Schema({
  // What kind of entity this is
  type: {
    type: String,
    enum: SUBJECT_TYPES,
    required: true,
    index: true
  },

  // The domain name or IP address
  value: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },

  // Whether a paying user actively monitors this subject
  is_monitored: {
    type: Boolean,
    default: false,
    index: true
  },

  // Users subscribed to alerts for this subject
  monitored_by: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true
      },
      alerts_enabled: {
        type: Boolean,
        default: true
      },
      // ['email', 'webhook']
      alert_channels: [
        {
          type: String,
          enum: ['email', 'webhook']
        }
      ],
      webhook_url: {
        type: String,
        trim: true
      },
      // Subset of alert types the user cares about
      alert_types: [
        {
          type: String,
          enum: [
            'blacklist_listed',
            'blacklist_delisted',
            'dns_mx_changed',
            'dns_ns_changed',
            'dns_dmarc_downgraded',
            'dns_spf_misconfigured',
            'ct_suspicious_cert'
          ]
        }
      ]
    }
  ],

  // ── Reputation Score ──────────────────────────────────────────
  reputation_score: {
    type: Number,
    min: 0,
    max: 100,
    index: true
  },
  reputation_grade: {
    type: String,
    enum: REPUTATION_GRADES
  },
  last_scored_at: {
    type: Date
  },

  // ── DNS Snapshot ──────────────────────────────────────────────
  // Latest DNS state: { MX: [...], SPF: '...', DMARC: {...}, NS: [...], A: [...], AAAA: [...] }
  dns_snapshot: {
    type: mongoose.Schema.Types.Mixed
  },
  dns_snapshot_at: {
    type: Date
  },

  // ── Blacklist Summary ─────────────────────────────────────────
  blacklist_summary: {
    listed_count: {
      type: Number,
      default: 0
    },
    total_checked: {
      type: Number,
      default: 0
    },
    // Names of lists where this subject is currently listed
    lists: [String]
  },
  blacklist_summary_at: {
    type: Date
  },

  // ── Parsed DNS Fields (denormalized for queries) ──────────────
  dmarc_policy: {
    type: String,
    enum: ['none', 'quarantine', 'reject', null]
  },
  spf_record: {
    type: String
  },
  // Number of DNS lookups in the SPF record (>10 = misconfiguration)
  spf_lookup_count: {
    type: Number
  },

  // ── IP Enrichment ─────────────────────────────────────────────
  asn: {
    type: Number
  },
  asn_org: {
    type: String
  },
  country_code: {
    type: String,
    maxlength: 2
  }
});

// Unique compound index: one entry per (type, value)
ObservatorySubjects.index({ type: 1, value: 1 }, { unique: true });

// For querying a user's monitored subjects
ObservatorySubjects.index({ 'monitored_by.user': 1 });

// For the scoring job to find stale entries
ObservatorySubjects.index({ last_scored_at: 1 });

// For the blacklist job to find stale entries
ObservatorySubjects.index({ blacklist_summary_at: 1 });

// For the DNS monitor job to find stale entries
ObservatorySubjects.index({ type: 1, dns_snapshot_at: 1 });

ObservatorySubjects.plugin(mongooseCommonPlugin, {
  object: 'observatory_subject',
  locale: false
});

ObservatorySubjects.statics.SUBJECT_TYPES = SUBJECT_TYPES;
ObservatorySubjects.statics.REPUTATION_GRADES = REPUTATION_GRADES;

module.exports = conn.model('ObservatorySubjects', ObservatorySubjects);
