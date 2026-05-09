/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// Only these MongoDB query operators are permitted in admin search queries.
// Field names (non-$ keys) are always allowed.
// Any key starting with $ that is not in this set is rejected.
const ALLOWED_QUERY_OPERATORS = new Set([
  // Comparison
  '$eq',
  '$ne',
  '$gt',
  '$gte',
  '$lt',
  '$lte',
  '$in',
  '$nin',
  // Logical
  '$and',
  '$or',
  '$nor',
  '$not',
  // Element
  '$exists',
  '$type',
  // Evaluation (safe subset only)
  '$regex',
  '$options',
  '$mod',
  // Array
  '$all',
  '$elemMatch',
  '$size'
]);

const MAX_DEPTH = 10;
const MAX_KEYS = 30;
const MAX_ARRAY_LENGTH = 50;
const MAX_STRING_LENGTH = 500;

function assertAllowedMongoQuery(obj, depth) {
  if (depth === undefined) depth = 0;
  if (depth > MAX_DEPTH) throw new Error('Query is too deeply nested');

  if (Array.isArray(obj)) {
    if (obj.length > MAX_ARRAY_LENGTH)
      throw new Error(`Array exceeds maximum length of ${MAX_ARRAY_LENGTH}`);
    for (const item of obj) assertAllowedMongoQuery(item, depth + 1);
    return;
  }

  if (typeof obj === 'string') {
    if (obj.length > MAX_STRING_LENGTH)
      throw new Error(
        `String value exceeds maximum length of ${MAX_STRING_LENGTH}`
      );
    return;
  }

  if (typeof obj !== 'object' || obj === null) return;

  const keys = Object.keys(obj);
  if (keys.length > MAX_KEYS)
    throw new Error(`Object exceeds maximum key count of ${MAX_KEYS}`);

  for (const key of keys) {
    if (key.startsWith('$') && !ALLOWED_QUERY_OPERATORS.has(key))
      throw new Error(`Query contains disallowed operator: ${key}`);
    // $regex value must be a string
    if (key === '$regex' && typeof obj[key] !== 'string')
      throw new Error('$regex value must be a string');
    // $options value must be a string containing only valid flags
    if (key === '$options') {
      if (typeof obj[key] !== 'string')
        throw new Error('$options value must be a string');
      if (!/^[imxs]*$/.test(obj[key]))
        throw new Error('$options contains invalid flags');
    }

    assertAllowedMongoQuery(obj[key], depth + 1);
  }
}

module.exports = assertAllowedMongoQuery;
