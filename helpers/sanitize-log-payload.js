/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const safeStringify = require('fast-safe-stringify');

//
// Maximum allowed byte size for a single serialized log document.
// 12 MB is comfortably below MongoDB's 16 MiB BSON ceiling and well under
// the 17 MiB scratch buffer that bson@4.7.2 allocates (which triggers
// the ERR_OUT_OF_RANGE crash when exceeded).
//
const MAX_DOC_BYTES = 12 * 1024 * 1024; // 12 MB

//
// Per-field string byte limit for individual values (256 KB).
// Any single string value exceeding this is truncated.
//
const MAX_FIELD_BYTES = 256 * 1024; // 256 KB

//
// Maximum number of items to keep in arrays that are known to grow unbounded
// (e.g. rejectedErrors, bounces, results).
//
const MAX_ARRAY_LENGTH = 5;

//
// Well-known keys that can grow very large and are safe to drop or truncate.
//
const DROPPABLE_META_KEYS = new Set(['results', 'rejectedErrors', 'bounces']);

const DROPPABLE_ERR_KEYS = new Set(['bounces', 'results', 'rejectedErrors']);

//
// Keys on meta.app that are informational but can be large (e.g. os.cpus).
//
const LARGE_APP_KEYS = new Set(['cpus']);

/**
 * Truncate a string value to MAX_FIELD_BYTES (UTF-8) if it exceeds the limit.
 * @param {string} str
 * @returns {string}
 */
function truncateString(str) {
  if (typeof str !== 'string') return str;
  const len = Buffer.byteLength(str, 'utf8');
  if (len <= MAX_FIELD_BYTES) return str;
  // Truncate to approximate character boundary
  const truncated = Buffer.from(str, 'utf8')
    .subarray(0, MAX_FIELD_BYTES)
    .toString('utf8');
  return truncated + `... [truncated from ${len} bytes]`;
}

/**
 * Truncate arrays that are known to grow unbounded.
 * @param {Array} arr
 * @returns {Array}
 */
function truncateArray(arr) {
  if (!Array.isArray(arr)) return arr;
  if (arr.length <= MAX_ARRAY_LENGTH) return arr;
  const truncated = arr.slice(0, MAX_ARRAY_LENGTH);
  truncated.push(`[... ${arr.length - MAX_ARRAY_LENGTH} more items truncated]`);
  return truncated;
}

/**
 * Recursively walk an object and truncate oversized string values.
 * Also truncates known large arrays.
 * @param {*} obj
 * @param {number} depth - current recursion depth
 * @returns {*}
 */
function deepTruncate(obj, depth = 0) {
  if (depth > 10) return '[nested too deep]';
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return truncateString(obj);
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    const arr = obj.length > MAX_ARRAY_LENGTH ? truncateArray(obj) : obj;
    return arr.map((item) => deepTruncate(item, depth + 1));
  }

  const result = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (
      DROPPABLE_META_KEYS.has(key) &&
      Array.isArray(val) &&
      val.length > MAX_ARRAY_LENGTH
    ) {
      result[key] = truncateArray(val).map((item) =>
        deepTruncate(item, depth + 1)
      );
    } else {
      result[key] = deepTruncate(val, depth + 1);
    }
  }

  return result;
}

/**
 * Sanitize a log payload { err, message, meta } to ensure it stays
 * well under the 16 MiB BSON document limit.
 *
 * This function:
 * 1. Drops/truncates well-known large fields (meta.results, err.bounces, etc.)
 * 2. Removes meta.app.os.cpus (large array of CPU info objects)
 * 3. Removes duplicate err stored in meta.err when identical to top-level err
 * 4. Truncates any remaining oversized string values
 * 5. If the payload is still over MAX_DOC_BYTES, aggressively strips meta
 *
 * @param {object} payload - { err, message, meta }
 * @returns {object} - sanitized { err, message, meta }
 */
function sanitizeLogPayload(payload) {
  let { err, message, meta } = payload;

  // Clone via safeStringify to handle circular references and detach from originals
  try {
    if (err && typeof err === 'object') err = JSON.parse(safeStringify(err));
    if (meta && typeof meta === 'object')
      meta = JSON.parse(safeStringify(meta));
    if (message && typeof message === 'object')
      message = JSON.parse(safeStringify(message));
  } catch {
    // If stringify fails, use minimal representations
    err = err
      ? {
          message: String(err.message || err),
          name: String(err.name || 'Error')
        }
      : err;
    meta = {};
  }

  //
  // Step 1: Drop/truncate well-known large arrays on err
  //
  if (err && typeof err === 'object') {
    for (const key of DROPPABLE_ERR_KEYS) {
      if (Array.isArray(err[key]) && err[key].length > MAX_ARRAY_LENGTH) {
        err[key] = truncateArray(err[key]);
      }
    }

    // Truncate deeply nested stacks
    if (typeof err.stack === 'string') {
      err.stack = truncateString(err.stack);
    }
  }

  //
  // Step 2: Remove meta.app.os.cpus (informational but large)
  //
  if (meta && typeof meta === 'object') {
    if (
      meta.app &&
      typeof meta.app === 'object' &&
      meta.app.os &&
      typeof meta.app.os === 'object'
    ) {
      for (const key of LARGE_APP_KEYS) {
        if (key in meta.app.os) {
          delete meta.app.os[key];
        }
      }
    }

    //
    // Step 3: Remove meta.err if it duplicates top-level err
    //
    if (meta.err && err) {
      const metaErrMsg = meta.err.message || '';
      const topErrMsg = err.message || '';
      if (metaErrMsg === topErrMsg) {
        delete meta.err;
      }
    }

    //
    // Step 4: Drop/truncate well-known large arrays on meta
    //
    for (const key of DROPPABLE_META_KEYS) {
      if (Array.isArray(meta[key]) && meta[key].length > MAX_ARRAY_LENGTH) {
        meta[key] = truncateArray(meta[key]);
      }
    }

    // Truncate meta.session.headers if present (can contain large values)
    if (
      meta.session &&
      typeof meta.session === 'object' &&
      meta.session.headers &&
      typeof meta.session.headers === 'object'
    ) {
      for (const key of Object.keys(meta.session.headers)) {
        if (typeof meta.session.headers[key] === 'string') {
          meta.session.headers[key] = truncateString(meta.session.headers[key]);
        }
      }
    }
  }

  //
  // Step 5: Deep-truncate remaining oversized strings
  //
  err = deepTruncate(err);
  meta = deepTruncate(meta);

  //
  // Step 6: Final size check — if still over limit, aggressively strip
  //
  const serialized = safeStringify({ err, message, meta });
  const byteSize = Buffer.byteLength(serialized, 'utf8');

  if (byteSize > MAX_DOC_BYTES) {
    // Aggressive fallback: keep only essential error info
    const minimalErr = err
      ? {
          message: truncateString(String(err.message || '')),
          name: String(err.name || 'Error'),
          code: err.code,
          responseCode: err.responseCode,
          isCodeBug: err.isCodeBug,
          _original_size: byteSize
        }
      : err;

    const minimalMeta = meta
      ? {
          level: meta.level,
          app: meta.app
            ? { hostname: meta.app.hostname, name: meta.app.name }
            : undefined,
          _sanitized: true,
          _original_size: byteSize
        }
      : meta;

    return { err: minimalErr, message, meta: minimalMeta };
  }

  return { err, message, meta };
}

/**
 * Get the approximate BSON byte size of a log document object.
 * Uses JSON serialization as a proxy (BSON is typically slightly larger
 * than JSON for documents with nested objects, but this is a safe
 * conservative estimate for our purposes since we cap well below 16 MiB).
 *
 * @param {object} doc - mongoose document or plain object
 * @returns {number} - byte size
 */
function getDocByteSize(doc) {
  try {
    const obj = typeof doc.toObject === 'function' ? doc.toObject() : doc;
    return Buffer.byteLength(safeStringify(obj), 'utf8');
  } catch {
    // If serialization fails, assume it's oversized
    return MAX_DOC_BYTES + 1;
  }
}

module.exports = sanitizeLogPayload;
module.exports.sanitizeLogPayload = sanitizeLogPayload;
module.exports.getDocByteSize = getDocByteSize;
module.exports.MAX_DOC_BYTES = MAX_DOC_BYTES;
