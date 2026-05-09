/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Apple Push Notification Service subscription endpoint for CalDAV and
// CardDAV, per Apple's `caldav-pubsubdiscovery.txt` (also used for CardDAV
// by the same spec).
//
// Reference implementation:
// https://github.com/apple/ccs-calendarserver/blob/master/calendarserver/push/applepush.py
//
// Protocol summary:
//
//   1. Server advertises in PROPFIND on calendar-home / addressbook-home:
//        <CS:push-transports>
//          <CS:transport type="APSD">
//            <CS:subscription-url>
//              <D:href>https://caldav.example.com/apns</D:href>
//            </CS:subscription-url>
//            <CS:apsbundleid>{{topic}}</CS:apsbundleid>
//            <CS:env>PRODUCTION</CS:env>
//            <CS:refresh-interval>3600</CS:refresh-interval>
//          </CS:transport>
//        </CS:push-transports>
//
//      and on each calendar / addressbook collection:
//        <CS:pushkey>{{collection-key}}</CS:pushkey>
//
//   2. iOS Calendar / Contacts app sends:
//        POST /apns
//        Content-Type: application/x-www-form-urlencoded
//
//        token={{device-token}}&key={{pushkey}}
//
//      iOS does NOT include `account-id` in this POST.  Apple's reference
//      ccs-calendarserver impl reads only `token` and `key` and never sets
//      an account-id field.  We accept `account-id` if any future client
//      sends one, but we MUST NOT manufacture a fake account-id from `key`
//      because iOS dataaccessd uses the APNs payload's `aps['account-id']`
//      to route the push to a local account UUID; an unrecognised value
//      causes the push to be silently dropped.
//
//   3. Server persists `{ device_token, key, subtopic, account_id? }` into
//      `alias.aps[]` and returns 200 OK with empty body.  iOS drops the
//      registration silently on any non-2xx, so we MUST return 200 even
//      for duplicate registrations (idempotent).
//
//   4. When the calendar / addressbook collection associated with `key`
//      changes, server fires an APNs background push targeted at that
//      device_token.  `aps['account-id']` is included only when iOS
//      originally provided one.
//
// IMPORTANT: iOS Calendar uses subtopic `com.apple.mobilecal`; iOS Contacts
// uses `com.apple.mobileaddressbook`; iOS Mail uses `com.apple.mobilemail`.
// `sendApnCalendar` / `sendApnContacts` filter `alias.aps[]` by subtopic
// before pushing so cross-topic device tokens are not used.
//

const { Buffer } = require('node:buffer');

const Aliases = require('#models/aliases');

//
// Parse subscription request fields from any of: form-encoded body,
// JSON body, query string.
//
// Apple reference impl reads from the form-encoded request body
// (`request.args` in Twisted), but iOS in practice sends form-encoded.
// We accept all three for robustness against iOS version drift and for
// easy CLI testing.
//
function parseRequest(ctx) {
  let fromBody = {};
  if (ctx.request.body) {
    if (Buffer.isBuffer(ctx.request.body)) {
      try {
        const trimmed = ctx.request.body.toString('utf8').trim();
        fromBody = trimmed.startsWith('{')
          ? JSON.parse(trimmed)
          : Object.fromEntries(new URLSearchParams(trimmed));
      } catch {
        fromBody = {};
      }
    } else if (typeof ctx.request.body === 'object') {
      fromBody = ctx.request.body;
    } else if (typeof ctx.request.body === 'string') {
      // caldav-server.js context: body is raw string (no koa-bodyparser)
      try {
        const trimmed = ctx.request.body.trim();
        fromBody = trimmed.startsWith('{')
          ? JSON.parse(trimmed)
          : Object.fromEntries(new URLSearchParams(trimmed));
      } catch {
        fromBody = {};
      }
    }
  }

  const fromQuery = ctx.query || {};

  // iOS sometimes uses dashed names, sometimes camelCase
  const pick = (...keys) => {
    for (const key of keys) {
      if (fromBody[key]) return String(fromBody[key]);
      if (fromQuery[key]) return String(fromQuery[key]);
    }

    return null;
  };

  return {
    deviceToken: pick('token', 'device-token', 'deviceToken'),
    key: pick('key', 'pushkey', 'push-key'),
    accountId: pick('account-id', 'accountId', 'account_id')
  };
}

//
// Determine which subtopic this DAV server registers tokens for.
//
// CalDAV server URLs have caldavRoot prefix `/dav` and the request path
// will start with `/dav/<user>/`; CardDAV server is reached via a separate
// hostname (CARDDAV_HOST) so we can tell from `ctx.host` or from an
// explicit option passed by the caller.
//
function defaultSubtopicFromContext(ctx) {
  // Prefer explicit value set by caller
  if (ctx.state && ctx.state.davSubtopic) return ctx.state.davSubtopic;
  // Fallback to host-based heuristic
  const host = (ctx.host || '').toLowerCase();
  if (host.startsWith('carddav')) return 'com.apple.mobileaddressbook';
  return 'com.apple.mobilecal';
}

//
// Persist (or refresh) a single iOS Calendar/Contacts push subscription on
// the authenticated alias.  The handler is idempotent: re-registration of
// the same (device_token, key) pair updates the entry; otherwise it
// appends a new one.  Always returns 200 OK with empty body so iOS treats
// the registration as successful regardless of duplicate state.
//
// We use atomic Mongo `$set`/`$push` operators rather than read-mutate-save
// so concurrent registrations from a single iOS device (e.g. two calendars
// subscribed in the same sync) do not race and overwrite each other.  A
// findOne + alias.save() pattern would lose all but the last-written entry
// because each save() persists the entire `aps` array as it was read.
//
async function davApnsSubscribe(ctx, options = {}) {
  const subtopic = options.subtopic || defaultSubtopicFromContext(ctx);

  const { deviceToken, key, accountId } = parseRequest(ctx);

  // iOS will retry registration on next sync if we 4xx, so missing fields
  // get a 400; everything else is 200.
  if (!deviceToken || !key) {
    ctx.status = 400;
    ctx.body = 'token and key are required';
    return;
  }

  // Auth is enforced by the caller's middleware (basicAuth +
  // setupAuthSession).  ctx.state.session.user.alias_id is set there.
  if (
    !ctx.state ||
    !ctx.state.session ||
    !ctx.state.session.user ||
    !ctx.state.session.user.alias_id
  ) {
    ctx.status = 401;
    ctx.body = 'unauthenticated';
    return;
  }

  const aliasId = ctx.state.session.user.alias_id;

  //
  // Build the registration document.  account_id is intentionally OMITTED
  // when iOS did not supply one -- DO NOT fall back to `key`.  Apple's
  // ccs-calendarserver and Apple's iOS dataaccessd treat account-id as an
  // optional account-routing hint that, when present in the APNs payload,
  // must match an iOS-side account UUID.  Substituting an opaque
  // collection id (`key`) causes every push to be silently dropped.
  //
  const entry = {
    device_token: deviceToken,
    subtopic,
    key
  };
  if (accountId) entry.account_id = accountId;

  //
  // Try to update an existing (device_token, key) registration first.
  // If it exists, we just refresh subtopic and (optionally) account_id.
  //
  const update = {
    'aps.$.subtopic': subtopic
  };
  if (accountId) update['aps.$.account_id'] = accountId;

  const result = await Aliases.updateOne(
    {
      id: aliasId,
      'aps.device_token': deviceToken,
      'aps.key': key
    },
    { $set: update }
  );

  if (result.matchedCount === 0) {
    //
    // No existing entry for this (device_token, key) pair on this alias --
    // append a new one atomically.  Two near-simultaneous registrations of
    // distinct (device_token, key) pairs each go through their own
    // $push and both persist.
    //
    await Aliases.updateOne({ id: aliasId }, { $push: { aps: entry } });
  }

  //
  // Apple reference implementation returns the topic in the response body
  // as a sanity-check, but iOS does not require it.  Empty body keeps the
  // wire contract minimal.
  //
  ctx.status = 200;
  ctx.set('Content-Type', 'text/plain; charset=utf-8');
  ctx.body = '';
}

module.exports = davApnsSubscribe;
