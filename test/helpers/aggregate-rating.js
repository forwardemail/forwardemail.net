/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');

const test = require('ava');
const Redis = require('ioredis-mock');
const ms = require('ms');
const { MockAgent } = require('undici');

const config = require('#config');
const {
  AGGREGATE_RATING_KEY,
  parseTrustboxData,
  readAggregateRating,
  updateAggregateRating
} = require('#helpers/aggregate-rating');

// the shape of Trustpilot's TrustBox data, with made-up counts
function trustbox(counts) {
  return {
    businessUnit: {
      displayName: 'Example',
      numberOfReviews: {
        total: Object.values(counts).reduce((a, b) => a + b, 0),
        ...counts
      }
    },
    links: { profileUrl: 'https://www.trustpilot.com/review/example.com' }
  };
}

const COUNTS = {
  oneStar: 1,
  twoStars: 0,
  threeStars: 1,
  fourStars: 2,
  fiveStars: 6
};

function mockTrustpilot(t, replies) {
  const agent = new MockAgent();
  agent.disableNetConnect();
  const pool = agent.get('https://widget.trustpilot.com');
  const calls = [];
  for (const reply of replies) {
    pool
      .intercept({
        path: (path) =>
          path.startsWith(`/trustbox-data/${config.trustpilot.templateId}?`),
        method: 'GET'
      })
      .reply((options) => {
        calls.push(options.path);
        return {
          statusCode: 200,
          data: reply,
          responseOptions: {
            headers: { 'content-type': 'application/json' }
          }
        };
      });
  }

  t.teardown(() => agent.close());
  return { agent, calls };
}

test('the average comes from the count of reviews for each star', (t) => {
  t.deepEqual(parseTrustboxData(trustbox(COUNTS)), {
    // (1 + 3 + 8 + 30) / 10
    ratingValue: 4.2,
    ratingCount: 10,
    bestRating: 5,
    worstRating: 1,
    url: 'https://www.trustpilot.com/review/example.com'
  });

  // rounded to one decimal, as Trustpilot shows it
  t.is(
    parseTrustboxData(
      trustbox({
        oneStar: 21,
        twoStars: 3,
        threeStars: 0,
        fourStars: 10,
        fiveStars: 156
      })
    ).ratingValue,
    4.5
  );

  // no counts, no reviews or counts that are not whole numbers: no rating
  t.is(parseTrustboxData({ Error: ['no access'] }), null);
  t.is(
    parseTrustboxData(
      trustbox({
        oneStar: 0,
        twoStars: 0,
        threeStars: 0,
        fourStars: 0,
        fiveStars: 0
      })
    ),
    null
  );
  t.is(parseTrustboxData(trustbox({ ...COUNTS, fiveStars: '6' })), null);

  // a profile link elsewhere is not used
  const data = trustbox(COUNTS);
  data.links.profileUrl = 'https://example.com/';
  t.is(parseTrustboxData(data).url, config.trustpilot.profileUrl);
});

test('the rating is asked for once a month and kept in Redis', async (t) => {
  // (each test its own keys: ioredis-mock instances share their data)
  const client = new Redis({ keyPrefix: randomUUID() });
  const { agent, calls } = mockTrustpilot(t, [
    trustbox(COUNTS),
    trustbox({ ...COUNTS, fiveStars: 16 })
  ]);
  const now = Date.now();

  t.is(await readAggregateRating(client), null);
  const first = await updateAggregateRating(client, { now, dispatcher: agent });
  t.is(first.ratingValue, 4.2);
  t.is(first.ratingCount, 10);
  t.is(calls.length, 1);
  t.deepEqual(await readAggregateRating(client), first);
  // it expires on its own if no later check replaces it
  t.true((await client.pttl(AGGREGATE_RATING_KEY)) > ms('60d'));

  // within the month: the stored rating, without asking
  const again = await updateAggregateRating(client, {
    now: now + ms('29d'),
    dispatcher: agent
  });
  t.deepEqual(again, first);
  t.is(calls.length, 1);

  // a month later: asked again
  const later = await updateAggregateRating(client, {
    now: now + ms('31d'),
    dispatcher: agent
  });
  t.is(calls.length, 2);
  t.is(later.ratingCount, 20);
  // (1 + 3 + 8 + 80) / 20
  t.is(later.ratingValue, 4.6);
  t.deepEqual(await readAggregateRating(client), later);
});

test('an answer without counts keeps the stored rating', async (t) => {
  // (each test its own keys: ioredis-mock instances share their data)
  const client = new Redis({ keyPrefix: randomUUID() });
  const now = Date.now();
  const { agent } = mockTrustpilot(t, [
    trustbox(COUNTS),
    { Error: ['BusinessUnit does not have access to that trustbox'] }
  ]);
  const first = await updateAggregateRating(client, { now, dispatcher: agent });
  const kept = await updateAggregateRating(client, {
    force: true,
    now: now + ms('1d'),
    dispatcher: agent
  });
  t.deepEqual(kept, first);
  t.deepEqual(await readAggregateRating(client), first);
});

test('only a plain Trustpilot address reaches the page', async (t) => {
  const data = trustbox(COUNTS);
  data.links.profileUrl =
    'https://www.trustpilot.com/review/example.com" onmouseover="alert(1)';
  t.is(parseTrustboxData(data).url, config.trustpilot.profileUrl);

  // (a stored value too)
  const client = new Redis({ keyPrefix: randomUUID() });
  await client.set(
    AGGREGATE_RATING_KEY,
    JSON.stringify({
      ratingValue: 4.2,
      ratingCount: 10,
      url: 'https://www.trustpilot.com/review/example.com"><script>'
    })
  );
  const stored = await readAggregateRating(client);
  t.is(stored.url, config.trustpilot.profileUrl);
});
