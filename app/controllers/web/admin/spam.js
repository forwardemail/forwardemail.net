/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const paginate = require('koa-ctx-paginate');
const dayjs = require('dayjs-with-plugins');

const getMongoQuery = require('#helpers/get-mongo-query');
const { Logs } = require('#models');

const MAX_TIME_MS = 10000;

// Cap count at 10,000 to improve performance on large collections
const MAX_COUNT_LIMIT = 10_000;

async function list(ctx) {
  const userQuery = getMongoQuery(ctx);

  // Build base query: always filter to spam bounce category
  const query = { ...userQuery, bounce_category: 'spam' };

  // Parse filter params
  const { ip, hostname, start_date, end_date } = ctx.query;

  if (ip) query['meta.app.ip'] = ip;
  if (hostname) query['meta.app.hostname'] = hostname;

  // Date range filter (defaults to last 7 days)
  const endDate = end_date ? dayjs(end_date).endOf('day').toDate() : new Date();
  const startDate = start_date
    ? dayjs(start_date).startOf('day').toDate()
    : dayjs(endDate).subtract(7, 'day').toDate();

  query.created_at = { $gte: startDate, $lte: endDate };

  // Determine time bucket format based on range span
  const rangeDays = dayjs(endDate).diff(dayjs(startDate), 'day');
  const dateFormat = rangeDays <= 3 ? '%Y-%m-%dT%H:00' : '%Y-%m-%d';

  // Queries for 24h/7d/30d summary counts
  const now = new Date();
  const baseMatch = { bounce_category: 'spam' };
  if (ip) baseMatch['meta.app.ip'] = ip;
  if (hostname) baseMatch['meta.app.hostname'] = hostname;

  const [
    logs,
    itemCount,
    timeline,
    topIPs,
    topErrors,
    topHostnames,
    count24h,
    count7d,
    count30d
  ] = await Promise.all([
    // Paginated logs
    // eslint-disable-next-line unicorn/no-array-callback-reference
    Logs.find(query)
      .hint({ bounce_category: 1, domains: 1, created_at: 1 })
      .limit(ctx.query.limit)
      .skip(ctx.paginate.skip)
      .sort(ctx.query.sort || '-created_at')
      .select(
        'created_at meta.app.ip meta.app.hostname err.message err.responseCode err.statusCode err.status message domains'
      )
      .lean()
      .maxTimeMS(MAX_TIME_MS)
      .exec(),
    // Item count
    Logs.countDocuments(query, {
      hint: { bounce_category: 1, domains: 1, created_at: 1 },
      maxTimeMS: MAX_TIME_MS
    }),
    // Spam over time
    Logs.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$created_at' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).option({
      hint: { bounce_category: 1, domains: 1, created_at: 1 },
      maxTimeMS: MAX_TIME_MS
    }),
    // Top IPs
    Logs.aggregate([
      { $match: query },
      { $group: { _id: '$meta.app.ip', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).option({
      hint: { bounce_category: 1, domains: 1, created_at: 1 },
      maxTimeMS: MAX_TIME_MS
    }),
    // Top error messages
    Logs.aggregate([
      { $match: query },
      { $group: { _id: '$err.message', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).option({
      hint: { bounce_category: 1, domains: 1, created_at: 1 },
      maxTimeMS: MAX_TIME_MS
    }),
    // Top hostnames
    Logs.aggregate([
      { $match: query },
      { $group: { _id: '$meta.app.hostname', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).option({
      hint: { bounce_category: 1, domains: 1, created_at: 1 },
      maxTimeMS: MAX_TIME_MS
    }),
    // 24h count
    Logs.countDocuments(
      {
        ...baseMatch,
        created_at: { $gte: dayjs(now).subtract(24, 'hour').toDate() }
      },
      {
        hint: { bounce_category: 1, domains: 1, created_at: 1 },
        maxTimeMS: MAX_TIME_MS
      }
    ),
    // 7d count
    Logs.countDocuments(
      {
        ...baseMatch,
        created_at: { $gte: dayjs(now).subtract(7, 'day').toDate() }
      },
      {
        hint: { bounce_category: 1, domains: 1, created_at: 1 },
        maxTimeMS: MAX_TIME_MS
      }
    ),
    // 30d count
    Logs.countDocuments(
      {
        ...baseMatch,
        created_at: { $gte: dayjs(now).subtract(30, 'day').toDate() }
      },
      {
        hint: { bounce_category: 1, domains: 1, created_at: 1 },
        maxTimeMS: MAX_TIME_MS
      }
    )
  ]);

  // Cap the item count to prevent UI issues with very large result sets
  const cappedItemCount = Math.min(itemCount, MAX_COUNT_LIMIT);
  const pageCount = Math.ceil(cappedItemCount / ctx.query.limit);

  const renderData = {
    logs,
    pageCount,
    itemCount: cappedItemCount,
    timeline,
    topIPs,
    topErrors,
    topHostnames,
    count24h,
    count7d,
    count30d,
    startDate: dayjs(startDate).format('YYYY-MM-DD'),
    endDate: dayjs(endDate).format('YYYY-MM-DD'),
    filterIP: ip || '',
    filterHostname: hostname || '',
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  };

  if (ctx.accepts('html')) return ctx.render('admin/spam', renderData);

  const table = await ctx.render('admin/spam/_table', renderData);
  ctx.body = { table };
}

module.exports = {
  list
};
