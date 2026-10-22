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
const DEFAULT_LIMITS = {
  fieldNameSize: 256,
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

/**
 * Create a @koa/multer instance with finite limits.
 *
 * @param {Object} [options] - multer options; `limits` are merged over the
 *   defaults (so a route that takes files passes `files`/`fileSize`)
 * @param {Object} [settings]
 * @param {boolean} [settings.rawErrors] - rethrow MulterError as is, for a
 *   route that maps multer's error codes to its own messages
 * @returns {Object} the @koa/multer instance
 */
function createMultipart(options = {}, { rawErrors = false } = {}) {
  const upload = koaMulter({
    ...options,
    limits: { ...DEFAULT_LIMITS, ...options.limits }
  });

  const wrap = rawErrors
    ? settleOnAbort
    : (middleware) => toBadRequest(settleOnAbort(middleware));

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
