/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const NON_CHARGE_PAYMENT_METHODS = new Set([
  'free_beta_program',
  'plan_conversion'
]);

function isChargePayment(payment) {
  return (
    payment &&
    !NON_CHARGE_PAYMENT_METHODS.has(payment.method) &&
    Number.isFinite(payment.amount) &&
    payment.amount > 0
  );
}

function isPaymentRefunded(payment) {
  return (
    isChargePayment(payment) &&
    Number.isFinite(payment.amount_refunded) &&
    payment.amount_refunded > 0
  );
}

function isPaymentFullyRefunded(payment) {
  return (
    isPaymentRefunded(payment) && payment.amount_refunded >= payment.amount
  );
}

function canRefundPayment(payment) {
  return (
    isChargePayment(payment) &&
    !isPaymentRefunded(payment) &&
    !payment.is_legacy_paypal &&
    (Boolean(payment.stripe_payment_intent_id) ||
      Boolean(payment.paypal_transaction_id))
  );
}

module.exports = {
  canRefundPayment,
  isChargePayment,
  isPaymentFullyRefunded,
  isPaymentRefunded
};
