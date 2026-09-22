/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

function getCurrencyFractionDigits(currency, locale) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).resolvedOptions().maximumFractionDigits;
}

function formatCurrencyAmount(amount, currency, locale = 'en-US') {
  const fractionDigits = getCurrencyFractionDigits(currency, locale);

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount / 10 ** fractionDigits);
}

function getPaymentAmountDetails(payment, refunded = false) {
  const currency =
    typeof payment?.currency === 'string' &&
    payment.currency.toLowerCase() !== 'usd'
      ? payment.currency.toUpperCase()
      : 'USD';
  const currencyAmountKey = refunded
    ? 'currency_amount_refunded'
    : 'currency_amount';
  const amountKey = refunded ? 'amount_refunded' : 'amount';

  if (currency !== 'USD' && Number.isFinite(payment?.[currencyAmountKey])) {
    return {
      amount: payment[currencyAmountKey],
      currency
    };
  }

  return {
    amount: Number.isFinite(payment?.[amountKey]) ? payment[amountKey] : 0,
    currency: 'USD'
  };
}

function getPaymentCurrency(payment) {
  return getPaymentAmountDetails(payment).currency;
}

function formatPaymentAmount(payment, locale = 'en-US', refunded = false) {
  const { amount, currency } = getPaymentAmountDetails(payment, refunded);
  return formatCurrencyAmount(amount, currency, locale);
}

function getPaymentNetAmount(payment) {
  const amount = Number.isFinite(payment?.amount) ? payment.amount : 0;
  const refundedAmount = Number.isFinite(payment?.amount_refunded)
    ? payment.amount_refunded
    : 0;

  return refundedAmount > 0 && refundedAmount <= amount
    ? amount - refundedAmount
    : amount;
}

function formatPaymentNetAmount(payment, locale = 'en-US') {
  const { amount, currency } = getPaymentAmountDetails(payment);
  const { amount: refundedAmount, currency: refundedCurrency } =
    getPaymentAmountDetails(payment, true);
  const netAmount =
    refundedCurrency === currency &&
    refundedAmount > 0 &&
    refundedAmount <= amount
      ? amount - refundedAmount
      : amount;

  return formatCurrencyAmount(netAmount, currency, locale);
}

module.exports = {
  formatCurrencyAmount,
  formatPaymentAmount,
  formatPaymentNetAmount,
  getPaymentAmountDetails,
  getPaymentNetAmount,
  getPaymentCurrency
};
