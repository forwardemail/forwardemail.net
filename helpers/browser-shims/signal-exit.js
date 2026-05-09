/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Browser-side shim for `signal-exit`.
//
// This module is intentionally a structural mock that mirrors the public
// surface of both `signal-exit@3.x` (CommonJS function default export with
// `.signals()`, `.load()`, `.unload()` properties) and `signal-exit@4.x`
// (ESM-style named `onExit` export). signal-exit's only purpose is to
// register Node process exit/signal listeners; in the browser those have
// no meaning, so every method becomes a no-op.
//
// Shimming to `{}` (i.e. setting `"signal-exit": false` in the browser
// field) is unsafe because some server-side tools (notably `nyc`
// (`require('signal-exit')` at the top of `nyc/index.js`) and
// `foreground-child` `signalExit.signals()` in its setup loop) fall
// back to the consumer package's `browser` field during module
// resolution in certain pnpm/macOS configurations, which manifests as
// `onExit is not a function` or
// `signalExit.signals is not a function or its return value is not iterable`
// when the test pipeline starts. Returning a structurally-correct mock
// from this shim prevents that class of failure while still bundling to
// effectively nothing in the browser.
//

const noop = () => {};
const remove = () => noop;

function onExit(_cb, _opts) {
  // do nothing; return an unsubscribe function (matches signal-exit@3 API)
  return remove;
}

onExit.signals = () => [];
onExit.load = noop;
onExit.unload = noop;

// signal-exit@4 named export form
module.exports = onExit;
module.exports.onExit = onExit;
module.exports.signals = onExit.signals;
module.exports.load = onExit.load;
module.exports.unload = onExit.unload;
module.exports.default = onExit;
