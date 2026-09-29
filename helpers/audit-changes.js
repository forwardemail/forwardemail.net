/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const mongoose = require('mongoose');

const _ = require('#helpers/lodash');

//
// Account and domain audit emails ("Account update", "Domain settings
// updated") are driven by comparing a field's value at load time against its
// value at save time.  A plain `!==` is only correct for primitives: every
// assignment to an ObjectId, Date, array or nested path produces a new object,
// so an unchanged value compared by reference looks changed and the user is
// told that e.g. "Default Domain has changed from X to X".
//
// These helpers compare by value instead, and collapse a queue of pending
// changes so a field that was changed and then changed back (or queued by an
// older build with the reference comparison) never produces an email.
//

function normalize(value) {
  if (value === null || value === undefined) return undefined;

  if (value instanceof mongoose.Types.ObjectId) return value.toString();

  // ObjectId from another bson copy, or a populated document
  if (
    typeof value === 'object' &&
    typeof value.toHexString === 'function' &&
    !Array.isArray(value)
  )
    return value.toHexString();

  if (value instanceof Date) return value.getTime();

  if (Buffer.isBuffer(value)) return value.toString('hex');

  if (Array.isArray(value)) return value.map((v) => normalize(v));

  if (typeof value === 'object') {
    const object =
      typeof value.toObject === 'function'
        ? value.toObject({ depopulate: true })
        : value;
    const result = {};
    for (const key of Object.keys(object).sort()) {
      // mongoose internals and ids of nested subdocuments are not settings
      if (key === '_id' || key.startsWith('$')) continue;
      const normalized = normalize(object[key]);
      if (normalized !== undefined) result[key] = normalized;
    }

    return result;
  }

  return value;
}

//
// Empty values are treated as equal to each other so that e.g. a field going
// from `undefined` to `''` or `[]` (a form re-submitting a blank input) is not
// reported as a change.
//
function isEmptyValue(value) {
  return (
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (_.isPlainObject(value) && Object.keys(value).length === 0)
  );
}

function isSameAuditValue(a, b) {
  const x = normalize(a);
  const y = normalize(b);
  if (isEmptyValue(x) && isEmptyValue(y)) return true;
  return _.isEqual(x, y);
}

//
// Collapse a list of `{ fieldName, previous, current, ... }` entries into one
// entry per field (earliest previous, latest current, other properties from
// the latest entry) and drop fields whose net change is nothing.
//
function collapseAuditChanges(updates) {
  if (!Array.isArray(updates)) return [];

  const byField = new Map();
  for (const update of updates) {
    if (!update || typeof update.fieldName !== 'string') continue;
    const existing = byField.get(update.fieldName);
    if (existing) {
      byField.set(update.fieldName, {
        ...update,
        previous: existing.previous
      });
    } else {
      byField.set(update.fieldName, { ...update });
    }
  }

  const collapsed = [];
  for (const update of byField.values()) {
    // Redacted entries store a placeholder instead of the value, so a no-op
    // cannot be detected here; those are filtered at save time instead.
    if (!update.redacted && isSameAuditValue(update.previous, update.current))
      continue;
    collapsed.push(update);
  }

  return collapsed;
}

module.exports = {
  normalizeAuditValue: normalize,
  isSameAuditValue,
  collapseAuditChanges
};
