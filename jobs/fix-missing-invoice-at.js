/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const pMapSeries = require('p-map-series');
const mongoose = require('mongoose');
const _ = require('#helpers/lodash');

const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Payments } = require('#models');
const { paypalAgent } = require('#helpers/paypal');
const config = require('#config');
const stripe = require('#helpers/stripe');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

// TODO: all this could probably go into pre('save') or post('save') hook of Payment too

async function mapper(id) {
  let payment;
  let invoiceAt;
  try {
    payment = await Payments.findById(id);
    if (!payment) throw new Error('Payment does not exist');
    logger.info(`reviewing payment #${payment.reference}`);
    if (!_.isDate(payment.created_at) || !_.isDate(payment.updated_at)) {
      const clone = payment.toObject();
      await payment.remove();
      clone.stack = clone.stack || new Error('stack').stack;
      payment = await Payments.create(clone);
    }

    // we are typically guaranteed to have one of the following
    // - stripe_payment_intent_id
    // - stripe_session_id
    // - paypal_order_id
    // - paypal_subscription_id
    if (payment.stripe_payment_intent_id) {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        payment.stripe_payment_intent_id
      );
      if (!paymentIntent) throw new Error('Payment intent did not exist');
      invoiceAt = dayjs.unix(paymentIntent.created).toDate();
    } else if (payment.stripe_session_id) {
      const session = await stripe.checkout.sessions.retrieve(
        payment.stripe_session_id
      );
      if (!session) throw new Error('Session did not exist');
      if (session.payment_intent) {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent
        );
        if (!paymentIntent) throw new Error('Payment intent did not exist');
        payment.stripe_payment_intent_id = session.payment_intent;
        await payment.save();
        invoiceAt = dayjs.unix(paymentIntent.created).toDate();
      } else if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription
        );

        if (!subscription) throw new Error('Subscription did not exist');

        const invoices = await stripe.invoices.list({
          limit: 100, // it'd be impossible for a customer to hit this (at least right now)
          customer: session.customer,
          subscription: session.subscription
        });

        if (invoices.has_more) throw new Error('Has more was hit');

        invoices.data = _.sortBy(invoices.data, 'created');

        if (!invoices?.data?.[0]?.payment_intent)
          throw new Error('Subscription did not have a first invoice');

        const paymentIntent = await stripe.paymentIntents.retrieve(
          invoices.data[0].payment_intent
        );

        if (!paymentIntent) throw new Error('Payment intent did not exist');

        payment.stripe_invoice_id = invoices.data[0].id;
        payment.stripe_payment_intent_id = invoices.data[0].payment_intent;
        await payment.save();

        invoiceAt = dayjs.unix(paymentIntent.created).toDate();
      } else {
        const err = new Error('Unknown session information');
        err.session = session;
        throw err;
      }
    } else if (payment.paypal_order_id) {
      const agent = await paypalAgent();
      const { body } = await agent.get(
        `/v2/checkout/orders/${payment.paypal_order_id}`
      );
      if (
        !_.isObject(body) ||
        body.intent !== 'CAPTURE' ||
        !_.isArray(body.purchase_units) ||
        _.isEmpty(body.purchase_units) ||
        !_.isObject(body.payer)
      ) {
        const err = new Error('Invalid PayPal order');
        err.body = JSON.stringify(body, null, 2);
        throw err;
      }

      if (body.create_time) {
        // keeping this here since we passed along the bug to PYPL
        invoiceAt = new Date(body.create_time);
      } else if (
        body?.purchase_units?.[0]?.payments?.captures?.[0]?.create_time
      ) {
        invoiceAt = new Date(
          body.purchase_units[0].payments.captures[0].create_time
        );
      } else {
        const err = new Error('/v2/checkout/orders did not return create_time');
        err.body = JSON.stringify(body, null, 2);
        throw err;
      }
    } else if (payment.paypal_subscription_id) {
      const agent = await paypalAgent();
      const { body } = await agent.get(
        `/v1/billing/subscriptions/${payment.paypal_subscription_id}`
      );
      if (
        !_.isObject(body) ||
        !isSANB(body.id) ||
        !isSANB(body.plan_id) ||
        !_.isObject(body.subscriber) ||
        !isSANB(body.subscriber.payer_id) ||
        !_.isObject(body.billing_info) ||
        !_.isObject(body.billing_info.last_payment) ||
        !_.isObject(body.billing_info.last_payment.amount) ||
        !isSANB(body.billing_info.last_payment.amount.value)
      ) {
        const err = new Error('Invalid PayPal subscription');
        err.body = JSON.stringify(body, null, 2);
        throw err;
      }

      // NOTE: this should actually be body.start_time
      if (!body.create_time) {
        const err = new Error('Body create time missing');
        err.body = JSON.stringify(body, null, 2);
        throw err;
      }

      // TODO: note there is a bug here in that it's going to set
      //       it to the start date of the subscription for _all_ payments
      // invoiceAt = new Date(body.create_time);
      throw new Error('This script needs to utilize transactions API');
    } else {
      invoiceAt = new Date(payment.created_at);
    }

    if (!_.isDate(invoiceAt)) throw new Error('Invoice at was not a date');

    if (Math.abs(dayjs(payment.created_at).diff(invoiceAt, 'd')) > 1)
      logger.info(
        `setting payment on ${dayjs(payment.created_at).format(
          'M/D/YY h:mm A'
        )} with invoice date of ${dayjs(invoiceAt).format('M/D/YY h:mm A')}`,
        { payment }
      );

    // set determined invoice_at value
    payment.invoice_at = invoiceAt;

    // set closest duration value
    const [closest] = config.validDurations.sort(
      (a, b) => Math.abs(payment.duration - a) - Math.abs(payment.duration - b)
    );

    payment.duration = closest;

    await payment.save();
  } catch (err) {
    console.error(err, { payment });
  }
}

(async () => {
  await setupMongoose(logger);
  try {
    const ids = await Payments.distinct('_id', {
      // invoice_at: {
      //   $exists: false
      // }
    });

    // run serially to prevent API rate limiting
    await pMapSeries(ids, mapper);
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
