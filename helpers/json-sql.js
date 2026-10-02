/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// json-sql-enhanced (pinned) with its SQL text sinks closed.
//
// Values are always bound as parameters, but three parts of a query are
// written into the SQL text as given:
//
//  - identifiers (field, table and alias names, condition and sort keys):
//    wrapped in double quotes without escaping, and passed through unquoted
//    when they contain parentheses or look like CASE/SELECT expressions
//  - `limit` and `offset`
//  - sort directions ("used as-is")
//
// Today every one of them comes from our own code, but a key or a sort taken
// from a request would have been SQL injection.  Here identifiers must be
// plain names (or `*`), limit/offset non-negative integers and directions
// asc/desc; anything else throws before any SQL is built.  Raw SQL still has
// explicit forms (`{ expression }`, `{ query }`) for fields and terms.
//
// Values are the fourth sink: a condition value that is a plain object with
// an `expression` key is written into the SQL text verbatim by the builder
// (`_pushValue` → `_handleObjectValue` → `buildExpression`), so a JSON body
// such as `{ "calendar_id": { "$eq": { "expression": "1 OR 1" } } }` that a
// controller passed through to `findOne()` ran as raw SQL.  Our own code only
// ever binds strings, numbers, booleans, dates, buffers, ObjectIds and arrays
// as values, never a plain object, so a plain object value throws here.
//

const { Builder } = require('json-sql-enhanced');
const BaseDialect = require('json-sql-enhanced/lib/dialects/base/index.js');

function isPlainObject(value) {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

const RE_IDENTIFIER = /^[A-Za-z_]\w*$/;
const SORT_DIRECTIONS = new Set([1, -1, '1', '-1', 'asc', 'desc']);

function assertIdentifier(name) {
  if (name === '*' || (typeof name === 'string' && RE_IDENTIFIER.test(name)))
    return;
  const err = new TypeError('Invalid SQL identifier');
  err.identifier = typeof name === 'string' ? name.slice(0, 100) : typeof name;
  throw err;
}

//
// A key of a JSON path written into the query (`'$.<key>'`), e.g. a vCard
// parameter name such as `x-service-type` (letters, digits, `_` and `-`,
// none of which ends the string or the path step)
//
const RE_JSON_PATH_KEY = /^[A-Za-z_][\w-]*$/;

function assertJsonPathKey(key) {
  if (typeof key === 'string' && RE_JSON_PATH_KEY.test(key)) return;
  const err = new TypeError('Invalid SQL identifier');
  err.identifier = typeof key === 'string' ? key.slice(0, 100) : typeof key;
  throw err;
}

function assertCount(name, value) {
  if (value === undefined || value === null) return;
  if (Number.isSafeInteger(value) && value >= 0) return;
  throw new TypeError(`Invalid SQL ${name}`);
}

function assertSort(sort) {
  if (sort === undefined || sort === null || typeof sort === 'string') return;
  const items = Array.isArray(sort) ? sort : [sort];
  for (const item of items) {
    if (typeof item === 'string' || item === null || typeof item !== 'object')
      continue;
    for (const direction of Object.values(item)) {
      const normalized =
        typeof direction === 'string' ? direction.toLowerCase() : direction;
      if (!SORT_DIRECTIONS.has(normalized))
        throw new TypeError('Invalid SQL sort direction');
    }
  }
}

function assertValue(value) {
  // `{}` keeps its meaning of `null`; anything with keys (`{ expression }`,
  // `{ pattern, values }`, `{ field }`, `{ select }`) would be built into the
  // SQL text instead of bound
  if (isPlainObject(value) && Object.keys(value).length > 0) {
    const err = new TypeError('Invalid SQL value');
    err.keys = Object.keys(value).slice(0, 10);
    throw err;
  }
}

// update modifiers (`{ $set: { name } }` or `{ name }`) and insert values
// are written through the "term" block, which takes `{ expression }` as is
function assertModifier(modifier) {
  if (!modifier || typeof modifier !== 'object') return;
  for (const [key, value] of Object.entries(modifier)) {
    if (key.startsWith('$')) {
      if (value && typeof value === 'object')
        for (const nested of Object.values(value)) assertValue(nested);
    } else {
      assertValue(value);
    }
  }
}

function assertValues(values) {
  if (!values || typeof values !== 'object') return;
  for (const row of Array.isArray(values) ? values : [values]) {
    if (row && typeof row === 'object')
      for (const value of Object.values(row)) assertValue(value);
  }
}

function assertQuery(query) {
  if (!query || typeof query !== 'object') return;
  assertCount('limit', query.limit);
  assertCount('offset', query.offset);
  assertSort(query.sort);
  assertModifier(query.modifier);
  assertValues(query.values);
  // nested queries (`{ query }` terms, unions) are built through build() too
}

if (!BaseDialect.prototype.wrapIdentifier.isHardened) {
  const { wrapIdentifier } = BaseDialect.prototype;
  const hardenedWrapIdentifier = function (name) {
    assertIdentifier(name);
    return wrapIdentifier.call(this, name);
  };

  hardenedWrapIdentifier.isHardened = true;
  BaseDialect.prototype.wrapIdentifier = hardenedWrapIdentifier;

  //
  // Two operators write part of a condition into the SQL text themselves:
  // `$is`/`$isnot` write their value (`"a" is 1 OR 1=1`), and `$elemMatch`
  // writes each key into a JSON path (`json_extract(value, '$.<key>')`).
  // Only a null/boolean value and identifier keys are allowed.
  //
  const { buildComparisonOperator } = BaseDialect.prototype;
  BaseDialect.prototype.buildComparisonOperator = function (
    operator,
    field,
    value
  ) {
    if (
      (operator === '$is' || operator === '$isnot') &&
      value !== null &&
      typeof value !== 'boolean'
    )
      throw new TypeError(`Invalid ${operator} value`);
    if (operator === '$elemMatch' && value && typeof value === 'object')
      for (const key of Object.keys(value)) assertJsonPathKey(key);
    return buildComparisonOperator.call(this, operator, field, value);
  };

  const { buildQuery } = BaseDialect.prototype;
  BaseDialect.prototype.buildQuery = function (query) {
    assertQuery(query);
    return buildQuery.call(this, query);
  };
}

if (!Builder.prototype._pushValue.isHardened) {
  const { _pushValue } = Builder.prototype;
  const hardenedPushValue = function (value) {
    assertValue(value);
    return _pushValue.call(this, value);
  };

  hardenedPushValue.isHardened = true;
  Builder.prototype._pushValue = hardenedPushValue;
}

module.exports = { Builder };
