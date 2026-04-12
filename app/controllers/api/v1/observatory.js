/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { isIP } = require('node:net');

const Boom = require('@hapi/boom');
const Redis = require('@ladjs/redis');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const sharedConfig = require('@ladjs/shared-config');

const ObservatorySubjects = require('#models/observatory-subjects');
const ObservatoryBlacklistEvents = require('#models/observatory-blacklist-events');
const ObservatoryDnsSnapshots = require('#models/observatory-dns-snapshots');
const ObservatoryCtEvents = require('#models/observatory-ct-events');
const Domains = require('#models/domains');
const logger = require('#helpers/logger');
const { REDIS_PREFIXES, TTL } = require('#config/observatory');

// Lazy-init Redis client (same pattern as app/models/domains.js)
let _client;

function getClient() {
  if (!_client) {
    const breeSharedConfig = sharedConfig('BREE');
    _client = new Redis(breeSharedConfig.redis, logger);
  }

  return _client;
}

/**
 * Infer subject type from a value string.
 * @param {string} value
 * @returns {'ip'|'domain'}
 */
function inferType(value) {
  if (isIP(value)) return 'ip';
  return 'domain';
}

/**
 * Normalize a lookup value (lowercase, trim, punycode).
 * @param {string} value
 * @returns {string}
 */
function normalizeValue(value) {
  return value.toLowerCase().trim();
}

/**
 * GET /v1/observatory/lookup?q=<domain|ip>
 *
 * Public endpoint (rate-limited). Returns reputation data for any domain or IP.
 * If the subject doesn't exist yet, creates a skeleton and returns partial data.
 */
async function lookup(ctx) {
  const q = ctx.query.q || ctx.query.query;

  if (!isSANB(q)) {
    throw Boom.badRequest('Query parameter "q" is required');
  }

  const value = normalizeValue(q);
  const type = ctx.query.type || inferType(value);

  // Validate
  if (type === 'domain' && !isFQDN(value) && !isIP(value)) {
    throw Boom.badRequest('Invalid domain name');
  }

  if (type === 'ip' && !isIP(value)) {
    throw Boom.badRequest('Invalid IP address');
  }

  // Check Redis cache first
  const client = getClient();
  const cacheKey = `${REDIS_PREFIXES.lookup}${value}`;
  try {
    const cached = await client.get(cacheKey);
    if (cached) {
      ctx.body = JSON.parse(cached);
      return;
    }
  } catch {
    // Cache miss, proceed
  }

  // Look up or create the subject
  let subject = await ObservatorySubjects.findOne({ type, value })
    .select(
      'type value reputation_score reputation_grade blacklist_summary dns_snapshot dmarc_policy spf_record spf_lookup_count asn asn_org country_code last_scored_at blacklist_summary_at dns_snapshot_at'
    )
    .lean();

  let status = 'complete';

  if (!subject) {
    // Create a skeleton -- background jobs will populate it
    try {
      subject = await ObservatorySubjects.create({ type, value });
      subject = subject.toObject();
      status = 'pending';
    } catch (err) {
      // Handle duplicate key (race condition)
      if (err.code === 11000) {
        subject = await ObservatorySubjects.findOne({ type, value }).lean();
      } else {
        throw err;
      }
    }
  } else if (!subject.reputation_score && subject.reputation_score !== 0) {
    status = 'scoring';
  }

  const result = {
    status,
    type: subject.type,
    value: subject.value,
    reputation_score: subject.reputation_score ?? null,
    reputation_grade: subject.reputation_grade ?? null,
    blacklist_summary: subject.blacklist_summary || null,
    dns_summary: subject.dns_snapshot
      ? {
          has_mx: Boolean(
            subject.dns_snapshot.MX && subject.dns_snapshot.MX.length > 0
          ),
          has_spf: Boolean(subject.dns_snapshot.SPF),
          has_dmarc: Boolean(subject.dns_snapshot.DMARC),
          dmarc_policy: subject.dmarc_policy || null,
          spf_lookup_count: subject.spf_lookup_count || 0,
          ns_count: subject.dns_snapshot.NS ? subject.dns_snapshot.NS.length : 0
        }
      : null,
    asn: subject.asn || null,
    asn_org: subject.asn_org || null,
    country_code: subject.country_code || null,
    last_scored_at: subject.last_scored_at || null,
    blacklist_checked_at: subject.blacklist_summary_at || null,
    dns_checked_at: subject.dns_snapshot_at || null
  };

  // Cache the result
  if (status === 'complete') {
    try {
      await client.set(cacheKey, JSON.stringify(result), 'PX', TTL.lookupCache);
    } catch {
      // Non-critical
    }
  }

  ctx.body = result;
}

/**
 * GET /v1/observatory/lookup/:value/blacklists
 *
 * Public endpoint. Returns detailed per-DNSBL status and recent events.
 */
async function listBlacklists(ctx) {
  const value = normalizeValue(ctx.params.value);
  const type = ctx.query.type || inferType(value);

  const subject = await ObservatorySubjects.findOne({ type, value })
    .select('_id blacklist_summary blacklist_summary_at')
    .lean();

  if (!subject) {
    throw Boom.notFound('Subject not found. Use /v1/observatory/lookup first.');
  }

  // Get recent blacklist events
  const events = await ObservatoryBlacklistEvents.find({
    subject: subject._id
  })
    .sort({ detected_at: -1 })
    .limit(100)
    .select('list_name event_type detected_at raw_response')
    .lean();

  ctx.body = {
    blacklist_summary: subject.blacklist_summary || null,
    last_checked: subject.blacklist_summary_at || null,
    events: events.map((e) => ({
      list_name: e.list_name,
      event_type: e.event_type,
      detected_at: e.detected_at,
      raw_response: e.raw_response || null
    }))
  };
}

/**
 * GET /v1/observatory/lookup/:value/dns-history
 *
 * Public endpoint. Returns DNS snapshot change history.
 */
async function listDnsHistory(ctx) {
  const value = normalizeValue(ctx.params.value);
  const type = ctx.query.type || inferType(value);

  const subject = await ObservatorySubjects.findOne({ type, value })
    .select('_id dns_snapshot dns_snapshot_at')
    .lean();

  if (!subject) {
    throw Boom.notFound('Subject not found. Use /v1/observatory/lookup first.');
  }

  const snapshots = await ObservatoryDnsSnapshots.find({
    subject: subject._id
  })
    .sort({ detected_at: -1 })
    .limit(200)
    .select('record_type record_data previous_data change_type detected_at')
    .lean();

  ctx.body = {
    current_snapshot: subject.dns_snapshot || null,
    last_checked: subject.dns_snapshot_at || null,
    changes: snapshots.map((s) => ({
      record_type: s.record_type,
      change_type: s.change_type,
      record_data: s.record_data,
      previous_data: s.previous_data,
      detected_at: s.detected_at
    }))
  };
}

/**
 * GET /v1/observatory/lookup/:value/dmarc-summary
 *
 * Authenticated endpoint. Returns DMARC compliance summary for domains
 * the authenticated user owns.
 */
async function dmarcSummary(ctx) {
  const value = normalizeValue(ctx.params.value);

  // Verify the user owns this domain
  const domain = await Domains.findOne({
    name: value,
    'members.user': ctx.state.user._id
  })
    .select('_id')
    .lean();

  if (!domain) {
    throw Boom.notFound('Domain not found or you do not have access');
  }

  const subject = await ObservatorySubjects.findOne({
    type: 'domain',
    value
  })
    .select('_id reputation_score reputation_grade dmarc_policy')
    .lean();

  // Get recent CT events
  const ctEvents = subject
    ? await ObservatoryCtEvents.find({ subject: subject._id })
        .sort({ detected_at: -1 })
        .limit(25)
        .select(
          'issuer not_before not_after san_list is_suspicious detected_at'
        )
        .lean()
    : [];

  ctx.body = {
    domain: value,
    reputation_score: subject?.reputation_score ?? null,
    reputation_grade: subject?.reputation_grade ?? null,
    dmarc_policy: subject?.dmarc_policy || null,
    ct_events: ctEvents.map((e) => ({
      issuer: e.issuer,
      not_before: e.not_before,
      not_after: e.not_after,
      san_count: e.san_list?.length || 0,
      is_suspicious: e.is_suspicious,
      detected_at: e.detected_at
    }))
  };
}

/**
 * POST /v1/observatory/monitor
 *
 * Authenticated endpoint (paid plan). Add a domain or IP to the user's
 * monitoring list.
 */
async function addMonitor(ctx) {
  const { value: rawValue, type: rawType } = ctx.request.body;

  if (!isSANB(rawValue)) {
    throw Boom.badRequest('Field "value" is required');
  }

  const value = normalizeValue(rawValue);
  const type = rawType || inferType(value);

  if (type === 'domain' && !isFQDN(value)) {
    throw Boom.badRequest('Invalid domain name');
  }

  if (type === 'ip' && !isIP(value)) {
    throw Boom.badRequest('Invalid IP address');
  }

  // Find or create the subject
  let subject = await ObservatorySubjects.findOne({ type, value });

  if (!subject) {
    subject = await ObservatorySubjects.create({ type, value });
  }

  // Check if user is already monitoring this subject
  const alreadyMonitored = subject.monitored_by.some(
    (m) => m.user.toString() === ctx.state.user._id.toString()
  );

  if (alreadyMonitored) {
    throw Boom.conflict('You are already monitoring this subject');
  }

  // Add the user to monitored_by
  subject.monitored_by.push({
    user: ctx.state.user._id,
    alerts_enabled: true,
    alert_channels: ['email'],
    alert_types: []
  });
  subject.is_monitored = true;
  await subject.save();

  ctx.body = {
    id: subject._id,
    type: subject.type,
    value: subject.value,
    reputation_score: subject.reputation_score,
    reputation_grade: subject.reputation_grade,
    message: 'Monitor added successfully'
  };
}

/**
 * DELETE /v1/observatory/monitor/:value
 *
 * Authenticated endpoint. Remove a domain or IP from the user's
 * monitoring list.
 */
async function removeMonitor(ctx) {
  const value = normalizeValue(ctx.params.value);
  const type = ctx.query.type || inferType(value);

  const subject = await ObservatorySubjects.findOne({ type, value });

  if (!subject) {
    throw Boom.notFound('Subject not found');
  }

  const monitorIndex = subject.monitored_by.findIndex(
    (m) => m.user.toString() === ctx.state.user._id.toString()
  );

  if (monitorIndex === -1) {
    throw Boom.notFound('You are not monitoring this subject');
  }

  subject.monitored_by.splice(monitorIndex, 1);

  // If no one is monitoring anymore, mark as not monitored
  if (subject.monitored_by.length === 0) {
    subject.is_monitored = false;
  }

  await subject.save();

  ctx.body = {
    message: 'Monitor removed successfully'
  };
}

/**
 * GET /v1/observatory/monitors
 *
 * Authenticated endpoint. List the user's monitored subjects.
 */
async function listMonitors(ctx) {
  const subjects = await ObservatorySubjects.find({
    'monitored_by.user': ctx.state.user._id
  })
    .select(
      'type value reputation_score reputation_grade blacklist_summary dmarc_policy last_scored_at'
    )
    .sort({ updated_at: -1 })
    .lean();

  ctx.body = subjects.map((s) => ({
    id: s._id,
    type: s.type,
    value: s.value,
    reputation_score: s.reputation_score ?? null,
    reputation_grade: s.reputation_grade ?? null,
    blacklist_summary: s.blacklist_summary || null,
    dmarc_policy: s.dmarc_policy || null,
    last_scored_at: s.last_scored_at || null
  }));
}

module.exports = {
  lookup,
  listBlacklists,
  listDnsHistory,
  dmarcSummary,
  addMonitor,
  removeMonitor,
  listMonitors
};
