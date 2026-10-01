/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');

const { paypalAgent } = require('#helpers/paypal');

//
// A capture is PENDING while PayPal holds the funds (e.g. an eCheck or a
// payment review); the payer was charged, so it is credited as before.
// Any other status (DECLINED, FAILED, ...) means the order was not paid.
//
const PAID_CAPTURE_STATUSES = new Set(['COMPLETED', 'PENDING']);

function getCompletedCapture(order) {
  if (!order || typeof order !== 'object' || order.status !== 'COMPLETED')
    return;
  const capture = order?.purchase_units?.[0]?.payments?.captures?.[0];
  if (
    capture &&
    PAID_CAPTURE_STATUSES.has(capture.status) &&
    isSANB(capture.id)
  )
    return capture;
}

//
// Returns the capture of a completed PayPal order (completed or pending),
// or `undefined` if the order was not paid (e.g. the capture was declined with a 422).
//
// `order` is the response body of the capture request when it succeeded.
// Otherwise the order is looked up again, since both the redirect and the
// webhook capture it and the second capture fails with
// ORDER_ALREADY_CAPTURED even though the order was paid.
//
async function getPayPalOrderCapture(orderId, order) {
  const capture = getCompletedCapture(order);
  if (capture) return capture;
  if (!isSANB(orderId)) return;
  const agent = await paypalAgent();
  const { body } = await agent.get(
    `/v2/checkout/orders/${encodeURIComponent(orderId)}`
  );
  if (body?.id !== orderId) return;
  return getCompletedCapture(body);
}

module.exports = getPayPalOrderCapture;
