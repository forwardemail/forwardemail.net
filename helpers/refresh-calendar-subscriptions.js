/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');

const Aliases = require('#models/aliases');
const CalendarEvents = require('#models/calendar-events');
const Calendars = require('#models/calendars');
const config = require('#config');
const deduplicateCalendarEvents = require('#helpers/deduplicate-calendar-events');
const fetchCalendarFeed = require('#helpers/fetch-calendar-feed');
const parseCalendarFeed = require('#helpers/parse-calendar-feed');
const sendNotification = require('#helpers/send-notification');
const updateStorageUsed = require('#helpers/update-storage-used');
const { sendApnCalendar } = require('#helpers/send-apn');

const { redactFeedUrl } = fetchCalendarFeed;
const { signature } = parseCalendarFeed;

//
// Calendars subscribed to a feed (`webcal://`).
//
// A calendar lives in its alias' encrypted database, which can only be opened
// with the alias' password, so a scheduled job cannot refresh one. A feed is
// refreshed instead while its owner is signed in (a CalDAV or API request),
// in the background of that request and no more often than its interval, the
// same way invites queued for an alias are applied (see
// helpers/process-calendar-invites.js). The address of the feed, which often
// holds a secret token, and everything fetched from it therefore never leave
// that database, and the host of the feed sees our address, not the user's.
//
const MIN_INTERVAL = ms('15m');
const MAX_INTERVAL = ms('7d');
// (of a feed that names none)
const DEFAULT_INTERVAL = ms('1h');
// (a tenth either way, so the feeds of a host are not all asked for at once)
const JITTER = 0.1;
const MAX_BACKOFF = ms('1d');
// consecutive failures (about two days of them) before a feed is paused
const MAX_FAILURES = 8;
// failures that trying again will not mend
const PERMANENT = new Set([
  'FEED_URL_INVALID',
  'FEED_HTTP_NOT_ALLOWED',
  'FEED_PRIVATE_ADDRESS'
]);

const LOCK_PREFIX = 'caldav_sub_lock:';
const LOCK_TTL = ms('2m');
// (how long an alias found to have nothing due is not looked at again)
const CHECKED_PREFIX = 'caldav_sub_checked:';
const CHECKED_TTL = ms('1m');

const inflight = new Map();

// (a refresh asked for by hand is not sent to the host of a feed more often
// than this)
//
// (and the least a feed may ask to be refreshed after; both are here so that
// tests can shorten them)
const limits = { manualRefreshInterval: ms('1m'), minInterval: MIN_INTERVAL };

function feedError(code, message) {
  return Object.assign(new Error(message), { code, isFeedError: true });
}

function isSubscription(calendar) {
  return Boolean(
    calendar &&
      calendar.readonly &&
      typeof calendar.source === 'string' &&
      calendar.source.trim() !== ''
  );
}

function refreshInterval(ttl) {
  const interval =
    Number.isFinite(ttl) && ttl > 0 ? Number(ttl) : DEFAULT_INTERVAL;
  return Math.min(MAX_INTERVAL, Math.max(limits.minInterval, interval));
}

function withJitter(interval, random = Math.random()) {
  return Math.round(interval * (1 + (random * 2 - 1) * JITTER));
}

function backoff(failures, retryAfter) {
  const delay = Math.min(
    MAX_BACKOFF,
    MIN_INTERVAL * 2 ** Math.max(0, failures - 1)
  );
  return Number.isFinite(retryAfter)
    ? Math.min(MAX_BACKOFF, Math.max(delay, retryAfter))
    : delay;
}

function isDue(calendar, now = Date.now()) {
  if (!isSubscription(calendar) || calendar.subscription_paused_at)
    return false;
  const next = calendar.subscription_next_refresh_at;
  return !next || new Date(next).getTime() <= now;
}

function bumpSyncToken(synctoken) {
  const base = `${config.urls.web}/ns/sync-token`;
  if (typeof synctoken !== 'string' || !synctoken.startsWith('http'))
    return `${base}/1`;
  const parts = synctoken.split('/');
  const number = Number.parseInt(parts.pop(), 10);
  return Number.isNaN(number)
    ? `${base}/1`
    : `${parts.join('/')}/${number + 1}`;
}

// What an API response and a notification say of a subscription.
function subscriptionJson(calendar) {
  if (!isSubscription(calendar)) return null;
  return {
    url: calendar.source,
    host: redactFeedUrl(calendar.source).replace(/^https?:\/\/|\/…$/g, ''),
    status: calendar.subscription_paused_at
      ? 'paused'
      : calendar.subscription_failures > 0
      ? 'failing'
      : 'active',
    error: calendar.subscription_error || null,
    refresh_interval: Math.round(refreshInterval(calendar.ttl) / 1000),
    refreshed_at: calendar.subscription_refreshed_at || null,
    next_refresh_at: calendar.subscription_paused_at
      ? null
      : calendar.subscription_next_refresh_at || null
  };
}

//
// Make the events of `calendar` those of `resources` (see
// helpers/parse-calendar-feed.js): one event per UID, written only when it
// differs from the copy held, and removed when the feed no longer has it.
// An event that did not change keeps its ETag.
//
async function applyResources(instance, session, calendar, resources) {
  const existing = await CalendarEvents.find(instance, session, {
    calendar: calendar._id
  });
  const byEventId = new Map();
  for (const event of existing) {
    if (!byEventId.has(event.eventId)) byEventId.set(event.eventId, []);
    byEventId.get(event.eventId).push(event);
  }

  const counts = { created: 0, updated: 0, deleted: 0 };
  const now = new Date();
  const username = String(session.user.username).replaceAll('@', '%40');

  async function save(event, fields) {
    Object.assign(event, fields);
    event.instance = instance;
    event.session = session;
    event.isNew = false;
    await event.save();
  }

  const seen = new Set();
  for (const resource of resources) {
    seen.add(resource.eventId);
    const copies = byEventId.get(resource.eventId) || [];
    const href = `/dav/${username}/${calendar.calendarId}/${resource.eventId}.ics`;

    if (copies.length === 0) {
      await CalendarEvents.create({
        instance,
        session,
        eventId: resource.eventId,
        calendar: calendar._id,
        ical: resource.ical,
        href
      });
      counts.created++;
      continue;
    }

    const [keeper] = deduplicateCalendarEvents(copies);
    for (const copy of copies) {
      if (copy._id.toString() !== keeper._id.toString() && !copy.deleted_at)
        await save(copy, { deleted_at: now });
    }

    if (
      !keeper.deleted_at &&
      signature(keeper.ical) === signature(resource.ical)
    )
      continue;

    const wasDeleted = Boolean(keeper.deleted_at);

    await save(keeper, { ical: resource.ical, href, deleted_at: null });
    if (wasDeleted) counts.created++;
    else counts.updated++;
  }

  for (const [eventId, copies] of byEventId) {
    if (seen.has(eventId)) continue;
    for (const copy of copies) {
      if (copy.deleted_at) continue;

      await save(copy, { deleted_at: now });
      counts.deleted++;
    }
  }

  return counts;
}

async function setState(instance, session, calendar, fields) {
  await Calendars.findByIdAndUpdate(instance, session, calendar._id, {
    $set: fields
  });
  Object.assign(calendar, fields);
}

//
// Fetch the feed of `calendar` and apply it.
//
// Resolves to `{ changed, created, updated, deleted, skipped, notModified }`.
// A failure is recorded on the calendar (and the next attempt put off, or the
// subscription paused) and then, with `options.throwOnError`, thrown: it has
// a `code` (see helpers/fetch-calendar-feed.js) and never holds the address.
//
// `instance` is the server (`client` and `resolver` are read from it) and
// `session` the signed-in alias' session, as the models take them.
//
async function refreshSubscription(instance, session, calendar, options = {}) {
  const { throwOnError = false, fetch = fetchCalendarFeed, logger } = options;
  const client = instance?.client;
  const aliasId = session?.user?.alias_id;
  const result = {
    changed: false,
    created: 0,
    updated: 0,
    deleted: 0,
    skipped: 0,
    notModified: false
  };

  if (!isSubscription(calendar)) return result;

  // (one refresh of a calendar at a time, across servers)
  const lockKey = `${LOCK_PREFIX}${calendar._id}`;
  if (client) {
    try {
      const locked = await client.set(lockKey, '1', 'PX', LOCK_TTL, 'NX');
      if (!locked) return result;
    } catch (err) {
      if (logger) logger.warn('subscription lock failed', { err });
    }
  }

  try {
    const fetched = await fetch(calendar.source, {
      resolver: instance?.resolver,
      allowHttp: Boolean(calendar.subscription_allow_http),
      etag: calendar.subscription_etag || undefined,
      lastModified: calendar.subscription_last_modified || undefined
    });

    const now = new Date();
    const fields = {
      subscription_refreshed_at: now,
      subscription_failures: 0,
      subscription_error: null,
      subscription_paused_at: null
    };
    let { ttl } = calendar;

    if (fetched.notModified) {
      result.notModified = true;
    } else {
      const feed = parseCalendarFeed(fetched.body, options.limits);
      result.skipped = feed.skipped;

      const { isOverQuota } = await Aliases.isOverQuota(
        {
          id: aliasId,
          domain: session.user.domain_id,
          locale: session.user.locale
        },
        0,
        client
      );
      if (isOverQuota)
        throw feedError('FEED_OVER_QUOTA', 'Storage quota is used up');

      const counts = await applyResources(
        instance,
        session,
        calendar,
        feed.resources
      );
      Object.assign(result, counts);
      result.changed = counts.created + counts.updated + counts.deleted > 0;

      ttl = feed.refreshInterval || null;
      fields.ttl = ttl;
      fields.subscription_etag = fetched.etag || null;
      fields.subscription_last_modified = fetched.lastModified || null;
      // (a feed that moved for good is asked for where it now is)
      if (fetched.permanentRedirect && fetched.url) fields.source = fetched.url;

      if (result.changed) {
        // (read again: the token may have moved on since `calendar` was read)
        const current = await Calendars.findById(
          instance,
          session,
          calendar._id
        );
        fields.synctoken = bumpSyncToken(
          current?.synctoken || calendar.synctoken
        );
      }
    }

    fields.subscription_next_refresh_at = new Date(
      now.getTime() + withJitter(refreshInterval(ttl))
    );
    await setState(instance, session, calendar, fields);

    if (result.changed && client && aliasId) {
      sendApnCalendar(client, aliasId)
        .then()
        .catch((err) => logger && logger.fatal(err));
      sendNotification(
        client,
        aliasId,
        'calendarUpdated',
        {
          calendar: {
            id: calendar._id.toString(),
            calendarId: calendar.calendarId,
            name: calendar.name,
            description: calendar.description || '',
            color: calendar.color || '',
            order: calendar.order || 0,
            timezone: calendar.timezone || '',
            readonly: true,
            synctoken: calendar.synctoken || '',
            object: 'calendar'
          }
        },
        instance.resolver
      );
      updateStorageUsed(aliasId, client)
        .then()
        .catch((err) => logger && logger.fatal(err));
    }

    return result;
  } catch (err) {
    // (a bug of ours is not a failure of the feed)
    if (!err?.isFeedError) throw err;

    const failures = (Number(calendar.subscription_failures) || 0) + 1;
    const paused =
      PERMANENT.has(err.code) ||
      err.statusCode === 410 ||
      failures >= MAX_FAILURES;
    const now = new Date();
    try {
      await setState(instance, session, calendar, {
        subscription_failures: failures,
        subscription_error: err.statusCode
          ? `${err.code}_${err.statusCode}`
          : err.code,
        subscription_paused_at: paused ? now : null,
        subscription_next_refresh_at: new Date(
          now.getTime() + backoff(failures, err.retryAfter)
        )
      });
    } catch (err_) {
      if (logger) logger.error(err_);
    }

    if (logger)
      logger.info('calendar subscription failed', {
        // (never the address itself)
        feed: redactFeedUrl(calendar.source),
        code: err.code,
        statusCode: err.statusCode,
        failures,
        paused
      });

    if (throwOnError) throw err;
    result.error = err.code;
    return result;
  } finally {
    if (client) client.del(lockKey).catch(() => {});
  }
}

// Refresh every subscription of the signed-in alias that is due.
async function refreshDueSubscriptions(instance, session, options = {}) {
  const calendars = await Calendars.find(instance, session, {});
  const due = calendars.filter((calendar) => isDue(calendar));
  const results = [];
  for (const calendar of due) {
    // (one after the other: they share the request's database connection)

    results.push(
      await refreshSubscription(instance, session, calendar, options)
    );
  }

  return results;
}

//
// Called once an alias is signed in (see `authenticate` in caldav-server.js
// and app/controllers/api/v1/alias-auth.js). Never waited for and never
// throws: a request is not held up by, and does not fail for, a feed.
//
function refreshSubscriptionsInBackground(instance, ctx) {
  const { session } = ctx.state;
  const aliasId = session?.user?.alias_id;
  if (!aliasId || inflight.has(aliasId)) return;
  const { client } = instance;
  const key = `${CHECKED_PREFIX}${aliasId}`;

  const promise = (async () => {
    try {
      if (client) {
        // (set first, so the requests of one sync do not each look)
        const first = await client.set(key, '1', 'PX', CHECKED_TTL, 'NX');
        if (!first) return;
      }

      await refreshDueSubscriptions(instance, session, { logger: ctx.logger });
    } catch (err) {
      ctx.logger.error(err);
    } finally {
      inflight.delete(aliasId);
    }
  })();

  inflight.set(aliasId, promise);
}

module.exports = {
  CHECKED_PREFIX,
  DEFAULT_INTERVAL,
  MAX_FAILURES,
  MAX_INTERVAL,
  MIN_INTERVAL,
  applyResources,
  backoff,
  inflight,
  isDue,
  isSubscription,
  limits,
  refreshDueSubscriptions,
  refreshInterval,
  refreshSubscription,
  refreshSubscriptionsInBackground,
  subscriptionJson,
  withJitter
};
