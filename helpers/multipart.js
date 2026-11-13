/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Multipart (multipart/form-data) parsing for Koa routes.
//
// multer turns every field name into an object path with `append-field`
// (e.g. `a[b][0]`).  A numeric step creates a real Array and assigns the
// index directly, so `a[4294967294]` makes an Array of length 2^32-1 and a
// following `a[b]` converts it with `Array.prototype.forEach`, which walks
// every index of the sparse array.  One field pair blocks the event loop for
// minutes (about 3 seconds per 10^8 of index), and the API parses multipart
// bodies before authentication, so a single anonymous request could stall an
// API process.  Serializing such a body (logging, JSON) walks it as well.
//
// This module is the only place multer is loaded from.  Before loading it,
// it wraps the `append-field` module multer resolves to, so a field name
// with an index above MAX_ARRAY_INDEX is stored under its literal name
// instead of as an array index.  No legitimate form carries such an index.
// It also gives every parser finite limits (multer has none by default).
//

const { Buffer } = require('node:buffer');
const path = require('node:path');

const Boom = require('@hapi/boom');

// Largest array index honoured in a field name (e.g. `attachments[999]`).
const MAX_ARRAY_INDEX = 1000;

// A `[digits]` path step whose value is above MAX_ARRAY_INDEX. Anything over
// four digits is above it without parsing (and without precision loss).
const RE_LARGE_INDEX = /\[(\d{5,}|\d{4})]/g;

function hasLargeIndex(key) {
  if (typeof key !== 'string') return false;
  RE_LARGE_INDEX.lastIndex = 0;
  let match;
  while ((match = RE_LARGE_INDEX.exec(key)) !== null) {
    if (match[1].length > 4 || Number(match[1]) > MAX_ARRAY_INDEX) return true;
  }

  return false;
}

//
// Store the value under the literal field name, with the same semantics
// append-field uses for a name it cannot parse (repeated names become an
// array of values).
//
function appendLiteral(store, key, value) {
  const existing = Object.prototype.hasOwnProperty.call(store, key)
    ? store[key]
    : undefined;
  if (existing === undefined) store[key] = value;
  else if (Array.isArray(existing)) existing.push(value);
  else store[key] = [existing, value];
}

function wrapAppendField() {
  // resolve `append-field` exactly as multer resolves it
  const multerDir = path.dirname(require.resolve('multer/package.json'));
  const appendFieldPath = require.resolve('append-field', {
    paths: [multerDir]
  });

  const appendField = require(appendFieldPath);
  if (appendField.isHardened) return;

  function hardenedAppendField(store, key, value) {
    if (hasLargeIndex(key)) return appendLiteral(store, key, value);
    return appendField(store, key, value);
  }

  hardenedAppendField.isHardened = true;
  require.cache[appendFieldPath].exports = hardenedAppendField;

  // multer binds `append-field` when it loads, so the wrapper only works if
  // multer had not been loaded yet (it is only ever loaded from here)
  const makeMiddlewarePath = require.resolve(
    path.join(multerDir, 'lib', 'make-middleware.js')
  );
  if (require.cache[makeMiddlewarePath])
    throw new Error(
      'multer was loaded before helpers/multipart.js; load multer only through this module'
    );
}

wrapAppendField();

const koaMulter = require('@koa/multer');

const multer = require('multer');

//
// Limits for forms without files (the global `/v1` parser). The field size
// matches busboy's own default of 1 MB; the counts are far above what any
// API endpoint takes (a few dozen fields at most). This parser runs before
// authentication and buffers every field in memory, so the counts also bound
// what one anonymous request can hold (200 fields x 1 MB).
//
// A field name is an object path, as deep as it has brackets (`a[b][c]`),
// and a name of 256 bytes makes a body nested 85 deep: more than a body may
// be (see helpers/limit-body-depth.js, which refuses one as it is set: here
// in a callback of multer's, where what it threw was caught by nothing and
// the request was never answered). No form of ours nests more than a few.
//
const DEFAULT_LIMITS = {
  fieldNameSize: 256,
  fieldNestingDepth: 32,
  fieldSize: 1024 * 1024,
  fields: 200,
  files: 0,
  parts: 200
};

//
// multer rejects with a MulterError, which the error handler would report
// as a server error; the client sent a bad form, so it is a 400.
//
function toBadRequest(middleware) {
  return async function (ctx, next) {
    try {
      await middleware(ctx, next);
    } catch (err) {
      if (err instanceof multer.MulterError) {
        const error = Boom.badRequest(
          err.field ? `${err.message}: ${err.field}` : err.message
        );
        error.code = err.code;
        throw error;
      }

      throw err;
    }
  };
}

//
// multer 2.0.2 never settles when the client goes away in the middle of an
// upload (fixed in 2.1.0), so the request, its context and what was read of
// the upload stayed in memory for good: the middleware now ends with an
// error when the request is aborted before its body was read.
//
function settleOnAbort(middleware) {
  return function (ctx, next) {
    // (multer only reads multipart bodies)
    if (!ctx.is('multipart')) return middleware(ctx, next);
    const { req } = ctx;
    return new Promise((resolve, reject) => {
      let settled = false;
      const onClose = () => {
        if (settled || req.readableEnded) return;
        settled = true;
        req.unpipe();
        const err = Boom.badRequest('The request was aborted');
        err.code = 'ECONNABORTED';
        reject(err);
      };

      // (the client may have gone while earlier middleware ran)
      if (req.destroyed && !req.readableEnded) {
        onClose();
        return;
      }

      req.once('close', onClose);
      const settle = (fn) => (value) => {
        req.removeListener('close', onClose);
        if (settled) return;
        settled = true;
        fn(value);
      };

      Promise.resolve(middleware(ctx, next)).then(
        settle(resolve),
        settle(reject)
      );
    });
  };
}

//
// Limit on the whole multipart body. multer only limits each field, file
// and count, so a body of 200 fields of 1 MB (sent before authentication,
// then held open) kept about 400 MB per request in memory. A body that
// declares a larger Content-Length is refused before it is read, and one
// sent without (chunked) is cut off once it goes over.
//
const DEFAULT_MAX_TOTAL_BYTES = 10 * 1024 * 1024;

//
// Closing a socket while the client is still sending makes the kernel answer
// with a reset, and a client that gets the reset first (macOS) never reads
// the 413 written just before it. So the rest of the body is read and
// thrown away for a short while after the answer, and then the connection
// is closed (a "lingering close", as nginx does).
//
const LINGER_MS = 2000;

function lingerThenClose(req) {
  const { socket } = req;
  // (Node ends and destroys a `Connection: close` socket as soon as the
  // answer is written; only end it, so it keeps reading until we close it)
  socket.destroySoon = () => socket.end();
  // (a body that goes on is cut off after LINGER_MS)
  const timer = setTimeout(() => socket.destroy(), LINGER_MS);
  timer.unref();
  socket.once('close', () => clearTimeout(timer));
  // (a body that ends is closed once the answer is out)
  req.once('end', () => {
    if (socket.writableFinished) socket.destroy();
    else socket.once('finish', () => socket.destroy());
  });
  req.resume();
}

//
// Answer 413 and close the connection once the answer is out, reading what
// the client still sends for a short while (see lingerThenClose)
//
function sendTooLarge(req, res, maxTotalBytes) {
  const body = JSON.stringify(
    Boom.entityTooLarge(
      `Request body exceeds the maximum size of ${maxTotalBytes} bytes.`
    ).output.payload
  );
  res.writeHead(413, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    Connection: 'close'
  });
  lingerThenClose(req);
  res.end(body);
}

function limitTotalSize(middleware, maxTotalBytes) {
  return async function (ctx, next) {
    // (multer only reads multipart bodies)
    if (!ctx.is('multipart')) return middleware(ctx, next);

    const { req, res } = ctx;

    //
    // A body that says it is larger is refused before it is read (but read
    // and thrown away while the answer goes out, as below: a client still
    // sending it got a broken pipe rather than the 413 on macOS)
    //
    const declared = ctx.get('content-length');
    if (/^\d+$/.test(declared) && Number(declared) > maxTotalBytes) {
      ctx.respond = false;
      sendTooLarge(req, res, maxTotalBytes);
      return;
    }

    let received = 0;
    let exceeded = false;
    //
    // (multer is cut off from the body, so it may never settle: a body that
    // ends while the rest of it is read reads as a body multer got whole, so
    // the abort above does not settle it either; the request is done here)
    //
    let onExceeded;
    const cutOff = new Promise((resolve) => {
      onExceeded = resolve;
    });
    const onData = (chunk) => {
      received += chunk.length;
      if (exceeded || received <= maxTotalBytes) return;
      exceeded = true;
      onExceeded();
      req.unpipe();
      // (answered here and the connection closed once the answer is out:
      // the rest of a chunked body could go on without end, and closing the
      // connection first left no way to send the 413)
      if (res.headersSent) {
        req.destroy();
        return;
      }

      sendTooLarge(req, res, maxTotalBytes);
    };

    // (attached in the same tick multer pipes the request into its parser,
    // so both see every chunk)
    req.on('data', onData);
    try {
      await Promise.race([middleware(ctx, next), cutOff]);
    } catch (err) {
      if (!exceeded) throw err;
    } finally {
      req.removeListener('data', onData);
    }

    // (the 413 is already sent)
    if (exceeded) ctx.respond = false;
  };
}

/**
 * Create a @koa/multer instance with finite limits.
 *
 * @param {Object} [options] - multer options; `limits` are merged over the
 *   defaults (so a route that takes files passes `files`/`fileSize`)
 * @param {Object} [settings]
 * @param {boolean} [settings.rawErrors] - rethrow MulterError as is, for a
 *   route that maps multer's error codes to its own messages
 * @param {number} [settings.maxTotalBytes] - limit on the whole body
 * @returns {Object} the @koa/multer instance
 */
function createMultipart(
  options = {},
  { rawErrors = false, maxTotalBytes = DEFAULT_MAX_TOTAL_BYTES } = {}
) {
  const upload = koaMulter({
    ...options,
    limits: { ...DEFAULT_LIMITS, ...options.limits }
  });

  const wrap = rawErrors
    ? (middleware) => limitTotalSize(settleOnAbort(middleware), maxTotalBytes)
    : (middleware) =>
        limitTotalSize(toBadRequest(settleOnAbort(middleware)), maxTotalBytes);

  return {
    none: () => wrap(upload.none()),
    fields: (fields) => wrap(upload.fields(fields)),
    single: (name) => wrap(upload.single(name)),
    array: (name, maxCount) => wrap(upload.array(name, maxCount)),
    any: () => wrap(upload.any())
  };
}

module.exports = createMultipart;
module.exports.MulterError = multer.MulterError;
module.exports.MAX_ARRAY_INDEX = MAX_ARRAY_INDEX;
module.exports.hasLargeIndex = hasLargeIndex;
