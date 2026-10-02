/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The paths analytics stored before they stored route patterns (domain
// names, alias names, IDs and tokens included) are replaced with the
// patterns of the routes they match, against the real web and API routers,
// in the events, the hourly totals and the landing page saved on accounts.
//

const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const test = require('ava');

const utils = require('../utils');

const AnalyticsEvents = require('#models/analytics-events');
const AnalyticsSummary = require('#models/analytics-summary');
const Users = require('#models/users');
const normalizeAnalyticsPaths = require('#helpers/normalize-analytics-paths');

test.before(utils.setupMongoose);
test.before((t) => {
  // (the routes can only be loaded once the connections exist)
  const routes = require('../../routes');
  t.context.routers = { web: routes.web, api: routes.api };
});
test.after.always(utils.teardownMongoose);

function summary(hour, dimension, value, metrics = {}) {
  return {
    _id: new mongoose.Types.ObjectId(),
    hour,
    dimension,
    value,
    value2: null,
    event_count: 0,
    unique_visitors: 0,
    successful_events: 0,
    failed_events: 0,
    landing_page_entries: 0,
    ...metrics,
    schema_version: AnalyticsSummary.CURRENT_SCHEMA_VERSION,
    aggregation_id: 'aggregation',
    is_complete: true
  };
}

test('stored paths become the routes they match, and the rest goes', async (t) => {
  const { routers } = t.context;
  const created_at = new Date();

  await AnalyticsEvents.collection.insertMany(
    [
      ['web', '/my-account/domains/example.com/aliases'],
      ['web', '/my-account/domains/example.com/aliases'],
      ['web', '/my-account/domains/example.org/aliases'],
      ['web', '/my-account/domains/:domain_id/aliases'],
      ['web', '/faq'],
      ['web', '/'],
      // static routes registered before a route with a parameter that
      // matches them too
      ['web', '/my-account/domains/new'],
      ['web', '/my-account/billing/upgrade'],
      ['api', '/v1/emails/limit'],
      ['web', '/reset-password/secret-reset-token'],
      ['web', '/no-such-page/example.net'],
      ['api', '/v1/domains/example.com/aliases/john'],
      // a route that only takes POST
      ['api', '/v1/domains/example.com/aliases/john/generate-password'],
      ['api', '/v1/no-such-endpoint/example.net']
    ].map(([service, pathname]) => ({
      event_type: service === 'api' ? 'api_call' : 'pageview',
      service,
      pathname,
      created_at
    }))
  );

  const users = [
    '/my-account/domains/example.com',
    '/my-account/domains/new',
    '/faq',
    '/ap/secret-password-link',
    '/no-such-page/example.net'
  ].map((signup_landing_page) => ({
    _id: new mongoose.Types.ObjectId(),
    email: `${new mongoose.Types.ObjectId()}@example.com`,
    signup_landing_page
  }));
  await Users.collection.insertMany(users);

  // hourly totals older than the events they were made from
  const hour = dayjs().startOf('hour').subtract(60, 'days').toDate();
  await AnalyticsSummary.collection.insertMany([
    summary(hour, 'hour', `v${AnalyticsSummary.CURRENT_SCHEMA_VERSION}`),
    summary(hour, 'pathname', '/my-account/domains/example.com/aliases', {
      event_count: 3,
      unique_visitors: 2,
      successful_events: 3,
      landing_page_entries: 1
    }),
    summary(hour, 'pathname', '/my-account/domains/example.org/aliases', {
      event_count: 2,
      unique_visitors: 1,
      successful_events: 1,
      failed_events: 1
    }),
    summary(hour, 'pathname', '/my-account/domains/:domain_id/aliases', {
      event_count: 5,
      unique_visitors: 4,
      successful_events: 5
    }),
    summary(hour, 'pathname', '/faq', { event_count: 7 }),
    summary(hour, 'pathname', '/my-account/domains/new', { event_count: 4 }),
    summary(hour, 'pathname', '/no-such-page/example.net', {
      event_count: 1
    }),
    summary(hour, 'signup_landing_page', '/ap/first-link', { event_count: 1 }),
    summary(hour, 'signup_landing_page', '/ap/second-link', {
      event_count: 2
    })
  ]);

  t.deepEqual(await normalizeAnalyticsPaths(routers), {
    events: { updated: 6, removed: 2 },
    users: { updated: 2, removed: 1 },
    summaries: { renamed: 1, merged: 3, removed: 1 }
  });

  const events = await AnalyticsEvents.find({})
    .select('service pathname')
    .lean()
    .exec();
  t.deepEqual(
    events.map(({ service, pathname }) => [service, pathname ?? null]).sort(),
    [
      ['api', '/v1/domains/:domain_id/aliases/:alias_id'],
      ['api', '/v1/domains/:domain_id/aliases/:alias_id/generate-password'],
      ['api', null],
      ['api', '/v1/emails/limit'],
      ['web', '/'],
      ['web', '/faq'],
      ['web', '/my-account/billing/upgrade'],
      ['web', '/my-account/domains/new'],
      ['web', '/my-account/domains/:domain_id/aliases'],
      ['web', '/my-account/domains/:domain_id/aliases'],
      ['web', '/my-account/domains/:domain_id/aliases'],
      ['web', '/my-account/domains/:domain_id/aliases'],
      ['web', '/reset-password/:token'],
      ['web', null]
    ].sort()
  );

  const pages = await Users.collection
    .find({ _id: { $in: users.map((user) => user._id) } })
    .toArray();
  t.deepEqual(pages.map((user) => user.signup_landing_page ?? null).sort(), [
    '/ap/:token',
    '/faq',
    '/my-account/domains/:domain_id',
    '/my-account/domains/new',
    null
  ]);

  const rows = await AnalyticsSummary.find({ hour }).lean().exec();
  t.deepEqual(
    rows
      .map((row) => [
        row.dimension,
        row.value,
        row.event_count,
        row.unique_visitors,
        row.successful_events,
        row.failed_events,
        row.landing_page_entries
      ])
      .sort(),
    [
      ['hour', `v${AnalyticsSummary.CURRENT_SCHEMA_VERSION}`, 0, 0, 0, 0, 0],
      ['pathname', '/faq', 7, 0, 0, 0, 0],
      ['pathname', '/my-account/domains/new', 4, 0, 0, 0, 0],
      ['pathname', '/my-account/domains/:domain_id/aliases', 10, 7, 9, 1, 1],
      ['signup_landing_page', '/ap/:token', 3, 0, 0, 0, 0]
    ].sort()
  );
  // (still part of the published hour)
  t.true(rows.every((row) => row.is_complete && row.aggregation_id));

  const stored = JSON.stringify([
    await AnalyticsEvents.find({}).lean().exec(),
    pages.map((user) => user.signup_landing_page),
    rows
  ]);
  t.deepEqual(
    ['example.com', 'example.org', 'example.net', 'john', 'secret'].filter(
      (value) => stored.includes(value)
    ),
    []
  );

  // running it again changes nothing
  t.deepEqual(await normalizeAnalyticsPaths(routers), {
    events: { updated: 0, removed: 0 },
    users: { updated: 0, removed: 0 },
    summaries: { renamed: 0, merged: 0, removed: 0 }
  });
});
