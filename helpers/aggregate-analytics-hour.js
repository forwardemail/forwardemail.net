/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const dayjs = require('dayjs-with-plugins');

const AnalyticsEvents = require('#models/analytics-events');
const AnalyticsSummary = require('#models/analytics-summary');
const { Users } = require('#models');

const EVENT_PROJECTION = [
  'service',
  'browser',
  'browser_version',
  'os',
  'os_version',
  'device_type',
  'client_app',
  'client_app_version',
  'referrer',
  'referrer_source',
  'pathname',
  'utm_source',
  'utm_campaign',
  'session_hash',
  'success',
  'is_landing_page'
].join(' ');

const USER_PROJECTION = [
  'signup_referrer',
  'signup_referrer_source',
  'signup_landing_page',
  'signup_utm_source',
  'signup_utm_medium',
  'signup_utm_campaign'
].join(' ');

function formatDimension(name, version) {
  const normalizedName = String(name || 'Unknown').trim() || 'Unknown';
  const normalizedVersion = String(version || '').trim();
  return normalizedVersion
    ? `${normalizedName} ${normalizedVersion}`
    : normalizedName;
}

function incrementEventDimension(countsByKey, sessionsByKey, key, event) {
  if (!countsByKey.has(key)) {
    countsByKey.set(key, {
      event_count: 0,
      successful_events: 0,
      failed_events: 0,
      landing_page_entries: 0
    });
    sessionsByKey.set(key, new Set());
  }

  const counts = countsByKey.get(key);
  counts.event_count++;
  if (event.success === true) counts.successful_events++;
  if (event.success === false) counts.failed_events++;
  if (event.is_landing_page) counts.landing_page_entries++;
  sessionsByKey.get(key).add(event.session_hash || 'unknown');
}

function incrementCount(countsByKey, key, metadata = {}) {
  if (!countsByKey.has(key)) {
    countsByKey.set(key, { count: 0, ...metadata });
  }

  countsByKey.get(key).count++;
}

function appendEventSummaries(summaries, dimension, maps, options = {}) {
  const { countsByKey, sessionsByKey } = maps;
  const entries = [...countsByKey.entries()].sort(
    (a, b) => b[1].event_count - a[1].event_count
  );

  for (const [key, counts] of options.limit
    ? entries.slice(0, options.limit)
    : entries) {
    summaries.push({
      dimension,
      value: options.getValue ? options.getValue(counts, key) : key,
      value2: options.getValue2 ? options.getValue2(counts, key) : null,
      metrics: {
        event_count: counts.event_count,
        unique_visitors: sessionsByKey.get(key).size,
        successful_events: counts.successful_events,
        failed_events: counts.failed_events,
        landing_page_entries: counts.landing_page_entries
      }
    });
  }
}

function appendCountSummaries(summaries, dimension, countsByKey, options = {}) {
  const entries = [...countsByKey.entries()].sort(
    (a, b) => b[1].count - a[1].count
  );

  for (const [key, counts] of options.limit
    ? entries.slice(0, options.limit)
    : entries) {
    summaries.push({
      dimension,
      value: options.getValue ? options.getValue(counts, key) : key,
      value2: options.getValue2 ? options.getValue2(counts, key) : null,
      metrics: { event_count: counts.count }
    });
  }
}

/**
 * Build and atomically publish every analytics summary for one hour.
 *
 * The same implementation is used by the recurring Bree worker and the
 * migration backfill so retries cannot drift or silently omit dimensions.
 *
 * @param {Date} hourStart Start of the UTC hour.
 * @param {Object} [options] Aggregation options.
 * @param {Function} [options.isCancelled] Cooperative cancellation callback.
 * @returns {Promise<Object>} Processing counts and publication status.
 */
async function aggregateAnalyticsHour(hourStart, options = {}) {
  const isCancelled = options.isCancelled || (() => false);
  const hourEnd = dayjs(hourStart).add(1, 'hour').toDate();
  const range = { $gte: hourStart, $lt: hourEnd };

  const serviceCounts = new Map();
  const serviceSessions = new Map();
  const serviceDeviceCounts = new Map();
  const serviceDeviceSessions = new Map();
  const browserCounts = new Map();
  const browserSessions = new Map();
  const osCounts = new Map();
  const osSessions = new Map();
  const deviceCounts = new Map();
  const deviceSessions = new Map();
  const clientAppCounts = new Map();
  const clientAppSessions = new Map();
  const referrerCounts = new Map();
  const referrerSessions = new Map();
  const pathnameCounts = new Map();
  const pathnameSessions = new Map();
  const utmCounts = new Map();
  const utmSessions = new Map();

  let eventCount = 0;
  for await (const event of AnalyticsEvents.find({ created_at: range })
    .select(EVENT_PROJECTION)
    .lean()
    .cursor()
    .addCursorFlag('noCursorTimeout', true)) {
    if (isCancelled()) return { cancelled: true, processed: eventCount };

    eventCount++;
    const service = event.service || 'unknown';
    const deviceType = event.device_type || 'unknown';
    const browser = formatDimension(event.browser, event.browser_version);
    const os = formatDimension(event.os, event.os_version);

    incrementEventDimension(serviceCounts, serviceSessions, service, event);
    incrementEventDimension(
      serviceDeviceCounts,
      serviceDeviceSessions,
      JSON.stringify([service, deviceType]),
      event
    );
    incrementEventDimension(browserCounts, browserSessions, browser, event);
    incrementEventDimension(osCounts, osSessions, os, event);
    incrementEventDimension(deviceCounts, deviceSessions, deviceType, event);

    if (event.client_app) {
      const clientApp = formatDimension(
        event.client_app,
        event.client_app_version
      );
      incrementEventDimension(
        clientAppCounts,
        clientAppSessions,
        clientApp,
        event
      );
    }

    if (event.referrer) {
      const key = JSON.stringify([
        event.referrer,
        event.referrer_source || null
      ]);
      incrementEventDimension(referrerCounts, referrerSessions, key, event);
    }

    if (event.pathname && service === 'web') {
      incrementEventDimension(
        pathnameCounts,
        pathnameSessions,
        event.pathname,
        event
      );
    }

    if (event.utm_source) {
      const key = JSON.stringify([
        event.utm_source,
        event.utm_campaign || null
      ]);
      incrementEventDimension(utmCounts, utmSessions, key, event);
    }
  }

  if (isCancelled()) return { cancelled: true, processed: eventCount };

  const signupReferrers = new Map();
  const signupLandingPages = new Map();
  const signupUTMSources = new Map();
  let signupCount = 0;

  for await (const user of Users.find({
    created_at: range,
    $or: [
      { signup_referrer: { $exists: true } },
      { signup_landing_page: { $exists: true } },
      { signup_utm_source: { $exists: true } }
    ]
  })
    .select(USER_PROJECTION)
    .lean()
    .cursor()
    .addCursorFlag('noCursorTimeout', true)) {
    if (isCancelled())
      return { cancelled: true, processed: eventCount, signups: signupCount };

    signupCount++;
    if (user.signup_referrer) {
      const key = JSON.stringify([
        user.signup_referrer,
        user.signup_referrer_source || null
      ]);
      incrementCount(signupReferrers, key);
    }

    if (user.signup_landing_page) {
      incrementCount(signupLandingPages, user.signup_landing_page);
    }

    if (user.signup_utm_source) {
      const metadata = {
        source: user.signup_utm_source,
        medium: user.signup_utm_medium || null,
        campaign: user.signup_utm_campaign || null
      };
      incrementCount(signupUTMSources, JSON.stringify(metadata), metadata);
    }
  }

  if (isCancelled())
    return { cancelled: true, processed: eventCount, signups: signupCount };

  const summaries = [];
  appendEventSummaries(summaries, 'service', {
    countsByKey: serviceCounts,
    sessionsByKey: serviceSessions
  });
  appendEventSummaries(
    summaries,
    'service_device',
    {
      countsByKey: serviceDeviceCounts,
      sessionsByKey: serviceDeviceSessions
    },
    {
      getValue(counts, key) {
        return JSON.parse(key)[0];
      },
      getValue2(counts, key) {
        return JSON.parse(key)[1];
      }
    }
  );
  appendEventSummaries(
    summaries,
    'browser',
    { countsByKey: browserCounts, sessionsByKey: browserSessions },
    { limit: 50 }
  );
  appendEventSummaries(
    summaries,
    'os',
    { countsByKey: osCounts, sessionsByKey: osSessions },
    { limit: 50 }
  );
  appendEventSummaries(summaries, 'device_type', {
    countsByKey: deviceCounts,
    sessionsByKey: deviceSessions
  });
  appendEventSummaries(
    summaries,
    'client_app',
    { countsByKey: clientAppCounts, sessionsByKey: clientAppSessions },
    { limit: 50 }
  );
  appendEventSummaries(
    summaries,
    'referrer',
    { countsByKey: referrerCounts, sessionsByKey: referrerSessions },
    {
      limit: 100,
      getValue(counts, key) {
        return JSON.parse(key)[0];
      },
      getValue2(counts, key) {
        return JSON.parse(key)[1];
      }
    }
  );
  appendEventSummaries(
    summaries,
    'pathname',
    { countsByKey: pathnameCounts, sessionsByKey: pathnameSessions },
    { limit: 100 }
  );
  appendEventSummaries(
    summaries,
    'utm',
    { countsByKey: utmCounts, sessionsByKey: utmSessions },
    {
      limit: 50,
      getValue(counts, key) {
        return JSON.parse(key)[0];
      },
      getValue2(counts, key) {
        return JSON.parse(key)[1];
      }
    }
  );

  appendCountSummaries(summaries, 'signup_referrer', signupReferrers, {
    limit: 100,
    getValue(counts, key) {
      return JSON.parse(key)[0];
    },
    getValue2(counts, key) {
      return JSON.parse(key)[1];
    }
  });
  appendCountSummaries(summaries, 'signup_landing_page', signupLandingPages, {
    limit: 100
  });
  appendCountSummaries(summaries, 'signup_utm', signupUTMSources, {
    limit: 100,
    getValue(counts) {
      return counts.source;
    },
    getValue2(counts) {
      return JSON.stringify({
        medium: counts.medium,
        campaign: counts.campaign
      });
    }
  });

  await AnalyticsSummary.replaceHour(hourStart, summaries);

  return {
    cancelled: false,
    processed: eventCount,
    signups: signupCount,
    summaries: summaries.length
  };
}

module.exports = aggregateAnalyticsHour;
module.exports.formatDimension = formatDimension;
