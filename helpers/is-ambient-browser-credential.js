/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Whether a request carries an Authorization header that a browser attached
// on its own for another site's page.
//
// A browser remembers HTTP Basic credentials typed into its login prompt
// and sends them again with every request to the same origin, including a
// form submitted, a link followed, an image loaded or a WebSocket opened by
// a page on another site, none of which can set the header itself. Such a
// request is marked by the browser with `Sec-Fetch-Site: cross-site` and a
// `Sec-Fetch-Mode` of `navigate`, `no-cors` or `websocket`.
//
// A cross-site `fetch()` (`cors`) is not refused: an app on another
// origin (the desktop apps, other web apps) sets the header itself that
// way, and that cannot be told apart from one the browser attached.
//
// API clients (curl, SDKs, apps) do not send `Sec-Fetch-*` headers at all.
//
const AMBIENT_MODES = new Set(['navigate', 'no-cors', 'websocket']);

function isAmbientBrowserCredential(headers = {}) {
  if (!headers.authorization) return false;
  const site = String(headers['sec-fetch-site'] || '').toLowerCase();
  if (site !== 'cross-site') return false;
  const mode = String(headers['sec-fetch-mode'] || '').toLowerCase();
  return AMBIENT_MODES.has(mode);
}

module.exports = isAmbientBrowserCredential;
