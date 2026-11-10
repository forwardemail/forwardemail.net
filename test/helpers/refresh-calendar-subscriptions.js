//
// Copyright (c) Forward Email LLC
// SPDX-License-Identifier: BUSL-1.1
//

const ms = require('ms');
const test = require('ava');

// (the models the helper loads need their connections to exist; none is used)
// eslint-disable-next-line import/no-unassigned-import
require('../utils');

const {
  MAX_INTERVAL,
  MIN_INTERVAL,
  DEFAULT_INTERVAL,
  backoff,
  isDue,
  isSubscription,
  refreshInterval,
  subscriptionJson,
  withJitter
} = require('#helpers/refresh-calendar-subscriptions');

const SOURCE = 'https://calendar.example.com/private-5f2c9a/basic.ics';

test('only a read-only calendar with a source is a subscription', (t) => {
  t.true(isSubscription({ readonly: true, source: SOURCE }));
  t.false(isSubscription({ readonly: false, source: SOURCE }));
  t.false(isSubscription({ readonly: true }));
  t.false(isSubscription({ readonly: true, source: '  ' }));
  t.false(isSubscription(null));
});

test('the interval of a feed is held between a floor and a ceiling', (t) => {
  t.is(refreshInterval(undefined), DEFAULT_INTERVAL);
  t.is(refreshInterval(null), DEFAULT_INTERVAL);
  t.is(refreshInterval(0), DEFAULT_INTERVAL);
  t.is(refreshInterval(Number.NaN), DEFAULT_INTERVAL);
  t.is(refreshInterval(ms('1s')), MIN_INTERVAL);
  t.is(refreshInterval(ms('5m')), MIN_INTERVAL);
  t.is(MIN_INTERVAL, ms('15m'));
  t.is(refreshInterval(ms('4h')), ms('4h'));
  t.is(refreshInterval(ms('365d')), MAX_INTERVAL);
});

test('jitter is a tenth either way', (t) => {
  t.is(withJitter(ms('1h'), 0.5), ms('1h'));
  t.is(withJitter(ms('1h'), 0), ms('54m'));
  t.is(withJitter(ms('1h'), 1), ms('66m'));
  for (let i = 0; i < 100; i++) {
    const value = withJitter(ms('1h'));
    t.true(value >= ms('54m') && value <= ms('66m'));
  }
});

test('failures back off, doubling up to a day', (t) => {
  t.is(backoff(1), ms('15m'));
  t.is(backoff(2), ms('30m'));
  t.is(backoff(3), ms('1h'));
  t.is(backoff(7), ms('16h'));
  t.is(backoff(8), ms('1d'));
  t.is(backoff(50), ms('1d'));
});

test('a longer Retry-After is honoured, up to a day', (t) => {
  t.is(backoff(1, ms('2h')), ms('2h'));
  t.is(backoff(1, ms('1m')), ms('15m'));
  t.is(backoff(1, ms('30d')), ms('1d'));
  t.is(backoff(1, undefined), ms('15m'));
});

test('a subscription is due when it has no next refresh, or it has passed', (t) => {
  const now = Date.now();
  const calendar = { readonly: true, source: SOURCE };
  t.true(isDue(calendar, now));
  t.true(
    isDue({ ...calendar, subscription_next_refresh_at: new Date(now - 1) }, now)
  );
  t.false(
    isDue(
      { ...calendar, subscription_next_refresh_at: new Date(now + 1000) },
      now
    )
  );
  // (a paused one is not, until its owner takes it up again)
  t.false(isDue({ ...calendar, subscription_paused_at: new Date() }, now));
  t.false(isDue({ readonly: false, name: 'Calendar' }, now));
});

test('what an API response says of a subscription', (t) => {
  t.is(subscriptionJson({ readonly: false, name: 'Calendar' }), null);

  const refreshedAt = new Date();
  const active = subscriptionJson({
    readonly: true,
    source: SOURCE,
    ttl: ms('4h'),
    subscription_refreshed_at: refreshedAt
  });
  t.is(active.url, SOURCE);
  t.is(active.host, 'calendar.example.com');
  t.is(active.status, 'active');
  t.is(active.error, null);
  t.is(active.refresh_interval, 4 * 60 * 60);
  t.is(active.refreshed_at, refreshedAt);

  t.is(
    subscriptionJson({
      readonly: true,
      source: SOURCE,
      subscription_failures: 2,
      subscription_error: 'FEED_HTTP_STATUS_503'
    }).status,
    'failing'
  );

  const paused = subscriptionJson({
    readonly: true,
    source: SOURCE,
    subscription_failures: 8,
    subscription_error: 'FEED_TIMEOUT',
    subscription_paused_at: new Date(),
    subscription_next_refresh_at: new Date()
  });
  t.is(paused.status, 'paused');
  t.is(paused.error, 'FEED_TIMEOUT');
  t.is(paused.next_refresh_at, null);
});
