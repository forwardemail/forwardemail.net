/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const {
  formatPaymentAmount,
  formatPaymentNetAmount,
  getPaymentNetAmount,
  getPaymentCurrency
} = require('#helpers/format-payment-amount');
const {
  canRefundPayment,
  isPaymentFullyRefunded,
  isPaymentRefunded
} = require('#helpers/payment-refund-status');

test('formats payment amounts in the customer currency and its minor unit', (t) => {
  t.is(
    formatPaymentAmount({ currency: 'eur', currency_amount: 1999 }),
    '€19.99'
  );
  t.is(
    formatPaymentAmount({ currency: 'jpy', currency_amount: 5000 }),
    '¥5,000'
  );
  t.is(formatPaymentAmount({ amount: 1999 }), '$19.99');
  t.is(
    formatPaymentAmount({ currency: 'USD', amount: 1999, currency_amount: 1 }),
    '$19.99'
  );
  t.is(getPaymentCurrency({ currency: 'jpy', currency_amount: 5000 }), 'JPY');
});

test('formats foreign-currency refunds only from matching stored amounts', (t) => {
  const payment = {
    amount: 2100,
    amount_refunded: 1050,
    currency: 'eur',
    currency_amount: 1999,
    currency_amount_refunded: 999
  };

  t.is(formatPaymentAmount(payment), '€19.99');
  t.is(formatPaymentAmount(payment, 'en-US', true), '€9.99');
  t.is(formatPaymentNetAmount(payment), '€10.00');
  t.is(getPaymentNetAmount(payment), 1050);
});

test('does not mislabel credit records as refunded payments', (t) => {
  const credit = {
    amount: 0,
    amount_refunded: 0,
    method: 'free_beta_program'
  };
  const refundedPayment = {
    amount: 2000,
    amount_refunded: 2000,
    method: 'visa'
  };

  t.false(isPaymentRefunded(credit));
  t.false(isPaymentFullyRefunded(credit));
  t.false(canRefundPayment(credit));
  t.true(isPaymentRefunded(refundedPayment));
  t.true(isPaymentFullyRefunded(refundedPayment));
  t.false(canRefundPayment(refundedPayment));
});
