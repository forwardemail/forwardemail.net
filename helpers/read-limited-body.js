/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

//
// Read at most `limit` bytes of an undici response body within `timeout` ms,
// then discard the rest of it.
//
// A response body from a host we do not control (e.g. a webhook URL) is read
// after `retry-request` has already returned (and cleared its timeout), so
// `body.text()` would buffer an endless or very slow body without limit.
//
async function readLimitedBody(body, { limit = 1024, timeout = 10_000 } = {}) {
  if (!body || typeof body[Symbol.asyncIterator] !== 'function') return '';
  const chunks = [];
  let size = 0;
  let timer;
  let timedOut = false;
  try {
    timer = setTimeout(() => {
      timedOut = true;
      body.destroy();
    }, timeout);
    for await (const chunk of body) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      chunks.push(buffer.subarray(0, limit - size));
      size += buffer.length;
      if (size >= limit) break;
    }
  } catch (err) {
    // (a body cut off at the time limit keeps what was read)
    if (!timedOut) throw err;
  } finally {
    clearTimeout(timer);
    // stop reading the rest (a `break` above already closes the stream)
    if (!body.destroyed) body.destroy();
  }

  return Buffer.concat(chunks).toString('utf8');
}

module.exports = readLimitedBody;
