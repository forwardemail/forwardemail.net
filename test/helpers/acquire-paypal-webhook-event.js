/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const acquirePayPalWebhookEvent = require('#helpers/acquire-paypal-webhook-event');

const { getPayPalWebhookEventKey, PAYPAL_WEBHOOK_EVENT_TTL } =
  acquirePayPalWebhookEvent;

test('reserves a verified PayPal event with Redis NX and a seven-day TTL', async (t) => {
  const calls = [];
  const client = {
    async set(...args) {
      calls.push(args);
      return 'OK';
    }
  };

  t.true(await acquirePayPalWebhookEvent(client, 'WH-verified-event'));
  t.deepEqual(calls, [
    [
      getPayPalWebhookEventKey('WH-verified-event'),
      '1',
      'PX',
      PAYPAL_WEBHOOK_EVENT_TTL,
      'NX'
    ]
  ]);
});

test('rejects replayed PayPal webhook events when the reservation exists', async (t) => {
  const client = {
    async set() {
      return null;
    }
  };

  t.false(await acquirePayPalWebhookEvent(client, 'WH-replayed-event'));
});

test('hashes PayPal event IDs before including them in Redis keys', (t) => {
  const key = getPayPalWebhookEventKey('WH-sensitive-event-id');

  t.regex(key, /^paypal_webhook_event:[a-f\d]{64}$/);
  t.false(key.includes('WH-sensitive-event-id'));
  t.is(key, getPayPalWebhookEventKey('WH-sensitive-event-id'));
  t.not(key, getPayPalWebhookEventKey('WH-different-event-id'));
});

test('rejects missing event IDs and Redis clients', async (t) => {
  t.throws(() => getPayPalWebhookEventKey(''), {
    instanceOf: TypeError,
    message: 'PayPal webhook event ID missing'
  });
  await t.throwsAsync(acquirePayPalWebhookEvent(null, 'WH-event'), {
    instanceOf: TypeError,
    message: 'Redis client missing for PayPal webhook deduplication'
  });
});

test('propagates Redis failures instead of processing without replay protection', async (t) => {
  const error = new Error('Valkey unavailable');
  const client = {
    async set() {
      throw error;
    }
  };

  await t.throwsAsync(acquirePayPalWebhookEvent(client, 'WH-event'), {
    is: error
  });
});
