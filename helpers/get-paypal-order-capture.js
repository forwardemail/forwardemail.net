/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const ms = require('ms');

const config = require('#config');
const { paypalAgent } = require('#helpers/paypal');

const { PAYPAL_MAPPING } = config.payments;

//
// The amount in US dollars an order charges, if it is one of the plan's
// prices (as orders are created, see create-domain-billing.js). An order can
// also be created or changed in the browser, e.g. with a discount or in
// another currency, so the price of its item is not what was paid for it.
//
function getPayPalOrderAmount(order, plan) {
  const amount = order?.purchase_units?.[0]?.amount;
  const value = Number(amount?.value);
  if (
    amount?.currency_code === 'USD' &&
    Object.hasOwn(PAYPAL_MAPPING, plan) &&
    Object.values(PAYPAL_MAPPING[plan]).includes(value)
  )
    return value;
}

//
// An order is only credited if it was made here (create-domain-billing.js),
// for the account that redeems it and to the payee it was made for.  The
// browser has the client ID orders are made with, so it can make one of its
// own, or change one made here, e.g. to pay another PayPal account.  (An
// order is approved within hours of being made, or expires.)
//
const ISSUED_TTL = ms('7d');

async function issuePayPalOrder(client, order, userId) {
  await client.set(
    `paypal_order:${order.id}`,
    JSON.stringify({
      user: userId,
      payee: order.purchase_units?.[0]?.payee?.merchant_id
    }),
    'PX',
    ISSUED_TTL
  );
}

async function isIssuedPayPalOrder(client, order, userId) {
  const value = await client.get(`paypal_order:${order?.id}`);
  if (!value) return false;
  const issued = JSON.parse(value);
  return (
    issued.user === userId &&
    // (as PayPal named the payee when the order was made)
    (!issued.payee ||
      issued.payee === order.purchase_units?.[0]?.payee?.merchant_id)
  );
}

//
// A capture is PENDING while PayPal holds the funds (e.g. an eCheck or a
// payment review); the payer was charged, so it is credited as before.
// Any other status (DECLINED, FAILED, ...) means the order was not paid.
//
const PAID_CAPTURE_STATUSES = new Set(['COMPLETED', 'PENDING']);

function getCompletedCapture(order, amount, payee) {
  if (!order || typeof order !== 'object' || order.status !== 'COMPLETED')
    return;
  const unit = order.purchase_units?.[0];
  const capture = unit?.payments?.captures?.[0];
  if (
    capture &&
    PAID_CAPTURE_STATUSES.has(capture.status) &&
    isSANB(capture.id) &&
    capture.amount?.currency_code === 'USD' &&
    Number(capture.amount.value) === amount &&
    (!payee || unit.payee?.merchant_id === payee)
  )
    return capture;
}

//
// Returns the capture of a completed PayPal order (completed or pending),
// or `undefined` if the order was not paid (e.g. the capture was declined with a 422),
// or not paid `amount` US dollars (see `getPayPalOrderAmount`) to `payee`
// (the merchant ID the order named when it was looked up, if it named one:
// an order can be changed until it is captured).
//
// `order` is the response body of the capture request when it succeeded.
// Otherwise (or when that does not say enough) the order is looked up again,
// since both the redirect and the webhook capture it and the second capture
// fails with ORDER_ALREADY_CAPTURED even though the order was paid.
//
async function getPayPalOrderCapture(orderId, order, amount, payee) {
  const capture = getCompletedCapture(order, amount, payee);
  if (capture) return capture;
  if (!isSANB(orderId)) return;
  const agent = await paypalAgent();
  const { body } = await agent.get(
    `/v2/checkout/orders/${encodeURIComponent(orderId)}`
  );
  if (body?.id !== orderId) return;
  return getCompletedCapture(body, amount, payee);
}

module.exports = getPayPalOrderCapture;
module.exports.getPayPalOrderAmount = getPayPalOrderAmount;
module.exports.issuePayPalOrder = issuePayPalOrder;
module.exports.isIssuedPayPalOrder = isIssuedPayPalOrder;
