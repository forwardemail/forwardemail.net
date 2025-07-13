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

const { Inquiries, Users, Payments } = require('#models');
const setupMongoose = require('#helpers/setup-mongoose');

const INQUIRY_COUNT = 50;
const PAYMENT_COUNT = 25;

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
const PAYMENT_METHODS = [
  'card',
  'paypal',
  'visa',
  'mastercard',
  'amex',
  'discover'
];

const graceful = new Graceful({
  mongooses: [mongoose]
});

graceful.listen();

const createFakeInquiry = async () => {
  const randomEmail = falso.randEmail();
  const randomPassword = falso.randPassword();
  const randomUsername = falso.randUserName();

  console.log(`Generating user with email: ${randomEmail}`);

  const user = await Users.create({
    email: randomEmail,
    password: randomPassword
  });

  await Inquiries.create({
    user: user.id,
    message: `Hey this is ${randomUsername}, \n I am looking for some help! Thanks in advance.`
  });

  return user;
};

const createFakePayment = async (user) => {
  const amount = falso.rand([999, 1999, 2999, 4999, 9999, 19999, 29999]);
  const currency = falso.rand(CURRENCIES);
  const plan = falso.rand(PLANS);
  const kind = falso.rand(PAYMENT_KINDS);
  const duration = falso.rand(VALID_DURATIONS);
  const method = falso.rand(PAYMENT_METHODS);

  const invoiceAt = falso.randPastDate({ years: 1 });
  const createdAt = dayjs(invoiceAt)
    .add(falso.randNumber({ min: 0, max: 60 }), 'minutes')
    .toDate();

  const isRefunded =
    falso.randBoolean() && falso.randNumber({ min: 1, max: 100 }) <= 10;
  const amountRefunded = isRefunded
    ? falso.randNumber({ min: 0, max: amount })
    : 0;

  let stripePaymentIntentId = null;
  let paypalTransactionId = null;

  if (method === 'paypal') {
    paypalTransactionId = `${falso
      .randAlphaNumeric({ length: 17 })
      .toUpperCase()}`;
  } else {
    stripePaymentIntentId = `pi_${falso.randAlphaNumeric({ length: 24 })}`;
  }

  let last4 = null;
  let expMonth = null;
  let expYear = null;

  if (['card', 'visa', 'mastercard', 'amex', 'discover'].includes(method)) {
    last4 = falso.randCreditCard().slice(-4);
    expMonth = falso.randNumber({ min: 1, max: 12 });
    expYear = falso.randNumber({ min: 2024, max: 2030 });
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
    receipt_sent_at: falso.randBoolean()
      ? dayjs(createdAt)
          .add(falso.randNumber({ min: 1, max: 30 }), 'minutes')
          .toDate()
      : null
  };

  try {
    await Payments.create(paymentData);
    console.log(
      `Created payment for ${user.email}: $${(amount / 100).toFixed(
        2
      )} ${currency.toUpperCase()}`
    );
  } catch (err) {
    if (err.code === 11000 || err.message.includes('reference')) {
      console.log('Duplicate reference detected, skipping payment...');
    } else {
      throw err;
    }
  }
};

(async () => {
  await setupMongoose();

  console.log(
    `Generating ${INQUIRY_COUNT} inquiries and ${PAYMENT_COUNT} payments...`
  );

  const users = [];

  for (let count = 0; count <= INQUIRY_COUNT; count++) {
    await createFakeInquiry();
  }

  // Create payments for some of the users
  for (let count = 0; count < PAYMENT_COUNT; count++) {
    const user = falso.rand(users);

    await createFakePayment(user);
  }

  console.log('Completed generating dev data!');
  process.exit(0);
})();
