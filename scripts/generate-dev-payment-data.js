/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const falso = require('@ngneat/falso');
const mongoose = require('mongoose');
const dayjs = require('dayjs-with-plugins');
const ms = require('ms');

const { Payments, Users } = require('#models');
const setupMongoose = require('#helpers/setup-mongoose');

const PAYMENT_COUNT = 100;

// Valid durations (matching config/index.js)
const VALID_DURATIONS = [
  ms('30d'), // 1 mo
  ms('60d'), // 2 mo
  ms('90d'), // 3 mo
  ms('180d'), // 6 mo
  ms('1y'),
  ms('2y'),
  ms('3y')
];

const PLANS = ['enhanced_protection', 'team'];
const PAYMENT_KINDS = ['one-time', 'subscription'];
const CURRENCIES = ['usd', 'eur', 'gbp', 'cad', 'aud'];

// Valid payment methods from Payment model enum
const PAYMENT_METHODS = [
  'card',
  'paypal',
  'visa',
  'mastercard',
  'amex',
  'discover',
  'klarna',
  'afterpay_clearpay',
  'amazon_pay',
  'cashapp',
  'ideal',
  'sofort',
  'sepa_debit',
  'us_bank_account',
  'link',
  'free_beta_program'
];

const graceful = new Graceful({
  mongooses: [mongoose]
});

graceful.listen();

const getRandomAmount = () => {
  // Generate realistic payment amounts in cents
  const amounts = [
    999, // $9.99
    1999, // $19.99
    2999, // $29.99
    4999, // $49.99
    9999, // $99.99
    19999, // $199.99
    29999, // $299.99
    49999, // $499.99
    99999 // $999.99
  ];
  return amounts[Math.floor(Math.random() * amounts.length)];
};

const generateStripePaymentIntentId = () => {
  return `pi_${falso.randAlphaNumeric({ length: 24 }).join('')}`;
};

const generatePaypalTransactionId = () => {
  const randAlphaNum = falso.randAlphaNumeric({ length: 17 });
  return `${randAlphaNum.join('').toUpperCase()}`;
};

const createFakePayment = async () => {
  // Get a random existing user or create one
  let users = await Users.find().limit(10).lean();
  if (users.length === 0) {
    console.log('No users found, creating a new user for payment...');
    const user = await Users.create({
      email: falso.randEmail(),
      password: falso.randPassword()
    });
    users = [user];
  }

  const user = users[Math.floor(Math.random() * users.length)];
  const amount = getRandomAmount();
  const currency = CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)];
  const plan = PLANS[Math.floor(Math.random() * PLANS.length)];
  const kind = PAYMENT_KINDS[Math.floor(Math.random() * PAYMENT_KINDS.length)];
  const duration =
    VALID_DURATIONS[Math.floor(Math.random() * VALID_DURATIONS.length)];
  const method =
    PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)];

  // Generate realistic dates
  const invoiceAt = falso.randPastDate({ years: 2 });
  const createdAt = dayjs(invoiceAt)
    .add(falso.randNumber({ min: 0, max: 60 }), 'minutes')
    .toDate();

  // Some payments might be refunded
  const isRefunded =
    falso.randBoolean() && falso.randNumber({ min: 1, max: 100 }) <= 15; // 15% chance
  const amountRefunded = isRefunded
    ? falso.randNumber({ min: 0, max: amount })
    : 0;

  // Generate payment provider IDs based on method
  let stripePaymentIntentId = null;
  let paypalTransactionId = null;

  if (method === 'paypal') {
    paypalTransactionId = generatePaypalTransactionId();
  } else if (
    !['free_beta_program', 'plan_conversion', 'unknown'].includes(method)
  ) {
    stripePaymentIntentId = generateStripePaymentIntentId();
  }

  // Generate card details for card payments
  let last4 = null;
  let expMonth = null;
  let expYear = null;

  if (['card', 'visa', 'mastercard', 'amex', 'discover'].includes(method)) {
    const cc = falso.randCreditCard();
    console.log({ cc });
    last4 = cc.number.slice(-4);

    const { untilEnd } = cc;
    const [month, year] = untilEnd.split('/');
    expMonth = month;
    expYear = year;
  }

  const paymentData = {
    user: user._id,
    amount,
    currency,
    plan,
    kind,
    duration,
    method,
    invoice_at: invoiceAt,
    created_at: createdAt,
    updated_at: createdAt,
    amount_refunded: amountRefunded,
    stripe_payment_intent_id: stripePaymentIntentId,
    paypal_transaction_id: paypalTransactionId,
    last4,
    exp_month: expMonth,
    exp_year: expYear,
    is_apple_pay: false, // Not using apple_pay method in test data
    is_google_pay: false, // Not using google_pay method in test data
    receipt_sent_at: falso.randBoolean()
      ? dayjs(createdAt)
          .add(falso.randNumber({ min: 1, max: 30 }), 'minutes')
          .toDate()
      : null,
    refund_receipt_sent_at:
      isRefunded && falso.randBoolean()
        ? dayjs(createdAt)
            .add(falso.randNumber({ min: 1, max: 24 }), 'hours')
            .toDate()
        : null
  };

  console.log(
    `Creating payment for user ${user.email}: $${(amount / 100).toFixed(
      2
    )} ${currency.toUpperCase()} (${method})`
  );

  try {
    await Payments.create(paymentData);
  } catch (err) {
    // Handle duplicate reference errors by retrying
    if (err.code === 11000 || err.message.includes('reference')) {
      console.log('Duplicate reference detected, retrying...');
      await createFakePayment();
    } else {
      throw err;
    }
  }
};

(async () => {
  try {
    await setupMongoose();

    console.log(`Generating ${PAYMENT_COUNT} fake payments...`);

    for (let count = 0; count < PAYMENT_COUNT; count++) {
      // eslint-disable-next-line no-await-in-loop
      await createFakePayment();
    }

    console.log(`Successfully generated ${PAYMENT_COUNT} fake payments!`);
    process.exit(0);
  } catch (err) {
    console.error('Error generating payment data:', err);
    process.exit(1);
  }
})();
