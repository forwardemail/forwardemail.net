/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const AnalyticsEvents = require('#models/analytics-events');
const AnalyticsSummary = require('#models/analytics-summary');
const Users = require('#models/users');
const i18n = require('#helpers/i18n');
const { findRoute, toRoutePath } = require('#helpers/get-route-path');

const BATCH_SIZE = 500;
const SUMMARY_DIMENSIONS = ['pathname', 'signup_landing_page'];
const SUMMARY_METRICS = [
  'event_count',
  'unique_visitors',
  'successful_events',
  'failed_events',
  'landing_page_entries'
];

//
// Analytics used to store request paths as they were, with the domain names,
// alias names, IDs and tokens in them (they store route patterns since, see
// helpers/get-route-path.js). This replaces the paths stored before with the
// patterns of the routes they match, in the analytics events, the hourly
// totals and the landing page saved on accounts, and removes the paths that
// match no route. Running it again changes nothing.
//
// `routers` are the web and API routers of routes/index.js.
//

// the route a path matches (a stored path does not say which method it was
// requested with, so the one requests take first, see findRoute)
function createMatcher(router) {
  return function (path) {
    if (typeof path !== 'string' || !path.startsWith('/')) return;
    return findRoute(router.match(path, 'GET').path);
  };
}

function createMatchers(routers) {
  const web = createMatcher(routers.web);
  const api = createMatcher(routers.api);
  const locale = i18n.config.defaultLocale;
  return {
    api: (path) => toRoutePath(api(path)),
    // web paths were stored without their locale prefix; the few routes
    // outside the localized ones are matched as they are (where the first
    // segment of a path would otherwise pass for a locale)
    web(path) {
      if (typeof path !== 'string') return;
      const localized = web(`/${locale}${path === '/' ? '' : path}`);
      if (localized) return toRoutePath(localized);
      const route = web(path);
      if (route && !/^\/:locale(?=\/|$)/.test(route)) return toRoutePath(route);
    }
  };
}

async function normalizeEvents(match) {
  const counts = { updated: 0, removed: 0 };
  const cursor = AnalyticsEvents.aggregate([
    { $match: { pathname: { $type: 'string' } } },
    { $group: { _id: { service: '$service', pathname: '$pathname' } } }
  ])
    .allowDiskUse(true)
    .cursor({ batchSize: BATCH_SIZE });

  for await (const { _id } of cursor) {
    const { service, pathname } = _id;
    const routePath =
      service === 'api' ? match.api(pathname) : match.web(pathname);
    if (routePath === pathname) continue;
    const result = await AnalyticsEvents.updateMany(
      { service, pathname },
      routePath
        ? { $set: { pathname: routePath } }
        : { $unset: { pathname: 1 } }
    );
    counts[routePath ? 'updated' : 'removed'] += result.modifiedCount;
  }

  return counts;
}

async function normalizeUsers(match) {
  const counts = { updated: 0, removed: 0 };
  const operations = [];
  async function flush() {
    if (operations.length === 0) return;
    await Users.collection.bulkWrite(operations, { ordered: false });
    operations.length = 0;
  }

  for await (const user of Users.find({
    signup_landing_page: { $type: 'string' }
  })
    .select('signup_landing_page')
    .lean()
    .cursor({ batchSize: BATCH_SIZE })) {
    const routePath = match.web(user.signup_landing_page);
    if (routePath === user.signup_landing_page) continue;
    operations.push({
      updateOne: {
        filter: { _id: user._id },
        update: routePath
          ? { $set: { signup_landing_page: routePath } }
          : { $unset: { signup_landing_page: 1 } }
      }
    });
    counts[routePath ? 'updated' : 'removed']++;
    if (operations.length >= BATCH_SIZE) await flush();
  }

  await flush();
  return counts;
}

//
// The rows of one hour whose paths match the same route become one row with
// their metrics added up (so unique visitors can count a visitor more than
// once, as they do across hours), and the rows of paths that match no route
// are deleted.
//
async function normalizeSummaryHour(rows, match, counts) {
  const groups = new Map();
  const deletes = [];
  for (const row of rows) {
    const routePath = match.web(row.value);
    if (!routePath) {
      deletes.push(row._id);
      counts.removed++;
      continue;
    }

    const key = JSON.stringify([row.dimension, row.value2 || null, routePath]);
    if (!groups.has(key)) groups.set(key, { routePath, rows: [] });
    groups.get(key).rows.push(row);
  }

  const updates = [];
  for (const { routePath, rows: grouped } of groups.values()) {
    if (grouped.length === 1 && grouped[0].value === routePath) continue;

    // the row already named after the route keeps its name, so no two rows
    // ever share one (they are unique per hour, dimension and value)
    const target = grouped.find((row) => row.value === routePath) || grouped[0];
    const metrics = {};
    for (const metric of SUMMARY_METRICS) {
      metrics[metric] = grouped.reduce(
        (sum, row) => sum + (row[metric] || 0),
        0
      );
    }

    for (const row of grouped) {
      if (row === target) continue;
      deletes.push(row._id);
      counts.merged++;
    }

    if (target.value !== routePath) counts.renamed++;
    updates.push({
      updateOne: {
        filter: { _id: target._id },
        update: { $set: { value: routePath, ...metrics } }
      }
    });
  }

  if (deletes.length > 0)
    await AnalyticsSummary.deleteMany({ _id: { $in: deletes } });
  if (updates.length > 0)
    await AnalyticsSummary.bulkWrite(updates, { ordered: true });
}

async function normalizeSummaries(match) {
  const counts = { renamed: 0, merged: 0, removed: 0 };
  let hour;
  let rows = [];

  for await (const row of AnalyticsSummary.find({
    dimension: { $in: SUMMARY_DIMENSIONS }
  })
    .sort({ hour: 1 })
    .lean()
    .cursor({ batchSize: BATCH_SIZE })) {
    if (hour !== undefined && row.hour.getTime() !== hour) {
      await normalizeSummaryHour(rows, match, counts);
      rows = [];
    }

    hour = row.hour.getTime();
    rows.push(row);
  }

  if (rows.length > 0) await normalizeSummaryHour(rows, match, counts);
  return counts;
}

async function normalizeAnalyticsPaths(routers) {
  const match = createMatchers(routers);
  return {
    events: await normalizeEvents(match),
    users: await normalizeUsers(match),
    summaries: await normalizeSummaries(match)
  };
}

module.exports = normalizeAnalyticsPaths;
