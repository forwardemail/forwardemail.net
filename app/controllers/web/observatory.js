/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { isIP } = require('node:net');

const Boom = require('@hapi/boom');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');

const ObservatorySubjects = require('#models/observatory-subjects');
const ObservatoryBlacklistEvents = require('#models/observatory-blacklist-events');
const ObservatoryDnsSnapshots = require('#models/observatory-dns-snapshots');
const ObservatoryCtEvents = require('#models/observatory-ct-events');

function inferType(value) {
  if (isIP(value)) return 'ip';
  return 'domain';
}

/**
 * GET /observatory
 *
 * Renders the public observatory search page.
 * If `q` query param is present, performs a lookup and renders results inline.
 */
async function observatoryLookup(ctx) {
  const q = ctx.query.q || '';

  if (!isSANB(q)) {
    // Just render the search page with no results
    return ctx.render('observatory/index', {
      q: '',
      result: null
    });
  }

  const value = q.toLowerCase().trim();
  const type = inferType(value);

  // Validate
  if (type === 'domain' && !isFQDN(value) && !isIP(value)) {
    ctx.flash('error', ctx.translate('INVALID_DOMAIN'));
    return ctx.render('observatory/index', {
      q: value,
      result: null
    });
  }

  if (type === 'ip' && !isIP(value)) {
    ctx.flash('error', ctx.translate('INVALID_IP'));
    return ctx.render('observatory/index', {
      q: value,
      result: null
    });
  }

  // Look up or create the subject
  let subject = await ObservatorySubjects.findOne({ type, value }).lean();
  let status = 'complete';

  if (!subject) {
    try {
      const created = await ObservatorySubjects.create({ type, value });
      subject = created.toObject();
      status = 'pending';
    } catch (err) {
      if (err.code === 11000) {
        subject = await ObservatorySubjects.findOne({ type, value }).lean();
      } else {
        throw err;
      }
    }
  } else if (!subject.reputation_score && subject.reputation_score !== 0) {
    status = 'scoring';
  }

  return ctx.render('observatory/index', {
    q: value,
    result: {
      status,
      type: subject.type,
      value: subject.value,
      reputation_score: subject.reputation_score ?? null,
      reputation_grade: subject.reputation_grade ?? null,
      blacklist_summary: subject.blacklist_summary || null,
      dns_snapshot: subject.dns_snapshot || null,
      dmarc_policy: subject.dmarc_policy || null,
      spf_record: subject.spf_record || null,
      spf_lookup_count: subject.spf_lookup_count || 0,
      asn: subject.asn || null,
      asn_org: subject.asn_org || null,
      country_code: subject.country_code || null,
      last_scored_at: subject.last_scored_at || null
    }
  });
}

/**
 * GET /observatory/report/:value
 *
 * Renders a detailed report page for a single domain or IP.
 */
async function observatoryReport(ctx) {
  const value = ctx.params.value?.toLowerCase().trim();

  if (!isSANB(value)) {
    throw Boom.badRequest('Value parameter is required');
  }

  const type = ctx.query.type || inferType(value);

  const subject = await ObservatorySubjects.findOne({ type, value }).lean();

  if (!subject) {
    // Redirect to search with the query
    return ctx.redirect(
      `${ctx.state.l('/observatory')}?q=${encodeURIComponent(value)}`
    );
  }

  // Fetch blacklist events
  const blacklistEvents = await ObservatoryBlacklistEvents.find({
    subject: subject._id
  })
    .sort({ detected_at: -1 })
    .limit(50)
    .lean();

  // Fetch DNS change history
  const dnsChanges = await ObservatoryDnsSnapshots.find({
    subject: subject._id
  })
    .sort({ detected_at: -1 })
    .limit(50)
    .lean();

  // Fetch CT events (for domains only)
  let ctEvents = [];
  if (type === 'domain') {
    ctEvents = await ObservatoryCtEvents.find({
      subject: subject._id
    })
      .sort({ detected_at: -1 })
      .limit(25)
      .lean();
  }

  return ctx.render('observatory/detail', {
    subject,
    blacklistEvents,
    dnsChanges,
    ctEvents
  });
}

/**
 * GET /my-account/observatory
 *
 * Renders the authenticated observatory monitoring dashboard.
 */
async function listMonitors(ctx) {
  const subjects = await ObservatorySubjects.find({
    'monitored_by.user': ctx.state.user._id
  })
    .sort({ updated_at: -1 })
    .lean();

  return ctx.render('my-account/observatory/index', {
    subjects
  });
}

/**
 * POST /my-account/observatory/monitor
 *
 * Add a domain or IP to the user's monitoring list.
 */
async function addMonitor(ctx) {
  const rawValue = ctx.request.body.value;

  if (!isSANB(rawValue)) {
    throw Boom.badRequest(ctx.translateError('INVALID_DENYLIST_VALUE'));
  }

  const value = rawValue.toLowerCase().trim();
  const type = ctx.request.body.type || inferType(value);

  if (type === 'domain' && !isFQDN(value)) {
    throw Boom.badRequest(ctx.translateError('INVALID_DOMAIN'));
  }

  if (type === 'ip' && !isIP(value)) {
    throw Boom.badRequest(ctx.translateError('INVALID_IP'));
  }

  // Find or create subject
  let subject = await ObservatorySubjects.findOne({ type, value });

  if (!subject) {
    subject = await ObservatorySubjects.create({ type, value });
  }

  // Check duplicate
  const already = subject.monitored_by.some(
    (m) => m.user.toString() === ctx.state.user._id.toString()
  );

  if (!already) {
    subject.monitored_by.push({
      user: ctx.state.user._id,
      alerts_enabled: true,
      alert_channels: ['email'],
      alert_types: []
    });
    subject.is_monitored = true;
    await subject.save();
  }

  if (ctx.accepts('html')) {
    ctx.flash('success', ctx.translate('REQUEST_OK'));
    ctx.redirect(ctx.state.l('/my-account/observatory'));
  } else {
    ctx.body = { message: 'Monitor added' };
  }
}

/**
 * POST /my-account/observatory/monitor/:id/remove
 *
 * Remove a domain or IP from the user's monitoring list.
 */
async function removeMonitor(ctx) {
  const subject = await ObservatorySubjects.findById(ctx.params.id);

  if (!subject) {
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE'));
  }

  const idx = subject.monitored_by.findIndex(
    (m) => m.user.toString() === ctx.state.user._id.toString()
  );

  if (idx !== -1) {
    subject.monitored_by.splice(idx, 1);
    if (subject.monitored_by.length === 0) {
      subject.is_monitored = false;
    }

    await subject.save();
  }

  if (ctx.accepts('html')) {
    ctx.flash('success', ctx.translate('REQUEST_OK'));
    ctx.redirect(ctx.state.l('/my-account/observatory'));
  } else {
    ctx.body = { message: 'Monitor removed' };
  }
}

module.exports = {
  observatoryLookup,
  observatoryReport,
  listMonitors,
  addMonitor,
  removeMonitor
};
