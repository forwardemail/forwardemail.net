/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The PayPal webhook endpoint: an event is processed once its signature is
// verified and it has been reserved (so a replay of the same event, which
// PayPal retries and attackers replay, is acknowledged but never processed
// again), and an event whose signature does not verify is neither reserved
// nor processed.
//

const { randomUUID } = require('node:crypto');

const Boom = require('@hapi/boom');
const Redis = require('ioredis-mock');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');

const webhook = require('#controllers/api/v1/paypal');
const {
  getPayPalWebhookEventKey
} = require('#helpers/acquire-paypal-webhook-event');
const { paypal } = require('#helpers/paypal');

test.before(utils.setupMongoose);
// PayPal's signature verification, answered locally
test.before(() => {
  paypal.notification.webhookEvent.verify = (headers, body, webhookId, fn) => {
    fn(null, {
      verification_status:
        headers['paypal-transmission-sig'] === 'valid' ? 'SUCCESS' : 'FAILURE'
    });
  };
});
test.after.always(utils.teardownMongoose);

test.beforeEach((t) => {
  t.context.client = new Redis({ keyPrefix: randomUUID() });
});

test.afterEach.always((t) => {
  t.context.client.disconnect();
});

//
// A dispute event without its transaction is the cheapest observable
// processing: it fails right away with "Disputed transaction ID missing",
// which the endpoint logs as fatal.
//
function createContext(t, { id, signature = 'valid' }) {
  const fatal = [];
  return {
    fatal,
    client: t.context.client,
    request: {
      headers: { 'paypal-transmission-sig': signature },
      body: {
        id,
        event_type: 'CUSTOMER.DISPUTE.CREATED',
        resource: { dispute_id: 'D-1' }
      }
    },
    logger: {
      fatal(err) {
        fatal.push(err);
      },
      error() {},
      warn() {},
      info() {},
      debug() {}
    },
    translateError: (key) => Boom.badRequest(key)
  };
}

function processed(ctx) {
  return ctx.fatal.some(
    (err) => err && err.message === 'Disputed transaction ID missing'
  );
}

test('a verified event is reserved, acknowledged and processed once', async (t) => {
  const id = `WH-${randomUUID()}`;

  const first = createContext(t, { id });
  await webhook(first);
  t.deepEqual(first.body, { received: true });
  t.truthy(await t.context.client.get(getPayPalWebhookEventKey(id)));
  await pWaitFor(() => processed(first), { timeout: ms('10s') });

  // the same event again: acknowledged, so PayPal stops retrying, but not
  // processed a second time
  const replay = createContext(t, { id });
  await webhook(replay);
  t.deepEqual(replay.body, { received: true });
  await new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
  t.false(processed(replay));
  t.is(first.fatal.length, 1);
});

test('an event whose signature does not verify is rejected before anything else', async (t) => {
  const id = `WH-${randomUUID()}`;

  const forged = createContext(t, { id, signature: 'forged' });
  const err = await t.throwsAsync(webhook(forged));
  t.true(err.isBoom);
  t.is(err.output.statusCode, 400);
  t.is(forged.body, undefined);
  // nothing was reserved: the genuine delivery of the event still goes
  // through
  t.is(await t.context.client.get(getPayPalWebhookEventKey(id)), null);
  await new Promise((resolve) => {
    setTimeout(resolve, 300);
  });
  t.false(processed(forged));

  const genuine = createContext(t, { id });
  await webhook(genuine);
  t.deepEqual(genuine.body, { received: true });
  await pWaitFor(() => processed(genuine), { timeout: ms('10s') });
});

test('an event without an ID is rejected', async (t) => {
  const ctx = createContext(t, { id: undefined });
  const err = await t.throwsAsync(webhook(ctx));
  t.is(err.output.statusCode, 400);
  t.is(ctx.body, undefined);
});
