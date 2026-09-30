/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Which push endpoints the server will POST to.  A subscription endpoint is a
// URL the client supplies, so on top of the private-address checks (see
// helpers/is-private-host.js and helpers/safe-fetch.js) the server limits it:
//
// - Web Push (browsers): only the push services browsers use, on port 443.
//   Chromium browsers (Chrome, Brave, Opera, Samsung Internet, Vivaldi) use
//   Firebase Cloud Messaging, Edge uses Windows Push Notification Services,
//   Firefox uses Mozilla autopush, and Safari uses Apple Push.
//
// - UnifiedPush: the distributor is chosen by the user and may be
//   self-hosted, so any public HTTPS host is allowed, but only on port 443 or
//   an unprivileged port (so the server cannot be pointed at other services
//   on well-known ports).
//

const WEB_PUSH_HOSTS = new Set([
  'fcm.googleapis.com',
  'android.googleapis.com',
  'updates.push.services.mozilla.com',
  'web.push.apple.com'
]);

const WEB_PUSH_HOST_SUFFIXES = [
  '.push.services.mozilla.com',
  '.push.apple.com',
  '.notify.windows.com'
];

function parseHttpsUrl(value) {
  if (typeof value !== 'string') return null;
  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.protocol !== 'https:' || url.username || url.password || url.hash)
    return null;
  return url;
}

function isAllowedWebPushEndpoint(value) {
  const url = parseHttpsUrl(value);
  if (!url || url.port !== '') return false;
  const host = url.hostname.toLowerCase();
  return (
    WEB_PUSH_HOSTS.has(host) ||
    WEB_PUSH_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix))
  );
}

function isAllowedUnifiedPushEndpoint(value) {
  const url = parseHttpsUrl(value);
  if (!url) return false;
  return url.port === '' || Number(url.port) >= 1024;
}

module.exports = {
  isAllowedUnifiedPushEndpoint,
  isAllowedWebPushEndpoint
};
