/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { setTimeout: sleep } = require('node:timers/promises');

const bytes = require('@forwardemail/bytes');

//
// WebSocket outbound backpressure guards.
//
// When a peer stops draining, `ws.send()` keeps queueing data in Node's
// stream layer (WriteWrap._chunks) and OpenSSL's TLS BIO buffers with no
// upper bound. A heap snapshot of a climbing sqlite process showed ~12.5GB
// of un-drained outbound data across a handful of stuck TLS sockets (9.1GB
// in stream write queues + 3.4GB in TLS BIO) driving the process to ~13GB
// before OOM. These helpers cap that by checking `ws.bufferedAmount` before
// writing.
//
// NOTE: awaiting drain here does NOT block the event loop — it suspends the
// single caller and yields; other connections keep being serviced.
//

const OPEN = 1;

// Broadcast (notifier fan-out) is fire-and-forget: DROP for any client above
// this mark. The client resyncs on reconnect, so a slow consumer can never
// stall delivery to everyone else.
const BROADCAST_MAX_BUFFERED = bytes('8MB');

// Request/response applies real backpressure: wait (bounded) for the socket
// to fall below this mark before queueing another (potentially large)
// response, and abort if it stays saturated.
const RESPONSE_MAX_BUFFERED = bytes('64MB');

const DRAIN_TIMEOUT_MS = 30000;
const DRAIN_POLL_MS = 50;

function isBackedUp(ws, max) {
  return ws && typeof ws.bufferedAmount === 'number' && ws.bufferedAmount > max;
}

//
// Wait (bounded) until the socket's buffered bytes fall below `max`.
// Returns true once drained, or false if it timed out or the socket closed
// (caller should then drop the payload and free its resources).
//
async function waitForDrain(ws, max, timeoutMs = DRAIN_TIMEOUT_MS) {
  const deadline = Date.now() + timeoutMs;
  while (ws.readyState === OPEN && ws.bufferedAmount > max) {
    if (Date.now() >= deadline) return false;
    await sleep(DRAIN_POLL_MS);
  }

  return ws.readyState === OPEN;
}

//
// Send `data` and await its flush to the socket, bounded by `timeoutMs`.
// The `ws` send callback fires once the frame is written (or errors), so
// awaiting it is the backpressure signal. The timeout guards against a
// half-open socket whose callback never fires.
// Returns true if flushed, false otherwise.
//
function sendBounded(ws, data, timeoutMs = DRAIN_TIMEOUT_MS) {
  return new Promise((resolve) => {
    if (!ws || ws.readyState !== OPEN) {
      resolve(false);
      return;
    }

    let done = false;
    const finish = (ok) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve(ok);
    };

    const timer = setTimeout(() => finish(false), timeoutMs);

    try {
      ws.send(data, (err) => finish(!err));
    } catch {
      finish(false);
    }
  });
}

module.exports = {
  BROADCAST_MAX_BUFFERED,
  RESPONSE_MAX_BUFFERED,
  DRAIN_TIMEOUT_MS,
  isBackedUp,
  waitForDrain,
  sendBounded
};
