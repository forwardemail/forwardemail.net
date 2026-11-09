/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A refund or reversal of a captured PayPal order payment comes as a refund
// whose "up" link is the capture: the webhook finds the payment by it and
// syncs the payment from PayPal. The reversal event was matched with a
// misspelled name, and only links on api.paypal.com were matched.
//

const ms = require('ms');
const test = require('ava');

// (the payments synced are recorded instead of fetched from PayPal; first,
// so that the controller loaded below gets this one)
const synced = [];
const syncPath = require.resolve(
  '#helpers/sync-paypal-order-payment-by-payment-id'
);
require.cache[syncPath] = {
  id: syncPath,
  filename: syncPath,
  loaded: true,
  async exports(id) {
    synced.push(id.toString());
  }
};

const utils = require('../utils');

const { processEvent } = require('#controllers/api/v1/paypal');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

const logger = { error() {}, warn() {}, info() {}, debug() {}, fatal() {} };

async function createPayment(t, captureId) {
  const user = await t.context.userFactory.create();
  return t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: new Date(),
      method: 'paypal',
      duration: ms('30d'),
      plan: 'enhanced_protection',
      kind: 'one-time',
      paypal_order_id: `ORDER-${captureId}`,
      paypal_transaction_id: captureId
    })
    .create();
}

function refundEvent(eventType, captureId, host) {
  return {
    logger,
    request: {
      body: {
        id: `WH-${captureId}`,
        event_type: eventType,
        resource_type: 'refund',
        resource: {
          id: `REFUND-${captureId}`,
          status: 'COMPLETED',
          links: [
            {
              rel: 'self',
              method: 'GET',
              href: `https://${host}/v2/payments/refunds/REFUND-${captureId}`
            },
            {
              rel: 'up',
              method: 'GET',
              href: `https://${host}/v2/payments/captures/${captureId}`
            }
          ]
        }
      }
    }
  };
}

test('a reversed capture syncs its payment', async (t) => {
  const payment = await createPayment(t, 'CAPTURE-REVERSED');
  await processEvent(
    refundEvent(
      'PAYMENT.CAPTURE.REVERSED',
      'CAPTURE-REVERSED',
      'api.paypal.com'
    )
  );
  t.true(synced.includes(payment.id));
});

test('a refund linked on api-m.paypal.com syncs its payment', async (t) => {
  const payment = await createPayment(t, 'CAPTURE-API-M');
  await processEvent(
    refundEvent('PAYMENT.CAPTURE.REFUNDED', 'CAPTURE-API-M', 'api-m.paypal.com')
  );
  t.true(synced.includes(payment.id));
});
