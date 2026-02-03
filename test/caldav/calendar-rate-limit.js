/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const {
  RESPONSE_COOLDOWN_MS,
  ATTENDEE_EVENT_LIMIT,
  IP_LIMIT,
  RATE_LIMIT_WINDOW_MS,
  checkRateLimit,
  recordResponse,
  isDuplicateResponse
} = require('#helpers/calendar-rate-limit');

// Test constants
test('RESPONSE_COOLDOWN_MS is 5 seconds', (t) => {
  t.is(RESPONSE_COOLDOWN_MS, 5000);
});

test('ATTENDEE_EVENT_LIMIT is 10', (t) => {
  t.is(ATTENDEE_EVENT_LIMIT, 10);
});

test('IP_LIMIT is 50', (t) => {
  t.is(IP_LIMIT, 50);
});

test('RATE_LIMIT_WINDOW_MS is 1 hour', (t) => {
  t.is(RATE_LIMIT_WINDOW_MS, 60 * 60 * 1000);
});

// Test checkRateLimit without Redis client
test('checkRateLimit returns not limited when no client', async (t) => {
  const result = await checkRateLimit(null, {
    eventUid: 'test-event',
    attendeeEmail: 'test@example.com',
    ip: '127.0.0.1'
  });

  t.deepEqual(result, { limited: false });
});

// Test recordResponse without Redis client (should not throw)
test('recordResponse does not throw when no client', async (t) => {
  await t.notThrowsAsync(async () => {
    await recordResponse(null, {
      eventUid: 'test-event',
      attendeeEmail: 'test@example.com',
      ip: '127.0.0.1',
      response: 'ACCEPTED'
    });
  });
});

// Test isDuplicateResponse without Redis client
test('isDuplicateResponse returns false when no client', async (t) => {
  const result = await isDuplicateResponse(null, {
    eventUid: 'test-event',
    attendeeEmail: 'test@example.com',
    response: 'ACCEPTED'
  });

  t.false(result);
});

// Mock Redis client tests
test('checkRateLimit with mock client - no rate limit hit', async (t) => {
  const mockClient = {
    get: async () => null,
    zcount: async () => 0
  };

  const result = await checkRateLimit(mockClient, {
    eventUid: 'test-event',
    attendeeEmail: 'test@example.com',
    ip: '127.0.0.1'
  });

  t.deepEqual(result, { limited: false });
});

test('checkRateLimit with mock client - cooldown hit', async (t) => {
  const now = Date.now();
  const mockClient = {
    get: async () => (now - 1000).toString(), // 1 second ago
    zcount: async () => 0
  };

  const result = await checkRateLimit(mockClient, {
    eventUid: 'test-event',
    attendeeEmail: 'test@example.com',
    ip: '127.0.0.1'
  });

  t.true(result.limited);
  t.is(result.reason, 'Please wait a few seconds before responding again');
  t.true(result.retryAfter > 0);
});

test('checkRateLimit with mock client - attendee event limit hit', async (t) => {
  const mockClient = {
    get: async () => null,
    async zcount(key) {
      if (key.includes('attendee:')) return ATTENDEE_EVENT_LIMIT;
      return 0;
    }
  };

  const result = await checkRateLimit(mockClient, {
    eventUid: 'test-event',
    attendeeEmail: 'test@example.com',
    ip: '127.0.0.1'
  });

  t.true(result.limited);
  t.is(
    result.reason,
    'Too many responses for this event. Please try again later.'
  );
});

test('checkRateLimit with mock client - IP limit hit', async (t) => {
  const mockClient = {
    get: async () => null,
    async zcount(key) {
      if (key.includes('ip:')) return IP_LIMIT;
      return 0;
    }
  };

  const result = await checkRateLimit(mockClient, {
    eventUid: 'test-event',
    attendeeEmail: 'test@example.com',
    ip: '127.0.0.1'
  });

  t.true(result.limited);
  t.is(
    result.reason,
    'Too many requests from your IP address. Please try again later.'
  );
});

test('isDuplicateResponse with mock client - duplicate', async (t) => {
  const mockClient = {
    get: async () => 'ACCEPTED'
  };

  const result = await isDuplicateResponse(mockClient, {
    eventUid: 'test-event',
    attendeeEmail: 'test@example.com',
    response: 'ACCEPTED'
  });

  t.true(result);
});

test('isDuplicateResponse with mock client - not duplicate', async (t) => {
  const mockClient = {
    get: async () => 'ACCEPTED'
  };

  const result = await isDuplicateResponse(mockClient, {
    eventUid: 'test-event',
    attendeeEmail: 'test@example.com',
    response: 'DECLINED'
  });

  t.false(result);
});
