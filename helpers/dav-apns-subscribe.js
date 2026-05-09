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
//      (Apple reference impl also accepts the same fields as XML body or
//      query string; we accept query, body, and form; see parseRequest.)
//
//   3. Server persists `{ device_token, key, subtopic, account_id }` into
//      `alias.aps[]` and returns 200 OK with empty body.  iOS drops the
//      registration silently on any non-2xx, so we MUST return 200 even
//      for duplicate registrations (idempotent).
//
//   4. When the calendar / addressbook collection associated with `key`
//      changes, server fires an APNs push targeted at that device_token,
//      with `aps.account-id` matching the iOS account UUID iOS originally
//      sent at subscription time (returned in the device_token registration
//      payload as the APNs token's per-account binding).
//
// IMPORTANT: iOS Calendar uses subtopic `com.apple.mobilecal`; iOS Contacts
// uses `com.apple.mobileaddressbook`; iOS Mail uses `com.apple.mobilemail`.
// `sendApnCalendar` / `sendApnContacts` filter `alias.aps[]` by subtopic
// before pushing so cross-topic device tokens are not used.
//

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
    if (typeof ctx.request.body === 'object') {
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

  const alias = await Aliases.findOne({
    id: ctx.state.session.user.alias_id
  })
    .select('+aps')
    .exec();

  if (!alias) {
    ctx.status = 404;
    ctx.body = 'alias not found';
    return;
  }

  if (!Array.isArray(alias.aps)) alias.aps = [];

  //
  // Match by (device_token, key) pair so the same physical device can hold
  // multiple subscriptions (one per calendar / addressbook).  We do NOT
  // match on subtopic alone because a single device may have multiple
  // CalDAV accounts on the same Forward Email alias.
  //
  const match = alias.aps.find(
    (a) => a.device_token === deviceToken && a.key === key
  );

  if (match) {
    match.subtopic = subtopic;
    if (accountId) match.account_id = accountId;
  } else {
    alias.aps.push({
      account_id: accountId || key, // fall back to key if iOS omits accountId
      device_token: deviceToken,
      subtopic,
      key
    });
  }

  await alias.save();

  // Apple reference implementation returns the topic in the response body
  // as a sanity-check, but iOS does not require it.  Empty body keeps the
  // wire contract minimal.
  ctx.status = 200;
  ctx.set('Content-Type', 'text/plain; charset=utf-8');
  ctx.body = '';
}

module.exports = davApnsSubscribe;
