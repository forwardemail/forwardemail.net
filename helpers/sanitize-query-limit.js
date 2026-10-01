/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// koa-ctx-paginate keeps `?limit=0` and turns a negative limit into 0, and a
// limit of 0 means "no limit" to Mongo (`.limit(0)`) and to our SQLite query
// builder (no LIMIT clause), so one request could page a whole collection.
// Anything below 1 is dropped here so the route's own default applies.
//
function sanitizeQueryLimit(ctx, next) {
  if (ctx.query.limit !== undefined) {
    const limit = Number.parseInt(ctx.query.limit, 10);
    if (!Number.isFinite(limit) || limit < 1) delete ctx.query.limit;
  }

  return next();
}

module.exports = sanitizeQueryLimit;
