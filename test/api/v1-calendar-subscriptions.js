/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');
const { Buffer } = require('node:buffer');
const { Readable } = require('node:stream');

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const sinon = require('sinon');
const test = require('ava');
const undici = require('undici');

const utils = require('../utils');
const Calendars = require('#models/calendars');
const config = require('#config');
const subscriptions = require('#helpers/refresh-calendar-subscriptions');

//
// Calendars subscribed to a feed (`webcal://`), through the REST API.
//
// The host of a feed is an address literal that is public (so nothing is
// looked up) and `undici.request` is replaced, so nothing leaves the machine;
// what the address rules refuse is covered in
// test/helpers/fetch-calendar-feed.js.
//
const FEED_URL = 'https://93.184.216.34/private-5f2c9a/basic.ics';
const SECRET = 'private-5f2c9a';

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);
test.afterEach.always(utils.teardownApiServer);
test.afterEach.always(() => {
  sinon.restore();
  subscriptions.limits.manualRefreshInterval = ms('1m');
  subscriptions.limits.minInterval = ms('15m');
});

function fixture(name) {
  return fs.readFileSync(
    path.join(__dirname, '..', 'fixtures', 'calendar-feeds', `${name}.ics`),
    'utf8'
  );
}

function event(uid, summary, extra = []) {
  return [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dayjs().utc().format('YYYYMMDDTHHmmss')}Z`,
    'DTSTART:20261201T100000Z',
    'DTEND:20261201T110000Z',
    `SUMMARY:${summary}`,
    ...extra,
    'END:VEVENT'
  ];
}

function calendar(events, properties = ['X-WR-CALNAME:Feed']) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Example//Feed//EN',
    ...properties,
    ...events.flat(),
    'END:VCALENDAR',
    ''
  ].join('\r\n');
}

// Answer feed requests with `responses` in turn (the last one from then on).
function serve(...responses) {
  let index = 0;
  return sinon.stub(undici, 'request').callsFake(async () => {
    const response = responses[Math.min(index++, responses.length - 1)];
    const {
      statusCode = 200,
      headers = {},
      body = ''
    } = typeof response === 'string' ? { body: response } : response;
    return { statusCode, headers, body: Readable.from([Buffer.from(body)]) };
  });
}

async function createTestAlias(t) {
  let user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();

  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: user.plan,
      kind: 'one-time'
    })
    .create();

  user = await user.save();

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver: t.context.resolver,
      has_smtp: true,
      ignore_mx_check: true
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true
    })
    .create();

  const pass = await alias.createToken();
  await alias.save();

  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    t.context.resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );
  await t.context.resolver.options.cache.mset(map);

  const username = `${alias.name}@${domain.name}`;
  t.context.aliasId = alias.id;
  return `Basic ${Buffer.from(`${username}:${pass}`).toString('base64')}`;
}

async function listEvents(t, auth, calendarId) {
  const res = await t.context.api
    .get('/v1/calendar-events')
    .query({ calendar_id: calendarId, limit: 500 })
    .set('Authorization', auth);
  t.is(res.status, 200);
  return res.body;
}

async function subscribe(t, auth, body = {}) {
  return t.context.api
    .post('/v1/calendars')
    .set('Authorization', auth)
    .send({ subscription_url: FEED_URL, ...body });
}

async function refresh(t, auth, id) {
  const res = await t.context.api
    .put(`/v1/calendars/${id}`)
    .set('Authorization', auth)
    .send({ subscription_refresh: true });
  t.is(res.status, 200);
  return res.body;
}

//
// How often the sync token of a calendar (its CalDAV ctag) was moved on.
//
function watchSyncToken() {
  const spy = sinon.spy(Calendars, 'findByIdAndUpdate');
  return () =>
    spy.getCalls().filter((call) => call.args[3]?.$set?.synctoken).length;
}

test.serial('previews a feed without saving anything', async (t) => {
  const auth = await createTestAlias(t);
  const request = serve(fixture('apple'));

  const res = await t.context.api
    .post('/v1/calendars/subscription-preview')
    .set('Authorization', auth)
    .send({ subscription_url: 'webcal://93.184.216.34/club.ics' });

  t.is(res.status, 200);
  t.is(res.body.name, 'Club rides');
  t.is(res.body.host, '93.184.216.34');
  t.is(res.body.color, '#34AADC');
  t.is(res.body.insecure, false);
  t.is(res.body.refresh_interval, 4 * 60 * 60);
  t.is(res.body.event_count, 2);
  t.is(res.body.skipped_count, 0);
  t.is(res.body.object, 'calendar_subscription_preview');
  // (`webcal://` is fetched over `https://`)
  t.is(request.args[0][0], 'https://93.184.216.34/club.ics');

  const list = await t.context.api
    .get('/v1/calendars')
    .set('Authorization', auth);
  t.is(list.status, 200);
  t.false(list.body.some((c) => c.subscription));
});

test.serial('refuses addresses a feed may not have', async (t) => {
  const auth = await createTestAlias(t);
  const request = serve(calendar([]));

  for (const [url, message] of [
    ['https://127.0.0.1/a.ics', 'public address'],
    ['https://169.254.169.254/latest/meta-data/', 'public address'],
    ['https://[::1]/a.ics', 'public address'],
    ['http://93.184.216.34/a.ics', 'not encrypted'],
    ['https://user:pass@93.184.216.34/a.ics', 'invalid'],
    ['file:///etc/passwd', 'invalid'],
    ['nonsense', 'invalid']
  ]) {
    for (const route of [
      '/v1/calendars',
      '/v1/calendars/subscription-preview'
    ]) {
      const res = await t.context.api
        .post(route)
        .set('Authorization', auth)
        .send({ subscription_url: url });
      t.is(res.status, 400, `${route} ${url}`);
      t.true(res.body.message.includes(message), `${res.body.message}`);
    }
  }

  t.true(request.notCalled);

  // (`http://` once it is asked for by name)
  const res = await t.context.api
    .post('/v1/calendars/subscription-preview')
    .set('Authorization', auth)
    .send({
      subscription_url: 'http://93.184.216.34/a.ics',
      subscription_allow_http: true
    });
  t.is(res.status, 200);
  t.is(res.body.insecure, true);
});

test.serial('a feed that cannot be read creates no calendar', async (t) => {
  const auth = await createTestAlias(t);

  for (const response of [
    { statusCode: 404 },
    { statusCode: 500 },
    '<!doctype html><html>Sign in</html>',
    calendar([['BEGIN:VEVENT', 'UID:x', 'DTSTART:never', 'END:VEVENT']])
  ]) {
    sinon.restore();
    serve(response);

    const res = await subscribe(t, auth, { name: 'Never made' });
    t.is(res.status, 400);
    // (an error never repeats the address, which may hold a secret)
    t.false(JSON.stringify(res.body).includes(SECRET));
  }

  const list = await t.context.api
    .get('/v1/calendars')
    .set('Authorization', auth);
  t.false(list.body.some((c) => c.name === 'Never made'));
});

test.serial(
  'subscribes to a feed: a read-only calendar with its events',
  async (t) => {
    const auth = await createTestAlias(t);
    serve({
      headers: { etag: '"v1"' },
      body: fixture('google')
    });

    const res = await subscribe(t, auth);
    t.is(res.status, 200);
    // (named after the feed)
    t.is(res.body.name, 'Family');
    t.is(res.body.readonly, true);
    t.is(res.body.subscription.url, FEED_URL);
    t.is(res.body.subscription.host, '93.184.216.34');
    t.is(res.body.subscription.status, 'active');
    t.is(res.body.subscription.error, null);
    t.truthy(res.body.subscription.refreshed_at);
    t.truthy(res.body.subscription.next_refresh_at);

    const events = await listEvents(t, auth, res.body.id);
    t.is(events.length, 3);
    const summaries = events.map((e) => e.ical).join('\n');
    t.true(summaries.includes('SUMMARY:Soccer practice'));
    t.true(summaries.includes('SUMMARY:Soccer practice (moved to Tuesday)'));
    t.true(summaries.includes('SUMMARY:Dentist'));

    // (a calendar that is not subscribed says so too)
    const plain = await t.context.api
      .post('/v1/calendars')
      .set('Authorization', auth)
      .send({ name: 'Plain' });
    t.is(plain.body.readonly, false);
    t.is(plain.body.subscription, null);
  }
);

test.serial('a subscribed calendar cannot be written to', async (t) => {
  const auth = await createTestAlias(t);
  serve(calendar([event('a', 'One'), event('b', 'Two')]));
  const { body: subscribed } = await subscribe(t, auth);
  const { body: plain } = await t.context.api
    .post('/v1/calendars')
    .set('Authorization', auth)
    .send({ name: 'Plain' });
  const ical = calendar([event('mine', 'Mine')], []);

  // create
  let res = await t.context.api
    .post('/v1/calendar-events')
    .set('Authorization', auth)
    .send({ calendar_id: subscribed.id, ical });
  t.is(res.status, 403);
  t.true(res.body.message.includes('read-only'));

  // update
  res = await t.context.api
    .put('/v1/calendar-events/a')
    .set('Authorization', auth)
    .send({ ical: calendar([event('a', 'Changed')], []) });
  t.is(res.status, 403);

  // move out of it
  res = await t.context.api
    .put('/v1/calendar-events/a')
    .set('Authorization', auth)
    .send({ calendar_id: plain.id });
  t.is(res.status, 403);

  // delete
  res = await t.context.api
    .delete('/v1/calendar-events/a')
    .set('Authorization', auth);
  t.is(res.status, 403);

  // move into it
  res = await t.context.api
    .post('/v1/calendar-events')
    .set('Authorization', auth)
    .send({ calendar_id: plain.id, event_id: 'mine', ical });
  t.is(res.status, 200);
  res = await t.context.api
    .put('/v1/calendar-events/mine')
    .set('Authorization', auth)
    .send({ calendar_id: subscribed.id });
  t.is(res.status, 403);

  const events = await listEvents(t, auth, subscribed.id);
  t.deepEqual(events.map((e) => e.id).sort(), ['a', 'b']);
  t.true(events.find((e) => e.id === 'a').ical.includes('SUMMARY:One'));

  // (it can still be renamed, recoloured and removed)
  res = await t.context.api
    .put(`/v1/calendars/${subscribed.id}`)
    .set('Authorization', auth)
    .send({ name: 'Renamed', color: '#112233' });
  t.is(res.status, 200);
  t.is(res.body.name, 'Renamed');
  t.is(res.body.readonly, true);
  t.is(res.body.subscription.url, FEED_URL);

  res = await t.context.api
    .delete(`/v1/calendars/${subscribed.id}`)
    .set('Authorization', auth);
  t.is(res.status, 200);
});

test.serial('a refresh of an unchanged feed changes nothing', async (t) => {
  subscriptions.limits.manualRefreshInterval = 0;
  const auth = await createTestAlias(t);
  const events = [event('a', 'One'), event('b', 'Two')];
  const request = serve(
    {
      headers: {
        etag: '"v1"',
        'last-modified': 'Mon, 09 Nov 2026 10:00:00 GMT'
      },
      body: calendar(events)
    },
    // (the host says so)
    { statusCode: 304 },
    // (the host sends it all again, with the DTSTAMPs of that moment)
    {
      headers: { etag: '"v2"' },
      body: calendar(events).replace(
        /DTSTAMP:\d+T\d+Z/g,
        'DTSTAMP:20300101T000000Z'
      )
    }
  );

  const { body: subscribed } = await subscribe(t, auth);
  const before = await listEvents(t, auth, subscribed.id);
  t.is(before.length, 2);
  const bumps = watchSyncToken();

  const first = await refresh(t, auth, subscribed.id);
  t.is(first.subscription.status, 'active');
  // (the validators of the copy held were sent)
  t.is(request.args[1][1].headers['if-none-match'], '"v1"');
  t.is(
    request.args[1][1].headers['if-modified-since'],
    'Mon, 09 Nov 2026 10:00:00 GMT'
  );

  await refresh(t, auth, subscribed.id);
  t.is(request.callCount, 3);
  t.is(request.args[2][1].headers['if-none-match'], '"v1"');

  // every event is as it was (its ETag is made from `updated_at`)
  const after = await listEvents(t, auth, subscribed.id);
  t.deepEqual(
    after.map((e) => [e.id, e.updated_at, e.ical]).sort(),
    before.map((e) => [e.id, e.updated_at, e.ical]).sort()
  );
  // and CalDAV clients are not told to sync again
  t.is(bumps(), 0);
});

test.serial('a refresh applies what changed, and only that', async (t) => {
  subscriptions.limits.manualRefreshInterval = 0;
  const auth = await createTestAlias(t);
  serve(
    calendar([event('a', 'One'), event('b', 'Two'), event('c', 'Three')]),
    calendar([event('a', 'One'), event('b', 'Two, moved'), event('d', 'Four')]),
    // (an event that went away and came back)
    calendar([
      event('a', 'One'),
      event('b', 'Two, moved'),
      event('c', 'Three'),
      event('d', 'Four')
    ])
  );

  const { body: subscribed } = await subscribe(t, auth);
  const before = await listEvents(t, auth, subscribed.id);
  t.deepEqual(before.map((e) => e.id).sort(), ['a', 'b', 'c']);

  await new Promise((resolve) => {
    setTimeout(resolve, 1100);
  });
  const bumps = watchSyncToken();
  await refresh(t, auth, subscribed.id);
  t.is(bumps(), 1);
  const after = await listEvents(t, auth, subscribed.id);
  t.deepEqual(after.map((e) => e.id).sort(), ['a', 'b', 'd']);
  const find = (list, id) => list.find((e) => e.id === id);
  t.is(find(after, 'a').updated_at, find(before, 'a').updated_at);
  t.not(find(after, 'b').updated_at, find(before, 'b').updated_at);
  t.true(find(after, 'b').ical.includes('SUMMARY:Two\\, moved'));

  await refresh(t, auth, subscribed.id);
  const last = await listEvents(t, auth, subscribed.id);
  t.deepEqual(last.map((e) => e.id).sort(), ['a', 'b', 'c', 'd']);
  t.is(find(last, 'a').updated_at, find(before, 'a').updated_at);
});

test.serial(
  'a failing feed backs off, is paused, and is taken up again',
  async (t) => {
    subscriptions.limits.manualRefreshInterval = 0;
    const auth = await createTestAlias(t);
    const good = calendar([event('a', 'One')]);
    serve(good, { statusCode: 503, headers: { 'retry-after': '7200' } });

    const { body: subscribed } = await subscribe(t, auth);

    let body = await refresh(t, auth, subscribed.id);
    t.is(body.subscription.status, 'failing');
    t.is(body.subscription.error, 'FEED_HTTP_STATUS_503');
    // (not before the host asked, here two hours)
    t.true(
      new Date(body.subscription.next_refresh_at).getTime() - Date.now() >
        ms('1h')
    );
    // (the events it had are kept)
    const events1 = await listEvents(t, auth, subscribed.id);
    t.is(events1.length, 1);

    for (let i = 0; i < subscriptions.MAX_FAILURES - 1; i++) {
      body = await refresh(t, auth, subscribed.id);
    }

    // (a manual refresh takes a paused one up again, so this one failed anew)
    t.is(body.subscription.status, 'failing');

    // gone for good: paused at once
    sinon.restore();
    serve({ statusCode: 410 });
    body = await refresh(t, auth, subscribed.id);
    t.is(body.subscription.status, 'paused');
    t.is(body.subscription.error, 'FEED_HTTP_STATUS_410');
    t.is(body.subscription.next_refresh_at, null);
    t.false(JSON.stringify(body.subscription.error).includes(SECRET));

    // the feed is back
    sinon.restore();
    serve(calendar([event('a', 'One'), event('b', 'Two')]));
    body = await refresh(t, auth, subscribed.id);
    t.is(body.subscription.status, 'active');
    t.is(body.subscription.error, null);
    const events2 = await listEvents(t, auth, subscribed.id);
    t.is(events2.length, 2);
  }
);

test.serial(
  'a feed is refreshed in the background once it is due',
  async (t) => {
    const auth = await createTestAlias(t);
    const checked = `${subscriptions.CHECKED_PREFIX}${t.context.aliasId}`;
    // (a feed that asks to be refreshed every second, and is allowed to here)
    subscriptions.limits.minInterval = 0;
    const ttl = ['X-WR-CALNAME:Feed', 'X-PUBLISHED-TTL:PT1S'];
    const request = serve(
      calendar([event('a', 'One')], ttl),
      calendar([event('a', 'One'), event('b', 'Two')], ttl)
    );
    const { body: subscribed } = await subscribe(t, auth);
    t.is(request.callCount, 1);
    t.is(subscribed.subscription.refresh_interval, 1);

    // (the floor is back, so the refresh after the next is not for a while)
    subscriptions.limits.minInterval = ms('15m');

    // due: looking at calendars fetches it, without the request waiting
    await new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
    await t.context.client.del(checked);
    await listEvents(t, auth, subscribed.id);
    await Promise.all(subscriptions.inflight.values());
    t.is(request.callCount, 2);
    const events = await listEvents(t, auth, subscribed.id);
    t.is(events.length, 2);

    // not due: nothing is fetched
    await t.context.client.del(checked);
    await listEvents(t, auth, subscribed.id);
    await Promise.all(subscriptions.inflight.values());
    t.is(request.callCount, 2);
  }
);

test.serial(
  'a manual refresh is not sent to the host more than once a minute',
  async (t) => {
    const auth = await createTestAlias(t);
    const request = serve(calendar([event('a', 'One')]));
    const { body: subscribed } = await subscribe(t, auth);
    await refresh(t, auth, subscribed.id);
    await refresh(t, auth, subscribed.id);
    t.is(request.callCount, 1);
  }
);

test.serial(
  'subscription_refresh is refused for a calendar that is not subscribed',
  async (t) => {
    const auth = await createTestAlias(t);
    const { body: plain } = await t.context.api
      .post('/v1/calendars')
      .set('Authorization', auth)
      .send({ name: 'Plain' });
    const res = await t.context.api
      .put(`/v1/calendars/${plain.id}`)
      .set('Authorization', auth)
      .send({ subscription_refresh: true });
    t.is(res.status, 400);
  }
);
