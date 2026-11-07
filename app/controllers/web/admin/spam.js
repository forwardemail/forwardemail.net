/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { isIP } = require('node:net');

const Boom = require('@hapi/boom');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const paginate = require('koa-ctx-paginate');
const _ = require('#helpers/lodash');

const getMongoQuery = require('#helpers/get-mongo-query');
const getAllowedSort = require('#helpers/get-allowed-sort');
const { Logs } = require('#models');

// (under the gateway's timeout, with the page still to render)
const MAX_TIME_MS = ms('20s');
const MAX_COUNT_LIMIT = 10_000;

// the top lists are drawn from the most recent spam logs in the range
const SAMPLE_SIZE = 10_000;

const SORT_FIELDS = new Set(['created_at']);

// the connecting client, not our own server (`meta.app`)
const IP_FIELD = 'meta.session.remoteAddress';
const HOSTNAME_FIELD = 'meta.session.resolvedClientHostname';

// (see the Logs model; one for each filter, with the range and its sort)
const SPAM_INDEX = { bounce_category: 1, created_at: 1 };
const IP_INDEX = { bounce_category: 1, [IP_FIELD]: 1, created_at: 1 };
const HOSTNAME_INDEX = {
  bounce_category: 1,
  [HOSTNAME_FIELD]: 1,
  created_at: 1
};

const MAX_RANGE = ms('366d');

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// the keys of the built indexes (a build in progress is not listed)
async function getIndexes() {
  const indexes = await Logs.collection.listIndexes().toArray();
  return new Set(indexes.map((index) => JSON.stringify(index.key)));
}

// a query stopped by `maxTimeMS`
function isTimeout(err) {
  return err && (err.code === 50 || err.codeName === 'MaxTimeMSExpired');
}

function parseDate(value, name) {
  if (value === undefined || value === '') return;
  if (typeof value !== 'string' || !DATE_REGEX.test(value))
    throw Boom.badRequest(`Invalid ${name}`);
  const date = dayjs.utc(value, 'YYYY-MM-DD', true);
  if (!date.isValid()) throw Boom.badRequest(`Invalid ${name}`);
  return date;
}

//
// Filters shared by the table and the statistics: the spam category, the
// client IP and hostname, the date range (UTC days, the last 7 days by
// default) and the MongoDB query from the search form.
//
async function getFilters(ctx) {
  const { ip, hostname } = ctx.query;
  const filters = {};

  if (ip !== undefined && ip !== '') {
    if (typeof ip !== 'string' || !isIP(ip))
      throw Boom.badRequest('Invalid IP address');
    filters.ip = ip;
  }

  if (hostname !== undefined && hostname !== '') {
    if (typeof hostname !== 'string' || hostname.length > 253)
      throw Boom.badRequest('Invalid hostname');
    filters.hostname = hostname;
  }

  const end = parseDate(ctx.query.end_date, 'end date');
  const start = parseDate(ctx.query.start_date, 'start date');
  const endDate = end ? end.endOf('day').toDate() : new Date();
  const startDate = start
    ? start.startOf('day').toDate()
    : dayjs(endDate).subtract(7, 'day').toDate();
  if (startDate > endDate)
    throw Boom.badRequest('Start date must be before end date');
  if (endDate - startDate > MAX_RANGE)
    throw Boom.badRequest('Date range must be at most a year');

  // everything except the date range (for the summary counts)
  const base = { bounce_category: 'spam' };
  if (filters.ip) base[IP_FIELD] = filters.ip;
  if (filters.hostname) base[HOSTNAME_FIELD] = filters.hostname;

  //
  // Hint the index for the filters (the planner may otherwise choose one
  // without `created_at`, and sort or scan every spam log), or the date
  // index if that one is not built yet: a hint for an index that does not
  // exist, or is still building, fails the query. A MongoDB query is left
  // to the planner.
  //
  const mongoQuery = getMongoQuery(ctx);
  const indexes = await getIndexes();
  const hint = _.isEmpty(mongoQuery)
    ? [
        filters.ip && IP_INDEX,
        filters.hostname && HOSTNAME_INDEX,
        SPAM_INDEX
      ].find((index) => index && indexes.has(JSON.stringify(index)))
    : undefined;
  const withQuery = (match) =>
    _.isEmpty(mongoQuery) ? match : { $and: [match, mongoQuery] };

  return {
    filters,
    startDate,
    endDate,
    hint,
    withQuery,
    query: withQuery({
      ...base,
      created_at: { $gte: startDate, $lte: endDate }
    }),
    base
  };
}

// query string for the filter links (keeps the range and other filters)
function getSearch(ctx, changes) {
  const params = new URLSearchParams();
  for (const key of [
    'ip',
    'hostname',
    'start_date',
    'end_date',
    'mongodb_query'
  ]) {
    const value = key in changes ? changes[key] : ctx.query[key];
    if (isSANB(value)) params.set(key, value);
  }

  return params.toString();
}

async function list(ctx) {
  const { query, hint, startDate, endDate, filters } = await getFilters(ctx);

  // (no deep pagination past the capped count)
  const skip = Math.max(
    0,
    Math.min(ctx.paginate.skip, MAX_COUNT_LIMIT - ctx.query.limit)
  );

  // eslint-disable-next-line unicorn/no-array-callback-reference
  let findQuery = Logs.find(query)
    .select(
      `id created_at message err meta.level ${IP_FIELD} ${HOSTNAME_FIELD}`
    )
    .sort(getAllowedSort(ctx.query.sort, SORT_FIELDS, '-created_at'))
    .skip(skip)
    .limit(ctx.query.limit)
    .lean()
    .maxTimeMS(MAX_TIME_MS);
  if (hint) findQuery = findQuery.hint(hint);

  const [logs, total] = await Promise.all([
    findQuery.exec().catch((err) => {
      if (!isTimeout(err)) throw err;
      throw Boom.gatewayTimeout(
        'This search took too long, try a shorter date range or fewer filters'
      );
    }),
    // (a count that times out does not fail the page)
    Logs.aggregate(
      [{ $match: query }, { $limit: MAX_COUNT_LIMIT }, { $count: 'total' }],
      { maxTimeMS: MAX_TIME_MS, ...(hint ? { hint } : {}) }
    )
      .then((result) => result[0]?.total || 0)
      .catch((err) => {
        if (!isTimeout(err)) throw err;
        ctx.logger.warn(err);
        return null;
      })
  ]);

  // (without a count, there is a next page while this one is full)
  const itemCount =
    total === null
      ? skip + logs.length + (logs.length === ctx.query.limit ? 1 : 0)
      : total;

  const pageCount = Math.ceil(itemCount / ctx.query.limit);
  const path = ctx.state.l('/admin/spam');
  const data = {
    logs,
    pageCount,
    itemCount,
    // (a client's link keeps the range and the other filters)
    filterHref: (key, value) => `${path}?${getSearch(ctx, { [key]: value })}`,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  };

  if (ctx.accepts('html'))
    return ctx.render('admin/spam', {
      ...data,
      startDate: dayjs.utc(startDate).format('YYYY-MM-DD'),
      endDate: dayjs.utc(endDate).format('YYYY-MM-DD'),
      filterIP: filters.ip || '',
      filterHostname: filters.hostname || ''
    });

  ctx.body = { table: await ctx.render('admin/spam/_table', data) };
}

//
// A statistic that times out (or fails) is shown as unavailable instead of
// failing the others.
//
async function settle(ctx, promise) {
  try {
    return await promise;
  } catch (err) {
    ctx.logger.warn(err);
    return null;
  }
}

function count(match, hint) {
  return Logs.countDocuments(match, {
    maxTimeMS: MAX_TIME_MS,
    ...(hint ? { hint } : {})
  });
}

//
// Spam over time, hourly for ranges up to three days, otherwise daily, with
// a bucket (zero or not) for every hour or day of the range in UTC.
//
async function getTimeline(query, hint, startDate, endDate) {
  const unit = endDate - startDate <= ms('3d') ? 'hour' : 'day';
  const [format, mongoFormat] =
    unit === 'hour'
      ? ['YYYY-MM-DD HH:00', '%Y-%m-%d %H:00']
      : ['YYYY-MM-DD', '%Y-%m-%d'];

  const results = await Logs.aggregate(
    [
      { $match: query },
      {
        $group: {
          _id: { $dateToString: { format: mongoFormat, date: '$created_at' } },
          count: { $sum: 1 }
        }
      }
    ],
    { maxTimeMS: MAX_TIME_MS, ...(hint ? { hint } : {}) }
  );
  const counts = new Map(results.map((r) => [r._id, r.count]));

  const categories = [];
  const end = dayjs.utc(endDate);
  for (
    let date = dayjs.utc(startDate).startOf(unit);
    !date.isAfter(end);
    date = date.add(1, unit)
  ) {
    categories.push(date.format(format));
  }

  return {
    unit,
    categories,
    counts: categories.map((key) => counts.get(key) || 0)
  };
}

// top client IPs, hostnames and errors of the most recent spam logs
async function getTop(query, hint) {
  const top = (field) => [
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    { $limit: 10 }
  ];
  const [result] = await Logs.aggregate(
    [
      { $match: query },
      { $sort: { created_at: -1 } },
      { $limit: SAMPLE_SIZE },
      {
        $facet: {
          ips: top(IP_FIELD),
          hostnames: top(HOSTNAME_FIELD),
          errors: top('err.message')
        }
      }
    ],
    { maxTimeMS: MAX_TIME_MS, ...(hint ? { hint } : {}) }
  );
  return result;
}

async function stats(ctx) {
  const { query, base, withQuery, hint, startDate, endDate } = await getFilters(
    ctx
  );
  const now = Date.now();
  const since = (duration) =>
    withQuery({ ...base, created_at: { $gte: new Date(now - duration) } });

  const [lastHour, lastDay, timeline, top] = await Promise.all([
    settle(ctx, count(since(ms('1h')), hint)),
    settle(ctx, count(since(ms('1d')), hint)),
    settle(ctx, getTimeline(query, hint, startDate, endDate)),
    settle(ctx, getTop(query, hint))
  ]);

  // (the range's count is the sum of its timeline, not a second scan)
  const inRange = timeline && timeline.counts.reduce((a, b) => a + b, 0);

  const path = ctx.state.l('/admin/spam');
  const withLinks = (items, key) =>
    (items || []).map((item) => ({
      ...item,
      href: item._id ? `${path}?${getSearch(ctx, { [key]: item._id })}` : null
    }));

  ctx.body = {
    html: await ctx.render('admin/spam/_stats', {
      lastHour,
      lastDay,
      inRange,
      timeline,
      sampleSize: SAMPLE_SIZE,
      topIPs: top && withLinks(top.ips, 'ip'),
      topHostnames: top && withLinks(top.hostnames, 'hostname'),
      topErrors: top && top.errors
    })
  };
}

module.exports = {
  list,
  stats
};
