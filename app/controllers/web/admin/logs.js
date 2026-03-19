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
// FIX: Cap the maximum count to prevent full collection scans
// (same approach used in my-account/list-logs.js)
//
const MAX_COUNT_LIMIT = 10_000;
const SIXTY_SECONDS = ms('60s');

//
// FIX: Cache unique hosts and job names to avoid running expensive
// global aggregation/distinct queries on every single page load.
// These values change infrequently and do not need real-time accuracy.
//
let cachedUniqueHosts = null;
let cachedJobNames = null;
let cacheTimestamp = 0;
const CACHE_TTL = ms('5m');

async function getUniqueHosts() {
  const now = Date.now();
  if (cachedUniqueHosts && now - cacheTimestamp < CACHE_TTL)
    return cachedUniqueHosts;

  const results = await Logs.aggregate(
    [
      //
      // FIX: Scope aggregation to recent logs (last 7 days) to avoid
      // scanning the entire 9M+ document collection just for hostnames.
      //
      {
        $match: {
          'meta.app.hostname': { $exists: true },
          created_at: {
            $gte: new Date(now - ms('7d'))
          }
        }
      },
      { $group: { _id: '$meta.app.hostname' } },
      { $unwind: '$_id' }
    ],
    { hint: { 'meta.app.hostname': 1 }, maxTimeMS: SIXTY_SECONDS }
  );

  cachedUniqueHosts = results.map((doc) => doc._id);
  cacheTimestamp = now;
  return cachedUniqueHosts;
}

async function getJobNames() {
  const now = Date.now();
  if (cachedJobNames && now - cacheTimestamp < CACHE_TTL) return cachedJobNames;

  //
  // FIX: Use aggregation with $match + $group instead of distinct()
  // so we can apply a hint and scope to recent logs.
  // (distinct command does not support hints)
  // <https://jira.mongodb.org/browse/SERVER-14227>
  //
  const results = await Logs.aggregate(
    [
      {
        $match: {
          'meta.app.hostname': env.BREE_HOST,
          'meta.app.worker_threads.workerData.job.name': { $exists: true },
          created_at: {
            $gte: new Date(now - ms('7d'))
          }
        }
      },
      { $group: { _id: '$meta.app.worker_threads.workerData.job.name' } },
      { $sort: { _id: 1 } }
    ],
    { maxTimeMS: SIXTY_SECONDS }
  );

  cachedJobNames = results
    .map((doc) => doc._id)
    .filter(Boolean)
    .sort();
  return cachedJobNames;
}

async function list(ctx) {
  const query = getMongoQuery(ctx);

  //
  // FIX: Cap the skip value to prevent accessing pages beyond MAX_COUNT_LIMIT
  // This prevents empty pages when users manually enter high page numbers
  // (same approach used in my-account/list-logs.js)
  //
  const cappedSkip = Math.min(
    ctx.paginate.skip,
    MAX_COUNT_LIMIT - ctx.query.limit
  );

  const [logs, itemCount, uniqueHosts, jobNames] = await Promise.all([
    // eslint-disable-next-line unicorn/no-array-callback-reference
    Logs.find(query)
      .limit(ctx.query.limit)
      .skip(Math.max(0, cappedSkip))
      .populate('user.email')
      .sort(ctx.query.sort || '-created_at')
      .lean()
      //
      // FIX: Add maxTimeMS to prevent queries from running indefinitely
      // and exhausting the connection pool when the query is expensive.
      //
      .maxTimeMS(SIXTY_SECONDS)
      .exec(),
    //
    // FIX: Use capped aggregation for count (much faster for large datasets)
    // instead of unbounded countDocuments which scans the entire collection.
    // estimatedDocumentCount is still used for the empty-query case since
    // it reads collection metadata and is essentially free.
    //
    _.isEmpty(query)
      ? Logs.estimatedDocumentCount()
      : Logs.aggregate(
          [{ $match: query }, { $limit: MAX_COUNT_LIMIT }, { $count: 'total' }],
          { maxTimeMS: SIXTY_SECONDS }
        ).then((result) => result[0]?.total || 0),
    //
    // FIX: Use cached + time-scoped aggregation for unique hosts
    // instead of scanning the entire collection on every page load.
    //
    getUniqueHosts(),
    //
    // FIX: Use cached + time-scoped aggregation for job names
    // instead of an unbounded distinct() on every page load.
    //
    getJobNames()
  ]);

  //
  // FIX: Cap page count based on MAX_COUNT_LIMIT to prevent pagination
  // from showing pages that have no data (due to capped count).
  // This prevents empty pages when capped count is reached.
  //
  const maxPageCount = Math.ceil(MAX_COUNT_LIMIT / ctx.query.limit);
  const pageCount = Math.min(
    Math.ceil(itemCount / ctx.query.limit),
    maxPageCount
  );

  if (ctx.accepts('html'))
    return ctx.render('admin/logs', {
      logs,
      pageCount,
      itemCount,
      uniqueHosts,
      jobNames,
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });

  const table = await ctx.render('admin/logs/_table', {
    logs,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });

  ctx.body = { table };
}

async function retrieve(ctx) {
  ctx.state.result = await Logs.findById(ctx.params.id);
  if (!ctx.state.result) throw Boom.notFound(ctx.translateError('INVALID_LOG'));
  return ctx.render('admin/logs/retrieve');
}

module.exports = {
  list,
  retrieve
};
