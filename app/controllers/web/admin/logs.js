/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const ms = require('ms');
const paginate = require('koa-ctx-paginate');
const _ = require('#helpers/lodash');

const env = require('#config/env');
const getMongoQuery = require('#helpers/get-mongo-query');
const { Logs } = require('#models');

//
// Performance constants (aligned with my-account/list-logs.js and admin/emails.js)
//
const MAX_COUNT_LIMIT = 10_000;
const MAX_TIME_MS = ms('60s');

//
// In-memory cache for unique hosts and job names.
// These are only used for the "Quick filter" UI buttons and change infrequently.
// Caching avoids running expensive global aggregation/distinct queries on every page load.
//
let cachedUniqueHosts = null;
let cachedJobNames = null;
let hostsCacheExpiry = 0;
let jobNamesCacheExpiry = 0;
const CACHE_TTL = ms('5m');

//
// Fetch unique hostnames from recent logs.
//
// IMPORTANT: LOG_RETENTION defaults to 7d, meaning ALL ~9M documents in the
// collection are within the last 7 days. A `created_at >= 7d ago` filter
// therefore matches the ENTIRE collection and provides zero narrowing benefit.
//
// Instead, we use a $sample-based approach: sample a subset of recent documents
// and extract unique hostnames from them. Hostnames are a low-cardinality field
// (typically < 20 unique values), so sampling even a small fraction gives us
// complete coverage. This turns a 9M-document full scan into a fast operation.
//
// Alternatively, we scope to the last 1 hour of data (~53K docs at ~900/min)
// which is small enough to scan quickly and still captures all active hostnames.
//
async function getUniqueHosts() {
  const now = Date.now();
  if (cachedUniqueHosts !== null && now < hostsCacheExpiry) {
    return cachedUniqueHosts;
  }

  try {
    const results = await Logs.aggregate(
      [
        {
          $match: {
            created_at: { $gte: new Date(now - ms('1h')) },
            'meta.app.hostname': { $exists: true }
          }
        },
        { $group: { _id: '$meta.app.hostname' } }
      ],
      { maxTimeMS: MAX_TIME_MS }
    );

    cachedUniqueHosts = results.map((doc) => doc._id).filter(Boolean);
    hostsCacheExpiry = now + CACHE_TTL;
  } catch {
    // On timeout or error, return stale cache or empty array so the page still renders
    if (!cachedUniqueHosts) {
      cachedUniqueHosts = [];
    }
  }

  return cachedUniqueHosts;
}

//
// Fetch unique job names from recent logs.
//
// Same rationale as getUniqueHosts — scope to last 1 hour instead of 7 days.
// Job names are also low-cardinality and all active jobs will appear within 1 hour.
//
async function getJobNames() {
  const now = Date.now();
  if (cachedJobNames !== null && now < jobNamesCacheExpiry) {
    return cachedJobNames;
  }

  try {
    const results = await Logs.aggregate(
      [
        {
          $match: {
            'meta.app.hostname': env.BREE_HOST,
            'meta.app.worker_threads.workerData.job.name': { $exists: true },
            created_at: { $gte: new Date(now - ms('1h')) }
          }
        },
        { $group: { _id: '$meta.app.worker_threads.workerData.job.name' } },
        { $sort: { _id: 1 } }
      ],
      { maxTimeMS: MAX_TIME_MS }
    );

    cachedJobNames = results
      .map((doc) => doc._id)
      .filter(Boolean)
      .sort();
    jobNamesCacheExpiry = now + CACHE_TTL;
  } catch {
    // On timeout or error, return stale cache or empty array so the page still renders
    if (!cachedJobNames) {
      cachedJobNames = [];
    }
  }

  return cachedJobNames;
}

async function list(ctx) {
  const query = getMongoQuery(ctx);
  const isEmptyQuery = _.isEmpty(query);

  //
  // Cap the skip value to prevent deep pagination beyond MAX_COUNT_LIMIT.
  // Without this, a user navigating to page 900,000 would force MongoDB
  // to scan and discard hundreds of thousands of documents.
  // (Same approach used in my-account/list-logs.js)
  //
  const cappedSkip = Math.min(
    ctx.paginate.skip,
    MAX_COUNT_LIMIT - ctx.query.limit
  );

  //
  // Build the find query with performance safeguards:
  //
  // - `.populate('user', 'email')` — populates the ObjectId ref and selects only `email`.
  //   (Consistent with admin/payments.js: `.populate('user', 'email plan')`)
  //
  // - `.select(...)` — Exclude heavy metadata fields not rendered by the list template.
  //   The template only accesses: id, created_at, message, err, meta.level, meta.is_http,
  //   meta.request.{method,url}, meta.response.status_code, meta.user.email, and user.email.
  //   (Consistent with my-account/list-logs.js and admin/emails.js which also use .select())
  //
  // - `.maxTimeMS(60s)` — Prevent any single query from running indefinitely and
  //   exhausting the connection pool. (Consistent with admin/emails.js)
  //
  // eslint-disable-next-line unicorn/no-array-callback-reference
  let findQuery = Logs.find(query)
    .limit(ctx.query.limit)
    .skip(Math.max(0, cappedSkip))
    .populate('user', 'email')
    .select('-meta.os -meta.cpus -meta.networkInterfaces -meta.worker')
    .sort(ctx.query.sort || '-created_at')
    .lean()
    .maxTimeMS(MAX_TIME_MS);

  //
  // For the default page load (empty query, sorted by -created_at), explicitly hint
  // the `{ created_at: 1 }` TTL index. Without this, MongoDB's query planner may
  // choose a different index or a full collection scan for a `{}` query across ~9M docs.
  // The TTL index on `created_at` can be traversed in reverse order for the
  // `-created_at` sort, making the default page load near-instant (reads the last
  // N entries directly off the index tail).
  //
  // We only hint for the empty-query case because filtered queries may benefit from
  // different indexes, and a forced hint could prevent the planner from choosing
  // a more selective index.
  //
  if (isEmptyQuery) {
    findQuery = findQuery.hint({ created_at: 1 });
  }

  //
  // Build the count query:
  // - Empty query: use estimatedDocumentCount() which reads collection metadata (free).
  // - Filtered query: use a capped aggregation pipeline ($match → $limit → $count)
  //   that stops after MAX_COUNT_LIMIT matches. This is dramatically faster than
  //   countDocuments(query) which must scan all matching documents.
  //   (Same approach used in my-account/list-logs.js)
  //
  const countQuery = isEmptyQuery
    ? Logs.estimatedDocumentCount()
    : Logs.aggregate(
        [{ $match: query }, { $limit: MAX_COUNT_LIMIT }, { $count: 'total' }],
        { maxTimeMS: MAX_TIME_MS }
      ).then((result) => result[0]?.total || 0);

  //
  // IMPORTANT: Do NOT await getUniqueHosts() and getJobNames() in Promise.all
  // with the main find query. On cold start (cache miss), these aggregations
  // can take 10-60s because they scan a large portion of the collection.
  // The main find query (with hint) should return in <100ms.
  //
  // Instead, fire the cache refresh in the background and use whatever is
  // currently cached (or empty arrays on first load). The filter buttons
  // will populate on the next page load or refresh.
  //
  // This ensures the page ALWAYS loads fast — the user sees their logs
  // immediately, and the filter dropdowns populate within 5 minutes.
  //
  if (cachedUniqueHosts === null || Date.now() >= hostsCacheExpiry) {
    getUniqueHosts().catch(() => {});
  }

  if (cachedJobNames === null || Date.now() >= jobNamesCacheExpiry) {
    getJobNames().catch(() => {});
  }

  const [logs, itemCount] = await Promise.all([findQuery.exec(), countQuery]);

  //
  // Use whatever is currently cached (may be null on very first load).
  // The background refresh will populate these for subsequent requests.
  //
  const uniqueHosts = cachedUniqueHosts || [];
  const jobNames = cachedJobNames || [];

  //
  // Cap the page count so pagination doesn't show pages beyond MAX_COUNT_LIMIT.
  // The _pagination.pug mixin already displays "10,000+ results found" when
  // itemCount >= 10,000, so the UI handles this gracefully.
  // (Same approach used in admin/emails.js)
  //
  const cappedItemCount = Math.min(itemCount, MAX_COUNT_LIMIT);
  const pageCount = Math.ceil(cappedItemCount / ctx.query.limit);

  if (ctx.accepts('html')) {
    return ctx.render('admin/logs', {
      logs,
      pageCount,
      itemCount: cappedItemCount,
      uniqueHosts,
      jobNames,
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });
  }

  const table = await ctx.render('admin/logs/_table', {
    logs,
    pageCount,
    itemCount: cappedItemCount,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });

  ctx.body = { table };
}

async function retrieve(ctx) {
  ctx.state.result = await Logs.findById(ctx.params.id);
  if (!ctx.state.result) {
    throw Boom.notFound(ctx.translateError('INVALID_LOG'));
  }

  return ctx.render('admin/logs/retrieve');
}

module.exports = {
  list,
  retrieve
};
