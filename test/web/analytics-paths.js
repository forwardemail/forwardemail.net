/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Analytics store the pattern of the route a request matched
// (/my-account/domains/:domain_id/aliases), never the path itself: the
// domain names, IDs and tokens in a path reach neither the analytics events
// and their hourly totals nor the landing page saved on a new account.
//

const { randomUUID } = require('node:crypto');

const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const request = require('supertest');
const test = require('ava');

const utils = require('../utils');

const AnalyticsEvents = require('#models/analytics-events');
const AnalyticsSummary = require('#models/analytics-summary');
const aggregateAnalyticsHour = require('#helpers/aggregate-analytics-hour');
const config = require('#config');
const { Users } = require('#models');

// (analytics skip bots, and a test client looks like one)
const BROWSER =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  t.context.user = await createUser(t, t.context.password);
  await utils.setupWebServer(t);
  await utils.loginUser(t);
  await utils.setupApiServer(t);
});
test.afterEach.always(utils.teardownWebServer);
test.afterEach.always(utils.teardownApiServer);

async function createUser(t, password) {
  const tenDaysAgo = dayjs().startOf('day').subtract(10, 'days').toDate();
  let user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: tenDaysAgo,
      [config.userFields.hasVerifiedEmail]: true
    })
    .make();
  user = await Users.register(user, password);
  user[config.userFields.hasSetPassword] = true;
  user = await user.save();
  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: tenDaysAgo,
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: user.plan,
      kind: 'one-time'
    })
    .create();
  return user.save();
}

test.serial(
  'page views and API calls are counted by route, without the domain name in the path',
  async (t) => {
    const { web, api, user } = t.context;
    const domain = await t.context.domainFactory
      .withState({
        members: [{ user: user._id, group: 'admin' }],
        plan: user.plan,
        resolver: t.context.resolver,
        has_smtp: true,
        ignore_mx_check: true
      })
      .create();
    // (a domain without aliases sends the owner to create one)
    await t.context.aliasFactory
      .withState({
        user: user._id,
        domain: domain._id,
        recipients: [user.email]
      })
      .create();

    const page = await web
      .get(`/en/my-account/domains/${domain.name}/aliases`)
      .set('User-Agent', BROWSER)
      .set('Accept', 'text/html');
    t.is(page.status, 200);

    const call = await api
      .get(`/v1/domains/${domain.name}/aliases`)
      .set('User-Agent', BROWSER)
      .auth(user[config.userFields.apiToken]);
    t.is(call.status, 200);

    // the same page while signed out, which the sign-in check stops before
    // the page itself runs
    const visitor = request.agent(t.context._web.server);
    const signedOut = await visitor
      .get(`/en/my-account/domains/${domain.name}/aliases`)
      .set('User-Agent', BROWSER)
      .set('Accept', 'text/html');
    t.is(signedOut.status, 302);

    // (events are saved in the background)
    await pWaitFor(async () => (await AnalyticsEvents.countDocuments()) >= 3, {
      timeout: ms('15s')
    });

    const events = await AnalyticsEvents.find({}).lean().exec();
    t.deepEqual(
      events
        .map((event) => [
          event.service,
          event.pathname,
          event.user ? 'signed in' : 'signed out'
        ])
        .sort(),
      [
        ['api', '/v1/domains/:domain_id/aliases', 'signed in'],
        ['web', '/my-account/domains/:domain_id/aliases', 'signed in'],
        ['web', '/my-account/domains/:domain_id/aliases', 'signed out']
      ]
    );
    // the hourly totals
    const hours = new Set(
      events.map((event) => dayjs(event.created_at).startOf('hour').valueOf())
    );
    for (const hour of hours) {
      await aggregateAnalyticsHour(new Date(hour));
    }

    const pages = await AnalyticsSummary.find({ dimension: 'pathname' })
      .lean()
      .exec();
    t.true(
      pages.some(
        (row) => row.value === '/my-account/domains/:domain_id/aliases'
      )
    );

    const stored = JSON.stringify([
      await AnalyticsEvents.find({}).lean().exec(),
      await AnalyticsSummary.find({}).lean().exec()
    ]);
    t.false(stored.includes(domain.name));
  }
);

test.serial(
  'the landing page saved on a new account is the route, without the token in the path',
  async (t) => {
    const visitor = request.agent(t.context._web.server);
    const token = randomUUID();

    // a page that does not exist leaves the landing page to the next one,
    // but its referrer is the one kept
    const missing = await visitor
      .get(`/en/no-such-page-${token}`)
      .set('User-Agent', BROWSER)
      .set('Referer', 'https://news.ycombinator.com/item?id=1')
      .set('Accept', 'text/html');
    t.is(missing.status, 404);

    await visitor
      .get(`/en/reset-password/${token}`)
      .set('User-Agent', BROWSER)
      .set('Referer', `${t.context.webURL}/en`)
      .set('Accept', 'text/html');

    const { email } = await t.context.userFactory.make();
    const res = await visitor
      .post('/en/register')
      .set('User-Agent', BROWSER)
      .send({ email, password: falso.randPassword() });
    t.is(res.status, 302);

    const user = await Users.findOne({ email }).lean().exec();
    t.is(user.signup_landing_page, '/reset-password/:token');
    t.is(user.signup_referrer, 'news.ycombinator.com');
    t.false(JSON.stringify(user).includes(token));
  }
);
