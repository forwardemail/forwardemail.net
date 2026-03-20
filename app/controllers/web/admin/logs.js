/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const ms = require('ms');
const paginate = require('koa-ctx-paginate');
const _ = require('#helpers/lodash');

const config = require('#config');
const env = require('#config/env');
const getMongoQuery = require('#helpers/get-mongo-query');
const { Logs } = require('#models');

//
// Performance constants (aligned with my-account/list-logs.js and admin/emails.js)
//
const MAX_COUNT_LIMIT = 10_000;
const MAX_TIME_MS = ms('60s');

//
// Static list of unique hostnames built from env vars at module load time.
// This is the same approach used in app/controllers/web/ips.js (lines 14-50).
// The hostnames that appear in `meta.app.hostname` are the server hostnames
// from the env config, so there is no need to query the database for them.
//
const HOSTNAMES = _.uniq(
  config.env === 'production'
    ? [
        env.API_HOST,
        env.BREE_HOST,
        env.CALDAV_HOST,
        env.CARDDAV_HOST,
        env.IMAP_HOST,
        env.POP3_HOST,
        env.SMTP_HOST,
        env.WEB_HOST,
        env.MX1_HOST,
        env.MX2_HOST,
        // env.MAIL_HOST,
        env.REDIS_HOST,
        env.SQLITE_HOST,
        env.MONGO_HOST,
        env.LOGS_HOST
      ]
    : [
        'api.forwardemail.net',
        'bree.forwardemail.net',
        'caldav.forwardemail.net',
        'carddav.forwardemail.net',
        'imap.forwardemail.net',
        'pop3.forwardemail.net',
        'smtp.forwardemail.net',
        'forwardemail.net',
        'mx1.forwardemail.net',
        'mx2.forwardemail.net',
        // 'mail.forwardemail.net',
        'redis.forwardemail.net',
        'sqlite.forwardemail.net',
        'mongo.forwardemail.net',
        'logs.forwardemail.net'
      ]
)
  .filter(Boolean)
  .sort();

//
// In-memory cache for unique job names.
// Job names are only used for the "Quick filter by job name" UI buttons.
// Caching avoids running an expensive aggregation on every page load.
//
let cachedJobNames = null;
let jobNamesCacheExpiry = 0;
const CACHE_TTL = ms('5m');

//
// Fetch unique job names from recent logs (last 1 hour).
//
// Job names are low-cardinality and all active jobs will appear within 1 hour.
// Results are cached in-memory for 5 minutes.
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
  // - NO `.populate('user', ...)` — The Logs model is on the LOGS_URI connection
  //   while Users is on the MONGO_URI connection. Mongoose `.populate()` across
  //   separate connections issues a secondary query to the Users database for
  //   every batch of log documents. This cross-database populate was the primary
  //   cause of the page timeout. The template already has a fallback that reads
  //   `log.meta.user.email` (embedded in the log document) when `log.user.email`
  //   is not available, so populate is not needed for the list view.
  //   (Note: admin/payments.js uses `.populate('user', 'email plan')` safely
  //   because Payments is on the same MONGO_URI connection as Users.)
  //
  // - `.select(...)` — Use an inclusion projection to fetch ONLY the fields the
  //   list template actually accesses. Average doc size is ~14.5 KB; the template
  //   only needs ~1 KB of that (id, created_at, message, err, meta.level,
  //   meta.is_http, meta.request, meta.response.status_code, meta.user.email).
  //   This dramatically reduces BSON deserialization and network transfer.
  //   (Consistent with my-account/list-logs.js and admin/emails.js which also
  //   use .select() to exclude heavy fields.)
  //
  // - `.maxTimeMS(60s)` — Prevent any single query from running indefinitely and
  //   exhausting the connection pool. (Consistent with admin/emails.js)
  //
  // eslint-disable-next-line unicorn/no-array-callback-reference
  let findQuery = Logs.find(query)
    .limit(ctx.query.limit)
    .skip(Math.max(0, cappedSkip))
    .select(
      'id created_at message err meta.level meta.is_http meta.request.method meta.request.url meta.response.status_code meta.user.email'
    )
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
  // IMPORTANT: Do NOT await getJobNames() in Promise.all with the main find query.
  // On cold start (cache miss), the aggregation can be slow because it scans a
  // portion of the collection. The main find query (with hint) returns in <100ms.
  //
  // Instead, fire the cache refresh in the background and use whatever is
  // currently cached (or empty array on first load). The filter buttons
  // will populate on the next page load or refresh.
  //
  // This ensures the page ALWAYS loads fast — the user sees their logs
  // immediately, and the filter dropdowns populate within 5 minutes.
  //
  // NOTE: Hostnames use a static HOSTNAMES constant (same as ips.js) so they
  // are always available immediately with no database query needed.
  //
  if (cachedJobNames === null || Date.now() >= jobNamesCacheExpiry) {
    getJobNames().catch(() => {});
  }

  const [logs, itemCount] = await Promise.all([findQuery.exec(), countQuery]);

  //
  // Use whatever is currently cached (may be empty on very first load).
  // The background refresh will populate job names for subsequent requests.
  //
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
      uniqueHosts: HOSTNAMES,
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
