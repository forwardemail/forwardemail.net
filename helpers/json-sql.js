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
// explicit forms (`{ expression }`, `{ query }`), which are never built from
// request data.
//

const { Builder } = require('json-sql-enhanced');
const BaseDialect = require('json-sql-enhanced/lib/dialects/base/index.js');

const RE_IDENTIFIER = /^[A-Za-z_]\w*$/;
const SORT_DIRECTIONS = new Set([1, -1, '1', '-1', 'asc', 'desc']);

function assertIdentifier(name) {
  if (name === '*' || (typeof name === 'string' && RE_IDENTIFIER.test(name)))
    return;
  const err = new TypeError('Invalid SQL identifier');
  err.identifier = typeof name === 'string' ? name.slice(0, 100) : typeof name;
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

function assertQuery(query) {
  if (!query || typeof query !== 'object') return;
  assertCount('limit', query.limit);
  assertCount('offset', query.offset);
  assertSort(query.sort);
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

  const { buildQuery } = BaseDialect.prototype;
  BaseDialect.prototype.buildQuery = function (query) {
    assertQuery(query);
    return buildQuery.call(this, query);
  };
}

module.exports = { Builder };
